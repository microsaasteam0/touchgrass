import dodoService from './dodoService';

class PaymentService {
  
  // Get checkout URL for a product
  async getCheckoutUrl(productType) {
    try {
      const response = await dodoService.getCheckoutUrl(productType);
      return response;
    } catch (error) {
      console.error('Get checkout URL error:', error);
      
      // Fallback to direct URLs
      const directUrls = dodoService.getDirectCheckoutUrls();
      let url = directUrls.pro;
      
      if (productType === 'enterprise') {
        url = directUrls.enterprise;
      } else if (productType === 'streak_restoration') {
        // For streak restoration, we need to handle differently
        return {
          success: false,
          error: 'Please contact support for streak restoration'
        };
      }
      
      return {
        success: true,
        url,
        productType,
        mode: 'direct_fallback',
        message: 'Using direct checkout URL'
      };
    }
  }

  // Get available products
  async getProducts() {
    try {
      // In a real app, you'd fetch from your API
      return {
        pro: {
          name: 'TouchGrass Pro',
          price: 14.99,
          period: 'month',
          features: [
            'Unlimited streak tracking',
            'Advanced analytics dashboard',
            '5 streak freeze tokens/month',
            'Priority customer support',
            'Custom achievement badges',
            'Ad-free experience'
          ],
          dodoUrl: 'https://checkout.dodopayments.com/buy/pdt_0NWPkwJJcZChm84jRPqIt?quantity=1'
        },
        enterprise: {
          name: 'TouchGrass Enterprise',
          price: 59.99,
          period: 'month',
          features: [
            'Everything in Pro',
            'White-label solution',
            'API access',
            'Custom reporting',
            'Dedicated success manager',
            'SLA guarantee',
            'Unlimited users'
          ],
          dodoUrl: 'https://checkout.dodopayments.com/buy/pdt_0NWPl4fuR5huBMtu7YAKT?quantity=1'
        },
        streak_restoration: {
          name: 'Streak Restoration',
          price: 4.99,
          period: 'one-time',
          features: [
            'Restore broken streak',
            'Add 1 streak freeze token',
            'Continue from where you left off',
            'No questions asked'
          ],
          dodoUrl: null // Custom product needed
        }
      };
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  }

  // Verify payment after completion
  async verifyPayment(paymentId, productType, amount) {
    try {
      return await dodoService.verifyPayment(paymentId, productType, amount);
    } catch (error) {
      console.error('Verify payment error:', error);
      throw error;
    }
  }

  // Get payment status
  async getPaymentStatus(paymentId) {
    try {
      return await dodoService.getPaymentStatus(paymentId);
    } catch (error) {
      console.error('Get payment status error:', error);
      throw error;
    }
  }

  // Get user's payment history
  async getPaymentHistory() {
    try {
      return await dodoService.getPaymentHistory();
    } catch (error) {
      console.error('Get payment history error:', error);
      return { payments: [] };
    }
  }

  // Open payment in new window
  async openPayment(plan) {
    try {
      // Get checkout URL first
      const checkout = await this.getCheckoutUrl(plan);
      
      if (checkout.success && checkout.url) {
        // Open in new window
        const paymentWindow = window.open(
          checkout.url,
          'dodo_payment',
          'width=600,height=700,scrollbars=yes'
        );
        
        return {
          success: true,
          window: paymentWindow,
          url: checkout.url
        };
      } else {
        throw new Error('Failed to get checkout URL');
      }
    } catch (error) {
      console.error('Open payment error:', error);
      
      // Fallback to direct URL
      return dodoService.openDirectCheckout(plan);
    }
  }

  // Process manual payment (for admin)
  async processManualPayment(userId, productType, amount, notes) {
    try {
      // This would call your backend API
      console.log('Manual payment processed:', { userId, productType, amount, notes });
      return {
        success: true,
        message: 'Manual payment recorded'
      };
    } catch (error) {
      console.error('Manual payment error:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return await dodoService.healthCheck();
  }
}

export default new PaymentService();