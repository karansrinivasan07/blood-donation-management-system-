import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Users, Droplets, Building2, TrendingUp, ShieldCheck, Activity } from 'lucide-react';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const { data } = await api.get('/admin/analytics');
            setData(data);
        } catch (err) {
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-medical-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">Aggregating System Intelligence...</p>
            </div>
        </div>
    );

    const COLORS = ['#e11d48', '#2563eb', '#0ea5e9', '#f59e0b', '#8b5cf6', '#10b981', '#f43f5e', '#6366f1'];

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">System Intelligence</h1>
                    <p className="text-gray-400 font-medium">Real-time platform performance and distribution metrics</p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-2xl border border-green-100">
                    <ShieldCheck size={18} />
                    <span className="text-xs font-black uppercase tracking-wider">System Operational</span>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Registered Donors', value: data.metrics.totalDonors, icon: <Users size={20} />, color: 'text-blue-600', bg: 'bg-blue-50/50' },
                    { label: 'Partner Hospitals', value: data.metrics.totalHospitals, icon: <Building2 size={20} />, color: 'text-purple-600', bg: 'bg-purple-50/50' },
                    { label: 'Total Requests', value: data.metrics.totalRequests, icon: <Droplets size={20} />, color: 'text-red-600', bg: 'bg-red-50/50' },
                    { label: 'Active Survival Needs', value: data.metrics.openRequests, icon: <Activity size={20} />, color: 'text-green-600', bg: 'bg-green-50/50' },
                ].map((stat, i) => (
                    <div key={i} className={`${stat.bg} p-6 rounded-3xl border border-white relative overflow-hidden group hover:shadow-lg transition-all`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            {stat.icon}
                        </div>
                        <div className={`w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-4xl font-black text-gray-800 tracking-tighter">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Blood Group Demands */}
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 shadow-gray-200/50">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                            Demand Curve
                        </h3>
                        <span className="text-[10px] bg-red-50 text-red-600 px-3 py-1 rounded-full font-black uppercase tracking-widest">Urgent Needs</span>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.requestsByBloodGroup}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="count" fill="#e11d48" radius={[10, 10, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donor Inventory Distribution */}
                <div className="bg-medical-dark p-8 rounded-[40px] text-white shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black flex items-center gap-2">
                            Donor Inventory
                        </h3>
                        <span className="text-[10px] bg-white/10 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest border border-white/10 italic">Platform Life-Supply</span>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.donorsByBloodGroup}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={8}
                                    dataKey="count"
                                    nameKey="_id"
                                    stroke="none"
                                >
                                    {data.donorsByBloodGroup.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                    itemStyle={{ color: 'white' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4">
                        {data.donorsByBloodGroup.slice(0, 4).map((d, i) => (
                            <div key={i} className="text-center">
                                <p className="text-[10px] font-black text-gray-500 uppercase">{d._id}</p>
                                <p className="text-lg font-black tracking-tighter">{d.count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
