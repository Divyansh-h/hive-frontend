import './index.css';
import { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
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

function App() {
  return (
    <GlobalErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <NetworkStatusBanner />
            <PageSuspense>
              <Routes>
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
            </PageSuspense>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </GlobalErrorBoundary>
  );
}

/** Wrapper to extract userId from URL params */
function ProfilePageWrapper() {
  const { userId } = useParams<{ userId: string }>();
  return <ProfilePage userId={userId ?? 'current-user'} />;
}

export default App;


