import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AnimatePresence } from 'framer-motion';

const Landing          = lazy(() => import('./pages/Landing'));
const Login            = lazy(() => import('./pages/Login'));
const Signup           = lazy(() => import('./pages/Signup'));
const UserDashboard    = lazy(() => import('./pages/UserDashboard'));
const IndustryDashboard = lazy(() => import('./pages/IndustryDashboard'));
const AdminDashboard   = lazy(() => import('./pages/AdminDashboard'));

const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-carbon-950 flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-accent-glow border-t-transparent rounded-full animate-spin" />
  </div>
);

const PrivateRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({ children, allowedRoles }) => {
  const { token, user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!token || !user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'ADMIN')    return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'INDUSTRY') return <Navigate to="/industry-dashboard" replace />;
    return <Navigate to="/user-dashboard" replace />;
  }
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { token, user } = useAuth();
  const location = useLocation();

  const dashboardRedirect = token && user
    ? user.role === 'ADMIN'    ? <Navigate to="/admin-dashboard" replace />
    : user.role === 'INDUSTRY' ? <Navigate to="/industry-dashboard" replace />
    : <Navigate to="/user-dashboard" replace />
    : null;

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/"       element={dashboardRedirect ?? <Landing />} />
          <Route path="/login"  element={dashboardRedirect ?? <Login />} />
          <Route path="/signup" element={dashboardRedirect ?? <Signup />} />

          <Route path="/user-dashboard"     element={<PrivateRoute allowedRoles={['INDIVIDUAL']}><UserDashboard /></PrivateRoute>} />
          <Route path="/industry-dashboard" element={<PrivateRoute allowedRoles={['INDUSTRY']}><IndustryDashboard /></PrivateRoute>} />
          <Route path="/admin-dashboard"    element={<PrivateRoute allowedRoles={['ADMIN']}><AdminDashboard /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
