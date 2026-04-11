import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Search,
    ShoppingBag,
    MapPin,
    Star,
    Filter,
    Heart,
    ShieldCheck,
    Plus
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
export default function Store() {
    usePageTitle('Digital Bazaar');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialSearch = queryParams.get('search') || '';
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [products, setProducts] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    // Cart State
    const [cart, setCart] = useState<any[]>(() => {
        const savedCart = localStorage.getItem('ayush_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/applications/all');
                const data = await response.json();
                if (response.ok) {
                    const approvedApps = data.filter((app: any) => app.status === 'Approved');
                    const allProducts = approvedApps.flatMap((app: any) => {
                        const companyLogo = app.documents?.find((d: any) => d.title === "Company photo")?.url;
                        return app.products.map((prod: any, idx: number) => {
                            const prodId = `${app._id}-${idx}`;
                            // Generate deterministic rating based on ID
                            const idHash = prodId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                            const deterministicBase = (4 + (idHash % 10) / 10).toFixed(1);

                            return {
                                ...prod,
                                id: prodId,
                                store: app.companyName,
                                priceValue: prod.price || 50, // Consistent price fallback
                                rating: deterministicBase,
                                reviews: 10 + (idHash % 90),
                                image: prod.image || companyLogo || `https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=400&h=300&fit=crop&q=80&sig=${prodId}`
                            };
                        });
                    });
                    setProducts(allProducts);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        localStorage.setItem('ayush_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: any) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                toast.success(`Increased ${product.name} quantity`);
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            toast.success(`Added ${product.name} to cart`);
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.id !== productId));
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

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.store.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    return (
        <DashboardLayout>
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="flex justify-end gap-4 mb-2">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="gap-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-bold text-[10px] uppercase tracking-wider">
                            <MapPin className="w-3.5 h-3.5" />
                            Deliver to: Choose Location
                        </Button>
                        <button
                            onClick={() => navigate('/cart')}
                            className="relative p-2 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                        >
                            <ShoppingBag className="w-6 h-6 text-[#002b5b] group-hover:scale-110 transition-transform" />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
                                    {cart.reduce((s, i) => s + i.quantity, 0)}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Verified Listings</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{filteredProducts.length} Products found</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
                        >
                            <div className="relative h-60 overflow-hidden pt-4 px-4">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-3xl group-hover:scale-105 transition-transform duration-700" />
                                <button className="absolute top-8 right-8 p-2.5 bg-white/90 backdrop-blur-sm rounded-xl text-slate-400 hover:text-rose-500 shadow-lg group-hover:bg-rose-50 transition-colors">
                                    <Heart className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-6 left-6">
                                    <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md flex items-center gap-1 shadow-xl">
                                        <ShieldCheck className="w-3 h-3" />
                                        AYUSH GRADE
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="font-black text-slate-800 text-base mb-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight line-clamp-1">{product.name}</h3>
                                <p className="text-[9px] font-black text-blue-500/60 mb-2 uppercase tracking-widest">
                                    Store: {product.store}
                                </p>

                                <div className="flex items-center gap-2 mb-4">
                                    {(() => {
                                        const allReviews = JSON.parse(localStorage.getItem('ayush_product_reviews') || '{}');
                                        const prodStats = allReviews[product.id];
                                        let displayRating = product.rating;
                                        let totalReviews = 0;
                                        let isReal = false;

                                        if (prodStats && prodStats.total > 0) {
                                            const sumRating = prodStats.reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
                                            displayRating = (sumRating / prodStats.total).toFixed(1);
                                            totalReviews = prodStats.total;
                                            isReal = true;
                                        }

                                        return (
                                            <>
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50">
                                                    <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                                                    <span className="text-[10px] font-black text-amber-700">{displayRating}</span>
                                                    <span className="text-[8px] text-amber-600/60 font-medium">({totalReviews})</span>
                                                </div>

                                                {(() => {
                                                    const sentimentRate = isReal ? Math.round((prodStats.positive / prodStats.total) * 100) : Math.round((parseFloat(displayRating) / 5) * 100);
                                                    return (
                                                        <div className={cn(
                                                            "flex items-center gap-1.5 px-3 py-1 rounded-lg border shadow-sm",
                                                            isReal ? "bg-purple-50 border-purple-100" : "bg-indigo-50 border-indigo-100"
                                                        )}>
                                                            <ShieldCheck className={cn("w-3.5 h-3.5", isReal ? "text-purple-600" : "text-indigo-600")} />
                                                            <span className={cn(
                                                                "text-xs font-black uppercase tracking-tight",
                                                                isReal ? "text-purple-700" : "text-indigo-700"
                                                            )}>
                                                                {sentimentRate}% {isReal ? "Sentiment" : "Pred."}
                                                            </span>
                                                        </div>
                                                    );
                                                })()}
                                            </>
                                        );
                                    })()}
                                </div>

                                <div className="mt-auto flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Price</p>
                                        <div className="text-lg font-black text-[#002b5b]">₹{product.priceValue}</div>
                                    </div>
                                    <Button
                                        onClick={() => addToCart(product)}
                                        className="rounded-xl bg-[#002b5b] hover:bg-blue-900 h-10 px-5 text-xs font-black uppercase tracking-wider gap-1.5 shadow-lg shadow-blue-100 group/btn active:scale-95 transition-all"
                                    >
                                        <Plus className="w-3.5 h-3.5 group-hover/btn:rotate-90 transition-transform" />
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                                <ShoppingBag className="w-10 h-10 text-slate-200" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">No Products Available</h3>
                            <p className="text-slate-500 mt-2 font-medium">Try searching for something else or change categories.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
