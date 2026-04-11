import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Landmark,
    Plus,
    Edit,
    Trash2,
    ShieldCheck,
    TrendingUp,
    Zap,
    Briefcase,
    Leaf,
    IndianRupee,
    BadgePercent,
    CalendarClock,
    FileText,
    Search,
    Loader2,
    CheckCircle2,
    X,
    Save,
    AlertCircle,
    MoreVertical
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { usePageTitle } from '@/hooks/usePageTitle';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────
interface LoanScheme {
    id: string;
    name: string;
    provider: string;
    providerLogo: string;
    minAmount: number;
    maxAmount: number;
    interestRate: string;
    tenure: string;
    processingFee: string;
    eligibility: string[];
    features: string[];
    badge?: string;
    badgeColor?: string;
    gradient: string;
    status: 'active' | 'draft';
    publishedAt: string;
    lastDate?: string;
}

const DEFAULT_SCHEMES: LoanScheme[] = [
    {
        id: 'mudra-kishor',
        name: 'MUDRA Kishor Loan',
        provider: 'MUDRA / PSU Banks',
        providerLogo: '🏦',
        minAmount: 50000,
        maxAmount: 500000,
        interestRate: '8.5% – 12%',
        tenure: 'Up to 5 years',
        processingFee: 'Nil',
        gradient: 'from-blue-600 to-blue-800',
        badge: 'Government',
        badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
        eligibility: ['AYUSH startup with valid GST registration', 'Business operational for 1+ years'],
        features: ['Zero collateral required', 'Subsidy under PMEGP available'],
        status: 'active',
        publishedAt: new Date().toISOString(),
    },
    {
        id: 'startup-india',
        name: 'Startup India Seed Fund',
        provider: 'DPIIT / Incubators',
        providerLogo: '🚀',
        minAmount: 2000000,
        maxAmount: 5000000,
        interestRate: 'Equity / Convertible',
        tenure: 'Flexible',
        processingFee: 'Nil',
        gradient: 'from-amber-500 to-orange-600',
        badge: 'Non-Dilutive',
        badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
        eligibility: ['DPIIT-recognised startup', 'Less than 5 years since incorporation'],
        features: ['Up to ₹20 lakh as grant', 'Seed funding for R&D'],
        status: 'active',
        publishedAt: new Date().toISOString(),
    }
];

const GRADIENTS = [
    'from-blue-600 to-blue-800',
    'from-indigo-600 to-indigo-800',
    'from-amber-500 to-orange-600',
    'from-emerald-600 to-green-800',
    'from-violet-600 to-purple-800',
    'from-teal-600 to-teal-800',
    'from-rose-600 to-rose-800',
];

export default function OfficerLoans() {
    usePageTitle('Manage Loan Schemes');

    const [schemes, setSchemes] = useState<LoanScheme[]>([]);
    const [search, setSearch] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingScheme, setEditingScheme] = useState<LoanScheme | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<LoanScheme>>({
        name: '',
        provider: '',
        minAmount: 0,
        maxAmount: 0,
        interestRate: '',
        tenure: '',
        processingFee: '',
        badge: 'Government',
        gradient: GRADIENTS[0],
        eligibility: [''],
        features: [''],
        status: 'active',
        lastDate: '',
    });

    useEffect(() => {
        const saved = localStorage.getItem('ayush_loan_schemes');
        if (saved) {
            setSchemes(JSON.parse(saved));
        } else {
            setSchemes(DEFAULT_SCHEMES);
            localStorage.setItem('ayush_loan_schemes', JSON.stringify(DEFAULT_SCHEMES));
        }
    }, []);

    const saveToLocal = (updated: LoanScheme[]) => {
        setSchemes(updated);
        localStorage.setItem('ayush_loan_schemes', JSON.stringify(updated));
    };

    const handleOpenForm = (scheme?: LoanScheme) => {
        if (scheme) {
            setEditingScheme(scheme);
            setFormData(scheme);
        } else {
            setEditingScheme(null);
            setFormData({
                name: '',
                provider: '',
                minAmount: 0,
                maxAmount: 0,
                interestRate: '',
                tenure: '',
                processingFee: '',
                badge: 'Government',
                gradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
                eligibility: [''],
                features: [''],
                status: 'active',
                lastDate: '',
            });
        }
        setIsFormOpen(true);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.provider) {
            toast.error('Name and Provider are required');
            return;
        }

        setIsSaving(true);
        await new Promise(r => setTimeout(r, 800));

        const updatedSchemes = [...schemes];
        if (editingScheme) {
            const index = updatedSchemes.findIndex(s => s.id === editingScheme.id);
            updatedSchemes[index] = { ...editingScheme, ...formData } as LoanScheme;
            toast.success('Loan scheme updated successfully');
        } else {
            const newScheme = {
                ...formData,
                id: `scheme-${Date.now()}`,
                providerLogo: '🏦',
                badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
                publishedAt: new Date().toISOString(),
            } as LoanScheme;
            updatedSchemes.unshift(newScheme);
            toast.success('New loan scheme posted successfully');
        }

        saveToLocal(updatedSchemes);
        setIsFormOpen(false);
        setIsSaving(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to remove this loan scheme?')) {
            const updated = schemes.filter(s => s.id !== id);
            saveToLocal(updated);
            toast.success('Scheme removed');
        }
    };

    const filtered = schemes.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.provider.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto pt-4 pb-8 px-4 md:px-6 space-y-8">

                {/* ── Header ──────────────────────────────────────────────────────── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm">
                                <Landmark className="w-5 h-5 text-blue-600" />
                            </div>
                            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Loan Management</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search schemes..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 h-11 rounded-xl bg-white border-slate-200 text-sm shadow-sm"
                            />
                        </div>
                        <Button
                            onClick={() => handleOpenForm()}
                            className="h-11 rounded-xl px-6 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            Post Scheme
                        </Button>
                    </div>
                </div>

                {/* ── Grid ────────────────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((scheme) => (
                            <motion.div
                                key={scheme.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all"
                            >
                                <div className={cn("h-32 bg-gradient-to-br p-6 flex flex-col justify-between relative", scheme.gradient)}>
                                    <div className="absolute top-4 right-4 flex gap-2 invisible group-hover:visible transition-all z-20">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 flex items-center justify-center backdrop-blur-sm border border-white/10 transition-all text-white/70 hover:text-white">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-32 rounded-xl border-slate-100 shadow-xl p-1 animate-in fade-in zoom-in duration-200">
                                                <DropdownMenuItem
                                                    onClick={() => handleOpenForm(scheme)}
                                                    className="rounded-lg px-3 py-2 text-xs font-bold text-slate-600 focus:text-blue-600 focus:bg-blue-50 transition-colors cursor-pointer flex items-center gap-2"
                                                >
                                                    <Edit className="w-3.5 h-3.5" />
                                                    Edit Scheme
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(scheme.id)}
                                                    className="rounded-lg px-3 py-2 text-xs font-bold text-rose-600 focus:text-rose-600 focus:bg-rose-50 transition-colors cursor-pointer flex items-center gap-2"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="relative z-10 flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                                            <Landmark className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-black text-sm uppercase tracking-tight leading-tight">{scheme.name}</h3>
                                            <p className="text-white/70 text-[10px] font-bold mt-0.5 uppercase tracking-wider">{scheme.provider}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black text-white/90 uppercase tracking-widest bg-black/10 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/10 w-fit">
                                                {scheme.badge || 'New'}
                                            </span>
                                            {scheme.lastDate && new Date(scheme.lastDate) < new Date() ? (
                                                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border w-fit bg-rose-500/20 text-rose-100 border-rose-400/30">
                                                    Expired
                                                </span>
                                            ) : (
                                                <span className={cn(
                                                    "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border w-fit",
                                                    scheme.status === 'active' ? "bg-emerald-500/20 text-emerald-100 border-emerald-400/30" : "bg-amber-500/20 text-amber-100 border-amber-400/30"
                                                )}>
                                                    {scheme.status}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-white font-black text-xl tracking-tighter">
                                            {scheme.interestRate}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Max Loan</p>
                                            <p className="text-sm font-black text-slate-700">₹{scheme.maxAmount >= 100000 ? (scheme.maxAmount / 100000).toFixed(0) + 'L' : scheme.maxAmount}</p>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tenure</p>
                                            <p className="text-sm font-black text-slate-700">{scheme.tenure}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Key Features</p>
                                        {scheme.features.slice(0, 2).map((f, i) => (
                                            <p key={i} className="text-[11px] text-slate-600 font-bold flex items-start gap-2">
                                                <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                                {f}
                                            </p>
                                        ))}
                                    </div>
                                    <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <CalendarClock className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                                {scheme.lastDate ? `Deadline: ${new Date(scheme.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : `Published: ${new Date(scheme.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* ── Form Dialog ──────────────────────────────────────────────────── */}
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogContent className="max-w-lg bg-white rounded-xl p-0 overflow-hidden border-none shadow-2xl [&>button]:hidden">
                        <DialogHeader className="p-6 bg-slate-900 text-white relative">
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                                    <Landmark className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-black text-white uppercase tracking-tight">
                                        {editingScheme ? 'Update Loan Scheme' : 'Post New Loan Scheme'}
                                    </DialogTitle>
                                </div>
                            </div>
                            <DialogClose asChild>
                                <button className="absolute top-5 right-6 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/20 flex items-center justify-center transition-all active:scale-95 group/close">
                                    <X className="w-4 h-4 text-white group-hover/close:scale-110 transition-transform" />
                                </button>
                            </DialogClose>
                        </DialogHeader>

                        <div className="p-6 h-[60vh] overflow-y-auto custom-scrollbar space-y-6 bg-white">
                            {/* Section 1: Basic Info */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Scheme Name *</Label>
                                    <Input
                                        placeholder="Scheme Name"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="h-12 rounded-lg border-slate-100 bg-slate-50 focus:ring-blue-500 font-bold text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Provider *</Label>
                                    <Input
                                        placeholder="Provider"
                                        value={formData.provider}
                                        onChange={e => setFormData({ ...formData, provider: e.target.value })}
                                        className="h-12 rounded-lg border-slate-100 bg-slate-50 focus:ring-blue-500 font-bold text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Last Date to Apply</Label>
                                    <div className="relative">
                                        <CalendarClock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            type="date"
                                            value={formData.lastDate}
                                            onChange={e => setFormData({ ...formData, lastDate: e.target.value })}
                                            className="h-12 rounded-lg border-slate-100 bg-slate-50 pl-11 focus:ring-blue-500 font-bold text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1 text-rose-500 block mb-1">
                                        Note: Crossed deadline will mark scheme as Inactive.
                                    </Label>
                                    <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Interest Rate *</Label>
                                    <div className="relative">
                                        <BadgePercent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            placeholder="Interest Rate"
                                            value={formData.interestRate}
                                            onChange={e => setFormData({ ...formData, interestRate: e.target.value })}
                                            className="h-12 rounded-lg border-slate-100 bg-slate-50 pl-11 focus:ring-blue-500 font-bold text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Amounts */}
                            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Min amount (₹)</Label>
                                    <Input
                                        type="number"
                                        value={formData.minAmount}
                                        onChange={e => setFormData({ ...formData, minAmount: Number(e.target.value) })}
                                        className="h-12 rounded-lg border-slate-100 bg-slate-50 focus:ring-blue-500 font-bold text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Max amount (₹)</Label>
                                    <Input
                                        type="number"
                                        value={formData.maxAmount}
                                        onChange={e => setFormData({ ...formData, maxAmount: Number(e.target.value) })}
                                        className="h-12 rounded-lg border-slate-100 bg-slate-50 focus:ring-blue-500 font-bold text-sm"
                                    />
                                </div>
                            </div>

                            {/* Section 3: Lists */}
                            <div className="space-y-6 pt-4 border-t border-slate-50">
                                {/* Key Features */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Key Features</Label>
                                        <Button variant="ghost" size="sm" onClick={() => setFormData({ ...formData, features: [...(formData.features || []), ''] })} className="h-6 text-[10px] font-black text-blue-600 hover:bg-blue-50 uppercase tracking-widest px-2">Add More</Button>
                                    </div>
                                    {(formData.features || []).map((f, i) => (
                                        <div key={i} className="flex gap-2">
                                            <Input
                                                value={f}
                                                onChange={e => {
                                                    const newF = [...(formData.features || [])];
                                                    newF[i] = e.target.value;
                                                    setFormData({ ...formData, features: newF });
                                                }}
                                                className="h-11 rounded-xl border-slate-100 bg-slate-50/50 text-xs font-medium"
                                                placeholder=""
                                            />
                                            {i > 0 && <Button variant="ghost" size="icon" onClick={() => setFormData({ ...formData, features: formData.features?.filter((_, idx) => idx !== i) })} className="shrink-0 text-slate-300 hover:text-rose-500"><X className="w-4 h-4" /></Button>}
                                        </div>
                                    ))}
                                </div>

                                {/* Eligibility Criteria */}
                                <div className="space-y-3 pt-4 border-t border-slate-50/50">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Eligibility Criteria</Label>
                                        <Button variant="ghost" size="sm" onClick={() => setFormData({ ...formData, eligibility: [...(formData.eligibility || []), ''] })} className="h-6 text-[10px] font-black text-blue-600 hover:bg-blue-50 uppercase tracking-widest px-2">Add More</Button>
                                    </div>
                                    {(formData.eligibility || []).map((e, i) => (
                                        <div key={i} className="flex gap-2">
                                            <Input
                                                value={e}
                                                onChange={val => {
                                                    const newE = [...(formData.eligibility || [])];
                                                    newE[i] = val.target.value;
                                                    setFormData({ ...formData, eligibility: newE });
                                                }}
                                                className="h-11 rounded-xl border-slate-100 bg-slate-50/50 text-xs font-medium"
                                                placeholder=""
                                            />
                                            {i > 0 && <Button variant="ghost" size="icon" onClick={() => setFormData({ ...formData, eligibility: formData.eligibility?.filter((_, idx) => idx !== i) })} className="shrink-0 text-slate-300 hover:text-rose-500"><X className="w-4 h-4" /></Button>}
                                        </div>
                                    ))}
                                </div>


                            </div>

                            {/* Section 4: Visuals */}
                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest uppercase mb-2 block">Card Aesthetic</Label>
                                <div className="flex items-center gap-4">
                                    {GRADIENTS.map(g => (
                                        <button
                                            key={g}
                                            onClick={() => setFormData({ ...formData, gradient: g })}
                                            className={cn(
                                                "w-12 h-12 rounded-2xl bg-gradient-to-br border-4 transition-all",
                                                g,
                                                formData.gradient === g ? "border-blue-500 scale-110 shadow-lg" : "border-white shadow-sm"
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setIsFormOpen(false)}
                                className="flex-1 rounded-lg h-12 font-black text-xs uppercase tracking-widest border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all active:scale-95"
                            >
                                Discard
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 rounded-lg h-12 font-black text-xs uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        {editingScheme ? 'Update Scheme' : 'Post Scheme Now'}
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </DashboardLayout>
    );
}
