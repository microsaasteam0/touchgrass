const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const dodoPayments = require('../services/dodopayment');
const User = require('../models/user');
const Streak = require('../models/Streak');
const Payment = require('../models/Payment');

/**
 * @route   GET /api/payments/products
 * @desc    Get available payment products
 * @access  Public
 */
router.get('/products', (req, res) => {
  try {
    const products = dodoPayments.getProducts();
    
    res.json({
      success: true,
      products,
      currency: 'USD',
      paymentProvider: 'Dodo Payments',
      mode: process.env.NODE_ENV === 'development' ? 'test' : 'live'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

/**
 * @route   GET /api/payments/checkout/:productType
 * @desc    Get checkout link for a product
 * @access  Private
 */
router.get('/checkout/:productType', auth, async (req, res) => {
  try {
    const { productType } = req.params;
    const validProducts = ['pro', 'enterprise', 'streak_restoration'];
    
    if (!validProducts.includes(productType)) {
      return res.status(400).json({ 
        error: 'Invalid product type',
        validProducts 
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // For streak restoration, check if user has broken streak
    if (productType === 'streak_restoration') {
      const streak = await Streak.findOne({ userId: req.user.id, status: 'broken' });
      if (!streak) {
        return res.status(400).json({ 
          error: 'No broken streak found',
          message: 'Your streak is still active'
        });
      }
    }

    // Get checkout URL from Dodo
    const checkoutData = dodoPayments.getCheckoutUrl(productType, req.user.id, {
      email: user.email,
      userName: user.displayName,
      userAvatar: user.avatar,
      streakLength: productType === 'streak_restoration' ? user.stats?.currentStreak : null
    });

    res.json({
      success: true,
      message: `Checkout URL for ${productType} created`,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName
      },
      ...checkoutData
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create checkout' });
  }
});

/**
 * @route   POST /api/payments/verify
 * @desc    Verify a payment (called from frontend after payment)
 * @access  Private
 */
router.post('/verify', auth, [
  check('paymentId').isString(),
  check('productType').isIn(['pro', 'enterprise', 'streak_restoration']),
  check('amount').isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentId, productType, amount, metadata = {} } = req.body;
    const user = await User.findById(req.user.id);

    // Verify payment with Dodo
    const verification = await dodoPayments.verifyPayment(paymentId);
    
    if (!verification.success) {
      return res.status(400).json({ 
        error: 'Payment verification failed',
        details: verification
      });
    }

    // Create payment record
    const payment = new Payment({
      userId: req.user.id,
      paymentId,
      amount: amount || dodoPayments.getPrices()[productType] || 0,
      currency: 'USD',
      status: 'completed',
      type: productType,
      provider: 'dodo',
      metadata: {
        ...metadata,
        verification,
        userEmail: user.email,
        userName: user.displayName
      },
      processedAt: new Date()
    });

    await payment.save();
    console.log(`✅ Payment saved: ${paymentId} for user ${req.user.id}`);

    // Update user based on product type
    if (productType === 'streak_restoration') {
      // Restore user's streak
      await Streak.findOneAndUpdate(
        { userId: req.user.id, status: 'broken' },
        {
          status: 'active',
          restoredAt: new Date(),
          restorationPaymentId: paymentId
        }
      );

      // Add freeze token
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { 'subscription.streakFreezeTokens': 1 }
      });

      console.log(`✅ Streak restored for user ${req.user.id}`);

    } else if (productType === 'pro' || productType === 'enterprise') {
      // Activate subscription
      const subscriptionEnd = new Date();
      subscriptionEnd.setDate(subscriptionEnd.getDate() + 30); // 30 days
      
      await User.findByIdAndUpdate(req.user.id, {
        $set: {
          'subscription.active': true,
          'subscription.plan': productType,
          'subscription.currentPeriodEnd': subscriptionEnd,
          'subscription.streakFreezeTokens': productType === 'enterprise' ? 10 : 5,
          'subscription.paymentProvider': 'dodo',
          'subscription.lastPaymentId': paymentId
        }
      });

      console.log(`✅ Subscription activated for user ${req.user.id}, plan: ${productType}`);
    }

    res.json({
      success: true,
      message: 'Payment verified and processed successfully',
      paymentId,
      productType,
      userUpdated: true,
      verification
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

/**
 * @route   POST /api/payments/manual
 * @desc    Manually register a payment (for admin/testing)
 * @access  Private
 */
router.post('/manual', auth, [
  check('userId').isMongoId(),
  check('productType').isIn(['pro', 'enterprise', 'streak_restoration']),
  check('amount').isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user is admin
    const adminUser = await User.findById(req.user.id);
    if (!adminUser.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { userId, productType, amount, notes } = req.body;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const paymentId = dodoPayments.generatePaymentId(userId, productType);
    
    // Process manual payment
    const manualPayment = await dodoPayments.processManualPayment({
      userId,
      paymentId,
      amount,
      productType,
      metadata: { notes, processedBy: adminUser._id }
    });

    // Create payment record
    const payment = new Payment({
      userId,
      paymentId,
      amount,
      currency: 'USD',
      status: 'completed',
      type: productType,
      provider: 'manual',
      metadata: {
        notes,
        processedBy: adminUser._id,
        processedAt: new Date(),
        isManual: true
      },
      processedAt: new Date()
    });

    await payment.save();

    // Update user
    if (productType === 'streak_restoration') {
      await Streak.findOneAndUpdate(
        { userId, status: 'broken' },
        {
          status: 'active',
          restoredAt: new Date(),
          restorationPaymentId: paymentId
        }
      );

      await User.findByIdAndUpdate(userId, {
        $inc: { 'subscription.streakFreezeTokens': 1 }
      });

    } else if (productType === 'pro' || productType === 'enterprise') {
      const subscriptionEnd = new Date();
      subscriptionEnd.setDate(subscriptionEnd.getDate() + 30);
      
      await User.findByIdAndUpdate(userId, {
        $set: {
          'subscription.active': true,
          'subscription.plan': productType,
          'subscription.currentPeriodEnd': subscriptionEnd,
          'subscription.streakFreezeTokens': productType === 'enterprise' ? 10 : 5,
          'subscription.paymentProvider': 'manual',
          'subscription.lastPaymentId': paymentId
        }
      });
    }

    res.json({
      success: true,
      message: 'Manual payment processed successfully',
      paymentId,
      productType,
      amount,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName
      },
      processedBy: adminUser._id,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Manual payment failed' });
  }
});

/**
 * @route   GET /api/payments/status/:paymentId
 * @desc    Check payment status
 * @access  Private
 */
router.get('/status/:paymentId', auth, async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    // First check our database
    const payment = await Payment.findOne({ paymentId });
    
    if (payment) {
      return res.json({
        success: true,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        type: payment.type,
        createdAt: payment.createdAt,
        processedAt: payment.processedAt
      });
    }
    
    // If not in database, try to get from Dodo
    const status = await dodoPayments.getPaymentStatus(paymentId);
    
    res.json({
      success: true,
      ...status
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get payment status' });
  }
});

/**
 * @route   GET /api/payments/user/history
 * @desc    Get user's payment history
 * @access  Private
 */
router.get('/user/history', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    
    res.json({
      success: true,
      payments,
      count: payments.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get payment history' });
  }
});

/**
 * @route   GET /api/payments/health
 * @desc    Health check for payments API
 * @access  Public
 */
router.get('/health', async (req, res) => {
  try {
    const health = await dodoPayments.healthCheck();
    
    res.json({
      status: 'healthy',
      service: 'payments-api',
      provider: 'Dodo Payments',
      timestamp: new Date().toISOString(),
      mode: process.env.NODE_ENV === 'development' ? 'test' : 'live',
      products: ['pro', 'enterprise', 'streak_restoration'],
      urls: {
        test: 'https://test.checkout.dodopayments.com/buy/pdt_0NWPjjq1W9yybN1dR63eF?quantity=1',
        pro: 'https://checkout.dodopayments.com/buy/pdt_0NWPkwJJcZChm84jRPqIt?quantity=1',
        enterprise: 'https://checkout.dodopayments.com/buy/pdt_0NWPl4fuR5huBMtu7YAKT?quantity=1'
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      status: 'unhealthy',
      error: err.message 
    });
  }
});

module.exports = router;