const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');
const Streak = require('../models/Streak');
const redis = require('redis');

// Initialize Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

redisClient.connect().catch(console.error);

// Cache keys
const CACHE_KEYS = {
  GLOBAL_STREAK: 'leaderboard:global:streak',
  GLOBAL_CONSISTENCY: 'leaderboard:global:consistency',
  GLOBAL_TOTAL_DAYS: 'leaderboard:global:totaldays',
  WEEKLY_STREAK: 'leaderboard:weekly:streak',
  CITY_PREFIX: 'leaderboard:city:'
};

// Cache duration in seconds
const CACHE_DURATION = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600 // 1 hour
};

// Helper function to get cached data
async function getCachedLeaderboard(key, fetchFunction, duration = CACHE_DURATION.SHORT) {
  try {
    const cached = await redisClient.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const data = await fetchFunction();
    await redisClient.setEx(key, duration, JSON.stringify(data));
    return data;
  } catch (err) {
    console.error('Redis error:', err);
    return await fetchFunction();
  }
}

// @route   GET /api/leaderboard/global/streak
// @desc    Get global streak leaderboard
// @access  Public
router.get('/global/streak', async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;

    const data = await getCachedLeaderboard(
      `${CACHE_KEYS.GLOBAL_STREAK}:${limit}:${offset}`,
      async () => {
        const users = await User.aggregate([
          { 
            $match: { 
              'preferences.showOnLeaderboard': true,
              'stats.currentStreak': { $gt: 0 },
              isDeleted: false
            }
          },
          { 
            $sort: { 
              'stats.currentStreak': -1,
              'stats.consistencyScore': -1,
              'stats.totalDays': -1
            }
          },
          { $skip: parseInt(offset) },
          { $limit: parseInt(limit) },
          {
            $project: {
              username: 1,
              displayName: 1,
              avatar: 1,
              location: 1,
              'stats.currentStreak': 1,
              'stats.longestStreak': 1,
              'stats.consistencyScore': 1,
              'stats.totalDays': 1,
              'stats.totalOutdoorTime': 1,
              shameCount: 1,
              subscription: 1,
              badges: 1
            }
          }
        ]);
        
        return users.map((user, index) => ({
          rank: index + 1 + parseInt(offset),
          ...user,
          badge: getBadge(index + 1 + parseInt(offset))
        }));
      }
    );
    
    res.json({
      success: true,
      leaderboard: data,
      type: 'global_streak',
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Get global streak leaderboard error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   GET /api/leaderboard/global/consistency
// @desc    Get global consistency leaderboard
// @access  Public
router.get('/global/consistency', async (req, res) => {
  try {
    const { limit = 100, offset = 0, minDays = 30 } = req.query;

    const data = await getCachedLeaderboard(
      `${CACHE_KEYS.GLOBAL_CONSISTENCY}:${limit}:${offset}:${minDays}`,
      async () => {
        const users = await User.aggregate([
          { 
            $match: { 
              'preferences.showOnLeaderboard': true,
              'stats.totalDays': { $gte: parseInt(minDays) },
              'stats.consistencyScore': { $gt: 0 },
              isDeleted: false
            }
          },
          { 
            $sort: { 
              'stats.consistencyScore': -1,
              'stats.totalDays': -1,
              'stats.currentStreak': -1
            }
          },
          { $skip: parseInt(offset) },
          { $limit: parseInt(limit) },
          {
            $project: {
              username: 1,
              displayName: 1,
              avatar: 1,
              location: 1,
              'stats.consistencyScore': 1,
              'stats.totalDays': 1,
              'stats.currentStreak': 1,
              'stats.longestStreak': 1,
              'stats.totalOutdoorTime': 1,
              subscription: 1,
              badges: 1
            }
          }
        ]);
        
        return users.map((user, index) => ({
          rank: index + 1 + parseInt(offset),
          ...user,
          badge: getBadge(index + 1 + parseInt(offset))
        }));
      },
      CACHE_DURATION.MEDIUM
    );
    
    res.json({
      success: true,
      leaderboard: data,
      type: 'global_consistency',
      minDays: parseInt(minDays),
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Get consistency leaderboard error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   GET /api/leaderboard/global/total-days
// @desc    Get global total days leaderboard
// @access  Public
router.get('/global/total-days', async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;

    const data = await getCachedLeaderboard(
      `${CACHE_KEYS.GLOBAL_TOTAL_DAYS}:${limit}:${offset}`,
      async () => {
        const users = await User.aggregate([
          { 
            $match: { 
              'preferences.showOnLeaderboard': true,
              'stats.totalDays': { $gt: 0 },
              isDeleted: false
            }
          },
          { 
            $sort: { 
              'stats.totalDays': -1,
              'stats.consistencyScore': -1,
              'stats.currentStreak': -1
            }
          },
          { $skip: parseInt(offset) },
          { $limit: parseInt(limit) },
          {
            $project: {
              username: 1,
              displayName: 1,
              avatar: 1,
              location: 1,
              'stats.totalDays': 1,
              'stats.consistencyScore': 1,
              'stats.currentStreak': 1,
              'stats.longestStreak': 1,
              'stats.totalOutdoorTime': 1,
              subscription: 1,
              badges: 1
            }
          }
        ]);
        
        return users.map((user, index) => ({
          rank: index + 1 + parseInt(offset),
          ...user,
          badge: getBadge(index + 1 + parseInt(offset))
        }));
      },
      CACHE_DURATION.LONG
    );
    
    res.json({
      success: true,
      leaderboard: data,
      type: 'global_total_days',
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Get total days leaderboard error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   GET /api/leaderboard/weekly
// @desc    Get weekly challenge leaderboard
// @access  Public
router.get('/weekly', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const data = await getCachedLeaderboard(
      `${CACHE_KEYS.WEEKLY_STREAK}:${limit}:${offset}`,
      async () => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const streaks = await Streak.aggregate([
          { 
            $match: { 
              status: 'active',
              lastUpdated: { $gte: oneWeekAgo }
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
              'user.preferences.showOnLeaderboard': true,
              'user.isDeleted': false
            }
          },
          {
            $group: {
              _id: '$userId',
              user: { $first: '$user' },
              weeklyProgress: { 
                $sum: {
                  $cond: [
                    { $gte: ['$lastUpdated', oneWeekAgo] },
                    1,
                    0
                  ]
                }
              },
              currentStreak: { $first: '$currentStreak' },
              lastUpdated: { $max: '$lastUpdated' }
            }
          },
          { $sort: { weeklyProgress: -1, currentStreak: -1 } },
          { $skip: parseInt(offset) },
          { $limit: parseInt(limit) },
          {
            $project: {
              'user.username': 1,
              'user.displayName': 1,
              'user.avatar': 1,
              'user.location': 1,
              'user.badges': 1,
              weeklyProgress: 1,
              currentStreak: 1,
              lastUpdated: 1
            }
          }
        ]);
        
        return streaks.map((item, index) => ({
          rank: index + 1 + parseInt(offset),
          username: item.user.username,
          displayName: item.user.displayName,
          avatar: item.user.avatar,
          location: item.user.location,
          badges: item.user.badges,
          progress: item.weeklyProgress,
          currentStreak: item.currentStreak,
          lastUpdated: item.lastUpdated,
          badge: getBadge(index + 1 + parseInt(offset))
        }));
      }
    );
    
    res.json({
      success: true,
      leaderboard: data,
      type: 'weekly',
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Get weekly leaderboard error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   GET /api/leaderboard/city/:city
// @desc    Get city leaderboard
// @access  Public
router.get('/city/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    if (!city || city.length < 2) {
      return res.status(400).json({
        error: 'INVALID_CITY',
        message: 'City name is required'
      });
    }

    const decodedCity = decodeURIComponent(city);
    
    const data = await getCachedLeaderboard(
      `${CACHE_KEYS.CITY_PREFIX}${decodedCity}:${limit}:${offset}`,
      async () => {
        const users = await User.aggregate([
          { 
            $match: { 
              'preferences.showOnLeaderboard': true,
              'location.city': { $regex: new RegExp(decodedCity, 'i') },
              'stats.currentStreak': { $gt: 0 },
              isDeleted: false
            }
          },
          { 
            $sort: { 
              'stats.currentStreak': -1,
              'stats.consistencyScore': -1
            }
          },
          { $skip: parseInt(offset) },
          { $limit: parseInt(limit) },
          {
            $project: {
              username: 1,
              displayName: 1,
              avatar: 1,
              location: 1,
              'stats.currentStreak': 1,
              'stats.consistencyScore': 1,
              'stats.totalDays': 1,
              'stats.totalOutdoorTime': 1,
              subscription: 1,
              badges: 1
            }
          }
        ]);
        
        return users.map((user, index) => ({
          rank: index + 1 + parseInt(offset),
          ...user,
          badge: getBadge(index + 1 + parseInt(offset))
        }));
      }
    );
    
    res.json({
      success: true,
      leaderboard: data,
      type: 'city',
      city: decodedCity,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Get city leaderboard error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   GET /api/leaderboard/cities
// @desc    Get top cities by user count
// @access  Public
router.get('/cities', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const cities = await User.aggregate([
      {
        $match: {
          'location.city': { $exists: true, $ne: '' },
          'preferences.showOnLeaderboard': true,
          isDeleted: false
        }
      },
      {
        $group: {
          _id: { $toLower: '$location.city' },
          city: { $first: '$location.city' },
          country: { $first: '$location.country' },
          userCount: { $sum: 1 },
          averageStreak: { $avg: '$stats.currentStreak' },
          totalOutdoorTime: { $sum: '$stats.totalOutdoorTime' }
        }
      },
      { $sort: { userCount: -1 } },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 0,
          city: 1,
          country: 1,
          userCount: 1,
          averageStreak: { $round: ['$averageStreak', 1] },
          totalOutdoorTime: 1
        }
      }
    ]);

    res.json({
      success: true,
      cities,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Get cities leaderboard error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   GET /api/leaderboard/my-rank
// @desc    Get current user's rank
// @access  Private
router.get('/my-rank', auth, async (req, res) => {
  try {
    const { type = 'streak', city } = req.query;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }

    let rank, totalUsers, query;

    switch (type) {
      case 'streak':
        query = {
          'preferences.showOnLeaderboard': true,
          'stats.currentStreak': { $gt: user.stats.currentStreak },
          isDeleted: false
        };
        
        if (city) {
          query['location.city'] = { $regex: new RegExp(city, 'i') };
        }
        
        rank = await User.countDocuments(query) + 1;
        totalUsers = await User.countDocuments({
          'preferences.showOnLeaderboard': true,
          'stats.currentStreak': { $gt: 0 },
          isDeleted: false,
          ...(city && { 'location.city': { $regex: new RegExp(city, 'i') } })
        });
        break;

      case 'consistency':
        query = {
          'preferences.showOnLeaderboard': true,
          'stats.consistencyScore': { $gt: user.stats.consistencyScore },
          'stats.totalDays': { $gte: 30 },
          isDeleted: false
        };
        
        if (city) {
          query['location.city'] = { $regex: new RegExp(city, 'i') };
        }
        
        rank = await User.countDocuments(query) + 1;
        totalUsers = await User.countDocuments({
          'preferences.showOnLeaderboard': true,
          'stats.consistencyScore': { $gt: 0 },
          'stats.totalDays': { $gte: 30 },
          isDeleted: false,
          ...(city && { 'location.city': { $regex: new RegExp(city, 'i') } })
        });
        break;

      case 'total-days':
        query = {
          'preferences.showOnLeaderboard': true,
          'stats.totalDays': { $gt: user.stats.totalDays },
          isDeleted: false
        };
        
        if (city) {
          query['location.city'] = { $regex: new RegExp(city, 'i') };
        }
        
        rank = await User.countDocuments(query) + 1;
        totalUsers = await User.countDocuments({
          'preferences.showOnLeaderboard': true,
          'stats.totalDays': { $gt: 0 },
          isDeleted: false,
          ...(city && { 'location.city': { $regex: new RegExp(city, 'i') } })
        });
        break;

      default:
        return res.status(400).json({
          error: 'INVALID_TYPE',
          message: 'Invalid leaderboard type'
        });
    }

    const percentile = totalUsers > 0 
      ? Math.round(((totalUsers - rank) / totalUsers) * 100)
      : 0;

    res.json({
      success: true,
      rank,
      totalUsers,
      percentile,
      type,
      city: city || 'global',
      userStats: {
        currentStreak: user.stats.currentStreak,
        consistencyScore: user.stats.consistencyScore,
        totalDays: user.stats.totalDays
      },
      badge: getBadge(rank)
    });

  } catch (err) {
    console.error('Get my rank error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   GET /api/leaderboard/top-sharers
// @desc    Get top sharers leaderboard
// @access  Public
router.get('/top-sharers', async (req, res) => {
  try {
    const { limit = 20, timeframe = 'month' } = req.query;

    const timeframes = {
      day: 1,
      week: 7,
      month: 30,
      year: 365
    };

    const days = timeframes[timeframe] || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const users = await User.aggregate([
      {
        $match: {
          'preferences.showOnLeaderboard': true,
          'stats.shareCount': { $gt: 0 },
          isDeleted: false,
          updatedAt: { $gte: since }
        }
      },
      {
        $sort: {
          'stats.shareCount': -1,
          'stats.currentStreak': -1
        }
      },
      { $limit: parseInt(limit) },
      {
        $project: {
          username: 1,
          displayName: 1,
          avatar: 1,
          location: 1,
          'stats.shareCount': 1,
          'stats.currentStreak': 1,
          'stats.consistencyScore': 1,
          badges: 1
        }
      }
    ]);

    res.json({
      success: true,
      leaderboard: users.map((user, index) => ({
        rank: index + 1,
        ...user,
        badge: getBadge(index + 1)
      })),
      type: 'top_sharers',
      timeframe,
      updatedAt: new Date().toISOString()
    });

  } catch (err) {
    console.error('Get top sharers error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   GET /api/leaderboard/stats
// @desc    Get leaderboard statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const stats = await getCachedLeaderboard(
      'leaderboard:stats',
      async () => {
        const [
          totalUsers,
          activeUsers,
          totalStreakDays,
          averageStreak,
          topStreak,
          citiesCount
        ] = await Promise.all([
          User.countDocuments({ isDeleted: false }),
          User.countDocuments({ 
            'stats.currentStreak': { $gt: 0 },
            isDeleted: false 
          }),
          User.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: null, total: { $sum: '$stats.totalDays' } } }
          ]),
          User.aggregate([
            { $match: { 'stats.currentStreak': { $gt: 0 }, isDeleted: false } },
            { $group: { _id: null, average: { $avg: '$stats.currentStreak' } } }
          ]),
          User.findOne({ 
            'preferences.showOnLeaderboard': true,
            isDeleted: false 
          })
          .sort({ 'stats.currentStreak': -1 })
          .select('displayName username avatar stats.currentStreak'),
          User.distinct('location.city', { 
            'location.city': { $exists: true, $ne: '' },
            isDeleted: false 
          })
        ]);

        return {
          totalUsers: totalUsers || 0,
          activeUsers: activeUsers || 0,
          totalStreakDays: totalStreakDays[0]?.total || 0,
          averageStreak: Math.round(averageStreak[0]?.average || 0),
          topStreak: topStreak ? {
            user: topStreak.displayName,
            username: topStreak.username,
            avatar: topStreak.avatar,
            streak: topStreak.stats.currentStreak
          } : null,
          citiesCount: citiesCount?.length || 0,
          activeRate: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
        };
      },
      CACHE_DURATION.LONG
    );

    res.json({
      success: true,
      stats,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Get leaderboard stats error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// Helper function to get badge based on rank
function getBadge(rank) {
  if (rank === 1) return '👑';
  if (rank <= 3) return '🥇';
  if (rank <= 10) return '🥈';
  if (rank <= 25) return '🥉';
  if (rank <= 100) return '⭐';
  return '';
}

module.exports = router;