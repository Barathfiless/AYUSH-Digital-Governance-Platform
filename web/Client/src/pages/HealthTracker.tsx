import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
    Activity,
    Heart,
    Zap,
    Wind,
    Droplets,
    Brain,
    Scale,
    Calendar,
    ArrowRight,
    Plus,
    TrendingUp,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function HealthTracker() {
    usePageTitle('Health Tracker');
    return (
        <DashboardLayout>
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-[#002b5b] mb-1">
                            Health <span className="text-blue-600">Tracker</span>
                        </h1>
                    </div>
                    <Button className="h-12 px-6 bg-[#002b5b] hover:bg-[#1a406d] rounded-2xl font-bold gap-2">
                        <Plus className="w-4 h-4" />
                        Log New Byte
                    </Button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-10">
                    {/* Left Column: Core Stats */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Daily Vitals Grid */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            {[
                                { label: 'Heart Rate', value: '--', unit: 'bpm', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
                                { label: 'Body Water', value: '--%', unit: 'level', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
                                { label: 'Stress Level', value: '--', unit: 'calc', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50' },
                                { label: 'Breathing Rate', value: '--', unit: 'bpm', icon: Wind, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                            ].map((vital, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-200 hover:shadow-md transition-all"
                                >
                                    <div>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{vital.label}</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-slate-800">{vital.value}</span>
                                            <span className="text-sm font-bold text-slate-400">{vital.unit}</span>
                                        </div>
                                    </div>
                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform", vital.bg, vital.color)}>
                                        <vital.icon className="w-7 h-7" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Prakriti Analysis Card */}
                        <div className="bg-gradient-to-br from-[#002b5b] to-[#1e3a8a] rounded-[40px] p-10 text-white relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                        <Activity className="w-6 h-6" />
                                    </div>
                                    <span className="text-sm font-black uppercase tracking-widest text-blue-200">AYURVEDA INSIGHTS</span>
                                </div>
                                <h2 className="text-4xl font-black mb-4">Your Prakriti: <span className="text-blue-300">Not Analyzed</span></h2>
                                <p className="text-blue-100 text-lg leading-relaxed max-w-xl mb-8">
                                    Take the Prakriti test to discover your unique Ayurvedic constitution and receive personalized wellness recommendations.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Button className="bg-white text-blue-900 hover:bg-white/90 rounded-2xl h-14 px-8 font-black text-lg">
                                        View Diet Plan
                                    </Button>
                                    <Button variant="ghost" className="text-blue-200 hover:text-white hover:bg-white/10 rounded-2xl h-14 px-8 font-bold border border-white/20">
                                        Retake Prakriti Test
                                    </Button>
                                </div>
                            </div>
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                        </div>
                    </div>

                    {/* Right Column: Weight & Challenges */}
                    <div className="space-y-8">
                        {/* Weight Tracker Card */}
                        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-slate-800">Body Weight</h3>
                                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
                                    <TrendingUp className="w-3 h-3" />
                                    -1.2 kg
                                </div>
                            </div>
                            <div className="flex items-baseline justify-center gap-2 mb-8">
                                <span className="text-6xl font-black text-[#002b5b]">--</span>
                                <span className="text-xl font-bold text-slate-400">kg</span>
                            </div>
                            <div className="grid grid-cols-7 gap-1 h-32 items-end mb-8 px-2">
                                {[0, 0, 0, 0, 0, 0, 0].map((h, i) => (
                                    <div key={i} className="bg-slate-100 rounded-t-lg hover:bg-blue-600 transition-all cursor-pointer" style={{ height: `10%` }}></div>
                                ))}
                            </div>
                            <Button className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-900 font-bold border-none transition-all active:scale-95">
                                Update Measurement
                            </Button>
                        </div>

                        {/* Recent Goals */}
                        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">Daily Milestones</h3>
                            <div className="space-y-4">
                                <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Active Milestones</p>
                                </div>
                            </div>
                            <Button variant="ghost" className="w-full mt-6 text-blue-600 font-bold hover:bg-blue-50">
                                Edit All Goals
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Banner: Health Tips */}
                <div className="p-8 bg-emerald-50 rounded-[32px] border border-emerald-100 flex flex-col md:flex-row items-center gap-8 group cursor-pointer hover:bg-emerald-100/50 transition-all">
                    <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 shrink-0">
                        <Zap className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-xl font-bold text-emerald-900 mb-1">Weekly Health Byte</h4>
                        <p className="text-emerald-700 text-sm font-medium">Include Ashwagandha in your evening routine for better sleep quality and reduced cortisol levels.</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-emerald-600 group-hover:translate-x-2 transition-transform" />
                </div>
            </div>
        </DashboardLayout>
    );
}
