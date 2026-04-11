import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Plus,
    Package,
    Search,
    AlertTriangle,
    CheckCircle2,
    Loader2,
    Building2,
    ChevronLeft,
    Calendar,
    Image as ImageIcon,
    FileText,
    Trash2,
    Eye,
    ShoppingCart,
    List
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Inventory() {
    usePageTitle('Warehouse & Inventory');
    const [isLoading, setIsLoading] = useState(true);
    const [approvedApps, setApprovedApps] = useState<any[]>([]);
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'products' | 'inventory'>('inventory');

    // New Product Form State
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'Ayurveda',
        type: 'Tablet',
        strength: '',
        price: '',
        description: '',
        quantity: '',
        image: ''
    });

    useEffect(() => {
        const fetchStatus = async () => {
            const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
            const userId = userData?._id || userData?.id;

            if (!userId) return;

            try {
                const response = await fetch(`/api/applications/user/${userId}`);
                const data = await response.json();

                if (response.ok) {
                    const approved = data.filter((app: any) => app.status === 'Approved');
                    setApprovedApps(approved);
                    // If only one app, maybe select it? No, user wants grid first.
                }
            } catch (error) {
                console.error("Error fetching applications:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStatus();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 200 * 1024) {
            toast.error("Image size must be less than 200KB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setNewProduct(prev => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.strength || !newProduct.price || !newProduct.quantity) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            const response = await fetch(`/api/applications/${selectedApp._id}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });

            if (response.ok) {
                const updatedApp = await response.json();
                setProducts(updatedApp.products);
                setNewProduct({
                    name: '',
                    category: 'Ayurveda',
                    type: 'Tablet',
                    strength: '',
                    price: '',
                    description: '',
                    quantity: '',
                    image: ''
                });
                setActiveTab('inventory');
                toast.success('Product added successfully to inventory');
            } else {
                const error = await response.json();
                toast.error(error.message || 'Failed to add product');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    const handleSelectApp = (app: any) => {
        setSelectedApp(app);
        setProducts(app.products || []);
    };

    if (approvedApps.length === 0) {
        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto py-12 px-6 text-center">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-12">
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-10 h-10 text-amber-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">No Approved Licenses</h2>
                        <p className="text-slate-600 max-w-lg mx-auto mb-8">
                            The Warehouse & Inventory module is only available for startups with an
                            <span className="font-bold text-emerald-600"> Approved License</span>.
                            Your license is either pending review or hasn't been submitted yet.
                        </p>
                        <Button
                            variant="outline"
                            className="border-amber-200 text-amber-700 hover:bg-amber-100"
                            onClick={() => window.location.href = '/track'}
                        >
                            Check Application Status
                        </Button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!selectedApp) {
        return (
            <DashboardLayout>
                <div className="max-w-7xl mx-auto py-4 px-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {approvedApps.map((app) => (
                            <motion.div
                                key={app._id}
                                whileHover={{ y: -5 }}
                                className="group bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden cursor-pointer hover:border-blue-500 transition-all"
                                onClick={() => handleSelectApp(app)}
                            >
                                <div className="h-32 bg-slate-100 relative overflow-hidden">
                                    {app.documents?.find((d: any) => d.title === "Company photo") ? (
                                        <img
                                            src={app.documents.find((d: any) => d.title === "Company photo").url}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            alt={app.companyName}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#002b5b] to-[#1e3a8a] flex items-center justify-center">
                                            <Building2 className="w-10 h-10 text-white opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-emerald-500/20 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/30">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    </div>
                                    <div className="absolute bottom-4 left-6">
                                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 overflow-hidden shadow-2xl">
                                            {app.documents?.find((d: any) => d.title === "Company photo") ? (
                                                <img
                                                    src={app.documents.find((d: any) => d.title === "Company photo").url}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Building2 className="w-6 h-6 text-white" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight truncate">
                                        {app.companyName}
                                    </h3>
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                            <span>Inventory Items</span>
                                            <span className="font-bold text-slate-700">{(app.products || []).length} Products</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-slate-500 gap-4 mt-1 pt-2 border-t border-slate-50">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                                Renewal:
                                            </span>
                                            <span className="font-bold text-slate-700">
                                                {app.renewalDate ? new Date(app.renewalDate).toLocaleDateString() : 'Not Set'}
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-3">
                                            <div
                                                className="h-full bg-blue-600 rounded-full"
                                                style={{ width: `${Math.min(((app.products || []).length / 20) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <Button className="w-full mt-6 rounded-xl bg-slate-50 text-slate-600 hover:bg-[#002b5b] hover:text-white border-none shadow-none font-bold text-xs uppercase tracking-widest h-11">
                                        Manage Inventory
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto py-6 px-4 md:px-6">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => setSelectedApp(null)}
                        className="p-0 hover:bg-transparent text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-4 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Selection
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
                    <div className="flex items-center gap-4">
                        {selectedApp.documents?.find((d: any) => d.title === "Company photo") && (
                            <div className="w-16 h-16 rounded-xl border border-slate-100 overflow-hidden shrink-0 shadow-sm bg-slate-50">
                                <img
                                    src={selectedApp.documents.find((d: any) => d.title === "Company photo").url}
                                    className="w-full h-full object-cover"
                                    alt="Logo"
                                />
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{selectedApp.companyName} INVENTORY</h1>
                            <p className="text-slate-500 text-xs mt-1 font-bold">Ministerial ID: <span className="font-mono text-blue-600 pb-0.5 border-b border-blue-100">{selectedApp.applicationId}</span></p>
                        </div>
                    </div>

                    <div className="flex p-1 bg-slate-100 rounded-xl relative">
                        <motion.div
                            className="absolute bg-white rounded-lg shadow-sm z-0"
                            layoutId="tab-bg"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            initial={false}
                            style={{
                                width: 'calc(50% - 4px)',
                                height: 'calc(100% - 8px)',
                                top: '4px',
                                left: activeTab === 'products' ? '4px' : 'calc(50% + 1px)'
                            }}
                        />
                        <button
                            onClick={() => setActiveTab('products')}
                            className={cn(
                                "relative z-10 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all w-32 flex items-center justify-center gap-2",
                                activeTab === 'products' ? "text-blue-700" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Products
                        </button>
                        <button
                            onClick={() => setActiveTab('inventory')}
                            className={cn(
                                "relative z-10 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all w-32 flex items-center justify-center gap-2",
                                activeTab === 'inventory' ? "text-blue-700" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            <List className="w-3.5 h-3.5" />
                            Inventory
                        </button>
                    </div>
                </div>

                <div className="relative min-h-[600px] overflow-hidden">
                    <AnimatePresence mode="wait">
                        {activeTab === 'products' ? (
                            <motion.div
                                key="entry-tab"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50"
                            >
                                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Register New Product</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Entry form for warehouse stock</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                    {/* Image Upload Column */}
                                    <div className="lg:col-span-1 space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Product Image</label>
                                        <div className={cn(
                                            "w-full aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-500",
                                            newProduct.image ? "border-blue-100 bg-blue-50/10" : "border-slate-100 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/20"
                                        )}>
                                            {newProduct.image ? (
                                                <>
                                                    <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="text-white hover:bg-rose-500 h-10 w-10 rounded-full"
                                                            onClick={() => setNewProduct(prev => ({ ...prev, image: '' }))}
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center text-center p-6 pointer-events-none transition-transform group-hover:scale-110 duration-500">
                                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 mb-4">
                                                        <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                                    </div>
                                                    <p className="text-xs font-black text-slate-400 uppercase tracking-tight">Upload JPG</p>
                                                    <p className="text-[9px] text-slate-300 mt-1 uppercase font-bold tracking-widest">Max 200KB • 1:1</p>
                                                </div>
                                            )}
                                            {!newProduct.image && (
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={handleFileUpload}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Details Column */}
                                    <div className="lg:col-span-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Product Name *</label>
                                                <Input
                                                    placeholder="Enter full product name"
                                                    value={newProduct.name}
                                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                                    className="h-12 rounded-xl border-slate-200 focus:ring-blue-500 font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Strength/Dosage *</label>
                                                <Input
                                                    placeholder="e.g. 500mg, 100ml"
                                                    value={newProduct.strength}
                                                    onChange={(e) => setNewProduct({ ...newProduct, strength: e.target.value })}
                                                    className="h-12 rounded-xl border-slate-200 focus:ring-blue-500 font-bold text-slate-700 placeholder:text-slate-300"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                                                <Select
                                                    value={newProduct.category}
                                                    onValueChange={(v) => setNewProduct({ ...newProduct, category: v })}
                                                >
                                                    <SelectTrigger className="h-12 rounded-xl border-slate-200 font-bold text-slate-700">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                                        <SelectItem value="Ayurveda" className="rounded-lg">Ayurveda</SelectItem>
                                                        <SelectItem value="Siddha" className="rounded-lg">Siddha</SelectItem>
                                                        <SelectItem value="Unani" className="rounded-lg">Unani</SelectItem>
                                                        <SelectItem value="Homeopathy" className="rounded-lg">Homeopathy</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Type</label>
                                                <Select
                                                    value={newProduct.type}
                                                    onValueChange={(v) => setNewProduct({ ...newProduct, type: v })}
                                                >
                                                    <SelectTrigger className="h-12 rounded-xl border-slate-200 font-bold text-slate-700">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                                        <SelectItem value="Tablet" className="rounded-lg">Tablet</SelectItem>
                                                        <SelectItem value="Syrup" className="rounded-lg">Syrup</SelectItem>
                                                        <SelectItem value="Powder" className="rounded-lg">Powder</SelectItem>
                                                        <SelectItem value="Oil" className="rounded-lg">Oil</SelectItem>
                                                        <SelectItem value="Ointment" className="rounded-lg">Ointment</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Single Product Price (₹) *</label>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={newProduct.price}
                                                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                                    className="h-12 rounded-xl border-slate-200 focus:ring-blue-500 font-bold text-slate-700"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Initial Quantity *</label>
                                                <Input
                                                    type="number"
                                                    placeholder="Available Units"
                                                    value={newProduct.quantity}
                                                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                                                    className="h-12 rounded-xl border-slate-200 focus:ring-blue-500 font-bold text-slate-700"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Product Description</label>
                                                <Textarea
                                                    placeholder="Briefly describe the product and its therapeutic benefits..."
                                                    value={newProduct.description}
                                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                                    className="min-h-[100px] rounded-xl border-slate-200 focus:ring-blue-500 font-medium text-slate-600 p-4"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 mt-10">
                                            <Button
                                                variant="ghost"
                                                onClick={() => setActiveTab('inventory')}
                                                className="rounded-xl px-8 font-bold text-slate-400 hover:text-slate-600"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleAddProduct}
                                                className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl px-12 h-12 font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all"
                                            >
                                                Register Product
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list-tab"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden"
                            >
                                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                            <List className="w-4 h-4" />
                                        </div>
                                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter">Inventory Stock List</h3>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total SKU:</span>
                                        <span className="text-xs font-black text-blue-700">{products.length}</span>
                                    </div>
                                </div>
                                <Table>
                                    <TableHeader className="bg-slate-50/50 border-y border-slate-100">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="pl-6 font-black text-[10px] text-slate-500 uppercase tracking-[0.2em] h-14">Preview</TableHead>
                                            <TableHead className="font-black text-[10px] text-slate-500 uppercase tracking-[0.2em]">Product Name</TableHead>
                                            <TableHead className="font-black text-[10px] text-slate-500 uppercase tracking-[0.2em]">Configuration</TableHead>
                                            <TableHead className="font-black text-[10px] text-slate-500 uppercase tracking-[0.2em]">Price</TableHead>
                                            <TableHead className="font-black text-[10px] text-slate-500 uppercase tracking-[0.2em]">Quantity</TableHead>
                                            <TableHead className="font-black text-[10px] text-slate-500 uppercase tracking-[0.2em]">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-64 text-center">
                                                    <div className="flex flex-col items-center justify-center opacity-30 grayscale scale-90">
                                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                            <Package className="w-10 h-10" />
                                                        </div>
                                                        <p className="text-sm font-black uppercase tracking-widest">No products in inventory</p>
                                                        <p className="text-xs font-medium mt-1">Start by clicking the "Products" tab above</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            products.map((product: any, idx: number) => (
                                                <TableRow key={idx} className="group hover:bg-slate-50/50 transition-colors h-20">
                                                    <TableCell className="pl-6">
                                                        <div className="w-12 h-12 rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                                                            {product.image ? (
                                                                <img src={product.image} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                                                                    <ImageIcon className="w-5 h-5" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-black text-slate-800 text-sm tracking-tight uppercase">{product.name}</p>
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{product.category}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-[10px] font-black border border-blue-100/50 uppercase">
                                                                {product.type}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100/50 px-2 py-1 rounded border border-slate-100">{product.strength}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-mono text-xs font-black text-emerald-700 underline decoration-emerald-200 underline-offset-4 decoration-2">₹{product.price || '0.00'}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-6 w-1 bg-blue-100 rounded-full overflow-hidden">
                                                                <div className="h-2/3 bg-blue-600 rounded-full" />
                                                            </div>
                                                            <span className="font-black text-slate-700 text-xs">{product.quantity || '0'}</span>
                                                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">Units</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100">
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">In Stock</p>
                                                                <p className="text-[8px] font-bold text-slate-400">Inventory Verified</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </DashboardLayout>
    );
}
