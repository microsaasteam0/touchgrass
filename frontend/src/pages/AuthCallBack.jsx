// /Users/apple/Documents/touchgrass/frontend/src/pages/AuthCallback.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      console.log('🔄 Processing OAuth callback...');
      setStatus('processing');
      
      // Capture full URL for debugging
      const fullUrl = window.location.href;
      console.log('📍 Full URL:', fullUrl);
      
      // Parse URL
      const url = new URL(fullUrl);
      const searchParams = new URLSearchParams(url.search);
      const hashParams = new URLSearchParams(url.hash.substring(1));
      
      // Collect all parameters
      const allParams = {};
      searchParams.forEach((value, key) => allParams[key] = value);
      hashParams.forEach((value, key) => allParams[key] = value);
      
      console.log('📋 All URL parameters:', allParams);
      setDebugInfo(JSON.stringify(allParams, null, 2));
      
      // Check for errors FIRST
      const error = allParams.error || allParams.error_code;
      const errorDescription = allParams.error_description;

      if (error) {
        console.error('❌ OAuth error:', error, errorDescription);
        setStatus('error');

        let errorMessage = 'Google authentication failed. ';
        let detailedInstructions = '';

        if (error === 'server_error' && errorDescription?.includes('Unable to exchange external code')) {
          errorMessage += 'Google OAuth is not configured in Supabase.';
          detailedInstructions = `

8. Restart your dev server after configuration
          `;
        } else if (error === 'access_denied') {
          errorMessage += 'You denied access to Google.';
        } else if (errorDescription) {
          errorMessage += errorDescription;
        }

        // toast.error(errorMessage, {
        //   theme: 'dark',
        //   autoClose: 10000
        // });

        // Show detailed instructions
        if (detailedInstructions) {
          setTimeout(() => {
            alert(detailedInstructions);
          }, 1000);
        }

        // Store error for debugging
        localStorage.setItem('oauth_callback_error', JSON.stringify({
          error,
          errorDescription,
          url: fullUrl,
          timestamp: new Date().toISOString(),
        }));
        
        // Clear URL and redirect
        window.history.replaceState({}, '', '/auth?mode=login');
        setTimeout(() => navigate('/auth?mode=login', { replace: true }), 2000);
        return;
      }
      
      // Check for authorization code
      const code = allParams.code;
      
      if (!code) {
        console.error('❌ No authorization code found');
        console.log('📝 Available params:', Object.keys(allParams));
        
        setStatus('no_code');
        
        // Check if this is a redirect from Google without code (might be configuration issue)
        // if (Object.keys(allParams).length === 0) {
        //   toast.error('Google OAuth configuration incomplete. No authorization code received.', { 
        //     theme: 'dark',
        //     autoClose: 5000 
        //   });
        // }
        
        // Clear URL and redirect
        window.history.replaceState({}, '', '/auth?mode=login');
        setTimeout(() => navigate('/auth?mode=login', { replace: true }), 2000);
        return;
      }
      
      console.log('🔑 Found authorization code');
      setStatus('exchanging_code');
      
      try {
        // Try to exchange code for session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          console.error('❌ Code exchange error:', exchangeError);
          setStatus('exchange_error');
          
          toast.error(`Failed to authenticate: ${exchangeError.message}`, { 
            theme: 'dark',
            autoClose: 5000 
          });
          
          // Clear URL
          window.history.replaceState({}, '', '/auth?mode=login');
          setTimeout(() => navigate('/auth?mode=login', { replace: true }), 2000);
          return;
        }
        
        console.log('✅ Code exchange successful');
        console.log('📦 Session data:', data);
        
        if (data?.session?.user) {
          console.log('✅ OAuth successful! User:', data.session.user.email);
          setStatus('success');
          
          // Clear URL
          window.history.replaceState({}, '', '/dashboard');
          
          toast.success(`Welcome ${data.session.user.email}!`, { theme: 'dark' });
          
          // IMMEDIATELY navigate to dashboard - no delay
          navigate('/dashboard', { replace: true });
        } else {
          console.error('❌ No session after code exchange');
          setStatus('no_session');
          
          toast.error('Authentication failed. No user session created.', { theme: 'dark' });
          setTimeout(() => navigate('/auth?mode=login', { replace: true }), 2000);
        }
        
      } catch (exchangeError) {
        console.error('❌ Exchange process error:', exchangeError);
        setStatus('process_error');
        
        toast.error('Authentication process failed. Please try again.', { theme: 'dark' });
        setTimeout(() => navigate('/auth?mode=login', { replace: true }), 2000);
      }
    };

    handleCallback();
  }, [navigate]);

  // Render based on status
  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
            <p className="mt-6 text-xl font-semibold text-gray-800 dark:text-white">
              Processing Google authentication...
            </p>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Please wait while we complete the login.
            </p>
          </div>
        );
      
      case 'exchanging_code':
        return (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <div className="mt-6 text-xl font-semibold text-gray-800 dark:text-white">
              Exchanging authorization code...
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Completing authentication with Google.
            </p>
          </div>
        );
      
      case 'success':
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="mt-6 text-xl font-semibold text-gray-800 dark:text-white">
              Authentication Successful!
            </p>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Redirecting to dashboard...
            </p>
          </div>
        );
      
      case 'error':
      case 'no_code':
      case 'exchange_error':
      case 'no_session':
      case 'process_error':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {/* Authentication Failed */}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {status === 'no_code' 
                  ? 'Google did not return an authorization code. This usually means Google OAuth is not properly configured in Supabase.'
                  : 'There was an error during the authentication process.'}
              </p>
              
              {/* Debug info (collapsed by default) */}
              <details className="mb-6">
                <summary className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                  Technical Details
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-900 rounded text-xs text-left overflow-auto max-h-40">
                  {debugInfo}
                </pre>
              </details>
              
              <button
                onClick={() => navigate('/auth?mode=login', { replace: true })}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition"
              >
                Back to Login
              </button>
              
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Need help? Check Supabase Google OAuth configuration.
              </p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
      {renderContent()}
    </div>
  );
};

export default AuthCallback;