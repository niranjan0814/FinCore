import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Branch, BranchFormData } from '../../types/branch.types';
import { API_BASE_URL, getHeaders } from '../../services/api.config';

interface BranchFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: BranchFormData) => void;
    initialData?: Branch | null;
}

const defaultFormData: BranchFormData = {
    branch_id: '',
    branch_name: '',
    address: '',
    city: '',
    province: '',
    postal_code: '',
    phone: '',
    email: '',
    manager_name: '',
    staff_ids: []
};

export function BranchForm({ isOpen, onClose, onSave, initialData }: BranchFormProps) {
    const [formData, setFormData] = useState<BranchFormData>(defaultFormData);
    const [managers, setManagers] = useState<{ staff_id: string; full_name: string }[]>([]);

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                // Using a direct fetch here or via staffService if extended. 
                // Since staffService might not have 'byRole' yet defined in types, we'll use a direct fetch or extend the service.
                // Assuming we use the generic API structure. 
                const response = await fetch(`${API_BASE_URL}/staffs/by-role/manager`, {
                    headers: getHeaders()
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.data) {
                        setManagers(result.data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch managers", error);
            }
        };

        fetchManagers();

        if (initialData) {
            setFormData({
                branch_id: initialData.branch_id,
                branch_name: initialData.branch_name,
                address: initialData.address || '',
                city: initialData.city || '',
                province: initialData.province || '',
                postal_code: initialData.postal_code || '',
                phone: initialData.phone || '',
                email: initialData.email || '',
                manager_name: initialData.manager_name || '',
                staff_ids: initialData.staff_ids || []
            });
        } else {
            setFormData(defaultFormData);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">
                            {initialData ? 'Edit Branch' : 'Add New Branch'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Branch Name */}
                    <div>
                        <label className="block font-semibold text-gray-900 mb-2 text-sm">Branch Name *</label>
                        <input
                            type="text"
                            value={formData.branch_name}
                            onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Enter branch name"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block font-semibold text-gray-900 mb-2 text-sm">Address *</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Enter address"
                        />
                    </div>

                    {/* City & Province */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold text-gray-900 mb-2 text-sm">City *</label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="Enter city"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-900 mb-2 text-sm">Province *</label>
                            <input
                                type="text"
                                value={formData.province}
                                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="Enter province"
                            />
                        </div>
                    </div>

                    {/* Postal Code & Phone */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold text-gray-900 mb-2 text-sm">Postal Code *</label>
                            <input
                                type="text"
                                value={formData.postal_code}
                                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="Enter postal code"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-900 mb-2 text-sm">Phone *</label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="+94 XX XXX XXXX"
                            />
                        </div>
                    </div>

                    {/* Email & Manager */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold text-gray-900 mb-2 text-sm">Email *</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="branch@lms.lk"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-900 mb-2 text-sm">Branch Manager *</label>
                            <select
                                value={formData.manager_name}
                                onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                            >
                                <option value="">Select Manager</option>
                                {managers.length > 0 ? (
                                    managers.map((manager) => (
                                        <option key={manager.staff_id} value={manager.full_name}>
                                            {manager.full_name}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No managers found</option>
                                )}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex gap-3 justify-end bg-gray-50 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-white transition-colors font-semibold text-sm text-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(formData)}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-sm"
                    >
                        {initialData ? 'Update Branch' : 'Add Branch'}
                    </button>
                </div>
            </div>
        </div>
    );
}
