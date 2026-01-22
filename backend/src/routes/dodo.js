const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Dodo Payment Webhook Handler
router.post('/webhook', async (req, res) => {
  try {
    const event = req.body;
    
    // Verify webhook signature (you'd implement this based on Dodo's docs)
    // For now, we'll trust the webhook
    
    if (event.type === 'payment.succeeded') {
      const { customer_email, amount, metadata } = event.data;
      
      // Update user's subscription based on product
      const user = await User.findOne({ email: customer_email });
      
      if (user) {
        // Determine plan based on amount or product ID
        let plan = 'free';
        if (amount === 1499) { // $14.99 in cents
          plan = 'pro';
        } else if (amount === 5999) { // $59.99 in cents
          plan = 'enterprise';
        }
        
        user.subscription = {
          active: true,
          plan: plan,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          stripeCustomerId: metadata?.customer_id || null
        };
        
        await user.save();
        console.log(`User ${user.email} upgraded to ${plan} plan`);
      }
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Dodo webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Get Dodo checkout URLs
router.get('/checkout/:plan', async (req, res) => {
  try {
    const { plan } = req.params;
    
    const urls = {
      pro: 'https://checkout.dodopayments.com/buy/pdt_0NWPkwJJcZChm84jRPqIt',
      enterprise: 'https://checkout.dodopayments.com/buy/pdt_0NWPl4fuR5huBMtu7YAKT',
      streak_restoration: 'https://checkout.dodopayments.com/buy/pdt_0NWPjjq1W9yybN1dR63eF'
    };
    
    if (!urls[plan]) {
      return res.status(400).json({ error: 'Invalid plan type' });
    }
    
    // You can add user-specific metadata to the URL
    const checkoutUrl = urls[plan];
    
    res.json({
      checkoutUrl: checkoutUrl,
      plan: plan,
      price: plan === 'pro' ? 14.99 : plan === 'enterprise' ? 59.99 : 4.99
    });
  } catch (error) {
    console.error('Error generating checkout URL:', error);
    res.status(500).json({ error: 'Failed to generate checkout URL' });
  }
});

module.exports = router;