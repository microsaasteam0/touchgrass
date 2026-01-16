const Stripe = require('stripe');
const crypto = require('crypto');

/**
 * Stripe Configuration
 * Handles payment processing, subscriptions, and billing
 */

let stripe = null;
let webhookSecret = null;

/**
 * Configure Stripe with environment validation
 */
const configureStripe = () => {
  const {
    STRIPE_SECRET_KEY,
    STRIPE_PUBLISHABLE_KEY,
    STRIPE_WEBHOOK_SECRET,
    NODE_ENV
  } = process.env;

  // Validate required environment variables
  const missingVars = [];
  if (!STRIPE_SECRET_KEY) missingVars.push('STRIPE_SECRET_KEY');
  if (!STRIPE_PUBLISHABLE_KEY) missingVars.push('STRIPE_PUBLISHABLE_KEY');
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Missing Stripe environment variables: ${missingVars.join(', ')}`);
    console.warn('   Payment features will be disabled. Set variables to enable.');
    return null;
  }

  try {
    // Initialize Stripe
    stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      maxNetworkRetries: 3,
      timeout: 30000,
      telemetry: false
    });

    webhookSecret = STRIPE_WEBHOOK_SECRET;

    console.log('✅ Stripe configured successfully');
    console.log(`   Mode: ${NODE_ENV === 'production' ? 'Production' : 'Test'}`);
    console.log(`   Publishable Key: ${STRIPE_PUBLISHABLE_KEY.substring(0, 8)}...`);

    // Test connection
    return testStripeConnection();
  } catch (error) {
    console.error('❌ Stripe configuration failed:', error.message);
    return null;
  }
};

/**
 * Test Stripe connection
 */
const testStripeConnection = async () => {
  try {
    await stripe.balance.retrieve();
    console.log('✅ Stripe connection test passed');
    return stripe;
  } catch (error) {
    console.error('❌ Stripe connection test failed:', error.message);
    return null;
  }
};

/**
 * Product and Price Configuration
 */
const PRODUCTS = {
  // Subscription Plans
  PREMIUM_MONTHLY: {
    name: 'TouchGrass Premium (Monthly)',
    description: 'Monthly subscription with advanced features',
    metadata: {
      type: 'subscription',
      tier: 'premium',
      interval: 'monthly'
    }
  },
  
  PREMIUM_YEARLY: {
    name: 'TouchGrass Premium (Yearly)',
    description: 'Yearly subscription with 2 months free',
    metadata: {
      type: 'subscription',
      tier: 'premium',
      interval: 'yearly'
    }
  },
  
  ELITE_MONTHLY: {
    name: 'TouchGrass Elite (Monthly)',
    description: 'Elite monthly subscription with all features',
    metadata: {
      type: 'subscription',
      tier: 'elite',
      interval: 'monthly'
    }
  },
  
  ELITE_YEARLY: {
    name: 'TouchGrass Elite (Yearly)',
    description: 'Elite yearly subscription with maximum benefits',
    metadata: {
      type: 'subscription',
      tier: 'elite',
      interval: 'yearly'
    }
  },

  // One-time Purchases
  STREAK_FREEZE: {
    name: 'Streak Freeze Token',
    description: 'Save your streak when you miss a day',
    metadata: {
      type: 'consumable',
      category: 'streak_freeze'
    }
  },
  
  SHAME_SKIP: {
    name: 'Shame Skip Token',
    description: 'Skip public shame for one missed day',
    metadata: {
      type: 'consumable',
      category: 'shame_skip'
    }
  },
  
  PROFILE_CUSTOMIZATION: {
    name: 'Profile Customization Pack',
    description: 'Custom themes, badges, and profile effects',
    metadata: {
      type: 'consumable',
      category: 'cosmetic'
    }
  }
};

/**
 * Price Configuration (in cents)
 */
const PRICES = {
  PREMIUM_MONTHLY: 999, // $9.99
  PREMIUM_YEARLY: 9990, // $99.90 ($8.33/month)
  ELITE_MONTHLY: 1999, // $19.99
  ELITE_YEARLY: 19990, // $199.90 ($16.66/month)
  STREAK_FREEZE: 499, // $4.99
  SHAME_SKIP: 299, // $2.99
  PROFILE_CUSTOMIZATION: 799 // $7.99
};

/**
 * Customer Management
 */
const customer = {
  // Create or retrieve customer
  getOrCreate: async (userId, email, name) => {
    try {
      // Check if customer already exists
      const existingCustomers = await stripe.customers.list({
        email,
        limit: 1
      });

      if (existingCustomers.data.length > 0) {
        return existingCustomers.data[0];
      }

      // Create new customer
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          userId,
          source: 'touchgrass-web'
        }
      });

      console.log(`✅ Created Stripe customer: ${customer.id}`);
      return customer;
    } catch (error) {
      console.error('Stripe customer creation error:', error);
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  },

  // Update customer
  update: async (customerId, updates) => {
    try {
      return await stripe.customers.update(customerId, updates);
    } catch (error) {
      console.error('Stripe customer update error:', error);
      throw new Error(`Failed to update customer: ${error.message}`);
    }
  },

  // Get customer's subscriptions
  getSubscriptions: async (customerId) => {
    try {
      return await stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
        expand: ['data.plan.product']
      });
    } catch (error) {
      console.error('Stripe get subscriptions error:', error);
      throw new Error(`Failed to get subscriptions: ${error.message}`);
    }
  },

  // Get customer's payment methods
  getPaymentMethods: async (customerId) => {
    try {
      return await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card'
      });
    } catch (error) {
      console.error('Stripe get payment methods error:', error);
      throw new Error(`Failed to get payment methods: ${error.message}`);
    }
  }
};

/**
 * Subscription Management
 */
const subscription = {
  // Create subscription
  create: async (customerId, priceId, metadata = {}) => {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription'
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          ...metadata,
          createdVia: 'touchgrass-web',
          timestamp: Date.now()
        }
      });

      return {
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end
      };
    } catch (error) {
      console.error('Stripe subscription creation error:', error);
      throw new Error(`Failed to create subscription: ${error.message}`);
    }
  },

  // Cancel subscription
  cancel: async (subscriptionId, cancelAtPeriodEnd = false) => {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: cancelAtPeriodEnd
      });

      return {
        id: subscription.id,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at,
        currentPeriodEnd: subscription.current_period_end
      };
    } catch (error) {
      console.error('Stripe subscription cancellation error:', error);
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }
  },

  // Reactivate subscription
  reactivate: async (subscriptionId) => {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false
      });

      return {
        id: subscription.id,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      };
    } catch (error) {
      console.error('Stripe subscription reactivation error:', error);
      throw new Error(`Failed to reactivate subscription: ${error.message}`);
    }
  },

  // Update subscription
  update: async (subscriptionId, updates) => {
    try {
      return await stripe.subscriptions.update(subscriptionId, updates);
    } catch (error) {
      console.error('Stripe subscription update error:', error);
      throw new Error(`Failed to update subscription: ${error.message}`);
    }
  },

  // Get subscription details
  get: async (subscriptionId) => {
    try {
      return await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['customer', 'latest_invoice']
      });
    } catch (error) {
      console.error('Stripe subscription retrieval error:', error);
      throw new Error(`Failed to get subscription: ${error.message}`);
    }
  }
};

/**
 * Payment Intent Management
 */
const payment = {
  // Create payment intent for one-time purchases
  createIntent: async (customerId, amount, currency = 'usd', metadata = {}) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        customer: customerId,
        metadata,
        automatic_payment_methods: {
          enabled: true
        }
      });

      return {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
        status: paymentIntent.status
      };
    } catch (error) {
      console.error('Stripe payment intent creation error:', error);
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  },

  // Confirm payment
  confirm: async (paymentIntentId) => {
    try {
      return await stripe.paymentIntents.confirm(paymentIntentId);
    } catch (error) {
      console.error('Stripe payment confirmation error:', error);
      throw new Error(`Failed to confirm payment: ${error.message}`);
    }
  },

  // Refund payment
  refund: async (paymentIntentId, reason = 'requested_by_customer') => {
    try {
      return await stripe.refunds.create({
        payment_intent: paymentIntentId,
        reason
      });
    } catch (error) {
      console.error('Stripe refund error:', error);
      throw new Error(`Failed to process refund: ${error.message}`);
    }
  },

  // Get payment details
  get: async (paymentIntentId) => {
    try {
      return await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error('Stripe payment retrieval error:', error);
      throw new Error(`Failed to get payment details: ${error.message}`);
    }
  }
};

/**
 * Webhook Handling
 */
const webhook = {
  // Verify webhook signature
  verifySignature: (payload, signature) => {
    if (!webhookSecret) {
      throw new Error('Webhook secret not configured');
    }

    try {
      return stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
    } catch (error) {
      console.error('Webhook signature verification failed:', error.message);
      throw new Error('Invalid webhook signature');
    }
  },

  // Handle webhook events
  handleEvent: async (event) => {
    const eventHandlers = {
      'customer.subscription.created': handleSubscriptionCreated,
      'customer.subscription.updated': handleSubscriptionUpdated,
      'customer.subscription.deleted': handleSubscriptionDeleted,
      'invoice.payment_succeeded': handlePaymentSucceeded,
      'invoice.payment_failed': handlePaymentFailed,
      'payment_intent.succeeded': handlePaymentIntentSucceeded,
      'payment_intent.payment_failed': handlePaymentIntentFailed,
      'charge.refunded': handleChargeRefunded
    };

    const handler = eventHandlers[event.type];
    if (handler) {
      return await handler(event.data.object);
    }

    console.log(`Unhandled webhook event: ${event.type}`);
    return { handled: false, type: event.type };
  }
};

/**
 * Webhook Event Handlers
 */
const handleSubscriptionCreated = async (subscription) => {
  console.log(`Subscription created: ${subscription.id}`);
  
  // Update user's subscription status in your database
  return {
    event: 'subscription.created',
    subscriptionId: subscription.id,
    customerId: subscription.customer,
    status: subscription.status,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000)
  };
};

const handleSubscriptionUpdated = async (subscription) => {
  console.log(`Subscription updated: ${subscription.id}`);
  
  return {
    event: 'subscription.updated',
    subscriptionId: subscription.id,
    status: subscription.status,
    cancelAtPeriodEnd: subscription.cancel_at_period_end
  };
};

const handleSubscriptionDeleted = async (subscription) => {
  console.log(`Subscription canceled: ${subscription.id}`);
  
  return {
    event: 'subscription.canceled',
    subscriptionId: subscription.id,
    status: subscription.status
  };
};

const handlePaymentSucceeded = async (invoice) => {
  console.log(`Payment succeeded for invoice: ${invoice.id}`);
  
  return {
    event: 'payment.succeeded',
    invoiceId: invoice.id,
    amountPaid: invoice.amount_paid,
    customerId: invoice.customer
  };
};

const handlePaymentFailed = async (invoice) => {
  console.log(`Payment failed for invoice: ${invoice.id}`);
  
  return {
    event: 'payment.failed',
    invoiceId: invoice.id,
    attemptCount: invoice.attempt_count,
    nextPaymentAttempt: invoice.next_payment_attempt
      ? new Date(invoice.next_payment_attempt * 1000)
      : null
  };
};

const handlePaymentIntentSucceeded = async (paymentIntent) => {
  console.log(`Payment intent succeeded: ${paymentIntent.id}`);
  
  return {
    event: 'payment_intent.succeeded',
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    metadata: paymentIntent.metadata
  };
};

const handlePaymentIntentFailed = async (paymentIntent) => {
  console.log(`Payment intent failed: ${paymentIntent.id}`);
  
  return {
    event: 'payment_intent.failed',
    paymentIntentId: paymentIntent.id,
    error: paymentIntent.last_payment_error
  };
};

const handleChargeRefunded = async (charge) => {
  console.log(`Charge refunded: ${charge.id}`);
  
  return {
    event: 'charge.refunded',
    chargeId: charge.id,
    amountRefunded: charge.amount_refunded
  };
};

/**
 * Billing Portal
 */
const billingPortal = {
  // Create customer portal session
  createSession: async (customerId, returnUrl) => {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl
      });

      return {
        url: session.url,
        expiresAt: new Date(session.expires_at * 1000)
      };
    } catch (error) {
      console.error('Stripe billing portal error:', error);
      throw new Error(`Failed to create billing portal session: ${error.message}`);
    }
  }
};

/**
 * Checkout Sessions
 */
const checkout = {
  // Create checkout session for subscription
  createSubscriptionSession: async (customerId, priceId, successUrl, cancelUrl, metadata = {}) => {
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        line_items: [
          {
            price: priceId,
            quantity: 1
          }
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        subscription_data: {
          metadata
        },
        allow_promotion_codes: true
      });

      return {
        sessionId: session.id,
        url: session.url
      };
    } catch (error) {
      console.error('Stripe checkout session error:', error);
      throw new Error(`Failed to create checkout session: ${error.message}`);
    }
  },

  // Create checkout session for one-time purchase
  createPaymentSession: async (customerId, priceId, successUrl, cancelUrl, metadata = {}) => {
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'payment',
        line_items: [
          {
            price: priceId,
            quantity: 1
          }
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata
      });

      return {
        sessionId: session.id,
        url: session.url
      };
    } catch (error) {
      console.error('Stripe checkout session error:', error);
      throw new Error(`Failed to create checkout session: ${error.message}`);
    }
  }
};

/**
 * Utilities
 */
const utils = {
  // Format amount for display
  formatAmount: (amount, currency = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  },

  // Generate unique idempotency key
  generateIdempotencyKey: (prefix = '') => {
    return `${prefix}_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  },

  // Validate price ID
  isValidPriceId: (priceId) => {
    return priceId && priceId.startsWith('price_');
  },

  // Get product name from price ID
  getProductFromPriceId: async (priceId) => {
    try {
      const price = await stripe.prices.retrieve(priceId);
      const product = await stripe.products.retrieve(price.product);
      return product.name;
    } catch (error) {
      console.error('Failed to get product from price ID:', error);
      return null;
    }
  }
};

/**
 * Health check
 */
const checkStripeHealth = async () => {
  if (!stripe) {
    return {
      status: 'unhealthy',
      error: 'Stripe not configured',
      timestamp: new Date().toISOString()
    };
  }

  try {
    await stripe.balance.retrieve();
    
    return {
      status: 'healthy',
      configured: true,
      mode: process.env.NODE_ENV === 'production' ? 'production' : 'test',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

module.exports = {
  configureStripe,
  stripe,
  PRODUCTS,
  PRICES,
  customer,
  subscription,
  payment,
  webhook,
  billingPortal,
  checkout,
  utils,
  checkStripeHealth
};