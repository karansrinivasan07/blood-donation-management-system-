import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Calendar, MapPin, Building2, CheckCircle2, Clock, XCircle } from 'lucide-react';

const MyPledges = () => {
    const [pledges, setPledges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPledges();
    }, []);

    const fetchPledges = async () => {
        try {
            const { data } = await api.get('/donor/pledges');
            setPledges(data);
        } catch (err) {
            toast.error('Failed to load pledges');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
            case 'PLEDGED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'CONFIRMED': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'CANCELLED': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'COMPLETED': return <CheckCircle2 size={16} />;
            case 'PLEDGED': return <Clock size={16} />;
            case 'CONFIRMED': return <Calendar size={16} />;
            case 'CANCELLED': return <XCircle size={16} />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">My Pledges</h1>
                <p className="text-gray-500">History of your donation commitments</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>)}
                </div>
            ) : pledges.length > 0 ? (
                <div className="space-y-4">
                    {pledges.map((pledge) => (
                        <div key={pledge._id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-medical-secondary">
                            <div className="flex gap-4">
                                <div className="w-14 h-14 bg-medical-secondary/10 rounded-2xl flex items-center justify-center text-medical-secondary font-bold text-xl shrink-0">
                                    {pledge.requestId.bloodGroup}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{pledge.requestId.hospitalProfile?.hospitalName}</h3>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {pledge.requestId.hospitalProfile?.city}</span>
                                        <span className="flex items-center gap-1"><Calendar size={14} /> Pledged on {new Date(pledge.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-end gap-2">
                                    {pledge.status === 'COMPLETED' && pledge.completedAt ? (
                                        <div className="text-right">
                                            <p className="text-xs text-green-500 font-bold uppercase tracking-wider">Donated On</p>
                                            <p className="font-bold text-gray-800">{new Date(pledge.completedAt).toLocaleString()}</p>
                                        </div>
                                    ) : pledge.appointmentTime ? (
                                        <div className="text-right">
                                            <p className="text-xs text-medical-secondary font-medium">Appointment</p>
                                            <p className="font-semibold text-gray-700">{new Date(pledge.appointmentTime).toLocaleString()}</p>
                                        </div>
                                    ) : null}
                                    <div className={`px-4 py-2 rounded-full border flex items-center gap-2 font-semibold text-sm ${getStatusStyle(pledge.status)}`}>
                                        {getStatusIcon(pledge.status)}
                                        {pledge.status}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">You haven't made any pledges yet.</p>
                </div>
            )}
        </div>
    );
};

export default MyPledges;
