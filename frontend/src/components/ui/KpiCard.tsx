import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  color?: 'green' | 'cyan' | 'violet' | 'amber' | 'red';
  delay?: number;
}

const colorMap = {
  green:  { icon: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', glow: 'shadow-emerald-500/10' },
  cyan:   { icon: 'text-cyan-400',    bg: 'bg-cyan-500/10 border-cyan-500/20',       glow: 'shadow-cyan-500/10' },
  violet: { icon: 'text-violet-400',  bg: 'bg-violet-500/10 border-violet-500/20',   glow: 'shadow-violet-500/10' },
  amber:  { icon: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20',     glow: 'shadow-amber-500/10' },
  red:    { icon: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/20',       glow: 'shadow-rose-500/10' },
};

const trendIcon = {
  up:      <TrendingUp  className="w-3.5 h-3.5" />,
  down:    <TrendingDown className="w-3.5 h-3.5" />,
  neutral: <Minus        className="w-3.5 h-3.5" />,
};
const trendColor = {
  up:      'text-rose-400',
  down:    'text-emerald-400',
  neutral: 'text-slate-400',
};

export const KpiCard: React.FC<KpiCardProps> = ({
  label, value, unit, icon, trend, trendLabel, color = 'green', delay = 0,
}) => {
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="kpi-card group"
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${c.bg} ${c.icon} transition-transform duration-300 group-hover:scale-110`}>
        {icon}
      </div>

      {/* Value */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.15 }}
        className="flex items-end gap-1"
      >
        <span className="text-2xl font-black text-slate-50 tabular-nums">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-xs text-slate-500 font-semibold mb-1">{unit}</span>}
      </motion.div>

      {/* Label + Trend */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        {trend && trendLabel && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${trendColor[trend]}`}>
            {trendIcon[trend]}
            {trendLabel}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default KpiCard;
