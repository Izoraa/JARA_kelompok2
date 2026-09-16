<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectMemberController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\TaskController;

Route::inertia('/', 'welcome')->name('home');

// === Rute Autentikasi ===
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

// === Rute Fitur Project & Anggota (SRS-05, SRS-SEC-01) ===
Route::middleware(['auth'])->group(function () {
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
    Route::post('/projects/{project}/members', [ProjectMemberController::class, 'store'])->name('projects.members.store');
});

// === Rute Fitur SRS-06 (Assign Task & Ubah Status) ===
Route::patch('/tasks/{task}/assign', [TaskController::class, 'assign'])->name('tasks.assign');
Route::patch('/tasks/{task}/status', [TaskController::class, 'updateStatus'])->name('tasks.update-status');

// === Rute Admin (SRS-07, SRS-08, SRS-SEC-01) ===
Route::middleware(['auth', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
});

// === Rute Fitur Modul 3 (TSK-01, TSK-02, TSK-03) ===
Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
Route::patch('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
Route::patch('/tasks/{task}/toggle-complete', [TaskController::class, 'toggleComplete'])->name('tasks.toggle-complete');