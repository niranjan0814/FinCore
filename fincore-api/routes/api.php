<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\TestController;
use App\Http\Controllers\Api\AuthController;

Route::get('/health', function () {
    return response()->json(['status' => 'API is healthy', 'service' => 'Laravel']);
});


Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);


    // Super Admin Routes
    Route::middleware('is_super_admin')->group(function () {
        Route::post('/admins', [\App\Http\Controllers\Api\AdminController::class, 'store']);
        Route::get('/admins', [\App\Http\Controllers\Api\AdminController::class, 'index']);
        Route::get('/admins/{id}', [\App\Http\Controllers\Api\AdminController::class, 'show']);
        Route::put('/admins/{id}', [\App\Http\Controllers\Api\AdminController::class, 'update']);
        Route::delete('/admins/{id}', [\App\Http\Controllers\Api\AdminController::class, 'destroy']);
    });

    // Admin Routes (only admin role can access)
    Route::middleware('is_admin')->group(function () {
        Route::post('/staffs', [\App\Http\Controllers\Api\StaffController::class, 'store']);
        Route::get('/staffs', [\App\Http\Controllers\Api\StaffController::class, 'index']);
        Route::get('/staffs/{staff_id}', [\App\Http\Controllers\Api\StaffController::class, 'show']);
        Route::put('/staffs/{staff_id}', [\App\Http\Controllers\Api\StaffController::class, 'update']);
        Route::delete('/staffs/{staff_id}', [\App\Http\Controllers\Api\StaffController::class, 'destroy']);
    });

    // Field Officer Routes (only field_officer role can access)
    Route::middleware('is_field_officer')->group(function () {
        Route::post('/customers/import', [\App\Http\Controllers\Api\CustomerController::class, 'import']);
        Route::get('/customers/export', [\App\Http\Controllers\Api\CustomerController::class, 'export']);
        
        Route::post('/customers', [\App\Http\Controllers\Api\CustomerController::class, 'store']);
        Route::get('/customers', [\App\Http\Controllers\Api\CustomerController::class, 'index']);
        Route::get('/customers/{id}', [\App\Http\Controllers\Api\CustomerController::class, 'show']);
        Route::put('/customers/{id}', [\App\Http\Controllers\Api\CustomerController::class, 'update']);
        Route::delete('/customers/{id}', [\App\Http\Controllers\Api\CustomerController::class, 'destroy']);
    });
});
