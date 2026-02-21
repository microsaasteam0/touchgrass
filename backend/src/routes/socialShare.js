const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { authenticateToken: auth } = require('../middleware/auth');
const crypto = require('crypto');
const ogs = require('open-graph-scraper');
const SocialShareService = require('../services/socialShare');
const ShareAnalytics = require('../models/ShareAnalytics');
const Streak = require('../models/Streak');
const User = require('../models/user');
const Achievement = require('../models/Achievement');

// Initialize social share service
const socialShareService = new SocialShareService();

// @route   POST /api/share/generate
// @desc    Generate share content
// @access  Private
router.post('/generate', auth, [
  check('streakId', 'Streak ID is required').isMongoId(),
  check('platform', 'Platform is required').isIn([
    'twitter', 'linkedin', 'facebook', 'instagram', 
    'whatsapp', 'reddit', 'discord', 'generic'
  ])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { streakId, platform, customMessage } = req.body;

    const user = await User.findById(req.user.id);
    const streak = await Streak.findById(streakId).populate('userId');

    if (!user || !streak) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'User or streak not found'
      });
    }

    // Verify user owns the streak
    if (streak.userId._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'You do not have permission to share this streak'
      });
    }

    // Generate share content
    const shareContent = await socialShareService.generateShareContent(
      req.user.id,
      streakId,
      platform,
      customMessage
    );

    // Generate share URL with tracking
    const shareId = crypto.randomBytes(16).toString('hex');
    const trackingParams = new URLSearchParams({
      ref: req.user.id,
      share_id: shareId,
      platform: platform,
      source: 'direct_share'
    });

    shareContent.url = `${shareContent.url}?${trackingParams.toString()}`;

    res.json({
      success: true,
      shareContent,
      shareId,
      platform
    });

  } catch (err) {
    console.error('Generate share content error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error generating share content'
    });
  }
});

// @route   POST /api/share
// @desc    Share to platform
// @access  Private
router.post('/', auth, [
  check('platform', 'Platform is required').isIn([
    'twitter', 'linkedin', 'facebook', 'instagram', 
    'whatsapp', 'reddit', 'discord', 'copy_link'
  ]),
  check('streakId', 'Streak ID is required').isMongoId(),
  check('message', 'Message is required').not().isEmpty().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { platform, streakId, message, hashtags = [] } = req.body;

    const user = await User.findById(req.user.id);
    const streak = await Streak.findById(streakId);

    if (!user || !streak) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'User or streak not found'
      });
    }

    // Verify user owns the streak
    if (streak.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'You do not have permission to share this streak'
      });
    }

    // Generate share URL
    const baseUrl = process.env.FRONTEND_URL || 'https://touchgrass.now';
    const shareId = crypto.randomBytes(16).toString('hex');
    
    const shareUrl = `${baseUrl}/share/${streakId}?ref=${req.user.id}&share_id=${shareId}&platform=${platform}`;

    // Generate share content
    const shareContent = {
      text: message,
      url: shareUrl,
      hashtags: Array.isArray(hashtags) ? hashtags : [hashtags],
      platform: platform
    };

    // Get platform-specific share URL
    const shareUrlWithTracking = await socialShareService.getPlatformShareUrl(
      platform,
      shareContent
    );

    // Create share analytics record
    const shareAnalytics = await ShareAnalytics.createShare(
      req.user.id,
      streakId,
      platform,
      {
        url: shareUrl,
        message: message,
        hashtags: hashtags
      }
    );

    // Update streak share count
    streak.shareCount += 1;
    streak.shareHistory.push({
      platform: platform,
      sharedAt: new Date(),
      clicks: 0
    });
    await streak.save();

    // Update user share count
    user.stats.shareCount += 1;
    await user.save();

    // Check for sharing achievement
    if (user.stats.shareCount >= 10) {
      const achievement = await Achievement.findOne({ 
        type: 'social',
        'requirements.shareCount': 10 
      });
      
      if (achievement) {
        await user.addAchievement(achievement._id);
      }
    }

    res.json({
      success: true,
      message: 'Share created successfully',
      shareUrl: shareUrlWithTracking,
      analyticsId: shareAnalytics._id,
      platform: platform,
      trackClicks: true
    });

  } catch (err) {
    console.error('Share error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error sharing content'
    });
  }
});

// @route   GET /api/share/click
// @desc    Track share click
// @access  Public
router.get('/click', async (req, res) => {
  try {
    const { share_id, ref, platform, source } = req.query;

    if (!share_id) {
      return res.status(400).json({
        error: 'MISSING_PARAMS',
        message: 'Share ID is required'
      });
    }

    // Find share analytics
    const shareAnalytics = await ShareAnalytics.findOne({
      'tracking.shareId': share_id
    });

    if (!shareAnalytics) {
      // Redirect to app without tracking
      return res.redirect(process.env.FRONTEND_URL || 'https://touchgrass.now');
    }

    // Record click with additional data
    const clickData = {
      unique: true, // Would need cookie/session check for actual uniqueness
      device: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop',
      country: req.headers['cf-ipcountry'] || req.headers['x-country'] || 'unknown',
      referrer: req.get('Referer') || 'direct'
    };

    await shareAnalytics.recordClick(clickData);

    // Redirect to the actual share URL
    const redirectUrl = shareAnalytics.shareData.url.split('?')[0]; // Remove tracking params
    
    // Add welcome param for new users
    const url = new URL(redirectUrl);
    if (ref && !url.searchParams.has('ref')) {
      url.searchParams.set('ref', ref);
      url.searchParams.set('welcome', 'true');
    }

    res.redirect(url.toString());

  } catch (err) {
    console.error('Track click error:', err);
    // Still redirect even if tracking fails
    res.redirect(process.env.FRONTEND_URL || 'https://touchgrass.now');
  }
});

// @route   GET /api/share/analytics/:shareId?
// @desc    Get share analytics
// @access  Private
router.get('/analytics/:shareId?', auth, async (req, res) => {
  try {
    const { shareId } = req.params;
    const { timeframe = 'week', limit = 10, offset = 0 } = req.query;

    let analytics;

    if (shareId) {
      // Get specific share analytics
      analytics = await ShareAnalytics.findOne({
        _id: shareId,
        user: req.user.id
      });

      if (!analytics) {
        return res.status(404).json({
          error: 'NOT_FOUND',
          message: 'Share analytics not found'
        });
      }

      res.json({
        success: true,
        analytics: analytics.toObject()
      });

    } else {
      // Get all shares for user with pagination
      const timeframes = {
        day: 1,
        week: 7,
        month: 30,
        year: 365
      };

      const days = timeframes[timeframe] || 7;
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const shares = await ShareAnalytics.find({
        user: req.user.id,
        createdAt: { $gte: since }
      })
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .populate('streak', 'currentStreak');

      const total = await ShareAnalytics.countDocuments({
        user: req.user.id,
        createdAt: { $gte: since }
      });

      res.json({
        success: true,
        shares: shares.map(share => ({
          id: share._id,
          platform: share.platform,
          streak: share.streak?.currentStreak || 0,
          clicks: share.clicks.total,
          engagements: share.engagements,
          conversions: share.conversions,
          performance: share.performance,
          createdAt: share.createdAt
        })),
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: offset + limit < total
        },
        timeframe
      });
    }

  } catch (err) {
    console.error('Get analytics error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   GET /api/share/viral
// @desc    Get viral streaks
// @access  Public
router.get('/viral', async (req, res) => {
  try {
    const { limit = 10, timeframe = 'week' } = req.query;

    const viralStreaks = await ShareAnalytics.findViralStreaks(
      parseInt(limit),
      timeframe
    );

    res.json({
      success: true,
      viralStreaks,
      timeframe,
      updatedAt: new Date().toISOString()
    });

  } catch (err) {
    console.error('Get viral streaks error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   POST /api/share/embed
// @desc    Generate embed code
// @access  Private
router.post('/embed', auth, [
  check('streakId', 'Streak ID is required').isMongoId(),
  check('style', 'Style is required').isIn(['modern', 'minimal', 'widget'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { streakId, style } = req.body;

    const streak = await Streak.findById(streakId);

    if (!streak) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Streak not found'
      });
    }

    // Verify user owns the streak or streak is public
    if (streak.userId.toString() !== req.user.id.toString() && !streak.isPublic) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'You do not have permission to embed this streak'
      });
    }

    // Generate embed code
    const embedCode = socialShareService.generateEmbedCode(
      streakId,
      req.user.id,
      style
    );

    // Update streak metadata
    if (!streak.metadata.embedCode) {
      streak.metadata.embedCode = embedCode;
      await streak.save();
    }

    res.json({
      success: true,
      embedCode,
      previewUrl: `${process.env.FRONTEND_URL}/embed/${streakId}`,
      styles: ['modern', 'minimal', 'widget']
    });

  } catch (err) {
    console.error('Generate embed code error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error generating embed code'
    });
  }
});

// @route   GET /api/share/qr/:streakId
// @desc    Generate QR code for sharing
// @access  Private
router.get('/qr/:streakId', auth, async (req, res) => {
  try {
    const { streakId } = req.params;

    const streak = await Streak.findById(streakId);

    if (!streak) {
      return res.status(404).json({
        error: 'NOT_FOUND',
        message: 'Streak not found'
      });
    }

    // Verify user owns the streak
    if (streak.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'You do not have permission to generate QR code for this streak'
      });
    }

    // Generate share URL
    const baseUrl = process.env.FRONTEND_URL || 'https://touchgrass.now';
    const shareUrl = `${baseUrl}/share/${streakId}?ref=${req.user.id}&source=qr`;

    // Generate QR code (in production, use a QR code library)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;

    // Store QR code in streak metadata
    if (!streak.metadata.qrCode) {
      streak.metadata.qrCode = qrCodeUrl;
      await streak.save();
    }

    res.json({
      success: true,
      qrCodeUrl,
      shareUrl,
      downloadUrl: qrCodeUrl + '&download=1'
    });

  } catch (err) {
    console.error('Generate QR code error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error generating QR code'
    });
  }
});

// @route   GET /api/share/platforms
// @desc    Get available sharing platforms
// @access  Public
router.get('/platforms', async (req, res) => {
  try {
    const platforms = Object.values(socialShareService.platforms).map(platform => ({
      id: platform.id || platform.name.toLowerCase(),
      name: platform.name,
      icon: platform.icon,
      maxLength: platform.maxLength,
      description: platform.description
    }));

    res.json({
      success: true,
      platforms,
      defaultHashtags: ['TouchGrass', 'Accountability', 'Streak', 'MentalHealth']
    });

  } catch (err) {
    console.error('Get platforms error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   POST /api/share/webhook
// @desc    Handle webhook from social platforms (for engagement tracking)
// @access  Public
router.post('/webhook/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const event = req.body;

    // Verify webhook signature (platform-specific)
    // This is a simplified version - actual implementation would verify signatures

    switch (platform) {
      case 'twitter':
        await handleTwitterWebhook(event);
        break;
      case 'facebook':
        await handleFacebookWebhook(event);
        break;
      // Add other platforms as needed
    }

    res.json({ received: true });

  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error processing webhook'
    });
  }
});

// Twitter webhook handler
async function handleTwitterWebhook(event) {
  // Handle Twitter engagement events (likes, retweets, etc.)
  // This would parse the event and update share analytics
}

// Facebook webhook handler
async function handleFacebookWebhook(event) {
  // Handle Facebook engagement events
}

// @route   GET /api/share/og-image/:streakId
// @desc    Generate Open Graph image for sharing
// @access  Public
router.get('/og-image/:streakId', async (req, res) => {
  try {
    const { streakId } = req.params;

    const streak = await Streak.findById(streakId).populate('userId');

    if (!streak || !streak.isPublic) {
      // Return default OG image
      return res.redirect(`${process.env.FRONTEND_URL}/og-default.png`);
    }

    // Generate OG image URL (using Cloudinary or similar)
    const ogImageUrl = await socialShareService.generateOGImage(
      streak.userId,
      streak
    );

    // Redirect to OG image
    res.redirect(ogImageUrl);

  } catch (err) {
    console.error('Generate OG image error:', err);
    res.redirect(`${process.env.FRONTEND_URL}/og-default.png`);
  }
});

// @route   POST /api/share/batch
// @desc    Share to multiple platforms at once
// @access  Private
router.post('/batch', auth, [
  check('streakId', 'Streak ID is required').isMongoId(),
  check('platforms', 'Platforms array is required').isArray(),
  check('message', 'Message is required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { streakId, platforms, message, hashtags } = req.body;

    const results = await Promise.allSettled(
      platforms.map(platform => 
        socialShareService.shareToPlatform(platform, {
          text: message,
          hashtags: hashtags
        }, streakId, req.user.id)
      )
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    res.json({
      success: true,
      message: `Shared to ${successful} out of ${platforms.length} platforms`,
      results: results.map((result, index) => ({
        platform: platforms[index],
        success: result.status === 'fulfilled',
        error: result.status === 'rejected' ? result.reason.message : null
      })),
      stats: {
        successful,
        failed,
        total: platforms.length
      }
    });

  } catch (err) {
    console.error('Batch share error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error during batch sharing'
    });
  }
});

module.exports = router;