const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/user');
const Challenge = require('../models/Challenge');
const Notification = require('../models/Notification');

// @route   GET /api/chat/chats
// @desc    Get user's chats
// @access  Private
router.get('/chats', auth, async (req, res) => {
  try {
    const { limit = 50, offset = 0, unreadOnly = false } = req.query;

    // Find all chats where user is a participant
    const chats = await Chat.find({
      participants: req.user.id,
      'metadata.isArchived': false
    })
    .populate('participants', 'displayName username avatar')
    .populate('lastMessage.sender', 'displayName avatar')
    .populate('admins', 'displayName username')
    .sort({ updatedAt: -1 })
    .skip(parseInt(offset))
    .limit(parseInt(limit))
    .lean();

    // Calculate unread counts for each chat
    const chatsWithUnread = await Promise.all(chats.map(async (chat) => {
      const unreadCount = await Message.countDocuments({
        chatId: chat._id,
        sender: { $ne: req.user.id },
        readBy: { $ne: req.user.id },
        deletedFor: { $ne: req.user.id }
      });

      // Check if user has muted this chat
      const isMuted = chat.settings.mutedBy?.some(mute => 
        mute.user?.toString() === req.user.id.toString()
      );

      return {
        ...chat,
        unreadCount,
        isMuted: isMuted || false,
        isAdmin: chat.admins?.some(admin => 
          admin._id.toString() === req.user.id.toString()
        ) || false
      };
    }));

    // Filter for unread only if requested
    const filteredChats = unreadOnly === 'true'
      ? chatsWithUnread.filter(chat => chat.unreadCount > 0)
      : chatsWithUnread;

    // Get total unread count across all chats
    const totalUnread = filteredChats.reduce((sum, chat) => sum + chat.unreadCount, 0);

    res.json({
      success: true,
      chats: filteredChats,
      totalUnread,
      pagination: {
        total: filteredChats.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: filteredChats.length === parseInt(limit)
      }
    });

  } catch (err) {
    console.error('Get chats error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   GET /api/chat/chats/:chatId
// @desc    Get chat by ID
// @access  Private
router.get('/chats/:chatId', auth, async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user.id
    })
    .populate('participants', 'displayName username avatar bio location stats')
    .populate('admins', 'displayName username avatar')
    .populate('lastMessage.sender', 'displayName avatar');

    if (!chat) {
      return res.status(404).json({
        error: 'CHAT_NOT_FOUND',
        message: 'Chat not found or access denied'
      });
    }

    // Check if user is muted
    const isMuted = chat.settings.mutedBy?.some(mute => 
      mute.user?.toString() === req.user.id.toString()
    );

    const chatData = {
      ...chat.toObject(),
      unreadCount: await Message.countDocuments({
        chatId: chat._id,
        sender: { $ne: req.user.id },
        readBy: { $ne: req.user.id },
        deletedFor: { $ne: req.user.id }
      }),
      isMuted,
      isAdmin: chat.admins?.some(admin => 
        admin._id.toString() === req.user.id.toString()
      ) || false,
      canSendMessage: chat.canUserSendMessage(req.user.id)
    };

    res.json({
      success: true,
      chat: chatData
    });

  } catch (err) {
    console.error('Get chat error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   GET /api/chat/chats/:chatId/messages
// @desc    Get chat messages
// @access  Private
router.get('/chats/:chatId/messages', auth, [
  check('limit').optional().isInt({ min: 1, max: 100 }),
  check('before').optional().isISO8601(),
  check('after').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { chatId } = req.params;
    const { limit = 50, before, after } = req.query;

    // Verify user is participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user.id
    });

    if (!chat) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Not a participant in this chat'
      });
    }

    // Build query
    const query = {
      chatId,
      deletedFor: { $ne: req.user.id }
    };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    if (after) {
      query.createdAt = query.createdAt || {};
      query.createdAt.$gt = new Date(after);
    }

    // Get messages
    const messages = await Message.find(query)
      .populate('sender', 'displayName username avatar')
      .populate('reactions.user', 'displayName avatar')
      .populate('metadata.replyTo', 'text sender')
      .populate('metadata.replyTo.sender', 'displayName username')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    // Mark messages as read
    const unreadMessages = messages.filter(msg => 
      msg.sender && 
      msg.sender._id.toString() !== req.user.id.toString() &&
      !msg.readBy.some(read => read.user?.toString() === req.user.id.toString())
    );

    if (unreadMessages.length > 0) {
      await Message.updateMany(
        {
          _id: { $in: unreadMessages.map(msg => msg._id) }
        },
        {
          $addToSet: { 
            readBy: { 
              user: req.user.id,
              readAt: new Date()
            }
          }
        }
      );
    }

    // Update chat's last message read status
    await chat.markAsRead(req.user.id);

    res.json({
      success: true,
      messages: messages.reverse(), // Return in chronological order
      hasMore: messages.length === parseInt(limit),
      nextCursor: messages.length > 0 ? messages[0].createdAt : null
    });

  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   POST /api/chat/chats/direct
// @desc    Create or get direct chat
// @access  Private
router.post('/chats/direct', auth, [
  check('userId', 'User ID is required').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId: otherUserId } = req.body;

    if (otherUserId === req.user.id) {
      return res.status(400).json({
        error: 'INVALID_USER',
        message: 'Cannot create direct chat with yourself'
      });
    }

    // Check if other user exists
    const otherUser = await User.findById(otherUserId);

    if (!otherUser) {
      return res.status(404).json({
        error: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }

    // Find or create direct chat
    const chat = await Chat.findOrCreateDirect(req.user.id, otherUserId);

    res.json({
      success: true,
      chat,
      isNew: chat.createdAt > new Date(Date.now() - 60000) // Created within last minute
    });

  } catch (err) {
    console.error('Create direct chat error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   POST /api/chat/chats/group
// @desc    Create group chat
// @access  Private
router.post('/chats/group', auth, [
  check('name', 'Group name is required').not().isEmpty().isLength({ max: 100 }),
  check('participants', 'Participants array is required').isArray().isLength({ min: 2 }),
  check('description').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, participants, description, avatar } = req.body;

    // Add creator to participants if not already included
    const allParticipants = [...new Set([...participants, req.user.id])];

    // Verify all participants exist
    const users = await User.find({
      _id: { $in: allParticipants }
    }).select('_id');

    if (users.length !== allParticipants.length) {
      return res.status(400).json({
        error: 'INVALID_PARTICIPANTS',
        message: 'Some users not found'
      });
    }

    // Create group chat
    const chat = new Chat({
      type: 'group',
      name,
      description,
      avatar,
      participants: allParticipants,
      createdBy: req.user.id,
      admins: [req.user.id], // Creator is admin
      settings: {
        notifications: true,
        readReceipts: true,
        typingIndicators: true,
        canInvite: true
      }
    });

    await chat.save();

    // Create system message
    await chat.createSystemMessage(`${req.user.displayName} created the group`);

    // Populate and return
    const populatedChat = await Chat.findById(chat._id)
      .populate('participants', 'displayName username avatar')
      .populate('admins', 'displayName username avatar');

    // Send notifications to participants (excluding creator)
    const notificationPromises = allParticipants
      .filter(id => id.toString() !== req.user.id.toString())
      .map(userId => 
        Notification.create({
          user: userId,
          type: 'new_message',
          title: 'New Group Chat',
          message: `You were added to "${name}" by ${req.user.displayName}`,
          data: {
            chatId: chat._id,
            url: `/chat/${chat._id}`,
            action: 'view_chat'
          },
          priority: 'medium',
          channels: ['in_app']
        })
      );

    await Promise.all(notificationPromises);

    res.json({
      success: true,
      chat: populatedChat,
      message: 'Group chat created successfully'
    });

  } catch (err) {
    console.error('Create group chat error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   POST /api/chat/chats/:chatId/messages
// @desc    Send message
// @access  Private
router.post('/chats/:chatId/messages', auth, upload.array('attachments', 5), [
  check('text').optional().isLength({ max: 2000 }),
  check('type').optional().isIn(['text', 'image', 'video', 'file', 'streak_share', 'challenge']),
  check('metadata.replyTo').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { chatId } = req.params;
    const { text, type = 'text', metadata = {} } = req.body;

    // Verify chat exists and user is participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user.id
    });

    if (!chat) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Not a participant in this chat'
      });
    }

    // Check if user can send message
    if (!chat.canUserSendMessage(req.user.id)) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Cannot send message in this chat'
      });
    }

    // Handle attachments
    const attachments = req.files?.map(file => ({
      url: file.path,
      type: file.mimetype.split('/')[0],
      thumbnail: file.path, // In production, generate thumbnails for images/videos
      filename: file.originalname,
      size: file.size,
      mimeType: file.mimetype
    })) || [];

    // Validate: must have text or attachments
    if (!text && attachments.length === 0) {
      return res.status(400).json({
        error: 'EMPTY_MESSAGE',
        message: 'Message must contain text or attachments'
      });
    }

    // Create message
    const message = new Message({
      chatId,
      sender: req.user.id,
      text: text || '',
      type: attachments.length > 0 ? attachments[0].type : type,
      attachments,
      metadata,
      readBy: [{
        user: req.user.id,
        readAt: new Date()
      }]
    });

    await message.save();

    // Update chat's last message
    await chat.updateLastMessage(message);

    // Populate sender info
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'displayName username avatar')
      .populate('metadata.replyTo', 'text sender')
      .populate('metadata.replyTo.sender', 'displayName username');

    // Send notifications to other participants
    const otherParticipants = chat.participants.filter(p => 
      p.toString() !== req.user.id.toString()
    );

    const notificationPromises = otherParticipants.map(userId => 
      Notification.create({
        user: userId,
        type: 'new_message',
        title: `New message from ${req.user.displayName}`,
        message: text ? text.substring(0, 100) : 'Sent an attachment',
        data: {
          chatId,
          messageId: message._id,
          url: `/chat/${chatId}`,
          action: 'view_message'
        },
        priority: 'medium',
        channels: ['in_app']
      })
    );

    await Promise.all(notificationPromises);

    // Emit socket event (would be handled by Socket.IO)
    // io.to(`chat:${chatId}`).emit('new_message', populatedMessage);

    res.json({
      success: true,
      message: populatedMessage,
      chat: {
        id: chat._id,
        lastMessage: chat.lastMessage,
        updatedAt: chat.updatedAt
      }
    });

  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   POST /api/chat/chats/:chatId/messages/:messageId/reactions
// @desc    Add reaction to message
// @access  Private
router.post('/chats/:chatId/messages/:messageId/reactions', auth, [
  check('emoji', 'Emoji is required').not().isEmpty().isLength({ max: 10 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { chatId, messageId } = req.params;
    const { emoji } = req.body;

    // Verify chat exists and user is participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user.id
    });

    if (!chat) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Not a participant in this chat'
      });
    }

    // Get message
    const message = await Message.findOne({
      _id: messageId,
      chatId,
      deletedFor: { $ne: req.user.id }
    });

    if (!message) {
      return res.status(404).json({
        error: 'MESSAGE_NOT_FOUND',
        message: 'Message not found'
      });
    }

    // Add reaction
    await message.addReaction(req.user.id, emoji);

    // Get updated message with reactions
    const updatedMessage = await Message.findById(messageId)
      .populate('reactions.user', 'displayName avatar');

    // Emit socket event
    // io.to(`chat:${chatId}`).emit('message_reaction', {
    //   messageId,
    //   reactions: updatedMessage.reactions
    // });

    res.json({
      success: true,
      message: 'Reaction added',
      reactions: updatedMessage.reactions
    });

  } catch (err) {
    console.error('Add reaction error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   PUT /api/chat/chats/:chatId/messages/:messageId
// @desc    Edit message
// @access  Private
router.put('/chats/:chatId/messages/:messageId', auth, [
  check('text', 'Text is required').not().isEmpty().isLength({ max: 2000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { chatId, messageId } = req.params;
    const { text } = req.body;

    // Verify chat exists and user is participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user.id
    });

    if (!chat) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Not a participant in this chat'
      });
    }

    // Get message
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        error: 'MESSAGE_NOT_FOUND',
        message: 'Message not found'
      });
    }

    // Verify user is sender
    if (message.sender.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Only sender can edit message'
      });
    }

    // Edit message
    await message.editMessage(text, req.user.id);

    // Get updated message
    const updatedMessage = await Message.findById(messageId)
      .populate('sender', 'displayName username avatar');

    // Emit socket event
    // io.to(`chat:${chatId}`).emit('message_edited', updatedMessage);

    res.json({
      success: true,
      message: 'Message edited',
      updatedMessage
    });

  } catch (err) {
    console.error('Edit message error:', err);
    
    if (err.message === 'Cannot edit deleted message') {
      return res.status(400).json({
        error: 'MESSAGE_DELETED',
        message: err.message
      });
    }

    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/chat/chats/:chatId/messages/:messageId
// @desc    Delete message
// @access  Private
router.delete('/chats/:chatId/messages/:messageId', auth, async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    const { forEveryone = false } = req.query;

    // Verify chat exists and user is participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user.id
    });

    if (!chat) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Not a participant in this chat'
      });
    }

    // Get message
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        error: 'MESSAGE_NOT_FOUND',
        message: 'Message not found'
      });
    }

    // Check if user can delete
    const canDelete = await message.canUserDelete(req.user.id);
    if (!canDelete) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Cannot delete this message'
      });
    }

    if (forEveryone === 'true') {
      // Delete for everyone
      await message.deleteForEveryone(req.user.id);
      
      // Emit socket event
      // io.to(`chat:${chatId}`).emit('message_deleted_for_everyone', { messageId });
      
      res.json({
        success: true,
        message: 'Message deleted for everyone'
      });
    } else {
      // Delete for user only
      await message.deleteForUser(req.user.id);
      
      res.json({
        success: true,
        message: 'Message deleted for you'
      });
    }

  } catch (err) {
    console.error('Delete message error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   POST /api/chat/chats/:chatId/participants
// @desc    Add participant to chat
// @access  Private
router.post('/chats/:chatId/participants', auth, [
  check('userId', 'User ID is required').isMongoId(),
  check('isAdmin').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { chatId } = req.params;
    const { userId, isAdmin = false } = req.body;

    // Get chat
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        error: 'CHAT_NOT_FOUND',
        message: 'Chat not found'
      });
    }

    // Check if user is admin
    const isUserAdmin = chat.admins.some(admin => 
      admin.toString() === req.user.id.toString()
    );

    if (!isUserAdmin) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Only admins can add participants'
      });
    }

    // Check if chat allows inviting
    if (!chat.settings.canInvite) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'This chat does not allow adding participants'
      });
    }

    // Add participant
    await chat.addParticipant(userId, req.user.id, isAdmin);

    // Get updated chat
    const updatedChat = await Chat.findById(chatId)
      .populate('participants', 'displayName username avatar')
      .populate('admins', 'displayName username');

    // Send notification to new participant
    await Notification.create({
      user: userId,
      type: 'new_message',
      title: 'Added to Chat',
      message: `You were added to "${chat.name || 'a chat'}" by ${req.user.displayName}`,
      data: {
        chatId,
        url: `/chat/${chatId}`,
        action: 'view_chat'
      },
      priority: 'medium',
      channels: ['in_app']
    });

    res.json({
      success: true,
      message: 'Participant added successfully',
      chat: updatedChat
    });

  } catch (err) {
    console.error('Add participant error:', err);
    
    if (err.message === 'User is already a participant') {
      return res.status(400).json({
        error: 'ALREADY_PARTICIPANT',
        message: err.message
      });
    }

    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/chat/chats/:chatId/participants/:userId
// @desc    Remove participant from chat
// @access  Private
router.delete('/chats/:chatId/participants/:userId', auth, async (req, res) => {
  try {
    const { chatId, userId } = req.params;

    // Get chat
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        error: 'CHAT_NOT_FOUND',
        message: 'Chat not found'
      });
    }

    // Check if user is admin or removing themselves
    const isUserAdmin = chat.admins.some(admin => 
      admin.toString() === req.user.id.toString()
    );
    const isRemovingSelf = userId === req.user.id.toString();

    if (!isUserAdmin && !isRemovingSelf) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Cannot remove other participants'
      });
    }

    // Remove participant
    await chat.removeParticipant(userId, isRemovingSelf ? null : req.user.id);

    // Get updated chat
    const updatedChat = await Chat.findById(chatId)
      .populate('participants', 'displayName username avatar')
      .populate('admins', 'displayName username');

    res.json({
      success: true,
      message: 'Participant removed successfully',
      chat: updatedChat
    });

  } catch (err) {
    console.error('Remove participant error:', err);
    
    if (err.message === 'User is not a participant') {
      return res.status(400).json({
        error: 'NOT_PARTICIPANT',
        message: err.message
      });
    }

    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   POST /api/chat/chats/:chatId/mute
// @desc    Mute chat
// @access  Private
router.post('/chats/:chatId/mute', auth, [
  check('durationHours', 'Duration must be a number').optional().isInt({ min: 1, max: 168 }) // Max 1 week
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { chatId } = req.params;
    const { durationHours = 24 } = req.body;

    // Get chat
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        error: 'CHAT_NOT_FOUND',
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => 
      p.toString() === req.user.id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Not a participant in this chat'
      });
    }

    // Mute chat
    await chat.muteUser(req.user.id, durationHours);

    const muteUntil = new Date();
    muteUntil.setHours(muteUntil.getHours() + durationHours);

    res.json({
      success: true,
      message: `Chat muted until ${muteUntil.toLocaleString()}`,
      mutedUntil: muteUntil,
      durationHours
    });

  } catch (err) {
    console.error('Mute chat error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   POST /api/chat/chats/:chatId/unmute
// @desc    Unmute chat
// @access  Private
router.post('/chats/:chatId/unmute', auth, async (req, res) => {
  try {
    const { chatId } = req.params;

    // Get chat
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        error: 'CHAT_NOT_FOUND',
        message: 'Chat not found'
      });
    }

    // Unmute chat
    await chat.unmuteUser(req.user.id);

    res.json({
      success: true,
      message: 'Chat unmuted'
    });

  } catch (err) {
    console.error('Unmute chat error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   PUT /api/chat/chats/:chatId/read
// @desc    Mark all messages as read
// @access  Private
router.put('/chats/:chatId/read', auth, async (req, res) => {
  try {
    const { chatId } = req.params;

    // Verify chat exists and user is participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user.id
    });

    if (!chat) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Not a participant in this chat'
      });
    }

    // Mark all messages as read
    await Message.updateMany(
      {
        chatId,
        sender: { $ne: req.user.id },
        readBy: { $ne: req.user.id }
      },
      {
        $addToSet: { 
          readBy: { 
            user: req.user.id,
            readAt: new Date()
          }
        }
      }
    );

    // Update chat's last message read status
    await chat.markAsRead(req.user.id);

    res.json({
      success: true,
      message: 'All messages marked as read'
    });

  } catch (err) {
    console.error('Mark messages read error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   GET /api/chat/suggestions
// @desc    Get chat suggestions
// @access  Private
router.get('/suggestions', auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Get user's current chat participants
    const userChats = await Chat.find({
      participants: req.user.id,
      type: 'direct'
    }).select('participants');

    const existingParticipantIds = userChats
      .flatMap(chat => chat.participants)
      .filter(id => id.toString() !== req.user.id.toString());

    // Find suggested users
    const suggestions = await User.aggregate([
      {
        $match: {
          _id: { 
            $ne: req.user.id,
            $nin: existingParticipantIds 
          },
          'preferences.publicProfile': true,
          isDeleted: false
        }
      },
      {
        $addFields: {
          // Calculate similarity score
          locationMatch: {
            $cond: [
              { $eq: ['$location.city', req.user.location?.city] },
              2,
              0
            ]
          },
          streakSimilarity: {
            $abs: {
              $subtract: [
                '$stats.currentStreak',
                req.user.stats.currentStreak
              ]
            }
          },
          lastActiveScore: {
            $cond: [
              { $gte: ['$lastActive', { $dateSubtract: { startDate: '$$NOW', unit: 'day', amount: 7 } }] },
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
      { $limit: parseInt(limit) },
      {
        $project: {
          displayName: 1,
          username: 1,
          avatar: 1,
          location: 1,
          'stats.currentStreak': 1,
          'stats.consistencyScore': 1,
          score: 1
        }
      }
    ]);

    res.json({
      success: true,
      suggestions
    });

  } catch (err) {
    console.error('Get suggestions error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   POST /api/chat/chats/:chatId/share-streak
// @desc    Share streak in chat
// @access  Private
router.post('/chats/:chatId/share-streak', auth, async (req, res) => {
  try {
    const { chatId } = req.params;

    // Verify chat exists and user is participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user.id
    });

    if (!chat) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Not a participant in this chat'
      });
    }

    // Get user's active streak
    const streak = await Streak.findOne({ 
      userId: req.user.id, 
      status: 'active' 
    });

    if (!streak) {
      return res.status(404).json({
        error: 'NO_ACTIVE_STREAK',
        message: 'No active streak found'
      });
    }

    // Create streak share message
    const message = await Message.createStreakShare(
      chatId,
      req.user.id,
      {
        days: streak.currentStreak,
        streakId: streak._id,
        userId: req.user.id
      }
    );

    // Update chat's last message
    await chat.updateLastMessage(message);

    // Populate message
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'displayName username avatar')
      .populate('metadata.streakData.userId', 'displayName username');

    // Emit socket event
    // io.to(`chat:${chatId}`).emit('new_message', populatedMessage);

    res.json({
      success: true,
      message: 'Streak shared successfully',
      sharedMessage: populatedMessage
    });

  } catch (err) {
    console.error('Share streak error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

module.exports = router;