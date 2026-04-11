import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
    Search,
    Star,
    Filter,
    ShieldCheck,
    ShoppingCart,
    Heart,
    PackageOpen,
    ArrowLeft,
    Tag,
    Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePageTitle } from '@/hooks/usePageTitle';
import { toast } from 'sonner';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function SearchProducts() {
    usePageTitle('Search Products');
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialSearch = queryParams.get('search') || '';

    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedType, setSelectedType] = useState<string>('All');
    const [appliedCategory, setAppliedCategory] = useState<string>('All');
    const [appliedType, setAppliedType] = useState<string>('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [cart, setCart] = useState<any[]>(() => {
        const saved = localStorage.getItem('ayush_cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('ayush_cart', JSON.stringify(cart));
    }, [cart]);

    const handleToggleCart = (productToAdd: any) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === productToAdd.id);
            if (existing) {
                toast.success(`Removed ${productToAdd.name} from cart`);
                return prev.filter(item => item.id !== productToAdd.id);
            }
            toast.success(`Added ${productToAdd.name} to cart`);
            return [...prev, { ...productToAdd, quantity: 1 }];
        });
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/applications/all');
                const data = await response.json();
                if (response.ok) {
                    const allProducts: any[] = [];
                    const approvedApps = data.filter((app: any) =>
                        app.status && app.status.toLowerCase() === 'approved'
                    );

                    approvedApps.forEach((app: any) => {
                        const companyLogo = app.documents?.find((d: any) => d.title === "Company photo")?.url;
                        if (app.products) {
                            app.products.forEach((p: any, idx: number) => {
                                const prodId = `${app._id}-${idx}`;
                                const idHash = prodId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                                const deterministicBase = (4 + (idHash % 10) / 10).toFixed(1);

                                allProducts.push({
                                    id: prodId,
                                    name: p.name,
                                    category: p.category || 'Uncategorized',
                                    type: p.type || 'N/A',
                                    price: p.price || 50,
                                    description: p.description || 'Ayuur is a Special things belongs to AYURVEDHA',
                                    storeName: app.companyName,
                                    storeId: app._id,
                                    rating: deterministicBase,
                                    reviews: 10 + (idHash % 90),
                                    image: p.image || companyLogo || `https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?w=400&h=300&fit=crop&q=80&sig=${prodId}`
                                });
                            });
                        }
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

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
    const types = ['All', ...Array.from(new Set(products.map(p => p.type)))];

    const filteredProducts = products.filter(product => {
        const matchesCategory = appliedCategory === 'All' || product.category === appliedCategory;
        const matchesType = appliedType === 'All' || product.type === appliedType;
        const matchesSearch = !searchQuery ||
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.type.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesType && matchesSearch;
    });

    return (
        <DashboardLayout>
            <div className="max-w-[1400px] mx-auto pt-2 px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-[#002b5b]">Search Results</h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {initialSearch ? `Showing results for "${initialSearch}"` : "Browse all products"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="rounded-lg border-slate-200 bg-white hover:bg-slate-50 gap-2 h-9 px-3 shadow-sm">
                                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                                    <span className="text-xs font-bold text-slate-700">Filter</span>
                                    {(appliedCategory !== 'All' || appliedType !== 'All') && (
                                        <span className="w-2 h-2 bg-blue-600 rounded-full" />
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] rounded-2xl p-5 shadow-xl border-slate-200" align="end" sideOffset={8}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                            <SelectTrigger className="rounded-xl border-slate-200 h-11">
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                {categories.map(cat => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Product Type</label>
                                        <Select value={selectedType} onValueChange={setSelectedType}>
                                            <SelectTrigger className="rounded-xl border-slate-200 h-11">
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                {types.map(t => (
                                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1 rounded-xl"
                                            onClick={() => {
                                                setSelectedCategory('All');
                                                setSelectedType('All');
                                                setAppliedCategory('All');
                                                setAppliedType('All');
                                                setIsFilterOpen(false);
                                            }}
                                        >
                                            Reset
                                        </Button>
                                        <Button
                                            className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
                                            onClick={() => {
                                                setAppliedCategory(selectedCategory);
                                                setAppliedType(selectedType);
                                                setIsFilterOpen(false);
                                                toast.success("Filters applied");
                                            }}
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="bg-slate-100 rounded-2xl h-80 animate-pulse" />
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {filteredProducts.map((product, idx) => {
                            const isInCart = cart.some(item => item.id === product.id);
                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
                                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col sm:flex-row h-auto sm:h-44 cursor-pointer"
                                >
                                    {/* Image Section */}
                                    <div className="relative w-full sm:w-48 h-48 sm:h-full bg-slate-50 shrink-0 overflow-hidden p-3">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute top-5 right-5 z-10">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleCart({
                                                        id: product.id,
                                                        name: product.name,
                                                        priceValue: product.price,
                                                        image: product.image,
                                                        store: product.storeName,
                                                        rating: product.rating
                                                    });
                                                }}
                                                className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-slate-400 hover:text-blue-600 shadow-lg group-hover:bg-blue-50 transition-colors"
                                            >
                                                <ShoppingCart className={cn("w-4 h-4", isInCart ? "fill-blue-600 text-blue-600" : "")} />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-5 left-5">
                                            <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md flex items-center gap-1">
                                                <ShieldCheck className="w-2.5 h-2.5" />
                                                AYUSH GRADE
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-5 flex-1 flex flex-col justify-between min-w-0">
                                        <div className="flex flex-col">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.category}</span>
                                            </div>
                                            <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors truncate">
                                                {product.name}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                {(() => {
                                                    const allReviews = JSON.parse(localStorage.getItem('ayush_product_reviews') || '{}');
                                                    const prodStats = allReviews[product.id];
                                                    let displayRating = parseFloat(product.rating);
                                                    let totalReviews = 0;
                                                    let sentimentRate = Math.round((displayRating / 5) * 100);
                                                    let isReal = false;

                                                    if (prodStats && prodStats.total > 0) {
                                                        const sumRating = prodStats.reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
                                                        displayRating = parseFloat((sumRating / prodStats.total).toFixed(1));
                                                        totalReviews = prodStats.total;
                                                        sentimentRate = Math.round((prodStats.positive / prodStats.total) * 100);
                                                        isReal = true;
                                                    }

                                                    return (
                                                        <>
                                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-100/50">
                                                                <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                                                                <span className="text-[10px] font-black text-amber-700">{displayRating.toFixed(1)}</span>
                                                                {totalReviews > 0 && <span className="text-[8px] text-amber-600/60 font-medium">({totalReviews})</span>}
                                                            </div>

                                                            <div className={cn(
                                                                "flex items-center gap-1.5 px-3 py-1 rounded-lg border shadow-sm",
                                                                isReal ? "bg-purple-50 border-purple-100" : "bg-indigo-50 border-indigo-100"
                                                            )}>
                                                                <ShieldCheck className={cn("w-3.5 h-3.5", isReal ? "text-purple-600" : "text-indigo-600")} />
                                                                <span className={cn(
                                                                    "text-xs font-black uppercase tracking-tight",
                                                                    isReal ? "text-purple-700" : "text-indigo-700"
                                                                )}>
                                                                    {sentimentRate}% {isReal ? "Customer Sentiment" : "Market Prediction"}
                                                                </span>
                                                            </div>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                            <p className="text-xs text-slate-500 line-clamp-2 max-w-2xl leading-relaxed">
                                                {product.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 mt-4 sm:mt-0 pt-4 border-t border-slate-50 sm:border-0 sm:pt-0">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xs font-bold text-slate-400">₹</span>
                                                <span className="text-2xl font-black text-[#002b5b]">{product.price}</span>
                                            </div>
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/checkout/${product.id}`, {
                                                        state: {
                                                            product,
                                                            quantity: 1
                                                        }
                                                    });
                                                }}
                                                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white h-9 px-6 text-xs font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
                                            >
                                                Buy Now
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-slate-100 shadow-sm">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                            <PackageOpen className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">No Products Found</h3>
                        <p className="text-slate-500 max-w-sm text-center">
                            We couldn't find any products matching "{searchQuery}". Try searching for something else!
                        </p>
                        <Button
                            variant="link"
                            className="mt-4 text-blue-600 font-bold"
                            onClick={() => setSearchQuery('')}
                        >
                            Clear search
                        </Button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
