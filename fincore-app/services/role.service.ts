import { API_BASE_URL, getHeaders } from './api.config';
import { Role } from '../types/staff.types';

export const fetchAllRoles = async (): Promise<Role[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/roles/all`, {
            method: 'GET',
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch roles: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching roles:', error);
        return [];
    }
};
