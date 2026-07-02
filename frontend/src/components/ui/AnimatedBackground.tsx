import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle { x: number; y: number; size: number; speed: number; opacity: number; delay: number; }

export const AnimatedBackground: React.FC = () => {
  const particles: Particle[] = Array.from({ length: 18 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 15 + 12,
    opacity: Math.random() * 0.4 + 0.1,
    delay: Math.random() * 8,
  }));

  return (
    <div className="aurora-background" aria-hidden="true">
      {/* Aurora Orbs */}
      <div className="aurora-orb aurora-orb-1" />
      <div className="aurora-orb aurora-orb-2" />
      <div className="aurora-orb aurora-orb-3" />

      {/* Grid overlay */}
      <div className="aurora-grid" />

      {/* Floating Particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-accent-glow"
          style={{
            left: `${p.x}%`,
            bottom: '-4px',
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{ y: [0, -window.innerHeight - 20], opacity: [0, p.opacity, p.opacity, 0] }}
          transition={{
            duration: p.speed,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        />
      ))}

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(2,6,23,0.6) 100%)' }}
      />
    </div>
  );
};

export default AnimatedBackground;
