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

// CORS configuration - include production frontend URLs
const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173', 
    'http://localhost:5001', 
    'http://127.0.0.1:3000', 
    FRONTEND_URL,
    'https://touchgrass.vercel.app',
    'https://touchgrass-frontend.onrender.com',
    'https://touchgrass.entrext.com'
  ].filter(Boolean),
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

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'TouchGrass Backend API', 
    status: 'running', 
    timestamp: new Date(),
    documentation: '/api'
  });
});

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString() 
  });
});

// ========== DATABASE CONNECTION ==========

console.log('🔄 Attempting to connect to MongoDB...');
console.log(`📁 MongoDB URI: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
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

// Indexes
verificationWallSchema.index({ userId: 1, createdAt: -1 });
verificationWallSchema.index({ createdAt: -1 });
verificationWallSchema.index({ isBlocked: 1 });
verificationWallSchema.index({ 'reports.status': 1 });

// Virtuals
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

// Methods
verificationWallSchema.methods.addReport = async function(userId, reason, details = '') {
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

  if (this.pendingReports >= 5) {
    this.isBlocked = true;
    this.blockedReason = 'Multiple reports received';
    this.blockedAt = new Date();
    this.verificationScore = Math.max(0, this.verificationScore - 20);
  }

  return this.save();
};

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

verificationWallSchema.methods.toggleLike = async function(userId) {
  const existingLike = this.likes.find(like =>
    like.userId.toString() === userId.toString()
  );

  if (existingLike) {
    this.likes = this.likes.filter(like =>
      like.userId.toString() !== userId.toString()
    );
  } else {
    this.likes.push({
      userId,
      timestamp: new Date()
    });
  }

  return this.save();
};

// Statics
verificationWallSchema.statics.getPublicPosts = function(limit = 20, skip = 0) {
  return this.find({ isBlocked: false })
    .populate('userId', 'username displayName avatar')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

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

// ========== AUTHENTICATION MIDDLEWARE ==========
// Handles both Supabase JWTs and custom JWT tokens

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
    
    // Try to decode as Supabase token first (they use RS256, we can't verify)
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
      leaderboard: {
        global: 'GET /api/leaderboard',
        userRank: 'GET /api/leaderboard/user-rank/:userId',
        city: 'GET /api/leaderboard/city/:city'
      },
      verification: {
        wall: 'GET /api/verification-wall',
        like: 'POST /api/verification-wall/:postId/like',
        report: 'POST /api/verification-wall/:postId/report',
        comment: 'POST /api/verification-wall/:postId/comment',
        upload: 'POST /api/upload/verification'
      },
      chat: {
        messages: 'GET /api/chat/messages',
        send: 'POST /api/chat/messages',
        online: 'GET /api/chat/online-users'
      },
      notifications: {
        list: 'GET /api/notifications',
        markRead: 'PUT /api/notifications/:id/read'
      },
      dodo: {
        checkout: 'GET /api/dodo/checkout/:plan'
      },
      seo: {
        sitemap: 'GET /api/seo/sitemap.xml',
        robots: 'GET /api/seo/robots.txt'
      },
      debug: {
        users: 'GET /api/debug/users',
        payments: 'GET /api/debug/payments',
        streaks: 'GET /api/debug/streaks'
      }
    }
  });
});

// ========== SEO ROUTES ==========

// Sitemap generator class
class SitemapGenerator {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async generate() {
    const urls = [
      { loc: '/', priority: '1.0' },
      { loc: '/about', priority: '0.8' },
      { loc: '/features', priority: '0.8' },
      { loc: '/pricing', priority: '0.7' },
      { loc: '/leaderboard', priority: '0.9' },
      { loc: '/login', priority: '0.5' },
      { loc: '/register', priority: '0.5' }
    ];

    const users = await User.find({}, 'username').limit(100);
    users.forEach(user => {
      urls.push({ 
        loc: `/profile/${user.username}`, 
        priority: '0.6',
        lastmod: new Date().toISOString().split('T')[0]
      });
    });

    return this.generateXML(urls);
  }

  async generateStatic() {
    const urls = [
      { loc: '/', priority: '1.0' },
      { loc: '/about', priority: '0.8' },
      { loc: '/features', priority: '0.8' },
      { loc: '/pricing', priority: '0.7' },
      { loc: '/leaderboard', priority: '0.9' },
      { loc: '/login', priority: '0.5' },
      { loc: '/register', priority: '0.5' }
    ];

    return this.generateXML(urls);
  }

  generateXML(urls) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    urls.forEach(url => {
      xml += '  <url>\n';
      xml += `    <loc>${this.baseUrl}${url.loc}</loc>\n`;
      if (url.lastmod) xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      xml += `    <priority>${url.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }
}

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

// ========== STREAK ROUTES ==========

app.get('/api/streaks/current', authenticateToken, async (req, res) => {
  try {
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
      await streak.save();
      
      return res.json({
        success: true,
        streak
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
    
    if (method === 'photo' || method === 'manual') {
      const wallPost = new VerificationWall({
        userId: req.user._id,
        photoUrl: req.body.photoUrl || '',
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
      post.likes.push({ userId, timestamp: new Date() });
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

    const existingReport = post.reports.find(report => report.userId.toString() === userId.toString());
    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this post'
      });
    }

    post.reports.push({
      userId,
      reason,
      details,
      timestamp: new Date(),
      status: 'pending'
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

    post.comments.push({
      userId,
      text: text.trim(),
      timestamp: new Date()
    });

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
        timestamp: newComment.timestamp
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

// ========== UPLOAD ROUTES ==========

// @route   POST /api/upload/verification
// @desc    Upload verification photo/video
// @access  Private
app.post('/api/upload/verification', authenticateToken, verificationUpload.single('media'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'NO_FILE',
        message: 'No file uploaded'
      });
    }

    const { streakId } = req.body;

    if (streakId) {
      const streak = await Streak.findOne({
        _id: streakId,
        userId: req.user._id
      });

      if (!streak) {
        return res.status(404).json({
          success: false,
          error: 'STREAK_NOT_FOUND',
          message: 'Streak not found or access denied'
        });
      }
    }

    let optimizedUrl;
    const isVideo = req.file.mimetype.startsWith('video/');

    if (isVideo) {
      optimizedUrl = cloudinary.url(req.file.filename, {
        resource_type: 'video',
        transformation: [
          { width: 1280, height: 720, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      });

      const thumbnailUrl = cloudinary.url(req.file.filename, {
        resource_type: 'video',
        transformation: [
          { width: 400, height: 400, crop: 'fill' },
          { format: 'jpg' }
        ]
      });

      res.json({
        success: true,
        message: 'Verification video uploaded successfully',
        media: {
          url: optimizedUrl,
          thumbnail: thumbnailUrl,
          type: 'video',
          duration: req.file.duration || null,
          size: req.file.size,
          mimetype: req.file.mimetype
        },
        streakId
      });

    } else {
      optimizedUrl = cloudinary.url(req.file.filename, {
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      });

      res.json({
        success: true,
        message: 'Verification photo uploaded successfully',
        media: {
          url: optimizedUrl,
          type: 'image',
          size: req.file.size,
          mimetype: req.file.mimetype,
          dimensions: {
            width: req.file.width,
            height: req.file.height
          }
        },
        streakId
      });
    }

  } catch (err) {
    console.error('Upload verification error:', err);
    
    if (err.message.includes('File type not allowed')) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_FILE_TYPE',
        message: 'Only image and video files are allowed'
      });
    }

    if (err.message.includes('File too large')) {
      return res.status(400).json({
        success: false,
        error: 'FILE_TOO_LARGE',
        message: 'File size must be less than 15MB'
      });
    }

    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Server error uploading verification media'
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

// ========== CHALLENGE ROUTES ==========

// Use existing Challenge model if it exists, otherwise create it
let Challenge;
try {
  Challenge = mongoose.model('Challenge');
} catch (e) {
  const challengeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['streak', 'consistency', 'milestone'], default: 'streak' },
    description: { type: String, required: true },
    category: { type: String, default: 'daily' },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    settings: {
      duration: { value: { type: Number, default: 30 }, unit: { type: String, default: 'days' } },
      entryFee: { type: Number, default: 0 },
      prizePool: { type: Number, default: 0 },
      maxParticipants: { type: Number, default: 0 },
      minParticipants: { type: Number, default: 1 },
      visibility: { type: String, enum: ['public', 'private', 'unlisted'], default: 'public' },
      verificationRequired: { type: Boolean, default: true },
      allowShameDays: { type: Boolean, default: false },
      strictMode: { type: Boolean, default: false }
    },
    rules: {
      targetStreak: { type: Number, default: 30 },
      minDailyTime: { type: Number, default: 10 },
      allowedVerificationMethods: { type: [String], default: ['photo', 'location'] },
      freezeAllowed: { type: Boolean, default: false },
      skipAllowed: { type: Boolean, default: false }
    },
    status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' },
    metadata: {
      isBuiltIn: { type: Boolean, default: false },
      tags: [String],
      themeColor: String,
      bannerImage: String,
      requiresVerification: { type: Boolean, default: true }
    },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    duration: { type: Number, default: 30 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }, { timestamps: true });
  Challenge = mongoose.model('Challenge', challengeSchema);
}

// Use existing UserChallenge model if it exists, otherwise create it
let UserChallenge;
try {
  UserChallenge = mongoose.model('UserChallenge');
} catch (e) {
  const userChallengeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
    joinedAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    totalProgress: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active' },
    completedAt: Date,
    lastVerifiedAt: Date,
    verificationHistory: [{
      date: Date,
      verified: Boolean,
      method: String,
      photoUrl: String,
      location: Object
    }],
    shameDays: { type: Number, default: 0 },
    dailyProgress: {
      type: Map,
      of: {
        completed: { type: Boolean, default: false },
        completedAt: Date,
        notes: String,
        verificationMethod: String
      },
      default: {}
    }
  }, { timestamps: true });
  UserChallenge = mongoose.model('UserChallenge', userChallengeSchema);
}

// Get all available challenges (built-in)
app.get('/api/challenges/built-in', async (req, res) => {
  try {
    const challenges = await Challenge.find({ 
      'metadata.isBuiltIn': true,
      status: 'active'
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: challenges
    });
  } catch (error) {
    console.error('Get built-in challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get user's active challenges
app.get('/api/challenges/user/:email/challenges', async (req, res) => {
  try {
    const userEmail = req.params.email;

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userChallenges = await UserChallenge.find({
      userId: user._id,
      status: 'active'
    }).populate('challengeId');

    // Get today's date for checking daily completion
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = today.toISOString().split('T')[0];

    const challenges = userChallenges
      .filter(uc => uc.challengeId) // Filter out null challengeId
      .map(uc => {
        // Convert Map to plain object if needed
        let dailyProgress = {};
        if (uc.dailyProgress) {
          if (uc.dailyProgress instanceof Map) {
            uc.dailyProgress.forEach((value, key) => {
              dailyProgress[key] = value;
            });
          } else {
            dailyProgress = uc.dailyProgress;
          }
        }
        
        return {
          id: uc._id,
          challengeId: uc.challengeId._id,
          name: uc.challengeId.name,
          description: uc.challengeId.description,
          type: uc.challengeId.type,
          category: uc.challengeId.category,
          difficulty: uc.challengeId.difficulty,
          duration: uc.challengeId.settings?.duration?.value || uc.challengeId.duration || 7,
          progress: uc.totalProgress || 0,
          joinedAt: uc.joinedAt,
          status: uc.status,
          rules: uc.challengeId.rules || [],
          metadata: uc.challengeId.metadata || {},
          icon: uc.challengeId.metadata?.bannerImage || '🎯',
          participants: uc.challengeId.participants?.length || 0,
          currentStreak: uc.currentStreak || 0,
          longestStreak: uc.longestStreak || 0,
          totalProgress: uc.totalProgress || 0,
          dailyProgress: dailyProgress,
          completedToday: dailyProgress[todayKey]?.completed || false
        };
      });

    res.json({
      success: true,
      data: challenges
    });
  } catch (error) {
    console.error('Get user challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Join a challenge
app.post('/api/challenges/:id/join', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    const userEmail = req.headers['x-user-email'];
    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: 'User email required'
      });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const existingJoin = await UserChallenge.findOne({
      userId: user._id,
      challengeId: challenge._id
    });

    if (existingJoin) {
      return res.status(400).json({
        success: false,
        message: 'Already joined this challenge'
      });
    }

    const userChallenge = new UserChallenge({
      userId: user._id,
      challengeId: challenge._id,
      joinedAt: new Date(),
      totalProgress: 0,
      status: 'active'
    });

    await userChallenge.save();

    // Add user to challenge participants (proper format for the schema)
    if (!challenge.participants) {
      challenge.participants = [];
    }
    
    // Check if user is already in participants
    const existingParticipant = challenge.participants.find(
      p => p.user && p.user.toString() === user._id.toString()
    );
    
    if (!existingParticipant) {
      challenge.participants.push({
        user: user._id,
        joinedAt: new Date(),
        status: 'active',
        score: 0,
        progress: { current: 0, target: challenge.settings?.duration?.value || 0 }
      });
      await challenge.save();
    }

    res.json({
      success: true,
      message: 'Successfully joined challenge',
      userChallenge: {
        id: userChallenge._id,
        challengeId: challenge._id,
        joinedAt: userChallenge.joinedAt,
        progress: userChallenge.totalProgress,
        status: userChallenge.status
      }
    });
  } catch (error) {
    console.error('Join challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Leave a challenge
app.post('/api/challenges/:id/leave', async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'];
    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: 'User email required'
      });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userChallenge = await UserChallenge.findOne({
      userId: user._id,
      challengeId: req.params.id
    });

    if (!userChallenge) {
      return res.status(404).json({
        success: false,
        message: 'Not joined this challenge'
      });
    }

    userChallenge.status = 'abandoned';
    await userChallenge.save();

    res.json({
      success: true,
      message: 'Successfully left challenge'
    });
  } catch (error) {
    console.error('Leave challenge error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Verify/Complete daily challenge progress
app.post('/api/challenges/:id/verify', async (req, res) => {
  try {
    const challengeIdParam = req.params.id;
    const userEmail = req.headers['x-user-email'];

    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: 'User email required'
      });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Convert challengeId to MongoDB ObjectId
    let challengeId;
    try {
      challengeId = new mongoose.Types.ObjectId(challengeIdParam);
    } catch (error) {
      console.error('Invalid challenge ID format:', challengeIdParam);
      return res.status(400).json({
        success: false,
        message: 'Invalid challenge ID format'
      });
    }

    console.log('🔍 Verify Debug:', {
      userEmail,
      userId: user._id,
      challengeIdParam,
      challengeId,
      challengeIdType: typeof challengeIdParam
    });

    // Find the user's challenge - allow any status (not just 'active')
    let userChallenge = await UserChallenge.findOne({
      userId: user._id,
      challengeId: challengeId
    });

    // If not found with ObjectId, try with string (in case data was stored as string)
    if (!userChallenge) {
      userChallenge = await UserChallenge.findOne({
        userId: user._id,
        challengeId: challengeIdParam
      });
      
      if (userChallenge) {
        console.log('⚠️ Found userChallenge with string challengeId, data inconsistency detected!');
        // Fix the data by updating to use ObjectId
        userChallenge.challengeId = challengeId;
        await userChallenge.save();
        console.log('✅ Fixed userChallenge challengeId to use ObjectId');
      }
    }

    // Also check if the user has ANY active challenges
    if (!userChallenge) {
      const allUserChallenges = await UserChallenge.find({ userId: user._id });
      console.log('🔍 User has these challenges:', allUserChallenges.map(uc => ({
        id: uc._id,
        challengeId: uc.challengeId,
        challengeIdType: typeof uc.challengeId,
        challengeIdToString: uc.challengeId?.toString(),
        status: uc.status
      })));
    }

    if (!userChallenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found or not joined'
      });
    }

    // If status is not active, update it to active
    if (userChallenge.status !== 'active') {
      userChallenge.status = 'active';
      await userChallenge.save();
      console.log('✅ Updated challenge status to active');
    }

    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Initialize dailyProgress if not exists
    if (!userChallenge.dailyProgress) {
      userChallenge.dailyProgress = {};
    }

    // Check if already completed today
    const todayKey = today.toISOString().split('T')[0];
    if (userChallenge.dailyProgress[todayKey]?.completed) {
      return res.json({
        success: true,
        message: 'Already completed today',
        data: {
          date: todayKey,
          completed: true,
          alreadyDone: true
        }
      });
    }

    // Mark today as completed
    userChallenge.dailyProgress[todayKey] = {
      completed: true,
      completedAt: new Date(),
      notes: req.body?.notes || '',
      verificationMethod: req.body?.verificationMethod || 'manual'
    };

    // Update progress
    userChallenge.totalProgress = (userChallenge.totalProgress || 0) + 1;
    
    // Update streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];
    
    if (userChallenge.dailyProgress[yesterdayKey]?.completed) {
      userChallenge.currentStreak = (userChallenge.currentStreak || 0) + 1;
    } else {
      userChallenge.currentStreak = 1;
    }
    
    userChallenge.longestStreak = Math.max(
      userChallenge.longestStreak || 0,
      userChallenge.currentStreak
    );
    
    userChallenge.lastActivity = new Date();
    
    await userChallenge.save();

    res.json({
      success: true,
      message: 'Daily progress verified successfully',
      data: {
        date: todayKey,
        completed: true,
        totalProgress: userChallenge.totalProgress,
        currentStreak: userChallenge.currentStreak,
        longestStreak: userChallenge.longestStreak
      }
    });
  } catch (error) {
    console.error('Verify challenge progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get user's challenges (my-challenges endpoint)
app.get('/api/challenges/my-challenges', async (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'];
    
    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: 'User email required in X-User-Email header'
      });
    }

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get all challenges (not just active) to properly show verification status
    const userChallenges = await UserChallenge.find({
      userId: user._id
    }).populate('challengeId');

    // Get today's date for checking daily completion
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = today.toISOString().split('T')[0];

    const challenges = userChallenges
      .filter(uc => uc.challengeId) // Filter out null challengeId
      .map(uc => {
        // Convert Map to plain object if needed
        let dailyProgress = {};
        if (uc.dailyProgress) {
          if (uc.dailyProgress instanceof Map) {
            uc.dailyProgress.forEach((value, key) => {
              dailyProgress[key] = value;
            });
          } else {
            dailyProgress = uc.dailyProgress;
          }
        }
        
        return {
          id: uc._id,
          challengeId: uc.challengeId._id,
          name: uc.challengeId.name,
          description: uc.challengeId.description,
          type: uc.challengeId.type,
          category: uc.challengeId.category,
          difficulty: uc.challengeId.difficulty,
          duration: uc.challengeId.settings?.duration?.value || uc.challengeId.duration || 7,
          progress: uc.totalProgress || 0,
          joinedAt: uc.joinedAt,
          status: uc.status,
          rules: uc.challengeId.rules || [],
          metadata: uc.challengeId.metadata || {},
          icon: uc.challengeId.metadata?.bannerImage || '🎯',
          participants: uc.challengeId.participants?.length || 0,
          currentStreak: uc.currentStreak || 0,
          longestStreak: uc.longestStreak || 0,
          totalProgress: uc.totalProgress || 0,
          dailyProgress: dailyProgress,
          completedToday: dailyProgress[todayKey]?.completed || false
        };
      });

    res.json({
      success: true,
      data: challenges
    });
  } catch (error) {
    console.error('Get my challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get built-in challenges (all available challenges)
app.get('/api/challenges/all', async (req, res) => {
  try {
    // First check if there are any built-in challenges
    let challenges = await Challenge.find({ 
      'metadata.isBuiltIn': true,
      status: 'active'
    }).sort({ createdAt: -1 });

    // If no built-in challenges, create some default ones
    if (challenges.length === 0) {
      const defaultChallenges = [
        {
          name: '30-Day Outdoor Challenge',
          type: 'streak',
          description: 'Go outside and touch grass every day for 30 days. Build a strong habit of spending time outdoors.',
          category: 'streak',
          difficulty: 'hard',
          duration: 30,
          settings: {
            duration: { value: 30, unit: 'days' },
            entryFee: 0,
            prizePool: 0,
            maxParticipants: 0,
            minParticipants: 1,
            visibility: 'public',
            verificationRequired: true,
            allowShameDays: false,
            strictMode: false
          },
          rules: {
            targetStreak: 30,
            minDailyTime: 15,
            allowedVerificationMethods: ['photo', 'location'],
            freezeAllowed: false,
            skipAllowed: false
          },
          status: 'active',
          metadata: {
            isBuiltIn: true,
            tags: ['outdoor', 'nature', 'habit'],
            themeColor: '#4CAF50',
            bannerImage: '🌳',
            requiresVerification: true
          },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: '7-Day Fresh Air Challenge',
          type: 'streak',
          description: 'A gentle week-long challenge to help you start building the outdoor habit. Just 15 minutes daily!',
          category: 'streak',
          difficulty: 'easy',
          duration: 7,
          settings: {
            duration: { value: 7, unit: 'days' },
            entryFee: 0,
            prizePool: 0,
            maxParticipants: 0,
            minParticipants: 1,
            visibility: 'public',
            verificationRequired: true,
            allowShameDays: true,
            strictMode: false
          },
          rules: {
            targetStreak: 7,
            minDailyTime: 15,
            allowedVerificationMethods: ['photo', 'location', 'manual'],
            freezeAllowed: true,
            skipAllowed: true
          },
          status: 'active',
          metadata: {
            isBuiltIn: true,
            tags: ['beginner', 'easy', 'fresh-air'],
            themeColor: '#2196F3',
            bannerImage: '🌬️',
            requiresVerification: true
          },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: '14-Day Consistency Challenge',
          type: 'consistency',
          description: 'Two weeks of consistent outdoor time. Build reliability in your outdoor habit.',
          category: 'consistency',
          difficulty: 'medium',
          duration: 14,
          settings: {
            duration: { value: 14, unit: 'days' },
            entryFee: 0,
            prizePool: 0,
            maxParticipants: 0,
            minParticipants: 1,
            visibility: 'public',
            verificationRequired: true,
            allowShameDays: false,
            strictMode: false
          },
          rules: {
            targetStreak: 14,
            minDailyTime: 20,
            allowedVerificationMethods: ['photo', 'location'],
            freezeAllowed: false,
            skipAllowed: false
          },
          status: 'active',
          metadata: {
            isBuiltIn: true,
            tags: ['consistency', 'habit', 'two-weeks'],
            themeColor: '#FF9800',
            bannerImage: '📅',
            requiresVerification: true
          },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Morning Sunshine Challenge',
          type: 'milestone',
          description: 'Get outside within 30 minutes of waking up for 21 days. Start your day with nature!',
          category: 'daily',
          difficulty: 'medium',
          duration: 21,
          settings: {
            duration: { value: 21, unit: 'days' },
            entryFee: 0,
            prizePool: 0,
            maxParticipants: 0,
            minParticipants: 1,
            visibility: 'public',
            verificationRequired: true,
            allowShameDays: true,
            strictMode: false
          },
          rules: {
            targetStreak: 21,
            minDailyTime: 10,
            allowedVerificationMethods: ['photo', 'location'],
            freezeAllowed: true,
            skipAllowed: false
          },
          status: 'active',
          metadata: {
            isBuiltIn: true,
            tags: ['morning', 'sunshine', 'routine'],
            themeColor: '#FFC107',
            bannerImage: '🌅',
            requiresVerification: true
          },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Weekend Warrior',
          type: 'milestone',
          description: 'Spend at least 1 hour outdoors each weekend for 8 weeks. Quality outdoor time on weekends!',
          category: 'weekly',
          difficulty: 'easy',
          duration: 56,
          settings: {
            duration: { value: 8, unit: 'weeks' },
            entryFee: 0,
            prizePool: 0,
            maxParticipants: 0,
            minParticipants: 1,
            visibility: 'public',
            verificationRequired: true,
            allowShameDays: true,
            strictMode: false
          },
          rules: {
            targetStreak: 8,
            minDailyTime: 60,
            allowedVerificationMethods: ['photo', 'location'],
            freezeAllowed: true,
            skipAllowed: false
          },
          status: 'active',
          metadata: {
            isBuiltIn: true,
            tags: ['weekend', 'quality-time', 'leisure'],
            themeColor: '#9C27B0',
            bannerImage: '🗓️',
            requiresVerification: true
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      challenges = await Challenge.insertMany(defaultChallenges);
      console.log('✅ Created default challenges:', challenges.length);
    }

    res.json({
      success: true,
      data: challenges
    });
  } catch (error) {
    console.error('Get all challenges error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get daily progress report
app.get('/api/challenges/user/:email/daily-report', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const userChallenges = await UserChallenge.find({
      userId: user._id,
      status: 'active'
    }).populate('challengeId');

    const report = {
      date: today.toISOString().split('T')[0],
      totalChallenges: userChallenges.length,
      challengesDueToday: [],
      progressMadeToday: 0,
      streakMaintained: 0
    };

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Get daily report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get daily check-ins for a user
app.get('/api/challenges/user/:email/daily-checkins', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const date = req.query.date;
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email required'
      });
    }

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get all user challenges (not just active) to properly track verification
    const userChallenges = await UserChallenge.find({
      userId: user._id
    }).populate('challengeId');

    // Get today's date
    const today = date || new Date().toISOString().split('T')[0];

    // Build check-ins data
    const checkins = userChallenges
      .filter(uc => uc.challengeId)
      .map(uc => {
        const challenge = uc.challengeId;
        const dailyProgress = uc.dailyProgress || {};
        
        // Handle Map or plain object
        let dayProgress = dailyProgress;
        if (dailyProgress instanceof Map) {
          dayProgress = {};
          dailyProgress.forEach((value, key) => {
            dayProgress[key] = value;
          });
        }
        
        return {
          challengeId: challenge._id,
          challenge: {
            _id: challenge._id,
            name: challenge.name,
            icon: challenge.metadata?.icon || '🎯'
          },
          date: today,
          completed: dayProgress[today]?.completed || false,
          completedAt: dayProgress[today]?.completedAt || null,
          notes: dayProgress[today]?.notes || '',
          verificationMethod: dayProgress[today]?.verificationMethod || null,
          currentStreak: uc.currentStreak || 0,
          totalProgress: uc.totalProgress || 0
        };
      });

    res.json({
      success: true,
      data: checkins
    });
  } catch (error) {
    console.error('Get daily check-ins error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Test endpoint to verify server is running latest code
app.get('/api/test-verify-route', (req, res) => {
  res.json({
    success: true,
    message: 'Test endpoint working - server has latest code',
    verifyRouteExists: true,
    verifyRoutePath: '/api/challenges/:id/verify'
  });
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
      '/api/verification-wall',
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
    
    📸 Verification Wall: ✅ Enabled
    ├── GET    /api/verification-wall        - Get posts
    ├── POST   /api/upload/verification      - Upload media
    ├── POST   /api/verification-wall/:postId/like - Like post
    ├── POST   /api/verification-wall/:postId/report - Report post
    └── POST   /api/verification-wall/:postId/comment - Add comment
    
    🎯 Available Endpoints:
    ├── GET    /api/health                    - Health check
    ├── POST   /api/auth/register             - Register user
    ├── POST   /api/auth/login                - Login user
    ├── GET    /api/auth/me                   - Get profile (protected)
    ├── GET    /api/users/:username           - Get user profile
    ├── PUT    /api/users/bio                  - Update bio
    ├── PUT    /api/users/avatar               - Update avatar
    ├── POST   /api/users/:userId/follow       - Follow/unfollow
    ├── GET    /api/streaks/current            - Current streak
    ├── POST   /api/streaks/verify             - Verify streak
    ├── POST   /api/streaks/shame              - Accept shame day
    ├── GET    /api/streaks/user/:userId       - Get user streak
    ├── GET    /api/dodo/checkout/:plan        - Dodo checkout
    ├── GET    /api/leaderboard                 - Global leaderboard
    ├── GET    /api/leaderboard/user-rank/:userId - Get user rank
    ├── GET    /api/leaderboard/city/:city      - City leaderboard
    ├── GET    /api/notifications               - Get notifications
    ├── PUT    /api/notifications/:id/read      - Mark notification as read
    ├── GET    /api/chat/messages                - Get chat messages
    ├── POST   /api/chat/messages                - Send chat message
    ├── GET    /api/chat/online-users            - Get online users
    ├── POST   /api/upload/verification          - Upload verification media
    ├── GET    /api/verification-wall            - Get verification wall posts
    ├── POST   /api/verification-wall/:postId/like - Like post
    ├── POST   /api/verification-wall/:postId/report - Report post
    ├── POST   /api/verification-wall/:postId/comment - Add comment
    ├── GET    /api/seo/sitemap.xml              - Sitemap for SEO
    ├── GET    /api/seo/robots.txt               - Robots.txt for SEO
    ├── GET    /api/debug/users                   - Debug: all users
    ├── GET    /api/debug/payments                - Debug: all payments
    └── GET    /api/debug/streaks                 - Debug: all streaks
    
     🔑 Authentication: Bearer token required for protected routes
    💡 Tip: Test with Postman or curl first
    `);
    
    // Update the global server reference to the new instance
    server = serverInstance;
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