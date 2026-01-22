const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const axios = require('axios');

// Import middleware
const { authenticateToken } = require('../middleware/auth');

// ========== GOOGLE OAUTH ROUTES ==========

// Method 1: Real Google OAuth flow (for production)
router.get('/google', (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID || 'your-client-id'}` +
    `&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback')}` +
    `&response_type=code` +
    `&scope=profile email` +
    `&access_type=offline` +
    `&prompt=consent`;
  
  console.log('Redirecting to Google OAuth...');
  res.redirect(googleAuthUrl);
});

// Google OAuth callback
router.get('/google/callback', async (req, res) => {
  try {
    const { code, error: oauthError } = req.query;
    
    if (oauthError) {
      console.error('Google OAuth error:', oauthError);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth?error=oauth_failed`);
    }
    
    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth?error=no_code`);
    }

    console.log('Received Google OAuth code:', code.substring(0, 10) + '...');

    // Exchange authorization code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback',
      grant_type: 'authorization_code'
    });

    console.log('Google token exchange successful');

    // Get user info from Google
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`
      }
    });

    const { email, name, picture } = userInfoResponse.data;
    
    if (!email) {
      console.error('No email received from Google');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth?error=no_email`);
    }

    console.log('Google user info received:', { email, name });

    // Get User model
    const User = mongoose.model('User');
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user from Google data
      const username = email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 5);
      
      user = new User({
        email,
        username,
        displayName: name || email.split('@')[0],
        avatar: picture || '',
        password: crypto.randomBytes(16).toString('hex'),
        stats: {
          currentStreak: 0,
          longestStreak: 0,
          totalDays: 0,
          totalOutdoorTime: 0,
          consistencyScore: 0,
          leaderboardRank: 999999,
          followersCount: 0,
          followingCount: 0
        }
      });
      
      await user.save();
      console.log('New Google user created:', username);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username,
        email: user.email 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    console.log('JWT token generated for user:', user.email);

    // Create user response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Encode data for URL
    const encodedToken = encodeURIComponent(token);
    const encodedUser = encodeURIComponent(JSON.stringify(userResponse));

    // Redirect to frontend with token
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?` +
      `token=${encodedToken}` +
      `&user=${encodedUser}`;
    
    console.log('Redirecting to frontend with auth data');
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('Google OAuth error:', error.response?.data || error.message);
    console.error('Full error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth?error=oauth_failed&message=${encodeURIComponent(error.message)}`);
  }
});

// Method 2: Direct Google auth for development/testing
router.post('/google', async (req, res) => {
  try {
    const { email, name, picture, supabaseId, provider } = req.body;
    
    console.log('OAuth user from Supabase:', { email, name, supabaseId });
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    const User = mongoose.model('User');
    
    // Check if user already exists by email or supabaseId
    let user = await User.findOne({ 
      $or: [
        { email },
        { supabaseId }
      ] 
    });
    
    if (!user) {
      // Create new user from OAuth data
      const username = email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 5);
      
      user = new User({
        email,
        username,
        displayName: name || email.split('@')[0],
        avatar: picture || '',
        supabaseId: supabaseId || null,
        oauthProvider: provider || 'google',
        password: crypto.randomBytes(16).toString('hex'), // Random password for OAuth users
        stats: {
          currentStreak: 0,
          longestStreak: 0,
          totalDays: 0,
          totalOutdoorTime: 0,
          consistencyScore: 0,
          leaderboardRank: 999999,
          followersCount: 0,
          followingCount: 0
        }
      });
      
      await user.save();
      console.log('New OAuth user created in MongoDB:', username);
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username,
        email: user.email 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    // Prepare user response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({
      success: true,
      message: 'Google login successful',
      token,
      user: userResponse
    });
    
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ========== GITHUB OAUTH (MOCK) ==========

router.get('/github', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'GitHub authentication not implemented yet',
    note: 'Use Google authentication or email/password login'
  });
});

// ========== EMAIL/PASSWORD AUTH ==========

// User registration - FIXED VERSION
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, displayName, fullName } = req.body;
    
    // Accept displayName OR fullName for displayName field
    const finalDisplayName = displayName || fullName || email.split('@')[0];
    
    if (!username || !email || !password || !finalDisplayName) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, password, and display name are required'
      });
    }
    
    const User = mongoose.model('User');
    
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }
    
    const user = new User({
      username,
      email,
      password,
      displayName: finalDisplayName,
      stats: {
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        totalOutdoorTime: 0,
        consistencyScore: 0,
        leaderboardRank: 999999,
        followersCount: 0,
        followingCount: 0
      },
      preferences: {
        notifications: {
          streakReminder: true,
          leaderboardUpdates: true,
          achievementAlerts: true
        },
        publicProfile: true,
        showOnLeaderboard: true
      },
      subscription: {
        active: false,
        plan: 'free',
        streakFreezeTokens: 0
      }
    });
    
    await user.save();
    
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username,
        email: user.email 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: userResponse
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// User login - FIXED VERSION (select password field)
// User login - CORRECTED VERSION
router.post('/login', async (req, res) => {
  try {
    console.log('🔑 Login attempt received from frontend');
    console.log('📦 Request body:', req.body);
    
    const { email, password } = req.body;
    
    // Debug: Log what we received
    console.log('📧 Email received:', email);
    console.log('🔐 Password received:', password ? '******' : 'undefined');
    
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    const User = mongoose.model('User');
    
    // IMPORTANT: Trim email and select password
    const cleanEmail = email.toString().trim().toLowerCase();
    console.log('🔍 Searching for user with email:', cleanEmail);
    
    // Find user with password selected
    const user = await User.findOne({ email: cleanEmail }).select('+password');
    
    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    console.log('✅ User found:', user.email);
    console.log('🔑 Hashed password exists:', !!user.password);
    
    // Compare password using the model method
    const isPasswordValid = await user.comparePassword(password);
    console.log('🔐 Password comparison result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Password does not match');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    console.log('✅ Authentication successful for:', user.email);
    
    // Update last active
    user.lastActive = new Date();
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username,
        email: user.email 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    console.log('✅ Token generated for user:', user.email);
    
    // Prepare response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userResponse
      }
    });
    
  } catch (error) {
    console.error('❌ Login error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ========== PASSWORD RESET ==========

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    const User = mongoose.model('User');
    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal if user exists for security
      return res.json({
        success: true,
        message: 'If an account exists with this email, you will receive password reset instructions'
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Save token to user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    
    // In production, send email here
    // For development, return the token
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    console.log('Password reset URL (dev):', resetUrl);
    
    res.json({
      success: true,
      message: 'Password reset instructions sent',
      data: {
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
        resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
      }
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request'
    });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }
    
    // Hash the token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    const User = mongoose.model('User');
    
    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    }).select('+password');
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
    
    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
});

// ========== PROFILE MANAGEMENT ==========

// Get current user (protected)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const User = mongoose.model('User');
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('followers', 'username displayName avatar')
      .populate('following', 'username displayName avatar');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: { user }
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Update profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { displayName, bio, avatar } = req.body;
    
    const User = mongoose.model('User');
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        displayName: displayName || req.user.displayName,
        bio: bio !== undefined ? bio : req.user.bio,
        avatar: avatar || req.user.avatar
      },
      { new: true }
    ).select('-password');
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Change password (authenticated)
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }
    
    const User = mongoose.model('User');
    
    // Get user with password field
    const user = await User.findById(req.user._id).select('+password');
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

// ========== HEALTH CHECK ==========

router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Auth Service',
    status: 'operational',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /auth/register',
      'POST /auth/login',
      'GET/POST /auth/google',
      'GET /auth/google/callback',
      'POST /auth/forgot-password',
      'POST /auth/reset-password',
      'GET /auth/me',
      'PUT /auth/profile',
      'POST /auth/change-password'
    ]
  });
});

module.exports = router;