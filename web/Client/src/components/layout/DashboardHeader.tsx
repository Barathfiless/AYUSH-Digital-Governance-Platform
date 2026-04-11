import { useState, useEffect } from 'react';
import { Bell, Search, LogOut, Menu, CheckCircle2, Clock, AlertCircle, XCircle, X, LayoutDashboard, ShoppingBag, ShoppingCart, ClipboardList } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSidebar } from './SidebarContext';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@/hooks/useNotifications';

export function DashboardHeader() {
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}') || {};
    const { setIsMobileOpen } = useSidebar();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const isCustomer = userData?.role === 'customer';

    const customerMenuItems = [
        { icon: LayoutDashboard, label: t('sidebar.home'), path: '/dashboard' },
        { icon: ShoppingBag, label: t('sidebar.store'), path: '/stores' },
        { icon: ShoppingCart, label: t('sidebar.cart'), path: '/cart' },
        { icon: ClipboardList, label: t('sidebar.myOrders'), path: '/orders' },
    ];

    // ── Notifications (works for ALL roles) ───────────────────────────────────
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        dismiss,
    } = useNotifications(userData?._id || "");

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [allData, setAllData] = useState<{ stores: any[], products: any[] }>({ stores: [], products: [] });
    const [hasFetchedSearch, setHasFetchedSearch] = useState(false);

    const handleSearchFocus = async () => {
        setIsSearchFocused(true);
        if (!hasFetchedSearch && userData.role === 'customer') {
            setHasFetchedSearch(true);
            try {
                const response = await fetch('/api/applications/all');
                if (response.ok) {
                    const data = await response.json();
                    const approved = data.filter((app: any) => app.status === 'Approved');
                    const stores = approved.map((app: any) => ({
                        id: app._id,
                        name: app.companyName,
                        type: 'store',
                        image: `https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?w=100&h=100&fit=crop&q=80&sig=${app._id}`
                    }));

                    const products: any[] = [];
                    approved.forEach((app: any) => {
                        const companyLogo = app.documents?.find((d: any) => d.title === "Company photo")?.url;
                        if (app.products) {
                            app.products.forEach((p: any, idx: number) => {
                                products.push({
                                    id: `${app._id}-${idx}`,
                                    name: p.name,
                                    category: p.category || 'AYUSH',
                                    type: p.type || 'N/A',
                                    storeName: app.companyName,
                                    price: p.price || Math.floor(Math.random() * 1000) + 100,
                                    image: p.image || companyLogo || `https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?w=100&h=100&fit=crop&q=80&sig=${idx}`,
                                    logo: companyLogo
                                });
                            });
                        }
                    });

                    setAllData({ stores: [], products });
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    const filteredProducts = searchQuery ? allData.products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5) : [];

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery) {
            e.preventDefault();
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchFocused(false);
            setSearchQuery('');
        }
    };

    return (
        <header className={cn(
            "border-b transition-all sticky top-0 z-40 flex items-center justify-between px-4 md:px-8",
            isCustomer
                ? "bg-[#002b5b] border-blue-900 h-16 shadow-lg shadow-blue-950/20"
                : "bg-white border-slate-200 h-16"
        )}>
            <div className="flex items-center gap-8 flex-1">
                {isCustomer ? (
                    <div className="flex items-center gap-2 mr-4 cursor-pointer group" onClick={() => navigate('/dashboard')}>
                        <div className="w-8 h-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                            <span className="font-black text-white text-base">A</span>
                        </div>
                        <div className="hidden lg:block">
                            <h1 className="font-black text-white text-lg leading-none tracking-tight">e-Ayush</h1>
                            <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mt-0.5">Digital Bazaar</p>
                        </div>
                    </div>
                ) : (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden rounded-xl shrink-0 h-9 w-9"
                        onClick={() => setIsMobileOpen(true)}
                    >
                        <Menu className="w-5 h-5 text-slate-600" />
                    </Button>
                )}

                {isCustomer && (
                    <nav className="hidden lg:flex items-center gap-1">
                        {customerMenuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path || (item.path === '/stores' && location.pathname.startsWith('/store'));
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 tracking-tight",
                                        isActive
                                            ? "bg-white text-[#002b5b] shadow-md shadow-blue-950/40"
                                            : "text-blue-100/70 hover:text-white hover:bg-white/10"
                                    )}
                                >
                                    <Icon className={cn("w-4 h-4", isActive ? "text-[#002b5b]" : "text-blue-200/50")} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                )}

                {isCustomer && (
                    <div className="flex-1 max-w-sm hidden lg:block ml-4 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={handleSearchFocus}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            onKeyDown={handleKeyDown}
                            className="pl-10 bg-slate-50 border-none rounded-xl h-9 focus:ring-2 focus:ring-blue-100 text-[13px] font-medium transition-all"
                        />

                        {isSearchFocused && searchQuery && filteredProducts.length > 0 && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 p-2 fade-in slide-in-from-top-2 animate-in duration-200">


                                {filteredProducts.length > 0 && (
                                    <div>
                                        <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Products</div>
                                        {filteredProducts.map(product => (
                                            <div
                                                key={product.id}
                                                onClick={() => {
                                                    navigate(`/product/${product.id}`, { state: { product } });
                                                    setSearchQuery('');
                                                }}
                                                className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                                            >
                                                <img src={product.image} alt={product.name} className="w-8 h-8 rounded-lg object-cover" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-bold text-slate-800 truncate">{product.name}</div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-[9px] font-bold text-blue-500 uppercase px-1.5 py-0.5 bg-blue-50 rounded">{product.category}</div>
                                                        <div className="text-[10px] text-slate-500 truncate">{product.storeName}</div>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-bold text-blue-600">₹{product.price}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {isSearchFocused && searchQuery && filteredProducts.length === 0 && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-100 p-8 text-center z-50">
                                <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <div className="text-sm font-bold text-slate-800">No results found</div>
                                <div className="text-xs text-slate-500">Try adjusting your search term</div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className={cn(
                            "relative rounded-xl transition-all",
                            isCustomer ? "h-9 w-9 text-blue-100 hover:bg-white/10 hover:text-white" : "h-10 w-10 text-slate-600 hover:bg-slate-100"
                        )}>
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border border-[#002b5b] animate-pulse"></span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-96 p-0 rounded-2xl border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-slate-800">{t('header.notifications')}</h3>
                                <span className="text-[10px] font-bold bg-[#002b5b] text-white px-2 py-0.5 rounded-full">
                                    {unreadCount} New
                                </span>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                    <div
                                        key={notif._id}
                                        className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer relative group ${!notif.read ? 'bg-blue-50/30' : ''}`}
                                        onClick={() => !notif.read && markAsRead(notif._id)}
                                    >
                                        <div className="flex gap-3">
                                            {/* Icon */}
                                            <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${notif.type === 'Alert' ? 'bg-amber-50 text-amber-600' :
                                                notif.title.toLowerCase().includes('approved') ? 'bg-emerald-50 text-emerald-600' :
                                                    notif.title.toLowerCase().includes('rejected') ? 'bg-rose-50 text-rose-600' :
                                                        'bg-blue-50 text-blue-600'
                                                }`}>
                                                {notif.type === 'Alert' ? <AlertCircle className="w-5 h-5" /> :
                                                    notif.title.toLowerCase().includes('approved') ? <CheckCircle2 className="w-5 h-5" /> :
                                                        notif.title.toLowerCase().includes('rejected') ? <XCircle className="w-5 h-5" /> :
                                                            <Clock className="w-5 h-5" />}
                                            </div>
                                            {/* Body */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <p className={`text-sm font-bold truncate ${notif.read ? 'text-slate-700' : 'text-[#002b5b]'}`}>
                                                        {notif.title}
                                                    </p>
                                                    {!notif.read && (
                                                        <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed mb-2 line-clamp-2">
                                                    {notif.message}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {(() => {
                                                        try {
                                                            return formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true });
                                                        } catch (e) {
                                                            return "recently";
                                                        }
                                                    })()}
                                                </p>
                                            </div>
                                            {/* Dismiss button */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); dismiss(notif._id); }}
                                                className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full hover:bg-slate-200 flex items-center justify-center shrink-0 transition-all mt-1"
                                                title="Dismiss"
                                            >
                                                <X className="w-3 h-3 text-slate-500" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-slate-400">
                                    <Bell className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                    <p className="text-sm font-medium">{t('header.noNotifications')}</p>
                                    <p className="text-xs text-slate-300 mt-1">
                                        {userData?.role === 'officer' ? 'Application status updates will appear here' :
                                            userData?.role === 'admin' ? 'System alerts will appear here' :
                                                'Your application updates will appear here'}
                                    </p>
                                </div>
                            )}
                        </div>
                        {notifications.length > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="w-full py-3 text-xs font-bold text-[#002b5b] hover:bg-slate-50 transition-colors border-t border-slate-100 bg-white"
                            >
                                {t('header.markAllRead')}
                            </button>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Language Switcher */}
                <LanguageSwitcher />

                <div className="h-8 w-px bg-slate-200 mx-1"></div>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className={cn(
                            "relative flex items-center gap-3 p-1 rounded-xl transition-all",
                            isCustomer ? "h-10 pl-2 pr-4 hover:bg-white/10" : "h-10 pl-2 pr-3 hover:bg-slate-50"
                        )}>
                            <div className={cn(
                                "rounded-lg flex items-center justify-center font-bold shadow-inner transition-colors",
                                isCustomer ? "w-8 h-8 bg-white/20 text-white group-hover:bg-white/30" : "w-8 h-8 bg-[#002b5b] text-white"
                            )}>
                                {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="text-left hidden md:block">
                                <p className={cn(
                                    "text-[11px] font-bold uppercase tracking-tighter truncate max-w-[100px]",
                                    isCustomer ? "text-white" : "text-slate-800"
                                )}>
                                    {userData?.name || 'User Name'}
                                </p>
                                <p className={cn(
                                    "text-[9px] mt-0 capitalize",
                                    isCustomer ? "text-blue-200" : "text-slate-500"
                                )}>{userData?.role || 'User'}</p>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border-slate-200 shadow-xl animate-in fade-in zoom-in duration-200">
                        <DropdownMenuLabel className="px-3 py-2 text-xs font-bold text-slate-400 uppercase">{t('header.myAccount')}</DropdownMenuLabel>
                        <DropdownMenuSeparator className="my-2 bg-slate-100" />
                        <DropdownMenuItem className="rounded-xl px-3 py-2 cursor-pointer gap-2 text-rose-600 focus:text-rose-600 focus:bg-rose-50 transition-colors" onClick={() => {
                            sessionStorage.removeItem('token');
                            sessionStorage.removeItem('user');
                            window.location.href = '/login';
                        }}>
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-semibold">{t('header.logout')}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
