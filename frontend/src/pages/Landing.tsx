import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Leaf, ArrowRight, Plus, BarChart2, Scale, FileText, ChevronRight,
  Bell, Search, LayoutDashboard, LineChart, FileBarChart, GitCompareArrows, Settings,
} from 'lucide-react';
import {
  LineChart as ReLineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

/* ─── Animation helpers ─────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

/* ─── Demo data for dashboard preview ──────────────────────────────── */
const trendData = [
  { m: 'Jul', v: 42 }, { m: 'Aug', v: 51 }, { m: 'Sep', v: 48 },
  { m: 'Oct', v: 63 }, { m: 'Nov', v: 57 }, { m: 'Dec', v: 71 },
  { m: 'Jan', v: 65 }, { m: 'Feb', v: 78 }, { m: 'Mar', v: 82 },
];
const sectorData = [
  { name: 'Energy',    v: 65, fill: '#57534E' },
  { name: 'Transport', v: 48, fill: '#57534E' },
  { name: 'Industry',  v: 82, fill: '#E87542' },
  { name: 'Agri',      v: 37, fill: '#57534E' },
  { name: 'Others',    v: 29, fill: '#57534E' },
];

const navLinks = ['Home', 'Platform', 'Methodology', 'Reports', 'About'];

/* ─── Feature cards data ────────────────────────────────────────────── */
const features = [
  {
    num: '01',
    icon: <Leaf className="w-5 h-5 text-chart-neutral" />,
    title: 'Carbon\nFootprint',
    tags: ['Track emissions', 'across sectors'],
    desc: 'Track emissions across sectors with real-time calculations.',
  },
  {
    num: '02',
    icon: <BarChart2 className="w-5 h-5 text-chart-neutral" />,
    title: 'Industry\nBenchmarking',
    tags: ['Compare performance', 'across industries'],
    desc: 'Compare industrial emission performance across sectors.',
  },
  {
    num: '03',
    icon: <Scale className="w-5 h-5 text-chart-neutral" />,
    title: 'Equity\nAnalytics',
    tags: ['Measure fairness', 'in sustainability'],
    desc: 'Measure fairness and equity in sustainability outcomes.',
  },
  {
    num: '04',
    icon: <FileText className="w-5 h-5 text-chart-neutral" />,
    title: 'Impact\nReporting',
    tags: ['Generate insightful', 'reports'],
    desc: 'Generate insightful reports with actionable sustainability data.',
  },
];

/* ─── Component ─────────────────────────────────────────────────────── */
export const Landing: React.FC = () => {
  const [activeNav, setActiveNav] = useState('Home');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary text-ink-primary overflow-x-hidden">

      {/* ══ NAVBAR ══════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-border/60 bg-bg-primary/90 backdrop-blur-sm">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-accent-primary" />
          </div>
          <span className="text-sm font-semibold text-ink-primary tracking-tight">
            Carbon Equity<br className="hidden" />
            <span className="text-[10px] text-ink-muted block leading-none -mt-0.5">Tracker</span>
          </span>
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map(link => (
            <button
              key={link}
              onClick={() => setActiveNav(link)}
              className={`text-sm transition-colors duration-150 pb-0.5 relative ${
                activeNav === link
                  ? 'text-ink-primary font-medium'
                  : 'text-ink-muted hover:text-ink-secondary'
              }`}
            >
              {link}
              {activeNav === link && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-0.5 left-0 right-0 h-px bg-accent-primary"
                />
              )}
            </button>
          ))}
        </div>

        {/* Open Dashboard */}
        <Link to="/login" className="btn-white text-xs px-4 py-2">
          Open Dashboard <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </nav>

      {/* ══ HERO ════════════════════════════════════════════════════ */}
      <section className="relative pt-28 pb-0 px-6 overflow-hidden min-h-[88vh] flex flex-col items-center justify-center">
        {/* Warm bronze glow at bottom */}
        <div className="hero-warm-glow absolute inset-0 z-0" />

        {/* Grid texture */}
        <div
          className="absolute inset-0 z-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(rgba(232,117,66,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232,117,66,0.03) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
          }}
        />

        {/* Hero frame */}
        <div className="relative z-10 w-full max-w-3xl mx-auto">
          {/* Thin rectangular frame */}
          <div
            className="relative border border-border/70 rounded-sm px-10 pt-14 pb-16 text-center"
            style={{ background: 'rgba(8,8,7,0.3)' }}
          >
            {/* Corner markers (orange squares) */}
            {[
              'absolute -top-1 -left-1 w-2.5 h-2.5 bg-accent-primary',
              'absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent-primary',
              'absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-accent-primary',
              'absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-accent-primary',
            ].map((cls, i) => <div key={i} className={cls} />)}

            {/* Floating pill labels */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute left-0 top-1/3 -translate-x-1/2 -translate-y-1/2"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-primary/90 text-white text-xs font-semibold shadow-orange-sm whitespace-nowrap">
                Transparent
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="absolute right-0 top-1/5 translate-x-1/2 -translate-y-1/2"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-elevated border border-border text-ink-secondary text-xs font-medium whitespace-nowrap">
                Data-driven
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="absolute right-0 bottom-1/4 translate-x-1/3"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-warm/90 text-bg-primary text-xs font-semibold whitespace-nowrap">
                Equity focused
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-4"
            >
              Measure Carbon.
              <br />
              Understand{' '}
              <span className="font-serif-italic text-accent-primary text-shadow-orange">
                equity.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-ink-secondary text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-10"
            >
              Track emissions. Compare industries. Make sustainability measurable and equitable.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex items-center justify-center gap-3"
            >
              <Link
                to="/login"
                className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-border text-ink-primary text-sm font-medium hover:border-accent-primary hover:text-accent-primary transition-all duration-200 group"
              >
                <span className="w-7 h-7 rounded-full bg-accent-primary flex items-center justify-center group-hover:bg-accent-secondary transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </span>
                Explore the platform
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ ABOUT SECTION ═══════════════════════════════════════════ */}
      <section className="py-20 px-6 text-center border-t border-border/40">
        <motion.div {...fadeUp(0.1)} className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 justify-center mb-6">
            <div className="h-px flex-1 bg-border/60 max-w-24" />
            <span className="section-label tracking-[0.25em]">About the Platform</span>
            <div className="h-px flex-1 bg-border/60 max-w-24" />
          </div>
          <p className="text-xl md:text-2xl font-light text-ink-secondary leading-relaxed">
            Carbon Equity Tracker combines emissions measurement, industry comparisons and equitable
            sustainability insights to help build a{' '}
            <span className="text-ink-primary font-medium">greener, fairer future.</span>
          </p>
        </motion.div>
      </section>

      {/* ══ FEATURES SECTION ════════════════════════════════════════ */}
      <section className="py-16 px-6 md:px-10 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <motion.div {...fadeUp(0.05)}>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Insights that
              <br />
              <span className="font-serif-italic text-accent-primary">drive change</span>
            </h2>
          </motion.div>
          <motion.div {...fadeUp(0.15)}>
            <Link
              to="/login"
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-border text-ink-secondary text-sm hover:border-accent-primary hover:text-accent-primary transition-all duration-200 group whitespace-nowrap"
            >
              <span className="w-7 h-7 rounded-full bg-accent-primary flex items-center justify-center group-hover:bg-accent-secondary transition-colors">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </span>
              View dashboard
            </Link>
          </motion.div>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.08)}
              className="dark-card p-6 flex flex-col gap-5 hover:border-border-light transition-all duration-200 group cursor-pointer"
              whileHover={{ y: -2 }}
            >
              {/* Number + icon row */}
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-ink-muted tracking-widest">{f.num}</span>
                <div className="w-8 h-8 rounded-lg bg-bg-elevated border border-border flex items-center justify-center group-hover:border-border-light transition-colors">
                  {f.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold leading-tight whitespace-pre-line text-ink-primary">
                {f.title}
              </h3>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {f.tags.map((tag, j) => (
                  <span key={j} className="feature-tag">{tag}</span>
                ))}
              </div>

              {/* Footer — orange plus */}
              <div className="mt-auto pt-2">
                <button
                  className="btn-circle-orange"
                  onClick={() => navigate('/login')}
                  aria-label="Learn more"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ DASHBOARD PREVIEW ═══════════════════════════════════════ */}
      <section className="py-10 px-6 md:px-10 max-w-7xl mx-auto pb-20">
        <motion.div
          {...fadeUp(0.1)}
          className="dashboard-preview shadow-card overflow-hidden"
        >
          {/* Preview top bar */}
          <div className="bg-bg-secondary border-b border-border px-5 py-3 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-accent-primary/20 border border-accent-primary/30 flex items-center justify-center">
                <Leaf className="w-3 h-3 text-accent-primary" />
              </div>
              <span className="text-xs font-semibold text-ink-secondary leading-tight">
                Carbon Equity<br />
                <span className="text-[9px] text-ink-muted">Tracker</span>
              </span>
            </div>
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-bg-elevated border border-border rounded-lg px-3 py-1.5 w-48">
              <Search className="w-3.5 h-3.5 text-ink-muted" />
              <span className="text-xs text-ink-muted">Search industries, regions…</span>
            </div>
            {/* Icons */}
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-ink-muted" />
              <div className="w-7 h-7 rounded-full bg-accent-primary flex items-center justify-center text-xs font-bold text-white">D</div>
            </div>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-36 border-r border-border bg-bg-secondary p-3 gap-1 min-h-64">
              {[
                { icon: <LayoutDashboard className="w-3.5 h-3.5" />, label: 'Dashboard', active: true },
                { icon: <LineChart className="w-3.5 h-3.5" />, label: 'Analytics' },
                { icon: <FileBarChart className="w-3.5 h-3.5" />, label: 'Reports' },
                { icon: <GitCompareArrows className="w-3.5 h-3.5" />, label: 'Comparisons' },
                { icon: <Settings className="w-3.5 h-3.5" />, label: 'Settings' },
              ].map(({ icon, label, active }) => (
                <div
                  key={label}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[11px] font-medium transition-colors ${
                    active
                      ? 'bg-accent-primary/10 text-accent-primary'
                      : 'text-ink-muted hover:text-ink-secondary'
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </div>
              ))}
            </aside>

            {/* Main content */}
            <div className="flex-1 p-4 bg-bg-primary">
              {/* KPI row */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Total Emissions', icon: <Leaf className="w-3 h-3 text-accent-primary" />, sparkColor: '#E87542' },
                  { label: 'Industry Average', icon: <BarChart2 className="w-3 h-3 text-chart-neutral" />, sparkColor: '#57534E' },
                  { label: 'Equity Index',    icon: <Scale className="w-3 h-3 text-chart-neutral" />,   sparkColor: '#57534E' },
                ].map(({ label, icon, sparkColor }, i) => (
                  <div key={i} className="bg-bg-card border border-border rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-2 text-[10px] text-ink-muted font-medium">
                      {icon} {label}
                    </div>
                    {/* Tiny sparkline */}
                    <ResponsiveContainer width="100%" height={28}>
                      <ReLineChart data={trendData.slice(i * 2)} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                        <Line type="monotone" dataKey="v" stroke={sparkColor} strokeWidth={1.5} dot={false} />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Emissions Trend */}
                <div className="bg-bg-card border border-border rounded-xl p-3 md:col-span-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-ink-secondary">Emissions Trend</span>
                    <div className="flex gap-1">
                      {['1M','3M','1Y','All'].map((t, i) => (
                        <span key={t} className={`text-[9px] px-1.5 py-0.5 rounded ${i === 2 ? 'bg-accent-primary text-white' : 'text-ink-muted'}`}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={70}>
                    <ReLineChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                      <CartesianGrid stroke="#302A26" strokeOpacity={0.4} vertical={false} />
                      <Line type="monotone" dataKey="v" stroke="#E87542" strokeWidth={2} dot={{ r: 2, fill: '#E87542' }} />
                    </ReLineChart>
                  </ResponsiveContainer>
                </div>

                {/* Sector Comparison */}
                <div className="bg-bg-card border border-border rounded-xl p-3">
                  <span className="text-[10px] font-semibold text-ink-secondary block mb-2">Sector Comparison</span>
                  <ResponsiveContainer width="100%" height={70}>
                    <BarChart data={sectorData} margin={{ top: 2, right: 2, bottom: 0, left: 0 }} barSize={10}>
                      <CartesianGrid stroke="#302A26" strokeOpacity={0.4} vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 7, fill: '#77716C' }} axisLine={false} tickLine={false} />
                      <Bar dataKey="v" radius={[2, 2, 0, 0]}>
                        {sectorData.map((entry, index) => (
                          <rect key={index} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Recent Activity */}
                <div className="bg-bg-card border border-border rounded-xl p-3">
                  <span className="text-[10px] font-semibold text-ink-secondary block mb-2">Recent Activity</span>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: 'New report generated', time: '7h ago', dot: '#E87542' },
                      { label: 'Industry comparison updated', time: '7h ago', dot: '#57534E' },
                      { label: 'Analysis completed', time: '5h ago', dot: '#E87542' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: item.dot }} />
                        <div>
                          <p className="text-[9px] text-ink-secondary leading-tight">{item.label}</p>
                          <p className="text-[8px] text-ink-muted">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <p className="text-center text-xs text-ink-muted mt-3">
          Illustrative preview — real data loads after login
        </p>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════ */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-accent-primary" />
            <span className="text-sm font-semibold text-ink-secondary">
              Carbon <span className="text-accent-primary">Equity</span> Tracker
            </span>
          </div>
          <span className="text-xs text-ink-muted">© {new Date().getFullYear()} — Sustainability analytics for a fairer future</span>
          <div className="flex gap-5">
            <Link to="/login"  className="text-xs text-ink-muted hover:text-ink-secondary transition-colors">Sign In</Link>
            <Link to="/signup" className="text-xs text-ink-muted hover:text-ink-secondary transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
