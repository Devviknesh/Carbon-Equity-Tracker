import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Leaf, LogOut, Sun, Moon, Bell } from 'lucide-react';

const roleColors: Record<string, string> = {
  INDIVIDUAL: 'badge-green',
  INDUSTRY:   'badge-blue',
  ADMIN:      'badge-violet',
};

const roleLabel: Record<string, string> = {
  INDIVIDUAL: 'Individual',
  INDUSTRY:   'Industry',
  ADMIN:      'Admin',
};

export const Navbar: React.FC = () => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <nav className="saas-navbar">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 8, 0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-accent-glow border border-emerald-500/20"
          >
            <Leaf className="w-5 h-5" />
          </motion.div>
          <span className="font-bold text-base tracking-tight text-slate-100 hidden sm:block">
            Carbon<span className="text-accent-glow">Equity</span>
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Role Badge */}
          {user && (
            <span className={`hidden md:inline-flex ${roleColors[user.role] || 'badge-green'}`}>
              {roleLabel[user.role] || user.role}
            </span>
          )}

          {/* User chip */}
          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-carbon-950">
                {initials}
              </div>
              <span className="text-sm font-medium text-slate-200">{user.name}</span>
            </div>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn-ghost p-2"
            aria-label="Toggle theme"
          >
            {theme === 'dark'
              ? <Sun className="w-4 h-4 text-amber-400" />
              : <Moon className="w-4 h-4 text-slate-400" />
            }
          </button>

          {/* Logout */}
          <button onClick={handleLogout} className="btn-danger py-1.5 px-3 text-sm">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
