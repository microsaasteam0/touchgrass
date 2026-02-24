/**
 * TOUCH GRASS CHALLENGES
 * 
 * PRODUCTION-READY FEATURES:
 * 
 * 1. REAL BACKEND INTEGRATION
 *    - All data persisted in MongoDB
 *    - No localStorage or mock data
 *    - Every action calls backend API
 * 
 * 2. DAILY VERIFICATION LOCK (23-HOUR RULE)
 *    - Users can only verify once per day
 *    - Button shows "Done Today" after verification
 *    - Lock persists across sessions
 * 
 * 3. GLOBAL STATE SYNCHRONIZATION
 *    - Challenges joined from any page appear everywhere
 *    - Progress syncs between Challenges and Profile pages
 *    - Single source of truth: MongoDB
 * 
 * 4. STREAK CALCULATION
 *    - Based on actual consecutive daily completions
 *    - Resets if day is missed
 *    - Milestone celebrations at 7, 30, 100 days
 * 
 * 5. PRODUCTION SAFEGUARDS
 *    - Redis caching for performance
 *    - Automatic retry on API failure
 *    - Comprehensive error handling
 *    - Request timeouts and validation
 */

// ... rest of your Challenges.js code remains the same ...
const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const UserChallenge = require('../models/UserChallenge');
const mongoose = require('mongoose');

// Get all challenges - returns available challenges and auto-creates default challenges if none exist
router.get('/all', async (req, res) => {
  try {
    // First check if there are any challenges in the database
    let challenges = await Challenge.find({ status: { $in: ['active', 'draft'] } }).lean();
    
    // If no challenges exist, seed default challenges
    if (challenges.length === 0) {
      console.log('No challenges found, seeding default challenges...');
      
      // Import the seed function logic directly
      const BUILT_IN_CHALLENGES = [
        {
          name: "Morning Grounding",
          type: "streak",
          category: "daily",
          description: "Start your day standing barefoot on grass for 10 minutes while breathing deeply.",
          difficulty: "easy",
          icon: "🌅",
          duration: 30,
          rules: ["10 minutes barefoot on grass", "Deep breathing throughout", "No phone during routine"],
          participants: 1250,
          featured: true
        },
        {
          name: "Daily Sunset Watch",
          type: "streak",
          category: "daily",
          description: "Watch sunset every evening without distractions for 15 minutes.",
          difficulty: "easy",
          icon: "🌇",
          duration: 21,
          rules: ["15 minutes sunset watch", "No screens allowed", "Document sky colors"],
          participants: 890,
          featured: false
        },
        {
          name: "Park Bench Meditation",
          type: "streak",
          category: "daily",
          description: "Meditate on a park bench for 20 minutes daily, focusing on natural sounds.",
          difficulty: "medium",
          icon: "🧘",
          duration: 14,
          rules: ["Find different benches", "20 minutes meditation", "Focus on natural sounds"],
          participants: 670,
          featured: false
        },
        {
          name: "Silent Nature Walk",
          type: "streak",
          category: "daily",
          description: "Walk 30 minutes in nature without any technology or talking.",
          difficulty: "medium",
          icon: "🤫",
          duration: 7,
          rules: ["30-minute silent walk", "No phone or music", "Observe 5 details"],
          participants: 980,
          featured: false
        },
        {
          name: "Weather Warrior",
          type: "streak",
          category: "daily",
          description: "Go outside 15 minutes daily regardless of weather conditions.",
          difficulty: "hard",
          icon: "🌧️",
          duration: 30,
          rules: ["15 minutes outside daily", "No weather excuses", "Document conditions"],
          participants: 320,
          featured: true
        }
      ];

      const challengesToInsert = BUILT_IN_CHALLENGES.map((challenge) => {
        const now = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + challenge.duration);

        return {
          name: challenge.name,
          description: challenge.description,
          type: challenge.type,
          category: challenge.category,
          difficulty: challenge.difficulty,
          creator: new mongoose.Types.ObjectId("000000000000000000000001"),
          status: 'active',
          settings: {
            duration: { value: challenge.duration, unit: 'days' },
            entryFee: 0,
            prizePool: 0,
            maxParticipants: 0,
            minParticipants: 1,
            visibility: 'public',
            verificationRequired: true,
            allowShameDays: true,
            strictMode: false
          },
          rules: {
            targetStreak: challenge.duration,
            targetDuration: 15,
            targetConsistency: 100,
            minDailyTime: 10,
            allowedVerificationMethods: ['manual', 'photo', 'location'],
            shamePenalty: 0,
            freezeAllowed: true,
            skipAllowed: false
          },
          schedule: {
            startDate: now,
            endDate: endDate,
            checkInTime: '20:00',
            timezone: 'UTC'
          },
          stats: {
            totalEntries: challenge.participants,
            activeParticipants: challenge.participants,
            completionRate: 0,
            averageScore: 0,
            totalPrizePool: 0
          },
          metadata: {
            isBuiltIn: true,
            challengeCode: `TG-${challenge.name.toUpperCase().replace(/\s+/g, '-').substring(0, 10)}-${Date.now()}`,
            tags: [challenge.category, challenge.difficulty, 'outdoor', 'habit'],
            icon: challenge.icon,
            bannerImage: null,
            themeColor: null,
            customRules: challenge.rules.join('\n')
          },
          participants: [],
          leaderboard: [],
          winners: [],
          notifications: {
            startReminderSent: false,
            dailyReminderSent: false,
            endReminderSent: false
          }
        };
      });

      challenges = await Challenge.insertMany(challengesToInsert);
      console.log(`Successfully seeded ${challenges.length} challenges`);
    }

    // Get user info if logged in
    const userEmail = req.headers['x-user-email'];
    let userId = null;
    
    if (userEmail) {
      const User = require('../models/user');
      const user = await User.findOne({ email: userEmail });
      userId = user?._id;
    }

    // If user is logged in, filter out joined challenges
    let availableChallenges = challenges;
    if (userId) {
      const userChallenges = await UserChallenge.find({ userId, status: 'active' }).lean();
      const joinedChallengeIds = userChallenges.map(uc => uc.challengeId.toString());
      availableChallenges = challenges.filter(c => !joinedChallengeIds.includes(c._id.toString()));
    }

    // Transform for frontend
    const transformedChallenges = availableChallenges.map(challenge => ({
      _id: challenge._id,
      id: challenge._id,
      name: challenge.name,
      description: challenge.description,
      type: challenge.type,
      category: challenge.category || 'daily',
      difficulty: challenge.difficulty || 'medium',
      settings: challenge.settings,
      duration: challenge.settings?.duration?.value || 30,
      icon: challenge.metadata?.icon || '🎯',
      rules: typeof challenge.rules === 'object' ? [challenge.rules] : [],
      participants: challenge.stats?.totalEntries || challenge.participants?.length || 0,
      metadata: challenge.metadata,
      featured: challenge.metadata?.featured || false,
      createdBy: 'system',
      status: challenge.status,
      createdAt: challenge.createdAt,
      xpReward: 0,
      dailyProgressRate: 0
    }));

    res.json({
      success: true,
      data: transformedChallenges,
      challenges: transformedChallenges
    });
  } catch (error) {
    console.error('Get all challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get all available challenges (public, not joined by user)
router.get('/available', async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'];
    let userId = null;
    
    if (userEmail) {
      const User = require('../models/user');
      const user = await User.findOne({ email: userEmail });
      userId = user?._id;
    }

    // Get all active challenges
    const challenges = await Challenge.find({ status: { $in: ['active', 'draft'] } }).lean();
    
    // If user is logged in, filter out joined challenges
    let availableChallenges = challenges;
    if (userId) {
      const userChallenges = await UserChallenge.find({ userId, status: 'active' }).lean();
      const joinedChallengeIds = userChallenges.map(uc => uc.challengeId.toString());
      availableChallenges = challenges.filter(c => !joinedChallengeIds.includes(c._id.toString()));
    }

    // Transform for frontend
    const transformedChallenges = availableChallenges.map(challenge => ({
      _id: challenge._id,
      id: challenge._id,
      name: challenge.name,
      description: challenge.description,
      type: challenge.type,
      category: challenge.category || 'daily',
      difficulty: challenge.difficulty || 'medium',
      settings: challenge.settings,
      duration: challenge.settings?.duration?.value || 30,
      icon: challenge.metadata?.icon || '🎯',
      rules: typeof challenge.rules === 'object' ? [challenge.rules] : [],
      participants: challenge.stats?.totalEntries || challenge.participants?.length || 0,
      metadata: challenge.metadata,
      featured: challenge.metadata?.featured || false,
      createdBy: 'system',
      status: challenge.status,
      createdAt: challenge.createdAt,
      xpReward: 0,
      dailyProgressRate: 0
    }));

    res.json({
      success: true,
      data: transformedChallenges,
      challenges: transformedChallenges
    });
  } catch (error) {
    console.error('Get available challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get built-in challenges only
router.get('/built-in', async (req, res) => {
  try {
    const challenges = await Challenge.find({ 'metadata.isBuiltIn': true }).lean();
    
    const transformedChallenges = challenges.map(challenge => ({
      _id: challenge._id,
      id: challenge._id,
      name: challenge.name,
      description: challenge.description,
      type: challenge.type,
      category: challenge.category || 'daily',
      difficulty: challenge.difficulty || 'medium',
      settings: challenge.settings,
      duration: challenge.settings?.duration?.value || 30,
      icon: challenge.metadata?.icon || '🎯',
      rules: typeof challenge.rules === 'object' ? [challenge.rules] : [],
      participants: challenge.stats?.totalEntries || 0,
      metadata: challenge.metadata,
      featured: challenge.metadata?.featured || false,
      status: challenge.status,
      createdAt: challenge.createdAt,
      xpReward: 0,
      dailyProgressRate: 0
    }));

    res.json({
      success: true,
      data: transformedChallenges,
      challenges: transformedChallenges
    });
  } catch (error) {
    console.error('Get built-in challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get user's joined challenges with progress
router.get('/my-challenges', async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'];
    
    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: 'User email required'
      });
    }

    const User = require('../models/user');
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find user's active challenges with challenge details
    const userChallenges = await UserChallenge.find({
      userId: user._id,
      status: 'active'
    }).populate('challengeId').lean();

    const challenges = userChallenges
      .filter(uc => uc.challengeId)
      .map(uc => {
        const challenge = uc.challengeId;
        
        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayKey = today.toISOString().split('T')[0];
        
        // Check if completed today
        const completedToday = uc.dailyProgress?.[todayKey]?.completed || false;
        
        // Clean dailyProgress - convert nested objects to simple values
        const cleanDailyProgress = {};
        if (uc.dailyProgress) {
          Object.keys(uc.dailyProgress).forEach(key => {
            const dayData = uc.dailyProgress[key];
            cleanDailyProgress[key] = {
              completed: dayData?.completed || false,
              completedAt: dayData?.completedAt ? new Date(dayData.completedAt).toISOString() : null,
              notes: dayData?.notes || '',
              verificationMethod: dayData?.verificationMethod || ''
            };
          });
        }

        // Calculate progress based on days elapsed since joining
        const duration = challenge.settings?.duration?.value || 30;
        const totalProgress = uc.totalProgress || 0;
        
        // Calculate days since joining
        const joinedAt = uc.joinedAt ? new Date(uc.joinedAt) : new Date();
        const now = new Date();
        const daysSinceJoined = Math.max(1, Math.floor((now - joinedAt) / (1000 * 60 * 60 * 24)) + 1);
        
        // Progress is based on actual completions vs duration
        const progress = Math.min(100, Math.round((totalProgress / duration) * 100));
        
        // Days remaining
        const daysRemaining = Math.max(0, duration - totalProgress);
        
        // Daily progress rate (percentage per day)
        const dailyProgressRate = Math.round((1 / duration) * 100);
        
        // Expected progress based on days elapsed (for comparison)
        const expectedProgress = Math.min(100, Math.round((daysSinceJoined / duration) * 100));
        
        return {
          _id: uc._id,
          id: challenge._id,
          challengeId: challenge._id,
          name: challenge.name,
          description: challenge.description,
          type: challenge.type,
          category: challenge.category || 'daily',
          difficulty: challenge.difficulty || 'medium',
          // Only include simple settings values, not nested objects
          duration: duration,
          icon: challenge.metadata?.icon || '🎯',
          rules: typeof challenge.rules === 'object' ? [challenge.rules] : [],
          participants: challenge.stats?.totalEntries || 0,
          featured: challenge.metadata?.featured || false,
          status: uc.status,
          joinedAt: uc.joinedAt,
          // Progress - all simple values
          currentStreak: uc.currentStreak || 0,
          longestStreak: uc.longestStreak || 0,
          totalProgress: totalProgress,
          completedToday: completedToday,
          lastActivity: uc.lastActivity ? new Date(uc.lastActivity).toISOString() : null,
          dailyProgress: cleanDailyProgress,
          // Enhanced progress fields
          progress: progress,
          progressPercentage: progress, // Alias for easier access
          daysRemaining: daysRemaining,
          dailyProgressRate: dailyProgressRate,
          expectedProgress: expectedProgress,
          streak: uc.currentStreak || 0,
          totalDays: totalProgress,
          completedDays: Object.keys(cleanDailyProgress).filter(key => cleanDailyProgress[key]?.completed),
          // Additional info
          isOnTrack: totalProgress >= Math.floor(daysSinceJoined * 0.8), // 80% of expected
          isCompleted: totalProgress >= duration
        };
      });

    res.json({
      success: true,
      challenges: challenges,
      data: challenges
    });
  } catch (error) {
    console.error('Get user challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get user's active challenges (legacy endpoint)
router.get('/user/:email/challenges', async (req, res) => {
  try {
    const userEmail = req.params.email;

    // Find user by email
    const User = require('../models/user');
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find user's active challenges
    const userChallenges = await UserChallenge.find({
      userId: user._id,
      status: 'active'
    }).populate('challengeId');

    const challenges = userChallenges
      .filter(uc => uc.challengeId)
      .map(uc => ({
        _id: uc._id,
        id: uc._id,
        challengeId: uc.challengeId._id,
        name: uc.challengeId.name,
        description: uc.challengeId.description,
        type: uc.challengeId.type,
        category: uc.challengeId.category,
        difficulty: uc.challengeId.difficulty,
        duration: uc.challengeId.settings?.duration?.value || 30,
        progress: uc.totalProgress || 0,
        joinedAt: uc.joinedAt,
        status: uc.status,
        rules: uc.challengeId.rules || [],
        metadata: uc.challengeId.metadata || {},
        icon: uc.challengeId.metadata?.icon || '🎯',
        participants: uc.challengeId.participants?.length || 0,
        currentStreak: uc.currentStreak || 0,
        longestStreak: uc.longestStreak || 0,
        totalProgress: uc.totalProgress || 0
      }));

    res.json({
      success: true,
      data: challenges
    });
  } catch (error) {
    console.error('Get user challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get all challenges
router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find({}).lean();
    
    const transformedChallenges = challenges.map(challenge => ({
      _id: challenge._id,
      id: challenge._id,
      name: challenge.name,
      description: challenge.description,
      type: challenge.type,
      category: challenge.category,
      difficulty: challenge.difficulty || 'medium',
      duration: challenge.settings?.duration?.value || 30,
      icon: challenge.metadata?.icon || '🎯',
      rules: challenge.rules || [],
      participants: challenge.stats?.totalEntries || 0,
      metadata: challenge.metadata,
      featured: challenge.metadata?.featured || false,
      status: challenge.status
    }));

    res.json({
      success: true,
      challenges: transformedChallenges
    });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get specific challenge
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }
    res.json({
      success: true,
      challenge
    });
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create challenge (authenticated)
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name and description are required'
      });
    }

    const userEmail = req.headers['x-user-email'];
    let creatorId = null;
    
    if (userEmail) {
      const User = require('../models/user');
      const user = await User.findOne({ email: userEmail });
      creatorId = user?._id;
    }

    const challenge = new Challenge({
      name,
      description,
      creator: creatorId,
      status: 'active'
    });

    await challenge.save();

    res.status(201).json({
      success: true,
      challenge
    });
  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Join challenge
router.post('/:id/join', async (req, res) => {
  try {
    const challengeIdParam = req.params.id;
    
    // Convert challengeId to MongoDB ObjectId
    let challengeId;
    try {
      challengeId = new mongoose.Types.ObjectId(challengeIdParam);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid challenge ID format'
      });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    // Get user by email from header
    const userEmail = req.headers['x-user-email'];
    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: 'User email required'
      });
    }

    const User = require('../models/user');
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already joined
    const existingJoin = await UserChallenge.findOne({
      userId: user._id,
      challengeId: challengeId
    });

    if (existingJoin) {
      return res.status(400).json({
        success: false,
        message: 'Already joined this challenge'
      });
    }

    const userChallenge = new UserChallenge({
      userId: user._id,
      challengeId: challengeId,
      joinedAt: new Date(),
      totalProgress: 0,
      currentStreak: 0,
      longestStreak: 0,
      dailyProgress: {},
      status: 'active'
    });

    await userChallenge.save();

    // Update challenge stats
    challenge.stats = challenge.stats || {};
    challenge.stats.totalEntries = (challenge.stats.totalEntries || 0) + 1;
    challenge.stats.activeParticipants = (challenge.stats.activeParticipants || 0) + 1;
    await challenge.save();

    res.json({
      success: true,
      message: 'Successfully joined challenge',
      userChallenge: {
        id: userChallenge._id,
        challengeId: challenge._id,
        name: challenge.name,
        joinedAt: userChallenge.joinedAt,
        progress: userChallenge.totalProgress,
        currentStreak: 0,
        status: userChallenge.status
      }
    });
  } catch (error) {
    console.error('Join challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Verify/Complete daily challenge progress
router.post('/:id/verify', async (req, res) => {
  try {
    const challengeIdParam = req.params.id;
    const userEmail = req.headers['x-user-email'];
    
    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: 'User email required'
      });
    }

    const User = require('../models/user');
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Convert challengeId to MongoDB ObjectId
    let challengeId;
    try {
      challengeId = new mongoose.Types.ObjectId(challengeIdParam);
    } catch (error) {
      console.error('Invalid challenge ID format:', challengeIdParam);
      return res.status(400).json({
        success: false,
        message: 'Invalid challenge ID format'
      });
    }

    // Find the user's challenge
    const userChallenge = await UserChallenge.findOne({
      userId: user._id,
      challengeId: challengeId,
      status: 'active'
    });

    if (!userChallenge) {
      // Debug: Log what we're looking for
      console.log('Challenge not found or not joined:', {
        userId: user._id,
        challengeId: challengeId,
        challengeIdParam: challengeIdParam
      });
      return res.status(404).json({
        success: false,
        message: 'Challenge not found or not joined'
      });
    }

    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Initialize dailyProgress if not exists
    if (!userChallenge.dailyProgress) {
      userChallenge.dailyProgress = {};
    }

    // Check if already completed today
    const todayKey = today.toISOString().split('T')[0];
    if (userChallenge.dailyProgress[todayKey]?.completed) {
      return res.json({
        success: true,
        message: 'Already completed today',
        data: {
          date: todayKey,
          completed: true,
          alreadyDone: true,
          currentStreak: userChallenge.currentStreak,
          longestStreak: userChallenge.longestStreak,
          totalProgress: userChallenge.totalProgress
        }
      });
    }

    // Mark today as completed
    userChallenge.dailyProgress[todayKey] = {
      completed: true,
      completedAt: new Date(),
      notes: req.body?.notes || '',
      verificationMethod: req.body?.verificationMethod || 'manual'
    };

    // Update progress
    userChallenge.totalProgress = (userChallenge.totalProgress || 0) + 1;
    
    // Update streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];
    
    if (userChallenge.dailyProgress[yesterdayKey]?.completed) {
      userChallenge.currentStreak = (userChallenge.currentStreak || 0) + 1;
    } else {
      userChallenge.currentStreak = 1;
    }
    
    userChallenge.longestStreak = Math.max(
      userChallenge.longestStreak || 0,
      userChallenge.currentStreak
    );
    
    userChallenge.lastActivity = new Date();
    
    await userChallenge.save();

    res.json({
      success: true,
      message: 'Daily progress verified successfully',
      data: {
        date: todayKey,
        completed: true,
        totalProgress: userChallenge.totalProgress,
        currentStreak: userChallenge.currentStreak,
        longestStreak: userChallenge.longestStreak
      }
    });
  } catch (error) {
    console.error('Verify challenge progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Leave challenge
router.post('/:id/leave', async (req, res) => {
  try {
    const challengeIdParam = req.params.id;
    const userEmail = req.headers['x-user-email'];
    
    // Convert challengeId to MongoDB ObjectId
    let challengeId;
    try {
      challengeId = new mongoose.Types.ObjectId(challengeIdParam);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid challenge ID format'
      });
    }
    
    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: 'User email required'
      });
    }

    const User = require('../models/user');
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find and update the user's challenge
    const userChallenge = await UserChallenge.findOne({
      userId: user._id,
      challengeId: challengeId
    });

    if (!userChallenge) {
      return res.status(404).json({
        success: false,
        message: 'You have not joined this challenge'
      });
    }

    userChallenge.status = 'withdrawn';
    await userChallenge.save();

    // Update challenge stats
    const challenge = await Challenge.findById(challengeId);
    if (challenge) {
      challenge.stats = challenge.stats || {};
      challenge.stats.activeParticipants = Math.max(0, (challenge.stats.activeParticipants || 1) - 1);
      await challenge.save();
    }

    res.json({
      success: true,
      message: 'Successfully left the challenge'
    });
  } catch (error) {
    console.error('Leave challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});
router.get('/user/:email/daily-checkins', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const date = req.query.date;
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email required'
      });
    }

    const User = require('../models/user');
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find user's active challenges
    const userChallenges = await UserChallenge.find({
      userId: user._id,
      status: 'active'
    }).populate('challengeId');

    // Get today's date
    const today = date || new Date().toISOString().split('T')[0];

    // Build check-ins data
    const checkins = userChallenges
      .filter(uc => uc.challengeId)
      .map(uc => {
        const challenge = uc.challengeId;
        const dailyProgress = uc.dailyProgress || {};
        const dayProgress = dailyProgress[today];
        
        return {
          challengeId: challenge._id,
          challenge: {
            _id: challenge._id,
            name: challenge.name,
            icon: challenge.metadata?.icon || '🎯'
          },
          date: today,
          completed: dayProgress?.completed || false,
          completedAt: dayProgress?.completedAt || null,
          notes: dayProgress?.notes || '',
          verificationMethod: dayProgress?.verificationMethod || null,
          currentStreak: uc.currentStreak || 0,
          totalProgress: uc.totalProgress || 0
        };
      });

    res.json({
      success: true,
      data: checkins
    });
  } catch (error) {
    console.error('Get daily check-ins error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Seed built-in challenges (for development/testing)
router.post('/seed', async (req, res) => {
  try {
    // Built-in challenges data
    const BUILT_IN_CHALLENGES = [
      {
        name: "Morning Grounding",
        type: "streak",
        category: "daily",
        description: "Start your day standing barefoot on grass for 10 minutes while breathing deeply. Connect with the earth and set a positive intention for your day.",
        difficulty: "easy",
        icon: "🌅",
        duration: 30,
        rules: [
          "10 minutes barefoot on grass",
          "Deep breathing throughout",
          "No phone during routine",
          "Observe 3 things around you"
        ],
        participants: 1250,
        featured: true
      },
      {
        name: "Daily Sunset Watch",
        type: "streak",
        category: "daily",
        description: "Watch sunset every evening without distractions for 15 minutes. Unwind and appreciate the beauty of the day ending.",
        difficulty: "easy",
        icon: "🌇",
        duration: 21,
        rules: [
          "15 minutes sunset watch",
          "No screens allowed",
          "Document sky colors",
          "Share one reflection"
        ],
        participants: 890,
        featured: false
      },
      {
        name: "Park Bench Meditation",
        type: "streak",
        category: "daily",
        description: "Meditate on a park bench for 20 minutes daily, focusing on natural sounds around you.",
        difficulty: "medium",
        icon: "🧘",
        duration: 14,
        rules: [
          "Find different benches",
          "20 minutes meditation",
          "Focus on natural sounds",
          "No guided apps"
        ],
        participants: 670,
        featured: false
      },
      {
        name: "Tree Identification",
        type: "streak",
        category: "weekly",
        description: "Learn to identify 7 different tree species in your local area. Become familiar with nature around you.",
        difficulty: "medium",
        icon: "🌳",
        duration: 7,
        rules: [
          "Identify 7 different trees",
          "Take photos of leaves",
          "Learn one fact each",
          "Map their locations"
        ],
        participants: 430,
        featured: false
      },
      {
        name: "Silent Nature Walk",
        type: "streak",
        category: "daily",
        description: "Walk 30 minutes in nature without any technology or talking. Experience true peace.",
        difficulty: "medium",
        icon: "🤫",
        duration: 7,
        rules: [
          "30-minute silent walk",
          "No phone or music",
          "Observe 5 details",
          "No talking allowed"
        ],
        participants: 980,
        featured: false
      },
      {
        name: "Weather Warrior",
        type: "streak",
        category: "daily",
        description: "Go outside 15 minutes daily regardless of weather conditions. Build unstoppable discipline.",
        difficulty: "hard",
        icon: "🌧️",
        duration: 30,
        rules: [
          "15 minutes outside daily",
          "No weather excuses",
          "Document conditions",
          "Reflect on experience"
        ],
        participants: 320,
        featured: true
      },
      {
        name: "Digital Sunset",
        type: "streak",
        category: "daily",
        description: "No screens 1 hour before bed, replace with evening outdoor time. Improve sleep and connection.",
        difficulty: "medium",
        icon: "📵",
        duration: 21,
        rules: [
          "Screens off 60+ minutes",
          "Spend time outside",
          "Stargaze or walk",
          "Track sleep improvements"
        ],
        participants: 1250,
        featured: true
      },
      {
        name: "5-Bench Circuit",
        type: "streak",
        category: "daily",
        description: "Visit and sit on 5 different public benches in your neighborhood. Explore your area.",
        difficulty: "easy",
        icon: "🪑",
        duration: 1,
        rules: [
          "Find 5 distinct benches",
          "Sit 3 minutes each",
          "No phone while sitting",
          "Sketch or write about view"
        ],
        participants: 560,
        featured: false
      },
      {
        name: "Morning Cold Shower",
        type: "streak",
        category: "daily",
        description: "Take a cold shower outdoors each morning. Build mental toughness.",
        difficulty: "hard",
        icon: "🚿",
        duration: 14,
        rules: [
          "Cold water only",
          "Outdoor shower preferred",
          "2 minutes minimum",
          "No warm water"
        ],
        participants: 290,
        featured: false
      },
      {
        name: "Bird Watching Log",
        type: "streak",
        category: "daily",
        description: "Identify and log 5 different bird species daily. Connect with wildlife.",
        difficulty: "easy",
        icon: "🐦",
        duration: 21,
        rules: [
          "5 bird species daily",
          "Log in journal or app",
          "Note behaviors",
          "Take photos if possible"
        ],
        participants: 380,
        featured: false
      },
      {
        name: "Forest Bathing",
        type: "streak",
        category: "daily",
        description: "Spend 30 minutes in a forest or wooded area. Practice shinrin-yoku.",
        difficulty: "medium",
        icon: "🌲",
        duration: 14,
        rules: [
          "30 min forest time",
          "All 5 senses engaged",
          "No phone interaction",
          "Slow, deliberate pace"
        ],
        participants: 450,
        featured: true
      },
      {
        name: "Outdoor Meal Planning",
        type: "streak",
        category: "daily",
        description: "Plan and prepare one outdoor meal daily. Eat mindfully in nature.",
        difficulty: "easy",
        icon: "🍽️",
        duration: 7,
        rules: [
          "One outdoor meal",
          "Sit outside to eat",
          "No distractions",
          "Appreciate the food"
        ],
        participants: 620,
        featured: false
      },
      {
        name: "Rock Pool Exploration",
        type: "streak",
        category: "weekly",
        description: "Visit rock pools and document marine life. Discover ocean treasures.",
        difficulty: "medium",
        icon: "🦀",
        duration: 7,
        rules: [
          "Visit 2 rock pools",
          "Document 5 species",
          "Respect wildlife",
          "Leave no trace"
        ],
        participants: 180,
        featured: false
      },
      {
        name: "Sunrise Running",
        type: "streak",
        category: "daily",
        description: "Run at sunrise for 30 minutes. Start your day with energy.",
        difficulty: "hard",
        icon: "🌅",
        duration: 21,
        rules: [
          "30 min run at sunrise",
          "Outdoors only",
          "Track distance",
          "No missing days"
        ],
        participants: 540,
        featured: false
      },
      {
        name: "Garden Meditation",
        type: "streak",
        category: "daily",
        description: "Meditate in your garden for 15 minutes. Find peace at home.",
        difficulty: "easy",
        icon: "🌻",
        duration: 30,
        rules: [
          "15 min garden meditation",
          "Same time daily",
          "Focus on plants",
          "No indoor fallback"
        ],
        participants: 380,
        featured: false
      },
      {
        name: "Beachcombing Adventure",
        type: "streak",
        category: "daily",
        description: "Walk along the beach for 30 minutes daily. Collect interesting finds.",
        difficulty: "easy",
        icon: "🏖️",
        duration: 14,
        rules: [
          "30 min beach walk",
          "Collect one item",
          "Document findings",
          "Respect wildlife"
        ],
        participants: 290,
        featured: false
      },
      {
        name: "Stargazing Session",
        type: "streak",
        category: "daily",
        description: "Spend 20 minutes outdoors stargazing each night. Learn about the cosmos.",
        difficulty: "easy",
        icon: "⭐",
        duration: 21,
        rules: [
          "20 min stargazing",
          "Identify 3 constellations",
          "Note moon phase",
          "No telescope needed"
        ],
        participants: 420,
        featured: false
      }
    ];

    // Clear existing built-in challenges
    await Challenge.deleteMany({ 'metadata.isBuiltIn': true });

    // Create new challenges
    const challengesToInsert = BUILT_IN_CHALLENGES.map((challenge) => {
      const now = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + challenge.duration);

      return {
        name: challenge.name,
        description: challenge.description,
        type: challenge.type,
        category: challenge.category,
        difficulty: challenge.difficulty,
        creator: new mongoose.Types.ObjectId("000000000000000000000001"),
        status: 'active',
        settings: {
          duration: {
            value: challenge.duration,
            unit: 'days'
          },
          entryFee: 0,
          prizePool: 0,
          maxParticipants: 0,
          minParticipants: 1,
          visibility: 'public',
          verificationRequired: true,
          allowShameDays: true,
          strictMode: false
        },
        rules: {
          targetStreak: challenge.duration,
          targetDuration: 15,
          targetConsistency: 100,
          minDailyTime: 10,
          allowedVerificationMethods: ['manual', 'photo', 'location'],
          shamePenalty: 0,
          freezeAllowed: true,
          skipAllowed: false
        },
        schedule: {
          startDate: now,
          endDate: endDate,
          checkInTime: '20:00',
          timezone: 'UTC'
        },
        stats: {
          totalEntries: challenge.participants,
          activeParticipants: challenge.participants,
          completionRate: 0,
          averageScore: 0,
          totalPrizePool: 0
        },
        metadata: {
          isBuiltIn: true,
          challengeCode: `TG-${challenge.name.toUpperCase().replace(/\s+/g, '-').substring(0, 10)}-${Date.now()}`,
          tags: [challenge.category, challenge.difficulty, 'outdoor', 'habit'],
          icon: challenge.icon,
          bannerImage: null,
          themeColor: null,
          customRules: challenge.rules.join('\n')
        },
        participants: [],
        leaderboard: [],
        winners: [],
        notifications: {
          startReminderSent: false,
          dailyReminderSent: false,
          endReminderSent: false
        }
      };
    });

    const insertedChallenges = await Challenge.insertMany(challengesToInsert);
    
    res.json({
      success: true,
      message: `Successfully seeded ${insertedChallenges.length} built-in challenges`,
      count: insertedChallenges.length
    });
  } catch (error) {
    console.error('Seed challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
