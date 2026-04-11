import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    FileText,
    PlusCircle,
    Activity,
    ClipboardList,
    ShoppingBag,
    LogOut,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ShieldCheck,
    Database,
    Users,
    ShoppingCart,
    Landmark
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSidebar } from './SidebarContext';

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const location = useLocation();
    const currentPath = location.pathname + location.search;
    const [user, setUser] = useState<{ name: string; role: string } | null>(null);
    const { isMobileOpen, setIsMobileOpen } = useSidebar();
    const { t } = useTranslation();
    const [openSubMenus, setOpenSubMenus] = useState<string[]>([]);

    useEffect(() => {
        const userData = sessionStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
    }, []);

    // Close mobile sidebar on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname, setIsMobileOpen]);

    const toggleSubMenu = (label: string) => {
        setOpenSubMenus(prev =>
            prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
        );
    };

    // ── Menu arrays INSIDE component so t() is reactive ──────────────────────
    const startupMenuItems = [
        { icon: LayoutDashboard, label: t('sidebar.dashboard'), path: '/dashboard' },
        { icon: PlusCircle, label: t('sidebar.newLicense'), path: '/apply' },
        { icon: ClipboardList, label: t('sidebar.trackApp'), path: '/track' },
        { icon: Activity, label: t('sidebar.warehouse'), path: '/inventory' },
        { icon: FileText, label: t('sidebar.certifications'), path: '/documents' },
        { icon: Landmark, label: t('sidebar.loans'), path: '/loans' },
    ];

    const officerMenuItems = [
        {
            icon: LayoutDashboard,
            label: t('sidebar.dashboard'),
            path: '/officer',
            subItems: [
                { label: t('sidebar.officerPanel'), path: '/officer' },
                { label: t('sidebar.reviewApplications'), path: '/officer/reviews' },
                { label: t('sidebar.inspections'), path: '/officer/inspections' },
                { label: t('sidebar.inventoryOversight'), path: '/officer/inventory' },
            ]
        },
        {
            icon: ShieldCheck,
            label: t('sidebar.approval'),
            path: '/officer/approval',
            subItems: [
                { label: t('sidebar.approved'), path: '/officer/approved' },
                { label: t('sidebar.rejected'), path: '/officer/rejected' },
            ]
        },
        {
            icon: FileText,
            label: t('sidebar.certifications'),
            path: '/officer/docs',
            subItems: [
                { label: t('sidebar.digitalCerts'), path: '/officer/approval-docs' },
                { label: t('sidebar.queries'), path: '/officer/queries' },
            ]
        },
        {
            icon: Landmark,
            label: t('sidebar.loans'),
            path: '/officer/loans',
            subItems: [
                { label: t('sidebar.manageSchemes'), path: '/officer/loans' },
                { label: t('sidebar.loanRequests'), path: '/officer/loans/requests' },
                { label: t('sidebar.approved'), path: '/officer/loans/requests?status=Approved' },
                { label: t('sidebar.rejected'), path: '/officer/loans/requests?status=Rejected' },
            ]
        },
    ];

    const customerMenuItems = [
        { icon: LayoutDashboard, label: t('sidebar.home'), path: '/dashboard' },
        { icon: ShoppingBag, label: t('sidebar.store'), path: '/stores' },
        { icon: ShoppingCart, label: t('sidebar.cart'), path: '/cart' },
        { icon: ClipboardList, label: t('sidebar.myOrders'), path: '/orders' },
    ];

    const adminMenuItems = [
        { icon: LayoutDashboard, label: t('sidebar.adminPortal'), path: '/admin?tab=overview' },
        { icon: Users, label: t('sidebar.manageUsers'), path: '/admin?tab=users' },
        { icon: FileText, label: t('sidebar.allApplications'), path: '/admin?tab=applications' },
        { icon: ShieldCheck, label: t('sidebar.systemSecurity'), path: '/admin?tab=security' },
        { icon: Database, label: t('sidebar.systemLogs'), path: '/admin?tab=logs' },
    ];

    const menuItems = (() => {
        if (user?.role === 'officer') return officerMenuItems;
        if (user?.role === 'customer') return customerMenuItems;
        if (user?.role === 'admin') return adminMenuItems;
        return startupMenuItems;
    })();

    return (
        <div className={cn(
            "h-screen bg-[#002b5b] text-white flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 shadow-2xl",
            collapsed ? "w-20" : "w-64",
            isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            "w-64",
            collapsed ? "lg:w-20" : "lg:w-64"
        )}>
            {/* Brand */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between overflow-hidden">
                <div className={cn("flex items-center gap-3 transition-all duration-300", collapsed && "lg:opacity-0 lg:invisible")}>
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                        <span className="font-bold text-lg">A</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-none whitespace-nowrap">e-Ayush</h1>
                        <p className="text-[10px] text-blue-200 mt-1 whitespace-nowrap">Ministry of Ayush</p>
                    </div>
                </div>
                <button
                    onClick={onToggle}
                    className={cn(
                        "p-2 hover:bg-white/10 rounded-lg transition-all text-blue-200 hover:text-white hidden lg:block",
                        collapsed ? "absolute left-1/2 -translate-x-1/2" : ""
                    )}
                >
                    {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
                <button onClick={() => setIsMobileOpen(false)} className="p-2 hover:bg-white/10 rounded-lg lg:hidden">
                    <ChevronLeft className="w-6 h-6" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                {menuItems.map((item: any) => {
                    const hasSubItems = item.subItems && item.subItems.length > 0;
                    const isOpen = openSubMenus.includes(item.label);
                    const isActive = currentPath === item.path ||
                        (hasSubItems && item.subItems.some((sub: any) => currentPath === sub.path)) ||
                        (item.path === '/stores' && currentPath.startsWith('/store')) ||
                        (location.pathname === item.path.split('?')[0] && !location.search && item.path.includes('tab=overview'));

                    if (hasSubItems) {
                        return (
                            <div key={item.path} className="space-y-1">
                                <button
                                    onClick={() => toggleSubMenu(item.label)}
                                    className={cn(
                                        "w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                                        isActive ? "text-white" : "text-blue-200 hover:text-white hover:bg-white/5",
                                        collapsed ? "lg:justify-center" : ""
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {(() => {
                                            const Icon = item.icon;
                                            return <Icon className={cn(
                                                "w-5 h-5 transition-colors shrink-0",
                                                isActive ? "text-blue-300" : "text-blue-300/50 group-hover:text-blue-300"
                                            )} />;
                                        })()}
                                        <span className={cn("text-sm font-medium whitespace-nowrap", collapsed && "lg:hidden")}>
                                            {item.label}
                                        </span>
                                    </div>
                                    {!collapsed && (
                                        <ChevronDown className={cn(
                                            "w-4 h-4 text-blue-300/50 transition-transform duration-200",
                                            isOpen ? "rotate-180" : ""
                                        )} />
                                    )}
                                </button>
                                {isOpen && !collapsed && (
                                    <div className="pl-11 space-y-1">
                                        {item.subItems.map((sub: any) => (
                                            <Link
                                                key={sub.path}
                                                to={sub.path}
                                                className={cn(
                                                    "block py-2 text-sm font-medium transition-all duration-200",
                                                    currentPath === sub.path ? "text-white" : "text-blue-300/60 hover:text-white"
                                                )}
                                            >
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            title={collapsed ? item.label : ""}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                                isActive
                                    ? "bg-white/10 text-white shadow-lg shadow-black/20 border border-white/10"
                                    : "text-blue-200 hover:text-white hover:bg-white/5",
                                collapsed ? "lg:justify-center" : ""
                            )}
                        >
                            {(() => {
                                const Icon = item.icon;
                                return <Icon className={cn(
                                    "w-5 h-5 transition-colors shrink-0",
                                    isActive ? "text-blue-300" : "text-blue-300/50 group-hover:text-blue-300"
                                )} />;
                            })()}
                            <span className={cn("text-sm font-medium whitespace-nowrap", collapsed && "lg:hidden")}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-3 border-t border-white/10">
                <Button
                    variant="ghost"
                    title={collapsed ? t('sidebar.logout') : ""}
                    className={cn(
                        "w-full justify-start gap-3 text-blue-200 hover:text-white hover:bg-white/5 rounded-xl px-3",
                        collapsed ? "lg:justify-center" : ""
                    )}
                    onClick={() => {
                        sessionStorage.removeItem('token');
                        sessionStorage.removeItem('user');
                        window.location.href = '/login';
                    }}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    <span className={cn("text-sm font-medium whitespace-nowrap", collapsed && "lg:hidden")}>
                        {t('sidebar.logout')}
                    </span>
                </Button>
            </div>
        </div>
    );
}
