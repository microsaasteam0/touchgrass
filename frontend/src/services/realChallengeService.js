const API_URL = 'https://touchgrass-backend.onrender.com/api';

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

// Real Challenge Service - API-based (MongoDB)
class RealChallengeService {
  // Transform challenge data from API to frontend format
  static transformChallenge(challenge) {
    // Calculate progress based on completed days and duration
    const duration = challenge.duration || 30;
    const completedDays = challenge.completedDays || Object.keys(challenge.dailyProgress || {}).length;
    const calculatedProgress = duration > 0 ? Math.round((completedDays / duration) * 100) : 0;
    
    // Check if completed today based on various backend flags - THIS IS THE KEY FOR "DONE TODAY" BUTTON
    const today = new Date().toISOString().split('T')[0];
    let isCompletedToday = false;
    
    // Priority 1: Check completedToday flag from backend (most reliable)
    if (challenge.completedToday === true) {
      isCompletedToday = true;
    }
    // Priority 2: Check dailyProgress for today - handle both boolean and object
    else if (challenge.dailyProgress && challenge.dailyProgress[today]) {
      const dayData = challenge.dailyProgress[today];
      // dailyProgress[today] can be: true, {completed: true}, or stringified
      if (dayData === true) {
        isCompletedToday = true;
      } else if (typeof dayData === 'object' && dayData?.completed === true) {
        isCompletedToday = true;
      } else if (typeof dayData === 'string') {
        // Handle stringified JSON
        try {
          const parsed = JSON.parse(dayData);
          if (parsed?.completed === true) isCompletedToday = true;
        } catch (e) {
          // Not JSON, ignore
        }
      }
    }
    // Priority 3: Check completedDays array
    else if (Array.isArray(challenge.completedDays) && challenge.completedDays.includes(today)) {
      isCompletedToday = true;
    }
    // Priority 4: Check lastActivity date
    else if (challenge.lastActivity && new Date(challenge.lastActivity).toISOString().split('T')[0] === today) {
      isCompletedToday = true;
    }
    
    return {
      id: challenge._id || challenge.id,
      name: challenge.name,
      description: challenge.description,
      duration: challenge.duration,
      difficulty: challenge.difficulty,
      type: challenge.type || 'streak',
      category: challenge.category || 'custom',
      icon: challenge.icon || '🌱',
      rules: Array.isArray(challenge.rules) ? challenge.rules : [],
      participants: challenge.participants || 0,
      maxParticipants: challenge.maxParticipants || 1000,
      stake: challenge.stake || 0,
      prizePool: challenge.prizePool || 0,
      status: challenge.status || 'active',
      createdBy: challenge.createdBy || 'system',
      featured: challenge.featured || false,
      createdAt: challenge.createdAt,
      joinedUsers: challenge.joinedUsers || [],
      // Progress data from backend - use calculated progress if backend doesn't provide it
      currentStreak: challenge.currentStreak || 0,
      longestStreak: challenge.longestStreak || 0,
      totalProgress: challenge.totalProgress || calculatedProgress,
      // Flag to indicate if user has verified today - THIS IS THE KEY FIELD FOR "DONE TODAY" BUTTON
      completedToday: isCompletedToday,
      lastActivity: challenge.lastActivity,
      // Make sure dailyProgress is always an object with string keys only
      dailyProgress: typeof challenge.dailyProgress === 'object' && challenge.dailyProgress !== null 
        ? Object.fromEntries(Object.entries(challenge.dailyProgress).map(([k, v]) => [k, typeof v === 'object' ? JSON.stringify(v) : v])) 
        : {},
      // Use calculated progress if backend doesn't provide it
      progress: challenge.progress || calculatedProgress,
      streak: challenge.streak || 0,
      totalDays: challenge.totalDays || completedDays,
      completedDays: Array.isArray(challenge.completedDays) ? challenge.completedDays : []
    };
  }

  // Get all available challenges from backend
  static async getChallenges(params = {}) {
    try {
      // Use /built-in endpoint to get available challenges
      const response = await fetch(`${API_URL}/challenges/built-in`, {
        headers: buildHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const challenges = (data.data || []).map(challenge => this.transformChallenge(challenge));
        return {
          success: true,
          challenges: challenges,
          data: data.data
        };
      }
      
      return { success: false, challenges: [], data: [] };
    } catch (error) {
      console.error('Error fetching challenges:', error);
      return { success: false, challenges: [], data: [], message: error.message };
    }
  }

  // Get challenge by ID
  static async getChallengeById(challengeId) {
    try {
      const response = await fetch(`${API_URL}/challenges/${challengeId}`, {
        headers: buildHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          challenge: this.transformChallenge(data.data)
        };
      }
      
      return { success: false, challenge: null };
    } catch (error) {
      console.error('Error fetching challenge:', error);
      return { success: false, challenge: null, message: error.message };
    }
  }

  // Get user's joined challenges
  static async getMyChallenges() {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        return { success: false, challenges: [], message: 'User not authenticated' };
      }

      // Use the correct endpoint: /challenges/my-challenges
      const response = await fetch(`${API_URL}/challenges/my-challenges`, {
        headers: buildHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const challenges = (data.data || []).map(challenge => this.transformChallenge(challenge));
        return {
          success: true,
          challenges: challenges,
          data: data.data
        };
      }
      
      return { success: false, challenges: [], data: [] };
    } catch (error) {
      console.error('Error fetching user challenges:', error);
      return { success: false, challenges: [], data: [], message: error.message };
    }
  }

  // Get daily check-ins for today (legacy - now using getMyChallenges)
  static async getDailyCheckins(date = null) {
    try {
      // Use getMyChallenges which now returns the daily progress data
      const result = await this.getMyChallenges();
      
      if (!result.success) {
        return { success: false, data: [], message: result.message };
      }

      const targetDate = date || new Date().toISOString().split('T')[0];
      
      // Transform the challenges into check-ins format
      const checkins = result.challenges.map(challenge => ({
        challengeId: challenge.id,
        challenge: {
          _id: challenge.id,
          name: challenge.name,
          icon: challenge.icon
        },
        date: targetDate,
        completed: challenge.completedToday || false,
        completedAt: challenge.lastActivity || null,
        currentStreak: challenge.currentStreak || 0,
        totalProgress: challenge.totalProgress || 0
      }));

      return {
        success: true,
        data: checkins
      };
    } catch (error) {
      console.error('Error fetching daily check-ins:', error);
      return { success: false, data: [], message: error.message };
    }
  }

  // Join a challenge
  static async joinChallenge(challengeId) {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        return { success: false, message: 'User not authenticated' };
      }

      const response = await fetch(`${API_URL}/challenges/${challengeId}/join`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ userEmail })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          data: data.data,
          message: data.message
        };
      }
      
      return { success: false, message: data.message || 'Failed to join challenge' };
    } catch (error) {
      console.error('Error joining challenge:', error);
      return { success: false, message: error.message };
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
        headers: buildHeaders(),
        body: JSON.stringify({ userEmail })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          message: data.message
        };
      }
      
      return { success: false, message: data.message || 'Failed to leave challenge' };
    } catch (error) {
      console.error('Error leaving challenge:', error);
      return { success: false, message: error.message };
    }
  }

  // Verify daily progress
  static async verifyProgress(challengeId, userId, progressData = {}) {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        return { success: false, message: 'User not authenticated' };
      }

      const response = await fetch(`${API_URL}/challenges/${challengeId}/verify`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({
          userEmail,
          ...progressData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          data: data.data,
          message: data.message
        };
      }
      
      return { success: false, message: data.message || 'Failed to verify progress' };
    } catch (error) {
      console.error('Error verifying progress:', error);
      return { success: false, message: error.message };
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
        body: JSON.stringify({
          ...challengeData,
          createdBy: userEmail
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          challenge: this.transformChallenge(data.data),
          message: data.message
        };
      }
      
      return { success: false, message: data.message || 'Failed to create challenge' };
    } catch (error) {
      console.error('Error creating challenge:', error);
      return { success: false, message: error.message };
    }
  }

  // Update challenge progress
  static async updateProgress(challengeId, progressData) {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        return { success: false, message: 'User not authenticated' };
      }

      const response = await fetch(`${API_URL}/challenges/${challengeId}/progress`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({
          userEmail,
          ...progressData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          data: data.data,
          message: data.message
        };
      }
      
      return { success: false, message: data.message || 'Failed to update progress' };
    } catch (error) {
      console.error('Error updating progress:', error);
      return { success: false, message: error.message };
    }
  }

  // Get challenge analytics
  static async getChallengeAnalytics(challengeId) {
    try {
      const response = await fetch(`${API_URL}/challenges/${challengeId}/analytics`, {
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

      const userChallenges = await this.getMyChallenges();
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
      return null;
    } catch (error) {
      console.error('Error getting challenges from localStorage:', error);
      return null;
    }
  }

  // Alias for getChallenges - used by profile.jsx
  static async getAvailableChallenges(params = {}) {
    return this.getChallenges(params);
  }
}

export default RealChallengeService;
