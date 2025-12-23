import { Branch, BranchFormData, ApiResponse } from '../types/branch.types';

const API_Base_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Helper to get cookie value
const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
};

// Helper to get headers with Auth token and CSRF token
const getHeaders = () => {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    const xsrfToken = getCookie('XSRF-TOKEN');

    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(xsrfToken ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) } : {})
    };
};

const fetchOptions = {
    credentials: 'include' as RequestCredentials, // Important for cookies/CSRF
};

export const branchService = {
    // Get all branches
    getBranches: async (): Promise<Branch[]> => {
        const response = await fetch(`${API_Base_URL}/branches`, {
            ...fetchOptions,
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch branches: ${response.statusText}`);
        }

        const json: ApiResponse<Branch[]> = await response.json();
        return json.data;
    },

    // Get single branch
    getBranchById: async (id: number): Promise<Branch> => {
        const response = await fetch(`${API_Base_URL}/branches/${id}`, {
            ...fetchOptions,
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch branch details');
        }

        const json: ApiResponse<Branch> = await response.json();
        return json.data;
    },

    // Create new branch
    createBranch: async (data: BranchFormData): Promise<Branch> => {
        const response = await fetch(`${API_Base_URL}/branches`, {
            method: 'POST',
            ...fetchOptions,
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        const json = await response.json();

        if (!response.ok) {
            // Forward backend validation errors
            if (response.status === 422 || response.status === 409) {
                const errorMessage = json.message || 'Validation failed';
                const error = new Error(errorMessage);
                (error as any).errors = json.errors; // Attach detailed errors
                throw error;
            }
            throw new Error(json.message || 'Failed to create branch');
        }

        return json.data;
    },

    // Update branch
    updateBranch: async (id: number, data: BranchFormData): Promise<Branch> => {
        const response = await fetch(`${API_Base_URL}/branches/${id}`, {
            method: 'PUT',
            ...fetchOptions,
            headers: getHeaders(),
            body: JSON.stringify(data)
        });

        const json = await response.json();

        if (!response.ok) {
            if (response.status === 422 || response.status === 409) {
                const errorMessage = json.message || 'Validation failed';
                const error = new Error(errorMessage);
                (error as any).errors = json.errors;
                throw error;
            }
            throw new Error(json.message || 'Failed to update branch');
        }

        return json.data;
    },

    // Delete branch
    deleteBranch: async (id: number): Promise<void> => {
        const response = await fetch(`${API_Base_URL}/branches/${id}`, {
            method: 'DELETE',
            ...fetchOptions,
            headers: getHeaders()
        });

        if (!response.ok) {
            const json = await response.json().catch(() => ({}));
            throw new Error(json.message || 'Failed to delete branch');
        }
    }
};
