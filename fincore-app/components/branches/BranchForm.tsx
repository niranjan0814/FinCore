import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Branch, BranchFormData } from '../../types/branch.types';

interface BranchFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: BranchFormData) => void;
    initialData?: Branch | null;
}

const defaultFormData: BranchFormData = {
    branch_id: '',
    branch_name: '',
    location: '',
    address: '',
    staff_ids: []
};

export function BranchForm({ isOpen, onClose, onSave, initialData }: BranchFormProps) {
    const [formData, setFormData] = useState<BranchFormData>(defaultFormData);

    useEffect(() => {
        if (initialData) {
            setFormData({
                branch_id: initialData.branch_id,
                branch_name: initialData.branch_name,
                location: initialData.location,
                address: initialData.address || '',
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
                        <h2 className="text-lg font-semibold text-gray-900">
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

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <label className="block font-medium text-gray-900 mb-2 text-sm">Branch ID *</label>
                            <input
                                type="text"
                                value={formData.branch_id}
                                onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="e.g. BR001"
                                disabled={!!initialData} // ID typically not editable after creation
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="block font-medium text-gray-900 mb-2 text-sm">Location *</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="e.g. Colombo"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block font-medium text-gray-900 mb-2 text-sm">Branch Name *</label>
                            <input
                                type="text"
                                value={formData.branch_name}
                                onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="Enter branch name"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block font-medium text-gray-900 mb-2 text-sm">Address *</label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                                placeholder="Enter full address"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 flex gap-3 justify-end bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors font-medium text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(formData)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                    >
                        {initialData ? 'Update Branch' : 'Create Branch'}
                    </button>
                </div>
            </div>
        </div>
    );
}
