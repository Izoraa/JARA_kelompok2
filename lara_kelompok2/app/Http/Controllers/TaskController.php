<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    // Menampilkan semua task dalam sebuah project serta pemantauan progres (SRS-COL-03)
    public function index(Project $project)
    {
        $userId = auth()->id();
        $isOwner = $project->user_id === $userId;
        $isMember = $project->members()->where('user_id', $userId)->exists();

        if (! $isOwner && ! $isMember) {
            abort(403, 'Anda tidak memiliki akses ke project ini.');
        }

        $project->load(['user', 'members']);

        $tasks = $project->tasks()
            ->with('users')
            ->latest()
            ->get();

        // SRS-COL-03: Perhitungan metrik progres penyelesaian seluruh tugas
        $totalTasks = $tasks->count();
        $completedTasks = $tasks->where('is_completed', true)->count();
        $pendingTasks = $totalTasks - $completedTasks;
        $progressPercentage = $totalTasks > 0 ? (int) round(($completedTasks / $totalTasks) * 100) : 0;

        // Daftar seluruh personil project yang dapat ditugaskan (pemilik + seluruh anggota tim)
        $assignableUsers = collect([$project->user])
            ->merge($project->members)
            ->filter()
            ->unique('id')
            ->values();

        return Inertia::render('Tasks/Index', [
            'project' => $project,
            'tasks' => $tasks,
            'progress' => [
                'total' => $totalTasks,
                'completed' => $completedTasks,
                'pending' => $pendingTasks,
                'percentage' => $progressPercentage,
            ],
            'assignableUsers' => $assignableUsers,
            'isOwner' => $isOwner,
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