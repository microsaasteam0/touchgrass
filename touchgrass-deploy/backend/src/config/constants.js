// Here's the updated complete `constants.js` file with all configurations for the TouchGrass platform:

//  `backend/src/config/constants.js`


/**
 * TouchGrass Platform Constants & Configuration
 * Centralized configuration file for all constants and settings
 */

export const APP = {
    NAME: 'TouchGrass',
    VERSION: '1.0.0',
    ENVIRONMENT: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT) || 5000,
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
    API_VERSION: 'v1',
    SUPPORT_EMAIL: 'support@touchgrass.now',
    CONTACT_EMAIL: 'contact@touchgrass.now',
    LEGAL_EMAIL: 'legal@touchgrass.now'
};
export const SECURITY = {
    JWT: {
        SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        EXPIRY: {
            ACCESS: '7d',
            REFRESH: '30d',
            VERIFICATION: '24h',
            PASSWORD_RESET: '1h'
        },
        ALGORITHM: 'HS256',
        ISSUER: 'touchgrass.now',
        AUDIENCE: 'touchgrass-users'
    },
    BCRYPT: {
        SALT_ROUNDS: 12
    },
    RATE_LIMIT: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        MAX_REQUESTS: 100,
        MESSAGE: 'Too many requests, please try again later.'
    },
    CORS: {
        ORIGINS: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'],
        CREDENTIALS: true,
        METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With']
    },
    CSRF: {
        ENABLED: process.env.NODE_ENV === 'production',
        COOKIE_NAME: '_csrf',
        HEADER_NAME: 'X-CSRF-Token'
    },
    HELMET: {
        CONTENT_SECURITY_POLICY: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:", "https:", "blob:"],
                connectSrc: ["'self'", "https://api.touchgrass.now", "ws://localhost:5000"],
                frameSrc: ["'self'", "https://js.stripe.com"]
            }
        }
    }
};
export const DATABASE = {
    MONGODB: {
        URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/touchgrass',
        OPTIONS: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        },
        COLLECTIONS: {
            USERS: 'users',
            STREAKS: 'streaks',
            CHALLENGES: 'challenges',
            PAYMENTS: 'payments',
            CHATS: 'chats',
            MESSAGES: 'messages',
            NOTIFICATIONS: 'notifications',
            ACHIEVEMENTS: 'achievements',
            SHARE_ANALYTICS: 'share_analytics',
            EMAIL_LOGS: 'email_logs',
            AUDIT_LOGS: 'audit_logs'
        }
    },
    REDIS: {
        URL: process.env.REDIS_URL || 'redis://localhost:6379',
        OPTIONS: {
            maxRetriesPerRequest: 3,
            enableReadyCheck: false,
            retryStrategy: (times) => {
                if (times > 3) return null;
                return Math.min(times * 50, 2000);
            }
        },
        PREFIXES: {
            SESSIONS: 'session:',
            CACHE: 'cache:',
            RATE_LIMIT: 'rate:',
            LOCK: 'lock:',
            QUEUE: 'queue:'
        },
        TTL: {
            SESSION: 24 * 60 * 60, // 24 hours
            CACHE: 5 * 60, // 5 minutes
            RATE_LIMIT: 15 * 60, // 15 minutes
            VERIFICATION: 24 * 60 * 60 // 24 hours
        }
    }
};
export const STREAK = {
    VERIFICATION: {
        METHODS: {
            PHOTO: 'photo',
            SHAME: 'shame',
            FREEZE: 'freeze',
            RESTORATION: 'restoration',
            MANUAL: 'manual'
        },
        REQUIREMENTS: {
            MIN_DURATION: 1, // minutes
            MAX_DURATION: 1440, // 24 hours in minutes
            PHOTO_MIN_SIZE: 10240, // 10KB
            PHOTO_MAX_SIZE: 10 * 1024 * 1024, // 10MB
            ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        },
        TIME_WINDOW: {
            START_HOUR: 0, // Midnight
            END_HOUR: 23, // 11 PM
            GRACE_PERIOD: 2 * 60 * 60 * 1000, // 2 hours after midnight
            TIMEZONE: 'UTC'
        }
    },
    MILESTONES: {
        1: { name: 'First Step', icon: '👣', reward: 'starter_badge' },
        3: { name: 'Getting Started', icon: '🌱', reward: 'motivation_badge' },
        7: { name: 'Weekly Warrior', icon: '🏆', reward: 'weekly_badge' },
        14: { name: 'Fortnight Champion', icon: '🥈', reward: 'fortnight_badge' },
        30: { name: 'Monthly Maestro', icon: '🌟', reward: 'monthly_badge' },
        60: { name: 'Two-Month Titan', icon: '💪', reward: 'titan_badge' },
        90: { name: 'Quarter Queen/King', icon: '👑', reward: 'quarter_badge' },
        100: { name: 'Century Club', icon: '💯', reward: 'century_badge' },
        180: { name: 'Half-Year Hero', icon: '🦸', reward: 'half_year_badge' },
        365: { name: 'Yearling', icon: '🎉', reward: 'yearly_badge' },
        500: { name: 'Half-K', icon: '🏅', reward: 'halfk_badge' },
        1000: { name: 'Millennial Streak', icon: '⚡', reward: 'millennial_badge' }
    },
    FREEZE: {
        TOKEN_COST: {
            SINGLE: 4.99,
            PACK_5: 19.99, // 5 tokens
            PACK_12: 39.99, // 12 tokens
            PACK_30: 89.99 // 30 tokens
        },
        MAX_TOKENS_PER_USER: 100,
        DURATION_PER_TOKEN: 24 * 60 * 60 * 1000, // 24 hours
        MAX_CONSECUTIVE_FREEZES: 3
    },
    RESTORATION: {
        BASE_COST: 4.99,
        MULTIPLIERS: {
            STREAK_LENGTH: 0.01, // 1% per day
            DAYS_MISSED: 0.5, // 50% per day missed
            MAX_MULTIPLIER: 3 // Max 3x base cost
        },
        MAX_DAYS_RESTORABLE: 7
    },
    SHAME: {
        PUBLIC_DURATION: 24 * 60 * 60 * 1000, // 24 hours
        MAX_MESSAGE_LENGTH: 200,
        MIN_MESSAGE_LENGTH: 10,
        MAX_SHAME_DAYS_PER_MONTH: 7,
        SHAME_SCORE_MULTIPLIER: 0.8 // Leaderboard score multiplier for shame days
    }
};
export const PAYMENTS = {
    STRIPE: {
        SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
        WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
        API_VERSION: '2023-10-16'
    },
    PLANS: {
        FREE: {
            name: 'Free',
            price: 0,
            features: [
                'Basic streak tracking',
                'Public leaderboard',
                'Daily verification',
                '7-day streak history'
            ],
            limits: {
                max_streak_freezes: 0,
                max_challenges: 2,
                max_chat_messages: 100,
                max_photo_uploads: 10,
                max_shame_days: 3
            }
        },
        PREMIUM: {
            name: 'Premium',
            price: 14.99,
            interval: 'month',
            stripe_price_id: process.env.STRIPE_PREMIUM_PRICE_ID,
            features: [
                'Everything in Free',
                'Streak freeze tokens (5/month)',
                'Advanced analytics',
                'Custom reminders',
                'Priority support',
                '30-day streak history',
                'Unlimited challenges'
            ],
            limits: {
                max_streak_freezes: 5,
                max_challenges: Infinity,
                max_chat_messages: 1000,
                max_photo_uploads: 100,
                max_shame_days: 7
            }
        },
        ELITE: {
            name: 'Elite',
            price: 29.99,
            interval: 'month',
            stripe_price_id: process.env.STRIPE_ELITE_PRICE_ID,
            features: [
                'Everything in Premium',
                'Unlimited freeze tokens',
                'Team challenges',
                'Early access features',
                'Dedicated support',
                '90-day streak history',
                'Custom themes',
                'API access'
            ],
            limits: {
                max_streak_freezes: Infinity,
                max_challenges: Infinity,
                max_chat_messages: Infinity,
                max_photo_uploads: Infinity,
                max_shame_days: 14
            }
        },
        ENTERPRISE: {
            name: 'Enterprise',
            price: 99.99,
            interval: 'month',
            stripe_price_id: process.env.STRIPE_ENTERPRISE_PRICE_ID,
            features: [
                'Everything in Elite',
                'Custom branding',
                'Dedicated account manager',
                'SLA guarantee',
                'Custom integrations',
                'Unlimited history',
                'White-label solution'
            ],
            limits: {
                max_streak_freezes: Infinity,
                max_challenges: Infinity,
                max_chat_messages: Infinity,
                max_photo_uploads: Infinity,
                max_shame_days: Infinity
            }
        }
    },
    CURRENCY: 'USD',
    TAX_RATE: 0.08, // 8% tax rate
    TRIAL_PERIOD_DAYS: 7,
    GRACE_PERIOD_DAYS: 7,
    REFUND_WINDOW_DAYS: 30
};
export const CHALLENGES = {
    TYPES: {
        STREAK_DUEL: {
            name: 'Streak Duel',
            description: 'Compete to maintain the longest streak',
            min_participants: 2,
            max_participants: 10,
            default_duration: 7,
            min_stake: 0,
            max_stake: 100
        },
        CONSISTENCY_RACE: {
            name: 'Consistency Race',
            description: 'Highest consistency score wins',
            min_participants: 3,
            max_participants: 20,
            default_duration: 30,
            min_stake: 0,
            max_stake: 50
        },
        DAILY_VERIFICATION: {
            name: 'Daily Verification',
            description: 'First to verify each day wins points',
            min_participants: 2,
            max_participants: 50,
            default_duration: 7,
            min_stake: 0,
            max_stake: 20
        },
        TEAM_BATTLE: {
            name: 'Team Battle',
            description: 'Teams compete for highest total streak',
            min_participants: 4,
            max_participants: 100,
            default_duration: 14,
            min_stake: 0,
            max_stake: 200
        }
    },
    REWARDS: {
        FIRST_PLACE: {
            type: 'premium',
            amount: 30,
            description: '30 days premium'
        },
        SECOND_PLACE: {
            type: 'premium',
            amount: 15,
            description: '15 days premium'
        },
        THIRD_PLACE: {
            type: 'tokens',
            amount: 10,
            description: '10 freeze tokens'
        },
        PARTICIPATION: {
            type: 'badge',
            description: 'Challenge Participant'
        }
    },
    PRIVACY: {
        PUBLIC: 'public',
        PRIVATE: 'private',
        FRIENDS: 'friends'
    },
    INVITATION_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
    MAX_ACTIVE_CHALLENGES_PER_USER: 5
};
export const CHAT = {
    TYPES: {
        DIRECT: 'direct',
        GROUP: 'group',
        CHALLENGE: 'challenge',
        SUPPORT: 'support'
    },
    LIMITS: {
        MAX_MESSAGE_LENGTH: 2000,
        MAX_ATTACHMENTS_PER_MESSAGE: 5,
        MAX_ATTACHMENT_SIZE: 10 * 1024 * 1024, // 10MB
        MAX_GROUP_PARTICIPANTS: 100,
        MESSAGE_RATE_LIMIT: 10, // messages per minute
        TYPING_INDICATOR_TIMEOUT: 5000 // 5 seconds
    },
    ATTACHMENTS: {
        ALLOWED_TYPES: [
            'image/jpeg', 'image/png', 'image/webp', 'image/gif',
            'video/mp4', 'video/mov', 'video/avi',
            'application/pdf', 'text/plain'
        ],
        MAX_IMAGE_DIMENSIONS: { width: 4096, height: 4096 },
        MAX_VIDEO_DURATION: 300 // 5 minutes in seconds
    },
    RETENTION: {
        MESSAGES: 30 * 24 * 60 * 60 * 1000, // 30 days
        MEDIA: 90 * 24 * 60 * 60 * 1000, // 90 days
        LOGS: 365 * 24 * 60 * 60 * 1000 // 1 year
    },
    EMOJIS: {
        REACTIONS: ['👍', '❤️', '😂', '😮', '😢', '🔥', '👏', '🎉', '🤔', '👀'],
        MAX_REACTIONS_PER_MESSAGE: 20,
        MAX_REACTIONS_PER_USER: 5
    }
};
export const NOTIFICATIONS = {
    TYPES: {
        STREAK_REMINDER: {
            title: 'Streak Reminder',
            priority: 'high',
            ttl: 2 * 60 * 60, // 2 hours
            channels: ['push', 'email', 'in_app'],
            template: 'streak_reminder'
        },
        STREAK_BROKEN: {
            title: 'Streak Broken',
            priority: 'critical',
            ttl: 24 * 60 * 60, // 24 hours
            channels: ['push', 'email', 'in_app'],
            template: 'streak_broken'
        },
        CHALLENGE_INVITE: {
            title: 'Challenge Invitation',
            priority: 'medium',
            ttl: 24 * 60 * 60, // 24 hours
            channels: ['push', 'in_app'],
            template: 'challenge_invite'
        },
        ACHIEVEMENT_UNLOCKED: {
            title: 'Achievement Unlocked',
            priority: 'medium',
            ttl: 7 * 24 * 60 * 60, // 7 days
            channels: ['push', 'email', 'in_app'],
            template: 'achievement_unlocked'
        },
        NEW_MESSAGE: {
            title: 'New Message',
            priority: 'high',
            ttl: 24 * 60 * 60, // 24 hours
            channels: ['push', 'in_app']
        },
        PAYMENT_SUCCESS: {
            title: 'Payment Successful',
            priority: 'medium',
            ttl: 30 * 24 * 60 * 60, // 30 days
            channels: ['email', 'in_app'],
            template: 'payment_receipt'
        }
    },
    CHANNELS: {
        PUSH: 'push',
        EMAIL: 'email',
        IN_APP: 'in_app',
        SMS: 'sms'
    },
    PRIORITIES: {
        LOW: 'low',
        MEDIUM: 'medium',
        HIGH: 'high',
        CRITICAL: 'critical'
    },
    SCHEDULES: {
        STREAK_REMINDER_HOUR: 18, // 6 PM
        WEEKLY_REPORT_DAY: 0, // Sunday
        MONTHLY_REPORT_DAY: 1, // 1st of month
        BATCH_PROCESSING_INTERVAL: 5 * 60 * 1000 // 5 minutes
    },
    RETENTION: {
        IN_APP: 30 * 24 * 60 * 60 * 1000, // 30 days
        EMAIL_LOGS: 90 * 24 * 60 * 60 * 1000, // 90 days
        PUSH_LOGS: 7 * 24 * 60 * 60 * 1000 // 7 days
    }
};
export const EMAIL = {
    SMTP: {
        HOST: process.env.SMTP_HOST,
        PORT: parseInt(process.env.SMTP_PORT) || 587,
        SECURE: process.env.SMTP_SECURE === 'true',
        USER: process.env.SMTP_USER,
        PASS: process.env.SMTP_PASS,
        FROM: process.env.SMTP_FROM || 'TouchGrass <noreply@touchgrass.now>'
    },
    TEMPLATES: {
        WELCOME: 'welcome',
        VERIFICATION: 'verification',
        STREAK_REMINDER: 'streak_reminder',
        STREAK_BROKEN: 'streak_broken',
        CHALLENGE_INVITE: 'challenge_invite',
        ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
        WEEKLY_REPORT: 'weekly_report',
        PAYMENT_RECEIPT: 'payment_receipt',
        PASSWORD_RESET: 'password_reset',
        SECURITY_ALERT: 'security_alert'
    },
    RATE_LIMITS: {
        MAX_EMAILS_PER_DAY: 1000,
        MAX_EMAILS_PER_HOUR: 100,
        MAX_EMAILS_PER_MINUTE: 10,
        BATCH_SIZE: 50
    },
    RETRY: {
        MAX_ATTEMPTS: 3,
        DELAY: 1000, // 1 second
        BACKOFF_MULTIPLIER: 2
    },
    BOUNCE_HANDLING: {
        MAX_BOUNCES: 5,
        BOUNCE_WINDOW_DAYS: 30,
        AUTO_UNSUBSCRIBE_ON_BOUNCE: true
    }
};
export const SOCIAL = {
    PLATFORMS: {
        TWITTER: {
            name: 'Twitter (X)',
            icon: '🐦',
            max_length: 280,
            share_url: 'https://twitter.com/intent/tweet',
            api_endpoint: 'https://api.twitter.com/2/tweets'
        },
        LINKEDIN: {
            name: 'LinkedIn',
            icon: '💼',
            max_length: 1300,
            share_url: 'https://www.linkedin.com/sharing/share-offsite/',
            api_endpoint: 'https://api.linkedin.com/v2/ugcPosts'
        },
        FACEBOOK: {
            name: 'Facebook',
            icon: '👥',
            share_url: 'https://www.facebook.com/sharer/sharer.php',
            api_endpoint: 'https://graph.facebook.com/v12.0/me/feed'
        },
        INSTAGRAM: {
            name: 'Instagram',
            icon: '📸',
            is_app: true,
            deeplink: 'instagram://share'
        },
        WHATSAPP: {
            name: 'WhatsApp',
            icon: '💬',
            share_url: 'https://api.whatsapp.com/send'
        },
        DISCORD: {
            name: 'Discord',
            icon: '🎮',
            webhook: true,
            max_length: 2000
        }
    },
    HASHTAGS: [
        'TouchGrass',
        'Accountability',
        'Streak',
        'MentalHealth',
        'Discipline',
        'Productivity',
        'Wellness',
        'Outdoors',
        'Fitness',
        'SelfImprovement'
    ],
    TEMPLATES: {
        STREAK_MILESTONE: [
            "🔥 Day {streak} of my #TouchGrass journey! Building real-world discipline one day at a time. {hashtags}",
            "🏆 Just hit a {streak}-day streak! Consistency is key. Join me: {url} {hashtags}",
            "🌱 {streak} consecutive days of touching grass. The benefits are real! {url} {hashtags}"
        ],
        ACHIEVEMENT: [
            "🎉 Just unlocked '{achievement}' on @touchgrass_now! {description} {url} {hashtags}",
            "🏅 Achievement unlocked: {achievement}! {streak} days strong. {url} {hashtags}"
        ],
        LEADERBOARD: [
            "🏆 Just reached #{rank} on the TouchGrass global leaderboard! {streak}-day streak. {url} {hashtags}",
            "📊 Leaderboard update: Now ranked #{rank} worldwide. Consistency score: {consistency}% {url} {hashtags}"
        ]
    },
    OG_IMAGES: {
        WIDTH: 1200,
        HEIGHT: 630,
        THEMES: {
            DEFAULT: { primary: '#22c55e', secondary: '#16a34a' },
            PREMIUM: { primary: '#fbbf24', secondary: '#f59e0b' },
            NATURE: { primary: '#1b4332', secondary: '#2d6a4f' },
            SUNSET: { primary: '#f59e0b', secondary: '#ec4899' }
        },
        CACHE_DURATION: 24 * 60 * 60 // 24 hours
    },
    VIRAL_MILESTONES: [10, 50, 100, 500, 1000],
    REFERRAL: {
        REWARD_DAYS: 7,
        MAX_REFERRALS: 10,
        EXPIRY_DAYS: 30
    }
};
export const ANALYTICS = {
    EVENTS: {
        STREAK_VERIFIED: 'streak_verified',
        STREAK_BROKEN: 'streak_broken',
        CHALLENGE_JOINED: 'challenge_joined',
        PAYMENT_COMPLETED: 'payment_completed',
        SHARE_POSTED: 'share_posted',
        ACHIEVEMENT_EARNED: 'achievement_earned',
        CHAT_MESSAGE_SENT: 'chat_message_sent'
    },
    RETENTION: {
        USER_LIFETIME: 90, // days
        SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
        COOKIE_EXPIRY: 365 * 24 * 60 * 60 * 1000 // 1 year
    },
    METRICS: {
        DAU_WINDOW: 24 * 60 * 60 * 1000, // 24 hours
        MAU_WINDOW: 30 * 24 * 60 * 60 * 1000, // 30 days
        CHURN_THRESHOLD: 30 * 24 * 60 * 60 * 1000 // 30 days inactive
    },
    CACHE: {
        DURATION: 5 * 60, // 5 minutes
        LEADERBOARD_KEY: 'analytics:leaderboard',
        USER_STATS_KEY: 'analytics:user:'
    }
};
export const UPLOAD = {
    CLOUDINARY: {
        CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        API_KEY: process.env.CLOUDINARY_API_KEY,
        API_SECRET: process.env.CLOUDINARY_API_SECRET,
        FOLDERS: {
            VERIFICATIONS: 'touchgrass/verifications',
            AVATARS: 'touchgrass/avatars',
            CHAT: 'touchgrass/chat',
            OG_IMAGES: 'touchgrass/og_images'
        },
        TRANSFORMATIONS: {
            THUMBNAIL: { width: 200, height: 200, crop: 'fill' },
            MEDIUM: { width: 800, height: 600, crop: 'limit' },
            LARGE: { width: 1200, height: 800, crop: 'limit' },
            AVATAR: { width: 400, height: 400, crop: 'fill', gravity: 'face' }
        }
    },
    LIMITS: {
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
        MAX_FILES_PER_UPLOAD: 5,
        ALLOWED_MIME_TYPES: [
            'image/jpeg', 'image/png', 'image/webp', 'image/gif',
            'video/mp4', 'video/mov', 'video/avi'
        ],
        MAX_IMAGE_DIMENSIONS: { width: 4096, height: 4096 },
        MAX_VIDEO_DURATION: 300 // 5 minutes
    },
    VALIDATION: {
        MIN_IMAGE_SIZE: 10240, // 10KB
        MAX_ASPECT_RATIO: 4,
        MIN_ASPECT_RATIO: 0.25
    }
};
export const GEOLOCATION = {
    PROVIDERS: {
        GOOGLE: {
            API_KEY: process.env.GOOGLE_MAPS_API_KEY,
            GEOCODE_URL: 'https://maps.googleapis.com/maps/api/geocode/json',
            TIMEZONE_URL: 'https://maps.googleapis.com/maps/api/timezone/json',
            ELEVATION_URL: 'https://maps.googleapis.com/maps/api/elevation/json'
        },
        OPENSTREETMAP: {
            GEOCODE_URL: 'https://nominatim.openstreetmap.org/search',
            REVERSE_URL: 'https://nominatim.openstreetmap.org/reverse'
        },
        IP_API: {
            URL: 'http://ip-api.com/json',
            FIELDS: 'status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query'
        }
    },
    VALIDATION: {
        MIN_LAT: -90,
        MAX_LAT: 90,
        MIN_LNG: -180,
        MAX_LNG: 180,
        MAX_DISTANCE_KM: 1000, // Max realistic daily movement
        PRECISION_DECIMALS: 6
    },
    CACHE: {
        DURATION: 24 * 60 * 60 * 1000, // 24 hours
        MAX_ENTRIES: 1000
    }
};
export const ACHIEVEMENTS = {
    CATEGORIES: {
        STREAK: 'streak',
        CONSISTENCY: 'consistency',
        SOCIAL: 'social',
        CHALLENGE: 'challenge',
        PREMIUM: 'premium'
    },
    TIERS: {
        BRONZE: { name: 'Bronze', icon: '🥉', color: '#cd7f32' },
        SILVER: { name: 'Silver', icon: '🥈', color: '#c0c0c0' },
        GOLD: { name: 'Gold', icon: '🥇', color: '#ffd700' },
        PLATINUM: { name: 'Platinum', icon: '💎', color: '#e5e4e2' },
        DIAMOND: { name: 'Diamond', icon: '✨', color: '#b9f2ff' }
    },
    RARITY: {
        COMMON: 0.6,
        UNCOMMON: 0.3,
        RARE: 0.08,
        EPIC: 0.015,
        LEGENDARY: 0.005
    },
    EXAMPLES: {
        FIRST_STREAK: {
            name: 'First Step',
            description: 'Complete your first streak verification',
            icon: '👣',
            category: 'streak',
            tier: 'bronze',
            requirement: { streak: 1 }
        },
        WEEKLY_WARRIOR: {
            name: 'Weekly Warrior',
            description: 'Maintain a 7-day streak',
            icon: '🏆',
            category: 'streak',
            tier: 'silver',
            requirement: { streak: 7 }
        },
        SOCIAL_BUTTERFLY: {
            name: 'Social Butterfly',
            description: 'Share your streak 10 times',
            icon: '🦋',
            category: 'social',
            tier: 'gold',
            requirement: { shares: 10 }
        }
    }
};
export const LOGGING = {
    LEVELS: {
        ERROR: 'error',
        WARN: 'warn',
        INFO: 'info',
        DEBUG: 'debug'
    },
    TRANSPORTS: {
        CONSOLE: {
            ENABLED: true,
            LEVEL: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
        },
        FILE: {
            ENABLED: process.env.NODE_ENV === 'production',
            LEVEL: 'error',
            PATH: './logs',
            MAX_SIZE: '10m',
            MAX_FILES: '14d'
        },
        SENTRY: {
            ENABLED: !!process.env.SENTRY_DSN,
            DSN: process.env.SENTRY_DSN,
            ENVIRONMENT: process.env.NODE_ENV
        }
    },
    FORMAT: process.env.NODE_ENV === 'production' ? 'json' : 'pretty',
    REQUEST_LOGGING: {
        ENABLED: true,
        EXCLUDE_PATHS: ['/health', '/metrics'],
        MAX_BODY_LENGTH: 1000
    }
};
export const CRON = {
    SCHEDULES: {
        STREAK_REMINDERS: '0 18 * * *', // Daily at 6 PM
        STREAK_BREAK_CHECK: '0 0 * * *', // Daily at midnight
        WEEKLY_REPORTS: '0 9 * * 0', // Sunday at 9 AM
        MONTHLY_REPORTS: '0 9 1 * *', // 1st of month at 9 AM
        NOTIFICATION_CLEANUP: '0 3 * * *', // Daily at 3 AM
        ANALYTICS_AGGREGATION: '0 4 * * *', // Daily at 4 AM
        BACKUP: '0 2 * * 0' // Sunday at 2 AM
    },
    CONCURRENCY: 1,
    TIMEZONE: 'UTC',
    LOCK_TTL: 60 * 60 * 1000, // 1 hour
    RETRY_ATTEMPTS: 3
};
export const API_RATE_LIMITS = {
    AUTH: {
        LOGIN: { window: 15 * 60 * 1000, max: 5 }, // 5 attempts per 15 minutes
        REGISTER: { window: 60 * 60 * 1000, max: 3 }, // 3 registrations per hour
        PASSWORD_RESET: { window: 60 * 60 * 1000, max: 3 } // 3 attempts per hour
    },
    STREAK: {
        VERIFY: { window: 60 * 1000, max: 3 }, // 3 verifications per minute
        SHAME: { window: 60 * 60 * 1000, max: 1 } // 1 shame per hour
    },
    CHAT: {
        MESSAGE: { window: 60 * 1000, max: 10 }, // 10 messages per minute
        TYPING: { window: 10 * 1000, max: 5 } // 5 typing indicators per 10 seconds
    },
    UPLOAD: {
        IMAGE: { window: 60 * 1000, max: 5 }, // 5 images per minute
        FILE: { window: 60 * 60 * 1000, max: 20 } // 20 files per hour
    },
    SHARE: {
        POST: { window: 60 * 1000, max: 3 } // 3 shares per minute
    }
};
export const FEATURES = {
    CHAT: process.env.FEATURE_CHAT !== 'false',
    CHALLENGES: process.env.FEATURE_CHALLENGES !== 'false',
    SOCIAL_SHARING: process.env.FEATURE_SOCIAL_SHARING !== 'false',
    PREMIUM_SUBSCRIPTIONS: process.env.FEATURE_PREMIUM !== 'false',
    EMAIL_NOTIFICATIONS: process.env.FEATURE_EMAIL_NOTIFICATIONS !== 'false',
    PUSH_NOTIFICATIONS: process.env.FEATURE_PUSH_NOTIFICATIONS !== 'false',
    GEO_VERIFICATION: process.env.FEATURE_GEO_VERIFICATION === 'true',
    ADVANCED_ANALYTICS: process.env.FEATURE_ADVANCED_ANALYTICS === 'true'
};
export const LEGAL = {
    PRIVACY_POLICY_URL: 'https://touchgrass.now/privacy',
    TERMS_OF_SERVICE_URL: 'https://touchgrass.now/terms',
    COOKIE_POLICY_URL: 'https://touchgrass.now/cookies',
    GDPR_COMPLIANT: true,
    CCPA_COMPLIANT: true,
    COPPA_COMPLIANT: true,
    MINIMUM_AGE: 13,
    DATA_RETENTION: {
        USER_DATA: 730, // 2 years in days
        LOGS: 90, // 90 days
        ANALYTICS: 365, // 1 year
        PAYMENT_RECORDS: 1825, // 5 years
        DELETION_GRACE_PERIOD: 30 // 30 days to restore
    }
};
export const I18N = {
    DEFAULT_LOCALE: 'en',
    SUPPORTED_LOCALES: ['en', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh'],
    FALLBACK_LOCALE: 'en',
    LOCALE_DETECTION: {
        ENABLED: true,
        ORDER: ['header', 'cookie', 'query'],
        COOKIE_NAME: 'touchgrass_locale',
        COOKIE_MAX_AGE: 365 * 24 * 60 * 60 // 1 year
    },
    NAMESPACES: ['common', 'streak', 'chat', 'leaderboard', 'settings', 'errors']
};
export const PERFORMANCE = {
    CACHE: {
        ENABLED: true,
        DEFAULT_TTL: 300, // 5 minutes
        LEADERBOARD_TTL: 60, // 1 minute
        USER_STATS_TTL: 120, // 2 minutes
        OG_IMAGE_TTL: 86400 // 24 hours
    },
    COMPRESSION: {
        ENABLED: true,
        THRESHOLD: 1024, // 1KB
        LEVEL: 6
    },
    PAGINATION: {
        DEFAULT_LIMIT: 20,
        MAX_LIMIT: 100,
        DEFAULT_OFFSET: 0
    },
    DATABASE: {
        POOL_SIZE: 10,
        CONNECTION_TIMEOUT: 30000,
        SOCKET_TIMEOUT: 45000,
        MAX_IDLE_TIME: 60000
    }
};
export const MONITORING = {
    HEALTH_CHECK: {
        INTERVAL: 30000, // 30 seconds
        TIMEOUT: 5000, // 5 seconds
        THRESHOLD: 3 // 3 failures before alert
    },
    METRICS: {
        COLLECTION_INTERVAL: 60000, // 1 minute
        RETENTION_PERIOD: 30 * 24 * 60 * 60 * 1000 // 30 days
    },
    ALERTS: {
        DISK_USAGE_THRESHOLD: 80, // percentage
        MEMORY_USAGE_THRESHOLD: 85, // percentage
        CPU_USAGE_THRESHOLD: 90, // percentage
        ERROR_RATE_THRESHOLD: 5, // percentage
        RESPONSE_TIME_THRESHOLD: 2000 // 2 seconds
    },
    TRACING: {
        ENABLED: process.env.ENABLE_TRACING === 'true',
        SAMPLE_RATE: 0.1, // 10% of requests
        SERVICE_NAME: 'touchgrass-backend'
    }
};
export const DEVELOPMENT = {
    DEBUG_MODE: process.env.NODE_ENV !== 'production',
    SEED_DATA: process.env.SEED_DATA === 'true',
    MOCK_DATA: process.env.MOCK_DATA === 'true',
    SKIP_AUTH: process.env.SKIP_AUTH === 'true',
    BYPASS_RATE_LIMIT: process.env.BYPASS_RATE_LIMIT === 'true',
    LOG_SQL_QUERIES: process.env.LOG_SQL_QUERIES === 'true'
};
export const BUSINESS = {
    TARGET_METRICS: {
        DAU_TARGET: 10000,
        MAU_TARGET: 100000,
        MONTHLY_REVENUE_TARGET: 50000,
        CONVERSION_RATE_TARGET: 0.05, // 5%
        CHURN_RATE_TARGET: 0.02, // 2% monthly
        VIRAL_COEFFICIENT_TARGET: 1.2 // K-factor > 1.2
    },
    PRICING_STRATEGY: {
        FREEMIUM_MODEL: true,
        TRIAL_PERIOD: 7,
        ENTERPRISE_PRICING: 'custom',
        VOLUME_DISCOUNTS: true
    },
    PARTNERSHIPS: {
        FITNESS_APPS: ['strava', 'fitbit', 'garmin', 'apple_health', 'google_fit'],
        WELLNESS_PROGRAMS: ['calm', 'headspace', 'betterhelp'],
        CORPORATE_WELLNESS: true
    }
};
export const WEBHOOKS = {
    STRIPE: {
        PATH: '/webhooks/stripe',
        SECRET: process.env.STRIPE_WEBHOOK_SECRET,
        EVENTS: [
            'checkout.session.completed',
            'customer.subscription.created',
            'customer.subscription.updated',
            'customer.subscription.deleted',
            'invoice.payment_succeeded',
            'invoice.payment_failed'
        ]
    },
    SLACK: {
        ENABLED: process.env.SLACK_WEBHOOK_URL !== undefined,
        URL: process.env.SLACK_WEBHOOK_URL,
        CHANNEL: '#touchgrass-alerts',
        EVENTS: ['error', 'payment', 'user_milestone', 'system_alert']
    },
    ZAPIER: {
        ENABLED: false,
        EVENTS: ['user_registered', 'streak_milestone', 'payment_received']
    }
};
export const TESTING = {
    USER: {
        EMAIL: 'test@touchgrass.test',
        PASSWORD: 'TestPassword123!',
        STREAK_DAYS: 42,
        CONSISTENCY: 95
    },
    MOCK: {
        USERS_COUNT: 1000,
        STREAKS_PER_USER: 1,
        MESSAGES_PER_CHAT: 50,
        CHALLENGES_COUNT: 20
    },
    COVERAGE: {
        TARGET: 80,
        EXCLUDE: ['node_modules', 'coverage', 'tests', 'dist', 'public']
    }
};
export const DEPLOYMENT = {
    ENVIRONMENTS: {
        DEVELOPMENT: {
            API_URL: 'http://localhost:5000',
            WEB_URL: 'http://localhost:3000',
            DATABASE: 'touchgrass_dev',
            REDIS_PREFIX: 'dev:'
        },
        STAGING: {
            API_URL: 'https://staging-api.touchgrass.now',
            WEB_URL: 'https://staging.touchgrass.now',
            DATABASE: 'touchgrass_staging',
            REDIS_PREFIX: 'staging:'
        },
        PRODUCTION: {
            API_URL: 'https://api.touchgrass.now',
            WEB_URL: 'https://touchgrass.now',
            DATABASE: 'touchgrass_production',
            REDIS_PREFIX: 'prod:'
        }
    },
    PROVIDERS: {
        HOSTING: ['AWS', 'DigitalOcean', 'Vercel', 'Heroku'],
        DATABASE: ['MongoDB Atlas', 'AWS DocumentDB'],
        CACHE: ['Redis Cloud', 'AWS ElastiCache'],
        STORAGE: ['Cloudinary', 'AWS S3'],
        CDN: ['Cloudflare', 'AWS CloudFront']
    },
    SCALING: {
        MIN_INSTANCES: 2,
        MAX_INSTANCES: 10,
        CPU_THRESHOLD: 70,
        MEMORY_THRESHOLD: 80,
        REQUEST_THRESHOLD: 1000 // requests per second
    }
};
export const INTEGRATIONS = {
    GOOGLE: {
        ANALYTICS_ID: process.env.GA_MEASUREMENT_ID,
        TAG_MANAGER_ID: process.env.GTM_ID,
        RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
        RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY
    },
    FACEBOOK: {
        APP_ID: process.env.FACEBOOK_APP_ID,
        APP_SECRET: process.env.FACEBOOK_APP_SECRET,
        PIXEL_ID: process.env.FACEBOOK_PIXEL_ID
    },
    TWITTER: {
        API_KEY: process.env.TWITTER_API_KEY,
        API_SECRET: process.env.TWITTER_API_SECRET,
        BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN
    },
    LINKEDIN: {
        CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
        CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET
    },
    SENTRY: {
        DSN: process.env.SENTRY_DSN,
        ENVIRONMENT: process.env.NODE_ENV,
        TRACES_SAMPLE_RATE: 0.1
    }
};
export const MISC = {
    TIMEZONE: 'UTC',
    DATE_FORMAT: 'YYYY-MM-DD',
    TIME_FORMAT: 'HH:mm:ss',
    DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
    CURRENCY_SYMBOL: '$',
    DISTANCE_UNIT: 'km', // or 'miles'
    TEMPERATURE_UNIT: 'celsius', // or 'fahrenheit'
    TIME_FORMAT_12H: false
};