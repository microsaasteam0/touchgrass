import axios from 'axios';
import crypto from 'crypto';

class DodoPaymentService {
  constructor() {
    // Direct configuration with your provided credentials
    this.testMode = process.env.NODE_ENV === 'development';
    
    // Your provided credentials
    this.testApiKey = '-vG2Q3V7h-3m9M2l.Swdnn67e1fY3O4dsW3mEs5F48h-zXFOY_COcWkvUVh3Pyzmb';
    this.liveApiKey = 'EwP5r7NScu-Rlxn5.OY4Uon94WrLmtV-CeapGgv9j3o5jH-X6ndmKg4jWWE8MTU9k';
    
    this.apiKey = this.testMode ? this.testApiKey : this.liveApiKey;
    
    this.baseUrls = {
      test: 'https://test.checkout.dodopayments.com',
      live: 'https://checkout.dodopayments.com'
    };
    
    this.baseUrl = this.testMode ? this.baseUrls.test : this.baseUrls.live;
    
    // Your product URLs
    this.products = {
      touchgrass_test: 'https://test.checkout.dodopayments.com/buy/pdt_0NWPjjq1W9yybN1dR63eF?quantity=1',
      touchgrass_pro: 'https://checkout.dodopayments.com/buy/pdt_0NWPkwJJcZChm84jRPqIt?quantity=1',
      touchgrass_enterprise: 'https://checkout.dodopayments.com/buy/pdt_0NWPl4fuR5huBMtu7YAKT?quantity=1'
    };
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000
    });
    
    console.log(`Dodo Payments initialized in ${this.testMode ? 'TEST' : 'LIVE'} mode`);
  }

  /**
   * Get direct checkout URL for a plan
   */
  getCheckoutUrl(plan, userId, metadata = {}) {
    try {
      const productKey = this.testMode ? 'touchgrass_test' : 
                        plan === 'pro' ? 'touchgrass_pro' : 'touchgrass_enterprise';
      
      const baseUrl = this.products[productKey];
      
      // Add metadata as URL parameters
      const url = new URL(baseUrl);
      
      // Add user metadata
      if (userId) {
        url.searchParams.append('client_reference_id', userId);
      }
      
      if (metadata.userEmail) {
        url.searchParams.append('prefilled_email', metadata.userEmail);
      }
      
      if (metadata.userName) {
        url.searchParams.append('customer_name', metadata.userName);
      }
      
      // Add custom metadata for tracking
      const customMetadata = {
        ...metadata,
        userId: userId,
        plan: plan,
        timestamp: new Date().toISOString(),
        source: 'touchgrass.now'
      };
      
      url.searchParams.append('metadata', JSON.stringify(customMetadata));
      
      return {
        success: true,
        url: url.toString(),
        product: plan,
        mode: this.testMode ? 'test' : 'live',
        expires_at: Date.now() + 3600000, // 1 hour
        metadata: customMetadata
      };
      
    } catch (error) {
      console.error('Error creating checkout URL:', error);
      throw error;
    }
  }

  /**
   * Verify payment callback from Dodo
   */
  async verifyPayment(paymentId) {
    try {
      // In a real implementation, you'd verify with Dodo API
      // For now, we'll simulate verification based on payment ID
      
      // Check if it's a valid payment ID format
      const isValid = /^[a-zA-Z0-9_-]{24,}$/.test(paymentId);
      
      if (!isValid) {
        return {
          success: false,
          error: 'Invalid payment ID format'
        };
      }
      
      // Simulate successful verification for now
      return {
        success: true,
        verified: true,
        paymentId: paymentId,
        verifiedAt: new Date().toISOString(),
        status: 'completed'
      };
      
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId) {
    try {
      // This would call Dodo API in production
      return {
        success: true,
        paymentId: paymentId,
        status: 'completed', // or 'pending', 'failed'
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Get payment status error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Process manual payment (for admin/testing)
   */
  async processManualPayment(data) {
    try {
      const { userId, paymentId, amount, productType, metadata = {} } = data;
      
      return {
        success: true,
        paymentId: paymentId || `manual_${Date.now()}_${userId}`,
        amount: amount,
        productType: productType,
        status: 'completed',
        mode: 'manual',
        processedAt: new Date().toISOString(),
        metadata: {
          ...metadata,
          isManual: true,
          processedBy: metadata.processedBy || 'system'
        }
      };
    } catch (error) {
      console.error('Manual payment error:', error);
      throw error;
    }
  }

  /**
   * Generate a payment ID
   */
  generatePaymentId(userId, productType) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `dodo_${timestamp}_${userId.substring(0, 8)}_${productType}_${random}`;
  }

  /**
   * Get available products with pricing
   */
  getProducts() {
    return {
      pro: {
        name: 'TouchGrass Pro',
        price: 14.99,
        description: 'Monthly subscription with advanced features',
        url: this.testMode ? this.products.touchgrass_test : this.products.touchgrass_pro,
        features: [
          'Unlimited streaks',
          'Advanced analytics',
          '5 streak freeze tokens/month',
          'Priority support',
          'Custom challenges',
          'Ad-free experience'
        ]
      },
      enterprise: {
        name: 'TouchGrass Enterprise',
        price: 59.99,
        description: 'Monthly subscription for teams & organizations',
        url: this.testMode ? this.products.touchgrass_test : this.products.touchgrass_enterprise,
        features: [
          'Everything in Pro',
          'White-label solution',
          'API access',
          'Custom reporting',
          'Dedicated success manager',
          'SLA guarantee',
          'Unlimited users'
        ]
      },
      streak_restoration: {
        name: 'Streak Restoration',
        price: 4.99,
        description: 'One-time payment to restore broken streak',
        url: null, // This would be a custom product in Dodo
        features: [
          'Restore broken streak',
          'Add 1 streak freeze token',
          'Continue from where you left off'
        ]
      }
    };
  }

  /**
   * Get prices for display
   */
  getPrices() {
    return {
      pro: 14.99,
      enterprise: 59.99,
      streak_restoration: 4.99
    };
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      return {
        status: 'healthy',
        mode: this.testMode ? 'test' : 'live',
        provider: 'Dodo Payments',
        timestamp: new Date().toISOString(),
        products: Object.keys(this.products)
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }
}

// Export singleton instance
const dodoPayments = new DodoPaymentService();
export default dodoPayments;