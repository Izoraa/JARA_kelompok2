<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;



Route::get('/register', function(){

    return inertia('Auth/Register');

});


Route::post('/register',[AuthController::class,'register']);




Route::get('/login', function(){

    return inertia('Auth/Login');

});


Route::post('/login',[AuthController::class,'login']);




Route::post('/logout',[AuthController::class,'logout']);





Route::get('/dashboard', function(){

    return inertia('Dashboard');

})->middleware('auth');


// =========================
// PROJECT
// =========================

Route::middleware('auth')->group(function () {

    Route::get('/projects', [ProjectController::class, 'index']);

    Route::post('/projects', [ProjectController::class, 'store']);

    Route::put('/projects/{project}', [ProjectController::class, 'update']);

    Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);


// =========================
// TASK
// =========================

    Route::get('/projects/{project}/tasks', [TaskController::class, 'index']);

    Route::post('/projects/{project}/tasks', [TaskController::class, 'store']);

    Route::put('/tasks/{task}', [TaskController::class, 'update']);

    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);

    Route::patch('/tasks/{task}/complete', [TaskController::class, 'complete']);

});