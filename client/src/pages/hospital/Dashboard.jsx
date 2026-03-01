import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Plus, Clock, Users, ArrowRight, Activity, Droplet, QrCode, MapPin, Download } from 'lucide-react';
import QRScanner from '../../components/QRScanner';
import { useAuth } from '../../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';

const Dashboard = () => {
    const [requests, setRequests] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({ active: 0, fulfilled: 0, totalPledges: 0 });
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'appointments', or 'inventory'

    const { profile } = useAuth();

    useEffect(() => {
        if (activeTab === 'overview') fetchRequests();
        if (activeTab === 'appointments') fetchAppointments();
        if (activeTab === 'inventory') fetchInventory();
    }, [activeTab]);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/hospital/requests');
            // Fetch all COMPLETED pledges across all requests
            // For simplicity, we'll fetch from a new endpoint or filter requests
            // Let's assume we have a way to get all COMPLETED pledges for this hospital
            const { data: pledges } = await api.get('/hospital/pledges/completed');
            setInventory(pledges);
        } catch (err) {
            toast.error('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    const markAsUsed = async (id) => {
        try {
            await api.patch(`/hospital/pledges/${id}/mark-used`);
            toast.success('Unit marked as used! Donor notified. ❤️');
            fetchInventory();
        } catch (err) {
            toast.error('Failed to update inventory');
        }
    };

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/appointments/hospital');
            setAppointments(data);
        } catch (err) {
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const updateApptStatus = async (id, status) => {
        try {
            await api.patch(`/appointments/${id}/status`, { status });
            toast.success(`Appointment ${status.toLowerCase()}`);
            fetchAppointments();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

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

    const handleDownloadQR = () => {
        const svg = document.querySelector('#camp-qr-dash svg');
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
            link.download = `camp-qr-${profile?.hospitalName}.png`;
            link.href = png;
            link.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
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
                    title="Scan Donor Location"
                    label="Scan the donor's QR code to see their location and details."
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

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Welcome Section */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="relative h-48 rounded-3xl overflow-hidden shadow-lg p-8 flex items-center bg-medical-dark text-white">
                        <div className="z-10 relative">
                            <h1 className="text-3xl font-black mb-1">Welcome, {profile?.hospitalName || 'Health Center'}</h1>
                            <p className="text-gray-400">Empowering lives through your institutional contributions.</p>
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
                            <p className="text-gray-500 italic">Manage requests and scan donor locations</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsScannerOpen(true)}
                                className="btn-primary flex items-center gap-2 h-fit"
                            >
                                <QrCode size={20} /> Scan Donor QR
                            </button>
                            <Link to="/hospital/create-request" className="btn-secondary flex items-center gap-2 text-nowrap h-fit">
                                <Plus size={20} /> Post New Request
                            </Link>
                        </div>
                    </div>
                </div>

                {/* QR Code Sidebar Card */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 flex flex-col items-center justify-center text-center space-y-3 border-t-4 border-medical-secondary h-full">
                        <div className="bg-white p-2 rounded-2xl shadow-md border border-gray-50 mb-1" id="camp-qr-dash">
                            <QRCodeSVG
                                value={
                                    profile?.location?.lat
                                        ? `https://www.google.com/maps/search/?api=1&query=${profile.location.lat},${profile.location.lng}`
                                        : profile?.campCity
                                            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((profile?.campAddress || '') + ' ' + profile.campCity)}`
                                            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((profile?.hospitalName || '') + ' ' + (profile?.city || ''))}`
                                }
                                size={120}
                                level="H"
                            />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm">{profile?.hospitalName}</h4>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Camp Location QR</p>
                        </div>
                        <button
                            onClick={handleDownloadQR}
                            className="text-[10px] bg-gray-50 hover:bg-gray-100 text-medical-secondary px-3 py-1.5 rounded-lg font-black uppercase tracking-tighter flex items-center gap-1 transition-all"
                        >
                            <Download size={12} /> Download QR
                        </button>
                    </div>
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

            {/* Tab Switcher */}
            <div className="flex p-1 bg-gray-100 rounded-2xl w-fit mb-8">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold ${activeTab === 'overview' ? 'bg-white text-medical-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Activity size={18} /> Overview
                </button>
                <button
                    onClick={() => setActiveTab('appointments')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold ${activeTab === 'appointments' ? 'bg-white text-medical-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Calendar size={18} /> Appointments {appointments.filter(a => a.status === 'PENDING').length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">New</span>}
                </button>
                <button
                    onClick={() => setActiveTab('inventory')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold ${activeTab === 'inventory' ? 'bg-white text-medical-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Package size={18} /> Blood Inventory
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'overview' ? (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
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
                    </motion.div>
                ) : activeTab === 'appointments' ? (
                    <motion.div
                        key="appointments"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <h2 className="text-xl font-bold flex items-center gap-2"><Calendar size={20} /> Today's Schedule</h2>
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse"></div>)}
                            </div>
                        ) : appointments.length > 0 ? (
                            <div className="grid gap-4">
                                {appointments.map(app => (
                                    <div key={app._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-medical-primary transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-medical-primary/10 rounded-2xl flex items-center justify-center text-medical-primary font-bold text-xl uppercase">
                                                {app.donorProfile?.bloodGroup}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{app.donorId?.name}</h3>
                                                <div className="flex gap-4 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1"><Users size={12} /> {app.donorId?.phone}</span>
                                                    <span className="flex items-center gap-1 font-bold text-medical-primary">Slot: {app.timeSlot}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {app.status === 'PENDING' ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => updateApptStatus(app._id, 'CONFIRMED')}
                                                        className="px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-colors"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => updateApptStatus(app._id, 'CANCELLED')}
                                                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
                                                    >
                                                        Decline
                                                    </button>
                                                </div>
                                            ) : app.status === 'CONFIRMED' ? (
                                                <button
                                                    onClick={() => updateApptStatus(app._id, 'COMPLETED')}
                                                    className="px-6 py-2 bg-medical-primary text-white rounded-xl text-xs font-bold hover:brightness-110 shadow-lg shadow-medical-primary/20 transition-all"
                                                >
                                                    Mark as Completed
                                                </button>
                                            ) : (
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${app.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-3xl">
                                <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
                                <h3 className="text-xl font-bold text-gray-500">No appointments for today</h3>
                                <p className="text-gray-400">Scheduled donations will appear here.</p>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="inventory"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold flex items-center gap-2"><Package size={20} /> Collected Blood Units</h2>
                            <p className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">{inventory.length} Units Available</p>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse"></div>)}
                            </div>
                        ) : inventory.length > 0 ? (
                            <div className="grid gap-4">
                                {inventory.map(item => (
                                    <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-medical-primary transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-black text-xl">
                                                {item.requestId?.bloodGroup}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{item.donorId?.name}</h3>
                                                <p className="text-xs text-gray-500">Collected on {new Date(item.completedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => markAsUsed(item._id)}
                                            className="px-6 py-3 bg-medical-dark text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-medical-primary transition-all flex items-center gap-2 shadow-lg shadow-gray-200"
                                        >
                                            <Heart size={14} /> Mark as Used
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-3xl">
                                <Package className="mx-auto text-gray-300 mb-4" size={48} />
                                <h3 className="text-xl font-bold text-gray-500">Inventory is empty</h3>
                                <p className="text-gray-400">Mark donations as completed to see them here.</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
