<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // SRS-TSK-01: Buat Task Baru
    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:Low,Medium,High',
            'deadline' => 'nullable|date|after_or_equal:today',
        ]);

        Task::create([
            'project_id' => $request->project_id,
            'title' => $request->title,
            'description' => $request->description,
            'priority' => $request->priority,
            'deadline' => $request->deadline,
            'is_completed' => false,
            'status' => 'Todo',
        ]);

        return back()->with('success', 'Task berhasil ditambahkan');
    }

    // SRS-TSK-02: Update Priority & Deadline
    public function update(Request $request, Task $task)
    {
        $request->validate([
            'priority' => 'required|in:Low,Medium,High',
            'deadline' => 'nullable|date|after_or_equal:today',
        ]);

        $task->update([
            'priority' => $request->priority,
            'deadline' => $request->deadline,
        ]);

        return back()->with('success', 'Priority & deadline berhasil diperbarui');
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
}
