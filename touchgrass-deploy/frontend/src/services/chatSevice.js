/**
 * TouchGrass Chat Service - Premium Real-time Communication
 * Enterprise-grade chat with business features
 */

class PremiumChatService {
  constructor() {
    this.api = window.apiService;
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectDelay = 1000;
    this.maxReconnectDelay = 30000;
    this.heartbeatInterval = 30000; // 30 seconds
    this.heartbeatTimer = null;
    
    // Chat state
    this.chats = new Map();
    this.messages = new Map();
    this.unreadCounts = new Map();
    this.typingIndicators = new Map();
    this.presence = new Map();
    
    // Cache
    this.messageCache = new LRUCache(1000); // Cache 1000 messages
    this.userCache = new LRUCache(500); // Cache 500 users
    
    // Event listeners
    this.eventListeners = {
      message: new Set(),
      typing: new Set(),
      presence: new Set(),
      chatUpdate: new Set(),
      error: new Set()
    };
    
    // Analytics
    this.metrics = {
      messagesSent: 0,
      messagesReceived: 0,
      typingEvents: 0,
      presenceUpdates: 0,
      reconnections: 0
    };
    
    // Initialize
    this.initService();
  }

  initService() {
    // Load cached chats
    this.loadCachedChats();
    
    // Set up service worker for push notifications
    this.setupPushNotifications();
    
    // Start metrics collection
    this.startMetricsCollection();
  }

  async connect() {
    if (this.socket && this.socket.connected) {
      return;
    }

    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Create WebSocket connection with business headers
      this.socket = new WebSocket(
        `${process.env.REACT_APP_WS_URL || 'wss://ws.touchgrass.now'}?token=${token}&version=1.0.0&platform=business`
      );

      // Set up event handlers
      this.setupSocketHandlers();

      // Wait for connection with timeout
      await this.waitForConnection(10000);

      // Start heartbeat
      this.startHeartbeat();

      // Reset reconnect attempts on successful connection
      this.reconnectAttempts = 0;

      console.log('[Chat Service] Connected to WebSocket server');

    } catch (error) {
      console.error('[Chat Service] Connection failed:', error);
      this.scheduleReconnect();
    }
  }

  setupSocketHandlers() {
    if (!this.socket) return;

    this.socket.onopen = () => {
      this.handleConnectionOpen();
    };

    this.socket.onmessage = (event) => {
      this.handleSocketMessage(event);
    };

    this.socket.onclose = (event) => {
      this.handleConnectionClose(event);
    };

    this.socket.onerror = (error) => {
      this.handleSocketError(error);
    };
  }

  handleConnectionOpen() {
    console.log('[Chat Service] WebSocket connection established');
    
    // Send connection metadata
    this.send({
      type: 'connection_metadata',
      data: {
        userId: this.getCurrentUserId(),
        deviceId: this.getDeviceId(),
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timestamp: new Date().toISOString(),
        businessTier: this.getBusinessTier()
      }
    });

    // Subscribe to user's presence channel
    this.subscribeToPresence();

    // Load missed messages
    this.loadMissedMessages();

    // Notify listeners
    this.emit('connected', { timestamp: new Date().toISOString() });
  }

  handleSocketMessage(event) {
    try {
      const message = JSON.parse(event.data);
      this.processIncomingMessage(message);
    } catch (error) {
      console.error('[Chat Service] Failed to parse message:', error);
    }
  }

  processIncomingMessage(message) {
    const { type, data, metadata } = message;
    
    // Update metrics
    this.metrics.messagesReceived++;
    
    // Process based on message type
    switch (type) {
      case 'chat_message':
        this.handleChatMessage(data, metadata);
        break;
        
      case 'typing_indicator':
        this.handleTypingIndicator(data);
        break;
        
      case 'presence_update':
        this.handlePresenceUpdate(data);
        break;
        
      case 'chat_created':
        this.handleChatCreated(data);
        break;
        
      case 'chat_updated':
        this.handleChatUpdated(data);
        break;
        
      case 'message_reaction':
        this.handleMessageReaction(data);
        break;
        
      case 'message_deleted':
        this.handleMessageDeleted(data);
        break;
        
      case 'user_joined':
        this.handleUserJoined(data);
        break;
        
      case 'user_left':
        this.handleUserLeft(data);
        break;
        
      case 'system_message':
        this.handleSystemMessage(data);
        break;
        
      case 'error':
        this.handleErrorMessage(data);
        break;
        
      default:
        console.warn('[Chat Service] Unknown message type:', type);
    }
  }

  handleChatMessage(data, metadata) {
    const { chatId, message } = data;
    
    // Add to cache
    this.messageCache.set(message.id, message);
    
    // Update chat's messages
    if (!this.messages.has(chatId)) {
      this.messages.set(chatId, []);
    }
    
    const messages = this.messages.get(chatId);
    messages.push(message);
    
    // Keep messages sorted by timestamp
    messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    // Update unread count if message is not from current user
    if (message.senderId !== this.getCurrentUserId()) {
      const currentUnread = this.unreadCounts.get(chatId) || 0;
      this.unreadCounts.set(chatId, currentUnread + 1);
      
      // Show notification
      this.showMessageNotification(message);
    }
    
    // Update chat's last message
    this.updateChatLastMessage(chatId, message);
    
    // Emit event
    this.emit('message', { chatId, message, metadata });
    
    // Track for analytics
    this.trackMessageReceived(message);
  }

  handleTypingIndicator(data) {
    const { chatId, userId, isTyping } = data;
    
    if (!this.typingIndicators.has(chatId)) {
      this.typingIndicators.set(chatId, new Map());
    }
    
    const chatTyping = this.typingIndicators.get(chatId);
    chatTyping.set(userId, isTyping ? Date.now() : null);
    
    // Clean up old typing indicators after 3 seconds
    setTimeout(() => {
      if (chatTyping.get(userId) && Date.now() - chatTyping.get(userId) > 3000) {
        chatTyping.delete(userId);
      }
    }, 3000);
    
    this.emit('typing', { chatId, userId, isTyping });
    this.metrics.typingEvents++;
  }

  handlePresenceUpdate(data) {
    const { userId, status, lastSeen, device } = data;
    
    this.presence.set(userId, {
      status,
      lastSeen,
      device,
      updatedAt: new Date().toISOString()
    });
    
    this.emit('presence', { userId, status, lastSeen, device });
    this.metrics.presenceUpdates++;
  }

  handleChatCreated(data) {
    const { chat } = data;
    
    this.chats.set(chat.id, chat);
    this.cacheChat(chat);
    
    this.emit('chatUpdate', { type: 'created', chat });
  }

  handleChatUpdated(data) {
    const { chat } = data;
    
    this.chats.set(chat.id, chat);
    this.cacheChat(chat);
    
    this.emit('chatUpdate', { type: 'updated', chat });
  }

  handleConnectionClose(event) {
    console.log('[Chat Service] WebSocket connection closed:', event.code, event.reason);
    
    // Stop heartbeat
    this.stopHeartbeat();
    
    // Notify listeners
    this.emit('disconnected', {
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean,
      timestamp: new Date().toISOString()
    });
    
    // Schedule reconnection
    if (event.code !== 1000) { // Don't reconnect on normal closure
      this.scheduleReconnect();
    }
  }

  handleSocketError(error) {
    console.error('[Chat Service] WebSocket error:', error);
    this.emit('error', { type: 'socket_error', error });
  }

  waitForConnection(timeout) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const checkInterval = setInterval(() => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          clearInterval(checkInterval);
          resolve();
        } else if (Date.now() - startTime > timeout) {
          clearInterval(checkInterval);
          reject(new Error('Connection timeout'));
        }
      }, 100);
    });
  }

  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[Chat Service] Max reconnection attempts reached');
      this.emit('error', { type: 'max_reconnections' });
      return;
    }

    this.reconnectAttempts++;
    
    // Exponential backoff with jitter
    const delay = Math.min(
      this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1),
      this.maxReconnectDelay
    ) + Math.random() * 1000;

    console.log(`[Chat Service] Reconnecting in ${Math.round(delay / 1000)} seconds...`);

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  startHeartbeat() {
    this.stopHeartbeat();
    
    this.heartbeatTimer = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.send({
          type: 'heartbeat',
          data: {
            timestamp: new Date().toISOString(),
            userId: this.getCurrentUserId()
          }
        });
      }
    }, this.heartbeatInterval);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  send(message) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    try {
      const messageWithMetadata = {
        ...message,
        metadata: {
          ...message.metadata,
          messageId: this.generateMessageId(),
          timestamp: new Date().toISOString(),
          sequence: this.getNextSequence()
        }
      };

      this.socket.send(JSON.stringify(messageWithMetadata));
      
      // Update metrics
      if (message.type === 'chat_message') {
        this.metrics.messagesSent++;
      }
      
      return messageWithMetadata.metadata.messageId;
      
    } catch (error) {
      console.error('[Chat Service] Failed to send message:', error);
      throw error;
    }
  }

  // Chat Operations
  async sendMessage(chatId, content, options = {}) {
    try {
      const message = {
        type: 'chat_message',
        data: {
          chatId,
          content,
          type: options.type || 'text',
          metadata: options.metadata || {},
          attachments: options.attachments || [],
          replyTo: options.replyTo,
          mentions: options.mentions
        }
      };

      const messageId = this.send(message);
      
      // Optimistically add to local state
      const optimisticMessage = {
        id: messageId,
        chatId,
        content,
        type: options.type || 'text',
        senderId: this.getCurrentUserId(),
        status: 'sending',
        createdAt: new Date().toISOString(),
        metadata: options.metadata,
        attachments: options.attachments,
        replyTo: options.replyTo
      };
      
      // Add to cache
      this.messageCache.set(messageId, optimisticMessage);
      
      // Update local state
      if (!this.messages.has(chatId)) {
        this.messages.set(chatId, []);
      }
      
      this.messages.get(chatId).push(optimisticMessage);
      
      // Emit optimistic update
      this.emit('message', { 
        chatId, 
        message: optimisticMessage,
        isOptimistic: true 
      });
      
      return messageId;
      
    } catch (error) {
      console.error('[Chat Service] Failed to send message:', error);
      throw error;
    }
  }

  async sendStreakShare(chatId, streakData, message = '') {
    const shareMessage = {
      type: 'streak_share',
      data: {
        streakId: streakData.id,
        streakDays: streakData.currentStreak,
        message,
        metadata: {
          shareType: 'streak',
          streakData: {
            days: streakData.currentStreak,
            consistency: streakData.consistencyScore,
            rank: streakData.rank
          }
        }
      }
    };

    return this.sendMessage(chatId, shareMessage);
  }

  async sendChallengeInvite(chatId, challengeData) {
    const challengeMessage = {
      type: 'challenge_invite',
      data: {
        challengeId: challengeData.id,
        challengeName: challengeData.name,
        duration: challengeData.duration,
        stake: challengeData.stake,
        metadata: {
          challengeType: challengeData.type,
          participants: challengeData.participants
        }
      }
    };

    return this.sendMessage(chatId, challengeMessage);
  }

  async startTyping(chatId) {
    try {
      this.send({
        type: 'typing_indicator',
        data: {
          chatId,
          userId: this.getCurrentUserId(),
          isTyping: true
        }
      });
      
      // Auto-stop typing after 3 seconds
      setTimeout(() => {
        this.stopTyping(chatId);
      }, 3000);
      
    } catch (error) {
      console.error('[Chat Service] Failed to send typing indicator:', error);
    }
  }

  async stopTyping(chatId) {
    try {
      this.send({
        type: 'typing_indicator',
        data: {
          chatId,
          userId: this.getCurrentUserId(),
          isTyping: false
        }
      });
    } catch (error) {
      console.error('[Chat Service] Failed to send typing stop:', error);
    }
  }

  async markAsRead(chatId, messageId = null) {
    try {
      this.send({
        type: 'mark_read',
        data: {
          chatId,
          userId: this.getCurrentUserId(),
          messageId
        }
      });
      
      // Update local unread count
      this.unreadCounts.set(chatId, 0);
      
      // Emit event
      this.emit('read', { chatId, messageId });
      
    } catch (error) {
      console.error('[Chat Service] Failed to mark as read:', error);
    }
  }

  async reactToMessage(chatId, messageId, reaction) {
    try {
      this.send({
        type: 'message_reaction',
        data: {
          chatId,
          messageId,
          userId: this.getCurrentUserId(),
          reaction
        }
      });
      
      // Update local cache optimistically
      const message = this.messageCache.get(messageId);
      if (message) {
        if (!message.reactions) {
          message.reactions = [];
        }
        
        // Remove existing reaction from same user
        message.reactions = message.reactions.filter(r => r.userId !== this.getCurrentUserId());
        
        // Add new reaction
        message.reactions.push({
          userId: this.getCurrentUserId(),
          reaction,
          timestamp: new Date().toISOString()
        });
        
        this.messageCache.set(messageId, message);
        
        // Emit update
        this.emit('reaction', { chatId, messageId, reactions: message.reactions });
      }
      
    } catch (error) {
      console.error('[Chat Service] Failed to react to message:', error);
    }
  }

  async deleteMessage(chatId, messageId) {
    try {
      this.send({
        type: 'delete_message',
        data: {
          chatId,
          messageId,
          userId: this.getCurrentUserId()
        }
      });
      
      // Remove from local cache
      this.messageCache.delete(messageId);
      
      // Remove from messages list
      if (this.messages.has(chatId)) {
        const messages = this.messages.get(chatId);
        const index = messages.findIndex(m => m.id === messageId);
        if (index > -1) {
          messages.splice(index, 1);
        }
      }
      
      // Emit event
      this.emit('messageDeleted', { chatId, messageId });
      
    } catch (error) {
      console.error('[Chat Service] Failed to delete message:', error);
    }
  }

  // Chat Management
  async createChat(participants, options = {}) {
    try {
      const response = await this.api.post('/chats', {
        participants,
        type: options.type || 'direct',
        name: options.name,
        metadata: options.metadata
      });
      
      const chat = response.data.chat;
      
      // Add to local state
      this.chats.set(chat.id, chat);
      this.cacheChat(chat);
      
      // Emit event
      this.emit('chatCreated', { chat });
      
      return chat;
      
    } catch (error) {
      console.error('[Chat Service] Failed to create chat:', error);
      throw error;
    }
  }

  async getChats(refresh = false) {
    try {
      if (!refresh && this.chats.size > 0) {
        return Array.from(this.chats.values());
      }
      
      const response = await this.api.get('/chats');
      const chats = response.data.chats;
      
      // Update local state
      chats.forEach(chat => {
        this.chats.set(chat.id, chat);
        this.cacheChat(chat);
      });
      
      return chats;
      
    } catch (error) {
      console.error('[Chat Service] Failed to get chats:', error);
      throw error;
    }
  }

  async getChatMessages(chatId, options = {}) {
    try {
      const params = new URLSearchParams();
      if (options.limit) params.append('limit', options.limit);
      if (options.before) params.append('before', options.before);
      if (options.after) params.append('after', options.after);
      
      const response = await this.api.get(`/chats/${chatId}/messages?${params}`);
      const messages = response.data.messages;
      
      // Update local cache
      messages.forEach(message => {
        this.messageCache.set(message.id, message);
      });
      
      // Update messages map
      this.messages.set(chatId, messages);
      
      return messages;
      
    } catch (error) {
      console.error('[Chat Service] Failed to get messages:', error);
      throw error;
    }
  }

  async getChatSuggestions() {
    try {
      const response = await this.api.get('/chats/suggestions');
      return response.data.suggestions;
    } catch (error) {
      console.error('[Chat Service] Failed to get suggestions:', error);
      throw error;
    }
  }

  // Presence Management
  subscribeToPresence() {
    this.send({
      type: 'subscribe_presence',
      data: {
        userId: this.getCurrentUserId(),
        channels: ['global', 'friends']
      }
    });
  }

  async updatePresence(status) {
    try {
      this.send({
        type: 'presence_update',
        data: {
          userId: this.getCurrentUserId(),
          status,
          lastSeen: new Date().toISOString(),
          device: this.getDeviceInfo()
        }
      });
      
      // Update local state
      this.presence.set(this.getCurrentUserId(), {
        status,
        lastSeen: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('[Chat Service] Failed to update presence:', error);
    }
  }

  // Event System
  on(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].add(callback);
    }
  }

  off(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].delete(callback);
    }
  }

  emit(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[Chat Service] Error in ${event} listener:`, error);
        }
      });
    }
  }

  // Utility Methods
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getNextSequence() {
    return Date.now();
  }

  getAuthToken() {
    return localStorage.getItem('touchgrass_access_token');
  }

  getCurrentUserId() {
    try {
      const token = this.getAuthToken();
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  getDeviceId() {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = `dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  }

  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  getBusinessTier() {
    // Determine business tier based on user subscription
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    return userData.subscription?.plan || 'free';
  }

  // Caching
  cacheChat(chat) {
    // Cache chat with expiration
    const cacheKey = `chat_${chat.id}`;
    const cacheData = {
      chat,
      cachedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  }

  loadCachedChats() {
    // Load chats from localStorage cache
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('chat_')) {
        try {
          const cacheData = JSON.parse(localStorage.getItem(key));
          if (new Date(cacheData.expiresAt) > new Date()) {
            this.chats.set(cacheData.chat.id, cacheData.chat);
          } else {
            localStorage.removeItem(key);
          }
        } catch (error) {
          // Invalid cache entry
          localStorage.removeItem(key);
        }
      }
    }
  }

  // Notifications
  showMessageNotification(message) {
    // Check if notifications are allowed
    if (Notification.permission === 'granted' && document.hidden) {
      const notification = new Notification('New Message', {
        body: `${message.senderName || 'Someone'}: ${this.truncateMessage(message.content)}`,
        icon: '/logo.png',
        badge: '/badge.png',
        tag: `chat_${message.chatId}`,
        requireInteraction: false,
        silent: false,
        data: {
          chatId: message.chatId,
          messageId: message.id,
          url: `/chat/${message.chatId}`
        }
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        window.location.href = `/chat/${message.chatId}`;
      };
    }
  }

  setupPushNotifications() {
    // Register service worker for push notifications
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('[Chat Service] Service Worker registered');
          
          // Request permission for notifications
          return Notification.requestPermission();
        })
        .catch(error => {
          console.error('[Chat Service] Service Worker registration failed:', error);
        });
    }
  }

  // Analytics
  trackMessageReceived(message) {
    const analyticsData = {
      event: 'chat_message_received',
      chatId: message.chatId,
      messageId: message.id,
      senderId: message.senderId,
      messageType: message.type,
      timestamp: new Date().toISOString(),
      isBusiness: this.getBusinessTier() !== 'free'
    };
    
    this.sendAnalytics(analyticsData);
  }

  sendAnalytics(data) {
    // Send to analytics service
    if (window.analytics) {
      window.analytics.track(data.event, data);
    }
  }

  startMetricsCollection() {
    // Report metrics every 5 minutes
    setInterval(() => {
      this.reportMetrics();
    }, 5 * 60 * 1000);
  }

  reportMetrics() {
    const metrics = {
      ...this.metrics,
      connected: this.socket?.readyState === WebSocket.OPEN,
      activeChats: this.chats.size,
      cachedMessages: this.messageCache.size,
      timestamp: new Date().toISOString()
    };
    
    // Send to metrics endpoint
    this.api.post('/analytics/chat-metrics', metrics).catch(() => {
      // Silent fail for metrics
    });
  }

  // Helper Methods
  truncateMessage(message, length = 50) {
    if (typeof message !== 'string') {
      return 'New message';
    }
    
    if (message.length <= length) return message;
    return message.substring(0, length) + '...';
  }

  getTypingUsers(chatId) {
    const chatTyping = this.typingIndicators.get(chatId);
    if (!chatTyping) return [];
    
    const typingUsers = [];
    for (const [userId, timestamp] of chatTyping) {
      if (timestamp && Date.now() - timestamp < 3000) {
        typingUsers.push(userId);
      }
    }
    
    return typingUsers;
  }

  getUnreadCount(chatId) {
    return this.unreadCounts.get(chatId) || 0;
  }

  getTotalUnreadCount() {
    let total = 0;
    for (const count of this.unreadCounts.values()) {
      total += count;
    }
    return total;
  }

  getUserPresence(userId) {
    return this.presence.get(userId) || { status: 'offline', lastSeen: null };
  }

  // Cleanup
  disconnect() {
    if (this.socket) {
      this.socket.close(1000, 'Client disconnected');
      this.socket = null;
    }
    
    this.stopHeartbeat();
    this.reconnectAttempts = 0;
    
    console.log('[Chat Service] Disconnected');
  }
}

// LRU Cache Implementation
class LRUCache {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.accessOrder = [];
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    
    // Update access order
    this.updateAccessOrder(key);
    
    return this.cache.get(key);
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      // Remove least recently used
      const lruKey = this.accessOrder.shift();
      this.cache.delete(lruKey);
    }
    
    this.cache.set(key, value);
    this.updateAccessOrder(key);
  }

  delete(key) {
    this.cache.delete(key);
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  updateAccessOrder(key) {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    this.accessOrder.push(key);
  }

  clear() {
    this.cache.clear();
    this.accessOrder = [];
  }

  size() {
    return this.cache.size;
  }
}

// Export singleton instance
export default new PremiumChatService();