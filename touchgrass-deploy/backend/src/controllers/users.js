const crypto = require('crypto');
const User = require('../models/user');
const Streak = require('../models/Streak');
const ShareAnalytics = require('../models/ShareAnalytics');
const { redis } = require('../config/redis');
const { cloudinary } = require('../config/cloudinary');
const { SOCIAL_PLATFORMS, ERROR_CODES, API_MESSAGES, ACHIEVEMENTS } = require('../config/constants');
const { generateSocialShareImage } = require('../config/cloudinary');

/**
 * Social Share Controller
 * Handles social sharing, viral analytics, and embed generation
 */

class SocialShareController {
  /**
   * Generate share content for a streak
   */
  async generateShareContent(req, res) {
    try {
      const userId = req.userId;
      const { streakId, platform = 'generic' } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      const streak = await Streak.findOne({
        _id: streakId,
        userId
      }).populate('userId', 'username displayName avatar stats');

      if (!streak) {
        return res.status(404).json({
          error: 'Streak not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      // Generate share URL
      const baseUrl = process.env.FRONTEND_URL || 'https://touchgrass.now';
      const shareId = crypto.randomBytes(16).toString('hex');
      const shareUrl = `${baseUrl}/share/${streakId}?ref=${userId}&shareId=${shareId}`;

      // Generate OG image
      const ogImage = await generateSocialShareImage(
        {
          currentStreak: streak.currentStreak,
          consistencyScore: user.stats.consistencyScore
        },
        {
          displayName: user.displayName,
          avatar: user.avatar
        }
      );

      // Platform-specific content
      const content = this.generatePlatformContent(
        platform,
        user,
        streak,
        shareUrl
      );

      // Store share metadata for tracking
      await redis.cache.set(
        `share:${shareId}`,
        {
          userId,
          streakId,
          platform,
          timestamp: new Date().toISOString()
        },
        30 * 24 * 60 * 60 // 30 days
      );

      res.json({
        message: API_MESSAGES.SUCCESS,
        shareId,
        content,
        ogImage: ogImage.url,
        shareUrl,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Generate share content error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Generate platform-specific content
   */
  generatePlatformContent(platform, user, streak, shareUrl) {
    const platformConfig = SOCIAL_PLATFORMS[platform.toUpperCase()] || SOCIAL_PLATFORMS.TWITTER;
    
    const templates = {
      twitter: `🔥 ${user.displayName} is on a ${streak.currentStreak}-day #TouchGrass streak!\n\n"Building discipline one day at a time."\n\nJoin me: ${shareUrl}\n\n#Accountability #Streak #MentalHealth`,
      
      linkedin: `${user.displayName} has maintained a ${streak.currentStreak}-day outdoor streak on TouchGrass.now\n\nProfessional discipline starts with daily habits.\n\nTrack your progress: ${shareUrl}\n\n#ProfessionalGrowth #Wellness #Discipline`,
      
      facebook: `${user.displayName} has touched grass for ${streak.currentStreak} days in a row! 🌱\n\nJoin me in building better habits.\n\n${shareUrl}`,
      
      instagram: `Day ${streak.currentStreak} of my #TouchGrass journey 🌱\n\nBuilding real-world discipline.\n\nJoin me: ${shareUrl}\n\n#Streak #Accountability #MentalHealth #Outdoor`,
      
      generic: `🏆 ${user.displayName}'s ${streak.currentStreak}-Day TouchGrass Streak\n\nBuilding discipline through daily accountability.\n\nJoin the movement: ${shareUrl}`
    };

    return {
      text: templates[platform] || templates.generic,
      url: shareUrl,
      hashtags: platformConfig.hashtags,
      maxLength: platformConfig.maxLength,
      platform: platformConfig.name
    };
  }

  /**
   * Get share URL for specific platform
   */
  async getShareUrl(req, res) {
    try {
      const userId = req.userId;
      const { platform, streakId, customMessage } = req.body;

      // Validate platform
      if (!SOCIAL_PLATFORMS[platform.toUpperCase()]) {
        return res.status(400).json({
          error: 'Unsupported platform',
          code: ERROR_CODES.VALIDATION_FAILED,
          supportedPlatforms: Object.keys(SOCIAL_PLATFORMS)
        });
      }

      const user = await User.findById(userId);
      const streak = await Streak.findOne({ _id: streakId, userId });

      if (!user || !streak) {
        return res.status(404).json({
          error: 'User or streak not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      // Generate share URL
      const baseUrl = process.env.FRONTEND_URL || 'https://touchgrass.now';
      const shareId = crypto.randomBytes(16).toString('hex');
      const shareUrl = `${baseUrl}/share/${streakId}?ref=${userId}&shareId=${shareId}`;

      // Generate platform-specific share URL
      const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          customMessage || `🔥 ${user.displayName}'s ${streak.currentStreak}-day TouchGrass streak! ${shareUrl} #TouchGrass`
        )}`,
        
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
          customMessage || `Check out my ${streak.currentStreak}-day TouchGrass streak! ${shareUrl}`
        )}`,
        
        instagram: `https://www.instagram.com/` // Instagram doesn't support direct sharing
      };

      const result = {
        platform,
        shareUrl: shareUrls[platform],
        directUrl: shareUrl,
        message: customMessage || `My ${streak.currentStreak}-day TouchGrass streak!`,
        timestamp: new Date().toISOString()
      };

      // Track share generation
      await this.trackShareEvent(userId, streakId, platform, 'generate');

      res.json({
        message: API_MESSAGES.SUCCESS,
        ...result
      });
    } catch (error) {
      console.error('Get share URL error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Track share event
   */
  async trackShare(req, res) {
    try {
      const userId = req.userId;
      const { streakId, platform, shareType = 'manual', shareId } = req.body;

      // Record share analytics
      const analytics = new ShareAnalytics({
        userId,
        streakId,
        platform,
        shareType,
        shareId,
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip,
        timestamp: new Date()
      });

      await analytics.save();

      // Update streak share count
      await Streak.findByIdAndUpdate(streakId, {
        $inc: { shareCount: 1 }
      });

      // Update user's share stats
      await User.findByIdAndUpdate(userId, {
        $inc: { 'stats.totalShares': 1 },
        $set: { 'stats.lastShared': new Date() }
      });

      // Award achievements for sharing
      await this.awardSharingAchievements(userId);

      // Track in Redis for real-time analytics
      await redis.cache.increment('analytics:shares:total');
      await redis.cache.increment(`analytics:shares:${platform}`);
      await redis.cache.increment(`analytics:shares:user:${userId}`);

      // Update viral coefficient
      await this.updateViralCoefficient();

      res.json({
        message: 'Share tracked successfully',
        tracked: true
      });
    } catch (error) {
      console.error('Track share error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Track share event (internal)
   */
  async trackShareEvent(userId, streakId, platform, shareType, shareId = null) {
    try {
      const analytics = new ShareAnalytics({
        userId,
        streakId,
        platform,
        shareType,
        shareId,
        timestamp: new Date()
      });

      await analytics.save();

      // Update counters
      await redis.cache.increment('analytics:shares:total');
      await redis.cache.increment(`analytics:shares:${platform}`);
    } catch (error) {
      console.error('Track share event error:', error);
    }
  }

  /**
   * Award sharing achievements
   */
  async awardSharingAchievements(userId) {
    try {
      const user = await User.findById(userId);
      const shareCount = user.stats.totalShares || 0;

      // Check for social butterfly achievement
      if (shareCount >= 10 && !user.achievements?.includes('social_butterfly')) {
        await User.findByIdAndUpdate(userId, {
          $addToSet: { achievements: 'social_butterfly' },
          $push: {
            notifications: {
              type: 'achievement',
              title: 'Social Butterfly 🦋',
              message: 'You shared your streak 10 times!',
              read: false,
              createdAt: new Date()
            }
          }
        });

        // Send achievement notification via Redis
        await redis.pubsub.publish(`user:${userId}`, {
          type: 'achievement_unlocked',
          data: {
            achievement: 'Social Butterfly',
            icon: '🦋',
            description: 'Shared streak 10+ times'
          }
        });
      }

      // Check for viral streak achievement
      const streakShares = await ShareAnalytics.countDocuments({
        userId,
        shareType: 'streak'
      });

      if (streakShares >= 50 && !user.achievements?.includes('viral_streak')) {
        await User.findByIdAndUpdate(userId, {
          $addToSet: { achievements: 'viral_streak' }
        });
      }
    } catch (error) {
      console.error('Award sharing achievements error:', error);
    }
  }

  /**
   * Update viral coefficient
   */
  async updateViralCoefficient() {
    try {
      // Calculate viral coefficient (shares per user)
      const totalUsers = await User.countDocuments();
      const totalShares = await ShareAnalytics.countDocuments();

      const viralCoefficient = totalUsers > 0 ? totalShares / totalUsers : 0;

      await redis.cache.set(
        'analytics:viral_coefficient',
        viralCoefficient,
        24 * 60 * 60 // 24 hours
      );

      return viralCoefficient;
    } catch (error) {
      console.error('Update viral coefficient error:', error);
      return 0;
    }
  }

  /**
   * Get share analytics
   */
  async getShareAnalytics(req, res) {
    try {
      const userId = req.userId;
      const { timeframe = 'week', platform } = req.query;

      // Calculate date range
      const now = new Date();
      let startDate;
      
      switch (timeframe) {
        case 'day':
          startDate = new Date(now.setDate(now.getDate() - 1));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          startDate = new Date(now.setDate(now.getDate() - 7));
      }

      // Build query
      const query = { userId, timestamp: { $gte: startDate } };
      if (platform) {
        query.platform = platform;
      }

      // Get analytics
      const shares = await ShareAnalytics.find(query)
        .sort({ timestamp: -1 })
        .lean();

      // Get platform distribution
      const platformDistribution = await ShareAnalytics.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$platform',
            count: { $sum: 1 },
            lastShared: { $max: '$timestamp' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      // Get daily trends
      const dailyTrends = await ShareAnalytics.aggregate([
        { $match: query },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Get most shared streak
      const mostSharedStreak = await ShareAnalytics.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$streakId',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]);

      let streakDetails = null;
      if (mostSharedStreak.length > 0) {
        const streak = await Streak.findById(mostSharedStreak[0]._id);
        if (streak) {
          streakDetails = {
            streakId: streak._id,
            currentStreak: streak.currentStreak,
            shareCount: mostSharedStreak[0].count
          };
        }
      }

      // Get viral coefficient
      const viralCoefficient = await redis.cache.get('analytics:viral_coefficient') || 0;

      res.json({
        message: API_MESSAGES.SUCCESS,
        analytics: {
          totalShares: shares.length,
          platformDistribution,
          dailyTrends,
          mostSharedStreak: streakDetails,
          timeframe: {
            start: startDate,
            end: new Date()
          },
          viralCoefficient: parseFloat(viralCoefficient)
        }
      });
    } catch (error) {
      console.error('Get share analytics error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Get viral streaks (most shared)
   */
  async getViralStreaks(req, res) {
    try {
      const { limit = 10, timeframe = 'month' } = req.query;

      // Calculate date range
      const now = new Date();
      let startDate;
      
      switch (timeframe) {
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          startDate = new Date(now.setMonth(now.getMonth() - 1));
      }

      const cacheKey = `viral_streaks:${timeframe}:${limit}`;
      
      // Try cache first
      const cached = await redis.cache.get(cacheKey);
      if (cached) {
        return res.json({
          message: API_MESSAGES.SUCCESS,
          ...cached,
          cached: true
        });
      }

      // Get most shared streaks
      const viralStreaks = await ShareAnalytics.aggregate([
        {
          $match: {
            timestamp: { $gte: startDate },
            shareType: 'streak'
          }
        },
        {
          $group: {
            _id: '$streakId',
            shareCount: { $sum: 1 },
            platforms: { $addToSet: '$platform' },
            lastShared: { $max: '$timestamp' }
          }
        },
        { $sort: { shareCount: -1 } },
        { $limit: parseInt(limit) },
        {
          $lookup: {
            from: 'streaks',
            localField: '_id',
            foreignField: '_id',
            as: 'streak'
          }
        },
        { $unwind: '$streak' },
        {
          $lookup: {
            from: 'users',
            localField: 'streak.userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            streakId: '$_id',
            currentStreak: '$streak.currentStreak',
            shareCount: 1,
            platforms: 1,
            lastShared: 1,
            user: {
              id: '$user._id',
              username: '$user.username',
              displayName: '$user.displayName',
              avatar: '$user.avatar'
            }
          }
        }
      ]);

      const result = {
        viralStreaks,
        timeframe: {
          start: startDate,
          end: new Date()
        },
        updatedAt: new Date().toISOString()
      };

      // Cache for 1 hour
      await redis.cache.set(cacheKey, result, 3600);

      res.json({
        message: API_MESSAGES.SUCCESS,
        ...result,
        cached: false
      });
    } catch (error) {
      console.error('Get viral streaks error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Generate embed code
   */
  async generateEmbedCode(req, res) {
    try {
      const userId = req.userId;
      const { streakId, style = 'modern' } = req.body;

      const user = await User.findById(userId);
      const streak = await Streak.findOne({ _id: streakId, userId });

      if (!user || !streak) {
        return res.status(404).json({
          error: 'User or streak not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      const baseUrl = process.env.FRONTEND_URL || 'https://touchgrass.now';
      const embedUrl = `${baseUrl}/embed/${streakId}`;

      const embedTemplates = {
        modern: `
<div class="touchgrass-embed" data-user="${userId}" data-streak="${streakId}">
  <script async src="${baseUrl}/embed.js"></script>
</div>
        `,
        
        minimal: `
<a href="${baseUrl}/share/${streakId}" target="_blank">
  <img src="${baseUrl}/api/embed/${streakId}/badge" alt="TouchGrass Streak Badge" style="height: 20px;" />
</a>
        `,
        
        widget: `
<div id="touchgrass-widget-${streakId}"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${baseUrl}/widget.js?id=${streakId}&user=${userId}';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>
        `,
        
        badge: `
<span class="touchgrass-badge" data-streak="${streak.currentStreak}" data-user="${user.username}">
  <span class="streak-count">${streak.currentStreak}</span> days
</span>
<style>
  .touchgrass-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
  }
  .streak-count {
    font-size: 16px;
    font-weight: 900;
  }
</style>
        `
      };

      res.json({
        message: API_MESSAGES.SUCCESS,
        embedCode: embedTemplates[style] || embedTemplates.modern,
        previewUrl: embedUrl,
        styles: ['modern', 'minimal', 'widget', 'badge']
      });
    } catch (error) {
      console.error('Generate embed code error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Get share preview (OG data)
   */
  async getSharePreview(req, res) {
    try {
      const { streakId } = req.params;

      const streak = await Streak.findById(streakId).populate('userId');
      if (!streak) {
        return res.status(404).json({
          error: 'Streak not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      const user = streak.userId;

      // Generate OG image
      const ogImage = await generateSocialShareImage(
        {
          currentStreak: streak.currentStreak,
          consistencyScore: user.stats.consistencyScore
        },
        {
          displayName: user.displayName,
          avatar: user.avatar
        }
      );

      const preview = {
        title: `${user.displayName}'s ${streak.currentStreak}-Day TouchGrass Streak`,
        description: `Building discipline through daily accountability. ${user.displayName} has maintained a ${streak.currentStreak}-day streak with ${user.stats.consistencyScore}% consistency.`,
        image: ogImage.url,
        url: `${process.env.FRONTEND_URL}/share/${streakId}`,
        siteName: 'TouchGrass.now',
        type: 'website',
        twitter: {
          card: 'summary_large_image',
          title: `${user.displayName}'s ${streak.currentStreak}-Day Streak`,
          description: 'Daily accountability for real-world discipline',
          image: ogImage.url
        }
      };

      res.json({
        message: API_MESSAGES.SUCCESS,
        preview
      });
    } catch (error) {
      console.error('Get share preview error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Get QR code for sharing
   */
  async getQRCode(req, res) {
    try {
      const userId = req.userId;
      const { streakId } = req.body;

      const user = await User.findById(userId);
      const streak = await Streak.findOne({ _id: streakId, userId });

      if (!user || !streak) {
        return res.status(404).json({
          error: 'User or streak not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      const shareUrl = `${process.env.FRONTEND_URL}/share/${streakId}?ref=${userId}`;
      
      // Generate QR code URL (using a QR code service)
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;

      res.json({
        message: API_MESSAGES.SUCCESS,
        qrCodeUrl,
        shareUrl,
        downloadUrl: qrCodeUrl + '&download=1'
      });
    } catch (error) {
      console.error('Get QR code error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Bulk share to multiple platforms
   */
  async bulkShare(req, res) {
    try {
      const userId = req.userId;
      const { streakId, platforms, customMessage } = req.body;

      if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
        return res.status(400).json({
          error: 'Platforms array is required',
          code: ERROR_CODES.VALIDATION_FAILED
        });
      }

      const user = await User.findById(userId);
      const streak = await Streak.findOne({ _id: streakId, userId });

      if (!user || !streak) {
        return res.status(404).json({
          error: 'User or streak not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      const baseUrl = process.env.FRONTEND_URL || 'https://touchgrass.now';
      const shareId = crypto.randomBytes(16).toString('hex');
      const shareUrl = `${baseUrl}/share/${streakId}?ref=${userId}&shareId=${shareId}`;

      // Generate share URLs for each platform
      const shareResults = platforms.map(platform => {
        const platformConfig = SOCIAL_PLATFORMS[platform.toUpperCase()];
        if (!platformConfig) return null;

        let shareUrl;
        switch (platform.toLowerCase()) {
          case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              customMessage || `🔥 ${user.displayName}'s ${streak.currentStreak}-day TouchGrass streak! ${shareUrl} #TouchGrass`
            )}`;
            break;
          
          case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
            break;
          
          case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
            break;
          
          case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
              customMessage || `Check out my ${streak.currentStreak}-day TouchGrass streak! ${shareUrl}`
            )}`;
            break;
          
          default:
            shareUrl = shareUrl;
        }

        return {
          platform,
          shareUrl,
          platformName: platformConfig.name,
          icon: platformConfig.icon
        };
      }).filter(Boolean);

      // Track bulk share
      for (const platform of platforms) {
        await this.trackShareEvent(userId, streakId, platform, 'bulk', shareId);
      }

      res.json({
        message: API_MESSAGES.SUCCESS,
        shareResults,
        totalPlatforms: shareResults.length,
        shareId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Bulk share error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Get social sharing leaderboard
   */
  async getSharingLeaderboard(req, res) {
    try {
      const { timeframe = 'month', limit = 20 } = req.query;

      // Calculate date range
      const now = new Date();
      let startDate;
      
      switch (timeframe) {
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          startDate = new Date(now.setMonth(now.getMonth() - 1));
      }

      const cacheKey = `sharing_leaderboard:${timeframe}:${limit}`;
      
      // Try cache first
      const cached = await redis.cache.get(cacheKey);
      if (cached) {
        return res.json({
          message: API_MESSAGES.SUCCESS,
          ...cached,
          cached: true
        });
      }

      // Get top sharers
      const topSharers = await ShareAnalytics.aggregate([
        {
          $match: {
            timestamp: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$userId',
            shareCount: { $sum: 1 },
            platforms: { $addToSet: '$platform' },
            lastShared: { $max: '$timestamp' }
          }
        },
        { $sort: { shareCount: -1 } },
        { $limit: parseInt(limit) },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            userId: '$_id',
            username: '$user.username',
            displayName: '$user.displayName',
            avatar: '$user.avatar',
            shareCount: 1,
            platforms: 1,
            lastShared: 1,
            streak: '$user.stats.currentStreak'
          }
        }
      ]);

      const result = {
        topSharers,
        timeframe: {
          start: startDate,
          end: new Date()
        },
        updatedAt: new Date().toISOString()
      };

      // Cache for 30 minutes
      await redis.cache.set(cacheKey, result, 1800);

      res.json({
        message: API_MESSAGES.SUCCESS,
        ...result,
        cached: false
      });
    } catch (error) {
      console.error('Get sharing leaderboard error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }
}

module.exports = new SocialShareController();