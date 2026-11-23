import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, User, Mail, Lock, UserPlus, AlertTriangle, Users, Building2, Phone, ChevronRight } from 'lucide-react';

const roleOptions = [
  {
    value: 'INDIVIDUAL' as const,
    label: 'Individual',
    icon: <Users className="w-5 h-5" />,
    desc: 'Track personal carbon footprint',
  },
  {
    value: 'INDUSTRY' as const,
    label: 'Industry',
    icon: <Building2 className="w-5 h-5" />,
    desc: 'Measure industrial emissions',
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
    if (!emailRegex.test(email)) { setError('Please enter a valid email address.'); return; }

    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(phone)) { setError('Please enter a valid mobile number (10–15 digits).'); return; }

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
    <div className="min-h-screen flex relative overflow-hidden bg-bg-primary">
      {/* Warm glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse at center, rgba(232,117,66,0.08) 0%, transparent 70%)' }} />
      </div>

      {/* Left branding panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-1/2 p-14 relative z-10"
      >
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center text-accent-primary">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-ink-primary">
            Carbon<span className="text-accent-primary">Equity</span>
          </span>
        </Link>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <p className="text-xs font-bold tracking-widest text-ink-muted uppercase mb-5">Join the platform</p>
            <h2 className="text-5xl font-extrabold leading-tight mb-5 text-ink-primary">
              Join the climate<br />
              <em className="font-serif not-italic italic text-accent-primary">accountability</em><br />
              movement.
            </h2>
            <p className="text-ink-secondary leading-relaxed max-w-sm text-base">
              Every kilogram of CO₂ measured is a step toward a sustainable future.
              Start your journey today — it's free.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 space-y-3.5"
          >
            {[
              'Free account — no credit card required',
              'Real-time calculation engine',
              'Historical log & trend analytics',
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-ink-secondary">
                <div className="w-5 h-5 rounded-full bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center text-accent-primary text-xs font-bold">✓</div>
                {f}
              </div>
            ))}
          </motion.div>
        </div>

        <p className="text-xs text-ink-muted">© {new Date().getFullYear()} Carbon Equity Tracker</p>
      </motion.div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center text-accent-primary">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="font-bold text-ink-primary">Carbon<span className="text-accent-primary">Equity</span></span>
          </div>

          <div className="dark-card p-8 md:p-10">
            <div className="mb-7">
              <h1 className="text-2xl font-extrabold text-ink-primary mb-1">Create your account</h1>
              <p className="text-ink-muted text-sm">Start measuring your carbon footprint today.</p>
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
                <label className="text-xs font-bold text-ink-muted uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-ink-muted pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jane Smith"
                    className="dark-input pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-ink-muted uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-ink-muted pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="jane@company.com"
                    className="dark-input pl-10"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-ink-muted uppercase tracking-wider">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-ink-muted pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1234567890"
                    className="dark-input pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-ink-muted uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-ink-muted pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="dark-input pl-10"
                    required
                  />
                </div>
              </div>

              {/* Role cards */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-ink-muted uppercase tracking-wider">Account Type</label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  {roleOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRole(opt.value)}
                      className={`flex flex-col items-start gap-1.5 p-4 rounded-xl border transition-all duration-200 text-left ${
                        role === opt.value
                          ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                          : 'border-border bg-bg-card text-ink-secondary hover:border-accent-primary/40 hover:bg-bg-elevated'
                      }`}
                    >
                      {opt.icon}
                      <span className="font-bold text-sm mt-1 text-ink-primary">{opt.label}</span>
                      <span className="text-xs text-ink-muted">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-orange w-full py-3 mt-1 text-base"
              >
                {isSubmitting
                  ? <div className="w-5 h-5 border-2 border-bg-primary border-t-transparent rounded-full animate-spin" />
                  : <><UserPlus className="w-5 h-5" /><span>Create Account</span></>
                }
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-accent-primary font-semibold hover:underline">
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
