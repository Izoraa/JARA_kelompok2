<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;

class ProjectMemberController extends Controller
{
    public function store(Request $request, Project $project)
    {
        $request->validate([
            'username' => 'required|string',
        ]);

        // 1. Cek user terdaftar di DB
        $user = User::where('name', $request->username)
                    ->orWhere('email', $request->username)
                    ->first();

        if (! $user) {
            return back()->withErrors(['username' => 'User tidak ditemukan']);
        }

        // 2. Cek apakah sudah jadi anggota atau pemilik
        if ($project->user_id === $user->id || $project->members()->where('user_id', $user->id)->exists()) {
            return back()->withErrors(['username' => 'User sudah menjadi anggota / pemilik project']);
        }

        // 3. Tambahkan ke project
        $project->members()->attach($user->id);

        return back()->with('success', 'Anggota berhasil ditambahkan');
    }
}
