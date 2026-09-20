import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Mail, Phone, Lock, User as UserIcon, ArrowRight, ShieldCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    loginWithEmail,
    registerWithEmail,
    verifyOtp,
    showToast,
    switchUserRole,
  } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Missing details', 'Please provide your email and password.', 'error');
      return;
    }
    setLoading(true);
    const success = await loginWithEmail(email, password);
    setLoading(false);
    if (success) {
      setIsAuthModalOpen(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Missing details', 'Please fill in all mandatory fields.', 'error');
      return;
    }
    setLoading(true);
    const success = await registerWithEmail(name, email, password, phone);
    setLoading(false);
    if (success) {
      setIsAuthModalOpen(false);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      showToast('Invalid Mobile Number', 'Please enter a 10-digit mobile number.', 'error');
      return;
    }
    setOtpSent(true);
    setOtp('1234'); // Auto-fill demo convenience
    showToast('OTP Dispatched', 'Demo code 1234 sent to ' + phone);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    const success = await verifyOtp(phone, otp);
    setLoading(false);
    if (success) {
      setIsAuthModalOpen(false);
    }
  };

  const handleGoogleAuth = () => {
    showToast('Connecting with Google', 'Authenticating secure session...');
    setTimeout(() => {
      loginWithEmail('ananya.sharma@example.com', 'password123');
      setIsAuthModalOpen(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] max-w-md w-full rounded-2xl shadow-2xl border border-[#EAE6DF] overflow-hidden flex flex-col relative">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#7A746E] hover:text-[#1A1A1A] hover:bg-[#EFEAE1] transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pt-8 pb-4 px-8 text-center bg-gradient-to-b from-[#F2EDE2] to-[#FAF8F5] border-b border-[#EAE6DF]">
          <span className="font-serif text-2xl font-bold tracking-[0.25em] text-[#1A1A1A] block">
            NEXORA
          </span>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#8C8275] mt-1">
            Privileged Fashion Membership
          </p>

          {/* Tab Selector */}
          {!forgotPasswordOpen && (
            <div className="flex bg-[#EAE4D9] p-1 rounded-xl mt-5">
              <button
                onClick={() => setAuthModalTab('login')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  authModalTab === 'login' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-[#6B655D]'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthModalTab('register')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  authModalTab === 'register' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-[#6B655D]'
                }`}
              >
                Register
              </button>
              <button
                onClick={() => setAuthModalTab('otp')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  authModalTab === 'otp' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-[#6B655D]'
                }`}
              >
                Mobile OTP
              </button>
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {forgotPasswordOpen ? (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">Reset Your Password</h3>
                <p className="text-xs text-[#706A62] mt-1">
                  Enter your registered email and we will send a secure password recovery link.
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4A453F] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#999] absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-white border border-[#DCD4C7] pl-9 pr-3 py-2 text-xs rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#B38F4D]"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  showToast('Reset link sent', 'Please check your email inbox.');
                  setForgotPasswordOpen(false);
                }}
                className="w-full py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl hover:bg-[#333] transition-colors"
              >
                Send Recovery Instructions
              </button>
              <button
                onClick={() => setForgotPasswordOpen(false)}
                className="w-full text-center text-xs text-[#706A62] hover:underline pt-2 block"
              >
                Back to Sign In
              </button>
            </div>
          ) : authModalTab === 'login' ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A453F] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#999] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ananya.sharma@example.com"
                    className="w-full bg-white border border-[#DCD4C7] pl-9 pr-3 py-2.5 text-xs rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#B38F4D]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#4A453F]">Password</label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    className="text-[11px] text-[#B38F4D] hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#999] absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-[#DCD4C7] pl-9 pr-3 py-2.5 text-xs rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#B38F4D]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase rounded-xl hover:bg-[#333] transition-colors flex items-center justify-center gap-1.5 shadow-md mt-2"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to NEXORA'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Fast 1-click Demo Fill */}
              <div className="pt-2 border-t border-[#EAE4D9]">
                <p className="text-[11px] text-[#7A746E] text-center mb-2">Instant Demo Access:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('ananya.sharma@example.com');
                      setPassword('demo1234');
                      loginWithEmail('ananya.sharma@example.com', 'demo1234');
                      setIsAuthModalOpen(false);
                    }}
                    className="py-1.5 px-2 bg-[#F2EDE2] hover:bg-[#E8E0D0] text-[11px] font-medium text-[#4A453F] rounded-lg border border-[#DCD4C7] truncate"
                  >
                    👤 Shopper Ananya
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      switchUserRole('super_admin');
                      setIsAuthModalOpen(false);
                    }}
                    className="py-1.5 px-2 bg-[#F5EFE0] hover:bg-[#EBDEBF] text-[11px] font-semibold text-[#8C6B24] rounded-lg border border-[#DEC795] truncate"
                  >
                    ⚡ Super Admin
                  </button>
                </div>
              </div>
            </form>
          ) : authModalTab === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#4A453F] mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#999] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Diya Patel"
                    className="w-full bg-white border border-[#DCD4C7] pl-9 pr-3 py-2 text-xs rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#B38F4D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A453F] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#999] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="diya@example.com"
                    className="w-full bg-white border border-[#DCD4C7] pl-9 pr-3 py-2 text-xs rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#B38F4D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A453F] mb-1">Mobile Number (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#999] absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full bg-white border border-[#DCD4C7] pl-9 pr-3 py-2 text-xs rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#B38F4D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A453F] mb-1">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#999] absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-white border border-[#DCD4C7] pl-9 pr-3 py-2 text-xs rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#B38F4D]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase rounded-xl hover:bg-[#333] transition-colors flex items-center justify-center gap-1.5 shadow-md mt-2"
              >
                <span>Create Privileged Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            /* Mobile OTP */
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A453F] mb-1">
                      10-Digit Mobile Number
                    </label>
                    <div className="flex">
                      <span className="bg-[#EAE4D9] border border-[#DCD4C7] border-r-0 px-3 py-2.5 text-xs text-[#555] rounded-l-xl font-medium">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full bg-white border border-[#DCD4C7] px-3 py-2.5 text-xs rounded-r-xl text-[#1A1A1A] focus:outline-none focus:border-[#B38F4D]"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase rounded-xl hover:bg-[#333] transition-colors"
                  >
                    Send One-Time Passcode
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-center">
                    <p className="text-xs text-[#706A62]">
                      Verification code sent to <span className="font-semibold text-[#1A1A1A]">{phone}</span>
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A453F] mb-1">Enter 4-Digit OTP</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="1234"
                      className="w-full bg-white border border-[#DCD4C7] py-2.5 text-center text-lg font-mono tracking-[0.4em] rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#B38F4D]"
                    />
                    <span className="text-[10px] text-[#8C8275] block text-center mt-1">
                      Demo auto-code: 1234
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase rounded-xl hover:bg-[#333] transition-colors"
                  >
                    Verify & Access Bag
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full text-center text-xs text-[#706A62] hover:underline"
                  >
                    Change Phone Number
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Social Sign In */}
          {!forgotPasswordOpen && (
            <div className="mt-5 pt-4 border-t border-[#EAE4D9] text-center">
              <span className="text-[10px] uppercase tracking-wider text-[#8C8275] block mb-3 font-medium">
                Or Continue With
              </span>
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full py-2 px-3 border border-[#DCD4C7] rounded-xl text-xs font-semibold text-[#3A3631] bg-white hover:bg-[#F9F7F2] transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          )}

          {/* Privacy Note */}
          <div className="mt-4 flex items-center justify-center gap-1 text-[10px] text-[#999]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B38F4D]" />
            <span>256-bit encrypted authentication • Strict privacy protocol</span>
          </div>
        </div>
      </div>
    </div>
  );
};
