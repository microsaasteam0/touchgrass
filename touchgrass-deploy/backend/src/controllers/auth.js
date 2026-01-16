const User = require('../models/user');
const Analytics = require('../models/Analytics');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
        message: 'Validation failed'
      });
    }

    const { 
      email, 
      password, 
      username, 
      displayName,
      firstName,
      lastName,
      location,
      bio 
    } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Create new user with real profile data
    const user = new User({
      email,
      password,
      username,
      displayName,
      firstName,
      lastName,
      location: location || {},
      bio: bio || '',
      preferences: {
        profileVisibility: 'public',
        showOnLeaderboard: true,
        notifications: {
          streakReminder: true,
          leaderboardUpdates: true,
          challengeInvites: true,
          marketingEmails: false
        }
      },
      stats: {
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        totalOutdoorTime: 0,
        averageDailyTime: 0,
        consistencyScore: 0,
        shameDays: 0,
        challengesWon: 0,
        challengesParticipated: 0,
        sharesCount: 0,
        referralCount: 0
      },
      analytics: {
        firstLogin: new Date(),
        totalLogins: 1,
        sessions: [],
        deviceInfo: req.headers['user-agent'] || '',
        ipAddress: req.ip || ''
      }
    });

    // Generate referral code from username
    user.referralCode = `TG-${username.toUpperCase().slice(0, 6)}${Date.now().toString().slice(-4)}`;

    await user.save();

    // Create analytics record for the user
    const analytics = new Analytics({
      userId: user._id,
      daily: {
        date: new Date(),
        verifications: 0,
        photoVerifications: 0,
        shameVerifications: 0,
        totalDuration: 0,
        shares: 0,
        challengesJoined: 0,
        challengesWon: 0,
        referrals: 0,
        revenueGenerated: 0,
        sessions: [{
          startTime: new Date(),
          endTime: new Date(),
          duration: 0,
          actions: 0,
          device: req.headers['user-agent'] || 'Unknown'
        }]
      }
    });

    await analytics.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send welcome email (in production)
    // await sendWelcomeEmail(user.email, user.displayName);

    // Track registration in analytics
    await trackRegistrationAnalytics(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: user.toProfileJSON(),
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password selected
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: `Account is ${user.status}. Please contact support.`
      });
    }

    // Update last active and login count
    user.lastActive = new Date();
    user.analytics.totalLogins += 1;
    user.analytics.sessions.push({
      date: new Date(),
      duration: 0, // Will be updated on logout
      actions: 0,
      device: req.headers['user-agent'] || ''
    });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Update analytics
    await updateLoginAnalytics(user._id, req);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toProfileJSON(),
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get streak data
    const streak = await mongoose.model('Streak').findOne({ userId: user._id });
    
    // Get analytics
    const analytics = await Analytics.findOne({ userId: user._id });
    
    // Get rank
    const rank = await user.getRank();
    const percentile = await user.getPercentile();

    // Compile complete profile data
    const profileData = {
      ...user.toProfileJSON(),
      streak: streak ? streak.getStats() : null,
      analytics: analytics ? {
        daily: analytics.daily,
        weekly: analytics.weekly,
        monthly: analytics.monthly,
        lifetime: analytics.lifetime,
        engagement: analytics.engagement
      } : null,
      rank: {
        position: rank,
        percentile,
        totalUsers: await User.countDocuments({ 'preferences.showOnLeaderboard': true })
      },
      todayVerified: streak ? streak.todayVerified : false,
      lastVerification: user.lastVerification
    };

    res.json({
      success: true,
      data: profileData
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { 
      displayName, 
      firstName, 
      lastName,
      bio,
      website,
      occupation,
      location,
      avatar,
      preferences 
    } = req.body;

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields if provided
    if (displayName) user.displayName = displayName;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;
    if (website !== undefined) user.website = website;
    if (occupation !== undefined) user.occupation = occupation;
    if (location) user.location = location;
    if (avatar) user.customAvatar = avatar;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user.toProfileJSON()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    // Verify token (implementation depends on your email verification system)
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    user.preferences.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Award email verification achievement
    await awardAchievement(user._id, 'email_verified', 'Email Verified', '✓', 'common');

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed'
    });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal if user exists for security
      return res.json({
        success: true,
        message: 'If your email is registered, you will receive a password reset link'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    // await sendPasswordResetEmail(user.email, resetToken);

    res.json({
      success: true,
      message: 'Password reset link sent to your email'
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request'
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    const user = await User.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
};

// Helper functions
async function trackRegistrationAnalytics(userId) {
  try {
    // Track in platform analytics
    const PlatformAnalytics = mongoose.model('PlatformAnalytics');
    await PlatformAnalytics.findOneAndUpdate(
      { date: new Date().toISOString().split('T')[0] },
      { $inc: { registrations: 1 } },
      { upsert: true }
    );
  } catch (error) {
    console.error('Registration analytics error:', error);
  }
}

async function updateLoginAnalytics(userId, req) {
  try {
    const analytics = await Analytics.findOne({ userId });
    
    if (analytics) {
      analytics.daily.sessions.push({
        startTime: new Date(),
        endTime: null, // Will be set on logout
        duration: 0,
        actions: 0,
        device: req.headers['user-agent'] || 'Unknown',
        ipAddress: req.ip || ''
      });
      
      await analytics.save();
    }
  } catch (error) {
    console.error('Login analytics error:', error);
  }
}

async function awardAchievement(userId, achievementId, name, icon, rarity) {
  try {
    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        achievements: {
          id: achievementId,
          name,
          icon,
          earnedAt: new Date(),
          rarity
        }
      }
    });
  } catch (error) {
    console.error('Award achievement error:', error);
  }
}