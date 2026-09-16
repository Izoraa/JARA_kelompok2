<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
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
