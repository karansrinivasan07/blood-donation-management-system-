import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, QrCode } from 'lucide-react';

/**
 * QRScanner Component
 * @param {Object} props
 * @param {Function} props.onScan - Callback when a QR code is scanned. Receives decodedText.
 * @param {Function} props.onClose - Callback to close the scanner.
 * @param {string} props.title - Title for the scanner modal.
 * @param {string} props.description - Description/instruction for the scanner.
 */
const QRScanner = ({ onScan, onClose, title = "Scan QR Code", description = "Place the QR code within the square to scan." }) => {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
        });

        const onScanSuccess = (decodedText, decodedResult) => {
            scanner.clear().then(() => {
                onScan(decodedText);
            }).catch(error => {
                console.error("Failed to clear scanner after success", error);
                onScan(decodedText);
            });
        };

        const onScanFailure = (error) => {
            // Successive failures are common, so we don't log them unless necessary
            // console.warn(`Code scan error = ${error}`);
        };

        scanner.render(onScanSuccess, onScanFailure);

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner on unmount. ", error);
            });
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
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

                <div className="p-6">
                    <div id="reader" className="overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50"></div>
                    <p className="mt-4 text-center text-gray-500 text-sm font-medium leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QRScanner;
