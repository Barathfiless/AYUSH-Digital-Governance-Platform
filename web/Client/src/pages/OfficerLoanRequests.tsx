import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
    Landmark,
    ShieldCheck,
    IndianRupee,
    Phone,
    Mail,
    FileText,
    Search,
    Loader2,
    CheckCircle2,
    X,
    AlertCircle,
    Building2,
    Clock,
    ChevronRight,
    Check,
    Ban
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { usePageTitle } from '@/hooks/usePageTitle';
import { cn } from '@/lib/utils';

interface LoanRequest {
    _id: string;
    companyName: string;
    email: string;
    phone: string;
    aadhar: string;
    pan: string;
    schemeName: string;
    provider: string;
    amount: number;
    message: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    submittedAt: string;
}

export default function OfficerLoanRequests() {
    usePageTitle('Loan Requests');
    const [searchParams, setSearchParams] = useSearchParams();
    const activeStatus = searchParams.get('status') || 'Pending';
    const [requests, setRequests] = useState<LoanRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<LoanRequest | null>(null);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [actionType, setActionType] = useState<'Approve' | 'Reject' | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await fetch('/api/loans/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setRequests(data.data);
            }
        } catch (error) {
            toast.error('Failed to fetch loan requests');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async () => {
        if (!selectedRequest || !actionType) return;

        try {
            const token = sessionStorage.getItem('token');
            const res = await fetch(`/api/loans/${selectedRequest._id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: actionType === 'Approve' ? 'Approved' : 'Rejected',
                    rejectionReason: actionType === 'Reject' ? rejectionReason : undefined
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success(`Request ${actionType === 'Approve' ? 'Approved' : 'Rejected'} successfully`);
                fetchRequests();
                setIsActionModalOpen(false);
                setSelectedRequest(null);
                setRejectionReason('');
            }
        } catch (error) {
            toast.error('Action failed');
        }
    };

    const filtered = requests.filter(r => {
        const matchesStatus = r.status === activeStatus;
        const matchesSearch =
            r.companyName.toLowerCase().includes(search.toLowerCase()) ||
            r.schemeName.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const formatCurrency = (n: number) => `₹${new Intl.NumberFormat('en-IN').format(n)}`;

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto pt-4 pb-8 px-4 md:px-6 space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 shadow-sm">
                            <Landmark className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">Loan Requests</h1>
                            <p className="text-xs font-bold text-slate-400">Review and approve startup loan applications</p>
                        </div>
                    </div>

                    <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner w-fit">
                        {['Pending', 'Approved', 'Rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setSearchParams({ status })}
                                className={cn(
                                    "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                    activeStatus === status
                                        ? "bg-white text-indigo-600 shadow-md transform scale-[1.02]"
                                        : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder={`Search ${activeStatus.toLowerCase()}...`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 h-11 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-50 shadow-sm font-medium"
                        />
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                        <p className="text-sm font-bold text-slate-400">Loading requests...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="font-black text-slate-800 uppercase text-lg">No Pending Requests</h3>
                        <p className="text-slate-400 font-bold text-sm max-w-xs mx-auto mt-2">
                            When startups apply for loans, they will appear here for your review and approval.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        <AnimatePresence>
                            {filtered.map((req, i) => (
                                <motion.div
                                    key={req._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col lg:flex-row lg:items-center gap-6 group hover:shadow-xl hover:border-indigo-100 transition-all"
                                >
                                    <div className="flex items-center gap-4 lg:w-1/4">
                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                                            <Building2 className="w-6 h-6 text-slate-400 group-hover:text-indigo-500" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <h4 className="font-black text-slate-800 uppercase text-sm truncate">{req.companyName}</h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    req.status === 'Pending' ? "bg-amber-400" :
                                                        req.status === 'Approved' ? "bg-emerald-400" : "bg-red-400"
                                                )} />
                                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                                    {req.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:flex-1">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Applied for</p>
                                            <p className="text-xs font-bold text-slate-700">{req.schemeName}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Amount</p>
                                            <p className="text-xs font-black text-indigo-600">{formatCurrency(req.amount)}</p>
                                        </div>
                                        <div className="space-y-1 flex items-center gap-3 lg:justify-end pr-4">
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                                                <Clock className="w-3 h-3 text-slate-400" />
                                                <span className="text-[10px] font-bold text-slate-500">
                                                    {new Date(req.submittedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {activeStatus === 'Pending' && (
                                        <div className="flex items-center gap-2 lg:justify-end">
                                            <Button
                                                variant="ghost"
                                                onClick={() => {
                                                    setSelectedRequest(req);
                                                    setActionType('Reject');
                                                    setIsActionModalOpen(true);
                                                }}
                                                className="h-9 px-4 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 font-black text-[10px] uppercase tracking-wider"
                                            >
                                                <Ban className="w-3.5 h-3.5 mr-2" />
                                                Reject
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setSelectedRequest(req);
                                                    setActionType('Approve');
                                                    setIsActionModalOpen(true);
                                                }}
                                                className="h-9 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-wider shadow-lg shadow-emerald-500/20"
                                            >
                                                <Check className="w-3.5 h-3.5 mr-2" />
                                                Approve
                                            </Button>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Action Modal */}
            <Dialog open={isActionModalOpen} onOpenChange={setIsActionModalOpen}>
                <DialogContent className="max-w-sm rounded-3xl p-0 overflow-hidden border-none">
                    <DialogHeader className={cn(
                        "p-6 text-white",
                        actionType === 'Approve' ? "bg-emerald-500" : "bg-red-500"
                    )}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                {actionType === 'Approve' ? <CheckCircle2 className="w-6 h-6" /> : <Ban className="w-6 h-6" />}
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-black uppercase tracking-tight">
                                    {actionType} Loan Request?
                                </DialogTitle>
                                <p className="text-xs opacity-80 font-bold">{selectedRequest?.companyName}</p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="p-6 space-y-4">
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-400 uppercase">Scheme</span>
                                <span className="text-xs font-bold text-slate-700">{selectedRequest?.schemeName}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-400 uppercase">Requested Amount</span>
                                <span className="text-xs font-black text-indigo-600">{formatCurrency(selectedRequest?.amount || 0)}</span>
                            </div>
                        </div>

                        {actionType === 'Reject' && (
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Rejection Reason</label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Explain why the loan was rejected..."
                                    className="w-full h-24 rounded-2xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-red-100 focus:border-red-200 outline-none resize-none"
                                />
                            </div>
                        )}

                        <p className="text-[10px] text-slate-400 text-center font-bold px-4">
                            Are you sure you want to {actionType?.toLowerCase()} this loan request? This action cannot be undone.
                        </p>
                    </div>

                    <DialogFooter className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => setIsActionModalOpen(false)}
                            className="flex-1 h-11 rounded-xl text-xs font-black uppercase tracking-widest"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAction}
                            className={cn(
                                "flex-1 h-11 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-lg",
                                actionType === 'Approve' ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" : "bg-red-500 hover:bg-red-600 shadow-red-500/20"
                            )}
                        >
                            Confirm {actionType}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
