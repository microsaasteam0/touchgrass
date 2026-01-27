const mongoose = require('mongoose');

const verificationWallSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Photo details
  photoUrl: {
    type: String,
    required: true
  },
  photoThumbnail: String,
  photoMetadata: {
    width: Number,
    height: Number,
    size: Number,
    format: String,
    uploadedAt: Date
  },

  // Verification details
  streakId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Streak'
  },
  activityType: {
    type: String,
    enum: ['walk', 'run', 'hike', 'sports', 'gardening', 'picnic', 'meditation', 'reading', 'other'],
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 1,
    max: 1440
  },
  location: {
    lat: Number,
    lng: Number,
    name: String,
    address: String
  },

  // User content
  caption: {
    type: String,
    maxlength: 500,
    trim: true
  },
  tags: [String],

  // Social features
  likes: [{
    userId: mongoose.Schema.Types.ObjectId,
    timestamp: Date
  }],
  comments: [{
    userId: mongoose.Schema.Types.ObjectId,
    text: String,
    timestamp: Date,
    likes: [{
      userId: mongoose.Schema.Types.ObjectId,
      timestamp: Date
    }]
  }],

  // Reporting system
  reports: [{
    userId: mongoose.Schema.Types.ObjectId,
    reason: {
      type: String,
      enum: ['fake_photo', 'inappropriate', 'spam', 'copyright', 'other'],
      required: true
    },
    details: String,
    timestamp: Date,
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'dismissed'],
      default: 'pending'
    }
  }],

  // Moderation
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockedReason: String,
  blockedAt: Date,
  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Analytics
  views: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },

  // Verification status
  isVerified: {
    type: Boolean,
    default: true // Assume genuine unless reported
  },
  verificationScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
verificationWallSchema.index({ userId: 1, createdAt: -1 });
verificationWallSchema.index({ createdAt: -1 });
verificationWallSchema.index({ isBlocked: 1 });
verificationWallSchema.index({ 'reports.status': 1 });

// Virtual for total reports
verificationWallSchema.virtual('totalReports').get(function() {
  return this.reports.length;
});

// Virtual for pending reports
verificationWallSchema.virtual('pendingReports').get(function() {
  return this.reports.filter(report => report.status === 'pending').length;
});

// Virtual for like count
verificationWallSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
verificationWallSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Method to add report
verificationWallSchema.methods.addReport = async function(userId, reason, details = '') {
  // Check if user already reported
  const existingReport = this.reports.find(report =>
    report.userId.toString() === userId.toString()
  );

  if (existingReport) {
    throw new Error('You have already reported this post');
  }

  this.reports.push({
    userId,
    reason,
    details,
    timestamp: new Date(),
    status: 'pending'
  });

  // Auto-block if too many reports
  if (this.pendingReports >= 5) {
    this.isBlocked = true;
    this.blockedReason = 'Multiple reports received';
    this.blockedAt = new Date();
    this.verificationScore = Math.max(0, this.verificationScore - 20);
  }

  return this.save();
};

// Method to moderate report
verificationWallSchema.methods.moderateReport = async function(reportId, action, moderatorId) {
  const report = this.reports.id(reportId);
  if (!report) {
    throw new Error('Report not found');
  }

  report.status = action === 'block' ? 'reviewed' : 'dismissed';

  if (action === 'block') {
    this.isBlocked = true;
    this.blockedReason = `Blocked due to report: ${report.reason}`;
    this.blockedAt = new Date();
    this.blockedBy = moderatorId;
    this.verificationScore = Math.max(0, this.verificationScore - 30);
  }

  return this.save();
};

// Method to add comment
verificationWallSchema.methods.addComment = async function(userId, text) {
  if (this.isBlocked) {
    throw new Error('Cannot comment on blocked post');
  }

  this.comments.push({
    userId,
    text: text.trim(),
    timestamp: new Date()
  });

  return this.save();
};

// Method to like/unlike
verificationWallSchema.methods.toggleLike = async function(userId) {
  const existingLike = this.likes.find(like =>
    like.userId.toString() === userId.toString()
  );

  if (existingLike) {
    // Unlike
    this.likes = this.likes.filter(like =>
      like.userId.toString() !== userId.toString()
    );
  } else {
    // Like
    this.likes.push({
      userId,
      timestamp: new Date()
    });
  }

  return this.save();
};

// Static method to get public posts
verificationWallSchema.statics.getPublicPosts = function(limit = 20, skip = 0) {
  return this.find({ isBlocked: false })
    .populate('userId', 'username avatar displayName')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to get reported posts for moderation
verificationWallSchema.statics.getReportedPosts = function() {
  return this.find({
    'reports.status': 'pending',
    isBlocked: false
  })
    .populate('userId', 'username avatar displayName')
    .populate('reports.userId', 'username')
    .sort({ 'reports.timestamp': -1 });
};

module.exports = mongoose.model('VerificationWall', verificationWallSchema);
