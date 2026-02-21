import RealChallengeService from './realChallengeService';

/**
 * Unified Challenge Service
 * Provides a unified interface for challenge operations
 * Wraps RealChallengeService which properly handles backend data transformation
 */

class UnifiedChallengeService {
  constructor() {
    this.userEmail = null;
    this.userId = null;
  }

  /**
   * Initialize the service with user credentials
   */
  init(email, id) {
    this.userEmail = email;
    this.userId = id;
    console.log('UnifiedChallengeService initialized for:', email);
  }

  /**
   * Get available challenges (Discover tab)
   */
  async getAvailableChallenges() {
    try {
      const result = await RealChallengeService.getAvailableChallenges();
      return result.challenges || [];
    } catch (error) {
      console.error('Error fetching available challenges:', error);
      return [];
    }
  }

  /**
   * Get user's active challenges (My Challenges tab)
   */
  async getMyChallenges() {
    try {
      const result = await RealChallengeService.getMyChallenges();
      return result;
    } catch (error) {
      console.error('Error fetching user challenges:', error);
      return {
        success: false,
        challenges: [],
        error: error.message
      };
    }
  }

  /**
   * Get daily check-ins for a specific date
   */
  async getDailyCheckins(date) {
    try {
      const result = await RealChallengeService.getDailyCheckins(date);
      return result;
    } catch (error) {
      console.error('Error fetching daily check-ins:', error);
      return {
        success: false,
        data: [],
        error: error.message
      };
    }
  }

  /**
   * Join a challenge
   */
  async joinChallenge(challengeId) {
    try {
      const result = await RealChallengeService.joinChallenge(challengeId);
      return result;
    } catch (error) {
      console.error('Error joining challenge:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verify progress for a challenge
   */
  async verifyProgress(challengeId, verificationData) {
    try {
      const result = await RealChallengeService.verifyProgress(challengeId, this.userId, verificationData);
      return result;
    } catch (error) {
      console.error('Error verifying progress:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create a new challenge
   */
  async createChallenge(challengeData) {
    try {
      const result = await RealChallengeService.createChallenge(challengeData);
      return result;
    } catch (error) {
      console.error('Error creating challenge:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
const unifiedChallengeService = new UnifiedChallengeService();
export default unifiedChallengeService;
