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
  
  const API_BASE_URL = 'http://localhost:5001/api';

  const loadChats = async () => {
    try {
      const token = localStorage.getItem('touchgrass_token');
      
      if (!token || token.startsWith('mock_')) {
        console.log('Using mock chats (mock token)');
        return {
          messages: [
            {
              id: '1',
              userId: 'mock1',
              username: 'system',
              displayName: 'System',
              message: 'Chat using mock data',
              timestamp: new Date().toISOString()
            }
          ]
        };
      }

      const response = await fetch(`${API_BASE_URL}/chat/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.log('Chat endpoint returned HTML, using mock');
        return {
          messages: [
            {
              id: '1',
              userId: 'mock1',
              username: 'demo_user',
              displayName: 'Demo User',
              message: 'Welcome to TouchGrass chat! 🌱',
              timestamp: new Date().toISOString()
            }
          ]
        };
      }

      if (response.ok) {
        return await response.json();
      }
      
      return { messages: [] };
    } catch (error) {
      console.warn('Chat error:', error.message);
      return { messages: [] };
    }
  };

  const loadOnlineUsers = async () => {
    try {
      const token = localStorage.getItem('touchgrass_token');
      
      if (!token || token.startsWith('mock_')) {
        console.log('Using mock online users (mock token)');
        return {
          onlineUsers: [
            {
              id: 'mock1',
              username: 'demo_user',
              displayName: 'Demo User',
              avatar: '',
              streak: 5
            }
          ]
        };
      }

      const response = await fetch(`${API_BASE_URL}/chat/online-users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.log('Online users endpoint returned HTML, using mock');
        return {
          onlineUsers: [
            {
              id: 'mock1',
              username: 'user1',
              displayName: 'User One',
              avatar: '',
              streak: 3
            },
            {
              id: 'mock2',
              username: 'user2',
              displayName: 'User Two',
              avatar: '',
              streak: 7
            }
          ]
        };
      }

      if (response.ok) {
        return await response.json();
      }
      
      return { onlineUsers: [] };
    } catch (error) {
      console.warn('Online users error:', error.message);
      return { onlineUsers: [] };
    }
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