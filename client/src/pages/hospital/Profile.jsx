import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Building2, MapPin, Save, Info } from 'lucide-react';

const Profile = () => {
    const { user, profile, setProfile } = useAuth();
    const [formData, setFormData] = useState({
        hospitalName: profile?.hospitalName || '',
        address: profile?.address || '',
        city: profile?.city || '',
        pincode: profile?.pincode || ''
    });
    const [loading, setLoading] = useState(false);

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
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Hospital Profile</h1>
                <p className="text-gray-500">Manage your institution's public profile</p>
            </div>

            <div className="glass-card p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Hospital Name</label>
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
                        <label className="text-sm font-medium">Full Address</label>
                        <textarea
                            required
                            className="input-field min-h-24 py-3"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">City</label>
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

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
                <div className="p-3 bg-white rounded-xl text-medical-secondary h-fit shadow-sm"><Info size={24} /></div>
                <div>
                    <h4 className="font-bold text-gray-800">Administrator Contact</h4>
                    <p className="text-sm text-gray-700">Account: {user?.name}</p>
                    <p className="text-sm text-gray-700">E-mail: {user?.email}</p>
                    <p className="text-sm text-gray-700">Phone: {user?.phone}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
