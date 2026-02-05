const mongoose = require('mongoose');

const userChallengeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true,
    index: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
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
  totalProgress: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'failed', 'withdrawn'],
    default: 'active'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  settings: {
    remindersEnabled: {
      type: Boolean,
      default: true
    },
    publicProgress: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Indexes
userChallengeSchema.index({ userId: 1, challengeId: 1 }, { unique: true });
userChallengeSchema.index({ status: 1 });
userChallengeSchema.index({ joinedAt: -1 });
userChallengeSchema.index({ lastActivity: -1 });

// Virtual for progress percentage
userChallengeSchema.virtual('progressPercentage').get(function() {
  const challenge = this.parent()?.challenge;
  if (!challenge || !challenge.duration) return 0;

  return Math.min(100, Math.round((this.totalProgress / challenge.duration) * 100));
});

// Virtual for days remaining
userChallengeSchema.virtual('daysRemaining').get(function() {
  const challenge = this.parent()?.challenge;
  if (!challenge || !challenge.schedule?.endDate) return 0;

  const now = new Date();
  const end = new Date(challenge.schedule.endDate);
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
});

// Method to update progress
userChallengeSchema.methods.updateProgress = async function(progressData) {
  const { completed, notes, streakIncrement = 1 } = progressData;

  if (completed) {
    this.currentStreak += streakIncrement;
    this.longestStreak = Math.max(this.longestStreak, this.currentStreak);
    this.totalProgress += 1;
  } else {
    // Reset streak on failure
    this.currentStreak = 0;
  }

  this.lastActivity = new Date();

  // Check if challenge is completed
  const challenge = await mongoose.model('Challenge').findById(this.challengeId);
  if (challenge && this.totalProgress >= challenge.duration) {
    this.completed = true;
    this.completedAt = new Date();
    this.status = 'completed';
  }

  return this.save();
};

// Method to leave challenge
userChallengeSchema.methods.leaveChallenge = function() {
  this.status = 'withdrawn';
  this.lastActivity = new Date();
  return this.save();
};

// Static method to find active user challenges
userChallengeSchema.statics.findActiveByUser = function(userId) {
  return this.find({
    userId,
    status: 'active'
  }).populate('challengeId');
};

// Static method to get user's challenge stats
userChallengeSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalJoined: { $sum: 1 },
        activeChallenges: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        completedChallenges: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        totalStreaks: { $sum: '$currentStreak' },
        longestStreak: { $max: '$longestStreak' },
        averageProgress: { $avg: '$totalProgress' }
      }
    }
  ]);

  return stats[0] || {
    totalJoined: 0,
    activeChallenges: 0,
    completedChallenges: 0,
    totalStreaks: 0,
    longestStreak: 0,
    averageProgress: 0
  };
};

module.exports = mongoose.model('UserChallenge', userChallengeSchema);
