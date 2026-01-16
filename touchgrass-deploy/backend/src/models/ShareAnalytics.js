const mongoose = require('mongoose');

const shareAnalyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  streak: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Streak',
    required: true,
    index: true
  },
  platform: {
    type: String,
    enum: [
      'twitter',
      'linkedin',
      'facebook',
      'instagram',
      'whatsapp',
      'reddit',
      'discord',
      'telegram',
      'copy_link',
      'embed',
      'qr_code',
      'api',
      'other'
    ],
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['manual', 'auto', 'scheduled', 'api'],
    default: 'manual'
  },
  shareData: {
    url: {
      type: String,
      required: true
    },
    message: String,
    hashtags: [String],
    imageUrl: String,
    ogTitle: String,
    ogDescription: String,
    customParams: mongoose.Schema.Types.Mixed
  },
  clicks: {
    total: { type: Number, default: 0 },
    unique: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
    desktop: { type: Number, default: 0 },
    byCountry: mongoose.Schema.Types.Mixed,
    byReferrer: mongoose.Schema.Types.Mixed
  },
  engagements: {
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    retweets: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    reach: { type: Number, default: 0 }
  },
  conversions: {
    signups: { type: Number, default: 0 },
    streakStarts: { type: Number, default: 0 },
    premiumUpgrades: { type: Number, default: 0 },
    revenueGenerated: { type: Number, default: 0 }
  },
  performance: {
    clickThroughRate: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 },
    viralityScore: { type: Number, default: 0 }
  },
  metadata: {
    campaignId: String,
    source: String,
    device: String,
    browser: String,
    os: String,
    ipAddress: String,
    userAgent: String,
    screenResolution: String,
    language: String,
    timezone: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    utmTerm: String,
    utmContent: String
  },
  tracking: {
    shareId: String, // Unique ID for this share
    parentShareId: String, // For tracking shares of shares
    attributionWindow: Number, // in hours
    lastClickAt: Date,
    lastEngagementAt: Date
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes
shareAnalyticsSchema.index({ user: 1, streak: 1 });
shareAnalyticsSchema.index({ platform: 1, createdAt: -1 });
shareAnalyticsSchema.index({ 'shareData.url': 1 });
shareAnalyticsSchema.index({ 'tracking.shareId': 1 });
shareAnalyticsSchema.index({ 'metadata.campaignId': 1 });
shareAnalyticsSchema.index({ createdAt: -1 });
shareAnalyticsSchema.index({ expiresAt: 1 });

// Virtual for age
shareAnalyticsSchema.virtual('ageInHours').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60));
});

// Virtual for isExpired
shareAnalyticsSchema.virtual('isExpired').get(function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

// Virtual for roi
shareAnalyticsSchema.virtual('roi').get(function() {
  if (this.conversions.revenueGenerated === 0) return 0;
  
  // Assuming each share has some cost (could be 0)
  const cost = 0; // This would come from campaign data
  return ((this.conversions.revenueGenerated - cost) / cost) * 100;
});

// Method to record click
shareAnalyticsSchema.methods.recordClick = function(clickData = {}) {
  this.clicks.total += 1;
  
  if (clickData.unique) {
    this.clicks.unique += 1;
  }
  
  if (clickData.device === 'mobile') {
    this.clicks.mobile += 1;
  } else if (clickData.device === 'desktop') {
    this.clicks.desktop += 1;
  }
  
  if (clickData.country) {
    if (!this.clicks.byCountry) {
      this.clicks.byCountry = {};
    }
    
    this.clicks.byCountry[clickData.country] = 
      (this.clicks.byCountry[clickData.country] || 0) + 1;
  }
  
  if (clickData.referrer) {
    if (!this.clicks.byReferrer) {
      this.clicks.byReferrer = {};
    }
    
    this.clicks.byReferrer[clickData.referrer] = 
      (this.clicks.byReferrer[clickData.referrer] || 0) + 1;
  }
  
  this.tracking.lastClickAt = new Date();
  
  // Update performance metrics
  this.updatePerformance();
  
  return this.save();
};

// Method to record engagement
shareAnalyticsSchema.methods.recordEngagement = function(type, count = 1) {
  if (this.engagements[type] !== undefined) {
    this.engagements[type] += count;
  }
  
  this.tracking.lastEngagementAt = new Date();
  
  // Update performance metrics
  this.updatePerformance();
  
  return this.save();
};

// Method to record conversion
shareAnalyticsSchema.methods.recordConversion = function(type, value = 1) {
  if (this.conversions[type] !== undefined) {
    this.conversions[type] += value;
  }
  
  // Update performance metrics
  this.updatePerformance();
  
  return this.save();
};

// Method to update performance metrics
shareAnalyticsSchema.methods.updatePerformance = function() {
  // Click-through rate
  if (this.engagements.impressions > 0) {
    this.performance.clickThroughRate = 
      Math.round((this.clicks.total / this.engagements.impressions) * 100);
  }
  
  // Conversion rate
  if (this.clicks.total > 0) {
    const totalConversions = 
      this.conversions.signups + 
      this.conversions.streakStarts + 
      this.conversions.premiumUpgrades;
    
    this.performance.conversionRate = 
      Math.round((totalConversions / this.clicks.total) * 100);
  }
  
  // Engagement rate
  if (this.engagements.impressions > 0) {
    const totalEngagements = 
      this.engagements.likes +
      this.engagements.comments +
      this.engagements.shares +
      this.engagements.retweets;
    
    this.performance.engagementRate = 
      Math.round((totalEngagements / this.engagements.impressions) * 100);
  }
  
  // Virality score (custom metric)
  this.performance.viralityScore = this.calculateViralityScore();
  
  return this;
};

// Method to calculate virality score
shareAnalyticsSchema.methods.calculateViralityScore = function() {
  let score = 0;
  
  // Base score from clicks
  score += Math.min(this.clicks.total, 1000) * 0.1;
  
  // Bonus for unique clicks
  score += this.clicks.unique * 0.2;
  
  // Engagements are valuable
  score += this.engagements.likes * 0.5;
  score += this.engagements.comments * 1;
  score += this.engagements.shares * 2;
  score += this.engagements.retweets * 1.5;
  
  // Conversions are most valuable
  score += this.conversions.signups * 10;
  score += this.conversions.streakStarts * 15;
  score += this.conversions.premiumUpgrades * 50;
  
  // Age penalty (older shares score less)
  const agePenalty = Math.min(this.ageInHours / 24, 1); // Max 1x penalty after 24 hours
  score *= (1 - agePenalty * 0.1); // Up to 10% penalty
  
  return Math.round(score);
};

// Method to get top performing platforms
shareAnalyticsSchema.statics.getTopPlatforms = async function(userId, limit = 5) {
  return this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$platform',
        totalShares: { $sum: 1 },
        totalClicks: { $sum: '$clicks.total' },
        totalConversions: { 
          $sum: { 
            $add: [
              '$conversions.signups',
              '$conversions.streakStarts',
              '$conversions.premiumUpgrades'
            ]
          }
        },
        averageViralityScore: { $avg: '$performance.viralityScore' }
      }
    },
    { $sort: { totalClicks: -1 } },
    { $limit: limit }
  ]);
};

// Static method to create share record
shareAnalyticsSchema.statics.createShare = function(userId, streakId, platform, shareData) {
  return this.create({
    user: userId,
    streak: streakId,
    platform,
    shareData,
    tracking: {
      shareId: require('crypto').randomBytes(16).toString('hex'),
      attributionWindow: 24 // 24 hours default
    },
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  });
};

// Static method to find viral streaks
shareAnalyticsSchema.statics.findViralStreaks = function(limit = 10, timeframe = 'week') {
  const timeframes = {
    day: 1,
    week: 7,
    month: 30,
    year: 365
  };
  
  const days = timeframes[timeframe] || 7;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  return this.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: '$streak',
        totalShares: { $sum: 1 },
        totalClicks: { $sum: '$clicks.total' },
        totalEngagements: { 
          $sum: { 
            $add: [
              '$engagements.likes',
              '$engagements.comments',
              '$engagements.shares',
              '$engagements.retweets'
            ]
          }
        },
        totalConversions: { 
          $sum: { 
            $add: [
              '$conversions.signups',
              '$conversions.streakStarts',
              '$conversions.premiumUpgrades'
            ]
          }
        },
        averageViralityScore: { $avg: '$performance.viralityScore' },
        topPlatforms: { $push: '$platform' }
      }
    },
    {
      $lookup: {
        from: 'streaks',
        localField: '_id',
        foreignField: '_id',
        as: 'streak'
      }
    },
    { $unwind: '$streak' },
    {
      $lookup: {
        from: 'users',
        localField: 'streak.userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        streak: '$streak.currentStreak',
        user: {
          displayName: '$user.displayName',
          username: '$user.username',
          avatar: '$user.avatar'
        },
        totalShares: 1,
        totalClicks: 1,
        totalEngagements: 1,
        totalConversions: 1,
        viralityScore: '$averageViralityScore',
        topPlatforms: {
          $slice: [
            {
              $reduce: {
                input: '$topPlatforms',
                initialValue: [],
                in: {
                  $concatArrays: [
                    '$$value',
                    {
                      $cond: [
                        { $in: ['$$this', '$$value.platform'] },
                        [],
                        [{ platform: '$$this', count: 1 }]
                      ]
                    }
                  ]
                }
              }
            },
            3
          ]
        }
      }
    },
    { $sort: { viralityScore: -1 } },
    { $limit: limit }
  ]);
};

module.exports = mongoose.model('ShareAnalytics', shareAnalyticsSchema);