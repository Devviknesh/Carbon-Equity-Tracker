import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Leaf, LayoutDashboard, BarChart2, FileText, Scale,
  Settings, LogOut, Menu, X, Bell,
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.2 } },
};

const getRoleLinks = (role: string) => {
  const base = [
    { href: '/', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
    { href: '/analytics', icon: <BarChart2 className="w-4 h-4" />, label: 'Analytics' },
    { href: '/reports', icon: <FileText className="w-4 h-4" />, label: 'Reports' },
    { href: '/comparisons', icon: <Scale className="w-4 h-4" />, label: 'Comparisons' },
    { href: '/settings', icon: <Settings className="w-4 h-4" />, label: 'Settings' },
  ];
  if (role === 'INDIVIDUAL') {
    base[0] = { href: '/user-dashboard', icon: base[0].icon, label: 'Dashboard' };
  } else if (role === 'INDUSTRY') {
    base[0] = { href: '/industry-dashboard', icon: base[0].icon, label: 'Dashboard' };
  } else if (role === 'ADMIN') {
    base[0] = { href: '/admin-dashboard', icon: base[0].icon, label: 'Dashboard' };
  }
  return base;
};

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = user ? getRoleLinks(user.role) : [];

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const handleLogout = () => { logout(); navigate('/login'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center">
          <Leaf className="w-4 h-4 text-accent-primary" />
        </div>
        <div>
          <span className="text-sm font-bold text-ink-primary">Carbon Equity</span>
          <span className="text-[9px] text-ink-muted block leading-none">Tracker</span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {links.map(link => {
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div className="px-3 py-4 border-t border-border">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-accent-primary/20 border border-accent-primary/30 flex items-center justify-center text-xs font-bold text-accent-primary flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-ink-primary truncate">{user.name}</p>
              <p className="text-[10px] text-ink-muted truncate">{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-primary text-ink-primary flex">

      {/* ── Desktop sidebar ───────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-48 flex-shrink-0 border-r border-border bg-bg-secondary sticky top-0 h-screen overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* ── Mobile sidebar overlay ────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed left-0 top-0 bottom-0 w-56 bg-bg-secondary border-r border-border z-50 md:hidden overflow-y-auto"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main area ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile + notifications) */}
        <header className="sticky top-0 z-30 bg-bg-primary/95 backdrop-blur-sm border-b border-border px-4 md:px-6 h-14 flex items-center justify-between flex-shrink-0">
          <button
            className="md:hidden p-1.5 rounded-lg border border-border text-ink-muted hover:text-ink-primary transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <button className="p-1.5 rounded-lg border border-border text-ink-muted hover:text-ink-primary transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-accent-primary/20 border border-accent-primary/30 flex items-center justify-center text-xs font-bold text-accent-primary">
                  {initials}
                </div>
                <span className="hidden sm:block text-sm font-medium text-ink-secondary">{user.name}</span>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1 px-4 md:px-6 py-6 overflow-y-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default AppShell;
