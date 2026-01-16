const redis = require('redis');
const mongoose = require('mongoose');
const User = require('../models/user');
const Streak = require('../models/Streak');
const ShareAnalytics = require('../models/ShareAnalytics');
const Payment = require('../models/Payment');

// Initialize Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

redisClient.connect().catch(console.error);

class AnalyticsService {
  constructor() {
    this.cacheDuration = 300; // 5 minutes
  }

  async getPlatformAnalytics(timeframe = 'month') {
    const cacheKey = `analytics:platform:${timeframe}`;
    
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err) {
      console.warn('Redis cache miss:', err);
    }

    const dateFilter = this.getDateFilter(timeframe);
    
    const analytics = {
      users: await this.getUserAnalytics(dateFilter),
      streaks: await this.getStreakAnalytics(dateFilter),
      engagement: await this.getEngagementAnalytics(dateFilter),
      revenue: await this.getRevenueAnalytics(dateFilter),
      virality: await this.getViralityAnalytics(dateFilter),
      predictions: await this.getPredictions()
    };

    try {
      await redisClient.setEx(cacheKey, this.cacheDuration, JSON.stringify(analytics));
    } catch (err) {
      console.warn('Redis cache set failed:', err);
    }

    return analytics;
  }

  async getUserAnalytics(dateFilter) {
    const [
      totalUsers,
      newUsers,
      activeUsers,
      returningUsers,
      churnedUsers,
      premiumUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: dateFilter }),
      User.countDocuments({ 'stats.lastActive': dateFilter }),
      User.countDocuments({
        'stats.lastActive': dateFilter,
        createdAt: { $lt: dateFilter.$gte }
      }),
      User.countDocuments({
        'stats.lastActive': { $lt: dateFilter.$gte },
        'subscription.active': true
      }),
      User.countDocuments({ 'subscription.plan': { $ne: 'free' } })
    ]);

    const retentionRate = newUsers > 0 
      ? ((returningUsers / newUsers) * 100).toFixed(2)
      : 0;

    return {
      totalUsers,
      newUsers,
      activeUsers,
      returningUsers,
      churnedUsers,
      premiumUsers,
      retentionRate: `${retentionRate}%`,
      freeToPaidConversion: `${((premiumUsers / totalUsers) * 100).toFixed(2)}%`
    };
  }

  async getStreakAnalytics(dateFilter) {
    const [
      totalStreaks,
      activeStreaks,
      brokenStreaks,
      avgStreakLength,
      streakDistribution,
      completionRate
    ] = await Promise.all([
      Streak.countDocuments(),
      Streak.countDocuments({ status: 'active' }),
      Streak.countDocuments({ 
        status: 'broken',
        updatedAt: dateFilter 
      }),
      Streak.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: null, avg: { $avg: '$currentStreak' } } }
      ]),
      this.getStreakDistribution(),
      this.getStreakCompletionRate(dateFilter)
    ]);

    return {
      totalStreaks,
      activeStreaks,
      brokenStreaks,
      avgStreakLength: avgStreakLength[0]?.avg?.toFixed(2) || 0,
      streakDistribution,
      completionRate: `${completionRate}%`,
      successRate: `${100 - completionRate}%`
    };
  }

  async getStreakDistribution() {
    const distributions = await Streak.aggregate([
      {
        $facet: {
          '1-7': [
            { $match: { currentStreak: { $gte: 1, $lte: 7 } } },
            { $count: 'count' }
          ],
          '8-30': [
            { $match: { currentStreak: { $gte: 8, $lte: 30 } } },
            { $count: 'count' }
          ],
          '31-100': [
            { $match: { currentStreak: { $gte: 31, $lte: 100 } } },
            { $count: 'count' }
          ],
          '100+': [
            { $match: { currentStreak: { $gte: 101 } } },
            { $count: 'count' }
          ]
        }
      }
    ]);

    return {
      '1-7': distributions[0]['1-7'][0]?.count || 0,
      '8-30': distributions[0]['8-30'][0]?.count || 0,
      '31-100': distributions[0]['31-100'][0]?.count || 0,
      '100+': distributions[0]['100+'][0]?.count || 0
    };
  }

  async getStreakCompletionRate(dateFilter) {
    const totalDays = await Streak.aggregate([
      { $match: { 'history.date': dateFilter } },
      { $unwind: '$history' },
      { $match: { 'history.date': dateFilter } },
      { $count: 'total' }
    ]);

    const completedDays = await Streak.aggregate([
      { $match: { 'history.date': dateFilter, 'history.verified': true } },
      { $unwind: '$history' },
      { $match: { 'history.date': dateFilter, 'history.verified': true } },
      { $count: 'completed' }
    ]);

    const total = totalDays[0]?.total || 0;
    const completed = completedDays[0]?.completed || 0;

    return total > 0 ? ((completed / total) * 100).toFixed(2) : 0;
  }

  async getEngagementAnalytics(dateFilter) {
    const [
      dailyActiveUsers,
      avgSessionDuration,
      verificationRate,
      shameAcceptanceRate,
      featureUsage
    ] = await Promise.all([
      User.countDocuments({ 'stats.lastActive': { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
      this.getAvgSessionDuration(dateFilter),
      this.getVerificationRate(dateFilter),
      this.getShameAcceptanceRate(dateFilter),
      this.getFeatureUsage(dateFilter)
    ]);

    return {
      dailyActiveUsers,
      avgSessionDuration: `${avgSessionDuration} minutes`,
      verificationRate: `${verificationRate}%`,
      shameAcceptanceRate: `${shameAcceptanceRate}%`,
      featureUsage,
      avgStreaksPerUser: await this.getAvgStreaksPerUser()
    };
  }

  async getAvgSessionDuration(dateFilter) {
    const result = await Streak.aggregate([
      { $match: { 'history.date': dateFilter } },
      { $unwind: '$history' },
      { $match: { 'history.date': dateFilter, 'history.duration': { $exists: true } } },
      { $group: { _id: null, avg: { $avg: '$history.duration' } } }
    ]);

    return result[0]?.avg?.toFixed(2) || 15;
  }

  async getVerificationRate(dateFilter) {
    const total = await Streak.countDocuments({ 'history.date': dateFilter });
    const verified = await Streak.countDocuments({
      'history.date': dateFilter,
      'history.verified': true
    });

    return total > 0 ? ((verified / total) * 100).toFixed(2) : 0;
  }

  async getShameAcceptanceRate(dateFilter) {
    const shameEntries = await Streak.countDocuments({
      'history.date': dateFilter,
      'history.verificationMethod': 'shame'
    });

    const totalMissed = await Streak.countDocuments({
      'history.date': dateFilter,
      'history.verified': false
    });

    return totalMissed > 0 ? ((shameEntries / totalMissed) * 100).toFixed(2) : 0;
  }

  async getFeatureUsage(dateFilter) {
    const result = await Streak.aggregate([
      { $match: { 'history.date': dateFilter } },
      { $unwind: '$history' },
      { $match: { 'history.date': dateFilter } },
      { $group: {
        _id: '$history.verificationMethod',
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 } }
    ]);

    return result.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});
  }

  async getAvgStreaksPerUser() {
    const result = await User.aggregate([
      { $group: {
        _id: null,
        avgStreaks: { $avg: '$stats.currentStreak' }
      }}
    ]);

    return result[0]?.avgStreaks?.toFixed(2) || 0;
  }

  async getRevenueAnalytics(dateFilter) {
    const [
      totalRevenue,
      mrr,
      arr,
      revenueByPlan,
      streakRestorationRevenue,
      averageRevenuePerUser,
      lifetimeValue
    ] = await Promise.all([
      Payment.aggregate([
        { $match: { status: 'completed', createdAt: dateFilter } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      this.calculateMRR(),
      this.calculateARR(),
      this.getRevenueByPlan(dateFilter),
      this.getStreakRestorationRevenue(dateFilter),
      this.getAverageRevenuePerUser(),
      this.getLifetimeValue()
    ]);

    return {
      totalRevenue: totalRevenue[0]?.total || 0,
      mrr: `$${mrr.toFixed(2)}`,
      arr: `$${arr.toFixed(2)}`,
      revenueByPlan,
      streakRestorationRevenue,
      averageRevenuePerUser: `$${averageRevenuePerUser.toFixed(2)}`,
      lifetimeValue: `$${lifetimeValue.toFixed(2)}`,
      churnRate: await this.getChurnRate(dateFilter)
    };
  }

  async calculateMRR() {
    const plans = {
      premium: 14.99,
      elite: 29.99,
      enterprise: 99.99
    };

    const subscribers = await User.aggregate([
      { $match: { 'subscription.active': true } },
      { $group: {
        _id: '$subscription.plan',
        count: { $sum: 1 }
      }}
    ]);

    return subscribers.reduce((total, sub) => {
      const planRate = plans[sub._id] || 0;
      return total + (sub.count * planRate);
    }, 0);
  }

  async calculateARR() {
    const mrr = await this.calculateMRR();
    return mrr * 12;
  }

  async getRevenueByPlan(dateFilter) {
    const result = await Payment.aggregate([
      { $match: { status: 'completed', createdAt: dateFilter } },
      { $group: {
        _id: '$plan',
        revenue: { $sum: '$amount' },
        transactions: { $sum: 1 }
      }},
      { $sort: { revenue: -1 } }
    ]);

    return result;
  }

  async getStreakRestorationRevenue(dateFilter) {
    const result = await Payment.aggregate([
      { 
        $match: { 
          status: 'completed',
          type: 'streak_restoration',
          createdAt: dateFilter
        }
      },
      { $group: {
        _id: null,
        revenue: { $sum: '$amount' },
        count: { $sum: 1 }
      }}
    ]);

    return {
      revenue: result[0]?.revenue || 0,
      transactions: result[0]?.count || 0,
      avgRestorationAmount: result[0]?.revenue ? (result[0].revenue / result[0].count).toFixed(2) : 0
    };
  }

  async getAverageRevenuePerUser() {
    const [totalRevenue, totalUsers] = await Promise.all([
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      User.countDocuments({ 'subscription.active': true })
    ]);

    const revenue = totalRevenue[0]?.total || 0;
    return totalUsers > 0 ? revenue / totalUsers : 0;
  }

  async getLifetimeValue() {
    const avgRevenuePerUser = await this.getAverageRevenuePerUser();
    const avgCustomerLifetime = 12; // months - adjust based on actual data
    
    return avgRevenuePerUser * avgCustomerLifetime;
  }

  async getChurnRate(dateFilter) {
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const [startSubscribers, endSubscribers] = await Promise.all([
      User.countDocuments({
        'subscription.active': true,
        'subscription.currentPeriodEnd': { $gte: monthAgo }
      }),
      User.countDocuments({
        'subscription.active': true,
        'subscription.currentPeriodEnd': { $gte: new Date() }
      })
    ]);

    return startSubscribers > 0 
      ? (((startSubscribers - endSubscribers) / startSubscribers) * 100).toFixed(2)
      : 0;
  }

  async getViralityAnalytics(dateFilter) {
    const [
      totalShares,
      sharesByPlatform,
      referralSignups,
      viralCoefficient,
      topSharedStreaks
    ] = await Promise.all([
      ShareAnalytics.countDocuments({ timestamp: dateFilter }),
      this.getSharesByPlatform(dateFilter),
      this.getReferralSignups(dateFilter),
      this.calculateViralCoefficient(dateFilter),
      this.getTopSharedStreaks(dateFilter)
    ]);

    return {
      totalShares,
      sharesByPlatform,
      referralSignups,
      viralCoefficient: viralCoefficient.toFixed(2),
      topSharedStreaks,
      avgSharesPerUser: totalShares > 0 ? (totalShares / await User.countDocuments()).toFixed(2) : 0
    };
  }

  async getSharesByPlatform(dateFilter) {
    const result = await ShareAnalytics.aggregate([
      { $match: { timestamp: dateFilter } },
      { $group: {
        _id: '$platform',
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 } }
    ]);

    return result;
  }

  async getReferralSignups(dateFilter) {
    const result = await User.aggregate([
      { $match: { 
        createdAt: dateFilter,
        referredBy: { $exists: true, $ne: null }
      }},
      { $group: {
        _id: '$referredBy',
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 } }
    ]);

    return {
      total: result.reduce((sum, item) => sum + item.count, 0),
      topReferrers: result.slice(0, 10)
    };
  }

  async calculateViralCoefficient(dateFilter) {
    const shares = await ShareAnalytics.countDocuments({ timestamp: dateFilter });
    const signups = await User.countDocuments({ createdAt: dateFilter });
    
    // Basic viral coefficient calculation
    // In production, you'd want more sophisticated tracking
    return signups > 0 ? (shares / signups) : 0;
  }

  async getTopSharedStreaks(dateFilter) {
    const result = await ShareAnalytics.aggregate([
      { $match: { timestamp: dateFilter } },
      { $group: {
        _id: '$streakId',
        shareCount: { $sum: 1 }
      }},
      { $sort: { shareCount: -1 } },
      { $limit: 10 },
      { $lookup: {
        from: 'streaks',
        localField: '_id',
        foreignField: '_id',
        as: 'streak'
      }},
      { $unwind: '$streak' },
      { $lookup: {
        from: 'users',
        localField: 'streak.userId',
        foreignField: '_id',
        as: 'user'
      }},
      { $unwind: '$user' },
      { $project: {
        streakId: '$_id',
        shareCount: 1,
        'user.displayName': 1,
        'user.username': 1,
        'streak.currentStreak': 1
      }}
    ]);

    return result;
  }

  async getPredictions() {
    // Simple prediction model - in production, use ML models
    const currentUsers = await User.countDocuments();
    const growthRate = 0.05; // 5% weekly growth (adjust based on historical data)
    const weeks = 12; // Predict 12 weeks ahead

    return {
      predictedUsers: Math.round(currentUsers * Math.pow(1 + growthRate, weeks)),
      predictedRevenue: await this.predictRevenue(growthRate, weeks),
      growthOpportunities: await this.identifyGrowthOpportunities()
    };
  }

  async predictRevenue(growthRate, weeks) {
    const currentMRR = await this.calculateMRR();
    const avgRevenuePerUser = await this.getAverageRevenuePerUser();
    const currentUsers = await User.countDocuments();
    
    const predictedUsers = Math.round(currentUsers * Math.pow(1 + growthRate, weeks));
    const newUsers = predictedUsers - currentUsers;
    
    return currentMRR + (newUsers * avgRevenuePerUser);
  }

  async identifyGrowthOpportunities() {
    const opportunities = [];
    
    // Check for low-hanging fruit
    const verificationRate = await this.getVerificationRate(this.getDateFilter('week'));
    if (verificationRate < 80) {
      opportunities.push({
        area: 'verification',
        issue: 'Low verification rate',
        impact: 'High',
        recommendation: 'Implement reminder system and gamification'
      });
    }

    const shameRate = await this.getShameAcceptanceRate(this.getDateFilter('week'));
    if (shameRate > 30) {
      opportunities.push({
        area: 'shame',
        issue: 'High shame acceptance',
        impact: 'Medium',
        recommendation: 'Add more incentives for verification'
      });
    }

    const churnRate = await this.getChurnRate(this.getDateFilter('month'));
    if (churnRate > 5) {
      opportunities.push({
        area: 'retention',
        issue: 'High churn rate',
        impact: 'Critical',
        recommendation: 'Improve onboarding and add win-back campaigns'
      });
    }

    return opportunities;
  }

  getDateFilter(timeframe) {
    const now = new Date();
    let startDate;

    switch (timeframe) {
      case 'day':
        startDate = new Date(now.setDate(now.getDate() - 1));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'quarter':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    return { $gte: startDate };
  }

  async trackEvent(userId, eventType, metadata = {}) {
    const Event = require('../models/AnalyticsEvent');
    
    await Event.create({
      userId,
      eventType,
      metadata,
      timestamp: new Date(),
      userAgent: metadata.userAgent,
      ipAddress: metadata.ipAddress
    });

    // Update user's last active timestamp
    await User.findByIdAndUpdate(userId, {
      'stats.lastActive': new Date()
    });
  }

  async exportAnalytics(format = 'json', timeframe = 'month') {
    const analytics = await this.getPlatformAnalytics(timeframe);
    
    switch (format) {
      case 'csv':
        return this.convertToCSV(analytics);
      case 'excel':
        return this.convertToExcel(analytics);
      case 'pdf':
        return this.convertToPDF(analytics);
      default:
        return analytics;
    }
  }

  convertToCSV(data) {
    // Simple CSV conversion - implement based on your needs
    const lines = [];
    
    // Add headers
    lines.push('Category,Metric,Value');
    
    // Flatten the data structure
    this.flattenObject(data, lines);
    
    return lines.join('\n');
  }

  flattenObject(obj, lines, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        this.flattenObject(value, lines, prefix + key + '.');
      } else {
        lines.push(`${prefix}${key},${value}`);
      }
    }
  }
}

module.exports = new AnalyticsService();