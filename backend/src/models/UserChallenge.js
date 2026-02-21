const mongoose = require('mongoose');

const userChallengeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  
  status: { 
    type: String, 
    enum: ['joined', 'active', 'in_progress', 'completed', 'withdrawn'], 
    default: 'active' 
  },
  
  joinedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  lastActivity: { type: Date },
  
  // Progress tracking
  totalProgress: { type: Number, default: 0 }, // Total days completed
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  
  // Daily verification records
  dailyProgress: {
    type: Map,
    of: new mongoose.Schema({
      completed: { type: Boolean, default: false },
      completedAt: Date,
      notes: String,
      verificationMethod: String,
      ipAddress: String,
      userAgent: String,
      photoUrl: String,
      location: {
        lat: Number,
        lng: Number
      }
    }, { _id: false }),
    default: {}
  },
  
  // Payment/entry fee tracking
  payment: {
    status: { type: String, enum: ['pending', 'paid', 'refunded'] },
    amount: Number,
    transactionId: String,
    paidAt: Date
  },
  
  // Statistics
  statistics: {
    totalTimeSpent: { type: Number, default: 0 }, // minutes
    averageDailyTime: { type: Number, default: 0 },
    consistencyScore: { type: Number, default: 0 },
    rank: { type: Number }
  }
}, {
  timestamps: true
});

// Indexes for performance
userChallengeSchema.index({ userId: 1, status: 1 });
userChallengeSchema.index({ challengeId: 1, status: 1 });
userChallengeSchema.index({ userId: 1, challengeId: 1 }, { unique: true });
userChallengeSchema.index({ 'dailyProgress': 1 }); // For date-based queries

// Compound index for leaderboard queries
userChallengeSchema.index({ challengeId: 1, totalProgress: -1, currentStreak: -1 });

module.exports = mongoose.model('UserChallenge', userChallengeSchema);