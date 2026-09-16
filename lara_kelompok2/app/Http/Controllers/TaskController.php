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
            ->with('assignee')
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

    // SRS-TSK-01: Buat Task Baru
    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:Low,Medium,High,low,medium,high',
            'deadline' => 'nullable|date|after_or_equal:today',
        ]);

        Task::create([
            'project_id' => $request->project_id,
            'title' => $request->title,
            'description' => $request->description,
            'priority' => ucfirst(strtolower($request->priority)),
            'deadline' => $request->deadline,
            'is_completed' => false,
            'status' => 'Todo',
        ]);

        return back()->with('success', 'Task berhasil ditambahkan');
    }

    // SRS-TSK-02: Update Priority, Deadline, Title, & Description
    public function update(Request $request, Task $task)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:Low,Medium,High,low,medium,high',
            'deadline' => 'nullable|date',
        ]);

        $task->update([
            'title' => $request->title ?? $task->title,
            'description' => $request->description ?? $task->description,
            'priority' => ucfirst(strtolower($request->priority)),
            'deadline' => $request->deadline,
        ]);

        return back()->with('success', 'Task berhasil diperbarui');
    }

    // SRS-TSK-03: Toggle Status Selesai
    public function toggleComplete(Task $task)
    {
        $task->update([
            'is_completed' => !$task->is_completed,
        ]);

        return back()->with('success', 'Status tugas berhasil diubah');
    }

    // SRS-06A: Assign Task ke Anggota
    public function assign(Request $request, Task $task)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $task->update([
            'assigned_to' => $request->user_id,
        ]);

        return back()->with('success', 'Task berhasil di-assign');
    }

    // SRS-06B: Ubah Status Task
    public function updateStatus(Request $request, Task $task)
    {
        $request->validate([
            'status' => 'required|in:Todo,In Progress,Done',
        ]);

        $task->update([
            'status' => $request->status,
        ]);

        return back()->with('success', 'Status task berhasil diperbarui');
    }

    // Menghapus task
    public function destroy(Task $task)
    {
        if ($task->project->user_id != auth()->id()) {
            abort(403);
        }

        $task->delete();

        return back()->with('success', 'Task berhasil dihapus');
    }
}