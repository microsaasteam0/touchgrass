const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['milestone', 'consistency', 'social', 'challenge', 'special'],
    required: true
  },
  category: {
    type: String,
    enum: ['streak', 'verification', 'sharing', 'community', 'payment'],
    required: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  color: {
    type: String,
    default: '#fbbf24'
  },
  value: {
    type: Number,
    required: function() {
      return this.type === 'milestone' || this.type === 'consistency';
    }
  },
  requirements: {
    streakDays: Number,
    verificationRate: Number,
    shareCount: Number,
    challengeWins: Number,
    consecutiveDays: Number,
    totalOutdoorTime: Number // in minutes
  },
  reward: {
    xp: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    badge: String,
    featureUnlock: String,
    customMessage: String
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  unlockMessage: {
    type: String,
    default: 'Congratulations! You unlocked an achievement!'
  },
  shareable: {
    type: Boolean,
    default: true
  },
  shareTemplate: {
    title: String,
    message: String,
    hashtags: [String]
  },
  metadata: {
    version: { type: Number, default: 1 },
    releasedAt: { type: Date, default: Date.now },
    retiredAt: Date,
    isSecret: { type: Boolean, default: false }
  },
  stats: {
    unlockedCount: { type: Number, default: 0 },
    globalUnlockRate: { type: Number, default: 0 }, // percentage
    lastUnlocked: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
achievementSchema.index({ type: 1, value: 1 });
achievementSchema.index({ category: 1 });
achievementSchema.index({ rarity: 1 });
achievementSchema.index({ 'requirements.streakDays': 1 });
achievementSchema.index({ isActive: 1 });

// Virtual for difficulty
achievementSchema.virtual('difficulty').get(function() {
  const rarityMap = {
    common: 1,
    uncommon: 2,
    rare: 3,
    epic: 4,
    legendary: 5
  };
  return rarityMap[this.rarity] || 1;
});

// Method to check if user qualifies
achievementSchema.methods.checkQualification = function(userStats) {
  const requirements = this.requirements || {};
  
  // Check streak days
  if (requirements.streakDays && userStats.currentStreak < requirements.streakDays) {
    return false;
  }
  
  // Check verification rate
  if (requirements.verificationRate && userStats.verificationRate < requirements.verificationRate) {
    return false;
  }
  
  // Check share count
  if (requirements.shareCount && userStats.shareCount < requirements.shareCount) {
    return false;
  }
  
  // Check challenge wins
  if (requirements.challengeWins && userStats.challengeWins < requirements.challengeWins) {
    return false;
  }
  
  // Check consecutive days
  if (requirements.consecutiveDays && userStats.currentStreak < requirements.consecutiveDays) {
    return false;
  }
  
  // Check total outdoor time
  if (requirements.totalOutdoorTime && userStats.totalOutdoorTime < requirements.totalOutdoorTime) {
    return false;
  }
  
  return true;
};

// Method to unlock for user
achievementSchema.methods.unlockForUser = async function(userId) {
  const User = mongoose.model('User');
  
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  
  // Check if already unlocked
  const alreadyUnlocked = user.achievements.some(a => 
    a.achievementId.toString() === this._id.toString()
  );
  
  if (alreadyUnlocked) {
    return false;
  }
  
  // Add achievement to user
  user.achievements.push({
    achievementId: this._id,
    earnedAt: new Date(),
    isUnlocked: true
  });
  
  // Add rewards
  if (this.reward.xp) {
    // user.stats.xp += this.reward.xp;
  }
  
  if (this.reward.coins) {
    // user.stats.coins += this.reward.coins;
  }
  
  if (this.reward.badge) {
    user.badges.push(this.reward.badge);
  }
  
  // Update achievement stats
  this.stats.unlockedCount += 1;
  this.stats.lastUnlocked = new Date();
  
  await Promise.all([user.save(), this.save()]);
  
  return true;
};

// Static method to find achievements by type
achievementSchema.statics.findByType = function(type) {
  return this.find({ type, isActive: true }).sort({ value: 1 });
};

// Static method to find achievements for user
achievementSchema.statics.findForUser = async function(userId) {
  const User = mongoose.model('User');
  
  const user = await User.findById(userId).populate('achievements.achievementId');
  if (!user) throw new Error('User not found');
  
  const unlockedIds = user.achievements.map(a => a.achievementId._id.toString());
  
  const allAchievements = await this.find({ isActive: true });
  
  return allAchievements.map(achievement => ({
    ...achievement.toObject(),
    isUnlocked: unlockedIds.includes(achievement._id.toString()),
    unlockedAt: user.achievements.find(a => 
      a.achievementId._id.toString() === achievement._id.toString()
    )?.earnedAt
  }));
};

// Pre-save middleware to update global unlock rate
achievementSchema.pre('save', async function(next) {
  if (this.isNew) return next();
  
  const User = mongoose.model('User');
  const totalUsers = await User.countDocuments();
  
  if (totalUsers > 0) {
    this.stats.globalUnlockRate = Math.round((this.stats.unlockedCount / totalUsers) * 100);
  }
  
  next();
});

module.exports = mongoose.model('Achievement', achievementSchema);