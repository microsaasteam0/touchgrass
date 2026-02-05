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
  
  // Disable API for now
  const USE_API = false;

  const getAuthToken = () => {
    const tokens = [
      localStorage.getItem('touchgrass_token'),
      localStorage.getItem('supabase.auth.token'),
      localStorage.getItem('sb-auth-token')
    ];
    
    const token = tokens.find(t => t !== null && t !== 'undefined');
    
    if (token) {
      try {
        const parsed = JSON.parse(token);
        return parsed.access_token || token;
      } catch {
        return token;
      }
    }
    
    return null;
  };

  const loadNotifications = async () => {
    // Use local storage if API is disabled or no token
    if (!USE_API || !getAuthToken()) {
      const storedData = localStorage.getItem('touchgrass_notifications');
      if (storedData) {
        try {
          const data = JSON.parse(storedData);
          return { notifications: data };
        } catch (e) {
        }
      }
      
      // Default mock notifications
      const mockNotifications = [
        {
          id: '1',
          type: 'streak',
          title: 'Daily Reminder',
          message: 'Time to verify your streak!',
          read: false,
          createdAt: new Date().toISOString(),
          icon: '🔥'
        },
        {
          id: '2',
          type: 'achievement',
          title: 'Achievement Unlocked',
          message: 'You reached a 3-day streak!',
          read: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          icon: '🏆'
        }
      ];
      
      return { notifications: mockNotifications };
    }

    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5001/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('touchgrass_notifications', JSON.stringify(data.notifications || []));
        return data;
      }
      
      // Fallback to localStorage
      const storedData = localStorage.getItem('touchgrass_notifications');
      if (storedData) {
        return { notifications: JSON.parse(storedData) };
      }
      
      return { notifications: [] };
    } catch (error) {
      const storedData = localStorage.getItem('touchgrass_notifications');
      if (storedData) {
        return { notifications: JSON.parse(storedData) };
      }
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