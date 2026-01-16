const { body, param, query, validationResult } = require('express-validator');
const moment = require('moment');
const Helpers = require('./helpers');

class Validators {
  // Common validation rules
  static username = [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores')
      .not()
      .matches(/^admin$/i)
      .withMessage('Username not allowed')
  ];

  static email = [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail()
  ];

  static password = [
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/\d/)
      .withMessage('Password must contain at least one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage('Password must contain at least one special character')
  ];

  static displayName = [
    body('displayName')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Display name must be between 2 and 50 characters')
      .escape()
  ];

  // Auth validators
  static register = [
    ...this.username,
    ...this.email,
    ...this.password,
    ...this.displayName,
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords do not match')
  ];

  static login = [
    body('identifier')
      .trim()
      .notEmpty()
      .withMessage('Email or username is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ];

  static forgotPassword = [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address')
  ];

  static resetPassword = [
    body('token')
      .notEmpty()
      .withMessage('Reset token is required'),
    ...this.password,
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords do not match')
  ];

  // Streak validators
  static verifyStreak = [
    body('duration')
      .optional()
      .isInt({ min: 1, max: 1440 })
      .withMessage('Duration must be between 1 and 1440 minutes'),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Notes cannot exceed 500 characters')
      .escape(),
    body('location')
      .optional()
      .custom(value => {
        try {
          const loc = JSON.parse(value);
          return (
            typeof loc === 'object' &&
            (loc.lat === undefined || (loc.lat >= -90 && loc.lat <= 90)) &&
            (loc.lng === undefined || (loc.lng >= -180 && loc.lng <= 180))
          );
        } catch {
          return false;
        }
      })
      .withMessage('Invalid location format')
  ];

  static shameVerification = [
    body('shameMessage')
      .trim()
      .isLength({ min: 10, max: 200 })
      .withMessage('Shame message must be between 10 and 200 characters')
      .escape(),
    body('public')
      .optional()
      .isBoolean()
      .withMessage('Public must be a boolean')
  ];

  // User validators
  static updateProfile = [
    body('displayName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Display name must be between 2 and 50 characters')
      .escape(),
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Bio cannot exceed 200 characters')
      .escape(),
    body('location.city')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('City name cannot exceed 50 characters')
      .escape(),
    body('location.country')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Country name cannot exceed 50 characters')
      .escape(),
    body('preferences.publicProfile')
      .optional()
      .isBoolean()
      .withMessage('publicProfile must be a boolean'),
    body('preferences.showOnLeaderboard')
      .optional()
      .isBoolean()
      .withMessage('showOnLeaderboard must be a boolean'),
    body('preferences.notifications.streakReminder')
      .optional()
      .isBoolean()
      .withMessage('streakReminder must be a boolean'),
    body('preferences.notifications.leaderboardUpdates')
      .optional()
      .isBoolean()
      .withMessage('leaderboardUpdates must be a boolean')
  ];

  static updatePassword = [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    ...this.password,
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords do not match')
  ];

  // Challenge validators
  static createChallenge = [
    body('type')
      .isIn(['streak_duel', 'consistency_race', 'daily_verification', 'team_battle'])
      .withMessage('Invalid challenge type'),
    body('participants')
      .isArray()
      .withMessage('Participants must be an array')
      .custom((value, { req }) => {
        if (!Array.isArray(value)) return false;
        if (value.length < 2) return false;
        if (value.length > 100) return false;
        return value.every(id => Helpers.isValidObjectId(id));
      })
      .withMessage('Participants must be an array of 2-100 valid user IDs'),
    body('duration')
      .optional()
      .isInt({ min: 1, max: 365 })
      .withMessage('Duration must be between 1 and 365 days'),
    body('stake')
      .optional()
      .isFloat({ min: 0, max: 1000 })
      .withMessage('Stake must be between 0 and 1000'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage('Challenge name must be between 3 and 50 characters')
      .escape(),
    body('privacy')
      .optional()
      .isIn(['public', 'private', 'friends'])
      .withMessage('Privacy must be public, private, or friends')
  ];

  // Payment validators
  static createPayment = [
    body('type')
      .isIn(['subscription', 'streak_restoration', 'freeze_tokens', 'challenge_stake'])
      .withMessage('Invalid payment type'),
    body('plan')
      .optional()
      .isIn(['premium', 'elite', 'enterprise'])
      .withMessage('Invalid plan type'),
    body('amount')
      .optional()
      .isFloat({ min: 0.99, max: 9999.99 })
      .withMessage('Amount must be between 0.99 and 9999.99'),
    body('metadata')
      .optional()
      .isObject()
      .withMessage('Metadata must be an object')
  ];

  // Social share validators
  static shareContent = [
    body('platform')
      .isIn(['twitter', 'linkedin', 'facebook', 'instagram', 'whatsapp', 'discord', 'reddit', 'telegram', 'slack', 'email'])
      .withMessage('Invalid platform'),
    body('content.text')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Share text cannot exceed 2000 characters')
      .escape(),
    body('content.hashtags')
      .optional()
      .isArray()
      .withMessage('Hashtags must be an array'),
    body('customMessage')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Custom message cannot exceed 500 characters')
      .escape()
  ];

  // Query parameter validators
  static pagination = [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer')
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
      .toInt(),
    query('sort')
      .optional()
      .isIn(['asc', 'desc', 'newest', 'oldest', 'highest', 'lowest'])
      .withMessage('Invalid sort parameter')
  ];

  static timeframe = [
    query('timeframe')
      .optional()
      .isIn(['day', 'week', 'month', 'quarter', 'year', 'all'])
      .withMessage('Invalid timeframe')
  ];

  // Param validators
  static objectId = [
    param('id')
      .isMongoId()
      .withMessage('Invalid ID format')
  ];

  static usernameParam = [
    param('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Invalid username')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Invalid username format')
  ];

  // Custom validators
  static validate(validations) {
    return async (req, res, next) => {
      await Promise.all(validations.map(validation => validation.run(req)));

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      const errorMessages = errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages
      });
    };
  }

  // File upload validators
  static validateFile = (fieldName, options = {}) => {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      required = true
    } = options;

    return [
      body(fieldName)
        .custom((value, { req }) => {
          if (!req.file && required) {
            throw new Error(`${fieldName} is required`);
          }
          
          if (req.file) {
            // Check file size
            if (req.file.size > maxSize) {
              throw new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`);
            }
            
            // Check MIME type
            if (!allowedTypes.includes(req.file.mimetype)) {
              throw new Error(`File type not allowed. Allowed: ${allowedTypes.join(', ')}`);
            }
            
            // Check file extension
            const extension = req.file.originalname.split('.').pop().toLowerCase();
            const allowedExtensions = allowedTypes.map(type => 
              type.split('/')[1].replace('jpeg', 'jpg')
            );
            
            if (!allowedExtensions.includes(extension)) {
              throw new Error(`File extension .${extension} not allowed`);
            }
          }
          
          return true;
        })
    ];
  };

  // Date validators
  static date = [
    body('date')
      .isISO8601()
      .withMessage('Date must be in ISO 8601 format')
      .custom(value => {
        const date = new Date(value);
        const now = new Date();
        const maxDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days in future
        
        if (date > maxDate) {
          throw new Error('Date cannot be more than 30 days in the future');
        }
        
        if (date < new Date('2020-01-01')) {
          throw new Error('Date cannot be before 2020');
        }
        
        return true;
      })
  ];

  // Location validators
  static location = [
    body('location.lat')
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be between -90 and 90'),
    body('location.lng')
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be between -180 and 180'),
    body('location.name')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Location name cannot exceed 100 characters')
      .escape()
  ];

  // Time validators
  static time = [
    body('time')
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Time must be in HH:MM format (24-hour)')
      .custom(value => {
        const [hours, minutes] = value.split(':').map(Number);
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
          throw new Error('Invalid time value');
        }
        return true;
      })
  ];

  // Numeric range validators
  static range = (field, min, max) => [
    body(field)
      .isFloat({ min, max })
      .withMessage(`${field} must be between ${min} and ${max}`)
  ];

  static integerRange = (field, min, max) => [
    body(field)
      .isInt({ min, max })
      .withMessage(`${field} must be an integer between ${min} and ${max}`)
  ];

  // Array validators
  static array = (field, options = {}) => {
    const { minLength = 0, maxLength = 100, required = false } = options;
    
    return [
      body(field)
        .custom((value, { req }) => {
          if (!value && required) {
            throw new Error(`${field} is required`);
          }
          
          if (value) {
            if (!Array.isArray(value)) {
              throw new Error(`${field} must be an array`);
            }
            
            if (value.length < minLength) {
              throw new Error(`${field} must have at least ${minLength} items`);
            }
            
            if (value.length > maxLength) {
              throw new Error(`${field} cannot have more than ${maxLength} items`);
            }
          }
          
          return true;
        })
    ];
  };

  // Enum validators
  static enum = (field, allowedValues) => [
    body(field)
      .isIn(allowedValues)
      .withMessage(`${field} must be one of: ${allowedValues.join(', ')}`)
  ];

  // Boolean validators
  static boolean = (field) => [
    body(field)
      .isBoolean()
      .withMessage(`${field} must be a boolean`)
  ];

  // URL validators
  static url = (field, options = {}) => {
    const { required = false } = options;
    
    return [
      body(field)
        .custom((value, { req }) => {
          if (!value && required) {
            throw new Error(`${field} is required`);
          }
          
          if (value) {
            try {
              new URL(value);
            } catch {
              throw new Error(`${field} must be a valid URL`);
            }
            
            // Additional URL validation
            if (!value.startsWith('http://') && !value.startsWith('https://')) {
              throw new Error(`${field} must start with http:// or https://`);
            }
          }
          
          return true;
        })
    ];
  };

  // Color validators (hex, rgb, rgba)
  static color = (field) => [
    body(field)
      .custom(value => {
        if (!value) return true;
        
        // Hex color validation
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        // RGB color validation
        const rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
        // RGBA color validation
        const rgbaRegex = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/;
        
        if (!hexRegex.test(value) && !rgbRegex.test(value) && !rgbaRegex.test(value)) {
          throw new Error(`${field} must be a valid hex, rgb, or rgba color`);
        }
        
        return true;
      })
  ];

  // Phone number validators (basic)
  static phone = (field) => [
    body(field)
      .optional()
      .matches(/^\+?[1-9]\d{1,14}$/)
      .withMessage('Phone number must be in E.164 format')
  ];

  // Timezone validators
  static timezone = (field) => [
    body(field)
      .optional()
      .isIn([
        'UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London',
        'Europe/Paris', 'Asia/Tokyo', 'Asia/Singapore', 'Australia/Sydney'
      ])
      .withMessage('Invalid timezone')
  ];

  // Language validators
  static language = (field) => [
    body(field)
      .optional()
      .isIn(['en', 'es', 'fr', 'de', 'ja', 'ko', 'zh', 'pt'])
      .withMessage('Invalid language code')
  ];

  // Currency validators
  static currency = (field) => [
    body(field)
      .optional()
      .isIn(['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'])
      .withMessage('Invalid currency')
  ];

  // Custom validation middleware
  static customValidator(validatorFn, field, message) {
    return [
      body(field)
        .custom((value, { req }) => {
          return validatorFn(value, req);
        })
        .withMessage(message)
    ];
  }

  // Sanitize input
  static sanitizeInput = (req, res, next) => {
    // Sanitize string fields
    const sanitizeString = (str) => {
      if (typeof str !== 'string') return str;
      
      return str
        .replace(/[<>]/g, '') // Remove HTML tags
        .trim()
        .substring(0, 10000); // Limit length
    };

    // Sanitize request body
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = sanitizeString(req.body[key]);
        }
      });
    }

    // Sanitize query parameters
    if (req.query) {
      Object.keys(req.query).forEach(key => {
        if (typeof req.query[key] === 'string') {
          req.query[key] = sanitizeString(req.query[key]);
        }
      });
    }

    next();
  };

  // Rate limiting helper
  static rateLimitKey(req) {
    return `rate:${req.ip}:${req.path}:${Math.floor(Date.now() / 60000)}`;
  }

  // Check if value is valid MongoDB ObjectId
  static isValidObjectId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  // Validate ObjectId in params
  static validateObjectId = (req, res, next) => {
    const { id } = req.params;
    
    if (!this.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
    
    next();
  };

  // Validate request has required fields
  static hasRequiredFields(requiredFields) {
    return (req, res, next) => {
      const missingFields = [];
      
      requiredFields.forEach(field => {
        if (!req.body[field] && req.body[field] !== 0 && req.body[field] !== false) {
          missingFields.push(field);
        }
      });
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }
      
      next();
    };
  }

  // Validate file upload
  static validateUpload = (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    // Check file size (max 10MB)
    if (req.file.size > 10 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 10MB limit'
      });
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only images are allowed'
      });
    }
    
    next();
  };

  // Validate date range
  static validateDateRange = (startField, endField) => {
    return (req, res, next) => {
      const start = req.body[startField];
      const end = req.body[endField];
      
      if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        
        if (startDate > endDate) {
          return res.status(400).json({
            success: false,
            message: 'Start date cannot be after end date'
          });
        }
        
        // Check if range is too large (max 1 year)
        const maxRange = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
        if (endDate - startDate > maxRange) {
          return res.status(400).json({
            success: false,
            message: 'Date range cannot exceed 1 year'
          });
        }
      }
      
      next();
    };
  };

  // Validate pagination parameters
  static validatePagination = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    if (page < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page must be at least 1'
      });
    }
    
    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100'
      });
    }
    
    req.query.page = page;
    req.query.limit = limit;
    
    next();
  };

  // Validate sort parameters
  static validateSort = (allowedFields, defaultField = 'createdAt', defaultOrder = 'desc') => {
    return (req, res, next) => {
      let sortBy = req.query.sortBy || defaultField;
      let sortOrder = req.query.sortOrder || defaultOrder;
      
      // Validate sort field
      if (!allowedFields.includes(sortBy)) {
        sortBy = defaultField;
      }
      
      // Validate sort order
      if (sortOrder !== 'asc' && sortOrder !== 'desc') {
        sortOrder = defaultOrder;
      }
      
      req.query.sortBy = sortBy;
      req.query.sortOrder = sortOrder;
      
      next();
    };
  };

  // Validate search query
  static validateSearch = (req, res, next) => {
    const query = req.query.q || '';
    
    if (query.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Search query cannot exceed 100 characters'
      });
    }
    
    // Sanitize search query
    req.query.q = query
      .replace(/[<>]/g, '')
      .trim()
      .substring(0, 100);
    
    next();
  };

  // Validate email verification token
  static validateVerificationToken = [
    param('token')
      .isLength({ min: 64, max: 256 })
      .withMessage('Invalid verification token')
      .matches(/^[A-Za-z0-9-_]+$/)
      .withMessage('Invalid token format')
  ];

  // Validate password reset token
  static validateResetToken = [
    param('token')
      .isLength({ min: 64, max: 256 })
      .withMessage('Invalid reset token')
      .matches(/^[A-Za-z0-9-_]+$/)
      .withMessage('Invalid token format')
  ];

  // Validate invitation code
  static validateInvitationCode = [
    param('code')
      .isLength({ min: 8, max: 32 })
      .withMessage('Invalid invitation code')
      .matches(/^[A-Z0-9]+$/)
      .withMessage('Invalid code format')
  ];

  // Validate referral code
  static validateReferralCode = [
    body('referralCode')
      .optional()
      .isLength({ min: 6, max: 12 })
      .withMessage('Invalid referral code')
      .matches(/^[A-Z0-9]+$/)
      .withMessage('Invalid code format')
  ];

  // Validate promo code
  static validatePromoCode = [
    body('promoCode')
      .optional()
      .isLength({ min: 4, max: 20 })
      .withMessage('Invalid promo code')
      .matches(/^[A-Z0-9-_]+$/)
      .withMessage('Invalid code format')
  ];
}

module.exports = Validators;