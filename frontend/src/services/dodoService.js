import React from 'react';


class DodoService {
  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'https://touchgrass-backend.onrender.com/api',
    });
    
    // Add auth token to requests
    this.api.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  /**
   * Get checkout URL for a plan
   */
  async getCheckoutUrl(plan) {
    try {
      const response = await this.api.get(`/payments/checkout/${plan}`);
      return response.data;
    } catch (error) {
      console.error('Get checkout URL error:', error);
      // Fallback to direct URLs
      return this.getDirectCheckoutUrls(plan);
    }
  }

  /**
   * Verify payment
   */
  async verifyPayment(paymentId, productType, amount) {
    try {
      const response = await this.api.post('/payments/verify', {
        paymentId,
        productType,
        amount
      });
      return response.data;
    } catch (error) {
      console.error('Verify payment error:', error);
      throw error;
    }
  }

  /**
   * Direct checkout URLs (your provided URLs)
   */
  getDirectCheckoutUrls(plan = 'pro') {
    const urls = {
      test: 'https://test.checkout.dodopayments.com/buy/pdt_0NWPjjq1W9yybN1dR63eF?quantity=1',
      pro: 'https://checkout.dodopayments.com/buy/pdt_0NWPkwJJcZChm84jRPqIt?quantity=1',
      enterprise: 'https://checkout.dodopayments.com/buy/pdt_0NWPl4fuR5huBMtu7YAKT?quantity=1'
    };

    // In development, use test URL
    if (import.meta.env.DEV) {
      return {
        success: true,
        url: urls.test,
        mode: 'test'
      };
    }

    // In production, use appropriate URL
    const url = plan === 'enterprise' ? urls.enterprise : urls.pro;
    return {
      success: true,
      url,
      mode: 'live'
    };
  }

  /**
   * Open direct checkout in new window
   */
  openDirectCheckout(plan = 'pro') {
    const checkout = this.getDirectCheckoutUrls(plan);
    
    // Add referral metadata
    const userId = localStorage.getItem('userId');
    if (userId) {
      const urlObj = new URL(checkout.url);
      urlObj.searchParams.append('client_reference_id', userId);
      checkout.url = urlObj.toString();
    }
    
    window.open(checkout.url, '_blank', 'width=600,height=700');
    
    return {
      success: true,
      url: checkout.url,
      openedInNewWindow: true
    };
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const response = await this.api.get('/payments/health');
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }
}

export default new DodoService();