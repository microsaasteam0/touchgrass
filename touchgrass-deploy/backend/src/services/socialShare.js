const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const User = require('../models/user');
const Streak = require('../models/Streak');
const EmailService = require('./emailService');
const NotificationService = require('./notificationService');

class PaymentService {
  constructor() {
    this.products = {
      premium: {
        stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID,
        name: 'Premium Plan',
        features: [
          'Streak Freeze Tokens',
          'Advanced Analytics',
          'Custom Reminders',
          'Priority Support'
        ]
      },
      elite: {
        stripePriceId: process.env.STRIPE_ELITE_PRICE_ID,
        name: 'Elite Plan',
        features: [
          'Everything in Premium',
          'Unlimited Freeze Tokens',
          'Team Challenges',
          'Early Access Features',
          'Dedicated Support'
        ]
      },
      enterprise: {
        stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
        name: 'Enterprise Plan',
        features: [
          'Custom Branding',
          'API Access',
          'Dedicated Account Manager',
          'SLA Guarantee',
          'Custom Integrations'
        ]
      }
    };

    this.paymentMethods = {
      streak_restoration: {
        amount: 4.99,
        description: 'Streak Restoration',
        type: 'one_time'
      },
      freeze_tokens: {
        amounts: [4.99, 9.99, 19.99],
        description: 'Streak Freeze Tokens',
        type: 'one_time'
      },
      challenge_stake: {
        minAmount: 1.00,
        description: 'Challenge Entry Fee',
        type: 'one_time'
      }
    };
  }

  // Create checkout session for subscription
  async createCheckoutSession(userId, plan, successUrl, cancelUrl) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const product = this.products[plan];
    if (!product) {
      throw new Error('Invalid plan');
    }

    // Check if user already has an active subscription
    if (user.subscription.active && user.subscription.plan !== 'free') {
      throw new Error('User already has an active subscription');
    }

    // Create or retrieve Stripe customer
    let customerId = user.subscription.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.displayName,
        metadata: {
          userId: user._id.toString(),
          username: user.username
        }
      });
      
      customerId = customer.id;
      
      // Save customer ID to user
      await User.findByIdAndUpdate(userId, {
        'subscription.stripeCustomerId': customerId
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price: product.stripePriceId,
        quantity: 1
      }],
      mode: 'subscription',
      subscription_data: {
        metadata: {
          userId: user._id.toString(),
          plan: plan
        }
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: user._id.toString(),
        plan: plan,
        type: 'subscription'
      }
    });

    // Log payment attempt
    await Payment.create({
      userId,
      type: 'subscription',
      plan,
      amount: await this.getPlanAmount(plan),
      currency: 'USD',
      status: 'pending',
      stripeSessionId: session.id,
      metadata: {
        checkoutUrl: session.url,
        plan: plan
      }
    });

    return {
      sessionId: session.id,
      url: session.url
    };
  }

  // Create payment intent for one-time purchases
  async createPaymentIntent(userId, paymentType, amount = null, metadata = {}) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const paymentMethod = this.paymentMethods[paymentType];
    if (!paymentMethod) {
      throw new Error('Invalid payment type');
    }

    // Determine amount
    let finalAmount = amount;
    if (!finalAmount) {
      if (paymentType === 'freeze_tokens') {
        finalAmount = paymentMethod.amounts[0]; // Default to smallest package
      } else if (paymentType === 'streak_restoration') {
        finalAmount = paymentMethod.amount;
      } else if (paymentType === 'challenge_stake') {
        finalAmount = paymentMethod.minAmount;
      }
    }

    // Validate amount
    if (paymentType === 'challenge_stake' && finalAmount < paymentMethod.minAmount) {
      throw new Error(`Minimum stake amount is $${paymentMethod.minAmount}`);
    }

    // Create or retrieve Stripe customer
    let customerId = user.subscription.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.displayName,
        metadata: {
          userId: user._id.toString(),
          username: user.username
        }
      });
      
      customerId = customer.id;
      
      await User.findByIdAndUpdate(userId, {
        'subscription.stripeCustomerId': customerId
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalAmount * 100), // Convert to cents
      currency: 'USD',
      customer: customerId,
      metadata: {
        userId: user._id.toString(),
        type: paymentType,
        ...metadata
      },
      description: paymentMethod.description
    });

    // Log payment attempt
    await Payment.create({
      userId,
      type: paymentType,
      amount: finalAmount,
      currency: 'USD',
      status: 'pending',
      stripePaymentIntentId: paymentIntent.id,
      metadata: {
        ...metadata,
        description: paymentMethod.description
      }
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: finalAmount
    };
  }

  // Handle Stripe webhook events
  async handleWebhookEvent(event) {
    const eventType = event.type;
    const data = event.data.object;

    try {
      switch (eventType) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(data);
          break;
        
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(data);
          break;
        
        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(data);
          break;
        
        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(data);
          break;
        
        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(data);
          break;
        
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(data);
          break;
        
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(data);
          break;
      }

      return { success: true, event: eventType };
    } catch (error) {
      console.error('Webhook handler error:', error);
      throw error;
    }
  }

  async handleCheckoutSessionCompleted(session) {
    const userId = session.metadata.userId;
    const plan = session.metadata.plan;
    const subscriptionId = session.subscription;

    // Update user subscription
    await User.findByIdAndUpdate(userId, {
      'subscription.active': true,
      'subscription.plan': plan,
      'subscription.stripeSubscriptionId': subscriptionId,
      'subscription.currentPeriodEnd': new Date(session.subscription_details.current_period_end * 1000)
    });

    // Update payment record
    await Payment.findOneAndUpdate(
      { stripeSessionId: session.id },
      {
        status: 'completed',
        stripeSubscriptionId: subscriptionId,
        completedAt: new Date()
      }
    );

    // Send welcome email for new subscription
    const user = await User.findById(userId);
    await EmailService.sendPaymentReceipt(user, {
      _id: session.id,
      amount: await this.getPlanAmount(plan),
      createdAt: new Date(),
      plan: plan,
      nextBillingDate: new Date(session.subscription_details.current_period_end * 1000)
    });

    // Send notification
    await NotificationService.sendNotification(userId, {
      type: 'payment_success',
      title: 'Subscription Activated',
      message: `Your ${plan} subscription has been activated!`,
      data: { plan, amount: await this.getPlanAmount(plan) }
    });

    // Award achievement for subscribing
    await this.awardSubscriptionAchievement(userId, plan);
  }

  async handlePaymentIntentSucceeded(paymentIntent) {
    const userId = paymentIntent.metadata.userId;
    const paymentType = paymentIntent.metadata.type;

    // Update payment record
    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      {
        status: 'completed',
        completedAt: new Date()
      }
    );

    // Handle based on payment type
    switch (paymentType) {
      case 'streak_restoration':
        await this.handleStreakRestoration(userId, paymentIntent.metadata);
        break;
      
      case 'freeze_tokens':
        await this.handleFreezeTokensPurchase(userId, paymentIntent.amount / 100, paymentIntent.metadata);
        break;
      
      case 'challenge_stake':
        await this.handleChallengeStake(userId, paymentIntent.amount / 100, paymentIntent.metadata);
        break;
    }

    // Send receipt
    const user = await User.findById(userId);
    await EmailService.sendPaymentReceipt(user, {
      _id: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      createdAt: new Date(),
      type: paymentType,
      description: this.paymentMethods[paymentType]?.description || paymentType
    });
  }

  async handlePaymentIntentFailed(paymentIntent) {
    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      {
        status: 'failed',
        failedAt: new Date(),
        failureReason: paymentIntent.last_payment_error?.message || 'Payment failed'
      }
    );

    // Send failure notification
    const userId = paymentIntent.metadata.userId;
    await NotificationService.sendNotification(userId, {
      type: 'payment_failed',
      title: 'Payment Failed',
      message: 'Your payment could not be processed. Please try again.',
      data: { paymentIntentId: paymentIntent.id }
    });
  }

  async handleInvoicePaymentSucceeded(invoice) {
    const subscriptionId = invoice.subscription;
    const amount = invoice.amount_paid / 100;

    // Find user by subscription
    const user = await User.findOne({
      'subscription.stripeSubscriptionId': subscriptionId
    });

    if (!user) return;

    // Update payment record
    await Payment.create({
      userId: user._id,
      type: 'subscription_renewal',
      amount,
      currency: invoice.currency,
      status: 'completed',
      stripeInvoiceId: invoice.id,
      stripeSubscriptionId: subscriptionId,
      completedAt: new Date()
    });

    // Update subscription period
    await User.findByIdAndUpdate(user._id, {
      'subscription.currentPeriodEnd': new Date(invoice.period_end * 1000)
    });

    // Send receipt
    await EmailService.sendPaymentReceipt(user, {
      _id: invoice.id,
      amount,
      createdAt: new Date(),
      type: 'subscription_renewal',
      description: 'Monthly subscription renewal'
    });
  }

  async handleInvoicePaymentFailed(invoice) {
    const subscriptionId = invoice.subscription;
    
    // Find user by subscription
    const user = await User.findOne({
      'subscription.stripeSubscriptionId': subscriptionId
    });

    if (!user) return;

    // Update payment record
    await Payment.create({
      userId: user._id,
      type: 'subscription_renewal',
      amount: invoice.amount_due / 100,
      currency: invoice.currency,
      status: 'failed',
      stripeInvoiceId: invoice.id,
      stripeSubscriptionId: subscriptionId,
      failureReason: 'Payment failed',
      failedAt: new Date()
    });

    // Send failure notification
    await NotificationService.sendNotification(user._id, {
      type: 'payment_failed',
      title: 'Subscription Payment Failed',
      message: 'We were unable to process your subscription payment. Please update your payment method.',
      data: { invoiceId: invoice.id }
    });

    // Grace period - downgrade after 7 days if payment still failed
    await this.scheduleSubscriptionDowngrade(user._id);
  }

  async handleSubscriptionDeleted(subscription) {
    const user = await User.findOne({
      'subscription.stripeSubscriptionId': subscription.id
    });

    if (!user) return;

    // Downgrade to free plan
    await User.findByIdAndUpdate(user._id, {
      'subscription.active': false,
      'subscription.plan': 'free',
      'subscription.stripeSubscriptionId': null,
      'subscription.currentPeriodEnd': null
    });

    // Send cancellation confirmation
    await NotificationService.sendNotification(user._id, {
      type: 'subscription_cancelled',
      title: 'Subscription Cancelled',
      message: 'Your subscription has been cancelled. You have been downgraded to the free plan.',
      data: { plan: 'free' }
    });
  }

  async handleSubscriptionUpdated(subscription) {
    const user = await User.findOne({
      'subscription.stripeSubscriptionId': subscription.id
    });

    if (!user) return;

    // Update subscription details
    await User.findByIdAndUpdate(user._id, {
      'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000),
      'subscription.status': subscription.status
    });
  }

  // Handle specific payment types
  async handleStreakRestoration(userId, metadata) {
    const streakId = metadata.streakId;
    
    if (!streakId) {
      throw new Error('Streak ID required for restoration');
    }

    // Restore the streak
    const streak = await Streak.findById(streakId);
    if (!streak) {
      throw new Error('Streak not found');
    }

    streak.status = 'active';
    streak.currentStreak += 1; // Increment streak
    streak.history.push({
      date: new Date(),
      verified: false,
      verificationMethod: 'restoration',
      notes: 'Streak restored via payment'
    });
    streak.lastUpdated = new Date();

    await streak.save();

    // Update user stats
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.totalDays': 1 },
      $set: { 'stats.currentStreak': streak.currentStreak }
    });

    // Send restoration confirmation
    await NotificationService.sendNotification(userId, {
      type: 'streak_restored',
      title: 'Streak Restored!',
      message: `Your ${streak.currentStreak}-day streak has been restored.`,
      data: { streakId, currentStreak: streak.currentStreak }
    });
  }

  async handleFreezeTokensPurchase(userId, amount, metadata) {
    const tokenCount = this.calculateTokenCount(amount);
    
    // Add freeze tokens to user's subscription
    await User.findByIdAndUpdate(userId, {
      $inc: { 'subscription.streakFreezeTokens': tokenCount }
    });

    // Send token confirmation
    await NotificationService.sendNotification(userId, {
      type: 'tokens_purchased',
      title: 'Tokens Added',
      message: `${tokenCount} streak freeze tokens have been added to your account.`,
      data: { tokenCount, amount }
    });
  }

  async handleChallengeStake(userId, amount, metadata) {
    const challengeId = metadata.challengeId;
    
    if (!challengeId) {
      throw new Error('Challenge ID required for stake');
    }

    // Store stake in challenge metadata
    // This would be implemented based on your challenge system
    console.log(`User ${userId} staked $${amount} on challenge ${challengeId}`);

    // Send stake confirmation
    await NotificationService.sendNotification(userId, {
      type: 'challenge_stake',
      title: 'Challenge Entry Confirmed',
      message: `You have entered the challenge with a $${amount} stake.`,
      data: { challengeId, amount }
    });
  }

  // Helper methods
  async getPlanAmount(plan) {
    const prices = {
      premium: 14.99,
      elite: 29.99,
      enterprise: 99.99
    };
    
    return prices[plan] || 0;
  }

  calculateTokenCount(amount) {
    const tokenPackages = {
      4.99: 5,   // $4.99 for 5 tokens
      9.99: 12,  // $9.99 for 12 tokens
      19.99: 30  // $19.99 for 30 tokens
    };
    
    return tokenPackages[amount] || Math.floor(amount / 1); // 1 token per $1 default
  }

  async awardSubscriptionAchievement(userId, plan) {
    const achievementName = plan === 'elite' ? 'Elite Member' : 'Premium Member';
    
    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        achievements: {
          name: achievementName,
          earnedAt: new Date(),
          icon: plan === 'elite' ? '👑' : '⭐',
          description: `Subscribed to ${plan} plan`
        }
      }
    });
  }

  async scheduleSubscriptionDowngrade(userId) {
    // Schedule downgrade after 7 days
    setTimeout(async () => {
      const user = await User.findById(userId);
      
      if (user.subscription.active && user.subscription.plan !== 'free') {
        // Check if payment was made in the meantime
        const recentPayment = await Payment.findOne({
          userId,
          type: 'subscription_renewal',
          status: 'completed',
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        });

        if (!recentPayment) {
          // Downgrade to free
          await User.findByIdAndUpdate(userId, {
            'subscription.active': false,
            'subscription.plan': 'free',
            'subscription.currentPeriodEnd': null
          });

          await NotificationService.sendNotification(userId, {
            type: 'subscription_downgraded',
            title: 'Plan Downgraded',
            message: 'Your subscription has been downgraded to the free plan due to payment issues.',
            data: { plan: 'free' }
          });
        }
      }
    }, 7 * 24 * 60 * 60 * 1000); // 7 days
  }

  // Get user's payment history
  async getPaymentHistory(userId, options = {}) {
    const {
      limit = 20,
      offset = 0,
      type = null,
      status = null,
      startDate = null,
      endDate = null
    } = options;

    const query = { userId };
    
    if (type) {
      query.type = type;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    const total = await Payment.countDocuments(query);
    const totalAmount = await Payment.aggregate([
      { $match: { ...query, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    return {
      payments,
      summary: {
        total,
        totalAmount: totalAmount[0]?.total || 0,
        successful: await Payment.countDocuments({ ...query, status: 'completed' }),
        failed: await Payment.countDocuments({ ...query, status: 'failed' })
      },
      pagination: {
        total,
        offset,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get subscription details
  async getSubscriptionDetails(userId) {
    const user = await User.findById(userId).lean();
    
    if (!user.subscription.active || user.subscription.plan === 'free') {
      return {
        active: false,
        plan: 'free',
        features: ['Basic streak tracking', 'Public leaderboard', 'Daily verification']
      };
    }

    const product = this.products[user.subscription.plan];
    
    // Get upcoming invoice from Stripe
    let upcomingInvoice = null;
    if (user.subscription.stripeSubscriptionId) {
      try {
        const invoice = await stripe.invoices.retrieveUpcoming({
          subscription: user.subscription.stripeSubscriptionId
        });
        
        upcomingInvoice = {
          amountDue: invoice.amount_due / 100,
          nextPaymentAttempt: invoice.next_payment_attempt 
            ? new Date(invoice.next_payment_attempt * 1000)
            : null
        };
      } catch (error) {
        console.warn('Failed to retrieve upcoming invoice:', error.message);
      }
    }

    return {
      active: true,
      plan: user.subscription.plan,
      product,
      currentPeriodEnd: user.subscription.currentPeriodEnd,
      stripeSubscriptionId: user.subscription.stripeSubscriptionId,
      streakFreezeTokens: user.subscription.streakFreezeTokens || 0,
      upcomingInvoice,
      canCancel: true,
      canUpgrade: user.subscription.plan !== 'enterprise'
    };
  }

  // Cancel subscription
  async cancelSubscription(userId) {
    const user = await User.findById(userId);
    
    if (!user.subscription.active || !user.subscription.stripeSubscriptionId) {
      throw new Error('No active subscription to cancel');
    }

    // Cancel at period end
    await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    await User.findByIdAndUpdate(userId, {
      'subscription.cancelAtPeriodEnd': true
    });

    return {
      cancelled: true,
      effectiveDate: user.subscription.currentPeriodEnd,
      message: 'Subscription will be cancelled at the end of the billing period'
    };
  }

  // Reactivate subscription
  async reactivateSubscription(userId) {
    const user = await User.findById(userId);
    
    if (!user.subscription.stripeSubscriptionId) {
      throw new Error('No subscription found');
    }

    // Remove cancellation at period end
    await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
      cancel_at_period_end: false
    });

    await User.findByIdAndUpdate(userId, {
      'subscription.cancelAtPeriodEnd': false
    });

    return {
      reactivated: true,
      message: 'Subscription has been reactivated'
    };
  }

  // Update payment method
  async updatePaymentMethod(userId, paymentMethodId) {
    const user = await User.findById(userId);
    
    if (!user.subscription.stripeCustomerId) {
      throw new Error('No customer record found');
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: user.subscription.stripeCustomerId
    });

    // Set as default
    await stripe.customers.update(user.subscription.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });

    return {
      updated: true,
      message: 'Payment method updated successfully'
    };
  }

  // Generate billing portal URL
  async createBillingPortalSession(userId, returnUrl) {
    const user = await User.findById(userId);
    
    if (!user.subscription.stripeCustomerId) {
      throw new Error('No customer record found');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.subscription.stripeCustomerId,
      return_url: returnUrl
    });

    return {
      url: session.url
    };
  }

  // Apply promo code
  async applyPromoCode(userId, promoCode) {
    // Implement promo code validation and application
    // This would typically involve checking against a database of valid promo codes
    
    // For now, return a mock response
    return {
      applied: true,
      discount: 10, // 10% discount
      message: 'Promo code applied successfully'
    };
  }
}

module.exports = new PaymentService();