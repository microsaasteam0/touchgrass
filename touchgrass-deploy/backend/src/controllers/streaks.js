const Streak = require('../models/Streak');
const User = require('../models/user');
const Analytics = require('../models/Analytics');
const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;
const geolib = require('geolib');

// Real photo verification with validation
exports.verifyWithPhoto = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { 
      duration = 15, 
      activityType = 'walk', 
      notes = '',
      location,
      confidence = 85 
    } = req.body;

    const userId = req.userId;
    const photoFile = req.file;

    if (!photoFile) {
      return res.status(400).json({
        success: false,
        message: 'Photo is required for verification'
      });
    }

    // Validate photo
    const validationResult = await validatePhoto(photoFile);
    if (!validationResult.valid) {
      return res.status(400).json({
        success: false,
        message: validationResult.message
      });
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `touchgrass/verifications/${userId}`,
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto:good' }
          ],
          resource_type: 'image',
          public_id: `verification_${Date.now()}`
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(photoFile.buffer);
    });

    // Get or create streak
    let streak = await Streak.findOne({ userId, status: 'active' });
    
    if (!streak) {
      streak = new Streak({
        userId,
        startDate: new Date(),
        currentStreak: 0,
        history: []
      });
    }

    // Check if already verified today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayVerified = streak.history.some(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });

    if (todayVerified) {
      return res.status(400).json({
        success: false,
        message: 'Already verified today'
      });
    }

    // Create verification entry
    const verificationData = {
      verified: true,
      method: 'photo',
      duration: parseInt(duration),
      activityType,
      notes,
      photoUrl: uploadResult.secure_url,
      photoMetadata: {
        timestamp: new Date(),
        location: location ? JSON.parse(location) : null,
        deviceInfo: req.headers['user-agent'] || '',
        fileSize: photoFile.size,
        dimensions: uploadResult
      },
      confidenceScore: confidence
    };

    // Verify day
    await streak.verifyDay(verificationData);

    // Update user stats
    const user = await User.findById(userId);
    await user.updateStreakStats(true, parseInt(duration));

    // Update analytics
    await updateAnalytics(userId, {
      verifications: 1,
      photoVerifications: 1,
      totalDuration: parseInt(duration),
      sessions: [{
        startTime: new Date(Date.now() - (parseInt(duration) * 60000)),
        endTime: new Date(),
        duration: parseInt(duration),
        actions: 5, // Verification action count
        device: req.headers['user-agent'] || ''
      }]
    });

    // Check for achievements
    await checkAchievements(userId, streak.currentStreak);

    // Get updated stats
    const updatedStreak = await Streak.findOne({ userId });
    const updatedUser = await User.findById(userId);
    const rank = await updatedUser.getRank();

    res.json({
      success: true,
      message: 'Day successfully verified! 🌱',
      data: {
        streak: {
          current: streak.currentStreak,
          longest: streak.streakDurationDays,
          consistency: streak.getConsistency(),
          todayVerified: true
        },
        user: {
          stats: updatedUser.stats,
          rank,
          todayVerified: true
        },
        verification: {
          id: streak.history[streak.history.length - 1]._id,
          method: 'photo',
          timestamp: new Date(),
          photoUrl: uploadResult.secure_url
        }
      }
    });

  } catch (error) {
    console.error('Photo verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Verification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Location-based verification
exports.verifyWithLocation = async (req, res) => {
  try {
    const { latitude, longitude, accuracy, address, duration = 15 } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Location coordinates are required'
      });
    }

    // Validate location (check if outdoors)
    const isOutdoor = await validateLocation(latitude, longitude, accuracy);
    
    if (!isOutdoor) {
      return res.status(400).json({
        success: false,
        message: 'Location appears to be indoors. Go outside for verification!'
      });
    }

    const userId = req.userId;
    const streak = await Streak.findOne({ userId, status: 'active' });

    // Check if already verified today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayVerified = streak?.history.some(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });

    if (todayVerified) {
      return res.status(400).json({
        success: false,
        message: 'Already verified today'
      });
    }

    // Create verification data
    const verificationData = {
      verified: true,
      method: 'location',
      duration: parseInt(duration),
      locationData: {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
        accuracy: parseFloat(accuracy),
        timestamp: new Date(),
        address
      },
      confidenceScore: 90
    };

    await streak.verifyDay(verificationData);

    // Update user and analytics
    const user = await User.findById(userId);
    await user.updateStreakStats(true, parseInt(duration));
    await updateAnalytics(userId, {
      verifications: 1,
      totalDuration: parseInt(duration)
    });

    res.json({
      success: true,
      message: 'Location verified! Great job getting outside!',
      data: {
        streak: streak.currentStreak,
        location: {
          lat: latitude,
          lng: longitude,
          address
        }
      }
    });

  } catch (error) {
    console.error('Location verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Location verification failed'
    });
  }
};

// Shame verification
exports.acceptShame = async (req, res) => {
  try {
    const { shameMessage, isPublic = false } = req.body;
    const userId = req.userId;

    if (!shameMessage || shameMessage.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Shame message must be at least 10 characters'
      });
    }

    const streak = await Streak.findOne({ userId, status: 'active' });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already verified today
    const todayVerified = streak?.history.some(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });

    if (todayVerified) {
      return res.status(400).json({
        success: false,
        message: 'Already verified today'
      });
    }

    // Create shame verification
    const verificationData = {
      verified: false,
      method: 'shame',
      shameMessage,
      isPublicShame: isPublic,
      confidenceScore: 0
    };

    await streak.verifyDay(verificationData);

    // Update user stats (streak continues but marked as shame)
    const user = await User.findById(userId);
    await user.updateStreakStats(false, 0);

    // Update analytics
    await updateAnalytics(userId, {
      verifications: 1,
      shameVerifications: 1
    });

    // If public shame, post to shame wall
    if (isPublic) {
      await postToShameWall(userId, shameMessage);
    }

    // Get random roast
    const roasts = [
      "Even indoor plants get more sunlight than you today.",
      "Your chair must be forming a permanent impression by now.",
      "Vitamin D deficiency is calling. It's asking for you.",
      "The grass misses you. Actually, it doesn't know who you are.",
      "Another day closer to becoming a houseplant.",
      "Screen time > Sun time. Your phone needs a break too.",
      "Your outdoor shoes are gathering dust and disappointment."
    ];
    
    const roast = roasts[Math.floor(Math.random() * roasts.length)];

    res.json({
      success: true,
      message: 'Shame accepted. Your streak continues... for now.',
      data: {
        streak: streak.currentStreak,
        roast,
        isPublicShame: isPublic,
        shameMessage
      }
    });

  } catch (error) {
    console.error('Shame acceptance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept shame'
    });
  }
};

// Get current streak status
exports.getCurrentStreak = async (req, res) => {
  try {
    const userId = req.userId;
    
    const streak = await Streak.findOne({ userId });
    const user = await User.findById(userId);
    
    if (!streak) {
      return res.json({
        success: true,
        data: {
          hasStreak: false,
          todayVerified: false,
          canVerify: true,
          userStats: user.stats
        }
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayVerified = streak.todayVerified;
    const lastVerification = streak.history
      .filter(h => h.verified)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    
    const lastVerifiedDate = lastVerification ? new Date(lastVerification.date) : null;
    const daysSinceLast = lastVerifiedDate 
      ? Math.floor((today - new Date(lastVerifiedDate.setHours(0, 0, 0, 0))) / (1000 * 60 * 60 * 24))
      : null;

    // Check if streak is broken
    let streakStatus = 'active';
    let canVerify = true;
    
    if (lastVerifiedDate && daysSinceLast > 1) {
      streakStatus = 'broken';
      canVerify = true; // Can start new streak
    } else if (todayVerified) {
      canVerify = false; // Already verified today
    }

    // Calculate next milestone
    const milestones = [7, 30, 100, 365];
    const nextMilestone = milestones.find(m => m > streak.currentStreak) || null;
    const daysToNext = nextMilestone ? nextMilestone - streak.currentStreak : null;

    // Get rank
    const rank = await user.getRank();
    const percentile = await user.getPercentile();

    res.json({
      success: true,
      data: {
        hasStreak: true,
        streak: {
          current: streak.currentStreak,
          longest: streak.streakDurationDays,
          startDate: streak.startDate,
          status: streakStatus,
          consistency: streak.getConsistency(),
          totalVerifications: streak.totalVerifications,
          photoCount: streak.photoVerifications,
          shameCount: streak.shameVerifications,
          averageDuration: streak.averageDuration,
          milestones: streak.milestones
        },
        todayVerified,
        canVerify,
        lastVerification: lastVerification,
        nextMilestone: nextMilestone ? {
          days: nextMilestone,
          daysToGo: daysToNext,
          reward: nextMilestone * 10 // Points
        } : null,
        userStats: {
          ...user.stats,
          rank,
          percentile
        },
        timeLeft: getTimeLeftToday()
      }
    });

  } catch (error) {
    console.error('Get streak error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch streak'
    });
  }
};

// Get streak history
exports.getStreakHistory = async (req, res) => {
  try {
    const { year, month } = req.query;
    const userId = req.userId;
    
    const streak = await Streak.findOne({ userId });
    
    if (!streak) {
      return res.json({
        success: true,
        data: {
          history: [],
          stats: {}
        }
      });
    }

    // Filter history by year/month if specified
    let filteredHistory = streak.history;
    
    if (year) {
      filteredHistory = filteredHistory.filter(entry => {
        const entryYear = new Date(entry.date).getFullYear();
        return entryYear === parseInt(year);
      });
    }
    
    if (month) {
      filteredHistory = filteredHistory.filter(entry => {
        const entryMonth = new Date(entry.date).getMonth() + 1;
        return entryMonth === parseInt(month);
      });
    }

    // Group by month for calendar view
    const monthlyStats = {};
    filteredHistory.forEach(entry => {
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {
          verified: 0,
          total: 0,
          totalDuration: 0,
          photoCount: 0,
          shameCount: 0
        };
      }
      
      monthlyStats[monthKey].total += 1;
      if (entry.verified) {
        monthlyStats[monthKey].verified += 1;
        monthlyStats[monthKey].totalDuration += entry.duration || 0;
        if (entry.verificationMethod === 'photo') {
          monthlyStats[monthKey].photoCount += 1;
        } else if (entry.verificationMethod === 'shame') {
          monthlyStats[monthKey].shameCount += 1;
        }
      }
    });

    // Calculate daily consistency for the last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const recentHistory = filteredHistory
      .filter(entry => new Date(entry.date) >= ninetyDaysAgo)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const dailyConsistency = [];
    for (let i = 0; i < 90; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const entry = recentHistory.find(e => {
        const entryDate = new Date(e.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === date.getTime();
      });
      
      dailyConsistency.unshift({
        date: date.toISOString().split('T')[0],
        verified: entry ? entry.verified : false,
        method: entry ? entry.verificationMethod : null,
        duration: entry ? entry.duration : 0
      });
    }

    res.json({
      success: true,
      data: {
        history: filteredHistory.map(entry => ({
          date: entry.date,
          verified: entry.verified,
          method: entry.verificationMethod,
          duration: entry.duration,
          activityType: entry.activityType,
          notes: entry.notes,
          photoUrl: entry.photoUrl,
          shameMessage: entry.shameMessage,
          isPublicShame: entry.isPublicShame
        })),
        monthlyStats,
        dailyConsistency,
        summary: {
          totalDays: filteredHistory.length,
          verifiedDays: filteredHistory.filter(e => e.verified).length,
          currentStreak: streak.currentStreak,
          longestStreak: streak.streakDurationDays,
          consistency: streak.getConsistency(),
          averageDuration: streak.averageDuration
        }
      }
    });

  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch streak history'
    });
  }
};

// Helper functions
async function validatePhoto(file) {
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, message: 'Photo must be less than 10MB' };
  }

  // Check MIME type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    return { valid: false, message: 'Invalid image format. Use JPEG, PNG, or WebP' };
  }

  // TODO: Add ML validation for outdoor photos
  // Check if photo contains outdoor elements
  
  return { valid: true, message: 'Photo validated successfully' };
}

async function validateLocation(lat, lng, accuracy) {
  // Check if location is outdoors
  // This would integrate with weather APIs or geospatial databases
  
  // For now, basic validation
  const isIndoor = accuracy > 100; // High accuracy = likely indoors
  return !isIndoor;
}

async function updateAnalytics(userId, data) {
  try {
    const analytics = await Analytics.findOne({ userId });
    
    if (analytics) {
      await analytics.updateDaily(data);
    }
  } catch (error) {
    console.error('Analytics update error:', error);
  }
}

async function checkAchievements(userId, currentStreak) {
  const achievements = [
    { days: 7, id: 'first_week', name: 'First Week', icon: '🔥', rarity: 'common' },
    { days: 30, id: 'monthly_warrior', name: 'Monthly Warrior', icon: '🌟', rarity: 'rare' },
    { days: 100, id: 'century_club', name: 'Century Club', icon: '💯', rarity: 'epic' },
    { days: 365, id: 'year_streak', name: 'Year Streak', icon: '🏆', rarity: 'legendary' }
  ];

  for (const achievement of achievements) {
    if (currentStreak === achievement.days) {
      await User.findByIdAndUpdate(userId, {
        $addToSet: {
          achievements: {
            id: achievement.id,
            name: achievement.name,
            description: `Maintained a ${achievement.days}-day streak`,
            icon: achievement.icon,
            earnedAt: new Date(),
            rarity: achievement.rarity
          }
        }
      });
      break;
    }
  }
}

async function postToShameWall(userId, message) {
  try {
    const user = await User.findById(userId);
    
    // Create shame wall post
    const ShamePost = mongoose.model('ShamePost');
    await ShamePost.create({
      userId,
      username: user.username,
      displayName: user.displayName,
      avatar: user.customAvatar || user.avatar,
      message,
      postedAt: new Date(),
      upvotes: 0,
      comments: []
    });
  } catch (error) {
    console.error('Shame wall post error:', error);
  }
}

function getTimeLeftToday() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const diffMs = tomorrow - now;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return {
    hours: diffHours,
    minutes: diffMinutes,
    totalMinutes: Math.floor(diffMs / (1000 * 60))
  };
}