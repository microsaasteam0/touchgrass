const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const UserChallenge = require('../models/UserChallenge');
const ChallengeProgress = require('../models/ChallengeProgress');
const User = require('../models/user');
const { authenticateToken } = require('../middleware/auth');
const { validateChallenge } = require('../middleware/validation');

// Available challenges data (hardcoded for now - would come from DB)
const availableChallenges = [
  {
    id: 1,
    name: "The First 10 Minutes",
    type: "foundation",
    description: "Start your day outside—no phone, no agenda. Just be present in the open air for the first 10 minutes after you wake up.",
    duration: "daily",
    rules: [
      "Go outside within 10 minutes of waking",
      "Stay for minimum 10 minutes",
      "No phone usage allowed",
      "Breathe deeply and observe your surroundings"
    ],
    difficulty: "easy",
    icon: "☀️",
    xpReward: 100,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "The Silent Kilometer",
    type: "mindfulness",
    description: "Walk one full kilometer in complete silence—no phone, no music, no podcasts. Just you, your breath, and your surroundings.",
    duration: "daily",
    rules: [
      "1 km minimum distance (track via basic pedometer or map)",
      "Absolute silence (no audio input)",
      "Phone stays in pocket",
      "Note one small detail you've never noticed before"
    ],
    difficulty: "medium",
    icon: "🤫",
    xpReward: 150,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "No Complaining / No Excuses Week",
    type: "mindset",
    description: "For 7 days, ban all complaints and excuses. Every time you catch yourself, state one actionable step to improve the situation.",
    duration: "weekly",
    rules: [
      "No complaining about anything",
      "No excuses for not completing tasks",
      "When you slip, state one actionable improvement step",
      "Track slips in a journal"
    ],
    difficulty: "hard",
    icon: "🧠",
    xpReward: 200,
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "First Principles Week",
    type: "mindset",
    description: "For every major problem or assumption, break it down to fundamental truths and rebuild from there.",
    duration: "weekly",
    rules: [
      "Question everything 'why' at least 5 times",
      "Break down 3 major assumptions daily",
      "Rebuild solutions from first principles",
      "Document insights"
    ],
    difficulty: "medium",
    icon: "🔍",
    xpReward: 180,
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    name: "Emotional Weather Report",
    type: "emotional",
    description: "Three times daily, pause and name your emotional state with one word. No judgment, just observation.",
    duration: "daily",
    rules: [
      "Morning, afternoon, evening check-ins",
      "One-word emotional state",
      "No judgment or analysis",
      "Track patterns weekly"
    ],
    difficulty: "easy",
    icon: "⛅",
    xpReward: 120,
    createdAt: new Date().toISOString()
  },
  {
    id: 6,
    name: "Deliberate Discomfort Daily",
    type: "mindset",
    description: "Do one thing daily that pushes you slightly outside your comfort zone, especially socially.",
    duration: "daily",
    rules: [
      "One uncomfortable action daily",
      "Focus on social situations",
      "Document your fears and outcomes",
      "Increase difficulty weekly"
    ],
    difficulty: "medium",
    icon: "🚀",
    xpReward: 140,
    createdAt: new Date().toISOString()
  },
  {
    id: 7,
    name: "10 Customer Calls Challenge",
    type: "business",
    description: "Every week, have 10 conversations with potential or current users. No selling, just ask 'Why?' and 'Tell me more.'",
    duration: "weekly",
    rules: [
      "10 conversations weekly",
      "No selling allowed",
      "Focus on understanding needs",
      "Document all insights"
    ],
    difficulty: "hard",
    icon: "📞",
    xpReward: 250,
    createdAt: new Date().toISOString()
  },
  {
    id: 8,
    name: "Perfect Week Role Play",
    type: "business",
    description: "Spend one week living exactly as your ideal customer does. Use their tools, read their forums, follow their routines.",
    duration: "weekly",
    rules: [
      "Live as your customer for a week",
      "Use their tools and platforms",
      "Follow their daily routines",
      "Develop empathy insights"
    ],
    difficulty: "hard",
    icon: "🎭",
    xpReward: 220,
    createdAt: new Date().toISOString()
  },
  {
    id: 9,
    name: "Fake Door Test",
    type: "business",
    description: "Create a mock-up or button for a feature and see how many people try to access it. Validate demand with zero code.",
    duration: "weekly",
    rules: [
      "Create feature mock-up",
      "Add 'coming soon' button",
      "Track clicks and interest",
      "Survey interested users"
    ],
    difficulty: "medium",
    icon: "🚪",
    xpReward: 160,
    createdAt: new Date().toISOString()
  },
  {
    id: 10,
    name: "Competitor Love Letter",
    type: "business",
    description: "Write a detailed analysis of your top competitor, listing everything they do better than you.",
    duration: "weekly",
    rules: [
      "Analyze top competitor",
      "List everything they do better",
      "Identify opportunity gaps",
      "Create improvement plan"
    ],
    difficulty: "easy",
    icon: "💌",
    xpReward: 130,
    createdAt: new Date().toISOString()
  }
];

// Get all challenges
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, type, difficulty, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;

    const challenges = await Challenge.find(filter)
      .populate('createdBy', 'displayName username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Challenge.countDocuments(filter);

    res.json({
      success: true,
      data: challenges,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch challenges'
    });
  }
});

// Get user's joined challenges
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's challenge participations
    const userChallenges = await UserChallenge.find({ userId })
      .populate('challengeId')
      .sort({ joinedAt: -1 });

    // Get progress for each challenge
    const challengesWithProgress = await Promise.all(
      userChallenges.map(async (userChallenge) => {
        const progress = await ChallengeProgress.find({
          userChallengeId: userChallenge._id
        }).sort({ progressDate: -1 });

        const currentStreak = await ChallengeProgress.calculateStreak(userChallenge._id);

        return {
          ...userChallenge.challengeId.toObject(),
          userProgress: {
            streak: currentStreak,
            progress: progress.filter(p => p.completed).length,
            totalProgress: userChallenge.totalProgress,
            joinedAt: userChallenge.joinedAt,
            status: userChallenge.status,
            completed: userChallenge.completed
          },
          recentProgress: progress.slice(0, 7) // Last 7 days
        };
      })
    );

    res.json({
      success: true,
      data: challengesWithProgress
    });
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user challenges'
    });
  }
});

// Get single challenge
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('createdBy', 'displayName username avatar')
      .populate('joinedUsers.userId', 'displayName username avatar');

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    res.json({
      success: true,
      data: challenge
    });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch challenge'
    });
  }
});

// Create new challenge
router.post('/', authenticateToken, validateChallenge, async (req, res) => {
  try {
    const {
      name,
      description,
      duration,
      type,
      difficulty,
      stake,
      prizePool,
      rules,
      isPublic,
      groupId
    } = req.body;

    const challenge = new Challenge({
      name,
      description,
      duration,
      type,
      difficulty,
      stake: stake || 0,
      prizePool: prizePool || 0,
      rules: rules || [],
      isPublic: isPublic !== false,
      groupId,
      createdBy: req.user.id,
      status: 'active',
      joinedUsers: [{
        userId: req.user.id,
        joinedAt: new Date(),
        streak: 0,
        progress: 0,
        isCreator: true
      }]
    });

    await challenge.save();

    // Populate creator info
    await challenge.populate('createdBy', 'displayName username avatar');

    res.status(201).json({
      success: true,
      data: challenge,
      message: 'Challenge created successfully'
    });
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create challenge'
    });
  }
});

// Join challenge
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const challengeId = req.params.id;
    const userId = req.user.id;

    // Check if challenge exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    // Check if user already joined
    const existingParticipation = await UserChallenge.findOne({
      userId,
      challengeId
    });

    if (existingParticipation) {
      return res.status(400).json({
        success: false,
        message: existingParticipation.status === 'active'
          ? 'Already joined this challenge'
          : 'You have already participated in this challenge'
      });
    }

    // Check if challenge is full
    const activeParticipants = await UserChallenge.countDocuments({
      challengeId,
      status: 'active'
    });

    if (challenge.settings?.maxParticipants > 0 &&
        activeParticipants >= challenge.settings.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Challenge is full'
      });
    }

    // Create user challenge participation
    const userChallenge = new UserChallenge({
      userId,
      challengeId,
      joinedAt: new Date(),
      status: 'active'
    });

    await userChallenge.save();

    res.json({
      success: true,
      message: 'Successfully joined challenge',
      data: {
        userChallenge,
        challenge
      }
    });
  } catch (error) {
    console.error('Error joining challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join challenge'
    });
  }
});

// Update challenge progress
router.post('/:id/progress', authenticateToken, async (req, res) => {
  try {
    const { date, completed, notes } = req.body;
    const challengeId = req.params.id;
    const userId = req.user.id;

    // Find user's challenge participation
    const userChallenge = await UserChallenge.findOne({
      userId,
      challengeId,
      status: 'active'
    });

    if (!userChallenge) {
      return res.status(400).json({
        success: false,
        message: 'User not in this challenge'
      });
    }

    const progressDate = date ? new Date(date) : new Date();
    progressDate.setHours(0, 0, 0, 0);

    // Check if progress already exists for this date
    let progressEntry = await ChallengeProgress.findOne({
      userChallengeId: userChallenge._id,
      progressDate
    });

    if (progressEntry) {
      // Update existing progress
      progressEntry.completed = completed;
      progressEntry.notes = notes || progressEntry.notes;
      progressEntry.checkinTime = new Date();
      await progressEntry.save();
    } else {
      // Create new progress entry
      progressEntry = new ChallengeProgress({
        userChallengeId: userChallenge._id,
        userId,
        challengeId,
        progressDate,
        completed,
        notes
      });
      await progressEntry.save();
    }

    // Update user challenge stats
    await userChallenge.updateProgress({ completed });

    // Recalculate streak
    const currentStreak = await ChallengeProgress.calculateStreak(userChallenge._id);

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: {
        progress: progressEntry,
        userChallenge,
        currentStreak
      }
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update progress'
    });
  }
});

// Leave challenge
router.delete('/:id/join', authenticateToken, async (req, res) => {
  try {
    const challengeId = req.params.id;
    const userId = req.user.id;

    // Find and update user challenge status
    const userChallenge = await UserChallenge.findOne({
      userId,
      challengeId,
      status: 'active'
    });

    if (!userChallenge) {
      return res.status(400).json({
        success: false,
        message: 'User not in this challenge'
      });
    }

    await userChallenge.leaveChallenge();

    res.json({
      success: true,
      message: 'Successfully left challenge'
    });
  } catch (error) {
    console.error('Error leaving challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to leave challenge'
    });
  }
});

// Update challenge (only creator)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    // Check if user is creator
    if (challenge.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only challenge creator can update'
      });
    }

    const allowedUpdates = [
      'name', 'description', 'rules', 'isPublic'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        challenge[field] = req.body[field];
      }
    });

    await challenge.save();

    res.json({
      success: true,
      data: challenge,
      message: 'Challenge updated successfully'
    });
  } catch (error) {
    console.error('Error updating challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update challenge'
    });
  }
});

// Delete challenge (only creator)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    // Check if user is creator
    if (challenge.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only challenge creator can delete'
      });
    }

    await Challenge.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Challenge deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete challenge'
    });
  }
});

// Get challenge progress details
router.get('/:id/progress', authenticateToken, async (req, res) => {
  try {
    const challengeId = req.params.id;
    const userId = req.user.id;

    // Find user's challenge participation
    const userChallenge = await UserChallenge.findOne({
      userId,
      challengeId,
      status: 'active'
    });

    if (!userChallenge) {
      return res.status(400).json({
        success: false,
        message: 'User not in this challenge'
      });
    }

    // Get progress history
    const progress = await ChallengeProgress.find({
      userChallengeId: userChallenge._id
    }).sort({ progressDate: -1 });

    // Calculate streak
    const currentStreak = await ChallengeProgress.calculateStreak(userChallenge._id);

    res.json({
      success: true,
      data: {
        progress,
        currentStreak,
        totalProgress: userChallenge.totalProgress,
        longestStreak: userChallenge.longestStreak,
        joinedAt: userChallenge.joinedAt,
        status: userChallenge.status
      }
    });
  } catch (error) {
    console.error('Error fetching challenge progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch challenge progress'
    });
  }
});

// Get all available challenges (public endpoint)
router.get('/available', async (req, res) => {
  try {
    res.json({
      success: true,
      challenges: availableChallenges
    });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user's joined challenges
router.get('/my-challenges', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // For now, return empty array - would fetch from database
    // In a real implementation, this would query user_challenges table
    const userChallenges = [];

    res.json({
      success: true,
      challenges: userChallenges
    });
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Join a challenge
router.post('/:challengeId/join', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const challengeId = parseInt(req.params.challengeId);

    // Check if challenge exists
    const challenge = availableChallenges.find(c => c.id === challengeId);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    // For now, simulate success - would check database for existing participation
    // In a real implementation, this would check user_challenges table

    const joinedChallenge = {
      id: Date.now(),
      challengeId: challenge.id,
      userId: userId,
      name: challenge.name,
      type: challenge.type,
      description: challenge.description,
      rules: challenge.rules,
      difficulty: challenge.difficulty,
      icon: challenge.icon,
      joinedAt: new Date().toISOString(),
      progress: 0,
      completed: false,
      startedAt: new Date().toISOString(),
      duration: challenge.duration,
      xpReward: challenge.xpReward,
      currentDay: 1
    };

    res.json({
      success: true,
      message: `Joined "${challenge.name}" challenge!`,
      challenge: joinedChallenge
    });
  } catch (error) {
    console.error('Error joining challenge:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update challenge progress
router.post('/:userChallengeId/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userChallengeId = req.params.userChallengeId;
    const { progress, completed } = req.body;

    // For now, simulate success - would update database
    // In a real implementation, this would update user_challenges and challenge_progress_log tables

    res.json({
      success: true,
      message: 'Progress updated',
      progress
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user's daily check-ins
router.get('/user/daily-checkins', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const date = req.query.date ? new Date(req.query.date) : new Date();

    const checkins = await ChallengeProgress.getDailyCheckins(userId, date);

    res.json({
      success: true,
      data: checkins,
      date: date.toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('Error fetching daily check-ins:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily check-ins'
    });
  }
});

module.exports = router;
