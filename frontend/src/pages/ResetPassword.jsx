import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #111111 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Card = styled.div`
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  padding: 48px 40px;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  color: white;
  font-size: 16px;
  margin-bottom: 20px;
  
  &:focus {
    outline: none;
    border-color: #00E5FF;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  background: white;
  color: black;
  border: none;
  border-radius: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  
  &:hover {
    background: #f0f0f0;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useParams();

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      const { error: resetError } = await supabase.auth.updateUser({
        password: password
      });

      if (resetError) throw resetError;

      setSuccess(true);
      toast.success('Password reset successful!', { theme: 'dark' });
      
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
      
    } catch (error) {
      setError(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Reset Password</Title>
        
        {success ? (
          <div style={{ textAlign: 'center', color: '#22c55e' }}>
            <CheckCircle size={48} style={{ marginBottom: '20px' }} />
            <h3>Password Reset Successful!</h3>
            <p>Redirecting to login page...</p>
          </div>
        ) : (
          <form onSubmit={handleReset}>
            <div style={{ marginBottom: '20px' }}>
              <Input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            
            {error && (
              <div style={{ 
                color: '#ef4444', 
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
            
            <button
              type="button"
              onClick={() => navigate('/auth')}
              style={{
                width: '100%',
                background: 'transparent',
                color: '#00E5FF',
                border: 'none',
                marginTop: '15px',
                cursor: 'pointer'
              }}
            >
              Back to Login
            </button>
          </form>
        )}
      </Card>
    </Container>
  );
};

export default ResetPassword;