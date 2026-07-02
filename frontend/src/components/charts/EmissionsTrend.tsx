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
      <div className="px-3 py-2 rounded-xl bg-carbon-900/90 border border-white/10 text-sm backdrop-blur-xl">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="font-bold text-accent-glow">{payload[0].value.toFixed(2)} <span className="font-normal text-slate-400">kg CO₂</span></p>
      </div>
    );
  }
  return null;
};

export const EmissionsTrend: React.FC<EmissionsTrendProps> = ({
  data,
  color = '#10b981',
  label = 'Emissions',
}) => {
  if (!data.length) {
    return (
      <div className="h-[200px] flex items-center justify-center text-slate-500 text-sm">
        No trend data yet — log your first entry.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="name"
          tick={{ fill: '#64748b', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill="url(#trendGradient)"
          dot={false}
          activeDot={{ r: 5, fill: color, stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2 }}
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default EmissionsTrend;
