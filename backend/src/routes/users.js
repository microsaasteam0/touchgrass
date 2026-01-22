const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');

// Import route handlers
const authRoutes = require('./auth');
const userRoutes = require('./users');
const streakRoutes = require('./streaks');
const leaderboardRoutes = require('./leaderboard');
const paymentRoutes = require('./payments');
const socialShareRoutes = require('./socialShare');
const chatRoutes = require('./chat');
const uploadRoutes = require('./upload');

// Import middleware
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Health check endpoint with database status
router.get('/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const dbStatusText = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }[dbStatus] || 'unknown';

    res.json({
      success: true,
      status: 'healthy',
      service: 'TouchGrass API',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatusText,
        connection: dbStatus === 1 ? '✅ Connected' : '❌ Disconnected',
        name: mongoose.connection.db?.databaseName || 'touchgrass',
        host: mongoose.connection.host || 'unknown'
      },
      authentication: {
        supabase: process.env.SUPABASE_URL ? '✅ Configured' : '❌ Not configured',
        jwt: process.env.JWT_SECRET ? '✅ Configured' : '❌ Not configured'
      },
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API status endpoint
router.get('/status', (req, res) => {
  res.json({
    success: true,
    api: 'TouchGrass API',
    version: '2.0.0',
    status: 'operational',
    maintenance: false,
    authentication: {
      methods: ['email/password', 'google', 'github'],
      provider: 'Supabase + Custom JWT',
      note: 'Hybrid authentication system'
    },
    database: {
      primary: 'MongoDB Atlas',
      auth: 'Supabase',
      sync: 'Automatic user sync'
    },
    endpoints: {
      auth: [
        { method: 'POST', path: '/api/auth/register', description: 'Register new user' },
        { method: 'POST', path: '/api/auth/login', description: 'Login user' },
        { method: 'POST', path: '/api/auth/google', description: 'Google OAuth sync' },
        { method: 'GET', path: '/api/auth/me', description: 'Get current user (protected)' },
        { method: 'POST', path: '/api/auth/forgot-password', description: 'Request password reset' },
        { method: 'POST', path: '/api/auth/reset-password', description: 'Reset password' }
      ],
      users: [
        { method: 'GET', path: '/api/users/:username', description: 'Get user profile' },
        { method: 'PUT', path: '/api/users/profile', description: 'Update profile (protected)' },
        { method: 'POST', path: '/api/users/:userId/follow', description: 'Follow user (protected)' }
      ],
      streaks: [
        { method: 'GET', path: '/api/streaks/current', description: 'Get current streak (protected)' },
        { method: 'POST', path: '/api/streaks/verify', description: 'Verify streak (protected)' },
        { method: 'POST', path: '/api/streaks/shame', description: 'Report missed day (protected)' }
      ],
      leaderboard: [
        { method: 'GET', path: '/api/leaderboard', description: 'Get global leaderboard' },
        { method: 'GET', path: '/api/leaderboard/user-rank/:userId', description: 'Get user rank' },
        { method: 'GET', path: '/api/leaderboard/city/:city', description: 'Get city leaderboard' }
      ],
      system: [
        { method: 'GET', path: '/api/health', description: 'Health check' },
        { method: 'GET', path: '/api/status', description: 'API status' }
      ]
    },
    rateLimiting: {
      windowMs: 15 * 60 * 1000,
      maxRequests: 100,
      authWindowMs: 60 * 60 * 1000,
      authMaxRequests: 10
    },
    documentation: process.env.API_DOCS_URL || 'https://docs.touchgrass.now/api',
    support: {
      email: 'support@touchgrass.now',
      discord: 'https://discord.gg/touchgrass',
      github: 'https://github.com/touchgrass'
    }
  });
});

// API documentation redirect
router.get('/docs', (req, res) => {
  res.redirect(process.env.API_DOCS_URL || 'https://docs.touchgrass.now/api');
});

// API changelog
router.get('/changelog', (req, res) => {
  res.json({
    success: true,
    changelog: [
      {
        version: 'v2.0.0',
        date: new Date().toISOString().split('T')[0],
        changes: [
          'Added Supabase hybrid authentication',
          'Google & GitHub OAuth support',
          'Enhanced user profile sync',
          'Improved error handling',
          'Real-time user status tracking'
        ]
      },
      {
        version: 'v1.2.0',
        date: '2024-01-15',
        changes: [
          'Added social sharing endpoints',
          'Enhanced chat functionality',
          'Added challenge system'
        ]
      },
      {
        version: 'v1.1.0',
        date: '2024-01-01',
        changes: [
          'Added leaderboard endpoints',
          'Improved streak verification',
          'Added payment processing'
        ]
      },
      {
        version: 'v1.0.0',
        date: '2023-12-01',
        changes: [
          'Initial API release',
          'Basic streak tracking',
          'User authentication'
        ]
      }
    ]
  });
});

// Mount routes with version prefix
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/streaks', streakRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/payments', paymentRoutes);
router.use('/share', socialShareRoutes);
router.use('/chat', chatRoutes);
router.use('/upload', uploadRoutes);

// ========== USER PROFILE ENDPOINTS ==========

// Get user by username (public)
router.get('/users/:username', optionalAuth, async (req, res) => {
  try {
    const { username } = req.params;
    const User = mongoose.model('User');
    
    const user = await User.findOne({ username })
      .select('-password -email -supabaseId')
      .populate('followers', 'username displayName avatar')
      .populate('following', 'username displayName avatar');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get user's streak
    const Streak = mongoose.model('Streak');
    const streak = await Streak.findOne({ userId: user._id });
    
    // Check if current user is following this user
    let isFollowing = false;
    if (req.user) {
      const currentUser = await User.findById(req.user._id);
      isFollowing = currentUser.following.includes(user._id);
    }
    
    res.json({
      success: true,
      user: {
        ...user.toObject(),
        streakData: streak || null,
        isFollowing,
        isCurrentUser: req.user && req.user._id.toString() === user._id.toString()
      }
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Search users
router.get('/users/search/:query', optionalAuth, async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 10 } = req.query;
    
    const User = mongoose.model('User');
    
    const users = await User.find({
      $or: [
        { username: new RegExp(query, 'i') },
        { displayName: new RegExp(query, 'i') }
      ]
    })
    .select('username displayName avatar stats.currentStreak')
    .limit(parseInt(limit))
    .sort({ 'stats.currentStreak': -1 });
    
    res.json({
      success: true,
      query,
      results: users,
      count: users.length
    });
    
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ========== SYSTEM ENDPOINTS ==========

// System info
router.get('/system/info', (req, res) => {
  res.json({
    success: true,
    system: {
      name: 'TouchGrass',
      version: '2.0.0',
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch,
      uptime: process.uptime(),
      memory: {
        rss: process.memoryUsage().rss,
        heapTotal: process.memoryUsage().heapTotal,
        heapUsed: process.memoryUsage().heapUsed,
        external: process.memoryUsage().external
      },
      cpu: {
        usage: process.cpuUsage()
      }
    },
    services: {
      mongodb: mongoose.connection.readyState === 1 ? '✅ Online' : '❌ Offline',
      supabase: process.env.SUPABASE_URL ? '✅ Configured' : '❌ Not configured',
      redis: '⚠️ Not configured',
      email: '⚠️ Not configured'
    }
  });
});

// Ping endpoint (for monitoring)
router.get('/ping', (req, res) => {
  res.json({
    success: true,
    pong: Date.now(),
    timestamp: new Date().toISOString(),
    requestId: req.id || 'unknown'
  });
});

// Test database connection
router.get('/test/db', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const stats = await db.stats();
    
    // Get collection counts
    const collections = await db.listCollections().toArray();
    const collectionStats = [];
    
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      collectionStats.push({
        name: collection.name,
        count: count
      });
    }
    
    res.json({
      success: true,
      database: {
        name: stats.db,
        collections: stats.collections,
        objects: stats.objects,
        avgObjSize: stats.avgObjSize,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
        indexes: stats.indexes,
        indexSize: stats.indexSize,
        fileSize: stats.fileSize
      },
      collections: collectionStats,
      connection: {
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name,
        readyState: mongoose.connection.readyState,
        state: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
      }
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      connection: {
        readyState: mongoose.connection.readyState,
        state: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
      }
    });
  }
});

// ========== ERROR HANDLING ==========

// Error handling for undefined routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    requestId: req.id || 'unknown',
    suggestions: [
      '/api/health - Health check',
      '/api/status - API status',
      '/api/auth/register - Register user',
      '/api/auth/login - Login user',
      '/api/users/:username - Get user profile',
      '/api/leaderboard - Global leaderboard'
    ]
  });
});

// Global error handler
router.use((err, req, res, next) => {
  console.error('🔥 API Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    requestId: req.id,
    userId: req.user?._id || 'anonymous',
    timestamp: new Date().toISOString()
  });

  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';
  
  const errorResponse = {
    success: false,
    error: {
      code: err.code || 'SERVER_ERROR',
      message: isProduction ? 'Internal server error' : err.message,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      requestId: req.id || 'unknown'
    }
  };

  // Add stack trace in development
  if (!isProduction && err.stack) {
    errorResponse.error.stack = err.stack;
  }

  // Add validation errors if present
  if (err.errors) {
    errorResponse.error.details = err.errors;
  }

  res.status(statusCode).json(errorResponse);
});

module.exports = router;