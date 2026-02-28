import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Plus, Clock, Users, ArrowRight, Activity, Droplet, QrCode, MapPin } from 'lucide-react';
import QRScanner from '../../components/QRScanner';

const Dashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({ active: 0, fulfilled: 0, totalPledges: 0 });
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [scanResult, setScanResult] = useState(null);

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
        try {
            const data = JSON.parse(decodedText);
            if (data.type === 'BLOOD_DONOR') {
                setScanResult(data);
                toast.success('Donor details scanned!');
            } else {
                toast.error('Invalid QR Code format');
            }
        } catch (err) {
            // Fallback for old simple URL QRs
            if (decodedText.startsWith('https://www.google.com/maps')) {
                window.open(decodedText, '_blank');
                toast.success('Opening location maps...');
            } else {
                toast.error('Could not parse QR code');
            }
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

            {scanResult && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-100 bg-medical-primary text-white flex justify-between items-center">
                            <h2 className="text-xl font-bold">Donor Found</h2>
                            <button onClick={() => setScanResult(null)}><Plus className="rotate-45" /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-medical-primary/10 rounded-2xl flex items-center justify-center text-medical-primary text-2xl font-bold">
                                    {scanResult.bloodGroup}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{scanResult.name}</h3>
                                    <p className="text-gray-500 flex items-center gap-1"><MapPin size={14} /> {scanResult.city}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                                {scanResult.location?.lat ? (
                                    <div className="h-48 w-full relative">
                                        <iframe
                                            title="Donor Location"
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            scrolling="no"
                                            marginHeight="0"
                                            marginWidth="0"
                                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${scanResult.location.lng - 0.005},${scanResult.location.lat - 0.005},${scanResult.location.lng + 0.005},${scanResult.location.lat + 0.005}&layer=mapnik&marker=${scanResult.location.lat},${scanResult.location.lng}`}
                                        ></iframe>
                                        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-medical-primary shadow-sm border border-medical-primary/20">
                                            High Precision GPS
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-48 flex items-center justify-center text-gray-400 italic text-sm p-4 text-center">
                                        Exact coordinates not provided. Using city center.
                                    </div>
                                )}
                                <div className="p-4 border-t border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Coordinates</p>
                                    <p className="text-sm font-mono text-gray-600">
                                        {scanResult.location?.lat ? `${scanResult.location.lat.toFixed(6)}, ${scanResult.location.lng.toFixed(6)}` : 'City: ' + scanResult.city}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    window.open(scanResult.mapsUrl, '_blank');
                                    setScanResult(null);
                                }}
                                className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg font-bold"
                            >
                                <MapPin size={20} /> Open Location in Maps
                            </button>
                        </div>
                    </div>
                </div>
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
