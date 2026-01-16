// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import { useAuth } from './AuthContext';

// const NotificationContext = createContext({});

// export const useNotification = () => useContext(NotificationContext);

// export const NotificationProvider = ({ children }) => {
//   const { user, isAuthenticated } = useAuth();
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isAuthenticated && user) {
//       loadNotifications();
//     }
//   }, [isAuthenticated, user]);

//   const loadNotifications = async () => {
//     try {
//       setLoading(true);
      
//       const response = await fetch('/api/notifications', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setNotifications(data);
        
//         const unread = data.filter(n => !n.read).length;
//         setUnreadCount(unread);
//       }
//     } catch (error) {
//       console.error('Failed to load notifications:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markAsRead = async (notificationId) => {
//     try {
//       await fetch(`/api/notifications/${notificationId}/read`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       setNotifications(prev => 
//         prev.map(notification => 
//           notification._id === notificationId 
//             ? { ...notification, read: true }
//             : notification
//         )
//       );
      
//       setUnreadCount(prev => Math.max(0, prev - 1));
//     } catch (error) {
//       console.error('Failed to mark notification as read:', error);
//     }
//   };

//   const markAllAsRead = async () => {
//     try {
//       await fetch('/api/notifications/read-all', {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       setNotifications(prev => 
//         prev.map(notification => ({ ...notification, read: true }))
//       );
      
//       setUnreadCount(0);
      
//       toast.success('All notifications marked as read');
//     } catch (error) {
//       console.error('Failed to mark all as read:', error);
//     }
//   };

//   const deleteNotification = async (notificationId) => {
//     try {
//       await fetch(`/api/notifications/${notificationId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       setNotifications(prev => 
//         prev.filter(notification => notification._id !== notificationId)
//       );
      
//       toast.info('Notification deleted');
//     } catch (error) {
//       console.error('Failed to delete notification:', error);
//     }
//   };

//   const addNotification = (notification) => {
//     setNotifications(prev => [notification, ...prev]);
    
//     if (!notification.read) {
//       setUnreadCount(prev => prev + 1);
      
//       // Show toast for important notifications
//       if (notification.priority === 'high') {
//         toast(notification.message, {
//           type: notification.type || 'info',
//           icon: notification.icon || '🔔',
//           autoClose: 5000,
//         });
//       }
//     }
//   };

//   const value = {
//     notifications,
//     unreadCount,
//     loading,
//     markAsRead,
//     markAllAsRead,
//     deleteNotification,
//     addNotification,
//     loadNotifications,
//   };

//   return (
//     <NotificationContext.Provider value={value}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };
import React, { createContext, useState, useContext, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Use the same API base as Profile.jsx
  const API_BASE_URL = 'http://localhost:5001/api';

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem('touchgrass_token');
      
      // If using mock token, return mock data
      if (!token || token.startsWith('mock_')) {
        console.log('Using mock notifications (mock token)');
        return {
          notifications: [
            {
              id: '1',
              type: 'streak',
              title: 'Daily Reminder',
              message: 'Time to verify your streak!',
              read: false,
              createdAt: new Date().toISOString()
            }
          ]
        };
      }

      // Try to get real data
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // If endpoint doesn't exist (returns HTML), use mock
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.log('Notifications endpoint returned HTML, using mock');
        return {
          notifications: [
            {
              id: '1',
              type: 'streak',
              title: 'Streak Reminder',
              message: 'Mock: Verify your daily streak!',
              read: false,
              createdAt: new Date().toISOString()
            }
          ]
        };
      }

      if (response.ok) {
        return await response.json();
      }
      
      // If error, use mock
      return {
        notifications: [
          {
            id: '1',
            type: 'system',
            title: 'System',
            message: 'Backend notifications not available',
            read: true,
            createdAt: new Date().toISOString()
          }
        ]
      };
    } catch (error) {
      console.warn('Notifications error:', error.message);
      return { notifications: [] };
    }
  };

  useEffect(() => {
    const initializeNotifications = async () => {
      setLoading(true);
      try {
        const data = await loadNotifications();
        setNotifications(data.notifications || []);
        
        const unread = (data.notifications || []).filter(n => !n.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeNotifications();
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      loadNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};