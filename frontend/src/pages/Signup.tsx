import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import { Leaf, User, Mail, Lock, UserPlus, AlertTriangle, ArrowLeft, Users, Building2, Phone } from 'lucide-react';

const roleOptions = [
  {
    value: 'INDIVIDUAL' as const,
    label: 'Individual',
    icon: <Users className="w-5 h-5" />,
    desc: 'Track personal carbon footprint',
    color: 'border-emerald-500/40 bg-emerald-500/8',
    activeColor: 'border-emerald-500 bg-emerald-500/15 text-emerald-300',
  },
  {
    value: 'INDUSTRY' as const,
    label: 'Industry',
    icon: <Building2 className="w-5 h-5" />,
    desc: 'Measure industrial process emissions',
    color: 'border-cyan-500/40 bg-cyan-500/8',
    activeColor: 'border-cyan-500 bg-cyan-500/15 text-cyan-300',
  },
];

export const Signup: React.FC = () => {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState<'INDIVIDUAL' | 'INDUSTRY'>('INDIVIDUAL');
  const [error, setError]       = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !phone) { setError('Please fill in all fields.'); return; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid mobile number (10 to 15 digits).');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await signup(name, email, password, role, phone);
      navigate(role === 'INDUSTRY' ? '/industry-dashboard' : '/user-dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-carbon-950">
      <AnimatedBackground />

      {/* Left branding panel */}
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
            <h2 className="text-4xl font-extrabold leading-tight mb-4">
              Join the climate<br />
              <span className="text-accent-glow">accountability movement.</span>
            </h2>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Every kilogram of CO₂ measured is a step toward a sustainable future.
              Start your journey today — it's free.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 space-y-3"
          >
            {['Free account — no credit card', 'Real-time calculation engine', 'Historical log & trend analytics'].map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-accent-glow text-xs font-bold">✓</div>
                {f}
              </div>
            ))}
          </motion.div>
        </div>

        <p className="text-xs text-slate-600">© {new Date().getFullYear()} Carbon Equity Tracker</p>
      </motion.div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 mb-6 lg:hidden">
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Back to Home</span>
          </Link>

          <div className="glass-card p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-slate-50">Create your account</h1>
              <p className="text-slate-400 text-sm mt-1">Start tracking your carbon footprint for free</p>
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

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" className="glass-input pl-10" required />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@company.com" className="glass-input pl-10" required />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1234567890" className="glass-input pl-10" required />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="glass-input pl-10" required />
                </div>
              </div>

              {/* Role cards */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Type</label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  {roleOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRole(opt.value)}
                      className={`flex flex-col items-start gap-1 p-4 rounded-xl border transition-all duration-200 text-left ${
                        role === opt.value ? opt.activeColor : 'border-white/10 bg-white/3 text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      {opt.icon}
                      <span className="font-bold text-sm mt-1">{opt.label}</span>
                      <span className="text-xs opacity-70">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3 mt-1 text-base"
              >
                {isSubmitting
                  ? <div className="w-5 h-5 border-2 border-carbon-950 border-t-transparent rounded-full animate-spin" />
                  : <><UserPlus className="w-5 h-5" /><span>Create Account</span></>
                }
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-accent-glow font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
