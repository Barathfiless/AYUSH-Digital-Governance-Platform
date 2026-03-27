import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ShieldCheck, 
    Download, 
    Printer, 
    FileCheck, 
    MapPin, 
    Calendar,
    Users,
    Building2,
    CheckCircle2,
    RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LicenseVerification() {
    const { id } = useParams();
    const [verifying, setVerifying] = useState(true);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const check = async () => {
            setVerifying(true);
            try {
                const res = await fetch(`/api/verify/license/${id}`);
                const data = await res.json();
                if (res.ok && data.success) {
                    setResult(data.data);
                } else {
                    setError(data.message || 'Invalid or Expired License');
                }
            } catch (err) {
                setError('Verification service unavailable');
            } finally {
                setVerifying(false);
            }
        };
        check();
    }, [id]);

    if (verifying) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-slate-50">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6" />
                <h2 className="text-xl font-black text-[#002b5b] uppercase tracking-widest animate-pulse">Verifying e-Ayush License...</h2>
                <p className="text-slate-400 text-xs mt-2 font-bold uppercase">Cross-referencing National Registry Dossier</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col h-screen items-center justify-center p-6 bg-rose-50/30">
                <div className="w-20 h-20 bg-rose-100 rounded-[32px] flex items-center justify-center mb-8 shadow-lg shadow-rose-200/50">
                    <ShieldCheck className="w-10 h-10 text-rose-500 opacity-30" />
                </div>
                <h1 className="text-3xl font-black text-rose-600 mb-2 uppercase tracking-tighter">Verification Failed</h1>
                <p className="text-slate-500 font-bold max-w-sm text-center mb-8 leading-relaxed">
                    {error}. If this is an old certificate, the license might be revoked or expired.
                </p>
                <Button onClick={() => window.location.reload()} className="h-12 px-8 bg-slate-900 rounded-xl font-bold gap-2">
                    <RefreshCw className="w-4 h-4" /> Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] py-20 px-8 flex flex-col items-center">
            {/* Certificate Container */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-[850px] w-full bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 flex flex-col"
            >
                {/* Certificate Header Decoration */}
                <div className="h-3 bg-gradient-to-r from-blue-600 via-emerald-500 to-indigo-600" />
                
                <div className="p-16 relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex items-center justify-center overflow-hidden">
                        <ShieldCheck className="w-[600px] h-[600px] text-slate-900 -rotate-12" />
                    </div>

                    <div className="relative z-10">
                        {/* Certificate Body */}
                        <div className="flex items-center justify-between mb-16">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-[#002b5b] rounded-[24px] flex items-center justify-center shadow-lg">
                                    <ShieldCheck className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Government of India</h2>
                                    <h1 className="text-2xl font-black text-[#002b5b] tracking-tighter">MINISTRY OF AYUSH</h1>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="px-5 py-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Authentic Certificate
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">License Ref: {result.licenseNumber}</p>
                            </div>
                        </div>

                        <div className="text-center mb-16">
                            <h3 className="text-4xl font-black text-slate-800 mb-6 uppercase tracking-tighter">Certificate of Approval</h3>
                            <p className="text-slate-500 font-bold max-w-xl mx-auto leading-relaxed">
                                This document certifies that the organization listed below has met the stringent quality and safety standards 
                                mandated by the <span className="text-blue-600">Digital Ayush Regulatory Framework</span>.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 mb-20 bg-slate-50/50 p-10 rounded-[32px] border border-slate-100">
                            <div className="space-y-6">
                                <InfoItem label="Enterprise Name" value={result.companyName} icon={Building2} />
                                <InfoItem label="Operational Region" value={result.state.replace(/-/g, ' ').toUpperCase()} icon={MapPin} />
                                <InfoItem label="Authorized Promoter" value={result.founder} icon={Users} />
                            </div>
                            <div className="space-y-6">
                                <InfoItem label="License Issuance" value={new Date(result.issueDate).toLocaleDateString()} icon={Calendar} />
                                <InfoItem label="Renewal Requirement" value={new Date(result.validUntil).toLocaleDateString()} icon={RefreshCw} />
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shrink-0 shadow-sm">
                                        <FileCheck className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                                            <p className="text-sm font-black text-emerald-600 uppercase tracking-tight">{result.status}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-end justify-between border-t border-slate-100 pt-16">
                            <div className="space-y-4">
                                <div className="w-48 h-[1px] bg-slate-200" />
                                <div>
                                    <p className="text-xs font-black text-slate-800 tracking-tighter">DIGITAL COMMISSIONER</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Bureau of Traditional Medicine</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                {/* Simulated QR Code Area */}
                                <div className="w-24 h-24 p-2 border-2 border-slate-100 rounded-2xl flex items-center justify-center mb-1">
                                    <div className="w-full h-full bg-slate-50 flex items-center justify-center text-[10px] font-black uppercase text-slate-300">
                                        QR
                                    </div>
                                </div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Scan to Verify</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Actions */}
            <div className="mt-12 flex gap-4">
                <Button variant="outline" className="h-14 px-10 rounded-2xl font-bold bg-white gap-3 border-slate-200 shadow-sm hover:translate-y-[-2px] transition-all">
                    <Printer className="w-5 h-5" /> Print Copy
                </Button>
                <Button className="h-14 px-10 rounded-2xl font-bold bg-[#002b5b] hover:bg-slate-900 gap-3 shadow-lg shadow-blue-900/20 hover:translate-y-[-2px] transition-all">
                    <Download className="w-5 h-5" /> Download Verified PDF
                </Button>
            </div>

            <p className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center max-w-sm leading-relaxed">
                Notice: Tampering with this certificate is an offense under the Digital India Act and AYUSH Compliance Rules.
            </p>
        </div>
    );
}

function InfoItem({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
    return (
        <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shrink-0 shadow-sm">
                <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{value}</p>
            </div>
        </div>
    );
}
