import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, ShoppingBag, BookOpen, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    products?: any[];
    highlights?: string[];
    confidence?: string;
    source?: string;
}

const QUICK_QUESTIONS = [
    "What helps with joint pain?",
    "Best products for immunity",
    "Herbs for stress and sleep",
    "What is AYUSH certified?",
];

export function AyushAdvisor() {
    const location = useLocation();
    const isOfficerPortal = /^\/officer/.test(location.pathname);

    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '0',
            role: 'assistant',
            text: "Namaste! 🙏 I'm your AI-powered AYUSH Wellness Advisor. I use a local knowledge base of certified products and AYUSH guidelines to help you. Ask me about products, herbs, or AYUSH licensing!",
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [ragStatus, setRagStatus] = useState<'online' | 'offline' | 'checking'>('checking');
    const bottomRef = useRef<HTMLDivElement>(null);

    // Check RAG service status
    useEffect(() => {
        fetch('/api/rag/status')
            .then(r => r.json())
            .then(d => setRagStatus(d.status === 'online' ? 'online' : 'offline'))
            .catch(() => setRagStatus('offline'));
    }, [isOpen]);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    if (isOfficerPortal) return null;

    const sendMessage = async (text?: string) => {
        const userText = (text || query).trim();
        if (!userText) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };
        setMessages(prev => [...prev, userMsg]);
        setQuery('');
        setLoading(true);

        try {
            const res = await fetch('/api/rag/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userText })
            });
            const data = await res.json();

            const botMsg: Message = {
                id: Date.now().toString() + '_bot',
                role: 'assistant',
                text: data.answer || "I couldn't find a specific answer. Try rephrasing.",
                products: data.products,
                highlights: data.highlights,
                confidence: data.confidence,
                source: data.source
            };
            setMessages(prev => [...prev, botMsg]);
        } catch {
            setMessages(prev => [...prev, {
                id: Date.now().toString() + '_err',
                role: 'assistant',
                text: "RAG service is offline. Please start the Python service: `python rag/rag_service.py`"
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(o => !o)}
                className={cn(
                    "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110",
                    "bg-gradient-to-br from-purple-600 to-indigo-700"
                )}
                title="AYUSH AI Advisor"
            >
                <AnimatePresence mode="wait">
                    {isOpen
                        ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X className="w-6 h-6 text-white" /></motion.div>
                        : <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Bot className="w-6 h-6 text-white" /></motion.div>
                    }
                </AnimatePresence>
                {ragStatus === 'online' && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
                )}
            </button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-96 max-h-[600px] bg-white rounded-3xl shadow-2xl border border-purple-100 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-5 py-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="font-black text-white text-sm tracking-wide">AYUSH AI Advisor</p>
                                <p className="text-white/70 text-[10px] font-medium">
                                    {ragStatus === 'online'
                                        ? '🟢 RAG Engine Online · No API needed'
                                        : ragStatus === 'offline'
                                            ? '🔴 Start rag_service.py'
                                            : '⏳ Connecting...'}
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                            {messages.map(msg => (
                                <div key={msg.id} className={cn("flex gap-2", msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                                    {/* Avatar */}
                                    <div className={cn(
                                        "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
                                        msg.role === 'assistant'
                                            ? "bg-gradient-to-br from-purple-100 to-indigo-100"
                                            : "bg-gradient-to-br from-slate-100 to-slate-200"
                                    )}>
                                        {msg.role === 'assistant'
                                            ? <Bot className="w-4 h-4 text-purple-600" />
                                            : <User className="w-4 h-4 text-slate-500" />
                                        }
                                    </div>

                                    {/* Bubble */}
                                    <div className={cn(
                                        "max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                                        msg.role === 'assistant'
                                            ? "bg-gradient-to-br from-purple-50 to-indigo-50 text-slate-800 border border-purple-100"
                                            : "bg-purple-600 text-white"
                                    )}>
                                        <p>{msg.text}</p>

                                        {/* Source badge */}
                                        {msg.source && (
                                            <p className="text-[9px] text-purple-400 mt-1 font-semibold uppercase tracking-widest">
                                                {msg.source}
                                            </p>
                                        )}

                                        {/* Product cards */}
                                        {msg.products && msg.products.length > 0 && (
                                            <div className="mt-2 space-y-1.5">
                                                {msg.products.slice(0, 3).map((p, i) => (
                                                    <a
                                                        key={i}
                                                        href={`/products/${p.id}`}
                                                        className="flex items-center gap-2 bg-white rounded-xl px-2.5 py-1.5 border border-purple-100 hover:shadow-md hover:border-purple-200 transition-all"
                                                    >
                                                        <ShoppingBag className="w-3 h-3 text-purple-500 flex-shrink-0" />
                                                        <div className="min-w-0">
                                                            <p className="text-[11px] font-black text-slate-800 truncate">{p.name}</p>
                                                            <p className="text-[9px] text-slate-400">{p.store} · ₹{p.price}</p>
                                                        </div>
                                                        <div className="ml-auto flex items-center gap-0.5 flex-shrink-0">
                                                            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                                                            <span className="text-[9px] text-amber-600 font-bold">{p.rating}</span>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        )}

                                        {/* Review highlights */}
                                        {msg.highlights && msg.highlights.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                                {msg.highlights.map((h, i) => (
                                                    <p key={i} className="text-[10px] text-slate-500 border-l-2 border-purple-200 pl-2">"{h}..."</p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex gap-2 items-center">
                                    <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div className="bg-purple-50 border border-purple-100 rounded-2xl px-3 py-2 flex items-center gap-2">
                                        <Loader2 className="w-3.5 h-3.5 text-purple-500 animate-spin" />
                                        <span className="text-xs text-purple-600 font-medium">Searching knowledge base...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Quick Questions */}
                        {messages.length <= 1 && (
                            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                                {QUICK_QUESTIONS.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => sendMessage(q)}
                                        className="text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-100 rounded-full px-2.5 py-1 hover:bg-purple-100 transition-colors"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-3 border-t border-purple-50 flex gap-2">
                            <input
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
                                placeholder="Ask about AYUSH products..."
                                className="flex-1 bg-purple-50 border border-purple-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder:text-purple-300"
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={loading || !query.trim()}
                                className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center disabled:opacity-50 hover:scale-105 transition-all shadow-lg shadow-purple-200"
                            >
                                <Send className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
