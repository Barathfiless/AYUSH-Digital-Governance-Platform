import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { usePageTitle } from '@/hooks/usePageTitle';
import { BarChart3, Loader2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep", "Delhi", "Puducherry", "Jammu and Kashmir", "Ladakh"
];

interface StateData {
    state: string;
    licenses: number;
    retailers: number;
    status: string;
}

export default function StateStatistics() {
    usePageTitle('State Statistics');
    const [stateWiseData, setStateWiseData] = useState<StateData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedState, setSelectedState] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/applications/state-wise');
                if (response.ok) {
                    const data = await response.json();
                    setStateWiseData(data);
                }
            } catch (error) {
                console.error("Failed to fetch state-wise stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const filteredData = stateWiseData.filter(item => {
        const matchesSearch = item.state.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        const matchesState = selectedState === 'all' || item.state.toLowerCase() === selectedState.toLowerCase().replace(/\s+/g, '-');
        return matchesSearch && matchesStatus && matchesState;
    });

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[300px] flex items-center pt-20 overflow-hidden bg-[#002b5b]">
                {/* Decorative Circles */}
                <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-[-20%] left-[-5%] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />

                <div className="container-wide relative z-10 px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ayush Industry Statistics
                        </h1>
                        <p className="text-blue-100 max-w-2xl text-lg opacity-90 leading-relaxed">
                            Comprehensive data and analytics regarding licensing, manufacturing units,
                            and market distribution across all Indian states and Union Territories.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <main className="flex-grow py-12 px-6">
                <div className="max-w-7xl mx-auto space-y-12">


                    {/* Tables and Detailed Sections */}
                    <div className="grid grid-cols-1 gap-8">
                        {/* State Table */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="w-full"
                        >
                            <Card className="border-none shadow-sm bg-white overflow-hidden">
                                <CardHeader className="border-b bg-gray-50/50">
                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl font-bold text-[#002b5b]">State-wise Distribution</CardTitle>
                                            {loading ? <Loader2 className="w-5 h-5 text-blue-600 animate-spin" /> : <BarChart3 className="w-5 h-5 text-gray-400" />}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    placeholder="Search stats..."
                                                    className="pl-9 bg-white"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </div>

                                            <Select value={selectedState} onValueChange={setSelectedState}>
                                                <SelectTrigger className="bg-white">
                                                    <SelectValue placeholder="All States" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All States</SelectItem>
                                                    {INDIAN_STATES.map(state => (
                                                        <SelectItem key={state} value={state.toLowerCase().replace(/\s+/g, '-')}>
                                                            {state}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                                <SelectTrigger className="bg-white">
                                                    <SelectValue placeholder="All Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Status</SelectItem>
                                                    <SelectItem value="High">High Activity</SelectItem>
                                                    <SelectItem value="Medium">Medium Activity</SelectItem>
                                                    <SelectItem value="Low">Low Activity</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-gray-50/50 text-gray-500 text-sm uppercase font-semibold">
                                                    <th className="px-6 py-4">State/UT</th>
                                                    <th className="px-6 py-4">Licenses</th>
                                                    <th className="px-6 py-4">Retailers</th>
                                                    <th className="px-6 py-4 text-right">Activity Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {loading ? (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                                            <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-blue-600" />
                                                            Fetching real-time data...
                                                        </td>
                                                    </tr>
                                                ) : filteredData.length > 0 ? (
                                                    filteredData.map((row) => (
                                                        <tr key={row.state} className="hover:bg-blue-50/30 transition-colors">
                                                            <td className="px-6 py-4 font-medium text-gray-800 capitalize">{row.state.replace(/-/g, ' ')}</td>
                                                            <td className="px-6 py-4 text-gray-600">{row.licenses}</td>
                                                            <td className="px-6 py-4 text-gray-600">{row.retailers}</td>
                                                            <td className="px-6 py-4 text-right">
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === 'High' ? 'bg-emerald-100 text-emerald-800' :
                                                                    row.status === 'Medium' ? 'bg-orange-100 text-orange-800' :
                                                                        'bg-slate-100 text-slate-600'
                                                                    }`}>
                                                                    {row.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                            No application data found in registry.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
