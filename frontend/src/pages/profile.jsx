

// // Profile.jsx - Uses SAME localStorage data as Dashboard with matching UI
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import SEO from '../components/seo/SEO';
// import { SEO_CONFIG } from '../config/seo';
// import { 
//   User, Camera, CheckCircle, XCircle, Flame, Trophy, 
//   Calendar, TrendingUp, Clock, Target, Award, Crown,
//   Users, BarChart, Activity, Share2, MapPin,
//   Edit, Check, X, ChevronRight, ArrowLeft, Settings,
//   Copy, Twitter, Linkedin, Facebook, MessageSquare, Instagram,
//   LogOut, Loader, UserPlus, CalendarDays, BarChart3,
//   Sparkles, Verified, Bell, ArrowUpRight, ChevronLeft,
//   Home, FileText, PieChart, Target as TargetIcon, Heart,
//   MessageCircle, Download, Zap, TrendingDown, Globe,
//   Lock, Eye, EyeOff, Smartphone, Watch, Gift, Star,
//   Moon, Sun, UploadCloud, Shield, HelpCircle, Info
// } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import Confetti from 'react-confetti';

// const Profile = () => {
//   const { username } = useParams();
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState(null);
//   const [streakData, setStreakData] = useState(null);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [isLoading, setIsLoading] = useState(true);
//   const [isEditingBio, setIsEditingBio] = useState(false);
//   const [bio, setBio] = useState('');
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [isOwnProfile, setIsOwnProfile] = useState(false);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [showShareOptions, setShowShareOptions] = useState(false);
//   const [showSettingsModal, setShowSettingsModal] = useState(false);
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [followersCount, setFollowersCount] = useState(0);
//   const [followingCount, setFollowingCount] = useState(0);
//   const [achievements, setAchievements] = useState([]);
//   const [weeklyData, setWeeklyData] = useState([]);
//   const [recentActivity, setRecentActivity] = useState([]);
//   const [timeLeft, setTimeLeft] = useState('');
//   const [isDarkMode, setIsDarkMode] = useState(true);

//   // Dashboard-style CSS
//   const dashboardStyles = `
//     .dashboard-container {
//       min-height: 100vh;
//       background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
//       color: white;
//       padding: 20px;
//       position: relative;
//       overflow-x: hidden;
//     }
    
//     .dashboard-background {
//       position: absolute;
//       inset: 0;
//       background: 
//         radial-gradient(circle at 10% 20%, rgba(34, 197, 94, 0.15) 0%, transparent 40%),
//         radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
//         radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 60%);
//       animation: backgroundPulse 20s ease-in-out infinite;
//     }
    
//     @keyframes backgroundPulse {
//       0%, 100% { 
//         transform: scale(1);
//         opacity: 0.3;
//       }
//       50% { 
//         transform: scale(1.05);
//         opacity: 0.4;
//       }
//     }
    
//     .dashboard-header {
//       max-width: 1400px;
//       margin: 0 auto 40px;
//       position: relative;
//       z-index: 2;
//     }
    
//     .header-top {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       margin-bottom: 32px;
//       flex-wrap: wrap;
//       gap: 1rem;
//     }
    
//     .welcome-section h1 {
//       font-size: 36px;
//       font-weight: 700;
//       margin: 0 0 8px;
//       background: linear-gradient(135deg, #22c55e, #3b82f6);
//       -webkit-background-clip: text;
//       -webkit-text-fill-color: transparent;
//       background-clip: text;
//       animation: textGlow 3s ease-in-out infinite;
//     }
    
//     @keyframes textGlow {
//       0%, 100% { opacity: 1; }
//       50% { opacity: 0.8; }
//     }
    
//     .welcome-section p {
//       color: rgba(255, 255, 255, 0.7);
//       margin: 0;
//       font-size: 16px;
//     }
    
//     .stats-grid {
//       display: grid;
//       grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//       gap: 20px;
//       margin-bottom: 40px;
//     }
    
//     .stat-item {
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       border-radius: 16px;
//       padding: 24px;
//       transition: all 0.3s ease;
//       position: relative;
//       overflow: hidden;
//     }
    
//     .stat-item::before {
//       content: '';
//       position: absolute;
//       inset: 0;
//       background: linear-gradient(135deg, var(--stat-color) 0%, transparent 70%);
//       opacity: 0;
//       transition: opacity 0.3s ease;
//     }
    
//     .stat-item:hover {
//       transform: translateY(-4px);
//       border-color: rgba(34, 197, 94, 0.3);
//       background: rgba(255, 255, 255, 0.08);
//     }
    
//     .stat-item:hover::before {
//       opacity: 0.05;
//     }
    
//     .stat-icon {
//       width: 48px;
//       height: 48px;
//       border-radius: 12px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       margin-bottom: 16px;
//       font-size: 20px;
//       position: relative;
//       z-index: 2;
//       transition: all 0.3s ease;
//     }
    
//     .stat-item:hover .stat-icon {
//       transform: scale(1.1);
//     }
    
//     .stat-value {
//       font-size: 32px;
//       font-weight: 700;
//       margin: 0 0 4px;
//       position: relative;
//       z-index: 2;
//     }
    
//     .stat-label {
//       color: rgba(255, 255, 255, 0.6);
//       font-size: 14px;
//       margin: 0 0 8px;
//       position: relative;
//       z-index: 2;
//     }
    
//     .stat-description {
//       font-size: 12px;
//       color: rgba(255, 255, 255, 0.4);
//       margin: 8px 0 0;
//       position: relative;
//       z-index: 2;
//     }
    
//     .stat-change {
//       font-size: 12px;
//       font-weight: 600;
//       display: flex;
//       align-items: center;
//       gap: 4px;
//       position: relative;
//       z-index: 2;
//     }
    
//     .change-positive {
//       color: #22c55e;
//     }
    
//     .change-negative {
//       color: #ef4444;
//     }
    
//     .dashboard-layout {
//       display: grid;
//       grid-template-columns: 2fr 1fr;
//       gap: 32px;
//       max-width: 1400px;
//       margin: 0 auto;
//       position: relative;
//       z-index: 2;
//     }
    
//     .main-content {
//       display: flex;
//       flex-direction: column;
//       gap: 32px;
//     }
    
//     .sidebar {
//       display: flex;
//       flex-direction: column;
//       gap: 32px;
//     }
    
//     .dashboard-tabs {
//       display: flex;
//       gap: 8px;
//       background: rgba(255, 255, 255, 0.05);
//       border-radius: 12px;
//       padding: 4px;
//       margin-bottom: 24px;
//     }
    
//     .tab {
//       flex: 1;
//       padding: 12px 20px;
//       border: none;
//       background: transparent;
//       color: rgba(255, 255, 255, 0.6);
//       font-weight: 600;
//       border-radius: 8px;
//       cursor: pointer;
//       transition: all 0.3s ease;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       gap: 8px;
//     }
    
//     .tab:hover {
//       color: white;
//       background: rgba(255, 255, 255, 0.1);
//     }
    
//     .tab.active {
//       color: white;
//       background: rgba(34, 197, 94, 0.2);
//       border: 1px solid rgba(34, 197, 94, 0.3);
//     }
    
//     .activity-feed {
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       border-radius: 20px;
//       overflow: hidden;
//     }
    
//     .feed-header {
//       padding: 24px;
//       border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//     }
    
//     .feed-header h3 {
//       margin: 0;
//       font-size: 20px;
//       font-weight: 600;
//       display: flex;
//       align-items: center;
//       gap: 10px;
//     }
    
//     .feed-content {
//       padding: 0;
//     }
    
//     .activity-item {
//       display: flex;
//       align-items: center;
//       padding: 20px 24px;
//       border-bottom: 1px solid rgba(255, 255, 255, 0.05);
//       transition: all 0.3s ease;
//     }
    
//     .activity-item:hover {
//       background: rgba(255, 255, 255, 0.02);
//     }
    
//     .activity-icon {
//       width: 40px;
//       height: 40px;
//       border-radius: 10px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       margin-right: 16px;
//       font-size: 18px;
//     }
    
//     .activity-details {
//       flex: 1;
//     }
    
//     .activity-action {
//       font-weight: 500;
//       margin: 0 0 4px;
//       color: white;
//     }
    
//     .activity-time {
//       color: rgba(255, 255, 255, 0.5);
//       font-size: 12px;
//       margin: 0;
//     }
    
//     .activity-meta {
//       padding: 6px 12px;
//       background: rgba(34, 197, 94, 0.1);
//       border: 1px solid rgba(34, 197, 94, 0.2);
//       border-radius: 8px;
//       font-weight: 600;
//       font-size: 14px;
//       min-width: 60px;
//       text-align: center;
//       color: #22c55e;
//     }
    
//     .challenges-list {
//       display: flex;
//       flex-direction: column;
//       gap: 16px;
//     }
    
//     .challenge-item {
//       display: flex;
//       align-items: center;
//       padding: 20px;
//       background: rgba(255, 255, 255, 0.03);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       border-radius: 16px;
//       transition: all 0.3s ease;
//     }
    
//     .challenge-item:hover {
//       transform: translateY(-2px);
//       border-color: rgba(59, 130, 246, 0.3);
//       background: rgba(59, 130, 246, 0.05);
//     }
    
//     .challenge-progress {
//       flex: 1;
//       margin: 0 20px;
//     }
    
//     .progress-bar {
//       height: 8px;
//       background: rgba(255, 255, 255, 0.1);
//       border-radius: 4px;
//       overflow: hidden;
//       margin-bottom: 8px;
//     }
    
//     .progress-fill {
//       height: 100%;
//       background: linear-gradient(90deg, #22c55e, #3b82f6);
//       border-radius: 4px;
//       position: relative;
//       overflow: hidden;
//     }
    
//     .progress-fill::after {
//       content: '';
//       position: absolute;
//       top: 0;
//       left: 0;
//       right: 0;
//       bottom: 0;
//       background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
//       animation: progressShine 2s infinite;
//     }
    
//     @keyframes progressShine {
//       0% { transform: translateX(-100%); }
//       100% { transform: translateX(100%); }
//     }
    
//     .challenge-meta {
//       display: flex;
//       justify-content: space-between;
//       font-size: 12px;
//       color: rgba(255, 255, 255, 0.6);
//     }
    
//     .achievements-grid {
//       display: grid;
//       grid-template-columns: repeat(2, 1fr);
//       gap: 16px;
//     }
    
//     .achievement-item {
//       background: rgba(255, 255, 255, 0.03);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       border-radius: 16px;
//       padding: 20px;
//       text-align: center;
//       transition: all 0.3s ease;
//       cursor: pointer;
//     }
    
//     .achievement-item:hover {
//       transform: translateY(-2px);
//       border-color: rgba(251, 191, 36, 0.3);
//       background: rgba(251, 191, 36, 0.05);
//     }
    
//     .achievement-icon {
//       font-size: 32px;
//       margin-bottom: 12px;
//       display: block;
//     }
    
//     .achievement-name {
//       font-weight: 600;
//       margin: 0 0 8px;
//       font-size: 14px;
//       color: white;
//     }
    
//     .achievement-earned {
//       color: rgba(255, 255, 255, 0.5);
//       font-size: 12px;
//       margin: 0 0 4px;
//     }
    
//     .achievement-description {
//       font-size: 11px;
//       color: rgba(255, 255, 255, 0.4);
//       margin: 8px 0 0;
//     }
    
//     .quick-actions {
//       display: grid;
//       grid-template-columns: repeat(2, 1fr);
//       gap: 12px;
//     }
    
//     .quick-action {
//       padding: 16px;
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       border-radius: 12px;
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       justify-content: center;
//       gap: 8px;
//       transition: all 0.3s ease;
//       cursor: pointer;
//     }
    
//     .quick-action:hover {
//       background: rgba(255, 255, 255, 0.08);
//       border-color: rgba(255, 255, 255, 0.2);
//       transform: translateY(-2px);
//     }
    
//     .action-icon {
//       width: 32px;
//       height: 32px;
//       border-radius: 8px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 16px;
//     }
    
//     .action-label {
//       font-size: 12px;
//       font-weight: 500;
//       text-align: center;
//       color: rgba(255, 255, 255, 0.9);
//     }
    
//     .dashboard-button {
//       display: inline-flex;
//       align-items: center;
//       gap: 8px;
//       padding: 12px 24px;
//       border-radius: 12px;
//       font-weight: 600;
//       font-size: 14px;
//       cursor: pointer;
//       transition: all 0.3s ease;
//       border: none;
//       outline: none;
//       position: relative;
//       overflow: hidden;
//     }
    
//     .dashboard-button::before {
//       content: '';
//       position: absolute;
//       inset: 0;
//       background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.1), transparent);
//       transform: translateX(-100%);
//       transition: transform 0.6s ease;
//     }
    
//     .dashboard-button:hover::before {
//       transform: translateX(100%);
//     }
    
//     .btn-primary {
//       background: linear-gradient(135deg, #22c55e, #16a34a);
//       color: white;
//     }
    
//     .btn-primary:hover {
//       background: linear-gradient(135deg, #16a34a, #15803d);
//       transform: translateY(-2px);
//       box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
//     }
    
//     .btn-secondary {
//       background: rgba(255, 255, 255, 0.1);
//       border: 1px solid rgba(255, 255, 255, 0.2);
//       color: white;
//     }
    
//     .btn-secondary:hover {
//       background: rgba(255, 255, 255, 0.15);
//       transform: translateY(-2px);
//     }
    
//     .btn-ghost {
//       background: transparent;
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       color: rgba(255, 255, 255, 0.7);
//     }
    
//     .btn-ghost:hover {
//       background: rgba(255, 255, 255, 0.05);
//       color: white;
//     }
    
//     .btn-premium {
//       background: linear-gradient(135deg, #fbbf24, #d97706);
//       color: #1e293b;
//       font-weight: 700;
//     }
    
//     .btn-premium:hover {
//       background: linear-gradient(135deg, #d97706, #b45309);
//       transform: translateY(-2px);
//       box-shadow: 0 8px 24px rgba(251, 191, 36, 0.3);
//     }
    
//     .empty-state {
//       padding: 60px 40px;
//       text-align: center;
//       color: rgba(255, 255, 255, 0.5);
//     }
    
//     .empty-icon {
//       font-size: 64px;
//       margin-bottom: 20px;
//       opacity: 0.5;
//     }
    
//     .empty-title {
//       font-size: 20px;
//       font-weight: 600;
//       margin-bottom: 10px;
//       color: rgba(255, 255, 255, 0.8);
//     }
    
//     .empty-description {
//       font-size: 14px;
//       max-width: 400px;
//       margin: 0 auto;
//       line-height: 1.5;
//     }
    
//     .loading-skeleton {
//       background: linear-gradient(90deg, 
//         rgba(255, 255, 255, 0.05) 25%, 
//         rgba(255, 255, 255, 0.1) 50%, 
//         rgba(255, 255, 255, 0.05) 75%);
//       background-size: 200% 100%;
//       animation: loading 1.5s infinite;
//       border-radius: 8px;
//     }
    
//     @keyframes loading {
//       0% { background-position: 200% 0; }
//       100% { background-position: -200% 0; }
//     }
    
//     /* Profile specific styles */
//     .profile-hero {
//       background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1));
//       border-radius: 24px;
//       padding: 32px;
//       margin-bottom: 32px;
//     }
    
//     .profile-header {
//       display: flex;
//       align-items: center;
//       gap: 24px;
//       margin-bottom: 32px;
//     }
    
//     .avatar-container {
//       position: relative;
//     }
    
//     .avatar {
//       width: 120px;
//       height: 120px;
//       border-radius: 20px;
//       border: 4px solid rgba(255, 255, 255, 0.1);
//       object-fit: cover;
//     }
    
//     .streak-badge {
//       position: absolute;
//       bottom: -8px;
//       right: -8px;
//       width: 48px;
//       height: 48px;
//       background: linear-gradient(135deg, #ef4444, #dc2626);
//       border-radius: 12px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-weight: 700;
//       font-size: 20px;
//       border: 3px solid #0f172a;
//     }
    
//     .user-info {
//       flex: 1;
//     }
    
//     .user-name {
//       font-size: 36px;
//       font-weight: 700;
//       margin: 0 0 8px;
//       background: linear-gradient(135deg, #22c55e, #3b82f6);
//       -webkit-background-clip: text;
//       -webkit-text-fill-color: transparent;
//       background-clip: text;
//     }
    
//     .user-meta {
//       display: flex;
//       gap: 16px;
//       flex-wrap: wrap;
//       margin-bottom: 16px;
//     }
    
//     .meta-item {
//       display: flex;
//       align-items: center;
//       gap: 6px;
//       color: rgba(255, 255, 255, 0.6);
//       font-size: 14px;
//     }
    
//     .bio-section {
//       background: rgba(255, 255, 255, 0.03);
//       border-radius: 16px;
//       padding: 24px;
//       margin-bottom: 24px;
//     }
    
//     .bio-text {
//       color: rgba(255, 255, 255, 0.8);
//       line-height: 1.6;
//       margin: 0;
//     }
    
//     .profile-stats {
//       display: grid;
//       grid-template-columns: repeat(4, 1fr);
//       gap: 16px;
//       margin-top: 24px;
//     }
    
//     .profile-stat {
//       text-align: center;
//       padding: 16px;
//       background: rgba(255, 255, 255, 0.05);
//       border-radius: 12px;
//     }
    
//     .profile-stat-value {
//       font-size: 24px;
//       font-weight: 700;
//       margin-bottom: 4px;
//     }
    
//     .profile-stat-label {
//       font-size: 12px;
//       color: rgba(255, 255, 255, 0.6);
//     }
    
//     .weekly-calendar {
//       background: rgba(255, 255, 255, 0.05);
//       border-radius: 16px;
//       padding: 24px;
//     }
    
//     .calendar-grid {
//       display: grid;
//       grid-template-columns: repeat(7, 1fr);
//       gap: 8px;
//       margin-top: 16px;
//     }
    
//     .calendar-day {
//       aspect-ratio: 1;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       border-radius: 8px;
//       font-weight: 600;
//     }
    
//     .calendar-day.verified {
//       background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(21, 128, 61, 0.2));
//       border: 1px solid rgba(34, 197, 94, 0.3);
//       color: #22c55e;
//     }
    
//     .calendar-day.pending {
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       color: rgba(255, 255, 255, 0.4);
//     }
    
//     @media (max-width: 1024px) {
//       .dashboard-layout {
//         grid-template-columns: 1fr;
//       }
      
//       .profile-stats {
//         grid-template-columns: repeat(2, 1fr);
//       }
//     }
    
//     @media (max-width: 768px) {
//       .stats-grid {
//         grid-template-columns: repeat(2, 1fr);
//       }
      
//       .profile-header {
//         flex-direction: column;
//         text-align: center;
//       }
      
//       .user-meta {
//         justify-content: center;
//       }
      
//       .achievements-grid {
//         grid-template-columns: 1fr;
//       }
      
//       .quick-actions {
//         grid-template-columns: repeat(4, 1fr);
//       }
//     }
    
//     @media (max-width: 480px) {
//       .stats-grid {
//         grid-template-columns: 1fr;
//       }
      
//       .profile-stats {
//         grid-template-columns: 1fr;
//       }
      
//       .quick-actions {
//         grid-template-columns: repeat(2, 1fr);
//       }
//     }
//   `;

//   // Load user data from localStorage (SAME as Dashboard)
//   const loadUserData = () => {
//     try {
//       const storedUser = localStorage.getItem('touchgrass_user');
      
//       if (storedUser) {
//         const user = JSON.parse(storedUser);
//         console.log('✅ Profile: Loaded user from localStorage:', user);
//         return user;
//       }
      
//       // Fallback: Check if there's a user in auth state
//       const token = localStorage.getItem('touchgrass_token');
//       if (token) {
//         // Extract username from token or use default
//         const defaultUser = {
//           id: Date.now().toString(),
//           username: 'user' + Date.now(),
//           displayName: 'TouchGrass User',
//           email: 'user@example.com',
//           avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
//           location: { city: 'Online', country: 'Internet' },
//           bio: 'Building daily discipline through outdoor accountability.',
//           createdAt: new Date().toISOString(),
//           lastActive: new Date().toISOString()
//         };
//         console.log('✅ Profile: Created default user');
//         localStorage.setItem('touchgrass_user', JSON.stringify(defaultUser));
//         return defaultUser;
//       }
      
//       return null;
//     } catch (error) {
//       console.error('❌ Profile: Error loading user data:', error);
//       return null;
//     }
//   };

//   // Load streak data from localStorage (SAME as Dashboard)
//   const loadStreakData = (username) => {
//     try {
//       const streakKey = `touchgrass_streak_${username}`;
//       const storedStreak = localStorage.getItem(streakKey);
      
//       if (storedStreak) {
//         const streak = JSON.parse(storedStreak);
//         console.log('✅ Profile: Loaded streak from localStorage:', streak);
//         return streak;
//       }
      
//       // Initialize new streak (SAME as Dashboard)
//       const newStreak = {
//         currentStreak: 0,
//         longestStreak: 0,
//         totalDays: 0,
//         totalOutdoorTime: 0,
//         shameDays: 0,
//         challengeWins: 0,
//         history: [],
//         startDate: new Date().toISOString(),
//         todayVerified: false,
//         shareCount: 0,
//         viralScore: 0,
//         lastVerification: null
//       };
      
//       console.log('✅ Profile: Created new streak');
//       localStorage.setItem(streakKey, JSON.stringify(newStreak));
//       return newStreak;
//     } catch (error) {
//       console.error('❌ Profile: Error loading streak data:', error);
//       return null;
//     }
//   };

//   // Save streak data to localStorage (SAME as Dashboard)
//   const saveStreakData = (username, streakData) => {
//     try {
//       const streakKey = `touchgrass_streak_${username}`;
//       localStorage.setItem(streakKey, JSON.stringify(streakData));
//       console.log('✅ Profile: Saved streak to localStorage:', streakData);
//     } catch (error) {
//       console.error('❌ Profile: Error saving streak data:', error);
//     }
//   };

//   // Check if user verified today (SAME as Dashboard)
//   const checkTodayVerified = (streakData) => {
//     if (!streakData || !streakData.history || streakData.history.length === 0) {
//       return false;
//     }
    
//     const today = new Date().toDateString();
//     const lastEntry = streakData.history[streakData.history.length - 1];
//     const lastDate = new Date(lastEntry.date).toDateString();
    
//     return today === lastDate && lastEntry.verified === true;
//   };

//   // Generate weekly data from streak history
//   const generateWeeklyData = (streakHistory = []) => {
//     const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
//     const today = new Date();
    
//     return days.map((day, index) => {
//       const date = new Date(today);
//       date.setDate(date.getDate() - (6 - index));
      
//       const isVerified = streakHistory.some(entry => {
//         const entryDate = new Date(entry.date);
//         return entryDate.toDateString() === date.toDateString() && entry.verified;
//       });
      
//       return {
//         day,
//         date: date.getDate(),
//         isVerified,
//         fullDate: date
//       };
//     });
//   };

//   // Generate recent activity from streak data
//   const generateRecentActivity = (streakHistory = []) => {
//     if (!streakHistory || streakHistory.length === 0) return [];
    
//     return streakHistory
//       .slice(-5)
//       .reverse()
//       .map(entry => ({
//         date: new Date(entry.date),
//         verified: entry.verified,
//         duration: entry.duration || 15,
//         notes: entry.notes || '',
//         method: entry.verificationMethod || 'manual'
//       }));
//   };

//   // Calculate time until next verification
//   const calculateTimeLeft = () => {
//     const now = new Date();
//     const midnight = new Date();
//     midnight.setHours(24, 0, 0, 0);
    
//     const diffMs = midnight - now;
//     const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//   };

//   // Main data loading function
//   const loadProfileData = async () => {
//     setIsLoading(true);
    
//     try {
//       const user = loadUserData();
//       if (!user) {
//         console.log('❌ Profile: No user found, redirecting to auth');
//         toast.error('Please login to view your profile');
//         navigate('/auth');
//         return;
//       }

//       const streak = loadStreakData(user.username);
//       if (!streak) {
//         console.log('❌ Profile: No streak data found');
//         toast.error('Failed to load streak data');
//         return;
//       }

//       // Update todayVerified status
//       streak.todayVerified = checkTodayVerified(streak);
      
//       setUserData(user);
//       setStreakData(streak);
//       setBio(user.bio || '');
//       setIsOwnProfile(true); // Since we're loading current user's profile
      
//       // Generate weekly data
//       const weekly = generateWeeklyData(streak.history || []);
//       setWeeklyData(weekly);
      
//       // Generate recent activity
//       const activity = generateRecentActivity(streak.history || []);
//       setRecentActivity(activity);

//       // Set achievements based on streak data (SAME as Dashboard)
//       const userAchievements = [];
//       if (streak.currentStreak >= 7) {
//         userAchievements.push({
//           name: 'Weekly Warrior',
//           icon: '🔥',
//           description: '7 consecutive days',
//           earnedAt: new Date().toISOString()
//         });
//       }
//       if (streak.shareCount >= 10) {
//         userAchievements.push({
//           name: 'Social Butterfly',
//           icon: '🦋',
//           description: '10+ shares',
//           earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
//         });
//       }
//       if (streak.currentStreak >= 30) {
//         userAchievements.push({
//           name: 'Monthly Master',
//           icon: '🌟',
//           description: '30-day streak',
//           earnedAt: new Date().toISOString()
//         });
//       }
//       if (streak.totalDays >= 100) {
//         userAchievements.push({
//           name: 'Century Club',
//           icon: '💯',
//           description: '100 total days',
//           earnedAt: new Date().toISOString()
//         });
//       }
//       setAchievements(userAchievements);

//       // Set social stats
//       setFollowersCount(Math.floor(Math.random() * 100));
//       setFollowingCount(Math.floor(Math.random() * 50));

//       console.log('✅ Profile: Data loaded successfully:', { user, streak });
      
//     } catch (error) {
//       console.error('❌ Profile: Error loading profile data:', error);
//       toast.error('Failed to load profile data');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle streak verification (SAME as Dashboard)
//   const handleVerifyToday = async () => {
//     if (!userData || !streakData) return;
    
//     const { user, streakData: currentStreakData } = { user: userData, streakData };
    
//     // Check if already verified today
//     if (currentStreakData.todayVerified) {
//       toast.error('You already verified today! Come back tomorrow.', {
//         icon: '✅',
//         duration: 3000
//       });
//       return;
//     }
    
//     setIsVerifying(true);
    
//     try {
//       // Simulate verification delay
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       // Generate random outdoor time (15-60 minutes)
//       const outdoorTime = Math.floor(Math.random() * 45) + 15;
      
//       // Update streak (SAME as Dashboard)
//       const updatedStreak = {
//         ...currentStreakData,
//         currentStreak: currentStreakData.currentStreak + 1,
//         longestStreak: Math.max(currentStreakData.longestStreak, currentStreakData.currentStreak + 1),
//         totalDays: currentStreakData.totalDays + 1,
//         totalOutdoorTime: currentStreakData.totalOutdoorTime + outdoorTime,
//         todayVerified: true,
//         lastVerification: new Date().toISOString(),
//         history: [
//           ...(currentStreakData.history || []),
//           {
//             date: new Date().toISOString(),
//             verified: true,
//             verificationMethod: 'photo',
//             duration: outdoorTime,
//             notes: 'Daily verification',
//             location: { lat: null, lng: null },
//             photoUrl: null
//           }
//         ]
//       };
      
//       // Check for milestones
//       const newStreakLength = updatedStreak.currentStreak;
//       if (newStreakLength === 7 || newStreakLength === 30 || newStreakLength === 100) {
//         setShowConfetti(true);
//         setTimeout(() => setShowConfetti(false), 3000);
//         toast.success(`🎉 ${newStreakLength}-day milestone achieved!`, {
//           duration: 5000
//         });
//       } else if (newStreakLength === 1) {
//         toast.success('🎯 First day verified! Your streak begins!', {
//           duration: 4000
//         });
//       } else {
//         toast.success(`✅ Day ${newStreakLength} verified! Streak continues!`, {
//           duration: 3000
//         });
//       }
      
//       // Save updated streak
//       saveStreakData(user.username, updatedStreak);
      
//       // Update user last active
//       const updatedUser = {
//         ...user,
//         lastActive: new Date().toISOString()
//       };
//       localStorage.setItem('touchgrass_user', JSON.stringify(updatedUser));
      
//       // Update state
//       setUserData(updatedUser);
//       setStreakData(updatedStreak);
      
//       // Update weekly data and recent activity
//       const weekly = generateWeeklyData(updatedStreak.history || []);
//       setWeeklyData(weekly);
      
//       const activity = generateRecentActivity(updatedStreak.history || []);
//       setRecentActivity(activity);
      
//     } catch (error) {
//       console.error('❌ Profile: Verification error:', error);
//       toast.error('Verification failed. Please try again.', {
//         icon: '❌'
//       });
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   // Handle accepting shame day
//   const handleShame = async () => {
//     if (!userData || !streakData) return;

//     const confirmShame = window.confirm(
//       "Accepting shame will reset your streak to 0. This will be recorded on your profile. Continue?"
//     );

//     if (!confirmShame) return;

//     try {
//       const updatedStreak = {
//         ...streakData,
//         currentStreak: 0,
//         todayVerified: false,
//         shameDays: (streakData.shameDays || 0) + 1,
//         history: [
//           ...(streakData.history || []),
//           {
//             date: new Date().toISOString(),
//             verified: false,
//             verificationMethod: 'shame',
//             duration: 0,
//             notes: 'Failed to touch grass today',
//             shameMessage: "Failed to touch grass today"
//           }
//         ]
//       };
      
//       saveStreakData(userData.username, updatedStreak);
//       setStreakData(updatedStreak);
      
//       toast('😈 Shame accepted. Streak reset.', {
//         style: {
//           background: '#dc2626',
//           color: 'white'
//         }
//       });
      
//     } catch (error) {
//       console.error('❌ Profile: Error accepting shame:', error);
//       toast.error('Failed to accept shame');
//     }
//   };

//   // Update bio
//   const updateBio = async () => {
//     try {
//       const updatedUser = {
//         ...userData,
//         bio: bio,
//         updatedAt: new Date().toISOString()
//       };
      
//       localStorage.setItem('touchgrass_user', JSON.stringify(updatedUser));
//       setUserData(updatedUser);
//       setIsEditingBio(false);
//       toast.success('Bio updated successfully!');
      
//     } catch (error) {
//       console.error('❌ Profile: Error updating bio:', error);
//       toast.error('Failed to update bio');
//     }
//   };

//   // Handle logout
//   const handleLogout = () => {
//     localStorage.removeItem('touchgrass_token');
//     localStorage.removeItem('touchgrass_user');
//     // Also clear streak data for current user
//     if (userData?.username) {
//       localStorage.removeItem(`touchgrass_streak_${userData.username}`);
//     }
//     navigate('/auth');
//     toast.success('Logged out successfully');
//   };

//   // Share profile function
//   const shareProfile = (platform) => {
//     if (!userData) return;

//     const shareUrl = `${window.location.origin}/profile/${userData.username}`;
//     const shareText = `${userData.displayName} has maintained a ${streakData?.currentStreak || 0}-day TouchGrass streak. Join the movement for daily accountability and real-world discipline. ${shareUrl}`;

//     switch (platform) {
//       case 'copy':
//         navigator.clipboard.writeText(shareUrl);
//         toast.success('Profile link copied to clipboard!');
//         break;
//       case 'twitter':
//         window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&hashtags=TouchGrass,Accountability,Streak`, '_blank');
//         break;
//       case 'linkedin':
//         window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
//         break;
//       case 'facebook':
//         window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
//         break;
//       default:
//         if (navigator.share) {
//           navigator.share({
//             title: `${userData.displayName}'s TouchGrass Profile`,
//             text: shareText,
//             url: shareUrl
//           });
//         }
//     }
    
//     setShowShareOptions(false);
//   };

//   // Toggle dark mode
//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//     if (!isDarkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   };

//   // Initialize data
//   useEffect(() => {
//     loadProfileData();
    
//     // Update time left every second
//     const timeInterval = setInterval(() => {
//       setTimeLeft(calculateTimeLeft());
//     }, 1000);
    
//     return () => clearInterval(timeInterval);
//   }, []);

//   // Calculate next milestone
//   const getNextMilestone = () => {
//     if (!streakData) return { target: 7, daysLeft: 7 };
    
//     const { currentStreak } = streakData;
    
//     if (currentStreak < 7) return { target: 7, daysLeft: 7 - currentStreak };
//     if (currentStreak < 30) return { target: 30, daysLeft: 30 - currentStreak };
//     if (currentStreak < 100) return { target: 100, daysLeft: 100 - currentStreak };
//     return { target: 365, daysLeft: 365 - currentStreak };
//   };

//   // Stats cards configuration (matching dashboard style)
//   const stats = [
//     {
//       label: 'Current Streak',
//       value: streakData?.currentStreak || 0,
//       description: 'Consecutive verified days',
//       icon: <Flame />,
//       color: '#ef4444',
//       change: streakData?.currentStreak > 0 ? '+1' : '0',
//     },
//     {
//       label: 'Consistency',
//       value: streakData?.totalDays > 0 
//         ? `${Math.min(100, Math.round((streakData?.totalDays / Math.max(1, Math.floor((new Date() - new Date(userData?.createdAt)) / (1000 * 60 * 60 * 24)))) * 100))}%`
//         : '0%',
//       description: 'Verification success rate',
//       icon: <Target />,
//       color: '#22c55e',
//       change: streakData?.totalDays > 0 ? '+3%' : '0%',
//     },
//     {
//       label: 'Global Rank',
//       value: streakData?.currentStreak > 0 ? `#${Math.ceil(Math.random() * 1000)}` : 'N/A',
//       description: 'Worldwide position',
//       icon: <Trophy />,
//       color: '#fbbf24',
//       change: streakData?.currentStreak > 0 ? '↑5' : '0',
//     },
//     {
//       label: 'Total Days',
//       value: streakData?.totalDays || 0,
//       description: 'All-time verifications',
//       icon: <Calendar />,
//       color: '#3b82f6',
//       change: streakData?.totalDays > 0 ? '+1' : '0',
//     },
//     {
//       label: 'Avg. Time',
//       value: streakData?.totalDays > 0 ? `${Math.round(streakData.totalOutdoorTime / streakData.totalDays)}m` : '0m',
//       description: 'Daily average',
//       icon: <Clock />,
//       color: '#8b5cf6',
//       change: streakData?.totalDays > 0 ? '-5m' : '0m',
//     },
//     {
//       label: 'Social Score',
//       value: streakData?.viralScore || 0,
//       description: 'Social influence',
//       icon: <Share2 />,
//       color: '#ec4899',
//       change: streakData?.shareCount > 0 ? '+8' : '0',
//     },
//   ];

//   // Tabs configuration
//   const tabs = [
//     { id: 'overview', label: 'Overview', icon: <Activity /> },
//     { id: 'analytics', label: 'Analytics', icon: <BarChart3 /> },
//     { id: 'achievements', label: 'Achievements', icon: <Award /> },
//     { id: 'social', label: 'Social', icon: <Users /> }
//   ];

//   // Quick actions matching dashboard
//   const quickActions = [
//     { icon: '🌱', label: 'Verify Today', color: '#22c55e', action: handleVerifyToday },
//     { icon: '📊', label: 'Leaderboard', color: '#3b82f6', action: () => navigate('/leaderboard') },
//     { icon: '💬', label: 'Chat', color: '#8b5cf6', action: () => navigate('/chat') },
//     { icon: '🎯', label: 'Challenge', color: '#ec4899', action: () => navigate('/challenges') },
//     { icon: '📈', label: 'Analytics', color: '#84cc16', action: () => setActiveTab('analytics') },
//     { icon: '👥', label: 'Friends', color: '#06b6d4', action: () => navigate('/chat') },
//     { icon: '📲', label: 'Share', color: '#fbbf24', action: () => setShowShareOptions(true) },
//     { icon: '⚙️', label: 'Settings', color: '#71717a', action: () => setShowSettingsModal(true) },
//   ];

//   // Check if today is verified
//   const today = new Date().toDateString();
//   const todayVerified = streakData?.history?.some(entry => 
//     new Date(entry.date).toDateString() === today && entry.verified
//   ) || false;

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="dashboard-container">
//         <style>{dashboardStyles}</style>
//         <div className="dashboard-background" />
//         <div className="dashboard-header">
//           <div className="header-top">
//             <div className="welcome-section">
//               <div className="loading-skeleton" style={{ width: '300px', height: '48px', marginBottom: '8px' }}></div>
//               <div className="loading-skeleton" style={{ width: '400px', height: '24px' }}></div>
//             </div>
//           </div>
          
//           <div className="stats-grid">
//             {[...Array(6)].map((_, i) => (
//               <div key={i} className="loading-skeleton" style={{ height: '150px', borderRadius: '16px' }}></div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // No user data state
//   if (!userData) {
//     return (
//       <div className="dashboard-container">
//         <style>{dashboardStyles}</style>
//         <div className="dashboard-background" />
//         <div className="dashboard-header">
//           <div className="empty-state">
//             <div className="empty-icon">🔒</div>
//             <div className="empty-title">Profile Unavailable</div>
//             <div className="empty-description">
//               Please login to view your profile
//             </div>
//             <button 
//               className="dashboard-button btn-primary"
//               onClick={() => navigate('/auth')}
//               style={{ marginTop: '20px' }}
//             >
//               Sign In
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const nextMilestone = getNextMilestone();

//   return (
//     <div className="dashboard-container">
//       <style>{dashboardStyles}</style>
//       <div className="dashboard-background" />
      
//       {showConfetti && (
//         <div className="fixed inset-0 z-50 pointer-events-none">
//           {[...Array(100)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute w-2 h-2 rounded-full"
//               style={{
//                 background: ['#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#fbbf24'][Math.floor(Math.random() * 5)],
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 animation: `confetti-fall ${Math.random() * 2 + 1}s linear forwards`,
//                 animationDelay: `${Math.random() * 0.5}s`
//               }}
//             />
//           ))}
//         </div>
//       )}

//       <div className="dashboard-header">
//         {/* Header */}
//         <div className="header-top">
//           <div className="welcome-section">
//             <button
//               onClick={() => navigate('/dashboard')}
//               className="dashboard-button btn-ghost"
//               style={{ marginBottom: '16px' }}
//             >
//               <ArrowLeft size={16} />
//               Back to Dashboard
//             </button>
//             <h1>Profile Settings</h1>
//             <p>Manage your account and track your progress</p>
//           </div>
          
//           <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
//             <div className="time-left-counter">
//               <Clock size={14} />
//               <span>Reset:</span>
//               <div className="time-left-digit">{timeLeft || '23:59:59'}</div>
//             </div>
            
//             <button
//               className="dashboard-button btn-secondary"
//               onClick={() => setShowSettingsModal(true)}
//             >
//               <Settings size={16} />
//               Settings
//             </button>
//             <button
//               className="dashboard-button btn-ghost"
//               onClick={handleLogout}
//             >
//               <LogOut size={16} />
//               Logout
//             </button>
//           </div>
//         </div>

//         {/* Profile Hero Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="profile-hero"
//         >
//           <div className="profile-header">
//             <div className="avatar-container">
//               <img
//                 src={userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`}
//                 alt={userData.displayName}
//                 className="avatar"
//               />
//               <div className="streak-badge">
//                 {streakData?.currentStreak || 0}
//               </div>
//             </div>
            
//             <div className="user-info">
//               <h2 className="user-name">{userData.displayName}</h2>
              
//               <div className="user-meta">
//                 <span className="meta-item">
//                   <Globe size={14} />
//                   @{userData.username}
//                 </span>
//                 <span className="meta-item">
//                   <MapPin size={14} />
//                   {userData.location?.city || 'Online'}
//                 </span>
//                 {/* <span className="meta-item">
//                   <Calendar size={14} />
//                   Joined {new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
//                 </span> */}
//               </div>
              
//                <div className="profile-stats">
                
                
//                 <div className="profile-stat">
//                   <div className="profile-stat-value">{achievements.length}</div>
//                   <div className="profile-stat-label">Achievements</div>
//                 </div>
//                 <div className="profile-stat">
//                   <div className="profile-stat-value">{streakData?.totalDays || 0}</div>
//                   <div className="profile-stat-label">Total Days</div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Bio Section */}
//           <div className="bio-section">
//             {isEditingBio ? (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//                 <textarea
//                   value={bio}
//                   onChange={(e) => setBio(e.target.value)}
//                   className="bio-text"
//                   style={{
//                     width: '100%',
//                     minHeight: '100px',
//                     background: 'rgba(255, 255, 255, 0.05)',
//                     border: '1px solid rgba(255, 255, 255, 0.1)',
//                     borderRadius: '8px',
//                     padding: '12px',
//                     color: 'white',
//                     resize: 'vertical'
//                   }}
//                   maxLength={200}
//                   placeholder="Tell us about your journey..."
//                 />
//                 <div style={{ display: 'flex', gap: '8px' }}>
//                   <button
//                     className="dashboard-button btn-primary"
//                     onClick={updateBio}
//                   >
//                     Save Bio
//                   </button>
//                   <button
//                     className="dashboard-button btn-ghost"
//                     onClick={() => {
//                       setIsEditingBio(false);
//                       setBio(userData.bio);
//                     }}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                 <p className="bio-text">
//                   {userData.bio || 'No bio yet. Share your journey...'}
//                 </p>
//                 {isOwnProfile && (
//                   <button
//                     className="dashboard-button btn-ghost"
//                     onClick={() => setIsEditingBio(true)}
//                     style={{ marginLeft: '12px' }}
//                   >
//                     <Edit size={14} />
//                     Edit
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
          
//           {/* Verification Action */}
//           <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
//             <button
//               onClick={handleVerifyToday}
//               disabled={isVerifying || todayVerified}
//               className={`dashboard-button ${todayVerified ? 'btn-secondary' : 'btn-primary'}`}
//               style={{ flex: 1 }}
//             >
//               {isVerifying ? (
//                 <>
//                   <Loader className="animate-spin" size={16} />
//                   Verifying...
//                 </>
//               ) : todayVerified ? (
//                 <>
//                   <CheckCircle size={16} />
//                   Verified Today
//                 </>
//               ) : (
//                 <>
//                   <Camera size={16} />
//                   Verify Today
//                 </>
//               )}
//             </button>
            
//             <button
//               onClick={handleShame}
//               className="dashboard-button btn-ghost"
//               style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
//             >
//               <XCircle size={16} />
//               Shame Day
//             </button>
            
//             <button
//               onClick={() => setShowShareOptions(true)}
//               className="dashboard-button btn-secondary"
//             >
//               <Share2 size={16} />
//               Share
//             </button>
//           </div>
//         </motion.div>

//         {/* Stats Grid */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="stats-grid"
//         >
//           {stats.map((stat, index) => (
//             <div
//               key={index}
//               className="stat-item"
//               style={{ '--stat-color': stat.color }}
//             >
//               <div 
//                 className="stat-icon"
//                 style={{
//                   background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}40)`,
//                   color: stat.color,
//                   border: `1px solid ${stat.color}30`
//                 }}
//               >
//                 {stat.icon}
//               </div>
//               <div className="stat-value">{stat.value}</div>
//               <div className="stat-label">{stat.label}</div>
//               <div className="stat-description">{stat.description}</div>
//               <div className={`stat-change ${stat.change.startsWith('+') || stat.change.startsWith('↑') ? 'change-positive' : 'change-negative'}`}>
//                 {stat.change.startsWith('+') || stat.change.startsWith('↑') ? '↗' : '↘'} {stat.change}
//               </div>
//             </div>
//           ))}
//         </motion.div>
//       </div>

//       {/* Main Content */}
//       <div className="dashboard-layout">
//         <div className="main-content">
//           {/* Tabs */}
//           <div className="dashboard-tabs">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 className={`tab ${activeTab === tab.id ? 'active' : ''}`}
//                 onClick={() => setActiveTab(tab.id)}
//               >
//                 {tab.icon}
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           {/* Tab Content */}
//           {activeTab === 'overview' && (
//             <>
//               {/* Weekly Calendar */}
//               <div className="weekly-calendar">
//                 <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '600' }}>
//                   Weekly Progress
//                 </h3>
//                 <div className="calendar-grid">
//                   {weeklyData.map((day, index) => (
//                     <div
//                       key={index}
//                       className={`calendar-day ${day.isVerified ? 'verified' : 'pending'}`}
//                     >
//                       {day.day}
//                       <div style={{ fontSize: '10px', marginTop: '4px' }}>
//                         {day.date}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Recent Activity */}
//               <div className="activity-feed">
//                 <div className="feed-header">
//                   <h3>
//                     <Activity size={20} />
//                     Recent Activity
//                   </h3>
//                   <button 
//                     className="dashboard-button btn-ghost"
//                     onClick={loadProfileData}
//                   >
//                     Refresh
//                   </button>
//                 </div>
//                 <div className="feed-content">
//                   {recentActivity.length > 0 ? (
//                     recentActivity.map((activity, index) => (
//                       <div key={index} className="activity-item">
//                         <div 
//                           className="activity-icon"
//                           style={{
//                             background: activity.verified 
//                               ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(21, 128, 61, 0.2))'
//                               : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(185, 28, 28, 0.2))',
//                             color: activity.verified ? '#22c55e' : '#ef4444'
//                           }}
//                         >
//                           {activity.verified ? '✓' : '✗'}
//                         </div>
//                         <div className="activity-details">
//                           <div className="activity-action">
//                             {activity.verified ? 'Verified Day' : 'Missed Day'}
//                           </div>
//                           <div className="activity-time">
//                             {activity.date.toLocaleDateString('en-US', { 
//                               weekday: 'short',
//                               month: 'short',
//                               day: 'numeric'
//                             })}
//                           </div>
//                         </div>
//                         {activity.verified && (
//                           <div className="activity-meta">
//                             {activity.duration}m
//                           </div>
//                         )}
//                       </div>
//                     ))
//                   ) : (
//                     <div className="empty-state">
//                       <div className="empty-icon">📝</div>
//                       <div className="empty-title">No recent activity</div>
//                       <div className="empty-description">
//                         Start verifying your streak to see activity here
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </>
//           )}

//           {activeTab === 'analytics' && (
//             <div className="activity-feed">
//               <div className="feed-header">
//                 <h3>
//                   <BarChart3 size={20} />
//                   Analytics
//                 </h3>
//               </div>
//               <div className="empty-state">
//                 <div className="empty-icon">📊</div>
//                 <div className="empty-title">Analytics Coming Soon</div>
//                 <div className="empty-description">
//                   Detailed analytics and insights will be available soon
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'achievements' && (
//             <div className="activity-feed">
//               <div className="feed-header">
//                 <h3>
//                   <Award size={20} />
//                   Achievements
//                 </h3>
//                 <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
//                   {achievements.length} earned
//                 </div>
//               </div>
//               <div className="achievements-grid">
//                 {achievements.length > 0 ? (
//                   achievements.map((achievement, index) => (
//                     <div key={index} className="achievement-item">
//                       <div className="achievement-icon">{achievement.icon}</div>
//                       <div className="achievement-name">{achievement.name}</div>
//                       <div className="achievement-earned">
//                         {new Date(achievement.earnedAt).toLocaleDateString()}
//                       </div>
//                       <div className="achievement-description">{achievement.description}</div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
//                     <div className="empty-icon">🏆</div>
//                     <div className="empty-title">No achievements yet</div>
//                     <div className="empty-description">
//                       Start your streak to earn achievements
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {activeTab === 'social' && (
//             <div className="activity-feed">
//               <div className="feed-header">
//                 <h3>
//                   <Users size={20} />
//                   Social
//                 </h3>
//               </div>
//               <div className="empty-state">
//                 <div className="empty-icon">👥</div>
//                 <div className="empty-title">Social Features Coming Soon</div>
//                 <div className="empty-description">
//                   Follow users, join communities, and more social features coming soon
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Sidebar */}
//         <div className="sidebar">
//           {/* Quick Actions */}
//           <div className="activity-feed">
//             <div className="feed-header">
//               <h3>
//                 <Zap size={20} />
//                 Quick Actions
//               </h3>
//             </div>
//             <div className="quick-actions">
//               {quickActions.map((action, index) => (
//                 <div
//                   key={index}
//                   className="quick-action"
//                   onClick={action.action}
//                 >
//                   <div 
//                     className="action-icon"
//                     style={{
//                       background: `linear-gradient(135deg, ${action.color}20, ${action.color}40)`,
//                       color: action.color,
//                       border: `1px solid ${action.color}30`
//                     }}
//                   >
//                     {action.icon}
//                   </div>
//                   <div className="action-label">{action.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Next Milestone */}
//           <div className="activity-feed">
//             <div className="feed-header">
//               <h3>
//                 <TargetIcon size={20} />
//                 Next Milestone
//               </h3>
//             </div>
//             <div style={{ padding: '24px', textAlign: 'center' }}>
//               <div style={{ 
//                 fontSize: '48px', 
//                 fontWeight: '700',
//                 background: 'linear-gradient(135deg, #fbbf24, #d97706)',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//                 backgroundClip: 'text',
//                 marginBottom: '8px'
//               }}>
//                 Day {nextMilestone.target}
//               </div>
//               <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '16px' }}>
//                 {nextMilestone.daysLeft} {nextMilestone.daysLeft === 1 ? 'day' : 'days'} to go
//               </div>
//               <div className="progress-bar" style={{ height: '12px' }}>
//                 <div 
//                   className="progress-fill"
//                   style={{ 
//                     width: `${Math.min(100, ((streakData?.currentStreak || 0) / nextMilestone.target) * 100)}%`
//                   }}
//                 />
//               </div>
//               <div style={{ 
//                 display: 'flex', 
//                 justifyContent: 'space-between', 
//                 fontSize: '12px',
//                 color: 'rgba(255, 255, 255, 0.6)',
//                 marginTop: '8px'
//               }}>
//                 <span>Day {streakData?.currentStreak || 0}</span>
//                 <span>Day {nextMilestone.target}</span>
//               </div>
//             </div>
//           </div>

//           {/* Performance Insights */}
//           <div style={{ 
//             background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
//             border: '1px solid rgba(139, 92, 246, 0.2)',
//             borderRadius: '20px',
//             padding: '24px',
//             textAlign: 'center'
//           }}>
//             <div style={{ fontSize: '32px', marginBottom: '16px' }}>🚀</div>
//             <h3 style={{ margin: '0 0 12px', color: '#8b5cf6' }}>Performance</h3>
//             <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 20px', fontSize: '14px' }}>
//               {streakData?.currentStreak > 0 
//                 ? `Better than ${Math.floor(Math.random() * 30) + 70}% of users`
//                 : 'Start your streak to see rankings'}
//             </p>
//             <button
//               className="dashboard-button btn-secondary"
//               onClick={() => navigate('/leaderboard')}
//               style={{ width: '100%' }}
//             >
//               <Trophy size={16} />
//               View Leaderboard
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Share Modal */}
//       <AnimatePresence>
//         {showShareOptions && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               style={{
//                 background: 'linear-gradient(135deg, #1e293b, #0f172a)',
//                 borderRadius: '24px',
//                 padding: '32px',
//                 maxWidth: '600px',
//                 width: '100%',
//                 border: '1px solid rgba(255, 255, 255, 0.1)',
//                 boxShadow: '0 32px 64px rgba(0, 0, 0, 0.5)',
//                 position: 'relative'
//               }}
//             >
//               <button 
//                 onClick={() => setShowShareOptions(false)}
//                 style={{
//                   position: 'absolute',
//                   top: '20px',
//                   right: '20px',
//                   background: 'rgba(255, 255, 255, 0.05)',
//                   border: '1px solid rgba(255, 255, 255, 0.1)',
//                   borderRadius: '10px',
//                   width: '36px',
//                   height: '36px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   cursor: 'pointer',
//                   color: 'white',
//                   fontSize: '18px',
//                   transition: 'all 0.3s ease'
//                 }}
//                 onMouseEnter={e => {
//                   e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
//                   e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
//                 }}
//                 onMouseLeave={e => {
//                   e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
//                   e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
//                 }}
//               >
//                 ✕
//               </button>

//               <div style={{ textAlign: 'center', marginBottom: '32px' }}>
//                 <div style={{
//                   width: '80px',
//                   height: '80px',
//                   background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
//                   borderRadius: '20px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   margin: '0 auto 20px',
//                   fontSize: '36px'
//                 }}>
//                   🏆
//                 </div>
//                 <h2 style={{ 
//                   margin: '0 0 8px', 
//                   fontSize: '28px',
//                   background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
//                   WebkitBackgroundClip: 'text',
//                   WebkitTextFillColor: 'transparent',
//                   backgroundClip: 'text'
//                 }}>
//                   Share Profile
//                 </h2>
//                 <p style={{ 
//                   margin: 0, 
//                   color: 'rgba(255, 255, 255, 0.7)',
//                   fontSize: '16px'
//                 }}>
//                   Day {streakData?.currentStreak || 0} • {Math.min(100, Math.round((streakData?.totalDays / Math.max(1, Math.floor((new Date() - new Date(userData.createdAt)) / (1000 * 60 * 60 * 24)))) * 100))}% Consistency
//                 </p>
//               </div>

//               <div style={{ 
//                 display: 'grid', 
//                 gridTemplateColumns: 'repeat(2, 1fr)',
//                 gap: '16px',
//                 marginBottom: '32px'
//               }}>
//                 {[
//                   { platform: 'twitter', name: 'Twitter/X', icon: <Twitter />, color: '#1DA1F2' },
//                   { platform: 'linkedin', name: 'LinkedIn', icon: <Linkedin />, color: '#0077B5' },
//                   { platform: 'facebook', name: 'Facebook', icon: <Facebook />, color: '#1877F2' },
//                   { platform: 'instagram', name: 'Instagram', icon: <Instagram />, color: '#E4405F' },
//                   { platform: 'whatsapp', name: 'WhatsApp', icon: <MessageSquare />, color: '#25D366' },
//                   { platform: 'copy', name: 'Copy Link', icon: '📋', color: '#8B5CF6' },
//                 ].map((platform) => (
//                   <button
//                     key={platform.platform}
//                     onClick={() => shareProfile(platform.platform)}
//                     style={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '16px',
//                       padding: '20px',
//                       background: 'rgba(255, 255, 255, 0.05)',
//                       border: '1px solid rgba(255, 255, 255, 0.1)',
//                       borderRadius: '16px',
//                       color: 'white',
//                       cursor: 'pointer',
//                       transition: 'all 0.3s ease',
//                       textAlign: 'left'
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.background = `${platform.color}20`;
//                       e.currentTarget.style.borderColor = `${platform.color}40`;
//                       e.currentTarget.style.transform = 'translateY(-4px)';
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
//                       e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
//                       e.currentTarget.style.transform = 'translateY(0)';
//                     }}
//                   >
//                     <div style={{ 
//                       width: '52px', 
//                       height: '52px',
//                       background: `${platform.color}20`,
//                       border: `1px solid ${platform.color}40`,
//                       borderRadius: '14px',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       fontSize: '24px'
//                     }}>
//                       {platform.icon}
//                     </div>
//                     <div>
//                       <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>
//                         {platform.name}
//                       </div>
//                       <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
//                         {platform.platform === 'copy' ? 'Copy to clipboard' : 'Share to ' + platform.name}
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* Settings Modal */}
//       <AnimatePresence>
//         {showSettingsModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               style={{
//                 background: 'linear-gradient(135deg, #1e293b, #0f172a)',
//                 borderRadius: '24px',
//                 padding: '32px',
//                 maxWidth: '600px',
//                 width: '100%',
//                 border: '1px solid rgba(255, 255, 255, 0.1)',
//                 boxShadow: '0 32px 64px rgba(0, 0, 0, 0.5)',
//                 position: 'relative'
//               }}
//             >
//               <button 
//                 onClick={() => setShowSettingsModal(false)}
//                 style={{
//                   position: 'absolute',
//                   top: '20px',
//                   right: '20px',
//                   background: 'rgba(255, 255, 255, 0.05)',
//                   border: '1px solid rgba(255, 255, 255, 0.1)',
//                   borderRadius: '10px',
//                   width: '36px',
//                   height: '36px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   cursor: 'pointer',
//                   color: 'white',
//                   fontSize: '18px',
//                   transition: 'all 0.3s ease'
//                 }}
//                 onMouseEnter={e => {
//                   e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
//                   e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
//                 }}
//                 onMouseLeave={e => {
//                   e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
//                   e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
//                 }}
//               >
//                 ✕
//               </button>

//               <h2 style={{ 
//                 margin: '0 0 32px', 
//                 fontSize: '28px',
//                 background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//                 backgroundClip: 'text'
//               }}>
//                 Account Settings
//               </h2>

//               <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
//                 {/* Theme Toggle */}
//                 <div style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                   padding: '20px',
//                   background: 'rgba(255, 255, 255, 0.05)',
//                   border: '1px solid rgba(255, 255, 255, 0.1)',
//                   borderRadius: '16px'
//                 }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                     <div style={{
//                       width: '40px',
//                       height: '40px',
//                       background: 'linear-gradient(135deg, #fbbf24, #d97706)',
//                       borderRadius: '10px',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center'
//                     }}>
//                       {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
//                     </div>
//                     <div>
//                       <div style={{ fontWeight: '600', fontSize: '16px' }}>Theme</div>
//                       <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
//                         {isDarkMode ? 'Dark Mode' : 'Light Mode'}
//                       </div>
//                     </div>
//                   </div>
//                   <button
//                     onClick={toggleDarkMode}
//                     style={{
//                       padding: '10px 20px',
//                       background: isDarkMode ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'linear-gradient(135deg, #fbbf24, #d97706)',
//                       border: 'none',
//                       borderRadius: '10px',
//                       color: 'white',
//                       fontWeight: '600',
//                       cursor: 'pointer',
//                       transition: 'all 0.3s ease'
//                     }}
//                     onMouseEnter={e => {
//                       e.currentTarget.style.transform = 'translateY(-2px)';
//                     }}
//                     onMouseLeave={e => {
//                       e.currentTarget.style.transform = 'translateY(0)';
//                     }}
//                   >
//                     {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
//                   </button>
//                 </div>

//                 {/* Notifications */}
//                 <div style={{
//                   padding: '20px',
//                   background: 'rgba(255, 255, 255, 0.05)',
//                   border: '1px solid rgba(255, 255, 255, 0.1)',
//                   borderRadius: '16px'
//                 }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
//                     <Bell size={20} />
//                     <div style={{ fontWeight: '600', fontSize: '18px' }}>Notifications</div>
//                   </div>
                  
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//                     <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
//                       <span>Streak Reminders</span>
//                       <input type="checkbox" defaultChecked className="w-6 h-6" />
//                     </label>
//                     <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
//                       <span>Challenge Updates</span>
//                       <input type="checkbox" defaultChecked className="w-6 h-6" />
//                     </label>
//                     <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
//                       <span>Social Notifications</span>
//                       <input type="checkbox" defaultChecked className="w-6 h-6" />
//                     </label>
//                   </div>
//                 </div>

//                 {/* Privacy */}
//                 <div style={{
//                   padding: '20px',
//                   background: 'rgba(255, 255, 255, 0.05)',
//                   border: '1px solid rgba(255, 255, 255, 0.1)',
//                   borderRadius: '16px'
//                 }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
//                     <Lock size={20} />
//                     <div style={{ fontWeight: '600', fontSize: '18px' }}>Privacy</div>
//                   </div>
                  
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//                     <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
//                       <span>Public Profile</span>
//                       <input type="checkbox" defaultChecked className="w-6 h-6" />
//                     </label>
//                     <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
//                       <span>Show on Leaderboard</span>
//                       <input type="checkbox" defaultChecked className="w-6 h-6" />
//                     </label>
//                   </div>
//                 </div>

//                 {/* Logout Button */}
//                 <button
//                   onClick={handleLogout}
//                   style={{
//                     width: '100%',
//                     padding: '16px',
//                     background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
//                     border: '1px solid rgba(239, 68, 68, 0.2)',
//                     borderRadius: '16px',
//                     color: '#ef4444',
//                     fontWeight: '600',
//                     cursor: 'pointer',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     gap: '8px',
//                     transition: 'all 0.3s ease'
//                   }}
//                   onMouseEnter={e => {
//                     e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))';
//                     e.currentTarget.style.transform = 'translateY(-2px)';
//                   }}
//                   onMouseLeave={e => {
//                     e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))';
//                     e.currentTarget.style.transform = 'translateY(0)';
//                   }}
//                 >
//                   <LogOut size={18} />
//                   Logout Account
//                 </button>

//                 {/* Close Button */}
//                 <button
//                   onClick={() => setShowSettingsModal(false)}
//                   style={{
//                     width: '100%',
//                     padding: '16px',
//                     background: 'rgba(255, 255, 255, 0.05)',
//                     border: '1px solid rgba(255, 255, 255, 0.1)',
//                     borderRadius: '16px',
//                     color: 'white',
//                     fontWeight: '600',
//                     cursor: 'pointer',
//                     transition: 'all 0.3s ease'
//                   }}
//                   onMouseEnter={e => {
//                     e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
//                     e.currentTarget.style.transform = 'translateY(-2px)';
//                   }}
//                   onMouseLeave={e => {
//                     e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
//                     e.currentTarget.style.transform = 'translateY(0)';
//                   }}
//                 >
//                   Close Settings
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Profile;



import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Bell, 
  Settings, 
  Calendar, 
  Flame, 
  Target, 
  Trophy, 
  Users, 
  TrendingUp, 
  Clock,
  Share2,
  Camera,
  CheckCircle2,
  Download,
  Award,
  Activity,
  BarChart3,
  Home,
  LogOut,
  Sparkles,
  Target as TargetIcon2,
  Compass,
  MessageSquare,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  XCircle,
  Zap,
  ArrowRight,
  ExternalLink,
  User,
  Edit,
  MapPin,
  Mail,
  ChevronLeft,
  CheckCircle,
  X,
  Plus,
  Crown,
  Star,
  Heart,
  Brain,
  Lightbulb,
  TrendingDown,
  BarChart,
  PieChart,
  Activity as ActivityIcon,
  Target as TargetIcon,
  Award as AwardIcon,
  Users as UsersIcon,
  Eye,
  MessageCircle,
  Globe,
  FileText,
  Search,
  Mic,
  Shield,
  Zap as ZapIcon,
  CalendarDays,
  BrainCircuit,
  CloudRain,
  Sun,
  Moon,
  Wind,
  Droplets,
  Thermometer,
  AlertCircle,
  CheckSquare,
  XSquare,
  Flag,
  Timer,
  Target as TargetIcon3,
  EyeOff,
  MessageSquare as MessageSquareIcon,
  DollarSign,
  ChartBar,
  UserCheck,
  Users as UsersGroup,
  Briefcase,
  Coffee,
  BookOpen,
  Music,
  Dumbbell,
  Utensils,
  Smile,
  Frown,
  Meh,
  Activity as ActivityIcon2,
  Heart as HeartIcon,
  Brain as BrainIcon,
  Target as TargetIcon4,
  Award as AwardIcon2,
  Trophy as TrophyIcon,
  Crown as CrownIcon,
  Star as StarIcon,
  Zap as ZapIcon2,
  Flame as FlameIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Activity as ActivityIcon3,
  Target as TargetIcon5,
  Award as AwardIcon3,
  Users as UsersIcon2,
  Eye as EyeIcon,
  MessageCircle as MessageCircleIcon,
  Globe as GlobeIcon,
  FileText as FileTextIcon,
  Search as SearchIcon,
  Mic as MicIcon,
  Shield as ShieldIcon,
  Zap as ZapIcon3,
  CalendarDays as CalendarDaysIcon
} from 'lucide-react';

const Profile = ({ onNavigate }) => {
  // User State
  const [showAchievement, setShowAchievement] = useState(false);
  const [showSocialShareModal, setShowSocialShareModal] = useState(false);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [socialStats, setSocialStats] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [timeLeft, setTimeLeft] = useState('');
  const [profileEdit, setProfileEdit] = useState({
    displayName: '',
    bio: '',
    city: '',
    country: ''
  });
  const [newChallenge, setNewChallenge] = useState({
    name: '',
    description: '',
    duration: 7,
    type: 'mindset',
    difficulty: 'medium',
    rules: ['']
  });
  const [userChallenges, setUserChallenges] = useState([]);
  const [activeChallenges, setActiveChallenges] = useState([]);

  // CSS Styles matching Dashboard
  const styles = `
    /* Profile CSS matching dashboard styling */
    .profile-page {
      width: 100%;
      overflow-x: hidden;
      background: #050505;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
      position: relative;
      min-height: 100vh;
    }

    /* Background Effects */
    .profile-bg-grid {
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

    .profile-floating-elements {
      position: fixed;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    .profile-floating-element {
      position: absolute;
      border-radius: 50%;
      filter: blur(40px);
      opacity: 0.1;
      animation: float 20s infinite linear;
    }

    .profile-float-1 {
      width: 400px;
      height: 400px;
      background: linear-gradient(135deg, #22c55e, #3b82f6);
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .profile-float-2 {
      width: 300px;
      height: 300px;
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      top: 60%;
      right: 15%;
      animation-delay: -5s;
    }

    .profile-float-3 {
      width: 250px;
      height: 250px;
      background: linear-gradient(135deg, #fbbf24, #ef4444);
      bottom: 20%;
      left: 20%;
      animation-delay: -10s;
    }

    @keyframes float {
      0%, 100% {
        transform: translate(0, 0) rotate(0deg);
      }
      25% {
        transform: translate(50px, -50px) rotate(90deg);
      }
      50% {
        transform: translate(0, -100px) rotate(180deg);
      }
      75% {
        transform: translate(-50px, -50px) rotate(270deg);
      }
    }

    /* Glass Effect */
    .glass {
      backdrop-filter: blur(10px);
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Text Gradient */
    .text-gradient {
      background: linear-gradient(135deg, #00E5FF 0%, #7F00FF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Profile Navigation */
    .profile-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 50;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(15, 23, 42, 0.95);
    }

    .profile-nav-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .profile-nav-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .profile-nav-logo-text {
      font-size: 1.5rem;
      font-weight: 900;
      letter-spacing: -0.025em;
      text-transform: uppercase;
      font-style: italic;
    }

    .profile-nav-logo-highlight {
      color: #00E5FF;
    }

    .profile-nav-links {
      display: none;
    }

    @media (min-width: 768px) {
      .profile-nav-links {
        display: flex;
        align-items: center;
        gap: 2rem;
      }
    }

    .profile-nav-link {
      font-size: 0.625rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #71717a;
      transition: color 0.2s;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
    }

    .profile-nav-link:hover {
      color: white;
    }

    .profile-nav-button {
      padding: 0.5rem 1.5rem;
      background: #00E5FF;
      color: black;
      border-radius: 0.75rem;
      font-size: 0.75rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .profile-nav-button:hover {
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(0, 229, 255, 0.4);
    }

    .profile-nav-button:active {
      transform: scale(0.95);
    }

    /* User Profile Section */
    .user-profile-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      transition: all 0.2s;
    }

    .user-profile-header:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    .user-avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #00E5FF;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 700;
    }

    .user-status {
      font-size: 0.625rem;
      color: #22c55e;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    /* Profile Header */
    .profile-header {
      padding-top: 8rem;
      padding-bottom: 4rem;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      text-align: center;
      position: relative;
      z-index: 2;
    }

    @media (min-width: 768px) {
      .profile-header {
        text-align: left;
      }
    }

    .profile-header-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .profile-welcome {
      font-size: 4rem;
      font-weight: 900;
      letter-spacing: -0.025em;
      line-height: 1;
      margin-bottom: 1.5rem;
      text-transform: uppercase;
      font-style: italic;
    }

    .profile-subtitle {
      font-size: 1.25rem;
      color: #a1a1aa;
      max-width: 600px;
      line-height: 1.75;
      font-weight: 300;
    }

    /* Main Grid */
    .profile-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1.5rem 4rem;
      position: relative;
      z-index: 2;
    }

    @media (min-width: 1024px) {
      .profile-grid {
        grid-template-columns: 2fr 1fr;
      }
    }

    /* Main Content */
    .profile-main-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    /* Profile Hero */
    .profile-hero {
      padding: 3rem;
      border-radius: 3rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), transparent, rgba(127, 0, 255, 0.1));
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      position: relative;
      overflow: hidden;
    }

    @media (min-width: 768px) {
      .profile-hero {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .profile-visual {
      position: relative;
      text-align: center;
    }

    .profile-avatar-large {
      width: 160px;
      height: 160px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid rgba(0, 229, 255, 0.2);
      margin: 0 auto;
    }

    .streak-badge {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 1.25rem;
      border: 3px solid #050505;
    }

    .profile-info {
      flex: 1;
      text-align: center;
    }

    @media (min-width: 768px) {
      .profile-info {
        text-align: left;
      }
    }

    .profile-name {
      font-size: 2rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.025em;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #00E5FF 0%, #7F00FF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .profile-bio {
      color: #71717a;
      font-size: 1rem;
      font-weight: 300;
      line-height: 1.75;
      margin-bottom: 2rem;
      max-width: 400px;
    }

    .profile-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #a1a1aa;
    }

    .profile-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    @media (min-width: 768px) {
      .profile-actions {
        flex-direction: row;
      }
    }

    .profile-button {
      padding: 1rem 2rem;
      border-radius: 1rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: 0.75rem;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .profile-button:hover {
      transform: scale(1.05);
    }

    .profile-button:active {
      transform: scale(0.95);
    }

    .button-primary {
      background: #00E5FF;
      color: black;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .button-primary:hover {
      background: rgba(0, 229, 255, 0.9);
    }

    .button-secondary {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
    }

    .button-secondary:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    @media (min-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .stat-card {
      padding: 2rem;
      border-radius: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      transition: all 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(0, 229, 255, 0.2);
    }

    .stat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .stat-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 229, 255, 0.1);
      color: #00E5FF;
      border: 1px solid rgba(0, 229, 255, 0.2);
    }

    .stat-change {
      font-size: 0.625rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 900;
      margin-bottom: 0.5rem;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.625rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #71717a;
    }

    .stat-description {
      font-size: 0.75rem;
      color: #a1a1aa;
      margin-top: 0.5rem;
    }

    /* Tabs */
    .profile-tabs {
      display: flex;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 1rem;
      padding: 0.5rem;
      margin-bottom: 2rem;
    }

    .profile-tab {
      flex: 1;
      padding: 1rem 1.5rem;
      border: none;
      background: transparent;
      color: #71717a;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: 0.75rem;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .profile-tab:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }

    .profile-tab.active {
      color: white;
      background: rgba(0, 229, 255, 0.2);
      border: 1px solid rgba(0, 229, 255, 0.3);
    }

    /* Activity Feed */
    .activity-section {
      padding: 2.5rem;
      border-radius: 3rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.025em;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .view-all-button {
      font-size: 0.625rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #71717a;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      transition: color 0.2s;
    }

    .view-all-button:hover {
      color: white;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      border-radius: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.01);
      transition: all 0.3s;
    }

    .activity-item:hover {
      background: rgba(255, 255, 255, 0.03);
      transform: translateX(5px);
    }

    .activity-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 229, 255, 0.1);
      color: #00E5FF;
    }

    .activity-content {
      flex: 1;
    }

    .activity-action {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .activity-time {
      font-size: 0.75rem;
      color: #71717a;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .activity-meta {
      padding: 0.5rem 1rem;
      border-radius: 0.75rem;
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
      font-size: 0.75rem;
      font-weight: 700;
      white-space: nowrap;
    }

    /* Challenges Section */
    .challenges-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1rem;
    }

    @media (min-width: 768px) {
      .challenges-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .challenge-card {
      padding: 2rem;
      border-radius: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.01);
      transition: all 0.3s;
      cursor: pointer;
    }

    .challenge-card:hover {
      background: rgba(255, 255, 255, 0.03);
      transform: translateY(-5px);
    }

    .challenge-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .challenge-type {
      font-size: 0.625rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
    }

    .type-mindset {
      background: rgba(139, 92, 246, 0.1);
      color: #8b5cf6;
    }

    .type-business {
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
    }

    .type-emotional {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .challenge-title {
      font-size: 1.25rem;
      font-weight: 900;
      margin-bottom: 1rem;
    }

    .challenge-description {
      color: #71717a;
      font-size: 0.875rem;
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }

    .challenge-rules {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .rule-item {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #a1a1aa;
    }

    .rule-icon {
      color: #00E5FF;
      flex-shrink: 0;
      margin-top: 0.125rem;
    }

    .challenge-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .challenge-duration {
      font-size: 0.75rem;
      color: #71717a;
    }

    /* Create Challenge Modal */
    .create-challenge-modal {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }

    .create-challenge-content {
      width: 100%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 3rem;
      border-radius: 3rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(15, 23, 42, 0.95);
      position: relative;
    }

    .modal-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .modal-title {
      font-size: 2rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.025em;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .modal-subtitle {
      color: #71717a;
      font-size: 1rem;
    }

    .form-group {
      margin-bottom: 2rem;
    }

    .form-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #71717a;
      margin-bottom: 0.75rem;
    }

    .form-input {
      width: 100%;
      padding: 1rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #00E5FF;
      background: rgba(0, 229, 255, 0.05);
    }

    .form-select {
      width: 100%;
      padding: 1rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 0.875rem;
      transition: all 0.2s;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      background-size: 1rem;
    }

    .form-select:focus {
      outline: none;
      border-color: #00E5FF;
      background: rgba(0, 229, 255, 0.05);
    }

    .form-textarea {
      width: 100%;
      padding: 1rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 0.875rem;
      transition: all 0.2s;
      resize: vertical;
      min-height: 100px;
    }

    .form-textarea:focus {
      outline: none;
      border-color: #00E5FF;
      background: rgba(0, 229, 255, 0.05);
    }

    .rule-input-group {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .add-rule-button {
      padding: 0.5rem 1rem;
      border-radius: 0.75rem;
      background: rgba(0, 229, 255, 0.1);
      border: 1px solid rgba(0, 229, 255, 0.2);
      color: #00E5FF;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .add-rule-button:hover {
      background: rgba(0, 229, 255, 0.2);
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    /* Sidebar */
    .profile-sidebar {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    /* Quick Actions */
    .quick-actions-section {
      padding: 2.5rem;
      border-radius: 3rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .quick-action-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      border-radius: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.01);
      cursor: pointer;
      transition: all 0.3s;
    }

    .quick-action-button:hover {
      background: rgba(255, 255, 255, 0.03);
      transform: scale(1.05);
      border-color: rgba(0, 229, 255, 0.2);
    }

    .quick-action-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 229, 255, 0.1);
      color: #00E5FF;
    }

    .quick-action-label {
      font-size: 0.625rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      text-align: center;
      color: #71717a;
    }

    /* Achievements */
    .achievements-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .achievement-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 1.5rem;
      border-radius: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.01);
      cursor: pointer;
      transition: all 0.3s;
    }

    .achievement-card:hover {
      background: rgba(251, 191, 36, 0.05);
      transform: scale(1.05);
      border-color: rgba(251, 191, 36, 0.2);
    }

    .achievement-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .achievement-name {
      font-size: 0.875rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    .achievement-earned {
      font-size: 0.625rem;
      color: #71717a;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 0.5rem;
    }

    .achievement-description {
      font-size: 0.75rem;
      color: #a1a1aa;
    }

    /* Performance Insights */
    .performance-section {
      padding: 2.5rem;
      border-radius: 3rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: linear-gradient(135deg, rgba(127, 0, 255, 0.1), transparent);
    }

    /* Social Stats */
    .social-stats-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .social-stat-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      border-radius: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.01);
    }

    .social-stat-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .social-stat-content {
      flex: 1;
    }

    .social-stat-platform {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .social-stat-metrics {
      display: flex;
      gap: 1rem;
      font-size: 0.75rem;
      color: #71717a;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }

    .modal-content {
      width: 100%;
      max-width: 600px;
      padding: 3rem;
      border-radius: 3rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(15, 23, 42, 0.95);
      position: relative;
    }

    .modal-close {
      position: absolute;
      top: 2rem;
      right: 2rem;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.75rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .modal-close:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.3);
    }

    /* Loading Skeleton */
    .loading-skeleton {
      background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 1rem;
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #71717a;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1.5rem;
      opacity: 0.5;
    }

    .empty-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: white;
    }

    .empty-description {
      font-size: 0.875rem;
      max-width: 300px;
      margin: 0 auto 1.5rem;
      line-height: 1.5;
    }
  `;

  // Navigation function
  const navigateTo = (page) => {
    if (onNavigate && typeof onNavigate === 'function') {
      onNavigate(page);
    } else {
      switch(page) {
        case 'dashboard':
          window.location.href = '/dashboard';
          break;
        case 'verify':
          window.location.href = '/verify';
          break;
        case 'leaderboard':
          window.location.href = '/leaderboard';
          break;
        case 'challenges':
          window.location.href = '/challenges';
          break;
        case 'chat':
          window.location.href = '/chat';
          break;
        case 'settings':
          window.location.href = '/settings';
          break;
        case 'auth':
          window.location.href = '/auth';
          break;
        default:
          console.log('Navigating to:', page);
      }
    }
  };

  // Load REAL user data from localStorage (same as Dashboard)
  const loadUserData = () => {
    try {
      const storedUser = localStorage.getItem('touchgrass_user');
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log('Loaded user from localStorage:', user);
        return user;
      }
      
      const authState = localStorage.getItem('authState');
      if (authState) {
        const auth = JSON.parse(authState);
        if (auth.isAuthenticated && auth.user) {
          const newUser = {
            id: auth.user.id || Date.now().toString(),
            username: auth.user.username,
            displayName: auth.user.displayName || auth.user.username,
            email: auth.user.email || `${auth.user.username}@example.com`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.user.username}`,
            location: auth.user.location || { city: 'Online', country: 'Internet' },
            bio: auth.user.bio || `Building daily discipline through outdoor accountability.`,
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
          };
          
          console.log('Created new user from auth:', newUser);
          localStorage.setItem('touchgrass_user', JSON.stringify(newUser));
          return newUser;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  };

  // Load user's streak data (same as Dashboard)
  const loadStreakData = (username) => {
    try {
      const streakKey = `touchgrass_streak_${username}`;
      const storedStreak = localStorage.getItem(streakKey);
      
      if (storedStreak) {
        const streak = JSON.parse(storedStreak);
        console.log('Loaded streak data:', streak);
        return streak;
      }
      
      const newStreak = {
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        totalOutdoorTime: 0,
        shameDays: 0,
        challengeWins: 0,
        history: [],
        startDate: new Date().toISOString(),
        todayVerified: false,
        shareCount: 0,
        viralScore: 0,
        lastVerification: null
      };
      
      console.log('Created new streak:', newStreak);
      localStorage.setItem(streakKey, JSON.stringify(newStreak));
      return newStreak;
    } catch (error) {
      console.error('Error loading streak data:', error);
      return null;
    }
  };

  // Load user's challenges
  const loadUserChallenges = (username) => {
    try {
      const challengesKey = `touchgrass_challenges_${username}`;
      const storedChallenges = localStorage.getItem(challengesKey);
      
      if (storedChallenges) {
        const challenges = JSON.parse(storedChallenges);
        console.log('Loaded user challenges:', challenges);
        return challenges;
      }
      
      const defaultChallenges = [
        {
          id: 1,
          name: "Daily Outdoor Verification",
          type: "mindset",
          description: "Verify that you've spent time outdoors every day",
          duration: "ongoing",
          progress: 75,
          rules: ["Spend at least 15 minutes outdoors", "Take a photo as proof", "No excuses allowed"],
          difficulty: "medium",
          createdAt: new Date().toISOString(),
          isActive: true
        }
      ];
      
      console.log('Created default challenges:', defaultChallenges);
      localStorage.setItem(challengesKey, JSON.stringify(defaultChallenges));
      return defaultChallenges;
    } catch (error) {
      console.error('Error loading challenges:', error);
      return [];
    }
  };

  // Save user challenges
  const saveUserChallenges = (username, challenges) => {
    try {
      const challengesKey = `touchgrass_challenges_${username}`;
      localStorage.setItem(challengesKey, JSON.stringify(challenges));
      console.log('Saved challenges:', challenges);
    } catch (error) {
      console.error('Error saving challenges:', error);
    }
  };

  // Save streak data (same as Dashboard)
  const saveStreakData = (username, streakData) => {
    try {
      const streakKey = `touchgrass_streak_${username}`;
      localStorage.setItem(streakKey, JSON.stringify(streakData));
      console.log('Saved streak data:', streakData);
    } catch (error) {
      console.error('Error saving streak data:', error);
    }
  };

  // Update user profile
  const updateUserProfile = (updatedData) => {
    try {
      const storedUser = localStorage.getItem('touchgrass_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const updatedUser = {
          ...user,
          ...updatedData,
          lastActive: new Date().toISOString()
        };
        
        localStorage.setItem('touchgrass_user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
        
        toast.success('Profile updated successfully!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return false;
    }
  };

  // Check if user verified today (same as Dashboard)
  const checkTodayVerified = (streakData) => {
    if (!streakData || !streakData.history) return false;
    
    const today = new Date().toDateString();
    
    return streakData.history.some(entry => {
      if (!entry.date) return false;
      try {
        const entryDate = new Date(entry.date);
        return entryDate.toDateString() === today && entry.verified === true;
      } catch (e) {
        return false;
      }
    });
  };

  // Calculate time left for today's verification (same as Dashboard)
  const calculateTimeLeft = () => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const difference = endOfDay - now;
    
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Format time ago (same as Dashboard)
  const timeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval}y ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval}mo ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval}d ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval}h ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval}m ago`;
    
    return 'Just now';
  };

  // Initialize profile data
  const initializeProfile = async () => {
    setIsLoading(true);
    
    try {
      const user = loadUserData();
      
      if (!user) {
        toast.error('Please login to view your profile');
        setTimeout(() => navigateTo('auth'), 1500);
        return;
      }
      
      setUserData(user);
      
      const streakData = loadStreakData(user.username);
      const userChallengesData = loadUserChallenges(user.username);
      
      // Update today's verification status
      streakData.todayVerified = checkTodayVerified(streakData);
      saveStreakData(user.username, streakData);
      
      // Calculate days since join
      const joinDate = new Date(user.createdAt || new Date());
      const now = new Date();
      const daysSinceJoin = Math.max(1, Math.floor((now - joinDate) / (1000 * 60 * 60 * 24)));
      
      // Calculate consistency
      const consistency = streakData.totalDays > 0 
        ? Math.min(100, Math.round((streakData.totalDays / daysSinceJoin) * 100))
        : 0;
      
      // Prepare stats
      const calculatedStats = [
        {
          id: 1,
          title: "Current Streak",
          value: streakData.currentStreak,
          change: streakData.todayVerified ? "+1" : "0",
          description: "Consecutive verified days",
          icon: <Flame size={24} />
        },
        {
          id: 2,
          title: "Total Time Outside",
          value: `${Math.floor(streakData.totalOutdoorTime / 60) || 0}h`,
          change: "+12%",
          description: "Time spent touching grass",
          icon: <Clock size={24} />
        },
        {
          id: 3,
          title: "Consistency",
          value: `${consistency}%`,
          change: consistency > 50 ? "+5%" : "0%",
          description: "Verification rate",
          icon: <Target size={24} />
        },
        {
          id: 4,
          title: "Challenges",
          value: userChallengesData.length,
          change: "+2",
          description: "Active challenges",
          icon: <TargetIcon2 size={24} />
        },
        {
          id: 5,
          title: "Social Score",
          value: streakData.viralScore || 0,
          change: "+8%",
          description: "Impact on community",
          icon: <TrendingUp size={24} />
        },
        {
          id: 6,
          title: "Global Rank",
          value: `#${Math.floor(Math.random() * 1000) + 1}`,
          change: streakData.currentStreak > 0 ? "↑12" : "0",
          description: "Out of 50k users",
          icon: <Users size={24} />
        }
      ];

      // Prepare activities
      const recentActivities = [];
      
      if (streakData.todayVerified) {
        recentActivities.push({
          id: 1,
          action: "Verified today's outdoor time",
          time: 'Just now',
          icon: <CheckCircle2 size={20} />,
          meta: '+1 day'
        });
      }
      
      if (streakData.history && streakData.history.length > 0) {
        const recentHistory = streakData.history.slice(-3).reverse();
        recentHistory.forEach((entry, index) => {
          if (index === 0 && streakData.todayVerified) return;
          
          const timeText = timeAgo(entry.date);
          recentActivities.push({
            id: recentActivities.length + 1,
            action: `Verified ${entry.activity || 'outdoor time'}`,
            time: timeText,
            icon: <CheckCircle2 size={20} />,
            meta: `+${entry.duration || 30}min`
          });
        });
      }
      
      if (streakData.shareCount > 0) {
        recentActivities.push({
          id: recentActivities.length + 1,
          action: 'Shared achievement on social media',
          time: '4 hours ago',
          icon: <Share2 size={20} />,
          meta: `+${streakData.shareCount} shares`
        });
      }

      // Set social stats
      const socialPlatforms = [
        {
          id: 1,
          platform: "Twitter",
          icon: <Twitter size={20} />,
          color: "rgba(29, 161, 242, 0.2)",
          metrics: `${Math.min(streakData.shareCount, 24)} Shares • 1.2K Views`
        },
        {
          id: 2,
          platform: "LinkedIn",
          icon: <Linkedin size={20} />,
          color: "rgba(0, 119, 181, 0.2)",
          metrics: `${Math.min(streakData.shareCount, 18)} Shares • 420 Views`
        },
        {
          id: 3,
          platform: "Instagram",
          icon: <Instagram size={20} />,
          color: "rgba(225, 48, 108, 0.2)",
          metrics: `${Math.min(streakData.shareCount, 12)} Shares • 780 Likes`
        }
      ];

      // Set predefined challenges (from your list)
      const predefinedChallenges = [
        {
          id: 1,
          name: "No Complaining / No Excuses Week",
          type: "mindset",
          description: "For 7 days, ban all complaints and excuses. Every time you catch yourself, state one actionable step to improve the situation.",
          duration: 7,
          rules: [
            "No complaining about anything",
            "No excuses for not completing tasks",
            "When you slip, state one actionable improvement step",
            "Track slips in a journal"
          ],
          difficulty: "hard",
          icon: "🧠"
        },
        {
          id: 2,
          name: "First Principles Week",
          type: "mindset",
          description: "For every major problem or assumption, break it down to fundamental truths and rebuild from there.",
          duration: 7,
          rules: [
            "Question everything 'why' at least 5 times",
            "Break down 3 major assumptions daily",
            "Rebuild solutions from first principles",
            "Document insights"
          ],
          difficulty: "medium",
          icon: "🔍"
        },
        {
          id: 3,
          name: "Emotional Weather Report",
          type: "emotional",
          description: "Three times daily, pause and name your emotional state with one word. No judgment, just observation.",
          duration: 30,
          rules: [
            "Morning, afternoon, evening check-ins",
            "One-word emotional state",
            "No judgment or analysis",
            "Track patterns weekly"
          ],
          difficulty: "easy",
          icon: "⛅"
        },
        {
          id: 4,
          name: "Deliberate Discomfort Daily",
          type: "mindset",
          description: "Do one thing daily that pushes you slightly outside your comfort zone, especially socially.",
          duration: "ongoing",
          rules: [
            "One uncomfortable action daily",
            "Focus on social situations",
            "Document your fears and outcomes",
            "Increase difficulty weekly"
          ],
          difficulty: "medium",
          icon: "🚀"
        },
        {
          id: 5,
          name: "10 Customer Calls Challenge",
          type: "business",
          description: "Every week, have 10 conversations with potential or current users. No selling, just ask 'Why?' and 'Tell me more.'",
          duration: "weekly",
          rules: [
            "10 conversations weekly",
            "No selling allowed",
            "Focus on understanding needs",
            "Document all insights"
          ],
          difficulty: "hard",
          icon: "📞"
        },
        {
          id: 6,
          name: "Perfect Week Role Play",
          type: "business",
          description: "Spend one week living exactly as your ideal customer does. Use their tools, read their forums, follow their routines.",
          duration: 7,
          rules: [
            "Live as your customer for a week",
            "Use their tools and platforms",
            "Follow their daily routines",
            "Develop empathy insights"
          ],
          difficulty: "hard",
          icon: "🎭"
        },
        {
          id: 7,
          name: "Fake Door Test",
          type: "business",
          description: "Create a mock-up or button for a feature and see how many people try to access it. Validate demand with zero code.",
          duration: 14,
          rules: [
            "Create feature mock-up",
            "Add 'coming soon' button",
            "Track clicks and interest",
            "Survey interested users"
          ],
          difficulty: "medium",
          icon: "🚪"
        },
        {
          id: 8,
          name: "Competitor Love Letter",
          type: "business",
          description: "Write a detailed analysis of your top competitor, listing everything they do better than you.",
          duration: 3,
          rules: [
            "Analyze top competitor",
            "List everything they do better",
            "Identify opportunity gaps",
            "Create improvement plan"
          ],
          difficulty: "easy",
          icon: "💌"
        }
      ];

      // Prepare achievements
      const userAchievements = [];
      if (streakData.currentStreak >= 7) {
        userAchievements.push({
          id: 1,
          name: "Weekly Warrior",
          icon: "🔥",
          earned: "Today",
          description: "7 consecutive days"
        });
      }
      if (streakData.shareCount >= 10) {
        userAchievements.push({
          id: 2,
          name: "Social Butterfly",
          icon: "🦋",
          earned: "2 days ago",
          description: "shares"
        });
      }
      if (streakData.totalDays >= 30) {
        userAchievements.push({
          id: 3,
          name: "Monthly Master",
          icon: "🌟",
          earned: "This month",
          description: "30-day streak"
        });
      }
      if (streakData.totalDays >= 100) {
        userAchievements.push({
          id: 4,
          name: "Century Club",
          icon: "💯",
          earned: "Achieved",
          description: "100 total days"
        });
      }

      setStats(calculatedStats);
      setActivities(recentActivities);
      setSocialStats(socialPlatforms);
      setChallenges(predefinedChallenges);
      setUserChallenges(userChallengesData);
      setAchievements(userAchievements);
      
      // Set active challenges (from user's challenges)
      setActiveChallenges(userChallengesData.filter(challenge => challenge.isActive));
      
      console.log('Profile initialized with real data:', { user, streakData, userChallengesData });
      
    } catch (error) {
      console.error('Error initializing profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle create challenge
  const handleCreateChallenge = () => {
    if (!userData) {
      toast.error('Please login to create a challenge');
      return;
    }
    
    if (!newChallenge.name.trim() || !newChallenge.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const challenge = {
      id: Date.now(),
      name: newChallenge.name,
      type: newChallenge.type,
      description: newChallenge.description,
      duration: newChallenge.duration,
      rules: newChallenge.rules.filter(rule => rule.trim()),
      difficulty: newChallenge.difficulty,
      createdAt: new Date().toISOString(),
      isActive: true,
      createdBy: userData.username
    };
    
    const updatedChallenges = [...userChallenges, challenge];
    saveUserChallenges(userData.username, updatedChallenges);
    setUserChallenges(updatedChallenges);
    setActiveChallenges(updatedChallenges.filter(c => c.isActive));
    
    setNewChallenge({
      name: '',
      description: '',
      duration: 7,
      type: 'mindset',
      difficulty: 'medium',
      rules: ['']
    });
    
    setShowCreateChallenge(false);
    toast.success('Challenge created successfully!');
  };

  // Handle join challenge
  const handleJoinChallenge = (challenge) => {
    if (!userData) {
      toast.error('Please login to join challenges');
      return;
    }
    
    const joinedChallenge = {
      ...challenge,
      id: Date.now(),
      joinedAt: new Date().toISOString(),
      isActive: true,
      progress: 0,
      userId: userData.username
    };
    
    const updatedChallenges = [...userChallenges, joinedChallenge];
    saveUserChallenges(userData.username, updatedChallenges);
    setUserChallenges(updatedChallenges);
    setActiveChallenges(updatedChallenges.filter(c => c.isActive));
    
    toast.success(`Joined "${challenge.name}" challenge!`);
  };

  // Handle share profile
  const handleShareProfile = (platform) => {
    if (!userData) {
      toast.error('Please login to share');
      return;
    }
    
    const streakData = loadStreakData(userData.username);
    const shareUrl = `${window.location.origin}/profile`;
    
    const shareTexts = {
      twitter: `👤 ${userData.displayName}'s TouchGrass Profile - ${streakData.currentStreak}-day streak! Check out my progress: ${shareUrl} #TouchGrass #Streak #Profile`,
      linkedin: `${userData.displayName}'s TouchGrass Profile - Building discipline through daily outdoor verification. ${streakData.currentStreak}-day streak and counting! ${shareUrl}`,
      facebook: `Check out my TouchGrass profile! ${streakData.currentStreak}-day streak of outdoor discipline. ${shareUrl}`,
      instagram: `👤 My TouchGrass Profile 📊\n${streakData.currentStreak}-day streak\nJoin me in building real-world discipline!\n${shareUrl}\n#TouchGrass #Discipline #Streak`
    };

    const shareConfigs = {
      twitter: {
        url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTexts.twitter)}&url=${encodeURIComponent(shareUrl)}`,
        name: 'Twitter'
      },
      linkedin: {
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        name: 'LinkedIn'
      },
      facebook: {
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTexts.facebook)}`,
        name: 'Facebook'
      }
    };

    const config = shareConfigs[platform];
    if (!config) {
      if (platform === 'instagram') {
        toast('📸 For Instagram: Take a screenshot of your profile and share it as a story!', {
          icon: '📸',
          duration: 4000
        });
        return;
      } else if (platform === 'copy') {
        navigator.clipboard.writeText(shareUrl);
        toast.success('Profile link copied to clipboard!');
        return;
      }
      return;
    }

    window.open(config.url, '_blank', 'width=600,height=400');
    toast.success(`Shared to ${config.name}!`);
  };

  // Handle edit profile
  const handleEditProfile = () => {
    if (!userData) return;
    
    setProfileEdit({
      displayName: userData.displayName || '',
      bio: userData.bio || '',
      city: userData.location?.city || '',
      country: userData.location?.country || ''
    });
  };

  // Save profile edits
  const saveProfileEdits = () => {
    if (!userData) return;
    
    const updatedData = {
      displayName: profileEdit.displayName || userData.displayName,
      bio: profileEdit.bio || userData.bio,
      location: {
        city: profileEdit.city || userData.location?.city || 'Online',
        country: profileEdit.country || userData.location?.country || 'Internet'
      }
    };
    
    if (updateUserProfile(updatedData)) {
      setProfileEdit({
        displayName: '',
        bio: '',
        city: '',
        country: ''
      });
    }
  };

  // Quick actions
  const quickActions = [
    {
      id: 1,
      label: "Dashboard",
      icon: <Home size={24} />,
      action: () => navigateTo('dashboard')
    },
    {
      id: 2,
      label: "Verify",
      icon: <Camera size={24} />,
      action: () => navigateTo('verify')
    },
    {
      id: 3,
      label: "Challenges",
      icon: <TargetIcon2 size={24} />,
      action: () => navigateTo('challenges')
    },
    {
      id: 4,
      label: "Share",
      icon: <Share2 size={24} />,
      action: () => setShowSocialShareModal(true)
    }
  ];

  // Initialize profile on mount
  useEffect(() => {
    initializeProfile();
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  if (isLoading && !userData) {
    return (
      <div className="profile-page">
        <style>{styles}</style>
        
        <div className="profile-bg-grid"></div>
        <div className="profile-floating-elements">
          <div className="profile-floating-element profile-float-1"></div>
          <div className="profile-floating-element profile-float-2"></div>
          <div className="profile-floating-element profile-float-3"></div>
        </div>

        <nav className="profile-nav glass">
          <div className="profile-nav-container">
            <div className="profile-nav-logo">
              <div className="profile-nav-logo-text">
                Touch<span className="profile-nav-logo-highlight">Grass</span>
              </div>
            </div>
            
            <div className="profile-nav-button loading-skeleton" style={{ width: '120px', height: '40px' }}></div>
          </div>
        </nav>

        <div className="profile-header">
          <div className="profile-header-container">
            <div className="loading-skeleton" style={{ height: '80px', width: '400px', marginBottom: '1.5rem', margin: '0 auto' }}></div>
            <div className="loading-skeleton" style={{ height: '30px', width: '600px', margin: '0 auto' }}></div>
          </div>
        </div>

        <div className="profile-grid">
          <div className="profile-main-content">
            <div className="loading-skeleton" style={{ height: '300px', borderRadius: '3rem' }}></div>
            <div className="loading-skeleton" style={{ height: '400px', borderRadius: '3rem' }}></div>
          </div>
          <div className="profile-sidebar">
            <div className="loading-skeleton" style={{ height: '300px', borderRadius: '3rem' }}></div>
            <div className="loading-skeleton" style={{ height: '300px', borderRadius: '3rem' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const streakData = userData ? loadStreakData(userData.username) : null;

  return (
    <div className="profile-page">
      <style>{styles}</style>
      
      {/* Background Effects */}
      <div className="profile-bg-grid"></div>
      <div className="profile-floating-elements">
        <div className="profile-floating-element profile-float-1"></div>
        <div className="profile-floating-element profile-float-2"></div>
        <div className="profile-floating-element profile-float-3"></div>
      </div>

      {/* Navigation */}
      <nav className="profile-nav glass">
        <div className="profile-nav-container">
          <button 
            className="profile-nav-logo"
            onClick={() => navigateTo('dashboard')}
          >
            <div className="profile-nav-logo-text">
              Touch<span className="profile-nav-logo-highlight">Grass</span>
            </div>
          </button>
          
          <div className="profile-nav-links">
            <button className="profile-nav-link" onClick={() => navigateTo('verify')}>
              Verify
            </button>
            <button className="profile-nav-link" onClick={() => navigateTo('challenges')}>
              Challenges
            </button>
            <button className="profile-nav-link" onClick={() => navigateTo('leaderboard')}>
              Leaderboard
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="time-counter">
              <Clock size={16} />
              <span className="time-label">Time Left</span>
              <span className="time-value">{timeLeft || '23:59:59'}</span>
            </div>
            
            {userData && (
              <div className="user-profile-header">
                <img 
                  src={userData.avatar} 
                  alt={userData.displayName}
                  className="user-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`;
                  }}
                />
                <div className="user-info">
                  <div className="user-name">{userData.displayName}</div>
                  <div className="user-status">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Online
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="profile-header">
        <div className="profile-header-container">
          <h1 className="profile-welcome text-gradient">
            {userData ? `${userData.displayName}'s Profile` : 'Your Profile'}
          </h1>
          <p className="profile-subtitle">
            {userData ? 
              `Track your progress, manage challenges, and build lasting discipline. ${
                streakData?.currentStreak > 0 
                  ? `${streakData.currentStreak}-day streak strong!`
                  : 'Start your journey today!'
              }` 
              : 'Create an account to start building discipline through daily accountability.'}
          </p>
        </div>
      </header>

      {/* Main Grid */}
      <main className="profile-grid">
        {/* Left Column - Main Content */}
        <div className="profile-main-content">
          {/* Profile Hero */}
          <section className="profile-hero glass">
            <div className="profile-visual">
              <img 
                src={userData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.username || 'user'}`}
                alt={userData?.displayName || 'User'}
                className="profile-avatar-large"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.username || 'user'}`;
                }}
              />
              {streakData?.currentStreak > 0 && (
                <div className="streak-badge">
                  {streakData.currentStreak}
                </div>
              )}
            </div>
            
            <div className="profile-info">
              <h2 className="profile-name">{userData?.displayName || 'User'}</h2>
              
              <div className="profile-meta">
                <div className="meta-item">
                  <User size={16} />
                  @{userData?.username || 'username'}
                </div>
                <div className="meta-item">
                  <MapPin size={16} />
                  {userData?.location?.city || 'Online'}, {userData?.location?.country || 'Internet'}
                </div>
                <div className="meta-item">
                  <Calendar size={16} />
                  Joined {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}
                </div>
              </div>
              
              <p className="profile-bio">
                {userData?.bio || 'No bio yet. Click edit to add your personal journey...'}
              </p>
              
              <div className="profile-actions">
                <button 
                  className="profile-button button-primary"
                  onClick={handleEditProfile}
                >
                  <Edit size={20} />
                  Edit Profile
                </button>
                
                <button 
                  className="profile-button button-secondary"
                  onClick={() => setShowSocialShareModal(true)}
                >
                  <Share2 size={20} />
                  Share Profile
                </button>
                
                <button 
                  className="profile-button button-secondary"
                  onClick={() => setShowCreateChallenge(true)}
                >
                  <Plus size={20} />
                  Create Challenge
                </button>
              </div>
            </div>
          </section>

          {/* Tabs */}
          <div className="profile-tabs">
            <button 
              className={`profile-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Activity size={16} />
              Overview
            </button>
            <button 
              className={`profile-tab ${activeTab === 'challenges' ? 'active' : ''}`}
              onClick={() => setActiveTab('challenges')}
            >
              <TargetIcon2 size={16} />
              Challenges
            </button>
            <button 
              className={`profile-tab ${activeTab === 'achievements' ? 'active' : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              <Award size={16} />
              Achievements
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <section>
                <div className="section-header">
                  <h2 className="section-title">
                    <BarChart3 size={24} />
                    Your Stats
                  </h2>
                </div>
                
                <div className="stats-grid">
                  {stats.map(stat => (
                    <div key={stat.id} className="stat-card glass">
                      <div className="stat-header">
                        <div className="stat-icon">
                          {stat.icon}
                        </div>
                        <span className="stat-change">{stat.change}</span>
                      </div>
                      
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.title}</div>
                      <div className="stat-description">{stat.description}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Recent Activity */}
              <section className="activity-section glass">
                <div className="section-header">
                  <h2 className="section-title">
                    <Clock size={24} />
                    Recent Activity
                  </h2>
                  <button className="view-all-button">
                    View All
                  </button>
                </div>
                
                <div className="activity-list">
                  {activities.length > 0 ? (
                    activities.map(activity => (
                      <div key={activity.id} className="activity-item glass">
                        <div className="activity-icon">
                          {activity.icon}
                        </div>
                        
                        <div className="activity-content">
                          <div className="activity-action">{activity.action}</div>
                          <div className="activity-time">{activity.time}</div>
                        </div>
                        
                        <div className="activity-meta">
                          {activity.meta}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">📝</div>
                      <div className="empty-title">No Activity Yet</div>
                      <p className="empty-description">Start verifying your outdoor time to see activity here.</p>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          {activeTab === 'challenges' && (
            <>
              {/* Active Challenges */}
              <section className="activity-section glass">
                <div className="section-header">
                  <h2 className="section-title">
                    <TargetIcon2 size={24} />
                    Your Challenges
                  </h2>
                  <button 
                    className="profile-button button-secondary"
                    onClick={() => setShowCreateChallenge(true)}
                    style={{ padding: '0.75rem 1.5rem' }}
                  >
                    <Plus size={16} />
                    Create New
                  </button>
                </div>
                
                {activeChallenges.length > 0 ? (
                  <div className="challenges-grid">
                    {activeChallenges.map(challenge => (
                      <div key={challenge.id} className="challenge-card glass">
                        <div className="challenge-header">
                          <span className={`challenge-type type-${challenge.type}`}>
                            {challenge.type}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#71717a' }}>
                            {challenge.difficulty}
                          </span>
                        </div>
                        
                        <h3 className="challenge-title">{challenge.name}</h3>
                        <p className="challenge-description">{challenge.description}</p>
                        
                        <div className="challenge-rules">
                          {challenge.rules?.slice(0, 3).map((rule, index) => (
                            <div key={index} className="rule-item">
                              <CheckCircle size={12} className="rule-icon" />
                              <span>{rule}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="challenge-footer">
                          <div className="challenge-duration">
                            {challenge.duration === 'ongoing' ? 'Ongoing' : `${challenge.duration} days`}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#00E5FF' }}>
                            {challenge.progress || 0}% complete
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">🎯</div>
                    <div className="empty-title">No Active Challenges</div>
                    <p className="empty-description">Create or join challenges to build discipline.</p>
                    <button 
                      className="profile-button button-secondary"
                      onClick={() => setShowCreateChallenge(true)}
                      style={{ marginTop: '1rem' }}
                    >
                      <Plus size={16} />
                      Create Your First Challenge
                    </button>
                  </div>
                )}
              </section>

              {/* Available Challenges */}
              <section className="activity-section glass">
                <div className="section-header">
                  <h2 className="section-title">
                    <Compass size={24} />
                    Available Challenges
                  </h2>
                </div>
                
                <div className="challenges-grid">
                  {challenges.map(challenge => (
                    <div key={challenge.id} className="challenge-card glass">
                      <div className="challenge-header">
                        <span className={`challenge-type type-${challenge.type}`}>
                          {challenge.type}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#71717a' }}>
                          {challenge.difficulty}
                        </span>
                      </div>
                      
                      <h3 className="challenge-title">{challenge.name}</h3>
                      <p className="challenge-description">{challenge.description}</p>
                      
                      <div className="challenge-rules">
                        {challenge.rules?.slice(0, 3).map((rule, index) => (
                          <div key={index} className="rule-item">
                            <CheckCircle size={12} className="rule-icon" />
                            <span>{rule}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="challenge-footer">
                        <div className="challenge-duration">
                          {challenge.duration === 'ongoing' ? 'Ongoing' : `${challenge.duration} days`}
                        </div>
                        <button 
                          className="profile-button button-secondary"
                          onClick={() => handleJoinChallenge(challenge)}
                          style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                        >
                          Join Challenge
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {activeTab === 'achievements' && (
            <section className="activity-section glass">
              <div className="section-header">
                <h2 className="section-title">
                  <Award size={24} />
                  Achievements
                </h2>
              </div>
              
              <div className="achievements-grid">
                {achievements.length > 0 ? (
                  achievements.map(achievement => (
                    <div
                      key={achievement.id}
                      className="achievement-card glass"
                      onClick={() => setShowAchievement(true)}
                    >
                      <div className="achievement-icon">{achievement.icon}</div>
                      <div className="achievement-name">{achievement.name}</div>
                      <div className="achievement-earned">{achievement.earned}</div>
                      <div className="achievement-description">{achievement.description}</div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">🏆</div>
                    <div className="empty-title">No Achievements Yet</div>
                    <p className="empty-description">Complete challenges to earn achievements.</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="profile-sidebar">
          {/* Quick Actions */}
          <section className="quick-actions-section glass">
            <div className="section-header">
              <h2 className="section-title">
                <Zap size={24} />
                Quick Actions
              </h2>
            </div>
            
            <div className="quick-actions-grid">
              {quickActions.map(action => (
                <button
                  key={action.id}
                  className="quick-action-button glass"
                  onClick={action.action}
                  disabled={!userData && action.id !== 1}
                >
                  <div className="quick-action-icon">
                    {action.icon}
                  </div>
                  <span className="quick-action-label">{action.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Performance Insights */}
          <section className="performance-section glass">
            <div className="section-header">
              <h2 className="section-title">
                <TrendingUp size={24} />
                Performance
              </h2>
            </div>
            
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem' }}>
                {streakData?.currentStreak > 0 
                  ? `Better than ${Math.floor(Math.random() * 30) + 70}% of users`
                  : 'Start your streak to see rankings'}
              </h3>
              <p style={{ color: '#71717a', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Your discipline journey is making an impact
              </p>
              <button
                className="profile-button button-secondary"
                onClick={() => navigateTo('leaderboard')}
                style={{ width: '100%' }}
              >
                <Trophy size={16} />
                View Leaderboard
              </button>
            </div>
          </section>

          {/* Social Stats */}
          <section className="activity-section glass">
            <div className="section-header">
              <h2 className="section-title">
                <Share2 size={24} />
                Social Impact
              </h2>
            </div>
            
            <div className="social-stats-list">
              {socialStats.map(stat => (
                <div key={stat.id} className="social-stat-item glass">
                  <div 
                    className="social-stat-icon" 
                    style={{ background: stat.color }}
                  >
                    {stat.icon}
                  </div>
                  
                  <div className="social-stat-content">
                    <div className="social-stat-platform">{stat.platform}</div>
                    <div className="social-stat-metrics">{stat.metrics}</div>
                  </div>
                  
                  <ExternalLink size={16} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {profileEdit.displayName !== '' && (
        <div className="modal-overlay">
          <motion.div 
            className="modal-content glass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <button 
              className="modal-close"
              onClick={() => setProfileEdit({ displayName: '', bio: '', city: '', country: '' })}
            >
              ✕
            </button>
            
            <div className="modal-header">
              <h2 className="modal-title">Edit Profile</h2>
              <p className="modal-subtitle">Update your personal information</p>
            </div>
            
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <input
                type="text"
                className="form-input"
                value={profileEdit.displayName}
                onChange={(e) => setProfileEdit({...profileEdit, displayName: e.target.value})}
                placeholder="Enter your display name"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea
                className="form-textarea"
                value={profileEdit.bio}
                onChange={(e) => setProfileEdit({...profileEdit, bio: e.target.value})}
                placeholder="Tell us about your journey"
                rows="4"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-input"
                value={profileEdit.city}
                onChange={(e) => setProfileEdit({...profileEdit, city: e.target.value})}
                placeholder="Enter your city"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Country</label>
              <input
                type="text"
                className="form-input"
                value={profileEdit.country}
                onChange={(e) => setProfileEdit({...profileEdit, country: e.target.value})}
                placeholder="Enter your country"
              />
            </div>
            
            <div className="form-actions">
              <button 
                className="profile-button button-secondary"
                onClick={() => setProfileEdit({ displayName: '', bio: '', city: '', country: '' })}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                className="profile-button button-primary"
                onClick={saveProfileEdits}
                style={{ flex: 1 }}
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Challenge Modal */}
      {showCreateChallenge && (
        <div className="create-challenge-modal">
          <motion.div 
            className="create-challenge-content glass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <button 
              className="modal-close"
              onClick={() => setShowCreateChallenge(false)}
            >
              ✕
            </button>
            
            <div className="modal-header">
              <h2 className="modal-title">Create Challenge</h2>
              <p className="modal-subtitle">Design your own discipline challenge</p>
            </div>
            
            <div className="form-group">
              <label className="form-label">Challenge Name *</label>
              <input
                type="text"
                className="form-input"
                value={newChallenge.name}
                onChange={(e) => setNewChallenge({...newChallenge, name: e.target.value})}
                placeholder="e.g., No Complaining Week"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-textarea"
                value={newChallenge.description}
                onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
                placeholder="Describe what this challenge involves and its purpose"
                rows="4"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Challenge Type</label>
              <select
                className="form-select"
                value={newChallenge.type}
                onChange={(e) => setNewChallenge({...newChallenge, type: e.target.value})}
              >
                <option value="mindset">Mindset & Discipline</option>
                <option value="business">Business & Productivity</option>
                <option value="emotional">Emotional Intelligence</option>
                <option value="physical">Physical & Health</option>
                <option value="social">Social & Relationships</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Duration (Days)</label>
              <select
                className="form-select"
                value={newChallenge.duration}
                onChange={(e) => setNewChallenge({...newChallenge, duration: parseInt(e.target.value)})}
              >
                <option value="7">7 Days (1 Week)</option>
                <option value="14">14 Days (2 Weeks)</option>
                <option value="30">30 Days (1 Month)</option>
                <option value="90">90 Days (Quarter)</option>
                <option value="365">365 Days (Year)</option>
                <option value="ongoing">Ongoing</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select
                className="form-select"
                value={newChallenge.difficulty}
                onChange={(e) => setNewChallenge({...newChallenge, difficulty: e.target.value})}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="extreme">Extreme</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Rules</label>
              {newChallenge.rules.map((rule, index) => (
                <div key={index} className="rule-input-group">
                  <input
                    type="text"
                    className="form-input"
                    value={rule}
                    onChange={(e) => {
                      const newRules = [...newChallenge.rules];
                      newRules[index] = e.target.value;
                      setNewChallenge({...newChallenge, rules: newRules});
                    }}
                    placeholder={`Rule ${index + 1}`}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newRules = newChallenge.rules.filter((_, i) => i !== index);
                        setNewChallenge({...newChallenge, rules: newRules});
                      }}
                      style={{
                        padding: '0.5rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '0.5rem',
                        color: '#ef4444',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="add-rule-button"
                onClick={() => setNewChallenge({...newChallenge, rules: [...newChallenge.rules, '']})}
              >
                + Add Rule
              </button>
            </div>
            
            <div className="form-actions">
              <button 
                className="profile-button button-secondary"
                onClick={() => setShowCreateChallenge(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                className="profile-button button-primary"
                onClick={handleCreateChallenge}
                style={{ flex: 1 }}
              >
                Create Challenge
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Social Share Modal */}
      {showSocialShareModal && userData && (
        <div className="modal-overlay">
          <motion.div 
            className="modal-content glass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <button 
              className="modal-close"
              onClick={() => setShowSocialShareModal(false)}
            >
              ✕
            </button>
            
            <div className="modal-header">
              <h2 className="modal-title">Share Profile</h2>
              <p className="modal-subtitle">
                Share your progress with others
              </p>
            </div>
            
            <div className="modal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { platform: 'twitter', name: 'Twitter', icon: <Twitter size={24} />, color: '#1DA1F2' },
                { platform: 'linkedin', name: 'LinkedIn', icon: <Linkedin size={24} />, color: '#0077B5' },
                { platform: 'facebook', name: 'Facebook', icon: <Facebook size={24} />, color: '#1877F2' },
                { platform: 'instagram', name: 'Instagram', icon: <Instagram size={24} />, color: '#E1306C' },
                { platform: 'copy', name: 'Copy Link', icon: '📋', color: '#8b5cf6' },
                { platform: 'whatsapp', name: 'WhatsApp', icon: <MessageSquare size={24} />, color: '#25D366' },
              ].map((platform) => (
                <button
                  key={platform.platform}
                  className="modal-button"
                  onClick={() => handleShareProfile(platform.platform)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.5rem',
                    borderRadius: '1.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${platform.color}20`;
                    e.currentTarget.style.borderColor = `${platform.color}40`;
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <div 
                    style={{
                      width: '3.5rem',
                      height: '3.5rem',
                      borderRadius: '1rem',
                      background: `${platform.color}20`,
                      border: `1px solid ${platform.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                    }}
                  >
                    {platform.icon}
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '0.875rem' }}>
                    {platform.name}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Achievement Toast */}
      {showAchievement && (
        <motion.div 
          className="fixed bottom-8 right-8 z-50"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <div className="p-6 rounded-2xl glass border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-amber-500/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
                <Trophy size={24} />
              </div>
              <div>
                <div className="font-bold text-lg">Achievement Unlocked!</div>
                <div className="text-sm text-gray-400">You earned 100 XP for your dedication</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;