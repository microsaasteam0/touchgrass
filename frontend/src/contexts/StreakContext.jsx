import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import streakService from '../services/streakservice';

const StreakContext = createContext();

export const useStreak = () => useContext(StreakContext);

export const StreakProvider = ({ children }) => {
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load streak data from service
  const loadStreakData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await streakService.getStreakData();
      setStreakData(data);
      return data;
    } catch (err) {
      console.error('Error loading streak data:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify today's streak
  const verifyToday = useCallback(async (verificationData) => {
    try {
      const result = await streakService.verifyToday(verificationData);
      if (result.success) {
        // Reload streak data after verification
        await loadStreakData();
      }
      return result;
    } catch (err) {
      console.error('Error verifying streak:', err);
      return { success: false, error: err.message };
    }
  }, [loadStreakData]);

  // Sync with API
  const syncWithAPI = useCallback(async () => {
    try {
      const success = await streakService.syncWithAPI();
      if (success) {
        await loadStreakData();
      }
      return success;
    } catch (err) {
      console.error('Error syncing with API:', err);
      return false;
    }
  }, [loadStreakData]);

  // Get stats for display
  const getStatsForDisplay = useCallback(async () => {
    return await streakService.getStatsForDisplay();
  }, []);

  // Clear cache and refresh
  const refreshStreak = useCallback(async () => {
    streakService.clearCache();
    return await loadStreakData();
  }, [loadStreakData]);

  // Subscribe to streak changes
  useEffect(() => {
    const unsubscribe = streakService.subscribe(() => {
      loadStreakData();
    });
    
    return unsubscribe;
  }, [loadStreakData]);

  // Initial load
  useEffect(() => {
    loadStreakData();
  }, [loadStreakData]);

  // Listen for storage changes (other tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith('touchgrass_streak_')) {
        streakService.clearCache();
        loadStreakData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadStreakData]);

  // Listen for auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      streakService.clearCache();
      loadStreakData();
    };

    window.addEventListener('auth-state-changed', handleAuthChange);
    return () => window.removeEventListener('auth-state-changed', handleAuthChange);
  }, [loadStreakData]);

  const value = {
    streakData,
    loading,
    error,
    loadStreakData,
    verifyToday,
    syncWithAPI,
    getStatsForDisplay,
    refreshStreak,
    // Convenience getters
    currentStreak: streakData?.currentStreak || 0,
    longestStreak: streakData?.longestStreak || 0,
    totalDays: streakData?.totalDays || 0,
    todayVerified: streakData?.todayVerified || false,
    status: streakData?.status || 'active'
  };

  return (
    <StreakContext.Provider value={value}>
      {children}
    </StreakContext.Provider>
  );
};

export default StreakContext;
