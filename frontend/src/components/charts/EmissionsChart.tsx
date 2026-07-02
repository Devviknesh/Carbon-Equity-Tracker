import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface EmissionsChartProps {
  type: 'pie' | 'bar';
  data: ChartData[];
  colors?: string[];
}

export const EmissionsChart: React.FC<EmissionsChartProps> = ({
  type,
  data,
  colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
}) => {
  if (type === 'pie') {
    return (
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(12, 36, 25, 0.9)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              formatter={(value) => <span className="text-slate-600 dark:text-forest-200 text-xs font-semibold">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.08)" />
          <XAxis dataKey="name" stroke="currentColor" fontSize={11} opacity={0.6} tickLine={false} />
          <YAxis stroke="currentColor" fontSize={11} opacity={0.6} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(12, 36, 25, 0.9)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Bar dataKey="value" fill={colors[0]} radius={[6, 6, 0, 0]} maxBarSize={45}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default EmissionsChart;
