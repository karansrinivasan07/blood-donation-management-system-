import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Search, MapPin, Eye, Filter } from 'lucide-react';

const AdminRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data } = await api.get('/admin/requests'); // Need to implement this backend route or use regular get with admin auth
            setRequests(data);
        } catch (err) {
            // If admin specific route doesn't exist yet, fallback to general
            try {
                const { data } = await api.get('/requests?status=ALL');
                setRequests(data);
            } catch (e) {
                toast.error('Failed to load requests');
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredRequests = requests.filter(r =>
        r.bloodGroup.includes(filter.toUpperCase()) ||
        r.hospitalProfile?.hospitalName.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">All Requests</h1>
                    <p className="text-gray-500">Overview of all blood needs across the platform</p>
                </div>

                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by hospital or blood group..."
                        className="input-field pl-10 w-full md:w-80"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    <div className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
                ) : filteredRequests.map(r => (
                    <div key={r._id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex gap-6 items-center">
                            <div className="w-16 h-16 bg-medical-primary/10 text-medical-primary rounded-2xl flex items-center justify-center font-bold text-2xl">
                                {r.bloodGroup}
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">{r.hospitalProfile?.hospitalName}</h4>
                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {r.hospitalProfile?.city}</span>
                                    <span>•</span>
                                    <span>{r.unitsRequired} Units required</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                                        r.status === 'PARTIAL' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'
                                    }`}>
                                    {r.status}
                                </span>
                                <p className="text-xs text-gray-400 mt-1">Prioritiy: {r.urgency}</p>
                            </div>
                            <div className="text-sm font-medium text-gray-600">
                                Ends {new Date(r.requiredBefore).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminRequests;
