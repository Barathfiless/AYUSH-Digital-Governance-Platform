import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Eye, EyeOff, RefreshCw, ArrowLeft, Building2, UserCog, ShieldCheck, ShoppingBag, ClipboardCheck } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Login() {
  usePageTitle('Login');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [selectedRole, setSelectedRole] = useState('startup');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [isCustomEmailActive, setIsCustomEmailActive] = useState(false);

  const handleGoogleLogin = async (selectedEmail: string) => {
    setIsLoading(true);
    setShowGoogleModal(false);
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: selectedEmail,
          role: 'admin',
          mode: 'login'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('user', JSON.stringify(data.user));
        sessionStorage.setItem('token', data.token);
        navigate('/admin');
      } else {
        alert(data.message || 'Google login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      alert('Network error during Google authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateCaptcha = () => Math.random().toString(36).substring(2, 8).toUpperCase();
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus('');

    // Captcha Validation
    if (captcha.toUpperCase() !== captchaCode) {
      alert('Invalid Captcha. Please try again.');
      refreshCaptcha();
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Verification: Ensure selected role matches account role
        if (data.user.role !== selectedRole) {
          alert(`This account is registered as a ${data.user.role}. Please select the ${data.user.role} tab to login.`);
          setIsLoading(false);
          return;
        }

        // Store user info and token
        sessionStorage.setItem('user', JSON.stringify(data.user));
        sessionStorage.setItem('token', data.token);

        // Redirect based on role
        if (data.user.role === 'officer') {
          navigate('/officer');
        } else if (data.user.role === 'customer') {
          navigate('/store');
        } else if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert(data.message || 'Login failed');
        if (data.message === 'Invalid credentials') {
          refreshCaptcha();
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Network error. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setCaptcha('');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex relative">
      {/* Back Button - Moved to top left of screen */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors bg-white/90 hover:bg-white px-3 py-2 rounded-lg shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>
      {/* Left Side - Images */}
      <div className="hidden lg:flex lg:w-1/2 h-screen relative overflow-hidden items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80")`
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

            <h1 className="text-3xl font-bold mb-2">e-Ayush Portal</h1>
            <p className="text-base mb-4 text-blue-100 font-medium">
              Ministry of Ayush, Govt. of India
            </p>
            <p className="text-xs text-blue-200 leading-relaxed mb-8 opacity-90">
              Unified digital platform for AYUSH drug manufacturing licenses and retail marketplace.
            </p>

            {/* Decorative Elements */}
            <div className="flex justify-center space-x-6 opacity-60">
              <div className="text-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-1.5 mx-auto">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div className="text-[10px]">Secure</div>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-1.5 mx-auto">
                  <RefreshCw className="w-5 h-5 text-white" />
                </div>
                <div className="text-[10px]">Sync</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">


        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-lg"
        >
          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#002b5b] to-[#1e3a8a] px-6 py-5 text-center text-white relative">
              {/* Decorative shapes */}
              <div className="absolute top-3 left-6 w-5 h-5 bg-white/20 rounded transform rotate-45"></div>
              <div className="absolute bottom-3 right-6 w-6 h-6 bg-white/10 rounded-full"></div>

              <h2 className="text-xl font-bold">Welcome to e-Ayush</h2>
            </div>

            {/* Form Section */}
            <div className="px-8 py-7">
              {/* Role Selection Tabs */}
              <div className="mb-6">
                <Tabs value={selectedRole} onValueChange={setSelectedRole} className="w-full">
                  <TabsList className="flex w-full h-9 bg-gray-100 p-1 rounded-xl shadow-inner overflow-x-auto no-scrollbar gap-0.5">
                    <TabsTrigger value="startup" className="rounded-lg flex-1 min-w-fit px-2 text-[8px] sm:text-[9.5px] flex items-center justify-center gap-1 ">
                      <Building2 className="w-3 h-3 shrink-0" />
                      Startup
                    </TabsTrigger>
                    <TabsTrigger value="officer" className="rounded-lg flex-1 min-w-fit px-2 text-[8px] sm:text-[9.5px] flex items-center justify-center gap-1 ">
                      <UserCog className="w-3 h-3 shrink-0" />
                      Officer
                    </TabsTrigger>
                    <TabsTrigger value="customer" className="rounded-lg flex-1 min-w-fit px-2 text-[8px] sm:text-[9.5px] flex items-center justify-center gap-1 ">
                      <ShoppingBag className="w-3 h-3 shrink-0" />
                      Customer
                    </TabsTrigger>
                    <TabsTrigger value="admin" className="rounded-lg flex-1 min-w-fit px-2 text-[8px] sm:text-[9.5px] flex items-center justify-center gap-1 data-[state=active]:bg-white data-[state=active]:shadow-md">
                      <ShieldCheck className="w-3 h-3 shrink-0" />
                      Admin
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {selectedRole === 'admin' ? (
                <div className="space-y-6 text-center py-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto border border-blue-100 mb-2">
                    <ShieldCheck className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-800">Admin Authentication</h3>
                    <p className="text-xs text-gray-500 mt-1">To access the administrator console, please sign in with your verified government Google workspace account.</p>
                  </div>
                  
                  <Button
                    type="button"
                    onClick={() => setShowGoogleModal(true)}
                    disabled={isLoading}
                    className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 h-11 border border-gray-300 rounded-xl shadow-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                    Continue with Google
                  </Button>
                  
                  <div className="text-center text-xs text-gray-500">
                    Need an admin account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Request Google Signup</Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLogin} className="space-y-3">
                  {/* Username Field */}
                  <div>
                    <Label htmlFor="email" className="text-[13px] font-semibold text-gray-700 mb-1.5 block">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Email Address"
                      className="w-full px-4 py-2 h-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <div className="flex justify-end mt-1">
                      <Link to="/forgot-password" title="forgot-password" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <Label htmlFor="password" className="text-[13px] font-semibold text-gray-700 mb-1.5 block">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                        className="w-full px-4 py-2 h-10 text-sm pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <Label htmlFor="captcha" className="text-[13px] font-semibold text-gray-700 mb-2 block">
                      Captcha <span className="text-red-500">*</span>
                    </Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-white border border-gray-300 px-3 py-1.5 rounded-lg font-mono text-base font-bold text-gray-800 select-none tracking-widest shadow-sm">
                          {captchaCode}
                        </div>
                        <button
                          type="button"
                          onClick={refreshCaptcha}
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                          title="Refresh Captcha"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <Input
                          id="captcha"
                          type="text"
                          value={captcha}
                          onChange={(e) => setCaptcha(e.target.value)}
                          placeholder="Enter Code"
                          className="flex-1 h-9 text-sm px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 h-11 text-lg font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]"
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </div>

                  {/* Sign Up Link */}
                  <div className="text-center mt-6 text-sm text-gray-600">
                    New here? <Link to="/register" className="text-blue-600 font-bold hover:underline ml-1">Sign up</Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Google Sign-In Account Chooser Modal */}
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
            <DialogTitle className="text-lg font-bold text-gray-800">Sign in with Google</DialogTitle>
            <p className="text-xs text-gray-500 mt-1">Choose an account to continue to e-Ayush Portal</p>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {!isCustomEmailActive ? (
              <>
                {/* Preset Accounts */}
                {[
                  { name: 'National AYUSH Admin', email: 'admin@ayush.gov.in', initial: 'A' },
                  { name: 'Senior AYUSH Administrator', email: 'barath@ayush.gov.in', initial: 'B' }
                ].map((account) => (
                  <button
                    key={account.email}
                    onClick={() => handleGoogleLogin(account.email)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50/30 transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs group-hover:scale-105 transition-transform">
                      {account.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{account.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{account.email}</p>
                    </div>
                  </button>
                ))}

                <button
                  onClick={() => setIsCustomEmailActive(true)}
                  className="w-full flex items-center justify-center p-3 rounded-xl border border-dashed border-gray-300 hover:border-blue-400 hover:bg-slate-50 transition-all text-xs text-blue-600 font-semibold"
                >
                  Use another Google Account
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="google-email" className="text-xs font-semibold text-gray-700 block mb-1">
                    Google Email Address
                  </Label>
                  <Input
                    id="google-email"
                    type="email"
                    placeholder="name@gmail.com or name@gov.in"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="h-10 text-sm border-gray-300 rounded-xl"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCustomEmailActive(false);
                      setCustomGoogleEmail('');
                    }}
                    className="flex-1 h-10 text-xs font-bold rounded-xl"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      if (!customGoogleEmail || !customGoogleEmail.includes('@')) {
                        alert('Please enter a valid Google email address.');
                        return;
                      }
                      handleGoogleLogin(customGoogleEmail);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-10 text-xs font-bold rounded-xl"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
