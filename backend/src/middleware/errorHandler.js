const { ERROR_CODES, API_MESSAGES } = require('../config/constants');
const { redis } = require('../config/redis');

/**
 * Error Handling Middleware
 * Centralized error handling for the entire application
 */

class ErrorHandler {
  /**
   * Log error to multiple destinations
   */
  logError(error, req) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code
      },
      request: {
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        body: this.sanitizeBody(req.body),
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: req.userId
      },
      environment: process.env.NODE_ENV
    };

    // Console logging (development)
    if (process.env.NODE_ENV !== 'production') {
      console.error('❌ Error:', errorLog);
    } else {
      console.error('❌ Error:', {
        timestamp: errorLog.timestamp,
        method: errorLog.request.method,
        url: errorLog.request.url,
        error: errorLog.error.message,
        userId: errorLog.request.userId
      });
    }

    // Log to Redis for temporary storage
    this.logToRedis(errorLog);

    // Log to external service (Sentry, LogRocket, etc.)
    this.logToExternalService(errorLog);
  }

  /**
   * Sanitize request body for logging
   */
  sanitizeBody(body) {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sanitized = { ...body };
    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'key',
      'creditCard',
      'cvv',
      'ssn',
      'passport'
    ];

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });

    return sanitized;
  }

  /**
   * Log error to Redis for analysis
   */
  async logToRedis(errorLog) {
    try {
      const errorKey = `error:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
      
      // Store error for 7 days
      await redis.cache.set(errorKey, errorLog, 7 * 24 * 60 * 60);
      
      // Increment error counter
      await redis.cache.increment('analytics:errors:total');
      
      // Increment error type counter
      const errorType = errorLog.error.name || 'UnknownError';
      await redis.cache.increment(`analytics:errors:${errorType}`);
      
      // Track errors by endpoint
      const endpoint = errorLog.request.url.split('?')[0];
      await redis.cache.increment(`analytics:errors:endpoint:${endpoint}`);
    } catch (redisError) {
      console.error('Failed to log error to Redis:', redisError);
    }
  }

  /**
   * Log to external service
   */
  logToExternalService(errorLog) {
    // Integration with external logging services
    // This is a placeholder - implement based on your needs
    
    // Example: Sentry
    if (process.env.SENTRY_DSN) {
      // Sentry.captureException(errorLog.error);
    }
    
    // Example: LogRocket
    if (process.env.LOGROCKET_APP_ID) {
      // LogRocket.captureException(errorLog.error);
    }
    
    // Example: DataDog
    if (process.env.DATADOG_API_KEY) {
      // Send to DataDog
    }
  }

  /**
   * Handle not found errors
   */
  notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    error.code = ERROR_CODES.RESOURCE_NOT_FOUND;
    
    next(error);
  };

  /**
   * Main error handler middleware
   */
  handler = (error, req, res, next) => {
    // Set default values
    error.statusCode = error.statusCode || 500;
    error.code = error.code || ERROR_CODES.SERVER_ERROR;
    
    // Log the error
    this.logError(error, req);

    // Determine response based on environment
    const isProduction = process.env.NODE_ENV === 'production';
    
    let response = {
      error: API_MESSAGES.SERVER_ERROR,
      code: error.code,
      message: error.message
    };

    // Add stack trace in development
    if (!isProduction && error.stack) {
      response.stack = error.stack;
    }

    // Add validation errors if present
    if (error.errors) {
      response.errors = error.errors;
    }

    // Special handling for specific error types
    switch (error.name) {
      case 'ValidationError':
        error.statusCode = 400;
        response.error = API_MESSAGES.VALIDATION_ERROR;
        response.errors = this.formatValidationErrors(error);
        break;

      case 'CastError':
        error.statusCode = 400;
        response.error = 'Invalid ID format';
        response.code = ERROR_CODES.VALIDATION_FAILED;
        break;

      case 'MongoError':
        if (error.code === 11000) {
          error.statusCode = 409;
          response.error = 'Duplicate key error';
          response.code = ERROR_CODES.VALIDATION_FAILED;
          response.details = this.formatDuplicateKeyError(error);
        }
        break;

      case 'JsonWebTokenError':
        error.statusCode = 401;
        response.error = 'Invalid token';
        response.code = ERROR_CODES.AUTH_INVALID_TOKEN;
        break;

      case 'TokenExpiredError':
        error.statusCode = 401;
        response.error = 'Token expired';
        response.code = ERROR_CODES.AUTH_EXPIRED_TOKEN;
        break;

      case 'RateLimitError':
        error.statusCode = 429;
        response.error = 'Rate limit exceeded';
        response.code = ERROR_CODES.RATE_LIMITED;
        if (error.retryAfter) {
          response.retryAfter = error.retryAfter;
        }
        break;
    }

    // Set HTTP status
    res.status(error.statusCode);

    // Send JSON response
    res.json(response);
  };

  /**
   * Format Mongoose validation errors
   */
  formatValidationErrors(error) {
    const errors = {};
    
    if (error.errors) {
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
    }
    
    return errors;
  }

  /**
   * Format duplicate key errors
   */
  formatDuplicateKeyError(error) {
    const match = error.message.match(/index: (.+?) dup key/);
    if (match) {
      return `Duplicate value for field: ${match[1]}`;
    }
    return 'Duplicate value detected';
  }

  /**
   * Async error wrapper for async route handlers
   */
  catchAsync = (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };

  /**
   * Handle unhandled promise rejections
   */
  handleUnhandledRejection = () => {
    process.on('unhandledRejection', (reason, promise) => {
      console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
      
      // Log to external service
      this.logToExternalService({
        timestamp: new Date().toISOString(),
        type: 'unhandledRejection',
        reason: reason.toString(),
        stack: reason.stack
      });
      
      // In production, you might want to restart the process
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    });
  };

  /**
   * Handle uncaught exceptions
   */
  handleUncaughtException = () => {
    process.on('uncaughtException', (error) => {
      console.error('💥 Uncaught Exception:', error);
      
      this.logToExternalService({
        timestamp: new Date().toISOString(),
        type: 'uncaughtException',
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      });
      
      // Graceful shutdown
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    });
  };

  /**
   * Graceful shutdown handler
   */
  gracefulShutdown = (server) => {
    return (signal) => {
      console.log(`\n⚠️  Received ${signal}. Starting graceful shutdown...`);
      
      // Stop accepting new connections
      server.close(() => {
        console.log('✅ HTTP server closed');
        
        // Close database connections
        const { closeConnections } = require('../config/database');
        const { closeRedisConnections } = require('../config/redis');
        
        Promise.all([
          closeConnections(),
          closeRedisConnections()
        ]).then(() => {
          console.log('✅ All connections closed');
          console.log('👋 Graceful shutdown complete');
          process.exit(0);
        }).catch((error) => {
          console.error('❌ Error during shutdown:', error);
          process.exit(1);
        });
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('⏰ Could not close connections in time, forcing shutdown');
        process.exit(1);
      }, 10000);
    };
  };

  /**
   * Health check endpoint middleware
   */
  healthCheck = async (req, res) => {
    try {
      const healthChecks = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        checks: {}
      };

      // Check database connection
      const { checkDatabaseHealth } = require('../config/database');
      const dbHealth = await checkDatabaseHealth();
      healthChecks.checks.database = dbHealth;

      // Check Redis connection
      const { checkRedisHealth } = require('../config/redis');
      const redisHealth = await checkRedisHealth();
      healthChecks.checks.redis = redisHealth;

      // Check Stripe connection
      const { checkStripeHealth } = require('../config/stripe');
      const stripeHealth = checkStripeHealth ? await checkStripeHealth() : { status: 'not_configured' };
      healthChecks.checks.stripe = stripeHealth;

      // Check Cloudinary connection
      const { testCloudinaryConnection } = require('../config/cloudinary');
      const cloudinaryHealth = testCloudinaryConnection ? { status: 'tested' } : { status: 'not_configured' };
      healthChecks.checks.cloudinary = cloudinaryHealth;

      // Check if any service is unhealthy
      const unhealthyServices = Object.entries(healthChecks.checks)
        .filter(([_, check]) => check.status !== 'healthy' && check.status !== 'not_configured')
        .map(([service]) => service);

      if (unhealthyServices.length > 0) {
        healthChecks.status = 'unhealthy';
        healthChecks.unhealthyServices = unhealthyServices;
        res.status(503);
      }

      res.json(healthChecks);
    } catch (error) {
      console.error('Health check error:', error);
      res.status(500).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      });
    }
  };

  /**
   * Request logging middleware
   */
  requestLogger = (req, res, next) => {
    const start = Date.now();
    
    // Log request
    console.log(`📥 ${req.method} ${req.url} - IP: ${req.ip}`);
    
    // Capture response data
    const originalSend = res.send;
    const originalJson = res.json;
    
    res.send = function(body) {
      res.responseBody = body;
      return originalSend.call(this, body);
    };
    
    res.json = function(body) {
      res.responseBody = JSON.stringify(body);
      return originalJson.call(this, body);
    };
    
    // Log when response finishes
    res.on('finish', () => {
      const duration = Date.now() - start;
      const logEntry = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: req.userId,
        contentLength: res.get('Content-Length') || 'unknown'
      };
      
      // Color code based on status
      const statusColor = res.statusCode >= 500 ? '31' : // red
                         res.statusCode >= 400 ? '33' : // yellow
                         res.statusCode >= 300 ? '36' : // cyan
                         '32'; // green
      
      console.log(`📤 \x1b[${statusColor}m${res.statusCode}\x1b[0m ${req.method} ${req.url} - ${duration}ms`);
      
      // Log slow requests
      if (duration > 1000) {
        console.warn(`🐌 Slow request: ${req.method} ${req.url} took ${duration}ms`);
        
        // Log to Redis for analysis
        redis.cache.set(
          `slow_request:${Date.now()}`,
          { ...logEntry, duration, threshold: '1s' },
          24 * 60 * 60 // 24 hours
        );
      }
      
      // Log errors
      if (res.statusCode >= 400) {
        redis.cache.increment(`analytics:responses:${res.statusCode}`);
      }
    });
    
    next();
  };

  /**
   * Security headers middleware
   */
  securityHeaders = (req, res, next) => {
    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    // Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://apis.google.com https://www.google.com/recaptcha/",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://api.stripe.com https://maps.googleapis.com",
      "frame-src https://js.stripe.com https://www.google.com/recaptcha/",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
    
    res.setHeader('Content-Security-Policy', csp);
    
    // Strict Transport Security (only in production)
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
    
    next();
  };

  /**
   * Compression middleware (should be used with compression library)
   */
  compression = (req, res, next) => {
    // This is a placeholder - use compression library in production
    // const compression = require('compression');
    // return compression()(req, res, next);
    
    // For now, just pass through
    next();
  };

  /**
   * CORS middleware
   */
  cors = (req, res, next) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : [
          'http://localhost:3000',
          'http://localhost:5173',
          'http://localhost:5001',
          'http://127.0.0.1:3000',
          'https://touchgrass-7.onrender.com',
          process.env.FRONTEND_URL,
          'https://touchgrass.vercel.app',
          'https://touchgrass-frontend.onrender.com',
          'https://touchgrass.entrext.com'
        ].filter(Boolean);
    
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Session-ID, X-API-Key, X-CSRF-Token, X-2FA-Token, Accept, Origin, X-Requested-With, X-User-Email, X-Access-Token, X-User-Id');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }
    
    next();
  };
}

module.exports = new ErrorHandler();