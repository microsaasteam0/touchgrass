const mongoose = require('mongoose');
const crypto = require('crypto');

const webhookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  secret: {
    type: String,
    required: true,
    default: function() {
      return crypto.randomBytes(32).toString('hex');
    }
  },
  events: [{
    type: String,
    enum: [
      'user.created',
      'user.updated',
      'user.deleted',
      'streak.created',
      'streak.updated',
      'streak.broken',
      'streak.milestone',
      'payment.completed',
      'payment.failed',
      'payment.refunded',
      'challenge.created',
      'challenge.joined',
      'challenge.completed',
      'achievement.unlocked',
      'share.created',
      'share.clicked',
      'notification.sent',
      'webhook.test'
    ],
    required: true
  }],
  status: {
    type: String,
    enum: ['active', 'paused', 'disabled'],
    default: 'active',
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  settings: {
    retryAttempts: {
      type: Number,
      default: 3,
      min: 0,
      max: 10
    },
    retryDelay: {
      type: Number,
      default: 1000,
      min: 100,
      max: 60000
    },
    timeout: {
      type: Number,
      default: 5000,
      min: 1000,
      max: 30000
    },
    includeMetadata: {
      type: Boolean,
      default: true
    },
    verifySSL: {
      type: Boolean,
      default: true
    },
    compress: {
      type: Boolean,
      default: true
    }
  },
  headers: [{
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    isSecret: {
      type: Boolean,
      default: false
    }
  }],
  filters: {
    userIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    streakThreshold: Number,
    paymentAmountMin: Number,
    paymentAmountMax: Number,
    challengeTypes: [String],
    customFilter: mongoose.Schema.Types.Mixed
  },
  statistics: {
    totalDeliveries: { type: Number, default: 0 },
    successfulDeliveries: { type: Number, default: 0 },
    failedDeliveries: { type: Number, default: 0 },
    lastDeliveryAt: Date,
    lastSuccessAt: Date,
    lastFailureAt: Date,
    averageResponseTime: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 }
  },
  metadata: {
    version: { type: String, default: '1.0' },
    environment: { type: String, enum: ['production', 'staging', 'development'] },
    tags: [String],
    notes: String
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
webhookSchema.index({ createdBy: 1 });
webhookSchema.index({ status: 1 });
webhookSchema.index({ events: 1 });
webhookSchema.index({ url: 1 });
webhookSchema.index({ isDeleted: 1 });
webhookSchema.index({ 'metadata.environment': 1 });

// Virtual for isActive
webhookSchema.virtual('isActive').get(function() {
  return this.status === 'active' && !this.isDeleted;
});

// Virtual for delivery statistics
webhookSchema.virtual('deliveryStats').get(function() {
  return {
    total: this.statistics.totalDeliveries,
    successful: this.statistics.successfulDeliveries,
    failed: this.statistics.failedDeliveries,
    successRate: this.statistics.successRate,
    averageResponseTime: this.statistics.averageResponseTime
  };
});

// Method to generate signature
webhookSchema.methods.generateSignature = function(payload) {
  const hmac = crypto.createHmac('sha256', this.secret);
  hmac.update(JSON.stringify(payload));
  return `sha256=${hmac.digest('hex')}`;
};

// Method to verify signature
webhookSchema.methods.verifySignature = function(signature, payload) {
  const expectedSignature = this.generateSignature(payload);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};

// Method to execute webhook
webhookSchema.methods.execute = async function(event, data) {
  if (!this.isActive) {
    throw new Error('Webhook is not active');
  }
  
  if (!this.events.includes(event)) {
    throw new Error('Webhook not subscribed to this event');
  }
  
  // Apply filters if any
  if (!this.passesFilters(event, data)) {
    return null;
  }
  
  const payload = {
    id: crypto.randomBytes(16).toString('hex'),
    event,
    timestamp: new Date().toISOString(),
    data: this.settings.includeMetadata ? data : this.stripMetadata(data)
  };
  
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'TouchGrass-Webhook/1.0',
    'X-Webhook-Id': this._id.toString(),
    'X-Webhook-Event': event,
    'X-Webhook-Timestamp': payload.timestamp,
    'X-Webhook-Signature': this.generateSignature(payload)
  };
  
  // Add custom headers
  this.headers.forEach(header => {
    headers[header.name] = header.value;
  });
  
  const startTime = Date.now();
  let attempts = 0;
  let lastError = null;
  
  while (attempts <= this.settings.retryAttempts) {
    attempts++;
    
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        timeout: this.settings.timeout,
        compress: this.settings.compress
      });
      
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        // Success
        this.recordSuccess(responseTime);
        return {
          success: true,
          attempts,
          responseTime,
          statusCode: response.status
        };
      } else {
        // Failure
        lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
        
        if (response.status >= 400 && response.status < 500) {
          // Client error, don't retry
          break;
        }
      }
    } catch (error) {
      lastError = error;
      
      if (error.name === 'AbortError') {
        // Timeout
        break;
      }
    }
    
    // Wait before retry
    if (attempts <= this.settings.retryAttempts) {
      await new Promise(resolve => 
        setTimeout(resolve, this.settings.retryDelay * attempts)
      );
    }
  }
  
  // All attempts failed
  this.recordFailure(lastError);
  throw lastError;
};

// Method to check if event passes filters
webhookSchema.methods.passesFilters = function(event, data) {
  const filters = this.filters || {};
  
  // Filter by user IDs
  if (filters.userIds && filters.userIds.length > 0) {
    const userId = this.extractUserId(event, data);
    if (userId && !filters.userIds.some(id => id.equals(userId))) {
      return false;
    }
  }
  
  // Filter by streak threshold
  if (filters.streakThreshold && event.includes('streak')) {
    const streak = data.streak || data;
    if (streak.currentStreak < filters.streakThreshold) {
      return false;
    }
  }
  
  // Filter by payment amount
  if (filters.paymentAmountMin || filters.paymentAmountMax) {
    if (event.includes('payment')) {
      const payment = data.payment || data;
      const amount = payment.amount || 0;
      
      if (filters.paymentAmountMin && amount < filters.paymentAmountMin) {
        return false;
      }
      
      if (filters.paymentAmountMax && amount > filters.paymentAmountMax) {
        return false;
      }
    }
  }
  
  // Filter by challenge types
  if (filters.challengeTypes && filters.challengeTypes.length > 0) {
    if (event.includes('challenge')) {
      const challenge = data.challenge || data;
      if (!filters.challengeTypes.includes(challenge.type)) {
        return false;
      }
    }
  }
  
  // Custom filter
  if (filters.customFilter) {
    // Evaluate custom filter logic
    // This would need to be implemented based on specific requirements
  }
  
  return true;
};

// Method to extract user ID from event data
webhookSchema.methods.extractUserId = function(event, data) {
  if (data.user && data.user._id) {
    return data.user._id;
  }
  
  if (data.userId) {
    return data.userId;
  }
  
  if (event.includes('user.')) {
    return data._id;
  }
  
  if (event.includes('streak.')) {
    return data.userId;
  }
  
  if (event.includes('payment.')) {
    return data.user;
  }
  
  return null;
};

// Method to strip metadata from data
webhookSchema.methods.stripMetadata = function(data) {
  const stripped = { ...data };
  
  // Remove internal fields
  delete stripped.__v;
  delete stripped.createdAt;
  delete stripped.updatedAt;
  delete stripped._id;
  
  // Remove nested metadata
  if (stripped.metadata) {
    delete stripped.metadata;
  }
  
  return stripped;
};

// Method to record success
webhookSchema.methods.recordSuccess = function(responseTime) {
  this.statistics.totalDeliveries += 1;
  this.statistics.successfulDeliveries += 1;
  this.statistics.lastDeliveryAt = new Date();
  this.statistics.lastSuccessAt = new Date();
  
  // Update average response time
  const currentAvg = this.statistics.averageResponseTime;
  const newAvg = (currentAvg * (this.statistics.successfulDeliveries - 1) + responseTime) / 
                 this.statistics.successfulDeliveries;
  this.statistics.averageResponseTime = Math.round(newAvg);
  
  // Update success rate
  this.statistics.successRate = Math.round(
    (this.statistics.successfulDeliveries / this.statistics.totalDeliveries) * 100
  );
  
  return this.save();
};

// Method to record failure
webhookSchema.methods.recordFailure = function(error) {
  this.statistics.totalDeliveries += 1;
  this.statistics.failedDeliveries += 1;
  this.statistics.lastDeliveryAt = new Date();
  this.statistics.lastFailureAt = new Date();
  
  // Update success rate
  this.statistics.successRate = Math.round(
    (this.statistics.successfulDeliveries / this.statistics.totalDeliveries) * 100
  );
  
  return this.save();
};

// Method to test webhook
webhookSchema.methods.test = async function() {
  const testData = {
    test: true,
    message: 'Webhook test successful',
    timestamp: new Date().toISOString()
  };
  
  return this.execute('webhook.test', testData);
};

// Method to disable webhook
webhookSchema.methods.disable = function() {
  this.status = 'disabled';
  return this.save();
};

// Method to enable webhook
webhookSchema.methods.enable = function() {
  this.status = 'active';
  return this.save();
};

// Static method to find webhooks for event
webhookSchema.statics.findForEvent = function(event, userId = null) {
  const query = {
    status: 'active',
    events: event,
    isDeleted: false
  };
  
  if (userId) {
    query.createdBy = userId;
  }
  
  return this.find(query);
};

// Static method to deliver event to all webhooks
webhookSchema.statics.deliverEvent = async function(event, data) {
  const webhooks = await this.findForEvent(event);
  
  const deliveries = await Promise.allSettled(
    webhooks.map(webhook => webhook.execute(event, data))
  );
  
  return {
    total: webhooks.length,
    successful: deliveries.filter(d => d.status === 'fulfilled').length,
    failed: deliveries.filter(d => d.status === 'rejected').length,
    results: deliveries.map((result, index) => ({
      webhook: webhooks[index]._id,
      success: result.status === 'fulfilled',
      error: result.status === 'rejected' ? result.reason.message : null
    }))
  };
};

module.exports = mongoose.model('Webhook', webhookSchema);