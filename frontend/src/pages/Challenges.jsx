
// import React, { useState, useEffect, useContext } from 'react';
// import { motion } from 'framer-motion';
// import { toast } from 'react-hot-toast';
// import getFallbackChallenges from '../services/ChallengeService';
// import AuthContext from '../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import {
//   Target,
//   Trophy,
//   Users,
//   Calendar,
//   Clock,
//   TrendingUp,
//   Flame,
//   Award,
//   Activity,
//   BarChart3,
//   Share2,
//   Camera,
//   CheckCircle2,
//   XCircle,
//   Plus,
//   Search,
//   Filter,
//   Crown,
//   Star,
//   Heart,
//   Zap,
//   ArrowRight,
//   ChevronRight,
//   ChevronLeft,
//   Eye,
//   MessageCircle,
//   UserPlus,
//   Users as UsersGroup,
//   Target as TargetIcon2,
//   Award as AwardIcon,
//   TrendingDown,
//   Home,
//   Settings,
//   LogOut,
//   User,
//   Edit,
//   MapPin,
//   Mail,
//   ExternalLink,
//   DollarSign,
//   BarChart,
//   PieChart,
//   Activity as ActivityIcon,
//   Users as UsersIcon,
//   EyeOff,
//   MessageSquare,
//   Briefcase,
//   Coffee,
//   BookOpen,
//   Music,
//   Dumbbell,
//   Utensils,
//   Smile,
//   Frown,
//   Meh,
//   Brain,
//   Lightbulb,
//   BrainCircuit,
//   CloudRain,
//   Sun,
//   Moon,
//   Wind,
//   Droplets,
//   Thermometer,
//   AlertCircle,
//   CheckSquare,
//   XSquare,
//   Flag,
//   Timer,
//   Shield,
//   HelpCircle,
//   Info,
//   Copy,
//   Twitter,
//   Linkedin,
//   Facebook,
//   Instagram,
//   MessageSquare as MessageSquareIcon,
//   Download,
//   UploadCloud,
//   Gift,
//   Watch,
//   Smartphone,
//   Eye as EyeIcon,
//   Globe,
//   Lock,
//   Bell,
//   Sun as SunIcon,
//   Moon as MoonIcon,
//   Sparkles,
//   CheckCircle,
//   ChevronDown,
//   ChevronUp,
//   X,
//   Loader2
// } from 'lucide-react';

// const Challenges = ({ onNavigate }) => {
//   // State Management
//   const { user } = useContext(AuthContext);
//   const [activeTab, setActiveTab] = useState('active');
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showChallengeDetails, setShowChallengeDetails] = useState(false);
//   const [showJoinGroupModal, setShowJoinGroupModal] = useState(false);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [selectedChallenge, setSelectedChallenge] = useState(null);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [challenges, setChallenges] = useState([]);
//   const [userChallenges, setUserChallenges] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoadingUserChallenges, setIsLoadingUserChallenges] = useState(false);
//   const [isJoining, setIsJoining] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterDifficulty, setFilterDifficulty] = useState('all');
//   const [filterType, setFilterType] = useState('all');
//   const [newChallenge, setNewChallenge] = useState({
//     name: '',
//     description: '',
//     duration: 7,
//     type: 'streak',
//     difficulty: 'medium',
//     stake: 0,
//     prizePool: 0,
//     rules: [''],
//     groupId: null,
//     isPublic: true
//   });
//   const [showJoinedList, setShowJoinedList] = useState({});
//   const [error, setError] = useState(null);
//   const [dailyCheckins, setDailyCheckins] = useState([]);
//   const [groups, setGroups] = useState([]);

//   // CSS Styles matching Dashboard/Profile design
//   const styles = `
//     .challenges-page {
//       width: 100%;
//       overflow-x: hidden;
//       background: #050505;
//       color: white;
//       font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
//       position: relative;
//       min-height: 100vh;
//     }

//     /* Background Effects */
//     .challenges-bg-grid {
//       position: fixed;
//       top: 0;
//       left: 0;
//       width: 100%;
//       height: 100%;
//       background-image: 
//         linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
//         linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
//       background-size: 50px 50px;
//       pointer-events: none;
//       z-index: 1;
//     }

//     .challenges-floating-elements {
//       position: fixed;
//       width: 100%;
//       height: 100%;
//       pointer-events: none;
//       z-index: 1;
//     }

//     .challenges-floating-element {
//       position: absolute;
//       border-radius: 50%;
//       filter: blur(40px);
//       opacity: 0.1;
//       animation: float 20s infinite linear;
//     }

//     .challenges-float-1 {
//       width: 400px;
//       height: 400px;
//       background: linear-gradient(135deg, #22c55e, #3b82f6);
//       top: 10%;
//       left: 10%;
//       animation-delay: 0s;
//     }

//     .challenges-float-2 {
//       width: 300px;
//       height: 300px;
//       background: linear-gradient(135deg, #8b5cf6, #ec4899);
//       top: 60%;
//       right: 15%;
//       animation-delay: -5s;
//     }

//     .challenges-float-3 {
//       width: 250px;
//       height: 250px;
//       background: linear-gradient(135deg, #fbbf24, #ef4444);
//       bottom: 20%;
//       left: 20%;
//       animation-delay: -10s;
//     }

//     @keyframes float {
//       0%, 100% {
//         transform: translate(0, 0) rotate(0deg);
//       }
//       25% {
//         transform: translate(50px, -50px) rotate(90deg);
//       }
//       50% {
//         transform: translate(0, -100px) rotate(180deg);
//       }
//       75% {
//         transform: translate(-50px, -50px) rotate(270deg);
//       }
//     }

//     /* Glass Effect */
//     .glass {
//       backdrop-filter: blur(10px);
//       background: rgba(15, 23, 42, 0.8);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//     }

//     /* Text Gradient */
//     .text-gradient {
//       background: linear-gradient(135deg, #00E5FF 0%, #7F00FF 100%);
//       -webkit-background-clip: text;
//       -webkit-text-fill-color: transparent;
//       background-clip: text;
//     }

//     /* Navigation */
//     .challenges-nav {
//       position: fixed;
//       top: 0;
//       left: 0;
//       right: 0;
//       z-index: 50;
//       padding: 1rem 1.5rem;
//       border-bottom: 1px solid rgba(255, 255, 255, 0.05);
//       background: rgba(15, 23, 42, 0.95);
//     }

//     .challenges-nav-container {
//       max-width: 1400px;
//       margin: 0 auto;
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//     }

//     .challenges-nav-logo {
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//     }

//     .challenges-nav-logo-text {
//       font-size: 1.5rem;
//       font-weight: 900;
//       letter-spacing: -0.025em;
//       text-transform: uppercase;
//       font-style: italic;
//     }

//     .challenges-nav-logo-highlight {
//       color: #00E5FF;
//     }

//     .challenges-nav-links {
//       display: none;
//     }

//     @media (min-width: 768px) {
//       .challenges-nav-links {
//         display: flex;
//         align-items: center;
//         gap: 2rem;
//       }
//     }

//     .challenges-nav-link {
//       font-size: 0.625rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//       color: #71717a;
//       transition: color 0.2s;
//       background: none;
//       border: none;
//       cursor: pointer;
//       padding: 0;
//     }

//     .challenges-nav-link:hover {
//       color: white;
//     }

//     .challenges-nav-button {
//       padding: 0.5rem 1.5rem;
//       background: #00E5FF;
//       color: black;
//       border-radius: 0.75rem;
//       font-size: 0.75rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//       border: none;
//       cursor: pointer;
//       transition: all 0.2s;
//     }

//     .challenges-nav-button:hover {
//       transform: scale(1.05);
//       box-shadow: 0 0 20px rgba(0, 229, 255, 0.4);
//     }

//     /* Header */
//     .challenges-header {
//       padding-top: 8rem;
//       padding-bottom: 4rem;
//       padding-left: 1.5rem;
//       padding-right: 1.5rem;
//       text-align: center;
//       position: relative;
//       z-index: 2;
//     }

//     @media (min-width: 768px) {
//       .challenges-header {
//         text-align: left;
//       }
//     }

//     .challenges-header-container {
//       max-width: 1400px;
//       margin: 0 auto;
//     }

//     .challenges-title {
//       font-size: 4rem;
//       font-weight: 900;
//       letter-spacing: -0.025em;
//       line-height: 1;
//       margin-bottom: 1.5rem;
//       text-transform: uppercase;
//       font-style: italic;
//     }

//     .challenges-subtitle {
//       font-size: 1.25rem;
//       color: #a1a1aa;
//       max-width: 600px;
//       line-height: 1.75;
//       font-weight: 300;
//     }

//     /* Stats Grid */
//     .stats-grid {
//       display: grid;
//       grid-template-columns: repeat(2, 1fr);
//       gap: 1rem;
//       margin-bottom: 2rem;
//     }

//     @media (min-width: 768px) {
//       .stats-grid {
//         grid-template-columns: repeat(4, 1fr);
//       }
//     }

//     .stat-card {
//       padding: 2rem;
//       border-radius: 2rem;
//       border: 1px solid rgba(255, 255, 255, 0.05);
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       text-align: center;
//       transition: all 0.3s;
//     }

//     .stat-card:hover {
//       transform: translateY(-5px);
//       background: rgba(255, 255, 255, 0.04);
//       border-color: rgba(0, 229, 255, 0.2);
//     }

//     .stat-icon {
//       width: 3rem;
//       height: 3rem;
//       border-radius: 1rem;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       background: rgba(0, 229, 255, 0.1);
//       color: #00E5FF;
//       border: 1px solid rgba(0, 229, 255, 0.2);
//       margin-bottom: 1rem;
//     }

//     .stat-value {
//       font-size: 2.5rem;
//       font-weight: 900;
//       margin-bottom: 0.5rem;
//       line-height: 1;
//     }

//     .stat-label {
//       font-size: 0.625rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: 0.2em;
//       color: #71717a;
//     }

//     /* Main Grid */
//     .challenges-grid-container {
//       max-width: 1400px;
//       margin: 0 auto;
//       padding: 0 1.5rem 4rem;
//       position: relative;
//       z-index: 2;
//     }

//     /* Controls */
//     .controls-section {
//       display: flex;
//       flex-direction: column;
//       gap: 1rem;
//       margin-bottom: 2rem;
//     }

//     @media (min-width: 768px) {
//       .controls-section {
//         flex-direction: row;
//         justify-content: space-between;
//         align-items: center;
//       }
//     }

//     .search-filter-section {
//       display: flex;
//       gap: 1rem;
//       flex-wrap: wrap;
//     }

//     .search-box {
//       flex: 1;
//       min-width: 250px;
//     }

//     .search-input {
//       width: 100%;
//       padding: 1rem 1.5rem;
//       border-radius: 1rem;
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       color: white;
//       font-size: 0.875rem;
//       transition: all 0.2s;
//     }

//     .search-input:focus {
//       outline: none;
//       border-color: #00E5FF;
//       background: rgba(0, 229, 255, 0.05);
//     }

//     .filter-buttons {
//       display: flex;
//       gap: 0.5rem;
//       flex-wrap: wrap;
//     }

//     .filter-button {
//       padding: 0.75rem 1.5rem;
//       border-radius: 1rem;
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       color: #71717a;
//       font-size: 0.75rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//       cursor: pointer;
//       transition: all 0.2s;
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//     }

//     .filter-button:hover {
//       color: white;
//       background: rgba(255, 255, 255, 0.1);
//     }

//     .filter-button.active {
//       color: white;
//       background: rgba(0, 229, 255, 0.2);
//       border-color: rgba(0, 229, 255, 0.3);
//     }

//     /* Tabs */
//     .challenges-tabs {
//       display: flex;
//       gap: 0.5rem;
//       background: rgba(255, 255, 255, 0.05);
//       border-radius: 1rem;
//       padding: 0.5rem;
//       margin-bottom: 2rem;
//       overflow-x: auto;
//     }

//     .challenges-tab {
//       flex: 1;
//       padding: 1rem 1.5rem;
//       border: none;
//       background: transparent;
//       color: #71717a;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//       font-size: 0.75rem;
//       border-radius: 0.75rem;
//       cursor: pointer;
//       transition: all 0.2s;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       gap: 0.5rem;
//       white-space: nowrap;
//       min-width: 120px;
//     }

//     .challenges-tab:hover {
//       color: white;
//       background: rgba(255, 255, 255, 0.1);
//     }

//     .challenges-tab.active {
//       color: white;
//       background: rgba(0, 229, 255, 0.2);
//       border: 1px solid rgba(0, 229, 255, 0.3);
//     }

//     .tab-badge {
//       background: #ef4444;
//       color: white;
//       font-size: 0.625rem;
//       padding: 0.125rem 0.5rem;
//       border-radius: 9999px;
//       margin-left: 0.25rem;
//     }

//     /* Challenges Grid */
//     .challenges-main-grid {
//       display: grid;
//       grid-template-columns: 1fr;
//       gap: 2rem;
//     }

//     @media (min-width: 1024px) {
//       .challenges-main-grid {
//         grid-template-columns: 2fr 1fr;
//       }
//     }

//     .challenges-list {
//       display: grid;
//       grid-template-columns: repeat(1, 1fr);
//       gap: 1.5rem;
//     }

//     @media (min-width: 768px) {
//       .challenges-list {
//         grid-template-columns: repeat(2, 1fr);
//       }
//     }

//     /* Challenge Card */
//     .challenge-card {
//       padding: 2rem;
//       border-radius: 2rem;
//       border: 1px solid rgba(255, 255, 255, 0.05);
//       background: rgba(255, 255, 255, 0.01);
//       transition: all 0.3s;
//       cursor: pointer;
//       position: relative;
//       overflow: hidden;
//     }

//     .challenge-card:hover {
//       background: rgba(255, 255, 255, 0.03);
//       transform: translateY(-5px);
//       border-color: rgba(0, 229, 255, 0.2);
//     }

//     .challenge-card.premium::before {
//       content: '';
//       position: absolute;
//       top: 0;
//       left: 0;
//       right: 0;
//       height: 4px;
//       background: linear-gradient(90deg, #fbbf24, #d97706);
//     }

//     .challenge-card.featured::after {
//       content: '⭐ FEATURED';
//       position: absolute;
//       top: 1rem;
//       right: 1rem;
//       background: linear-gradient(135deg, #fbbf24, #d97706);
//       color: #1e293b;
//       font-size: 0.625rem;
//       font-weight: 900;
//       padding: 0.25rem 0.75rem;
//       border-radius: 9999px;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//     }

//     .challenge-header {
//       display: flex;
//       align-items: flex-start;
//       justify-content: space-between;
//       margin-bottom: 1rem;
//     }

//     .challenge-title {
//       font-size: 1.5rem;
//       font-weight: 900;
//       line-height: 1.2;
//       margin-right: 1rem;
//     }

//     .challenge-status {
//       font-size: 0.625rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//       padding: 0.25rem 0.75rem;
//       border-radius: 9999px;
//       white-space: nowrap;
//     }

//     .status-active {
//       background: rgba(34, 197, 94, 0.1);
//       color: #22c55e;
//     }

//     .status-upcoming {
//       background: rgba(59, 130, 246, 0.1);
//       color: #3b82f6;
//     }

//     .status-completed {
//       background: rgba(139, 92, 246, 0.1);
//       color: #8b5cf6;
//     }

//     .challenge-description {
//       color: #71717a;
//       font-size: 0.875rem;
//       line-height: 1.5;
//       margin-bottom: 1.5rem;
//     }

//     .challenge-meta {
//       display: grid;
//       grid-template-columns: repeat(2, 1fr);
//       gap: 1rem;
//       margin-bottom: 1.5rem;
//     }

//     .meta-item {
//       display: flex;
//       align-items: center;
//       gap: 0.75rem;
//     }

//     .meta-icon {
//       width: 2rem;
//       height: 2rem;
//       border-radius: 0.75rem;
//       background: rgba(0, 229, 255, 0.1);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       color: #00E5FF;
//       flex-shrink: 0;
//     }

//     .meta-content {
//       flex: 1;
//     }

//     .meta-label {
//       font-size: 0.625rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//       color: #71717a;
//       margin-bottom: 0.125rem;
//     }

//     .meta-value {
//       font-size: 0.875rem;
//       font-weight: 700;
//     }

//     .challenge-tags {
//       display: flex;
//       flex-wrap: wrap;
//       gap: 0.5rem;
//       margin-bottom: 1.5rem;
//     }

//     .challenge-tag {
//       padding: 0.25rem 0.75rem;
//       border-radius: 9999px;
//       font-size: 0.625rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//     }

//     .tag-difficulty {
//       background: rgba(34, 197, 94, 0.1);
//       color: #22c55e;
//     }

//     .tag-type {
//       background: rgba(59, 130, 246, 0.1);
//       color: #3b82f6;
//     }

//     .tag-premium {
//       background: rgba(251, 191, 36, 0.1);
//       color: #fbbf24;
//     }

//     .challenge-progress {
//       margin-bottom: 1.5rem;
//     }

//     .progress-header {
//       display: flex;
//       justify-content: space-between;
//       margin-bottom: 0.5rem;
//     }

//     .progress-label {
//       font-size: 0.75rem;
//       color: #71717a;
//     }

//     .progress-value {
//       font-size: 0.75rem;
//       font-weight: 700;
//       color: #00E5FF;
//     }

//     .progress-bar {
//       height: 0.5rem;
//       background: rgba(255, 255, 255, 0.05);
//       border-radius: 9999px;
//       overflow: hidden;
//     }

//     .progress-fill {
//       height: 100%;
//       background: linear-gradient(90deg, #00E5FF, #7F00FF);
//       border-radius: 9999px;
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

//     .challenge-actions {
//       display: flex;
//       gap: 0.75rem;
//     }

//     /* Joined Users Dropdown */
//     .joined-users-section {
//       margin-top: 1rem;
//       padding-top: 1rem;
//       border-top: 1px solid rgba(255, 255, 255, 0.05);
//     }

//     .joined-header {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       cursor: pointer;
//       padding: 0.5rem;
//       border-radius: 0.75rem;
//       transition: all 0.2s;
//     }

//     .joined-header:hover {
//       background: rgba(255, 255, 255, 0.05);
//     }

//     .joined-title {
//       font-size: 0.75rem;
//       font-weight: 700;
//       color: #71717a;
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//     }

//     .joined-count {
//       background: rgba(0, 229, 255, 0.1);
//       color: #00E5FF;
//       font-size: 0.625rem;
//       padding: 0.125rem 0.5rem;
//       border-radius: 9999px;
//     }

//     .joined-list {
//       margin-top: 0.5rem;
//       max-height: 200px;
//       overflow-y: auto;
//       border-radius: 0.75rem;
//       background: rgba(255, 255, 255, 0.02);
//       border: 1px solid rgba(255, 255, 255, 0.05);
//     }

//     .joined-user {
//       display: flex;
//       align-items: center;
//       gap: 0.75rem;
//       padding: 0.75rem;
//       border-bottom: 1px solid rgba(255, 255, 255, 0.05);
//     }

//     .joined-user:last-child {
//       border-bottom: none;
//     }

//     .joined-avatar {
//       width: 2rem;
//       height: 2rem;
//       border-radius: 50%;
//       object-fit: cover;
//       border: 2px solid rgba(0, 229, 255, 0.2);
//     }

//     .joined-user-info {
//       flex: 1;
//     }

//     .joined-user-name {
//       font-size: 0.75rem;
//       font-weight: 700;
//     }

//     .joined-user-streak {
//       font-size: 0.625rem;
//       color: #22c55e;
//       display: flex;
//       align-items: center;
//       gap: 0.25rem;
//     }

//     .joined-user-badge {
//       background: rgba(139, 92, 246, 0.1);
//       color: #8b5cf6;
//       font-size: 0.5rem;
//       padding: 0.125rem 0.375rem;
//       border-radius: 9999px;
//       margin-left: 0.5rem;
//     }

//     /* My Challenges Badge */
//     .my-challenge-badge {
//       background: rgba(251, 191, 36, 0.1);
//       color: #fbbf24;
//       font-size: 0.5rem;
//       padding: 0.125rem 0.375rem;
//       border-radius: 9999px;
//       margin-left: 0.5rem;
//       border: 1px solid rgba(251, 191, 36, 0.2);
//     }

//     /* Sidebar */
//     .challenges-sidebar {
//       display: flex;
//       flex-direction: column;
//       gap: 2rem;
//     }

//     /* Groups Section */
//     .groups-section {
//       padding: 2rem;
//       border-radius: 2rem;
//       border: 1px solid rgba(255, 255, 255, 0.05);
//       background: rgba(255, 255, 255, 0.01);
//     }

//     .section-header {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       margin-bottom: 1.5rem;
//     }

//     .section-title {
//       font-size: 1.25rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: -0.025em;
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//     }

//     .section-button {
//       font-size: 0.625rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//       color: #71717a;
//       background: none;
//       border: none;
//       cursor: pointer;
//       padding: 0;
//       transition: color 0.2s;
//       display: flex;
//       align-items: center;
//       gap: 0.25rem;
//     }

//     .section-button:hover {
//       color: white;
//     }

//     .groups-list {
//       display: flex;
//       flex-direction: column;
//       gap: 1rem;
//     }

//     .group-item {
//       display: flex;
//       align-items: center;
//       gap: 1rem;
//       padding: 1rem;
//       border-radius: 1rem;
//       border: 1px solid rgba(255, 255, 255, 0.05);
//       background: rgba(255, 255, 255, 0.01);
//       cursor: pointer;
//       transition: all 0.2s;
//     }

//     .group-item:hover {
//       background: rgba(255, 255, 255, 0.03);
//       transform: translateX(5px);
//     }

//     .group-icon {
//       width: 3rem;
//       height: 3rem;
//       border-radius: 1rem;
//       background: linear-gradient(135deg, #00E5FF, #7F00FF);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 1.25rem;
//     }

//     .group-content {
//       flex: 1;
//     }

//     .group-name {
//       font-weight: 700;
//       margin-bottom: 0.25rem;
//     }

//     .group-meta {
//       font-size: 0.75rem;
//       color: #71717a;
//       display: flex;
//       gap: 0.75rem;
//     }

//     /* Quick Actions */
//     .quick-actions-section {
//       padding: 2rem;
//       border-radius: 2rem;
//       border: 1px solid rgba(255, 255, 255, 0.05);
//       background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), transparent);
//     }

//     .quick-actions-grid {
//       display: grid;
//       grid-template-columns: repeat(2, 1fr);
//       gap: 1rem;
//     }

//     .quick-action-button {
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       gap: 1rem;
//       padding: 1.5rem;
//       border-radius: 1.5rem;
//       border: 1px solid rgba(255, 255, 255, 0.05);
//       background: rgba(255, 255, 255, 0.01);
//       cursor: pointer;
//       transition: all 0.3s;
//     }

//     .quick-action-button:hover {
//       background: rgba(255, 255, 255, 0.03);
//       transform: scale(1.05);
//       border-color: rgba(0, 229, 255, 0.2);
//     }

//     .quick-action-icon {
//       width: 3rem;
//       height: 3rem;
//       border-radius: 1rem;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       background: rgba(0, 229, 255, 0.1);
//       color: #00E5FF;
//     }

//     .quick-action-label {
//       font-size: 0.625rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//       text-align: center;
//       color: #71717a;
//     }

//     /* Leaderboard */
//     .leaderboard-section {
//       padding: 2rem;
//       border-radius: 2rem;
//       border: 1px solid rgba(255, 255, 255, 0.05);
//       background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), transparent);
//     }

//     .leaderboard-list {
//       display: flex;
//       flex-direction: column;
//       gap: 0.75rem;
//     }

//     .leaderboard-item {
//       display: flex;
//       align-items: center;
//       gap: 1rem;
//       padding: 1rem;
//       border-radius: 1rem;
//       background: rgba(255, 255, 255, 0.01);
//     }

//     .leaderboard-rank {
//       width: 2rem;
//       height: 2rem;
//       border-radius: 0.5rem;
//       background: rgba(0, 229, 255, 0.1);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 0.875rem;
//       font-weight: 900;
//       color: #00E5FF;
//     }

//     .rank-1 {
//       background: linear-gradient(135deg, #fbbf24, #d97706);
//       color: #1e293b;
//     }

//     .rank-2 {
//       background: rgba(209, 213, 219, 0.1);
//       color: #d1d5db;
//     }

//     .rank-3 {
//       background: rgba(180, 83, 9, 0.1);
//       color: #b45309;
//     }

//     .leaderboard-avatar {
//       width: 2.5rem;
//       height: 2.5rem;
//       border-radius: 0.75rem;
//       object-fit: cover;
//       border: 2px solid rgba(0, 229, 255, 0.2);
//     }

//     .leaderboard-info {
//       flex: 1;
//     }

//     .leaderboard-name {
//       font-weight: 700;
//       margin-bottom: 0.125rem;
//     }

//     .leaderboard-stats {
//       font-size: 0.75rem;
//       color: #71717a;
//       display: flex;
//       gap: 0.75rem;
//     }

//     .leaderboard-score {
//       font-size: 0.875rem;
//       font-weight: 900;
//       color: #00E5FF;
//     }

//     /* Modal */
//     .modal-overlay {
//       position: fixed;
//       inset: 0;
//       background: rgba(0, 0, 0, 0.8);
//       backdrop-filter: blur(10px);
//       z-index: 100;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       padding: 1.5rem;
//     }

//     .modal-content {
//       width: 100%;
//       max-width: 600px;
//       max-height: 90vh;
//       overflow-y: auto;
//       padding: 3rem;
//       border-radius: 3rem;
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       background: rgba(15, 23, 42, 0.95);
//       position: relative;
//     }

//     .modal-large {
//       max-width: 800px;
//     }

//     .modal-close {
//       position: absolute;
//       top: 2rem;
//       right: 2rem;
//       width: 2.5rem;
//       height: 2.5rem;
//       border-radius: 0.75rem;
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       background: rgba(255, 255, 255, 0.05);
//       color: white;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       cursor: pointer;
//       transition: all 0.2s;
//     }

//     .modal-close:hover {
//       background: rgba(239, 68, 68, 0.2);
//       border-color: rgba(239, 68, 68, 0.3);
//     }

//     .modal-header {
//       text-align: center;
//       margin-bottom: 2rem;
//     }

//     .modal-icon {
//       width: 5rem;
//       height: 5rem;
//       border-radius: 1.5rem;
//       background: linear-gradient(135deg, #00E5FF, #7F00FF);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       margin: 0 auto 1.5rem;
//       font-size: 2.5rem;
//     }

//     .modal-title {
//       font-size: 2rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: -0.025em;
//       margin-bottom: 0.5rem;
//       background: linear-gradient(135deg, #00E5FF, #7F00FF);
//       -webkit-background-clip: text;
//       -webkit-text-fill-color: transparent;
//       background-clip: text;
//     }

//     .modal-subtitle {
//       color: #71717a;
//       font-size: 1rem;
//     }

//     /* Form Styles */
//     .form-group {
//       margin-bottom: 1.5rem;
//     }

//     .form-label {
//       display: block;
//       font-size: 0.75rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//       color: #71717a;
//       margin-bottom: 0.5rem;
//     }

//     .form-input {
//       width: 100%;
//       padding: 1rem;
//       border-radius: 1rem;
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       color: white;
//       font-size: 0.875rem;
//       transition: all 0.2s;
//     }

//     .form-input:focus {
//       outline: none;
//       border-color: #00E5FF;
//       background: rgba(0, 229, 255, 0.05);
//     }

//     .form-select {
//       width: 100%;
//       padding: 1rem;
//       border-radius: 1rem;
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       color: white;
//       font-size: 0.875rem;
//       transition: all 0.2s;
//       appearance: none;
//       background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
//       background-repeat: no-repeat;
//       background-position: right 1rem center;
//       background-size: 1rem;
//     }

//     .form-select:focus {
//       outline: none;
//       border-color: #00E5FF;
//       background: rgba(0, 229, 255, 0.05);
//     }

//     .form-textarea {
//       width: 100%;
//       padding: 1rem;
//       border-radius: 1rem;
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       color: white;
//       font-size: 0.875rem;
//       transition: all 0.2s;
//       resize: vertical;
//       min-height: 100px;
//     }

//     .form-textarea:focus {
//       outline: none;
//       border-color: #00E5FF;
//       background: rgba(0, 229, 255, 0.05);
//     }

//     .form-row {
//       display: grid;
//       grid-template-columns: repeat(2, 1fr);
//       gap: 1rem;
//     }

//     .form-actions {
//       display: flex;
//       gap: 1rem;
//       margin-top: 2rem;
//     }

//     /* Button Styles */
//     .button {
//       padding: 1rem 2rem;
//       border-radius: 1rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//       font-size: 0.75rem;
//       border: none;
//       cursor: pointer;
//       transition: all 0.2s;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       gap: 0.5rem;
//     }

//     .button:hover {
//       transform: scale(1.05);
//     }

//     .button:active {
//       transform: scale(0.95);
//     }

//     .button-primary {
//       background: #00E5FF;
//       color: black;
//       box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
//     }

//     .button-primary:hover {
//       background: rgba(0, 229, 255, 0.9);
//     }

//     .button-secondary {
//       background: rgba(255, 255, 255, 0.1);
//       border: 1px solid rgba(255, 255, 255, 0.2);
//       color: white;
//     }

//     .button-secondary:hover {
//       background: rgba(255, 255, 255, 0.15);
//     }

//     .button-premium {
//       background: linear-gradient(135deg, #fbbf24, #d97706);
//       color: #1e293b;
//       font-weight: 900;
//     }

//     .button-premium:hover {
//       background: linear-gradient(135deg, #d97706, #b45309);
//       box-shadow: 0 20px 25px -5px rgba(251, 191, 36, 0.3);
//     }

//     .button-success {
//       background: linear-gradient(135deg, #22c55e, #16a34a);
//       color: white;
//     }

//     .button-success:hover {
//       background: linear-gradient(135deg, #16a34a, #15803d);
//     }

//     .button-joined {
//       background: rgba(34, 197, 94, 0.1);
//       border: 1px solid rgba(34, 197, 94, 0.2);
//       color: #22c55e;
//     }

//     .button-joined:hover {
//       background: rgba(34, 197, 94, 0.2);
//     }

//     .button-danger {
//       background: rgba(239, 68, 68, 0.1);
//       border: 1px solid rgba(239, 68, 68, 0.2);
//       color: #ef4444;
//     }

//     .button-danger:hover {
//       background: rgba(239, 68, 68, 0.2);
//     }

//     .button-full {
//       width: 100%;
//     }

//     /* Loading State */
//     .loading-skeleton {
//       background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 75%);
//       background-size: 200% 100%;
//       animation: loading 1.5s infinite;
//       border-radius: 1rem;
//     }

//     @keyframes loading {
//       0% { background-position: 200% 0; }
//       100% { background-position: -200% 0; }
//     }

//     /* Empty State */
//     .empty-state {
//       text-align: center;
//       padding: 4rem 2rem;
//       color: #71717a;
//       grid-column: 1 / -1;
//     }

//     .empty-icon {
//       font-size: 3rem;
//       margin-bottom: 1.5rem;
//       opacity: 0.5;
//     }

//     .empty-title {
//       font-size: 1.25rem;
//       font-weight: 700;
//       margin-bottom: 0.5rem;
//       color: white;
//     }

//     .empty-description {
//       font-size: 0.875rem;
//       max-width: 300px;
//       margin: 0 auto 1.5rem;
//       line-height: 1.5;
//     }

//     /* Challenge Details */
//     .challenge-details {
//       max-height: 80vh;
//       overflow-y: auto;
//     }

//     .details-section {
//       margin-bottom: 2rem;
//     }

//     .details-title {
//       font-size: 1rem;
//       font-weight: 700;
//       margin-bottom: 1rem;
//       color: #00E5FF;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//     }

//     .participants-grid {
//       display: grid;
//       grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
//       gap: 1rem;
//       margin-top: 1rem;
//     }

//     .participant-card {
//       padding: 1rem;
//       border-radius: 1rem;
//       background: rgba(255, 255, 255, 0.01);
//       text-align: center;
//       transition: all 0.2s;
//     }

//     .participant-card:hover {
//       background: rgba(255, 255, 255, 0.03);
//       transform: translateY(-2px);
//     }

//     .participant-avatar {
//       width: 3rem;
//       height: 3rem;
//       border-radius: 50%;
//       object-fit: cover;
//       border: 2px solid #00E5FF;
//       margin: 0 auto 0.5rem;
//     }

//     .participant-name {
//       font-size: 0.75rem;
//       font-weight: 700;
//       margin-bottom: 0.25rem;
//     }

//     .participant-streak {
//       font-size: 0.625rem;
//       color: #71717a;
//     }

//     .participant-streak.active {
//       color: #22c55e;
//     }

//     /* My Challenges Section */
//     .my-challenges-badge {
//       background: rgba(251, 191, 36, 0.1);
//       color: #fbbf24;
//       border: 1px solid rgba(251, 191, 36, 0.2);
//       font-size: 0.5rem;
//       padding: 0.125rem 0.375rem;
//       border-radius: 9999px;
//       margin-left: 0.5rem;
//     }

//     /* Responsive */
//     @media (max-width: 768px) {
//       .challenges-title {
//         font-size: 3rem;
//       }
      
//       .challenges-list {
//         grid-template-columns: 1fr;
//       }
      
//       .quick-actions-grid {
//         grid-template-columns: repeat(4, 1fr);
//       }
      
//       .form-row {
//         grid-template-columns: 1fr;
//       }
//     }

//     @media (max-width: 480px) {
//       .challenges-title {
//         font-size: 2.5rem;
//       }
      
//       .stats-grid {
//         grid-template-columns: 1fr;
//       }
      
//       .quick-actions-grid {
//         grid-template-columns: repeat(2, 1fr);
//       }
      
//       .controls-section {
//         flex-direction: column;
//       }
      
//       .search-filter-section {
//         width: 100%;
//       }
//     }
//   `;

//   // Navigation function
//   const navigateTo = (page) => {
//     if (onNavigate && typeof onNavigate === 'function') {
//       onNavigate(page);
//     } else {
//       switch(page) {
//         case 'dashboard':
//           window.location.href = '/dashboard';
//           break;
//         case 'profile':
//           window.location.href = '/profile';
//           break;
//         case 'verify':
//           window.location.href = '/verify';
//           break;
//         case 'leaderboard':
//           window.location.href = '/leaderboard';
//           break;
//         case 'auth':
//           window.location.href = '/auth';
//           break;
//         default:
//       }
//     }
//   };

//   // Load user data from localStorage (same as Dashboard/Profile)
//   const loadUserData = () => {
//     try {
//       const storedUser = localStorage.getItem('touchgrass_user');
//       if (storedUser) {
//         const user = JSON.parse(storedUser);
//         return user;
//       }
//       return null;
//     } catch (error) {
//       return null;
//     }
//   };

//   // Load challenges from REAL backend API
//   const loadChallenges = async (params = {}) => {
//     try {
//       const response = await challengeService.getChallenges(params);
//       const transformedChallenges = challengeService.transformChallenges(response.data?.data || []);

//       // Add business challenges from the seeded data if not already loaded
//       const allChallenges = [...transformedChallenges, ...businessChallenges];

//       setChallenges(allChallenges);

//       // Initialize joined list state
//       const joinedState = {};
//       allChallenges.forEach(challenge => {
//         joinedState[challenge.id] = false;
//       });
//       setShowJoinedList(joinedState);

//       return allChallenges;
//     } catch (error) {
//       setError(error.message || 'Failed to load challenges');
//       toast.error('Failed to load challenges');
//       return [];
//     }
//   };

//   // Load user's joined challenges from API
//   const loadUserChallenges = async () => {
//     if (!user) return;

//     try {
//       setIsLoadingUserChallenges(true);
//       const response = await challengeService.getUserChallenges();
//       const transformedChallenges = challengeService.transformChallenges(response.data?.data || []);
//       setUserChallenges(transformedChallenges);
//       return transformedChallenges;
//     } catch (error) {
//       // Don't show error for user challenges as it might be due to not being logged in
//       return [];
//     } finally {
//       setIsLoadingUserChallenges(false);
//     }
//   };

//   // Load daily check-ins for today
//   const loadDailyCheckins = async () => {
//     if (!user) return;

//     try {
//       const today = new Date().toISOString().split('T')[0];
//       const response = await challengeService.getDailyCheckins(today);
//       setDailyCheckins(response.data?.data || []);
//     } catch (error) {
//       // Don't show error for daily check-ins
//     }
//   };

//   // Toggle joined users dropdown
//   const toggleJoinedList = (challengeId) => {
//     setShowJoinedList(prev => ({
//       ...prev,
//       [challengeId]: !prev[challengeId]
//     }));
//   };

//   // Check if user has joined a challenge
//   const hasUserJoinedChallenge = (challengeId) => {
//     if (!user) return false;
//     return userChallenges.some(c => c.id === challengeId);
//   };

//   // Check if user created a challenge
//   const isChallengeCreator = (challenge) => {
//     if (!user) return false;
//     return challenge.createdBy === user.username;
//   };

//   // Get user's progress in a challenge
//   const getUserChallengeProgress = (challengeId) => {
//     if (!user) return { streak: 0, progress: 0 };
//     const userChallenge = userChallenges.find(c => c.id === challengeId);
//     return userChallenge?.userProgress || { streak: 0, progress: 0 };
//   };

//   // Get challenges created by current user
//   const getMyCreatedChallenges = () => {
//     if (!user) return [];
//     return challenges.filter(challenge => challenge.createdBy === user.username);
//   };

//   // Initialize data
//   useEffect(() => {
//     const initializeData = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         // Load challenges from backend API
//         const challengesData = await RealChallengeService.getChallenges();
//         const transformedChallenges = challengesData.challenges || [];
//         setChallenges(transformedChallenges);

//         // Initialize joined list state
//         const joinedState = {};
//         transformedChallenges.forEach(challenge => {
//           joinedState[challenge._id || challenge.id] = false;
//         });
//         setShowJoinedList(joinedState);

//         // Load user's joined challenges and daily check-ins if logged in
//         if (user) {
//           await loadUserChallenges();
//           await loadDailyCheckins();
//         }

//       } catch (error) {
//         setError('Failed to load challenges data');
//         toast.error('Failed to load challenges data');
//         // Set empty challenges array on error
//         setChallenges([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initializeData();
//   }, [user]);

//   // Handle join challenge
//   const joinChallenge = async (challenge) => {
//     if (!user) {
//       toast.error('Please login to join challenges');
//       navigateTo('auth');
//       return;
//     }

//     try {
//       // 1. Show loading state
//       setIsJoining(true);

//       // 2. REAL API CALL to backend
//       const result = await RealChallengeService.joinChallenge(challenge.id);

//       // 3. Update state WITHOUT localStorage
//       setUserChallenges(prev => [...prev, result]);

//       alert(`Successfully joined "${challenge.title}"! Data saved to database.`);

//       // 5. Check Network tab - you should see a REAL HTTP request
//     } catch (error) {
//       alert('Failed to join challenge. Please try again.');
//     } finally {
//       setIsJoining(false);
//     }
//   };

//   // Handle join group
//   const handleJoinGroup = (groupId) => {
//     if (!user) {
//       toast.error('Please login to join groups');
//       return;
//     }

//     const group = groups.find(g => g.id === groupId);
//     if (!group) {
//       toast.error('Group not found');
//       return;
//     }

//     const userGroupsData = loadUserGroups(user.username);

//     // Check if already in group
//     if (userGroupsData.some(g => g.groupId === groupId)) {
//       toast.error('You are already in this group');
//       return;
//     }

//     // Check if group is full
//     if (group.members >= group.maxMembers) {
//       toast.error('This group is full');
//       return;
//     }

//     // Add group to user's groups
//     const newUserGroup = {
//       groupId: group.id,
//       joinedAt: new Date().toISOString(),
//       role: 'member',
//       contributions: 0
//     };

//     const updatedUserGroups = [...userGroupsData, newUserGroup];
//     saveUserGroups(user.username, updatedUserGroups);
//     setUserGroups(updatedUserGroups);

//     // Update group members count
//     const updatedGroups = groups.map(g =>
//       g.id === groupId
//         ? { ...g, members: g.members + 1 }
//         : g
//     );

//     setGroups(updatedGroups);
//     saveGroups(updatedGroups);

//     toast.success(`Successfully joined "${group.name}"!`);
//     setShowJoinGroupModal(false);
//   };

//   // Handle create challenge
//   const handleCreateChallenge = async () => {
//     if (!user) {
//       toast.error('Please login to create challenges');
//       return;
//     }

//     if (!newChallenge.name.trim() || !newChallenge.description.trim()) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     try {
//       setIsJoining(true);

//       // Transform frontend data to backend format
//       const challengeData = {
//         name: newChallenge.name,
//         description: newChallenge.description,
//         duration: newChallenge.duration,
//         type: newChallenge.type,
//         difficulty: newChallenge.difficulty,
//         stake: parseFloat(newChallenge.stake) || 0,
//         prizePool: parseFloat(newChallenge.prizePool) || 0,
//         rules: newChallenge.rules.filter(rule => rule.trim()),
//         isPublic: newChallenge.isPublic,
//         groupId: newChallenge.groupId || null
//       };

//       // Create challenge via API (Note: This endpoint might not exist yet)
//       // For now, we'll show a message that creation is not implemented
//       toast.info('Challenge creation feature coming soon!');

//       // Reset form
//       setNewChallenge({
//         name: '',
//         description: '',
//         duration: 7,
//         type: 'streak',
//         difficulty: 'medium',
//         stake: 0,
//         prizePool: 0,
//         rules: [''],
//         groupId: null,
//         isPublic: true
//       });

//       setShowCreateModal(false);

//     } catch (error) {
//       toast.error(error.message || 'Failed to create challenge');
//     } finally {
//       setIsJoining(false);
//     }
//   };

//   // Handle create group
//   const handleCreateGroup = () => {
//     if (!userData) {
//       toast.error('Please login to create groups');
//       return;
//     }
    
//     if (!newGroup.name.trim() || !newGroup.description.trim()) {
//       toast.error('Please fill in all required fields');
//       return;
//     }
    
//     const group = {
//       id: Date.now(),
//       name: newGroup.name,
//       description: newGroup.description,
//       members: 1, // Creator automatically joins
//       maxMembers: newGroup.maxMembers,
//       createdBy: userData.username,
//       createdAt: new Date().toISOString(),
//       isPublic: newGroup.isPublic,
//       challenges: [],
//       rules: [
//         "Be respectful to all members",
//         "Support each other's journey",
//         "No spam or self-promotion",
//         "Keep discussions positive"
//       ],
//       tags: ["new", "community"]
//     };
    
//     // Add to groups list
//     const updatedGroups = [...groups, group];
//     setGroups(updatedGroups);
//     saveGroups(updatedGroups);
    
//     // Auto-join the group
//     const userGroupsData = loadUserGroups(userData.username);
//     const newUserGroup = {
//       groupId: group.id,
//       joinedAt: new Date().toISOString(),
//       role: 'admin',
//       contributions: 0
//     };
    
//     const updatedUserGroups = [...userGroupsData, newUserGroup];
//     saveUserGroups(userData.username, updatedUserGroups);
//     setUserGroups(updatedUserGroups);
    
//     // Reset form
//     setNewGroup({
//       name: '',
//       description: '',
//       isPublic: true,
//       maxMembers: 50
//     });
    
//     toast.success('Group created successfully! You are now the admin.');
//   };

//   // Handle verify streak for challenge
//   const handleVerifyChallenge = async (challengeId) => {
//     if (!user) {
//       toast.error('Please login to verify');
//       return;
//     }

//     try {
//       setIsJoining(true);

//       // Update progress via API
//       const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
//       await challengeService.updateProgress(challengeId, {
//         date: today,
//         completed: true,
//         notes: 'Verified via challenge page'
//       });

//       // Reload user challenges to get updated progress
//       await loadUserChallenges();

//       toast.success('Challenge progress updated! Keep going!');

//       // Check for milestone achievements
//       const userChallenge = userChallenges.find(c => c.id === challengeId);
//       if (userChallenge) {
//         const currentStreak = userChallenge.userProgress?.streak || 0;
//         if (currentStreak === 7 || currentStreak === 30 || currentStreak === 100) {
//           setShowConfetti(true);
//           setTimeout(() => setShowConfetti(false), 3000);
//           toast.success(`🎉 ${currentStreak}-day milestone achieved in challenge!`, {
//             duration: 5000
//           });
//         }
//       }

//     } catch (error) {
//       toast.error(error.message || 'Failed to update progress');
//     } finally {
//       setIsJoining(false);
//     }
//   };

//   // Filter challenges based on active tab and filters
//   const filteredChallenges = challenges.filter(challenge => {
//     // Tab filter
//     if (activeTab === 'my') {
//       // Show challenges created by current user
//       if (!user) return false;
//       return challenge.createdBy === user.username;
//     }

//     if (activeTab === 'my-challenges') {
//       // Show challenges joined by current user
//       if (!user) return false;
//       return userChallenges.some(c => c.id === challenge.id);
//     }

//     if (activeTab !== 'all' && challenge.status !== activeTab) {
//       return false;
//     }

//     // Search filter
//     if (searchQuery && !challenge.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
//         !challenge.description.toLowerCase().includes(searchQuery.toLowerCase())) {
//       return false;
//     }

//     // Difficulty filter
//     if (filterDifficulty !== 'all' && challenge.difficulty !== filterDifficulty) {
//       return false;
//     }

//     // Type filter
//     if (filterType !== 'all' && challenge.type !== filterType) {
//       return false;
//     }

//     return true;
//   });

//   // Calculate statistics
//   const stats = {
//     totalChallenges: challenges.length,
//     activeParticipants: challenges.reduce((sum, c) => sum + c.participants, 0),
//     totalPrizePool: challenges.reduce((sum, c) => sum + c.prizePool, 0),
//     successRate: 87,
//     activeChallenges: challenges.filter(c => c.status === 'active').length,
//     upcomingChallenges: challenges.filter(c => c.status === 'upcoming').length,
//     completedChallenges: challenges.filter(c => c.status === 'completed').length,
//     totalGroups: groups.length,
//     myChallenges: user ? userChallenges.length : 0,
//     myCreatedChallenges: user ? getMyCreatedChallenges().length : 0,
//     dailyCheckins: dailyCheckins.length
//   };

//   // Quick actions
//   const quickActions = [
//     {
//       id: 1,
//       label: "Dashboard",
//       icon: <Home size={24} />,
//       action: () => navigateTo('dashboard')
//     },
//     {
//       id: 2,
//       label: "Profile",
//       icon: <User size={24} />,
//       action: () => navigateTo('profile')
//     },
//     {
//       id: 3,
//       label: "Verify",
//       icon: <Camera size={24} />,
//       action: () => navigateTo('verify')
//     },
//     {
//       id: 4,
//       label: "Leaderboard",
//       icon: <Trophy size={24} />,
//       action: () => navigateTo('leaderboard')
//     }
//   ];

//   // Mock leaderboard data
//   const leaderboard = [
//     { id: 1, name: "StreakMaster", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=streakmaster", streak: 142, score: 9850, rank: 1 },
//     { id: 2, name: "MindsetWarrior", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mindsetwarrior", streak: 89, score: 7420, rank: 2 },
//     { id: 3, name: "DisciplinePro", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=disciplinepro", streak: 67, score: 5210, rank: 3 },
//     { id: 4, name: "EliteRunner", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=eliterunner", streak: 45, score: 3980, rank: 4 },
//     { id: 5, name: "AccountabilityKing", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=accountabilityking", streak: 32, score: 2850, rank: 5 }
//   ];

//   if (isLoading) {
//     return (
//       <div className="challenges-page">
//         <style>{styles}</style>
        
//         <div className="challenges-bg-grid"></div>
//         <div className="challenges-floating-elements">
//           <div className="challenges-floating-element challenges-float-1"></div>
//           <div className="challenges-floating-element challenges-float-2"></div>
//           <div className="challenges-floating-element challenges-float-3"></div>
//         </div>

//         <nav className="challenges-nav glass">
//           <div className="challenges-nav-container">
//             <button 
//               className="challenges-nav-logo"
//               onClick={() => navigateTo('dashboard')}
//             >
//               <div className="challenges-nav-logo-text">
//                 Touch<span className="challenges-nav-logo-highlight">Grass</span>
//               </div>
//             </button>
            
//             <div className="challenges-nav-button loading-skeleton" style={{ width: '120px', height: '40px' }}></div>
//           </div>
//         </nav>

//         <div className="challenges-header">
//           <div className="challenges-header-container">
//             <div className="loading-skeleton" style={{ height: '80px', width: '400px', marginBottom: '1.5rem', margin: '0 auto' }}></div>
//             <div className="loading-skeleton" style={{ height: '30px', width: '600px', margin: '0 auto' }}></div>
//           </div>
//         </div>

//         <div className="challenges-grid-container">
//           <div className="stats-grid">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="stat-card loading-skeleton" style={{ height: '150px' }}></div>
//             ))}
//           </div>
          
//           <div className="loading-skeleton" style={{ height: '500px', borderRadius: '2rem', marginBottom: '2rem' }}></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="challenges-page">
//       <style>{styles}</style>
      
//       {/* Background Effects */}
//       <div className="challenges-bg-grid"></div>
//       <div className="challenges-floating-elements">
//         <div className="challenges-floating-element challenges-float-1"></div>
//         <div className="challenges-floating-element challenges-float-2"></div>
//         <div className="challenges-floating-element challenges-float-3"></div>
//       </div>

//       {/* Confetti */}
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

//       {/* Navigation */}
//       <nav className="challenges-nav glass">
//         <div className="challenges-nav-container">
//           <button 
//             className="challenges-nav-logo"
//             onClick={() => navigateTo('dashboard')}
//           >
//             <div className="challenges-nav-logo-text">
//               Touch<span className="challenges-nav-logo-highlight">Grass</span>
//             </div>
//           </button>
          
//           <div className="challenges-nav-links">
//             <button className="challenges-nav-link" onClick={() => navigateTo('dashboard')}>
//               Dashboard
//             </button>
//             <button className="challenges-nav-link" onClick={() => navigateTo('profile')}>
//               Profile
//             </button>
//             <button className="challenges-nav-link" onClick={() => navigateTo('verify')}>
//               Verify
//             </button>
//             <button className="challenges-nav-link" onClick={() => navigateTo('leaderboard')}>
//               Leaderboard
//             </button>
//           </div>

//           <div className="flex items-center gap-4">
//             {user ? (
//               <button
//                 className="challenges-nav-button"
//                 onClick={() => setShowCreateModal(true)}
//               >
//                 <Plus size={16} />
//                 Create Challenge
//               </button>
//             ) : (
//               <button
//                 className="challenges-nav-button"
//                 onClick={() => navigateTo('auth')}
//               >
//                 <User size={16} />
//                 Login
//               </button>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* Header */}
//       <header className="challenges-header">
//         <div className="challenges-header-container">
//           <h1 className="challenges-title text-gradient">
//             Challenges & Competitions
//           </h1>
//           <p className="challenges-subtitle">
//             Join challenges, compete with others, build groups, and track your progress. 
//             The ultimate platform for discipline and accountability.
//           </p>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="challenges-grid-container">
//         {/* Stats Grid */}
//         <div className="stats-grid">
//           <div className="stat-card glass">
//             <div className="stat-icon">
//               <Target size={24} />
//             </div>
//             <div className="stat-value">{stats.totalChallenges}</div>
//             <div className="stat-label">Total Challenges</div>
//           </div>
          
//           <div className="stat-card glass">
//             <div className="stat-icon">
//               <Users size={24} />
//             </div>
//             <div className="stat-value">{stats.activeParticipants.toLocaleString()}</div>
//             <div className="stat-label">Active Participants</div>
//           </div>
          
//           <div className="stat-card glass">
//             <div className="stat-icon">
//               <DollarSign size={24} />
//             </div>
//             <div className="stat-value">${stats.totalPrizePool.toLocaleString()}</div>
//             <div className="stat-label">Total Prize Pool</div>
//           </div>
          
//           <div className="stat-card glass">
//             <div className="stat-icon">
//               <TrendingUp size={24} />
//             </div>
//             <div className="stat-value">{stats.successRate}%</div>
//             <div className="stat-label">Success Rate</div>
//           </div>
//         </div>

//         {/* Controls */}
//         <div className="controls-section">
//           <div className="search-filter-section">
//             <div className="search-box">
//               <input
//                 type="text"
//                 className="search-input"
//                 placeholder="Search challenges..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
            
//             <div className="filter-buttons">
//               <button 
//                 className={`filter-button ${filterDifficulty === 'all' ? 'active' : ''}`}
//                 onClick={() => setFilterDifficulty('all')}
//               >
//                 All Levels
//               </button>
//               <button 
//                 className={`filter-button ${filterDifficulty === 'easy' ? 'active' : ''}`}
//                 onClick={() => setFilterDifficulty('easy')}
//               >
//                 Easy
//               </button>
//               <button 
//                 className={`filter-button ${filterDifficulty === 'medium' ? 'active' : ''}`}
//                 onClick={() => setFilterDifficulty('medium')}
//               >
//                 Medium
//               </button>
//               <button 
//                 className={`filter-button ${filterDifficulty === 'hard' ? 'active' : ''}`}
//                 onClick={() => setFilterDifficulty('hard')}
//               >
//                 Hard
//               </button>
//               {/* <button 
//                 className={`filter-button ${filterDifficulty === 'extreme' ? 'active' : ''}`}
//                 onClick={() => setFilterDifficulty('extreme')}
//               >
//                 Extreme
//               </button> */}
//             </div>
//           </div>
          
//           <div className="filter-buttons">
//             {/* <button 
//               className={`filter-button ${filterType === 'all' ? 'active' : ''}`}
//               onClick={() => setFilterType('all')}
//             >
//               All Types
//             </button> */}
//             {/* <button 
//               className={`filter-button ${filterType === 'streak' ? 'active' : ''}`}
//               onClick={() => setFilterType('streak')}
//             >
//               Streak
//             </button> */}
//             {/* <button 
//               className={`filter-button ${filterType === 'mindset' ? 'active' : ''}`}
//               onClick={() => setFilterType('mindset')}
//             >
//               Mindset
//             </button> */}
//             {/* <button 
//               className={`filter-button ${filterType === 'sprint' ? 'active' : ''}`}
//               onClick={() => setFilterType('sprint')}
//             >
//               Sprint
//             </button> */}
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="challenges-tabs">
//           <button 
//             className={`challenges-tab ${activeTab === 'active' ? 'active' : ''}`}
//             onClick={() => setActiveTab('active')}
//           >
//             <Activity size={16} />
//             Active
//             <span className="tab-badge">{stats.activeChallenges}</span>
//           </button>
          
//           <button 
//             className={`challenges-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
//             onClick={() => setActiveTab('upcoming')}
//           >
//             <Calendar size={16} />
//             Upcoming
//             <span className="tab-badge">{stats.upcomingChallenges}</span>
//           </button>
          
//           <button 
//             className={`challenges-tab ${activeTab === 'completed' ? 'active' : ''}`}
//             onClick={() => setActiveTab('completed')}
//           >
//             <CheckCircle2 size={16} />
//             Completed
//             <span className="tab-badge">{stats.completedChallenges}</span>
//           </button>
          
//           <button
//             className={`challenges-tab ${activeTab === 'my' ? 'active' : ''}`}
//             onClick={() => setActiveTab('my')}
//           >
//             <User size={16} />
//             My Created
//             {user && stats.myCreatedChallenges > 0 && (
//               <span className="tab-badge">{stats.myCreatedChallenges}</span>
//             )}
//           </button>

//           <button
//             className={`challenges-tab ${activeTab === 'my-challenges' ? 'active' : ''}`}
//             onClick={() => setActiveTab('my-challenges')}
//           >
//             <Target size={16} />
//             My Challenges
//             {user && stats.myChallenges > 0 && (
//               <span className="tab-badge">{stats.myChallenges}</span>
//             )}
//           </button>
          
//           <button 
//             className={`challenges-tab ${activeTab === 'all' ? 'active' : ''}`}
//             onClick={() => setActiveTab('all')}
//           >
//             <Target size={16} />
//             All Challenges
//           </button>
//         </div>

//         {/* Main Grid */}
//         <div className="challenges-main-grid">
//           {/* Challenges List */}
//           <div className="challenges-list">
//             {filteredChallenges.length > 0 ? (
//               filteredChallenges.map(challenge => {
//                 const hasJoined = hasUserJoinedChallenge(challenge.id);
//                 const isCreator = isChallengeCreator(challenge);
//                 const userProgress = getUserChallengeProgress(challenge.id);
                
//                 return (
//                   <motion.div
//                     key={challenge.id}
//                     className={`challenge-card glass ${challenge.stake > 0 ? 'premium' : ''} ${challenge.featured ? 'featured' : ''}`}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3 }}
//                     onClick={() => {
//                       setSelectedChallenge(challenge);
//                       setShowChallengeDetails(true);
//                     }}
//                   >
//                     <div className="challenge-header">
//                       <h3 className="challenge-title">
//                         {challenge.name}
//                         {isCreator && (
//                           <span className="my-challenge-badge">Created by me</span>
//                         )}
//                       </h3>
//                       <span className={`challenge-status status-${challenge.status}`}>
//                         {challenge.status.toUpperCase()}
//                       </span>
//                     </div>
                    
//                     <p className="challenge-description">{challenge.description}</p>
                    
//                     <div className="challenge-meta">
//                       <div className="meta-item">
//                         <div className="meta-icon">
//                           <Calendar size={16} />
//                         </div>
//                         <div className="meta-content">
//                           <div className="meta-label">Duration</div>
//                           <div className="meta-value">{challenge.duration} days</div>
//                         </div>
//                       </div>
                      
//                       <div className="meta-item">
//                         <div className="meta-icon">
//                           <Users size={16} />
//                         </div>
//                         <div className="meta-content">
//                           <div className="meta-label">Participants</div>
//                           <div className="meta-value">
//                             {challenge.participants}/{challenge.maxParticipants}
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className="meta-item">
//                         <div className="meta-icon">
//                           <Zap size={16} />
//                         </div>
//                         <div className="meta-content">
//                           <div className="meta-label">Difficulty</div>
//                           <div className="meta-value">{challenge.difficulty}</div>
//                         </div>
//                       </div>
                      
//                       <div className="meta-item">
//                         <div className="meta-icon">
//                           <DollarSign size={16} />
//                         </div>
//                         <div className="meta-content">
//                           <div className="meta-label">Prize Pool</div>
//                           <div className="meta-value">${challenge.prizePool.toLocaleString()}</div>
//                         </div>
//                       </div>
//                     </div>
                    
//                     {/* Joined Users Section */}
//                     {challenge.joinedUsers && challenge.joinedUsers.length > 0 && (
//                       <div className="joined-users-section">
//                         <div 
//                           className="joined-header"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             toggleJoinedList(challenge.id);
//                           }}
//                         >
//                           <div className="joined-title">
//                             <Users size={14} />
//                             Joined Users
//                             <span className="joined-count">{challenge.joinedUsers.length}</span>
//                           </div>
//                           {showJoinedList[challenge.id] ? (
//                             <ChevronUp size={16} color="#71717a" />
//                           ) : (
//                             <ChevronDown size={16} color="#71717a" />
//                           )}
//                         </div>
                        
//                         {showJoinedList[challenge.id] && (
//                           <div className="joined-list">
//                             {challenge.joinedUsers.map((user, index) => (
//                               <div key={user.id || index} className="joined-user">
//                                 <img 
//                                   src={user.avatar}
//                                   alt={user.name}
//                                   className="joined-avatar"
//                                 />
//                                 <div className="joined-user-info">
//                                   <div className="joined-user-name">
//                                     {user.name}
//                                     {user.isCreator && (
//                                       <span className="joined-user-badge">Creator</span>
//                                     )}
//                                     {user.isNew && (
//                                       <span className="joined-user-badge">New</span>
//                                     )}
//                                   </div>
//                                   <div className="joined-user-streak">
//                                     <Flame size={10} />
//                                     {user.streak} day streak
//                                   </div>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     )}
                    
//                     <div className="challenge-tags">
//                       <span className="challenge-tag tag-difficulty">
//                         {challenge.difficulty}
//                       </span>
//                       <span className="challenge-tag tag-type">
//                         {challenge.type}
//                       </span>
//                       {challenge.stake > 0 && (
//                         <span className="challenge-tag tag-premium">
//                           Premium
//                         </span>
//                       )}
//                       {challenge.groupId && (
//                         <span className="challenge-tag" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
//                           Group
//                         </span>
//                       )}
//                     </div>
                    
//                     <div className="challenge-progress">
//                       <div className="progress-header">
//                         <span className="progress-label">Progress</span>
//                         <span className="progress-value">
//                           {hasJoined ? `${userProgress.streak}/${challenge.duration} days` : `${challenge.progress}%`}
//                         </span>
//                       </div>
//                       <div className="progress-bar">
//                         <div 
//                           className="progress-fill" 
//                           style={{ 
//                             width: hasJoined 
//                               ? `${(userProgress.streak / challenge.duration) * 100}%`
//                               : `${challenge.progress}%` 
//                           }}
//                         />
//                       </div>
//                     </div>
                    
//                     <div className="challenge-actions">
//                       {hasJoined ? (
//                         <>
//                           <button
//                             className="button button-joined"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               toast.success("You're already in this challenge!");
//                             }}
//                           >
//                             <CheckCircle size={16} />
//                             Joined
//                           </button>

//                           <button
//                             className="button button-success"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleVerifyChallenge(challenge.id);
//                             }}
//                             disabled={isJoining}
//                           >
//                             {isJoining ? (
//                               <>
//                                 <Loader2 size={16} className="animate-spin mr-2" />
//                                 Verifying...
//                               </>
//                             ) : (
//                               <>
//                                 <Camera size={16} />
//                                 Verify Today
//                               </>
//                             )}
//                           </button>
//                         </>
//                       ) : (
//                   <button
//                     className="button button-primary"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       joinChallenge(challenge);
//                     }}
//                     disabled={isJoining}
//                   >
//                     {isJoining ? (
//                       <>
//                         <Loader2 size={16} className="animate-spin mr-2" />
//                         Joining...
//                       </>
//                     ) : (
//                       <>
//                         <UserPlus size={16} />
//                         Join Challenge
//                       </>
//                     )}
//                   </button>
//                       )}
                      
//                       {challenge.groupId && (
//                         <button 
//                           className="button button-secondary"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setSelectedGroup(groups.find(g => g.id === challenge.groupId));
//                             setShowJoinGroupModal(true);
//                           }}
//                         >
//                           <UsersGroup size={16} />
//                           View Group
//                         </button>
//                       )}
//                     </div>
//                   </motion.div>
//                 );
//               })
//             ) : (
//               <div className="empty-state">
//                 <div className="empty-icon">🎯</div>
//                 <div className="empty-title">No Challenges Found</div>
//                 <div className="empty-description">
//                   {searchQuery || filterDifficulty !== 'all' || filterType !== 'all' 
//                     ? 'Try adjusting your search or filters'
//                     : activeTab === 'my'
//                     ? 'You haven\'t created any challenges yet'
//                     : activeTab === 'my-challenges'
//                     ? 'You haven\'t joined any challenges yet'
//                     : 'Be the first to create a challenge!'}
//                 </div>
//                 {!searchQuery && filterDifficulty === 'all' && filterType === 'all' && (
//                   <button 
//                     className="button button-primary"
//                     onClick={() => setShowCreateModal(true)}
//                     style={{ marginTop: '1rem' }}
//                   >
//                     <Plus size={16} />
//                     Create First Challenge
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Sidebar */}
//           <div className="challenges-sidebar">
//             {/* Daily Check-ins */}
//             {user && dailyCheckins.length > 0 && (
//               <section className="groups-section glass">
//                 <div className="section-header">
//                   <h3 className="section-title">
//                     <CheckCircle2 size={20} />
//                     Today's Check-ins
//                   </h3>
//                 </div>

//                 <div className="groups-list">
//                   {dailyCheckins.slice(0, 5).map((checkin, index) => (
//                     <div
//                       key={checkin.id || index}
//                       className="group-item"
//                       onClick={() => {
//                         const challenge = userChallenges.find(c => c.id === checkin.challengeId);
//                         if (challenge) {
//                           setSelectedChallenge(challenge);
//                           setShowChallengeDetails(true);
//                         }
//                       }}
//                     >
//                       <div className="group-icon" style={{ background: checkin.completed ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #fbbf24, #d97706)' }}>
//                         {checkin.completed ? <CheckCircle2 size={20} /> : <Clock size={20} />}
//                       </div>
//                       <div className="group-content">
//                         <div className="group-name">{checkin.challengeName || `Challenge ${checkin.challengeId}`}</div>
//                         <div className="group-meta">
//                           <span>{checkin.completed ? 'Completed' : 'Pending'}</span>
//                           {checkin.streak && <span>🔥 {checkin.streak} streak</span>}
//                         </div>
//                       </div>
//                       <ChevronRight size={16} color="#71717a" />
//                     </div>
//                   ))}

//                   {dailyCheckins.length === 0 && (
//                     <div className="empty-state" style={{ padding: '1rem' }}>
//                       <div className="empty-icon" style={{ fontSize: '1.5rem' }}>✅</div>
//                       <div className="empty-title" style={{ fontSize: '0.875rem' }}>All Done!</div>
//                       <div className="empty-description" style={{ fontSize: '0.75rem' }}>
//                         Great job on your daily check-ins
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </section>
//             )}

//             {/* Quick Actions */}
//             <section className="quick-actions-section glass">
//               <div className="section-header">
//                 <h3 className="section-title">
//                   <Zap size={20} />
//                   Quick Actions
//                 </h3>
//               </div>

//               <div className="quick-actions-grid">
//                 {quickActions.map(action => (
//                   <button
//                     key={action.id}
//                     className="quick-action-button glass"
//                     onClick={action.action}
//                   >
//                     <div className="quick-action-icon">
//                       {action.icon}
//                     </div>
//                     <span className="quick-action-label">{action.label}</span>
//                   </button>
//                 ))}
//               </div>
//             </section>

//             {/* Groups Section */}
//             <section className="groups-section glass">
//               <div className="section-header">
//                 <h3 className="section-title">
//                   <UsersGroup size={20} />
//                   Active Groups
//                 </h3>
//                 <button 
//                   className="section-button"
//                   onClick={() => {
//                     setNewGroup({
//                       name: '',
//                       description: '',
//                       isPublic: true,
//                       maxMembers: 50
//                     });
//                   }}
//                 >
//                   <Plus size={12} />
//                   Create
//                 </button>
//               </div>
              
//               <div className="groups-list">
//                 {groups.slice(0, 3).map(group => (
//                   <div 
//                     key={group.id}
//                     className="group-item"
//                     onClick={() => {
//                       setSelectedGroup(group);
//                       setShowJoinGroupModal(true);
//                     }}
//                   >
//                     <div className="group-icon">
//                       <Users size={20} />
//                     </div>
//                     <div className="group-content">
//                       <div className="group-name">{group.name}</div>
//                       <div className="group-meta">
//                         <span>{group.members} members</span>
//                         <span>{group.isPublic ? 'Public' : 'Private'}</span>
//                       </div>
//                     </div>
//                     <ChevronRight size={16} color="#71717a" />
//                   </div>
//                 ))}
                
//                 {groups.length === 0 && (
//                   <div className="empty-state" style={{ padding: '1rem' }}>
//                     <div className="empty-icon" style={{ fontSize: '1.5rem' }}>👥</div>
//                     <div className="empty-title" style={{ fontSize: '0.875rem' }}>No Groups Yet</div>
//                     <div className="empty-description" style={{ fontSize: '0.75rem' }}>
//                       Create a group to compete together
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </section>

//             {/* Leaderboard */}
//             <section className="leaderboard-section glass">
//               <div className="section-header">
//                 <h3 className="section-title">
//                   <Trophy size={20} />
//                   Top Competitors
//                 </h3>
//                 <button 
//                   className="section-button"
//                   onClick={() => navigateTo('leaderboard')}
//                 >
//                   View All
//                   <ChevronRight size={12} />
//                 </button>
//               </div>
              
//               <div className="leaderboard-list">
//                 {leaderboard.map(player => (
//                   <div key={player.id} className="leaderboard-item">
//                     <div className={`leaderboard-rank rank-${player.rank}`}>
//                       {player.rank}
//                     </div>
//                     <img 
//                       src={player.avatar}
//                       alt={player.name}
//                       className="leaderboard-avatar"
//                     />
//                     <div className="leaderboard-info">
//                       <div className="leaderboard-name">{player.name}</div>
//                       <div className="leaderboard-stats">
//                         <span>🔥 {player.streak} days</span>
//                         <span>🏆 {player.score}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </section>
//           </div>
//         </div>
//       </div>

//       {/* Create Challenge Modal */}
//       {showCreateModal && (
//         <div className="modal-overlay">
//           <motion.div 
//             className="modal-content modal-large glass"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//           >
//             <button 
//               className="modal-close"
//               onClick={() => setShowCreateModal(false)}
//             >
//               ✕
//             </button>
            
//             <div className="modal-header">
//               <div className="modal-icon">
//                 <Plus size={32} />
//               </div>
//               <h2 className="modal-title">Create New Challenge</h2>
//               <p className="modal-subtitle">Design a challenge for others to join and compete</p>
//             </div>
            
//             <div className="form-group">
//               <label className="form-label">Challenge Name *</label>
//               <input
//                 type="text"
//                 className="form-input"
//                 value={newChallenge.name}
//                 onChange={(e) => setNewChallenge({...newChallenge, name: e.target.value})}
//                 placeholder="e.g., 30-Day Discipline Marathon"
//               />
//             </div>
            
//             <div className="form-group">
//               <label className="form-label">Description *</label>
//               <textarea
//                 className="form-textarea"
//                 value={newChallenge.description}
//                 onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
//                 placeholder="Describe your challenge and its goals..."
//                 rows="4"
//               />
//             </div>
            
//             <div className="form-row">
//               <div className="form-group">
//                 <label className="form-label">Duration (Days)</label>
//                 <select
//                   className="form-select"
//                   value={newChallenge.duration}
//                   onChange={(e) => setNewChallenge({...newChallenge, duration: parseInt(e.target.value)})}
//                 >
//                   <option value="1">1 Day (Sprint)</option>
//                   <option value="7">7 Days (Weekly)</option>
//                   <option value="30">30 Days (Monthly)</option>
//                   <option value="90">90 Days (Quarterly)</option>
//                   <option value="365">365 Days (Yearly)</option>
//                 </select>
//               </div>
              
//               <div className="form-group">
//                 <label className="form-label">Challenge Type</label>
//                 <select
//                   className="form-select"
//                   value={newChallenge.type}
//                   onChange={(e) => setNewChallenge({...newChallenge, type: e.target.value})}
//                 >
//                   <option value="streak">Streak Challenge</option>
//                   <option value="mindset">Mindset Challenge</option>
//                   <option value="sprint">Sprint Challenge</option>
//                   <option value="fitness">Fitness Challenge</option>
//                   <option value="productivity">Productivity Challenge</option>
//                 </select>
//               </div>
//             </div>
            
//             <div className="form-row">
//               <div className="form-group">
//                 <label className="form-label">Difficulty Level</label>
//                 <select
//                   className="form-select"
//                   value={newChallenge.difficulty}
//                   onChange={(e) => setNewChallenge({...newChallenge, difficulty: e.target.value})}
//                 >
//                   <option value="easy">Easy</option>
//                   <option value="medium">Medium</option>
//                   <option value="hard">Hard</option>
//                   <option value="extreme">Extreme</option>
//                 </select>
//               </div>
              
//               <div className="form-group">
//                 <label className="form-label">Stake Amount ($)</label>
//                 <input
//                   type="number"
//                   className="form-input"
//                   value={newChallenge.stake}
//                   onChange={(e) => setNewChallenge({...newChallenge, stake: e.target.value})}
//                   placeholder="0 for free challenge"
//                   min="0"
//                   step="0.01"
//                 />
//               </div>
//             </div>
            
//             <div className="form-row">
//               <div className="form-group">
//                 <label className="form-label">Prize Pool ($)</label>
//                 <input
//                   type="number"
//                   className="form-input"
//                   value={newChallenge.prizePool}
//                   onChange={(e) => setNewChallenge({...newChallenge, prizePool: e.target.value})}
//                   placeholder="Total prize money"
//                   min="0"
//                   step="0.01"
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label className="form-label">Assign to Group (Optional)</label>
//                 <select
//                   className="form-select"
//                   value={newChallenge.groupId || ''}
//                   onChange={(e) => setNewChallenge({...newChallenge, groupId: e.target.value ? parseInt(e.target.value) : null})}
//                 >
//                   <option value="">No Group</option>
//                   {groups.map(group => (
//                     <option key={group.id} value={group.id}>{group.name}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
            
//             <div className="form-group">
//               <label className="form-label">Rules & Requirements</label>
//               {newChallenge.rules.map((rule, index) => (
//                 <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
//                   <input
//                     type="text"
//                     className="form-input"
//                     value={rule}
//                     onChange={(e) => {
//                       const newRules = [...newChallenge.rules];
//                       newRules[index] = e.target.value;
//                       setNewChallenge({...newChallenge, rules: newRules});
//                     }}
//                     placeholder={`Rule ${index + 1}`}
//                     style={{ flex: 1 }}
//                   />
//                   {index > 0 && (
//                     <button
//                       type="button"
//                       onClick={() => {
//                         const newRules = newChallenge.rules.filter((_, i) => i !== index);
//                         setNewChallenge({...newChallenge, rules: newRules});
//                       }}
//                       style={{
//                         padding: '0.5rem',
//                         background: 'rgba(239, 68, 68, 0.1)',
//                         border: '1px solid rgba(239, 68, 68, 0.2)',
//                         borderRadius: '0.5rem',
//                         color: '#ef4444',
//                         cursor: 'pointer'
//                       }}
//                     >
//                       <X size={16} />
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button
//                 type="button"
//                 className="button button-secondary"
//                 onClick={() => setNewChallenge({...newChallenge, rules: [...newChallenge.rules, '']})}
//                 style={{ marginTop: '0.5rem' }}
//               >
//                 <Plus size={12} />
//                 Add Rule
//               </button>
//             </div>
            
//             <div className="form-group">
//               <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                 <input
//                   type="checkbox"
//                   checked={newChallenge.isPublic}
//                   onChange={(e) => setNewChallenge({...newChallenge, isPublic: e.target.checked})}
//                 />
//                 Make Challenge Public
//               </label>
//             </div>
            
//             <div className="form-actions">
//               <button 
//                 className="button button-secondary"
//                 onClick={() => setShowCreateModal(false)}
//                 style={{ flex: 1 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="button button-primary"
//                 onClick={handleCreateChallenge}
//                 style={{ flex: 1 }}
//                 disabled={isJoining}
//               >
//                 {isJoining ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
//                     Creating...
//                   </>
//                 ) : (
//                   'Create Challenge'
//                 )}
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}

//       {/* Challenge Details Modal */}
//       {showChallengeDetails && selectedChallenge && (
//         <div className="modal-overlay">
//           <motion.div 
//             className="modal-content modal-large glass challenge-details"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//           >
//             <button 
//               className="modal-close"
//               onClick={() => setShowChallengeDetails(false)}
//             >
//               ✕
//             </button>
            
//             <div className="modal-header">
//               <div className="modal-icon">
//                 <Target size={32} />
//               </div>
//               <h2 className="modal-title">{selectedChallenge.name}</h2>
//               <p className="modal-subtitle">
//                 {selectedChallenge.type.toUpperCase()} • {selectedChallenge.difficulty} • {selectedChallenge.duration} days
//                 {isChallengeCreator(selectedChallenge) && (
//                   <span style={{ color: '#fbbf24', marginLeft: '1rem' }}>⭐ Created by you</span>
//                 )}
//               </p>
//             </div>
            
//             <div className="details-section">
//               <h3 className="details-title">Challenge Description</h3>
//               <p style={{ color: 'white', lineHeight: '1.6' }}>{selectedChallenge.description}</p>
//             </div>
            
//             <div className="form-row">
//               <div className="details-section">
//                 <h3 className="details-title">Challenge Details</h3>
//                 <div className="challenge-meta">
//                   <div className="meta-item">
//                     <div className="meta-icon">
//                       <Calendar size={16} />
//                     </div>
//                     <div className="meta-content">
//                       <div className="meta-label">Duration</div>
//                       <div className="meta-value">{selectedChallenge.duration} days</div>
//                     </div>
//                   </div>
                  
//                   <div className="meta-item">
//                     <div className="meta-icon">
//                       <Users size={16} />
//                     </div>
//                     <div className="meta-content">
//                       <div className="meta-label">Participants</div>
//                       <div className="meta-value">
//                         {selectedChallenge.participants}/{selectedChallenge.maxParticipants}
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="meta-item">
//                     <div className="meta-icon">
//                       <DollarSign size={16} />
//                     </div>
//                     <div className="meta-content">
//                       <div className="meta-label">Prize Pool</div>
//                       <div className="meta-value">${selectedChallenge.prizePool.toLocaleString()}</div>
//                     </div>
//                   </div>
                  
//                   <div className="meta-item">
//                     <div className="meta-icon">
//                       <Crown size={16} />
//                     </div>
//                     <div className="meta-content">
//                       <div className="meta-label">Stake</div>
//                       <div className="meta-value">
//                         {selectedChallenge.stake > 0 ? `$${selectedChallenge.stake}` : 'Free'}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="details-section">
//                 <h3 className="details-title">Your Progress</h3>
//                 <div className="challenge-progress">
//                   <div className="progress-header">
//                     <span className="progress-label">Current Streak</span>
//                     <span className="progress-value">
//                       {user ? (
//                         getUserChallengeProgress(selectedChallenge.id).streak || 0
//                       ) : 0} days
//                     </span>
//                   </div>
//                   <div className="progress-bar">
//                     <div
//                       className="progress-fill"
//                       style={{
//                         width: user
//                           ? `${(getUserChallengeProgress(selectedChallenge.id).streak / selectedChallenge.duration) * 100}%`
//                           : '0%'
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="details-section">
//               <h3 className="details-title">Rules & Requirements</h3>
//               <div className="challenge-rules">
//                 {selectedChallenge.rules.map((rule, index) => (
//                   <div key={index} className="rule-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
//                     <CheckCircle size={14} style={{ color: '#00E5FF', flexShrink: 0, marginTop: '0.125rem' }} />
//                     <span style={{ color: 'white' }}>{rule}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
            
//             {selectedChallenge.groupId && (
//               <div className="details-section">
//                 <h3 className="details-title">Associated Group</h3>
//                 <div className="group-item" style={{ margin: 0 }}>
//                   <div className="group-icon">
//                     <Users size={20} />
//                   </div>
//                   <div className="group-content">
//                     <div className="group-name">
//                       {groups.find(g => g.id === selectedChallenge.groupId)?.name || 'Unknown Group'}
//                     </div>
//                     <div className="group-meta">
//                       <span>
//                         {groups.find(g => g.id === selectedChallenge.groupId)?.members || 0} members
//                       </span>
//                     </div>
//                   </div>
//                   <button 
//                     className="button button-secondary"
//                     onClick={() => {
//                       setShowChallengeDetails(false);
//                       setSelectedGroup(groups.find(g => g.id === selectedChallenge.groupId));
//                       setShowJoinGroupModal(true);
//                     }}
//                   >
//                     View Group
//                   </button>
//                 </div>
//               </div>
//             )}
            
//             <div className="details-section">
//               <h3 className="details-title">Joined Participants</h3>
//               <div className="joined-list" style={{ maxHeight: '300px' }}>
//                 {selectedChallenge.joinedUsers?.map((user, index) => (
//                   <div key={user.id || index} className="joined-user">
//                     <img 
//                       src={user.avatar}
//                       alt={user.name}
//                       className="joined-avatar"
//                     />
//                     <div className="joined-user-info">
//                       <div className="joined-user-name">
//                         {user.name}
//                         {user.isCreator && (
//                           <span className="joined-user-badge">Creator</span>
//                         )}
//                       </div>
//                       <div className="joined-user-streak">
//                         <Flame size={10} />
//                         {user.streak} day streak
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
            
//             <div className="form-actions">
//               <button 
//                 className="button button-secondary"
//                 onClick={() => setShowChallengeDetails(false)}
//               >
//                 Close
//               </button>
              
//               {userData && (
//                 <>
//                   {hasUserJoinedChallenge(selectedChallenge.id) ? (
//                     <button 
//                       className="button button-joined"
//                       onClick={() => {
//                         toast.success("You're already in this challenge!");
//                       }}
//                     >
//                       <CheckCircle size={16} />
//                       Already Joined
//                     </button>
//                   ) : (
//                     <button 
//                       className="button button-primary"
//                       onClick={() => handleJoinChallenge(selectedChallenge)}
//                     >
//                       <UserPlus size={16} />
//                       Join Challenge
//                     </button>
//                   )}
                  
//                   {hasUserJoinedChallenge(selectedChallenge.id) && (
//                     <button
//                       className="button button-success"
//                       onClick={() => handleVerifyChallenge(selectedChallenge.id)}
//                       disabled={isJoining}
//                     >
//                       {isJoining ? (
//                         <>
//                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                           Verifying...
//                         </>
//                       ) : (
//                         <>
//                           <Camera size={16} />
//                           Verify Today
//                         </>
//                       )}
//                     </button>
//                   )}
//                 </>
//               )}
//             </div>
//           </motion.div>
//         </div>
//       )}

//       {/* Join Group Modal */}
//       {showJoinGroupModal && selectedGroup && (
//         <div className="modal-overlay">
//           <motion.div 
//             className="modal-content glass"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//           >
//             <button 
//               className="modal-close"
//               onClick={() => setShowJoinGroupModal(false)}
//             >
//               ✕
//             </button>
            
//             <div className="modal-header">
//               <div className="modal-icon">
//                 <UsersGroup size={32} />
//               </div>
//               <h2 className="modal-title">{selectedGroup.name}</h2>
//               <p className="modal-subtitle">
//                 {selectedGroup.isPublic ? 'Public Group' : 'Private Group'} • {selectedGroup.members} members
//               </p>
//             </div>
            
//             <div className="details-section">
//               <h3 className="details-title">Group Description</h3>
//               <p style={{ color: 'white', lineHeight: '1.6' }}>{selectedGroup.description}</p>
//             </div>
            
//             <div className="details-section">
//               <h3 className="details-title">Group Rules</h3>
//               <div className="challenge-rules">
//                 {selectedGroup.rules.map((rule, index) => (
//                   <div key={index} className="rule-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
//                     <Shield size={14} style={{ color: '#00E5FF', flexShrink: 0, marginTop: '0.125rem' }} />
//                     <span style={{ color: 'white' }}>{rule}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
            
//             <div className="details-section">
//               <h3 className="details-title">Active Challenges</h3>
//               <div className="groups-list">
//                 {challenges
//                   .filter(c => selectedGroup.challenges.includes(c.id))
//                   .map(challenge => (
//                     <div 
//                       key={challenge.id}
//                       className="group-item"
//                       onClick={() => {
//                         setShowJoinGroupModal(false);
//                         setSelectedChallenge(challenge);
//                         setShowChallengeDetails(true);
//                       }}
//                     >
//                       <div className="group-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #3b82f6)' }}>
//                         <Target size={20} />
//                       </div>
//                       <div className="group-content">
//                         <div className="group-name">{challenge.name}</div>
//                         <div className="group-meta">
//                           <span>{challenge.participants} participants</span>
//                           <span>{challenge.difficulty}</span>
//                         </div>
//                       </div>
//                       <ChevronRight size={16} color="#71717a" />
//                     </div>
//                   ))}
//               </div>
//             </div>
            
//             <div className="form-actions">
//               <button 
//                 className="button button-secondary"
//                 onClick={() => setShowJoinGroupModal(false)}
//               >
//                 Close
//               </button>
              
//               {user && (
//                 <button
//                   className="button button-primary"
//                   onClick={() => handleJoinGroup(selectedGroup.id)}
//                 >
//                   <UserPlus size={16} />
//                   Join Group
//                 </button>
//               )}
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Challenges;

import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import ChallengeService from '../services/challengeService';
import RealChallengeService from '../services/realChallengeService';
import {
  Trophy, Users, TrendingUp, Calendar, Target, Sparkles,
  Clock, Award, Activity, Camera, CheckCircle2, Plus,
  Search, Filter, Heart, Zap, ChevronRight, ChevronLeft,
  Eye, UserPlus, Home, User, Edit, MapPin, Bell,
  CheckCircle, ChevronDown, ChevronUp, X, Loader2,
   Mountain, Sun, Moon, Cloud, Wind, Droplets,
  Compass, Map, Footprints, Leaf, Coffee, BookOpen,
  Dumbbell, Brain, Music, Heart as HeartIcon,
  Smile, Star, Flag, Timer, Target as TargetIcon,
  Award as AwardIcon, Clock as ClockIcon,
  TrendingUp as TrendingUpIcon, Users as UsersIcon,
  Calendar as CalendarIcon, Activity as ActivityIcon,
  Zap as ZapIcon, Crown, Target as TargetIcon2,
  Bell as BellIcon, CheckSquare, XSquare, Shield,
  HelpCircle, Info, Gift, Globe, Lock, Watch,
  Smartphone, UploadCloud, Download, Share2,
  MessageCircle, EyeOff, BarChart3, PieChart,
  BarChart, ExternalLink, Mail, Settings,
  LogOut, Briefcase, Coffee as CoffeeIcon,
  BookOpen as BookOpenIcon, Music as MusicIcon,
  Dumbbell as DumbbellIcon, Brain as BrainIcon,
  Heart as HeartIcon2, Sun as SunIcon,
  Moon as MoonIcon, Cloud as CloudIcon,
  Wind as WindIcon, Droplets as DropletsIcon,
  Compass as CompassIcon, Map as MapIcon,
  Footprints as FootprintsIcon, Leaf as LeafIcon,
  Flame, Sunrise, Sunset, CloudRain, ThermometerSun,
  CloudLightning, Snowflake, Waves, Feather,
  Palette, Lightbulb, BrainCircuit, Sparkles as SparklesIcon
} from 'lucide-react';

// ==================== TOUCH GRASS CHALLENGES ====================
const TOUCH_GRASS_CHALLENGES = [
  {
    id: 'challenge-1',
    name: "Morning Grounding",
    type: "mindfulness",
    description: "Start your day standing barefoot on grass for 10 minutes while breathing deeply.",
    duration: 30,
    rules: [
      "10 minutes barefoot on grass",
      "Deep breathing throughout",
      "No phone during routine",
      "Observe 3 things around you"
    ],
    difficulty: "easy",
    icon: "🌅",
    category: "mindfulness",
    participants: 1250,
    maxParticipants: 10000,
    createdBy: "system",
    status: "active",
    joinedUsers: [],
    featured: true,
    createdAt: "2024-01-01"
  },
  {
    id: 'challenge-2',
    name: "Daily Sunset Watch",
    type: "routine",
    description: "Watch sunset every evening without distractions for 15 minutes.",
    duration: 21,
    rules: [
      "15 minutes sunset watch",
      "No screens allowed",
      "Document sky colors",
      "Share one reflection"
    ],
    difficulty: "easy",
    icon: "🌇",
    category: "mindfulness",
    participants: 890,
    maxParticipants: 5000,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-3',
    name: "Park Bench Meditation",
    type: "meditation",
    description: "Meditate on a park bench for 20 minutes daily, focusing on natural sounds.",
    duration: 14,
    rules: [
      "Find different benches",
      "20 minutes meditation",
      "Focus on natural sounds",
      "No guided apps"
    ],
    difficulty: "medium",
    icon: "🧘",
    category: "mindfulness",
    participants: 670,
    maxParticipants: 3000,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-4',
    name: "Tree Identification",
    type: "learning",
    description: "Learn to identify 7 different tree species in your local area.",
    duration: 7,
    rules: [
      "Identify 7 different trees",
      "Take photos of leaves",
      "Learn one fact each",
      "Map their locations"
    ],
    difficulty: "medium",
    icon: "🌳",
    category: "exploration",
    participants: 430,
    maxParticipants: 2000,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-5',
    name: "Silent Nature Walk",
    type: "mindfulness",
    description: "Walk 30 minutes in nature without any technology or talking.",
    duration: 7,
    rules: [
      "30-minute silent walk",
      "No phone or music",
      "Observe 5 details",
      "No talking allowed"
    ],
    difficulty: "medium",
    icon: "🤫",
    category: "mindfulness",
    participants: 980,
    maxParticipants: 5000,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-6',
    name: "Weather Warrior",
    type: "discipline",
    description: "Go outside 15 minutes daily regardless of weather conditions.",
    duration: 30,
    rules: [
      "15 minutes outside daily",
      "No weather excuses",
      "Document conditions",
      "Reflect on experience"
    ],
    difficulty: "hard",
    icon: "🌧️",
    category: "discipline",
    participants: 320,
    maxParticipants: 1500,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-7',
    name: "Digital Sunset",
    type: "detox",
    description: "No screens 1 hour before bed, replace with evening outdoor time.",
    duration: 21,
    rules: [
      "Screens off 60+ minutes",
      "Spend time outside",
      "Stargaze or walk",
      "Track sleep improvements"
    ],
    difficulty: "medium",
    icon: "📵",
    category: "detox",
    participants: 1250,
    maxParticipants: 6000,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-8',
    name: "5-Bench Circuit",
    type: "exploration",
    description: "Visit and sit on 5 different public benches in your neighborhood.",
    duration: 1,
    rules: [
      "Find 5 distinct benches",
      "Sit 3 minutes each",
      "No phone while sitting",
      "Sketch or write about view"
    ],
    difficulty: "easy",
    icon: "🪑",
    category: "exploration",
    participants: 560,
    maxParticipants: 2500,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-9',
    name: "Bird Song Morning",
    type: "awareness",
    description: "Spend 10 minutes each morning identifying bird songs.",
    duration: 14,
    rules: [
      "10 minutes listening daily",
      "Identify 3 bird species",
      "Note time and weather",
      "Use Merlin app for help"
    ],
    difficulty: "easy",
    icon: "🐦",
    category: "awareness",
    participants: 720,
    maxParticipants: 3500,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-10',
    name: "Gratitude Grounding",
    type: "mindfulness",
    description: "Stand on grass and list 10 things you're grateful for daily.",
    duration: 30,
    rules: [
      "Barefoot on grass",
      "List 10 gratitudes",
      "Say them out loud",
      "No repeating items"
    ],
    difficulty: "easy",
    icon: "🙏",
    category: "gratitude",
    participants: 890,
    maxParticipants: 4000,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-11',
    name: "New Trail Every Week",
    type: "exploration",
    description: "Explore a new hiking or walking trail every week.",
    duration: 52,
    rules: [
      "New trail weekly",
      "Minimum 2km distance",
      "Take trail photo",
      "Rate difficulty 1-5"
    ],
    difficulty: "medium",
    icon: "🥾",
    category: "adventure",
    participants: 410,
    maxParticipants: 2000,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-12',
    name: "Urban Nature Hunt",
    type: "exploration",
    description: "Find and document 50 pieces of nature in urban environments.",
    duration: 30,
    rules: [
      "Document 50 nature finds",
      "Urban environments only",
      "Photos required",
      "Identify each find"
    ],
    difficulty: "medium",
    icon: "🏙️",
    category: "exploration",
    participants: 380,
    maxParticipants: 1800,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-13',
    name: "Sunrise Seeker",
    type: "routine",
    description: "Watch sunrise 5 days a week from different locations.",
    duration: 28,
    rules: [
      "Sunrise 5x weekly",
      "Different locations",
      "Arrive 15 minutes early",
      "Journal reflections"
    ],
    difficulty: "hard",
    icon: "🌄",
    category: "discipline",
    participants: 290,
    maxParticipants: 1500,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-14',
    name: "Micro-Season Observer",
    type: "observation",
    description: "Visit same spot daily for 2 weeks, document changes.",
    duration: 14,
    rules: [
      "Same spot daily",
      "5+ minutes observing",
      "One photo per day",
      "Note subtle changes"
    ],
    difficulty: "easy",
    icon: "🔍",
    category: "observation",
    participants: 510,
    maxParticipants: 2500,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-15',
    name: "Neighborhood Flora Map",
    type: "mapping",
    description: "Create map of all significant plants/trees in neighborhood.",
    duration: 7,
    rules: [
      "Map 20+ plants/trees",
      "GPS coordinates",
      "Photos and names",
      "Share with neighbors"
    ],
    difficulty: "medium",
    icon: "🗺️",
    category: "community",
    participants: 270,
    maxParticipants: 1200,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-16',
    name: "Morning Cold Shower",
    type: "discipline",
    description: "Take a cold shower outdoors each morning. Build mental toughness.",
    duration: 14,
    rules: [
      "Cold water only",
      "Outdoor shower preferred",
      "2 minutes minimum",
      "No warm water"
    ],
    difficulty: "hard",
    icon: "🚿",
    category: "discipline",
    participants: 290,
    maxParticipants: 1500,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-17',
    name: "Bird Watching Log",
    type: "awareness",
    description: "Identify and log 5 different bird species daily. Connect with wildlife.",
    duration: 21,
    rules: [
      "5 bird species daily",
      "Log in journal or app",
      "Note behaviors",
      "Take photos if possible"
    ],
    difficulty: "easy",
    icon: "🐦",
    category: "nature",
    participants: 380,
    maxParticipants: 2000,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-18',
    name: "Forest Bathing",
    type: "mindfulness",
    description: "Spend 30 minutes in a forest or wooded area. Practice shinrin-yoku.",
    duration: 14,
    rules: [
      "30 min forest time",
      "All 5 senses engaged",
      "No phone interaction",
      "Slow, deliberate pace"
    ],
    difficulty: "medium",
    icon: "🌲",
    category: "mindfulness",
    participants: 450,
    maxParticipants: 2500,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-19',
    name: "Outdoor Meal Planning",
    type: "routine",
    description: "Plan and prepare one outdoor meal daily. Eat mindfully in nature.",
    duration: 7,
    rules: [
      "One outdoor meal",
      "Sit outside to eat",
      "No distractions",
      "Appreciate the food"
    ],
    difficulty: "easy",
    icon: "🍽️",
    category: "routine",
    participants: 620,
    maxParticipants: 3000,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-20',
    name: "Rock Pool Exploration",
    type: "exploration",
    description: "Visit rock pools and document marine life. Discover ocean treasures.",
    duration: 7,
    rules: [
      "Visit 2 rock pools",
      "Document 5 species",
      "Respect wildlife",
      "Leave no trace"
    ],
    difficulty: "medium",
    icon: "🦀",
    category: "exploration",
    participants: 180,
    maxParticipants: 1000,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-21',
    name: "Sunrise Running",
    type: "fitness",
    description: "Run at sunrise for 30 minutes. Start your day with energy.",
    duration: 21,
    rules: [
      "30 min run at sunrise",
      "Outdoors only",
      "Track distance",
      "No missing days"
    ],
    difficulty: "hard",
    icon: "🌅",
    category: "fitness",
    participants: 540,
    maxParticipants: 3000,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-22',
    name: "Garden Meditation",
    type: "mindfulness",
    description: "Meditate in your garden for 15 minutes. Find peace at home.",
    duration: 30,
    rules: [
      "15 min garden meditation",
      "Same time daily",
      "Focus on plants",
      "No indoor fallback"
    ],
    difficulty: "easy",
    icon: "🌻",
    category: "mindfulness",
    participants: 380,
    maxParticipants: 2000,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-23',
    name: "Beachcombing Adventure",
    type: "exploration",
    description: "Walk along the beach for 30 minutes daily. Collect interesting finds.",
    duration: 14,
    rules: [
      "30 min beach walk",
      "Collect one item",
      "Document findings",
      "Respect wildlife"
    ],
    difficulty: "easy",
    icon: "🏖️",
    category: "exploration",
    participants: 290,
    maxParticipants: 1500,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-24',
    name: "Stargazing Session",
    type: "awareness",
    description: "Spend 20 minutes outdoors stargazing each night. Learn about the cosmos.",
    duration: 21,
    rules: [
      "20 min stargazing",
      "Identify 3 constellations",
      "Note moon phase",
      "No telescope needed"
    ],
    difficulty: "easy",
    icon: "⭐",
    category: "awareness",
    participants: 420,
    maxParticipants: 2500,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-25',
    name: "Outdoor Yoga Flow",
    type: "fitness",
    description: "Practice yoga outdoors for 30 minutes every morning.",
    duration: 30,
    rules: [
      "30 min outdoor yoga",
      "Sunrise preferred",
      "No interruptions",
      "Full body routine"
    ],
    difficulty: "medium",
    icon: "🧘‍♀️",
    category: "fitness",
    participants: 680,
    maxParticipants: 3500,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-26',
    name: "Sound Map Creation",
    type: "awareness",
    description: "Create a sound map of different outdoor locations. Train your auditory awareness.",
    duration: 7,
    rules: [
      "Visit 3 different locations",
      "Map sounds heard",
      "Identify 5+ sounds each",
      "Note time of day"
    ],
    difficulty: "medium",
    icon: "🎵",
    category: "awareness",
    participants: 210,
    maxParticipants: 1200,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-27',
    name: "Outdoor Journaling",
    type: "mindfulness",
    description: "Write in your journal outside for 20 minutes daily. Clear your mind in nature.",
    duration: 30,
    rules: [
      "20 minutes outdoor writing",
      "Nature observation notes",
      "Gratitude entry",
      "No indoor writing"
    ],
    difficulty: "easy",
    icon: "📝",
    category: "mindfulness",
    participants: 410,
    maxParticipants: 2200,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-28',
    name: "Geocaching Adventure",
    type: "exploration",
    description: "Find 10 geocaches in your area. Turn exploration into a treasure hunt.",
    duration: 14,
    rules: [
      "Find 10 geocaches",
      "Log each find",
      "Take proof photos",
      "Explore new areas"
    ],
    difficulty: "medium",
    icon: "🗝️",
    category: "exploration",
    participants: 180,
    maxParticipants: 1000,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-29',
    name: "Outdoor Nap",
    type: "rest",
    description: "Take a 20-minute outdoor nap in a hammock or bench. Rediscover restful sleep.",
    duration: 7,
    rules: [
      "20 min outdoor rest",
      "Nature sounds only",
      "No indoor naps",
      "Fresh air required"
    ],
    difficulty: "easy",
    icon: "😴",
    category: "rest",
    participants: 340,
    maxParticipants: 1800,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-30',
    name: "Photography Walk",
    type: "creativity",
    description: "Take 50 photos during your outdoor walk. Train your photographer's eye.",
    duration: 14,
    rules: [
      "50 photos minimum",
      "Must be outdoors",
      "Different subjects",
      "Review and select best"
    ],
    difficulty: "easy",
    icon: "📸",
    category: "creativity",
    participants: 560,
    maxParticipants: 3000,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-31',
    name: "Mountain Trail Hiking",
    type: "fitness",
    description: "Hike a different mountain trail each week. Conquer heights and build strength.",
    duration: 7,
    rules: [
      "1 trail per week",
      "Document the climb",
      "Note flora and fauna",
      "Reach the summit"
    ],
    difficulty: "hard",
    icon: "🏔️",
    category: "fitness",
    participants: 390,
    maxParticipants: 2000,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-32',
    name: "Dawn Chorus Listening",
    type: "awareness",
    description: "Wake up early to listen to birdsong at dawn. Connect with morning energy.",
    duration: 21,
    rules: [
      "Listen at sunrise",
      "Identify 3 bird songs",
      "No phone interaction",
      "Document species heard"
    ],
    difficulty: "easy",
    icon: "🐤",
    category: "awareness",
    participants: 250,
    maxParticipants: 1500,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-33',
    name: "Wildflower Counting",
    type: "learning",
    description: "Identify and count different wildflower species in your area.",
    duration: 30,
    rules: [
      "Find 10 species",
      "Photo documentation",
      "Note locations",
      "Learn medicinal uses"
    ],
    difficulty: "easy",
    icon: "🌸",
    category: "learning",
    participants: 180,
    maxParticipants: 1000,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-34',
    name: "River Walk Meditation",
    type: "mindfulness",
    description: "Walk alongside a river for 30 minutes while meditating on the water flow.",
    duration: 14,
    rules: [
      "30 min riverside walk",
      "Focus on water sounds",
      "No headphones",
      "Mindful breathing"
    ],
    difficulty: "medium",
    icon: "🌊",
    category: "mindfulness",
    participants: 320,
    maxParticipants: 1800,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-35',
    name: "Cloud Watching",
    type: "creativity",
    description: "Spend 15 minutes daily watching clouds. Let your imagination soar.",
    duration: 7,
    rules: [
      "15 min cloud watching",
      "Identify cloud types",
      "Sketch formations",
      "No indoor viewing"
    ],
    difficulty: "easy",
    icon: "☁️",
    category: "creativity",
    participants: 410,
    maxParticipants: 2200,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-36',
    name: "Urban Nature Hunt",
    type: "exploration",
    description: "Find 10 examples of nature thriving in urban areas. Discover hidden green spaces.",
    duration: 14,
    rules: [
      "Find 10 urban plants",
      "Photo documentation",
      "Map locations",
      "Note species"
    ],
    difficulty: "medium",
    icon: "🌿",
    category: "exploration",
    participants: 290,
    maxParticipants: 1600,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-37',
    name: "Sunset Yoga",
    type: "fitness",
    description: "Practice yoga at sunset for 20 minutes. Wind down with nature.",
    duration: 21,
    rules: [
      "20 min sunset yoga",
      "Outdoors only",
      "Gratitude practice",
      "No indoor fallback"
    ],
    difficulty: "easy",
    icon: "🧘‍♂️",
    category: "fitness",
    participants: 520,
    maxParticipants: 2800,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-38',
    name: "Morning Dew Walk",
    type: "awareness",
    description: "Walk through grass covered in morning dew. Feel the freshness of the day.",
    duration: 14,
    rules: [
      "Walk at dawn",
      "Barefoot preferred",
      "Feel the dew",
      "Document the experience"
    ],
    difficulty: "easy",
    icon: "💧",
    category: "awareness",
    participants: 340,
    maxParticipants: 1800,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-39',
    name: "Full Moon Vigil",
    type: "awareness",
    description: "Spend one night each month under the full moon. Connect with lunar energy.",
    duration: 1,
    rules: [
      "1 hour full moon viewing",
      "Outdoors only",
      "Meditate on moonlight",
      "Journal the experience"
    ],
    difficulty: "easy",
    icon: "🌕",
    category: "awareness",
    participants: 280,
    maxParticipants: 1500,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-40',
    name: "Outdoor Reading Habit",
    type: "learning",
    description: "Read 30 minutes outside daily. Combine learning with nature.",
    duration: 30,
    rules: [
      "30 min outdoor reading",
      "Different locations",
      "Finish one book",
      "Note insights"
    ],
    difficulty: "easy",
    icon: "📚",
    category: "learning",
    participants: 450,
    maxParticipants: 2500,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-41',
    name: "Nature Sound Bath",
    type: "mindfulness",
    description: "Listen to nature sounds for 20 minutes daily. Let nature heal your mind.",
    duration: 21,
    rules: [
      "20 min nature sounds",
      "Eyes closed",
      "No interruptions",
      "Focus on breathing"
    ],
    difficulty: "easy",
    icon: "🎧",
    category: "mindfulness",
    participants: 380,
    maxParticipants: 2000,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-42',
    name: "Trail Running",
    type: "fitness",
    description: "Run on natural trails for 25 minutes. Connect with earth while jogging.",
    duration: 14,
    rules: [
      "25 min trail running",
      "Natural surfaces only",
      "No pavement",
      "Document distance"
    ],
    difficulty: "hard",
    icon: "👟",
    category: "fitness",
    participants: 420,
    maxParticipants: 2200,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-43',
    name: "Morning Stretch Outdoors",
    type: "fitness",
    description: "Stretch for 15 minutes outdoors each morning. Wake up your body with nature.",
    duration: 30,
    rules: [
      "15 min outdoor stretching",
      "Sunrise preferred",
      "Full body routine",
      "No indoor fallback"
    ],
    difficulty: "easy",
    icon: "🤸",
    category: "fitness",
    participants: 580,
    maxParticipants: 3000,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-44',
    name: "Wildlife Photography",
    type: "creativity",
    description: "Capture 25 photos of wildlife in their natural habitat.",
    duration: 14,
    rules: [
      "25 wildlife photos",
      "Must be wild animals",
      "No zoos or pets",
      "Document species"
    ],
    difficulty: "medium",
    icon: "🦊",
    category: "creativity",
    participants: 310,
    maxParticipants: 1700,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-45',
    name: "Outdoor Meditation Trail",
    type: "mindfulness",
    description: "Walk a meditation trail for 20 minutes. Combine movement with mindfulness.",
    duration: 21,
    rules: [
      "20 min meditation walk",
      "Set intentions",
      "Mindful steps",
      "Nature observations"
    ],
    difficulty: "medium",
    icon: "🚶",
    category: "mindfulness",
    participants: 360,
    maxParticipants: 2000,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-46',
    name: "Sunrise Salutation",
    type: "fitness",
    description: "Greet the sunrise with 15 minutes of yoga and stretching.",
    duration: 30,
    rules: [
      "15 min at sunrise",
      "Outdoor practice",
      "Gratitude journaling",
      "No missing days"
    ],
    difficulty: "easy",
    icon: "🙏",
    category: "fitness",
    participants: 490,
    maxParticipants: 2600,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-47',
    name: "Nature Sketching",
    type: "creativity",
    description: "Sketch one nature scene outdoors daily. Train your artistic eye.",
    duration: 30,
    rules: [
      "1 nature sketch daily",
      "Outdoors only",
      "Use any medium",
      "Document location"
    ],
    difficulty: "easy",
    icon: "✏️",
    category: "creativity",
    participants: 280,
    maxParticipants: 1500,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-48',
    name: "Hilltop Meditation",
    type: "mindfulness",
    description: "Climb to a hilltop and meditate for 20 minutes. Rise above and find clarity.",
    duration: 14,
    rules: [
      "Find a hill or elevation",
      "20 min meditation",
      "View while meditating",
      "Reflect on climb"
    ],
    difficulty: "medium",
    icon: "⛰️",
    category: "mindfulness",
    participants: 220,
    maxParticipants: 1200,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-49',
    name: "Night Walk Adventure",
    type: "awareness",
    description: "Take a 20-minute walk after dark. Discover a different side of nature.",
    duration: 7,
    rules: [
      "20 min night walking",
      "Stay safe",
      "Observe nocturnal life",
      "Look at stars"
    ],
    difficulty: "medium",
    icon: "🌙",
    category: "awareness",
    participants: 260,
    maxParticipants: 1400,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-50',
    name: "Picnic Planning",
    type: "routine",
    description: "Have a picnic outdoors once a week. Make dining an adventure.",
    duration: 7,
    rules: [
      "1 outdoor picnic weekly",
      "New location each time",
      "Homemade food preferred",
      "Enjoy the view"
    ],
    difficulty: "easy",
    icon: "🧺",
    category: "routine",
    participants: 420,
    maxParticipants: 2300,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  },
  {
    id: 'challenge-51',
    name: "Outdoor Work Session",
    type: "productivity",
    description: "Work outdoors for 2 hours daily. Boost productivity with fresh air.",
    duration: 14,
    rules: [
      "2 hours outdoor work",
      "Laptop outdoors",
      "Nature background",
      "Document focus levels"
    ],
    difficulty: "medium",
    icon: "💻",
    category: "productivity",
    participants: 350,
    maxParticipants: 2000,
    createdBy: "system",
    status: "active",
    joinedUsers: []
  }
];

// ==================== STORAGE SERVICE ====================
class ChallengeStorageService {
  static KEY_CHALLENGES = 'touchgrass_challenges';
  static KEY_USER_CHALLENGES = 'touchgrass_user_challenges';
  static KEY_USER_PROGRESS = 'touchgrass_user_progress';
  static KEY_DAILY_CHECKINS = 'touchgrass_daily_checkins';

  static saveChallenges(challenges) {
    localStorage.setItem(this.KEY_CHALLENGES, JSON.stringify(challenges));
  }

  static loadChallenges() {
    const stored = localStorage.getItem(this.KEY_CHALLENGES);
    if (stored) {
      return JSON.parse(stored);
    }
    
    this.saveChallenges(TOUCH_GRASS_CHALLENGES);
    return TOUCH_GRASS_CHALLENGES;
  }

  static saveUserChallenges(userId, challenges) {
    const key = `${this.KEY_USER_CHALLENGES}_${userId}`;
    localStorage.setItem(key, JSON.stringify(challenges));
  }

  static loadUserChallenges(userId) {
    const key = `${this.KEY_USER_CHALLENGES}_${userId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }

  static saveUserProgress(userId, challengeId, progress) {
    const key = `${this.KEY_USER_PROGRESS}_${userId}_${challengeId}`;
    localStorage.setItem(key, JSON.stringify(progress));
  }

  static loadUserProgress(userId, challengeId) {
    const key = `${this.KEY_USER_PROGRESS}_${userId}_${challengeId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : {
      streak: 0,
      progress: 0,
      completedDays: [],
      lastCheckin: null,
      joinedAt: null
    };
  }

  static saveDailyCheckin(userId, challengeId, date, data) {
    const key = `${this.KEY_DAILY_CHECKINS}_${userId}`;
    const allCheckins = this.loadDailyCheckins(userId);
    
    const existingIndex = allCheckins.findIndex(
      checkin => checkin.challengeId === challengeId && checkin.date === date
    );
    
    if (existingIndex > -1) {
      allCheckins[existingIndex] = { ...allCheckins[existingIndex], ...data };
    } else {
      allCheckins.push({ challengeId, date, ...data });
    }
    
    localStorage.setItem(key, JSON.stringify(allCheckins));
  }

  static loadDailyCheckins(userId) {
    const key = `${this.KEY_DAILY_CHECKINS}_${userId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }

  static getTodayCheckins(userId) {
    const today = new Date().toISOString().split('T')[0];
    const allCheckins = this.loadDailyCheckins(userId);
    return allCheckins.filter(checkin => checkin.date === today);
  }
}

// ==================== CHALLENGE SERVICE ====================
const MockChallengeService = {
  async getChallenges() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const challenges = ChallengeStorageService.loadChallenges();
        resolve({
          success: true,
          data: challenges,
          message: "Challenges loaded successfully"
        });
      }, 500);
    });
  },

  async joinChallenge(challengeId, userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userChallenges = ChallengeStorageService.loadUserChallenges(userId);
        
        if (userChallenges.some(c => c.id === challengeId)) {
          resolve({
            success: false,
            message: "Already joined this challenge"
          });
          return;
        }

        const allChallenges = ChallengeStorageService.loadChallenges();
        const challenge = allChallenges.find(c => c.id === challengeId);
        
        if (!challenge) {
          resolve({
            success: false,
            message: "Challenge not found"
          });
          return;
        }

        const userChallenge = {
          id: challenge.id,
          name: challenge.name,
          description: challenge.description,
          type: challenge.type,
          duration: challenge.duration,
          difficulty: challenge.difficulty,
          icon: challenge.icon,
          category: challenge.category,
          joinedAt: new Date().toISOString(),
          userProgress: {
            streak: 0,
            progress: 0,
            completedDays: [],
            lastCheckin: null
          }
        };

        userChallenges.push(userChallenge);
        ChallengeStorageService.saveUserChallenges(userId, userChallenges);

        ChallengeStorageService.saveUserProgress(userId, challengeId, {
          streak: 0,
          progress: 0,
          completedDays: [],
          lastCheckin: null,
          joinedAt: new Date().toISOString()
        });

        const updatedChallenges = allChallenges.map(c => 
          c.id === challengeId 
            ? { ...c, participants: c.participants + 1 }
            : c
        );
        ChallengeStorageService.saveChallenges(updatedChallenges);

        resolve({
          success: true,
          message: "Successfully joined challenge",
          data: userChallenge
        });
      }, 300);
    });
  },

  async getUserChallenges(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userChallenges = ChallengeStorageService.loadUserChallenges(userId);
        
        const enhancedChallenges = userChallenges.map(challenge => {
          const progress = ChallengeStorageService.loadUserProgress(userId, challenge.id);
          return {
            ...challenge,
            userProgress: {
              ...challenge.userProgress,
              ...progress
            }
          };
        });

        resolve({
          success: true,
          data: enhancedChallenges,
          message: "User challenges loaded successfully"
        });
      }, 300);
    });
  },

  async verifyProgress(challengeId, userId, data = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const today = new Date().toISOString().split('T')[0];
        const progress = ChallengeStorageService.loadUserProgress(userId, challengeId);
        
        if (progress.completedDays.includes(today)) {
          resolve({
            success: false,
            message: "Already verified today"
          });
          return;
        }

        const completedDays = [...progress.completedDays, today];
        const streak = this.calculateStreak(completedDays);
        const newProgress = Math.round((completedDays.length / (progress.duration || 30)) * 100);
        
        const updatedProgress = {
          ...progress,
          streak,
          progress: newProgress,
          completedDays,
          lastCheckin: today
        };

        ChallengeStorageService.saveUserProgress(userId, challengeId, updatedProgress);

        ChallengeStorageService.saveDailyCheckin(userId, challengeId, today, {
          verified: true,
          timestamp: new Date().toISOString(),
          notes: data.notes || "",
          photo: data.photo || null
        });

        const userChallenges = ChallengeStorageService.loadUserChallenges(userId);
        const updatedUserChallenges = userChallenges.map(challenge => {
          if (challenge.id === challengeId) {
            return {
              ...challenge,
              userProgress: updatedProgress
            };
          }
          return challenge;
        });
        ChallengeStorageService.saveUserChallenges(userId, updatedUserChallenges);

        resolve({
          success: true,
          message: "Progress verified successfully",
          data: updatedProgress
        });
      }, 500);
    });
  },

  calculateStreak(completedDays) {
    if (completedDays.length === 0) return 0;
    
    const sortedDates = completedDays.sort();
    let streak = 1;
    let currentDate = new Date(sortedDates[sortedDates.length - 1]);
    
    for (let i = sortedDates.length - 2; i >= 0; i--) {
      const prevDate = new Date(sortedDates[i]);
      const diffTime = currentDate - prevDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
        currentDate = prevDate;
      } else {
        break;
      }
    }
    
    return streak;
  },

  async createChallenge(userId, challengeData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allChallenges = ChallengeStorageService.loadChallenges();
        
        const newChallenge = {
          id: `user-challenge-${Date.now()}`,
          name: challengeData.name,
          description: challengeData.description,
          type: challengeData.type || "custom",
          duration: challengeData.duration || 7,
          rules: challengeData.rules || [],
          difficulty: challengeData.difficulty || "medium",
          icon: challengeData.icon || "🌱",
          category: challengeData.category || "custom",
          participants: 1,
          maxParticipants: 1000,
          createdBy: userId,
          status: "active",
          joinedUsers: [],
          featured: false,
          createdAt: new Date().toISOString()
        };

        const updatedChallenges = [...allChallenges, newChallenge];
        ChallengeStorageService.saveChallenges(updatedChallenges);

        this.joinChallenge(newChallenge.id, userId);

        resolve({
          success: true,
          message: "Challenge created successfully",
          data: newChallenge
        });
      }, 500);
    });
  }
};

// ==================== MAIN COMPONENT ====================
const Challenges = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('discover');
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChallengeDetails, setShowChallengeDetails] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dailyCheckins, setDailyCheckins] = useState([]);
  const [newChallenge, setNewChallenge] = useState({
    name: '',
    description: '',
    duration: 7,
    rules: [''],
    difficulty: 'medium',
    type: 'custom',
    category: 'custom',
    icon: '🌱'
  });
  const [error, setError] = useState(null);

  const categories = [
    { id: 'all', name: 'All Categories', icon: <Globe size={16} /> },
    { id: 'mindfulness', name: 'Mindfulness', icon: <Brain size={16} /> },
    { id: 'exploration', name: 'Exploration', icon: <Compass size={16} /> },
    { id: 'discipline', name: 'Discipline', icon: <Target size={16} /> },
    { id: 'detox', name: 'Digital Detox', icon: <Smartphone size={16} /> },
    { id: 'fitness', name: 'Fitness', icon: <Dumbbell size={16} /> },
    { id: 'social', name: 'Social', icon: <Users size={16} /> },
    { id: 'community', name: 'Community', icon: <Heart size={16} /> }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels', color: 'from-gray-400 to-gray-600' },
    { id: 'easy', name: 'Easy', color: 'from-green-400 to-emerald-600' },
    { id: 'medium', name: 'Medium', color: 'from-yellow-400 to-amber-600' },
    { id: 'hard', name: 'Hard', color: 'from-red-400 to-rose-600' }
  ];

  const loadData = async () => {
    setIsLoading(true);

    try {
      // Load all available challenges from backend
      const challengesResponse = await RealChallengeService.getChallenges();
      console.log('Challenges response:', challengesResponse);
      
      let loadedChallenges = [];
      if (challengesResponse && challengesResponse.challenges && Array.isArray(challengesResponse.challenges) && challengesResponse.challenges.length > 0) {
        loadedChallenges = challengesResponse.challenges;
        setChallenges(loadedChallenges);
      } else if (challenges.length > 0) {
        // Keep existing challenges if API fails
        loadedChallenges = challenges;
      } else {
        // Fallback to default challenges
        loadedChallenges = TOUCH_GRASS_CHALLENGES;
        setChallenges(loadedChallenges);
      }

      if (user) {
        // Load user's joined challenges from backend
        const userResponse = await RealChallengeService.getMyChallenges();
        console.log('User challenges response:', userResponse);
        if (userResponse && userResponse.success && Array.isArray(userResponse.challenges)) {
          setUserChallenges(userResponse.challenges);
        }

        // Load daily check-ins for today
        const today = new Date().toISOString().split('T')[0];
        const checkinsResponse = await RealChallengeService.getDailyCheckins(today);
        console.log('Daily checkins response:', checkinsResponse);
        if (checkinsResponse && checkinsResponse.success && Array.isArray(checkinsResponse.data)) {
          setDailyCheckins(checkinsResponse.data);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Don't clear challenges on error, keep existing data
      if (challenges.length === 0) {
        setChallenges(TOUCH_GRASS_CHALLENGES);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinChallenge = async (challenge) => {
    if (!user) {
      toast.error('Please login to join challenges');
      navigate('/auth');
      return;
    }

    setIsJoining(true);
    try {
      const response = await RealChallengeService.joinChallenge(challenge.id);
      
      if (response.success) {
        toast.success(`Joined "${challenge.name}"!`);
        await loadData();
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Failed to join challenge');
    } finally {
      setIsJoining(false);
    }
  };

  const handleVerifyProgress = async (challengeId) => {
    if (!user) {
      toast.error('Please login to verify progress');
      return;
    }

    setIsVerifying(true);
    try {
      // Use RealChallengeService which calls the real backend API
      const response = await RealChallengeService.verifyProgress(challengeId, user.id, {
        notes: "Verified via TouchGrass app"
      });

      if (response.success) {
        toast.success('Progress verified! Keep going!');
        
        // Reload user challenges and daily checkins to get updated data from backend
        const userResponse = await RealChallengeService.getMyChallenges();
        if (userResponse.success) {
          setUserChallenges(userResponse.challenges);
        }
        
        // Reload daily check-ins
        const today = new Date().toISOString().split('T')[0];
        const checkinsResponse = await RealChallengeService.getDailyCheckins(today);
        if (checkinsResponse.success) {
          setDailyCheckins(checkinsResponse.data);
        }

        const progress = response.data;
        if (progress.streak === 7 || progress.streak === 30 || progress.streak === 100) {
          toast.success(`🎉 Amazing! ${progress.streak}-day streak!`);
        }
      } else {
        toast.error(response.message || 'Failed to verify progress');
      }
    } catch (error) {
      console.error('Error verifying progress:', error);
      toast.error('Failed to verify progress');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCreateChallenge = async () => {
    if (!user) {
      toast.error('Please login to create challenges');
      return;
    }

    if (!newChallenge.name.trim() || !newChallenge.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsJoining(true);
    try {
      const response = await RealChallengeService.createChallenge(user.id, newChallenge);
      
      if (response.success) {
        toast.success('Challenge created successfully!');
        
        setNewChallenge({
          name: '',
          description: '',
          duration: 7,
          rules: [''],
          difficulty: 'medium',
          type: 'custom',
          category: 'custom',
          icon: '🌱'
        });
        
        setShowCreateModal(false);
        await loadData();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Failed to create challenge');
    } finally {
      setIsJoining(false);
    }
  };

  // Helper function to check if IDs match (handles both id and _id from MongoDB)
  const idsMatch = (id1, id2) => {
    if (!id1 || !id2) return false;
    // Convert to string for comparison
    return String(id1) === String(id2);
  };

  // For 'my-challenges' tab, show userChallenges directly
  // For other tabs, filter from the main challenges array
  const filteredChallenges = activeTab === 'my-challenges' 
    ? userChallenges // Show user's joined challenges directly
    : challenges.filter(challenge => {
        if (searchQuery && !challenge.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !challenge.description.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }

        if (filterDifficulty !== 'all' && challenge.difficulty !== filterDifficulty) {
          return false;
        }

        if (filterCategory !== 'all' && challenge.category !== filterCategory) {
          return false;
        }

        return true;
      });

  const hasUserJoinedChallenge = (challengeId) => {
    if (!user) return false;
    return userChallenges.some(c => 
      idsMatch(c.id, challengeId) || 
      idsMatch(c._id, challengeId) ||
      idsMatch(c.challengeId, challengeId)
    );
  };

  const getUserProgress = (challengeId) => {
    if (!user) return { streak: 0, progress: 0 };
    const userChallenge = userChallenges.find(c => 
      idsMatch(c.id, challengeId) || 
      idsMatch(c._id, challengeId) ||
      idsMatch(c.challengeId, challengeId)
    );
    if (!userChallenge) return { streak: 0, progress: 0 };
    
    // Use backend data directly - totalProgress is the number of days completed
    return {
      streak: userChallenge.currentStreak || userChallenge.streak || 0,
      progress: userChallenge.totalProgress || userChallenge.progress || 0,
      totalDays: userChallenge.totalDays || userChallenge.totalProgress || 0,
      currentStreak: userChallenge.currentStreak || 0,
      totalProgress: userChallenge.totalProgress || 0
    };
  };

  // Check if user has already verified today for a SPECIFIC challenge
  const hasVerifiedToday = (challengeId) => {
    if (!user) return false;
    
    // Find the specific userChallenge that matches this challengeId
    const userChallenge = userChallenges.find(c => 
      idsMatch(c.id, challengeId) || 
      idsMatch(c._id, challengeId) ||
      idsMatch(c.challengeId, challengeId)
    );
    if (!userChallenge) return false;
    
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Check completedToday flag from transformChallenge - THIS IS THE KEY
    if (userChallenge.completedToday === true) {
      return true;
    }
    
    // Check dailyProgress object for today's date - per challenge
    if (userChallenge.dailyProgress && userChallenge.dailyProgress[today]) {
      const dayData = userChallenge.dailyProgress[today];
      // dailyProgress can be boolean or object with completed property
      if (dayData === true || (typeof dayData === 'object' && dayData?.completed === true)) {
        return true;
      }
    }
    
    // Check completedDays array - per challenge
    if (userChallenge.completedDays && Array.isArray(userChallenge.completedDays)) {
      if (userChallenge.completedDays.includes(today)) {
        return true;
      }
    }
    
    // Check lastActivity for today's date - per challenge
    if (userChallenge.lastActivity) {
      const lastActivityDate = new Date(userChallenge.lastActivity).toISOString().split('T')[0];
      if (lastActivityDate === today) {
        return true;
      }
    }
    
    return false;
  };

  const stats = {
    totalChallenges: challenges.length,
    totalParticipants: challenges.reduce((sum, c) => sum + c.participants, 0),
    activeChallenges: userChallenges.length
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // CSS Styles
  const styles = `
    .challenges-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
      position: relative;
      overflow-x: hidden;
    }

    .challenges-page::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 100vh;
      background: 
        radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
      z-index: 0;
      pointer-events: none;
    }

    .challenges-content {
      position: relative;
      z-index: 1;
    }

    /* Header Styles */
    .challenges-header {
      padding-top: 100px;
      padding-bottom: 60px;
      position: relative;
    }

    .header-title {
      font-size: 4rem;
      font-weight: 900;
      background: linear-gradient(135deg, #22c55e 0%, #3b82f6 50%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    @media (max-width: 768px) {
      .header-title {
        font-size: 2.5rem;
      }
    }

    .header-subtitle {
      font-size: 1.25rem;
      color: #94a3b8;
      max-width: 600px;
      margin: 0 auto 3rem;
      text-align: center;
      line-height: 1.6;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      max-width: 600px;
      margin: 0 auto 4rem;
    }

    @media (max-width: 640px) {
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }
    }

    .stat-card {
      background: rgba(30, 41, 59, 0.6);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 1.5rem;
      text-align: center;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      border-color: rgba(34, 197, 94, 0.3);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
    }

    .stat-value:nth-child(1) {
      color: #22c55e;
    }

    .stat-value:nth-child(2) {
      color: #3b82f6;
    }

    .stat-value:nth-child(3) {
      color: #8b5cf6;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #94a3b8;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Tabs */
    .tabs-container {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .tab-button {
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.875rem;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(30, 41, 59, 0.6);
      color: #94a3b8;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .tab-button:hover {
      background: rgba(30, 41, 59, 0.8);
      color: #e2e8f0;
    }

    .tab-button.active {
      background: linear-gradient(135deg, #22c55e 0%, #3b82f6 100%);
      color: white;
      border-color: transparent;
      box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
    }

    .tab-badge {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      font-size: 0.75rem;
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
      margin-left: 0.25rem;
    }

    /* Search and Filters */
    .search-container {
      max-width: 600px;
      margin: 0 auto 2rem;
      position: relative;
    }

    .search-input {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #22c55e;
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
      background: rgba(30, 41, 59, 0.8);
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
    }

    .filters-container {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .filter-select {
      padding: 0.75rem 1rem;
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      font-size: 0.875rem;
      min-width: 150px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .filter-select:focus {
      outline: none;
      border-color: #22c55e;
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    }

    .filter-select option {
      background: #1e293b;
      color: white;
    }

    /* Challenges Grid */
    .challenges-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
      margin-bottom: 4rem;
    }

    @media (max-width: 768px) {
      .challenges-grid {
        grid-template-columns: 1fr;
      }
    }

    .challenge-card {
      background: rgba(30, 41, 59, 0.6);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 1.5rem;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .challenge-card:hover {
      transform: translateY(-5px);
      border-color: rgba(34, 197, 94, 0.3);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .challenge-card.featured::before {
      content: '⭐ FEATURED';
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      z-index: 1;
    }

    .challenge-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .challenge-icon {
      font-size: 2rem;
      margin-right: 0.75rem;
    }

    .challenge-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      margin-bottom: 0.25rem;
      flex: 1;
    }

    .difficulty-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .difficulty-easy {
      background: rgba(34, 197, 94, 0.2);
      color: #22c55e;
    }

    .difficulty-medium {
      background: rgba(245, 158, 11, 0.2);
      color: #f59e0b;
    }

    .difficulty-hard {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }

    .challenge-description {
      color: #94a3b8;
      font-size: 0.875rem;
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }

    .challenge-stats {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #94a3b8;
      font-size: 0.875rem;
    }

    .stat-icon {
      color: #64748b;
    }

    .rules-preview {
      margin-bottom: 1.5rem;
    }

    .rules-title {
      color: #94a3b8;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .rule-item {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }

    .rule-dot {
      width: 6px;
      height: 6px;
      background: #22c55e;
      border-radius: 50%;
      margin-top: 0.5rem;
      flex-shrink: 0;
    }

    .rule-text {
      color: #e2e8f0;
      font-size: 0.75rem;
      line-height: 1.4;
    }

    .progress-container {
      margin-bottom: 1.5rem;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .progress-label {
      color: #94a3b8;
      font-size: 0.875rem;
    }

    .progress-value {
      color: #22c55e;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .progress-bar {
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #22c55e, #3b82f6);
      border-radius: 3px;
      transition: width 0.5s ease;
    }

    .challenge-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .action-button {
      padding: 0.75rem 1rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.875rem;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .action-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .join-button {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
    }

    .join-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
    }

    .verify-button {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: white;
    }

    .verify-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
    }

    .details-button {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .details-button:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      grid-column: 1 / -1;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.5;
    }

    .empty-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 0.5rem;
    }

    .empty-description {
      color: #94a3b8;
      margin-bottom: 2rem;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    /* Modals */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      z-index: 50;
    }

    .modal-content {
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .modal-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 0.5rem;
    }

    .modal-subtitle {
      color: #94a3b8;
      font-size: 0.875rem;
    }

    .modal-close {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: white;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .modal-close:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .modal-body {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      color: white;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .form-input, .form-textarea, .form-select {
      width: 100%;
      padding: 0.75rem 1rem;
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      font-size: 0.875rem;
      transition: all 0.3s ease;
    }

    .form-input:focus, .form-textarea:focus, .form-select:focus {
      outline: none;
      border-color: #22c55e;
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    }

    .form-textarea {
      min-height: 100px;
      resize: vertical;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      padding-top: 1rem;
    }

    .cancel-button {
      flex: 1;
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: 12px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cancel-button:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .submit-button {
      flex: 1;
      padding: 0.75rem 1rem;
      background: linear-gradient(135deg, #22c55e 0%, #3b82f6 100%);
      border: none;
      border-radius: 12px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .submit-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
    }

    .submit-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Details Modal */
    .details-modal {
      max-width: 600px;
    }

    .details-section {
      margin-bottom: 1.5rem;
    }

    .details-section-title {
      font-size: 1rem;
      font-weight: 600;
      color: white;
      margin-bottom: 0.75rem;
    }

    .rules-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .rule-item-large {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.75rem;
      background: rgba(30, 41, 59, 0.6);
      border-radius: 12px;
    }

    .rule-icon-large {
      width: 1.5rem;
      height: 1.5rem;
      background: rgba(34, 197, 94, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .rule-text-large {
      color: #e2e8f0;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    /* Loading State */
    .loading-container {
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loading-spinner {
      width: 3rem;
      height: 3rem;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: #22c55e;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Confetti */
    .confetti-container {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 1000;
    }

    .confetti-piece {
      position: absolute;
      width: 10px;
      height: 10px;
      background: linear-gradient(45deg, #22c55e, #3b82f6, #8b5cf6, #ec4899);
      animation: confetti-fall 2s linear forwards;
    }

    @keyframes confetti-fall {
      0% {
        transform: translateY(-100px) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }

    /* Responsive */
    @media (max-width: 640px) {
      .challenges-grid {
        grid-template-columns: 1fr;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .filters-container {
        flex-direction: column;
      }
      
      .filter-select {
        width: 100%;
      }
      
      .modal-content {
        margin: 1rem;
      }
    }
  `;

  if (isLoading) {
    return (
      <div className="challenges-page">
        <style>{styles}</style>
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="challenges-page">
      <style>{styles}</style>

      {/* Confetti */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1}s`,
                animationDuration: `${Math.random() * 1 + 1}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="challenges-content">
        {/* Header */}
        <header className="challenges-header">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="header-title">Touch Grass Challenges</h1>
              <p className="header-subtitle">
                Build real-world discipline through daily outdoor habits. Join thousands building 
                accountability through the simplest, most powerful habit there is.
              </p>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{stats.totalChallenges}</div>
                  <div className="stat-label">Challenges</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.totalParticipants.toLocaleString()}+</div>
                  <div className="stat-label">Participants</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.activeChallenges}</div>
                  <div className="stat-label">Your Challenges</div>
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 pb-20">
          {/* Tabs */}
          <div className="tabs-container">
            <button
              className={`tab-button ${activeTab === 'discover' ? 'active' : ''}`}
              onClick={() => setActiveTab('discover')}
            >
              <Compass size={18} />
              Discover
            </button>
            {user && (
              <button
                className={`tab-button ${activeTab === 'my-challenges' ? 'active' : ''}`}
                onClick={() => setActiveTab('my-challenges')}
              >
                <Target size={18} />
                My Challenges
                {userChallenges.length > 0 && (
                  <span className="tab-badge">{userChallenges.length}</span>
                )}
              </button>
            )}
            <button
              className={`tab-button ${activeTab === 'trending' ? 'active' : ''}`}
              onClick={() => setActiveTab('trending')}
            >
              <TrendingUp size={18} />
              Trending
            </button>
            {user && (
              <button
                className="tab-button"
                onClick={() => setShowCreateModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  border: 'none'
                }}
              >
                <Plus size={18} />
                Create Challenge
              </button>
            )}
          </div>

          {/* Search */}
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="filters-container">
            <select
              className="filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.id} value={difficulty.id}>
                  {difficulty.name}
                </option>
              ))}
            </select>
          </div>

          {/* Challenges Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="challenges-grid"
            >
              {filteredChallenges.map((challenge, index) => {
                const hasJoined = hasUserJoinedChallenge(challenge.id);
                const progress = getUserProgress(challenge.id);
                
                return (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`challenge-card ${challenge.featured ? 'featured' : ''}`}
                  >
                    <div className="challenge-header">
                      <div className="flex items-start gap-3">
                        <span className="challenge-icon">{challenge.icon}</span>
                        <div>
                          <h3 className="challenge-title">{challenge.name}</h3>
                          <span className={`difficulty-badge difficulty-${challenge.difficulty}`}>
                            {challenge.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="challenge-description">{challenge.description}</p>

                    <div className="challenge-stats">
                      <div className="stat-item">
                        <Users size={16} className="stat-icon" />
                        <span>{challenge.participants.toLocaleString()} joined</span>
                      </div>
                      <div className="stat-item">
                        <Calendar size={16} className="stat-icon" />
                        <span>{challenge.duration} days</span>
                      </div>
                    </div>

                    <div className="rules-preview">
                      <div className="rules-title">Rules:</div>
                      {(Array.isArray(challenge.rules) ? challenge.rules.slice(0, 2) : []).map((rule, i) => (
                        <div key={i} className="rule-item">
                          <div className="rule-dot"></div>
                          <span className="rule-text">{typeof rule === 'string' ? rule : JSON.stringify(rule)}</span>
                        </div>
                      ))}
                      {Array.isArray(challenge.rules) && challenge.rules.length > 2 && (
                        <div className="text-xs text-gray-500 mt-1">
                          +{challenge.rules.length - 2} more rules
                        </div>
                      )}
                    </div>

                    {hasJoined && (
                      <div className="progress-container">
                        <div className="progress-header">
                          <span className="progress-label">Your Progress</span>
                          <span className="progress-value">
                            {progress.streak}/{challenge.duration} days
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ 
                              width: `${(progress.streak / challenge.duration) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="challenge-actions">
                      {hasJoined ? (
                        <>
                          <button
                            onClick={() => handleVerifyProgress(challenge.id)}
                            disabled={isVerifying || hasVerifiedToday(challenge.id)}
                            className={`action-button ${hasVerifiedToday(challenge.id) ? 'button-success' : 'verify-button'}`}
                          >
                            {isVerifying ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                Verifying...
                              </>
                            ) : hasVerifiedToday(challenge.id) ? (
                              <>
                                <CheckCircle size={16} />
                                Done Today
                              </>
                            ) : (
                              <>
                                <Camera size={16} />
                                Verify Today
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedChallenge(challenge);
                              setShowChallengeDetails(true);
                            }}
                            className="action-button details-button"
                          >
                            <Eye size={16} />
                            View Details
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleJoinChallenge(challenge)}
                          disabled={isJoining}
                          className="action-button join-button"
                        >
                          {isJoining ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              Joining...
                            </>
                          ) : (
                            <>
                              <UserPlus size={16} />
                              Join Challenge
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredChallenges.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🌱</div>
              <h3 className="empty-title">No Challenges Found</h3>
              <p className="empty-description">
                {searchQuery 
                  ? `No challenges match "${searchQuery}"`
                  : activeTab === 'my-challenges'
                  ? "You haven't joined any challenges yet"
                  : "Try different filters or create your own challenge!"
                }
              </p>
              {activeTab === 'my-challenges' && (
                <button
                  onClick={() => setActiveTab('discover')}
                  className="action-button join-button"
                  style={{ width: 'auto', padding: '0.75rem 2rem' }}
                >
                  Discover Challenges
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Create Challenge Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-content"
          >
            <button 
              className="modal-close"
              onClick={() => setShowCreateModal(false)}
            >
              <X size={20} />
            </button>
            
            <div className="modal-header">
              <h2 className="modal-title">Create New Challenge</h2>
              <p className="modal-subtitle">Design a challenge for the Touch Grass community</p>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Challenge Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={newChallenge.name}
                  onChange={(e) => setNewChallenge({...newChallenge, name: e.target.value})}
                  placeholder="Morning Grounding Routine"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
                  placeholder="Describe your challenge..."
                  rows="3"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Duration (days)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newChallenge.duration}
                    onChange={(e) => setNewChallenge({...newChallenge, duration: parseInt(e.target.value) || 7})}
                    min="1"
                    max="365"
                  />
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
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Rules (one per line)</label>
                <textarea
                  className="form-textarea"
                  value={newChallenge.rules.join('\n')}
                  onChange={(e) => setNewChallenge({...newChallenge, rules: e.target.value.split('\n').filter(r => r.trim())})}
                  placeholder="Rule 1&#10;Rule 2&#10;Rule 3"
                  rows="4"
                />
              </div>
              
              <div className="form-actions">
                <button
                  className="cancel-button"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="submit-button"
                  onClick={handleCreateChallenge}
                  disabled={isJoining}
                >
                  {isJoining ? (
                    <>
                      <Loader2 size={16} className="animate-spin inline mr-2" />
                      Creating...
                    </>
                  ) : 'Create Challenge'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Challenge Details Modal */}
      {showChallengeDetails && selectedChallenge && (
        <div className="modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-content details-modal"
          >
            <button 
              className="modal-close"
              onClick={() => setShowChallengeDetails(false)}
            >
              <X size={20} />
            </button>
            
            <div className="modal-header">
              <h2 className="modal-title">{selectedChallenge.name}</h2>
              <p className="modal-subtitle">
                <span className={`difficulty-badge difficulty-${selectedChallenge.difficulty}`}>
                  {selectedChallenge.difficulty}
                </span>
                <span className="mx-2">•</span>
                <span>{selectedChallenge.duration} days</span>
                <span className="mx-2">•</span>
                <span>{selectedChallenge.participants.toLocaleString()} participants</span>
              </p>
            </div>
            
            <div className="modal-body">
              <div className="details-section">
                <h3 className="details-section-title">Description</h3>
                <p className="text-gray-300">{selectedChallenge.description}</p>
              </div>
              
              <div className="details-section">
                <h3 className="details-section-title">Rules</h3>
                <div className="rules-list">
                  {selectedChallenge.rules.map((rule, i) => (
                    <div key={i} className="rule-item-large">
                      <div className="rule-icon-large">
                        <CheckCircle size={12} className="text-green-400" />
                      </div>
                      <span className="rule-text-large">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {hasUserJoinedChallenge(selectedChallenge.id) && (
                <div className="details-section">
                  <h3 className="details-section-title">Your Progress</h3>
                  <div className="progress-container">
                    <div className="progress-header">
                      <span className="progress-label">Current Streak</span>
                      <span className="progress-value">
                        {getUserProgress(selectedChallenge.id).streak} days
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${(getUserProgress(selectedChallenge.id).streak / selectedChallenge.duration) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleVerifyProgress(selectedChallenge.id)}
                    disabled={isVerifying || hasVerifiedToday(selectedChallenge.id)}
                    className={`action-button ${hasVerifiedToday(selectedChallenge.id) ? 'button-success' : 'verify-button'} mt-4`}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Verifying...
                      </>
                    ) : hasVerifiedToday(selectedChallenge.id) ? (
                      <>
                        <CheckCircle size={16} />
                        Done Today
                      </>
                    ) : (
                      <>
                        <Camera size={16} />
                        Verify Today's Progress
                      </>
                    )}
                  </button>
                </div>
              )}
              
              <div className="form-actions mt-6">
                <button
                  className="cancel-button"
                  onClick={() => setShowChallengeDetails(false)}
                >
                  Close
                </button>
                {!hasUserJoinedChallenge(selectedChallenge.id) && (
                  <button
                    className="submit-button"
                    onClick={() => handleJoinChallenge(selectedChallenge)}
                    disabled={isJoining}
                  >
                    {isJoining ? (
                      <>
                        <Loader2 size={16} className="animate-spin inline mr-2" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} className="inline mr-2" />
                        Join Challenge
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Challenges;