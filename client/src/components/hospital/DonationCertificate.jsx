import React, { useRef } from 'react';
import { Award, Heart, CheckCircle2, ShieldCheck, Calendar, MapPin } from 'lucide-react';

const DonationCertificate = ({ donorName, bloodGroup, hospitalName, date, onClose }) => {
    const certificateRef = useRef(null);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white">
            <div className="max-w-5xl w-full bg-white relative overflow-hidden print:shadow-none shadow-2xl rounded-3xl print:rounded-none">

                {/* Print Controls - Hidden during print */}
                <div className="absolute top-6 right-6 flex gap-3 print:hidden z-20">
                    <button
                        onClick={handlePrint}
                        className="bg-medical-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-medical-primary/90 transition-all flex items-center gap-2 shadow-lg"
                    >
                        Print Certificate
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-100 text-gray-600 px-6 py-2 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                        Close
                    </button>
                </div>

                {/* Certificate Content */}
                <div
                    ref={certificateRef}
                    className="p-12 border-[16px] border-double border-medical-primary/20 m-4 relative bg-[url('https://www.transparenttextures.com/patterns/white-paper.png')] landscape-certificate"
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-medical-primary rounded-tl-xl opacity-20"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 border-t-8 border-r-8 border-medical-primary rounded-tr-xl opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 border-medical-primary rounded-bl-xl opacity-20"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-medical-primary rounded-br-xl opacity-20"></div>

                    <div className="text-center space-y-6 py-4">
                        <div className="flex justify-center mb-2">
                            <div className="relative">
                                <Award size={64} className="text-yellow-500" />
                                <Heart size={20} className="text-medical-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-current" />
                            </div>
                        </div>

                        <header className="space-y-1">
                            <h1 className="text-4xl font-serif font-black text-medical-dark uppercase tracking-widest">Certificate of Appreciation</h1>
                            <div className="h-1 w-48 bg-medical-primary mx-auto rounded-full"></div>
                            <p className="text-lg font-medium text-gray-500 italic">This is to proudly certify that</p>
                        </header>

                        <div className="py-4">
                            <h2 className="text-5xl font-bold text-medical-primary underline decoration-dotted decoration-medical-primary/30 underline-offset-8">
                                {donorName}
                            </h2>
                        </div>

                        <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-600">
                            has selflessly contributed to saving lives by donating <span className="font-bold text-medical-dark">Blood Group {bloodGroup}</span>.
                            Your heroic act provides hope and a second chance at life for those in need.
                        </p>

                        <div className="grid grid-cols-2 gap-20 mt-12 pt-8 border-t border-gray-100">
                            <div className="text-left space-y-4">
                                <div className="flex items-center gap-3 text-gray-500 font-bold uppercase tracking-widest text-xs">
                                    <MapPin size={16} className="text-medical-primary" />
                                    Donated At
                                </div>
                                <p className="text-xl font-bold text-medical-dark">{hospitalName}</p>
                                <div className="mt-12">
                                    <div className="h-0.5 w-48 bg-gray-200"></div>
                                    <p className="text-xs text-gray-400 font-bold uppercase mt-2">Authorized Signature</p>
                                    <div className="mt-4 flex justify-center">
                                        <div className="relative group">
                                            <img
                                                src="/assets/tn_seal.png"
                                                alt="Authorized Seal"
                                                className="h-32 w-32 object-contain filter drop-shadow-md"
                                                onError={(e) => {
                                                    e.target.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Seal_of_Tamil_Nadu.svg/512px-Seal_of_Tamil_Nadu.svg.png";
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right space-y-4">
                                <div className="flex items-center justify-end gap-3 text-gray-500 font-bold uppercase tracking-widest text-xs">
                                    <Calendar size={16} className="text-medical-primary" />
                                    Date of Donation
                                </div>
                                <p className="text-xl font-bold text-medical-dark">{new Date(date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                <div className="flex justify-end pt-4">
                                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-100 shadow-sm">
                                        <ShieldCheck size={20} />
                                        <span className="font-black text-[10px] uppercase tracking-widest">Verified Lifesaver</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <footer className="pt-8">
                            <p className="text-xs text-gray-400 font-medium">"Bringing the gift of life to another is the highest service any human can perform."</p>
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
                    body * {
                        visibility: hidden;
                    }
                    .fixed, .fixed * {
                        visibility: visible;
                    }
                    .fixed {
                        position: fixed;
                        left: 0;
                        top: 0;
                        width: 100vw;
                        height: 100vh;
                        background: white !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        display: flex !important;
                        align-items: center;
                        justify-content: center;
                    }
                    .max-w-5xl {
                        max-width: 100% !important;
                        width: 100% !important;
                        height: 100% !important;
                        margin: 0 !important;
                    }
                    .landscape-certificate {
                        height: calc(100vh - 40px);
                        margin: 20px !important;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }
                    .print\\:p-0 {
                        padding: 0 !important;
                    }
                    .print\\:rounded-none {
                        border-radius: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default DonationCertificate;
