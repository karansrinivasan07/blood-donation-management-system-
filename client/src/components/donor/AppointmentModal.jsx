import React, { useState } from 'react';
import { Calendar, Clock, MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const AppointmentModal = ({ isOpen, onClose, hospital, requestId }) => {
    const [formData, setFormData] = useState({
        date: '',
        timeSlot: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/appointments/book', {
                hospitalId: hospital.userId,
                requestId,
                ...formData
            });
            toast.success('Appointment booked successfully!');
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
                <div className="p-6 border-b border-gray-100 bg-medical-primary text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Book Appointment</h2>
                        <p className="text-xs text-white/80">{hospital.hospitalName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Preferred Date</label>
                            <div className="input-group">
                                <Calendar size={18} className="text-medical-primary" />
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    className="input-field"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Time Slot</label>
                            <div className="input-group">
                                <Clock size={18} className="text-medical-primary" />
                                <select
                                    required
                                    className="input-field"
                                    value={formData.timeSlot}
                                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                                >
                                    <option value="">Select a slot</option>
                                    {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'].map(slot => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Message (Optional)</label>
                            <div className="input-group items-start py-3">
                                <MessageSquare size={18} className="text-medical-primary mt-1" />
                                <textarea
                                    placeholder="Any special notes..."
                                    className="input-field bg-transparent border-none focus:ring-0 w-full min-h-[80px] resize-none"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-4 flex items-center justify-center gap-2 font-bold shadow-xl shadow-medical-primary/20"
                    >
                        {loading ? 'Confirming...' : 'Confirm Appointment'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AppointmentModal;
