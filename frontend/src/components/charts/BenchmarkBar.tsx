import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from 'recharts';

interface DataPoint { name: string; value: number; }
interface BenchmarkBarProps { data: DataPoint[]; benchmarkValue?: number; benchmarkLabel?: string; colors?: string[]; }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 rounded-xl bg-bg-elevated border border-border text-sm shadow-card">
        <p className="text-ink-muted text-xs mb-1">{label}</p>
        <p className="font-bold text-accent-primary">{Number(payload[0].value).toLocaleString()} <span className="font-normal text-ink-muted">kg CO₂</span></p>
      </div>
    );
  }
  return null;
};

export const BenchmarkBar: React.FC<BenchmarkBarProps> = ({
  data, benchmarkValue, benchmarkLabel = 'Benchmark',
  colors = ['#E87542', '#A8A29E'],
}) => (
  <ResponsiveContainer width="100%" height={220}>
    <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#302A26" strokeOpacity={0.5} vertical={false} />
      <XAxis dataKey="name" tick={{ fill: '#77716C', fontSize: 11 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: '#77716C', fontSize: 10 }} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip />} />
      {benchmarkValue !== undefined && (
        <ReferenceLine y={benchmarkValue} stroke="#F3E9A1" strokeDasharray="5 3" strokeWidth={1.5}
          label={{ value: benchmarkLabel, fill: '#F3E9A1', fontSize: 10, position: 'insideTopRight' }} />
      )}
      <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={700}>
        {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} fillOpacity={0.9} />)}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);
export default BenchmarkBar;
