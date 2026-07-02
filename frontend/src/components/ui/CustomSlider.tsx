import React from 'react';

interface CustomSliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  icon?: React.ReactNode;
  suffix?: string;
  className?: string;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({
  label, min, max, value, onChange, icon, suffix = '', className = '',
}) => {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
          {icon && <span className="text-accent-glow">{icon}</span>}
          <span>{label}</span>
        </div>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-lg"
          style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}
        >
          {value.toLocaleString()} {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
        style={{
          accentColor: '#10b981',
          background: `linear-gradient(to right, #10b981 ${pct}%, rgba(255,255,255,0.1) ${pct}%)`,
          borderRadius: '4px',
          height: '4px',
        }}
      />
      <div className="flex justify-between text-xs text-slate-600 font-medium">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default CustomSlider;
