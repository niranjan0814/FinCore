"use client";

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { StaffStatsCard } from '../../components/staff/StaffStats';
import { StaffTable } from '../../components/staff/StaffTable';
import { RolePermissionsTable } from '../../components/staff/RolePermissionsTable';
import { StaffForm } from '../../components/staff/StaffForm';
import { staffService } from '../../services/staff.service';
import { User, Permission, StaffStats } from '../../types/staff.types';

export default function StaffManagementPage() {
    const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<any[]>([]); // Using any[] to bypass strict check for now, ideally update type
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [fetchedUsers, fetchedRoles, fetchedPermissions] = await Promise.all([
                staffService.getUsers(),
                staffService.getAllRoles(),
                staffService.getPermissions()
            ]);
            setUsers(fetchedUsers);
            setRoles(fetchedRoles);
            setPermissions(fetchedPermissions);
        } catch (error) {
            console.error("Failed to load staff data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (userData: any) => {
        try {
            await staffService.createUser(userData);
            setShowAddUserModal(false);
            loadData(); // Reload to show new user
        } catch (e: any) {
            console.error(e);
            // Error handled in the form mostly, but good to catch here too
            alert(e.message);
        }
    };

    const stats: StaffStats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'Active').length,
        totalRoles: roles.length
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">User Management</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage users, roles, and permissions</p>
                </div>
                {activeTab === 'users' && (
                    <button
                        onClick={() => setShowAddUserModal(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">Add User</span>
                    </button>
                )}
            </div>

            {/* Statistics Cards */}
            <StaffStatsCard stats={stats} />

            {/* Main Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-3 border-b-2 transition-colors text-sm font-medium ${activeTab === 'users'
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            Staff Users
                        </button>
                        <button
                            onClick={() => setActiveTab('roles')}
                            className={`px-6 py-3 border-b-2 transition-colors text-sm font-medium ${activeTab === 'roles'
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            Roles & Privileges
                        </button>
                    </div>
                </div>

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <StaffTable
                        users={users}
                        onEdit={(user) => console.log('Edit', user)}
                        onDelete={(id) => console.log('Delete', id)}
                    />
                )}

                {/* Roles Tab */}
                {activeTab === 'roles' && (
                    <RolePermissionsTable roles={roles} permissions={permissions} />
                )}
            </div>

            {/* Add User Modal */}
            {showAddUserModal && (
                <StaffForm
                    onClose={() => setShowAddUserModal(false)}
                    onSubmit={handleAddUser}
                    roles={roles}
                />
            )}
        </div>
    );
}
