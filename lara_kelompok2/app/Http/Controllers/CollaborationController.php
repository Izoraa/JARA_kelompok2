<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class CollaborationController extends Controller
{

    public function assignTask(Request $request, Task $task)
    {
        $project = $task->project;

        // Pastikan user memiliki akses ke project (pemilik atau anggota)
        $userId = auth()->id();
        $isOwner = $project->user_id === $userId;
        $isMember = $project->members()->where('user_id', $userId)->exists();

        if (! $isOwner && ! $isMember) {
            abort(403, 'Anda tidak memiliki akses ke tugas ini.');
        }

        $request->validate([
            'users' => 'nullable|array',
            'users.*' => 'integer|exists:users,id',
        ]);

        $assignedUserIds = $request->input('users', []);

        // Pastikan semua user yang di-assign adalah anggota atau pemilik project
        $validUserIds = $project->members()->pluck('users.id')->push($project->user_id)->toArray();

        foreach ($assignedUserIds as $id) {
            if (! in_array($id, $validUserIds)) {
                return back()->withErrors(['users' => 'Satu atau lebih pengguna bukan anggota project ini.']);
            }
        }

        $task->users()->sync($assignedUserIds);

        return back()->with('success', 'Penugasan anggota tugas berhasil diperbarui.');
    }
}