import React from 'react';
  
  /**
 * TouchGrass Streak Service - Premium Habit Tracking
 * Enterprise-grade streak management with behavioral analytics
 */

class PremiumStreakService {
  constructor() {
    this.api = window.apiService;
    this.analytics = new StreakAnalytics();
    this.psychologyEngine = new PsychologyEngine();
    this.behaviorAnalytics = new BehaviorAnalytics();
    this.notificationEngine = new NotificationEngine();
    
    // Streak state
    this.currentStreak = null;
    this.streakHistory = [];
    this.achievements = [];
    this.challenges = [];
    this.streakMetrics = {
      totalDays: 0,
      longestStreak: 0,
      consistencyScore: 0,
      averageDuration: 0,
      successRate: 0
    };
    
    // Configuration
    this.config = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      verificationWindow: 24, // hours
      gracePeriod: 2, // hours
      maxFreezeTokens: 3,
      streakMilestones: [7, 30, 100, 365],
      achievementThresholds: {
        consistency: 90,
        duration: 30,
        speed: 10
      }
    };
    
    // Initialize
    this.loadStreakState();
    this.startStreakMonitoring();
    this.initBehaviorTracking();
  }

  // Core Streak Management
  async loadStreakState() {
    try {
      const response = await this.api.get('/streaks/current');
      
      if (response.data.status === 'active') {
        this.currentStreak = response.data.streak;
        this.updateStreakMetrics();
        
        // Start streak monitoring
        this.startStreakCountdown();
        
        // Check for upcoming milestones
        this.checkUpcomingMilestones();
        
        console.log('[Streak Service] Loaded active streak:', this.currentStreak.currentStreak);
      } else {
        console.log('[Streak Service] No active streak');
      }
      
      // Load history
      await this.loadStreakHistory();
      
      // Load achievements
      await this.loadAchievements();
      
    } catch (error) {
      console.error('[Streak Service] Failed to load streak state:', error);
    }
  }

  async createStreak(initialData = {}) {
    try {
      // Business validation
      this.validateStreakCreation(initialData);
      
      // Enhanced streak data
      const streakData = {
        ...initialData,
        metadata: {
          creationSource: this.getCreationSource(),
          deviceId: this.getDeviceId(),
          location: await this.getApproximateLocation(),
          businessContext: {
            userTier: this.getUserTier(),
            referralSource: this.getReferralSource(),
            utmCampaign: this.getUTMCampaign()
          },
          timestamp: new Date().toISOString()
        },
        settings: {
          reminders: true,
          notifications: true,
          publicVisibility: true,
          leaderboardParticipation: true,
          autoVerification: false
        }
      };
      
      // Create streak via API
      const response = await this.api.post('/streaks/create', streakData);
      
      if (response.data.success) {
        this.currentStreak = response.data.streak;
        
        // Update metrics
        this.updateStreakMetrics();
        
        // Start monitoring
        this.startStreakCountdown();
        
        // Track creation
        this.trackStreakEvent('create', this.currentStreak);
        
        // Show onboarding
        this.showStreakOnboarding();
        
        return {
          success: true,
          streak: this.currentStreak,
          nextCheckpoint: this.getNextCheckpoint()
        };
      }
      
      throw new Error('Streak creation failed');
      
    } catch (error) {
      console.error('[Streak Service] Streak creation failed:', error);
      this.handleStreakError('create', error);
      throw error;
    }
  }

  async verifyStreak(verificationData, options = {}) {
    const verificationId = this.generateVerificationId();
    const startTime = Date.now();
    
    try {
      this.setVerificationState('processing');
      
      // Validate verification
      await this.validateVerification(verificationData);
      
      // Enhanced verification data
      const enhancedData = {
        ...verificationData,
        metadata: {
          verificationId,
          method: verificationData.method,
          duration: verificationData.duration || 15,
          location: verificationData.location || await this.getCurrentLocation(),
          deviceInfo: this.getDeviceInfo(),
          timestamp: new Date().toISOString(),
          businessContext: {
            verificationQuality: this.calculateVerificationQuality(verificationData),
            userEngagement: await this.calculateUserEngagement(),
            timeOfDay: new Date().getHours()
          }
        },
        options: {
          skipShame: options.skipShame || false,
          publicShame: options.publicShame || false,
          shareAutomatically: options.shareAutomatically || false
        }
      };
      
      // Process verification
      const response = await this.api.post('/streaks/verify', enhancedData);
      
      if (response.data.success) {
        // Update local state
        this.currentStreak = response.data.streak;
        this.updateStreakMetrics();
        
        // Reset countdown
        this.resetStreakCountdown();
        
        // Track successful verification
        await this.trackVerification({
          verificationId,
          streakId: this.currentStreak.id,
          method: verificationData.method,
          duration: Date.now() - startTime,
          quality: enhancedData.metadata.businessContext.verificationQuality,
          metadata: enhancedData.metadata
        });
        
        // Check for achievements
        await this.checkAchievements();
        
        // Check for milestones
        await this.checkMilestones();
        
        // Show success
        this.showVerificationSuccess(response.data);
        
        // Auto-share if enabled
        if (options.shareAutomatically) {
          await this.autoShareStreak();
        }
        
        return {
          success: true,
          streak: this.currentStreak,
          achievement: response.data.achievement,
          nextCheckpoint: this.getNextCheckpoint()
        };
      }
      
      throw new Error('Verification failed');
      
    } catch (error) {
      // Track failed verification
      await this.trackVerificationFailure({
        verificationId,
        error: error.message,
        duration: Date.now() - startTime,
        method: verificationData.method
      });
      
      this.handleVerificationError(error);
      throw error;
    } finally {
      this.setVerificationState('idle');
    }
  }

  async skipDay(options = {}) {
    try {
      // Check if user can skip
      if (!this.canSkipDay()) {
        throw new Error('Cannot skip day - no freeze tokens available');
      }
      
      const response = await this.api.post('/streaks/skip', {
        reason: options.reason || 'user_skipped',
        metadata: {
          timestamp: new Date().toISOString(),
          skipMethod: options.useFreezeToken ? 'freeze_token' : 'premium_skip',
          businessContext: {
            previousConsistency: this.streakMetrics.consistencyScore,
            streakValue: this.calculateStreakValue()
          }
        }
      });
      
      if (response.data.success) {
        // Update local state
        this.currentStreak = response.data.streak;
        
        // Update freeze tokens
        if (options.useFreezeToken) {
          this.decrementFreezeTokens();
        }
        
        // Reset countdown
        this.resetStreakCountdown();
        
        // Track skip
        this.trackStreakEvent('skip', {
          streakId: this.currentStreak.id,
          reason: options.reason,
          usedFreezeToken: options.useFreezeToken
        });
        
        return {
          success: true,
          streak: this.currentStreak,
          remainingFreezeTokens: this.getFreezeTokens(),
          nextCheckpoint: this.getNextCheckpoint()
        };
      }
      
      throw new Error('Skip failed');
      
    } catch (error) {
      console.error('[Streak Service] Day skip failed:', error);
      this.handleStreakError('skip', error);
      throw error;
    }
  }

  async breakStreak(reason = 'manual', options = {}) {
    try {
      const breakData = {
        reason,
        metadata: {
          brokenAt: new Date().toISOString(),
          streakLength: this.currentStreak?.currentStreak || 0,
          businessContext: {
            streakValue: this.calculateStreakValue(),
            emotionalImpact: await this.assessEmotionalImpact(),
            recoveryPotential: this.calculateRecoveryPotential()
          }
        },
        options: {
          showBreakModal: options.showModal !== false,
          offerRestore: options.offerRestore !== false,
          trackAnalytics: true
        }
      };
      
      const response = await this.api.post('/streaks/break', breakData);
      
      if (response.data.success) {
        // Update local state
        this.currentStreak = null;
        this.streakHistory.unshift(response.data.brokenStreak);
        
        // Stop monitoring
        this.stopStreakCountdown();
        
        // Track break
        this.trackStreakEvent('break', breakData);
        
        // Show break modal
        if (options.showModal !== false) {
          this.showStreakBreakModal(breakData);
        }
        
        // Offer restore if applicable
        if (options.offerRestore !== false && this.shouldOfferRestore(breakData)) {
          this.showRestoreOffer(breakData);
        }
        
        return {
          success: true,
          brokenStreak: response.data.brokenStreak,
          recoveryOptions: response.data.recoveryOptions
        };
      }
      
      throw new Error('Streak break failed');
      
    } catch (error) {
      console.error('[Streak Service] Streak break failed:', error);
      throw error;
    }
  }

  async restoreStreak(paymentData = null, options = {}) {
    try {
      const restoreData = {
        streakId: this.streakHistory[0]?.id,
        paymentData,
        metadata: {
          restoredAt: new Date().toISOString(),
          originalLength: this.streakHistory[0]?.currentStreak || 0,
          businessContext: {
            restorationReason: options.reason,
            paymentAmount: paymentData?.amount,
            userLifetimeValue: await this.calculateUserLTV()
          }
        }
      };
      
      const response = await this.api.post('/streaks/restore', restoreData);
      
      if (response.data.success) {
        // Update local state
        this.currentStreak = response.data.streak;
        
        // Remove from history
        this.streakHistory.shift();
        
        // Start monitoring
        this.startStreakCountdown();
        
        // Track restoration
        this.trackStreakEvent('restore', restoreData);
        
        // Show success
        this.showRestorationSuccess(response.data);
        
        return {
          success: true,
          streak: this.currentStreak,
          restorationCost: response.data.cost,
          nextCheckpoint: this.getNextCheckpoint()
        };
      }
      
      throw new Error('Streak restoration failed');
      
    } catch (error) {
      console.error('[Streak Service] Streak restoration failed:', error);
      throw error;
    }
  }

  // Verification Methods
  async verifyWithPhoto(photoFile, options = {}) {
    try {
      // Validate photo
      await this.validatePhoto(photoFile);
      
      // Process photo
      const processedPhoto = await this.processPhoto(photoFile);
      
      // Create verification data
      const verificationData = {
        method: 'photo',
        photo: processedPhoto,
        duration: options.duration || 15,
        location: options.location || await this.getCurrentLocation(),
        notes: options.notes,
        metadata: {
          photoQuality: await this.assessPhotoQuality(processedPhoto),
          containsNature: await this.detectNature(processedPhoto),
          verificationConfidence: this.calculateVerificationConfidence(processedPhoto)
        }
      };
      
      return await this.verifyStreak(verificationData, options);
      
    } catch (error) {
      console.error('[Streak Service] Photo verification failed:', error);
      throw error;
    }
  }

  async verifyWithLocation(locationData, options = {}) {
    try {
      // Validate location
      await this.validateLocation(locationData);
      
      const verificationData = {
        method: 'location',
        location: locationData,
        duration: options.duration || 15,
        metadata: {
          accuracy: locationData.accuracy || 0,
          distanceFromHome: await this.calculateDistanceFromHome(locationData),
          locationType: await this.classifyLocation(locationData)
        }
      };
      
      return await this.verifyStreak(verificationData, options);
      
    } catch (error) {
      console.error('[Streak Service] Location verification failed:', error);
      throw error;
    }
  }

  async acceptShame(shameMessage, options = {}) {
    try {
      // Validate shame message
      if (!shameMessage || shameMessage.length < 10) {
        throw new Error('Shame message must be at least 10 characters');
      }
      
      const verificationData = {
        method: 'shame',
        shameMessage,
        options: {
          publicShame: options.public !== false,
          shareToFeed: options.shareToFeed || false,
          notificationLevel: options.notificationLevel || 'medium'
        },
        metadata: {
          shameSeverity: this.calculateShameSeverity(shameMessage),
          emotionalImpact: await this.assessEmotionalImpact(),
          socialConsequences: options.public !== false ? 'high' : 'low'
        }
      };
      
      return await this.verifyStreak(verificationData, options);
      
    } catch (error) {
      console.error('[Streak Service] Shame acceptance failed:', error);
      throw error;
    }
  }

  // Streak Monitoring
  startStreakMonitoring() {
    // Check streak status every minute
    this.monitoringInterval = setInterval(() => {
      this.checkStreakStatus();
    }, 60 * 1000);
    
    // Update metrics every 5 minutes
    this.metricsInterval = setInterval(() => {
      this.updateStreakMetrics();
    }, 5 * 60 * 1000);
  }

  async checkStreakStatus() {
    if (!this.currentStreak) return;
    
    const now = new Date();
    const checkpoint = new Date(this.currentStreak.nextCheckpoint);
    const timeRemaining = checkpoint - now;
    
    // Update countdown display
    this.updateCountdownDisplay(timeRemaining);
    
    // Check if streak is at risk
    if (timeRemaining < 2 * 60 * 60 * 1000) { // 2 hours remaining
      await this.handleStreakAtRisk(timeRemaining);
    }
    
    // Check if streak is broken
    if (timeRemaining <= 0) {
      await this.handleStreakBroken();
    }
  }

  startStreakCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  stopStreakCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  resetStreakCountdown() {
    this.stopStreakCountdown();
    
    if (this.currentStreak) {
      this.startStreakCountdown();
    }
  }

  updateCountdown() {
    if (!this.currentStreak) return;
    
    const now = new Date();
    const checkpoint = new Date(this.currentStreak.nextCheckpoint);
    const timeRemaining = checkpoint - now;
    
    // Format time remaining
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    // Update display
    this.updateCountdownDisplay(timeRemaining);
    
    // Emit countdown event
    this.emit('countdownUpdate', {
      hours,
      minutes,
      seconds,
      totalSeconds: Math.floor(timeRemaining / 1000)
    });
  }

  // Analytics and Tracking
  async trackStreakEvent(event, data) {
    const analyticsData = {
      event: `streak_${event}`,
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUserId(),
      ...data,
      businessMetrics: {
        streakValue: this.calculateStreakValue(),
        userLifetimeValue: await this.calculateUserLTV(),
        predictedChurn: await this.predictChurnProbability(),
        engagementScore: await this.calculateEngagementScore()
      }
    };
    
    // Send to analytics
    this.analytics.trackStreakEvent(analyticsData);
    
    // Send to backend
    await this.api.post('/analytics/streak-events', analyticsData).catch(() => {
      // Silent fail for analytics
    });
  }

  async trackVerification(data) {
    const analyticsData = {
      event: 'streak_verification',
      ...data,
      businessMetrics: {
        verificationQuality: data.quality,
        userEngagement: await this.calculateUserEngagement(),
        predictedConsistency: await this.predictConsistency()
      }
    };
    
    this.analytics.trackVerification(analyticsData);
    
    await this.api.post('/analytics/verifications', analyticsData).catch(() => {
      // Silent fail
    });
  }

  async trackVerificationFailure(data) {
    const analyticsData = {
      event: 'verification_failed',
      ...data
    };
    
    this.analytics.trackVerificationFailure(analyticsData);
    
    await this.api.post('/analytics/verification-failures', analyticsData).catch(() => {
      // Silent fail
    });
  }

  // Psychology Engine Integration
  async applyPsychologyPrinciples() {
    if (!this.currentStreak) return;
    
    // Loss aversion
    this.applyLossAversion();
    
    // Social proof
    await this.applySocialProof();
    
    // Commitment and consistency
    this.applyCommitmentPrinciple();
    
    // Scarcity
    this.applyScarcityPrinciple();
    
    // Reciprocity
    await this.applyReciprocity();
  }

  applyLossAversion() {
    if (!this.currentStreak) return;
    
    const streakValue = this.calculateStreakValue();
    const potentialLoss = this.calculatePotentialLoss();
    
    // Emit loss aversion event
    this.emit('lossAversionUpdate', {
      streakValue,
      potentialLoss,
      emotionalImpact: potentialLoss * 0.7, // Psychological multiplier
      urgencyLevel: this.calculateUrgencyLevel()
    });
  }

  async applySocialProof() {
    try {
      const socialProofData = await this.getSocialProofData();
      
      this.emit('socialProofUpdate', {
        similarUsers: socialProofData.similarUsers,
        averageStreak: socialProofData.averageStreak,
        topPerformers: socialProofData.topPerformers,
        communityActivity: socialProofData.communityActivity
      });
      
    } catch (error) {
      console.warn('[Streak Service] Failed to get social proof:', error);
    }
  }

  // Achievements and Milestones
  async checkAchievements() {
    if (!this.currentStreak) return;
    
    try {
      const response = await this.api.post('/achievements/check', {
        streakId: this.currentStreak.id,
        currentStreak: this.currentStreak.currentStreak,
        metrics: this.streakMetrics
      });
      
      if (response.data.newAchievements.length > 0) {
        // Add to local state
        this.achievements.push(...response.data.newAchievements);
        
        // Show achievement notifications
        response.data.newAchievements.forEach(achievement => {
          this.showAchievementNotification(achievement);
        });
        
        // Track achievement unlocks
        this.trackAchievementUnlocks(response.data.newAchievements);
      }
      
    } catch (error) {
      console.warn('[Streak Service] Failed to check achievements:', error);
    }
  }

  async checkMilestones() {
    if (!this.currentStreak) return;
    
    const currentDay = this.currentStreak.currentStreak;
    const upcomingMilestone = this.config.streakMilestones.find(m => m > currentDay);
    
    if (upcomingMilestone && currentDay >= upcomingMilestone - 3) {
      // Milestone is approaching
      this.emit('milestoneApproaching', {
        milestone: upcomingMilestone,
        daysRemaining: upcomingMilestone - currentDay,
        estimatedDate: this.calculateMilestoneDate(upcomingMilestone)
      });
    }
    
    if (this.config.streakMilestones.includes(currentDay)) {
      // Reached a milestone
      this.emit('milestoneReached', {
        milestone: currentDay,
        celebrationLevel: this.calculateCelebrationLevel(currentDay)
      });
      
      // Show milestone celebration
      this.showMilestoneCelebration(currentDay);
    }
  }

  checkUpcomingMilestones() {
    if (!this.currentStreak) return;
    
    const currentDay = this.currentStreak.currentStreak;
    const upcomingMilestones = this.config.streakMilestones
      .filter(m => m > currentDay && m <= currentDay + 7); // Next 7 days
    
    if (upcomingMilestones.length > 0) {
      this.emit('upcomingMilestones', {
        milestones: upcomingMilestones,
        daysUntil: upcomingMilestones.map(m => m - currentDay)
      });
    }
  }

  // Utility Methods
  calculateStreakValue() {
    if (!this.currentStreak) return 0;
    
    const baseValue = this.currentStreak.currentStreak * 10; // $10 per day
    const consistencyBonus = this.streakMetrics.consistencyScore * 0.5;
    const achievementBonus = this.achievements.length * 25;
    const socialProofBonus = this.calculateSocialProofBonus();
    
    return baseValue + consistencyBonus + achievementBonus + socialProofBonus;
  }

  calculatePotentialLoss() {
    const streakValue = this.calculateStreakValue();
    return streakValue * 1.5; // Loss aversion multiplier
  }

  calculateUrgencyLevel() {
    if (!this.currentStreak) return 0;
    
    const now = new Date();
    const checkpoint = new Date(this.currentStreak.nextCheckpoint);
    const hoursRemaining = (checkpoint - now) / (1000 * 60 * 60);
    
    if (hoursRemaining <= 1) return 100;
    if (hoursRemaining <= 3) return 75;
    if (hoursRemaining <= 6) return 50;
    if (hoursRemaining <= 12) return 25;
    return 0;
  }

  async calculateUserEngagement() {
    try {
      const response = await this.api.get('/analytics/user-engagement');
      return response.data.score;
    } catch (error) {
      return 50; // Default score
    }
  }

  async predictConsistency() {
    // Predict future consistency based on past behavior
    const history = await this.getVerificationHistory();
    const consistencyScores = history.map(v => v.quality || 50);
    
    if (consistencyScores.length === 0) return 50;
    
    const average = consistencyScores.reduce((a, b) => a + b, 0) / consistencyScores.length;
    
    // Apply trend analysis
    const trend = this.calculateConsistencyTrend(consistencyScores);
    
    return Math.min(100, Math.max(0, average + (trend * 10)));
  }

  calculateConsistencyTrend(scores) {
    if (scores.length < 2) return 0;
    
    const recentScores = scores.slice(-7); // Last 7 verifications
    const firstHalf = recentScores.slice(0, Math.floor(recentScores.length / 2));
    const secondHalf = recentScores.slice(Math.floor(recentScores.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    return secondAvg - firstAvg;
  }

  async calculateUserLTV() {
    try {
      const response = await this.api.get('/analytics/user-ltv');
      return response.data.ltv;
    } catch (error) {
      return 0;
    }
  }

  async predictChurnProbability() {
    try {
      const response = await this.api.get('/analytics/churn-prediction');
      return response.data.probability;
    } catch (error) {
      return 0.5; // Default 50% chance
    }
  }

  async calculateEngagementScore() {
    try {
      const response = await this.api.get('/analytics/engagement-score');
      return response.data.score;
    } catch (error) {
      return 50;
    }
  }

  // Validation Methods
  validateStreakCreation(data) {
    const errors = [];
    
    if (!data.name || data.name.length < 3) {
      errors.push('Streak name must be at least 3 characters');
    }
    
    if (data.goal && data.goal.length > 200) {
      errors.push('Goal description too long');
    }
    
    if (errors.length > 0) {
      throw new StreakValidationError('Streak creation validation failed', errors);
    }
  }

  async validateVerification(data) {
    const errors = [];
    
    if (!data.method) {
      errors.push('Verification method required');
    }
    
    if (data.method === 'photo' && !data.photo) {
      errors.push('Photo required for photo verification');
    }
    
    if (data.method === 'location' && !data.location) {
      errors.push('Location data required for location verification');
    }
    
    if (data.method === 'shame' && (!data.shameMessage || data.shameMessage.length < 10)) {
      errors.push('Shame message must be at least 10 characters');
    }
    
    // Check for duplicate verification today
    const today = new Date().toDateString();
    const lastVerification = this.getLastVerificationDate();
    
    if (lastVerification && lastVerification.toDateString() === today) {
      errors.push('Already verified today');
    }
    
    if (errors.length > 0) {
      throw new StreakValidationError('Verification validation failed', errors);
    }
  }

  async validatePhoto(photoFile) {
    const errors = [];
    
    // Check file size (max 10MB)
    if (photoFile.size > 10 * 1024 * 1024) {
      errors.push('Photo too large (max 10MB)');
    }
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(photoFile.type)) {
      errors.push('Invalid image format (JPEG, PNG, or WebP only)');
    }
    
    // Check dimensions (min 300x300)
    const dimensions = await this.getImageDimensions(photoFile);
    if (dimensions.width < 300 || dimensions.height < 300) {
      errors.push('Image too small (min 300x300 pixels)');
    }
    
    if (errors.length > 0) {
      throw new StreakValidationError('Photo validation failed', errors);
    }
  }

  async validateLocation(locationData) {
    const errors = [];
    
    if (!locationData.latitude || !locationData.longitude) {
      errors.push('Invalid location coordinates');
    }
    
    if (locationData.accuracy && locationData.accuracy > 100) {
      errors.push('Location accuracy too low');
    }
    
    // Check if location is indoors (based on accuracy)
    if (locationData.accuracy && locationData.accuracy > 50) {
      errors.push('Location appears to be indoors');
    }
    
    if (errors.length > 0) {
      throw new StreakValidationError('Location validation failed', errors);
    }
  }

  // State Management
  updateStreakMetrics() {
    if (!this.currentStreak) return;
    
    this.streakMetrics = {
      totalDays: this.currentStreak.totalDays || 0,
      longestStreak: this.currentStreak.longestStreak || 0,
      consistencyScore: this.currentStreak.consistencyScore || 0,
      averageDuration: this.calculateAverageDuration(),
      successRate: this.calculateSuccessRate(),
      currentStreak: this.currentStreak.currentStreak,
      streakAge: this.calculateStreakAge()
    };
    
    // Emit metrics update
    this.emit('metricsUpdate', this.streakMetrics);
  }

  calculateAverageDuration() {
    if (!this.currentStreak?.history?.length) return 0;
    
    const durations = this.currentStreak.history
      .filter(v => v.duration)
      .map(v => v.duration);
    
    if (durations.length === 0) return 0;
    
    return durations.reduce((a, b) => a + b, 0) / durations.length;
  }

  calculateSuccessRate() {
    if (!this.currentStreak?.history?.length) return 0;
    
    const totalDays = this.currentStreak.history.length;
    const successfulDays = this.currentStreak.history.filter(v => v.verified).length;
    
    return (successfulDays / totalDays) * 100;
  }

  calculateStreakAge() {
    if (!this.currentStreak?.startDate) return 0;
    
    const startDate = new Date(this.currentStreak.startDate);
    const now = new Date();
    const diffTime = Math.abs(now - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Event Handling
  async handleStreakAtRisk(timeRemaining) {
    const hoursRemaining = timeRemaining / (1000 * 60 * 60);
    
    // Send notifications based on urgency
    if (hoursRemaining <= 1) {
      await this.sendUrgentNotification();
    } else if (hoursRemaining <= 3) {
      await this.sendWarningNotification();
    } else if (hoursRemaining <= 6) {
      await this.sendReminderNotification();
    }
    
    // Update UI
    this.emit('streakAtRisk', {
      hoursRemaining,
      urgencyLevel: this.calculateUrgencyLevel(),
      suggestedActions: this.getSuggestedActions()
    });
  }

  async handleStreakBroken() {
    // Streak is broken
    await this.breakStreak('time_expired', {
      showModal: true,
      offerRestore: true
    });
    
    // Send break notification
    await this.sendBreakNotification();
  }

  // UI Methods (to be implemented by UI layer)
  showStreakOnboarding() {
    console.log('[Streak Service] Show streak onboarding');
    // Implementation depends on UI framework
  }

  showVerificationSuccess(data) {
    console.log('[Streak Service] Show verification success:', data);
    // Implementation depends on UI framework
  }

  showStreakBreakModal(data) {
    console.log('[Streak Service] Show streak break modal:', data);
    // Implementation depends on UI framework
  }

  showRestoreOffer(data) {
    console.log('[Streak Service] Show restore offer:', data);
    // Implementation depends on UI framework
  }

  showRestorationSuccess(data) {
    console.log('[Streak Service] Show restoration success:', data);
    // Implementation depends on UI framework
  }

  showAchievementNotification(achievement) {
    console.log('[Streak Service] Show achievement:', achievement);
    // Implementation depends on UI framework
  }

  showMilestoneCelebration(milestone) {
    console.log('[Streak Service] Celebrate milestone:', milestone);
    // Implementation depends on UI framework
  }

  updateCountdownDisplay(timeRemaining) {
    // Update UI countdown
    // Implementation depends on UI framework
  }

  setVerificationState(state) {
    // Update verification UI state
    // Implementation depends on UI framework
  }

  // Event System
  emit(event, data) {
    // Implementation for event emission
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent(`streak:${event}`, { detail: data }));
    }
  }

  // Helper Methods
  generateVerificationId() {
    return `verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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

  getDeviceId() {
    return localStorage.getItem('device_id') || 'unknown';
  }

  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`
    };
  }

  getCreationSource() {
    return window.location.pathname.split('/').pop() || 'dashboard';
  }

  getReferralSource() {
    const params = new URLSearchParams(window.location.search);
    return params.get('ref') || 'direct';
  }

  getUTMCampaign() {
    const params = new URLSearchParams(window.location.search);
    return params.get('utm_campaign') || 'organic';
  }

  getNextCheckpoint() {
    if (!this.currentStreak) return null;
    return new Date(this.currentStreak.nextCheckpoint);
  }

  getLastVerificationDate() {
    if (!this.currentStreak?.history?.length) return null;
    
    const lastVerification = this.currentStreak.history
      .filter(v => v.verified)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    
    return lastVerification ? new Date(lastVerification.date) : null;
  }

  canSkipDay() {
    const freezeTokens = this.getFreezeTokens();
    const userTier = this.getUserTier();
    
    return freezeTokens > 0 || userTier === 'premium' || userTier === 'elite';
  }

  getFreezeTokens() {
    return parseInt(localStorage.getItem('freeze_tokens') || '0');
  }

  decrementFreezeTokens() {
    const currentTokens = this.getFreezeTokens();
    if (currentTokens > 0) {
      localStorage.setItem('freeze_tokens', (currentTokens - 1).toString());
    }
  }

  shouldOfferRestore(breakData) {
    const streakLength = breakData.metadata.streakLength;
    const userTier = this.getUserTier();
    
    // Offer restore for streaks longer than 7 days, or any streak for premium users
    return streakLength >= 7 || userTier !== 'free';
  }

  // Placeholder methods for external services
  async getApproximateLocation() {
    return {
      latitude: 0,
      longitude: 0,
      accuracy: 0
    };
  }

  async getCurrentLocation() {
    return {
      latitude: 0,
      longitude: 0,
      accuracy: 0
    };
  }

  async calculateDistanceFromHome(location) {
    return 0;
  }

  async classifyLocation(location) {
    return 'unknown';
  }

  async getSocialProofData() {
    return {
      similarUsers: 0,
      averageStreak: 0,
      topPerformers: [],
      communityActivity: 0
    };
  }

  async getVerificationHistory() {
    return [];
  }

  async calculateVerificationQuality(verificationData) {
    return 80;
  }

  async assessPhotoQuality(photo) {
    return 85;
  }

  async detectNature(photo) {
    return true;
  }

  calculateVerificationConfidence(photo) {
    return 90;
  }

  calculateShameSeverity(shameMessage) {
    const length = shameMessage.length;
    const containsKeywords = ['fail', 'lazy', 'bad', 'sorry'].some(keyword => 
      shameMessage.toLowerCase().includes(keyword)
    );
    
    return length > 50 && containsKeywords ? 'high' : 'medium';
  }

  async assessEmotionalImpact() {
    return 'medium';
  }

  calculateRecoveryPotential() {
    return 75;
  }

  calculateSocialProofBonus() {
    return 0;
  }

  calculateCelebrationLevel(milestone) {
    if (milestone >= 365) return 'epic';
    if (milestone >= 100) return 'grand';
    if (milestone >= 30) return 'big';
    return 'small';
  }

  calculateMilestoneDate(targetDay) {
    if (!this.currentStreak) return null;
    
    const currentDay = this.currentStreak.currentStreak;
    const daysNeeded = targetDay - currentDay;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysNeeded);
    
    return targetDate;
  }

  getSuggestedActions() {
    return ['verify_now', 'use_freeze_token', 'set_reminder'];
  }

  async sendUrgentNotification() {
    // Send urgent notification
  }

  async sendWarningNotification() {
    // Send warning notification
  }

  async sendReminderNotification() {
    // Send reminder notification
  }

  async sendBreakNotification() {
    // Send break notification
  }

  async autoShareStreak() {
    // Auto-share streak to social media
  }

  async getImageDimensions(file) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      img.src = URL.createObjectURL(file);
    });
  }

  async processPhoto(photoFile) {
    // Process photo (resize, compress, etc.)
    return photoFile;
  }

  initBehaviorTracking() {
    // Initialize behavior tracking
  }
}

// Supporting Classes
class StreakAnalytics {
  trackStreakEvent(data) {
    // Send to analytics services
    
    if (window.gtag) {
      window.gtag('event', data.event, {
        streak_length: data.streak?.currentStreak,
        ...data.businessMetrics
      });
    }
    
    if (window.mixpanel) {
      window.mixpanel.track(data.event, data);
    }
    
    if (window.analytics) {
      window.analytics.track(data.event, data);
    }
  }

  trackVerification(data) {
    if (window.analytics) {
      window.analytics.track('verification_completed', data);
    }
  }

  trackVerificationFailure(data) {
    if (window.analytics) {
      window.analytics.track('verification_failed', data);
    }
  }

  trackAchievementUnlocks(achievements) {
    if (window.analytics) {
      achievements.forEach(achievement => {
        window.analytics.track('achievement_unlocked', achievement);
      });
    }
  }
}

class PsychologyEngine {
  applyLossAversion(streakValue) {
    // Apply loss aversion principles
  }

  applySocialProof(socialData) {
    // Apply social proof principles
  }

  applyCommitmentPrinciple() {
    // Apply commitment and consistency principles
  }

  applyScarcityPrinciple() {
    // Apply scarcity principles
  }

  applyReciprocity() {
    // Apply reciprocity principles
  }
}

class BehaviorAnalytics {
  trackUserBehavior(data) {
    // Track user behavior patterns
  }

  predictBehavior(data) {
    // Predict future behavior
  }

  generateInsights(data) {
    // Generate behavioral insights
  }
}

class NotificationEngine {
  sendNotification(data) {
    // Send notification
  }

  scheduleNotification(data) {
    // Schedule notification
  }

  cancelNotification(id) {
    // Cancel notification
  }
}

class StreakValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = 'StreakValidationError';
    this.errors = errors;
  }
}

// Export singleton instance
export default new PremiumStreakService();