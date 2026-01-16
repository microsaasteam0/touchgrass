import React, { useState, useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';
import { createGlobalStyle } from 'styled-components';

// ==============================
// GLOBAL STYLES
// ==============================
const GlobalNotificationStyles = createGlobalStyle`
  .notification-item {
    animation: slideInRight 0.3s ease-out;
    position: relative;
    overflow: hidden;
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .notification-unread::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, var(--grass-500), var(--premium-gold));
    animation: pulse 2s infinite;
  }

  .notification-urgent {
    animation: urgentPulse 1s ease-in-out infinite;
  }

  @keyframes urgentPulse {
    0%, 100% { 
      border-color: rgba(239, 68, 68, 0.3);
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    50% { 
      border-color: rgba(239, 68, 68, 0.6);
      box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
    }
  }

  .notification-success {
    border-left: 4px solid var(--grass-500);
    animation: successGlow 2s ease-in-out infinite;
  }

  @keyframes successGlow {
    0%, 100% { 
      border-left-color: var(--grass-500);
      box-shadow: 0 0 20px rgba(34, 197, 94, 0.1);
    }
    50% { 
      border-left-color: var(--grass-400);
      box-shadow: 0 0 30px rgba(34, 197, 94, 0.2);
    }
  }

  .notification-premium {
    background: linear-gradient(135deg, 
      rgba(251, 191, 36, 0.1) 0%, 
      rgba(251, 191, 36, 0.05) 100%);
    border: 1px solid rgba(251, 191, 36, 0.2);
    position: relative;
    overflow: hidden;
  }

  .notification-premium::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to right,
      transparent 20%,
      rgba(251, 191, 36, 0.1) 50%,
      transparent 80%
    );
    animation: shine 3s infinite;
  }

  .notification-badge {
    animation: badgeBounce 0.5s ease-out;
  }

  @keyframes badgeBounce {
    0% { transform: scale(0); }
    70% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  .notification-sound-wave {
    position: relative;
  }

  .notification-sound-wave::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -0.5rem;
    transform: translateY(-50%);
    width: 0.5rem;
    height: 0.5rem;
    background: var(--grass-500);
    border-radius: 50%;
    animation: soundWave 1.5s ease-out infinite;
  }

  @keyframes soundWave {
    0% {
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
    }
  }

  .notification-fade-out {
    animation: fadeOut 0.5s ease-out forwards;
  }

  @keyframes fadeOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  .notification-group {
    animation: groupSlide 0.3s ease-out;
  }

  @keyframes groupSlide {
    from {
      max-height: 0;
      opacity: 0;
    }
    to {
      max-height: 500px;
      opacity: 1;
    }
  }

  .notification-count {
    animation: countPop 0.3s ease-out;
  }

  @keyframes countPop {
    0% { transform: scale(0); }
    70% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
`;

// ==============================
// ATOM DEFINITIONS
// ==============================
export const notificationState = atom({
  key: 'notificationState',
  default: {
    notifications: [],
    unreadCount: 0,
    settings: {
      streakReminders: true,
      leaderboardUpdates: true,
      challengeInvites: true,
      achievementUnlocks: true,
      socialInteractions: true,
      systemUpdates: true,
      soundEnabled: true,
      vibrationEnabled: false
    },
    showNotifications: false,
    loading: false,
    error: null
  }
});

export const notificationSoundState = atom({
  key: 'notificationSoundState',
  default: {
    enabled: true,
    volume: 0.5,
    currentSound: null
  }
});

// ==============================
// NOTIFICATION SERVICE
// ==============================
class NotificationService {
  constructor() {
    this.API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    this.sounds = {
      streak: '/sounds/streak-notification.mp3',
      achievement: '/sounds/achievement-unlock.mp3',
      message: '/sounds/message-notification.mp3',
      challenge: '/sounds/challenge-notification.mp3',
      urgent: '/sounds/urgent-notification.mp3'
    };
  }

  async getNotifications(limit = 50) {
    const response = await fetch(`${this.API_URL}/notifications?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }

  async markAsRead(notificationId) {
    const response = await fetch(`${this.API_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }

  async markAllAsRead() {
    const response = await fetch(`${this.API_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }

  async deleteNotification(notificationId) {
    const response = await fetch(`${this.API_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }

  async updateSettings(settings) {
    const response = await fetch(`${this.API_URL}/notifications/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(settings)
    });
    return response.json();
  }

  playSound(soundType) {
    const audio = new Audio(this.sounds[soundType] || this.sounds.message);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }

  createNotification(data) {
    return {
      id: Date.now().toString(),
      type: data.type || 'info',
      title: data.title,
      message: data.message,
      icon: data.icon || '🔔',
      color: data.color || 'var(--grass-500)',
      timestamp: new Date().toISOString(),
      read: false,
      action: data.action,
      data: data.data || {}
    };
  }
}

export const notificationService = new NotificationService();

// ==============================
// HOOKS
// ==============================
export const useNotifications = () => {
  const [state, setState] = useRecoilState(notificationState);
  const [soundState, setSoundState] = useRecoilState(notificationSoundState);

  const loadNotifications = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const notifications = await notificationService.getNotifications();
      const unreadCount = notifications.filter(n => !n.read).length;
      
      setState(prev => ({
        ...prev,
        notifications,
        unreadCount,
        loading: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }));
    }
  };

  const addNotification = (notificationData) => {
    const notification = notificationService.createNotification(notificationData);
    
    setState(prev => ({
      ...prev,
      notifications: [notification, ...prev.notifications],
      unreadCount: prev.unreadCount + 1
    }));

    // Play sound if enabled
    if (soundState.enabled && notificationData.playSound !== false) {
      notificationService.playSound(notificationData.soundType || 'message');
    }

    return notification;
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1)
      }));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      }));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      
      setState(prev => {
        const notification = prev.notifications.find(n => n.id === notificationId);
        const unreadDecrease = notification && !notification.read ? 1 : 0;
        
        return {
          ...prev,
          notifications: prev.notifications.filter(n => n.id !== notificationId),
          unreadCount: Math.max(0, prev.unreadCount - unreadDecrease)
        };
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      await notificationService.updateSettings(newSettings);
      
      setState(prev => ({
        ...prev,
        settings: { ...prev.settings, ...newSettings }
      }));
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const toggleNotifications = () => {
    setState(prev => ({
      ...prev,
      showNotifications: !prev.showNotifications
    }));
  };

  const getNotificationIcon = (type) => {
    const icons = {
      streak: '🔥',
      achievement: '🏆',
      message: '💬',
      challenge: '⚔️',
      payment: '💳',
      system: '⚙️',
      urgent: '🚨',
      warning: '⚠️',
      success: '✅',
      info: 'ℹ️'
    };
    return icons[type] || '🔔';
  };

  const getNotificationColor = (type) => {
    const colors = {
      streak: 'var(--grass-500)',
      achievement: 'var(--premium-gold)',
      message: 'var(--grass-400)',
      challenge: 'var(--premium-diamond)',
      payment: 'var(--premium-gold)',
      system: 'var(--gray-400)',
      urgent: 'var(--shame-500)',
      warning: 'var(--shame-400)',
      success: 'var(--grass-400)',
      info: 'var(--gray-300)'
    };
    return colors[type] || 'var(--grass-500)';
  };

  const groupNotificationsByDate = () => {
    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: []
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    state.notifications.forEach(notification => {
      const notifDate = new Date(notification.timestamp);
      
      if (notifDate >= today) {
        groups.today.push(notification);
      } else if (notifDate >= yesterday) {
        groups.yesterday.push(notification);
      } else if (notifDate >= weekAgo) {
        groups.thisWeek.push(notification);
      } else {
        groups.older.push(notification);
      }
    });

    return groups;
  };

  return {
    ...state,
    soundState,
    loadNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateSettings,
    toggleNotifications,
    getNotificationIcon,
    getNotificationColor,
    groupNotificationsByDate
  };
};

// ==============================
// UI COMPONENTS
// ==============================
export const NotificationCenter = () => {
  const {
    showNotifications,
    notifications,
    unreadCount,
    settings,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    toggleNotifications,
    getNotificationIcon,
    getNotificationColor,
    groupNotificationsByDate
  } = useNotifications();

  const [activeTab, setActiveTab] = useState('all');
  const groups = groupNotificationsByDate();

  if (!showNotifications) return null;

  return (
    <>
      <GlobalNotificationStyles />
      <div style={styles.overlay} onClick={toggleNotifications}></div>
      <div style={styles.notificationCenter}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <h3 style={styles.title}>Notifications</h3>
            {unreadCount > 0 && (
              <div className="notification-count" style={styles.unreadBadge}>
                {unreadCount}
              </div>
            )}
          </div>
          <div style={styles.headerActions}>
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              style={styles.markAllButton}
            >
              Mark all read
            </button>
            <button onClick={toggleNotifications} style={styles.closeButton}>
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              ...styles.tab,
              ...(activeTab === 'all' ? styles.activeTab : {})
            }}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            style={{
              ...styles.tab,
              ...(activeTab === 'unread' ? styles.activeTab : {})
            }}
          >
            Unread
          </button>
          <button
            onClick={() => setActiveTab('important')}
            style={{
              ...styles.tab,
              ...(activeTab === 'important' ? styles.activeTab : {})
            }}
          >
            Important
          </button>
        </div>

        {/* Notifications List */}
        <div className="chat-scrollbar" style={styles.notificationsList}>
          {Object.entries(groups).map(([groupName, groupNotifications]) => {
            if (groupNotifications.length === 0) return null;

            const filteredNotifications = groupNotifications.filter(notification => {
              if (activeTab === 'unread') return !notification.read;
              if (activeTab === 'important') 
                return ['urgent', 'streak', 'achievement', 'challenge'].includes(notification.type);
              return true;
            });

            if (filteredNotifications.length === 0) return null;

            return (
              <div key={groupName} className="notification-group" style={styles.notificationGroup}>
                <div style={styles.groupHeader}>
                  {groupName.charAt(0).toUpperCase() + groupName.slice(1)}
                </div>
                {filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`notification-item ${!notification.read ? 'notification-unread' : ''} ${notification.type === 'urgent' ? 'notification-urgent' : ''} ${notification.type === 'achievement' ? 'notification-success' : ''}`}
                    style={styles.notificationItem}
                  >
                    <div style={styles.notificationIcon}>
                      <span style={{
                        fontSize: '1.25rem',
                        color: getNotificationColor(notification.type)
                      }}>
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>
                    <div style={styles.notificationContent}>
                      <div style={styles.notificationHeader}>
                        <div style={styles.notificationTitle}>
                          {notification.title}
                        </div>
                        <div style={styles.notificationTime}>
                          {formatTimeAgo(notification.timestamp)}
                        </div>
                      </div>
                      <div style={styles.notificationMessage}>
                        {notification.message}
                      </div>
                      {notification.action && (
                        <button
                          onClick={() => notification.action?.onClick?.()}
                          style={styles.notificationAction}
                        >
                          {notification.action.label}
                        </button>
                      )}
                    </div>
                    <div style={styles.notificationActions}>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          style={styles.readButton}
                          title="Mark as read"
                        >
                          •
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        style={styles.deleteButton}
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🔔</div>
              <div style={styles.emptyTitle}>No notifications yet</div>
              <div style={styles.emptyMessage}>
                We'll notify you about streaks, achievements, and challenges here
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.settingsLink}>
            <button style={styles.settingsButton}>
              ⚙️ Notification Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export const NotificationBadge = () => {
  const { unreadCount, toggleNotifications } = useNotifications();

  return (
    <div style={styles.badgeContainer} onClick={toggleNotifications}>
      <div className="notification-sound-wave" style={styles.bellIcon}>
        🔔
      </div>
      {unreadCount > 0 && (
        <div className="notification-badge" style={styles.badge}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </div>
  );
};

// ==============================
// STYLES
// ==============================
const styles = {
  // Notification Center
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'transparent',
    zIndex: 999
  },

  notificationCenter: {
    position: 'fixed',
    top: '4rem',
    right: '1rem',
    width: '380px',
    maxHeight: '80vh',
    background: 'rgba(17, 24, 39, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRadius: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    overflow: 'hidden',
    animation: 'slideDown 0.3s ease-out'
  },

  header: {
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },

  title: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'white',
    margin: 0
  },

  unreadBadge: {
    background: 'linear-gradient(135deg, var(--grass-500), var(--grass-600))',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: '700',
    minWidth: '1.5rem',
    height: '1.5rem',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 0.5rem'
  },

  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },

  markAllButton: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    padding: '0.375rem 0.75rem',
    fontSize: '0.75rem',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },

  closeButton: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    width: '2rem',
    height: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.25rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },

  tabs: {
    display: 'flex',
    padding: '0.5rem 1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    gap: '0.5rem'
  },

  tab: {
    background: 'none',
    border: 'none',
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    color: 'var(--gray-400)',
    cursor: 'pointer',
    borderRadius: '0.75rem',
    transition: 'all 0.3s ease'
  },

  activeTab: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white'
  },

  notificationsList: {
    flex: 1,
    overflowY: 'auto',
    maxHeight: 'calc(80vh - 12rem)'
  },

  notificationGroup: {
    padding: '0.75rem 0'
  },

  groupHeader: {
    padding: '0.5rem 1.5rem',
    fontSize: '0.75rem',
    color: 'var(--gray-500)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600'
  },

  notificationItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '0.75rem 1.5rem',
    transition: 'all 0.3s ease',
    position: 'relative'
  },

  notificationIcon: {
    flexShrink: 0,
    width: '2.5rem',
    height: '2.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  notificationContent: {
    flex: 1,
    minWidth: 0
  },

  notificationHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.25rem'
  },

  notificationTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'white',
    flex: 1
  },

  notificationTime: {
    fontSize: '0.75rem',
    color: 'var(--gray-500)',
    flexShrink: 0,
    marginLeft: '0.5rem'
  },

  notificationMessage: {
    fontSize: '0.875rem',
    color: 'var(--gray-300)',
    lineHeight: '1.4',
    marginBottom: '0.5rem'
  },

  notificationAction: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.5rem',
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
    color: 'var(--grass-400)',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },

  notificationActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    opacity: 0,
    transition: 'opacity 0.3s ease'
  },

  notificationItemHover: {
    background: 'rgba(255, 255, 255, 0.05)'
  },

  readButton: {
    background: 'none',
    border: 'none',
    color: 'var(--grass-400)',
    fontSize: '1.25rem',
    cursor: 'pointer',
    width: '1.5rem',
    height: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  deleteButton: {
    background: 'none',
    border: 'none',
    color: 'var(--gray-500)',
    fontSize: '1.25rem',
    cursor: 'pointer',
    width: '1.5rem',
    height: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  emptyState: {
    padding: '3rem 1.5rem',
    textAlign: 'center'
  },

  emptyIcon: {
    fontSize: '3rem',
    opacity: 0.5,
    marginBottom: '1rem'
  },

  emptyTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white',
    marginBottom: '0.5rem'
  },

  emptyMessage: {
    fontSize: '0.875rem',
    color: 'var(--gray-400)',
    lineHeight: '1.5'
  },

  footer: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.02)'
  },

  settingsLink: {
    textAlign: 'center'
  },

  settingsButton: {
    background: 'none',
    border: 'none',
    color: 'var(--gray-400)',
    fontSize: '0.875rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem'
  },

  // Notification Badge
  badgeContainer: {
    position: 'relative',
    cursor: 'pointer'
  },

  bellIcon: {
    fontSize: '1.5rem',
    animation: 'ring 2s ease-in-out infinite'
  },

  badge: {
    position: 'absolute',
    top: '-0.5rem',
    right: '-0.5rem',
    background: 'linear-gradient(135deg, var(--shame-500), var(--shame-600))',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: '700',
    minWidth: '1.25rem',
    height: '1.25rem',
    borderRadius: '0.625rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 0.375rem'
  }
};

// Helper function
const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

// Add animations
const notificationAnimations = `
  @keyframes slideDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes ring {
    0%, 100% { transform: rotate(0deg); }
    10% { transform: rotate(15deg); }
    20% { transform: rotate(-10deg); }
    30% { transform: rotate(10deg); }
    40% { transform: rotate(-5deg); }
    50% { transform: rotate(5deg); }
    60% { transform: rotate(0deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
`;

// Inject animations
const notificationStyleSheet = document.styleSheets[0];
notificationAnimations.split('}').forEach(rule => {
  if (rule.trim()) notificationStyleSheet.insertRule(rule + '}', notificationStyleSheet.cssRules.length);
});

export default notificationState;