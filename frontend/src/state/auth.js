import { atom } from 'recoil';

// ==============================
// AUTHENTICATION STATE MANAGEMENT
// Single source of truth using Recoil
// ==============================

// Main auth state atom
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

// Auth modal state atom
export const authModalState = atom({
  key: 'authModalState',
  default: {
    isOpen: false,
    mode: 'login',
    redirectTo: null
  }
});

// Auth helper functions - now empty to prevent mock usage
// All authentication should go through AuthContext which uses Supabase
export const login = async (email, password) => {
  throw new Error('Login should be performed through the AuthContext using Supabase');
};

export const logout = () => {
  // Clear local storage to ensure clean logout
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('touchgrass_user');
  localStorage.removeItem('supabase.auth.token');
  
  return {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false
  };
};

export const register = async (userData) => {
  throw new Error('Registration should be performed through the AuthContext using Supabase');
};

export const checkAuth = () => {
  // Check if we have any stored authentication
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const touchgrassUser = localStorage.getItem('touchgrass_user');
  const supabaseToken = localStorage.getItem('supabase.auth.token');
  
  if (supabaseToken) {
    // If we have a Supabase token, we should let AuthContext handle it
    return {
      isAuthenticated: false,
      user: null,
      token: null,
      loading: true
    };
  }
  
  if (token && user) {
    try {
      const parsedUser = JSON.parse(user);
      return {
        isAuthenticated: true,
        user: parsedUser,
        token: token,
        loading: false
      };
    } catch (error) {
      console.error('Error parsing stored user:', error);
      // Clear invalid data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
  
  if (touchgrassUser) {
    try {
      const parsedUser = JSON.parse(touchgrassUser);
      return {
        isAuthenticated: true,
        user: parsedUser,
        token: null,
        loading: false
      };
    } catch (error) {
      console.error('Error parsing touchgrass user:', error);
      localStorage.removeItem('touchgrass_user');
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