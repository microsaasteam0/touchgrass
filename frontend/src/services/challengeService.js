// const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001/api';

// // Helper to get auth token from various storage locations
// const getAuthToken = () => {
//   // Check Supabase auth token first
//   const supabaseSession = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}');
//   if (supabaseSession.currentSession?.access_token) {
//     return supabaseSession.currentSession.access_token;
//   }
//   if (supabaseSession.access_token) {
//     return supabaseSession.access_token;
//   }

//   // Check Supabase auth token (alternative key)
//   const supabaseAuth = JSON.parse(localStorage.getItem('sb-tmgwvnpmacrqcykqpggl-auth-token') || '{}');
//   if (supabaseAuth.access_token) {
//     return supabaseAuth.access_token;
//   }

//   // Fallback to regular token
//   return localStorage.getItem('token') || localStorage.getItem('authToken');
// };

// // For now, use email-based auth since backend expects it
// const getUserEmail = () => {
//   // Get from Supabase user
//   const supabaseSession = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}');
//   if (supabaseSession.currentSession?.user?.email) {
//     return supabaseSession.currentSession.user.email;
//   }

//   // Check Supabase auth token (alternative key)
//   const supabaseAuth = JSON.parse(localStorage.getItem('sb-tmgwvnpmacrqcykqpggl-auth-token') || '{}');
//   if (supabaseAuth.user?.email) {
//     return supabaseAuth.user.email;
//   }

//   // Fallback to stored user data
//   const storedUser = localStorage.getItem('touchgrass_user');
//   if (storedUser) {
//     const user = JSON.parse(storedUser);
//     return user.email;
//   }

//   return null;
// };

// class RealChallengeService {
//   // Get all available challenges from backend
//   static async getAvailableChallenges(userEmail) {
//     try {
//       // First try to get built-in challenges
//       const builtInResponse = await fetch(`${API_URL}/challenges/built-in`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'X-User-Email': userEmail || undefined
//         }
//       });

//       if (builtInResponse.ok) {
//         const builtInData = await builtInResponse.json();
//         if (builtInData.success && builtInData.data && Array.isArray(builtInData.data) && builtInData.data.length > 0) {
//           return builtInData.data.map(challenge => RealChallengeService.transformChallenge(challenge));
//         }
//       }

//       // Fallback to regular challenges endpoint
//       const response = await fetch(`${API_URL}/challenges`, {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data.success && data.data && Array.isArray(data.data)) {
//           return data.data.map(challenge => RealChallengeService.transformChallenge(challenge));
//         }
//       }

//       return [];
//     } catch (error) {
//       console.error('Error fetching available challenges:', error);
//       return [];
//     }
//   }

//   // Get user's active challenges
//   static async getUserActiveChallenges(userEmail) {
//     try {
//       const response = await fetch(`${API_URL}/challenges/user/${userEmail}`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'X-User-Email': userEmail
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data.success && data.data && Array.isArray(data.data)) {
//           return data.data.map(challenge => RealChallengeService.transformChallenge(challenge));
//         }
//       }

//       return [];
//     } catch (error) {
//       console.error('Error fetching user challenges:', error);
//       return [];
//     }
//   }

//   // Get user's joined challenges
//   static async getUserChallenges() {
//     const token = getAuthToken();

//     if (!token) {
//       return { success: true, challenges: [] };
//     }

//     const response = await fetch(`${API_URL}/user/challenges`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch user challenges: ${response.status}`);
//     }

//     return await response.json();
//   }

//   // Join a challenge
//   static async joinChallenge(challengeId) {
//     const token = getAuthToken();

//     if (!token) {
//       throw new Error('Authentication required');
//     }

//     const response = await fetch(`${API_URL}/challenges/${challengeId}/join`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         joinedAt: new Date().toISOString()
//       })
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.message || `Failed to join challenge: ${response.status}`);
//     }

//     return await response.json();
//   }

//   // Update challenge progress
//   static async updateProgress(challengeId, progress) {
//     const token = getAuthToken();

//     if (!token) {
//       throw new Error('Authentication required');
//     }

//     const response = await fetch(`${API_URL}/challenges/${challengeId}/progress`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(progress)
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to update progress: ${response.status}`);
//     }

//     return await response.json();
//   }

//   // Transform challenge data for display
//   static transformChallenge(challenge) {
//     return {
//       id: challenge._id || challenge.id,
//       name: challenge.name,
//       description: challenge.description,
//       type: challenge.type || challenge.category || 'streak',
//       difficulty: challenge.difficulty || 'medium',
//       duration: challenge.settings?.duration?.value || challenge.duration || 7,
//       participants: challenge.participants || 0,
//       prizePool: challenge.settings?.prizePool || challenge.prizePool || 0,
//       rules: challenge.rules || [],
//       status: challenge.status || 'active',
//       metadata: challenge.metadata || {}
//     };
//   }
// }

// export default RealChallengeService;

// challengeService.js - Complete LocalStorage Version
// Since backend is failing, we'll use localStorage completely

// Fallback challenges - These will be displayed when backend fails
// challengeService.js - Auto-Progress LocalStorage Version
// Simulates backend behavior with automatic daily progress

// Fallback challenges with auto-progress simulation
const getFallbackChallenges = () => [
  {
    id: 'daily-outdoor-verification',
    name: "Daily Outdoor Verification",
    type: "mindset",
    description: "Verify that you've spent time outdoors every day to build consistent discipline and connection with nature.",
    duration: 30, // 30 days
    difficulty: "medium",
    rules: [
      "Spend at least 15 minutes outdoors",
      "Take a photo as proof",
      "No excuses allowed - rain or shine",
      "Share your experience in the community"
    ],
    participants: 1242,
    icon: "🌳",
    category: "mindfulness",
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    xpReward: 100,
    dailyProgressRate: 3.33, // 100% / 30 days
    requiresVerification: true
  },
  {
    id: 'silent-kilometer',
    name: "The Silent Kilometer",
    type: "mindfulness",
    description: "Walk one full kilometer in complete silence—no phone, no music, no podcasts. Just you, your breath, and your surroundings.",
    duration: 7, // 7 days
    difficulty: "easy",
    rules: [
      "1 km minimum distance",
      "Absolute silence (no audio input)",
      "Phone stays in pocket",
      "Note one small detail you've never noticed before"
    ],
    participants: 856,
    icon: "🤫",
    category: "mindfulness",
    createdBy: "system",
    createdAt: "2024-01-15T00:00:00Z",
    xpReward: 150,
    dailyProgressRate: 14.29, // 100% / 7 days
    requiresVerification: true
  },
  {
    id: 'greening-your-loop',
    name: "Greening Your Loop",
    type: "exploration",
    description: "For one week, you cannot take the exact same outdoor route twice. Find a new street, path, or trail every single time.",
    duration: 7, // 7 days
    difficulty: "medium",
    rules: [
      "No repeated routes for 7 days",
      "Minimum 15 minutes per outing",
      "Must end at a new destination or starting point",
      "Map your week's 'spiderweb' in your journal"
    ],
    participants: 932,
    icon: "🕸️",
    category: "exploration",
    createdBy: "system",
    createdAt: "2024-01-20T00:00:00Z",
    xpReward: 200,
    dailyProgressRate: 14.29,
    requiresVerification: true
  },
  {
    id: 'sunrise-sunset-bookends',
    name: "Sunrise-Sunset Bookends",
    type: "discipline",
    description: "Bookend your day with natural light. Be present for the sunrise and the sunset, no matter the weather. 5 minutes minimum each.",
    duration: 7, // 7 days
    difficulty: "hard",
    rules: [
      "Catch sunrise (within 30 min of dawn)",
      "Catch sunset (within 30 min of dusk)",
      "At least 5 minutes of presence each",
      "Complete 5 out of 7 days in a week"
    ],
    participants: 423,
    icon: "🌅",
    category: "discipline",
    createdBy: "system",
    createdAt: "2024-02-01T00:00:00Z",
    xpReward: 250,
    dailyProgressRate: 14.29,
    requiresVerification: true
  },
  {
    id: 'five-bench-circuit',
    name: "The 5-Bench Circuit",
    type: "community",
    description: "Find and sit on 5 different public benches in your neighborhood or a park. Observe the rhythm of life from each station.",
    duration: 1, // Single day
    difficulty: "easy",
    rules: [
      "Find 5 distinct benches",
      "Sit for at least 3 minutes each",
      "No phone while sitting",
      "Sketch or write one sentence about the view from each"
    ],
    participants: 1247,
    icon: "🪑",
    category: "community",
    createdBy: "system",
    createdAt: "2024-02-10T00:00:00Z",
    xpReward: 100,
    dailyProgressRate: 100, // 100% in 1 day
    requiresVerification: true
  },
  {
    id: 'weatherproof-pledge',
    name: "The Weatherproof Pledge",
    type: "resilience",
    description: "Go outside every day for 7 days, regardless of weather conditions. Rain, wind, or shine—your commitment doesn't waver.",
    duration: 7,
    difficulty: "hard",
    rules: [
      "Minimum 10 minutes outside daily",
      "No weather-based excuses",
      "Document the conditions with a photo",
      "Reflect on how the weather affected your mood"
    ],
    participants: 678,
    icon: "🌧️",
    category: "resilience",
    createdBy: "system",
    createdAt: "2024-02-15T00:00:00Z",
    xpReward: 300,
    dailyProgressRate: 14.29,
    requiresVerification: true
  },
  {
    id: 'tree-identification-week',
    name: "Tree Identification Week",
    type: "learning",
    description: "Learn to identify 5 different tree species in your local area. Find them, photograph them, and learn one fact about each.",
    duration: 7,
    difficulty: "medium",
    rules: [
      "Correctly identify 5 local tree species",
      "Visit at least one of each during the week",
      "Photograph leaf, bark, and overall shape",
      "Note the location of your favorite"
    ],
    participants: 542,
    icon: "🌳",
    category: "learning",
    createdBy: "system",
    createdAt: "2024-02-20T00:00:00Z",
    xpReward: 200,
    dailyProgressRate: 14.29,
    requiresVerification: true
  },
  {
    id: 'digital-sunset',
    name: "The Digital Sunset",
    type: "detox",
    description: "For one week, your last screen time of the day must end at least 1 hour before bedtime. Replace that time with an evening outdoor ritual.",
    duration: 7,
    difficulty: "medium",
    rules: [
      "Screens off 60+ minutes before bed",
      "Spend those 60 minutes outside (e.g., porch, walk, stargazing)",
      "No checking phones during outdoor time",
      "Track how your sleep quality changes"
    ],
    participants: 987,
    icon: "📵",
    category: "detox",
    createdBy: "system",
    createdAt: "2024-03-01T00:00:00Z",
    xpReward: 250,
    dailyProgressRate: 14.29,
    requiresVerification: true
  }
];

// Helper to get user email from localStorage
const getUserEmailFromStorage = () => {
  try {
    // Try to get from various Supabase storage locations
    const supabaseKeys = [
      'supabase.auth.token',
      'sb-tmgwvnpmacrqcykqpggl-auth-token',
      'sb-auth-token'
    ];
    
    for (const key of supabaseKeys) {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          const data = JSON.parse(item);
          if (data.currentSession?.user?.email) {
            return data.currentSession.user.email;
          }
          if (data.user?.email) {
            return data.user.email;
          }
        } catch (e) {
          continue;
        }
      }
    }

    // Fallback to stored user data
    const storedUser = localStorage.getItem('touchgrass_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        return user.email || 'default@user.com';
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    // Default fallback
    return 'default@user.com';
  } catch (error) {
    console.error('Error getting user email:', error);
    return 'default@user.com';
  }
};

// Calculate days between two dates
const getDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Simulate automatic daily progress
const calculateAutoProgress = (challenge, joinedAt) => {
  if (!joinedAt) return challenge;
  
  const now = new Date();
  const daysSinceJoin = getDaysBetween(joinedAt, now);
  const maxDays = challenge.duration || 7;
  
  // Calculate auto-progress based on days passed
  const autoProgressPercent = Math.min(100, (daysSinceJoin / maxDays) * 100);
  
  // Ensure we don't exceed the daily progress rate
  const dailyRate = challenge.dailyProgressRate || (100 / maxDays);
  const calculatedProgress = Math.min(autoProgressPercent, daysSinceJoin * dailyRate);
  
  return {
    ...challenge,
    autoProgress: Math.round(calculatedProgress),
    daysSinceJoin,
    isBehindSchedule: daysSinceJoin > maxDays && challenge.progress < 100
  };
};

class ChallengeService {
  // Get all available challenges
  static async getAvailableChallenges() {
    const fallbackChallenges = getFallbackChallenges();
    const userEmail = getUserEmailFromStorage();
    const joinedChallenges = this.getLocalChallenges(userEmail);
    const joinedIds = joinedChallenges.map(c => c.id);
    
    return fallbackChallenges.map(challenge => ({
      ...challenge,
      isJoined: joinedIds.includes(challenge.id)
    }));
  }

  // Get user's joined challenges with auto-progress calculation
  static async getUserChallenges() {
    const userEmail = getUserEmailFromStorage();
    let localChallenges = this.getLocalChallenges(userEmail);
    
    // Apply auto-progress to each challenge
    localChallenges = localChallenges.map(challenge => {
      const updatedChallenge = calculateAutoProgress(challenge, challenge.joinedAt);
      
      // If user hasn't manually updated today, add auto-progress
      const today = new Date().toISOString().split('T')[0];
      if (!challenge.dailyProgress?.[today]?.completed) {
        return {
          ...updatedChallenge,
          progress: Math.max(challenge.progress || 0, updatedChallenge.autoProgress || 0),
          lastAutoProgressUpdate: new Date().toISOString()
        };
      }
      
      return updatedChallenge;
    });
    
    // Save updated progress
    this.saveLocalChallenges(userEmail, localChallenges);
    
    return {
      success: true,
      challenges: localChallenges,
      progress: this.getLocalProgress(userEmail)
    };
  }

  // Join a challenge
  static async joinChallenge(challengeId) {
    const userEmail = getUserEmailFromStorage();
    
    try {
      const availableChallenges = getFallbackChallenges();
      const challenge = availableChallenges.find(c => c.id === challengeId);
      
      if (!challenge) {
        return {
          success: false,
          message: 'Challenge not found'
        };
      }

      const existingChallenges = this.getLocalChallenges(userEmail);
      const alreadyJoined = existingChallenges.some(c => c.id === challengeId);
      
      if (alreadyJoined) {
        return {
          success: true,
          message: 'Already joined this challenge',
          challengeId
        };
      }

      // Create joined challenge with initial progress
      const joinedChallenge = {
        ...challenge,
        joinedAt: new Date().toISOString(),
        progress: 0,
        autoProgress: 0,
        status: 'active',
        dailyProgress: {},
        completedDays: 0,
        streak: 0,
        lastUpdated: new Date().toISOString(),
        lastAutoProgressUpdate: new Date().toISOString(),
        totalDays: 0,
        xpEarned: 0,
        milestones: this.generateMilestones(challenge.duration)
      };

      existingChallenges.push(joinedChallenge);
      this.saveLocalChallenges(userEmail, existingChallenges);
      
      // Update available challenges
      this.saveAvailableChallengesToLocal(availableChallenges.map(c => ({
        ...c,
        isJoined: c.id === challengeId ? true : c.isJoined
      })));

      // Schedule daily auto-progress updates
      this.scheduleAutoProgress(challengeId, userEmail);

      return {
        success: true,
        message: 'Challenge joined successfully!',
        challenge: joinedChallenge
      };
    } catch (error) {
      console.error('Error joining challenge:', error);
      return {
        success: false,
        message: 'Failed to join challenge'
      };
    }
  }

  // Generate milestone dates for the challenge
  static generateMilestones(duration) {
    const milestones = [];
    const today = new Date();
    
    if (duration >= 7) {
      milestones.push({
        day: 7,
        date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        label: "Week 1 Complete",
        xp: 50
      });
    }
    
    if (duration >= 14) {
      milestones.push({
        day: 14,
        date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        label: "Week 2 Complete",
        xp: 75
      });
    }
    
    if (duration >= 30) {
      milestones.push({
        day: 30,
        date: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        label: "Month Complete",
        xp: 100
      });
    }
    
    return milestones;
  }

  // Schedule automatic progress updates (simulates backend cron job)
  static scheduleAutoProgress(challengeId, userEmail) {
    // This simulates backend auto-progress
    // In a real backend, this would be a cron job
    const autoUpdateKey = `challenge_auto_update_${challengeId}_${userEmail}`;
    
    // Store when we should next update progress
    const nextUpdate = new Date();
    nextUpdate.setHours(24, 0, 0, 0); // Next day at midnight
    
    localStorage.setItem(autoUpdateKey, nextUpdate.toISOString());
  }

  // Check and apply auto-progress for all challenges
  static checkAndApplyAutoProgress() {
    const userEmail = getUserEmailFromStorage();
    const challenges = this.getLocalChallenges(userEmail);
    const now = new Date();
    
    const updatedChallenges = challenges.map(challenge => {
      const autoUpdateKey = `challenge_auto_update_${challenge.id}_${userEmail}`;
      const nextUpdate = localStorage.getItem(autoUpdateKey);
      
      if (nextUpdate && new Date(nextUpdate) <= now) {
        // Apply daily auto-progress
        const dailyProgress = challenge.dailyProgressRate || (100 / (challenge.duration || 7));
        const newProgress = Math.min(100, (challenge.progress || 0) + dailyProgress);
        
        // Schedule next update
        const next = new Date(now);
        next.setHours(24, 0, 0, 0);
        localStorage.setItem(autoUpdateKey, next.toISOString());
        
        return {
          ...challenge,
          progress: newProgress,
          lastAutoProgressUpdate: now.toISOString(),
          autoProgress: newProgress
        };
      }
      
      return challenge;
    });
    
    this.saveLocalChallenges(userEmail, updatedChallenges);
    return updatedChallenges;
  }

  // Update progress (manual verification)
  static async updateProgress(challengeId, progressData) {
    const userEmail = getUserEmailFromStorage();
    
    try {
      const challenges = this.getLocalChallenges(userEmail);
      const challengeIndex = challenges.findIndex(c => c.id === challengeId);
      
      if (challengeIndex === -1) {
        return {
          success: false,
          message: 'Challenge not found'
        };
      }

      const today = new Date().toISOString().split('T')[0];
      const challenge = challenges[challengeIndex];
      
      // Initialize dailyProgress if not exists
      if (!challenge.dailyProgress) {
        challenges[challengeIndex].dailyProgress = {};
      }
      
      // Update today's progress
      challenges[challengeIndex].dailyProgress[today] = {
        ...progressData,
        date: today,
        timestamp: new Date().toISOString(),
        isManual: true
      };
      
      // Calculate progress
      const daysCompleted = Object.keys(challenges[challengeIndex].dailyProgress)
        .filter(date => challenges[challengeIndex].dailyProgress[date].completed).length;
      
      const duration = challenge.duration || 7;
      const manualProgress = (daysCompleted / duration) * 100;
      
      // Use the higher of manual or auto progress
      const currentAutoProgress = challenge.autoProgress || 0;
      const newProgress = Math.max(manualProgress, currentAutoProgress);
      
      // Update challenge stats
      challenges[challengeIndex].completedDays = daysCompleted;
      challenges[challengeIndex].progress = newProgress;
      challenges[challengeIndex].lastUpdated = new Date().toISOString();
      
      // Update streak
      if (progressData.completed) {
        challenges[challengeIndex].streak += 1;
        challenges[challengeIndex].totalDays += 1;
        challenges[challengeIndex].xpEarned += (challenges[challengeIndex].xpReward || 10) / duration;
        
        // Check milestones
        this.checkMilestones(challenges[challengeIndex], daysCompleted);
      }
      
      // Save to localStorage
      this.saveLocalChallenges(userEmail, challenges);
      
      return {
        success: true,
        message: 'Progress updated successfully',
        progress: newProgress,
        completedDays: daysCompleted,
        challenge: challenges[challengeIndex]
      };
    } catch (error) {
      console.error('Error updating progress:', error);
      return {
        success: false,
        message: 'Failed to update progress'
      };
    }
  }

  // Check and award milestone achievements
  static checkMilestones(challenge, daysCompleted) {
    if (!challenge.milestones) return;
    
    const achievedMilestones = challenge.milestones.filter(m => m.day <= daysCompleted);
    const newMilestones = achievedMilestones.filter(m => 
      !challenge.achievedMilestones?.includes(m.day)
    );
    
    if (newMilestones.length > 0) {
      // Award XP for milestones
      const totalXPAwarded = newMilestones.reduce((sum, m) => sum + (m.xp || 0), 0);
      challenge.xpEarned += totalXPAwarded;
      challenge.achievedMilestones = [
        ...(challenge.achievedMilestones || []),
        ...newMilestones.map(m => m.day)
      ];
      
      return {
        hasNewMilestones: true,
        milestones: newMilestones,
        xpAwarded: totalXPAwarded
      };
    }
    
    return null;
  }

  // Local storage helpers
  static getLocalChallenges(userEmail) {
    try {
      const key = `touchgrass_user_challenges_${userEmail}`;
      const stored = localStorage.getItem(key);
      const challenges = stored ? JSON.parse(stored) : [];
      
      // Apply auto-progress on load
      return challenges.map(challenge => 
        calculateAutoProgress(challenge, challenge.joinedAt)
      );
    } catch (error) {
      console.error('Error getting local challenges:', error);
      return [];
    }
  }

  static saveLocalChallenges(userEmail, challenges) {
    try {
      const key = `touchgrass_user_challenges_${userEmail}`;
      localStorage.setItem(key, JSON.stringify(challenges));
    } catch (error) {
      console.error('Error saving local challenges:', error);
    }
  }

  static getLocalProgress(userEmail) {
    try {
      const challenges = this.getLocalChallenges(userEmail);
      const progress = {};
      
      challenges.forEach(challenge => {
        progress[challenge.id] = {
          progress: challenge.progress || 0,
          autoProgress: challenge.autoProgress || 0,
          completedDays: challenge.completedDays || 0,
          dailyProgress: challenge.dailyProgress || {},
          streak: challenge.streak || 0,
          totalDays: challenge.totalDays || 0,
          xpEarned: challenge.xpEarned || 0,
          lastUpdated: challenge.lastUpdated,
          lastAutoProgressUpdate: challenge.lastAutoProgressUpdate,
          milestones: challenge.milestones || [],
          achievedMilestones: challenge.achievedMilestones || []
        };
      });
      
      return progress;
    } catch (error) {
      console.error('Error getting local progress:', error);
      return {};
    }
  }

  // Initialize daily auto-progress check
  static initDailyAutoProgress() {
    // Check for auto-progress updates on app load
    this.checkAndApplyAutoProgress();
    
    // Simulate backend cron job - check every hour
    setInterval(() => {
      this.checkAndApplyAutoProgress();
    }, 60 * 60 * 1000); // Every hour
  }

  // Get daily progress report
  static getDailyProgressReport() {
    const userEmail = getUserEmailFromStorage();
    const challenges = this.getLocalChallenges(userEmail);
    const today = new Date().toISOString().split('T')[0];
    
    const report = {
      date: today,
      totalChallenges: challenges.length,
      challengesDueToday: [],
      progressMadeToday: 0,
      streakMaintained: 0
    };
    
    challenges.forEach(challenge => {
      const todayProgress = challenge.dailyProgress?.[today];
      const daysSinceJoin = getDaysBetween(challenge.joinedAt, new Date());
      
      if (daysSinceJoin <= (challenge.duration || 7)) {
        report.challengesDueToday.push({
          id: challenge.id,
          name: challenge.name,
          progress: challenge.progress,
          autoProgress: challenge.autoProgress,
          requiresAction: !todayProgress?.completed && challenge.requiresVerification
        });
      }
      
      if (todayProgress?.completed) {
        report.progressMadeToday += challenge.dailyProgressRate || 0;
        report.streakMaintained += 1;
      }
    });
    
    return report;
  }

  // Get challenge analytics
  static getChallengeAnalytics() {
    const userEmail = getUserEmailFromStorage();
    const challenges = this.getLocalChallenges(userEmail);
    
    const analytics = {
      totalChallenges: challenges.length,
      activeChallenges: challenges.filter(c => c.progress < 100).length,
      completedChallenges: challenges.filter(c => c.progress >= 100).length,
      averageProgress: 0,
      totalXPEarned: 0,
      currentStreak: 0,
      bestStreak: 0,
      dailyCompletionRate: 0
    };
    
    if (challenges.length > 0) {
      analytics.averageProgress = challenges.reduce((sum, c) => sum + (c.progress || 0), 0) / challenges.length;
      analytics.totalXPEarned = challenges.reduce((sum, c) => sum + (c.xpEarned || 0), 0);
      analytics.currentStreak = challenges.reduce((min, c) => Math.min(min, c.streak || 0), Infinity) || 0;
      analytics.bestStreak = Math.max(...challenges.map(c => c.streak || 0));
      
      // Calculate daily completion rate (last 7 days)
      const last7Days = Array.from({length: 7}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      });
      
      let completedDays = 0;
      challenges.forEach(challenge => {
        last7Days.forEach(day => {
          if (challenge.dailyProgress?.[day]?.completed) {
            completedDays++;
          }
        });
      });
      
      const totalPossible = challenges.length * 7;
      analytics.dailyCompletionRate = totalPossible > 0 ? (completedDays / totalPossible) * 100 : 0;
    }
    
    return analytics;
  }

  // Helper to save available challenges to localStorage
  static saveAvailableChallengesToLocal(challenges) {
    try {
      localStorage.setItem('touchgrass_available_challenges', JSON.stringify(challenges));
    } catch (error) {
      console.error('Error saving available challenges:', error);
    }
  }

  // Get available challenges from localStorage
  static getAvailableChallengesFromLocal() {
    try {
      const stored = localStorage.getItem('touchgrass_available_challenges');
      return stored ? JSON.parse(stored) : getFallbackChallenges();
    } catch (error) {
      console.error('Error getting available challenges:', error);
      return getFallbackChallenges();
    }
  }

  // Check if challenge is joined
  static isChallengeJoined(challengeId) {
    const userEmail = getUserEmailFromStorage();
    const localChallenges = this.getLocalChallenges(userEmail);
    return localChallenges.some(c => c.id === challengeId);
  }

  // Leave a challenge
  static async leaveChallenge(challengeId) {
    const userEmail = getUserEmailFromStorage();
    
    try {
      const challenges = this.getLocalChallenges(userEmail);
      const filteredChallenges = challenges.filter(c => c.id !== challengeId);
      
      this.saveLocalChallenges(userEmail, filteredChallenges);
      
      // Update available challenges
      const availableChallenges = this.getAvailableChallengesFromLocal();
      const updatedAvailable = availableChallenges.map(c => ({
        ...c,
        isJoined: c.id === challengeId ? false : c.isJoined
      }));
      
      this.saveAvailableChallengesToLocal(updatedAvailable);
      
      return {
        success: true,
        message: 'Challenge left successfully'
      };
    } catch (error) {
      console.error('Error leaving challenge:', error);
      return {
        success: false,
        message: 'Failed to leave challenge'
      };
    }
  }

  // Create a new challenge
  static async createChallenge(challengeData) {
    const userEmail = getUserEmailFromStorage();
    
    try {
      const duration = challengeData.duration || 7;
      const challenge = {
        id: `custom-${Date.now()}`,
        ...challengeData,
        createdBy: userEmail,
        createdAt: new Date().toISOString(),
        isCustom: true,
        participants: 1,
        joinedAt: new Date().toISOString(),
        progress: 0,
        autoProgress: 0,
        status: 'active',
        dailyProgress: {},
        completedDays: 0,
        streak: 0,
        lastUpdated: new Date().toISOString(),
        lastAutoProgressUpdate: new Date().toISOString(),
        totalDays: 0,
        xpEarned: 0,
        xpReward: challengeData.difficulty === 'easy' ? 50 :
                 challengeData.difficulty === 'medium' ? 100 :
                 challengeData.difficulty === 'hard' ? 200 : 300,
        dailyProgressRate: 100 / duration,
        requiresVerification: true,
        milestones: this.generateMilestones(duration)
      };

      // Add to user's challenges
      const userChallenges = this.getLocalChallenges(userEmail);
      userChallenges.push(challenge);
      this.saveLocalChallenges(userEmail, userChallenges);
      
      // Schedule auto-progress
      this.scheduleAutoProgress(challenge.id, userEmail);

      return {
        success: true,
        message: 'Challenge created successfully',
        challenge: challenge
      };
    } catch (error) {
      console.error('Error creating challenge:', error);
      return {
        success: false,
        message: 'Failed to create challenge'
      };
    }
  }
}

// Initialize auto-progress system when service loads
ChallengeService.initDailyAutoProgress();

export default ChallengeService;