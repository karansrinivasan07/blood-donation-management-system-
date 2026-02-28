import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, Users, Activity, Droplet } from 'lucide-react';
import api from '../api/axios';

const Home = () => {
    const [stats, setStats] = useState({ requests: 0, donors: 0, cities: 0 });

    useEffect(() => {
        // In a real app, fetch these from an public analytics endpoint
        setStats({ requests: 124, donors: 850, cities: 12 });
    }, []);

    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="relative flex flex-col md:flex-row items-center justify-between gap-12 pt-10">
                <div className="flex-1 space-y-6">
                    <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                        Every Drop Counts. <br />
                        <span className="text-medical-primary">Save a Life Today.</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-lg">
                        Connect directly with hospitals in need or find blood donors nearby. Join the network that saves lives through timely blood donation.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link to="/register" className="btn-primary flex items-center gap-2 text-lg px-8 py-3">
                            Start Donating
                        </Link>
                        <Link to="/login" className="px-8 py-3 border-2 border-medical-dark/10 rounded-lg hover:border-medical-primary hover:text-medical-primary font-semibold transition-all">
                            Login to Post Request
                        </Link>
                    </div>
                </div>

                <div className="flex-1 relative">
                    <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 bg-white">
                        <img
                            src="/assets/superhero_banner.png"
                            alt="Superhero Blood Donation"
                            className="w-full h-auto"
                        />
                    </div>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-medical-primary/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-medical-secondary/10 rounded-full blur-3xl"></div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: <Droplet className="text-medical-primary" />, label: "Pending Requests", value: stats.requests, color: "bg-red-50" },
                    { icon: <Users className="text-medical-secondary" />, label: "Registered Donors", value: stats.donors, color: "bg-blue-50" },
                    { icon: <Heart className="text-pink-500" />, label: "Success Stories", value: "5,000+", color: "bg-pink-50" },
                ].map((stat, i) => (
                    <div key={i} className={`${stat.color} p-8 rounded-2xl flex items-center gap-6 border border-white`}>
                        <div className="p-4 bg-white rounded-xl shadow-sm">{stat.icon}</div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </section>

            {/* Quick Info */}
            <section className="bg-medical-dark text-white rounded-3xl p-12 relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-3xl font-bold mb-6">How it works?</h2>
                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-medical-primary flex items-center justify-center shrink-0">1</div>
                            <p><strong>Register & Build Profile:</strong> Create an account as a Donor or Hospital.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-medical-primary flex items-center justify-center shrink-0">2</div>
                            <p><strong>Request or Donate:</strong> Hospitals post requests, Donors browse and pledge based on eligibility and location.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-medical-primary flex items-center justify-center shrink-0">3</div>
                            <p><strong>Save Lives:</strong> Coordinate donation and update status once completed.</p>
                        </div>
                    </div>
                </div>
                <Droplet className="absolute -right-20 -bottom-20 text-white/5 w-96 h-96" />
            </section>
        </div>
    );
};

export default Home;
