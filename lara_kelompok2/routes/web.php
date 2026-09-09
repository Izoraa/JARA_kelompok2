<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;



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