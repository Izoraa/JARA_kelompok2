<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::where('user_id', auth()->id())
            ->latest()
            ->get();

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
            'user_id' => auth()->id(),
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->back();
    }

    public function show(Project $project)
    {
        $project->load(['user', 'members']);

        return Inertia::render('Projects/Show', [
            'project' => $project,
        ]);
    }
}
