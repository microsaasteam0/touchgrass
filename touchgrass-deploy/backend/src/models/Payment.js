const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: [
      'subscription',
      'streak_restore',
      'streak_freeze',
      'challenge_entry',
      'challenge_prize',
      'donation',
      'refund',
      'other'
    ],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true,
    length: 3
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending',
    index: true
  },
  provider: {
    type: String,
    enum: ['stripe', 'paypal', 'apple_pay', 'google_pay', 'manual'],
    required: true
  },
  providerData: {
    paymentIntentId: String,
    paymentMethodId: String,
    customerId: String,
    subscriptionId: String,
    invoiceId: String,
    chargeId: String,
    receiptUrl: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    streakId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Streak'
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge'
    },
    subscriptionPlan: String,
    subscriptionPeriod: String,
    itemCount: Number,
    taxAmount: Number,
    discountAmount: Number,
    couponCode: String,
    notes: String
  },
  billingDetails: {
    name: String,
    email: String,
    phone: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    }
  },
  refund: {
    amount: Number,
    reason: String,
    processedAt: Date,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  dispute: {
    status: String,
    reason: String,
    initiatedAt: Date,
    resolvedAt: Date,
    outcome: String
  },
  tax: {
    rate: Number,
    amount: Number,
    jurisdiction: String
  },
  fees: [{
    type: String,
    amount: Number,
    description: String
  }],
  relatedPayments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }],
  ipAddress: String,
  userAgent: String,
  deviceId: String,
  processedAt: Date,
  completedAt: Date,
  failedAt: Date,
  failureReason: String,
  nextPaymentDate: Date,
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrence: {
    interval: String, // daily, weekly, monthly, yearly
    intervalCount: Number,
    totalCycles: Number,
    currentCycle: Number
  },
  webhookEvents: [{
    eventId: String,
    type: String,
    receivedAt: Date,
    data: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ 'providerData.paymentIntentId': 1 });
paymentSchema.index({ 'providerData.customerId': 1 });
paymentSchema.index({ 'providerData.subscriptionId': 1 });
paymentSchema.index({ type: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ amount: 1 });
paymentSchema.index({ 'metadata.subscriptionPlan': 1 });
paymentSchema.index({ 'metadata.challengeId': 1 });
paymentSchema.index({ 'metadata.streakId': 1 });

// Virtual for net amount
paymentSchema.virtual('netAmount').get(function() {
  let net = this.amount;
  
  // Subtract fees
  if (this.fees && this.fees.length > 0) {
    const feeTotal = this.fees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
    net -= feeTotal;
  }
  
  // Subtract tax
  if (this.tax && this.tax.amount) {
    net -= this.tax.amount;
  }
  
  // Subtract discount
  if (this.metadata && this.metadata.discountAmount) {
    net -= this.metadata.discountAmount;
  }
  
  return Math.max(0, net);
});

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency
  }).format(this.amount / 100); // Assuming amount is in cents
});

// Virtual for isSuccessful
paymentSchema.virtual('isSuccessful').get(function() {
  return this.status === 'completed';
});

// Virtual for isRefundable
paymentSchema.virtual('isRefundable').get(function() {
  if (this.status !== 'completed') return false;
  if (this.refund && this.refund.amount >= this.amount) return false;
  
  // Check if within refund window (30 days)
  const completedDate = this.completedAt || this.createdAt;
  const daysSinceCompletion = (Date.now() - completedDate) / (1000 * 60 * 60 * 24);
  
  return daysSinceCompletion <= 30;
});

// Method to mark as completed
paymentSchema.methods.markAsCompleted = function(providerData = {}) {
  this.status = 'completed';
  this.completedAt = new Date();
  
  if (providerData) {
    this.providerData = { ...this.providerData, ...providerData };
  }
  
  return this.save();
};

// Method to mark as failed
paymentSchema.methods.markAsFailed = function(reason, providerData = {}) {
  this.status = 'failed';
  this.failedAt = new Date();
  this.failureReason = reason;
  
  if (providerData) {
    this.providerData = { ...this.providerData, ...providerData };
  }
  
  return this.save();
};

// Method to process refund
paymentSchema.methods.processRefund = function(amount, reason, processedBy) {
  if (!this.isRefundable) {
    throw new Error('Payment is not refundable');
  }
  
  const refundAmount = amount || (this.amount - (this.refund?.amount || 0));
  
  if (refundAmount <= 0) {
    throw new Error('Invalid refund amount');
  }
  
  if (!this.refund) {
    this.refund = {
      amount: 0,
      reason: '',
      processedAt: null,
      processedBy: null
    };
  }
  
  this.refund.amount += refundAmount;
  this.refund.reason = reason;
  this.refund.processedAt = new Date();
  this.refund.processedBy = processedBy;
  
  if (this.refund.amount >= this.amount) {
    this.status = 'refunded';
  }
  
  return this.save();
};

// Method to add webhook event
paymentSchema.methods.addWebhookEvent = function(event) {
  if (!this.webhookEvents) {
    this.webhookEvents = [];
  }
  
  this.webhookEvents.push({
    eventId: event.id,
    type: event.type,
    receivedAt: new Date(),
    data: event.data
  });
  
  return this.save();
};

// Static method to create subscription payment
paymentSchema.statics.createSubscription = function(userId, plan, amount, providerData) {
  return this.create({
    user: userId,
    type: 'subscription',
    amount,
    currency: 'USD',
    provider: 'stripe',
    providerData,
    description: `Subscription: ${plan} plan`,
    metadata: {
      subscriptionPlan: plan,
      subscriptionPeriod: 'monthly'
    },
    status: 'pending',
    isRecurring: true,
    recurrence: {
      interval: 'monthly',
      intervalCount: 1,
      totalCycles: 12, // 1 year default
      currentCycle: 1
    }
  });
};

// Static method to create streak restore payment
paymentSchema.statics.createStreakRestore = function(userId, streakId, amount) {
  return this.create({
    user: userId,
    type: 'streak_restore',
    amount,
    currency: 'USD',
    provider: 'stripe',
    description: 'Restore broken streak',
    metadata: {
      streakId,
      itemCount: 1
    },
    status: 'pending'
  });
};

// Static method to create challenge entry payment
paymentSchema.statics.createChallengeEntry = function(userId, challengeId, amount) {
  return this.create({
    user: userId,
    type: 'challenge_entry',
    amount,
    currency: 'USD',
    provider: 'stripe',
    description: 'Challenge entry fee',
    metadata: {
      challengeId,
      itemCount: 1
    },
    status: 'pending'
  });
};

// Static method to find successful payments
paymentSchema.statics.findSuccessful = function(userId, options = {}) {
  const query = { user: userId, status: 'completed' };
  
  if (options.type) {
    query.type = options.type;
  }
  
  if (options.since) {
    query.createdAt = { $gte: options.since };
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(options.limit || 50);
};

// Static method to calculate revenue
paymentSchema.statics.calculateRevenue = async function(startDate, endDate) {
  const match = {
    status: 'completed',
    createdAt: { $gte: startDate, $lte: endDate }
  };
  
  const result = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          type: '$type',
          currency: '$currency'
        },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        averageAmount: { $avg: '$amount' }
      }
    },
    {
      $group: {
        _id: '$_id.currency',
        types: {
          $push: {
            type: '$_id.type',
            totalAmount: '$totalAmount',
            count: '$count',
            averageAmount: '$averageAmount'
          }
        },
        totalRevenue: { $sum: '$totalAmount' },
        totalTransactions: { $sum: '$count' }
      }
    }
  ]);
  
  return result;
};

module.exports = mongoose.model('Payment', paymentSchema);