import { API_BASE_URL, getHeaders } from './api.config';

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    // Add other user fields as needed
}

export interface LoginResponse {
    token: string;
    user: User;
    message?: string;
    status: number;
}

export const authService = {
    login: async (username: string, password: string): Promise<LoginResponse> => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ login: username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store session
            if (data.statusCode === 2000 && data.data) {
                const { access_token, user, roles, permissions } = data.data;

                if (access_token) {
                    localStorage.setItem('token', access_token);
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('roles', JSON.stringify(roles));
                    localStorage.setItem('permissions', JSON.stringify(permissions));
                }

                return data;
            }

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logout: async (): Promise<void> => {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: getHeaders()
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    getCurrentUser: (): User | null => {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
                return null;
            }
        }
        return null;
    },

    isAuthenticated: (): boolean => {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem('token');
    }
};
