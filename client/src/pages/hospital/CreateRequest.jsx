import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Send, Droplets, Calendar, AlertCircle } from 'lucide-react';

const CreateRequest = () => {
    const [formData, setFormData] = useState({
        bloodGroup: '',
        unitsRequired: 1,
        urgency: 'NORMAL',
        requiredBefore: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/hospital/requests', formData);
            toast.success('Request posted successfully!');
            navigate('/hospital/dashboard');
        } catch (err) {
            toast.error('Failed to post request');
        } finally {
            setLoading(false);
        }
    };

    const handlePriorityAlert = async () => {
        if (!formData.bloodGroup) {
            toast.error('Please select a blood group first');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5010/v1/p', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    blood_type: formData.bloodGroup,
                    units_needed: formData.unitsRequired,
                    hospital_lat: 13.0827, // In a real app, these would be from hospital profile
                    hospital_lng: 80.2707,
                    hospital_id: "65e01234567890abcdef1234"
                })
            });
            // eslint-disable-next-line no-unused-vars
            const html = await response.text();
            toast.success('Priority Notification Sent!');
            // You could potentially show the response HTML in a modal here
            window.open('http://localhost:5010/templates/hospital_sos.html', '_blank');
        } catch (err) {
            toast.error('Notification failed. Redirecting to backup portal...');
            window.open('http://localhost:5010/templates/hospital_sos.html', '_blank');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Post Blood Request</h1>
                <p className="text-gray-500">Provide details for the required blood donation</p>
            </div>

            <div className="glass-card p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">Blood Group Required</label>
                            <div className="input-group">
                                <Droplets size={18} />
                                <select
                                    required
                                    className="input-field text-gray-900"
                                    value={formData.bloodGroup}
                                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                >
                                    <option value="" className="text-gray-900">Select Group</option>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg} className="text-gray-900">{bg}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">Number of Units</label>
                            <input
                                type="number"
                                min="1"
                                required
                                className="input-field text-gray-900"
                                value={formData.unitsRequired}
                                onChange={(e) => setFormData({ ...formData, unitsRequired: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">Urgency Level</label>
                            <select
                                className="input-field text-gray-900"
                                value={formData.urgency}
                                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                            >
                                <option value="NORMAL" className="text-gray-900">Normal</option>
                                <option value="URGENT" className="text-gray-900">Urgent</option>
                                <option value="CRITICAL" className="text-gray-900">Critical (Immediate)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">Needed By Date</label>
                            <div className="input-group">
                                <Calendar size={18} />
                                <input
                                    type="date"
                                    required
                                    className="input-field text-gray-900"
                                    value={formData.requiredBefore}
                                    onChange={(e) => setFormData({ ...formData, requiredBefore: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-red-50 rounded-xl text-red-700 flex gap-3 text-sm">
                        <AlertCircle className="shrink-0" size={20} />
                        <p><strong>Note:</strong> Posting accurate urgency levels helps our donors prioritize critical needs. Please only use Critical for immediate life-saving situations.</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-secondary w-full py-3 flex items-center justify-center gap-2 font-bold shadow-lg shadow-medical-secondary/20"
                        >
                            {loading ? 'Posting...' : <><Send size={18} /> Publish Request</>}
                        </button>

                        <button
                            type="button"
                            onClick={handlePriorityAlert}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 text-white w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black text-lg animate-pulse shadow-xl shadow-red-500/30"
                        >
                            <AlertCircle size={24} /> SEND PRIORITY NOTIFICATION
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRequest;
