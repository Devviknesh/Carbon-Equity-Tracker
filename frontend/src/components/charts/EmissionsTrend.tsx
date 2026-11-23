import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint { name: string; value: number; }
interface EmissionsTrendProps {
  data: DataPoint[];
  color?: string;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 rounded-xl bg-bg-elevated border border-border text-sm shadow-card">
        <p className="text-ink-muted text-xs mb-1">{label}</p>
        <p className="font-bold text-accent-primary">{payload[0].value.toFixed(2)} <span className="font-normal text-ink-muted">kg CO₂</span></p>
      </div>
    );
  }
  return null;
};

export const EmissionsTrend: React.FC<EmissionsTrendProps> = ({
  data,
  color = '#E87542',
  label = 'Emissions',
}) => {
  if (!data.length) {
    return (
      <div className="h-[200px] flex items-center justify-center text-ink-muted text-sm">
        No trend data yet — log your first entry.
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#302A26" strokeOpacity={0.5} />
        <XAxis dataKey="name" tick={{ fill: '#77716C', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#77716C', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone" dataKey="value"
          stroke={color} strokeWidth={2}
          fill="url(#trendGrad)" dot={false}
          activeDot={{ r: 4, fill: color, stroke: '#302A26', strokeWidth: 2 }}
          animationDuration={700}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default EmissionsTrend;
