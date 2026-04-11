import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Shield, 
  Bell, 
  Languages, 
  FileCheck, 
  Users,
  Zap,
  FileText
} from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    titleKey: 'features.ai.title',
    descKey: 'features.ai.desc',
    color: 'bg-ayush-ayurveda/10 text-ayush-ayurveda',
  },
  {
    icon: Shield,
    titleKey: 'features.blockchain.title',
    descKey: 'features.blockchain.desc',
    color: 'bg-ayush-yoga/10 text-ayush-yoga',
  },
  {
    icon: Bell,
    titleKey: 'features.tracking.title',
    descKey: 'features.tracking.desc',
    color: 'bg-ayush-unani/10 text-ayush-unani',
  },
  {
    icon: Languages,
    titleKey: 'features.multilingual.title',
    descKey: 'features.multilingual.desc',
    color: 'bg-ayush-siddha/10 text-ayush-siddha',
  },
  {
    icon: FileCheck,
    titleKey: 'features.compliance.title',
    descKey: 'features.compliance.desc',
    color: 'bg-ayush-homeopathy/10 text-ayush-homeopathy',
  },
  {
    icon: Users,
    titleKey: 'features.investor.title',
    descKey: 'features.investor.desc',
    color: 'bg-accent/10 text-accent',
  },
];

export function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('features.subtitle')}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-card rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/30"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${feature.color} mb-6`}>
                <feature.icon className="w-7 h-7" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {t(feature.titleKey)}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t(feature.descKey)}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-muted">
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              <strong className="text-foreground">Need help?</strong> Check our comprehensive documentation
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
