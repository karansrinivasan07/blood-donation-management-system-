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
                            <label className="text-sm font-medium">Blood Group Required</label>
                            <div className="input-group">
                                <Droplets size={18} />
                                <select
                                    required
                                    className="input-field"
                                    value={formData.bloodGroup}
                                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                >
                                    <option value="">Select Group</option>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Number of Units</label>
                            <input
                                type="number"
                                min="1"
                                required
                                className="input-field"
                                value={formData.unitsRequired}
                                onChange={(e) => setFormData({ ...formData, unitsRequired: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Urgency Level</label>
                            <select
                                className="input-field"
                                value={formData.urgency}
                                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                            >
                                <option value="NORMAL">Normal</option>
                                <option value="URGENT">Urgent</option>
                                <option value="CRITICAL">Critical (Immediate)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Needed By Date</label>
                            <div className="input-group">
                                <Calendar size={18} />
                                <input
                                    type="date"
                                    required
                                    className="input-field"
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-secondary w-full py-3 flex items-center justify-center gap-2 font-bold shadow-lg shadow-medical-secondary/20"
                    >
                        {loading ? 'Posting...' : <><Send size={18} /> Publish Request</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateRequest;
