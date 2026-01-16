// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const compression = require('compression');
// const morgan = require('morgan');
// const http = require('http');
// const https = require('https');
// const fs = require('fs');
// const path = require('path');
// const { Server } = require('socket.io');
// const redis = require('redis');
// const session = require('express-session');
// const RedisStore = require('connect-redis')(session);
// //port custom modules
// const { log, formatApiResponse, formatErrorResponse } = require('./src/utils/helpers');
// const ErrorHandler = require('./src/middleware/errorHandler');
// const Validators = require('./src/utils/validators');
// const constants = require('./src/config/constants');

// // Import routes
// const authRoutes = require('./src/routes/auth');
// const userRoutes = require('./src/routes/users');
// const streakRoutes = require('./src/routes/streaks');
// const paymentRoutes = require('./src/routes/payments');
// const leaderboardRoutes = require('./src/routes/leaderboard');
// const chatRoutes = require('./src/routes/chat');
// const socialShareRoutes = require('./src/routes/socialShare');
// const challengeRoutes = require('./src/routes/challenges');
// const analyticsRoutes = require('./src/routes/analytics');
// const webhookRoutes = require('./src/routes/webhooks');

// // Import services
// const NotificationService = require('./src/services/notificationService');
// const AnalyticsService = require('./src/services/analyticsService');
// const EmailService = require('./src/services/emailService');

// // Import socket handlers
// const chatSocketHandler = require('./src/sockets/chat');
// const notificationSocketHandler = require('./src/sockets/notifications');

// class TouchGrassServer {
//   constructor() {
//     this.app = express();
//     this.server = null;
//     this.io = null;
//     this.redisClient = null;
//     this.port = process.env.PORT || 5000;
//     this.environment = process.env.NODE_ENV || 'development';
//     this.isProduction = this.environment === 'production';
    
//     this.initialize();
//   }

//   async initialize() {
//     try {
//       // Initialize services
//       await this.initializeRedis();
//       await this.initializeDatabase();
      
//       // Initialize Express middleware
//       this.initializeMiddleware();
      
//       // Initialize routes
//       this.initializeRoutes();
      
//       // Initialize WebSocket server
//       await this.initializeWebSocket();
      
//       // Initialize error handling
//       this.initializeErrorHandling();
      
//       // Initialize cron jobs
//       this.initializeCronJobs();
      
//       // Initialize health checks
//       this.initializeHealthChecks();
      
//       log('info', 'Server initialization complete');
//     } catch (error) {
//       log('error', 'Server initialization failed:', error);
//       process.exit(1);
//     }
//   }

//   async initializeRedis() {
//     try {
//       this.redisClient = redis.createClient({
//         url: process.env.REDIS_URL || 'redis://localhost:6379',
//         socket: {
//           reconnectStrategy: (retries) => {
//             if (retries > 10) {
//               log('error', 'Redis connection failed after 10 retries');
//               return new Error('Redis connection failed');
//             }
//             return Math.min(retries * 100, 3000);
//           }
//         }
//       });

//       this.redisClient.on('error', (err) => {
//         log('error', 'Redis Client Error:', err);
//       });

//       this.redisClient.on('connect', () => {
//         log('info', 'Redis connected successfully');
//       });

//       await this.redisClient.connect();
      
//       // Test Redis connection
//       await this.redisClient.ping();
//       log('info', 'Redis ping successful');
      
//     } catch (error) {
//       log('error', 'Redis initialization failed:', error);
//       // Continue without Redis in development
//       if (this.isProduction) {
//         throw error;
//       }
//     }
//   }

//   async initializeDatabase() {
//     try {
//       const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/touchgrass';
      
//       const mongooseOptions = {
//         serverSelectionTimeoutMS: 5000,
//         socketTimeoutMS: 45000,
//         family: 4,
//         maxPoolSize: 10,
//         minPoolSize: 2,
//         retryWrites: true,
//         w: 'majority'
//       };

//       if (this.isProduction) {
//         mongooseOptions.ssl = true;
//         mongooseOptions.sslValidate = true;
//         mongooseOptions.sslCA = process.env.MONGODB_CA;
//       }

//       await mongoose.connect(mongoURI, mongooseOptions);
      
//       log('info', 'MongoDB connected successfully');
      
//       // Set up connection events
//       mongoose.connection.on('error', (err) => {
//         log('error', 'MongoDB connection error:', err);
//       });

//       mongoose.connection.on('disconnected', () => {
//         log('warn', 'MongoDB disconnected');
//       });

//       mongoose.connection.on('reconnected', () => {
//         log('info', 'MongoDB reconnected');
//       });

//       // Graceful shutdown
//       process.on('SIGINT', async () => {
//         await mongoose.connection.close();
//         log('info', 'MongoDB connection closed through app termination');
//         process.exit(0);
//       });

//     } catch (error) {
//       log('error', 'MongoDB connection failed:', error);
//       throw error;
//     }
//   }

//   initializeMiddleware() {
//     // Security middleware
//     this.app.use(helmet({
//       contentSecurityPolicy: {
//         directives: {
//           defaultSrc: ["'self'"],
//           styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
//           fontSrc: ["'self'", "https://fonts.gstatic.com"],
//           imgSrc: ["'self'", "data:", "https:", "http:", "blob:"],
//           scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
//           connectSrc: ["'self'", "https://api.stripe.com", "ws:", "wss:"]
//         }
//       },
//       crossOriginEmbedderPolicy: false,
//       crossOriginResourcePolicy: { policy: "cross-origin" }
//     }));

//     // CORS configuration
//     const corsOptions = {
//       origin: this.getCorsOrigins(),
//       credentials: true,
//       methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//       allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
//       exposedHeaders: ['X-Total-Count', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
//       maxAge: 86400 // 24 hours
//     };
    
//     this.app.use(cors(corsOptions));
//     this.app.options('*', cors(corsOptions));

//     // Rate limiting
//     const apiLimiter = rateLimit({
//       windowMs: 15 * 60 * 1000, // 15 minutes
//       max: 100, // Limit each IP to 100 requests per windowMs
//       standardHeaders: true,
//       legacyHeaders: false,
//       skip: (req) => {
//         // Skip rate limiting for webhooks and health checks
//         return req.path.startsWith('/webhooks') || req.path === '/health';
//       },
//       message: {
//         success: false,
//         message: 'Too many requests, please try again later.',
//         retryAfter: 900 // 15 minutes in seconds
//       }
//     });

//     // Apply rate limiting to API routes
//     this.app.use('/api/', apiLimiter);

//     // More aggressive rate limiting for auth endpoints
//     const authLimiter = rateLimit({
//       windowMs: 60 * 60 * 1000, // 1 hour
//       max: 10, // 10 attempts per hour
//       message: {
//         success: false,
//         message: 'Too many login attempts, please try again in an hour.',
//         retryAfter: 3600
//       }
//     });

//     this.app.use('/api/auth/login', authLimiter);
//     this.app.use('/api/auth/register', authLimiter);
//     this.app.use('/api/auth/forgot-password', authLimiter);

//     // Session middleware with Redis store
//     const sessionConfig = {
//       store: this.redisClient ? new RedisStore({ client: this.redisClient }) : undefined,
//       secret: process.env.SESSION_SECRET || 'touchgrass-session-secret-change-in-production',
//       resave: false,
//       saveUninitialized: false,
//       cookie: {
//         secure: this.isProduction,
//         httpOnly: true,
//         sameSite: this.isProduction ? 'strict' : 'lax',
//         maxAge: 24 * 60 * 60 * 1000 // 24 hours
//       },
//       name: 'touchgrass.sid'
//     };

//     this.app.use(session(sessionConfig));

//     // Body parsing middleware
//     this.app.use(express.json({ limit: '10mb' }));
//     this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

//     // Compression middleware
//     this.app.use(compression({
//       level: 6,
//       threshold: 100 * 1024, // Compress responses larger than 100KB
//       filter: (req, res) => {
//         if (req.headers['x-no-compression']) {
//           return false;
//         }
//         return compression.filter(req, res);
//       }
//     }));

//     // Logging middleware
//     const logFormat = this.isProduction ? 'combined' : 'dev';
//     this.app.use(morgan(logFormat, {
//       stream: {
//         write: (message) => log('http', message.trim())
//       },
//       skip: (req) => req.path === '/health' // Skip health check logs
//     }));

//     // Request ID middleware
//     this.app.use((req, res, next) => {
//       req.id = require('crypto').randomUUID();
//       res.setHeader('X-Request-ID', req.id);
//       next();
//     });

//     // Request timing middleware
//     this.app.use((req, res, next) => {
//       const start = Date.now();
//       res.on('finish', () => {
//         const duration = Date.now() - start;
//         log('info', `Request completed`, {
//           method: req.method,
//           path: req.path,
//           status: res.statusCode,
//           duration: `${duration}ms`,
//           ip: req.ip,
//           userAgent: req.get('User-Agent')
//         });
//       });
//       next();
//     });

//     // Sanitize input middleware
//     this.app.use(Validators.sanitizeInput);

//     // Static file serving
//     this.app.use('/public', express.static(path.join(__dirname, 'public'), {
//       maxAge: this.isProduction ? '1y' : '0',
//       setHeaders: (res, path) => {
//         if (path.endsWith('.html')) {
//           res.setHeader('Cache-Control', 'public, max-age=0');
//         }
//       }
//     }));

//     // Embed widget serving
//     this.app.use('/embed', express.static(path.join(__dirname, 'public/embed'), {
//       maxAge: '1y'
//     }));

//     // Welcome route
//     this.app.get('/', (req, res) => {
//       res.json(formatApiResponse({
//         name: 'TouchGrass API',
//         version: constants.API_VERSION,
//         environment: this.environment,
//         status: 'operational',
//         documentation: `${req.protocol}://${req.get('host')}/docs`,
//         uptime: process.uptime()
//       }, 'TouchGrass API is running'));
//     });

//     // API version header
//     this.app.use((req, res, next) => {
//       res.setHeader('X-API-Version', constants.API_VERSION);
//       next();
//     });
//   }

//   initializeRoutes() {
//     // API routes
//     this.app.use('/api/auth', authRoutes);
//     this.app.use('/api/users', userRoutes);
//     this.app.use('/api/streaks', streakRoutes);
//     this.app.use('/api/payments', paymentRoutes);
//     this.app.use('/api/leaderboard', leaderboardRoutes);
//     this.app.use('/api/chat', chatRoutes);
//     this.app.use('/api/social', socialShareRoutes);
//     this.app.use('/api/challenges', challengeRoutes);
//     this.app.use('/api/analytics', analyticsRoutes);
//     this.app.use('/api/webhooks', webhookRoutes);

//     // Admin routes (protected)
//     this.app.use('/api/admin', require('./src/routes/admin'));

//     // Documentation route
//     this.app.use('/docs', require('./src/routes/docs'));

//     // 404 handler for API routes
//     this.app.use('/api/*', (req, res) => {
//       res.status(404).json(formatErrorResponse(
//         new Error('API endpoint not found'),
//         'The requested API endpoint does not exist'
//       ));
//     });
//   }

//   async initializeWebSocket() {
//     // Create HTTP/HTTPS server
//     if (this.isProduction && process.env.SSL_KEY && process.env.SSL_CERT) {
//       const privateKey = fs.readFileSync(process.env.SSL_KEY, 'utf8');
//       const certificate = fs.readFileSync(process.env.SSL_CERT, 'utf8');
//       const credentials = { key: privateKey, cert: certificate };
//       this.server = https.createServer(credentials, this.app);
//     } else {
//       this.server = http.createServer(this.app);
//     }

//     // Initialize Socket.IO
//     this.io = new Server(this.server, {
//       cors: {
//         origin: this.getCorsOrigins(),
//         credentials: true,
//         methods: ['GET', 'POST']
//       },
//       transports: ['websocket', 'polling'],
//       pingTimeout: 60000,
//       pingInterval: 25000,
//       maxHttpBufferSize: 1e6, // 1MB
//       allowEIO3: true,
//       connectionStateRecovery: {
//         maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
//         skipMiddlewares: true
//       }
//     });

//     // Socket.IO middleware for authentication
//     this.io.use(async (socket, next) => {
//       try {
//         const token = socket.handshake.auth.token;
        
//         if (!token) {
//           return next(new Error('Authentication token required'));
//         }

//         const jwt = require('jsonwebtoken');
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
//         socket.userId = decoded.userId;
//         socket.user = decoded;
        
//         // Store connection in Redis for distributed systems
//         if (this.redisClient) {
//           await this.redisClient.setEx(
//             `socket:${socket.userId}:${socket.id}`,
//             3600, // 1 hour TTL
//             JSON.stringify({ connectedAt: new Date().toISOString() })
//           );
//         }
        
//         next();
//       } catch (error) {
//         log('error', 'Socket authentication failed:', error.message);
//         next(new Error('Authentication failed'));
//       }
//     });

//     // Initialize socket handlers
//     chatSocketHandler(this.io);
//     notificationSocketHandler(this.io);

//     // Socket.IO connection handling
//     this.io.on('connection', (socket) => {
//       log('info', `Socket connected: ${socket.id} for user ${socket.userId}`);

//       // Join user's personal room
//       socket.join(`user:${socket.userId}`);

//       // Register with notification service
//       NotificationService.registerConnection(socket.userId, socket);

//       // Handle disconnection
//       socket.on('disconnect', async (reason) => {
//         log('info', `Socket disconnected: ${socket.id} - ${reason}`);
        
//         // Remove from Redis
//         if (this.redisClient) {
//           await this.redisClient.del(`socket:${socket.userId}:${socket.id}`);
//         }
        
//         // Track analytics
//         AnalyticsService.trackEvent(socket.userId, 'socket_disconnect', {
//           socketId: socket.id,
//           reason,
//           duration: socket.conn ? socket.conn.duration : null
//         });
//       });

//       // Handle errors
//       socket.on('error', (error) => {
//         log('error', `Socket error for ${socket.id}:`, error);
//       });

//       // Track connection analytics
//       AnalyticsService.trackEvent(socket.userId, 'socket_connect', {
//         socketId: socket.id,
//         transport: socket.conn.transport.name,
//         handshake: socket.handshake
//       });
//     });

//     // WebSocket health check
//     this.io.of('/').adapter.on('create-room', (room) => {
//       if (room.startsWith('user:')) {
//         log('debug', `Room created: ${room}`);
//       }
//     });

//     this.io.of('/').adapter.on('delete-room', (room) => {
//       if (room.startsWith('user:')) {
//         log('debug', `Room deleted: ${room}`);
//       }
//     });

//     log('info', 'WebSocket server initialized');
//   }

//   initializeErrorHandling() {
//     // 404 handler
//     this.app.use((req, res) => {
//       res.status(404).json(formatErrorResponse(
//         new Error('Not Found'),
//         'The requested resource was not found'
//       ));
//     });

//     // Global error handler
//     this.app.use(ErrorHandler.handleErrors);
    
//     // Unhandled promise rejection handler
//     process.on('unhandledRejection', (reason, promise) => {
//       log('error', 'Unhandled Rejection at:', promise, 'reason:', reason);
//       // In production, you might want to restart the process
//       if (this.isProduction) {
//         process.exit(1);
//       }
//     });

//     // Uncaught exception handler
//     process.on('uncaughtException', (error) => {
//       log('error', 'Uncaught Exception:', error);
//       // In production, you might want to restart the process
//       if (this.isProduction) {
//         process.exit(1);
//       }
//     });
//   }

//   initializeCronJobs() {
//     if (!this.isProduction) {
//       log('info', 'Skipping cron jobs in development mode');
//       return;
//     }

//     const cron = require('node-cron');
    
//     // Daily streak reminders at 6 PM local time
//     cron.schedule('0 18 * * *', async () => {
//       try {
//         log('info', 'Running daily streak reminder job');
//         await require('./src/jobs/dailyStreakReminders').run();
//       } catch (error) {
//         log('error', 'Daily streak reminder job failed:', error);
//       }
//     }, {
//       timezone: 'UTC'
//     });

//     // Weekly analytics report every Monday at 9 AM
//     cron.schedule('0 9 * * 1', async () => {
//       try {
//         log('info', 'Running weekly analytics report job');
//         await require('./src/jobs/weeklyAnalytics').run();
//       } catch (error) {
//         log('error', 'Weekly analytics report job failed:', error);
//       }
//     }, {
//       timezone: 'UTC'
//     });

//     // Cleanup expired data every day at 3 AM
//     cron.schedule('0 3 * * *', async () => {
//       try {
//         log('info', 'Running data cleanup job');
//         await require('./src/jobs/dataCleanup').run();
//       } catch (error) {
//         log('error', 'Data cleanup job failed:', error);
//       }
//     }, {
//       timezone: 'UTC'
//     });

//     // Check for broken streaks every hour
//     cron.schedule('0 * * * *', async () => {
//       try {
//         log('info', 'Running broken streak check job');
//         await require('./src/jobs/streakCheck').run();
//       } catch (error) {
//         log('error', 'Broken streak check job failed:', error);
//       }
//     }, {
//       timezone: 'UTC'
//     });

//     log('info', 'Cron jobs initialized');
//   }

//   initializeHealthChecks() {
//     // Health check endpoint
//     this.app.get('/health', async (req, res) => {
//       const health = {
//         status: 'healthy',
//         timestamp: new Date().toISOString(),
//         uptime: process.uptime(),
//         memory: process.memoryUsage(),
//         database: 'connected',
//         redis: 'connected',
//         websocket: this.io ? 'running' : 'stopped'
//       };

//       try {
//         // Check MongoDB connection
//         await mongoose.connection.db.admin().ping();
//         health.database = 'connected';
//       } catch (error) {
//         health.database = 'disconnected';
//         health.status = 'unhealthy';
//       }

//       try {
//         // Check Redis connection
//         if (this.redisClient) {
//           await this.redisClient.ping();
//           health.redis = 'connected';
//         } else {
//           health.redis = 'not_configured';
//         }
//       } catch (error) {
//         health.redis = 'disconnected';
//         health.status = 'unhealthy';
//       }

//       const statusCode = health.status === 'healthy' ? 200 : 503;
      
//       res.status(statusCode).json(health);
//     });

//     // Readiness probe
//     this.app.get('/ready', (req, res) => {
//       const ready = {
//         ready: true,
//         timestamp: new Date().toISOString(),
//         services: {
//           database: mongoose.connection.readyState === 1,
//           redis: this.redisClient ? this.redisClient.isReady : false,
//           websocket: this.io !== null
//         }
//       };

//       const allServicesReady = Object.values(ready.services).every(status => status);
//       ready.ready = allServicesReady;
      
//       res.status(allServicesReady ? 200 : 503).json(ready);
//     });

//     // Metrics endpoint
//     this.app.get('/metrics', (req, res) => {
//       if (!this.isProduction) {
//         return res.status(404).json({ message: 'Metrics not available in development' });
//       }

//       const metrics = {
//         connections: this.io ? this.io.engine.clientsCount : 0,
//         memory: process.memoryUsage(),
//         cpu: process.cpuUsage(),
//         uptime: process.uptime(),
//         requests: req.app.locals.requestCount || 0
//       };

//       res.json(metrics);
//     });
//   }

//   getCorsOrigins() {
//     if (this.isProduction) {
//       return [
//         'https://touchgrass.now',
//         'https://www.touchgrass.now',
//         'https://app.touchgrass.now',
//         'https://api.touchgrass.now'
//       ];
//     }
    
//     // Development origins
//     return [
//       'http://localhost:3000',
//       'http://localhost:5173',
//       'http://127.0.0.1:3000',
//       'http://127.0.0.1:5173'
//     ];
//   }

//   async start() {
//     try {
//       // Start server
//       this.server.listen(this.port, () => {
//         const protocol = this.isProduction && process.env.SSL_KEY ? 'https' : 'http';
//         const host = process.env.HOST || 'localhost';
        
//         log('info', `🚀 Server running in ${this.environment} mode`);
//         log('info', `📍 API: ${protocol}://${host}:${this.port}`);
//         log('info', `📊 Health: ${protocol}://${host}:${this.port}/health`);
//         log('info', `📚 Docs: ${protocol}://${host}:${this.port}/docs`);
        
//         if (this.io) {
//           log('info', `🔌 WebSocket: ${protocol === 'https' ? 'wss' : 'ws'}://${host}:${this.port}`);
//         }
//       });

//       // Graceful shutdown
//       this.setupGracefulShutdown();
      
//     } catch (error) {
//       log('error', 'Failed to start server:', error);
//       process.exit(1);
//     }
//   }

//   setupGracefulShutdown() {
//     const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
    
//     signals.forEach(signal => {
//       process.on(signal, async () => {
//         log('info', `Received ${signal}, starting graceful shutdown...`);
        
//         try {
//           // Close HTTP server
//           if (this.server) {
//             await new Promise((resolve) => {
//               this.server.close(resolve);
//             });
//             log('info', 'HTTP server closed');
//           }
          
//           // Close WebSocket connections
//           if (this.io) {
//             this.io.close();
//             log('info', 'WebSocket server closed');
//           }
          
//           // Close Redis connection
//           if (this.redisClient) {
//             await this.redisClient.quit();
//             log('info', 'Redis connection closed');
//           }
          
//           // Close MongoDB connection
//           if (mongoose.connection.readyState === 1) {
//             await mongoose.connection.close();
//             log('info', 'MongoDB connection closed');
//           }
          
//           log('info', 'Graceful shutdown completed');
//           process.exit(0);
          
//         } catch (error) {
//           log('error', 'Error during graceful shutdown:', error);
//           process.exit(1);
//         }
//       });
//     });
//   }
// }

// // Create and start server instance
// const server = new TouchGrassServer();

// // Handle uncaught errors during initialization
// process.on('uncaughtException', (error) => {
//   log('error', 'Uncaught exception during initialization:', error);
//   process.exit(1);
// });

// process.on('unhandledRejection', (reason, promise) => {
//   log('error', 'Unhandled rejection during initialization:', reason);
//   process.exit(1);
// });

// // Start the server
// server.start();

// // Export for testing
// module.exports = { server, app: server.app };

// server.js - Production-Ready TouchGrass Backend
// server.js - Complete TouchGrass Backend Server
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const http = require('http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const path = require('path');

const app = express();

// Environment variables
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/touchgrass';
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ========== MIDDLEWARE SETUP ==========

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS configuration - FIXED
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', FRONTEND_URL],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight for all routes

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === 'development' ? 1000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/api/health' || req.path === '/api',
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});

app.use('/api/', apiLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
const logFormat = NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(logFormat));

// Request ID middleware
app.use((req, res, next) => {
  req.id = crypto.randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// ========== DATABASE CONNECTION ==========

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  if (NODE_ENV === 'production') {
    process.exit(1);
  }
});

// ========== DATABASE SCHEMAS ==========

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  location: {
    city: String,
    country: String,
    timezone: String
  },
  preferences: {
    publicProfile: { type: Boolean, default: true },
    showOnLeaderboard: { type: Boolean, default: true },
    notifications: {
      streakReminder: { type: Boolean, default: true },
      leaderboardUpdates: { type: Boolean, default: true },
      achievementAlerts: { type: Boolean, default: true }
    }
  },
  stats: {
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    totalDays: { type: Number, default: 0 },
    totalOutdoorTime: { type: Number, default: 0 },
    consistencyScore: { type: Number, default: 0 },
    leaderboardRank: { type: Number, default: 999999 },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 }
  },
  subscription: {
    active: { type: Boolean, default: false },
    plan: { type: String, enum: ['free', 'premium', 'elite'], default: 'free' },
    currentPeriodEnd: Date
  },
  achievements: [{
    name: String,
    earnedAt: Date,
    icon: String,
    description: String
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      userId: this._id,
      username: this.username,
      email: this.email 
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

const User = mongoose.model('User', userSchema);

// Streak schema
const streakSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  currentStreak: {
    type: Number,
    default: 1
  },
  longestStreak: {
    type: Number,
    default: 1
  },
  totalDays: {
    type: Number,
    default: 1
  },
  totalOutdoorTime: {
    type: Number,
    default: 0
  },
  todayVerified: {
    type: Boolean,
    default: false
  },
  history: [{
    date: Date,
    verified: Boolean,
    verificationMethod: {
      type: String,
      enum: ['photo', 'location', 'manual', 'shame']
    },
    photoUrl: String,
    duration: Number,
    notes: String,
    location: Object,
    shameMessage: String,
    isPublicShame: { type: Boolean, default: false }
  }],
  status: {
    type: String,
    enum: ['active', 'broken', 'paused'],
    default: 'active'
  },
  nextCheckpoint: {
    type: Date,
    default: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return tomorrow;
    }
  }
}, {
  timestamps: true
});

const Streak = mongoose.model('Streak', streakSchema);

// ========== AUTHENTICATION MIDDLEWARE ==========

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// ========== HEALTH CHECK ==========

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    service: 'TouchGrass API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});



// ========== WELCOME ENDPOINT ==========

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to TouchGrass API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      users: {
        profile: 'GET /api/users/:username',
        updateBio: 'PUT /api/users/bio',
        follow: 'POST /api/users/:userId/follow',
        achievements: 'GET /api/users/:userId/achievements'
      },
      streaks: {
        current: 'GET /api/streaks/current',
        verify: 'POST /api/streaks/verify',
        shame: 'POST /api/streaks/shame',
        userStreak: 'GET /api/streaks/user/:userId'
      },
      leaderboard: 'GET /api/leaderboard',
      leaderboardUserRank: 'GET /api/leaderboard/user-rank/:userId'
    }
  });
});

// ========== AUTH ROUTES ==========

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;
    
    // Validation
    if (!username || !email || !password || !displayName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    
    // Create user
    const user = new User({
      username,
      email,
      password,
      displayName,
      stats: {
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        totalOutdoorTime: 0,
        consistencyScore: 0,
        leaderboardRank: 999999,
        followersCount: 0,
        followingCount: 0
      }
    });
    
    await user.save();
    
    // Create initial streak
    const streak = new Streak({
      userId: user._id,
      currentStreak: 0,
      longestStreak: 0,
      totalDays: 0,
      todayVerified: false,
      history: []
    });
    await streak.save();
    
    // Generate token
    const token = user.generateAuthToken();
    
    // Return user data (without password)
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: userResponse
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = user.generateAuthToken();
    
    // Return user data (without password)
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Get current user profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('followers', 'username displayName avatar')
      .populate('following', 'username displayName avatar');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get streak data
    const streak = await Streak.findOne({ userId: user._id });
    
    res.json({
      success: true,
      user: {
        ...user.toObject(),
        streakData: streak || null
      }
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ========== USER ROUTES ==========

// Get user by username
app.get('/api/users/:username', authenticateToken, async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username })
      .select('-password -email')
      .populate('followers', 'username displayName avatar')
      .populate('following', 'username displayName avatar');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if current user is following this user
    const isFollowing = req.user.following.includes(user._id);
    
    // Get streak data
    const streak = await Streak.findOne({ userId: user._id });
    
    res.json({
      success: true,
      user: {
        ...user.toObject(),
        isFollowing,
        streakData: streak || null
      }
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update user bio
app.put('/api/users/bio', authenticateToken, async (req, res) => {
  try {
    const { bio } = req.body;
    
    if (bio && bio.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Bio must be less than 500 characters'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bio },
      { new: true }
    ).select('-password');
    
    res.json({
      success: true,
      user
    });
    
  } catch (error) {
    console.error('Update bio error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update user avatar
app.put('/api/users/avatar', authenticateToken, async (req, res) => {
  try {
    const { avatar } = req.body;
    
    if (!avatar) {
      return res.status(400).json({
        success: false,
        message: 'Avatar URL is required'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true }
    ).select('-password');
    
    res.json({
      success: true,
      user
    });
    
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Follow/Unfollow user
app.post('/api/users/:userId/follow', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot follow yourself'
      });
    }
    
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const currentUser = await User.findById(req.user._id);
    
    // Check if already following
    const isFollowing = currentUser.following.includes(userId);
    
    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: userId },
        $inc: { 'stats.followingCount': -1 }
      });
      
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: req.user._id },
        $inc: { 'stats.followersCount': -1 }
      });
    } else {
      // Follow
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: userId },
        $inc: { 'stats.followingCount': 1 }
      });
      
      await User.findByIdAndUpdate(userId, {
        $push: { followers: req.user._id },
        $inc: { 'stats.followersCount': 1 }
      });
    }
    
    // Get updated user
    const updatedUser = await User.findById(userId)
      .select('-password')
      .populate('followers', 'username displayName avatar')
      .populate('following', 'username displayName avatar');
    
    res.json({
      success: true,
      user: updatedUser,
      isFollowing: !isFollowing,
      followersCount: updatedUser.stats.followersCount
    });
    
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get user achievements
app.get('/api/users/:userId/achievements', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('achievements');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      achievements: user.achievements || []
    });
    
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ========== STREAK ROUTES ==========

// Get current streak
app.get('/api/streaks/current', authenticateToken, async (req, res) => {
  try {
    const streak = await Streak.findOne({ userId: req.user._id });
    
    if (!streak) {
      // Create new streak if doesn't exist
      const newStreak = new Streak({
        userId: req.user._id,
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        todayVerified: false,
        history: []
      });
      await newStreak.save();
      
      return res.json({
        success: true,
        streak: newStreak
      });
    }
    
    // Check if streak needs to be reset (missed a day)
    const now = new Date();
    const lastUpdate = new Date(streak.lastUpdated);
    const daysSinceLastUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastUpdate > 1 && streak.currentStreak > 0) {
      // Streak broken
      streak.currentStreak = 0;
      streak.status = 'broken';
      streak.history.push({
        date: new Date(lastUpdate.getTime() + 24 * 60 * 60 * 1000), // Next day
        verified: false,
        verificationMethod: 'shame',
        shameMessage: 'Missed daily verification',
        isPublicShame: false
      });
      await streak.save();
      
      // Update user stats
      await User.findByIdAndUpdate(req.user._id, {
        $set: { 'stats.currentStreak': 0 }
      });
    }
    
    res.json({
      success: true,
      streak
    });
    
  } catch (error) {
    console.error('Get streak error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get streak by user ID
app.get('/api/streaks/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const streak = await Streak.findOne({ userId });
    
    if (!streak) {
      return res.status(404).json({
        success: false,
        message: 'Streak not found'
      });
    }
    
    res.json({
      success: true,
      streak
    });
    
  } catch (error) {
    console.error('Get user streak error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Verify streak
app.post('/api/streaks/verify', authenticateToken, async (req, res) => {
  try {
    const { method = 'manual', duration = 30, notes = '', timestamp } = req.body;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Find or create streak
    let streak = await Streak.findOne({ userId: req.user._id });
    
    if (!streak) {
      streak = new Streak({
        userId: req.user._id,
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        todayVerified: false,
        history: []
      });
    }
    
    // Check if already verified today
    const todayStr = today.toISOString().split('T')[0];
    const alreadyVerifiedToday = streak.history.some(entry => {
      const entryDate = new Date(entry.date);
      const entryDateStr = entryDate.toISOString().split('T')[0];
      return entryDateStr === todayStr && entry.verified;
    });
    
    if (alreadyVerifiedToday) {
      return res.status(400).json({
        success: false,
        message: 'Already verified today'
      });
    }
    
    // Add verification to history
    const verification = {
      date: now,
      verified: true,
      verificationMethod: method,
      duration: parseInt(duration),
      notes: notes || '',
      location: req.body.location || null
    };
    
    streak.history.push(verification);
    
    // Update streak counters
    const lastUpdate = new Date(streak.lastUpdated);
    const lastUpdateDate = new Date(lastUpdate.getFullYear(), lastUpdate.getMonth(), lastUpdate.getDate());
    
    if (today.getTime() === lastUpdateDate.getTime() || streak.currentStreak === 0) {
      // Same day or new streak
      streak.currentStreak += 1;
    } else if (today.getTime() === lastUpdateDate.getTime() + 24 * 60 * 60 * 1000) {
      // Next day - continue streak
      streak.currentStreak += 1;
    } else {
      // Streak broken
      streak.currentStreak = 1;
    }
    
    // Update longest streak
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }
    
    // Update totals
    streak.totalDays += 1;
    streak.totalOutdoorTime += parseInt(duration) || 30;
    streak.todayVerified = true;
    streak.lastUpdated = now;
    streak.status = 'active';
    
    // Update next checkpoint
    const nextCheckpoint = new Date(today);
    nextCheckpoint.setDate(nextCheckpoint.getDate() + 1);
    streak.nextCheckpoint = nextCheckpoint;
    
    await streak.save();
    
    // Update user stats
    const user = await User.findById(req.user._id);
    user.stats.currentStreak = streak.currentStreak;
    user.stats.longestStreak = streak.longestStreak;
    user.stats.totalDays = streak.totalDays;
    user.stats.totalOutdoorTime = streak.totalOutdoorTime;
    
    // Calculate consistency score
    if (user.stats.totalDays > 0) {
      const consistency = (streak.currentStreak / user.stats.totalDays) * 100;
      user.stats.consistencyScore = Math.min(100, Math.round(consistency));
    }
    
    await user.save();
    
    // Check for achievements
    const achievements = [];
    if (streak.currentStreak === 7) {
      achievements.push({
        name: 'Weekly Warrior',
        earnedAt: now,
        icon: '🏆',
        description: 'Maintained a 7-day streak'
      });
    }
    
    if (streak.currentStreak === 30) {
      achievements.push({
        name: 'Monthly Maestro',
        earnedAt: now,
        icon: '🌟',
        description: 'Maintained a 30-day streak'
      });
    }
    
    if (streak.currentStreak === 100) {
      achievements.push({
        name: 'Century Club',
        earnedAt: now,
        icon: '💯',
        description: 'Maintained a 100-day streak'
      });
    }
    
    if (achievements.length > 0) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { achievements: { $each: achievements } }
      });
    }
    
    res.json({
      success: true,
      streak,
      message: 'Verification successful!',
      achievements: achievements.length > 0 ? achievements : null
    });
    
  } catch (error) {
    console.error('Verify streak error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Shame endpoint
app.post('/api/streaks/shame', authenticateToken, async (req, res) => {
  try {
    const { message = 'Failed to touch grass today', public = true } = req.body;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Find or create streak
    let streak = await Streak.findOne({ userId: req.user._id });
    
    if (!streak) {
      streak = new Streak({
        userId: req.user._id,
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        todayVerified: false,
        history: []
      });
    }
    
    // Check if already has shame entry for today
    const todayStr = today.toISOString().split('T')[0];
    const alreadyShamedToday = streak.history.some(entry => {
      const entryDate = new Date(entry.date);
      const entryDateStr = entryDate.toISOString().split('T')[0];
      return entryDateStr === todayStr && !entry.verified;
    });
    
    if (alreadyShamedToday) {
      return res.status(400).json({
        success: false,
        message: 'Already accepted shame for today'
      });
    }
    
    // Add shame entry
    streak.history.push({
      date: now,
      verified: false,
      verificationMethod: 'shame',
      shameMessage: message,
      isPublicShame: public
    });
    
    // Reset streak
    streak.currentStreak = 0;
    streak.todayVerified = false;
    streak.lastUpdated = now;
    streak.status = 'broken';
    
    await streak.save();
    
    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $set: { 'stats.currentStreak': 0 }
    });
    
    res.json({
      success: true,
      streak,
      message: 'Shame accepted. Streak reset.'
    });
    
  } catch (error) {
    console.error('Shame error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ========== LEADERBOARD ROUTES ==========

// Global leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    // Get users with highest streaks
    const users = await User.find({ 'preferences.showOnLeaderboard': true })
      .select('username displayName avatar stats subscription')
      .sort({ 'stats.currentStreak': -1, 'stats.consistencyScore': -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));
    
    const total = await User.countDocuments({ 'preferences.showOnLeaderboard': true });
    
    const leaderboard = users.map((user, index) => ({
      rank: parseInt(offset) + index + 1,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      streak: user.stats.currentStreak,
      consistency: user.stats.consistencyScore,
      location: user.location?.city || 'Unknown',
      isPremium: user.subscription?.plan !== 'free',
      totalDays: user.stats.totalDays,
      longestStreak: user.stats.longestStreak
    }));
    
    res.json({
      success: true,
      leaderboard,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get user rank
app.get('/api/leaderboard/user-rank/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get all users sorted by streak
    const allUsers = await User.find({ 'preferences.showOnLeaderboard': true })
      .select('_id stats.currentStreak')
      .sort({ 'stats.currentStreak': -1, 'stats.consistencyScore': -1 });
    
    // Find user's rank (1-indexed)
    const rank = allUsers.findIndex(user => user._id.toString() === userId) + 1;
    
    res.json({
      success: true,
      rank: rank > 0 ? rank : null,
      totalUsers: allUsers.length
    });
    
  } catch (error) {
    console.error('Get user rank error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ========== NOTIFICATION ROUTES ==========

// Mock notifications endpoint
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    // Mock notifications for now
    const notifications = [
      {
        id: '1',
        type: 'streak',
        title: 'Streak Reminder',
        message: 'Remember to verify your daily streak!',
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        type: 'achievement',
        title: 'New Achievement!',
        message: 'You earned the "Weekly Warrior" badge!',
        read: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    res.json({
      success: true,
      notifications
    });
    
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ========== CHAT ROUTES ==========

// Mock chat endpoint
app.get('/api/chat/messages', authenticateToken, async (req, res) => {
  try {
    // Mock chat messages
    const messages = [
      {
        id: '1',
        userId: 'user1',
        username: 'john_doe',
        displayName: 'John Doe',
        message: 'Just completed my 7-day streak! 💪',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '2',
        userId: 'user2',
        username: 'jane_smith',
        displayName: 'Jane Smith',
        message: 'Anyone up for a challenge this week?',
        timestamp: new Date(Date.now() - 1800000).toISOString()
      }
    ];
    
    res.json({
      success: true,
      messages
    });
    
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Mock online users
app.get('/api/chat/online-users', authenticateToken, async (req, res) => {
  try {
    // Mock online users
    const onlineUsers = [
      {
        id: 'user1',
        username: 'john_doe',
        displayName: 'John Doe',
        avatar: '',
        streak: 7
      },
      {
        id: 'user2',
        username: 'jane_smith',
        displayName: 'Jane Smith',
        avatar: '',
        streak: 15
      }
    ];
    
    res.json({
      success: true,
      onlineUsers
    });
    
  } catch (error) {
    console.error('Get online users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ========== 404 HANDLER ==========
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl,
    availableEndpoints: [
      '/api/health',
      '/api/auth/register',
      '/api/auth/login',
      '/api/auth/me',
      '/api/users/:username',
      '/api/streaks/current',
      '/api/streaks/verify',
      '/api/leaderboard'
    ]
  });
});

// Add this to server.js (before the 404 handler)
app.get('/api/debug/users', async (req, res) => {
  try {
    const users = await User.find({});
    console.log('Total users in database:', users.length);
    
    res.json({
      success: true,
      count: users.length,
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  const statusCode = err.status || 500;
  const message = NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(NODE_ENV !== 'production' && { 
      error: err.message,
      stack: err.stack 
    })
  });
});

// ========== START SERVER ==========
const server = http.createServer(app);

const startServer = (port) => {
  server.listen(port, () => {
    console.log(`
    🚀 TouchGrass Backend Server Started!
    
    📍 Local: http://localhost:${port}
    📡 Health: http://localhost:${port}/api/health
    🔧 Environment: ${NODE_ENV}
    🌐 CORS: Enabled for ${FRONTEND_URL}
    
    🗄️  Database: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}
    
    🎯 Available Endpoints:
    ├── GET    /api/health                    - Health check
    ├── POST   /api/auth/register             - Register user
    ├── POST   /api/auth/login                - Login user
    ├── GET    /api/auth/me                   - Get profile (protected)
    ├── GET    /api/users/:username           - Get user profile
    ├── PUT    /api/users/bio                 - Update bio
    ├── POST   /api/users/:userId/follow      - Follow/unfollow
    ├── GET    /api/streaks/current           - Current streak
    ├── POST   /api/streaks/verify            - Verify streak
    ├── POST   /api/streaks/shame             - Accept shame day
    ├── GET    /api/streaks/user/:userId      - Get user streak
    ├── GET    /api/leaderboard               - Global leaderboard
    ├── GET    /api/leaderboard/user-rank/:userId - Get user rank
    ├── GET    /api/notifications             - Get notifications
    ├── GET    /api/chat/messages             - Get chat messages
    ├── GET    /api/chat/online-users         - Get online users
    
    🔑 Authentication: Bearer token required for protected routes
    💡 Tip: Test with Postman or curl first
    `);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️  Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('❌ Server error:', err);
      process.exit(1);
    }
  });
};

// Start with the default port
startServer(PORT);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = { app, server };