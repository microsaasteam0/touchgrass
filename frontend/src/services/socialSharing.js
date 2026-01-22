import React from 'react';
 
  /**
 * TouchGrass Social Sharing Service - Premium Viral Marketing
 * Enterprise-grade social sharing with advanced analytics
 */

class PremiumSocialSharingService {
  constructor() {
    this.api = window.apiService;
    this.analytics = new SharingAnalytics();
    this.contentGenerator = new ContentGenerator();
    this.viralEngine = new ViralEngine();
    
    // Configuration
    this.platforms = {
      twitter: {
        name: 'Twitter (X)',
        icon: '🐦',
        color: '#1DA1F2',
        maxLength: 280,
        shareUrl: 'https://twitter.com/intent/tweet',
        analyticsId: 'twitter',
        businessValue: 'high',
        audience: 'tech',
        viralityScore: 85
      },
      linkedin: {
        name: 'LinkedIn',
        icon: '💼',
        color: '#0077B5',
        maxLength: 700,
        shareUrl: 'https://www.linkedin.com/sharing/share-offsite/',
        analyticsId: 'linkedin',
        businessValue: 'very_high',
        audience: 'professional',
        viralityScore: 75
      },
      facebook: {
        name: 'Facebook',
        icon: '👥',
        color: '#1877F2',
        maxLength: 5000,
        shareUrl: 'https://www.facebook.com/sharer/sharer.php',
        analyticsId: 'facebook',
        businessValue: 'medium',
        audience: 'general',
        viralityScore: 65
      },
      instagram: {
        name: 'Instagram',
        icon: '📸',
        color: '#E4405F',
        isApp: true,
        deeplink: 'instagram://share',
        analyticsId: 'instagram',
        businessValue: 'high',
        audience: 'visual',
        viralityScore: 90
      },
      whatsapp: {
        name: 'WhatsApp',
        icon: '💬',
        color: '#25D366',
        shareUrl: 'https://api.whatsapp.com/send',
        analyticsId: 'whatsapp',
        businessValue: 'medium',
        audience: 'personal',
        viralityScore: 70
      },
      discord: {
        name: 'Discord',
        icon: '🎮',
        color: '#5865F2',
        webhook: true,
        analyticsId: 'discord',
        businessValue: 'medium',
        audience: 'gaming',
        viralityScore: 60
      },
      reddit: {
        name: 'Reddit',
        icon: '👽',
        color: '#FF4500',
        shareUrl: 'https://reddit.com/submit',
        analyticsId: 'reddit',
        businessValue: 'medium',
        audience: 'community',
        viralityScore: 80
      },
      hackernews: {
        name: 'Hacker News',
        icon: '👨‍💻',
        color: '#FF6600',
        shareUrl: 'https://news.ycombinator.com/submitlink',
        analyticsId: 'hackernews',
        businessValue: 'very_high',
        audience: 'tech_elite',
        viralityScore: 95
      },
      tiktok: {
        name: 'TikTok',
        icon: '🎵',
        color: '#000000',
        isApp: true,
        analyticsId: 'tiktok',
        businessValue: 'high',
        audience: 'genz',
        viralityScore: 95
      },
      threads: {
        name: 'Threads',
        icon: '🧵',
        color: '#000000',
        shareUrl: 'https://threads.net/intent/post',
        analyticsId: 'threads',
        businessValue: 'high',
        audience: 'twitter_migration',
        viralityScore: 75
      }
    };
    
    // Templates
    this.templates = {
      streak: {
        basic: "🏆 Day {streak} of my #TouchGrass streak! Building discipline one day at a time. {url}",
        motivational: "🔥 Just completed day {streak} of touching grass! The journey to better habits continues. {url}",
        competitive: "🏅 {streak} days and counting! Can you beat my streak? {url} #ChallengeAccepted",
        humorous: "🌱 Day {streak}: Successfully touched grass without getting distracted by my phone! (Mostly) {url}",
        professional: "📈 Maintaining a {streak}-day outdoor streak. Daily discipline leads to professional excellence. {url} #Productivity"
      },
      achievement: {
        milestone: "🎯 Just unlocked '{achievement}' after {streak} days! {url}",
        record: "🏆 New personal record: {streak} consecutive days! {url}",
        leaderboard: "👑 Just reached #{rank} on the global leaderboard! {url} #TouchGrass",
        consistency: "📊 {consistency}% consistency over {total} days. Proof that small actions create big results. {url}"
      },
      challenge: {
        invite: "⚔️ Challenge accepted! Join me in the '{challenge}' challenge. {url}",
        victory: "🏅 Just won the '{challenge}' challenge! {url}",
        participation: "🤝 Joined '{challenge}' with {participants} other grass-touchers. {url}"
      }
    };
    
    // Hashtag library
    this.hashtags = {
      primary: ['TouchGrass', 'Accountability', 'Streak', 'Discipline', 'Productivity'],
      secondary: ['MentalHealth', 'Wellness', 'Outdoors', 'Fitness', 'Mindfulness'],
      niche: ['TechWellness', 'DigitalDetox', 'HabitBuilding', 'DailyRoutine', 'LifeImprovement'],
      viral: ['ChallengeAccepted', 'WinTheDay', 'NoZeroDays', 'GrindNeverStops', 'EliteMindset']
    };
    
    // Initialize
    this.initWebShareAPI();
    this.startAnalyticsCollection();
    this.loadPerformanceData();
  }

  initWebShareAPI() {
    // Check if Web Share API is available
    this.canUseWebShare = 'share' in navigator;
    
    if (this.canUseWebShare) {
      console.log('[Social Sharing] Web Share API available');
    }
  }

  // Core Sharing Methods
  async shareStreak(streakData, platform = 'auto', options = {}) {
    const shareId = this.generateShareId();
    const startTime = Date.now();
    
    try {
      // Validate streak data
      this.validateStreakData(streakData);
      
      // Generate share content
      const content = await this.generateShareContent(streakData, platform, options);
      
      // Generate OG image
      const ogImage = await this.generateOGImage(streakData, options.theme);
      
      // Prepare share package
      const sharePackage = {
        content,
        ogImage,
        metadata: {
          shareId,
          streakId: streakData.id,
          userId: this.getCurrentUserId(),
          platform,
          timestamp: new Date().toISOString(),
          businessContext: {
            userTier: this.getUserTier(),
            streakLength: streakData.currentStreak,
            consistencyScore: streakData.consistencyScore,
            leaderboardRank: streakData.rank
          }
        }
      };
      
      // Execute share based on platform
      let result;
      if (platform === 'auto' || platform === 'web_share') {
        result = await this.shareViaWebShare(sharePackage);
      } else if (this.platforms[platform]?.isApp) {
        result = await this.shareViaApp(platform, sharePackage);
      } else {
        result = await this.shareViaURL(platform, sharePackage);
      }
      
      // Track successful share
      await this.trackShare({
        shareId,
        platform: result.platform,
        streakId: streakData.id,
        contentLength: content.text.length,
        duration: Date.now() - startTime,
        metadata: sharePackage.metadata
      });
      
      // Award sharing achievement
      await this.awardSharingAchievement(streakData);
      
      // Update viral score
      this.viralEngine.recordShare(streakData.id, platform);
      
      // Show success UI
      this.showShareSuccess(result.platform, streakData);
      
      return {
        success: true,
        shareId,
        platform: result.platform,
        url: result.url,
        content: content.text
      };
      
    } catch (error) {
      // Track failed share
      await this.trackShareFailure({
        shareId,
        platform,
        error: error.message,
        duration: Date.now() - startTime,
        streakId: streakData.id
      });
      
      // Handle error
      this.handleShareError(error, platform);
      throw error;
    }
  }

  async shareAchievement(achievementData, platform = 'auto', options = {}) {
    try {
      const sharePackage = await this.generateAchievementContent(achievementData, platform, options);
      return this.shareStreak(achievementData.streak, platform, {
        ...options,
        template: 'achievement',
        achievementData
      });
    } catch (error) {
      console.error('[Social Sharing] Failed to share achievement:', error);
      throw error;
    }
  }

  async shareChallenge(challengeData, platform = 'auto', options = {}) {
    try {
      const sharePackage = await this.generateChallengeContent(challengeData, platform, options);
      return this.shareStreak(challengeData.streak, platform, {
        ...options,
        template: 'challenge',
        challengeData
      });
    } catch (error) {
      console.error('[Social Sharing] Failed to share challenge:', error);
      throw error;
    }
  }

  // Content Generation
  async generateShareContent(streakData, platform, options = {}) {
    const platformConfig = this.platforms[platform] || this.platforms.twitter;
    const templateType = options.template || this.determineBestTemplate(streakData, platform);
    const template = this.templates.streak[templateType] || this.templates.streak.basic;
    
    // Generate URL with tracking
    const shareUrl = await this.generateTrackingUrl(streakData, platform);
    
    // Generate text
    let text = template
      .replace('{streak}', streakData.currentStreak)
      .replace('{url}', shareUrl)
      .replace('{consistency}', streakData.consistencyScore || 0)
      .replace('{total}', streakData.totalDays || 0)
      .replace('{rank}', streakData.rank || 'N/A');
    
    // Add custom message if provided
    if (options.message) {
      text = options.message + '\n\n' + text;
    }
    
    // Add hashtags
    const hashtags = this.generateHashtags(streakData, platform, options);
    if (hashtags.length > 0) {
      text += '\n\n' + hashtags.join(' ');
    }
    
    // Truncate to platform limits
    if (text.length > platformConfig.maxLength) {
      text = text.substring(0, platformConfig.maxLength - 3) + '...';
    }
    
    return {
      text,
      url: shareUrl,
      hashtags,
      template: templateType,
      platform: platformConfig.name
    };
  }

  async generateAchievementContent(achievementData, platform, options = {}) {
    const template = this.templates.achievement[achievementData.type] || this.templates.achievement.milestone;
    const shareUrl = await this.generateTrackingUrl(achievementData.streak, platform, {
      achievement: achievementData.id
    });
    
    let text = template
      .replace('{achievement}', achievementData.name)
      .replace('{streak}', achievementData.streak.currentStreak)
      .replace('{url}', shareUrl)
      .replace('{rank}', achievementData.rank || 'N/A')
      .replace('{consistency}', achievementData.streak.consistencyScore || 0);
    
    // Add achievement icon
    if (achievementData.icon) {
      text = achievementData.icon + ' ' + text;
    }
    
    return {
      text,
      url: shareUrl,
      type: 'achievement',
      achievement: achievementData
    };
  }

  async generateChallengeContent(challengeData, platform, options = {}) {
    const template = this.templates.challenge[challengeData.status] || this.templates.challenge.invite;
    const shareUrl = await this.generateTrackingUrl(challengeData.streak, platform, {
      challenge: challengeData.id
    });
    
    let text = template
      .replace('{challenge}', challengeData.name)
      .replace('{url}', shareUrl)
      .replace('{participants}', challengeData.participants?.length || 0);
    
    return {
      text,
      url: shareUrl,
      type: 'challenge',
      challenge: challengeData
    };
  }

  async generateOGImage(streakData, theme = 'premium') {
    try {
      const response = await this.api.post('/share/generate-og', {
        streakData,
        theme,
        dimensions: {
          width: 1200,
          height: 630
        },
        options: {
          includeStats: true,
          includeBadges: true,
          watermark: true
        }
      });
      
      return response.data.imageUrl;
      
    } catch (error) {
      console.warn('[Social Sharing] Failed to generate OG image, using fallback:', error);
      
      // Return fallback image URL
      const baseUrl = 'https://touchgrass.now/og-images';
      const params = new URLSearchParams({
        streak: streakData.currentStreak,
        consistency: streakData.consistencyScore || 0,
        theme: theme,
        v: '2'
      });
      
      return `${baseUrl}/streak.png?${params}`;
    }
  }

  async generateTrackingUrl(streakData, platform, params = {}) {
    const baseUrl = 'https://touchgrass.now/share';
    const trackingParams = new URLSearchParams({
      ref: this.getCurrentUserId(),
      source: platform,
      medium: 'social_share',
      campaign: 'streak_viral',
      content: streakData.id,
      timestamp: Date.now(),
      ...params
    });
    
    // Add UTM parameters for analytics
    trackingParams.append('utm_source', platform);
    trackingParams.append('utm_medium', 'social_share');
    trackingParams.append('utm_campaign', 'streak_viral');
    trackingParams.append('utm_content', streakData.id);
    
    return `${baseUrl}/${streakData.id}?${trackingParams}`;
  }

  generateHashtags(streakData, platform, options = {}) {
    const hashtags = new Set();
    
    // Add primary hashtags
    this.hashtags.primary.forEach(tag => hashtags.add(`#${tag}`));
    
    // Add streak-length specific hashtags
    if (streakData.currentStreak >= 100) {
      hashtags.add('#CenturyClub');
      hashtags.add('#EliteStreak');
    } else if (streakData.currentStreak >= 30) {
      hashtags.add('#MonthlyMaster');
    } else if (streakData.currentStreak >= 7) {
      hashtags.add('#WeeklyWarrior');
    }
    
    // Add platform-specific hashtags
    if (platform === 'twitter') {
      hashtags.add('#TechTwitter');
      hashtags.add('#BuildInPublic');
    } else if (platform === 'linkedin') {
      hashtags.add('#ProfessionalGrowth');
      hashtags.add('#CareerDevelopment');
    } else if (platform === 'instagram') {
      hashtags.add('#VisualStorytelling');
      hashtags.add('#DailyVibes');
    }
    
    // Add viral hashtags for high streaks
    if (streakData.currentStreak >= 50) {
      this.hashtags.viral.forEach(tag => hashtags.add(`#${tag}`));
    }
    
    // Limit to 5 hashtags for most platforms
    const maxHashtags = platform === 'instagram' ? 30 : 5;
    return Array.from(hashtags).slice(0, maxHashtags);
  }

  determineBestTemplate(streakData, platform) {
    const score = streakData.currentStreak;
    
    if (platform === 'linkedin') {
      return 'professional';
    } else if (platform === 'twitter' && score >= 100) {
      return 'competitive';
    } else if (platform === 'instagram') {
      return 'humorous';
    } else if (score >= 50) {
      return 'motivational';
    } else {
      return 'basic';
    }
  }

  // Sharing Methods
  async shareViaWebShare(sharePackage) {
    if (!this.canUseWebShare) {
      throw new Error('Web Share API not available');
    }
    
    try {
      const shareData = {
        title: `My ${sharePackage.content.streakData?.currentStreak || 'TouchGrass'} Streak`,
        text: sharePackage.content.text,
        url: sharePackage.content.url
      };
      
      if (sharePackage.ogImage) {
        shareData.files = [await this.urlToFile(sharePackage.ogImage)];
      }
      
      await navigator.share(shareData);
      
      return {
        platform: 'web_share',
        method: 'navigator.share',
        url: sharePackage.content.url
      };
      
    } catch (error) {
      if (error.name !== 'AbortError') {
        throw error;
      }
      return {
        platform: 'web_share',
        cancelled: true
      };
    }
  }

  async shareViaURL(platform, sharePackage) {
    const platformConfig = this.platforms[platform];
    if (!platformConfig) {
      throw new Error(`Platform ${platform} not supported`);
    }
    
    const shareUrl = new URL(platformConfig.shareUrl);
    
    // Add platform-specific parameters
    switch (platform) {
      case 'twitter':
        shareUrl.searchParams.set('text', sharePackage.content.text);
        shareUrl.searchParams.set('url', sharePackage.content.url);
        break;
        
      case 'linkedin':
        shareUrl.searchParams.set('url', sharePackage.content.url);
        break;
        
      case 'facebook':
        shareUrl.searchParams.set('u', sharePackage.content.url);
        shareUrl.searchParams.set('quote', sharePackage.content.text);
        break;
        
      case 'whatsapp':
        shareUrl.searchParams.set('text', sharePackage.content.text);
        break;
        
      case 'reddit':
        shareUrl.searchParams.set('url', sharePackage.content.url);
        shareUrl.searchParams.set('title', sharePackage.content.text.split('\n')[0]);
        break;
        
      case 'hackernews':
        shareUrl.searchParams.set('u', sharePackage.content.url);
        shareUrl.searchParams.set('t', sharePackage.content.text.split('\n')[0]);
        break;
        
      case 'threads':
        shareUrl.searchParams.set('text', sharePackage.content.text);
        break;
    }
    
    // Open share window
    const windowFeatures = 'width=600,height=400,menubar=no,toolbar=no,location=yes';
    window.open(shareUrl.toString(), '_blank', windowFeatures);
    
    return {
      platform,
      url: shareUrl.toString(),
      method: 'url_redirect'
    };
  }

  async shareViaApp(platform, sharePackage) {
    const platformConfig = this.platforms[platform];
    
    switch (platform) {
      case 'instagram':
        // Instagram requires special handling for Stories
        if (sharePackage.ogImage) {
          // Create a temporary link for Instagram
          const tempUrl = await this.uploadToTempStorage(sharePackage.ogImage);
          const instagramUrl = `instagram://library?AssetPath=${encodeURIComponent(tempUrl)}&InstagramCaption=${encodeURIComponent(sharePackage.content.text)}`;
          
          window.location.href = instagramUrl;
          
          return {
            platform: 'instagram',
            method: 'deeplink',
            url: instagramUrl
          };
        }
        break;
        
      case 'tiktok':
        // TikTok sharing would require their SDK
        console.warn('TikTok sharing requires SDK integration');
        break;
    }
    
    throw new Error(`App sharing not implemented for ${platform}`);
  }

  // Analytics and Tracking
  async trackShare(data) {
    const analyticsData = {
      event: 'social_share',
      ...data,
      businessMetrics: {
        estimatedReach: await this.estimateReach(data.platform),
        viralityScore: this.calculateViralityScore(data),
        conversionPotential: await this.estimateConversions(data)
      }
    };
    
    // Send to analytics
    this.analytics.trackShare(analyticsData);
    
    // Send to backend
    await this.api.post('/analytics/shares', analyticsData).catch(() => {
      // Silent fail for analytics
    });
    
    // Update local metrics
    this.updateShareMetrics(data.platform);
  }

  async trackShareFailure(data) {
    const analyticsData = {
      event: 'social_share_failed',
      ...data
    };
    
    this.analytics.trackShareFailure(analyticsData);
    
    await this.api.post('/analytics/share-failures', analyticsData).catch(() => {
      // Silent fail
    });
  }

  async awardSharingAchievement(streakData) {
    try {
      const shareCount = await this.getUserShareCount();
      
      if (shareCount >= 10) {
        await this.api.post('/achievements/award', {
          achievement: 'social_butterfly',
          streakId: streakData.id,
          metadata: {
            shareCount,
            platforms: await this.getUserPlatforms()
          }
        });
      }
    } catch (error) {
      console.warn('[Social Sharing] Failed to award achievement:', error);
    }
  }

  async getUserShareCount() {
    try {
      const response = await this.api.get('/analytics/user/shares');
      return response.data.count;
    } catch (error) {
      return 0;
    }
  }

  async getUserPlatforms() {
    try {
      const response = await this.api.get('/analytics/user/share-platforms');
      return response.data.platforms;
    } catch (error) {
      return [];
    }
  }

  // Performance Metrics
  async estimateReach(platform) {
    const platformConfig = this.platforms[platform];
    const userTier = this.getUserTier();
    
    // Base reach estimates
    const baseReach = {
      twitter: 500,
      linkedin: 300,
      facebook: 1000,
      instagram: 800,
      whatsapp: 50,
      reddit: 2000,
      hackernews: 10000,
      tiktok: 5000
    };
    
    let reach = baseReach[platform] || 100;
    
    // Adjust based on user tier
    if (userTier === 'elite') {
      reach *= 1.5;
    } else if (userTier === 'premium') {
      reach *= 1.2;
    }
    
    // Adjust based on virality score
    reach *= (platformConfig.viralityScore / 100);
    
    return Math.round(reach);
  }

  async estimateConversions(data) {
    // Estimate potential conversions from this share
    const conversionRates = {
      twitter: 0.02,
      linkedin: 0.03,
      facebook: 0.01,
      instagram: 0.015,
      hackernews: 0.05,
      reddit: 0.025
    };
    
    const reach = await this.estimateReach(data.platform);
    const conversionRate = conversionRates[data.platform] || 0.01;
    
    return Math.round(reach * conversionRate);
  }

  calculateViralityScore(data) {
    let score = 50; // Base score
    
    // Streak length bonus
    if (data.metadata?.streakLength >= 100) score += 30;
    else if (data.metadata?.streakLength >= 50) score += 20;
    else if (data.metadata?.streakLength >= 30) score += 10;
    
    // Platform bonus
    const platformConfig = this.platforms[data.platform];
    if (platformConfig) {
      score += (platformConfig.viralityScore - 50);
    }
    
    // Content length bonus (optimal: 100-200 chars)
    const contentLength = data.contentLength || 0;
    if (contentLength >= 100 && contentLength <= 200) {
      score += 10;
    }
    
    return Math.min(Math.max(score, 0), 100);
  }

  updateShareMetrics(platform) {
    // Update local metrics for this session
    const key = `shares_${platform}`;
    const currentCount = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, (currentCount + 1).toString());
    
    // Update total shares
    const totalKey = 'total_shares';
    const totalCount = parseInt(localStorage.getItem(totalKey) || '0');
    localStorage.setItem(totalKey, (totalCount + 1).toString());
  }

  // Viral Engine
  async getViralContent() {
    try {
      const response = await this.api.get('/share/viral-content');
      return response.data.content;
    } catch (error) {
      return [];
    }
  }

  async getShareLeaderboard(timeframe = 'weekly') {
    try {
      const response = await this.api.get(`/share/leaderboard?timeframe=${timeframe}`);
      return response.data.leaderboard;
    } catch (error) {
      return [];
    }
  }

  // Embed Generation
  async generateEmbedCode(streakData, style = 'modern') {
    try {
      const response = await this.api.post('/share/embed', {
        streakId: streakData.id,
        style,
        options: {
          showStats: true,
          interactive: true,
          theme: 'dark'
        }
      });
      
      return response.data.embedCode;
      
    } catch (error) {
      console.error('[Social Sharing] Failed to generate embed code:', error);
      
      // Fallback embed code
      return `
<div class="touchgrass-embed" data-streak="${streakData.id}" data-style="${style}">
  <a href="https://touchgrass.now/share/${streakData.id}" target="_blank">
    <strong>${streakData.currentStreak}-day TouchGrass Streak</strong>
  </a>
  <script async src="https://touchgrass.now/embed.js"></script>
</div>`;
    }
  }

  async generateQRCode(streakData, options = {}) {
    try {
      const response = await this.api.post('/share/qr-code', {
        streakId: streakData.id,
        url: await this.generateTrackingUrl(streakData, 'qr'),
        options: {
          size: options.size || 300,
          color: options.color || '#22c55e',
          backgroundColor: options.backgroundColor || '#ffffff',
          includeLogo: true
        }
      });
      
      return response.data.qrCodeUrl;
      
    } catch (error) {
      console.error('[Social Sharing] Failed to generate QR code:', error);
      
      // Fallback to external service
      const url = encodeURIComponent(await this.generateTrackingUrl(streakData, 'qr'));
      return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${url}&color=22c55e`;
    }
  }

  // Utility Methods
  generateShareId() {
    return `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  validateStreakData(streakData) {
    if (!streakData || !streakData.id || !streakData.currentStreak) {
      throw new Error('Invalid streak data');
    }
    
    if (streakData.currentStreak < 1) {
      throw new Error('Streak must be at least 1 day');
    }
  }

  getCurrentUserId() {
    try {
      const token = localStorage.getItem('touchgrass_access_token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  getUserTier() {
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    return userData.subscription?.plan || 'free';
  }

  async urlToFile(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], 'streak-share.png', { type: 'image/png' });
  }

  async uploadToTempStorage(imageUrl) {
    // Upload to temporary storage for app sharing
    try {
      const response = await this.api.post('/share/upload-temp', {
        imageUrl,
        expiresIn: 3600 // 1 hour
      });
      
      return response.data.tempUrl;
      
    } catch (error) {
      // Fallback to data URL
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    }
  }

  // Analytics Collection
  startAnalyticsCollection() {
    // Collect share analytics every 5 minutes
    setInterval(async () => {
      await this.collectShareAnalytics();
    }, 5 * 60 * 1000);
  }

  async collectShareAnalytics() {
    try {
      const analytics = {
        totalShares: await this.getTotalShares(),
        platformDistribution: await this.getPlatformDistribution(),
        averageVirality: await this.getAverageVirality(),
        topPerformers: await this.getTopPerformingShares(),
        timestamp: new Date().toISOString()
      };
      
      await this.api.post('/analytics/share-metrics', analytics);
      
    } catch (error) {
      console.warn('[Social Sharing] Failed to collect analytics:', error);
    }
  }

  async loadPerformanceData() {
    try {
      const response = await this.api.get('/analytics/share-performance');
      this.performanceData = response.data;
    } catch (error) {
      this.performanceData = {};
    }
  }

  async getTotalShares() {
    try {
      const response = await this.api.get('/analytics/total-shares');
      return response.data.total;
    } catch (error) {
      return 0;
    }
  }

  async getPlatformDistribution() {
    try {
      const response = await this.api.get('/analytics/platform-distribution');
      return response.data.distribution;
    } catch (error) {
      return {};
    }
  }

  async getAverageVirality() {
    try {
      const response = await this.api.get('/analytics/average-virality');
      return response.data.average;
    } catch (error) {
      return 50;
    }
  }

  async getTopPerformingShares() {
    try {
      const response = await this.api.get('/analytics/top-shares');
      return response.data.shares;
    } catch (error) {
      return [];
    }
  }

  // UI Methods
  showShareSuccess(platform, streakData) {
    // Implementation depends on UI framework
    console.log(`Successfully shared to ${platform}!`);
    
    // Show success notification
    const notification = {
      title: 'Shared Successfully!',
      message: `Your ${streakData.currentStreak}-day streak is now on ${this.platforms[platform]?.name || platform}`,
      type: 'success',
      duration: 5000
    };
    
    this.showNotification(notification);
    
    // Trigger confetti for high streaks
    if (streakData.currentStreak >= 100) {
      this.triggerConfetti();
    }
  }

  handleShareError(error, platform) {
    console.error(`Share to ${platform} failed:`, error);
    
    // Show error notification
    const notification = {
      title: 'Share Failed',
      message: `Could not share to ${this.platforms[platform]?.name || platform}. Please try again.`,
      type: 'error',
      duration: 5000
    };
    
    this.showNotification(notification);
  }

  showNotification(notification) {
    // Implementation depends on UI framework
    console.log(`[${notification.type.toUpperCase()}] ${notification.title}: ${notification.message}`);
  }

  triggerConfetti() {
    // Trigger confetti animation
    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }
}

// Supporting Classes
class SharingAnalytics {
  trackShare(data) {
    // Send to multiple analytics services
    
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'share', {
        method: data.platform,
        content_type: 'streak',
        item_id: data.streakId
      });
    }
    
    // Mixpanel
    if (window.mixpanel) {
      window.mixpanel.track('Social Share', {
        platform: data.platform,
        streak_length: data.metadata?.streakLength,
        virality_score: data.businessMetrics?.viralityScore
      });
    }
    
    // Segment
    if (window.analytics) {
      window.analytics.track('Social Share', {
        platform: data.platform,
        ...data
      });
    }
  }

  trackShareFailure(data) {
    if (window.analytics) {
      window.analytics.track('Social Share Failed', data);
    }
  }
}

class ContentGenerator {
  determineBestTemplate(streakData, platform) {
    // Advanced template selection algorithm
    const factors = {
      streakLength: streakData.currentStreak,
      consistency: streakData.consistencyScore || 0,
      platform: platform,
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay()
    };
    
    // Scoring system
    let scores = {
      basic: 10,
      motivational: 8,
      competitive: 6,
      humorous: 7,
      professional: 5
    };
    
    // Adjust scores based on factors
    if (factors.streakLength >= 100) scores.competitive += 20;
    if (factors.streakLength >= 30) scores.motivational += 10;
    if (factors.consistency >= 90) scores.professional += 15;
    if (platform === 'linkedin') scores.professional += 20;
    if (platform === 'twitter' && factors.streakLength >= 50) scores.competitive += 15;
    if (platform === 'instagram') scores.humorous += 15;
    if (factors.timeOfDay >= 9 && factors.timeOfDay <= 17) scores.professional += 10;
    if (factors.dayOfWeek >= 5) scores.humorous += 10; // Weekend
    
    // Return highest scoring template
    return Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }
}

class ViralEngine {
  constructor() {
    this.shares = new Map();
    this.viralThresholds = {
      low: 10,
      medium: 50,
      high: 100
    };
  }

  recordShare(streakId, platform) {
    if (!this.shares.has(streakId)) {
      this.shares.set(streakId, {
        count: 0,
        platforms: new Set(),
        firstShare: Date.now(),
        lastShare: Date.now()
      });
    }
    
    const streakData = this.shares.get(streakId);
    streakData.count++;
    streakData.platforms.add(platform);
    streakData.lastShare = Date.now();
    
    // Check if streak is going viral
    if (streakData.count >= this.viralThresholds.high) {
      this.triggerViralEvent(streakId, streakData);
    }
  }

  triggerViralEvent(streakId, streakData) {
    // Notify system that a streak is going viral
    console.log(`[Viral Engine] Streak ${streakId} is going viral!`);
    
    // Could trigger:
    // - Special notifications to user
    // - Featured placement on leaderboard
    // - Bonus rewards
    // - Email to community
  }

  getViralityScore(streakId) {
    const data = this.shares.get(streakId);
    if (!data) return 0;
    
    let score = data.count * 2;
    score += data.platforms.size * 10;
    
    // Time decay
    const hoursSinceFirst = (Date.now() - data.firstShare) / (1000 * 60 * 60);
    if (hoursSinceFirst < 24) {
      score *= 2; // Bonus for rapid sharing
    }
    
    return Math.min(score, 100);
  }
}

// Export singleton instance
export default new PremiumSocialSharingService();