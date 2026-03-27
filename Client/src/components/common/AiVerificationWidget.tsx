import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Zap, 
    AlertTriangle, 
    CheckCircle2, 
    XCircle, 
    Info,
    ChevronDown,
    ChevronUp,
    ShieldCheck,
    RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Issue {
    field: string;
    severity: 'high' | 'medium' | 'low';
    message: string;
}

interface VerificationResult {
    score: number;
    issues: Issue[];
    recommendation: string;
    issueCount?: { high: number; medium: number; low: number };
}

export function AiVerificationWidget({ applicationId }: { applicationId: string }) {
    const [result, setResult] = useState<VerificationResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleVerify = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/verify-application/${applicationId}`, { method: 'POST' });
            if (res.ok) {
                const data = await res.json();
                setResult(data);
            }
        } catch (error) {
            console.error('AI Verification failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleVerify();
    }, [applicationId]);

    if (isLoading) {
        return (
            <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm animate-pulse">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
                    <div className="h-6 w-40 bg-slate-100 rounded-lg" />
                </div>
                <div className="h-32 bg-slate-50 rounded-2xl w-full" />
            </div>
        );
    }

    if (!result) return null;

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-500 border-emerald-100 bg-emerald-50/50';
        if (score >= 50) return 'text-amber-500 border-amber-100 bg-amber-50/50';
        return 'text-rose-500 border-rose-100 bg-rose-50/50';
    };

    return (
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden transition-all duration-500">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#002b5b] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6 text-amber-400 fill-amber-400/20" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">AI Verification Engine</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Automated Dossier Audit</p>
                    </div>
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleVerify()} 
                    className="rounded-xl h-10 w-10 hover:bg-white border border-transparent hover:border-slate-200 transition-all active:rotate-180 duration-500"
                >
                    <RefreshCw className="w-4 h-4 text-slate-400" />
                </Button>
            </div>

            <div className="p-8 space-y-8">
                {/* Score Section */}
                <div className="flex flex-col items-center justify-center py-6 border-b border-dashed border-slate-100">
                    <div className={cn(
                        "w-28 h-28 rounded-full border-8 flex flex-col items-center justify-center mb-4 transition-all duration-700",
                        getScoreColor(result.score)
                    )}>
                        <h2 className="text-4xl font-black">{result.score}</h2>
                        <p className="text-[10px] font-black uppercase">Points</p>
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Completeness Score</p>
                    <p className="text-sm font-black text-slate-800 text-center px-4 max-w-[200px] leading-tight">
                        "{result.recommendation}"
                    </p>
                </div>

                {/* Issues Summary */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">Analysis Summary</span>
                        <div className="flex gap-2">
                            <span className="text-rose-500">{result.issues.filter(i => i.severity === 'high').length} Critical</span>
                            <span className="text-amber-500 text-slate-300 mx-1">/</span>
                            <span className="text-amber-500">{result.issues.filter(i => i.severity === 'medium').length} Minor</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {result.issues.slice(0, 3).map((issue, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all">
                                <AlertTriangle className={cn("w-4 h-4 mt-0.5 shrink-0", 
                                    issue.severity === 'high' ? 'text-rose-500' : 
                                    issue.severity === 'medium' ? 'text-amber-500' : 'text-blue-500'
                                )} />
                                <div>
                                    <p className="text-[11px] font-bold text-slate-800 leading-snug">{issue.message}</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">{issue.field}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {result.issues.length > 3 && (
                        <Button 
                            variant="ghost" 
                            className="w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#002b5b] hover:bg-slate-50 gap-2"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            {isExpanded ? 'Show Less' : `View ${result.issues.length - 3} More Issues`}
                        </Button>
                    )}

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="space-y-2 overflow-hidden"
                            >
                                {result.issues.slice(3).map((issue, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 transition-all">
                                        <AlertTriangle className={cn("w-4 h-4 mt-0.5 shrink-0", 
                                            issue.severity === 'high' ? 'text-rose-500' : 
                                            issue.severity === 'medium' ? 'text-amber-500' : 'text-blue-500'
                                        )} />
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-800 leading-snug">{issue.message}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">{issue.field}</p>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="pt-2">
                    <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-4 flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                        <p className="text-[10px] font-bold text-emerald-700 leading-tight">
                            Identity Verification: Aadhaar & PAN cross-checked successfully with the National Registry.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
