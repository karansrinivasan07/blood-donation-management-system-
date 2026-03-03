import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Search, MapPin, Eye, Filter, Trash2, AlertCircle } from 'lucide-react';

const AdminRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data } = await api.get('/admin/requests');
            setRequests(data);
        } catch (err) {
            toast.error('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const deleteRequest = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blood request?')) return;
        try {
            await api.delete(`/admin/requests/${id}`);
            toast.success('Request removed from system');
            fetchRequests();
        } catch (err) {
            toast.error('Failed to delete request');
        }
    };

    const filteredRequests = requests.filter(r =>
        r.bloodGroup.toLowerCase().includes(filter.toLowerCase()) ||
        r.hospitalProfile?.hospitalName.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Global Requests</h1>
                    <p className="text-gray-500 font-medium">Manage and moderate all blood donation requests</p>
                </div>

                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by hospital or blood group..."
                        className="input-field pl-10 w-full md:w-80 border-none shadow-sm"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-3xl animate-pulse"></div>)
                ) : filteredRequests.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-gray-500 font-bold">No blood requests found</h3>
                    </div>
                ) : filteredRequests.map(r => (
                    <div key={r._id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-2xl hover:shadow-gray-200 transition-all border-none">
                        <div className="flex gap-6 items-center">
                            <div className="w-16 h-16 bg-medical-primary/10 text-medical-primary rounded-2xl flex items-center justify-center font-black text-2xl border border-medical-primary/10">
                                {r.bloodGroup}
                            </div>
                            <div>
                                <h4 className="font-black text-gray-800 text-lg">{r.hospitalProfile?.hospitalName}</h4>
                                <div className="flex items-center gap-3 text-sm font-bold text-gray-400 mt-1">
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {r.hospitalProfile?.city}</span>
                                    <span className="text-gray-200">•</span>
                                    <span className="text-medical-primary">{r.unitsRequired} Units required</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase ${r.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                                    r.status === 'PARTIAL' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                    {r.status}
                                </span>
                                <p className="text-[10px] font-black uppercase text-gray-300 mt-2 tracking-widest">Priority: {r.urgency}</p>
                            </div>

                            <div className="h-10 w-px bg-gray-100 hidden md:block"></div>

                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Deadline</p>
                                    <p className="text-sm font-bold text-gray-700">{new Date(r.requiredBefore).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => deleteRequest(r._id)}
                                    className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                    title="Delete Request"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminRequests;
