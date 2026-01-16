const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: [
      'streak_reminder',
      'streak_broken',
      'streak_milestone',
      'challenge_invite',
      'challenge_start',
      'challenge_ended',
      'challenge_result',
      'new_message',
      'new_follower',
      'achievement_unlocked',
      'payment_success',
      'payment_failed',
      'subscription_expiring',
      'friend_activity',
      'system_alert',
      'admin_message'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  data: {
    streakId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Streak'
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge'
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat'
    },
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    achievementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement'
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    url: String,
    action: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  channels: [{
    type: String,
    enum: ['push', 'email', 'in_app', 'sms'],
    default: ['in_app']
  }],
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'read', 'failed', 'archived'],
    default: 'pending'
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  sentAt: Date,
  deliveredAt: Date,
  failedAt: Date,
  failureReason: String,
  schedule: {
    sendAt: Date,
    repeat: {
      type: String,
      enum: ['once', 'daily', 'weekly', 'monthly']
    },
    expiresAt: Date
  },
  metadata: {
    campaignId: String,
    templateId: String,
    locale: String,
    deviceId: String,
    ipAddress: String,
    userAgent: String
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ user: 1, status: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ 'schedule.sendAt': 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ read: 1 });
notificationSchema.index({ 'data.streakId': 1 });
notificationSchema.index({ 'data.challengeId': 1 });

// Virtual for age
notificationSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt;
});

// Virtual for isExpired
notificationSchema.virtual('isExpired').get(function() {
  if (!this.schedule.expiresAt) return false;
  return new Date() > this.schedule.expiresAt;
});

// Virtual for shouldSend
notificationSchema.virtual('shouldSend').get(function() {
  if (this.status !== 'pending') return false;
  if (this.isExpired) return false;
  
  if (this.schedule.sendAt) {
    return new Date() >= this.schedule.sendAt;
  }
  
  return true;
});

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.read = true;
  this.readAt = new Date();
  
  if (this.status === 'delivered') {
    this.status = 'read';
  }
  
  return this.save();
};

// Method to mark as delivered
notificationSchema.methods.markAsDelivered = function(channel) {
  this.deliveredAt = new Date();
  
  if (this.channels.includes(channel)) {
    this.status = 'delivered';
  }
  
  return this.save();
};

// Method to mark as sent
notificationSchema.methods.markAsSent = function(channel) {
  this.sentAt = new Date();
  
  // Update status if still pending
  if (this.status === 'pending') {
    this.status = 'sent';
  }
  
  return this.save();
};

// Method to mark as failed
notificationSchema.methods.markAsFailed = function(reason) {
  this.status = 'failed';
  this.failedAt = new Date();
  this.failureReason = reason;
  
  return this.save();
};

// Method to reschedule
notificationSchema.methods.reschedule = function(sendAt) {
  this.status = 'pending';
  this.schedule.sendAt = sendAt;
  this.sentAt = null;
  this.deliveredAt = null;
  this.failedAt = null;
  this.failureReason = null;
  
  return this.save();
};

// Static method to create streak reminder
notificationSchema.statics.createStreakReminder = function(userId, streakData) {
  return this.create({
    user: userId,
    type: 'streak_reminder',
    title: 'Streak Reminder',
    message: `Don't forget to touch grass today! Your ${streakData.currentStreak}-day streak is on the line.`,
    data: {
      streakId: streakData._id,
      url: `/verify`,
      action: 'verify_today'
    },
    priority: 'high',
    channels: ['push', 'in_app']
  });
};

// Static method to create streak milestone
notificationSchema.statics.createStreakMilestone = function(userId, streakData, milestone) {
  return this.create({
    user: userId,
    type: 'streak_milestone',
    title: 'Milestone Achieved! 🎉',
    message: `Congratulations! You've reached a ${milestone}-day streak!`,
    data: {
      streakId: streakData._id,
      url: `/dashboard`,
      action: 'view_streak'
    },
    priority: 'high',
    channels: ['push', 'in_app', 'email']
  });
};

// Static method to create challenge invite
notificationSchema.statics.createChallengeInvite = function(userId, challengeData, inviter) {
  return this.create({
    user: userId,
    type: 'challenge_invite',
    title: 'Challenge Invitation',
    message: `${inviter.displayName} invited you to join "${challengeData.name}" challenge`,
    data: {
      challengeId: challengeData._id,
      userId: inviter._id,
      url: `/challenges/${challengeData._id}`,
      action: 'join_challenge'
    },
    priority: 'medium',
    channels: ['push', 'in_app']
  });
};

// Static method to create achievement unlocked
notificationSchema.statics.createAchievementUnlocked = function(userId, achievement) {
  return this.create({
    user: userId,
    type: 'achievement_unlocked',
    title: 'Achievement Unlocked!',
    message: `You unlocked "${achievement.name}" achievement!`,
    data: {
      achievementId: achievement._id,
      url: `/profile/achievements`,
      action: 'view_achievement'
    },
    priority: 'medium',
    channels: ['push', 'in_app', 'email']
  });
};

// Static method to find pending notifications
notificationSchema.statics.findPending = function() {
  return this.find({
    status: 'pending',
    'schedule.sendAt': { $lte: new Date() },
    'schedule.expiresAt': { $gt: new Date() }
  });
};

// Static method to find user notifications
notificationSchema.statics.findByUser = function(userId, options = {}) {
  const query = { user: userId };
  
  if (options.unreadOnly) {
    query.read = false;
  }
  
  if (options.type) {
    query.type = options.type;
  }
  
  if (options.since) {
    query.createdAt = { $gte: options.since };
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(options.limit || 50)
    .populate('data.streakId', 'currentStreak')
    .populate('data.challengeId', 'name')
    .populate('data.userId', 'displayName avatar');
};

module.exports = mongoose.model('Notification', notificationSchema);