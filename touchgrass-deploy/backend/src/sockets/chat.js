const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const { ERROR_CODES, SOCKET_EVENTS } = require('../config/constants');

/**
 * Chat Socket Handler
 * Real-time chat functionality with authentication, typing indicators, read receipts, etc.
 */

class ChatSocketHandler {
  constructor(io) {
    this.io = io;
    this.userSockets = new Map(); // userId -> socketId
    this.onlineUsers = new Set(); // Set of online user IDs
    this.typingUsers = new Map(); // chatId -> Set of typing userIds
    
    this.initialize();
  }

  /**
   * Initialize Socket.IO namespace and middleware
   */
  initialize() {
    // Chat namespace
    this.chatNamespace = this.io.of('/chat');
    
    // Authentication middleware
    this.chatNamespace.use(this.authenticateSocket.bind(this));
    
    // Connection handler
    this.chatNamespace.on('connection', this.handleConnection.bind(this));
    
    console.log('Chat Socket Handler initialized');
  }

  /**
   * Authenticate socket connection
   */
  async authenticateSocket(socket, next) {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('_id username displayName avatar subscription');
      
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
    console.log(`User connected: ${socket.userId} (${socket.id})`);
    
    // Track user socket
    this.userSockets.set(socket.userId.toString(), socket.id);
    this.onlineUsers.add(socket.userId.toString());
    
    // Notify user's contacts about online status
    this.notifyOnlineStatus(socket.userId, true);
    
    // Join user's personal room for notifications
    socket.join(`user:${socket.userId}`);
    
    // Join all user's active chats
    await this.joinUserChats(socket);
    
    // Socket event handlers
    this.setupEventHandlers(socket);
    
    // Handle disconnection
    socket.on('disconnect', () => this.handleDisconnect(socket));
    socket.on('error', (error) => this.handleError(socket, error));
  }

  /**
   * Join all user's active chat rooms
   */
  async joinUserChats(socket) {
    try {
      const chats = await Chat.find({
        participants: socket.userId,
        $or: [
          { type: 'direct' },
          { type: 'group' },
          { type: 'challenge' }
        ]
      });

      for (const chat of chats) {
        socket.join(`chat:${chat._id}`);
        console.log(`User ${socket.userId} joined chat: ${chat._id}`);
      }
    } catch (error) {
      console.error('Error joining user chats:', error);
    }
  }

  /**
   * Setup socket event handlers
   */
  setupEventHandlers(socket) {
    // Send message
    socket.on(SOCKET_EVENTS.SEND_MESSAGE, this.handleSendMessage.bind(this, socket));
    
    // Typing indicator
    socket.on(SOCKET_EVENTS.TYPING_START, this.handleTypingStart.bind(this, socket));
    socket.on(SOCKET_EVENTS.TYPING_STOP, this.handleTypingStop.bind(this, socket));
    
    // Read receipt
    socket.on(SOCKET_EVENTS.MESSAGE_READ, this.handleMessageRead.bind(this, socket));
    
    // Reaction to message
    socket.on(SOCKET_EVENTS.MESSAGE_REACTION, this.handleMessageReaction.bind(this, socket));
    
    // Delete message
    socket.on(SOCKET_EVENTS.DELETE_MESSAGE, this.handleDeleteMessage.bind(this, socket));
    
    // Edit message
    socket.on(SOCKET_EVENTS.EDIT_MESSAGE, this.handleEditMessage.bind(this, socket));
    
    // Join/leave chat
    socket.on(SOCKET_EVENTS.JOIN_CHAT, this.handleJoinChat.bind(this, socket));
    socket.on(SOCKET_EVENTS.LEAVE_CHAT, this.handleLeaveChat.bind(this, socket));
    
    // Create chat
    socket.on(SOCKET_EVENTS.CREATE_CHAT, this.handleCreateChat.bind(this, socket));
    
    // Add/remove participants
    socket.on(SOCKET_EVENTS.ADD_PARTICIPANT, this.handleAddParticipant.bind(this, socket));
    socket.on(SOCKET_EVENTS.REMOVE_PARTICIPANT, this.handleRemoveParticipant.bind(this, socket));
    
    // Chat settings update
    socket.on(SOCKET_EVENTS.UPDATE_CHAT_SETTINGS, this.handleUpdateChatSettings.bind(this, socket));
    
    // Call events (future feature)
    socket.on(SOCKET_EVENTS.CALL_START, this.handleCallStart.bind(this, socket));
    socket.on(SOCKET_EVENTS.CALL_END, this.handleCallEnd.bind(this, socket));
    socket.on(SOCKET_EVENTS.CALL_OFFER, this.handleCallOffer.bind(this, socket));
    socket.on(SOCKET_EVENTS.CALL_ANSWER, this.handleCallAnswer.bind(this, socket));
    socket.on(SOCKET_EVENTS.CALL_ICE_CANDIDATE, this.handleCallIceCandidate.bind(this, socket));
    
    // Presence check
    socket.on(SOCKET_EVENTS.CHECK_PRESENCE, this.handleCheckPresence.bind(this, socket));
  }

  /**
   * Handle sending a message
   */
  async handleSendMessage(socket, data) {
    try {
      const { chatId, text, type = 'text', attachments = [], metadata = {} } = data;
      
      // Validate input
      if (!chatId || !text?.trim()) {
        return socket.emit(SOCKET_EVENTS.ERROR, { message: 'Missing required fields' });
      }

      // Verify user is a participant
      const chat = await Chat.findOne({
        _id: chatId,
        participants: socket.userId
      });

      if (!chat) {
        return socket.emit(SOCKET_EVENTS.ERROR, { message: 'Not a participant in this chat' });
      }

      // Check if user is muted in this chat
      if (chat.settings?.mutedBy?.includes(socket.userId)) {
        return socket.emit(SOCKET_EVENTS.ERROR, { message: 'You are muted in this chat' });
      }

      // Create message
      const message = new Message({
        chatId,
        sender: socket.userId,
        text: text.trim(),
        type,
        attachments,
        metadata,
        readBy: [socket.userId]
      });

      await message.save();

      // Populate sender info
      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'displayName username avatar')
        .populate('reactions.userId', 'displayName avatar')
        .lean();

      // Update chat's last message
      chat.lastMessage = {
        text: text.substring(0, 100),
        sender: socket.userId,
        timestamp: new Date(),
        readBy: [socket.userId]
      };
      chat.updatedAt = new Date();
      await chat.save();

      // Broadcast to chat room
      this.chatNamespace.to(`chat:${chatId}`).emit(SOCKET_EVENTS.NEW_MESSAGE, {
        chatId,
        message: populatedMessage
      });

      // Create notifications for other participants
      await this.createMessageNotifications(chat, message, socket.userId);

      // Update typing indicator
      this.typingUsers.delete(chatId);

      // Log message
      console.log(`Message sent in chat ${chatId} by ${socket.userId}`, {
        type,
        attachments: attachments.length,
        chatType: chat.type
      });

    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to send message' });
    }
  }

  /**
   * Create notifications for new message
   */
  async createMessageNotifications(chat, message, senderId) {
    try {
      const notifications = [];
      const now = new Date();

      for (const participantId of chat.participants) {
        if (participantId.toString() === senderId.toString()) continue;

        // Check if participant has notifications enabled
        const user = await User.findById(participantId).select('preferences');
        if (!user?.preferences?.notifications?.chatMessages) continue;

        // Create notification
        const notification = new Notification({
          userId: participantId,
          type: 'new_message',
          title: 'New Message',
          message: `${message.sender.displayName}: ${message.text.substring(0, 50)}...`,
          data: {
            chatId: chat._id,
            messageId: message._id,
            senderId: senderId,
            chatType: chat.type
          },
          priority: 'medium'
        });

        notifications.push(notification.save());

        // Send real-time notification if user is online
        const participantSocketId = this.userSockets.get(participantId.toString());
        if (participantSocketId) {
          this.chatNamespace.to(participantSocketId).emit(SOCKET_EVENTS.NOTIFICATION, {
            type: 'new_message',
            chatId: chat._id,
            messageId: message._id,
            preview: message.text.substring(0, 50),
            sender: message.sender.displayName,
            timestamp: now
          });
        }
      }

      await Promise.all(notifications);
    } catch (error) {
      console.error('Error creating notifications:', error);
    }
  }

  /**
   * Handle typing start
   */
  async handleTypingStart(socket, data) {
    try {
      const { chatId } = data;
      
      if (!chatId) return;

      // Verify user is a participant
      const chat = await Chat.findOne({
        _id: chatId,
        participants: socket.userId
      });

      if (!chat) return;

      // Add user to typing set for this chat
      if (!this.typingUsers.has(chatId)) {
        this.typingUsers.set(chatId, new Set());
      }
      this.typingUsers.get(chatId).add(socket.userId.toString());

      // Notify other participants
      socket.to(`chat:${chatId}`).emit(SOCKET_EVENTS.USER_TYPING, {
        chatId,
        userId: socket.userId,
        isTyping: true,
        displayName: socket.user.displayName
      });

      // Set timeout to auto-remove typing indicator after 5 seconds
      setTimeout(() => {
        this.handleTypingStop(socket, { chatId });
      }, 5000);

    } catch (error) {
      console.error('Error handling typing start:', error);
    }
  }

  /**
   * Handle typing stop
   */
  async handleTypingStop(socket, data) {
    try {
      const { chatId } = data;
      
      if (!chatId) return;

      // Remove user from typing set
      if (this.typingUsers.has(chatId)) {
        this.typingUsers.get(chatId).delete(socket.userId.toString());
        
        // Clean up empty set
        if (this.typingUsers.get(chatId).size === 0) {
          this.typingUsers.delete(chatId);
        }
      }

      // Notify other participants
      socket.to(`chat:${chatId}`).emit(SOCKET_EVENTS.USER_TYPING, {
        chatId,
        userId: socket.userId,
        isTyping: false
      });

    } catch (error) {
      console.error('Error handling typing stop:', error);
    }
  }

  /**
   * Handle message read receipt
   */
  async handleMessageRead(socket, data) {
    try {
      const { messageId, chatId } = data;
      
      if (!messageId || !chatId) return;

      // Update message read status
      const message = await Message.findById(messageId);
      if (!message) return;

      if (!message.readBy.includes(socket.userId)) {
        message.readBy.push(socket.userId);
        await message.save();

        // Notify sender that message was read
        const senderSocketId = this.userSockets.get(message.sender.toString());
        if (senderSocketId) {
          this.chatNamespace.to(senderSocketId).emit(SOCKET_EVENTS.MESSAGE_READ_RECEIPT, {
            messageId,
            chatId,
            readBy: socket.userId,
            readAt: new Date()
          });
        }

        // Update chat's last message read status
        const chat = await Chat.findById(chatId);
        if (chat && chat.lastMessage && !chat.lastMessage.readBy.includes(socket.userId)) {
          chat.lastMessage.readBy.push(socket.userId);
          await chat.save();
        }
      }

    } catch (error) {
      console.error('Error handling message read:', error);
    }
  }

  /**
   * Handle message reaction
   */
  async handleMessageReaction(socket, data) {
    try {
      const { messageId, chatId, emoji } = data;
      
      if (!messageId || !chatId || !emoji) return;

      const message = await Message.findById(messageId);
      if (!message) return;

      // Add or update reaction
      const existingIndex = message.reactions.findIndex(
        r => r.userId.toString() === socket.userId.toString()
      );

      if (existingIndex > -1) {
        if (message.reactions[existingIndex].emoji === emoji) {
          // Remove reaction if same emoji
          message.reactions.splice(existingIndex, 1);
        } else {
          // Update reaction
          message.reactions[existingIndex].emoji = emoji;
          message.reactions[existingIndex].timestamp = new Date();
        }
      } else {
        // Add new reaction
        message.reactions.push({
          userId: socket.userId,
          emoji,
          timestamp: new Date()
        });
      }

      await message.save();

      // Broadcast updated reactions
      this.chatNamespace.to(`chat:${chatId}`).emit(SOCKET_EVENTS.MESSAGE_REACTION_UPDATED, {
        messageId,
        chatId,
        reactions: message.reactions,
        updatedBy: socket.userId
      });

    } catch (error) {
      console.error('Error handling message reaction:', error);
    }
  }

  /**
   * Handle message deletion
   */
  async handleDeleteMessage(socket, data) {
    try {
      const { messageId, chatId, deleteForEveryone = false } = data;
      
      if (!messageId || !chatId) return;

      const message = await Message.findById(messageId);
      if (!message) return;

      // Check permissions
      const isSender = message.sender.toString() === socket.userId.toString();
      const isAdmin = false; // Could check if user is chat admin

      if (!isSender && !isAdmin && !deleteForEveryone) {
        return socket.emit(SOCKET_EVENTS.ERROR, { message: 'Not authorized to delete this message' });
      }

      if (deleteForEveryone && !isSender && !isAdmin) {
        return socket.emit(SOCKET_EVENTS.ERROR, { message: 'Not authorized to delete for everyone' });
      }

      if (deleteForEveryone) {
        // Delete for everyone
        message.isDeleted = true;
        message.deletedFor = [];
      } else {
        // Delete for user only
        if (!message.deletedFor.includes(socket.userId)) {
          message.deletedFor.push(socket.userId);
        }
      }

      await message.save();

      // Broadcast deletion
      this.chatNamespace.to(`chat:${chatId}`).emit(SOCKET_EVENTS.MESSAGE_DELETED, {
        messageId,
        chatId,
        deletedForEveryone,
        deletedBy: socket.userId
      });

    } catch (error) {
      console.error('Error handling message deletion:', error);
    }
  }

  /**
   * Handle message edit
   */
  async handleEditMessage(socket, data) {
    try {
      const { messageId, chatId, newText } = data;
      
      if (!messageId || !chatId || !newText?.trim()) return;

      const message = await Message.findById(messageId);
      if (!message) return;

      // Check if user is sender
      if (message.sender.toString() !== socket.userId.toString()) {
        return socket.emit(SOCKET_EVENTS.ERROR, { message: 'Not authorized to edit this message' });
      }

      // Check edit time limit (15 minutes)
      const editTimeLimit = 15 * 60 * 1000; // 15 minutes
      const timeSinceCreation = Date.now() - message.createdAt.getTime();
      
      if (timeSinceCreation > editTimeLimit) {
        return socket.emit(SOCKET_EVENTS.ERROR, { message: 'Message can only be edited within 15 minutes' });
      }

      // Update message
      message.text = newText.trim();
      message.isEdited = true;
      message.editedAt = new Date();
      await message.save();

      // Broadcast edit
      this.chatNamespace.to(`chat:${chatId}`).emit(SOCKET_EVENTS.MESSAGE_EDITED, {
        messageId,
        chatId,
        newText: message.text,
        editedAt: message.editedAt,
        editedBy: socket.userId
      });

    } catch (error) {
      console.error('Error handling message edit:', error);
    }
  }

  /**
   * Handle joining a chat
   */
  async handleJoinChat(socket, data) {
    try {
      const { chatId } = data;
      
      if (!chatId) return;

      const chat = await Chat.findById(chatId);
      if (!chat) return;

      // Check if user is a participant
      if (!chat.participants.includes(socket.userId)) {
        return socket.emit(SOCKET_EVENTS.ERROR, { message: 'Not a participant in this chat' });
      }

      socket.join(`chat:${chatId}`);
      
      // Notify others
      socket.to(`chat:${chatId}`).emit(SOCKET_EVENTS.USER_JOINED_CHAT, {
        chatId,
        userId: socket.userId,
        displayName: socket.user.displayName,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Error handling join chat:', error);
    }
  }

  /**
   * Handle leaving a chat
   */
  async handleLeaveChat(socket, data) {
    try {
      const { chatId } = data;
      
      if (!chatId) return;

      socket.leave(`chat:${chatId}`);
      
      // Notify others
      socket.to(`chat:${chatId}`).emit(SOCKET_EVENTS.USER_LEFT_CHAT, {
        chatId,
        userId: socket.userId,
        displayName: socket.user.displayName,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Error handling leave chat:', error);
    }
  }

  /**
   * Handle creating a new chat
   */
  async handleCreateChat(socket, data) {
    try {
      const { participants, type = 'direct', name, isChallenge = false } = data;
      
      if (!participants || !Array.isArray(participants)) {
        return socket.emit(SOCKET_EVENTS.ERROR, { message: 'Invalid participants' });
      }

      // Add current user to participants if not already included
      const allParticipants = [...new Set([...participants, socket.userId.toString()])];

      // Create chat
      const chat = new Chat({
        participants: allParticipants,
        type,
        name: type === 'direct' ? undefined : name,
        isChallengeChat: isChallenge
      });

      await chat.save();

      // Populate participants
      const populatedChat = await Chat.findById(chat._id)
        .populate('participants', 'displayName username avatar')
        .lean();

      // Notify all participants
      for (const participantId of allParticipants) {
        const participantSocketId = this.userSockets.get(participantId);
        if (participantSocketId) {
          this.chatNamespace.to(participantSocketId).emit(SOCKET_EVENTS.CHAT_CREATED, {
            chat: populatedChat
          });
        }
        
        // Auto-join creator to chat room
        if (participantId === socket.userId.toString()) {
          socket.join(`chat:${chat._id}`);
        }
      }

    } catch (error) {
      console.error('Error handling create chat:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to create chat' });
    }
  }

  /**
   * Handle adding participant to chat
   */
  async handleAddParticipant(socket, data) {
    try {
      const { chatId, userId } = data;
      
      if (!chatId || !userId) return;

      const chat = await Chat.findById(chatId);
      if (!chat) return;

      // Check permissions (only participants can add others)
      if (!chat.participants.includes(socket.userId)) {
        return socket.emit(SOCKET_EVENTS.ERROR, { message: 'Not a participant in this chat' });
      }

      // Check if user is already a participant
      if (chat.participants.includes(userId)) {
        return socket.emit(SOCKET_EVENTS.ERROR, { message: 'User already in chat' });
      }

      // Add user to chat
      chat.participants.push(userId);
      await chat.save();

      // Notify chat participants
      this.chatNamespace.to(`chat:${chatId}`).emit(SOCKET_EVENTS.PARTICIPANT_ADDED, {
        chatId,
        addedBy: socket.userId,
        addedUserId: userId,
        timestamp: new Date()
      });

      // Notify added user if online
      const addedUserSocketId = this.userSockets.get(userId.toString());
      if (addedUserSocketId) {
        this.chatNamespace.to(addedUserSocketId).emit(SOCKET_EVENTS.ADDED_TO_CHAT, {
          chatId,
          addedBy: socket.userId,
          chatName: chat.name
        });
      }

    } catch (error) {
      console.error('Error handling add participant:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to add participant' });
    }
  }

  /**
   * Handle removing participant from chat
   */
  async handleRemoveParticipant(socket, data) {
    try {
      const { chatId, userId } = data;
      
      if (!chatId || !userId) return;

      const chat = await Chat.findById(chatId);
      if (!chat) return;

      // Check permissions (only participants can remove others, can't remove self)
      if (!chat.participants.includes(socket.userId) || socket.userId.toString() === userId) {
        return socket.emit(SOCKET_EVENTS.ERROR, { message: 'Not authorized to remove this user' });
      }

      // Remove user from chat
      chat.participants = chat.participants.filter(
        participantId => participantId.toString() !== userId
      );
      await chat.save();

      // Notify chat participants
      this.chatNamespace.to(`chat:${chatId}`).emit(SOCKET_EVENTS.PARTICIPANT_REMOVED, {
        chatId,
        removedBy: socket.userId,
        removedUserId: userId,
        timestamp: new Date()
      });

      // Notify removed user if online
      const removedUserSocketId = this.userSockets.get(userId.toString());
      if (removedUserSocketId) {
        this.chatNamespace.to(removedUserSocketId).emit(SOCKET_EVENTS.REMOVED_FROM_CHAT, {
          chatId,
          removedBy: socket.userId,
          chatName: chat.name
        });
      }

    } catch (error) {
      console.error('Error handling remove participant:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to remove participant' });
    }
  }

  /**
   * Handle chat settings update
   */
  async handleUpdateChatSettings(socket, data) {
    try {
      const { chatId, settings } = data;
      
      if (!chatId || !settings) return;

      const chat = await Chat.findById(chatId);
      if (!chat) return;

      // Check permissions
      if (!chat.participants.includes(socket.userId)) {
        return socket.emit(SOCKET_EVENTS.ERROR, { message: 'Not a participant in this chat' });
      }

      // Update settings
      chat.settings = { ...chat.settings, ...settings };
      await chat.save();

      // Notify chat participants
      this.chatNamespace.to(`chat:${chatId}`).emit(SOCKET_EVENTS.CHAT_SETTINGS_UPDATED, {
        chatId,
        updatedBy: socket.userId,
        settings: chat.settings,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Error handling chat settings update:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to update chat settings' });
    }
  }

  /**
   * Handle call start (WebRTC signaling)
   */
  async handleCallStart(socket, data) {
    try {
      const { chatId, callType = 'audio' } = data;
      
      if (!chatId) return;

      // Verify user is a participant
      const chat = await Chat.findOne({
        _id: chatId,
        participants: socket.userId
      });

      if (!chat) return;

      // Notify other participants
      socket.to(`chat:${chatId}`).emit(SOCKET_EVENTS.CALL_STARTED, {
        chatId,
        callType,
        initiatedBy: socket.userId,
        callId: `${chatId}_${Date.now()}`,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Error handling call start:', error);
    }
  }

  /**
   * Handle call end
   */
  async handleCallEnd(socket, data) {
    try {
      const { chatId, callId } = data;
      
      if (!chatId || !callId) return;

      // Notify other participants
      socket.to(`chat:${chatId}`).emit(SOCKET_EVENTS.CALL_ENDED, {
        chatId,
        callId,
        endedBy: socket.userId,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Error handling call end:', error);
    }
  }

  /**
   * Handle WebRTC offer
   */
  async handleCallOffer(socket, data) {
    try {
      const { chatId, callId, offer, targetUserId } = data;
      
      if (!chatId || !callId || !offer || !targetUserId) return;

      // Send offer to specific user
      const targetSocketId = this.userSockets.get(targetUserId.toString());
      if (targetSocketId) {
        this.chatNamespace.to(targetSocketId).emit(SOCKET_EVENTS.CALL_OFFER_RECEIVED, {
          chatId,
          callId,
          offer,
          fromUserId: socket.userId
        });
      }

    } catch (error) {
      console.error('Error handling call offer:', error);
    }
  }

  /**
   * Handle WebRTC answer
   */
  async handleCallAnswer(socket, data) {
    try {
      const { chatId, callId, answer, targetUserId } = data;
      
      if (!chatId || !callId || !answer || !targetUserId) return;

      // Send answer to specific user
      const targetSocketId = this.userSockets.get(targetUserId.toString());
      if (targetSocketId) {
        this.chatNamespace.to(targetSocketId).emit(SOCKET_EVENTS.CALL_ANSWER_RECEIVED, {
          chatId,
          callId,
          answer,
          fromUserId: socket.userId
        });
      }

    } catch (error) {
      console.error('Error handling call answer:', error);
    }
  }

  /**
   * Handle WebRTC ICE candidate
   */
  async handleCallIceCandidate(socket, data) {
    try {
      const { chatId, callId, candidate, targetUserId } = data;
      
      if (!chatId || !callId || !candidate || !targetUserId) return;

      // Send ICE candidate to specific user
      const targetSocketId = this.userSockets.get(targetUserId.toString());
      if (targetSocketId) {
        this.chatNamespace.to(targetSocketId).emit(SOCKET_EVENTS.CALL_ICE_CANDIDATE_RECEIVED, {
          chatId,
          callId,
          candidate,
          fromUserId: socket.userId
        });
      }

    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  }

  /**
   * Handle presence check
   */
  async handleCheckPresence(socket, data) {
    try {
      const { userId } = data;
      
      if (!userId) return;

      const isOnline = this.onlineUsers.has(userId.toString());
      const lastSeen = isOnline ? new Date() : null; // In production, track last seen timestamp

      socket.emit(SOCKET_EVENTS.PRESENCE_STATUS, {
        userId,
        isOnline,
        lastSeen
      });

    } catch (error) {
      console.error('Error handling presence check:', error);
    }
  }

  /**
   * Notify contacts about user's online status
   */
  async notifyOnlineStatus(userId, isOnline) {
    try {
      // Get user's contacts (people they chat with)
      const chats = await Chat.find({
        participants: userId,
        type: 'direct'
      });

      const contactIds = new Set();
      chats.forEach(chat => {
        chat.participants.forEach(participantId => {
          if (participantId.toString() !== userId.toString()) {
            contactIds.add(participantId.toString());
          }
        });
      });

      // Notify each contact
      for (const contactId of contactIds) {
        const contactSocketId = this.userSockets.get(contactId);
        if (contactSocketId) {
          this.chatNamespace.to(contactSocketId).emit(SOCKET_EVENTS.USER_PRESENCE_CHANGED, {
            userId,
            isOnline,
            timestamp: new Date()
          });
        }
      }

    } catch (error) {
      console.error('Error notifying online status:', error);
    }
  }

  /**
   * Handle socket disconnection
   */
  async handleDisconnect(socket) {
    console.log(`User disconnected: ${socket.userId} (${socket.id})`);
    
    // Update tracking
    this.userSockets.delete(socket.userId.toString());
    this.onlineUsers.delete(socket.userId.toString());
    
    // Notify contacts
    this.notifyOnlineStatus(socket.userId, false);
    
    // Clean up typing indicators
    for (const [chatId, typingSet] of this.typingUsers.entries()) {
      typingSet.delete(socket.userId.toString());
      if (typingSet.size === 0) {
        this.typingUsers.delete(chatId);
      }
    }
  }

  /**
   * Handle socket errors
   */
  handleError(socket, error) {
    console.error(`Socket error for user ${socket.userId}:`, error);
    
    // Log error for monitoring
    console.error('Socket error details:', {
      userId: socket.userId,
      socketId: socket.id,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get online users count
   */
  getOnlineUsersCount() {
    return this.onlineUsers.size;
  }

  /**
   * Get user's socket ID
   */
  getUserSocketId(userId) {
    return this.userSockets.get(userId.toString());
  }

  /**
   * Check if user is online
   */
  isUserOnline(userId) {
    return this.onlineUsers.has(userId.toString());
  }

  /**
   * Send direct message to user
   */
  sendToUser(userId, event, data) {
    const socketId = this.getUserSocketId(userId);
    if (socketId) {
      this.chatNamespace.to(socketId).emit(event, data);
      return true;
    }
    return false;
  }

  /**
   * Broadcast to all users
   */
  broadcast(event, data) {
    this.chatNamespace.emit(event, data);
  }

  /**
   * Broadcast to chat room
   */
  broadcastToChat(chatId, event, data) {
    this.chatNamespace.to(`chat:${chatId}`).emit(event, data);
  }
}

module.exports = ChatSocketHandler;