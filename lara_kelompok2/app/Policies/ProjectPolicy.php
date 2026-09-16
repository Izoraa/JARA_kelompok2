<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProjectPolicy
{
    /**
     * Determine whether the user can view the project (SRS-SEC-01).
     */
    public function view(User $user, Project $project): bool
    {
        // Admin, Pemilik Project, atau Anggota Project berwenang melihat project
        if ($user->role === 'admin') {
            return true;
        }

        if ($user->id === $project->user_id) {
            return true;
        }

        return $project->members()->where('users.id', $user->id)->exists();
    }

    /**
     * Determine whether the user can add members to the project (SRS-SEC-01).
     */
    public function addMember(User $user, Project $project): bool
    {
        // Hanya Pemilik Project atau Admin yang berwenang menambah anggota
        return $user->role === 'admin' || $user->id === $project->user_id;
    }

    /**
     * Determine whether the user can update the project (SRS-SEC-01).
     */
    public function update(User $user, Project $project): bool
    {
        return $user->role === 'admin' || $user->id === $project->user_id;
    }

    /**
     * Determine whether the user can delete the project (SRS-SEC-01).
     */
    public function delete(User $user, Project $project): bool
    {
        return $user->role === 'admin' || $user->id === $project->user_id;
    }
}
