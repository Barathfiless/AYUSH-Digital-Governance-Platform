import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Star, Quote, TrendingUp, RefreshCw } from 'lucide-react';

interface Review {
  _id: string;
  userName: string;
  userRole: string;
  userCompany: string;
  rating: number;
  review: string;
  createdAt: string;
}

interface StatsData {
  reviews: Review[];
  totalRatings: number;
  avgRating: number;
  distribution: { star: number; count: number }[];
}

function StarDisplay({ value, size = 'md' }: { value: number; size?: 'sm' | 'md' }) {
  const cls = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${cls} ${star <= value ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
        />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="relative bg-card rounded-2xl p-8 shadow-md border border-border animate-pulse">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => <div key={i} className="w-5 h-5 bg-gray-200 rounded-full" />)}
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-3 bg-gray-100 rounded w-3/4" />
      </div>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gray-200" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-28" />
          <div className="h-2 bg-gray-100 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColor(name: string) {
  const colors = ['#002b5b', '#0d6efd', '#198754', '#6f42c1', '#0dcaf0', '#dc3545', '#fd7e14'];
  let hash = 0;
  for (const c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export function TestimonialsSection() {
  const { t } = useTranslation();
  const [data, setData] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/reviews?limit=6');
      if (!res.ok) throw new Error('Failed');
      const json: StatsData = await res.json();
      setData(json);
    } catch {
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // Refresh every 2 minutes to pick up new reviews
    const interval = setInterval(fetchReviews, 120000);
    return () => clearInterval(interval);
  }, []);

  // Trigger animations when section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const reviews = data?.reviews ?? [];

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-background">
      <div className="container-wide">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-6"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        {/* Aggregate Rating Summary */}
        {data && data.totalRatings > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={animate ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10 bg-[#f0f6ff] rounded-2xl py-5 px-8 max-w-2xl mx-auto border border-blue-100"
          >
            {/* Avg score */}
            <div className="flex flex-col items-center">
              <span className="text-5xl font-black text-[#002b5b]">{data.avgRating}</span>
              <StarDisplay value={Math.round(data.avgRating)} />
              <span className="text-xs text-gray-500 mt-1">
                {data.totalRatings} {data.totalRatings === 1 ? 'review' : 'reviews'}
              </span>
            </div>

            {/* Distribution bars */}
            <div className="flex flex-col gap-1.5 flex-1 w-full min-w-[160px]">
              {data.distribution.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs w-3 text-gray-500 font-medium">{star}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-amber-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={animate ? { width: data.totalRatings ? `${(count / data.totalRatings) * 100}%` : '0%' } : { width: 0 }}
                      transition={{ duration: 0.8, delay: (5 - star) * 0.08 }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-4">{count}</span>
                </div>
              ))}
            </div>

            {/* Live badge */}
            <div className="flex flex-col items-center gap-1">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-xs text-green-600 font-semibold">Live</span>
            </div>
          </motion.div>
        )}

        {/* Status row */}
        <div className="flex items-center justify-between mb-8 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-400 font-medium">
              {isLoading
                ? 'Loading...'
                : `${reviews.length} user ${reviews.length === 1 ? 'review' : 'reviews'} from the portal`}
            </span>
          </div>
          <button
            onClick={fetchReviews}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
          ) : reviews.length === 0 ? (
            <div className="col-span-full py-16 flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Quote className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">No reviews yet.</p>
              <p className="text-gray-300 text-sm">
                Reviews from verified portal users will appear here.
              </p>
            </div>
          ) : (
            reviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="relative bg-card rounded-2xl p-8 shadow-md border border-border hover:shadow-lg transition-shadow"
              >
                {/* Quote icon */}
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow">
                  <Quote className="w-5 h-5 text-primary-foreground" />
                </div>

                {/* Stars */}
                <div className="mb-4">
                  <StarDisplay value={review.rating} />
                </div>

                {/* Review text */}
                <p className="text-foreground leading-relaxed mb-6 text-sm">
                  &ldquo;{review.review}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md"
                    style={{ backgroundColor: getAvatarColor(review.userName) }}
                  >
                    {getInitials(review.userName)}
                  </div>
                  <div>
                    <p className="font-bold text-foreground leading-tight">{review.userName}</p>
                    {(review.userRole || review.userCompany) && (
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-0.5">
                        {[review.userRole, review.userCompany].filter(Boolean).join(', ')}
                      </p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Footer nudge for non-logged-in visitors */}
        {!isLoading && reviews.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-8">
            Reviews are collected from verified users after their application is approved on the AYUSH portal.
          </p>
        )}
      </div>
    </section>
  );
}
