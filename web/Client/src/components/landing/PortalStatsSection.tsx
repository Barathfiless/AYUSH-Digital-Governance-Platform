import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface StatsData {
    approvedASU: number;
    approvedHomeo: number;
    portalApprovedLicenses: number;
    cancelledSuspended: number;
    totalApplications: number;
    portalPendingApplications: number;
}

// Animated number count-up hook
function useCountUp(target: number, duration = 1800, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start || target === 0) {
            setCount(target);
            return;
        }
        let startTime: number | null = null;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration, start]);
    return count;
}

function StatCard({
    label,
    value,
    suffix = '',
    image,
    gradient,
    index,
    animate,
    isLoading
}: {
    label: string;
    value: number;
    suffix?: string;
    image: string;
    gradient: string;
    index: number;
    animate: boolean;
    isLoading: boolean;
}) {
    const count = useCountUp(value, 1800, animate && !isLoading);

    return (
        <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`bg-gradient-to-br ${gradient} p-8 rounded-2xl text-white shadow-xl flex flex-col items-center text-center relative overflow-hidden group h-[220px] justify-center`}
        >
            <img
                src={image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 group-hover:scale-110 transition-transform duration-700"
            />

            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-28 h-12 bg-white/20 animate-pulse rounded-lg" />
                        <div className="w-36 h-4 bg-white/10 animate-pulse rounded" />
                    </div>
                ) : (
                    <>
                        <span className="text-5xl font-black mb-3 text-blue-100 drop-shadow-lg tracking-tighter">
                            {count.toLocaleString('en-IN')}{suffix}
                        </span>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed text-center px-4 opacity-70">
                            {label}
                        </h3>
                    </>
                )}
            </div>

            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
        </motion.div>
    );
}

export function PortalStatsSection() {
    const [statsData, setStatsData] = useState<StatsData>({
        approvedASU: 751,
        approvedHomeo: 350,
        portalApprovedLicenses: 0,
        cancelledSuspended: 0,
        totalApplications: 0,
        portalPendingApplications: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [animate, setAnimate] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            setHasError(false);
            try {
                const response = await fetch('/api/applications/stats');
                if (!response.ok) throw new Error('Failed to fetch');
                const data: StatsData = await response.json();
                setStatsData({
                    approvedASU: data.approvedASU ?? 751,
                    approvedHomeo: data.approvedHomeo ?? 350,
                    portalApprovedLicenses: data.portalApprovedLicenses ?? 0,
                    cancelledSuspended: data.cancelledSuspended ?? 0,
                    totalApplications: data.totalApplications ?? 0,
                    portalPendingApplications: data.portalPendingApplications ?? 0,
                });
            } catch (error) {
                console.error('Error fetching portal stats:', error);
                setHasError(true);
                // Fallback to known official figures
                setStatsData({
                    approvedASU: 751,
                    approvedHomeo: 350,
                    portalApprovedLicenses: 0,
                    cancelledSuspended: 0,
                    totalApplications: 0,
                    portalPendingApplications: 0,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();

        // Re-fetch every 60 seconds to stay live
        const interval = setInterval(fetchStats, 60000);
        return () => clearInterval(interval);
    }, []);

    // Trigger count-up animation when section comes into view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setAnimate(true); },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const stats = [
        {
            label: 'APPROVED MANUFACTURERS (ASU)',
            value: statsData.approvedASU,
            suffix: '+',
            image: 'https://images.unsplash.com/photo-1544367563-12123d832d34?auto=format&fit=crop&q=80&w=600',
            gradient: 'from-[#003366]/90 to-[#004d99]/90'
        },
        {
            label: 'APPROVED MANUFACTURERS (HOMOEOPATHY)',
            value: statsData.approvedHomeo,
            suffix: '+',
            image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=600',
            gradient: 'from-[#003366]/90 to-[#004d99]/90'
        },
        {
            label: 'APPROVED LICENSES (PORTAL)',
            value: statsData.portalApprovedLicenses,
            suffix: '',
            image: 'https://images.unsplash.com/photo-1627931383794-52d9a3b2b513?auto=format&fit=crop&q=80&w=600',
            gradient: 'from-[#003366]/90 to-[#004d99]/90'
        },
        {
            label: 'CANCELLED / SUSPENDED LICENSES',
            value: statsData.cancelledSuspended,
            suffix: '',
            image: 'https://images.unsplash.com/photo-1595166662758-a53ec8f67341?auto=format&fit=crop&q=80&w=600',
            gradient: 'from-[#003366]/90 to-[#004d99]/90'
        }
    ];

    return (
        <section ref={sectionRef} className="py-12 bg-white">
            <div className="container-wide">
                {/* Live data badge */}
                <div className="flex items-center justify-end px-4 mb-4">
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${hasError ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                        <span className={`w-2 h-2 rounded-full ${hasError ? 'bg-amber-500' : 'bg-green-500 animate-pulse'}`} />
                        {hasError ? 'Using Official Baseline Data' : isLoading ? 'Loading...' : 'Live Portal Data'}
                    </span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                    {stats.map((stat, index) => (
                        <StatCard
                            key={stat.label}
                            label={stat.label}
                            value={stat.value}
                            suffix={stat.suffix}
                            image={stat.image}
                            gradient={stat.gradient}
                            index={index}
                            animate={animate}
                            isLoading={isLoading}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
