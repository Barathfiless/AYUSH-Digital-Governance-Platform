import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Star, ShieldCheck, MapPin, Share, ArrowLeft, LocateFixed, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

export default function ProductDetail() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [product, setProduct] = useState<any>(location.state?.product || null);
    const [isLoading, setIsLoading] = useState(!product);
    const [quantity, setQuantity] = useState(1);
    const [deliveryLocation, setDeliveryLocation] = useState('New Delhi, 110001');
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [addressForm, setAddressForm] = useState({
        street: '',
        city: '',
        state: '',
        pincode: ''
    });

    const handleGetLocation = () => {
        setIsLocating(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        const data = await response.json();

                        if (data.address) {
                            const addr = data.address;
                            const city = addr.city || addr.town || addr.village || addr.suburb || '';
                            const state = addr.state || '';
                            const pincode = addr.postcode || '';
                            const street = addr.road || addr.suburb || '';

                            setAddressForm({
                                street,
                                city,
                                state,
                                pincode
                            });
                            toast.success("Location detected successfully!");
                        }
                    } catch (error) {
                        toast.error("Could not fetch address details.");
                    } finally {
                        setIsLocating(false);
                    }
                },
                (error) => {
                    toast.error("Location access denied.");
                    setIsLocating(false);
                }
            );
        } else {
            toast.error("Geolocation is not supported by your browser.");
            setIsLocating(false);
        }
    };

    const handleUpdateLocation = () => {
        if (!addressForm.city || !addressForm.pincode) {
            toast.error("Please enter at least City and Pincode");
            return;
        }
        const displayLoc = `${addressForm.city}${addressForm.pincode ? `, ${addressForm.pincode}` : ''}`;
        setDeliveryLocation(displayLoc);
        setIsLocationModalOpen(false);
        toast.success("Delivery location updated!");
    };

    // Cart State
    const [cart, setCart] = useState<any[]>(() => {
        const savedCart = localStorage.getItem('ayush_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('ayush_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        if (!product && id) {
            const fetchProduct = async () => {
                try {
                    const response = await fetch('/api/applications/all');
                    if (response.ok) {
                        const data = await response.json();
                        const [appId, prodIdx] = id.split('-');
                        const app = data.find((a: any) => a._id === appId);
                        const pIdx = parseInt(prodIdx);
                        if (app && app.products && app.products[pIdx]) {
                            const p = app.products[pIdx];
                            const idHash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                            const deterministicBase = (4 + (idHash % 10) / 10).toFixed(1);

                            setProduct({
                                id,
                                name: p.name,
                                storeName: app.companyName,
                                type: 'product',
                                price: p.price || 50,
                                rating: parseFloat(deterministicBase), // Use deterministic fallback
                                image: p.image || `https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?w=800&h=800&fit=crop&q=80&sig=${prodIdx}`,
                                description: p.description || 'Premium AYUSH certified product.'
                            });
                        }
                    }
                } catch (e) {
                    console.error("Error fetching product:", e);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id, product]);

    const handleAddToCart = () => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                toast.success(`Increased ${product.name} quantity in cart!`);
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
            }
            toast.success(`Added ${product.name} to cart!`);
            return [...prev, {
                id: product.id,
                name: product.name,
                priceValue: product.price,
                image: product.image,
                store: product.storeName,
                quantity
            }];
        });
    };

    const handleBuyNow = () => {
        navigate(`/checkout/${product.id}`, {
            state: {
                product,
                quantity
            }
        });
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center py-40">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!product) {
        return (
            <DashboardLayout>
                <div className="text-center py-40">
                    <h2 className="text-2xl font-bold">Product not found.</h2>
                    <Button onClick={() => navigate('/stores')} className="mt-4">Back to Stores</Button>
                </div>
            </DashboardLayout>
        );
    }

    const mrp = Math.floor(product.price * 1.3); // 30% fake discount
    const discount = Math.round(((mrp - product.price) / mrp) * 100);

    return (
        <DashboardLayout>
            <div className="max-w-[1500px] mx-auto px-4 py-8 bg-white min-h-[85vh]">
                {/* Back Button */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="rounded-xl hover:bg-slate-100 gap-2 font-bold text-slate-600 px-0"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
                    {/* Image Column */}
                    <div className="md:col-span-5 lg:col-span-4 relative group">
                        <div className="sticky top-28 bg-white flex items-center justify-center p-0 md:p-4">
                            <img src={product.image} alt={product.name} className="w-full h-auto object-contain max-h-[500px]" />
                            <button className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Share className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* details Column */}
                    <div className="md:col-span-4 lg:col-span-5 border-t md:border-t-0 md:border-x border-slate-200/60 pt-6 md:pt-0 md:px-8">
                        <h1 className="text-2xl sm:text-[22px] text-slate-900 font-medium leading-snug mb-1">
                            {product.name}
                        </h1>
                        <a href={`/stores?search=${encodeURIComponent(product.storeName)}`} className="text-sm text-[#007185] hover:text-[#c45500] hover:underline mb-2 inline-block">
                            Visit the {product.storeName} Store
                        </a>

                        <div className="flex items-center gap-3 mb-2">
                            {(() => {
                                const allReviews = JSON.parse(localStorage.getItem('ayush_product_reviews') || '{}');
                                const prodStats = allReviews[product.id];
                                let displayRating = product.rating;
                                let totalReviews = 45; // Simulated base for details

                                if (prodStats && prodStats.total > 0) {
                                    const sumRating = prodStats.reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
                                    displayRating = Number((sumRating / prodStats.total).toFixed(1));
                                    totalReviews = prodStats.total;
                                }

                                return (
                                    <>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <Star key={i} className={cn("w-4 h-4", i <= Math.floor(displayRating) ? "text-amber-400 fill-amber-400" : "text-slate-200")} />
                                            ))}
                                            <span className="text-sm font-bold text-[#007185] ml-1">{displayRating}</span>
                                            <span className="text-xs text-slate-400 ml-1">({totalReviews} ratings)</span>
                                        </div>

                                        {(() => {
                                            const sentimentRate = prodStats && prodStats.total > 0
                                                ? Math.round((prodStats.positive / prodStats.total) * 100)
                                                : Math.round((parseFloat(product.rating) / 5) * 100);
                                            const isReal = prodStats && prodStats.total > 0;

                                            return (
                                                <div className={cn(
                                                    "flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-md transition-all hover:scale-105",
                                                    isReal ? "bg-purple-50 border-purple-200" : "bg-indigo-50 border-indigo-200"
                                                )}>
                                                    <ShieldCheck className={cn("w-4 h-4", isReal ? "text-purple-600" : "text-indigo-600")} />
                                                    <span className={cn(
                                                        "text-xs font-black uppercase tracking-wide",
                                                        isReal ? "text-purple-700" : "text-indigo-700"
                                                    )}>
                                                        {sentimentRate}% {isReal ? "Confirmed Customer Sentiment" : "AI Market Prediction"}
                                                    </span>
                                                </div>
                                            );
                                        })()}
                                    </>
                                );
                            })()}
                        </div>

                        <hr className="my-4 border-slate-200" />

                        <div className="mb-4 text-[#565959]">
                            <div className="flex items-baseline gap-2 mb-0.5">
                                <span className="text-[32px] font-medium text-[#0f1111] flex items-start">
                                    <span className="text-base font-normal mt-1.5 mr-0.5">₹</span>
                                    {product.price.toLocaleString('en-IN')}
                                </span>
                            </div>

                        </div>

                        <hr className="my-4 border-slate-200" />

                        {/* Highlights */}
                        <div className="mt-4">
                            <h3 className="font-bold text-[#0f1111] text-base mb-2">About this item</h3>
                            <ul className="list-disc pl-4 space-y-1 text-sm text-[#0f1111]">
                                <li>Ayuur is a Special things belongs to AYURVEDHA</li>
                                <li>Quality checked thoroughly by the Ministry of AYUSH.</li>
                                <li>Recommended for general wellness and health enhancement.</li>
                                <li>Made with purely natural and responsibly sourced ingredients.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Buy Box Column */}
                    <div className="md:col-span-3 lg:col-span-3">
                        <div className="border border-slate-200 rounded-xl p-4 sticky top-28 bg-white">
                            <div className="flex gap-1 items-start mb-5 text-[13px] text-[#0f1111]">
                                <MapPin className="w-4 h-4 mt-0.5 text-slate-800 shrink-0" />
                                <div className="flex flex-col">
                                    <span className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer" onClick={() => {
                                        setIsLocationModalOpen(true);
                                    }}>
                                        Delivering to {deliveryLocation} - Update location
                                    </span>
                                </div>
                            </div>

                            <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
                                <DialogContent className="sm:max-w-[425px] rounded-[24px] overflow-hidden border-none shadow-2xl p-0">
                                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white text-center">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3">
                                            <Navigation className="w-6 h-6 text-white" />
                                        </div>
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-bold text-white text-center">
                                                Update Delivery Location
                                            </DialogTitle>
                                        </DialogHeader>
                                        <p className="text-blue-100 text-xs mt-2 font-medium">
                                            Enter your details to see accurate delivery dates and availability for your area.
                                        </p>
                                    </div>

                                    <div className="p-6 space-y-4 bg-white">
                                        <Button
                                            variant="outline"
                                            onClick={handleGetLocation}
                                            disabled={isLocating}
                                            className="w-full rounded-xl border-dashed border-2 border-blue-100 hover:border-blue-600 hover:bg-blue-50 text-blue-600 font-bold gap-2 h-12 transition-all"
                                        >
                                            <LocateFixed className={cn("w-4 h-4", isLocating && "animate-spin")} />
                                            {isLocating ? "Getting Location..." : "Use Current Location"}
                                        </Button>

                                        <div className="flex items-center gap-3 py-2">
                                            <div className="h-px bg-slate-100 flex-1"></div>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Or Enter Details</span>
                                            <div className="h-px bg-slate-100 flex-1"></div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Flat, House no., Building, Company, Apartment</label>
                                                <Input
                                                    placeholder="e.g. 402, Sunshine Residency"
                                                    value={addressForm.street}
                                                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                                                    className="rounded-xl border-slate-200 h-11 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">City</label>
                                                    <Input
                                                        placeholder="City"
                                                        value={addressForm.city}
                                                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                                        className="rounded-xl border-slate-200 h-11 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Pincode</label>
                                                    <Input
                                                        placeholder="6-digit Pincode"
                                                        maxLength={6}
                                                        value={addressForm.pincode}
                                                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, '') })}
                                                        className="rounded-xl border-slate-200 h-11 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">State</label>
                                                <Input
                                                    placeholder="State"
                                                    value={addressForm.state}
                                                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                                    className="rounded-xl border-slate-200 h-11 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 pt-0 bg-white">
                                        <Button
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
                                            onClick={handleUpdateLocation}
                                        >
                                            Confirm Location
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <div className="text-[19px] font-medium text-[#007600] mb-3">
                                In stock
                            </div>

                            <div className="text-[13px] text-[#0f1111] space-y-1 mb-5">
                                <div className="flex justify-between">
                                    <span className="w-20 text-[#565959]">Ships from</span>
                                    <span className="flex-1">AYUSH Bazaar</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="w-20 text-[#565959]">Sold by</span>
                                    <span className="flex-1 text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer line-clamp-2 leading-tight">{product.storeName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="w-20 text-[#565959]">Payment</span>
                                    <span className="flex-1 text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer leading-tight">Secure transaction</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[#0f1111] mb-2">Quantity:</label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, Math.floor(parseInt(e.target.value) || 1)))}
                                    className="w-20 border-[#d5d9d9] focus:ring-[#007185] text-sm"
                                />
                            </div>

                            <div className="space-y-2 mb-4">
                                <Button
                                    onClick={handleAddToCart}
                                    className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] border border-[#fcd200] rounded-full shadow-sm py-[14px] text-[13px] font-normal"
                                >
                                    Add to cart
                                </Button>
                                <Button
                                    onClick={handleBuyNow}
                                    className="w-full bg-[#ffa41c] hover:bg-[#fa8900] text-[#0f1111] border border-[#ff8f00] rounded-full shadow-sm py-[14px] text-[13px] font-normal"
                                >
                                    Buy Now
                                </Button>
                            </div>

                            <div className="flex items-center gap-2 text-[13px] text-[#0f1111]">
                                <ShieldCheck className="w-4 h-4 text-slate-600" />
                                <span className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer">Secure transaction</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout >
    );
}
