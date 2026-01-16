import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Trophy, User, LogOut, 
  Settings, Zap, Sparkles, Bell,
  Search, Shield, Globe, TrendingUp,
  Flame, Crown, ChevronDown, ExternalLink,
  Home, BarChart, MessageSquare, Target,
  CheckCircle, Users as UsersIcon
} from 'lucide-react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authState, logout } from '../../state/auth';
import { toast } from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const auth = useRecoilValue(authState);
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();
  const location = useLocation();
  const { ref, inView } = useInView({ threshold: 0 });

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout(setAuth);
    toast.success('Logged out successfully');
    navigate('/');
    setIsMenuOpen(false);
  };

  const notifications = [
    {
      id: 1,
      type: 'streak',
      title: 'Streak Milestone!',
      message: 'You reached 42 days! Keep going!',
      time: '2h ago',
      unread: true,
      icon: '🔥',
      color: '#22c55e'
    },
    {
      id: 2,
      type: 'challenge',
      title: 'New Challenge',
      message: 'User123 challenged you to a 7-day duel',
      time: '4h ago',
      unread: true,
      icon: '⚔️',
      color: '#f59e0b'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Achievement Unlocked',
      message: 'Social Butterfly: Shared 10+ times',
      time: '1d ago',
      unread: false,
      icon: '🦋',
      color: '#8b5cf6'
    },
    {
      id: 4,
      type: 'system',
      title: 'System Update',
      message: 'New chat features available',
      time: '2d ago',
      unread: false,
      icon: '🔄',
      color: '#3b82f6'
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={18} /> },
    { path: '/dashboard', label: 'Dashboard', icon: <BarChart size={18} /> },
    { path: '/verify', label: 'Verify', icon: <CheckCircle size={18} /> },
    { path: '/leaderboard', label: 'Leaderboard', icon: <Trophy size={18} /> },
    { path: '/chat', label: 'Chat', icon: <MessageSquare size={18} /> },
    { path: '/challenges', label: 'Challenges', icon: <Target size={18} /> }
  ];

  const userMenuItems = [
    { label: 'Profile', icon: <User size={16} />, path: '/profile' },
    { label: 'Settings', icon: <Settings size={16} />, path: '/settings' },
    { label: 'Subscription', icon: <Crown size={16} />, path: '/subscription' },
    { label: 'Help Center', icon: <Shield size={16} />, path: '/help' }
  ];

  // Animation keyframes
  const animationStyles = `
    @keyframes ping {
      75%, 100% {
        transform: scale(2);
        opacity: 0;
      }
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }
    
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
    
    @keyframes slideIn {
      from {
        transform: translateY(-10px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>
      
      {/* Background blur layer when menu is open */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 40
            }}
            className="lg:hidden"
          />
        )}
      </AnimatePresence>

      <nav
        ref={ref}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: 'all 0.3s ease',
          backgroundColor: isScrolled ? 'rgba(17, 24, 39, 0.95)' : 'rgba(17, 24, 39, 1)',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.2)' : 'none'
        }}
      >
        {/* Animated gradient bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{
            height: '2px',
            background: 'linear-gradient(90deg, #22c55e, #f59e0b, #8b5cf6)'
          }}
        />

        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                style={{ position: 'relative' }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)'
                }}>
                  <span style={{ fontSize: '24px' }}>🌱</span>
                </div>
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    rotate: {
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    },
                    scale: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    border: '2px solid #111827'
                  }}
                />
              </motion.div>
              
              <div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(90deg, #22c55e, #ffffff, #86efac)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  touchgrass.now
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Globe size={10} />
                  The internet's accountability platform
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation - Center */}
          <div style={{ 
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'none',
            alignItems: 'center',
            gap: '8px'
          }} className="lg:flex">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                             (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{ position: 'relative', textDecoration: 'none' }}
                >
                  <motion.div
                    whileHover={{ y: -2 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      borderRadius: '12px',
                      transition: 'all 0.2s ease',
                      background: isActive ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
                      border: isActive ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid transparent'
                    }}
                  >
                    <div style={{
                      color: isActive ? '#22c55e' : '#9ca3af',
                      transition: 'color 0.2s ease'
                    }}>
                      {item.icon}
                    </div>
                    <span style={{ 
                      fontWeight: 500,
                      fontSize: '14px',
                      color: isActive ? '#ffffff' : '#9ca3af',
                      transition: 'color 0.2s ease'
                    }}>
                      {item.label}
                    </span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        style={{
                          position: 'absolute',
                          bottom: '-12px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          backgroundColor: '#22c55e'
                        }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Search Bar (Desktop) */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              style={{ position: 'relative', display: 'none' }} className="lg:block"
            >
              <Search style={{ 
                position: 'absolute', 
                left: '16px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                color: '#9ca3af'
              }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users, streaks..."
                style={{
                  paddingLeft: '44px',
                  paddingRight: '16px',
                  paddingTop: '10px',
                  paddingBottom: '10px',
                  width: '240px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: 'white',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(34, 197, 94, 0.5)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </motion.div>

            {/* Notifications */}
            {auth.isAuthenticated && (
              <div style={{ position: 'relative' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  style={{
                    position: 'relative',
                    padding: '10px',
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <Bell size={20} color="#d1d5db" />
                  {unreadCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{ position: 'absolute', top: '-3px', right: '-3px' }}
                    >
                      <div style={{ position: 'relative' }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          color: 'white'
                        }}>
                          {unreadCount}
                        </div>
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '50%',
                          backgroundColor: '#ef4444',
                          animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
                          opacity: 0.2
                        }} />
                      </div>
                    </motion.div>
                  )}
                </motion.button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      style={{
                        position: 'absolute',
                        right: 0,
                        marginTop: '8px',
                        width: '360px',
                        backgroundColor: '#111827',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        overflow: 'hidden',
                        zIndex: 50
                      }}
                    >
                      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Notifications</div>
                          <button style={{ 
                            fontSize: '12px', 
                            color: '#22c55e',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}>
                            Mark all as read
                          </button>
                        </div>
                      </div>
                      
                      <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                        {notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                            style={{
                              padding: '16px',
                              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              backgroundColor: notification.unread ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                            }}
                            onClick={() => {
                              setIsNotificationsOpen(false);
                              toast(notification.message);
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                              <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                backgroundColor: `${notification.color}15`,
                                border: `1px solid ${notification.color}30`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px'
                              }}>
                                {notification.icon}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>
                                  {notification.title}
                                </div>
                                <p style={{ 
                                  fontSize: '12px', 
                                  color: '#9ca3af',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  marginBottom: '4px'
                                }}>
                                  {notification.message}
                                </p>
                                <div style={{ fontSize: '11px', color: '#6b7280' }}>
                                  {notification.time}
                                </div>
                              </div>
                              {notification.unread && (
                                <div style={{ 
                                  width: '6px', 
                                  height: '6px', 
                                  borderRadius: '50%', 
                                  backgroundColor: '#22c55e',
                                  marginTop: '8px'
                                }} />
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      <div style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <Link
                          to="/notifications"
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '8px',
                            textAlign: 'center',
                            fontSize: '12px',
                            color: '#9ca3af',
                            textDecoration: 'none',
                            transition: 'color 0.2s ease',
                            fontWeight: '500'
                          }}
                          onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                          onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                        >
                          View all notifications
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* User Menu / Auth Buttons */}
            {auth.isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Streak Badge */}
                <Link
                  to="/dashboard"
                  style={{ 
                    display: 'none',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none'
                  }} className="md:flex"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    style={{ position: 'relative' }}
                  >
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}>
                      <Flame size={20} color="#22c55e" />
                    </div>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '12px',
                        border: '2px solid rgba(34, 197, 94, 0.2)',
                        pointerEvents: 'none'
                      }}
                    />
                  </motion.div>
                  
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '500' }}>Current Streak</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#22c55e' }}>42</div>
                  </div>
                </Link>

                {/* Profile Dropdown */}
                <div style={{ position: 'relative' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px',
                      borderRadius: '12px',
                      transition: 'all 0.2s ease',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}>
                        {auth.user?.avatar ? (
                          <img 
                            src={auth.user.avatar} 
                            alt="" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        ) : (
                          <User size={18} color="#ffffff" />
                        )}
                      </div>
                      {/* Online indicator */}
                      <div style={{
                        position: 'absolute',
                        bottom: '-1px',
                        right: '-1px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: '#22c55e',
                        border: '2px solid #111827'
                      }} />
                    </div>
                    
                    <div style={{ display: 'none', textAlign: 'left' }} className="lg:block">
                      <div style={{ fontWeight: '600', fontSize: '13px' }}>
                        {auth.user?.displayName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                        @{auth.user?.username}
                      </div>
                    </div>
                    
                    <ChevronDown style={{ 
                      width: '16px', 
                      height: '16px', 
                      color: '#9ca3af',
                      transition: 'transform 0.2s ease',
                      transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }} />
                  </motion.button>

                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        style={{
                          position: 'absolute',
                          right: 0,
                          marginTop: '8px',
                          width: '280px',
                          backgroundColor: '#111827',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '16px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                          overflow: 'hidden',
                          zIndex: 50,
                          animation: 'slideIn 0.2s ease'
                        }}
                      >
                        {/* User Info */}
                        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden'
                            }}>
                              {auth.user?.avatar ? (
                                <img 
                                  src={auth.user.avatar} 
                                  alt="" 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                              ) : (
                                <User size={24} color="#ffffff" />
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                {auth.user?.displayName}
                              </div>
                              <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                @{auth.user?.username}
                              </div>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{
                              padding: '6px 12px',
                              borderRadius: '20px',
                              background: 'rgba(34, 197, 94, 0.2)',
                              border: '1px solid rgba(34, 197, 94, 0.3)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '12px'
                            }}>
                              <Flame size={12} color="#22c55e" />
                              <span style={{ fontWeight: 'bold', color: '#22c55e' }}>Day 42</span>
                            </div>
                            
                            <div style={{
                              padding: '6px 12px',
                              borderRadius: '20px',
                              background: 'rgba(245, 158, 11, 0.2)',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '12px'
                            }}>
                              <Crown size={12} color="#f59e0b" />
                              <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>ELITE</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Menu Items */}
                        <div style={{ padding: '8px' }}>
                          {userMenuItems.map((item) => (
                            <Link
                              key={item.label}
                              to={item.path}
                              onClick={() => setIsMenuOpen(false)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px',
                                textDecoration: 'none',
                                color: '#d1d5db',
                                transition: 'all 0.2s ease',
                                borderRadius: '10px',
                                fontSize: '14px',
                                fontWeight: '500'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.color = '#ffffff';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = '#d1d5db';
                              }}
                            >
                              <div style={{ width: '16px', height: '16px' }}>
                                {item.icon}
                              </div>
                              {item.label}
                            </Link>
                          ))}
                        </div>
                        
                        {/* Logout */}
                        <div style={{ padding: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          <button
                            onClick={handleLogout}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              width: '100%',
                              padding: '12px',
                              color: '#ef4444',
                              background: 'transparent',
                              border: 'none',
                              borderRadius: '10px',
                              transition: 'all 0.2s ease',
                              fontSize: '14px',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'transparent';
                            }}
                          >
                            <LogOut size={16} />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link
                  to="/auth"
                  style={{
                    display: 'none',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    fontWeight: '500',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#d1d5db',
                    fontSize: '14px'
                  }} className="md:block"
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.color = '#d1d5db';
                  }}
                >
                  Sign In
                </Link>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/auth?tab=signup"
                    style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      color: 'white',
                      fontSize: '14px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(90deg, #16a34a, #15803d)';
                      e.target.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(90deg, #22c55e, #16a34a)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <Sparkles size={16} />
                    Join Now
                  </Link>
                </motion.div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                padding: '10px',
                borderRadius: '10px',
                transition: 'all 0.2s ease',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'block'
              }} className="lg:hidden"
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              {isMenuOpen ? (
                <X size={24} color="#d1d5db" />
              ) : (
                <Menu size={24} color="#d1d5db" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: '#111827',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
                display: 'block'
              }} className="lg:hidden"
            >
              <div style={{ padding: '24px 16px' }}>
                {/* Search Bar Mobile */}
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <Search style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '16px',
                    height: '16px',
                    color: '#9ca3af'
                  }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users, streaks..."
                    style={{
                      width: '100%',
                      paddingLeft: '44px',
                      paddingRight: '16px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      fontSize: '14px',
                      color: 'white',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Mobile Navigation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '14px 16px',
                          borderRadius: '12px',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease',
                          background: isActive 
                            ? 'linear-gradient(90deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))' 
                            : 'transparent',
                          border: isActive ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid transparent'
                        }}
                        onMouseEnter={(e) => !isActive && (e.target.style.background = 'rgba(255, 255, 255, 0.05)')}
                        onMouseLeave={(e) => !isActive && (e.target.style.background = 'transparent')}
                      >
                        <div style={{
                          color: isActive ? '#22c55e' : '#9ca3af',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {item.icon}
                        </div>
                        <span style={{ 
                          fontWeight: 500,
                          fontSize: '15px',
                          color: isActive ? '#ffffff' : '#d1d5db'
                        }}>
                          {item.label}
                        </span>
                        {isActive && (
                          <motion.div
                            layoutId="mobileActive"
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: '#22c55e',
                              marginLeft: 'auto'
                            }}
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Auth/User Section */}
                {auth.isAuthenticated ? (
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '14px 16px',
                          textDecoration: 'none',
                          color: '#9ca3af',
                          transition: 'all 0.2s ease',
                          borderRadius: '10px',
                          fontSize: '15px',
                          fontWeight: '500'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                          e.target.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#9ca3af';
                        }}
                      >
                        <div style={{ width: '16px', height: '16px' }}>
                          {item.icon}
                        </div>
                        {item.label}
                      </Link>
                    ))}
                    
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: '14px 16px',
                        color: '#ef4444',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '10px',
                        transition: 'all 0.2s ease',
                        fontSize: '15px',
                        fontWeight: '500',
                        marginTop: '8px',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                      }}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Link
                      to="/auth"
                      onClick={() => setIsMenuOpen(false)}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'center',
                        padding: '14px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        color: '#d1d5db',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        fontSize: '15px',
                        fontWeight: '500'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.target.style.color = '#d1d5db';
                      }}
                    >
                      Sign In
                    </Link>
                    
                    <Link
                      to="/auth?tab=signup"
                      onClick={() => setIsMenuOpen(false)}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'center',
                        padding: '14px',
                        background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                        borderRadius: '12px',
                        color: 'white',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        fontSize: '15px',
                        fontWeight: 'bold'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(90deg, #16a34a, #15803d)';
                        e.target.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(90deg, #22c55e, #16a34a)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      Join Now
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Floating CTA for non-authenticated users */}
      {!auth.isAuthenticated && inView && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 40,
            padding: '12px 20px',
            background: 'linear-gradient(90deg, #22c55e, #16a34a)',
            borderRadius: '50px',
            fontWeight: 'bold',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)'
          }} className="lg:hidden"
        >
          <Link
            to="/auth?tab=signup"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            <Sparkles size={16} />
            Join Now
          </Link>
        </motion.div>
      )}

      {/* Space for fixed navbar */}
      <div style={{ height: '72px' }} />
    </>
  );
};

export default Navbar;