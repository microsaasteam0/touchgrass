import { atom } from 'recoil';
import { supabase } from '../lib/supabase';

// ==============================
// AUTHENTICATION STATE MANAGEMENT
// Single source of truth using Recoil - SYNCED WITH SUPABASE
// ==============================

// Main auth state atom - synced with Supabase
export const authState = atom({
  key: 'authState',
  default: {
    isAuthenticated: false,
    user: null,
    session: null,
    loading: true,
    error: null
  },
  effects: [
    ({ onSet, setSelf }) => {
      // Subscribe to Supabase auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔄 Recoil authState - Supabase event:', event);
          
          if (event === 'SIGNED_IN' && session) {
            setSelf({
              isAuthenticated: true,
              user: session.user,
              session: session,
              loading: false,
              error: null
            });
          } else if (event === 'SIGNED_OUT') {
            setSelf({
              isAuthenticated: false,
              user: null,
              session: null,
              loading: false,
              error: null
            });
          } else if (event === 'TOKEN_REFRESHED' && session) {
            setSelf(current => ({
              ...current,
              session: session,
              user: session.user
            }));
          }
        }
      );

      // Cleanup subscription
      return () => {
        authListener?.subscription.unsubscribe();
      };
    }
  ]
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

// ==============================
// HELPER FUNCTIONS - FIXED TO NOT AUTO-CLEAR
// ==============================

/**
 * Initialize auth state from existing session
 * Call this once when your app starts
 */
export const initializeAuthState = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error.message);
      return {
        isAuthenticated: false,
        user: null,
        session: null,
        loading: false,
        error: error.message
      };
    }
    
    if (session) {
      console.log('✅ Found existing Supabase session for:', session.user.email);
      
      // Ensure token is in localStorage in the format streakService expects
      await ensureTokenInStorage(session);
      
      return {
        isAuthenticated: true,
        user: session.user,
        session: session,
        loading: false,
        error: null
      };
    }
    
    return {
      isAuthenticated: false,
      user: null,
      session: null,
      loading: false,
      error: null
    };
  } catch (error) {
    console.error('Error initializing auth:', error);
    return {
      isAuthenticated: false,
      user: null,
      session: null,
      loading: false,
      error: error.message
    };
  }
};

/**
 * Ensure token is properly stored in localStorage
 */
const ensureTokenInStorage = async (session) => {
  if (!session) return;
  
  try {
    const projectId = 'lkrwoidwisbwktndxoca';
    const storageKey = `sb-${projectId}-auth-token`;
    
    // Store in the format streakService expects
    const tokenData = {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
      expires_in: session.expires_in,
      token_type: session.token_type || 'bearer',
      user: session.user
    };
    
    localStorage.setItem(storageKey, JSON.stringify(tokenData));
    console.log(`✅ Token stored in ${storageKey}`);
    
    // Also store in alternative location for compatibility
    localStorage.setItem('supabase.auth.token', JSON.stringify({
      currentSession: session,
      access_token: session.access_token,
      expires_at: session.expires_at
    }));
    
  } catch (error) {
    console.warn('Could not store token:', error.message);
  }
};

/**
 * Login - Use Supabase directly
 */
export const login = async (email, password) => {
  console.log('🔐 Attempting login with Supabase...');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    if (data.session) {
      await ensureTokenInStorage(data.session);
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Login error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Logout - Clear state but DON'T auto-clear everything
 */
export const logout = async () => {
  console.log('🚪 Logging out...');
  
  try {
    // Sign out from Supabase first
    await supabase.auth.signOut();
    
    // Clear ONLY auth-related items, NOT streak data
    const authKeys = [
      'supabase.auth.token',
      'sb-lkrwoidwisbwktndxoca-auth-token',
      'sb-lkrwoidwisbwktndxoca-auth-token-code-verifier',
      'token',
      'user'
    ];
    
    authKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        // Ignore
      }
    });
    
    console.log('✅ Logout successful');
    
    return {
      isAuthenticated: false,
      user: null,
      session: null,
      loading: false
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      isAuthenticated: false,
      user: null,
      session: null,
      loading: false
    };
  }
};

/**
 * Register - Use Supabase directly
 */
export const register = async (email, password, userData = {}) => {
  console.log('📝 Attempting registration with Supabase...');
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) throw error;
    
    if (data.session) {
      await ensureTokenInStorage(data.session);
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Registration error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Check auth status - Get from Supabase session
 */
export const checkAuth = async () => {
  console.log('🔍 Checking auth status...');
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error checking auth:', error.message);
      return {
        isAuthenticated: false,
        user: null,
        session: null,
        loading: false,
        error: error.message
      };
    }
    
    if (session) {
      console.log('✅ Active session found for:', session.user.email);
      
      // Ensure token is in storage
      await ensureTokenInStorage(session);
      
      return {
        isAuthenticated: true,
        user: session.user,
        session: session,
        loading: false,
        error: null
      };
    }
    
    console.log('ℹ️ No active session');
    return {
      isAuthenticated: false,
      user: null,
      session: null,
      loading: false,
      error: null
    };
    
  } catch (error) {
    console.error('Error in checkAuth:', error);
    return {
      isAuthenticated: false,
      user: null,
      session: null,
      loading: false,
      error: error.message
    };
  }
};

/**
 * Get the current auth token
 */
export const getToken = () => {
  try {
    const projectId = 'lkrwoidwisbwktndxoca';
    const storageKey = `sb-${projectId}-auth-token`;
    
    const sessionData = localStorage.getItem(storageKey);
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      return parsed?.access_token || null;
    }
    
    const altSession = localStorage.getItem('supabase.auth.token');
    if (altSession) {
      const parsed = JSON.parse(altSession);
      return parsed?.access_token || parsed?.currentSession?.access_token || null;
    }
    
    return null;
  } catch (e) {
    console.error('Error getting token:', e);
    return null;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  try {
    const projectId = 'lkrwoidwisbwktndxoca';
    const storageKey = `sb-${projectId}-auth-token`;
    
    const sessionData = localStorage.getItem(storageKey);
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      return parsed?.user || null;
    }
    
    return null;
  } catch (e) {
    return null;
  }
};

// Export for recoil
export default authState;