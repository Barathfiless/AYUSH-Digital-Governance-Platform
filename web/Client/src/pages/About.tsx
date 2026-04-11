import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function About() {
  usePageTitle('About Us');
  return (
    <div className="min-h-screen bg-background relative">
      {/* Hero Section with Background Image */}
      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1920&h=800&fit=crop&crop=center&auto=format&q=80")`
          }}
        />

        {/* Green Wave Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 via-green-500/70 to-orange-500/80" />

        {/* Wave Pattern */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" className="w-full h-16 fill-white">
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" />
          </svg>
        </div>

        <Navbar />

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-between px-6 md:px-12 pt-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              ABOUT DRUG CONTROL CELL
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:flex items-center text-white text-lg"
          >
            <span>Home</span>
            <span className="mx-3">/</span>
            <span className="text-green-200">ABOUT DRUG CONTROL CELL</span>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-8">
              ABOUT DRUG CONTROL CELL, MINISTRY OF AYUSH
            </h2>

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <p>
                Ministry of AYUSH has a Drug Control Cell (DCC) to administer regulatory and quality control provisions for Ayurveda, Siddha, Unani & Homoeopathy (ASU&H) drugs. The Drug Control Cell has been made AYUSH- Vertical of the CDSCO since February, 2018 to deal with the provisions of Drugs and Cosmetics Act, 1940 and Rules thereunder and the associated matter pertaining to ASU&H Drugs. In this regard, the Cell coordinates with the State Licensing Authorities and Drug Controllers to achieve uniform administration of the Act and for providing regulatory guidance and clarifications. Cell also manages the implementation of the Quality Control of ASU&H drugs related part of the National AYUSH Mission (NAM) through which grant in aid is provided for improving infrastructural and functional capacity of Drug Testing laboratories & Pharmacies in the states for production, testing and quality enforcement of ASU&H drugs. The Secretariat for two statutory bodies- Ayurveda, Siddha, Unani Drug Technical Advisory Board (ASDTAB) and Ayurveda, Siddha, Unani Drugs Consultative Committee (ASUDCC) is housed in the Drug Control Cell for planning, coordination and follow up action of their meetings.
              </p>

              <p>
                The Drug Control Cell interacts with Central Drug Standard Control Organization (CDSCO), Directorate General Foreign Trade (DGFT), Ministry of Environment, Forests & Climate Change (MoEF&CC) and other regulatory agencies for WHO-GMP/CoGP certification scheme, export/import and clinical trials related matters, availability issues of raw materials and quality certification in respect of ASU&H Drugs & industry related issues. In order to oversee effective implementation of the Drugs & Cosmetics Rules regarding approval of ASU drug testing institutions by the State Licensing Authorities, Technical Officers of the Ministry have been notified as Central Drug Inspectors to undertake joint inspection of the ASU drug testing laboratories and report to the designated authority.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}