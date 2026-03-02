import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Trophy, Medal, Award, Star, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaders();
    }, []);

    const fetchLeaders = async () => {
        try {
            const { data } = await api.get('/donor/leaderboard');
            setLeaders(data);
        } catch (err) {
            toast.error('Failed to load leaderboard');
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 py-6">
            <div className="text-center space-y-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-block p-4 bg-yellow-100 rounded-full text-yellow-600 mb-2"
                >
                    <Trophy size={48} />
                </motion.div>
                <h1 className="text-5xl font-black text-medical-dark tracking-tight">Nexus of <span className="text-medical-primary">Life-Savers</span></h1>
                <p className="text-gray-500 text-lg font-medium">Recognizing the heroes who give the gift of life.</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                >
                    {leaders.map((leader, index) => (
                        <motion.div
                            key={leader._id}
                            variants={itemVariants}
                            className={`glass-card p-6 flex items-center justify-between hover:scale-[1.02] transition-transform duration-300 ${index === 0 ? 'border-2 border-yellow-400 shadow-yellow-100' :
                                    index === 1 ? 'border-2 border-slate-300 shadow-slate-100' :
                                        index === 2 ? 'border-2 border-orange-300 shadow-orange-100' : ''
                                }`}
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 flex items-center justify-center font-black text-2xl text-gray-400">
                                    {index === 0 ? <Trophy className="text-yellow-500" /> :
                                        index === 1 ? <Medal className="text-slate-400" /> :
                                            index === 2 ? <Award className="text-orange-400" /> :
                                                `#${index + 1}`}
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-medical-dark">{leader.userId?.name || 'Anonymous Hero'}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <MapPin size={14} /> {leader.city} • <Droplets size={14} className="text-medical-primary" /> {leader.bloodGroup}
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-2xl font-black text-medical-primary flex items-center gap-2 justify-end">
                                    {leader.points.toLocaleString()} <Star size={20} fill="currentColor" />
                                </div>
                                <div className="text-xs uppercase tracking-widest font-bold text-gray-400">
                                    Impact Points
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {leaders.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <Users className="mx-auto text-gray-300 mb-4" size={48} />
                            <h3 className="text-xl font-bold text-gray-500">The hall of fame is empty</h3>
                            <p className="text-gray-400">Be the first hero to appear here!</p>
                        </div>
                    )}
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
                <div className="glass-card p-6 border-b-4 border-yellow-500">
                    <TrendingUp className="text-yellow-500 mb-3" size={32} />
                    <h4 className="font-bold text-lg">Top 1%</h4>
                    <p className="text-sm text-gray-500">Join the elite circle of consistent donors.</p>
                </div>
                <div className="glass-card p-6 border-b-4 border-medical-primary">
                    <Activity className="text-medical-primary mb-3" size={32} />
                    <h4 className="font-bold text-lg">Daily Impact</h4>
                    <p className="text-sm text-gray-500">Every donation helps up to 3 people.</p>
                </div>
                <div className="glass-card p-6 border-b-4 border-purple-500">
                    <Award className="text-purple-500 mb-3" size={32} />
                    <h4 className="font-bold text-lg">Earn Badges</h4>
                    <p className="text-sm text-gray-500">Unlock unique digital achievements.</p>
                </div>
            </div>
        </div>
    );
};

const MapPin = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

export default Leaderboard;
