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
const Profile = lazyLoad('Profile');
const Subscription = lazyLoad('Subscription');
const Auth = lazyLoad('Auth');
const Chat = lazyLoad('Chat');
const Challenges = lazyLoad('Challenges');
const Settings = lazyLoad('Settings');
const NotFound = lazyLoad('NotFound');

// Preload critical routes
const preloadRoute = (routeName) => {
  const routeMap = {
    dashboard: () => import('./pages/Dashboard'),
    verify: () => import('./pages/Verify'),
    leaderboard: () => import('./pages/Leaderboard'),
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
    animation: 'verify',
    priority: 'high'
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
  >
    <div className="loading-content">
      <div className="loading-spinner">
        <div className="spinner-circle"></div>
        <div className="spinner-glow"></div>
      </div>
      <div className="loading-text">
        Loading {routeName || 'page'}...
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
      <div className="loading-progress">
        <div className="progress-bar">
          <div className="progress-fill"></div>
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
          // Trigger preload
          const module = route.element();
          if (module && module.preload) {
            module.preload();
          }
        }
      });
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
            if (route.protected) {
              routeElement = (
                <ProtectedRoute key={routeKey}>
                  {routeElement}
                </ProtectedRoute>
              );
            }

            // Wrap with PublicRoute if restricted
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
  if (window.gtag) {
    window.gtag('config', process.env.REACT_APP_GA_TRACKING_ID, {
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
    const relatedRoutes = routesConfig.filter(r => 
      r.priority === 'high' || 
      r.name === currentRoute.name ||
      (currentRoute.name === 'Dashboard' && r.name === 'Verify')
    );
    
    relatedRoutes.forEach(route => {
      if (route.element && route.element.preload) {
        route.element.preload();
      }
    });
  }
};

// Utility to check if route exists
export const isValidRoute = (path) => {
  return routesConfig.some(route => {
    if (route.path.includes(':')) {
      // Dynamic route - check pattern
      const pattern = route.path.replace(/:[^/]+/g, '([^/]+)');
      return new RegExp(`^${pattern}$`).test(path);
    }
    return route.path === path;
  });
};

// Get route metadata
export const getRouteMetadata = (path) => {
  return routesConfig.find(route => {
    if (route.path.includes(':')) {
      const pattern = route.path.replace(/:[^/]+/g, '([^/]+)');
      return new RegExp(`^${pattern}$`).test(path);
    }
    return route.path === path;
  });
};