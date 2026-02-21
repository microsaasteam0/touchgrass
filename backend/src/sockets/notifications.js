const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Notification = require('../models/Notification');
const Streak = require('../models/Streak');
const Challenge = require('../models/Challenge');
const { ERROR_CODES, SOCKET_EVENTS } = require('../config/constants');

/**
 * Notification Socket Handler
 * Real-time notifications for streaks, challenges, achievements, etc.
 */

class NotificationSocketHandler {
  constructor(io) {
    this.io = io;
    this.userSockets = new Map(); // userId -> socketId
    this.notificationPreferences = new Map(); // userId -> preferences cache
    
    this.initialize();
  }

  /**
   * Initialize Socket.IO namespace and middleware
   */
  initialize() {
    // Notification namespace
    this.notificationNamespace = this.io.of('/notifications');
    
    // Authentication middleware
    this.notificationNamespace.use(this.authenticateSocket.bind(this));
    
    // Connection handler
    this.notificationNamespace.on('connection', this.handleConnection.bind(this));
    
    console.log('Notification Socket Handler initialized');
  }

  /**
   * Authenticate socket connection
   * Handles both Supabase JWTs and custom JWT tokens
   */
  async authenticateSocket(socket, next) {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication token required'));
      }

      // Try to decode as Supabase token first
      const decoded = jwt.decode(token, { complete: true });
      
      let user;
      
      if (decoded && decoded.payload) {
        // This looks like a Supabase token
        const email = decoded.payload.email || decoded.payload.user_metadata?.email;
        const supabaseId = decoded.payload.sub;

        // Check if token is expired
        if (decoded.payload.exp && decoded.payload.exp < Math.floor(Date.now() / 1000)) {
          return next(new Error('Token expired'));
        }

        // Find user by email or supabaseId
        if (email || supabaseId) {
          user = await User.findOne({
            $or: [
              { email },
              { supabaseId }
            ]
          }).select('_id username displayName preferences');
        }
      } else {
        // Fallback: try to verify as custom JWT
        try {
          const customDecoded = jwt.verify(token, process.env.JWT_SECRET);
          user = await User.findById(customDecoded.userId).select('_id username displayName preferences');
        } catch (verifyError) {
          console.error('Token verification failed:', verifyError.message);
        }
      }
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id;
      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  }

  /**
   * Handle new socket connection
   */
  async handleConnection(socket) {
    console.log(`Notification socket connected: ${socket.userId} (${socket.id})`);
    
    // Track user socket
    this.userSockets.set(socket.userId.toString(), socket.id);
    
    // Cache user preferences
    this.notificationPreferences.set(socket.userId.toString(), socket.user.preferences?.notifications || {});
    
    // Join user's personal room
    socket.join(`notifications:${socket.userId}`);
    
    // Send pending notifications
    await this.sendPendingNotifications(socket);
    
    // Socket event handlers
    this.setupEventHandlers(socket);
    
    // Handle disconnection
    socket.on('disconnect', () => this.handleDisconnect(socket));
    socket.on('error', (error) => this.handleError(socket, error));
  }

  /**
   * Setup socket event handlers
   */
  setupEventHandlers(socket) {
    // Notification actions
    socket.on(SOCKET_EVENTS.NOTIFICATION_READ, this.handleNotificationRead.bind(this, socket));
    socket.on(SOCKET_EVENTS.NOTIFICATION_DISMISS, this.handleNotificationDismiss.bind(this, socket));
    socket.on(SOCKET_EVENTS.NOTIFICATION_CLICKED, this.handleNotificationClicked.bind(this, socket));
    
    // Preference updates
    socket.on(SOCKET_EVENTS.UPDATE_NOTIFICATION_PREFS, this.handleUpdatePreferences.bind(this, socket));
    
    // Request notification history
    socket.on(SOCKET_EVENTS.GET_NOTIFICATIONS, this.handleGetNotifications.bind(this, socket));
    
    // Mark all as read
    socket.on(SOCKET_EVENTS.MARK_ALL_READ, this.handleMarkAllRead.bind(this, socket));
    
    // Clear all notifications
    socket.on(SOCKET_EVENTS.CLEAR_ALL_NOTIFICATIONS, this.handleClearAllNotifications.bind(this, socket));
  }

  /**
   * Send pending notifications to newly connected user
   */
  async sendPendingNotifications(socket) {
    try {
      // Get unread notifications from last 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const notifications = await Notification.find({
        userId: socket.userId,
        read: false,
        createdAt: { $gte: oneDayAgo }
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

      // Send each notification
      for (const notification of notifications) {
        if (this.shouldSendNotification(socket.userId, notification.type)) {
          socket.emit(SOCKET_EVENTS.NEW_NOTIFICATION, notification);
        }
      }

      // Send notification count
      const unreadCount = await Notification.countDocuments({
        userId: socket.userId,
        read: false
      });

      socket.emit(SOCKET_EVENTS.NOTIFICATION_COUNT, { count: unreadCount });

    } catch (error) {
      console.error('Error sending pending notifications:', error);
    }
  }

  /**
   * Create and send a notification
   */
  async createNotification(userId, notificationData) {
    try {
      const {
        type,
        title,
        message,
        data = {},
        priority = 'normal',
        expiresAt = null
      } = notificationData;

      // Check if user wants this type of notification
      if (!this.shouldSendNotification(userId, type)) {
        return null;
      }

      // Create notification
      const notification = new Notification({
        userId,
        type,
        title,
        message,
        data,
        priority,
        expiresAt,
        read: false,
        clicked: false
      });

      await notification.save();

      // Send real-time notification if user is online
      const socketId = this.userSockets.get(userId.toString());
      if (socketId) {
        this.notificationNamespace.to(socketId).emit(SOCKET_EVENTS.NEW_NOTIFICATION, notification);
        
        // Update notification count
        this.updateNotificationCount(userId);
      }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  /**
   * Create streak-related notifications
   */
  async createStreakNotification(userId, streak, notificationType) {
    const user = await User.findById(userId).select('displayName');
    if (!user) return;

    const notifications = {
      streak_reminder: {
        type: 'streak_reminder',
        title: 'Streak Reminder ⏰',
        message: `Don't forget to verify your streak today! You're on day ${streak.currentStreak}.`,
        data: {
          streakId: streak._id,
          currentStreak: streak.currentStreak,
          actionUrl: '/verify'
        },
        priority: 'high'
      },
      streak_broken: {
        type: 'streak_broken',
        title: 'Streak Broken 😢',
        message: `Your ${streak.currentStreak}-day streak has been broken.`,
        data: {
          streakId: streak._id,
          brokenStreak: streak.currentStreak,
          actionUrl: '/verify'
        },
        priority: 'high'
      },
      streak_milestone: {
        type: 'streak_milestone',
        title: 'Streak Milestone 🎉',
        message: `Congratulations! You've reached ${streak.currentStreak} days!`,
        data: {
          streakId: streak._id,
          milestone: streak.currentStreak,
          actionUrl: '/dashboard'
        },
        priority: 'medium'
      },
      streak_extended: {
        type: 'streak_extended',
        title: 'Streak Extended 🔥',
        message: `Your streak continues! Now at ${streak.currentStreak} days.`,
        data: {
          streakId: streak._id,
          currentStreak: streak.currentStreak,
          actionUrl: '/dashboard'
        },
        priority: 'low'
      }
    };

    const notificationConfig = notifications[notificationType];
    if (notificationConfig) {
      return this.createNotification(userId, notificationConfig);
    }
  }

  /**
   * Create challenge-related notifications
   */
  async createChallengeNotification(userId, challenge, notificationType) {
    const notifications = {
      challenge_invite: {
        type: 'challenge_invite',
        title: 'Challenge Invitation 🏆',
        message: `You've been invited to join "${challenge.name}" challenge!`,
        data: {
          challengeId: challenge._id,
          challengeName: challenge.name,
          actionUrl: `/challenges/${challenge._id}`
        },
        priority: 'high'
      },
      challenge_started: {
        type: 'challenge_started',
        title: 'Challenge Started 🚀',
        message: `"${challenge.name}" challenge has begun!`,
        data: {
          challengeId: challenge._id,
          challengeName: challenge.name,
          actionUrl: `/challenges/${challenge._id}`
        },
        priority: 'medium'
      },
      challenge_ending_soon: {
        type: 'challenge_ending_soon',
        title: 'Challenge Ending Soon ⏳',
        message: `"${challenge.name}" challenge ends in 24 hours!`,
        data: {
          challengeId: challenge._id,
          challengeName: challenge.name,
          actionUrl: `/challenges/${challenge._id}`
        },
        priority: 'high'
      },
      challenge_completed: {
        type: 'challenge_completed',
        title: 'Challenge Completed 🎯',
        message: `Congratulations! You've completed "${challenge.name}" challenge!`,
        data: {
          challengeId: challenge._id,
          challengeName: challenge.name,
          actionUrl: `/challenges/${challenge._id}/results`
        },
        priority: 'medium'
      },
      challenge_rank_update: {
        type: 'challenge_rank_update',
        title: 'Rank Update 📈',
        message: `You've moved up in the "${challenge.name}" leaderboard!`,
        data: {
          challengeId: challenge._id,
          challengeName: challenge.name,
          actionUrl: `/challenges/${challenge._id}/leaderboard`
        },
        priority: 'low'
      }
    };

    const notificationConfig = notifications[notificationType];
    if (notificationConfig) {
      return this.createNotification(userId, notificationConfig);
    }
  }

  /**
   * Create achievement notification
   */
  async createAchievementNotification(userId, achievement) {
    return this.createNotification(userId, {
      type: 'achievement_unlocked',
      title: 'Achievement Unlocked 🏅',
      message: `You've earned the "${achievement.name}" achievement!`,
      data: {
        achievementId: achievement._id,
        achievementName: achievement.name,
        icon: achievement.icon,
        actionUrl: '/profile/achievements'
      },
      priority: 'medium'
    });
  }

  /**
   * Create payment notification
   */
  async createPaymentNotification(userId, payment) {
    return this.createNotification(userId, {
      type: 'payment_success',
      title: 'Payment Successful 💰',
      message: `Your payment of $${payment.amount} was processed successfully.`,
      data: {
        paymentId: payment._id,
        amount: payment.amount,
        actionUrl: '/subscription'
      },
      priority: 'medium'
    });
  }

  /**
   * Create social notification
   */
  async createSocialNotification(userId, socialEvent) {
    const notifications = {
      friend_request: {
        type: 'friend_request',
        title: 'Friend Request 👥',
        message: `${socialEvent.fromUser} sent you a friend request.`,
        data: {
          fromUserId: socialEvent.fromUserId,
          actionUrl: `/profile/${socialEvent.fromUserId}`
        },
        priority: 'medium'
      },
      friend_accepted: {
        type: 'friend_accepted',
        title: 'Friend Request Accepted ✅',
        message: `${socialEvent.fromUser} accepted your friend request.`,
        data: {
          fromUserId: socialEvent.fromUserId,
          actionUrl: `/profile/${socialEvent.fromUserId}`
        },
        priority: 'low'
      },
      streak_shared: {
        type: 'streak_shared',
        title: 'Streak Shared 📢',
        message: `${socialEvent.fromUser} shared their streak with you.`,
        data: {
          fromUserId: socialEvent.fromUserId,
          streakId: socialEvent.streakId,
          actionUrl: `/streaks/${socialEvent.streakId}`
        },
        priority: 'low'
      },
      new_follower: {
        type: 'new_follower',
        title: 'New Follower 🎉',
        message: `${socialEvent.fromUser} started following you.`,
        data: {
          fromUserId: socialEvent.fromUserId,
          actionUrl: `/profile/${socialEvent.fromUserId}`
        },
        priority: 'low'
      }
    };

    const notificationConfig = notifications[socialEvent.type];
    if (notificationConfig) {
      return this.createNotification(userId, notificationConfig);
    }
  }

  /**
   * Create system notification (admin)
   */
  async createSystemNotification(userIds, systemEvent) {
    const notificationPromises = userIds.map(userId =>
      this.createNotification(userId, {
        type: 'system_announcement',
        title: systemEvent.title,
        message: systemEvent.message,
        data: systemEvent.data,
        priority: systemEvent.priority || 'normal'
      })
    );

    return Promise.all(notificationPromises);
  }

  /**
   * Handle notification read
   */
  async handleNotificationRead(socket, data) {
    try {
      const { notificationId } = data;
      
      if (!notificationId) return;

      const notification = await Notification.findOne({
        _id: notificationId,
        userId: socket.userId
      });

      if (!notification) return;

      notification.read = true;
      notification.readAt = new Date();
      await notification.save();

      // Update notification count
      this.updateNotificationCount(socket.userId);

      // Acknowledge
      socket.emit(SOCKET_EVENTS.NOTIFICATION_READ_ACK, { notificationId });

    } catch (error) {
      console.error('Error handling notification read:', error);
    }
  }

  /**
   * Handle notification dismiss
   */
  async handleNotificationDismiss(socket, data) {
    try {
      const { notificationId } = data;
      
      if (!notificationId) return;

      const notification = await Notification.findOne({
        _id: notificationId,
        userId: socket.userId
      });

      if (!notification) return;

      notification.dismissed = true;
      await notification.save();

      // Update notification count
      this.updateNotificationCount(socket.userId);

    } catch (error) {
      console.error('Error handling notification dismiss:', error);
    }
  }

  /**
   * Handle notification clicked
   */
  async handleNotificationClicked(socket, data) {
    try {
      const { notificationId } = data;
      
      if (!notificationId) return;

      const notification = await Notification.findOne({
        _id: notificationId,
        userId: socket.userId
      });

      if (!notification) return;

      notification.clicked = true;
      notification.clickedAt = new Date();
      await notification.save();

      // Track notification click for analytics
      console.log(`Notification clicked: ${notificationId}`, {
        userId: socket.userId,
        type: notification.type,
        actionUrl: notification.data?.actionUrl
      });

    } catch (error) {
      console.error('Error handling notification clicked:', error);
    }
  }

  /**
   * Handle update notification preferences
   */
  async handleUpdatePreferences(socket, data) {
    try {
      const { preferences } = data;
      
      if (!preferences) return;

      // Update user preferences
      await User.findByIdAndUpdate(socket.userId, {
        $set: { 'preferences.notifications': preferences }
      });

      // Update cache
      this.notificationPreferences.set(socket.userId.toString(), preferences);

      // Acknowledge
      socket.emit(SOCKET_EVENTS.PREFERENCES_UPDATED, { success: true });

    } catch (error) {
      console.error('Error updating preferences:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to update preferences' });
    }
  }

  /**
   * Handle get notifications request
   */
  async handleGetNotifications(socket, data) {
    try {
      const { limit = 50, offset = 0 } = data;
      
      const notifications = await Notification.find({ userId: socket.userId })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean();

      const total = await Notification.countDocuments({ userId: socket.userId });
      const unreadCount = await Notification.countDocuments({
        userId: socket.userId,
        read: false
      });

      socket.emit(SOCKET_EVENTS.NOTIFICATIONS_LIST, {
        notifications,
        total,
        unreadCount,
        hasMore: offset + notifications.length < total
      });

    } catch (error) {
      console.error('Error getting notifications:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to get notifications' });
    }
  }

  /**
   * Handle mark all as read
   */
  async handleMarkAllRead(socket) {
    try {
      await Notification.updateMany(
        { userId: socket.userId, read: false },
        { $set: { read: true, readAt: new Date() } }
      );

      // Update notification count
      this.updateNotificationCount(socket.userId);

      // Acknowledge
      socket.emit(SOCKET_EVENTS.ALL_MARKED_READ, { success: true });

    } catch (error) {
      console.error('Error marking all as read:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to mark all as read' });
    }
  }

  /**
   * Handle clear all notifications
   */
  async handleClearAllNotifications(socket) {
    try {
      await Notification.deleteMany({ userId: socket.userId });

      // Update notification count
      socket.emit(SOCKET_EVENTS.NOTIFICATION_COUNT, { count: 0 });

      // Acknowledge
      socket.emit(SOCKET_EVENTS.ALL_CLEARED, { success: true });

    } catch (error) {
      console.error('Error clearing notifications:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to clear notifications' });
    }
  }

  /**
   * Update notification count for user
   */
  async updateNotificationCount(userId) {
    try {
      const unreadCount = await Notification.countDocuments({
        userId,
        read: false
      });

      const socketId = this.userSockets.get(userId.toString());
      if (socketId) {
        this.notificationNamespace.to(socketId).emit(SOCKET_EVENTS.NOTIFICATION_COUNT, {
          count: unreadCount
        });
      }
    } catch (error) {
      console.error('Error updating notification count:', error);
    }
  }

  /**
   * Check if notification should be sent based on user preferences
   */
  shouldSendNotification(userId, notificationType) {
    try {
      const preferences = this.notificationPreferences.get(userId.toString());
      
      if (!preferences) {
        return true; // Default to sending if preferences not cached
      }

      // Map notification types to preference keys
      const preferenceMap = {
        'streak_reminder': 'streakReminder',
        'streak_broken': 'streakReminder',
        'streak_milestone': 'streakMilestones',
        'streak_extended': 'streakMilestones',
        'challenge_invite': 'challengeInvites',
        'challenge_started': 'challengeUpdates',
        'challenge_ending_soon': 'challengeReminders',
        'challenge_completed': 'challengeUpdates',
        'challenge_rank_update': 'leaderboardUpdates',
        'achievement_unlocked': 'achievements',
        'payment_success': 'payments',
        'friend_request': 'social',
        'friend_accepted': 'social',
        'streak_shared': 'social',
        'new_follower': 'social',
        'system_announcement': 'system'
      };

      const preferenceKey = preferenceMap[notificationType];
      if (!preferenceKey) {
        return true; // Default to sending if no preference mapping
      }

      return preferences[preferenceKey] !== false;
    } catch (error) {
      console.error('Error checking notification preferences:', error);
      return true; // Default to sending on error
    }
  }

  /**
   * Handle socket disconnection
   */
  async handleDisconnect(socket) {
    console.log(`Notification socket disconnected: ${socket.userId} (${socket.id})`);
    
    // Update tracking
    this.userSockets.delete(socket.userId.toString());
    this.notificationPreferences.delete(socket.userId.toString());
  }

  /**
   * Handle socket errors
   */
  handleError(socket, error) {
    console.error(`Notification socket error for user ${socket.userId}:`, error);
  }

  /**
   * Send notification to user directly
   */
  sendToUser(userId, notification) {
    const socketId = this.userSockets.get(userId.toString());
    if (socketId && this.shouldSendNotification(userId, notification.type)) {
      this.notificationNamespace.to(socketId).emit(SOCKET_EVENTS.NEW_NOTIFICATION, notification);
      this.updateNotificationCount(userId);
      return true;
    }
    return false;
  }

  /**
   * Broadcast to all users (admin only)
   */
  broadcast(notification) {
    this.notificationNamespace.emit(SOCKET_EVENTS.NEW_NOTIFICATION, notification);
  }

  /**
   * Get user's notification count
   */
  async getUserNotificationCount(userId) {
    try {
      return await Notification.countDocuments({
        userId,
        read: false
      });
    } catch (error) {
      console.error('Error getting notification count:', error);
      return 0;
    }
  }

  /**
   * Schedule streak reminder notifications
   */
  async scheduleStreakReminders() {
    try {
      const now = new Date();
      const reminderTime = new Date();
      reminderTime.setHours(20, 0, 0, 0); // 8 PM

      if (now > reminderTime) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }

      // Find users who haven't verified today
      const usersWithActiveStreaks = await Streak.aggregate([
        {
          $match: {
            status: 'active',
            'history.date': {
              $lt: new Date().setHours(0, 0, 0, 0)
            }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $match: {
            'user.preferences.notifications.streakReminder': true
          }
        },
        {
          $project: {
            userId: '$userId',
            currentStreak: '$currentStreak',
            streakId: '$_id'
          }
        }
      ]);

      for (const { userId, currentStreak, streakId } of usersWithActiveStreaks) {
        // Schedule notification
        setTimeout(async () => {
          await this.createStreakNotification(userId, { _id: streakId, currentStreak }, 'streak_reminder');
        }, reminderTime.getTime() - now.getTime());
      }

      console.log(`Scheduled ${usersWithActiveStreaks.length} streak reminders`);
    } catch (error) {
      console.error('Error scheduling streak reminders:', error);
    }
  }
}

module.exports = NotificationSocketHandler;