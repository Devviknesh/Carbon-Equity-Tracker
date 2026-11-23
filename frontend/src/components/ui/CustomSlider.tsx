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
        <div className="flex items-center gap-2 text-sm font-semibold text-ink-secondary">
          {icon && <span className="text-accent-primary">{icon}</span>}
          <span>{label}</span>
        </div>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-lg"
          style={{ background: 'rgba(232,117,66,0.12)', color: '#E87542' }}
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
          accentColor: '#E87542',
          background: `linear-gradient(to right, #E87542 ${pct}%, rgba(255,255,255,0.1) ${pct}%)`,
          borderRadius: '4px',
          height: '4px',
        }}
      />
      <div className="flex justify-between text-xs text-ink-muted font-medium">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default CustomSlider;
