import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Users, Building2, ShieldCheck, Activity, Search, Filter, MoreVertical,
    CheckCircle, XCircle, Clock, ArrowUpRight, UserPlus, Settings, Database, Lock,
    Mail, RefreshCw, BarChart3, FileText, FileSearch, ShieldAlert, TrendingUp,
    AlertTriangle, Calendar, MapPin, Package, Zap, Bell
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { cn } from '@/lib/utils';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

interface AnalyticsData {
    summary: {
        totalApplications: number;
        totalUsers: number;
        approvalRate: number;
        pending: number;
        approved: number;
        rejected: number;
        siteInspection: number;
    };
    monthlyTrend: { month: string; submitted: number; approved: number; rejected: number }[];
    stateWise: { state: string; total: number; approved: number }[];
    topCategories: { category: string; count: number }[];
    renewalAlerts: { companyName: string; applicationId: string; renewalDate: string; state: string; daysLeft: number }[];
}

export default function AdminDashboard() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab') || 'overview';
    const [activeTab, setActiveTab] = useState(tabParam);
    const navigate = useNavigate();

    const tabTitles: Record<string, string> = {
        overview: 'Admin Analytics',
        users: 'User Management',
        applications: 'Global Applications',
        security: 'System Security',
    };
    usePageTitle(tabTitles[activeTab] || 'Admin Control Center');

    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userSearch, setUserSearch] = useState('');
    const [userPage, setUserPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [verifyResult, setVerifyResult] = useState<Record<string, any>>({});
    const [verifyingId, setVerifyingId] = useState<string | null>(null);

    const handleTabChange = (t: string) => { setActiveTab(t); setSearchParams({ tab: t }); };

    useEffect(() => {
        if (tabParam && tabParam !== activeTab) setActiveTab(tabParam);
    }, [tabParam]);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const [analyticsRes, appsRes] = await Promise.all([
                    fetch('/api/admin/analytics'),
                    fetch('/api/applications/all'),
                ]);
                if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
                if (appsRes.ok) setApplications(await appsRes.json());
            } catch (e) { console.error(e); }
            finally { setIsLoading(false); }
        };
        load();
    }, []);

    useEffect(() => {
        if (activeTab !== 'users') return;
        const loadUsers = async () => {
            try {
                const res = await fetch(`/api/admin/users?page=${userPage}&limit=15&search=${encodeURIComponent(userSearch)}`);
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data.users);
                    setTotalUsers(data.pagination.total);
                }
            } catch (e) { console.error(e); }
        };
        loadUsers();
    }, [activeTab, userSearch, userPage]);

    const handleVerify = async (appId: string) => {
        setVerifyingId(appId);
        try {
            const res = await fetch(`/api/admin/verify-application/${appId}`, { method: 'POST' });
            if (res.ok) {
                const data = await res.json();
                setVerifyResult(prev => ({ ...prev, [appId]: data }));
            }
        } catch (e) { console.error(e); }
        finally { setVerifyingId(null); }
    };

    const summaryCards = analytics ? [
        { label: 'Total Applications', value: analytics.summary.totalApplications, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        { label: 'Registered Users', value: analytics.summary.totalUsers, icon: Users, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
        { label: 'Approval Rate', value: `${analytics.summary.approvalRate}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        { label: 'Pending Review', value: analytics.summary.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
        { label: 'Site Inspections', value: analytics.summary.siteInspection, icon: MapPin, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
        { label: 'Renewal Alerts', value: analytics.renewalAlerts.length, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
    ] : [];

    const pieData = analytics ? [
        { name: 'Approved', value: analytics.summary.approved },
        { name: 'Pending', value: analytics.summary.pending },
        { name: 'Rejected', value: analytics.summary.rejected },
        { name: 'Inspection', value: analytics.summary.siteInspection },
    ].filter(d => d.value > 0) : [];

    const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

    return (
        <DashboardLayout>
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 bg-[#002b5b] rounded-2xl flex items-center justify-center shadow-lg">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-[#002b5b]">
                                Admin <span className="text-blue-600">Control Center</span>
                            </h1>
                        </div>
                        <p className="text-xs text-slate-400 font-medium ml-13 pl-13">
                            Real-time analytics, user management &amp; AI verification
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => window.location.reload()} className="gap-2 bg-white rounded-xl shadow-sm border-slate-200">
                            <RefreshCw className="w-4 h-4 text-emerald-600" /> Refresh
                        </Button>
                        <Button className="gap-2 bg-[#002b5b] hover:bg-[#1a406d] rounded-xl shadow-lg shadow-blue-900/20">
                            <Settings className="w-4 h-4" /> Settings
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar">
                    {[
                        { id: 'overview', label: 'Analytics Overview', icon: BarChart3 },
                        { id: 'users', label: 'User Management', icon: Users },
                        { id: 'applications', label: 'All Applications', icon: FileText },
                        { id: 'security', label: 'Security', icon: Lock },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={cn(
                                'flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap',
                                activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600 bg-blue-50/30'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                            )}
                        >
                            <tab.icon className="w-4 h-4" /> {tab.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                {/* Summary Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    {isLoading
                                        ? Array.from({ length: 6 }).map((_, i) => (
                                            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse h-28" />
                                        ))
                                        : summaryCards.map((card, i) => (
                                            <motion.div
                                                key={card.label}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className={`bg-white rounded-2xl border ${card.border} p-5 flex flex-col gap-3 hover:shadow-md transition-all group`}
                                            >
                                                <div className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center`}>
                                                    <card.icon className={`w-4 h-4 ${card.color}`} />
                                                </div>
                                                <div>
                                                    <p className={`text-2xl font-black ${card.color}`}>{card.value}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{card.label}</p>
                                                </div>
                                            </motion.div>
                                        ))
                                    }
                                </div>

                                {/* Charts Row */}
                                <div className="grid lg:grid-cols-3 gap-6">
                                    {/* Monthly Trend - Area Chart */}
                                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="font-bold text-slate-800">Application Pipeline</h3>
                                                <p className="text-xs text-slate-400">Last 6 months trend</p>
                                            </div>
                                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">Live Data</span>
                                        </div>
                                        {analytics?.monthlyTrend && analytics.monthlyTrend.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={220}>
                                                <AreaChart data={analytics.monthlyTrend}>
                                                    <defs>
                                                        <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                        </linearGradient>
                                                        <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                    <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontSize: 12 }} />
                                                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
                                                    <Area type="monotone" dataKey="submitted" name="Submitted" stroke="#3b82f6" strokeWidth={2} fill="url(#colorSubmitted)" />
                                                    <Area type="monotone" dataKey="approved" name="Approved" stroke="#10b981" strokeWidth={2} fill="url(#colorApproved)" />
                                                    <Area type="monotone" dataKey="rejected" name="Rejected" stroke="#ef4444" strokeWidth={2} fill="none" strokeDasharray="4 4" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-[220px] flex items-center justify-center">
                                                <p className="text-slate-400 text-sm">No trend data yet</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Pie */}
                                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                                        <h3 className="font-bold text-slate-800 mb-1">Status Distribution</h3>
                                        <p className="text-xs text-slate-400 mb-6">All-time breakdown</p>
                                        {pieData.length > 0 ? (
                                            <div>
                                                <ResponsiveContainer width="100%" height={180}>
                                                    <PieChart>
                                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                                                            {pieData.map((_, index) => (
                                                                <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                                <div className="grid grid-cols-2 gap-2 mt-2">
                                                    {pieData.map((item, i) => (
                                                        <div key={item.name} className="flex items-center gap-2">
                                                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                                                            <span className="text-[10px] font-bold text-slate-600">{item.name}: {item.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-[180px] flex items-center justify-center">
                                                <p className="text-slate-400 text-sm">No data</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom Row: Categories + State Heatmap + Renewal Alerts */}
                                <div className="grid lg:grid-cols-3 gap-6">
                                    {/* Top Categories */}
                                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                                        <h3 className="font-bold text-slate-800 mb-1">Top Product Categories</h3>
                                        <p className="text-xs text-slate-400 mb-5">From approved applications</p>
                                        {analytics?.topCategories && analytics.topCategories.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={200}>
                                                <BarChart data={analytics.topCategories} layout="vertical">
                                                    <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                                    <YAxis type="category" dataKey="category" width={80} tick={{ fontSize: 10, fontWeight: 700, fill: '#475569' }} />
                                                    <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                                                    <Bar dataKey="count" name="Products" radius={[0, 6, 6, 0]}>
                                                        {analytics.topCategories.map((_, i) => (
                                                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-[200px] flex items-center justify-center">
                                                <p className="text-slate-400 text-sm">No category data yet</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* State Heatmap */}
                                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                                        <h3 className="font-bold text-slate-800 mb-1">State-wise Activity</h3>
                                        <p className="text-xs text-slate-400 mb-4">Top 8 states by applications</p>
                                        <div className="space-y-2.5">
                                            {(analytics?.stateWise || []).slice(0, 8).map((s, i) => {
                                                const maxTotal = analytics!.stateWise[0]?.total || 1;
                                                const pct = Math.round((s.total / maxTotal) * 100);
                                                return (
                                                    <div key={s.state}>
                                                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 mb-1">
                                                            <span className="capitalize">{s.state?.replace(/-/g, ' ')}</span>
                                                            <span className="text-slate-400">{s.approved}/{s.total}</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {(!analytics?.stateWise || analytics.stateWise.length === 0) && (
                                                <p className="text-slate-400 text-sm text-center py-8">No state data yet</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Renewal Alerts */}
                                    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="font-bold text-slate-800">Renewal Alerts</h3>
                                                <p className="text-xs text-slate-400">Expiring in next 30 days</p>
                                            </div>
                                            <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center">
                                                <Bell className="w-4 h-4 text-rose-500" />
                                            </div>
                                        </div>
                                        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                                            {(analytics?.renewalAlerts || []).length > 0
                                                ? analytics!.renewalAlerts.map((a, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-2 bg-rose-50/50 rounded-xl border border-rose-100">
                                                        <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center shrink-0">
                                                            <Clock className="w-3.5 h-3.5 text-rose-600" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-bold text-slate-800 truncate">{a.companyName}</p>
                                                            <p className="text-[10px] text-rose-600 font-bold">{a.daysLeft}d left</p>
                                                        </div>
                                                    </div>
                                                ))
                                                : (
                                                    <div className="text-center py-8">
                                                        <CheckCircle className="w-8 h-8 text-emerald-300 mx-auto mb-2" />
                                                        <p className="text-xs text-slate-400 font-medium">No renewals due</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="relative flex-1 max-w-md">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            placeholder="Search by name, email or phone..."
                                            className="pl-11 h-11 bg-white border-slate-200 focus:ring-blue-500 rounded-xl"
                                            value={userSearch}
                                            onChange={e => { setUserSearch(e.target.value); setUserPage(1); }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                        <Users className="w-4 h-4" /> {totalUsers} total users
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                                {['User', 'Role', 'Contact', 'Joined', 'Actions'].map(h => (
                                                    <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 font-medium">
                                            {users.length > 0 ? users.map(user => (
                                                <tr key={user._id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm">
                                                                {user.name?.charAt(0)?.toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-800">{user.name}</p>
                                                                <p className="text-xs text-slate-400">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={cn('text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg',
                                                            user.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                                                                user.role === 'officer' ? 'bg-blue-100 text-blue-600' :
                                                                    user.role === 'startup' ? 'bg-emerald-100 text-emerald-600' :
                                                                        'bg-slate-200 text-slate-600'
                                                        )}>{user.role}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{user.phone || '—'}</td>
                                                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Button variant="ghost" size="icon" className="rounded-lg text-slate-400 hover:text-slate-600">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={5} className="py-20 text-center text-slate-400">
                                                        <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                                        <p className="font-semibold">No users found</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Pagination */}
                                {totalUsers > 15 && (
                                    <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                                        <p className="text-xs text-slate-400 font-medium">Page {userPage} of {Math.ceil(totalUsers / 15)}</p>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" disabled={userPage === 1} onClick={() => setUserPage(p => p - 1)} className="rounded-lg text-xs">Prev</Button>
                                            <Button variant="outline" size="sm" disabled={userPage >= Math.ceil(totalUsers / 15)} onClick={() => setUserPage(p => p + 1)} className="rounded-lg text-xs">Next</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'applications' && (
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                    <h3 className="font-bold text-xl text-slate-800">Global Application Monitor</h3>
                                    <span className="text-xs font-bold text-slate-400">{applications.length} total</span>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {applications.map(app => {
                                        const result = verifyResult[app._id];
                                        return (
                                            <div key={app._id} className="p-5 hover:bg-slate-50 transition-colors group">
                                                <div className="flex items-center justify-between flex-wrap gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden">
                                                            {app.documents?.find((d: any) => d.title === 'Company photo') ? (
                                                                <img src={app.documents.find((d: any) => d.title === 'Company photo').url} className="w-full h-full object-cover" alt="" />
                                                            ) : (
                                                                <Building2 className="w-6 h-6 text-slate-300" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-800">{app.companyName}</h4>
                                                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                                                                <span>{new Date(app.submittedAt).toLocaleDateString()}</span>
                                                                <span className={cn('font-black uppercase', app.status === 'Approved' ? 'text-emerald-600' : app.status === 'Rejected' ? 'text-rose-600' : 'text-amber-600')}>
                                                                    {app.status}
                                                                </span>
                                                            </div>
                                                            {result && (
                                                                <div className="mt-2 flex items-center gap-2">
                                                                    <span className={cn('text-[10px] font-black px-2 py-0.5 rounded-full', result.score >= 80 ? 'bg-emerald-100 text-emerald-700' : result.score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700')}>
                                                                        Score: {result.score}/100
                                                                    </span>
                                                                    <span className="text-[10px] text-slate-500 font-medium">{result.recommendation}</span>
                                                                    {result.issueCount?.high > 0 && (
                                                                        <span className="text-[10px] font-bold text-rose-600">{result.issueCount.high} critical issues</span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="rounded-xl text-xs font-bold gap-1 border-slate-200"
                                                            onClick={() => handleVerify(app._id)}
                                                            disabled={verifyingId === app._id}
                                                        >
                                                            <Zap className={cn('w-3 h-3', verifyingId === app._id ? 'animate-spin text-amber-500' : 'text-amber-500')} />
                                                            {verifyingId === app._id ? 'Scoring...' : 'AI Score'}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="gap-1 text-blue-600 font-bold hover:bg-blue-50 rounded-xl text-xs"
                                                            onClick={() => navigate(`/application/${app._id}`)}
                                                        >
                                                            View <ArrowUpRight className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                                            <ShieldAlert className="w-5 h-5 text-rose-500" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800">Threat Monitoring</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Brute Force Protection', status: 'Active', ok: true },
                                            { label: 'API Rate Limiting (Auth)', status: 'Active – 100 req/15min', ok: true },
                                            { label: 'Input Validation (GSTIN, PAN)', status: 'Active', ok: true },
                                            { label: 'Async File I/O Guard', status: 'Active', ok: true },
                                            { label: 'JWT Auth Middleware', status: 'Centralized', ok: true },
                                            { label: 'SSE Real-time Push', status: 'Online', ok: true },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                                                <span className="font-semibold text-slate-700 text-sm">{item.label}</span>
                                                <span className={cn('text-[10px] font-black uppercase tracking-widest flex items-center gap-1', item.ok ? 'text-emerald-600' : 'text-rose-500')}>
                                                    <div className={cn('w-1.5 h-1.5 rounded-full', item.ok ? 'bg-emerald-500' : 'bg-rose-500')} />
                                                    {item.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                                            <Lock className="w-5 h-5 text-slate-500" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800">Admin Privileges</h3>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-6">Current session has master access. All routes protected by centralized JWT middleware.</p>
                                    <Button className="w-full h-12 rounded-xl bg-blue-600 font-bold shadow-lg shadow-blue-200">Re-authenticate Master Key</Button>
                                    <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 font-bold text-rose-600 hover:bg-rose-50 mt-3">Revoke Temporary Access</Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
