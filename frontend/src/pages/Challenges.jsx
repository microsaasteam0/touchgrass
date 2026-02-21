// import React, { useState, useEffect, useContext } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';
// import AuthContext from '../contexts/AuthContext';
// import { useStreak } from '../contexts/StreakContext';
// import challengeService from '../services/challengeService';
// import streakService from '../services/streakservice';
// import {
//   Trophy, Users, TrendingUp, Calendar, Target, Sparkles,
//   Clock, Award, Activity, Camera, CheckCircle2, Plus,
//   Search, Filter, Heart, Zap, ChevronRight, ChevronLeft,
//   Eye, UserPlus, Home, User, Edit, MapPin, Bell,
//   CheckCircle, ChevronDown, ChevronUp, X, Loader2,
//   Compass, Footprints, Leaf, Dumbbell, Brain,
//   Flame, Sunrise, Sunset, Globe, Smartphone,
//   CheckSquare, XSquare, ExternalLink, Check
// } from 'lucide-react';

// // ==================== DEFAULT CHALLENGES ====================
// const DEFAULT_CHALLENGES = [
//   {
//     id: 'default-1',
//     name: "Morning Grounding",
//     type: "mindfulness",
//     description: "Start your day standing barefoot on grass for 10 minutes while breathing deeply.",
//     duration: 30,
//     rules: [
//       "10 minutes barefoot on grass",
//       "Deep breathing throughout",
//       "No phone during routine",
//       "Observe 3 things around you"
//     ],
//     difficulty: "easy",
//     icon: "🌅",
//     category: "mindfulness",
//     participants: 1250,
//     featured: true
//   },
//   {
//     id: 'default-2',
//     name: "Daily Sunset Watch",
//     type: "routine",
//     description: "Watch sunset every evening without distractions for 15 minutes.",
//     duration: 21,
//     rules: [
//       "15 minutes sunset watch",
//       "No screens allowed",
//       "Document sky colors",
//       "Share one reflection"
//     ],
//     difficulty: "easy",
//     icon: "🌇",
//     category: "mindfulness",
//     participants: 890,
//     featured: false
//   },
//   {
//     id: 'default-3',
//     name: "Park Bench Meditation",
//     type: "meditation",
//     description: "Meditate on a park bench for 20 minutes daily, focusing on natural sounds.",
//     duration: 14,
//     rules: [
//       "Find different benches",
//       "20 minutes meditation",
//       "Focus on natural sounds",
//       "No guided apps"
//     ],
//     difficulty: "medium",
//     icon: "🧘",
//     category: "mindfulness",
//     participants: 670,
//     featured: false
//   }
// ];

// // ==================== MAIN COMPONENT ====================
// const Challenges = () => {
//   const { user } = useContext(AuthContext);
//   const { streakData, currentStreak, todayVerified, loadStreakData } = useStreak();
//   const navigate = useNavigate();
  
//   // UI State
//   const [activeTab, setActiveTab] = useState('discover');
//   const [challenges, setChallenges] = useState([]);
//   const [userChallenges, setUserChallenges] = useState([]);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isJoining, setIsJoining] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [isVerifyingToday, setIsVerifyingToday] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterDifficulty, setFilterDifficulty] = useState('all');
//   const [filterCategory, setFilterCategory] = useState('all');
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showChallengeDetails, setShowChallengeDetails] = useState(false);
//   const [selectedChallenge, setSelectedChallenge] = useState(null);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [dailyCheckins, setDailyCheckins] = useState([]);
//   const [error, setError] = useState(null);
  
//   // New challenge form state
//   const [newChallenge, setNewChallenge] = useState({
//     name: '',
//     description: '',
//     duration: 7,
//     rules: [''],
//     difficulty: 'medium',
//     type: 'custom',
//     category: 'custom',
//     icon: '🌱'
//   });

//   // Categories for filtering
//   const categories = [
//     { id: 'all', name: 'All Categories', icon: '🌍' },
//     { id: 'mindfulness', name: 'Mindfulness', icon: '🧠' },
//     { id: 'exploration', name: 'Exploration', icon: '🧭' },
//     { id: 'discipline', name: 'Discipline', icon: '🎯' },
//     { id: 'detox', name: 'Digital Detox', icon: '📵' },
//     { id: 'fitness', name: 'Fitness', icon: '💪' },
//     { id: 'social', name: 'Social', icon: '👥' },
//     { id: 'community', name: 'Community', icon: '❤️' }
//   ];

//   // Difficulties for filtering
//   const difficulties = [
//     { id: 'all', name: 'All Levels' },
//     { id: 'easy', name: 'Easy' },
//     { id: 'medium', name: 'Medium' },
//     { id: 'hard', name: 'Hard' }
//   ];

//   // =========================================
//   // HELPER FUNCTIONS
//   // =========================================

//   /**
//    * Safely extract rules array from challenge object
//    * Rules can come as array, object, or string
//    */
//   const extractRules = (challenge) => {
//     if (!challenge) return [];
    
//     try {
//       // If rules is an array, return it
//       if (Array.isArray(challenge.rules)) {
//         return challenge.rules.filter(r => r && typeof r === 'string');
//       }
      
//       // If rules is an object (from MongoDB), convert to array of strings
//       if (challenge.rules && typeof challenge.rules === 'object') {
//         // Handle the specific error case - rules object with targetStreak etc.
//         if (challenge.rules.targetStreak !== undefined) {
//           // This is the MongoDB rules object - convert to readable rules
//           const rulesArray = [];
//           if (challenge.rules.targetStreak) {
//             rulesArray.push(`Maintain a ${challenge.rules.targetStreak}-day streak`);
//           }
//           if (challenge.rules.targetDuration) {
//             rulesArray.push(`${challenge.rules.targetDuration} minutes daily`);
//           }
//           if (challenge.rules.targetConsistency) {
//             rulesArray.push(`${challenge.rules.targetConsistency}% consistency required`);
//           }
//           if (challenge.rules.minDailyTime) {
//             rulesArray.push(`Minimum ${challenge.rules.minDailyTime} minutes per day`);
//           }
//           if (challenge.rules.allowedVerificationMethods && Array.isArray(challenge.rules.allowedVerificationMethods)) {
//             rulesArray.push(`Verification: ${challenge.rules.allowedVerificationMethods.join(', ')}`);
//           }
//           return rulesArray.filter(r => r);
//         }
        
//         // Try to convert object values to strings, but skip nested objects
//         return Object.values(challenge.rules)
//           .filter(v => v && (typeof v === 'string' || typeof v === 'number'))
//           .map(v => String(v));
//       }
      
//       // If rules is a string, split by newlines
//       if (typeof challenge.rules === 'string') {
//         return challenge.rules.split('\n').filter(r => r.trim());
//       }
      
//       // Check metadata customRules
//       if (challenge.metadata?.customRules) {
//         if (typeof challenge.metadata.customRules === 'string') {
//           return challenge.metadata.customRules.split('\n').filter(r => r.trim());
//         }
//       }
      
//       // Check if there's a rules string in the challenge object
//       if (challenge.rulesString && typeof challenge.rulesString === 'string') {
//         return challenge.rulesString.split('\n').filter(r => r.trim());
//       }
//     } catch (e) {
//       console.warn('Error extracting rules:', e);
//     }
    
//     return [];
//   };

//   /**
//    * Check if user has already joined a challenge
//    */
//   const hasUserJoinedChallenge = (challengeId) => {
//     if (!user || !userChallenges.length || !challengeId) return false;
    
//     return userChallenges.some(c => 
//       String(c.id) === String(challengeId) || 
//       String(c._id) === String(challengeId) ||
//       String(c.challengeId) === String(challengeId)
//     );
//   };

//   /**
//    * Get user's progress for a specific challenge
//    */
//   const getUserProgress = (challengeId) => {
//     if (!user || !userChallenges.length || !challengeId) {
//       return { streak: 0, progress: 0, totalDays: 0, currentStreak: 0, longestStreak: 0 };
//     }
    
//     const userChallenge = userChallenges.find(c => 
//       String(c.id) === String(challengeId) || 
//       String(c._id) === String(challengeId) ||
//       String(c.challengeId) === String(challengeId)
//     );
    
//     if (!userChallenge) {
//       return { streak: 0, progress: 0, totalDays: 0, currentStreak: 0, longestStreak: 0 };
//     }
    
//     return {
//       streak: userChallenge.currentStreak || userChallenge.streak || 0,
//       progress: userChallenge.progress || 0,
//       totalDays: userChallenge.totalProgress || userChallenge.totalDays || 0,
//       currentStreak: userChallenge.currentStreak || 0,
//       longestStreak: userChallenge.longestStreak || 0,
//       completedToday: userChallenge.completedToday || false
//     };
//   };

//   /**
//    * Check if user has verified a challenge today
//    */
//   const hasVerifiedToday = (challengeId) => {
//     if (!user || !userChallenges.length || !challengeId) return false;
    
//     const today = new Date().toISOString().split('T')[0];
    
//     // Find the userChallenge - check multiple ID formats
//     const userChallenge = userChallenges.find(c => 
//       String(c.id) === String(challengeId) || 
//       String(c._id) === String(challengeId) ||
//       String(c.challengeId) === String(challengeId)
//     );
    
//     if (!userChallenge) return false;
    
//     // Check completedToday flag from backend
//     if (userChallenge.completedToday === true) {
//       return true;
//     }
    
//     // Check dailyProgress object for today's date
//     if (userChallenge.dailyProgress && userChallenge.dailyProgress[today]) {
//       const dayData = userChallenge.dailyProgress[today];
//       if (dayData === true || (typeof dayData === 'object' && dayData?.completed === true)) {
//         return true;
//       }
//     }
    
//     // Check completedDays array
//     if (Array.isArray(userChallenge.completedDays) && userChallenge.completedDays.includes(today)) {
//       return true;
//     }
    
//     return false;
//   };

//   /**
//    * Get filtered challenges based on active tab and filters
//    */
//   const getFilteredChallenges = () => {
//     let source = [];
    
//     if (activeTab === 'my-challenges') {
//       source = userChallenges;
//     } else if (activeTab === 'trending') {
//       // Sort by participants for trending
//       source = [...challenges].sort((a, b) => (b.participants || 0) - (a.participants || 0));
//     } else {
//       source = challenges;
//     }
    
//     return source.filter(challenge => {
//       // Search filter
//       if (searchQuery) {
//         const query = searchQuery.toLowerCase();
//         const nameMatch = challenge.name?.toLowerCase().includes(query);
//         const descMatch = challenge.description?.toLowerCase().includes(query);
//         if (!nameMatch && !descMatch) return false;
//       }

//       // Difficulty filter
//       if (filterDifficulty !== 'all' && challenge.difficulty !== filterDifficulty) {
//         return false;
//       }

//       // Category filter
//       if (filterCategory !== 'all' && challenge.category !== filterCategory) {
//         return false;
//       }

//       return true;
//     });
//   };

//   // =========================================
//   // DATA LOADING FUNCTIONS
//   // =========================================

//   /**
//    * Load all challenge data from backend
//    */
//   const loadData = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       // Load available challenges from backend
//       console.log('📡 Fetching available challenges...');
//       const availableChallenges = await challengeService.getAvailableChallenges();
//       console.log('✅ Available challenges loaded:', availableChallenges?.length || 0);
      
//       if (availableChallenges && availableChallenges.length > 0) {
//         setChallenges(availableChallenges);
//       } else {
//         // Fallback to defaults if backend returns empty
//         console.log('⚠️ No challenges from backend, using defaults');
//         setChallenges(DEFAULT_CHALLENGES);
//       }

//       // Load user's joined challenges if logged in
//       if (user) {
//         console.log('📡 Fetching user challenges...');
//         const userResponse = await challengeService.getUserChallenges();
//         console.log('✅ User challenges loaded:', userResponse.challenges?.length || 0);
        
//         if (userResponse.success) {
//           setUserChallenges(userResponse.challenges);
//         }

//         // Load today's check-ins
//         const today = new Date().toISOString().split('T')[0];
//         console.log('📡 Fetching daily check-ins for:', today);
//         const checkinsResponse = await challengeService.getDailyCheckins(today);
//         console.log('✅ Daily check-ins loaded:', checkinsResponse.data?.length || 0);
        
//         if (checkinsResponse.success) {
//           setDailyCheckins(checkinsResponse.data);
//         }
//       }
//     } catch (error) {
//       console.error('❌ Error loading challenge data:', error);
//       setError('Failed to load challenges. Please refresh the page.');
//       toast.error('Failed to load challenges');
      
//       // Fallback to defaults on error
//       setChallenges(DEFAULT_CHALLENGES);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // =========================================
//   // CHALLENGE ACTIONS
//   // =========================================

//   /**
//    * Handle joining a challenge
//    */
//   const handleJoinChallenge = async (challenge) => {
//     if (!user) {
//       toast.error('Please login to join challenges');
//       navigate('/auth');
//       return;
//     }

//     setIsJoining(true);
//     try {
//       console.log('📡 Joining challenge:', challenge.id, challenge.name);
      
//       const response = await challengeService.joinChallenge(challenge.id || challenge._id);
      
//       if (response.success) {
//         toast.success(`🎉 Joined "${challenge.name}"!`);
        
//         // Reload all data to reflect the join
//         await loadData();
        
//         // Show confetti celebration
//         setShowConfetti(true);
//         setTimeout(() => setShowConfetti(false), 3000);
//       } else {
//         toast.error(response.message || 'Failed to join challenge');
//       }
//     } catch (error) {
//       console.error('❌ Error joining challenge:', error);
//       toast.error('Failed to join challenge. Please try again.');
//     } finally {
//       setIsJoining(false);
//     }
//   };

//   /**
//    * Handle verifying daily progress for a challenge
//    */
//   const handleVerifyProgress = async (challengeId) => {
//     if (!user) {
//       toast.error('Please login to verify progress');
//       navigate('/auth');
//       return;
//     }

//     setIsVerifying(true);
//     try {
//       console.log('📡 Verifying progress for challenge:', challengeId);
      
//       const response = await challengeService.verifyProgress(challengeId, {
//         notes: "Verified via TouchGrass app",
//         verificationMethod: "manual"
//       });

//       if (response.success) {
//         if (response.alreadyDone) {
//           toast.success('✅ Already verified today!');
//         } else {
//           toast.success('✅ Progress verified! Keep going!');
//         }
        
//         // Reload data to reflect the verification
//         await loadData();
        
//         // Force component refresh to update UI
//         setRefreshKey(prev => prev + 1);

//         // Celebrate milestone streaks
//         if (response.data?.currentStreak === 7) {
//           toast.success('🎉 7-day streak! Amazing!');
//         } else if (response.data?.currentStreak === 30) {
//           toast.success('🏆 30-day streak! You\'re a legend!');
//         } else if (response.data?.currentStreak === 100) {
//           toast.success('💯 100-day streak! Unstoppable!');
//         }
//       } else {
//         toast.error(response.message || 'Failed to verify progress');
//       }
//     } catch (error) {
//       console.error('❌ Error verifying progress:', error);
//       toast.error('Failed to verify progress. Please try again.');
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   /**
//    * Handle creating a new challenge
//    */
//   const handleCreateChallenge = async () => {
//     if (!user) {
//       toast.error('Please login to create challenges');
//       navigate('/auth');
//       return;
//     }

//     if (!newChallenge.name.trim() || !newChallenge.description.trim()) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     setIsJoining(true);
//     try {
//       console.log('📡 Creating new challenge:', newChallenge.name);
      
//       const response = await challengeService.createChallenge({
//         name: newChallenge.name,
//         description: newChallenge.description,
//         duration: newChallenge.duration,
//         rules: newChallenge.rules.filter(r => r.trim()),
//         difficulty: newChallenge.difficulty,
//         type: newChallenge.type,
//         category: newChallenge.category,
//         icon: newChallenge.icon
//       });
      
//       if (response.success) {
//         toast.success('🎉 Challenge created successfully!');
        
//         // Reset form
//         setNewChallenge({
//           name: '',
//           description: '',
//           duration: 7,
//           rules: [''],
//           difficulty: 'medium',
//           type: 'custom',
//           category: 'custom',
//           icon: '🌱'
//         });
        
//         setShowCreateModal(false);
        
//         // Reload challenges to show the new one
//         await loadData();
//       } else {
//         toast.error(response.message || 'Failed to create challenge');
//       }
//     } catch (error) {
//       console.error('❌ Error creating challenge:', error);
//       toast.error('Failed to create challenge');
//     } finally {
//       setIsJoining(false);
//     }
//   };

//   /**
//    * Handle verifying today's streak (like Profile page)
//    */
//   const handleVerifyToday = async () => {
//     if (!user) {
//       toast.error('Please login to verify your streak');
//       navigate('/auth');
//       return;
//     }

//     setIsVerifyingToday(true);
//     try {
//       console.log('📡 Verifying today\'s streak...');
      
//       const result = await streakService.verifyToday({
//         method: 'manual',
//         notes: 'Verified via Challenges page'
//       });

//       if (result.success) {
//         if (result.alreadyDone) {
//           toast.success('✅ Already verified today!');
//         } else {
//           toast.success('🎉 Day verified! Keep the streak going!');
//         }
        
//         // Reload streak data
//         if (loadStreakData) {
//           await loadStreakData();
//         }
        
//         // Also reload challenge data
//         await loadData();
        
//         // Force refresh
//         setRefreshKey(prev => prev + 1);
//       } else {
//         toast.error(result.message || 'Failed to verify streak');
//       }
//     } catch (error) {
//       console.error('❌ Error verifying today:', error);
//       toast.error('Failed to verify. Please try again.');
//     } finally {
//       setIsVerifyingToday(false);
//     }
//   };

//   // =========================================
//   // EFFECTS
//   // =========================================

//   // Load data on mount and when user changes
//   useEffect(() => {
//     loadData();
//   }, [user]);

//   // =========================================
//   // RENDER
//   // =========================================

//   const filteredChallenges = getFilteredChallenges();
//   const stats = {
//     totalChallenges: challenges.length,
//     totalParticipants: challenges.reduce((sum, c) => sum + (c.participants || 0), 0),
//     activeChallenges: userChallenges.length
//   };

//   return (
//     <div className="challenges-page">
//       {/* CSS Styles */}
//       <style>{`
//         /* ==================== CHALLENGES PAGE CSS ==================== */
        
//         .challenges-page {
//           min-height: 100vh;
//           background: linear-gradient(135deg, #0b1120 0%, #1a1f2e 50%, #0b1120 100%);
//           color: white;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//           position: relative;
//           overflow-x: hidden;
//         }

//         /* Animated background */
//         .challenges-page::before {
//           content: '';
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           height: 100vh;
//           background: 
//             radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 50%),
//             radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
//             radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
//           z-index: 0;
//           pointer-events: none;
//         }

//         .challenges-content {
//           position: relative;
//           z-index: 1;
//         }

//         /* Header */
//         .challenges-header {
//           padding: 100px 20px 60px;
//           text-align: center;
//           position: relative;
//         }

//         .header-title {
//           font-size: clamp(2.5rem, 8vw, 5rem);
//           font-weight: 900;
//           background: linear-gradient(135deg, #22c55e, #3b82f6, #8b5cf6);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//           margin-bottom: 1.5rem;
//           line-height: 1.2;
//           letter-spacing: -0.02em;
//         }

//         .header-subtitle {
//           font-size: clamp(1rem, 3vw, 1.25rem);
//           color: #94a3b8;
//           max-width: 600px;
//           margin: 0 auto;
//           line-height: 1.6;
//         }

//         /* Stats Grid */
//         .stats-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
//           gap: 1rem;
//           max-width: 600px;
//           margin: 3rem auto;
//           padding: 0 20px;
//         }

//         .stat-card {
//           background: rgba(30, 41, 59, 0.5);
//           backdrop-filter: blur(10px);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 20px;
//           padding: 1.5rem 1rem;
//           text-align: center;
//           transition: all 0.3s ease;
//         }

//         .stat-card:hover {
//           transform: translateY(-5px);
//           border-color: rgba(34, 197, 94, 0.3);
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
//         }

//         .stat-value {
//           font-size: 2.5rem;
//           font-weight: 800;
//           margin-bottom: 0.5rem;
//           background: linear-gradient(135deg, #22c55e, #3b82f6);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//         }

//         .stat-label {
//           font-size: 0.75rem;
//           color: #94a3b8;
//           font-weight: 600;
//           text-transform: uppercase;
//           letter-spacing: 0.05em;
//         }

//         /* Error Message */
//         .error-message {
//           max-width: 600px;
//           margin: 0 auto 2rem;
//           padding: 1rem;
//           background: rgba(239, 68, 68, 0.1);
//           border: 1px solid rgba(239, 68, 68, 0.3);
//           border-radius: 12px;
//           color: #ef4444;
//           text-align: center;
//         }

//         /* Tabs */
//         .tabs-container {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 0.5rem;
//           justify-content: center;
//           margin-bottom: 2rem;
//           padding: 0 20px;
//         }

//         .tab-button {
//           padding: 0.75rem 1.5rem;
//           border-radius: 12px;
//           font-weight: 700;
//           font-size: 0.875rem;
//           border: none;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           background: rgba(30, 41, 59, 0.6);
//           color: #94a3b8;
//           border: 1px solid rgba(255, 255, 255, 0.1);
//         }

//         .tab-button:hover {
//           background: rgba(30, 41, 59, 0.8);
//           color: white;
//         }

//         .tab-button.active {
//           background: linear-gradient(135deg, #22c55e, #3b82f6);
//           color: white;
//           border-color: transparent;
//           box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
//         }

//         .tab-badge {
//           background: rgba(255, 255, 255, 0.2);
//           color: white;
//           font-size: 0.75rem;
//           padding: 0.125rem 0.5rem;
//           border-radius: 9999px;
//           margin-left: 0.25rem;
//         }

//         /* Search and Filters */
//         .search-container {
//           max-width: 600px;
//           margin: 0 auto 1.5rem;
//           padding: 0 20px;
//         }

//         .search-wrapper {
//           position: relative;
//         }

//         .search-icon {
//           position: absolute;
//           left: 1rem;
//           top: 50%;
//           transform: translateY(-50%);
//           color: #64748b;
//         }

//         .search-input {
//           width: 100%;
//           padding: 1rem 1rem 1rem 3rem;
//           background: rgba(30, 41, 59, 0.6);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 12px;
//           color: white;
//           font-size: 1rem;
//           transition: all 0.3s ease;
//         }

//         .search-input:focus {
//           outline: none;
//           border-color: #22c55e;
//           box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
//           background: rgba(30, 41, 59, 0.8);
//         }

//         .filters-container {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 1rem;
//           justify-content: center;
//           margin-bottom: 2rem;
//           padding: 0 20px;
//         }

//         .filter-select {
//           padding: 0.75rem 2rem 0.75rem 1rem;
//           background: rgba(30, 41, 59, 0.6);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 12px;
//           color: white;
//           font-size: 0.875rem;
//           cursor: pointer;
//           appearance: none;
//           background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
//           background-repeat: no-repeat;
//           background-position: right 0.75rem center;
//         }

//         .filter-select:focus {
//           outline: none;
//           border-color: #22c55e;
//           box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
//         }

//         /* Challenges Grid */
//         .challenges-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
//           gap: 1.5rem;
//           padding: 0 20px;
//           margin-bottom: 4rem;
//         }

//         @media (max-width: 768px) {
//           .challenges-grid {
//             grid-template-columns: 1fr;
//           }
//         }

//         .challenge-card {
//           background: rgba(30, 41, 59, 0.5);
//           backdrop-filter: blur(10px);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 24px;
//           padding: 1.5rem;
//           transition: all 0.3s ease;
//           position: relative;
//           overflow: hidden;
//         }

//         .challenge-card:hover {
//           transform: translateY(-5px);
//           border-color: rgba(34, 197, 94, 0.3);
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
//         }

//         .featured-badge {
//           position: absolute;
//           top: 1rem;
//           right: 1rem;
//           background: linear-gradient(135deg, #f59e0b, #d97706);
//           color: white;
//           font-size: 0.7rem;
//           font-weight: 700;
//           padding: 0.25rem 1rem;
//           border-radius: 9999px;
//           letter-spacing: 0.05em;
//         }

//         .challenge-header {
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//           margin-bottom: 1rem;
//         }

//         .challenge-icon {
//           font-size: 2.5rem;
//           width: 3rem;
//           height: 3rem;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: rgba(255, 255, 255, 0.05);
//           border-radius: 16px;
//         }

//         .challenge-title {
//           font-size: 1.25rem;
//           font-weight: 700;
//           color: white;
//           margin: 0;
//           flex: 1;
//         }

//         .difficulty-badge {
//           display: inline-block;
//           padding: 0.25rem 0.75rem;
//           border-radius: 9999px;
//           font-size: 0.7rem;
//           font-weight: 700;
//           text-transform: uppercase;
//           letter-spacing: 0.05em;
//         }

//         .difficulty-easy {
//           background: rgba(34, 197, 94, 0.2);
//           color: #22c55e;
//         }

//         .difficulty-medium {
//           background: rgba(245, 158, 11, 0.2);
//           color: #f59e0b;
//         }

//         .difficulty-hard {
//           background: rgba(239, 68, 68, 0.2);
//           color: #ef4444;
//         }

//         .challenge-description {
//           color: #94a3b8;
//           font-size: 0.875rem;
//           line-height: 1.6;
//           margin-bottom: 1rem;
//         }

//         .challenge-stats {
//           display: flex;
//           gap: 1.5rem;
//           margin-bottom: 1rem;
//           color: #94a3b8;
//           font-size: 0.875rem;
//         }

//         .stat-item {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//         }

//         /* Rules Section */
//         .rules-section {
//           margin-bottom: 1.5rem;
//         }

//         .rules-title {
//           color: #94a3b8;
//           font-size: 0.75rem;
//           font-weight: 600;
//           text-transform: uppercase;
//           letter-spacing: 0.05em;
//           margin-bottom: 0.5rem;
//         }

//         .rules-list {
//           display: flex;
//           flex-direction: column;
//           gap: 0.25rem;
//         }

//         .rule-item {
//           display: flex;
//           align-items: flex-start;
//           gap: 0.5rem;
//           font-size: 0.75rem;
//           color: #cbd5e1;
//         }

//         .rule-bullet {
//           width: 4px;
//           height: 4px;
//           background: #22c55e;
//           border-radius: 50%;
//           margin-top: 0.5rem;
//           flex-shrink: 0;
//         }

//         .rule-text {
//           color: #cbd5e1;
//           line-height: 1.4;
//           word-break: break-word;
//         }

//         .more-rules {
//           color: #64748b;
//           font-size: 0.7rem;
//           margin-top: 0.25rem;
//         }

//         /* Progress */
//         .progress-container {
//           margin-bottom: 1.5rem;
//         }

//         .progress-header {
//           display: flex;
//           justify-content: space-between;
//           margin-bottom: 0.5rem;
//           font-size: 0.875rem;
//         }

//         .progress-label {
//           color: #94a3b8;
//         }

//         .progress-value {
//           color: #22c55e;
//           font-weight: 600;
//         }

//         .progress-bar {
//           height: 6px;
//           background: rgba(255, 255, 255, 0.1);
//           border-radius: 3px;
//           overflow: hidden;
//         }

//         .progress-fill {
//           height: 100%;
//           background: linear-gradient(90deg, #22c55e, #3b82f6);
//           border-radius: 3px;
//           transition: width 0.5s ease;
//         }

//         .streak-indicator {
//           display: flex;
//           align-items: center;
//           gap: 0.25rem;
//           margin-top: 0.5rem;
//           font-size: 0.75rem;
//           color: #f97316;
//         }

//         /* Actions */
//         .challenge-actions {
//           display: flex;
//           gap: 0.5rem;
//         }

//         .action-button {
//           flex: 1;
//           padding: 0.75rem;
//           border-radius: 12px;
//           font-weight: 600;
//           font-size: 0.875rem;
//           border: none;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 0.5rem;
//         }

//         .action-button:disabled {
//           opacity: 0.5;
//           cursor: not-allowed;
//         }

//         .join-button {
//           background: linear-gradient(135deg, #3b82f6, #1d4ed8);
//           color: white;
//         }

//         .join-button:hover:not(:disabled) {
//           transform: translateY(-2px);
//           box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
//         }

//         .verify-button {
//           background: linear-gradient(135deg, #22c55e, #16a34a);
//           color: white;
//         }

//         .verify-button:hover:not(:disabled) {
//           transform: translateY(-2px);
//           box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
//         }

//         .verify-button.completed {
//           background: rgba(34, 197, 94, 0.2);
//           color: #22c55e;
//           cursor: default;
//         }

//         .verify-button.completed:hover {
//           transform: none;
//           box-shadow: none;
//         }

//         .details-button {
//           background: rgba(255, 255, 255, 0.1);
//           color: white;
//           border: 1px solid rgba(255, 255, 255, 0.1);
//         }

//         .details-button:hover {
//           background: rgba(255, 255, 255, 0.15);
//           transform: translateY(-2px);
//         }

//         /* Empty State */
//         .empty-state {
//           grid-column: 1 / -1;
//           text-align: center;
//           padding: 4rem 2rem;
//         }

//         .empty-icon {
//           font-size: 4rem;
//           margin-bottom: 1.5rem;
//           opacity: 0.5;
//         }

//         .empty-title {
//           font-size: 1.5rem;
//           font-weight: 700;
//           color: white;
//           margin-bottom: 0.5rem;
//         }

//         .empty-description {
//           color: #94a3b8;
//           margin-bottom: 2rem;
//         }

//         .empty-button {
//           padding: 0.75rem 2rem;
//           background: linear-gradient(135deg, #22c55e, #3b82f6);
//           border: none;
//           border-radius: 12px;
//           color: white;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         .empty-button:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
//         }

//         /* Loading State */
//         .loading-container {
//           min-height: 60vh;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .loading-spinner {
//           width: 50px;
//           height: 50px;
//           border: 3px solid rgba(255, 255, 255, 0.1);
//           border-top-color: #22c55e;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//         }

//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }

//         /* Modal */
//         .modal-overlay {
//           position: fixed;
//           inset: 0;
//           background: rgba(0, 0, 0, 0.8);
//           backdrop-filter: blur(10px);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 1rem;
//           z-index: 1000;
//         }

//         .modal-content {
//           background: #1e293b;
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 24px;
//           width: 100%;
//           max-width: 500px;
//           max-height: 90vh;
//           overflow-y: auto;
//           position: relative;
//         }

//         .modal-header {
//           padding: 1.5rem;
//           border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//         }

//         .modal-header h2 {
//           font-size: 1.5rem;
//           font-weight: 700;
//           color: white;
//           margin-bottom: 0.25rem;
//         }

//         .modal-header p {
//           color: #94a3b8;
//           font-size: 0.875rem;
//         }

//         .modal-close {
//           position: absolute;
//           top: 1rem;
//           right: 1rem;
//           background: rgba(255, 255, 255, 0.1);
//           border: none;
//           color: white;
//           width: 2.5rem;
//           height: 2.5rem;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         .modal-close:hover {
//           background: rgba(239, 68, 68, 0.2);
//           color: #ef4444;
//         }

//         .modal-body {
//           padding: 1.5rem;
//         }

//         /* Form */
//         .form-group {
//           margin-bottom: 1.5rem;
//         }

//         .form-label {
//           display: block;
//           color: white;
//           font-size: 0.875rem;
//           font-weight: 600;
//           margin-bottom: 0.5rem;
//         }

//         .form-input,
//         .form-textarea,
//         .form-select {
//           width: 100%;
//           padding: 0.75rem 1rem;
//           background: rgba(0, 0, 0, 0.3);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 12px;
//           color: white;
//           font-size: 0.875rem;
//           transition: all 0.3s ease;
//         }

//         .form-input:focus,
//         .form-textarea:focus,
//         .form-select:focus {
//           outline: none;
//           border-color: #22c55e;
//           box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
//         }

//         .form-textarea {
//           min-height: 100px;
//           resize: vertical;
//         }

//         .rule-input-group {
//           display: flex;
//           gap: 0.5rem;
//           margin-bottom: 0.5rem;
//         }

//         .remove-rule {
//           padding: 0.5rem;
//           background: rgba(239, 68, 68, 0.1);
//           border: 1px solid rgba(239, 68, 68, 0.2);
//           border-radius: 8px;
//           color: #ef4444;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         .remove-rule:hover {
//           background: rgba(239, 68, 68, 0.2);
//         }

//         .add-rule-button {
//           padding: 0.5rem 1rem;
//           background: rgba(34, 197, 94, 0.1);
//           border: 1px solid rgba(34, 197, 94, 0.2);
//           border-radius: 8px;
//           color: #22c55e;
//           font-size: 0.875rem;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         .add-rule-button:hover {
//           background: rgba(34, 197, 94, 0.2);
//         }

//         .form-actions {
//           display: flex;
//           gap: 1rem;
//           margin-top: 2rem;
//         }

//         .cancel-button {
//           flex: 1;
//           padding: 0.75rem;
//           background: rgba(255, 255, 255, 0.1);
//           border: none;
//           border-radius: 12px;
//           color: white;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         .cancel-button:hover {
//           background: rgba(255, 255, 255, 0.15);
//         }

//         .submit-button {
//           flex: 1;
//           padding: 0.75rem;
//           background: linear-gradient(135deg, #22c55e, #3b82f6);
//           border: none;
//           border-radius: 12px;
//           color: white;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         .submit-button:hover:not(:disabled) {
//           transform: translateY(-2px);
//           box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
//         }

//         .submit-button:disabled {
//           opacity: 0.5;
//           cursor: not-allowed;
//         }

//         /* Confetti */
//         .confetti-container {
//           position: fixed;
//           inset: 0;
//           pointer-events: none;
//           z-index: 1000;
//         }

//         .confetti {
//           position: absolute;
//           width: 10px;
//           height: 10px;
//           background: linear-gradient(45deg, #22c55e, #3b82f6, #8b5cf6);
//           animation: confetti-fall 2s linear forwards;
//         }

//         @keyframes confetti-fall {
//           0% {
//             transform: translateY(-100px) rotate(0deg);
//             opacity: 1;
//           }
//           100% {
//             transform: translateY(100vh) rotate(720deg);
//             opacity: 0;
//           }
//         }

//         /* Responsive */
//         @media (max-width: 640px) {
//           .stats-grid {
//             grid-template-columns: 1fr;
//           }
          
//           .filters-container {
//             flex-direction: column;
//           }
          
//           .filter-select {
//             width: 100%;
//           }
          
//           .challenge-actions {
//             flex-direction: column;
//           }
          
//           .modal-content {
//             margin: 1rem;
//           }
//         }

//         /* Utilities */
//         .container {
//           max-width: 1400px;
//           margin: 0 auto;
//         }

//         .text-gradient {
//           background: linear-gradient(135deg, #22c55e, #3b82f6);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//         }
//       `}</style>

//       {/* Confetti */}
//       {showConfetti && (
//         <div className="confetti-container">
//           {[...Array(30)].map((_, i) => (
//             <div
//               key={i}
//               className="confetti"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 animationDelay: `${Math.random()}s`,
//                 animationDuration: `${1 + Math.random()}s`,
//                 background: `hsl(${Math.random() * 360}, 100%, 50%)`
//               }}
//             />
//           ))}
//         </div>
//       )}

//       <div className="challenges-content">
//         {/* Header */}
//         <header className="challenges-header">
//           <div className="container">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//             >
//               <h1 className="header-title">Touch Grass Challenges</h1>
//               <p className="header-subtitle">
//                 Build real-world discipline through daily outdoor habits. Join thousands building 
//                 accountability through the simplest, most powerful habit there is.
//               </p>
//             </motion.div>

//             {/* Stats */}
//             <div className="stats-grid">
//               <div className="stat-card">
//                 <div className="stat-value">{stats.totalChallenges}</div>
//                 <div className="stat-label">Challenges</div>
//               </div>
//               <div className="stat-card">
//                 <div className="stat-value">{stats.totalParticipants.toLocaleString()}+</div>
//                 <div className="stat-label">Participants</div>
//               </div>
//               <div className="stat-card">
//                 <div className="stat-value">{stats.activeChallenges}</div>
//                 <div className="stat-label">Your Challenges</div>
//               </div>
//             </div>

//             {/* Verify Today Button - visible when logged in */}
//             {user && (
//               <div style={{ marginTop: '2rem' }}>
//                 <button
//                   onClick={handleVerifyToday}
//                   disabled={isVerifyingToday || todayVerified}
//                   style={{
//                     padding: '1rem 2.5rem',
//                     fontSize: '1.125rem',
//                     fontWeight: '700',
//                     border: 'none',
//                     borderRadius: '16px',
//                     cursor: todayVerified ? 'default' : 'pointer',
//                     background: todayVerified 
//                       ? 'rgba(34, 197, 94, 0.2)' 
//                       : 'linear-gradient(135deg, #22c55e, #16a34a)',
//                     color: todayVerified ? '#22c55e' : 'white',
//                     boxShadow: todayVerified 
//                       ? 'none' 
//                       : '0 10px 25px rgba(34, 197, 94, 0.3)',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '0.5rem',
//                     margin: '0 auto',
//                     transition: 'all 0.3s ease'
//                   }}
//                 >
//                   {isVerifyingToday ? (
//                     <>
//                       <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
//                       Verifying...
//                     </>
//                   ) : todayVerified ? (
//                     <>
//                       <Check size={20} />
//                       Verified Today!
//                     </>
//                   ) : (
//                     <>
//                       <Flame size={20} />
//                       Verify Today
//                     </>
//                   )}
//                 </button>
//                 {currentStreak > 0 && (
//                   <p style={{ marginTop: '0.75rem', color: '#f97316', fontWeight: '600' }}>
//                     🔥 {currentStreak} day streak
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>
//         </header>

//         {/* Main Content */}
//         <main className="container">
//           {/* Error Message */}
//           {error && (
//             <div className="error-message">
//               {error}
//             </div>
//           )}

//           {/* Tabs */}
//           <div className="tabs-container">
//             <button
//               className={`tab-button ${activeTab === 'discover' ? 'active' : ''}`}
//               onClick={() => setActiveTab('discover')}
//             >
//               <Compass size={18} />
//               Discover
//             </button>
            
//             {user && (
//               <button
//                 className={`tab-button ${activeTab === 'my-challenges' ? 'active' : ''}`}
//                 onClick={() => setActiveTab('my-challenges')}
//               >
//                 <Target size={18} />
//                 My Challenges
//                 {userChallenges.length > 0 && (
//                   <span className="tab-badge">{userChallenges.length}</span>
//                 )}
//               </button>
//             )}
            
//             <button
//               className={`tab-button ${activeTab === 'trending' ? 'active' : ''}`}
//               onClick={() => setActiveTab('trending')}
//             >
//               <TrendingUp size={18} />
//               Trending
//             </button>
            
//             {user && (
//               <button
//                 className="tab-button"
//                 onClick={() => setShowCreateModal(true)}
//                 style={{
//                   background: 'linear-gradient(135deg, #f59e0b, #d97706)',
//                   color: 'white',
//                   border: 'none'
//                 }}
//               >
//                 <Plus size={18} />
//                 Create Challenge
//               </button>
//             )}
//           </div>

//           {/* Search */}
//           <div className="search-container">
//             <div className="search-wrapper">
//               <Search className="search-icon" size={20} />
//               <input
//                 type="text"
//                 className="search-input"
//                 placeholder="Search challenges..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Filters */}
//           <div className="filters-container">
//             <select
//               className="filter-select"
//               value={filterCategory}
//               onChange={(e) => setFilterCategory(e.target.value)}
//             >
//               {categories.map(category => (
//                 <option key={category.id} value={category.id}>
//                   {category.icon} {category.name}
//                 </option>
//               ))}
//             </select>

//             <select
//               className="filter-select"
//               value={filterDifficulty}
//               onChange={(e) => setFilterDifficulty(e.target.value)}
//             >
//               {difficulties.map(difficulty => (
//                 <option key={difficulty.id} value={difficulty.id}>
//                   {difficulty.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Loading State */}
//           {isLoading ? (
//             <div className="loading-container">
//               <div className="loading-spinner"></div>
//             </div>
//           ) : (
//             /* Challenges Grid */
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={activeTab + searchQuery + filterCategory + filterDifficulty}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 className="challenges-grid"
//               >
//                 {filteredChallenges.length > 0 ? (
//                   filteredChallenges.map((challenge, index) => {
//                     const hasJoined = hasUserJoinedChallenge(challenge.id || challenge._id);
//                     const progress = getUserProgress(challenge.id || challenge._id);
//                     const verifiedToday = hasVerifiedToday(challenge.id || challenge._id);
//                     const rules = extractRules(challenge);
                    
//                     return (
//                       <motion.div
//                         key={challenge.id || challenge._id || index}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: index * 0.05 }}
//                         className="challenge-card"
//                       >
//                         {/* Featured Badge */}
//                         {challenge.featured && (
//                           <div className="featured-badge">⭐ FEATURED</div>
//                         )}

//                         {/* Header */}
//                         <div className="challenge-header">
//                           <div className="challenge-icon">
//                             {challenge.icon || '🎯'}
//                           </div>
//                           <h3 className="challenge-title">{challenge.name}</h3>
//                         </div>

//                         {/* Difficulty Badge */}
//                         <div className={`difficulty-badge difficulty-${challenge.difficulty || 'medium'}`}>
//                           {challenge.difficulty || 'medium'}
//                         </div>

//                         {/* Description */}
//                         <p className="challenge-description">
//                           {challenge.description}
//                         </p>

//                         {/* Stats */}
//                         <div className="challenge-stats">
//                           <div className="stat-item">
//                             <Users size={14} />
//                             <span>{challenge.participants || 0} joined</span>
//                           </div>
//                           <div className="stat-item">
//                             <Calendar size={14} />
//                             <span>{challenge.duration || 30} days</span>
//                           </div>
//                         </div>

//                         {/* Rules */}
//                         {rules.length > 0 && (
//                           <div className="rules-section">
//                             <div className="rules-title">Rules:</div>
//                             <div className="rules-list">
//                               {rules.slice(0, 2).map((rule, i) => (
//                                 <div key={i} className="rule-item">
//                                   <div className="rule-bullet"></div>
//                                   <span className="rule-text">{String(rule)}</span>
//                                 </div>
//                               ))}
//                               {rules.length > 2 && (
//                                 <div className="more-rules">
//                                   +{rules.length - 2} more rules
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         )}

//                         {/* Progress (if joined) */}
//                         {hasJoined && (
//                           <div className="progress-container">
//                             <div className="progress-header">
//                               <span className="progress-label">Your Progress</span>
//                               <span className="progress-value">
//                                 {progress.totalDays || 0}/{challenge.duration || 30} days
//                               </span>
//                             </div>
//                             <div className="progress-bar">
//                               <div
//                                 className="progress-fill"
//                                 style={{
//                                   width: `${((progress.totalDays || 0) / (challenge.duration || 30)) * 100}%`
//                                 }}
//                               />
//                             </div>
//                             {progress.currentStreak > 0 && (
//                               <div className="streak-indicator">
//                                 <Flame size={14} />
//                                 <span>{progress.currentStreak} day streak</span>
//                               </div>
//                             )}
//                           </div>
//                         )}

//                         {/* Actions */}
//                         <div className="challenge-actions">
//                           {hasJoined ? (
//                             <>
//                               <button
//                                 onClick={() => handleVerifyProgress(challenge.id || challenge._id)}
//                                 disabled={isVerifying || verifiedToday}
//                                 className={`action-button ${verifiedToday ? 'verify-button completed' : 'verify-button'}`}
//                               >
//                                 {isVerifying ? (
//                                   <>
//                                     <Loader2 size={16} className="loading-spinner" />
//                                     Verifying...
//                                   </>
//                                 ) : verifiedToday ? (
//                                   <>
//                                     <CheckCircle size={16} />
//                                     Done Today
//                                   </>
//                                 ) : (
//                                   <>
//                                     <Camera size={16} />
//                                     Verify Today
//                                   </>
//                                 )}
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   setSelectedChallenge(challenge);
//                                   setShowChallengeDetails(true);
//                                 }}
//                                 className="action-button details-button"
//                               >
//                                 <Eye size={16} />
//                                 Details
//                               </button>
//                             </>
//                           ) : (
//                             <button
//                               onClick={() => handleJoinChallenge(challenge)}
//                               disabled={isJoining}
//                               className="action-button join-button"
//                             >
//                               {isJoining ? (
//                                 <>
//                                   <Loader2 size={16} className="loading-spinner" />
//                                   Joining...
//                                 </>
//                               ) : (
//                                 <>
//                                   <UserPlus size={16} />
//                                   Join Challenge
//                                 </>
//                               )}
//                             </button>
//                           )}
//                         </div>
//                       </motion.div>
//                     );
//                   })
//                 ) : (
//                   /* Empty State */
//                   <div className="empty-state">
//                     <div className="empty-icon">🌱</div>
//                     <h3 className="empty-title">No Challenges Found</h3>
//                     <p className="empty-description">
//                       {searchQuery
//                         ? `No challenges match "${searchQuery}"`
//                         : activeTab === 'my-challenges'
//                         ? "You haven't joined any challenges yet"
//                         : "Try different filters or create your own challenge!"}
//                     </p>
//                     {activeTab === 'my-challenges' && (
//                       <button
//                         onClick={() => setActiveTab('discover')}
//                         className="empty-button"
//                       >
//                         Discover Challenges
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </motion.div>
//             </AnimatePresence>
//           )}
//         </main>
//       </div>

//       {/* Create Challenge Modal */}
//       {showCreateModal && (
//         <div className="modal-overlay">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="modal-content"
//           >
//             <button className="modal-close" onClick={() => setShowCreateModal(false)}>
//               <X size={20} />
//             </button>
            
//             <div className="modal-header">
//               <h2>Create New Challenge</h2>
//               <p>Design a challenge for the Touch Grass community</p>
//             </div>
            
//             <div className="modal-body">
//               <div className="form-group">
//                 <label className="form-label">Challenge Name *</label>
//                 <input
//                   type="text"
//                   className="form-input"
//                   value={newChallenge.name}
//                   onChange={(e) => setNewChallenge({...newChallenge, name: e.target.value})}
//                   placeholder="Morning Grounding Routine"
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label className="form-label">Description *</label>
//                 <textarea
//                   className="form-textarea"
//                   value={newChallenge.description}
//                   onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
//                   placeholder="Describe your challenge..."
//                   rows="3"
//                 />
//               </div>
              
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
//                 <div className="form-group">
//                   <label className="form-label">Duration (days)</label>
//                   <input
//                     type="number"
//                     className="form-input"
//                     value={newChallenge.duration}
//                     onChange={(e) => setNewChallenge({...newChallenge, duration: parseInt(e.target.value) || 7})}
//                     min="1"
//                     max="365"
//                   />
//                 </div>
                
//                 <div className="form-group">
//                   <label className="form-label">Difficulty</label>
//                   <select
//                     className="form-select"
//                     value={newChallenge.difficulty}
//                     onChange={(e) => setNewChallenge({...newChallenge, difficulty: e.target.value})}
//                   >
//                     <option value="easy">Easy</option>
//                     <option value="medium">Medium</option>
//                     <option value="hard">Hard</option>
//                   </select>
//                 </div>
//               </div>
              
//               <div className="form-group">
//                 <label className="form-label">Rules</label>
//                 {newChallenge.rules.map((rule, index) => (
//                   <div key={index} className="rule-input-group">
//                     <input
//                       type="text"
//                       className="form-input"
//                       value={rule}
//                       onChange={(e) => {
//                         const newRules = [...newChallenge.rules];
//                         newRules[index] = e.target.value;
//                         setNewChallenge({...newChallenge, rules: newRules});
//                       }}
//                       placeholder={`Rule ${index + 1}`}
//                     />
//                     {index > 0 && (
//                       <button
//                         type="button"
//                         className="remove-rule"
//                         onClick={() => {
//                           const newRules = newChallenge.rules.filter((_, i) => i !== index);
//                           setNewChallenge({...newChallenge, rules: newRules});
//                         }}
//                       >
//                         <X size={16} />
//                       </button>
//                     )}
//                   </div>
//                 ))}
//                 <button
//                   type="button"
//                   className="add-rule-button"
//                   onClick={() => setNewChallenge({...newChallenge, rules: [...newChallenge.rules, '']})}
//                 >
//                   + Add Rule
//                 </button>
//               </div>
              
//               <div className="form-actions">
//                 <button
//                   className="cancel-button"
//                   onClick={() => setShowCreateModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="submit-button"
//                   onClick={handleCreateChallenge}
//                   disabled={isJoining}
//                 >
//                   {isJoining ? (
//                     <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
//                       <Loader2 size={16} className="loading-spinner" />
//                       Creating...
//                     </span>
//                   ) : 'Create Challenge'}
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       )}

//       {/* Challenge Details Modal */}
//       {showChallengeDetails && selectedChallenge && (
//         <div className="modal-overlay">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="modal-content"
//             style={{ maxWidth: '600px' }}
//           >
//             <button className="modal-close" onClick={() => setShowChallengeDetails(false)}>
//               <X size={20} />
//             </button>
            
//             <div className="modal-header">
//               <h2>{selectedChallenge.name}</h2>
//               <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
//                 <span className={`difficulty-badge difficulty-${selectedChallenge.difficulty || 'medium'}`}>
//                   {selectedChallenge.difficulty || 'medium'}
//                 </span>
//                 <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
//                   {selectedChallenge.duration} days
//                 </span>
//                 <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
//                   {selectedChallenge.participants} participants
//                 </span>
//               </div>
//             </div>
            
//             <div className="modal-body">
//               <div style={{ marginBottom: '1.5rem' }}>
//                 <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Description</h3>
//                 <p style={{ color: '#94a3b8' }}>{selectedChallenge.description}</p>
//               </div>
              
//               <div style={{ marginBottom: '1.5rem' }}>
//                 <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Rules</h3>
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
//                   {extractRules(selectedChallenge).map((rule, i) => (
//                     <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
//                       <CheckCircle size={16} style={{ color: '#22c55e', marginTop: '0.125rem', flexShrink: 0 }} />
//                       <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{String(rule)}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
              
//               {hasUserJoinedChallenge(selectedChallenge.id || selectedChallenge._id) && (
//                 <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
//                   <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Your Progress</h3>
//                   {(() => {
//                     const progress = getUserProgress(selectedChallenge.id || selectedChallenge._id);
//                     const verifiedToday = hasVerifiedToday(selectedChallenge.id || selectedChallenge._id);
                    
//                     return (
//                       <>
//                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
//                           <span style={{ color: '#94a3b8' }}>Days completed</span>
//                           <span style={{ color: '#22c55e', fontWeight: '600' }}>
//                             {progress.totalDays || 0}/{selectedChallenge.duration}
//                           </span>
//                         </div>
//                         <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '1rem' }}>
//                           <div
//                             style={{
//                               height: '100%',
//                               width: `${((progress.totalDays || 0) / selectedChallenge.duration) * 100}%`,
//                               background: 'linear-gradient(90deg, #22c55e, #3b82f6)',
//                               borderRadius: '3px'
//                             }}
//                           />
//                         </div>
//                         <div style={{ display: 'flex', gap: '1rem' }}>
//                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
//                             <Flame size={16} style={{ color: '#f97316' }} />
//                             <span style={{ color: '#f97316', fontWeight: '600' }}>{progress.currentStreak || 0}</span>
//                             <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>day streak</span>
//                           </div>
//                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
//                             <Trophy size={16} style={{ color: '#eab308' }} />
//                             <span style={{ color: '#eab308', fontWeight: '600' }}>{progress.longestStreak || 0}</span>
//                             <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>best</span>
//                           </div>
//                         </div>
//                         {verifiedToday && (
//                           <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22c55e' }}>
//                             <CheckCircle size={16} />
//                             <span style={{ fontSize: '0.875rem' }}>Verified today</span>
//                           </div>
//                         )}
//                       </>
//                     );
//                   })()}
//                 </div>
//               )}
              
//               <div className="form-actions">
//                 <button
//                   className="cancel-button"
//                   onClick={() => setShowChallengeDetails(false)}
//                 >
//                   Close
//                 </button>
                
//                 {!hasUserJoinedChallenge(selectedChallenge.id || selectedChallenge._id) && (
//                   <button
//                     className="submit-button"
//                     onClick={() => {
//                       setShowChallengeDetails(false);
//                       handleJoinChallenge(selectedChallenge);
//                     }}
//                     disabled={isJoining}
//                   >
//                     {isJoining ? 'Joining...' : 'Join Challenge'}
//                   </button>
//                 )}
//               </div>
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
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import { useStreak } from '../contexts/StreakContext';
import unifiedChallengeService from '../services/unifiedChallengeService';
import streakService from '../services/streakservice';
import {
  Trophy, Users, TrendingUp, Calendar, Target, Sparkles,
  Clock, Award, Activity, Camera, CheckCircle2, Plus,
  Search, Filter, Heart, Zap, ChevronRight, ChevronLeft,
  Eye, UserPlus, Home, User, Edit, MapPin, Bell,
  CheckCircle, ChevronDown, ChevronUp, X, Loader2,
  Compass, Footprints, Leaf, Dumbbell, Brain,
  Flame, Sunrise, Sunset, Globe, Smartphone,
  CheckSquare, XSquare, ExternalLink, Check, Volume2
} from 'lucide-react';

// Sound effect function for notification
const playNotificationSound = () => {
  try {
    const audio = new Audio('/sounds/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => console.log('Audio play failed:', err));
  } catch (error) {
    console.log('Audio error:', error);
  }
};

// ==================== DEFAULT CHALLENGES (Fallback only) ====================
const DEFAULT_CHALLENGES = [
  {
    id: 'default-1',
    name: "Morning Grounding",
    type: "mindfulness",
    description: "Start your day standing barefoot on grass for 10 minutes while breathing deeply. Connect with the earth and set a positive intention for your day.",
    duration: 30,
    rules: [
      "10 minutes barefoot on grass",
      "Deep breathing throughout",
      "No phone during routine",
      "Observe 3 things around you"
    ],
    difficulty: "medium",
    icon: "🎯",
    category: "mindfulness",
    participants: 1251,
    featured: true
  },
  {
    id: 'default-2',
    name: "Daily Sunset Watch",
    type: "routine",
    description: "Watch sunset every evening without distractions for 15 minutes. Unwind and appreciate the beauty of the day ending.",
    duration: 21,
    rules: [
      "15 minutes sunset watch",
      "No screens allowed",
      "Document sky colors",
      "Share one reflection"
    ],
    difficulty: "medium",
    icon: "🎯",
    category: "mindfulness",
    participants: 891,
    featured: false
  },
  {
    id: 'default-3',
    name: "Park Bench Meditation",
    type: "meditation",
    description: "Meditate on a park bench for 20 minutes daily, focusing on natural sounds around you.",
    duration: 14,
    rules: [
      "Find different benches",
      "20 minutes meditation",
      "Focus on natural sounds",
      "No guided apps"
    ],
    difficulty: "medium",
    icon: "🎯",
    category: "mindfulness",
    participants: 671,
    featured: false
  },
  {
    id: 'default-4',
    name: "Daily Walk Challenge",
    type: "fitness",
    description: "Take a 10-minute walk every day for 7 days",
    duration: 7,
    rules: [
      "10 minute walk",
      "Outdoors only",
      "Track your steps",
      "Enjoy nature"
    ],
    difficulty: "medium",
    icon: "🎯",
    category: "fitness",
    participants: 2,
    featured: false
  },
  {
    id: 'default-5',
    name: "Morning Meditation",
    type: "mindfulness",
    description: "Meditate for 5 minutes each morning for 30 days",
    duration: 30,
    rules: [
      "5 minute meditation",
      "Morning routine",
      "Focus on breath",
      "Set intention"
    ],
    difficulty: "medium",
    icon: "🎯",
    category: "mindfulness",
    participants: 2,
    featured: false
  },
  {
    id: 'default-6',
    name: "Bird Song Morning",
    type: "awareness",
    description: "Spend 10 minutes each morning identifying bird songs. Tune into nature's music.",
    duration: 14,
    rules: [
      "10 min bird listening",
      "Identify 3 songs",
      "Note the birds",
      "No headphones"
    ],
    difficulty: "medium",
    icon: "🎯",
    category: "awareness",
    participants: 721,
    featured: false
  },
  {
    id: 'default-7',
    name: "Digital Sunset",
    type: "detox",
    description: "No screens 1 hour before bed, replace with evening outdoor time. Improve sleep and connection.",
    duration: 21,
    rules: [
      "No screens 60+ min",
      "Outdoor time",
      "Stargaze or walk",
      "Better sleep"
    ],
    difficulty: "medium",
    icon: "🎯",
    category: "detox",
    participants: 1251,
    featured: false
  },
  {
    id: 'default-8',
    name: "Silent Nature Walk",
    type: "mindfulness",
    description: "Walk 30 minutes in nature without any technology or talking. Experience true peace.",
    duration: 7,
    rules: [
      "30 min silent walk",
      "No phone/music",
      "No talking",
      "Observe nature"
    ],
    difficulty: "medium",
    icon: "🎯",
    category: "mindfulness",
    participants: 981,
    featured: false
  },
  {
    id: 'default-9',
    name: "Weather Warrior",
    type: "discipline",
    description: "Go outside 15 minutes daily regardless of weather conditions. Build unstoppable discipline.",
    duration: 30,
    rules: [
      "15 min outside",
      "Any weather",
      "Document conditions",
      "No excuses"
    ],
    difficulty: "medium",
    icon: "🎯",
    category: "discipline",
    participants: 321,
    featured: false
  },
  {
    id: 'default-10',
    name: "Tree Identification",
    type: "learning",
    description: "Learn to identify 7 different tree species in your local area. Become familiar with nature around you.",
    duration: 7,
    rules: [
      "Identify 7 trees",
      "Learn leaf shapes",
      "Take photos",
      "Learn one fact each"
    ],
    difficulty: "medium",
    icon: "🎯",
    category: "learning",
    participants: 431,
    featured: false
  },
  {
    id: 'default-11',
    name: "5-Bench Circuit",
    type: "exploration",
    description: "Visit and sit on 5 different public benches in your neighborhood. Explore your area.",
    duration: 1,
    rules: [
      "Find 5 benches",
      "Sit 3 min each",
      "No phone",
      "Observe the view"
    ],
    difficulty: "medium",
    icon: "🎯",
    category: "exploration",
    participants: 561,
    featured: false
  },
  {
    id: 'default-12',
    name: "Gratitude Grounding",
    type: "mindfulness",
    description: "Stand on grass and list 10 things you're grateful for daily. Combine physical and mental wellness.",
    duration: 30,
    rules: [
      "Stand on grass",
      "List 10 gratitudes",
      "Deep breathing",
      "Feel the ground"
    ],
    difficulty: "medium",
    icon: "🎯",
    category: "mindfulness",
    participants: 891,
    featured: false
  }
];

// ==================== MAIN COMPONENT ====================
const Challenges = () => {
  const { user } = useContext(AuthContext);
  const { streakData, currentStreak, todayVerified, loadStreakData } = useStreak();
  const navigate = useNavigate();
  
  // UI State
  const [activeTab, setActiveTab] = useState('discover');
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
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
  const [error, setError] = useState(null);
  const [networkError, setNetworkError] = useState(false);
  
  // New challenge form state
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

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Categories', icon: '🌍' },
    { id: 'mindfulness', name: 'Mindfulness', icon: '🧠' },
    { id: 'exploration', name: 'Exploration', icon: '🧭' },
    { id: 'discipline', name: 'Discipline', icon: '🎯' },
    { id: 'detox', name: 'Digital Detox', icon: '📵' },
    { id: 'fitness', name: 'Fitness', icon: '💪' },
    { id: 'social', name: 'Social', icon: '👥' },
    { id: 'community', name: 'Community', icon: '❤️' }
  ];

  // Difficulties for filtering
  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'easy', name: 'Easy' },
    { id: 'medium', name: 'Medium' },
    { id: 'hard', name: 'Hard' }
  ];

  // =========================================
  // HELPER FUNCTIONS
  // =========================================

  /**
   * Safely extract rules array from challenge object
   */
  const extractRules = (challenge) => {
    if (!challenge) return [];
    
    try {
      if (Array.isArray(challenge.rules)) {
        return challenge.rules.filter(r => r && typeof r === 'string');
      }
      
      if (challenge.rules && typeof challenge.rules === 'object') {
        if (challenge.rules.targetStreak !== undefined) {
          const rulesArray = [];
          if (challenge.rules.targetStreak) {
            rulesArray.push(`Maintain a ${challenge.rules.targetStreak}-day streak`);
          }
          if (challenge.rules.targetDuration) {
            rulesArray.push(`${challenge.rules.targetDuration} minutes daily`);
          }
          if (challenge.rules.targetConsistency) {
            rulesArray.push(`${challenge.rules.targetConsistency}% consistency required`);
          }
          if (challenge.rules.minDailyTime) {
            rulesArray.push(`Minimum ${challenge.rules.minDailyTime} minutes per day`);
          }
          if (challenge.rules.allowedVerificationMethods && Array.isArray(challenge.rules.allowedVerificationMethods)) {
            rulesArray.push(`Verification: ${challenge.rules.allowedVerificationMethods.join(', ')}`);
          }
          return rulesArray.filter(r => r);
        }
        
        return Object.values(challenge.rules)
          .filter(v => v && (typeof v === 'string' || typeof v === 'number'))
          .map(v => String(v));
      }
      
      if (typeof challenge.rules === 'string') {
        return challenge.rules.split('\n').filter(r => r.trim());
      }
      
      if (challenge.metadata?.customRules) {
        if (typeof challenge.metadata.customRules === 'string') {
          return challenge.metadata.customRules.split('\n').filter(r => r.trim());
        }
      }
      
      if (challenge.rulesString && typeof challenge.rulesString === 'string') {
        return challenge.rulesString.split('\n').filter(r => r.trim());
      }
    } catch (e) {
      console.warn('Error extracting rules:', e);
    }
    
    return [];
  };

  /**
   * Check if user has already joined a challenge
   */
  const hasUserJoinedChallenge = (challengeId) => {
    if (!user || !userChallenges.length || !challengeId) return false;
    
    return userChallenges.some(c => 
      String(c.id) === String(challengeId) || 
      String(c._id) === String(challengeId) ||
      String(c.challengeId) === String(challengeId)
    );
  };

  /**
   * Get user's progress for a specific challenge
   */
  const getUserProgress = (challengeId) => {
    if (!user || !userChallenges.length || !challengeId) {
      return { streak: 0, progress: 0, totalDays: 0, currentStreak: 0, longestStreak: 0 };
    }
    
    const userChallenge = userChallenges.find(c => 
      String(c.id) === String(challengeId) || 
      String(c._id) === String(challengeId) ||
      String(c.challengeId) === String(challengeId)
    );
    
    if (!userChallenge) {
      return { streak: 0, progress: 0, totalDays: 0, currentStreak: 0, longestStreak: 0 };
    }
    
    // Calculate total days based on completedDays array or progress
    let totalDays = 0;
    
    if (userChallenge.totalProgress !== undefined && userChallenge.totalProgress > 0) {
      totalDays = userChallenge.totalProgress;
    } else if (userChallenge.progress !== undefined && userChallenge.progress > 0) {
      totalDays = userChallenge.progress;
    } else if (userChallenge.completedDays && Array.isArray(userChallenge.completedDays)) {
      totalDays = userChallenge.completedDays.length;
    } else if (userChallenge.dailyProgress) {
      const completedCount = Object.values(userChallenge.dailyProgress || {}).filter(
        day => day && (day === true || day?.completed === true)
      ).length;
      if (completedCount > 0) {
        totalDays = completedCount;
      }
    }
    
    const currentStreakVal = userChallenge.currentStreak || userChallenge.streak || 0;
    const longestStreakVal = userChallenge.longestStreak || 0;
    
    return {
      streak: currentStreakVal,
      progress: totalDays,
      totalDays: totalDays,
      currentStreak: currentStreakVal,
      longestStreak: longestStreakVal,
      completedToday: hasVerifiedToday(challengeId)
    };
  };

  /**
   * Check if user has verified a challenge today
   */
  const hasVerifiedToday = (challengeId) => {
    if (!user || !userChallenges.length || !challengeId) return false;
    
    const today = new Date().toISOString().split('T')[0];
    
    const userChallenge = userChallenges.find(c => 
      String(c.id) === String(challengeId) || 
      String(c._id) === String(challengeId) ||
      String(c.challengeId) === String(challengeId)
    );
    
    if (!userChallenge) return false;
    
    if (userChallenge.completedToday === true) {
      return true;
    }
    
    if (userChallenge.dailyProgress && userChallenge.dailyProgress[today]) {
      const dayData = userChallenge.dailyProgress[today];
      if (dayData === true || (typeof dayData === 'object' && dayData?.completed === true)) {
        return true;
      }
    }
    
    if (Array.isArray(userChallenge.completedDays) && userChallenge.completedDays.includes(today)) {
      return true;
    }
    
    if (userChallenge.progressByDate && userChallenge.progressByDate[today]) {
      return true;
    }
    
    if (userChallenge.lastActivity) {
      const lastActivityDate = new Date(userChallenge.lastActivity).toISOString().split('T')[0];
      if (lastActivityDate === today) {
        return true;
      }
    }
    
    return false;
  };

  /**
   * Get filtered challenges based on active tab and filters
   */
  const getFilteredChallenges = () => {
    let source = [];
    
    if (activeTab === 'my-challenges') {
      source = userChallenges;
    } else if (activeTab === 'trending') {
      source = [...challenges].sort((a, b) => (b.participants || 0) - (a.participants || 0));
    } else {
      source = challenges;
    }
    
    return source.filter(challenge => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const nameMatch = challenge.name?.toLowerCase().includes(query);
        const descMatch = challenge.description?.toLowerCase().includes(query);
        if (!nameMatch && !descMatch) return false;
      }

      if (filterDifficulty !== 'all' && challenge.difficulty !== filterDifficulty) {
        return false;
      }

      if (filterCategory !== 'all' && challenge.category !== filterCategory) {
        return false;
      }

      return true;
    });
  };

  // =========================================
  // DATA LOADING FUNCTIONS
  // =========================================

  /**
   * Load all challenge data from backend using unifiedChallengeService
   */
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    setNetworkError(false);

    try {
      if (user?.email) {
        unifiedChallengeService.init(user.email, user.id);
      }

      console.log('📡 Fetching available challenges...');
      const availableChallenges = await unifiedChallengeService.getAvailableChallenges();
      console.log('✅ Available challenges loaded:', availableChallenges?.length || 0);
      
      if (availableChallenges && availableChallenges.length > 0) {
        setChallenges(availableChallenges);
      } else {
        console.log('⚠️ No challenges from backend, using defaults');
        setChallenges(DEFAULT_CHALLENGES);
      }

      if (user) {
        console.log('📡 Fetching user challenges...');
        const userResponse = await unifiedChallengeService.getMyChallenges();
        console.log('✅ User challenges loaded:', userResponse.challenges?.length || 0);
        
        if (userResponse.success) {
          setUserChallenges(userResponse.challenges);
        }

        const today = new Date().toISOString().split('T')[0];
        console.log('📡 Fetching daily check-ins for:', today);
        const checkinsResponse = await unifiedChallengeService.getDailyCheckins(today);
        console.log('✅ Daily check-ins loaded:', checkinsResponse.data?.length || 0);
        
        if (checkinsResponse.success) {
          setDailyCheckins(checkinsResponse.data);
        }
      }
    } catch (error) {
      console.error('❌ Error loading challenge data:', error);
      
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        setNetworkError(true);
        setError('Network error. Please check your internet connection.');
      } else {
        setError('Failed to load challenges. Please refresh the page.');
      }
      
      toast.error('Failed to load challenges');
      setChallenges(DEFAULT_CHALLENGES);
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================
  // CHALLENGE ACTIONS
  // =========================================

  /**
   * Handle joining a challenge
   */
  const handleJoinChallenge = async (challenge) => {
    if (!user) {
      toast.error('Please login to join challenges');
      navigate('/auth');
      return;
    }

    setIsJoining(true);
    try {
      console.log('📡 Joining challenge:', challenge.id, challenge.name);
      
      const response = await unifiedChallengeService.joinChallenge(challenge.id || challenge._id);
      console.log('📡 Join response:', response);
      
      if (response.success) {
        toast.success(`🎉 Joined "${challenge.name}"!`);
        await loadData();
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        toast.error(response.message || 'Failed to join challenge');
      }
    } catch (error) {
      console.error('❌ Error joining challenge:', error);
      
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        toast.error('Network error. Please check your internet connection.');
      } else {
        toast.error('Failed to join challenge. Please try again.');
      }
    } finally {
      setIsJoining(false);
    }
  };

  /**
   * Handle verifying daily progress for a challenge - Shows cool toast with sound
   */
  const handleVerifyProgress = async (challengeId) => {
    if (!user) {
      toast.error('Please login to verify progress');
      navigate('/auth');
      return;
    }

    // Play notification sound
    playNotificationSound();
    
    // Show message to verify from profile page instead
    console.log('handleVerifyProgress called with challengeId:', challengeId);
    
    const userName = user?.name || user?.username || 'Champion';
    const firstName = userName.split(' ')[0];
    
    // Use react-hot-toast with enhanced cool styling
    toast(
      <div className="text-center px-2 py-1" style={{ minWidth: '280px' }}>
        {/* Animated header with glow effect */}
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
            borderRadius: '50%',
            filter: 'blur(20px)',
            opacity: 0.5,
            animation: 'pulse 2s ease-in-out infinite'
          }} />
          <div style={{ fontSize: '2.5rem', position: 'relative', animation: 'bounce 1s ease-in-out infinite' }}>
            🌿
          </div>
        </div>
        
        {/* Personalized greeting with respect */}
        <div style={{ 
          fontSize: '1.25rem', 
          fontWeight: '700', 
          color: '#ffffff',
          marginBottom: '4px',
          background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Hey {firstName}! 👋
        </div>
        
        {/* Main message */}
        <div style={{ fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '12px', lineHeight: '1.5' }}>
          Your outdoor verification happens on your{' '}
          <span style={{ color: '#22c55e', fontWeight: '700' }}>Profile page</span>! 
          <br />
          Snap a photo there to keep your streak alive and earn those sweet badges! 🏆
        </div>
        
        {/* CTA Button with gradient */}
        <button 
          onClick={() => navigate('/profile')}
          style={{
            marginTop: '8px',
            padding: '10px 24px',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            border: 'none',
            borderRadius: '9999px',
            color: 'white',
            fontWeight: '700',
            fontSize: '0.875rem',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          🚀 Go to Profile
        </button>
        
        {/* Fun footer */}
        <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#64748b' }}>
          Let's grow those streaks! 🌱
        </div>
      </div>,
      {
        duration: 10000,
        style: {
          background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
          border: '2px solid #22c55e',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(34, 197, 94, 0.2)',
          maxWidth: '350px'
        },
        iconTheme: {
          primary: '#22c55e',
          secondary: '#fff',
        },
      }
    );
    return;

    // Check if user has actually joined this challenge
    const hasJoined = hasUserJoinedChallenge(challengeId);
    if (!hasJoined) {
      toast.error('You have not joined this challenge');
      return;
    }

    // Check if already verified today
    if (hasVerifiedToday(challengeId)) {
      toast.success('✅ Already verified this challenge today!');
      return;
    }

    setIsVerifying(true);
    try {
      console.log('📡 Verifying progress for challenge:', challengeId);
      
      // Find the challenge details for logging
      const challenge = userChallenges.find(c => 
        String(c.id) === String(challengeId) || 
        String(c._id) === String(challengeId) ||
        String(c.challengeId) === String(challengeId)
      );
      console.log('📡 Challenge details:', challenge);
      
      const response = await unifiedChallengeService.verifyProgress(challengeId, {
        notes: "Verified via TouchGrass app",
        verificationMethod: "manual"
      });

      console.log('📡 Verify response:', response);

      if (response.success) {
        if (response.alreadyDone) {
          toast.success('✅ Already verified today!');
        } else {
          toast.success('✅ Progress verified! Keep going!');
        }
        
        await loadData();
        setRefreshKey(prev => prev + 1);

        if (response.data?.currentStreak === 7 || 
            response.data?.currentStreak === 30 || 
            response.data?.currentStreak === 100) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }

        if (response.data?.currentStreak === 7) {
          toast.success('🎉 7-day streak! Weekly Warrior!');
        } else if (response.data?.currentStreak === 30) {
          toast.success('🏆 30-day streak! Monthly Master!');
        } else if (response.data?.currentStreak === 100) {
          toast.success('💯 100-day streak! Century Champion!');
        }
      } else {
        console.error('❌ Verification failed:', response);
        
        if (response.message === 'Challenge not found or not joined') {
          toast.error('You need to join this challenge first');
        } else if (response.message && response.message.includes('Network error')) {
          toast.error('Network error. Please check your internet connection.');
        } else {
          toast.error(response.message || 'Failed to verify progress');
        }
      }
    } catch (error) {
      console.error('❌ Error verifying progress:', error);
      
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        toast.error('Network error. Please check your internet connection.');
      } else {
        toast.error('Failed to verify progress. Please try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * Handle creating a new challenge
   */
  const handleCreateChallenge = async () => {
    if (!user) {
      toast.error('Please login to create challenges');
      navigate('/auth');
      return;
    }

    if (!newChallenge.name.trim() || !newChallenge.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsJoining(true);
    try {
      console.log('📡 Creating new challenge:', newChallenge.name);
      
      const response = await unifiedChallengeService.createChallenge({
        name: newChallenge.name,
        description: newChallenge.description,
        duration: newChallenge.duration,
        rules: newChallenge.rules.filter(r => r.trim()),
        difficulty: newChallenge.difficulty,
        type: newChallenge.type,
        category: newChallenge.category,
        icon: newChallenge.icon
      });
      
      console.log('📡 Create challenge response:', response);
      
      if (response.success) {
        toast.success('🎉 Challenge created successfully!');
        
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
        toast.error(response.message || 'Failed to create challenge');
      }
    } catch (error) {
      console.error('❌ Error creating challenge:', error);
      
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        toast.error('Network error. Please check your internet connection.');
      } else {
        toast.error('Failed to create challenge');
      }
    } finally {
      setIsJoining(false);
    }
  };

  // Retry loading data after network error
  const handleRetry = () => {
    loadData();
  };

  // =========================================
  // EFFECTS
  // =========================================

  useEffect(() => {
    loadData();
    
    const handleOnline = () => {
      console.log('📡 Network reconnected, reloading data...');
      loadData();
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [user]);

  // =========================================
  // RENDER
  // =========================================

  const filteredChallenges = getFilteredChallenges();
  const stats = {
    totalChallenges: challenges.length,
    totalParticipants: challenges.reduce((sum, c) => sum + (c.participants || 0), 0),
    activeChallenges: userChallenges.length
  };

  return (
    <div className="challenges-page">
      <style>{`
        /* ==================== CHALLENGES PAGE CSS ==================== */
        
        .challenges-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0b1120 0%, #1a1f2e 50%, #0b1120 100%);
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* Animated background */
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

        /* Header */
        .challenges-header {
          padding: 100px 20px 60px;
          text-align: center;
          position: relative;
        }

        .header-title {
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 900;
          background: linear-gradient(135deg, #22c55e, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .header-subtitle {
          font-size: clamp(1rem, 3vw, 1.25rem);
          color: #94a3b8;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          max-width: 600px;
          margin: 3rem auto;
          padding: 0 20px;
        }

        .stat-card {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 1.5rem 1rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          border-color: rgba(34, 197, 94, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #22c55e, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Error Message */
        .error-message {
          max-width: 600px;
          margin: 0 auto 2rem;
          padding: 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          color: #ef4444;
          text-align: center;
        }

        .retry-button {
          margin-top: 1rem;
          padding: 0.5rem 1.5rem;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .retry-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
        }

        /* Tabs */
        .tabs-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 2rem;
          padding: 0 20px;
        }

        .tab-button {
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 700;
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
          color: white;
        }

        .tab-button.active {
          background: linear-gradient(135deg, #22c55e, #3b82f6);
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
          margin: 0 auto 1.5rem;
          padding: 0 20px;
        }

        .search-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
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

        .filters-container {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
          padding: 0 20px;
        }

        .filter-select {
          padding: 0.75rem 2rem 0.75rem 1rem;
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 0.875rem;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
        }

        .filter-select:focus {
          outline: none;
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }

        /* Challenges Grid */
        .challenges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
          padding: 0 20px;
          margin-bottom: 4rem;
        }

        @media (max-width: 768px) {
          .challenges-grid {
            grid-template-columns: 1fr;
          }
        }

        .challenge-card {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .challenge-card:hover {
          transform: translateY(-5px);
          border-color: rgba(34, 197, 94, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .featured-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.25rem 1rem;
          border-radius: 9999px;
          letter-spacing: 0.05em;
        }

        .challenge-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .challenge-icon {
          font-size: 2.5rem;
          width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
        }

        .challenge-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          margin: 0;
          flex: 1;
        }

        .difficulty-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
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
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .challenge-stats {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1rem;
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Rules Section */
        .rules-section {
          margin-bottom: 1.5rem;
        }

        .rules-title {
          color: #94a3b8;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .rules-list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .rule-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #cbd5e1;
        }

        .rule-bullet {
          width: 4px;
          height: 4px;
          background: #22c55e;
          border-radius: 50%;
          margin-top: 0.5rem;
          flex-shrink: 0;
        }

        .rule-text {
          color: #cbd5e1;
          line-height: 1.4;
          word-break: break-word;
        }

        .more-rules {
          color: #64748b;
          font-size: 0.7rem;
          margin-top: 0.25rem;
        }

        /* Progress */
        .progress-container {
          margin-bottom: 1.5rem;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .progress-label {
          color: #94a3b8;
        }

        .progress-value {
          color: #22c55e;
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

        .streak-indicator {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #f97316;
        }

        /* Actions */
        .challenge-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-button {
          flex: 1;
          padding: 0.75rem;
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
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
        }

        .join-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
        }

        .verify-button {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
        }

        .verify-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
        }

        .verify-button.completed {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          cursor: default;
        }

        .verify-button.completed:hover {
          transform: none;
          box-shadow: none;
        }

        .details-button {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .details-button:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        /* Empty State */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
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
        }

        .empty-button {
          padding: 0.75rem 2rem;
          background: linear-gradient(135deg, #22c55e, #3b82f6);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .empty-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
        }

        /* Loading State */
        .loading-container {
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 1rem;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: #22c55e;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          color: #94a3b8;
          font-size: 0.875rem;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          z-index: 1000;
        }

        .modal-content {
          background: #1e293b;
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

        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.25rem;
        }

        .modal-header p {
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .modal-body {
          padding: 1.5rem;
        }

        /* Form */
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

        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .rule-input-group {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .remove-rule {
          padding: 0.5rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
          color: #ef4444;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .remove-rule:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .add-rule-button {
          padding: 0.5rem 1rem;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 8px;
          color: #22c55e;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-rule-button:hover {
          background: rgba(34, 197, 94, 0.2);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .cancel-button {
          flex: 1;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-button:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .submit-button {
          flex: 1;
          padding: 0.75rem;
          background: linear-gradient(135deg, #22c55e, #3b82f6);
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

        /* Confetti */
        .confetti-container {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1000;
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          background: linear-gradient(45deg, #22c55e, #3b82f6, #8b5cf6);
          animation: confetti-fall 2s linear forwards;
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        /* Responsive */
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .filters-container {
            flex-direction: column;
          }
          
          .filter-select {
            width: 100%;
          }
          
          .challenge-actions {
            flex-direction: column;
          }
          
          .modal-content {
            margin: 1rem;
          }
        }

        /* Utilities */
        .container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .text-gradient {
          background: linear-gradient(135deg, #22c55e, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Confetti */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random()}s`,
                animationDuration: `${1 + Math.random()}s`,
                background: `hsl(${Math.random() * 360}, 100%, 50%)`
              }}
            />
          ))}
        </div>
      )}

      <div className="challenges-content">
        {/* Header */}
        <header className="challenges-header">
          <div className="container">
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
            </motion.div>

            {/* Stats */}
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

            {user && currentStreak > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ color: '#f97316', fontWeight: '600', fontSize: '1.125rem' }}>
                  🔥 {currentStreak} day streak
                </p>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="container">
          {/* Error Message */}
          {error && (
            <div className="error-message">
              {error}
              {networkError && (
                <button
                  className="retry-button"
                  onClick={handleRetry}
                >
                  Retry
                </button>
              )}
            </div>
          )}

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
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  border: 'none'
                }}
              >
                <Plus size={18} />
                Create Challenge
              </button>
            )}
          </div>

          {/* Search and Filters */}
          <div className="search-container">
            <div className="search-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                className="search-input"
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="filters-container">
            <select
              className="filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
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

          {/* Loading State */}
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <div className="loading-text">Loading challenges...</div>
            </div>
          ) : (
            /* Challenges Grid */
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + searchQuery + filterCategory + filterDifficulty + refreshKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="challenges-grid"
              >
                {filteredChallenges.length > 0 ? (
                  filteredChallenges.map((challenge, index) => {
                    const hasJoined = hasUserJoinedChallenge(challenge.id || challenge._id);
                    const progress = getUserProgress(challenge.id || challenge._id);
                    const verifiedToday = hasVerifiedToday(challenge.id || challenge._id);
                    const rules = extractRules(challenge);
                    
                    return (
                      <motion.div
                        key={challenge.id || challenge._id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="challenge-card"
                      >
                        {challenge.featured && (
                          <div className="featured-badge">⭐ FEATURED</div>
                        )}

                        <div className="challenge-header">
                          <div className="challenge-icon">
                            {challenge.icon || '🎯'}
                          </div>
                          <h3 className="challenge-title">{challenge.name}</h3>
                        </div>

                        <div className={`difficulty-badge difficulty-${challenge.difficulty || 'medium'}`}>
                          {challenge.difficulty || 'medium'}
                        </div>

                        <p className="challenge-description">
                          {challenge.description}
                        </p>

                        <div className="challenge-stats">
                          <div className="stat-item">
                            <Users size={14} />
                            <span>{challenge.participants || 0} joined</span>
                          </div>
                          <div className="stat-item">
                            <Calendar size={14} />
                            <span>{challenge.duration || 30} days</span>
                          </div>
                        </div>

                        {rules.length > 0 && (
                          <div className="rules-section">
                            <div className="rules-title">Rules:</div>
                            <div className="rules-list">
                              {rules.slice(0, 2).map((rule, i) => (
                                <div key={i} className="rule-item">
                                  <div className="rule-bullet"></div>
                                  <span className="rule-text">{String(rule)}</span>
                                </div>
                              ))}
                              {rules.length > 2 && (
                                <div className="more-rules">
                                  +{rules.length - 2} more rules
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {hasJoined && (
                          <div className="progress-container">
                            <div className="progress-header">
                              <span className="progress-label">Your Progress</span>
                              <span className="progress-value">
                                {progress.totalDays || 0}/{challenge.duration || 30} days
                              </span>
                            </div>
                            <div className="progress-bar">
                              <div
                                className="progress-fill"
                                style={{
                                  width: `${((progress.totalDays || 0) / (challenge.duration || 30)) * 100}%`
                                }}
                              />
                            </div>
                            {progress.currentStreak > 0 && (
                              <div className="streak-indicator">
                                <Flame size={14} />
                                <span>{progress.currentStreak} day streak</span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="challenge-actions">
                          {hasJoined ? (
                            <>
                              <button
                                onClick={() => handleVerifyProgress(challenge.id || challenge._id)}
                                disabled={isVerifying || verifiedToday}
                                className={`action-button ${verifiedToday ? 'verify-button completed' : 'verify-button'}`}
                              >
                                {isVerifying ? (
                                  <>
                                    <Loader2 size={16} className="loading-spinner" />
                                    Verifying...
                                  </>
                                ) : verifiedToday ? (
                                  <>
                                    <CheckCircle size={16} />
                                    Done Today
                                  </>
                                ) : (
                                  <>
                                    <Camera size={16} />
                                    Verify on Profile
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
                                Details
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
                                  <Loader2 size={16} className="loading-spinner" />
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
                  })
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">🌱</div>
                    <h3 className="empty-title">No Challenges Found</h3>
                    <p className="empty-description">
                      {searchQuery
                        ? `No challenges match "${searchQuery}"`
                        : activeTab === 'my-challenges'
                        ? "You haven't joined any challenges yet"
                        : "Try different filters or create your own challenge!"}
                    </p>
                    {activeTab === 'my-challenges' && (
                      <button
                        onClick={() => setActiveTab('discover')}
                        className="empty-button"
                      >
                        Discover Challenges
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
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
            <button className="modal-close" onClick={() => setShowCreateModal(false)}>
              <X size={20} />
            </button>
            
            <div className="modal-header">
              <h2>Create New Challenge</h2>
              <p>Design a challenge for the Touch Grass community</p>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Challenge Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={newChallenge.name}
                  onChange={(e) => setNewChallenge({...newChallenge, name: e.target.value})}
                  placeholder="Morning Grounding Routine"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-textarea"
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
                  placeholder="Describe your challenge..."
                  rows="3"
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                        className="remove-rule"
                        onClick={() => {
                          const newRules = newChallenge.rules.filter((_, i) => i !== index);
                          setNewChallenge({...newChallenge, rules: newRules});
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
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <Loader2 size={16} className="loading-spinner" />
                      Creating...
                    </span>
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
            className="modal-content"
            style={{ maxWidth: '600px' }}
          >
            <button className="modal-close" onClick={() => setShowChallengeDetails(false)}>
              <X size={20} />
            </button>
            
            <div className="modal-header">
              <h2>{selectedChallenge.name}</h2>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <span className={`difficulty-badge difficulty-${selectedChallenge.difficulty || 'medium'}`}>
                  {selectedChallenge.difficulty || 'medium'}
                </span>
                <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  {selectedChallenge.duration} days
                </span>
                <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  {selectedChallenge.participants} participants
                </span>
              </div>
            </div>
            
            <div className="modal-body">
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Description</h3>
                <p style={{ color: '#94a3b8' }}>{selectedChallenge.description}</p>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Rules</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {extractRules(selectedChallenge).map((rule, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <CheckCircle size={16} style={{ color: '#22c55e', marginTop: '0.125rem', flexShrink: 0 }} />
                      <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{String(rule)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {hasUserJoinedChallenge(selectedChallenge.id || selectedChallenge._id) && (
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                  <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Your Progress</h3>
                  {(() => {
                    const progress = getUserProgress(selectedChallenge.id || selectedChallenge._id);
                    const verifiedToday = hasVerifiedToday(selectedChallenge.id || selectedChallenge._id);
                    
                    return (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ color: '#94a3b8' }}>Days completed</span>
                          <span style={{ color: '#22c55e', fontWeight: '600' }}>
                            {progress.totalDays || 0}/{selectedChallenge.duration}
                          </span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '1rem' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${((progress.totalDays || 0) / selectedChallenge.duration) * 100}%`,
                              background: 'linear-gradient(90deg, #22c55e, #3b82f6)',
                              borderRadius: '3px'
                            }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Flame size={16} style={{ color: '#f97316' }} />
                            <span style={{ color: '#f97316', fontWeight: '600' }}>{progress.currentStreak || 0}</span>
                            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>day streak</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Trophy size={16} style={{ color: '#eab308' }} />
                            <span style={{ color: '#eab308', fontWeight: '600' }}>{progress.longestStreak || 0}</span>
                            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>best</span>
                          </div>
                        </div>
                        {verifiedToday && (
                          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22c55e' }}>
                            <CheckCircle size={16} />
                            <span style={{ fontSize: '0.875rem' }}>Verified today</span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
              
              <div className="form-actions">
                <button
                  className="cancel-button"
                  onClick={() => setShowChallengeDetails(false)}
                >
                  Close
                </button>
                
                {!hasUserJoinedChallenge(selectedChallenge.id || selectedChallenge._id) && (
                  <button
                    className="submit-button"
                    onClick={() => {
                      setShowChallengeDetails(false);
                      handleJoinChallenge(selectedChallenge);
                    }}
                    disabled={isJoining}
                  >
                    {isJoining ? 'Joining...' : 'Join Challenge'}
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