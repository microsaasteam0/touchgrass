const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['streak', 'points', 'milestone'], default: 'streak' },
  category: { type: String, default: 'daily' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['draft', 'upcoming', 'active', 'completed', 'archived'], default: 'draft' },
  
  settings: {
    duration: {
      value: { type: Number, default: 30 },
      unit: { type: String, default: 'days' }
    },
    entryFee: { type: Number, default: 0 },
    prizePool: { type: Number, default: 0 },
    maxParticipants: { type: Number, default: 0 },
    minParticipants: { type: Number, default: 1 },
    visibility: { type: String, enum: ['public', 'private', 'invite-only'], default: 'public' },
    verificationRequired: { type: Boolean, default: true },
    allowShameDays: { type: Boolean, default: true },
    strictMode: { type: Boolean, default: false }
  },
  
  rules: {
    targetStreak: { type: Number },
    targetDuration: { type: Number }, // minutes
    targetConsistency: { type: Number }, // percentage
    minDailyTime: { type: Number },
    allowedVerificationMethods: [{ type: String }],
    shamePenalty: { type: Number, default: 0 },
    freezeAllowed: { type: Boolean, default: true },
    skipAllowed: { type: Boolean, default: false }
  },
  
  schedule: {
    startDate: { type: Date },
    endDate: { type: Date },
    checkInTime: { type: String }, // HH:MM format
    timezone: { type: String, default: 'UTC' }
  },
  
  stats: {
    totalEntries: { type: Number, default: 0 },
    activeParticipants: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    totalPrizePool: { type: Number, default: 0 }
  },
  
  metadata: {
    isBuiltIn: { type: Boolean, default: false },
    challengeCode: { type: String },
    tags: [{ type: String }],
    icon: { type: String, default: '🎯' },
    bannerImage: { type: String },
    themeColor: { type: String },
    featured: { type: Boolean, default: false },
    customRules: { type: String }
  },
  
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['active', 'completed', 'withdrawn'] },
    score: { type: Number, default: 0 },
    progress: {
      current: { type: Number, default: 0 },
      target: { type: Number }
    },
    joinedAt: { type: Date, default: Date.now }
  }],
  
  leaderboard: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rank: Number,
    score: Number,
    updatedAt: Date
  }],
  
  winners: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rank: Number,
    prize: Number,
    awardedAt: Date
  }],
  
  notifications: {
    startReminderSent: { type: Boolean, default: false },
    dailyReminderSent: { type: Boolean, default: false },
    endReminderSent: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Indexes for performance
challengeSchema.index({ status: 1, 'settings.visibility': 1 });
challengeSchema.index({ 'stats.totalEntries': -1 });
challengeSchema.index({ category: 1, difficulty: 1 });
challengeSchema.index({ 'metadata.isBuiltIn': 1 });

// Calculate target based on challenge type
challengeSchema.methods.calculateTarget = function() {
  if (this.type === 'streak') {
    return this.settings.duration.value;
  }
  return 100; // default for percentage-based challenges
};

module.exports = mongoose.model('Challenge', challengeSchema);