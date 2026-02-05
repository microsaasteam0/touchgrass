import React from 'react';
  
 
  // Business & International Constants
export const BUSINESS_CONSTANTS = {
  APP_NAME: 'TouchGrass',
  TAGLINE: 'The Internet\'s Accountability Platform',
  COMPANY_NAME: 'TouchGrass Technologies Inc.',
  SLOGAN: 'Turning Discipline into Status',
  
  // Internationalization
  SUPPORTED_LANGUAGES: [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' }
  ],
  
  // Timezones for global business
  TIMEZONES: [
    'America/New_York', // EST
    'America/Los_Angeles', // PST
    'Europe/London', // GMT
    'Europe/Paris', // CET
    'Asia/Tokyo', // JST
    'Asia/Singapore', // SGT
    'Australia/Sydney', // AEDT
    'Asia/Dubai' // GST
  ],
  
  // Currency for international payments
  CURRENCIES: {
    USD: { symbol: '$', name: 'US Dollar', rate: 1 },
    EUR: { symbol: '€', name: 'Euro', rate: 0.92 },
    GBP: { symbol: '£', name: 'British Pound', rate: 0.79 },
    JPY: { symbol: '¥', name: 'Japanese Yen', rate: 148 },
    AUD: { symbol: 'A$', name: 'Australian Dollar', rate: 1.52 },
    CAD: { symbol: 'C$', name: 'Canadian Dollar', rate: 1.35 },
    INR: { symbol: '₹', name: 'Indian Rupee', rate: 83 }
  },

  // Business tiers
  TIERS: {
    FREE: {
      name: 'Free',
      price: 0,
      features: [
        'Basic streak tracking',
        'Daily verification',
        'Public shame posts',
        'Global leaderboard access',
        'Community chat (limited)',
        'Basic analytics'
      ],
      limitations: [
        'Streak breaks require payment',
        '3 shame posts/month',
        'Basic support',
        'No challenge creation',
        'Limited chat history'
      ]
    },
    PRO: {
      name: 'Professional',
      price: 14.99,
      features: [
        'Everything in Free',
        'Streak freeze tokens (5/month)',
        'Unlimited shame posts',
        'Advanced analytics dashboard',
        'Priority support',
        'Custom verification methods',
        'Challenge creation',
        'Team management'
      ],
      bestFor: 'Serious individuals & small teams'
    },
    ENTERPRISE: {
      name: 'Enterprise',
      price: 49.99,
      features: [
        'Everything in Professional',
        'Unlimited streak freezes',
        'White-label solutions',
        'API access',
        'Custom integrations',
        'Dedicated account manager',
        'SLA 99.9% uptime',
        'Advanced security features',
        'Bulk user management'
      ],
      bestFor: 'Companies & Organizations'
    }
  },

  // Investor metrics
  METRICS: {
    TARGET_MRR: 1000000, // $1M MRR
    TARGET_USERS: 5000000, // 5M users
    VIRAL_COEFFICIENT: 1.8, // Target K-factor
    CHURN_RATE: 0.03, // 3% monthly churn
    LTV: 299, // Customer lifetime value
    CAC: 89, // Customer acquisition cost
    ARPU: 19.99 // Average revenue per user
  },

  // Social proof
  PARTNERS: [
    { name: 'YC', logo: '🚀', description: 'Y Combinator W24' },
    { name: 'A16Z', logo: '🏦', description: 'Andreessen Horowitz' },
    { name: 'Sequoia', logo: '🌲', description: 'Sequoia Capital' },
    { name: 'Google', logo: '🔍', description: 'Google for Startups' },
    { name: 'Microsoft', logo: '💻', description: 'Microsoft for Startups' }
  ],

  // Press mentions
  PRESS: [
    { outlet: 'TechCrunch', headline: 'TouchGrass: The $10M SaaS Turning Memes Into Millions' },
    { outlet: 'Forbes', headline: 'How Behavioral Psychology Built A Viral SaaS Empire' },
    { outlet: 'Business Insider', headline: 'This App Uses Shame To Build Billion-Dollar Habits' },
    { outlet: 'The Wall Street Journal', headline: 'Digital Detox Meets Profit: The TouchGrass Phenomenon' },
    { outlet: 'Bloomberg', headline: 'VCs Flock To Accountability Tech - TouchGrass Leads The Pack' }
  ],

//   // Awards
//   AWARDS: [
//     { name: 'Product of the Year', year: 2024, issuer: 'Product Hunt' },
//     { name: 'Best SaaS Innovation', year: 2024, issuer: 'SaaStr' },
//     { name: 'Top 10 Startups to Watch', year: 2024, issuer: 'Forbes' },
//     { name: 'Design Excellence Award', year: 2024, issuer: 'Awwwards' }
//   ]
};

// App Configuration
export const APP_CONFIG = {
  VERSION: '2.0.0',
  BUILD_NUMBER: '2024.12.1',
  RELEASE_CHANNEL: 'production',
  
  // API endpoints
  API: {
    BASE_URL: process.env.VITE_API_URL || 'https://api.touchgrass.now',
    ENDPOINTS: {
      AUTH: '/auth',
      USERS: '/users',
      STREAKS: '/streaks',
      LEADERBOARD: '/leaderboard',
      PAYMENTS: '/payments',
      CHAT: '/chat',
      SHARE: '/share',
      ANALYTICS: '/analytics'
    },
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3
  },

  // WebSocket configuration
  WS: {
    URL: process.env.VITE_WS_URL || 'wss://ws.touchgrass.now',
    RECONNECT_DELAY: 3000,
    MAX_RECONNECT_ATTEMPTS: 10,
    PING_INTERVAL: 30000
  },

  // Feature flags
  FEATURES: {
    ENABLE_CHAT: true,
    ENABLE_CHALLENGES: true,
    ENABLE_TEAMS: true,
    ENABLE_API: false, // Coming soon
    ENABLE_WHITELABEL: false, // Enterprise only
    BETA_FEATURES: ['voice_notes', 'video_verification', 'ai_coach']
  },

  // Performance settings
  PERFORMANCE: {
    LAZY_LOAD_THRESHOLD: 300,
    IMAGE_QUALITY: 80,
    CACHE_TTL: 3600,
    DEBOUNCE_DELAY: 300,
    THROTTLE_DELAY: 100
  },

  // Analytics
  ANALYTICS: {
    GOOGLE_ANALYTICS_ID: process.env.VITE_GA_ID || 'UA-XXXXXXXXX-X',
    HOTJAR_ID: process.env.VITE_HOTJAR_ID || 'XXXXXX',
    SENTRY_DSN: process.env.VITE_SENTRY_DSN || '',
    MIXPANEL_TOKEN: process.env.VITE_MIXPANEL_TOKEN || ''
  }
};

// Achievement System
export const ACHIEVEMENTS = {
  MILESTONES: [
    { days: 7, name: 'Weekly Warrior', icon: '⚔️', rarity: 'common' },
    { days: 30, name: 'Monthly Maestro', icon: '🎻', rarity: 'uncommon' },
    { days: 100, name: 'Century Club', icon: '💯', rarity: 'rare' },
    { days: 365, name: 'Year of Discipline', icon: '🏆', rarity: 'epic' },
    { days: 1000, name: 'Legendary Status', icon: '👑', rarity: 'legendary' }
  ],
  
  SPECIAL: [
    { name: 'Early Bird', icon: '🐦', description: 'Joined in first month' },
    { name: 'Social Butterfly', icon: '🦋', description: 'Shared 10+ times' },
    { name: 'Challenge Master', icon: '🏅', description: 'Won 5 challenges' },
    { name: 'Consistency King', icon: '📈', description: '95%+ consistency' },
    { name: 'Night Owl', icon: '🦉', description: 'Verified at 3 AM' },
    { name: 'Globetrotter', icon: '🌍', description: 'Verified from 5+ countries' }
  ],

  RARITY_COLORS: {
    common: '#6B7280',
    uncommon: '#10B981',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B',
    mythical: '#EF4444'
  }
};

// Verification Methods
export const VERIFICATION_METHODS = [
  { id: 'photo', name: 'Photo Proof', icon: '📸', description: 'Upload outdoor photo' },
  { id: 'location', name: 'GPS Location', icon: '📍', description: 'Share coordinates' },
  { id: 'activity', name: 'Fitness App', icon: '🏃', description: 'Connect Apple Health/Google Fit' },
  { id: 'witness', name: 'Witness', icon: '👁️', description: 'Get verified by friend' },
  { id: 'manual', name: 'Manual Entry', icon: '✍️', description: 'For exceptional cases' }
];

// Business Hours (24h format)
export const BUSINESS_HOURS = {
  SUPPORT: { start: 9, end: 17, timezone: 'America/New_York' },
  LIVE_CHAT: { start: 8, end: 20, timezone: 'America/New_York' },
  WEEKEND_SUPPORT: { start: 10, end: 16, timezone: 'America/New_York' }
};

// Compliance & Legal
export const COMPLIANCE = {
  GDPR_COMPLIANT: true,
  CCPA_COMPLIANT: true,
  HIPAA_COMPLIANT: false,
  SOC2_CERTIFIED: true,
  PRIVACY_SHIELD: true,
  DATA_RETENTION_DAYS: 730 // 2 years
};

// CSS Classes for International Styling
export const CSS_CONSTANTS = {
  // Animation Durations
  DURATIONS: {
    FAST: '150ms',
    NORMAL: '300ms',
    SLOW: '500ms',
    VERY_SLOW: '1000ms'
  },

  // Easing Functions
  EASING: {
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
    EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
    BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },

  // Breakpoints (mobile-first)
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    XXL: '1536px'
  },

  // Z-index layers
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070
  },

  // Brand Colors
  COLORS: {
    PRIMARY: '#22C55E', // Grass Green
    PRIMARY_DARK: '#16A34A',
    PRIMARY_LIGHT: '#4ADE80',
    SECONDARY: '#FBBF24', // Premium Gold
    ACCENT: '#8B5CF6', // Royal Purple
    DANGER: '#EF4444', // Shame Red
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    INFO: '#3B82F6',
    
    // Neutrals
    DARK: '#0F172A',
    DARK_LIGHT: '#1E293B',
    GRAY: '#64748B',
    GRAY_LIGHT: '#CBD5E1',
    LIGHT: '#F8FAFC',
    
    // Gradients
    GRADIENT_PRIMARY: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
    GRADIENT_PREMIUM: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
    GRADIENT_DARK: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    GRADIENT_SHAME: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
  }
};

// CSS Animation Classes
export const ANIMATION_CLASSES = {
  // Entrance Animations
  FADE_IN: 'fade-in',
  SLIDE_IN_UP: 'slide-in-up',
  SLIDE_IN_DOWN: 'slide-in-down',
  SLIDE_IN_LEFT: 'slide-in-left',
  SLIDE_IN_RIGHT: 'slide-in-right',
  ZOOM_IN: 'zoom-in',
  BOUNCE_IN: 'bounce-in',
  
  // Exit Animations
  FADE_OUT: 'fade-out',
  SLIDE_OUT_UP: 'slide-out-up',
  SLIDE_OUT_DOWN: 'slide-out-down',
  
  // Attention Seekers
  PULSE: 'pulse',
  HEARTBEAT: 'heartbeat',
  SHAKE: 'shake',
  TADA: 'tada',
  FLASH: 'flash',
  
  // Special Effects
  GLOW: 'glow',
  FLOAT: 'float',
  SPIN: 'spin',
  ROTATE: 'rotate',
  WAVE: 'wave'
};

// Business CSS Variables
export const BUSINESS_CSS = `
/* TouchGrass Business Theme - Professional Grade */
:root {
  /* Brand Colors */
  --color-primary: ${CSS_CONSTANTS.COLORS.PRIMARY};
  --color-primary-dark: ${CSS_CONSTANTS.COLORS.PRIMARY_DARK};
  --color-primary-light: ${CSS_CONSTANTS.COLORS.PRIMARY_LIGHT};
  --color-secondary: ${CSS_CONSTANTS.COLORS.SECONDARY};
  --color-accent: ${CSS_CONSTANTS.COLORS.ACCENT};
  --color-danger: ${CSS_CONSTANTS.COLORS.DANGER};
  --color-success: ${CSS_CONSTANTS.COLORS.SUCCESS};
  --color-warning: ${CSS_CONSTANTS.COLORS.WARNING};
  --color-info: ${CSS_CONSTANTS.COLORS.INFO};
  
  /* Neutral Scale */
  --color-dark: ${CSS_CONSTANTS.COLORS.DARK};
  --color-dark-light: ${CSS_CONSTANTS.COLORS.DARK_LIGHT};
  --color-gray: ${CSS_CONSTANTS.COLORS.GRAY};
  --color-gray-light: ${CSS_CONSTANTS.COLORS.GRAY_LIGHT};
  --color-light: ${CSS_CONSTANTS.COLORS.LIGHT};
  
  /* Gradients */
  --gradient-primary: ${CSS_CONSTANTS.COLORS.GRADIENT_PRIMARY};
  --gradient-premium: ${CSS_CONSTANTS.COLORS.GRADIENT_PREMIUM};
  --gradient-dark: ${CSS_CONSTANTS.COLORS.GRADIENT_DARK};
  --gradient-shame: ${CSS_CONSTANTS.COLORS.GRADIENT_SHAME};
  
  /* Typography */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
  --font-display: 'Cal Sans', 'Inter', sans-serif;
  
  /* Spacing Scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-3xl: 2rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  
  /* Animations */
  --transition-fast: ${CSS_CONSTANTS.DURATIONS.FAST};
  --transition-normal: ${CSS_CONSTANTS.DURATIONS.NORMAL};
  --transition-slow: ${CSS_CONSTANTS.DURATIONS.SLOW};
  --transition-very-slow: ${CSS_CONSTANTS.DURATIONS.VERY_SLOW};
  
  --ease-in-out: ${CSS_CONSTANTS.EASING.EASE_IN_OUT};
  --ease-out: ${CSS_CONSTANTS.EASING.EASE_OUT};
  --ease-in: ${CSS_CONSTANTS.EASING.EASE_IN};
  --ease-bounce: ${CSS_CONSTANTS.EASING.BOUNCE};
  
  /* Z-index */
  --z-dropdown: ${CSS_CONSTANTS.Z_INDEX.DROPDOWN};
  --z-sticky: ${CSS_CONSTANTS.Z_INDEX.STICKY};
  --z-fixed: ${CSS_CONSTANTS.Z_INDEX.FIXED};
  --z-modal-backdrop: ${CSS_CONSTANTS.Z_INDEX.MODAL_BACKDROP};
  --z-modal: ${CSS_CONSTANTS.Z_INDEX.MODAL};
  --z-popover: ${CSS_CONSTANTS.Z_INDEX.POPOVER};
  --z-tooltip: ${CSS_CONSTANTS.Z_INDEX.TOOLTIP};
}

/* Business Layout */
.business-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

@media (min-width: ${CSS_CONSTANTS.BREAKPOINTS.LG}) {
  .business-container {
    padding: 0 var(--space-8);
  }
}

/* Professional Cards */
.business-card {
  background: var(--color-dark-light);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  transition: all var(--transition-normal) var(--ease-in-out);
  backdrop-filter: blur(10px);
}

.business-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-2xl);
  border-color: var(--color-primary);
}

/* Premium Badge */
.premium-badge {
  background: var(--gradient-premium);
  color: white;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  animation: premium-glow 2s ease-in-out infinite;
}

/* Shame Badge */
.shame-badge {
  background: var(--gradient-shame);
  color: white;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Achievement Badge */
.achievement-badge {
  background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
  color: white;
  width: 60px;
  height: 60px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

.achievement-badge::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to right,
    transparent 20%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 80%
  );
  transform: rotate(45deg);
  animation: shine 3s infinite;
}

/* Stats Card */
.stats-card {
  background: var(--color-dark);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.stats-card .value {
  font-size: 3rem;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.stats-card .label {
  color: var(--color-gray);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Leaderboard Row */
.leaderboard-row {
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color var(--transition-fast);
}

.leaderboard-row:hover {
  background: rgba(255, 255, 255, 0.02);
}

.leaderboard-row.rank-1 {
  background: linear-gradient(90deg, rgba(251, 191, 36, 0.1) 0%, transparent 100%);
  border-left: 3px solid var(--color-secondary);
}

.leaderboard-row.rank-2 {
  background: linear-gradient(90deg, rgba(203, 213, 225, 0.1) 0%, transparent 100%);
  border-left: 3px solid var(--color-gray-light);
}

.leaderboard-row.rank-3 {
  background: linear-gradient(90deg, rgba(180, 83, 9, 0.1) 0%, transparent 100%);
  border-left: 3px solid #b45309;
}

/* Progress Bar */
.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  transition: width 1s var(--ease-out);
  position: relative;
  overflow: hidden;
}

.progress-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-normal) var(--ease-in-out);
  border: 2px solid transparent;
  user-select: none;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(34, 197, 94, 0.3);
}

.btn-secondary {
  background: var(--gradient-premium);
  color: white;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(251, 191, 36, 0.3);
}

.btn-outline {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.btn-outline:hover {
  border-color: var(--color-primary);
  background: rgba(34, 197, 94, 0.1);
}

.btn-danger {
  background: var(--gradient-shame);
  color: white;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.3);
}

/* Input Styles */
.input-field {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  color: white;
  font-size: 0.875rem;
  transition: all var(--transition-fast);
}

.input-field:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  background: rgba(255, 255, 255, 0.08);
}

.input-field::placeholder {
  color: var(--color-gray);
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal-backdrop);
  animation: fade-in var(--transition-normal) var(--ease-out);
}

.modal-content {
  background: var(--color-dark-light);
  border-radius: var(--radius-2xl);
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slide-in-up var(--transition-normal) var(--ease-out);
  position: relative;
}

.modal-header {
  padding: var(--space-6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-body {
  padding: var(--space-6);
}

.modal-footer {
  padding: var(--space-6);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
}

/* Tooltip */
.tooltip {
  position: absolute;
  background: var(--color-dark);
  color: white;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: var(--z-tooltip);
  pointer-events: none;
  opacity: 0;
  transform: translateY(10px);
  transition: all var(--transition-fast);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tooltip::before {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid var(--color-dark);
}

.tooltip-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Toast Notifications */
.toast {
  background: var(--color-dark-light);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  box-shadow: var(--shadow-2xl);
  animation: slide-in-right var(--transition-normal) var(--ease-out);
  max-width: 400px;
}

.toast-success {
  border-left: 4px solid var(--color-success);
}

.toast-error {
  border-left: 4px solid var(--color-danger);
}

.toast-warning {
  border-left: 4px solid var(--color-warning);
}

.toast-info {
  border-left: 4px solid var(--color-info);
}

/* Loading States */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--radius-md);
}

/* Animations */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-down {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes zoom-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.1);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.1);
  }
  70% {
    transform: scale(1);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}

@keyframes tada {
  0% {
    transform: scale(1);
  }
  10%, 20% {
    transform: scale(0.9) rotate(-3deg);
  }
  30%, 50%, 70%, 90% {
    transform: scale(1.1) rotate(3deg);
  }
  40%, 60%, 80% {
    transform: scale(1.1) rotate(-3deg);
  }
  100% {
    transform: scale(1) rotate(0);
  }
}

@keyframes flash {
  0%, 50%, 100% {
    opacity: 1;
  }
  25%, 75% {
    opacity: 0.5;
  }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 10px var(--color-primary);
  }
  50% {
    box-shadow: 0 0 25px var(--color-primary);
  }
}

@keyframes premium-glow {
  0%, 100% {
    box-shadow: 0 0 10px var(--color-secondary);
  }
  50% {
    box-shadow: 0 0 25px var(--color-secondary);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes wave {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}

/* Responsive Utilities */
.responsive-grid {
  display: grid;
  gap: var(--space-6);
}

@media (min-width: ${CSS_CONSTANTS.BREAKPOINTS.SM}) {
  .responsive-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: ${CSS_CONSTANTS.BREAKPOINTS.MD}) {
  .responsive-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: ${CSS_CONSTANTS.BREAKPOINTS.LG}) {
  .responsive-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Typography Scale */
.text-display-1 {
  font-size: 4.5rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.text-display-2 {
  font-size: 3.75rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.text-display-3 {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.text-heading-1 {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.2;
}

.text-heading-2 {
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 1.3;
}

.text-heading-3 {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
}

.text-body-large {
  font-size: 1.125rem;
  line-height: 1.6;
}

.text-body {
  font-size: 1rem;
  line-height: 1.6;
}

.text-body-small {
  font-size: 0.875rem;
  line-height: 1.6;
}

.text-caption {
  font-size: 0.75rem;
  line-height: 1.4;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

/* Gradient Text */
.gradient-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-text-premium {
  background: var(--gradient-premium);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* International Text Support */
[lang="ar"], [lang="he"] {
  direction: rtl;
  text-align: right;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Print Styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  body {
    color: black !important;
    background: white !important;
  }
}
`;