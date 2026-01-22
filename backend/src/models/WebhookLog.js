const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true
  },
  source: {
    type: String,
    default: 'dodo_payments'
  },
  payload: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  result: {
    type: mongoose.Schema.Types.Mixed
  },
  processedAt: {
    type: Date,
    default: Date.now
  },
  signatureValid: {
    type: Boolean,
    default: true
  },
  error: {
    type: String
  },
  processed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

webhookLogSchema.index({ processedAt: -1 });
webhookLogSchema.index({ eventId: 1, type: 1 });

module.exports = mongoose.model('WebhookLog', webhookLogSchema);