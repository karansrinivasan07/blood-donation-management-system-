import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { User, Phone, CheckCircle2, XCircle, Calendar, Clock, ChevronLeft } from 'lucide-react';

const RequestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [pledges, setPledges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [reqRes, pledgesRes] = await Promise.all([
                api.get(`/requests/${id}`),
                api.get(`/hospital/requests/${id}/pledges`)
            ]);
            setRequest(reqRes.data);
            setPledges(pledgesRes.data);
        } catch (err) {
            toast.error('Failed to load data');
            navigate('/hospital/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const updatePledge = async (pledgeId, status) => {
        try {
            let updatePayload = { status };
            if (status === 'CONFIRMED') {
                const time = prompt('Enter appointment time (YYYY-MM-DD HH:MM):');
                if (!time) return;
                updatePayload.appointmentTime = new Date(time);
            }

            await api.put(`/hospital/requests/${id}/pledges/${pledgeId}`, updatePayload);
            toast.success('Status updated');
            fetchData();
        } catch (err) {
            toast.error('Update failed');
        }
    };

    const updateRequestStatus = async (status) => {
        try {
            await api.put(`/hospital/requests/${id}`, { status });
            toast.success('Request updated');
            fetchData();
        } catch (err) {
            toast.error('Update failed');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 text-gray-500">
                <button onClick={() => navigate('/hospital/dashboard')} className="hover:text-medical-secondary flex items-center gap-1">
                    <ChevronLeft size={16} /> Back to Dashboard
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6">
                    <div className="glass-card p-6 border-t-8 border-medical-secondary">
                        <h2 className="text-xl font-bold mb-4">Request Overview</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Blood Group</span>
                                <span className="font-bold text-medical-secondary">{request.bloodGroup}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Units Needed</span>
                                <span className="font-bold">{request.unitsRequired}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Status</span>
                                <select
                                    className="bg-transparent font-bold focus:outline-none"
                                    value={request.status}
                                    onChange={(e) => updateRequestStatus(e.target.value)}
                                >
                                    <option value="OPEN">OPEN</option>
                                    <option value="PARTIAL">PARTIAL</option>
                                    <option value="CLOSED">CLOSED</option>
                                </select>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Urgency</span>
                                <span className={`badge-${request.urgency.toLowerCase()}`}>{request.urgency}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold">Responded Donors ({pledges.length})</h2>
                    {pledges.length > 0 ? (
                        <div className="space-y-4">
                            {pledges.map((pledge) => (
                                <div key={pledge._id} className="glass-card p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-4">
                                            <div className="p-3 bg-gray-100 rounded-full h-fit"><User size={24} /></div>
                                            <div>
                                                <h4 className="font-bold text-lg">{pledge.donorId.name}</h4>
                                                <p className="text-sm text-gray-500 flex items-center gap-1"><Phone size={14} /> {pledge.donorId.phone}</p>
                                                <p className="text-xs text-gray-400 mt-1">Pledged: {new Date(pledge.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${pledge.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                    pledge.status === 'CONFIRMED' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100'
                                                }`}>
                                                {pledge.status}
                                            </span>
                                            {pledge.appointmentTime && (
                                                <p className="text-xs text-medical-secondary font-medium mt-2">
                                                    Appt: {new Date(pledge.appointmentTime).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                                        {pledge.status === 'PLEDGED' && (
                                            <button
                                                onClick={() => updatePledge(pledge._id, 'CONFIRMED')}
                                                className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Calendar size={16} /> Schedule & Confirm
                                            </button>
                                        )}
                                        {(pledge.status === 'CONFIRMED' || pledge.status === 'PLEDGED') && (
                                            <button
                                                onClick={() => updatePledge(pledge._id, 'COMPLETED')}
                                                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle2 size={16} /> Mark Completed
                                            </button>
                                        )}
                                        {pledge.status !== 'CANCELLED' && pledge.status !== 'COMPLETED' && (
                                            <button
                                                onClick={() => updatePledge(pledge._id, 'CANCELLED')}
                                                className="px-4 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-all"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
                            <p className="text-gray-500">Waiting for donors to respond...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestDetails;
