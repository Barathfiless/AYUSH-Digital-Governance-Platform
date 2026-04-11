import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
    CheckCircle2,
    XCircle,
    AlertCircle,
    Building2,
    MapPin,
    Wallet,
    Package,
    ArrowLeft,
    FileText,
    Calendar,
    Users,
    Mail,
    Globe,
    Maximize2,
    Camera
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { usePageTitle } from '@/hooks/usePageTitle';
import { AiVerificationWidget } from '@/components/common/AiVerificationWidget';

export default function ReviewApplication() {
    usePageTitle('Review Application');
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [previewFile, setPreviewFile] = useState<{ url: string; title: string; type?: string } | null>(null);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [renewalDate, setRenewalDate] = useState('');

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const response = await fetch(`/api/applications/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setApplication(data);
                } else {
                    toast.error(data.message || "Application not found");
                    navigate('/officer');
                }
            } catch (error) {
                console.error("Error fetching application details:", error);
                toast.error("Failed to load application details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplication();
    }, [id, navigate]);

    const handleStatusUpdate = async (newStatus: string, rejectionReason?: string, renewalDateValue?: string) => {
        setIsUpdating(true);
        try {
            const body: any = { status: newStatus };
            if (rejectionReason) body.rejectionReason = rejectionReason;
            if (renewalDateValue) body.renewalDate = renewalDateValue;

            const response = await fetch(`/api/applications/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                const returnPath = '/officer';

                let successMessage = `Application ${newStatus} successfully!`;
                if (newStatus === 'SiteInspection') {
                    successMessage = "Application moved to Site Inspection portal.";
                } else if (newStatus === 'Approved') {
                    successMessage = "Application has been fully approved!";
                } else if (newStatus === 'Rejected') {
                    successMessage = "Application has been rejected with reasoning.";
                }

                toast.success(successMessage);
                setApplication({ ...application, status: newStatus, rejectionReason });

                if (newStatus === 'Rejected') {
                    setIsRejectDialogOpen(false);
                    setReason('');
                }

                if (newStatus === 'Approved') {
                    setIsApproveDialogOpen(false);
                }

                setTimeout(() => navigate(returnPath), 1500);
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Network error");
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex h-[60vh] items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!application) return null;

    return (
        <>
            <DashboardLayout>
                <div className="max-w-[1400px] mx-auto pb-10 px-4">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-5">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate('/officer')}
                                className="rounded-xl hover:bg-white shadow-sm border border-slate-200 h-12 w-12 shrink-0 transition-all hover:scale-105"
                            >
                                <ArrowLeft className="w-5 h-5 text-slate-600" />
                            </Button>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex items-center justify-center shrink-0">
                                    {application.documents?.find((d: any) => d.title === "Company photo") ? (
                                        <img
                                            src={application.documents.find((d: any) => d.title === "Company photo").url}
                                            className="w-full h-full object-cover"
                                            alt="Logo"
                                        />
                                    ) : (
                                        <Building2 className="w-8 h-8 text-slate-200" />
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        {application.applicationId && (
                                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg uppercase tracking-widest border border-emerald-100">
                                                {application.applicationId}
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-3xl font-bold text-[#001b3d] tracking-tight">{application.companyName}</h1>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                className="bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl gap-2 h-12 px-8 font-bold text-xs uppercase tracking-widest transition-all shadow-sm"
                                disabled={isUpdating || application.status === 'Rejected'}
                                onClick={() => setIsRejectDialogOpen(true)}
                            >
                                <XCircle className="w-4 h-4" />
                                Reject Application
                            </Button>

                            {application.status === 'Pending' && (
                                <Button
                                    className="bg-[#002b5b] hover:bg-[#001b3d] text-white rounded-xl gap-2 h-12 px-8 font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20"
                                    disabled={isUpdating}
                                    onClick={() => handleStatusUpdate('SiteInspection')}
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Approve for Inspection
                                </Button>
                            )}

                            {application.status === 'SiteInspection' && (
                                <Button
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 h-12 px-8 font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20"
                                    disabled={isUpdating}
                                    onClick={() => setIsApproveDialogOpen(true)}
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Approve
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Company Info Card */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-3 text-sm uppercase tracking-wider">
                                        <Building2 className="w-4 h-4 text-blue-600" />
                                        Organization Credentials
                                    </h3>
                                </div>
                                <div className="p-8">
                                    <div className="space-y-6 max-w-2xl">
                                        <DetailItem label="Full Legal Name" value={application.companyName} icon={Building2} />
                                        <DetailItem label="GST Identification" value={application.gstin} icon={Globe} />
                                        <DetailItem label="PAN Card Number" value={application.panNumber} icon={FileText} />
                                        <DetailItem label="Aadhar Verification" value={application.aadharNumber} icon={Users} />
                                        <DetailItem label="Drug License No." value={application.drugLicenseNumber || 'Not Provided'} icon={FileText} />
                                        <DetailItem label="Incorporation Ref." value={new Date(application.incorporationDate).toLocaleDateString()} icon={Calendar} />
                                        <DetailItem label="Workforce Scale" value={application.employeeCount} icon={Users} />
                                    </div>
                                </div>
                            </div>

                            {/* Documents List */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-3 text-sm uppercase tracking-wider">
                                        <FileText className="w-4 h-4 text-blue-600" />
                                        Compliance Documentation
                                    </h3>
                                </div>
                                <div className="p-8">
                                    {application.documents && application.documents.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {application.documents.map((doc: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="group relative flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:border-blue-400 hover:bg-white hover:shadow-md transition-all cursor-pointer"
                                                    onClick={() => setPreviewFile(doc)}
                                                >
                                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                                                        <FileText className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-slate-800 truncate pr-6">{doc.title}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                                {doc.type ? doc.type.split('/')[1] : 'PDF'} source
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Maximize2 className="absolute top-4 right-4 w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 font-medium">
                                            No artifacts found in this dossier
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Founder Info Card */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-3 text-sm uppercase tracking-wider">
                                        <Users className="w-4 h-4 text-blue-600" />
                                        Promoter Details
                                    </h3>
                                </div>
                                <div className="p-8">
                                    <div className="space-y-6 max-w-2xl">
                                        <DetailItem label="Primary Founder" value={application.founderName} icon={Users} />
                                        <DetailItem label="Official Communication" value={application.founderEmail} icon={Mail} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* AI Verification Widget */}
                            {id && <AiVerificationWidget applicationId={id} />}

                            {/* Status Card */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                                <h3 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-wider border-b border-slate-100 pb-4">Verification Status</h3>
                                <div className={cn(
                                    "flex items-center gap-3 p-4 rounded-xl border mb-6 font-bold text-sm",
                                    application.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                        application.status === 'Approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                            "bg-rose-50 text-rose-600 border-rose-100"
                                )}>
                                    {application.status === 'Pending' && <AlertCircle className="w-5 h-5 animate-pulse" />}
                                    {application.status === 'SiteInspection' && <Building2 className="w-5 h-5" />}
                                    {application.status === 'Approved' && <CheckCircle2 className="w-5 h-5" />}
                                    {application.status === 'Rejected' && <XCircle className="w-5 h-5" />}
                                    {application.status === 'SiteInspection'
                                        ? (application.verifiedBy ? 'Site Verified' : 'Awaiting Inspection')
                                        : application.status}
                                </div>

                                {application.inspectionImage && (
                                    <div className="mb-6 space-y-4">
                                        <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                                            <img src={application.inspectionImage} alt="Site Inspection" className="w-full aspect-video object-cover" />
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                                <p className="text-[9px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                                                    <Camera className="w-3 h-3 text-blue-400" />
                                                    Inspection Evidence
                                                </p>
                                            </div>
                                        </div>
                                        {application.inspectionLocation && (
                                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-100">
                                                    <MapPin className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase">GPS AUTHENTICATION</p>
                                                    <p className="text-[10px] font-mono font-bold text-slate-700">
                                                        {application.inspectionLocation.lat.toFixed(6)}, {application.inspectionLocation.lng.toFixed(6)}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-400 font-bold uppercase tracking-wider">Dossier ID</span>
                                        <span className="font-bold text-slate-800 font-mono">{application.applicationId || id?.substring(0, 8).toUpperCase()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-400 font-bold uppercase tracking-wider">Submission</span>
                                        <span className="font-bold text-slate-700">{new Date(application.submittedAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-400 font-bold uppercase tracking-wider">Reviewed On</span>
                                        <span className="font-bold text-slate-700">{new Date().toLocaleDateString()}</span>
                                    </div>
                                    {application.verifiedBy && (
                                        <div className="flex items-center justify-between text-xs pt-2 mt-2 border-t border-slate-50">
                                            <span className="text-slate-400 font-bold uppercase tracking-wider">Verified By</span>
                                            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-tighter">{application.verifiedBy}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Address Card */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                                <h3 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-wider border-b border-slate-100 pb-4 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    Location Registry
                                </h3>
                                <div className="space-y-4">
                                    <p className="text-slate-600 leading-relaxed font-bold text-sm">
                                        {application.registeredAddress}
                                    </p>
                                    <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Region</p>
                                            <p className="text-xs font-bold text-slate-800 uppercase">{application.state.replace(/-/g, ' ')}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Zip</p>
                                            <p className="text-xs font-bold text-slate-800">{application.pinCode}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Financials Card */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                                <h3 className="font-bold text-slate-800 mb-6 text-sm uppercase tracking-wider border-b border-slate-100 pb-4 flex items-center gap-2">
                                    <Wallet className="w-4 h-4 text-blue-600" />
                                    Economic Profile
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                            <Building2 className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Banking</p>
                                            <p className="text-sm font-bold text-slate-800">{application.bankName}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Growth</p>
                                            <p className="text-xs font-bold text-slate-800 capitalize">{application.fundingStage}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bandwidth</p>
                                            <p className="text-xs font-bold text-slate-800">{application.annualRevenue}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>

            {/* Document Preview Dialog */}
            <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
                <DialogContent className="max-w-4xl w-[90vw] h-[85vh] p-0 overflow-hidden bg-white border-slate-200 rounded-[32px] flex flex-col">
                    <DialogHeader className="p-4 bg-white border-b flex flex-row items-center justify-between shrink-0">
                        <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            {previewFile?.title}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 bg-slate-50 flex items-center justify-center overflow-hidden p-4">
                        {previewFile?.url.toLowerCase().endsWith('.pdf') ? (
                            <iframe
                                src={previewFile.url}
                                className="w-full h-full rounded-xl shadow-inner border-none"
                                title={previewFile.title}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center overflow-auto custom-scrollbar">
                                <img
                                    src={previewFile?.url}
                                    alt={previewFile?.title}
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                />
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Rejection Dialog */}
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent className="max-w-md bg-white rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-8 bg-slate-50 border-b border-slate-100">
                        <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-rose-500" />
                            Reject Application
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium mt-2">
                            Please provide a valid reason for rejecting this license application. This will be visible to the startup.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-8 space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="reason" className="text-sm font-bold text-slate-700 uppercase tracking-widest">
                                Rejection Reason
                            </Label>
                            <Input
                                id="reason"
                                placeholder="e.g. Incomplete documentation for PAN details"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
                        <Button
                            variant="ghost"
                            className="flex-1 rounded-xl h-12 font-bold text-slate-500 hover:bg-slate-200"
                            onClick={() => setIsRejectDialogOpen(false)}
                            disabled={isUpdating}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 rounded-xl h-12 font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-200 transition-all active:scale-95"
                            onClick={() => handleStatusUpdate('Rejected', reason)}
                            disabled={isUpdating || !reason.trim()}
                        >
                            {isUpdating ? 'Rejecting...' : 'Confirm Reject'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Approve/Issuance Dialog */}
            <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                <DialogContent className="max-w-md bg-white rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-8 bg-slate-50 border-b border-slate-100">
                        <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            Final Approval
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium mt-2">
                            Set the renewal date for this license before finalizing the approval.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-8 space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="renewalDate" className="text-sm font-bold text-slate-700 uppercase tracking-widest">
                                Renewal Date (Valid Until)
                            </Label>
                            <Input
                                id="renewalDate"
                                type="date"
                                value={renewalDate}
                                onChange={(e) => setRenewalDate(e.target.value)}
                                className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-emerald-500"
                            />
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
                        <Button
                            variant="ghost"
                            className="flex-1 rounded-xl h-12 font-bold text-slate-500 hover:bg-slate-200"
                            onClick={() => setIsApproveDialogOpen(false)}
                            disabled={isUpdating}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 rounded-xl h-12 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 transition-all active:scale-95"
                            onClick={() => handleStatusUpdate('Approved', undefined, renewalDate)}
                            disabled={isUpdating || !renewalDate}
                        >
                            {isUpdating ? 'Approving...' : 'Confirm Approval'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function DetailItem({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
    return (
        <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-50/50 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-blue-500" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-sm font-bold text-slate-800 leading-tight">{value}</p>
            </div>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
