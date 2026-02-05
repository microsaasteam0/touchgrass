const mongoose = require('mongoose');

const challengeProgressSchema = new mongoose.Schema({
  userChallengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserChallenge',
    required: true,
    index: true
  },
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
  progressDate: {
    type: Date,
    required: true,
    index: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    maxlength: 500
  },
  checkinTime: {
    type: Date,
    default: Date.now
  },
  verificationMethod: {
    type: String,
    enum: ['manual', 'photo', 'location', 'video', 'shame'],
    default: 'manual'
  },
  metadata: {
    duration: Number, // in minutes
    location: {
      lat: Number,
      lng: Number,
      name: String
    },
    weather: {
      temperature: Number,
      condition: String
    },
    mood: {
      type: String,
      enum: ['excited', 'happy', 'neutral', 'tired', 'struggling']
    },
    activities: [{
      type: String,
      enum: ['walk', 'run', 'hike', 'sports', 'meditation', 'reading', 'other']
    }]
  }
}, {
  timestamps: true
});

// Indexes
challengeProgressSchema.index({ userChallengeId: 1, progressDate: 1 }, { unique: true });
challengeProgressSchema.index({ userId: 1, progressDate: 1 });
challengeProgressSchema.index({ challengeId: 1, progressDate: 1 });
challengeProgressSchema.index({ completed: 1 });
challengeProgressSchema.index({ progressDate: -1 });

// Virtual for streak calculation
challengeProgressSchema.virtual('contributesToStreak').get(function() {
  return this.completed;
});

// Method to mark as completed
challengeProgressSchema.methods.markCompleted = function(metadata = {}) {
  this.completed = true;
  this.checkinTime = new Date();
  this.metadata = { ...this.metadata, ...metadata };
  return this.save();
};

// Static method to get user's progress for a date range
challengeProgressSchema.statics.getUserProgress = function(userId, challengeId, startDate, endDate) {
  return this.find({
    userId,
    challengeId,
    progressDate: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ progressDate: 1 });
};

// Static method to calculate streak for user in challenge
challengeProgressSchema.statics.calculateStreak = async function(userChallengeId) {
  const progressEntries = await this.find({
    userChallengeId
  }).sort({ progressDate: -1 });

  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if today is completed
  const todayEntry = progressEntries.find(entry => {
    const entryDate = new Date(entry.progressDate);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });

  if (todayEntry && todayEntry.completed) {
    currentStreak = 1;
  }

  // Count consecutive completed days
  for (let i = 0; i < progressEntries.length; i++) {
    const entry = progressEntries[i];
    if (!entry.completed) break;

    const entryDate = new Date(entry.progressDate);
    entryDate.setHours(0, 0, 0, 0);

    if (i === 0) continue; // Skip today

    const prevEntry = progressEntries[i - 1];
    const prevDate = new Date(prevEntry.progressDate);
    prevDate.setHours(0, 0, 0, 0);

    const dayDiff = (prevDate - entryDate) / (1000 * 60 * 60 * 24);

    if (dayDiff === 1) {
      currentStreak++;
    } else {
      break;
    }
  }

  return currentStreak;
};

// Static method to get daily check-ins for user
challengeProgressSchema.statics.getDailyCheckins = async function(userId, date) {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const userChallenges = await mongoose.model('UserChallenge').find({
    userId,
    status: 'active'
  }).populate('challengeId');

  const checkins = [];

  for (const userChallenge of userChallenges) {
    const existingProgress = await this.findOne({
      userChallengeId: userChallenge._id,
      progressDate: targetDate
    });

    checkins.push({
      challengeId: userChallenge.challengeId._id,
      challengeName: userChallenge.challengeId.name,
      completed: existingProgress ? existingProgress.completed : false,
      progressId: existingProgress ? existingProgress._id : null,
      userChallengeId: userChallenge._id
    });
  }

  return checkins;
};

module.exports = mongoose.model('ChallengeProgress', challengeProgressSchema);
