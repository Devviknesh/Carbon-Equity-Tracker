import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Mail, Lock, LogIn, AlertTriangle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const Login: React.FC = () => {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]           = useState('');
  const [emailWarning, setEmailWarning] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const checkEmailExistence = async (emailToCheck: string) => {
    if (!emailToCheck) { setEmailWarning(''); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToCheck)) { setEmailWarning('Please enter a valid email address.'); return; }
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/check-email`, { email: emailToCheck });
      setEmailWarning(res.data.exists ? '' : 'This email is not registered. Please sign up first.');
    } catch { setEmailWarning(''); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (emailWarning) { setError('Please resolve all validation errors.'); return; }
    setIsSubmitting(true); setError('');
    try {
      await login(email, password);
      const payload = JSON.parse(atob(localStorage.getItem('token')!.split('.')[1]));
      if (payload.role === 'ADMIN') navigate('/admin-dashboard');
      else if (payload.role === 'INDUSTRY') navigate('/industry-dashboard');
      else navigate('/user-dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials or connection issue.');
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Warm glow */}
      <div className="hero-warm-glow fixed inset-0 z-0 opacity-40 pointer-events-none" />

      {/* Left branding panel */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-1/2 p-14 relative z-10 border-r border-border"
      >
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center">
            <Leaf className="w-4.5 h-4.5 text-accent-primary" />
          </div>
          <span className="font-bold text-base text-ink-primary">
            Carbon<span className="text-accent-primary">Equity</span>
          </span>
        </Link>

        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4 text-ink-primary">
            Monitor your carbon
            <br />
            <span className="font-serif-italic text-accent-primary">footprint in real-time.</span>
          </h2>
          <p className="text-ink-muted leading-relaxed max-w-sm text-sm">
            Individuals, industries, and administrators — all in one platform.
            Scientifically grounded emission calculations.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              { label: 'Emission Factors', val: '4+' },
              { label: 'Roles Supported',  val: '3' },
              { label: 'Real-time Calc',   val: '✓' },
            ].map((s, i) => (
              <div key={i} className="dark-card p-4 text-center">
                <div className="text-xl font-bold text-accent-primary">{s.val}</div>
                <div className="text-[10px] text-ink-muted mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-ink-muted">© {new Date().getFullYear()} Carbon Equity Tracker</p>
      </motion.div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="flex items-center gap-1.5 mb-8 lg:hidden text-ink-muted hover:text-ink-secondary text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="dark-card p-7">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-ink-primary">Welcome back</h1>
              <p className="text-ink-muted text-sm mt-1">Sign in to your Carbon Equity account</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-sm bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-5"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (emailWarning) setEmailWarning(''); }}
                    onBlur={e => checkEmailExistence(e.target.value)}
                    placeholder="name@company.com"
                    className={`dark-input pl-10 ${emailWarning ? 'border-red-500/50' : ''}`}
                    required
                  />
                </div>
                {emailWarning && (
                  <p className="text-xs text-red-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {emailWarning === 'This email is not registered. Please sign up first.'
                      ? <><span>Not registered. </span><Link to="/signup" className="text-accent-primary underline">Sign up first</Link>.</>
                      : emailWarning
                    }
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="dark-input pl-10 pr-10"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-secondary transition-colors" tabIndex={-1}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-orange w-full justify-center py-2.5 mt-1">
                {isSubmitting
                  ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <><LogIn className="w-4 h-4" /><span>Sign In</span></>
                }
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-ink-muted">
              No account?{' '}
              <Link to="/signup" className="text-accent-primary font-semibold hover:underline">Create one free</Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-3 dark-card p-4 text-xs text-ink-muted space-y-1">
            <p className="font-semibold text-ink-secondary mb-2">Demo Accounts:</p>
            <p>Individual: <span className="text-ink-primary">user1@tracker.com</span> / <span className="text-ink-primary">root</span></p>
            <p>Industry: <span className="text-ink-primary">industry100@tracker.com</span> / <span className="text-ink-primary">root</span></p>
            <p>Admin: <span className="text-ink-primary">admin@tracker.com</span> / <span className="text-ink-primary">admin123</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
