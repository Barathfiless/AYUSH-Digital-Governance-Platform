import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { usePageTitle } from '@/hooks/usePageTitle';
import { FileText, Download, Scale, ExternalLink, ShieldCheck, Loader2, Radio } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Act {
    title: string;
    description: string;
    tag: string;
    date: string;
    url?: string;
}

export default function ActsAndRules() {
    usePageTitle('Acts & Rules');
    const [acts, setActs] = useState<Act[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActs = async () => {
            try {
                const response = await fetch('/api/acts');
                if (response.ok) {
                    const data = await response.json();
                    setActs(data);
                }
            } catch (error) {
                console.error("Failed to fetch acts/rules", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActs();
    }, []);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[#002b5b]/5 origin-top-right -skew-x-12" />

                <div className="container-wide relative z-10 px-6">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <h1 className="text-4xl md:text-6xl font-extrabold text-[#002b5b] mb-6 leading-tight">
                                Legal Framework of <span className="text-blue-600">Ayush Licensing</span>
                            </h1>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                    <Radio className="w-3 h-3" />
                                    Live Feed
                                </div>
                                <span className="text-sm font-medium text-slate-400">Synchronized with Ministry of Ayush Registry</span>
                            </div>
                            <p className="text-gray-600 text-xl leading-relaxed">
                                Official repository of Acts, Rules, and Regulations governing the manufacture,
                                testing, and sale of ASU&H drugs in India.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="flex-grow py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {loading ? (
                            <div className="col-span-1 md:col-span-2 py-20 text-center">
                                <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-600 opacity-20" />
                                <p className="text-slate-400 font-medium tracking-wide">Fetching latest legal updates from Ministry of Ayush...</p>
                            </div>
                        ) : acts.length > 0 ? (
                            acts.map((act, idx) => (
                                <motion.div
                                    key={act.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                >
                                    <Card className="group border-2 border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300">
                                        <CardContent className="p-8">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="p-3 bg-slate-100 text-slate-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    <Scale className="w-6 h-6" />
                                                </div>
                                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 py-1 px-3 border border-slate-100 rounded-full">
                                                    {act.tag}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-[#002b5b] mb-3 group-hover:text-blue-700 transition-colors">
                                                {act.title}
                                            </h3>
                                            <p className="text-gray-500 mb-6 line-clamp-3">
                                                {act.description}
                                            </p>
                                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                                <span className="text-sm font-medium text-slate-400">Year: {act.date}</span>
                                                <div className="flex gap-3">
                                                    <a
                                                        href={act.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                                                        title="View Source"
                                                    >
                                                        <ExternalLink className="w-5 h-5" />
                                                    </a>
                                                    <a
                                                        href={act.url}
                                                        download
                                                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                                                        title="Download Official PDF"
                                                    >
                                                        <Download className="w-5 h-5" />
                                                    </a>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-1 md:col-span-2 py-20 text-center">
                                <FileText className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                                <p className="text-slate-400">No official acts or rules found in the registry.</p>
                            </div>
                        )}
                    </div>

                    {/* Compliance Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-20 p-10 rounded-3xl bg-gradient-to-br from-[#002b5b] to-[#014d9e] text-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <ShieldCheck className="w-64 h-64" />
                        </div>
                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-3xl font-bold mb-4">Compliance is Mandatory</h2>
                            <p className="text-blue-100 mb-8 text-lg">
                                As per the Drugs & Cosmetics Act, any entity involved in manufacturing or distribution
                                must adhere to the standardized Good Manufacturing Practices (GMP). Failure to comply
                                may result in immediate cancellation of license.
                            </p>
                            <div className="flex items-center gap-6">
                                <Button className="bg-white text-[#002b5b] hover:bg-blue-50 font-bold px-8">
                                    Get Legal Advice
                                </Button>
                                <a href="#" className="flex items-center gap-2 text-white font-medium hover:underline">
                                    <FileText className="w-4 h-4" />
                                    View Penalties
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
