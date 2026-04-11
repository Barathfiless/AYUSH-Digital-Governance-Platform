import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Leaf, Activity, Beaker, Flame, Pill } from 'lucide-react';

export function CategoriesSection() {
  const { t } = useTranslation();

  // Array INSIDE component so t() is reactive to language changes
  const categories = [
    {
      id: 'ayurveda',
      nameKey: 'categories.ayurveda',
      icon: Leaf,
      descKey: 'categories.ayurveda.desc',
      color: 'category-ayurveda',
      borderColor: 'border-[hsl(142,55%,35%)]',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop&auto=format&q=80'
    },
    {
      id: 'yoga',
      nameKey: 'categories.yoga',
      icon: Activity,
      descKey: 'categories.yoga.desc',
      color: 'category-yoga',
      borderColor: 'border-[hsl(270,50%,55%)]',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&auto=format&q=80'
    },
    {
      id: 'unani',
      nameKey: 'categories.unani',
      icon: Beaker,
      descKey: 'categories.unani.desc',
      color: 'category-unani',
      borderColor: 'border-[hsl(199,80%,45%)]',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&auto=format&q=80'
    },
    {
      id: 'siddha',
      nameKey: 'categories.siddha',
      icon: Flame,
      descKey: 'categories.siddha.desc',
      color: 'category-siddha',
      borderColor: 'border-[hsl(25,85%,50%)]',
      image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=400&fit=crop&auto=format&q=80'
    },
    {
      id: 'homeopathy',
      nameKey: 'categories.homeopathy',
      icon: Pill,
      descKey: 'categories.homeopathy.desc',
      color: 'category-homeopathy',
      borderColor: 'border-[hsl(340,60%,50%)]',
      image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400&h=400&fit=crop&auto=format&q=80'
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-muted/50">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('categories.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('categories.subtitle')}
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative bg-card rounded-2xl overflow-hidden border-2 ${category.borderColor} border-opacity-30 hover:border-opacity-100 transition-all duration-300 cursor-pointer min-h-[320px] shadow-sm hover:shadow-xl`}
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={category.image}
                  alt={t(category.nameKey)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 opacity-15 mix-blend-multiply"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-white/40 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              {/* Content Container */}
              <div className="relative z-10 p-6 flex flex-col items-start h-full">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${category.color} border mb-6 shadow-sm`}>
                  <category.icon className="w-7 h-7" />
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#002b5b] mb-3">
                    {t(category.nameKey)}
                  </h3>
                  <p className="text-[13px] text-gray-700 leading-relaxed font-medium">
                    {t(category.descKey)}
                  </p>
                </div>

                {/* Hover Indicator */}
                <div className="mt-4 flex items-center gap-2 text-[#002b5b] font-bold text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  <span>{t('categories.explore')}</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
