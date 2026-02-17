// backend/src/services/challengeManagementService.js
const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
const UserChallenge = require('../models/UserChallenge');
const User = require('../models/user');
const NotificationService = require('./notificationService');

// Try to initialize Redis client (fallback to no cache if fails)
let redisClient = null;
let redisAvailable = false;

try {
  const redis = require('redis');
  redisClient = redis.createClient({
    url: process.env.REDIS_URL
  });
  redisClient.connect().then(() => {
    redisAvailable = true;
    console.log('✅ Redis connected successfully');
  }).catch((error) => {
    console.warn('⚠️  Redis connection failed, caching disabled:', error.message);
    redisAvailable = false;
  });
} catch (error) {
  console.warn('⚠️  Redis not available, caching disabled');
  redisAvailable = false;
}

class ChallengeManagementService {
  constructor() {
    this.cacheDuration = 300; // 5 minutes
  }

  // Get all available challenges for a user
  async getAvailableChallenges(userEmail, filters = {}) {
    const cacheKey = `challenges:available:${userEmail}:${JSON.stringify(filters)}`;
    
    if (redisAvailable && redisClient) {
      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch (err) {
        console.warn('Redis cache miss:', err);
      }
    }

    try {
      // Get user to check for already joined challenges
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        throw new Error('User not found');
      }

      // Build query - find joinable challenges (upcoming or active, public or invite-only)
      const query = {
        status: { $in: ['upcoming', 'active'] },
        'participants.user': { $ne: user._id },
        $or: [
          { 'settings.visibility': 'public' },
          { 'settings.visibility': 'invite-only', 'metadata.challengeCode': { $exists: true } }
        ]
      };
      
      // Apply filters
      if (filters.category) {
        query.category = filters.category;
      }
      
      if (filters.difficulty) {
        query.difficulty = filters.difficulty;
      }
      
      if (filters.minDuration) {
        query['settings.duration.value'] = { $gte: parseInt(filters.minDuration) };
      }
      
      if (filters.maxDuration) {
        query['settings.duration.value'] = query['settings.duration.value'] ? 
          { ...query['settings.duration.value'], $lte: parseInt(filters.maxDuration) } : 
          { $lte: parseInt(filters.maxDuration) };
      }

      // Get available challenges
      const challenges = await Challenge.find(query)
        .sort({ 'stats.totalEntries': -1, createdAt: -1 })
        .limit(filters.limit || 50);

      // Get user's joined challenge IDs
      const userChallenges = await UserChallenge.find({ 
        userId: user._id,
        status: { $in: ['active', 'in_progress', 'joined'] }
      }).select('challengeId');

      const joinedChallengeIds = userChallenges.map(uc => uc.challengeId.toString());
      
      // Filter out already joined challenges and add join status
      const availableChallenges = challenges
        .filter(challenge => !joinedChallengeIds.includes(challenge._id.toString()))
        .map(challenge => ({
          ...challenge.toObject(),
          isJoined: false
        }));

      if (redisAvailable && redisClient) {
        try {
          await redisClient.setEx(cacheKey, this.cacheDuration, JSON.stringify(availableChallenges));
        } catch (err) {
          console.warn('Redis cache set failed:', err);
        }
      }

      return availableChallenges;
    } catch (error) {
      console.error('Error getting available challenges:', error);
      throw error;
    }
  }

  // Get user's active challenges
  async getUserActiveChallenges(userEmail) {
    const cacheKey = `challenges:active:${userEmail}`;
    
    if (redisAvailable && redisClient) {
      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch (err) {
        console.warn('Redis cache miss:', err);
      }
    }

    try {
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        throw new Error('User not found');
      }

      const userChallenges = await UserChallenge.find({
        userId: user._id,
        status: { $in: ['active', 'in_progress'] }
      })
      .populate({
        path: 'challengeId',
        model: 'Challenge'
      })
      .sort({ joinedAt: -1 });

      // Calculate progress for each challenge
      const activeChallenges = await Promise.all(
        userChallenges.map(async (uc) => {
          const challenge = uc.challengeId;
          const progress = await this.calculateChallengeProgress(user._id, challenge._id);
          
          return {
            ...challenge.toObject(),
            userChallengeId: uc._id,
            progress: progress.percentage,
            currentDay: progress.currentDay,
            totalDays: progress.totalDays,
            lastUpdated: uc.updatedAt,
            status: uc.status,
            joinedAt: uc.joinedAt
          };
        })
      );

      if (redisAvailable && redisClient) {
        try {
          await redisClient.setEx(cacheKey, this.cacheDuration, JSON.stringify(activeChallenges));
        } catch (err) {
          console.warn('Redis cache set failed:', err);
        }
      }

      return activeChallenges;
    } catch (error) {
      console.error('Error getting user active challenges:', error);
      throw error;
    }
  }

  // Join a challenge
  async joinChallenge(challengeId, userEmail, joinData = {}) {
    try {
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        throw new Error('User not found');
      }

      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }

      // Check if user already joined
      const existingJoin = await UserChallenge.findOne({
        userId: user._id,
        challengeId: challenge._id,
        status: { $in: ['active', 'in_progress', 'joined'] }
      });

      if (existingJoin) {
        return {
          success: false,
          message: 'You have already joined this challenge',
          data: existingJoin
        };
      }

      // Check challenge capacity if exists
      if (challenge.settings.maxParticipants > 0 && 
          challenge.participants.length >= challenge.settings.maxParticipants) {
        return {
          success: false,
          message: 'This challenge has reached maximum capacity'
        };
      }

      // Create user challenge record
      const userChallenge = new UserChallenge({
        userId: user._id,
        challengeId: challenge._id,
        status: 'active',
        joinedAt: new Date(),
        ...joinData
      });

      await userChallenge.save();

      // Update challenge participants
      await Challenge.findByIdAndUpdate(challengeId, {
        $push: { 
          participants: { 
            user: user._id,
            status: 'active',
            score: 0,
            progress: {
              current: 0,
              target: challenge.calculateTarget()
            }
          }
        },
        $inc: { 
          'stats.totalEntries': 1,
          'stats.activeParticipants': 1 
        }
      });

      // Clear relevant caches
      await this.clearUserChallengesCache(userEmail);

      // Send notification
      if (NotificationService.sendChallengeJoinNotification) {
        await NotificationService.sendChallengeJoinNotification(
          user._id,
          challenge.name,
          challenge.settings.duration.value
        );
      }

      // Add to user's activity
      await User.findByIdAndUpdate(user._id, {
        $push: {
          'activity': {
            type: 'challenge_joined',
            challengeId: challenge._id,
            challengeName: challenge.name,
            timestamp: new Date()
          }
        },
        $inc: { 'stats.totalChallengesJoined': 1 }
      });

      return {
        success: true,
        message: 'Successfully joined challenge',
        data: userChallenge
      };
    } catch (error) {
      console.error('Error joining challenge:', error);
      throw error;
    }
  }

  // Calculate challenge progress
  async calculateChallengeProgress(userId, challengeId) {
    try {
      const userChallenge = await UserChallenge.findOne({
        userId: userId,
        challengeId: challengeId
      }).populate('challengeId');

      if (!userChallenge || !userChallenge.challengeId) {
        return { percentage: 0, currentDay: 1, totalDays: 1 };
      }

      const challenge = userChallenge.challengeId;
      const startDate = userChallenge.joinedAt;
      const now = new Date();
      
      // Calculate days since joining
      const daysSinceJoin = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
      const currentDay = Math.min(daysSinceJoin, challenge.settings.duration.value);
      
      // Calculate percentage based on challenge type
      let percentage = 0;
      const challengeDoc = await Challenge.findById(challengeId);
      
      // Find user in challenge participants
      const participant = challengeDoc.participants.find(p => 
        p.user.toString() === userId.toString()
      );
      
      if (participant) {
        const target = challengeDoc.calculateTarget();
        percentage = Math.round((participant.progress.current / target) * 100);
      }

      return {
        percentage: Math.min(100, percentage),
        currentDay,
        totalDays: challenge.settings.duration.value,
        completedDays: participant?.progress.current || 0,
        isCompleted: userChallenge.completed
      };
    } catch (error) {
      console.error('Error calculating progress:', error);
      return { percentage: 0, currentDay: 1, totalDays: 1 };
    }
  }

  // Get completed days count
  async getCompletedDaysCount(userId, challengeId) {
    const userChallenge = await UserChallenge.findOne({
      userId: userId,
      challengeId: challengeId
    });

    if (!userChallenge) return 0;

    // Count completed days in the last duration days
    const startDate = userChallenge.joinedAt;
    const challenge = await Challenge.findById(challengeId);
    const duration = challenge?.duration || 30;
    
    const days = await UserChallenge.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          challengeId: mongoose.Types.ObjectId(challengeId),
          'progress.completedDays': { $exists: true }
        }
      },
      {
        $project: {
          completedDays: '$progress.completedDays'
        }
      }
    ]);

    return days[0]?.completedDays || 0;
  }

  // Update daily challenge progress
  async updateDailyProgress(userEmail, challengeId, progressData) {
    try {
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        throw new Error('User not found');
      }

      const userChallenge = await UserChallenge.findOne({
        userId: user._id,
        challengeId: challengeId
      });

      if (!userChallenge) {
        throw new Error('Challenge not found or not joined');
      }

      const today = new Date().toISOString().split('T')[0];
      
      // Check if already updated today
      if (userChallenge.lastUpdated && 
          userChallenge.lastUpdated.toISOString().split('T')[0] === today) {
        return {
          success: false,
          message: 'Already updated progress for today'
        };
      }

      // Update progress
      userChallenge.progress.completedDays = (userChallenge.progress.completedDays || 0) + 1;
      userChallenge.progress.lastCompleted = new Date();
      userChallenge.progress.currentDay = userChallenge.progress.currentDay + 1;
      userChallenge.lastUpdated = new Date();
      
      // Update streak
      if (progressData.completed) {
        userChallenge.progress.streak = (userChallenge.progress.streak || 0) + 1;
      } else {
        userChallenge.progress.streak = 0;
      }

      // Check if challenge is completed
      const challenge = await Challenge.findById(challengeId);
      if (userChallenge.progress.currentDay >= challenge.duration) {
        userChallenge.status = 'completed';
        userChallenge.completedAt = new Date();
        
        // Award achievement
        await this.awardChallengeCompletion(user._id, challengeId, challenge.name);
      }

      await userChallenge.save();

      // Clear cache
      await this.clearUserChallengesCache(userEmail);

      // Update user stats
      await User.findByIdAndUpdate(user._id, {
        $inc: { 'stats.totalChallengeDaysCompleted': 1 },
        $push: {
          'activity': {
            type: 'challenge_progress',
            challengeId: challengeId,
            challengeName: challenge.name,
            progress: userChallenge.progress.currentDay,
            total: challenge.duration,
            timestamp: new Date()
          }
        }
      });

      return {
        success: true,
        message: 'Progress updated successfully',
        data: userChallenge
      };
    } catch (error) {
      console.error('Error updating daily progress:', error);
      throw error;
    }
  }

  // Award challenge completion
  async awardChallengeCompletion(userId, challengeId, challengeName) {
    try {
      // Update user achievements
      await User.findByIdAndUpdate(userId, {
        $push: {
          achievements: {
            type: 'challenge_completed',
            challengeId: challengeId,
            challengeName: challengeName,
            earnedAt: new Date(),
            xp: 100
          }
        },
        $inc: { 
          'stats.totalChallengesCompleted': 1,
          'stats.xp': 100
        }
      });

      // Send notification
      await NotificationService.sendChallengeCompletionNotification(
        userId,
        challengeName
      );

      // Check for milestone achievements
      await this.checkChallengeMilestones(userId);
    } catch (error) {
      console.error('Error awarding completion:', error);
    }
  }

  // Check challenge milestones
  async checkChallengeMilestones(userId) {
    const user = await User.findById(userId);
    const totalCompleted = user.stats.totalChallengesCompleted || 0;

    const milestones = [
      { threshold: 1, achievement: 'first_challenge_completed', xp: 50 },
      { threshold: 5, achievement: 'challenge_master', xp: 100 },
      { threshold: 10, achievement: 'challenge_expert', xp: 200 },
      { threshold: 25, achievement: 'challenge_legend', xp: 500 }
    ];

    for (const milestone of milestones) {
      if (totalCompleted === milestone.threshold) {
        await User.findByIdAndUpdate(userId, {
          $push: {
            achievements: {
              type: milestone.achievement,
              earnedAt: new Date(),
              xp: milestone.xp
            }
          },
          $inc: { 'stats.xp': milestone.xp }
        });
      }
    }
  }

  // Create a new challenge (admin or user-created)
  async createChallenge(challengeData, creatorEmail) {
    try {
      const user = await User.findOne({ email: creatorEmail });
      if (!user) {
        throw new Error('User not found');
      }

      const challenge = new Challenge({
        ...challengeData,
        creator: user._id,
        status: challengeData.status || 'draft',
        participants: [],
        payments: [],
        stats: {
          totalEntries: 0,
          activeParticipants: 0,
          completionRate: 0,
          averageScore: 0,
          totalPrizePool: 0
        }
      });

      await challenge.save();

      // Clear challenges cache if redis is available
      if (redisAvailable && redisClient) {
        try {
          // Note: Redis DEL with pattern requires using SCAN or keys, which is not supported in all environments
          // For simplicity, we'll just let the cache expire naturally
          console.warn('Cache clearing for pattern challenges:available:* not implemented');
        } catch (error) {
          console.warn('Failed to clear challenges cache:', error);
        }
      }

      // If creator auto-joins
      if (challengeData.autoJoinCreator) {
        await this.joinChallenge(challenge._id, creatorEmail);
      }

      return {
        success: true,
        message: 'Challenge created successfully',
        data: challenge
      };
    } catch (error) {
      console.error('Error creating challenge:', error);
      throw error;
    }
  }

  // Get challenge leaderboard
  async getChallengeLeaderboard(challengeId, limit = 20) {
    const cacheKey = `challenge:leaderboard:${challengeId}:${limit}`;
    
    if (redisAvailable && redisClient) {
      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch (err) {
        console.warn('Redis cache miss:', err);
      }
    }

    try {
      const leaderboard = await UserChallenge.aggregate([
        { $match: { challengeId: mongoose.Types.ObjectId(challengeId) } },
        { $sort: { 'progress.completedDays': -1, 'progress.streak': -1 } },
        { $limit: limit },
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
          $project: {
            userId: '$user._id',
            username: '$user.username',
            displayName: '$user.displayName',
            avatar: '$user.avatar',
            completedDays: '$progress.completedDays',
            currentStreak: '$progress.streak',
            currentDay: '$progress.currentDay',
            joinedAt: '$joinedAt',
            status: '$status'
          }
        }
      ]);

      if (redisAvailable && redisClient) {
        try {
          await redisClient.setEx(cacheKey, 60, JSON.stringify(leaderboard)); // 1 minute cache for leaderboard
        } catch (err) {
          console.warn('Redis cache set failed:', err);
        }
      }

      return leaderboard;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }

  // Clear user challenges cache
  async clearUserChallengesCache(userEmail) {
    if (!redisAvailable || !redisClient) {
      return; // Do nothing if cache not available
    }
    
    try {
      const pattern = `challenges:*${userEmail}*`;
      const keys = await redisClient.keys(pattern);
      
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Get challenge statistics
  async getChallengeStats(challengeId) {
    try {
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }

      const stats = await UserChallenge.aggregate([
        { $match: { challengeId: mongoose.Types.ObjectId(challengeId) } },
        {
          $group: {
            _id: null,
            totalParticipants: { $sum: 1 },
            activeParticipants: {
              $sum: { $cond: [{ $in: ['$status', ['active', 'in_progress']] }, 1, 0] }
            },
            completedParticipants: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            avgProgress: { $avg: '$progress.currentDay' },
            avgCompletionRate: { 
              $avg: { 
                $divide: ['$progress.completedDays', challenge.duration]
              }
            }
          }
        }
      ]);

      return {
        challengeId,
        challengeName: challenge.name,
        ...stats[0],
        duration: challenge.duration,
        difficulty: challenge.difficulty,
        category: challenge.category
      };
    } catch (error) {
      console.error('Error getting challenge stats:', error);
      throw error;
    }
  }

  // Get trending challenges
  async getTrendingChallenges(limit = 10) {
    const cacheKey = `challenges:trending:${limit}`;
    
    if (redisAvailable && redisClient) {
      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch (err) {
        console.warn('Redis cache miss:', err);
      }
    }

    try {
      const trending = await Challenge.aggregate([
        { $match: { 
          status: { $in: ['active', 'upcoming'] },
          'settings.visibility': 'public'
        } },
        { $sort: { 
          'stats.totalEntries': -1,
          'stats.activeParticipants': -1 
        }},
        { $limit: limit },
        {
          $project: {
            name: 1,
            description: 1,
            category: 1,
            difficulty: 1,
            'settings.duration': 1,
            participants: 1,
            'metadata.bannerImage': 1,
            'stats': 1,
            completionRate: {
              $cond: [
                { $gt: ['$stats.totalEntries', 0] },
                { $divide: ['$stats.completionRate', 100] },
                0
              ]
            }
          }
        }
      ]);

      if (redisAvailable && redisClient) {
        try {
          await redisClient.setEx(cacheKey, 300, JSON.stringify(trending));
        } catch (err) {
          console.warn('Redis cache set failed:', err);
        }
      }

      return trending;
    } catch (error) {
      console.error('Error getting trending challenges:', error);
      throw error;
    }
  }
}

module.exports = new ChallengeManagementService();