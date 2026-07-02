import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import { Leaf, Mail, Lock, LogIn, AlertTriangle, Eye, EyeOff, ArrowLeft, TrendingDown } from 'lucide-react';
import axios from 'axios';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailWarning, setEmailWarning] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const checkEmailExistence = async (emailToCheck: string) => {
    if (!emailToCheck) {
      setEmailWarning('');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToCheck)) {
      setEmailWarning('Please enter a valid email address.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/check-email', { email: emailToCheck });
      if (!res.data.exists) {
        setEmailWarning('This email is not registered. Please sign up first.');
      } else {
        setEmailWarning('');
      }
    } catch (err) {
      console.error('Error checking email registration status', err);
      setEmailWarning('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (emailWarning) {
      setError('Please resolve all validation errors.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await login(email, password);
      const payload = JSON.parse(atob(localStorage.getItem('token')!.split('.')[1]));
      if (payload.role === 'ADMIN')    navigate('/admin-dashboard');
      else if (payload.role === 'INDUSTRY') navigate('/industry-dashboard');
      else navigate('/user-dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials or connection issue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-carbon-950">
      <AnimatedBackground />

      {/* Left panel — branding */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative z-10"
      >
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-accent-glow">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg">Carbon<span className="text-accent-glow">Equity</span></span>
        </Link>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-accent-glow mb-6">
              <TrendingDown className="w-7 h-7" />
            </div>
            <h2 className="text-4xl font-extrabold leading-tight mb-4">
              Monitor your carbon<br />
              <span className="text-accent-glow">footprint in real-time.</span>
            </h2>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Individuals, industries, and administrators — all in one platform.
              Scientifically grounded emission calculations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 grid grid-cols-3 gap-4"
          >
            {[
              { label: 'Emission Factors', val: '4+' },
              { label: 'Roles Supported', val: '3' },
              { label: 'Real-time Calc', val: '✓' },
            ].map((s, i) => (
              <div key={i} className="glass-card p-4 text-center">
                <div className="text-xl font-black text-accent-glow">{s.val}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <p className="text-xs text-slate-600">© {new Date().getFullYear()} Carbon Equity Tracker</p>
      </motion.div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Back to Home</span>
          </Link>

          <div className="glass-card p-8">
            <div className="mb-7">
              <h1 className="text-2xl font-extrabold text-slate-50">Welcome back</h1>
              <p className="text-slate-400 text-sm mt-1">Sign in to your Carbon Equity account</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-2 text-sm bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl mb-5"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      if (emailWarning) setEmailWarning('');
                    }}
                    onBlur={e => checkEmailExistence(e.target.value)}
                    placeholder="name@company.com"
                    className={`glass-input pl-10 ${emailWarning ? 'border-rose-500/50 focus:border-rose-500' : ''}`}
                    required
                  />
                </div>
                {emailWarning && (
                  <div className="text-xs text-rose-400 mt-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {emailWarning === 'This email is not registered. Please sign up first.' ? (
                        <>
                          This email is not registered. Please{' '}
                          <Link to="/signup" className="text-emerald-400 underline hover:text-emerald-300">
                            sign up first
                          </Link>
                          .
                        </>
                      ) : (
                        emailWarning
                      )}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="glass-input pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3 mt-1 text-base"
              >
                {isSubmitting
                  ? <div className="w-5 h-5 border-2 border-carbon-950 border-t-transparent rounded-full animate-spin" />
                  : <><LogIn className="w-5 h-5" /><span>Sign In</span></>
                }
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-accent-glow font-semibold hover:underline">
                Create one free
              </Link>
            </p>
          </div>

          {/* Demo credentials hint */}
          <div className="mt-4 glass-card p-4 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-400 mb-2">Demo Accounts:</p>
            <p>Individual: <span className="text-slate-300">user1@tracker.com</span> / <span className="text-slate-300">root</span></p>
            <p>Industry: <span className="text-slate-300">industry100@tracker.com</span> / <span className="text-slate-300">root</span></p>
            <p>Admin: <span className="text-slate-300">admin@tracker.com</span> / <span className="text-slate-300">admin123</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
