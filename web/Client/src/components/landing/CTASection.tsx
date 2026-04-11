import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

export function CTASection() {
  const { t } = useTranslation();

  const benefits = [
    t('cta.benefit1'),
    t('cta.benefit2'),
    t('cta.benefit3'),
    t('cta.benefit4'),
  ];

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient hero-pattern" />

      <div className="container-wide relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              {t('cta.subtitle')}
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm"
                >
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span className="text-sm text-primary-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Button variant="hero" size="xl" asChild className="shadow-xl">
                <Link to="/register">
                  {t('cta.button')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-12 pt-8 border-t border-primary-foreground/20"
            >
              <p className="text-sm text-primary-foreground/70 mb-4">Trusted by</p>
              <div className="flex flex-wrap justify-center items-center gap-8">
                <div className="text-primary-foreground/80 font-semibold">Ministry of AYUSH</div>
                <div className="w-px h-6 bg-primary-foreground/30" />
                <div className="text-primary-foreground/80 font-semibold">Startup India</div>
                <div className="w-px h-6 bg-primary-foreground/30" />
                <div className="text-primary-foreground/80 font-semibold">DPIIT</div>
                <div className="w-px h-6 bg-primary-foreground/30" />
                <div className="text-primary-foreground/80 font-semibold">CDSCO</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
