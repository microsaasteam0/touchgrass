const jwt = require('jsonwebtoken');
const { redis } = require('../config/redis');
const { SECURITY, ERROR_CODES } = require('../config/constants');

/**
 * Authentication Middleware
 * Handles JWT verification, session validation, and role-based access control
 */

class AuthMiddleware {
  /**
   * Verify JWT token
   */
  verifyToken = (req, res, next) => {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'Access token required',
          code: ERROR_CODES.AUTH_MISSING_CREDENTIALS
        });
      }

      const token = authHeader.split(' ')[1];
      
      // Verify token
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
              error: 'Token expired',
              code: ERROR_CODES.AUTH_EXPIRED_TOKEN
            });
          }
          
          if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
              error: 'Invalid token',
              code: ERROR_CODES.AUTH_INVALID_TOKEN
            });
          }

          return res.status(401).json({
            error: 'Authentication failed',
            code: ERROR_CODES.AUTH_INVALID_TOKEN
          });
        }

        // Check if token is blacklisted
        const isBlacklisted = await redis.cache.exists(`token:blacklist:${token}`);
        if (isBlacklisted) {
          return res.status(401).json({
            error: 'Token revoked',
            code: ERROR_CODES.AUTH_INVALID_TOKEN
          });
        }

        // Verify token type
        if (decoded.type !== 'access') {
          return res.status(401).json({
            error: 'Invalid token type',
            code: ERROR_CODES.AUTH_INVALID_TOKEN
          });
        }

        // Check if user exists and is active
        const user = await this.getUserById(decoded.userId);
        if (!user) {
          return res.status(401).json({
            error: 'User not found',
            code: ERROR_CODES.AUTH_INVALID_TOKEN
          });
        }

        if (user.deletedAt) {
          return res.status(401).json({
            error: 'Account deleted',
            code: ERROR_CODES.AUTH_USER_DISABLED
          });
        }

        // Attach user info to request
        req.userId = decoded.userId;
        req.user = {
          id: decoded.userId,
          username: decoded.username,
          role: decoded.role,
          subscription: decoded.subscription
        };

        // Check session if session ID is provided
        if (req.headers['x-session-id']) {
          const sessionId = req.headers['x-session-id'];
          const session = await redis.session.get(sessionId);
          
          if (!session || session.userId !== decoded.userId) {
            return res.status(401).json({
              error: 'Invalid session',
              code: ERROR_CODES.AUTH_INVALID_TOKEN
            });
          }

          req.sessionId = sessionId;
          req.session = session;
        }

        next();
      });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(500).json({
        error: 'Authentication error',
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  };

  /**
   * Verify refresh token
   */
  verifyRefreshToken = (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          error: 'Refresh token required',
          code: ERROR_CODES.AUTH_MISSING_CREDENTIALS
        });
      }

      jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
              error: 'Refresh token expired',
              code: ERROR_CODES.AUTH_EXPIRED_TOKEN
            });
          }
          
          return res.status(401).json({
            error: 'Invalid refresh token',
            code: ERROR_CODES.AUTH_INVALID_TOKEN
          });
        }

        if (decoded.type !== 'refresh') {
          return res.status(401).json({
            error: 'Invalid token type',
            code: ERROR_CODES.AUTH_INVALID_TOKEN
          });
        }

        // Check if refresh token exists in Redis
        const refreshTokensPattern = `refresh_token:${decoded.userId}:*`;
        const refreshTokenKeys = await redis.cache.keys(refreshTokensPattern);
        
        let tokenFound = false;
        for (const key of refreshTokenKeys) {
          const storedToken = await redis.cache.get(key, false);
          if (storedToken === refreshToken) {
            tokenFound = true;
            break;
          }
        }

        if (!tokenFound) {
          return res.status(401).json({
            error: 'Refresh token not found',
            code: ERROR_CODES.AUTH_INVALID_TOKEN
          });
        }

        req.userId = decoded.userId;
        req.refreshToken = refreshToken;
        next();
      });
    } catch (error) {
      console.error('Refresh token verification error:', error);
      res.status(500).json({
        error: 'Authentication error',
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  };

  /**
   * Check if user is authenticated (optional)
   */
  optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token, proceed without authentication
      req.userId = null;
      req.user = null;
      return next();
    }

    // Use the main verifyToken middleware
    this.verifyToken(req, res, next);
  };

  /**
   * Role-based access control
   */
  requireRole = (...roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          code: ERROR_CODES.AUTH_MISSING_CREDENTIALS
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          code: ERROR_CODES.RESOURCE_ACCESS_DENIED,
          requiredRoles: roles,
          userRole: req.user.role
        });
      }

      next();
    };
  };

  /**
   * Check subscription tier
   */
  requireSubscription = (minTier = 'free') => {
    return async (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          code: ERROR_CODES.AUTH_MISSING_CREDENTIALS
        });
      }

      const tierHierarchy = {
        'free': 0,
        'premium': 1,
        'elite': 2,
        'moderator': 3,
        'admin': 4
      };

      const userTier = req.user.subscription?.plan || 'free';
      const userTierLevel = tierHierarchy[userTier] || 0;
      const requiredTierLevel = tierHierarchy[minTier] || 0;

      if (userTierLevel < requiredTierLevel) {
        return res.status(403).json({
          error: 'Subscription required',
          code: ERROR_CODES.PAYMENT_REQUIRED,
          requiredTier: minTier,
          userTier: userTier,
          upgradeUrl: `${process.env.FRONTEND_URL}/subscription`
        });
      }

      next();
    };
  };

  /**
   * Check if user owns the resource
   */
  requireOwnership = (resourceType, idParam = 'id') => {
    return async (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required',
          code: ERROR_CODES.AUTH_MISSING_CREDENTIALS
        });
      }

      const resourceId = req.params[idParam];
      let isOwner = false;

      try {
        switch (resourceType) {
          case 'user':
            isOwner = req.userId === resourceId;
            break;

          case 'streak':
            const Streak = require('../models/Streak');
            const streak = await Streak.findById(resourceId);
            isOwner = streak && streak.userId.toString() === req.userId;
            break;

          case 'chat':
            const Chat = require('../models/Chat');
            const chat = await Chat.findById(resourceId);
            isOwner = chat && chat.participants.includes(req.userId);
            break;

          case 'message':
            const Message = require('../models/Message');
            const message = await Message.findById(resourceId);
            isOwner = message && message.sender.toString() === req.userId;
            break;

          case 'payment':
            const Payment = require('../models/Payment');
            const payment = await Payment.findById(resourceId);
            isOwner = payment && payment.userId.toString() === req.userId;
            break;

          default:
            return res.status(500).json({
              error: 'Invalid resource type',
              code: ERROR_CODES.SERVER_ERROR
            });
        }

        if (!isOwner && !req.user.role === 'admin') {
          return res.status(403).json({
            error: 'Access denied - resource ownership required',
            code: ERROR_CODES.RESOURCE_ACCESS_DENIED
          });
        }

        next();
      } catch (error) {
        console.error('Ownership check error:', error);
        res.status(500).json({
          error: 'Server error',
          code: ERROR_CODES.SERVER_ERROR
        });
      }
    };
  };

  /**
   * Rate limiting for authentication endpoints
   */
  authRateLimit = async (req, res, next) => {
    const ip = req.ip;
    const endpoint = req.path;
    
    const rateLimitKey = `auth:ratelimit:${ip}:${endpoint}`;
    
    // Allow more attempts for login/register
    const maxAttempts = endpoint.includes('login') || endpoint.includes('register') 
      ? SECURITY.MAX_LOGIN_ATTEMPTS 
      : 10;
    
    const rateLimit = await redis.rateLimit.fixedWindow(
      rateLimitKey,
      900, // 15 minutes
      maxAttempts
    );

    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: 'Too many authentication attempts',
        code: ERROR_CODES.RATE_LIMITED,
        retryAfter: Math.ceil(rateLimit.reset / 1000),
        remaining: rateLimit.remaining
      });
    }

    // Add rate limit info to response headers
    res.setHeader('X-RateLimit-Limit', maxAttempts);
    res.setHeader('X-RateLimit-Remaining', rateLimit.remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(rateLimit.reset / 1000));

    next();
  };

  /**
   * Check API key for external services
   */
  requireApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;

    if (!apiKey) {
      return res.status(401).json({
        error: 'API key required',
        code: ERROR_CODES.AUTH_MISSING_CREDENTIALS
      });
    }

    // Validate API key (in production, this would check against a database)
    const validApiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];
    
    if (!validApiKeys.includes(apiKey)) {
      return res.status(401).json({
        error: 'Invalid API key',
        code: ERROR_CODES.AUTH_INVALID_CREDENTIALS
      });
    }

    // Check rate limiting for API key
    const apiRateLimitKey = `api:ratelimit:${apiKey}`;
    
    // Different rate limits for different API key prefixes
    let maxRequests = 1000; // Default
    if (apiKey.startsWith('dev_')) maxRequests = 100;
    if (apiKey.startsWith('prod_')) maxRequests = 10000;

    // This would be implemented with Redis rate limiting
    req.apiKey = apiKey;
    req.apiRateLimit = maxRequests;

    next();
  };

  /**
   * Validate CSRF token for state-changing operations
   */
  validateCsrf = (req, res, next) => {
    // Only check for state-changing methods
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return next();
    }

    const csrfToken = req.headers['x-csrf-token'] || req.body._csrf;
    
    if (!csrfToken) {
      return res.status(403).json({
        error: 'CSRF token required',
        code: ERROR_CODES.RESOURCE_ACCESS_DENIED
      });
    }

    // In a real implementation, you would:
    // 1. Get the session
    // 2. Compare the token with the one stored in session
    // 3. Reject if they don't match
    
    // For now, we'll accept any token for demo purposes
    // In production, use a library like csurf
    
    next();
  };

  /**
   * Validate reCAPTCHA for public endpoints
   */
  validateRecaptcha = async (req, res, next) => {
    // Skip for authenticated users
    if (req.userId) {
      return next();
    }

    // Only validate on registration and password reset
    if (!req.path.includes('/register') && !req.path.includes('/forgot-password')) {
      return next();
    }

    const recaptchaToken = req.body.recaptchaToken;
    
    if (!recaptchaToken) {
      return res.status(400).json({
        error: 'reCAPTCHA verification required',
        code: ERROR_CODES.VALIDATION_FAILED
      });
    }

    try {
      // Verify with Google reCAPTCHA API
      const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        return res.status(400).json({
          error: 'reCAPTCHA verification failed',
          code: ERROR_CODES.VALIDATION_FAILED,
          errors: data['error-codes']
        });
      }

      // Optional: Check score for v3
      if (data.score && data.score < 0.5) {
        return res.status(400).json({
          error: 'Suspicious activity detected',
          code: ERROR_CODES.VALIDATION_FAILED,
          score: data.score
        });
      }

      next();
    } catch (error) {
      console.error('reCAPTCHA verification error:', error);
      // Allow proceeding on error (fail open for better UX)
      next();
    }
  };

  /**
   * Check if user is online (WebSocket connection)
   */
  checkOnlineStatus = async (req, res, next) => {
    if (!req.userId) {
      return next();
    }

    const onlineKey = `user:online:${req.userId}`;
    const isOnline = await redis.cache.exists(onlineKey);
    
    req.user.isOnline = isOnline;
    req.user.lastSeen = await redis.cache.get(`user:lastseen:${req.userId}`);

    next();
  };

  /**
   * Get user by ID (cached)
   */
  async getUserById(userId) {
    const cacheKey = `user:${userId}`;
    
    const cachedUser = await redis.cache.get(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }

    const User = require('../models/user');
    const user = await User.findById(userId)
      .select('-password -subscription.stripeCustomerId')
      .lean();

    if (user) {
      // Cache for 5 minutes
      await redis.cache.set(cacheKey, user, 300);
    }

    return user;
  }

  /**
   * Logout all devices (admin function)
   */
  logoutAllDevices = async (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Admin access required',
        code: ERROR_CODES.RESOURCE_ACCESS_DENIED
      });
    }

    const { userId } = req.params;

    try {
      // Get all sessions for user
      const sessions = await redis.session.getUserSessions(userId);
      
      // Delete all sessions
      for (const session of sessions) {
        await redis.session.delete(session.id);
      }

      // Delete all refresh tokens
      const refreshTokensPattern = `refresh_token:${userId}:*`;
      const refreshTokenKeys = await redis.cache.keys(refreshTokensPattern);
      for (const key of refreshTokenKeys) {
        await redis.cache.delete(key);
      }

      // Blacklist all active access tokens (this would require token tracking)
      // For now, we rely on short token expiry

      next();
    } catch (error) {
      console.error('Logout all devices error:', error);
      res.status(500).json({
        error: 'Failed to logout all devices',
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  };

  /**
   * Two-factor authentication middleware
   */
  require2FA = async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: ERROR_CODES.AUTH_MISSING_CREDENTIALS
      });
    }

    // Skip 2FA for API keys and trusted devices
    if (req.headers['x-api-key'] || req.headers['x-trusted-device']) {
      return next();
    }

    // Check if user has 2FA enabled
    const user = await this.getUserById(req.userId);
    if (!user || !user.twoFactorEnabled) {
      return next();
    }

    const twoFactorToken = req.headers['x-2fa-token'] || req.body.twoFactorToken;
    
    if (!twoFactorToken) {
      return res.status(401).json({
        error: 'Two-factor authentication required',
        code: ERROR_CODES.AUTH_MISSING_CREDENTIALS,
        requires2FA: true
      });
    }

    // Verify 2FA token
    const twoFactorKey = `2fa:${req.userId}:${twoFactorToken}`;
    const isValid = await redis.cache.exists(twoFactorKey);
    
    if (!isValid) {
      return res.status(401).json({
        error: 'Invalid two-factor token',
        code: ERROR_CODES.AUTH_INVALID_CREDENTIALS
      });
    }

    // Delete used token
    await redis.cache.delete(twoFactorKey);

    next();
  };
}

module.exports = new AuthMiddleware();