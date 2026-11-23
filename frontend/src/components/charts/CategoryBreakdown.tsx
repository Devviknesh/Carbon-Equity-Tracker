import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataPoint { name: string; value: number; }
interface CategoryBreakdownProps { data: DataPoint[]; colors?: string[]; }

// Orange-warm palette instead of rainbow
const DEFAULT_COLORS = ['#E87542', '#A8A29E', '#57534E', '#F19A6D', '#302A26', '#1C1917'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 rounded-xl bg-bg-elevated border border-border text-sm shadow-card">
        <p className="font-semibold text-ink-primary">{payload[0].name}</p>
        <p className="text-accent-primary font-bold">{payload[0].value.toFixed(2)} <span className="font-normal text-ink-muted">kg CO₂</span></p>
        <p className="text-ink-muted text-xs">{(payload[0].percent * 100).toFixed(1)}% of total</p>
      </div>
    );
  }
  return null;
};

const renderLegend = (props: any) => {
  const { payload } = props;
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-2">
      {payload.map((entry: any, i: number) => (
        <li key={i} className="flex items-center gap-1.5 text-xs text-ink-muted font-medium">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: entry.color }} />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ data, colors = DEFAULT_COLORS }) => {
  const filtered = data.filter(d => d.value > 0);
  if (!filtered.length) {
    return <div className="h-[220px] flex items-center justify-center text-ink-muted text-sm">Adjust inputs to see allocation</div>;
  }
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={filtered} cx="50%" cy="45%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" animationBegin={0} animationDuration={700}>
          {filtered.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} stroke="#151312" strokeWidth={2} />)}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
  );
};
export default CategoryBreakdown;
