import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, UserCog, ShoppingBag, CheckCircle2, XCircle, ShieldCheck, ClipboardCheck } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function Register() {
  usePageTitle('Register');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    aadhar: '',
    pan: '',
    password: '',
    role: 'startup'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Verhoeff Algorithm for Aadhar Validation
  const verhoeffCheck = (value: string) => {
    const d = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
      [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
      [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
      [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
      [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
      [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
      [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
      [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
      [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];
    const p = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
      [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
      [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
      [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
      [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
      [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
      [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];
    const inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

    const raw = value.replace(/\s/g, '');
    if (raw.length !== 12 || !/^\d+$/.test(raw)) return false;

    let c = 0;
    const invertedArray = raw.split('').map(Number).reverse();
    for (let i = 0; i < invertedArray.length; i++) {
      c = d[c][p[i % 8][invertedArray[i]]];
    }
    return c === 0;
  };

  const validatePan = (value: string) => {
    // 4th char represents category (P=Personal, C=Company, etc.)
    const panRegex = /^[A-Z]{3}[PHCAFJTBLG][A-Z]{1}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(value);
  };

  const validateAadhar = (value: string) => {
    return verhoeffCheck(value);
  };

  const validateEmail = (value: string) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
  };

  const updateFormData = (field: string, value: string) => {
    let newValue = value;

    // PAN specific handling
    if (field === 'pan') {
      newValue = value.toUpperCase().slice(0, 10);

      if (newValue.length === 10 && !validatePan(newValue)) {
        setErrors(prev => ({ ...prev, pan: 'Invalid PAN Number format (e.g. ABCDE1234F)' }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.pan;
          return newErrors;
        });
      }
    }

    setFormData(prev => ({ ...prev, [field]: newValue }));
  };

  const handleSubmit = async () => {
    // Validate all required fields
    const isStartup = formData.role === 'startup';
    const hasBaseFields = formData.name && formData.email && formData.phone && formData.password;
    const hasRequiredSpecialFields = !isStartup || (formData.aadhar && formData.pan);

    if (!hasBaseFields || !hasRequiredSpecialFields) {
      alert('Please fill all required fields');
      return;
    }

    // Validate PAN specifically before submission (only for startups)
    if (formData.role === 'startup' && !validatePan(formData.pan)) {
      setErrors(prev => ({ ...prev, pan: 'Invalid PAN Number format (e.g. ABCDE1234F)' }));
      alert('Please correct the PAN Number before submitting');
      return;
    }

    if (Object.keys(errors).length > 0) {
      alert('Please fix the errors before submitting');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          aadhar: formData.role === 'startup' ? formData.aadhar.replace(/\s/g, '') : undefined,
          pan: formData.role === 'startup' ? formData.pan : undefined
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Please login.');
        navigate('/login');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Network error. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex relative">
      {/* Left Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-lg"
        >
          {/* Signup Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#002b5b] to-[#1e3a8a] px-6 py-4 text-center text-white relative">
              <div className="absolute top-2 left-6 w-5 h-5 bg-white/20 rounded transform rotate-45"></div>
              <div className="absolute bottom-2 right-6 w-6 h-6 bg-white/10 rounded-full"></div>
              <h2 className="text-lg font-bold">Sign up</h2>
            </div>

            <div className="px-8 py-8">
              {/* Role Selection */}
              <div className="mb-6">
                <Tabs value={formData.role} onValueChange={(val) => updateFormData('role', val)} className="w-full">
                  <TabsList className="flex w-full h-9 bg-gray-100 p-1 rounded-xl text-[8px] sm:text-[9px] shadow-inner overflow-x-auto no-scrollbar gap-0.5">
                    <TabsTrigger
                      value="startup"
                      className="rounded-lg flex-1 min-w-fit px-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-[#002b5b] flex items-center justify-center gap-1 py-1 transition-all"
                    >
                      <Building2 className="w-3 h-3 shrink-0" />
                      Startup
                    </TabsTrigger>
                    <TabsTrigger
                      value="officer"
                      className="rounded-lg flex-1 min-w-fit px-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-[#002b5b] flex items-center justify-center gap-1 py-1 transition-all"
                    >
                      <UserCog className="w-3 h-3 shrink-0" />
                      Officer
                    </TabsTrigger>
                    <TabsTrigger
                      value="customer"
                      className="rounded-lg flex-1 min-w-fit px-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-[#002b5b] flex items-center justify-center gap-1 py-1 transition-all"
                    >
                      <ShoppingBag className="w-3 h-3 shrink-0" />
                      Customer
                    </TabsTrigger>
                    <TabsTrigger
                      value="admin"
                      className="rounded-lg flex-1 min-w-fit px-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-[#002b5b] flex items-center justify-center gap-1 py-1 transition-all"
                    >
                      <ShieldCheck className="w-3 h-3 shrink-0" />
                      Admin
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-1.5 block ml-1">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="h-11 text-base px-4 border-gray-200 rounded-xl focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 mb-1.5 block ml-1">Phone No *</Label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r pr-3 border-gray-200">
                      <img
                        src="https://flagcdn.com/in.svg"
                        alt="India"
                        className="w-5 h-auto rounded-sm"
                      />
                      <span className="text-sm font-bold text-gray-600">+91</span>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        updateFormData('phone', val);
                      }}
                      className="h-11 text-base pl-20 pr-4 border-gray-200 rounded-xl focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-1.5 block ml-1">E-mail *</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="h-11 text-base px-4 border-gray-200 rounded-xl focus:ring-blue-500"
                      placeholder="example@gmail.com"
                    />
                  </div>
                </div>

                {formData.role === 'startup' && (
                  <>
                    <div>
                      <Label htmlFor="aadhar" className="text-sm font-medium text-gray-700 mb-1 block">Aadhar Number *</Label>
                      <div className="relative">
                        <Input
                          id="aadhar"
                          value={formData.aadhar}
                          onChange={(e) => {
                            const rawVal = e.target.value.replace(/\D/g, '').slice(0, 12);
                            const formattedVal = rawVal.match(/.{1,4}/g)?.join(' ') || '';
                            updateFormData('aadhar', formattedVal);
                          }}
                          className={`h-12 text-base px-3 pr-10 border-gray-200 ${formData.aadhar.replace(/\s/g, '').length === 12
                            ? (validateAadhar(formData.aadhar) ? 'border-green-500 focus-visible:ring-green-500' : 'border-red-500 focus-visible:ring-red-500')
                            : ''
                            }`}
                          maxLength={14}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {formData.aadhar.replace(/\s/g, '').length === 12 && (
                            validateAadhar(formData.aadhar)
                              ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                              : <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* PAN Number Field */}
                    <div>
                      <Label htmlFor="pan" className="text-sm font-semibold text-gray-700 mb-1.5 block ml-1">PAN Number *</Label>
                      <div className="relative">
                        <Input
                          id="pan"
                          value={formData.pan}
                          onChange={(e) => updateFormData('pan', e.target.value)}
                          className={`h-11 text-base px-4 pr-12 rounded-xl border ${formData.pan.length === 10
                            ? (validatePan(formData.pan) ? 'border-green-500 focus-visible:ring-green-500' : 'border-red-500 focus-visible:ring-red-500')
                            : (errors.pan ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-200')
                            }`}
                          maxLength={10}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {formData.pan.length === 10 && (
                            validatePan(formData.pan)
                              ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                              : <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 block">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    className="h-12 text-base px-3 border-gray-200"
                  />
                </div>
              </div>

              <div className="mt-8">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-[#002b5b] hover:bg-[#1a406d] py-6 text-xl font-bold rounded-xl shadow-lg transition-all active:scale-95"
                >
                  {isLoading ? 'Processing...' : 'Create Account'}
                </Button>
                <div className="text-center mt-4 text-sm text-gray-500">
                  Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline ml-1">Login</Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Images */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80")`
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#002b5b]/90 via-[#1e3a8a]/80 to-[#002b5b]/90" />

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-8 text-center w-full">
          <div className="max-w-sm">
            {/* Government Emblem */}
            <div className="mb-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                alt="Government of India Emblem"
                className="h-16 w-auto mx-auto mb-2"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="h-16 w-16 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                        <div class="text-white font-bold text-xl">आ</div>
                      </div>
                    `;
                  }
                }}
              />
              <div className="text-[10px] font-bold">सत्यमेव जयते</div>
            </div>

            <h1 className="text-3xl font-bold mb-2">AYUSH Registration</h1>
            <p className="text-base mb-2 text-blue-100 font-medium">
              Ministry of Ayush, Govt. of India
            </p>
            <p className="text-xs text-blue-200 leading-relaxed mb-6 opacity-90">
              Join the digital transformation of traditional medicine practices and drug licensing.
            </p>

            {/* AYUSH Categories */}
            <div className="grid grid-cols-4 gap-2 opacity-70">
              <div className="text-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-1 mx-auto">
                  <span className="text-[10px] font-bold">A</span>
                </div>
                <div className="text-[8px] uppercase tracking-tighter">Ayurveda</div>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-1 mx-auto">
                  <span className="text-[10px] font-bold">Y</span>
                </div>
                <div className="text-[8px] uppercase tracking-tighter">Yoga</div>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-1 mx-auto">
                  <span className="text-[10px] font-bold">U</span>
                </div>
                <div className="text-[8px] uppercase tracking-tighter">Unani</div>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-1 mx-auto">
                  <span className="text-[10px] font-bold">S</span>
                </div>
                <div className="text-[8px] uppercase tracking-tighter">Siddha</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
