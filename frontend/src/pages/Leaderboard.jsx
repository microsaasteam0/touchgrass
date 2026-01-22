import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Trophy, 
  Crown, 
  Star, 
  TrendingUp, 
  Users, 
  MapPin, 
  Flame, 
  Award, 
  Target, 
  ChevronRight, 
  Filter, 
  Search, 
  Globe, 
  BarChart3, 
  Calendar, 
  Clock, 
  Zap, 
  Sparkles, 
  Medal, 
  CheckCircle,
  XCircle, 
  Activity,
  TrendingDown,
  Crown as CrownIcon,
  Target as TargetIcon,
  DollarSign,
  Briefcase,
  Building,
  Trophy as TrophyIcon,
  Shield,
  Check,
  X,
  UserCheck,
  Verified,
  Coffee,
  Mountain,
  Sunrise,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('global');
  const [timeframe, setTimeframe] = useState('all-time');
  const [searchQuery, setSearchQuery] = useState('');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    onlineNow: 0,
    totalMinutes: 0,
    recordStreak: 0,
    globalConsistency: 0,
    challengeWins: 0
  });

  useEffect(() => {
    generateMockData();
    loadUserRank();
    simulateLiveUpdates();
  }, []);

  const generateMockData = () => {
    // Enhanced mock data with premium features
    const mockUsers = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      rank: i + 1,
      username: `executive${i + 1}`,
      displayName: ['Alex', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Morgan'][i % 6] + ' ' + ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'][i % 6],
      title: ['CEO', 'CTO', 'CFO', 'VP', 'Director', 'Manager'][i % 6],
      company: ['TechCorp', 'InnovateInc', 'GrowthLabs', 'FutureSystems', 'VisionTech', 'SmartSolutions'][i % 6],
      streak: 312 - i * 2,
      consistency: 98 - i * 0.4,
      totalDays: 400 - i * 3,
      totalMinutes: (12000 - i * 50) * 60,
      shameCount: Math.floor(Math.random() * 5),
      location: {
        city: ['San Francisco', 'New York', 'London', 'Tokyo', 'Berlin', 'Sydney'][i % 6],
        country: ['USA', 'USA', 'UK', 'Japan', 'Germany', 'Australia'][i % 6],
        flag: ['🇺🇸', '🇺🇸', '🇬🇧', '🇯🇵', '🇩🇪', '🇦🇺'][i % 6]
      },
      isPremium: i < 25,
      isVerified: i < 15,
      isOnline: i < 20,
      lastActive: ['2 min ago', '5 min ago', '10 min ago', '1 hour ago', '2 hours ago'][i % 5],
      badge: i === 0 ? '👑' : i < 3 ? '🥇' : i < 10 ? '🥈' : i < 25 ? '🥉' : '⭐',
      achievements: [
        i < 5 ? '💎 Diamond Elite' : null,
        i < 10 ? '🚀 Peak Performer' : null,
        i < 15 ? '🎯 Consistency King' : null,
        i < 20 ? '🔥 Streak Master' : null,
        i < 25 ? '🏆 Challenge Champion' : null
      ].filter(Boolean),
      metrics: {
        productivity: 95 - i * 0.5,
        focus: 92 - i * 0.4,
        wellness: 88 - i * 0.3,
        impact: 90 - i * 0.6
      },
      revenueImpact: i < 10 ? `$${(1000000 - i * 50000).toLocaleString()}+` : null,
      teamSize: i < 15 ? `${Math.floor(Math.random() * 100) + 10}` : null
    }));

    setLeaderboardData(mockUsers);
    
    // Update stats
    setStats({
      totalUsers: 124857,
      onlineNow: 42700,
      totalMinutes: 156000000,
      recordStreak: 312,
      globalConsistency: 87.5,
      challengeWins: 89542
    });
  };

  const loadUserRank = () => {
    // Simulate user's rank (current user at position 8)
    const userRankData = {
      rank: 8,
      streak: 156,
      consistency: 92.4,
      totalDays: 200,
      totalMinutes: 60000,
      percentile: 94,
      cityRank: 2,
      weeklyRank: 3,
      previousRank: 9,
      isUp: true,
      trend: '+12.5%',
      metrics: {
        productivity: 89,
        focus: 91,
        wellness: 85,
        impact: 88
      }
    };
    
    setUserRank(userRankData);
    
    // Show congratulatory toast
    if (userRankData.isUp) {
      setTimeout(() => {
        toast.success(`🎉 Rank up! You're now #${userRankData.rank} globally!`, {
          icon: '🚀',
          duration: 5000
        });
      }, 1000);
    }
  };

  const simulateLiveUpdates = () => {
    // Simulate live ranking updates
    setInterval(() => {
      setLeaderboardData(prev => {
        const updated = [...prev];
        const randomIndex = Math.floor(Math.random() * 5) + 1;
        const randomChange = Math.random() > 0.5 ? 1 : -1;
        
        if (updated[randomIndex]) {
          updated[randomIndex].streak += randomChange;
          updated[randomIndex].consistency = Math.min(100, Math.max(80, updated[randomIndex].consistency + (randomChange * 0.1)));
        }
        
        return updated;
      });
    }, 10000); // Update every 10 seconds
  };

  const tabs = [
    { id: 'global', label: 'Global Elite', icon: <Crown size={18} />, count: '124,857', color: 'from-yellow-500 to-amber-600' },
    { id: 'weekly', label: 'Weekly Leaders', icon: <Calendar size={18} />, count: 'Active Now', color: 'from-blue-500 to-cyan-500' },
    { id: 'consistency', label: 'Consistency', icon: <Target size={18} />, count: '98.7% avg', color: 'from-green-500 to-emerald-600' },
    { id: 'business', label: 'Business Impact', icon: <Briefcase size={18} />, count: '$1B+', color: 'from-purple-500 to-pink-600' },
    //{ id: 'friends', label: 'Network', icon: <Users size={18} />, count: 'Following', color: 'from-indigo-500 to-violet-600' },
  ];

  const timeframes = [
    //{ id: 'all-time', label: 'All Time', icon: '🏆' },
    { id: 'monthly', label: 'This Month', icon: '📅' },
    //{ id: 'weekly', label: 'This Week', icon: '⚡' },
  ];

  const metrics = [
    { id: 'streak', label: 'Current Streak', icon: '🔥', unit: 'days', color: 'text-red-400' },
    { id: 'consistency', label: 'Consistency', icon: '🎯', unit: '%', color: 'text-green-400' },
    { id: 'productivity', label: 'Productivity', icon: '⚡', unit: '%', color: 'text-blue-400' },
    { id: 'impact', label: 'Impact Score', icon: '📈', unit: 'pts', color: 'text-purple-400' },
  ];

  const getTopThree = () => {
    return leaderboardData.slice(0, 3);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    toast(`👑 Viewing ${user.displayName}'s elite profile`, {
      icon: '👤',
      duration: 3000
    });
  };

  const filteredData = leaderboardData.filter(user => 
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.location.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatMinutes = (minutes) => {
    if (minutes >= 60 * 24 * 365) {
      return `${Math.floor(minutes / (60 * 24 * 365))}y`;
    } else if (minutes >= 60 * 24) {
      return `${Math.floor(minutes / (60 * 24))}d`;
    } else if (minutes >= 60) {
      return `${Math.floor(minutes / 60)}h`;
    }
    return `${minutes}m`;
  };

  const styles = `
    .leaderboard-page {
      min-height: 100vh;
      background: #050505;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
      position: relative;
      overflow-x: hidden;
    }

    .leaderboard-bg-grid {
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

    .leaderboard-floating-elements {
      position: fixed;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    .leaderboard-float-1 {
      position: absolute;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: linear-gradient(135deg, #fbbf24, #d97706);
      filter: blur(40px);
      opacity: 0.1;
      top: 10%;
      left: 10%;
      animation: float 20s infinite linear;
    }

    .leaderboard-float-2 {
      position: absolute;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      filter: blur(40px);
      opacity: 0.1;
      top: 60%;
      right: 15%;
      animation: float 20s infinite linear -5s;
    }

    .leaderboard-float-3 {
      position: absolute;
      width: 250px;
      height: 250px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #06b6d4);
      filter: blur(40px);
      opacity: 0.1;
      bottom: 20%;
      left: 20%;
      animation: float 20s infinite linear -10s;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(50px, -50px) rotate(90deg); }
      50% { transform: translate(0, -100px) rotate(180deg); }
      75% { transform: translate(-50px, -50px) rotate(270deg); }
    }

    .glass {
      backdrop-filter: blur(10px);
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .text-gradient {
      background: linear-gradient(135deg, #00E5FF 0%, #7F00FF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .leaderboard-container {
      position: relative;
      z-index: 2;
      max-width: 1400px;
      margin: 0 auto;
      padding: 6rem 1.5rem 4rem;
    }

    /* Header */
    .leaderboard-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .leaderboard-title {
      font-size: 4rem;
      font-weight: 900;
      letter-spacing: -0.025em;
      line-height: 1;
      margin-bottom: 1.5rem;
      text-transform: uppercase;
      font-style: italic;
    }

    .leaderboard-subtitle {
      font-size: 1.25rem;
      color: #a1a1aa;
      max-width: 600px;
      margin: 0 auto 2rem;
      line-height: 1.75;
      font-weight: 300;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-top: 3rem;
    }

    .stat-card {
      padding: 2rem;
      border-radius: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      text-align: center;
      transition: all 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(0, 229, 255, 0.2);
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

    /* Tabs */
    .tabs-container {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .tab-button {
      padding: 1rem 2rem;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: #a1a1aa;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
    }

    .tab-button:hover {
      background: rgba(255, 255, 255, 0.08);
      color: white;
    }

    .tab-button.active {
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(127, 0, 255, 0.2));
      border-color: rgba(0, 229, 255, 0.3);
      color: white;
    }

    .tab-count {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.1);
      font-size: 0.75rem;
      font-weight: 700;
    }

    /* Controls */
    .controls-section {
      display: flex;
      gap: 1rem;
      margin-bottom: 3rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-container {
      flex: 1;
      position: relative;
      max-width: 400px;
    }

    .search-input {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: white;
      font-size: 0.875rem;
      transition: all 0.3s;
    }

    .search-input:focus {
      outline: none;
      border-color: rgba(0, 229, 255, 0.3);
      background: rgba(0, 229, 255, 0.05);
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #71717a;
    }

    .timeframe-selector {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .timeframe-button {
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: #a1a1aa;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .timeframe-button:hover {
      background: rgba(255, 255, 255, 0.08);
      color: white;
    }

    .timeframe-button.active {
      background: rgba(0, 229, 255, 0.2);
      border-color: rgba(0, 229, 255, 0.3);
      color: white;
    }

    /* Podium */
    .podium-section {
      margin-bottom: 4rem;
    }

    .section-title {
      font-size: 2rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.025em;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .podium-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      align-items: end;
    }

    @media (max-width: 768px) {
      .podium-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .podium-card:nth-child(1) {
        order: 1;
      }
      
      .podium-card:nth-child(2) {
        order: 2;
      }
      
      .podium-card:nth-child(3) {
        order: 3;
      }
    }

    .podium-card {
      text-align: center;
      position: relative;
    }

    .podium-platform {
      height: 240px;
      border-radius: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      margin-bottom: 1.5rem;
      overflow: hidden;
    }

    .podium-card:nth-child(1) .podium-platform {
      height: 300px;
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(217, 119, 6, 0.15));
      border: 2px solid rgba(251, 191, 36, 0.3);
    }

    .podium-card:nth-child(2) .podium-platform {
      height: 260px;
      background: linear-gradient(135deg, rgba(156, 163, 175, 0.15), rgba(107, 114, 128, 0.15));
      border: 2px solid rgba(156, 163, 175, 0.3);
    }

    .podium-card:nth-child(3) .podium-platform {
      height: 220px;
      background: linear-gradient(135deg, rgba(180, 83, 9, 0.15), rgba(146, 64, 14, 0.15));
      border: 2px solid rgba(180, 83, 9, 0.3);
    }

    .rank-badge {
      position: absolute;
      top: -1.5rem;
      left: 50%;
      transform: translateX(-50%);
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 900;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .podium-card:nth-child(1) .rank-badge {
      background: linear-gradient(135deg, #fbbf24, #d97706);
      color: #1c1917;
    }

    .podium-card:nth-child(2) .rank-badge {
      background: linear-gradient(135deg, #d1d5db, #9ca3af);
      color: #111827;
    }

    .podium-card:nth-child(3) .rank-badge {
      background: linear-gradient(135deg, #b45309, #92400e);
      color: white;
    }

    .user-avatar {
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 auto 1rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }

    .podium-card:nth-child(1) .user-avatar {
      background: linear-gradient(135deg, #fbbf24, #d97706);
      color: #1c1917;
    }

    .podium-card:nth-child(2) .user-avatar {
      background: linear-gradient(135deg, #d1d5db, #9ca3af);
      color: #111827;
    }

    .podium-card:nth-child(3) .user-avatar {
      background: linear-gradient(135deg, #b45309, #92400e);
      color: white;
    }

    .user-name {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
    }

    .user-title {
      color: #71717a;
      font-size: 0.875rem;
      margin: 0 0 0.5rem;
    }

    .streak-value {
      font-size: 2.5rem;
      font-weight: 900;
      margin: 0 0 0.5rem;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .user-location {
      color: #71717a;
      font-size: 0.875rem;
      margin: 0 0 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    /* Leaderboard Table */
    .table-container {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 2rem;
      overflow: hidden;
      margin-bottom: 3rem;
    }

    .table-header {
      display: grid;
      grid-template-columns: 80px 1fr repeat(4, 1fr);
      padding: 1.5rem 2rem;
      background: rgba(255, 255, 255, 0.08);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      font-weight: 700;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #71717a;
    }

    .table-row {
      display: grid;
      grid-template-columns: 80px 1fr repeat(4, 1fr);
      padding: 1.5rem 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.3s;
      cursor: pointer;
    }

    .table-row:hover {
      background: rgba(255, 255, 255, 0.02);
      transform: translateX(8px);
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .rank-cell {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .rank-number {
      width: 3rem;
      height: 3rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 1.125rem;
    }

    .table-row:nth-child(-n+3) .rank-number {
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(217, 119, 6, 0.2));
      border: 2px solid rgba(251, 191, 36, 0.3);
      color: #fbbf24;
    }

    .table-row:nth-child(n+4) .rank-number {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .rank-badge-icon {
      font-size: 1.5rem;
    }

    .user-cell {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .avatar-container {
      position: relative;
    }

    .user-avatar-small {
      width: 3rem;
      height: 3rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1rem;
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(127, 0, 255, 0.2));
      position: relative;
    }

    .user-avatar-small.online::after {
      content: '';
      position: absolute;
      bottom: -0.125rem;
      right: -0.125rem;
      width: 0.75rem;
      height: 0.75rem;
      background: #22c55e;
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }

    .user-info {
      flex: 1;
    }

    .user-name-small {
      font-weight: 700;
      margin: 0 0 0.25rem;
      font-size: 1rem;
    }

    .user-details {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #71717a;
    }

    .user-company {
      color: #00E5FF;
      font-weight: 600;
    }

    .user-verified {
      color: #22c55e;
    }

    .stat-cell {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 900;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #71717a;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .badge-cell {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .badge {
      padding: 0.375rem 0.75rem;
      border-radius: 0.75rem;
      font-size: 0.75rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .badge-premium {
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(217, 119, 6, 0.2));
      border: 1px solid rgba(251, 191, 36, 0.3);
      color: #fbbf24;
    }

    .badge-verified {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(21, 128, 61, 0.2));
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #22c55e;
    }

    .badge-impact {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.2));
      border: 1px solid rgba(139, 92, 246, 0.3);
      color: #8b5cf6;
    }

    /* Your Rank Card */
    .your-rank-card {
      padding: 3rem;
      border-radius: 3rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), transparent, rgba(127, 0, 255, 0.1));
      margin-bottom: 3rem;
      position: relative;
      overflow: hidden;
    }

    .your-rank-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .rank-main-info {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .your-rank-number {
      font-size: 4rem;
      font-weight: 900;
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
    }

    .your-rank-details h3 {
      font-size: 1.5rem;
      font-weight: 900;
      margin: 0 0 0.5rem;
    }

    .your-rank-details p {
      color: #71717a;
      margin: 0;
      font-size: 1rem;
    }

    .your-rank-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1.5rem;
    }

    .rank-metric {
      text-align: center;
    }

    .metric-value {
      font-size: 1.5rem;
      font-weight: 900;
      margin-bottom: 0.5rem;
    }

    .metric-label {
      font-size: 0.75rem;
      color: #71717a;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .dashboard-button {
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
      flex: 1;
    }

    .dashboard-button:hover {
      transform: scale(1.05);
    }

    .dashboard-button:active {
      transform: scale(0.95);
    }

    .button-primary {
      background: #00E5FF;
      color: black;
    }

    .button-secondary {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
    }

    /* User Detail Modal */
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
      max-width: 800px;
      border-radius: 3rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(15, 23, 42, 0.95);
      position: relative;
      overflow: hidden;
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
      z-index: 10;
    }

    .modal-close:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.3);
    }

    .modal-header {
      padding: 3rem 3rem 2rem;
      text-align: center;
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(127, 0, 255, 0.1));
    }

    .modal-avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #00E5FF;
      margin: 0 auto 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: 700;
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
    }

    .modal-name {
      font-size: 2rem;
      font-weight: 900;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .modal-title {
      color: #a1a1aa;
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }

    .modal-company {
      color: #00E5FF;
      font-weight: 600;
      font-size: 1.125rem;
      margin-bottom: 1rem;
    }

    .modal-body {
      padding: 2rem 3rem;
    }

    .modal-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .modal-stat {
      padding: 1.5rem;
      border-radius: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      text-align: center;
    }

    .modal-stat-value {
      font-size: 2rem;
      font-weight: 900;
      margin-bottom: 0.5rem;
    }

    .modal-stat-label {
      font-size: 0.75rem;
      color: #71717a;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .modal-metrics {
      margin-bottom: 2rem;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .metric-item {
      padding: 1rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.05);
      text-align: center;
    }

    .metric-item-value {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    .metric-item-label {
      font-size: 0.75rem;
      color: #71717a;
    }

    @media (max-width: 768px) {
      .leaderboard-container {
        padding: 4rem 1rem 2rem;
      }
      
      .leaderboard-title {
        font-size: 2.5rem;
      }
      
      .tabs-container {
        justify-content: center;
      }
      
      .table-header,
      .table-row {
        grid-template-columns: 60px 1fr repeat(3, 1fr);
        padding: 1rem;
      }
      
      .table-header :nth-child(5),
      .table-row :nth-child(5) {
        display: none;
      }
      
      .your-rank-header {
        flex-direction: column;
        gap: 1.5rem;
      }
      
      .rank-main-info {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }
      
      .action-buttons {
        flex-direction: column;
      }
    }
  `;

  return (
    <div className="leaderboard-page">
      <style>{styles}</style>
      
      <div className="leaderboard-bg-grid"></div>
      <div className="leaderboard-floating-elements">
        <div className="leaderboard-float-1"></div>
        <div className="leaderboard-float-2"></div>
        <div className="leaderboard-float-3"></div>
      </div>

      <div className="leaderboard-container">
        {/* Header */}
        <div className="leaderboard-header">
          <h1 className="leaderboard-title text-gradient">
            Elite Performance Rankings
          </h1>
          <p className="leaderboard-subtitle">
            Where top performers showcase their discipline. Your journey to the top begins with consistent action.
          </p>
          
          <div className="stats-grid">
            <div className="stat-card glass">
              <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
              <div className="stat-label">Elite Competitors</div>
            </div>
            
            <div className="stat-card glass">
              <div className="stat-value">{stats.onlineNow.toLocaleString()}</div>
              <div className="stat-label">Active Now</div>
            </div>
            
            <div className="stat-card glass">
              <div className="stat-value">{formatMinutes(stats.totalMinutes)}</div>
              <div className="stat-label">Total Outdoor Time</div>
            </div>
            
            <div className="stat-card glass">
              <div className="stat-value">{stats.recordStreak}</div>
              <div className="stat-label">Record Streak</div>
            </div>
            
            <div className="stat-card glass">
              <div className="stat-value">{stats.globalConsistency}%</div>
              <div className="stat-label">Avg Consistency</div>
            </div>
            
            <div className="stat-card glass">
              <div className="stat-value">{stats.challengeWins.toLocaleString()}</div>
              <div className="stat-label">Challenges Won</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button glass ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
              <span className="tab-count">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="controls-section">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input glass"
              placeholder="Search executives, companies, or cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="timeframe-selector">
            {timeframes.map(tf => (
              <button
                key={tf.id}
                className={`timeframe-button glass ${timeframe === tf.id ? 'active' : ''}`}
                onClick={() => setTimeframe(tf.id)}
              >
                {tf.icon} {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Podium - Top 3 */}
        {activeTab === 'global' && (
          <div className="podium-section">
            <h2 className="section-title">
              <Crown size={24} />
              Global Elite Podium
            </h2>
            
            <div className="podium-grid">
              {getTopThree().map((user, index) => (
                <motion.div
                  key={user.id}
                  className="podium-card"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="podium-platform glass">
                    <div className="rank-badge">
                      {index === 0 ? '#1' : `#${user.rank}`}
                    </div>
                    
                    <div className="user-avatar">
                      {user.displayName.charAt(0)}
                    </div>
                    
                    <h3 className="user-name">{user.displayName}</h3>
                    <p className="user-title">{user.title} • {user.company}</p>
                    <div className="streak-value">{user.streak} days</div>
                    <div className="user-location">
                      {user.location.flag} {user.location.city}
                    </div>
                  </div>
                  
                  <div className="user-achievements">
                    {user.achievements.slice(0, 2).map((achievement, idx) => (
                      <div
                        key={idx}
                        style={{
                          margin: '0.5rem 0',
                          padding: '0.5rem 1rem',
                          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(217, 119, 6, 0.1))',
                          border: '1px solid rgba(251, 191, 36, 0.2)',
                          borderRadius: '0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: '#fbbf24'
                        }}
                      >
                        {achievement}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="table-container glass">
          <div className="table-header">
            <div>Rank</div>
            <div>Executive</div>
            <div>Streak</div>
            <div>Consistency</div>
            <div>Metrics</div>
            <div>Status</div>
          </div>
          
          <div className="table-content">
            {filteredData.map(user => (
              <div
                key={user.id}
                className="table-row glass"
                onClick={() => handleUserSelect(user)}
              >
                <div className="rank-cell">
                  <div className="rank-number">
                    {user.rank}
                  </div>
                  <span className="rank-badge-icon">{user.badge}</span>
                </div>
                
                <div className="user-cell">
                  <div className="avatar-container">
                    <div className={`user-avatar-small ${user.isOnline ? 'online' : ''}`}>
                      {user.displayName.charAt(0)}
                    </div>
                  </div>
                  
                  <div className="user-info">
                    <div className="user-name-small">
                      {user.displayName}
                      {user.isVerified && (
                        <Verified size={14} style={{ marginLeft: '0.5rem', color: '#22c55e' }} />
                      )}
                    </div>
                    <div className="user-details">
                      <span className="user-company">{user.company}</span>
                      <span>•</span>
                      <span>{user.title}</span>
                      <span>•</span>
                      <span>{user.location.city}</span>
                    </div>
                  </div>
                </div>
                
                <div className="stat-cell">
                  <div className="stat-value" style={{ color: '#ef4444' }}>
                    {user.streak}
                  </div>
                  <div className="stat-label">days</div>
                </div>
                
                <div className="stat-cell">
                  <div className="stat-value" style={{ color: '#22c55e' }}>
                    {user.consistency}%
                  </div>
                  <div className="stat-label">consistency</div>
                </div>
                
                <div className="stat-cell">
                  <div className="stat-value">
                    {formatMinutes(user.totalMinutes)}
                  </div>
                  <div className="stat-label">outdoor time</div>
                </div>
                
                <div className="badge-cell">
                  {user.isPremium && (
                    <span className="badge badge-premium">
                      <Star size={12} /> ELITE
                    </span>
                  )}
                  {user.isVerified && (
                    <span className="badge badge-verified">
                      <Check size={12} /> VERIFIED
                    </span>
                  )}
                  {user.revenueImpact && (
                    <span className="badge badge-impact">
                      <DollarSign size={12} /> {user.revenueImpact}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Rank Card */}
        {userRank && (
          <div className="your-rank-card">
            <div className="your-rank-header">
              <div className="rank-main-info">
                <div className="your-rank-number">#{userRank.rank}</div>
                <div className="your-rank-details">
                  <h3>🎯 You're in the Elite {userRank.percentile}%</h3>
                  <p>
                    Your {userRank.streak}-day streak outperforms {100 - userRank.percentile}% of global executives.
                    {userRank.isUp && ` 🚀 Trending up ${userRank.trend} this week!`}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="your-rank-metrics">
              <div className="rank-metric">
                <div className="metric-value">{userRank.streak} days</div>
                <div className="metric-label">Current Streak</div>
              </div>
              
              <div className="rank-metric">
                <div className="metric-value">{userRank.consistency}%</div>
                <div className="metric-label">Consistency</div>
              </div>
              
              <div className="rank-metric">
                <div className="metric-value">{formatMinutes(userRank.totalMinutes)}</div>
                <div className="metric-label">Total Outdoor Time</div>
              </div>
              
              <div className="rank-metric">
                <div className="metric-value">#{userRank.cityRank}</div>
                <div className="metric-label">City Rank</div>
              </div>
            </div>
            
            <div className="action-buttons">
              <button
                className="dashboard-button button-primary"
                onClick={() => navigate('/verify')}
              >
                <Flame size={20} />
                Verify Today's Progress
              </button>
              
              <button
                className="dashboard-button button-secondary"
                onClick={() => navigate('/challenges')}
              >
                <Target size={20} />
                Join Elite Challenge
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="modal-overlay">
          <motion.div
            className="modal-content glass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedUser(null)}
            >
              <X size={20} />
            </button>
            
            <div className="modal-header">
              <div className="modal-avatar">
                {selectedUser.displayName.charAt(0)}
                {selectedUser.isOnline && (
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    width: '20px',
                    height: '20px',
                    background: '#22c55e',
                    border: '3px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%'
                  }} />
                )}
              </div>
              <h2 className="modal-name">{selectedUser.displayName}</h2>
              <p className="modal-title">{selectedUser.title}</p>
              <p className="modal-company">{selectedUser.company}</p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                marginTop: '1rem'
              }}>
                <span style={{ color: '#71717a', fontSize: '0.875rem' }}>
                  {selectedUser.location.flag} {selectedUser.location.city}, {selectedUser.location.country}
                </span>
                <span style={{
                  color: selectedUser.isOnline ? '#22c55e' : '#71717a',
                  fontSize: '0.875rem'
                }}>
                  {selectedUser.isOnline ? '🟢 Online Now' : `Last active ${selectedUser.lastActive}`}
                </span>
              </div>
            </div>
            
            <div className="modal-body">
              <div className="modal-stats">
                <div className="modal-stat">
                  <div className="modal-stat-value" style={{ color: '#ef4444' }}>
                    #{selectedUser.rank}
                  </div>
                  <div className="modal-stat-label">Global Rank</div>
                </div>
                
                <div className="modal-stat">
                  <div className="modal-stat-value" style={{ color: '#22c55e' }}>
                    {selectedUser.streak}
                  </div>
                  <div className="modal-stat-label">Day Streak</div>
                </div>
                
                <div className="modal-stat">
                  <div className="modal-stat-value" style={{ color: '#3b82f6' }}>
                    {selectedUser.consistency}%
                  </div>
                  <div className="modal-stat-label">Consistency</div>
                </div>
                
                <div className="modal-stat">
                  <div className="modal-stat-value">
                    {formatMinutes(selectedUser.totalMinutes)}
                  </div>
                  <div className="modal-stat-label">Outdoor Time</div>
                </div>
              </div>
              
              {selectedUser.metrics && (
                <div className="modal-metrics">
                  <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.125rem' }}>
                    🎯 Performance Metrics
                  </h4>
                  <div className="metrics-grid">
                    <div className="metric-item">
                      <div className="metric-item-value" style={{ color: '#00E5FF' }}>
                        {selectedUser.metrics.productivity}%
                      </div>
                      <div className="metric-item-label">Productivity</div>
                    </div>
                    
                    <div className="metric-item">
                      <div className="metric-item-value" style={{ color: '#7F00FF' }}>
                        {selectedUser.metrics.focus}%
                      </div>
                      <div className="metric-item-label">Focus</div>
                    </div>
                    
                    <div className="metric-item">
                      <div className="metric-item-value" style={{ color: '#22c55e' }}>
                        {selectedUser.metrics.wellness}%
                      </div>
                      <div className="metric-item-label">Wellness</div>
                    </div>
                    
                    <div className="metric-item">
                      <div className="metric-item-value" style={{ color: '#fbbf24' }}>
                        {selectedUser.metrics.impact}%
                      </div>
                      <div className="metric-item-label">Impact</div>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedUser.achievements && selectedUser.achievements.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.125rem' }}>
                    🏆 Elite Achievements
                  </h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {selectedUser.achievements.map((achievement, idx) => (
                      <span key={idx} style={{
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(217, 119, 6, 0.1))',
                        border: '1px solid rgba(251, 191, 36, 0.2)',
                        borderRadius: '0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#fbbf24'
                      }}>
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="action-buttons" style={{ marginTop: '2rem' }}>
                <button
                  className="dashboard-button button-primary"
                  onClick={() => {
                    navigate(`/profile/${selectedUser.username}`);
                    setSelectedUser(null);
                  }}
                >
                  <UserCheck size={20} />
                  View Full Profile
                </button>
                
                <button
                  className="dashboard-button button-secondary"
                  onClick={() => {
                    toast.success(`🎯 Challenge sent to ${selectedUser.displayName}!`, {
                      icon: '⚡',
                      duration: 3000
                    });
                    setSelectedUser(null);
                  }}
                >
                  <Target size={20} />
                  Challenge Executive
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;