<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::where('user_id', auth()->id())
            ->orWhereHas('members', function ($query) {
                $query->where('users.id', auth()->id());
            })
            ->latest()
            ->get();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
        ]);
    }

    public function store(StoreProjectRequest $request)
    {
        $validated = $request->validated();

        Project::create([
            'user_id' => auth()->id(),
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        return redirect()->back();
    }

    public function show(Project $project)
    {
        // Validasi Otorisasi (SRS-SEC-01): Menolak akses jika pengguna tidak berwenang (HTTP 403 Forbidden)
        Gate::authorize('view', $project);

        $project->load(['user', 'members', 'tasks.assignee']);

        return Inertia::render('Projects/Show', [
            'project' => $project,
        ]);
    }
}