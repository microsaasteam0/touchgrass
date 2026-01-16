const { body, param, query, validationResult, checkSchema } = require('express-validator');
const { isValidObjectId } = require('mongoose');
const { ERROR_CODES, VALIDATION_RULES } = require('../config/constants');

/**
 * Validation Middleware
 * Comprehensive request validation with sanitization
 */

class ValidationMiddleware {
  /**
   * Common validation rules
   */
  static rules = {
    // User validation
    username: body('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters')
      .matches(/^[a-zA-Z0-9_.-]+$/).withMessage('Username can only contain letters, numbers, dots, hyphens, and underscores')
      .custom(value => !/\s/.test(value)).withMessage('Username cannot contain spaces'),
    
    email: body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail()
      .isLength({ max: 100 }).withMessage('Email too long'),
    
    password: body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .matches(/[0-9]/).withMessage('Password must contain at least one number')
      .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character')
      .custom((value, { req }) => {
        if (value === req.body.username) {
          throw new Error('Password cannot be the same as username');
        }
        return true;
      }),
    
    displayName: body('displayName')
      .trim()
      .notEmpty().withMessage('Display name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Display name must be 2-50 characters')
      .escape(),
    
    bio: body('bio')
      .optional()
      .trim()
      .isLength({ max: 200 }).withMessage('Bio must not exceed 200 characters')
      .escape(),
    
    // Streak validation
    streakId: param('streakId')
      .notEmpty().withMessage('Streak ID is required')
      .custom(value => isValidObjectId(value)).withMessage('Invalid streak ID'),
    
    verificationMethod: body('verificationMethod')
      .isIn(['photo', 'location', 'manual', 'shame']).withMessage('Invalid verification method'),
    
    duration: body('duration')
      .optional()
      .isInt({ min: 1, max: 1440 }).withMessage('Duration must be 1-1440 minutes'),
    
    notes: body('notes')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Notes must not exceed 500 characters')
      .escape(),
    
    shameMessage: body('shameMessage')
      .if(body('verificationMethod').equals('shame'))
      .notEmpty().withMessage('Shame message is required for shame verification')
      .isLength({ min: 10, max: 200 }).withMessage('Shame message must be 10-200 characters')
      .escape(),
    
    location: body('location')
      .optional()
      .custom(value => {
        try {
          const location = typeof value === 'string' ? JSON.parse(value) : value;
          return (
            location &&
            typeof location.lat === 'number' &&
            typeof location.lng === 'number' &&
            location.lat >= -90 && location.lat <= 90 &&
            location.lng >= -180 && location.lng <= 180
          );
        } catch {
          return false;
        }
      }).withMessage('Invalid location format'),
    
    // Chat validation
    messageText: body('text')
      .trim()
      .notEmpty().withMessage('Message text is required')
      .isLength({ min: 1, max: 2000 }).withMessage('Message must be 1-2000 characters')
      .escape(),
    
    chatId: param('chatId')
      .notEmpty().withMessage('Chat ID is required')
      .custom(value => isValidObjectId(value)).withMessage('Invalid chat ID'),
    
    // Payment validation
    amount: body('amount')
      .optional()
      .isFloat({ min: 0.99, max: 9999.99 }).withMessage('Amount must be between $0.99 and $9999.99')
      .custom(value => {
        const decimalPlaces = value.toString().split('.')[1];
        return !decimalPlaces || decimalPlaces.length <= 2;
      }).withMessage('Amount can have at most 2 decimal places'),
    
    paymentMethodId: body('paymentMethodId')
      .notEmpty().withMessage('Payment method ID is required'),
    
    // Challenge validation
    challengeName: body('name')
      .trim()
      .notEmpty().withMessage('Challenge name is required')
      .isLength({ min: 3, max: 100 }).withMessage('Challenge name must be 3-100 characters'),
    
    challengeDuration: body('duration')
      .isInt({ min: 1, max: 365 }).withMessage('Challenge duration must be 1-365 days'),
    
    stake: body('stake')
      .optional()
      .isFloat({ min: 0, max: 1000 }).withMessage('Stake must be between $0 and $1000'),
    
    // Social sharing validation
    platform: body('platform')
      .isIn(['twitter', 'linkedin', 'facebook', 'instagram', 'whatsapp', 'discord', 'clipboard'])
      .withMessage('Invalid platform'),
    
    customMessage: body('customMessage')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Custom message too long')
      .escape(),
    
    // Query parameter validation
    limit: query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
      .toInt(),
    
    page: query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be at least 1')
      .toInt(),
    
    sortBy: query('sortBy')
      .optional()
      .isIn(['streak', 'consistency', 'totalDays', 'createdAt', 'updatedAt'])
      .withMessage('Invalid sort field'),
    
    order: query('order')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Order must be "asc" or "desc"'),
    
    // File validation
    fileType: body('fileType')
      .optional()
      .isIn(['image', 'video', 'document'])
      .withMessage('Invalid file type'),
    
    // Date validation
    date: param('date')
      .optional()
      .isISO8601().withMessage('Invalid date format')
      .custom(value => {
        const date = new Date(value);
        return date <= new Date();
      }).withMessage('Date cannot be in the future')
  };

  /**
   * Validation schemas for common requests
   */
  static schemas = {
    register: [
      ValidationMiddleware.rules.username,
      ValidationMiddleware.rules.email,
      ValidationMiddleware.rules.password,
      ValidationMiddleware.rules.displayName,
      ValidationMiddleware.rules.bio
    ],
    
    login: [
      body('email').trim().notEmpty().withMessage('Email is required'),
      body('password').notEmpty().withMessage('Password is required')
    ],
    
    updateProfile: [
      ValidationMiddleware.rules.displayName.optional(),
      ValidationMiddleware.rules.bio,
      body('location.city').optional().trim().escape(),
      body('location.country').optional().trim().escape(),
      body('preferences.publicProfile').optional().isBoolean(),
      body('preferences.showOnLeaderboard').optional().isBoolean(),
      body('preferences.notifications.streakReminder').optional().isBoolean(),
      body('preferences.notifications.leaderboardUpdates').optional().isBoolean()
    ],
    
    verifyStreakPhoto: [
      ValidationMiddleware.rules.verificationMethod,
      ValidationMiddleware.rules.duration,
      ValidationMiddleware.rules.notes,
      ValidationMiddleware.rules.location,
      body('photo').custom((value, { req }) => {
        if (!req.file && !req.body.photoUrl) {
          throw new Error('Photo or photo URL is required');
        }
        return true;
      })
    ],
    
    verifyStreakShame: [
      ValidationMiddleware.rules.shameMessage,
      body('public').optional().isBoolean()
    ],
    
    createChat: [
      body('participants')
        .isArray({ min: 2 }).withMessage('At least 2 participants required')
        .custom(participants => {
          if (!Array.isArray(participants)) return false;
          return participants.every(id => isValidObjectId(id));
        }).withMessage('Invalid participant IDs'),
      body('type')
        .isIn(['direct', 'group', 'challenge']).withMessage('Invalid chat type'),
      body('name')
        .if(body('type').not().equals('direct'))
        .notEmpty().withMessage('Chat name is required for group/challenge chats')
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Chat name must be 2-50 characters')
    ],
    
    sendMessage: [
      ValidationMiddleware.rules.messageText,
      body('type')
        .optional()
        .isIn(['text', 'image', 'streak_share', 'challenge', 'system'])
        .withMessage('Invalid message type'),
      body('attachments')
        .optional()
        .isArray().withMessage('Attachments must be an array'),
      body('metadata')
        .optional()
        .isObject().withMessage('Metadata must be an object')
    ],
    
    createChallenge: [
      ValidationMiddleware.rules.challengeName,
      ValidationMiddleware.rules.challengeDuration,
      ValidationMiddleware.rules.stake,
      body('participants')
        .isArray({ min: 2, max: 100 }).withMessage('2-100 participants required')
        .custom(participants => {
          return participants.every(id => isValidObjectId(id));
        }).withMessage('Invalid participant IDs'),
      body('rules')
        .optional()
        .isObject().withMessage('Rules must be an object'),
      body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Description too long')
        .escape()
    ],
    
    processPayment: [
      ValidationMiddleware.rules.amount,
      ValidationMiddleware.rules.paymentMethodId,
      body('currency')
        .optional()
        .isIn(['usd', 'eur', 'gbp', 'cad', 'aud'])
        .withMessage('Invalid currency'),
      body('description')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Description too long')
        .escape()
    ],
    
    shareToSocial: [
      ValidationMiddleware.rules.platform,
      ValidationMiddleware.rules.customMessage,
      body('streakId')
        .notEmpty().withMessage('Streak ID is required')
        .custom(value => isValidObjectId(value)).withMessage('Invalid streak ID'),
      body('hashtags')
        .optional()
        .isArray().withMessage('Hashtags must be an array')
        .custom(hashtags => {
          if (!Array.isArray(hashtags)) return false;
          return hashtags.every(tag => 
            typeof tag === 'string' && 
            tag.length <= 20 && 
            /^[a-zA-Z0-9_]+$/.test(tag)
          );
        }).withMessage('Invalid hashtags')
    ],
    
    updateStreak: [
      ValidationMiddleware.rules.duration.optional(),
      ValidationMiddleware.rules.notes,
      body('status')
        .optional()
        .isIn(['active', 'broken', 'frozen']).withMessage('Invalid status'),
      body('freezeTokensUsed')
        .optional()
        .isInt({ min: 0 }).withMessage('Freeze tokens must be non-negative')
    ]
  };

  /**
   * Custom validators
   */
  static customValidators = {
    // Check if username is available
    isUsernameAvailable: async (value) => {
      const User = require('../models/user');
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error('Username already taken');
      }
      return true;
    },
    
    // Check if email is available
    isEmailAvailable: async (value) => {
      const User = require('../models/user');
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error('Email already registered');
      }
      return true;
    },
    
    // Validate date range
    isValidDateRange: (startDate, endDate) => {
      return (value, { req }) => {
        const date = new Date(value);
        const start = new Date(req.body[startDate]);
        const end = new Date(req.body[endDate]);
        
        if (date < start || date > end) {
          throw new Error(`Date must be between ${startDate} and ${endDate}`);
        }
        return true;
      };
    },
    
    // Validate location coordinates
    isValidCoordinates: (value) => {
      if (!value) return true;
      
      try {
        const coords = typeof value === 'string' ? JSON.parse(value) : value;
        const lat = parseFloat(coords.lat);
        const lng = parseFloat(coords.lng);
        
        if (isNaN(lat) || isNaN(lng)) {
          throw new Error('Invalid coordinates');
        }
        
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          throw new Error('Coordinates out of range');
        }
        
        return true;
      } catch {
        throw new Error('Invalid location format');
      }
    },
    
    // Validate timezone
    isValidTimezone: (value) => {
      try {
        Intl.DateTimeFormat(undefined, { timeZone: value });
        return true;
      } catch {
        throw new Error('Invalid timezone');
      }
    },
    
    // Validate hex color
    isValidHexColor: (value) => {
      if (!/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
        throw new Error('Invalid hex color');
      }
      return true;
    },
    
    // Validate URL
    isValidUrl: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        throw new Error('Invalid URL');
      }
    },
    
    // Validate file size
    isValidFileSize: (maxSize) => {
      return (value, { req }) => {
        if (req.file && req.file.size > maxSize) {
          throw new Error(`File size must not exceed ${maxSize / (1024 * 1024)}MB`);
        }
        return true;
      };
    },
    
    // Validate file type
    isValidFileType: (allowedTypes) => {
      return (value, { req }) => {
        if (req.file && !allowedTypes.includes(req.file.mimetype)) {
          throw new Error(`File type must be one of: ${allowedTypes.join(', ')}`);
        }
        return true;
      };
    }
  };

  /**
   * Sanitization middleware
   */
  static sanitizers = {
    sanitizeEmail: body('email').trim().normalizeEmail(),
    sanitizeUsername: body('username').trim().toLowerCase(),
    sanitizeDisplayName: body('displayName').trim().escape(),
    sanitizeBio: body('bio').trim().escape(),
    sanitizeMessage: body('text').trim().escape(),
    sanitizeNotes: body('notes').trim().escape(),
    sanitizeShameMessage: body('shameMessage').trim().escape()
  };

  /**
   * Validate request and return formatted errors
   */
  static validate = (validations) => {
    return async (req, res, next) => {
      try {
        // Run all validations
        await Promise.all(validations.map(validation => validation.run(req)));
        
        // Check for validation errors
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
          // Format errors
          const formattedErrors = errors.array().map(error => ({
            field: error.path,
            message: error.msg,
            value: error.value,
            type: error.type
          }));
          
          console.warn('Validation failed:', {
            endpoint: req.originalUrl,
            method: req.method,
            errors: formattedErrors,
            userId: req.user?.id
          });
          
          return res.status(400).json({
            error: 'ValidationError',
            message: 'Request validation failed',
            code: ERROR_CODES.VALIDATION_ERROR,
            errors: formattedErrors
          });
        }
        
        next();
      } catch (error) {
        console.error('Validation middleware error:', error);
        return res.status(500).json({
          error: 'ValidationError',
          message: 'Validation failed unexpectedly',
          code: ERROR_CODES.INTERNAL_ERROR
        });
      }
    };
  };

  /**
   * Validate MongoDB ObjectId
   */
  static validateObjectId = (paramName) => {
    return [
      param(paramName)
        .notEmpty().withMessage(`${paramName} is required`)
        .custom(value => isValidObjectId(value)).withMessage(`Invalid ${paramName}`),
      ValidationMiddleware.validate
    ];
  };

  /**
   * Validate pagination query parameters
   */
  static validatePagination = () => {
    return ValidationMiddleware.validate([
      ValidationMiddleware.rules.limit,
      ValidationMiddleware.rules.page,
      ValidationMiddleware.rules.sortBy,
      ValidationMiddleware.rules.order
    ]);
  };

  /**
   * Validate date range query
   */
  static validateDateRange = () => {
    return ValidationMiddleware.validate([
      query('startDate')
        .optional()
        .isISO8601().withMessage('Invalid start date'),
      query('endDate')
        .optional()
        .isISO8601().withMessage('Invalid end date')
        .custom((value, { req }) => {
          if (req.query.startDate && value) {
            const start = new Date(req.query.startDate);
            const end = new Date(value);
            if (end < start) {
              throw new Error('End date must be after start date');
            }
            // Limit to 90 days max
            const diffDays = (end - start) / (1000 * 60 * 60 * 24);
            if (diffDays > 90) {
              throw new Error('Date range cannot exceed 90 days');
            }
          }
          return true;
        })
    ]);
  };

  /**
   * Validate file upload
   */
  static validateFileUpload = (options = {}) => {
    const validations = [];
    
    if (options.required) {
      validations.push(
        body('file').custom((value, { req }) => {
          if (!req.file) {
            throw new Error('File is required');
          }
          return true;
        })
      );
    }
    
    if (options.maxSize) {
      validations.push(ValidationMiddleware.customValidators.isValidFileSize(options.maxSize));
    }
    
    if (options.allowedTypes) {
      validations.push(ValidationMiddleware.customValidators.isValidFileType(options.allowedTypes));
    }
    
    return ValidationMiddleware.validate(validations);
  };

  /**
   * Validate and sanitize user input for XSS protection
   */
  static sanitizeInput = () => {
    return (req, res, next) => {
      try {
        // Sanitize body
        if (req.body) {
          Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
              req.body[key] = req.body[key]
                .trim()
                .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
                .substring(0, VALIDATION_RULES.MAX_INPUT_LENGTH);
            }
          });
        }
        
        // Sanitize query params
        if (req.query) {
          Object.keys(req.query).forEach(key => {
            if (typeof req.query[key] === 'string') {
              req.query[key] = req.query[key]
                .trim()
                .replace(/[<>]/g, '')
                .substring(0, VALIDATION_RULES.MAX_INPUT_LENGTH);
            }
          });
        }
        
        next();
      } catch (error) {
        console.error('Sanitization error:', error);
        next();
      }
    };
  };

  /**
   * Validate API key
   */
  static validateApiKey = () => {
    return async (req, res, next) => {
      try {
        const apiKey = req.headers['x-api-key'] || req.query.api_key;
        
        if (!apiKey) {
          return res.status(401).json({
            error: 'MissingAPIKey',
            message: 'API key is required',
            code: ERROR_CODES.AUTH_ERROR
          });
        }
        
        // Validate API key format
        if (!/^tg_[a-zA-Z0-9]{32}$/.test(apiKey)) {
          return res.status(401).json({
            error: 'InvalidAPIKey',
            message: 'Invalid API key format',
            code: ERROR_CODES.AUTH_ERROR
          });
        }
        
        // Check if API key exists and is valid
        const ApiKey = require('../models/ApiKey');
        const keyDoc = await ApiKey.findOne({ 
          key: apiKey,
          isActive: true
        });
        
        if (!keyDoc) {
          return res.status(401).json({
            error: 'InvalidAPIKey',
            message: 'Invalid or inactive API key',
            code: ERROR_CODES.AUTH_ERROR
          });
        }
        
        // Check rate limit for API key
        const rateLimitKey = `api_key:${apiKey}:${Math.floor(Date.now() / 60000)}`;
        const requests = await req.redis.incr(rateLimitKey);
        
        if (requests === 1) {
          await req.redis.expire(rateLimitKey, 60);
        }
        
        if (requests > keyDoc.rateLimit) {
          return res.status(429).json({
            error: 'RateLimitExceeded',
            message: `API rate limit exceeded. Limit: ${keyDoc.rateLimit} requests per minute`,
            code: ERROR_CODES.RATE_LIMIT_EXCEEDED
          });
        }
        
        // Attach API key info to request
        req.apiKey = keyDoc;
        next();
      } catch (error) {
        console.error('API key validation error:', error);
        return res.status(500).json({
          error: 'ValidationError',
          message: 'API key validation failed',
          code: ERROR_CODES.INTERNAL_ERROR
        });
      }
    };
  };

  /**
   * Validate webhook signature
   */
  static validateWebhookSignature = (secret) => {
    return (req, res, next) => {
      try {
        const signature = req.headers['x-webhook-signature'];
        
        if (!signature) {
          return res.status(401).json({
            error: 'MissingSignature',
            message: 'Webhook signature is required',
            code: ERROR_CODES.AUTH_ERROR
          });
        }
        
        // Create expected signature
        const crypto = require('crypto');
        const expectedSignature = crypto
          .createHmac('sha256', secret)
          .update(JSON.stringify(req.body))
          .digest('hex');
        
        // Compare signatures
        if (signature !== expectedSignature) {
          console.warn('Invalid webhook signature:', {
            expected: expectedSignature,
            received: signature,
            body: req.body
          });
          
          return res.status(401).json({
            error: 'InvalidSignature',
            message: 'Invalid webhook signature',
            code: ERROR_CODES.AUTH_ERROR
          });
        }
        
        next();
      } catch (error) {
        console.error('Webhook signature validation error:', error);
        return res.status(500).json({
          error: 'ValidationError',
          message: 'Webhook validation failed',
          code: ERROR_CODES.INTERNAL_ERROR
        });
      }
    };
  };

  /**
   * Log validation errors for monitoring
   */
  static logValidationErrors = (req, errors) => {
    console.warn('Validation errors logged:', {
      timestamp: new Date().toISOString(),
      endpoint: req.originalUrl,
      method: req.method,
      userId: req.user?.id,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      errors: errors.array()
    });
  };
}

/**
 * Convenience middleware exports
 */
module.exports = {
  ValidationMiddleware,
  
  // Validation middleware
  validate: ValidationMiddleware.validate,
  validateObjectId: ValidationMiddleware.validateObjectId,
  validatePagination: ValidationMiddleware.validatePagination,
  validateDateRange: ValidationMiddleware.validateDateRange,
  validateFileUpload: ValidationMiddleware.validateFileUpload,
  validateApiKey: ValidationMiddleware.validateApiKey,
  validateWebhookSignature: ValidationMiddleware.validateWebhookSignature,
  
  // Sanitization middleware
  sanitizeInput: ValidationMiddleware.sanitizeInput,
  
  // Pre-built validation chains
  validateRegister: ValidationMiddleware.validate(ValidationMiddleware.schemas.register),
  validateLogin: ValidationMiddleware.validate(ValidationMiddleware.schemas.login),
  validateUpdateProfile: ValidationMiddleware.validate(ValidationMiddleware.schemas.updateProfile),
  validateVerifyStreakPhoto: ValidationMiddleware.validate(ValidationMiddleware.schemas.verifyStreakPhoto),
  validateVerifyStreakShame: ValidationMiddleware.validate(ValidationMiddleware.schemas.verifyStreakShame),
  validateCreateChat: ValidationMiddleware.validate(ValidationMiddleware.schemas.createChat),
  validateSendMessage: ValidationMiddleware.validate(ValidationMiddleware.schemas.sendMessage),
  validateCreateChallenge: ValidationMiddleware.validate(ValidationMiddleware.schemas.createChallenge),
  validateProcessPayment: ValidationMiddleware.validate(ValidationMiddleware.schemas.processPayment),
  validateShareToSocial: ValidationMiddleware.validate(ValidationMiddleware.schemas.shareToSocial),
  validateUpdateStreak: ValidationMiddleware.validate(ValidationMiddleware.schemas.updateStreak),
  
  // Custom validators
  customValidators: ValidationMiddleware.customValidators,
  
  // Individual validation rules (for custom chains)
  rules: ValidationMiddleware.rules
};