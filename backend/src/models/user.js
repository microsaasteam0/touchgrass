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
    match: /^[a-zA-Z0-9_]+$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },

  // Profile Info
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

  // Avatar
  avatar: {
    type: String,
    default: function () {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.username}`;
    }
  },
  customAvatar: {
    type: String,
    default: ''
  },

  // Bio
  bio: { type: String, maxlength: 250, default: '' },
  website: { type: String, maxlength: 100, default: '' },
  occupation: { type: String, maxlength: 50, default: '' },

  // Location
  location: {
    country: String,
    city: String,
    timezone: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  // Preferences
  preferences: {
    profileVisibility: {
      type: String,
      enum: ['public', 'private', 'friends_only'],
      default: 'public'
    },
    showOnLeaderboard: { type: Boolean, default: true },
    notifications: {
      streakReminder: { type: Boolean, default: true },
      leaderboardUpdates: { type: Boolean, default: true },
      challengeInvites: { type: Boolean, default: true },
      marketingEmails: { type: Boolean, default: false }
    },
    emailVerified: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false }
  },

  // Stats
  stats: {
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    totalDays: { type: Number, default: 0 },
    totalOutdoorTime: { type: Number, default: 0 },
    averageDailyTime: { type: Number, default: 0 },
    consistencyScore: { type: Number, default: 0 },
    shameDays: { type: Number, default: 0 },
    challengesWon: { type: Number, default: 0 },
    challengesParticipated: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    referralCount: { type: Number, default: 0 }
  },

  // Revenue
  revenue: {
    totalSpent: { type: Number, default: 0 },
    streakRestorations: { type: Number, default: 0 },
    subscriptionMonths: { type: Number, default: 0 }
  },

  // ✅ SUBSCRIPTION (NEW)
  subscription: {
    status: {
      type: String,
      enum: ['free', 'trial', 'active', 'expired'],
      default: 'free'
    },
    plan: { type: String, default: 'free' },
    provider: { type: String, default: 'stripe' },
    providerCustomerId: { type: String, default: null },
    providerSubscriptionId: { type: String, default: null },
    currentPeriodEnd: Date
  },

  // Achievements
  achievements: [{
    id: String,
    name: String,
    description: String,
    icon: String,
    earnedAt: Date,
    rarity: { type: String }
  }],

  // Referral
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Status & Activity
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'deleted'],
    default: 'active'
  },
  lastActive: { type: Date, default: Date.now },
  lastVerification: Date,

  // ✅ STREAK SOURCE OF TRUTH (NEW)
  lastTouchDate: {
    type: Date,
    default: null,
    index: true
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ 'stats.currentStreak': -1 });
userSchema.index({ lastTouchDate: -1 });

// Virtuals
userSchema.virtual('fullName').get(function () {
  return this.firstName && this.lastName
    ? `${this.firstName} ${this.lastName}`
    : this.displayName;
});

// Pre-save
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  if (!this.referralCode) {
    this.referralCode = this.generateReferralCode();
  }

  next();
});

// Methods
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.generateReferralCode = function () {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `TG-${code}`;
};

// ✅ FIXED STREAK LOGIC (DATE-BASED)
userSchema.methods.updateStreakStats = function (duration = 0) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const last = this.lastTouchDate
    ? new Date(this.lastTouchDate).setHours(0, 0, 0, 0)
    : null;

  if (!last) {
    this.stats.currentStreak = 1;
    this.stats.totalDays += 1;
  } else {
    const diff = (today - last) / (1000 * 60 * 60 * 24);

    if (diff === 0) return this;

    if (diff === 1) {
      this.stats.currentStreak += 1;
      this.stats.totalDays += 1;
    } else {
      this.stats.currentStreak = 1;
      this.stats.totalDays += 1;
      this.stats.shameDays += 1;
    }
  }

  this.lastTouchDate = today;
  this.lastVerification = new Date();
  this.lastActive = new Date();

  this.stats.totalOutdoorTime += duration;

  if (this.stats.currentStreak > this.stats.longestStreak) {
    this.stats.longestStreak = this.stats.currentStreak;
  }

  this.stats.averageDailyTime = Math.round(
    this.stats.totalOutdoorTime / this.stats.totalDays
  );

  this.stats.consistencyScore = Math.min(
    100,
    Math.round((this.stats.longestStreak / this.stats.totalDays) * 1000) / 10
  );

  return this.save();
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
