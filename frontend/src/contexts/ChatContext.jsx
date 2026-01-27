// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { useAuth } from './AuthContext';
// import { toast } from 'react-toastify';

// const ChatContext = createContext({});

// export const useChat = () => useContext(ChatContext);

// export const ChatProvider = ({ children }) => {
//   const { user, isAuthenticated } = useAuth();
//   const [chats, setChats] = useState([]);
//   const [activeChat, setActiveChat] = useState(null);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isAuthenticated && user) {
//       loadChats();
//       loadOnlineUsers();
//     }
//   }, [isAuthenticated, user]);

//   const loadChats = async () => {
//     try {
//       setLoading(true);
      
//       const response = await fetch('/api/chats', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setChats(data);
        
//         // Calculate unread count
//         const unread = data.reduce((total, chat) => total + (chat.unreadCount || 0), 0);
//         setUnreadCount(unread);
//       }
//     } catch (error) {
//       console.error('Failed to load chats:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadOnlineUsers = async () => {
//     try {
//       const response = await fetch('/api/chats/online', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setOnlineUsers(data);
//       }
//     } catch (error) {
//       console.error('Failed to load online users:', error);
//     }
//   };

//   const startChat = async (userId) => {
//     try {
//       setLoading(true);
      
//       const response = await fetch('/api/chats/direct', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ userId }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to start chat');
//       }

//       const chat = await response.json();
      
//       // Add to chats list if not already there
//       setChats(prev => {
//         const exists = prev.find(c => c._id === chat._id);
//         return exists ? prev : [chat, ...prev];
//       });
      
//       setActiveChat(chat);
      
//       toast.success('Chat started!', {
//         icon: '💬',
//       });
      
//       return { success: true, chat };
//     } catch (error) {
//       toast.error('Failed to start chat');
//       return { success: false, error: error.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sendMessage = async (chatId, message, attachments = []) => {
//     try {
//       const response = await fetch(`/api/chats/${chatId}/messages`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           text: message,
//           attachments,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to send message');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Failed to send message:', error);
//       throw error;
//     }
//   };

//   const markAsRead = async (chatId) => {
//     try {
//       await fetch(`/api/chats/${chatId}/read`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       // Update local state
//       setChats(prev => prev.map(chat => 
//         chat._id === chatId 
//           ? { ...chat, unreadCount: 0 }
//           : chat
//       ));
//     } catch (error) {
//       console.error('Failed to mark as read:', error);
//     }
//   };

//   const getChatSuggestions = async () => {
//     try {
//       const response = await fetch('/api/chats/suggestions', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       if (response.ok) {
//         return await response.json();
//       }
//       return [];
//     } catch (error) {
//       console.error('Failed to get suggestions:', error);
//       return [];
//     }
//   };

//   const value = {
//     chats,
//     activeChat,
//     setActiveChat,
//     unreadCount,
//     onlineUsers,
//     loading,
//     startChat,
//     sendMessage,
//     markAsRead,
//     getChatSuggestions,
//     loadChats,
//   };

//   return (
//     <ChatContext.Provider value={value}>
//       {children}
//     </ChatContext.Provider>
//   );
// };
import React, { createContext, useState, useContext, useEffect } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Add a flag to control API usage
  const USE_API = false; // Set to false to use localStorage only for now

  const getAuthToken = () => {
    // Try multiple possible token locations
    const tokens = [
      localStorage.getItem('touchgrass_token'),
      localStorage.getItem('supabase.auth.token'),
      localStorage.getItem('sb-auth-token')
    ];
    
    // Get the first non-null token
    const token = tokens.find(t => t !== null && t !== 'undefined');
    
    if (token) {
      try {
        // If it's a JSON string (like Supabase stores), parse it
        const parsed = JSON.parse(token);
        return parsed.access_token || token;
      } catch {
        return token;
      }
    }
    
    return null;
  };

  const loadChats = async () => {
    // If API is disabled or no token, use localStorage
    if (!USE_API || !getAuthToken()) {
      console.log('Using mock/offline chat data');
      const storedData = localStorage.getItem('touchgrass_chats');
      if (storedData) {
        try {
          return { messages: JSON.parse(storedData) };
        } catch (e) {
          console.warn('Failed to parse stored chats:', e);
        }
      }
      
      // Return default mock data
      return {
        messages: [
          {
            id: '1',
            sender: 'system',
            message: 'Welcome to TouchGrass! Start a conversation.',
            timestamp: new Date().toISOString(),
            read: true
          }
        ]
      };
    }

    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5001/api/chat/messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Store in localStorage for offline use
        localStorage.setItem('touchgrass_chats', JSON.stringify(data.messages || []));
        return data;
      }

      console.log('API failed, using local data');
      // Fallback to localStorage
      const storedData = localStorage.getItem('touchgrass_chats');
      if (storedData) {
        return { messages: JSON.parse(storedData) };
      }
      
      return { messages: [] };
    } catch (error) {
      console.warn('Chat API error, using local data:', error.message);
      const storedData = localStorage.getItem('touchgrass_chats');
      if (storedData) {
        return { messages: JSON.parse(storedData) };
      }
      return { messages: [] };
    }
  };

  const loadOnlineUsers = async () => {
    // Always use mock for now since we don't have real online users
    const mockUsers = [
      {
        id: 'mock1',
        username: 'demo_user',
        displayName: 'Demo User',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
        streak: 5,
        isOnline: true
      },
      {
        id: 'mock2',
        username: 'streak_master',
        displayName: 'Streak Master',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=streak',
        streak: 12,
        isOnline: true
      }
    ];
    
    return { onlineUsers: mockUsers };
  };

  useEffect(() => {
    const initializeChat = async () => {
      setLoading(true);
      try {
        const [chatsData, usersData] = await Promise.all([
          loadChats(),
          loadOnlineUsers()
        ]);
        
        setMessages(chatsData.messages || []);
        setOnlineUsers(usersData.onlineUsers || []);
      } catch (error) {
        console.error('Error initializing chat:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, []);

  return (
    <ChatContext.Provider value={{
      messages,
      onlineUsers,
      loading,
      loadChats,
      loadOnlineUsers
    }}>
      {children}
    </ChatContext.Provider>
  );
};