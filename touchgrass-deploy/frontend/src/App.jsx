// import React, { useState, useEffect, Suspense } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Lazy load pages for better performance
// const Home = React.lazy(() => import('./pages/Home'));
// const Dashboard = React.lazy(() => import('./pages/Dashboard'));
// const Verify = React.lazy(() => import('./pages/Verify'));
// const Leaderboard = React.lazy(() => import('./pages/Leaderboard'));
// const Profile = React.lazy(() => import('./pages/Profile'));
// const Subscription = React.lazy(() => import('./pages/Subscription'));
// const Auth = React.lazy(() => import('./pages/Auth'));
// const Chat = React.lazy(() => import('./pages/Chatpage'));
// const Challenges = React.lazy(() => import('./pages/Challenges'));
// const Settings = React.lazy(() => import('./pages/Settings'));
// const NotFound = React.lazy(() => import('./pages/NotFound'));

// // Components
// import Navbar from './components/layout/Navbar';
// import Footer from './components/layout/Footer';
// import LoadingScreen from './components/ui/LoadingScreen';
// // import ParticleBackground from './components/effects/ParticleBackground';
// import Confetti from './components/ui/Confetti';
// // import ConnectionStatus from './components/ui/ConnectionStatus';

// // // Context & State
// // import { AuthProvider, useAuth } from './contexts/AuthContext';
// // import { StreakProvider } from './contexts/StreakContext';
// // import { ChatProvider } from './contexts/ChatContext';
// // import { NotificationProvider } from './contexts/NotificationContext';

// // CSS imports
// import './global.css';
// import './styles/animations.css';
// import './styles/themes.css';

// // Custom hooks
// // import useSocket from './hooks/useSocket';
// // import useAnalytics from './hooks/useAnalytics';

// function AppContent() {
//   const { isAuthenticated, user, loading } = useAuth();
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState('connected');
//   const [theme, setTheme] = useState('dark');
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const location = useLocation();

//   // Initialize analytics
//   useAnalytics();

//   // WebSocket URL from environment
//   const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';
  
//   // Initialize WebSocket connection (only when authenticated)
//   const socket = useSocket({
//     url: WS_URL,
//     enabled: isAuthenticated,
//     onConnect: () => {
//       setConnectionStatus('connected');
//       toast.success('Live connection established', {
//         icon: '🔗',
//         theme: 'dark',
//       });
//     },
//     onDisconnect: () => {
//       setConnectionStatus('disconnected');
//       toast.warning('Connection lost - working offline', {
//         theme: 'dark',
//       });
//     },
//     onReconnect: () => {
//       setConnectionStatus('reconnecting');
//       toast.info('Reconnecting...', {
//         theme: 'dark',
//       });
//     },
//   });

//   // Handle confetti for achievements
//   useEffect(() => {
//     const handleAchievement = (event) => {
//       setShowConfetti(true);
//       setTimeout(() => setShowConfetti(false), 5000);
//     };

//     window.addEventListener('achievement-unlocked', handleAchievement);
//     return () => window.removeEventListener('achievement-unlocked', handleAchievement);
//   }, []);

//   // Handle theme
//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme') || 'dark';
//     setTheme(savedTheme);
//     document.documentElement.setAttribute('data-theme', savedTheme);
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === 'dark' ? 'light' : 'dark';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//     document.documentElement.setAttribute('data-theme', newTheme);
//   };

//   // Route protection
//   const ProtectedRoute = ({ children }) => {
//     if (loading) {
//       return <LoadingScreen />;
//     }

//     if (!isAuthenticated) {
//       toast.info('Please sign in to continue', {
//         theme: 'dark',
//         icon: '🔒',
//       });
//       return <Navigate to="/auth" />;
//     }

//     return children;
//   };

//   // Public route (redirect if authenticated)
//   const PublicRoute = ({ children }) => {
//     if (loading) {
//       return <LoadingScreen />;
//     }

//     // Redirect authenticated users away from auth pages
//     if (isAuthenticated && (location.pathname === '/auth' || location.pathname === '/')) {
//       return <Navigate to="/dashboard" />;
//     }

//     return children;
//   };

//   // Check if current route is auth-related
//   const isAuthRoute = location.pathname === '/auth' || 
//                       location.pathname.startsWith('/auth/');

//   // App loading screen
//   if (loading) {
//     return <LoadingScreen fullScreen />;
//   }

//   return (
//     <div className={`app-container theme-${theme}`}>
//       {/* Background Effects */}
//       <ParticleBackground intensity={theme === 'dark' ? 0.3 : 0.1} />
//       {showConfetti && <ConfettiEffect />}

//       {/* Connection Status Indicator */}
//       <ConnectionStatus status={connectionStatus} />

//       {/* Global Navigation - Hide on auth pages for cleaner look */}
//       {!isAuthRoute && (
//         <Navbar 
//           isAuthenticated={isAuthenticated}
//           user={user}
//           theme={theme}
//           toggleTheme={toggleTheme}
//           isMobileMenuOpen={isMobileMenuOpen}
//           setIsMobileMenuOpen={setIsMobileMenuOpen}
//         />
//       )}

//       {/* Main Content */}
//       <main className={`main-content ${isAuthRoute ? 'auth-layout' : ''}`}>
//         <AnimatePresence mode="wait">
//           <Suspense fallback={<LoadingScreen />}>
//             <Routes location={location} key={location.pathname}>
//               {/* Home Route - Public but redirects to dashboard if authenticated */}
//               <Route 
//                 path="/" 
//                 element={
//                   <PublicRoute>
//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       transition={{ duration: 0.5 }}
//                     >
//                       <Home />
//                     </motion.div>
//                   </PublicRoute>
//                 } 
//               />

//               {/* Auth Route - Sign in / Sign up */}
//               <Route 
//                 path="/auth" 
//                 element={
//                   <PublicRoute>
//                     <motion.div
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -20 }}
//                       transition={{ duration: 0.4 }}
//                       className="auth-page-container"
//                     >
//                       <Auth />
//                     </motion.div>
//                   </PublicRoute>
//                 } 
//               />

//               {/* Auth with action (signup, login, reset) */}
//               <Route 
//                 path="/auth/:action" 
//                 element={
//                   <PublicRoute>
//                     <motion.div
//                       initial={{ opacity: 0, scale: 0.95 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       exit={{ opacity: 0, scale: 0.95 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <Auth />
//                     </motion.div>
//                   </PublicRoute>
//                 } 
//               />

//               {/* Protected Routes - Dashboard */}
//               <Route 
//                 path="/dashboard" 
//                 element={
//                   <ProtectedRoute>
//                     <motion.div
//                       initial={{ opacity: 0, scale: 0.95 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       exit={{ opacity: 0, scale: 0.95 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <Dashboard socket={socket} />
//                     </motion.div>
//                   </ProtectedRoute>
//                 } 
//               />

//               {/* Daily Verification */}
//               <Route 
//                 path="/verify" 
//                 element={
//                   <ProtectedRoute>
//                     <motion.div
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       exit={{ opacity: 0, x: 20 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <Verify />
//                     </motion.div>
//                   </ProtectedRoute>
//                 } 
//               />

//               {/* Leaderboard - Public */}
//               <Route 
//                 path="/leaderboard" 
//                 element={
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     transition={{ duration: 0.5 }}
//                   >
//                     <Leaderboard />
//                   </motion.div>
//                 } 
//               />

//               {/* Profile - Protected */}
//               <Route 
//                 path="/profile" 
//                 element={
//                   <ProtectedRoute>
//                     <motion.div
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -20 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <Profile />
//                     </motion.div>
//                   </ProtectedRoute>
//                 } 
//               />

//               {/* Profile with username */}
//               <Route 
//                 path="/profile/:username" 
//                 element={
//                   <motion.div
//                     initial={{ opacity: 0, rotateX: 90 }}
//                     animate={{ opacity: 1, rotateX: 0 }}
//                     exit={{ opacity: 0, rotateX: -90 }}
//                     transition={{ duration: 0.4 }}
//                   >
//                     <Profile />
//                   </motion.div>
//                 } 
//               />

//               {/* Subscription Plans */}
//               <Route 
//                 path="/subscription" 
//                 element={
//                   <ProtectedRoute>
//                     <motion.div
//                       initial={{ opacity: 0, scale: 0.9 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       exit={{ opacity: 0, scale: 0.9 }}
//                       transition={{ duration: 0.4 }}
//                     >
//                       <Subscription />
//                     </motion.div>
//                   </ProtectedRoute>
//                 } 
//               />

//               {/* Chat */}
//               <Route 
//                 path="/chat" 
//                 element={
//                   <ProtectedRoute>
//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                       className="chat-page-container"
//                     >
//                       <Chat socket={socket} />
//                     </motion.div>
//                   </ProtectedRoute>
//                 } 
//               />

//               {/* Challenges */}
//               <Route 
//                 path="/challenges" 
//                 element={
//                   <ProtectedRoute>
//                     <motion.div
//                       initial={{ opacity: 0, x: 20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       exit={{ opacity: 0, x: -20 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <Challenges />
//                     </motion.div>
//                   </ProtectedRoute>
//                 } 
//               />

//               {/* Settings */}
//               <Route 
//                 path="/settings" 
//                 element={
//                   <ProtectedRoute>
//                     <motion.div
//                       initial={{ opacity: 0, rotateX: 90 }}
//                       animate={{ opacity: 1, rotateX: 0 }}
//                       exit={{ opacity: 0, rotateX: -90 }}
//                       transition={{ duration: 0.4 }}
//                     >
//                       <Settings />
//                     </motion.div>
//                   </ProtectedRoute>
//                 } 
//               />

//               {/* 404 Route */}
//               <Route 
//                 path="*" 
//                 element={
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     transition={{ duration: 0.5 }}
//                   >
//                     <NotFound />
//                   </motion.div>
//                 } 
//               />
//             </Routes>
//           </Suspense>
//         </AnimatePresence>
//       </main>

//       {/* Global Footer - Hide on auth pages */}
//       {!isAuthRoute && <Footer theme={theme} />}

//       {/* Toast Notifications */}
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="dark"
//         toastClassName="custom-toast"
//         bodyClassName="toast-body"
//         progressClassName="toast-progress"
//       />

//       {/* Global Modals Portal */}
//       <div id="modal-root"></div>

//       {/* Floating Action Button for Mobile - Only when authenticated */}
//       {isAuthenticated && location.pathname !== '/verify' && (
//         <motion.button
//           className="floating-action-button"
//           initial={{ scale: 0, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={() => window.location.href = '/verify'}
//         >
//           <span className="fab-icon">🌱</span>
//           <span className="fab-text">Verify Today</span>
//           <span className="fab-pulse"></span>
//         </motion.button>
//       )}

//       {/* Join Now Floating Button on Home Page - Only for non-authenticated users */}
//       {!isAuthenticated && location.pathname === '/' && (
//         <motion.button
//           className="join-now-button"
//           initial={{ y: 100, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => window.location.href = '/auth?action=signup'}
//         >
//           <span className="join-icon">🚀</span>
//           <span className="join-text">Join Now - Start Free</span>
//           <span className="join-glow"></span>
//         </motion.button>
//       )}

//       {/* Performance Metrics (Development Only) */}
//       {process.env.NODE_ENV === 'development' && (
//         <div className="performance-monitor">
//           <div className="fps-counter">60 FPS</div>
//           <div className="memory-usage">45 MB</div>
//           <div className="route-info">{location.pathname}</div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Main App Component with Providers
// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <StreakProvider>
//           <ChatProvider>
//             <NotificationProvider>
//               <AppContent />
//             </NotificationProvider>
//           </ChatProvider>
//         </StreakProvider>
//       </AuthProvider>
//     </Router>
//   );
// }
import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Verify = React.lazy(() => import('./pages/Verify'));
const Leaderboard = React.lazy(() => import('./pages/Leaderboard'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Subscription = React.lazy(() => import('./pages/Subscription'));
const Auth = React.lazy(() => import('./pages/Auth'));
const ChatPage = React.lazy(() => import('./pages/ChatPage'));
const Challenges = React.lazy(() => import('./pages/Challenges'));
const Settings = React.lazy(() => import('./pages/Settings'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/ui/LoadingScreen';
import Confetti from './components/ui/Confetti';

// Context & State
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { StreakProvider } from './contexts/StreakContext';
import { ChatProvider } from './contexts/ChatContext';
import { NotificationProvider } from './contexts/NotificationContext';

// CSS imports
import './global.css';
import './styles/animations.css';
import './styles/themes.css';

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

// Protected Route Component - FIXED
const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  return children;
};

// Public Route Component - FIXED
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  // Only redirect to dashboard if trying to access auth page
  const isAuthPage = window.location.pathname === '/auth';
  if (isAuthenticated && isAuthPage) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Main App Content
function AppContent() {
  const { user, loading } = useAuth();
  const [showConfetti, setShowConfetti] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle confetti for achievements
  useEffect(() => {
    const handleAchievement = (event) => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    };

    window.addEventListener('achievement-unlocked', handleAchievement);
    return () => window.removeEventListener('achievement-unlocked', handleAchievement);
  }, []);

  // Handle theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // App loading screen
  if (loading) {
    return <LoadingScreen fullScreen />;
  }

  return (
    <div className={`app-container theme-${theme}`}>
      {/* Confetti Effect */}
      {showConfetti && <Confetti />}

      {/* Global Navigation */}
      <Navbar 
        isAuthenticated={!!user}
        user={user}
        theme={theme}
        toggleTheme={toggleTheme}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingScreen />}>
            <Routes location={location} key={location.pathname}>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  <RouteTransition animation="fade">
                    <Home />
                  </RouteTransition>
                } 
              />

              <Route 
                path="/auth" 
                element={
                  <PublicRoute>
                    <RouteTransition animation="slideUp">
                      <Auth />
                    </RouteTransition>
                  </PublicRoute>
                } 
              />

              <Route 
                path="/leaderboard" 
                element={
                  <RouteTransition animation="fade">
                    <Leaderboard />
                  </RouteTransition>
                } 
              />

              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <RouteTransition animation="scale">
                      <Dashboard />
                    </RouteTransition>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/verify" 
                element={
                  <ProtectedRoute>
                    <RouteTransition animation="slideIn">
                      <Verify />
                    </RouteTransition>
                  </ProtectedRoute>
                } 
              />

              {/* FIXED: Profile routes should NOT redirect to dashboard */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <RouteTransition animation="slideUp">
                      <Profile />
                    </RouteTransition>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/profile/:username" 
                element={
                  <ProtectedRoute>
                    <RouteTransition animation="slideUp">
                      <Profile />
                    </RouteTransition>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/subscription" 
                element={
                  <ProtectedRoute>
                    <RouteTransition animation="scale">
                      <Subscription />
                    </RouteTransition>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <RouteTransition animation="fade">
                      <ChatPage />
                    </RouteTransition>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/challenges" 
                element={
                  <ProtectedRoute>
                    <RouteTransition animation="slideIn">
                      <Challenges />
                    </RouteTransition>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <RouteTransition animation="scale">
                      <Settings />
                    </RouteTransition>
                  </ProtectedRoute>
                } 
              />

              {/* 404 Route */}
              <Route 
                path="*" 
                element={
                  <RouteTransition animation="fade">
                    <NotFound />
                  </RouteTransition>
                } 
              />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer theme={theme} />

      {/* Toast Notifications */}
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
        toastClassName="custom-toast"
        bodyClassName="toast-body"
        progressClassName="toast-progress"
      />

      {/* Global Modals Portal */}
      <div id="modal-root"></div>

      {/* Floating Action Button for Mobile */}
      {user && (
        <motion.button
          className="floating-action-button"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.location.href = '/verify'}
        >
          <span className="fab-icon">🌱</span>
          <span className="fab-pulse"></span>
        </motion.button>
      )}
    </div>
  );
}

// Main App Component with Providers
function App() {
  return (
    <AuthProvider>
      <StreakProvider>
        <ChatProvider>
          <NotificationProvider>
            <Router>
              <AppContent />
            </Router>
          </NotificationProvider>
        </ChatProvider>
      </StreakProvider>
    </AuthProvider>
  );
}

export default App;