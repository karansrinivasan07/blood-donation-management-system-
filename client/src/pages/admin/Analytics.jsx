import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Droplets, Building2, TrendingUp } from 'lucide-react';

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

    if (loading) return <div>Loading Analytics...</div>;

    const COLORS = ['#e11d48', '#2563eb', '#0ea5e9', '#f59e0b', '#8b5cf6', '#10b981', '#f43f5e', '#6366f1'];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Platform Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Donors', value: data.metrics.totalDonors, icon: <Users />, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Hospitals', value: data.metrics.totalHospitals, icon: <Building2 />, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Blood Requests', value: data.metrics.totalRequests, icon: <Droplets />, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Active Needs', value: data.metrics.openRequests, icon: <TrendingUp />, color: 'text-green-600', bg: 'bg-green-50' },
                ].map((stat, i) => (
                    <div key={i} className={`${stat.bg} p-6 rounded-2xl`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 bg-white rounded-lg shadow-sm ${stat.color}`}>{stat.icon}</div>
                        </div>
                        <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                        <h3 className="text-3xl font-bold">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold mb-6">Requests by Blood Group</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.requestsByBloodGroup}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="_id" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#e11d48" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold mb-6">Donor Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.donorsByBloodGroup}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="_id"
                                >
                                    {data.donorsByBloodGroup.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
