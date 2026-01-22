// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { useAuth } from './AuthContext';
// import { toast } from 'react-toastify';

// const StreakContext = createContext({});

// export const useStreak = () => useContext(StreakContext);

// export const StreakProvider = ({ children }) => {
//   const { user, isAuthenticated } = useAuth();
//   const [currentStreak, setCurrentStreak] = useState(0);
//   const [longestStreak, setLongestStreak] = useState(0);
//   const [totalDays, setTotalDays] = useState(0);
//   const [todaysVerification, setTodaysVerification] = useState(null);
//   const [streakHistory, setStreakHistory] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isAuthenticated && user) {
//       loadStreakData();
//     }
//   }, [isAuthenticated, user]);

//   const loadStreakData = async () => {
//     try {
//       setLoading(true);
      
//       // Mock API call - replace with real API
//       const response = await fetch('/api/streaks/current', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
        
//         if (data.status === 'active') {
//           setCurrentStreak(data.currentStreak || 0);
//           setLongestStreak(data.longestStreak || 0);
//           setTotalDays(data.totalDays || 0);
//           setTodaysVerification(data.todaysVerification);
//           setStreakHistory(data.history || []);
//         }
//       }
//     } catch (error) {
//       console.error('Failed to load streak data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyToday = async (verificationData) => {
//     try {
//       setLoading(true);
      
//       const response = await fetch('/api/streaks/verify', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(verificationData),
//       });

//       if (!response.ok) {
//         throw new Error('Verification failed');
//       }

//       const data = await response.json();
      
//       setCurrentStreak(data.streak);
//       setTodaysVerification(data.verification);
      
//       // Check for streak milestones
//       checkStreakMilestone(data.streak);
      
//       toast.success('✅ Verification successful! Your streak continues.', {
//         icon: '🔥',
//       });
      
//       return { success: true, data };
//     } catch (error) {
//       toast.error('Verification failed. Please try again.');
//       return { success: false, error: error.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const acceptShame = async (shameMessage) => {
//     try {
//       setLoading(true);
      
//       const response = await fetch('/api/streaks/shame', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ shameMessage }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to accept shame');
//       }

//       const data = await response.json();
      
//       setCurrentStreak(data.streak);
      
//       toast('😔 Shame accepted. Your streak continues...', {
//         icon: '😈',
//         style: {
//           background: '#7f1d1d',
//           color: '#fff'
//         }
//       });
      
//       return { success: true, data };
//     } catch (error) {
//       toast.error('Failed to accept shame.');
//       return { success: false, error: error.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkStreakMilestone = (streak) => {
//     const milestones = [7, 30, 100, 365];
    
//     if (milestones.includes(streak)) {
//       const event = new CustomEvent('achievement-unlocked', {
//         detail: { streak }
//       });
//       window.dispatchEvent(event);
      
//       toast.success(`🎉 ${streak}-day milestone achieved!`, {
//         icon: '🏆',
//         autoClose: 5000,
//       });
//     }
//   };

//   const getStreakStats = () => {
//     return {
//       currentStreak,
//       longestStreak,
//       totalDays,
//       todaysVerification,
//       streakHistory,
//       consistencyScore: totalDays > 0 ? Math.round((longestStreak / totalDays) * 100) : 0,
//     };
//   };

//   const value = {
//     currentStreak,
//     longestStreak,
//     totalDays,
//     todaysVerification,
//     streakHistory,
//     loading,
//     verifyToday,
//     acceptShame,
//     getStreakStats,
//     loadStreakData,
//   };

//   return (
//     <StreakContext.Provider value={value}>
//       {children}
//     </StreakContext.Provider>
//   );
// };

import React, { createContext, useState, useContext, useEffect } from 'react';

const StreakContext = createContext();

export const useStreak = () => useContext(StreakContext);

export const StreakProvider = ({ children }) => {
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const API_BASE_URL = 'http://localhost:5001/api';

  const loadStreakData = async () => {
    try {
      const token = localStorage.getItem('touchgrass_token');

      if (!token) {
        console.log('No token found for streak data');
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/streaks/current`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      }

      console.error('Failed to load streak data:', response.status);
      return null;
    } catch (error) {
      console.error('Streak error:', error.message);
      return null;
    }
  };

  useEffect(() => {
    const initializeStreak = async () => {
      setLoading(true);
      try {
        const data = await loadStreakData();
        setStreakData(data?.streak || data);
      } catch (error) {
        console.error('Error loading streak data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeStreak();
  }, []);

  return (
    <StreakContext.Provider value={{
      streakData,
      loading,
      loadStreakData
    }}>
      {children}
    </StreakContext.Provider>
  );
};