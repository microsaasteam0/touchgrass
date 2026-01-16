// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: [true, 'Username is required'],
//     unique: true,
//     trim: true,
//     minlength: [3, 'Username must be at least 3 characters'],
//     maxlength: [30, 'Username cannot exceed 30 characters'],
//     lowercase: true,
//     match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores']
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     lowercase: true,
//     trim: true,
//     match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//     minlength: [8, 'Password must be at least 8 characters'],
//     select: false
//   },
//   displayName: {
//     type: String,
//     required: [true, 'Display name is required'],
//     trim: true,
//     maxlength: [50, 'Display name cannot exceed 50 characters']
//   },
//   avatar: {
//     type: String,
//     default: ''
//   },
//   bio: {
//     type: String,
//     maxlength: [200, 'Bio cannot exceed 200 characters'],
//     default: ''
//   },
//   location: {
//     city: String,
//     country: String,
//     timezone: String,
//     coordinates: {
//       type: { type: String, enum: ['Point'], default: 'Point' },
//       coordinates: { type: [Number], default: [0, 0] }
//     }
//   },
//   preferences: {
//     publicProfile: { type: Boolean, default: true },
//     showOnLeaderboard: { type: Boolean, default: true },
//     emailNotifications: { type: Boolean, default: true },
//     pushNotifications: { type: Boolean, default: true },
//     showShameDays: { type: Boolean, default: true },
//     theme: { type: String, enum: ['dark', 'light', 'auto'], default: 'dark' },
//     language: { type: String, default: 'en' }
//   },
//   stats: {
//     totalDays: { type: Number, default: 0 },
//     currentStreak: { type: Number, default: 0 },
//     longestStreak: { type: Number, default: 0 },
//     totalOutdoorTime: { type: Number, default: 0 }, // in minutes
//     consistencyScore: { type: Number, default: 0, min: 0, max: 100 },
//     averageDailyTime: { type: Number, default: 0 },
//     shameCount: { type: Number, default: 0 },
//     verificationCount: { type: Number, default: 0 },
//     shareCount: { type: Number, default: 0 },
//     challengeWins: { type: Number, default: 0 },
//     challengeLosses: { type: Number, default: 0 }
//   },
//   subscription: {
//     active: { type: Boolean, default: false },
//     plan: { 
//       type: String, 
//       enum: ['free', 'basic', 'premium', 'elite'], 
//       default: 'free' 
//     },
//     currentPeriodStart: Date,
//     currentPeriodEnd: Date,
//     stripeCustomerId: String,
//     stripeSubscriptionId: String,
//     autoRenew: { type: Boolean, default: true },
//     features: {
//       streakFreezeTokens: { type: Number, default: 0 },
//       customThemes: { type: Boolean, default: false },
//       advancedAnalytics: { type: Boolean, default: false },
//       prioritySupport: { type: Boolean, default: false },
//       adFree: { type: Boolean, default: false }
//     }
//   },
//   social: {
//     twitter: String,
//     instagram: String,
//     linkedin: String,
//     website: String
//   },
//   achievements: [{
//     achievementId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Achievement'
//     },
//     earnedAt: Date,
//     progress: { type: Number, default: 0 },
//     isUnlocked: { type: Boolean, default: false }
//   }],
//   badges: [{
//     type: String,
//     enum: ['early_adopter', 'social_butterfly', 'streak_master', 'challenge_king', 'verified']
//   }],
//   isVerified: {
//     type: Boolean,
//     default: false
//   },
//   verificationToken: String,
//   verificationTokenExpires: Date,
//   resetPasswordToken: String,
//   resetPasswordExpires: Date,
//   lastActive: {
//     type: Date,
//     default: Date.now
//   },
//   deletedAt: Date,
//   isDeleted: {
//     type: Boolean,
//     default: false
//   }
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Indexes
// userSchema.index({ username: 1 });
// userSchema.index({ email: 1 });
// userSchema.index({ 'location.city': 1 });
// userSchema.index({ 'location.coordinates': '2dsphere' });
// userSchema.index({ 'stats.currentStreak': -1 });
// userSchema.index({ 'stats.consistencyScore': -1 });
// userSchema.index({ 'subscription.plan': 1 });
// userSchema.index({ lastActive: -1 });
// userSchema.index({ isDeleted: 1 });

// // Virtual for streak status
// userSchema.virtual('streakStatus').get(function() {
//   const now = new Date();
//   const yesterday = new Date(now);
//   yesterday.setDate(yesterday.getDate() - 1);
  
//   if (this.lastActive < yesterday) {
//     return 'broken';
//   } else if (this.lastActive.toDateString() === now.toDateString()) {
//     return 'verified';
//   } else {
//     return 'pending';
//   }
// });

// // Virtual for subscription status
// userSchema.virtual('subscriptionStatus').get(function() {
//   if (!this.subscription.active) return 'inactive';
  
//   if (this.subscription.currentPeriodEnd < new Date()) {
//     return 'expired';
//   }
  
//   return 'active';
// });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
  
//   try {
//     const salt = await bcrypt.genSalt(12);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // Method to compare password
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// // Method to update last active
// userSchema.methods.updateLastActive = function() {
//   this.lastActive = new Date();
//   return this.save();
// };

// // Method to add achievement
// userSchema.methods.addAchievement = async function(achievementId) {
//   const existing = this.achievements.find(a => 
//     a.achievementId.toString() === achievementId.toString()
//   );
  
//   if (!existing) {
//     this.achievements.push({
//       achievementId,
//       earnedAt: new Date(),
//       isUnlocked: true
//     });
//     return this.save();
//   }
  
//   return this;
// };

// // Method to update stats
// userSchema.methods.updateStats = function(field, value) {
//   if (this.stats[field] !== undefined) {
//     this.stats[field] += value;
//   }
//   return this.save();
// };

// // Method to check if user has active subscription
// userSchema.methods.hasActiveSubscription = function() {
//   return this.subscription.active && 
//          this.subscription.currentPeriodEnd > new Date();
// };

// // Method to check if user has feature
// userSchema.methods.hasFeature = function(feature) {
//   if (!this.hasActiveSubscription()) return false;
//   return this.subscription.features[feature] || false;
// };

// // Method to get streak freeze tokens
// userSchema.methods.getFreezeTokens = function() {
//   if (this.subscription.plan === 'free') return 0;
//   if (this.subscription.plan === 'basic') return 1;
//   if (this.subscription.plan === 'premium') return 3;
//   if (this.subscription.plan === 'elite') return 10;
//   return 0;
// };

// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Registration Info
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/ // Only letters, numbers, underscores
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Email validation
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false // Don't return password in queries
  },
  
  // Profile Info (set during registration)
  displayName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: 30
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 30
  },
  
  // Avatar System
  avatar: {
    type: String,
    default: function() {
      // Generate avatar based on username
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.username}&backgroundColor=b6e3f4,c0aede,d1d4f9`
    }
  },
  customAvatar: {
    type: String,
    default: ''
  },
  
  // Bio & Personal Info
  bio: {
    type: String,
    maxlength: 250,
    default: ''
  },
  website: {
    type: String,
    maxlength: 100,
    default: ''
  },
  occupation: {
    type: String,
    maxlength: 50,
    default: ''
  },
  
  // Location (optional)
  location: {
    country: String,
    city: String,
    timezone: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  // Privacy & Preferences
  preferences: {
    profileVisibility: {
      type: String,
      enum: ['public', 'private', 'friends_only'],
      default: 'public'
    },
    showOnLeaderboard: {
      type: Boolean,
      default: true
    },
    notifications: {
      streakReminder: { type: Boolean, default: true },
      leaderboardUpdates: { type: Boolean, default: true },
      challengeInvites: { type: Boolean, default: true },
      marketingEmails: { type: Boolean, default: false }
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false
    }
  },
  
  // Real Statistics (Calculated from actual streak data)
  stats: {
    currentStreak: {
      type: Number,
      default: 0,
      min: 0
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: 0
    },
    totalDays: {
      type: Number,
      default: 0,
      min: 0
    },
    totalOutdoorTime: { // in minutes
      type: Number,
      default: 0,
      min: 0
    },
    averageDailyTime: { // in minutes (calculated)
      type: Number,
      default: 0,
      min: 0
    },
    consistencyScore: { // percentage (0-100)
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    shameDays: {
      type: Number,
      default: 0,
      min: 0
    },
    challengesWon: {
      type: Number,
      default: 0,
      min: 0
    },
    challengesParticipated: {
      type: Number,
      default: 0,
      min: 0
    },
    sharesCount: {
      type: Number,
      default: 0,
      min: 0
    },
    referralCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  // Financial Stats (for monetization)
  revenue: {
    totalSpent: {
      type: Number,
      default: 0,
      min: 0
    },
    streakRestorations: {
      type: Number,
      default: 0,
      min: 0
    },
    subscriptionMonths: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  // Achievements & Badges
  achievements: [{
    id: String,
    name: String,
    description: String,
    icon: String,
    earnedAt: Date,
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary']
    },
    progress: {
      current: Number,
      required: Number
    }
  }],
  
  // Referral System
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Status & Activity
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'deleted'],
    default: 'active'
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  lastVerification: Date,
  
  // Analytics Tracking
  analytics: {
    firstLogin: Date,
    totalLogins: { type: Number, default: 1 },
    sessions: [{
      date: Date,
      duration: Number, // in minutes
      actions: Number
    }],
    deviceInfo: {
      type: String,
      default: ''
    },
    ipAddress: {
      type: String,
      default: ''
    }
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ 'stats.currentStreak': -1 });
userSchema.index({ 'stats.consistencyScore': -1 });
userSchema.index({ 'location.city': 1 });
userSchema.index({ 'location.country': 1 });
userSchema.index({ referralCode: 1 });
userSchema.index({ lastActive: -1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.displayName;
});

// Virtual for join date formatted
userSchema.virtual('joinDateFormatted').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
});

// Virtual for streak start date (calculated from streaks collection)
userSchema.virtual('streakStartDate', {
  ref: 'Streak',
  localField: '_id',
  foreignField: 'userId',
  justOne: true,
  options: { 
    sort: { 'history.date': 1 },
    limit: 1 
  }
});

// Pre-save middleware
userSchema.pre('save', async function(next) {
  // Hash password if modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  
  // Update updatedAt timestamp
  this.updatedAt = new Date();
  
  // Generate referral code if not exists
  if (!this.referralCode) {
    this.referralCode = this.generateReferralCode();
  }
  
  // Calculate average daily time
  if (this.stats.totalDays > 0 && this.stats.totalOutdoorTime > 0) {
    this.stats.averageDailyTime = Math.round(this.stats.totalOutdoorTime / this.stats.totalDays);
  }
  
  // Calculate consistency score
  if (this.stats.totalDays > 0) {
    const consistency = (this.stats.longestStreak / this.stats.totalDays) * 100;
    this.stats.consistencyScore = Math.min(100, Math.round(consistency * 10) / 10);
  }
  
  next();
});

// Methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateReferralCode = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TG-${code}`;
};

userSchema.methods.updateStreakStats = function(verified, duration = 0) {
  if (verified) {
    this.stats.currentStreak += 1;
    this.stats.totalDays += 1;
    this.stats.totalOutdoorTime += duration;
    
    // Update longest streak if current is longer
    if (this.stats.currentStreak > this.stats.longestStreak) {
      this.stats.longestStreak = this.stats.currentStreak;
    }
  } else {
    // Streak broken
    this.stats.currentStreak = 0;
    this.stats.shameDays += 1;
  }
  
  // Update average and consistency
  if (this.stats.totalDays > 0) {
    this.stats.averageDailyTime = Math.round(this.stats.totalOutdoorTime / this.stats.totalDays);
    const consistency = (this.stats.longestStreak / this.stats.totalDays) * 100;
    this.stats.consistencyScore = Math.min(100, Math.round(consistency * 10) / 10);
  }
  
  this.lastVerification = new Date();
  this.lastActive = new Date();
  
  return this.save();
};

userSchema.methods.getRank = async function() {
  const User = this.constructor;
  const count = await User.countDocuments({
    'stats.currentStreak': { $gt: this.stats.currentStreak },
    'preferences.showOnLeaderboard': true
  });
  return count + 1;
};

userSchema.methods.getPercentile = async function() {
  const User = this.constructor;
  const total = await User.countDocuments({ 'preferences.showOnLeaderboard': true });
  const rank = await this.getRank();
  return Math.round(((total - rank) / total) * 100);
};

userSchema.methods.toProfileJSON = function(viewerId = null) {
  const isSelf = viewerId && viewerId.toString() === this._id.toString();
  const isPublic = this.preferences.profileVisibility === 'public';
  const canView = isSelf || isPublic;
  
  return {
    id: this._id,
    username: this.username,
    displayName: this.displayName,
    fullName: this.fullName,
    avatar: this.customAvatar || this.avatar,
    bio: canView ? this.bio : '',
    location: canView ? this.location : {},
    joinDate: this.createdAt,
    joinDateFormatted: this.joinDateFormatted,
    
    // Public stats (always visible)
    stats: {
      currentStreak: this.stats.currentStreak,
      longestStreak: this.stats.longestStreak,
      totalDays: this.stats.totalDays,
      consistencyScore: this.stats.consistencyScore,
      averageDailyTime: this.stats.averageDailyTime,
      challengesWon: this.stats.challengesWon,
      sharesCount: this.stats.sharesCount
    },
    
    // Private stats (only visible to self)
    privateStats: isSelf ? {
      shameDays: this.stats.shameDays,
      totalOutdoorTime: this.stats.totalOutdoorTime,
      challengesParticipated: this.stats.challengesParticipated,
      referralCount: this.stats.referralCount,
      revenue: this.revenue
    } : undefined,
    
    // Achievements (always visible)
    achievements: this.achievements.map(ach => ({
      name: ach.name,
      icon: ach.icon,
      earnedAt: ach.earnedAt,
      rarity: ach.rarity
    })),
    
    // Status
    lastActive: this.lastActive,
    todayVerified: this.lastVerification 
      ? this.lastVerification.toDateString() === new Date().toDateString()
      : false,
    
    // Permissions
    canEdit: isSelf,
    canMessage: canView && !isSelf
  };
};

module.exports = mongoose.model('User', userSchema);