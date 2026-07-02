import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts';

interface DataPoint { name: string; value: number; benchmark?: number; }

interface BenchmarkBarProps {
  data: DataPoint[];
  benchmarkValue?: number;
  benchmarkLabel?: string;
  colors?: string[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 rounded-xl bg-carbon-900/90 border border-white/10 text-sm backdrop-blur-xl">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="font-bold text-accent-glow">{Number(payload[0].value).toLocaleString()} <span className="font-normal text-slate-400">kg CO₂</span></p>
      </div>
    );
  }
  return null;
};

export const BenchmarkBar: React.FC<BenchmarkBarProps> = ({
  data,
  benchmarkValue,
  benchmarkLabel = 'Benchmark',
  colors = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'],
}) => {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        {benchmarkValue !== undefined && (
          <ReferenceLine
            y={benchmarkValue}
            stroke="#f59e0b"
            strokeDasharray="6 3"
            strokeWidth={1.5}
            label={{ value: benchmarkLabel, fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }}
          />
        )}
        <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={700}>
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BenchmarkBar;
