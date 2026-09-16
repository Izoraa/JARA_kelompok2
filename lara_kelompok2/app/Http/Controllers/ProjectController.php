<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        // Ambil project yang dimiliki user atau di mana user menjadi anggota
        $projects = Project::where('user_id', $userId)
            ->orWhereHas('members', function ($query) use ($userId) {
                $query->where('users.id', $userId);
            })
            ->with(['user', 'members'])
            ->withCount([
                'tasks',
                'tasks as completed_tasks_count' => function ($query) {
                    $query->where('is_completed', true);
                },
            ])
            ->latest()
            ->get()
            ->map(function ($proj) use ($userId) {
                $total = $proj->tasks_count;
                $completed = $proj->completed_tasks_count;
                $proj->progress_percentage = $total > 0 ? (int) round(($completed / $total) * 100) : 0;
                $proj->is_owner = ($proj->user_id === $userId);
                return $proj;
            });

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Project::create([
            'user_id' => Auth::id(),
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->back();
    }

    public function show(Project $project)
    {
        $userId = Auth::id();
        $isOwner = $project->user_id === $userId;
        $isMember = $project->members()->where('user_id', $userId)->exists();

        if (! $isOwner && ! $isMember) {
            abort(403, 'Anda tidak memiliki akses ke project ini.');
        }

        $project->load([
            'user',
            'members',
        ]);

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'isOwner' => $isOwner,
        ]);
    }
}