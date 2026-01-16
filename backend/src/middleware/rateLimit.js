const { redis } = require('../config/redis');
const { RATE_LIMITS, ERROR_CODES } = require('../config/constants');

/**
 * Rate Limiting Middleware
 * Protects against abuse and ensures fair usage
 * Implements sliding window algorithm with Redis
 */

class RateLimitMiddleware {
  /**
   * Global rate limiter for all endpoints
   */
  static globalRateLimiter = (options = {}) => {
    const {
      windowMs = 15 * 60 * 1000, // 15 minutes
      max = 100, // limit each IP to 100 requests per windowMs
      message = 'Too many requests, please try again later.',
      statusCode = 429,
      skipSuccessfulRequests = false,
      keyGenerator = (req) => req.ip,
      skip = (req) => false,
      onLimitReached = (req, res, options) => {},
      store = new RedisStore({ client: redis })
    } = options;

    return async (req, res, next) => {
      try {
        // Skip if configured
        if (skip(req)) {
          return next();
        }

        const key = keyGenerator(req);
        const currentTime = Date.now();

        // Get existing window
        const windowKey = `rate_limit:global:${key}`;
        const requests = await store.get(windowKey) || [];

        // Filter out expired requests (older than windowMs)
        const validRequests = requests.filter(timestamp => {
          return currentTime - timestamp < windowMs;
        });

        // Check if limit exceeded
        if (validRequests.length >= max) {
          // Log the rate limit hit
          console.warn(`Rate limit exceeded for IP: ${key}`, {
            endpoint: req.originalUrl,
            method: req.method,
            userAgent: req.get('User-Agent'),
            timestamp: new Date().toISOString()
          });

          // Execute limit reached callback
          if (onLimitReached) {
            onLimitReached(req, res, options);
          }

          // Set rate limit headers
          res.setHeader('Retry-After', Math.ceil(windowMs / 1000));
          res.setHeader('X-RateLimit-Limit', max);
          res.setHeader('X-RateLimit-Remaining', 0);
          res.setHeader('X-RateLimit-Reset', Math.ceil((currentTime + windowMs) / 1000));

          return res.status(statusCode).json({
            error: 'RateLimitExceeded',
            message: message,
            code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
            retryAfter: Math.ceil(windowMs / 1000)
          });
        }

        // Add current request timestamp
        validRequests.push(currentTime);

        // Update store
        await store.set(windowKey, validRequests, windowMs / 1000);

        // Set rate limit headers
        const remaining = Math.max(0, max - validRequests.length);
        const resetTime = Math.ceil((currentTime + windowMs) / 1000);

        res.setHeader('X-RateLimit-Limit', max);
        res.setHeader('X-RateLimit-Remaining', remaining);
        res.setHeader('X-RateLimit-Reset', resetTime);

        // Only proceed if not skipping successful requests
        if (!skipSuccessfulRequests || (skipSuccessfulRequests && res.statusCode >= 400)) {
          next();
        } else {
          next();
        }
      } catch (error) {
        console.error('Rate limiting error:', error);
        // On Redis errors, allow the request to proceed (fail-open)
        next();
      }
    };
  };

  /**
   * Endpoint-specific rate limiter
   */
  static endpointRateLimiter = (endpoint, options = {}) => {
    const defaultLimits = RATE_LIMITS[endpoint] || RATE_LIMITS.DEFAULT;
    
    return RateLimitMiddleware.globalRateLimiter({
      windowMs: options.windowMs || defaultLimits.windowMs,
      max: options.max || defaultLimits.max,
      message: options.message || defaultLimits.message,
      keyGenerator: (req) => `endpoint:${endpoint}:${req.ip}`,
      ...options
    });
  };

  /**
   * User-based rate limiter (authenticated users)
   */
  static userRateLimiter = (options = {}) => {
    return RateLimitMiddleware.globalRateLimiter({
      windowMs: options.windowMs || 15 * 60 * 1000,
      max: options.max || 500,
      keyGenerator: (req) => {
        if (req.user && req.user.id) {
          return `user:${req.user.id}`;
        }
        return req.ip;
      },
      skip: (req) => !req.user, // Only apply to authenticated users
      ...options
    });
  };

  /**
   * Strict rate limiter for sensitive endpoints
   */
  static strictRateLimiter = (options = {}) => {
    return RateLimitMiddleware.globalRateLimiter({
      windowMs: options.windowMs || 60 * 1000, // 1 minute
      max: options.max || 10,
      message: 'Too many requests to sensitive endpoint.',
      skipSuccessfulRequests: true,
      ...options
    });
  };

  /**
   * Challenge creation rate limiter
   */
  static challengeCreationLimiter = () => {
    return RateLimitMiddleware.endpointRateLimiter('CHALLENGE_CREATE', {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 5,
      message: 'You can only create 5 challenges per hour.'
    });
  };

  /**
   * Photo verification rate limiter
   */
  static photoVerificationLimiter = () => {
    return RateLimitMiddleware.endpointRateLimiter('PHOTO_VERIFY', {
      windowMs: 5 * 60 * 1000, // 5 minutes
      max: 3,
      message: 'Too many photo verification attempts. Please wait.'
    });
  };

  /**
   * Chat message rate limiter
   */
  static chatMessageLimiter = () => {
    return RateLimitMiddleware.endpointRateLimiter('CHAT_MESSAGE', {
      windowMs: 60 * 1000, // 1 minute
      max: 30,
      message: 'Too many messages. Please slow down.'
    });
  };

  /**
   * Streak verification limiter (prevent gaming the system)
   */
  static streakVerificationLimiter = () => {
    return RateLimitMiddleware.endpointRateLimiter('STREAK_VERIFY', {
      windowMs: 24 * 60 * 60 * 1000, // 24 hours
      max: 3,
      message: 'Maximum 3 streak verifications per day.',
      keyGenerator: (req) => {
        if (req.user && req.user.id) {
          return `streak_verify:${req.user.id}:${new Date().toISOString().split('T')[0]}`;
        }
        return req.ip;
      }
    });
  };

  /**
   * Social share rate limiter
   */
  static socialShareLimiter = () => {
    return RateLimitMiddleware.endpointRateLimiter('SOCIAL_SHARE', {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 20,
      message: 'Too many shares. Please wait before sharing again.'
    });
  };

  /**
   * Registration rate limiter (prevent bot signups)
   */
  static registrationLimiter = () => {
    return RateLimitMiddleware.endpointRateLimiter('REGISTER', {
      windowMs: 24 * 60 * 60 * 1000, // 24 hours
      max: 10,
      message: 'Too many registration attempts from this IP.',
      skip: (req) => {
        // Skip for trusted IPs (internal, testing)
        const trustedIPs = ['127.0.0.1', '::1', '10.0.0.0/8', '192.168.0.0/16'];
        return trustedIPs.some(ip => req.ip.includes(ip));
      }
    });
  };

  /**
   * Password reset rate limiter
   */
  static passwordResetLimiter = () => {
    return RateLimitMiddleware.endpointRateLimiter('PASSWORD_RESET', {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 5,
      message: 'Too many password reset attempts. Please wait.'
    });
  };

  /**
   * Get rate limit info for debugging
   */
  static getRateLimitInfo = async (req) => {
    try {
      const key = `rate_limit:global:${req.ip}`;
      const requests = await redis.get(key);
      
      if (!requests) {
        return {
          current: 0,
          remaining: RATE_LIMITS.DEFAULT.max,
          reset: Date.now() + RATE_LIMITS.DEFAULT.windowMs
        };
      }

      const parsedRequests = JSON.parse(requests);
      const currentTime = Date.now();
      const validRequests = parsedRequests.filter(timestamp => {
        return currentTime - timestamp < RATE_LIMITS.DEFAULT.windowMs;
      });

      return {
        current: validRequests.length,
        remaining: Math.max(0, RATE_LIMITS.DEFAULT.max - validRequests.length),
        reset: Math.ceil((currentTime + RATE_LIMITS.DEFAULT.windowMs) / 1000),
        limit: RATE_LIMITS.DEFAULT.max,
        window: RATE_LIMITS.DEFAULT.windowMs / 1000
      };
    } catch (error) {
      console.error('Error getting rate limit info:', error);
      return null;
    }
  };

  /**
   * Clear rate limit for specific key (admin function)
   */
  static clearRateLimit = async (key) => {
    try {
      await redis.del(`rate_limit:global:${key}`);
      
      // Also clear endpoint-specific limits
      const keys = await redis.keys(`rate_limit:*:${key}`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      
      return { success: true, cleared: keys.length + 1 };
    } catch (error) {
      console.error('Error clearing rate limit:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Get all rate-limited IPs (admin function)
   */
  static getLimitedIPs = async () => {
    try {
      const keys = await redis.keys('rate_limit:*');
      const limitedIPs = [];
      
      for (const key of keys) {
        const requests = await redis.get(key);
        if (requests) {
          const parsedRequests = JSON.parse(requests);
          const currentTime = Date.now();
          const validRequests = parsedRequests.filter(timestamp => {
            const windowMatch = key.match(/windowMs:(\d+)/);
            const windowMs = windowMatch ? parseInt(windowMatch[1]) : 15 * 60 * 1000;
            return currentTime - timestamp < windowMs;
          });
          
          if (validRequests.length > 0) {
            const ip = key.split(':').pop();
            limitedIPs.push({
              ip,
              key,
              currentRequests: validRequests.length,
              lastRequest: Math.max(...validRequests),
              isLimited: validRequests.length >= 100 // Adjust based on limit
            });
          }
        }
      }
      
      return limitedIPs;
    } catch (error) {
      console.error('Error getting limited IPs:', error);
      return [];
    }
  };

  /**
   * Dynamic rate limiting based on user tier
   */
  static tieredRateLimiter = () => {
    return async (req, res, next) => {
      try {
        const userTier = req.user?.subscription?.plan || 'free';
        const limits = {
          free: { windowMs: 15 * 60 * 1000, max: 100 },
          premium: { windowMs: 15 * 60 * 1000, max: 500 },
          elite: { windowMs: 15 * 60 * 1000, max: 2000 },
          admin: { windowMs: 15 * 60 * 1000, max: 10000 }
        };

        const tierLimit = limits[userTier] || limits.free;
        
        return RateLimitMiddleware.globalRateLimiter({
          windowMs: tierLimit.windowMs,
          max: tierLimit.max,
          keyGenerator: (req) => {
            if (req.user && req.user.id) {
              return `tier:${userTier}:${req.user.id}`;
            }
            return `tier:free:${req.ip}`;
          }
        })(req, res, next);
      } catch (error) {
        console.error('Tiered rate limiter error:', error);
        next();
      }
    };
  };

  /**
   * Adaptive rate limiting based on behavior
   */
  static adaptiveRateLimiter = () => {
    return async (req, res, next) => {
      try {
        const ip = req.ip;
        const endpoint = req.originalUrl;
        const currentTime = Date.now();
        
        // Track request patterns
        const patternKey = `behavior:${ip}`;
        const behavior = await redis.get(patternKey) || { requests: [], suspicious: false };
        
        if (typeof behavior === 'string') {
          behavior = JSON.parse(behavior);
        }
        
        // Analyze behavior
        behavior.requests.push({
          endpoint,
          timestamp: currentTime,
          method: req.method,
          userAgent: req.get('User-Agent')
        });
        
        // Keep only last 100 requests
        if (behavior.requests.length > 100) {
          behavior.requests = behavior.requests.slice(-100);
        }
        
        // Detect suspicious patterns
        const recentRequests = behavior.requests.filter(r => 
          currentTime - r.timestamp < 5 * 60 * 1000
        );
        
        if (recentRequests.length > 50) {
          behavior.suspicious = true;
          // Apply stricter limits
          return RateLimitMiddleware.strictRateLimiter({
            windowMs: 60 * 1000,
            max: 5,
            message: 'Suspicious activity detected. Please verify you are human.'
          })(req, res, next);
        }
        
        // Update behavior tracking
        await redis.set(patternKey, JSON.stringify(behavior), 24 * 60 * 60); // 24 hour TTL
        
        // Apply normal rate limiting
        next();
      } catch (error) {
        console.error('Adaptive rate limiter error:', error);
        next();
      }
    };
  };
}

/**
 * Redis store implementation for rate limiting
 */
class RedisStore {
  constructor({ client, prefix = 'rate_limit:' }) {
    this.client = client;
    this.prefix = prefix;
  }

  async get(key) {
    try {
      const data = await this.client.get(`${this.prefix}${key}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Redis store get error:', error);
      return [];
    }
  }

  async set(key, value, ttl) {
    try {
      await this.client.set(`${this.prefix}${key}`, JSON.stringify(value), 'EX', ttl);
    } catch (error) {
      console.error('Redis store set error:', error);
    }
  }

  async incr(key) {
    try {
      return await this.client.incr(`${this.prefix}${key}`);
    } catch (error) {
      console.error('Redis store incr error:', error);
      return 1;
    }
  }

  async decr(key) {
    try {
      return await this.client.decr(`${this.prefix}${key}`);
    } catch (error) {
      console.error('Redis store decr error:', error);
      return 0;
    }
  }

  async resetKey(key) {
    try {
      await this.client.del(`${this.prefix}${key}`);
    } catch (error) {
      console.error('Redis store reset error:', error);
    }
  }
}

/**
 * Export middleware functions
 */
module.exports = {
  RateLimitMiddleware,
  RedisStore,
  
  // Convenience exports
  globalRateLimiter: RateLimitMiddleware.globalRateLimiter,
  endpointRateLimiter: RateLimitMiddleware.endpointRateLimiter,
  userRateLimiter: RateLimitMiddleware.userRateLimiter,
  strictRateLimiter: RateLimitMiddleware.strictRateLimiter,
  challengeCreationLimiter: RateLimitMiddleware.challengeCreationLimiter,
  photoVerificationLimiter: RateLimitMiddleware.photoVerificationLimiter,
  chatMessageLimiter: RateLimitMiddleware.chatMessageLimiter,
  streakVerificationLimiter: RateLimitMiddleware.streakVerificationLimiter,
  socialShareLimiter: RateLimitMiddleware.socialShareLimiter,
  registrationLimiter: RateLimitMiddleware.registrationLimiter,
  passwordResetLimiter: RateLimitMiddleware.passwordResetLimiter,
  tieredRateLimiter: RateLimitMiddleware.tieredRateLimiter,
  adaptiveRateLimiter: RateLimitMiddleware.adaptiveRateLimiter,
  
  // Admin functions
  getRateLimitInfo: RateLimitMiddleware.getRateLimitInfo,
  clearRateLimit: RateLimitMiddleware.clearRateLimit,
  getLimitedIPs: RateLimitMiddleware.getLimitedIPs
};