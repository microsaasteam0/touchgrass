import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

// Global styles for this component
const AuthGlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  @keyframes gridMove {
    0% { transform: translate(0, 0); }
    100% { transform: translate(60px, 60px); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes errorShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }

  @keyframes shimmer {
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
  }

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

// Styled Components
const AuthPage = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

const BackgroundGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(34, 197, 94, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34, 197, 94, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: gridMove 30s linear infinite;
`;

const BackgroundParticles = styled.div`
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%);
`;

const AuthContainer = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 460px;
  margin: 0 auto;
`;

const AuthCard = styled(motion.div)`
  background: linear-gradient(145deg, rgba(30, 30, 30, 0.95), rgba(20, 20, 20, 0.95));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 48px 40px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 0 0 1px rgba(255, 255, 255, 0.03);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.4), transparent);
  }
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const AuthLogo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  text-decoration: none;
`;

const LogoIcon = styled.span`
  font-size: 32px;
  animation: float 3s ease-in-out infinite;
`;

const LogoText = styled.h1`
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #22c55e 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
`;

const AuthTagline = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  max-width: 320px;
  margin: 0 auto;
`;

const AuthTabs = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 6px;
  margin-bottom: 36px;
  position: relative;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 14px 24px;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;

  &:hover:not(.active) {
    color: rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.03);
  }
`;

const TabIndicator = styled.div`
  position: absolute;
  top: 6px;
  left: 6px;
  width: calc(50% - 6px);
  height: calc(100% - 12px);
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(59, 130, 246, 0.15));
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.1);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
  transform: translateX(${props => props.isLogin ? '0' : '100%'});
`;

const AuthForm = styled.form`
  margin-bottom: 36px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
`;

const FormInput = styled.input`
  width: 100%;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(34, 197, 94, 0.5);
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    background: rgba(255, 255, 255, 0.05);
  }

  ${props => props.error && `
    border-color: rgba(239, 68, 68, 0.5);
    background: rgba(239, 68, 68, 0.03);
  `}
`;

const PasswordInputContainer = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #ef4444;
  animation: errorShake 0.3s ease;
`;

const FormOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ForgotPasswordButton = styled.button`
  font-size: 13px;
  color: #3b82f6;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #60a5fa;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AuthButton = styled.button`
  width: 100%;
  padding: 16px;
  background: ${props => props.disabled 
    ? 'rgba(34, 197, 94, 0.5)' 
    : 'linear-gradient(135deg, #22c55e, #16a34a)'};
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #16a34a, #15803d);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(34, 197, 94, 0.3);
  }
`;

const LoadingSpinner = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
`;

const AuthDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 32px 0;
  color: rgba(255, 255, 255, 0.3);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  }

  span {
    padding: 0 20px;
  }
`;

const SocialAuthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 36px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
  }
`;

const SocialIcon = styled.svg`
  width: 20px;
  height: 20px;
`;

const AuthFooter = styled.div`
  text-align: center;
  margin: 24px 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
`;

const AuthLink = styled.button`
  color: #22c55e;
  background: none;
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: 600;
  margin-left: 4px;
  transition: color 0.2s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};

  &:hover:not(:disabled) {
    color: #16a34a;
  }
`;

const Terms = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  line-height: 1.6;
`;

const TermsLink = styled.a`
  color: #3b82f6;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 40px;
  max-width: 460px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  text-align: center;
  padding: 20px 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01));
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(34, 197, 94, 0.2);
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const StatNumber = styled.div`
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #22c55e, #3b82f6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
`;

// Modal Components
const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: linear-gradient(145deg, rgba(30, 30, 30, 0.98), rgba(20, 20, 20, 0.98));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 24px 32px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: white;
  margin: 0;
`;

const ModalClose = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  transition: color 0.2s ease;

  &:hover {
    color: white;
  }
`;

const ModalBody = styled.div`
  padding: 32px;
`;

const ModalText = styled.p`
  margin-bottom: 24px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 16px;
  padding: 0 32px 32px;
`;

const ModalButton = styled.button`
  flex: 1;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};

  ${props => props.primary && `
    background: ${props.disabled ? 'rgba(34, 197, 94, 0.5)' : 'linear-gradient(135deg, #22c55e, #16a34a)'};
    border: none;
    color: white;

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #16a34a, #15803d);
    }
  `}

  ${props => props.secondary && `
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
    }
  `}
`;

// Main Component
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    displayName: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Registration validation
    if (!isLogin) {
      if (!formData.username) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }
      
      if (!formData.displayName) {
        newErrors.displayName = 'Display name is required';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      let result;
      
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          displayName: formData.displayName
        });
      }
      
      if (result.success) {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      email: '',
      password: '',
      username: '',
      displayName: '',
      confirmPassword: ''
    });
  };
  
  const handleResetPassword = async () => {
    if (!resetEmail) {
      setErrors({ resetEmail: 'Please enter your email' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Implement password reset logic here
      console.log('Reset password for:', resetEmail);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Password reset link sent to your email');
      setShowResetModal(false);
      setResetEmail('');
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({ resetEmail: 'Failed to send reset email' });
    } finally {
      setIsLoading(false);
    }
  };

  // Social login handlers
  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // Implement Google OAuth
  };

  const handleGithubLogin = () => {
    console.log('GitHub login clicked');
    // Implement GitHub OAuth
  };

  // Statistics data
  const stats = [
    { number: '312', label: 'Day Record' },
    { number: '94.7%', label: 'Retention' },
    { number: '$10M+', label: 'Projected ARR' }
  ];

  return (
    <>
      <AuthGlobalStyle />
      <AuthPage>
        <BackgroundGrid />
        <BackgroundParticles />
        
        <AuthContainer>
          <AuthCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AuthHeader>
              <AuthLogo>
                <LogoIcon>🌱</LogoIcon>
                <LogoText>touchgrass.now</LogoText>
              </AuthLogo>
              <AuthTagline>
                {isLogin 
                  ? 'Welcome back. Continue your journey to discipline.' 
                  : 'Join the world\'s most addictive accountability platform.'}
              </AuthTagline>
            </AuthHeader>
            
            <AuthTabs>
              <TabButton
                active={isLogin}
                onClick={() => setIsLogin(true)}
                disabled={isLoading}
              >
                Sign In
              </TabButton>
              <TabButton
                active={!isLogin}
                onClick={() => setIsLogin(false)}
                disabled={isLoading}
              >
                Sign Up
              </TabButton>
              <TabIndicator isLogin={isLogin} />
            </AuthTabs>
            
            <AuthForm onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <FormGroup>
                    <FormLabel htmlFor="displayName">Display Name</FormLabel>
                    <FormInput
                      type="text"
                      id="displayName"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      placeholder="How should we call you?"
                      error={errors.displayName}
                      disabled={isLoading}
                    />
                    {errors.displayName && (
                      <ErrorMessage>{errors.displayName}</ErrorMessage>
                    )}
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <FormInput
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Choose a username"
                      error={errors.username}
                      disabled={isLoading}
                    />
                    {errors.username && (
                      <ErrorMessage>{errors.username}</ErrorMessage>
                    )}
                  </FormGroup>
                </>
              )}
              
              <FormGroup>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  error={errors.email}
                  disabled={isLoading}
                />
                {errors.email && (
                  <ErrorMessage>{errors.email}</ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="password">Password</FormLabel>
                <PasswordInputContainer>
                  <FormInput
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    error={errors.password}
                    disabled={isLoading}
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </PasswordToggle>
                </PasswordInputContainer>
                {errors.password && (
                  <ErrorMessage>{errors.password}</ErrorMessage>
                )}
              </FormGroup>
              
              {!isLogin && (
                <FormGroup>
                  <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                  <PasswordInputContainer>
                    <FormInput
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      error={errors.confirmPassword}
                      disabled={isLoading}
                    />
                    <PasswordToggle
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </PasswordToggle>
                  </PasswordInputContainer>
                  {errors.confirmPassword && (
                    <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
                  )}
                </FormGroup>
              )}
              
              {isLogin && (
                <FormOptions>
                  <ForgotPasswordButton
                    type="button"
                    onClick={() => setShowResetModal(true)}
                    disabled={isLoading}
                  >
                    Forgot password?
                  </ForgotPasswordButton>
                </FormOptions>
              )}
              
              <AuthButton
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner />
                ) : isLogin ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </AuthButton>
            </AuthForm>
            
            <AuthDivider>
              <span>or continue with</span>
            </AuthDivider>
            
            <SocialAuthGrid>
              <SocialButton
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="google"
              >
                <SocialIcon viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </SocialIcon>
                Google
              </SocialButton>
              
              <SocialButton
                type="button"
                onClick={handleGithubLogin}
                disabled={isLoading}
                className="github"
              >
                <SocialIcon viewBox="0 0 24 24">
                  <path 
                    fill="currentColor" 
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  />
                </SocialIcon>
                GitHub
              </SocialButton>
            </SocialAuthGrid>
            
            <AuthFooter>
              <p>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <AuthLink
                  type="button"
                  onClick={toggleMode}
                  disabled={isLoading}
                >
                  {isLogin ? ' Sign up' : ' Sign in'}
                </AuthLink>
              </p>
            </AuthFooter>
            
            <Terms>
              <p>
                By continuing, you agree to our{' '}
                <TermsLink href="/terms">Terms of Service</TermsLink> and{' '}
                <TermsLink href="/privacy">Privacy Policy</TermsLink>
              </p>
            </Terms>
          </AuthCard>
          
          <StatsGrid>
            {stats.map((stat, index) => (
              <StatCard key={index}>
                <StatNumber>{stat.number}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsGrid>
        </AuthContainer>
        
        {/* Reset Password Modal */}
        <AnimatePresence>
          {showResetModal && (
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetModal(false)}
            >
              <ModalContent
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ModalHeader>
                  <ModalTitle>Reset Password</ModalTitle>
                  <ModalClose onClick={() => setShowResetModal(false)}>
                    ×
                  </ModalClose>
                </ModalHeader>
                
                <ModalBody>
                  <ModalText>
                    Enter your email address and we'll send you a link to reset your password.
                  </ModalText>
                  
                  <FormGroup>
                    <FormLabel htmlFor="resetEmail">Email Address</FormLabel>
                    <FormInput
                      type="email"
                      id="resetEmail"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="you@example.com"
                      error={errors.resetEmail}
                    />
                    {errors.resetEmail && (
                      <ErrorMessage>{errors.resetEmail}</ErrorMessage>
                    )}
                  </FormGroup>
                </ModalBody>
                
                <ModalActions>
                  <ModalButton
                    secondary
                    onClick={() => setShowResetModal(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </ModalButton>
                  <ModalButton
                    primary
                    onClick={handleResetPassword}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </ModalButton>
                </ModalActions>
              </ModalContent>
            </ModalOverlay>
          )}
        </AnimatePresence>
      </AuthPage>
    </>
  );
};

export default Auth;