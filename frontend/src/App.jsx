import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from './components/ui/LoadingScreen';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Verify = React.lazy(() => import('./pages/Verify'));
const Leaderboard = React.lazy(() => import('./pages/Leaderboard'));
const Profile = React.lazy(() => import('./pages/profile'));
const Subscription = React.lazy(() => import('./pages/Subscription'));
const Auth = React.lazy(() => import('./pages/Auth'));
const ChatPage = React.lazy(() => import('./pages/ChatPage'));
const Challenges = React.lazy(() => import('./pages/Challenges'));
const Settings = React.lazy(() => import('./pages/Settings'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const PaymentPage = React.lazy(() => import('./pages/Payment'));
const PaymentSuccess = React.lazy(() => import('./pages/PaymentSuccess'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const AuthCallback = React.lazy(() => import('./pages/AuthCallBack'));

// Context - FIXED IMPORT
import { AuthProvider, useAuth } from './contexts/AuthContext';  // Add AuthProvider here
import { StreakProvider } from './contexts/StreakContext';
import { ChatProvider } from './contexts/ChatContext';
import { NotificationProvider } from './contexts/NotificationContext';
// Get Google Client ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 
                         import.meta.env.REACT_APP_GOOGLE_CLIENT_ID || 
                         '';

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
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading authentication...</p>
        </div>
      </div>
    );
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
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }
  
  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Special route handler for AuthCallback - NO redirects
const AuthCallbackRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Processing authentication...</p>
        </div>
      </div>
    );
  }
  
  // NEVER redirect from AuthCallback - let the AuthCallback component handle everything
  return <AuthCallback />;
};

// Main App Content
function AppContent() {
  const { loading, isAuthenticated } = useAuth();
  const [theme, setTheme] = useState('dark');
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-redirect authenticated users from home to dashboard
  useEffect(() => {
    if (isAuthenticated && location.pathname === '/') {
      console.log('🔄 Auto-redirecting from home to dashboard');
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
    return <LoadingScreen />;
  }

  return (
    <div className={`app-container theme-${theme}`}>
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingScreen />}>
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<RouteTransition animation="fade"><Home /></RouteTransition>} />
            <Route path="/auth" element={<PublicRoute><RouteTransition animation="slideUp"><Auth /></RouteTransition></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><RouteTransition animation="slideUp"><ForgotPassword /></RouteTransition></PublicRoute>} />
            <Route path="/reset-password/:token" element={<PublicRoute><RouteTransition animation="slideUp"><ResetPassword /></RouteTransition></PublicRoute>} />
            <Route path="/leaderboard" element={<RouteTransition animation="fade"><Leaderboard /></RouteTransition>} />
            
            {/* IMPORTANT: AuthCallback must NOT be wrapped in PublicRoute */}
            <Route path="/auth/callback" element={<AuthCallbackRoute />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><RouteTransition animation="scale"><Dashboard /></RouteTransition></ProtectedRoute>} />
            <Route path="/verify" element={<ProtectedRoute><RouteTransition animation="slideIn"><Verify /></RouteTransition></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><RouteTransition animation="slideUp"><Profile /></RouteTransition></ProtectedRoute>} />
            <Route path="/profile/:username" element={<ProtectedRoute><RouteTransition animation="slideUp"><Profile /></RouteTransition></ProtectedRoute>} />
            <Route path="/subscription" element={<ProtectedRoute><RouteTransition animation="scale"><Subscription /></RouteTransition></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><RouteTransition animation="fade"><ChatPage /></RouteTransition></ProtectedRoute>} />
            <Route path="/challenges" element={<ProtectedRoute><RouteTransition animation="slideIn"><Challenges /></RouteTransition></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><RouteTransition animation="scale"><Settings /></RouteTransition></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><RouteTransition animation="fade"><PaymentPage /></RouteTransition></ProtectedRoute>} />
            <Route path="/payment/success" element={<RouteTransition animation="fade"><PaymentSuccess /></RouteTransition>} />
            
            {/* 404 Route */}
            <Route path="*" element={<RouteTransition animation="fade"><NotFound /></RouteTransition>} />
          </Routes>
        </Suspense>
      </AnimatePresence>

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
    <Router>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <StreakProvider>
            <ChatProvider>
              <NotificationProvider>
                <AppContent />
              </NotificationProvider>
            </ChatProvider>
          </StreakProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </Router>
  );
}

export default App;