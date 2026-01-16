import './index.css';
import { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { AppShell } from './components/common/AppShell';
import { GlobalErrorBoundary } from './components/common/GlobalErrorBoundary';
import { PageSuspense } from './components/common/SuspenseWrapper';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { NetworkStatusBanner } from './components/ui/NetworkStatusBanner';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/Home'));
const LoginPage = lazy(() => import('./pages/Login'));
const SignupPage = lazy(() => import('./pages/Signup'));
const FeedPage = lazy(() => import('./pages/Feed'));
const ProfilePage = lazy(() => import('./pages/Profile'));
const SettingsPage = lazy(() => import('./pages/Settings'));

/** Wrapper to extract userId from URL params */
function ProfilePageWrapper() {
  const { userId } = useParams<{ userId: string }>();
  return <ProfilePage userId={userId ?? 'current-user'} />;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public pages (own layout) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* App pages (with AppShell) */}
        <Route path="/feed" element={<AppShell><FeedPage /></AppShell>} />
        <Route path="/profile" element={<AppShell><ProfilePage userId="current-user" /></AppShell>} />
        <Route path="/profile/:userId" element={<AppShell><ProfilePageWrapper /></AppShell>} />
        <Route path="/settings" element={<AppShell><SettingsPage /></AppShell>} />

        {/* Fallback to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <GlobalErrorBoundary>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <ToastProvider>
            <AuthProvider>
              <NetworkStatusBanner />
              <PageSuspense>
                <AnimatedRoutes />
              </PageSuspense>
            </AuthProvider>
          </ToastProvider>
        </BrowserRouter>
      </MotionConfig>
    </GlobalErrorBoundary>
  );
}

export default App;
