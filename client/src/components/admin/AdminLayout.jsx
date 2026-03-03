import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, Users, MessageSquare, ShieldAlert, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { logout } = useAuth();

    const menuItems = [
        { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/admin/analytics' },
        { icon: <Users size={20} />, label: 'User Management', path: '/admin/users' },
        { icon: <MessageSquare size={20} />, label: 'Blood Requests', path: '/admin/requests' },
        // { icon: <ShieldAlert size={20} />, label: 'System Health', path: '/admin/health' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 -m-8"> {/* Negative margin to override container class if needed */}
            {/* Sidebar */}
            <aside className="w-72 bg-medical-dark text-white p-6 flex flex-col fixed h-full">
                <div className="mb-10 flex items-center gap-3 px-2">
                    <div className="bg-white/10 p-2 rounded-xl border border-white/20">
                        <ShieldAlert className="text-medical-primary" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter">ADMIN PORT</h1>
                        <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">System Control</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${isActive
                                    ? 'bg-medical-primary text-white shadow-lg shadow-medical-primary/20 scale-105'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`
                            }
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/10">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl font-bold text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 p-10">
                <div className="max-w-7xl mx-auto mt-14">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
