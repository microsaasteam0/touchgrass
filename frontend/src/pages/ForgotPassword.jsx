import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setMessage(result.message || 'Password reset link sent to your email!');
        
        // In development, show the reset link
        if (process.env.NODE_ENV === 'development' && result.resetUrl) {
          console.log('Development Reset Token:', result.resetToken);
          console.log('Reset URL:', result.resetUrl);
          
          // Optionally auto-navigate to reset page in development
          // setTimeout(() => {
          //   navigate(result.resetUrl);
          // }, 2000);
        } else {
          // In production, just show message
          setTimeout(() => navigate('/auth'), 3000);
        }
      } else {
        setError(result.error || 'Failed to send reset link');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        style={{
          background: 'rgba(30, 30, 30, 0.95)',
          borderRadius: '24px',
          padding: '48px',
          width: '100%',
          maxWidth: '440px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <h2 style={{
          // color: 'white',
          marginBottom: '8px',
          fontSize: '24px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent'
        }}>
          Reset Password
        </h2>
        <p style={{
          color: 'rgba(255, 255, 255, 0.6)',
          marginBottom: '32px',
          fontSize: '15px',
          lineHeight: '1.6'
        }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="email" style={{
              display: 'block',
              color: 'white',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px'
              }}
            />
          </div>
          
          {error && (
            <div style={{
              color: '#ef4444',
              marginBottom: '16px',
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          
          {message && (
            <div style={{
              color: '#22c55e',
              marginBottom: '16px',
              padding: '12px',
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              {message}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading 
                ? 'rgba(34, 197, 94, 0.5)' 
                : 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '24px'
            }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center' }}>
          <Link
            to="/auth"
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ← Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;