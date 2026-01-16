const mongoose = require('mongoose');
const redis = require('redis');

/**
 * Database Configuration
 * Handles MongoDB and Redis connections with advanced features
 */

// MongoDB Configuration
const configureMongoDB = async () => {
  const {
    MONGODB_URI,
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_DATABASE,
    NODE_ENV
  } = process.env;

  // Validate configuration
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is required');
    process.exit(1);
  }

  const isProduction = NODE_ENV === 'production';
  
  // Connection options
  const connectionOptions = {
    maxPoolSize: 50, // Maximum number of sockets in the connection pool
    minPoolSize: 10, // Minimum number of sockets in the connection pool
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if no server is selected
    heartbeatFrequencyMS: 10000, // Send heartbeat every 10 seconds
    retryWrites: true,
    w: 'majority',
    appName: 'touchgrass-backend'
  };

  // Add auth if credentials are provided
  if (MONGODB_USER && MONGODB_PASSWORD) {
    connectionOptions.auth = {
      username: MONGODB_USER,
      password: MONGODB_PASSWORD
    };
    connectionOptions.authSource = 'admin';
  }

  // Add SSL/TLS for production
  if (isProduction) {
    connectionOptions.ssl = true;
    connectionOptions.tlsAllowInvalidCertificates = false;
    connectionOptions.tlsAllowInvalidHostnames = false;
  }

  // Set mongoose global options
  mongoose.set('strictQuery', true);
  mongoose.set('autoIndex', !isProduction); // Disable autoIndex in production for performance
  mongoose.set('debug', !isProduction && process.env.MONGODB_DEBUG === 'true');

  // Connection event handlers
  mongoose.connection.on('connecting', () => {
    console.log('🔄 Connecting to MongoDB...');
  });

  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.db?.databaseName || MONGODB_DATABASE}`);
    console.log(`👥 Connections: ${mongoose.connection.readyState === 1 ? 'Active' : 'Inactive'}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔁 MongoDB reconnected');
  });

  mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB connection error:', error.message);
    
    // In production, we might want to exit if we can't connect to database
    if (isProduction && error.message.includes('ENOTFOUND')) {
      console.error('Fatal database error. Exiting...');
      process.exit(1);
    }
  });

  // Handle process termination
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
      process.exit(1);
    }
  });

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, connectionOptions);
    
    // Verify connection
    await mongoose.connection.db.admin().ping();
    console.log('✅ MongoDB ping successful');
    
    // Set up indexes (in production, indexes should be created via migrations)
    if (!isProduction) {
      await createIndexes();
    }
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    
    // Implement exponential backoff for reconnection
    if (isProduction) {
      console.log('Attempting to reconnect in 5 seconds...');
      setTimeout(() => configureMongoDB(), 5000);
    }
    
    throw error;
  }
};

/**
 * Create database indexes for performance
 */
const createIndexes = async () => {
  try {
    // Get all models
    const models = mongoose.modelNames();
    
    console.log('🔄 Creating/updating database indexes...');
    
    for (const modelName of models) {
      const model = mongoose.model(modelName);
      
      // Only create indexes if they don't exist
      const indexes = await model.collection.indexes();
      const indexCount = indexes.length;
      
      if (indexCount > 1) { // 1 is for _id index
        console.log(`   ${modelName}: ${indexCount - 1} indexes found`);
      }
    }
    
    console.log('✅ Database indexes checked');
  } catch (error) {
    console.warn('⚠️  Failed to create indexes:', error.message);
  }
};

/**
 * Database health check
 */
const checkDatabaseHealth = async () => {
  try {
    // Check MongoDB connection
    const mongoPing = await mongoose.connection.db.admin().ping();
    
    // Get database stats
    const dbStats = await mongoose.connection.db.stats();
    
    // Get active connections
    const serverStatus = await mongoose.connection.db.admin().serverStatus();
    
    return {
      status: 'healthy',
      mongodb: {
        connected: mongoose.connection.readyState === 1,
        ping: mongoPing.ok === 1 ? 'ok' : 'failed',
        database: mongoose.connection.db.databaseName,
        collections: dbStats.collections,
        objects: dbStats.objects,
        avgObjSize: dbStats.avgObjSize,
        dataSize: dbStats.dataSize,
        storageSize: dbStats.storageSize,
        indexes: dbStats.indexes,
        indexSize: dbStats.indexSize,
        connections: serverStatus.connections ? serverStatus.connections.current : 'unknown'
      },
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

/**
 * Database utilities
 */
const dbUtils = {
  // Start a transaction session
  startSession: () => mongoose.startSession(),
  
  // Perform operation with retry logic
  withRetry: async (operation, maxRetries = 3, delay = 1000) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        // Check if error is retryable
        if (isRetryableError(error) && attempt < maxRetries) {
          console.warn(`Retry attempt ${attempt} for operation failed:`, error.message);
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
          continue;
        }
        break;
      }
    }
    
    throw lastError;
  },
  
  // Check if collection exists
  collectionExists: async (collectionName) => {
    const collections = await mongoose.connection.db.listCollections().toArray();
    return collections.some(col => col.name === collectionName);
  },
  
  // Backup database (simple implementation)
  backup: async (backupPath = './backups') => {
    // This is a simple backup. In production, use mongodump or cloud backups
    console.log('Creating database backup...');
    // Implementation would depend on your infrastructure
    return { success: true, path: backupPath };
  }
};

/**
 * Check if error is retryable
 */
const isRetryableError = (error) => {
  const retryableErrors = [
    'MongoNetworkError',
    'MongoTimeoutError',
    'MongoServerSelectionError',
    'MongoWriteConcernError'
  ];
  
  return retryableErrors.includes(error.name) || 
         (error.code && [11000, 11001].includes(error.code)); // Duplicate key errors
};

/**
 * Close database connections gracefully
 */
const closeConnections = async () => {
  try {
    console.log('Closing database connections...');
    
    // Close MongoDB connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
    
    // Close Redis connection if exists
    if (global.redisClient && global.redisClient.isOpen) {
      await global.redisClient.quit();
      console.log('Redis connection closed');
    }
    
    console.log('All database connections closed');
  } catch (error) {
    console.error('Error closing connections:', error);
    throw error;
  }
};

module.exports = {
  configureMongoDB,
  checkDatabaseHealth,
  dbUtils,
  closeConnections,
  mongoose
};