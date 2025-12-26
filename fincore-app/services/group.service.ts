import { API_BASE_URL, getHeaders } from './api.config';

export interface Group {
    id: number;
    group_name: string;
    center_id: number;
}

export const groupService = {
    getGroups: async (centerId?: number | string): Promise<Group[]> => {
        try {
            const url = centerId
                ? `${API_BASE_URL}/groups?center_id=${centerId}`
                : `${API_BASE_URL}/groups`;
            const response = await fetch(url, { headers: getHeaders() });
            if (!response.ok) return [];
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error("Error fetching groups", error);
            return [];
        }
    }
};
