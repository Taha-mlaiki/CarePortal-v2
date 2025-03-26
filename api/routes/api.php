<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CabinetController;
use App\Http\Middleware\EnsureTokenIsValid;
use App\Http\Middleware\isManager;
use App\Http\Middleware\isPatient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;



// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware([EnsureTokenIsValid::class])->group(function () {

    
    Route::middleware([isManager::class])->group(function(){
        Route::post("/cabinets",[CabinetController::class,"store"]);
    });

    Route::middleware([isPatient::class])->group(function(){
    });
    Route::get("/cabinets",[CabinetController::class,"index"]);


    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});