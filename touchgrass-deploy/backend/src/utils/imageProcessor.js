const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');

class Helpers {
  constructor() {
    this.SALT_ROUNDS = 12;
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.JWT_EXPIRY = '7d';
  }

  // Password hashing
  async hashPassword(password) {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  // JWT Token generation
  generateToken(payload, expiresIn = this.JWT_EXPIRY) {
    return jwt.sign(payload, this.JWT_SECRET, { expiresIn });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Generate random strings
  generateRandomString(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  generateNumericCode(length = 6) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }

  // Generate referral code
  generateReferralCode(username) {
    const prefix = username.slice(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${random}`;
  }

  // Format dates
  formatDate(date, format = 'YYYY-MM-DD') {
    return moment(date).format(format);
  }

  formatDateTime(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  }

  formatRelativeTime(date) {
    return moment(date).fromNow();
  }

  // Calculate time differences
  daysBetween(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  hoursBetween(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60));
  }

  minutesBetween(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60));
  }

  // Timezone conversion
  convertToUTC(date) {
    return moment.utc(date).toDate();
  }

  convertFromUTC(date, timezone = 'UTC') {
    return moment.utc(date).tz(timezone).toDate();
  }

  // URL helpers
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  // File helpers
  getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  isValidImageExtension(extension) {
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    return validExtensions.includes(extension.toLowerCase());
  }

  isValidVideoExtension(extension) {
    const validExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
    return validExtensions.includes(extension.toLowerCase());
  }

  // Data sanitization
  sanitizeHtml(text) {
    const escapeHtml = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, char => escapeHtml[char]);
  }

  stripHtml(text) {
    return text.replace(/<[^>]*>/g, '');
  }

  truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
  }

  // Array/Object helpers
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  flattenObject(obj, prefix = '') {
    const flattened = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(flattened, this.flattenObject(value, newKey));
      } else {
        flattened[newKey] = value;
      }
    }
    
    return flattened;
  }

  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // Number helpers
  formatNumber(num, decimals = 2) {
    return parseFloat(num).toFixed(decimals);
  }

  formatCurrency(amount, currency = 'USD', locale = 'en-US') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatPercentage(value, decimals = 1) {
    return `${parseFloat(value).toFixed(decimals)}%`;
  }

  // Validation helpers
  isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    return usernameRegex.test(username);
  }

  isStrongPassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && 
           hasUpperCase && 
           hasLowerCase && 
           hasNumbers && 
           hasSpecialChar;
  }

  // Color helpers
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // API response formatting
  formatApiResponse(data, message = '', success = true) {
    return {
      success,
      message,
      data,
      timestamp: new Date().toISOString(),
      version: process.env.API_VERSION || '1.0'
    };
  }

  formatErrorResponse(error, message = 'An error occurred') {
    return {
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString(),
      version: process.env.API_VERSION || '1.0'
    };
  }

  // Pagination helper
  paginate(array, page = 1, limit = 20) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const results = {
      data: array.slice(startIndex, endIndex),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: array.length,
        pages: Math.ceil(array.length / limit),
        hasNext: endIndex < array.length,
        hasPrev: startIndex > 0
      }
    };
    
    return results;
  }

  // Cache key generation
  generateCacheKey(prefix, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    
    const hash = crypto
      .createHash('md5')
      .update(sortedParams)
      .digest('hex')
      .slice(0, 8);
    
    return `${prefix}:${hash}`;
  }

  // Rate limiting key
  generateRateLimitKey(ip, endpoint) {
    const now = new Date();
    const minute = Math.floor(now.getTime() / 60000);
    return `rate:${endpoint}:${ip}:${minute}`;
  }

  // File size formatting
  formatFileSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  // Generate avatar from initials
  generateAvatarInitials(name) {
    const initials = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    return initials;
  }

  // Color from string (for consistent avatar colors)
  stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      '#22c55e', // Green
      '#3b82f6', // Blue
      '#8b5cf6', // Purple
      '#ec4899', // Pink
      '#f59e0b', // Amber
      '#ef4444', // Red
      '#10b981', // Emerald
      '#06b6d4', // Cyan
      '#f97316', // Orange
      '#6366f1'  // Indigo
    ];
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }

  // Calculate age from birthdate
  calculateAge(birthdate) {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // Sleep/delay function
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Retry function with exponential backoff
  async retry(fn, maxRetries = 3, delay = 1000) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          await this.sleep(delay * Math.pow(2, i));
        }
      }
    }
    
    throw lastError;
  }

  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Generate progress percentage
  calculateProgress(current, total) {
    if (total === 0) return 0;
    return Math.min(100, Math.round((current / total) * 100));
  }

  // Calculate streak consistency
  calculateConsistency(streakDays, totalDays) {
    if (totalDays === 0) return 0;
    return Math.min(100, Math.round((streakDays / totalDays) * 100));
  }

  // Generate achievement emoji based on streak
  getStreakEmoji(streak) {
    if (streak >= 365) return '🏆';
    if (streak >= 100) return '💯';
    if (streak >= 30) return '🌟';
    if (streak >= 7) return '🔥';
    return '🌱';
  }

  // Generate random roast messages
  getRandomRoast() {
    const roasts = [
      "Your chair must be fused to your skin by now.",
      "Even houseplants get more sunlight than you.",
      "Your vitamin D levels are crying.",
      "Your screen time is longer than your life expectancy.",
      "The grass is calling, but you're on silent mode.",
      "You've evolved from human to houseplant.",
      "Your outdoor time: 0. Your excuses: ∞.",
      "The sun asked about you. I told it you were busy... indoors.",
      "Your Fitbit thinks you're a statue.",
      "Nature's waiting. Your chair's holding you hostage."
    ];
    
    return this.pickRandom(roasts);
  }

  // Generate random encouragement messages
  getRandomEncouragement() {
    const encouragements = [
      "One day closer to becoming a real human again!",
      "Nature approves. Your serotonin levels thank you.",
      "Another victory over digital decay!",
      "The sun missed you. No, really.",
      "Fresh air acquired. Brain cells activated.",
      "You're building discipline that 99% of people don't have.",
      "The outdoors just got a little brighter.",
      "Your future self will thank you for this.",
      "Discipline is choosing between what you want now and what you want most.",
      "Small daily improvements lead to stunning results."
    ];
    
    return this.pickRandom(encouragements);
  }

  // Generate share hashtags
  generateShareHashtags(streak) {
    const baseTags = ['TouchGrass', 'Accountability', 'Streak'];
    
    if (streak >= 100) {
      baseTags.push('CenturyClub', 'Elite');
    } else if (streak >= 30) {
      baseTags.push('Monthly', 'Consistency');
    } else if (streak >= 7) {
      baseTags.push('Weekly', 'Discipline');
    }
    
    const additionalTags = ['MentalHealth', 'Wellness', 'Outdoors', 'Fitness', 'SelfImprovement'];
    const randomTags = this.shuffleArray(additionalTags).slice(0, 2);
    
    return [...baseTags, ...randomTags];
  }

  // Calculate leaderboard score
  calculateLeaderboardScore(streak, consistency, totalDays) {
    const streakWeight = 0.5;
    const consistencyWeight = 0.3;
    const daysWeight = 0.2;
    
    // Normalize values
    const normalizedStreak = Math.min(streak, 365) / 365; // Cap at 365 days
    const normalizedConsistency = consistency / 100;
    const normalizedDays = Math.min(totalDays, 730) / 730; // Cap at 2 years
    
    return (normalizedStreak * streakWeight + 
            normalizedConsistency * consistencyWeight + 
            normalizedDays * daysWeight) * 1000;
  }

  // Environment detection
  isDevelopment() {
    return process.env.NODE_ENV === 'development';
  }

  isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  isTest() {
    return process.env.NODE_ENV === 'test';
  }

  // Logging helper
  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      environment: process.env.NODE_ENV
    };
    
    // In production, use structured logging
    if (this.isProduction()) {
      console.log(JSON.stringify(logEntry));
    } else {
      console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, data);
    }
  }

  // Performance measurement
  measurePerformance(fn, label = 'Function') {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    const duration = end - start;
    this.log('info', `${label} took ${duration.toFixed(2)}ms`);
    
    return { result, duration };
  }

  // Generate QR code data URL (simple version)
  generateQRCodeData(text) {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
    return qrCodeUrl;
  }

  // Validate latitude and longitude
  isValidLatLng(lat, lng) {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }

  // Calculate distance between coordinates (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  toRad(degrees) {
    return degrees * Math.PI / 180;
  }

  // Generate time slots for reminders
  generateTimeSlots() {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({ time, label: `${hour}:${minute.toString().padStart(2, '0')}` });
      }
    }
    return slots;
  }

  // Parse time string to minutes since midnight
  parseTimeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Check if current time is within reminder window
  isWithinReminderWindow(reminderTime, windowMinutes = 15) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const reminderMinutes = this.parseTimeToMinutes(reminderTime);
    
    const diff = Math.abs(currentMinutes - reminderMinutes);
    return diff <= windowMinutes;
  }
}

module.exports = new Helpers();