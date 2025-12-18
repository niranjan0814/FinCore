<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    /**
     * Create a new Customer (Field Officer only).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Product / Location Details (optional)
            'location' => 'nullable|string',
            'product_type' => 'nullable|string',
            'base_product' => 'nullable|string',
            'pcsu_csu_code' => 'nullable|string',
            
            // Customer Personal Details (required)
            'code_type' => 'required|string',
            'customer_code' => 'required|string|unique:customers,customer_code', // This is the NIC
            'gender' => 'required|in:Male,Female,Other',
            'title' => 'required|string',
            'full_name' => 'required|string',
            'initials' => 'required|string',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'date_of_birth' => 'required|date',
            'civil_status' => 'required|in:Single,Married,Divorced,Widowed',
            'religion' => 'required|string',
            'mobile_no_1' => 'required|string',
            'mobile_no_2' => 'nullable|string',
            'ccl_mobile_no' => 'nullable|string',
            'spouse_name' => 'nullable|string',
            'health_info' => 'nullable|json',
            'family_members_count' => 'nullable|integer',
            'customer_profile_image' => 'nullable|string',
            'monthly_income' => 'nullable|numeric',
            
            // Customer Address Details (required)
            'address_type' => 'required|string',
            'address_line_1' => 'required|string',
            'address_line_2' => 'nullable|string',
            'address_line_3' => 'nullable|string',
            'country' => 'required|string',
            'province' => 'required|string',
            'district' => 'required|string',
            'city' => 'required|string',
            'gs_division' => 'required|string',
            'telephone' => 'nullable|string',
            'preferred_address' => 'nullable|boolean',
            
            // Business Details (all optional)
            'ownership_type' => 'nullable|string',
            'register_number' => 'nullable|string',
            'business_name' => 'nullable|string',
            'business_email' => 'nullable|email',
            'business_duration' => 'nullable|string',
            'business_place' => 'nullable|string',
            'handled_by' => 'nullable|string',
            'no_of_employees' => 'nullable|integer',
            'market_reputation' => 'nullable|string',
            'sector' => 'nullable|string',
            'sub_sector' => 'nullable|string',
        ]);

        // Extract gender from Sri Lankan NIC
        $nic = $validated['customer_code'];
        $genderFromNIC = $this->extractGenderFromNIC($nic);
        
        if (!$genderFromNIC) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid Sri Lankan NIC format'
            ], 422);
        }

        // Validate that provided gender matches NIC
        if ($genderFromNIC !== $validated['gender']) {
            return response()->json([
                'status' => 'error',
                'message' => "Gender mismatch. NIC indicates gender is {$genderFromNIC}, but you provided {$validated['gender']}"
            ], 422);
        }

        // Only females can get loans
        if ($genderFromNIC !== 'Female') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only female customers are eligible for loans in this program'
            ], 403);
        }

        try {
            $customer = Customer::create($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Customer created successfully',
                'data' => $customer
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create customer: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Extract gender from Sri Lankan NIC
     * Old format: 9 digits + V (e.g., 856234567V)
     * New format: 12 digits (e.g., 198562345678)
     */
    private function extractGenderFromNIC($nic)
    {
        $nic = strtoupper(trim($nic));
        
        // Old NIC format (9 digits + V)
        if (preg_match('/^(\d{9})V$/', $nic, $matches)) {
            $dayValue = intval(substr($matches[1], 2, 3));
            
            // If day value > 500, it's female
            if ($dayValue > 500) {
                return 'Female';
            } else {
                return 'Male';
            }
        }
        
        // New NIC format (12 digits)
        if (preg_match('/^(\d{12})$/', $nic)) {
            $dayValue = intval(substr($nic, 4, 3));
            
            // If day value > 500, it's female
            if ($dayValue > 500) {
                return 'Female';
            } else {
                return 'Male';
            }
        }
        
        return null; // Invalid format
    }

    /**
     * List all customers.
     */
    public function index()
    {
        $customers = Customer::all();
        return response()->json([
            'status' => 'success',
            'data' => $customers
        ]);
    }

    /**
     * Get a specific customer.
     */
    public function show($id)
    {
        $customer = Customer::findOrFail($id);
        return response()->json([
            'status' => 'success',
            'data' => $customer
        ]);
    }

    /**
     * Update customer details.
     */
    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $validated = $request->validate([
            // All fields are optional in update
            'location' => 'nullable|string',
            'product_type' => 'nullable|string',
            'base_product' => 'nullable|string',
            'pcsu_csu_code' => 'nullable|string',
            'code_type' => 'nullable|string',
            'customer_code' => 'nullable|string|unique:customers,customer_code,' . $id,
            'gender' => 'nullable|in:Male,Female,Other',
            'title' => 'nullable|string',
            'full_name' => 'nullable|string',
            'initials' => 'nullable|string',
            'first_name' => 'nullable|string',
            'last_name' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'civil_status' => 'nullable|in:Single,Married,Divorced,Widowed',
            'religion' => 'nullable|string',
            'mobile_no_1' => 'nullable|string',
            'mobile_no_2' => 'nullable|string',
            'ccl_mobile_no' => 'nullable|string',
            'spouse_name' => 'nullable|string',
            'health_info' => 'nullable|json',
            'family_members_count' => 'nullable|integer',
            'customer_profile_image' => 'nullable|string',
            'monthly_income' => 'nullable|numeric',
            'address_type' => 'nullable|string',
            'address_line_1' => 'nullable|string',
            'address_line_2' => 'nullable|string',
            'address_line_3' => 'nullable|string',
            'country' => 'nullable|string',
            'province' => 'nullable|string',
            'district' => 'nullable|string',
            'city' => 'nullable|string',
            'gs_division' => 'nullable|string',
            'telephone' => 'nullable|string',
            'preferred_address' => 'nullable|boolean',
            'ownership_type' => 'nullable|string',
            'register_number' => 'nullable|string',
            'business_name' => 'nullable|string',
            'business_email' => 'nullable|email',
            'business_duration' => 'nullable|string',
            'business_place' => 'nullable|string',
            'handled_by' => 'nullable|string',
            'no_of_employees' => 'nullable|integer',
            'market_reputation' => 'nullable|string',
            'sector' => 'nullable|string',
            'sub_sector' => 'nullable|string',
        ]);

        try {
            $customer->update($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Customer updated successfully',
                'data' => $customer
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update customer: ' . $e->getMessage()
            ], 500);
        }
    }
}
