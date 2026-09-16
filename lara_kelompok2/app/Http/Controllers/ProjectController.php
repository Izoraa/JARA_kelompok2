<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
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

    public function store(StoreProjectRequest $request)
    {
        $validated = $request->validated();

        Project::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        return redirect()->back();
    }

    public function show(Project $project)
    {
        // Validasi Otorisasi (SRS-SEC-01): Menolak akses jika pengguna tidak berwenang (HTTP 403 Forbidden)
        Gate::authorize('view', $project);

        $isOwner = $project->user_id === Auth::id();

        $project->load(['user', 'members', 'tasks.assignee']);

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'isOwner' => $isOwner,
        ]);
    }

    public function destroy(Project $project)
    {
        Gate::authorize('delete', $project);

        DB::transaction(function () use ($project) {
            $project->delete();
        });

        return redirect()->route('projects.index')->with('success', 'Project berhasil dihapus');
    }
}