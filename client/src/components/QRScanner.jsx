import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, QrCode, Camera, SwitchCamera, Loader2 } from 'lucide-react';

/**
 * Premium QRScanner Component
 */
const QRScanner = ({ onScan, onClose, title = "Scan QR Code", description = "Place the QR code within the frame to scan." }) => {
    const [cameras, setCameras] = useState([]);
    const [activeCameraId, setActiveCameraId] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState(null);
    const scannerRef = useRef(null);
    const containerId = "reader";

    useEffect(() => {
        // Find cameras
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length > 0) {
                setCameras(devices);
                // Prefer back camera
                const backCamera = devices.find(d => d.label.toLowerCase().includes('back'));
                const initialCamera = backCamera || devices[0];
                setActiveCameraId(initialCamera.id);
            }
        }).catch(err => {
            console.error("Error getting cameras", err);
            setError("Camera access denied or not found.");
        });

        return () => {
            stopScanning();
        };
    }, []);

    useEffect(() => {
        if (activeCameraId) {
            startScanning(activeCameraId);
        }
    }, [activeCameraId]);

    const startScanning = async (cameraId) => {
        if (scannerRef.current) {
            await stopScanning();
        }

        const html5QrCode = new Html5Qrcode(containerId);
        scannerRef.current = html5QrCode;

        const config = {
            fps: 15,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
        };

        try {
            await html5QrCode.start(
                cameraId,
                config,
                (decodedText) => {
                    // Success feedback
                    setIsScanning(false);
                    html5QrCode.stop().then(() => {
                        onScan(decodedText);
                    });
                },
                (errorMessage) => {
                    // Handle failures silently
                }
            );
            setIsScanning(true);
            setError(null);
        } catch (err) {
            console.error("Failed to start scanning", err);
            setError("Failed to start camera. Please ensure permissions are granted.");
            setIsScanning(false);
        }
    };

    const stopScanning = async () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            try {
                await scannerRef.current.stop();
            } catch (err) {
                console.error("Failed to stop scanner", err);
            }
        }
    };

    const toggleCamera = () => {
        if (cameras.length < 2) return;
        const currentIndex = cameras.findIndex(c => c.id === activeCameraId);
        const nextIndex = (currentIndex + 1) % cameras.length;
        setActiveCameraId(cameras[nextIndex].id);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300">
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gradient-to-r from-medical-primary to-rose-600 text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl">
                            <QrCode size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                            <p className="text-xs text-white/70 font-medium uppercase tracking-wider">Scanner Active</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-white/20 rounded-full transition-all hover:rotate-90 duration-300"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {/* Scanner Container */}
                    <div className="relative aspect-square overflow-hidden rounded-[2rem] border-4 border-gray-100 dark:border-gray-800 bg-black group">
                        <div id={containerId} className="w-full h-full"></div>

                        {/* Custom Overlay */}
                        {isScanning && (
                            <div className="absolute inset-0 pointer-events-none z-20">
                                {/* Corners */}
                                <div className="absolute top-10 left-10 w-10 h-10 border-t-4 border-l-4 border-medical-primary rounded-tl-lg"></div>
                                <div className="absolute top-10 right-10 w-10 h-10 border-t-4 border-r-4 border-medical-primary rounded-tr-lg"></div>
                                <div className="absolute bottom-10 left-10 w-10 h-10 border-b-4 border-l-4 border-medical-primary rounded-bl-lg"></div>
                                <div className="absolute bottom-10 right-10 w-10 h-10 border-b-4 border-r-4 border-medical-primary rounded-br-lg"></div>

                                {/* Animated Laser */}
                                <div className="scanner-laser animate-scan-line"></div>

                                <div className="absolute inset-0 bg-medical-primary/5"></div>
                            </div>
                        )}

                        {!isScanning && !error && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white gap-4">
                                <Loader2 size={40} className="animate-spin text-medical-primary" />
                                <p className="text-sm font-medium text-gray-400">Initializing camera...</p>
                            </div>
                        )}

                        {error && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
                                <Camera size={48} className="text-gray-600 mb-4" />
                                <p className="text-red-400 font-bold mb-2">Access Denied</p>
                                <p className="text-sm text-gray-500">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-center text-gray-500 text-sm font-medium px-4">
                            {description}
                        </p>

                        <div className="flex gap-4 w-full">
                            {cameras.length > 1 && (
                                <button
                                    onClick={toggleCamera}
                                    className="flex-1 py-4 px-6 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl transition-all flex items-center justify-center gap-2 font-bold text-gray-700 dark:text-gray-300"
                                >
                                    <SwitchCamera size={20} /> Switch
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="flex-1 py-4 px-6 bg-medical-primary/10 hover:bg-medical-primary/20 text-medical-primary rounded-2xl transition-all flex items-center justify-center gap-2 font-bold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRScanner;
