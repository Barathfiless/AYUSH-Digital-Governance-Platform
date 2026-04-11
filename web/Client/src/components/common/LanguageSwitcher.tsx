import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Search, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LANGUAGES = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'as', label: 'Assamese', native: 'অসমীয়া' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'brx', label: 'Bodo', native: 'बर\'  ' },
    { code: 'hne', label: 'Chhattisgarhi', native: 'छत्तीसगढ़ी' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ks', label: 'Kashmiri', native: 'کٲشُر' },
    { code: 'kok', label: 'Konkani', native: 'कोंकणी' },
    { code: 'kok_TT', label: 'Kokborok', native: 'কোকবরক' },
    { code: 'lep', label: 'Lepcha', native: 'ᰛᰦᰶᰕ' },
    { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
    { code: 'mni', label: 'Manipuri (Meitei)', native: 'ꯃꯩꯇꯩꯂꯣꯟ' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'lus', label: 'Mizo', native: 'Mizo ṭawng' },
    { code: 'ne', label: 'Nepali', native: 'नेपाली' },
    { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'sa', label: 'Sanskrit', native: 'संस्कृत' },
    { code: 'sio', label: 'Sikkimese (Bhutia)', native: 'འབྲུག་ཡིག' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'ur', label: 'Urdu', native: 'اردو' },
];

interface Props {
    compact?: boolean; // for navbar (compact pill) vs dashboard header (full)
}

export function LanguageSwitcher({ compact = false }: Props) {
    const { i18n, t } = useTranslation();
    // t is used to subscribe to language change re-renders
    void t;
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    const current = LANGUAGES.find(l => l.code === i18n.language) ?? LANGUAGES[0];

    const filtered = LANGUAGES.filter(l =>
        l.label.toLowerCase().includes(search.toLowerCase()) ||
        l.native.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const select = (code: string) => {
        i18n.changeLanguage(code);
        localStorage.setItem('ayush_lang', code);
        setOpen(false);
        setSearch('');
    };

    // RTL handling
    const rtlLangs = ['ur', 'ks'];
    useEffect(() => {
        document.documentElement.dir = rtlLangs.includes(i18n.language) ? 'rtl' : 'ltr';
    }, [i18n.language]);

    // Restore on mount
    useEffect(() => {
        const saved = localStorage.getItem('ayush_lang');
        if (saved && saved !== i18n.language) i18n.changeLanguage(saved);
    }, []);

    return (
        <div ref={ref} className="relative z-50">
            <button
                onClick={() => setOpen(o => !o)}
                className={`flex items-center gap-1.5 font-semibold transition-all rounded-lg
          ${compact
                        ? 'text-white/80 hover:text-white text-[11px] px-2 py-1 hover:bg-white/10'
                        : 'text-slate-600 hover:text-[#002b5b] text-xs px-3 py-2 hover:bg-slate-100 border border-slate-200 bg-white shadow-sm'
                    }`}
            >
                <Globe className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                <span className="max-w-[70px] truncate">{current.native}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                    >
                        {/* Search */}
                        <div className="p-2 border-b border-gray-100">
                            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                                <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <input
                                    autoFocus
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search language..."
                                    className="bg-transparent flex-1 text-xs text-gray-700 outline-none placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="max-h-64 overflow-y-auto py-1">
                            {filtered.length === 0 ? (
                                <p className="text-center text-xs text-gray-400 py-6">No languages found</p>
                            ) : (
                                filtered.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => select(lang.code)}
                                        className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors
                      ${lang.code === current.code
                                                ? 'bg-blue-50 text-[#002b5b]'
                                                : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold leading-tight">{lang.native}</span>
                                            <span className="text-[10px] text-gray-400 font-medium">{lang.label}</span>
                                        </div>
                                        {lang.code === current.code && (
                                            <Check className="w-4 h-4 text-[#002b5b] shrink-0" />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
