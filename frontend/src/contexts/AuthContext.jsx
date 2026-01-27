// // /Users/apple/Documents/touchgrass/frontend/src/contexts/AuthContext.jsx
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { supabase } from '../lib/supabase'; // Make sure you have this

// // Create Auth Context
// const AuthContext = createContext({});

// // Custom hook to use auth context
// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const navigate = useNavigate();

//   // Initialize auth state
//   useEffect(() => {
//     const checkAuth = async () => {
//       setLoading(true);
      
//       try {
//         // Check Supabase session first
//         const { data: { session } } = await supabase.auth.getSession();
        
//         if (session) {
//           console.log('✅ Supabase session found:', session.user.email);
//           setUser(session.user);
//           setIsAuthenticated(true);
          
//           // Sync with profiles table
//           await ensureUserProfile(session.user);
//         } else {
//           // Fallback to local storage (for backward compatibility)
//           const token = localStorage.getItem('touchgrass_token');
//           const userData = localStorage.getItem('touchgrass_user');
          
//           if (token && userData) {
//             const parsedUser = JSON.parse(userData);
//             setUser(parsedUser);
//             setIsAuthenticated(true);
//           }
//         }
//       } catch (error) {
//         console.error('Auth check error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();

//     // Listen for auth changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         console.log('Auth state changed:', event);
        
//         if (session) {
//           setUser(session.user);
//           setIsAuthenticated(true);
//           await ensureUserProfile(session.user);
//         } else {
//           setUser(null);
//           setIsAuthenticated(false);
//         }
//       }
//     );

//     return () => subscription.unsubscribe();
//   }, []);

//   // Helper: Ensure user profile exists in profiles table
//   const ensureUserProfile = async (supabaseUser) => {
//     try {
//       // Check if profile exists
//       const { data: existingProfile } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('id', supabaseUser.id)
//         .single();

//       if (!existingProfile) {
//         // Create profile
//         const username = supabaseUser.email.split('@')[0] + '_' + 
//           Math.random().toString(36).substr(2, 5);
        
//         const { error: profileError } = await supabase
//           .from('profiles')
//           .insert([
//             {
//               id: supabaseUser.id,
//               username: username,
//               email: supabaseUser.email,
//               full_name: supabaseUser.user_metadata.full_name || 
//                        supabaseUser.user_metadata.name || 
//                        supabaseUser.email.split('@')[0],
//               avatar_url: supabaseUser.user_metadata.avatar_url || 
//                          supabaseUser.user_metadata.picture || 
//                          `https://ui-avatars.com/api/?name=${encodeURIComponent(supabaseUser.email.split('@')[0])}&background=random`,
//               stats: {
//                 current_streak: 0,
//                 longest_streak: 0,
//                 total_days: 0,
//                 total_outdoor_time: 0,
//                 consistency_score: 0
//               },
//               subscription: {
//                 plan: 'free',
//                 active: false
//               }
//             }
//           ]);

//         if (profileError) {
//           console.error('Profile creation error:', profileError);
//         } else {
//           console.log('✅ User profile created');
//         }
//       }
//     } catch (error) {
//       console.error('Error ensuring user profile:', error);
//     }
//   };

//   // Login with email/password (using Supabase)
//   const login = async (email, password) => {
//     try {
//       setLoading(true);
      
//       console.log('🔑 Attempting Supabase login...');
      
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password
//       });

//       if (error) throw error;

//       // User is now authenticated via Supabase
//       setUser(data.user);
//       setIsAuthenticated(true);

//       // Store in local storage for consistency
//       localStorage.setItem('supabase_user', JSON.stringify(data.user));
      
//       toast.success(`Welcome back, ${data.user.email}! 🌱`, {
//         position: 'top-right',
//         theme: 'dark',
//       });
      
//       // Navigate to dashboard
//       navigate('/dashboard', { replace: true });
      
//       return { success: true, user: data.user };
      
//     } catch (error) {
//       console.error('Login error:', error);
      
//       toast.error(
//         error.message || 'Login failed. Please check your credentials.',
//         {
//           position: 'top-right',
//           theme: 'dark',
//         }
//       );
      
//       return { 
//         success: false, 
//         error: error.message 
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Register new user (using Supabase)
//   const signup = async (userData) => {
//     try {
//       setLoading(true);
      
//       console.log('🔑 Creating new Supabase account...');
      
//       // First, sign up with Supabase
//       const { data: authData, error: authError } = await supabase.auth.signUp({
//         email: userData.email,
//         password: userData.password,
//         options: {
//           data: {
//             username: userData.username,
//             display_name: userData.displayName,
//             full_name: userData.displayName
//           }
//         }
//       });

//       if (authError) throw authError;

//       // If signup was successful
//       if (authData.user) {
//         // Create profile in profiles table
//         const { error: profileError } = await supabase
//           .from('profiles')
//           .insert([
//             {
//               id: authData.user.id,
//               username: userData.username,
//               email: userData.email,
//               full_name: userData.displayName,
//               avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.displayName)}&background=random`,
//               stats: {
//                 current_streak: 0,
//                 longest_streak: 0,
//                 total_days: 0,
//                 total_outdoor_time: 0,
//                 consistency_score: 0
//               },
//               subscription: {
//                 plan: 'free',
//                 active: false
//               }
//             }
//           ]);

//         if (profileError) {
//           console.error('Profile creation error:', profileError);
//           // Continue anyway - profile can be created later
//         }

//         toast.success(`Welcome to TouchGrass, ${userData.displayName}! 🎉`, {
//           position: 'top-right',
//           theme: 'dark',
//         });

//         // If email confirmation is required
//         if (!authData.user.email_confirmed_at) {
//           toast.info('Please check your email to confirm your account! 📧', {
//             position: 'top-right',
//             theme: 'dark',
//           });
//           navigate('/', { replace: true });
//         } else {
//           // Auto-login if email is already confirmed
//           setUser(authData.user);
//           setIsAuthenticated(true);
//           localStorage.setItem('supabase_user', JSON.stringify(authData.user));
//           navigate('/dashboard', { replace: true });
//         }

//         return { success: true, user: authData.user };
//       }

//       throw new Error('Registration failed');

//     } catch (error) {
//       console.error('Registration error:', error);
      
//       toast.error(
//         error.message || 'Registration failed. Please try again.',
//         {
//           position: 'top-right',
//           theme: 'dark',
//         }
//       );
      
//       return { 
//         success: false, 
//         error: error.message 
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Google login (using Supabase OAuth)
//   const googleLogin = async () => {
//     try {
//       setLoading(true);
      
//       console.log('🔑 Starting Google OAuth...');
      
//       const { data, error } = await supabase.auth.signInWithOAuth({
//         provider: 'google',
//         options: {
//           redirectTo: `${window.location.origin}/auth/callback`,
//           queryParams: {
//             access_type: 'offline',
//             prompt: 'consent',
//           }
//         }
//       });

//       if (error) throw error;

//       // Note: The actual authentication happens in the AuthCallback page
//       // This function will return immediately, and the browser will redirect
//       return { success: true };

//     } catch (error) {
//       console.error('Google login error:', error);
      
//       toast.error(
//         error.message || 'Google authentication failed',
//         {
//           position: 'top-right',
//           theme: 'dark',
//         }
//       );
      
//       return { success: false, error: error.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Logout
//   const logout = async () => {
//     try {
//       await supabase.auth.signOut();
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       // Clear all local storage
//       localStorage.removeItem('supabase_session');
//       localStorage.removeItem('supabase_user');
//       localStorage.removeItem('touchgrass_user');
//       localStorage.removeItem('touchgrass_token');
      
//       // Clear state
//       setUser(null);
//       setIsAuthenticated(false);
      
//       toast.info('Logged out successfully', {
//         position: 'top-right',
//         theme: 'dark',
//       });
      
//       // Navigate to home
//       navigate('/', { replace: true });
//     }
//   };

//   // Forgot password (using Supabase)
//   const forgotPassword = async (email) => {
//     try {
//       const { error } = await supabase.auth.resetPasswordForEmail(email, {
//         redirectTo: `${window.location.origin}/reset-password`,
//       });

//       if (error) throw error;

//       toast.success('Password reset instructions sent to your email! 📧', {
//         position: 'top-right',
//         theme: 'dark',
//       });

//       return { success: true };
      
//     } catch (error) {
//       console.error('Forgot password error:', error);
//       toast.error(error.message || 'Failed to send reset instructions');
//       throw error;
//     }
//   };

//   // Get current user (with profile data)
//   const getCurrentUser = async () => {
//     if (!user) return null;
    
//     try {
//       // Get full profile from profiles table
//       const { data: profile, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('id', user.id)
//         .single();

//       if (error) throw error;

//       return {
//         ...user,
//         profile: profile || {}
//       };
//     } catch (error) {
//       console.error('Get current user error:', error);
//       return user;
//     }
//   };

//   // Context value
//   const value = {
//     user,
//     loading,
//     isAuthenticated,
//     login,
//     signup,
//     googleLogin,
//     logout,
//     forgotPassword,
//     getCurrentUser,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Export helper function
// export const getAuthHeaders = async () => {
//   const { data: { session } } = await supabase.auth.getSession();
//   return session ? { 
//     'Authorization': `Bearer ${session.access_token}`,
//     'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY 
//   } : {};
// };
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Email validation function - ADD THIS ONCE
  const isValidEmail = (email) => {
    const emailTrimmed = email.trim().toLowerCase();
    
    // 1. Basic format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      return { valid: false, reason: 'Invalid email format' };
    }
    
    const domain = emailTrimmed.split('@')[1];
    
    // 2. Block disposable/temporary email domains
    const disposableDomains = [
      'example.com', 'test.com', 'example.org', 'test.org',
      'mailinator.com', '10minutemail.com', 'guerrillamail.com',
      'yopmail.com', 'throwawaymail.com', 'tempmail.com',
      'fakeinbox.com', 'trashmail.com', 'getairmail.com',
      'temp-mail.org', 'temp-mail.io', 'dispostable.com',
      'maildrop.cc', 'getnada.com', 'temp-mail.ru',
      'sharklasers.com', 'grr.la', 'guerrillamail.org',
      'mailnesia.com', 'spam4.me', 'tempmailaddress.com',
      'mohmal.com', 'fake-mail.net', 'jetable.org',
      'harakirimail.com', 'mailcatch.com', 'tmpmail.org'
    ];
    
    if (disposableDomains.some(d => domain.includes(d))) {
      return { valid: false, reason: 'Disposable/temporary emails are not allowed' };
    }
    
    // 3. Block obviously fake domains
    const fakePatterns = [
      /^fake/, /^test/, /^temp/, /^dummy/, /^example/,
      /^invalid/, /^nonexistent/, /^notreal/, /^placeholder/
    ];
    
    if (fakePatterns.some(pattern => pattern.test(domain))) {
      return { valid: false, reason: 'Please use a valid email domain' };
    }
    
    // 4. Block suspicious TLDs
    const suspiciousTLDs = ['.local', '.test', '.example', '.invalid'];
    if (suspiciousTLDs.some(tld => domain.endsWith(tld))) {
      return { valid: false, reason: 'Invalid email domain' };
    }
    
    // 5. Block specific suspicious emails (like "you@gmail.com")
    const suspiciousEmails = [
      'you@gmail.com', 'me@gmail.com', 'test@gmail.com',
      'fake@gmail.com', 'temp@gmail.com', 'email@gmail.com',
      'user@gmail.com', 'demo@gmail.com', 'sample@gmail.com',
      'admin@gmail.com', 'info@gmail.com', 'contact@gmail.com',
      'hello@gmail.com', 'hi@gmail.com', 'hey@gmail.com'
    ];
    
    if (suspiciousEmails.includes(emailTrimmed)) {
      return { valid: false, reason: 'Please use your personal email address' };
    }
    
    // 6. Check email length
    if (emailTrimmed.length < 6 || emailTrimmed.length > 254) {
      return { valid: false, reason: 'Invalid email length' };
    }
    
    return { valid: true };
  };

  // Initialize auth - FIXED VERSION
  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');
        console.log('📍 Current path:', location.pathname);
        
        // Get session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Session error:', error);
          // Continue anyway
        }
        
        console.log('📦 Session data:', session);
        
        if (mounted) {
          if (session?.user) {
            console.log('✅ User found:', session.user.email);
            setUser(session.user);
            
            // CRITICAL FIX: Check if we should redirect
            const currentPath = location.pathname;
            const shouldRedirect = currentPath === '/' || 
                                  currentPath === '/auth' || 
                                  currentPath.includes('/login') ||
                                  currentPath.includes('/register');
            
            if (shouldRedirect) {
              console.log('🔄 Redirecting to dashboard from:', currentPath);
              // Use setTimeout to avoid React state update warnings
              setTimeout(() => {
                if (mounted) {
                  navigate('/dashboard', { replace: true });
                }
              }, 100);
            }
          } else {
            console.log('❌ No active session');
            setUser(null);
            
            // If on dashboard without session, redirect to login
            if (location.pathname.includes('/dashboard')) {
              console.log('🔄 No session on dashboard, redirecting to login...');
              setTimeout(() => {
                if (mounted) {
                  navigate('/auth?mode=login', { replace: true });
                }
              }, 100);
            }
          }
        }
        
      } catch (error) {
        console.error('❌ Auth init error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔑 Auth event:', event);
        console.log('📦 Session:', session?.user?.email || 'No user');
        
        if (!mounted) return;
        
        if (session?.user) {
          console.log('✅ User authenticated:', session.user.email);
          setUser(session.user);
          
          if (event === 'SIGNED_IN') {
            toast.success('Welcome! 🎉', { theme: 'dark' });
            
            // Clear URL if needed
            if (window.location.pathname !== '/dashboard') {
              window.history.replaceState({}, '', '/dashboard');
            }
            
            // Navigate to dashboard
            setTimeout(() => {
              if (mounted && !window.location.pathname.includes('/dashboard')) {
                navigate('/dashboard', { replace: true });
              }
            }, 500);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('❌ User signed out');
          setUser(null);
          
          // Clear auth token
          localStorage.removeItem('supabase.auth.token');
          
          // Only redirect if we're on a protected page
          if (location.pathname.includes('/dashboard')) {
            setTimeout(() => {
              if (mounted) {
                navigate('/auth?mode=login', { replace: true });
              }
            }, 300);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [navigate, location]);

  // Register with email/password - UPDATED WITH EMAIL VALIDATION
  const signup = async (email, password) => {
    try {
      setLoading(true);
      console.log('🔑 Signing up:', email);
      
      // Validate email BEFORE sending to Supabase
      const emailValidation = isValidEmail(email);
      if (!emailValidation.valid) {
        throw new Error(emailValidation.reason);
      }
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (error) {
        console.error('❌ Signup error:', error);
        
        if (error.message.includes('already registered')) {
          throw new Error('Email already registered. Please log in.');
        }
        throw error;
      }
      
      console.log('✅ Signup response:', data);
      
      // Check if email confirmation is required
      if (data.user && !data.session) {
        toast.info('Account created! Please check your email.', { 
          theme: 'dark',
          autoClose: 5000 
        });
        navigate('/auth?mode=login');
      } else {
        // Auto-signed in
        toast.success('Account created successfully!', { theme: 'dark' });
        // Auth state change will handle redirect
      }
      
      return { success: true, data };
      
    } catch (error) {
      console.error('❌ Signup failed:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.message.includes('already registered')) {
        errorMessage = 'Email already registered. Please log in.';
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'Password must be at least 6 characters.';
      } else if (error.message.includes('Disposable') || 
                 error.message.includes('Invalid email') || 
                 error.message.includes('Please use')) {
        // Keep the validation error message
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, { theme: 'dark' });
      return { success: false, error: errorMessage };
      
    } finally {
      setLoading(false);
    }
  };

  // Login with email/password - UPDATED WITH EMAIL VALIDATION
  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('🔑 Logging in:', email);
      
      // Validate email BEFORE sending to Supabase
      const emailValidation = isValidEmail(email);
      if (!emailValidation.valid) {
        throw new Error(emailValidation.reason);
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error('❌ Login error:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password.');
        }
        throw error;
      }
      
      console.log('✅ Login successful:', data.user.email);
      
      toast.success('Welcome back! 🌱', { theme: 'dark' });
      
      // The onAuthStateChange will handle redirect
      return { success: true, user: data.user };
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password.';
      } else if (error.message.includes('Disposable') || 
                 error.message.includes('Invalid email') || 
                 errorMessage.includes('Please use')) {
        // Keep the validation error message
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, { theme: 'dark' });
      return { success: false, error: errorMessage };
      
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth - UNCHANGED
  const googleLogin = async () => {
    try {
      setLoading(true);
      console.log('🔑 Starting Google OAuth...');

      const redirectUrl = `${window.location.origin}/auth/callback`;
      console.log('📍 Redirect URL:', redirectUrl);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;

      console.log('🔄 Redirecting to Google...');

    } catch (error) {
      console.error('❌ Google OAuth error:', error);
      toast.error('Google login failed. Please try email/password.', { theme: 'dark' });
      setLoading(false);
      throw error;
    }
  };

  // Logout - UPDATED TO NAVIGATE TO HOME
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('supabase.auth.token');
      toast.info('Logged out successfully', { theme: 'dark' });
      navigate('/', { replace: true });
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    initialized,
    isAuthenticated: !!user,
    signup,
    login,
    googleLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};