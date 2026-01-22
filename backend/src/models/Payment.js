const mongoose = require('mongoose');

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
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['streak_restoration', 'subscription', 'freeze_tokens', 'custom'],
    required: true
  },
  provider: {
    type: String,
    default: 'dodo',
    enum: ['dodo', 'stripe', 'razorpay', 'paypal', 'manual']
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  refunds: [{
    refundId: String,
    amount: Number,
    reason: String,
    processedAt: Date
  }],
  error: {
    type: String
  },
  processedAt: {
    type: Date
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for faster queries
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ type: 1, provider: 1 });
paymentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired payments

module.exports = mongoose.model('Payment', paymentSchema);