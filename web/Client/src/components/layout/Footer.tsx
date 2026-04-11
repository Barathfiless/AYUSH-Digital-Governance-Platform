import { motion } from 'framer-motion';
import { Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#002b5b] text-white pt-8 pb-4 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff), linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff)', backgroundSize: '60px 60px', backgroundPosition: '0 0, 30px 30px' }} />

      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-4 gap-8 mb-8">

          {/* Logo Column */}
          <div className="space-y-4">
            <div className="flex flex-col items-start gap-4">
              <div className="bg-white p-3 rounded-lg flex items-center justify-center w-48 h-28">
                <div className="text-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                    alt="Government of India Emblem"
                    className="h-16 w-auto mx-auto mb-1"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <svg class="h-16 w-16 text-blue-900 mx-auto mb-1" viewBox="0 0 100 100" fill="currentColor">
                            <circle cx="50" cy="20" r="8"/>
                            <path d="M50 30 L42 45 L58 45 Z"/>
                            <rect x="45" y="45" width="10" height="25"/>
                            <circle cx="35" cy="75" r="3"/>
                            <circle cx="50" cy="75" r="3"/>
                            <circle cx="65" cy="75" r="3"/>
                          </svg>
                        `;
                      }
                    }}
                  />
                  <div className="text-gray-800 text-xs font-bold">सत्यमेव जयते</div>
                  <div className="text-gray-700 text-base font-semibold">Ministry of Ayush</div>
                  <div className="text-gray-600 text-xs">Government of India</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-white p-2 rounded h-16 w-24 flex items-center justify-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/f/ff/Swachh_Bharat_Abhiyan_logo.svg"
                    alt="Swachh Bharat"
                    className="h-full w-auto object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="text-center">
                            <div class="text-green-600 font-bold text-xs mb-1">स्वच्छ भारत</div>
                            <div class="text-green-700 font-semibold text-xs">Swachh Bharat</div>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
                <div className="bg-white p-2 rounded h-16 w-32 flex items-center justify-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c5/Azadi_Ka_Amrit_Mahotsav_Logo.svg"
                    alt="Azadi Ka Amrit Mahotsav"
                    className="h-full w-auto object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="text-center">
                            <div class="text-orange-600 font-bold text-base">75</div>
                            <div class="text-orange-700 font-semibold text-xs">Azadi Ka</div>
                            <div class="text-orange-700 font-semibold text-xs">Amrit Mahotsav</div>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="grid grid-cols-2 gap-6 lg:col-span-2">
            <div>
              <h3 className="text-[#8eb7e3] font-bold text-base mb-4 border-b border-white/10 pb-2 uppercase tracking-wide">Useful Links</h3>
              <ul className="space-y-2 text-sm text-white/80 font-medium">
                <li><a href="#" className="hover:text-accent transition-colors flex items-center gap-2 underline decoration-white/20 underline-offset-4">Website Policies</a></li>
                <li><a href="#" className="hover:text-accent transition-colors flex items-center gap-2 underline decoration-white/20 underline-offset-4">Sitemap</a></li>
                <li><a href="#" className="hover:text-accent transition-colors flex items-center gap-2 underline decoration-white/20 underline-offset-4">Help</a></li>
                <li><a href="#" className="hover:text-accent transition-colors flex items-center gap-2 underline decoration-white/20 underline-offset-4">Contact Us</a></li>
              </ul>
            </div>
            <div className="pt-8">
              <ul className="space-y-2 text-sm text-white/80 font-medium">
                <li><a href="#" className="hover:text-accent transition-colors flex items-center gap-2 underline decoration-white/20 underline-offset-4">Terms and Conditions</a></li>
                <li><a href="#" className="hover:text-accent transition-colors flex items-center gap-2 underline decoration-white/20 underline-offset-4">FAQs</a></li>
                <li><a href="#" className="hover:text-accent transition-colors flex items-center gap-2 underline decoration-white/20 underline-offset-4">Feedback</a></li>
                <li><a href="#" className="hover:text-accent transition-colors flex items-center gap-2 underline decoration-white/20 underline-offset-4">User Manual</a></li>
              </ul>
            </div>
          </div>

          {/* Address Column */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 invisible">Contact Info</h3>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p className="text-white/80 leading-relaxed font-medium">
                  AYUSH BHAWAN, B Block, GPO Complex, INA, NEW DELHI - 110023
                </p>
              </div>
              <div className="flex gap-3">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <p className="text-white/80 font-medium">1800-11-22-02</p>
              </div>
              <div className="flex gap-3">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <p className="text-white/80 font-medium">dcc-ayush@nic.in</p>
              </div>

              <div className="pt-3">
                <p className="text-white font-bold mb-3 uppercase text-xs tracking-widest">Connect With Us</p>
                <div className="flex gap-3">
                  <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-[#002b5b] transition-all"><Facebook className="w-4 h-4" /></a>
                  <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-[#002b5b] transition-all"><Twitter className="w-4 h-4" /></a>
                  <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-[#002b5b] transition-all"><Youtube className="w-4 h-4" /></a>
                </div>
                <p className="text-[10px] text-white/50 mt-4 uppercase leading-tight font-bold">
                  Last Update Version: [03-JAN-2025]<br />
                  Visitors Count: 202788
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-white/90">
            Website content owned by <span className="text-accent underline decoration-accent/50 underline-offset-2">Ministry of Ayush, Government of India.</span>
          </p>
          <div className="flex items-center gap-4">
            <div className="bg-white px-2 py-1 rounded flex items-center justify-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/9/95/Digital_India_logo.svg"
                alt="Digital India"
                className="h-5 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="text-blue-900 font-bold text-xs">DIGITAL INDIA</div>
                    `;
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
