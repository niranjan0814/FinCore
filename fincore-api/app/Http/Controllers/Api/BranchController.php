<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Branch;
use Illuminate\Validation\Rule;

class BranchController extends Controller
{
    /**
     * Display a listing of branches with optional filtering.
     */
    public function index(Request $request)
    {
        try {
            $query = Branch::query();

            // Filter by branch_id
            if ($request->has('branch_id')) {
                $query->where('branch_id', $request->branch_id);
            }

            // Filter by branch_name (supports partial match)
            if ($request->has('branch_name')) {
                $query->where('branch_name', 'LIKE', '%' . $request->branch_name . '%');
            }

            $branches = $query->get();

            return response()->json([
                'status' => 'success',
                'data' => $branches
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve branches',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created branch.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'branch_id' => 'required|string|unique:branches,branch_id',
                'branch_name' => 'required|string|max:255',
                'location' => 'nullable|string|max:255',
                'address' => 'nullable|string',
                'staff_ids' => 'nullable|array',
            ]);

            $branch = Branch::create($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Branch created successfully',
                'data' => $branch
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create branch',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified branch.
     */
    public function show($id)
    {
        try {
            $branch = Branch::findOrFail($id);

            return response()->json([
                'status' => 'success',
                'data' => $branch
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Branch not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve branch',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified branch.
     */
    public function update(Request $request, $id)
    {
        try {
            $branch = Branch::findOrFail($id);

            $validated = $request->validate([
                'branch_id' => [
                    'sometimes',
                    'required',
                    'string',
                    Rule::unique('branches', 'branch_id')->ignore($branch->id)
                ],
                'branch_name' => 'sometimes|required|string|max:255',
                'location' => 'nullable|string|max:255',
                'address' => 'nullable|string',
                'staff_ids' => 'nullable|array',
            ]);

            $branch->update($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Branch updated successfully',
                'data' => $branch
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Branch not found'
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update branch',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified branch.
     */
    public function destroy($id)
    {
        try {
            $branch = Branch::findOrFail($id);
            $branch->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Branch deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Branch not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete branch',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
