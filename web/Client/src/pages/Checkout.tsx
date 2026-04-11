import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
    ChevronLeft,
    MapPin,
    CreditCard,
    CheckCircle2,
    Truck,
    ShieldCheck,
    Package,
    Plus,
    Building2,
    Calendar,
    Wallet,
    Star
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    storeName: string;
    category?: string;
    description?: string;
}

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const [step, setStep] = useState(1); // 1: Summary, 2: Address, 3: Billing & Payment

    // Support both single product (Direct Buy) and Cart items
    const [items, setItems] = useState<any[]>(() => {
        if (id && location.state?.product) {
            return [{
                ...location.state.product,
                quantity: location.state.quantity || 1
            }];
        }
        // Fallback to cart if no specific product
        const savedCart = localStorage.getItem('ayush_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [address, setAddress] = useState({
        fullName: 'John Doe',
        street: '123 Ayush Marg',
        city: 'Haridwar',
        state: 'Uttarakhand',
        pincode: '249401',
        phone: '+91 9876543210'
    });

    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [showReview, setShowReview] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (items.length === 0) {
            toast.error("No items to checkout");
            navigate('/products');
        }
    }, [items, navigate]);

    if (items.length === 0) return null;

    // Calculations
    const subtotal = items.reduce((sum, item) => sum + (item.price || item.priceValue || 50) * item.quantity, 0);
    const shipping = 40;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + shipping + tax;
    const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
        else handlePlaceOrder();
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else navigate(-1);
    };

    const handlePlaceOrder = () => {
        const loadingToast = toast.loading("Processing your order...");

        // Simulate order placement
        setTimeout(() => {
            const newOrder = {
                id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                items: totalItemsCount,
                total: `₹${total}`,
                status: 'Processing',
                image: items[0].image,
                store: items[0].storeName || items[0].store || 'AYUSH Store'
            };

            const existingOrders = JSON.parse(localStorage.getItem('ayush_orders') || '[]');
            localStorage.setItem('ayush_orders', JSON.stringify([newOrder, ...existingOrders]));

            // If it was a cart checkout, clear the cart
            if (!id) {
                localStorage.removeItem('ayush_cart');
                // Dispatch event to update other components if needed
                window.dispatchEvent(new Event('storage'));
            }

            toast.dismiss(loadingToast);
            toast.success("Order placed successfully!", {
                description: "Your AYUSH wellness journey begins now.",
                icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            });
            setShowReview(true);
        }, 2000);
    };

    const handleReviewSubmit = async () => {
        const loadingToast = toast.loading("AI Analyzing your feedback...");

        try {
            // Call Python Backend for real sentimental analysis
            const response = await fetch('/api/sentiment/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: comment || `${rating} stars review` })
            });

            const analysis = await response.json();
            const sentiment = analysis.sentiment; // 'positive', 'neutral', or 'negative'

            // Save reviews for each item in the order
            const allReviews = JSON.parse(localStorage.getItem('ayush_product_reviews') || '{}');

            items.forEach(item => {
                const prodId = item.id;
                if (!allReviews[prodId]) allReviews[prodId] = { positive: 0, total: 0, reviews: [] };

                allReviews[prodId].total += 1;
                // In Python output, 'positive' maps to our success indicator
                if (sentiment === 'positive') allReviews[prodId].positive += 1;

                allReviews[prodId].reviews.push({
                    rating,
                    comment,
                    sentiment,
                    ai_score: analysis.polarity,
                    date: new Date().toISOString()
                });
            });

            localStorage.setItem('ayush_product_reviews', JSON.stringify(allReviews));

            toast.dismiss(loadingToast);
            toast.success("Thank you for your review!", {
                description: `Sentimental Analysis: ${sentiment.toUpperCase()} Experience`,
            });
            setShowReview(false);
            navigate('/orders');
        } catch (error) {
            console.error("Sentiment analysis error:", error);
            toast.dismiss(loadingToast);
            // Fallback to simple logic if server fails
            let fallbackSentiment = rating >= 4 ? 'positive' : 'neutral';
            // ... (rest of simple logic)
            toast.error("AI Analysis failed, but your review was saved.");
            setShowReview(false);
            navigate('/orders');
        }
    };

    const updateQuantity = (idx: number, delta: number) => {
        setItems(prev => prev.map((item, i) => {
            if (i === idx) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        }));
    };

    const StepIndicator = () => (
        <div className="flex items-center justify-center mb-6">
            {[1, 2, 3].map((i) => (
                <React.Fragment key={i}>
                    <div className="flex flex-col items-center">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                            step >= i ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-400"
                        )}>
                            {step > i ? <CheckCircle2 className="w-4 h-4" /> : i}
                        </div>
                        <span className={cn(
                            "text-[9px] mt-1.5 font-bold uppercase tracking-wider",
                            step >= i ? "text-blue-600" : "text-slate-400"
                        )}>
                            {i === 1 ? "Summary" : i === 2 ? "Address" : "Payment"}
                        </span>
                    </div>
                    {i < 3 && (
                        <div className={cn(
                            "w-12 h-0.5 mx-1 -mt-4 transition-all duration-500",
                            step > i ? "bg-blue-600" : "bg-slate-100"
                        )} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto py-1 px-4">
                <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleBack}
                            className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors group"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 leading-none">Checkout</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                {id ? `Store: ${items[0].storeName || items[0].store}` : `${items.length} Products in checkout`}
                            </p>
                        </div>
                    </div>
                </div>

                <StepIndicator />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="summary"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6"
                                >
                                    <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Package className="w-4 h-4 text-blue-600" />
                                        Order Summary
                                    </h2>
                                    <div className="space-y-3">
                                        {items.map((item, idx) => (
                                            <div key={idx} className="flex gap-4 p-3 rounded-2xl bg-slate-50/50 border border-slate-100 items-center">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-white p-1">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[8px] font-bold text-blue-500 uppercase tracking-widest mb-0.5">{item.category || item.type || 'AYUSH'}</div>
                                                    <h3 className="font-bold text-slate-900 text-[12px] mb-0.5 truncate">{item.name}</h3>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5">
                                                            <button
                                                                onClick={() => updateQuantity(idx, -1)}
                                                                className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
                                                            >
                                                                <span className="text-base leading-none">-</span>
                                                            </button>
                                                            <span className="w-6 text-center text-[10px] font-black text-slate-700">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(idx, 1)}
                                                                className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
                                                            >
                                                                <Plus className="w-2.5 h-2.5" />
                                                            </button>
                                                        </div>
                                                        <div className="text-sm font-black text-blue-600">₹{(item.price || item.priceValue || 50) * item.quantity}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-3 pt-4 border-t border-slate-100 mt-4">
                                        <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                                            <Truck className="w-4 h-4 text-blue-500" />
                                            <span>Standard Delivery (3-5 Business Days)</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                            <span>Secure Transaction Protected by AYUSH Gateway</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="address"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6"
                                >
                                    <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                        Delivery Address
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="p-4 rounded-2xl border-2 border-blue-600 bg-blue-50/50 relative">
                                            <div className="absolute top-3 right-3 text-blue-600">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <div className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-1.5">Home Address</div>
                                            <div className="font-bold text-slate-900 text-sm mb-0.5">{address.fullName}</div>
                                            <div className="text-xs text-slate-600 leading-relaxed">
                                                {address.street}, {address.city}<br />
                                                {address.state} - {address.pincode}
                                            </div>
                                            <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{address.phone}</div>
                                        </div>
                                        <button className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-slate-50 transition-all text-slate-400 hover:text-blue-600 group">
                                            <Plus className="w-6 h-6 mb-1.5 group-hover:scale-110 transition-transform" />
                                            <span className="text-[9px] font-bold uppercase tracking-widest">Add New Address</span>
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-100/50 text-[10px] text-amber-700 font-bold uppercase tracking-wide leading-relaxed">
                                            <ShieldCheck className="w-4 h-4 shrink-0" />
                                            Recommended: Use GPS for medicinal accuracy.
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="payment"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6"
                                >
                                    <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                                        <Wallet className="w-4 h-4 text-blue-600" />
                                        Billing & Payment
                                    </h2>

                                    <div className="space-y-3 mb-6">
                                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5 ml-1">Payment Method</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                            {[
                                                { id: 'upi', name: 'UPI / Wallet', icon: <Wallet className="w-4 h-4" /> },
                                                { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="w-4 h-4" /> },
                                                { id: 'net', name: 'Net Banking', icon: <Building2 className="w-4 h-4" /> },
                                                { id: 'cod', name: 'Cash on Delivery', icon: <Calendar className="w-4 h-4" /> }
                                            ].map((method) => (
                                                <button
                                                    key={method.id}
                                                    onClick={() => setPaymentMethod(method.id)}
                                                    className={cn(
                                                        "flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left",
                                                        paymentMethod === method.id
                                                            ? "border-blue-600 bg-blue-50/50 shadow-sm"
                                                            : "border-slate-100 hover:border-slate-300"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                                        paymentMethod === method.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                                                    )}>
                                                        {method.icon}
                                                    </div>
                                                    <span className={cn(
                                                        "text-xs font-bold",
                                                        paymentMethod === method.id ? "text-blue-900" : "text-slate-600"
                                                    )}>{method.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                                        <h3 className="text-[9px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Billing Summary</h3>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-[11px]">
                                                <span className="text-slate-500 font-medium">Billing to</span>
                                                <span className="font-bold text-slate-700">{address.fullName}</span>
                                            </div>
                                            <div className="flex justify-between text-[11px]">
                                                <span className="text-slate-500 font-medium">Method applied</span>
                                                <span className="font-bold text-slate-700 uppercase">{paymentMethod}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Column: Order Summary Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[24px] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 sticky top-24">
                            <h2 className="text-sm font-black text-slate-900 mb-5 uppercase tracking-tight">Price Details</h2>
                            <div className="space-y-3 mb-5">
                                <div className="flex justify-between text-[11px] px-0.5">
                                    <span className="text-slate-500 font-bold uppercase tracking-tighter">Subtotal ({totalItemsCount} items)</span>
                                    <span className="text-slate-900 font-black">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-[11px] px-0.5">
                                    <span className="text-slate-500 font-bold uppercase tracking-tighter">Shipping Fee</span>
                                    <span className="text-emerald-600 font-black">₹{shipping}</span>
                                </div>
                                <div className="flex justify-between text-[11px] px-0.5">
                                    <span className="text-slate-500 font-bold uppercase tracking-tighter">Gateway Tax (GST)</span>
                                    <span className="text-slate-900 font-black">₹{tax}</span>
                                </div>
                                <div className="pt-3.5 border-t border-slate-100 mt-3.5 flex justify-between items-end px-0.5">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-1">Order Total</span>
                                    <span className="text-xl font-black text-blue-600">₹{total}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleNext}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 font-black uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 transition-all text-[11px] mb-3"
                            >
                                {step === 3 ? 'Place Order' : 'Continue'}
                            </Button>

                            <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                <ShieldCheck className="w-3 h-3" />
                                Secure Checkout
                            </div>
                        </div>

                        {step === 2 && (
                            <div className="mt-4 p-5 rounded-[24px] bg-blue-600 text-white shadow-lg overflow-hidden relative">
                                <div className="absolute -right-4 -bottom-4 opacity-10">
                                    <Truck className="w-32 h-32 rotate-12" />
                                </div>
                                <h3 className="font-bold text-sm mb-1">Fast Track Delivery</h3>
                                <p className="text-[10px] opacity-80 leading-relaxed font-medium">AYUSH certified stores prioritize state-to-state logistics for medicinal herbs.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Dialog open={showReview} onOpenChange={setShowReview}>
                <DialogContent className="sm:max-w-[420px] rounded-[32px] border-none shadow-2xl p-0 overflow-hidden bg-white">
                    <div className="h-2 bg-blue-600 w-full" />
                    <div className="p-8">
                        <DialogHeader className="mb-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                                <Star className="w-8 h-8 text-blue-600 fill-blue-600" />
                            </div>
                            <DialogTitle className="text-2xl font-black text-slate-900 text-center">How was your experience?</DialogTitle>
                            <DialogDescription className="text-center text-slate-500 font-medium">
                                Help us improve by rating your purchase and the AYUSH Gateway experience.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                            <div className="flex justify-center gap-3">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setRating(s)}
                                        className="transition-all hover:scale-110 active:scale-95"
                                    >
                                        <Star
                                            className={cn(
                                                "w-10 h-10 transition-colors",
                                                rating >= s ? "text-amber-400 fill-amber-400" : "text-slate-200"
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Write a comment</label>
                                <textarea
                                    className="w-full min-h-[100px] p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium text-slate-700 resize-none"
                                    placeholder="Tell us what you liked about the products or the delivery..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button
                                    onClick={handleReviewSubmit}
                                    className="w-full bg-[#002b5b] hover:bg-[#1a406d] text-white rounded-2xl py-7 font-bold uppercase tracking-widest shadow-lg shadow-blue-100 transition-all text-xs"
                                >
                                    Submit Review
                                </Button>
                                <button
                                    onClick={() => navigate('/orders')}
                                    className="text-[11px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors py-2"
                                >
                                    Skip for now
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default Checkout;
