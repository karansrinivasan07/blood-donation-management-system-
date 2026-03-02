import React, { useRef } from 'react';
import { Award, Heart, CheckCircle2, ShieldCheck, Calendar, MapPin } from 'lucide-react';

const DonationCertificate = ({ donorName, bloodGroup, hospitalName, date, onClose }) => {
    const certificateRef = useRef(null);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white">
            <div className="max-w-4xl w-full bg-white relative overflow-hidden print:shadow-none shadow-2xl rounded-3xl print:rounded-none">

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
                    className="p-16 border-[16px] border-double border-medical-primary/20 m-4 relative bg-[url('https://www.transparenttextures.com/patterns/white-paper.png')]"
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-medical-primary rounded-tl-xl opacity-20"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 border-t-8 border-r-8 border-medical-primary rounded-tr-xl opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 border-medical-primary rounded-bl-xl opacity-20"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-medical-primary rounded-br-xl opacity-20"></div>

                    <div className="text-center space-y-8 py-10">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <Award size={80} className="text-yellow-500" />
                                <Heart size={24} className="text-medical-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-current" />
                            </div>
                        </div>

                        <header className="space-y-2">
                            <h1 className="text-5xl font-serif font-black text-medical-dark uppercase tracking-widest">Certificate of Appreciation</h1>
                            <div className="h-1 w-48 bg-medical-primary mx-auto rounded-full"></div>
                            <p className="text-xl font-medium text-gray-500 italic">This is to proudly certify that</p>
                        </header>

                        <div className="py-6">
                            <h2 className="text-6xl font-bold text-medical-primary underline decoration-dotted decoration-medical-primary/30 underline-offset-8">
                                {donorName}
                            </h2>
                        </div>

                        <p className="max-w-2xl mx-auto text-lg leading-relaxed text-gray-600">
                            has selflessly contributed to saving lives by donating <span className="font-bold text-medical-dark">Blood Group {bloodGroup}</span>.
                            Your heroic act provides hope and a second chance at life for those in need.
                        </p>

                        <div className="grid grid-cols-2 gap-12 mt-16 pt-12 border-t border-gray-100">
                            <div className="text-left space-y-4">
                                <div className="flex items-center gap-3 text-gray-500 font-bold uppercase tracking-widest text-xs">
                                    <MapPin size={16} className="text-medical-primary" />
                                    Donated At
                                </div>
                                <p className="text-xl font-bold text-medical-dark">{hospitalName}</p>
                                <div className="h-0.5 w-full bg-gray-200 mt-8"></div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Authorized Signature</p>
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

                        <footer className="pt-12">
                            <p className="text-xs text-gray-400 font-medium">"Bringing the gift of life to another is the highest service any human can perform."</p>
                        </footer>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .fixed, .fixed * {
                        visibility: visible;
                    }
                    .fixed {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        background: white !important;
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
