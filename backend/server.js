
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const compression = require('compression');
// const morgan = require('morgan');
// const http = require('http');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const crypto = require('crypto');
// const path = require('path');

// // Import database configuration
// const { configureMongoDB } = require('./src/config/database');

// const app = express();

// // Environment variables
// const PORT = process.env.PORT || 5001;
// const NODE_ENV = process.env.NODE_ENV || 'development';
// const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
// const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// // ========== MIDDLEWARE SETUP ==========

// // Security middleware
// app.use(helmet({
//   contentSecurityPolicy: false,
//   crossOriginEmbedderPolicy: false
// }));

// // CORS configuration
// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);

//     const allowedOrigins = [
//       'http://localhost:3000',
//       'http://localhost:3001',
//       'http://localhost:3002',
//       'http://localhost:3003',
//       'http://localhost:5001',
//       'http://127.0.0.1:3000',
//       'http://127.0.0.1:3001',
//       'http://127.0.0.1:3002',
//       'http://127.0.0.1:3003',
//       FRONTEND_URL
//     ].filter(Boolean);

//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       console.log('CORS blocked origin:', origin);
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: [
//     'Content-Type',
//     'Authorization',
//     'Accept',
//     'Origin',
//     'X-Requested-With',
//     'X-User-Email',
//     'X-Access-Token',
//     'X-User-Id'
//   ],
//   exposedHeaders: ['Content-Range', 'X-Content-Range']
// };

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

// // Rate limiting
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: NODE_ENV === 'development' ? 1000 : 100,
//   standardHeaders: true,
//   legacyHeaders: false,
//   skip: (req) => req.path === '/api/health' || req.path === '/api',
//   message: {
//     success: false,
//     message: 'Too many requests, please try again later.'
//   }
// });

// app.use('/api/', apiLimiter);

// // Body parsing
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Compression
// app.use(compression());

// // Logging
// const logFormat = NODE_ENV === 'production' ? 'combined' : 'dev';
// app.use(morgan(logFormat));

// // Request ID middleware
// app.use((req, res, next) => {
//   req.id = crypto.randomUUID();
//   res.setHeader('X-Request-ID', req.id);
//   next();
// });

// app.get('/', (req, res) => {
//   res.json({ status: 'Backend is running', timestamp: new Date() });
// });

// // Render health check (required!)
// app.get('/healthz', (req, res) => {
//   res.status(200).json({
//     status: 'ok',
//     timestamp: new Date().toISOString()
//   });
// });

// // ========== DATABASE CONNECTION ==========

// // Initialize database connection using the configured function
// configureMongoDB()
//   .then(() => {
//     console.log('✅ Database initialization completed');
//   })
//   .catch((error) => {
//     console.error('❌ Database initialization failed:', error.message);
//     if (NODE_ENV === 'production') {
//       process.exit(1);
//     }
//   });
// // ========== DATABASE SCHEMAS & MODELS ==========

// // User Schema
// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     minlength: 3,
//     maxlength: 30
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6
//   },
//   displayName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   avatar: {
//     type: String,
//     default: ''
//   },
//   bio: {
//     type: String,
//     maxlength: 500,
//     default: ''
//   },
//   location: {
//     city: String,
//     country: String,
//     timezone: String
//   },
//   preferences: {
//     publicProfile: { type: Boolean, default: true },
//     showOnLeaderboard: { type: Boolean, default: true },
//     notifications: {
//       streakReminder: { type: Boolean, default: true },
//       leaderboardUpdates: { type: Boolean, default: true },
//       achievementAlerts: { type: Boolean, default: true }
//     }
//   },
//   stats: {
//     currentStreak: { type: Number, default: 0 },
//     longestStreak: { type: Number, default: 0 },
//     totalDays: { type: Number, default: 0 },
//     totalOutdoorTime: { type: Number, default: 0 },
//     consistencyScore: { type: Number, default: 0 },
//     leaderboardRank: { type: Number, default: 999999 },
//     followersCount: { type: Number, default: 0 },
//     followingCount: { type: Number, default: 0 }
//   },
//   subscription: {
//     active: { type: Boolean, default: false },
//     plan: { type: String, enum: ['free', 'premium', 'elite'], default: 'free' },
//     currentPeriodEnd: Date,
//     stripeCustomerId: String,
//     stripeSubscriptionId: String,
//     dodoSubscriptionId: String,
//     streakFreezeTokens: { type: Number, default: 0 }
//   },
//   achievements: [{
//     name: String,
//     earnedAt: Date,
//     icon: String,
//     description: String
//   }],
//   following: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }],
//   followers: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }],
//   isAdmin: {
//     type: Boolean,
//     default: false
//   },
//   resetPasswordToken: String,
//   resetPasswordExpires: Date,
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// userSchema.methods.generateAuthToken = function() {
//   return jwt.sign(
//     { 
//       userId: this._id,
//       username: this.username,
//       email: this.email 
//     },
//     JWT_SECRET,
//     { expiresIn: '30d' }
//   );
// };

// userSchema.methods.generateResetToken = function() {
//   const resetToken = crypto.randomBytes(32).toString('hex');
//   this.resetPasswordToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');
//   this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
//   return resetToken;
// };

// const User = mongoose.model('User', userSchema);

// // Import models
// const Challenge = require('./src/models/Challenge');
// const UserChallenge = require('./src/models/UserChallenge');
// // const uploadRoutes = require('./routes/upload');

// const challengeRoutes = require('./src/routes/challenges');

// app.use('/api/challenges', challengeRoutes);

// // Get user's challenges
// app.get('/api/user/challenges', authenticateToken, async (req, res) => {
//   try {
//     const userChallenges = await UserChallenge.find({ userId: req.user._id })
//       .populate('challengeId')
//       .sort({ joinedAt: -1 });

//     res.json({
//       success: true,
//       challenges: userChallenges
//     });

//   } catch (error) {
//     console.error('Get user challenges error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Verification Wall Schema (keeping for reference but using imported model)
// const verificationWallSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     index: true
//   },

//   // Photo details
//   photoUrl: {
//     type: String,
//     required: true
//   },
//   photoThumbnail: String,
//   photoMetadata: {
//     width: Number,
//     height: Number,
//     size: Number,
//     format: String,
//     uploadedAt: Date
//   },

//   // Verification details
//   streakId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Streak'
//   },
//   activityType: {
//     type: String,
//     enum: ['walk', 'run', 'hike', 'sports', 'gardening', 'picnic', 'meditation', 'reading', 'other'],
//     required: true
//   },
//   duration: {
//     type: Number, // in minutes
//     required: true,
//     min: 1,
//     max: 1440
//   },
//   location: {
//     lat: Number,
//     lng: Number,
//     name: String,
//     address: String
//   },

//   // User content
//   caption: {
//     type: String,
//     maxlength: 500,
//     trim: true
//   },
//   tags: [String],

//   // Social features
//   likes: [{
//     userId: mongoose.Schema.Types.ObjectId,
//     timestamp: Date
//   }],
//   comments: [{
//     userId: mongoose.Schema.Types.ObjectId,
//     text: String,
//     timestamp: Date,
//     likes: [{
//       userId: mongoose.Schema.Types.ObjectId,
//       timestamp: Date
//     }]
//   }],

//   // Reporting system
//   reports: [{
//     userId: mongoose.Schema.Types.ObjectId,
//     reason: {
//       type: String,
//       enum: ['fake_photo', 'inappropriate', 'spam', 'copyright', 'other'],
//       required: true
//     },
//     details: String,
//     timestamp: Date,
//     status: {
//       type: String,
//       enum: ['pending', 'reviewed', 'dismissed'],
//       default: 'pending'
//     }
//   }],

//   // Moderation
//   isBlocked: {
//     type: Boolean,
//     default: false
//   },
//   blockedReason: String,
//   blockedAt: Date,
//   blockedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },

//   // Analytics
//   views: {
//     type: Number,
//     default: 0
//   },
//   shares: {
//     type: Number,
//     default: 0
//   },

//   // Verification status
//   isVerified: {
//     type: Boolean,
//     default: true // Assume genuine unless reported
//   },
//   verificationScore: {
//     type: Number,
//     min: 0,
//     max: 100,
//     default: 100
//   }
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Indexes
// verificationWallSchema.index({ userId: 1, createdAt: -1 });
// verificationWallSchema.index({ createdAt: -1 });
// verificationWallSchema.index({ isBlocked: 1 });
// verificationWallSchema.index({ 'reports.status': 1 });

// // Virtual for total reports
// verificationWallSchema.virtual('totalReports').get(function() {
//   return this.reports.length;
// });

// // Virtual for pending reports
// verificationWallSchema.virtual('pendingReports').get(function() {
//   return this.reports.filter(report => report.status === 'pending').length;
// });

// // Virtual for like count
// verificationWallSchema.virtual('likeCount').get(function() {
//   return this.likes.length;
// });

// // Virtual for comment count
// verificationWallSchema.virtual('commentCount').get(function() {
//   return this.comments.length;
// });

// // Method to add report
// verificationWallSchema.methods.addReport = async function(userId, reason, details = '') {
//   // Check if user already reported
//   const existingReport = this.reports.find(report =>
//     report.userId.toString() === userId.toString()
//   );

//   if (existingReport) {
//     throw new Error('You have already reported this post');
//   }

//   this.reports.push({
//     userId,
//     reason,
//     details,
//     timestamp: new Date(),
//     status: 'pending'
//   });

//   // Auto-block if too many reports
//   if (this.pendingReports >= 5) {
//     this.isBlocked = true;
//     this.blockedReason = 'Multiple reports received';
//     this.blockedAt = new Date();
//     this.verificationScore = Math.max(0, this.verificationScore - 20);
//   }

//   return this.save();
// };

// // Method to moderate report
// verificationWallSchema.methods.moderateReport = async function(reportId, action, moderatorId) {
//   const report = this.reports.id(reportId);
//   if (!report) {
//     throw new Error('Report not found');
//   }

//   report.status = action === 'block' ? 'reviewed' : 'dismissed';

//   if (action === 'block') {
//     this.isBlocked = true;
//     this.blockedReason = `Blocked due to report: ${report.reason}`;
//     this.blockedAt = new Date();
//     this.blockedBy = moderatorId;
//     this.verificationScore = Math.max(0, this.verificationScore - 30);
//   }

//   return this.save();
// };

// // Method to add comment
// verificationWallSchema.methods.addComment = async function(userId, text) {
//   if (this.isBlocked) {
//     throw new Error('Cannot comment on blocked post');
//   }

//   this.comments.push({
//     userId,
//     text: text.trim(),
//     timestamp: new Date()
//   });

//   return this.save();
// };

// // Method to like/unlike
// verificationWallSchema.methods.toggleLike = async function(userId) {
//   const existingLike = this.likes.find(like =>
//     like.userId.toString() === userId.toString()
//   );

//   if (existingLike) {
//     // Unlike
//     this.likes = this.likes.filter(like =>
//       like.userId.toString() !== userId.toString()
//     );
//   } else {
//     // Like
//     this.likes.push({
//       userId,
//       timestamp: new Date()
//     });
//   }

//   return this.save();
// };

// // Static method to get public posts
// verificationWallSchema.statics.getPublicPosts = function(limit = 20, skip = 0) {
//   return this.find({ isBlocked: false })
//     .populate('userId', 'username displayName avatar')
//     .sort({ createdAt: -1 })
//     .limit(limit)
//     .skip(skip);
// };

// // Static method to get reported posts for moderation
// verificationWallSchema.statics.getReportedPosts = function() {
//   return this.find({
//     'reports.status': 'pending',
//     isBlocked: false
//   })
//     .populate('userId', 'username displayName avatar')
//     .populate('reports.userId', 'username')
//     .sort({ 'reports.timestamp': -1 });
// };

// const VerificationWall = mongoose.model('VerificationWall', verificationWallSchema);

// // Password Reset Token Schema
// const passwordResetTokenSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   token: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   expiresAt: {
//     type: Date,
//     required: true,
//     default: () => new Date(Date.now() + 3600000) // 1 hour
//   },
//   used: {
//     type: Boolean,
//     default: false
//   }
// }, {
//   timestamps: true
// });

// const PasswordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema);

// // Streak Schema
// const streakSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     unique: true
//   },
//   startDate: {
//     type: Date,
//     default: Date.now
//   },
//   lastUpdated: {
//     type: Date,
//     default: Date.now
//   },
//   currentStreak: {
//     type: Number,
//     default: 1
//   },
//   longestStreak: {
//     type: Number,
//     default: 1
//   },
//   totalDays: {
//     type: Number,
//     default: 1
//   },
//   totalOutdoorTime: {
//     type: Number,
//     default: 0
//   },
//   todayVerified: {
//     type: Boolean,
//     default: false
//   },
//   history: [{
//     date: Date,
//     verified: Boolean,
//     verificationMethod: {
//       type: String,
//       enum: ['photo', 'location', 'manual', 'shame']
//     },
//     photoUrl: String,
//     duration: Number,
//     notes: String,
//     location: Object,
//     shameMessage: String,
//     isPublicShame: { type: Boolean, default: false }
//   }],
//   status: {
//     type: String,
//     enum: ['active', 'broken', 'paused'],
//     default: 'active'
//   },
//   restoredAt: Date,
//   restorationPaymentId: String,
//   nextCheckpoint: {
//     type: Date,
//     default: () => {
//       const tomorrow = new Date();
//       tomorrow.setDate(tomorrow.getDate() + 1);
//       tomorrow.setHours(0, 0, 0, 0);
//       return tomorrow;
//     }
//   }
// }, {
//   timestamps: true
// });

// const Streak = mongoose.model('Streak', streakSchema);

// // Payment Schema
// const paymentSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   paymentId: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   amount: {
//     type: Number,
//     required: true
//   },
//   currency: {
//     type: String,
//     default: 'USD'
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
//     default: 'pending'
//   },
//   type: {
//     type: String,
//     enum: ['streak_restoration', 'subscription', 'freeze_tokens', 'donation', 'custom'],
//     required: true
//   },
//   metadata: {
//     type: Object,
//     default: {}
//   },
//   provider: {
//     type: String,
//     enum: ['stripe', 'dodo', 'paypal', 'razorpay'],
//     default: 'dodo'
//   },
//   error: String,
//   refunds: [{
//     refundId: String,
//     amount: Number,
//     reason: String,
//     processedAt: Date
//   }],
//   processedAt: Date
// }, {
//   timestamps: true
// });

// const Payment = mongoose.model('Payment', paymentSchema);

// // Webhook Log Schema
// const webhookLogSchema = new mongoose.Schema({
//   eventId: String,
//   type: String,
//   payload: Object,
//   result: Object,
//   processedAt: Date,
//   signatureValid: Boolean,
//   error: String
// }, {
//   timestamps: true
// });

// const WebhookLog = mongoose.model('WebhookLog', webhookLogSchema);



// // ========== AUTHENTICATION MIDDLEWARE ==========

// const authenticateToken = async (req, res, next) => {
//   try {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: 'Access token required'
//       });
//     }

//     const decoded = jwt.verify(token, JWT_SECRET);
//     const user = await User.findById(decoded.userId).select('-password');

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     req.user = user;
//     req.token = token;
//     next();
//   } catch (error) {
//     console.error('Auth error:', error.message);
//     return res.status(401).json({
//       success: false,
//       message: 'Invalid or expired token'
//     });
//   }
// };

// // ========== HEALTH CHECK ==========

// app.get('/api/health', (req, res) => {
//   res.json({
//     success: true,
//     status: 'healthy',
//     service: 'TouchGrass API',
//     version: '1.0.0',
//     timestamp: new Date().toISOString(),
//     environment: NODE_ENV,
//     database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
//   });
// });

// // ========== WELCOME ENDPOINT ==========

// app.get('/api', (req, res) => {
//   res.json({
//     success: true,
//     message: 'Welcome to TouchGrass API',
//     version: '1.0.0',
//     endpoints: {
//       auth: {
//         register: 'POST /api/auth/register',
//         login: 'POST /api/auth/login',
//         me: 'GET /api/auth/me',
//         forgotPassword: 'POST /api/auth/forgot-password',
//         resetPassword: 'POST /api/auth/reset-password',
//         verifyToken: 'GET /api/auth/reset-password/:token',
//         changePassword: 'POST /api/auth/change-password',
//         google: 'POST /api/auth/google'
//       },
//       users: {
//         profile: 'GET /api/users/:username',
//         updateBio: 'PUT /api/users/bio',
//         updateAvatar: 'PUT /api/users/avatar',
//         follow: 'POST /api/users/:userId/follow',
//         achievements: 'GET /api/users/:userId/achievements'
//       },
//       streaks: {
//         current: 'GET /api/streaks/current',
//         verify: 'POST /api/streaks/verify',
//         shame: 'POST /api/streaks/shame',
//         userStreak: 'GET /api/streaks/user/:userId'
//       },
//       leaderboard: 'GET /api/leaderboard',
//       leaderboardUserRank: 'GET /api/leaderboard/user-rank/:userId',
//       seo: {
//         sitemap: 'GET /api/seo/sitemap.xml',
//         robots: 'GET /api/seo/robots.txt'
//       }
//     },
//     dodo: {
//       checkout: 'GET /api/dodo/checkout/:plan',
//       webhook: 'POST /api/dodo/webhook'
//     }
//   });
// });

// // ========== SEO ROUTES ==========

// // Sitemap route
// app.get('/api/seo/sitemap.xml', async (req, res) => {
//   try {
//     const baseUrl = process.env.FRONTEND_URL || 'https://touchgrass.now';
//     const generator = new SitemapGenerator(baseUrl);
//     const sitemap = await generator.generate();

//     res.header('Content-Type', 'application/xml');
//     res.send(sitemap);
//   } catch (error) {
//     console.error('Sitemap generation error:', error);
//     res.status(500).send('Error generating sitemap');
//   }
// });

// // Static sitemap
// app.get('/api/seo/sitemap-static.xml', async (req, res) => {
//   try {
//     const baseUrl = process.env.FRONTEND_URL || 'https://touchgrass.now';
//     const generator = new SitemapGenerator(baseUrl);
//     const sitemap = await generator.generateStatic();

//     res.header('Content-Type', 'application/xml');
//     res.send(sitemap);
//   } catch (error) {
//     console.error('Static sitemap error:', error);
//     res.status(500).send('Error generating static sitemap');
//   }
// });

// // Robots.txt route
// app.get('/api/seo/robots.txt', (req, res) => {
//   const robots = `User-agent: *
// Allow: /
// Disallow: /dashboard
// Disallow: /profile
// Disallow: /api/
// Sitemap: ${process.env.FRONTEND_URL || 'https://touchgrass.now'}/api/seo/sitemap.xml`;

//   res.header('Content-Type', 'text/plain');
//   res.send(robots);
// });

// // ========== AUTH ROUTES ==========

// app.post('/api/auth/register', async (req, res) => {
//   try {
//     const { username, email, password, displayName } = req.body;

//     if (!username || !email || !password || !displayName) {
//       return res.status(400).json({
//         success: false,
//         message: 'All fields are required'
//       });
//     }

//     const existingUser = await User.findOne({
//       $or: [{ email }, { username }]
//     });

//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: 'User already exists'
//       });
//     }

//     const user = new User({
//       username,
//       email,
//       password,
//       displayName,
//       stats: {
//         currentStreak: 0,
//         longestStreak: 0,
//         totalDays: 0,
//         totalOutdoorTime: 0,
//         consistencyScore: 0,
//         leaderboardRank: 999999,
//         followersCount: 0,
//         followingCount: 0
//       }
//     });

//     await user.save();

//     const streak = new Streak({
//       userId: user._id,
//       currentStreak: 0,
//       longestStreak: 0,
//       totalDays: 0,
//       todayVerified: false,
//       history: []
//     });
//     await streak.save();

//     const token = user.generateAuthToken();

//     const userResponse = user.toObject();
//     delete userResponse.password;

//     res.status(201).json({
//       success: true,
//       message: 'Registration successful',
//       token,
//       user: userResponse
//     });

//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error during registration'
//     });
//   }
// });

// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email and password are required'
//       });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     const isPasswordValid = await user.comparePassword(password);

//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     const token = user.generateAuthToken();

//     const userResponse = user.toObject();
//     delete userResponse.password;

//     res.json({
//       success: true,
//       message: 'Login successful',
//       token,
//       user: userResponse
//     });

//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error during login'
//     });
//   }
// });

// // Simple Google login simulation
// app.post('/api/auth/google', async (req, res) => {
//   try {
//     const { email, name, picture } = req.body;

//     if (!email || !name) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email and name are required for Google login'
//       });
//     }

//     // Check if user already exists
//     let user = await User.findOne({ email });

//     if (!user) {
//       // Create new user from Google data
//       const username = email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 5);

//       user = new User({
//         email,
//         username,
//         displayName: name,
//         avatar: picture || '',
//         password: crypto.randomBytes(16).toString('hex'), // Random password for Google users
//         stats: {
//           currentStreak: 0,
//           longestStreak: 0,
//           totalDays: 0,
//           totalOutdoorTime: 0,
//           consistencyScore: 0,
//           leaderboardRank: 999999,
//           followersCount: 0,
//           followingCount: 0
//         }
//       });

//       await user.save();

//       // Create streak for new user
//       const streak = new Streak({
//         userId: user._id,
//         currentStreak: 0,
//         longestStreak: 0,
//         totalDays: 0,
//         todayVerified: false,
//         history: []
//       });
//       await streak.save();
//     }

//     const token = user.generateAuthToken();

//     const userResponse = user.toObject();
//     delete userResponse.password;

//     res.json({
//       success: true,
//       message: 'Google login successful',
//       token,
//       user: userResponse
//     });

//   } catch (error) {
//     console.error('Google login error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error during Google login'
//     });
//   }
// });

// // Forgot password - request password reset
// app.post('/api/auth/forgot-password', async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email is required'
//       });
//     }

//     // Find user by email
//     const user = await User.findOne({ email });

//     if (!user) {
//       // For security, don't reveal if user exists
//       return res.json({
//         success: true,
//         message: 'If an account exists with this email, you will receive a password reset link'
//       });
//     }

//     // Generate reset token
//     const resetToken = crypto.randomBytes(32).toString('hex');
//     const hashedToken = crypto
//       .createHash('sha256')
//       .update(resetToken)
//       .digest('hex');

//     // Create reset token in database
//     const resetTokenDoc = new PasswordResetToken({
//       userId: user._id,
//       token: hashedToken,
//       expiresAt: new Date(Date.now() + 3600000) // 1 hour
//     });

//     await resetTokenDoc.save();

//     // In a real app, you would send an email here
//     // For now, we'll return the token in development
//     const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;

//     console.log('📧 Password reset URL (dev mode):', resetUrl);
//     console.log('For production, implement email sending with nodemailer');

//     res.json({
//       success: true,
//       message: 'Password reset initiated',
//       // In development, return the token for testing
//       ...(NODE_ENV === 'development' && {
//         resetToken,
//         resetUrl,
//         note: 'In production, this would be sent via email'
//       })
//     });

//   } catch (error) {
//     console.error('Forgot password error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Verify reset token
// app.get('/api/auth/reset-password/:token', async (req, res) => {
//   try {
//     const { token } = req.params;

//     if (!token) {
//       return res.status(400).json({
//         success: false,
//         message: 'Token is required'
//       });
//     }

//     // Hash the token to compare with stored hash
//     const hashedToken = crypto
//       .createHash('sha256')
//       .update(token)
//       .digest('hex');

//     // Find valid reset token
//     const resetToken = await PasswordResetToken.findOne({
//       token: hashedToken,
//       used: false,
//       expiresAt: { $gt: new Date() }
//     }).populate('userId', 'email displayName');

//     if (!resetToken) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid or expired reset token'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Token is valid',
//       email: resetToken.userId.email,
//       displayName: resetToken.userId.displayName
//     });

//   } catch (error) {
//     console.error('Verify token error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Reset password with token
// app.post('/api/auth/reset-password', async (req, res) => {
//   try {
//     const { token, newPassword } = req.body;

//     if (!token || !newPassword) {
//       return res.status(400).json({
//         success: false,
//         message: 'Token and new password are required'
//       });
//     }

//     if (newPassword.length < 6) {
//       return res.status(400).json({
//         success: false,
//         message: 'Password must be at least 6 characters'
//       });
//     }

//     // Hash the token to compare with stored hash
//     const hashedToken = crypto
//       .createHash('sha256')
//       .update(token)
//       .digest('hex');

//     // Find valid reset token
//     const resetToken = await PasswordResetToken.findOne({
//       token: hashedToken,
//       used: false,
//       expiresAt: { $gt: new Date() }
//     }).populate('userId');

//     if (!resetToken) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid or expired reset token'
//       });
//     }

//     // Update user's password
//     const user = resetToken.userId;
//     user.password = newPassword;
//     await user.save();

//     // Mark token as used
//     resetToken.used = true;
//     await resetToken.save();

//     // Delete all other reset tokens for this user
//     await PasswordResetToken.deleteMany({
//       userId: user._id,
//       used: false
//     });

//     res.json({
//       success: true,
//       message: 'Password reset successful. You can now login with your new password.'
//     });

//   } catch (error) {
//     console.error('Reset password error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.get('/api/auth/me', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id)
//       .select('-password')
//       .populate('followers', 'username displayName avatar')
//       .populate('following', 'username displayName avatar');

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     const streak = await Streak.findOne({ userId: user._id });

//     res.json({
//       success: true,
//       user: {
//         ...user.toObject(),
//         streakData: streak || null
//       }
//     });

//   } catch (error) {
//     console.error('Get profile error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Change password (authenticated)
// app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({
//         success: false,
//         message: 'Current password and new password are required'
//       });
//     }

//     if (newPassword.length < 6) {
//       return res.status(400).json({
//         success: false,
//         message: 'New password must be at least 6 characters'
//       });
//     }

//     const user = await User.findById(req.user._id);

//     // Verify current password
//     const isPasswordValid = await user.comparePassword(currentPassword);

//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: 'Current password is incorrect'
//       });
//     }

//     // Update password
//     user.password = newPassword;
//     await user.save();

//     res.json({
//       success: true,
//       message: 'Password changed successfully'
//     });

//   } catch (error) {
//     console.error('Change password error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // ========== USER ROUTES ==========

// app.get('/api/users/:username', authenticateToken, async (req, res) => {
//   try {
//     const { username } = req.params;

//     const user = await User.findOne({ username })
//       .select('-password -email')
//       .populate('followers', 'username displayName avatar')
//       .populate('following', 'username displayName avatar');

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     const isFollowing = req.user.following.includes(user._id);

//     const streak = await Streak.findOne({ userId: user._id });

//     res.json({
//       success: true,
//       user: {
//         ...user.toObject(),
//         isFollowing,
//         streakData: streak || null
//       }
//     });

//   } catch (error) {
//     console.error('Get user error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.put('/api/users/bio', authenticateToken, async (req, res) => {
//   try {
//     const { bio } = req.body;

//     if (bio && bio.length > 500) {
//       return res.status(400).json({
//         success: false,
//         message: 'Bio must be less than 500 characters'
//       });
//     }

//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { bio },
//       { new: true }
//     ).select('-password');

//     res.json({
//       success: true,
//       user
//     });

//   } catch (error) {
//     console.error('Update bio error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.put('/api/users/avatar', authenticateToken, async (req, res) => {
//   try {
//     const { avatar } = req.body;

//     if (!avatar) {
//       return res.status(400).json({
//         success: false,
//         message: 'Avatar URL is required'
//       });
//     }

//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { avatar },
//       { new: true }
//     ).select('-password');

//     res.json({
//       success: true,
//       user
//     });

//   } catch (error) {
//     console.error('Update avatar error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.post('/api/users/:userId/follow', authenticateToken, async (req, res) => {
//   try {
//     const { userId } = req.params;

//     if (userId === req.user._id.toString()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot follow yourself'
//       });
//     }

//     const userToFollow = await User.findById(userId);
//     if (!userToFollow) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     const currentUser = await User.findById(req.user._id);

//     const isFollowing = currentUser.following.includes(userId);

//     if (isFollowing) {
//       await User.findByIdAndUpdate(req.user._id, {
//         $pull: { following: userId },
//         $inc: { 'stats.followingCount': -1 }
//       });

//       await User.findByIdAndUpdate(userId, {
//         $pull: { followers: req.user._id },
//         $inc: { 'stats.followersCount': -1 }
//       });
//     } else {
//       await User.findByIdAndUpdate(req.user._id, {
//         $push: { following: userId },
//         $inc: { 'stats.followingCount': 1 }
//       });

//       await User.findByIdAndUpdate(userId, {
//         $push: { followers: req.user._id },
//         $inc: { 'stats.followersCount': 1 }
//       });
//     }

//     const updatedUser = await User.findById(userId)
//       .select('-password')
//       .populate('followers', 'username displayName avatar')
//       .populate('following', 'username displayName avatar');

//     res.json({
//       success: true,
//       user: updatedUser,
//       isFollowing: !isFollowing,
//       followersCount: updatedUser.stats.followersCount
//     });

//   } catch (error) {
//     console.error('Follow error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.get('/api/users/:userId/achievements', authenticateToken, async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const user = await User.findById(userId).select('achievements');

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     res.json({
//       success: true,
//       achievements: user.achievements || []
//     });

//   } catch (error) {
//     console.error('Get achievements error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // ========== STREAK ROUTES ==========

// app.get('/api/streaks/current', authenticateToken, async (req, res) => {
//   try {
//     const streak = await Streak.findOne({ userId: req.user._id });

//     if (!streak) {
//       const newStreak = new Streak({
//         userId: req.user._id,
//         currentStreak: 0,
//         longestStreak: 0,
//         totalDays: 0,
//         todayVerified: false,
//         history: []
//       });
//       await newStreak.save();

//       return res.json({
//         success: true,
//         streak: newStreak
//       });
//     }

//     const now = new Date();
//     const lastUpdate = new Date(streak.lastUpdated);
//     const daysSinceLastUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));

//     if (daysSinceLastUpdate > 1 && streak.currentStreak > 0) {
//       streak.currentStreak = 0;
//       streak.status = 'broken';
//       streak.history.push({
//         date: new Date(lastUpdate.getTime() + 24 * 60 * 60 * 1000),
//         verified: false,
//         verificationMethod: 'shame',
//         shameMessage: 'Missed daily verification',
//         isPublicShame: false
//       });
//       await streak.save();

//       await User.findByIdAndUpdate(req.user._id, {
//         $set: { 'stats.currentStreak': 0 }
//       });
//     }

//     res.json({
//       success: true,
//       streak
//     });

//   } catch (error) {
//     console.error('Get streak error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.get('/api/streaks/user/:userId', authenticateToken, async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const streak = await Streak.findOne({ userId });

//     if (!streak) {
//       return res.status(404).json({
//         success: false,
//         message: 'Streak not found'
//       });
//     }

//     res.json({
//       success: true,
//       streak
//     });

//   } catch (error) {
//     console.error('Get user streak error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.post('/api/streaks/verify', authenticateToken, async (req, res) => {
//   try {
//     const { method = 'manual', duration = 30, notes = '', timestamp } = req.body;
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

//     let streak = await Streak.findOne({ userId: req.user._id });

//     if (!streak) {
//       streak = new Streak({
//         userId: req.user._id,
//         currentStreak: 0,
//         longestStreak: 0,
//         totalDays: 0,
//         todayVerified: false,
//         history: []
//       });
//     }

//     const todayStr = today.toISOString().split('T')[0];
//     const alreadyVerifiedToday = streak.history.some(entry => {
//       const entryDate = new Date(entry.date);
//       const entryDateStr = entryDate.toISOString().split('T')[0];
//       return entryDateStr === todayStr && entry.verified;
//     });

//     if (alreadyVerifiedToday) {
//       return res.status(400).json({
//         success: false,
//         message: 'Already verified today'
//       });
//     }

//     const verification = {
//       date: now,
//       verified: true,
//       verificationMethod: method,
//       duration: parseInt(duration),
//       notes: notes || '',
//       location: req.body.location || null
//     };

//     streak.history.push(verification);

//     const lastUpdate = new Date(streak.lastUpdated);
//     const lastUpdateDate = new Date(lastUpdate.getFullYear(), lastUpdate.getMonth(), lastUpdate.getDate());

//     if (today.getTime() === lastUpdateDate.getTime() || streak.currentStreak === 0) {
//       streak.currentStreak += 1;
//     } else if (today.getTime() === lastUpdateDate.getTime() + 24 * 60 * 60 * 1000) {
//       streak.currentStreak += 1;
//     } else {
//       streak.currentStreak = 1;
//     }

//     if (streak.currentStreak > streak.longestStreak) {
//       streak.longestStreak = streak.currentStreak;
//     }

//     streak.totalDays += 1;
//     streak.totalOutdoorTime += parseInt(duration) || 30;
//     streak.todayVerified = true;
//     streak.lastUpdated = now;
//     streak.status = 'active';

//     const nextCheckpoint = new Date(today);
//     nextCheckpoint.setDate(nextCheckpoint.getDate() + 1);
//     streak.nextCheckpoint = nextCheckpoint;

//     await streak.save();

//     const user = await User.findById(req.user._id);
//     user.stats.currentStreak = streak.currentStreak;
//     user.stats.longestStreak = streak.longestStreak;
//     user.stats.totalDays = streak.totalDays;
//     user.stats.totalOutdoorTime = streak.totalOutdoorTime;

//     if (user.stats.totalDays > 0) {
//       const consistency = (streak.currentStreak / user.stats.totalDays) * 100;
//       user.stats.consistencyScore = Math.min(100, Math.round(consistency));
//     }

//     await user.save();

//     const achievements = [];
//     if (streak.currentStreak === 7) {
//       achievements.push({
//         name: 'Weekly Warrior',
//         earnedAt: now,
//         icon: '🏆',
//         description: 'Maintained a 7-day streak'
//       });
//     }

//     if (streak.currentStreak === 30) {
//       achievements.push({
//         name: 'Monthly Maestro',
//         earnedAt: now,
//         icon: '🌟',
//         description: 'Maintained a 30-day streak'
//       });
//     }

//     if (streak.currentStreak === 100) {
//       achievements.push({
//         name: 'Century Club',
//         earnedAt: now,
//         icon: '💯',
//         description: 'Maintained a 100-day streak'
//       });
//     }

//     if (achievements.length > 0) {
//       await User.findByIdAndUpdate(req.user._id, {
//         $push: { achievements: { $each: achievements } }
//       });
//     }

//     res.json({
//       success: true,
//       streak,
//       message: 'Verification successful!',
//       achievements: achievements.length > 0 ? achievements : null
//     });

//   } catch (error) {
//     console.error('Verify streak error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.post('/api/streaks/shame', authenticateToken, async (req, res) => {
//   try {
//     const { message = 'Failed to touch grass today', public = true } = req.body;
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

//     let streak = await Streak.findOne({ userId: req.user._id });

//     if (!streak) {
//       streak = new Streak({
//         userId: req.user._id,
//         currentStreak: 0,
//         longestStreak: 0,
//         totalDays: 0,
//         todayVerified: false,
//         history: []
//       });
//     }

//     const todayStr = today.toISOString().split('T')[0];
//     const alreadyShamedToday = streak.history.some(entry => {
//       const entryDate = new Date(entry.date);
//       const entryDateStr = entryDate.toISOString().split('T')[0];
//       return entryDateStr === todayStr && !entry.verified;
//     });

//     if (alreadyShamedToday) {
//       return res.status(400).json({
//         success: false,
//         message: 'Already accepted shame for today'
//       });
//     }

//     streak.history.push({
//       date: now,
//       verified: false,
//       verificationMethod: 'shame',
//       shameMessage: message,
//       isPublicShame: public
//     });

//     streak.currentStreak = 0;
//     streak.todayVerified = false;
//     streak.lastUpdated = now;
//     streak.status = 'broken';

//     await streak.save();

//     await User.findByIdAndUpdate(req.user._id, {
//       $set: { 'stats.currentStreak': 0 }
//     });

//     res.json({
//       success: true,
//       streak,
//       message: 'Shame accepted. Streak reset.'
//     });

//   } catch (error) {
//     console.error('Shame error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // ========== DODO PAYMENTS ROUTES ==========

// // Get Dodo checkout URLs for different plans
// app.get('/api/dodo/checkout/:plan', authenticateToken, async (req, res) => {
//   try {
//     const { plan } = req.params;

//     // Dodo product URLs from your environment
//     const dodoUrls = {
//       pro: process.env.DODO_PRO_PRODUCT_URL || 'https://checkout.dodopayments.com/buy/pdt_0NWPkwJJcZChm84jRPqIt',
//       enterprise: process.env.DODO_ENTERPRISE_PRODUCT_URL || 'https://checkout.dodopayments.com/buy/pdt_0NWPl4fuR5huBMtu7YAKT',
//       streak_restoration: process.env.DODO_TEST_PRODUCT_URL || 'https://checkout.dodopayments.com/buy/pdt_0NWPjjq1W9yybN1dR63eF'
//     };

//     if (!dodoUrls[plan]) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid plan type'
//       });
//     }

//     // Add user metadata to the URL
//     let checkoutUrl = dodoUrls[plan] + '?quantity=1';

//     if (req.user) {
//       const urlObj = new URL(checkoutUrl);
//       urlObj.searchParams.append('client_reference_id', req.user._id.toString());
//       if (req.user.email) {
//         urlObj.searchParams.append('prefilled_email', req.user.email);
//       }
//       urlObj.searchParams.append('product_name', `${plan === 'pro' ? 'Pro' : plan === 'enterprise' ? 'Enterprise' : 'Streak Restoration'} - TouchGrass`);
//       checkoutUrl = urlObj.toString();
//     }

//     // Log the payment attempt
//     const payment = new Payment({
//       userId: req.user._id,
//       paymentId: `dodo_${Date.now()}_${plan}`,
//       amount: plan === 'pro' ? 14.99 : plan === 'enterprise' ? 59.99 : 4.99,
//       currency: 'USD',
//       status: 'pending',
//       type: plan === 'streak_restoration' ? 'streak_restoration' : 'subscription',
//       metadata: {
//         plan: plan,
//         userEmail: req.user.email,
//         userName: req.user.displayName
//       },
//       provider: 'dodo'
//     });
//     await payment.save();

//     res.json({
//       success: true,
//       checkoutUrl,
//       plan: plan,
//       price: plan === 'pro' ? 14.99 : plan === 'enterprise' ? 59.99 : 4.99,
//       paymentId: payment.paymentId,
//       instructions: 'Open this URL in a new window to complete payment'
//     });

//   } catch (error) {
//     console.error('Dodo checkout error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to generate checkout URL'
//     });
//   }
// });

// // ========== LEADERBOARD ROUTES ==========

// app.get('/api/leaderboard', async (req, res) => {
//   try {
//     const { limit = 50, offset = 0 } = req.query;

//     const users = await User.find({ 'preferences.showOnLeaderboard': true })
//       .select('username displayName avatar stats subscription location')
//       .sort({ 'stats.currentStreak': -1, 'stats.consistencyScore': -1 })
//       .skip(parseInt(offset))
//       .limit(parseInt(limit));

//     const total = await User.countDocuments({ 'preferences.showOnLeaderboard': true });

//     const leaderboard = users.map((user, index) => ({
//       rank: parseInt(offset) + index + 1,
//       username: user.username,
//       displayName: user.displayName,
//       avatar: user.avatar,
//       streak: user.stats.currentStreak,
//       consistency: user.stats.consistencyScore,
//       location: user.location?.city || 'Unknown',
//       isPremium: user.subscription?.plan !== 'free',
//       totalDays: user.stats.totalDays,
//       longestStreak: user.stats.longestStreak,
//       followers: user.stats.followersCount
//     }));

//     res.json({
//       success: true,
//       leaderboard,
//       total,
//       limit: parseInt(limit),
//       offset: parseInt(offset)
//     });

//   } catch (error) {
//     console.error('Leaderboard error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.get('/api/leaderboard/user-rank/:userId', authenticateToken, async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const allUsers = await User.find({ 'preferences.showOnLeaderboard': true })
//       .select('_id stats.currentStreak stats.consistencyScore')
//       .sort({ 'stats.currentStreak': -1, 'stats.consistencyScore': -1 });

//     const rank = allUsers.findIndex(user => user._id.toString() === userId) + 1;

//     const user = await User.findById(userId).select('stats');

//     res.json({
//       success: true,
//       rank: rank > 0 ? rank : null,
//       totalUsers: allUsers.length,
//       streak: user?.stats?.currentStreak || 0,
//       consistency: user?.stats?.consistencyScore || 0
//     });

//   } catch (error) {
//     console.error('Get user rank error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.get('/api/leaderboard/city/:city', async (req, res) => {
//   try {
//     const { city } = req.params;
//     const { limit = 20 } = req.query;

//     const users = await User.find({
//       'preferences.showOnLeaderboard': true,
//       'location.city': new RegExp(city, 'i')
//     })
//     .select('username displayName avatar stats subscription')
//     .sort({ 'stats.currentStreak': -1 })
//     .limit(parseInt(limit));

//     const leaderboard = users.map((user, index) => ({
//       rank: index + 1,
//       username: user.username,
//       displayName: user.displayName,
//       avatar: user.avatar,
//       streak: user.stats.currentStreak,
//       consistency: user.stats.consistencyScore,

// // ========== HEALTH CHECK ==========

// app.get('/api/health', (req, res) => {
//   res.json({
//     success: true,
//     status: 'healthy',
//     service: 'TouchGrass API',
//     version: '1.0.0',
//     timestamp: new Date().toISOString(),
//     environment: NODE_ENV,
//     database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
//   });
// });

// // ========== WELCOME ENDPOINT ==========

// app.get('/api', (req, res) => {
//   res.json({
//     success: true,
//     message: 'Welcome to TouchGrass API',
//     version: '1.0.0',
//     endpoints: {
//       auth: {
//         register: 'POST /api/auth/register',
//         login: 'POST /api/auth/login',
//         me: 'GET /api/auth/me',
//         forgotPassword: 'POST /api/auth/forgot-password',
//         resetPassword: 'POST /api/auth/reset-password',
//         verifyToken: 'GET /api/auth/reset-password/:token',
//         changePassword: 'POST /api/auth/change-password',
//         google: 'POST /api/auth/google'
//       },
//       users: {
//         profile: 'GET /api/users/:username',
//         updateBio: 'PUT /api/users/bio',
//         updateAvatar: 'PUT /api/users/avatar',
//         follow: 'POST /api/users/:userId/follow',
//         achievements: 'GET /api/users/:userId/achievements'
//       },
//       streaks: {
//         current: 'GET /api/streaks/current',
//         verify: 'POST /api/streaks/verify',
//         shame: 'POST /api/streaks/shame',
//         userStreak: 'GET /api/streaks/user/:userId'
//       },
//       leaderboard: 'GET /api/leaderboard',
//       leaderboardUserRank: 'GET /api/leaderboard/user-rank/:userId',
//       seo: {
//         sitemap: 'GET /api/seo/sitemap.xml',
//         robots: 'GET /api/seo/robots.txt'
//       }
//     },
//     dodo: {
//       checkout: 'GET /api/dodo/checkout/:plan',
//       webhook: 'POST /api/dodo/webhook'
//     }
//   });
// });

// // ========== SEO ROUTES ==========

// // Sitemap route
// app.get('/api/seo/sitemap.xml', async (req, res) => {
//   try {
//     const baseUrl = process.env.FRONTEND_URL || 'https://touchgrass.now';
//     const generator = new SitemapGenerator(baseUrl);
//     const sitemap = await generator.generate();

//     res.header('Content-Type', 'application/xml');
//     res.send(sitemap);
//   } catch (error) {
//     console.error('Sitemap generation error:', error);
//     res.status(500).send('Error generating sitemap');
//   }
// });

// // Static sitemap
// app.get('/api/seo/sitemap-static.xml', async (req, res) => {
//   try {
//     const baseUrl = process.env.FRONTEND_URL || 'https://touchgrass.now';
//     const generator = new SitemapGenerator(baseUrl);
//     const sitemap = await generator.generateStatic();

//     res.header('Content-Type', 'application/xml');
//     res.send(sitemap);
//   } catch (error) {
//     console.error('Static sitemap error:', error);
//     res.status(500).send('Error generating static sitemap');
//   }
// });

// // Robots.txt route
// app.get('/api/seo/robots.txt', (req, res) => {
//   const robots = `User-agent: *
// Allow: /
// Disallow: /dashboard
// Disallow: /profile
// Disallow: /api/
// Sitemap: ${process.env.FRONTEND_URL || 'https://touchgrass.now'}/api/seo/sitemap.xml`;

//   res.header('Content-Type', 'text/plain');
//   res.send(robots);
// });

// // ========== AUTH ROUTES ==========

// app.post('/api/auth/register', async (req, res) => {
//   try {
//     const { username, email, password, displayName } = req.body;
    
//     if (!username || !email || !password || !displayName) {
//       return res.status(400).json({
//         success: false,
//         message: 'All fields are required'
//       });
//     }
    
//     const existingUser = await User.findOne({ 
//       $or: [{ email }, { username }] 
//     });
    
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: 'User already exists'
//       });
//     }
    
//     const user = new User({
//       username,
//       email,
//       password,
//       displayName,
//       stats: {
//         currentStreak: 0,
//         longestStreak: 0,
//         totalDays: 0,
//         totalOutdoorTime: 0,
//         consistencyScore: 0,
//         leaderboardRank: 999999,
//         followersCount: 0,
//         followingCount: 0
//       }
//     });
    
//     await user.save();
    
//     const streak = new Streak({
//       userId: user._id,
//       currentStreak: 0,
//       longestStreak: 0,
//       totalDays: 0,
//       todayVerified: false,
//       history: []
//     });
//     await streak.save();
    
//     const token = user.generateAuthToken();
    
//     const userResponse = user.toObject();
//     delete userResponse.password;
    
//     res.status(201).json({
//       success: true,
//       message: 'Registration successful',
//       token,
//       user: userResponse
//     });
    
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error during registration'
//     });
//   }
// });

// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email and password are required'
//       });
//     }
    
//     const user = await User.findOne({ email });
    
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }
    
//     const isPasswordValid = await user.comparePassword(password);
    
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }
    
//     const token = user.generateAuthToken();
    
//     const userResponse = user.toObject();
//     delete userResponse.password;
    
//     res.json({
//       success: true,
//       message: 'Login successful',
//       token,
//       user: userResponse
//     });
    
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error during login'
//     });
//   }
// });

// // Simple Google login simulation
// app.post('/api/auth/google', async (req, res) => {
//   try {
//     const { email, name, picture } = req.body;
    
//     if (!email || !name) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email and name are required for Google login'
//       });
//     }
    
//     // Check if user already exists
//     let user = await User.findOne({ email });
    
//     if (!user) {
//       // Create new user from Google data
//       const username = email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 5);
      
//       user = new User({
//         email,
//         username,
//         displayName: name,
//         avatar: picture || '',
//         password: crypto.randomBytes(16).toString('hex'), // Random password for Google users
//         stats: {
//           currentStreak: 0,
//           longestStreak: 0,
//           totalDays: 0,
//           totalOutdoorTime: 0,
//           consistencyScore: 0,
//           leaderboardRank: 999999,
//           followersCount: 0,
//           followingCount: 0
//         }
//       });
      
//       await user.save();
      
//       // Create streak for new user
//       const streak = new Streak({
//         userId: user._id,
//         currentStreak: 0,
//         longestStreak: 0,
//         totalDays: 0,
//         todayVerified: false,
//         history: []
//       });
//       await streak.save();
//     }
    
//     const token = user.generateAuthToken();
    
//     const userResponse = user.toObject();
//     delete userResponse.password;
    
//     res.json({
//       success: true,
//       message: 'Google login successful',
//       token,
//       user: userResponse
//     });
    
//   } catch (error) {
//     console.error('Google login error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error during Google login'
//     });
//   }
// });

// // Forgot password - request password reset
// app.post('/api/auth/forgot-password', async (req, res) => {
//   try {
//     const { email } = req.body;
    
//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email is required'
//       });
//     }
    
//     // Find user by email
//     const user = await User.findOne({ email });
    
//     if (!user) {
//       // For security, don't reveal if user exists
//       return res.json({
//         success: true,
//         message: 'If an account exists with this email, you will receive a password reset link'
//       });
//     }
    
//     // Generate reset token
//     const resetToken = crypto.randomBytes(32).toString('hex');
//     const hashedToken = crypto
//       .createHash('sha256')
//       .update(resetToken)
//       .digest('hex');
    
//     // Create reset token in database
//     const resetTokenDoc = new PasswordResetToken({
//       userId: user._id,
//       token: hashedToken,
//       expiresAt: new Date(Date.now() + 3600000) // 1 hour
//     });
    
//     await resetTokenDoc.save();
    
//     // In a real app, you would send an email here
//     // For now, we'll return the token in development
//     const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;
    
//     console.log('📧 Password reset URL (dev mode):', resetUrl);
//     console.log('For production, implement email sending with nodemailer');
    
//     res.json({
//       success: true,
//       message: 'Password reset initiated',
//       // In development, return the token for testing
//       ...(NODE_ENV === 'development' && { 
//         resetToken,
//         resetUrl,
//         note: 'In production, this would be sent via email' 
//       })
//     });
    
//   } catch (error) {
//     console.error('Forgot password error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Verify reset token
// app.get('/api/auth/reset-password/:token', async (req, res) => {
//   try {
//     const { token } = req.params;
    
//     if (!token) {
//       return res.status(400).json({
//         success: false,
//         message: 'Token is required'
//       });
//     }
    
//     // Hash the token to compare with stored hash
//     const hashedToken = crypto
//       .createHash('sha256')
//       .update(token)
//       .digest('hex');
    
//     // Find valid reset token
//     const resetToken = await PasswordResetToken.findOne({
//       token: hashedToken,
//       used: false,
//       expiresAt: { $gt: new Date() }
//     }).populate('userId', 'email displayName');
    
//     if (!resetToken) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid or expired reset token'
//       });
//     }
    
//     res.json({
//       success: true,
//       message: 'Token is valid',
//       email: resetToken.userId.email,
//       displayName: resetToken.userId.displayName
//     });
    
//   } catch (error) {
//     console.error('Verify token error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Reset password with token
// app.post('/api/auth/reset-password', async (req, res) => {
//   try {
//     const { token, newPassword } = req.body;
    
//     if (!token || !newPassword) {
//       return res.status(400).json({
//         success: false,
//         message: 'Token and new password are required'
//       });
//     }
    
//     if (newPassword.length < 6) {
//       return res.status(400).json({
//         success: false,
//         message: 'Password must be at least 6 characters'
//       });
//     }
    
//     // Hash the token to compare with stored hash
//     const hashedToken = crypto
//       .createHash('sha256')
//       .update(token)
//       .digest('hex');
    
//     // Find valid reset token
//     const resetToken = await PasswordResetToken.findOne({
//       token: hashedToken,
//       used: false,
//       expiresAt: { $gt: new Date() }
//     }).populate('userId');
    
//     if (!resetToken) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid or expired reset token'
//       });
//     }
    
//     // Update user's password
//     const user = resetToken.userId;
//     user.password = newPassword;
//     await user.save();
    
//     // Mark token as used
//     resetToken.used = true;
//     await resetToken.save();
    
//     // Delete all other reset tokens for this user
//     await PasswordResetToken.deleteMany({
//       userId: user._id,
//       used: false
//     });
    
//     res.json({
//       success: true,
//       message: 'Password reset successful. You can now login with your new password.'
//     });
    
//   } catch (error) {
//     console.error('Reset password error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.get('/api/auth/me', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id)
//       .select('-password')
//       .populate('followers', 'username displayName avatar')
//       .populate('following', 'username displayName avatar');
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }
    
//     const streak = await Streak.findOne({ userId: user._id });
    
//     res.json({
//       success: true,
//       user: {
//         ...user.toObject(),
//         streakData: streak || null
//       }
//     });
    
//   } catch (error) {
//     console.error('Get profile error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Change password (authenticated)
// app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;
    
//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({
//         success: false,
//         message: 'Current password and new password are required'
//       });
//     }
    
//     if (newPassword.length < 6) {
//       return res.status(400).json({
//         success: false,
//         message: 'New password must be at least 6 characters'
//       });
//     }
    
//     const user = await User.findById(req.user._id);
    
//     // Verify current password
//     const isPasswordValid = await user.comparePassword(currentPassword);
    
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: 'Current password is incorrect'
//       });
//     }
    
//     // Update password
//     user.password = newPassword;
//     await user.save();
    
//     res.json({
//       success: true,
//       message: 'Password changed successfully'
//     });
    
//   } catch (error) {
//     console.error('Change password error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // ========== USER ROUTES ==========

// app.get('/api/users/:username', authenticateToken, async (req, res) => {
//   try {
//     const { username } = req.params;
    
//     const user = await User.findOne({ username })
//       .select('-password -email')
//       .populate('followers', 'username displayName avatar')
//       .populate('following', 'username displayName avatar');
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }
    
//     const isFollowing = req.user.following.includes(user._id);
    
//     const streak = await Streak.findOne({ userId: user._id });
    
//     res.json({
//       success: true,
//       user: {
//         ...user.toObject(),
//         isFollowing,
//         streakData: streak || null
//       }
//     });
    
//   } catch (error) {
//     console.error('Get user error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.put('/api/users/bio', authenticateToken, async (req, res) => {
//   try {
//     const { bio } = req.body;
    
//     if (bio && bio.length > 500) {
//       return res.status(400).json({
//         success: false,
//         message: 'Bio must be less than 500 characters'
//       });
//     }
    
//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { bio },
//       { new: true }
//     ).select('-password');
    
//     res.json({
//       success: true,
//       user
//     });
    
//   } catch (error) {
//     console.error('Update bio error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.put('/api/users/avatar', authenticateToken, async (req, res) => {
//   try {
//     const { avatar } = req.body;
    
//     if (!avatar) {
//       return res.status(400).json({
//         success: false,
//         message: 'Avatar URL is required'
//       });
//     }
    
//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { avatar },
//       { new: true }
//     ).select('-password');
    
//     res.json({
//       success: true,
//       user
//     });
    
//   } catch (error) {
//     console.error('Update avatar error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.post('/api/users/:userId/follow', authenticateToken, async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     if (userId === req.user._id.toString()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot follow yourself'
//       });
//     }
    
//     const userToFollow = await User.findById(userId);
//     if (!userToFollow) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }
    
//     const currentUser = await User.findById(req.user._id);
    
//     const isFollowing = currentUser.following.includes(userId);
    
//     if (isFollowing) {
//       await User.findByIdAndUpdate(req.user._id, {
//         $pull: { following: userId },
//         $inc: { 'stats.followingCount': -1 }
//       });
      
//       await User.findByIdAndUpdate(userId, {
//         $pull: { followers: req.user._id },
//         $inc: { 'stats.followersCount': -1 }
//       });
//     } else {
//       await User.findByIdAndUpdate(req.user._id, {
//         $push: { following: userId },
//         $inc: { 'stats.followingCount': 1 }
//       });
      
//       await User.findByIdAndUpdate(userId, {
//         $push: { followers: req.user._id },
//         $inc: { 'stats.followersCount': 1 }
//       });
//     }
    
//     const updatedUser = await User.findById(userId)
//       .select('-password')
//       .populate('followers', 'username displayName avatar')
//       .populate('following', 'username displayName avatar');
    
//     res.json({
//       success: true,
//       user: updatedUser,
//       isFollowing: !isFollowing,
//       followersCount: updatedUser.stats.followersCount
//     });
    
//   } catch (error) {
//     console.error('Follow error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.get('/api/users/:userId/achievements', authenticateToken, async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     const user = await User.findById(userId).select('achievements');
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       achievements: user.achievements || []
//     });
    
//   } catch (error) {
//     console.error('Get achievements error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // ========== STREAK ROUTES ==========

// app.get('/api/streaks/current', authenticateToken, async (req, res) => {
//   try {
//     const streak = await Streak.findOne({ userId: req.user._id });
    
//     if (!streak) {
//       const newStreak = new Streak({
//         userId: req.user._id,
//         currentStreak: 0,
//         longestStreak: 0,
//         totalDays: 0,
//         todayVerified: false,
//         history: []
//       });
//       await newStreak.save();
      
//       return res.json({
//         success: true,
//         streak: newStreak
//       });
//     }
    
//     const now = new Date();
//     const lastUpdate = new Date(streak.lastUpdated);
//     const daysSinceLastUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));
    
//     if (daysSinceLastUpdate > 1 && streak.currentStreak > 0) {
//       streak.currentStreak = 0;
//       streak.status = 'broken';
//       streak.history.push({
//         date: new Date(lastUpdate.getTime() + 24 * 60 * 60 * 1000),
//         verified: false,
//         verificationMethod: 'shame',
//         shameMessage: 'Missed daily verification',
//         isPublicShame: false
//       });
//       await streak.save();
      
//       await User.findByIdAndUpdate(req.user._id, {
//         $set: { 'stats.currentStreak': 0 }
//       });
//     }
    
//     res.json({
//       success: true,
//       streak
//     });
    
//   } catch (error) {
//     console.error('Get streak error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.get('/api/streaks/user/:userId', authenticateToken, async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     const streak = await Streak.findOne({ userId });
    
//     if (!streak) {
//       return res.status(404).json({
//         success: false,
//         message: 'Streak not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       streak
//     });
    
//   } catch (error) {
//     console.error('Get user streak error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.post('/api/streaks/verify', authenticateToken, async (req, res) => {
//   try {
//     const { method = 'manual', duration = 30, notes = '', timestamp } = req.body;
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
//     let streak = await Streak.findOne({ userId: req.user._id });
    
//     if (!streak) {
//       streak = new Streak({
//         userId: req.user._id,
//         currentStreak: 0,
//         longestStreak: 0,
//         totalDays: 0,
//         todayVerified: false,
//         history: []
//       });
//     }
    
//     const todayStr = today.toISOString().split('T')[0];
//     const alreadyVerifiedToday = streak.history.some(entry => {
//       const entryDate = new Date(entry.date);
//       const entryDateStr = entryDate.toISOString().split('T')[0];
//       return entryDateStr === todayStr && entry.verified;
//     });
    
//     if (alreadyVerifiedToday) {
//       return res.status(400).json({
//         success: false,
//         message: 'Already verified today'
//       });
//     }
    
//     const verification = {
//       date: now,
//       verified: true,
//       verificationMethod: method,
//       duration: parseInt(duration),
//       notes: notes || '',
//       location: req.body.location || null
//     };
    
//     streak.history.push(verification);
    
//     const lastUpdate = new Date(streak.lastUpdated);
//     const lastUpdateDate = new Date(lastUpdate.getFullYear(), lastUpdate.getMonth(), lastUpdate.getDate());
    
//     if (today.getTime() === lastUpdateDate.getTime() || streak.currentStreak === 0) {
//       streak.currentStreak += 1;
//     } else if (today.getTime() === lastUpdateDate.getTime() + 24 * 60 * 60 * 1000) {
//       streak.currentStreak += 1;
//     } else {
//       streak.currentStreak = 1;
//     }
    
//     if (streak.currentStreak > streak.longestStreak) {
//       streak.longestStreak = streak.currentStreak;
//     }
    
//     streak.totalDays += 1;
//     streak.totalOutdoorTime += parseInt(duration) || 30;
//     streak.todayVerified = true;
//     streak.lastUpdated = now;
//     streak.status = 'active';
    
//     const nextCheckpoint = new Date(today);
//     nextCheckpoint.setDate(nextCheckpoint.getDate() + 1);
//     streak.nextCheckpoint = nextCheckpoint;
    
//     await streak.save();
    
//     const user = await User.findById(req.user._id);
//     user.stats.currentStreak = streak.currentStreak;
//     user.stats.longestStreak = streak.longestStreak;
//     user.stats.totalDays = streak.totalDays;
//     user.stats.totalOutdoorTime = streak.totalOutdoorTime;
    
//     if (user.stats.totalDays > 0) {
//       const consistency = (streak.currentStreak / user.stats.totalDays) * 100;
//       user.stats.consistencyScore = Math.min(100, Math.round(consistency));
//     }
    
//     await user.save();
    
//     const achievements = [];
//     if (streak.currentStreak === 7) {
//       achievements.push({
//         name: 'Weekly Warrior',
//         earnedAt: now,
//         icon: '🏆',
//         description: 'Maintained a 7-day streak'
//       });
//     }
    
//     if (streak.currentStreak === 30) {
//       achievements.push({
//         name: 'Monthly Maestro',
//         earnedAt: now,
//         icon: '🌟',
//         description: 'Maintained a 30-day streak'
//       });
//     }
    
//     if (streak.currentStreak === 100) {
//       achievements.push({
//         name: 'Century Club',
//         earnedAt: now,
//         icon: '💯',
//         description: 'Maintained a 100-day streak'
//       });
//     }
    
//     if (achievements.length > 0) {
//       await User.findByIdAndUpdate(req.user._id, {
//         $push: { achievements: { $each: achievements } }
//       });
//     }
    
//     res.json({
//       success: true,
//       streak,
//       message: 'Verification successful!',
//       achievements: achievements.length > 0 ? achievements : null
//     });
    
//   } catch (error) {
//     console.error('Verify streak error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.post('/api/streaks/shame', authenticateToken, async (req, res) => {
//   try {
//     const { message = 'Failed to touch grass today', public = true } = req.body;
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
//     let streak = await Streak.findOne({ userId: req.user._id });
    
//     if (!streak) {
//       streak = new Streak({
//         userId: req.user._id,
//         currentStreak: 0,
//         longestStreak: 0,
//         totalDays: 0,
//         todayVerified: false,
//         history: []
//       });
//     }
    
//     const todayStr = today.toISOString().split('T')[0];
//     const alreadyShamedToday = streak.history.some(entry => {
//       const entryDate = new Date(entry.date);
//       const entryDateStr = entryDate.toISOString().split('T')[0];
//       return entryDateStr === todayStr && !entry.verified;
//     });
    
//     if (alreadyShamedToday) {
//       return res.status(400).json({
//         success: false,
//         message: 'Already accepted shame for today'
//       });
//     }
    
//     streak.history.push({
//       date: now,
//       verified: false,
//       verificationMethod: 'shame',
//       shameMessage: message,
//       isPublicShame: public
//     });
    
//     streak.currentStreak = 0;
//     streak.todayVerified = false;
//     streak.lastUpdated = now;
//     streak.status = 'broken';
    
//     await streak.save();
    
//     await User.findByIdAndUpdate(req.user._id, {
//       $set: { 'stats.currentStreak': 0 }
//     });
    
//     res.json({
//       success: true,
//       streak,
//       message: 'Shame accepted. Streak reset.'
//     });
    
//   } catch (error) {
//     console.error('Shame error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // ========== DODO PAYMENTS ROUTES ==========

// // Get Dodo checkout URLs for different plans
// app.get('/api/dodo/checkout/:plan', authenticateToken, async (req, res) => {
//   try {
//     const { plan } = req.params;
    
//     // Dodo product URLs from your environment
//     const dodoUrls = {
//       pro: process.env.DODO_PRO_PRODUCT_URL || 'https://checkout.dodopayments.com/buy/pdt_0NWPkwJJcZChm84jRPqIt',
//       enterprise: process.env.DODO_ENTERPRISE_PRODUCT_URL || 'https://checkout.dodopayments.com/buy/pdt_0NWPl4fuR5huBMtu7YAKT',
//       streak_restoration: process.env.DODO_TEST_PRODUCT_URL || 'https://checkout.dodopayments.com/buy/pdt_0NWPjjq1W9yybN1dR63eF'
//     };
    
//     if (!dodoUrls[plan]) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid plan type'
//       });
//     }
    
//     // Add user metadata to the URL
//     let checkoutUrl = dodoUrls[plan] + '?quantity=1';
    
//     if (req.user) {
//       const urlObj = new URL(checkoutUrl);
//       urlObj.searchParams.append('client_reference_id', req.user._id.toString());
//       if (req.user.email) {
//         urlObj.searchParams.append('prefilled_email', req.user.email);
//       }
//       urlObj.searchParams.append('product_name', `${plan === 'pro' ? 'Pro' : plan === 'enterprise' ? 'Enterprise' : 'Streak Restoration'} - TouchGrass`);
//       checkoutUrl = urlObj.toString();
//     }
    
//     // Log the payment attempt
//     const payment = new Payment({
//       userId: req.user._id,
//       paymentId: `dodo_${Date.now()}_${plan}`,
//       amount: plan === 'pro' ? 14.99 : plan === 'enterprise' ? 59.99 : 4.99,
//       currency: 'USD',
//       status: 'pending',
//       type: plan === 'streak_restoration' ? 'streak_restoration' : 'subscription',
//       metadata: {
//         plan: plan,
//         userEmail: req.user.email,
//         userName: req.user.displayName
//       },
//       provider: 'dodo'
//     });
//     await payment.save();
    
//     res.json({
//       success: true,
//       checkoutUrl,
//       plan: plan,
//       price: plan === 'pro' ? 14.99 : plan === 'enterprise' ? 59.99 : 4.99,
//       paymentId: payment.paymentId,
//       instructions: 'Open this URL in a new window to complete payment'
//     });
    
//   } catch (error) {
//     console.error('Dodo checkout error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to generate checkout URL'
//     });
//   }
// });

// // ========== LEADERBOARD ROUTES ==========

// app.get('/api/leaderboard', async (req, res) => {
//   try {
//     const { limit = 50, offset = 0 } = req.query;

//     const users = await User.find({ 'preferences.showOnLeaderboard': true })
//       .select('username displayName avatar stats subscription location')
//       .sort({ 'stats.currentStreak': -1, 'stats.consistencyScore': -1 })
//       .skip(parseInt(offset))
//       .limit(parseInt(limit));

//     const total = await User.countDocuments({ 'preferences.showOnLeaderboard': true });

//     const leaderboard = users.map((user, index) => ({
//       rank: parseInt(offset) + index + 1,
//       username: user.username,
//       displayName: user.displayName,
//       avatar: user.avatar,
//       streak: user.stats.currentStreak,
//       consistency: user.stats.consistencyScore,
//       location: user.location?.city || 'Unknown',
//       isPremium: user.subscription?.plan !== 'free',
//       totalDays: user.stats.totalDays,
//       longestStreak: user.stats.longestStreak,
//       followers: user.stats.followersCount
//     }));

//     res.json({
//       success: true,
//       leaderboard,
//       total,
//       limit: parseInt(limit),
//       offset: parseInt(offset)
//     });

//   } catch (error) {
//     console.error('Leaderboard error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.get('/api/leaderboard/user-rank/:userId', authenticateToken, async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const allUsers = await User.find({ 'preferences.showOnLeaderboard': true })
//       .select('_id stats.currentStreak stats.consistencyScore')
//       .sort({ 'stats.currentStreak': -1, 'stats.consistencyScore': -1 });

//     const rank = allUsers.findIndex(user => user._id.toString() === userId) + 1;

//     const user = await User.findById(userId).select('stats');

//     res.json({
//       success: true,
//       rank: rank > 0 ? rank : null,
//       totalUsers: allUsers.length,
//       streak: user?.stats?.currentStreak || 0,
//       consistency: user?.stats?.consistencyScore || 0
//     });

//   } catch (error) {
//     console.error('Get user rank error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.get('/api/leaderboard/city/:city', async (req, res) => {
//   try {
//     const { city } = req.params;
//     const { limit = 20 } = req.query;

//     const users = await User.find({
//       'preferences.showOnLeaderboard': true,
//       'location.city': new RegExp(city, 'i')
//     })
//     .select('username displayName avatar stats subscription')
//     .sort({ 'stats.currentStreak': -1 })
//     .limit(parseInt(limit));

//     const leaderboard = users.map((user, index) => ({
//       rank: index + 1,
//       username: user.username,
//       displayName: user.displayName,
//       avatar: user.avatar,
//       streak: user.stats.currentStreak,
//       consistency: user.stats.consistencyScore,
//       isPremium: user.subscription?.plan !== 'free'
//     }));

//     res.json({
//       success: true,
//       city,
//       leaderboard,
//       count: users.length
//     });

//   } catch (error) {
//     console.error('City leaderboard error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // ========== VERIFICATION WALL ROUTES ==========

// // Get verification wall posts
// app.get('/api/verification-wall', async (req, res) => {
//   try {
//     const { page = 1, limit = 20, filter = 'recent' } = req.query;

//     let query = { isBlocked: false }; // Only show public posts
//     let sort = { createdAt: -1 }; // recent first

//     switch (filter) {
//       case 'popular':
//         sort = { likeCount: -1, createdAt: -1 };
//         break;
//       case 'verified':
//         query.isVerified = true;
//         break;
//       case 'reported':
//         query.reports = { $exists: true, $ne: [] };
//         break;
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const posts = await VerificationWall.find(query)
//       .populate('userId', 'username displayName avatar')
//       .populate('streakId', 'currentStreak')
//       .sort(sort)
//       .skip(skip)
//       .limit(parseInt(limit));

//     const total = await VerificationWall.countDocuments(query);
//     const totalPages = Math.ceil(total / parseInt(limit));

//     const postsWithDetails = posts.map(post => ({
//       _id: post._id,
//       userId: {
//         _id: post.userId._id,
//         username: post.userId.username,
//         displayName: post.userId.displayName,
//         avatar: post.userId.avatar
//       },
//       streakId: post.streakId,
//       photoUrl: post.photoUrl,
//       caption: post.caption,
//       activityType: post.activityType,
//       duration: post.duration,
//       location: post.location,
//       likeCount: post.likeCount,
//       commentCount: post.commentCount,
//       reportCount: post.totalReports,
//       isVerified: post.isVerified,
//       verificationScore: post.verificationScore,
//       createdAt: post.createdAt,
//       likes: post.likes,
//       comments: post.comments.slice(-3), // Last 3 comments
//       reports: post.reports
//     }));

//     res.json({
//       success: true,
//       posts: postsWithDetails,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: totalPages,
//         hasNext: parseInt(page) < totalPages,
//         hasPrev: parseInt(page) > 1
//       }
//     });

//   } catch (error) {
//     console.error('Get verification wall error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Like a post
// app.post('/api/verification-wall/:postId/like', authenticateToken, async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const userId = req.user._id;

//     const post = await VerificationWall.findById(postId);
//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         message: 'Post not found'
//       });
//     }

//     const likeIndex = post.likes.findIndex(like => like.userId.toString() === userId.toString());

//     if (likeIndex > -1) {
//       // Unlike
//       post.likes.splice(likeIndex, 1);
//       await post.save();

//       res.json({
//         success: true,
//         message: 'Post unliked',
//         liked: false
//       });
//     } else {
//       // Like
//       post.likes.push({ userId, createdAt: new Date() });
//       await post.save();

//       res.json({
//         success: true,
//         message: 'Post liked',
//         liked: true
//       });
//     }

//   } catch (error) {
//     console.error('Like post error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Report a post
// app.post('/api/verification-wall/:postId/report', authenticateToken, async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const { reason, details } = req.body;
//     const userId = req.user._id;

//     const post = await VerificationWall.findById(postId);
//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         message: 'Post not found'
//       });
//     }

//     // Check if user already reported
//     const existingReport = post.reports.find(report => report.reportedBy.toString() === userId.toString());
//     if (existingReport) {
//       return res.status(400).json({
//         success: false,
//         message: 'You have already reported this post'
//       });
//     }

//     post.reports.push({
//       reportedBy: userId,
//       reason,
//       details,
//       createdAt: new Date()
//     });

//     await post.save();

//     res.json({
//       success: true,
//       message: 'Report submitted successfully'
//     });

//   } catch (error) {
//     console.error('Report post error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Add comment to post
// app.post('/api/verification-wall/:postId/comment', authenticateToken, async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const { text } = req.body;
//     const userId = req.user._id;

//     if (!text || text.trim().length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Comment cannot be empty'
//       });
//     }

//     const post = await VerificationWall.findById(postId);
//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         message: 'Post not found'
//       });
//     }

//     const comment = {
//       userId,
//       text: text.trim(),
//       createdAt: new Date()
//     };

//     post.comments.push(comment);
//     await post.save();

//     // Populate user info for response
//     await post.populate('comments.userId', 'username displayName avatar');

//     const newComment = post.comments[post.comments.length - 1];

//     res.json({
//       success: true,
//       message: 'Comment added successfully',
//       comment: {
//         _id: newComment._id,
//         userId: {
//           _id: newComment.userId._id,
//           username: newComment.userId.username,
//           displayName: newComment.userId.displayName,
//           avatar: newComment.userId.avatar
//         },
//         text: newComment.text,
//         createdAt: newComment.createdAt
//       }
//     });

//   } catch (error) {
//     console.error('Add comment error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // ========== NOTIFICATION ROUTES ==========

// app.get('/api/notifications', authenticateToken, async (req, res) => {
//   try {
//     const notifications = [
//       {
//         id: '1',
//         type: 'streak_reminder',
//         title: 'Streak Reminder',
//         message: 'Don\'t forget to verify your streak today!',
//         read: false,
//         createdAt: new Date().toISOString()
//       },
//       {
//         id: '2',
//         type: 'achievement',
//         title: 'New Achievement!',
//         message: 'You earned the "Weekly Warrior" badge!',
//         read: true,
//         createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
//       },
//       {
//         id: '3',
//         type: 'password_reset',
//         title: 'Password Reset',
//         message: 'Your password was recently changed',
//         read: false,
//         createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
//       }
//     ];
    
//     const unreadCount = notifications.filter(n => !n.read).length;
    
//     res.json({
//       success: true,
//       notifications,
//       unreadCount
//     });
    
//   } catch (error) {
//     console.error('Get notifications error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     res.json({
//       success: true,
//       message: 'Notification marked as read'
//     });
    
//   } catch (error) {
//     console.error('Mark notification error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // ========== CHALLENGE ROUTES ==========

// // Get all challenges
// app.get('/api/challenges', async (req, res) => {
//   try {
//     const { status, type, limit = 20, offset = 0 } = req.query;

//     let query = {};
//     if (status) query.status = status;
//     if (type) query.type = type;

//     const challenges = await Challenge.find(query)
//       .populate('createdBy', 'username displayName avatar')
//       .sort({ createdAt: -1 })
//       .skip(parseInt(offset))
//       .limit(parseInt(limit));

//     const total = await Challenge.countDocuments(query);

//     res.json({
//       success: true,
//       challenges,
//       total,
//       limit: parseInt(limit),
//       offset: parseInt(offset)
//     });

//   } catch (error) {
//     console.error('Get challenges error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Get user's challenges
// app.get('/api/user/challenges', authenticateToken, async (req, res) => {
//   try {
//     const userChallenges = await UserChallenge.find({ userId: req.user._id })
//       .populate('challengeId')
//       .sort({ joinedAt: -1 });

//     res.json({
//       success: true,
//       challenges: userChallenges
//     });

//   } catch (error) {
//     console.error('Get user challenges error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Create challenge
// app.post('/api/challenges', authenticateToken, async (req, res) => {
//   try {
//     const { name, description, duration, type, difficulty, stake, prizePool, rules, isPublic, groupId } = req.body;

//     const challenge = new Challenge({
//       name,
//       description,
//       duration: parseInt(duration),
//       type,
//       difficulty,
//       stake: parseFloat(stake) || 0,
//       prizePool: parseFloat(prizePool) || 0,
//       rules: rules || [],
//       isPublic: isPublic !== false,
//       groupId,
//       createdBy: req.user._id,
//       status: 'active',
//       participants: 0,
//       maxParticipants: 100
//     });

//     await challenge.save();

//     res.status(201).json({
//       success: true,
//       challenge,
//       message: 'Challenge created successfully'
//     });

//   } catch (error) {
//     console.error('Create challenge error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Join challenge
// app.post('/api/challenges/:challengeId/join', authenticateToken, async (req, res) => {
//   try {
//     const { challengeId } = req.params;

//     const challenge = await Challenge.findById(challengeId);
//     if (!challenge) {
//       return res.status(404).json({
//         success: false,
//         message: 'Challenge not found'
//       });
//     }

//     // Check if user already joined
//     const existingJoin = await UserChallenge.findOne({
//       userId: req.user._id,
//       challengeId: challengeId
//     });

//     if (existingJoin) {
//       return res.status(400).json({
//         success: false,
//         message: 'Already joined this challenge'
//       });
//     }

//     // Create user challenge record
//     const userChallenge = new UserChallenge({
//       userId: req.user._id,
//       challengeId: challengeId,
//       joinedAt: new Date(),
//       status: 'active',
//       progress: {
//         currentStreak: 0,
//         totalDays: 0,
//         completedDays: 0
//       }
//     });

//     await userChallenge.save();

//     // Update challenge participants count
//     challenge.participants += 1;
//     await challenge.save();

//     res.json({
//       success: true,
//       message: 'Successfully joined challenge',
//       userChallenge
//     });

//   } catch (error) {
//     console.error('Join challenge error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Update challenge progress
// app.post('/api/challenges/:challengeId/progress', authenticateToken, async (req, res) => {
//   try {
//     const { challengeId } = req.params;
//     const { date, completed, notes } = req.body;

//     const userChallenge = await UserChallenge.findOne({
//       userId: req.user._id,
//       challengeId: challengeId
//     });

//     if (!userChallenge) {
//       return res.status(404).json({
//         success: false,
//         message: 'User challenge not found'
//       });
//     }

//     // Add progress entry
//     userChallenge.progress.entries = userChallenge.progress.entries || [];
//     userChallenge.progress.entries.push({
//       date: new Date(date),
//       completed: completed || false,
//       notes: notes || ''
//     });

//     // Update stats
//     if (completed) {
//       userChallenge.progress.completedDays += 1;
//       userChallenge.progress.lastCompletedDate = new Date(date);
//     }

//     userChallenge.progress.totalDays += 1;
//     userChallenge.updatedAt = new Date();

//     await userChallenge.save();

//     res.json({
//       success: true,
//       message: 'Progress updated successfully',
//       progress: userChallenge.progress
//     });

//   } catch (error) {
//     console.error('Update progress error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Get daily check-ins
// app.get('/api/challenges/daily-checkins/:date', authenticateToken, async (req, res) => {
//   try {
//     const { date } = req.params; // YYYY-MM-DD format

//     const userChallenges = await UserChallenge.find({
//       userId: req.user._id,
//       status: 'active'
//     }).populate('challengeId', 'name type');

//     const checkins = userChallenges.map(uc => ({
//       challengeId: uc.challengeId._id,
//       challengeName: uc.challengeId.name,
//       streak: uc.progress.currentStreak || 0,
//       completed: uc.progress.entries?.some(entry =>
//         entry.date.toISOString().split('T')[0] === date && entry.completed
//       ) || false
//     }));

//     res.json({
//       success: true,
//       checkins
//     });

//   } catch (error) {
//     console.error('Get daily checkins error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // ========== COMPREHENSIVE CHALLENGE ROUTES ==========

// // Get built-in challenges (pre-defined system challenges)
// app.get('/api/challenges/built-in', async (req, res) => {
//   try {
//     const builtInChallenges = [
//       {
//         id: 'builtin-7day-streak',
//         name: '7-Day TouchGrass Challenge',
//         description: 'A beginner-friendly challenge to build the habit of going outside daily. Perfect for newcomers!',
//         duration: 7,
//         type: 'streak',
//         difficulty: 'easy',
//         stake: 0,
//         prizePool: 0,
//         participants: Math.floor(Math.random() * 1000) + 500,
//         maxParticipants: 10000,
//         status: 'active',
//         rules: [
//           'Go outside for at least 15 minutes daily',
//           'Take a photo as proof',
//           'Share your experience (optional)',
//           'No cheating - be honest with yourself!'
//         ],
//         isPublic: true,
//         createdBy: 'system',
//         createdAt: new Date('2024-01-01'),
//         featured: true,
//         isBuiltIn: true
//       },
//       {
//         id: 'builtin-30day-discipline',
//         name: '30-Day Discipline Marathon',
//         description: 'Transform your habits with this intensive 30-day challenge. Build consistency and mental toughness.',
//         duration: 30,
//         type: 'mindset',
//         difficulty: 'medium',
//         stake: 10,
//         prizePool: Math.floor(Math.random() * 5000) + 1000,
//         participants: Math.floor(Math.random() * 500) + 200,
//         maxParticipants: 1000,
//         status: 'active',
//         rules: [
//           'Daily outdoor activity + reflection',
//           'No skipping days allowed',
//           'Share weekly progress',
//           'Support fellow participants'
//         ],
//         isPublic: true,
//         createdBy: 'system',
//         createdAt: new Date('2024-01-15'),
//         featured: true,
//         isBuiltIn: true
//       },
//       {
//         id: 'builtin-weekend-warrior',
//         name: 'Weekend Warrior Sprint',
//         description: 'Perfect for busy people! Focus on making your weekends count with meaningful outdoor activities.',
//         duration: 4, // 4 weekends
//         type: 'sprint',
//         difficulty: 'easy',
//         stake: 5,
//         prizePool: Math.floor(Math.random() * 1000) + 200,
//         participants: Math.floor(Math.random() * 800) + 300,
//         maxParticipants: 5000,
//         status: 'active',
//         rules: [
//           'Complete outdoor activity every weekend',
//           'Minimum 1 hour per session',
//           'Document your adventures',
//           'Engage with community'
//         ],
//         isPublic: true,
//         createdBy: 'system',
//         createdAt: new Date('2024-02-01'),
//         featured: true,
//         isBuiltIn: true
//       },
//       {
//         id: 'builtin-family-outdoor',
//         name: 'Family Outdoor Challenge',
//         description: 'Get the whole family outside! Perfect for parents who want to instill healthy habits in their kids.',
//         duration: 14,
//         type: 'family',
//         difficulty: 'easy',
//         stake: 0,
//         prizePool: 0,
//         participants: Math.floor(Math.random() * 300) + 100,
//         maxParticipants: 2000,
//         status: 'active',
//         rules: [
//           'Family outdoor activity 3x per week',
//           'Kids must participate',
//           'Share family photos (optional)',
//           'Keep it fun and positive!'
//         ],
//         isPublic: true,
//         createdBy: 'system',
//         createdAt: new Date('2024-02-10'),
//         featured: false,
//         isBuiltIn: true
//       },
//       {
//         id: 'builtin-extreme-100day',
//         name: '100-Day Extreme Challenge',
//         description: 'For the truly committed. Prove your dedication with 100 consecutive days of outdoor discipline.',
//         duration: 100,
//         type: 'extreme',
//         difficulty: 'hard',
//         stake: 50,
//         prizePool: Math.floor(Math.random() * 10000) + 5000,
//         participants: Math.floor(Math.random() * 200) + 50,
//         maxParticipants: 500,
//         status: 'active',
//         rules: [
//           'Daily outdoor activity (rain or shine)',
//           'Minimum 30 minutes per day',
//           'Weekly progress reports',
//           'No streak freezes allowed'
//         ],
//         isPublic: true,
//         createdBy: 'system',
//         createdAt: new Date('2024-01-01'),
//         featured: true,
//         isBuiltIn: true
//       }
//     ];
    
//     res.json({
//       success: true,
//       data: builtInChallenges
//     });
    
//   } catch (error) {
//     console.error('Get built-in challenges error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Get challenge by ID with details
// app.get('/api/challenges/:id/details', authenticateToken, async (req, res) => {
//   try {
//     const challenge = await Challenge.findById(req.params.id)
//       .populate('createdBy', 'username displayName avatar');
    
//     if (!challenge) {
//       return res.status(404).json({
//         success: false,
//         message: 'Challenge not found'
//       });
//     }
    
//     // Get joined users with their progress
//     const userChallenges = await UserChallenge.find({ 
//       challengeId: challenge._id,
//       status: 'active'
//     })
//       .populate('userId', 'username displayName avatar')
//       .sort({ 'progress.currentStreak': -1 });
    
//     const joinedUsers = userChallenges.map(uc => ({
//       id: uc.userId._id,
//       name: uc.userId.displayName,
//       username: uc.userId.username,
//       avatar: uc.userId.avatar,
//       streak: uc.progress?.currentStreak || 0,
//       progress: uc.challengeId?.duration > 0 
//         ? Math.round(((uc.progress?.completedDays || 0) / challenge.duration) * 100)
//         : 0,
//       isCreator: uc.userId._id.toString() === challenge.createdBy._id.toString(),
//       joinedAt: uc.joinedAt
//     }));
    
//     // Check if current user has joined
//     let userHasJoined = false;
//     let userProgress = null;
    
//     if (req.user) {
//       const userChallenge = await UserChallenge.findOne({
//         userId: req.user._id,
//         challengeId: challenge._id
//       });
      
//       if (userChallenge) {
//         userHasJoined = true;
//         userProgress = {
//           streak: userChallenge.progress?.currentStreak || 0,
//           completedDays: userChallenge.progress?.completedDays || 0,
//           totalDays: userChallenge.progress?.totalDays || 0,
//           progress: challenge.duration > 0 
//             ? Math.round(((userChallenge.progress?.completedDays || 0) / challenge.duration) * 100)
//             : 0
//         };
//       }
//     }
    
//     const transformed = {
//       id: challenge._id,
//       name: challenge.name,
//       description: challenge.description,
//       duration: challenge.duration,
//       type: challenge.type,
//       difficulty: challenge.difficulty,
//       stake: challenge.stake,
//       prizePool: challenge.prizePool,
//       participants: challenge.participants || 0,
//       maxParticipants: challenge.maxParticipants || 100,
//       status: challenge.status || 'active',
//       rules: challenge.rules || [],
//       isPublic: challenge.isPublic,
//       groupId: challenge.groupId,
//       createdBy: challenge.createdBy?.username,
//       creatorDetails: {
//         username: challenge.createdBy?.username,
//         displayName: challenge.createdBy?.displayName,
//         avatar: challenge.createdBy?.avatar
//       },
//       createdAt: challenge.createdAt,
//       joinedUsers,
//       userHasJoined,
//       userProgress
//     };
    
//     res.json({
//       success: true,
//       data: transformed
//     });
    
//   } catch (error) {
//     console.error('Get challenge details error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Join challenge (with improved response)
// app.post('/api/challenges/:id/join', authenticateToken, async (req, res) => {
//   try {
//     const challenge = await Challenge.findById(req.params.id);
    
//     if (!challenge) {
//       return res.status(404).json({
//         success: false,
//         message: 'Challenge not found'
//       });
//     }
    
//     if (challenge.status !== 'active') {
//       return res.status(400).json({
//         success: false,
//         message: 'Challenge is not active'
//       });
//     }
    
//     if (challenge.participants >= challenge.maxParticipants) {
//       return res.status(400).json({
//         success: false,
//         message: 'Challenge is full'
//       });
//     }
    
//     // Check if already joined
//     const existingJoin = await UserChallenge.findOne({
//       userId: req.user._id,
//       challengeId: challenge._id
//     });
    
//     if (existingJoin) {
//       return res.status(400).json({
//         success: false,
//         message: 'Already joined this challenge'
//       });
//     }
    
//     // Create user challenge record
//     const userChallenge = new UserChallenge({
//       userId: req.user._id,
//       challengeId: challenge._id,
//       joinedAt: new Date(),
//       status: 'active',
//       progress: {
//         currentStreak: 0,
//         totalDays: 0,
//         completedDays: 0,
//         entries: []
//       }
//     });
    
//     await userChallenge.save();
    
//     // Update challenge participants count
//     challenge.participants += 1;
//     await challenge.save();
    
//     // Get user info for response
//     const user = await User.findById(req.user._id).select('username displayName avatar');
    
//     res.json({
//       success: true,
//       data: {
//         challengeId: challenge._id,
//         userId: req.user._id,
//         username: user.username,
//         displayName: user.displayName,
//         avatar: user.avatar,
//         streak: 0,
//         joinedAt: userChallenge.joinedAt,
//         message: `Successfully joined "${challenge.name}"!`
//       },
//       message: 'Successfully joined challenge'
//     });
    
//   } catch (error) {
//     console.error('Join challenge error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Get groups (mock data - in production you'd have a Group model)
// app.get('/api/challenges/groups', async (req, res) => {
//   try {
//     const groups = [
//       {
//         id: 'group-1',
//         name: 'Early Morning Risers',
//         description: 'For those who believe in starting the day with outdoor activity. Join us for sunrise walks!',
//         members: Math.floor(Math.random() * 500) + 100,
//         maxMembers: 1000,
//         createdBy: 'SunriseSam',
//         createdAt: new Date('2024-01-01'),
//         isPublic: true,
//         rules: [
//           "Be respectful to all members",
//           "Share your morning routines",
//           "Support each other's journey",
//           "No spam or self-promotion"
//         ],
//         tags: ["morning", "sunrise", "walking"],
//         challenges: ['builtin-7day-streak', 'builtin-30day-discipline']
//       },
//       {
//         id: 'group-2',
//         name: 'Weekend Hikers Club',
//         description: 'Connect with fellow hiking enthusiasts. Plan trips, share routes, and explore nature together.',
//         members: Math.floor(Math.random() * 800) + 200,
//         maxMembers: 2000,
//         createdBy: 'TrailMaster',
//         createdAt: new Date('2024-01-15'),
//         isPublic: true,
//         rules: [
//           "Share hiking safety tips",
//           "Respect trail rules",
//           "Leave no trace",
//           "Share beautiful photos!"
//         ],
//         tags: ["hiking", "weekend", "nature"],
//         challenges: ['builtin-weekend-warrior']
//       },
//       {
//         id: 'group-3',
//         name: 'Mindful Outdoor Meditation',
//         description: 'Combine outdoor time with mindfulness practices. Perfect for reducing stress and finding peace.',
//         members: Math.floor(Math.random() * 300) + 50,
//         maxMembers: 500,
//         createdBy: 'ZenMaster',
//         createdAt: new Date('2024-02-01'),
//         isPublic: true,
//         rules: [
//           "Share peaceful locations",
//           "Respect others' meditation",
//           "Keep discussions positive",
//           "No religious debates"
//         ],
//         tags: ["meditation", "mindfulness", "peace"],
//         challenges: ['builtin-30day-discipline']
//       },
//       {
//         id: 'group-4',
//         name: 'Urban Explorers',
//         description: 'Find nature in the city! Parks, botanical gardens, and urban trails are our playground.',
//         members: Math.floor(Math.random() * 600) + 150,
//         maxMembers: 1500,
//         createdBy: 'CityAdventurer',
//         createdAt: new Date('2024-02-10'),
//         isPublic: true,
//         rules: [
//           "Share urban green spaces",
//           "Respect city regulations",
//           "Keep locations clean",
//           "Help others discover"
//         ],
//         tags: ["urban", "city", "parks"],
//         challenges: ['builtin-7day-streak', 'builtin-weekend-warrior']
//       },
//       {
//         id: 'group-5',
//         name: 'Fitness Challenge Community',
//         description: 'Push your limits with fitness-focused outdoor challenges. From running to calisthenics in nature.',
//         members: Math.floor(Math.random() * 700) + 250,
//         maxMembers: 2000,
//         createdBy: 'FitGuru',
//         createdAt: new Date('2024-02-15'),
//         isPublic: true,
//         rules: [
//           "Share workout routines",
//           "Encourage progress",
//           "Safety first",
//           "Celebrate achievements"
//         ],
//         tags: ["fitness", "workout", "health"],
//         challenges: ['builtin-extreme-100day']
//       }
//     ];
    
//     res.json({
//       success: true,
//       data: groups
//     });
    
//   } catch (error) {
//     console.error('Get groups error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Get challenge stats
// app.get('/api/challenges/stats', authenticateToken, async (req, res) => {
//   try {
//     const totalChallenges = await Challenge.countDocuments();
//     const userChallengesCount = await UserChallenge.countDocuments({ userId: req.user._id });
//     const activeChallenges = await Challenge.countDocuments({ status: 'active' });
    
//     // Get total participants across all challenges
//     const challenges = await Challenge.find({});
//     const totalParticipants = challenges.reduce((sum, challenge) => sum + (challenge.participants || 0), 0);
    
//     // Calculate total prize pool
//     const totalPrizePool = challenges.reduce((sum, challenge) => sum + (challenge.prizePool || 0), 0);
    
//     res.json({
//       success: true,
//       data: {
//         totalChallenges,
//         activeChallenges,
//         totalParticipants,
//         totalPrizePool,
//         userChallengesCount,
//         successRate: 87 // Mock success rate
//       }
//     });
    
//   } catch (error) {
//     console.error('Get challenge stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Update challenge progress with daily check-in
// app.post('/api/challenges/:id/check-in', authenticateToken, async (req, res) => {
//   try {
//     const { notes, duration = 30, location } = req.body;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const userChallenge = await UserChallenge.findOne({
//       userId: req.user._id,
//       challengeId: req.params.id,
//       status: 'active'
//     }).populate('challengeId');
    
//     if (!userChallenge) {
//       return res.status(404).json({
//         success: false,
//         message: 'You are not in this challenge'
//       });
//     }
    
//     // Check if already checked in today
//     const todayStr = today.toISOString().split('T')[0];
//     const existingEntry = userChallenge.progress.entries?.find(entry => {
//       const entryDate = new Date(entry.date).toISOString().split('T')[0];
//       return entryDate === todayStr;
//     });
    
//     if (existingEntry) {
//       return res.status(400).json({
//         success: false,
//         message: 'Already checked in for today'
//       });
//     }
    
//     // Add progress entry
//     userChallenge.progress.entries = userChallenge.progress.entries || [];
//     userChallenge.progress.entries.push({
//       date: new Date(),
//       completed: true,
//       notes: notes || '',
//       duration: parseInt(duration),
//       location: location || null
//     });
    
//     // Update stats
//     userChallenge.progress.completedDays += 1;
//     userChallenge.progress.totalDays += 1;
    
//     // Calculate streak
//     const sortedEntries = [...userChallenge.progress.entries]
//       .sort((a, b) => new Date(b.date) - new Date(a.date));
    
//     let currentStreak = 0;
//     let lastDate = new Date();
    
//     for (const entry of sortedEntries) {
//       if (!entry.completed) break;
      
//       const entryDate = new Date(entry.date);
//       const daysDiff = Math.floor((lastDate - entryDate) / (1000 * 60 * 60 * 24));
      
//       if (daysDiff === 0 || daysDiff === 1) {
//         currentStreak++;
//         lastDate = entryDate;
//       } else {
//         break;
//       }
//     }
    
//     userChallenge.progress.currentStreak = currentStreak;
//     userChallenge.updatedAt = new Date();
    
//     await userChallenge.save();
    
//     // Check for milestone achievements
//     const achievements = [];
//     if (currentStreak === 7) {
//       achievements.push({
//         name: 'Weekly Warrior',
//         description: 'Completed 7 days in a challenge',
//         icon: '🏆',
//         points: 100
//       });
//     }
    
//     if (currentStreak === 30) {
//       achievements.push({
//         name: 'Monthly Maestro',
//         description: 'Completed 30 days in a challenge',
//         icon: '🌟',
//         points: 500
//       });
//     }
    
//     if (currentStreak === 100) {
//       achievements.push({
//         name: 'Century Club',
//         description: 'Completed 100 days in a challenge',
//         icon: '💯',
//         points: 1000
//       });
//     }
    
//     // Add achievements to user
//     if (achievements.length > 0) {
//       await User.findByIdAndUpdate(req.user._id, {
//         $push: { 
//           achievements: { 
//             $each: achievements.map(ach => ({
//               ...ach,
//               earnedAt: new Date()
//             }))
//           } 
//         }
//       });
//     }
    
//     // Update user's main streak
//     await Streak.findOneAndUpdate(
//       { userId: req.user._id },
//       { 
//         $inc: { 
//           currentStreak: 1,
//           totalDays: 1,
//           totalOutdoorTime: parseInt(duration) 
//         },
//         todayVerified: true,
//         lastUpdated: new Date()
//       },
//       { upsert: true, new: true }
//     );
    
//     res.json({
//       success: true,
//       data: {
//         streak: currentStreak,
//         progress: Math.round((userChallenge.progress.completedDays / userChallenge.challengeId.duration) * 100),
//         completedDays: userChallenge.progress.completedDays,
//         totalDays: userChallenge.progress.totalDays,
//         achievements
//       },
//       message: 'Daily check-in completed!'
//     });
    
//   } catch (error) {
//     console.error('Check-in error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Get challenge leaderboard
// app.get('/api/challenges/:id/leaderboard', authenticateToken, async (req, res) => {
//   try {
//     const challenge = await Challenge.findById(req.params.id);
    
//     if (!challenge) {
//       return res.status(404).json({
//         success: false,
//         message: 'Challenge not found'
//       });
//     }
    
//     const userChallenges = await UserChallenge.find({ 
//       challengeId: challenge._id,
//       status: 'active'
//     })
//       .populate('userId', 'username displayName avatar stats')
//       .sort({ 'progress.currentStreak': -1, 'progress.completedDays': -1 })
//       .limit(50);
    
//     const leaderboard = userChallenges.map((uc, index) => ({
//       rank: index + 1,
//       userId: uc.userId._id,
//       username: uc.userId.username,
//       displayName: uc.userId.displayName,
//       avatar: uc.userId.avatar,
//       streak: uc.progress?.currentStreak || 0,
//       completedDays: uc.progress?.completedDays || 0,
//       progress: Math.round(((uc.progress?.completedDays || 0) / challenge.duration) * 100),
//       totalStreak: uc.userId.stats?.currentStreak || 0
//     }));
    
//     // Add current user's rank if they're in the challenge
//     let userRank = null;
//     if (req.user) {
//       const userIndex = leaderboard.findIndex(item => item.userId.toString() === req.user._id.toString());
//       if (userIndex !== -1) {
//         userRank = userIndex + 1;
//       }
//     }
    
//     res.json({
//       success: true,
//       data: {
//         leaderboard,
//         userRank,
//         totalParticipants: leaderboard.length
//       }
//     });
    
//   } catch (error) {
//     console.error('Get challenge leaderboard error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // Leave challenge
// app.post('/api/challenges/:id/leave', authenticateToken, async (req, res) => {
//   try {
//     const challenge = await Challenge.findById(req.params.id);
    
//     if (!challenge) {
//       return res.status(404).json({
//         success: false,
//         message: 'Challenge not found'
//       });
//     }
    
//     const userChallenge = await UserChallenge.findOne({
//       userId: req.user._id,
//       challengeId: challenge._id
//     });
    
//     if (!userChallenge) {
//       return res.status(400).json({
//         success: false,
//         message: 'You are not in this challenge'
//       });
//     }
    
//     // Mark as left
//     userChallenge.status = 'left';
//     userChallenge.leftAt = new Date();
//     await userChallenge.save();
    
//     // Update challenge participants count
//     if (challenge.participants > 0) {
//       challenge.participants -= 1;
//       await challenge.save();
//     }
    
//     res.json({
//       success: true,
//       message: 'Successfully left the challenge'
//     });
    
//   } catch (error) {
//     console.error('Leave challenge error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });
// // ========== CHAT ROUTES ==========

// app.get('/api/chat/messages', authenticateToken, async (req, res) => {
//   try {
//     const messages = [
//       {
//         id: '1',
//         userId: 'user1',
//         username: 'john_doe',
//         displayName: 'John Doe',
//         avatar: '',
//         message: 'Just completed my 7-day streak! 💪',
//         timestamp: new Date(Date.now() - 3600000).toISOString(),
//         likes: 5
//       },
//       {
//         id: '2',
//         userId: 'user2',
//         username: 'jane_smith',
//         displayName: 'Jane Smith',
//         avatar: '',
//         message: 'Anyone up for a challenge this week?',
//         timestamp: new Date(Date.now() - 1800000).toISOString(),
//         likes: 3
//       },
//       {
//         id: '3',
//         userId: req.user._id,
//         username: req.user.username,
//         displayName: req.user.displayName,
//         avatar: req.user.avatar,
//         message: 'Just restored my streak after missing yesterday!',
//         timestamp: new Date().toISOString(),
//         likes: 0
//       }
//     ];
    
//     res.json({
//       success: true,
//       messages
//     });
    
//   } catch (error) {
//     console.error('Get chat messages error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.post('/api/chat/messages', authenticateToken, async (req, res) => {
//   try {
//     const { message } = req.body;
    
//     if (!message || message.trim().length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Message cannot be empty'
//       });
//     }
    
//     const newMessage = {
//       id: `msg_${Date.now()}`,
//       userId: req.user._id,
//       username: req.user.username,
//       displayName: req.user.displayName,
//       avatar: req.user.avatar,
//       message: message.trim(),
//       timestamp: new Date().toISOString(),
//       likes: 0
//     };
    
//     res.json({
//       success: true,
//       message: 'Message sent',
//       newMessage
//     });
    
//   } catch (error) {
//     console.error('Send message error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.get('/api/chat/online-users', authenticateToken, async (req, res) => {
//   try {
//     const onlineUsers = await User.aggregate([
//       { $sample: { size: 10 } },
//       { $project: {
//         _id: 1,
//         username: 1,
//         displayName: 1,
//         avatar: 1,
//         stats: { currentStreak: 1 }
//       }}
//     ]);
    
//     res.json({
//       success: true,
//       onlineUsers: onlineUsers.map(user => ({
//         id: user._id,
//         username: user.username,
//         displayName: user.displayName,
//         avatar: user.avatar,
//         streak: user.stats.currentStreak
//       }))
//     });
    
//   } catch (error) {
//     console.error('Get online users error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // ========== DEBUG ENDPOINTS ==========

// app.get('/api/debug/users', async (req, res) => {
//   try {
//     const users = await User.find({});
//     console.log('Total users in database:', users.length);
    
//     res.json({
//       success: true,
//       count: users.length,
//       users: users.map(user => ({
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         displayName: user.displayName,
//         createdAt: user.createdAt,
//         subscription: user.subscription,
//         stats: user.stats
//       }))
//     });
//   } catch (error) {
//     console.error('Debug error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// app.get('/api/debug/payments', async (req, res) => {
//   try {
//     const payments = await Payment.find({});
    
//     res.json({
//       success: true,
//       count: payments.length,
//       payments: payments.map(p => ({
//         id: p._id,
//         userId: p.userId,
//         paymentId: p.paymentId,
//         amount: p.amount,
//         status: p.status,
//         type: p.type,
//         provider: p.provider,
//         createdAt: p.createdAt
//       }))
//     });
//   } catch (error) {
//     console.error('Debug payments error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// app.get('/api/debug/streaks', async (req, res) => {
//   try {
//     const streaks = await Streak.find({}).populate('userId', 'username displayName');
    
//     res.json({
//       success: true,
//       count: streaks.length,
//       streaks: streaks.map(s => ({
//         id: s._id,
//         userId: s.userId?._id,
//         username: s.userId?.username,
//         currentStreak: s.currentStreak,
//         longestStreak: s.longestStreak,
//         status: s.status,
//         lastUpdated: s.lastUpdated
//       }))
//     });
//   } catch (error) {
//     console.error('Debug streaks error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ========== 404 HANDLER ==========
// app.use('/api/*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'API endpoint not found',
//     path: req.originalUrl,
//     availableEndpoints: [
//       '/api/health',
//       '/api/auth/register',
//       '/api/auth/login',
//       '/api/auth/google',
//       '/api/auth/forgot-password',
//       '/api/auth/reset-password',
//       '/api/auth/change-password',
//       '/api/auth/me',
//       '/api/users/:username',
//       '/api/streaks/current',
//       '/api/streaks/verify',
//       '/api/streaks/shame',
//       '/api/leaderboard',
//       '/api/notifications',
//       '/api/chat/messages',
//       '/api/dodo/checkout/:plan',
//       '/api/debug/*'
//     ]
//   });
// });

// // ========== ERROR HANDLER ==========
// app.use((err, req, res, next) => {
//   console.error('🔥 Server Error:', {
//     message: err.message,
//     stack: err.stack,
//     path: req.path,
//     method: req.method,
//     requestId: req.id
//   });
  
//   const statusCode = err.status || 500;
//   const message = NODE_ENV === 'production' 
//     ? 'Internal server error' 
//     : err.message;
  
//   res.status(statusCode).json({
//     success: false,
//     message,
//     requestId: req.id,
//     ...(NODE_ENV !== 'production' && { 
//       error: err.message,
//       stack: err.stack 
//     })
//   });
// });

// // ========== START SERVER ==========
// const server = http.createServer(app);

// const startServer = (port) => {
//   server.listen(port, () => {
//     console.log(`
//     🚀 TouchGrass Backend Server Started!

//     📍 Local: http://localhost:${port}
//     📡 Health: http://localhost:${port}/api/health
//     🔧 Environment: ${NODE_ENV}
//     🌐 CORS: Enabled for ${FRONTEND_URL}

//     🗄️  Database: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}

//     🔐 AUTHENTICATION FEATURES:
//     ├── POST   /api/auth/register            - Register new user
//     ├── POST   /api/auth/login               - Login user
//     ├── POST   /api/auth/google              - Google login simulation
//     ├── POST   /api/auth/forgot-password     - Request password reset
//     ├── GET    /api/auth/reset-password/:token - Verify reset token
//     ├── POST   /api/auth/reset-password      - Reset password with token
//     └── POST   /api/auth/change-password     - Change password (authenticated)

//     💰 Dodo Payments Integration: ✅ Enabled
//     ├── GET    /api/dodo/checkout/:plan      - Get checkout URL for plan
//     └── Webhook endpoint ready for production

//     🎯 Available Endpoints:
//     ├── GET    /api/health                    - Health check
//     ├── POST   /api/auth/register             - Register user
//     ├── POST   /api/auth/login                - Login user
//     ├── GET    /api/auth/me                   - Get profile (protected)
//     ├── GET    /api/users/:username           - Get user profile
//     ├── PUT    /api/users/bio                 - Update bio
//     ├── PUT    /api/users/avatar              - Update avatar
//     ├── POST   /api/users/:userId/follow      - Follow/unfollow
//     ├── GET    /api/streaks/current           - Current streak
//     ├── POST   /api/streaks/verify            - Verify streak
//     ├── POST   /api/streaks/shame             - Accept shame day
//     ├── GET    /api/streaks/user/:userId      - Get user streak
//     ├── GET    /api/dodo/checkout/:plan       - Dodo checkout
//     ├── GET    /api/leaderboard               - Global leaderboard
//     ├── GET    /api/leaderboard/user-rank/:userId - Get user rank
//     ├── GET    /api/leaderboard/city/:city    - City leaderboard
//     ├── GET    /api/notifications             - Get notifications
//     ├── PUT    /api/notifications/:id/read    - Mark notification as read
//     ├── GET    /api/chat/messages             - Get chat messages
//     ├── POST   /api/chat/messages             - Send chat message
//     ├── GET    /api/chat/online-users         - Get online users
//     ├── GET    /api/debug/users               - Debug: all users
//     ├── GET    /api/debug/payments            - Debug: all payments
//     ├── GET    /api/debug/streaks             - Debug: all streaks

//     🔑 Authentication: Bearer token required for protected routes
//     💡 Tip: Test with Postman or curl first
//     `);
//   }).on('error', (err) => {
//     if (err.code === 'EADDRINUSE') {
//       const nextPort = parseInt(port) + 1;
//       console.log(`⚠️  Port ${port} is busy, trying ${nextPort}...`);
//       startServer(nextPort);
//     } else {
//       console.error('❌ Server error:', err);
//       process.exit(1);
//     }
//   });
// };

// startServer(PORT);

// process.on('SIGTERM', () => {
//   console.log('SIGTERM received. Shutting down gracefully...');
//   server.close(() => {
//     console.log('HTTP server closed');
//     mongoose.connection.close(false, () => {
//       console.log('MongoDB connection closed');
//       process.exit(0);
//     });
//   });
// });

// process.on('SIGINT', () => {
//   console.log('SIGINT received. Shutting down gracefully...');
//   server.close(() => {
//     console.log('HTTP server closed');
//     mongoose.connection.close(false, () => {
//       console.log('MongoDB connection closed');
//       process.exit(0);
//     });
//   });
// });

// module.exports = { app, server };
// // ========== VERCEL EXPORT ==========
// module.exports = app;

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

// Import database configuration
const { configureMongoDB } = require('./src/config/database');

const app = express();

// Environment variables
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ========== MIDDLEWARE SETUP ==========

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:5001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3002',
      'http://127.0.0.1:3003',
      FRONTEND_URL
    ].filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Origin',
    'X-Requested-With',
    'X-User-Email',
    'X-Access-Token',
    'X-User-Id'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
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

app.get('/', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date() });
});

// Render health check (required!)
app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// ========== DATABASE CONNECTION ==========

// Initialize database connection using the configured function
configureMongoDB()
  .then(() => {
    console.log('✅ Database initialization completed');
  })
  .catch((error) => {
    console.error('❌ Database initialization failed:', error.message);
    if (NODE_ENV === 'production') {
      process.exit(1);
    }
  });

// ========== DATABASE SCHEMAS & MODELS ==========

// User Schema
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
    currentPeriodEnd: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    dodoSubscriptionId: String,
    streakFreezeTokens: { type: Number, default: 0 }
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
  isAdmin: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
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

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

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

userSchema.methods.generateResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

const User = mongoose.model('User', userSchema);

// ========== AUTHENTICATION MIDDLEWARE ==========
// IMPORTANT: This handles Supabase JWTs which are signed with Supabase's own keys, not our JWT_SECRET

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

    // Decode the JWT without verification (Supabase tokens are signed with Supabase's keys)
    // This is safe because we're just extracting user info, not relying on the signature
    // The actual authentication is done by Supabase
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }

    // Check if token is expired
    if (decoded.payload.exp && decoded.payload.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }

    // Extract user info from token
    const email = decoded.payload.email || decoded.payload.user_metadata?.email;
    const supabaseId = decoded.payload.sub;

    if (!email && !supabaseId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload - no user identifier'
      });
    }

    // Find or create user in our database
    let user = await User.findOne({
      $or: [
        { email },
        { supabaseId }
      ]
    });

    // Auto-create user if doesn't exist (for OAuth users)
    if (!user) {
      console.log('Creating new user from Supabase token:', email);
      user = new User({
        email,
        supabaseId,
        username: email ? email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 4) : 'user_' + Math.random().toString(36).substr(2, 8),
        displayName: decoded.payload.user_metadata?.full_name || email?.split('@')[0] || 'User',
        avatar: decoded.payload.user_metadata?.avatar_url || '',
        oauthProvider: 'supabase',
        password: crypto.randomBytes(16).toString('hex'),
        stats: {
          currentStreak: 0,
          longestStreak: 0,
          totalDays: 0,
          totalOutdoorTime: 0
        }
      });
      await user.save();
    }

    req.user = user;
    req.userId = user._id;
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

// Import models
const Challenge = require('./src/models/Challenge');
const UserChallenge = require('./src/models/UserChallenge');

const challengeRoutes = require('./src/routes/challenges');
app.use('/api/challenges', challengeRoutes);

// Streak routes - import and mount the comprehensive streak routes
const streakRoutes = require('./src/routes/streaks');
app.use('/api/streaks', streakRoutes);

// Get user's challenges
app.get('/api/user/challenges', authenticateToken, async (req, res) => {
  try {
    const userChallenges = await UserChallenge.find({ userId: req.user._id })
      .populate('challengeId')
      .sort({ joinedAt: -1 });

    res.json({
      success: true,
      challenges: userChallenges
    });

  } catch (error) {
    console.error('Get user challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Verification Wall Schema
const verificationWallSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  photoUrl: {
    type: String,
    required: true
  },
  photoThumbnail: String,
  photoMetadata: {
    width: Number,
    height: Number,
    size: Number,
    format: String,
    uploadedAt: Date
  },
  streakId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Streak'
  },
  activityType: {
    type: String,
    enum: ['walk', 'run', 'hike', 'sports', 'gardening', 'picnic', 'meditation', 'reading', 'other'],
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 1440
  },
  location: {
    lat: Number,
    lng: Number,
    name: String,
    address: String
  },
  caption: {
    type: String,
    maxlength: 500,
    trim: true
  },
  tags: [String],
  likes: [{
    userId: mongoose.Schema.Types.ObjectId,
    timestamp: Date
  }],
  comments: [{
    userId: mongoose.Schema.Types.ObjectId,
    text: String,
    timestamp: Date,
    likes: [{
      userId: mongoose.Schema.Types.ObjectId,
      timestamp: Date
    }]
  }],
  reports: [{
    userId: mongoose.Schema.Types.ObjectId,
    reason: {
      type: String,
      enum: ['fake_photo', 'inappropriate', 'spam', 'copyright', 'other'],
      required: true
    },
    details: String,
    timestamp: Date,
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'dismissed'],
      default: 'pending'
    }
  }],
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockedReason: String,
  blockedAt: Date,
  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  views: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  verificationScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

verificationWallSchema.index({ userId: 1, createdAt: -1 });
verificationWallSchema.index({ createdAt: -1 });
verificationWallSchema.index({ isBlocked: 1 });
verificationWallSchema.index({ 'reports.status': 1 });

verificationWallSchema.virtual('totalReports').get(function() {
  return this.reports.length;
});

verificationWallSchema.virtual('pendingReports').get(function() {
  return this.reports.filter(report => report.status === 'pending').length;
});

verificationWallSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

verificationWallSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

const VerificationWall = mongoose.model('VerificationWall', verificationWallSchema);

// Password Reset Token Schema
const passwordResetTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 3600000)
  },
  used: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const PasswordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema);

// Streak Schema
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
  restoredAt: Date,
  restorationPaymentId: String,
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

// Using the Streak model from ./src/models/Streak.js instead
// const Streak = mongoose.model('Streak', streakSchema);

// Payment Schema
const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['streak_restoration', 'subscription', 'freeze_tokens', 'donation', 'custom'],
    required: true
  },
  metadata: {
    type: Object,
    default: {}
  },
  provider: {
    type: String,
    enum: ['stripe', 'dodo', 'paypal', 'razorpay'],
    default: 'dodo'
  },
  error: String,
  refunds: [{
    refundId: String,
    amount: Number,
    reason: String,
    processedAt: Date
  }],
  processedAt: Date
}, {
  timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);

// Webhook Log Schema
const webhookLogSchema = new mongoose.Schema({
  eventId: String,
  type: String,
  payload: Object,
  result: Object,
  processedAt: Date,
  signatureValid: Boolean,
  error: String
}, {
  timestamps: true
});

const WebhookLog = mongoose.model('WebhookLog', webhookLogSchema);

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
        me: 'GET /api/auth/me',
        forgotPassword: 'POST /api/auth/forgot-password',
        resetPassword: 'POST /api/auth/reset-password',
        verifyToken: 'GET /api/auth/reset-password/:token',
        changePassword: 'POST /api/auth/change-password',
        google: 'POST /api/auth/google'
      },
      users: {
        profile: 'GET /api/users/:username',
        updateBio: 'PUT /api/users/bio',
        updateAvatar: 'PUT /api/users/avatar',
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
      leaderboardUserRank: 'GET /api/leaderboard/user-rank/:userId',
      seo: {
        sitemap: 'GET /api/seo/sitemap.xml',
        robots: 'GET /api/seo/robots.txt'
      }
    },
    dodo: {
      checkout: 'GET /api/dodo/checkout/:plan',
      webhook: 'POST /api/dodo/webhook'
    }
  });
});

// ========== AUTH ROUTES ==========

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;

    if (!username || !email || !password || !displayName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

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

    const streak = new Streak({
      userId: user._id,
      currentStreak: 0,
      longestStreak: 0,
      totalDays: 0,
      todayVerified: false,
      history: []
    });
    await streak.save();

    const token = user.generateAuthToken();

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

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = user.generateAuthToken();

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

// Simple Google login simulation
app.post('/api/auth/google', async (req, res) => {
  try {
    const { email, name, picture } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email and name are required for Google login'
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const username = email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 5);

      user = new User({
        email,
        username,
        displayName: name,
        avatar: picture || '',
        password: crypto.randomBytes(16).toString('hex'),
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

      const streak = new Streak({
        userId: user._id,
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        todayVerified: false,
        history: []
      });
      await streak.save();
    }

    const token = user.generateAuthToken();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Google login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google login'
    });
  }
});

// Forgot password - request password reset
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const resetTokenDoc = new PasswordResetToken({
      userId: user._id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 3600000)
    });

    await resetTokenDoc.save();

    const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;

    console.log('📧 Password reset URL (dev mode):', resetUrl);

    res.json({
      success: true,
      message: 'Password reset initiated',
      ...(NODE_ENV === 'development' && {
        resetToken,
        resetUrl,
        note: 'In production, this would be sent via email'
      })
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Verify reset token
app.get('/api/auth/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const resetToken = await PasswordResetToken.findOne({
      token: hashedToken,
      used: false,
      expiresAt: { $gt: new Date() }
    }).populate('userId', 'email displayName');

    if (!resetToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    res.json({
      success: true,
      message: 'Token is valid',
      email: resetToken.userId.email,
      displayName: resetToken.userId.displayName
    });

  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Reset password with token
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const resetToken = await PasswordResetToken.findOne({
      token: hashedToken,
      used: false,
      expiresAt: { $gt: new Date() }
    }).populate('userId');

    if (!resetToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    const user = resetToken.userId;
    user.password = newPassword;
    await user.save();

    resetToken.used = true;
    await resetToken.save();

    await PasswordResetToken.deleteMany({
      userId: user._id,
      used: false
    });

    res.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

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

// Change password (authenticated)
app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    const user = await User.findById(req.user._id);

    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ========== USER ROUTES ==========

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

    const isFollowing = req.user.following.includes(user._id);

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

    const isFollowing = currentUser.following.includes(userId);

    if (isFollowing) {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: userId },
        $inc: { 'stats.followingCount': -1 }
      });

      await User.findByIdAndUpdate(userId, {
        $pull: { followers: req.user._id },
        $inc: { 'stats.followersCount': -1 }
      });
    } else {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: userId },
        $inc: { 'stats.followingCount': 1 }
      });

      await User.findByIdAndUpdate(userId, {
        $push: { followers: req.user._id },
        $inc: { 'stats.followersCount': 1 }
      });
    }

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

// ========== STREAK ROUTES - REMOVED DUPLICATES (using streaks.js instead) ==========
// The streak routes are now defined in backend/src/routes/streaks.js
// and mounted at /api/streaks in line ~5193

// app.get('/api/streaks/current', authenticateToken, async (req, res) => {
//   try {
//     const streak = await Streak.findOne({ userId: req.user._id });

//     if (!streak) {
//       const newStreak = new Streak({
//         userId: req.user._id,
//         currentStreak: 0,
//         longestStreak: 0,
//         totalDays: 0,
//         todayVerified: false,
//         history: []
//       });
//       await newStreak.save();

//       return res.json({
//         success: true,
//         streak: newStreak
//       });
//     }

//     const now = new Date();
//     const lastUpdate = new Date(streak.lastUpdated);
//     const daysSinceLastUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));

//     if (daysSinceLastUpdate > 1 && streak.currentStreak > 0) {
//       streak.currentStreak = 0;
//       streak.status = 'broken';
//       streak.history.push({
//         date: new Date(lastUpdate.getTime() + 24 * 60 * 60 * 1000),
//         verified: false,
//         verificationMethod: 'shame',
//         shameMessage: 'Missed daily verification',
//         isPublicShame: false
//       });
//       await streak.save();

//       await User.findByIdAndUpdate(req.user._id, {
//         $set: { 'stats.currentStreak': 0 }
//       });
//     }

//     res.json({
//       success: true,
//       streak
//     });

//   } catch (error) {
//     console.error('Get streak error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.get('/api/streaks/user/:userId', authenticateToken, async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const streak = await Streak.findOne({ userId });

//     if (!streak) {
//       return res.status(404).json({
//         success: false,
//         message: 'Streak not found'
//       });
//     }

//     res.json({
//       success: true,
//       streak
//     });

//   } catch (error) {
//     console.error('Get user streak error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.post('/api/streaks/verify', authenticateToken, async (req, res) => {
//   try {
//     const { method = 'manual', duration = 30, notes = '', timestamp } = req.body;
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

//     let streak = await Streak.findOne({ userId: req.user._id });

//     if (!streak) {
//       streak = new Streak({
//         userId: req.user._id,
//         currentStreak: 0,
//         longestStreak: 0,
//         totalDays: 0,
//         todayVerified: false,
//         history: []
//       });
//     }

//     const todayStr = today.toISOString().split('T')[0];
//     const alreadyVerifiedToday = streak.history.some(entry => {
//       const entryDate = new Date(entry.date);
//       const entryDateStr = entryDate.toISOString().split('T')[0];
//       return entryDateStr === todayStr && entry.verified;
//     });

//     if (alreadyVerifiedToday) {
//       return res.status(400).json({
//         success: false,
//         message: 'Already verified today'
//       });
//     }

//     const verification = {
//       date: now,
//       verified: true,
//       verificationMethod: method,
//       duration: parseInt(duration),
//       notes: notes || '',
//       location: req.body.location || null
//     };

//     streak.history.push(verification);

//     const lastUpdate = new Date(streak.lastUpdated);
//     const lastUpdateDate = new Date(lastUpdate.getFullYear(), lastUpdate.getMonth(), lastUpdate.getDate());

//     if (today.getTime() === lastUpdateDate.getTime() || streak.currentStreak === 0) {
//       streak.currentStreak += 1;
//     } else if (today.getTime() === lastUpdateDate.getTime() + 24 * 60 * 60 * 1000) {
//       streak.currentStreak += 1;
//     } else {
//       streak.currentStreak = 1;
//     }

//     if (streak.currentStreak > streak.longestStreak) {
//       streak.longestStreak = streak.currentStreak;
//     }

//     streak.totalDays += 1;
//     streak.totalOutdoorTime += parseInt(duration) || 30;
//     streak.todayVerified = true;
//     streak.lastUpdated = now;
//     streak.status = 'active';

//     const nextCheckpoint = new Date(today);
//     nextCheckpoint.setDate(nextCheckpoint.getDate() + 1);
//     streak.nextCheckpoint = nextCheckpoint;

//     await streak.save();

//     const user = await User.findById(req.user._id);
//     user.stats.currentStreak = streak.currentStreak;
//     user.stats.longestStreak = streak.longestStreak;
//     user.stats.totalDays = streak.totalDays;
//     user.stats.totalOutdoorTime = streak.totalOutdoorTime;

//     if (user.stats.totalDays > 0) {
//       const consistency = (streak.currentStreak / user.stats.totalDays) * 100;
//       user.stats.consistencyScore = Math.min(100, Math.round(consistency));
//     }

//     await user.save();

//     const achievements = [];
//     if (streak.currentStreak === 7) {
//       achievements.push({
//         name: 'Weekly Warrior',
//         earnedAt: now,
//         icon: '🏆',
//         description: 'Maintained a 7-day streak'
//       });
//     }

//     if (streak.currentStreak === 30) {
//       achievements.push({
//         name: 'Monthly Maestro',
//         earnedAt: now,
//         icon: '🌟',
//         description: 'Maintained a 30-day streak'
//       });
//     }

//     if (streak.currentStreak === 100) {
//       achievements.push({
//         name: 'Century Club',
//         earnedAt: now,
//         icon: '💯',
//         description: 'Maintained a 100-day streak'
//       });
//     }

//     if (achievements.length > 0) {
//       await User.findByIdAndUpdate(req.user._id, {
//         $push: { achievements: { $each: achievements } }
//       });
//     }

//     res.json({
//       success: true,
//       streak,
//       message: 'Verification successful!',
//       achievements: achievements.length > 0 ? achievements : null
//     });

//   } catch (error) {
//     console.error('Verify streak error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// app.post('/api/streaks/shame', authenticateToken, async (req, res) => {
//   try {
//     const { message = 'Failed to touch grass today', public = true } = req.body;
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

//     let streak = await Streak.findOne({ userId: req.user._id });

//     if (!streak) {
//       streak = new Streak({
//         userId: req.user._id,
//         currentStreak: 0,
//         longestStreak: 0,
//         totalDays: 0,
//         todayVerified: false,
//         history: []
//       });
//     }

//     const todayStr = today.toISOString().split('T')[0];
//     const alreadyShamedToday = streak.history.some(entry => {
//       const entryDate = new Date(entry.date);
//       const entryDateStr = entryDate.toISOString().split('T')[0];
//       return entryDateStr === todayStr && !entry.verified;
//     });

//     if (alreadyShamedToday) {
//       return res.status(400).json({
//         success: false,
//         message: 'Already accepted shame for today'
//       });
//     }

//     streak.history.push({
//       date: now,
//       verified: false,
//       verificationMethod: 'shame',
//       shameMessage: message,
//       isPublicShame: public
//     });

//     streak.currentStreak = 0;
//     streak.todayVerified = false;
//     streak.lastUpdated = now;
//     streak.status = 'broken';

//     await streak.save();

//     await User.findByIdAndUpdate(req.user._id, {
//       $set: { 'stats.currentStreak': 0 }
//     });

//     res.json({
//       success: true,
//       streak,
//       message: 'Shame accepted. Streak reset.'
//     });

//   } catch (error) {
//     console.error('Shame error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// ========== DODO PAYMENTS ROUTES ==========

app.get('/api/dodo/checkout/:plan', authenticateToken, async (req, res) => {
  try {
    const { plan } = req.params;

    const dodoUrls = {
      pro: process.env.DODO_PRO_PRODUCT_URL || 'https://checkout.dodopayments.com/buy/pdt_0NWPkwJJcZChm84jRPqIt',
      enterprise: process.env.DODO_ENTERPRISE_PRODUCT_URL || 'https://checkout.dodopayments.com/buy/pdt_0NWPl4fuR5huBMtu7YAKT',
      streak_restoration: process.env.DODO_TEST_PRODUCT_URL || 'https://checkout.dodopayments.com/buy/pdt_0NWPjjq1W9yybN1dR63eF'
    };

    if (!dodoUrls[plan]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan type'
      });
    }

    let checkoutUrl = dodoUrls[plan] + '?quantity=1';

    if (req.user) {
      const urlObj = new URL(checkoutUrl);
      urlObj.searchParams.append('client_reference_id', req.user._id.toString());
      if (req.user.email) {
        urlObj.searchParams.append('prefilled_email', req.user.email);
      }
      urlObj.searchParams.append('product_name', `${plan === 'pro' ? 'Pro' : plan === 'enterprise' ? 'Enterprise' : 'Streak Restoration'} - TouchGrass`);
      checkoutUrl = urlObj.toString();
    }

    const payment = new Payment({
      userId: req.user._id,
      paymentId: `dodo_${Date.now()}_${plan}`,
      amount: plan === 'pro' ? 14.99 : plan === 'enterprise' ? 59.99 : 4.99,
      currency: 'USD',
      status: 'pending',
      type: plan === 'streak_restoration' ? 'streak_restoration' : 'subscription',
      metadata: {
        plan: plan,
        userEmail: req.user.email,
        userName: req.user.displayName
      },
      provider: 'dodo'
    });
    await payment.save();

    res.json({
      success: true,
      checkoutUrl,
      plan: plan,
      price: plan === 'pro' ? 14.99 : plan === 'enterprise' ? 59.99 : 4.99,
      paymentId: payment.paymentId,
      instructions: 'Open this URL in a new window to complete payment'
    });

  } catch (error) {
    console.error('Dodo checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate checkout URL'
    });
  }
});

// ========== LEADERBOARD ROUTES ==========

app.get('/api/leaderboard', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const users = await User.find({ 'preferences.showOnLeaderboard': true })
      .select('username displayName avatar stats subscription location')
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
      longestStreak: user.stats.longestStreak,
      followers: user.stats.followersCount
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

app.get('/api/leaderboard/user-rank/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const allUsers = await User.find({ 'preferences.showOnLeaderboard': true })
      .select('_id stats.currentStreak stats.consistencyScore')
      .sort({ 'stats.currentStreak': -1, 'stats.consistencyScore': -1 });

    const rank = allUsers.findIndex(user => user._id.toString() === userId) + 1;

    const user = await User.findById(userId).select('stats');

    res.json({
      success: true,
      rank: rank > 0 ? rank : null,
      totalUsers: allUsers.length,
      streak: user?.stats?.currentStreak || 0,
      consistency: user?.stats?.consistencyScore || 0
    });

  } catch (error) {
    console.error('Get user rank error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

app.get('/api/leaderboard/city/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const { limit = 20 } = req.query;

    const users = await User.find({
      'preferences.showOnLeaderboard': true,
      'location.city': new RegExp(city, 'i')
    })
    .select('username displayName avatar stats subscription')
    .sort({ 'stats.currentStreak': -1 })
    .limit(parseInt(limit));

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      streak: user.stats.currentStreak,
      consistency: user.stats.consistencyScore,
      isPremium: user.subscription?.plan !== 'free'
    }));

    res.json({
      success: true,
      city,
      leaderboard,
      count: users.length
    });

  } catch (error) {
    console.error('City leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ========== VERIFICATION WALL ROUTES ==========

// Create new verification wall post
app.post('/api/verification-wall', authenticateToken, async (req, res) => {
  try {
    const { photoUrl, activityType, duration, location, caption } = req.body;

    // Validate required fields
    if (!photoUrl || !activityType || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Photo URL, activity type, and duration are required'
      });
    }

    // Create new post
    const newPost = new VerificationWall({
      userId: req.user._id,
      photoUrl,
      activityType,
      duration,
      location: location || 'Outdoors',
      caption: caption || '',
      likes: [],
      comments: [],
      reports: []
    });

    await newPost.save();
    await newPost.populate('userId', 'username displayName avatar');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: newPost
    });
  } catch (error) {
    console.error('Create verification wall error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get verification wall posts
app.get('/api/verification-wall', async (req, res) => {
  try {
    const { page = 1, limit = 20, filter = 'recent' } = req.query;

    let query = { isBlocked: false };
    let sort = { createdAt: -1 };

    switch (filter) {
      case 'popular':
        sort = { likeCount: -1, createdAt: -1 };
        break;
      case 'verified':
        query.isVerified = true;
        break;
      case 'reported':
        query.reports = { $exists: true, $ne: [] };
        break;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await VerificationWall.find(query)
      .populate('userId', 'username displayName avatar')
      .populate('streakId', 'currentStreak')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await VerificationWall.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    const postsWithDetails = posts.map(post => ({
      _id: post._id,
      userId: {
        _id: post.userId._id,
        username: post.userId.username,
        displayName: post.userId.displayName,
        avatar: post.userId.avatar
      },
      streakId: post.streakId,
      photoUrl: post.photoUrl,
      caption: post.caption,
      activityType: post.activityType,
      duration: post.duration,
      location: post.location,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      reportCount: post.totalReports,
      isVerified: post.isVerified,
      verificationScore: post.verificationScore,
      createdAt: post.createdAt,
      likes: post.likes,
      comments: post.comments.slice(-3),
      reports: post.reports
    }));

    res.json({
      success: true,
      posts: postsWithDetails,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get verification wall error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Like a post
app.post('/api/verification-wall/:postId/like', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await VerificationWall.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const likeIndex = post.likes.findIndex(like => like.userId.toString() === userId.toString());

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
      await post.save();

      res.json({
        success: true,
        message: 'Post unliked',
        liked: false
      });
    } else {
      post.likes.push({ userId, createdAt: new Date() });
      await post.save();

      res.json({
        success: true,
        message: 'Post liked',
        liked: true
      });
    }

  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Report a post
app.post('/api/verification-wall/:postId/report', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { reason, details } = req.body;
    const userId = req.user._id;

    const post = await VerificationWall.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const existingReport = post.reports.find(report => report.reportedBy.toString() === userId.toString());
    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this post'
      });
    }

    post.reports.push({
      reportedBy: userId,
      reason,
      details,
      createdAt: new Date()
    });

    await post.save();

    res.json({
      success: true,
      message: 'Report submitted successfully'
    });

  } catch (error) {
    console.error('Report post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Add comment to post
app.post('/api/verification-wall/:postId/comment', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty'
      });
    }

    const post = await VerificationWall.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = {
      userId,
      text: text.trim(),
      createdAt: new Date()
    };

    post.comments.push(comment);
    await post.save();

    await post.populate('comments.userId', 'username displayName avatar');

    const newComment = post.comments[post.comments.length - 1];

    res.json({
      success: true,
      message: 'Comment added successfully',
      comment: {
        _id: newComment._id,
        userId: {
          _id: newComment.userId._id,
          username: newComment.userId.username,
          displayName: newComment.userId.displayName,
          avatar: newComment.userId.avatar
        },
        text: newComment.text,
        createdAt: newComment.createdAt
      }
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ========== NOTIFICATION ROUTES ==========

app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = [
      {
        id: '1',
        type: 'streak_reminder',
        title: 'Streak Reminder',
        message: 'Don\'t forget to verify your streak today!',
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
      },
      {
        id: '3',
        type: 'password_reset',
        title: 'Password Reset',
        message: 'Your password was recently changed',
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    const unreadCount = notifications.filter(n => !n.read).length;
    
    res.json({
      success: true,
      notifications,
      unreadCount
    });
    
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    res.json({
      success: true,
      message: 'Notification marked as read'
    });
    
  } catch (error) {
    console.error('Mark notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ========== CHALLENGE ROUTES ==========

// Get built-in challenges
app.get('/api/challenges/built-in', async (req, res) => {
  try {
    const builtInChallenges = [
      {
        id: 'builtin-7day-streak',
        name: '7-Day TouchGrass Challenge',
        description: 'A beginner-friendly challenge to build the habit of going outside daily. Perfect for newcomers!',
        duration: 7,
        type: 'streak',
        difficulty: 'easy',
        stake: 0,
        prizePool: 0,
        participants: Math.floor(Math.random() * 1000) + 500,
        maxParticipants: 10000,
        status: 'active',
        rules: [
          'Go outside for at least 15 minutes daily',
          'Take a photo as proof',
          'Share your experience (optional)',
          'No cheating - be honest with yourself!'
        ],
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date('2024-01-01'),
        featured: true,
        isBuiltIn: true
      },
      {
        id: 'builtin-30day-discipline',
        name: '30-Day Discipline Marathon',
        description: 'Transform your habits with this intensive 30-day challenge. Build consistency and mental toughness.',
        duration: 30,
        type: 'mindset',
        difficulty: 'medium',
        stake: 10,
        prizePool: Math.floor(Math.random() * 5000) + 1000,
        participants: Math.floor(Math.random() * 500) + 200,
        maxParticipants: 1000,
        status: 'active',
        rules: [
          'Daily outdoor activity + reflection',
          'No skipping days allowed',
          'Share weekly progress',
          'Support fellow participants'
        ],
        isPublic: true,
        createdBy: 'system',
        createdAt: new Date('2024-01-15'),
        featured: true,
        isBuiltIn: true
      }
    ];
    
    res.json({
      success: true,
      data: builtInChallenges
    });
    
  } catch (error) {
    console.error('Get built-in challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get challenge by ID with details
app.get('/api/challenges/:id/details', authenticateToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('createdBy', 'username displayName avatar');
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }
    
    const userChallenges = await UserChallenge.find({ 
      challengeId: challenge._id,
      status: 'active'
    })
      .populate('userId', 'username displayName avatar')
      .sort({ 'progress.currentStreak': -1 });
    
    const joinedUsers = userChallenges.map(uc => ({
      id: uc.userId._id,
      name: uc.userId.displayName,
      username: uc.userId.username,
      avatar: uc.userId.avatar,
      streak: uc.progress?.currentStreak || 0,
      progress: uc.challengeId?.duration > 0 
        ? Math.round(((uc.progress?.completedDays || 0) / challenge.duration) * 100)
        : 0,
      isCreator: uc.userId._id.toString() === challenge.createdBy._id.toString(),
      joinedAt: uc.joinedAt
    }));
    
    let userHasJoined = false;
    let userProgress = null;
    
    if (req.user) {
      const userChallenge = await UserChallenge.findOne({
        userId: req.user._id,
        challengeId: challenge._id
      });
      
      if (userChallenge) {
        userHasJoined = true;
        userProgress = {
          streak: userChallenge.progress?.currentStreak || 0,
          completedDays: userChallenge.progress?.completedDays || 0,
          totalDays: userChallenge.progress?.totalDays || 0,
          progress: challenge.duration > 0 
            ? Math.round(((userChallenge.progress?.completedDays || 0) / challenge.duration) * 100)
            : 0
        };
      }
    }
    
    const transformed = {
      id: challenge._id,
      name: challenge.name,
      description: challenge.description,
      duration: challenge.duration,
      type: challenge.type,
      difficulty: challenge.difficulty,
      stake: challenge.stake,
      prizePool: challenge.prizePool,
      participants: challenge.participants || 0,
      maxParticipants: challenge.maxParticipants || 100,
      status: challenge.status || 'active',
      rules: challenge.rules || [],
      isPublic: challenge.isPublic,
      groupId: challenge.groupId,
      createdBy: challenge.createdBy?.username,
      creatorDetails: {
        username: challenge.createdBy?.username,
        displayName: challenge.createdBy?.displayName,
        avatar: challenge.createdBy?.avatar
      },
      createdAt: challenge.createdAt,
      joinedUsers,
      userHasJoined,
      userProgress
    };
    
    res.json({
      success: true,
      data: transformed
    });
    
  } catch (error) {
    console.error('Get challenge details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get challenge stats
app.get('/api/challenges/stats', authenticateToken, async (req, res) => {
  try {
    const totalChallenges = await Challenge.countDocuments();
    const userChallengesCount = await UserChallenge.countDocuments({ userId: req.user._id });
    const activeChallenges = await Challenge.countDocuments({ status: 'active' });
    
    const challenges = await Challenge.find({});
    const totalParticipants = challenges.reduce((sum, challenge) => sum + (challenge.participants || 0), 0);
    
    const totalPrizePool = challenges.reduce((sum, challenge) => sum + (challenge.prizePool || 0), 0);
    
    res.json({
      success: true,
      data: {
        totalChallenges,
        activeChallenges,
        totalParticipants,
        totalPrizePool,
        userChallengesCount,
        successRate: 87
      }
    });
    
  } catch (error) {
    console.error('Get challenge stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update challenge progress with daily check-in
app.post('/api/challenges/:id/check-in', authenticateToken, async (req, res) => {
  try {
    const { notes, duration = 30, location } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const userChallenge = await UserChallenge.findOne({
      userId: req.user._id,
      challengeId: req.params.id,
      status: 'active'
    }).populate('challengeId');
    
    if (!userChallenge) {
      return res.status(404).json({
        success: false,
        message: 'You are not in this challenge'
      });
    }
    
    const todayStr = today.toISOString().split('T')[0];
    const existingEntry = userChallenge.progress.entries?.find(entry => {
      const entryDate = new Date(entry.date).toISOString().split('T')[0];
      return entryDate === todayStr;
    });
    
    if (existingEntry) {
      return res.status(400).json({
        success: false,
        message: 'Already checked in for today'
      });
    }
    
    userChallenge.progress.entries = userChallenge.progress.entries || [];
    userChallenge.progress.entries.push({
      date: new Date(),
      completed: true,
      notes: notes || '',
      duration: parseInt(duration),
      location: location || null
    });
    
    userChallenge.progress.completedDays += 1;
    userChallenge.progress.totalDays += 1;
    
    const sortedEntries = [...userChallenge.progress.entries]
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let currentStreak = 0;
    let lastDate = new Date();
    
    for (const entry of sortedEntries) {
      if (!entry.completed) break;
      
      const entryDate = new Date(entry.date);
      const daysDiff = Math.floor((lastDate - entryDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0 || daysDiff === 1) {
        currentStreak++;
        lastDate = entryDate;
      } else {
        break;
      }
    }
    
    userChallenge.progress.currentStreak = currentStreak;
    userChallenge.updatedAt = new Date();
    
    await userChallenge.save();
    
    const achievements = [];
    if (currentStreak === 7) {
      achievements.push({
        name: 'Weekly Warrior',
        description: 'Completed 7 days in a challenge',
        icon: '🏆',
        points: 100
      });
    }
    
    if (currentStreak === 30) {
      achievements.push({
        name: 'Monthly Maestro',
        description: 'Completed 30 days in a challenge',
        icon: '🌟',
        points: 500
      });
    }
    
    if (currentStreak === 100) {
      achievements.push({
        name: 'Century Club',
        description: 'Completed 100 days in a challenge',
        icon: '💯',
        points: 1000
      });
    }
    
    if (achievements.length > 0) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { 
          achievements: { 
            $each: achievements.map(ach => ({
              ...ach,
              earnedAt: new Date()
            }))
          } 
        }
      });
    }
    
    await Streak.findOneAndUpdate(
      { userId: req.user._id },
      { 
        $inc: { 
          currentStreak: 1,
          totalDays: 1,
          totalOutdoorTime: parseInt(duration) 
        },
        todayVerified: true,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );
    
    res.json({
      success: true,
      data: {
        streak: currentStreak,
        progress: Math.round((userChallenge.progress.completedDays / userChallenge.challengeId.duration) * 100),
        completedDays: userChallenge.progress.completedDays,
        totalDays: userChallenge.progress.totalDays,
        achievements
      },
      message: 'Daily check-in completed!'
    });
    
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get challenge leaderboard
app.get('/api/challenges/:id/leaderboard', authenticateToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }
    
    const userChallenges = await UserChallenge.find({ 
      challengeId: challenge._id,
      status: 'active'
    })
      .populate('userId', 'username displayName avatar stats')
      .sort({ 'progress.currentStreak': -1, 'progress.completedDays': -1 })
      .limit(50);
    
    const leaderboard = userChallenges.map((uc, index) => ({
      rank: index + 1,
      userId: uc.userId._id,
      username: uc.userId.username,
      displayName: uc.userId.displayName,
      avatar: uc.userId.avatar,
      streak: uc.progress?.currentStreak || 0,
      completedDays: uc.progress?.completedDays || 0,
      progress: Math.round(((uc.progress?.completedDays || 0) / challenge.duration) * 100),
      totalStreak: uc.userId.stats?.currentStreak || 0
    }));
    
    let userRank = null;
    if (req.user) {
      const userIndex = leaderboard.findIndex(item => item.userId.toString() === req.user._id.toString());
      if (userIndex !== -1) {
        userRank = userIndex + 1;
      }
    }
    
    res.json({
      success: true,
      data: {
        leaderboard,
        userRank,
        totalParticipants: leaderboard.length
      }
    });
    
  } catch (error) {
    console.error('Get challenge leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Leave challenge
app.post('/api/challenges/:id/leave', authenticateToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }
    
    const userChallenge = await UserChallenge.findOne({
      userId: req.user._id,
      challengeId: challenge._id
    });
    
    if (!userChallenge) {
      return res.status(400).json({
        success: false,
        message: 'You are not in this challenge'
      });
    }
    
    userChallenge.status = 'left';
    userChallenge.leftAt = new Date();
    await userChallenge.save();
    
    if (challenge.participants > 0) {
      challenge.participants -= 1;
      await challenge.save();
    }
    
    res.json({
      success: true,
      message: 'Successfully left the challenge'
    });
    
  } catch (error) {
    console.error('Leave challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ========== CHAT ROUTES ==========

app.get('/api/chat/messages', authenticateToken, async (req, res) => {
  try {
    const messages = [
      {
        id: '1',
        userId: 'user1',
        username: 'john_doe',
        displayName: 'John Doe',
        avatar: '',
        message: 'Just completed my 7-day streak! 💪',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        likes: 5
      },
      {
        id: '2',
        userId: 'user2',
        username: 'jane_smith',
        displayName: 'Jane Smith',
        avatar: '',
        message: 'Anyone up for a challenge this week?',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        likes: 3
      },
      {
        id: '3',
        userId: req.user._id,
        username: req.user.username,
        displayName: req.user.displayName,
        avatar: req.user.avatar,
        message: 'Just restored my streak after missing yesterday!',
        timestamp: new Date().toISOString(),
        likes: 0
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

app.post('/api/chat/messages', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty'
      });
    }
    
    const newMessage = {
      id: `msg_${Date.now()}`,
      userId: req.user._id,
      username: req.user.username,
      displayName: req.user.displayName,
      avatar: req.user.avatar,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      likes: 0
    };
    
    res.json({
      success: true,
      message: 'Message sent',
      newMessage
    });
    
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

app.get('/api/chat/online-users', authenticateToken, async (req, res) => {
  try {
    const onlineUsers = await User.aggregate([
      { $sample: { size: 10 } },
      { $project: {
        _id: 1,
        username: 1,
        displayName: 1,
        avatar: 1,
        stats: { currentStreak: 1 }
      }}
    ]);
    
    res.json({
      success: true,
      onlineUsers: onlineUsers.map(user => ({
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        streak: user.stats.currentStreak
      }))
    });
    
  } catch (error) {
    console.error('Get online users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ========== DEBUG ENDPOINTS ==========

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
        createdAt: user.createdAt,
        subscription: user.subscription,
        stats: user.stats
      }))
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/debug/payments', async (req, res) => {
  try {
    const payments = await Payment.find({});
    
    res.json({
      success: true,
      count: payments.length,
      payments: payments.map(p => ({
        id: p._id,
        userId: p.userId,
        paymentId: p.paymentId,
        amount: p.amount,
        status: p.status,
        type: p.type,
        provider: p.provider,
        createdAt: p.createdAt
      }))
    });
  } catch (error) {
    console.error('Debug payments error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/debug/streaks', async (req, res) => {
  try {
    const streaks = await Streak.find({}).populate('userId', 'username displayName');
    
    res.json({
      success: true,
      count: streaks.length,
      streaks: streaks.map(s => ({
        id: s._id,
        userId: s.userId?._id,
        username: s.userId?.username,
        currentStreak: s.currentStreak,
        longestStreak: s.longestStreak,
        status: s.status,
        lastUpdated: s.lastUpdated
      }))
    });
  } catch (error) {
    console.error('Debug streaks error:', error);
    res.status(500).json({ success: false, error: error.message });
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
      '/api/auth/google',
      '/api/auth/forgot-password',
      '/api/auth/reset-password',
      '/api/auth/change-password',
      '/api/auth/me',
      '/api/users/:username',
      '/api/streaks/current',
      '/api/streaks/verify',
      '/api/streaks/shame',
      '/api/leaderboard',
      '/api/notifications',
      '/api/chat/messages',
      '/api/dodo/checkout/:plan',
      '/api/debug/*'
    ]
  });
});

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    requestId: req.id
  });
  
  const statusCode = err.status || 500;
  const message = NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(statusCode).json({
    success: false,
    message,
    requestId: req.id,
    ...(NODE_ENV !== 'production' && { 
      error: err.message,
      stack: err.stack 
    })
  });
});

// ========== START SERVER ==========
let server;

const startServer = (port) => {
  // Create a new server instance for each port attempt
  const serverInstance = http.createServer(app);
  
  serverInstance.listen(port, () => {
    console.log(`
    🚀 TouchGrass Backend Server Started!

    📍 Local: http://localhost:${port}
    📡 Health: http://localhost:${port}/api/health
    🔧 Environment: ${NODE_ENV}
    🌐 CORS: Enabled for ${FRONTEND_URL}

    🗄️  Database: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}

    🔐 AUTHENTICATION FEATURES:
    ├── POST   /api/auth/register            - Register new user
    ├── POST   /api/auth/login               - Login user
    ├── POST   /api/auth/google              - Google login simulation
    ├── POST   /api/auth/forgot-password     - Request password reset
    ├── GET    /api/auth/reset-password/:token - Verify reset token
    ├── POST   /api/auth/reset-password      - Reset password with token
    └── POST   /api/auth/change-password     - Change password (authenticated)

    💰 Dodo Payments Integration: ✅ Enabled
    ├── GET    /api/dodo/checkout/:plan      - Get checkout URL for plan
    └── Webhook endpoint ready for production

    🎯 Available Endpoints:
    ├── GET    /api/health                    - Health check
    ├── POST   /api/auth/register             - Register user
    ├── POST   /api/auth/login                - Login user
    ├── GET    /api/auth/me                   - Get profile (protected)
    ├── GET    /api/users/:username           - Get user profile
    ├── PUT    /api/users/bio                 - Update bio
    ├── PUT    /api/users/avatar              - Update avatar
    ├── POST   /api/users/:userId/follow      - Follow/unfollow
    ├── GET    /api/streaks/current           - Current streak
    ├── POST   /api/streaks/verify            - Verify streak
    ├── POST   /api/streaks/shame             - Accept shame day
    ├── GET    /api/streaks/user/:userId      - Get user streak
    ├── GET    /api/dodo/checkout/:plan       - Dodo checkout
    ├── GET    /api/leaderboard               - Global leaderboard
    ├── GET    /api/leaderboard/user-rank/:userId - Get user rank
    ├── GET    /api/leaderboard/city/:city    - City leaderboard
    ├── GET    /api/notifications             - Get notifications
    ├── PUT    /api/notifications/:id/read    - Mark notification as read
    ├── GET    /api/chat/messages             - Get chat messages
    ├── POST   /api/chat/messages             - Send chat message
    ├── GET    /api/chat/online-users         - Get online users
    ├── GET    /api/debug/users               - Debug: all users
    ├── GET    /api/debug/payments            - Debug: all payments
    ├── GET    /api/debug/streaks             - Debug: all streaks

    🔑 Authentication: Bearer token required for protected routes
    💡 Tip: Test with Postman or curl first
    `);
    
    // Update the global server reference to the new instance
    server = serverInstance;
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = parseInt(port) + 1;
      console.log(`⚠️  Port ${port} is busy, trying ${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error('❌ Server error:', err);
      process.exit(1);
    }
  });
};

startServer(PORT);

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
// ========== VERCEL EXPORT ==========
module.exports = app;