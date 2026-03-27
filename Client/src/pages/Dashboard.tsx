import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RatingWidget } from '@/components/common/RatingWidget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Bell,
  TrendingUp,
  Search,
  Activity,
  Building2,
  Calendar,
  Package,
  ShoppingBag,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useTranslation } from 'react-i18next';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';

export default function Dashboard() {
  usePageTitle('Dashboard');
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRating, setShowRating] = useState(false);

  const userData = JSON.parse(sessionStorage.getItem('user') || '{}') || {};
  const userId = userData?._id || userData?.id;

  // Real-time SSE notifications (replaces polling)
  useRealtimeNotifications(userId, () => {
    // Re-fetch applications when a status update arrives
    if (userId) {
      fetch(`/api/applications/user/${userId}`)
        .then(r => r.json())
        .then(data => { if (Array.isArray(data)) setApplications(data); })
        .catch(() => {});
    }
  });

  useEffect(() => {
    const fetchUserApplications = async () => {
      const userId = userData?._id || userData?.id;
      if (!userId) return;
      try {
        const response = await fetch(`/api/applications/user/${userId}`);
        const data = await response.json();
        if (response.ok) {
          setApplications(data);
          // Show rating prompt if user has ≥1 approved app and hasn't rated yet
          const hasApproved = data.some((app: any) => app.status === 'Approved');
          if (hasApproved) {
            const alreadyDismissed = sessionStorage.getItem('rating_dismissed') === 'true';
            if (!alreadyDismissed) {
              // Check if they already submitted a review
              const reviewRes = await fetch(`/api/reviews?limit=100`);
              const reviewJson = await reviewRes.json();
              const alreadyReviewed = reviewJson.reviews?.some(
                (r: any) => r.userId === userId || r.userId === userData?._id
              );
              if (!alreadyReviewed) setShowRating(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user applications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserApplications();
  }, [userData?._id, userData?.id]);

  const [currentSlide, setCurrentSlide] = useState(0);

  const customerSlides = [
    {
      id: 1,
      title: "Welcome to AYUSH Digital Bazaar",
      description: "Your gateway to verified AYUSH healthcare products.",
      icon: ShoppingBag,
      image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "100% Certified Products",
      description: "Everything you see has been thoroughly vetted and approved by our AYUSH officers.",
      icon: ShieldCheck,
      image: "https://images.unsplash.com/photo-1611078864770-4cc813d10f8b?q=80&w=1200&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Direct from verified startups",
      description: "Discover innovative healthcare solutions right from the source, shipped directly to you.",
      icon: Package,
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    if (userData?.role === 'customer') {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % customerSlides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [userData?.role]);

  // Stats — defined inside component so t() re-evaluates on language change
  const stats = [
    { label: t('dashboard.activeLicenses'), value: applications.filter(a => a.status === 'Approved').length.toString(), icon: FileText, color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { label: t('dashboard.productApprovals'), value: applications.reduce((acc, a) => acc + (a.status === 'Approved' ? a.products.length : 0), 0).toString(), icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { label: t('dashboard.pendingReview'), value: applications.filter(a => a.status === 'Pending').length.toString(), icon: Clock, color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { label: t('dashboard.rejected'), value: applications.filter(a => a.status === 'Rejected').length.toString(), icon: AlertCircle, color: 'bg-rose-50 text-rose-600 border-rose-100' },
  ];

  const handleDismissRating = () => {
    setShowRating(false);
    sessionStorage.setItem('rating_dismissed', 'true');
  };

  return (
    <DashboardLayout>
      {userData?.role !== 'customer' ? (
        <>
          {/* In-app Rating Prompt — shown contextually after app approval */}
          <AnimatePresence>
            {showRating && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 max-w-xl"
              >
                <RatingWidget
                  userId={userData?._id || userData?.id || ''}
                  userName={userData?.name || 'User'}
                  userRole={userData?.role || ''}
                  userCompany={applications.find((a: any) => a.status === 'Approved')?.companyName || ''}
                  onDismiss={handleDismissRating}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-[#002b5b]">
                {t('dashboard.welcomeTitle')} <span className="text-blue-600 font-extrabold underline decoration-blue-500/30">{t('dashboard.portalName')}</span>
              </h1>
              <div className="flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-lg border border-blue-100 shadow-sm px-3">
                  <span className="text-xs font-medium text-blue-600">{t('dashboard.sessionActive')}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl p-5 border ${stat.color} shadow-sm transition-all hover:shadow-md hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.color.split(' ')[0]} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-slate-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  <p className="text-xs font-medium text-slate-500 mt-1">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-6">
            {/* Main Content - Applications */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {[
                  { to: '/apply', label: t('dashboard.quickLicense'), icon: Plus, color: 'bg-amber-600', hover: 'hover:bg-amber-700' },
                  { to: '/track', label: t('dashboard.quickTrack'), icon: TrendingUp, color: 'bg-indigo-600', hover: 'hover:bg-indigo-700' },
                  { to: '/inventory', label: t('sidebar.warehouse'), icon: Package, color: 'bg-teal-600', hover: 'hover:bg-teal-700' },
                  { to: '/documents', label: t('sidebar.certifications'), icon: FileText, color: 'bg-violet-600', hover: 'hover:bg-violet-700' },
                ].map((action) => (
                  <Link
                    key={action.label}
                    to={action.to}
                    className={`flex flex-col items-center justify-center p-6 bg-white rounded-[24px] border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:border-blue-100 group`}
                  >
                    <div className={`w-12 h-12 rounded-2xl ${action.color} text-white flex items-center justify-center mb-4 shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                      {(() => {
                        const Icon = action.icon;
                        return <Icon className="w-6 h-6" />;
                      })()}
                    </div>
                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{action.label}</span>
                  </Link>
                ))}
              </motion.div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center min-h-[70vh]">
          <div className="relative w-full overflow-hidden bg-slate-900 group">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 flex via-slate-900/60 to-transparent z-10" />

            <AnimatePresence mode="popLayout">
              <motion.img
                key={currentSlide}
                src={customerSlides[currentSlide].image}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full h-[600px] object-cover"
                alt="Slide"
              />
            </AnimatePresence>

            <div className="absolute inset-x-0 bottom-0 p-8 md:p-16 z-20 flex flex-col items-center text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
                    {(() => {
                      const Icon = customerSlides[currentSlide].icon;
                      return <Icon className="w-10 h-10 text-white drop-shadow-md" />;
                    })()}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 drop-shadow-2xl">
                    {customerSlides[currentSlide].title}
                  </h1>
                  <p className="text-white/90 text-sm md:text-base font-medium mb-10 max-w-xl drop-shadow-md tracking-wider">
                    {customerSlides[currentSlide].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={() => navigate('/stores')} className="bg-white text-[#002b5b] hover:bg-slate-100 rounded-xl px-10 h-14 font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105">
                  Shop Now
                </Button>
                <Button onClick={() => navigate('/orders')} variant="outline" className="rounded-xl px-10 h-14 font-bold uppercase tracking-widest text-white border-white/30 hover:bg-white/20 backdrop-blur-md transition-all hover:scale-105">
                  My Orders
                </Button>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="absolute bottom-8 right-8 z-30 flex gap-2">
              {customerSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 shadow-xl ${currentSlide === idx ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + customerSlides.length) % customerSlides.length)}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % customerSlides.length)}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
