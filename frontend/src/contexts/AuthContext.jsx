
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { supabase } from '../lib/supabase';

// const AuthContext = createContext({});
// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [initialized, setInitialized] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Email validation function - ADD THIS ONCE
//   const isValidEmail = (email) => {
//     const emailTrimmed = email.trim().toLowerCase();
    
//     // 1. Basic format validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(emailTrimmed)) {
//       return { valid: false, reason: 'Invalid email format' };
//     }
    
//     const domain = emailTrimmed.split('@')[1];
    
//     // 2. Block disposable/temporary email domains
//     const disposableDomains = [
//       'example.com', 'test.com', 'example.org', 'test.org',
//       'mailinator.com', '10minutemail.com', 'guerrillamail.com',
//       'yopmail.com', 'throwawaymail.com', 'tempmail.com',
//       'fakeinbox.com', 'trashmail.com', 'getairmail.com',
//       'temp-mail.org', 'temp-mail.io', 'dispostable.com',
//       'maildrop.cc', 'getnada.com', 'temp-mail.ru',
//       'sharklasers.com', 'grr.la', 'guerrillamail.org',
//       'mailnesia.com', 'spam4.me', 'tempmailaddress.com',
//       'mohmal.com', 'fake-mail.net', 'jetable.org',
//       'harakirimail.com', 'mailcatch.com', 'tmpmail.org'
//     ];
    
//     if (disposableDomains.some(d => domain.includes(d))) {
//       return { valid: false, reason: 'Disposable/temporary emails are not allowed' };
//     }
    
//     // 3. Block obviously fake domains
//     const fakePatterns = [
//       /^fake/, /^test/, /^temp/, /^dummy/, /^example/,
//       /^invalid/, /^nonexistent/, /^notreal/, /^placeholder/
//     ];
    
//     if (fakePatterns.some(pattern => pattern.test(domain))) {
//       return { valid: false, reason: 'Please use a valid email domain' };
//     }
    
//     // 4. Block suspicious TLDs
//     const suspiciousTLDs = ['.local', '.test', '.example', '.invalid'];
//     if (suspiciousTLDs.some(tld => domain.endsWith(tld))) {
//       return { valid: false, reason: 'Invalid email domain' };
//     }
    
//     // 5. Block specific suspicious emails (like "you@gmail.com")
//     const suspiciousEmails = [
//       'you@gmail.com', 'me@gmail.com', 'test@gmail.com',
//       'fake@gmail.com', 'temp@gmail.com', 'email@gmail.com',
//       'user@gmail.com', 'demo@gmail.com', 'sample@gmail.com',
//       'admin@gmail.com', 'info@gmail.com', 'contact@gmail.com',
//       'hello@gmail.com', 'hi@gmail.com', 'hey@gmail.com'
//     ];
    
//     if (suspiciousEmails.includes(emailTrimmed)) {
//       return { valid: false, reason: 'Please use your personal email address' };
//     }
    
//     // 6. Check email length
//     if (emailTrimmed.length < 6 || emailTrimmed.length > 254) {
//       return { valid: false, reason: 'Invalid email length' };
//     }
    
//     return { valid: true };
//   };

//   // Initialize auth - FIXED VERSION
//   useEffect(() => {
//     let mounted = true;
    
//     const initializeAuth = async () => {
//       try {
        
//         // Get session
//         const { data: { session }, error } = await supabase.auth.getSession();
        
//         if (error) {
//           // Continue anyway
//         }
        
        
//         if (mounted) {
//         if (session?.user) {
//           setUser(session.user);
            
//             // CRITICAL FIX: Check if we should redirect
//             const currentPath = location.pathname;
//             const shouldRedirect = currentPath === '/' || 
//                                   currentPath === '/auth' || 
//                                   currentPath.includes('/login') ||
//                                   currentPath.includes('/register');
            
//             if (shouldRedirect) {
//               // Use setTimeout to avoid React state update warnings
//               setTimeout(() => {
//                 if (mounted) {
//                   navigate('/dashboard', { replace: true });
//                 }
//               }, 100);
//             }
//           } else {
//             setUser(null);
            
//             // If on dashboard without session, redirect to login
//             if (location.pathname.includes('/dashboard')) {
//               setTimeout(() => {
//                 if (mounted) {
//                   navigate('/auth?mode=login', { replace: true });
//                 }
//               }, 100);
//             }
//           }
//         }
        
//       } catch (error) {
//       } finally {
//         if (mounted) {
//           setLoading(false);
//           setInitialized(true);
//         }
//       }
//     };

//     initializeAuth();

//     // Listen for auth changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {

//         if (!mounted) return;

//         if (session?.user) {
//           setUser(session.user);
          
//           if (event === 'SIGNED_IN') {
//             toast.success('Welcome! 🎉', { theme: 'dark' });
            
//             // Clear URL if needed
//             if (window.location.pathname !== '/dashboard') {
//               window.history.replaceState({}, '', '/dashboard');
//             }
            
//             // Navigate to dashboard
//             setTimeout(() => {
//               if (mounted && !window.location.pathname.includes('/dashboard')) {
//                 navigate('/dashboard', { replace: true });
//               }
//             }, 500);
//           }
//         } else if (event === 'SIGNED_OUT') {
//           setUser(null);
          
//           // Clear auth token
//           localStorage.removeItem('supabase.auth.token');
          
//           // Only redirect if we're on a protected page
//           if (location.pathname.includes('/dashboard')) {
//             setTimeout(() => {
//               if (mounted) {
//                 navigate('/auth?mode=login', { replace: true });
//               }
//             }, 300);
//           }
//         }
//       }
//     );

//     return () => {
//       mounted = false;
//       subscription?.unsubscribe();
//     };
//   }, [navigate, location]);

//   // Register with email/password - UPDATED WITH EMAIL VALIDATION
//   const signup = async (email, password) => {
//     try {
//       setLoading(true);
      
//       // Validate email BEFORE sending to Supabase
//       const emailValidation = isValidEmail(email);
//       if (!emailValidation.valid) {
//         throw new Error(emailValidation.reason);
//       }
      
//       const { data, error } = await supabase.auth.signUp({
//         email: email.trim(),
//         password: password.trim(),
//         options: {
//           emailRedirectTo: `${window.location.origin}/dashboard`,
//         }
//       });

//       if (error) {
        
//         if (error.message.includes('already registered')) {
//           throw new Error('Email already registered. Please log in.');
//         }
//         throw error;
//       }
      
      
//       // Check if email confirmation is required
//       if (data.user && !data.session) {
//         toast.info('Account created! Please check your email.', { 
//           theme: 'dark',
//           autoClose: 5000 
//         });
//         navigate('/auth?mode=login');
//       } else {
//         // Auto-signed in
//         toast.success('Account created successfully!', { theme: 'dark' });
//         // Auth state change will handle redirect
//       }
      
//       return { success: true, data };
      
//     } catch (error) {
      
//       let errorMessage = 'Registration failed. Please try again.';
      
//       if (error.message.includes('already registered')) {
//         errorMessage = 'Email already registered. Please log in.';
//       } else if (error.message.includes('Password should be at least')) {
//         errorMessage = 'Password must be at least 6 characters.';
//       } else if (error.message.includes('Disposable') || 
//                  error.message.includes('Invalid email') || 
//                  error.message.includes('Please use')) {
//         // Keep the validation error message
//         errorMessage = error.message;
//       }
      
//       toast.error(errorMessage, { theme: 'dark' });
//       return { success: false, error: errorMessage };
      
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Login with email/password - UPDATED WITH EMAIL VALIDATION
//   const login = async (email, password) => {
//     try {
//       setLoading(true);
      
//       // Validate email BEFORE sending to Supabase
//       const emailValidation = isValidEmail(email);
//       if (!emailValidation.valid) {
//         throw new Error(emailValidation.reason);
//       }
      
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email: email.trim(),
//         password: password.trim(),
//       });

//       if (error) {
        
//         if (error.message.includes('Invalid login credentials')) {
//           throw new Error('Invalid email or password.');
//         }
//         throw error;
//       }
      
      
//       toast.success('Welcome back! 🌱', { theme: 'dark' });
      
//       // The onAuthStateChange will handle redirect
//       return { success: true, user: data.user };
      
//     } catch (error) {
      
//       let errorMessage = 'Login failed. Please try again.';
      
//       if (error.message.includes('Invalid login credentials')) {
//         errorMessage = 'Invalid email or password.';
//       } else if (error.message.includes('Disposable') || 
//                  error.message.includes('Invalid email') || 
//                  errorMessage.includes('Please use')) {
//         // Keep the validation error message
//         errorMessage = error.message;
//       }
      
//       toast.error(errorMessage, { theme: 'dark' });
//       return { success: false, error: errorMessage };
      
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Google OAuth - UNCHANGED
//   const googleLogin = async () => {
//     try {
//       setLoading(true);

//       const redirectUrl = `${window.location.origin}/auth/callback`;

//       const { error } = await supabase.auth.signInWithOAuth({
//         provider: 'google',
//         options: {
//           redirectTo: redirectUrl,
//           queryParams: {
//             access_type: 'offline',
//             prompt: 'consent',
//           },
//         },
//       });

//       if (error) throw error;


//     } catch (error) {
//       toast.error('Google login failed. Please try email/password.', { theme: 'dark' });
//       setLoading(false);
//       throw error;
//     }
//   };

//   // Logout - UPDATED TO NAVIGATE TO HOME
//   const logout = async () => {
//     try {
//       await supabase.auth.signOut();
//       setUser(null);
//       localStorage.removeItem('supabase.auth.token');
//       toast.info('Logged out successfully', { theme: 'dark' });
//       navigate('/', { replace: true });
//     } catch (error) {
//     }
//   };

//   const value = {
//     user,
//     loading,
//     initialized,
//     isAuthenticated: !!user,
//     signup,
//     login,
//     googleLogin,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase'; // <- FIXED: Changed to relative path

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
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

  // Initialize auth
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session error:', error);
        }

        if (mounted) {
          if (session?.user) {
            setUser(session.user);

            // Check if we should redirect to dashboard
            const currentPath = location.pathname;
            const shouldRedirect = currentPath === '/' ||
                                  currentPath === '/auth' ||
                                  currentPath.includes('/login') ||
                                  currentPath.includes('/register');

            if (shouldRedirect) {
              setTimeout(() => {
                if (mounted) {
                  navigate('/dashboard', { replace: true });
                }
              }, 100);
            }
          } else {
            setUser(null);
            setSession(null);

            // If on protected page without session, redirect to login
            const currentPath = location.pathname;
            const isProtectedPage = currentPath.includes('/dashboard') ||
                                   currentPath.includes('/profile') ||
                                   currentPath.includes('/settings') ||
                                   currentPath.includes('/chat') ||
                                   currentPath.includes('/challenges') ||
                                   currentPath.includes('/subscription') ||
                                   currentPath.includes('/verify') ||
                                   currentPath.includes('/payment');

            if (isProtectedPage) {
              setTimeout(() => {
                if (mounted) {
                  navigate('/auth?mode=login', { replace: true });
                }
              }, 100);
            }
          }
        }

      } catch (error) {
        // Handle AbortError specifically - this is expected in some network conditions
        if (error.name === 'AbortError' || (error.message && error.message.includes('aborted'))) {
          console.warn('Auth initialization aborted - this is non-critical');
        } else {
          console.error('Auth initialization error:', error.message || error);
        }
        // Even on error, set user to null and continue
        if (mounted) {
          setUser(null);
          setSession(null);
        }
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
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          setSession(session);

          if (event === 'SIGNED_IN') {
            // Navigate to dashboard after successful sign in
            setTimeout(() => {
              if (mounted && !window.location.pathname.includes('/dashboard')) {
                navigate('/dashboard', { replace: true });
              }
            }, 100);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);

          // Clear auth token
          localStorage.removeItem('supabase.auth.token');

          // Only redirect if we're on a protected page
          if (location.pathname.includes('/dashboard') ||
              location.pathname.includes('/profile') ||
              location.pathname.includes('/settings')) {
            setTimeout(() => {
              if (mounted) {
                navigate('/auth?mode=login', { replace: true });
              }
            }, 100);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [navigate, location]); // Add dependencies back for proper re-initialization

  // Safety timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading && !initialized) {
        console.warn('Auth initialization timeout - forcing completion');
        setLoading(false);
        setInitialized(true);
        setUser(null); // Assume not authenticated if timeout
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [loading, initialized]);



  // Register with email/password - UPDATED WITH EMAIL VALIDATION
  const signup = async (email, password) => {
    try {
      setLoading(true);
      
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
        
        if (error.message.includes('already registered')) {
          throw new Error('Email already registered. Please log in.');
        }
        throw error;
      }
      
      
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
        
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password.');
        }
        throw error;
      }
      
      
      toast.success('Welcome back! 🌱', { theme: 'dark' });
      
      // The onAuthStateChange will handle redirect
      return { success: true, user: data.user };
      
    } catch (error) {
      
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

      const redirectUrl = `${window.location.origin}/auth/callback`;

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


    } catch (error) {
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
    }
  };

  const value = {
    user,
    session,
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

export default AuthContext;
