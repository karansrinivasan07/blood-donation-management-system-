import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, QrCode, Camera, SwitchCamera, Loader2, RefreshCw } from 'lucide-react';

/**
 * Premium QRScanner Component - Fixed for reliability
 */
const QRScanner = ({ onScan, onClose, title = "Scan QR Code", description = "Place the QR code within the frame to scan." }) => {
    const [cameras, setCameras] = useState([]);
    const [activeCameraId, setActiveCameraId] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState(null);
    const [isInitializing, setIsInitializing] = useState(true);

    const scannerRef = useRef(null);
    const containerRef = useRef(null);
    const stopRequestRef = useRef(false);

    // 1. Initialize Cameras
    useEffect(() => {
        let isMounted = true;

        const initCameras = async () => {
            try {
                const devices = await Html5Qrcode.getCameras();
                if (isMounted) {
                    if (devices && devices.length > 0) {
                        setCameras(devices);
                        // Default to back camera
                        const backCamera = devices.find(d =>
                            d.label.toLowerCase().includes('back') ||
                            d.label.toLowerCase().includes('environment')
                        );
                        setActiveCameraId(backCamera ? backCamera.id : devices[0].id);
                    } else {
                        setError("No cameras found on this device.");
                    }
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Camera detection failed", err);
                    setError("Camera access denied. Please check permissions.");
                }
            } finally {
                if (isMounted) setIsInitializing(false);
            }
        };

        initCameras();

        return () => {
            isMounted = false;
            stopRequestRef.current = true;
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(console.error);
            }
        };
    }, []);

    // 2. Start/Stop Scanner when activeCameraId or Modal open state changes
    useEffect(() => {
        if (activeCameraId && !isInitializing) {
            startScanning(activeCameraId);
        }
    }, [activeCameraId, isInitializing]);

    const startScanning = async (cameraId) => {
        if (stopRequestRef.current) return;

        try {
            // Cleanup existing
            if (scannerRef.current && scannerRef.current.isScanning) {
                await scannerRef.current.stop();
            }

            // Create new instance using the Ref relative to the current component
            const html5QrCode = new Html5Qrcode("reader");
            scannerRef.current = html5QrCode;

            const config = {
                fps: 15,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            };

            await html5QrCode.start(
                cameraId,
                config,
                (decodedText) => {
                    if (stopRequestRef.current) return;
                    setIsScanning(false);
                    // Single successful scan logic
                    html5QrCode.stop().then(() => {
                        onScan(decodedText);
                    }).catch(err => {
                        console.warn("Stop after success failed", err);
                        onScan(decodedText);
                    });
                },
                (errorMessage) => {
                    // Failures during scanning (e.g. no code found in frame) are silent
                }
            );

            if (!stopRequestRef.current) {
                setIsScanning(true);
                setError(null);
            }
        } catch (err) {
            if (!stopRequestRef.current) {
                console.error("Start scanning failed", err);
                setError("Failed to start camera. It might be in use by another app.");
                setIsScanning(false);
            }
        }
    };

    const handleRetry = () => {
        setError(null);
        setIsInitializing(true);
        setIsScanning(false);
        // Re-trigger camera detection
        Html5Qrcode.getCameras().then(devices => {
            setCameras(devices);
            if (devices.length > 0) setActiveCameraId(devices[0].id);
            setIsInitializing(false);
        }).catch(err => {
            setError("Still no camera access.");
            setIsInitializing(false);
        });
    };

    const toggleCamera = () => {
        if (cameras.length < 2) return;
        const currentIndex = cameras.findIndex(c => c.id === activeCameraId);
        const nextIndex = (currentIndex + 1) % cameras.length;
        setActiveCameraId(cameras[nextIndex].id);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-all duration-500">
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.6)] border border-white/5 animate-in fade-in zoom-in slide-in-from-bottom-10 duration-500">
                {/* Header */}
                <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gradient-to-r from-medical-primary to-rose-600 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/5 pointer-events-none"></div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <QrCode size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                            <p className="text-[10px] text-white/70 font-black uppercase tracking-[0.2em]">Secure Scanner</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-white/20 rounded-full transition-all hover:rotate-90 duration-300 relative z-10"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {/* Scanner Display Box */}
                    <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border-8 border-gray-50 dark:border-gray-800 bg-gray-950 shadow-inner group">
                        {/* THE SCANNER TARGET */}
                        <div id="reader" className="w-full h-full object-cover"></div>

                        {/* Custom Overlay (Laser & Corners) */}
                        {isScanning && (
                            <div className="absolute inset-0 pointer-events-none z-20">
                                {/* Enhanced Corners */}
                                <div className="absolute top-12 left-12 w-12 h-12 border-t-[6px] border-l-[6px] border-medical-primary rounded-tl-2xl shadow-[0_0_15px_rgba(225,29,72,0.4)]"></div>
                                <div className="absolute top-12 right-12 w-12 h-12 border-t-[6px] border-r-[6px] border-medical-primary rounded-tr-2xl shadow-[0_0_15px_rgba(225,29,72,0.4)]"></div>
                                <div className="absolute bottom-12 left-12 w-12 h-12 border-b-[6px] border-l-[6px] border-medical-primary rounded-bl-2xl shadow-[0_0_15px_rgba(225,29,72,0.4)]"></div>
                                <div className="absolute bottom-12 right-12 w-12 h-12 border-b-[6px] border-r-[6px] border-medical-primary rounded-br-2xl shadow-[0_0_15px_rgba(225,29,72,0.4)]"></div>

                                {/* Animated Laser Line */}
                                <div className="scanner-laser animate-scan-line scale-x-75 opacity-80"></div>

                                {/* Inner Soft Glow */}
                                <div className="absolute inset-0 bg-medical-primary/5"></div>
                            </div>
                        )}

                        {/* Loading/Init State */}
                        {(isInitializing || !isScanning) && !error && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 text-white gap-6 backdrop-blur-sm">
                                <div className="relative">
                                    <Loader2 size={48} className="animate-spin text-medical-primary" />
                                    <div className="absolute inset-0 animate-ping bg-medical-primary/20 rounded-full"></div>
                                </div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Waking up camera...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/95 text-white p-8 text-center animate-in fade-in duration-300">
                                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                                    <Camera size={40} className="text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Ops! Camera Issue</h3>
                                <p className="text-sm text-gray-500 mb-8 leading-relaxed">{error}</p>
                                <button
                                    onClick={handleRetry}
                                    className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-black text-xs uppercase hover:scale-105 transition-transform"
                                >
                                    <RefreshCw size={16} /> Retry Access
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer Controls */}
                    <div className="space-y-6">
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl text-center">
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                {description}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            {cameras.length > 1 && (
                                <button
                                    onClick={toggleCamera}
                                    className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl transition-all flex items-center justify-center gap-2.5 font-black text-xs uppercase tracking-tight text-gray-700 dark:text-gray-300"
                                >
                                    <SwitchCamera size={18} /> Switch Cam
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className={`py-4 px-8 bg-medical-primary/10 hover:bg-medical-primary/20 text-medical-primary rounded-2xl transition-all flex items-center justify-center gap-2.5 font-black text-xs uppercase tracking-tight ${cameras.length <= 1 ? 'w-full' : 'flex-1'}`}
                            >
                                <X size={18} /> Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRScanner;
