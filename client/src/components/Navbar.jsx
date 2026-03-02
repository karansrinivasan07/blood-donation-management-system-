import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplet, User, LogOut, LayoutDashboard, HeartPulse, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-medical-primary font-bold text-xl">
                        <Droplet fill="currentColor" size={28} />
                        <span>BloodLife</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="flex items-center gap-6">
                        {user ? (
                            <>
                                <div className="hidden md:flex items-center gap-6">
                                    {user.role === 'DONOR' && (
                                        <>
                                            <Link to="/donor/dashboard" className="text-gray-600 hover:text-medical-primary font-medium">Dashboard</Link>
                                            <Link to="/donor/my-pledges" className="text-gray-600 hover:text-medical-primary font-medium">My Pledges</Link>
                                            <Link to="/donor/leaderboard" className="text-gray-600 hover:text-medical-primary font-medium">Leaderboard</Link>
                                            <Link to="/donor/profile" className="text-gray-600 hover:text-medical-primary font-medium">Profile</Link>
                                        </>
                                    )}
                                    {user.role === 'HOSPITAL' && (
                                        <>
                                            <Link to="/hospital/dashboard" className="text-gray-600 hover:text-medical-primary font-medium">Hospital Portal</Link>
                                            <Link to="/hospital/create-request" className="text-gray-600 hover:text-medical-primary font-medium">Post Request</Link>
                                            <Link to="/hospital/profile" className="text-gray-600 hover:text-medical-primary font-medium">Profile</Link>
                                        </>
                                    )}
                                    {user.role === 'ADMIN' && (
                                        <>
                                            <Link to="/admin/analytics" className="text-gray-600 hover:text-medical-primary font-medium">Analytics</Link>
                                            <Link to="/admin/users" className="text-gray-600 hover:text-medical-primary font-medium">Users</Link>
                                        </>
                                    )}

                                    <div className="flex items-center gap-4 border-l pl-6 ml-2">
                                        <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                                        <button
                                            onClick={handleLogout}
                                            className="p-2 text-gray-400 hover:text-medical-primary transition-colors"
                                        >
                                            <LogOut size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Mobile Toggle */}
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="md:hidden p-2 text-gray-600 hover:text-medical-primary"
                                >
                                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-gray-600 hover:text-medical-primary font-medium">Login</Link>
                                <Link to="/register" className="btn-primary">Register</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {user && isOpen && (
                    <div className="md:hidden py-4 border-t border-gray-50 space-y-2">
                        <div className="px-2 pb-3 mb-3 border-b border-gray-50 flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-800">{user.name}</span>
                            <span className="text-[10px] bg-medical-primary/10 text-medical-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">{user.role}</span>
                        </div>

                        {user.role === 'DONOR' && (
                            <>
                                <Link to="/donor/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">Dashboard</Link>
                                <Link to="/donor/my-pledges" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">My Pledges</Link>
                                <Link to="/donor/leaderboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">Leaderboard</Link>
                                <Link to="/donor/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">Profile</Link>
                            </>
                        )}
                        {user.role === 'HOSPITAL' && (
                            <>
                                <Link to="/hospital/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">Hospital Dashboard</Link>
                                <Link to="/hospital/create-request" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">Post Request</Link>
                                <Link to="/hospital/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">Profile</Link>
                            </>
                        )}
                        {user.role === 'ADMIN' && (
                            <>
                                <Link to="/admin/analytics" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">Analytics</Link>
                                <Link to="/admin/users" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-xl font-medium">Users</Link>
                            </>
                        )}

                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl font-bold flex items-center gap-2 mt-4"
                        >
                            <LogOut size={18} /> Logout Account
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
