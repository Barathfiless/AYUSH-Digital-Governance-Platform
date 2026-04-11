import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Bell, Calendar, ChevronRight, Info, AlertCircle, Bookmark, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const notifications = [
    {
        id: 1,
        category: 'Circular',
        title: 'Amendment in Rule 158-B of Drugs and Cosmetics Rules',
        date: 'Oct 24, 2024',
        content: 'The Ministry of Ayush has notified amendments regarding the shelf life and requirements for licensing of proprietary medicines.',
        isNew: true,
        priority: 'High'
    },
    {
        id: 2,
        category: 'Notification',
        title: 'Extension for GMP Certification Renewal',
        date: 'Oct 15, 2024',
        content: 'Due to the recent portal maintenance, the deadline for submitting GMP renewal applications has been extended by 30 days.',
        isNew: false,
        priority: 'Medium'
    },
    {
        id: 3,
        category: 'Guidelines',
        title: 'Advisory on Export of ASU Drugs to EU Markets',
        date: 'Oct 02, 2024',
        content: 'New quality standards have been established for the export of herbal products to European Union member nations.',
        isNew: false,
        priority: 'Low'
    },
    {
        id: 4,
        category: 'Announcement',
        title: 'Launch of Online Query Management System',
        date: 'Sep 28, 2024',
        content: 'License applicants can now track their queries and submit clarifications through the new dashboard module.',
        isNew: false,
        priority: 'High'
    },
];

export default function Notifications() {
    usePageTitle('Notifications');

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 bg-white border-b border-slate-100">
                <div className="container-wide px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-4">
                                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
                                    <Bell className="w-8 h-8" />
                                </div>
                                Notification Hub
                            </h1>
                            <p className="mt-4 text-slate-500 text-lg max-w-xl">
                                Stay updated with the latest circulars, gazette notifications, and advisories from the Ministry of Ayush.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="px-4 py-1.5 border-slate-200 text-slate-600 bg-white">
                                All Categories
                            </Badge>
                            <Badge variant="outline" className="px-4 py-1.5 border-slate-200 text-slate-600 bg-white">
                                Last 30 Days
                            </Badge>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <main className="flex-grow py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-6">
                        {notifications.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                            >
                                <Card className={`overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 ${item.isNew ? 'ring-1 ring-blue-500/20' : ''
                                    }`}>
                                    <CardContent className="p-0">
                                        <div className="flex flex-col sm:flex-row">
                                            {/* Priority Strip */}
                                            <div className={`w-1 sm:w-1.5 shrink-0 ${item.priority === 'High' ? 'bg-red-500' :
                                                    item.priority === 'Medium' ? 'bg-orange-400' : 'bg-blue-400'
                                                }`} />

                                            <div className="p-6 flex-grow">
                                                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
                                                            {item.category}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                                                            <Calendar className="w-4 h-4" />
                                                            {item.date}
                                                        </div>
                                                    </div>
                                                    {item.isNew && (
                                                        <Badge className="bg-blue-600 hover:bg-blue-700 animate-pulse">New</Badge>
                                                    )}
                                                </div>

                                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors cursor-pointer">
                                                    {item.title}
                                                </h3>
                                                <p className="text-slate-600 leading-relaxed mb-6">
                                                    {item.content}
                                                </p>

                                                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                                    <button className="text-blue-600 font-semibold text-sm flex items-center gap-1 hover:translate-x-1 transition-transform">
                                                        Read Full Document <ChevronRight className="w-4 h-4" />
                                                    </button>

                                                    <div className="flex items-center gap-4 text-slate-300">
                                                        <button className="hover:text-amber-500 transition-colors" title="Bookmark">
                                                            <Bookmark className="w-5 h-5" />
                                                        </button>
                                                        <button className="hover:text-blue-500 transition-colors" title="Share">
                                                            <Share2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Help Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-12 p-8 rounded-2xl bg-[#002b5b] text-white flex flex-col md:flex-row items-center gap-8 shadow-xl"
                    >
                        <div className="p-4 bg-white/10 rounded-full">
                            <Info className="w-10 h-10 text-blue-200" />
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="text-xl font-bold mb-2">Subscribe to Newsletters</h4>
                            <p className="text-blue-100 opacity-80 mb-0">
                                Get real-time alerts for new notifications directly in your inbox. Stay ahead of compliance.
                            </p>
                        </div>
                        <button className="whitespace-nowrap px-8 py-3 bg-white text-[#002b5b] font-bold rounded-xl hover:bg-blue-50 transition-all shrink-0">
                            Subscribe Now
                        </button>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
