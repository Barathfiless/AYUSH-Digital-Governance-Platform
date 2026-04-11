import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Search,
    MapPin,
    Star,
    Filter,
    Building2,
    ShieldCheck,
    Navigation,
    Phone,
    Mail,
    ExternalLink,
    ArrowLeft,
    Heart,
    ShoppingCart,
    PackageOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePageTitle } from '@/hooks/usePageTitle';
import { toast } from 'sonner';

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep", "Delhi", "Puducherry", "Jammu and Kashmir", "Ladakh"
];

const STATE_CITIES: Record<string, string[]> = {
    "andhra-pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Kakinada", "Kadapa", "Anantapur", "Eluru", "Ongole", "Nandyal", "Machilipatnam", "Adoni"],
    "arunachal-pradesh": ["Itanagar", "Tawang", "Ziro", "Pasighat", "Along", "Tezu", "Naharlagun", "Bomdila"],
    "assam": ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Nagaon", "Tinsukia", "Bongaigaon", "Tezpur", "Dhubri", "Diphu", "North Lakhimpur", "Karimganj"],
    "bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Arrah", "Begusarai", "Katihar", "Munger", "Chapra", "Saharsa", "Sasaram", "Hajipur", "Motihari"],
    "chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon", "Raigarh", "Jagdalpur", "Ambikapur", "Dhamtari", "Mahasamund"],
    "goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem"],
    "gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Nadiad", "Anand", "Morbi", "Mahesana", "Surendranagar", "Bharuch", "Valsad", "Navsari", "Veraval"],
    "haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula", "Sirsa", "Bhiwani", "Bahadurgarh"],
    "himachal-pradesh": ["Shimla", "Manali", "Dharamshala", "Solan", "Mandi", "Nahan", "Paonta Sahib", "Una", "Kullu", "Hamirpur"],
    "jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Phusro", "Hazaribagh", "Giridih", "Ramgarh", "Medininagar", "Sahibganj"],
    "karnataka": ["Bengaluru", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi", "Kalaburagi", "Davanagere", "Ballari", "Vijayapura", "Shivamogga", "Tumakuru", "Raichur", "Bidar", "Hassan", "Gadag-Betageri", "Udupi", "Hospet"],
    "kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kannur", "Kottayam", "Malappuram", "Manjeri", "Thalassery", "Ponnani", "Vatakara", "Kanhangad"],
    "madhya-pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", "Katni", "Singrauli", "Burhanpur", "Khandwa", "Bhind", "Chhindwara"],
    "maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Amravati", "Navi Mumbai", "Kolhapur", "Akola", "Jalgaon", "Latur", "Dhule", "Ahmednagar", "Chandrapur", "Parbhani", "Satara", "Beed"],
    "manipur": ["Imphal", "Thoubal", "Churachandpur", "Kakching", "Ukhrul", "Senapati"],
    "meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh", "Cherrapunji", "Baghmara"],
    "mizoram": ["Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib", "Serchhip"],
    "nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Mon"],
    "odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada", "Jharsuguda", "Bargarh", "Rayagada"],
    "punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Hoshiarpur", "Mohali", "Batala", "Pathankot", "Moga", "Abohar", "Malerkotla", "Khanna", "Phagwara"],
    "rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Bharatpur", "Sikar", "Pali", "Sri Ganganagar", "Barmer", "Churu", "Jhunjhunu"],
    "sikkim": ["Gangtok", "Namchi", "Geyzing", "Mangan", "Singtam", "Rangpo"],
    "tamil-nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Erode", "Tiruppur", "Vellore", "Thoothukudi", "Nagercoil", "Thanjavur", "Dindigul", "Ranipet", "Sivakasi", "Karur", "Udhagamandalam", "Hosur", "Kanchipuram", "Neyveli", "Kumbakonam", "Karaikudi"],
    "telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Mancherial"],
    "tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Belonia", "Khowai"],
    "uttar-pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj", "Bareilly", "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur", "Noida", "Firozabad", "Jhansi", "Muzaffarnagar", "Mathura", "Ayodhya", "Etawah", "Roorkee"],
    "uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Pithoragarh", "Ramnagar"],
    "west-bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Maheshtala", "Rajpur Sonarpur", "Gopalpur", "Bhatpara", "Panihati", "Kamarhati", "Bardhaman", "Kulti", "Bally", "Barasat"],
    "andaman-and-nicobar-islands": ["Port Blair", "Diglipur", "Mayabunder", "Rangat"],
    "chandigarh": ["Chandigarh"],
    "dadra-and-nagar-haveli-and-daman-and-diu": ["Daman", "Silvassa", "Diu"],
    "lakshadweep": ["Kavaratti", "Agatti", "Amini", "Andrott", "Minicoy"],
    "delhi": ["New Delhi", "North Delhi", "South Delhi", "West Delhi", "East Delhi", "Shahdara", "Rohini", "Dwarka"],
    "puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
    "jammu-and-kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua", "Sopore", "Udhampur", "Pulwama"],
    "ladakh": ["Leh", "Kargil"]
};

export default function SearchStores() {
    usePageTitle('Find Stores');
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialSearch = queryParams.get('search') || '';

    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [stores, setStores] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedState, setSelectedState] = useState<string>('All');
    const [selectedCity, setSelectedCity] = useState<string>('All');
    const [appliedState, setAppliedState] = useState<string>('All');
    const [appliedCity, setAppliedCity] = useState<string>('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedStore, setSelectedStore] = useState<any | null>(null);
    const [cart, setCart] = useState<any[]>(() => {
        const saved = localStorage.getItem('ayush_cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('ayush_cart', JSON.stringify(cart));
    }, [cart]);

    const handleToggleHeart = (productToAdd: any) => {
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
        const fetchStores = async () => {
            try {
                const response = await fetch('/api/applications/all');
                const data = await response.json();
                if (response.ok) {
                    // Filter approved applications and treat them as stores
                    const approvedStores = data.filter((app: any) =>
                        app.status && app.status.toLowerCase() === 'approved'
                    ).map((app: any) => {
                        const companyLogo = app.documents?.find((d: any) => d.title === "Company photo")?.url;
                        return {
                            id: app._id,
                            name: app.companyName,
                            city: app.city || 'Unknown',
                            state: app.state || 'Unknown',
                            location: `${app.city || 'Unknown'}, ${app.state || 'Unknown'}`,
                            rating: (4 + Math.random()).toFixed(1),
                            reviews: Math.floor(Math.random() * 200) + 50,
                            category: app.products?.[0]?.category || 'AYUSH',
                            productsCount: app.products?.length || 0,
                            products: app.products || [],
                            email: app.founderEmail,
                            phone: '+91 ' + (Math.floor(Math.random() * 9000000000) + 1000000000),
                            image: companyLogo || `https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?w=400&h=300&fit=crop&q=80&sig=${app._id}`
                        };
                    });
                    setStores(approvedStores);
                    if (initialSearch) {
                        const directMatch = approvedStores.find((s: any) => s.name.toLowerCase() === initialSearch.toLowerCase());
                        if (directMatch) setSelectedStore(directMatch);
                    }
                }
            } catch (error) {
                console.error("Error fetching stores:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStores();
    }, []);

    const states = ['All', ...INDIAN_STATES];

    let currentCities: string[] = [];
    if (selectedState !== 'All') {
        const stateKey = selectedState.toLowerCase().replace(/\s+/g, '-');
        currentCities = STATE_CITIES[stateKey] || [];
    }

    const cities = ['All', ...currentCities];

    const filteredStores = stores.filter(store => {
        const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, '-');

        const matchesState = appliedState === 'All' ||
            normalize(store.state) === normalize(appliedState);
        const matchesCity = appliedCity === 'All' ||
            normalize(store.city) === normalize(appliedCity);
        const matchesSearch = !searchQuery || store.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesState && matchesCity && matchesSearch;
    });

    return (
        <DashboardLayout>
            <div className="max-w-[1400px] mx-auto pt-6">

                {selectedStore ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-6">
                            <Button
                                variant="ghost"
                                onClick={() => setSelectedStore(null)}
                                className="rounded-xl hover:bg-slate-100 gap-2 font-bold text-slate-600 px-0"
                            >
                                <ArrowLeft className="w-5 h-5 text-slate-600" />
                                Back
                            </Button>
                        </div>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-[#002b5b]">{selectedStore.name}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-sm font-medium text-slate-500">{selectedStore.location}</span>
                                </div>
                            </div>
                        </div>

                        {selectedStore.products && selectedStore.products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {selectedStore.products.map((product: any, idx: number) => {
                                    const productImage = product.image || `https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?w=400&h=300&fit=crop&q=80&sig=${idx}`;
                                    const productPrice = product.price || Math.floor(Math.random() * 1000) + 100;
                                    const productRating = (4 + Math.random()).toFixed(1);

                                    const cartItem = {
                                        id: product._id || `${selectedStore.id}-${idx}`,
                                        name: product.name,
                                        priceValue: productPrice,
                                        image: productImage,
                                        store: selectedStore.name,
                                        rating: productRating
                                    };
                                    const isInCart = cart.some((item: any) => item.id === cartItem.id);

                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
                                        >
                                            <div className="relative h-48 overflow-hidden pt-4 px-4">
                                                <img src={productImage} alt={product.name} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700" />
                                                <button
                                                    onClick={() => handleToggleHeart(cartItem)}
                                                    className="absolute top-8 right-8 p-2.5 bg-white/90 backdrop-blur-sm rounded-xl text-slate-400 hover:text-rose-500 shadow-lg group-hover:bg-rose-50 transition-colors"
                                                >
                                                    <Heart className={cn("w-4 h-4", isInCart ? "fill-rose-500 text-rose-500" : "")} />
                                                </button>
                                                <div className="absolute bottom-6 left-6">
                                                    <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md flex items-center gap-1 shadow-xl">
                                                        <ShieldCheck className="w-3 h-3" />
                                                        AYUSH GRADE
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="flex items-center gap-1 mb-2">
                                                    <div className="flex items-center bg-amber-50 px-2 py-0.5 rounded-md">
                                                        <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                                                        <span className="ml-1 text-[10px] font-black text-amber-600">{productRating}</span>
                                                    </div>
                                                </div>

                                                <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{product.name}</h3>
                                                <p className="text-xs font-medium text-slate-500 mb-4 line-clamp-2">
                                                    {product.description || 'Ayuur is a Special things belongs to AYURVEDHA'}
                                                </p>

                                                <div className="mt-auto flex items-center justify-between gap-4">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price</p>
                                                        <div className="text-xl font-black text-[#002b5b]">₹{productPrice}</div>
                                                    </div>
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
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">No Products Yet</h3>
                                <p className="text-slate-500 max-w-sm text-center">
                                    This store hasn't added any products to their inventory yet. Check back later!
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Header & Filters */}
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-[#002b5b]">AYUSH Stores</h1>
                            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-10 h-10 rounded-full p-0 border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 shadow-sm transition-all group relative">
                                        <Filter className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                                        {(appliedState !== 'All' || appliedCity !== 'All') && (
                                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white" />
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[340px] rounded-2xl p-5 shadow-xl border-slate-200 mr-4" align="end" sideOffset={8}>
                                    <div className="flex items-center gap-2 mb-5">
                                        <Filter className="w-4 h-4 text-blue-600" />
                                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Filter Stores</h3>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase">State</label>
                                            <Select
                                                value={selectedState}
                                                onValueChange={(val) => {
                                                    setSelectedState(val);
                                                    setSelectedCity('All'); // Reset city UI when state changes
                                                }}
                                            >
                                                <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:ring-blue-100">
                                                    <SelectValue placeholder="Select State" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl max-h-[300px]">
                                                    {states.map((st) => (
                                                        <SelectItem key={st} value={st} className="rounded-lg">{st}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase">City</label>
                                            <Select value={selectedCity} onValueChange={setSelectedCity}>
                                                <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:ring-blue-100">
                                                    <SelectValue placeholder="Select City" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl max-h-[300px]">
                                                    {cities.map((city) => (
                                                        <SelectItem key={city} value={city} className="rounded-lg">{city}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1 rounded-xl"
                                                onClick={() => {
                                                    setSelectedState('All');
                                                    setSelectedCity('All');
                                                    setAppliedState('All');
                                                    setAppliedCity('All');
                                                    setIsFilterOpen(false);
                                                }}
                                            >
                                                Reset
                                            </Button>
                                            <Button
                                                className="flex-[2] rounded-xl bg-blue-600 hover:bg-blue-700"
                                                onClick={() => {
                                                    setAppliedState(selectedState);
                                                    setAppliedCity(selectedCity);
                                                    setIsFilterOpen(false);
                                                    toast.success("Filters applied successfully");
                                                }}
                                            >
                                                Apply Filters
                                            </Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Grid of Stores */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                            {filteredStores.length > 0 ? filteredStores.map((store) => (
                                <motion.div
                                    key={store.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-[20px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
                                >
                                    <div className="relative h-36">
                                        <img src={store.image} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute bottom-3 left-3">
                                            <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                                                <ShieldCheck className="w-2.5 h-2.5" /> Verified
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 flex flex-col flex-1">
                                        <h3 className="text-[15px] font-bold text-slate-800 mb-2 truncate group-hover:text-blue-600 transition-colors">{store.name}</h3>

                                        <div className="space-y-1.5 mb-4 flex-1">
                                            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                                <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                <span className="truncate">{store.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                                <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                <span className="truncate">{store.category} • {store.productsCount} items</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                                            <Button variant="outline" className="rounded-lg h-9 text-[11px] border-slate-200 font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                                                <Phone className="w-3.5 h-3.5 mr-1.5" /> Call
                                            </Button>
                                            <Button
                                                onClick={() => setSelectedStore(store)}
                                                className="rounded-lg h-9 text-[11px] bg-blue-600 hover:bg-blue-700 font-bold shadow-md shadow-blue-100/50 px-0"
                                            >
                                                Visit Store
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="col-span-full py-20 text-center bg-white rounded-[32px] border border-slate-100 shadow-sm">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                        <Building2 className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">No Stores Found</h3>
                                    <p className="text-slate-500 mt-2">Try adjusting your filters or searching in a different city.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
