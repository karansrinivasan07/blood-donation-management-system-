import React, { useRef, useState } from 'react';
import { Award, Heart, CheckCircle2, ShieldCheck, Calendar, MapPin, Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const DonationCertificate = ({ donorName, bloodGroup, hospitalName, date, onClose }) => {
    const certificateRef = useRef(null);

    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        if (!certificateRef.current) return;
        setDownloading(true);
        try {
            const element = certificateRef.current;
            const canvas = await html2canvas(element, {
                scale: 3, // High quality
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`Donation_Certificate_${donorName.replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download certificate. Please try the Print option.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[150] bg-black/98 md:bg-black/80 backdrop-blur-md flex items-center justify-center p-0 md:p-4 print:p-0 print:bg-white overflow-y-auto overflow-x-hidden">
            <div className="w-full max-w-5xl bg-white relative md:overflow-hidden print:shadow-none shadow-2xl md:rounded-3xl print:rounded-none min-h-screen md:min-h-0 flex flex-col">

                {/* Print Controls - Hidden during print */}
                <div className="sticky top-0 bg-white/90 backdrop-blur-md md:absolute md:top-6 md:right-6 flex flex-wrap justify-center gap-2 p-4 md:p-0 print:hidden z-20 border-b md:border-0">
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="bg-green-600 text-white px-4 md:px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                    >
                        {downloading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span className="hidden xs:inline">Processing...</span>
                                <span className="xs:hidden">Wait...</span>
                            </>
                        ) : (
                            <>
                                <Download size={16} />
                                <span className="hidden xs:inline">Download PDF</span>
                                <span className="xs:hidden">Download</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="bg-medical-primary text-white px-4 md:px-6 py-2 rounded-xl font-bold hover:bg-medical-primary/90 transition-all flex items-center gap-2 shadow-lg text-sm md:text-base"
                        title="Print Certificate"
                    >
                        Print
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-100 text-gray-600 px-4 md:px-6 py-2 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm md:text-base"
                    >
                        Close
                    </button>
                </div>

                {/* Scroll Wrapper for Mobile */}
                <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 md:p-8">
                    {/* Certificate Content */}
                    <div
                        ref={certificateRef}
                        className="min-w-[700px] md:min-w-0 aspect-[1.414/1] w-full border-[12px] md:border-[20px] border-double border-medical-primary/20 p-6 md:p-16 relative bg-white bg-[url('https://www.transparenttextures.com/patterns/white-paper.png')] landscape-certificate shadow-inner mx-auto"
                    >
                        {/* Decorative Elements */}
                        <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-medical-primary rounded-tl-xl opacity-20"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 border-t-8 border-r-8 border-medical-primary rounded-tr-xl opacity-20"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 border-medical-primary rounded-bl-xl opacity-20"></div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-medical-primary rounded-br-xl opacity-20"></div>

                        <div className="h-full flex flex-col justify-between text-center space-y-4 py-2">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <Award size={56} className="text-yellow-500" />
                                    <Heart size={18} className="text-medical-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-current" />
                                </div>
                            </div>

                            <header className="space-y-1">
                                <h1 className="text-3xl md:text-4xl font-serif font-black text-medical-dark uppercase tracking-widest">Certificate of Appreciation</h1>
                                <div className="h-1 w-48 bg-medical-primary mx-auto rounded-full"></div>
                                <p className="text-base md:text-lg font-medium text-gray-500 italic">This is to proudly certify that</p>
                            </header>

                            <div className="py-2">
                                <h2 className="text-4xl md:text-5xl font-bold text-medical-primary underline decoration-dotted decoration-medical-primary/30 underline-offset-8">
                                    {donorName}
                                </h2>
                            </div>

                            <p className="max-w-3xl mx-auto text-base md:text-lg leading-relaxed text-gray-600 px-4">
                                has selflessly contributed to saving lives by donating <span className="font-bold text-medical-dark">Blood Group {bloodGroup}</span>.
                                Your heroic act provides hope and a second chance at life for those in need.
                            </p>

                            <div className="grid grid-cols-2 gap-10 mt-6 pt-6 border-t border-gray-100">
                                <div className="text-left space-y-2">
                                    <div className="flex items-center gap-3 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                                        <MapPin size={14} className="text-medical-primary" />
                                        Donated At
                                    </div>
                                    <p className="text-lg font-bold text-medical-dark leading-tight">{hospitalName}</p>
                                    <div className="mt-6 flex flex-col">
                                        <div className="h-px w-40 bg-gray-300"></div>
                                        <p className="text-[10px] text-gray-400 font-black uppercase mt-2">Authorized Signature</p>
                                        <div className="mt-2 text-left">
                                            <div className="relative inline-block">
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Seal_of_Tamil_Nadu.svg/512px-Seal_of_Tamil_Nadu.svg.png"
                                                    alt="Authorized Seal"
                                                    className="h-20 w-20 object-contain filter drop-shadow hover:scale-110 transition-transform cursor-pointer"
                                                    onClick={() => window.open(src, '_blank')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right space-y-4">
                                    <div className="flex items-center justify-end gap-3 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                                        <Calendar size={14} className="text-medical-primary" />
                                        Date of Donation
                                    </div>
                                    <p className="text-lg font-bold text-medical-dark">{new Date(date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                    <div className="flex justify-end pt-2">
                                        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-100 shadow-sm">
                                            <ShieldCheck size={18} />
                                            <span className="font-black text-[9px] uppercase tracking-widest">Verified Lifesaver</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <footer className="pt-4">
                                <p className="text-[10px] text-gray-400 font-medium italic">"Bringing the gift of life to another is the highest service any human can perform."</p>
                            </footer>
                        </div>
                    </div>
                </div>

                <style>{`
                @media print {
                    @page {
                        size: landscape;
                        margin: 0;
                    }
                    html, body {
                        height: 100%;
                        width: 100%;
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: hidden;
                    }
                    body * {
                        visibility: hidden;
                    }
                    .fixed, .fixed * {
                        visibility: visible;
                    }
                    .fixed {
                        position: fixed !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                        background: white !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        display: flex !important;
                        align-items: center;
                        justify-content: center;
                        z-index: 9999;
                    }
                    .max-w-5xl {
                        max-width: none !important;
                        width: 100vw !important;
                        height: 100vh !important;
                        margin: 0 !important;
                        border-radius: 0 !important;
                        box-shadow: none !important;
                    }
                    .landscape-certificate {
                        height: 100vh !important;
                        width: 100vw !important;
                        aspect-ratio: auto !important;
                        margin: 0 !important;
                        padding: 60px !important;
                        border: 30px double rgba(0, 0, 0, 0.05) !important;
                        background-image: none !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                }
            `}</style>
            </div>
        </div>
    );
};

export default DonationCertificate;
