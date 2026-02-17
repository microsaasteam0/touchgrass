import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Trophy, MessageSquare, 
  Users, Settings, HelpCircle, LogOut,
  ChevronLeft, ChevronRight, Zap, Crown,
  Flame, Target, Bell, ChartBar,
  Calendar, TrendingUp, Award, Shield
} from 'lucide-react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authState, logout } from '../../state/auth';
import { useStreak } from '../../contexts/StreakContext';
import { toast } from 'react-hot-toast';
import Logo from '../ui/Logo';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useRecoilValue(authState);
  const setAuth = useSetRecoilState(authState);
  const { currentStreak, longestStreak, todayVerified } = useStreak();

  const handleLogout = () => {
    logout(setAuth);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navItems = [
    {
      section: 'Main',
      items: [
        {
          path: '/dashboard',
          label: 'Dashboard',
          icon: <LayoutDashboard className="w-5 h-5" />,
          badge: 'New'
        },
        {
          path: '/verify',
          label: 'Verify Today',
          icon: <Target className="w-5 h-5" />,
          badge: 'Daily'
        },
        {
          path: '/leaderboard',
          label: 'Leaderboard',
          icon: <Trophy className="w-5 h-5" />,
          badge: null
        },
        {
          path: '/chat',
          label: 'Community Chat',
          icon: <MessageSquare className="w-5 h-5" />,
          badge: '12'
        },
        {
          path: '/challenges',
          label: 'Challenges',
          icon: <Zap className="w-5 h-5" />,
          badge: '3'
        }
      ]
    },
    {
      section: 'Analytics',
      items: [
        {
          path: '/analytics',
          label: 'Analytics',
          icon: <ChartBar className="w-5 h-5" />,
          badge: null
        },
        {
          path: '/calendar',
          label: 'Calendar',
          icon: <Calendar className="w-5 h-5" />,
          badge: null
        },
        {
          path: '/progress',
          label: 'Progress',
          icon: <TrendingUp className="w-5 h-5" />,
          badge: null
        }
      ]
    },
    {
      section: 'Community',
      items: [
        {
          path: '/friends',
          label: 'Friends',
          icon: <Users className="w-5 h-5" />,
          badge: '42'
        },
        {
          path: '/groups',
          label: 'Groups',
          icon: <Users className="w-5 h-5" />,
          badge: null
        }
      ]
    }
  ];

  const settingsItems = [
    {
      path: '/profile',
      label: 'Profile',
      icon: <Settings className="w-5 h-5" />
    },
    {
      path: '/subscription',
      label: 'Subscription',
      icon: <Crown className="w-5 h-5" />
    },
    {
      path: '/notifications',
      label: 'Notifications',
      icon: <Bell className="w-5 h-5" />
    },
    {
      path: '/help',
      label: 'Help Center',
      icon: <HelpCircle className="w-5 h-5" />
    }
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  // CSS Styles integrated directly
  const styles = {
    sidebar: {
      position: 'relative',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      background: 'linear-gradient(to bottom, #111827, #1f2937)',
      transition: 'all 0.5s ease',
      width: isCollapsed ? '80px' : '256px'
    },
    collapseToggle: {
      position: 'absolute',
      right: '-12px',
      top: '32px',
      zIndex: 10,
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      border: '2px solid #111827',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
      cursor: 'pointer'
    },
    logoContainer: {
      padding: '1.5rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      textDecoration: 'none'
    },
    logoInner: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    logoIcon: {
      position: 'relative',
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 0 30px rgba(34, 197, 94, 0.3)'
    },
    premiumDot: {
      position: 'absolute',
      top: '-4px',
      right: '-4px',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
      border: '2px solid #111827'
    },
    logoText: {
      fontSize: '1.125rem',
      fontWeight: 'bold',
      background: 'linear-gradient(90deg, #22c55e, #ffffff, #86efac)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    logoSubtext: {
      fontSize: '0.75rem',
      color: '#9ca3af'
    },
    userContainer: {
      padding: '1.5rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1rem'
    },
    userAvatar: {
      position: 'relative',
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: '#22c55e',
      border: '2px solid #111827'
    },
    userText: {
      flex: 1,
      minWidth: 0
    },
    userName: {
      fontWeight: 'bold',
      fontSize: '0.875rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    userHandle: {
      fontSize: '0.75rem',
      color: '#9ca3af',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    streakCard: {
      position: 'relative',
      padding: '1rem',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))',
      border: '1px solid rgba(34, 197, 94, 0.2)',
      marginBottom: '1rem'
    },
    streakHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '0.5rem'
    },
    streakLabel: {
      fontSize: '0.75rem',
      color: '#9ca3af'
    },
    streakIcon: {
      width: '16px',
      height: '16px',
      color: '#22c55e'
    },
    streakCount: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#22c55e'
    },
    streakSubtext: {
      fontSize: '0.75rem',
      color: '#6b7280',
      marginTop: '0.25rem'
    },
    streakGlow: {
      position: 'absolute',
      inset: 0,
      borderRadius: '12px',
      border: '1px solid rgba(34, 197, 94, 0.2)',
      pointerEvents: 'none'
    },
    premiumCard: {
      padding: '0.75rem',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))',
      border: '1px solid rgba(245, 158, 11, 0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    premiumIcon: {
      width: '16px',
      height: '16px',
      color: '#f59e0b'
    },
    premiumText: {
      fontSize: '0.75rem',
      fontWeight: 'bold',
      color: '#f59e0b'
    },
    premiumSubtext: {
      fontSize: '0.75rem',
      color: '#9ca3af'
    },
    collapsedUser: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem'
    },
    collapsedAvatar: {
      position: 'relative',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    collapsedStreak: {
      position: 'relative',
      padding: '0.5rem',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))',
      border: '1px solid rgba(34, 197, 94, 0.2)'
    },
    collapsedStreakIcon: {
      width: '20px',
      height: '20px',
      color: '#22c55e'
    },
    collapsedStreakBadge: {
      position: 'absolute',
      top: '-4px',
      right: '-4px',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: '#22c55e',
      fontSize: '8px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    },
    navContent: {
      flex: 1,
      overflowY: 'auto',
      paddingTop: '1.5rem',
      paddingBottom: '1.5rem'
    },
    section: {
      marginBottom: '2rem'
    },
    sectionTitle: {
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
      marginBottom: '0.75rem',
      fontSize: '0.75rem',
      fontWeight: 600,
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    navItems: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
      paddingLeft: '0.75rem',
      paddingRight: '0.75rem'
    },
    navItem: {
      position: 'relative',
      textDecoration: 'none'
    },
    navLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      textDecoration: 'none'
    },
    navIcon: {
      position: 'relative',
      transition: 'color 0.3s ease'
    },
    iconGlow: {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      opacity: 0.2
    },
    navLabel: {
      flex: 1,
      fontWeight: 500,
      fontSize: '0.875rem',
      transition: 'color 0.3s ease',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    navBadge: {
      padding: '0.125rem 0.5rem',
      fontSize: '0.75rem',
      borderRadius: '9999px',
      fontWeight: 500
    },
    activeIndicator: {
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: '4px',
      height: '24px',
      background: 'linear-gradient(to bottom, #22c55e, #16a34a)',
      borderRadius: '0 4px 4px 0'
    },
    tooltip: {
      position: 'absolute',
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginLeft: '0.75rem',
      zIndex: 50
    },
    tooltipContent: {
      background: '#111827',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '0.75rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      whiteSpace: 'nowrap'
    },
    tooltipArrow: {
      width: '8px',
      height: '8px',
      background: '#111827',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      transform: 'rotate(45deg)',
      position: 'absolute',
      left: '-4px',
      top: '50%',
      transform: 'translateY(-50%) rotate(45deg)'
    },
    tooltipTitle: {
      fontWeight: 600,
      fontSize: '0.875rem'
    },
    tooltipBadge: {
      fontSize: '0.75rem',
      color: '#9ca3af',
      marginTop: '0.25rem'
    },
    settingsSection: {
      padding: '1.5rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    settingsItems: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    },
    settingsLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.5rem 0.75rem',
      color: '#9ca3af',
      textDecoration: 'none',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      fontSize: '0.875rem'
    },
    collapsedSettings: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem'
    },
    collapsedSettingIcon: {
      padding: '0.5rem',
      color: '#9ca3af',
      textDecoration: 'none',
      borderRadius: '8px',
      transition: 'all 0.3s ease'
    },
    logoutButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      width: '100%',
      padding: '0.75rem',
      color: '#ef4444',
      background: 'transparent',
      border: 'none',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      fontSize: '0.875rem',
      fontWeight: 500,
      cursor: 'pointer'
    },
    planCard: {
      marginTop: '1rem',
      padding: '1rem',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))',
      border: '1px solid rgba(245, 158, 11, 0.2)'
    },
    planHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.5rem'
    },
    planIcon: {
      width: '16px',
      height: '16px',
      color: '#f59e0b'
    },
    planTitle: {
      fontSize: '0.75rem',
      fontWeight: 'bold',
      color: '#f59e0b'
    },
    planSubtitle: {
      fontSize: '0.75rem',
      color: '#9ca3af'
    },
    planButton: {
      width: '100%',
      marginTop: '0.75rem',
      padding: '0.5rem',
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1))',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      borderRadius: '8px',
      fontSize: '0.75rem',
      fontWeight: 500,
      color: '#f59e0b',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    decorativeLine: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.2), transparent)'
    }
  };

  // Animation keyframes
  const animationStyles = `
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
  `;

  return (
    <>
      <style>{animationStyles}</style>
      
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={styles.sidebar}
      >
        {/* Collapse Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={styles.collapseToggle}
        >
          {isCollapsed ? (
            <ChevronRight style={{ width: '12px', height: '12px', color: 'white' }} />
          ) : (
            <ChevronLeft style={{ width: '12px', height: '12px', color: 'white' }} />
          )}
        </motion.button>

        {/* Logo */}
        <div style={styles.logoContainer}>
          <Logo size="small" showSubtitle={false} />
        </div>

        {/* User Profile */}
        <div style={styles.userContainer}>
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {/* User Info */}
              <div style={styles.userInfo}>
                <div style={{ position: 'relative' }}>
                  <div style={styles.userAvatar}>
                    {auth.user?.avatar ? (
                      <img 
                        src={auth.user.avatar} 
                        alt="" 
                        style={{ width: '100%', height: '100%', borderRadius: '50%' }} 
                      />
                    ) : (
                      <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'white' }}>
                        {auth.user?.displayName?.[0]}
                      </span>
                    )}
                  </div>
                  {/* Online indicator */}
                  <div style={styles.onlineIndicator} />
                </div>
                
                <div style={styles.userText}>
                  <div style={styles.userName}>{auth.user?.displayName}</div>
                  <div style={styles.userHandle}>@{auth.user?.username}</div>
                </div>
              </div>

              {/* Streak Badge */}
              <div style={styles.streakCard}>
                <div style={styles.streakHeader}>
                  <div style={styles.streakLabel}>Current Streak</div>
                  <Flame style={styles.streakIcon} />
                </div>
                <div style={styles.streakCount}>{currentStreak || 0} days</div>
                <div style={styles.streakSubtext}>🔥 Personal best: {longestStreak || 0} days</div>
                
                {/* Animated glow */}
                <motion.div
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={styles.streakGlow}
                />
              </div>

              {/* Premium Status */}
              <div style={styles.premiumCard}>
                <Crown style={styles.premiumIcon} />
                <div>
                  <div style={styles.premiumText}>ELITE TIER</div>
                  <div style={styles.premiumSubtext}>All features unlocked</div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div style={styles.collapsedUser}>
              {/* User Avatar */}
              <div style={{ position: 'relative' }}>
                <div style={styles.collapsedAvatar}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'white' }}>
                    {auth.user?.displayName?.[0]}
                  </span>
                </div>
                <div style={{
                  ...styles.onlineIndicator,
                  width: '8px',
                  height: '8px',
                  border: '1px solid #111827'
                }} />
              </div>

              {/* Streak Icon */}
              <div style={styles.collapsedStreak}>
                <Flame style={styles.collapsedStreakIcon} />
                <div style={styles.collapsedStreakBadge}>{currentStreak || 0}</div>
              </div>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <div style={styles.navContent}>
          {navItems.map((section) => (
            <div key={section.section} style={styles.section}>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={styles.sectionTitle}
                >
                  {section.section}
                </motion.div>
              )}

              <div style={styles.navItems}>
                {section.items.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <motion.div
                      key={item.path}
                      onHoverStart={() => setHoveredItem(item.path)}
                      onHoverEnd={() => setHoveredItem(null)}
                      whileHover={{ x: 4 }}
                      style={styles.navItem}
                    >
                      <Link
                        to={item.path}
                        style={{
                          ...styles.navLink,
                          background: active
                            ? 'linear-gradient(90deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))'
                            : 'transparent',
                          border: active ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            e.target.style.background = 'transparent';
                            e.target.style.borderColor = 'transparent';
                          }
                        }}
                      >
                        {/* Icon */}
                        <div style={{
                          ...styles.navIcon,
                          color: active ? '#22c55e' : hoveredItem === item.path ? '#ffffff' : '#9ca3af'
                        }}>
                          {item.icon}
                          
                          {/* Icon glow effect */}
                          {hoveredItem === item.path && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              style={{
                                ...styles.iconGlow,
                                background: 'currentColor'
                              }}
                            />
                          )}
                        </div>

                        {/* Label */}
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            style={{
                              ...styles.navLabel,
                              color: active ? '#ffffff' : hoveredItem === item.path ? '#ffffff' : '#9ca3af'
                            }}
                          >
                            {item.label}
                          </motion.span>
                        )}

                        {/* Badge */}
                        {item.badge && !isCollapsed && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                              ...styles.navBadge,
                              background: item.badge === 'New' 
                                ? 'rgba(34, 197, 94, 0.2)' 
                                : item.badge === 'Daily'
                                ? 'rgba(59, 130, 246, 0.2)'
                                : 'rgba(139, 92, 246, 0.2)',
                              color: item.badge === 'New' 
                                ? '#22c55e' 
                                : item.badge === 'Daily'
                                ? '#3b82f6'
                                : '#8b5cf6'
                            }}
                          >
                            {item.badge}
                          </motion.span>
                        )}

                        {/* Active indicator */}
                        {active && !isCollapsed && (
                          <motion.div
                            layoutId="sidebarActive"
                            style={styles.activeIndicator}
                          />
                        )}
                      </Link>

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && hoveredItem === item.path && (
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          style={styles.tooltip}
                        >
                          <div style={styles.tooltipContent}>
                            <div style={styles.tooltipTitle}>{item.label}</div>
                            {item.badge && (
                              <div style={styles.tooltipBadge}>{item.badge}</div>
                            )}
                          </div>
                          <div style={styles.tooltipArrow} />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Settings & Logout */}
        <div style={styles.settingsSection}>
          {/* Settings Items */}
          {!isCollapsed ? (
            <div style={styles.settingsItems}>
              {settingsItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  style={styles.settingsLink}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#9ca3af';
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div style={styles.collapsedSettings}>
              {settingsItems.slice(0, 3).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  style={styles.collapsedSettingIcon}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#9ca3af';
                  }}
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          )}

          {/* Logout Button */}
          <motion.button
            whileHover={{ x: 4 }}
            onClick={handleLogout}
            style={{
              ...styles.logoutButton,
              justifyContent: isCollapsed ? 'center' : 'flex-start'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
          >
            <LogOut style={{ width: '20px', height: '20px' }} />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
              >
                Logout
              </motion.span>
            )}
          </motion.button>

          {/* Current Plan */}
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={styles.planCard}
            >
              <div style={styles.planHeader}>
                <Shield style={styles.planIcon} />
                <div style={styles.planTitle}>Elite Plan</div>
              </div>
              <div style={styles.planSubtitle}>Renews in 14 days</div>
              <button
                style={styles.planButton}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(245, 158, 11, 0.2))';
                  e.target.style.borderColor = 'rgba(245, 158, 11, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1))';
                  e.target.style.borderColor = 'rgba(245, 158, 11, 0.3)';
                }}
              >
                Manage Plan
              </button>
            </motion.div>
          )}
        </div>

        {/* Decorative elements */}
        <div style={styles.decorativeLine} />
      </motion.aside>
    </>
  );
};

export default Sidebar;