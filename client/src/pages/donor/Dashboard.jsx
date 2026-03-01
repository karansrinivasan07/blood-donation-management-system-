import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Search, MapPin, Droplets, Clock, ChevronRight, Activity, QrCode } from 'lucide-react';
import { toast } from 'react-hot-toast';
import QRScanner from '../../components/QRScanner';

const Dashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ city: '', bloodGroup: '' });
    const [showScanner, setShowScanner] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, [filters]);

    const fetchRequests = async () => {
        try {
            const { data } = await api.get('/requests', { params: { ...filters } });
            setRequests(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    const handleScan = (data) => {
        try {
            const scanData = JSON.parse(data);
            if (scanData.type === 'BLOOD_CAMP') {
                toast.success(`Found: ${scanData.name}`);
                setShowScanner(false);
                if (scanData.mapsUrl) {
                    if (window.confirm(`Open directions for ${scanData.name}?`)) {
                        window.open(scanData.mapsUrl, '_blank');
                    }
                } else {
                    toast.error('Location details not found in QR');
                }
            } else {
                toast.error('This is not a Blood Camp QR code');
            }
        } catch (err) {
            toast.error('Could not parse QR Code');
        }
    };

    return (
        <div className="space-y-8">
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
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                <div>
                    <h1 className="text-3xl font-bold text-medical-dark">Available Requests</h1>
                    <p className="text-gray-500 font-medium">Find people who need your help in {filters.city || 'all cities'}</p>
                </div>
                <button
                    onClick={() => setShowScanner(true)}
                    className="btn-secondary flex items-center gap-2 px-6 py-3"
                >
                    <QrCode size={20} /> Scan Camp QR
                </button>
            </div>

            <div className="flex gap-4 items-center">
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
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse"></div>)}
                </div>
            ) : requests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map((request) => (
                        <div key={request._id} className="glass-card p-6 flex flex-col hover:shadow-2xl transition-all border-l-4 border-medical-primary">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-medical-primary/10 rounded-xl flex items-center justify-center text-medical-primary font-bold text-xl">
                                    {request.bloodGroup}
                                </div>
                                <span className={`badge-${request.urgency.toLowerCase()}`}>
                                    {request.urgency}
                                </span>
                            </div>

                            <h3 className="font-bold text-lg mb-1">{request.hospitalProfile?.hospitalName || 'City Hospital'}</h3>
                            <div className="space-y-2 text-sm text-gray-600 mb-6 flex-grow">
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

            {showScanner && (
                <QRScanner
                    onScan={handleScan}
                    onClose={() => setShowScanner(false)}
                    title="Scan Blood Camp QR"
                    description="Scan the QR code displayed at the hospital or blood donation camp to get navigation and details."
                />
            )}
        </div>
    );
};

export default Dashboard;
