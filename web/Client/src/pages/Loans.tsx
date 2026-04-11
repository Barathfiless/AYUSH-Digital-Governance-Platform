import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Landmark,
    IndianRupee,
    Clock,
    CheckCircle2,
    ChevronRight,
    BadgePercent,
    ShieldCheck,
    Building2,
    Leaf,
    Zap,
    FileText,
    Phone,
    Mail,
    ExternalLink,
    Star,
    TrendingUp,
    Users,
    AlertCircle,
    X,
    Send,
    Loader2,
    CalendarClock,
    Briefcase,
    Search,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
    icon: any;
    gradient: string;
    status: 'active' | 'draft';
    publishedAt: string;
    lastDate?: string;
}

// ── Loan schemes data ─────────────────────────────────────────────────────────
const LOAN_SCHEMES: LoanScheme[] = [
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
        icon: Landmark,
        gradient: 'from-blue-600 to-blue-800',
        badge: 'Government',
        badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
        eligibility: [
            'AYUSH startup with valid GST registration',
            'Business operational for 1+ years',
            'No existing loan defaults',
        ],
        features: [
            'Zero collateral required',
            'Subsidy under PMEGP available',
            'Repayment holiday up to 6 months',
        ],
        status: 'active',
        publishedAt: new Date().toISOString(),
        lastDate: '2026-03-31',
    },
    {
        id: 'mudra-tarun',
        name: 'MUDRA Tarun Loan',
        provider: 'MUDRA / PSU Banks',
        providerLogo: '🏦',
        minAmount: 500000,
        maxAmount: 1000000,
        interestRate: '9% – 13%',
        tenure: 'Up to 7 years',
        processingFee: '0.5% of loan',
        icon: TrendingUp,
        gradient: 'from-indigo-600 to-indigo-800',
        badge: 'Government',
        badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        eligibility: [
            'Existing AYUSH manufacturing unit',
            'AYUSH license from CDSCO or state authority',
            'Minimum 2 years business vintage',
        ],
        features: [
            'Can be used for plant & machinery',
            'Working capital included',
            'Digital processing — no branch visit needed',
        ],
        status: 'active',
        publishedAt: new Date().toISOString(),
        lastDate: '2026-04-15',
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
        icon: Zap,
        gradient: 'from-amber-500 to-orange-600',
        badge: 'Non-Dilutive',
        badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
        eligibility: [
            'DPIIT-recognised startup',
            'Less than 5 years since incorporation',
            'Working on innovative AYUSH product/service',
        ],
        features: [
            'Up to ₹20 lakh as grant (no repayment)',
            'Up to ₹50 lakh as convertible debentures',
            'Facilitated through government-approved incubators',
        ],
        status: 'active',
        publishedAt: new Date().toISOString(),
    },
    {
        id: 'ayush-cgtmse',
        name: 'CGTMSE Credit Guarantee',
        provider: 'SIDBI / Commercial Banks',
        providerLogo: '🛡️',
        minAmount: 500000,
        maxAmount: 20000000,
        interestRate: '10% – 14%',
        tenure: 'Up to 10 years',
        processingFee: '1% – 1.5%',
        icon: ShieldCheck,
        gradient: 'from-emerald-600 to-green-800',
        badge: 'Collateral-Free',
        badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        eligibility: [
            'MSMEs in AYUSH sector',
            'Registered on Udyam portal',
            'Valid manufacturing / trading license',
        ],
        features: [
            'Collateral-free up to ₹2 Crore',
            'Credit guarantee covers up to 85%',
            'Applicable for both term loans & working capital',
        ],
        status: 'active',
        publishedAt: new Date().toISOString(),
    },
    {
        id: 'nbfc-ayush',
        name: 'NBFC AYUSH Business Loan',
        provider: 'Lendingkart / Flexiloans',
        providerLogo: '💳',
        minAmount: 100000,
        maxAmount: 5000000,
        interestRate: '15% – 24%',
        tenure: '6 months – 3 years',
        processingFee: '2% – 3%',
        icon: Briefcase,
        gradient: 'from-violet-600 to-purple-800',
        badge: 'Fast Disbursal',
        badgeColor: 'bg-violet-100 text-violet-700 border-violet-200',
        eligibility: [
            'GST-filed business for 1+ year',
            'Bank statement of 6 months',
            'Minimum ₹1 lakh monthly turnover',
        ],
        features: [
            'Approval in 24–48 hours',
            'Minimal documentation',
            '100% online application process',
        ],
        status: 'active',
        publishedAt: new Date().toISOString(),
    },
    {
        id: 'green-herbal',
        name: 'Green Herbal Enterprise Loan',
        provider: 'NABARD / Co-operative Banks',
        providerLogo: '🌿',
        minAmount: 200000,
        maxAmount: 3000000,
        interestRate: '7% – 10%',
        tenure: 'Up to 7 years',
        processingFee: 'Nil – 0.5%',
        icon: Leaf,
        gradient: 'from-teal-600 to-teal-800',
        badge: 'Subsidised',
        badgeColor: 'bg-teal-100 text-teal-700 border-teal-200',
        eligibility: [
            'Herbal / organic AYUSH product manufacturers',
            'Located in rural / semi-urban area preferred',
            'Environmental compliance certificate',
        ],
        features: [
            'Interest subsidy up to 3% via NABARD',
            'Priority lending under agriculture-allied sector',
            'Can fund organic certification costs',
        ],
        status: 'active',
        publishedAt: new Date().toISOString(),
    },
];

// ── Stat cards ────────────────────────────────────────────────────────────────
const STATS = [
    { label: 'Schemes Available', value: '6+', icon: Landmark, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { label: 'Max Loan Value', value: '₹2 Cr+', icon: IndianRupee, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Avg Approval Time', value: '7 Days', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { label: 'Startups Funded', value: '320+', icon: Users, color: 'text-violet-600 bg-violet-50 border-violet-100' },
];

// ── Format currency ───────────────────────────────────────────────────────────
const formatCurrency = (n: number) =>
    `₹${new Intl.NumberFormat('en-IN').format(n)}`;

// ── Enquiry form fields ───────────────────────────────────────────────────────
interface EnquiryForm {
    name: string;
    email: string;
    phone: string;
    aadhar: string;
    pan: string;
    amount: string;
    message: string;
}

// ── Page Component ─────────────────────────────────────────────────────────────
export default function Loans() {
    usePageTitle('Loans & Financing');

    const [schemes, setSchemes] = useState<LoanScheme[]>([]);
    const [selected, setSelected] = useState<LoanScheme | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEnquiring, setIsEnquiring] = useState(false);
    const [form, setForm] = useState<EnquiryForm>({ name: '', email: '', phone: '', aadhar: '', pan: '', amount: '', message: '' });
    const [filter, setFilter] = useState<'all' | 'government' | 'private' | 'subsidised'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        try {
            const saved = localStorage.getItem('ayush_loan_schemes');
            if (saved) {
                setSchemes(JSON.parse(saved));
            } else {
                setSchemes(LOAN_SCHEMES); // use default from file
            }
        } catch (e) {
            console.error("Failed to load loan schemes:", e);
            setSchemes(LOAN_SCHEMES);
        }

        // Fetch latest profile to ensure we have the phone number
        const fetchProfile = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) return;

                const res = await fetch('/api/auth/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    sessionStorage.setItem('user', JSON.stringify(data.user));
                }
            } catch (err) {
                console.error("Failed to refresh profile:", err);
            }
        };
        fetchProfile();
    }, []);

    const filtered = schemes.filter(s => {
        if (s.status === 'draft') return false;

        // Search filter
        if (searchTerm && !s.name.toLowerCase().includes(searchTerm.toLowerCase()) && !s.provider.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        if (s.lastDate && new Date(s.lastDate) < new Date()) return false;

        if (filter === 'all') return true;
        if (filter === 'government') return ['Government', 'Non-Dilutive', 'Collateral-Free', 'Subsidised'].includes(s.badge || '');
        if (filter === 'private') return s.badge === 'Fast Disbursal';
        if (filter === 'subsidised') return ['Subsidised', 'Non-Dilutive'].includes(s.badge || '');
        return true;
    });

    const openEnquiry = (scheme: LoanScheme) => {
        const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
        setSelected(scheme);
        setIsModalOpen(true);
        setForm({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone ? `+91 ${userData.phone}` : '',
            aadhar: userData.aadhar || 'Not Provided',
            pan: userData.pan || 'Not Provided',
            amount: '',
            message: ''
        });
    };

    const submitEnquiry = async () => {
        if (!form.name || !form.email || !form.phone || !form.amount) {
            toast.error('Please fill in all required fields including the amount.');
            return;
        }

        const amountNum = parseFloat(form.amount.replace(/[^0-9.]/g, ''));
        if (selected && (amountNum < selected.minAmount || amountNum > selected.maxAmount)) {
            toast.error(`Amount must be between ${formatCurrency(selected.minAmount)} and ${formatCurrency(selected.maxAmount)}`);
            return;
        }

        setIsEnquiring(true);
        try {
            const token = sessionStorage.getItem('token');
            const res = await fetch('/api/loans/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    schemeId: selected?.id,
                    schemeName: selected?.name,
                    provider: selected?.provider,
                    ...form
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success(`Loan request for "${selected?.name}" submitted successfully!`);
                setIsModalOpen(false);
            } else {
                toast.error(data.message || 'Failed to submit request');
            }
        } catch (err) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsEnquiring(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto pt-4 pb-8 px-4 md:px-6 space-y-6">

                {/* ── Actions Row (Filters + Search) ─────────────────────────────────── */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 flex-wrap text-nowrap">
                        {([
                            { key: 'all', label: 'All Schemes' },
                            { key: 'government', label: 'Government / Collateral-Free' },
                            { key: 'private', label: 'Fast Disbursal (NBFC)' },
                            { key: 'subsidised', label: 'Subsidised / Grant' },
                        ] as const).map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setFilter(tab.key)}
                                className={cn(
                                    'px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border',
                                    filter === tab.key
                                        ? 'bg-[#002b5b] text-white border-[#002b5b] shadow-lg shadow-blue-900/10'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full lg:w-64">
                        <Input
                            placeholder="Search schemes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-9 pl-9 pr-3 rounded-xl border-slate-200 text-[11px] focus:ring-blue-500 shadow-sm"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <Search className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                    </div>
                </div>

                {/* ── Loan scheme cards ────────────────────────────────────────────── */}
                <AnimatePresence mode="popLayout">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((scheme, i) => (
                            <motion.div
                                key={scheme.id}
                                layout
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.04 }}
                                className="group bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all overflow-hidden flex flex-col"
                            >
                                {/* Card header gradient */}
                                <div className={cn('h-28 bg-gradient-to-br relative flex items-end p-5', scheme.gradient)}>
                                    <div className="absolute inset-0 bg-black/10" />
                                    <div className="absolute top-4 right-4 z-10">
                                        {scheme.badge && (
                                            <span className={cn('text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border', scheme.badgeColor)}>
                                                {scheme.badge}
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative z-10 flex items-center gap-3">
                                        <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                                            {(() => {
                                                const Icon = scheme.icon || Landmark;
                                                return <Icon className="w-6 h-6 text-white" />;
                                            })()}
                                        </div>
                                        <div>
                                            <p className="text-white font-black text-sm leading-tight">{scheme.name}</p>
                                            <p className="text-white/70 text-[10px] font-bold mt-0.5">{scheme.provider}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Card body */}
                                <div className="p-5 flex-1 flex flex-col gap-4">
                                    {/* Amount range */}
                                    <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3 border border-slate-100">
                                        <div className="text-center">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Min</p>
                                            <p className="text-sm font-black text-slate-800">{formatCurrency(scheme.minAmount)}</p>
                                        </div>
                                        <div className="flex-1 mx-3 flex items-center gap-1">
                                            <div className="h-px flex-1 bg-slate-300" />
                                            <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                                            <div className="h-px flex-1 bg-slate-300" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Max</p>
                                            <p className="text-sm font-black text-slate-800">{formatCurrency(scheme.maxAmount)}</p>
                                        </div>
                                    </div>

                                    {/* Key details grid */}
                                    <div className={cn("grid gap-2 text-center", scheme.lastDate ? "grid-cols-2" : "grid-cols-1")}>
                                        {[
                                            { label: 'Interest', value: scheme.interestRate, icon: BadgePercent },
                                            ...(scheme.lastDate ? [{ label: 'Last Date', value: new Date(scheme.lastDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), icon: CalendarClock }] : []),
                                        ].map(d => (
                                            <div key={d.label} className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                                                <d.icon className="w-3.5 h-3.5 text-slate-400 mx-auto mb-1" />
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{d.label}</p>
                                                <p className="text-[10px] font-black text-slate-700 mt-0.5 leading-tight">{d.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-1.5">
                                        {scheme.features.map(f => (
                                            <div key={f} className="flex items-start gap-2">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                                <span className="text-xs text-slate-600 font-medium leading-tight">{f}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <Button
                                        onClick={() => openEnquiry(scheme)}
                                        className="mt-auto w-full rounded-lg h-10 font-black text-[10px] uppercase tracking-widest bg-[#002b5b] hover:bg-blue-900 text-white shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        Apply / Enquire
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>
            </div>

            {/* ── Enquiry Modal ──────────────────────────────────────────────────── */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-md bg-white rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-4 bg-gradient-to-br from-[#002b5b] to-[#1e5fa8] text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                                    {selected && (() => {
                                        const Icon = selected.icon || Landmark;
                                        return <Icon className="w-4 h-4 text-white" />;
                                    })()}
                                </div>
                                <div>
                                    <DialogTitle className="text-sm font-black text-white leading-tight">
                                        {selected?.name}
                                    </DialogTitle>
                                    <p className="text-blue-200 text-[9px] font-bold mt-0.5 tracking-wide">{selected?.provider}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                <X className="w-3.5 h-3.5 text-white" />
                            </button>
                        </div>
                    </DialogHeader>

                    <div className="p-4 pt-4 space-y-3">
                        {/* Eligibility quick view */}
                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex flex-wrap gap-x-4 gap-y-1">
                            {selected?.eligibility.map(e => (
                                <div key={e} className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                                    <span className="text-[10px] text-slate-600 font-bold">{e}</span>
                                </div>
                            ))}
                        </div>

                        {/* Form */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            <div className="col-span-2 space-y-0.5">
                                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</Label>
                                <Input
                                    value={form.name}
                                    readOnly
                                    className="h-9 rounded-lg border-slate-200 text-xs bg-slate-50/50 text-slate-500 cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                    <Input
                                        value={form.email}
                                        readOnly
                                        className="h-9 rounded-lg border-slate-200 text-xs pl-8 bg-slate-50/50 text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                    <Input
                                        value={form.phone}
                                        readOnly
                                        className="h-9 rounded-lg border-slate-200 text-xs pl-8 bg-slate-50/50 text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Aadhar</Label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                    <Input
                                        value={form.aadhar}
                                        readOnly
                                        className="h-9 rounded-lg border-slate-200 text-xs pl-8 bg-slate-50/50 text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">PAN</Label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                    <Input
                                        value={form.pan}
                                        readOnly
                                        className="h-9 rounded-lg border-slate-200 text-xs pl-8 bg-slate-50/50 text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="col-span-2 space-y-0.5">
                                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Amount Required</Label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                    <Input
                                        type="text"
                                        placeholder={`Enter amount between ${formatCurrency(selected?.minAmount || 0)} – ${formatCurrency(selected?.maxAmount || 0)}`}
                                        value={form.amount}
                                        onChange={e => {
                                            let val = e.target.value.replace(/[^0-9]/g, '');
                                            if (selected && val !== '') {
                                                const num = parseInt(val);
                                                if (num > selected.maxAmount) {
                                                    val = selected.maxAmount.toString();
                                                }
                                            }
                                            setForm(f => ({ ...f, amount: val }));
                                        }}
                                        onBlur={() => {
                                            if (selected && form.amount !== '') {
                                                const num = parseInt(form.amount);
                                                if (num < selected.minAmount) {
                                                    setForm(f => ({ ...f, amount: selected.minAmount.toString() }));
                                                    toast.info(`Adjusted to minimum requirement: ${formatCurrency(selected.minAmount)}`, {
                                                        id: 'amt-adjust-min' // prevent toast spam
                                                    });
                                                }
                                            }
                                        }}
                                        className="h-9 rounded-lg border-slate-200 text-xs pl-8 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="col-span-2 space-y-0.5">
                                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Purpose / Message</Label>
                                <textarea
                                    placeholder="Briefly describe your loan requirement…"
                                    value={form.message}
                                    rows={2}
                                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                    className="w-full rounded-lg border border-slate-200 text-xs p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="px-4 pb-4 flex gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 rounded-lg h-9 font-bold text-xs text-slate-500 hover:bg-slate-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={submitEnquiry}
                            disabled={isEnquiring}
                            className="flex-1 rounded-lg h-9 font-black text-[10px] uppercase tracking-wider bg-[#002b5b] hover:bg-blue-900 text-white shadow-lg shadow-blue-900/10 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                        >
                            {isEnquiring ? (
                                <><Loader2 className="w-3 h-3 animate-spin" /> Submitting…</>
                            ) : (
                                <><Send className="w-3 h-3" /> Submit</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
