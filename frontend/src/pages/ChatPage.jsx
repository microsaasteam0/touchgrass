import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../state/auth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Model';
import { 
  MessageSquare, Users, Search, Plus, Send, Image, Smile, Paperclip,
  Trophy, Flame, Crown, Shield, Check, CheckCheck, MoreVertical,
  ThumbsUp, Share2, Flag, X, Video, Phone, UserPlus, Settings,
  Bell, BellOff, Volume2, VolumeX, Archive, Trash2
} from 'lucide-react';

const ChatPage = () => {
  const auth = useRecoilValue(authState);
  const navigate = useNavigate();
  const [activeChat, setActiveChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [showChatSettings, setShowChatSettings] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [chats, setChats] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      username: '@alexj',
      avatar: 'AJ',
      lastMessage: 'Just hit day 200! 🎉',
      time: '2 min ago',
      unread: 3,
      online: true,
      streak: 200,
      type: 'direct'
    },
    {
      id: 2,
      name: '7-Day Sprint Challenge',
      username: 'Challenge Group',
      avatar: '🏆',
      lastMessage: 'Morgan: Only 2 days left!',
      time: '1 hour ago',
      unread: 12,
      online: true,
      participants: 8,
      type: 'group'
    },
    {
      id: 3,
      name: 'Sarah Chen',
      username: '@sarahc',
      avatar: 'SC',
      lastMessage: 'Thanks for the motivation!',
      time: '3 hours ago',
      unread: 0,
      online: false,
      streak: 156,
      type: 'direct'
    },
    {
      id: 4,
      name: 'City Champions - SF',
      username: 'Local Group',
      avatar: '🌉',
      lastMessage: 'Weekly meetup this Saturday',
      time: 'Yesterday',
      unread: 5,
      online: true,
      participants: 42,
      type: 'group'
    },
    {
      id: 5,
      name: 'Marcus Wilson',
      username: '@marcusw',
      avatar: 'MW',
      lastMessage: 'Can you believe this weather?',
      time: '2 days ago',
      unread: 0,
      online: true,
      streak: 89,
      type: 'direct'
    },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'them', text: 'Hey! Just hit day 200 on my streak! 🎉', time: '10:30 AM', read: true },
    { id: 2, sender: 'me', text: 'That\'s amazing! Keep up the great work! 💪', time: '10:32 AM', read: true },
    { id: 3, sender: 'them', text: 'Thanks! The daily reminders really help. How\'s your streak going?', time: '10:33 AM', read: true },
    { id: 4, sender: 'me', text: 'Day 42 and going strong! This app changed my routine completely.', time: '10:35 AM', read: true },
    { id: 5, sender: 'them', text: 'Same here! The social accountability is a game-changer.', time: '10:36 AM', read: true },
    { id: 6, sender: 'me', text: 'Want to start a 7-day challenge together?', time: '10:37 AM', read: true },
    { id: 7, sender: 'them', text: 'Absolutely! Let\'s do it. I\'ll create the challenge group now.', time: '10:38 AM', read: false },
  ]);

  const [suggestedUsers, setSuggestedUsers] = useState([
    { id: 1, name: 'Taylor Smith', streak: 312, city: 'NYC', consistency: '98%' },
    { id: 2, name: 'Jordan Lee', streak: 189, city: 'London', consistency: '92%' },
    { id: 3, name: 'Casey Brown', streak: 256, city: 'Tokyo', consistency: '95%' },
    { id: 4, name: 'Riley Garcia', streak: 142, city: 'Berlin', consistency: '88%' },
  ]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: messages.length + 1,
      sender: 'me',
      text: newMessage,
      time: 'Just now',
      read: false
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simulate reply after 1 second
    setTimeout(() => {
      const replies = [
        'Great point!',
        'I totally agree!',
        'Let me check my streak...',
        'That\'s awesome motivation!',
        'Want to share this to the group?'
      ];
      
      const reply = {
        id: messages.length + 2,
        sender: 'them',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: 'Just now',
        read: false
      };
      
      setMessages(prev => [...prev, reply]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartChat = (user) => {
    setActiveChat({
      id: chats.length + 1,
      name: user.name,
      username: `@${user.name.toLowerCase().replace(' ', '')}`,
      avatar: user.name.split(' ').map(n => n[0]).join(''),
      streak: user.streak,
      type: 'direct'
    });
    
    setMessages([
      { id: 1, sender: 'me', text: `Hey ${user.name}! I saw you have a ${user.streak}-day streak. That's impressive!`, time: 'Just now', read: false }
    ]);
    
    setShowNewChat(false);
  };

  const handleCreateGroup = () => {
    setActiveChat({
      id: chats.length + 1,
      name: 'New Challenge Group',
      username: 'Group Chat',
      avatar: '👥',
      participants: 1,
      type: 'group'
    });
    
    setShowNewChat(false);
  };

  const chatStyles = `
    .chat-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      display: flex;
    }
    
    /* Sidebar */
    .chat-sidebar {
      width: 360px;
      background: rgba(255, 255, 255, 0.03);
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
    }
    
    .sidebar-header {
      padding: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .sidebar-header h2 {
      margin: 0 0 8px;
      font-size: 24px;
      font-weight: 700;
    }
    
    .sidebar-header p {
      margin: 0;
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
    }
    
    .search-container {
      position: relative;
      margin: 20px 24px;
    }
    
    .search-input {
      width: 100%;
      padding: 12px 16px 12px 44px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      font-size: 14px;
      transition: all 0.3s ease;
    }
    
    .search-input:focus {
      outline: none;
      border-color: rgba(34, 197, 94, 0.3);
      background: rgba(34, 197, 94, 0.05);
    }
    
    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.5);
    }
    
    .new-chat-button {
      margin: 0 24px 20px;
    }
    
    /* Chat list */
    .chat-list {
      flex: 1;
      overflow-y: auto;
      padding: 0 24px;
    }
    
    .chat-item {
      display: flex;
      align-items: center;
      padding: 16px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 8px;
    }
    
    .chat-item:hover {
      background: rgba(255, 255, 255, 0.05);
    }
    
    .chat-item.active {
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.2);
    }
    
    .chat-avatar {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 18px;
      margin-right: 16px;
      flex-shrink: 0;
    }
    
    .direct-avatar {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.2));
      color: #22c55e;
    }
    
    .group-avatar {
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2));
      color: #fbbf24;
    }
    
    .chat-info {
      flex: 1;
      min-width: 0;
    }
    
    .chat-info h4 {
      margin: 0 0 4px;
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .online-dot {
      width: 8px;
      height: 8px;
      background: #22c55e;
      border-radius: 50%;
    }
    
    .chat-info p {
      margin: 0;
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .chat-meta {
      text-align: right;
      margin-left: 12px;
    }
    
    .chat-time {
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
      margin-bottom: 4px;
    }
    
    .unread-badge {
      display: inline-block;
      padding: 4px 8px;
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: white;
      font-size: 12px;
      font-weight: 600;
      border-radius: 100px;
      min-width: 20px;
      text-align: center;
    }
    
    /* Main chat area */
    .chat-main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .chat-header {
      padding: 20px 32px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .chat-user {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .chat-user-info h3 {
      margin: 0 0 4px;
      font-size: 20px;
      font-weight: 600;
    }
    
    .chat-user-info p {
      margin: 0;
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
    }
    
    .chat-actions {
      display: flex;
      gap: 12px;
    }
    
    /* Messages container */
    .messages-container {
      flex: 1;
      padding: 32px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .message {
      max-width: 70%;
      padding: 16px;
      border-radius: 18px;
      position: relative;
      animation: messageSlide 0.3s ease-out;
    }
    
    @keyframes messageSlide {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .message-them {
      align-self: flex-start;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-bottom-left-radius: 4px;
    }
    
    .message-me {
      align-self: flex-end;
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(21, 128, 61, 0.2));
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-bottom-right-radius: 4px;
    }
    
    .message-text {
      margin: 0 0 8px;
      line-height: 1.5;
      word-wrap: break-word;
    }
    
    .message-time {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
      text-align: right;
    }
    
    .message-read {
      position: absolute;
      right: 8px;
      bottom: 8px;
      font-size: 12px;
      color: #22c55e;
    }
    
    /* Message input */
    .message-input-container {
      padding: 20px 32px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .input-wrapper {
      display: flex;
      gap: 12px;
      align-items: flex-end;
    }
    
    .input-actions {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }
    
    .input-action {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .input-action:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
    
    .message-input {
      flex: 1;
      min-height: 48px;
      max-height: 120px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      font-size: 14px;
      line-height: 1.5;
      resize: none;
      transition: all 0.3s ease;
    }
    
    .message-input:focus {
      outline: none;
      border-color: rgba(34, 197, 94, 0.3);
      background: rgba(34, 197, 94, 0.05);
    }
    
    .send-button {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #22c55e, #16a34a);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      flex-shrink: 0;
    }
    
    .send-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
    }
    
    .send-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    
    /* Typing indicator */
    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 18px;
      align-self: flex-start;
      margin-bottom: 16px;
    }
    
    .typing-dots {
      display: flex;
      gap: 4px;
    }
    
    .typing-dot {
      width: 8px;
      height: 8px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      animation: typing 1.4s infinite;
    }
    
    .typing-dot:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .typing-dot:nth-child(3) {
      animation-delay: 0.4s;
    }
    
    @keyframes typing {
      0%, 60%, 100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-8px);
      }
    }
    
    /* Empty state */
    .empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      text-align: center;
    }
    
    .empty-icon {
      width: 120px;
      height: 120px;
      border-radius: 30px;
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      margin-bottom: 32px;
    }
    
    .empty-state h3 {
      font-size: 28px;
      margin: 0 0 12px;
    }
    
    .empty-state p {
      color: rgba(255, 255, 255, 0.6);
      margin: 0 0 32px;
      max-width: 400px;
    }
    
    /* Quick actions */
    .quick-actions {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      max-width: 400px;
    }
    
    .quick-action {
      padding: 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .quick-action:hover {
      transform: translateY(-4px);
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(34, 197, 94, 0.3);
    }
    
    .action-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.2));
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      font-size: 24px;
    }
    
    .action-label {
      font-weight: 600;
      margin: 0 0 8px;
    }
    
    .action-description {
      color: rgba(255, 255, 255, 0.6);
      font-size: 12px;
      margin: 0;
    }
    
    /* Responsive */
    @media (max-width: 1024px) {
      .chat-sidebar {
        width: 300px;
      }
    }
    
    @media (max-width: 768px) {
      .chat-container {
        flex-direction: column;
      }
      
      .chat-sidebar {
        width: 100%;
        height: 60vh;
        border-right: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .chat-main {
        height: 40vh;
      }
      
      .quick-actions {
        grid-template-columns: 1fr;
      }
    }
  `;

  return (
    <div className="chat-container">
      <style>{chatStyles}</style>

      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h2>Community Chat</h2>
          <p>Connect, compete, and celebrate with fellow grass-touchers</p>
        </div>

        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="new-chat-button">
          <Button
            variant="primary"
            fullWidth
            leftIcon={<Plus />}
            onClick={() => setShowNewChat(true)}
          >
            New Chat
          </Button>
        </div>

        <div className="chat-list">
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`chat-item ${activeChat?.id === chat.id ? 'active' : ''}`}
              onClick={() => setActiveChat(chat)}
            >
              <div className={`chat-avatar ${chat.type === 'group' ? 'group-avatar' : 'direct-avatar'}`}>
                {chat.avatar}
              </div>
              <div className="chat-info">
                <h4>
                  {chat.name}
                  {chat.online && <span className="online-dot" />}
                </h4>
                <p>{chat.lastMessage}</p>
              </div>
              <div className="chat-meta">
                <div className="chat-time">{chat.time}</div>
                {chat.unread > 0 && (
                  <div className="unread-badge">{chat.unread}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-user">
                <div className={`chat-avatar ${activeChat.type === 'group' ? 'group-avatar' : 'direct-avatar'}`}>
                  {activeChat.avatar}
                </div>
                <div className="chat-user-info">
                  <h3>{activeChat.name}</h3>
                  <p>
                    {activeChat.type === 'direct' 
                      ? `${activeChat.streak}-day streak • ${activeChat.username}`
                      : `${activeChat.participants} participants • ${activeChat.username}`
                    }
                  </p>
                </div>
              </div>
              
              <div className="chat-actions">
                <Button
                  variant="ghost"
                  size="small"
                  leftIcon={<Video />}
                />
                <Button
                  variant="ghost"
                  size="small"
                  leftIcon={<Phone />}
                />
                <Button
                  variant="ghost"
                  size="small"
                  leftIcon={<Settings />}
                  onClick={() => setShowChatSettings(true)}
                />
              </div>
            </div>

            {/* Messages */}
            <div className="messages-container">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`message message-${message.sender}`}
                >
                  <p className="message-text">{message.text}</p>
                  <div className="message-time">
                    {message.time}
                    {message.sender === 'me' && (
                      <span className="message-read">
                        {message.read ? <CheckCheck size={12} /> : <Check size={12} />}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="typing-indicator">
                  <div className="typing-dots">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                  <span>typing...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="message-input-container">
              <div className="input-actions">
                <div className="input-action">
                  <Image size={20} />
                </div>
                <div className="input-action">
                  <Paperclip size={20} />
                </div>
                <div className="input-action">
                  <Smile size={20} />
                </div>
                <div className="input-action">
                  <Trophy size={20} />
                </div>
                <div className="input-action">
                  <Flag size={20} />
                </div>
              </div>
              
              <div className="input-wrapper">
                <textarea
                  className="message-input"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    setIsTyping(true);
                    setTimeout(() => setIsTyping(false), 2000);
                  }}
                  onKeyPress={handleKeyPress}
                  rows={1}
                />
                <button
                  className="send-button"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send size={20} color="white" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="empty-state">
            <div className="empty-icon">
              <MessageSquare size={48} />
            </div>
            <h3>Start a Conversation</h3>
            <p>
              Connect with fellow grass-touchers, share your achievements, 
              or create challenge groups to compete together.
            </p>
            
            <div className="quick-actions">
              <div className="quick-action" onClick={() => setShowNewChat(true)}>
                <div className="action-icon">
                  <Users size={24} />
                </div>
                <div className="action-label">New Chat</div>
                <p className="action-description">Connect with individual users</p>
              </div>
              
              <div className="quick-action" onClick={handleCreateGroup}>
                <div className="action-icon">
                  <Trophy size={24} />
                </div>
                <div className="action-label">Create Challenge</div>
                <p className="action-description">Start a streak competition</p>
              </div>
              
              <div className="quick-action" onClick={() => navigate('/leaderboard')}>
                <div className="action-icon">
                  <Crown size={24} />
                </div>
                <div className="action-label">Find Competitors</div>
                <p className="action-description">Browse top performers</p>
              </div>
              
              <div className="quick-action" onClick={() => navigate('/dashboard')}>
                <div className="action-icon">
                  <Flame size={24} />
                </div>
                <div className="action-label">Share Streak</div>
                <p className="action-description">Broadcast your achievement</p>
              </div>
            </div>
            
            <p style={{ marginTop: '48px', color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>
              💬 Chat features include: Streak sharing • Challenge creation • Group discussions • Real-time notifications
            </p>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      <Modal
        isOpen={showNewChat}
        onClose={() => setShowNewChat(false)}
        title="Start New Conversation"
        size="medium"
        animationType="scale"
      >
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '32px' }}>
            <input
              type="text"
              placeholder="Search users by name or username..."
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'white'
              }}
            />
          </div>
          
          <h4 style={{ marginBottom: '16px', fontSize: '16px' }}>Suggested Friends</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {suggestedUsers.map(user => (
              <div
                key={user.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleStartChat(user)}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.2))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  marginRight: '16px',
                  flexShrink: 0
                }}>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{user.name}</div>
                  <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                    {user.streak}-day streak • {user.city} • {user.consistency} consistency
                  </div>
                </div>
                <Button variant="ghost" size="small">
                  <Plus size={16} />
                </Button>
              </div>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowNewChat(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleCreateGroup}
            >
              Create Group
            </Button>
          </div>
        </div>
      </Modal>

      {/* Chat Settings Modal */}
      <Modal
        isOpen={showChatSettings}
        onClose={() => setShowChatSettings(false)}
        title="Chat Settings"
        size="small"
        animationType="scale"
      >
        <div style={{ padding: '24px' }}>
          {activeChat && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: activeChat.type === 'group' 
                    ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2))'
                    : 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.2))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  margin: '0 auto 16px'
                }}>
                  {activeChat.avatar}
                </div>
                <h3 style={{ margin: '0 0 8px' }}>{activeChat.name}</h3>
                <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.6)' }}>
                  {activeChat.type === 'group' ? 'Group Chat' : 'Direct Message'}
                </p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Button variant="ghost" leftIcon={<UserPlus />} fullWidth>
                  Add Participants
                </Button>
                <Button variant="ghost" leftIcon={<Bell />} fullWidth>
                  Notifications: On
                </Button>
                <Button variant="ghost" leftIcon={<Volume2 />} fullWidth>
                  Sound: On
                </Button>
                <Button variant="ghost" leftIcon={<Archive />} fullWidth>
                  Archive Chat
                </Button>
                <Button variant="ghost" leftIcon={<Trash2 />} fullWidth style={{ color: '#ef4444' }}>
                  Delete Chat
                </Button>
              </div>
              
              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowChatSettings(false)}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ChatPage;