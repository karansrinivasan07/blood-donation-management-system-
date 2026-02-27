import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplet, User, LogOut, LayoutDashboard, HeartPulse } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-medical-primary font-bold text-xl">
                    <Droplet fill="currentColor" size={28} />
                    <span>BloodLife</span>
                </Link>

                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            {user.role === 'DONOR' && (
                                <div className="hidden md:flex gap-6">
                                    <Link to="/donor/dashboard" className="text-gray-600 hover:text-medical-primary font-medium">Dashboard</Link>
                                    <Link to="/donor/my-pledges" className="text-gray-600 hover:text-medical-primary font-medium">My Pledges</Link>
                                    <Link to="/donor/profile" className="text-gray-600 hover:text-medical-primary font-medium">Profile</Link>
                                </div>
                            )}
                            {user.role === 'HOSPITAL' && (
                                <div className="hidden md:flex gap-6">
                                    <Link to="/hospital/dashboard" className="text-gray-600 hover:text-medical-primary font-medium">Hospital Portal</Link>
                                    <Link to="/hospital/create-request" className="text-gray-600 hover:text-medical-primary font-medium">Post Request</Link>
                                </div>
                            )}
                            {user.role === 'ADMIN' && (
                                <div className="hidden md:flex gap-6">
                                    <Link to="/admin/analytics" className="text-gray-600 hover:text-medical-primary font-medium">Analytics</Link>
                                    <Link to="/admin/users" className="text-gray-600 hover:text-medical-primary font-medium">Users</Link>
                                </div>
                            )}

                            <div className="flex items-center gap-4 border-l pl-6 ml-2">
                                <span className="text-sm font-semibold text-gray-700 hidden sm:inline">{user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-medical-primary transition-colors"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-gray-600 hover:text-medical-primary font-medium">Login</Link>
                            <Link to="/register" className="btn-primary">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
