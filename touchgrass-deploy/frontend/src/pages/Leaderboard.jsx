import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../state/auth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Model from '../components/ui/Model';
import Confetti from '../components/ui/Confetti';
import Toast from '../components/ui/Toast';
import { 
  Trophy, Crown, Star, TrendingUp, Users, MapPin, 
  Flame, Award, Target, ChevronRight, Filter, 
  Search, Globe, TrendingDown, BarChart3, 
  Calendar, Clock, Zap, Sparkles, Medal, CheckCircle,
  XCircle, Activity, Target as TargetIcon
} from 'lucide-react';

const Leaderboard = () => {
  const auth = useRecoilValue(authState);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('global-streak');
  const [timeframe, setTimeframe] = useState('all-time');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Mock data generation
  useEffect(() => {
    const mockUsers = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      rank: i + 1,
      username: `user${i + 1}`,
      displayName: ['Alex', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Morgan'][i % 6] + ' ' + ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'][i % 6],
      streak: 312 - i * 2,
      consistency: 95 - i * 0.4,
      totalDays: 400 - i * 3,
      shameCount: Math.floor(Math.random() * 10),
      location: {
        city: ['San Francisco', 'New York', 'London', 'Tokyo', 'Berlin', 'Sydney'][i % 6],
        country: ['USA', 'USA', 'UK', 'Japan', 'Germany', 'Australia'][i % 6],
        flag: ['🇺🇸', '🇺🇸', '🇬🇧', '🇯🇵', '🇩🇪', '🇦🇺'][i % 6]
      },
      isPremium: i < 30,
      isOnline: i < 20,
      lastActive: ['2 min ago', '5 min ago', '10 min ago', '1 hour ago', '2 hours ago'][i % 5],
      badge: i === 0 ? '👑' : i < 3 ? '🥇' : i < 10 ? '🥈' : i < 25 ? '🥉' : '⭐',
      achievements: [
        i < 10 ? '🔥 Weekly Warrior' : null,
        i < 20 ? '🌟 Monthly Maestro' : null,
        i < 30 ? '💯 Century Club' : null
      ].filter(Boolean)
    }));

    setLeaderboardData(mockUsers);
    
    // Simulate user's rank (current user at position 5)
    setUserRank({
      rank: 5,
      streak: 156,
      consistency: 87,
      totalDays: 200,
      percentile: 96,
      cityRank: 2,
      weeklyRank: 3,
      previousRank: 6,
      isUp: true
    });

    // Show confetti if user moved up
    if (userRank?.isUp) {
      setTimeout(() => {
        setShowConfetti(true);
        addToast(`You moved up to rank #${userRank.rank}!`, 'success');
        setTimeout(() => setShowConfetti(false), 3000);
      }, 1000);
    }
  }, []);

  const addToast = (message, type = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const tabs = [
    { id: 'global-streak', label: 'Global Streak', icon: <Globe />, count: '124,857' },
    { id: 'consistency', label: 'Consistency', icon: <Target />, count: '89,432' },
    { id: 'weekly', label: 'Weekly', icon: <Calendar />, count: 'Active Now' },
    // { id: 'cities', label: 'Cities', icon: <MapPin />, count: '2,148' },
    { id: 'friends', label: 'Friends', icon: <Users />, count: '42' },
  ];

  const timeframes = [
    { id: 'all-time', label: 'All Time' },
    // { id: 'monthly', label: 'This Month' },
    // { id: 'weekly', label: 'This Week' },
    // { id: 'daily', label: 'Today' },
  ];

  const categories = [
    { id: 'streak', label: 'Longest Streak', icon: '🔥', count: '312 days' },
    { id: 'consistency', label: 'Best Consistency', icon: '🎯', count: '99.7%' },
    { id: 'total', label: 'Total Days', icon: '📅', count: '421 days' },
    { id: 'shame', label: 'Zero Shame', icon: '😇', count: '42,189 users' },
    { id: 'share', label: 'Most Shared', icon: '📢', count: '1,024 shares' },
  ];

  const getTopThree = () => {
    return leaderboardData.slice(0, 3);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    addToast(`Viewing ${user.displayName}'s profile`, 'info');
  };

  const filteredData = leaderboardData.filter(user => 
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChallengeUser = (user) => {
    setSelectedUser(null);
    addToast(`🎯 Challenge sent to ${user.displayName}!`, 'success');
    // In production: Make API call to challenge user
  };

  const leaderboardStyles = `
    .leaderboard-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    .leaderboard-background {
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(circle at 20% 30%, rgba(251, 191, 36, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(34, 197, 94, 0.1) 0%, transparent 50%);
      animation: backgroundFloat 20s ease-in-out infinite;
    }

    @keyframes backgroundFloat {
      0%, 100% { transform: translate(0, 0); }
      25% { transform: translate(-10px, 10px); }
      50% { transform: translate(10px, -10px); }
      75% { transform: translate(-10px, -10px); }
    }
    
    .leaderboard-content {
      position: relative;
      z-index: 2;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .leaderboard-header {
      margin-bottom: 40px;
    }
    
    .header-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }
    
    .header-title h1 {
      font-size: 48px;
      font-weight: 900;
      margin: 0 0 12px;
      background: linear-gradient(135deg, #fbbf24 0%, #22c55e 50%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.02em;
    }
    
    .header-title p {
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      font-size: 18px;
      line-height: 1.6;
    }
    
    .header-stats {
      display: flex;
      gap: 32px;
    }
    
    .header-stat {
      text-align: center;
    }
    
    .stat-number {
      font-size: 36px;
      font-weight: 800;
      background: linear-gradient(135deg, #22c55e, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 4px;
      line-height: 1;
    }
    
    .stat-label {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      font-weight: 500;
    }
    
    /* Controls */
    .controls-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .tabs-container {
      display: flex;
      gap: 8px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 4px;
      flex-wrap: wrap;
    }
    
    .tab-button {
      padding: 12px 24px;
      border: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 600;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }
    
    .tab-button:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }
    
    .tab-button.active {
      color: white;
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.2));
      border: 1px solid rgba(34, 197, 94, 0.3);
      box-shadow: 0 4px 20px rgba(34, 197, 94, 0.1);
    }
    
    .tab-badge {
      padding: 4px 10px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 100px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .search-container {
      position: relative;
      flex: 1;
      max-width: 400px;
    }
    
    .search-input {
      width: 100%;
      padding: 14px 20px 14px 48px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      color: white;
      font-size: 15px;
      transition: all 0.3s ease;
    }
    
    .search-input:focus {
      outline: none;
      border-color: rgba(34, 197, 94, 0.3);
      background: rgba(34, 197, 94, 0.05);
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    }
    
    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.5);
    }
    
    /* Timeframe selector */
    .timeframe-selector {
      display: flex;
      gap: 8px;
      margin-bottom: 32px;
      flex-wrap: wrap;
    }
    
    .timeframe-button {
      padding: 10px 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .timeframe-button:hover {
      background: rgba(255, 255, 255, 0.08);
      color: white;
    }
    
    .timeframe-button.active {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(21, 128, 61, 0.2));
      border-color: rgba(34, 197, 94, 0.3);
      color: white;
    }
    
    /* Podium Section */
    .podium-section {
      margin-bottom: 60px;
    }
    
    .podium-title {
      font-size: 32px;
      font-weight: 800;
      text-align: center;
      margin-bottom: 40px;
      background: linear-gradient(135deg, #fbbf24, #22c55e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .podium-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
      align-items: end;
    }
    
    .podium-card {
      text-align: center;
      position: relative;
      transition: all 0.3s ease;
    }
    
    .podium-card:hover {
      transform: translateY(-8px);
    }
    
    .podium-card:nth-child(1) {
      order: 2;
    }
    
    .podium-card:nth-child(2) {
      order: 1;
    }
    
    .podium-card:nth-child(3) {
      order: 3;
    }
    
    .podium-platform {
      height: 200px;
      border-radius: 24px 24px 0 0;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin-bottom: 24px;
      overflow: hidden;
    }
    
    .podium-card:nth-child(1) .podium-platform {
      height: 240px;
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(217, 119, 6, 0.15));
      border: 2px solid rgba(251, 191, 36, 0.3);
    }
    
    .podium-card:nth-child(2) .podium-platform {
      height: 180px;
      background: linear-gradient(135deg, rgba(156, 163, 175, 0.15), rgba(107, 114, 128, 0.15));
      border: 2px solid rgba(156, 163, 175, 0.3);
    }
    
    .podium-card:nth-child(3) .podium-platform {
      height: 160px;
      background: linear-gradient(135deg, rgba(180, 83, 9, 0.15), rgba(146, 64, 14, 0.15));
      border: 2px solid rgba(180, 83, 9, 0.3);
    }
    
    .podium-rank {
      position: absolute;
      top: -36px;
      left: 50%;
      transform: translateX(-50%);
      width: 72px;
      height: 72px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 800;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    
    .podium-card:nth-child(1) .podium-rank {
      background: linear-gradient(135deg, #fbbf24, #d97706);
      color: #1c1917;
    }
    
    .podium-card:nth-child(2) .podium-rank {
      background: linear-gradient(135deg, #d1d5db, #9ca3af);
      color: #111827;
    }
    
    .podium-card:nth-child(3) .podium-rank {
      background: linear-gradient(135deg, #b45309, #92400e);
      color: white;
    }
    
    .podium-avatar {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      font-weight: 700;
      margin: 0 auto 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }
    
    .podium-card:nth-child(1) .podium-avatar {
      background: linear-gradient(135deg, #fbbf24, #d97706);
      color: #1c1917;
    }
    
    .podium-card:nth-child(2) .podium-avatar {
      background: linear-gradient(135deg, #d1d5db, #9ca3af);
      color: #111827;
    }
    
    .podium-card:nth-child(3) .podium-avatar {
      background: linear-gradient(135deg, #b45309, #92400e);
      color: white;
    }
    
    .podium-name {
      font-size: 22px;
      font-weight: 700;
      margin: 0 0 12px;
    }
    
    .podium-streak {
      font-size: 40px;
      font-weight: 900;
      margin: 0 0 8px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .podium-location {
      color: rgba(255, 255, 255, 0.7);
      font-size: 15px;
      margin: 0 0 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .podium-stats {
      display: flex;
      gap: 16px;
      justify-content: center;
    }
    
    .podium-stat {
      padding: 10px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
    }
    
    /* Categories */
    .categories-section {
      margin-bottom: 48px;
    }
    
    .categories-title {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 24px;
      color: white;
    }
    
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
    }
    
    .category-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 28px;
      text-align: center;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    
    .category-card:hover {
      transform: translateY(-6px);
      border-color: rgba(34, 197, 94, 0.3);
      background: rgba(34, 197, 94, 0.05);
      box-shadow: 0 12px 32px rgba(34, 197, 94, 0.1);
    }
    
    .category-icon {
      font-size: 40px;
      margin-bottom: 20px;
      display: block;
    }
    
    .category-name {
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 8px;
    }
    
    .category-count {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      margin: 0;
    }
    
    /* Leaderboard Table */
    .table-container {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      overflow: hidden;
      margin-bottom: 48px;
    }
    
    .table-header {
      display: grid;
      grid-template-columns: 80px 1fr repeat(5, 1fr);
      padding: 24px 32px;
      background: rgba(255, 255, 255, 0.08);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      font-weight: 600;
      color: white;
    }
    
    .table-row {
      display: grid;
      grid-template-columns: 80px 1fr repeat(5, 1fr);
      padding: 20px 32px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .table-row:hover {
      background: rgba(255, 255, 255, 0.02);
      transform: translateX(4px);
    }
    
    .table-row:last-child {
      border-bottom: none;
    }
    
    .rank-cell {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    
    .rank-number {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 18px;
      transition: all 0.3s ease;
    }
    
    .rank-1 .rank-number {
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(217, 119, 6, 0.2));
      border: 2px solid rgba(251, 191, 36, 0.3);
      color: #fbbf24;
      box-shadow: 0 8px 24px rgba(251, 191, 36, 0.2);
    }
    
    .rank-2 .rank-number,
    .rank-3 .rank-number {
      background: rgba(255, 255, 255, 0.08);
      border: 2px solid rgba(255, 255, 255, 0.1);
    }
    
    .rank-other .rank-number {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .rank-badge {
      font-size: 24px;
    }
    
    .user-cell {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    
    .user-avatar {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 20px;
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.2));
      color: #22c55e;
      position: relative;
    }
    
    .user-avatar.online::after {
      content: '';
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 14px;
      height: 14px;
      background: #22c55e;
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }
    
    .user-info h4 {
      margin: 0 0 6px;
      font-size: 17px;
      font-weight: 700;
    }
    
    .user-info p {
      margin: 0;
      color: rgba(255, 255, 255, 0.6);
      font-size: 13px;
    }
    
    .stat-cell {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .stat-value {
      font-size: 20px;
      font-weight: 800;
      margin-bottom: 4px;
    }
    
    .streak-cell .stat-value {
      color: #ef4444;
    }
    
    .consistency-cell .stat-value {
      color: #22c55e;
    }
    
    .stat-label {
      color: rgba(255, 255, 255, 0.6);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .badge-cell {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .badge {
      padding: 8px 16px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .badge-premium {
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(217, 119, 6, 0.2));
      border: 1px solid rgba(251, 191, 36, 0.3);
      color: #fbbf24;
    }
    
    .badge-shame {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2));
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #ef4444;
    }
    
    /* User Rank Card */
    .user-rank-card {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(59, 130, 246, 0.15));
      border: 2px solid rgba(34, 197, 94, 0.2);
      border-radius: 24px;
      padding: 40px;
      margin-bottom: 48px;
      position: relative;
      overflow: hidden;
    }
    
    .user-rank-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.08), transparent);
      animation: shine 3s infinite;
    }
    
    @keyframes shine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    .user-rank-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 2;
    }
    
    .rank-main {
      display: flex;
      align-items: center;
      gap: 40px;
    }
    
    .rank-number-large {
      font-size: 96px;
      font-weight: 900;
      background: linear-gradient(135deg, #22c55e, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
      text-shadow: 0 8px 32px rgba(34, 197, 94, 0.3);
    }
    
    .rank-info h3 {
      font-size: 28px;
      margin: 0 0 12px;
      font-weight: 800;
    }
    
    .rank-info p {
      color: rgba(255, 255, 255, 0.8);
      margin: 0 0 24px;
      max-width: 500px;
      font-size: 16px;
      line-height: 1.6;
    }
    
    .rank-stats {
      display: flex;
      gap: 40px;
    }
    
    .rank-stat {
      text-align: center;
    }
    
    .rank-stat-value {
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 8px;
    }
    
    .rank-stat-label {
      color: rgba(255, 255, 255, 0.7);
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    /* Toast Container */
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    /* Responsive */
    @media (max-width: 1200px) {
      .podium-grid {
        grid-template-columns: 1fr;
        gap: 48px;
      }
      
      .podium-card:nth-child(1),
      .podium-card:nth-child(2),
      .podium-card:nth-child(3) {
        order: unset;
      }
      
      .podium-platform {
        height: 160px !important;
      }
      
      .table-header,
      .table-row {
        grid-template-columns: 60px 1fr repeat(3, 1fr);
      }
      
      .table-header :nth-child(5),
      .table-header :nth-child(6),
      .table-row :nth-child(5),
      .table-row :nth-child(6) {
        display: none;
      }
    }
    
    @media (max-width: 768px) {
      .header-main {
        flex-direction: column;
        align-items: flex-start;
        gap: 32px;
      }
      
      .header-stats {
        width: 100%;
        justify-content: space-between;
      }
      
      .controls-section {
        flex-direction: column;
        align-items: stretch;
      }
      
      .user-rank-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 32px;
      }
      
      .rank-main {
        flex-direction: column;
        align-items: flex-start;
        gap: 24px;
      }
      
      .rank-stats {
        width: 100%;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 24px;
      }
      
      .categories-grid {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: 480px) {
      .table-header,
      .table-row {
        grid-template-columns: 50px 1fr repeat(2, 1fr);
        padding: 16px;
      }
      
      .table-header :nth-child(4),
      .table-row :nth-child(4) {
        display: none;
      }
      
      .user-avatar {
        width: 48px;
        height: 48px;
      }
      
      .rank-number-large {
        font-size: 72px;
      }
    }
  `;

  return (
    <>
      <style>{leaderboardStyles}</style>
      <div className="leaderboard-container">
        {showConfetti && <Confetti active={true} duration={3000} />}
        <div className="leaderboard-background" />
        
        <div className="leaderboard-content">
          {/* Header */}
          <div className="leaderboard-header">
            <div className="header-main">
              <div className="header-title">
                <h1>Global Leaderboard</h1>
                <p>Where discipline meets status. Climb the ranks or face digital shame.</p>
              </div>
              
              <div className="header-stats">
                <div className="header-stat">
                  <div className="stat-number">124,857</div>
                  <div className="stat-label">Competitors</div>
                </div>
                <div className="header-stat">
                  <div className="stat-number">312</div>
                  <div className="stat-label">Record Streak</div>
                </div>
                <div className="header-stat">
                  <div className="stat-number">42.7k</div>
                  <div className="stat-label">Online Now</div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="controls-section">
              <div className="tabs-container">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon}
                    {tab.label}
                    <span className="tab-badge">{tab.count}</span>
                  </button>
                ))}
              </div>
              
              <div className="search-container">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search users or cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Timeframe Selector */}
            <div className="timeframe-selector">
              {timeframes.map(tf => (
                <button
                  key={tf.id}
                  className={`timeframe-button ${timeframe === tf.id ? 'active' : ''}`}
                  onClick={() => setTimeframe(tf.id)}
                >
                  {tf.label}
                </button>
              ))}
              <button
                className="timeframe-button"
                onClick={() => setShowFilters(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Filter size={16} />
                Filters
              </button>
            </div>
          </div>

          {/* Podium - Top 3 */}
          {activeTab === 'global-streak' && (
            <div className="podium-section">
              <h2 className="podium-title">🏆 Top Performers</h2>
              <div className="podium-grid">
                {getTopThree().map((user, index) => (
                  <Card 
                    key={user.id} 
                    variant="glass" 
                    borderGradient 
                    glow 
                    className="podium-card"
                  >
                    <div className="podium-platform">
                      <div className="podium-rank">
                        {index === 0 ? '#1' : `#${user.rank}`}
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div className={`podium-avatar ${user.isOnline ? 'online' : ''}`}>
                          {user.displayName.charAt(0)}
                        </div>
                        <h3 className="podium-name">{user.displayName}</h3>
                        <div className="podium-streak">{user.streak} days</div>
                        <div className="podium-location">
                          {user.location.flag} {user.location.city}
                        </div>
                        <div className="podium-stats">
                          <div className="podium-stat">{user.consistency}% consistency</div>
                          <div className="podium-stat">{user.totalDays} total days</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          <div className="categories-section">
            <h2 className="categories-title">📊 Leaderboard Categories</h2>
            <div className="categories-grid">
              {categories.map(category => (
                <Card 
                  key={category.id} 
                  variant="default" 
                  hoverEffect="lift" 
                  className="category-card"
                  onClick={() => {
                    setActiveTab(category.id);
                    addToast(`Viewing ${category.label} rankings`, 'info');
                  }}
                >
                  <div className="category-icon">{category.icon}</div>
                  <h3 className="category-name">{category.label}</h3>
                  <p className="category-count">{category.count}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="table-container">
            <div className="table-header">
              <div>Rank</div>
              <div>User</div>
              <div>Streak</div>
              <div>Consistency</div>
              <div>Location</div>
              <div>Status</div>
            </div>
            
            <div className="table-content">
              {filteredData.slice(3, 50).map(user => (
                <div 
                  key={user.id} 
                  className={`table-row rank-${user.rank <= 3 ? user.rank : 'other'}`}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="rank-cell">
                    <div className="rank-number">{user.rank}</div>
                    <span className="rank-badge">{user.badge}</span>
                  </div>
                  
                  <div className="user-cell">
                    <div className={`user-avatar ${user.isOnline ? 'online' : ''}`}>
                      {user.displayName.charAt(0)}
                    </div>
                    <div className="user-info">
                      <h4>{user.displayName}</h4>
                      <p>@{user.username}</p>
                    </div>
                  </div>
                  
                  <div className="stat-cell streak-cell">
                    <div className="stat-value">{user.streak}</div>
                    <div className="stat-label">days</div>
                  </div>
                  
                  <div className="stat-cell consistency-cell">
                    <div className="stat-value">{user.consistency}%</div>
                    <div className="stat-label">consistency</div>
                  </div>
                  
                  <div className="stat-cell">
                    <div className="stat-value">
                      {user.location.flag} {user.location.city}
                    </div>
                    <div className="stat-label">
                      {user.isOnline ? '🟢 Online' : `Last: ${user.lastActive}`}
                    </div>
                  </div>
                  
                  <div className="badge-cell">
                    {user.isPremium && (
                      <span className="badge badge-premium">
                        <Star size={12} /> PREMIUM
                      </span>
                    )}
                    {user.shameCount > 0 && (
                      <span className="badge badge-shame">
                        {user.shameCount} shame
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Rank Card */}
          {userRank && (
            <Card variant="glass" borderGradient glow className="user-rank-card">
              <div className="user-rank-content">
                <div className="rank-main">
                  <div className="rank-number-large">#{userRank.rank}</div>
                  <div className="rank-info">
                    <h3>🎯 You're in the top {userRank.percentile}%!</h3>
                    <p>
                      Your {userRank.streak}-day streak beats {100 - userRank.percentile}% of users worldwide.
                      {userRank.isUp && ` 🚀 You moved up from #${userRank.previousRank}!`}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                      <Button
                        variant="primary"
                        onClick={() => navigate('/verify')}
                        leftIcon={<Flame />}
                      >
                        Verify Today
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => navigate('/challenges')}
                        leftIcon={<Target />}
                      >
                        Join Challenge
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="rank-stats">
                  <div className="rank-stat">
                    <div className="rank-stat-value">{userRank.streak}</div>
                    <div className="rank-stat-label">Streak</div>
                  </div>
                  <div className="rank-stat">
                    <div className="rank-stat-value">{userRank.consistency}%</div>
                    <div className="rank-stat-label">Consistency</div>
                  </div>
                  <div className="rank-stat">
                    <div className="rank-stat-value">#{userRank.cityRank}</div>
                    <div className="rank-stat-label">City Rank</div>
                  </div>
                  <div className="rank-stat">
                    <div className="rank-stat-value">#{userRank.weeklyRank}</div>
                    <div className="rank-stat-label">Weekly</div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      <Model
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="👤 User Profile"
        size="lg"
        animationType="scale"
        overlayBlur
      >
        {selectedUser && (
          <div style={{ padding: '32px' }}>
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '32px', 
              marginBottom: '40px',
              paddingBottom: '32px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.2))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                fontWeight: '700',
                position: 'relative'
              }}>
                {selectedUser.displayName.charAt(0)}
                {selectedUser.isOnline && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-4px',
                    right: '-4px',
                    width: '20px',
                    height: '20px',
                    background: '#22c55e',
                    border: '3px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%'
                  }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  margin: '0 0 12px', 
                  fontSize: '28px',
                  fontWeight: '800'
                }}>
                  {selectedUser.displayName}
                </h3>
                <p style={{ 
                  margin: '0 0 8px', 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '16px'
                }}>
                  @{selectedUser.username}
                </p>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    fontSize: '14px'
                  }}>
                    {selectedUser.location.flag} {selectedUser.location.city}, {selectedUser.location.country}
                  </span>
                  <span style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    color: selectedUser.isOnline ? '#22c55e' : 'rgba(255, 255, 255, 0.6)',
                    fontSize: '14px'
                  }}>
                    {selectedUser.isOnline ? '🟢 Online' : `⚫ Last active: ${selectedUser.lastActive}`}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '48px', 
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '8px'
                }}>
                  #{selectedUser.rank}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  Global Rank
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '20px',
              marginBottom: '40px'
            }}>
              <Card variant="default" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '36px', 
                  fontWeight: '900', 
                  marginBottom: '8px',
                  color: '#ef4444'
                }}>
                  {selectedUser.streak}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
                  🔥 Current Streak
                </div>
              </Card>
              
              <Card variant="default" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '36px', 
                  fontWeight: '900', 
                  marginBottom: '8px',
                  color: '#22c55e'
                }}>
                  {selectedUser.consistency}%
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
                  🎯 Consistency
                </div>
              </Card>
              
              <Card variant="default" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '36px', 
                  fontWeight: '900', 
                  marginBottom: '8px',
                  color: '#3b82f6'
                }}>
                  {selectedUser.totalDays}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
                  📅 Total Days
                </div>
              </Card>
              
              <Card variant="default" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '36px', 
                  fontWeight: '900', 
                  marginBottom: '8px',
                  color: selectedUser.shameCount === 0 ? '#22c55e' : '#ef4444'
                }}>
                  {selectedUser.shameCount}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
                  😇 Shame Days
                </div>
              </Card>
            </div>

            {/* Achievements */}
            {selectedUser.achievements && selectedUser.achievements.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '700' }}>
                  🏆 Recent Achievements
                </h4>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {selectedUser.achievements.map((achievement, idx) => (
                    <span key={idx} style={{
                      padding: '10px 16px',
                      background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(217, 119, 6, 0.1))',
                      border: '1px solid rgba(251, 191, 36, 0.2)',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#fbbf24'
                    }}>
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  navigate(`/profile/${selectedUser.username}`);
                  setSelectedUser(null);
                }}
                leftIcon={<ChevronRight />}
              >
                View Full Profile
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => handleChallengeUser(selectedUser)}
                leftIcon={<Target />}
              >
                Challenge User
              </Button>
            </div>
          </div>
        )}
      </Model>

      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          />
        ))}
      </div>
    </>
  );
};

export default Leaderboard;