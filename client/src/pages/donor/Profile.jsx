import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { User, Droplets, MapPin, Calendar, Save, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const Profile = () => {
    const { user, profile, setProfile } = useAuth();
    const [formData, setFormData] = useState({
        bloodGroup: profile?.bloodGroup || '',
        city: profile?.city || '',
        pincode: profile?.pincode || '',
        isAvailable: profile?.isAvailable ?? true,
        lastDonationDate: profile?.lastDonationDate ? new Date(profile.lastDonationDate).toISOString().split('T')[0] : '',
        location: profile?.location || { lat: null, lng: null }
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData({
                bloodGroup: profile.bloodGroup || '',
                city: profile.city || '',
                pincode: profile.pincode || '',
                isAvailable: profile.isAvailable ?? true,
                lastDonationDate: profile.lastDonationDate ? new Date(profile.lastDonationDate).toISOString().split('T')[0] : '',
                location: profile.location || { lat: null, lng: null }
            });
        }
    }, [profile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.put('/donor/profile', formData);
            setProfile(data);
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Donor Profile</h1>
                <p className="text-gray-500">Keep your information up to date to help hospitals find you</p>
            </div>

            <div className="glass-card p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Blood Group</label>
                            <div className="input-group">
                                <Droplets size={18} />
                                <select
                                    className="input-field"
                                    value={formData.bloodGroup}
                                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                >
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Last Donation Date</label>
                            <div className="input-group">
                                <Calendar size={18} />
                                <input
                                    type="date"
                                    className="input-field"
                                    value={formData.lastDonationDate}
                                    onChange={(e) => setFormData({ ...formData, lastDonationDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">City</label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (navigator.geolocation) {
                                            toast.loading('Pinpointing exact location...', { id: 'geo' });
                                            navigator.geolocation.getCurrentPosition(async (position) => {
                                                const { latitude, longitude, accuracy } = position.coords;
                                                try {
                                                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                                                    const data = await res.json();
                                                    const city = data.address.city || data.address.town || data.address.village || '';
                                                    const pincode = data.address.postcode || '';
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        city,
                                                        pincode,
                                                        location: { lat: latitude, lng: longitude, accuracy }
                                                    }));
                                                    toast.success(`Exact location pinned! (Accuracy: ${Math.round(accuracy)}m)`, { id: 'geo' });
                                                } catch (err) {
                                                    toast.error('Could not fetch city name', { id: 'geo' });
                                                }
                                            }, (err) => {
                                                toast.error('Location access denied', { id: 'geo' });
                                            }, {
                                                enableHighAccuracy: true,
                                                timeout: 10000,
                                                maximumAge: 0
                                            });
                                        }
                                    }}
                                    className="text-[10px] text-medical-primary font-bold uppercase tracking-wider hover:underline"
                                >
                                    Get Current Location
                                </button>
                            </div>
                            <div className="input-group">
                                <MapPin size={18} />
                                <input
                                    type="text"
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
                                    className="input-field"
                                    value={formData.pincode}
                                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl text-blue-700">
                        <input
                            type="checkbox"
                            id="isAvailable"
                            className="w-5 h-5 rounded accent-medical-secondary"
                            checked={formData.isAvailable}
                            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                        />
                        <label htmlFor="isAvailable" className="font-medium cursor-pointer">Available for donations</label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3 flex items-center justify-center gap-2 font-bold"
                    >
                        {loading ? 'Saving...' : <><Save size={18} /> Update Profile</>}
                    </button>
                </form>
            </div>

            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex gap-4">
                <div className="p-3 bg-white rounded-xl text-medical-primary h-fit shadow-sm"><User size={24} /></div>
                <div>
                    <h4 className="font-bold text-gray-800">Account Details</h4>
                    <p className="text-sm text-gray-500">Name: {user?.name}</p>
                    <p className="text-sm text-gray-500">Email: {user?.email}</p>
                    <p className="text-sm text-gray-400 mt-2 italic">To change account details, contact support.</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
