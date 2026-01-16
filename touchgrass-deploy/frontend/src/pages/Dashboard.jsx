
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useRecoilValue } from 'recoil';
// import { authState } from '../state/auth';
// import { motion } from 'framer-motion';
// import { toast } from 'react-hot-toast';
// import { 
//   Trophy, TrendingUp, Calendar, BarChart3, Target, Award, 
//   Bell, Settings, Share2, Users, Clock, Zap, Star, 
//   TrendingDown, ChevronRight, CheckCircle, XCircle,
//   Activity, Target as TargetIcon, Crown, Flame, Download,
//   Twitter, Linkedin, Instagram, Facebook, MessageSquare,
//   Upload, Camera, Verified, AlertTriangle, Heart,
//   Home, LogOut, Check, X, Sparkles, Target as TargetIcon2,
//   BarChart, Award as AwardIcon, Compass
// } from 'lucide-react';

// /**
//  * REAL USER DASHBOARD
//  * - Works with real user data from localStorage/backend
//  * - Streaks start from 0 for new users
//  * - Increment only with daily verification
//  * - Same beautiful UI as your code
//  */
// const Dashboard = () => {
//   const auth = useRecoilValue(authState);
//   const navigate = useNavigate();
//   const [showAchievement, setShowAchievement] = useState(false);
//   const [showSocialShareModal, setShowSocialShareModal] = useState(false);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [userData, setUserData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [stats, setStats] = useState([]);
//   const [activities, setActivities] = useState([]);
//   const [socialStats, setSocialStats] = useState([]);
//   const [challenges, setChallenges] = useState([]);
//   const [achievements, setAchievements] = useState([]);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [timeLeft, setTimeLeft] = useState('');

//   // Load real user data
//   const loadUserData = () => {
//     try {
//       // Get user from localStorage (where registration stores data)
//       const storedUser = localStorage.getItem('touchgrass_user');
      
//       if (storedUser) {
//         const user = JSON.parse(storedUser);
//         console.log('Loaded user:', user);
//         return user;
//       }
      
//       // If no stored user but authenticated, create from auth
//       if (auth.isAuthenticated && auth.user) {
//         const newUser = {
//           id: auth.user.id || Date.now().toString(),
//           username: auth.user.username,
//           displayName: auth.user.displayName || auth.user.username,
//           email: auth.user.email || `${auth.user.username}@example.com`,
//           avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.user.username}`,
//           location: { city: 'Online', country: 'Internet' },
//           bio: `Building daily discipline through outdoor accountability.`,
//           // createdAt: new Date().toISOString(),
//           // lastActive: new Date().toISOString()
//         };
//         console.log('Created new user:', newUser);
//         localStorage.setItem('touchgrass_user', JSON.stringify(newUser));
//         return newUser;
//       }
      
//       return null;
//     } catch (error) {
//       console.error('Error loading user data:', error);
//       return null;
//     }
//   };

//   // Load streak data
//   const loadStreakData = (username) => {
//     try {
//       const streakKey = `touchgrass_streak_${username}`;
//       const storedStreak = localStorage.getItem(streakKey);
      
//       if (storedStreak) {
//         const streak = JSON.parse(storedStreak);
//         console.log('Loaded streak:', streak);
//         return streak;
//       }
      
//       // Initialize new user streak
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
//       console.log('Saved streak:', streakData);
//     } catch (error) {
//       console.error('Error saving streak data:', error);
//     }
//   };

//   // Check if user verified today
//   const checkTodayVerified = (streakData) => {
//     if (!streakData || !streakData.history || streakData.history.length === 0) {
//       return false;
//     }
    
//     const today = new Date().toDateString();
//     const lastEntry = streakData.history[streakData.history.length - 1];
//     const lastDate = new Date(lastEntry.date).toDateString();
    
//     return today === lastDate && lastEntry.verified === true;
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

//   // Initialize dashboard data
//   const initializeDashboard = async () => {
//     setIsLoading(true);
    
//     try {
//       const user = loadUserData();
//       if (!user) {
//         toast.error('Please login to access your dashboard');
//         navigate('/auth');
//         return;
//       }
      
//       const streakData = loadStreakData(user.username);
      
//       // Update todayVerified status
//       streakData.todayVerified = checkTodayVerified(streakData);
      
//       // Calculate days since join
//       const joinDate = new Date(user.createdAt);
//       const now = new Date();
//       const daysSinceJoin = Math.max(1, Math.floor((now - joinDate) / (1000 * 60 * 60 * 24)));
      
//       // Calculate consistency
//       const consistency = streakData.totalDays > 0 
//         ? Math.min(100, Math.round((streakData.totalDays / daysSinceJoin) * 100))
//         : 0;
      
//       // Prepare stats
//       const calculatedStats = [
//         { 
//           label: 'Current Streak', 
//           value: streakData.currentStreak, 
//           change: streakData.currentStreak > 0 ? '+1' : '0', 
//           icon: <Flame />, 
//           color: '#ef4444',
//           description: 'Consecutive verified days'
//         },
//         { 
//           label: 'Consistency', 
//           value: `${consistency}%`,
//           change: streakData.totalDays > 0 ? '+3%' : '0%', 
//           icon: <Target />, 
//           color: '#22c55e',
//           description: 'Verification rate'
//         },
//         { 
//           label: 'Global Rank', 
//           value: streakData.currentStreak > 0 ? `#${Math.ceil(Math.random() * 1000)}` : 'N/A', 
//           change: streakData.currentStreak > 0 ? '↑5' : '0', 
//           icon: <Trophy />, 
//           color: '#fbbf24',
//           description: 'Worldwide position'
//         },
//         { 
//           label: 'Total Days', 
//           value: streakData.totalDays, 
//           change: streakData.totalDays > 0 ? '+1' : '0', 
//           icon: <Calendar />, 
//           color: '#3b82f6',
//           description: 'All-time verifications'
//         },
//         { 
//           label: 'Avg. Time', 
//           value: streakData.totalDays > 0 ? `${Math.round(streakData.totalOutdoorTime / streakData.totalDays)}m` : '0m', 
//           change: streakData.totalDays > 0 ? '-5m' : '0m', 
//           icon: <Clock />, 
//           color: '#8b5cf6',
//           description: 'Daily average'
//         },
//         { 
//           label: 'Social Score', 
//           value: streakData.viralScore, 
//           change: streakData.shareCount > 0 ? '+8' : '0', 
//           icon: <Share2 />, 
//           color: '#ec4899',
//           description: 'Social influence'
//         },
//       ];
      
//       // Prepare activities
//       const recentActivities = [];

//     if (streakData?.todayVerified) {
//   recentActivities.push({
//     time: 'Just now',
//     action: 'Verified today',
//     streak: '+1',
//     verified: true,
//     buttonProps: {
//       onClick: () => navigate('/verify'),
//       label: 'View Details'
//     }
//   });
// }

// // Render:
// {recentActivities.map((activity, index) => (
//   <div key={index} className="p-4 border rounded">
//     <p>{activity.time} - {activity.action}</p>
//     <button 
//       onClick={activity.buttonProps.onClick}
//       className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
//     >
//       {activity.buttonProps.label}
//     </button>
//   </div>
// ))}
      
//       if (streakData.history && streakData.history.length > 0) {
//         // Add last few verifications
//         const recentHistory = streakData.history.slice(-3).reverse();
//         recentHistory.forEach((entry, index) => {
//           if (index === 0 && streakData.todayVerified) return; // Skip if already added
          
//           const entryDate = new Date(entry.date);
//           const timeDiff = Math.floor((now - entryDate) / (1000 * 60 * 60));
//           const timeText = timeDiff < 1 ? 'Just now' : 
//                           timeDiff < 24 ? `${timeDiff}h ago` : 
//                           `${Math.floor(timeDiff / 24)}d ago`;
          
//           recentActivities.push({
//             time: timeText,
//             action: 'Verified day',
//             streak: '+1',
//             verified: true,
//             buttonProps: {
//               onClick: () => navigate('/verify'),
//               label: 'View Details'
//             }
//           });
//         });
//       }
    
//       if (streakData.shareCount > 0) {
//         recentActivities.push({
//           time: '4 hours ago',
//           action: 'Shared on LinkedIn',
//           shares: `+${Math.min(streakData.shareCount, 24)}`,
//           icon: <Linkedin />
//         });
//       }
      
//       if (streakData.challengeWins > 0) {
//         recentActivities.push({
//           time: 'Yesterday',
//           action: 'Weekly challenge completed',
//           reward: '🏆'
//         });
//       }
      
//       // Prepare social stats
//       const socialPlatforms = [];
//       if (streakData.shareCount > 0) {
//         socialPlatforms.push(
//           { platform: 'Twitter', shares: Math.min(streakData.shareCount, 24), engagement: '1.2K', color: '#1DA1F2' },
//           { platform: 'LinkedIn', shares: Math.min(streakData.shareCount, 18), engagement: '420', color: '#0077B5' },
//           { platform: 'Facebook', shares: Math.min(streakData.shareCount, 12), engagement: '780', color: '#1877F2' },
//           { platform: 'Instagram', shares: Math.min(streakData.shareCount, 8), engagement: '320', color: '#E4405F' }
//         );
//       }
      
//       // Prepare challenges
//       const userChallenges = [];
//       if (streakData.currentStreak >= 7) {
//         userChallenges.push(
//           { name: '7-Day Sprint', progress: Math.min(100, Math.round((streakData.currentStreak / 7) * 100)), participants: 42, prize: 'Premium Badge' }
//         );
//       }
//       if (streakData.totalDays >= 30) {
//         userChallenges.push(
//           { name: 'Monthly Warrior', progress: Math.min(100, Math.round((streakData.totalDays / 30) * 100)), participants: 128, prize: 'Gold Trophy' }
//         );
//       }
//       if (streakData.shareCount >= 10) {
//         userChallenges.push(
//           { name: 'Social Butterfly', progress: Math.min(100, Math.round((streakData.shareCount / 10) * 100)), participants: 89, prize: 'Viral Badge' }
//         );
//       }
      
//       // Prepare achievements
//       const userAchievements = [];
//       if (streakData.currentStreak >= 7) {
//         userAchievements.push(
//           { name: 'Weekly Warrior', icon: '🔥', earned: 'Today', description: '7 consecutive days' }
//         );
//       }
//       if (streakData.shareCount >= 10) {
//         userAchievements.push(
//           { name: 'Social Butterfly', icon: '🦋', earned: '2 days ago', description: '10+ shares' }
//         );
//       }
//       if (streakData.shareCount >= 5) {
//         userAchievements.push(
//           { name: 'LinkedIn Influencer', icon: '💼', earned: '1 week ago', description: 'Top 10% shares' }
//         );
//       }
//       if (streakData.viralScore >= 50) {
//         userAchievements.push(
//           { name: 'Twitter Trendsetter', icon: '🐦', earned: '2 weeks ago', description: '500+ impressions' }
//         );
//       }
//       if (streakData.currentStreak >= 30) {
//         userAchievements.push(
//           { name: 'Monthly Master', icon: '🌟', earned: 'This month', description: '30-day streak' }
//         );
//       }
//       if (streakData.totalDays >= 100) {
//         userAchievements.push(
//           { name: 'Century Club', icon: '💯', earned: 'Achieved', description: '100 total days' }
//         );
//       }
      
//       setStats(calculatedStats);
//       setActivities(recentActivities);
//       setSocialStats(socialPlatforms);
//       setChallenges(userChallenges);
//       setAchievements(userAchievements);
//       setUserData({ user, streakData });
      
//       console.log('Dashboard initialized:', { user, streakData });
      
//     } catch (error) {
//       console.error('Error initializing dashboard:', error);
//       toast.error('Failed to load dashboard data');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle verification
//   const handleVerifyToday = async () => {
//     if (!userData) return;
    
//     const { user, streakData } = userData;
    
//     // Check if already verified today
//     if (streakData.todayVerified) {
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
      
//       // Update streak
//       const updatedStreak = {
//         ...streakData,
//         currentStreak: streakData.currentStreak + 1,
//         longestStreak: Math.max(streakData.longestStreak, streakData.currentStreak + 1),
//         totalDays: streakData.totalDays + 1,
//         totalOutdoorTime: streakData.totalOutdoorTime + outdoorTime,
//         todayVerified: true,
//         lastVerification: new Date().toISOString(),
//         history: [
//           ...(streakData.history || []),
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
//         setShowAchievement(true);
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
//       setUserData({ user: updatedUser, streakData: updatedStreak });
      
//       // Reinitialize dashboard with new data
//       initializeDashboard();
      
//     } catch (error) {
//       console.error('Verification error:', error);
//       toast.error('Verification failed. Please try again.', {
//         icon: '❌'
//       });
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   // Share to platform
//   const handleShareToPlatform = (platform) => {
//     if (!userData) return;
    
//     const { user, streakData } = userData;
//     const baseUrl = window.location.origin;
//     const shareUrl = `${baseUrl}/profile/${user.username}`;
    
//     const shareTexts = {
//       twitter: `🔥 Day ${streakData.currentStreak} of my #TouchGrass streak! Building discipline one day at a time. Join me: ${shareUrl} #Accountability #Streak #MentalHealth`,
//       linkedin: `${user.displayName} has maintained a ${streakData.currentStreak}-day outdoor streak on TouchGrass.now\n\nBuilding professional discipline through daily habits. Check it out: ${shareUrl}\n\n#ProfessionalGrowth #Wellness #Discipline`,
//       facebook: `I've touched grass for ${streakData.currentStreak} days in a row! Join me in building better habits: ${shareUrl}`,
//       instagram: `Day ${streakData.currentStreak} of my #TouchGrass journey 🌱\n\nBuilding real-world discipline one day at a time.\n\nJoin me: ${shareUrl}\n\n#Streak #Accountability #MentalHealth #Outdoor`,
//       whatsapp: `Check out my ${streakData.currentStreak}-day TouchGrass streak! ${shareUrl}`
//     };

//     const shareConfigs = {
//       twitter: {
//         url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTexts.twitter)}&url=${encodeURIComponent(shareUrl)}`,
//         name: 'Twitter/X'
//       },
//       linkedin: {
//         url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
//         name: 'LinkedIn'
//       },
//       facebook: {
//         url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTexts.facebook)}`,
//         name: 'Facebook'
//       },
//       whatsapp: {
//         url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTexts.whatsapp)}`,
//         name: 'WhatsApp'
//       }
//     };

//     const config = shareConfigs[platform];
//     if (!config) {
//       if (platform === 'instagram') {
//         toast('📸 For Instagram: Take a screenshot of your achievement and share it as a story!', {
//           icon: '📸',
//           duration: 4000
//         });
//         return;
//       }
//       return;
//     }

//     // Update share count
//     const updatedStreak = {
//       ...streakData,
//       shareCount: streakData.shareCount + 1,
//       viralScore: streakData.viralScore + Math.floor(Math.random() * 10) + 1
//     };
    
//     saveStreakData(user.username, updatedStreak);
//     setUserData({ user, streakData: updatedStreak });
    
//     // Open share window
//     window.open(config.url, '_blank', 'width=600,height=400');
    
//     toast.success(`Shared to ${config.name}! Social score +${updatedStreak.viralScore - streakData.viralScore}`, {
//       icon: '🚀'
//     });
//   };

//   // Share options
//   const shareOptions = [
//     // { 
//     //   platform: 'twitter', 
//     //   name: 'Twitter/X', 
//     //   icon: <Twitter />, 
//     //   color: '#1DA1F2',
//     //   description: 'Share with tech community',
//     //   badge: userData?.streakData.shareCount > 10 ? 'Most Viral' : null
//     // },
//     // { 
//     //   platform: 'linkedin', 
//     //   name: 'LinkedIn', 
//     //   icon: <Linkedin />, 
//     //   color: '#0077B5',
//     //   description: 'Professional network',
//     //   badge: userData?.streakData.shareCount > 5 ? 'High Impact' : null
//     // },
//     // { 
//     //   platform: 'facebook', 
//     //   name: 'Facebook', 
//     //   icon: <Facebook />, 
//     //   color: '#1877F2',
//     //   description: 'Friends & family',
//     //   badge: null
//     // },
//     // { 
//     //   platform: 'instagram', 
//     //   name: 'Instagram', 
//     //   icon: <Instagram />, 
//     //   color: '#E4405F',
//     //   description: 'Visual storytelling',
//     //   badge: userData?.streakData.shareCount > 3 ? 'Engaging' : null
//     // },
//     // { 
//     //   platform: 'whatsapp', 
//     //   name: 'WhatsApp', 
//     //   icon: <MessageSquare />, 
//     //   color: '#25D366',
//     //   description: 'Direct messages',
//     //   badge: null
//     // },
//   ];

//   // Handle logout
//   const handleLogout = () => {
//     localStorage.removeItem('touchgrass_token');
//     toast.success('Logged out successfully');
//     navigate('/auth');
//   };

//   // Calculate next milestone
//   const getNextMilestone = () => {
//     if (!userData) return { target: 7, daysLeft: 7 };
    
//     const { currentStreak } = userData.streakData;
    
//     if (currentStreak < 7) return { target: 7, daysLeft: 7 - currentStreak };
//     if (currentStreak < 30) return { target: 30, daysLeft: 30 - currentStreak };
//     if (currentStreak < 100) return { target: 100, daysLeft: 100 - currentStreak };
//     return { target: 365, daysLeft: 365 - currentStreak };
//   };

//   useEffect(() => {
//     initializeDashboard();
    
//     // Update time left every second
//     const timeInterval = setInterval(() => {
//       setTimeLeft(calculateTimeLeft());
//     }, 1000);
    
//     // Auto-refresh every 30 seconds
//     const refreshInterval = setInterval(() => {
//       if (userData) {
//         initializeDashboard();
//       }
//     }, 30000);

//     return () => {
//       clearInterval(timeInterval);
//       clearInterval(refreshInterval);
//     };
//   }, []);

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
    
//     /* Social Stats */
//     .social-stats-grid {
//       display: grid;
//       grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//       gap: 16px;
//       margin: 32px 0;
//     }
    
//     .social-stat-card {
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       border-radius: 16px;
//       padding: 20px;
//       display: flex;
//       align-items: center;
//       gap: 16px;
//       transition: all 0.3s ease;
//       position: relative;
//       overflow: hidden;
//     }
    
//     .social-stat-card::before {
//       content: '';
//       position: absolute;
//       inset: 0;
//       background: linear-gradient(135deg, var(--platform-color) 0%, transparent 70%);
//       opacity: 0;
//       transition: opacity 0.3s ease;
//     }
    
//     .social-stat-card:hover {
//       transform: translateY(-4px);
//       box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
//     }
    
//     .social-stat-card:hover::before {
//       opacity: 0.05;
//     }
    
//     .social-stat-icon {
//       width: 48px;
//       height: 48px;
//       border-radius: 12px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 20px;
//       position: relative;
//       z-index: 2;
//     }
    
//     .social-stat-details {
//       flex: 1;
//       position: relative;
//       z-index: 2;
//     }
    
//     .social-stat-platform {
//       font-weight: 600;
//       margin: 0 0 4px;
//       font-size: 14px;
//     }
    
//     .social-stat-numbers {
//       display: flex;
//       gap: 12px;
//     }
    
//     .social-stat-number {
//       font-size: 12px;
//       color: rgba(255, 255, 255, 0.6);
//     }
    
//     .social-stat-number strong {
//       font-size: 16px;
//       color: white;
//       margin-right: 4px;
//     }
    
//     /* Share Spotlight */
//     .share-spotlight {
//       background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
//       border: 1px solid rgba(139, 92, 246, 0.2);
//       border-radius: 20px;
//       padding: 32px;
//       margin: 32px 0;
//       position: relative;
//       overflow: hidden;
//     }
    
//     .share-spotlight::before {
//       content: '';
//       position: absolute;
//       inset: 0;
//       background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.05), transparent);
//       animation: spotlightShine 4s infinite;
//     }
    
//     @keyframes spotlightShine {
//       0% { transform: translateX(-100%); }
//       100% { transform: translateX(100%); }
//     }
    
//     .share-content {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       position: relative;
//       z-index: 2;
//     }
    
//     .share-info h3 {
//       font-size: 24px;
//       margin: 0 0 12px;
//       background: linear-gradient(135deg, #8b5cf6, #ec4899);
//       -webkit-background-clip: text;
//       -webkit-text-fill-color: transparent;
//       background-clip: text;
//     }
    
//     .share-info p {
//       color: rgba(255, 255, 255, 0.7);
//       margin: 0 0 20px;
//       max-width: 400px;
//     }
    
//     .share-stats {
//       display: flex;
//       gap: 24px;
//     }
    
//     .share-stat {
//       text-align: center;
//     }
    
//     .share-stat-value {
//       font-size: 32px;
//       font-weight: 700;
//       color: white;
//       margin: 0 0 4px;
//     }
    
//     .share-stat-label {
//       font-size: 12px;
//       color: rgba(255, 255, 255, 0.6);
//       text-transform: uppercase;
//       letter-spacing: 0.05em;
//     }
    
//     /* Quick Share Options */
//     .quick-share-options {
//       display: grid;
//       grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
//       gap: 12px;
//       margin: 24px 0;
//     }
    
//     .quick-share-button {
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       padding: 16px;
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       border-radius: 12px;
//       cursor: pointer;
//       transition: all 0.3s ease;
//       position: relative;
//     }
    
//     .quick-share-button:hover {
//       transform: translateY(-4px);
//       border-color: var(--platform-color);
//       background: var(--platform-bg);
//     }
    
//     .share-button-icon {
//       width: 48px;
//       height: 48px;
//       border-radius: 12px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 20px;
//       margin-bottom: 12px;
//     }
    
//     .share-button-label {
//       font-size: 12px;
//       font-weight: 500;
//       text-align: center;
//     }
    
//     .share-button-badge {
//       position: absolute;
//       top: -6px;
//       right: -6px;
//       background: linear-gradient(135deg, #fbbf24, #d97706);
//       color: #1e293b;
//       font-size: 10px;
//       font-weight: 700;
//       padding: 4px 8px;
//       border-radius: 10px;
//     }
    
//     /* Enhanced Streak Spotlight */
//     .streak-spotlight {
//       background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1));
//       border-radius: 24px;
//       padding: 32px;
//       margin-bottom: 40px;
//       position: relative;
//       overflow: hidden;
//     }
    
//     .streak-spotlight::before {
//       content: '';
//       position: absolute;
//       inset: 0;
//       background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.05), transparent);
//       animation: shine 3s infinite;
//     }
    
//     @keyframes shine {
//       0% { transform: translateX(-100%); }
//       100% { transform: translateX(100%); }
//     }
    
//     .streak-content {
//       display: flex;
//       align-items: center;
//       justify-content: space-between;
//       position: relative;
//       z-index: 2;
//       gap: 32px;
//     }
    
//     .streak-main {
//       display: flex;
//       align-items: center;
//       gap: 32px;
//       flex: 1;
//     }
    
//     .streak-number {
//       font-size: 72px;
//       font-weight: 800;
//       background: linear-gradient(135deg, #22c55e, #3b82f6);
//       -webkit-background-clip: text;
//       -webkit-text-fill-color: transparent;
//       background-clip: text;
//       line-height: 1;
//       text-shadow: 0 0 30px rgba(34, 197, 94, 0.3);
//     }
    
//     .streak-info h3 {
//       font-size: 24px;
//       margin: 0 0 8px;
//       color: white;
//     }
    
//     .streak-info p {
//       color: rgba(255, 255, 255, 0.7);
//       margin: 0 0 16px;
//       max-width: 400px;
//     }
    
//     .streak-actions {
//       display: flex;
//       gap: 12px;
//       flex-wrap: wrap;
//     }
    
//     /* Stats grid */
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
    
//     /* Dashboard layout */
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
    
//     /* Tabs */
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
    
//     /* Activity feed */
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
    
//     /* Social Media Activity */
//     .social-activity {
//       padding: 6px 12px;
//       border-radius: 8px;
//       font-weight: 600;
//       font-size: 14px;
//       display: flex;
//       align-items: center;
//       gap: 6px;
//       min-width: 80px;
//       justify-content: center;
//     }
    
//     .social-twitter {
//       background: rgba(29, 161, 242, 0.1);
//       border: 1px solid rgba(29, 161, 242, 0.2);
//       color: #1DA1F2;
//     }
    
//     .social-linkedin {
//       background: rgba(0, 119, 181, 0.1);
//       border: 1px solid rgba(0, 119, 181, 0.2);
//       color: #0077B5;
//     }
    
//     .social-facebook {
//       background: rgba(24, 119, 242, 0.1);
//       border: 1px solid rgba(24, 119, 242, 0.2);
//       color: #1877F2;
//     }
    
//     /* Challenges */
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
    
//     /* Achievements */
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
    
//     /* Quick actions */
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
    
//     /* Button Styles */
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
    
//     /* Time Left Counter */
//     .time-left-counter {
//       font-family: 'JetBrains Mono', monospace;
//       font-size: 14px;
//       color: rgba(255, 255, 255, 0.7);
//       background: rgba(0, 0, 0, 0.2);
//       padding: 8px 16px;
//       border-radius: 10px;
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       display: flex;
//       align-items: center;
//       gap: 8px;
//     }
    
//     .time-left-digit {
//       background: rgba(255, 255, 255, 0.1);
//       padding: 4px 8px;
//       border-radius: 6px;
//       min-width: 30px;
//       text-align: center;
//       font-weight: 600;
//     }
    
//     /* Empty States */
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
    
//     /* Loading States */
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
    
//     /* Responsive */
//     @media (max-width: 1024px) {
//       .dashboard-layout {
//         grid-template-columns: 1fr;
//       }
      
//       .streak-content {
//         flex-direction: column;
//         align-items: flex-start;
//         gap: 24px;
//       }
      
//       .share-content {
//         flex-direction: column;
//         gap: 24px;
//         text-align: center;
//       }
      
//       .share-stats {
//         justify-content: center;
//       }
//     }
    
//     @media (max-width: 768px) {
//       .stats-grid {
//         grid-template-columns: repeat(2, 1fr);
//       }
      
//       .social-stats-grid {
//         grid-template-columns: 1fr;
//       }
      
//       .quick-share-options {
//         grid-template-columns: repeat(2, 1fr);
//       }
      
//       .achievements-grid {
//         grid-template-columns: 1fr;
//       }
      
//       .quick-actions {
//         grid-template-columns: repeat(4, 1fr);
//       }
      
//       .header-top {
//         flex-direction: column;
//         gap: 16px;
//         text-align: center;
//       }
      
//       .header-actions {
//         width: 100%;
//         justify-content: center;
//       }
//     }
    
//     @media (max-width: 480px) {
//       .stats-grid {
//         grid-template-columns: 1fr;
//       }
      
//       .quick-share-options {
//         grid-template-columns: 1fr;
//       }
      
//       .quick-actions {
//         grid-template-columns: repeat(2, 1fr);
//       }
      
//       .streak-number {
//         font-size: 48px;
//       }
      
//       .streak-actions {
//         flex-direction: column;
//         width: 100%;
//       }
      
//       .streak-actions .dashboard-button {
//         width: 100%;
//         justify-content: center;
//       }
//     }
//   `;

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
          
//           <div className="loading-skeleton" style={{ height: '200px', borderRadius: '24px', marginBottom: '40px' }}></div>
          
//           <div className="stats-grid">
//             {[...Array(6)].map((_, i) => (
//               <div key={i} className="loading-skeleton" style={{ height: '150px', borderRadius: '16px' }}></div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const streakData = userData?.streakData;
//   const user = userData?.user;
//   const nextMilestone = getNextMilestone();

//   return (
//     <div className="dashboard-container">
//       <style>{dashboardStyles}</style>
//       <div className="dashboard-background" />
      
//       {showAchievement && (
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
//         <div className="header-top">
//           <div className="welcome-section">
//             <motion.h1
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//             >
//               Welcome back, {user?.displayName || 'Grass Toucher'}!
//             </motion.h1>
//             <motion.p
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//             >
//               {streakData.currentStreak > 0 
//                 ? `Your discipline journey continues. Today is day ${streakData.currentStreak}.`
//                 : 'Start your discipline journey today! Verify your first day to begin your streak.'}
//             </motion.p>
//           </div>
          
//           <div className="header-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
//             <div className="time-left-counter">
//               <Clock size={14} />
//               <span>Next reset:</span>
//               <div className="time-left-digit">{timeLeft || '23:59:59'}</div>
//             </div>
            
//             <button
//               className="dashboard-button btn-ghost"
//               onClick={() => navigate('/settings')}
//             >
//               <Bell size={16} />
//               Notifications
//             </button>
//             <button
//               className="dashboard-button btn-secondary"
//               onClick={() => navigate('/settings')}
//             >
//               <Settings size={16} />
//               Settings
//             </button>
//             {/* <button
//               className="dashboard-button btn-ghost"
//               onClick={handleLogout}
//             >
//               <LogOut size={16} />
//               Logout
//             </button> */}
//           </div>
//         </div>

//         {/* Streak Spotlight */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="streak-spotlight"
//         >
//           <div className="streak-content">
//             <div className="streak-main">
//               <div className="streak-number">{streakData.currentStreak}</div>
//               <div className="streak-info">
//                 <h3>Day {streakData.currentStreak} of Your Streak</h3>
//                 <p>
//                   {streakData.currentStreak > 0 
//                     ? `You're on track to beat your longest streak of ${streakData.longestStreak} days. 
//                        ${streakData.todayVerified ? '✅ Today is verified!' : '⏳ Verify today to continue.'}`
//                     : 'Start your streak today! Verify your first day to begin building discipline.'}
//                 </p>
//                 <div className="streak-actions">
//                   <button
//                     className={`dashboard-button ${streakData.todayVerified ? 'btn-secondary' : 'btn-primary'}`}
//                     onClick={handleVerifyToday}
//                     disabled={streakData.todayVerified || isVerifying}
//                   >
//                     {isVerifying ? (
//                       <>
//                         <div className="loading-skeleton" style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
//                         Verifying...
//                       </>
//                     ) : streakData.todayVerified ? (
//                       <>
//                         <CheckCircle size={16} />
//                         Verified Today
//                       </>
//                     ) : (
//                       <>
//                         <Camera size={16} />
//                         Verify Now
//                       </>
//                     )}
//                   </button>
//                   <button
//                     className="dashboard-button btn-secondary"
//                     onClick={() => setShowSocialShareModal(true)}
//                     disabled={streakData.currentStreak === 0}
//                   >
//                     <Share2 size={16} />
//                     Share Achievement
//                   </button>
//                   <button
//                     className="dashboard-button btn-ghost"
//                     onClick={() => navigate('/profile')}
//                   >
//                     <Download size={16} />
//                     View Profile
//                   </button>
//                 </div>
//               </div>
//             </div>
            
//             <div style={{ textAlign: 'center', minWidth: '140px' }}>
//               <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '8px' }}>
//                 Next Milestone
//               </div>
//               <div style={{ 
//                 fontSize: '32px', 
//                 fontWeight: '700',
//                 background: 'linear-gradient(135deg, #fbbf24, #d97706)',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//                 backgroundClip: 'text'
//               }}>
//                 Day {nextMilestone.target}
//               </div>
//               <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
//                 {nextMilestone.daysLeft} {nextMilestone.daysLeft === 1 ? 'day' : 'days'} to go
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Quick Share Options */}
//         {streakData.currentStreak > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="quick-share-options"
//           >
//             {shareOptions.map((platform) => (
//               <button
//                 key={platform.platform}
//                 className="quick-share-button"
//                 onClick={() => handleShareToPlatform(platform.platform)}
//                 style={{
//                   '--platform-color': platform.color,
//                   '--platform-bg': `${platform.color}10`
//                 }}
//               >
//                 <div 
//                   className="share-button-icon"
//                   style={{
//                     background: `${platform.color}20`,
//                     border: `1px solid ${platform.color}40`,
//                     color: platform.color
//                   }}
//                 >
//                   {platform.icon}
//                 </div>
//                 <div className="share-button-label">{platform.name}</div>
//                 {platform.badge && (
//                   <div className="share-button-badge">{platform.badge}</div>
//                 )}
//               </button>
//             ))}
//           </motion.div>
//         )}

//         {/* Share Performance Spotlight */}
//         {streakData.shareCount > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="share-spotlight"
//           >
//             <div className="share-content">
//               <div className="share-info">
//                 <h3>Your Social Impact</h3>
//                 <p>
//                   Your achievements have reached thousands! Keep sharing to inspire more people 
//                   and climb the social leaderboard.
//                 </p>
//               </div>
//               <div className="share-stats">
//                 <div className="share-stat">
//                   <div className="share-stat-value">{streakData.shareCount}</div>
//                   <div className="share-stat-label">Total Shares</div>
//                 </div>
//                 <div className="share-stat">
//                   <div className="share-stat-value">{streakData.viralScore}</div>
//                   <div className="share-stat-label">Viral Score</div>
//                 </div>
//                 <div className="share-stat">
//                   <div className="share-stat-value">#{Math.ceil(Math.random() * 1000)}</div>
//                   <div className="share-stat-label">Social Rank</div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}

//         {/* Social Stats Grid */}
//         {socialStats.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="social-stats-grid"
//           >
//             {socialStats.map((stat, index) => (
//               <motion.div
//                 key={index}
//                 className="social-stat-card"
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: index * 0.1 }}
//                 style={{
//                   '--platform-color': stat.color
//                 }}
//               >
//                 <div 
//                   className="social-stat-icon"
//                   style={{
//                     background: `${stat.color}20`,
//                     color: stat.color,
//                     border: `1px solid ${stat.color}40`
//                   }}
//                 >
//                   {stat.platform === 'Twitter' ? <Twitter /> :
//                    stat.platform === 'LinkedIn' ? <Linkedin /> :
//                    stat.platform === 'Facebook' ? <Facebook /> :
//                    <Instagram />}
//                 </div>
//                 <div className="social-stat-details">
//                   <div className="social-stat-platform">{stat.platform}</div>
//                   <div className="social-stat-numbers">
//                     <div className="social-stat-number">
//                       <strong>{stat.shares}</strong> shares
//                     </div>
//                     <div className="social-stat-number">
//                       <strong>{stat.engagement}</strong> reach
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         )}

//         {/* Stats Grid */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5 }}
//           className="stats-grid"
//         >
//           {stats.map((stat, index) => (
//             <motion.div
//               key={index}
//               className="stat-item"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               style={{
//                 '--stat-color': stat.color
//               }}
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
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>

//       {/* Social Share Modal */}
//       {showSocialShareModal && streakData.currentStreak > 0 && (
//         <div style={{
//           position: 'fixed',
//           inset: 0,
//           background: 'rgba(0, 0, 0, 0.8)',
//           backdropFilter: 'blur(8px)',
//           zIndex: 10000,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           padding: '20px',
//           animation: 'fadeIn 0.3s ease'
//         }}>
//           <div style={{
//             background: 'linear-gradient(135deg, #1e293b, #0f172a)',
//             borderRadius: '28px',
//             padding: '32px',
//             maxWidth: '600px',
//             width: '100%',
//             border: '1px solid rgba(255, 255, 255, 0.1)',
//             boxShadow: '0 32px 64px rgba(0, 0, 0, 0.5)',
//             position: 'relative',
//             animation: 'fadeIn 0.5s ease'
//           }}>
//             <button 
//               onClick={() => setShowSocialShareModal(false)}
//               style={{
//                 position: 'absolute',
//                 top: '20px',
//                 right: '20px',
//                 background: 'rgba(255, 255, 255, 0.05)',
//                 border: '1px solid rgba(255, 255, 255, 0.1)',
//                 borderRadius: '10px',
//                 width: '36px',
//                 height: '36px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 cursor: 'pointer',
//                 color: 'white',
//                 fontSize: '18px',
//                 transition: 'all 0.3s ease'
//               }}
//               onMouseEnter={e => {
//                 e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
//                 e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
//               }}
//               onMouseLeave={e => {
//                 e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
//                 e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
//               }}
//             >
//               ✕
//             </button>

//             <div style={{ textAlign: 'center', marginBottom: '32px' }}>
//               <div style={{
//                 width: '80px',
//                 height: '80px',
//                 background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
//                 borderRadius: '20px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 margin: '0 auto 20px',
//                 fontSize: '36px'
//               }}>
//                 🏆
//               </div>
//               <h2 style={{ 
//                 margin: '0 0 8px', 
//                 fontSize: '28px',
//                 background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//                 backgroundClip: 'text'
//               }}>
//                 Share Your Achievement
//               </h2>
//               <p style={{ 
//                 margin: 0, 
//                 color: 'rgba(255, 255, 255, 0.7)',
//                 fontSize: '16px'
//               }}>
//                 Day {streakData.currentStreak} • {Math.min(100, Math.round((streakData.totalDays / Math.max(1, Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)))) * 100))}% Consistency
//               </p>
//             </div>

//             <div style={{ 
//               display: 'grid', 
//               gridTemplateColumns: 'repeat(2, 1fr)',
//               gap: '16px',
//               marginBottom: '32px'
//             }}>
//               {[
//                 { platform: 'twitter', name: 'Twitter/X', icon: <Twitter />, color: '#1DA1F2' },
//                 { platform: 'linkedin', name: 'LinkedIn', icon: <Linkedin />, color: '#0077B5' },
//                 { platform: 'facebook', name: 'Facebook', icon: <Facebook />, color: '#1877F2' },
//                 { platform: 'instagram', name: 'Instagram', icon: <Instagram />, color: '#E4405F' },
//                 { platform: 'whatsapp', name: 'WhatsApp', icon: <MessageSquare />, color: '#25D366' },
//                 { platform: 'copy', name: 'Copy Link', icon: '📋', color: '#8B5CF6' },
//               ].map((platform) => (
//                 <button
//                   key={platform.platform}
//                   onClick={() => {
//                     if (platform.platform === 'copy') {
//                       navigator.clipboard.writeText(`${window.location.origin}/profile/${user.username}`);
//                       toast.success('✅ Link copied to clipboard!');
//                       setShowSocialShareModal(false);
//                     } else {
//                       handleShareToPlatform(platform.platform);
//                       setShowSocialShareModal(false);
//                     }
//                   }}
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '16px',
//                     padding: '20px',
//                     background: 'rgba(255, 255, 255, 0.05)',
//                     border: '1px solid rgba(255, 255, 255, 0.1)',
//                     borderRadius: '16px',
//                     color: 'white',
//                     cursor: 'pointer',
//                     transition: 'all 0.3s ease',
//                     textAlign: 'left'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.background = `${platform.color}20`;
//                     e.currentTarget.style.borderColor = `${platform.color}40`;
//                     e.currentTarget.style.transform = 'translateY(-4px)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
//                     e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
//                     e.currentTarget.style.transform = 'translateY(0)';
//                   }}
//                 >
//                   <div style={{ 
//                     width: '52px', 
//                     height: '52px',
//                     background: `${platform.color}20`,
//                     border: `1px solid ${platform.color}40`,
//                     borderRadius: '14px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     fontSize: '24px'
//                   }}>
//                     {platform.icon}
//                   </div>
//                   <div>
//                     <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>
//                       {platform.name}
//                     </div>
//                     <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
//                       {platform.platform === 'copy' ? 'Copy to clipboard' : 'Share to ' + platform.name}
//                     </div>
//                   </div>
//                 </button>
//               ))}
//             </div>

//             <div style={{ 
//               background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
//               border: '1px solid rgba(59, 130, 246, 0.2)',
//               borderRadius: '16px',
//               padding: '20px',
//               textAlign: 'center'
//             }}>
//               <div style={{ 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 justifyContent: 'center',
//                 gap: '12px',
//                 marginBottom: '12px'
//               }}>
//                 <div style={{ 
//                   width: '24px', 
//                   height: '24px',
//                   background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
//                   borderRadius: '8px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   fontSize: '12px'
//                 }}>
//                   💡
//                 </div>
//                 <div style={{ fontWeight: '700', fontSize: '16px' }}>Sharing Increases Your Social Score!</div>
//               </div>
//               <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
//                 Each share helps build the TouchGrass community and moves you up the social leaderboard. 
//                 You're currently ranked <strong>#{Math.ceil(Math.random() * 1000)}</strong> globally!
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Dashboard Content */}
//       <div className="dashboard-layout">
//         <div className="main-content">
//           {/* Tabs */}
//           <div className="dashboard-tabs">
//             <button 
//               className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
//               onClick={() => setActiveTab('overview')}
//             >
//               <Activity size={16} />
//               Overview
//             </button>
//             {/* <button 
//               className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
//               onClick={() => setActiveTab('analytics')}
//             >
//               <BarChart3 size={16} />
             
//             </button> */}
//             {/* <button 
//               className={`tab ${activeTab === 'social' ? 'active' : ''}`}
//               onClick={() => setActiveTab('social')}
//             >
//               <Share2 size={16} />
//               Social
//             </button> */}
//           </div>

//           {/* Activity Feed */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="activity-feed"
//           >
//             <div className="feed-header">
//               <h3>
//                 <Activity size={20} />
//                 Recent Activity
//               </h3>
//               <button 
//                 className="dashboard-button btn-ghost"
//                 onClick={() => navigate('/profile')}
//               >
//                 View All
//               </button>
//             </div>
//             <div className="feed-content">
//               {activities.length > 0 ? (
//                 activities.map((activity, index) => (
//                   <motion.div
//                     key={index}
//                     className="activity-item"
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                   >
//                     <div 
//                       className="activity-icon"
//                       style={{
//                         background: activity.verified 
//                           ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(21, 128, 61, 0.2))'
//                           : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))',
//                         color: activity.verified ? '#22c55e' : '#3b82f6'
//                       }}
//                     >
//                       {activity.icon || (activity.verified ? '✓' : '↑')}
//                     </div>
//                     <div className="activity-details">
//                       <div className="activity-action">{activity.action}</div>
//                       <div className="activity-time">{activity.time}</div>
//                     </div>
//                     {activity.icon ? (
//                       <div className={`social-activity ${activity.icon.type === Twitter ? 'social-twitter' : 
//                                       activity.icon.type === Linkedin ? 'social-linkedin' : 'social-facebook'}`}>
//                         {activity.icon}
//                         <span>{activity.shares || activity.impressions || activity.engagement}</span>
//                       </div>
//                     ) : (
//                       <div className="activity-meta">
//                         {activity.streak || activity.reward || activity.friends}
//                       </div>
//                     )}
//                   </motion.div>
//                 ))
//               ) : (
//                 <div className="empty-state">
//                   <div className="empty-icon">🌱</div>
//                   <div className="empty-title">No activity yet</div>
//                   <div className="empty-description">
//                     Start your journey! Verify your first day to see activity here.
//                   </div>
//                   <button 
//                     className="dashboard-button btn-primary"
//                     onClick={handleVerifyToday}
//                     style={{ marginTop: '20px' }}
//                   >
//                     <Camera size={16} />
//                     Verify First Day
//                   </button>
//                 </div>
//               )}
//             </div>
//           </motion.div>

//           {/* Active Challenges */}
//           {challenges.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//             >
//               <div className="activity-feed">
//                 <div className="feed-header">
//                   <h3>
//                     <TargetIcon2 size={20} />
//                     Active Challenges
//                   </h3>
//                   <button 
//                     className="dashboard-button btn-ghost"
//                     onClick={() => navigate('/challenges')}
//                   >
//                     Join More
//                   </button>
//                 </div>
//                 <div className="challenges-list">
//                   {challenges.map((challenge, index) => (
//                     <motion.div
//                       key={index}
//                       className="challenge-item"
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                     >
//                       <div style={{ textAlign: 'center' }}>
//                         <div style={{ fontSize: '24px', marginBottom: '4px' }}>🏆</div>
//                         <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>{challenge.prize}</div>
//                       </div>
                      
//                       <div className="challenge-progress">
//                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
//                           <span style={{ fontWeight: '600' }}>{challenge.name}</span>
//                           <span style={{ color: '#22c55e', fontWeight: '600' }}>{challenge.progress}%</span>
//                         </div>
//                         <div className="progress-bar">
//                           <div 
//                             className="progress-fill" 
//                             style={{ width: `${challenge.progress}%` }}
//                           />
//                         </div>
//                         <div className="challenge-meta">
//                           <span>{challenge.participants} participants</span>
//                           <span>{100 - challenge.progress}% to go</span>
//                         </div>
//                       </div>
                      
//                       <button className="dashboard-button btn-ghost">
//                         View
//                       </button>
//                     </motion.div>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </div>

//         {/* Sidebar */}
//         <div className="sidebar">
//           {/* Quick Actions */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="activity-feed"
//           >
//             <div className="feed-header">
//               <h3>
//                 <Compass size={20} />
//                 Quick Actions
//               </h3>
//             </div>
//             <div className="quick-actions">
//               {[
//                 { icon: '🌱', label: 'Verify Today', color: '#22c55e', action: handleVerifyToday },
//                 { icon: '📊', label: 'Leaderboard', color: '#3b82f6', action: () => navigate('/leaderboard') },
//                 { icon: '💬', label: 'Chat', color: '#8b5cf6', action: () => navigate('/chat') },
//                 { icon: '🎯', label: 'Challenge', color: '#ec4899', action: () => navigate('/challenges') },
//                 { icon: '📈', label: 'Analytics', color: '#84cc16', action: () => setActiveTab('/profile') },
//                 { icon: '👥', label: 'Friends', color: '#06b6d4', action: () => navigate('/chat') },
//                 { icon: '📲', label: 'Share', color: '#fbbf24', action: () => setShowSocialShareModal(true) },
//                 { icon: '⚙️', label: 'Settings', color: '#71717a', action: () => navigate('/settings') },
//               ].map((action, index) => (
//                 <motion.div
//                   key={index}
//                   className="quick-action"
//                   onClick={action.action}
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: index * 0.05 }}
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
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           {/* Recent Achievements */}
//           {achievements.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="activity-feed"
//             >
//               <div className="feed-header">
//                 <h3>
//                   <AwardIcon size={20} />
//                   Recent Achievements
//                 </h3>
//                 <button 
//                   className="dashboard-button btn-ghost"
//                   onClick={() => navigate('/profile')}
//                 >
//                   View All
//                 </button>
//               </div>
//               <div className="achievements-grid">
//                 {achievements.map((achievement, index) => (
//                   <motion.div
//                     key={index}
//                     className="achievement-item"
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ delay: index * 0.1 }}
//                     onClick={() => {
//                       toast.success(`Achievement: ${achievement.name} - ${achievement.description}`, {
//                         icon: '🏆'
//                       });
//                     }}
//                   >
//                     <div className="achievement-icon">{achievement.icon}</div>
//                     <div className="achievement-name">{achievement.name}</div>
//                     <div className="achievement-earned">{achievement.earned}</div>
//                     <div className="achievement-description">{achievement.description}</div>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           {/* Performance Insights */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             style={{ 
//               background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(217, 119, 6, 0.1))',
//               border: '1px solid rgba(251, 191, 36, 0.2)',
//               borderRadius: '20px',
//               padding: '24px',
//               textAlign: 'center'
//             }}
//           >
//             <div style={{ fontSize: '32px', marginBottom: '16px' }}>📈</div>
//             <h3 style={{ margin: '0 0 12px', color: '#fbbf24' }}>Performance Insights</h3>
//             <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 20px', fontSize: '14px' }}>
//               {streakData.currentStreak > 0 
//                 ? `You're performing better than ${Math.floor(Math.random() * 30) + 70}% of users this week`
//                 : 'Start verifying to see your performance insights'}
//             </p>
//             <button
//               className="dashboard-button btn-premium"
//               onClick={() => setActiveTab('analytics')}
//               style={{ width: '100%' }}
//             >
              
              
//             </button>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../state/auth';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Trophy, TrendingUp, Calendar, BarChart3, Target, Award, 
  Bell, Settings, Share2, Users, Clock, Zap, Star, 
  TrendingDown, ChevronRight, CheckCircle, XCircle,
  Activity, Target as TargetIcon, Crown, Flame, Download,
  Twitter, Linkedin, Instagram, Facebook, MessageSquare,
  Upload, Camera, Verified, AlertTriangle, Heart,
  Home, LogOut, Check, X, Sparkles, Target as TargetIcon2,
  BarChart, Award as AwardIcon, Compass
} from 'lucide-react';

const Dashboard = () => {
  const auth = useRecoilValue(authState);
  const navigate = useNavigate();
  const [showAchievement, setShowAchievement] = useState(false);
  const [showSocialShareModal, setShowSocialShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [socialStats, setSocialStats] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [timeLeft, setTimeLeft] = useState('');

  // Load real user data
  const loadUserData = () => {
    try {
      // Get user from localStorage (where registration stores data)
      const storedUser = localStorage.getItem('touchgrass_user');
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log('Loaded user:', user);
        return user;
      }
      
      // If no stored user but authenticated, create from auth
      if (auth.isAuthenticated && auth.user) {
        const newUser = {
          id: auth.user.id || Date.now().toString(),
          username: auth.user.username,
          displayName: auth.user.displayName || auth.user.username,
          email: auth.user.email || `${auth.user.username}@example.com`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.user.username}`,
          location: { city: 'Online', country: 'Internet' },
          bio: `Building daily discipline through outdoor accountability.`,
          // createdAt: new Date().toISOString(),
          // lastActive: new Date().toISOString()
        };
        console.log('Created new user:', newUser);
        localStorage.setItem('touchgrass_user', JSON.stringify(newUser));
        return newUser;
      }
      
      return null;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  };

  // Load streak data
  const loadStreakData = (username) => {
    try {
      const streakKey = `touchgrass_streak_${username}`;
      const storedStreak = localStorage.getItem(streakKey);
      
      if (storedStreak) {
        const streak = JSON.parse(storedStreak);
        console.log('Loaded streak:', streak);
        return streak;
      }
      
      // Initialize new user streak
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

  // Save streak data
  const saveStreakData = (username, streakData) => {
    try {
      const streakKey = `touchgrass_streak_${username}`;
      localStorage.setItem(streakKey, JSON.stringify(streakData));
      console.log('Saved streak:', streakData);
    } catch (error) {
      console.error('Error saving streak data:', error);
    }
  };

  // Check if user verified today
  const checkTodayVerified = (streakData) => {
    if (!streakData || !streakData.history || streakData.history.length === 0) {
      return false;
    }
    
    const today = new Date().toDateString();
    const lastEntry = streakData.history[streakData.history.length - 1];
    const lastDate = new Date(lastEntry.date).toDateString();
    
    return today === lastDate && lastEntry.verified === true;
  };

  // Calculate time until next verification
  const calculateTimeLeft = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    
    const diffMs = midnight - now;
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Initialize dashboard data
  const initializeDashboard = async () => {
    setIsLoading(true);
    
    try {
      const user = loadUserData();
      if (!user) {
        toast.error('Please login to access your dashboard');
        navigate('/auth');
        return;
      }
      
      const streakData = loadStreakData(user.username);
      
      // Update todayVerified status
      streakData.todayVerified = checkTodayVerified(streakData);
      
      // Calculate days since join
      const joinDate = new Date(user.createdAt);
      const now = new Date();
      const daysSinceJoin = Math.max(1, Math.floor((now - joinDate) / (1000 * 60 * 60 * 24)));
      
      // Calculate consistency
      const consistency = streakData.totalDays > 0 
        ? Math.min(100, Math.round((streakData.totalDays / daysSinceJoin) * 100))
        : 0;
      
      // Prepare stats
      const calculatedStats = [
        { 
          label: 'Current Streak', 
          value: streakData.currentStreak, 
          change: streakData.currentStreak > 0 ? '+1' : '0', 
          icon: <Flame />, 
          color: '#ef4444',
          description: 'Consecutive verified days'
        },
        { 
          label: 'Consistency', 
          value: `${consistency}%`,
          change: streakData.totalDays > 0 ? '+3%' : '0%', 
          icon: <Target />, 
          color: '#22c55e',
          description: 'Verification rate'
        },
        { 
          label: 'Global Rank', 
          value: streakData.currentStreak > 0 ? `#${Math.ceil(Math.random() * 1000)}` : 'N/A', 
          change: streakData.currentStreak > 0 ? '↑5' : '0', 
          icon: <Trophy />, 
          color: '#fbbf24',
          description: 'Worldwide position'
        },
        { 
          label: 'Total Days', 
          value: streakData.totalDays, 
          change: streakData.totalDays > 0 ? '+1' : '0', 
          icon: <Calendar />, 
          color: '#3b82f6',
          description: 'All-time verifications'
        },
        { 
          label: 'Avg. Time', 
          value: streakData.totalDays > 0 ? `${Math.round(streakData.totalOutdoorTime / streakData.totalDays)}m` : '0m', 
          change: streakData.totalDays > 0 ? '-5m' : '0m', 
          icon: <Clock />, 
          color: '#8b5cf6',
          description: 'Daily average'
        },
        { 
          label: 'Social Score', 
          value: streakData.viralScore, 
          change: streakData.shareCount > 0 ? '+8' : '0', 
          icon: <Share2 />, 
          color: '#ec4899',
          description: 'Social influence'
        },
      ];
      
      // Prepare activities
      const recentActivities = [];

      if (streakData?.todayVerified) {
        recentActivities.push({
          time: 'Just now',
          action: 'Verified today',
          streak: '+1',
          verified: true,
          buttonProps: {
            onClick: () => navigate('/verify'),
            label: 'View Details'
          }
        });
      }
      
      if (streakData.history && streakData.history.length > 0) {
        // Add last few verifications
        const recentHistory = streakData.history.slice(-3).reverse();
        recentHistory.forEach((entry, index) => {
          if (index === 0 && streakData.todayVerified) return; // Skip if already added
          
          const entryDate = new Date(entry.date);
          const timeDiff = Math.floor((now - entryDate) / (1000 * 60 * 60));
          const timeText = timeDiff < 1 ? 'Just now' : 
                          timeDiff < 24 ? `${timeDiff}h ago` : 
                          `${Math.floor(timeDiff / 24)}d ago`;
          
          recentActivities.push({
            time: timeText,
            action: 'Verified day',
            streak: '+1',
            verified: true,
            buttonProps: {
              onClick: () => navigate('/verify'),
              label: 'View Details'
            }
          });
        });
      }
    
      if (streakData.shareCount > 0) {
        recentActivities.push({
          time: '4 hours ago',
          action: 'Shared on LinkedIn',
          shares: `+${Math.min(streakData.shareCount, 24)}`,
          icon: <Linkedin />
        });
      }
      
      if (streakData.challengeWins > 0) {
        recentActivities.push({
          time: 'Yesterday',
          action: 'Weekly challenge completed',
          reward: '🏆'
        });
      }
      
      // Prepare social stats
      const socialPlatforms = [];
      if (streakData.shareCount > 0) {
        socialPlatforms.push(
          { platform: 'Twitter', shares: Math.min(streakData.shareCount, 24), engagement: '1.2K', color: '#1DA1F2' },
          { platform: 'LinkedIn', shares: Math.min(streakData.shareCount, 18), engagement: '420', color: '#0077B5' },
          { platform: 'Facebook', shares: Math.min(streakData.shareCount, 12), engagement: '780', color: '#1877F2' },
          { platform: 'Instagram', shares: Math.min(streakData.shareCount, 8), engagement: '320', color: '#E4405F' }
        );
      }
      
      // Prepare challenges
      const userChallenges = [];
      if (streakData.currentStreak >= 7) {
        userChallenges.push(
          { name: '7-Day Sprint', progress: Math.min(100, Math.round((streakData.currentStreak / 7) * 100)), participants: 42, prize: 'Premium Badge' }
        );
      }
      if (streakData.totalDays >= 30) {
        userChallenges.push(
          { name: 'Monthly Warrior', progress: Math.min(100, Math.round((streakData.totalDays / 30) * 100)), participants: 128, prize: 'Gold Trophy' }
        );
      }
      if (streakData.shareCount >= 10) {
        userChallenges.push(
          { name: 'Social Butterfly', progress: Math.min(100, Math.round((streakData.shareCount / 10) * 100)), participants: 89, prize: 'Viral Badge' }
        );
      }
      
      // Prepare achievements
      const userAchievements = [];
      if (streakData.currentStreak >= 7) {
        userAchievements.push(
          { name: 'Weekly Warrior', icon: '🔥', earned: 'Today', description: '7 consecutive days' }
        );
      }
      if (streakData.shareCount >= 10) {
        userAchievements.push(
          { name: 'Social Butterfly', icon: '🦋', earned: '2 days ago', description: '10+ shares' }
        );
      }
      if (streakData.shareCount >= 5) {
        userAchievements.push(
          { name: 'LinkedIn Influencer', icon: '💼', earned: '1 week ago', description: 'Top 10% shares' }
        );
      }
      if (streakData.viralScore >= 50) {
        userAchievements.push(
          { name: 'Twitter Trendsetter', icon: '🐦', earned: '2 weeks ago', description: '500+ impressions' }
        );
      }
      if (streakData.currentStreak >= 30) {
        userAchievements.push(
          { name: 'Monthly Master', icon: '🌟', earned: 'This month', description: '30-day streak' }
        );
      }
      if (streakData.totalDays >= 100) {
        userAchievements.push(
          { name: 'Century Club', icon: '💯', earned: 'Achieved', description: '100 total days' }
        );
      }
      
      setStats(calculatedStats);
      setActivities(recentActivities);
      setSocialStats(socialPlatforms);
      setChallenges(userChallenges);
      setAchievements(userAchievements);
      setUserData({ user, streakData });
      
      console.log('Dashboard initialized:', { user, streakData });
      
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to verify page instead of local verification
  const handleVerifyToday = () => {
    navigate('/verify');
  };

  // Share to platform
  const handleShareToPlatform = (platform) => {
    if (!userData) return;
    
    const { user, streakData } = userData;
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/profile/${user.username}`;
    
    const shareTexts = {
      twitter: `🔥 Day ${streakData.currentStreak} of my #TouchGrass streak! Building discipline one day at a time. Join me: ${shareUrl} #Accountability #Streak #MentalHealth`,
      linkedin: `${user.displayName} has maintained a ${streakData.currentStreak}-day outdoor streak on TouchGrass.now\n\nBuilding professional discipline through daily habits. Check it out: ${shareUrl}\n\n#ProfessionalGrowth #Wellness #Discipline`,
      facebook: `I've touched grass for ${streakData.currentStreak} days in a row! Join me in building better habits: ${shareUrl}`,
      instagram: `Day ${streakData.currentStreak} of my #TouchGrass journey 🌱\n\nBuilding real-world discipline one day at a time.\n\nJoin me: ${shareUrl}\n\n#Streak #Accountability #MentalHealth #Outdoor`,
      whatsapp: `Check out my ${streakData.currentStreak}-day TouchGrass streak! ${shareUrl}`
    };

    const shareConfigs = {
      twitter: {
        url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTexts.twitter)}&url=${encodeURIComponent(shareUrl)}`,
        name: 'Twitter/X'
      },
      linkedin: {
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        name: 'LinkedIn'
      },
      facebook: {
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTexts.facebook)}`,
        name: 'Facebook'
      },
      whatsapp: {
        url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTexts.whatsapp)}`,
        name: 'WhatsApp'
      }
    };

    const config = shareConfigs[platform];
    if (!config) {
      if (platform === 'instagram') {
        toast('📸 For Instagram: Take a screenshot of your achievement and share it as a story!', {
          icon: '📸',
          duration: 4000
        });
        return;
      }
      return;
    }

    // Update share count
    const updatedStreak = {
      ...streakData,
      shareCount: streakData.shareCount + 1,
      viralScore: streakData.viralScore + Math.floor(Math.random() * 10) + 1
    };
    
    saveStreakData(user.username, updatedStreak);
    setUserData({ user, streakData: updatedStreak });
    
    // Open share window
    window.open(config.url, '_blank', 'width=600,height=400');
    
    toast.success(`Shared to ${config.name}! Social score +${updatedStreak.viralScore - streakData.viralScore}`, {
      icon: '🚀'
    });
  };

  // Share options
  const shareOptions = [
    // { 
    //   platform: 'twitter', 
    //   name: 'Twitter/X', 
    //   icon: <Twitter />, 
    //   color: '#1DA1F2',
    //   description: 'Share with tech community',
    //   badge: userData?.streakData.shareCount > 10 ? 'Most Viral' : null
    // },
    // { 
    //   platform: 'linkedin', 
    //   name: 'LinkedIn', 
    //   icon: <Linkedin />, 
    //   color: '#0077B5',
    //   description: 'Professional network',
    //   badge: userData?.streakData.shareCount > 5 ? 'High Impact' : null
    // },
    // { 
    //   platform: 'facebook', 
    //   name: 'Facebook', 
    //   icon: <Facebook />, 
    //   color: '#1877F2',
    //   description: 'Friends & family',
    //   badge: null
    // },
    // { 
    //   platform: 'instagram', 
    //   name: 'Instagram', 
    //   icon: <Instagram />, 
    //   color: '#E4405F',
    //   description: 'Visual storytelling',
    //   badge: userData?.streakData.shareCount > 3 ? 'Engaging' : null
    // },
    // { 
    //   platform: 'whatsapp', 
    //   name: 'WhatsApp', 
    //   icon: <MessageSquare />, 
    //   color: '#25D366',
    //   description: 'Direct messages',
    //   badge: null
    // },
  ];

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('touchgrass_token');
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  // Calculate next milestone
  const getNextMilestone = () => {
    if (!userData) return { target: 7, daysLeft: 7 };
    
    const { currentStreak } = userData.streakData;
    
    if (currentStreak < 7) return { target: 7, daysLeft: 7 - currentStreak };
    if (currentStreak < 30) return { target: 30, daysLeft: 30 - currentStreak };
    if (currentStreak < 100) return { target: 100, daysLeft: 100 - currentStreak };
    return { target: 365, daysLeft: 365 - currentStreak };
  };

  useEffect(() => {
    initializeDashboard();
    
    // Update time left every second
    const timeInterval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      if (userData) {
        initializeDashboard();
      }
    }, 30000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(refreshInterval);
    };
  }, []);

  const dashboardStyles = `
    .dashboard-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      padding: 20px;
      position: relative;
      overflow-x: hidden;
    }
    
    .dashboard-background {
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(circle at 10% 20%, rgba(34, 197, 94, 0.15) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
        radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 60%);
      animation: backgroundPulse 20s ease-in-out infinite;
    }
    
    @keyframes backgroundPulse {
      0%, 100% { 
        transform: scale(1);
        opacity: 0.3;
      }
      50% { 
        transform: scale(1.05);
        opacity: 0.4;
      }
    }
    
    .dashboard-header {
      max-width: 1400px;
      margin: 0 auto 40px;
      position: relative;
      z-index: 2;
    }
    
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .welcome-section h1 {
      font-size: 36px;
      font-weight: 700;
      margin: 0 0 8px;
      background: linear-gradient(135deg, #22c55e, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: textGlow 3s ease-in-out infinite;
    }
    
    @keyframes textGlow {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }
    
    .welcome-section p {
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      font-size: 16px;
    }
    
    /* Social Stats */
    .social-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin: 32px 0;
    }
    
    .social-stat-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .social-stat-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, var(--platform-color) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .social-stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
    }
    
    .social-stat-card:hover::before {
      opacity: 0.05;
    }
    
    .social-stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      position: relative;
      z-index: 2;
    }
    
    .social-stat-details {
      flex: 1;
      position: relative;
      z-index: 2;
    }
    
    .social-stat-platform {
      font-weight: 600;
      margin: 0 0 4px;
      font-size: 14px;
    }
    
    .social-stat-numbers {
      display: flex;
      gap: 12px;
    }
    
    .social-stat-number {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
    }
    
    .social-stat-number strong {
      font-size: 16px;
      color: white;
      margin-right: 4px;
    }
    
    /* Share Spotlight */
    .share-spotlight {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
      border: 1px solid rgba(139, 92, 246, 0.2);
      border-radius: 20px;
      padding: 32px;
      margin: 32px 0;
      position: relative;
      overflow: hidden;
    }
    
    .share-spotlight::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.05), transparent);
      animation: spotlightShine 4s infinite;
    }
    
    @keyframes spotlightShine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    .share-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      z-index: 2;
    }
    
    .share-info h3 {
      font-size: 24px;
      margin: 0 0 12px;
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .share-info p {
      color: rgba(255, 255, 255, 0.7);
      margin: 0 0 20px;
      max-width: 400px;
    }
    
    .share-stats {
      display: flex;
      gap: 24px;
    }
    
    .share-stat {
      text-align: center;
    }
    
    .share-stat-value {
      font-size: 32px;
      font-weight: 700;
      color: white;
      margin: 0 0 4px;
    }
    
    .share-stat-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    /* Quick Share Options */
    .quick-share-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
      margin: 24px 0;
    }
    
    .quick-share-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }
    
    .quick-share-button:hover {
      transform: translateY(-4px);
      border-color: var(--platform-color);
      background: var(--platform-bg);
    }
    
    .share-button-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin-bottom: 12px;
    }
    
    .share-button-label {
      font-size: 12px;
      font-weight: 500;
      text-align: center;
    }
    
    .share-button-badge {
      position: absolute;
      top: -6px;
      right: -6px;
      background: linear-gradient(135deg, #fbbf24, #d97706);
      color: #1e293b;
      font-size: 10px;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 10px;
    }
    
    /* Enhanced Streak Spotlight */
    .streak-spotlight {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1));
      border-radius: 24px;
      padding: 32px;
      margin-bottom: 40px;
      position: relative;
      overflow: hidden;
    }
    
    .streak-spotlight::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.05), transparent);
      animation: shine 3s infinite;
    }
    
    @keyframes shine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    .streak-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      z-index: 2;
      gap: 32px;
    }
    
    .streak-main {
      display: flex;
      align-items: center;
      gap: 32px;
      flex: 1;
    }
    
    .streak-number {
      font-size: 72px;
      font-weight: 800;
      background: linear-gradient(135deg, #22c55e, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
      text-shadow: 0 0 30px rgba(34, 197, 94, 0.3);
    }
    
    .streak-info h3 {
      font-size: 24px;
      margin: 0 0 8px;
      color: white;
    }
    
    .streak-info p {
      color: rgba(255, 255, 255, 0.7);
      margin: 0 0 16px;
      max-width: 400px;
    }
    
    .streak-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    /* Stats grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .stat-item {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 24px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .stat-item::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, var(--stat-color) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .stat-item:hover {
      transform: translateY(-4px);
      border-color: rgba(34, 197, 94, 0.3);
      background: rgba(255, 255, 255, 0.08);
    }
    
    .stat-item:hover::before {
      opacity: 0.05;
    }
    
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      font-size: 20px;
      position: relative;
      z-index: 2;
      transition: all 0.3s ease;
    }
    
    .stat-item:hover .stat-icon {
      transform: scale(1.1);
    }
    
    .stat-value {
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 4px;
      position: relative;
      z-index: 2;
    }
    
    .stat-label {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      margin: 0 0 8px;
      position: relative;
      z-index: 2;
    }
    
    .stat-description {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
      margin: 8px 0 0;
      position: relative;
      z-index: 2;
    }
    
    .stat-change {
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
      position: relative;
      z-index: 2;
    }
    
    .change-positive {
      color: #22c55e;
    }
    
    .change-negative {
      color: #ef4444;
    }
    
    /* Dashboard layout */
    .dashboard-layout {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 32px;
      max-width: 1400px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }
    
    .main-content {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
    
    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
    
    /* Tabs */
    .dashboard-tabs {
      display: flex;
      gap: 8px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 4px;
      margin-bottom: 24px;
    }
    
    .tab {
      flex: 1;
      padding: 12px 20px;
      border: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .tab:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }
    
    .tab.active {
      color: white;
      background: rgba(34, 197, 94, 0.2);
      border: 1px solid rgba(34, 197, 94, 0.3);
    }
    
    /* Activity feed */
    .activity-feed {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      overflow: hidden;
    }
    
    .feed-header {
      padding: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .feed-header h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .feed-content {
      padding: 0;
    }
    
    .activity-item {
      display: flex;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.3s ease;
    }
    
    .activity-item:hover {
      background: rgba(255, 255, 255, 0.02);
    }
    
    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      font-size: 18px;
    }
    
    .activity-details {
      flex: 1;
    }
    
    .activity-action {
      font-weight: 500;
      margin: 0 0 4px;
      color: white;
    }
    
    .activity-time {
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
      margin: 0;
    }
    
    .activity-meta {
      padding: 6px 12px;
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.2);
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      min-width: 60px;
      text-align: center;
      color: #22c55e;
    }
    
    /* Social Media Activity */
    .social-activity {
      padding: 6px 12px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 80px;
      justify-content: center;
    }
    
    .social-twitter {
      background: rgba(29, 161, 242, 0.1);
      border: 1px solid rgba(29, 161, 242, 0.2);
      color: #1DA1F2;
    }
    
    .social-linkedin {
      background: rgba(0, 119, 181, 0.1);
      border: 1px solid rgba(0, 119, 181, 0.2);
      color: #0077B5;
    }
    
    .social-facebook {
      background: rgba(24, 119, 242, 0.1);
      border: 1px solid rgba(24, 119, 242, 0.2);
      color: #1877F2;
    }
    
    /* Challenges */
    .challenges-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .challenge-item {
      display: flex;
      align-items: center;
      padding: 20px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      transition: all 0.3s ease;
    }
    
    .challenge-item:hover {
      transform: translateY(-2px);
      border-color: rgba(59, 130, 246, 0.3);
      background: rgba(59, 130, 246, 0.05);
    }
    
    .challenge-progress {
      flex: 1;
      margin: 0 20px;
    }
    
    .progress-bar {
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #22c55e, #3b82f6);
      border-radius: 4px;
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
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
    }
    
    /* Achievements */
    .achievements-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    
    .achievement-item {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 20px;
      text-align: center;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .achievement-item:hover {
      transform: translateY(-2px);
      border-color: rgba(251, 191, 36, 0.3);
      background: rgba(251, 191, 36, 0.05);
    }
    
    .achievement-icon {
      font-size: 32px;
      margin-bottom: 12px;
      display: block;
    }
    
    .achievement-name {
      font-weight: 600;
      margin: 0 0 8px;
      font-size: 14px;
      color: white;
    }
    
    .achievement-earned {
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
      margin: 0 0 4px;
    }
    
    .achievement-description {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.4);
      margin: 8px 0 0;
    }
    
    /* Quick actions */
    .quick-actions {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    
    .quick-action {
      padding: 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .quick-action:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
    
    .action-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
    
    .action-label {
      font-size: 12px;
      font-weight: 500;
      text-align: center;
      color: rgba(255, 255, 255, 0.9);
    }
    
    /* Button Styles */
    .dashboard-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      outline: none;
      position: relative;
      overflow: hidden;
    }
    
    .dashboard-button::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transform: translateX(-100%);
      transition: transform 0.6s ease;
    }
    
    .dashboard-button:hover::before {
      transform: translateX(100%);
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: white;
    }
    
    .btn-primary:hover {
      background: linear-gradient(135deg, #16a34a, #15803d);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
    }
    
    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
    }
    
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }
    
    .btn-ghost {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.7);
    }
    
    .btn-ghost:hover {
      background: rgba(255, 255, 255, 0.05);
      color: white;
    }
    
    .btn-premium {
      background: linear-gradient(135deg, #fbbf24, #d97706);
      color: #1e293b;
      font-weight: 700;
    }
    
    .btn-premium:hover {
      background: linear-gradient(135deg, #d97706, #b45309);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(251, 191, 36, 0.3);
    }
    
    /* Confetti */
    @keyframes confetti-fall {
      0% {
        transform: translateY(-100vh) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
    
    /* Time Left Counter */
    .time-left-counter {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      background: rgba(0, 0, 0, 0.2);
      padding: 8px 16px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .time-left-digit {
      background: rgba(255, 255, 255, 0.1);
      padding: 4px 8px;
      border-radius: 6px;
      min-width: 30px;
      text-align: center;
      font-weight: 600;
    }
    
    /* Empty States */
    .empty-state {
      padding: 60px 40px;
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
    }
    
    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
      opacity: 0.5;
    }
    
    .empty-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 10px;
      color: rgba(255, 255, 255, 0.8);
    }
    
    .empty-description {
      font-size: 14px;
      max-width: 400px;
      margin: 0 auto;
      line-height: 1.5;
    }
    
    /* Loading States */
    .loading-skeleton {
      background: linear-gradient(90deg, 
        rgba(255, 255, 255, 0.05) 25%, 
        rgba(255, 255, 255, 0.1) 50%, 
        rgba(255, 255, 255, 0.05) 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 8px;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    /* Responsive */
    @media (max-width: 1024px) {
      .dashboard-layout {
        grid-template-columns: 1fr;
      }
      
      .streak-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 24px;
      }
      
      .share-content {
        flex-direction: column;
        gap: 24px;
        text-align: center;
      }
      
      .share-stats {
        justify-content: center;
      }
    }
    
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .social-stats-grid {
        grid-template-columns: 1fr;
      }
      
      .quick-share-options {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .achievements-grid {
        grid-template-columns: 1fr;
      }
      
      .quick-actions {
        grid-template-columns: repeat(4, 1fr);
      }
      
      .header-top {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }
      
      .header-actions {
        width: 100%;
        justify-content: center;
      }
    }
    
    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .quick-share-options {
        grid-template-columns: 1fr;
      }
      
      .quick-actions {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .streak-number {
        font-size: 48px;
      }
      
      .streak-actions {
        flex-direction: column;
        width: 100%;
      }
      
      .streak-actions .dashboard-button {
        width: 100%;
        justify-content: center;
      }
    }
  `;

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <style>{dashboardStyles}</style>
        <div className="dashboard-background" />
        <div className="dashboard-header">
          <div className="header-top">
            <div className="welcome-section">
              <div className="loading-skeleton" style={{ width: '300px', height: '48px', marginBottom: '8px' }}></div>
              <div className="loading-skeleton" style={{ width: '400px', height: '24px' }}></div>
            </div>
          </div>
          
          <div className="loading-skeleton" style={{ height: '200px', borderRadius: '24px', marginBottom: '40px' }}></div>
          
          <div className="stats-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="loading-skeleton" style={{ height: '150px', borderRadius: '16px' }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const streakData = userData?.streakData;
  const user = userData?.user;
  const nextMilestone = getNextMilestone();

  return (
    <div className="dashboard-container">
      <style>{dashboardStyles}</style>
      <div className="dashboard-background" />
      
      {showAchievement && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#fbbf24'][Math.floor(Math.random() * 5)],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `confetti-fall ${Math.random() * 2 + 1}s linear forwards`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="dashboard-header">
        <div className="header-top">
          <div className="welcome-section">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Welcome back, {user?.displayName || 'Grass Toucher'}!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {streakData.currentStreak > 0 
                ? `Your discipline journey continues. Today is day ${streakData.currentStreak}.`
                : 'Start your discipline journey today! Verify your first day to begin your streak.'}
            </motion.p>
          </div>
          
          <div className="header-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="time-left-counter">
              <Clock size={14} />
              <span>Next reset:</span>
              <div className="time-left-digit">{timeLeft || '23:59:59'}</div>
            </div>
            
            <button
              className="dashboard-button btn-ghost"
              onClick={() => navigate('/settings')}
            >
              <Bell size={16} />
              Notifications
            </button>
            <button
              className="dashboard-button btn-secondary"
              onClick={() => navigate('/settings')}
            >
              <Settings size={16} />
              Settings
            </button>
            {/* <button
              className="dashboard-button btn-ghost"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </button> */}
          </div>
        </div>

        {/* Streak Spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="streak-spotlight"
        >
          <div className="streak-content">
            <div className="streak-main">
              <div className="streak-number">{streakData.currentStreak}</div>
              <div className="streak-info">
                <h3>Day {streakData.currentStreak} of Your Streak</h3>
                <p>
                  {streakData.currentStreak > 0 
                    ? `You're on track to beat your longest streak of ${streakData.longestStreak} days. 
                       ${streakData.todayVerified ? '✅ Today is verified!' : '⏳ Verify today to continue.'}`
                    : 'Start your streak today! Verify your first day to begin building discipline.'}
                </p>
                <div className="streak-actions">
                  <button
                    className={`dashboard-button ${streakData.todayVerified ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={handleVerifyToday}
                    disabled={streakData.todayVerified}
                  >
                    {streakData.todayVerified ? (
                      <>
                        <CheckCircle size={16} />
                        Verified Today
                      </>
                    ) : (
                      <>
                        <Camera size={16} />
                        Verify Now
                      </>
                    )}
                  </button>
                  <button
                    className="dashboard-button btn-secondary"
                    onClick={() => setShowSocialShareModal(true)}
                    disabled={streakData.currentStreak === 0}
                  >
                    <Share2 size={16} />
                    Share Achievement
                  </button>
                  <button
                    className="dashboard-button btn-ghost"
                    onClick={() => navigate('/profile')}
                  >
                    <Download size={16} />
                    View Profile
                  </button>
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', minWidth: '140px' }}>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '8px' }}>
                Next Milestone
              </div>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '700',
                background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Day {nextMilestone.target}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                {nextMilestone.daysLeft} {nextMilestone.daysLeft === 1 ? 'day' : 'days'} to go
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Share Options */}
        {streakData.currentStreak > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="quick-share-options"
          >
            {shareOptions.map((platform) => (
              <button
                key={platform.platform}
                className="quick-share-button"
                onClick={() => handleShareToPlatform(platform.platform)}
                style={{
                  '--platform-color': platform.color,
                  '--platform-bg': `${platform.color}10`
                }}
              >
                <div 
                  className="share-button-icon"
                  style={{
                    background: `${platform.color}20`,
                    border: `1px solid ${platform.color}40`,
                    color: platform.color
                  }}
                >
                  {platform.icon}
                </div>
                <div className="share-button-label">{platform.name}</div>
                {platform.badge && (
                  <div className="share-button-badge">{platform.badge}</div>
                )}
              </button>
            ))}
          </motion.div>
        )}

        {/* Share Performance Spotlight */}
        {streakData.shareCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="share-spotlight"
          >
            <div className="share-content">
              <div className="share-info">
                <h3>Your Social Impact</h3>
                <p>
                  Your achievements have reached thousands! Keep sharing to inspire more people 
                  and climb the social leaderboard.
                </p>
              </div>
              <div className="share-stats">
                <div className="share-stat">
                  <div className="share-stat-value">{streakData.shareCount}</div>
                  <div className="share-stat-label">Total Shares</div>
                </div>
                <div className="share-stat">
                  <div className="share-stat-value">{streakData.viralScore}</div>
                  <div className="share-stat-label">Viral Score</div>
                </div>
                <div className="share-stat">
                  <div className="share-stat-value">#{Math.ceil(Math.random() * 1000)}</div>
                  <div className="share-stat-label">Social Rank</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Social Stats Grid */}
        {socialStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="social-stats-grid"
          >
            {socialStats.map((stat, index) => (
              <motion.div
                key={index}
                className="social-stat-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  '--platform-color': stat.color
                }}
              >
                <div 
                  className="social-stat-icon"
                  style={{
                    background: `${stat.color}20`,
                    color: stat.color,
                    border: `1px solid ${stat.color}40`
                  }}
                >
                  {stat.platform === 'Twitter' ? <Twitter /> :
                   stat.platform === 'LinkedIn' ? <Linkedin /> :
                   stat.platform === 'Facebook' ? <Facebook /> :
                   <Instagram />}
                </div>
                <div className="social-stat-details">
                  <div className="social-stat-platform">{stat.platform}</div>
                  <div className="social-stat-numbers">
                    <div className="social-stat-number">
                      <strong>{stat.shares}</strong> shares
                    </div>
                    <div className="social-stat-number">
                      <strong>{stat.engagement}</strong> reach
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="stats-grid"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                '--stat-color': stat.color
              }}
            >
              <div 
                className="stat-icon"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}40)`,
                  color: stat.color,
                  border: `1px solid ${stat.color}30`
                }}
              >
                {stat.icon}
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-description">{stat.description}</div>
              <div className={`stat-change ${stat.change.startsWith('+') || stat.change.startsWith('↑') ? 'change-positive' : 'change-negative'}`}>
                {stat.change.startsWith('+') || stat.change.startsWith('↑') ? '↗' : '↘'} {stat.change}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Social Share Modal */}
      {showSocialShareModal && streakData.currentStreak > 0 && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            borderRadius: '28px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            animation: 'fadeIn 0.5s ease'
          }}>
            <button 
              onClick={() => setShowSocialShareModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                fontSize: '18px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              ✕
            </button>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '36px'
              }}>
                🏆
              </div>
              <h2 style={{ 
                margin: '0 0 8px', 
                fontSize: '28px',
                background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Share Your Achievement
              </h2>
              <p style={{ 
                margin: 0, 
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '16px'
              }}>
                Day {streakData.currentStreak} • {Math.min(100, Math.round((streakData.totalDays / Math.max(1, Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)))) * 100))}% Consistency
              </p>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              marginBottom: '32px'
            }}>
              {[
                { platform: 'twitter', name: 'Twitter/X', icon: <Twitter />, color: '#1DA1F2' },
                { platform: 'linkedin', name: 'LinkedIn', icon: <Linkedin />, color: '#0077B5' },
                { platform: 'facebook', name: 'Facebook', icon: <Facebook />, color: '#1877F2' },
                { platform: 'instagram', name: 'Instagram', icon: <Instagram />, color: '#E4405F' },
                { platform: 'whatsapp', name: 'WhatsApp', icon: <MessageSquare />, color: '#25D366' },
                { platform: 'copy', name: 'Copy Link', icon: '📋', color: '#8B5CF6' },
              ].map((platform) => (
                <button
                  key={platform.platform}
                  onClick={() => {
                    if (platform.platform === 'copy') {
                      navigator.clipboard.writeText(`${window.location.origin}/profile/${user.username}`);
                      toast.success('✅ Link copied to clipboard!');
                      setShowSocialShareModal(false);
                    } else {
                      handleShareToPlatform(platform.platform);
                      setShowSocialShareModal(false);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${platform.color}20`;
                    e.currentTarget.style.borderColor = `${platform.color}40`;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ 
                    width: '52px', 
                    height: '52px',
                    background: `${platform.color}20`,
                    border: `1px solid ${platform.color}40`,
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    {platform.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>
                      {platform.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                      {platform.platform === 'copy' ? 'Copy to clipboard' : 'Share to ' + platform.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div style={{ 
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <div style={{ 
                  width: '24px', 
                  height: '24px',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}>
                  💡
                </div>
                <div style={{ fontWeight: '700', fontSize: '16px' }}>Sharing Increases Your Social Score!</div>
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                Each share helps build the TouchGrass community and moves you up the social leaderboard. 
                You're currently ranked <strong>#{Math.ceil(Math.random() * 1000)}</strong> globally!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Content */}
      <div className="dashboard-layout">
        <div className="main-content">
          {/* Tabs */}
          <div className="dashboard-tabs">
            <button 
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Activity size={16} />
              Overview
            </button>
            {/* <button 
              className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 size={16} />
             
            </button> */}
            {/* <button 
              className={`tab ${activeTab === 'social' ? 'active' : ''}`}
              onClick={() => setActiveTab('social')}
            >
              <Share2 size={16} />
              Social
            </button> */}
          </div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="activity-feed"
          >
            <div className="feed-header">
              <h3>
                <Activity size={20} />
                Recent Activity
              </h3>
              <button 
                className="dashboard-button btn-ghost"
                onClick={() => navigate('/profile')}
              >
                View All
              </button>
            </div>
            <div className="feed-content">
              {activities.length > 0 ? (
                activities.map((activity, index) => (
                  <motion.div
                    key={index}
                    className="activity-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div 
                      className="activity-icon"
                      style={{
                        background: activity.verified 
                          ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(21, 128, 61, 0.2))'
                          : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))',
                        color: activity.verified ? '#22c55e' : '#3b82f6'
                      }}
                    >
                      {activity.icon || (activity.verified ? '✓' : '↑')}
                    </div>
                    <div className="activity-details">
                      <div className="activity-action">{activity.action}</div>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                    {activity.icon ? (
                      <div className={`social-activity ${activity.icon.type === Twitter ? 'social-twitter' : 
                                      activity.icon.type === Linkedin ? 'social-linkedin' : 'social-facebook'}`}>
                        {activity.icon}
                        <span>{activity.shares || activity.impressions || activity.engagement}</span>
                      </div>
                    ) : (
                      <div className="activity-meta">
                        {activity.streak || activity.reward || activity.friends}
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🌱</div>
                  <div className="empty-title">No activity yet</div>
                  <div className="empty-description">
                    Start your journey! Verify your first day to see activity here.
                  </div>
                  <button 
                    className="dashboard-button btn-primary"
                    onClick={handleVerifyToday}
                    style={{ marginTop: '20px' }}
                  >
                    <Camera size={16} />
                    Verify First Day
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Active Challenges */}
          {challenges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="activity-feed">
                <div className="feed-header">
                  <h3>
                    <TargetIcon2 size={20} />
                    Active Challenges
                  </h3>
                  <button 
                    className="dashboard-button btn-ghost"
                    onClick={() => navigate('/challenges')}
                  >
                    Join More
                  </button>
                </div>
                <div className="challenges-list">
                  {challenges.map((challenge, index) => (
                    <motion.div
                      key={index}
                      className="challenge-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', marginBottom: '4px' }}>🏆</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>{challenge.prize}</div>
                      </div>
                      
                      <div className="challenge-progress">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontWeight: '600' }}>{challenge.name}</span>
                          <span style={{ color: '#22c55e', fontWeight: '600' }}>{challenge.progress}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${challenge.progress}%` }}
                          />
                        </div>
                        <div className="challenge-meta">
                          <span>{challenge.participants} participants</span>
                          <span>{100 - challenge.progress}% to go</span>
                        </div>
                      </div>
                      
                      <button className="dashboard-button btn-ghost">
                        View
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="activity-feed"
          >
            <div className="feed-header">
              <h3>
                <Compass size={20} />
                Quick Actions
              </h3>
            </div>
            <div className="quick-actions">
              {[
                { icon: '🌱', label: 'Verify Today', color: '#22c55e', action: handleVerifyToday },
                { icon: '📊', label: 'Leaderboard', color: '#3b82f6', action: () => navigate('/leaderboard') },
                { icon: '💬', label: 'Chat', color: '#8b5cf6', action: () => navigate('/chat') },
                { icon: '🎯', label: 'Challenge', color: '#ec4899', action: () => navigate('/challenges') },
                { icon: '📈', label: 'Analytics', color: '#84cc16', action: () => setActiveTab('/profile') },
                { icon: '👥', label: 'Friends', color: '#06b6d4', action: () => navigate('/chat') },
                { icon: '📲', label: 'Share', color: '#fbbf24', action: () => setShowSocialShareModal(true) },
                { icon: '⚙️', label: 'Settings', color: '#71717a', action: () => navigate('/settings') },
              ].map((action, index) => (
                <motion.div
                  key={index}
                  className="quick-action"
                  onClick={action.action}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div 
                    className="action-icon"
                    style={{
                      background: `linear-gradient(135deg, ${action.color}20, ${action.color}40)`,
                      color: action.color,
                      border: `1px solid ${action.color}30`
                    }}
                  >
                    {action.icon}
                  </div>
                  <div className="action-label">{action.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Achievements */}
          {achievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="activity-feed"
            >
              <div className="feed-header">
                <h3>
                  <AwardIcon size={20} />
                  Recent Achievements
                </h3>
                <button 
                  className="dashboard-button btn-ghost"
                  onClick={() => navigate('/profile')}
                >
                  View All
                </button>
              </div>
              <div className="achievements-grid">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    className="achievement-item"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      toast.success(`Achievement: ${achievement.name} - ${achievement.description}`, {
                        icon: '🏆'
                      });
                    }}
                  >
                    <div className="achievement-icon">{achievement.icon}</div>
                    <div className="achievement-name">{achievement.name}</div>
                    <div className="achievement-earned">{achievement.earned}</div>
                    <div className="achievement-description">{achievement.description}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Performance Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ 
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(217, 119, 6, 0.1))',
              border: '1px solid rgba(251, 191, 36, 0.2)',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>📈</div>
            <h3 style={{ margin: '0 0 12px', color: '#fbbf24' }}>Performance Insights</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 20px', fontSize: '14px' }}>
              {streakData.currentStreak > 0 
                ? `You're performing better than ${Math.floor(Math.random() * 30) + 70}% of users this week`
                : 'Start verifying to see your performance insights'}
            </p>
            <button
              className="dashboard-button btn-premium"
              onClick={() => setActiveTab('analytics')}
              style={{ width: '100%' }}
            >
              
              
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;