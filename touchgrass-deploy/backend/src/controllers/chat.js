const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/user');
const Challenge = require('../models/Challenge');
const { redis } = require('../config/redis');
const { CHAT, ERROR_CODES, API_MESSAGES } = require('../config/constants');

/**
 * Chat Controller
 * Handles real-time messaging, chat rooms, and notifications
 */

class ChatController {
  /**
   * Get user's chats with pagination
   */
  async getChats(req, res) {
    try {
      const userId = req.userId;
      const { page = 1, limit = 20, type } = req.query;
      const skip = (page - 1) * limit;

      // Build query
      const query = { participants: userId };
      if (type) {
        query.type = type;
      }

      // Get chats with pagination
      const chats = await Chat.find(query)
        .populate('participants', 'username displayName avatar stats.currentStreak')
        .populate('lastMessage.sender', 'username displayName avatar')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      // Calculate unread counts for each chat
      const chatsWithUnread = await Promise.all(chats.map(async (chat) => {
        const unreadCount = await Message.countDocuments({
          chatId: chat._id,
          sender: { $ne: userId },
          readBy: { $ne: userId }
        });

        // Check if user has muted this chat
        const isMuted = chat.settings?.mutedBy?.includes(userId) || false;

        return {
          ...chat,
          unreadCount,
          isMuted,
          // Mark as active if updated within last 24 hours
          isActive: new Date() - new Date(chat.updatedAt) < 24 * 60 * 60 * 1000
        };
      }));

      // Get total count for pagination
      const total = await Chat.countDocuments(query);

      // Get online users from chat participants
      const participantIds = chats.flatMap(chat => 
        chat.participants.map(p => p._id.toString())
      );
      const uniqueParticipantIds = [...new Set(participantIds)];
      
      const onlineStatuses = await Promise.all(
        uniqueParticipantIds.map(async (id) => ({
          userId: id,
          isOnline: await redis.cache.exists(`user:online:${id}`)
        }))
      );

      const onlineMap = onlineStatuses.reduce((map, status) => {
        map[status.userId] = status.isOnline;
        return map;
      }, {});

      // Add online status to participants
      chatsWithUnread.forEach(chat => {
        chat.participants.forEach(participant => {
          participant.isOnline = onlineMap[participant._id.toString()] || false;
        });
      });

      res.json({
        message: API_MESSAGES.SUCCESS,
        chats: chatsWithUnread,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        totalUnread: chatsWithUnread.reduce((sum, chat) => sum + chat.unreadCount, 0)
      });
    } catch (error) {
      console.error('Get chats error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Get chat messages
   */
  async getMessages(req, res) {
    try {
      const userId = req.userId;
      const { chatId } = req.params;
      const { before, limit = 50 } = req.query;

      // Verify user is participant
      const chat = await Chat.findOne({
        _id: chatId,
        participants: userId
      });

      if (!chat) {
        return res.status(403).json({
          error: 'Access denied',
          code: ERROR_CODES.RESOURCE_ACCESS_DENIED
        });
      }

      // Build query
      const query = {
        chatId,
        deletedFor: { $ne: userId }
      };

      if (before) {
        query.createdAt = { $lt: new Date(before) };
      }

      // Get messages
      const messages = await Message.find(query)
        .populate('sender', 'username displayName avatar')
        .populate('reactions.userId', 'username displayName avatar')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .lean();

      // Mark messages as read
      const unreadMessageIds = messages
        .filter(msg => 
          msg.sender._id.toString() !== userId && 
          !msg.readBy.includes(userId)
        )
        .map(msg => msg._id);

      if (unreadMessageIds.length > 0) {
        await Message.updateMany(
          { _id: { $in: unreadMessageIds } },
          { $addToSet: { readBy: userId } }
        );

        // Update chat's last message read status
        if (chat.lastMessage && !chat.lastMessage.readBy.includes(userId)) {
          chat.lastMessage.readBy.push(userId);
          await chat.save();
        }

        // Clear notification badge
        await redis.cache.delete(`chat:unread:${userId}:${chatId}`);
      }

      // Get next cursor for pagination
      const nextCursor = messages.length > 0 
        ? messages[messages.length - 1].createdAt.toISOString()
        : null;

      res.json({
        message: API_MESSAGES.SUCCESS,
        messages: messages.reverse(), // Return in chronological order
        chat: {
          id: chat._id,
          type: chat.type,
          name: chat.name,
          participants: chat.participants,
          isChallengeChat: chat.isChallengeChat,
          challengeId: chat.challengeId
        },
        pagination: {
          hasMore: messages.length === parseInt(limit),
          nextCursor,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Send message
   */
  async sendMessage(req, res) {
    try {
      const userId = req.userId;
      const { chatId } = req.params;
      const { text, type = 'text', attachments = [], metadata = {} } = req.body;

      // Rate limiting
      const rateLimitKey = `chat:ratelimit:${userId}`;
      const rateLimit = await redis.rateLimit.fixedWindow(
        rateLimitKey,
        60,
        CHAT.MESSAGE_LIMITS.RATE_LIMIT
      );

      if (!rateLimit.allowed) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          code: ERROR_CODES.RATE_LIMITED,
          retryAfter: Math.ceil(rateLimit.reset / 1000)
        });
      }

      // Verify user is participant
      const chat = await Chat.findOne({
        _id: chatId,
        participants: userId
      });

      if (!chat) {
        return res.status(403).json({
          error: 'Access denied',
          code: ERROR_CODES.RESOURCE_ACCESS_DENIED
        });
      }

      // Validate message length
      if (text && text.length > CHAT.MESSAGE_LIMITS.MAX_LENGTH) {
        return res.status(400).json({
          error: 'Message too long',
          code: ERROR_CODES.VALIDATION_FAILED,
          maxLength: CHAT.MESSAGE_LIMITS.MAX_LENGTH
        });
      }

      // Validate attachments
      if (attachments.length > CHAT.MESSAGE_LIMITS.MAX_ATTACHMENTS_PER_MESSAGE) {
        return res.status(400).json({
          error: 'Too many attachments',
          code: ERROR_CODES.VALIDATION_FAILED,
          maxAttachments: CHAT.MESSAGE_LIMITS.MAX_ATTACHMENTS_PER_MESSAGE
        });
      }

      // Create message
      const message = new Message({
        chatId,
        sender: userId,
        text,
        type,
        attachments,
        metadata,
        readBy: [userId]
      });

      await message.save();

      // Update chat's last message
      chat.lastMessage = {
        text: text ? text.substring(0, 100) : '📎 Attachment',
        sender: userId,
        timestamp: new Date(),
        readBy: [userId]
      };
      chat.updatedAt = new Date();
      await chat.save();

      // Populate for response
      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'username displayName avatar')
        .lean();

      // Get other participants
      const otherParticipants = chat.participants.filter(
        p => p.toString() !== userId.toString()
      );

      // Create notifications for other participants
      for (const participantId of otherParticipants) {
        // Check if participant has muted this chat
        const isMuted = chat.settings?.mutedBy?.includes(participantId);
        
        if (!isMuted) {
          // Create notification
          const notification = {
            type: 'new_message',
            chatId,
            messageId: message._id,
            sender: {
              id: userId,
              username: populatedMessage.sender.username,
              displayName: populatedMessage.sender.displayName
            },
            preview: text ? text.substring(0, 50) : 'New attachment',
            timestamp: new Date(),
            unread: true
          };

          // Store notification
          const notificationKey = `notifications:${participantId}:${Date.now()}`;
          await redis.cache.set(
            notificationKey,
            notification,
            7 * 24 * 60 * 60 // 7 days
          );

          // Increment unread count
          await redis.cache.increment(`chat:unread:${participantId}:${chatId}`);
          await redis.cache.increment(`notifications:unread:${participantId}`);

          // Publish real-time notification
          await redis.pubsub.publish(`user:${participantId}`, {
            type: 'new_message',
            data: notification
          });
        }
      }

      // Publish message to chat room
      await redis.pubsub.publish(`chat:${chatId}`, {
        type: 'new_message',
        data: populatedMessage
      });

      // Track message analytics
      await redis.cache.increment('analytics:messages:total');
      await redis.cache.increment(`analytics:messages:${chat.type}:total`);

      res.status(201).json({
        message: API_MESSAGES.CREATED,
        data: populatedMessage
      });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Create or get direct chat
   */
  async createDirectChat(req, res) {
    try {
      const userId = req.userId;
      const { participantId } = req.body;

      // Check if participants exist
      const participant = await User.findById(participantId);
      if (!participant) {
        return res.status(404).json({
          error: 'User not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      // Check if chat already exists
      let chat = await Chat.findOne({
        type: 'direct',
        participants: { $all: [userId, participantId], $size: 2 }
      })
      .populate('participants', 'username displayName avatar stats.currentStreak');

      if (!chat) {
        // Create new chat
        chat = new Chat({
          type: 'direct',
          participants: [userId, participantId]
        });

        await chat.save();

        // Populate participants
        chat = await Chat.findById(chat._id)
          .populate('participants', 'username displayName avatar stats.currentStreak');
      }

      res.json({
        message: API_MESSAGES.SUCCESS,
        chat
      });
    } catch (error) {
      console.error('Create direct chat error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Create group chat
   */
  async createGroupChat(req, res) {
    try {
      const userId = req.userId;
      const { name, participantIds } = req.body;

      // Validate participants
      const participants = [userId, ...participantIds];
      const uniqueParticipants = [...new Set(participants.map(id => id.toString()))];

      if (uniqueParticipants.length < 2) {
        return res.status(400).json({
          error: 'Group chat requires at least 2 participants',
          code: ERROR_CODES.VALIDATION_FAILED
        });
      }

      if (uniqueParticipants.length > CHAT.SETTINGS.MAX_GROUP_SIZE) {
        return res.status(400).json({
          error: `Group size exceeds limit of ${CHAT.SETTINGS.MAX_GROUP_SIZE}`,
          code: ERROR_CODES.RESOURCE_LIMIT_EXCEEDED
        });
      }

      // Check if all participants exist
      const users = await User.find({
        _id: { $in: uniqueParticipants }
      });

      if (users.length !== uniqueParticipants.length) {
        return res.status(404).json({
          error: 'Some users not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      // Create group chat
      const chat = new Chat({
        type: 'group',
        name,
        participants: uniqueParticipants,
        settings: {
          mutedBy: [],
          notifications: true
        }
      });

      await chat.save();

      // Populate participants
      const populatedChat = await Chat.findById(chat._id)
        .populate('participants', 'username displayName avatar stats.currentStreak');

      // Notify participants
      for (const participantId of uniqueParticipants) {
        if (participantId.toString() !== userId.toString()) {
          await redis.pubsub.publish(`user:${participantId}`, {
            type: 'chat_invite',
            data: {
              chatId: chat._id,
              chatName: name,
              inviter: userId
            }
          });
        }
      }

      res.status(201).json({
        message: API_MESSAGES.CREATED,
        chat: populatedChat
      });
    } catch (error) {
      console.error('Create group chat error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Create challenge chat
   */
  async createChallengeChat(req, res) {
    try {
      const userId = req.userId;
      const { challengeId, participantIds, name } = req.body;

      // Verify challenge exists
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        return res.status(404).json({
          error: 'Challenge not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      // Validate participants (must be challenge participants)
      const participants = [userId, ...participantIds];
      const validParticipants = participants.filter(id =>
        challenge.participants.includes(id.toString())
      );

      if (validParticipants.length < 2) {
        return res.status(400).json({
          error: 'All participants must be in the challenge',
          code: ERROR_CODES.VALIDATION_FAILED
        });
      }

      // Check if chat already exists for this challenge
      let chat = await Chat.findOne({
        challengeId,
        type: 'challenge'
      });

      if (!chat) {
        // Create challenge chat
        chat = new Chat({
          type: 'challenge',
          name: name || `Challenge: ${challenge.name}`,
          participants: validParticipants,
          challengeId,
          isChallengeChat: true,
          avatar: challenge.image
        });

        await chat.save();
      }

      // Populate participants
      const populatedChat = await Chat.findById(chat._id)
        .populate('participants', 'username displayName avatar stats.currentStreak');

      res.json({
        message: API_MESSAGES.SUCCESS,
        chat: populatedChat
      });
    } catch (error) {
      console.error('Create challenge chat error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Update chat settings
   */
  async updateChatSettings(req, res) {
    try {
      const userId = req.userId;
      const { chatId } = req.params;
      const { muted, notifications } = req.body;

      // Verify user is participant
      const chat = await Chat.findOne({
        _id: chatId,
        participants: userId
      });

      if (!chat) {
        return res.status(403).json({
          error: 'Access denied',
          code: ERROR_CODES.RESOURCE_ACCESS_DENIED
        });
      }

      // Update settings
      if (muted !== undefined) {
        if (muted && !chat.settings.mutedBy.includes(userId)) {
          chat.settings.mutedBy.push(userId);
        } else if (!muted && chat.settings.mutedBy.includes(userId)) {
          chat.settings.mutedBy = chat.settings.mutedBy.filter(
            id => id.toString() !== userId.toString()
          );
        }
      }

      if (notifications !== undefined) {
        chat.settings.notifications = notifications;
      }

      await chat.save();

      res.json({
        message: API_MESSAGES.UPDATED,
        settings: chat.settings
      });
    } catch (error) {
      console.error('Update chat settings error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Delete message
   */
  async deleteMessage(req, res) {
    try {
      const userId = req.userId;
      const { messageId } = req.params;

      const message = await Message.findById(messageId);
      if (!message) {
        return res.status(404).json({
          error: 'Message not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      // Check permissions (sender or admin)
      const isSender = message.sender.toString() === userId.toString();
      const chat = await Chat.findById(message.chatId);
      const isAdmin = chat && chat.type === 'group' && chat.createdBy?.toString() === userId.toString();

      if (!isSender && !isAdmin) {
        return res.status(403).json({
          error: 'Not authorized to delete this message',
          code: ERROR_CODES.RESOURCE_ACCESS_DENIED
        });
      }

      // Soft delete for everyone
      message.isDeleted = true;
      await message.save();

      // Publish deletion event
      await redis.pubsub.publish(`chat:${message.chatId}`, {
        type: 'message_deleted',
        data: { messageId: message._id }
      });

      res.json({
        message: API_MESSAGES.DELETED,
        deleted: true
      });
    } catch (error) {
      console.error('Delete message error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * React to message
   */
  async reactToMessage(req, res) {
    try {
      const userId = req.userId;
      const { messageId } = req.params;
      const { emoji } = req.body;

      const message = await Message.findById(messageId);
      if (!message) {
        return res.status(404).json({
          error: 'Message not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      // Add reaction
      await message.addReaction(userId, emoji);

      // Publish reaction event
      await redis.pubsub.publish(`chat:${message.chatId}`, {
        type: 'message_reacted',
        data: {
          messageId: message._id,
          reactions: message.reactions
        }
      });

      res.json({
        message: API_MESSAGES.UPDATED,
        reactions: message.reactions
      });
    } catch (error) {
      console.error('React to message error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Mark chat as read
   */
  async markAsRead(req, res) {
    try {
      const userId = req.userId;
      const { chatId } = req.params;

      // Mark all messages as read
      await Message.updateMany(
        {
          chatId,
          sender: { $ne: userId },
          readBy: { $ne: userId }
        },
        {
          $addToSet: { readBy: userId }
        }
      );

      // Update chat's last message read status
      const chat = await Chat.findById(chatId);
      if (chat && chat.lastMessage && !chat.lastMessage.readBy.includes(userId)) {
        chat.lastMessage.readBy.push(userId);
        await chat.save();
      }

      // Clear unread count
      await redis.cache.delete(`chat:unread:${userId}:${chatId}`);

      res.json({
        message: API_MESSAGES.UPDATED,
        read: true
      });
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Get chat suggestions
   */
  async getChatSuggestions(req, res) {
    try {
      const userId = req.userId;

      // Get user's location and streak info
      const user = await User.findById(userId);
      
      // Get users with similar streaks (±10 days)
      const streakRange = [Math.max(0, user.stats.currentStreak - 10), user.stats.currentStreak + 10];
      
      // Get users from same city
      const locationQuery = user.location?.city ? {
        'location.city': user.location.city,
        'preferences.publicProfile': true
      } : {};

      // Find suggested users (not already in chats with)
      const existingChats = await Chat.find({
        participants: userId,
        type: 'direct'
      }).select('participants');

      const existingParticipantIds = existingChats
        .flatMap(chat => chat.participants)
        .filter(id => id.toString() !== userId.toString());

      const suggestions = await User.aggregate([
        {
          $match: {
            _id: { 
              $ne: userId,
              $nin: existingParticipantIds 
            },
            'preferences.publicProfile': true,
            'stats.currentStreak': { $gte: streakRange[0], $lte: streakRange[1] },
            ...locationQuery
          }
        },
        {
          $addFields: {
            streakSimilarity: {
              $abs: { $subtract: ['$stats.currentStreak', user.stats.currentStreak] }
            },
            locationMatch: {
              $cond: [
                { $and: [user.location?.city, { $eq: ['$location.city', user.location.city] }] },
                2,
                0
              ]
            },
            lastActiveScore: {
              $cond: [
                { $gte: ['$updatedAt', { $dateSubtract: { startDate: '$$NOW', unit: 'day', amount: 7 } }] },
                1,
                0
              ]
            }
          }
        },
        {
          $addFields: {
            score: {
              $subtract: [
                100,
                {
                  $add: [
                    '$streakSimilarity',
                    { $multiply: ['$locationMatch', -1] },
                    { $multiply: ['$lastActiveScore', -1] }
                  ]
                }
              ]
            }
          }
        },
        { $sort: { score: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 1,
            username: 1,
            displayName: 1,
            avatar: 1,
            location: 1,
            'stats.currentStreak': 1,
            'stats.consistencyScore': 1,
            score: 1
          }
        }
      ]);

      // Add online status
      const suggestionsWithOnline = await Promise.all(
        suggestions.map(async (user) => ({
          ...user,
          isOnline: await redis.cache.exists(`user:online:${user._id}`)
        }))
      );

      res.json({
        message: API_MESSAGES.SUCCESS,
        suggestions: suggestionsWithOnline
      });
    } catch (error) {
      console.error('Get chat suggestions error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Get chat analytics
   */
  async getChatAnalytics(req, res) {
    try {
      const userId = req.userId;

      // Get user's chat stats
      const totalChats = await Chat.countDocuments({ participants: userId });
      const totalMessages = await Message.countDocuments({ sender: userId });
      const groupChats = await Chat.countDocuments({ 
        participants: userId,
        type: 'group' 
      });
      const challengeChats = await Chat.countDocuments({ 
        participants: userId,
        type: 'challenge' 
      });

      // Get most active chats
      const activeChats = await Chat.aggregate([
        { $match: { participants: userId } },
        { $sort: { updatedAt: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'users',
            localField: 'participants',
            foreignField: '_id',
            as: 'participantDetails'
          }
        },
        {
          $project: {
            name: 1,
            type: 1,
            updatedAt: 1,
            participantCount: { $size: '$participants' },
            participants: {
              $map: {
                input: '$participantDetails',
                as: 'participant',
                in: {
                  id: '$$participant._id',
                  username: '$$participant.username',
                  displayName: '$$participant.displayName',
                  avatar: '$$participant.avatar'
                }
              }
            }
          }
        }
      ]);

      // Get message frequency
      const messageFrequency = await Message.aggregate([
        { $match: { sender: userId } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: 30 }
      ]);

      res.json({
        message: API_MESSAGES.SUCCESS,
        analytics: {
          totalChats,
          totalMessages,
          groupChats,
          challengeChats,
          activeChats,
          messageFrequency,
          mostActiveDay: messageFrequency.reduce((max, day) => 
            day.count > max.count ? day : max, 
            { count: 0 }
          )
        }
      });
    } catch (error) {
      console.error('Get chat analytics error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }
}

module.exports = new ChatController();