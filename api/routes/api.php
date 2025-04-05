<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CabinetController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FavoriteController;
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


    Route::middleware([isManager::class])->group(function () {
        Route::get("/manager/cabinet/dates", [CabinetController::class, "getClosing"]);
        Route::post("/manager/cabinet/dates", [CabinetController::class, "setClosing"]);
        Route::get("/manager/cabinet", [CabinetController::class, "managerCabinet"]);
        Route::post("/manager/cabinet", [CabinetController::class, "updateCabinet"]);
        Route::post("/cabinets", [CabinetController::class, "store"]);
        Route::get("/cabinets/statistiques", [CabinetController::class, "getStatistiques"]);
        Route::get("/cabinets/today-closed", [CabinetController::class, "getTodayClosed"]);
        Route::post("/cabinets/today-closed", [CabinetController::class, "setTodayClosed"]);
        Route::get("/cabinets/appointments", [CabinetController::class, "appointments"]);
        Route::post("/cabinets/appointments/{id}/cancel", [AppointmentController::class, "cancelAppointment"]);
        Route::post("/cabinets/appointments/{id}/schedule", [AppointmentController::class, "scheduleAppointment"]);
        Route::post("/cabinets/appointments/{id}/complete", [AppointmentController::class, "completeAppointment"]);
        Route::post("/cabinets/appointments/{id}/archive", [AppointmentController::class, "archiveAppointment"]);
    });

    Route::middleware([isPatient::class])->group(function () {
        // cabinets
        Route::get("/cabinets/{id}/dates", [CabinetController::class, "getunavailableDates"]);
        Route::get("/cabinets", [CabinetController::class, "index"]);
        Route::get("/cabinets/{id}", [CabinetController::class, "show"]);
        //appointments
        Route::post("/appointments", [AppointmentController::class, "store"]);
        Route::get("/appointments", [AppointmentController::class, "show"]);
        Route::put("/appointments/{id}/cancel", [AppointmentController::class, "cancel"]);
        // favorites
        Route::get("/patient/favorites", [FavoriteController::class, "index"]);
        Route::post("/patient/favorites", [FavoriteController::class, "store"]);
        Route::delete("/patient/favorites/{id}", [FavoriteController::class, "deleteById"]);
        Route::delete("/patient/favorites", [FavoriteController::class, "deleteAll"]);
        Route::get("/patient/cabinets/favoritedIds", [FavoriteController::class, "favoritedIds"]);
        //comments
        Route::post('/patient/cabinets/comments', [CommentController::class, 'store']);
        Route::put('/patient/cabinets/comments/{id}', [CommentController::class, 'update']);
        Route::delete('/patient/cabinets/comments/{id}', [CommentController::class, 'destroy']);
        Route::get("/patient/cabinets/commentable", [CommentController::class, "commentable"]);
    });
    
    
    Route::post('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/password', [AuthController::class, 'resetPassword']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
