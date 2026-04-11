import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Eye, EyeOff, RefreshCw, ArrowLeft, Building2, UserCog, ShieldCheck, ShoppingBag, ClipboardCheck } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function Login() {
  usePageTitle('Login');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [selectedRole, setSelectedRole] = useState('startup');

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
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
