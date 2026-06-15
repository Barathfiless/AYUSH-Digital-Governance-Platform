import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, UserCog, ShoppingBag, CheckCircle2, XCircle, ShieldCheck, ClipboardCheck } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

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

  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googlePhone, setGooglePhone] = useState('');
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);

  const handleGoogleRegister = async () => {
    if (!googleEmail || !googleEmail.includes('@') || !googleName || !googlePhone) {
      alert('Please fill out all details.');
      return;
    }

    setIsLoading(true);
    setShowGoogleModal(false);
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: googleEmail,
          name: googleName,
          phone: googlePhone,
          role: 'admin',
          mode: 'register'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Admin registration successful! Logging you in...');
        sessionStorage.setItem('user', JSON.stringify(data.user));
        sessionStorage.setItem('token', data.token);
        navigate('/admin');
      } else {
        alert(data.message || 'Google registration failed');
      }
    } catch (error) {
      console.error('Google register error:', error);
      alert('Network error during Google authentication.');
    } finally {
      setIsLoading(false);
    }
  };

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

              {formData.role === 'admin' ? (
                <div className="space-y-6 text-center py-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto border border-blue-100 mb-2">
                    <ShieldCheck className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-800">Admin Registration</h3>
                    <p className="text-xs text-gray-500 mt-1">To register a new administrator account, please sign up with a verified government Google workspace account.</p>
                  </div>
                  
                  <Button
                    type="button"
                    onClick={() => {
                      setGoogleEmail('');
                      setGoogleName('');
                      setGooglePhone('');
                      setIsEmailConfirmed(false);
                      setShowGoogleModal(true);
                    }}
                    disabled={isLoading}
                    className="w-full bg-[#002b5b] hover:bg-[#1a406d] text-white py-6 text-xl font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#FFFFFF"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#FFFFFF"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FFFFFF"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#FFFFFF"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    Sign Up with Google
                  </Button>
                  
                  <div className="text-center mt-4 text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline ml-1">Login</Link>
                  </div>
                </div>
              ) : (
                <>
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
                </>
              )}
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

      {/* Google Sign-Up Details Modal */}
      <Dialog open={showGoogleModal} onOpenChange={setShowGoogleModal}>
        <DialogContent className="max-w-md bg-white rounded-2xl p-6 border-none shadow-2xl overflow-hidden">
          <DialogHeader className="text-center pb-4 border-b border-gray-100">
            <div className="flex justify-center mb-2">
              <svg className="w-10 h-10" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <DialogTitle className="text-lg font-bold text-gray-800">Sign up with Google</DialogTitle>
            <p className="text-xs text-gray-500 mt-1">Provide your details to complete your administrator registration</p>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {!isEmailConfirmed ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="google-register-email" className="text-xs font-semibold text-gray-700 block mb-1">
                    Google Email Address
                  </Label>
                  <Input
                    id="google-register-email"
                    type="email"
                    placeholder="name@gmail.com or name@gov.in"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    className="h-10 text-sm border-gray-300 rounded-xl"
                  />
                </div>
                <Button
                  onClick={() => {
                    if (!googleEmail || !googleEmail.includes('@')) {
                      alert('Please enter a valid Google email address.');
                      return;
                    }
                    setIsEmailConfirmed(true);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 text-xs font-bold rounded-xl"
                >
                  Continue
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Google Account</p>
                    <p className="text-xs font-semibold text-gray-700 truncate">{googleEmail}</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setIsEmailConfirmed(false)}
                    className="h-7 px-2 text-[10px] text-blue-600 font-bold hover:bg-blue-50"
                  >
                    Change
                  </Button>
                </div>
                
                <div>
                  <Label htmlFor="google-name" className="text-xs font-semibold text-gray-700 block mb-1">
                    Full Name
                  </Label>
                  <Input
                    id="google-name"
                    placeholder="Enter your name"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    className="h-10 text-sm border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="google-phone" className="text-xs font-semibold text-gray-700 block mb-1">
                    Phone Number
                  </Label>
                  <Input
                    id="google-phone"
                    placeholder="Enter your 10-digit phone number"
                    value={googlePhone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setGooglePhone(val);
                    }}
                    className="h-10 text-sm border-gray-300 rounded-xl"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEmailConfirmed(false)}
                    className="flex-1 h-10 text-xs font-bold rounded-xl"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleGoogleRegister}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-10 text-xs font-bold rounded-xl"
                  >
                    Create Admin
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
