import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    gradient: "bg-gradient-to-br from-[#0a4d3c] via-[#002b5b] to-[#1a1a2e]",
    backgroundImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80",
    title: "Welcome to e-Ayush",
    subtitle: "Your Digital Gateway to the Ayush Ecosystem"
  },
  {
    gradient: "bg-gradient-to-br from-[#1e3a8a] via-[#3b82f6] to-[#047857]",
    backgroundImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80",
    title: "Empowering Startups",
    subtitle: "Simplified Licensing and Compliance for Holistic Wellness"
  },
  {
    gradient: "bg-gradient-to-br from-[#4c1d95] via-[#2563eb] to-[#0d9488]",
    backgroundImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80",
    title: "Global Ayush Standards",
    subtitle: "Bridging Traditional Wisdom with Modern Technology"
  }
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-[450px] md:h-[550px] lg:h-[650px] flex items-center overflow-hidden bg-gray-950 group">
      {/* Background Images and Gradients Carousel */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slides[current].backgroundImage})` }}
          />
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 ${slides[current].gradient} opacity-80`} />

          {/* Subtle Dynamic Overlay Pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

          {/* Rich Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="w-full py-10 lg:py-16 relative overflow-hidden">
          <div className="container-wide text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${current}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col gap-4"
              >
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter drop-shadow-2xl">
                  {slides[current].title}
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl text-blue-100/90 font-medium tracking-wide drop-shadow-md">
                  {slides[current].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Animated Slide Progress Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 transition-all duration-500 rounded-full ${i === current ? 'w-10 bg-white shadow-lg' : 'w-2 bg-white/30'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-2 md:px-4 lg:px-6 z-20 pointer-events-none">
        <button
          onClick={prev}
          className="pointer-events-auto w-10 h-14 md:w-12 md:h-16 flex items-center justify-center bg-black/30 hover:bg-[#002b5b] text-white transition-all rounded-r-lg -ml-2 md:-ml-4 lg:ml-0 lg:rounded backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 duration-300"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        <button
          onClick={next}
          className="pointer-events-auto w-10 h-14 md:w-12 md:h-16 flex items-center justify-center bg-black/30 hover:bg-[#002b5b] text-white transition-all rounded-l-lg -mr-2 md:-mr-4 lg:mr-0 lg:rounded backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 duration-300"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>
    </section>
  );
}
