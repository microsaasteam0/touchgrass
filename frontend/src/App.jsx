

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from './components/ui/LoadingScreen';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Verify = lazy(() => import('./pages/Verify'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Profile = lazy(() => import('./pages/profile'));
const Subscription = lazy(() => import('./pages/Subscription'));
const Auth = lazy(() => import('./pages/Auth'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const Challenges = lazy(() => import('./pages/Challenges'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PaymentPage = lazy(() => import('./pages/Payment'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const AuthCallback = lazy(() => import('./pages/AuthCallBack'));
const VerificationWall = lazy(() => import('./pages/VerificationWall'));

// Lazy load SupportWidget
const SupportWidget = lazy(() => import('./components/ui/SupportWidget'));

// Context Providers - Import them properly
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { StreakProvider } from './contexts/StreakContext';
import { ChatProvider } from './contexts/ChatContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Get Google Client ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 
                          import.meta.env.REACT_APP_GOOGLE_CLIENT_ID || 
                          'your-default-client-id-here';

// Custom Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #050505 0%, #0f172a 100%)',
          color: 'white'
        }}>
          <div style={{ maxWidth: '500px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ef4444' }}>
              Something went wrong
            </h1>
            <p style={{ marginBottom: '1rem', color: '#a1a1aa' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            
            {this.state.error?.message?.includes('401') && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '1rem',
                borderRadius: '0.75rem',
                marginBottom: '1rem'
              }}>
                <p style={{ color: '#fca5a5', marginBottom: '0.5rem' }}>
                  ⚠️ Authentication error detected
                </p>
                <p style={{ fontSize: '0.875rem', color: '#fca5a5' }}>
                  Please try logging in again.
                </p>
              </div>
            )}
            
            <button
              onClick={this.handleReload}
              style={{
                background: '#00E5FF',
                color: 'black',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '1rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              Go to Homepage
            </button>
            
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '0.5rem',
                marginLeft: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              Reload Page
            </button>
            
            {/* Show error details in development */}
            {import.meta.env.DEV && this.state.errorInfo && (
              <details style={{ marginTop: '2rem', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', color: '#94a3b8' }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  overflow: 'auto',
                  fontSize: '0.75rem',
                  marginTop: '0.5rem'
                }}>
                  {this.state.error?.toString()}
                  {'\n\n'}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Route transition wrapper
const RouteTransition = ({ children, animation = 'fade' }) => {
  const location = useLocation();
  
  const animations = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 }
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.3 }
    },
    slideIn: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
      transition: { duration: 0.3 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.3 }
    }
  };

  const selectedAnimation = animations[animation] || animations.fade;

  return (
    <motion.div
      key={location.pathname}
      initial={selectedAnimation.initial}
      animate={selectedAnimation.animate}
      exit={selectedAnimation.exit}
      transition={selectedAnimation.transition}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

// Public Route Component (for auth pages)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }
  
  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Special route handler for AuthCallback - NO redirects
const AuthCallbackRoute = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen message="Processing authentication..." />;
  }
  
  // NEVER redirect from AuthCallback - let the AuthCallback component handle everything
  return <AuthCallback />;
};

// Main App Content - Wrapped in Suspense
function AppContent() {
  const { loading, isAuthenticated } = useAuth();
  const [theme, setTheme] = useState('dark');
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-redirect authenticated users from home to dashboard
  useEffect(() => {
    if (isAuthenticated && location.pathname === '/') {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // Handle theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  if (loading) {
    return <LoadingScreen message="Loading app..." />;
  }

  return (
    <div className={`app-container theme-${theme}`}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={
            <RouteTransition animation="fade">
              <Suspense fallback={<LoadingScreen />}>
                <Home />
              </Suspense>
            </RouteTransition>
          } />
          
          <Route path="/auth" element={
            <PublicRoute>
              <RouteTransition animation="slideUp">
                <Suspense fallback={<LoadingScreen />}>
                  <Auth />
                </Suspense>
              </RouteTransition>
            </PublicRoute>
          } />
          
          <Route path="/forgot-password" element={
            <PublicRoute>
              <RouteTransition animation="slideUp">
                <Suspense fallback={<LoadingScreen />}>
                  <ForgotPassword />
                </Suspense>
              </RouteTransition>
            </PublicRoute>
          } />
          
          <Route path="/reset-password/:token" element={
            <PublicRoute>
              <RouteTransition animation="slideUp">
                <Suspense fallback={<LoadingScreen />}>
                  <ResetPassword />
                </Suspense>
              </RouteTransition>
            </PublicRoute>
          } />
          
          <Route path="/leaderboard" element={
            <RouteTransition animation="fade">
              <Suspense fallback={<LoadingScreen />}>
                <Leaderboard />
              </Suspense>
            </RouteTransition>
          } />
          
          <Route path="/verification-wall" element={
            <RouteTransition animation="fade">
              <Suspense fallback={<LoadingScreen />}>
                <VerificationWall />
              </Suspense>
            </RouteTransition>
          } />
          
          {/* IMPORTANT: AuthCallback must NOT be wrapped in PublicRoute */}
          <Route path="/auth/callback" element={
            <Suspense fallback={<LoadingScreen message="Processing callback..." />}>
              <AuthCallbackRoute />
            </Suspense>
          } />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <RouteTransition animation="scale">
                <Suspense fallback={<LoadingScreen message="Loading dashboard..." />}>
                  <Dashboard />
                </Suspense>
              </RouteTransition>
            </ProtectedRoute>
          } />
          
          <Route path="/verify" element={
            <ProtectedRoute>
              <RouteTransition animation="slideIn">
                <Suspense fallback={<LoadingScreen />}>
                  <Verify />
                </Suspense>
              </RouteTransition>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <RouteTransition animation="slideUp">
                <Suspense fallback={<LoadingScreen />}>
                  <Profile />
                </Suspense>
              </RouteTransition>
            </ProtectedRoute>
          } />
          
          <Route path="/profile/:username" element={
            <ProtectedRoute>
              <RouteTransition animation="slideUp">
                <Suspense fallback={<LoadingScreen />}>
                  <Profile />
                </Suspense>
              </RouteTransition>
            </ProtectedRoute>
          } />
          
          {/* Add other protected routes similarly... */}
          <Route path="/chat" element={
            <ProtectedRoute>
              <RouteTransition animation="fade">
                <Suspense fallback={<LoadingScreen />}>
                  <ChatPage />
                </Suspense>
              </RouteTransition>
            </ProtectedRoute>
          } />
          
          <Route path="/challenges" element={
            <ProtectedRoute>
              <RouteTransition animation="slideIn">
                <Suspense fallback={<LoadingScreen />}>
                  <Challenges />
                </Suspense>
              </RouteTransition>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <RouteTransition animation="slideUp">
                <Suspense fallback={<LoadingScreen />}>
                  <Settings />
                </Suspense>
              </RouteTransition>
            </ProtectedRoute>
          } />
          
          <Route path="/subscription" element={
            <ProtectedRoute>
              <RouteTransition animation="fade">
                <Suspense fallback={<LoadingScreen />}>
                  <Subscription />
                </Suspense>
              </RouteTransition>
            </ProtectedRoute>
          } />
          
          <Route path="/payment" element={
            <ProtectedRoute>
              <RouteTransition animation="slideUp">
                <Suspense fallback={<LoadingScreen />}>
                  <PaymentPage />
                </Suspense>
              </RouteTransition>
            </ProtectedRoute>
          } />
          
          <Route path="/payment/success" element={
            <ProtectedRoute>
              <RouteTransition animation="fade">
                <Suspense fallback={<LoadingScreen />}>
                  <PaymentSuccess />
                </Suspense>
              </RouteTransition>
            </ProtectedRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={
            <RouteTransition animation="fade">
              <Suspense fallback={<LoadingScreen />}>
                <NotFound />
              </Suspense>
            </RouteTransition>
          } />
        </Routes>
      </AnimatePresence>

      {/* Support Widget - Shows on all pages */}
      <Suspense fallback={null}>
        <SupportWidget />
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <Router>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <NotificationProvider>
            <StreakProvider>
              <ChatProvider>
                
                  <AppContent />
               
              </ChatProvider>
            </StreakProvider>
          </NotificationProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;