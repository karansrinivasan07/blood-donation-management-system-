import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Trophy, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

const NotificationCelebration = () => {
    const { socket } = useAuth();
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (socket) {
            socket.on('notification', (data) => {
                if (data.type === 'JOURNEY_OF_LIFE') {
                    setNotification(data);
                    // Fire confetti!
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#e11d48', '#fb7185', '#ffffff']
                    });
                }
            });

            return () => socket.off('notification');
        }
    }, [socket]);

    if (!notification) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="bg-white rounded-[40px] p-10 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
                >
                    {/* Decorative Background */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500" />

                    <div className="mb-6 relative inline-block">
                        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
                            <Heart size={48} fill="currentColor" className="animate-pulse" />
                        </div>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                            className="absolute -inset-2 border-2 border-dashed border-rose-200 rounded-full"
                        />
                    </div>

                    <h2 className="text-3xl font-black text-gray-900 mb-2 leading-tight">
                        {notification.title}
                    </h2>
                    <p className="text-gray-600 mb-8 font-medium">
                        {notification.message}
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => setNotification(null)}
                            className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 hover:brightness-110 transition-all"
                        >
                            You're Amazing!
                        </button>
                    </div>

                    <button
                        onClick={() => setNotification(null)}
                        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default NotificationCelebration;
