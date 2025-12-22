<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\TestController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\CenterController;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\LoanProductController;
use App\Http\Controllers\Api\InvestmentProductController;

Route::get('/health', function () {
    return response()->json(['status' => 'API is healthy', 'service' => 'Laravel']);
});


Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    

    // Admin-only Branch Routes (Only 'admin' role, NOT super_admin)
    Route::middleware('is_admin')->group(function () {
        Route::post('/branches', [BranchController::class, 'store']);
        // Branch Routes (Authenticated users)
    Route::get('/branches', [BranchController::class, 'index']);         
    Route::get('/branches/{id}', [BranchController::class, 'show']);     
    Route::put('/branches/{id}', [BranchController::class, 'update']);     
    Route::delete('/branches/{id}', [BranchController::class, 'destroy']);

    // Loan Product Routes (Field Officer can create and manage)
        Route::post('/loan-products', [LoanProductController::class, 'store']);
        Route::get('/loan-products', [LoanProductController::class, 'index']);
        Route::get('/loan-products/filter', [LoanProductController::class, 'filter']);
        Route::get('/loan-products/{id}', [LoanProductController::class, 'show']);
        Route::get('/loan-products/customer/{customer_id}', [LoanProductController::class, 'getByCustomerId']);
        Route::put('/loan-products/{id}', [LoanProductController::class, 'update']);
        Route::delete('/loan-products/{id}', [LoanProductController::class, 'destroy']);
        Route::post('/loan-products/import', [LoanProductController::class, 'importCsv']);
        Route::get('/loan-products/export/csv', [LoanProductController::class, 'exportCsv']);
        Route::post('/loan-products/{id}/documents', [LoanProductController::class, 'uploadDocuments']);

        // Investment Product Routes (Field Officer can create and manage)
        Route::post('/investment-products', [InvestmentProductController::class, 'store']);
        Route::get('/investment-products', [InvestmentProductController::class, 'index']);
        Route::get('/investment-products/filter', [InvestmentProductController::class, 'filter']);
        Route::get('/investment-products/{id}', [InvestmentProductController::class, 'show']);
        Route::put('/investment-products/{id}', [InvestmentProductController::class, 'update']);
        Route::delete('/investment-products/{id}', [InvestmentProductController::class, 'destroy']);
    });

    // Center Routes - Read operations (Authenticated users)
    

    // Field Officer Only Routes - Center Creation
    Route::middleware('is_field_officer')->group(function () {
       
        Route::post('/centers', [CenterController::class, 'store']);
        Route::get('/centers', [CenterController::class, 'index']); 
        Route::get('/centers/pending', [CenterController::class, 'pending']);       
        Route::get('/centers/{id}', [CenterController::class, 'show']);     
        Route::put('/centers/{id}', [CenterController::class, 'update']);     
        Route::delete('/centers/{id}', [CenterController::class, 'destroy']);

        // Group Routes
        Route::post('/groups', [GroupController::class, 'store']);
        Route::get('/groups', [GroupController::class, 'index']);
        Route::get('/groups/{id}', [GroupController::class, 'show']);
        Route::put('/groups/{id}', [GroupController::class, 'update']);
        Route::delete('/groups/{id}', [GroupController::class, 'destroy']); 

        
    }); 

    // Manager Routes - Center Approval & Loan Approval
    Route::middleware('is_manager')->group(function () {
        Route::get('/centers/pending', [CenterController::class, 'pending']);
        Route::patch('/centers/{id}/approve', [CenterController::class, 'approve']);
    });
        
    // Route::middleware(['auth', 'role:field_officer,manager'])->group(function () {
    //     Route::get('/centers/pending', [CenterController::class, 'pending']);
    // });


    // Super Admin Routes
    Route::middleware('is_super_admin')->group(function () {
        Route::post('/admins', [\App\Http\Controllers\Api\AdminController::class, 'store']);
        Route::get('/admins', [\App\Http\Controllers\Api\AdminController::class, 'index']);
        Route::put('/admins/{id}', [\App\Http\Controllers\Api\AdminController::class, 'update']);

         Route::get('/loan-products/pending', [LoanProductController::class, 'pending']);
        Route::post('/loan-products/{id}/approve', [LoanProductController::class, 'approve']);
        
        // Loan Product Statistics
        Route::get('/loan-products/stats/pending-count', [LoanProductController::class, 'pendingCount']);
        Route::get('/loan-products/stats/approved-count', [LoanProductController::class, 'approvedCount']);
    });

    // Admin Routes - Second Approval
    Route::middleware('is_admin')->group(function () {
        Route::post('/staffs', [\App\Http\Controllers\Api\StaffController::class, 'store']);
        Route::get('/staffs', [\App\Http\Controllers\Api\StaffController::class, 'index']);
        Route::put('/staffs/{staff_id}', [\App\Http\Controllers\Api\StaffController::class, 'update']);
        
        // Loan Product Second Approval (Admin final approval)
        Route::post('/loan-products/{id}/second-approval', [LoanProductController::class, 'secondApproval']);
       
    });
});
