// /Users/apple/Documents/touchgrass/backend/src/models/Streak.js

const mongoose = require('mongoose');

const streakSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
    unique: true
  },
  
  // Core streak data
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
  
  // Tracking
  lastVerificationDate: {
    type: Date,
    default: null
  },
  streakStartDate: {
    type: Date,
    default: null
  },
  
  // Daily verification history
  history: [{
    date: {
      type: Date,
      required: true,
      index: true
    },
    verified: {
      type: Boolean,
      default: true
    },
    verificationMethod: {
      type: String,
      enum: ['photo', 'video', 'shame', 'freeze'],
      required: true
    },
    duration: {
      type: Number,
      min: 0,
      max: 1440,
      default: 0
    },
    activityType: {
      type: String,
      default: 'outdoor'
    },
    caption: String,
    location: String,
    shameMessage: String,
    mediaUrl: String,
    verifiedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Monthly stats for calendar view
  monthlyStats: [{
    month: {
      type: String,
      required: true
    },
    year: Number,
    month_num: Number,
    verifiedDays: {
      type: Number,
      default: 0
    },
    totalDays: {
      type: Number,
      default: 0
    },
    totalDuration: {
      type: Number,
      default: 0
    },
    shameDays: {
      type: Number,
      default: 0
    }
  }],
  
  // Freeze tokens
  freezeTokens: {
    available: {
      type: Number,
      default: 3,
      min: 0
    },
    used: {
      type: Number,
      default: 0
    },
    history: [{
      date: Date,
      reason: String
    }]
  },
  
  status: {
    type: String,
    enum: ['active', 'broken', 'frozen'],
    default: 'active'
  },
  
  // Analytics
  totalVerifications: {
    type: Number,
    default: 0
  },
  totalOutdoorTime: {
    type: Number,
    default: 0
  },
  averageDuration: {
    type: Number,
    default: 0
  },
  
  milestones: [{
    days: Number,
    achievedAt: Date,
    type: {
      type: String,
      enum: ['streak', 'total_days', 'total_time']
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
streakSchema.index({ 'history.date': -1 });
streakSchema.index({ currentStreak: -1 });

// Virtual for today's verification status
streakSchema.virtual('todayVerified').get(function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.history.some(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });
});

// Virtual for verification rate (last 30 days)
streakSchema.virtual('verificationRate').get(function() {
  if (this.history.length === 0) return 0;
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentHistory = this.history.filter(h => new Date(h.date) >= thirtyDaysAgo);
  const verifiedCount = recentHistory.length;
  
  return Math.min(100, Math.round((verifiedCount / 30) * 100));
});

// Check if can verify (23-hour cooldown)
streakSchema.methods.canVerify = function() {
  if (!this.lastVerificationDate) return { canVerify: true, hoursRemaining: 0 };
  
  const now = new Date();
  const lastVerif = new Date(this.lastVerificationDate);
  const hoursSinceLastVerif = (now - lastVerif) / (1000 * 60 * 60);
  
  if (hoursSinceLastVerif < 23) {
    const hoursRemaining = Math.ceil(23 - hoursSinceLastVerif);
    return { canVerify: false, hoursRemaining };
  }
  
  return { canVerify: true, hoursRemaining: 0 };
};

// Method to verify today's activity
streakSchema.methods.verifyToday = async function(verificationData) {
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  
  // Check if already verified today
  const alreadyVerified = this.history.some(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });
  
  if (alreadyVerified) {
    throw new Error('Already verified today');
  }
  
  // Check 23-hour cooldown
  if (this.lastVerificationDate) {
    const hoursSinceLastVerif = (now - this.lastVerificationDate) / (1000 * 60 * 60);
    if (hoursSinceLastVerif < 23) {
      const hoursRemaining = Math.ceil(23 - hoursSinceLastVerif);
      throw new Error(`Please wait ${hoursRemaining} hours before verifying again`);
    }
  }
  
  // Create verification entry
  const verificationEntry = {
    date: today,
    verified: true,
    verificationMethod: verificationData.method,
    duration: verificationData.duration || 0,
    activityType: verificationData.activity || 'outdoor',
    caption: verificationData.caption || '',
    location: verificationData.location || '',
    shameMessage: verificationData.shameMessage || '',
    mediaUrl: verificationData.mediaUrl || '',
    verifiedAt: now
  };
  
  // Add to history
  if (!this.history) this.history = [];
  this.history.push(verificationEntry);
  
  // Calculate if this is a consecutive day
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Check if last verification was yesterday
  const lastVerificationDay = this.lastVerificationDate ? new Date(this.lastVerificationDate) : null;
  if (lastVerificationDay) {
    lastVerificationDay.setHours(0, 0, 0, 0);
  }
  
  if (!lastVerificationDay) {
    // First verification ever
    this.currentStreak = 1;
    this.streakStartDate = today;
  } else if (lastVerificationDay.getTime() === yesterday.getTime()) {
    // Verified yesterday - streak continues
    this.currentStreak += 1;
  } else if (lastVerificationDay.getTime() < yesterday.getTime()) {
    // Missed a day - streak broken, start new streak
    this.currentStreak = 1;
    this.streakStartDate = today;
  }
  
  // Update longest streak
  if (this.currentStreak > this.longestStreak) {
    this.longestStreak = this.currentStreak;
  }
  
  // Update last verification date (store actual time, not just date)
  this.lastVerificationDate = now;
  
  // Update totals
  this.totalVerifications = (this.totalVerifications || 0) + 1;
  this.totalOutdoorTime = (this.totalOutdoorTime || 0) + (verificationData.duration || 0);
  
  // Update average duration
  if (this.totalVerifications > 0) {
    this.averageDuration = Math.round(this.totalOutdoorTime / this.totalVerifications);
  }
  
  this.status = 'active';
  
  // Update monthly stats
  await this.updateMonthlyStats(today, verificationEntry);
  
  // Check milestones
  await this.checkMilestones();
  
  return this.save();
};

// Method to use freeze token
streakSchema.methods.useFreezeToken = async function(reason = 'Skipped day') {
  if (this.freezeTokens.available <= 0) {
    throw new Error('No freeze tokens available');
  }
  
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  
  // Add freeze entry to history
  this.history.push({
    date: today,
    verified: false,
    verificationMethod: 'freeze',
    notes: `Freeze token used: ${reason}`,
    verifiedAt: now
  });
  
  // Update token counts
  this.freezeTokens.available -= 1;
  this.freezeTokens.used += 1;
  this.freezeTokens.history.push({
    date: now,
    reason
  });
  
  // Update last verification date (so cooldown applies)
  this.lastVerificationDate = now;
  
  // Streak continues without incrementing
  this.status = 'frozen';
  
  // Update monthly stats
  await this.updateMonthlyStats(today, { verified: false });
  
  return this.save();
};

// Method to update monthly statistics
streakSchema.methods.updateMonthlyStats = async function(date, entry) {
  const month = date.toISOString().slice(0, 7);
  const year = date.getFullYear();
  const month_num = date.getMonth() + 1;
  
  let monthStat = this.monthlyStats.find(stat => stat.month === month);
  
  if (!monthStat) {
    monthStat = {
      month,
      year,
      month_num,
      verifiedDays: 0,
      totalDays: 0,
      totalDuration: 0,
      shameDays: 0
    };
    this.monthlyStats.push(monthStat);
  }
  
  monthStat.totalDays += 1;
  
  if (entry.verified) {
    monthStat.verifiedDays += 1;
    monthStat.totalDuration += entry.duration || 0;
    
    if (entry.verificationMethod === 'shame') {
      monthStat.shameDays += 1;
    }
  }
  
  // Keep only last 12 months
  this.monthlyStats.sort((a, b) => b.month.localeCompare(a.month));
  if (this.monthlyStats.length > 12) {
    this.monthlyStats = this.monthlyStats.slice(0, 12);
  }
};

// Method to check for milestones
streakSchema.methods.checkMilestones = async function() {
  const streakMilestones = [7, 30, 100, 365];
  const totalDaysMilestones = [50, 250, 500, 1000];
  
  if (!this.milestones) this.milestones = [];
  
  // Check streak milestones
  for (const days of streakMilestones) {
    if (this.currentStreak >= days && !this.milestones.some(m => m.days === days && m.type === 'streak')) {
      this.milestones.push({
        days,
        achievedAt: new Date(),
        type: 'streak'
      });
    }
  }
  
  // Check total days milestones
  for (const days of totalDaysMilestones) {
    if (this.totalVerifications >= days && !this.milestones.some(m => m.days === days && m.type === 'total_days')) {
      this.milestones.push({
        days,
        achievedAt: new Date(),
        type: 'total_days'
      });
    }
  }
};

// Method to check if streak is broken (no verification for 48 hours)
streakSchema.methods.checkStreakStatus = function() {
  if (!this.lastVerificationDate || this.status === 'broken') return;
  
  const now = new Date();
  const lastVerif = new Date(this.lastVerificationDate);
  const hoursSinceLastVerif = (now - lastVerif) / (1000 * 60 * 60);
  
  if (hoursSinceLastVerif > 48) {
    this.status = 'broken';
    this.currentStreak = 0; // Reset streak when broken
  }
};

// Method to get streak stats
streakSchema.methods.getStats = function() {
  return {
    currentStreak: this.currentStreak || 0,
    longestStreak: this.longestStreak || 0,
    totalDays: this.totalVerifications || 0,
    totalOutdoorTime: this.totalOutdoorTime || 0,
    averageDuration: this.averageDuration || 0,
    verificationRate: this.verificationRate || 0,
    todayVerified: this.todayVerified || false,
    freezeTokens: this.freezeTokens?.available || 0,
    milestones: this.milestones || [],
    monthlyStats: this.monthlyStats || []
  };
};

// Method to get calendar data
streakSchema.methods.getCalendarData = function(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  
  const calendar = [];
  
  // Empty days before the first day of month
  for (let i = 0; i < firstDay; i++) {
    calendar.push({ day: null, data: null });
  }
  
  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const entry = this.history?.find(h => {
      const entryDate = new Date(h.date);
      return entryDate.toISOString().split('T')[0] === dateStr;
    });
    
    calendar.push({
      day: d,
      date: dateStr,
      data: entry ? {
        verified: entry.verified,
        method: entry.verificationMethod,
        duration: entry.duration,
        activity: entry.activityType
      } : null
    });
  }
  
  // Calculate stats for this month
  const monthStat = this.monthlyStats?.find(stat => 
    stat.year === year && stat.month_num === month
  );
  
  return {
    calendar,
    stats: {
      verifiedDays: monthStat?.verifiedDays || 0,
      totalDays: daysInMonth,
      totalDuration: monthStat?.totalDuration || 0,
      shameDays: monthStat?.shameDays || 0
    }
  };
};

// Pre-save middleware
streakSchema.pre('save', function(next) {
  this.checkStreakStatus();
  next();
});

module.exports = mongoose.model('Streak', streakSchema);