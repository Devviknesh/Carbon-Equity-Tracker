import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import {
  Leaf, BarChart2, Shield, Users, Building2, Database,
  ArrowRight, CheckCircle2, Zap, Globe, TrendingDown,
} from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

const features = [
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Individual Tracking',
    desc: 'Track daily commute, energy use, diet, and waste. Instantly see your personal carbon footprint and sustainability score.',
    color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    title: 'Industry Analytics',
    desc: 'Measure industrial process emissions — energy consumption, raw materials, waste, and transportation distance.',
    color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Admin Console',
    desc: 'Global dashboard with aggregate metrics, comparative analytics, and real-time activity across all users.',
    color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20',
  },
];

const steps = [
  { num: '01', title: 'Create Account', desc: 'Sign up as Individual, Industry, or Admin in under 30 seconds.' },
  { num: '02', title: 'Enter Parameters', desc: 'Input your activity data using interactive sliders and dropdowns.' },
  { num: '03', title: 'Get Instant Results', desc: 'See real-time CO₂ estimates powered by proven emission factors.' },
  { num: '04', title: 'Track Progress', desc: 'Monitor your trend over time and compare against benchmarks.' },
];

const techStack = [
  { label: 'React 18', color: '#61dafb' },
  { label: 'TypeScript', color: '#3178c6' },
  { label: 'Node.js', color: '#84cc16' },
  { label: 'Prisma', color: '#10b981' },
  { label: 'MySQL', color: '#f59e0b' },
  { label: 'Recharts', color: '#8b5cf6' },
  { label: 'Tailwind', color: '#06b6d4' },
  { label: 'Framer', color: '#ec4899' },
];

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen text-slate-100 relative overflow-x-hidden">
      <AnimatedBackground />

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 8, 0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-accent-glow"
          >
            <Leaf className="w-5 h-5" />
          </motion.div>
          <span className="font-bold text-lg tracking-tight">
            Carbon<span className="text-accent-glow">Equity</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login"  className="btn-ghost text-sm px-4 py-2">Sign In</Link>
          <Link to="/signup" className="btn-primary text-sm px-5 py-2">Get Started</Link>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative z-10 text-center px-6 pt-16 pb-24 max-w-5xl mx-auto">
        <motion.div {...fadeUp(0.1)}>
          <span className="badge-green mb-6 inline-flex">
            <TrendingDown className="w-3.5 h-3.5" />
            Open-source · Production-ready
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp(0.2)}
          className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6"
        >
          Track Your{' '}
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg,#10b981,#06b6d4,#8b5cf6)' }}
          >
            Carbon Impact
          </span>
          <br />Before It Tracks You.
        </motion.h1>

        <motion.p {...fadeUp(0.35)} className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          A SaaS platform for individuals, industries, and administrators to measure,
          monitor, and reduce carbon emissions — with real-time analytics and cinematic
          visualizations.
        </motion.p>

        <motion.div {...fadeUp(0.45)} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup" className="btn-primary text-base px-8 py-3.5 shadow-glow-md">
            Start Tracking Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/login" className="btn-secondary text-base px-8 py-3.5">
            Sign In
          </Link>
        </motion.div>

        {/* Hero stats */}
        <motion.div
          {...fadeUp(0.55)}
          className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-16 pt-10 border-t border-white/6"
        >
          {[
            { val: '100%', label: 'Free to Use' },
            { val: '3',    label: 'User Roles' },
            { val: 'Real-time', label: 'CO₂ Calculations' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-black text-accent-glow">{s.val}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Features ───────────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <motion.div {...fadeUp()} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Built for Every Role</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Three specialized dashboards, one unified platform.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} {...fadeUp(i * 0.12)} className="glass-card p-7">
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${f.bg} ${f.color}`}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <motion.div {...fadeUp()} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">How It Works</h2>
          <p className="text-slate-400 max-w-xl mx-auto">From sign-up to insight in four simple steps.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div key={i} {...fadeUp(i * 0.1)} className="glass-card p-6 relative">
              <span className="text-4xl font-black text-white/5 absolute top-4 right-4">{s.num}</span>
              <span className="text-xs font-black text-accent-glow uppercase tracking-widest block mb-3">{s.num}</span>
              <h3 className="font-bold mb-2">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ─────────────────────────────────────────── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
        <motion.div {...fadeUp()}>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-6">Built with modern stack</p>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((t, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/8 text-sm font-semibold"
                style={{ color: t.color }}
              >
                {t.label}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
        <motion.div
          {...fadeUp()}
          className="glass-card p-10 text-center"
          style={{ background: 'linear-gradient(135deg,rgba(16,185,129,.08),rgba(6,182,212,.05),rgba(139,92,246,.08))' }}
        >
          <Globe className="w-10 h-10 text-accent-glow mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold mb-3">Start Reducing Your Footprint Today</h2>
          <p className="text-slate-400 mb-7 max-w-lg mx-auto">
            Join Carbon Equity Tracker and turn your emissions data into actionable sustainability insights.
          </p>
          <Link to="/signup" className="btn-primary text-base px-10 py-3.5 shadow-glow-lg">
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/6 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-accent-glow" />
            <span>Carbon<strong className="text-accent-glow">Equity</strong> Tracker</span>
          </div>
          <span>© {new Date().getFullYear()} — Open Source SaaS for Climate Action</span>
          <div className="flex gap-4">
            <Link to="/login"  className="hover:text-slate-300 transition-colors">Sign In</Link>
            <Link to="/signup" className="hover:text-slate-300 transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
