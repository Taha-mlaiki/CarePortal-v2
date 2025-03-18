<?php

use App\Http\Controllers\AuthController;
use App\Http\Middleware\EnsureTokenIsValid;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;



// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware([EnsureTokenIsValid::class])->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/admin', function () {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }
        return response()->json(['message' => 'Welcome, Admin!']);
    });
});