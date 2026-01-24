
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Auth = () => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { login, signup, googleLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check URL for mode parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlMode = params.get('mode');
    if (urlMode === 'login' || urlMode === 'register') {
      setMode(urlMode);
    }
  }, [location]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Password validation
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation (for register only)
    if (mode === 'register') {
      if (!confirmPassword.trim()) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form', { theme: 'dark' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        const result = await login(email, password);
        if (!result.success) {
          setErrors({ password: result.error });
        }
      } else {
        const result = await signup(email, password);
        if (!result.success) {
          setErrors({ email: result.error });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Authentication failed. Please try again.', { theme: 'dark' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await googleLogin();
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setErrors({});
    setPassword('');
    setConfirmPassword('');
  };

  const styles = `
    .auth-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #0a0a0a 0%, #050505 100%);
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      overflow: hidden;
      position: relative;
    }

    /* Cute Background Effects */
    .auth-bg-grid {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
      z-index: 1;
    }

    .auth-floating-elements {
      position: fixed;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    .auth-float-1 {
      position: absolute;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), rgba(127, 0, 255, 0.1));
      filter: blur(60px);
      top: 10%;
      left: 10%;
      animation: authFloat 20s infinite linear;
    }

    .auth-float-2 {
      position: absolute;
      width: 250px;
      height: 250px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 191, 36, 0.1));
      filter: blur(60px);
      bottom: 10%;
      right: 10%;
      animation: authFloat 15s infinite linear reverse;
    }

    .auth-float-3 {
      position: absolute;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1));
      filter: blur(60px);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: authFloat 25s infinite linear;
    }

    @keyframes authFloat {
      0%, 100% {
        transform: translate(0, 0) rotate(0deg);
      }
      25% {
        transform: translate(40px, -40px) rotate(90deg);
      }
      50% {
        transform: translate(0, -80px) rotate(180deg);
      }
      75% {
        transform: translate(-40px, -40px) rotate(270deg);
      }
    }

    /* Cute Grass Particles */
    .grass-particle {
      position: absolute;
      width: 2px;
      height: 20px;
      background: linear-gradient(to bottom, transparent, #22c55e, transparent);
      opacity: 0.3;
      animation: grassGrow 3s infinite;
    }

    @keyframes grassGrow {
      0% {
        transform: translateY(100vh) scaleY(0.1);
        opacity: 0;
      }
      50% {
        opacity: 0.3;
      }
      100% {
        transform: translateY(-100px) scaleY(1);
        opacity: 0;
      }
    }

    /* Main Container */
    .auth-container {
      position: relative;
      z-index: 2;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }

    .auth-content {
      width: 100%;
      max-width: 420px;
    }

    /* Cute Logo/Header */
    .auth-header {
      text-align: center;
      margin-bottom: 2.5rem;
      position: relative;
    }

    .auth-logo {
      font-size: 3.5rem;
      font-weight: 900;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #00E5FF, #22c55e, #7F00FF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.5px;
      position: relative;
      display: inline-block;
    }

    .auth-logo::after {
      content: '🌿';
      position: absolute;
      right: -2rem;
      top: 0.5rem;
      font-size: 2rem;
      animation: leafWobble 2s infinite ease-in-out;
    }

    @keyframes leafWobble {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-5deg); }
      75% { transform: rotate(5deg); }
    }

    .auth-subtitle {
      color: #94a3b8;
      font-size: 1rem;
      margin-top: 0.5rem;
      animation: subtitleFade 2s ease-in-out;
    }

    @keyframes subtitleFade {
      0% { opacity: 0; transform: translateY(10px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    /* Cute Card */
    .auth-card {
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1.5rem;
      padding: 2.5rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      position: relative;
      overflow: hidden;
    }

    .auth-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #00E5FF, #22c55e, #7F00FF);
      border-radius: 1.5rem 1.5rem 0 0;
    }

    /* Cute Toggle Buttons */
    .auth-toggle {
      display: flex;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      padding: 0.375rem;
      margin-bottom: 2rem;
      position: relative;
    }

    .auth-toggle-button {
      flex: 1;
      padding: 0.875rem;
      border-radius: 0.75rem;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.3s;
      background: transparent;
      color: #94a3b8;
      border: none;
      cursor: pointer;
      position: relative;
      z-index: 2;
    }

    .auth-toggle-button:hover {
      color: white;
    }

    .auth-toggle-button.active {
      color: white;
    }

    .auth-toggle-slider {
      position: absolute;
      top: 0.375rem;
      left: 0.375rem;
      height: calc(100% - 0.75rem);
      width: calc(50% - 0.375rem);
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
      border-radius: 0.75rem;
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      z-index: 1;
    }

    .auth-toggle-slider.register {
      transform: translateX(100%);
    }

    /* Cute Form */
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      position: relative;
    }

    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #e2e8f0;
      margin-bottom: 0.5rem;
      padding-left: 0.5rem;
    }

    .form-input {
      width: 100%;
      padding: 1rem 1.25rem;
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid transparent;
      border-radius: 1rem;
      color: white;
      font-size: 1rem;
      transition: all 0.3s;
      outline: none;
    }

    .form-input:focus {
      background: rgba(255, 255, 255, 0.08);
      border-color: #00E5FF;
      box-shadow: 0 0 0 4px rgba(0, 229, 255, 0.1);
    }

    .form-input.error {
      border-color: #ef4444;
      background: rgba(239, 68, 68, 0.05);
    }

    .form-input.success {
      border-color: #22c55e;
      background: rgba(34, 197, 94, 0.05);
    }

    .form-input::placeholder {
      color: #64748b;
    }

    .form-error {
      font-size: 0.75rem;
      color: #ef4444;
      margin-top: 0.5rem;
      padding-left: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .form-success {
      font-size: 0.75rem;
      color: #22c55e;
      margin-top: 0.5rem;
      padding-left: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    /* Cute Submit Button */
    .auth-submit-button {
      width: 100%;
      padding: 1.125rem;
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
      color: white;
      border: none;
      border-radius: 1rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
      margin-top: 0.5rem;
    }

    .auth-submit-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(0, 229, 255, 0.3);
    }

    .auth-submit-button:active:not(:disabled) {
      transform: translateY(0);
    }

    .auth-submit-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none !important;
    }

    .button-spinner {
      display: inline-block;
      width: 1.25rem;
      height: 1.25rem;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
      margin-right: 0.75rem;
      vertical-align: middle;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Cute Divider */
    .auth-divider {
      display: flex;
      align-items: center;
      margin: 2rem 0;
    }

    .auth-divider-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    }

    .auth-divider-text {
      padding: 0 1rem;
      color: #94a3b8;
      font-size: 0.875rem;
      font-weight: 500;
    }

    /* Cute Google Button */
    .auth-google-button {
      width: 100%;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .auth-google-button:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .auth-google-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .google-icon {
      width: 1.25rem;
      height: 1.25rem;
    }

    /* Cute Toggle Link */
    .auth-toggle-link {
      text-align: center;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .auth-toggle-link-text {
      color: #94a3b8;
      font-size: 0.875rem;
    }

    .auth-toggle-link-button {
      background: none;
      border: none;
      color: #00E5FF;
      font-weight: 600;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 0.375rem;
      transition: all 0.3s;
      text-decoration: none;
      margin-left: 0.25rem;
    }

    .auth-toggle-link-button:hover {
      color: white;
      background: rgba(0, 229, 255, 0.1);
    }

    /* Cute Terms */
    .auth-terms {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .auth-terms-text {
      color: #64748b;
      font-size: 0.75rem;
      line-height: 1.5;
    }

    .auth-terms-link {
      color: #00E5FF;
      text-decoration: none;
      transition: all 0.3s;
    }

    .auth-terms-link:hover {
      color: white;
      text-decoration: underline;
    }

    /* Cute Forgot Password Link */
    .forgot-password-link {
      display: block;
      text-align: right;
      margin-top: 0.5rem;
      font-size: 0.75rem;
    }

    .forgot-password-button {
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 0.25rem 0;
      transition: all 0.3s;
      text-decoration: none;
    }

    .forgot-password-button:hover {
      color: #00E5FF;
      text-decoration: underline;
    }

    /* Cute Animations */
    .form-group {
      animation: slideUp 0.5s ease-out forwards;
      opacity: 0;
      transform: translateY(20px);
    }

    .form-group:nth-child(1) { animation-delay: 0.1s; }
    .form-group:nth-child(2) { animation-delay: 0.2s; }
    .form-group:nth-child(3) { animation-delay: 0.3s; }

    @keyframes slideUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Responsive */
    @media (max-width: 480px) {
      .auth-container {
        padding: 1rem;
      }
      
      .auth-card {
        padding: 2rem 1.5rem;
      }
      
      .auth-logo {
        font-size: 2.5rem;
      }
      
      .auth-logo::after {
        font-size: 1.5rem;
        right: -1.5rem;
      }
    }

    /* Loading State */
    .auth-loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(10, 10, 10, 0.9);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
    }

    .auth-loading-overlay.active {
      opacity: 1;
      pointer-events: all;
    }

    .loading-spinner {
      width: 60px;
      height: 60px;
      border: 3px solid rgba(0, 229, 255, 0.1);
      border-radius: 50%;
      border-top-color: #00E5FF;
      animation: loadingSpin 1s linear infinite;
    }

    @keyframes loadingSpin {
      to { transform: rotate(360deg); }
    }
  `;

  return (
    <div className="auth-page">
      <style jsx>{styles}</style>
      
      {/* Cute Background Effects */}
      <div className="auth-bg-grid"></div>
      <div className="auth-floating-elements">
        <div className="auth-float-1"></div>
        <div className="auth-float-2"></div>
        <div className="auth-float-3"></div>
        
        {/* Grass Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="grass-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="auth-container">
        <div className="auth-content">
          {/* Cute Logo */}
          <div className="auth-header">
            <h1 className="auth-logo">TouchGrass</h1>
            <p className="auth-subtitle">
              {mode === 'login' ? 'Welcome back! 🌟' : 'Join our community! 🌿'}
            </p>
          </div>

          {/* Cute Card */}
          <div className="auth-card">
            {/* Cute Toggle */}
            <div className="auth-toggle">
              <div className={`auth-toggle-slider ${mode === 'register' ? 'register' : ''}`}></div>
              <button
                className={`auth-toggle-button ${mode === 'login' ? 'active' : ''}`}
                onClick={() => setMode('login')}
                disabled={isLoading}
              >
                Sign In
              </button>
              <button
                className={`auth-toggle-button ${mode === 'register' ? 'active' : ''}`}
                onClick={() => setMode('register')}
                disabled={isLoading}
              >
                Sign Up
              </button>
            </div>

            {/* Cute Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              {/* Email Field */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <div className="form-error">
                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1Zm.75 8h-1.5v-1.5h1.5V9Zm0-2.25h-1.5v-4h1.5v4Z"/>
                    </svg>
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Password</label>
                  {mode === 'login' && (
                    <Link to="/forgot-password" className="forgot-password-link">
                      <button type="button" className="forgot-password-button">
                        Forgot password?
                      </button>
                    </Link>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {errors.password && (
                  <div className="form-error">
                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1Zm.75 8h-1.5v-1.5h1.5V9Zm0-2.25h-1.5v-4h1.5v4Z"/>
                    </svg>
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password Field (Register only) */}
              {mode === 'register' && (
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  {errors.confirmPassword ? (
                    <div className="form-error">
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1Zm.75 8h-1.5v-1.5h1.5V9Zm0-2.25h-1.5v-4h1.5v4Z"/>
                      </svg>
                      {errors.confirmPassword}
                    </div>
                  ) : (
                    password && confirmPassword && password === confirmPassword && (
                      <div className="form-success">
                        <svg width="12" height="12" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10 3.5L4.5 9 2 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        </svg>
                        Passwords match!
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="auth-submit-button"
              >
                {isLoading ? (
                  <span>
                    <span className="button-spinner"></span>
                    {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                  </span>
                ) : (
                  mode === 'login' ? 'Sign In 🌟' : 'Create Account 🌿'
                )}
              </button>
            </form>

            {/* Cute Divider */}
            <div className="auth-divider">
              <div className="auth-divider-line"></div>
              <span className="auth-divider-text">OR</span>
              <div className="auth-divider-line"></div>
            </div>

            {/* Cute Google Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="auth-google-button"
            >
              <svg className="google-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Cute Toggle Link */}
            <div className="auth-toggle-link">
              <p className="auth-toggle-link-text">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={toggleMode}
                  className="auth-toggle-link-button"
                  disabled={isLoading}
                >
                  {mode === 'login' ? 'Sign up ✨' : 'Sign in 🌟'}
                </button>
              </p>
            </div>

            {/* Cute Terms */}
            <div className="auth-terms">
              <p className="auth-terms-text">
                By continuing, you agree to our{' '}
                <Link to="/terms" className="auth-terms-link">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="auth-terms-link">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      <div className={`auth-loading-overlay ${isLoading ? 'active' : ''}`}>
        <div className="loading-spinner"></div>
      </div>
    </div>
  );
};

export default Auth;