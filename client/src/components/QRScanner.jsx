import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, QrCode, Camera, AlertCircle, Activity } from 'lucide-react';
import { toast } from 'react-hot-toast';

const QRScanner = ({ onScan, onClose, title = "Scan QR Code", label = "Place the QR code within the square to scan." }) => {
    const [isCameraStarted, setIsCameraStarted] = useState(false);
    const [error, setError] = useState(null);
    const scannerRef = useRef(null);

    useEffect(() => {
        // Delay initialization string slightly to ensure DOM is ready
        const timer = setTimeout(() => {
            initScanner();
        }, 300);

        return () => {
            clearTimeout(timer);
            stopScanner();
        };
    }, []);

    const initScanner = async () => {
        if (!window.isSecureContext && window.location.hostname !== 'localhost') {
            setError("Camera requires HTTPS. Browser security blocks camera access on non-secure connections (except localhost).");
            toast.error("Secure connection required");
            return;
        }

        try {
            // Clean up any existing instances first
            if (scannerRef.current) {
                await stopScanner();
            }

            const html5QrCode = new Html5Qrcode("reader");
            scannerRef.current = html5QrCode;

            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            };

            await html5QrCode.start(
                { facingMode: "environment" },
                config,
                (decodedText) => {
                    // Stop first, then callback to prevent state updates on unmounted component
                    stopScanner().then(() => {
                        onScan(decodedText);
                    });
                },
                (errorMessage) => {
                    // Suppress noise
                }
            );
            setIsCameraStarted(true);
            setError(null);
        } catch (err) {
            console.error("Scanner Error:", err);
            // Fallback for devices that don't support environment mode specifically
            try {
                if (scannerRef.current) {
                    await scannerRef.current.start(
                        { facingMode: "user" },
                        { fps: 10, qrbox: { width: 250, height: 250 } },
                        (text) => {
                            stopScanner().then(() => onScan(text));
                        },
                        () => { }
                    );
                    setIsCameraStarted(true);
                    setError(null);
                }
            } catch (fallbackErr) {
                setError("Camera access failed. Ensure permissions are set to 'Allow'.");
                toast.error("Scanner failed to start");
            }
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
            } catch (err) {
                console.warn("Stop error:", err);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-medical-secondary text-white">
                    <div className="flex items-center gap-2">
                        <QrCode size={24} />
                        <h2 className="text-xl font-bold font-display">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8">
                    <div className="relative aspect-square w-full bg-black rounded-3xl overflow-hidden border-4 border-gray-50 group shadow-inner">
                        <div id="reader" className="w-full h-full"></div>

                        {!isCameraStarted && !error && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white gap-4">
                                <Activity className="w-12 h-12 text-medical-secondary animate-pulse" />
                                <div className="text-center">
                                    <p className="text-sm font-bold animate-pulse text-gray-200 uppercase tracking-widest">Waking Camera...</p>
                                    <p className="text-[10px] text-gray-500 mt-1">Please allow camera permissions if prompted</p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 text-red-600 p-8 text-center gap-6">
                                <div className="p-4 bg-white rounded-full shadow-sm text-red-500"><AlertCircle size={48} /></div>
                                <div className="space-y-2">
                                    <p className="font-black uppercase tracking-tight text-xl">Access Blocked</p>
                                    <p className="text-xs font-bold leading-relaxed">{error}</p>
                                </div>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="bg-red-600 text-white px-8 py-3 rounded-2xl text-xs font-black shadow-lg uppercase tracking-widest hover:bg-red-700 transition-all active:scale-95"
                                >
                                    Refresh Browser
                                </button>
                            </div>
                        )}

                        {/* Animated Scan Line */}
                        {isCameraStarted && (
                            <div className="absolute inset-x-0 h-1.5 bg-medical-secondary/60 shadow-[0_0_20px_rgba(var(--medical-secondary),0.8)] animate-scan-line pointer-events-none z-10"></div>
                        )}

                        {/* Scanner Frame */}
                        {isCameraStarted && (
                            <>
                                <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-medical-secondary rounded-tl-2xl pointer-events-none"></div>
                                <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-medical-secondary rounded-tr-2xl pointer-events-none"></div>
                                <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-medical-secondary rounded-bl-2xl pointer-events-none"></div>
                                <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-medical-secondary rounded-br-2xl pointer-events-none"></div>
                            </>
                        )}
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                            <Camera className="text-blue-500 shrink-0" size={20} />
                            <p className="text-xs text-blue-700 font-bold leading-relaxed">
                                {label}
                            </p>
                        </div>

                        {!isCameraStarted && !error && (
                            <button
                                onClick={() => initScanner()}
                                className="w-full py-3 bg-gray-100 text-gray-400 rounded-2xl text-xs font-black uppercase tracking-widest pointer-events-none"
                            >
                                Initializing Video Stream...
                            </button>
                        )}
                    </div>
                </div>

                <div className="px-8 pb-8 flex justify-center text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Powered by Secure QR Protocol v2.4
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QRScanner;
