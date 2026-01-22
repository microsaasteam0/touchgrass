const express = require('express');
const app = express();
const PORT = 50011;

// Middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    message: 'TouchGrass Payment Webhook Server',
    timestamp: new Date().toISOString()
  });
});

// Dodo Payments Webhook
app.post('/api/payments/dodo/webhook', (req, res) => {
  console.log('='.repeat(50));
  console.log('💰 PAYMENT WEBHOOK RECEIVED!');
  console.log('='.repeat(50));
  
  console.log('📦 Headers:', req.headers);
  console.log('📦 Body:', JSON.stringify(req.body, null, 2));
  
  // Process different event types
  if (req.body.event && req.body.event.type) {
    const eventType = req.body.event.type;
    console.log(`🎯 Event Type: ${eventType}`);
    
    switch(eventType) {
      case 'payment.succeeded':
        console.log('✅ Payment successful!');
        console.log('   Payment ID:', req.body.event.data?.id);
        console.log('   Amount:', req.body.event.data?.amount);
        console.log('   Customer:', req.body.event.data?.customer_email);
        console.log('   Plan:', req.body.event.data?.metadata?.plan);
        
        // Here you would update database
        // const userId = req.body.event.data?.metadata?.userId;
        // if (userId) {
        //   console.log(`   Updating user ${userId} to PRO plan`);
        // }
        break;
        
      case 'payment.failed':
        console.log('❌ Payment failed:', req.body.event.data?.id);
        break;
        
      default:
        console.log(`⚠️  Unknown event: ${eventType}`);
    }
  }
  
  // Always respond 200 to acknowledge receipt
  res.json({
    success: true,
    message: 'Webhook received and processed',
    receivedAt: new Date().toISOString(),
    eventType: req.body.event?.type || 'unknown'
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({
    endpoints: {
      health: 'GET /health',
      webhook: 'POST /api/payments/dodo/webhook',
      test: 'GET /test'
    },
    instructions: 'Use this URL in Dodo dashboard'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 SIMPLE PAYMENT WEBHOOK SERVER STARTED');
  console.log('='.repeat(50));
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
  console.log(`💰 Webhook: POST http://localhost:${PORT}/api/payments/dodo/webhook`);
  console.log('='.repeat(50));
  console.log('📝 Add this to Dodo Dashboard:');
  console.log(`   Webhook URL: https://YOUR-NGROK-URL.ngrok.io/api/payments/dodo/webhook`);
  console.log('='.repeat(50));
});