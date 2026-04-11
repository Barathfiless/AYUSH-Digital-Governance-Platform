import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    ShoppingBag,
    Trash2,
    Plus,
    Minus,
    Zap,
    ChevronLeft,
    Truck,
    CreditCard,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function Cart() {
    usePageTitle('My Cart');
    const navigate = useNavigate();

    // Cart State
    const [cart, setCart] = useState<any[]>(() => {
        const savedCart = localStorage.getItem('ayush_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Checkout State
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState(1);
    const [shippingDetails, setShippingDetails] = useState({
        fullName: '',
        address: '',
        city: '',
        pincode: '',
        phone: ''
    });

    useEffect(() => {
        localStorage.setItem('ayush_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: any) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.id !== productId));
        toast.info("Item removed from cart");
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.priceValue * item.quantity), 0);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        navigate('/checkout');
    };

    const submitOrder = async () => {
        setCheckoutStep(3);

        const newOrder = {
            id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            date: new Date().toLocaleDateString(),
            items: cart.length,
            total: `₹${cartTotal}`,
            status: 'Processing',
            image: cart[0]?.image,
            store: cart[0]?.store
        };

        // Simulate order submission
        setTimeout(() => {
            const existingOrders = JSON.parse(localStorage.getItem('ayush_orders') || '[]');
            localStorage.setItem('ayush_orders', JSON.stringify([newOrder, ...existingOrders]));

            toast.success("Order placed successfully!");
            setCart([]);
            setIsCheckoutOpen(false);
            navigate('/orders');
        }, 3000);
    };

    return (
        <DashboardLayout>
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/store')}
                        className="rounded-xl hover:bg-slate-100 gap-2 font-bold text-slate-600 px-0"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-3xl font-black text-[#002b5b] uppercase tracking-tight">
                                My <span className="text-blue-600">Shopping Cart</span>
                            </h1>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-1.5 rounded-full">
                                {cart.length} Items
                            </span>
                        </div>

                        {cart.length > 0 ? (
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        className="bg-white rounded-[32px] border border-slate-100 p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-all group"
                                    >
                                        <div className="w-32 h-32 rounded-3xl overflow-hidden border border-slate-50 bg-slate-50 shrink-0 shadow-inner">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>

                                        <div className="flex-1 flex flex-col md:flex-row justify-between w-full">
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{item.name}</h3>
                                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{item.store}</p>
                                                <div className="flex items-center gap-4 pt-4">
                                                    <div className="flex items-center bg-slate-50 rounded-xl border border-slate-100 p-1 shadow-inner">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="w-8 h-8 flex items-center justify-center hover:text-blue-600 transition-colors"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-12 text-center text-sm font-black">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="w-8 h-8 flex items-center justify-center hover:text-blue-600 transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="p-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="text-right mt-4 md:mt-0 flex flex-col justify-between">
                                                <div className="text-2xl font-black text-[#002b5b]">₹{item.priceValue * item.quantity}</div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">₹{item.priceValue} / unit</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[40px] border border-slate-100 p-20 text-center shadow-sm">
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                                    <ShoppingBag className="w-10 h-10 text-slate-200" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-4">Your cart is empty</h3>
                                <p className="text-slate-400 font-medium mb-10 max-w-xs mx-auto">Looks like you haven't added anything to your cart yet. Explore the AYUSH Bazaar to find verified health products.</p>
                                <Button
                                    onClick={() => navigate('/store')}
                                    className="h-14 px-12 rounded-2xl bg-[#002b5b] hover:bg-blue-900 text-white font-black uppercase tracking-widest shadow-xl shadow-blue-100"
                                >
                                    Browse Products
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    {cart.length > 0 && (
                        <div className="w-full lg:w-[400px]">
                            <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm lg:sticky lg:top-8">
                                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-8">Order Summary</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        <span>Subtotal</span>
                                        <span>₹{cartTotal}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        <span>Shipping</span>
                                        <span className="text-emerald-500 font-black">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        <span>Tax (Simulated)</span>
                                        <span>₹0</span>
                                    </div>
                                    <div className="pt-6 border-t border-slate-50 flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Total</p>
                                            <div className="text-3xl font-black text-[#002b5b]">₹{cartTotal}</div>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleCheckout}
                                    className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest shadow-xl shadow-blue-100 gap-3 group"
                                >
                                    <Zap className="w-5 h-5 fill-white" />
                                    Proceed to Checkout
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>

                                <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500 leading-relaxed">
                                        Your order is protected by <span className="text-blue-600 font-black">AYUSH Security</span>. 100% verified stores only.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Checkout Flow Dialog (Reused from Store.tsx) */}
                <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                    <DialogContent className="max-w-xl p-0 overflow-hidden rounded-[40px] border-none shadow-2xl">
                        <div className="p-8 bg-slate-50/50 border-b border-slate-100">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
                                        {checkoutStep === 1 ? <Truck className="w-5 h-5 text-white" /> :
                                            checkoutStep === 2 ? <CreditCard className="w-5 h-5 text-white" /> :
                                                <CheckCircle2 className="w-5 h-5 text-white" />}
                                    </div>
                                    <DialogTitle className="text-xl font-black text-slate-800 uppercase tracking-tight">
                                        {checkoutStep === 1 ? 'Shipping Details' :
                                            checkoutStep === 2 ? 'Payment Method' :
                                                'Processing Order'}
                                    </DialogTitle>
                                </div>
                                <div className="flex gap-1.5">
                                    {[1, 2, 3].map(s => (
                                        <div key={s} className={cn(
                                            "w-8 h-1 rounded-full transition-all duration-500",
                                            checkoutStep >= s ? "bg-blue-600" : "bg-slate-200"
                                        )} />
                                    ))}
                                </div>
                            </div>

                            {checkoutStep === 1 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5 flex flex-col">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Full Name</label>
                                            <Input
                                                className="rounded-xl bg-white border-slate-200"
                                                placeholder="John Doe"
                                                value={shippingDetails.fullName}
                                                onChange={(e) => setShippingDetails(prev => ({ ...prev, fullName: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-1.5 flex flex-col">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Phone Number</label>
                                            <Input
                                                className="rounded-xl bg-white border-slate-200"
                                                placeholder="+91 XXXXXXXXXX"
                                                value={shippingDetails.phone}
                                                onChange={(e) => setShippingDetails(prev => ({ ...prev, phone: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 flex flex-col">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Delivery Address</label>
                                        <Input
                                            className="rounded-xl bg-white border-slate-200 h-12"
                                            placeholder="Street, House No, Landmark"
                                            value={shippingDetails.address}
                                            onChange={(e) => setShippingDetails(prev => ({ ...prev, address: e.target.value }))}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5 flex flex-col">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">City</label>
                                            <Input
                                                className="rounded-xl bg-white border-slate-200"
                                                placeholder="Mumbai"
                                                value={shippingDetails.city}
                                                onChange={(e) => setShippingDetails(prev => ({ ...prev, city: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-1.5 flex flex-col">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Pincode</label>
                                            <Input
                                                className="rounded-xl bg-white border-slate-200"
                                                placeholder="400001"
                                                value={shippingDetails.pincode}
                                                onChange={(e) => setShippingDetails(prev => ({ ...prev, pincode: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {checkoutStep === 2 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                    <div className="p-6 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-200 relative overflow-hidden">
                                        <div className="relative z-10">
                                            <div className="flex justify-between mb-8">
                                                <CreditCard className="w-8 h-8 opacity-80" />
                                                <span className="text-xs font-black uppercase tracking-widest text-blue-100">Paypal Digital</span>
                                            </div>
                                            <div className="text-xl font-bold tracking-widest mb-6">XXXX XXXX XXXX 4242</div>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-blue-200 mb-1">Card Holder</p>
                                                    <p className="text-xs font-bold uppercase">{shippingDetails.fullName || 'CUSTOMER NAME'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-blue-200 mb-1">Expires</p>
                                                    <p className="text-xs font-bold uppercase">12/28</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                                    </div>
                                </motion.div>
                            )}

                            {checkoutStep === 3 && (
                                <div className="py-12 flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 border border-blue-100 relative">
                                        <div className="absolute inset-0 border-2 border-blue-600 rounded-3xl border-t-transparent animate-spin"></div>
                                        <Zap className="w-10 h-10 text-blue-600 fill-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">Verifying Payment</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest px-12">Please do not refresh or close the page while we secure your transaction.</p>
                                </div>
                            )}
                        </div>

                        {checkoutStep < 3 && (
                            <div className="p-8 flex justify-between gap-4 bg-white">
                                <Button
                                    variant="ghost"
                                    onClick={() => checkoutStep === 1 ? setIsCheckoutOpen(false) : setCheckoutStep(1)}
                                    className="h-12 px-8 rounded-xl font-black text-xs uppercase tracking-widest text-slate-400"
                                >
                                    {checkoutStep === 1 ? 'Cancel' : 'Go Back'}
                                </Button>
                                <Button
                                    onClick={() => checkoutStep === 1 ? setCheckoutStep(2) : submitOrder()}
                                    className="h-12 px-12 rounded-2xl bg-[#002b5b] hover:bg-blue-900 font-black text-xs uppercase tracking-widest text-white shadow-xl shadow-blue-100"
                                >
                                    {checkoutStep === 1 ? 'Payment' : `Pay ₹${cartTotal}`}
                                </Button>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
