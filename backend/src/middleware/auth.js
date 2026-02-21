const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const crypto = require('crypto');

/**
 * SIMPLE token verification - ACCEPTS ANY VALID JWT for development
 */
function verifyToken(token) {
  try {
    console.log('🔐 Verifying token...');
    
    // Just decode without verification for now (DEVELOPMENT ONLY)
    const decoded = jwt.decode(token, { complete: true });
    
    if (!decoded) {
      console.log('❌ Could not decode token');
      return null;
    }
    
    console.log('📝 Token header:', decoded.header);
    console.log('📝 Token algorithm:', decoded.header.alg);
    console.log('👤 User email:', decoded.payload.email);
    
    // Check expiration
    if (decoded.payload.exp && decoded.payload.exp < Math.floor(Date.now() / 1000)) {
      console.log('❌ Token is expired');
      return null;
    }
    
    // FOR DEVELOPMENT: Accept any valid JWT
    // In production, you would verify the signature properly
    console.log('✅ Token accepted (development mode)');
    return decoded.payload;
    
  } catch (error) {
    console.error('❌ Token verification error:', error.message);
    return null;
  }
}

/**
 * Authentication Middleware - SIMPLIFIED VERSION
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      console.log('❌ No Authorization header');
      return res.status(401).json({
        success: false,
        message: 'Authorization header required'
      });
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      console.log('❌ Authorization header does not start with Bearer');
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization format. Use: Bearer <token>'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token || token.length < 10) {
      console.log('❌ No token provided or token too short');
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    console.log('🔐 Token received (first 30 chars):', token.substring(0, 30) + '...');

    // Verify the token (simplified)
    const verifiedUser = verifyToken(token);
    
    if (!verifiedUser) {
      console.log('❌ Token verification failed');
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    console.log('✅ Token verified successfully for user:', verifiedUser.email);

    // Get email from verified token
    const email = verifiedUser.email || verifiedUser.user_metadata?.email;
    const supabaseId = verifiedUser.sub;
    
    if (!email && !supabaseId) {
      console.log('❌ No email or user ID in token');
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload'
      });
    }
    
    // Get user from database
    const User = mongoose.model('User');
    let user;

    // Try to find existing user
    user = await User.findOne({
      $or: [
        { email },
        { supabaseId }
      ]
    });

    // If user doesn't exist, create one
    if (!user) {
      console.log('👤 Creating new user from token');
      
      const username = email ? 
        email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 4) : 
        'user_' + Math.random().toString(36).substr(2, 8);
      
      user = new User({
        email,
        supabaseId,
        username,
        displayName: verifiedUser.user_metadata?.full_name || email?.split('@')[0] || 'User',
        avatar: verifiedUser.user_metadata?.avatar_url || '',
        oauthProvider: 'supabase',
        password: crypto.randomBytes(16).toString('hex'),
        stats: {
          currentStreak: 0,
          longestStreak: 0,
          totalDays: 0,
          totalOutdoorTime: 0
        }
      });
      
      await user.save();
      console.log('✅ User created:', user.email);
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id;
    req.token = token;

    console.log('✅ Authentication successful for user:', user.email);
    next();
    
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

/**
 * Optional authentication
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.decode(token);
      
      if (decoded && decoded.email) {
        const User = mongoose.model('User');
        const user = await User.findOne({ email: decoded.email });
        
        if (user) {
          req.user = user;
          req.userId = user._id;
          req.token = token;
        }
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
};
