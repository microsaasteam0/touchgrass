import React from 'react';
  
  
  /**
 * TouchGrass Streak Service - Unified Streak Management
 * Ensures consistent streak data across all components
 * Fetches from backend API with localStorage fallback
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://touchgrass-backend.onrender.com';

class StreakService {
  constructor() {
    this.cache = null;
    this.cacheTimestamp = null;
    this.cacheDuration = 30000; // 30 seconds cache
    this.listeners = new Set();
  }

  /**
   * Get authentication token from storage
   */
  getAuthToken() {
    const tokenSources = [
      () => localStorage.getItem('touchgrass_token'),
      () => localStorage.getItem('touchgrass_access_token'),
      () => localStorage.getItem('access_token'),
      () => localStorage.getItem('supabase.auth.token'),
      () => localStorage.getItem('sb-auth-token'),
      () => {
        const session = localStorage.getItem('sb-lkrwoidwisbwktndxoca-auth-token');
        if (session) {
          try {
            const parsed = JSON.parse(session);
            return parsed?.access_token || null;
          } catch (e) {
            return null;
          }
        }
        return null;
      }
    ];

    for (const source of tokenSources) {
      try {
        const token = source();
        if (token && token !== 'undefined' && token !== 'null') {
          // Handle JSON encoded tokens
          if (token.startsWith('{') || token.startsWith('[')) {
            try {
              const parsed = JSON.parse(token);
              return parsed.access_token || parsed.token || null;
            } catch (e) {
              continue;
            }
          }
          return token;
        }
      } catch (e) {
        continue;
      }
    }
    return null;
  }

  /**
   * Get user data from storage
   */
  getUserFromStorage() {
    try {
      const userData = localStorage.getItem('touchgrass_user');
      if (userData) {
        return JSON.parse(userData);
      }
      
      // Try auth state
      const authState = localStorage.getItem('authState');
      if (authState) {
        const auth = JSON.parse(authState);
        if (auth?.user) {
          return auth.user;
        }
      }
      
      // Try Supabase session
      const supabaseSession = localStorage.getItem('sb-lkrwoidwisbwktndxoca-auth-token');
      if (supabaseSession) {
        const session = JSON.parse(supabaseSession);
        if (session?.user) {
          return {
            id: session.user.id,
            email: session.user.email,
            username: session.user.email?.split('@')[0] || 'user',
            displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User'
          };
        }
      }
    } catch (error) {
      console.error('Error getting user from storage:', error);
    }
    return null;
  }

  /**
   * Get local streak data from localStorage (fallback)
   */
  getLocalStreakData(username) {
    try {
      const streakKey = `touchgrass_streak_${username || 'default'}`;
      const storedData = localStorage.getItem(streakKey);
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error getting local streak data:', error);
    }
    return null;
  }

  /**
   * Save streak data to localStorage
   */
  saveLocalStreakData(username, data) {
    try {
      const streakKey = `touchgrass_streak_${username || 'default'}`;
      localStorage.setItem(streakKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving local streak data:', error);
    }
  }

  /**
   * Check if cache is valid
   */
  isCacheValid() {
    return this.cache && this.cacheTimestamp && 
           (Date.now() - this.cacheTimestamp) < this.cacheDuration;
  }

  /**
   * Fetch streak data from backend API
   */
  async fetchStreakFromAPI() {
    const token = this.getAuthToken();
    
    if (!token) {
      console.log('No auth token found, using local data');
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/streaks/current`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data?.streak || data;
      } else if (response.status === 401) {
        console.log('Token expired or invalid');
        return null;
      } else {
        console.log('API response not ok:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching streak from API:', error);
      return null;
    }
  }

  /**
   * Verify today's streak
   */
  async verifyToday(verificationData) {
    const token = this.getAuthToken();
    const user = this.getUserFromStorage();
    
    if (!token) {
      // Fallback to local verification
      return this.verifyLocal(user?.username, verificationData);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/streaks/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(verificationData)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update local storage with new streak data
        if (data?.streak) {
          this.saveLocalStreakData(user?.username, {
            currentStreak: data.streak.current || data.streak.currentStreak,
            longestStreak: data.streak.longest || data.streak.longestStreak,
            totalDays: data.streak.totalDays || 0,
            todayVerified: true,
            lastVerification: new Date().toISOString(),
            history: data.streak.history || []
          });
        }
        
        // Invalidate cache
        this.cache = null;
        this.cacheTimestamp = null;
        
        // Notify listeners
        this.notifyListeners();
        
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData?.message || 'Verification failed' };
      }
    } catch (error) {
      console.error('Error verifying streak:', error);
      // Fallback to local verification
      return this.verifyLocal(user?.username, verificationData);
    }
  }

  /**
   * Local verification fallback
   */
  verifyLocal(username, verificationData) {
    try {
      const streakData = this.getLocalStreakData(username) || {
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        totalOutdoorTime: 0,
        history: [],
        todayVerified: false,
        lastVerification: null
      };

      // Check if already verified today
      if (streakData.todayVerified) {
        return { success: false, error: 'Already verified today' };
      }

      const today = new Date().toDateString();
      const lastVerification = streakData.lastVerification ? new Date(streakData.lastVerification) : null;
      
      // Check if streak should continue or reset
      let newCurrentStreak = streakData.currentStreak;
      if (lastVerification) {
        const lastDate = new Date(lastVerification);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastDate.toDateString() !== yesterday.toDateString() && 
            lastDate.toDateString() !== today) {
          // Streak broken - reset
          newCurrentStreak = 0;
        }
      }

      const updatedData = {
        ...streakData,
        currentStreak: newCurrentStreak + 1,
        longestStreak: Math.max(streakData.longestStreak, newCurrentStreak + 1),
        totalDays: (streakData.totalDays || 0) + 1,
        totalOutdoorTime: (streakData.totalOutdoorTime || 0) + (verificationData.duration || 30),
        todayVerified: true,
        lastVerification: new Date().toISOString(),
        history: [
          ...(streakData.history || []),
          {
            date: new Date().toISOString(),
            verified: true,
            duration: verificationData.duration || 30,
            activity: verificationData.activity || 'Outdoor time',
            method: verificationData.method || 'manual'
          }
        ]
      };

      this.saveLocalStreakData(username, updatedData);
      
      // Invalidate cache
      this.cache = null;
      this.cacheTimestamp = null;
      
      // Notify listeners
      this.notifyListeners();

      return { 
        success: true, 
        data: { 
          streak: updatedData,
          message: `Day ${updatedData.currentStreak} verified!`
        } 
      };
    } catch (error) {
      console.error('Error in local verification:', error);
      return { success: false, error: 'Verification failed' };
    }
  }

  /**
   * Get unified streak data - main method to be used by all components
   */
  async getStreakData() {
    // Return cached data if valid
    if (this.isCacheValid()) {
      return this.cache;
    }

    const user = this.getUserFromStorage();
    const username = user?.username || 'default';

    // Try to fetch from API first
    const apiData = await this.fetchStreakFromAPI();
    
    if (apiData) {
      // Normalize API data
      const normalizedData = {
        currentStreak: apiData.current || apiData.currentStreak || 0,
        longestStreak: apiData.longest || apiData.longestStreak || 0,
        totalDays: apiData.totalDays || 0,
        totalOutdoorTime: apiData.totalOutdoorTime || 0,
        todayVerified: apiData.todayVerified || false,
        lastVerification: apiData.lastVerification || null,
        history: apiData.history || [],
        status: apiData.status || 'active',
        consistency: apiData.consistency || apiData.verificationRate || 0,
        averageDuration: apiData.averageDuration || 0,
        shareCount: apiData.shareCount || 0,
        viralScore: apiData.viralScore || 0,
        challengeWins: apiData.challengeWins || 0,
        source: 'api'
      };
      
      // Save to local storage for offline use
      this.saveLocalStreakData(username, normalizedData);
      
      // Update cache
      this.cache = normalizedData;
      this.cacheTimestamp = Date.now();
      
      return normalizedData;
    }

    // Fallback to local storage
    const localData = this.getLocalStreakData(username);
    
    if (localData) {
      // Check and update today's verification status
      const today = new Date().toDateString();
      const lastVerification = localData.lastVerification ? new Date(localData.lastVerification) : null;
      
      // Reset todayVerified if it's a new day
      if (lastVerification && lastVerification.toDateString() !== today) {
        localData.todayVerified = false;
      }
      
      // Check if streak is broken (missed yesterday)
      if (lastVerification) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastVerification.toDateString() !== yesterday.toDateString() && 
            lastVerification.toDateString() !== today &&
            !localData.todayVerified) {
          // Streak is broken
          localData.currentStreak = 0;
          localData.status = 'broken';
        }
      }
      
      const normalizedData = {
        currentStreak: localData.currentStreak || 0,
        longestStreak: localData.longestStreak || 0,
        totalDays: localData.totalDays || 0,
        totalOutdoorTime: localData.totalOutdoorTime || 0,
        todayVerified: localData.todayVerified || false,
        lastVerification: localData.lastVerification || null,
        history: localData.history || [],
        status: localData.status || 'active',
        consistency: localData.consistency || 0,
        averageDuration: localData.averageDuration || 0,
        shareCount: localData.shareCount || 0,
        viralScore: localData.viralScore || 0,
        challengeWins: localData.challengeWins || 0,
        source: 'local'
      };
      
      // Update cache
      this.cache = normalizedData;
      this.cacheTimestamp = Date.now();
      
      return normalizedData;
    }

    // Return default data
    const defaultData = {
      currentStreak: 0,
      longestStreak: 0,
      totalDays: 0,
      totalOutdoorTime: 0,
      todayVerified: false,
      lastVerification: null,
      history: [],
      status: 'active',
      consistency: 0,
      averageDuration: 0,
      shareCount: 0,
      viralScore: 0,
      challengeWins: 0,
      source: 'default'
    };
    
    // Save default to local storage
    this.saveLocalStreakData(username, defaultData);
    
    // Update cache
    this.cache = defaultData;
    this.cacheTimestamp = Date.now();
    
    return defaultData;
  }

  /**
   * Sync local data with API
   */
  async syncWithAPI() {
    const apiData = await this.fetchStreakFromAPI();
    const user = this.getUserFromStorage();
    
    if (apiData && user) {
      this.saveLocalStreakData(user.username, apiData);
      this.cache = null;
      this.cacheTimestamp = null;
      this.notifyListeners();
      return true;
    }
    return false;
  }

  /**
   * Subscribe to streak data changes
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners of data changes
   */
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in streak listener:', error);
      }
    });
  }

  /**
   * Clear cache and force refresh
   */
  clearCache() {
    this.cache = null;
    this.cacheTimestamp = null;
  }

  /**
   * Get stats formatted for display
   */
  async getStatsForDisplay() {
    const streakData = await this.getStreakData();
    const user = this.getUserFromStorage();
    
    // Calculate consistency
    const joinDate = user?.createdAt ? new Date(user.createdAt) : new Date();
    const daysSinceJoin = Math.max(1, Math.floor((new Date() - joinDate) / (1000 * 60 * 60 * 24)));
    const consistency = streakData.totalDays > 0 
      ? Math.min(100, Math.round((streakData.totalDays / daysSinceJoin) * 100))
      : 0;

    return {
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      totalDays: streakData.totalDays,
      totalOutdoorTime: streakData.totalOutdoorTime,
      todayVerified: streakData.todayVerified,
      consistency: consistency,
      averageDuration: streakData.averageDuration,
      shareCount: streakData.shareCount,
      viralScore: streakData.viralScore,
      challengeWins: streakData.challengeWins,
      status: streakData.status,
      lastVerification: streakData.lastVerification
    };
  }
}

// Export singleton instance
const streakService = new StreakService();
export default streakService;
