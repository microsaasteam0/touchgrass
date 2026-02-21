// /Users/apple/Documents/touchgrass/frontend/src/contexts/StreakContext.jsx

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import streakService from '../services/streakservice';

const StreakContext = createContext();

export const useStreak = () => useContext(StreakContext);

export const StreakProvider = ({ children }) => {
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canVerify, setCanVerify] = useState({ canVerify: true, hoursRemaining: 0 });

  // Load streak data
  const loadStreakData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await streakService.getCurrentStreak();
      setStreakData(data);
      
      // Check if user can verify
      if (data) {
        setCanVerify({
          canVerify: data.canVerify !== false,
          hoursRemaining: data.hoursRemaining || 0,
          nextVerificationTime: data.nextVerificationTime
        });
      }
      
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
        await loadStreakData();
      }
      return result;
    } catch (err) {
      console.error('Error verifying streak:', err);
      return { success: false, error: err.message };
    }
  }, [loadStreakData]);

  // Check if user can verify
  const checkCanVerify = useCallback(async () => {
    try {
      const status = await streakService.checkCanVerify();
      setCanVerify(status);
      return status;
    } catch (err) {
      console.error('Error checking verify status:', err);
      return { canVerify: true, hoursRemaining: 0 };
    }
  }, []);

  // Use freeze token
  const useFreezeToken = useCallback(async (reason) => {
    try {
      const result = await streakService.useFreezeToken(reason);
      if (result.success) {
        await loadStreakData();
      }
      return result;
    } catch (err) {
      console.error('Error using freeze token:', err);
      return { success: false, error: err.message };
    }
  }, [loadStreakData]);

  // Get streak history
  const getHistory = useCallback(async (limit = 30, offset = 0) => {
    try {
      return await streakService.getHistory(limit, offset);
    } catch (err) {
      console.error('Error getting history:', err);
      return { history: [], total: 0, hasMore: false };
    }
  }, []);

  // Get calendar data
  const getCalendarData = useCallback(async (year, month) => {
    try {
      return await streakService.getCalendarData(year, month);
    } catch (err) {
      console.error('Error getting calendar data:', err);
      return { calendar: [], stats: {} };
    }
  }, []);

  // Refresh streak data
  const refreshStreak = useCallback(async () => {
    streakService.clearCache();
    return await loadStreakData();
  }, [loadStreakData]);

  // Initial load
  useEffect(() => {
    loadStreakData();
    checkCanVerify();
    
    // Check every minute if we're in cooldown
    const interval = setInterval(() => {
      if (canVerify.hoursRemaining > 0) {
        checkCanVerify();
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, [loadStreakData, checkCanVerify, canVerify.hoursRemaining]);

  // Add convenience getters to streakData for backward compatibility
  const streakDataWithGetters = streakData ? {
    ...streakData,
    currentStreak: streakData.current || 0,
    longestStreak: streakData.longest || 0,
    totalDays: streakData.totalDays || 0,
    todayVerified: streakData.todayVerified || false
  } : null;

  // Listen for auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      streakService.clearCache();
      loadStreakData();
      checkCanVerify();
    };

    window.addEventListener('auth-state-changed', handleAuthChange);
    return () => window.removeEventListener('auth-state-changed', handleAuthChange);
  }, [loadStreakData, checkCanVerify]);

  const value = {
    streakData: streakDataWithGetters,
    loading,
    error,
    loadStreakData,
    verifyToday,
    useFreezeToken,
    getHistory,
    getCalendarData,
    refreshStreak,
    checkCanVerify,
    canVerify,
    // Convenience getters
    currentStreak: streakData?.current || 0,
    longestStreak: streakData?.longest || 0,
    totalDays: streakData?.totalDays || 0,
    todayVerified: streakData?.todayVerified || false,
    status: streakData?.status || 'active',
    lastVerification: streakData?.lastVerification,
    nextVerificationTime: streakData?.nextVerificationTime
  };

  return (
    <StreakContext.Provider value={value}>
      {children}
    </StreakContext.Provider>
  );
};

export default StreakContext;