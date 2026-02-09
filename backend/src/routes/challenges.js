const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const UserChallenge = require('../models/UserChallenge');
const { authenticateToken } = require('../middleware/auth');

// Get all challenges (built-in challenges)
router.get('/built-in', async (req, res) => {
  try {
    const challenges = await Challenge.find({ 'metadata.isBuiltIn': true });
    res.json({
      success: true,
      data: challenges
    });
  } catch (error) {
    console.error('Get built-in challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get user's active challenges
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

    const challenges = userChallenges.map(uc => ({
      id: uc._id,
      challengeId: uc.challengeId._id,
      name: uc.challengeId.name,
      description: uc.challengeId.description,
      type: uc.challengeId.type,
      category: uc.challengeId.category,
      difficulty: uc.challengeId.difficulty,
      duration: uc.challengeId.settings?.duration?.value || uc.challengeId.duration,
      progress: uc.progress || 0,
      joinedAt: uc.joinedAt,
      status: uc.status,
      rules: uc.challengeId.rules || [],
      metadata: uc.challengeId.metadata || {},
      icon: uc.challengeId.metadata?.bannerImage || '🎯',
      participants: uc.challengeId.participants || 0
    }));

    res.json({
      success: true,
      data: challenges
    });
  } catch (error) {
    console.error('Get user challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all challenges
router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find({});
    res.json({
      success: true,
      challenges
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
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name and description are required'
      });
    }

    const challenge = new Challenge({
      name,
      description,
      createdBy: req.user._id,
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
    const challenge = await Challenge.findById(req.params.id);
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
      challengeId: challenge._id
    });

    if (existingJoin) {
      return res.status(400).json({
        success: false,
        message: 'Already joined this challenge'
      });
    }

    const userChallenge = new UserChallenge({
      userId: user._id,
      challengeId: challenge._id,
      joinedAt: new Date(),
      progress: 0,
      status: 'active'
    });

    await userChallenge.save();

    res.json({
      success: true,
      message: 'Successfully joined challenge',
      userChallenge: {
        id: userChallenge._id,
        challengeId: challenge._id,
        joinedAt: userChallenge.joinedAt,
        progress: userChallenge.progress,
        status: userChallenge.status
      }
    });
  } catch (error) {
    console.error('Join challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
