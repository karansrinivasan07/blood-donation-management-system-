import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, QrCode } from 'lucide-react';

const QRScanner = ({ onScan, onClose }) => {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            fps: 10,
            qrbox: { width: 250, height: 250 },
        });

        scanner.render(onScanSuccess, onScanFailure);

        function onScanSuccess(decodedText, decodedResult) {
            scanner.clear();
            onScan(decodedText);
        }

        function onScanFailure(error) {
            // console.warn(`Code scan error = ${error}`);
        }

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-medical-secondary text-white">
                    <div className="flex items-center gap-2">
                        <QrCode size={24} />
                        <h2 className="text-xl font-bold">Scan Donor QR</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div id="reader" className="overflow-hidden rounded-2xl border-none"></div>
                    <p className="mt-4 text-center text-gray-500 text-sm">
                        Place the donor's QR code within the square to scan their location.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QRScanner;
