import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Map as MapIcon, 
  MessageSquare, 
  Users, 
  Search, 
  Send, 
  Paperclip, 
  ChevronRight,
  Shield,
  Zap,
  MapPin,
  Plus,
  Trophy,
  Flame,
  Crown,
  Check,
  CheckCheck,
  Image,
  Smile,
  Video,
  Phone,
  Settings,
  Bell,
  UserPlus,
  Archive,
  Trash2,
  X,
  Star,
  Lock,
  Unlock,
  Compass,
  Target,
  Navigation,
  Globe,
  Share,
  Heart,
  Award,
  TrendingUp,
  Eye,
  EyeOff,
  Sparkles,
  Filter,
  Users as UsersIcon,
  MessageCircle,
  Zap as ZapIcon,
  Diamond,
  Navigation2,
  Locate,
  Target as TargetIcon,
  Building,
  Briefcase,
  Award as AwardIcon,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';

const ChatPage = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('CHAT');
  const [activeChat, setActiveChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [showChatSettings, setShowChatSettings] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isElite, setIsElite] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState('');
  const [mapZoom, setMapZoom] = useState(100);
  const [showLocation, setShowLocation] = useState(false);
  const [showFriendsOnMap, setShowFriendsOnMap] = useState(false);
  const [selectedTier, setSelectedTier] = useState('premium');
  const messagesEndRef = useRef(null);

  // Dodo Payment URLs
  const PREMIUM_PAYMENT_URL = 'https://checkout.dodopayments.com/buy/pdt_0NWPkwJJcZChm84jRPqIt?session=sess_5ytsvj3uYz';
  const ELITE_PAYMENT_URL = 'https://checkout.dodopayments.com/buy/pdt_0NWPl4fuR5huBMtu7YAKT';

  // Mock data
  const [chats, setChats] = useState([
    {
      id: 1, name: 'Alex Johnson', username: '@alexj', avatar: 'AJ',
      lastMessage: 'Just hit day 200! 🎉', time: '2 min ago',
      unread: 3, online: true, streak: 200, type: 'direct', tier: 'basic'
    },
    {
      id: 2, name: '7-Day Sprint Challenge', username: 'Challenge Group', avatar: '🏆',
      lastMessage: 'Morgan: Only 2 days left!', time: '1 hour ago',
      unread: 12, online: true, participants: 8, type: 'group', tier: 'premium'
    },
    {
      id: 3, name: 'Sarah Chen', username: '@sarahc', avatar: 'SC',
      lastMessage: 'Thanks for the motivation!', time: '3 hours ago',
      unread: 0, online: false, streak: 156, type: 'direct', tier: 'elite'
    },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'them', text: 'Hey! Just hit day 200 on my streak! 🎉', time: '10:30 AM', read: true },
    { id: 2, sender: 'me', text: 'That\'s amazing! Keep up the great work! 💪', time: '10:32 AM', read: true },
    { id: 3, sender: 'them', text: 'Thanks! How\'s your streak going?', time: '10:33 AM', read: true },
    { id: 4, sender: 'me', text: 'Day 42 and going strong! 💯', time: '10:35 AM', read: true },
    { id: 5, sender: 'them', text: 'Want to start a challenge together?', time: '10:36 AM', read: false },
  ]);

  const [suggestedUsers, setSuggestedUsers] = useState([
    { id: 1, name: 'Taylor Smith', streak: 312, city: 'NYC', consistency: '98%', tier: 'elite', distance: '2.3km' },
    { id: 2, name: 'Jordan Lee', streak: 189, city: 'London', consistency: '92%', tier: 'premium', distance: '5.7km' },
    { id: 3, name: 'Casey Brown', streak: 256, city: 'Tokyo', consistency: '95%', tier: 'elite', distance: '8.1km' },
  ]);

  const [mapMarkers, setMapMarkers] = useState([
    { id: 1, name: 'Alex', top: '35%', left: '42%', color: '#00E5FF', streak: 200, online: true, tier: 'basic', x: 42, y: 35 },
    { id: 2, name: 'Sarah', top: '65%', left: '68%', color: '#7F00FF', streak: 156, online: false, tier: 'elite', x: 68, y: 65 },
    { id: 3, name: 'Marcus', top: '48%', left: '25%', color: '#FF8C00', streak: 89, online: true, tier: 'basic', x: 25, y: 48, premiumOnly: true },
    { id: 4, name: 'Taylor', top: '22%', left: '78%', color: '#00E5FF', streak: 312, online: true, tier: 'elite', x: 78, y: 22, premiumOnly: true },
  ]);

  const [verifiedCircle, setVerifiedCircle] = useState([
    { id: 1, name: 'Addie McCracken  #1', streak: 124, avatar: 'U1', online: true, rank: 1, tier: 'elite' },
    { id: 2, name: 'Celine Klarer #2', streak: 112, avatar: 'U2', online: true, rank: 2, tier: 'premium' },
    { id: 3, name: 'Alexa Kora #3', streak: 108, avatar: 'U3', online: true, rank: 3, tier: 'elite' },
  ]);

  const [premiumFeatures, setPremiumFeatures] = useState([
    { id: 1, icon: <Compass size={20} />, title: 'See Friends Location', description: 'View real-time locations on interactive map' },
    { id: 2, icon: <UsersIcon size={20} />, title: 'Find Nearby Friends', description: 'Discover grass-touchers in your area' },
    { id: 3, icon: <TargetIcon size={20} />, title: 'Advanced Matching', description: 'AI-powered connection suggestions' },
    { id: 4, icon: <Video size={20} />, title: 'Video Calls', description: 'Premium video chat with friends' },
    { id: 5, icon: <TrendingUpIcon size={20} />, title: 'Advanced Analytics', description: 'Detailed insights and progress tracking' },
    { id: 6, icon: <AwardIcon size={20} />, title: 'Elite Challenges', description: 'Access exclusive competitions' },
  ]);

  useEffect(() => {
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
    
    setTimeout(() => {
      const replies = ['Great!', 'I agree!', 'Let me check...', 'Awesome!', 'Share with group?'];
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
    if ((user.tier === 'elite' || user.tier === 'premium') && !isPremium) {
      setUpgradeFeature('connect_elite');
      setShowPremiumModal(true);
      return;
    }
    
    setActiveChat({
      id: chats.length + 1,
      name: user.name,
      username: `@${user.name.toLowerCase().replace(' ', '')}`,
      avatar: user.name.split(' ').map(n => n[0]).join(''),
      streak: user.streak,
      type: 'direct',
      tier: user.tier,
      online: true
    });
    
    setMessages([
      { id: 1, sender: 'me', text: `Hey ${user.name}! Saw your ${user.streak}-day streak. Impressive! 👏`, time: 'Just now', read: false }
    ]);
    setShowNewChat(false);
  };

  const handleCreateGroup = () => {
    if (!isPremium) {
      setUpgradeFeature('create_group');
      setShowPremiumModal(true);
      return;
    }
    
    setActiveChat({
      id: chats.length + 1,
      name: 'New Challenge Group',
      username: 'Group Chat',
      avatar: '👥',
      participants: 1,
      type: 'group',
      tier: 'premium',
      online: true
    });
    setShowNewChat(false);
    toast.success('Premium group created! 🎉');
  };

  const handlePremiumPayment = (e) => {
    if (e) e.stopPropagation();
    
    const paymentUrl = selectedTier === 'elite' ? ELITE_PAYMENT_URL : PREMIUM_PAYMENT_URL;
    const paymentWindow = window.open(paymentUrl, '_blank', 'width=600,height=700');
    
    if (!paymentWindow) {
      toast.error('Popup blocked! Please allow popups.');
      window.location.href = paymentUrl;
    } else {
      toast.success(`Opening ${selectedTier} payment...`);
      const checkInterval = setInterval(() => {
        if (paymentWindow.closed) {
          clearInterval(checkInterval);
          setIsPremium(true);
          if (selectedTier === 'elite') setIsElite(true);
          setShowPremiumModal(false);
          toast.success(`🎉 Welcome to ${selectedTier === 'elite' ? 'Elite' : 'Premium'}!`);
        }
      }, 1000);
    }
  };

  const handleMapMarkerClick = (marker) => {
    if (marker.premiumOnly && !isPremium) {
      setUpgradeFeature('map_locations');
      setShowPremiumModal(true);
      return;
    }

    if (marker.tier === 'elite' && !isElite) {
      setUpgradeFeature('connect_elite');
      setShowPremiumModal(true);
      return;
    }
    
    setActiveChat({
      id: chats.length + 1,
      name: marker.name,
      username: `@${marker.name.toLowerCase()}`,
      avatar: marker.name.charAt(0),
      streak: marker.streak,
      type: 'direct',
      tier: marker.tier,
      online: marker.online
    });
    
    setMessages([
      { id: 1, sender: 'me', text: `Hey ${marker.name}! Saw you nearby with ${marker.streak} days! 🌟`, time: 'Just now', read: false }
    ]);
  };

  const handleFindMoreFriends = () => {
    if (!isPremium) {
      setUpgradeFeature('find_friends');
      setShowPremiumModal(true);
    } else {
      setShowFriendsOnMap(true);
      toast.success('Searching for nearby friends... 🔍');
    }
  };

  const handleTrackLocation = () => {
    if (!isPremium) {
      setUpgradeFeature('location_tracking');
      setShowPremiumModal(true);
    } else {
      setShowLocation(!showLocation);
      toast.success(showLocation ? 'Location hidden 👁️' : 'Location visible 👁️‍🗨️');
    }
  };

  const getTierColor = (tier) => {
    switch(tier) {
      case 'elite': return '#FFD700';
      case 'premium': return '#00E5FF';
      default: return '#94a3b8';
    }
  };

  const getTierLabel = (tier) => {
    switch(tier) {
      case 'elite': return 'ELITE';
      case 'premium': return 'PRO';
      default: return 'FREE';
    }
  };

  // Interactive map line drawing
  const [hoveredMarker, setHoveredMarker] = useState(null);

  const styles = `
    .chat-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #050505 0%, #0a0a0a 100%);
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      overflow-x: hidden;
      position: relative;
    }

    .chat-bg-grid {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      pointer-events: none;
      z-index: 1;
    }

    .chat-container {
      position: relative;
      z-index: 2;
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      height: 100vh;
      overflow: hidden;
    }

    /* Header */
    .chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .tab-switcher {
      display: flex;
      gap: 0.5rem;
      padding: 0.5rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .tab-button {
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: transparent;
      color: #94a3b8;
      border: none;
      cursor: pointer;
    }

    .tab-button:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .tab-button.active {
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
      color: white;
      box-shadow: 0 4px 20px rgba(0, 229, 255, 0.3);
    }

    .online-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      background: rgba(0, 229, 255, 0.1);
      border: 1px solid rgba(0, 229, 255, 0.2);
      font-size: 0.75rem;
      font-weight: 600;
    }

    /* Main Grid */
    .chat-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      flex: 1;
      overflow: hidden;
      height: calc(100vh - 120px);
    }

    @media (min-width: 1024px) {
      .chat-grid {
        grid-template-columns: 1fr 2fr 1fr;
      }
    }

    /* Sidebars */
    .chat-sidebar, .premium-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      overflow: hidden;
    }

    .search-box {
      position: relative;
    }

    .search-input {
      width: 100%;
      padding: 0.875rem 1rem 0.875rem 3rem;
      border-radius: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 0.875rem;
      transition: all 0.3s;
    }

    .search-input:focus {
      outline: none;
      border-color: #00E5FF;
      background: rgba(0, 229, 255, 0.05);
      box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.1);
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
    }

    .new-chat-btn {
      width: 100%;
      padding: 0.875rem;
      border-radius: 0.75rem;
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
      color: white;
      border: none;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .new-chat-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 229, 255, 0.3);
    }

    .chat-list {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding-right: 0.5rem;
    }

    .chat-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem;
      border-radius: 0.75rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      cursor: pointer;
      transition: all 0.3s;
    }

    .chat-item:hover {
      background: rgba(255, 255, 255, 0.05);
      transform: translateX(4px);
    }

    .chat-item.active {
      background: rgba(0, 229, 255, 0.1);
      border-color: rgba(0, 229, 255, 0.2);
    }

    .chat-avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
      flex-shrink: 0;
    }

    .direct-avatar {
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(127, 0, 255, 0.2));
      color: #00E5FF;
    }

    .group-avatar {
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2));
      color: #fbbf24;
    }

    .chat-info {
      flex: 1;
      min-width: 0;
    }

    .chat-name {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-weight: 600;
      font-size: 0.875rem;
      margin-bottom: 0.125rem;
    }

    .online-dot {
      width: 0.375rem;
      height: 0.375rem;
      border-radius: 50%;
      background: #22c55e;
    }

    .last-message {
      font-size: 0.75rem;
      color: #94a3b8;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .chat-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }

    .chat-time {
      font-size: 0.625rem;
      color: #64748b;
      font-weight: 500;
    }

    .unread-badge {
      padding: 0.125rem 0.5rem;
      border-radius: 1rem;
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
      color: white;
      font-size: 0.625rem;
      font-weight: 600;
      min-width: 1.25rem;
      text-align: center;
    }

    /* Main Content */
    .main-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      overflow: hidden;
    }

    /* Map Container */
    .map-container {
      flex: 1;
      position: relative;
      border-radius: 1rem;
      overflow: hidden;
      background: linear-gradient(135deg, #08081a 0%, #0f172a 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .map-background {
      position: absolute;
      inset: 0;
      background-image: 
        radial-gradient(circle at 1px 1px, rgba(0, 229, 255, 0.15) 1px, transparent 0),
        radial-gradient(circle at 59px 59px, rgba(127, 0, 255, 0.1) 1px, transparent 0);
      background-size: 60px 60px;
      opacity: 0.3;
      pointer-events: none;
    }

    .map-marker {
      position: absolute;
      cursor: pointer;
      z-index: 10;
      transition: all 0.3s;
    }

    .marker-dot {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 20px currentColor;
      position: relative;
      transition: all 0.3s;
    }

    .map-marker:hover .marker-dot {
      transform: scale(1.3);
    }

    .marker-pulse {
      position: absolute;
      inset: -0.5rem;
      border-radius: 50%;
      opacity: 0.3;
      animation: pulse 2s infinite;
      border: 1px solid currentColor;
    }

    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.3; }
      100% { transform: scale(2); opacity: 0; }
    }

    .marker-info {
      position: absolute;
      bottom: calc(100% + 0.5rem);
      left: 50%;
      transform: translateX(-50%) translateY(10px);
      padding: 0.5rem 0.75rem;
      background: rgba(0, 0, 0, 0.9);
      border-radius: 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
      opacity: 0;
      transition: all 0.3s;
      pointer-events: none;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }

    .map-marker:hover .marker-info {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    .premium-lock {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      padding: 0.25rem 0.5rem;
      border-radius: 0.5rem;
      font-size: 0.625rem;
      color: white;
      pointer-events: none;
    }

    .map-lines {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 5;
    }

    .map-line {
      stroke: rgba(0, 229, 255, 0.3);
      stroke-width: 2;
      stroke-dasharray: 5;
      animation: dash 20s linear infinite;
    }

    @keyframes dash {
      to {
        stroke-dashoffset: -1000;
      }
    }

    .map-controls {
      position: absolute;
      bottom: 1rem;
      left: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .map-control-button {
      padding: 0.5rem 1rem;
      border-radius: 0.75rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      backdrop-filter: blur(10px);
    }

    .map-control-button:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }

    .map-control-button.premium {
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(127, 0, 255, 0.2));
      border-color: rgba(0, 229, 255, 0.3);
    }

    .location-indicator {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
      background: #22c55e;
      border: 2px solid white;
      box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.3);
      z-index: 15;
    }

    /* Chat Area */
    .chat-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      overflow: hidden;
    }

    .chat-header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .chat-user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .chat-user-details h3 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.125rem;
    }

    .chat-user-details p {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .chat-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
    }

    .action-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .action-btn.premium {
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(127, 0, 255, 0.2));
      border-color: rgba(0, 229, 255, 0.3);
    }

    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .message {
      max-width: 75%;
      padding: 0.75rem 1rem;
      border-radius: 1rem;
      animation: messageSlide 0.3s ease-out;
    }

    @keyframes messageSlide {
      from {
        opacity: 0;
        transform: translateY(10px);
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
    }

    .message-me {
      align-self: flex-end;
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(127, 0, 255, 0.2));
      border: 1px solid rgba(0, 229, 255, 0.3);
    }

    .message-text {
      margin: 0 0 0.375rem;
      line-height: 1.4;
      word-wrap: break-word;
    }

    .message-time {
      font-size: 0.625rem;
      color: #64748b;
      text-align: right;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.25rem;
    }

    .message-input-container {
      padding: 1rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .input-actions {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .input-btn {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
    }

    .input-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .input-btn.premium {
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(127, 0, 255, 0.1));
      border-color: rgba(0, 229, 255, 0.2);
    }

    .message-input-wrapper {
      display: flex;
      gap: 0.75rem;
      align-items: flex-end;
    }

    .message-input {
      flex: 1;
      min-height: 2.5rem;
      max-height: 5rem;
      padding: 0.75rem 1rem;
      border-radius: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 0.875rem;
      line-height: 1.4;
      resize: none;
      transition: all 0.3s;
    }

    .message-input:focus {
      outline: none;
      border-color: #00E5FF;
      background: rgba(0, 229, 255, 0.05);
      box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.1);
    }

    .send-btn {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.75rem;
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
      flex-shrink: 0;
    }

    .send-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 229, 255, 0.3);
    }

    .send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    /* Premium Sidebar */
    .premium-feature-card {
      padding: 1rem;
      border-radius: 1rem;
      background: linear-gradient(135deg, rgba(127, 0, 255, 0.1), rgba(0, 229, 255, 0.05));
      border: 1px solid rgba(127, 0, 255, 0.2);
      margin-bottom: 1rem;
    }

    .premium-feature-card h3 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }

    .feature-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      border-radius: 0.5rem;
      background: rgba(255, 255, 255, 0.03);
    }

    .feature-icon {
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(127, 0, 255, 0.1));
      display: flex;
      align-items: center;
      justify-content: center;
      color: #00E5FF;
      flex-shrink: 0;
    }

    .feature-info h4 {
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 0.125rem;
    }

    .feature-info p {
      font-size: 0.625rem;
      color: #94a3b8;
    }

    .upgrade-btn {
      width: 100%;
      padding: 0.75rem;
      border-radius: 0.75rem;
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
      color: white;
      border: none;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .upgrade-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 229, 255, 0.3);
    }

    .upgrade-btn.elite {
      background: linear-gradient(135deg, #FFD700, #FFA500);
      color: black;
    }

    .network-section {
      padding: 1rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .network-section h3 {
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
      color: #94a3b8;
    }

    .network-user {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .network-user:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .user-rank {
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 0.5rem;
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(127, 0, 255, 0.1));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
      color: #00E5FF;
    }

    .user-details h4 {
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 0.125rem;
    }

    .user-details p {
      font-size: 0.625rem;
      color: #94a3b8;
    }

    /* Empty State */
    .empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .empty-icon {
      width: 4rem;
      height: 4rem;
      border-radius: 1rem;
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(127, 0, 255, 0.1));
      display: flex;
      align-items: center;
      justify-content: center;
      color: #00E5FF;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .empty-state p {
      color: #94a3b8;
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
      max-width: 300px;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.75rem;
      width: 100%;
      max-width: 300px;
    }

    .quick-action {
      padding: 1rem;
      border-radius: 0.75rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
    }

    .quick-action:hover {
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(0, 229, 255, 0.3);
    }

    .action-icon {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.75rem;
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(127, 0, 255, 0.2));
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 0.5rem;
      color: #00E5FF;
    }

    .action-label {
      font-weight: 600;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }

    .action-desc {
      color: #94a3b8;
      font-size: 0.75rem;
    }

    /* Premium Modal */
    .premium-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(10px);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .premium-modal {
      width: 100%;
      max-width: 500px;
      padding: 2rem;
      border-radius: 1.5rem;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(20, 25, 40, 0.95));
      border: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
    }

    .modal-close {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      width: 2rem;
      height: 2rem;
      border-radius: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
    }

    .modal-close:hover {
      background: rgba(239, 68, 68, 0.2);
    }

    .premium-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .premium-icon {
      width: 4rem;
      height: 4rem;
      border-radius: 1rem;
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
    }

    .elite .premium-icon {
      background: linear-gradient(135deg, #FFD700, #FFA500);
    }

    .premium-title {
      font-size: 1.75rem;
      font-weight: 700;
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }

    .elite .premium-title {
      background: linear-gradient(135deg, #FFD700, #FFA500);
    }

    .premium-subtitle {
      color: #94a3b8;
      font-size: 0.875rem;
    }

    .tier-selector {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }

    .tier-option {
      flex: 1;
      padding: 1rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.03);
      border: 2px solid transparent;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
    }

    .tier-option:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .tier-option.selected {
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(127, 0, 255, 0.05));
      border-color: rgba(0, 229, 255, 0.3);
    }

    .tier-option.elite.selected {
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
      border-color: rgba(255, 215, 0, 0.3);
    }

    .tier-name {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .tier-price {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    .tier-period {
      color: #94a3b8;
      font-size: 0.75rem;
    }

    .feature-highlights {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    .highlight-item {
      padding: 0.75rem;
      border-radius: 0.75rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
    }

    .highlight-icon {
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(127, 0, 255, 0.1));
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 0.5rem;
      color: #00E5FF;
    }

    .elite .highlight-icon {
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1));
      color: #FFD700;
    }

    .highlight-title {
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 0.125rem;
    }

    .highlight-desc {
      color: #94a3b8;
      font-size: 0.625rem;
    }

    .premium-unlock-btn {
      width: 100%;
      padding: 1rem;
      border-radius: 1rem;
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
      color: white;
      border: none;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .premium-unlock-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 229, 255, 0.3);
    }

    .elite .premium-unlock-btn {
      background: linear-gradient(135deg, #FFD700, #FFA500);
      color: black;
    }

    /* New Chat Modal */
    .new-chat-modal {
      width: 100%;
      max-width: 500px;
      padding: 2rem;
      border-radius: 1.5rem;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(20, 25, 40, 0.95));
      border: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .chat-grid {
        grid-template-columns: 1fr;
        height: calc(100vh - 100px);
      }
      
      .chat-sidebar, .premium-sidebar {
        display: none;
      }
      
      .chat-header {
        flex-direction: column;
        align-items: stretch;
      }
      
      .tab-switcher {
        width: 100%;
        justify-content: center;
      }
      
      .tab-button {
        flex: 1;
        justify-content: center;
        padding: 0.75rem 0.5rem;
        font-size: 0.7rem;
      }
      
      .feature-highlights {
        grid-template-columns: 1fr;
      }
    }

    @media (min-width: 769px) and (max-width: 1023px) {
      .chat-grid {
        grid-template-columns: 1fr 1fr;
      }
      
      .premium-sidebar {
        display: none;
      }
    }

    /* Typing indicator */
    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-radius: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      align-self: flex-start;
    }

    .typing-dots {
      display: flex;
      gap: 0.25rem;
    }

    .typing-dot {
      width: 0.375rem;
      height: 0.375rem;
      border-radius: 50%;
      background: #94a3b8;
      animation: typing 1.4s infinite;
    }

    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  `;

  return (
    <div className="chat-page">
      <style>{styles}</style>
      
      <div className="chat-bg-grid"></div>

      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <div className="tab-switcher">
            <button 
              className={`tab-button ${activeTab === 'MAP' ? 'active' : ''}`}
              onClick={() => setActiveTab('MAP')}
            >
              <MapIcon size={18} /> Network Map
            </button>
            <button 
              className={`tab-button ${activeTab === 'CHAT' ? 'active' : ''}`}
              onClick={() => setActiveTab('CHAT')}
            >
              <MessageSquare size={18} /> Global Chat
            </button>
          </div>
          
          <div className="online-badge">
            <Sparkles size={14} />
            {isPremium ? (isElite ? 'Elite Network' : 'Pro Network') : 'Join Premium'}
          </div>
        </div>

        {/* Main Grid */}
        <div className="chat-grid">
          {/* Left Sidebar - Chats */}
          <div className="chat-sidebar">
            <div className="search-box">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button 
              className="new-chat-btn"
              onClick={() => !isPremium ? (setUpgradeFeature('new_chat'), setShowPremiumModal(true)) : setShowNewChat(true)}
            >
              <Plus size={18} /> {isPremium ? 'New Chat' : 'Upgrade to Chat'}
            </button>
            
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
                    <div className="chat-name">
                      {chat.name}
                      {chat.online && <span className="online-dot" />}
                    </div>
                    <div className="last-message">{chat.lastMessage}</div>
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

          {/* Main Content */}
          <div className="main-content">
            {activeTab === 'MAP' ? (
              <div className="map-container">
                <div className="map-background" />
                
                {/* Interactive Map Lines */}
                <svg className="map-lines" width="100%" height="100%">
                  {mapMarkers.map((marker, index) => {
                    if (index === mapMarkers.length - 1) return null;
                    const nextMarker = mapMarkers[index + 1];
                    return (
                      <line
                        key={`line-${index}`}
                        className="map-line"
                        x1={`${marker.x}%`}
                        y1={`${marker.y}%`}
                        x2={`${nextMarker.x}%`}
                        y2={`${nextMarker.y}%`}
                      />
                    );
                  })}
                </svg>

                {/* Map Markers */}
                {mapMarkers.map(marker => (
                  <motion.div
                    key={marker.id}
                    className="map-marker"
                    style={{ top: marker.top, left: marker.left }}
                    onClick={() => handleMapMarkerClick(marker)}
                    onMouseEnter={() => setHoveredMarker(marker)}
                    onMouseLeave={() => setHoveredMarker(null)}
                    whileHover={{ scale: 1.1 }}
                  >
                    <div 
                      className="marker-dot" 
                      style={{ 
                        backgroundColor: marker.premiumOnly && !isPremium ? '#666' : marker.color,
                        cursor: marker.premiumOnly && !isPremium ? 'not-allowed' : 'pointer'
                      }}
                    />
                    <div 
                      className="marker-pulse" 
                      style={{ 
                        backgroundColor: marker.premiumOnly && !isPremium ? '#666' : marker.color 
                      }}
                    />
                    <div className="marker-info">
                      {marker.premiumOnly && !isPremium ? (
                        <>
                          <Lock size={10} /> Upgrade to see
                        </>
                      ) : (
                        <>
                          {marker.name} • {marker.streak} days
                          {marker.tier !== 'basic' && (
                            <div style={{ fontSize: '0.625rem', color: getTierColor(marker.tier), marginTop: '0.125rem' }}>
                              {getTierLabel(marker.tier)}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* User Location Indicator */}
                {showLocation && isPremium && (
                  <div className="location-indicator" />
                )}

                {/* Map Controls */}
                <div className="map-controls">
                  <button 
                    className={`map-control-button ${!isPremium ? 'premium' : ''}`}
                    onClick={handleTrackLocation}
                  >
                    {showLocation ? <EyeOff size={14} /> : <Eye size={14} />}
                    {isPremium ? (showLocation ? 'Hide Location' : 'Show Location') : 'Unlock Location'}
                  </button>
                  <button 
                    className={`map-control-button ${!isPremium ? 'premium' : ''}`}
                    onClick={handleFindMoreFriends}
                  >
                    <Users size={14} />
                    {isPremium ? 'Find Friends' : 'Unlock Friends'}
                  </button>
                  <button className="map-control-button" onClick={() => setMapZoom(prev => Math.min(200, prev + 20))}>
                    <Navigation size={14} /> Zoom In
                  </button>
                </div>

                {/* Premium Prompt Overlay */}
                {!isPremium && (
                  <motion.div 
                    className="premium-feature-card"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '80%',
                      maxWidth: '300px',
                      textAlign: 'center',
                      zIndex: 20
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3>
                      <Lock size={20} />
                      Unlock Interactive Map
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
                      Upgrade to see friends locations, find nearby users, and access advanced networking features
                    </p>
                    <button 
                      className="upgrade-btn"
                      onClick={() => {
                        setUpgradeFeature('interactive_map');
                        setShowPremiumModal(true);
                      }}
                    >
                      <Zap size={16} style={{ marginRight: '0.5rem' }} />
                      Upgrade Now
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="chat-area">
                {activeChat ? (
                  <>
                    {/* Chat Header */}
                    <div className="chat-header-bar">
                      <div className="chat-user-info">
                        <div className={`chat-avatar ${activeChat.type === 'group' ? 'group-avatar' : 'direct-avatar'}`}>
                          {activeChat.avatar}
                        </div>
                        <div className="chat-user-details">
                          <h3>{activeChat.name}</h3>
                          <p>
                            {activeChat.type === 'direct' 
                              ? `${activeChat.streak}-day streak • ${activeChat.username}`
                              : `${activeChat.participants} participants • Group`
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="chat-actions">
                        <button 
                          className={`action-btn ${!isPremium ? 'premium' : ''}`}
                          onClick={() => !isPremium ? (setUpgradeFeature('video_call'), setShowPremiumModal(true)) : toast.success('Video call started!')}
                        >
                          <Video size={18} />
                        </button>
                        <button 
                          className={`action-btn ${!isPremium ? 'premium' : ''}`}
                          onClick={() => !isPremium ? (setUpgradeFeature('voice_call'), setShowPremiumModal(true)) : toast.success('Voice call started!')}
                        >
                          <Phone size={18} />
                        </button>
                        <button className="action-btn" onClick={() => setShowChatSettings(true)}>
                          <Settings size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="messages-container">
                      {messages.map(message => (
                        <div
                          key={message.id}
                          className={`message ${message.sender === 'me' ? 'message-me' : 'message-them'}`}
                        >
                          <div className="message-text">{message.text}</div>
                          <div className="message-time">
                            {message.time}
                            {message.sender === 'me' && (
                              <span style={{ marginLeft: '0.25rem', color: message.read ? '#22c55e' : '#94a3b8' }}>
                                {message.read ? <CheckCheck size={10} /> : <Check size={10} />}
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
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>typing...</span>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="message-input-container">
                      <div className="input-actions">
                        <button 
                          className={`input-btn ${!isPremium ? 'premium' : ''}`}
                          onClick={() => !isPremium ? (setUpgradeFeature('image_share'), setShowPremiumModal(true)) : toast.success('Image upload coming soon!')}
                        >
                          <Image size={18} />
                        </button>
                        <button 
                          className={`input-btn ${!isPremium ? 'premium' : ''}`}
                          onClick={() => !isPremium ? (setUpgradeFeature('file_share'), setShowPremiumModal(true)) : toast.success('File upload coming soon!')}
                        >
                          <Paperclip size={18} />
                        </button>
                        <button className="input-btn">
                          <Smile size={18} />
                        </button>
                        <button 
                          className={`input-btn ${!isPremium ? 'premium' : ''}`}
                          onClick={() => !isPremium ? (setUpgradeFeature('streak_share'), setShowPremiumModal(true)) : toast.success('Streak shared!')}
                        >
                          <Trophy size={18} />
                        </button>
                      </div>
                      
                      <div className="message-input-wrapper">
                        <textarea
                          className="message-input"
                          placeholder={isPremium ? "Type your message..." : "Upgrade to send messages..."}
                          value={newMessage}
                          onChange={(e) => {
                            setNewMessage(e.target.value);
                            setIsTyping(true);
                            setTimeout(() => setIsTyping(false), 2000);
                          }}
                          onKeyPress={handleKeyPress}
                          rows={1}
                          disabled={!isPremium}
                        />
                        <button
                          className="send-btn"
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || !isPremium}
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Empty State */
                  <div className="empty-state">
                    <div className="empty-icon">
                      <MessageSquare size={32} />
                    </div>
                    <h3>Start Connecting</h3>
                    <p>Chat with friends, join challenges, and build your streak network</p>
                    
                    <div className="quick-actions">
                      <div 
                        className="quick-action"
                        onClick={() => !isPremium ? (setUpgradeFeature('connect_friends'), setShowPremiumModal(true)) : setShowNewChat(true)}
                      >
                        <div className="action-icon">
                          <Users size={20} />
                        </div>
                        <div className="action-label">
                          {isPremium ? 'New Chat' : 'Upgrade to Chat'}
                        </div>
                        <div className="action-desc">
                          {isPremium ? 'Connect with users' : 'Unlock messaging'}
                        </div>
                      </div>
                      
                      <div className="quick-action" onClick={handleCreateGroup}>
                        <div className="action-icon">
                          <Trophy size={20} />
                        </div>
                        <div className="action-label">Create Challenge</div>
                        <div className="action-desc">Start a group streak</div>
                      </div>
                      
                      <div className="quick-action" onClick={() => onNavigate?.('leaderboard')}>
                        <div className="action-icon">
                          <Crown size={20} />
                        </div>
                        <div className="action-label">View Leaderboard</div>
                        <div className="action-desc">See top performers</div>
                      </div>
                    </div>
                    
                    {!isPremium && (
                      <p style={{ marginTop: '1.5rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                        ⭐ Upgrade for: Unlimited chats • Video calls • Location sharing • Elite network
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar - Premium Features */}
          <div className="premium-sidebar">
            <div className="premium-feature-card">
              <h3>
                {isElite ? <Crown size={20} /> : isPremium ? <Unlock size={20} /> : <Lock size={20} />}
                {isElite ? 'Elite Status' : isPremium ? 'Pro Features' : 'Go Pro'}
              </h3>
              
              <div className="feature-list">
                {premiumFeatures.slice(0, isElite ? 6 : 3).map(feature => (
                  <div key={feature.id} className="feature-item">
                    <div className="feature-icon">
                      {feature.icon}
                    </div>
                    <div className="feature-info">
                      <h4>{feature.title}</h4>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                className={`upgrade-btn ${isElite ? 'elite' : ''}`}
                onClick={() => setShowPremiumModal(true)}
              >
                {isElite ? (
                  <>
                    <Crown size={16} style={{ marginRight: '0.5rem' }} />
                    Elite Member
                  </>
                ) : isPremium ? (
                  <>
                    <Zap size={16} style={{ marginRight: '0.5rem' }} />
                    Upgrade to Elite
                  </>
                ) : (
                  <>
                    <TrendingUp size={16} style={{ marginRight: '0.5rem' }} />
                    Upgrade Now
                  </>
                )}
              </button>
            </div>

            <div className="network-section">
              <h3>Top Network</h3>
              <div>
                {verifiedCircle.map(user => (
                  <div
                    key={user.id}
                    className="network-user"
                    onClick={() => handleStartChat(user)}
                  >
                    <div className="user-info">
                      <div className="user-rank" style={{ 
                        background: `linear-gradient(135deg, ${getTierColor(user.tier)}20, ${getTierColor(user.tier)}10)`, 
                        color: getTierColor(user.tier) 
                      }}>
                        #{user.rank}
                      </div>
                      <div className="user-details">
                        <h4 style={{ color: getTierColor(user.tier) }}>
                          {user.name}
                        </h4>
                        <p>{user.streak} day streak • {getTierLabel(user.tier)}</p>
                      </div>
                    </div>
                    <button className="action-btn" style={{ width: '1.75rem', height: '1.75rem' }}>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Find More Friends Card */}
            <div className="premium-feature-card" style={{ background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(127, 0, 255, 0.05))' }}>
              <h3>
                <Compass size={20} />
                Find More Friends
              </h3>
              
              <div className="feature-list">
                <div className="feature-item" onClick={handleFindMoreFriends}>
                  <div className="feature-icon">
                    <TargetIcon size={16} />
                  </div>
                  <div className="feature-info">
                    <h4>Nearby Friends</h4>
                    <p>
                      {isPremium 
                        ? 'Find users in your area'
                        : 'Upgrade to discover friends nearby'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="feature-item" onClick={() => !isPremium ? (setUpgradeFeature('similar_streaks'), setShowPremiumModal(true)) : null}>
                  <div className="feature-icon">
                    <UsersIcon size={16} />
                  </div>
                  <div className="feature-info">
                    <h4>Similar Streaks</h4>
                    <p>
                      {isPremium 
                        ? 'Match with similar users'
                        : 'Elite feature - Upgrade now'
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              {!isPremium && (
                <button 
                  className="upgrade-btn"
                  onClick={() => {
                    setUpgradeFeature('social_features');
                    setShowPremiumModal(true);
                  }}
                >
                  <UsersIcon size={16} style={{ marginRight: '0.5rem' }} />
                  Unlock Social Features
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Premium Upgrade Modal */}
      <AnimatePresence>
        {showPremiumModal && (
          <div className="premium-modal-overlay">
            <motion.div 
              className={`premium-modal ${selectedTier === 'elite' ? 'elite' : ''}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <button 
                className="modal-close"
                onClick={() => setShowPremiumModal(false)}
              >
                <X size={18} />
              </button>
              
              <div className="premium-header">
                <div className="premium-icon">
                  {selectedTier === 'elite' ? <Crown size={24} /> : <Shield size={24} />}
                </div>
                <h2 className="premium-title">
                  {selectedTier === 'elite' ? 'Join Elite Network' : 'Upgrade to Pro'}
                </h2>
                <p className="premium-subtitle">
                  {upgradeFeature === 'interactive_map' && 'Unlock interactive map features and location sharing'}
                  {upgradeFeature === 'find_friends' && 'Discover and connect with nearby friends'}
                  {upgradeFeature === 'social_features' && 'Access advanced social networking features'}
                  {!upgradeFeature && 'Unlock premium features for better networking'}
                </p>
              </div>
              
              {/* Tier Selection */}
              <div className="tier-selector">
                <div 
                  className={`tier-option ${selectedTier === 'premium' ? 'selected' : ''}`}
                  onClick={() => setSelectedTier('premium')}
                >
                  <div className="tier-name">Pro</div>
                  <div className="tier-price">$9.99</div>
                  <div className="tier-period">per month</div>
                </div>
                <div 
                  className={`tier-option elite ${selectedTier === 'elite' ? 'selected' : ''}`}
                  onClick={() => setSelectedTier('elite')}
                >
                  <div className="tier-name">Elite</div>
                  <div className="tier-price">$19.99</div>
                  <div className="tier-period">per month</div>
                </div>
              </div>
              
              {/* Feature Highlights */}
              <div className="feature-highlights">
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <Compass size={16} />
                  </div>
                  <div className="highlight-title">Interactive Map</div>
                  <div className="highlight-desc">See friends locations</div>
                </div>
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <UsersIcon size={16} />
                  </div>
                  <div className="highlight-title">Find Friends</div>
                  <div className="highlight-desc">Discover nearby users</div>
                </div>
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <Video size={16} />
                  </div>
                  <div className="highlight-title">Video Calls</div>
                  <div className="highlight-desc">Premium video chat</div>
                </div>
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <TrendingUpIcon size={16} />
                  </div>
                  <div className="highlight-title">Analytics</div>
                  <div className="highlight-desc">Advanced insights</div>
                </div>
                {selectedTier === 'elite' && (
                  <>
                    <div className="highlight-item">
                      <div className="highlight-icon">
                        <Crown size={16} />
                      </div>
                      <div className="highlight-title">Elite Badge</div>
                      <div className="highlight-desc">Priority access</div>
                    </div>
                    <div className="highlight-item">
                      <div className="highlight-icon">
                        <AwardIcon size={16} />
                      </div>
                      <div className="highlight-title">Exclusive</div>
                      <div className="highlight-desc">Elite challenges</div>
                    </div>
                  </>
                )}
              </div>
              
              <button 
                className="premium-unlock-btn"
                onClick={handlePremiumPayment}
              >
                {selectedTier === 'elite' ? 'Join Elite Network' : 'Upgrade to Pro'} • ${selectedTier === 'elite' ? '19.99' : '9.99'}/mo
              </button>
              
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem', marginTop: '1rem' }}>
                Cancel anytime • 7-day free trial
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Chat Modal */}
      <AnimatePresence>
        {showNewChat && (
          <div className="premium-modal-overlay">
            <motion.div 
              className="new-chat-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <button 
                className="modal-close"
                onClick={() => setShowNewChat(false)}
              >
                <X size={18} />
              </button>
              
              <div className="premium-header">
                <div className="premium-icon">
                  <Users size={24} />
                </div>
                <h2 className="premium-title">Start New Chat</h2>
                <p className="premium-subtitle">Connect with friends or create a group</p>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div className="search-box">
                  <Search className="search-icon" size={18} />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search users..."
                  />
                </div>
              </div>
              
              <h4 style={{ marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>Suggested Friends</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {suggestedUsers.map(user => (
                  <div
                    key={user.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onClick={() => handleStartChat(user)}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                  >
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '0.75rem',
                      background: `linear-gradient(135deg, ${getTierColor(user.tier)}20, ${getTierColor(user.tier)}10)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      marginRight: '0.75rem',
                      flexShrink: 0,
                      color: getTierColor(user.tier),
                      fontSize: '0.875rem'
                    }}>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.125rem', color: getTierColor(user.tier) }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                        {user.streak} days • {user.city} • {user.distance} away
                      </div>
                    </div>
                    <button className="action-btn" style={{ width: '2rem', height: '2rem' }}>
                      <Plus size={14} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  className="map-control-button"
                  style={{ flex: 1 }}
                  onClick={() => setShowNewChat(false)}
                >
                  Cancel
                </button>
                <button 
                  className="new-chat-btn"
                  style={{ flex: 1 }}
                  onClick={handleCreateGroup}
                >
                  Create Group
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatPage;