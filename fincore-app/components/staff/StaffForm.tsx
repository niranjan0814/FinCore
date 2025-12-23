import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { Role } from '../../types/staff.types';

interface StaffFormProps {
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    roles: Role[];
}

export function StaffForm({ onClose, onSubmit, roles }: StaffFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        roleId: '',
        branch: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setError('');
        setLoading(true);
        try {
            // Find selected role to check name
            const selectedRole = roles.find(r => r.id.toString() === formData.roleId);
            const roleName = selectedRole?.name || '';

            // Construct payload
            const payload: any = {
                name: formData.name, // Pass name
                email: formData.email,
                password: formData.password,
                role: roleName, // Keep for logic decision
                roleId: formData.roleId // Add ID for API
            };

            // Add other fields if necessary or for different roles
            // Admin API auto-generates username, so 'name' input might be unused for Admin or mapped differently?
            // The UI has "Full Name", but Admin API only takes email/password.
            // We'll ignore Full Name for Admin creation as per API spec (user_name is auto-generated ADxxxx).

            await onSubmit(payload);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    // Determine if branch field should be shown
    // Hide if role is 'admin' (assuming 'admin' is the slug)
    const selectedRole = roles.find(r => r.id.toString() === formData.roleId);
    const isBranchHidden = selectedRole?.name === 'admin';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Add New User</h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Full Name - Might be visual only for Admin if API generates it, or could be passed if API supports it later */}
                    <div>
                        <label className="block font-medium text-gray-900 dark:text-gray-100 mb-2 text-sm">Full Name *</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Enter full name"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-900 dark:text-gray-100 mb-2 text-sm">Email *</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="user@lms.lk"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-900 dark:text-gray-100 mb-2 text-sm">Role *</label>
                        <select
                            name="roleId"
                            value={formData.roleId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                            <option value="">Select Role</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.display_name}</option>
                            ))}
                        </select>
                    </div>

                    {!isBranchHidden && (
                        <div>
                            <label className="block font-medium text-gray-900 dark:text-gray-100 mb-2 text-sm">Branch *</label>
                            <select
                                name="branch"
                                value={formData.branch}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                                <option value="">Select Branch</option>
                                <option value="Head Office">Head Office</option>
                                <option value="Kandy Branch">Kandy Branch</option>
                                <option value="Galle Branch">Galle Branch</option>
                            </select>
                        </div>
                    )}

                    <div className="relative">
                        <label className="block font-medium text-gray-900 dark:text-gray-100 mb-2 text-sm">Password *</label>
                        <input
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            type={showPassword ? "text" : "password"}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-10"
                            placeholder="Enter password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[34px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors font-medium text-sm disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? 'Adding...' : 'Add User'}
                    </button>
                </div>
            </div>
        </div>
    );
}
