<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    // Menampilkan semua task dalam sebuah project
    public function index(Project $project)
    {
        if ($project->user_id != auth()->id()) {
            abort(403);
        }

        $tasks = $project->tasks()
            ->latest()
            ->get();

        return Inertia::render('Tasks/Index', [
            'project' => $project,
            'tasks' => $tasks,
        ]);
    }

    // Menambah task
    public function store(Request $request, Project $project)
    {
        if ($project->user_id != auth()->id()) {
            abort(403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'deadline' => 'nullable|date',
        ]);

        $project->tasks()->create([
            'title' => $request->title,
            'description' => $request->description,
            'priority' => $request->priority,
            'deadline' => $request->deadline,
        ]);

        return redirect()->back();
    }

    // Mengubah task
    public function update(Request $request, Task $task)
    {
        if ($task->project->user_id != auth()->id()) {
            abort(403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'deadline' => 'nullable|date',
        ]);

        $task->update([
            'title' => $request->title,
            'description' => $request->description,
            'priority' => $request->priority,
            'deadline' => $request->deadline,
        ]);

        return redirect()->back();
    }

    // Menghapus task
    public function destroy(Task $task)
    {
        if ($task->project->user_id != auth()->id()) {
            abort(403);
        }

        $task->delete();

        return redirect()->back();
    }

    // Mengubah status selesai
    public function complete(Task $task)
    {
        if ($task->project->user_id != auth()->id()) {
            abort(403);
        }

        $task->update([
            'is_completed' => !$task->is_completed,
        ]);

        return redirect()->back();
    }
}