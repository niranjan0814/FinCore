export interface User {
    id: string;
    name: string;
    staffId?: string; // Staff ID for staff members (e.g., ST0001)
    email: string;
    role: string;
    branch: string;
    status: 'Active' | 'Inactive' | 'Blocked';
}

export interface Role {
    id: number;
    name: string;
    display_name: string;
    description: string;
    level: string;
}

export interface Permission {
    module: string;
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
}

export interface StaffStats {
    totalUsers: number;
    activeUsers: number;
    totalRoles: number;
}
