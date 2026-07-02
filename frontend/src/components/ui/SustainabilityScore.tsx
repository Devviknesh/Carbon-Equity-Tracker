import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface SustainabilityScoreProps {
  score: number; // 0-100
}

function getCategory(score: number): { label: string; color: string; desc: string } {
  if (score >= 75) return { label: 'Excellent',   color: '#10b981', desc: 'Well below average emissions' };
  if (score >= 50) return { label: 'Good',        color: '#06b6d4', desc: 'Slightly below average' };
  if (score >= 30) return { label: 'Fair',        color: '#f59e0b', desc: 'Near average emissions' };
  return              { label: 'Needs Work',  color: '#ef4444', desc: 'Above average — take action' };
}

export const SustainabilityScore: React.FC<SustainabilityScoreProps> = ({ score }) => {
  const clamped = Math.min(100, Math.max(0, score));
  const cat = getCategory(clamped);
  const data = [{ value: clamped, fill: cat.color }];

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Sustainability Score</span>

      <div className="relative w-40 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="65%"
            outerRadius="90%"
            data={data}
            startAngle={220}
            endAngle={-40}
            barSize={10}
          >
            <RadialBar
              background={{ fill: 'rgba(255,255,255,0.05)' }}
              dataKey="value"
              cornerRadius={8}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'backOut' }}
            className="text-3xl font-black"
            style={{ color: cat.color }}
          >
            {Math.round(clamped)}
          </motion.span>
          <span className="text-xs text-slate-500 font-semibold">/ 100</span>
        </div>
      </div>

      <div className="text-center">
        <span className="text-sm font-bold" style={{ color: cat.color }}>{cat.label}</span>
        <p className="text-xs text-slate-500 mt-0.5">{cat.desc}</p>
      </div>
    </div>
  );
};

export default SustainabilityScore;
