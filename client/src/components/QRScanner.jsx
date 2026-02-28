import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, QrCode, Camera, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const QRScanner = ({ onScan, onClose, title = "Scan QR Code", label = "Place the QR code within the square to scan." }) => {
    const scannerRef = useRef(null);
    const [isCameraStarted, setIsCameraStarted] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        const startScanner = async () => {
            try {
                const config = {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                };

                // Use the back camera (environment) by default
                await html5QrCode.start(
                    { facingMode: "environment" },
                    config,
                    (decodedText) => {
                        html5QrCode.stop().then(() => {
                            onScan(decodedText);
                        }).catch(err => console.error(err));
                    },
                    (errorMessage) => {
                        // Suppress failures to avoid console noise
                    }
                );
                setIsCameraStarted(true);
            } catch (err) {
                console.error("Scanner Start Error:", err);
                setError("Could not access camera. Please ensure permissions are granted.");
                toast.error("Camera access denied or not found");
            }
        };

        startScanner();

        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(err => console.error("Scanner Stop Error:", err));
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-medical-secondary text-white">
                    <div className="flex items-center gap-2">
                        <QrCode size={24} />
                        <h2 className="text-xl font-bold">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8">
                    <div className="relative aspect-square w-full bg-black rounded-2xl overflow-hidden border-4 border-gray-100 group shadow-inner">
                        <div id="reader" className="w-full h-full"></div>

                        {!isCameraStarted && !error && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white gap-4">
                                <div className="w-12 h-12 border-4 border-medical-secondary border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-sm font-medium animate-pulse text-gray-400 uppercase tracking-widest">Initializing Camera...</p>
                            </div>
                        )}

                        {error && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 text-red-600 p-6 text-center gap-4">
                                <AlertCircle size={48} />
                                <p className="font-bold">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg"
                                >
                                    Try Refreshing
                                </button>
                            </div>
                        )}

                        {/* Animated Scan Line */}
                        {isCameraStarted && (
                            <div className="absolute inset-x-0 h-1 bg-medical-secondary/50 shadow-[0_0_15px_rgba(var(--medical-secondary),0.5)] animate-scan-line pointer-events-none"></div>
                        )}

                        {/* Scanner Corners */}
                        <div className="absolute top-4 left-4 w-10 h-10 border-t-4 border-l-4 border-medical-secondary rounded-tl-xl pointer-events-none"></div>
                        <div className="absolute top-4 right-4 w-10 h-10 border-t-4 border-r-4 border-medical-secondary rounded-tr-xl pointer-events-none"></div>
                        <div className="absolute bottom-4 left-4 w-10 h-10 border-b-4 border-l-4 border-medical-secondary rounded-bl-xl pointer-events-none"></div>
                        <div className="absolute bottom-4 right-4 w-10 h-10 border-b-4 border-r-4 border-medical-secondary rounded-br-xl pointer-events-none"></div>
                    </div>

                    <p className="mt-8 text-center text-gray-500 text-sm font-medium leading-relaxed italic">
                        {label}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QRScanner;
