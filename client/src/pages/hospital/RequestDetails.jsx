import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { User, Phone, CheckCircle2, XCircle, Calendar, Clock, ChevronLeft, MapPin, QrCode, ExternalLink, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const RequestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [pledges, setPledges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPledge, setSelectedPledge] = useState(null);

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleDownloadQR = (pledgeId, donorName) => {
        const svg = document.querySelector(`#qr-${pledgeId} svg`);
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const png = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `donor-qr-${donorName}.png`;
            link.href = png;
            link.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

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
            const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Update failed';
            toast.error(errorMsg);
        }
    };

    const updateRequestStatus = async (status) => {
        try {
            await api.put(`/hospital/requests/${id}`, { status });
            toast.success('Request updated');
            fetchData();
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Update failed';
            toast.error(errorMsg);
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
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-lg">{pledge.donorId?.name || 'Unknown Donor'}</h4>
                                                    <span className="bg-medical-primary/10 text-medical-primary text-xs px-2 py-0.5 rounded font-bold">
                                                        {pledge.donorProfile?.bloodGroup}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 flex items-center gap-1"><Phone size={14} /> {pledge.donorId?.phone || 'No phone'}</p>
                                                <p className="text-xs text-gray-400 mt-1">Pledged: {new Date(pledge.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${pledge.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                pledge.status === 'CONFIRMED' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100'
                                                }`}>
                                                {pledge.status}
                                            </span>
                                            {pledge.appointmentTime && pledge.status !== 'COMPLETED' && (
                                                <p className="text-xs text-medical-secondary font-medium mt-2">
                                                    Appt: {new Date(pledge.appointmentTime).toLocaleString()}
                                                </p>
                                            )}
                                            {pledge.status === 'COMPLETED' && pledge.completedAt && (
                                                <p className="text-xs text-green-600 font-bold mt-2 flex items-center justify-end gap-1">
                                                    <CheckCircle2 size={12} /> Donated: {new Date(pledge.completedAt).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <button
                                            onClick={() => setSelectedPledge(pledge)}
                                            className="text-[10px] bg-red-50 text-medical-primary px-3 py-1.5 rounded-lg font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-red-100 transition-all border border-red-100"
                                        >
                                            <QrCode size={12} /> Show Donor QR & Location
                                        </button>
                                        {pledge.donorProfile?.location?.lat && (
                                            <button
                                                onClick={() => window.open(`https://www.google.com/maps?q=${pledge.donorProfile.location.lat},${pledge.donorProfile.location.lng}`, '_blank')}
                                                className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-blue-100 transition-all border border-blue-100"
                                            >
                                                <ExternalLink size={12} /> Open Maps
                                            </button>
                                        )}
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

            {/* Donor Detail Modal */}
            {selectedPledge && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-100 bg-medical-primary text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">{selectedPledge.donorId?.name}'s Location</h2>
                                <p className="text-xs opacity-80 uppercase tracking-widest font-black">Donor verification & site details</p>
                            </div>
                            <button
                                onClick={() => setSelectedPledge(null)}
                                className="p-2 hover:bg-white/10 rounded-full transition-all"
                            ><XCircle /></button>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="bg-white p-3 rounded-2xl shadow-lg border border-gray-100 w-fit mx-auto" id={`qr-${selectedPledge._id}`}>
                                        <QRCodeSVG
                                            value={
                                                selectedPledge.donorProfile?.location?.lat
                                                    ? `https://www.google.com/maps/search/?api=1&query=${selectedPledge.donorProfile.location.lat},${selectedPledge.donorProfile.location.lng}`
                                                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPledge.donorProfile?.city || '')}`
                                            }
                                            size={160}
                                            level="H"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleDownloadQR(selectedPledge._id, selectedPledge.donorId?.name)}
                                        className="text-[10px] text-medical-primary font-black uppercase tracking-widest hover:underline flex items-center justify-center gap-1 w-full"
                                    >
                                        <Download size={12} /> Download Verified QR
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div className="bg-gray-50 p-4 rounded-2xl">
                                        <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Contact Info</p>
                                        <p className="font-bold text-gray-700 flex items-center gap-2"><Phone size={14} /> {selectedPledge.donorId?.phone}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl">
                                        <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Blood Group</p>
                                        <p className="font-black text-2xl text-medical-secondary">{selectedPledge.donorProfile?.bloodGroup}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="h-[280px] bg-gray-100 rounded-3xl border-4 border-white shadow-inner overflow-hidden relative">
                                    {selectedPledge.donorProfile?.location?.lat ? (
                                        <iframe
                                            title="Donor Location"
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            scrolling="no"
                                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedPledge.donorProfile.location.lng - 0.003},${selectedPledge.donorProfile.location.lat - 0.003},${selectedPledge.donorProfile.location.lng + 0.003},${selectedPledge.donorProfile.location.lat + 0.003}&layer=mapnik&marker=${selectedPledge.donorProfile.location.lat},${selectedPledge.donorProfile.location.lng}`}
                                        ></iframe>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-center p-6 bg-gray-50">
                                            <MapPin size={32} className="mb-2 opacity-20" />
                                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 italic">Approx: {selectedPledge.donorProfile?.city}</p>
                                            <p className="text-[10px] mt-1 text-gray-300">Exact coordinates not pinned by donor</p>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => window.open(`https://www.google.com/maps?q=${selectedPledge.donorProfile?.location?.lat},${selectedPledge.donorProfile?.location?.lng}`, '_blank')}
                                    disabled={!selectedPledge.donorProfile?.location?.lat}
                                    className="btn-primary w-full py-3 flex items-center justify-center gap-2 font-bold text-sm disabled:opacity-50"
                                >
                                    <ExternalLink size={18} /> Get Navigation Directions
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestDetails;
