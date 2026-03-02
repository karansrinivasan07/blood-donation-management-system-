import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock, Info, HeartPulse } from 'lucide-react';
import api from '../../api/axios';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
        // Poll for notifications every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/donor/notifications');
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (err) {
            console.error('Failed to fetch notifications');
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.patch(`/donor/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark as read');
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'PLEDGE_ACCEPTED': return <Check className="text-green-500" size={16} />;
            case 'DONATION_USED': return <HeartPulse className="text-medical-primary" size={16} />;
            case 'POINTS_EARNED': return <Info className="text-blue-500" size={16} />;
            default: return <Clock className="text-gray-400" size={16} />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-medical-primary transition-colors"
            >
                <Bell size={22} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-medical-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-80 max-h-[400px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-4 border-b border-gray-50 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                Notifications
                                {unreadCount > 0 && <span className="text-[10px] bg-medical-primary text-white px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                            </h3>
                        </div>

                        <div className="overflow-y-auto max-h-[320px]">
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-gray-50">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif._id}
                                            onClick={() => !notif.isRead && markAsRead(notif._id)}
                                            className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative ${!notif.isRead ? 'bg-medical-primary/5' : ''}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className="mt-1">{getIcon(notif.type)}</div>
                                                <div className="flex-1">
                                                    <p className={`text-xs font-bold ${!notif.isRead ? 'text-gray-900' : 'text-gray-500'}`}>{notif.title}</p>
                                                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                                                    <p className="text-[9px] text-gray-400 mt-2 font-medium">{new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                                {!notif.isRead && <div className="w-2 h-2 rounded-full bg-medical-primary mt-1"></div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-10 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Bell size={24} className="text-gray-300" />
                                    </div>
                                    <p className="text-sm text-gray-400 font-medium">No notifications yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;
