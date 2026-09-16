<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectMemberController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\CollaborationController;

Route::inertia('/', 'welcome')->name('home');

// === Rute Autentikasi (dari main) ===
Route::get('/register', function () {
    return inertia('Auth/Register');
});
Route::post('/register', [AuthController::class, 'register']);

Route::get('/login', function () {
    return inertia('Auth/Login');
});
Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout']);

Route::get('/dashboard', function () {
    return inertia('Dashboard');
})->middleware('auth');

// === Rute Admin (SRS-07, SRS-08) ===
Route::middleware(['auth', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', [\App\Http\Controllers\AdminUserController::class, 'index'])->name('users.index');
    Route::post('/users', [\App\Http\Controllers\AdminUserController::class, 'store'])->name('users.store');
    Route::delete('/users/{user}', [\App\Http\Controllers\AdminUserController::class, 'destroy'])->name('users.destroy');
});

// =========================
// PROJECT & KOLABORASI (AUTH)
// =========================
Route::middleware('auth')->group(function () {
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
    Route::put('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');

    // Anggota Project (SRS-COL-01)
    Route::post('/projects/{project}/members', [ProjectMemberController::class, 'store'])->name('projects.members.store');

    // =========================
    // TASK & KOLABORASI (SRS-COL-02, SRS-COL-03)
    // =========================
    Route::get('/projects/{project}/tasks', [TaskController::class, 'index'])->name('projects.tasks.index');
    Route::post('/projects/{project}/tasks', [TaskController::class, 'store'])->name('projects.tasks.store');
    Route::put('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
    Route::patch('/tasks/{task}/complete', [TaskController::class, 'complete'])->name('tasks.complete');

    // Penugasan Anggota ke Task (SRS-COL-02)
    Route::post('/tasks/{task}/assign', [CollaborationController::class, 'assignTask'])->name('tasks.assign');
});