import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';

// Lazy load pages
const DashboardHome = lazy(() => import('./pages/DashboardHome'));
const UserManagement = lazy(() => import('./pages/UserManagement'));
const MotorManagement = lazy(() => import('./pages/MotorManagement'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const MyAds = lazy(() => import('./pages/MyAds')); // Halaman Iklan Saya baru
const ProfilePage = lazy(() => import('./pages/ProfilePage')); // Halaman Profile User

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <div className="loader"></div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;

  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<div className="loader"></div>}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="motors" element={<MotorManagement />} />
              <Route path="ads" element={<MyAds />} /> {/* Rute Iklan Saya (Video CRUD) */}
              <Route path="profile" element={<ProfilePage />} /> {/* Rute Profile User */}
              <Route path="users" element={
                <ProtectedRoute adminOnly>
                  <UserManagement />
                </ProtectedRoute>
              } />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
};

export default App;
