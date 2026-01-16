const User = require('../models/user');
const Streak = require('../models/Streak');
const { redis } = require('../config/redis');
const { LEADERBOARD, ERROR_CODES, API_MESSAGES } = require('../config/constants');

/**
 * Leaderboard Controller
 * Handles global rankings, city rankings, and competition statistics
 */

class LeaderboardController {
  /**
   * Get global streak leaderboard
   */
  async getGlobalStreakLeaderboard(req, res) {
    try {
      const { page = 1, limit = 50 } = req.query;
      const skip = (page - 1) * limit;
      
      const cacheKey = `leaderboard:global:streak:${page}:${limit}`;
      
      // Try cache first
      const cached = await redis.cache.get(cacheKey);
      if (cached) {
        return res.json({
          message: API_MESSAGES.SUCCESS,
          ...cached,
          cached: true
        });
      }

      // Get users with active streaks
      const users = await User.aggregate([
        {
          $match: {
            'preferences.showOnLeaderboard': true,
            'stats.currentStreak': { $gt: 0 }
          }
        },
        {
          $project: {
            username: 1,
            displayName: 1,
            avatar: 1,
            location: 1,
            stats: 1,
            shameCount: 1,
            subscription: 1,
            streakScore: {
              $add: [
                '$stats.currentStreak',
                { $multiply: ['$stats.consistencyScore', 0.1] },
                { $multiply: ['$stats.totalDays', 0.01] },
                { $multiply: ['$shameCount', -1] }
              ]
            }
          }
        },
        { $sort: { streakScore: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ]);

      // Add ranks and badges
      const rankedUsers = users.map((user, index) => ({
        rank: skip + index + 1,
        ...user,
        badge: this.getBadgeForRank(skip + index + 1),
        isPremium: user.subscription.plan !== 'free'
      }));

      // Get total count
      const total = await User.countDocuments({
        'preferences.showOnLeaderboard': true,
        'stats.currentStreak': { $gt: 0 }
      });

      // Get user's rank if authenticated
      let userRank = null;
      if (req.userId) {
        userRank = await this.getUserRank(req.userId, 'global_streak');
      }

      const result = {
        leaderboard: rankedUsers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        userRank,
        updatedAt: new Date().toISOString()
      };

      // Cache for 5 minutes
      await redis.cache.set(cacheKey, result, LEADERBOARD.CACHE_DURATION.SHORT);

      res.json({
        message: API_MESSAGES.SUCCESS,
        ...result,
        cached: false
      });
    } catch (error) {
      console.error('Get global streak leaderboard error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Get consistency leaderboard
   */
  async getConsistencyLeaderboard(req, res) {
    try {
      const { page = 1, limit = 50, minDays = 30 } = req.query;
      const skip = (page - 1) * limit;
      
      const cacheKey = `leaderboard:consistency:${minDays}:${page}:${limit}`;

      // Try cache first
      const cached = await redis.cache.get(cacheKey);
      if (cached) {
        return res.json({
          message: API_MESSAGES.SUCCESS,
          ...cached,
          cached: true
        });
      }

      const users = await User.aggregate([
        {
          $match: {
            'preferences.showOnLeaderboard': true,
            'stats.totalDays': { $gte: parseInt(minDays) },
            'stats.consistencyScore': { $gt: 0 }
          }
        },
        {
          $project: {
            username: 1,
            displayName: 1,
            avatar: 1,
            location: 1,
            stats: 1,
            subscription: 1,
            consistencyScore: '$stats.consistencyScore'
          }
        },
        { $sort: { consistencyScore: -1, 'stats.totalDays': -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ]);

      // Add ranks
      const rankedUsers = users.map((user, index) => ({
        rank: skip + index + 1,
        ...user,
        badge: this.getBadgeForRank(skip + index + 1),
        isPremium: user.subscription.plan !== 'free'
      }));

      // Get total count
      const total = await User.countDocuments({
        'preferences.showOnLeaderboard': true,
        'stats.totalDays': { $gte: parseInt(minDays) },
        'stats.consistencyScore': { $gt: 0 }
      });

      // Get user's rank if authenticated
      let userRank = null;
      if (req.userId) {
        userRank = await this.getUserRank(req.userId, 'consistency');
      }

      const result = {
        leaderboard: rankedUsers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        userRank,
        updatedAt: new Date().toISOString()
      };

      // Cache for 5 minutes
      await redis.cache.set(cacheKey, result, LEADERBOARD.CACHE_DURATION.SHORT);

      res.json({
        message: API_MESSAGES.SUCCESS,
        ...result,
        cached: false
      });
    } catch (error) {
      console.error('Get consistency leaderboard error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Get weekly challenge leaderboard
   */
  async getWeeklyLeaderboard(req, res) {
    try {
      const { page = 1, limit = 50 } = req.query;
      const skip = (page - 1) * limit;
      
      const cacheKey = `leaderboard:weekly:${page}:${limit}`;
      
      // Try cache first
      const cached = await redis.cache.get(cacheKey);
      if (cached) {
        return res.json({
          message: API_MESSAGES.SUCCESS,
          ...cached,
          cached: true
        });
      }

      // Calculate start of week (Monday)
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
      startOfWeek.setHours(0, 0, 0, 0);

      // Get streaks with activity this week
      const streaks = await Streak.aggregate([
        {
          $match: {
            status: 'active',
            lastUpdated: { $gte: startOfWeek }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $match: {
            'user.preferences.showOnLeaderboard': true
          }
        },
        {
          $group: {
            _id: '$userId',
            user: { $first: '$user' },
            weeklyProgress: {
              $sum: {
                $size: {
                  $filter: {
                    input: '$history',
                    as: 'entry',
                    cond: {
                      $and: [
                        { $gte: ['$$entry.date', startOfWeek] },
                        { $eq: ['$$entry.verified', true] }
                      ]
                    }
                  }
                }
              }
            },
            streakLength: { $first: '$currentStreak' }
          }
        },
        { $sort: { weeklyProgress: -1, streakLength: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ]);

      // Format results
      const leaderboard = streaks.map((item, index) => ({
        rank: skip + index + 1,
        userId: item._id,
        username: item.user.username,
        displayName: item.user.displayName,
        avatar: item.user.avatar,
        location: item.user.location,
        weeklyProgress: item.weeklyProgress,
        streakLength: item.streakLength,
        badge: this.getBadgeForRank(skip + index + 1),
        isPremium: item.user.subscription.plan !== 'free'
      }));

      // Get total count
      const total = await Streak.distinct('userId', {
        status: 'active',
        lastUpdated: { $gte: startOfWeek }
      }).then(ids => ids.length);

      // Get user's rank if authenticated
      let userRank = null;
      if (req.userId) {
        userRank = await this.getUserRank(req.userId, 'weekly');
      }

      const result = {
        leaderboard,
        period: {
          start: startOfWeek,
          end: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000),
          current: now
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        userRank,
        updatedAt: new Date().toISOString()
      };

      // Cache for 15 minutes (weekly data changes slowly)
      await redis.cache.set(cacheKey, result, LEADERBOARD.CACHE_DURATION.MEDIUM);

      res.json({
        message: API_MESSAGES.SUCCESS,
        ...result,
        cached: false
      });
    } catch (error) {
      console.error('Get weekly leaderboard error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Get city leaderboard
   */
  async getCityLeaderboard(req, res) {
    try {
      const { city, page = 1, limit = 50 } = req.query;
      const skip = (page - 1) * limit;

      if (!city) {
        return res.status(400).json({
          error: 'City parameter is required',
          code: ERROR_CODES.VALIDATION_FAILED
        });
      }

      const cacheKey = `leaderboard:city:${city}:${page}:${limit}`;
      
      // Try cache first
      const cached = await redis.cache.get(cacheKey);
      if (cached) {
        return res.json({
          message: API_MESSAGES.SUCCESS,
          ...cached,
          cached: true
        });
      }

      const users = await User.aggregate([
        {
          $match: {
            'preferences.showOnLeaderboard': true,
            'location.city': new RegExp(city, 'i'),
            'stats.currentStreak': { $gt: 0 }
          }
        },
        {
          $project: {
            username: 1,
            displayName: 1,
            avatar: 1,
            location: 1,
            stats: 1,
            shameCount: 1,
            subscription: 1
          }
        },
        { $sort: { 'stats.currentStreak': -1, 'stats.consistencyScore': -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ]);

      // Add ranks
      const rankedUsers = users.map((user, index) => ({
        rank: skip + index + 1,
        ...user,
        badge: this.getBadgeForRank(skip + index + 1),
        isPremium: user.subscription.plan !== 'free'
      }));

      // Get total count
      const total = await User.countDocuments({
        'preferences.showOnLeaderboard': true,
        'location.city': new RegExp(city, 'i'),
        'stats.currentStreak': { $gt: 0 }
      });

      // Get user's rank if authenticated
      let userRank = null;
      if (req.userId) {
        userRank = await this.getUserRank(req.userId, 'city', city);
      }

      const result = {
        city,
        leaderboard: rankedUsers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        userRank,
        updatedAt: new Date().toISOString()
      };

      // Cache for 10 minutes
      await redis.cache.set(cacheKey, result, 600);

      res.json({
        message: API_MESSAGES.SUCCESS,
        ...result,
        cached: false
      });
    } catch (error) {
      console.error('Get city leaderboard error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Get friends leaderboard
   */
  async getFriendsLeaderboard(req, res) {
    try {
      const userId = req.userId;
      const { page = 1, limit = 50 } = req.query;
      const skip = (page - 1) * limit;

      // Get user's friends (from following/followers or chat participants)
      const userChats = await Chat.find({
        participants: userId,
        type: 'direct'
      }).select('participants');

      const friendIds = userChats
        .flatMap(chat => chat.participants)
        .filter(id => id.toString() !== userId.toString());

      if (friendIds.length === 0) {
        return res.json({
          message: API_MESSAGES.SUCCESS,
          leaderboard: [],
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 0,
            pages: 0
          },
          userRank: null
        });
      }

      const users = await User.aggregate([
        {
          $match: {
            _id: { $in: friendIds },
            'preferences.showOnLeaderboard': true
          }
        },
        {
          $project: {
            username: 1,
            displayName: 1,
            avatar: 1,
            location: 1,
            stats: 1,
            subscription: 1
          }
        },
        { $sort: { 'stats.currentStreak': -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ]);

      // Add ranks
      const rankedUsers = users.map((user, index) => ({
        rank: skip + index + 1,
        ...user,
        badge: this.getBadgeForRank(skip + index + 1),
        isPremium: user.subscription.plan !== 'free'
      }));

      // Get user's own rank
      const currentUser = await User.findById(userId);
      const userRank = {
        rank: 1, // Calculate actual rank among friends
        ...currentUser.toObject(),
        badge: this.getBadgeForRank(1)
      };

      res.json({
        message: API_MESSAGES.SUCCESS,
        leaderboard: rankedUsers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: friendIds.length,
          pages: Math.ceil(friendIds.length / limit)
        },
        userRank,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get friends leaderboard error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Get user's rank
   */
  async getUserRank(userId, type = 'global_streak', context = null) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.preferences.showOnLeaderboard) {
        return null;
      }

      let rank;
      switch (type) {
        case 'global_streak':
          rank = await User.countDocuments({
            'preferences.showOnLeaderboard': true,
            $or: [
              { 'stats.currentStreak': { $gt: user.stats.currentStreak } },
              { 
                'stats.currentStreak': user.stats.currentStreak,
                'stats.consistencyScore': { $gt: user.stats.consistencyScore }
              }
            ]
          }) + 1;
          break;

        case 'consistency':
          rank = await User.countDocuments({
            'preferences.showOnLeaderboard': true,
            'stats.totalDays': { $gte: 30 },
            $or: [
              { 'stats.consistencyScore': { $gt: user.stats.consistencyScore } },
              { 
                'stats.consistencyScore': user.stats.consistencyScore,
                'stats.totalDays': { $gt: user.stats.totalDays }
              }
            ]
          }) + 1;
          break;

        case 'city':
          if (!context) return null;
          rank = await User.countDocuments({
            'preferences.showOnLeaderboard': true,
            'location.city': new RegExp(context, 'i'),
            'stats.currentStreak': { $gt: user.stats.currentStreak }
          }) + 1;
          break;

        default:
          return null;
      }

      const totalUsers = await User.countDocuments({
        'preferences.showOnLeaderboard': true
      });

      const percentile = totalUsers > 0 
        ? Math.round(((totalUsers - rank) / totalUsers) * 100)
        : 0;

      return {
        rank,
        totalUsers,
        percentile,
        badge: this.getBadgeForRank(rank),
        stats: {
          currentStreak: user.stats.currentStreak,
          consistencyScore: user.stats.consistencyScore,
          totalDays: user.stats.totalDays
        }
      };
    } catch (error) {
      console.error('Get user rank error:', error);
      return null;
    }
  }

  /**
   * Get badge for rank
   */
  getBadgeForRank(rank) {
    if (rank === 1) return LEADERBOARD.RANK_BADGES[1];
    if (rank <= 3) return LEADERBOARD.RANK_BADGES[2];
    if (rank <= 10) return LEADERBOARD.RANK_BADGES[10];
    if (rank <= 100) return LEADERBOARD.RANK_BADGES[100];
    return null;
  }

  /**
   * Get leaderboard statistics
   */
  async getLeaderboardStats(req, res) {
    try {
      const cacheKey = 'leaderboard:stats';
      
      // Try cache first
      const cached = await redis.cache.get(cacheKey);
      if (cached) {
        return res.json({
          message: API_MESSAGES.SUCCESS,
          ...cached,
          cached: true
        });
      }

      // Get total active users
      const totalUsers = await User.countDocuments({
        'preferences.showOnLeaderboard': true,
        'stats.currentStreak': { $gt: 0 }
      });

      // Get average streak
      const avgStreak = await User.aggregate([
        {
          $match: {
            'preferences.showOnLeaderboard': true,
            'stats.currentStreak': { $gt: 0 }
          }
        },
        {
          $group: {
            _id: null,
            avgStreak: { $avg: '$stats.currentStreak' },
            maxStreak: { $max: '$stats.currentStreak' },
            totalDays: { $sum: '$stats.totalDays' }
          }
        }
      ]);

      // Get city distribution
      const cityDistribution = await User.aggregate([
        {
          $match: {
            'preferences.showOnLeaderboard': true,
            'location.city': { $exists: true, $ne: '' }
          }
        },
        {
          $group: {
            _id: '$location.city',
            count: { $sum: 1 },
            avgStreak: { $avg: '$stats.currentStreak' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      // Get streak milestones distribution
      const streakDistribution = await User.aggregate([
        {
          $match: {
            'preferences.showOnLeaderboard': true,
            'stats.currentStreak': { $gt: 0 }
          }
        },
        {
          $bucket: {
            groupBy: '$stats.currentStreak',
            boundaries: [0, 7, 30, 100, 365, 1000],
            default: '1000+',
            output: {
              count: { $sum: 1 },
              avgConsistency: { $avg: '$stats.consistencyScore' }
            }
          }
        }
      ]);

      // Get top cities by average streak
      const topCities = await User.aggregate([
        {
          $match: {
            'preferences.showOnLeaderboard': true,
            'location.city': { $exists: true, $ne: '' },
            'stats.currentStreak': { $gte: 7 }
          }
        },
        {
          $group: {
            _id: '$location.city',
            userCount: { $sum: 1 },
            avgStreak: { $avg: '$stats.currentStreak' },
            maxStreak: { $max: '$stats.currentStreak' }
          }
        },
        { $match: { userCount: { $gte: 5 } } },
        { $sort: { avgStreak: -1 } },
        { $limit: 5 }
      ]);

      const stats = {
        totalActiveUsers: totalUsers,
        averageStreak: avgStreak[0]?.avgStreak || 0,
        longestStreak: avgStreak[0]?.maxStreak || 0,
        totalDaysTracked: avgStreak[0]?.totalDays || 0,
        cityDistribution,
        streakDistribution,
        topCities,
        updatedAt: new Date().toISOString()
      };

      // Cache for 1 hour
      await redis.cache.set(cacheKey, stats, LEADERBOARD.CACHE_DURATION.LONG);

      res.json({
        message: API_MESSAGES.SUCCESS,
        ...stats,
        cached: false
      });
    } catch (error) {
      console.error('Get leaderboard stats error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Get user's progress vs leaderboard
   */
  async getUserProgress(req, res) {
    try {
      const userId = req.userId;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      // Get user's rank in different categories
      const [globalRank, consistencyRank, weeklyRank] = await Promise.all([
        this.getUserRank(userId, 'global_streak'),
        this.getUserRank(userId, 'consistency'),
        this.getUserRank(userId, 'weekly')
      ]);

      // Get next milestone
      const nextMilestone = this.getNextMilestone(user.stats.currentStreak);

      // Get comparison with average
      const avgStats = await User.aggregate([
        {
          $match: {
            'preferences.showOnLeaderboard': true,
            'stats.currentStreak': { $gt: 0 }
          }
        },
        {
          $group: {
            _id: null,
            avgStreak: { $avg: '$stats.currentStreak' },
            avgConsistency: { $avg: '$stats.consistencyScore' }
          }
        }
      ]);

      const comparison = {
        streak: {
          user: user.stats.currentStreak,
          average: avgStats[0]?.avgStreak || 0,
          difference: user.stats.currentStreak - (avgStats[0]?.avgStreak || 0)
        },
        consistency: {
          user: user.stats.consistencyScore,
          average: avgStats[0]?.avgConsistency || 0,
          difference: user.stats.consistencyScore - (avgStats[0]?.avgConsistency || 0)
        }
      };

      // Get user's position percentile
      const totalUsers = await User.countDocuments({
        'preferences.showOnLeaderboard': true
      });

      res.json({
        message: API_MESSAGES.SUCCESS,
        user: {
          id: user._id,
          username: user.username,
          displayName: user.displayName,
          stats: user.stats
        },
        ranks: {
          global: globalRank,
          consistency: consistencyRank,
          weekly: weeklyRank
        },
        nextMilestone,
        comparison,
        percentile: totalUsers > 0 && globalRank
          ? Math.round(((totalUsers - globalRank.rank) / totalUsers) * 100)
          : 0,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get user progress error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Get next milestone based on current streak
   */
  getNextMilestone(currentStreak) {
    const milestones = [7, 30, 100, 365, 1000];
    const next = milestones.find(m => m > currentStreak);
    
    if (!next) {
      return {
        days: null,
        name: 'Max milestone achieved!',
        progress: 100,
        icon: '🏆'
      };
    }

    const progress = (currentStreak / next) * 100;

    const milestoneNames = {
      7: 'Weekly Warrior',
      30: 'Monthly Maestro',
      100: 'Century Club',
      365: 'Year of Discipline',
      1000: 'Legendary Streak'
    };

    return {
      days: next,
      name: milestoneNames[next],
      progress: Math.min(100, Math.round(progress)),
      icon: next === 7 ? '🏆' : next === 30 ? '🌟' : next === 100 ? '💯' : next === 365 ? '🎯' : '👑'
    };
  }

  /**
   * Get trending users (biggest movers in rankings)
   */
  async getTrendingUsers(req, res) {
    try {
      const cacheKey = 'leaderboard:trending';
      
      // Try cache first
      const cached = await redis.cache.get(cacheKey);
      if (cached) {
        return res.json({
          message: API_MESSAGES.SUCCESS,
          ...cached,
          cached: true
        });
      }

      // Get users with significant streak growth in last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const trendingUsers = await Streak.aggregate([
        {
          $match: {
            status: 'active',
            lastUpdated: { $gte: weekAgo },
            currentStreak: { $gte: 7 }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $match: {
            'user.preferences.showOnLeaderboard': true
          }
        },
        {
          $project: {
            userId: 1,
            username: '$user.username',
            displayName: '$user.displayName',
            avatar: '$user.avatar',
            currentStreak: 1,
            streakGrowth: {
              $size: {
                $filter: {
                  input: '$history',
                  as: 'entry',
                  cond: {
                    $and: [
                      { $gte: ['$$entry.date', weekAgo] },
                      { $eq: ['$$entry.verified', true] }
                    ]
                  }
                }
              }
            },
            consistency: '$user.stats.consistencyScore'
          }
        },
        { $sort: { streakGrowth: -1 } },
        { $limit: 10 }
      ]);

      const result = {
        trendingUsers,
        period: {
          start: weekAgo,
          end: new Date()
        },
        updatedAt: new Date().toISOString()
      };

      // Cache for 30 minutes
      await redis.cache.set(cacheKey, result, LEADERBOARD.CACHE_DURATION.MEDIUM);

      res.json({
        message: API_MESSAGES.SUCCESS,
        ...result,
        cached: false
      });
    } catch (error) {
      console.error('Get trending users error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Get shame leaderboard (users with most shame days)
   */
  async getShameLeaderboard(req, res) {
    try {
      const { page = 1, limit = 50 } = req.query;
      const skip = (page - 1) * limit;

      const users = await User.aggregate([
        {
          $match: {
            'preferences.showOnLeaderboard': true,
            shameCount: { $gt: 0 }
          }
        },
        {
          $project: {
            username: 1,
            displayName: 1,
            avatar: 1,
            location: 1,
            stats: 1,
            shameCount: 1,
            subscription: 1,
            shameRatio: {
              $cond: [
                { $gt: ['$stats.totalDays', 0] },
                { $divide: ['$shameCount', '$stats.totalDays'] },
                0
              ]
            }
          }
        },
        { $sort: { shameCount: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ]);

      // Add ranks with shame-themed badges
      const rankedUsers = users.map((user, index) => ({
        rank: skip + index + 1,
        ...user,
        badge: this.getShameBadgeForRank(skip + index + 1),
        isPremium: user.subscription.plan !== 'free'
      }));

      const total = await User.countDocuments({
        'preferences.showOnLeaderboard': true,
        shameCount: { $gt: 0 }
      });

      res.json({
        message: API_MESSAGES.SUCCESS,
        leaderboard: rankedUsers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        note: 'Shame days represent accountability and honesty in the community',
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get shame leaderboard error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Get shame badge for rank
   */
  getShameBadgeForRank(rank) {
    const shameBadges = {
      1: { emoji: '👑', name: 'Shame King', color: '#EF4444' },
      2: { emoji: '🥇', name: 'Shame Master', color: '#DC2626' },
      3: { emoji: '🥈', name: 'Shame Expert', color: '#B91C1C' },
      10: { emoji: '😅', name: 'Honest User', color: '#F87171' }
    };

    if (rank === 1) return shameBadges[1];
    if (rank <= 3) return shameBadges[2];
    if (rank <= 10) return shameBadges[10];
    return { emoji: '😊', name: 'Accountability Seeker', color: '#FCA5A5' };
  }
}

module.exports = new LeaderboardController();