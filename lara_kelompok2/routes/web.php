<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectMemberController;

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
