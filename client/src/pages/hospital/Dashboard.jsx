import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Plus, Clock, Users, ArrowRight, Activity, Droplet, QrCode } from 'lucide-react';
import QRScanner from '../../components/QRScanner';

const Dashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({ active: 0, fulfilled: 0, totalPledges: 0 });
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data } = await api.get('/hospital/requests');
            setRequests(data);

            const active = data.filter(r => r.status === 'OPEN' || r.status === 'PARTIAL').length;
            const fulfilled = data.reduce((sum, r) => sum + (r.completedCount || 0), 0);
            const totalPledges = data.reduce((sum, r) => sum + (r.pledgeCount || 0), 0);

            setMetrics({ active, fulfilled, totalPledges });
        } catch (err) {
            toast.error('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const handleScan = (decodedText) => {
        setIsScannerOpen(false);
        if (decodedText.startsWith('https://www.google.com/maps')) {
            toast.success('Donor location found!');
            window.open(decodedText, '_blank');
        } else {
            toast.error('Invalid QR Code');
        }
    };

    return (
        <div className="space-y-8">
            {isScannerOpen && (
                <QRScanner
                    onScan={handleScan}
                    onClose={() => setIsScannerOpen(false)}
                />
            )}
            <div className="relative h-48 rounded-3xl overflow-hidden shadow-lg p-8 flex items-center bg-medical-dark text-white mb-6">
                <div className="z-10 relative">
                    <h1 className="text-3xl font-black mb-1">Empowering Healthcare</h1>
                    <p className="text-gray-400">Manage your blood requests and find local heroes in our community.</p>
                </div>
                <img
                    src="/assets/superhero_banner.png"
                    className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-30 mix-blend-screen"
                    style={{ maskImage: 'linear-gradient(to left, white, transparent)' }}
                />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Hospital Dashboard</h1>
                    <p className="text-gray-500">Manage your blood requests and donor pledges</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsScannerOpen(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <QrCode size={20} /> Scan Donor QR
                    </button>
                    <Link to="/hospital/create-request" className="btn-secondary flex items-center gap-2 text-nowrap">
                        <Plus size={20} /> Post New Request
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: <Activity className="text-blue-600" />, label: "Active Requests", value: metrics.active, color: "bg-blue-50" },
                    { icon: <Droplet className="text-green-600" />, label: "Units Collected", value: metrics.fulfilled, color: "bg-green-50" },
                    { icon: <Users className="text-orange-600" />, label: "Total Pledges", value: metrics.totalPledges, color: "bg-orange-50" },
                ].map((stat, i) => (
                    <div key={i} className={`${stat.color} p-6 rounded-2xl flex items-center gap-4`}>
                        <div className="p-3 bg-white rounded-xl shadow-sm">{stat.icon}</div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2"><Clock size={20} /> Recent Requests</h2>
                {loading ? (
                    <div className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
                ) : requests.length > 0 ? (
                    <div className="grid gap-4">
                        {requests.map((request) => (
                            <div key={request._id} className="glass-card p-5 group hover:border-medical-secondary transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-medical-secondary/10 text-medical-secondary rounded-2xl flex items-center justify-center font-bold text-xl">
                                            {request.bloodGroup}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">Requested {request.unitsRequired} units</h4>
                                            <p className="text-sm text-gray-500 italic">Needed before {new Date(request.requiredBefore).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="flex flex-col items-end gap-1 mb-2">
                                                <div className="flex items-center gap-2 text-medical-secondary font-bold text-sm">
                                                    <Users size={16} /> {request.pledgeCount || 0} Pledges
                                                </div>
                                                <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                                    {request.completedCount || 0} / {request.unitsRequired} Units Collected
                                                </div>
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${request.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                                                request.status === 'PARTIAL' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {request.status}
                                            </span>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">{request.urgency} Priority</p>
                                        </div>
                                        <Link to={`/hospital/requests/${request._id}`} className="p-3 bg-gray-50 hover:bg-medical-secondary hover:text-white rounded-xl transition-all">
                                            <ArrowRight size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500">No requests posted yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
