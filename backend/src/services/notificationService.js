const Notification = require('../models/Notification');
const EmailService = require('./emailService');

class NotificationService {
  constructor() {
    this.emailService = new EmailService();
  }

  /**
   * Send notification to user
   * @param {String} userId - User ID
   * @param {Object} notificationData - Notification data
   * @returns {Promise<Notification>} Saved notification
   */
  async sendNotification(userId, notificationData) {
    try {
      const {
        type,
        title,
        message,
        data = {},
        priority = 'medium',
        channels = ['in_app'],
        expiresAt = null
      } = notificationData;

      // Create notification
      const notification = new Notification({
        user: userId,
        type,
        title,
        message,
        data,
        priority,
        channels,
        expiresAt,
        read: false
      });

      await notification.save();

      // Send email if configured
      if (channels.includes('email')) {
        // We could add email sending logic here if needed
        // For now, we'll just save the notification to database
      }

      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  /**
   * Get user notifications
   * @param {String} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Notification[]>} User notifications
   */
  async getUserNotifications(userId, options = {}) {
    const {
      limit = 20,
      page = 1,
      read = false
    } = options;

    const query = { user: userId };
    if (read !== null) {
      query.read = read;
    }

    const skip = (page - 1) * limit;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Notification.countDocuments(query);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Mark notification as read
   * @param {String} notificationId - Notification ID
   * @param {String} userId - User ID
   * @returns {Promise<Notification>} Updated notification
   */
  async markAsRead(notificationId, userId) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { 
        read: true,
        readAt: new Date(),
        status: 'read'
      },
      { new: true }
    );
  }

  /**
   * Mark all notifications as read
   * @param {String} userId - User ID
   * @returns {Promise<Number>} Number of updated notifications
   */
  async markAllAsRead(userId) {
    const result = await Notification.updateMany(
      { user: userId, read: false },
      { 
        read: true,
        readAt: new Date(),
        status: 'read'
      }
    );

    return result.nModified;
  }

  /**
   * Delete notification
   * @param {String} notificationId - Notification ID
   * @param {String} userId - User ID
   * @returns {Promise<Boolean>} Success status
   */
  async deleteNotification(notificationId, userId) {
    const result = await Notification.deleteOne({
      _id: notificationId,
      user: userId
    });

    return result.deletedCount > 0;
  }

  /**
   * Get unread notification count
   * @param {String} userId - User ID
   * @returns {Promise<Number>} Unread count
   */
  async getUnreadCount(userId) {
    return Notification.countDocuments({
      user: userId,
      read: false
    });
  }

  // Email notification methods (delegates to EmailService)
  async sendWelcomeEmail(user) {
    return this.emailService.sendWelcomeEmail(user);
  }

  async sendStreakReminder(user, streakData) {
    return this.emailService.sendStreakReminder(user, streakData);
  }

  async sendStreakBrokenEmail(user, streakData) {
    return this.emailService.sendStreakBrokenEmail(user, streakData);
  }

  async sendChallengeInvite(user, challenge, inviter) {
    return this.emailService.sendChallengeInvite(user, challenge, inviter);
  }

  async sendAchievementEmail(user, achievement) {
    return this.emailService.sendAchievementEmail(user, achievement);
  }

  async sendWeeklyReport(user, weeklyStats) {
    return this.emailService.sendWeeklyReport(user, weeklyStats);
  }

  async sendPaymentReceipt(user, payment) {
    return this.emailService.sendPaymentReceipt(user, payment);
  }

  async sendPasswordResetEmail(user, resetToken) {
    return this.emailService.sendPasswordResetEmail(user, resetToken);
  }

  async sendSecurityAlert(user, activity) {
    return this.emailService.sendSecurityAlert(user, activity);
  }
}

module.exports = new NotificationService();