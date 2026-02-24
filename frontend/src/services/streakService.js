
      
  // /Users/apple/Documents/touchgrass/frontend/src/services/streakService.js

/**
 * TouchGrass Streak Service - REAL DATA ONLY
 * Fetches 100% real streak data from MongoDB
 */
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'https://touchgrass-7.onrender.com/api'

class StreakService {
  constructor() {
    this.cache = null;
    this.cacheTimestamp = null;
    this.cacheDuration = 30000; // 30 seconds cache
    this.listeners = new Set();
    this.refreshPromise = null;
  }

  /**
   * Get auth token from Supabase session
   */
  getAuthToken() {
    try {
      // Try the REAL token storage
      const realTokenKey = 'sb-lkrwoidwisbwktndxoca-auth-token';
      const realTokenValue = localStorage.getItem(realTokenKey);
      if (realTokenValue) {
        try {
          const parsed = JSON.parse(realTokenValue);
          if (parsed?.access_token) {
            return parsed.access_token;
          }
        } catch (e) {
          return realTokenValue;
        }
      }
      
      // Try alternative token formats
      const altTokenKey = 'supabase.auth.token';
      const altTokenValue = localStorage.getItem(altTokenKey);
      if (altTokenValue) {
        try {
          const parsed = JSON.parse(altTokenValue);
          return parsed?.access_token || 
                 parsed?.currentSession?.access_token || 
                 parsed?.session?.access_token;
        } catch (e) {}
      }
      
      return null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getAuthToken();
  }

  /**
   * Check if cache is valid
   */
  isCacheValid() {
    return this.cache && this.cacheTimestamp && 
           (Date.now() - this.cacheTimestamp) < this.cacheDuration;
  }

  /**
   * Refresh session token
   */
  async refreshSession() {
    if (this.refreshPromise) return this.refreshPromise;
    
    this.refreshPromise = (async () => {
      try {
        const { supabase } = await import('../lib/supabase');
        const { data, error } = await supabase.auth.refreshSession();
        
        if (error) throw error;
        
        if (data?.session?.access_token) {
          // Update localStorage
          const mainKey = 'sb-lkrwoidwisbwktndxoca-auth-token';
          const existingMain = localStorage.getItem(mainKey);
          if (existingMain) {
            const parsed = JSON.parse(existingMain);
            parsed.access_token = data.session.access_token;
            parsed.expires_at = data.session.expires_at;
            localStorage.setItem(mainKey, JSON.stringify(parsed));
          }
          
          return data.session.access_token;
        }
        
        return null;
      } catch (error) {
        console.error('❌ Error refreshing session:', error);
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();
    
    return this.refreshPromise;
  }

  /**
   * Make authenticated API request
   */
  async makeRequest(endpoint, options = {}, retryCount = 0) {
    const token = this.getAuthToken();
    
    if (!token) {
      if (retryCount < 1) {
        const newToken = await this.refreshSession();
        if (newToken) {
          return this.makeRequest(endpoint, options, retryCount + 1);
        }
      }
      throw new Error('No auth token found - please log in');
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (response.status === 401 && retryCount < 1) {
        const newToken = await this.refreshSession();
        if (newToken) {
          return this.makeRequest(endpoint, options, retryCount + 1);
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      return await response.json();
      
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current streak data
   */
  async getCurrentStreak() {
    if (this.isCacheValid()) {
      return this.cache;
    }
    
    try {
      if (!this.isAuthenticated()) {
        return this.getDefaultStreakData();
      }
      
      const data = await this.makeRequest('/streaks/current');
      
      if (data.success && data.streak) {
        const normalizedData = {
          current: data.streak.current || 0,
          longest: data.streak.longest || 0,
          totalDays: data.streak.totalDays || 0,
          totalOutdoorTime: data.streak.totalOutdoorTime || 0,
          todayVerified: data.streak.todayVerified || false,
          lastVerification: data.streak.lastVerification,
          lastVerificationDate: data.streak.lastVerificationDate,
          status: data.streak.status || 'active',
          verificationRate: data.streak.verificationRate || 0,
          averageDuration: data.streak.averageDuration || 0,
          freezeTokens: data.streak.freezeTokens || 0,
          isAtRisk: data.streak.isAtRisk || false,
          streakStartDate: data.streak.streakStartDate,
          milestones: data.streak.milestones || [],
          activeChallenges: data.streak.activeChallenges || 0,
          id: data.streak.id,
          canVerify: data.streak.canVerify !== false,
          hoursRemaining: data.streak.hoursRemaining || 0,
          nextVerificationTime: data.streak.nextVerificationTime
        };
        
        this.cache = normalizedData;
        this.cacheTimestamp = Date.now();
        
        return normalizedData;
      }
      
      return this.getDefaultStreakData();
      
    } catch (error) {
      console.error('❌ Error fetching streak:', error.message);
      return this.getDefaultStreakData();
    }
  }

  /**
   * Check if user can verify
   */
  async checkCanVerify() {
    try {
      if (!this.isAuthenticated()) {
        return { canVerify: true, hoursRemaining: 0 };
      }
      
      const data = await this.makeRequest('/streaks/can-verify');
      return {
        canVerify: data.canVerify,
        hoursRemaining: data.hoursRemaining,
        lastVerification: data.lastVerification,
        nextVerificationTime: data.nextVerificationTime
      };
    } catch (error) {
      console.error('Error checking verify status:', error);
      return { canVerify: true, hoursRemaining: 0 };
    }
  }

  /**
   * Verify today's activity
   */
  async verifyToday(verificationData) {
    try {
      if (!this.isAuthenticated()) {
        return {
          success: false,
          error: 'Please log in to verify your streak'
        };
      }

      const data = await this.makeRequest('/streaks/verify', {
        method: 'POST',
        body: JSON.stringify(verificationData)
      });
      
      if (data.success) {
        this.clearCache();
        this.notifyListeners();
        
        return {
          success: true,
          message: data.message,
          streak: data.streak
        };
      }
      
      return {
        success: false,
        error: data.message || 'Verification failed'
      };
    } catch (error) {
      console.error('❌ Error verifying streak:', error);
      return {
        success: false,
        error: error.message || 'Verification failed'
      };
    }
  }

  /**
   * Use freeze token
   */
  async useFreezeToken(reason) {
    try {
      if (!this.isAuthenticated()) {
        return {
          success: false,
          error: 'Please log in to use freeze tokens'
        };
      }

      const data = await this.makeRequest('/streaks/freeze', {
        method: 'POST',
        body: JSON.stringify({ reason })
      });
      
      if (data.success) {
        this.clearCache();
        this.notifyListeners();
        return data;
      }
      
      return {
        success: false,
        error: data.message || 'Failed to use freeze token'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to use freeze token'
      };
    }
  }

  /**
   * Get streak history
   */
  async getHistory(limit = 30, offset = 0) {
    try {
      if (!this.isAuthenticated()) {
        return { history: [], total: 0, hasMore: false };
      }

      const data = await this.makeRequest(
        `/streaks/history?limit=${limit}&offset=${offset}`
      );
      
      return {
        history: data.history || [],
        total: data.total || 0,
        hasMore: data.hasMore || false
      };
    } catch (error) {
      return {
        history: [],
        total: 0,
        hasMore: false,
        error: error.message
      };
    }
  }

  /**
   * Get calendar data
   */
  async getCalendarData(year, month) {
    try {
      if (!this.isAuthenticated()) {
        return this.getEmptyCalendar(year, month);
      }

      const data = await this.makeRequest(
        `/streaks/calendar/${year}/${month}`
      );
      
      return {
        calendar: data.calendar || [],
        stats: data.stats || {
          verifiedDays: 0,
          totalDays: 0,
          totalDuration: 0,
          shameDays: 0
        }
      };
    } catch (error) {
      return this.getEmptyCalendar(year, month);
    }
  }

  /**
   * Get empty calendar
   */
  getEmptyCalendar(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay();
    
    const calendar = [];
    
    for (let i = 0; i < firstDay; i++) {
      calendar.push({ day: null, data: null });
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
      calendar.push({
        day: d,
        date: `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        data: null
      });
    }
    
    return {
      calendar,
      stats: {
        verifiedDays: 0,
        totalDays: 0,
        totalDuration: 0,
        shameDays: 0
      }
    };
  }

  /**
   * Get stats
   */
  async getStats() {
    try {
      if (!this.isAuthenticated()) {
        return this.getDefaultStats();
      }

      const data = await this.makeRequest('/streaks/stats');
      
      if (data.success && data.stats) {
        return data.stats;
      }
      
      return this.getDefaultStats();
    } catch (error) {
      return this.getDefaultStats();
    }
  }

  /**
   * Get default streak data
   */
  getDefaultStreakData() {
    return {
      current: 0,
      longest: 0,
      totalDays: 0,
      totalOutdoorTime: 0,
      todayVerified: false,
      lastVerification: null,
      lastVerificationDate: null,
      status: 'inactive',
      verificationRate: 0,
      averageDuration: 0,
      freezeTokens: 0,
      isAtRisk: false,
      streakStartDate: null,
      milestones: [],
      activeChallenges: 0,
      id: null,
      canVerify: true,
      hoursRemaining: 0,
      nextVerificationTime: null
    };
  }

  /**
   * Get default stats
   */
  getDefaultStats() {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalDays: 0,
      totalOutdoorTime: 0,
      averageDuration: 0,
      verificationRate: 0,
      todayVerified: false,
      freezeTokens: 0,
      milestones: [],
      monthlyStats: []
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache = null;
    this.cacheTimestamp = null;
  }

  /**
   * Subscribe to changes
   */
  subscribe(callback) {
    if (typeof callback === 'function') {
      this.listeners.add(callback);
    }
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify listeners
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
}

// Export singleton instance
const streakService = new StreakService();
export default streakService;
