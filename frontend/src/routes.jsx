import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import LoadingScreen from './components/ui/LoadingScreen';
import RouteTransition from './components/transitions/RouteTransition';

// Lazy load pages with custom loading
const lazyLoad = (path) => lazy(() => import(`./pages/${path}`).then(module => ({
  default: module.default
})));

// Page components with preloading
const Home = lazyLoad('Home');
const Dashboard = lazyLoad('Dashboard');
const Verify = lazyLoad('Verify');
const Leaderboard = lazyLoad('Leaderboard');
const Profile = lazyLoad('profile');
const Subscription = lazyLoad('Subscription');
const Auth = lazyLoad('Auth');
const Chat = lazyLoad('Chat');
const Challenges = lazyLoad('ChallengesNew');
const Settings = lazyLoad('Settings');
const Search = lazyLoad('Search');
const NotFound = lazyLoad('NotFound');

// Import VerificationWall separately since it's not using lazyLoad
const VerificationWall = lazy(() => import('./pages/VerificationWall').then(module => ({
  default: module.default
})));

// New authentication pages
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword').then(module => ({
  default: module.default
})));

const ResetPassword = lazy(() => import('./pages/auth/ResetPassword').then(module => ({
  default: module.default
})));

const SecuritySettings = lazy(() => import('./pages/settings/SecuritySettings').then(module => ({
  default: module.default
})));

// Preload critical routes
const preloadRoute = (routeName) => {
  const routeMap = {
    dashboard: () => import('./pages/Dashboard'),
    verify: () => import('./pages/Verify'),
    leaderboard: () => import('./pages/Leaderboard'),
    auth: () => import('./pages/Auth'),
    forgotPassword: () => import('./pages/auth/ForgotPassword'),
    resetPassword: () => import('./pages/auth/ResetPassword'),
    settings: () => import('./pages/Settings'),
    securitySettings: () => import('./pages/settings/SecuritySettings'),
    verificationWall: () => import('./pages/VerificationWall'),
  };
  
  if (routeMap[routeName]) {
    routeMap[routeName]().catch(() => {});
  }
};

// Route animations configuration
const routeAnimations = {
  home: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
    transition: { duration: 0.4, ease: "easeInOut" }
  },
  dashboard: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  verify: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  leaderboard: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5, ease: "linear" }
  },
  profile: {
    initial: { opacity: 0, rotateY: 90 },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: -90 },
    transition: { duration: 0.4, ease: "easeInOut" }
  },
  auth: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  modal: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3, ease: "easeInOut" }
  },
  default: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  }
};

// Route configuration with metadata
const routesConfig = [
  {
    path: '/',
    element: Home,
    exact: true,
    name: 'Home',
    public: true,
    animation: 'home',
    priority: 'high',
    preload: true
  },
  {
    path: '/auth',
    element: Auth,
    name: 'Authentication',
    public: true,
    restricted: true, // Redirect if authenticated
    animation: 'auth',
    priority: 'high',
    preload: true
  },
  {
    path: '/forgot-password',
    element: ForgotPassword,
    name: 'Forgot Password',
    public: true,
    restricted: true,
    animation: 'modal',
    priority: 'medium'
  },
  {
    path: '/reset-password/:token',
    element: ResetPassword,
    name: 'Reset Password',
    public: true,
    restricted: true,
    animation: 'modal',
    priority: 'medium'
  },
  {
    path: '/dashboard',
    element: Dashboard,
    name: 'Dashboard',
    protected: true,
    animation: 'dashboard',
    priority: 'high',
    preload: true
  },
  {
    path: '/verify',
    element: Verify,
    name: 'Daily Verification',
    protected: true,
    animation: 'verify',
    priority: 'critical',
    preload: true
  },
  {
    path: '/leaderboard',
    element: Leaderboard,
    name: 'Leaderboard',
    public: false, // Accessible only when authenticated
    animation: 'leaderboard',
    priority: 'medium',
    preload: true
  },
  {
    path: '/profile/:username?',
    element: Profile,
    name: 'Profile',
    protected: true,
    animation: 'profile',
    priority: 'medium'
  },
  {
    path: '/subscription',
    element: Subscription,
    name: 'Subscription',
    protected: true,
    animation: 'default',
    priority: 'low'
  },
  {
    path: '/chat',
    element: Chat,
    name: 'Chat',
    protected: true,
    animation: 'default',
    priority: 'medium'
  },
  {
    path: '/challenges',
    element: Challenges,
    name: 'Challenges',
    protected: true,
    animation: 'default',
    priority: 'low'
  },
  {
    path: '/settings',
    element: Settings,
    name: 'Settings',
    protected: true,
    animation: 'default',
    priority: 'low'
  },
  {
    path: '/settings/security',
    element: SecuritySettings,
    name: 'Security Settings',
    protected: true,
    animation: 'default',
    priority: 'low'
  },
  {
    path: '/search',
    element: Search,
    name: 'Search',
    public: true,
    animation: 'default',
    priority: 'medium'
  },
  {
    path: '/verification-wall',
    element: VerificationWall,
    name: 'Verification Wall',
    public: true,
    animation: 'default',
    priority: 'medium',
    preload: true
  },
  {
    path: '/blog/:slug',
    element: Blog,
    name: 'Blog Post',
    public: true,
    animation: 'default',
    priority: 'medium'
  },
  {
    path: '*',
    element: NotFound,
    name: 'Not Found',
    public: true,
    animation: 'default'
  }
];

// Custom Suspense fallback with animation
const SuspenseFallback = ({ routeName }) => (
  <motion.div
    className="route-loading-container"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
    }}
  >
    <div 
      className="loading-content"
      style={{
        textAlign: 'center',
        maxWidth: '300px',
        width: '100%',
      }}
    >
      <div 
        className="loading-spinner"
        style={{
          position: 'relative',
          margin: '0 auto 24px',
          width: '60px',
          height: '60px',
        }}
      >
        <div 
          className="spinner-circle"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: '3px solid rgba(34, 197, 94, 0.1)',
            borderRadius: '50%',
          }}
        />
        <div 
          className="spinner-glow"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: '3px solid transparent',
            borderTopColor: '#22c55e',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
      <div 
        className="loading-text"
        style={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '14px',
          marginBottom: '16px',
        }}
      >
        Loading {routeName || 'page'}...
        <div 
          className="loading-dots"
          style={{
            display: 'inline-flex',
            marginLeft: '4px',
          }}
        >
          <span 
            className="dot"
            style={{
              display: 'inline-block',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              margin: '0 2px',
              animation: 'pulse 1.4s ease-in-out infinite',
              animationDelay: '0s',
            }}
          />
          <span 
            className="dot"
            style={{
              display: 'inline-block',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              margin: '0 2px',
              animation: 'pulse 1.4s ease-in-out infinite',
              animationDelay: '0.2s',
            }}
          />
          <span 
            className="dot"
            style={{
              display: 'inline-block',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              margin: '0 2px',
              animation: 'pulse 1.4s ease-in-out infinite',
              animationDelay: '0.4s',
            }}
          />
        </div>
      </div>
      <div 
        className="loading-progress"
        style={{
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div 
          className="progress-bar"
          style={{
            width: '100%',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div 
            className="progress-fill"
            style={{
              width: '30%',
              height: '100%',
              background: 'linear-gradient(90deg, #22c55e, #16a34a)',
              borderRadius: '4px',
              animation: 'loading 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </div>
  </motion.div>
);

// Route wrapper with animations
const AnimatedRoute = ({ children, animationType = 'default' }) => {
  const animation = routeAnimations[animationType] || routeAnimations.default;
  
  return (
    <RouteTransition {...animation}>
      {children}
    </RouteTransition>
  );
};

// Main Routes Component
export default function AppRoutes({ location }) {
  // Preload important routes on mount
  React.useEffect(() => {
    routesConfig
      .filter(route => route.preload)
      .forEach(route => {
        if (route.element) {
          try {
            // Preload the module
            if (typeof route.element._payload !== 'undefined') {
              // This is a React.lazy component
              route.element._payload._result.then(() => {
              }).catch(() => {});
            }
          } catch (error) {
            // Silently handle preload errors
          }
        }
      });
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
      
      @keyframes loading {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(100%); }
        100% { transform: translateX(200%); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<SuspenseFallback />}>
        <Routes location={location} key={location.pathname}>
          {routesConfig.map((route) => {
            const RouteElement = route.element;
            const routeKey = route.path.replace(/[^a-zA-Z0-9]/g, '-');
            
            let routeElement = (
              <AnimatedRoute animationType={route.animation}>
                <RouteElement />
              </AnimatedRoute>
            );

            // Wrap with ProtectedRoute if needed
            if (route.protected || !route.public) {
              routeElement = (
                <ProtectedRoute key={routeKey}>
                  {routeElement}
                </ProtectedRoute>
              );
            }

            // Wrap with PublicRoute if restricted (redirect if authenticated)
            if (route.restricted) {
              routeElement = (
                <PublicRoute key={routeKey}>
                  {routeElement}
                </PublicRoute>
              );
            }

            return (
              <Route
                key={routeKey}
                path={route.path}
                element={routeElement}
                exact={route.exact}
              />
            );
          })}
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

// Route change handler for analytics
export const onRouteChange = (location, prevLocation) => {
  // Google Analytics
  if (window.gtag) {
    window.gtag('config', process.env.REACT_APP_GA_TRACKING_ID || 'G-XXXXXXXXXX', {
      page_path: location.pathname,
    });
  }

  // Track page view
  if (window.analytics) {
    window.analytics.page({
      name: location.pathname,
      path: location.pathname,
      url: window.location.href,
    });
  }

  // Preload next likely routes
  const currentRoute = routesConfig.find(r => r.path === location.pathname);
  if (currentRoute) {
    const relatedRoutes = routesConfig.filter(r => {
      // Always preload high priority routes
      if (r.priority === 'high' || r.priority === 'critical') return true;
      
      // Preload routes related to current route
      if (currentRoute.name === 'Dashboard' && r.name === 'Verify') return true;
      if (currentRoute.name === 'Authentication' && r.name === 'Forgot Password') return true;
      if (currentRoute.name === 'Settings' && r.name === 'Security Settings') return true;
      
      return false;
    });
    
    relatedRoutes.forEach(route => {
      if (route.element && route.element._payload) {
        try {
          route.element._payload._result.catch(() => {});
        } catch (error) {
          // Silently handle preload errors
        }
      }
    });
  }
};

// Utility to check if route exists
export const isValidRoute = (path) => {
  return routesConfig.some(route => {
    if (route.path.includes(':')) {
      // Dynamic route - check pattern
      const pattern = '^' + route.path.replace(/:[^/]+/g, '([^/]+)') + '$';
      const regex = new RegExp(pattern);
      return regex.test(path);
    }
    return route.path === path;
  });
};

// Get route metadata
export const getRouteMetadata = (path) => {
  return routesConfig.find(route => {
    if (route.path.includes(':')) {
      const pattern = '^' + route.path.replace(/:[^/]+/g, '([^/]+)') + '$';
      const regex = new RegExp(pattern);
      return regex.test(path);
    }
    return route.path === path;
  }) || { name: 'Unknown Route', priority: 'low' };
};

// Get navigation items for authenticated users
export const getNavigationItems = (isAuthenticated) => {
  const publicItems = [
    { path: '/', name: 'Home', icon: '🏠' },
    { path: '/search', name: 'Search', icon: '🔍' },
    { path: '/leaderboard', name: 'Leaderboard', icon: '🏆', requiresAuth: true },
    { path: '/auth', name: 'Login', icon: '🔐', requiresAuth: false, hideWhenAuth: true },
  ];

  const protectedItems = [
    { path: '/dashboard', name: 'Dashboard', icon: '📊' },
    { path: '/verify', name: 'Verify', icon: '✅' },
    { path: '/verification-wall', name: 'Wall', icon: '🖼️' },
    { path: '/profile', name: 'Profile', icon: '👤' },
    { path: '/chat', name: 'Chat', icon: '💬' },
    { path: '/challenges', name: 'Challenges', icon: '🎯' },
    { path: '/subscription', name: 'Premium', icon: '💎' },
    { path: '/settings', name: 'Settings', icon: '⚙️' },
  ];

  const allItems = [...publicItems];

  if (isAuthenticated) {
    allItems.push(...protectedItems);
    // Remove login item when authenticated
    const loginIndex = allItems.findIndex(item => item.path === '/auth');
    if (loginIndex > -1) {
      allItems.splice(loginIndex, 1);
    }
  }

  return allItems.filter(item =>
    !item.requiresAuth || (item.requiresAuth && isAuthenticated)
  ).filter(item =>
    !item.hideWhenAuth || (item.hideWhenAuth && !isAuthenticated)
  );
};
