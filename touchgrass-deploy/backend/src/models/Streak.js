// const mongoose = require('mongoose');

// const streakSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     index: true
//   },
//   startDate: {
//     type: Date,
//     default: Date.now
//   },
//   lastUpdated: {
//     type: Date,
//     default: Date.now
//   },
//   currentStreak: {
//     type: Number,
//     default: 0,
//     min: 0
//   },
//   longestStreak: {
//     type: Number,
//     default: 0,
//     min: 0
//   },
//   history: [{
//     date: {
//       type: Date,
//       required: true
//     },
//     verified: {
//       type: Boolean,
//       default: false
//     },
//     verificationMethod: {
//       type: String,
//       enum: ['photo', 'location', 'manual', 'shame', 'freeze', 'skip'],
//       default: 'manual'
//     },
//     photoUrl: String,
//     duration: {
//       type: Number,
//       min: 1,
//       max: 1440,
//       default: 15
//     },
//     notes: {
//       type: String,
//       maxlength: 500
//     },
//     location: {
//       type: {
//         type: String,
//         enum: ['Point'],
//         default: 'Point'
//       },
//       coordinates: {
//         type: [Number],
//         default: [0, 0]
//       },
//       name: String,
//       address: String
//     },
//     shameMessage: {
//       type: String,
//       maxlength: 200
//     },
//     isPublicShame: {
//       type: Boolean,
//       default: false
//     },
//     weather: {
//       temperature: Number,
//       condition: String,
//       icon: String
//     },
//     mood: {
//       type: String,
//       enum: ['excited', 'happy', 'neutral', 'tired', 'struggling']
//     },
//     activities: [{
//       type: String,
//       enum: ['walk', 'run', 'hike', 'sports', 'meditation', 'reading', 'other']
//     }],
//     tags: [String],
//     challengeId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Challenge'
//     }
//   }],
//   status: {
//     type: String,
//     enum: ['active', 'broken', 'paused', 'completed'],
//     default: 'active'
//   },
//   freezeTokensUsed: {
//     type: Number,
//     default: 0
//   },
//   skipDaysUsed: {
//     type: Number,
//     default: 0
//   },
//   achievements: [{
//     achievementId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Achievement'
//     },
//     earnedAt: Date,
//     milestone: Number
//   }],
//   nextCheckpoint: {
//     type: Date,
//     default: function() {
//       const tomorrow = new Date();
//       tomorrow.setDate(tomorrow.getDate() + 1);
//       tomorrow.setHours(0, 0, 0, 0);
//       return tomorrow;
//     }
//   },
//   settings: {
//     reminderTime: {
//       type: String,
//       default: '18:00'
//     },
//     reminderTimezone: String,
//     autoFreeze: {
//       type: Boolean,
//       default: false
//     },
//     strictMode: {
//       type: Boolean,
//       default: false
//     }
//   },
//   shareCount: {
//     type: Number,
//     default: 0
//   },
//   shareHistory: [{
//     platform: String,
//     sharedAt: Date,
//     clicks: { type: Number, default: 0 }
//   }],
//   isPublic: {
//     type: Boolean,
//     default: true
//   },
//   goal: {
//     targetDays: Number,
//     targetDate: Date,
//     description: String
//   },
//   metadata: {
//     streakId: String, // For public sharing
//     qrCode: String,
//     embedCode: String
//   }
// }, {
//   timestamps: true
// });

// // Indexes
// streakSchema.index({ userId: 1, status: 1 });
// streakSchema.index({ status: 1, nextCheckpoint: 1 });
// streakSchema.index({ currentStreak: -1 });
// streakSchema.index({ 'history.date': 1 });
// streakSchema.index({ 'history.challengeId': 1 });
// streakSchema.index({ 'metadata.streakId': 1 });

// // Virtual for verification rate
// streakSchema.virtual('verificationRate').get(function() {
//   if (this.history.length === 0) return 0;
  
//   const verified = this.history.filter(day => day.verified).length;
//   return Math.round((verified / this.history.length) * 100);
// });

// // Virtual for shame rate
// streakSchema.virtual('shameRate').get(function() {
//   if (this.history.length === 0) return 0;
  
//   const shameDays = this.history.filter(day => day.verificationMethod === 'shame').length;
//   return Math.round((shameDays / this.history.length) * 100);
// });

// // Virtual for average duration
// streakSchema.virtual('averageDuration').get(function() {
//   if (this.history.length === 0) return 0;
  
//   const total = this.history.reduce((sum, day) => sum + (day.duration || 0), 0);
//   return Math.round(total / this.history.length);
// });

// // Method to check if streak is broken
// streakSchema.methods.isBroken = function() {
//   const now = new Date();
//   const lastUpdate = new Date(this.lastUpdated);
//   const daysSinceUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));
  
//   return daysSinceUpdate > 1;
// };

// // Method to verify a day
// streakSchema.methods.verifyDay = async function(data) {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
  
//   // Check if already verified today
//   const alreadyVerified = this.history.some(entry => {
//     const entryDate = new Date(entry.date);
//     entryDate.setHours(0, 0, 0, 0);
//     return entryDate.getTime() === today.getTime();
//   });
  
//   if (alreadyVerified) {
//     throw new Error('Already verified today');
//   }
  
//   // Add to history
//   this.history.push({
//     date: new Date(),
//     verified: data.verificationMethod !== 'shame',
//     verificationMethod: data.verificationMethod,
//     photoUrl: data.photoUrl,
//     duration: data.duration || 15,
//     notes: data.notes,
//     location: data.location,
//     shameMessage: data.shameMessage,
//     isPublicShame: data.isPublicShame || false,
//     weather: data.weather,
//     mood: data.mood,
//     activities: data.activities,
//     tags: data.tags,
//     challengeId: data.challengeId
//   });
  
//   // Update streak count
//   if (data.verificationMethod !== 'shame') {
//     this.currentStreak += 1;
//     this.lastUpdated = new Date();
    
//     if (this.currentStreak > this.longestStreak) {
//       this.longestStreak = this.currentStreak;
//     }
//   }
  
//   // Update next checkpoint
//   const nextCheckpoint = new Date();
//   nextCheckpoint.setDate(nextCheckpoint.getDate() + 1);
//   nextCheckpoint.setHours(0, 0, 0, 0);
//   this.nextCheckpoint = nextCheckpoint;
  
//   // Check achievements
//   await this.checkAchievements();
  
//   return this.save();
// };

// // Method to use freeze token
// streakSchema.methods.useFreezeToken = async function() {
//   if (this.freezeTokensUsed >= this.getAvailableFreezeTokens()) {
//     throw new Error('No freeze tokens available');
//   }
  
//   this.history.push({
//     date: new Date(),
//     verified: false,
//     verificationMethod: 'freeze',
//     notes: 'Used streak freeze token'
//   });
  
//   this.freezeTokensUsed += 1;
//   this.lastUpdated = new Date();
  
//   // Update next checkpoint
//   const nextCheckpoint = new Date();
//   nextCheckpoint.setDate(nextCheckpoint.getDate() + 1);
//   nextCheckpoint.setHours(0, 0, 0, 0);
//   this.nextCheckpoint = nextCheckpoint;
  
//   return this.save();
// };

// // Method to skip day (requires payment for free users)
// streakSchema.methods.skipDay = async function(paymentData = null) {
//   this.history.push({
//     date: new Date(),
//     verified: false,
//     verificationMethod: 'skip',
//     notes: paymentData ? 'Paid to skip day' : 'Skipped day'
//   });
  
//   this.skipDaysUsed += 1;
//   this.lastUpdated = new Date();
  
//   // Update next checkpoint
//   const nextCheckpoint = new Date();
//   nextCheckpoint.setDate(nextCheckpoint.getDate() + 1);
//   nextCheckpoint.setHours(0, 0, 0, 0);
//   this.nextCheckpoint = nextCheckpoint;
  
//   return this.save();
// };

// // Method to break streak
// streakSchema.methods.breakStreak = function(reason = 'missed') {
//   this.status = 'broken';
//   this.currentStreak = 0;
//   this.lastUpdated = new Date();
  
//   this.history.push({
//     date: new Date(),
//     verified: false,
//     verificationMethod: 'break',
//     notes: `Streak broken: ${reason}`
//   });
  
//   return this.save();
// };

// // Method to check achievements
// streakSchema.methods.checkAchievements = async function() {
//   const Achievement = mongoose.model('Achievement');
  
//   // Check milestone achievements
//   const milestones = [7, 30, 100, 365];
//   for (const milestone of milestones) {
//     if (this.currentStreak === milestone) {
//       const achievement = await Achievement.findOne({ type: 'milestone', value: milestone });
//       if (achievement && !this.achievements.some(a => a.achievementId.toString() === achievement._id.toString())) {
//         this.achievements.push({
//           achievementId: achievement._id,
//           earnedAt: new Date(),
//           milestone
//         });
//       }
//     }
//   }
  
//   // Check consistency achievement
//   if (this.verificationRate >= 95 && this.currentStreak >= 30) {
//     const achievement = await Achievement.findOne({ type: 'consistency', value: 95 });
//     if (achievement && !this.achievements.some(a => a.achievementId.toString() === achievement._id.toString())) {
//       this.achievements.push({
//         achievementId: achievement._id,
//         earnedAt: new Date()
//       });
//     }
//   }
  
//   return this.save();
// };

// // Method to get available freeze tokens
// streakSchema.methods.getAvailableFreezeTokens = function() {
//   // This would check user's subscription
//   return 3; // Default for premium users
// };

// // Static method to find active streaks
// streakSchema.statics.findActiveStreaks = function() {
//   return this.find({ status: 'active' });
// };

// // Static method to find streaks about to break
// streakSchema.statics.findExpiringStreaks = function() {
//   const now = new Date();
//   const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
  
//   return this.find({
//     status: 'active',
//     nextCheckpoint: { $lte: oneHourFromNow }
//   });
// };

// module.exports = mongoose.model('Streak', streakSchema);

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