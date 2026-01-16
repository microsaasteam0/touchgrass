const { createClient } = require('redis');
const crypto = require('crypto');

/**
 * Redis Configuration
 * Handles caching, rate limiting, real-time features, and session management
 */

let redisClient = null;
let pubClient = null;
let subClient = null;

/**
 * Configure Redis client with connection pooling and error handling
 */
const configureRedis = async () => {
  const {
    REDIS_URL,
    REDIS_HOST = 'localhost',
    REDIS_PORT = 6379,
    REDIS_PASSWORD,
    REDIS_USERNAME,
    NODE_ENV
  } = process.env;

  const isProduction = NODE_ENV === 'production';
  
  // Use Redis URL if provided, otherwise build from components
  const connectionUrl = REDIS_URL || `redis://${REDIS_HOST}:${REDIS_PORT}`;
  
  console.log(`🔄 Connecting to Redis: ${connectionUrl.replace(/\/\/[^@]*@/, '//***:***@')}`);
  
  const clientOptions = {
    url: connectionUrl,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.error('❌ Redis reconnection attempts exceeded');
          return new Error('Redis reconnection failed');
        }
        // Exponential backoff with jitter
        const baseDelay = Math.min(1000 * Math.pow(2, retries), 30000);
        const jitter = Math.random() * 100;
        return baseDelay + jitter;
      },
      connectTimeout: 10000,
      keepAlive: 5000
    },
    pingInterval: 30000, // Send PING every 30 seconds
    disableOfflineQueue: true // Don't queue commands when connection is lost
  };

  // Add authentication if credentials are provided
  if (REDIS_USERNAME && REDIS_PASSWORD) {
    clientOptions.username = REDIS_USERNAME;
    clientOptions.password = REDIS_PASSWORD;
  } else if (REDIS_PASSWORD) {
    clientOptions.password = REDIS_PASSWORD;
  }

  // SSL/TLS for production
  if (isProduction && connectionUrl.startsWith('rediss://')) {
    clientOptions.socket.tls = true;
    clientOptions.socket.rejectUnauthorized = false; // Set to true with proper certs
  }

  try {
    // Create main Redis client
    redisClient = createClient(clientOptions);
    
    // Create Pub/Sub clients for real-time features
    pubClient = createClient(clientOptions);
    subClient = createClient(clientOptions);

    // Event handlers for main client
    redisClient.on('connect', () => {
      console.log('🔗 Redis client connecting...');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis client ready');
    });

    redisClient.on('end', () => {
      console.warn('⚠️  Redis client connection ended');
    });

    redisClient.on('error', (error) => {
      console.error('❌ Redis client error:', error.message);
    });

    redisClient.on('reconnecting', () => {
      console.log('🔄 Redis client reconnecting...');
    });

    // Event handlers for Pub/Sub clients
    pubClient.on('error', (error) => {
      console.error('❌ Redis pub client error:', error.message);
    });

    subClient.on('error', (error) => {
      console.error('❌ Redis sub client error:', error.message);
    });

    // Connect all clients
    await Promise.all([
      redisClient.connect(),
      pubClient.connect(),
      subClient.connect()
    ]);

    // Test connection
    await redisClient.ping();
    console.log('✅ Redis connection test passed');

    return { redisClient, pubClient, subClient };
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error.message);
    
    // In production, we might want to continue without Redis (graceful degradation)
    if (isProduction) {
      console.warn('⚠️  Continuing without Redis cache. Some features may be limited.');
      return null;
    }
    
    throw error;
  }
};

/**
 * Cache operations with automatic serialization/deserialization
 */
const cache = {
  // Set cache with expiry
  set: async (key, value, ttlSeconds = 3600) => {
    if (!redisClient?.isOpen) return null;
    
    try {
      const serializedValue = typeof value === 'object' 
        ? JSON.stringify(value) 
        : value.toString();
      
      if (ttlSeconds > 0) {
        await redisClient.set(key, serializedValue, {
          EX: ttlSeconds,
          NX: true // Only set if not exists
        });
      } else {
        await redisClient.set(key, serializedValue);
      }
      
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return null;
    }
  },

  // Get cache value
  get: async (key, parseJson = true) => {
    if (!redisClient?.isOpen) return null;
    
    try {
      const value = await redisClient.get(key);
      
      if (!value) return null;
      
      return parseJson ? JSON.parse(value) : value;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  },

  // Delete cache
  delete: async (key) => {
    if (!redisClient?.isOpen) return 0;
    
    try {
      return await redisClient.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
      return 0;
    }
  },

  // Get or set cache (cache-aside pattern)
  getOrSet: async (key, fetchFn, ttlSeconds = 3600) => {
    if (!redisClient?.isOpen) {
      // If Redis is down, just fetch fresh data
      return await fetchFn();
    }
    
    try {
      // Try to get from cache
      const cached = await cache.get(key);
      if (cached !== null) {
        return cached;
      }
      
      // Fetch fresh data
      const freshData = await fetchFn();
      
      // Store in cache
      if (freshData !== null && freshData !== undefined) {
        await cache.set(key, freshData, ttlSeconds);
      }
      
      return freshData;
    } catch (error) {
      console.error('Redis getOrSet error:', error);
      // Fallback to fresh data on error
      return await fetchFn();
    }
  },

  // Increment counter
  increment: async (key, amount = 1) => {
    if (!redisClient?.isOpen) return null;
    
    try {
      return await redisClient.incrBy(key, amount);
    } catch (error) {
      console.error('Redis increment error:', error);
      return null;
    }
  },

  // Check if key exists
  exists: async (key) => {
    if (!redisClient?.isOpen) return false;
    
    try {
      return (await redisClient.exists(key)) === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  },

  // Get multiple keys
  mGet: async (keys, parseJson = true) => {
    if (!redisClient?.isOpen) return [];
    
    try {
      const values = await redisClient.mGet(keys);
      
      return values.map(value => {
        if (!value) return null;
        return parseJson ? JSON.parse(value) : value;
      });
    } catch (error) {
      console.error('Redis mGet error:', error);
      return [];
    }
  },

  // Set multiple keys
  mSet: async (keyValuePairs, ttlSeconds = 3600) => {
    if (!redisClient?.isOpen) return false;
    
    try {
      const pipeline = redisClient.multi();
      
      keyValuePairs.forEach(([key, value]) => {
        const serializedValue = typeof value === 'object' 
          ? JSON.stringify(value) 
          : value.toString();
        
        pipeline.set(key, serializedValue);
        
        if (ttlSeconds > 0) {
          pipeline.expire(key, ttlSeconds);
        }
      });
      
      await pipeline.exec();
      return true;
    } catch (error) {
      console.error('Redis mSet error:', error);
      return false;
    }
  },

  // Clear cache by pattern
  clearByPattern: async (pattern) => {
    if (!redisClient?.isOpen) return 0;
    
    try {
      const keys = await redisClient.keys(pattern);
      
      if (keys.length === 0) return 0;
      
      return await redisClient.del(keys);
    } catch (error) {
      console.error('Redis clearByPattern error:', error);
      return 0;
    }
  },

  // Get cache statistics
  getStats: async () => {
    if (!redisClient?.isOpen) return null;
    
    try {
      const info = await redisClient.info();
      const lines = info.split('\r\n');
      const stats = {};
      
      lines.forEach(line => {
        if (line.includes(':')) {
          const [key, value] = line.split(':');
          stats[key] = value;
        }
      });
      
      return {
        connected_clients: stats.connected_clients,
        used_memory_human: stats.used_memory_human,
        total_connections_received: stats.total_connections_received,
        total_commands_processed: stats.total_commands_processed,
        keyspace_hits: stats.keyspace_hits,
        keyspace_misses: stats.keyspace_misses,
        hit_rate: stats.keyspace_hits && stats.keyspace_misses 
          ? (parseInt(stats.keyspace_hits) / (parseInt(stats.keyspace_hits) + parseInt(stats.keyspace_misses))).toFixed(2)
          : 0
      };
    } catch (error) {
      console.error('Redis getStats error:', error);
      return null;
    }
  }
};

/**
 * Real-time Pub/Sub operations
 */
const pubsub = {
  // Subscribe to channel
  subscribe: async (channel, callback) => {
    if (!subClient?.isOpen) return false;
    
    try {
      await subClient.subscribe(channel, callback);
      console.log(`✅ Subscribed to channel: ${channel}`);
      return true;
    } catch (error) {
      console.error('Redis subscribe error:', error);
      return false;
    }
  },

  // Unsubscribe from channel
  unsubscribe: async (channel, callback) => {
    if (!subClient?.isOpen) return false;
    
    try {
      await subClient.unsubscribe(channel, callback);
      return true;
    } catch (error) {
      console.error('Redis unsubscribe error:', error);
      return false;
    }
  },

  // Publish to channel
  publish: async (channel, message) => {
    if (!pubClient?.isOpen) return 0;
    
    try {
      const serializedMessage = typeof message === 'object' 
        ? JSON.stringify(message) 
        : message.toString();
      
      return await pubClient.publish(channel, serializedMessage);
    } catch (error) {
      console.error('Redis publish error:', error);
      return 0;
    }
  }
};

/**
 * Rate limiting with Redis
 */
const rateLimit = {
  // Token bucket algorithm
  tokenBucket: async (key, capacity, refillRate, tokens = 1) => {
    if (!redisClient?.isOpen) return { allowed: true, remaining: capacity };
    
    try {
      const now = Date.now();
      const lastRefillKey = `${key}:last_refill`;
      const tokensKey = `${key}:tokens`;
      
      // Get current state
      const [lastRefillStr, currentTokensStr] = await redisClient.mGet([lastRefillKey, tokensKey]);
      
      let lastRefill = lastRefillStr ? parseInt(lastRefillStr) : now;
      let currentTokens = currentTokensStr ? parseFloat(currentTokensStr) : capacity;
      
      // Calculate refill
      const timePassed = now - lastRefill;
      const refillAmount = (timePassed / 1000) * refillRate;
      
      currentTokens = Math.min(capacity, currentTokens + refillAmount);
      lastRefill = now;
      
      // Check if enough tokens
      if (currentTokens >= tokens) {
        currentTokens -= tokens;
        
        // Update Redis
        await redisClient.mSet([
          [lastRefillKey, lastRefill.toString()],
          [tokensKey, currentTokens.toString()]
        ]);
        
        return {
          allowed: true,
          remaining: Math.floor(currentTokens),
          reset: Math.ceil((capacity - currentTokens) / refillRate) * 1000
        };
      }
      
      return {
        allowed: false,
        remaining: Math.floor(currentTokens),
        reset: Math.ceil((tokens - currentTokens) / refillRate) * 1000
      };
    } catch (error) {
      console.error('Redis rate limit error:', error);
      return { allowed: true, remaining: capacity };
    }
  },

  // Fixed window counter
  fixedWindow: async (key, windowSeconds, maxRequests) => {
    if (!redisClient?.isOpen) return { allowed: true, remaining: maxRequests };
    
    try {
      const now = Math.floor(Date.now() / 1000);
      const window = Math.floor(now / windowSeconds);
      const keyWithWindow = `${key}:${window}`;
      
      const current = await redisClient.incr(keyWithWindow);
      
      if (current === 1) {
        await redisClient.expire(keyWithWindow, windowSeconds);
      }
      
      return {
        allowed: current <= maxRequests,
        remaining: Math.max(0, maxRequests - current),
        reset: (window + 1) * windowSeconds * 1000
      };
    } catch (error) {
      console.error('Redis rate limit error:', error);
      return { allowed: true, remaining: maxRequests };
    }
  }
};

/**
 * Session management with Redis
 */
const session = {
  // Create session
  create: async (userId, sessionData, ttlSeconds = 86400) => {
    if (!redisClient?.isOpen) return null;
    
    try {
      const sessionId = crypto.randomBytes(32).toString('hex');
      const sessionKey = `session:${sessionId}`;
      
      const session = {
        id: sessionId,
        userId,
        createdAt: Date.now(),
        lastActivity: Date.now(),
        userAgent: sessionData.userAgent,
        ip: sessionData.ip,
        ...sessionData
      };
      
      await cache.set(sessionKey, session, ttlSeconds);
      
      // Also store session ID in user's sessions set
      const userSessionsKey = `user:${userId}:sessions`;
      await redisClient.sAdd(userSessionsKey, sessionId);
      await redisClient.expire(userSessionsKey, ttlSeconds);
      
      return sessionId;
    } catch (error) {
      console.error('Redis session create error:', error);
      return null;
    }
  },

  // Get session
  get: async (sessionId) => {
    if (!redisClient?.isOpen) return null;
    
    try {
      const sessionKey = `session:${sessionId}`;
      const session = await cache.get(sessionKey);
      
      if (session) {
        // Update last activity
        session.lastActivity = Date.now();
        await cache.set(sessionKey, session);
      }
      
      return session;
    } catch (error) {
      console.error('Redis session get error:', error);
      return null;
    }
  },

  // Delete session
  delete: async (sessionId) => {
    if (!redisClient?.isOpen) return false;
    
    try {
      const sessionKey = `session:${sessionId}`;
      const session = await cache.get(sessionKey);
      
      if (session) {
        // Remove from user's sessions set
        const userSessionsKey = `user:${session.userId}:sessions`;
        await redisClient.sRem(userSessionsKey, sessionId);
      }
      
      return await cache.delete(sessionKey) > 0;
    } catch (error) {
      console.error('Redis session delete error:', error);
      return false;
    }
  },

  // Get all sessions for user
  getUserSessions: async (userId) => {
    if (!redisClient?.isOpen) return [];
    
    try {
      const userSessionsKey = `user:${userId}:sessions`;
      const sessionIds = await redisClient.sMembers(userSessionsKey);
      
      const sessions = [];
      for (const sessionId of sessionIds) {
        const session = await cache.get(`session:${sessionId}`);
        if (session) {
          sessions.push(session);
        }
      }
      
      return sessions;
    } catch (error) {
      console.error('Redis getUserSessions error:', error);
      return [];
    }
  }
};

/**
 * Close Redis connections gracefully
 */
const closeRedisConnections = async () => {
  try {
    console.log('Closing Redis connections...');
    
    const clients = [redisClient, pubClient, subClient].filter(Boolean);
    
    for (const client of clients) {
      if (client.isOpen) {
        await client.quit();
      }
    }
    
    console.log('Redis connections closed');
  } catch (error) {
    console.error('Error closing Redis connections:', error);
  }
};

/**
 * Health check for Redis
 */
const checkRedisHealth = async () => {
  if (!redisClient?.isOpen) {
    return {
      status: 'unhealthy',
      error: 'Redis client not connected',
      timestamp: new Date().toISOString()
    };
  }
  
  try {
    // Test connection
    await redisClient.ping();
    
    // Get info
    const info = await redisClient.info('server');
    const uptimeLine = info.split('\n').find(line => line.startsWith('uptime_in_seconds:'));
    const uptime = uptimeLine ? parseInt(uptimeLine.split(':')[1]) : 0;
    
    return {
      status: 'healthy',
      uptime_seconds: uptime,
      connected: true,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

module.exports = {
  configureRedis,
  cache,
  pubsub,
  rateLimit,
  session,
  closeRedisConnections,
  checkRedisHealth,
  redisClient,
  pubClient,
  subClient
};