import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
    Package,
    ChevronRight,
    Search,
    Clock,
    CheckCircle,
    ArrowUpRight,
    ShoppingBag,
    Star,
    Truck,
    Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function MyOrders() {
    usePageTitle('My Orders');
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        const savedOrders = localStorage.getItem('ayush_orders');
        if (savedOrders) {
            setOrders(JSON.parse(savedOrders));
        }
    }, []);
    return (
        <DashboardLayout>
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-[#002b5b] mb-1">
                            My <span className="text-blue-600">Orders</span>
                        </h1>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Orders', value: orders.length.toString(), icon: Package, color: 'bg-blue-50 text-blue-600 border-blue-100' },
                        { label: 'Active Orders', value: orders.filter(o => o.status === 'Processing').length.toString(), icon: Truck, color: 'bg-amber-50 text-amber-600 border-amber-100' },
                        { label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length.toString(), icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                        { label: 'Total Spent', value: `₹${orders.reduce((acc, o) => acc + parseInt(o.total.replace('₹', '')), 0)}`, icon: ShoppingBag, color: 'bg-purple-50 text-purple-600 border-purple-100' },
                    ].map((stat, i) => (
                        <div key={i} className={cn("p-6 rounded-[32px] border shadow-sm flex flex-col items-center text-center group bg-white hover:border-slate-300 transition-all cursor-default", stat.color)}>
                            <div className="w-12 h-12 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black mb-1">{stat.value}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Orders List */}
                <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-slate-800">Order History</span>
                            <span className="text-xs font-bold text-slate-400 bg-slate-200 px-2.5 py-1 rounded-full">{orders.length} Records</span>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="h-10 rounded-xl px-4 text-xs font-bold border-slate-200">
                                Last 3 Months
                            </Button>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {orders.length > 0 ? orders.map((order) => (
                            <div key={order.id} className="p-8 hover:bg-slate-50/80 transition-all group">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
                                        <img src={order.image} alt={order.store} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-bold text-slate-800 text-lg">{order.id}</h4>
                                                <div className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                    order.status === 'Delivered' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                        order.status === 'Processing' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                            "bg-amber-50 text-amber-600 border-amber-100"
                                                )}>
                                                    {order.status}
                                                </div>
                                            </div>
                                            <div className="text-sm font-bold text-[#002b5b]">{order.total}</div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
                                            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
                                                <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />
                                                <span>{order.store}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
                                                <Clock className="w-3.5 h-3.5 text-blue-500" />
                                                <span>Ordered on {order.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
                                                <Package className="w-3.5 h-3.5 text-blue-500" />
                                                <span>{order.items} Items</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 lg:ml-auto">
                                        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl text-slate-400 hover:bg-white hover:shadow-md transition-all">
                                            <Download className="w-5 h-5" />
                                        </Button>
                                        <Button className="h-12 px-6 rounded-2xl bg-[#002b5b] hover:bg-[#1a406d] font-bold gap-2">
                                            Order Details
                                            <ArrowUpRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="p-20 text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                    <ShoppingBag className="w-10 h-10 text-slate-200" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">No Orders Found</h3>
                                <p className="text-slate-500 mt-2">You haven't placed any orders yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Empty State / Bottom Help */}
                <div className="mt-12 p-8 bg-blue-50/30 rounded-[32px] border border-blue-100 border-dashed text-center">
                    <p className="text-sm text-slate-500 font-medium">
                        Looking for something else? <button className="text-blue-600 font-bold hover:underline">Browse the AYUSH Digital Bazaar</button> to find your favorite products.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
