<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Group;
use Illuminate\Validation\Rule;

class GroupController extends Controller
{
    /**
     * Display a listing of groups with optional filtering.
     */
    public function index(Request $request)
    {
        try {
            $query = Group::with(['center']);

            // Filter by group_name (supports partial match)
            if ($request->has('group_name')) {
                $query->where('group_name', 'LIKE', '%' . $request->group_name . '%');
            }

            // Filter by center_id
            if ($request->has('center_id')) {
                $query->where('center_id', $request->center_id);
            }

            $groups = $query->get();

            return response()->json([
                'status' => 'success',
                'data' => $groups
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve groups',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created group.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'group_name' => 'required|string|max:255',
                'center_id' => 'required|exists:centers,id',
            ]);

            $group = Group::create($validated);
            $group->load(['center']);

            return response()->json([
                'status' => 'success',
                'message' => 'Group created successfully',
                'data' => $group
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
                'message' => 'Failed to create group',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified group.
     */
    public function show($id)
    {
        try {
            $group = Group::with(['center'])->findOrFail($id);

            return response()->json([
                'status' => 'success',
                'data' => $group
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Group not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve group',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified group.
     */
    public function update(Request $request, $id)
    {
        try {
            $group = Group::findOrFail($id);

            $validated = $request->validate([
                'group_name' => 'sometimes|required|string|max:255',
                'center_id' => 'sometimes|required|exists:centers,id',
            ]);

            $group->update($validated);
            $group->load(['center']);

            return response()->json([
                'status' => 'success',
                'message' => 'Group updated successfully',
                'data' => $group
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Group not found'
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
                'message' => 'Failed to update group',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified group.
     */
    public function destroy($id)
    {
        try {
            $group = Group::findOrFail($id);
            $group->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Group deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Group not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete group',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
