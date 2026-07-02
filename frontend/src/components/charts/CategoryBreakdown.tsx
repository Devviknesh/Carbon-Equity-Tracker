import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

interface DataPoint { name: string; value: number; }

interface CategoryBreakdownProps {
  data: DataPoint[];
  colors?: string[];
}

const DEFAULT_COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 rounded-xl bg-carbon-900/90 border border-white/10 text-sm backdrop-blur-xl">
        <p className="font-semibold text-slate-200">{payload[0].name}</p>
        <p className="text-accent-glow font-bold">{payload[0].value.toFixed(2)} <span className="font-normal text-slate-400">kg CO₂</span></p>
        <p className="text-slate-500 text-xs">{(payload[0].percent * 100).toFixed(1)}% of total</p>
      </div>
    );
  }
  return null;
};

const renderLegend = (props: any) => {
  const { payload } = props;
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-3">
      {payload.map((entry: any, i: number) => (
        <li key={i} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: entry.color }} />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  data, colors = DEFAULT_COLORS,
}) => {
  const filtered = data.filter(d => d.value > 0);

  if (!filtered.length) {
    return (
      <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">
        Adjust inputs to see allocation
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={filtered}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
          animationBegin={0}
          animationDuration={700}
        >
          {filtered.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryBreakdown;
