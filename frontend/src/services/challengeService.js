import React from 'react';
  
  const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://touchgrass-backend.onrender.com/api';

// Helper to get auth token from various storage locations
const getAuthToken = () => {
  try {
    // Check Supabase auth token first
    const supabaseSession = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}');
    if (supabaseSession.currentSession?.access_token) {
      return supabaseSession.currentSession.access_token;
    }
    if (supabaseSession.access_token) {
      return supabaseSession.access_token;
    }

    // Check Supabase auth token (alternative key)
    const supabaseAuth = JSON.parse(localStorage.getItem('sb-tmgwvnpmacrqcykqpggl-auth-token') || '{}');
    if (supabaseAuth.access_token) {
      return supabaseAuth.access_token;
    }

    // Fallback to regular token
    return localStorage.getItem('token') || localStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Get user email from storage
const getUserEmail = () => {
  try {
    // Get from Supabase user
    const supabaseSession = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}');
    if (supabaseSession.currentSession?.user?.email) {
      return supabaseSession.currentSession.user.email;
    }

    // Check Supabase auth token (alternative key)
    const supabaseAuth = JSON.parse(localStorage.getItem('sb-tmgwvnpmacrqcykqpggl-auth-token') || '{}');
    if (supabaseAuth.user?.email) {
      return supabaseAuth.user.email;
    }

    // Fallback to stored user data
    const storedUser = localStorage.getItem('touchgrass_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.email;
    }

    return null;
  } catch (error) {
    console.error('Error getting user email:', error);
    return null;
  }
};

// Helper to build headers properly (no undefined values)
const buildHeaders = (includeEmail = true) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (includeEmail) {
    const userEmail = getUserEmail();
    if (userEmail) {
      headers['X-User-Email'] = userEmail;
    }
  }
  
  return headers;
};

// Challenge Service - API-based (MongoDB)
class ChallengeService {
  // Transform challenge data from API to frontend format
  static transformChallenge(challenge) {
    return {
      id: challenge._id || challenge.id,
      name: challenge.name,
      type: challenge.type,
      description: challenge.description,
      duration: challenge.settings?.duration?.value || 7,
      durationUnit: challenge.settings?.duration?.unit || 'days',
      difficulty: challenge.difficulty || 'medium',
      rules: challenge.rules,
      participants: challenge.participants?.length || 0,
      icon: challenge.metadata?.bannerImage || '🎯',
      category: challenge.category,
      createdBy: challenge.createdBy,
      createdAt: challenge.createdAt,
      xpReward: challenge.xpReward || 0,
      dailyProgressRate: challenge.dailyProgressRate,
      requiresVerification: challenge.settings?.verificationRequired || true,
      isCustom: challenge.metadata?.isBuiltIn ? false : true,
      isBuiltIn: challenge.metadata?.isBuiltIn || false,
      metadata: challenge.metadata || {},
      settings: challenge.settings || {}
    };
  }

  // Transform user challenge data from API to frontend format
  static transformUserChallenge(userChallenge) {
    // The backend returns challengeId as the actual challenge ID
    const challengeId = userChallenge.challengeId?._id || userChallenge.challengeId || userChallenge._id;
    
    // Get today's date for checking if completed today
    const today = new Date().toISOString().split('T')[0];
    
    // Check if completed today from dailyProgress
    let completedToday = userChallenge.completedToday;
    if (completedToday === undefined && userChallenge.dailyProgress) {
      completedToday = userChallenge.dailyProgress[today]?.completed || false;
    }
    
    return {
      id: challengeId,
      challengeId: challengeId, // Keep both for compatibility
      userChallengeId: userChallenge._id, // The UserChallenge document ID
      name: userChallenge.name,
      type: userChallenge.type,
      description: userChallenge.description,
      duration: userChallenge.duration || 7,
      difficulty: userChallenge.difficulty,
      rules: userChallenge.rules || [],
      participants: userChallenge.participants || 0,
      icon: userChallenge.icon || '🎯',
      category: userChallenge.category,
      createdBy: userChallenge.createdBy,
      createdAt: userChallenge.createdAt,
      xpReward: userChallenge.xpReward || 0,
      dailyProgressRate: userChallenge.dailyProgressRate,
      requiresVerification: userChallenge.requiresVerification || true,
      isCustom: userChallenge.isCustom || false,
      joinedAt: userChallenge.joinedAt,
      progress: userChallenge.totalProgress || userChallenge.progress || 0,
      totalProgress: userChallenge.totalProgress || 0,
      currentStreak: userChallenge.currentStreak || 0,
      longestStreak: userChallenge.longestStreak || 0,
      autoProgress: userChallenge.autoProgress || 0,
      status: userChallenge.status,
      dailyProgress: userChallenge.dailyProgress || {},
      completedDays: userChallenge.completedDays || [],
      completedToday: completedToday || false,
      streak: userChallenge.currentStreak || userChallenge.streak || 0,
      lastUpdated: userChallenge.lastUpdated,
      lastActivity: userChallenge.lastActivity,
      lastAutoProgressUpdate: userChallenge.lastAutoProgressUpdate,
      totalDays: userChallenge.totalDays || 0,
      xpEarned: userChallenge.xpEarned || 0,
      milestones: userChallenge.milestones || [],
      achievedMilestones: userChallenge.achievedMilestones || [],
      metadata: userChallenge.metadata || {},
      settings: userChallenge.settings || {}
    };
  }
  // Get all available challenges from backend
  static async getAvailableChallenges() {
    try {
      const response = await fetch(`${API_URL}/challenges/built-in`, {
        headers: buildHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return data.data.map(challenge => ChallengeService.transformChallenge(challenge));
      }

      return [];
    } catch (error) {
      console.error('Error fetching available challenges:', error);
      return [];
    }
  }

  // Get built-in challenges
  static async getBuiltInChallenges() {
    try {
      const response = await fetch(`${API_URL}/challenges/built-in`, {
        headers: buildHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return data.data.map(challenge => ChallengeService.transformChallenge(challenge));
      }

      return [];
    } catch (error) {
      console.error('Error fetching built-in challenges:', error);
      return [];
    }
  }

  // Get user's joined challenges from backend (using /my-challenges endpoint)
  static async getUserChallenges() {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        return { success: false, challenges: [], message: 'User not authenticated' };
      }

      const response = await fetch(`${API_URL}/challenges/my-challenges`, {
        headers: buildHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return {
          success: true,
          challenges: data.data.map(challenge => ChallengeService.transformUserChallenge(challenge))
        };
      }

      return { success: false, challenges: [] };
    } catch (error) {
      console.error('Error fetching user challenges:', error);
      return { success: false, challenges: [], message: error.message };
    }
  }

  // Join a challenge via backend
  static async joinChallenge(challengeId) {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        console.error('joinChallenge: No user email found');
        return { success: false, message: 'User not authenticated' };
      }

      console.log('joinChallenge: Calling API with:', {
        url: `${API_URL}/challenges/${challengeId}/join`,
        userEmail
      });

      const response = await fetch(`${API_URL}/challenges/${challengeId}/join`, {
        method: 'POST',
        headers: buildHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('joinChallenge: API error:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('joinChallenge: API response:', data);
      
      if (data.success) {
        return {
          success: true,
          message: data.message || 'Successfully joined challenge',
          data: data.userChallenge
        };
      }
      
      return { success: false, message: data.message || 'Failed to join challenge' };
    } catch (error) {
      console.error('Error joining challenge:', error);
      return { success: false, message: error.message || 'Failed to join challenge' };
    }
  }

  // Verify daily progress / check-in
  static async verifyProgress(challengeId, progressData = {}) {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        return { success: false, message: 'User not authenticated' };
      }

      const response = await fetch(`${API_URL}/challenges/${challengeId}/verify`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({
          notes: progressData.notes || '',
          verificationMethod: progressData.verificationMethod || 'manual'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          message: data.message || 'Progress verified successfully',
          data: data.data
        };
      }
      
      return { success: false, message: data.message || 'Failed to verify progress' };
    } catch (error) {
      console.error('Error verifying progress:', error);
      return { success: false, message: error.message || 'Failed to verify progress' };
    }
  }

  // Get daily check-ins for user
  static async getDailyCheckins(date = null) {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        return { success: false, data: [], message: 'User not authenticated' };
      }

      let url = `${API_URL}/challenges/user/${encodeURIComponent(userEmail)}/daily-checkins`;
      if (date) {
        url += `?date=${date}`;
      }

      const response = await fetch(url, {
        headers: buildHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          data: data.data
        };
      }
      
      return { success: false, data: [] };
    } catch (error) {
      console.error('Error fetching daily check-ins:', error);
      return { success: false, data: [], message: error.message };
    }
  }

  // Get challenge progress history
  static async getProgressHistory(challengeId) {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        return { success: false, message: 'User not authenticated' };
      }

      const response = await fetch(`${API_URL}/challenges/${challengeId}/progress?email=${encodeURIComponent(userEmail)}`, {
        headers: buildHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          data: data.data
        };
      }
      
      return { success: false, data: [] };
    } catch (error) {
      console.error('Error fetching progress history:', error);
      return { success: false, data: [], message: error.message };
    }
  }

  // Leave a challenge
  static async leaveChallenge(challengeId) {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        return { success: false, message: 'User not authenticated' };
      }

      const response = await fetch(`${API_URL}/challenges/${challengeId}/leave`, {
        method: 'POST',
        headers: buildHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          message: data.message || 'Successfully left challenge'
        };
      }
      
      return { success: false, message: data.message || 'Failed to leave challenge' };
    } catch (error) {
      console.error('Error leaving challenge:', error);
      return { success: false, message: error.message || 'Failed to leave challenge' };
    }
  }

  // Create a new challenge
  static async createChallenge(challengeData) {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        return { success: false, message: 'User not authenticated' };
      }

      const response = await fetch(`${API_URL}/challenges`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(challengeData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          message: data.message || 'Challenge created successfully',
          challenge: ChallengeService.transformChallenge(data.challenge)
        };
      }
      
      return { success: false, message: data.message || 'Failed to create challenge' };
    } catch (error) {
      console.error('Error creating challenge:', error);
      return { success: false, message: error.message || 'Failed to create challenge' };
    }
  }

  // Get challenge analytics
  static async getChallengeAnalytics() {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        return { success: false, message: 'User not authenticated' };
      }

      const response = await fetch(`${API_URL}/challenges/user/${encodeURIComponent(userEmail)}/analytics`, {
        headers: buildHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          data: data.data
        };
      }
      
      return { success: false, data: {} };
    } catch (error) {
      console.error('Error fetching challenge analytics:', error);
      return { success: false, data: {}, message: error.message };
    }
  }

  // Get daily progress report
  static async getDailyProgressReport() {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        return { success: false, message: 'User not authenticated' };
      }

      const response = await fetch(`${API_URL}/challenges/user/${encodeURIComponent(userEmail)}/daily-report`, {
        headers: buildHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          data: data.data
        };
      }
      
      return { success: false, data: {} };
    } catch (error) {
      console.error('Error fetching daily progress report:', error);
      return { success: false, data: {}, message: error.message };
    }
  }

  // Check if challenge is joined
  static async isChallengeJoined(challengeId) {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        return false;
      }

      const userChallenges = await this.getUserChallenges();
      if (userChallenges.success) {
        return userChallenges.challenges.some(challenge => challenge.id === challengeId);
      }
      
      return false;
    } catch (error) {
      console.error('Error checking if challenge is joined:', error);
      return false;
    }
  }

  // Save challenges to localStorage for offline use
  static saveAvailableChallengesToLocal(challenges) {
    try {
      localStorage.setItem('touchgrass_challenges', JSON.stringify({
        challenges: challenges,
        timestamp: Date.now()
      }));
      return true;
    } catch (error) {
      console.error('Error saving challenges to localStorage:', error);
      return false;
    }
  }

  // Get challenges from localStorage
  static getLocalChallenges() {
    try {
      const stored = localStorage.getItem('touchgrass_challenges');
      if (stored) {
        const data = JSON.parse(stored);
        // Check if data is less than 24 hours old
        const oneDay = 24 * 60 * 60 * 1000;
        if (Date.now() - data.timestamp < oneDay) {
          return data.challenges;
        }
      }
      // Fallback to hardcoded challenges
      return this.getDefaultChallenges();
    } catch (error) {
      console.error('Error getting challenges from localStorage:', error);
      return this.getDefaultChallenges();
    }
  }

  // Get default hardcoded challenges (51 challenges)
  static getDefaultChallenges() {
    return [
      {
        id: 'challenge-1',
        name: "Morning Grounding",
        type: "mindfulness",
        description: "Start your day standing barefoot on grass for 10 minutes while breathing deeply.",
        duration: 30,
        difficulty: "easy",
        icon: "🌅",
        category: "mindfulness",
        participants: 1250,
        status: "active",
        rules: ["10 minutes barefoot on grass", "Deep breathing throughout", "No phone during routine", "Observe 3 things around you"]
      },
      {
        id: 'challenge-2',
        name: "Daily Sunset Watch",
        type: "routine",
        description: "Watch sunset every evening without distractions for 15 minutes.",
        duration: 21,
        difficulty: "easy",
        icon: "🌇",
        category: "mindfulness",
        participants: 890,
        status: "active",
        rules: ["15 minutes sunset watch", "No screens allowed", "Document sky colors", "Share one reflection"]
      },
      {
        id: 'challenge-3',
        name: "Park Bench Meditation",
        type: "meditation",
        description: "Meditate on a park bench for 20 minutes daily, focusing on natural sounds.",
        duration: 14,
        difficulty: "medium",
        icon: "🧘",
        category: "mindfulness",
        participants: 670,
        status: "active",
        rules: ["Find different benches", "20 minutes meditation", "Focus on natural sounds", "No guided apps"]
      },
      {
        id: 'challenge-4',
        name: "Tree Identification",
        type: "learning",
        description: "Learn to identify 7 different tree species in your local area.",
        duration: 7,
        difficulty: "medium",
        icon: "🌳",
        category: "exploration",
        participants: 430,
        status: "active",
        rules: ["Identify 7 different trees", "Take photos of leaves", "Learn one fact each", "Map their locations"]
      },
      {
        id: 'challenge-5',
        name: "Silent Nature Walk",
        type: "mindfulness",
        description: "Walk 30 minutes in nature without any technology or talking.",
        duration: 7,
        difficulty: "medium",
        icon: "🤫",
        category: "mindfulness",
        participants: 980,
        status: "active",
        rules: ["30-minute silent walk", "No phone or music", "Observe 5 details", "No talking allowed"]
      },
      {
        id: 'challenge-6',
        name: "Weather Warrior",
        type: "discipline",
        description: "Go outside 15 minutes daily regardless of weather conditions.",
        duration: 30,
        difficulty: "hard",
        icon: "🌧️",
        category: "discipline",
        participants: 320,
        status: "active",
        rules: ["15 minutes outside daily", "No weather excuses", "Document conditions", "Reflect on experience"]
      },
      {
        id: 'challenge-7',
        name: "Digital Sunset",
        type: "detox",
        description: "No screens 1 hour before bed, replace with evening outdoor time.",
        duration: 21,
        difficulty: "medium",
        icon: "📵",
        category: "detox",
        participants: 1250,
        status: "active",
        rules: ["Screens off 60+ minutes", "Spend time outside", "Stargaze or walk", "Track sleep improvements"]
      },
      {
        id: 'challenge-8',
        name: "5-Bench Circuit",
        type: "exploration",
        description: "Visit and sit on 5 different public benches in your neighborhood.",
        duration: 1,
        difficulty: "easy",
        icon: "🪑",
        category: "exploration",
        participants: 560,
        status: "active",
        rules: ["Find 5 distinct benches", "Sit 3 minutes each", "No phone while sitting", "Sketch or write about view"]
      },
      {
        id: 'challenge-9',
        name: "Bird Song Morning",
        type: "awareness",
        description: "Wake up to birdsong and identify 3 different bird calls each morning.",
        duration: 14,
        difficulty: "easy",
        icon: "🐦",
        category: "awareness",
        participants: 720,
        status: "active",
        rules: ["Wake to bird calls", "Identify 3 species", "Log each morning", "No alarm clock"]
      },
      {
        id: 'challenge-10',
        name: "Nature Discovery Map",
        type: "exploration",
        description: "Map 20 interesting natural spots in your neighborhood. Become a local explorer.",
        duration: 30,
        difficulty: "medium",
        icon: "🗺️",
        category: "exploration",
        participants: 270,
        status: "active",
        rules: ["Map 20 locations", "Photo each spot", "Add descriptions", "Update weekly"]
      },
      {
        id: 'challenge-11',
        name: "Morning Cold Shower",
        type: "discipline",
        description: "Take a cold shower outdoors each morning. Build mental toughness.",
        duration: 14,
        difficulty: "hard",
        icon: "🚿",
        category: "discipline",
        participants: 290,
        status: "active",
        rules: ["Cold water only", "Outdoor shower preferred", "2 minutes minimum", "No warm water"]
      },
      {
        id: 'challenge-12',
        name: "Bird Watching Log",
        type: "awareness",
        description: "Identify and log 5 different bird species daily. Connect with wildlife.",
        duration: 21,
        difficulty: "easy",
        icon: "🐦",
        category: "nature",
        participants: 380,
        status: "active",
        rules: ["5 bird species daily", "Log in journal or app", "Note behaviors", "Take photos if possible"]
      },
      {
        id: 'challenge-13',
        name: "Forest Bathing",
        type: "mindfulness",
        description: "Spend 30 minutes in a forest or wooded area. Practice shinrin-yoku.",
        duration: 14,
        difficulty: "medium",
        icon: "🌲",
        category: "mindfulness",
        participants: 450,
        status: "active",
        rules: ["30 min forest time", "All 5 senses engaged", "No phone interaction", "Slow, deliberate pace"]
      },
      {
        id: 'challenge-14',
        name: "Outdoor Meal Planning",
        type: "routine",
        description: "Plan and prepare one outdoor meal daily. Eat mindfully in nature.",
        duration: 7,
        difficulty: "easy",
        icon: "🍽️",
        category: "routine",
        participants: 620,
        status: "active",
        rules: ["One outdoor meal", "Sit outside to eat", "No distractions", "Appreciate the food"]
      },
      {
        id: 'challenge-15',
        name: "Rock Pool Exploration",
        type: "exploration",
        description: "Visit rock pools and document marine life. Discover ocean treasures.",
        duration: 7,
        difficulty: "medium",
        icon: "🦀",
        category: "exploration",
        participants: 180,
        status: "active",
        rules: ["Visit 2 rock pools", "Document 5 species", "Respect wildlife", "Leave no trace"]
      },
      {
        id: 'challenge-16',
        name: "Sunrise Running",
        type: "fitness",
        description: "Run at sunrise for 30 minutes. Start your day with energy.",
        duration: 21,
        difficulty: "hard",
        icon: "🌅",
        category: "fitness",
        participants: 540,
        status: "active",
        rules: ["30 min run at sunrise", "Outdoors only", "Track distance", "No missing days"]
      },
      {
        id: 'challenge-17',
        name: "Garden Meditation",
        type: "mindfulness",
        description: "Meditate in your garden for 15 minutes. Find peace at home.",
        duration: 30,
        difficulty: "easy",
        icon: "🌻",
        category: "mindfulness",
        participants: 380,
        status: "active",
        rules: ["15 min garden meditation", "Same time daily", "Focus on plants", "No indoor fallback"]
      },
      {
        id: 'challenge-18',
        name: "Beachcombing Adventure",
        type: "exploration",
        description: "Walk along the beach for 30 minutes daily. Collect interesting finds.",
        duration: 14,
        difficulty: "easy",
        icon: "🏖️",
        category: "exploration",
        participants: 290,
        status: "active",
        rules: ["30 min beach walk", "Collect one item", "Document findings", "Respect wildlife"]
      },
      {
        id: 'challenge-19',
        name: "Stargazing Session",
        type: "awareness",
        description: "Spend 20 minutes outdoors stargazing each night. Learn about the cosmos.",
        duration: 21,
        difficulty: "easy",
        icon: "⭐",
        category: "awareness",
        participants: 420,
        status: "active",
        rules: ["20 min stargazing", "Identify 3 constellations", "Note moon phase", "No telescope needed"]
      },
      {
        id: 'challenge-20',
        name: "Outdoor Yoga Flow",
        type: "fitness",
        description: "Practice yoga outdoors for 30 minutes every morning.",
        duration: 30,
        difficulty: "medium",
        icon: "🧘‍♀️",
        category: "fitness",
        participants: 680,
        status: "active",
        rules: ["30 min outdoor yoga", "Sunrise preferred", "No interruptions", "Full body routine"]
      },
      {
        id: 'challenge-21',
        name: "Sound Map Creation",
        type: "awareness",
        description: "Create a sound map of different outdoor locations. Train your auditory awareness.",
        duration: 7,
        difficulty: "medium",
        icon: "🎵",
        category: "awareness",
        participants: 210,
        status: "active",
        rules: ["Visit 3 different locations", "Map sounds heard", "Identify 5+ sounds each", "Note time of day"]
      },
      {
        id: 'challenge-22',
        name: "Outdoor Journaling",
        type: "mindfulness",
        description: "Write in your journal outside for 20 minutes daily. Clear your mind in nature.",
        duration: 30,
        difficulty: "easy",
        icon: "📝",
        category: "mindfulness",
        participants: 410,
        status: "active",
        rules: ["20 minutes outdoor writing", "Nature observation notes", "Gratitude entry", "No indoor writing"]
      },
      {
        id: 'challenge-23',
        name: "Geocaching Adventure",
        type: "exploration",
        description: "Find 10 geocaches in your area. Turn exploration into a treasure hunt.",
        duration: 14,
        difficulty: "medium",
        icon: "🗝️",
        category: "exploration",
        participants: 180,
        status: "active",
        rules: ["Find 10 geocaches", "Log each find", "Take proof photos", "Explore new areas"]
      },
      {
        id: 'challenge-24',
        name: "Outdoor Nap",
        type: "rest",
        description: "Take a 20-minute outdoor nap in a hammock or bench. Rediscover restful sleep.",
        duration: 7,
        difficulty: "easy",
        icon: "😴",
        category: "rest",
        participants: 340,
        status: "active",
        rules: ["20 min outdoor rest", "Nature sounds only", "No indoor naps", "Fresh air required"]
      },
      {
        id: 'challenge-25',
        name: "Photography Walk",
        type: "creativity",
        description: "Take 50 photos during your outdoor walk. Train your photographer's eye.",
        duration: 14,
        difficulty: "easy",
        icon: "📸",
        category: "creativity",
        participants: 560,
        status: "active",
        rules: ["50 photos minimum", "Must be outdoors", "Different subjects", "Review and select best"]
      },
      {
        id: 'challenge-26',
        name: "Mountain Trail Hiking",
        type: "fitness",
        description: "Hike a different mountain trail each week. Conquer heights and build strength.",
        duration: 7,
        difficulty: "hard",
        icon: "🏔️",
        category: "fitness",
        participants: 390,
        status: "active",
        rules: ["1 trail per week", "Document the climb", "Note flora and fauna", "Reach the summit"]
      },
      {
        id: 'challenge-27',
        name: "Dawn Chorus Listening",
        type: "awareness",
        description: "Wake up early to listen to birdsong at dawn. Connect with morning energy.",
        duration: 21,
        difficulty: "easy",
        icon: "🐤",
        category: "awareness",
        participants: 250,
        status: "active",
        rules: ["Listen at sunrise", "Identify 3 bird songs", "No phone interaction", "Document species heard"]
      },
      {
        id: 'challenge-28',
        name: "Wildflower Counting",
        type: "learning",
        description: "Identify and count different wildflower species in your area.",
        duration: 30,
        difficulty: "easy",
        icon: "🌸",
        category: "learning",
        participants: 180,
        status: "active",
        rules: ["Find 10 species", "Photo documentation", "Note locations", "Learn medicinal uses"]
      },
      {
        id: 'challenge-29',
        name: "River Walk Meditation",
        type: "mindfulness",
        description: "Walk alongside a river for 30 minutes while meditating on the water flow.",
        duration: 14,
        difficulty: "medium",
        icon: "🌊",
        category: "mindfulness",
        participants: 320,
        status: "active",
        rules: ["30 min riverside walk", "Focus on water sounds", "No headphones", "Mindful breathing"]
      },
      {
        id: 'challenge-30',
        name: "Cloud Watching",
        type: "creativity",
        description: "Spend 15 minutes daily watching clouds. Let your imagination soar.",
        duration: 7,
        difficulty: "easy",
        icon: "☁️",
        category: "creativity",
        participants: 410,
        status: "active",
        rules: ["15 min cloud watching", "Identify cloud types", "Sketch formations", "No indoor viewing"]
      },
      {
        id: 'challenge-31',
        name: "Urban Nature Hunt",
        type: "exploration",
        description: "Find 10 examples of nature thriving in urban areas. Discover hidden green spaces.",
        duration: 14,
        difficulty: "medium",
        icon: "🌿",
        category: "exploration",
        participants: 290,
        status: "active",
        rules: ["Find 10 urban plants", "Photo documentation", "Map locations", "Note species"]
      },
      {
        id: 'challenge-32',
        name: "Sunset Yoga",
        type: "fitness",
        description: "Practice yoga at sunset for 20 minutes. Wind down with nature.",
        duration: 21,
        difficulty: "easy",
        icon: "🧘‍♂️",
        category: "fitness",
        participants: 520,
        status: "active",
        rules: ["20 min sunset yoga", "Outdoors only", "Gratitude practice", "No indoor fallback"]
      },
      {
        id: 'challenge-33',
        name: "Morning Dew Walk",
        type: "awareness",
        description: "Walk through grass covered in morning dew. Feel the freshness of the day.",
        duration: 14,
        difficulty: "easy",
        icon: "💧",
        category: "awareness",
        participants: 340,
        status: "active",
        rules: ["Walk at dawn", "Barefoot preferred", "Feel the dew", "Document the experience"]
      },
      {
        id: 'challenge-34',
        name: "Full Moon Vigil",
        type: "awareness",
        description: "Spend one night each month under the full moon. Connect with lunar energy.",
        duration: 1,
        difficulty: "easy",
        icon: "🌕",
        category: "awareness",
        participants: 280,
        status: "active",
        rules: ["1 hour full moon viewing", "Outdoors only", "Meditate on moonlight", "Journal the experience"]
      },
      {
        id: 'challenge-35',
        name: "Outdoor Reading Habit",
        type: "learning",
        description: "Read 30 minutes outside daily. Combine learning with nature.",
        duration: 30,
        difficulty: "easy",
        icon: "📚",
        category: "learning",
        participants: 450,
        status: "active",
        rules: ["30 min outdoor reading", "Different locations", "Finish one book", "Note insights"]
      },
      {
        id: 'challenge-36',
        name: "Nature Sound Bath",
        type: "mindfulness",
        description: "Listen to nature sounds for 20 minutes daily. Let nature heal your mind.",
        duration: 21,
        difficulty: "easy",
        icon: "🎧",
        category: "mindfulness",
        participants: 380,
        status: "active",
        rules: ["20 min nature sounds", "Eyes closed", "No interruptions", "Focus on breathing"]
      },
      {
        id: 'challenge-37',
        name: "Trail Running",
        type: "fitness",
        description: "Run on natural trails for 25 minutes. Connect with earth while jogging.",
        duration: 14,
        difficulty: "hard",
        icon: "👟",
        category: "fitness",
        participants: 420,
        status: "active",
        rules: ["25 min trail running", "Natural surfaces only", "No pavement", "Document distance"]
      },
      {
        id: 'challenge-38',
        name: "Morning Stretch Outdoors",
        type: "fitness",
        description: "Stretch for 15 minutes outdoors each morning. Wake up your body with nature.",
        duration: 30,
        difficulty: "easy",
        icon: "🤸",
        category: "fitness",
        participants: 580,
        status: "active",
        rules: ["15 min outdoor stretching", "Sunrise preferred", "Full body routine", "No indoor fallback"]
      },
      {
        id: 'challenge-39',
        name: "Wildlife Photography",
        type: "creativity",
        description: "Capture 25 photos of wildlife in their natural habitat.",
        duration: 14,
        difficulty: "medium",
        icon: "🦊",
        category: "creativity",
        participants: 310,
        status: "active",
        rules: ["25 wildlife photos", "Must be wild animals", "No zoos or pets", "Document species"]
      },
      {
        id: 'challenge-40',
        name: "Outdoor Meditation Trail",
        type: "mindfulness",
        description: "Walk a meditation trail for 20 minutes. Combine movement with mindfulness.",
        duration: 21,
        difficulty: "medium",
        icon: "🚶",
        category: "mindfulness",
        participants: 360,
        status: "active",
        rules: ["20 min meditation walk", "Set intentions", "Mindful steps", "Nature observations"]
      },
      {
        id: 'challenge-41',
        name: "Sunrise Salutation",
        type: "fitness",
        description: "Greet the sunrise with 15 minutes of yoga and stretching.",
        duration: 30,
        difficulty: "easy",
        icon: "🙏",
        category: "fitness",
        participants: 490,
        status: "active",
        rules: ["15 min at sunrise", "Outdoor practice", "Gratitude journaling", "No missing days"]
      },
      {
        id: 'challenge-42',
        name: "Nature Sketching",
        type: "creativity",
        description: "Sketch one nature scene outdoors daily. Train your artistic eye.",
        duration: 30,
        difficulty: "easy",
        icon: "✏️",
        category: "creativity",
        participants: 280,
        status: "active",
        rules: ["1 nature sketch daily", "Outdoors only", "Use any medium", "Document location"]
      },
      {
        id: 'challenge-43',
        name: "Hilltop Meditation",
        type: "mindfulness",
        description: "Climb to a hilltop and meditate for 20 minutes. Rise above and find clarity.",
        duration: 14,
        difficulty: "medium",
        icon: "⛰️",
        category: "mindfulness",
        participants: 220,
        status: "active",
        rules: ["Find a hill or elevation", "20 min meditation", "View while meditating", "Reflect on climb"]
      },
      {
        id: 'challenge-44',
        name: "Night Walk Adventure",
        type: "awareness",
        description: "Take a 20-minute walk after dark. Discover a different side of nature.",
        duration: 7,
        difficulty: "medium",
        icon: "🌙",
        category: "awareness",
        participants: 260,
        status: "active",
        rules: ["20 min night walking", "Stay safe", "Observe nocturnal life", "Look at stars"]
      },
      {
        id: 'challenge-45',
        name: "Picnic Planning",
        type: "routine",
        description: "Have a picnic outdoors once a week. Make dining an adventure.",
        duration: 7,
        difficulty: "easy",
        icon: "🧺",
        category: "routine",
        participants: 420,
        status: "active",
        rules: ["1 outdoor picnic weekly", "New location each time", "Homemade food preferred", "Enjoy the view"]
      },
      {
        id: 'challenge-46',
        name: "Outdoor Work Session",
        type: "productivity",
        description: "Work outdoors for 2 hours daily. Boost productivity with fresh air.",
        duration: 14,
        difficulty: "medium",
        icon: "💻",
        category: "productivity",
        participants: 350,
        status: "active",
        rules: ["2 hours outdoor work", "Laptop outdoors", "Nature background", "Document focus levels"]
      },
      {
        id: 'challenge-47',
        name: "Waterfall Chasing",
        type: "exploration",
        description: "Find and visit 5 different waterfalls. Experience nature's power.",
        duration: 14,
        difficulty: "medium",
        icon: "💦",
        category: "exploration",
        participants: 240,
        status: "active",
        rules: ["Find 5 waterfalls", "Document each visit", "Swim if safe", "Respect nature"]
      },
      {
        id: 'challenge-48',
        name: "Mushroom Hunting",
        type: "learning",
        description: "Learn to identify 10 different mushroom species. Explore fungal worlds.",
        duration: 30,
        difficulty: "hard",
        icon: "🍄",
        category: "learning",
        participants: 160,
        status: "active",
        rules: ["Identify 10 species", "Photo documentation", "Never eat unknown", "Learn ecosystem role"]
      },
      {
        id: 'challenge-49',
        name: "Dawn Patrol Walk",
        type: "discipline",
        description: "Walk outdoors before sunrise daily. Win the morning.",
        duration: 30,
        difficulty: "hard",
        icon: "🌤️",
        category: "discipline",
        participants: 380,
        status: "active",
        rules: ["Walk before sunrise", "No excuses", "Document sunrise", "Build routine"]
      },
      {
        id: 'challenge-50',
        name: "Butterfly Counting",
        type: "awareness",
        description: "Spot and identify 15 different butterfly species. Discover delicate beauty.",
        duration: 21,
        difficulty: "medium",
        icon: "🦋",
        category: "awareness",
        participants: 200,
        status: "active",
        rules: ["Spot 15 species", "Photo documentation", "Note locations", "Learn life cycles"]
      },
      {
        id: 'challenge-51',
        name: "Outdoor Mindfulness",
        type: "mindfulness",
        description: "Practice mindfulness outdoors for 15 minutes daily. Find peace in nature.",
        duration: 30,
        difficulty: "easy",
        icon: "🧠",
        category: "mindfulness",
        participants: 480,
        status: "active",
        rules: ["15 min outdoor mindfulness", "Focus on present", "Nature observations", "No distractions"]
      }
    ];
  }
}

export default ChallengeService;
