const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['streak', 'duration', 'consistency', 'social', 'custom'],
    required: true
  },
  category: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'special', 'team'],
    default: 'daily'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'failed', 'withdrawn'],
      default: 'active'
    },
    score: {
      type: Number,
      default: 0
    },
    progress: {
      current: { type: Number, default: 0 },
      target: { type: Number, default: 0 }
    },
    lastUpdated: Date
  }],
  settings: {
    duration: {
      value: { type: Number, required: true },
      unit: { type: String, enum: ['days', 'weeks', 'months'], default: 'days' }
    },
    entryFee: {
      type: Number,
      default: 0,
      min: 0
    },
    prizePool: {
      type: Number,
      default: 0
    },
    maxParticipants: {
      type: Number,
      default: 0 // 0 = unlimited
    },
    minParticipants: {
      type: Number,
      default: 2
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'invite-only'],
      default: 'public'
    },
    verificationRequired: {
      type: Boolean,
      default: true
    },
    allowShameDays: {
      type: Boolean,
      default: false
    },
    strictMode: {
      type: Boolean,
      default: false
    }
  },
  rules: {
    targetStreak: Number,
    targetDuration: Number, // in minutes per day
    targetConsistency: Number, // percentage
    minDailyTime: Number,
    allowedVerificationMethods: [String],
    shamePenalty: Number,
    freezeAllowed: Boolean,
    skipAllowed: Boolean
  },
  schedule: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    checkInTime: String, // Daily check-in time
    timezone: String
  },
  status: {
    type: String,
    enum: ['draft', 'upcoming', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  },
  leaderboard: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rank: Number,
    score: Number,
    streak: Number,
    consistency: Number,
    lastVerified: Date
  }],
  winners: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    position: Number,
    prize: Number,
    awardedAt: Date
  }],
  payments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }],
  stats: {
    totalEntries: { type: Number, default: 0 },
    activeParticipants: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    totalPrizePool: { type: Number, default: 0 }
  },
  metadata: {
    challengeCode: String, // For invite links
    tags: [String],
    bannerImage: String,
    themeColor: String,
    customRules: String
  },
  notifications: {
    startReminderSent: Boolean,
    dailyReminderSent: Boolean,
    endReminderSent: Boolean
  }
}, {
  timestamps: true
});

// Indexes
challengeSchema.index({ creator: 1 });
challengeSchema.index({ status: 1 });
challengeSchema.index({ 'schedule.startDate': 1 });
challengeSchema.index({ 'schedule.endDate': 1 });
challengeSchema.index({ type: 1, category: 1 });
challengeSchema.index({ 'settings.visibility': 1 });
challengeSchema.index({ 'metadata.challengeCode': 1 });
challengeSchema.index({ 'participants.user': 1 });

// Virtual for time remaining
challengeSchema.virtual('timeRemaining').get(function() {
  if (this.status !== 'active') return 0;
  
  const now = new Date();
  const end = new Date(this.schedule.endDate);
  
  if (now > end) return 0;
  
  return Math.ceil((end - now) / (1000 * 60 * 60 * 24)); // days
});

// Virtual for participant count
challengeSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

// Virtual for active participant count
challengeSchema.virtual('activeParticipantCount').get(function() {
  return this.participants.filter(p => p.status === 'active').length;
});

// Method to join challenge
challengeSchema.methods.joinChallenge = async function(userId, paymentData = null) {
  // Check if challenge is joinable
  if (this.status !== 'upcoming' && this.status !== 'active') {
    throw new Error('Challenge is not joinable');
  }
  
  // Check max participants
  if (this.settings.maxParticipants > 0 && 
      this.participants.length >= this.settings.maxParticipants) {
    throw new Error('Challenge is full');
  }
  
  // Check if already joined
  const alreadyJoined = this.participants.some(p => 
    p.user.toString() === userId.toString()
  );
  
  if (alreadyJoined) {
    throw new Error('Already joined this challenge');
  }
  
  // Check entry fee
  if (this.settings.entryFee > 0) {
    if (!paymentData || paymentData.amount < this.settings.entryFee) {
      throw new Error('Entry fee required');
    }
    
    // Create payment record
    const Payment = mongoose.model('Payment');
    const payment = new Payment({
      userId,
      amount: this.settings.entryFee,
      type: 'challenge_entry',
      status: 'completed',
      metadata: {
        challengeId: this._id,
        description: `Entry fee for challenge: ${this.name}`
      }
    });
    
    await payment.save();
    this.payments.push(payment._id);
    
    // Update prize pool
    this.settings.prizePool += this.settings.entryFee;
  }
  
  // Add participant
  this.participants.push({
    user: userId,
    status: 'active',
    score: 0,
    progress: {
      current: 0,
      target: this.calculateTarget()
    }
  });
  
  this.stats.totalEntries += 1;
  this.stats.activeParticipants += 1;
  
  return this.save();
};

// Method to leave challenge
challengeSchema.methods.leaveChallenge = function(userId, reason = 'withdrawn') {
  const participant = this.participants.find(p => 
    p.user.toString() === userId.toString()
  );
  
  if (!participant) {
    throw new Error('Not a participant');
  }
  
  participant.status = reason;
  this.stats.activeParticipants -= 1;
  
  return this.save();
};

// Method to update participant score
challengeSchema.methods.updateScore = async function(userId, scoreData) {
  const participant = this.participants.find(p => 
    p.user.toString() === userId.toString()
  );
  
  if (!participant) {
    throw new Error('Not a participant');
  }
  
  if (participant.status !== 'active') {
    throw new Error('Participant is not active');
  }
  
  // Update score based on challenge type
  switch (this.type) {
    case 'streak':
      participant.score = scoreData.streakDays || 0;
      participant.progress.current = scoreData.streakDays || 0;
      break;
    case 'duration':
      participant.score = scoreData.totalMinutes || 0;
      participant.progress.current = scoreData.totalMinutes || 0;
      break;
    case 'consistency':
      participant.score = scoreData.consistency || 0;
      participant.progress.current = scoreData.consistency || 0;
      break;
    default:
      participant.score = scoreData.score || 0;
  }
  
  participant.lastUpdated = new Date();
  
  // Update leaderboard
  await this.updateLeaderboard();
  
  return this.save();
};

// Method to update leaderboard
challengeSchema.methods.updateLeaderboard = async function() {
  const activeParticipants = this.participants
    .filter(p => p.status === 'active')
    .sort((a, b) => b.score - a.score);
  
  this.leaderboard = activeParticipants.map((participant, index) => ({
    user: participant.user,
    rank: index + 1,
    score: participant.score,
    streak: participant.progress.current,
    consistency: participant.score, // For consistency challenges
    lastUpdated: participant.lastUpdated
  }));
  
  return this.save();
};

// Method to calculate target based on challenge type
challengeSchema.methods.calculateTarget = function() {
  switch (this.type) {
    case 'streak':
      return this.rules.targetStreak || this.settings.duration.value;
    case 'duration':
      return this.rules.targetDuration || 60; // 60 minutes default
    case 'consistency':
      return this.rules.targetConsistency || 90; // 90% default
    default:
      return 100;
  }
};

// Method to start challenge
challengeSchema.methods.startChallenge = function() {
  if (this.status !== 'upcoming') {
    throw new Error('Challenge can only be started from upcoming status');
  }
  
  if (this.participants.length < this.settings.minParticipants) {
    throw new Error(`Need at least ${this.settings.minParticipants} participants`);
  }
  
  this.status = 'active';
  this.schedule.startDate = new Date();
  
  // Calculate end date based on duration
  const endDate = new Date(this.schedule.startDate);
  if (this.settings.duration.unit === 'days') {
    endDate.setDate(endDate.getDate() + this.settings.duration.value);
  } else if (this.settings.duration.unit === 'weeks') {
    endDate.setDate(endDate.getDate() + (this.settings.duration.value * 7));
  } else if (this.settings.duration.unit === 'months') {
    endDate.setMonth(endDate.getMonth() + this.settings.duration.value);
  }
  
  this.schedule.endDate = endDate;
  
  return this.save();
};

// Method to end challenge and distribute prizes
challengeSchema.methods.endChallenge = async function() {
  if (this.status !== 'active') {
    throw new Error('Challenge is not active');
  }
  
  this.status = 'completed';
  
  // Update participant statuses
  this.participants.forEach(participant => {
    if (participant.status === 'active') {
      const target = this.calculateTarget();
      if (participant.progress.current >= target) {
        participant.status = 'completed';
      } else {
        participant.status = 'failed';
      }
    }
  });
  
  // Calculate winners if there's a prize pool
  if (this.settings.prizePool > 0 && this.leaderboard.length > 0) {
    const winnerCount = Math.min(3, this.leaderboard.length);
    const prizeDistribution = [0.5, 0.3, 0.2]; // 50%, 30%, 20%
    
    this.winners = this.leaderboard.slice(0, winnerCount).map((entry, index) => ({
      user: entry.user,
      position: index + 1,
      prize: Math.floor(this.settings.prizePool * prizeDistribution[index]),
      awardedAt: new Date()
    }));
    
    // TODO: Process payments to winners
  }
  
  // Update stats
  const completed = this.participants.filter(p => p.status === 'completed').length;
  this.stats.completionRate = Math.round((completed / this.participants.length) * 100);
  this.stats.averageScore = Math.round(
    this.participants.reduce((sum, p) => sum + p.score, 0) / this.participants.length
  );
  this.stats.totalPrizePool = this.settings.prizePool;
  
  return this.save();
};

// Static method to find active challenges
challengeSchema.statics.findActive = function() {
  return this.find({ 
    status: 'active',
    'schedule.endDate': { $gt: new Date() }
  });
};

// Static method to find challenges user can join
challengeSchema.statics.findJoinable = function(userId) {
  return this.find({
    status: { $in: ['upcoming', 'active'] },
    'participants.user': { $ne: userId },
    $or: [
      { 'settings.visibility': 'public' },
      { 'settings.visibility': 'invite-only', 'metadata.challengeCode': { $exists: true } }
    ]
  });
};

module.exports = mongoose.model('Challenge', challengeSchema);