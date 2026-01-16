const stripe = require('../config/stripe');
const User = require('../models/user');
const Payment = require('../models/Payment');
const { redis } = require('../config/redis');
const { sendEmail } = require('../services/emailService');
const { SUBSCRIPTION_PLANS, ERROR_CODES, API_MESSAGES } = require('../config/constants');

/**
 * Payments Controller
 * Handles subscription management, one-time purchases, and billing
 */

class PaymentsController {
  /**
   * Create checkout session for subscription
   */
  async createSubscriptionCheckout(req, res) {
    try {
      const userId = req.userId;
      const { priceId, successUrl, cancelUrl } = req.body;

      // Validate price ID
      if (!stripe.utils.isValidPriceId(priceId)) {
        return res.status(400).json({
          error: 'Invalid price ID',
          code: ERROR_CODES.VALIDATION_FAILED
        });
      }

      // Get user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      // Get or create Stripe customer
      let customer;
      if (user.subscription.stripeCustomerId) {
        customer = await stripe.customer.get(user.subscription.stripeCustomerId);
      } else {
        customer = await stripe.customer.getOrCreate(
          userId,
          user.email,
          user.displayName
        );
        
        // Save customer ID to user
        user.subscription.stripeCustomerId = customer.id;
        await user.save();
      }

      // Determine subscription tier from price ID
      const productName = await stripe.utils.getProductFromPriceId(priceId);
      const tier = productName?.includes('Elite') ? 'elite' : 'premium';
      const interval = productName?.includes('Yearly') ? 'yearly' : 'monthly';

      // Create checkout session
      const session = await stripe.checkout.createSubscriptionSession(
        customer.id,
        priceId,
        successUrl,
        cancelUrl,
        {
          userId: userId.toString(),
          tier,
          interval
        }
      );

      // Track checkout initiation
      await redis.cache.increment('analytics:checkouts:subscription');

      res.json({
        message: 'Checkout session created',
        sessionId: session.sessionId,
        url: session.url
      });
    } catch (error) {
      console.error('Create subscription checkout error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Create checkout session for one-time purchase
   */
  async createPaymentCheckout(req, res) {
    try {
      const userId = req.userId;
      const { priceId, successUrl, cancelUrl, productType } = req.body;

      // Validate price ID
      if (!stripe.utils.isValidPriceId(priceId)) {
        return res.status(400).json({
          error: 'Invalid price ID',
          code: ERROR_CODES.VALIDATION_FAILED
        });
      }

      // Get user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      // Get or create Stripe customer
      let customer;
      if (user.subscription.stripeCustomerId) {
        customer = await stripe.customer.get(user.subscription.stripeCustomerId);
      } else {
        customer = await stripe.customer.getOrCreate(
          userId,
          user.email,
          user.displayName
        );
        
        user.subscription.stripeCustomerId = customer.id;
        await user.save();
      }

      // Create checkout session
      const session = await stripe.checkout.createPaymentSession(
        customer.id,
        priceId,
        successUrl,
        cancelUrl,
        {
          userId: userId.toString(),
          productType: productType || 'streak_freeze'
        }
      );

      // Track checkout initiation
      await redis.cache.increment('analytics:checkouts:payment');

      res.json({
        message: 'Checkout session created',
        sessionId: session.sessionId,
        url: session.url
      });
    } catch (error) {
      console.error('Create payment checkout error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Create billing portal session
   */
  async createBillingPortalSession(req, res) {
    try {
      const userId = req.userId;
      const { returnUrl } = req.body;

      // Get user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      // Check if user has Stripe customer ID
      if (!user.subscription.stripeCustomerId) {
        return res.status(400).json({
          error: 'No billing account found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      // Create billing portal session
      const session = await stripe.billingPortal.createSession(
        user.subscription.stripeCustomerId,
        returnUrl
      );

      res.json({
        message: 'Billing portal session created',
        url: session.url
      });
    } catch (error) {
      console.error('Create billing portal error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Get user's subscription details
   */
  async getSubscriptionDetails(req, res) {
    try {
      const userId = req.userId;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      // If user has Stripe customer ID, fetch details from Stripe
      let stripeDetails = null;
      if (user.subscription.stripeCustomerId) {
        try {
          const subscriptions = await stripe.customer.getSubscriptions(
            user.subscription.stripeCustomerId
          );

          const paymentMethods = await stripe.customer.getPaymentMethods(
            user.subscription.stripeCustomerId
          );

          stripeDetails = {
            subscriptions: subscriptions.data.map(sub => ({
              id: sub.id,
              status: sub.status,
              currentPeriodEnd: new Date(sub.current_period_end * 1000),
              cancelAtPeriodEnd: sub.cancel_at_period_end,
              plan: sub.plan?.product?.name || 'Unknown'
            })),
            paymentMethods: paymentMethods.data.map(pm => ({
              id: pm.id,
              type: pm.type,
              brand: pm.card?.brand,
              last4: pm.card?.last4,
              expMonth: pm.card?.exp_month,
              expYear: pm.card?.exp_year
            }))
          };
        } catch (error) {
          console.warn('Failed to fetch Stripe details:', error.message);
        }
      }

      // Get payment history
      const payments = await Payment.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

      res.json({
        message: API_MESSAGES.SUCCESS,
        subscription: {
          plan: user.subscription.plan,
          active: user.subscription.active,
          currentPeriodEnd: user.subscription.currentPeriodEnd,
          streakFreezeTokens: user.subscription.streakFreezeTokens,
          features: SUBSCRIPTION_PLANS[user.subscription.plan.toUpperCase()]?.features || []
        },
        stripeDetails,
        paymentHistory: payments,
        limits: SUBSCRIPTION_PLANS[user.subscription.plan.toUpperCase()]?.limits || {}
      });
    } catch (error) {
      console.error('Get subscription details error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Update subscription (upgrade/downgrade)
   */
  async updateSubscription(req, res) {
    try {
      const userId = req.userId;
      const { newPlan, priceId } = req.body;

      // Validate new plan
      const validPlans = ['free', 'premium', 'elite'];
      if (!validPlans.includes(newPlan)) {
        return res.status(400).json({
          error: 'Invalid plan',
          code: ERROR_CODES.VALIDATION_FAILED
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      // If upgrading to paid plan, require priceId
      if (newPlan !== 'free' && !priceId) {
        return res.status(400).json({
          error: 'Price ID required for paid plans',
          code: ERROR_CODES.VALIDATION_FAILED
        });
      }

      // If downgrading to free
      if (newPlan === 'free') {
        user.subscription = {
          plan: 'free',
          active: false,
          currentPeriodEnd: null,
          stripeCustomerId: user.subscription.stripeCustomerId,
          streakFreezeTokens: 0
        };

        await user.save();

        // Send downgrade email
        await sendEmail({
          to: user.email,
          subject: 'Subscription Downgraded to Free',
          template: 'subscription_downgraded',
          data: {
            name: user.displayName,
            oldPlan: user.subscription.plan,
            newPlan: 'free'
          }
        });

        return res.json({
          message: 'Subscription downgraded to free',
          subscription: user.subscription
        });
      }

      // For paid plans, create checkout session
      const successUrl = `${process.env.FRONTEND_URL}/subscription/success`;
      const cancelUrl = `${process.env.FRONTEND_URL}/subscription`;

      const session = await this.createSubscriptionCheckout(req, res);
      return session;
    } catch (error) {
      console.error('Update subscription error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(req, res) {
    try {
      const userId = req.userId;
      const { cancelAtPeriodEnd = true } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      // Check if user has active subscription
      if (!user.subscription.active || user.subscription.plan === 'free') {
        return res.status(400).json({
          error: 'No active subscription to cancel',
          code: ERROR_CODES.PAYMENT_REQUIRED
        });
      }

      // Get active subscription from Stripe
      const subscriptions = await stripe.customer.getSubscriptions(
        user.subscription.stripeCustomerId
      );

      const activeSubscription = subscriptions.data.find(
        sub => sub.status === 'active' || sub.status === 'trialing'
      );

      if (!activeSubscription) {
        return res.status(404).json({
          error: 'No active subscription found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      // Cancel subscription
      const result = await stripe.subscription.cancel(
        activeSubscription.id,
        cancelAtPeriodEnd
      );

      // Update user record
      user.subscription.active = !cancelAtPeriodEnd;
      if (cancelAtPeriodEnd) {
        user.subscription.currentPeriodEnd = new Date(result.currentPeriodEnd * 1000);
      }

      await user.save();

      // Send cancellation email
      await sendEmail({
        to: user.email,
        subject: `Subscription ${cancelAtPeriodEnd ? 'Scheduled for Cancellation' : 'Cancelled'}`,
        template: 'subscription_cancelled',
        data: {
          name: user.displayName,
          plan: user.subscription.plan,
          cancelAtPeriodEnd,
          currentPeriodEnd: user.subscription.currentPeriodEnd
        }
      });

      res.json({
        message: cancelAtPeriodEnd 
          ? 'Subscription scheduled for cancellation at period end'
          : 'Subscription cancelled immediately',
        subscription: user.subscription,
        stripeResult: result
      });
    } catch (error) {
      console.error('Cancel subscription error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Reactivate subscription
   */
  async reactivateSubscription(req, res) {
    try {
      const userId = req.userId;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      // Get cancelled subscription from Stripe
      const subscriptions = await stripe.customer.getSubscriptions(
        user.subscription.stripeCustomerId
      );

      const cancelledSubscription = subscriptions.data.find(
        sub => sub.status === 'canceled' || sub.cancel_at_period_end
      );

      if (!cancelledSubscription) {
        return res.status(404).json({
          error: 'No cancelled subscription found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      // Reactivate subscription
      const result = await stripe.subscription.reactivate(
        cancelledSubscription.id
      );

      // Update user record
      user.subscription.active = true;
      user.subscription.currentPeriodEnd = new Date(result.current_period_end * 1000);
      await user.save();

      // Send reactivation email
      await sendEmail({
        to: user.email,
        subject: 'Subscription Reactivated',
        template: 'subscription_reactivated',
        data: {
          name: user.displayName,
          plan: user.subscription.plan
        }
      });

      res.json({
        message: 'Subscription reactivated',
        subscription: user.subscription,
        stripeResult: result
      });
    } catch (error) {
      console.error('Reactivate subscription error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Purchase streak freeze tokens
   */
  async purchaseStreakFreeze(req, res) {
    try {
      const userId = req.userId;
      const { quantity = 1 } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      // Calculate price
      const pricePerToken = stripe.PRICES.STREAK_FREEZE;
      const totalAmount = pricePerToken * quantity;

      // Create payment intent
      const paymentIntent = await stripe.payment.createIntent(
        user.subscription.stripeCustomerId || `temp_${userId}`,
        totalAmount,
        'usd',
        {
          userId: userId.toString(),
          productType: 'streak_freeze',
          quantity
        }
      );

      // Create payment record
      const payment = new Payment({
        userId,
        amount: totalAmount,
        currency: 'usd',
        description: `${quantity} Streak Freeze Token${quantity > 1 ? 's' : ''}`,
        metadata: {
          productType: 'streak_freeze',
          quantity,
          priceId: 'price_streak_freeze'
        },
        status: 'pending'
      });

      await payment.save();

      res.json({
        message: 'Payment intent created',
        clientSecret: paymentIntent.clientSecret,
        paymentId: payment._id,
        amount: totalAmount,
        quantity
      });
    } catch (error) {
      console.error('Purchase streak freeze error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Confirm payment and deliver tokens
   */
  async confirmPayment(req, res) {
    try {
      const userId = req.userId;
      const { paymentIntentId, paymentId } = req.body;

      // Verify payment intent
      const paymentIntent = await stripe.payment.get(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          error: 'Payment not successful',
          code: ERROR_CODES.PAYMENT_FAILED
        });
      }

      // Update payment record
      const payment = await Payment.findByIdAndUpdate(
        paymentId,
        {
          status: 'completed',
          stripePaymentIntentId: paymentIntentId,
          completedAt: new Date()
        },
        { new: true }
      );

      if (!payment) {
        return res.status(404).json({
          error: 'Payment record not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      // Deliver purchased items
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          code: ERROR_CODES.RESOURCE_NOT_FOUND
        });
      }

      switch (payment.metadata.productType) {
        case 'streak_freeze':
          user.subscription.streakFreezeTokens += payment.metadata.quantity;
          break;
        
        case 'shame_skip':
          // Add shame skip tokens
          if (!user.shameSkipTokens) user.shameSkipTokens = 0;
          user.shameSkipTokens += payment.metadata.quantity;
          break;
        
        case 'cosmetic':
          // Unlock cosmetic items
          if (!user.unlockedCosmetics) user.unlockedCosmetics = [];
          user.unlockedCosmetics.push(payment.metadata.itemId);
          break;
      }

      await user.save();

      // Send purchase confirmation email
      await sendEmail({
        to: user.email,
        subject: 'Purchase Confirmed',
        template: 'purchase_confirmed',
        data: {
          name: user.displayName,
          product: payment.description,
          amount: stripe.utils.formatAmount(payment.amount, payment.currency)
        }
      });

      // Track purchase analytics
      await redis.cache.increment('analytics:purchases:total');
      await redis.cache.increment(`analytics:purchases:${payment.metadata.productType}`);

      res.json({
        message: 'Payment confirmed and items delivered',
        payment,
        user: {
          streakFreezeTokens: user.subscription.streakFreezeTokens,
          shameSkipTokens: user.shameSkipTokens,
          unlockedCosmetics: user.unlockedCosmetics
        }
      });
    } catch (error) {
      console.error('Confirm payment error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(req, res) {
    try {
      const userId = req.userId;
      const { page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      const payments = await Payment.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const total = await Payment.countDocuments({ userId });

      // Get total spent
      const totalSpent = await Payment.aggregate([
        { $match: { userId, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      res.json({
        message: API_MESSAGES.SUCCESS,
        payments,
        summary: {
          totalSpent: totalSpent[0]?.total || 0,
          totalPayments: total,
          successfulPayments: await Payment.countDocuments({ userId, status: 'completed' })
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get payment history error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Get pricing plans
   */
  async getPricingPlans(req, res) {
    try {
      const plans = Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => ({
        id: key.toLowerCase(),
        name: plan.name,
        price: plan.price,
        interval: plan.interval,
        features: plan.features,
        limits: plan.limits,
        popular: key === 'PREMIUM' // Mark premium as popular
      }));

      // Add one-time purchase options
      const oneTimePurchases = [
        {
          id: 'streak_freeze',
          name: 'Streak Freeze Token',
          price: stripe.utils.formatAmount(stripe.PRICES.STREAK_FREEZE, 'usd'),
          description: 'Save your streak when you miss a day',
          quantity: 1
        },
        {
          id: 'shame_skip',
          name: 'Shame Skip Token',
          price: stripe.utils.formatAmount(stripe.PRICES.SHAME_SKIP, 'usd'),
          description: 'Skip public shame for one missed day',
          quantity: 1
        }
      ];

      res.json({
        message: API_MESSAGES.SUCCESS,
        subscriptionPlans: plans,
        oneTimePurchases,
        currency: 'USD',
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get pricing plans error:', error);
      res.status(500).json({
        error: API_MESSAGES.SERVER_ERROR,
        code: ERROR_CODES.SERVER_ERROR
      });
    }
  }

  /**
   * Handle Stripe webhook
   */
  async handleWebhook(req, res) {
    try {
      const sig = req.headers['stripe-signature'];
      const payload = req.body;

      // Verify webhook signature
      const event = stripe.webhook.verifySignature(payload, sig);

      // Handle event
      const result = await stripe.webhook.handleEvent(event);

      // Log webhook
      await redis.cache.set(
        `webhook:${event.id}`,
        {
          type: event.type,
          result,
          timestamp: new Date().toISOString()
        },
        7 * 24 * 60 * 60 // 7 days
      );

      // Update user based on event type
      await this.updateUserFromWebhook(event);

      res.json({ received: true, handled: result.handled });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).json({
        error: `Webhook Error: ${error.message}`,
        code: ERROR_CODES.EXTERNAL_SERVICE_ERROR
      });
    }
  }

  /**
   * Update user based on webhook event
   */
  async updateUserFromWebhook(event) {
    try {
      const data = event.data.object;

      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(data);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionCancellation(data);
          break;

        case 'invoice.payment_succeeded':
          await this.handlePaymentSuccess(data);
          break;

        case 'invoice.payment_failed':
          await this.handlePaymentFailure(data);
          break;
      }
    } catch (error) {
      console.error('Update user from webhook error:', error);
    }
  }

  /**
   * Handle subscription update
   */
  async handleSubscriptionUpdate(subscription) {
    const customerId = subscription.customer;
    
    // Find user by Stripe customer ID
    const user = await User.findOne({ 'subscription.stripeCustomerId': customerId });
    if (!user) return;

    const plan = subscription.items.data[0]?.plan?.product?.name;
    const tier = plan?.includes('Elite') ? 'elite' : 'premium';

    user.subscription = {
      plan: tier,
      active: subscription.status === 'active',
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      stripeCustomerId: customerId,
      streakFreezeTokens: user.subscription.streakFreezeTokens || 0
    };

    await user.save();

    // Send subscription update email
    await sendEmail({
      to: user.email,
      subject: 'Subscription Updated',
      template: 'subscription_updated',
      data: {
        name: user.displayName,
        plan: tier,
        status: subscription.status,
        currentPeriodEnd: user.subscription.currentPeriodEnd
      }
    });
  }

  /**
   * Handle subscription cancellation
   */
  async handleSubscriptionCancellation(subscription) {
    const customerId = subscription.customer;
    
    const user = await User.findOne({ 'subscription.stripeCustomerId': customerId });
    if (!user) return;

    user.subscription.active = false;
    user.subscription.plan = 'free';
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Subscription Ended',
      template: 'subscription_ended',
      data: {
        name: user.displayName,
        oldPlan: user.subscription.plan
      }
    });
  }

  /**
   * Handle payment success
   */
  async handlePaymentSuccess(invoice) {
    const customerId = invoice.customer;
    
    const user = await User.findOne({ 'subscription.stripeCustomerId': customerId });
    if (!user) return;

    // Create payment record
    const payment = new Payment({
      userId: user._id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      description: invoice.description || 'Subscription payment',
      stripeInvoiceId: invoice.id,
      status: 'completed',
      completedAt: new Date()
    });

    await payment.save();

    // Award loyalty points or bonuses
    await redis.cache.increment(`user:${user._id}:loyalty_points`, 10);
  }

  /**
   * Handle payment failure
   */
  async handlePaymentFailure(invoice) {
    const customerId = invoice.customer;
    
    const user = await User.findOne({ 'subscription.stripeCustomerId': customerId });
    if (!user) return;

    await sendEmail({
      to: user.email,
      subject: 'Payment Failed',
      template: 'payment_failed',
      data: {
        name: user.displayName,
        amount: stripe.utils.formatAmount(invoice.amount_due, invoice.currency),
        nextAttempt: invoice.next_payment_attempt 
          ? new Date(invoice.next_payment_attempt * 1000)
          : null
      }
    });
  }
}

module.exports = new PaymentsController();