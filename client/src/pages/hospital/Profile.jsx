import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Building2, MapPin, Save, Info, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const Profile = () => {
    const { user, profile, setProfile } = useAuth();
    const [formData, setFormData] = useState({
        hospitalName: profile?.hospitalName || '',
        address: profile?.address || '',
        city: profile?.city || '',
        pincode: profile?.pincode || '',
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
                location: profile.location || { lat: null, lng: null }
            });
        }
    }, [profile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.put('/hospital/profile', formData);
            setProfile(data);
            toast.success('Hospital profile updated!');
        } catch (err) {
            toast.error('Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Hospital & Camp Profile</h1>
                <p className="text-gray-500">Manage your institution's profile and donation camp details</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Hospital/Camp Name</label>
                            <div className="input-group">
                                <Building2 size={18} />
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    value={formData.hospitalName}
                                    onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Address (Camp Site)</label>
                            <textarea
                                required
                                className="input-field min-h-24 py-3"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium">City</label>
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
                                                        toast.success('Camp location pinned!', { id: 'camp-geo' });
                                                    } catch (err) {
                                                        toast.error('Could not fetch city', { id: 'camp-geo' });
                                                    }
                                                }, () => toast.error('Location denied', { id: 'camp-geo' }), { enableHighAccuracy: true });
                                            }
                                        }}
                                        className="text-[10px] text-medical-secondary font-bold uppercase tracking-wider hover:underline"
                                    >
                                        Pin GPS
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
                                <label className="text-sm font-medium">Pincode</label>
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-secondary w-full py-3 flex items-center justify-center gap-2 font-bold"
                        >
                            {loading ? 'Saving...' : <><Save size={18} /> Update Details</>}
                        </button>
                    </form>
                </div>

                <div className="space-y-6">
                    <div className="glass-card p-6 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100" id="camp-qr">
                            <QRCodeSVG
                                value={JSON.stringify({
                                    type: 'BLOOD_CAMP',
                                    name: profile?.hospitalName,
                                    address: profile?.address,
                                    city: profile?.city,
                                    location: profile?.location,
                                    mapsUrl: profile?.location?.lat
                                        ? `https://www.google.com/maps?q=${profile.location.lat},${profile.location.lng}`
                                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile?.hospitalName + ' ' + profile?.city)}`
                                })}
                                size={160}
                                level="H"
                                includeMargin={true}
                            />
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-gray-800">Camp Location QR</h4>
                            <p className="text-xs text-gray-500">
                                Donors can scan this to see camp details and navigate to this site.
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
                                className="text-medical-secondary text-sm font-bold hover:underline flex items-center gap-1 mx-auto"
                            >
                                <QrCode size={14} /> Download QR Code
                            </button>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
                        <div className="p-3 bg-white rounded-xl text-medical-secondary h-fit shadow-sm"><Info size={24} /></div>
                        <div>
                            <h4 className="font-bold text-gray-800">Admin Contact</h4>
                            <p className="text-sm text-gray-700 font-medium">{user?.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{user?.email}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{user?.phone}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
