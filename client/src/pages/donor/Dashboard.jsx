import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Search, MapPin, Droplets, Clock, ChevronRight, HeartPulse, Activity, QrCode, Plus, Building2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import QRScanner from '../../components/QRScanner';

const Dashboard = () => {
    const { profile } = useAuth();
    const [requests, setRequests] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ city: '', bloodGroup: '' });
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [scanResult, setScanResult] = useState(null);

    useEffect(() => {
        fetchRequests();
        fetchHistory();
    }, [filters]);

    const fetchHistory = async () => {
        try {
            const { data } = await api.get('/donor/pledges');
            const completed = data.filter(p => p.status === 'COMPLETED');
            setHistory(completed);
        } catch (err) {
            console.error('History fetch error:', err);
        }
    };

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

    const handleScan = (decodedText) => {
        setIsScannerOpen(false);
        try {
            const data = JSON.parse(decodedText);
            if (data.type === 'BLOOD_CAMP') {
                setScanResult(data);
                toast.success('Donation Camp Found!');
            } else {
                toast.error('Not a valid Camp QR Code');
            }
        } catch (err) {
            toast.error('Invalid QR Code');
        }
    };

    return (
        <div className="space-y-8">
            {isScannerOpen && (
                <QRScanner
                    onScan={handleScan}
                    onClose={() => setIsScannerOpen(false)}
                    title="Scan Donation Camp"
                    label="Scan a hospital's camp QR to see their location and details."
                />
            )}

            {scanResult && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-100 bg-medical-secondary text-white flex justify-between items-center">
                            <h2 className="text-xl font-bold">Donation Camp Details</h2>
                            <button onClick={() => setScanResult(null)}><Plus className="rotate-45" /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-medical-secondary/10 rounded-2xl flex items-center justify-center text-medical-secondary text-2xl">
                                    <Building2 size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{scanResult.name}</h3>
                                    <p className="text-gray-500 text-sm">{scanResult.address}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                                {scanResult.location?.lat ? (
                                    <div className="h-48 w-full relative">
                                        <iframe
                                            title="Camp Location"
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            scrolling="no"
                                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${scanResult.location.lng - 0.005},${scanResult.location.lat - 0.005},${scanResult.location.lng + 0.005},${scanResult.location.lat + 0.005}&layer=mapnik&marker=${scanResult.location.lat},${scanResult.location.lng}`}
                                        ></iframe>
                                    </div>
                                ) : (
                                    <div className="h-48 flex items-center justify-center text-gray-400 italic text-sm p-4 text-center">
                                        Location pinpoint not available. Search in {scanResult.city}.
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => {
                                    window.open(scanResult.mapsUrl, '_blank');
                                    setScanResult(null);
                                }}
                                className="btn-secondary w-full py-4 flex items-center justify-center gap-2 text-lg font-bold"
                            >
                                <MapPin size={20} /> Navigate to Camp
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* HERO SECTION */}
            <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl group">
                <img
                    src="/assets/superhero_banner.png"
                    alt="Superhero Donor"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-10 md:px-16">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg tracking-tight">
                        Be <span className="text-medical-primary">Someone's</span> <br />
                        <span className="uppercase tracking-widest text-white/90">Superhero</span>
                    </h1>
                    <p className="text-white/80 text-lg md:text-xl font-medium max-w-md">
                        Your small donation is a giant leap for someone else's life.
                        Join 2,000+ heroes today.
                    </p>
                </div>
            </div>

            {/* CONTRIBUTION HISTORY SECTION */}
            {history.length > 0 && (
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-medical-primary/10 rounded-lg text-medical-primary">
                            <HeartPulse size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Hospitals You've Saved</h2>
                            <p className="text-sm text-gray-500">Your heroic history of blood donations</p>
                        </div>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {Array.from(new Set(history.map(p => p.requestId?.hospitalProfile?.hospitalName))).map((hospitalName, idx) => (
                            <div key={idx} className="flex-shrink-0 bg-gray-50 px-6 py-4 rounded-2xl flex items-center gap-4 border border-gray-100 hover:border-medical-primary transition-colors group">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-medical-primary shadow-sm group-hover:bg-medical-primary group-hover:text-white transition-colors">
                                    <Activity size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">{hospitalName}</p>
                                    <p className="text-[10px] text-medical-primary font-bold uppercase tracking-widest">Life Saved</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
            }

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Find Blood Requests</h1>
                    <p className="text-gray-500">Available requests in {filters.city || 'all cities'}</p>
                </div>

                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => setIsScannerOpen(true)}
                        className="btn-secondary flex items-center gap-2 h-fit py-2.5"
                    >
                        <QrCode size={20} /> Scan Camp QR
                    </button>
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

            {
                loading ? (
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
                )
            }
        </div >
    );
};

export default Dashboard;
