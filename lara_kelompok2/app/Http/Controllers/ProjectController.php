<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function show(Project $project)
    {
        // Load data relasi owner, members, dan tasks beserta assignee-nya
        $project->load(['owner', 'members', 'tasks.assignee']);

        return Inertia::render('Projects/Show', [
            'project' => $project,
        ]);
    }
}
