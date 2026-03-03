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
            <div className="glass-card p-8 bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black text-gray-800 tracking-tight">Join the Movement</h2>
                    <p className="text-gray-500 mt-2 font-medium">Create your account to start saving lives today</p>
                </div>

                {/* Role Selector */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    <button
                        type="button"
                        onClick={() => setRole('DONOR')}
                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${role === 'DONOR' ? 'border-medical-primary bg-medical-primary/5 text-medical-primary shadow-lg shadow-medical-primary/10' : 'border-gray-100 text-gray-400 grayscale'
                            }`}
                    >
                        <User size={36} />
                        <span className="text-xs font-black uppercase tracking-widest">Donor</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('HOSPITAL')}
                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${role === 'HOSPITAL' ? 'border-medical-secondary bg-medical-secondary/5 text-medical-secondary shadow-lg shadow-medical-secondary/10' : 'border-gray-100 text-gray-400 grayscale'
                            }`}
                    >
                        <Building2 size={36} />
                        <span className="text-xs font-black uppercase tracking-widest">Hospital</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('ADMIN')}
                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${role === 'ADMIN' ? 'border-medical-dark bg-medical-dark/5 text-medical-dark shadow-lg shadow-medical-dark/10' : 'border-gray-100 text-gray-400 grayscale'
                            }`}
                    >
                        <Shield size={36} />
                        <span className="text-xs font-black uppercase tracking-widest">Admin</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Common Fields */}
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="input-group group focus-within:ring-2 focus-within:ring-medical-primary/20 transition-all">
                                <User size={18} className="text-gray-400 group-focus-within:text-medical-primary" />
                                <input name="name" required className="input-field border-none shadow-none focus:ring-0" placeholder="John Doe" value={formData.name} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="input-group group focus-within:ring-2 focus-within:ring-medical-primary/20 transition-all">
                                <Mail size={18} className="text-gray-400 group-focus-within:text-medical-primary" />
                                <input name="email" type="email" required className="input-field border-none shadow-none focus:ring-0" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secret Password</label>
                            <div className="input-group group focus-within:ring-2 focus-within:ring-medical-primary/20 transition-all">
                                <Lock size={18} className="text-gray-400 group-focus-within:text-medical-primary" />
                                <input name="password" type="password" required className="input-field border-none shadow-none focus:ring-0" placeholder="••••••••" value={formData.password} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Contact</label>
                            <div className="input-group group focus-within:ring-2 focus-within:ring-medical-primary/20 transition-all">
                                <Phone size={18} className="text-gray-400 group-focus-within:text-medical-primary" />
                                <input name="phone" required className="input-field border-none shadow-none focus:ring-0" placeholder="+91 12345 67890" value={formData.phone} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>

                    {/* Role Specific Fields */}
                    <div className="space-y-5">
                        {role === 'DONOR' && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Blood Group</label>
                                <div className="input-group group focus-within:ring-2 focus-within:ring-medical-primary/20 transition-all">
                                    <Droplets size={18} className="text-gray-400 group-focus-within:text-medical-primary" />
                                    <select name="details.bloodGroup" required className="input-field border-none shadow-none focus:ring-0" value={formData.details.bloodGroup} onChange={handleInputChange}>
                                        <option value="">Select Group</option>
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}

                        {role === 'HOSPITAL' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hospital Name</label>
                                    <div className="input-group group">
                                        <Building2 size={18} className="text-gray-400" />
                                        <input name="details.hospitalName" required className="input-field border-none focus:ring-0" placeholder="City General Hospital" value={formData.details.hospitalName} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Address</label>
                                    <div className="input-group group">
                                        <MapPin size={18} className="text-gray-400" />
                                        <input name="details.address" required className="input-field border-none focus:ring-0" placeholder="Street Address, Area" value={formData.details.address} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </>
                        )}

                        {role === 'ADMIN' && (
                            <div className="p-8 bg-medical-dark/5 rounded-3xl border border-medical-dark/10 flex flex-col items-center text-center gap-4">
                                <Shield className="text-medical-dark animate-pulse" size={40} />
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-gray-800 uppercase tracking-[0.2em]">Administrative Security</p>
                                    <p className="text-[10px] text-gray-500 italic max-w-[180px]">Protected system moderator account. Specialized credentials required.</p>
                                </div>
                            </div>
                        )}

                        {role !== 'ADMIN' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current City</label>
                                    <div className="input-group group">
                                        <MapPin size={18} className="text-gray-400" />
                                        <input name="details.city" required className="input-field border-none focus:ring-0" placeholder="City Name" value={formData.details.city} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pincode</label>
                                    <div className="input-group group">
                                        <MapPin size={18} className="text-gray-400" />
                                        <input name="details.pincode" required className="input-field border-none focus:ring-0" placeholder="123 456" value={formData.details.pincode} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="md:col-span-2 pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 rounded-2xl font-black text-white transition-all duration-300 shadow-xl uppercase tracking-[0.2em] text-sm transform active:scale-[0.98] ${role === 'DONOR' ? 'bg-medical-primary hover:bg-medical-primary/90 hover:shadow-medical-primary/20' :
                                    role === 'HOSPITAL' ? 'bg-medical-secondary hover:bg-medical-secondary/90 hover:shadow-medical-secondary/20' :
                                        'bg-medical-dark hover:bg-black hover:shadow-medical-dark/20'
                                }`}
                        >
                            {loading ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div> : 'Create Account'}
                        </button>
                    </div>
                </form>

                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col items-center sm:items-start">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Existing Member?</p>
                        <Link to="/login" className="text-sm font-black text-medical-primary hover:text-medical-primary/80 transition-colors uppercase tracking-widest mt-1">
                            Sign In Now
                        </Link>
                    </div>
                    <Link
                        to="/login"
                        state={{ fromAdmin: true }}
                        className="flex items-center gap-3 text-medical-dark font-black tracking-[0.2em] bg-medical-dark/5 px-6 py-3 rounded-full hover:bg-medical-dark hover:text-white transition-all transform hover:scale-105 shadow-sm text-[10px]"
                    >
                        <Shield size={16} /> ADMIN PORTAL
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
