// ==============================
// PURE JAVASCRIPT STATE FILE
// No JSX allowed here!
// ==============================

import { atom } from 'recoil';

// ATOM DEFINITIONS
export const authState = atom({
  key: 'authState',
  default: {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
    error: null
  }
});

export const authModalState = atom({
  key: 'authModalState',
  default: {
    isOpen: false,
    mode: 'login',
    redirectTo: null
  }
});

// SIMPLE AUTH FUNCTIONS
export const login = async (email, password) => {
  try {
    // Mock user for development
    const mockUser = {
      id: '1',
      email: email,
      username: email.split('@')[0],
      displayName: email.split('@')[0],
      stats: {
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        consistencyScore: 0
      },
      subscription: {
        plan: 'free',
        active: false
      }
    };
    
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    return {
      isAuthenticated: true,
      user: mockUser,
      token: mockToken,
      loading: false
    };
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  return {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false
  };
};

export const register = async (userData) => {
  try {
    const mockUser = {
      id: '2',
      email: userData.email,
      username: userData.username || userData.email.split('@')[0],
      displayName: userData.displayName || userData.email.split('@')[0],
      stats: {
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        consistencyScore: 0
      },
      subscription: {
        plan: 'free',
        active: false
      }
    };
    
    const mockToken = 'mock-jwt-token-register-' + Date.now();
    
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    return {
      isAuthenticated: true,
      user: mockUser,
      token: mockToken,
      loading: false
    };
  } catch (error) {
    throw error;
  }
};

export const checkAuth = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    try {
      return {
        isAuthenticated: true,
        user: JSON.parse(user),
        token: token,
        loading: false
      };
    } catch (error) {
      return {
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false
      };
    }
  }
  
  return {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false
  };
};

// Export for recoil
export default authState;