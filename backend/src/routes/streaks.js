// const express = require('express');
// const router = express.Router();
// const { authenticateToken } = require('../middleware/auth');
// const Streak = require('../models/Streak');

// // @route   GET /api/streaks/current
// // @desc    Get current streak
// // @access  Private
// router.get('/current', authenticateToken, async (req, res) => {
//   try {
//     console.log('📊 Fetching streak for user:', req.user.email);
    
//     // Find or create streak
//     let streak = await Streak.findOne({ userId: req.user._id });
    
//     if (!streak) {
//       console.log('🆕 Creating new streak for user:', req.user.email);
//       streak = new Streak({
//         userId: req.user._id,
//         currentStreak: 0,
//         longestStreak: 0,
//         freezeTokens: { available: 3, used: 0, history: [] }
//       });
//       await streak.save();
//     }

//     // Get today's verification status
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const todayVerification = streak.history?.find(entry => {
//       const entryDate = new Date(entry.date);
//       entryDate.setHours(0, 0, 0, 0);
//       return entryDate.getTime() === today.getTime();
//     });

//     const response = {
//       success: true,
//       streak: {
//         current: streak.currentStreak || 0,
//         longest: streak.longestStreak || 0,
//         totalDays: streak.totalVerifications || 0,
//         totalOutdoorTime: streak.totalOutdoorTime || 0,
//         todayVerified: !!todayVerification,
//         lastVerification: streak.lastVerificationDate || null,
//         status: streak.status || 'active',
//         verificationRate: streak.verificationRate || 0,
//         averageDuration: streak.averageDuration || 0,
//         freezeTokens: streak.freezeTokens?.available || 0,
//         isAtRisk: streak.isAtRisk || false,
//         streakStartDate: streak.streakStartDate || null,
//         milestones: streak.milestones || [],
//         activeChallenges: streak.activeChallenges?.length || 0,
//         id: streak._id
//       }
//     };

//     console.log('✅ Streak data sent for user:', req.user.email);
//     res.json(response);

//   } catch (error) {
//     console.error('❌ Error in /current:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// });

// // @route   POST /api/streaks/verify
// // @desc    Verify today's activity
// // @access  Private
// router.post('/verify', authenticateToken, async (req, res) => {
//   try {
//     console.log('📝 Verifying streak for user:', req.user.email);
    
//     const { method, duration = 30, activityType = 'walk', notes } = req.body;
    
//     let streak = await Streak.findOne({ userId: req.user._id });
    
//     if (!streak) {
//       streak = new Streak({ userId: req.user._id });
//     }

//     // Add verification to history
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     // Check if already verified today
//     const alreadyVerified = streak.history?.some(entry => {
//       const entryDate = new Date(entry.date);
//       entryDate.setHours(0, 0, 0, 0);
//       return entryDate.getTime() === today.getTime();
//     });

//     if (alreadyVerified) {
//       return res.status(400).json({
//         success: false,
//         message: 'Already verified today'
//       });
//     }

//     // Create verification entry
//     const verificationEntry = {
//       date: today,
//       verified: true,
//       verificationMethod: method,
//       duration,
//       activityType,
//       notes,
//       verifiedAt: new Date()
//     };

//     // Add to history
//     if (!streak.history) streak.history = [];
//     streak.history.push(verificationEntry);
    
//     // Update streak count
//     streak.currentStreak = (streak.currentStreak || 0) + 1;
//     streak.longestStreak = Math.max(streak.longestStreak || 0, streak.currentStreak);
//     streak.lastVerificationDate = new Date();
//     streak.totalVerifications = (streak.totalVerifications || 0) + 1;
//     streak.totalOutdoorTime = (streak.totalOutdoorTime || 0) + duration;
//     streak.status = 'active';
    
//     // Update average duration
//     const total = streak.totalOutdoorTime;
//     const count = streak.totalVerifications;
//     streak.averageDuration = Math.round(total / count);
    
//     await streak.save();

//     console.log('✅ Streak verified for user:', req.user.email, 'New streak:', streak.currentStreak);

//     res.json({
//       success: true,
//       message: 'Streak verified successfully! 🌱',
//       streak: {
//         current: streak.currentStreak,
//         longest: streak.longestStreak,
//         todayVerified: true
//       }
//     });

//   } catch (error) {
//     console.error('❌ Error in /verify:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// });

// // @route   POST /api/streaks/freeze
// // @desc    Use freeze token
// // @access  Private
// router.post('/freeze', authenticateToken, async (req, res) => {
//   try {
//     console.log('❄️ Using freeze token for user:', req.user.email);
    
//     const { reason } = req.body;
    
//     let streak = await Streak.findOne({ userId: req.user._id });
    
//     if (!streak) {
//       return res.status(404).json({
//         success: false,
//         message: 'No streak found'
//       });
//     }

//     // Check if user has freeze tokens
//     if (!streak.freezeTokens || streak.freezeTokens.available <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'No freeze tokens available'
//       });
//     }

//     // Use freeze token
//     streak.freezeTokens.available -= 1;
//     streak.freezeTokens.used = (streak.freezeTokens.used || 0) + 1;
    
//     if (!streak.freezeTokens.history) streak.freezeTokens.history = [];
//     streak.freezeTokens.history.push({
//       date: new Date(),
//       reason: reason || 'No reason provided'
//     });

//     await streak.save();

//     res.json({
//       success: true,
//       message: 'Freeze token used successfully ❄️',
//       remainingTokens: streak.freezeTokens.available
//     });

//   } catch (error) {
//     console.error('❌ Error in /freeze:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// });

// // @route   GET /api/streaks/history
// // @desc    Get streak history
// // @access  Private
// router.get('/history', authenticateToken, async (req, res) => {
//   try {
//     console.log('📜 Fetching history for user:', req.user.email);
    
//     const { limit = 30, offset = 0 } = req.query;
    
//     const streak = await Streak.findOne({ userId: req.user._id });
    
//     if (!streak || !streak.history) {
//       return res.json({
//         success: true,
//         history: [],
//         total: 0,
//         hasMore: false
//       });
//     }

//     const history = streak.history
//       .sort((a, b) => new Date(b.date) - new Date(a.date))
//       .slice(offset, offset + parseInt(limit))
//       .map(entry => ({
//         date: entry.date,
//         verified: entry.verified,
//         method: entry.verificationMethod,
//         duration: entry.duration,
//         activity: entry.activityType,
//         notes: entry.notes
//       }));

//     res.json({
//       success: true,
//       history,
//       total: streak.history.length,
//       hasMore: offset + parseInt(limit) < streak.history.length
//     });

//   } catch (error) {
//     console.error('❌ Error in /history:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// });

// // @route   GET /api/streaks/stats
// // @desc    Get streak statistics
// // @access  Private
// router.get('/stats', authenticateToken, async (req, res) => {
//   try {
//     console.log('📊 Fetching stats for user:', req.user.email);
    
//     const streak = await Streak.findOne({ userId: req.user._id });
    
//     if (!streak) {
//       return res.json({
//         success: true,
//         stats: {
//           currentStreak: 0,
//           longestStreak: 0,
//           totalDays: 0,
//           totalOutdoorTime: 0,
//           averageDuration: 0,
//           verificationRate: 0,
//           todayVerified: false,
//           freezeTokens: 3,
//           milestones: [],
//           monthlyStats: []
//         }
//       });
//     }

//     // Calculate verification rate (last 30 days)
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
//     const recentHistory = streak.history?.filter(h => 
//       new Date(h.date) >= thirtyDaysAgo
//     ) || [];
    
//     const verifiedCount = recentHistory.filter(h => h.verified).length;
//     const verificationRate = recentHistory.length > 0 
//       ? Math.round((verifiedCount / recentHistory.length) * 100) 
//       : 0;

//     // Get today's verification status
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const todayVerified = streak.history?.some(entry => {
//       const entryDate = new Date(entry.date);
//       entryDate.setHours(0, 0, 0, 0);
//       return entryDate.getTime() === today.getTime() && entry.verified;
//     }) || false;

//     res.json({
//       success: true,
//       stats: {
//         currentStreak: streak.currentStreak || 0,
//         longestStreak: streak.longestStreak || 0,
//         totalDays: streak.totalVerifications || 0,
//         totalOutdoorTime: streak.totalOutdoorTime || 0,
//         averageDuration: streak.averageDuration || 0,
//         verificationRate,
//         todayVerified,
//         freezeTokens: streak.freezeTokens?.available || 0,
//         milestones: streak.milestones || [],
//         monthlyStats: streak.monthlyStats || []
//       }
//     });

//   } catch (error) {
//     console.error('❌ Error in /stats:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// });

// module.exports = router;

// /Users/apple/Documents/touchgrass/backend/src/routes/streaks.js

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Streak = require('../models/Streak');

// @route   GET /api/streaks/current
// @desc    Get current streak
// @access  Private
router.get('/current', authenticateToken, async (req, res) => {
  try {
    console.log('📊 Fetching streak for user:', req.user.email);
    
    // Find or create streak
    let streak = await Streak.findOne({ userId: req.user._id });
    
    if (!streak) {
      console.log('🆕 Creating new streak for user:', req.user.email);
      streak = new Streak({
        userId: req.user._id,
        currentStreak: 0,
        longestStreak: 0,
        freezeTokens: { available: 3, used: 0, history: [] }
      });
      await streak.save();
    }

    // Check if user can verify (23-hour cooldown)
    const { canVerify, hoursRemaining } = streak.canVerify();

    // Get today's verification status
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayVerification = streak.history?.find(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });

    // Get last verification date with time
    const lastVerification = streak.lastVerificationDate;

    const response = {
      success: true,
      streak: {
        current: streak.currentStreak || 0,
        longest: streak.longestStreak || 0,
        totalDays: streak.totalVerifications || 0,
        totalOutdoorTime: streak.totalOutdoorTime || 0,
        todayVerified: !!todayVerification,
        lastVerification: lastVerification,
        lastVerificationDate: lastVerification ? lastVerification.toISOString() : null,
        status: streak.status || 'active',
        verificationRate: streak.verificationRate || 0,
        averageDuration: streak.averageDuration || 0,
        freezeTokens: streak.freezeTokens?.available || 0,
        isAtRisk: streak.isAtRisk || false,
        streakStartDate: streak.streakStartDate || null,
        milestones: streak.milestones || [],
        activeChallenges: streak.activeChallenges?.length || 0,
        id: streak._id,
        canVerify: canVerify,
        hoursRemaining: hoursRemaining,
        nextVerificationTime: lastVerification ? 
          new Date(lastVerification.getTime() + (23 * 60 * 60 * 1000)) : null
      }
    };

    console.log('✅ Streak data sent for user:', req.user.email, 'Current streak:', streak.currentStreak);
    res.json(response);

  } catch (error) {
    console.error('❌ Error in /current:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/streaks/verify
// @desc    Verify today's activity
// @access  Private
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    // Validate that user is authenticated
    if (!req.user || !req.userId) {
      console.error('❌ User not authenticated properly');
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    console.log('📝 Verifying streak for user:', req.user.email);
    console.log('📝 User ID:', req.userId);
    console.log('📦 Verification data:', req.body);
    
    const { method, duration = 0, activity, shameMessage, caption, location, mediaUrl, force } = req.body;
    
    // Validate method
    if (!method || !['photo', 'video', 'shame', 'freeze'].includes(method)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification method. Must be one of: photo, video, shame, freeze'
      });
    }
    
    // Check if already verified today (skip if force=true for testing)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    
    // First, find existing streak to check if already verified today
    let streak = await Streak.findOne({ userId: req.user._id });
    
    if (streak) {
      // Check if already verified today
      const alreadyVerified = streak.history?.some(entry => {
        const entryDate = new Date(entry.date);
        if (isNaN(entryDate.getTime())) {
          return false;
        }
        entryDate.setHours(0, 0, 0, 0);
        const entryDateUTC = Date.UTC(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());
        return entryDateUTC === todayUTC;
      });

      if (alreadyVerified && !force) {
        return res.status(400).json({
          success: false,
          message: 'Already verified today'
        });
      }

      // Check 23-hour cooldown (skip if force=true for testing)
      if (streak.lastVerificationDate && !force) {
        const now = new Date();
        let lastVerif;
        
        if (typeof streak.lastVerificationDate === 'string') {
          lastVerif = new Date(streak.lastVerificationDate);
        } else {
          lastVerif = new Date(streak.lastVerificationDate);
        }
        
        if (!isNaN(lastVerif.getTime())) {
          const hoursSinceLastVerif = (now - lastVerif) / (1000 * 60 * 60);
          
          if (hoursSinceLastVerif < 23) {
            const hoursRemaining = Math.ceil(23 - hoursSinceLastVerif);
            return res.status(400).json({
              success: false,
              message: `Please wait ${hoursRemaining} hours before verifying again`,
              hoursRemaining
            });
          }
        }
      }
    }

    // Calculate streak values - NOTE: Do NOT store full mediaUrl in streak (could be huge base64 data)
    // Only store metadata. The media should be uploaded separately to cloud storage.
    const verificationEntry = {
      date: today,
      verified: true,
      verificationMethod: method,
      duration: duration || 0,
      activityType: activity || 'outdoor',
      caption: caption || '',
      location: location || '',
      shameMessage: shameMessage || '',
      // Don't store full mediaUrl in streak - it's too large (MongoDB 16MB limit)
      // Store just a reference or null if it's base64 data
      mediaUrl: mediaUrl && !mediaUrl.startsWith('data:') ? mediaUrl : '',
      verifiedAt: new Date()
    };

    let newCurrentStreak = 1;
    let newStreakStartDate = today;
    
    if (streak && streak.lastVerificationDate) {
      const lastVerificationDay = new Date(streak.lastVerificationDate);
      if (!isNaN(lastVerificationDay.getTime())) {
        lastVerificationDay.setHours(0, 0, 0, 0);
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayUTC = Date.UTC(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
        const lastVerificationDayUTC = Date.UTC(lastVerificationDay.getFullYear(), lastVerificationDay.getMonth(), lastVerificationDay.getDate());
        
        if (lastVerificationDayUTC === yesterdayUTC) {
          newCurrentStreak = (streak.currentStreak || 0) + 1;
        } else if (lastVerificationDayUTC < yesterdayUTC) {
          newCurrentStreak = 1;
        } else {
          // Same day - use existing streak
          newCurrentStreak = streak.currentStreak || 1;
          newStreakStartDate = streak.streakStartDate || today;
        }
      }
    }

    const newLongestStreak = streak ? Math.max(streak.longestStreak || 0, newCurrentStreak) : 1;
    const newTotalVerifications = (streak?.totalVerifications || 0) + 1;
    const newTotalOutdoorTime = (streak?.totalOutdoorTime || 0) + (duration || 0);
    const newAverageDuration = newTotalVerifications > 0 ? Math.round(newTotalOutdoorTime / newTotalVerifications) : 0;

    // Use findOneAndUpdate with upsert for atomic operation
    const updateResult = await Streak.findOneAndUpdate(
      { userId: req.user._id },
      {
        $push: {
          history: verificationEntry
        },
        $set: {
          currentStreak: newCurrentStreak,
          longestStreak: newLongestStreak,
          lastVerificationDate: new Date(),
          streakStartDate: newStreakStartDate,
          totalVerifications: newTotalVerifications,
          totalOutdoorTime: newTotalOutdoorTime,
          averageDuration: newAverageDuration,
          status: 'active'
        },
        $setOnInsert: {
          freezeTokens: { available: 3, used: 0, history: [] }
        }
      },
      {
        upsert: true,
        new: true,
        runValidators: true
      }
    );

    console.log('✅ Streak verified for user:', req.user.email, 'New streak:', newCurrentStreak);

    res.json({
      success: true,
      message: 'Streak verified successfully! 🌱',
      streak: {
        current: newCurrentStreak,
        longest: newLongestStreak,
        todayVerified: true,
        lastVerification: new Date()
      }
    });

  } catch (error) {
    console.error('❌ Error in /verify:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error name:', error.name);
    
    // Check for specific error types
    if (error.name === 'ValidationError') {
      console.error('❌ Mongoose validation error:', error.errors);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }
    
    if (error.code === 11000) {
      console.error('❌ Duplicate key error:', error.keyPattern);
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry detected'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/streaks/verify
// @desc    Check if user can verify today (alias for /can-verify)
// @access  Private
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const streak = await Streak.findOne({ userId });
    
    if (!streak) {
      return res.json({ 
        canVerify: true, 
        hoursRemaining: 0,
        lastVerification: null,
        nextVerificationTime: null
      });
    }

    const now = new Date();
    const lastVerification = streak.lastVerificationDate ? new Date(streak.lastVerificationDate) : null;
    const lastVerificationDate = lastVerification ? new Date(lastVerification.toDateString()) : null;
    const today = new Date(now.toDateString());
    
    // Check if already verified today
    if (lastVerificationDate && lastVerificationDate.getTime() === today.getTime()) {
      const nextVerificationTime = new Date(today);
      nextVerificationTime.setDate(nextVerificationTime.getDate() + 1);
      nextVerificationTime.setHours(0, 0, 0, 0);
      
      const hoursRemaining = Math.max(0, (nextVerificationTime - now) / (1000 * 60 * 60));
      
      return res.json({
        canVerify: false,
        hoursRemaining: Math.round(hoursRemaining * 10) / 10,
        lastVerification: streak.lastVerificationDate,
        nextVerificationTime: nextVerificationTime.toISOString()
      });
    }

    // Check 23-hour cooldown
    if (streak.lastVerificationDate) {
      const { canVerify, hoursRemaining } = streak.canVerify();
      
      const nextVerificationTime = new Date(streak.lastVerificationDate.getTime() + (23 * 60 * 60 * 1000));
      
      return res.json({
        canVerify,
        hoursRemaining,
        lastVerification: streak.lastVerificationDate,
        nextVerificationTime: canVerify ? null : nextVerificationTime.toISOString()
      });
    }

    res.json({
      canVerify: true,
      hoursRemaining: 0,
      lastVerification: streak.lastVerificationDate,
      nextVerificationTime: null
    });
  } catch (error) {
    console.error('Error checking verify status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/streaks/can-verify
// @desc    Check if user can verify (23-hour cooldown)
// @access  Private
router.get('/can-verify', authenticateToken, async (req, res) => {
  try {
    const streak = await Streak.findOne({ userId: req.user._id });
    
    if (!streak || !streak.lastVerificationDate) {
      return res.json({
        success: true,
        canVerify: true,
        hoursRemaining: 0
      });
    }

    const { canVerify, hoursRemaining } = streak.canVerify();
    
    res.json({
      success: true,
      canVerify,
      hoursRemaining,
      lastVerification: streak.lastVerificationDate,
      nextVerificationTime: canVerify ? null : 
        new Date(streak.lastVerificationDate.getTime() + (23 * 60 * 60 * 1000))
    });

  } catch (error) {
    console.error('❌ Error checking verify status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/streaks/freeze
// @desc    Use freeze token
// @access  Private
router.post('/freeze', authenticateToken, async (req, res) => {
  try {
    console.log('❄️ Using freeze token for user:', req.user.email);
    
    const { reason } = req.body;
    
    let streak = await Streak.findOne({ userId: req.user._id });
    
    if (!streak) {
      return res.status(404).json({
        success: false,
        message: 'No streak found'
      });
    }

    // Check if user has freeze tokens
    if (!streak.freezeTokens || streak.freezeTokens.available <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No freeze tokens available'
      });
    }

    await streak.useFreezeToken(reason);

    res.json({
      success: true,
      message: 'Freeze token used successfully ❄️',
      remainingTokens: streak.freezeTokens.available
    });

  } catch (error) {
    console.error('❌ Error in /freeze:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/streaks/history
// @desc    Get streak history
// @access  Private
router.get('/history', authenticateToken, async (req, res) => {
  try {
    console.log('📜 Fetching history for user:', req.user.email);
    
    const { limit = 30, offset = 0 } = req.query;
    
    const streak = await Streak.findOne({ userId: req.user._id });
    
    if (!streak || !streak.history) {
      return res.json({
        success: true,
        history: [],
        total: 0,
        hasMore: false
      });
    }

    const history = streak.history
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit))
      .map(entry => ({
        date: entry.date,
        verified: entry.verified,
        method: entry.verificationMethod,
        duration: entry.duration,
        activity: entry.activityType,
        caption: entry.caption,
        location: entry.location,
        shameMessage: entry.shameMessage,
        mediaUrl: entry.mediaUrl,
        verifiedAt: entry.verifiedAt
      }));

    res.json({
      success: true,
      history,
      total: streak.history.length,
      hasMore: parseInt(offset) + parseInt(limit) < streak.history.length
    });

  } catch (error) {
    console.error('❌ Error in /history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/streaks/stats
// @desc    Get streak statistics
// @access  Private
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    console.log('📊 Fetching stats for user:', req.user.email);
    
    const streak = await Streak.findOne({ userId: req.user._id });
    
    if (!streak) {
      return res.json({
        success: true,
        stats: {
          currentStreak: 0,
          longestStreak: 0,
          totalDays: 0,
          totalOutdoorTime: 0,
          averageDuration: 0,
          verificationRate: 0,
          todayVerified: false,
          freezeTokens: 3,
          milestones: [],
          monthlyStats: []
        }
      });
    }

    res.json({
      success: true,
      stats: streak.getStats()
    });

  } catch (error) {
    console.error('❌ Error in /stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/streaks/calendar/:year/:month
// @desc    Get calendar data for a specific month
// @access  Private
router.get('/calendar/:year/:month', authenticateToken, async (req, res) => {
  try {
    const { year, month } = req.params;
    
    const streak = await Streak.findOne({ userId: req.user._id });
    
    if (!streak) {
      return res.json({
        success: true,
        calendar: [],
        stats: {
          verifiedDays: 0,
          totalDays: 0,
          totalDuration: 0,
          shameDays: 0
        }
      });
    }

    const calendarData = streak.getCalendarData(parseInt(year), parseInt(month));
    
    res.json({
      success: true,
      ...calendarData
    });

  } catch (error) {
    console.error('❌ Error in /calendar:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;