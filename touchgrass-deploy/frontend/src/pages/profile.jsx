

// // Profile.jsx - Uses SAME localStorage data as Dashboard
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   User, Camera, CheckCircle, XCircle, Flame, Trophy, 
//   Calendar, TrendingUp, Clock, Target, Award, Crown,
//   Users, BarChart, Activity, Share2, MapPin,
//   Edit, Check, X, ChevronRight, ArrowLeft, Settings,
//   Copy, Twitter, Linkedin, Facebook, MessageSquare, Instagram,
//   LogOut, Loader, UserPlus, CalendarDays, BarChart3,
//   Sparkles, Verified, Bell,
//   ChevronUp, ChevronDown
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
      
//       // Update streak (SAME as Dashboard)
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
//       saveStreakData(userData.username, updatedStreak);
      
//       // Update user last active
//       const updatedUser = {
//         ...userData,
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

//   // Initialize data
//   useEffect(() => {
//     loadProfileData();
//   }, []);

//   // Stats cards configuration
//   const stats = [
//     {
//       label: 'Current Streak',
//       value: streakData?.currentStreak || 0,
//       description: 'Consecutive verified days',
//       icon: <Flame className="w-8 h-8" />,
//       gradient: 'from-rose-500 via-orange-500 to-amber-500',
//       color: 'text-rose-400'
//     },
//     {
//       label: 'Consistency',
//       value: streakData?.totalDays > 0 
//         ? `${Math.min(100, Math.round((streakData?.totalDays / Math.max(1, Math.floor((new Date() - new Date(userData?.createdAt)) / (1000 * 60 * 60 * 24)))) * 100))}%`
//         : '0%',
//       description: 'Verification success rate',
//       icon: <TrendingUp className="w-8 h-8" />,
//       gradient: 'from-emerald-500 via-green-500 to-teal-500',
//       color: 'text-emerald-400'
//     },
//     {
//       label: 'Total Days',
//       value: streakData?.totalDays || 0,
//       description: 'All-time verifications',
//       icon: <CalendarDays className="w-8 h-8" />,
//       gradient: 'from-blue-500 via-cyan-500 to-sky-500',
//       color: 'text-blue-400'
//     },
//     {
//       label: 'Social Score',
//       value: streakData?.viralScore || 0,
//       description: 'Social influence',
//       icon: <Trophy className="w-8 h-8" />,
//       gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
//       color: 'text-purple-400'
//     }
//   ];

//   // Tabs configuration
//   const tabs = [
//     { id: 'overview', label: 'Overview', icon: <Activity className="w-5 h-5" /> },
//     { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
//     { id: 'achievements', label: 'Achievements', icon: <Award className="w-5 h-5" /> },
//     { id: 'social', label: 'Social', icon: <Users className="w-5 h-5" /> }
//   ];

//   // Check if today is verified
//   const today = new Date().toDateString();
//   const todayVerified = streakData?.history?.some(entry => 
//     new Date(entry.date).toDateString() === today && entry.verified
//   ) || false;

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
//         <div className="text-center">
//           <div className="relative">
//             <div className="w-24 h-24 rounded-full border-4 border-transparent animate-spin border-t-grass-500 border-r-emerald-500 border-b-blue-500 border-l-purple-500 mx-auto mb-8"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <Flame className="w-12 h-12 text-grass-500 animate-pulse" />
//             </div>
//           </div>
//           <p className="text-gray-400 text-xl font-medium mt-8">Loading profile data...</p>
//           <p className="text-gray-600 text-sm mt-2">Syncing with your dashboard</p>
//         </div>
//       </div>
//     );
//   }

//   // No user data state
//   if (!userData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-8">
//         <div className="text-center max-w-2xl">
//           <div className="relative mb-12">
//             <div className="absolute inset-0 bg-gradient-to-r from-grass-500/20 via-emerald-500/20 to-cyan-500/20 blur-3xl"></div>
//             <div className="relative">
//               <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-gray-900 to-black border-2 border-white/10 flex items-center justify-center">
//                 <UserPlus className="w-24 h-24 text-gray-600" />
//               </div>
//             </div>
//           </div>
          
//           <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
//             Profile Unavailable
//           </h1>
          
//           <p className="text-gray-400 text-xl mb-12 leading-relaxed max-w-xl mx-auto">
//             Please login to view your profile.
//           </p>
          
//           <div className="flex flex-col sm:flex-row gap-6 justify-center">
//             <button
//               onClick={() => navigate('/dashboard')}
//               className="px-12 py-5 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-2xl"
//             >
//               ← Back to Dashboard
//             </button>
//             <button
//               onClick={() => navigate('/auth')}
//               className="px-12 py-5 bg-gradient-to-r from-grass-500 to-emerald-600 hover:from-grass-600 hover:to-emerald-700 rounded-2xl font-bold text-lg shadow-2xl shadow-emerald-500/30 transition-all duration-300 hover:scale-105"
//             >
//               Sign In
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-10px); }
//         }
        
//         @keyframes glow {
//           0%, 100% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.3); }
//           50% { box-shadow: 0 0 60px rgba(34, 197, 94, 0.6); }
//         }
        
//         @keyframes shimmer {
//           0% { background-position: -1000px 0; }
//           100% { background-position: 1000px 0; }
//         }
        
//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }
        
//         .animate-glow {
//           animation: glow 3s ease-in-out infinite;
//         }
        
//         .shimmer-bg {
//           background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%);
//           background-size: 1000px 100%;
//           animation: shimmer 2s infinite linear;
//         }
        
//         .glass-morphism {
//           backdrop-filter: blur(16px);
//           -webkit-backdrop-filter: blur(16px);
//           background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//         }
        
//         .gradient-border {
//           position: relative;
//           background: linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(20, 20, 20, 0.95));
//         }
        
//         .gradient-border::before {
//           content: '';
//           position: absolute;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           border-radius: inherit;
//           padding: 1px;
//           background: linear-gradient(135deg, #22c55e, #3b82f6, #8b5cf6);
//           -webkit-mask: 
//             linear-gradient(#fff 0 0) content-box, 
//             linear-gradient(#fff 0 0);
//           -webkit-mask-composite: xor;
//           mask-composite: exclude;
//         }
        
//         .text-gradient {
//           background: linear-gradient(135deg, #22c55e 0%, #3b82f6 50%, #8b5cf6 100%);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//         }
//       `}</style>

//       {showConfetti && (
//         <Confetti
//           width={window.innerWidth}
//           height={window.innerHeight}
//           recycle={false}
//           numberOfPieces={400}
//           gravity={0.08}
//           colors={['#22c55e', '#3b82f6', '#8b5cf6', '#fbbf24', '#ef4444']}
//         />
//       )}

//       <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden">
//         {/* Background Elements */}
//         <div className="fixed inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-grass-500/5 via-emerald-500/3 to-cyan-500/5"></div>
//           {[...Array(15)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute w-1 h-1 bg-gradient-to-r from-grass-500/30 to-emerald-500/30 rounded-full animate-float"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 animationDelay: `${i * 0.2}s`
//               }}
//             />
//           ))}
//         </div>

//         <div className="relative z-10">
//           {/* Premium Header */}
//           <div className="border-b border-white/10">
//             <div className="container mx-auto px-8 py-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <button
//                     onClick={() => navigate('/dashboard')}
//                     className="p-3 glass-morphism rounded-xl hover:bg-white/5 transition-all duration-300"
//                   >
//                     <ArrowLeft className="w-5 h-5" />
//                   </button>
//                   <div>
//                     <div className="text-sm font-medium text-gray-400">TOUCHGRASS PROFILE</div>
//                     <div className="text-xl font-bold">Real Data from Dashboard</div>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center gap-4">
//                   <button
//                     onClick={() => setShowSettingsModal(true)}
//                     className="p-3 glass-morphism rounded-xl hover:bg-white/5 transition-all duration-300"
//                   >
//                     <Settings className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="container mx-auto px-8 py-12">
//             {/* Profile Hero Section */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mb-16"
//             >
//               <div className="grid lg:grid-cols-3 gap-12">
//                 {/* Left Column - Profile */}
//                 <div className="lg:col-span-2">
//                   <div className="flex flex-col lg:flex-row gap-12">
//                     {/* Avatar Section */}
//                     <div className="relative">
//                       <div className="gradient-border rounded-3xl p-2">
//                         <img
//                           src={userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`}
//                           alt={userData.displayName}
//                           className="w-64 h-64 rounded-2xl object-cover"
//                         />
//                       </div>
                      
//                       {/* Verification Badge */}
//                       <div className="absolute -bottom-4 -right-4">
//                         <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl ${
//                           todayVerified
//                             ? 'bg-gradient-to-br from-emerald-500 to-green-600 animate-glow'
//                             : 'bg-gradient-to-br from-gray-700 to-gray-800'
//                         }`}>
//                           {todayVerified ? (
//                             <Verified className="w-10 h-10 text-white" />
//                           ) : (
//                             <Clock className="w-10 h-10 text-gray-400" />
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     {/* User Info */}
//                     <div className="flex-1">
//                       <div className="mb-10">
//                         <div className="flex items-center gap-6 mb-8">
//                           <h1 className="text-6xl font-bold text-gradient">
//                             {userData.displayName}
//                           </h1>
//                           <div className="px-5 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-white/10 rounded-xl">
//                             <div className="text-sm text-gray-400">@</div>
//                             <div className="text-2xl font-bold">{userData.username}</div>
//                           </div>
//                         </div>
                        
//                         {/* Location & Join Date */}
//                         <div className="flex items-center gap-6 mb-10">
//                           <div className="flex items-center gap-3 px-5 py-3 glass-morphism rounded-xl">
//                             <MapPin className="w-5 h-5 text-gray-400" />
//                             <div>
//                               <div className="font-bold text-lg">{userData.location?.city || 'Unknown'}</div>
//                               <div className="text-sm text-gray-400">{userData.location?.country || 'Earth'}</div>
//                             </div>
//                           </div>
                          
//                           <div className="flex items-center gap-3 px-5 py-3 glass-morphism rounded-xl">
//                             <Calendar className="w-5 h-5 text-gray-400" />
//                             <div>
//                               <div className="font-bold text-lg">Member Since</div>
//                               <div className="text-sm text-gray-400">
//                                 {new Date(userData.createdAt).toLocaleDateString('en-US', { 
//                                   month: 'short', 
//                                   year: 'numeric' 
//                                 })}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
                        
//                         {/* Bio */}
//                         <div className="mb-12">
//                           {isEditingBio ? (
//                             <div className="space-y-6">
//                               <textarea
//                                 value={bio}
//                                 onChange={(e) => setBio(e.target.value)}
//                                 className="w-full px-6 py-5 glass-morphism rounded-2xl focus:outline-none focus:ring-2 focus:ring-grass-500/50 text-lg resize-none"
//                                 rows="4"
//                                 maxLength="240"
//                                 placeholder="Share your journey, goals, or philosophy..."
//                                 autoFocus
//                               />
//                               <div className="flex gap-4">
//                                 <button
//                                   onClick={updateBio}
//                                   className="px-8 py-4 bg-gradient-to-r from-grass-500 to-emerald-600 hover:from-grass-600 hover:to-emerald-700 rounded-xl font-bold text-lg shadow-2xl shadow-emerald-500/30 transition-all duration-300"
//                                 >
//                                   Save Changes
//                                 </button>
//                                 <button
//                                   onClick={() => {
//                                     setIsEditingBio(false);
//                                     setBio(userData.bio);
//                                   }}
//                                   className="px-8 py-4 glass-morphism hover:bg-white/5 rounded-xl font-bold text-lg transition-all duration-300"
//                                 >
//                                   Cancel
//                                 </button>
//                               </div>
//                             </div>
//                           ) : (
//                             <div className="relative group">
//                               <p className="text-gray-300 text-xl leading-relaxed mb-8">
//                                 {userData.bio || 'No bio yet. Share your story...'}
//                               </p>
//                               {isOwnProfile && (
//                                 <button
//                                   onClick={() => setIsEditingBio(true)}
//                                   className="absolute -top-3 -right-3 p-4 glass-morphism rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"
//                                 >
//                                   <Edit className="w-5 h-5" />
//                                 </button>
//                               )}
//                             </div>
//                           )}
//                         </div>
                        
//                         {/* Social Stats */}
//                         <div className="grid grid-cols-3 gap-6 mb-12">
//                           <div className="text-center p-6 glass-morphism rounded-2xl">
//                             <div className="text-4xl font-bold text-gradient mb-2">{followersCount}</div>
//                             <div className="text-sm text-gray-400">Followers</div>
//                           </div>
//                           <div className="text-center p-6 glass-morphism rounded-2xl">
//                             <div className="text-4xl font-bold text-gradient mb-2">{followingCount}</div>
//                             <div className="text-sm text-gray-400">Following</div>
//                           </div>
//                           <div className="text-center p-6 glass-morphism rounded-2xl">
//                             <div className="text-4xl font-bold text-gradient mb-2">{achievements.length}</div>
//                             <div className="text-sm text-gray-400">Achievements</div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Column - Streak Stats */}
//                 <div className="space-y-8">
//                   {/* Streak Card */}
//                   <div className="gradient-border rounded-3xl p-8">
//                     <div className="flex items-center justify-between mb-8">
//                       <div>
//                         <div className="text-sm font-medium text-gray-400 mb-2">CURRENT STREAK</div>
//                         <div className="text-5xl font-bold text-gradient">{streakData?.currentStreak || 0}</div>
//                         <div className="text-sm text-gray-400 mt-2">consecutive days</div>
//                       </div>
//                       <div className={`p-4 rounded-2xl ${todayVerified ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
//                         {todayVerified ? (
//                           <CheckCircle className="w-8 h-8 text-emerald-400" />
//                         ) : (
//                           <Clock className="w-8 h-8 text-rose-400" />
//                         )}
//                       </div>
//                     </div>
                    
//                     {isOwnProfile ? (
//                       <div className="space-y-4">
//                         <button
//                           onClick={handleVerifyToday}
//                           disabled={isVerifying || todayVerified}
//                           className={`w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300 ${
//                             todayVerified
//                               ? 'glass-morphism text-emerald-400'
//                               : isVerifying
//                               ? 'bg-gradient-to-r from-grass-500/50 to-emerald-600/50 cursor-not-allowed'
//                               : 'bg-gradient-to-r from-grass-500 to-emerald-600 hover:from-grass-600 hover:to-emerald-700 hover:shadow-2xl hover:shadow-emerald-500/40'
//                           }`}
//                         >
//                           {isVerifying ? (
//                             <>
//                               <Loader className="w-6 h-6 animate-spin inline mr-3" />
//                               Verifying Today...
//                             </>
//                           ) : todayVerified ? (
//                             <>
//                               <CheckCircle className="w-6 h-6 inline mr-3" />
//                               Verified Today
//                             </>
//                           ) : (
//                             <>
//                               <Camera className="w-6 h-6 inline mr-3" />
//                               Verify Today's Activity
//                             </>
//                           )}
//                         </button>
                        
//                         <button
//                           onClick={handleShame}
//                           className="w-full py-5 glass-morphism hover:bg-white/5 rounded-2xl font-bold text-lg transition-all duration-300 text-rose-400 hover:text-rose-300"
//                         >
//                           <XCircle className="w-6 h-6 inline mr-3" />
//                           Accept Shame Day
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="space-y-4">
//                         <button
//                           onClick={() => setIsFollowing(!isFollowing)}
//                           className={`w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300 ${
//                             isFollowing
//                               ? 'glass-morphism'
//                               : 'bg-gradient-to-r from-grass-500 to-emerald-600 hover:from-grass-600 hover:to-emerald-700'
//                           }`}
//                         >
//                           {isFollowing ? (
//                             <>
//                               <User className="w-6 h-6 inline mr-3" />
//                               Following
//                             </>
//                           ) : (
//                             <>
//                               <UserPlus className="w-6 h-6 inline mr-3" />
//                               Follow User
//                             </>
//                           )}
//                         </button>
                        
//                         <button
//                           onClick={() => setShowShareOptions(true)}
//                           className="w-full py-5 glass-morphism hover:bg-white/5 rounded-2xl font-bold text-lg transition-all duration-300"
//                         >
//                           <Share2 className="w-6 h-6 inline mr-3" />
//                           Share Profile
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   {/* Quick Stats */}
//                   <div className="space-y-6">
//                     <div className="glass-morphism rounded-2xl p-6">
//                       <div className="text-sm font-medium text-gray-400 mb-4">PERFORMANCE METRICS</div>
//                       <div className="space-y-4">
//                         <div>
//                           <div className="flex justify-between mb-2">
//                             <span className="text-gray-300">Longest Streak</span>
//                             <span className="font-bold text-gradient">{streakData?.longestStreak || 0} days</span>
//                           </div>
//                           <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
//                             <div 
//                               className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
//                               style={{ width: `${Math.min(100, (streakData?.longestStreak || 0) / 365 * 100)}%` }}
//                             />
//                           </div>
//                         </div>
                        
//                         <div>
//                           <div className="flex justify-between mb-2">
//                             <span className="text-gray-300">Total Outdoor Time</span>
//                             <span className="font-bold text-gradient">
//                               {Math.floor((streakData?.totalOutdoorTime || 0) / 60)}h
//                             </span>
//                           </div>
//                           <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
//                             <div 
//                               className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
//                               style={{ width: `${Math.min(100, (streakData?.totalOutdoorTime || 0) / 10000 * 100)}%` }}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Key Metrics */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="mb-16"
//             >
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//                 {stats.map((stat, index) => (
//                   <div
//                     key={index}
//                     className="relative overflow-hidden rounded-3xl group"
//                   >
//                     <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500"
//                          style={{ background: `linear-gradient(135deg, ${stat.gradient})` }}
//                     />
//                     <div className="relative glass-morphism h-full rounded-3xl p-8">
//                       <div className="flex items-start justify-between mb-6">
//                         <div className={`p-4 rounded-2xl bg-white/5 ${stat.color.replace('text-', 'bg-')}/10`}>
//                           {stat.icon}
//                         </div>
//                         <Sparkles className="w-6 h-6 text-gray-600 group-hover:text-white/50 transition-colors duration-300" />
//                       </div>
//                       <div className="text-4xl font-bold mb-2">{stat.value}</div>
//                       <div className="text-lg font-semibold mb-3">{stat.label}</div>
//                       <div className="text-sm text-gray-400">{stat.description}</div>
//                       <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer-bg"></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>

//             {/* Navigation Tabs */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="mb-12"
//             >
//               <div className="flex flex-wrap gap-4">
//                 {tabs.map((tab) => (
//                   <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`flex items-center gap-3 px-8 py-5 rounded-2xl font-semibold text-lg transition-all duration-300 ${
//                       activeTab === tab.id
//                         ? 'bg-gradient-to-r from-grass-500 to-emerald-600 shadow-2xl shadow-emerald-500/30'
//                         : 'glass-morphism hover:bg-white/5'
//                     }`}
//                   >
//                     {tab.icon}
//                     {tab.label}
//                     {activeTab === tab.id && (
//                       <div className="w-2 h-2 rounded-full bg-white ml-2"></div>
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </motion.div>

//             {/* Tab Content */}
//             <motion.div
//               key={activeTab}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//               className="min-h-[600px]"
//             >
//               {/* Overview Tab */}
//               {activeTab === 'overview' && (
//                 <div className="grid lg:grid-cols-3 gap-12">
//                   {/* Left Column */}
//                   <div className="lg:col-span-2 space-y-12">
//                     {/* Weekly Progress */}
//                     <div className="gradient-border rounded-3xl p-10">
//                       <div className="flex items-center justify-between mb-10">
//                         <div>
//                           <h3 className="text-2xl font-bold mb-3">Weekly Progress</h3>
//                           <p className="text-gray-400">7-day verification performance</p>
//                         </div>
//                         <div className="px-5 py-3 glass-morphism rounded-xl">
//                           <div className="text-sm text-gray-400">This Week</div>
//                           <div className="text-lg font-bold">
//                             {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className="grid grid-cols-7 gap-4">
//                         {weeklyData.map((day, index) => (
//                           <div key={index} className="text-center">
//                             <div className={`h-32 rounded-2xl flex flex-col items-center justify-center mb-4 transition-all duration-300 ${
//                               day.isVerified
//                                 ? 'bg-gradient-to-b from-emerald-500/20 to-green-600/20 border border-emerald-500/30'
//                                 : 'glass-morphism'
//                             }`}>
//                               <div className={`text-4xl mb-3 ${day.isVerified ? 'text-emerald-400' : 'text-gray-600'}`}>
//                                 {day.isVerified ? '✓' : '○'}
//                               </div>
//                               <div className="text-sm font-medium">{day.day}</div>
//                             </div>
//                             <div className="text-sm text-gray-400">{day.date}</div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Recent Activity */}
//                     <div className="gradient-border rounded-3xl p-10">
//                       <div className="flex items-center justify-between mb-10">
//                         <div>
//                           <h3 className="text-2xl font-bold mb-3">Recent Activity</h3>
//                           <p className="text-gray-400">Latest streak verifications & updates</p>
//                         </div>
//                         <button 
//                           className="px-6 py-3 glass-morphism hover:bg-white/5 rounded-xl font-medium transition-all duration-300"
//                           onClick={() => loadProfileData()}
//                         >
//                           Refresh
//                         </button>
//                       </div>
                      
//                       <div className="space-y-6">
//                         {recentActivity.length > 0 ? (
//                           recentActivity.map((activity, index) => (
//                             <div
//                               key={index}
//                               className="flex items-center gap-6 p-6 glass-morphism rounded-2xl hover:bg-white/5 transition-all duration-300"
//                             >
//                               <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
//                                 activity.verified
//                                   ? 'bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-500/30'
//                                   : 'bg-gradient-to-br from-rose-500/20 to-red-600/20 border border-rose-500/30'
//                               }`}>
//                                 {activity.verified ? (
//                                   <CheckCircle className="w-8 h-8 text-emerald-400" />
//                                 ) : (
//                                   <XCircle className="w-8 h-8 text-rose-400" />
//                                 )}
//                               </div>
//                               <div className="flex-1">
//                                 <div className="flex items-center gap-4 mb-2">
//                                   <div className={`text-lg font-bold ${
//                                     activity.verified ? 'text-emerald-400' : 'text-rose-400'
//                                   }`}>
//                                     {activity.verified ? 'Verified Day' : 'Shame Day'}
//                                   </div>
//                                   <div className="px-3 py-1 bg-white/5 rounded-lg text-sm">
//                                     {activity.date.toLocaleDateString('en-US', { 
//                                       weekday: 'short',
//                                       month: 'short',
//                                       day: 'numeric'
//                                     })}
//                                   </div>
//                                 </div>
//                                 <div className="text-gray-400">
//                                   {activity.verified 
//                                     ? `${activity.duration} minutes of outdoor activity verified`
//                                     : 'Missed daily verification'}
//                                 </div>
//                               </div>
//                               {activity.verified && (
//                                 <div className="px-5 py-3 glass-morphism rounded-xl">
//                                   <div className="text-2xl font-bold text-gradient">{activity.duration}m</div>
//                                 </div>
//                               )}
//                             </div>
//                           ))
//                         ) : (
//                           <div className="text-center py-12">
//                             <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-6" />
//                             <p className="text-gray-400">No recent activity</p>
//                             <p className="text-sm text-gray-600 mt-2">Start verifying your streak to see activity here</p>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right Column */}
//                   <div className="space-y-12">
//                     {/* Achievements Preview */}
//                     <div className="gradient-border rounded-3xl p-10">
//                       <div className="flex items-center justify-between mb-10">
//                         <h3 className="text-2xl font-bold">Achievements</h3>
//                         <div className="px-4 py-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-xl">
//                           <span className="text-sm font-bold text-amber-400">{achievements.length}</span>
//                         </div>
//                       </div>
                      
//                       <div className="space-y-6">
//                         {achievements.length > 0 ? (
//                           achievements.slice(-3).map((achievement, idx) => (
//                             <div
//                               key={idx}
//                               className="flex items-center gap-6 p-6 glass-morphism rounded-2xl hover:bg-white/5 transition-all duration-300"
//                             >
//                               <div className="text-4xl">{achievement.icon || '🏆'}</div>
//                               <div className="flex-1">
//                                 <div className="font-bold text-lg mb-1">{achievement.name}</div>
//                                 <div className="text-sm text-gray-400">{achievement.description}</div>
//                                 <div className="text-xs text-gray-500 mt-2">
//                                   {new Date(achievement.earnedAt || Date.now()).toLocaleDateString()}
//                                 </div>
//                               </div>
//                             </div>
//                           ))
//                         ) : (
//                           <div className="text-center py-12">
//                             <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-6" />
//                             <p className="text-gray-400">No achievements yet</p>
//                             <p className="text-sm text-gray-600 mt-2">Start your streak to earn achievements</p>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Quick Actions */}
//                     <div className="gradient-border rounded-3xl p-10">
//                       <h3 className="text-2xl font-bold mb-10">Quick Actions</h3>
                      
//                       <div className="space-y-4">
//                         <button
//                           onClick={() => navigate('/dashboard')}
//                           className="w-full p-6 glass-morphism hover:bg-white/5 rounded-2xl flex items-center justify-between transition-all duration-300 group"
//                         >
//                           <div className="flex items-center gap-4">
//                             <div className="p-3 bg-gradient-to-br from-grass-500/10 to-emerald-500/10 rounded-xl">
//                               <Flame className="w-6 h-6 text-grass-400" />
//                             </div>
//                             <div className="text-left">
//                               <div className="font-bold text-lg">Dashboard</div>
//                               <div className="text-sm text-gray-400">Return to main view</div>
//                             </div>
//                           </div>
//                           <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
//                         </button>
                        
//                         <button
//                           onClick={() => setShowShareOptions(true)}
//                           className="w-full p-6 glass-morphism hover:bg-white/5 rounded-2xl flex items-center justify-between transition-all duration-300 group"
//                         >
//                           <div className="flex items-center gap-4">
//                             <div className="p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl">
//                               <Share2 className="w-6 h-6 text-purple-400" />
//                             </div>
//                             <div className="text-left">
//                               <div className="font-bold text-lg">Share Progress</div>
//                               <div className="text-sm text-gray-400">Share your streak journey</div>
//                             </div>
//                           </div>
//                           <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Other Tabs (Placeholders) */}
//               {activeTab === 'analytics' && (
//                 <div className="gradient-border rounded-3xl p-10">
//                   <h3 className="text-2xl font-bold mb-6">Analytics Coming Soon</h3>
//                   <p className="text-gray-400">Detailed analytics and insights will be available soon.</p>
//                 </div>
//               )}

//               {activeTab === 'achievements' && (
//                 <div className="gradient-border rounded-3xl p-10">
//                   <h3 className="text-2xl font-bold mb-6">All Achievements</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {achievements.map((achievement, idx) => (
//                       <div key={idx} className="glass-morphism rounded-2xl p-6">
//                         <div className="text-4xl mb-4">{achievement.icon || '🏆'}</div>
//                         <h4 className="font-bold text-lg mb-2">{achievement.name}</h4>
//                         <p className="text-gray-400 text-sm">{achievement.description}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {activeTab === 'social' && (
//                 <div className="gradient-border rounded-3xl p-10">
//                   <h3 className="text-2xl font-bold mb-6">Social Features Coming Soon</h3>
//                   <p className="text-gray-400">Follow users, join communities, and more social features coming soon.</p>
//                 </div>
//               )}
//             </motion.div>
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
//               className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="p-10">
//                 <div className="text-center mb-10">
//                   <h3 className="text-3xl font-bold mb-4">Share Profile</h3>
//                   <p className="text-gray-400">Spread your discipline journey across platforms</p>
//                 </div>
                
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//                   {[
//                     { platform: 'twitter', icon: <Twitter />, label: 'Twitter', color: '#1DA1F2' },
//                     { platform: 'linkedin', icon: <Linkedin />, label: 'LinkedIn', color: '#0077B5' },
//                     { platform: 'facebook', icon: <Facebook />, label: 'Facebook', color: '#1877F2' },
//                     { platform: 'whatsapp', icon: <MessageSquare />, label: 'WhatsApp', color: '#25D366' },
//                     { platform: 'instagram', icon: <Instagram />, label: 'Instagram', color: '#E4405F' },
//                     { platform: 'copy', icon: <Copy />, label: 'Copy Link', color: '#8B5CF6' },
//                   ].map((platform) => (
//                     <button
//                       key={platform.platform}
//                       onClick={() => shareProfile(platform.platform)}
//                       className="p-8 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:scale-105"
//                       style={{
//                         background: `${platform.color}10`,
//                         border: `2px solid ${platform.color}30`
//                       }}
//                     >
//                       <div className="text-3xl" style={{ color: platform.color }}>
//                         {platform.icon}
//                       </div>
//                       <span className="font-bold text-lg">{platform.label}</span>
//                     </button>
//                   ))}
//                 </div>
                
//                 <button
//                   onClick={() => setShowShareOptions(false)}
//                   className="w-full mt-10 py-5 glass-morphism hover:bg-white/5 rounded-2xl font-bold text-lg transition-all duration-300"
//                 >
//                   Cancel
//                 </button>
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
//               className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="p-10">
//                 <h3 className="text-3xl font-bold mb-10">Account Settings</h3>
                
//                 <div className="space-y-8">
//                   <div>
//                     <h4 className="text-lg font-bold mb-6 flex items-center gap-3">
//                       <Bell className="w-5 h-5" />
//                       Notifications
//                     </h4>
//                     <div className="space-y-4">
//                       <label className="flex items-center justify-between p-4 glass-morphism rounded-xl">
//                         <div>
//                           <div className="font-medium">Streak Reminders</div>
//                           <div className="text-sm text-gray-400">Daily verification reminders</div>
//                         </div>
//                         <input type="checkbox" defaultChecked className="w-6 h-6" />
//                       </label>
//                     </div>
//                   </div>
                  
//                   <div className="pt-8 border-t border-white/10">
//                     <button
//                       onClick={handleLogout}
//                       className="w-full py-5 bg-gradient-to-r from-rose-500/10 to-red-600/10 hover:from-rose-500/20 hover:to-red-600/20 border border-rose-500/30 hover:border-rose-500/50 rounded-2xl font-bold text-lg transition-all duration-300"
//                     >
//                       <div className="flex items-center justify-center gap-4">
//                         <LogOut className="w-6 h-6" />
//                         <span>Logout Account</span>
//                       </div>
//                     </button>
//                   </div>
                  
//                   <button
//                     onClick={() => setShowSettingsModal(false)}
//                     className="w-full py-5 glass-morphism hover:bg-white/5 rounded-2xl font-bold text-lg transition-all duration-300"
//                   >
//                     Close Settings
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default Profile;

// Profile.jsx - Uses SAME localStorage data as Dashboard with matching UI
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Camera, CheckCircle, XCircle, Flame, Trophy, 
  Calendar, TrendingUp, Clock, Target, Award, Crown,
  Users, BarChart, Activity, Share2, MapPin,
  Edit, Check, X, ChevronRight, ArrowLeft, Settings,
  Copy, Twitter, Linkedin, Facebook, MessageSquare, Instagram,
  LogOut, Loader, UserPlus, CalendarDays, BarChart3,
  Sparkles, Verified, Bell, ArrowUpRight, ChevronLeft,
  Home, FileText, PieChart, Target as TargetIcon, Heart,
  MessageCircle, Download, Zap, TrendingDown, Globe,
  Lock, Eye, EyeOff, Smartphone, Watch, Gift, Star,
  Moon, Sun, UploadCloud, Shield, HelpCircle, Info
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Confetti from 'react-confetti';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [timeLeft, setTimeLeft] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Dashboard-style CSS
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
    
    /* Profile specific styles */
    .profile-hero {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1));
      border-radius: 24px;
      padding: 32px;
      margin-bottom: 32px;
    }
    
    .profile-header {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 32px;
    }
    
    .avatar-container {
      position: relative;
    }
    
    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 20px;
      border: 4px solid rgba(255, 255, 255, 0.1);
      object-fit: cover;
    }
    
    .streak-badge {
      position: absolute;
      bottom: -8px;
      right: -8px;
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 20px;
      border: 3px solid #0f172a;
    }
    
    .user-info {
      flex: 1;
    }
    
    .user-name {
      font-size: 36px;
      font-weight: 700;
      margin: 0 0 8px;
      background: linear-gradient(135deg, #22c55e, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .user-meta {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
    }
    
    .bio-section {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
    }
    
    .bio-text {
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.6;
      margin: 0;
    }
    
    .profile-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-top: 24px;
    }
    
    .profile-stat {
      text-align: center;
      padding: 16px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
    }
    
    .profile-stat-value {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    
    .profile-stat-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
    }
    
    .weekly-calendar {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 24px;
    }
    
    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
      margin-top: 16px;
    }
    
    .calendar-day {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-weight: 600;
    }
    
    .calendar-day.verified {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(21, 128, 61, 0.2));
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #22c55e;
    }
    
    .calendar-day.pending {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.4);
    }
    
    @media (max-width: 1024px) {
      .dashboard-layout {
        grid-template-columns: 1fr;
      }
      
      .profile-stats {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .profile-header {
        flex-direction: column;
        text-align: center;
      }
      
      .user-meta {
        justify-content: center;
      }
      
      .achievements-grid {
        grid-template-columns: 1fr;
      }
      
      .quick-actions {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    
    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .profile-stats {
        grid-template-columns: 1fr;
      }
      
      .quick-actions {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `;

  // Load user data from localStorage (SAME as Dashboard)
  const loadUserData = () => {
    try {
      const storedUser = localStorage.getItem('touchgrass_user');
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log('✅ Profile: Loaded user from localStorage:', user);
        return user;
      }
      
      // Fallback: Check if there's a user in auth state
      const token = localStorage.getItem('touchgrass_token');
      if (token) {
        // Extract username from token or use default
        const defaultUser = {
          id: Date.now().toString(),
          username: 'user' + Date.now(),
          displayName: 'TouchGrass User',
          email: 'user@example.com',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
          location: { city: 'Online', country: 'Internet' },
          bio: 'Building daily discipline through outdoor accountability.',
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString()
        };
        console.log('✅ Profile: Created default user');
        localStorage.setItem('touchgrass_user', JSON.stringify(defaultUser));
        return defaultUser;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Profile: Error loading user data:', error);
      return null;
    }
  };

  // Load streak data from localStorage (SAME as Dashboard)
  const loadStreakData = (username) => {
    try {
      const streakKey = `touchgrass_streak_${username}`;
      const storedStreak = localStorage.getItem(streakKey);
      
      if (storedStreak) {
        const streak = JSON.parse(storedStreak);
        console.log('✅ Profile: Loaded streak from localStorage:', streak);
        return streak;
      }
      
      // Initialize new streak (SAME as Dashboard)
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
      
      console.log('✅ Profile: Created new streak');
      localStorage.setItem(streakKey, JSON.stringify(newStreak));
      return newStreak;
    } catch (error) {
      console.error('❌ Profile: Error loading streak data:', error);
      return null;
    }
  };

  // Save streak data to localStorage (SAME as Dashboard)
  const saveStreakData = (username, streakData) => {
    try {
      const streakKey = `touchgrass_streak_${username}`;
      localStorage.setItem(streakKey, JSON.stringify(streakData));
      console.log('✅ Profile: Saved streak to localStorage:', streakData);
    } catch (error) {
      console.error('❌ Profile: Error saving streak data:', error);
    }
  };

  // Check if user verified today (SAME as Dashboard)
  const checkTodayVerified = (streakData) => {
    if (!streakData || !streakData.history || streakData.history.length === 0) {
      return false;
    }
    
    const today = new Date().toDateString();
    const lastEntry = streakData.history[streakData.history.length - 1];
    const lastDate = new Date(lastEntry.date).toDateString();
    
    return today === lastDate && lastEntry.verified === true;
  };

  // Generate weekly data from streak history
  const generateWeeklyData = (streakHistory = []) => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const today = new Date();
    
    return days.map((day, index) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - index));
      
      const isVerified = streakHistory.some(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.toDateString() === date.toDateString() && entry.verified;
      });
      
      return {
        day,
        date: date.getDate(),
        isVerified,
        fullDate: date
      };
    });
  };

  // Generate recent activity from streak data
  const generateRecentActivity = (streakHistory = []) => {
    if (!streakHistory || streakHistory.length === 0) return [];
    
    return streakHistory
      .slice(-5)
      .reverse()
      .map(entry => ({
        date: new Date(entry.date),
        verified: entry.verified,
        duration: entry.duration || 15,
        notes: entry.notes || '',
        method: entry.verificationMethod || 'manual'
      }));
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

  // Main data loading function
  const loadProfileData = async () => {
    setIsLoading(true);
    
    try {
      const user = loadUserData();
      if (!user) {
        console.log('❌ Profile: No user found, redirecting to auth');
        toast.error('Please login to view your profile');
        navigate('/auth');
        return;
      }

      const streak = loadStreakData(user.username);
      if (!streak) {
        console.log('❌ Profile: No streak data found');
        toast.error('Failed to load streak data');
        return;
      }

      // Update todayVerified status
      streak.todayVerified = checkTodayVerified(streak);
      
      setUserData(user);
      setStreakData(streak);
      setBio(user.bio || '');
      setIsOwnProfile(true); // Since we're loading current user's profile
      
      // Generate weekly data
      const weekly = generateWeeklyData(streak.history || []);
      setWeeklyData(weekly);
      
      // Generate recent activity
      const activity = generateRecentActivity(streak.history || []);
      setRecentActivity(activity);

      // Set achievements based on streak data (SAME as Dashboard)
      const userAchievements = [];
      if (streak.currentStreak >= 7) {
        userAchievements.push({
          name: 'Weekly Warrior',
          icon: '🔥',
          description: '7 consecutive days',
          earnedAt: new Date().toISOString()
        });
      }
      if (streak.shareCount >= 10) {
        userAchievements.push({
          name: 'Social Butterfly',
          icon: '🦋',
          description: '10+ shares',
          earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
      if (streak.currentStreak >= 30) {
        userAchievements.push({
          name: 'Monthly Master',
          icon: '🌟',
          description: '30-day streak',
          earnedAt: new Date().toISOString()
        });
      }
      if (streak.totalDays >= 100) {
        userAchievements.push({
          name: 'Century Club',
          icon: '💯',
          description: '100 total days',
          earnedAt: new Date().toISOString()
        });
      }
      setAchievements(userAchievements);

      // Set social stats
      setFollowersCount(Math.floor(Math.random() * 100));
      setFollowingCount(Math.floor(Math.random() * 50));

      console.log('✅ Profile: Data loaded successfully:', { user, streak });
      
    } catch (error) {
      console.error('❌ Profile: Error loading profile data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle streak verification (SAME as Dashboard)
  const handleVerifyToday = async () => {
    if (!userData || !streakData) return;
    
    const { user, streakData: currentStreakData } = { user: userData, streakData };
    
    // Check if already verified today
    if (currentStreakData.todayVerified) {
      toast.error('You already verified today! Come back tomorrow.', {
        icon: '✅',
        duration: 3000
      });
      return;
    }
    
    setIsVerifying(true);
    
    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate random outdoor time (15-60 minutes)
      const outdoorTime = Math.floor(Math.random() * 45) + 15;
      
      // Update streak (SAME as Dashboard)
      const updatedStreak = {
        ...currentStreakData,
        currentStreak: currentStreakData.currentStreak + 1,
        longestStreak: Math.max(currentStreakData.longestStreak, currentStreakData.currentStreak + 1),
        totalDays: currentStreakData.totalDays + 1,
        totalOutdoorTime: currentStreakData.totalOutdoorTime + outdoorTime,
        todayVerified: true,
        lastVerification: new Date().toISOString(),
        history: [
          ...(currentStreakData.history || []),
          {
            date: new Date().toISOString(),
            verified: true,
            verificationMethod: 'photo',
            duration: outdoorTime,
            notes: 'Daily verification',
            location: { lat: null, lng: null },
            photoUrl: null
          }
        ]
      };
      
      // Check for milestones
      const newStreakLength = updatedStreak.currentStreak;
      if (newStreakLength === 7 || newStreakLength === 30 || newStreakLength === 100) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        toast.success(`🎉 ${newStreakLength}-day milestone achieved!`, {
          duration: 5000
        });
      } else if (newStreakLength === 1) {
        toast.success('🎯 First day verified! Your streak begins!', {
          duration: 4000
        });
      } else {
        toast.success(`✅ Day ${newStreakLength} verified! Streak continues!`, {
          duration: 3000
        });
      }
      
      // Save updated streak
      saveStreakData(user.username, updatedStreak);
      
      // Update user last active
      const updatedUser = {
        ...user,
        lastActive: new Date().toISOString()
      };
      localStorage.setItem('touchgrass_user', JSON.stringify(updatedUser));
      
      // Update state
      setUserData(updatedUser);
      setStreakData(updatedStreak);
      
      // Update weekly data and recent activity
      const weekly = generateWeeklyData(updatedStreak.history || []);
      setWeeklyData(weekly);
      
      const activity = generateRecentActivity(updatedStreak.history || []);
      setRecentActivity(activity);
      
    } catch (error) {
      console.error('❌ Profile: Verification error:', error);
      toast.error('Verification failed. Please try again.', {
        icon: '❌'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle accepting shame day
  const handleShame = async () => {
    if (!userData || !streakData) return;

    const confirmShame = window.confirm(
      "Accepting shame will reset your streak to 0. This will be recorded on your profile. Continue?"
    );

    if (!confirmShame) return;

    try {
      const updatedStreak = {
        ...streakData,
        currentStreak: 0,
        todayVerified: false,
        shameDays: (streakData.shameDays || 0) + 1,
        history: [
          ...(streakData.history || []),
          {
            date: new Date().toISOString(),
            verified: false,
            verificationMethod: 'shame',
            duration: 0,
            notes: 'Failed to touch grass today',
            shameMessage: "Failed to touch grass today"
          }
        ]
      };
      
      saveStreakData(userData.username, updatedStreak);
      setStreakData(updatedStreak);
      
      toast('😈 Shame accepted. Streak reset.', {
        style: {
          background: '#dc2626',
          color: 'white'
        }
      });
      
    } catch (error) {
      console.error('❌ Profile: Error accepting shame:', error);
      toast.error('Failed to accept shame');
    }
  };

  // Update bio
  const updateBio = async () => {
    try {
      const updatedUser = {
        ...userData,
        bio: bio,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('touchgrass_user', JSON.stringify(updatedUser));
      setUserData(updatedUser);
      setIsEditingBio(false);
      toast.success('Bio updated successfully!');
      
    } catch (error) {
      console.error('❌ Profile: Error updating bio:', error);
      toast.error('Failed to update bio');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('touchgrass_token');
    localStorage.removeItem('touchgrass_user');
    // Also clear streak data for current user
    if (userData?.username) {
      localStorage.removeItem(`touchgrass_streak_${userData.username}`);
    }
    navigate('/auth');
    toast.success('Logged out successfully');
  };

  // Share profile function
  const shareProfile = (platform) => {
    if (!userData) return;

    const shareUrl = `${window.location.origin}/profile/${userData.username}`;
    const shareText = `${userData.displayName} has maintained a ${streakData?.currentStreak || 0}-day TouchGrass streak. Join the movement for daily accountability and real-world discipline. ${shareUrl}`;

    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        toast.success('Profile link copied to clipboard!');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&hashtags=TouchGrass,Accountability,Streak`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: `${userData.displayName}'s TouchGrass Profile`,
            text: shareText,
            url: shareUrl
          });
        }
    }
    
    setShowShareOptions(false);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initialize data
  useEffect(() => {
    loadProfileData();
    
    // Update time left every second
    const timeInterval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timeInterval);
  }, []);

  // Calculate next milestone
  const getNextMilestone = () => {
    if (!streakData) return { target: 7, daysLeft: 7 };
    
    const { currentStreak } = streakData;
    
    if (currentStreak < 7) return { target: 7, daysLeft: 7 - currentStreak };
    if (currentStreak < 30) return { target: 30, daysLeft: 30 - currentStreak };
    if (currentStreak < 100) return { target: 100, daysLeft: 100 - currentStreak };
    return { target: 365, daysLeft: 365 - currentStreak };
  };

  // Stats cards configuration (matching dashboard style)
  const stats = [
    {
      label: 'Current Streak',
      value: streakData?.currentStreak || 0,
      description: 'Consecutive verified days',
      icon: <Flame />,
      color: '#ef4444',
      change: streakData?.currentStreak > 0 ? '+1' : '0',
    },
    {
      label: 'Consistency',
      value: streakData?.totalDays > 0 
        ? `${Math.min(100, Math.round((streakData?.totalDays / Math.max(1, Math.floor((new Date() - new Date(userData?.createdAt)) / (1000 * 60 * 60 * 24)))) * 100))}%`
        : '0%',
      description: 'Verification success rate',
      icon: <Target />,
      color: '#22c55e',
      change: streakData?.totalDays > 0 ? '+3%' : '0%',
    },
    {
      label: 'Global Rank',
      value: streakData?.currentStreak > 0 ? `#${Math.ceil(Math.random() * 1000)}` : 'N/A',
      description: 'Worldwide position',
      icon: <Trophy />,
      color: '#fbbf24',
      change: streakData?.currentStreak > 0 ? '↑5' : '0',
    },
    {
      label: 'Total Days',
      value: streakData?.totalDays || 0,
      description: 'All-time verifications',
      icon: <Calendar />,
      color: '#3b82f6',
      change: streakData?.totalDays > 0 ? '+1' : '0',
    },
    {
      label: 'Avg. Time',
      value: streakData?.totalDays > 0 ? `${Math.round(streakData.totalOutdoorTime / streakData.totalDays)}m` : '0m',
      description: 'Daily average',
      icon: <Clock />,
      color: '#8b5cf6',
      change: streakData?.totalDays > 0 ? '-5m' : '0m',
    },
    {
      label: 'Social Score',
      value: streakData?.viralScore || 0,
      description: 'Social influence',
      icon: <Share2 />,
      color: '#ec4899',
      change: streakData?.shareCount > 0 ? '+8' : '0',
    },
  ];

  // Tabs configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Activity /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 /> },
    { id: 'achievements', label: 'Achievements', icon: <Award /> },
    { id: 'social', label: 'Social', icon: <Users /> }
  ];

  // Quick actions matching dashboard
  const quickActions = [
    { icon: '🌱', label: 'Verify Today', color: '#22c55e', action: handleVerifyToday },
    { icon: '📊', label: 'Leaderboard', color: '#3b82f6', action: () => navigate('/leaderboard') },
    { icon: '💬', label: 'Chat', color: '#8b5cf6', action: () => navigate('/chat') },
    { icon: '🎯', label: 'Challenge', color: '#ec4899', action: () => navigate('/challenges') },
    { icon: '📈', label: 'Analytics', color: '#84cc16', action: () => setActiveTab('analytics') },
    { icon: '👥', label: 'Friends', color: '#06b6d4', action: () => navigate('/chat') },
    { icon: '📲', label: 'Share', color: '#fbbf24', action: () => setShowShareOptions(true) },
    { icon: '⚙️', label: 'Settings', color: '#71717a', action: () => setShowSettingsModal(true) },
  ];

  // Check if today is verified
  const today = new Date().toDateString();
  const todayVerified = streakData?.history?.some(entry => 
    new Date(entry.date).toDateString() === today && entry.verified
  ) || false;

  // Loading state
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
          
          <div className="stats-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="loading-skeleton" style={{ height: '150px', borderRadius: '16px' }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // No user data state
  if (!userData) {
    return (
      <div className="dashboard-container">
        <style>{dashboardStyles}</style>
        <div className="dashboard-background" />
        <div className="dashboard-header">
          <div className="empty-state">
            <div className="empty-icon">🔒</div>
            <div className="empty-title">Profile Unavailable</div>
            <div className="empty-description">
              Please login to view your profile
            </div>
            <button 
              className="dashboard-button btn-primary"
              onClick={() => navigate('/auth')}
              style={{ marginTop: '20px' }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const nextMilestone = getNextMilestone();

  return (
    <div className="dashboard-container">
      <style>{dashboardStyles}</style>
      <div className="dashboard-background" />
      
      {showConfetti && (
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
        {/* Header */}
        <div className="header-top">
          <div className="welcome-section">
            <button
              onClick={() => navigate('/dashboard')}
              className="dashboard-button btn-ghost"
              style={{ marginBottom: '16px' }}
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
            <h1>Profile Settings</h1>
            <p>Manage your account and track your progress</p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="time-left-counter">
              <Clock size={14} />
              <span>Reset:</span>
              <div className="time-left-digit">{timeLeft || '23:59:59'}</div>
            </div>
            
            <button
              className="dashboard-button btn-secondary"
              onClick={() => setShowSettingsModal(true)}
            >
              <Settings size={16} />
              Settings
            </button>
            <button
              className="dashboard-button btn-ghost"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* Profile Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="profile-hero"
        >
          <div className="profile-header">
            <div className="avatar-container">
              <img
                src={userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`}
                alt={userData.displayName}
                className="avatar"
              />
              <div className="streak-badge">
                {streakData?.currentStreak || 0}
              </div>
            </div>
            
            <div className="user-info">
              <h2 className="user-name">{userData.displayName}</h2>
              
              <div className="user-meta">
                <span className="meta-item">
                  <Globe size={14} />
                  @{userData.username}
                </span>
                <span className="meta-item">
                  <MapPin size={14} />
                  {userData.location?.city || 'Online'}
                </span>
                {/* <span className="meta-item">
                  <Calendar size={14} />
                  Joined {new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span> */}
              </div>
              
               <div className="profile-stats">
                
                
                <div className="profile-stat">
                  <div className="profile-stat-value">{achievements.length}</div>
                  <div className="profile-stat-label">Achievements</div>
                </div>
                <div className="profile-stat">
                  <div className="profile-stat-value">{streakData?.totalDays || 0}</div>
                  <div className="profile-stat-label">Total Days</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bio Section */}
          <div className="bio-section">
            {isEditingBio ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bio-text"
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    resize: 'vertical'
                  }}
                  maxLength={200}
                  placeholder="Tell us about your journey..."
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="dashboard-button btn-primary"
                    onClick={updateBio}
                  >
                    Save Bio
                  </button>
                  <button
                    className="dashboard-button btn-ghost"
                    onClick={() => {
                      setIsEditingBio(false);
                      setBio(userData.bio);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p className="bio-text">
                  {userData.bio || 'No bio yet. Share your journey...'}
                </p>
                {isOwnProfile && (
                  <button
                    className="dashboard-button btn-ghost"
                    onClick={() => setIsEditingBio(true)}
                    style={{ marginLeft: '12px' }}
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Verification Action */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={handleVerifyToday}
              disabled={isVerifying || todayVerified}
              className={`dashboard-button ${todayVerified ? 'btn-secondary' : 'btn-primary'}`}
              style={{ flex: 1 }}
            >
              {isVerifying ? (
                <>
                  <Loader className="animate-spin" size={16} />
                  Verifying...
                </>
              ) : todayVerified ? (
                <>
                  <CheckCircle size={16} />
                  Verified Today
                </>
              ) : (
                <>
                  <Camera size={16} />
                  Verify Today
                </>
              )}
            </button>
            
            <button
              onClick={handleShame}
              className="dashboard-button btn-ghost"
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
            >
              <XCircle size={16} />
              Shame Day
            </button>
            
            <button
              onClick={() => setShowShareOptions(true)}
              className="dashboard-button btn-secondary"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="stats-grid"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-item"
              style={{ '--stat-color': stat.color }}
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
            </div>
          ))}
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="dashboard-layout">
        <div className="main-content">
          {/* Tabs */}
          <div className="dashboard-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <>
              {/* Weekly Calendar */}
              <div className="weekly-calendar">
                <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '600' }}>
                  Weekly Progress
                </h3>
                <div className="calendar-grid">
                  {weeklyData.map((day, index) => (
                    <div
                      key={index}
                      className={`calendar-day ${day.isVerified ? 'verified' : 'pending'}`}
                    >
                      {day.day}
                      <div style={{ fontSize: '10px', marginTop: '4px' }}>
                        {day.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="activity-feed">
                <div className="feed-header">
                  <h3>
                    <Activity size={20} />
                    Recent Activity
                  </h3>
                  <button 
                    className="dashboard-button btn-ghost"
                    onClick={loadProfileData}
                  >
                    Refresh
                  </button>
                </div>
                <div className="feed-content">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="activity-item">
                        <div 
                          className="activity-icon"
                          style={{
                            background: activity.verified 
                              ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(21, 128, 61, 0.2))'
                              : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(185, 28, 28, 0.2))',
                            color: activity.verified ? '#22c55e' : '#ef4444'
                          }}
                        >
                          {activity.verified ? '✓' : '✗'}
                        </div>
                        <div className="activity-details">
                          <div className="activity-action">
                            {activity.verified ? 'Verified Day' : 'Missed Day'}
                          </div>
                          <div className="activity-time">
                            {activity.date.toLocaleDateString('en-US', { 
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                        {activity.verified && (
                          <div className="activity-meta">
                            {activity.duration}m
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">📝</div>
                      <div className="empty-title">No recent activity</div>
                      <div className="empty-description">
                        Start verifying your streak to see activity here
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'analytics' && (
            <div className="activity-feed">
              <div className="feed-header">
                <h3>
                  <BarChart3 size={20} />
                  Analytics
                </h3>
              </div>
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <div className="empty-title">Analytics Coming Soon</div>
                <div className="empty-description">
                  Detailed analytics and insights will be available soon
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="activity-feed">
              <div className="feed-header">
                <h3>
                  <Award size={20} />
                  Achievements
                </h3>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  {achievements.length} earned
                </div>
              </div>
              <div className="achievements-grid">
                {achievements.length > 0 ? (
                  achievements.map((achievement, index) => (
                    <div key={index} className="achievement-item">
                      <div className="achievement-icon">{achievement.icon}</div>
                      <div className="achievement-name">{achievement.name}</div>
                      <div className="achievement-earned">
                        {new Date(achievement.earnedAt).toLocaleDateString()}
                      </div>
                      <div className="achievement-description">{achievement.description}</div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                    <div className="empty-icon">🏆</div>
                    <div className="empty-title">No achievements yet</div>
                    <div className="empty-description">
                      Start your streak to earn achievements
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="activity-feed">
              <div className="feed-header">
                <h3>
                  <Users size={20} />
                  Social
                </h3>
              </div>
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <div className="empty-title">Social Features Coming Soon</div>
                <div className="empty-description">
                  Follow users, join communities, and more social features coming soon
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Quick Actions */}
          <div className="activity-feed">
            <div className="feed-header">
              <h3>
                <Zap size={20} />
                Quick Actions
              </h3>
            </div>
            <div className="quick-actions">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  className="quick-action"
                  onClick={action.action}
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
                </div>
              ))}
            </div>
          </div>

          {/* Next Milestone */}
          <div className="activity-feed">
            <div className="feed-header">
              <h3>
                <TargetIcon size={20} />
                Next Milestone
              </h3>
            </div>
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ 
                fontSize: '48px', 
                fontWeight: '700',
                background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '8px'
              }}>
                Day {nextMilestone.target}
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '16px' }}>
                {nextMilestone.daysLeft} {nextMilestone.daysLeft === 1 ? 'day' : 'days'} to go
              </div>
              <div className="progress-bar" style={{ height: '12px' }}>
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${Math.min(100, ((streakData?.currentStreak || 0) / nextMilestone.target) * 100)}%`
                  }}
                />
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.6)',
                marginTop: '8px'
              }}>
                <span>Day {streakData?.currentStreak || 0}</span>
                <span>Day {nextMilestone.target}</span>
              </div>
            </div>
          </div>

          {/* Performance Insights */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '20px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>🚀</div>
            <h3 style={{ margin: '0 0 12px', color: '#8b5cf6' }}>Performance</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 20px', fontSize: '14px' }}>
              {streakData?.currentStreak > 0 
                ? `Better than ${Math.floor(Math.random() * 30) + 70}% of users`
                : 'Start your streak to see rankings'}
            </p>
            <button
              className="dashboard-button btn-secondary"
              onClick={() => navigate('/leaderboard')}
              style={{ width: '100%' }}
            >
              <Trophy size={16} />
              View Leaderboard
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareOptions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                borderRadius: '24px',
                padding: '32px',
                maxWidth: '600px',
                width: '100%',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 32px 64px rgba(0, 0, 0, 0.5)',
                position: 'relative'
              }}
            >
              <button 
                onClick={() => setShowShareOptions(false)}
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
                  Share Profile
                </h2>
                <p style={{ 
                  margin: 0, 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '16px'
                }}>
                  Day {streakData?.currentStreak || 0} • {Math.min(100, Math.round((streakData?.totalDays / Math.max(1, Math.floor((new Date() - new Date(userData.createdAt)) / (1000 * 60 * 60 * 24)))) * 100))}% Consistency
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
                    onClick={() => shareProfile(platform.platform)}
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                borderRadius: '24px',
                padding: '32px',
                maxWidth: '600px',
                width: '100%',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 32px 64px rgba(0, 0, 0, 0.5)',
                position: 'relative'
              }}
            >
              <button 
                onClick={() => setShowSettingsModal(false)}
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

              <h2 style={{ 
                margin: '0 0 32px', 
                fontSize: '28px',
                background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Account Settings
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Theme Toggle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '16px' }}>Theme</div>
                      <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    style={{
                      padding: '10px 20px',
                      background: isDarkMode ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'linear-gradient(135deg, #fbbf24, #d97706)',
                      border: 'none',
                      borderRadius: '10px',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
                  </button>
                </div>

                {/* Notifications */}
                <div style={{
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <Bell size={20} />
                    <div style={{ fontWeight: '600', fontSize: '18px' }}>Notifications</div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                      <span>Streak Reminders</span>
                      <input type="checkbox" defaultChecked className="w-6 h-6" />
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                      <span>Challenge Updates</span>
                      <input type="checkbox" defaultChecked className="w-6 h-6" />
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                      <span>Social Notifications</span>
                      <input type="checkbox" defaultChecked className="w-6 h-6" />
                    </label>
                  </div>
                </div>

                {/* Privacy */}
                <div style={{
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <Lock size={20} />
                    <div style={{ fontWeight: '600', fontSize: '18px' }}>Privacy</div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                      <span>Public Profile</span>
                      <input type="checkbox" defaultChecked className="w-6 h-6" />
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                      <span>Show on Leaderboard</span>
                      <input type="checkbox" defaultChecked className="w-6 h-6" />
                    </label>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '16px',
                    color: '#ef4444',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <LogOut size={18} />
                  Logout Account
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setShowSettingsModal(false)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Close Settings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;