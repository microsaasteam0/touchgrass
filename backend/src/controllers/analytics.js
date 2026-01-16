const Analytics = require('../models/Analytics');
const User = require('../models/user');
const Streak = require('../models/Streak');

// Get user analytics dashboard
exports.getUserAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const { timeframe = '30d' } = req.query;
    
    // Get user analytics
    const analytics = await Analytics.findOne({ userId });
    
    if (!analytics) {
      return res.json({
        success: true,
        data: {
          message: 'No analytics data yet',
          timeframe,
          summary: {},
          charts: {},
          insights: []
        }
      });
    }
    
    // Get user and streak data
    const user = await User.findById(userId);
    const streak = await Streak.findOne({ userId });
    
    // Generate timeframe-specific data
    const timeframeData = await getTimeframeData(userId, timeframe);
    
    // Calculate summary
    const summary = {
      currentStreak: user.stats.currentStreak,
      longestStreak: user.stats.longestStreak,
      consistency: user.stats.consistencyScore,
      totalDays: user.stats.totalDays,
      averageDailyTime: user.stats.averageDailyTime,
      rank: await user.getRank(),
      percentile: await user.getPercentile(),
      streakAge: streak ? Math.floor((Date.now() - streak.startDate) / (1000 * 60 * 60 * 24)) : 0
    };
    
    // Generate insights
    const insights = generateInsights(user, streak, timeframeData);
    
    // Prepare chart data
    const charts = {
      dailyActivity: await getDailyActivityChart(userId, timeframe),
      streakProgress: await getStreakProgressChart(userId, timeframe),
      verificationTypes: await getVerificationTypesChart(userId, timeframe),
      consistencyTrend: await getConsistencyTrendChart(userId, timeframe)
    };
    
    // Growth metrics
    const growth = await calculateGrowthMetrics(userId, timeframe);
    
    res.json({
      success: true,
      data: {
        timeframe,
        summary,
        analytics: {
          daily: analytics.daily,
          weekly: analytics.weekly,
          monthly: analytics.monthly,
          lifetime: analytics.lifetime,
          engagement: analytics.engagement,
          financial: analytics.financial
        },
        charts,
        insights,
        growth,
        recommendations: generateRecommendations(insights, growth)
      }
    });
    
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
};

// Get platform-wide analytics (admin)
exports.getPlatformAnalytics = async (req, res) => {
  try {
    // Check admin permissions
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }
    
    const { 
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
      endDate = new Date() 
    } = req.query;
    
    // User growth
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);
    
    // Daily active users
    const dailyActiveUsers = await User.aggregate([
      {
        $match: {
          lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      },
      { $count: 'count' }
    ]);
    
    // Total verifications
    const totalVerifications = await Streak.aggregate([
      { $unwind: '$history' },
      { $match: { 'history.verified': true } },
      { $count: 'count' }
    ]);
    
    // Revenue analytics
    const Payment = mongoose.model('Payment');
    const revenue = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalRevenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    // Retention rate (users active in last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeLastWeek = await User.countDocuments({
      lastActive: { $gte: weekAgo }
    });
    
    const totalUsers = await User.countDocuments();
    const retentionRate = totalUsers > 0 ? (activeLastWeek / totalUsers) * 100 : 0;
    
    // Geographic distribution
    const geographicDistribution = await User.aggregate([
      { $match: { 'location.country': { $exists: true, $ne: '' } } },
      { $group: { _id: '$location.country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Streak distribution
    const streakDistribution = await User.aggregate([
      { $match: { 'stats.currentStreak': { $gt: 0 } } },
      {
        $bucket: {
          groupBy: '$stats.currentStreak',
          boundaries: [0, 7, 30, 100, 365, Infinity],
          default: '365+',
          output: {
            count: { $sum: 1 },
            averageConsistency: { $avg: '$stats.consistencyScore' }
          }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        timeframe: { startDate, endDate },
        userGrowth,
        metrics: {
          totalUsers,
          dailyActiveUsers: dailyActiveUsers[0]?.count || 0,
          totalVerifications: totalVerifications[0]?.count || 0,
          retentionRate: Math.round(retentionRate * 10) / 10,
          averageStreak: await getAverageStreak(),
          monthlyRecurringRevenue: revenue.reduce((sum, r) => sum + r.totalRevenue, 0)
        },
        revenue,
        geographicDistribution,
        streakDistribution,
        topUsers: await getTopUsers(10),
        trends: await getPlatformTrends()
      }
    });
    
  } catch (error) {
    console.error('Platform analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch platform analytics'
    });
  }
};

// Real-time analytics events
exports.trackEvent = async (req, res) => {
  try {
    const { event, data } = req.body;
    const userId = req.userId;
    
    // Update analytics based on event
    switch (event) {
      case 'app_open':
        await trackAppOpen(userId, data);
        break;
      case 'verification_start':
        await trackVerificationStart(userId, data);
        break;
      case 'verification_complete':
        await trackVerificationComplete(userId, data);
        break;
      case 'challenge_join':
        await trackChallengeJoin(userId, data);
        break;
      case 'share':
        await trackShare(userId, data);
        break;
      case 'payment':
        await trackPayment(userId, data);
        break;
      case 'referral':
        await trackReferral(userId, data);
        break;
    }
    
    res.json({
      success: true,
      message: 'Event tracked'
    });
    
  } catch (error) {
    console.error('Event tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track event'
    });
  }
};

// Helper functions
async function getTimeframeData(userId, timeframe) {
  const now = new Date();
  let startDate;
  
  switch (timeframe) {
    case '7d':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case '30d':
      startDate = new Date(now.setDate(now.getDate() - 30));
      break;
    case '90d':
      startDate = new Date(now.setDate(now.getDate() - 90));
      break;
    case '1y':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setDate(now.getDate() - 30));
  }
  
  // Get streak history for timeframe
  const streak = await Streak.findOne({ userId });
  if (!streak) return [];
  
  return streak.history.filter(entry => 
    new Date(entry.date) >= startDate
  );
}

async function getDailyActivityChart(userId, timeframe) {
  const timeframeData = await getTimeframeData(userId, timeframe);
  
  // Group by day
  const dailyData = {};
  timeframeData.forEach(entry => {
    const date = new Date(entry.date).toISOString().split('T')[0];
    if (!dailyData[date]) {
      dailyData[date] = {
        date,
        verifications: 0,
        duration: 0,
        photos: 0,
        shame: 0
      };
    }
    
    if (entry.verified) {
      dailyData[date].verifications += 1;
      dailyData[date].duration += entry.duration || 0;
      
      if (entry.verificationMethod === 'photo') {
        dailyData[date].photos += 1;
      } else if (entry.verificationMethod === 'shame') {
        dailyData[date].shame += 1;
      }
    }
  });
  
  // Convert to array and sort by date
  return Object.values(dailyData)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

async function getStreakProgressChart(userId, timeframe) {
  const timeframeData = await getTimeframeData(userId, timeframe);
  
  // Calculate streak progression
  let currentStreak = 0;
  let maxStreak = 0;
  const streakProgression = [];
  
  timeframeData
    .filter(entry => entry.verified)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach(entry => {
      const date = new Date(entry.date);
      
      // Check if consecutive
      if (streakProgression.length > 0) {
        const lastDate = new Date(streakProgression[streakProgression.length - 1].date);
        const diffDays = Math.floor((date - lastDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      
      maxStreak = Math.max(maxStreak, currentStreak);
      
      streakProgression.push({
        date: date.toISOString().split('T')[0],
        streak: currentStreak
      });
    });
  
  return {
    progression: streakProgression,
    maxStreak
  };
}

async function getVerificationTypesChart(userId, timeframe) {
  const timeframeData = await getTimeframeData(userId, timeframe);
  
  const types = {
    photo: 0,
    location: 0,
    shame: 0,
    manual: 0,
    freeze: 0
  };
  
  timeframeData.forEach(entry => {
    if (types[entry.verificationMethod] !== undefined) {
      types[entry.verificationMethod]++;
    }
  });
  
  return types;
}

async function getConsistencyTrendChart(userId, timeframe) {
  const timeframeData = await getTimeframeData(userId, timeframe);
  
  // Group by week
  const weeklyConsistency = {};
  timeframeData.forEach(entry => {
    const date = new Date(entry.date);
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weeklyConsistency[weekKey]) {
      weeklyConsistency[weekKey] = {
        week: weekKey,
        total: 0,
        verified: 0
      };
    }
    
    weeklyConsistency[weekKey].total += 1;
    if (entry.verified) {
      weeklyConsistency[weekKey].verified += 1;
    }
  });
  
  // Calculate percentages
  return Object.values(weeklyConsistency)
    .map(week => ({
      ...week,
      consistency: week.total > 0 ? Math.round((week.verified / week.total) * 100) : 0
    }))
    .sort((a, b) => new Date(a.week) - new Date(b.week));
}

function generateInsights(user, streak, timeframeData) {
  const insights = [];
  
  // Current streak insight
  if (user.stats.currentStreak >= 7) {
    insights.push({
      type: 'success',
      title: '🔥 Current Streak',
      message: `You're on a ${user.stats.currentStreak}-day streak! Keep it up!`,
      icon: '🔥'
    });
  }
  
  // Consistency insight
  if (user.stats.consistencyScore >= 90) {
    insights.push({
      type: 'success',
      title: '📊 High Consistency',
      message: `Your ${user.stats.consistencyScore}% consistency is excellent!`,
      icon: '📊'
    });
  } else if (user.stats.consistencyScore < 70) {
    insights.push({
      type: 'warning',
      title: '📉 Consistency Alert',
      message: `Your consistency is ${user.stats.consistencyScore}%. Try to verify more consistently.`,
      icon: '📉'
    });
  }
  
  // Shame days insight
  if (user.stats.shameDays > 0) {
    insights.push({
      type: 'info',
      title: '😔 Shame Days',
      message: `You have ${user.stats.shameDays} shame day${user.stats.shameDays > 1 ? 's' : ''}. Try to reduce these!`,
      icon: '😔'
    });
  }
  
  // Daily time insight
  if (user.stats.averageDailyTime < 20) {
    insights.push({
      type: 'info',
      title: '⏱️ Time Outdoors',
      message: `You average ${user.stats.averageDailyTime} minutes outdoors. Try for 30+ minutes!`,
      icon: '⏱️'
    });
  }
  
  // Next milestone insight
  const nextMilestone = [7, 30, 100, 365].find(m => m > user.stats.currentStreak);
  if (nextMilestone) {
    const daysToGo = nextMilestone - user.stats.currentStreak;
    insights.push({
      type: 'goal',
      title: '🎯 Next Milestone',
      message: `${daysToGo} day${daysToGo > 1 ? 's' : ''} until ${nextMilestone}-day milestone!`,
      icon: '🎯'
    });
  }
  
  return insights;
}

async function calculateGrowthMetrics(userId, timeframe) {
  const user = await User.findById(userId);
  const streak = await Streak.findOne({ userId });
  
  if (!streak) {
    return {
      streakGrowth: 0,
      consistencyGrowth: 0,
      timeGrowth: 0
    };
  }
  
  // Calculate streak growth over timeframe
  const timeframeData = await getTimeframeData(userId, timeframe);
  const firstHalf = timeframeData.slice(0, Math.floor(timeframeData.length / 2));
  const secondHalf = timeframeData.slice(Math.floor(timeframeData.length / 2));
  
  const firstConsistency = firstHalf.length > 0 
    ? (firstHalf.filter(e => e.verified).length / firstHalf.length) * 100 
    : 0;
  const secondConsistency = secondHalf.length > 0 
    ? (secondHalf.filter(e => e.verified).length / secondHalf.length) * 100 
    : 0;
  
  const firstAvgTime = firstHalf.length > 0 
    ? firstHalf.reduce((sum, e) => sum + (e.duration || 0), 0) / firstHalf.length 
    : 0;
  const secondAvgTime = secondHalf.length > 0 
    ? secondHalf.reduce((sum, e) => sum + (e.duration || 0), 0) / secondHalf.length 
    : 0;
  
  return {
    streakGrowth: user.stats.currentStreak - (streak.history.length - timeframeData.length),
    consistencyGrowth: Math.round((secondConsistency - firstConsistency) * 10) / 10,
    timeGrowth: Math.round((secondAvgTime - firstAvgTime) * 10) / 10
  };
}

function generateRecommendations(insights, growth) {
  const recommendations = [];
  
  // Based on insights
  insights.forEach(insight => {
    if (insight.type === 'warning') {
      recommendations.push({
        priority: 'high',
        action: insight.message,
        benefit: 'Improve your consistency and streak'
      });
    }
  });
  
  // Based on growth
  if (growth.consistencyGrowth < 0) {
    recommendations.push({
      priority: 'medium',
      action: 'Try to verify at the same time each day',
      benefit: 'Builds habit consistency'
    });
  }
  
  if (growth.timeGrowth < 0) {
    recommendations.push({
      priority: 'low',
      action: 'Increase your outdoor time by 5 minutes daily',
      benefit: 'Better health benefits'
    });
  }
  
  // Always include some default recommendations
  recommendations.push({
    priority: 'low',
    action: 'Share your streak on social media',
    benefit: 'Builds accountability and community'
  });
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

async function getAverageStreak() {
  const result = await User.aggregate([
    { $match: { 'stats.currentStreak': { $gt: 0 } } },
    { $group: { _id: null, average: { $avg: '$stats.currentStreak' } } }
  ]);
  
  return Math.round((result[0]?.average || 0) * 10) / 10;
}

async function getTopUsers(limit) {
  return await User.find({ 'preferences.showOnLeaderboard': true })
    .sort({ 'stats.currentStreak': -1 })
    .limit(limit)
    .select('username displayName avatar stats.currentStreak stats.consistencyScore')
    .lean();
}

async function getPlatformTrends() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  // New users trend
  const newUsers = await User.countDocuments({
    createdAt: { $gte: weekAgo }
  });
  
  // New verifications trend
  const newVerifications = await Streak.aggregate([
    { $unwind: '$history' },
    {
      $match: {
        'history.date': { $gte: weekAgo },
        'history.verified': true
      }
    },
    { $count: 'count' }
  ]);
  
  // Revenue trend
  const Payment = mongoose.model('Payment');
  const newRevenue = await Payment.aggregate([
    {
      $match: {
        createdAt: { $gte: weekAgo },
        status: 'completed'
      }
    },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  
  return {
    newUsers,
    newVerifications: newVerifications[0]?.count || 0,
    newRevenue: newRevenue[0]?.total || 0,
    userGrowthRate: await calculateGrowthRate('users'),
    verificationGrowthRate: await calculateGrowthRate('verifications')
  };
}

async function calculateGrowthRate(type) {
  const now = new Date();
  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
  
  const lastWeekStart = new Date(currentWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  
  let currentCount, lastCount;
  
  if (type === 'users') {
    currentCount = await User.countDocuments({
      createdAt: { $gte: currentWeekStart }
    });
    lastCount = await User.countDocuments({
      createdAt: { $gte: lastWeekStart, $lt: currentWeekStart }
    });
  } else if (type === 'verifications') {
    const currentResult = await Streak.aggregate([
      { $unwind: '$history' },
      {
        $match: {
          'history.date': { $gte: currentWeekStart },
          'history.verified': true
        }
      },
      { $count: 'count' }
    ]);
    
    const lastResult = await Streak.aggregate([
      { $unwind: '$history' },
      {
        $match: {
          'history.date': { $gte: lastWeekStart, $lt: currentWeekStart },
          'history.verified': true
        }
      },
      { $count: 'count' }
    ]);
    
    currentCount = currentResult[0]?.count || 0;
    lastCount = lastResult[0]?.count || 0;
  }
  
  return lastCount > 0 
    ? Math.round(((currentCount - lastCount) / lastCount) * 1000) / 10 
    : currentCount > 0 ? 100 : 0;
}

// Event tracking helpers
async function trackAppOpen(userId, data) {
  const analytics = await Analytics.findOne({ userId });
  if (analytics) {
    analytics.daily.sessions.push({
      startTime: new Date(),
      endTime: null,
      duration: 0,
      actions: 1,
      device: data.device || 'unknown',
      screen: data.screen || 'home'
    });
    await analytics.save();
  }
}

async function trackVerificationStart(userId, data) {
  // Track verification start event
  const Event = mongoose.model('Event');
  await Event.create({
    userId,
    type: 'verification_start',
    data,
    timestamp: new Date()
  });
}

async function trackVerificationComplete(userId, data) {
  const Event = mongoose.model('Event');
  await Event.create({
    userId,
    type: 'verification_complete',
    data,
    timestamp: new Date()
  });
}

async function trackChallengeJoin(userId, data) {
  const analytics = await Analytics.findOne({ userId });
  if (analytics) {
    analytics.daily.challengesJoined += 1;
    await analytics.save();
  }
  
  const Event = mongoose.model('Event');
  await Event.create({
    userId,
    type: 'challenge_join',
    data,
    timestamp: new Date()
  });
}

async function trackShare(userId, data) {
  const analytics = await Analytics.findOne({ userId });
  if (analytics) {
    analytics.daily.shares += 1;
    await analytics.save();
  }
  
  const user = await User.findById(userId);
  user.stats.sharesCount += 1;
  await user.save();
}

async function trackPayment(userId, data) {
  const analytics = await Analytics.findOne({ userId });
  if (analytics) {
    analytics.daily.revenueGenerated += data.amount || 0;
    await analytics.save();
  }
}

async function trackReferral(userId, data) {
  const analytics = await Analytics.findOne({ userId });
  if (analytics) {
    analytics.daily.referrals += 1;
    await analytics.save();
  }
  
  const user = await User.findById(userId);
  user.stats.referralCount += 1;
  await user.save();
}