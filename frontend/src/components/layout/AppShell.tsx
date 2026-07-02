import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './Navbar';

interface AppShellProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8,  transition: { duration: 0.2 } },
};

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-carbon-950 text-slate-100 relative">
      {/* Background aurora */}
      <div className="aurora-background" aria-hidden="true">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
        <div className="aurora-grid" />
      </div>

      {/* Sticky Navbar */}
      <Navbar />

      {/* Page Content */}
      <motion.main
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8 pb-16"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default AppShell;
