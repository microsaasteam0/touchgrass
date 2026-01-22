

// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { toast } from 'react-hot-toast';
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
//   Copy
// } from 'lucide-react';

// const Dashboard = ({ onNavigate }) => {
//   // Authentication & User State
//   const [showAchievement, setShowAchievement] = useState(false);
//   const [showSocialShareModal, setShowSocialShareModal] = useState(false);
//   const [showProfileModal, setShowProfileModal] = useState(false);
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

//   // CSS Styles matching homepage
//   const styles = `
//     /* Dashboard CSS matching homepage styling */
//     .dashboard-page {
//       width: 100%;
//       overflow-x: hidden;
//       background: #050505;
//       color: white;
//       font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
//       position: relative;
//       min-height: 100vh;
//     }

//     /* Background Effects */
//     .dashboard-bg-grid {
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

//     .dashboard-floating-elements {
//       position: fixed;
//       width: 100%;
//       height: 100%;
//       pointer-events: none;
//       z-index: 1;
//     }

//     .dashboard-floating-element {
//       position: absolute;
//       border-radius: 50%;
//       filter: blur(40px);
//       opacity: 0.1;
//       animation: float 20s infinite linear;
//     }

//     .dashboard-float-1 {
//       width: 400px;
//       height: 400px;
//       background: linear-gradient(135deg, #22c55e, #3b82f6);
//       top: 10%;
//       left: 10%;
//       animation-delay: 0s;
//     }

//     .dashboard-float-2 {
//       width: 300px;
//       height: 300px;
//       background: linear-gradient(135deg, #8b5cf6, #ec4899);
//       top: 60%;
//       right: 15%;
//       animation-delay: -5s;
//     }

//     .dashboard-float-3 {
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

//     /* Dashboard Navigation */
//     .dashboard-nav {
//       position: fixed;
//       top: 0;
//       left: 0;
//       right: 0;
//       z-index: 50;
//       padding: 1rem 1.5rem;
//       border-bottom: 1px solid rgba(255, 255, 255, 0.05);
//       background: rgba(15, 23, 42, 0.95);
//     }

//     .dashboard-nav-container {
//       max-width: 1400px;
//       margin: 0 auto;
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//     }

//     .dashboard-nav-logo {
//       display: flex;
//       align-items: center;
//       gap: 0.5rem;
//     }

//     .dashboard-nav-logo-text {
//       font-size: 1.5rem;
//       font-weight: 900;
//       letter-spacing: -0.025em;
//       text-transform: uppercase;
//       font-style: italic;
//     }

//     .dashboard-nav-logo-highlight {
//       color: #00E5FF;
//     }

//     .dashboard-nav-links {
//       display: none;
//     }

//     @media (min-width: 768px) {
//       .dashboard-nav-links {
//         display: flex;
//         align-items: center;
//         gap: 2rem;
//       }
//     }

//     .dashboard-nav-link {
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

//     .dashboard-nav-link:hover {
//       color: white;
//     }

//     .dashboard-nav-button {
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

//     .dashboard-nav-button:hover {
//       transform: scale(1.05);
//       box-shadow: 0 0 20px rgba(0, 229, 255, 0.4);
//     }

//     .dashboard-nav-button:active {
//       transform: scale(0.95);
//     }

//     /* User Profile Button */
//     .user-profile-button {
//       display: flex;
//       align-items: center;
//       gap: 0.75rem;
//       padding: 0.5rem 1rem;
//       border-radius: 1rem;
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       cursor: pointer;
//       transition: all 0.2s;
//     }

//     .user-profile-button:hover {
//       background: rgba(255, 255, 255, 0.1);
//       transform: translateY(-2px);
//     }

//     .user-avatar {
//       width: 2rem;
//       height: 2rem;
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
//       font-size: 0.75rem;
//       font-weight: 700;
//     }

//     .user-status {
//       font-size: 0.625rem;
//       color: #22c55e;
//       display: flex;
//       align-items: center;
//       gap: 0.25rem;
//     }

//     /* Dashboard Header */
//     .dashboard-header {
//       padding-top: 8rem;
//       padding-bottom: 4rem;
//       padding-left: 1.5rem;
//       padding-right: 1.5rem;
//       text-align: center;
//       position: relative;
//       z-index: 2;
//     }

//     @media (min-width: 768px) {
//       .dashboard-header {
//         text-align: left;
//       }
//     }

//     .dashboard-header-container {
//       max-width: 1400px;
//       margin: 0 auto;
//     }

//     .dashboard-welcome {
//       font-size: 4rem;
//       font-weight: 900;
//       letter-spacing: -0.025em;
//       line-height: 1;
//       margin-bottom: 1.5rem;
//       text-transform: uppercase;
//       font-style: italic;
//     }

//     .dashboard-subtitle {
//       font-size: 1.25rem;
//       color: #a1a1aa;
//       max-width: 600px;
//       line-height: 1.75;
//       font-weight: 300;
//     }

//     /* Main Grid */
//     .dashboard-grid {
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
//       .dashboard-grid {
//         grid-template-columns: 2fr 1fr;
//       }
//     }

//     /* Main Content */
//     .dashboard-main-content {
//       display: flex;
//       flex-direction: column;
//       gap: 2rem;
//     }

//     /* Streak Spotlight */
//     .streak-spotlight {
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
//       .streak-spotlight {
//         flex-direction: row;
//         align-items: center;
//         justify-content: space-between;
//       }
//     }

//     .streak-visual {
//       position: relative;
//       text-align: center;
//     }

//     .streak-circle {
//       width: 160px;
//       height: 160px;
//       border-radius: 50%;
//       border: 4px solid rgba(0, 229, 255, 0.2);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       margin: 0 auto;
//     }

//     .streak-number {
//       font-size: 5rem;
//       font-weight: 900;
//       background: linear-gradient(135deg, #00E5FF 0%, #7F00FF 100%);
//       -webkit-background-clip: text;
//       -webkit-text-fill-color: transparent;
//       background-clip: text;
//     }

//     .streak-info {
//       flex: 1;
//       text-align: center;
//     }

//     @media (min-width: 768px) {
//       .streak-info {
//         text-align: left;
//       }
//     }

//     .streak-title {
//       font-size: 2rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: -0.025em;
//       margin-bottom: 1rem;
//     }

//     .streak-description {
//       color: #71717a;
//       font-size: 1rem;
//       font-weight: 300;
//       line-height: 1.75;
//       margin-bottom: 2rem;
//       max-width: 400px;
//     }

//     .streak-actions {
//       display: flex;
//       flex-direction: column;
//       gap: 1rem;
//     }

//     @media (min-width: 768px) {
//       .streak-actions {
//         flex-direction: row;
//       }
//     }

//     .dashboard-button {
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

//     .dashboard-button:hover {
//       transform: scale(1.05);
//     }

//     .dashboard-button:active {
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

//     /* Challenges */
//     .challenge-card {
//       display: flex;
//       align-items: center;
//       gap: 1.5rem;
//       padding: 2rem;
//       border-radius: 2rem;
//       border: 1px solid rgba(255, 255, 255, 0.05);
//       background: rgba(255, 255, 255, 0.01);
//       transition: all 0.3s;
//     }

//     .challenge-card:hover {
//       background: rgba(255, 255, 255, 0.03);
//       transform: translateY(-5px);
//     }

//     .challenge-icon {
//       font-size: 2.5rem;
//     }

//     .challenge-content {
//       flex: 1;
//     }

//     .challenge-header {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       margin-bottom: 0.75rem;
//     }

//     .challenge-name {
//       font-weight: 700;
//       font-size: 1.125rem;
//     }

//     .challenge-progress {
//       color: #00E5FF;
//       font-weight: 900;
//       font-size: 1.25rem;
//     }

//     .progress-bar {
//       height: 0.5rem;
//       background: rgba(255, 255, 255, 0.05);
//       border-radius: 9999px;
//       overflow: hidden;
//       margin-bottom: 0.5rem;
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

//     .challenge-meta {
//       display: flex;
//       justify-content: space-between;
//       font-size: 0.75rem;
//       color: #71717a;
//     }

//     /* Sidebar */
//     .dashboard-sidebar {
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

//     /* Profile Modal */
//     .profile-modal {
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

//     .profile-content {
//       width: 100%;
//       max-width: 500px;
//       border-radius: 2rem;
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       background: rgba(15, 23, 42, 0.95);
//       position: relative;
//       overflow: hidden;
//     }

//     .profile-header {
//       padding: 2rem;
//       text-align: center;
//       background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(127, 0, 255, 0.1));
//     }

//     .profile-avatar {
//       width: 120px;
//       height: 120px;
//       border-radius: 50%;
//       object-fit: cover;
//       border: 4px solid #00E5FF;
//       margin: 0 auto 1rem;
//     }

//     .profile-name {
//       font-size: 2rem;
//       font-weight: 900;
//       margin-bottom: 0.5rem;
//       background: linear-gradient(135deg, #00E5FF, #7F00FF);
//       -webkit-background-clip: text;
//       -webkit-text-fill-color: transparent;
//       background-clip: text;
//     }

//     .profile-bio {
//       color: #a1a1aa;
//       font-size: 0.875rem;
//       line-height: 1.5;
//     }

//     .profile-info {
//       padding: 2rem;
//     }

//     .profile-info-item {
//       display: flex;
//       align-items: center;
//       gap: 1rem;
//       padding: 1rem;
//       border-bottom: 1px solid rgba(255, 255, 255, 0.05);
//     }

//     .profile-info-icon {
//       width: 2rem;
//       height: 2rem;
//       border-radius: 0.5rem;
//       background: rgba(0, 229, 255, 0.1);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       color: #00E5FF;
//     }

//     .profile-info-label {
//       font-size: 0.75rem;
//       color: #71717a;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//       margin-bottom: 0.25rem;
//     }

//     .profile-info-value {
//       font-size: 0.875rem;
//       font-weight: 600;
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

//     .modal-header {
//       text-align: center;
//       margin-bottom: 3rem;
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

//     .modal-grid {
//       display: grid;
//       grid-template-columns: repeat(2, 1fr);
//       gap: 1rem;
//       margin-bottom: 2rem;
//     }

//     @media (min-width: 768px) {
//       .modal-grid {
//         grid-template-columns: repeat(3, 1fr);
//       }
//     }

//     .modal-button {
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       gap: 1rem;
//       padding: 1.5rem;
//       border-radius: 1.5rem;
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       background: rgba(255, 255, 255, 0.05);
//       color: white;
//       cursor: pointer;
//       transition: all 0.3s;
//       text-align: center;
//     }

//     .modal-button:hover {
//       transform: scale(1.05);
//     }

//     .modal-button-icon {
//       width: 3.5rem;
//       height: 3.5rem;
//       border-radius: 1rem;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 1.5rem;
//     }

//     .modal-button-name {
//       font-weight: 700;
//       font-size: 0.875rem;
//     }

//     .modal-button-description {
//       font-size: 0.75rem;
//       color: #a1a1aa;
//     }

//     .modal-tip {
//       padding: 1.5rem;
//       border-radius: 1.5rem;
//       background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(127, 0, 255, 0.1));
//       border: 1px solid rgba(0, 229, 255, 0.2);
//       text-align: center;
//     }

//     .modal-tip-title {
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       gap: 0.5rem;
//       margin-bottom: 0.75rem;
//       font-weight: 700;
//     }

//     .modal-tip-icon {
//       width: 1.5rem;
//       height: 1.5rem;
//       border-radius: 0.5rem;
//       background: linear-gradient(135deg, #00E5FF, #7F00FF);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 0.75rem;
//     }

//     .modal-tip-text {
//       font-size: 0.875rem;
//       color: #d4d4d8;
//       line-height: 1.5;
//     }

//     /* Time Counter */
//     .time-counter {
//       display: flex;
//       align-items: center;
//       gap: 0.75rem;
//       padding: 0.75rem 1.25rem;
//       border-radius: 1rem;
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       background: rgba(255, 255, 255, 0.05);
//     }

//     .time-label {
//       font-size: 0.625rem;
//       font-weight: 900;
//       text-transform: uppercase;
//       letter-spacing: 0.2em;
//       color: #71717a;
//     }

//     .time-value {
//       font-family: monospace;
//       font-size: 0.875rem;
//       font-weight: 700;
//       color: #00E5FF;
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

//     /* Confetti */
//     @keyframes confetti-fall {
//       0% {
//         transform: translateY(-100vh) rotate(0deg);
//         opacity: 1;
//       }
//       100% {
//         transform: translateY(100vh) rotate(360deg);
//         opacity: 0;
//       }
//     }

//     /* Form Inputs */
//     .form-input {
//       width: 100%;
//       padding: 0.75rem 1rem;
//       border-radius: 0.75rem;
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

//     .form-label {
//       display: block;
//       font-size: 0.75rem;
//       font-weight: 600;
//       text-transform: uppercase;
//       letter-spacing: 0.1em;
//       color: #71717a;
//       margin-bottom: 0.5rem;
//     }

//     .form-group {
//       margin-bottom: 1.5rem;
//     }

//     .form-actions {
//       display: flex;
//       gap: 1rem;
//       margin-top: 2rem;
//     }

//     /* WhatsApp Button Style */
//     .whatsapp-button {
//       background: rgba(37, 211, 102, 0.2);
//       border-color: rgba(37, 211, 102, 0.3);
//     }

//     .whatsapp-button:hover {
//       background: rgba(37, 211, 102, 0.3);
//     }

//     /* Copy Link Button */
//     .copy-link-button {
//       background: rgba(139, 92, 246, 0.2);
//       border-color: rgba(139, 92, 246, 0.3);
//     }

//     .copy-link-button:hover {
//       background: rgba(139, 92, 246, 0.3);
//     }
//   `;

//   // Helper function to extract name from email
//   const extractNameFromEmail = (email) => {
//     if (!email) return 'User';
//     // Remove @gmail.com or any domain
//     const name = email.split('@')[0];
//     // Capitalize first letter
//     return name.charAt(0).toUpperCase() + name.slice(1);
//   };

//   // Navigation function
//   const navigateTo = (page) => {
//     if (onNavigate && typeof onNavigate === 'function') {
//       onNavigate(page);
//     } else {
//       switch(page) {
//         case 'verify':
//           window.location.href = '/verify';
//           break;
//         case 'leaderboard':
//           window.location.href = '/leaderboard';
//           break;
//         case 'social':
//           window.location.href = '/social';
//           break;
//         case 'profile':
//           window.location.href = '/profile';
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
//           console.log('Navigating to:', page);
//       }
//     }
//   };

//   // Load REAL user data from localStorage and auth
//   const loadUserData = () => {
//     try {
//       // 1. Check localStorage first
//       const storedUser = localStorage.getItem('touchgrass_user');
      
//       if (storedUser) {
//         const user = JSON.parse(storedUser);
//         console.log('Loaded user from localStorage:', user);
        
//         // Ensure displayName is set from username (without @gmail.com)
//         if (user.email && (!user.displayName || user.displayName.includes('@'))) {
//           user.displayName = extractNameFromEmail(user.email);
//           localStorage.setItem('touchgrass_user', JSON.stringify(user));
//         }
        
//         return user;
//       }
      
//       // 2. Check if user is authenticated via auth system
//       const authState = localStorage.getItem('authState');
//       if (authState) {
//         const auth = JSON.parse(authState);
//         if (auth.isAuthenticated && auth.user) {
//           const displayName = auth.user.displayName || 
//                              extractNameFromEmail(auth.user.email) || 
//                              auth.user.username;
          
//           const newUser = {
//             id: auth.user.id || Date.now().toString(),
//             username: auth.user.username,
//             displayName: displayName,
//             email: auth.user.email || `${auth.user.username}@example.com`,
//             avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.user.username}`,
//             location: auth.user.location || { city: 'Online', country: 'Internet' },
//             bio: auth.user.bio || `Building daily discipline through outdoor accountability.`,
//             createdAt: new Date().toISOString(),
//             lastActive: new Date().toISOString()
//           };
          
//           console.log('Created new user from auth:', newUser);
//           localStorage.setItem('touchgrass_user', JSON.stringify(newUser));
//           return newUser;
//         }
//       }
      
//       // 3. Check for registration data
//       const registrationData = localStorage.getItem('registration_data');
//       if (registrationData) {
//         const regData = JSON.parse(registrationData);
//         const displayName = regData.name || 
//                            extractNameFromEmail(regData.email) || 
//                            regData.username;
        
//         const newUser = {
//           id: Date.now().toString(),
//           username: regData.username || `user${Date.now()}`,
//           displayName: displayName,
//           email: regData.email || `${regData.username}@example.com`,
//           avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${regData.username}`,
//           location: { city: regData.city || 'Online', country: regData.country || 'Internet' },
//           bio: regData.bio || `Building daily discipline through outdoor accountability.`,
//           createdAt: new Date().toISOString(),
//           lastActive: new Date().toISOString()
//         };
        
//         console.log('Created user from registration:', newUser);
//         localStorage.setItem('touchgrass_user', JSON.stringify(newUser));
//         return newUser;
//       }
      
//       return null;
//     } catch (error) {
//       console.error('Error loading user data:', error);
//       return null;
//     }
//   };

//   // Load user's streak data
//   const loadStreakData = (username) => {
//     try {
//       const streakKey = `touchgrass_streak_${username}`;
//       const storedStreak = localStorage.getItem(streakKey);
      
//       if (storedStreak) {
//         const streak = JSON.parse(storedStreak);
//         console.log('Loaded streak data:', streak);
//         return streak;
//       }
      
//       // Initialize new streak for user
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
      
//       console.log('Created new streak:', newStreak);
//       localStorage.setItem(streakKey, JSON.stringify(newStreak));
//       return newStreak;
//     } catch (error) {
//       console.error('Error loading streak data:', error);
//       return null;
//     }
//   };

//   // Save streak data
//   const saveStreakData = (username, streakData) => {
//     try {
//       const streakKey = `touchgrass_streak_${username}`;
//       localStorage.setItem(streakKey, JSON.stringify(streakData));
//       console.log('Saved streak data:', streakData);
//     } catch (error) {
//       console.error('Error saving streak data:', error);
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
//       console.error('Error updating profile:', error);
//       toast.error('Failed to update profile');
//       return false;
//     }
//   };

//   // Handle verification
//   const handleVerify = () => {
//     if (!userData) {
//       toast.error('Please login to verify');
//       navigateTo('auth');
//       return;
//     }
    
//     // Navigate to verification page
//     navigateTo('verify');
//   };

//   // Handle daily verification completion
//   const completeVerification = (verificationData) => {
//     if (!userData) return;
    
//     const streakKey = `touchgrass_streak_${userData.username}`;
//     const storedStreak = localStorage.getItem(streakKey);
    
//     if (storedStreak) {
//       const streak = JSON.parse(storedStreak);
//       const today = new Date().toDateString();
      
//       // Check if already verified today
//       const alreadyVerified = streak.history?.some(entry => {
//         const entryDate = new Date(entry.date);
//         return entryDate.toDateString() === today && entry.verified === true;
//       });
      
//       if (!alreadyVerified) {
//         // Add new verification
//         const newEntry = {
//           date: new Date().toISOString(),
//           verified: true,
//           duration: verificationData.duration || 30,
//           activity: verificationData.activity || 'Outdoor time',
//           location: verificationData.location || 'Unknown',
//           proof: verificationData.proof || null
//         };
        
//         const updatedStreak = {
//           ...streak,
//           currentStreak: streak.currentStreak + 1,
//           longestStreak: Math.max(streak.longestStreak, streak.currentStreak + 1),
//           totalDays: streak.totalDays + 1,
//           totalOutdoorTime: streak.totalOutdoorTime + (verificationData.duration || 30),
//           todayVerified: true,
//           lastVerification: new Date().toISOString(),
//           history: [...(streak.history || []), newEntry]
//         };
        
//         saveStreakData(userData.username, updatedStreak);
        
//         // Show achievement
//         setShowAchievement(true);
//         setTimeout(() => setShowAchievement(false), 3000);
        
//         toast.success(`Day ${updatedStreak.currentStreak} verified! Streak continued!`);
        
//         // Refresh dashboard data
//         initializeDashboard();
//       } else {
//         toast.error('Already verified today!');
//       }
//     }
//   };

//   // Check if user verified today - FIXED: Check streakData.todayVerified
//   const checkTodayVerified = (streakData) => {
//     if (!streakData) return false;
    
//     // First check the todayVerified flag
//     if (streakData.todayVerified) return true;
    
//     // Fallback: check history
//     if (!streakData.history) return false;
    
//     const today = new Date();
//     const todayDate = today.toDateString();
    
//     return streakData.history.some(entry => {
//       if (!entry.date) return false;
//       try {
//         const entryDate = new Date(entry.date);
//         return entryDate.toDateString() === todayDate && entry.verified === true;
//       } catch (e) {
//         return false;
//       }
//     });
//   };

//   // Calculate time left for today's verification
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

//   // Format time ago
//   const timeAgo = (timestamp) => {
//     if (!timestamp) return 'Just now';
    
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

//   // Initialize dashboard data
//   const initializeDashboard = async () => {
//     setIsLoading(true);
    
//     try {
//       const user = loadUserData();
      
//       if (!user) {
//         // Redirect to auth if no user found
//         toast.error('Please login to access your dashboard');
//         setTimeout(() => navigateTo('auth'), 1500);
//         return;
//       }
      
//       setUserData(user);
      
//       const streakData = loadStreakData(user.username);
      
//       // Update today's verification status - FIXED: Use checkTodayVerified function
//       const todayVerified = checkTodayVerified(streakData);
//       streakData.todayVerified = todayVerified;
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
//           title: "Challenge Wins",
//           value: streakData.challengeWins || 0,
//           change: "+5",
//           description: "Challenges completed",
//           icon: <Trophy size={24} />
//         },
//         {
//           id: 5,
//           title: "Social Score",
//           value: streakData.viralScore || 0,
//           change: "+24",
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
//           action: "✅ Verified today's outdoor time",
//           time: 'Just now',
//           icon: <CheckCircle2 size={20} />,
//           meta: 'Verified Today'
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

//       // Prepare social stats
//       const socialPlatforms = [];
//       if (streakData.shareCount > 0) {
//         socialPlatforms.push(
//           {
//             id: 1,
//             platform: "Twitter",
//             icon: <Twitter size={20} />,
//             color: "rgba(29, 161, 242, 0.2)",
//             metrics: `${Math.min(streakData.shareCount, 24)} Shares • 1.2K Views`
//           },
//           {
//             id: 2,
//             platform: "LinkedIn",
//             icon: <Linkedin size={20} />,
//             color: "rgba(0, 119, 181, 0.2)",
//             metrics: `${Math.min(streakData.shareCount, 18)} Shares • 420 Views`
//           },
//           {
//             id: 3,
//             platform: "Instagram",
//             icon: <Instagram size={20} />,
//             color: "rgba(225, 48, 108, 0.2)",
//             metrics: `${Math.min(streakData.shareCount, 12)} Shares • 780 Likes`
//           }
//         );
//       }

//       // Prepare challenges
//       const userChallenges = [];
//       if (streakData.currentStreak >= 7) {
//         userChallenges.push({
//           id: 1,
//           name: "7-Day Sprint",
//           progress: Math.min(100, Math.round((streakData.currentStreak / 7) * 100)),
//           current: streakData.currentStreak,
//           total: 7,
//           icon: "🔥"
//         });
//       }
//       if (streakData.totalDays >= 30) {
//         userChallenges.push({
//           id: 2,
//           name: "Monthly Warrior",
//           progress: Math.min(100, Math.round((streakData.totalDays / 30) * 100)),
//           current: streakData.totalDays,
//           total: 30,
//           icon: "🏆"
//         });
//       }
//       if (streakData.shareCount >= 10) {
//         userChallenges.push({
//           id: 3,
//           name: "Social Butterfly",
//           progress: Math.min(100, Math.round((streakData.shareCount / 10) * 100)),
//           current: streakData.shareCount,
//           total: 10,
//           icon: "🦋"
//         });
//       }

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
//           description: "shared their streaks"
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
//       setChallenges(userChallenges);
//       setAchievements(userAchievements);
      
//       console.log('Dashboard initialized with real data:', { user, streakData });
      
//     } catch (error) {
//       console.error('Error initializing dashboard:', error);
//       toast.error('Failed to load dashboard data');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle social share - FIXED: Added proper WhatsApp and Instagram sharing
//   const handleSocialShare = (platform) => {
//     if (!userData) {
//       toast.error('Please login to share');
//       return;
//     }
    
//     const streakData = loadStreakData(userData.username);
    
//     // Update share count
//     const updatedStreak = {
//       ...streakData,
//       shareCount: streakData.shareCount + 1,
//       viralScore: streakData.viralScore + Math.floor(Math.random() * 10) + 1
//     };
    
//     saveStreakData(userData.username, updatedStreak);
    
//     const baseUrl = window.location.origin;
//     const profileUrl = `${baseUrl}/profile/${userData.username}`;
    
//     const shareTexts = {
//       twitter: `🔥 Day ${streakData.currentStreak} of my #TouchGrass streak! Building discipline one day at a time. Join me: ${profileUrl} #Accountability #Streak #MentalHealth`,
//       linkedin: `${userData.displayName} has maintained a ${streakData.currentStreak}-day outdoor streak on TouchGrass\n\nBuilding professional discipline through daily habits. Check it out: ${profileUrl}\n\n#ProfessionalGrowth #Wellness #Discipline`,
//       facebook: `I've touched grass for ${streakData.currentStreak} days in a row! Join me in building better habits: ${profileUrl}`,
//       instagram: `Day ${streakData.currentStreak} of my #TouchGrass journey 🌱\n\nBuilding real-world discipline one day at a time.\n\nJoin me: ${profileUrl}\n\n#Streak #Accountability #MentalHealth #Outdoor`,
//       whatsapp: `Check out my ${streakData.currentStreak}-day TouchGrass streak! ${profileUrl}`
//     };

//     const shareConfigs = {
//       twitter: {
//         url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTexts.twitter)}&url=${encodeURIComponent(profileUrl)}`,
//         name: 'Twitter'
//       },
//       linkedin: {
//         url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
//         name: 'LinkedIn'
//       },
//       facebook: {
//         url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
//         name: 'Facebook'
//       },
//       whatsapp: {
//         url: `https://wa.me/?text=${encodeURIComponent(shareTexts.whatsapp)}`,
//         name: 'WhatsApp'
//       },
//       instagram: {
//         url: `https://www.instagram.com/`,
//         name: 'Instagram'
//       }
//     };

//     const config = shareConfigs[platform];
//     if (!config) {
//       return;
//     }

//     if (platform === 'instagram') {
//       // For Instagram, provide instructions
//       toast('📸 For Instagram: Take a screenshot and share it in your stories!\n\nYou can also use the link below:', {
//         icon: '📸',
//         duration: 5000
//       });
      
//       // Show the profile URL for copying
//       setTimeout(() => {
//         navigator.clipboard.writeText(profileUrl);
//         toast.success('Profile link copied to clipboard! Paste it in your Instagram bio or story.');
//       }, 1000);
      
//       return;
//     }

//     // Open share window for other platforms
//     window.open(config.url, '_blank', 'width=600,height=400');
    
//     toast.success(`Shared to ${config.name}! Social score +${updatedStreak.viralScore - streakData.viralScore}`, {
//       icon: '🚀'
//     });
    
//     // Refresh dashboard
//     initializeDashboard();
//   };

//   // Copy profile link to clipboard
//   const copyProfileLink = () => {
//     if (!userData) {
//       toast.error('Please login to copy link');
//       return;
//     }
    
//     const baseUrl = window.location.origin;
//     const profileUrl = `${baseUrl}/profile/${userData.username}`;
    
//     navigator.clipboard.writeText(profileUrl)
//       .then(() => {
//         toast.success('Profile link copied to clipboard!', {
//           icon: '📋'
//         });
        
//         // Update share count
//         const streakData = loadStreakData(userData.username);
//         const updatedStreak = {
//           ...streakData,
//           shareCount: streakData.shareCount + 1,
//           viralScore: streakData.viralScore + 1
//         };
        
//         saveStreakData(userData.username, updatedStreak);
//         initializeDashboard();
//       })
//       .catch(err => {
//         console.error('Failed to copy:', err);
//         toast.error('Failed to copy link');
//       });
//   };

//   // Handle profile edit
//   const handleProfileEdit = () => {
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
//       setProfileEdit({ displayName: '', bio: '', city: '', country: '' });
//     }
//   };

//   // Quick actions
//   const quickActions = [
//     {
//       id: 1,
//       label: "Verify",
//       icon: <Camera size={24} />,
//       action: handleVerify
//     },
//     {
//       id: 2,
//       label: "Challenges",
//       icon: <Target size={24} />,
//       action: () => navigateTo('challenges')
//     },
//     {
//       id: 3,
//       label: "Share",
//       icon: <Share2 size={24} />,
//       action: () => setShowSocialShareModal(true)
//     },
//     {
//       id: 4,
//       label: "Profile",
//       icon: <User size={24} />,
//       action: () => setShowProfileModal(true)
//     }
//   ];

//   // Handle achievement click
//   const handleAchievementClick = (achievement) => {
//     setShowAchievement(true);
//     setTimeout(() => setShowAchievement(false), 3000);
//   };

//   // Initialize dashboard on mount
//   useEffect(() => {
//     initializeDashboard();
    
//     // Set up time counter
//     const timer = setInterval(() => {
//       setTimeLeft(calculateTimeLeft());
//     }, 1000);
    
//     return () => clearInterval(timer);
//   }, []);

//   // Listen for verification completion
//   useEffect(() => {
//     const handleVerificationComplete = (event) => {
//       if (event.detail && event.detail.type === 'verification-complete') {
//         completeVerification(event.detail.data);
//       }
//     };
    
//     window.addEventListener('verification-complete', handleVerificationComplete);
    
//     return () => {
//       window.removeEventListener('verification-complete', handleVerificationComplete);
//     };
//   }, [userData]);

//   if (isLoading && !userData) {
//     return (
//       <div className="dashboard-page">
//         <style>{styles}</style>
        
//         <div className="dashboard-bg-grid"></div>
//         <div className="dashboard-floating-elements">
//           <div className="dashboard-floating-element dashboard-float-1"></div>
//           <div className="dashboard-floating-element dashboard-float-2"></div>
//           <div className="dashboard-floating-element dashboard-float-3"></div>
//         </div>

//         <nav className="dashboard-nav glass">
//           <div className="dashboard-nav-container">
//             <div className="dashboard-nav-logo">
//               <div className="dashboard-nav-logo-text">
//                 Touch<span className="dashboard-nav-logo-highlight">Grass</span>
//               </div>
//             </div>
            
//             <div className="dashboard-nav-button loading-skeleton" style={{ width: '120px', height: '40px' }}></div>
//           </div>
//         </nav>

//         <div className="dashboard-header">
//           <div className="dashboard-header-container">
//             <div className="loading-skeleton" style={{ height: '80px', width: '400px', marginBottom: '1.5rem', margin: '0 auto' }}></div>
//             <div className="loading-skeleton" style={{ height: '30px', width: '600px', margin: '0 auto' }}></div>
//           </div>
//         </div>

//         <div className="dashboard-grid">
//           <div className="dashboard-main-content">
//             <div className="loading-skeleton" style={{ height: '300px', borderRadius: '3rem' }}></div>
//             <div className="loading-skeleton" style={{ height: '400px', borderRadius: '3rem' }}></div>
//           </div>
//           <div className="dashboard-sidebar">
//             <div className="loading-skeleton" style={{ height: '300px', borderRadius: '3rem' }}></div>
//             <div className="loading-skeleton" style={{ height: '300px', borderRadius: '3rem' }}></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const streakData = userData ? loadStreakData(userData.username) : null;

//   return (
//     <div className="dashboard-page">
//       <style>{styles}</style>
      
//       {/* Background Effects */}
//       <div className="dashboard-bg-grid"></div>
//       <div className="dashboard-floating-elements">
//         <div className="dashboard-floating-element dashboard-float-1"></div>
//         <div className="dashboard-floating-element dashboard-float-2"></div>
//         <div className="dashboard-floating-element dashboard-float-3"></div>
//       </div>

//       {/* Navigation */}
//       <nav className="dashboard-nav glass">
//         <div className="dashboard-nav-container">
//           <div className="dashboard-nav-logo">
//             <div className="dashboard-nav-logo-text">
//               Touch<span className="dashboard-nav-logo-highlight">Grass</span>
//             </div>
//           </div>
          
//           <div className="dashboard-nav-links">
//             {/* <button className="dashboard-nav-link" onClick={() => navigateTo('verify')}>
//               Verify
//             </button> */}
//             <button className="dashboard-nav-link" onClick={() => navigateTo('challenges')}>
//               Challenges
//             </button>
//             <button className="dashboard-nav-link" onClick={() => navigateTo('profile')}>
//               Profile
//             </button>
//             <button className="dashboard-nav-link" onClick={() => navigateTo('leaderboard')}>
//               Leaderboard
//             </button>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="time-counter">
//               <Clock size={16} />
//               <span className="time-label">Time Left</span>
//               <span className="time-value">{timeLeft || '23:59:59'}</span>
//             </div>
            
//             {userData ? (
//               <button 
//                 className="user-profile-button"
//                 onClick={() => setShowProfileModal(true)} 
//               >
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
//                   {/* FIXED: Only show name without @gmail.com */}
//                   <div className="user-name">{userData.displayName}</div>
//                   <div className="user-status">
//                     <div className="w-2 h-2 rounded-full bg-green-500"></div>
//                     Online
//                   </div>
//                 </div>
//               </button>
//             ) : (
//               <button 
//                 className="dashboard-nav-button"
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
//       <header className="dashboard-header">
//         <div className="dashboard-header-container">
//           {/* FIXED: Welcome message shows only name without @gmail.com */}
//           <h1 className="dashboard-welcome text-gradient">
//             {userData ? `Welcome back, ${userData.displayName}!` : 'Welcome to TouchGrass'}
//           </h1>
//           <p className="dashboard-subtitle">
//             {userData ? 
//               `Your outdoor discipline is growing stronger every day. ${
//                 streakData?.currentStreak > 0 
//                   ? `You're on a ${streakData.currentStreak}-day streak!`
//                   : 'Start your streak today!'
//               }` 
//               : 'Join thousands building discipline through daily outdoor accountability.'}
//           </p>
//         </div>
//       </header>

//       {/* Main Grid */}
//       <main className="dashboard-grid">
//         {/* Left Column - Main Content */}
//         <div className="dashboard-main-content">
//           {/* Streak Spotlight */}
//           <section className="streak-spotlight glass">
//             <div className="streak-visual">
//               <div className="streak-circle">
//                 <div className="streak-number">{streakData?.currentStreak || 0}</div>
//               </div>
//               <div className="streak-label" style={{ marginTop: '1rem', color: '#71717a' }}>
//                 Day Streak
//               </div>
//             </div>
            
//             <div className="streak-info">
//               <h2 className="streak-title">
//                 {streakData?.currentStreak > 0 
//                   ? `Keep The Fire Burning 🔥` 
//                   : `Start Your Journey 🚀`}
//               </h2>
//               <p className="streak-description">
//                 {streakData?.currentStreak > 0
//                   ? streakData.todayVerified
//                     ? `✅ Verified Today! You're on track to beat your longest streak of ${streakData.longestStreak} days.`
//                     : `You're on a ${streakData.currentStreak}-day streak! Verify today to continue building discipline.`
//                   : 'Begin your discipline journey today! Verify your first day to start your streak and unlock achievements.'}
//               </p>
              
//               <div className="streak-actions">
//                 {/* FIXED: Button shows "Verified Today" instead of "Verify Today" when streak is verified */}
//                 <button 
//                   className="dashboard-button button-primary" 
//                   onClick={handleVerify}
//                   disabled={streakData?.todayVerified}
//                 >
//                   <Camera size={20} />
//                   {streakData?.todayVerified ? 'Verified Today' : 'Verify Now'}
//                   <ArrowRight size={20} />
//                 </button>
                
//                 <button 
//                   className="dashboard-button button-secondary" 
//                   onClick={() => setShowSocialShareModal(true)}
//                   disabled={!streakData || streakData.currentStreak === 0}
//                 >
//                   <Share2 size={20} />
//                   Share Streak
//                 </button>
//               </div>
//             </div>
//           </section>

//           {/* Stats Grid */}
//           <section>
//             <div className="section-header">
//               <h2 className="section-title">
//                 <Activity size={24} />
//                 Your Stats
//               </h2>
//               <button className="view-all-button">
//                 View All
//               </button>
//             </div>
            
//             <div className="stats-grid">
//               {stats.map(stat => (
//                 <div key={stat.id} className="stat-card glass">
//                   <div className="stat-header">
//                     <div className="stat-icon">
//                       {stat.icon}
//                     </div>
//                     <span className="stat-change">{stat.change}</span>
//                   </div>
                  
//                   <div className="stat-value">{stat.value}</div>
//                   <div className="stat-label">{stat.title}</div>
//                   <div className="stat-description">{stat.description}</div>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Active Challenges */}
//           <section className="activity-section glass">
//             <div className="section-header">
//               <h2 className="section-title">
//                 <TargetIcon2 size={24} />
//                 Active Challenges
//               </h2>
//               <button className="view-all-button" onClick={() => navigateTo('challenges')}>
//                 View All
//               </button>
//             </div>
            
//             <div className="activity-list">
//               {challenges.length > 0 ? (
//                 challenges.map(challenge => (
//                   <div key={challenge.id} className="challenge-card glass">
//                     <div className="challenge-icon">{challenge.icon}</div>
                    
//                     <div className="challenge-content">
//                       <div className="challenge-header">
//                         <div className="challenge-name">{challenge.name}</div>
//                         <div className="challenge-progress">{challenge.progress}%</div>
//                       </div>
                      
//                       <div className="progress-bar">
//                         <div 
//                           className="progress-fill" 
//                           style={{ width: `${challenge.progress}%` }}
//                         ></div>
//                       </div>
                      
//                       <div className="challenge-meta">
//                         <span>{challenge.current}/{challenge.total} days</span>
//                         <span>{challenge.progress}% complete</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="empty-state">
//                   <div className="empty-icon">🎯</div>
//                   <div className="empty-title">No Active Challenges</div>
//                   <p className="empty-description">Join challenges to earn rewards and compete with friends.</p>
//                   <button 
//                     className="dashboard-button button-secondary"
//                     onClick={() => navigateTo('challenges')}
//                   >
//                     <Target size={20} />
//                     Browse Challenges
//                   </button>
//                 </div>
//               )}
//             </div>
//           </section>

//           {/* Recent Activity */}
//           <section className="activity-section glass">
//             <div className="section-header">
//               <h2 className="section-title">
//                 <Clock size={24} />
//                 Recent Activity
//               </h2>
//               <button className="view-all-button">
//                 View All
//               </button>
//             </div>
            
//             <div className="activity-list">
//               {activities.length > 0 ? (
//                 activities.map(activity => (
//                   <div key={activity.id} className="activity-item glass">
//                     <div className="activity-icon">
//                       {activity.icon}
//                     </div>
                    
//                     <div className="activity-content">
//                       <div className="activity-action">{activity.action}</div>
//                       <div className="activity-time">{activity.time}</div>
//                     </div>
                    
//                     <div className="activity-meta">
//                       {activity.meta}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="empty-state">
//                   <div className="empty-icon">📝</div>
//                   <div className="empty-title">No Activity Yet</div>
//                   <p className="empty-description">Start verifying your outdoor time to see activity here.</p>
//                 </div>
//               )}
//             </div>
//           </section>
//         </div>

//         {/* Right Column - Sidebar */}
//         <div className="dashboard-sidebar">
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
//                   disabled={!userData && action.id !== 4}
//                 >
//                   <div className="quick-action-icon">
//                     {action.icon}
//                   </div>
//                   <span className="quick-action-label">{action.label}</span>
//                 </button>
//               ))}
//             </div>
//           </section>

//           {/* Achievements */}
//           <section className="performance-section glass">
//             <div className="section-header">
//               <h2 className="section-title">
//                 <Award size={24} />
//                 Achievements
//               </h2>
//               <button className="view-all-button">
//                 View All
//               </button>
//             </div>
            
//             <div className="achievements-grid">
//               {achievements.length > 0 ? (
//                 achievements.map(achievement => (
//                   <div
//                     key={achievement.id}
//                     className="achievement-card glass"
//                     onClick={() => handleAchievementClick(achievement)}
//                   >
//                     <div className="achievement-icon">{achievement.icon}</div>
//                     <div className="achievement-name">{achievement.name}</div>
//                     <div className="achievement-earned">{achievement.earned}</div>
//                     <div className="achievement-description">{achievement.description}</div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="empty-state">
//                   <div className="empty-icon">🏆</div>
//                   <div className="empty-title">No Achievements Yet</div>
//                   <p className="empty-description">Complete challenges to earn achievements.</p>
//                 </div>
//               )}
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
//               {socialStats.length > 0 ? (
//                 socialStats.map(stat => (
//                   <div key={stat.id} className="social-stat-item glass">
//                     <div 
//                       className="social-stat-icon" 
//                       style={{ background: stat.color }}
//                     >
//                       {stat.icon}
//                     </div>
                    
//                     <div className="social-stat-content">
//                       <div className="social-stat-platform">{stat.platform}</div>
//                       <div className="social-stat-metrics">{stat.metrics}</div>
//                     </div>
                    
//                     <ExternalLink size={16} />
//                   </div>
//                 ))
//               ) : (
//                 <div className="empty-state">
//                   <div className="empty-icon">📱</div>
//                   <div className="empty-title">No Social Data</div>
//                   <p className="empty-description">Share your proofs to see impact metrics.</p>
//                 </div>
//               )}
//             </div>
//           </section>
//         </div>
//       </main>

//       {/* Profile Modal */}
//       {showProfileModal && userData && (
//         <div className="profile-modal">
//           <motion.div 
//             className="profile-content glass"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//           >
//             <button 
//               className="modal-close"
//               onClick={() => setShowProfileModal(false)}
//             >
//               ✕
//             </button>
            
//             <div className="profile-header">
//               <img 
//                 src={userData.avatar} 
//                 alt={userData.displayName}
//                 className="profile-avatar"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`;
//                 }}
//               />
//               <h2 className="profile-name">{userData.displayName}</h2>
//               <p className="profile-bio">{userData.bio}</p>
//             </div>
            
//             <div className="profile-info">
//               <div className="profile-info-item">
//                 <div className="profile-info-icon">
//                   <User size={16} />
//                 </div>
//                 <div>
//                   <div className="profile-info-label">Username</div>
//                   <div className="profile-info-value">{userData.username}</div>
//                 </div>
//               </div>
              
//               <div className="profile-info-item">
//                 <div className="profile-info-icon">
//                   <Mail size={16} />
//                 </div>
//                 <div>
//                   <div className="profile-info-label">Email</div>
//                   <div className="profile-info-value">{userData.email}</div>
//                 </div>
//               </div>
              
//               <div className="profile-info-item">
//                 <div className="profile-info-icon">
//                   <Calendar size={16} />
//                 </div>
//                 <div>
//                   <div className="profile-info-label">Member Since</div>
//                   <div className="profile-info-value">
//                     {new Date(userData.createdAt).toLocaleDateString('en-US', {
//                       year: 'numeric',
//                       month: 'long',
//                       day: 'numeric'
//                     })}
//                   </div>
//                 </div>
//               </div>
              
//               <div className="profile-info-item">
//                 <div className="profile-info-icon">
//                   <Flame size={16} />
//                 </div>
//                 <div>
//                   <div className="profile-info-label">Current Streak</div>
//                   <div className="profile-info-value">{streakData?.currentStreak || 0} days</div>
//                 </div>
//               </div>
//             </div>
            
//             <div style={{ padding: '2rem', paddingTop: 0 }}>
//               <button 
//                 className="dashboard-button button-secondary"
//                 onClick={() => {
//                   setShowProfileModal(false);
//                   handleProfileEdit();
//                 }}
//                 style={{ width: '100%' }}
//               >
//                 <Edit size={16} />
//                 Edit Profile
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
//               <div className="modal-icon">
//                 <Share2 size={32} />
//               </div>
//               <h2 className="modal-title">Share Your Progress</h2>
//               <p className="modal-subtitle">
//                 Day {streakData?.currentStreak || 0} • {streakData?.totalDays || 0} total days
//               </p>
//             </div>
            
//             <div className="modal-grid">
//               {/* FIXED: All social share buttons now work properly */}
//               <button 
//                 className="modal-button glass"
//                 onClick={() => handleSocialShare('twitter')}
//               >
//                 <div 
//                   className="modal-button-icon"
//                   style={{ background: 'rgba(29, 161, 242, 0.2)', color: '#1DA1F2' }}
//                 >
//                   <Twitter size={24} />
//                 </div>
//                 <div className="modal-button-name">Twitter</div>
//                 <div className="modal-button-description">Share your streak</div>
//               </button>
              
//               <button 
//                 className="modal-button glass"
//                 onClick={() => handleSocialShare('linkedin')}
//               >
//                 <div 
//                   className="modal-button-icon"
//                   style={{ background: 'rgba(0, 119, 181, 0.2)', color: '#0077B5' }}
//                 >
//                   <Linkedin size={24} />
//                 </div>
//                 <div className="modal-button-name">LinkedIn</div>
//                 <div className="modal-button-description">Professional network</div>
//               </button>
              
//               <button 
//                 className="modal-button glass"
//                 onClick={() => handleSocialShare('facebook')}
//               >
//                 <div 
//                   className="modal-button-icon"
//                   style={{ background: 'rgba(24, 119, 242, 0.2)', color: '#1877F2' }}
//                 >
//                   <Facebook size={24} />
//                 </div>
//                 <div className="modal-button-name">Facebook</div>
//                 <div className="modal-button-description">Friends & family</div>
//               </button>
              
//               {/* FIXED: Instagram button now works with instructions */}
//               <button 
//                 className="modal-button glass"
//                 onClick={() => handleSocialShare('instagram')}
//               >
//                 <div 
//                   className="modal-button-icon"
//                   style={{ background: 'rgba(225, 48, 108, 0.2)', color: '#E1306C' }}
//                 >
//                   <Instagram size={24} />
//                 </div>
//                 <div className="modal-button-name">Instagram</div>
//                 <div className="modal-button-description">Visual story</div>
//               </button>
              
//               {/* FIXED: WhatsApp button now works properly */}
//               <button 
//                 className="modal-button glass whatsapp-button"
//                 onClick={() => handleSocialShare('whatsapp')}
//               >
//                 <div 
//                   className="modal-button-icon"
//                   style={{ background: 'rgba(37, 211, 102, 0.2)', color: '#25D366' }}
//                 >
//                   <MessageSquare size={24} />
//                 </div>
//                 <div className="modal-button-name">WhatsApp</div>
//                 <div className="modal-button-description">Direct message</div>
//               </button>
              
//               {/* FIXED: Copy Link button */}
//               <button 
//                 className="modal-button glass copy-link-button"
//                 onClick={copyProfileLink}
//               >
//                 <div 
//                   className="modal-button-icon"
//                   style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6' }}
//                 >
//                   <Copy size={24} />
//                 </div>
//                 <div className="modal-button-name">Copy Link</div>
//                 <div className="modal-button-description">Share anywhere</div>
//               </button>
//             </div>
            
//             <div className="modal-tip">
//               <div className="modal-tip-title">
//                 <div className="modal-tip-icon">💡</div>
//                 Pro Tip
//               </div>
//               <p className="modal-tip-text">
//                 Sharing your progress increases accountability and helps build a supportive community. 
//                 Plus, you earn extra XP for every share!
//               </p>
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
//               <div className="modal-icon">
//                 <Edit size={32} />
//               </div>
//               <h2 className="modal-title">Edit Profile</h2>
//               <p className="modal-subtitle">Update your personal information</p>
//             </div>
            
//             <div className="profile-info">
//               <div className="form-group">
//                 <label className="form-label">Display Name</label>
//                 <input
//                   type="text"
//                   className="form-input"
//                   value={profileEdit.displayName}
//                   onChange={(e) => setProfileEdit({...profileEdit, displayName: e.target.value})}
//                   placeholder="Enter your display name"
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label className="form-label">Bio</label>
//                 <textarea
//                   className="form-input"
//                   value={profileEdit.bio}
//                   onChange={(e) => setProfileEdit({...profileEdit, bio: e.target.value})}
//                   placeholder="Tell us about yourself"
//                   rows="3"
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label className="form-label">City</label>
//                 <input
//                   type="text"
//                   className="form-input"
//                   value={profileEdit.city}
//                   onChange={(e) => setProfileEdit({...profileEdit, city: e.target.value})}
//                   placeholder="Enter your city"
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label className="form-label">Country</label>
//                 <input
//                   type="text"
//                   className="form-input"
//                   value={profileEdit.country}
//                   onChange={(e) => setProfileEdit({...profileEdit, country: e.target.value})}
//                   placeholder="Enter your country"
//                 />
//               </div>
//             </div>
            
//             <div className="form-actions">
//               <button 
//                 className="dashboard-button button-secondary"
//                 onClick={() => setProfileEdit({ displayName: '', bio: '', city: '', country: '' })}
//                 style={{ flex: 1 }}
//               >
//                 Cancel
//               </button>
//               <button 
//                 className="dashboard-button button-primary"
//                 onClick={saveProfileEdits}
//                 style={{ flex: 1 }}
//               >
//                 Save Changes
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect, useCallback } from 'react';
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
  Award,
  Activity,
  Home,
  LogOut,
  Sparkles,
  Target as TargetIcon2,
  MessageSquare,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Zap,
  ArrowRight,
  ExternalLink,
  User,
  Edit,
  Mail,
  Copy,
  MessageCircle,
  PlusCircle,
  ChevronRight,
  X
} from 'lucide-react';

const Dashboard = ({ onNavigate }) => {
  // Authentication & User State
  const [showAchievement, setShowAchievement] = useState(false);
  const [showSocialShareModal, setShowSocialShareModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
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

  // Helper function to extract name from email
  const extractNameFromEmail = useCallback((email) => {
    if (!email) return 'User';
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }, []);

  // Navigation function - UPDATED TO WORK WITH URL NAVIGATION
  const navigateTo = useCallback((page) => {
    console.log('Navigating to:', page);
    
    if (onNavigate && typeof onNavigate === 'function') {
      onNavigate(page);
    } else {
      // Use direct URL navigation instead of custom events
      switch(page) {
        case 'verify':
          window.location.href = '/verify';
          break;
        case 'leaderboard':
          window.location.href = '/leaderboard';
          break;
        case 'social':
          window.location.href = '/social';
          break;
        case 'profile':
          window.location.href = '/profile';
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
        case 'stats':
          window.location.href = '/stats';
          break;
        case 'achievements':
          window.location.href = '/achievements';
          break;
        case 'dashboard':
          window.location.href = '/dashboard';
          break;
        case 'activity':
          window.location.href = '/activity';
          break;
        default:
          console.log('Navigating to:', page);
      }
    }
  }, [onNavigate]);

  // ========== HELPER FUNCTIONS ==========

  // Load user data
  const loadUserData = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('touchgrass_user');
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log('Loaded user from localStorage:', user);
        
        if (user.email && (!user.displayName || user.displayName.includes('@'))) {
          user.displayName = extractNameFromEmail(user.email);
          localStorage.setItem('touchgrass_user', JSON.stringify(user));
        }
        
        return user;
      }
      
      const authState = localStorage.getItem('authState');
      if (authState) {
        const auth = JSON.parse(authState);
        if (auth.isAuthenticated && auth.user) {
          const displayName = auth.user.displayName || 
                             extractNameFromEmail(auth.user.email) || 
                             auth.user.username;
          
          const newUser = {
            id: auth.user.id || Date.now().toString(),
            username: auth.user.username,
            displayName: displayName,
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
      
      const supabaseSession = localStorage.getItem('sb-lkrwoidwisbwktndxoca-auth-token');
      if (supabaseSession) {
        try {
          const session = JSON.parse(supabaseSession);
          if (session.user) {
            const displayName = extractNameFromEmail(session.user.email);
            const username = session.user.email?.split('@')[0] || 'user';
            
            const newUser = {
              id: session.user.id || Date.now().toString(),
              username: username,
              displayName: displayName,
              email: session.user.email || `${username}@example.com`,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
              location: { city: 'Online', country: 'Internet' },
              bio: 'Building daily discipline through outdoor accountability.',
              createdAt: new Date().toISOString(),
              lastActive: new Date().toISOString()
            };
            
            console.log('Created user from Supabase:', newUser);
            localStorage.setItem('touchgrass_user', JSON.stringify(newUser));
            return newUser;
          }
        } catch (error) {
          console.error('Error parsing Supabase session:', error);
        }
      }
      
      const googleAuthData = localStorage.getItem('googleAuthData');
      if (googleAuthData) {
        try {
          const authData = JSON.parse(googleAuthData);
          if (authData.isAuthenticated && authData.user) {
            const displayName = extractNameFromEmail(authData.user.email);
            const username = authData.user.email?.split('@')[0] || 'googleuser';
            
            const newUser = {
              id: authData.user.id || Date.now().toString(),
              username: username,
              displayName: displayName,
              email: authData.user.email || `${username}@gmail.com`,
              avatar: authData.user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
              location: { city: 'Online', country: 'Internet' },
              bio: 'Building daily discipline through outdoor accountability.',
              createdAt: new Date().toISOString(),
              lastActive: new Date().toISOString(),
              isGoogleAuth: true
            };
            
            console.log('Created user from Google auth:', newUser);
            localStorage.setItem('touchgrass_user', JSON.stringify(newUser));
            return newUser;
          }
        } catch (error) {
          console.error('Error parsing Google auth:', error);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  }, [extractNameFromEmail]);

  // Load streak data
  const loadStreakData = useCallback((username) => {
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
      console.error('Error loading streak data:', error);
      return null;
    }
  }, []);

  // Save streak data
  const saveStreakData = useCallback((username, streakData) => {
    try {
      const streakKey = `touchgrass_streak_${username}`;
      localStorage.setItem(streakKey, JSON.stringify(streakData));
    } catch (error) {
      console.error('Error saving streak data:', error);
    }
  }, []);

  // Check if user verified today
  const checkTodayVerified = useCallback((streakData) => {
    if (!streakData) return false;
    
    if (streakData.todayVerified) return true;
    
    if (!streakData.history) return false;
    
    const today = new Date();
    const todayDate = today.toDateString();
    
    return streakData.history.some(entry => {
      if (!entry.date) return false;
      try {
        const entryDate = new Date(entry.date);
        return entryDate.toDateString() === todayDate && entry.verified === true;
      } catch (e) {
        return false;
      }
    });
  }, []);

  // Format time ago
  const timeAgo = useCallback((timestamp) => {
    if (!timestamp) return 'Just now';
    
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
  }, []);

  // Calculate time left for today's verification
  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const difference = endOfDay - now;
    
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Update user profile
  const updateUserProfile = useCallback((updatedData) => {
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
  }, []);

  // ========== MAIN FUNCTIONS ==========

  // Initialize dashboard data
  const initializeDashboard = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const user = loadUserData();
      
      if (!user) {
        console.log('No user found, showing welcome screen');
        setUserData(null);
        setIsLoading(false);
        return;
      }
      
      setUserData(user);
      
      const streakData = loadStreakData(user.username);
      
      const todayVerified = checkTodayVerified(streakData);
      if (streakData) {
        streakData.todayVerified = todayVerified;
        saveStreakData(user.username, streakData);
      }
      
      const joinDate = new Date(user.createdAt || new Date());
      const now = new Date();
      const daysSinceJoin = Math.max(1, Math.floor((now - joinDate) / (1000 * 60 * 60 * 24)));
      
      const consistency = streakData?.totalDays > 0 
        ? Math.min(100, Math.round((streakData.totalDays / daysSinceJoin) * 100))
        : 0;
      
      const calculatedStats = [
        {
          id: 1,
          title: "Current Streak",
          value: streakData?.currentStreak || 0,
          change: streakData?.todayVerified ? "+1" : "0",
          description: "Consecutive verified days",
          icon: <Flame size={24} />
        },
        {
          id: 2,
          title: "Total Time Outside",
          value: `${Math.floor((streakData?.totalOutdoorTime || 0) / 60)}h`,
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
          title: "Challenge Wins",
          value: streakData?.challengeWins || 0,
          change: "+5",
          description: "Challenges completed",
          icon: <Trophy size={24} />
        },
        {
          id: 5,
          title: "Social Score",
          value: streakData?.viralScore || 0,
          change: "+24",
          description: "Impact on community",
          icon: <TrendingUp size={24} />
        },
        {
          id: 6,
          title: "Global Rank",
          value: `#${Math.floor(Math.random() * 1000) + 1}`,
          change: (streakData?.currentStreak || 0) > 0 ? "↑12" : "0",
          description: "Out of 50k users",
          icon: <Users size={24} />
        }
      ];

      const recentActivities = [];
      
      if (streakData?.todayVerified) {
        recentActivities.push({
          id: 1,
          action: "✅ Verified today's outdoor time",
          time: 'Just now',
          icon: <CheckCircle2 size={20} />,
          meta: 'Verified Today'
        });
      }
      
      if (streakData?.history && streakData.history.length > 0) {
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
      
      if (streakData?.shareCount > 0) {
        recentActivities.push({
          id: recentActivities.length + 1,
          action: 'Shared achievement on social media',
          time: '4 hours ago',
          icon: <Share2 size={20} />,
          meta: `+${streakData.shareCount} shares`
        });
      }

      const socialPlatforms = [];
      if (streakData?.shareCount > 0) {
        socialPlatforms.push(
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
        );
      }

      const userChallenges = [];
      if (streakData?.currentStreak >= 7) {
        userChallenges.push({
          id: 1,
          name: "7-Day Sprint",
          progress: Math.min(100, Math.round((streakData.currentStreak / 7) * 100)),
          current: streakData.currentStreak,
          total: 7,
          icon: "🔥"
        });
      }
      if (streakData?.totalDays >= 30) {
        userChallenges.push({
          id: 2,
          name: "Monthly Warrior",
          progress: Math.min(100, Math.round((streakData.totalDays / 30) * 100)),
          current: streakData.totalDays,
          total: 30,
          icon: "🏆"
        });
      }
      if (streakData?.shareCount >= 10) {
        userChallenges.push({
          id: 3,
          name: "Social Butterfly",
          progress: Math.min(100, Math.round((streakData.shareCount / 10) * 100)),
          current: streakData.shareCount,
          total: 10,
          icon: "🦋"
        });
      }

      const userAchievements = [];
      if (streakData?.currentStreak >= 7) {
        userAchievements.push({
          id: 1,
          name: "Weekly Warrior",
          icon: "🔥",
          earned: "Today",
          description: "7 consecutive days"
        });
      }
      if (streakData?.shareCount >= 10) {
        userAchievements.push({
          id: 2,
          name: "Social Butterfly",
          icon: "🦋",
          earned: "2 days ago",
          description: "shared their streaks"
        });
      }
      if (streakData?.totalDays >= 30) {
        userAchievements.push({
          id: 3,
          name: "Monthly Master",
          icon: "🌟",
          earned: "This month",
          description: "30-day streak"
        });
      }
      if (streakData?.totalDays >= 100) {
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
      setChallenges(userChallenges);
      setAchievements(userAchievements);
      
      console.log('Dashboard initialized with user:', user);
      
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [loadUserData, loadStreakData, checkTodayVerified, saveStreakData, timeAgo]);

  // Handle logout
  const handleLogout = useCallback(() => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('touchgrass_user');
      localStorage.removeItem('authState');
      localStorage.removeItem('googleAuthData');
      localStorage.removeItem('sb-auth-state');
      
      sessionStorage.clear();
      
      setUserData(null);
      toast.success('Logged out successfully');
      
      window.dispatchEvent(new CustomEvent('auth-state-changed'));
      
      initializeDashboard();
    }
  }, [initializeDashboard]);

  // Handle verification
  const handleVerify = useCallback(() => {
    if (!userData) {
      toast.error('Please login to verify');
      navigateTo('auth');
      return;
    }
    
    navigateTo('verify');
  }, [userData, navigateTo]);

  // Handle verification completion
  const completeVerification = useCallback((verificationData) => {
    if (!userData) return false;
    
    const streakKey = `touchgrass_streak_${userData.username}`;
    const storedStreak = localStorage.getItem(streakKey);
    
    if (storedStreak) {
      const streak = JSON.parse(storedStreak);
      const today = new Date().toDateString();
      
      const alreadyVerified = streak.history?.some(entry => {
        if (!entry.date) return false;
        try {
          const entryDate = new Date(entry.date);
          return entryDate.toDateString() === today && entry.verified === true;
        } catch (e) {
          return false;
        }
      });
      
      if (!alreadyVerified) {
        const newEntry = {
          date: new Date().toISOString(),
          verified: true,
          duration: verificationData.duration || 30,
          activity: verificationData.activity || 'Outdoor time',
          location: verificationData.location || 'Unknown',
          proof: verificationData.proof || null
        };
        
        const updatedStreak = {
          ...streak,
          currentStreak: streak.currentStreak + 1,
          longestStreak: Math.max(streak.longestStreak, streak.currentStreak + 1),
          totalDays: streak.totalDays + 1,
          totalOutdoorTime: streak.totalOutdoorTime + (verificationData.duration || 30),
          todayVerified: true,
          lastVerification: new Date().toISOString(),
          history: [...(streak.history || []), newEntry]
        };
        
        saveStreakData(userData.username, updatedStreak);
        
        setShowAchievement(true);
        setTimeout(() => setShowAchievement(false), 3000);
        
        toast.success(`🎉 Day ${updatedStreak.currentStreak} verified! Streak +1!`);
        
        initializeDashboard();
        
        return true;
      } else {
        toast.error('You have already verified your streak today!');
        return false;
      }
    }
    return false;
  }, [userData, saveStreakData, initializeDashboard]);

  // Handle social share
  const handleSocialShare = useCallback((platform) => {
    if (!userData) {
      toast.error('Please login to share');
      return;
    }
    
    const streakData = loadStreakData(userData.username);
    
    const updatedStreak = {
      ...streakData,
      shareCount: streakData.shareCount + 1,
      viralScore: streakData.viralScore + Math.floor(Math.random() * 10) + 1
    };
    
    saveStreakData(userData.username, updatedStreak);
    
    const baseUrl = window.location.origin;
    const profileUrl = `${baseUrl}/profile/${userData.username}`;
    
    const shareTexts = {
      twitter: `🔥 Day ${streakData.currentStreak} of my #TouchGrass streak! Building discipline one day at a time. Join me: ${profileUrl} #Accountability #Streak #MentalHealth`,
      linkedin: `${userData.displayName} has maintained a ${streakData.currentStreak}-day outdoor streak on TouchGrass\n\nBuilding professional discipline through daily habits. Check it out: ${profileUrl}\n\n#ProfessionalGrowth #Wellness #Discipline`,
      facebook: `I've touched grass for ${streakData.currentStreak} days in a row! Join me in building better habits: ${profileUrl}`,
      instagram: `Day ${streakData.currentStreak} of my #TouchGrass journey 🌱\n\nBuilding real-world discipline one day at a time.\n\nJoin me: ${profileUrl}\n\n#Streak #Accountability #MentalHealth #Outdoor`,
      whatsapp: `Check out my ${streakData.currentStreak}-day TouchGrass streak! ${profileUrl}`
    };

    const shareConfigs = {
      twitter: {
        url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTexts.twitter)}&url=${encodeURIComponent(profileUrl)}`,
        name: 'Twitter'
      },
      linkedin: {
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
        name: 'LinkedIn'
      },
      facebook: {
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
        name: 'Facebook'
      },
      whatsapp: {
        url: `https://wa.me/?text=${encodeURIComponent(shareTexts.whatsapp)}`,
        name: 'WhatsApp'
      },
      instagram: {
        url: `https://www.instagram.com/`,
        name: 'Instagram'
      }
    };

    const config = shareConfigs[platform];
    if (!config) return;

    if (platform === 'instagram') {
      toast('📸 For Instagram: Take a screenshot and share it in your stories!\n\nYou can also use the link below:', {
        icon: '📸',
        duration: 5000
      });
      
      setTimeout(() => {
        navigator.clipboard.writeText(profileUrl);
        toast.success('Profile link copied to clipboard! Paste it in your Instagram bio or story.');
      }, 1000);
      return;
    }

    window.open(config.url, '_blank', 'width=600,height=400');
    toast.success(`Shared to ${config.name}! Social score +${updatedStreak.viralScore - streakData.viralScore}`, {
      icon: '🚀'
    });
    
    initializeDashboard();
  }, [userData, loadStreakData, saveStreakData, initializeDashboard]);

  // Copy profile link
  const copyProfileLink = useCallback(() => {
    if (!userData) {
      toast.error('Please login to copy link');
      return;
    }
    
    const baseUrl = window.location.origin;
    const profileUrl = `${baseUrl}/profile/${userData.username}`;
    
    navigator.clipboard.writeText(profileUrl)
      .then(() => {
        toast.success('Profile link copied to clipboard!', {
          icon: '📋'
        });
        
        const streakData = loadStreakData(userData.username);
        const updatedStreak = {
          ...streakData,
          shareCount: streakData.shareCount + 1,
          viralScore: streakData.viralScore + 1
        };
        
        saveStreakData(userData.username, updatedStreak);
        initializeDashboard();
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy link');
      });
  }, [userData, loadStreakData, saveStreakData, initializeDashboard]);

  // Handle profile edit
  const handleProfileEdit = useCallback(() => {
    if (!userData) return;
    
    setProfileEdit({
      displayName: userData.displayName || '',
      bio: userData.bio || '',
      city: userData.location?.city || '',
      country: userData.location?.country || ''
    });
  }, [userData]);

  // Quick actions
  const quickActions = [
    {
      id: 1,
      label: "Verify",
      icon: <Camera size={24} />,
      action: handleVerify
    },
    {
      id: 2,
      label: "Challenges",
      icon: <Target size={24} />,
      action: () => navigateTo('challenges')
    },
    {
      id: 3,
      label: "Share",
      icon: <Share2 size={24} />,
      action: () => setShowSocialShareModal(true)
    },
    {
      id: 4,
      label: "Chat",
      icon: <MessageCircle size={24} />,
      action: () => navigateTo('chat')
    }
  ];

  // ========== EFFECTS ==========

  // Initialize dashboard on mount
  useEffect(() => {
    initializeDashboard();
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [initializeDashboard, calculateTimeLeft]);

  // Listen for verification completion
  useEffect(() => {
    const handleVerificationComplete = (event) => {
      if (event.detail && event.detail.type === 'verification-complete') {
        const success = completeVerification(event.detail.data);
        if (success) {
          setTimeout(() => navigateTo('dashboard'), 1000);
        }
      }
    };
    
    window.addEventListener('verification-complete', handleVerificationComplete);
    
    return () => {
      window.removeEventListener('verification-complete', handleVerificationComplete);
    };
  }, [completeVerification, navigateTo]);

  // Listen for auth state changes
  useEffect(() => {
    const handleAuthChange = () => {
      console.log('Auth state changed, refreshing dashboard...');
      initializeDashboard();
    };
    
    window.addEventListener('auth-state-changed', handleAuthChange);
    
    const handleStorageChange = (e) => {
      if (e.key === 'touchgrass_user' || e.key === 'sb-auth-state' || e.key === 'googleAuthData') {
        initializeDashboard();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('auth-state-changed', handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [initializeDashboard]);

  // ========== CSS STYLES ==========
  const styles = `
    .dashboard-page {
      width: 100%;
      overflow-x: hidden;
      background: #050505;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
      position: relative;
      min-height: 100vh;
    }

    /* Background Effects */
    .dashboard-bg-grid {
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

    .dashboard-floating-elements {
      position: fixed;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    .dashboard-floating-element {
      position: absolute;
      border-radius: 50%;
      filter: blur(40px);
      opacity: 0.1;
      animation: float 20s infinite linear;
    }

    .dashboard-float-1 {
      width: 400px;
      height: 400px;
      background: linear-gradient(135deg, #22c55e, #3b82f6);
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .dashboard-float-2 {
      width: 300px;
      height: 300px;
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      top: 60%;
      right: 15%;
      animation-delay: -5s;
    }

    .dashboard-float-3 {
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

    /* Dashboard Navigation */
    .dashboard-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 50;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(15, 23, 42, 0.95);
    }

    .dashboard-nav-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .dashboard-nav-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .dashboard-nav-logo-text {
      font-size: 1.5rem;
      font-weight: 900;
      letter-spacing: -0.025em;
      text-transform: uppercase;
      font-style: italic;
    }

    .dashboard-nav-logo-highlight {
      color: #00E5FF;
    }

    .dashboard-nav-links {
      display: none;
    }

    @media (min-width: 768px) {
      .dashboard-nav-links {
        display: flex;
        align-items: center;
        gap: 2rem;
      }
    }

    .dashboard-nav-link {
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

    .dashboard-nav-link:hover {
      color: white;
    }

    .dashboard-nav-button {
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

    .dashboard-nav-button:hover {
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(0, 229, 255, 0.4);
    }

    .dashboard-nav-button:active {
      transform: scale(0.95);
    }

    /* User Profile Button */
    .user-profile-button {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      transition: all 0.2s;
    }

    .user-profile-button:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    .user-avatar {
      width: 2rem;
      height: 2rem;
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
      font-size: 0.75rem;
      font-weight: 700;
    }

    .user-status {
      font-size: 0.625rem;
      color: #22c55e;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    /* Dashboard Header */
    .dashboard-header {
      padding-top: 8rem;
      padding-bottom: 4rem;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      text-align: center;
      position: relative;
      z-index: 2;
    }

    @media (min-width: 768px) {
      .dashboard-header {
        text-align: left;
      }
    }

    .dashboard-header-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-welcome {
      font-size: 4rem;
      font-weight: 900;
      letter-spacing: -0.025em;
      line-height: 1;
      margin-bottom: 1.5rem;
      text-transform: uppercase;
      font-style: italic;
    }

    .dashboard-subtitle {
      font-size: 1.25rem;
      color: #a1a1aa;
      max-width: 600px;
      line-height: 1.75;
      font-weight: 300;
    }

    /* Main Grid */
    .dashboard-grid {
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
      .dashboard-grid {
        grid-template-columns: 2fr 1fr;
      }
    }

    /* Main Content */
    .dashboard-main-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    /* Streak Spotlight */
    .streak-spotlight {
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
      .streak-spotlight {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .streak-visual {
      position: relative;
      text-align: center;
    }

    .streak-circle {
      width: 160px;
      height: 160px;
      border-radius: 50%;
      border: 4px solid rgba(0, 229, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }

    .streak-number {
      font-size: 5rem;
      font-weight: 900;
      background: linear-gradient(135deg, #00E5FF 0%, #7F00FF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .streak-info {
      flex: 1;
      text-align: center;
    }

    @media (min-width: 768px) {
      .streak-info {
        text-align: left;
      }
    }

    .streak-title {
      font-size: 2rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.025em;
      margin-bottom: 1rem;
    }

    .streak-description {
      color: #71717a;
      font-size: 1rem;
      font-weight: 300;
      line-height: 1.75;
      margin-bottom: 2rem;
      max-width: 400px;
    }

    .streak-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    @media (min-width: 768px) {
      .streak-actions {
        flex-direction: row;
      }
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
    }

    .dashboard-button:hover:not(:disabled) {
      transform: scale(1.05);
    }

    .dashboard-button:active:not(:disabled) {
      transform: scale(0.95);
    }

    .dashboard-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .button-primary {
      background: #00E5FF;
      color: black;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .button-primary:hover:not(:disabled) {
      background: rgba(0, 229, 255, 0.9);
    }

    .button-secondary {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
    }

    .button-secondary:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.15);
    }

    .verified-button {
      background: rgba(34, 197, 94, 0.2);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #22c55e;
    }

    .verified-button:hover {
      background: rgba(34, 197, 94, 0.3);
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

    /* Challenges */
    .challenge-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 2rem;
      border-radius: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.01);
      transition: all 0.3s;
    }

    .challenge-card:hover {
      background: rgba(255, 255, 255, 0.03);
      transform: translateY(-5px);
    }

    .challenge-icon {
      font-size: 2.5rem;
    }

    .challenge-content {
      flex: 1;
    }

    .challenge-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .challenge-name {
      font-weight: 700;
      font-size: 1.125rem;
    }

    .challenge-progress {
      color: #00E5FF;
      font-weight: 900;
      font-size: 1.25rem;
    }

    .progress-bar {
      height: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 9999px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #00E5FF, #7F00FF);
      border-radius: 9999px;
      position: relative;
      overflow: hidden;
    }

    .progress-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      animation: progressShine 2s infinite;
    }

    @keyframes progressShine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .challenge-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #71717a;
    }

    /* Sidebar */
    .dashboard-sidebar {
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
      position: relative;
    }

    .quick-action-button:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.03);
      transform: scale(1.05);
      border-color: rgba(0, 229, 255, 0.2);
    }

    .quick-action-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
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

    /* Profile Modal */
    .profile-modal {
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

    .profile-content {
      width: 100%;
      max-width: 500px;
      border-radius: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(15, 23, 42, 0.95);
      position: relative;
      overflow: hidden;
    }

    .profile-header {
      padding: 2rem;
      text-align: center;
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(127, 0, 255, 0.1));
    }

    .profile-avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #00E5FF;
      margin: 0 auto 1rem;
    }

    .profile-name {
      font-size: 2rem;
      font-weight: 900;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .profile-bio {
      color: #a1a1aa;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .profile-info {
      padding: 2rem;
    }

    .profile-info-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .profile-info-icon {
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      background: rgba(0, 229, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #00E5FF;
    }

    .profile-info-label {
      font-size: 0.75rem;
      color: #71717a;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 0.25rem;
    }

    .profile-info-value {
      font-size: 0.875rem;
      font-weight: 600;
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

    .modal-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .modal-icon {
      width: 5rem;
      height: 5rem;
      border-radius: 1.5rem;
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      font-size: 2.5rem;
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

    .modal-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }

    @media (min-width: 768px) {
      .modal-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .modal-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      border-radius: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: white;
      cursor: pointer;
      transition: all 0.3s;
      text-align: center;
    }

    .modal-button:hover {
      transform: scale(1.05);
    }

    .modal-button-icon {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .modal-button-name {
      font-weight: 700;
      font-size: 0.875rem;
    }

    .modal-button-description {
      font-size: 0.75rem;
      color: #a1a1aa;
    }

    .modal-tip {
      padding: 1.5rem;
      border-radius: 1.5rem;
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(127, 0, 255, 0.1));
      border: 1px solid rgba(0, 229, 255, 0.2);
      text-align: center;
    }

    .modal-tip-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      font-weight: 700;
    }

    .modal-tip-icon {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 0.5rem;
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
    }

    .modal-tip-text {
      font-size: 0.875rem;
      color: #d4d4d8;
      line-height: 1.5;
    }

    /* Time Counter */
    .time-counter {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.25rem;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
    }

    .time-label {
      font-size: 0.625rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #71717a;
    }

    .time-value {
      font-family: monospace;
      font-size: 0.875rem;
      font-weight: 700;
      color: #00E5FF;
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

    /* Form Inputs */
    .form-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 0.75rem;
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

    .form-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #71717a;
      margin-bottom: 0.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    /* WhatsApp Button Style */
    .whatsapp-button {
      background: rgba(37, 211, 102, 0.2);
      border-color: rgba(37, 211, 102, 0.3);
    }

    .whatsapp-button:hover {
      background: rgba(37, 211, 102, 0.3);
    }

    /* Copy Link Button */
    .copy-link-button {
      background: rgba(139, 92, 246, 0.2);
      border-color: rgba(139, 92, 246, 0.3);
    }

    .copy-link-button:hover {
      background: rgba(139, 92, 246, 0.3);
    }

    /* Verification Button Animation */
    .verification-pulse {
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.4);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(0, 229, 255, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(0, 229, 255, 0);
      }
    }

    /* Verification Checkmark */
    .verified-checkmark {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #22c55e;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      border: 2px solid #050505;
    }

    /* Flex utility classes */
    .flex {
      display: flex;
    }

    .items-center {
      align-items: center;
    }

    .gap-4 {
      gap: 1rem;
    }

    .gap-2 {
      gap: 0.5rem;
    }

    .gap-1 {
      gap: 0.25rem;
    }

    .w-2 {
      width: 0.5rem;
    }

    .h-2 {
      height: 0.5rem;
    }

    .rounded-full {
      border-radius: 9999px;
    }

    .bg-green-500 {
      background-color: #22c55e;
    }

    .text-green-500 {
      color: #22c55e;
    }

    .text-yellow-500 {
      color: #f59e0b;
    }

    /* Fixed positioning */
    .fixed {
      position: fixed;
    }

    .bottom-8 {
      bottom: 2rem;
    }

    .right-8 {
      right: 2rem;
    }

    .z-50 {
      z-index: 50;
    }

    /* Padding and margin */
    .p-6 {
      padding: 1.5rem;
    }

    .rounded-2xl {
      border-radius: 1rem;
    }

    .border {
      border-width: 1px;
    }

    .border-yellow-500\\/20 {
      border-color: rgba(245, 158, 11, 0.2);
    }

    .bg-gradient-to-r {
      background-image: linear-gradient(to right, var(--tw-gradient-stops));
    }

    .from-yellow-500\\/10 {
      --tw-gradient-from: rgba(245, 158, 11, 0.1);
      --tw-gradient-to: rgba(245, 158, 11, 0);
      --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
    }

    .to-amber-500\\/10 {
      --tw-gradient-to: rgba(251, 191, 36, 0.1);
    }

    /* Achievement toast animation */
    @keyframes slideInUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .dashboard-welcome {
        font-size: 2.5rem;
      }
      
      .dashboard-subtitle {
        font-size: 1rem;
      }
      
      .streak-spotlight {
        padding: 2rem;
      }
      
      .streak-circle {
        width: 120px;
        height: 120px;
      }
      
      .streak-number {
        font-size: 3.5rem;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .stat-card {
        padding: 1.5rem;
      }
      
      .activity-section, .quick-actions-section, .performance-section {
        padding: 1.5rem;
      }
      
      .modal-content {
        padding: 1.5rem;
      }
      
      .modal-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Scrollbar styling */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb {
      background: rgba(0, 229, 255, 0.3);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 229, 255, 0.5);
    }
  `;

  // ========== RENDER LOGIC ==========

  if (isLoading && !userData) {
    return (
      <div className="dashboard-page">
        <style>{styles}</style>
        
        <div className="dashboard-bg-grid"></div>
        <div className="dashboard-floating-elements">
          <div className="dashboard-floating-element dashboard-float-1"></div>
          <div className="dashboard-floating-element dashboard-float-2"></div>
          <div className="dashboard-floating-element dashboard-float-3"></div>
        </div>

        <nav className="dashboard-nav glass">
          <div className="dashboard-nav-container">
            <div className="dashboard-nav-logo">
              <div className="dashboard-nav-logo-text">
                Touch<span className="dashboard-nav-logo-highlight">Grass</span>
              </div>
            </div>
            
            <div className="dashboard-nav-button loading-skeleton" style={{ width: '120px', height: '40px' }}></div>
          </div>
        </nav>

        <div className="dashboard-header">
          <div className="dashboard-header-container">
            <div className="loading-skeleton" style={{ height: '80px', width: '400px', marginBottom: '1.5rem', margin: '0 auto' }}></div>
            <div className="loading-skeleton" style={{ height: '30px', width: '600px', margin: '0 auto' }}></div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-main-content">
            <div className="loading-skeleton" style={{ height: '300px', borderRadius: '3rem' }}></div>
            <div className="loading-skeleton" style={{ height: '400px', borderRadius: '3rem' }}></div>
          </div>
          <div className="dashboard-sidebar">
            <div className="loading-skeleton" style={{ height: '300px', borderRadius: '3rem' }}></div>
            <div className="loading-skeleton" style={{ height: '300px', borderRadius: '3rem' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const streakData = userData ? loadStreakData(userData.username) : null;
  const isTodayVerified = userData ? checkTodayVerified(streakData) : false;

  return (
    <div className="dashboard-page">
      <style>{styles}</style>
      
      {/* Background Effects */}
      <div className="dashboard-bg-grid"></div>
      <div className="dashboard-floating-elements">
        <div className="dashboard-floating-element dashboard-float-1"></div>
        <div className="dashboard-floating-element dashboard-float-2"></div>
        <div className="dashboard-floating-element dashboard-float-3"></div>
      </div>

      {/* Navigation */}
      <nav className="dashboard-nav glass">
        <div className="dashboard-nav-container">
          <div className="dashboard-nav-logo">
            <div className="dashboard-nav-logo-text">
              Touch<span className="dashboard-nav-logo-highlight">Grass</span>
            </div>
          </div>
          
          <div className="dashboard-nav-links">
            <button className="dashboard-nav-link" onClick={() => navigateTo('challenges')}>
              Challenges
            </button>
            <button className="dashboard-nav-link" onClick={() => navigateTo('chat')}>
              Chat
            </button>
            <button className="dashboard-nav-link" onClick={() => navigateTo('profile')}>
              Profile
            </button>
            <button className="dashboard-nav-link" onClick={() => navigateTo('leaderboard')}>
              Leaderboard
            </button>
            {userData && (
              <button className="dashboard-nav-link" onClick={handleLogout}>
                <LogOut size={0} />
                
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="time-counter">
              <Clock size={16} />
              <span className="time-label">Time Left</span>
              <span className="time-value">{timeLeft || '23:59:59'}</span>
            </div>
            
            {userData ? (
              <button 
                className="user-profile-button"
                onClick={() => setShowProfileModal(true)} 
              >
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
              </button>
            ) : (
              <button 
                className="dashboard-nav-button"
                onClick={() => navigateTo('auth')}
              >
                <User size={16} />
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-container">
          <h1 className="dashboard-welcome text-gradient">
            {userData ? `Welcome, ${userData.displayName}!` : 'Welcome to TouchGrass'}
          </h1>
          <p className="dashboard-subtitle">
            {userData ? 
              `Your outdoor discipline is growing stronger every day. ${
                streakData?.currentStreak > 0 
                  ? `You're on a ${streakData.currentStreak}-day streak!`
                  : 'Start your streak today!'
              }` 
              : 'Join thousands building discipline through daily outdoor accountability.'}
          </p>
        </div>
      </header>

      {/* Main Grid */}
      <main className="dashboard-grid">
        {/* Left Column - Main Content */}
        <div className="dashboard-main-content">
          {/* Streak Spotlight */}
          <section className="streak-spotlight glass">
            <div className="streak-visual">
              <div className="streak-circle">
                <div className="streak-number">{userData ? (streakData?.currentStreak || 0) : '0'}</div>
              </div>
              <div className="streak-label" style={{ marginTop: '1rem', color: '#71717a' }}>
                Day Streak
              </div>
            </div>
            
            <div className="streak-info">
              <h2 className="streak-title">
                {userData ? 
                  (streakData?.currentStreak > 0 ? `Keep The Fire Burning 🔥` : `Start Your Journey 🚀`) 
                  : 'Begin Your Journey 🚀'}
              </h2>
              <p className="streak-description">
                {userData ?
                  (streakData?.currentStreak > 0
                    ? isTodayVerified
                      ? `✅ Verified Today! You're on track to beat your longest streak of ${streakData.longestStreak} days.`
                      : `You're on a ${streakData.currentStreak}-day streak! Verify today to continue building discipline.`
                    : 'Begin your discipline journey today! Verify your first day to start your streak and unlock achievements.')
                  : 'Join the community and start building daily discipline through outdoor accountability. Login to begin!'}
              </p>
              
              <div className="streak-actions">
                {userData ? (
                  <>
                    <button 
                      className={`dashboard-button ${isTodayVerified ? 'verified-button' : 'button-primary'} ${!isTodayVerified ? 'verification-pulse' : ''}`}
                      onClick={handleVerify}
                      disabled={isTodayVerified}
                    >
                      <Camera size={20} />
                      {isTodayVerified ? (
                        <>
                          <CheckCircle2 size={20} />
                          Verified Today
                        </>
                      ) : (
                        <>
                          Verify Now
                          <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                    
                    <button 
                      className="dashboard-button button-secondary" 
                      onClick={() => setShowSocialShareModal(true)}
                      disabled={!streakData || streakData.currentStreak === 0}
                    >
                      <Share2 size={20} />
                      Share Streak
                    </button>
                  </>
                ) : (
                  <button 
                    className="dashboard-button button-primary" 
                    onClick={() => navigateTo('auth')}
                  >
                    <User size={20} />
                    Get Started
                    <ArrowRight size={20} />
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Stats Grid - Only shows when user is logged in */}
          {userData && (
            <>
              <section>
                <div className="section-header">
                  <h2 className="section-title">
                    <Activity size={24} />
                    Your Stats
                  </h2>
                  <button className="view-all-button" onClick={() => navigateTo('stats')}>
                    View All
                  </button>
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

              {/* Active Challenges */}
              <section className="activity-section glass">
                <div className="section-header">
                  <h2 className="section-title">
                    <TargetIcon2 size={24} />
                    Active Challenges
                  </h2>
                  <button className="view-all-button" onClick={() => navigateTo('challenges')}>
                    View All
                  </button>
                </div>
                
                <div className="activity-list">
                  {challenges.length > 0 ? (
                    challenges.map(challenge => (
                      <div key={challenge.id} className="challenge-card glass">
                        <div className="challenge-icon">{challenge.icon}</div>
                        
                        <div className="challenge-content">
                          <div className="challenge-header">
                            <div className="challenge-name">{challenge.name}</div>
                            <div className="challenge-progress">{challenge.progress}%</div>
                          </div>
                          
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${challenge.progress}%` }}
                            ></div>
                          </div>
                          
                          <div className="challenge-meta">
                            <span>{challenge.current}/{challenge.total} days</span>
                            <span>{challenge.progress}% complete</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">🎯</div>
                      <div className="empty-title">No Active Challenges</div>
                      <p className="empty-description">Join challenges to earn rewards and compete with friends.</p>
                      <button 
                        className="dashboard-button button-secondary"
                        onClick={() => navigateTo('challenges')}
                      >
                        <Target size={20} />
                        Browse Challenges
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* Recent Activity */}
              <section className="activity-section glass">
                <div className="section-header">
                  <h2 className="section-title">
                    <Clock size={24} />
                    Recent Activity
                  </h2>
                  <button className="view-all-button" onClick={() => navigateTo('activity')}>
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

          {/* Show welcome content for logged out users */}
          {!userData && (
            <section className="activity-section glass">
              <div className="section-header">
                <h2 className="section-title">
                  <Sparkles size={24} />
                  Why Join TouchGrass?
                </h2>
              </div>
              
              <div className="activity-list">
                {[
                  {
                    id: 1,
                    action: "Build Daily Discipline",
                    time: "Proven method",
                    icon: <Target size={20} />,
                    meta: "Track progress"
                  },
                  {
                    id: 2,
                    action: "Join a Supportive Community",
                    time: "50k+ members",
                    icon: <Users size={20} />,
                    meta: "Share achievements"
                  },
                  {
                    id: 3,
                    action: "Improve Mental Health",
                    time: "Science-backed",
                    icon: <Sparkles size={20} />,
                    meta: "Outdoor benefits"
                  },
                  {
                    id: 4,
                    action: "Earn Rewards & Achievements",
                    time: "Fun challenges",
                    icon: <Trophy size={20} />,
                    meta: "Unlock badges"
                  }
                ].map(item => (
                  <div key={item.id} className="activity-item glass">
                    <div className="activity-icon">
                      {item.icon}
                    </div>
                    
                    <div className="activity-content">
                      <div className="activity-action">{item.action}</div>
                      <div className="activity-time">{item.time}</div>
                    </div>
                    
                    <div className="activity-meta">
                      {item.meta}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="dashboard-sidebar">
          {/* Quick Actions */}
          <section className="quick-actions-section glass">
            <div className="section-header">
              <h2 className="section-title">
                <Zap size={24} />
                Quick Actions
              </h2>
            </div>
            
            <div className="quick-actions-grid">
              {userData ? (
                quickActions.map(action => (
                  <button
                    key={action.id}
                    className="quick-action-button glass"
                    onClick={action.action}
                    disabled={action.id === 1 && isTodayVerified}
                  >
                    <div className="quick-action-icon">
                      {action.icon}
                    </div>
                    <span className="quick-action-label">{action.label}</span>
                    {action.id === 1 && isTodayVerified && (
                      <div className="verified-checkmark">
                        <CheckCircle2 size={12} />
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <>
                  <button
                    className="quick-action-button glass"
                    onClick={() => navigateTo('auth')}
                  >
                    <div className="quick-action-icon">
                      <User size={24} />
                    </div>
                    <span className="quick-action-label">Login</span>
                  </button>
                  <button
                    className="quick-action-button glass"
                    onClick={() => navigateTo('auth?mode=signup')}
                  >
                    <div className="quick-action-icon">
                      <PlusCircle size={24} />
                    </div>
                    <span className="quick-action-label">Sign Up</span>
                  </button>
                  <button
                    className="quick-action-button glass"
                    onClick={() => navigateTo('challenges')}
                  >
                    <div className="quick-action-icon">
                      <Target size={24} />
                    </div>
                    <span className="quick-action-label">Challenges</span>
                  </button>
                  <button
                    className="quick-action-button glass"
                    onClick={() => navigateTo('chat')}
                  >
                    <div className="quick-action-icon">
                      <MessageCircle size={24} />
                    </div>
                    <span className="quick-action-label">Chat</span>
                  </button>
                </>
              )}
            </div>
          </section>

          {/* Achievements - Only shows when user is logged in */}
          {userData && (
            <section className="performance-section glass">
              <div className="section-header">
                <h2 className="section-title">
                  <Award size={24} />
                  Achievements
                </h2>
                <button className="view-all-button" onClick={() => navigateTo('achievements')}>
                  View All
                </button>
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

          {/* Social Stats - Only shows when user is logged in */}
          {userData && (
            <section className="activity-section glass">
              <div className="section-header">
                <h2 className="section-title">
                  <Share2 size={24} />
                  Social Impact
                </h2>
              </div>
              
              <div className="social-stats-list">
                {socialStats.length > 0 ? (
                  socialStats.map(stat => (
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
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">📱</div>
                    <div className="empty-title">No Social Data</div>
                    <p className="empty-description">Share your proofs to see impact metrics.</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Profile Modal */}
      {showProfileModal && userData && (
        <div className="profile-modal">
          <motion.div 
            className="profile-content glass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <button 
              className="modal-close"
              onClick={() => setShowProfileModal(false)}
            >
              ✕
            </button>
            
            <div className="profile-header">
              <img 
                src={userData.avatar} 
                alt={userData.displayName}
                className="profile-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`;
                }}
              />
              <h2 className="profile-name">{userData.displayName}</h2>
              <p className="profile-bio">{userData.bio}</p>
            </div>
            
            <div className="profile-info">
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <User size={16} />
                </div>
                <div>
                  <div className="profile-info-label">Username</div>
                  <div className="profile-info-value">{userData.username}</div>
                </div>
              </div>
              
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <Mail size={16} />
                </div>
                <div>
                  <div className="profile-info-label">Email</div>
                  <div className="profile-info-value">{userData.email}</div>
                </div>
              </div>
              
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <Calendar size={16} />
                </div>
                <div>
                  <div className="profile-info-label">Member Since</div>
                  <div className="profile-info-value">
                    {new Date(userData.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <Flame size={16} />
                </div>
                <div>
                  <div className="profile-info-label">Current Streak</div>
                  <div className="profile-info-value">{streakData?.currentStreak || 0} days</div>
                </div>
              </div>
              
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <div className="profile-info-label">Today's Status</div>
                  <div className="profile-info-value">
                    {isTodayVerified ? (
                      <span className="text-green-500">✅ Verified</span>
                    ) : (
                      <span className="text-yellow-500">⏳ Pending</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '2rem', paddingTop: 0 }}>
              <button 
                className="dashboard-button button-secondary"
                onClick={() => {
                  setShowProfileModal(false);
                  handleProfileEdit();
                }}
                style={{ width: '100%' }}
              >
                <Edit size={16} />
                Edit Profile
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
              <div className="modal-icon">
                <Share2 size={32} />
              </div>
              <h2 className="modal-title">Share Your Progress</h2>
              <p className="modal-subtitle">
                Day {streakData?.currentStreak || 0} • {streakData?.totalDays || 0} total days
              </p>
            </div>
            
            <div className="modal-grid">
              <button 
                className="modal-button glass"
                onClick={() => handleSocialShare('twitter')}
              >
                <div 
                  className="modal-button-icon"
                  style={{ background: 'rgba(29, 161, 242, 0.2)', color: '#1DA1F2' }}
                >
                  <Twitter size={24} />
                </div>
                <div className="modal-button-name">Twitter</div>
                <div className="modal-button-description">Share your streak</div>
              </button>
              
              <button 
                className="modal-button glass"
                onClick={() => handleSocialShare('linkedin')}
              >
                <div 
                  className="modal-button-icon"
                  style={{ background: 'rgba(0, 119, 181, 0.2)', color: '#0077B5' }}
                >
                  <Linkedin size={24} />
                </div>
                <div className="modal-button-name">LinkedIn</div>
                <div className="modal-button-description">Professional network</div>
              </button>
              
              <button 
                className="modal-button glass"
                onClick={() => handleSocialShare('facebook')}
              >
                <div 
                  className="modal-button-icon"
                  style={{ background: 'rgba(24, 119, 242, 0.2)', color: '#1877F2' }}
                >
                  <Facebook size={24} />
                </div>
                <div className="modal-button-name">Facebook</div>
                <div className="modal-button-description">Friends & family</div>
              </button>
              
              <button 
                className="modal-button glass"
                onClick={() => handleSocialShare('instagram')}
              >
                <div 
                  className="modal-button-icon"
                  style={{ background: 'rgba(225, 48, 108, 0.2)', color: '#E1306C' }}
                >
                  <Instagram size={24} />
                </div>
                <div className="modal-button-name">Instagram</div>
                <div className="modal-button-description">Visual story</div>
              </button>
              
              <button 
                className="modal-button glass whatsapp-button"
                onClick={() => handleSocialShare('whatsapp')}
              >
                <div 
                  className="modal-button-icon"
                  style={{ background: 'rgba(37, 211, 102, 0.2)', color: '#25D366' }}
                >
                  <MessageSquare size={24} />
                </div>
                <div className="modal-button-name">WhatsApp</div>
                <div className="modal-button-description">Direct message</div>
              </button>
              
              <button 
                className="modal-button glass copy-link-button"
                onClick={copyProfileLink}
              >
                <div 
                  className="modal-button-icon"
                  style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6' }}
                >
                  <Copy size={24} />
                </div>
                <div className="modal-button-name">Copy Link</div>
                <div className="modal-button-description">Share anywhere</div>
              </button>
            </div>
            
            <div className="modal-tip">
              <div className="modal-tip-title">
                <div className="modal-tip-icon">💡</div>
                Pro Tip
              </div>
              <p className="modal-tip-text">
                Sharing your progress increases accountability and helps build a supportive community. 
                Plus, you earn extra XP for every share!
              </p>
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
              <div className="modal-icon">
                <Edit size={32} />
              </div>
              <h2 className="modal-title">Edit Profile</h2>
              <p className="modal-subtitle">Update your personal information</p>
            </div>
            
            <div className="profile-info">
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
                  className="form-input"
                  value={profileEdit.bio}
                  onChange={(e) => setProfileEdit({...profileEdit, bio: e.target.value})}
                  placeholder="Tell us about yourself"
                  rows="3"
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
            </div>
            
            <div className="form-actions">
              <button 
                className="dashboard-button button-secondary"
                onClick={() => setProfileEdit({ displayName: '', bio: '', city: '', country: '' })}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                className="dashboard-button button-primary"
                onClick={() => {
                  const updatedData = {
                    displayName: profileEdit.displayName || userData.displayName,
                    bio: profileEdit.bio || userData.bio,
                    location: {
                      city: profileEdit.city || userData.location?.city || 'Online',
                      country: profileEdit.country || userData.location?.country || 'Internet'
                    }
                  };
                  
                  if (updateUserProfile(updatedData)) {
                    setProfileEdit({ displayName: '', bio: '', city: '', country: '' });
                  }
                }}
                style={{ flex: 1 }}
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;