import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { MapPin, Building2, Droplets, Calendar, AlertCircle, Heart } from 'lucide-react';

const RequestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { profile } = useAuth();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pledging, setPledging] = useState(false);

    useEffect(() => {
        fetchRequest();
    }, [id]);

    const fetchRequest = async () => {
        try {
            const { data } = await api.get(`/requests/${id}`);
            setRequest(data);
        } catch (err) {
            toast.error('Failed to load request');
            navigate('/donor/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handlePledge = async () => {
        setPledging(true);
        try {
            await api.post(`/requests/${id}/pledges`);
            toast.success('Pledge successful! The hospital will contact you.');
            navigate('/donor/my-pledges');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to pledge');
        } finally {
            setPledging(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    const isEligible = profile?.bloodGroup === request?.bloodGroup || request?.bloodGroup === 'O-'; // Very simple check

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4 text-gray-500">
                <button onClick={() => navigate(-1)} className="hover:text-medical-primary">Dashboard</button>
                <span>/</span>
                <span className="text-gray-900 font-medium">Request Details</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className="glass-card p-8">
                        <div className="flex justify-between items-start mb-6">
                            <h1 className="text-3xl font-bold">{request.hospitalProfile?.hospitalName}</h1>
                            <span className={`badge-${request.urgency.toLowerCase()} text-base px-4 py-1.5`}>
                                {request.urgency} Priority
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-50 text-red-600 rounded-xl"><Droplets /></div>
                                <div>
                                    <p className="text-sm text-gray-400">Blood Requested</p>
                                    <p className="text-xl font-bold">{request.bloodGroup}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Calendar /></div>
                                <div>
                                    <p className="text-sm text-gray-400">Needed Before</p>
                                    <p className="text-xl font-bold">{new Date(request.requiredBefore).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="font-bold text-lg">Hospital Location</h3>
                            <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                                <MapPin className="text-medical-primary shrink-0" size={24} />
                                <div>
                                    <p className="font-medium">{request.hospitalProfile?.address}</p>
                                    <p className="text-gray-500">{request.hospitalProfile?.city}, {request.hospitalProfile?.pincode}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-card p-6 bg-medical-dark text-white border-none">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Heart className="text-medical-primary fill-medical-primary" /> Pledge to Donate
                        </h3>
                        <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                            By clicking below, you commit to donate blood at this hospital. Ensure you meet basic eligibility criteria and are available on short notice.
                        </p>

                        <ul className="space-y-3 mb-8 text-xs text-gray-400">
                            <li className="flex gap-2">✓ No donation in last 3 months</li>
                            <li className="flex gap-2">✓ Weight above 50kg</li>
                            <li className="flex gap-2">✓ Generally in good health</li>
                        </ul>

                        <button
                            onClick={handlePledge}
                            disabled={pledging || !isEligible}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${isEligible
                                    ? 'bg-medical-primary hover:bg-medical-primary/90 text-white animate-pulse'
                                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {pledging ? 'Pledging...' : isEligible ? 'Pledge Now' : 'Incompatible Blood'}
                        </button>

                        {!isEligible && (
                            <p className="mt-4 text-center text-xs text-red-400 flex items-center justify-center gap-1">
                                <AlertCircle size={12} /> Blood group mismatch
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestDetails;
