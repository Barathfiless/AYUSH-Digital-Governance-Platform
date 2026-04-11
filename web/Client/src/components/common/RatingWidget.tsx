import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, CheckCircle, RefreshCw, Sparkles } from 'lucide-react';

interface RatingWidgetProps {
    userId: string;
    userName: string;
    userRole?: string;
    userCompany?: string;
    /** Called after a review is successfully saved */
    onDismiss: () => void;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hovered, setHovered] = useState(0);
    const display = hovered || value;
    const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        className="transition-transform hover:scale-120 focus:outline-none"
                        style={{ transform: hovered === star ? 'scale(1.2)' : 'scale(1)' }}
                    >
                        <Star
                            className={`w-9 h-9 transition-all duration-150 ${star <= display
                                ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                                : 'fill-gray-200 text-gray-200'
                                }`}
                        />
                    </button>
                ))}
            </div>
            <span
                className={`text-sm font-bold transition-all duration-200 ${display ? 'text-amber-500 opacity-100' : 'opacity-0'}`}
            >
                {labels[display]}
            </span>
        </div>
    );
}

export function RatingWidget({ userId, userName, userRole = '', userCompany = '', onDismiss }: RatingWidgetProps) {
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (reviewText.trim().length < 10) {
            setError('Please write at least 10 characters.');
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    rating,
                    review: reviewText.trim(),
                    userRole,
                    userCompany,
                }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || 'Failed to submit');
            setDone(true);
            // Auto-dismiss after 2.5s
            setTimeout(onDismiss, 2500);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            className="relative bg-white rounded-2xl border border-blue-100 shadow-xl overflow-hidden"
        >
            {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-[#002b5b] via-blue-500 to-amber-400" />

            {/* Dismiss button */}
            <button
                onClick={onDismiss}
                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 z-10"
                title="Dismiss"
            >
                <X className="w-4 h-4" />
            </button>

            <div className="p-6">
                <AnimatePresence mode="wait">
                    {done ? (
                        <motion.div
                            key="done"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center text-center py-4 gap-3"
                        >
                            <CheckCircle className="w-14 h-14 text-green-500" />
                            <p className="text-lg font-black text-[#002b5b]">Thank you, {userName.split(' ')[0]}! 🎉</p>
                            <p className="text-sm text-gray-400">Your feedback shapes the AYUSH portal for everyone.</p>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            {/* Header */}
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
                                    <Sparkles className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="font-black text-[#002b5b] text-base leading-tight">
                                        How was your experience?
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Your application was approved — share your journey!
                                    </p>
                                </div>
                            </div>

                            {/* Star Rating */}
                            <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100/50">
                                <StarPicker value={rating} onChange={setRating} />
                            </div>

                            {/* Review Text */}
                            <div>
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Tell others what made your experience great (or what could be improved)..."
                                    maxLength={500}
                                    rows={3}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#002b5b]/20 focus:border-[#002b5b] resize-none transition placeholder:text-gray-300"
                                />
                                <p className="text-[10px] text-gray-300 text-right -mt-1">{reviewText.length}/500</p>
                            </div>

                            {error && (
                                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                            )}

                            <div className="flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-2.5 bg-[#002b5b] text-white text-sm font-bold rounded-xl hover:bg-[#003d82] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-md"
                                >
                                    {submitting
                                        ? <><RefreshCw className="w-4 h-4 animate-spin" /> Submitting...</>
                                        : <><CheckCircle className="w-4 h-4" /> Submit Rating</>
                                    }
                                </button>
                                <button
                                    type="button"
                                    onClick={onDismiss}
                                    className="px-4 py-2.5 text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors"
                                >
                                    Later
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
