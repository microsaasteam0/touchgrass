const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

/**
 * Authentication Middleware
 * Simplified version for TouchGrass backend
 */

const authenticateToken = async (req, res, next) => {
  try {
    // Get token from various sources
    let token;
    
    // 1. From Authorization header (Bearer token)
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    
    // 2. From query parameter (for OAuth redirects)
    if (!token && req.query.token) {
      token = req.query.token;
    }
    
    // 3. From cookie (if using cookies)
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }
    
    // For development: Accept any valid JWT (Supabase or your own)
    let decoded;
    let isSupabaseToken = false;

    try {
      decoded = jwt.decode(token);

      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }

      // Check if this is a Supabase token by looking at issuer
      isSupabaseToken = decoded.iss === 'https://api.supabase.co/auth/v1' ||
                       decoded.iss?.includes('supabase') ||
                       decoded.aud === 'authenticated';

      console.log('✅ Token decoded successfully:', {
        email: decoded.email,
        sub: decoded.sub,
        userId: decoded.userId,
        iss: decoded.iss,
        aud: decoded.aud,
        isSupabaseToken
      });

    } catch (error) {
      console.error('❌ Token decode error:', error);
      return res.status(401).json({
        success: false,
        message: 'Token verification failed'
      });
    }

    // Check if token has expired (for both types)
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    // Get user from database
    const User = mongoose.model('User');
    let user;

    if (isSupabaseToken) {
      // For Supabase tokens, find user by email or supabaseId
      const email = decoded.email;
      const supabaseId = decoded.sub;

      user = await User.findOne({
        $or: [
          { email },
          { supabaseId }
        ]
      });

      // If user doesn't exist, create one from Supabase data
      if (!user) {
        console.log('👤 Creating user from Supabase token');
        user = new User({
          email,
          supabaseId,
          username: email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 5),
          displayName: decoded.user_metadata?.full_name || decoded.user_metadata?.name || email.split('@')[0],
          avatar: decoded.user_metadata?.avatar_url || decoded.user_metadata?.picture || '',
          oauthProvider: 'supabase',
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
        console.log('✅ User created from Supabase token');
      }
    } else {
      // For backend JWT tokens, find by userId
      user = await User.findById(decoded.userId);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is disabled/deleted
    if (user.deletedAt) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deleted'
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id;
    req.token = token;

    console.log('✅ Authentication successful for user:', user.email);
    
    next();
    
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Optional authentication
 * If token is provided, verify it, otherwise proceed without user
 */
const optionalAuth = async (req, res, next) => {
  try {
    // Get token from various sources
    let token;
    
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    
    if (!token && req.query.token) {
      token = req.query.token;
    }
    
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      req.user = null;
      req.userId = null;
      return next();
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user from database
    const User = mongoose.model('User');
    const user = await User.findById(decoded.userId)
      .select('-password')
      .populate('followers', 'username displayName avatar')
      .populate('following', 'username displayName avatar');
    
    if (user && !user.deletedAt) {
      req.user = user;
      req.userId = user._id;
      req.token = token;
    } else {
      req.user = null;
      req.userId = null;
    }
    
    next();
    
  } catch (error) {
    // If token is invalid, just proceed without auth
    req.user = null;
    req.userId = null;
    next();
  }
};

/**
 * Check if user is admin
 */
const requireAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  
  next();
};

/**
 * Check if user has active subscription
 */
const requireSubscription = (plan = 'premium') => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const planHierarchy = {
      'free': 0,
      'premium': 1,
      'elite': 2
    };
    
    const userPlan = req.user.subscription?.plan || 'free';
    const userPlanLevel = planHierarchy[userPlan] || 0;
    const requiredPlanLevel = planHierarchy[plan] || 0;
    
    // Check if subscription is active
    const isActive = req.user.subscription?.active;
    const isExpired = req.user.subscription?.currentPeriodEnd && 
      new Date(req.user.subscription.currentPeriodEnd) < new Date();
    
    if (userPlanLevel < requiredPlanLevel || !isActive || isExpired) {
      return res.status(403).json({
        success: false,
        message: `${plan.charAt(0).toUpperCase() + plan.slice(1)} subscription required`,
        requiredPlan: plan,
        userPlan: userPlan,
        isActive: isActive,
        isExpired: isExpired,
        upgradeUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/subscription`
      });
    }
    
    next();
  };
};

/**
 * Check resource ownership
 */
const requireOwnership = (modelName, idField = 'userId') => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const resourceId = req.params.id || req.params.userId;
    
    if (!resourceId) {
      return res.status(400).json({
        success: false,
        message: 'Resource ID required'
      });
    }
    
    try {
      const Model = mongoose.model(modelName);
      const resource = await Model.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }
      
      // Check ownership
      const ownerId = resource[idField] || resource.userId;
      
      if (ownerId.toString() !== req.userId.toString() && !req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to access this resource'
        });
      }
      
      // Attach resource to request
      req.resource = resource;
      next();
      
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
};

/**
 * Rate limiting middleware (simple in-memory version)
 */
const rateLimitStore = new Map();

const rateLimit = (windowMs = 60000, max = 100) => {
  return async (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const key = `rate_limit:${ip}:${req.path}`;
    
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old entries
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.timestamp < windowStart) {
        rateLimitStore.delete(key);
      }
    }
    
    // Get current count
    const entry = rateLimitStore.get(key) || { count: 0, timestamp: now };
    
    if (entry.timestamp < windowStart) {
      // Reset if window has passed
      entry.count = 1;
      entry.timestamp = now;
    } else if (entry.count >= max) {
      // Rate limit exceeded
      const resetTime = Math.ceil((entry.timestamp + windowMs - now) / 1000);
      
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
        retryAfter: resetTime,
        limit: max,
        remaining: 0
      });
    } else {
      // Increment count
      entry.count++;
    }
    
    rateLimitStore.set(key, entry);
    
    // Add headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - entry.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil((entry.timestamp + windowMs) / 1000));
    
    next();
  };
};

/**
 * Auth-specific rate limiting
 */
const authRateLimit = rateLimit(900000, 10); // 15 minutes, 10 attempts

/**
 * Validate request body for authentication
 */
const validateAuthRequest = (req, res, next) => {
  const { path } = req;
  
  if (path.includes('/register')) {
    const { username, email, password, fullName } = req.body;
    
    if (!username || !email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({
        success: false,
        message: 'Username must be between 3 and 30 characters'
      });
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }
    
    if (fullName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Full name must be at least 2 characters'
      });
    }
  }
  
  if (path.includes('/login')) {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
  }
  
  next();
};

/**
 * Check if user is online (placeholder for WebSocket integration)
 */
const checkOnlineStatus = async (req, res, next) => {
  if (!req.user) {
    return next();
  }
  
  // In a real implementation, you would check WebSocket connections
  // For now, we'll just mark as online if authenticated
  req.user.isOnline = true;
  req.user.lastSeen = new Date();
  
  next();
};

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin || false,
      subscription: user.subscription?.plan || 'free'
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '30d' }
  );
};

/**
 * Generate refresh token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      type: 'refresh'
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '90d' }
  );
};

/**
 * Verify refresh token
 */
const verifyRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token required'
      });
    }
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'your-secret-key');
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
    
    // Get user
    const User = mongoose.model('User');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    req.user = user;
    req.userId = user._id;
    req.refreshToken = refreshToken;
    
    next();
    
  } catch (error) {
    console.error('Refresh token error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin,
  requireSubscription,
  requireOwnership,
  rateLimit,
  authRateLimit,
  validateAuthRequest,
  checkOnlineStatus,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken
};