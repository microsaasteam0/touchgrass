import React from 'react';
  
  
  
  
  import React, { useState, useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';
import { createGlobalStyle } from 'styled-components';

// ==============================
// GLOBAL STYLES
// ==============================
const GlobalChatStyles = createGlobalStyle`
  .chat-gradient-bg {
    background: linear-gradient(135deg, 
      rgba(30, 64, 175, 0.05) 0%, 
      rgba(124, 58, 237, 0.05) 50%, 
      rgba(14, 165, 233, 0.05) 100%);
  }

  .message-bubble {
    position: relative;
    padding: 0.75rem 1rem;
    border-radius: 1rem;
    max-width: 70%;
    word-wrap: break-word;
    animation: slideIn 0.3s ease-out;
  }

  .message-bubble-own {
    background: linear-gradient(135deg, var(--grass-500), var(--grass-600));
    color: white;
    border-bottom-right-radius: 0.25rem;
    margin-left: auto;
  }

  .message-bubble-other {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    border-bottom-left-radius: 0.25rem;
    margin-right: auto;
  }

  .typing-indicator {
    display: flex;
    gap: 0.25rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    width: fit-content;
  }

  .typing-dot {
    width: 0.5rem;
    height: 0.5rem;
    background: var(--grass-400);
    border-radius: 50%;
    animation: typing 1.4s infinite;
  }

  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes typing {
    0%, 100% { transform: translateY(0); opacity: 0.5; }
    50% { transform: translateY(-0.5rem); opacity: 1; }
  }

  @keyframes slideIn {
    from { 
      transform: translateY(1rem) scale(0.95);
      opacity: 0;
    }
    to { 
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }

  .chat-notification {
    animation: notificationPulse 0.6s ease-out;
  }

  @keyframes notificationPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  .online-status {
    width: 0.5rem;
    height: 0.5rem;
    background: var(--grass-500);
    border-radius: 50%;
    display: inline-block;
    margin-right: 0.5rem;
    animation: statusPulse 2s infinite;
  }

  @keyframes statusPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
    70% { box-shadow: 0 0 0 0.5rem rgba(34, 197, 94, 0); }
    100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
  }

  .streak-share-message {
    background: linear-gradient(135deg, 
      rgba(34, 197, 94, 0.1) 0%, 
      rgba(251, 191, 36, 0.1) 100%);
    border: 1px solid rgba(251, 191, 36, 0.2);
    border-radius: 1rem;
    padding: 1rem;
    position: relative;
    overflow: hidden;
  }

  .streak-share-message::before {
    content: '🔥';
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    font-size: 1rem;
    opacity: 0.5;
  }

  .message-reaction {
    position: absolute;
    bottom: -0.5rem;
    right: 0.5rem;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 0.75rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    animation: popIn 0.2s ease-out;
  }

  @keyframes popIn {
    from { transform: scale(0); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  .chat-input-glow {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(34, 197, 94, 0.3);
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
  }

  .chat-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .chat-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  .chat-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(var(--grass-500), var(--grass-600));
    border-radius: 3px;
  }

  .chat-avatar-ring {
    border: 2px solid transparent;
    background: linear-gradient(white, white) padding-box,
                linear-gradient(45deg, var(--grass-500), var(--premium-gold)) border-box;
    animation: rotate 3s linear infinite;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .unread-badge {
    animation: badgePulse 1.5s infinite;
  }

  @keyframes badgePulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

// ==============================
// ATOM DEFINITIONS
// ==============================
export const chatState = atom({
  key: 'chatState',
  default: {
    activeChat: null,
    chats: [],
    messages: {},
    unreadCount: 0,
    onlineUsers: [],
    typingUsers: {},
    socket: null,
    loading: false,
    error: null
  }
});

export const chatModalState = atom({
  key: 'chatModalState',
  default: {
    isOpen: false,
    type: 'new', // 'new' | 'info' | 'media'
    chatId: null
  }
});

// ==============================
// CHAT SERVICE
// ==============================
class ChatService {
  constructor() {
    this.API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    this.socket = null;
  }

  connectSocket(token) {
    this.socket = new WebSocket(`ws://localhost:5000?token=${token}`);
    
    this.socket.onopen = () => {
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    return this.socket;
  }

  handleMessage(data) {
    switch (data.type) {
      case 'new_message':
        this.onNewMessage(data.message);
        break;
      case 'typing':
        this.onTyping(data.userId, data.isTyping);
        break;
      case 'user_online':
        this.onUserOnline(data.userId);
        break;
      case 'user_offline':
        this.onUserOffline(data.userId);
        break;
    }
  }

  async getChats() {
    const response = await fetch(`${this.API_URL}/chat/chats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }

  async getMessages(chatId, before = null) {
    let url = `${this.API_URL}/chat/chats/${chatId}/messages`;
    if (before) url += `?before=${before}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }

  async sendMessage(chatId, text, type = 'text', attachments = []) {
    const response = await fetch(`${this.API_URL}/chat/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ chatId, text, type, attachments })
    });
    return response.json();
  }

  async createDirectChat(userId) {
    const response = await fetch(`${this.API_URL}/chat/chats/direct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ userId })
    });
    return response.json();
  }

  async markAsRead(chatId) {
    const response = await fetch(`${this.API_URL}/chat/chats/${chatId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }

  sendTyping(chatId, isTyping) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'typing',
        chatId,
        isTyping
      }));
    }
  }

  onNewMessage(callback) {
    this.onNewMessageCallback = callback;
  }

  onTyping(callback) {
    this.onTypingCallback = callback;
  }

  onUserOnline(callback) {
    this.onUserOnlineCallback = callback;
  }

  onUserOffline(callback) {
    this.onUserOfflineCallback = callback;
  }
}

export const chatService = new ChatService();

// ==============================
// HOOKS
// ==============================
export const useChat = () => {
  const [chat, setChat] = useRecoilState(chatState);
  const [modal, setModal] = useRecoilState(chatModalState);

  const loadChats = async () => {
    setChat(prev => ({ ...prev, loading: true }));
    try {
      const chats = await chatService.getChats();
      setChat(prev => ({ ...prev, chats, loading: false }));
    } catch (error) {
      setChat(prev => ({ ...prev, loading: false, error: error.message }));
    }
  };

  const loadMessages = async (chatId) => {
    try {
      const messages = await chatService.getMessages(chatId);
      setChat(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [chatId]: messages
        }
      }));
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async (chatId, text, type = 'text', attachments = []) => {
    try {
      const message = await chatService.sendMessage(chatId, text, type, attachments);
      
      setChat(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [chatId]: [...(prev.messages[chatId] || []), message]
        }
      }));

      return message;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  const startTyping = (chatId) => {
    chatService.sendTyping(chatId, true);
  };

  const stopTyping = (chatId) => {
    chatService.sendTyping(chatId, false);
  };

  const setActiveChat = (chat) => {
    setChat(prev => ({ ...prev, activeChat: chat }));
    if (chat) {
      loadMessages(chat._id);
      chatService.markAsRead(chat._id);
    }
  };

  const openChatModal = (type = 'new', chatId = null) => {
    setModal({ isOpen: true, type, chatId });
  };

  const closeChatModal = () => {
    setModal({ isOpen: false, type: 'new', chatId: null });
  };

  const calculateUnreadCount = () => {
    // Calculate total unread messages across all chats
    return chat.chats.reduce((total, c) => total + (c.unreadCount || 0), 0);
  };

  return {
    ...chat,
    modal,
    loadChats,
    loadMessages,
    sendMessage,
    startTyping,
    stopTyping,
    setActiveChat,
    openChatModal,
    closeChatModal,
    calculateUnreadCount
  };
};

// ==============================
// UI COMPONENTS
// ==============================
export const ChatWindow = ({ chatId, onClose }) => {
  const { activeChat, messages, sendMessage, startTyping, stopTyping } = useChat();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = React.useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages[chatId]]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    await sendMessage(chatId, inputText);
    setInputText('');
    stopTyping(chatId);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      startTyping(chatId);
    }

    // Clear typing indicator after 2 seconds
    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      setIsTyping(false);
      stopTyping(chatId);
    }, 2000);
  };

  const renderMessage = (message) => {
    const isOwn = message.sender._id === 'current-user-id'; // Replace with actual user ID
    const isStreakShare = message.type === 'streak_share';

    return (
      <div style={styles.messageWrapper(isOwn)}>
        {!isOwn && (
          <div style={styles.avatarContainer}>
            <div style={styles.avatar}>
              <img 
                src={message.sender.avatar} 
                alt={message.sender.displayName}
                style={styles.avatarImage}
              />
            </div>
          </div>
        )}
        
        <div style={styles.messageContent}>
          {!isOwn && (
            <div style={styles.senderName}>
              {message.sender.displayName}
            </div>
          )}
          
          <div 
            className={`message-bubble ${isOwn ? 'message-bubble-own' : 'message-bubble-other'} ${isStreakShare ? 'streak-share-message' : ''}`}
            style={styles.messageBubble}
          >
            {message.text}
            
            {message.reactions?.length > 0 && (
              <div className="message-reaction">
                {message.reactions.map((r, i) => (
                  <span key={i}>{r.emoji}</span>
                ))}
              </div>
            )}
          </div>
          
          <div style={styles.messageTime}>
            {new Date(message.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <GlobalChatStyles />
      <div style={styles.chatContainer}>
        {/* Chat Header */}
        <div style={styles.chatHeader}>
          <div style={styles.chatInfo}>
            <div style={styles.chatAvatar}>
              <span style={styles.chatAvatarIcon}>💬</span>
            </div>
            <div>
              <div style={styles.chatTitle}>
                {activeChat?.name || 'Chat'}
                {activeChat?.participants?.length > 2 && (
                  <span style={styles.participantCount}>
                    ({activeChat.participants.length})
                  </span>
                )}
              </div>
              <div style={styles.chatStatus}>
                <span className="online-status"></span>
                <span>Online now</span>
              </div>
            </div>
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        {/* Messages Container */}
        <div className="chat-scrollbar" style={styles.messagesContainer}>
          {messages[chatId]?.map((message) => (
            <div key={message._id}>
              {renderMessage(message)}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Typing Indicator */}
        {isTyping && (
          <div style={styles.typingContainer}>
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div style={styles.inputContainer}>
          <div style={styles.inputWrapper}>
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              style={styles.input}
              className={inputText ? 'chat-input-glow' : ''}
            />
            <div style={styles.inputActions}>
              <button style={styles.actionButton}>😊</button>
              <button style={styles.actionButton}>📎</button>
              <button 
                onClick={handleSend}
                style={styles.sendButton}
                disabled={!inputText.trim()}
              >
                <span style={styles.sendIcon}>↑</span>
              </button>
            </div>
          </div>
          
          <div style={styles.quickActions}>
            <button style={styles.quickAction}>
              <span style={styles.quickActionIcon}>🔥</span>
              <span>Share Streak</span>
            </button>
            <button style={styles.quickAction}>
              <span style={styles.quickActionIcon}>🏆</span>
              <span>Challenge</span>
            </button>
            <button style={styles.quickAction}>
              <span style={styles.quickActionIcon}>📸</span>
              <span>Photo</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ==============================
// STYLES
// ==============================
const styles = {
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(31, 41, 55, 0.9) 100%)',
    borderRadius: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden'
  },

  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },

  chatInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },

  chatAvatar: {
    width: '3rem',
    height: '3rem',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--grass-500), var(--grass-600))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem'
  },

  chatAvatarIcon: {
    animation: 'bounce 2s infinite'
  },

  chatTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white'
  },

  participantCount: {
    fontSize: '0.875rem',
    color: 'var(--gray-400)',
    marginLeft: '0.5rem'
  },

  chatStatus: {
    fontSize: '0.75rem',
    color: 'var(--gray-400)',
    display: 'flex',
    alignItems: 'center'
  },

  closeButton: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    width: '2.5rem',
    height: '2.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },

  messagesContainer: {
    flex: 1,
    padding: '1.5rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },

  messageWrapper: (isOwn) => ({
    display: 'flex',
    flexDirection: isOwn ? 'row-reverse' : 'row',
    alignItems: 'flex-end',
    gap: '0.75rem',
    maxWidth: '100%'
  }),

  avatarContainer: {
    flexShrink: 0
  },

  avatar: {
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid transparent'
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },

  messageContent: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '70%'
  },

  senderName: {
    fontSize: '0.75rem',
    color: 'var(--gray-400)',
    marginBottom: '0.25rem',
    marginLeft: '0.5rem'
  },

  messageBubble: {
    padding: '0.75rem 1rem',
    borderRadius: '1rem',
    fontSize: '0.875rem',
    lineHeight: '1.4',
    position: 'relative'
  },

  messageTime: {
    fontSize: '0.625rem',
    color: 'var(--gray-500)',
    marginTop: '0.25rem',
    textAlign: 'right'
  },

  typingContainer: {
    padding: '0 1.5rem',
    marginBottom: '1rem'
  },

  inputContainer: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.05)'
  },

  inputWrapper: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '0.75rem'
  },

  input: {
    flex: 1,
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '0.875rem 1rem',
    color: 'white',
    fontSize: '0.875rem',
    transition: 'all 0.3s ease'
  },

  inputActions: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  },

  actionButton: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    width: '2.5rem',
    height: '2.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },

  sendButton: {
    background: 'linear-gradient(135deg, var(--grass-500), var(--grass-600))',
    border: 'none',
    borderRadius: '0.75rem',
    width: '2.5rem',
    height: '2.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },

  sendIcon: {
    fontSize: '1.25rem',
    fontWeight: 'bold'
  },

  quickActions: {
    display: 'flex',
    gap: '0.5rem',
    overflowX: 'auto',
    paddingBottom: '0.25rem'
  },

  quickAction: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    padding: '0.5rem 0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'white',
    fontSize: '0.75rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease'
  },

  quickActionIcon: {
    fontSize: '0.875rem'
  }
};

// Add additional animations
const chatAnimations = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
`;

// Inject animations
const chatStyleSheet = document.styleSheets[0];
chatAnimations.split('}').forEach(rule => {
  if (rule.trim()) chatStyleSheet.insertRule(rule + '}', chatStyleSheet.cssRules.length);
});

export default chatState;