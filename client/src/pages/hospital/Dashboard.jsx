import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Plus, Clock, Users, ArrowRight, Activity, Droplet, MapPin, Calendar, Package, Heart, QrCode } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import QRScanner from '../../components/QRScanner';

const Dashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({ active: 0, fulfilled: 0, totalPledges: 0 });
    const [showScanner, setShowScanner] = useState(false);

    const { profile } = useAuth();

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

    const handleScan = async (data) => {
        try {
            const scanData = JSON.parse(data);
            if (scanData.type === 'PLEDGE_VERIFICATION') {
                toast.success(`Verified: ${scanData.donorName} (${scanData.bloodGroup})`);
                setShowScanner(false);
                // Redirect to request details or show confirmation modal
                // For now, let's find which request this pledge belongs to if we can,
                // or just stay here and maybe trigger a "complete" action?
                // Actually, the best UX is to redirect to the specific request's detail page
                // But we don't have the requestId in the QR yet! Let me add it.
                // Wait, I can just use the pledgeId to fetch details or mark completed.

                if (window.confirm(`Mark donation as completed for ${scanData.donorName}?`)) {
                    await api.put(`/hospital/pledges/${scanData.pledgeId}/complete`);
                    toast.success('Donation recorded successfully!');
                    fetchRequests();
                }
            } else {
                toast.error('Invalid QR Code type');
            }
        } catch (err) {
            toast.error('Could not parse QR Code');
            console.error(err);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-medical-dark">Hospital Dashboard</h1>
                    <p className="text-gray-500 font-medium">Manage your blood requests and monitor pledges</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowScanner(true)}
                        className="btn-secondary flex items-center gap-2 h-fit"
                    >
                        <QrCode size={20} /> Scan Donor
                    </button>
                    <Link to="/hospital/create-request" className="btn-primary flex items-center gap-2 h-fit">
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
                <h2 className="text-xl font-bold flex items-center gap-2"><Clock size={20} /> Your Recent Requests</h2>
                {loading ? (
                    <div className="grid gap-4">
                        {[1, 2].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse"></div>)}
                    </div>
                ) : requests.length > 0 ? (
                    <div className="grid gap-4">
                        {requests.map((request) => (
                            <div key={request._id} className="glass-card p-5 group hover:border-medical-primary transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-medical-primary/10 text-medical-primary rounded-2xl flex items-center justify-center font-bold text-xl">
                                            {request.bloodGroup}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">Requested {request.unitsRequired} units</h4>
                                            <p className="text-sm text-gray-500">Needed before {new Date(request.requiredBefore).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-medical-secondary font-bold text-sm mb-1">{request.pledgeCount || 0} Pledges</p>
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${request.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                                                request.status === 'PARTIAL' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {request.status}
                                            </span>
                                        </div>
                                        <Link to={`/hospital/requests/${request._id}`} className="p-3 bg-gray-50 hover:bg-medical-primary hover:text-white rounded-xl transition-all">
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
                        <Link to="/hospital/create-request" className="text-medical-primary font-bold mt-2 inline-block">Post your first request</Link>
                    </div>
                )}
            </div>

            {showScanner && (
                <QRScanner
                    onScan={handleScan}
                    onClose={() => setShowScanner(false)}
                    title="Scan Donor QR"
                    description="Scan the QR code shown in the donor's 'My Pledges' section to verify their donation."
                />
            )}
        </div>
    );
};

export default Dashboard;
