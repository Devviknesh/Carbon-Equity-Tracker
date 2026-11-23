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
  color?: 'orange' | 'neutral' | 'warm' | 'green' | 'cyan' | 'violet' | 'amber' | 'red';
  delay?: number;
}

const colorMap: Record<string, { icon: string; bg: string }> = {
  orange:  { icon: 'text-accent-primary',   bg: 'bg-accent-primary/10 border-accent-primary/20' },
  neutral: { icon: 'text-chart-neutral',    bg: 'bg-bg-elevated border-border' },
  warm:    { icon: 'text-accent-secondary', bg: 'bg-accent-secondary/10 border-accent-secondary/20' },
  // Legacy aliases
  green:   { icon: 'text-accent-primary',   bg: 'bg-accent-primary/10 border-accent-primary/20' },
  cyan:    { icon: 'text-chart-neutral',    bg: 'bg-bg-elevated border-border' },
  violet:  { icon: 'text-ink-secondary',    bg: 'bg-bg-elevated border-border' },
  amber:   { icon: 'text-accent-warm',      bg: 'bg-accent-warm/10 border-accent-warm/20' },
  red:     { icon: 'text-red-400',          bg: 'bg-red-500/10 border-red-500/20' },
};

const trendIcon = {
  up:      <TrendingUp  className="w-3.5 h-3.5" />,
  down:    <TrendingDown className="w-3.5 h-3.5" />,
  neutral: <Minus        className="w-3.5 h-3.5" />,
};
const trendColor = {
  up:      'text-red-400',
  down:    'text-green-500',
  neutral: 'text-ink-muted',
};

export const KpiCard: React.FC<KpiCardProps> = ({
  label, value, unit, icon, trend, trendLabel, color = 'orange', delay = 0,
}) => {
  const c = colorMap[color] ?? colorMap.orange;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="kpi-card group"
    >
      {/* Icon */}
      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${c.bg} ${c.icon}`}>
        {icon}
      </div>

      {/* Value */}
      <div className="flex items-end gap-1">
        <span className="text-2xl font-bold text-ink-primary tabular-nums">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-xs text-ink-muted font-medium mb-0.5">{unit}</span>}
      </div>

      {/* Label + Trend */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">{label}</span>
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
