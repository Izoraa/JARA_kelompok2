<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectMemberController;
use App\Http\Controllers\TaskController;

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

// === Rute Fitur Project & Anggota (SRS-05) ===
Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
Route::post('/projects/{project}/members', [ProjectMemberController::class, 'store'])->name('projects.members.store');

// === Rute Fitur SRS-06 (Assign Task & Ubah Status) ===
Route::patch('/tasks/{task}/assign', [TaskController::class, 'assign'])->name('tasks.assign');
Route::patch('/tasks/{task}/status', [TaskController::class, 'updateStatus'])->name('tasks.update-status');

// === Rute Admin (SRS-07, SRS-08) ===
Route::middleware(['auth', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', [\App\Http\Controllers\AdminUserController::class, 'index'])->name('users.index');
    Route::post('/users', [\App\Http\Controllers\AdminUserController::class, 'store'])->name('users.store');
    Route::delete('/users/{user}', [\App\Http\Controllers\AdminUserController::class, 'destroy'])->name('users.destroy');
});

