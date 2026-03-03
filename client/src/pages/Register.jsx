import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, Phone, MapPin, Building2, Droplets, Shield } from 'lucide-react';

const Register = () => {
    const [role, setRole] = useState('DONOR');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        details: {
            bloodGroup: '',
            city: '',
            pincode: '',
            hospitalName: '',
            address: ''
        }
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('details.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                details: { ...prev.details, [field]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register({ ...formData, role });
            toast.success('Registration successful!');
            if (role === 'DONOR') navigate('/donor/dashboard');
            else if (role === 'HOSPITAL') navigate('/hospital/dashboard');
            else if (role === 'ADMIN') navigate('/admin/analytics');
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Registration failed';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-6 px-4 pb-20">
            <div className="glass-card p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold">Join the Movement</h2>
                    <p className="text-gray-500">Create an account to save lives</p>
                </div>

                {/* Role Selector */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    <button
                        type="button"
                        onClick={() => setRole('DONOR')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${role === 'DONOR' ? 'border-medical-primary bg-medical-primary/5 text-medical-primary font-bold' : 'border-gray-100 text-gray-400 grayscale'
                            }`}
                    >
                        <User size={32} />
                        <span className="text-xs">Donor</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('HOSPITAL')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${role === 'HOSPITAL' ? 'border-medical-secondary bg-medical-secondary/5 text-medical-secondary font-bold' : 'border-gray-100 text-gray-400 grayscale'
                            }`}
                    >
                        <Building2 size={32} />
                        <span className="text-xs">Hospital</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('ADMIN')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${role === 'ADMIN' ? 'border-medical-dark bg-medical-dark/5 text-medical-dark font-bold' : 'border-gray-100 text-gray-400 grayscale'
                            }`}
                    >
                        <Shield size={32} />
                        <span className="text-xs">Admin</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Common Fields */}
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase">Full Name</label>
                            <div className="input-group">
                                <User size={18} />
                                <input name="name" required className="input-field" placeholder="John Doe" value={formData.name} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase">Email Address</label>
                            <div className="input-group">
                                <Mail size={18} />
                                <input name="email" type="email" required className="input-field" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase">Password</label>
                            <div className="input-group">
                                <Lock size={18} />
                                <input name="password" type="password" required className="input-field" placeholder="••••••••" value={formData.password} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase">Phone Number</label>
                            <div className="input-group">
                                <Phone size={18} />
                                <input name="phone" required className="input-field" placeholder="+91 12345 67890" value={formData.phone} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>

                    {/* Role Specific Fields */}
                    <div className="space-y-4">
                        {role === 'DONOR' && (
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-600 uppercase">Blood Group</label>
                                <div className="input-group">
                                    <Droplets size={18} />
                                    <select name="details.bloodGroup" required className="input-field" value={formData.details.bloodGroup} onChange={handleInputChange}>
                                        <option value="">Select Group</option>
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}

                        {role === 'HOSPITAL' && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-600 uppercase">Hospital Name</label>
                                    <div className="input-group">
                                        <Building2 size={18} />
                                        <input name="details.hospitalName" required className="input-field" placeholder="City General Hospital" value={formData.details.hospitalName} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-600 uppercase">Full Address</label>
                                    <div className="input-group">
                                        <MapPin size={18} />
                                        <input name="details.address" required className="input-field" placeholder="Street Address" value={formData.details.address} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </>
                        )}

                        {role === 'ADMIN' && (
                            <div className="p-6 bg-medical-dark/5 rounded-2xl border border-medical-dark/10 flex flex-col items-center text-center gap-2">
                                <Shield className="text-medical-dark" size={32} />
                                <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Administrative Role</p>
                                <p className="text-[10px] text-gray-500 italic">No additional location or blood data required for system admins.</p>
                            </div>
                        )}

                        {role !== 'ADMIN' && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-600 uppercase">City</label>
                                    <div className="input-group">
                                        <MapPin size={18} />
                                        <input name="details.city" required className="input-field" placeholder="City Name" value={formData.details.city} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-600 uppercase">Pincode</label>
                                    <div className="input-group">
                                        <MapPin size={18} />
                                        <input name="details.pincode" required className="input-field" placeholder="123456" value={formData.details.pincode} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg uppercase tracking-widest text-sm ${role === 'DONOR' ? 'bg-medical-primary hover:bg-medical-primary/90' :
                                    role === 'HOSPITAL' ? 'bg-medical-secondary hover:bg-medical-secondary/90' :
                                        'bg-medical-dark hover:bg-medical-dark/90'
                                }`}
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div> : 'Create Account'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <p className="text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-medical-primary hover:underline">
                            Login here
                        </Link>
                    </p>
                    <Link
                        to="/login"
                        state={{ fromAdmin: true }}
                        className="flex items-center gap-2 text-medical-dark font-black tracking-widest bg-medical-dark/5 px-4 py-2 rounded-full hover:bg-medical-dark hover:text-white transition-all"
                    >
                        <Shield size={14} /> ADMIN PORTAL
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
