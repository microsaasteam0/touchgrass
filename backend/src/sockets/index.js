const { Server } = require('socket.io');
const http = require('http');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ERROR_CODES, SOCKET_EVENTS } = require('../config/constants');

/**
 * Main Socket.IO Server
 * Orchestrates all socket namespaces and handles core socket functionality
 */

class SocketServer {
  constructor(server) {
    if (!server) {
      throw new Error('HTTP server instance required');
    }

    this.server = server;
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST']
      },
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000,
      maxHttpBufferSize: 1e8, // 100MB
      connectTimeout: 45000
    });

    this.handlers = new Map();
    this.stats = {
      totalConnections: 0,
      activeConnections: 0,
      peakConnections: 0,
      connectionsByHour: {},
      errors: 0,
      messagesSent: 0,
      messagesReceived: 0
    };

    this.initialize();
  }

  /**
   * Initialize Socket.IO server
   */
  initialize() {
    console.log('Initializing Socket.IO server...');
    
    // Global middleware
    this.io.use(this.globalMiddleware.bind(this));
    
    // Global connection handler
    this.io.on('connection', this.handleGlobalConnection.bind(this));
    
    // Error handling
    this.io.on('error', this.handleGlobalError.bind(this));
    
    // Load socket handlers
    this.loadHandlers();
    
    // Start statistics collection
    this.startStatsCollection();
    
    console.log('Socket.IO server initialized');
  }

  /**
   * Global middleware for all connections
   * Handles both Supabase JWTs and custom JWT tokens
   */
  async globalMiddleware(socket, next) {
    try {
      // Extract and verify token
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        // Allow connection for public namespaces only
        if (socket.nsp.name === '/') {
          return next();
        }
        return next(new Error('Authentication required'));
      }

      // Try to decode as Supabase token first (they use RS256, we can't verify)
      const decoded = jwt.decode(token, { complete: true });
      
      let user;
      
      if (decoded && decoded.payload) {
        // This looks like a Supabase token (has 'sub' claim, uses RS256)
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
          }).select('_id username displayName avatar subscription');
        }
      } else {
        // Fallback: try to verify as custom JWT
        try {
          const customDecoded = jwt.verify(token, process.env.JWT_SECRET);
          user = await User.findById(customDecoded.userId).select('_id username displayName avatar subscription');
        } catch (verifyError) {
          // Token is neither valid Supabase token nor valid custom token
          console.error('Token verification failed:', verifyError.message);
        }
      }
      
      if (!user) {
        return next(new Error('User not found'));
      }

      // Attach user info to socket
      socket.userId = user._id;
      socket.user = user;
      
      next();
    } catch (error) {
      console.error('Global socket middleware error:', error);
      
      if (error.name === 'JsonWebTokenError') {
        return next(new Error('Invalid token'));
      }
      
      if (error.name === 'TokenExpiredError') {
        return next(new Error('Token expired'));
      }
      
      next(new Error('Authentication failed'));
    }
  }

  /**
   * Handle global connection
   */
  handleGlobalConnection(socket) {
    // Update statistics
    this.updateConnectionStats('connect');
    
    console.log(`Global socket connected: ${socket.id} ${socket.userId ? `(user: ${socket.userId})` : ''}`);
    
    // Set up global event handlers
    this.setupGlobalHandlers(socket);
    
    // Join user to their personal room if authenticated
    if (socket.userId) {
      socket.join(`global:user:${socket.userId}`);
    }
    
    // Send connection acknowledgment
    socket.emit(SOCKET_EVENTS.CONNECTED, {
      socketId: socket.id,
      userId: socket.userId,
      timestamp: new Date().toISOString(),
      serverTime: Date.now()
    });
    
    // Handle disconnection
    socket.on('disconnect', (reason) => this.handleGlobalDisconnect(socket, reason));
    
    // Handle errors
    socket.on('error', (error) => this.handleSocketError(socket, error));
  }

  /**
   * Setup global event handlers
   */
  setupGlobalHandlers(socket) {
    // Ping/pong for connection health
    socket.on(SOCKET_EVENTS.PING, () => {
      socket.emit(SOCKET_EVENTS.PONG, { timestamp: Date.now() });
    });
    
    // Get connection info
    socket.on(SOCKET_EVENTS.GET_CONNECTION_INFO, () => {
      socket.emit(SOCKET_EVENTS.CONNECTION_INFO, {
        socketId: socket.id,
        userId: socket.userId,
        connectedAt: socket.connectedAt,
        transport: socket.conn.transport.name,
        serverTime: Date.now(),
        stats: {
          totalConnections: this.stats.totalConnections,
          activeConnections: this.stats.activeConnections
        }
      });
    });
    
    // Broadcast message (admin only)
    socket.on(SOCKET_EVENTS.BROADCAST_MESSAGE, (data) => {
      if (this.isAdmin(socket)) {
        this.broadcastToAll(data.event, data.payload);
      }
    });
    
    // Get server stats (admin only)
    socket.on(SOCKET_EVENTS.GET_SERVER_STATS, () => {
      if (this.isAdmin(socket)) {
        socket.emit(SOCKET_EVENTS.SERVER_STATS, this.getStats());
      }
    });
    
    // Subscribe to room
    socket.on(SOCKET_EVENTS.SUBSCRIBE_ROOM, (room) => {
      if (room && typeof room === 'string') {
        socket.join(room);
        socket.emit(SOCKET_EVENTS.SUBSCRIBED, { room });
      }
    });
    
    // Unsubscribe from room
    socket.on(SOCKET_EVENTS.UNSUBSCRIBE_ROOM, (room) => {
      if (room && typeof room === 'string') {
        socket.leave(room);
        socket.emit(SOCKET_EVENTS.UNSUBSCRIBED, { room });
      }
    });
  }

  /**
   * Handle global disconnection
   */
  handleGlobalDisconnect(socket, reason) {
    this.updateConnectionStats('disconnect');
    
    console.log(`Global socket disconnected: ${socket.id} - Reason: ${reason}`, {
      userId: socket.userId,
      rooms: Array.from(socket.rooms),
      transport: socket.conn.transport.name,
      duration: socket.connectedAt ? Date.now() - socket.connectedAt : 0
    });
    
    // Clean up user rooms
    if (socket.userId) {
      socket.leave(`global:user:${socket.userId}`);
    }
    
    // Notify handlers about disconnection
    this.handlers.forEach(handler => {
      if (handler.handleDisconnect) {
        handler.handleDisconnect(socket);
      }
    });
  }

  /**
   * Handle socket errors
   */
  handleSocketError(socket, error) {
    console.error(`Socket error: ${socket.id}`, {
      userId: socket.userId,
      error: error.message,
      stack: error.stack
    });
    
    this.stats.errors++;
    
    // Send error to client (without sensitive details)
    socket.emit(SOCKET_EVENTS.ERROR, {
      message: 'An error occurred',
      code: ERROR_CODES.INTERNAL_ERROR
    });
  }

  /**
   * Handle global server errors
   */
  handleGlobalError(error) {
    console.error('Global Socket.IO server error:', error);
    this.stats.errors++;
  }

  /**
   * Load socket handlers
   */
  loadHandlers() {
    try {
      // Dynamically load handlers
      const ChatSocketHandler = require('./chat');
      const NotificationSocketHandler = require('./notifications');
      
      // Initialize handlers
      this.handlers.set('chat', new ChatSocketHandler(this.io));
      this.handlers.set('notifications', new NotificationSocketHandler(this.io));
      
      console.log(`Loaded ${this.handlers.size} socket handlers`);
      
    } catch (error) {
      console.error('Error loading socket handlers:', error);
      throw error;
    }
  }

  /**
   * Get specific handler
   */
  getHandler(name) {
    return this.handlers.get(name);
  }

  /**
   * Register custom handler
   */
  registerHandler(name, handler) {
    if (this.handlers.has(name)) {
      console.warn(`Handler "${name}" already exists, replacing`);
    }
    
    this.handlers.set(name, handler);
    console.log(`Registered custom handler: ${name}`);
  }

  /**
   * Update connection statistics
   */
  updateConnectionStats(action) {
    const hour = new Date().getHours();
    
    if (action === 'connect') {
      this.stats.totalConnections++;
      this.stats.activeConnections++;
      
      if (this.stats.activeConnections > this.stats.peakConnections) {
        this.stats.peakConnections = this.stats.activeConnections;
      }
      
      // Track connections by hour
      if (!this.stats.connectionsByHour[hour]) {
        this.stats.connectionsByHour[hour] = 0;
      }
      this.stats.connectionsByHour[hour]++;
      
    } else if (action === 'disconnect') {
      this.stats.activeConnections = Math.max(0, this.stats.activeConnections - 1);
    }
  }

  /**
   * Start statistics collection
   */
  startStatsCollection() {
    // Reset hourly stats every hour
    setInterval(() => {
      this.stats.connectionsByHour = {};
    }, 60 * 60 * 1000);
    
    // Log stats every 5 minutes
    setInterval(() => {
      this.logStats();
    }, 5 * 60 * 1000);
  }

  /**
   * Log server statistics
   */
  logStats() {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    console.log('Socket.IO Server Stats:', {
      timestamp: new Date().toISOString(),
      connections: {
        total: this.stats.totalConnections,
        active: this.stats.activeConnections,
        peak: this.stats.peakConnections
      },
      messages: {
        sent: this.stats.messagesSent,
        received: this.stats.messagesReceived
      },
      errors: this.stats.errors,
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`
      },
      uptime: `${Math.round(uptime / 60)} minutes`,
      handlers: Array.from(this.handlers.keys())
    });
  }

  /**
   * Get server statistics
   */
  getStats() {
    const memoryUsage = process.memoryUsage();
    
    return {
      ...this.stats,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external
      },
      activeHandlers: Array.from(this.handlers.keys()),
      totalNamespaces: this.io._nsps.size
    };
  }

  /**
   * Check if socket belongs to admin user
   */
  isAdmin(socket) {
    return socket.user?.subscription?.plan === 'admin' || 
           socket.user?.role === 'admin';
  }

  /**
   * Send message to specific user
   */
  sendToUser(userId, event, data) {
    this.io.to(`global:user:${userId}`).emit(event, data);
    this.stats.messagesSent++;
  }

  /**
   * Send message to specific socket
   */
  sendToSocket(socketId, event, data) {
    const socket = this.io.sockets.sockets.get(socketId);
    if (socket) {
      socket.emit(event, data);
      this.stats.messagesSent++;
      return true;
    }
    return false;
  }

  /**
   * Broadcast to all connected sockets
   */
  broadcastToAll(event, data) {
    this.io.emit(event, data);
    this.stats.messagesSent++;
  }

  /**
   * Broadcast to specific room
   */
  broadcastToRoom(room, event, data) {
    this.io.to(room).emit(event, data);
    this.stats.messagesSent++;
  }

  /**
   * Get all connected user IDs
   */
  getConnectedUserIds() {
    const userIds = new Set();
    
    for (const socket of this.io.sockets.sockets.values()) {
      if (socket.userId) {
        userIds.add(socket.userId.toString());
      }
    }
    
    return Array.from(userIds);
  }

  /**
   * Get socket by user ID
   */
  getSocketByUserId(userId) {
    for (const socket of this.io.sockets.sockets.values()) {
      if (socket.userId && socket.userId.toString() === userId.toString()) {
        return socket;
      }
    }
    return null;
  }

  /**
   * Get all sockets in a room
   */
  getSocketsInRoom(room) {
    const roomSockets = this.io.sockets.adapter.rooms.get(room);
    if (!roomSockets) return [];
    
    return Array.from(roomSockets).map(socketId => 
      this.io.sockets.sockets.get(socketId)
    ).filter(Boolean);
  }

  /**
   * Health check endpoint
   */
  getHealthStatus() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      connections: this.stats.activeConnections,
      uptime: process.uptime(),
      memory: {
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal
      }
    };
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    console.log('Shutting down Socket.IO server...');
    
    // Notify all connected clients
    this.broadcastToAll(SOCKET_EVENTS.SERVER_SHUTDOWN, {
      message: 'Server is shutting down for maintenance',
      reconnectAfter: 30000 // 30 seconds
    });
    
    // Close all connections
    this.io.sockets.sockets.forEach(socket => {
      socket.disconnect(true);
    });
    
    // Close server
    return new Promise((resolve) => {
      this.io.close(() => {
        console.log('Socket.IO server shutdown complete');
        resolve();
      });
    });
  }
}

/**
 * Socket event constants (add to config/constants.js)
 */
const SOCKET_EVENTS = {
  // Connection events
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  CONNECTION_INFO: 'connection_info',
  GET_CONNECTION_INFO: 'get_connection_info',
  PING: 'ping',
  PONG: 'pong',
  
  // Chat events
  SEND_MESSAGE: 'send_message',
  NEW_MESSAGE: 'new_message',
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  USER_TYPING: 'user_typing',
  MESSAGE_READ: 'message_read',
  MESSAGE_READ_RECEIPT: 'message_read_receipt',
  MESSAGE_REACTION: 'message_reaction',
  MESSAGE_REACTION_UPDATED: 'message_reaction_updated',
  DELETE_MESSAGE: 'delete_message',
  MESSAGE_DELETED: 'message_deleted',
  EDIT_MESSAGE: 'edit_message',
  MESSAGE_EDITED: 'message_edited',
  JOIN_CHAT: 'join_chat',
  LEAVE_CHAT: 'leave_chat',
  USER_JOINED_CHAT: 'user_joined_chat',
  USER_LEFT_CHAT: 'user_left_chat',
  CREATE_CHAT: 'create_chat',
  CHAT_CREATED: 'chat_created',
  ADD_PARTICIPANT: 'add_participant',
  REMOVE_PARTICIPANT: 'remove_participant',
  PARTICIPANT_ADDED: 'participant_added',
  PARTICIPANT_REMOVED: 'participant_removed',
  ADDED_TO_CHAT: 'added_to_chat',
  REMOVED_FROM_CHAT: 'removed_from_chat',
  UPDATE_CHAT_SETTINGS: 'update_chat_settings',
  CHAT_SETTINGS_UPDATED: 'chat_settings_updated',
  
  // Call events (WebRTC)
  CALL_START: 'call_start',
  CALL_END: 'call_end',
  CALL_STARTED: 'call_started',
  CALL_ENDED: 'call_ended',
  CALL_OFFER: 'call_offer',
  CALL_ANSWER: 'call_answer',
  CALL_ICE_CANDIDATE: 'call_ice_candidate',
  CALL_OFFER_RECEIVED: 'call_offer_received',
  CALL_ANSWER_RECEIVED: 'call_answer_received',
  CALL_ICE_CANDIDATE_RECEIVED: 'call_ice_candidate_received',
  
  // Notification events
  NEW_NOTIFICATION: 'new_notification',
  NOTIFICATION_READ: 'notification_read',
  NOTIFICATION_DISMISS: 'notification_dismiss',
  NOTIFICATION_CLICKED: 'notification_clicked',
  NOTIFICATION_READ_ACK: 'notification_read_ack',
  NOTIFICATION_COUNT: 'notification_count',
  UPDATE_NOTIFICATION_PREFS: 'update_notification_prefs',
  PREFERENCES_UPDATED: 'preferences_updated',
  GET_NOTIFICATIONS: 'get_notifications',
  NOTIFICATIONS_LIST: 'notifications_list',
  MARK_ALL_READ: 'mark_all_read',
  ALL_MARKED_READ: 'all_marked_read',
  CLEAR_ALL_NOTIFICATIONS: 'clear_all_notifications',
  ALL_CLEARED: 'all_cleared',
  
  // Presence events
  CHECK_PRESENCE: 'check_presence',
  PRESENCE_STATUS: 'presence_status',
  USER_PRESENCE_CHANGED: 'user_presence_changed',
  
  // Room events
  SUBSCRIBE_ROOM: 'subscribe_room',
  UNSUBSCRIBE_ROOM: 'unsubscribe_room',
  SUBSCRIBED: 'subscribed',
  UNSUBSCRIBED: 'unsubscribed',
  
  // Admin events
  BROADCAST_MESSAGE: 'broadcast_message',
  GET_SERVER_STATS: 'get_server_stats',
  SERVER_STATS: 'server_stats',
  SERVER_SHUTDOWN: 'server_shutdown',
  
  // Error events
  ERROR: 'error',
  VALIDATION_ERROR: 'validation_error',
  AUTH_ERROR: 'auth_error'
};

// Export SocketServer class and event constants
module.exports = {
  SocketServer,
  SOCKET_EVENTS
};