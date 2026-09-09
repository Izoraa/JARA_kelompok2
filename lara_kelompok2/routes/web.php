<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectMemberController;

Route::inertia('/', 'welcome')->name('home');

// Route Fitur Project & Anggota (SRS-05)
Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
Route::post('/projects/{project}/members', [ProjectMemberController::class, 'store'])->name('projects.members.store');
