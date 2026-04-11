import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
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
    AlertCircle,
    CheckCircle2,
    XCircle,
    ExternalLink,
    Maximize2
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function ViewApplication() {
    usePageTitle('Application Details');
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [previewFile, setPreviewFile] = useState<{ url: string; title: string; type?: string } | null>(null);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const response = await fetch(`/api/applications/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setApplication(data);
                } else {
                    toast.error(data.message || "Application not found");
                    navigate('/dashboard');
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

    const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

    return (
        <>
            <DashboardLayout>
                <div className="max-w-[1200px] mx-auto pb-10">
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="rounded-xl hover:bg-slate-100 gap-2 font-bold text-slate-600 px-0"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                            Back
                        </Button>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#002b5b]">Application Dossier</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Company Info */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-8 py-6">
                                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                        <Building2 className="w-5 h-5 text-blue-600" />
                                        Company Profile
                                    </h3>
                                </div>
                                <div className="p-8">
                                    <div className="flex flex-col divide-y divide-slate-100">
                                        <DetailItem label="Company Name" value={application.companyName} icon={Building2} />
                                        <DetailItem label="GSTIN" value={application.gstin} icon={Globe} />
                                        <DetailItem label="PAN Number" value={application.panNumber} icon={FileText} />
                                        <DetailItem label="Aadhar Number" value={application.aadharNumber} icon={Users} />
                                        <DetailItem label="Drug License" value={application.drugLicenseNumber || 'N/A'} icon={FileText} />
                                        <DetailItem label="Incorporation Date" value={new Date(application.incorporationDate).toLocaleDateString()} icon={Calendar} />
                                        <DetailItem label="Employee Count" value={application.employeeCount} icon={Users} />
                                    </div>
                                </div>
                            </div>

                            {/* Founder Info */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-8 py-6">
                                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                        <Users className="w-5 h-5 text-blue-600" />
                                        Authorized Personal
                                    </h3>
                                </div>
                                <div className="p-8">
                                    <div className="flex flex-col divide-y divide-slate-100">
                                        <DetailItem label="Name" value={application.founderName} icon={Users} />
                                        <DetailItem label="Email" value={application.founderEmail} icon={Mail} />
                                    </div>
                                </div>
                            </div>

                            {/* Documents List */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 border-b border-slate-100 px-8 py-6">
                                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                        Submitted Documents
                                    </h3>
                                </div>
                                <div className="p-8">
                                    {application.documents && application.documents.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {application.documents.map((doc: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="group relative flex items-center gap-4 p-4 rounded-lg border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                                                    onClick={() => setPreviewFile(doc)}
                                                >
                                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
                                                        <FileText className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-slate-800 truncate pr-6">{doc.title}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                                {doc.type ? doc.type.split('/')[1] : 'FILE'}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-medium tracking-tight">E-Verified Document</span>
                                                        </div>
                                                    </div>
                                                    <Maximize2 className="absolute top-4 right-4 w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200 font-medium">
                                            No documents found in this dossier
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Current Status */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                                <h3 className="font-bold text-slate-800 mb-6 tracking-tight">Current Dossier Status</h3>

                                <div className="space-y-4">
                                    {application.applicationId && (
                                        <div className="text-sm font-bold text-emerald-600 flex justify-between bg-emerald-50 p-3 rounded-lg border border-emerald-100 mb-2">
                                            <span>Ministerial ID</span>
                                            <span>{application.applicationId}</span>
                                        </div>
                                    )}
                                    <div className="text-sm font-bold text-slate-400 flex justify-between">
                                        <span>Submission Date</span>
                                        <span className="text-slate-700">{new Date(application.submittedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Registered Location */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                    Registered Address
                                </h3>
                                <div className="space-y-4">
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        {application.registeredAddress}
                                    </p>
                                    <div className="pt-4 border-t border-slate-100 flex justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">State</p>
                                            <p className="text-sm font-bold text-slate-800 uppercase">{application.state.replace(/-/g, ' ')}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zip Code</p>
                                            <p className="text-sm font-bold text-slate-800">{application.pinCode}</p>
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
                <DialogContent className="max-w-4xl w-[90vw] h-[85vh] p-0 overflow-hidden bg-white border-slate-200 rounded-xl flex flex-col">
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
        </>
    );
}

function DetailItem({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
    return (
        <div className="flex items-center justify-between py-4 group first:pt-0 last:pb-0">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50/50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Icon className="w-5 h-5 text-blue-500 group-hover:text-white transition-colors" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            </div>
            <p className="text-sm font-bold text-slate-800 text-right">{value}</p>
        </div>
    );
}
