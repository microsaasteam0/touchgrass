const crypto = require('crypto');
const User = require('../models/user');
const Payment = require('../models/Payment');
const Streak = require('../models/Streak');
const Notification = require('../models/Notification');
const emailService = require('./emailService');

class WebhookService {
  constructor() {
    this.secret = process.env.DODO_WEBHOOK_SECRET;
  }

  /**
   * Verify webhook signature
   */
  verifySignature(payload, signature) {
    if (!this.secret) {
      console.warn('⚠️ Webhook secret not configured, skipping verification');
      return true; // For development
    }

    const hmac = crypto.createHmac('sha256', this.secret);
    const expectedSignature = hmac.update(JSON.stringify(payload)).digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Process webhook event
   */
  async processEvent(event) {
    const { type, data, id: eventId } = event;
    
    console.log(`🔔 Processing webhook: ${type}`, { eventId });

    // Check for duplicate events
    const existingEvent = await Payment.findOne({ 'webhook.eventId': eventId });
    if (existingEvent) {
      console.log(`⏭️ Duplicate webhook event skipped: ${eventId}`);
      return { processed: false, reason: 'duplicate' };
    }

    try {
      let result;
      
      switch (type) {
        // Payment Events
        case 'payment.succeeded':
        case 'charge.succeeded':
        case 'payment_intent.succeeded':
          result = await this.handlePaymentSucceeded(data);
          break;
          
        case 'payment.failed':
        case 'charge.failed':
        case 'payment_intent.payment_failed':
          result = await this.handlePaymentFailed(data);
          break;
          
        case 'payment.refunded':
        case 'charge.refunded':
          result = await this.handlePaymentRefunded(data);
          break;
          
        // Subscription Events
        case 'subscription.created':
          result = await this.handleSubscriptionCreated(data);
          break;
          
        case 'subscription.updated':
          result = await this.handleSubscriptionUpdated(data);
          break;
          
        case 'subscription.cancelled':
        case 'subscription.deleted':
          result = await this.handleSubscriptionCancelled(data);
          break;
          
        case 'invoice.paid':
          result = await this.handleInvoicePaid(data);
          break;
          
        case 'invoice.payment_failed':
          result = await this.handleInvoiceFailed(data);
          break;
          
        // Test Events
        case 'ping':
        case 'webhook.test':
          result = await this.handleTestEvent(data);
          break;
          
        default:
          console.log(`⚠️ Unhandled webhook type: ${type}`);
          result = { processed: false, reason: 'unhandled_type' };
      }

      // Log webhook event
      await this.logWebhookEvent(event, result);
      
      return result;

    } catch (error) {
      console.error(`❌ Webhook processing error for ${type}:`, error);
      await this.logWebhookEvent(event, { error: error.message });
      throw error;
    }
  }

  /**
   * Handle successful payment
   */
  async handlePaymentSucceeded(paymentData) {
    const {
      id: paymentId,
      amount,
      currency,
      metadata,
      customer_email,
      customer_name,
      created_at
    } = paymentData;

    console.log(`💰 Payment succeeded: ${paymentId}`, { amount, metadata });

    // Find user
    const user = await User.findById(metadata?.userId);
    if (!user) {
      throw new Error(`User not found: ${metadata?.userId}`);
    }

    // Create payment record
    const payment = new Payment({
      userId: user._id,
      paymentId,
      amount: amount / 100, // Convert from cents
      currency,
      status: 'completed',
      type: metadata?.type || 'streak_restoration',
      metadata: {
        ...metadata,
        customerEmail: customer_email,
        customerName: customer_name
      },
      webhook: {
        receivedAt: new Date(),
        processed: true
      }
    });

    await payment.save();

    // Update user based on payment type
    if (metadata?.type === 'streak_restoration') {
      // Restore streak
      await Streak.findOneAndUpdate(
        { userId: user._id, status: 'broken' },
        {
          status: 'active',
          restoredAt: new Date(),
          restorationPaymentId: paymentId
        }
      );

      // Add freeze token
      await User.findByIdAndUpdate(user._id, {
        $inc: { 'subscription.streakFreezeTokens': 1 }
      });

      // Send restoration email
      await emailService.sendStreakRestoredEmail(user.email, {
        userName: user.displayName,
        paymentAmount: amount / 100,
        paymentDate: new Date(created_at * 1000),
        streakLength: metadata?.streakLength || 0
      });

    } else if (metadata?.type === 'subscription') {
      // Activate subscription
      const planId = metadata.planId || 'premium_monthly';
      const interval = metadata.interval || 'monthly';
      
      const subscriptionEnd = new Date();
      subscriptionEnd.setDate(subscriptionEnd.getDate() + (interval === 'yearly' ? 365 : 30));

      await User.findByIdAndUpdate(user._id, {
        $set: {
          'subscription.active': true,
          'subscription.plan': planId,
          'subscription.currentPeriodEnd': subscriptionEnd,
          'subscription.stripeCustomerId': paymentData.customer,
          'subscription.streakFreezeTokens': 5 // Initial tokens
        }
      });

      // Send subscription confirmation
      await emailService.sendSubscriptionEmail(user.email, {
        userName: user.displayName,
        planName: metadata.planName || 'Premium',
        interval,
        amount: amount / 100,
        nextBillingDate: subscriptionEnd
      });
    }

    // Create notification for user
    await Notification.create({
      userId: user._id,
      type: 'payment_success',
      title: 'Payment Successful',
      message: `Your payment of ${currency.toUpperCase()} ${amount / 100} was processed successfully`,
      data: { paymentId, amount: amount / 100, type: metadata?.type }
    });

    return {
      success: true,
      message: 'Payment processed successfully',
      userId: user._id,
      paymentId,
      type: metadata?.type
    };
  }

  /**
   * Handle failed payment
   */
  async handlePaymentFailed(paymentData) {
    const { id: paymentId, metadata, last_payment_error } = paymentData;

    console.log(`❌ Payment failed: ${paymentId}`, { error: last_payment_error });

    // Create failed payment record
    const payment = new Payment({
      userId: metadata?.userId,
      paymentId,
      amount: paymentData.amount / 100,
      currency: paymentData.currency,
      status: 'failed',
      error: last_payment_error?.message,
      metadata,
      webhook: {
        receivedAt: new Date(),
        processed: true
      }
    });

    await payment.save();

    // Notify user if we have userId
    if (metadata?.userId) {
      await Notification.create({
        userId: metadata.userId,
        type: 'payment_failed',
        title: 'Payment Failed',
        message: `Your payment failed: ${last_payment_error?.message || 'Unknown error'}`,
        data: { paymentId, error: last_payment_error }
      });

      // Send failure email
      const user = await User.findById(metadata.userId);
      if (user) {
        await emailService.sendPaymentFailedEmail(user.email, {
          userName: user.displayName,
          paymentId,
          error: last_payment_error?.message
        });
      }
    }

    return {
      success: false,
      message: 'Payment failed',
      paymentId,
      error: last_payment_error
    };
  }

  /**
   * Handle refund
   */
  async handlePaymentRefunded(refundData) {
    const { id: refundId, payment_intent: paymentId, amount } = refundData;

    console.log(`💸 Refund processed: ${refundId} for payment ${paymentId}`);

    // Update payment status
    await Payment.findOneAndUpdate(
      { paymentId },
      {
        $set: { status: 'refunded' },
        $push: {
          refunds: {
            refundId,
            amount: amount / 100,
            processedAt: new Date()
          }
        }
      }
    );

    // Find user from payment
    const payment = await Payment.findOne({ paymentId });
    if (payment && payment.userId) {
      // Notify user
      await Notification.create({
        userId: payment.userId,
        type: 'payment_refunded',
        title: 'Refund Processed',
        message: `Your refund of ${payment.currency.toUpperCase()} ${amount / 100} has been processed`,
        data: { refundId, paymentId, amount: amount / 100 }
      });

      // Update user subscription if it was a subscription payment
      if (payment.type === 'subscription') {
        await User.findByIdAndUpdate(payment.userId, {
          $set: {
            'subscription.active': false,
            'subscription.plan': 'free'
          }
        });
      }
    }

    return {
      success: true,
      message: 'Refund processed',
      refundId,
      paymentId,
      amount: amount / 100
    };
  }

  /**
   * Handle subscription events
   */
  async handleSubscriptionCreated(subscriptionData) {
    console.log('📝 Subscription created:', subscriptionData.id);
    // Implementation for subscription creation
    return { processed: true, type: 'subscription_created' };
  }

  async handleSubscriptionUpdated(subscriptionData) {
    console.log('🔄 Subscription updated:', subscriptionData.id);
    // Implementation for subscription updates
    return { processed: true, type: 'subscription_updated' };
  }

  async handleSubscriptionCancelled(subscriptionData) {
    const { id: subscriptionId, metadata, canceled_at } = subscriptionData;

    console.log('❌ Subscription cancelled:', subscriptionId);

    // Find user by subscription ID
    const user = await User.findOne({ 'subscription.stripeSubscriptionId': subscriptionId });
    if (user) {
      await User.findByIdAndUpdate(user._id, {
        $set: {
          'subscription.active': false,
          'subscription.cancelledAt': new Date(canceled_at * 1000)
        }
      });

      // Send cancellation email
      await emailService.sendSubscriptionCancelledEmail(user.email, {
        userName: user.displayName,
        cancelledAt: new Date(canceled_at * 1000)
      });
    }

    return {
      success: true,
      message: 'Subscription cancelled',
      subscriptionId,
      userId: user?._id
    };
  }

  /**
   * Handle test events
   */
  async handleTestEvent(data) {
    console.log('🧪 Test webhook received:', data);
    return {
      success: true,
      message: 'Test webhook received',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Log webhook event for debugging
   */
  async logWebhookEvent(event, result) {
    try {
      const WebhookLog = require('../models/WebhookLog');
      
      await WebhookLog.create({
        eventId: event.id,
        type: event.type,
        payload: event,
        result,
        processedAt: new Date(),
        signatureValid: true
      });
    } catch (error) {
      console.error('Failed to log webhook:', error);
    }
  }

  /**
   * Get webhook logs for debugging
   */
  async getWebhookLogs(limit = 50) {
    try {
      const WebhookLog = require('../models/WebhookLog');
      return await WebhookLog.find()
        .sort({ processedAt: -1 })
        .limit(limit)
        .lean();
    } catch (error) {
      console.error('Failed to get webhook logs:', error);
      return [];
    }
  }
}

module.exports = new WebhookService();