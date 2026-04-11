import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Bookmark, ChevronRight, ExternalLink, RefreshCw } from 'lucide-react';

interface Update {
    _id: string;
    companyName: string;
    status: string;
    submittedAt: string;
    applicationId?: string;
}

const relatedLinks = [
    {
        title: 'Ayusoft – AYUSH Software Portal',
        url: 'https://ayusoft.ayush.gov.in/',
        day: '27',
        month: 'Jan 2025'
    },
    {
        title: 'AYUSH Research Portal',
        url: 'https://ayushresearch.gov.in/',
        day: '27',
        month: 'Jan 2025'
    },
    {
        title: 'MAISP – My Ayush Integrated Services Portal',
        url: 'https://maisp.gov.in/',
        day: '27',
        month: 'Jan 2025'
    },
    {
        title: 'Ministry of AYUSH – Official Website',
        url: 'https://www.ayush.gov.in/',
        day: '15',
        month: 'Feb 2025'
    },
    {
        title: 'National AYUSH Mission',
        url: 'https://nam.gov.in/',
        day: '10',
        month: 'Feb 2025'
    }
];

const STATUS_LABELS: Record<string, string> = {
    Approved: 'License Approved',
    SiteInspection: 'Site Inspection Scheduled',
    Rejected: 'Application Rejected',
    Pending: 'Application Submitted',
};

const STATUS_COLORS: Record<string, string> = {
    Approved: 'bg-green-100 text-green-700',
    SiteInspection: 'bg-blue-100 text-blue-700',
    Rejected: 'bg-red-100 text-red-700',
    Pending: 'bg-amber-100 text-amber-700',
};

function formatDate(iso: string) {
    const d = new Date(iso);
    return {
        day: d.getDate().toString().padStart(2, '0'),
        month: d.toLocaleString('en-IN', { month: 'short', year: 'numeric' })
    };
}

export function UpdatesAndLinksSection() {
    const [updates, setUpdates] = useState<Update[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

    const fetchUpdates = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/applications/all');
            if (!res.ok) throw new Error('Failed');
            const data: Update[] = await res.json();
            // Show the 5 most recent status-changed apps
            const sorted = data
                .filter((app) => app.status !== 'Pending' || app.applicationId)
                .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                .slice(0, 5);
            setUpdates(sorted);
            setLastRefresh(new Date());
        } catch {
            setUpdates([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUpdates();
        const interval = setInterval(fetchUpdates, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-12 bg-[#f8fafc]">
            <div className="container-wide px-4">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

                    {/* Latest Updates Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col rounded-xl overflow-hidden shadow-sm border border-gray-100 h-full bg-white"
                    >
                        <div className="bg-[#002b5b] p-4 flex items-center justify-between gap-3 text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                    <Bell className="w-4 h-4" />
                                </div>
                                <h2 className="font-bold text-lg">Latest Updates</h2>
                            </div>
                            <button
                                onClick={fetchUpdates}
                                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        <div className="flex-1 divide-y divide-gray-50">
                            {isLoading ? (
                                [...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                                        <div className="w-14 h-12 bg-gray-100 rounded shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 bg-gray-100 rounded w-3/4" />
                                            <div className="h-3 bg-gray-100 rounded w-1/2" />
                                        </div>
                                    </div>
                                ))
                            ) : updates.length === 0 ? (
                                <div className="p-8 flex flex-col items-center justify-center text-center h-full">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                        <Bell className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-gray-400 text-sm">No updates available yet.</p>
                                    <p className="text-gray-300 text-xs mt-1">Updates appear when applications are processed.</p>
                                </div>
                            ) : (
                                updates.map((update) => {
                                    const { day, month } = formatDate(update.submittedAt);
                                    return (
                                        <div key={update._id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                                            <div className="shrink-0 w-14 h-12 bg-[#002b5b] rounded text-white flex flex-col items-center justify-center">
                                                <span className="text-base font-bold leading-none">{day}</span>
                                                <span className="text-[9px] opacity-80 uppercase mt-0.5">{month}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[#002b5b] font-semibold text-sm truncate">{update.companyName}</p>
                                                <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[update.status] || 'bg-gray-100 text-gray-600'}`}>
                                                    {STATUS_LABELS[update.status] ?? update.status}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="p-4 bg-[#f1f5f9] flex items-center justify-between border-t border-gray-100">
                            <span className="text-[10px] text-gray-400">
                                Last updated: {lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <button className="flex items-center gap-2 px-6 py-2 bg-[#8eb7e3] text-[#002b5b] font-bold text-xs rounded-md shadow-sm hover:bg-[#7da8d4] transition-colors">
                                View All <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Related Links Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col rounded-xl overflow-hidden shadow-sm border border-gray-100 h-full bg-white"
                    >
                        <div className="bg-[#002b5b] p-4 flex items-center gap-3 text-white">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                <Bookmark className="w-4 h-4" />
                            </div>
                            <h2 className="font-bold text-lg">Related Links</h2>
                        </div>

                        <div className="p-6 flex-1 space-y-3">
                            {relatedLinks.map((link, i) => (
                                <a
                                    key={i}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-4 p-4 rounded-lg bg-white hover:bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all shadow-sm"
                                >
                                    <div className="shrink-0 w-16 h-14 bg-[#002b5b] rounded text-white flex flex-col items-center justify-center p-2">
                                        <span className="text-lg font-bold leading-none">{link.day}</span>
                                        <span className="text-[10px] font-medium opacity-80 uppercase mt-1">{link.month}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[#002b5b] font-bold text-sm group-hover:underline leading-tight">
                                            {link.title}
                                        </h4>
                                        <p className="text-xs text-gray-400 mt-1 truncate">{link.url}</p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-[#002b5b] transition-colors shrink-0" />
                                </a>
                            ))}
                        </div>

                        <div className="p-4 bg-[#f1f5f9] flex justify-center border-t border-gray-100">
                            <a
                                href="https://www.ayush.gov.in/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-2 bg-[#8eb7e3] text-[#002b5b] font-bold text-xs rounded-md shadow-sm hover:bg-[#7da8d4] transition-colors"
                            >
                                View All <ChevronRight className="w-4 h-4" />
                            </a>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
