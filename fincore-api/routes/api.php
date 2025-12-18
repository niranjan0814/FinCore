<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\TestController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\CenterController;

Route::get('/health', function () {
    return response()->json(['status' => 'API is healthy', 'service' => 'Laravel']);
});


Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Branch Routes (Authenticated users)
    Route::get('/branches', [BranchController::class, 'index']);         
    Route::post('/branches', [BranchController::class, 'store']);         
    Route::get('/branches/{id}', [BranchController::class, 'show']);     
    Route::put('/branches/{id}', [BranchController::class, 'update']);     
    Route::delete('/branches/{id}', [BranchController::class, 'destroy']);

    // Center Routes (Authenticated users)
    Route::get('/centers', [CenterController::class, 'index']);         
    Route::post('/centers', [CenterController::class, 'store']);         
    Route::get('/centers/{id}', [CenterController::class, 'show']);     
    Route::put('/centers/{id}', [CenterController::class, 'update']);     
    Route::delete('/centers/{id}', [CenterController::class, 'destroy']); 

    // Super Admin Routes
    Route::middleware('is_super_admin')->group(function () {
        Route::post('/admins', [\App\Http\Controllers\Api\AdminController::class, 'store']);
        Route::get('/admins', [\App\Http\Controllers\Api\AdminController::class, 'index']);
        Route::patch('/admins/{id}/toggle-status', [\App\Http\Controllers\Api\AdminController::class, 'toggleStatus']);
    });
});
