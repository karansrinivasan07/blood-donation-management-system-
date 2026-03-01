import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { Shield, Download, RefreshCw } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const DigitalID = () => {
    const [qrString, setQrString] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchQRData = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/qr/data');
            setQrString(data.qrString);
        } catch (err) {
            toast.error('Failed to load Digital ID');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQRData();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center space-y-8 p-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">My Digital Donor ID</h2>
                <p className="text-gray-400">Present this QR code at hospitals for instant verification</p>
            </div>

            <div className="glass-card p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl relative overflow-hidden group">
                {/* Decorative background elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-medical-primary/20 rounded-full blur-3xl group-hover:bg-medical-primary/30 transition-all duration-700"></div>

                <div className="relative bg-white p-6 rounded-2xl shadow-inner">
                    {loading ? (
                        <div className="w-[200px] h-[200px] flex items-center justify-center">
                            <RefreshCw className="animate-spin text-medical-primary" size={40} />
                        </div>
                    ) : (
                        qrString && <QRCode value={qrString} size={200} />
                    )}
                </div>

                <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-300 bg-black/20 p-3 rounded-xl border border-white/5">
                        <Shield size={18} className="text-green-400" />
                        <span>Encryption Active • Secure Identity</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={fetchQRData}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all transform active:scale-95"
                >
                    <RefreshCw size={18} /> Refresh
                </button>
                <button
                    className="flex items-center gap-2 px-6 py-3 bg-medical-primary text-white rounded-xl shadow-lg shadow-medical-primary/30 transition-all hover:brightness-110 transform active:scale-95"
                >
                    <Download size={18} /> Save Offline
                </button>
            </div>
        </div>
    );
};

export default DigitalID;
