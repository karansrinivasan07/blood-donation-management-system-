import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Search, MapPin, Droplets, Clock, ChevronRight } from 'lucide-react';

const Dashboard = () => {
    const { profile } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ city: '', bloodGroup: '' });

    useEffect(() => {
        fetchRequests();
    }, [filters]);

    const fetchRequests = async () => {
        try {
            const { data } = await api.get('/requests', { params: { ...filters } });
            setRequests(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Find Blood Requests</h1>
                    <p className="text-gray-500">Available requests in {filters.city || 'all cities'}</p>
                </div>

                <div className="flex gap-4">
                    <div className="input-group">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Filter by city..."
                            className="input-field"
                            value={filters.city}
                            onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                        />
                    </div>
                    <select
                        className="input-field w-32"
                        value={filters.bloodGroup}
                        onChange={(e) => setFilters(prev => ({ ...prev, bloodGroup: e.target.value }))}
                    >
                        <option value="">Any Group</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse"></div>)}
                </div>
            ) : requests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map((request) => (
                        <div key={request._id} className="glass-card p-6 hover:shadow-2xl transition-all border-l-4 border-medical-primary">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-medical-primary/10 rounded-xl flex items-center justify-center text-medical-primary font-bold">
                                    {request.bloodGroup}
                                </div>
                                <span className={`badge-${request.urgency.toLowerCase()}`}>
                                    {request.urgency}
                                </span>
                            </div>

                            <h3 className="font-bold text-lg mb-1">{request.hospitalProfile?.hospitalName || 'City Hospital'}</h3>
                            <div className="space-y-2 text-sm text-gray-600 mb-6">
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} /> {request.hospitalProfile?.city || 'Unknown City'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Droplets size={14} /> {request.unitsRequired} Units Required
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} /> Before {new Date(request.requiredBefore).toLocaleDateString()}
                                </div>
                            </div>

                            <Link
                                to={`/donor/requests/${request._id}`}
                                className="w-full btn-primary py-2.5 flex items-center justify-center gap-2"
                            >
                                View Details <ChevronRight size={18} />
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl">
                    <Droplets className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-gray-500">No requests found</h3>
                    <p className="text-gray-400">Try changing your filters or location</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
