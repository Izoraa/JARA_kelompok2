<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddProjectMemberRequest;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ProjectMemberController extends Controller
{
    public function store(AddProjectMemberRequest $request, Project $project)
    {
        // 1. Validasi Otorisasi (SRS-SEC-01): Memastikan hanya pemilik/admin yang berwenang menambah anggota
        Gate::authorize('addMember', $project);

        $validated = $request->validated();
        $username = $validated['username'];

        // 2. Query Terparameterisasi / Prepared Statement (SRS-SEC-02): Eloquent Query Builder secara otomatis menggunakan binding PDO (?)
        $user = User::where('name', $username)
                    ->orWhere('email', $username)
                    ->first();

        if (! $user) {
            return back()->withErrors(['username' => 'User tidak ditemukan']);
        }

        // 3. Cek apakah sudah jadi anggota atau pemilik
        if ($project->user_id === $user->id || $project->members()->where('users.id', $user->id)->exists()) {
            return back()->withErrors(['username' => 'User sudah menjadi anggota / pemilik project']);
        }

        // 4. Tambahkan ke project
        $project->members()->attach($user->id);

        return back()->with('success', 'Anggota berhasil ditambahkan');
    }
}
