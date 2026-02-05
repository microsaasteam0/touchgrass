// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { toast } from 'react-hot-toast';
// import { useAuth } from '../contexts/AuthContext';
// import {
//   Bell,
//   Settings,
//   Calendar,
//   Flame,
//   Target,
//   Trophy,
//   Users,
//   TrendingUp,
//   Clock,
//   Share2,
//   Camera,
//   CheckCircle2,
//   Download,
//   Award,
//   Activity,
//   BarChart3,
//   Home,
//   LogOut,
//   Sparkles,
//   Target as TargetIcon2,
//   Compass,
//   MessageSquare,
//   Linkedin,
//   Twitter,
//   Facebook,
//   Instagram,
//   XCircle,
//   Zap,
//   ArrowRight,
//   ExternalLink,
//   User,
//   Edit,
//   MapPin,
//   Mail,
//   ChevronLeft,
//   CheckCircle,
//   X,
//   Plus,
//   Crown,
//   Star,
//   Heart,
//   Brain,
//   Lightbulb,
//   TrendingDown,
//   BarChart,
//   PieChart,
//   Activity as ActivityIcon,
//   Target as TargetIcon,
//   Award as AwardIcon,
//   Users as UsersIcon,
//   Eye,
//   MessageCircle,
//   Globe,
//   FileText,
//   Search,
//   Mic,
//   Shield,
//   Zap as ZapIcon,
//   CalendarDays,
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
//   Target as TargetIcon3,
//   EyeOff,
//   MessageSquare as MessageSquareIcon,
//   DollarSign,
//   ChartBar,
//   UserCheck,
//   Users as UsersGroup,
//   Briefcase,
//   Coffee,
//   BookOpen,
//   Music,
//   Dumbbell,
//   Utensils,
//   Smile,
//   Frown,
//   Meh,
//   Activity as ActivityIcon2,
//   Heart as HeartIcon,
//   Brain as BrainIcon,
//   Target as TargetIcon4,
//   Award as AwardIcon2,
//   Trophy as TrophyIcon,
//   Crown as CrownIcon,
//   Star as StarIcon,
//   Zap as ZapIcon2,
//   Flame as FlameIcon,
//   TrendingUp as TrendingUpIcon,
//   TrendingDown as TrendingDownIcon,
//   BarChart as BarChartIcon,
//   PieChart as PieChartIcon,
//   Activity as ActivityIcon3,
//   Target as TargetIcon5,
//   Award as AwardIcon3,
//   Users as UsersIcon2,
//   Eye as EyeIcon,
//   MessageCircle as MessageCircleIcon,
//   Globe as GlobeIcon,
//   FileText as FileTextIcon,
//   Search as SearchIcon,
//   Mic as MicIcon,
//   Shield as ShieldIcon,
//   Zap as ZapIcon3,
//   CalendarDays as CalendarDaysIcon
// } from 'lucide-react';

// const Profile = ({ onNavigate }) => {
//   // User State
//   const [showAchievement, setShowAchievement] = useState(false);
//   const [showSocialShareModal, setShowSocialShareModal] = useState(false);
//   const [showCreateChallenge, setShowCreateChallenge] = useState(false);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [userData, setUserData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [stats, setStats] = useState([]);
//   const [activities, setActivities] = useState([]);
//   const [socialStats, setSocialStats] = useState([]);
//   const [challenges, setChallenges] = useState([]);
//   const [achievements, setAchievements] = useState([]);
//   const [timeLeft, setTimeLeft] = useState('');
//   const [profileEdit, setProfileEdit] = useState({
//     displayName: '',
//     bio: '',
//     city: '',
//     country: ''
//   });
//   const [newChallenge, setNewChallenge] = useState({
//     name: '',
//     description: '',
//     duration: 7,
//     type: 'mindset',
//     difficulty: 'medium',
//     rules: ['']
//   });
//   const [userChallenges, setUserChallenges] = useState([]);
//   const [activeChallenges, setActiveChallenges] = useState([]);

//   // CSS Styles matching Dashboard
//   const styles = `
//     /* Profile CSS matching dashboard styling */
//     .profile-page {
//       width: 100%;
//       overflow-x: hidden;
//       background: #050505;
//       color: white;
//       font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
//       position: relative;
//       min-height: 100vh;
//     }

//     /* Background Effects */
//     .profile-bg-grid {
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

//     .profile-floating-elements {
//       position: fixed;
//       width: 100%;
//       height: 100%;
//       pointer-events: none;
//       z-index: 1;
//     }

//     .profile-floating-element {
//       position: absolute;
//       border-radius: 50%;
//       filter: blur(40px);
//       opacity: 0.1;
//       animation: float 20s infinite linear;
//     }

//     .profile-float-1 {
//       width: 400px;
//       height: 400px;
//       background: linear-gradient(135deg, #22c55e, #3b82f6);
//       top: 10%;
//       left: 10%;
//       animation-delay: 0s;
//     }

//     .profile-float-2 {
//       width: 300px;
//       height: 300px;
//       background: linear-gradient(135deg, #8b5cf6, #ec4899);
//       top: 60%;
//       right: 15%;
//       animation-delay: -5s;
//     }

//     .profile-float-3 {
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

//     /* Profile Navigation */
//     .profile-nav {
//       position: fixed;
//       top: 0;
//       left: 0;
//       right: 0;
//       z-index: 50;
//       padding: 1rem 1.5rem;
//       border-bottom: 1px solid rgba(255, 255, 255, 0.05);
//       background: rgba(15, 23, 42, 0.95);
//     }

//     .profile-nav-container {
//       max-width: 1400px;
//       margin: 0 auto;
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//     }

//     .profile-nav-logo {
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//     }

//     .profile-nav-logo-text {
//       font-size: 1.5rem;
//       font-weight: 900;
//       letter-spacing: -0.025em;
//       text-transform: uppercase;
//       font-style: italic;
//     }

//     .profile-nav-logo-highlight {
//       color: #00E5FF;
//     }

//     .profile-nav-links {
//       display: none;
//     }

//     @media (min-width: 768px) {
//       .profile-nav-links {
//         display: flex;
//         align-items: center;
//         gap: 2rem;
//       }
//     }

//     .profile-nav-link {
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

//     .profile-nav-link:hover {
//       color: white;
//     }

//     .profile-nav-button {
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

//     .profile-nav-button:hover {
//       transform: scale(1.05);
//       box-shadow: 0 0 20px rgba(0, 229, 255, 0.4);
//     }

//     .profile-nav-button:active {
//       transform: scale(0.95);
//     }

//     /* User Profile Section */
//     .user-profile-header {
//       display: flex;
//       align-items: center;
//       gap: 1rem;
//       padding: 0.75rem 1rem;
//       border-radius: 1rem;
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       cursor: pointer;
//       transition: all 0.2s;
//     }

//     .user-profile-header:hover {
//       background: rgba(255, 255, 255, 0.1);
//       transform: translateY(-2px);
//     }

//     .user-avatar {
//       width: 2.5rem;
//       height: 2.5rem;
//       border-radius: 50%;
//       object-fit: cover;
//       border: 2px solid #00E5FF;
//     }

//     .user-info {
//       display: flex;
//       flex-direction: column;
//       align-items: flex-start;
//     }

//     .user-name {
//       font-size: 0.875rem;
//       font-weight: 700;
//     }

//     .user-status {
//       font-size: 0.625rem;
//       color: #22c55e;
//       display: flex;
//       align-items: center;
//       gap: 0.25rem;
//     }

//     /* Profile Header */
//     .profile-header {
//       padding-top: 8rem;
//       padding-bottom: 4rem;
//       padding-left: 1.5rem;
//       padding-right: 1.5rem;
//       text-align: center;
//       position: relative;
//       z-index: 2;
//     }

//     @media (min-width: 768px) {
//       .profile-header {
//         text-align: left;
//       }
//     }

//     .profile-header-container {
//       max-width: 1400px;
//       margin: 0 auto;
//     }

//     .profile-welcome {
//       font-size: 4rem;
//       font-weight: 900;
//       letter-spacing: -0.025em;
//       line-height: 1;
//       margin-bottom: 1.5rem;
//       text-transform: uppercase;
//       font-style: italic;
//     }

//     .profile-subtitle {
//       font-size: 1.25rem;
//       color: #a1a1aa;
//       max-width: 600px;
//       line-height: 1.75;
//       font-weight: 300;
//     }

//     /* Main Grid */
//     .profile-grid {
//       display: grid;
//       grid-template-columns: 1fr;
//       gap: 2rem;
//       max-width: 1400px;
//       margin: 0 auto;
//       padding: 0 1.5rem 4rem;
//       position: relative;
//       z-index: 2;
//     }

//     @media (min-width: 1024px) {
//       .profile-grid {
//         grid-template-columns: 2fr 1fr;
//       }
//     }

//     /* Main Content */
//     .profile-main-content {
//       display: flex;
//       flex-direction: column;
//       gap: 2rem;
//     }

//     /* Profile Hero */
//     .profile-hero {
//       padding: 3rem;
//       border-radius: 3rem;
//       border: 1px solid rgba(255, 255, 255, 0.05);
//       background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), transparent, rgba(127, 0, 255, 0.1));
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       gap: 2rem;
//       position: relative;
//       overflow: hidden;
//     }

//     @media (min-width: 768px) {
//       .profile-hero {
//         flex-direction: row;
//         align-items: center;
//         justify-content: space-between;
//       }
//     }

//     .profile-visual {
//       position: relative;
//       text-align: center;
//     }

//     .profile-avatar-large {
//       width: 160px;
//       height: 160px;
//       border-radius: 50%;
//       object-fit: cover;
//       border: 4px solid rgba(0, 229, 255, 0.2);
//       margin: 0 auto;
//     }

//     .streak-badge {
//       position: absolute;
//       bottom: 0;
//       right: 0;
//       width: 3rem;
//       height: 3rem;
//       border-radius: 50%;
//       background: linear-gradient(135deg, #ef4444, #dc2626);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-weight: 900;
//       font-size: 1.25rem;
//       border: 3px solid #050505;
//     }

//     .profile-info {
//       flex: 1;
//       text-align: center;
//     }

//     @media (min-width: 768px) {
//       .profile-info {
//         text-align: left;
//       }
//     }

//     .profile-name {
//       font-size: 2rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: -0.025em;
//       margin-bottom: 0.5rem;
//       background: linear-gradient(135deg, #00E5FF 0%, #7F00FF 100%);
//       -webkit-background-clip: text;
//       -webkit-text-fill-color: transparent;
//       background-clip: text;
//     }

//     .profile-bio {
//       color: #71717a;
//       font-size: 1rem;
//       font-weight: 300;
//       line-height: 1.75;
//       margin-bottom: 2rem;
//       max-width: 400px;
//     }

//     .profile-meta {
//       display: flex;
//       flex-wrap: wrap;
//       gap: 1rem;
//       margin-bottom: 2rem;
//     }

//     .meta-item {
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//       font-size: 0.875rem;
//       color: #a1a1aa;
//     }

//     .profile-actions {
//       display: flex;
//       flex-direction: column;
//       gap: 1rem;
//     }

//     @media (min-width: 768px) {
//       .profile-actions {
//         flex-direction: row;
//       }
//     }

//     .profile-button {
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

//     .profile-button:hover {
//       transform: scale(1.05);
//     }

//     .profile-button:active {
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

//     /* Stats Grid */
//     .stats-grid {
//       display: grid;
//       grid-template-columns: repeat(2, 1fr);
//       gap: 1rem;
//     }

//     @media (min-width: 768px) {
//       .stats-grid {
//         grid-template-columns: repeat(3, 1fr);
//       }
//     }

//     .stat-card {
//       padding: 2rem;
//       border-radius: 2rem;
//       border: 1px solid rgba(255, 255, 255, 0.05);
//       display: flex;
//       flex-direction: column;
//       transition: all 0.3s;
//     }

//     .stat-card:hover {
//       transform: translateY(-5px);
//       background: rgba(255, 255, 255, 0.04);
//       border-color: rgba(0, 229, 255, 0.2);
//     }

//     .stat-header {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       margin-bottom: 1.5rem;
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
//     }

//     .stat-change {
//       font-size: 0.625rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//       padding: 0.25rem 0.75rem;
//       border-radius: 9999px;
//       background: rgba(34, 197, 94, 0.1);
//       color: #22c55e;
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

//     .stat-description {
//       font-size: 0.75rem;
//       color: #a1a1aa;
//       margin-top: 0.5rem;
//     }

//     /* Tabs */
//     .profile-tabs {
//       display: flex;
//       gap: 0.5rem;
//       background: rgba(255, 255, 255, 0.05);
//       border-radius: 1rem;
//       padding: 0.5rem;
//       margin-bottom: 2rem;
//     }

//     .profile-tab {
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
//     }

//     .profile-tab:hover {
//       color: white;
//       background: rgba(255, 255, 255, 0.1);
//     }

//     .profile-tab.active {
//       color: white;
//       background: rgba(0, 229, 255, 0.2);
//       border: 1px solid rgba(0, 229, 255, 0.3);
//     }

//     /* Activity Feed */
//     .activity-section {
//       padding: 2.5rem;
//       border-radius: 3rem;
//       border: 1px solid rgba(255, 255, 255, 0.05);
//     }

//     .section-header {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       margin-bottom: 2rem;
//     }

//     .section-title {
//       font-size: 1.5rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: -0.025em;
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//     }

//     .view-all-button {
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
//     }

//     .view-all-button:hover {
//       color: white;
//     }

//     .activity-list {
//       display: flex;
//       flex-direction: column;
//       gap: 1rem;
//     }

//     .activity-item {
//       display: flex;
//       align-items: center;
//       gap: 1rem;
//       padding: 1.5rem;
//       border-radius: 1.5rem;
//       border: 1px solid rgba(255, 255, 255, 0.05);
//       background: rgba(255, 255, 255, 0.01);
//       transition: all 0.3s;
//     }

//     .activity-item:hover {
//       background: rgba(255, 255, 255, 0.03);
//       transform: translateX(5px);
//     }

//     .activity-icon {
//       width: 3rem;
//       height: 3rem;
//       border-radius: 1rem;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       background: rgba(0, 229, 255, 0.1);
//       color: #00E5FF;
//     }

//     .activity-content {
//       flex: 1;
//     }

//     .activity-action {
//       font-weight: 600;
//       margin-bottom: 0.25rem;
//     }

//     .activity-time {
//       font-size: 0.75rem;
//       color: #71717a;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//     }

//     .activity-meta {
//       padding: 0.5rem 1rem;
//       border-radius: 0.75rem;
//       background: rgba(34, 197, 94, 0.1);
//       color: #22c55e;
//       font-size: 0.75rem;
//       font-weight: 700;
//       white-space: nowrap;
//     }

//     /* Challenges Section */
//     .challenges-grid {
//       display: grid;
//       grid-template-columns: repeat(1, 1fr);
//       gap: 1rem;
//     }

//     @media (min-width: 768px) {
//       .challenges-grid {
//         grid-template-columns: repeat(2, 1fr);
//       }
//     }

//     .challenge-card {
//       padding: 2rem;
//       border-radius: 2rem;
//       border: 1px solid rgba(255, 255, 255, 0.05);
//       background: rgba(255, 255, 255, 0.01);
//       transition: all 0.3s;
//       cursor: pointer;
//     }

//     .challenge-card:hover {
//       background: rgba(255, 255, 255, 0.03);
//       transform: translateY(-5px);
//     }

//     .challenge-header {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       margin-bottom: 1rem;
//     }

//     .challenge-type {
//       font-size: 0.625rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//       padding: 0.25rem 0.75rem;
//       border-radius: 9999px;
//     }

//     .type-mindset {
//       background: rgba(139, 92, 246, 0.1);
//       color: #8b5cf6;
//     }

//     .type-business {
//       background: rgba(34, 197, 94, 0.1);
//       color: #22c55e;
//     }

//     .type-emotional {
//       background: rgba(59, 130, 246, 0.1);
//       color: #3b82f6;
//     }

//     .challenge-title {
//       font-size: 1.25rem;
//       font-weight: 900;
//       margin-bottom: 1rem;
//     }

//     .challenge-description {
//       color: #71717a;
//       font-size: 0.875rem;
//       line-height: 1.5;
//       margin-bottom: 1.5rem;
//     }

//     .challenge-rules {
//       display: flex;
//       flex-direction: column;
//       gap: 0.5rem;
//       margin-bottom: 1.5rem;
//     }

//     .rule-item {
//       display: flex;
//       align-items: flex-start;
//       gap: 0.5rem;
//       font-size: 0.75rem;
//       color: #a1a1aa;
//     }

//     .rule-icon {
//       color: #00E5FF;
//       flex-shrink: 0;
//       margin-top: 0.125rem;
//     }

//     .challenge-footer {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//     }

//     .challenge-duration {
//       font-size: 0.75rem;
//       color: #71717a;
//     }

//     /* Create Challenge Modal */
//     .create-challenge-modal {
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

//     .create-challenge-content {
//       width: 100%;
//       max-width: 800px;
//       max-height: 90vh;
//       overflow-y: auto;
//       padding: 3rem;
//       border-radius: 3rem;
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       background: rgba(15, 23, 42, 0.95);
//       position: relative;
//     }

//     .modal-header {
//       text-align: center;
//       margin-bottom: 3rem;
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

//     .form-group {
//       margin-bottom: 2rem;
//     }

//     .form-label {
//       display: block;
//       font-size: 0.75rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//       color: #71717a;
//       margin-bottom: 0.75rem;
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

//     .rule-input-group {
//       display: flex;
//       gap: 0.5rem;
//       margin-bottom: 0.5rem;
//     }

//     .add-rule-button {
//       padding: 0.5rem 1rem;
//       border-radius: 0.75rem;
//       background: rgba(0, 229, 255, 0.1);
//       border: 1px solid rgba(0, 229, 255, 0.2);
//       color: #00E5FF;
//       font-size: 0.75rem;
//       font-weight: 700;
//       cursor: pointer;
//       transition: all 0.2s;
//     }

//     .add-rule-button:hover {
//       background: rgba(0, 229, 255, 0.2);
//     }

//     .form-actions {
//       display: flex;
//       gap: 1rem;
//       margin-top: 2rem;
//     }

//     /* Sidebar */
//     .profile-sidebar {
//       display: flex;
//       flex-direction: column;
//       gap: 2rem;
//     }

//     /* Quick Actions */
//     .quick-actions-section {
//       padding: 2.5rem;
//       border-radius: 3rem;
//       border: 1px solid rgba(255, 255, 255, 0.05);
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

//     /* Achievements */
//     .achievements-grid {
//       display: grid;
//       grid-template-columns: repeat(2, 1fr);
//       gap: 1rem;
//     }

//     .achievement-card {
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       text-align: center;
//       padding: 1.5rem;
//       border-radius: 1.5rem;
//       border: 1px solid rgba(255, 255, 255, 0.05);
//       background: rgba(255, 255, 255, 0.01);
//       cursor: pointer;
//       transition: all 0.3s;
//     }

//     .achievement-card:hover {
//       background: rgba(251, 191, 36, 0.05);
//       transform: scale(1.05);
//       border-color: rgba(251, 191, 36, 0.2);
//     }

//     .achievement-icon {
//       font-size: 2rem;
//       margin-bottom: 1rem;
//     }

//     .achievement-name {
//       font-size: 0.875rem;
//       font-weight: 700;
//       margin-bottom: 0.25rem;
//     }

//     .achievement-earned {
//       font-size: 0.625rem;
//       color: #71717a;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//       margin-bottom: 0.5rem;
//     }

//     .achievement-description {
//       font-size: 0.75rem;
//       color: #a1a1aa;
//     }

//     /* Performance Insights */
//     .performance-section {
//       padding: 2.5rem;
//       border-radius: 3rem;
//       border: 1px solid rgba(255, 255, 255, 0.05);
//       background: linear-gradient(135deg, rgba(127, 0, 255, 0.1), transparent);
//     }

//     /* Social Stats */
//     .social-stats-list {
//       display: flex;
//       flex-direction: column;
//       gap: 1rem;
//     }

//     .social-stat-item {
//       display: flex;
//       align-items: center;
//       gap: 1rem;
//       padding: 1.5rem;
//       border-radius: 1.5rem;
//       border: 1px solid rgba(255, 255, 255, 0.05);
//       background: rgba(255, 255, 255, 0.01);
//     }

//     .social-stat-icon {
//       width: 3rem;
//       height: 3rem;
//       border-radius: 1rem;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//     }

//     .social-stat-content {
//       flex: 1;
//     }

//     .social-stat-platform {
//       font-weight: 600;
//       margin-bottom: 0.25rem;
//     }

//     .social-stat-metrics {
//       display: flex;
//       gap: 1rem;
//       font-size: 0.75rem;
//       color: #71717a;
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
//       padding: 3rem;
//       border-radius: 3rem;
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       background: rgba(15, 23, 42, 0.95);
//       position: relative;
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

//     /* Loading Skeleton */
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
//         case 'verify':
//           window.location.href = '/verify';
//           break;
//         case 'leaderboard':
//           window.location.href = '/leaderboard';
//           break;
//         case 'challenges':
//           window.location.href = '/challenges';
//           break;
//         case 'chat':
//           window.location.href = '/chat';
//           break;
//         case 'settings':
//           window.location.href = '/settings';
//           break;
//         case 'auth':
//           window.location.href = '/auth';
//           break;
//         default:
//       }
//     }
//   };

//   // Load REAL user data from localStorage (same as Dashboard)
//   const loadUserData = () => {
//     try {
//       const storedUser = localStorage.getItem('touchgrass_user');
      
//       if (storedUser) {
//         const user = JSON.parse(storedUser);
//         return user;
//       }
      
//       const authState = localStorage.getItem('authState');
//       if (authState) {
//         const auth = JSON.parse(authState);
//         if (auth.isAuthenticated && auth.user) {
//           const newUser = {
//             id: auth.user.id || Date.now().toString(),
//             username: auth.user.username,
//             displayName: auth.user.displayName || auth.user.username,
//             email: auth.user.email || `${auth.user.username}@example.com`,
//             avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.user.username}`,
//             location: auth.user.location || { city: 'Online', country: 'Internet' },
//             bio: auth.user.bio || `Building daily discipline through outdoor accountability.`,
//             createdAt: new Date().toISOString(),
//             lastActive: new Date().toISOString()
//           };
          
//           localStorage.setItem('touchgrass_user', JSON.stringify(newUser));
//           return newUser;
//         }
//       }
      
//       return null;
//     } catch (error) {
//       return null;
//     }
//   };

//   // Load user's streak data (same as Dashboard)
//   const loadStreakData = (username) => {
//     try {
//       const streakKey = `touchgrass_streak_${username}`;
//       const storedStreak = localStorage.getItem(streakKey);
      
//       if (storedStreak) {
//         const streak = JSON.parse(storedStreak);
//         return streak;
//       }
      
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
      
//       localStorage.setItem(streakKey, JSON.stringify(newStreak));
//       return newStreak;
//     } catch (error) {
//       return null;
//     }
//   };

//   // Load user's challenges
//   const loadUserChallenges = (username) => {
//     try {
//       const challengesKey = `touchgrass_challenges_${username}`;
//       const storedChallenges = localStorage.getItem(challengesKey);
      
//       if (storedChallenges) {
//         const challenges = JSON.parse(storedChallenges);
//         return challenges;
//       }
      
//       const defaultChallenges = [
//         {
//           id: 1,
//           name: "Daily Outdoor Verification",
//           type: "mindset",
//           description: "Verify that you've spent time outdoors every day",
//           duration: "ongoing",
//           progress: 75,
//           rules: ["Spend at least 15 minutes outdoors", "Take a photo as proof", "No excuses allowed"],
//           difficulty: "medium",
//           createdAt: new Date().toISOString(),
//           isActive: true
//         }
//       ];
      
//       localStorage.setItem(challengesKey, JSON.stringify(defaultChallenges));
//       return defaultChallenges;
//     } catch (error) {
//       return [];
//     }
//   };

//   // Save user challenges
//   const saveUserChallenges = (username, challenges) => {
//     try {
//       const challengesKey = `touchgrass_challenges_${username}`;
//       localStorage.setItem(challengesKey, JSON.stringify(challenges));
//     } catch (error) {
//     }
//   };

//   // Save streak data (same as Dashboard)
//   const saveStreakData = (username, streakData) => {
//     try {
//       const streakKey = `touchgrass_streak_${username}`;
//       localStorage.setItem(streakKey, JSON.stringify(streakData));
//     } catch (error) {
//     }
//   };

//   // Update user profile
//   const updateUserProfile = (updatedData) => {
//     try {
//       const storedUser = localStorage.getItem('touchgrass_user');
//       if (storedUser) {
//         const user = JSON.parse(storedUser);
//         const updatedUser = {
//           ...user,
//           ...updatedData,
//           lastActive: new Date().toISOString()
//         };
        
//         localStorage.setItem('touchgrass_user', JSON.stringify(updatedUser));
//         setUserData(updatedUser);
        
//         toast.success('Profile updated successfully!');
//         return true;
//       }
//       return false;
//     } catch (error) {
//       toast.error('Failed to update profile');
//       return false;
//     }
//   };

//   // Check if user verified today (same as Dashboard)
//   const checkTodayVerified = (streakData) => {
//     if (!streakData || !streakData.history) return false;
    
//     const today = new Date().toDateString();
    
//     return streakData.history.some(entry => {
//       if (!entry.date) return false;
//       try {
//         const entryDate = new Date(entry.date);
//         return entryDate.toDateString() === today && entry.verified === true;
//       } catch (e) {
//         return false;
//       }
//     });
//   };

//   // Calculate time left for today's verification (same as Dashboard)
//   const calculateTimeLeft = () => {
//     const now = new Date();
//     const endOfDay = new Date(now);
//     endOfDay.setHours(23, 59, 59, 999);
//     const difference = endOfDay - now;
    
//     const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//   };

//   // Format time ago (same as Dashboard)
//   const timeAgo = (timestamp) => {
//     const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
//     let interval = Math.floor(seconds / 31536000);
//     if (interval >= 1) return `${interval}y ago`;
    
//     interval = Math.floor(seconds / 2592000);
//     if (interval >= 1) return `${interval}mo ago`;
    
//     interval = Math.floor(seconds / 86400);
//     if (interval >= 1) return `${interval}d ago`;
    
//     interval = Math.floor(seconds / 3600);
//     if (interval >= 1) return `${interval}h ago`;
    
//     interval = Math.floor(seconds / 60);
//     if (interval >= 1) return `${interval}m ago`;
    
//     return 'Just now';
//   };

//   // Initialize profile data
//   const initializeProfile = async () => {
//     setIsLoading(true);
    
//     try {
//       const user = loadUserData();
      
//       if (!user) {
//         toast.error('Please login to view your profile');
//         setTimeout(() => navigateTo('auth'), 1500);
//         return;
//       }
      
//       setUserData(user);
      
//       const streakData = loadStreakData(user.username);
//       const userChallengesData = loadUserChallenges(user.username);
      
//       // Update today's verification status
//       streakData.todayVerified = checkTodayVerified(streakData);
//       saveStreakData(user.username, streakData);
      
//       // Calculate days since join
//       const joinDate = new Date(user.createdAt || new Date());
//       const now = new Date();
//       const daysSinceJoin = Math.max(1, Math.floor((now - joinDate) / (1000 * 60 * 60 * 24)));
      
//       // Calculate consistency
//       const consistency = streakData.totalDays > 0 
//         ? Math.min(100, Math.round((streakData.totalDays / daysSinceJoin) * 100))
//         : 0;
      
//       // Prepare stats
//       const calculatedStats = [
//         {
//           id: 1,
//           title: "Current Streak",
//           value: streakData.currentStreak,
//           change: streakData.todayVerified ? "+1" : "0",
//           description: "Consecutive verified days",
//           icon: <Flame size={24} />
//         },
//         {
//           id: 2,
//           title: "Total Time Outside",
//           value: `${Math.floor(streakData.totalOutdoorTime / 60) || 0}h`,
//           change: "+12%",
//           description: "Time spent touching grass",
//           icon: <Clock size={24} />
//         },
//         {
//           id: 3,
//           title: "Consistency",
//           value: `${consistency}%`,
//           change: consistency > 50 ? "+5%" : "0%",
//           description: "Verification rate",
//           icon: <Target size={24} />
//         },
//         {
//           id: 4,
//           title: "Challenges",
//           value: userChallengesData.length,
//           change: "+2",
//           description: "Active challenges",
//           icon: <TargetIcon2 size={24} />
//         },
//         {
//           id: 5,
//           title: "Social Score",
//           value: streakData.viralScore || 0,
//           change: "+8%",
//           description: "Impact on community",
//           icon: <TrendingUp size={24} />
//         },
//         {
//           id: 6,
//           title: "Global Rank",
//           value: `#${Math.floor(Math.random() * 1000) + 1}`,
//           change: streakData.currentStreak > 0 ? "↑12" : "0",
//           description: "Out of 50k users",
//           icon: <Users size={24} />
//         }
//       ];

//       // Prepare activities
//       const recentActivities = [];
      
//       if (streakData.todayVerified) {
//         recentActivities.push({
//           id: 1,
//           action: "Verified today's outdoor time",
//           time: 'Just now',
//           icon: <CheckCircle2 size={20} />,
//           meta: '+1 day'
//         });
//       }
      
//       if (streakData.history && streakData.history.length > 0) {
//         const recentHistory = streakData.history.slice(-3).reverse();
//         recentHistory.forEach((entry, index) => {
//           if (index === 0 && streakData.todayVerified) return;
          
//           const timeText = timeAgo(entry.date);
//           recentActivities.push({
//             id: recentActivities.length + 1,
//             action: `Verified ${entry.activity || 'outdoor time'}`,
//             time: timeText,
//             icon: <CheckCircle2 size={20} />,
//             meta: `+${entry.duration || 30}min`
//           });
//         });
//       }
      
//       if (streakData.shareCount > 0) {
//         recentActivities.push({
//           id: recentActivities.length + 1,
//           action: 'Shared achievement on social media',
//           time: '4 hours ago',
//           icon: <Share2 size={20} />,
//           meta: `+${streakData.shareCount} shares`
//         });
//       }

//       // Set social stats
//       const socialPlatforms = [
//         {
//           id: 1,
//           platform: "Twitter",
//           icon: <Twitter size={20} />,
//           color: "rgba(29, 161, 242, 0.2)",
//           metrics: `${Math.min(streakData.shareCount, 24)} Shares • 1.2K Views`
//         },
//         {
//           id: 2,
//           platform: "LinkedIn",
//           icon: <Linkedin size={20} />,
//           color: "rgba(0, 119, 181, 0.2)",
//           metrics: `${Math.min(streakData.shareCount, 18)} Shares • 420 Views`
//         },
//         {
//           id: 3,
//           platform: "Instagram",
//           icon: <Instagram size={20} />,
//           color: "rgba(225, 48, 108, 0.2)",
//           metrics: `${Math.min(streakData.shareCount, 12)} Shares • 780 Likes`
//         }
//       ];

//       // Set predefined challenges (from your list)
//       const predefinedChallenges = [
//         {
//           id: 1,
//           name: "No Complaining / No Excuses Week",
//           type: "mindset",
//           description: "For 7 days, ban all complaints and excuses. Every time you catch yourself, state one actionable step to improve the situation.",
//           duration: 7,
//           rules: [
//             "No complaining about anything",
//             "No excuses for not completing tasks",
//             "When you slip, state one actionable improvement step",
//             "Track slips in a journal"
//           ],
//           difficulty: "hard",
//           icon: "🧠"
//         },
//         {
//           id: 2,
//           name: "First Principles Week",
//           type: "mindset",
//           description: "For every major problem or assumption, break it down to fundamental truths and rebuild from there.",
//           duration: 7,
//           rules: [
//             "Question everything 'why' at least 5 times",
//             "Break down 3 major assumptions daily",
//             "Rebuild solutions from first principles",
//             "Document insights"
//           ],
//           difficulty: "medium",
//           icon: "🔍"
//         },
//         {
//           id: 3,
//           name: "Emotional Weather Report",
//           type: "emotional",
//           description: "Three times daily, pause and name your emotional state with one word. No judgment, just observation.",
//           duration: 30,
//           rules: [
//             "Morning, afternoon, evening check-ins",
//             "One-word emotional state",
//             "No judgment or analysis",
//             "Track patterns weekly"
//           ],
//           difficulty: "easy",
//           icon: "⛅"
//         },
//         {
//           id: 4,
//           name: "Deliberate Discomfort Daily",
//           type: "mindset",
//           description: "Do one thing daily that pushes you slightly outside your comfort zone, especially socially.",
//           duration: "ongoing",
//           rules: [
//             "One uncomfortable action daily",
//             "Focus on social situations",
//             "Document your fears and outcomes",
//             "Increase difficulty weekly"
//           ],
//           difficulty: "medium",
//           icon: "🚀"
//         },
//         {
//           id: 5,
//           name: "10 Customer Calls Challenge",
//           type: "business",
//           description: "Every week, have 10 conversations with potential or current users. No selling, just ask 'Why?' and 'Tell me more.'",
//           duration: "weekly",
//           rules: [
//             "10 conversations weekly",
//             "No selling allowed",
//             "Focus on understanding needs",
//             "Document all insights"
//           ],
//           difficulty: "hard",
//           icon: "📞"
//         },
//         {
//           id: 6,
//           name: "Perfect Week Role Play",
//           type: "business",
//           description: "Spend one week living exactly as your ideal customer does. Use their tools, read their forums, follow their routines.",
//           duration: 7,
//           rules: [
//             "Live as your customer for a week",
//             "Use their tools and platforms",
//             "Follow their daily routines",
//             "Develop empathy insights"
//           ],
//           difficulty: "hard",
//           icon: "🎭"
//         },
//         {
//           id: 7,
//           name: "Fake Door Test",
//           type: "business",
//           description: "Create a mock-up or button for a feature and see how many people try to access it. Validate demand with zero code.",
//           duration: 14,
//           rules: [
//             "Create feature mock-up",
//             "Add 'coming soon' button",
//             "Track clicks and interest",
//             "Survey interested users"
//           ],
//           difficulty: "medium",
//           icon: "🚪"
//         },
//         {
//           id: 8,
//           name: "Competitor Love Letter",
//           type: "business",
//           description: "Write a detailed analysis of your top competitor, listing everything they do better than you.",
//           duration: 3,
//           rules: [
//             "Analyze top competitor",
//             "List everything they do better",
//             "Identify opportunity gaps",
//             "Create improvement plan"
//           ],
//           difficulty: "easy",
//           icon: "💌"
//         }
//       ];

//       // Prepare achievements
//       const userAchievements = [];
//       if (streakData.currentStreak >= 7) {
//         userAchievements.push({
//           id: 1,
//           name: "Weekly Warrior",
//           icon: "🔥",
//           earned: "Today",
//           description: "7 consecutive days"
//         });
//       }
//       if (streakData.shareCount >= 10) {
//         userAchievements.push({
//           id: 2,
//           name: "Social Butterfly",
//           icon: "🦋",
//           earned: "2 days ago",
//           description: "shares"
//         });
//       }
//       if (streakData.totalDays >= 30) {
//         userAchievements.push({
//           id: 3,
//           name: "Monthly Master",
//           icon: "🌟",
//           earned: "This month",
//           description: "30-day streak"
//         });
//       }
//       if (streakData.totalDays >= 100) {
//         userAchievements.push({
//           id: 4,
//           name: "Century Club",
//           icon: "💯",
//           earned: "Achieved",
//           description: "100 total days"
//         });
//       }

//       setStats(calculatedStats);
//       setActivities(recentActivities);
//       setSocialStats(socialPlatforms);
//       setChallenges(predefinedChallenges);
//       setUserChallenges(userChallengesData);
//       setAchievements(userAchievements);
      
//       // Set active challenges (from user's challenges)
//       setActiveChallenges(userChallengesData.filter(challenge => challenge.isActive));
      
      
//     } catch (error) {
//       toast.error('Failed to load profile data');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle create challenge
//   const handleCreateChallenge = () => {
//     if (!userData) {
//       toast.error('Please login to create a challenge');
//       return;
//     }
    
//     if (!newChallenge.name.trim() || !newChallenge.description.trim()) {
//       toast.error('Please fill in all required fields');
//       return;
//     }
    
//     const challenge = {
//       id: Date.now(),
//       name: newChallenge.name,
//       type: newChallenge.type,
//       description: newChallenge.description,
//       duration: newChallenge.duration,
//       rules: newChallenge.rules.filter(rule => rule.trim()),
//       difficulty: newChallenge.difficulty,
//       createdAt: new Date().toISOString(),
//       isActive: true,
//       createdBy: userData.username
//     };
    
//     const updatedChallenges = [...userChallenges, challenge];
//     saveUserChallenges(userData.username, updatedChallenges);
//     setUserChallenges(updatedChallenges);
//     setActiveChallenges(updatedChallenges.filter(c => c.isActive));
    
//     setNewChallenge({
//       name: '',
//       description: '',
//       duration: 7,
//       type: 'mindset',
//       difficulty: 'medium',
//       rules: ['']
//     });
    
//     setShowCreateChallenge(false);
//     toast.success('Challenge created successfully!');
//   };

//   // Handle join challenge
//   const handleJoinChallenge = (challenge) => {
//     if (!userData) {
//       toast.error('Please login to join challenges');
//       return;
//     }
    
//     const joinedChallenge = {
//       ...challenge,
//       id: Date.now(),
//       joinedAt: new Date().toISOString(),
//       isActive: true,
//       progress: 0,
//       userId: userData.username
//     };
    
//     const updatedChallenges = [...userChallenges, joinedChallenge];
//     saveUserChallenges(userData.username, updatedChallenges);
//     setUserChallenges(updatedChallenges);
//     setActiveChallenges(updatedChallenges.filter(c => c.isActive));
    
//     toast.success(`Joined "${challenge.name}" challenge!`);
//   };

//   // Handle share profile
//   const handleShareProfile = (platform) => {
//     if (!userData) {
//       toast.error('Please login to share');
//       return;
//     }
    
//     const streakData = loadStreakData(userData.username);
//     const shareUrl = `${window.location.origin}/profile`;
    
//     const shareTexts = {
//       twitter: `👤 ${userData.displayName}'s TouchGrass Profile - ${streakData.currentStreak}-day streak! Check out my progress: ${shareUrl} #TouchGrass #Streak #Profile`,
//       linkedin: `${userData.displayName}'s TouchGrass Profile - Building discipline through daily outdoor verification. ${streakData.currentStreak}-day streak and counting! ${shareUrl}`,
//       facebook: `Check out my TouchGrass profile! ${streakData.currentStreak}-day streak of outdoor discipline. ${shareUrl}`,
//       instagram: `👤 My TouchGrass Profile 📊\n${streakData.currentStreak}-day streak\nJoin me in building real-world discipline!\n${shareUrl}\n#TouchGrass #Discipline #Streak`
//     };

//     const shareConfigs = {
//       twitter: {
//         url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTexts.twitter)}&url=${encodeURIComponent(shareUrl)}`,
//         name: 'Twitter'
//       },
//       linkedin: {
//         url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
//         name: 'LinkedIn'
//       },
//       facebook: {
//         url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTexts.facebook)}`,
//         name: 'Facebook'
//       }
//     };

//     const config = shareConfigs[platform];
//     if (!config) {
//       if (platform === 'instagram') {
//         toast('📸 For Instagram: Take a screenshot of your profile and share it as a story!', {
//           icon: '📸',
//           duration: 4000
//         });
//         return;
//       } else if (platform === 'copy') {
//         navigator.clipboard.writeText(shareUrl);
//         toast.success('Profile link copied to clipboard!');
//         return;
//       }
//       return;
//     }

//     window.open(config.url, '_blank', 'width=600,height=400');
//     toast.success(`Shared to ${config.name}!`);
//   };

//   // Handle edit profile
//   const handleEditProfile = () => {
//     if (!userData) return;
    
//     setProfileEdit({
//       displayName: userData.displayName || '',
//       bio: userData.bio || '',
//       city: userData.location?.city || '',
//       country: userData.location?.country || ''
//     });
//   };

//   // Save profile edits
//   const saveProfileEdits = () => {
//     if (!userData) return;
    
//     const updatedData = {
//       displayName: profileEdit.displayName || userData.displayName,
//       bio: profileEdit.bio || userData.bio,
//       location: {
//         city: profileEdit.city || userData.location?.city || 'Online',
//         country: profileEdit.country || userData.location?.country || 'Internet'
//       }
//     };
    
//     if (updateUserProfile(updatedData)) {
//       setProfileEdit({
//         displayName: '',
//         bio: '',
//         city: '',
//         country: ''
//       });
//     }
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
//       label: "Verify",
//       icon: <Camera size={24} />,
//       action: () => navigateTo('verify')
//     },
//     {
//       id: 3,
//       label: "Challenges",
//       icon: <TargetIcon2 size={24} />,
//       action: () => navigateTo('challenges')
//     },
//     {
//       id: 4,
//       label: "Share",
//       icon: <Share2 size={24} />,
//       action: () => setShowSocialShareModal(true)
//     }
//   ];

//   // Initialize profile on mount
//   useEffect(() => {
//     initializeProfile();
    
//     const timer = setInterval(() => {
//       setTimeLeft(calculateTimeLeft());
//     }, 1000);
    
//     return () => clearInterval(timer);
//   }, []);

//   if (isLoading && !userData) {
//     return (
//       <div className="profile-page">
//         <style>{styles}</style>
        
//         <div className="profile-bg-grid"></div>
//         <div className="profile-floating-elements">
//           <div className="profile-floating-element profile-float-1"></div>
//           <div className="profile-floating-element profile-float-2"></div>
//           <div className="profile-floating-element profile-float-3"></div>
//         </div>

//         <nav className="profile-nav glass">
//           <div className="profile-nav-container">
//             <div className="profile-nav-logo">
//               <div className="profile-nav-logo-text">
//                 Touch<span className="profile-nav-logo-highlight">Grass</span>
//               </div>
//             </div>
            
//             <div className="profile-nav-button loading-skeleton" style={{ width: '120px', height: '40px' }}></div>
//           </div>
//         </nav>

//         <div className="profile-header">
//           <div className="profile-header-container">
//             <div className="loading-skeleton" style={{ height: '80px', width: '400px', marginBottom: '1.5rem', margin: '0 auto' }}></div>
//             <div className="loading-skeleton" style={{ height: '30px', width: '600px', margin: '0 auto' }}></div>
//           </div>
//         </div>

//         <div className="profile-grid">
//           <div className="profile-main-content">
//             <div className="loading-skeleton" style={{ height: '300px', borderRadius: '3rem' }}></div>
//             <div className="loading-skeleton" style={{ height: '400px', borderRadius: '3rem' }}></div>
//           </div>
//           <div className="profile-sidebar">
//             <div className="loading-skeleton" style={{ height: '300px', borderRadius: '3rem' }}></div>
//             <div className="loading-skeleton" style={{ height: '300px', borderRadius: '3rem' }}></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const streakData = userData ? loadStreakData(userData.username) : null;

//   return (
//     <div className="profile-page">
//       <style>{styles}</style>
      
//       {/* Background Effects */}
//       <div className="profile-bg-grid"></div>
//       <div className="profile-floating-elements">
//         <div className="profile-floating-element profile-float-1"></div>
//         <div className="profile-floating-element profile-float-2"></div>
//         <div className="profile-floating-element profile-float-3"></div>
//       </div>

//       {/* Navigation */}
//       <nav className="profile-nav glass">
//         <div className="profile-nav-container">
//           <button 
//             className="profile-nav-logo"
//             onClick={() => navigateTo('dashboard')}
//           >
//             <div className="profile-nav-logo-text">
//               Touch<span className="profile-nav-logo-highlight">Grass</span>
//             </div>
//           </button>
          
//           <div className="profile-nav-links">
//             <button className="profile-nav-link" onClick={() => navigateTo('verify')}>
//               Verify
//             </button>
//             <button className="profile-nav-link" onClick={() => navigateTo('challenges')}>
//               Challenges
//             </button>
//             <button className="profile-nav-link" onClick={() => navigateTo('leaderboard')}>
//               Leaderboard
//             </button>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="time-counter">
//               <Clock size={16} />
//               <span className="time-label">Time Left</span>
//               <span className="time-value">{timeLeft || '23:59:59'}</span>
//             </div>
            
//             {userData && (
//               <div className="user-profile-header">
//                 <img 
//                   src={userData.avatar} 
//                   alt={userData.displayName}
//                   className="user-avatar"
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`;
//                   }}
//                 />
//                 <div className="user-info">
//                   <div className="user-name">{userData.displayName}</div>
//                   <div className="user-status">
//                     <div className="w-2 h-2 rounded-full bg-green-500"></div>
//                     Online
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* Header */}
//       <header className="profile-header">
//         <div className="profile-header-container">
//           <h1 className="profile-welcome text-gradient">
//             {userData ? `${userData.displayName}'s Profile` : 'Your Profile'}
//           </h1>
//           <p className="profile-subtitle">
//             {userData ? 
//               `Track your progress, manage challenges, and build lasting discipline. ${
//                 streakData?.currentStreak > 0 
//                   ? `${streakData.currentStreak}-day streak strong!`
//                   : 'Start your journey today!'
//               }` 
//               : 'Create an account to start building discipline through daily accountability.'}
//           </p>
//         </div>
//       </header>

//       {/* Main Grid */}
//       <main className="profile-grid">
//         {/* Left Column - Main Content */}
//         <div className="profile-main-content">
//           {/* Profile Hero */}
//           <section className="profile-hero glass">
//             <div className="profile-visual">
//               <img 
//                 src={userData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.username || 'user'}`}
//                 alt={userData?.displayName || 'User'}
//                 className="profile-avatar-large"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.username || 'user'}`;
//                 }}
//               />
//               {streakData?.currentStreak > 0 && (
//                 <div className="streak-badge">
//                   {streakData.currentStreak}
//                 </div>
//               )}
//             </div>
            
//             <div className="profile-info">
//               <h2 className="profile-name">{userData?.displayName || 'User'}</h2>
              
//               <div className="profile-meta">
//                 <div className="meta-item">
//                   <User size={16} />
//                   @{userData?.username || 'username'}
//                 </div>
//                 <div className="meta-item">
//                   <MapPin size={16} />
//                   {userData?.location?.city || 'Online'}, {userData?.location?.country || 'Internet'}
//                 </div>
//                 <div className="meta-item">
//                   <Calendar size={16} />
//                   Joined {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}
//                 </div>
//               </div>
              
//               <p className="profile-bio">
//                 {userData?.bio || 'No bio yet. Click edit to add your personal journey...'}
//               </p>
              
//               <div className="profile-actions">
//                 <button 
//                   className="profile-button button-primary"
//                   onClick={handleEditProfile}
//                 >
//                   <Edit size={20} />
//                   Edit Profile
//                 </button>
                
//                 <button 
//                   className="profile-button button-secondary"
//                   onClick={() => setShowSocialShareModal(true)}
//                 >
//                   <Share2 size={20} />
//                   Share Profile
//                 </button>
                
//                 <button 
//                   className="profile-button button-secondary"
//                   onClick={() => setShowCreateChallenge(true)}
//                 >
//                   <Plus size={20} />
//                   Create Challenge
//                 </button>
//               </div>
//             </div>
//           </section>

//           {/* Tabs */}
//           <div className="profile-tabs">
//             <button 
//               className={`profile-tab ${activeTab === 'overview' ? 'active' : ''}`}
//               onClick={() => setActiveTab('overview')}
//             >
//               <Activity size={16} />
//               Overview
//             </button>
//             <button 
//               className={`profile-tab ${activeTab === 'challenges' ? 'active' : ''}`}
//               onClick={() => setActiveTab('challenges')}
//             >
//               <TargetIcon2 size={16} />
//               Challenges
//             </button>
//             <button 
//               className={`profile-tab ${activeTab === 'achievements' ? 'active' : ''}`}
//               onClick={() => setActiveTab('achievements')}
//             >
//               <Award size={16} />
//               Achievements
//             </button>
//           </div>

//           {/* Tab Content */}
//           {activeTab === 'overview' && (
//             <>
//               {/* Stats Grid */}
//               <section>
//                 <div className="section-header">
//                   <h2 className="section-title">
//                     <BarChart3 size={24} />
//                     Your Stats
//                   </h2>
//                 </div>
                
//                 <div className="stats-grid">
//                   {stats.map(stat => (
//                     <div key={stat.id} className="stat-card glass">
//                       <div className="stat-header">
//                         <div className="stat-icon">
//                           {stat.icon}
//                         </div>
//                         <span className="stat-change">{stat.change}</span>
//                       </div>
                      
//                       <div className="stat-value">{stat.value}</div>
//                       <div className="stat-label">{stat.title}</div>
//                       <div className="stat-description">{stat.description}</div>
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               {/* Recent Activity */}
//               <section className="activity-section glass">
//                 <div className="section-header">
//                   <h2 className="section-title">
//                     <Clock size={24} />
//                     Recent Activity
//                   </h2>
//                   <button className="view-all-button">
//                     View All
//                   </button>
//                 </div>
                
//                 <div className="activity-list">
//                   {activities.length > 0 ? (
//                     activities.map(activity => (
//                       <div key={activity.id} className="activity-item glass">
//                         <div className="activity-icon">
//                           {activity.icon}
//                         </div>
                        
//                         <div className="activity-content">
//                           <div className="activity-action">{activity.action}</div>
//                           <div className="activity-time">{activity.time}</div>
//                         </div>
                        
//                         <div className="activity-meta">
//                           {activity.meta}
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="empty-state">
//                       <div className="empty-icon">📝</div>
//                       <div className="empty-title">No Activity Yet</div>
//                       <p className="empty-description">Start verifying your outdoor time to see activity here.</p>
//                     </div>
//                   )}
//                 </div>
//               </section>
//             </>
//           )}

//           {activeTab === 'challenges' && (
//             <>
//               {/* Active Challenges */}
//               <section className="activity-section glass">
//                 <div className="section-header">
//                   <h2 className="section-title">
//                     <TargetIcon2 size={24} />
//                     Your Challenges
//                   </h2>
//                   <button 
//                     className="profile-button button-secondary"
//                     onClick={() => setShowCreateChallenge(true)}
//                     style={{ padding: '0.75rem 1.5rem' }}
//                   >
//                     <Plus size={16} />
//                     Create New
//                   </button>
//                 </div>
                
//                 {activeChallenges.length > 0 ? (
//                   <div className="challenges-grid">
//                     {activeChallenges.map(challenge => (
//                       <div key={challenge.id} className="challenge-card glass">
//                         <div className="challenge-header">
//                           <span className={`challenge-type type-${challenge.type}`}>
//                             {challenge.type}
//                           </span>
//                           <span style={{ fontSize: '0.75rem', color: '#71717a' }}>
//                             {challenge.difficulty}
//                           </span>
//                         </div>
                        
//                         <h3 className="challenge-title">{challenge.name}</h3>
//                         <p className="challenge-description">{challenge.description}</p>
                        
//                         <div className="challenge-rules">
//                           {challenge.rules?.slice(0, 3).map((rule, index) => (
//                             <div key={index} className="rule-item">
//                               <CheckCircle size={12} className="rule-icon" />
//                               <span>{rule}</span>
//                             </div>
//                           ))}
//                         </div>
                        
//                         <div className="challenge-footer">
//                           <div className="challenge-duration">
//                             {challenge.duration === 'ongoing' ? 'Ongoing' : `${challenge.duration} days`}
//                           </div>
//                           <div style={{ fontSize: '0.75rem', color: '#00E5FF' }}>
//                             {challenge.progress || 0}% complete
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="empty-state">
//                     <div className="empty-icon">🎯</div>
//                     <div className="empty-title">No Active Challenges</div>
//                     <p className="empty-description">Create or join challenges to build discipline.</p>
//                     <button 
//                       className="profile-button button-secondary"
//                       onClick={() => setShowCreateChallenge(true)}
//                       style={{ marginTop: '1rem' }}
//                     >
//                       <Plus size={16} />
//                       Create Your First Challenge
//                     </button>
//                   </div>
//                 )}
//               </section>

//               {/* Available Challenges */}
//               <section className="activity-section glass">
//                 <div className="section-header">
//                   <h2 className="section-title">
//                     <Compass size={24} />
//                     Available Challenges
//                   </h2>
//                 </div>
                
//                 <div className="challenges-grid">
//                   {challenges.map(challenge => (
//                     <div key={challenge.id} className="challenge-card glass">
//                       <div className="challenge-header">
//                         <span className={`challenge-type type-${challenge.type}`}>
//                           {challenge.type}
//                         </span>
//                         <span style={{ fontSize: '0.75rem', color: '#71717a' }}>
//                           {challenge.difficulty}
//                         </span>
//                       </div>
                      
//                       <h3 className="challenge-title">{challenge.name}</h3>
//                       <p className="challenge-description">{challenge.description}</p>
                      
//                       <div className="challenge-rules">
//                         {challenge.rules?.slice(0, 3).map((rule, index) => (
//                           <div key={index} className="rule-item">
//                             <CheckCircle size={12} className="rule-icon" />
//                             <span>{rule}</span>
//                           </div>
//                         ))}
//                       </div>
                      
//                       <div className="challenge-footer">
//                         <div className="challenge-duration">
//                           {challenge.duration === 'ongoing' ? 'Ongoing' : `${challenge.duration} days`}
//                         </div>
//                         <button 
//                           className="profile-button button-secondary"
//                           onClick={() => handleJoinChallenge(challenge)}
//                           style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
//                         >
//                           Join Challenge
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             </>
//           )}

//           {activeTab === 'achievements' && (
//             <section className="activity-section glass">
//               <div className="section-header">
//                 <h2 className="section-title">
//                   <Award size={24} />
//                   Achievements
//                 </h2>
//               </div>
              
//               <div className="achievements-grid">
//                 {achievements.length > 0 ? (
//                   achievements.map(achievement => (
//                     <div
//                       key={achievement.id}
//                       className="achievement-card glass"
//                       onClick={() => setShowAchievement(true)}
//                     >
//                       <div className="achievement-icon">{achievement.icon}</div>
//                       <div className="achievement-name">{achievement.name}</div>
//                       <div className="achievement-earned">{achievement.earned}</div>
//                       <div className="achievement-description">{achievement.description}</div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="empty-state">
//                     <div className="empty-icon">🏆</div>
//                     <div className="empty-title">No Achievements Yet</div>
//                     <p className="empty-description">Complete challenges to earn achievements.</p>
//                   </div>
//                 )}
//               </div>
//             </section>
//           )}
//         </div>

//         {/* Right Column - Sidebar */}
//         <div className="profile-sidebar">
//           {/* Quick Actions */}
//           <section className="quick-actions-section glass">
//             <div className="section-header">
//               <h2 className="section-title">
//                 <Zap size={24} />
//                 Quick Actions
//               </h2>
//             </div>
            
//             <div className="quick-actions-grid">
//               {quickActions.map(action => (
//                 <button
//                   key={action.id}
//                   className="quick-action-button glass"
//                   onClick={action.action}
//                   disabled={!userData && action.id !== 1}
//                 >
//                   <div className="quick-action-icon">
//                     {action.icon}
//                   </div>
//                   <span className="quick-action-label">{action.label}</span>
//                 </button>
//               ))}
//             </div>
//           </section>

//           {/* Performance Insights */}
//           <section className="performance-section glass">
//             <div className="section-header">
//               <h2 className="section-title">
//                 <TrendingUp size={24} />
//                 Performance
//               </h2>
//             </div>
            
//             <div style={{ padding: '1.5rem', textAlign: 'center' }}>
//               <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
//               <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem' }}>
//                 {streakData?.currentStreak > 0 
//                   ? `Better than ${Math.floor(Math.random() * 30) + 70}% of users`
//                   : 'Start your streak to see rankings'}
//               </h3>
//               <p style={{ color: '#71717a', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
//                 Your discipline journey is making an impact
//               </p>
//               <button
//                 className="profile-button button-secondary"
//                 onClick={() => navigateTo('leaderboard')}
//                 style={{ width: '100%' }}
//               >
//                 <Trophy size={16} />
//                 View Leaderboard
//               </button>
//             </div>
//           </section>

//           {/* Social Stats */}
//           <section className="activity-section glass">
//             <div className="section-header">
//               <h2 className="section-title">
//                 <Share2 size={24} />
//                 Social Impact
//               </h2>
//             </div>
            
//             <div className="social-stats-list">
//               {socialStats.map(stat => (
//                 <div key={stat.id} className="social-stat-item glass">
//                   <div 
//                     className="social-stat-icon" 
//                     style={{ background: stat.color }}
//                   >
//                     {stat.icon}
//                   </div>
                  
//                   <div className="social-stat-content">
//                     <div className="social-stat-platform">{stat.platform}</div>
//                     <div className="social-stat-metrics">{stat.metrics}</div>
//                   </div>
                  
//                   <ExternalLink size={16} />
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>
//       </main>

//       {/* Edit Profile Modal */}
//       {profileEdit.displayName !== '' && (
//         <div className="modal-overlay">
//           <motion.div 
//             className="modal-content glass"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//           >
//             <button 
//               className="modal-close"
//               onClick={() => setProfileEdit({ displayName: '', bio: '', city: '', country: '' })}
//             >
//               ✕
//             </button>
            
//             <div className="modal-header">
//               <h2 className="modal-title">Edit Profile</h2>
//               <p className="modal-subtitle">Update your personal information</p>
//             </div>
            
//             <div className="form-group">
//               <label className="form-label">Display Name</label>
//               <input
//                 type="text"
//                 className="form-input"
//                 value={profileEdit.displayName}
//                 onChange={(e) => setProfileEdit({...profileEdit, displayName: e.target.value})}
//                 placeholder="Enter your display name"
//               />
//             </div>
            
//             <div className="form-group">
//               <label className="form-label">Bio</label>
//               <textarea
//                 className="form-textarea"
//                 value={profileEdit.bio}
//                 onChange={(e) => setProfileEdit({...profileEdit, bio: e.target.value})}
//                 placeholder="Tell us about your journey"
//                 rows="4"
//               />
//             </div>
            
//             <div className="form-group">
//               <label className="form-label">City</label>
//               <input
//                 type="text"
//                 className="form-input"
//                 value={profileEdit.city}
//                 onChange={(e) => setProfileEdit({...profileEdit, city: e.target.value})}
//                 placeholder="Enter your city"
//               />
//             </div>
            
//             <div className="form-group">
//               <label className="form-label">Country</label>
//               <input
//                 type="text"
//                 className="form-input"
//                 value={profileEdit.country}
//                 onChange={(e) => setProfileEdit({...profileEdit, country: e.target.value})}
//                 placeholder="Enter your country"
//               />
//             </div>
            
//             <div className="form-actions">
//               <button 
//                 className="profile-button button-secondary"
//                 onClick={() => setProfileEdit({ displayName: '', bio: '', city: '', country: '' })}
//                 style={{ flex: 1 }}
//               >
//                 Cancel
//               </button>
//               <button 
//                 className="profile-button button-primary"
//                 onClick={saveProfileEdits}
//                 style={{ flex: 1 }}
//               >
//                 Save Changes
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}

//       {/* Create Challenge Modal */}
//       {showCreateChallenge && (
//         <div className="create-challenge-modal">
//           <motion.div 
//             className="create-challenge-content glass"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//           >
//             <button 
//               className="modal-close"
//               onClick={() => setShowCreateChallenge(false)}
//             >
//               ✕
//             </button>
            
//             <div className="modal-header">
//               <h2 className="modal-title">Create Challenge</h2>
//               <p className="modal-subtitle">Design your own discipline challenge</p>
//             </div>
            
//             <div className="form-group">
//               <label className="form-label">Challenge Name *</label>
//               <input
//                 type="text"
//                 className="form-input"
//                 value={newChallenge.name}
//                 onChange={(e) => setNewChallenge({...newChallenge, name: e.target.value})}
//                 placeholder="e.g., No Complaining Week"
//               />
//             </div>
            
//             <div className="form-group">
//               <label className="form-label">Description *</label>
//               <textarea
//                 className="form-textarea"
//                 value={newChallenge.description}
//                 onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
//                 placeholder="Describe what this challenge involves and its purpose"
//                 rows="4"
//               />
//             </div>
            
//             <div className="form-group">
//               <label className="form-label">Challenge Type</label>
//               <select
//                 className="form-select"
//                 value={newChallenge.type}
//                 onChange={(e) => setNewChallenge({...newChallenge, type: e.target.value})}
//               >
//                 <option value="mindset">Mindset & Discipline</option>
//                 <option value="business">Business & Productivity</option>
//                 <option value="emotional">Emotional Intelligence</option>
//                 <option value="physical">Physical & Health</option>
//                 <option value="social">Social & Relationships</option>
//               </select>
//             </div>
            
//             <div className="form-group">
//               <label className="form-label">Duration (Days)</label>
//               <select
//                 className="form-select"
//                 value={newChallenge.duration}
//                 onChange={(e) => setNewChallenge({...newChallenge, duration: parseInt(e.target.value)})}
//               >
//                 <option value="7">7 Days (1 Week)</option>
//                 <option value="14">14 Days (2 Weeks)</option>
//                 <option value="30">30 Days (1 Month)</option>
//                 <option value="90">90 Days (Quarter)</option>
//                 <option value="365">365 Days (Year)</option>
//                 <option value="ongoing">Ongoing</option>
//               </select>
//             </div>
            
//             <div className="form-group">
//               <label className="form-label">Difficulty</label>
//               <select
//                 className="form-select"
//                 value={newChallenge.difficulty}
//                 onChange={(e) => setNewChallenge({...newChallenge, difficulty: e.target.value})}
//               >
//                 <option value="easy">Easy</option>
//                 <option value="medium">Medium</option>
//                 <option value="hard">Hard</option>
//                 <option value="extreme">Extreme</option>
//               </select>
//             </div>
            
//             <div className="form-group">
//               <label className="form-label">Rules</label>
//               {newChallenge.rules.map((rule, index) => (
//                 <div key={index} className="rule-input-group">
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
//                 className="add-rule-button"
//                 onClick={() => setNewChallenge({...newChallenge, rules: [...newChallenge.rules, '']})}
//               >
//                 + Add Rule
//               </button>
//             </div>
            
//             <div className="form-actions">
//               <button 
//                 className="profile-button button-secondary"
//                 onClick={() => setShowCreateChallenge(false)}
//                 style={{ flex: 1 }}
//               >
//                 Cancel
//               </button>
//               <button 
//                 className="profile-button button-primary"
//                 onClick={handleCreateChallenge}
//                 style={{ flex: 1 }}
//               >
//                 Create Challenge
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}

//       {/* Social Share Modal */}
//       {showSocialShareModal && userData && (
//         <div className="modal-overlay">
//           <motion.div 
//             className="modal-content glass"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//           >
//             <button 
//               className="modal-close"
//               onClick={() => setShowSocialShareModal(false)}
//             >
//               ✕
//             </button>
            
//             <div className="modal-header">
//               <h2 className="modal-title">Share Profile</h2>
//               <p className="modal-subtitle">
//                 Share your progress with others
//               </p>
//             </div>
            
//             <div className="modal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
//               {[
//                 { platform: 'twitter', name: 'Twitter', icon: <Twitter size={24} />, color: '#1DA1F2' },
//                 { platform: 'linkedin', name: 'LinkedIn', icon: <Linkedin size={24} />, color: '#0077B5' },
//                 { platform: 'facebook', name: 'Facebook', icon: <Facebook size={24} />, color: '#1877F2' },
//                 { platform: 'instagram', name: 'Instagram', icon: <Instagram size={24} />, color: '#E1306C' },
//                 { platform: 'copy', name: 'Copy Link', icon: '📋', color: '#8b5cf6' },
//                 { platform: 'whatsapp', name: 'WhatsApp', icon: <MessageSquare size={24} />, color: '#25D366' },
//               ].map((platform) => (
//                 <button
//                   key={platform.platform}
//                   className="modal-button"
//                   onClick={() => handleShareProfile(platform.platform)}
//                   style={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     gap: '1rem',
//                     padding: '1.5rem',
//                     borderRadius: '1.5rem',
//                     border: '1px solid rgba(255, 255, 255, 0.1)',
//                     background: 'rgba(255, 255, 255, 0.05)',
//                     color: 'white',
//                     cursor: 'pointer',
//                     transition: 'all 0.3s',
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.background = `${platform.color}20`;
//                     e.currentTarget.style.borderColor = `${platform.color}40`;
//                     e.currentTarget.style.transform = 'scale(1.05)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
//                     e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
//                     e.currentTarget.style.transform = 'scale(1)';
//                   }}
//                 >
//                   <div 
//                     style={{
//                       width: '3.5rem',
//                       height: '3.5rem',
//                       borderRadius: '1rem',
//                       background: `${platform.color}20`,
//                       border: `1px solid ${platform.color}40`,
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       fontSize: '1.5rem',
//                     }}
//                   >
//                     {platform.icon}
//                   </div>
//                   <div style={{ fontWeight: '700', fontSize: '0.875rem' }}>
//                     {platform.name}
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       )}

//       {/* Achievement Toast */}
//       {showAchievement && (
//         <motion.div 
//           className="fixed bottom-8 right-8 z-50"
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: 50 }}
//         >
//           <div className="p-6 rounded-2xl glass border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-amber-500/10">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
//                 <Trophy size={24} />
//               </div>
//               <div>
//                 <div className="font-bold text-lg">Achievement Unlocked!</div>
//                 <div className="text-sm text-gray-400">You earned 100 XP for your dedication</div>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default Profile;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import challengeService from '../services/challengeService';
import { useAuth } from '../contexts/AuthContext'; // Import Supabase auth context
import Logo from '../components/ui/Logo';
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
  BarChart as BarChartIcon
} from 'lucide-react';

// IMMEDIATE FIX: Bypass backend entirely - use localStorage only
const realBackend = {
  joinChallenge: async (challengeId) => {
    // Simulate success
    return {
      success: true,
      message: 'Challenge joined',
      challengeId,
      joinedAt: new Date().toISOString()
    };
  },

  getUserChallenges: async () => {
    // Return from localStorage
    const challengesKey = `touchgrass_challenges_${userData?.username || 'default'}`;
    const storedChallenges = localStorage.getItem(challengesKey);
    return storedChallenges ? JSON.parse(storedChallenges) : [];
  },

  saveStreakData: async (streakData) => {
    // Save to localStorage
    const streakKey = `touchgrass_streak_${userData?.username || 'default'}`;
    localStorage.setItem(streakKey, JSON.stringify(streakData));
    return { success: true };
  },

  updateDailyProgress: async (challengeId, progress) => {
    return { success: true, progress };
  }
};

// // REAL BACKEND API CALLS
// const BACKEND_URL = import.meta.env.REACT_APP_BACKEND_URL || 'http://localhost:5001/api';

// const realBackend = {
//   // REAL: Join a challenge
//   joinChallenge: async (challengeId, userEmail) => {

//     const response = await fetch(`${BACKEND_URL}/challenges/${challengeId}/join`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-User-Email': userEmail
//       },
//       body: JSON.stringify({
//         joinedAt: new Date().toISOString(),
//         source: 'web-app'
//       })
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to join challenge: ${response.status}`);
//     }

//     const data = await response.json();
//     return data;
//   },

//   // REAL: Get user's challenges from database
//   getUserChallenges: async (userEmail) => {

//     const response = await fetch(`${BACKEND_URL}/user/${userEmail}/challenges`);

//     if (!response.ok) {
//       throw new Error(`Failed to fetch challenges: ${response.status}`);
//     }

//     const data = await response.json();
//     return data;
//   },

//   // REAL: Save streak to database
//   saveStreakData: async (userEmail, streakData) => {

//     const response = await fetch(`${BACKEND_URL}/user/${userEmail}/streak`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         ...streakData,
//         updatedAt: new Date().toISOString()
//       })
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to save streak: ${response.status}`);
//     }

//     return await response.json();
//   },

//   // REAL: Update daily progress
//   updateDailyProgress: async (challengeId, userEmail, progress) => {

//     const response = await fetch(`${BACKEND_URL}/challenges/${challengeId}/progress`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-User-Email': userEmail
//       },
//       body: JSON.stringify({
//         date: new Date().toISOString().split('T')[0],
//         completed: true,
//         progress,
//         timestamp: new Date().toISOString()
//       })
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to update progress: ${response.status}`);
//     }

//     return await response.json();
//   }
// };

const Profile = ({ onNavigate }) => {
  // Get user from Supabase auth context
  const { user, session } = useAuth();

  // Add this at the top of your Profile component
  const debugLocalStorage = () => {

    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      const value = localStorage.getItem(key);

      // Show all auth-related keys
      if (key.includes('auth') || key.includes('token') || key.includes('session') || key.includes('supabase')) {
        try {
          const parsed = JSON.parse(value);

          // Check for token in nested structures
          if (parsed.currentSession?.access_token) {
          }
          if (parsed.access_token) {
          }
          if (parsed.session?.access_token) {
          }
        } catch (e) {
        }
      }
    });

  };



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
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
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
  const [availableChallenges, setAvailableChallenges] = useState([]);
  const [activeUserChallenges, setActiveUserChallenges] = useState([]);
  const [challengesLoading, setChallengesLoading] = useState(false);

  // CSS Styles matching Dashboard - NOW RESPONSIVE
  const styles = `
    /* Profile CSS matching dashboard styling - RESPONSIVE VERSION */
    .profile-page {
      width: 100%;
      min-width: 320px;
      overflow-x: hidden;
      background: #050505;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
      position: relative;
      min-height: 100vh;
      box-sizing: border-box;
    }

    /* Mobile-first responsive reset */
    * {
      box-sizing: border-box;
    }

    /* Background Effects - Responsive */
    .profile-bg-grid {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: clamp(20px, 4vw, 50px) clamp(20px, 4vw, 50px);
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
      width: clamp(200px, 30vw, 400px);
      height: clamp(200px, 30vw, 400px);
      background: linear-gradient(135deg, #22c55e, #3b82f6);
      top: 10%;
      left: clamp(5%, 2vw, 10%);
      animation-delay: 0s;
    }

    .profile-float-2 {
      width: clamp(150px, 25vw, 300px);
      height: clamp(150px, 25vw, 300px);
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      top: 60%;
      right: clamp(5%, 2vw, 15%);
      animation-delay: -5s;
    }

    .profile-float-3 {
      width: clamp(100px, 20vw, 250px);
      height: clamp(100px, 20vw, 250px);
      background: linear-gradient(135deg, #fbbf24, #ef4444);
      bottom: 20%;
      left: clamp(10%, 3vw, 20%);
      animation-delay: -10s;
    }

    @keyframes float {
      0%, 100% {
        transform: translate(0, 0) rotate(0deg);
      }
      25% {
        transform: translate(clamp(10px, 2vw, 50px), clamp(-10px, -2vw, -50px)) rotate(90deg);
      }
      50% {
        transform: translate(0, clamp(-20px, -4vw, -100px)) rotate(180deg);
      }
      75% {
        transform: translate(clamp(-10px, -2vw, -50px), clamp(-10px, -2vw, -50px)) rotate(270deg);
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

    /* Profile Navigation - Responsive */
    .profile-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 50;
      padding: clamp(0.5rem, 2vw, 1rem) clamp(0.75rem, 3vw, 1.5rem);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(15, 23, 42, 0.95);
    }

    .profile-nav-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: clamp(0.5rem, 2vw, 1rem);
    }

    .profile-nav-logo {
      display: flex;
      align-items: center;
      gap: clamp(0.25rem, 1vw, 0.5rem);
      cursor: pointer;
    }

    .profile-nav-logo-text {
      font-size: clamp(1rem, 4vw, 1.5rem);
      font-weight: 900;
      letter-spacing: -0.025em;
      text-transform: uppercase;
      font-style: italic;
      line-height: 1;
    }

    .profile-nav-logo-highlight {
      color: #00E5FF;
    }

    /* Time counter for mobile */
    .time-counter {
      display: flex;
      align-items: center;
      gap: clamp(0.25rem, 1vw, 0.5rem);
      font-size: clamp(0.625rem, 2vw, 0.75rem);
      color: #71717a;
      background: rgba(255, 255, 255, 0.05);
      padding: clamp(0.25rem, 1vw, 0.375rem) clamp(0.5rem, 1.5vw, 0.75rem);
      border-radius: 0.75rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .time-label {
      display: none;
    }

    @media (min-width: 480px) {
      .time-label {
        display: inline;
      }
    }

    .profile-nav-links {
      display: none;
    }

    @media (min-width: 768px) {
      .profile-nav-links {
        display: flex;
        align-items: center;
        gap: clamp(1rem, 3vw, 2rem);
      }
    }

    .profile-nav-link {
      font-size: clamp(0.5rem, 1.5vw, 0.625rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #71717a;
      transition: color 0.2s;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      white-space: nowrap;
    }

    .profile-nav-link:hover {
      color: white;
    }

    .profile-nav-button {
      padding: clamp(0.375rem, 1.5vw, 0.5rem) clamp(1rem, 3vw, 1.5rem);
      background: #00E5FF;
      color: black;
      border-radius: clamp(0.5rem, 2vw, 0.75rem);
      font-size: clamp(0.625rem, 2vw, 0.75rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .profile-nav-button:hover {
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(0, 229, 255, 0.4);
    }

    .profile-nav-button:active {
      transform: scale(0.95);
    }

    /* User Profile Header - Responsive */
    .user-profile-header {
      display: flex;
      align-items: center;
      gap: clamp(0.5rem, 2vw, 1rem);
      padding: clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1rem);
      border-radius: clamp(0.75rem, 2vw, 1rem);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      transition: all 0.2s;
      min-width: 0;
    }

    .user-profile-header:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    .user-avatar {
      width: clamp(2rem, 6vw, 2.5rem);
      height: clamp(2rem, 6vw, 2.5rem);
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #00E5FF;
      flex-shrink: 0;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      min-width: 0;
      overflow: hidden;
    }

    .user-name {
      font-size: clamp(0.75rem, 2.5vw, 0.875rem);
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 120px;
    }

    @media (min-width: 480px) {
      .user-name {
        max-width: 150px;
      }
    }

    .user-status {
      font-size: clamp(0.5rem, 1.5vw, 0.625rem);
      color: #22c55e;
      display: flex;
      align-items: center;
      gap: clamp(0.125rem, 0.5vw, 0.25rem);
      white-space: nowrap;
    }

    /* Profile Header - Responsive */
    .profile-header {
      padding-top: clamp(6rem, 15vw, 8rem);
      padding-bottom: clamp(2rem, 8vw, 4rem);
      padding-left: clamp(1rem, 3vw, 1.5rem);
      padding-right: clamp(1rem, 3vw, 1.5rem);
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
      font-size: clamp(2rem, 10vw, 4rem);
      font-weight: 900;
      letter-spacing: -0.025em;
      line-height: 1;
      margin-bottom: clamp(1rem, 3vw, 1.5rem);
      text-transform: uppercase;
      font-style: italic;
      word-break: break-word;
    }

    .profile-subtitle {
      font-size: clamp(0.875rem, 3vw, 1.25rem);
      color: #a1a1aa;
      max-width: 600px;
      line-height: 1.5;
      font-weight: 300;
      margin: 0 auto;
    }

    @media (min-width: 768px) {
      .profile-subtitle {
        margin: 0;
      }
    }

    /* Main Grid - Responsive */
    .profile-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: clamp(1rem, 3vw, 2rem);
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 clamp(1rem, 3vw, 1.5rem) clamp(2rem, 8vw, 4rem);
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
      gap: clamp(1rem, 3vw, 2rem);
    }

    /* Profile Hero - Responsive */
    .profile-hero {
      padding: clamp(1.5rem, 5vw, 3rem);
      border-radius: clamp(1.5rem, 6vw, 3rem);
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), transparent, rgba(127, 0, 255, 0.1));
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: clamp(1rem, 3vw, 2rem);
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
      width: clamp(100px, 25vw, 160px);
      height: clamp(100px, 25vw, 160px);
      border-radius: 50%;
      object-fit: cover;
      border: clamp(2px, 0.5vw, 4px) solid rgba(0, 229, 255, 0.2);
      margin: 0 auto;
    }

    .streak-badge {
      position: absolute;
      bottom: 0;
      right: 0;
      width: clamp(2rem, 6vw, 3rem);
      height: clamp(2rem, 6vw, 3rem);
      border-radius: 50%;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: clamp(0.875rem, 3vw, 1.25rem);
      border: 3px solid #050505;
    }

    .profile-info {
      flex: 1;
      text-align: center;
      width: 100%;
    }

    @media (min-width: 768px) {
      .profile-info {
        text-align: left;
      }
    }

    .profile-name {
      font-size: clamp(1.5rem, 5vw, 2rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.025em;
      margin-bottom: clamp(0.25rem, 1vw, 0.5rem);
      background: linear-gradient(135deg, #00E5FF 0%, #7F00FF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.2;
      word-break: break-word;
    }

    .profile-bio {
      color: #71717a;
      font-size: clamp(0.875rem, 2.5vw, 1rem);
      font-weight: 300;
      line-height: 1.5;
      margin-bottom: clamp(1rem, 3vw, 2rem);
      max-width: 100%;
    }

    @media (min-width: 768px) {
      .profile-bio {
        max-width: 400px;
      }
    }

    .profile-meta {
      display: flex;
      flex-wrap: wrap;
      gap: clamp(0.5rem, 2vw, 1rem);
      margin-bottom: clamp(1rem, 3vw, 2rem);
      justify-content: center;
    }

    @media (min-width: 768px) {
      .profile-meta {
        justify-content: flex-start;
      }
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: clamp(0.25rem, 1vw, 0.5rem);
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      color: #a1a1aa;
      white-space: nowrap;
    }

    .profile-actions {
      display: flex;
      flex-direction: column;
      gap: clamp(0.5rem, 2vw, 1rem);
      width: 100%;
    }

    @media (min-width: 480px) {
      .profile-actions {
        flex-direction: row;
        flex-wrap: wrap;
      }
    }

    @media (min-width: 768px) {
      .profile-actions {
        flex-direction: row;
        flex-wrap: nowrap;
      }
    }

    .profile-button {
      padding: clamp(0.75rem, 2.5vw, 1rem) clamp(1rem, 4vw, 2rem);
      border-radius: clamp(0.75rem, 2vw, 1rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: clamp(0.625rem, 2vw, 0.75rem);
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: clamp(0.25rem, 1vw, 0.5rem);
      min-height: clamp(40px, 10vw, 48px);
      flex: 1;
      min-width: 0;
    }

    @media (min-width: 480px) {
      .profile-button {
        flex: 0 1 auto;
      }
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

    /* Stats Grid - Responsive */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: clamp(0.5rem, 2vw, 1rem);
    }

    @media (min-width: 640px) {
      .stats-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .stat-card {
      padding: clamp(1rem, 3vw, 2rem);
      border-radius: clamp(1rem, 4vw, 2rem);
      border: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      transition: all 0.3s;
      min-height: clamp(140px, 25vw, 180px);
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
      margin-bottom: clamp(0.75rem, 2vw, 1.5rem);
    }

    .stat-icon {
      width: clamp(2rem, 6vw, 3rem);
      height: clamp(2rem, 6vw, 3rem);
      border-radius: clamp(0.75rem, 2vw, 1rem);
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 229, 255, 0.1);
      color: #00E5FF;
      border: 1px solid rgba(0, 229, 255, 0.2);
      flex-shrink: 0;
    }

    .stat-change {
      font-size: clamp(0.5rem, 1.5vw, 0.625rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: clamp(0.125rem, 0.5vw, 0.25rem) clamp(0.5rem, 1.5vw, 0.75rem);
      border-radius: 9999px;
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
      white-space: nowrap;
    }

    .stat-value {
      font-size: clamp(1.5rem, 5vw, 2.5rem);
      font-weight: 900;
      margin-bottom: clamp(0.25rem, 1vw, 0.5rem);
      line-height: 1;
    }

    .stat-label {
      font-size: clamp(0.5rem, 1.5vw, 0.625rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #71717a;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .stat-description {
      font-size: clamp(0.625rem, 1.5vw, 0.75rem);
      color: #a1a1aa;
      margin-top: clamp(0.25rem, 1vw, 0.5rem);
      line-height: 1.4;
    }

    /* Tabs - Responsive */
    .profile-tabs {
      display: flex;
      gap: clamp(0.25rem, 1vw, 0.5rem);
      background: rgba(255, 255, 255, 0.05);
      border-radius: clamp(0.75rem, 2vw, 1rem);
      padding: clamp(0.25rem, 1vw, 0.5rem);
      margin-bottom: clamp(1rem, 3vw, 2rem);
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .profile-tabs::-webkit-scrollbar {
      display: none;
    }

    .profile-tab {
      flex: 1;
      padding: clamp(0.75rem, 2vw, 1rem) clamp(1rem, 2.5vw, 1.5rem);
      border: none;
      background: transparent;
      color: #71717a;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: clamp(0.625rem, 1.5vw, 0.75rem);
      border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: clamp(0.25rem, 1vw, 0.5rem);
      white-space: nowrap;
      min-height: clamp(40px, 10vw, 48px);
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

    /* Activity Feed - Responsive */
    .activity-section {
      padding: clamp(1.5rem, 4vw, 2.5rem);
      border-radius: clamp(1.5rem, 6vw, 3rem);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: clamp(1rem, 3vw, 2rem);
      flex-wrap: wrap;
      gap: clamp(0.5rem, 2vw, 1rem);
    }

    .section-title {
      font-size: clamp(1rem, 4vw, 1.5rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.025em;
      display: flex;
      align-items: center;
      gap: clamp(0.25rem, 1vw, 0.5rem);
      line-height: 1;
    }

    .view-all-button {
      font-size: clamp(0.5rem, 1.5vw, 0.625rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #71717a;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      transition: color 0.2s;
      white-space: nowrap;
    }

    .view-all-button:hover {
      color: white;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: clamp(0.5rem, 2vw, 1rem);
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: clamp(0.5rem, 2vw, 1rem);
      padding: clamp(1rem, 2.5vw, 1.5rem);
      border-radius: clamp(1rem, 3vw, 1.5rem);
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.01);
      transition: all 0.3s;
    }

    .activity-item:hover {
      background: rgba(255, 255, 255, 0.03);
      transform: translateX(5px);
    }

    .activity-icon {
      width: clamp(2rem, 6vw, 3rem);
      height: clamp(2rem, 6vw, 3rem);
      border-radius: clamp(0.75rem, 2vw, 1rem);
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 229, 255, 0.1);
      color: #00E5FF;
      flex-shrink: 0;
    }

    .activity-content {
      flex: 1;
      min-width: 0;
    }

    .activity-action {
      font-weight: 600;
      margin-bottom: clamp(0.125rem, 0.5vw, 0.25rem);
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      word-break: break-word;
    }

    .activity-time {
      font-size: clamp(0.625rem, 1.5vw, 0.75rem);
      color: #71717a;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .activity-meta {
      padding: clamp(0.25rem, 1vw, 0.5rem) clamp(0.5rem, 2vw, 1rem);
      border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
      font-size: clamp(0.625rem, 1.5vw, 0.75rem);
      font-weight: 700;
      white-space: nowrap;
      flex-shrink: 0;
    }

    /* Challenges Section - Responsive */
    .challenges-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: clamp(0.5rem, 2vw, 1rem);
    }

    @media (min-width: 768px) {
      .challenges-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .challenge-card {
      padding: clamp(1rem, 3vw, 2rem);
      border-radius: clamp(1rem, 4vw, 2rem);
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
      margin-bottom: clamp(0.5rem, 2vw, 1rem);
      flex-wrap: wrap;
      gap: clamp(0.25rem, 1vw, 0.5rem);
    }

    .challenge-type {
      font-size: clamp(0.5rem, 1.5vw, 0.625rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: clamp(0.125rem, 0.5vw, 0.25rem) clamp(0.5rem, 1.5vw, 0.75rem);
      border-radius: 9999px;
      white-space: nowrap;
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
      font-size: clamp(1rem, 3vw, 1.25rem);
      font-weight: 900;
      margin-bottom: clamp(0.5rem, 2vw, 1rem);
      line-height: 1.2;
      word-break: break-word;
    }

    .challenge-description {
      color: #71717a;
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      line-height: 1.5;
      margin-bottom: clamp(1rem, 3vw, 1.5rem);
      word-break: break-word;
    }

    .challenge-rules {
      display: flex;
      flex-direction: column;
      gap: clamp(0.25rem, 1vw, 0.5rem);
      margin-bottom: clamp(1rem, 3vw, 1.5rem);
    }

    .rule-item {
      display: flex;
      align-items: flex-start;
      gap: clamp(0.25rem, 1vw, 0.5rem);
      font-size: clamp(0.625rem, 1.5vw, 0.75rem);
      color: #a1a1aa;
      line-height: 1.4;
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
      flex-wrap: wrap;
      gap: clamp(0.5rem, 2vw, 1rem);
    }

    .challenge-duration {
      font-size: clamp(0.625rem, 1.5vw, 0.75rem);
      color: #71717a;
      white-space: nowrap;
    }

    /* Create Challenge Modal - Responsive */
    .create-challenge-modal {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(0.5rem, 3vw, 1.5rem);
    }

    .create-challenge-content {
      width: 100%;
      max-width: min(800px, 95vw);
      max-height: min(90vh, 90svh);
      overflow-y: auto;
      padding: clamp(1.5rem, 5vw, 3rem);
      border-radius: clamp(1.5rem, 6vw, 3rem);
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(15, 23, 42, 0.95);
      position: relative;
    }

    .modal-header {
      text-align: center;
      margin-bottom: clamp(1.5rem, 5vw, 3rem);
    }

    .modal-title {
      font-size: clamp(1.5rem, 5vw, 2rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.025em;
      margin-bottom: clamp(0.25rem, 1vw, 0.5rem);
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.2;
    }

    .modal-subtitle {
      color: #71717a;
      font-size: clamp(0.875rem, 2.5vw, 1rem);
    }

    .form-group {
      margin-bottom: clamp(1rem, 3vw, 2rem);
    }

    .form-label {
      display: block;
      font-size: clamp(0.625rem, 1.5vw, 0.75rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #71717a;
      margin-bottom: clamp(0.5rem, 1.5vw, 0.75rem);
    }

    .form-input {
      width: 100%;
      padding: clamp(0.75rem, 2vw, 1rem);
      border-radius: clamp(0.75rem, 2vw, 1rem);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      transition: all 0.2s;
      min-height: clamp(44px, 10vw, 48px);
    }

    .form-input:focus {
      outline: none;
      border-color: #00E5FF;
      background: rgba(0, 229, 255, 0.05);
    }

    .form-select {
      width: 100%;
      padding: clamp(0.75rem, 2vw, 1rem);
      border-radius: clamp(0.75rem, 2vw, 1rem);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      transition: all 0.2s;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right clamp(0.75rem, 2vw, 1rem) center;
      background-size: clamp(0.75rem, 2vw, 1rem);
      min-height: clamp(44px, 10vw, 48px);
    }

    .form-select:focus {
      outline: none;
      border-color: #00E5FF;
      background: rgba(0, 229, 255, 0.05);
    }

    .form-textarea {
      width: 100%;
      padding: clamp(0.75rem, 2vw, 1rem);
      border-radius: clamp(0.75rem, 2vw, 1rem);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      transition: all 0.2s;
      resize: vertical;
      min-height: clamp(80px, 20vw, 100px);
    }

    .form-textarea:focus {
      outline: none;
      border-color: #00E5FF;
      background: rgba(0, 229, 255, 0.05);
    }

    .rule-input-group {
      display: flex;
      gap: clamp(0.25rem, 1vw, 0.5rem);
      margin-bottom: clamp(0.25rem, 1vw, 0.5rem);
    }

    .add-rule-button {
      padding: clamp(0.375rem, 1.5vw, 0.5rem) clamp(0.75rem, 2vw, 1rem);
      border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      background: rgba(0, 229, 255, 0.1);
      border: 1px solid rgba(0, 229, 255, 0.2);
      color: #00E5FF;
      font-size: clamp(0.625rem, 1.5vw, 0.75rem);
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .add-rule-button:hover {
      background: rgba(0, 229, 255, 0.2);
    }

    .form-actions {
      display: flex;
      gap: clamp(0.5rem, 2vw, 1rem);
      margin-top: clamp(1rem, 3vw, 2rem);
      flex-direction: column;
    }

    @media (min-width: 480px) {
      .form-actions {
        flex-direction: row;
      }
    }

    /* Sidebar */
    .profile-sidebar {
      display: flex;
      flex-direction: column;
      gap: clamp(1rem, 3vw, 2rem);
    }

    /* Quick Actions - Responsive */
    .quick-actions-section {
      padding: clamp(1.5rem, 4vw, 2.5rem);
      border-radius: clamp(1.5rem, 6vw, 3rem);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: clamp(0.5rem, 2vw, 1rem);
    }

    .quick-action-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: clamp(0.5rem, 2vw, 1rem);
      padding: clamp(1rem, 2.5vw, 1.5rem);
      border-radius: clamp(1rem, 3vw, 1.5rem);
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.01);
      cursor: pointer;
      transition: all 0.3s;
      min-height: clamp(100px, 20vw, 120px);
    }

    .quick-action-button:hover {
      background: rgba(255, 255, 255, 0.03);
      transform: scale(1.05);
      border-color: rgba(0, 229, 255, 0.2);
    }

    .quick-action-icon {
      width: clamp(2rem, 6vw, 3rem);
      height: clamp(2rem, 6vw, 3rem);
      border-radius: clamp(0.75rem, 2vw, 1rem);
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 229, 255, 0.1);
      color: #00E5FF;
    }

    .quick-action-label {
      font-size: clamp(0.5rem, 1.5vw, 0.625rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      text-align: center;
      color: #71717a;
    }

    /* Achievements - Responsive */
    .achievements-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: clamp(0.5rem, 2vw, 1rem);
    }

    .achievement-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: clamp(1rem, 2.5vw, 1.5rem);
      border-radius: clamp(1rem, 3vw, 1.5rem);
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.01);
      cursor: pointer;
      transition: all 0.3s;
      min-height: clamp(120px, 25vw, 140px);
    }

    .achievement-card:hover {
      background: rgba(251, 191, 36, 0.05);
      transform: scale(1.05);
      border-color: rgba(251, 191, 36, 0.2);
    }

    .achievement-icon {
      font-size: clamp(1.5rem, 4vw, 2rem);
      margin-bottom: clamp(0.5rem, 2vw, 1rem);
    }

    .achievement-name {
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      font-weight: 700;
      margin-bottom: clamp(0.125rem, 0.5vw, 0.25rem);
    }

    .achievement-earned {
      font-size: clamp(0.5rem, 1.5vw, 0.625rem);
      color: #71717a;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: clamp(0.25rem, 1vw, 0.5rem);
    }

    .achievement-description {
      font-size: clamp(0.625rem, 1.5vw, 0.75rem);
      color: #a1a1aa;
    }

    /* Performance Insights - Responsive */
    .performance-section {
      padding: clamp(1.5rem, 4vw, 2.5rem);
      border-radius: clamp(1.5rem, 6vw, 3rem);
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: linear-gradient(135deg, rgba(127, 0, 255, 0.1), transparent);
    }

    /* Social Stats - Responsive */
    .social-stats-list {
      display: flex;
      flex-direction: column;
      gap: clamp(0.5rem, 2vw, 1rem);
    }

    .social-stat-item {
      display: flex;
      align-items: center;
      gap: clamp(0.5rem, 2vw, 1rem);
      padding: clamp(1rem, 2.5vw, 1.5rem);
      border-radius: clamp(1rem, 3vw, 1.5rem);
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.01);
    }

    .social-stat-icon {
      width: clamp(2rem, 6vw, 3rem);
      height: clamp(2rem, 6vw, 3rem);
      border-radius: clamp(0.75rem, 2vw, 1rem);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .social-stat-content {
      flex: 1;
      min-width: 0;
    }

    .social-stat-platform {
      font-weight: 600;
      margin-bottom: clamp(0.125rem, 0.5vw, 0.25rem);
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      word-break: break-word;
    }

    .social-stat-metrics {
      display: flex;
      gap: clamp(0.5rem, 2vw, 1rem);
      font-size: clamp(0.625rem, 1.5vw, 0.75rem);
      color: #71717a;
      flex-wrap: wrap;
    }

    /* Modal - Responsive */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(0.5rem, 3vw, 1.5rem);
    }

    .modal-content {
      width: 100%;
      max-width: min(600px, 95vw);
      max-height: min(90vh, 90svh);
      overflow-y: auto;
      padding: clamp(1.5rem, 5vw, 3rem);
      border-radius: clamp(1.5rem, 6vw, 3rem);
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(15, 23, 42, 0.95);
      position: relative;
    }

    .modal-close {
      position: absolute;
      top: clamp(1rem, 3vw, 2rem);
      right: clamp(1rem, 3vw, 2rem);
      width: clamp(2rem, 5vw, 2.5rem);
      height: clamp(2rem, 5vw, 2.5rem);
      border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      z-index: 101;
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
      padding: clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem);
      color: #71717a;
    }

    .empty-icon {
      font-size: clamp(2rem, 8vw, 3rem);
      margin-bottom: clamp(1rem, 3vw, 1.5rem);
      opacity: 0.5;
    }

    .empty-title {
      font-size: clamp(1rem, 4vw, 1.25rem);
      font-weight: 700;
      margin-bottom: clamp(0.25rem, 1vw, 0.5rem);
      color: white;
    }

    .empty-description {
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      max-width: 300px;
      margin: 0 auto clamp(1rem, 3vw, 1.5rem);
      line-height: 1.5;
    }

    /* Share Modal Grid - Responsive */
    .modal-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: clamp(0.5rem, 2vw, 1rem);
      margin-bottom: clamp(1rem, 3vw, 2rem);
    }

    @media (min-width: 480px) {
      .modal-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .modal-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: clamp(0.5rem, 2vw, 1rem);
      padding: clamp(1rem, 2.5vw, 1.5rem);
      border-radius: clamp(1rem, 3vw, 1.5rem);
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: white;
      cursor: pointer;
      transition: all 0.3s;
      min-height: clamp(100px, 20vw, 120px);
    }

    .modal-button:hover {
      transform: scale(1.05);
    }

    /* Achievement Toast - Responsive */
    .achievement-toast {
      position: fixed;
      bottom: clamp(1rem, 5vw, 2rem);
      right: clamp(1rem, 5vw, 2rem);
      z-index: 50;
      padding: clamp(1rem, 3vw, 1.5rem);
      border-radius: clamp(1rem, 3vw, 1.5rem);
      border: 1px solid rgba(255, 215, 0, 0.2);
      background: rgba(255, 215, 0, 0.1);
      backdrop-filter: blur(10px);
      max-width: min(400px, 90vw);
    }

    /* Touch Optimization */
    @media (hover: none) and (pointer: coarse) {
      .profile-nav-button,
      .profile-button,
      .profile-tab,
      .quick-action-button,
      .modal-button,
      .challenge-card,
      .activity-item,
      .achievement-card,
      .social-stat-item,
      .stat-card {
        min-height: 44px;
        touch-action: manipulation;
      }

      .form-input,
      .form-select,
      .form-textarea {
        min-height: 44px;
        font-size: 16px; /* Prevents iOS zoom */
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .profile-floating-element,
      .profile-nav-button:hover,
      .profile-button:hover,
      .profile-tab:hover,
      .stat-card:hover,
      .activity-item:hover,
      .challenge-card:hover,
      .quick-action-button:hover,
      .achievement-card:hover,
      .modal-button:hover {
        animation: none !important;
        transition: none !important;
        transform: none !important;
      }
    }

    /* High Contrast Mode */
    @media (prefers-contrast: high) {
      .glass {
        backdrop-filter: none;
        background: rgba(0, 0, 0, 0.95);
        border: 2px solid rgba(255, 255, 255, 0.8);
      }

      .form-input,
      .form-select,
      .form-textarea {
        border: 2px solid rgba(255, 255, 255, 0.6);
        background: rgba(0, 0, 0, 0.9);
      }
    }

    /* Landscape mobile optimization */
    @media (max-height: 600px) and (orientation: landscape) {
      .profile-header {
        padding-top: 5rem;
        padding-bottom: 1.5rem;
      }

      .profile-hero {
        padding: 1.5rem;
        min-height: auto;
      }

      .profile-avatar-large {
        width: 80px;
        height: 80px;
      }

      .profile-bio {
        font-size: 0.875rem;
        margin-bottom: 1rem;
      }

      .stats-grid {
        grid-template-columns: repeat(3, 1fr);
      }

      .stat-card {
        padding: 1rem;
        min-height: 120px;
      }
    }

    /* Extra small devices */
    @media (max-width: 320px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .quick-actions-grid {
        grid-template-columns: 1fr;
      }

      .achievements-grid {
        grid-template-columns: 1fr;
      }

      .profile-tab {
        padding: 0.5rem 0.75rem;
        font-size: 0.5rem;
      }

      .modal-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Large desktop */
    @media (min-width: 1920px) {
      .profile-grid {
        max-width: 1600px;
      }

      .profile-hero {
        padding: 4rem;
      }

      .profile-avatar-large {
        width: 200px;
        height: 200px;
      }

      .stats-grid {
        gap: 1.5rem;
      }

      .stat-card {
        padding: 2.5rem;
        min-height: 220px;
      }
    }

    /* Fix for iOS Safari */
    @supports (-webkit-touch-callout: none) {
      .modal-overlay,
      .create-challenge-modal {
        -webkit-overflow-scrolling: touch;
      }

      .modal-content,
      .create-challenge-content {
        -webkit-transform: translateZ(0);
      }
    }

    /* Fix for Firefox scrollbar */
    .create-challenge-content,
    .modal-content {
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
    }

    .create-challenge-content::-webkit-scrollbar,
    .modal-content::-webkit-scrollbar {
      width: 8px;
    }

    .create-challenge-content::-webkit-scrollbar-track,
    .modal-content::-webkit-scrollbar-track {
      background: transparent;
    }

    .create-challenge-content::-webkit-scrollbar-thumb,
    .modal-content::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }

    /* Ensure content doesn't overflow on very small screens */
    @media (max-width: 280px) {
      .profile-nav-container {
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.5rem;
      }

      .user-profile-header {
        order: 3;
        width: 100%;
        justify-content: center;
      }

      .profile-welcome {
        font-size: 1.5rem;
      }

      .profile-subtitle {
        font-size: 0.75rem;
      }
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
        case 'verification-wall':
          window.location.href = '/verification-wall';
        default:
      }
    }
  };

  // Load REAL user data from localStorage (same as Dashboard)
  const loadUserData = () => {
    try {
      const storedUser = localStorage.getItem('touchgrass_user');
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
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
          
          localStorage.setItem('touchgrass_user', JSON.stringify(newUser));
          return newUser;
        }
      }
      
      return null;
    } catch (error) {
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
      
      localStorage.setItem(streakKey, JSON.stringify(newStreak));
      return newStreak;
    } catch (error) {
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
      
      localStorage.setItem(challengesKey, JSON.stringify(defaultChallenges));
      return defaultChallenges;
    } catch (error) {
      return [];
    }
  };

  // Save user challenges
  const saveUserChallenges = (username, challenges) => {
    try {
      const challengesKey = `touchgrass_challenges_${username}`;
      localStorage.setItem(challengesKey, JSON.stringify(challenges));
    } catch (error) {
    }
  };

  // Save streak data (same as Dashboard)
  const saveStreakData = (username, streakData) => {
    try {
      const streakKey = `touchgrass_streak_${username}`;
      localStorage.setItem(streakKey, JSON.stringify(streakData));
    } catch (error) {
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

  // Add this near the top of your component:
  const [realChallenges, setRealChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const userEmail = 'tandelhitanshi@gmail.com'; // Get from auth

  // SIMPLE LOCALSTORAGE DATA LOADING
  useEffect(() => {
    const loadChallenges = () => {
      const challengesKey = `touchgrass_challenges_${userData?.username || 'default'}`;
      const storedChallenges = localStorage.getItem(challengesKey);

      if (storedChallenges) {
        const challenges = JSON.parse(storedChallenges);
        setRealChallenges(challenges);
      } else {
        setRealChallenges([]);
      }

      setLoading(false);
    };

    loadChallenges();
  }, [userData?.username]); // Only depend on username

  // Initialize profile data - SIMPLE LOCALSTORAGE VERSION
  const initializeProfile = () => {
    setIsLoading(true);

    try {
      // Get user from localStorage or create from Supabase
      let userData = null;
      const storedUser = localStorage.getItem('touchgrass_user');

      if (storedUser) {
        userData = JSON.parse(storedUser);
      } else if (user) {
        userData = {
          id: user.id,
          email: user.email,
          username: user.email.split('@')[0],
          displayName: user.user_metadata?.full_name || user.email.split('@')[0],
          avatar: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
          location: { city: 'Online', country: 'Internet' },
          bio: 'Building discipline through daily outdoor accountability.',
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString()
        };

        localStorage.setItem('touchgrass_user', JSON.stringify(userData));
      }

      if (userData) {
        setUserData(userData);

        setProfileEdit({
          displayName: userData.displayName || '',
          bio: userData.bio || '',
          city: userData.location?.city || '',
          country: userData.location?.country || ''
        });
      }

      // Set stats
      const streakKey = `touchgrass_streak_${userData?.username || 'default'}`;
      const storedStreak = localStorage.getItem(streakKey);
      const streakData = storedStreak ? JSON.parse(storedStreak) : {
        currentStreak: 7,
        longestStreak: 30,
        totalDays: 45,
        totalOutdoorTime: 120
      };

      setStats([
        {
          id: 'current-streak',
          value: streakData.currentStreak || 0,
          icon: '🔥',
          title: 'Current Streak',
          description: 'Days in a row',
          change: streakData.currentStreak > 0 ? 'Active' : 'Start Now',
          label: 'Current Streak'
        },
        {
          id: 'longest-streak',
          value: streakData.longestStreak || 0,
          icon: '🏆',
          title: 'Longest Streak',
          description: 'Best streak ever',
          change: 'Personal Best',
          label: 'Longest Streak'
        },
        {
          id: 'total-days',
          value: streakData.totalDays || 0,
          icon: '📅',
          title: 'Total Days',
          description: 'Total outdoor days',
          change: 'Lifetime Total',
          label: 'Total Days'
        },
        {
          id: 'outdoor-time',
          value: `${streakData.totalOutdoorTime || 0}h`,
          icon: '🌳',
          title: 'Outdoor Time',
          description: 'Hours spent outdoors',
          change: 'Total Hours',
          label: 'Outdoor Time'
        }
      ]);

      // Set activities
      setActivities([
        {
          id: 'activity-1',
          action: 'Completed daily verification',
          time: '2 hours ago',
          icon: '✅',
          meta: '+10 XP'
        },
        {
          id: 'activity-2',
          action: 'Reached 7-day streak milestone',
          time: '1 day ago',
          icon: '🔥',
          meta: 'Milestone'
        },
        {
          id: 'activity-3',
          action: 'Shared progress on social media',
          time: '2 days ago',
          icon: '📱',
          meta: 'Shared'
        }
      ]);

      // Set social stats
      setSocialStats([
        {
          id: 1,
          platform: "Twitter",
          icon: <Twitter size={20} />,
          color: "rgba(29, 161, 242, 0.2)",
          metrics: `${Math.min(streakData.shareCount || 0, 24)} Shares • 1.2K Views`
        },
        {
          id: 2,
          platform: "LinkedIn",
          icon: <Linkedin size={20} />,
          color: "rgba(0, 119, 181, 0.2)",
          metrics: `${Math.min(streakData.shareCount || 0, 18)} Shares • 420 Views`
        },
        {
          id: 3,
          platform: "Instagram",
          icon: <Instagram size={20} />,
          color: "rgba(225, 48, 108, 0.2)",
          metrics: `${Math.min(streakData.shareCount || 0, 12)} Shares • 780 Likes`
        }
      ]);

      // Set achievements
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
      if ((streakData.shareCount || 0) >= 10) {
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

      setAchievements(userAchievements);

    } catch (error) {
      console.error('Profile initialization error:', error);
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

// Updated handleJoinChallenge function that calls backend
const handleJoinChallenge = async (challenge) => {
  if (!user?.email) {
    toast.error('Please login to join challenges');
    return;
  }
  
  try {
    setChallengesLoading(true);
    
    // Call backend to join challenge
    const result = await challengeService.joinChallenge(challenge.id, user.email);
    
    if (result.success) {
      // Refresh challenges data
      await loadChallengesFromBackend();
      
      // Show success message
      toast.success(`Joined "${challenge.name}" challenge!`);
      
      // Show achievement if it's their first challenge
      if (activeUserChallenges.length === 0) {
        setShowAchievement(true);
        setTimeout(() => setShowAchievement(false), 3000);
      }
    } else {
      toast.error(result.message || 'Failed to join challenge');
    }
  } catch (error) {
    console.error('Error joining challenge:', error);
    toast.error('Failed to join challenge. Please try again.');
  } finally {
    setChallengesLoading(false);
  }
};

// Add this function to load challenges from backend
const loadChallengesFromBackend = async () => {
  if (!user?.email) return;
  
  try {
    setChallengesLoading(true);
    
    // Load available challenges from backend
    const availableData = await challengeService.getAvailableChallenges(user.email);
    setAvailableChallenges(availableData);
    
    // Load user's active challenges from backend
    const userChallengesData = await challengeService.getUserActiveChallenges(user.email);
    setActiveUserChallenges(userChallengesData);
    
    setChallengesLoading(false);
  } catch (error) {
    console.error('Error loading challenges:', error);
    setChallengesLoading(false);
    
    // Fallback to default challenges if backend fails
    const defaultChallenges = getDefaultChallenges();
    setAvailableChallenges(defaultChallenges);
    
    // You might want to show a toast here
    toast.error('Failed to load challenges. Using default data.');
  }
};

// Default challenges as fallback
const getDefaultChallenges = () => [
  {
    id: 1,
    name: "The First 10 Minutes",
    type: "foundation",
    description: "Start your day outside—no phone, no agenda. Just be present in the open air for the first 10 minutes after you wake up.",
    duration: "daily",
    rules: [
      "Go outside within 10 minutes of waking",
      "Stay for minimum 10 minutes",
      "No phone usage allowed",
      "Breathe deeply and observe your surroundings"
    ],
    difficulty: "easy",
    icon: "☀️",
    participants: 42,
    category: "mindfulness"
  },
  {
    id: 2,
    name: "The Silent Kilometer",
    type: "mindfulness",
    description: "Walk one full kilometer in complete silence—no phone, no music, no podcasts. Just you, your breath, and your surroundings.",
    duration: "daily",
    rules: [
      "1 km minimum distance (track via basic pedometer or map)",
      "Absolute silence (no audio input)",
      "Phone stays in pocket",
      "Note one small detail you've never noticed before"
    ],
    difficulty: "medium",
    icon: "🤫",
    participants: 28,
    category: "mindfulness"
  },
  {
    id: 3,
    name: "Greening Your Loop",
    type: "exploration",
    description: "For one week, you cannot take the exact same outdoor route twice. Find a new street, path, or trail every single time.",
    duration: 7,
    rules: [
      "No repeated routes for 7 days",
      "Minimum 15 minutes per outing",
      "Must end at a new destination or starting point",
      "Map your week's 'spiderweb' in your journal"
    ],
    difficulty: "medium",
    icon: "🕸️",
    participants: 65,
    category: "exploration"
  },
  {
    id: 4,
    name: "Sunrise-Sunset Bookends",
    type: "discipline",
    description: "Bookend your day with natural light. Be present for the sunrise and the sunset, no matter the weather. 5 minutes minimum each.",
    duration: "weekly",
    rules: [
      "Catch sunrise (within 30 min of dawn)",
      "Catch sunset (within 30 min of dusk)",
      "At least 5 minutes of presence each",
      "Complete 5 out of 7 days in a week"
    ],
    difficulty: "hard",
    icon: "🌅",
    participants: 19,
    category: "discipline"
  },
  {
    id: 5,
    name: "The 5-Bench Circuit",
    type: "community",
    description: "Find and sit on 5 different public benches in your neighborhood or a park. Observe the rhythm of life from each station.",
    duration: "single",
    rules: [
      "Find 5 distinct benches",
      "Sit for at least 3 minutes each",
      "No phone while sitting",
      "Sketch or write one sentence about the view from each"
    ],
    difficulty: "easy",
    icon: "🪑",
    participants: 87,
    category: "community"
  },
  {
    id: 6,
    name: "The Weatherproof Pledge",
    type: "resilience",
    description: "Go outside every day for 7 days, regardless of weather conditions. Rain, wind, or shine—your commitment doesn't waver.",
    duration: 7,
    rules: [
      "Minimum 10 minutes outside daily",
      "No weather-based excuses",
      "Document the conditions with a photo",
      "Reflect on how the weather affected your mood"
    ],
    difficulty: "hard",
    icon: "🌧️",
    participants: 31,
    category: "resilience"
  },
  {
    id: 7,
    name: "Tree Identification Week",
    type: "learning",
    description: "Learn to identify 5 different tree species in your local area. Find them, photograph them, and learn one fact about each.",
    duration: 7,
    rules: [
      "Correctly identify 5 local tree species",
      "Visit at least one of each during the week",
      "Photograph leaf, bark, and overall shape",
      "Note the location of your favorite"
    ],
    difficulty: "medium",
    icon: "🌳",
    participants: 45,
    category: "learning"
  },
  {
    id: 8,
    name: "The Digital Sunset",
    type: "detox",
    description: "For one week, your last screen time of the day must end at least 1 hour before bedtime. Replace that time with an evening outdoor ritual.",
    duration: 7,
    rules: [
      "Screens off 60+ minutes before bed",
      "Spend those 60 minutes outside (e.g., porch, walk, stargazing)",
      "No checking phones during outdoor time",
      "Track how your sleep quality changes"
    ],
    difficulty: "medium",
    icon: "📵",
    participants: 52,
    category: "detox"
  },
  {
    id: 9,
    name: "The Pilgrimage",
    type: "endurance",
    description: "Walk to a meaningful local destination that you'd normally drive to. A friend's house, a favorite cafe, a library—earn the arrival.",
    duration: "single",
    rules: [
      "Choose a destination 30+ minutes away by foot",
      "Walk the entire way there",
      "No motorized transport allowed",
      "Share a photo from your destination as proof"
    ],
    difficulty: "hard",
    icon: "🥾",
    participants: 23,
    category: "endurance"
  },
  {
    id: 10,
    name: "The Micro-Season Observer",
    type: "mindfulness",
    description: "Visit the same natural spot (a park, a tree, a pond) every day for 2 weeks and document the subtle daily changes.",
    duration: 14,
    rules: [
      "Visit the same spot daily",
      "Spend at least 5 minutes observing",
      "Take one photo or write one observation",
      "Create a time-lapse collage at the end"
    ],
    difficulty: "easy",
    icon: "🔍",
    participants: 68,
    category: "mindfulness"
  }
];

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
      label: "Verification wall",
      icon: <Camera size={24} />,
      action: () => navigateTo('verification-wall')
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
    debugLocalStorage();
    initializeProfile();

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [user]); // Only depend on user

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
            <div className="loading-skeleton" style={{ height: '80px', width: '100%', maxWidth: '400px', marginBottom: '1.5rem', margin: '0 auto' }}></div>
            <div className="loading-skeleton" style={{ height: '30px', width: '100%', maxWidth: '600px', margin: '0 auto' }}></div>
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
          <div className="profile-nav-logo">
            <div className="profile-nav-logo-text">
              Touch<span className="profile-nav-logo-highlight">Grass</span>
            </div>
          </div>
          
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
            <div className="profile-visual" style={{ position: 'relative' }}>
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
    <div key="username" className="meta-item">
      <User size={16} />
      @{userData?.username || 'username'}
    </div>
    <div key="location" className="meta-item">
      <MapPin size={16} />
      {userData?.location?.city || 'Online'}, {userData?.location?.country || 'Internet'}
    </div>
    <div key="joined" className="meta-item">
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
              key="overview"
              className={`profile-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Activity size={16} />
              Overview
            </button>
            <button
              key="challenges"
              className={`profile-tab ${activeTab === 'challenges' ? 'active' : ''}`}
              onClick={() => setActiveTab('challenges')}
            >
              <TargetIcon2 size={16} />
              Challenges
            </button>
            <button
              key="achievements"
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
                    Your Active Challenges
                    {activeUserChallenges.length > 0 && (
                      <span style={{
                        fontSize: '0.875rem',
                        marginLeft: '0.5rem',
                        color: '#00E5FF',
                        fontWeight: 'normal'
                      }}>
                        ({activeUserChallenges.length} active)
                      </span>
                    )}
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

                {challengesLoading ? (
                  <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="loading-skeleton" style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      margin: '0 auto 1rem'
                    }}></div>
                    <div className="loading-skeleton" style={{
                      width: '200px',
                      height: '20px',
                      margin: '0 auto'
                    }}></div>
                  </div>
                ) : activeUserChallenges.length > 0 ? (
                  <div className="challenges-grid">
                    {activeUserChallenges.map(challenge => (
                      <div key={challenge.id} className="challenge-card glass">
                        <div className="challenge-header">
                          <span className={`challenge-type type-${challenge.category || challenge.type}`}>
                            {challenge.category || challenge.type}
                          </span>
                          <span style={{
                            fontSize: '0.75rem',
                            color: '#71717a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            <Users size={12} />
                            {challenge.participants || 0}
                          </span>
                        </div>

                        <h3 className="challenge-title">
                          <span style={{ marginRight: '0.5rem' }}>{challenge.icon || '🎯'}</span>
                          {challenge.name}
                        </h3>
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
                            {challenge.duration === 'daily' ? 'Daily' :
                             challenge.duration === 'weekly' ? 'Weekly' :
                             typeof challenge.duration === 'number' ? `${challenge.duration} days` :
                             challenge.duration}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#00E5FF',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <div style={{
                              width: '60px',
                              height: '4px',
                              background: 'rgba(255,255,255,0.1)',
                              borderRadius: '2px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${challenge.progress || 0}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #00E5FF, #7F00FF)',
                                borderRadius: '2px'
                              }}></div>
                            </div>
                            {challenge.progress || 0}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">🎯</div>
                    <div className="empty-title">No Active Challenges</div>
                    <p className="empty-description">Join challenges below to build discipline and track your progress.</p>
                  </div>
                )}
              </section>

              {/* Available Challenges */}
              <section className="activity-section glass">
                <div className="section-header">
                  <h2 className="section-title">
                    <Compass size={24} />
                    Available Challenges
                    {availableChallenges.length > 0 && (
                      <span style={{
                        fontSize: '0.875rem',
                        marginLeft: '0.5rem',
                        color: '#71717a',
                        fontWeight: 'normal'
                      }}>
                        ({availableChallenges.length} available)
                      </span>
                    )}
                  </h2>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <select
                      className="form-select"
                      style={{
                        width: 'auto',
                        padding: '0.5rem 1rem',
                        fontSize: '0.75rem'
                      }}
                      onChange={(e) => {
                        // Add filter functionality if needed
                      }}
                    >
                      <option value="all">All Categories</option>
                      <option value="mindfulness">Mindfulness</option>
                      <option value="exploration">Exploration</option>
                      <option value="discipline">Discipline</option>
                      <option value="community">Community</option>
                    </select>
                  </div>
                </div>

                {challengesLoading ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="challenge-card glass loading-skeleton" style={{ height: '300px' }}></div>
                    ))}
                  </div>
                ) : availableChallenges.length > 0 ? (
                  <div className="challenges-grid">
                    {availableChallenges.map(challenge => {
                      // Check if user has already joined this challenge
                      const isJoined = activeUserChallenges.some(c => c.id === challenge.id);

                      return (
                        <div key={challenge.id} className="challenge-card glass">
                          <div className="challenge-header">
                            <span className={`challenge-type type-${challenge.category || challenge.type}`}>
                              {challenge.category || challenge.type}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.75rem', color: '#71717a' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}>
                                  <Users size={12} />
                                  {challenge.participants || 0}
                                </span>
                              </span>
                              <span style={{
                                fontSize: '0.625rem',
                                padding: '0.125rem 0.5rem',
                                borderRadius: '9999px',
                                background: challenge.difficulty === 'easy' ? 'rgba(34, 197, 94, 0.1)' :
                                           challenge.difficulty === 'medium' ? 'rgba(245, 158, 11, 0.1)' :
                                           'rgba(239, 68, 68, 0.1)',
                                color: challenge.difficulty === 'easy' ? '#22c55e' :
                                       challenge.difficulty === 'medium' ? '#f59e0b' :
                                       '#ef4444'
                              }}>
                                {challenge.difficulty}
                              </span>
                            </div>
                          </div>

                          <h3 className="challenge-title">
                            <span style={{ marginRight: '0.5rem' }}>{challenge.icon || '🎯'}</span>
                            {challenge.name}
                          </h3>
                          <p className="challenge-description">{challenge.description}</p>

                          <div className="challenge-rules">
                            {challenge.rules?.slice(0, 2).map((rule, index) => (
                              <div key={index} className="rule-item">
                                <CheckCircle size={12} className="rule-icon" />
                                <span>{rule}</span>
                              </div>
                            ))}
                            {challenge.rules?.length > 2 && (
                              <div className="rule-item" style={{ color: '#71717a', fontSize: '0.75rem' }}>
                                +{challenge.rules.length - 2} more rules
                              </div>
                            )}
                          </div>

                          <div className="challenge-footer">
                            <div className="challenge-duration">
                              {challenge.duration === 'daily' ? 'Daily Challenge' :
                               challenge.duration === 'weekly' ? 'Weekly Challenge' :
                               typeof challenge.duration === 'number' ? `${challenge.duration}-Day Challenge` :
                               challenge.duration}
                            </div>
                            <button
                              className={`profile-button ${isJoined ? 'button-secondary' : 'button-primary'}`}
                              onClick={() => !isJoined && handleJoinChallenge(challenge)}
                              disabled={challengesLoading || isJoined}
                              style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.75rem',
                                opacity: isJoined ? 0.6 : 1
                              }}
                            >
                              {challengesLoading ? (
                                <>
                                  <div className="loading-skeleton" style={{ width: '12px', height: '12px', borderRadius: '50%' }}></div>
                                  Joining...
                                </>
                              ) : isJoined ? (
                                <>
                                  <CheckCircle size={14} />
                                  Joined
                                </>
                              ) : (
                                <>
                                  <Plus size={14} />
                                  Join Challenge
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <div className="empty-title">No Challenges Available</div>
                    <p className="empty-description">Check back later for new challenges or create your own!</p>
                    <button
                      className="profile-button button-primary"
                      onClick={() => setShowCreateChallenge(true)}
                      style={{ marginTop: '1rem' }}
                    >
                      <Plus size={16} />
                      Create Your Own Challenge
                    </button>
                  </div>
                )}
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
            
            <div className="modal-grid">
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
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
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
          className="achievement-toast"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <div className="flex items-center gap-4">
            <div style={{ width: '3rem', height: '3rem', borderRadius: '1rem', background: 'linear-gradient(to bottom right, #fbbf24, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Trophy size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>Achievement Unlocked!</div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>You earned 100 XP for your dedication</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;