const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const Streak = require('../models/Streak');
const User = require('../models/user');
const Achievement = require('../models/Achievement');
const Notification = require('../models/Notification');

// @route   GET /api/streaks/current
// @desc    Get current streak
// @access  Private
router.get('/current', auth, async (req, res) => {
  try {
    let streak = await Streak.findOne({ 
      userId: req.user.id, 
      status: 'active' 
    });

    if (!streak) {
      // Check if there's a broken streak
      streak = await Streak.findOne({ 
        userId: req.user.id, 
        status: 'broken' 
      }).sort({ lastUpdated: -1 });

      if (!streak) {
        // Create new streak if none exists
        streak = new Streak({
          userId: req.user.id,
          currentStreak: 0,
          status: 'active'
        });
        await streak.save();
      }
    }

    // Check if streak is broken
    if (streak.status === 'active' && streak.isBroken()) {
      await streak.breakStreak('missed_verification');
      
      // Send notification
      await Notification.createStreakBroken(
        req.user.id,
        streak
      );

      return res.json({
        success: true,
        streak: {
          current: 0,
          longest: streak.longestStreak,
          status: 'broken',
          brokenAt: streak.lastUpdated,
          canRestore: true
        },
        message: 'Streak broken! You can restore it for $4.99'
      });
    }

    // Calculate time until next checkpoint
    const now = new Date();
    const nextCheckpoint = new Date(streak.nextCheckpoint);
    const hoursRemaining = Math.max(0, (nextCheckpoint - now) / (1000 * 60 * 60));

    res.json({
      success: true,
      streak: {
        id: streak.id,
        current: streak.currentStreak,
        longest: streak.longestStreak,
        status: streak.status,
        nextCheckpoint: streak.nextCheckpoint,
        hoursRemaining: Math.round(hoursRemaining),
        verificationRate: streak.verificationRate,
        averageDuration: streak.averageDuration,
        freezeTokensUsed: streak.freezeTokensUsed,
        skipDaysUsed: streak.skipDaysUsed,
        history: streak.history.slice(-7), // Last 7 days
        goal: streak.goal,
        isPublic: streak.isPublic
      }
    });

  } catch (err) {
    console.error('Get current streak error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   POST /api/streaks/verify
// @desc    Verify streak for today
// @access  Private
router.post('/verify', auth, upload.single('photo'), [
  check('verificationMethod', 'Verification method is required')
    .isIn(['photo', 'location', 'manual', 'shame']),
  check('duration', 'Duration must be between 1 and 1440 minutes')
    .optional().isInt({ min: 1, max: 1440 }),
  check('notes', 'Notes must be less than 500 characters')
    .optional().isLength({ max: 500 }),
  check('shameMessage', 'Shame message must be less than 200 characters')
    .optional().isLength({ max: 200 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      verificationMethod,
      duration = 15,
      notes,
      shameMessage,
      isPublicShame = false,
      mood,
      activities = [],
      tags = [],
      location,
      weather
    } = req.body;

    // Get or create streak
    let streak = await Streak.findOne({ 
      userId: req.user.id, 
      status: 'active' 
    });

    if (!streak) {
      streak = new Streak({
        userId: req.user.id,
        currentStreak: 0
      });
    }

    // Prepare verification data
    const verificationData = {
      verificationMethod,
      duration: parseInt(duration),
      notes,
      shameMessage,
      isPublicShame: verificationMethod === 'shame' ? isPublicShame : false,
      mood,
      activities: Array.isArray(activities) ? activities : [activities],
      tags: Array.isArray(tags) ? tags : [tags],
      challengeId: req.body.challengeId
    };

    // Add photo if provided
    if (req.file) {
      verificationData.photoUrl = req.file.path;
    }

    // Add location if provided
    if (location) {
      try {
        verificationData.location = JSON.parse(location);
      } catch (err) {
        verificationData.location = { name: location };
      }
    }

    // Add weather if provided
    if (weather) {
      try {
        verificationData.weather = JSON.parse(weather);
      } catch (err) {
        verificationData.weather = { condition: weather };
      }
    }

    // Verify day
    await streak.verifyDay(verificationData);

    // Update user stats
    const user = await User.findById(req.user.id);
    user.stats.currentStreak = streak.currentStreak;
    user.stats.longestStreak = Math.max(user.stats.longestStreak, streak.currentStreak);
    user.stats.totalDays += 1;
    user.stats.totalOutdoorTime += parseInt(duration);
    user.stats.verificationCount += 1;
    
    if (verificationMethod === 'shame') {
      user.stats.shameCount += 1;
    }
    
    // Update consistency score
    if (user.stats.totalDays > 0) {
      user.stats.consistencyScore = Math.min(100, 
        Math.round((streak.longestStreak / user.stats.totalDays) * 100)
      );
    }
    
    await user.save();

    // Check for achievements
    if (streak.currentStreak > 0) {
      await streak.checkAchievements();
      
      // Check milestone achievements
      const milestones = [7, 30, 100, 365];
      if (milestones.includes(streak.currentStreak)) {
        await Notification.createStreakMilestone(
          req.user.id,
          streak,
          streak.currentStreak
        );
      }
    }

    // Send daily reminder for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(18, 0, 0, 0); // 6 PM reminder

    await Notification.create({
      user: req.user.id,
      type: 'streak_reminder',
      title: 'Streak Reminder',
      message: `Don't forget to touch grass today! Your ${streak.currentStreak}-day streak is on the line.`,
      data: {
        streakId: streak._id,
        url: '/verify',
        action: 'verify_today'
      },
      schedule: {
        sendAt: tomorrow
      },
      priority: 'high',
      channels: ['push', 'in_app']
    });

    const response = {
      success: true,
      message: verificationMethod === 'shame' 
        ? 'Shame accepted. Your streak continues, but at what cost? 😈'
        : 'Grass successfully touched! 🌱',
      streak: {
        current: streak.currentStreak,
        longest: streak.longestStreak,
        nextCheckpoint: streak.nextCheckpoint
      }
    };

    // Add shame-specific response
    if (verificationMethod === 'shame') {
      response.shame = {
        message: shameMessage,
        isPublic: isPublicShame,
        shameCount: user.stats.shameCount
      };
    }

    res.json(response);

  } catch (err) {
    console.error('Verify streak error:', err);
    
    if (err.message === 'Already verified today') {
      return res.status(400).json({
        error: 'ALREADY_VERIFIED',
        message: 'You have already verified today'
      });
    }

    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error during verification'
    });
  }
});

// @route   POST /api/streaks/freeze
// @desc    Use freeze token to skip day
// @access  Private
router.post('/freeze', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Check if user has freeze tokens
    const availableTokens = user.getFreezeTokens() - user.subscription.features.streakFreezeTokens;
    
    if (availableTokens <= 0) {
      return res.status(400).json({
        error: 'NO_FREEZE_TOKENS',
        message: 'No freeze tokens available. Upgrade your plan to get more.'
      });
    }

    let streak = await Streak.findOne({ 
      userId: req.user.id, 
      status: 'active' 
    });

    if (!streak) {
      return res.status(404).json({
        error: 'NO_ACTIVE_STREAK',
        message: 'No active streak found'
      });
    }

    // Use freeze token
    await streak.useFreezeToken();
    
    // Update user's freeze tokens
    user.subscription.features.streakFreezeTokens += 1;
    await user.save();

    res.json({
      success: true,
      message: 'Streak freeze applied! ❄️',
      streak: {
        current: streak.currentStreak,
        freezeTokensUsed: streak.freezeTokensUsed
      },
      remainingTokens: availableTokens - 1
    });

  } catch (err) {
    console.error('Freeze streak error:', err);
    
    if (err.message === 'No freeze tokens available') {
      return res.status(400).json({
        error: 'NO_FREEZE_TOKENS',
        message: err.message
      });
    }

    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   POST /api/streaks/restore
// @desc    Restore broken streak (requires payment)
// @access  Private
router.post('/restore', auth, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Check if user has a broken streak
    const streak = await Streak.findOne({ 
      userId: req.user.id,
      status: 'broken' 
    }).sort({ lastUpdated: -1 });

    if (!streak) {
      return res.status(404).json({
        error: 'NO_BROKEN_STREAK',
        message: 'No broken streak found'
      });
    }

    // In production, verify payment with Stripe
    // const payment = await stripe.paymentIntents.retrieve(paymentIntentId);
    // if (payment.status !== 'succeeded') {
    //   throw new Error('Payment failed');
    // }

    // Restore streak
    streak.status = 'active';
    streak.currentStreak = 1; // Start over at 1
    streak.lastUpdated = new Date();
    
    // Update next checkpoint
    const nextCheckpoint = new Date();
    nextCheckpoint.setDate(nextCheckpoint.getDate() + 1);
    nextCheckpoint.setHours(0, 0, 0, 0);
    streak.nextCheckpoint = nextCheckpoint;
    
    await streak.save();

    // Update user stats
    const user = await User.findById(req.user.id);
    user.stats.currentStreak = 1;
    await user.save();

    // Record payment (would be created in payment service)
    // await Payment.createStreakRestore(req.user.id, streak._id, 499); // $4.99

    res.json({
      success: true,
      message: 'Streak restored! 🔥',
      streak: {
        current: 1,
        status: 'active',
        nextCheckpoint: streak.nextCheckpoint
      }
    });

  } catch (err) {
    console.error('Restore streak error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   GET /api/streaks/history
// @desc    Get streak history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const { 
      limit = 30, 
      offset = 0,
      startDate,
      endDate,
      groupBy = 'day' // day, week, month
    } = req.query;

    const streak = await Streak.findOne({ userId: req.user.id });

    if (!streak) {
      return res.json({
        success: true,
        history: [],
        statistics: {}
      });
    }

    let history = streak.history || [];
    
    // Filter by date range
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      
      history = history.filter(day => {
        const dayDate = new Date(day.date);
        return dayDate >= start && dayDate <= end;
      });
    }

    // Sort by date
    history.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Group by time period if requested
    let groupedHistory = history;
    if (groupBy !== 'day') {
      groupedHistory = groupHistoryByPeriod(history, groupBy);
    }

    // Paginate
    const paginatedHistory = groupedHistory.slice(offset, offset + parseInt(limit));

    // Calculate statistics
    const statistics = {
      totalDays: history.length,
      verifiedDays: history.filter(day => day.verified).length,
      shameDays: history.filter(day => day.verificationMethod === 'shame').length,
      totalDuration: history.reduce((sum, day) => sum + (day.duration || 0), 0),
      averageDuration: history.length > 0 
        ? Math.round(history.reduce((sum, day) => sum + (day.duration || 0), 0) / history.length)
        : 0,
      verificationRate: history.length > 0
        ? Math.round((history.filter(day => day.verified).length / history.length) * 100)
        : 0,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak
    };

    res.json({
      success: true,
      history: paginatedHistory,
      statistics,
      pagination: {
        total: groupedHistory.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: offset + parseInt(limit) < groupedHistory.length
      }
    });

  } catch (err) {
    console.error('Get history error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   PUT /api/streaks/settings
// @desc    Update streak settings
// @access  Private
router.put('/settings', auth, [
  check('reminderTime', 'Reminder time must be in HH:MM format')
    .optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  check('autoFreeze', 'Auto freeze must be boolean')
    .optional().isBoolean(),
  check('strictMode', 'Strict mode must be boolean')
    .optional().isBoolean(),
  check('isPublic', 'Public setting must be boolean')
    .optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reminderTime, autoFreeze, strictMode, isPublic, goal } = req.body;

    let streak = await Streak.findOne({ userId: req.user.id });

    if (!streak) {
      streak = new Streak({ userId: req.user.id });
    }

    // Update settings
    if (reminderTime !== undefined) {
      streak.settings.reminderTime = reminderTime;
    }
    if (autoFreeze !== undefined) {
      streak.settings.autoFreeze = autoFreeze;
    }
    if (strictMode !== undefined) {
      streak.settings.strictMode = strictMode;
    }
    if (isPublic !== undefined) {
      streak.isPublic = isPublic;
    }
    if (goal !== undefined) {
      streak.goal = goal;
    }

    await streak.save();

    res.json({
      success: true,
      message: 'Streak settings updated',
      settings: streak.settings,
      isPublic: streak.isPublic,
      goal: streak.goal
    });

  } catch (err) {
    console.error('Update settings error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   GET /api/streaks/calendar/:year/:month
// @desc    Get streak calendar data
// @access  Private
router.get('/calendar/:year/:month', auth, async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month) - 1; // JS months are 0-indexed

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const streak = await Streak.findOne({ userId: req.user.id });

    if (!streak) {
      return res.json({
        success: true,
        calendar: generateEmptyCalendar(year, month),
        statistics: {}
      });
    }

    // Get days for this month
    const monthHistory = streak.history?.filter(day => {
      const dayDate = new Date(day.date);
      return dayDate >= startDate && dayDate <= endDate;
    }) || [];

    // Generate calendar data
    const calendar = generateCalendar(year, month, monthHistory);

    // Calculate month statistics
    const statistics = {
      totalDays: monthHistory.length,
      verifiedDays: monthHistory.filter(day => day.verified).length,
      totalDuration: monthHistory.reduce((sum, day) => sum + (day.duration || 0), 0),
      averageDuration: monthHistory.length > 0
        ? Math.round(monthHistory.reduce((sum, day) => sum + (day.duration || 0), 0) / monthHistory.length)
        : 0,
      bestDay: monthHistory.reduce((best, day) => 
        day.duration > best.duration ? day : best, 
        { duration: 0, date: null }
      )
    };

    res.json({
      success: true,
      calendar,
      statistics
    });

  } catch (err) {
    console.error('Get calendar error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   GET /api/streaks/share/:streakId?
// @desc    Get shareable streak data
// @access  Private or Public
router.get('/share/:streakId?', async (req, res) => {
  try {
    const streakId = req.params.streakId || req.query.streakId;
    let streak;

    if (streakId) {
      // Public access to shared streak
      streak = await Streak.findById(streakId).populate('userId', 'displayName username avatar');
      
      if (!streak || !streak.isPublic) {
        return res.status(404).json({
          error: 'STREAK_NOT_FOUND',
          message: 'Streak not found or not publicly shared'
        });
      }
    } else if (req.user) {
      // Private access to current user's streak
      streak = await Streak.findOne({ userId: req.user.id }).populate('userId', 'displayName username avatar');
    } else {
      return res.status(401).json({
        error: 'AUTH_REQUIRED',
        message: 'Authentication required'
      });
    }

    if (!streak) {
      return res.status(404).json({
        error: 'STREAK_NOT_FOUND',
        message: 'Streak not found'
      });
    }

    const shareData = {
      id: streak.id,
      user: {
        displayName: streak.userId.displayName,
        username: streak.userId.username,
        avatar: streak.userId.avatar
      },
      streak: {
        current: streak.currentStreak,
        longest: streak.longestStreak,
        totalDays: streak.history?.length || 0,
        verificationRate: streak.verificationRate,
        averageDuration: streak.averageDuration
      },
      history: streak.history?.slice(-30) || [], // Last 30 days
      createdAt: streak.createdAt,
      updatedAt: streak.updatedAt
    };

    res.json({
      success: true,
      data: shareData,
      shareUrl: `${process.env.FRONTEND_URL}/share/${streak.id}`,
      embedCode: generateEmbedCode(streak.id)
    });

  } catch (err) {
    console.error('Get share data error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// Helper function to group history by time period
function groupHistoryByPeriod(history, period) {
  const grouped = {};
  
  history.forEach(day => {
    const date = new Date(day.date);
    let key;
    
    switch (period) {
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        break;
      default:
        key = date.toISOString().split('T')[0];
    }
    
    if (!grouped[key]) {
      grouped[key] = {
        period: key,
        verifiedDays: 0,
        totalDays: 0,
        totalDuration: 0,
        shameDays: 0,
        days: []
      };
    }
    
    grouped[key].totalDays++;
    grouped[key].totalDuration += day.duration || 0;
    
    if (day.verified) {
      grouped[key].verifiedDays++;
    }
    
    if (day.verificationMethod === 'shame') {
      grouped[key].shameDays++;
    }
    
    grouped[key].days.push(day);
  });
  
  return Object.values(grouped).sort((a, b) => b.period.localeCompare(a.period));
}

// Helper function to generate calendar data
function generateCalendar(year, month, history) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  
  const calendar = [];
  let day = 1;
  
  // Create empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendar.push({ day: null, data: null });
  }
  
  // Create cells for each day of the month
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayData = history.find(h => {
      const historyDate = new Date(h.date);
      return historyDate.toISOString().split('T')[0] === dateStr;
    });
    
    calendar.push({
      day: d,
      date: dateStr,
      data: dayData ? {
        verified: dayData.verified,
        verificationMethod: dayData.verificationMethod,
        duration: dayData.duration,
        mood: dayData.mood,
        activities: dayData.activities
      } : null
    });
  }
  
  return calendar;
}

// Helper function to generate empty calendar
function generateEmptyCalendar(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  
  const calendar = [];
  
  for (let i = 0; i < firstDay; i++) {
    calendar.push({ day: null, data: null });
  }
  
  for (let d = 1; d <= daysInMonth; d++) {
    calendar.push({
      day: d,
      date: new Date(year, month, d).toISOString().split('T')[0],
      data: null
    });
  }
  
  return calendar;
}

// Helper function to generate embed code
function generateEmbedCode(streakId) {
  return `
<div class="touchgrass-embed" data-streak="${streakId}">
  <script async src="${process.env.FRONTEND_URL}/embed.js"></script>
</div>
  `.trim();
}

module.exports = router;