const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const User = require('../models/user');
const Streak = require('../models/Streak');
const Notification = require('../models/Notification');

// @route   POST /api/payments/create-intent
// @desc    Create payment intent
// @access  Private
router.post('/create-intent', auth, [
  check('amount', 'Amount is required').isInt({ min: 50 }), // Minimum $0.50
  check('currency', 'Currency is required').isLength({ min: 3, max: 3 }),
  check('description', 'Description is required').not().isEmpty(),
  check('type', 'Payment type is required').isIn([
    'subscription',
    'streak_restore',
    'streak_freeze',
    'challenge_entry',
    'donation'
  ])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, currency, description, type, metadata = {} } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }

    // Get or create Stripe customer
    let customerId = user.subscription.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.displayName,
        metadata: {
          userId: user.id,
          username: user.username
        }
      });
      
      customerId = customer.id;
      
      // Save customer ID to user
      user.subscription.stripeCustomerId = customerId;
      await user.save();
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: currency.toLowerCase(),
      customer: customerId,
      description: description,
      metadata: {
        type,
        userId: user.id,
        ...metadata
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    });

    // Create payment record
    const payment = new Payment({
      user: user.id,
      type,
      amount,
      currency,
      provider: 'stripe',
      providerData: {
        paymentIntentId: paymentIntent.id,
        customerId: customerId
      },
      description,
      metadata,
      status: 'pending'
    });

    await payment.save();

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
      paymentIntentId: paymentIntent.id
    });

  } catch (err) {
    console.error('Create payment intent error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error creating payment intent'
    });
  }
});

// @route   POST /api/payments/confirm
// @desc    Confirm payment completion
// @access  Private
router.post('/confirm', auth, [
  check('paymentIntentId', 'Payment intent ID is required').not().isEmpty(),
  check('paymentId', 'Payment ID is required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentIntentId, paymentId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return res.status(404).json({
        error: 'PAYMENT_INTENT_NOT_FOUND',
        message: 'Payment intent not found'
      });
    }

    // Get payment record
    const payment = await Payment.findOne({
      _id: paymentId,
      user: req.user.id
    });

    if (!payment) {
      return res.status(404).json({
        error: 'PAYMENT_NOT_FOUND',
        message: 'Payment record not found'
      });
    }

    // Update payment status based on Stripe status
    if (paymentIntent.status === 'succeeded') {
      await payment.markAsCompleted({
        paymentMethodId: paymentIntent.payment_method,
        chargeId: paymentIntent.latest_charge
      });

      // Handle payment type
      await handlePaymentSuccess(payment);

      res.json({
        success: true,
        message: 'Payment completed successfully',
        payment: {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          type: payment.type,
          status: payment.status,
          completedAt: payment.completedAt
        }
      });

    } else if (paymentIntent.status === 'processing') {
      payment.status = 'processing';
      await payment.save();

      res.json({
        success: true,
        message: 'Payment is processing',
        status: 'processing'
      });

    } else if (paymentIntent.status === 'requires_action') {
      res.status(400).json({
        error: 'REQUIRES_ACTION',
        message: 'Payment requires additional action',
        nextAction: paymentIntent.next_action
      });

    } else {
      await payment.markAsFailed(
        `Stripe status: ${paymentIntent.status}`,
        { lastError: paymentIntent.last_payment_error }
      );

      res.status(400).json({
        error: 'PAYMENT_FAILED',
        message: 'Payment failed',
        status: paymentIntent.status
      });
    }

  } catch (err) {
    console.error('Confirm payment error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error confirming payment'
    });
  }
});

// @route   POST /api/payments/subscribe
// @desc    Create subscription
// @access  Private
router.post('/subscribe', auth, [
  check('plan', 'Plan is required').isIn(['basic', 'premium', 'elite']),
  check('paymentMethodId', 'Payment method ID is required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { plan, paymentMethodId } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }

    // Get Stripe customer ID
    let customerId = user.subscription.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.displayName,
        metadata: {
          userId: user.id,
          username: user.username
        }
      });
      
      customerId = customer.id;
      user.subscription.stripeCustomerId = customerId;
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId
    });

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });

    // Plan prices (in cents)
    const planPrices = {
      basic: 499, // $4.99/month
      premium: 999, // $9.99/month
      elite: 1999 // $19.99/month
    };

    const priceId = process.env[`STRIPE_${plan.toUpperCase()}_PRICE_ID`];

    if (!priceId) {
      return res.status(400).json({
        error: 'PLAN_NOT_CONFIGURED',
        message: 'Plan is not configured'
      });
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription'
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: user.id,
        username: user.username,
        plan: plan
      }
    });

    // Update user subscription
    user.subscription.active = true;
    user.subscription.plan = plan;
    user.subscription.stripeSubscriptionId = subscription.id;
    user.subscription.currentPeriodStart = new Date(subscription.current_period_start * 1000);
    user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    
    // Set plan features
    user.subscription.features = getPlanFeatures(plan);
    
    await user.save();

    // Create payment record
    const invoice = subscription.latest_invoice;
    const payment = new Payment({
      user: user.id,
      type: 'subscription',
      amount: invoice.amount_paid,
      currency: invoice.currency,
      provider: 'stripe',
      providerData: {
        paymentIntentId: invoice.payment_intent?.id,
        subscriptionId: subscription.id,
        invoiceId: invoice.id,
        customerId: customerId
      },
      description: `Subscription: ${plan} plan`,
      metadata: {
        subscriptionPlan: plan,
        subscriptionPeriod: 'monthly'
      },
      status: 'completed',
      completedAt: new Date(),
      isRecurring: true,
      recurrence: {
        interval: 'monthly',
        intervalCount: 1,
        totalCycles: 12,
        currentCycle: 1
      }
    });

    await payment.save();

    // Send notification
    await Notification.create({
      user: user.id,
      type: 'payment_success',
      title: 'Subscription Activated',
      message: `Your ${plan} subscription has been activated. Enjoy premium features!`,
      data: {
        paymentId: payment.id,
        plan: plan,
        url: '/subscription',
        action: 'view_subscription'
      },
      priority: 'high',
      channels: ['in_app', 'email']
    });

    res.json({
      success: true,
      message: 'Subscription created successfully',
      subscription: {
        id: subscription.id,
        plan: plan,
        status: subscription.status,
        currentPeriodEnd: user.subscription.currentPeriodEnd,
        features: user.subscription.features
      },
      payment: {
        id: payment.id,
        amount: payment.amount,
        receiptUrl: invoice.hosted_invoice_url
      }
    });

  } catch (err) {
    console.error('Create subscription error:', err);
    
    if (err.type === 'StripeCardError') {
      return res.status(400).json({
        error: 'CARD_ERROR',
        message: err.message
      });
    }

    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error creating subscription'
    });
  }
});

// @route   POST /api/payments/cancel-subscription
// @desc    Cancel subscription
// @access  Private
router.post('/cancel-subscription', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }

    if (!user.subscription.active || !user.subscription.stripeSubscriptionId) {
      return res.status(400).json({
        error: 'NO_ACTIVE_SUBSCRIPTION',
        message: 'No active subscription found'
      });
    }

    // Cancel subscription at period end
    const subscription = await stripe.subscriptions.update(
      user.subscription.stripeSubscriptionId,
      { cancel_at_period_end: true }
    );

    user.subscription.autoRenew = false;
    await user.save();

    // Send notification
    await Notification.create({
      user: user.id,
      type: 'subscription_expiring',
      title: 'Subscription Cancelled',
      message: `Your subscription will end on ${new Date(user.subscription.currentPeriodEnd).toLocaleDateString()}.`,
      data: {
        subscriptionId: subscription.id,
        endsAt: user.subscription.currentPeriodEnd,
        url: '/subscription',
        action: 'renew_subscription'
      },
      priority: 'medium',
      channels: ['in_app', 'email']
    });

    res.json({
      success: true,
      message: 'Subscription will be cancelled at the end of the billing period',
      endsAt: user.subscription.currentPeriodEnd
    });

  } catch (err) {
    console.error('Cancel subscription error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error cancelling subscription'
    });
  }
});

// @route   POST /api/payments/reactivate-subscription
// @desc    Reactivate cancelled subscription
// @access  Private
router.post('/reactivate-subscription', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }

    if (!user.subscription.stripeSubscriptionId) {
      return res.status(400).json({
        error: 'NO_SUBSCRIPTION',
        message: 'No subscription found'
      });
    }

    // Reactivate subscription
    const subscription = await stripe.subscriptions.update(
      user.subscription.stripeSubscriptionId,
      { cancel_at_period_end: false }
    );

    user.subscription.autoRenew = true;
    user.subscription.active = true;
    await user.save();

    res.json({
      success: true,
      message: 'Subscription reactivated successfully',
      subscription: {
        id: subscription.id,
        plan: user.subscription.plan,
        status: subscription.status,
        autoRenew: true
      }
    });

  } catch (err) {
    console.error('Reactivate subscription error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error reactivating subscription'
    });
  }
});

// @route   GET /api/payments/invoices
// @desc    Get payment invoices
// @access  Private
router.get('/invoices', auth, async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }

    // Get payments from database
    const payments = await Payment.findSuccessful(req.user.id, {
      limit: parseInt(limit),
      since: req.query.since ? new Date(req.query.since) : undefined
    });

    // If user has Stripe customer, get invoices from Stripe
    let stripeInvoices = [];
    if (user.subscription.stripeCustomerId) {
      try {
        const invoices = await stripe.invoices.list({
          customer: user.subscription.stripeCustomerId,
          limit: parseInt(limit)
        });
        stripeInvoices = invoices.data;
      } catch (stripeErr) {
        console.error('Stripe invoices error:', stripeErr);
      }
    }

    res.json({
      success: true,
      payments: payments.map(payment => ({
        id: payment.id,
        date: payment.createdAt,
        amount: payment.amount,
        currency: payment.currency,
        type: payment.type,
        description: payment.description,
        status: payment.status,
        receiptUrl: payment.providerData.receiptUrl
      })),
      stripeInvoices: stripeInvoices.map(invoice => ({
        id: invoice.id,
        date: new Date(invoice.created * 1000),
        amount: invoice.amount_paid,
        currency: invoice.currency,
        description: invoice.description,
        status: invoice.status,
        receiptUrl: invoice.hosted_invoice_url,
        invoicePdf: invoice.invoice_pdf
      })),
      pagination: {
        total: payments.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: payments.length === parseInt(limit)
      }
    });

  } catch (err) {
    console.error('Get invoices error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   GET /api/payments/subscription
// @desc    Get current subscription
// @access  Private
router.get('/subscription', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }

    let stripeSubscription = null;
    
    if (user.subscription.stripeSubscriptionId) {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(
          user.subscription.stripeSubscriptionId
        );
      } catch (stripeErr) {
        console.error('Stripe subscription error:', stripeErr);
      }
    }

    res.json({
      success: true,
      subscription: {
        active: user.subscription.active,
        plan: user.subscription.plan,
        autoRenew: user.subscription.autoRenew,
        currentPeriodStart: user.subscription.currentPeriodStart,
        currentPeriodEnd: user.subscription.currentPeriodEnd,
        features: user.subscription.features,
        stripe: stripeSubscription ? {
          id: stripeSubscription.id,
          status: stripeSubscription.status,
          cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
          currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000)
        } : null
      }
    });

  } catch (err) {
    console.error('Get subscription error:', err);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Server error'
    });
  }
});

// @route   POST /api/payments/webhook
// @desc    Stripe webhook handler
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object);
      break;
      
    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object);
      break;
      
    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(event.data.object);
      break;
      
    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object);
      break;
      
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
      
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Helper function to handle payment success
async function handlePaymentSuccess(payment) {
  const { type, metadata, user } = payment;

  switch (type) {
    case 'streak_restore':
      // Restore user's streak
      const streak = await Streak.findOne({ userId: user });
      if (streak) {
        streak.status = 'active';
        streak.currentStreak = 1;
        await streak.save();
        
        // Update user stats
        const userDoc = await User.findById(user);
        userDoc.stats.currentStreak = 1;
        await userDoc.save();
      }
      break;
      
    case 'streak_freeze':
      // Add freeze tokens to user
      const userDoc = await User.findById(user);
      userDoc.subscription.features.streakFreezeTokens += 1;
      await userDoc.save();
      break;
      
    case 'challenge_entry':
      // Handle challenge entry
      // This would update the challenge participant status
      break;
  }

  // Send notification
  await Notification.create({
    user: user,
    type: 'payment_success',
    title: 'Payment Successful',
    message: `Your ${type.replace('_', ' ')} payment was successful.`,
    data: {
      paymentId: payment.id,
      type: type,
      url: '/payments',
      action: 'view_payment'
    },
    priority: 'medium',
    channels: ['in_app']
  });
}

// Helper function to get plan features
function getPlanFeatures(plan) {
  const features = {
    basic: {
      streakFreezeTokens: 1,
      customThemes: false,
      advancedAnalytics: false,
      prioritySupport: false,
      adFree: true
    },
    premium: {
      streakFreezeTokens: 3,
      customThemes: true,
      advancedAnalytics: true,
      prioritySupport: false,
      adFree: true
    },
    elite: {
      streakFreezeTokens: 10,
      customThemes: true,
      advancedAnalytics: true,
      prioritySupport: true,
      adFree: true
    }
  };
  
  return features[plan] || features.basic;
}

// Stripe webhook handlers
async function handlePaymentIntentSucceeded(paymentIntent) {
  const payment = await Payment.findOne({
    'providerData.paymentIntentId': paymentIntent.id
  });
  
  if (payment) {
    await payment.markAsCompleted({
      paymentMethodId: paymentIntent.payment_method,
      chargeId: paymentIntent.latest_charge
    });
    await handlePaymentSuccess(payment);
  }
}

async function handlePaymentIntentFailed(paymentIntent) {
  const payment = await Payment.findOne({
    'providerData.paymentIntentId': paymentIntent.id
  });
  
  if (payment) {
    await payment.markAsFailed(
      `Stripe failure: ${paymentIntent.last_payment_error?.message || 'Unknown'}`,
      { lastError: paymentIntent.last_payment_error }
    );
  }
}

async function handleInvoicePaymentSucceeded(invoice) {
  const subscriptionId = invoice.subscription;
  const user = await User.findOne({
    'subscription.stripeSubscriptionId': subscriptionId
  });
  
  if (user) {
    // Update subscription period
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    user.subscription.currentPeriodStart = new Date(subscription.current_period_start * 1000);
    user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    await user.save();
    
    // Create payment record
    const payment = new Payment({
      user: user.id,
      type: 'subscription',
      amount: invoice.amount_paid,
      currency: invoice.currency,
      provider: 'stripe',
      providerData: {
        subscriptionId: subscriptionId,
        invoiceId: invoice.id,
        customerId: invoice.customer
      },
      description: `Subscription renewal: ${user.subscription.plan} plan`,
      metadata: {
        subscriptionPlan: user.subscription.plan,
        subscriptionPeriod: 'monthly'
      },
      status: 'completed',
      completedAt: new Date(),
      isRecurring: true
    });
    
    await payment.save();
  }
}

async function handleInvoicePaymentFailed(invoice) {
  const user = await User.findOne({
    'subscription.stripeSubscriptionId': invoice.subscription
  });
  
  if (user) {
    await Notification.create({
      user: user.id,
      type: 'payment_failed',
      title: 'Payment Failed',
      message: 'Your subscription payment failed. Please update your payment method.',
      data: {
        invoiceId: invoice.id,
        url: '/subscription',
        action: 'update_payment'
      },
      priority: 'high',
      channels: ['in_app', 'email']
    });
  }
}

async function handleSubscriptionUpdated(subscription) {
  const user = await User.findOne({
    'subscription.stripeSubscriptionId': subscription.id
  });
  
  if (user) {
    user.subscription.active = subscription.status === 'active';
    user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    user.subscription.autoRenew = !subscription.cancel_at_period_end;
    await user.save();
  }
}

async function handleSubscriptionDeleted(subscription) {
  const user = await User.findOne({
    'subscription.stripeSubscriptionId': subscription.id
  });
  
  if (user) {
    user.subscription.active = false;
    user.subscription.plan = 'free';
    user.subscription.stripeSubscriptionId = null;
    user.subscription.features = getPlanFeatures('free');
    await user.save();
    
    await Notification.create({
      user: user.id,
      type: 'subscription_expiring',
      title: 'Subscription Ended',
      message: 'Your subscription has ended. You have been downgraded to the free plan.',
      data: {
        url: '/subscription',
        action: 'renew_subscription'
      },
      priority: 'medium',
      channels: ['in_app', 'email']
    });
  }
}

module.exports = router;