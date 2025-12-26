import { API_BASE_URL, getHeaders } from './api.config';

export interface Center {
    id: number;
    CSU_id: string;
    center_name: string;
    branch_id: number;
}

export const centerService = {
    getCenters: async (branchId?: number | string): Promise<Center[]> => {
        try {
            const url = branchId
                ? `${API_BASE_URL}/centers?branch_id=${branchId}`
                : `${API_BASE_URL}/centers`;
            const response = await fetch(url, { headers: getHeaders() });
            if (!response.ok) return [];
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error("Error fetching centers", error);
            return [];
        }
    }
};
