import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Share2 } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function Contact() {
  usePageTitle('Contact Us');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Handle form submission here
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Contact Us</h1>
            </div>
            <div className="hidden md:flex items-center text-gray-600 text-sm">
              <span className="text-blue-600">Home</span>
              <span className="mx-3">/</span>
              <span>Contact Us</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left Side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-3 block">
                      Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-3 block">
                      Email ID
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your Email ID"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-sm font-medium text-gray-700 mb-3 block">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-3 block">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] resize-none text-gray-700"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-md font-medium transition-colors"
                >
                  Send Message
                </Button>
              </form>
            </motion.div>

            {/* Right Side - Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="pt-2">
                  <p className="text-gray-800 font-medium leading-relaxed">
                    AYUSH BHAWAN, B Block, GPO Complex, INA, NEW DELHI - 110023
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="pt-2">
                  <p className="text-gray-800 font-medium">dcc-ayush@nic.in</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="pt-2">
                  <p className="text-gray-800 font-medium">1800-11-22-02</p>
                </div>
              </div>

              {/* Connect With Us */}
              <div className="pt-4">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <Share2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 pt-2">Connect With Us</h3>
                </div>

                <div className="flex space-x-4 ml-16">
                  <a
                    href="#"
                    className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center transition-colors"
                  >
                    <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>

                  <a
                    href="#"
                    className="w-12 h-12 bg-blue-400 hover:bg-blue-500 rounded flex items-center justify-center transition-colors"
                  >
                    <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>

                  <a
                    href="#"
                    className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded flex items-center justify-center transition-colors"
                  >
                    <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}