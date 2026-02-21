// /frontend/src/services/realChallengeService.js

/**
 * REAL CHALLENGE SERVICE
 * 
 * PRODUCTION-READY FEATURES:
 * ==========================
 * 
 * 1. REAL BACKEND INTEGRATION
 *    - All data persisted in MongoDB
 *    - No localStorage or mock data for core functionality
 *    - Every action calls backend API
 * 
 * 2. DAILY VERIFICATION LOCK (23-HOUR RULE)
 *    - Users can only verify once per day
 *    - Button shows "Done Today" after verification
 *    - Lock persists across sessions and devices
 * 
 * 3. CROSS-PAGE SYNCHRONIZATION
 *    - Challenges joined from any page appear everywhere
 *    - Progress syncs between Challenges and Profile pages
 *    - Single source of truth: MongoDB
 * 
 * 4. AUTHENTICATION
 *    - Supports both Supabase and custom auth
 *    - Automatically detects tokens from multiple storage locations
 *    - Falls back gracefully if user not authenticated
 * 
 * 5. ERROR HANDLING
 *    - Comprehensive error messages
 *    - Graceful degradation
 *    - Detailed logging for debugging
 */

// Use environment variable, fallback to local development URL
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001/api';

/**
 * Helper to get auth token from various storage locations
 * Supports both Supabase and custom authentication
 */
const getAuthToken = () => {
  try {
    // Check Supabase auth token (primary storage)
    const supabaseSession = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}');
    if (supabaseSession.currentSession?.access_token) {
      return supabaseSession.currentSession.access_token;
    }
    if (supabaseSession.access_token) {
      return supabaseSession.access_token;
    }

    // Check Supabase auth token (alternative key used by some setups)
    const supabaseAuth = JSON.parse(localStorage.getItem('sb-tmgwvnpmacrqcykqpggl-auth-token') || '{}');
    if (supabaseAuth.access_token) {
      return supabaseAuth.access_token;
    }

    // Fallback to regular token (custom auth)
    return localStorage.getItem('token') || localStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Get user email from storage
 * Supports multiple auth systems
 */
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

    // Check for user in session storage
    const sessionUser = sessionStorage.getItem('touchgrass_user');
    if (sessionUser) {
      const user = JSON.parse(sessionUser);
      if (user.email) return user.email;
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

/**
 * Helper to build headers properly (no undefined values)
 * Includes authentication token and user email when available
 */
const buildHeaders = (includeEmail = true) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
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

/**
 * Real Challenge Service - API-based (MongoDB)
 * 
 * This service connects to the production backend API.
 * All data is persisted in MongoDB - no mock data for core functionality.
 */
class RealChallengeService {
  /**
   * Transform challenge data from API to frontend format
   * This ensures consistent data structure across the app
   * 
   * CRITICAL: The 'completedToday' flag determines if "Done Today" button shows
   */
  static transformChallenge(challenge) {
    // Calculate progress based on completed days and duration
    const duration = challenge.duration || 30;
    const completedDays = challenge.completedDays || Object.keys(challenge.dailyProgress || {}).length;
    const calculatedProgress = duration > 0 ? Math.round((completedDays / duration) * 100) : 0;
    
    // Check if completed today based on various backend flags
    // THIS IS THE KEY FOR "DONE TODAY" BUTTON - MUST BE ACCURATE
    const today = new Date().toISOString().split('T')[0];
    let isCompletedToday = false;
    
    // Priority 1: Check completedToday flag from backend (most reliable)
    if (challenge.completedToday === true) {
      isCompletedToday = true;
    }
    // Priority 2: Check dailyProgress for today - handle multiple formats
    else if (challenge.dailyProgress && challenge.dailyProgress[today]) {
      const dayData = challenge.dailyProgress[today];
      
      // dailyProgress[today] can be in multiple formats:
      // - boolean: true
      // - object: { completed: true, ... }
      // - string: JSON string
      
      if (dayData === true) {
        isCompletedToday = true;
      } else if (typeof dayData === 'object' && dayData !== null) {
        if (dayData.completed === true) {
          isCompletedToday = true;
        }
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
    else if (challenge.lastActivity) {
      const lastActivityDate = new Date(challenge.lastActivity).toISOString().split('T')[0];
      if (lastActivityDate === today) {
        isCompletedToday = true;
      }
    }
    
    // Ensure rules is always an array
    let rules = [];
    if (Array.isArray(challenge.rules)) {
      rules = challenge.rules;
    } else if (typeof challenge.rules === 'object' && challenge.rules !== null) {
      // The backend has rules as an object with properties like:
      // { targetStreak, targetDuration, targetConsistency, minDailyTime, allowedVerificationMethods, shamePenalty, freezeAllowed, skipAllowed }
      // Convert these to human-readable rule strings
      const rulesObj = challenge.rules;
      const ruleStrings = [];
      
      if (rulesObj.targetStreak) {
        ruleStrings.push(`${rulesObj.targetStreak} day streak goal`);
      }
      if (rulesObj.targetDuration) {
        ruleStrings.push(`${rulesObj.targetDuration} minutes daily`);
      }
      if (rulesObj.targetConsistency) {
        ruleStrings.push(`${rulesObj.targetConsistency}% consistency required`);
      }
      if (rulesObj.minDailyTime) {
        ruleStrings.push(`Minimum ${rulesObj.minDailyTime} minutes per day`);
      }
      if (rulesObj.allowedVerificationMethods && Array.isArray(rulesObj.allowedVerificationMethods)) {
        ruleStrings.push(`Verification: ${rulesObj.allowedVerificationMethods.join(', ')}`);
      }
      if (rulesObj.shamePenalty && rulesObj.shamePenalty > 0) {
        ruleStrings.push(`${rulesObj.shamePenalty} shame points penalty`);
      }
      if (rulesObj.freezeAllowed === false) {
        ruleStrings.push('No freeze days allowed');
      }
      if (rulesObj.skipAllowed === true) {
        ruleStrings.push('Skip days allowed');
      }
      
      // If we have rule strings, use them; otherwise use default rules
      rules = ruleStrings.length > 0 ? ruleStrings : ['Complete daily challenges to maintain your streak'];
    } else if (typeof challenge.rules === 'string') {
      // Split by newlines or commas
      rules = challenge.rules.split('\n').filter(r => r.trim());
    }
    
    // If rules is still empty, provide default rules based on duration
    if (rules.length === 0) {
      const duration = challenge.duration || 30;
      rules = [
        `Complete the challenge for ${duration} consecutive days`,
        'Verify your progress daily',
        'Maintain your streak to succeed'
      ];
    }
    
    return {
      // Core challenge fields
      id: challenge._id || challenge.id,
      name: challenge.name || 'Unnamed Challenge',
      description: challenge.description || '',
      duration: challenge.duration || 30,
      difficulty: challenge.difficulty || 'medium',
      type: challenge.type || 'streak',
      category: challenge.category || 'custom',
      icon: challenge.icon || challenge.metadata?.icon || '🌱',
      rules: rules,
      
      // Stats
      participants: challenge.participants || challenge.stats?.totalEntries || 0,
      maxParticipants: challenge.maxParticipants || challenge.settings?.maxParticipants || 1000,
      stake: challenge.stake || challenge.settings?.entryFee || 0,
      prizePool: challenge.prizePool || challenge.settings?.prizePool || 0,
      
      // Status
      status: challenge.status || 'active',
      createdBy: challenge.createdBy || 'system',
      featured: challenge.featured || challenge.metadata?.featured || false,
      createdAt: challenge.createdAt,
      joinedUsers: challenge.joinedUsers || challenge.participants || [],
      
      // Progress data from backend - CRITICAL FOR USER PROGRESS
      currentStreak: challenge.currentStreak || 0,
      longestStreak: challenge.longestStreak || 0,
      totalProgress: challenge.totalProgress || challenge.progress?.current || calculatedProgress,
      
      // Flag to indicate if user has verified today
      // THIS IS THE KEY FIELD FOR "DONE TODAY" BUTTON
      completedToday: isCompletedToday,
      lastActivity: challenge.lastActivity,
      
      // Daily progress tracking - must be an object with date keys
      dailyProgress: typeof challenge.dailyProgress === 'object' && challenge.dailyProgress !== null 
        ? challenge.dailyProgress 
        : {},
      
      // Progress percentage (0-100)
      progress: challenge.progress || calculatedProgress,
      
      // Streak (alias for currentStreak)
      streak: challenge.streak || challenge.currentStreak || 0,
      
      // Total days completed
      totalDays: challenge.totalDays || completedDays,
      
      // Array of completed dates
      completedDays: Array.isArray(challenge.completedDays) ? challenge.completedDays : []
    };
  }

  /**
   * Transform user challenge data from backend
   * Used specifically for /my-challenges endpoint
   */
  static transformUserChallenge(challenge) {
    const today = new Date().toISOString().split('T')[0];
    
    // Determine if completed today - check multiple sources
    let completedToday = false;
    
    // Check completedToday flag
    if (challenge.completedToday === true) {
      completedToday = true;
    }
    // Check dailyProgress for today
    else if (challenge.dailyProgress && challenge.dailyProgress[today]) {
      const dayData = challenge.dailyProgress[today];
      if (dayData === true || (typeof dayData === 'object' && dayData?.completed === true)) {
        completedToday = true;
      }
    }
    // Check completedDays array
    else if (Array.isArray(challenge.completedDays) && challenge.completedDays.includes(today)) {
      completedToday = true;
    }
    // Check lastActivity date
    else if (challenge.lastActivity) {
      const lastActivityDate = new Date(challenge.lastActivity).toISOString().split('T')[0];
      if (lastActivityDate === today) {
        completedToday = true;
      }
    }
    
    return {
      id: challenge._id || challenge.id || challenge.challengeId,
      challengeId: challenge.challengeId || challenge._id || challenge.id,
      name: challenge.name || 'Unnamed Challenge',
      description: challenge.description || '',
      type: challenge.type || 'streak',
      category: challenge.category || 'custom',
      difficulty: challenge.difficulty || 'medium',
      duration: challenge.duration || 30,
      icon: challenge.icon || challenge.metadata?.icon || '🎯',
      rules: Array.isArray(challenge.rules) ? challenge.rules : [],
      participants: challenge.participants || 0,
      featured: challenge.featured || false,
      
      // User progress - from UserChallenge model
      joinedAt: challenge.joinedAt,
      currentStreak: challenge.currentStreak || 0,
      longestStreak: challenge.longestStreak || 0,
      totalProgress: challenge.totalProgress || 0,
      completedToday: completedToday,
      lastActivity: challenge.lastActivity,
      dailyProgress: challenge.dailyProgress || {},
      progress: challenge.progress || 0,
      streak: challenge.streak || challenge.currentStreak || 0,
      totalDays: challenge.totalDays || challenge.totalProgress || 0,
      completedDays: Array.isArray(challenge.completedDays) ? challenge.completedDays : []
    };
  }

  /**
   * =========================================
   * CHALLENGE DISCOVERY API
   * =========================================
   */

  /**
   * Get all available challenges from backend
   * This endpoint automatically seeds default challenges if none exist
   * 
   * @param {Object} params - Optional filters (category, difficulty, search)
   * @returns {Object} { success, challenges, data }
   */
  static async getChallenges(params = {}) {
    try {
      // Build query string from params
      const queryParams = new URLSearchParams();
      if (params.category && params.category !== 'all') queryParams.append('category', params.category);
      if (params.difficulty && params.difficulty !== 'all') queryParams.append('difficulty', params.difficulty);
      if (params.search) queryParams.append('search', params.search);
      
      const url = `${API_URL}/challenges/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      console.log('🔍 Fetching challenges from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: buildHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Handle both data.challenges and data.data formats
        const challengesData = data.challenges || data.data || [];
        const challenges = challengesData.map(challenge => this.transformChallenge(challenge));
        
        console.log(`✅ Fetched ${challenges.length} challenges`);
        
        return {
          success: true,
          challenges: challenges,
          data: challengesData
        };
      }
      
      return { success: false, challenges: [], data: [] };
    } catch (error) {
      console.error('❌ Error fetching challenges:', error);
      return { 
        success: false, 
        challenges: [], 
        data: [], 
        message: error.message 
      };
    }
  }

  /**
   * Alias for getChallenges - used by profile.jsx and other components
   */
  static async getAvailableChallenges(params = {}) {
    return this.getChallenges(params);
  }

  /**
   * Get challenge by ID
   * 
   * @param {string} challengeId - Challenge ID
   * @returns {Object} { success, challenge }
   */
  static async getChallengeById(challengeId) {
    try {
      const response = await fetch(`${API_URL}/challenges/${challengeId}`, {
        method: 'GET',
        headers: buildHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          challenge: this.transformChallenge(data.challenge || data.data)
        };
      }
      
      return { success: false, challenge: null };
    } catch (error) {
      console.error('❌ Error fetching challenge:', error);
      return { success: false, challenge: null, message: error.message };
    }
  }

  /**
   * =========================================
   * USER CHALLENGES API
   * =========================================
   */

  /**
   * Get user's joined challenges with progress
   * Used by both Challenges page and Profile page
   * 
   * @returns {Object} { success, challenges, data }
   */
  static async getMyChallenges() {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        console.warn('⚠️ No user email found - user may not be authenticated');
        return { success: false, challenges: [], message: 'User not authenticated' };
      }

      const url = `${API_URL}/challenges/my-challenges`;
      
      console.log('🔍 Fetching user challenges from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: buildHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Handle both data.challenges and data.data formats
        const challengesData = data.challenges || data.data || [];
        const challenges = challengesData.map(challenge => this.transformUserChallenge(challenge));
        
        console.log(`✅ Fetched ${challenges.length} user challenges`);
        
        return {
          success: true,
          challenges: challenges,
          data: challengesData
        };
      }
      
      return { success: false, challenges: [], data: [] };
    } catch (error) {
      console.error('❌ Error fetching user challenges:', error);
      return { 
        success: false, 
        challenges: [], 
        data: [], 
        message: error.message 
      };
    }
  }

  /**
   * Get daily check-ins for today or specified date
   * Transforms user challenges into check-in format
   * 
   * @param {string} date - Date in YYYY-MM-DD format (defaults to today)
   * @returns {Object} { success, data }
   */
  static async getDailyCheckins(date = null) {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        return { success: false, data: [], message: 'User not authenticated' };
      }

      const targetDate = date || new Date().toISOString().split('T')[0];
      
      // Try to get from dedicated endpoint first
      try {
        const url = `${API_URL}/challenges/user/${encodeURIComponent(userEmail)}/daily-checkins?date=${targetDate}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: buildHeaders()
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            return {
              success: true,
              data: data.data || []
            };
          }
        }
      } catch (e) {
        console.warn('⚠️ Dedicated checkins endpoint failed, falling back to my-challenges');
      }

      // Fallback: Use getMyChallenges which has the data
      const result = await this.getMyChallenges();
      
      if (!result.success) {
        return { success: false, data: [], message: result.message };
      }

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
        notes: challenge.dailyProgress?.[targetDate]?.notes || '',
        verificationMethod: challenge.dailyProgress?.[targetDate]?.verificationMethod || null,
        currentStreak: challenge.currentStreak || 0,
        totalProgress: challenge.totalProgress || 0
      }));

      return {
        success: true,
        data: checkins
      };
    } catch (error) {
      console.error('❌ Error fetching daily check-ins:', error);
      return { success: false, data: [], message: error.message };
    }
  }

  /**
   * Check if user has joined a specific challenge
   * 
   * @param {string} challengeId - Challenge ID
   * @returns {boolean} True if joined
   */
  static async isChallengeJoined(challengeId) {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        return false;
      }

      const userChallenges = await this.getMyChallenges();
      if (userChallenges.success) {
        return userChallenges.challenges.some(challenge => 
          challenge.id === challengeId || challenge.challengeId === challengeId
        );
      }
      
      return false;
    } catch (error) {
      console.error('❌ Error checking if challenge is joined:', error);
      return false;
    }
  }

  /**
   * Check if user has verified a specific challenge today
   * 
   * @param {string} challengeId - Challenge ID
   * @returns {boolean} True if verified today
   */
  static async hasVerifiedToday(challengeId) {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        return false;
      }

      const today = new Date().toISOString().split('T')[0];
      
      // Get checkins for today
      const checkins = await this.getDailyCheckins(today);
      
      if (!checkins.success) return false;
      
      return checkins.data.some(checkin => 
        (checkin.challengeId === challengeId || checkin.challenge?._id === challengeId) && 
        checkin.completed === true
      );
    } catch (error) {
      console.error('❌ Error checking verification:', error);
      return false;
    }
  }

  /**
   * =========================================
   * CHALLENGE ACTIONS API
   * =========================================
   */

  /**
   * Join a challenge
   * Creates UserChallenge document in MongoDB
   * 
   * @param {string} challengeId - Challenge ID to join
   * @returns {Object} { success, message, data }
   */
  static async joinChallenge(challengeId) {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        return { success: false, message: 'User not authenticated. Please log in.' };
      }

      console.log('🔍 Joining challenge:', challengeId);

      const response = await fetch(`${API_URL}/challenges/${challengeId}/join`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ userEmail })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Successfully joined challenge:', challengeId);
        
        return {
          success: true,
          data: data.userChallenge || data.data,
          message: data.message || 'Successfully joined challenge'
        };
      }
      
      return { 
        success: false, 
        message: data.message || 'Failed to join challenge' 
      };
    } catch (error) {
      console.error('❌ Error joining challenge:', error);
      
      // Handle specific error messages
      if (error.message.includes('already joined')) {
        return { success: false, message: 'You have already joined this challenge' };
      }
      if (error.message.includes('not found')) {
        return { success: false, message: 'Challenge not found' };
      }
      
      return { success: false, message: error.message || 'Failed to join challenge' };
    }
  }

  /**
   * Verify daily progress for a challenge
   * Implements 23-hour lock - can only verify once per day
   * 
   * @param {string} challengeId - Challenge ID
   * @param {string} userId - User ID (optional, derived from email if not provided)
   * @param {Object} progressData - Additional verification data (notes, photos)
   * @returns {Object} { success, message, data, alreadyDone }
   */
  static async verifyProgress(challengeId, userId, progressData = {}) {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        return { success: false, message: 'User not authenticated' };
      }

      console.log('🔍 Verifying progress for challenge:', challengeId);

      const response = await fetch(`${API_URL}/challenges/${challengeId}/verify`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({
          userEmail,
          notes: progressData.notes || '',
          verificationMethod: progressData.verificationMethod || 'manual',
          timestamp: new Date().toISOString(),
          ...progressData
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Progress verified for challenge:', challengeId);
        
        // Check if already verified today
        if (data.alreadyDone || (data.data && data.data.alreadyDone)) {
          return {
            success: true,
            message: 'Already verified today',
            alreadyDone: true,
            data: data.data
          };
        }
        
        return {
          success: true,
          data: data.data || data,
          message: data.message || 'Progress verified successfully'
        };
      }
      
      return { 
        success: false, 
        message: data.message || 'Failed to verify progress' 
      };
    } catch (error) {
      console.error('❌ Error verifying progress:', error);
      
      // Handle specific error messages
      if (error.message.includes('already verified')) {
        return { 
          success: false, 
          message: 'Already verified today', 
          alreadyDone: true 
        };
      }
      
      return { success: false, message: error.message || 'Failed to verify progress' };
    }
  }

  /**
   * Leave a challenge
   * 
   * @param {string} challengeId - Challenge ID to leave
   * @returns {Object} { success, message }
   */
  static async leaveChallenge(challengeId) {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        return { success: false, message: 'User not authenticated' };
      }

      console.log('🔍 Leaving challenge:', challengeId);

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
        console.log('✅ Left challenge:', challengeId);
        
        return {
          success: true,
          message: data.message || 'Successfully left the challenge'
        };
      }
      
      return { success: false, message: data.message || 'Failed to leave challenge' };
    } catch (error) {
      console.error('❌ Error leaving challenge:', error);
      return { success: false, message: error.message || 'Failed to leave challenge' };
    }
  }

  /**
   * =========================================
   * CHALLENGE CREATION API
   * =========================================
   */

  /**
   * Create a new challenge
   * 
   * @param {Object} challengeData - Challenge details
   * @returns {Object} { success, challenge, message }
   */
  static async createChallenge(challengeData) {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        return { success: false, message: 'User not authenticated' };
      }

      console.log('🔍 Creating challenge:', challengeData.name);

      const response = await fetch(`${API_URL}/challenges`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({
          name: challengeData.name,
          description: challengeData.description,
          type: challengeData.type || 'streak',
          category: challengeData.category || 'custom',
          difficulty: challengeData.difficulty || 'medium',
          duration: challengeData.duration || 30,
          rules: challengeData.rules || [],
          icon: challengeData.icon || '🎯',
          visibility: 'public',
          createdBy: userEmail,
          ...challengeData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Challenge created:', data.challenge?.name);
        
        return {
          success: true,
          challenge: this.transformChallenge(data.challenge || data.data),
          message: data.message || 'Challenge created successfully'
        };
      }
      
      return { success: false, message: data.message || 'Failed to create challenge' };
    } catch (error) {
      console.error('❌ Error creating challenge:', error);
      return { success: false, message: error.message || 'Failed to create challenge' };
    }
  }

  /**
   * =========================================
   * PROGRESS TRACKING API
   * =========================================
   */

  /**
   * Update challenge progress (alternative to verifyProgress)
   * 
   * @param {string} challengeId - Challenge ID
   * @param {Object} progressData - Progress data
   * @returns {Object} { success, data, message }
   */
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
          message: data.message || 'Progress updated successfully'
        };
      }
      
      return { success: false, message: data.message || 'Failed to update progress' };
    } catch (error) {
      console.error('❌ Error updating progress:', error);
      return { success: false, message: error.message || 'Failed to update progress' };
    }
  }

  /**
   * Get progress for a specific challenge
   * 
   * @param {string} challengeId - Challenge ID
   * @returns {Object|null} Progress object or null
   */
  static async getChallengeProgress(challengeId) {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        return null;
      }

      const userChallenges = await this.getMyChallenges();
      if (!userChallenges.success) return null;
      
      const challenge = userChallenges.challenges.find(c => 
        c.id === challengeId || c.challengeId === challengeId
      );
      
      if (!challenge) return null;
      
      return {
        totalDays: challenge.totalProgress || 0,
        currentStreak: challenge.currentStreak || 0,
        longestStreak: challenge.longestStreak || 0,
        completedToday: challenge.completedToday || false,
        progress: challenge.progress || 0,
        dailyProgress: challenge.dailyProgress || {}
      };
    } catch (error) {
      console.error('❌ Error getting challenge progress:', error);
      return null;
    }
  }

  /**
   * =========================================
   * ANALYTICS API
   * =========================================
   */

  /**
   * Get challenge analytics/stats
   * 
   * @param {string} challengeId - Challenge ID
   * @returns {Object} { success, data }
   */
  static async getChallengeAnalytics(challengeId) {
    try {
      const response = await fetch(`${API_URL}/challenges/${challengeId}/analytics`, {
        method: 'GET',
        headers: buildHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          data: data.data || data.analytics || {}
        };
      }
      
      return { success: false, data: {} };
    } catch (error) {
      console.error('❌ Error fetching challenge analytics:', error);
      return { success: false, data: {}, message: error.message };
    }
  }

  /**
   * Get daily progress report for user
   * 
   * @returns {Object} { success, data }
   */
  static async getDailyProgressReport() {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        return { success: false, message: 'User not authenticated' };
      }

      const response = await fetch(`${API_URL}/challenges/user/${encodeURIComponent(userEmail)}/daily-report`, {
        method: 'GET',
        headers: buildHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          data: data.data || {}
        };
      }
      
      return { success: false, data: {} };
    } catch (error) {
      console.error('❌ Error fetching daily progress report:', error);
      return { success: false, data: {}, message: error.message };
    }
  }

  /**
   * =========================================
   * OFFLINE SUPPORT (Optional)
   * =========================================
   */

  /**
   * Save challenges to localStorage for offline use
   * This is a backup only - primary source is always backend
   * 
   * @param {Array} challenges - Challenges to cache
   * @returns {boolean} Success
   */
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

  /**
   * Get challenges from localStorage (offline fallback)
   * Only used if backend is unavailable
   * 
   * @returns {Array|null} Cached challenges or null
   */
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

  /**
   * =========================================
   * UTILITY METHODS
   * =========================================
   */

  /**
   * Check if user is authenticated
   * 
   * @returns {boolean} True if authenticated
   */
  static isAuthenticated() {
    return getUserEmail() !== null && getAuthToken() !== null;
  }

  /**
   * Get current user email
   * 
   * @returns {string|null} User email or null
   */
  static getCurrentUserEmail() {
    return getUserEmail();
  }

  /**
   * Clear all cached challenge data
   */
  static clearCache() {
    try {
      localStorage.removeItem('touchgrass_challenges');
      console.log('✅ Challenge cache cleared');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Refresh all challenge data
   * Useful after joining/verifying to ensure UI is up to date
   * 
   * @returns {Object} Fresh challenge data
   */
  static async refreshAll() {
    console.log('🔄 Refreshing all challenge data');
    
    const [available, myChallenges] = await Promise.all([
      this.getAvailableChallenges(),
      this.getMyChallenges()
    ]);
    
    return {
      available: available.challenges || [],
      myChallenges: myChallenges.challenges || []
    };
  }
}

export default RealChallengeService;