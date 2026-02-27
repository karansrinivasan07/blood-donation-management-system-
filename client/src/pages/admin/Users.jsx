import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Search, UserCheck, UserMinus, Shield } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch (err) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
            await api.put(`/admin/users/${id}/status`, { status: newStatus });
            toast.success(`User ${newStatus.toLowerCase()} successfully`);
            fetchUsers();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-gray-500">Monitor and manage all system participants</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="input-field pl-10 w-full md:w-80"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600">User</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600">Role</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600">Joined</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400 animate-pulse">Loading users...</td></tr>
                            ) : filteredUsers.map(u => (
                                <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-800">{u.name}</div>
                                        <div className="text-xs text-gray-400">{u.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                u.role === 'HOSPITAL' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center gap-1.5 text-sm font-semibold ${u.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
                                            <span className={`w-2 h-2 rounded-full ${u.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {u.role !== 'ADMIN' && (
                                            <button
                                                onClick={() => toggleStatus(u._id, u.status)}
                                                className={`p-2 rounded-lg transition-all ${u.status === 'ACTIVE' ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'
                                                    }`}
                                                title={u.status === 'ACTIVE' ? 'Block User' : 'Activate User'}
                                            >
                                                {u.status === 'ACTIVE' ? <UserMinus size={20} /> : <UserCheck size={20} />}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;
