const mongoose = require('mongoose');

/**
 * Database Configuration
 * Handles MongoDB connections with advanced features
 */

// MongoDB Configuration
const configureMongoDB = async () => {
  const {
    MONGODB_URI,
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_DATABASE,
    NODE_ENV = 'development'
  } = process.env;

  // Default to local MongoDB for development, Atlas for production
  const defaultUri = NODE_ENV === 'production'
    ? 'mongodb+srv://hitanshiee:Hitanshii14@touchgrass.dgyxbbm.mongodb.net/touchgrass?retryWrites=true&w=majority&appName=touchgrass'
    : 'mongodb://localhost:27017/touchgrass';

  // For development, always use local MongoDB unless explicitly overridden
  const mongoUri = NODE_ENV === 'development' && !process.env.FORCE_ATLAS
    ? 'mongodb://localhost:27017/touchgrass'
    : (MONGODB_URI || defaultUri);

  const isProduction = NODE_ENV === 'production';
  
  // Connection options
  const connectionOptions = {
    maxPoolSize: 50,
    minPoolSize: 10,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000,
    heartbeatFrequencyMS: 10000,
    retryWrites: true,
    w: 'majority',
    appName: 'touchgrass-backend',
    useNewUrlParser: true,
    useUnifiedTopology: true
  };

  // Add auth if credentials are provided
  if (MONGODB_USER && MONGODB_PASSWORD) {
    connectionOptions.auth = {
      username: MONGODB_USER,
      password: MONGODB_PASSWORD
    };
    connectionOptions.authSource = 'admin';
  }

  // Set mongoose global options
  mongoose.set('strictQuery', true);
  mongoose.set('autoIndex', !isProduction);
  
  // Enable mongoose debug only in development if explicitly requested
  if (NODE_ENV === 'development' && process.env.MONGODB_DEBUG === 'true') {
    mongoose.set('debug', true);
  }

  // Connection event handlers
  mongoose.connection.on('connecting', () => {
    console.log('🔄 Connecting to MongoDB...');
  });

  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.db?.databaseName || MONGODB_DATABASE || 'touchgrass'}`);
    console.log(`👥 Connection state: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔁 MongoDB reconnected');
  });

  mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB connection error:', error.message);
    
    if (isProduction && error.message.includes('ENOTFOUND')) {
      console.error('Fatal database error. Exiting...');
      process.exit(1);
    }
  });

  try {
    // Connect to MongoDB with retry logic
    let connected = false;
    let lastError;
    const maxRetries = 3;
    const retryDelay = 2000; // 2 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Connection attempt ${attempt}/${maxRetries} to MongoDB...`);
        await mongoose.connect(mongoUri, connectionOptions);
        connected = true;
        break;
      } catch (error) {
        lastError = error;
        console.warn(`❌ Connection attempt ${attempt} failed:`, error.message);

        if (attempt < maxRetries) {
          console.log(`⏳ Retrying in ${retryDelay / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    if (!connected) {
      throw lastError;
    }

    // Verify connection
    await mongoose.connection.db.admin().ping();
    console.log('✅ MongoDB ping successful');

    // Set up indexes
    if (!isProduction) {
      await createIndexes();
    }

    return mongoose.connection;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB after retries:', error.message);

    if (isProduction) {
      console.log('🔄 Attempting to reconnect in 5 seconds...');
      setTimeout(() => configureMongoDB(), 5000);
    } else {
      console.log('💡 Development tips:');
      console.log('   1. Make sure MongoDB is running locally:');
      console.log('      brew services start mongodb-community (on macOS)');
      console.log('      or: mongod --config /usr/local/etc/mongod.conf');
      console.log('   2. If using MongoDB Atlas, check your network and IP whitelist');
      console.log('   3. Verify your MONGODB_URI environment variable');
    }

    throw error;
  }
};

/**
 * Create database indexes for performance
 */
const createIndexes = async () => {
  try {
    console.log('🔄 Creating/updating database indexes...');
    
    // Get all registered models
    const models = mongoose.modelNames();
    
    if (models.length === 0) {
      console.log('📝 No models registered yet. Indexes will be created when models are loaded.');
      return;
    }
    
    for (const modelName of models) {
      try {
        const model = mongoose.model(modelName);
        await model.syncIndexes();
        console.log(`   ✅ ${modelName}: Indexes synchronized`);
      } catch (error) {
        console.warn(`   ⚠️  ${modelName}: Failed to sync indexes - ${error.message}`);
      }
    }
    
    console.log('✅ Database indexes synchronized');
  } catch (error) {
    console.warn('⚠️  Failed to create indexes:', error.message);
  }
};

/**
 * Database health check
 */
const checkDatabaseHealth = async () => {
  try {
    // Check if we're connected
    if (mongoose.connection.readyState !== 1) {
      return {
        status: 'unhealthy',
        error: 'Not connected to MongoDB',
        timestamp: new Date().toISOString()
      };
    }
    
    // Try to ping the database
    const mongoPing = await mongoose.connection.db.admin().ping();
    
    // Get basic database stats
    const dbStats = await mongoose.connection.db.stats();
    
    return {
      status: 'healthy',
      mongodb: {
        connected: true,
        ping: mongoPing.ok === 1 ? 'ok' : 'failed',
        database: mongoose.connection.db.databaseName,
        collections: dbStats.collections,
        objects: dbStats.objects,
        dataSize: dbStats.dataSize,
        storageSize: dbStats.storageSize,
        indexes: dbStats.indexes,
        indexSize: dbStats.indexSize,
        uptime: dbStats.uptime || 'unknown'
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
  
  // Drop database (use with caution!)
  dropDatabase: async () => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot drop database in production');
    }
    await mongoose.connection.db.dropDatabase();
    console.log('🗑️  Database dropped');
  },
  
  // List all collections
  listCollections: async () => {
    const collections = await mongoose.connection.db.listCollections().toArray();
    return collections.map(col => col.name);
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
         (error.code && [11000, 11001].includes(error.code));
};

/**
 * Close database connections gracefully
 */
const closeConnections = async () => {
  try {
    console.log('Closing database connections...');
    
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed');
    }
    
    console.log('✅ All database connections closed');
  } catch (error) {
    console.error('❌ Error closing connections:', error);
    throw error;
  }
};

// Export connection function
const getConnection = () => mongoose.connection;

// Export mongoose for direct access if needed
const getMongoose = () => mongoose;

module.exports = {
  configureMongoDB,
  checkDatabaseHealth,
  dbUtils,
  closeConnections,
  getConnection,
  getMongoose,
  mongoose
};