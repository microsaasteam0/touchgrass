const express = require('express');
const router = express.Router();
const path = require('path');

// Import route handlers
const authRoutes = require('./auth');
const userRoutes = require('./users');
const streakRoutes = require('./streaks');
const leaderboardRoutes = require('./leaderboard');
const paymentRoutes = require('./payments');
const socialShareRoutes = require('./socialShare');
const chatRoutes = require('./chat');
const uploadRoutes = require('./upload');
const challengeRoutes = require('./challenges');
const verificationWallRoutes = require('./verificationWall');

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API status endpoint
router.get('/status', (req, res) => {
  res.json({
    api: 'TouchGrass API',
    version: 'v1',
    status: 'operational',
    maintenance: false,
    endpoints: [
      { path: '/api/auth', methods: ['POST', 'GET'] },
      { path: '/api/users', methods: ['GET', 'PUT', 'DELETE'] },
      { path: '/api/streaks', methods: ['GET', 'POST', 'PUT'] },
      { path: '/api/leaderboard', methods: ['GET'] },
      { path: '/api/payments', methods: ['POST', 'GET'] },
      { path: '/api/share', methods: ['POST', 'GET'] },
      { path: '/api/chat', methods: ['GET', 'POST', 'PUT'] },
      { path: '/api/upload', methods: ['POST'] },
      { path: '/api/verification-wall', methods: ['GET', 'POST'] }
    ],
    rateLimiting: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100
    },
    documentation: process.env.API_DOCS_URL || 'https://docs.touchgrass.now/api'
  });
});

// API documentation redirect
router.get('/docs', (req, res) => {
  res.redirect(process.env.API_DOCS_URL || 'https://docs.touchgrass.now/api');
});

// API changelog
router.get('/changelog', (req, res) => {
  res.json({
    changelog: [
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
router.use('/challenges', challengeRoutes);
router.use('/verification-wall', verificationWallRoutes);

// Error handling for undefined routes
router.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    suggested: '/api/status for available endpoints'
  });
});

// Global error handler
router.use((err, req, res, next) => {
  console.error('API Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  const errorCode = err.errorCode || 'SERVER_ERROR';

  res.status(statusCode).json({
    error: {
      code: errorCode,
      message: message,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

module.exports = router;