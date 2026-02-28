import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        <div className="max-w-md mx-auto mt-10">
            <div className="glass-card p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-medical-primary/10 rounded-full text-medical-primary mb-4">
                        <LogIn size={32} />
                    </div>
                    <h2 className="text-2xl font-bold">Welcome Back</h2>
                    <p className="text-gray-500">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                        <div className="input-group">
                            <Mail size={18} />
                            <input
                                type="email"
                                required
                                className="input-field"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
                        <div className="input-group">
                            <Lock size={18} />
                            <input
                                type="password"
                                required
                                className="input-field"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3 font-semibold flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>Sign In <LogIn size={18} /></>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-600 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-medical-primary font-semibold hover:underline">
                        Register for free
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
