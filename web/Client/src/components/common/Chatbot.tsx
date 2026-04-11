import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, X, Send, Bot, User, Minimize2, Maximize2,
    Loader2, ShoppingBag, Star, Zap, Building,
    Leaf, Flower2, ScrollText, HeartPulse, Building2, Search,
    Activity, ShieldCheck, Microscope
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    timestamp: Date;
    products?: any[];
    highlights?: string[];
    source?: string;
    confidence?: string;
    isLoading?: boolean;
}

const CONSUMER_SUGGESTIONS = [
    "Ayurvedic remedy for joint pain?",
    "Yoga for better immunity",
    "Siddha medicine for skin glowing?",
    "Natural stress relief guide",
];

const STARTUP_SUGGESTIONS = [
    "AYUSH license requirements?",
    "GMP certification documents?",
    "Track my portal application",
    "Compliance penalties overview",
];

export function Chatbot() {
    const location = useLocation();
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}') || {};
    const isCustomer = userData?.role === 'customer';
    const isStartupPortal = !isCustomer && /^\/(dashboard|apply|track|admin|application|documents|inventory|loans)/.test(location.pathname);
    const isOfficerPortal = /^\/officer/.test(location.pathname);

    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [ragOnline, setRagOnline] = useState<boolean | null>(null);

    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        setMessages([
            {
                id: '1',
                text: "Namaste! 🙏 I am Jiva, your AYUSH Assistant. How can I help you today?",
                sender: 'bot',
                timestamp: new Date()
            }
        ]);
    }, []);

    const suggestions = isStartupPortal ? STARTUP_SUGGESTIONS : CONSUMER_SUGGESTIONS;
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setRagOnline(true);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    if (isOfficerPortal) return null;

    const sendMessage = async (text?: string) => {
        const userText = (text || inputValue).trim();
        if (!userText) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: userText,
            sender: 'user',
            timestamp: new Date()
        };

        const loadingId = (Date.now() + 1).toString();
        const loadingMsg: Message = {
            id: loadingId,
            text: '',
            sender: 'bot',
            timestamp: new Date(),
            isLoading: true
        };

        setMessages(prev => [...prev, userMsg, loadingMsg]);
        setInputValue('');

        try {
            let endpoint = '/api/rag/chat';
            if (isStartupPortal) {
                endpoint = '/api/rag/guidance';
            } else {
                const isLicenseQuery = /licen|document|apply|gmp|approv|register/i.test(userText);
                endpoint = isLicenseQuery ? '/api/rag/guidance' : '/api/rag/chat';
            }

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userText })
            });

            if (!res.ok) throw new Error('RAG Offline');

            const data = await res.json();

            if (!data.answer || data.answer.includes("couldn't find") || data.answer.includes("No specific guidance")) {
                throw new Error('No Match');
            }

            const botMsg: Message = {
                id: loadingId,
                text: data.answer,
                sender: 'bot',
                timestamp: new Date(),
                products: data.products,
                highlights: data.highlights,
                source: data.source,
                confidence: data.confidence,
                isLoading: false
            };

            setMessages(prev => prev.map(m => m.id === loadingId ? botMsg : m));
        } catch (err) {
            let fallbackText = "";
            let source = "Internal Knowledge Base";

            if (isStartupPortal) {
                if (/licen|apply|process/i.test(userText)) {
                    fallbackText = "To apply for an **AYUSH Manufacturing License**, you must register on this portal, upload your GMP certificate, product formula, and site details. The process typically takes **15-30 working days** for review.";
                } else if (/document|requirement/i.test(userText)) {
                    fallbackText = "Required documents for **Startup Registration**: \n1. Company Incorporation Certificate\n2. GMP Compliance Certificate\n3. Formula Composition details\n4. PAN & GST registration.";
                } else if (/gmp|quality/i.test(userText)) {
                    fallbackText = "All AYUSH startups must adhere to **Good Manufacturing Practices (GMP)**. You can download the official compendium of quality standards from our 'Acts & Rules' section.";
                } else {
                    fallbackText = "I am currently operating in **High-Reliability Mode**. Regarding your startup query: please ensure all laboratory test reports are uploaded in the 'Documents' section of your profile.";
                }
            } else {
                if (/immunit|health|sick/i.test(userText)) {
                    fallbackText = "**Immunity Tip**: Regular intake of **Ashwagandha** and **Giloy** is recommended by AYUSH guidelines to strengthen the immune system naturally.";
                } else if (/digest|stomach/i.test(userText)) {
                    fallbackText = "**Digestive Health**: **Triphala** or **Hingvastak Churna** are traditional AYUSH remedies for digestive support. You can find certified sellers in our Store.";
                } else {
                    fallbackText = "I am processing your request. For specific AYUSH wellness advice, I recommend consulting the certified practitioners listed in our directory.";
                }
            }

            setMessages(prev => prev.map(m =>
                m.id === loadingId
                    ? {
                        ...m,
                        text: fallbackText,
                        source: `${source} (Offline Sync)`,
                        isLoading: false
                    }
                    : m
            ));
        }
    };

    const renderText = (text: string) => {
        return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
            part.startsWith('**') && part.endsWith('**')
                ? <strong key={i} className="text-purple-900 font-bold">{part.slice(2, -2)}</strong>
                : part
        );
    };

    const mainColor = "from-purple-600 to-indigo-800";
    const accentColor = "bg-purple-600";

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30, filter: 'blur(10px)' }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            filter: 'blur(0px)',
                            height: isMinimized ? '70px' : '520px',
                            transition: { type: 'spring', damping: 25, stiffness: 200 }
                        }}
                        exit={{ opacity: 0, scale: 0.95, y: 30, filter: 'blur(10px)' }}
                        className={cn(
                            "mb-4 w-[350px] bg-white/95 backdrop-blur-3xl rounded-[28px] shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-white/60 overflow-hidden flex flex-col transition-all duration-500",
                            isMinimized && "w-[240px]"
                        )}
                    >
                        {/* ── Header ────────────────────────────────── */}
                        <div className={cn("p-4 bg-gradient-to-br text-white flex items-center justify-between flex-shrink-0 relative overflow-hidden", mainColor)}>
                            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl opacity-50" />

                            <div className="flex items-center gap-3 relative z-10">
                                <motion.div
                                    whileHover={{ rotate: 10, scale: 1.1 }}
                                    className="w-9 h-9 bg-white/30 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/40 shadow-lg"
                                >
                                    <Leaf className="w-5 h-5 text-white" />
                                </motion.div>
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-sm tracking-tight leading-none">Jiva Assistant</h3>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-white/80">Online</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 relative z-10">
                                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-white/20 rounded-lg transition-all">
                                    {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-rose-500 rounded-lg transition-all">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* ── Messages ──────────────────────────────── */}
                                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-50/50 custom-scrollbar min-h-0">
                                    <AnimatePresence>
                                        {messages.map((msg) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                key={msg.id}
                                                className={cn("flex flex-col group", msg.sender === 'user' ? "items-end" : "items-start")}
                                            >
                                                <div className={cn(
                                                    "max-w-[85%] p-3.5 rounded-[20px] text-[13px] leading-relaxed shadow-sm transition-all duration-300",
                                                    msg.sender === 'user'
                                                        ? `${accentColor} text-white rounded-tr-none`
                                                        : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none"
                                                )}>
                                                    {msg.isLoading ? (
                                                        <div className="flex items-center gap-3 py-0.5">
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Thinking...</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <p className="whitespace-pre-wrap">{renderText(msg.text)}</p>

                                                            {msg.source && (
                                                                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                                                                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">{msg.source}</span>
                                                                    {msg.confidence && (
                                                                        <span className="text-[9px] font-black text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">MATCH</span>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {msg.products && msg.products.length > 0 && (
                                                                <div className="mt-4 grid grid-cols-1 gap-2">
                                                                    {msg.products.slice(0, 1).map((p, i) => (
                                                                        <a key={i} href={`/products/${p.id}`}
                                                                            className="flex items-center gap-3 bg-slate-50/80 hover:bg-white rounded-xl p-2.5 border border-slate-100 hover:border-purple-200 transition-all"
                                                                        >
                                                                            <Leaf className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="text-[11px] font-bold text-slate-800 truncate">{p.name}</p>
                                                                                <p className="text-[9px] text-slate-500">₹{p.price}</p>
                                                                            </div>
                                                                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                <span className="text-[9px] text-slate-400 mt-1.5 font-bold px-1 opacity-60">
                                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* ── Suggestions ────────────────────────── */}
                                {messages.length <= 1 && (
                                    <div className="px-4 pb-4 flex flex-col gap-2 bg-slate-50/50">
                                        <div className="flex flex-wrap gap-1.5">
                                            {suggestions.map((q, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => sendMessage(q)}
                                                    className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-1.5 hover:border-purple-400 hover:text-purple-700 transition-all"
                                                >
                                                    {q}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ── Input ────────────────────────────────── */}
                                <div className="p-4 bg-white border-t border-slate-100">
                                    <div className="relative flex gap-2">
                                        <Input
                                            placeholder="Ask anything..."
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                            className="h-11 pl-4 pr-12 rounded-xl bg-slate-100/70 border-none focus-visible:ring-1 focus-visible:ring-purple-200 focus-visible:bg-white transition-all text-[13px] font-medium"
                                        />
                                        <button
                                            onClick={() => sendMessage()}
                                            disabled={!inputValue.trim()}
                                            className={cn(
                                                "absolute right-1 top-1 w-9 h-9 rounded-lg flex items-center justify-center transition-all disabled:opacity-30",
                                                accentColor
                                            )}
                                        >
                                            <Send className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Toggle Button ─────────────────────────── */}
            <motion.div className="relative group/fab">
                {!isOpen && (
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="absolute inset-0 bg-purple-500 blur-2xl rounded-full"
                    />
                )}

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-500 border-2 border-white/20",
                        isOpen ? "bg-rose-500 rotate-90" : `bg-gradient-to-br ${mainColor}`
                    )}
                >
                    {isOpen ? (
                        <X className="text-white w-7 h-7" />
                    ) : (
                        <Leaf className="text-white w-7 h-7" />
                    )}
                </motion.button>
            </motion.div>
        </div>
    );
}
