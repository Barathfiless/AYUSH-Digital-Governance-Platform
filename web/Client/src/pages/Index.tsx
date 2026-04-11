import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CategoriesSection } from '@/components/landing/CategoriesSection';
import { MinistersSection } from '@/components/landing/MinistersSection';
import { PortalStatsSection } from '@/components/landing/PortalStatsSection';
import { UpdatesAndLinksSection } from '@/components/landing/UpdatesAndLinksSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { usePageTitle } from '@/hooks/usePageTitle';

const Index = () => {
  usePageTitle('Home');
  return (
    <div className="min-h-screen bg-white relative">
      {/* Background Pattern */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />

      <Navbar />
      <main className="pt-[100px] md:pt-[110px] relative z-10">
        <HeroSection />
        <CategoriesSection />
        <MinistersSection />
        <FeaturesSection />
        <PortalStatsSection />
        <UpdatesAndLinksSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};


export default Index;
