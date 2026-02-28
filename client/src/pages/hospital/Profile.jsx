import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Building2, MapPin, Save, Info, QrCode, Phone, Mail, Activity } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const Profile = () => {
    const { user, profile, setProfile } = useAuth();
    const [formData, setFormData] = useState({
        hospitalName: profile?.hospitalName || '',
        address: profile?.address || '',
        city: profile?.city || '',
        pincode: profile?.pincode || '',
        contactEmail: profile?.contactEmail || user?.email || '',
        contactPhone: profile?.contactPhone || user?.phone || '',
        isCampActive: profile?.isCampActive ?? true,
        location: profile?.location || { lat: null, lng: null }
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData({
                hospitalName: profile.hospitalName || '',
                address: profile.address || '',
                city: profile.city || '',
                pincode: profile.pincode || '',
                contactEmail: profile.contactEmail || user?.email || '',
                contactPhone: profile.contactPhone || user?.phone || '',
                isCampActive: profile.isCampActive ?? true,
                location: profile.location || { lat: null, lng: null }
            });
        }
    }, [profile, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.put('/hospital/profile', formData);
            setProfile(data);
            toast.success('Hospital profile updated successfully!');
        } catch (err) {
            toast.error('Update failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="relative h-48 rounded-3xl overflow-hidden shadow-lg p-8 flex items-center bg-medical-dark text-white mb-6">
                <div className="z-10 relative">
                    <h1 className="text-3xl font-black mb-1">Institutional Profile</h1>
                    <p className="text-gray-400">Manage your hospital identity and donation camp settings</p>
                </div>
                <img
                    src="/assets/superhero_banner.png"
                    className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-20 mix-blend-screen"
                    style={{ maskImage: 'linear-gradient(to left, white, transparent)' }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Hospital / Camp Name</label>
                                    <div className="input-group">
                                        <Building2 size={18} />
                                        <input
                                            type="text"
                                            required
                                            className="input-field"
                                            value={formData.hospitalName}
                                            onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                                            placeholder="City General Hospital"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Public Email</label>
                                    <div className="input-group">
                                        <Mail size={18} />
                                        <input
                                            type="email"
                                            className="input-field"
                                            value={formData.contactEmail}
                                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                            placeholder="contact@hospital.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Public Phone</label>
                                    <div className="input-group">
                                        <Phone size={18} />
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={formData.contactPhone}
                                            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                            placeholder="+1 234 567 890"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Full Address / Site Details</label>
                                    <textarea
                                        required
                                        className="input-field min-h-24 py-3"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Enter complete building and street details..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">City</label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (navigator.geolocation) {
                                                    toast.loading('Pinpointing camp location...', { id: 'camp-geo' });
                                                    navigator.geolocation.getCurrentPosition(async (position) => {
                                                        const { latitude, longitude } = position.coords;
                                                        try {
                                                            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                                                            const data = await res.json();
                                                            const city = data.address.city || data.address.town || data.address.village || '';
                                                            const pincode = data.address.postcode || '';
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                city,
                                                                pincode,
                                                                location: { lat: latitude, lng: longitude }
                                                            }));
                                                            toast.success('Exact coordinates pinned!', { id: 'camp-geo' });
                                                        } catch (err) {
                                                            toast.error('Could not fetch address', { id: 'camp-geo' });
                                                        }
                                                    }, () => toast.error('Location denied', { id: 'camp-geo' }), { enableHighAccuracy: true });
                                                }
                                            }}
                                            className="text-[10px] text-medical-secondary font-black uppercase tracking-tighter hover:underline flex items-center gap-1"
                                        >
                                            <MapPin size={10} /> Pin Exact GPS
                                        </button>
                                    </div>
                                    <div className="input-group">
                                        <MapPin size={18} />
                                        <input
                                            type="text"
                                            required
                                            className="input-field"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Pincode</label>
                                    <div className="input-group">
                                        <MapPin size={18} />
                                        <input
                                            type="text"
                                            required
                                            className="input-field"
                                            value={formData.pincode}
                                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-medical-secondary/5 rounded-2xl border border-medical-secondary/10">
                                <input
                                    type="checkbox"
                                    id="isCampActive"
                                    className="w-5 h-5 rounded accent-medical-secondary"
                                    checked={formData.isCampActive}
                                    onChange={(e) => setFormData({ ...formData, isCampActive: e.target.checked })}
                                />
                                <div className="flex flex-col">
                                    <label htmlFor="isCampActive" className="font-bold text-gray-800 cursor-pointer">Camp Active Status</label>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">When active, your location QR will be visible to donors.</p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-secondary w-full py-4 flex items-center justify-center gap-2 text-lg font-bold shadow-lg"
                            >
                                {loading ? 'Saving Changes...' : <><Save size={20} /> Update Institution Profile</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-6">
                    {/* QR Code Card */}
                    <div className="glass-card p-6 flex flex-col items-center justify-center text-center space-y-4 border-t-4 border-medical-secondary">
                        <div className="bg-white p-3 rounded-3xl shadow-md border border-gray-100" id="camp-qr">
                            <QRCodeSVG
                                value={JSON.stringify({
                                    type: 'BLOOD_CAMP',
                                    name: profile?.hospitalName,
                                    address: profile?.address,
                                    city: profile?.city,
                                    email: profile?.contactEmail,
                                    phone: profile?.contactPhone,
                                    isActive: profile?.isCampActive,
                                    location: profile?.location,
                                    mapsUrl: profile?.location?.lat
                                        ? `https://www.google.com/maps?q=${profile.location.lat},${profile.location.lng}`
                                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile?.hospitalName + ' ' + (profile?.city || ''))}`
                                })}
                                size={180}
                                level="H"
                                includeMargin={true}
                            />
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-xl text-gray-800 tracking-tight">Camp Location QR</h4>
                            <p className="text-xs text-gray-500 leading-relaxed px-4">
                                Display this at your facility. Donors scan this to navigate to your donation camp.
                            </p>
                            <button
                                onClick={() => {
                                    const svg = document.querySelector('#camp-qr svg');
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
                                }}
                                className="w-full mt-4 bg-gray-50 hover:bg-gray-100 p-3 rounded-xl border border-gray-100 text-medical-secondary text-sm font-bold transition-all flex items-center justify-center gap-2"
                            >
                                <QrCode size={18} /> Download High-Res QR
                            </button>
                        </div>
                    </div>

                    {/* Admin/Account Card */}
                    <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                <Activity size={32} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Hospital Admin Info</h4>
                                <p className="text-blue-100 text-[11px] uppercase tracking-widest font-medium">Logged in as {user?.name}</p>
                            </div>
                            <div className="w-full space-y-2 pt-4 border-t border-white/10 text-left">
                                <div className="flex items-center gap-3">
                                    <Mail size={14} className="text-blue-200" />
                                    <span className="text-xs font-mono truncate">{user?.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={14} className="text-blue-200" />
                                    <span className="text-xs font-mono">{user?.phone}</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                    </div>

                    {/* Help Card */}
                    <div className="glass-card p-6 bg-amber-50 border-amber-100">
                        <div className="flex gap-4">
                            <div className="p-2 bg-white rounded-lg text-amber-500 shadow-sm h-fit">
                                <Info size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-amber-800 text-sm">Need Help?</h4>
                                <p className="text-[10px] text-amber-700 mt-1">
                                    Updating your profile ensures that donors find the correct location and contact details for your donation camp.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
