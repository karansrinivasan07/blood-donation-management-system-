import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { LogIn, Mail, Lock, Shield } from 'lucide-react';
import { useEffect } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const location = useLocation();
    const [isAdminMode, setIsAdminMode] = useState(false);

    useEffect(() => {
        if (location.state?.fromAdmin) {
            setIsAdminMode(true);
        }
    }, [location]);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await login(email, password);
            toast.success(`Welcome back, ${user.name}!`);

            // Redirect based on role
            if (user.role === 'DONOR') navigate('/donor/dashboard');
            else if (user.role === 'HOSPITAL') navigate('/hospital/dashboard');
            else if (user.role === 'ADMIN') navigate('/admin/analytics');
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Login failed';
            toast.error(errorMsg);
            console.error('Detailed Login Error:', err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 min-h-[600px]">
            <div className={`hidden md:block relative transition-all duration-700 ${isAdminMode ? 'bg-medical-dark' : 'bg-red-600'}`}>
                <img
                    src={isAdminMode ? "https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?auto=format&fit=crop&q=80&w=1000" : "/assets/superhero_banner.png"}
                    className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                    alt="Banner"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-10">
                    <h2 className="text-3xl font-black text-white mb-2">
                        {isAdminMode ? 'System Control Center' : "Be Someone's Superhero"}
                    </h2>
                    <p className="text-gray-300 font-medium">
                        {isAdminMode ? 'Managing the lifeblood of the platform with precision and care.' : 'Your single donation can save up to three lives. Start your journey today.'}
                    </p>
                </div>
            </div>

            <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="text-center mb-8">
                    <button
                        onClick={() => setIsAdminMode(!isAdminMode)}
                        className={`inline-flex items-center justify-center p-4 rounded-full mb-4 transition-all transform hover:scale-110 ${isAdminMode ? 'bg-medical-dark text-white shadow-xl shadow-medical-dark/20' : 'bg-medical-primary/10 text-medical-primary'}`}
                    >
                        {isAdminMode ? <Shield size={32} /> : <LogIn size={32} />}
                    </button>
                    <h2 className="text-3xl font-black text-gray-800 tracking-tight">
                        {isAdminMode ? 'Admin Portal' : 'Welcome Back'}
                    </h2>
                    <p className="text-gray-500 font-medium italic">
                        {isAdminMode ? 'Secure login for system moderators' : 'Sign in to your account'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Identity/Email</label>
                        <div className="input-group">
                            <Mail size={18} className="text-gray-400" />
                            <input
                                type="email"
                                required
                                className="input-field border-none shadow-none focus:ring-0"
                                placeholder="admin@blood.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Secret Key</label>
                        <div className="input-group">
                            <Lock size={18} className="text-gray-400" />
                            <input
                                type="password"
                                required
                                className="input-field border-none shadow-none focus:ring-0"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 font-black rounded-2xl flex items-center justify-center gap-2 transform active:scale-95 transition-all shadow-xl uppercase tracking-widest text-sm ${isAdminMode ? 'bg-medical-dark text-white hover:bg-black' : 'btn-primary'}`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>{isAdminMode ? 'Enter Command Center' : 'Sign In'} <LogIn size={18} /></>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-6 border-t border-gray-50 flex items-center justify-between text-xs">
                    <p className="text-gray-400 font-bold uppercase tracking-widest">
                        {isAdminMode ? 'Standard User?' : 'System Mod?'}
                    </p>
                    <button
                        onClick={() => setIsAdminMode(!isAdminMode)}
                        className="text-medical-primary font-black uppercase tracking-widest hover:underline"
                    >
                        {isAdminMode ? 'Switch to Donor' : 'Switch to Admin Portal'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
