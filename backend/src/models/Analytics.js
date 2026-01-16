const mongoose = require('mongoose');

const streakSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Active streak tracking
  startDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  currentStreak: {
    type: Number,
    default: 1,
    min: 1
  },
  
  // Daily verification history (actual proof records)
  history: [{
    date: {
      type: Date,
      required: true,
      index: true
    },
    verified: {
      type: Boolean,
      required: true
    },
    verificationMethod: {
      type: String,
      enum: ['photo', 'location', 'video', 'manual', 'shame', 'freeze'],
      required: true
    },
    
    // Photo verification data
    photoUrl: String,
    photoMetadata: {
      timestamp: Date,
      location: {
        lat: Number,
        lng: Number,
        accuracy: Number,
        name: String
      },
      deviceInfo: String,
      fileSize: Number,
      dimensions: {
        width: Number,
        height: Number
      }
    },
    
    // Location verification data
    locationData: {
      lat: Number,
      lng: Number,
      accuracy: Number,
      timestamp: Date,
      address: String
    },
    
    // Duration & activity data
    duration: {
      type: Number, // in minutes
      min: 1,
      max: 1440
    },
    activityType: {
      type: String,
      enum: ['walk', 'run', 'hike', 'sports', 'gardening', 'picnic', 'other']
    },
    notes: String,
    
    // Shame data
    shameMessage: String,
    isPublicShame: Boolean,
    shameUpvotes: Number,
    
    // Freeze data
    freezeTokenUsed: Boolean,
    freezeReason: String,
    
    // Verification metadata
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    confidenceScore: { // ML verification confidence (0-100)
      type: Number,
      min: 0,
      max: 100
    },
    
    // Analytics
    views: {
      type: Number,
      default: 0
    },
    likes: [{
      userId: mongoose.Schema.Types.ObjectId,
      timestamp: Date
    }],
    comments: [{
      userId: mongoose.Schema.Types.ObjectId,
      text: String,
      timestamp: Date
    }],
    shares: [{
      platform: String,
      timestamp: Date,
      count: Number
    }]
  }],
  
  // Streak status
  status: {
    type: String,
    enum: ['active', 'broken', 'paused', 'completed'],
    default: 'active'
  },
  
  // Milestones & achievements
  milestones: [{
    days: Number,
    achievedAt: Date,
    rewardType: String,
    rewardValue: Number
  }],
  
  // Freeze tokens
  freezeTokens: {
    available: {
      type: Number,
      default: 0,
      min: 0
    },
    used: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  // Analytics
  totalVerifications: {
    type: Number,
    default: 1
  },
  photoVerifications: {
    type: Number,
    default: 0
  },
  shameVerifications: {
    type: Number,
    default: 0
  },
  averageDuration: {
    type: Number,
    default: 0
  },
  bestDay: {
    date: Date,
    duration: Number
  },
  
  // Social
  isPublic: {
    type: Boolean,
    default: true
  },
  followers: [{
    userId: mongoose.Schema.Types.ObjectId,
    followedAt: Date
  }],
  challengeParticipants: [{
    challengeId: mongoose.Schema.Types.ObjectId,
    joinedAt: Date
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
streakSchema.index({ userId: 1, 'history.date': 1 });
streakSchema.index({ 'history.date': 1 });
streakSchema.index({ currentStreak: -1 });
streakSchema.index({ status: 1 });

// Virtual for today's verification status
streakSchema.virtual('todayVerified').get(function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.history.some(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime() && entry.verified;
  });
});

// Virtual for streak duration
streakSchema.virtual('streakDurationDays').get(function() {
  if (this.history.length === 0) return 0;
  
  const verifiedDates = this.history
    .filter(entry => entry.verified)
    .map(entry => new Date(entry.date))
    .sort((a, b) => a - b);
  
  if (verifiedDates.length === 0) return 0;
  
  // Calculate longest consecutive sequence
  let currentStreak = 1;
  let longestStreak = 1;
  
  for (let i = 1; i < verifiedDates.length; i++) {
    const diffDays = Math.floor(
      (verifiedDates[i] - verifiedDates[i - 1]) / (1000 * 60 * 60 * 24)
    );
    
    if (diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return longestStreak;
});

// Methods
streakSchema.methods.verifyDay = async function(verificationData) {
  const today = new Date();
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
  
  // Add verification to history
  const verificationEntry = {
    date: today,
    verified: verificationData.verified,
    verificationMethod: verificationData.method,
    verifiedAt: new Date(),
    ...verificationData
  };
  
  this.history.push(verificationEntry);
  
  // Update streak based on verification
  if (verificationData.verified) {
    this.currentStreak += 1;
    this.totalVerifications += 1;
    
    if (verificationData.method === 'photo') {
      this.photoVerifications += 1;
    } else if (verificationData.method === 'shame') {
      this.shameVerifications += 1;
    }
    
    // Update average duration
    if (verificationData.duration) {
      const totalDuration = this.averageDuration * (this.totalVerifications - 1) + verificationData.duration;
      this.averageDuration = Math.round(totalDuration / this.totalVerifications);
    }
    
    // Check for best day
    if (verificationData.duration > (this.bestDay?.duration || 0)) {
      this.bestDay = {
        date: today,
        duration: verificationData.duration
      };
    }
    
    // Check for milestones
    await this.checkMilestones();
    
  } else {
    // Streak broken
    this.currentStreak = 1;
    this.status = 'broken';
  }
  
  this.lastUpdated = new Date();
  return this.save();
};

streakSchema.methods.checkMilestones = async function() {
  const milestones = [7, 30, 100, 365];
  const User = mongoose.model('User');
  
  for (const milestone of milestones) {
    if (this.currentStreak === milestone && !this.milestones.some(m => m.days === milestone)) {
      // Add milestone
      this.milestones.push({
        days: milestone,
        achievedAt: new Date(),
        rewardType: 'achievement',
        rewardValue: milestone * 10 // Points or credits
      });
      
      // Update user achievements
      const achievementName = `${milestone} Day Streak`;
      await User.findByIdAndUpdate(this.userId, {
        $addToSet: {
          achievements: {
            id: `streak_${milestone}`,
            name: achievementName,
            description: `Maintained a ${milestone}-day streak`,
            icon: milestone === 365 ? '🏆' : milestone === 100 ? '💯' : milestone === 30 ? '🌟' : '🔥',
            earnedAt: new Date(),
            rarity: milestone === 365 ? 'legendary' : milestone === 100 ? 'epic' : milestone === 30 ? 'rare' : 'common'
          }
        }
      });
      
      break;
    }
  }
};

streakSchema.methods.getConsistency = function() {
  if (this.history.length === 0) return 0;
  
  const verifiedCount = this.history.filter(entry => entry.verified).length;
  return Math.round((verifiedCount / this.history.length) * 100);
};

streakSchema.methods.getStats = function() {
  const verifiedEntries = this.history.filter(entry => entry.verified);
  
  return {
    totalDays: this.history.length,
    verifiedDays: verifiedEntries.length,
    currentStreak: this.currentStreak,
    longestStreak: this.streakDurationDays,
    consistency: this.getConsistency(),
    averageDuration: this.averageDuration,
    photoCount: this.photoVerifications,
    shameCount: this.shameVerifications,
    milestones: this.milestones.length,
    followers: this.followers.length
  };
};

// Pre-save middleware
streakSchema.pre('save', function(next) {
  // Update status based on last verification
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  const lastVerification = this.history
    .filter(entry => entry.verified)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  
  if (lastVerification) {
    const lastDate = new Date(lastVerification.date);
    lastDate.setHours(0, 0, 0, 0);
    
    if (lastDate.getTime() < yesterday.getTime()) {
      this.status = 'broken';
      this.currentStreak = 0;
    } else {
      this.status = 'active';
    }
  }
  
  next();
});

module.exports = mongoose.model('Streak', streakSchema);