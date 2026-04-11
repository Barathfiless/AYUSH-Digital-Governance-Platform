import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/stats', label: 'State Statistics' },
    { href: '/acts', label: 'Acts & Rules' },
    { href: '/contact', label: t('nav.contact') },
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#002b5b]">
      {/* Top Bar - Government of India */}
      <div className="text-white py-1">
        <div className="container-wide flex items-center justify-between text-[11px] font-medium">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="https://flagcdn.com/w40/in.png" alt="India" className="w-5 h-3.5" />
              <span>Government of India</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher compact />
            <button onClick={toggleDarkMode} className="p-1 rounded-full bg-white text-[#002b5b] hover:scale-110 transition-all ml-2">
              {isDarkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar - Floating Pill */}
      <div className="container-wide pb-1">
        <nav className="bg-[#f2f4f6] rounded-full border border-gray-200 shadow-lg px-2 sm:px-4 py-1.5 flex items-center justify-between h-16 relative z-20">
          {/* Logo Section */}
          <div className="pl-2 sm:pl-4 flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 w-auto flex items-center justify-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                  alt="Emblem"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div className="w-[1px] h-8 bg-gray-300" />
              <div>
                <h1 className="font-extrabold text-xl lg:text-2xl text-[#002b5b] tracking-tight leading-none">e-Ayush</h1>
                <p className="text-[9px] text-gray-500 font-medium leading-none mt-0.5 tracking-wide uppercase">Ministry of Ayush, Government of India</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-1 mx-2">
            <Link
              to="/"
              className="px-3 py-2 text-[14px] font-medium text-[#444] hover:text-[#002b5b] transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              Main
            </Link>
            {navLinks.filter(l => l.href !== '/').map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-3 py-2 text-[14px] font-medium text-[#444] hover:text-[#002b5b] transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 pr-2 sm:pr-4">
            <div className="hidden lg:flex items-center gap-2">
              <Button size="sm" className="bg-[#cd3333] hover:bg-[#b02a2a] text-white h-9 px-6 font-medium rounded-sm border-none shadow-none transition-colors" asChild>
                <Link to="/login">{t('nav.login')}</Link>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg hover:bg-muted transition-colors text-primary"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </div>


      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-white border-t border-border shadow-xl overflow-hidden absolute top-full left-0 right-0 z-40"
          >
            <div className="container-wide py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-4 px-4 border-t mt-2">
                <Button className="flex-1 bg-[#cd3333] hover:bg-[#b02a2a] text-white" asChild>
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </header>
  );
}
