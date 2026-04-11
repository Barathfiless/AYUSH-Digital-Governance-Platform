import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
    FileText,
    CheckCircle2,
    Building2,
    Loader2,
    Clock,
    Download,
    Eye,
    AlertTriangle,
    MessageCircle,
    Send,
    X
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePageTitle } from '@/hooks/usePageTitle';
import { cn } from '@/lib/utils';

export default function Documents() {
    usePageTitle('Certifications & Compliances');
    const [isLoading, setIsLoading] = useState(true);
    const [approvedApps, setApprovedApps] = useState<any[]>([]);

    // Preview & Appeal State
    const [previewApp, setPreviewApp] = useState<any>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isAppealOpen, setIsAppealOpen] = useState(false);
    const [appealReason, setAppealReason] = useState("");
    const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false);

    const fetchStatus = async () => {
        const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
        const userId = userData?._id || userData?.id;

        if (!userId) return;

        try {
            const response = await fetch(`/api/applications/user/${userId}`);
            const data = await response.json();

            if (response.ok) {
                const approved = data.filter((app: any) => app.status === 'Approved');
                setApprovedApps(approved);
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const submitAppeal = async () => {
        if (!appealReason.trim()) {
            toast.error("Please provide a reason for your appeal");
            return;
        }

        setIsSubmittingAppeal(true);
        try {
            const response = await fetch(`/api/applications/${previewApp._id}/certificate-appeal`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: appealReason })
            });

            if (response.ok) {
                toast.success("Appeal submitted successfully. Our team will review it.");
                setIsAppealOpen(false);
                setIsPreviewOpen(false);
                setAppealReason("");
                fetchStatus();
            } else {
                toast.error("Failed to submit appeal");
            }
        } catch (error) {
            console.error("Appeal error:", error);
            toast.error("Connection error");
        } finally {
            setIsSubmittingAppeal(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto py-8 px-6">
                {approvedApps.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                            <FileText className="w-10 h-10 text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Post-Approval Certifications</h2>
                        <p className="text-slate-500 max-w-sm mx-auto mt-2">
                            No additional certifications are currently available. Please complete your license application first.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {approvedApps.map((app) => (
                            <motion.div
                                key={app._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group bg-white rounded-lg border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden transition-all active:scale-[0.98]"
                            >
                                <div className="h-24 relative overflow-hidden">
                                    {app.documents?.find((d: any) => d.title === "Company photo") ? (
                                        <img
                                            src={app.documents.find((d: any) => d.title === "Company photo").url}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            alt={app.companyName}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#002b5b] to-[#1e3a8a] flex items-center justify-center">
                                            <Building2 className="w-8 h-8 text-white opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                    <div className="absolute top-3 right-4 z-20 flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/30">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Approved</span>
                                    </div>
                                    <div className="absolute bottom-3 left-4 z-20">
                                        <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20 shadow-inner overflow-hidden">
                                            {app.documents?.find((d: any) => d.title === "Company photo") ? (
                                                <img
                                                    src={app.documents.find((d: any) => d.title === "Company photo").url}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Building2 className="w-5 h-5 text-white" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight truncate flex-1 pr-2">
                                            {app.companyName}
                                        </h3>
                                        <span className="font-mono text-[8px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                            {app.applicationId}
                                        </span>
                                    </div>

                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between text-[10px] font-bold">
                                            <span className="text-slate-500 uppercase tracking-wider">Cert Status</span>
                                            {app.certificateUrl ? (
                                                <span className="text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 uppercase text-[9px] font-black tracking-widest">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Ready
                                                </span>
                                            ) : (
                                                <span className="text-amber-600 flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 uppercase text-[9px] font-black tracking-widest">
                                                    <Clock className="w-3 h-3" />
                                                    Pending
                                                </span>
                                            )}
                                        </div>
                                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-1000",
                                                    app.certificateUrl ? "bg-emerald-500 w-full" : "bg-amber-400 w-1/2"
                                                )}
                                            ></div>
                                        </div>
                                    </div>

                                    {app.certificateUrl ? (
                                        <Button
                                            onClick={() => {
                                                setPreviewApp(app);
                                                setIsPreviewOpen(true);
                                            }}
                                            className="w-full mt-4 rounded-lg bg-[#002b5b] text-white hover:bg-blue-900 shadow-lg shadow-blue-200/50 font-black text-[10px] uppercase tracking-widest h-10 transition-all active:scale-95 flex items-center gap-2"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            Preview Cert
                                        </Button>
                                    ) : (
                                        <Button
                                            disabled
                                            className="w-full mt-4 rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 font-black text-[10px] uppercase tracking-widest h-10 shadow-none"
                                        >
                                            Awaiting Preview
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Preview Modal */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="max-w-4xl h-[90vh] bg-white rounded-xl p-0 overflow-hidden border-none shadow-2xl flex flex-col">
                    <DialogHeader className="p-4 bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between">
                        <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Eye className="w-4 h-4 text-blue-600" />
                            Certificate Preview - {previewApp?.companyName}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 bg-slate-100 p-4 overflow-hidden relative">
                        {previewApp?.certificateUrl && (
                            <iframe
                                src={previewApp.certificateUrl}
                                className="w-full h-full rounded-lg shadow-inner bg-white"
                                title="Certificate Preview"
                            />
                        )}
                    </div>
                    <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-4">
                        <div className="flex gap-2">
                            <Button
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = previewApp?.certificateUrl;
                                    link.download = `Certificate_${previewApp?.companyName}.pdf`;
                                    link.click();
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-6 rounded-lg flex items-center gap-2 shadow-lg shadow-emerald-100"
                            >
                                <Download className="w-4 h-4" />
                                Download PDF
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setIsAppealOpen(true)}
                                className="border-rose-200 text-rose-600 hover:bg-rose-50 font-bold h-10 px-6 rounded-lg flex items-center gap-2"
                            >
                                <AlertTriangle className="w-4 h-4" />
                                Appeal/Correction
                            </Button>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={() => setIsPreviewOpen(false)}
                            className="font-bold text-slate-400 hover:text-slate-600 h-10 px-6 rounded-lg"
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Appeal Modal */}
            <Dialog open={isAppealOpen} onOpenChange={setIsAppealOpen}>
                <DialogContent className="max-w-md bg-white rounded-xl p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-5 bg-rose-50 border-b border-rose-100">
                        <DialogTitle className="text-lg font-bold text-rose-800 flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Submit Correction Appeal
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-black text-slate-700 uppercase tracking-widest">Reason for Appeal</Label>
                            <Textarea
                                placeholder="Describe the errors found in the certificate (e.g., misspelled name, incorrect date)..."
                                className="min-h-[120px] rounded-xl border-slate-200 focus:ring-rose-500 focus:border-rose-500 text-sm p-4"
                                value={appealReason}
                                onChange={(e) => setAppealReason(e.target.value)}
                            />
                        </div>
                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                            <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                                Appeals are manually reviewed by the licensing officer. You will be notified once the correction is processed.
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                        <Button
                            variant="outline"
                            className="rounded-lg flex-1 font-bold h-11 text-xs border-slate-200"
                            onClick={() => setIsAppealOpen(false)}
                        >
                            Back
                        </Button>
                        <Button
                            className="rounded-lg flex-1 font-bold h-11 text-xs bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all active:scale-95 flex items-center gap-2"
                            onClick={submitAppeal}
                            disabled={isSubmittingAppeal || !appealReason.trim()}
                        >
                            {isSubmittingAppeal ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-3.5 h-3.5" />
                                    Send Appeal
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
