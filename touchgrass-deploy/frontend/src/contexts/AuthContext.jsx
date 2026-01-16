import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

// Create Auth Context
const AuthContext = createContext({});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock user data for development (remove in production)
  const mockUsers = [
    {
      id: '1',
      email: 'demo@touchgrass.com',
      username: 'demouser',
      displayName: 'Demo User',
      avatar: '',
      stats: {
        currentStreak: 42,
        totalDays: 120,
        longestStreak: 42,
        consistencyScore: 87,
        totalOutdoorTime: 1800
      },
      subscription: {
        plan: 'premium',
        active: true
      }
    }
  ];

  useEffect(() => {
    // Check for stored auth data on mount
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('touchgrass_token');
        const userData = localStorage.getItem('touchgrass_user');

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          // Optional: Validate token with server
          // await validateToken(token);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid data
        localStorage.removeItem('touchgrass_token');
        localStorage.removeItem('touchgrass_user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Simulate API delay
  const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 800));

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await simulateApiDelay();

      // DEVELOPMENT MODE: Mock login for demo
      if (process.env.NODE_ENV === 'development') {
        // Check if it's the demo account
        if (email === 'demo@touchgrass.com' && password === 'touchgrass123') {
          const mockUser = mockUsers[0];
          
          // Create mock token
          const mockToken = 'mock_jwt_token_' + Date.now();
          
          // Store in localStorage
          localStorage.setItem('touchgrass_token', mockToken);
          localStorage.setItem('touchgrass_user', JSON.stringify(mockUser));
          
          // Update state
          setUser(mockUser);
          setIsAuthenticated(true);
          
          toast.success('Welcome back! 🌱', {
            icon: '👋',
            position: 'top-right',
            theme: 'dark',
          });
          
          return { 
            success: true, 
            user: mockUser,
            redirectTo: '/dashboard'
          };
        }
        
        // For other emails, create a new mock user
        const newMockUser = {
          id: Date.now().toString(),
          email,
          username: email.split('@')[0],
          displayName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          avatar: '',
          stats: {
            currentStreak: 1,
            totalDays: 1,
            longestStreak: 1,
            consistencyScore: 100,
            totalOutdoorTime: 15
          },
          subscription: {
            plan: 'free',
            active: true
          }
        };
        
        const mockToken = 'mock_jwt_token_' + Date.now();
        localStorage.setItem('touchgrass_token', mockToken);
        localStorage.setItem('touchgrass_user', JSON.stringify(newMockUser));
        
        setUser(newMockUser);
        setIsAuthenticated(true);
        
        toast.success('Welcome to TouchGrass! 🌱', {
          icon: '🎉',
          position: 'top-right',
          theme: 'dark',
        });
        
        return { 
          success: true, 
          user: newMockUser,
          redirectTo: '/verify' // First time users go to verify page
        };
      }

      // PRODUCTION MODE: Real API call (uncomment for production)
      /*
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store token and user data
      localStorage.setItem('touchgrass_token', data.token);
      localStorage.setItem('touchgrass_user', JSON.stringify(data.user));
      
      setUser(data.user);
      setIsAuthenticated(true);
      
      toast.success('Welcome back! 🌱', {
        icon: '👋',
        position: 'top-right',
        theme: 'dark',
      });
      
      return { 
        success: true, 
        user: data.user,
        redirectTo: data.user?.stats?.currentStreak > 0 ? '/dashboard' : '/verify'
      };
      */

    } catch (error) {
      console.error('Login error:', error);
      
      toast.error(error.message || 'Login failed. Please try again.', {
        position: 'top-right',
        theme: 'dark',
      });
      
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await simulateApiDelay();

      // DEVELOPMENT MODE: Mock signup
      if (process.env.NODE_ENV === 'development') {
        const newUser = {
          id: Date.now().toString(),
          email: userData.email,
          username: userData.username || userData.email.split('@')[0],
          displayName: userData.displayName || userData.username || userData.email.split('@')[0],
          avatar: '',
          location: userData.location || {},
          stats: {
            currentStreak: 0,
            totalDays: 0,
            longestStreak: 0,
            consistencyScore: 0,
            totalOutdoorTime: 0
          },
          subscription: {
            plan: 'free',
            active: true
          },
          createdAt: new Date().toISOString()
        };
        
        const mockToken = 'mock_jwt_token_' + Date.now();
        
        localStorage.setItem('touchgrass_token', mockToken);
        localStorage.setItem('touchgrass_user', JSON.stringify(newUser));
        
        setUser(newUser);
        setIsAuthenticated(true);
        
        toast.success('Account created successfully! 🎉', {
          icon: '🚀',
          position: 'top-right',
          theme: 'dark',
          autoClose: 3000,
        });
        
        return { 
          success: true, 
          user: newUser,
          redirectTo: '/verify' // New users start at verification
        };
      }

      // PRODUCTION MODE: Real API call (uncomment for production)
      /*
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      const data = await response.json();
      
      localStorage.setItem('touchgrass_token', data.token);
      localStorage.setItem('touchgrass_user', JSON.stringify(data.user));
      
      setUser(data.user);
      setIsAuthenticated(true);
      
      toast.success('Account created successfully! 🎉', {
        icon: '🚀',
        position: 'top-right',
        theme: 'dark',
      });
      
      return { 
        success: true, 
        user: data.user,
        redirectTo: '/verify'
      };
      */

    } catch (error) {
      console.error('Signup error:', error);
      
      toast.error(error.message || 'Signup failed. Please try again.', {
        position: 'top-right',
        theme: 'dark',
      });
      
      return { 
        success: false, 
        error: error.message || 'Signup failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear local storage
    localStorage.removeItem('touchgrass_token');
    localStorage.removeItem('touchgrass_user');
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
    
    toast.info('Logged out successfully', {
      icon: '👋',
      position: 'top-right',
      theme: 'dark',
      autoClose: 2000,
    });
    
    // Note: Navigation should be handled by the component that calls logout
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('touchgrass_user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  // Check if user has completed first verification
  const hasStartedStreak = () => {
    return user?.stats?.currentStreak > 0;
  };

  // Get user's next step
  const getUserNextStep = () => {
    if (!user) return '/';
    if (!hasStartedStreak()) return '/verify';
    return '/dashboard';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateUser,
    hasStartedStreak,
    getUserNextStep
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export a function to get auth headers for API calls
export const getAuthHeaders = () => {
  const token = localStorage.getItem('touchgrass_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};