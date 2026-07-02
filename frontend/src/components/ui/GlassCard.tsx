import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card p-6 md:p-8 ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {children}
    </div>
  );
};
export default GlassCard;
