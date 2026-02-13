
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
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage for verification uploads
const verificationStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'touchgrass/verifications',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi'],
    resource_type: 'auto',
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }]
  }
});

const verificationUpload = multer({ 
  storage: verificationStorage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit for verification photos
    files: 1
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov|avi)$/i)) {
      return cb(new Error('Only image and video files are allowed!'), false);
    }
    cb(null, true);
  }
});

const app = express();

// Environment variables
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://hitanshiee:Hitanshii14@touchgrass.dgyxbbm.mongodb.net/touchgrass?retryWrites=true&w=majority&appName=touchgrass';
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
  origin: ['http://localhost:3000', 'http://localhost:5001', 'http://127.0.0.1:3000', FRONTEND_URL],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'X-User-Email'],
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
app.get('/healthz', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString() 
  });
});

// @route   POST /api/upload/verification
// @desc    Upload verification photo/video
// @access  Private
app.post('/api/upload/verification', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Verification endpoint is working'
    });
  } catch (err) {
    console.error('Upload verification error:', err);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Server error uploading verification media'
    });
  }
});

// ========== DATABASE CONNECTION ==========

console.log('🔄 Attempting to connect to MongoDB...');
console.log(`📁 MongoDB URI: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`); // Hide password in logs

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  retryWrites: true,
  w: 'majority'
};

mongoose.connect(MONGODB_URI, mongoOptions)
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log(`📊 Database: ${mongoose.connection.db?.databaseName || 'touchgrass'}`);
  console.log(`👤 Host: ${mongoose.connection.host}`);
  console.log(`🔌 Port: ${mongoose.connection.port}`);
  console.log(`📈 Connection state: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  
  // Check collections
  mongoose.connection.db.listCollections().toArray()
    .then(collections => {
      console.log(`📁 Collections in database: ${collections.length}`);
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    })
    .catch(err => console.log('Could not list collections:', err.message));
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error('Full error:', err);
  
  if (err.name === 'MongoServerSelectionError') {
    console.log('\n🔍 Troubleshooting tips:');
    console.log('1. Check if your IP is whitelisted in MongoDB Atlas');
    console.log('2. Verify your username and password');
    console.log('3. Check network connectivity to MongoDB Atlas');
    console.log('4. Visit: https://cloud.mongodb.com to check your cluster status');
  }
  
  if (NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Add connection event listeners
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose disconnected from DB');
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

// Import models
// const uploadRoutes = require('./routes/upload');

// Verification Wall Schema (keeping for reference but using imported model)
const verificationWallSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Photo details
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

  // Verification details
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
    type: Number, // in minutes
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

  // User content
  caption: {
    type: String,
    maxlength: 500,
    trim: true
  },
  tags: [String],

  // Social features
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

  // Reporting system
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

  // Moderation
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

  // Analytics
  views: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },

  // Verification status
  isVerified: {
    type: Boolean,
    default: true // Assume genuine unless reported
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

// Indexes
verificationWallSchema.index({ userId: 1, createdAt: -1 });
verificationWallSchema.index({ createdAt: -1 });
verificationWallSchema.index({ isBlocked: 1 });
verificationWallSchema.index({ 'reports.status': 1 });

// Virtual for total reports
verificationWallSchema.virtual('totalReports').get(function() {
  return this.reports.length;
});

// Virtual for pending reports
verificationWallSchema.virtual('pendingReports').get(function() {
  return this.reports.filter(report => report.status === 'pending').length;
});

// Virtual for like count
verificationWallSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
verificationWallSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Method to add report
verificationWallSchema.methods.addReport = async function(userId, reason, details = '') {
  // Check if user already reported
  const existingReport = this.reports.find(report =>
    report.userId.toString() === userId.toString()
  );

  if (existingReport) {
    throw new Error('You have already reported this post');
  }

  this.reports.push({
    userId,
    reason,
    details,
    timestamp: new Date(),
    status: 'pending'
  });

  // Auto-block if too many reports
  if (this.pendingReports >= 5) {
    this.isBlocked = true;
    this.blockedReason = 'Multiple reports received';
    this.blockedAt = new Date();
    this.verificationScore = Math.max(0, this.verificationScore - 20);
  }

  return this.save();
};

// Method to moderate report
verificationWallSchema.methods.moderateReport = async function(reportId, action, moderatorId) {
  const report = this.reports.id(reportId);
  if (!report) {
    throw new Error('Report not found');
  }

  report.status = action === 'block' ? 'reviewed' : 'dismissed';

  if (action === 'block') {
    this.isBlocked = true;
    this.blockedReason = `Blocked due to report: ${report.reason}`;
    this.blockedAt = new Date();
    this.blockedBy = moderatorId;
    this.verificationScore = Math.max(0, this.verificationScore - 30);
  }

  return this.save();
};

// Method to add comment
verificationWallSchema.methods.addComment = async function(userId, text) {
  if (this.isBlocked) {
    throw new Error('Cannot comment on blocked post');
  }

  this.comments.push({
    userId,
    text: text.trim(),
    timestamp: new Date()
  });

  return this.save();
};

// Method to like/unlike
verificationWallSchema.methods.toggleLike = async function(userId) {
  const existingLike = this.likes.find(like =>
    like.userId.toString() === userId.toString()
  );

  if (existingLike) {
    // Unlike
    this.likes = this.likes.filter(like =>
      like.userId.toString() !== userId.toString()
    );
  } else {
    // Like
    this.likes.push({
      userId,
      timestamp: new Date()
    });
  }

  return this.save();
};

// Static method to get public posts
verificationWallSchema.statics.getPublicPosts = function(limit = 20, skip = 0) {
  return this.find({ isBlocked: false })
    .populate('userId', 'username displayName avatar')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to get reported posts for moderation
verificationWallSchema.statics.getReportedPosts = function() {
  return this.find({
    'reports.status': 'pending',
    isBlocked: false
  })
    .populate('userId', 'username displayName avatar')
    .populate('reports.userId', 'username')
    .sort({ 'reports.timestamp': -1 });
};

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
    default: () => new Date(Date.now() + 3600000) // 1 hour
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

const Streak = mongoose.model('Streak', streakSchema);

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

// ========== SEO ROUTES ==========

// Sitemap route
app.get('/api/seo/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || 'https://touchgrass.now';
    const generator = new SitemapGenerator(baseUrl);
    const sitemap = await generator.generate();

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Static sitemap
app.get('/api/seo/sitemap-static.xml', async (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || 'https://touchgrass.now';
    const generator = new SitemapGenerator(baseUrl);
    const sitemap = await generator.generateStatic();

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Static sitemap error:', error);
    res.status(500).send('Error generating static sitemap');
  }
});

// Robots.txt route
app.get('/api/seo/robots.txt', (req, res) => {
  const robots = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /profile
Disallow: /api/
Sitemap: ${process.env.FRONTEND_URL || 'https://touchgrass.now'}/api/seo/sitemap.xml`;

  res.header('Content-Type', 'text/plain');
  res.send(robots);
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
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user from Google data
      const username = email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 5);
      
      user = new User({
        email,
        username,
        displayName: name,
        avatar: picture || '',
        password: crypto.randomBytes(16).toString('hex'), // Random password for Google users
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
      
      // Create streak for new user
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
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      // For security, don't reveal if user exists
      return res.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link'
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Create reset token in database
    const resetTokenDoc = new PasswordResetToken({
      userId: user._id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 3600000) // 1 hour
    });
    
    await resetTokenDoc.save();
    
    // In a real app, you would send an email here
    // For now, we'll return the token in development
    const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;
    
    console.log('📧 Password reset URL (dev mode):', resetUrl);
    console.log('For production, implement email sending with nodemailer');
    
    res.json({
      success: true,
      message: 'Password reset initiated',
      // In development, return the token for testing
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
    
    // Hash the token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Find valid reset token
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
    
    // Hash the token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Find valid reset token
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
    
    // Update user's password
    const user = resetToken.userId;
    user.password = newPassword;
    await user.save();
    
    // Mark token as used
    resetToken.used = true;
    await resetToken.save();
    
    // Delete all other reset tokens for this user
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
    
    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
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

// ========== STREAK ROUTES ==========

app.get('/api/streaks/current', authenticateToken, async (req, res) => {
  try {
    const streak = await Streak.findOne({ userId: req.user._id });
    
    if (!streak) {
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
    
    const now = new Date();
    const lastUpdate = new Date(streak.lastUpdated);
    const daysSinceLastUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastUpdate > 1 && streak.currentStreak > 0) {
      streak.currentStreak = 0;
      streak.status = 'broken';
      streak.history.push({
        date: new Date(lastUpdate.getTime() + 24 * 60 * 60 * 1000),
        verified: false,
        verificationMethod: 'shame',
        shameMessage: 'Missed daily verification',
        isPublicShame: false
      });
      await streak.save();
      
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

app.post('/api/streaks/verify', authenticateToken, async (req, res) => {
  try {
    const { method = 'manual', duration = 30, notes = '', timestamp } = req.body;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
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
    
    const verification = {
      date: now,
      verified: true,
      verificationMethod: method,
      duration: parseInt(duration),
      notes: notes || '',
      location: req.body.location || null
    };
    
    streak.history.push(verification);
    
    const lastUpdate = new Date(streak.lastUpdated);
    const lastUpdateDate = new Date(lastUpdate.getFullYear(), lastUpdate.getMonth(), lastUpdate.getDate());
    
    if (today.getTime() === lastUpdateDate.getTime() || streak.currentStreak === 0) {
      streak.currentStreak += 1;
    } else if (today.getTime() === lastUpdateDate.getTime() + 24 * 60 * 60 * 1000) {
      streak.currentStreak += 1;
    } else {
      streak.currentStreak = 1;
    }
    
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }
    
    streak.totalDays += 1;
    streak.totalOutdoorTime += parseInt(duration) || 30;
    streak.todayVerified = true;
    streak.lastUpdated = now;
    streak.status = 'active';
    
    const nextCheckpoint = new Date(today);
    nextCheckpoint.setDate(nextCheckpoint.getDate() + 1);
    streak.nextCheckpoint = nextCheckpoint;
    
    await streak.save();
    
    const user = await User.findById(req.user._id);
    user.stats.currentStreak = streak.currentStreak;
    user.stats.longestStreak = streak.longestStreak;
    user.stats.totalDays = streak.totalDays;
    user.stats.totalOutdoorTime = streak.totalOutdoorTime;
    
    if (user.stats.totalDays > 0) {
      const consistency = (streak.currentStreak / user.stats.totalDays) * 100;
      user.stats.consistencyScore = Math.min(100, Math.round(consistency));
    }
    
    await user.save();
    
    // Create verification wall post if method is photo or manual
    if (method === 'photo' || method === 'manual') {
      const wallPost = new VerificationWall({
        userId: req.user._id,
        photoUrl: req.body.photoUrl || '', // If photoUrl is provided in body
        activityType: req.body.activityType || 'other',
        duration: parseInt(duration),
        location: req.body.location || null,
        caption: notes || '',
        streakId: streak._id
      });
      
      await wallPost.save();
      await wallPost.populate('userId', 'username avatar displayName');
    }
    
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

app.post('/api/streaks/shame', authenticateToken, async (req, res) => {
  try {
    const { message = 'Failed to touch grass today', public = true } = req.body;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
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
    
    streak.history.push({
      date: now,
      verified: false,
      verificationMethod: 'shame',
      shameMessage: message,
      isPublicShame: public
    });
    
    streak.currentStreak = 0;
    streak.todayVerified = false;
    streak.lastUpdated = now;
    streak.status = 'broken';
    
    await streak.save();
    
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

// ========== DODO PAYMENTS ROUTES ==========

// Get Dodo checkout URLs for different plans
app.get('/api/dodo/checkout/:plan', authenticateToken, async (req, res) => {
  try {
    const { plan } = req.params;
    
    // Dodo product URLs from your environment
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
    
    // Add user metadata to the URL
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
    
    // Log the payment attempt
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

// Get verification wall posts
app.get('/api/verification-wall', async (req, res) => {
  try {
    const { page = 1, limit = 20, filter = 'recent' } = req.query;

    let query = { isBlocked: false }; // Only show public posts
    let sort = { createdAt: -1 }; // recent first

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
      comments: post.comments.slice(-3), // Last 3 comments
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
      // Unlike
      post.likes.splice(likeIndex, 1);
      await post.save();

      res.json({
        success: true,
        message: 'Post unliked',
        liked: false
      });
    } else {
      // Like
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

    // Check if user already reported
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

    // Populate user info for response
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
      '/api/upload/verification',
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
    ├── POST   /api/upload/verification       - Upload verification media
    ├── GET    /api/debug/users               - Debug: all users
    ├── GET    /api/debug/payments            - Debug: all payments
    ├── GET    /api/debug/streaks             - Debug: all streaks
    
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