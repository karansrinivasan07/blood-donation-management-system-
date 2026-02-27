import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { UserPlus, Mail, Lock, User, Phone, MapPin, Building2, Droplets } from 'lucide-react';

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
            else navigate('/hospital/dashboard');
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Registration failed';
            toast.error(errorMsg);
            console.error('Detailed Registration Error:', err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-6">
            <div className="glass-card p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold">Create Account</h2>
                    <p className="text-gray-500">Join the movement to save lives</p>
                </div>

                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setRole('DONOR')}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${role === 'DONOR' ? 'border-medical-primary bg-medical-primary/5 text-medical-primary' : 'border-gray-100 text-gray-400 grayscale'
                            }`}
                    >
                        <User size={32} />
                        <span className="font-bold">I'm a Donor</span>
                    </button>
                    <button
                        onClick={() => setRole('HOSPITAL')}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${role === 'HOSPITAL' ? 'border-medical-secondary bg-medical-secondary/5 text-medical-secondary' : 'border-gray-100 text-gray-400 grayscale'
                            }`}
                    >
                        <Building2 size={32} />
                        <span className="font-bold">Hospital/Bank</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* General Fields */}
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                            <div className="input-group">
                                <User size={18} />
                                <input name="name" required className="input-field" placeholder="John Doe" value={formData.name} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <div className="input-group">
                                <Mail size={18} />
                                <input name="email" type="email" required className="input-field" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <div className="input-group">
                                <Lock size={18} />
                                <input name="password" type="password" required className="input-field" placeholder="••••••••" value={formData.password} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Phone Number</label>
                            <div className="input-group">
                                <Phone size={18} />
                                <input name="phone" required className="input-field" placeholder="+1 234 567 890" value={formData.phone} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>

                    {/* Role Specific Fields */}
                    <div className="space-y-4">
                        {role === 'DONOR' ? (
                            <>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Blood Group</label>
                                    <div className="input-group">
                                        <Droplets size={18} />
                                        <select name="details.bloodGroup" required className="input-field" value={formData.details.bloodGroup} onChange={handleInputChange}>
                                            <option value="">Select Blood Group</option>
                                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Hospital Name</label>
                                    <div className="input-group">
                                        <Building2 size={18} />
                                        <input name="details.hospitalName" required className="input-field" placeholder="City General Hospital" value={formData.details.hospitalName} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Full Address</label>
                                    <div className="input-group">
                                        <MapPin size={18} />
                                        <input name="details.address" required className="input-field" placeholder="123 Medical St" value={formData.details.address} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">City</label>
                            <div className="input-group">
                                <MapPin size={18} />
                                <input name="details.city" required className="input-field" placeholder="New York" value={formData.details.city} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Pincode</label>
                            <div className="input-group">
                                <MapPin size={18} />
                                <input name="details.pincode" required className="input-field" placeholder="10001" value={formData.details.pincode} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-white transition-all shadow-lg ${role === 'DONOR' ? 'bg-medical-primary hover:bg-medical-primary/90' : 'bg-medical-secondary hover:bg-medical-secondary/90'
                                }`}
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Create Account'}
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-gray-600 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-medical-primary hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
