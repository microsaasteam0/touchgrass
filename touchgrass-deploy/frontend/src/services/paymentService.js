/**
 * TouchGrass Payment Service - Premium Financial Layer
 * Enterprise-grade payment processing with business intelligence
 */

class PremiumPaymentService {
  constructor() {
    this.stripe = null;
    this.api = window.apiService;
    this.analytics = new PaymentAnalytics();
    this.fraudDetector = new FraudDetector();
    this.revenueManager = new RevenueManager();
    this.subscriptionManager = new SubscriptionManager();
    
    // Payment state
    this.paymentState = {
      isProcessing: false,
      lastPayment: null,
      subscription: null,
      billingHistory: [],
      paymentMethods: [],
      invoices: []
    };
    
    // Business configurations
    this.config = {
      currency: 'USD',
      taxRates: {
        US: 0.08, // 8% tax for US
        EU: 0.21, // 21% VAT for EU
        UK: 0.20, // 20% VAT for UK
        default: 0.10
      },
      plans: {
        free: {
          id: 'free',
          name: 'Free',
          price: 0,
          features: ['Basic streak tracking', 'Public leaderboard', 'Daily verification'],
          limits: {
            streakFreezes: 0,
            storage: '100MB',
            support: 'Community'
          }
        },
        premium: {
          id: 'premium',
          name: 'Premium',
          price: 9.99,
          interval: 'month',
          features: [
            'Unlimited streak freezes',
            'Advanced analytics',
            'Priority support',
            'Custom challenges',
            'No ads'
          ],
          metadata: {
            color: '#fbbf24',
            icon: '⭐',
            businessValue: 'high'
          }
        },
        elite: {
          id: 'elite',
          name: 'Elite',
          price: 29.99,
          interval: 'month',
          features: [
            'Everything in Premium',
            'Team management',
            'API access',
            'White-label solutions',
            'Dedicated account manager'
          ],
          metadata: {
            color: '#10b981',
            icon: '👑',
            businessValue: 'enterprise'
          }
        },
        annual_premium: {
          id: 'annual_premium',
          name: 'Premium Annual',
          price: 99.99,
          interval: 'year',
          features: ['All Premium features', '2 months free'],
          metadata: {
            color: '#8b5cf6',
            icon: '🎯',
            discount: '17%'
          }
        }
      },
      countries: {
        supported: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'ES', 'IT', 'NL', 'SE'],
        eu: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE']
      }
    };
    
    // Initialize
    this.initializeStripe();
    this.loadPaymentState();
    this.startRevenueMonitoring();
  }

  async initializeStripe() {
    try {
      // Load Stripe.js
      if (!window.Stripe) {
        await this.loadScript('https://js.stripe.com/v3/');
      }
      
      // Initialize Stripe with business configuration
      this.stripe = window.Stripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY, {
        apiVersion: '2023-10-16',
        locale: 'en',
        betas: ['custom_checkout_beta_1']
      });
      
      console.log('[Payment Service] Stripe initialized for business');
      
    } catch (error) {
      console.error('[Payment Service] Failed to initialize Stripe:', error);
      throw new PaymentError('Payment system unavailable', 'STRIPE_INIT_FAILED');
    }
  }

  async loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async loadPaymentState() {
    try {
      const response = await this.api.get('/payments/state');
      this.paymentState = {
        ...this.paymentState,
        ...response.data
      };
      
      // Initialize subscription manager
      this.subscriptionManager.setSubscription(this.paymentState.subscription);
      
    } catch (error) {
      console.warn('[Payment Service] Failed to load payment state:', error);
    }
  }

  // Payment Processing
  async processPayment(paymentData, options = {}) {
    const paymentId = this.generatePaymentId();
    const startTime = Date.now();
    
    try {
      this.paymentState.isProcessing = true;
      
      // Business validation
      await this.validateBusinessPayment(paymentData, options);
      
      // Fraud detection
      const fraudCheck = await this.fraudDetector.analyzePayment(paymentData);
      if (fraudCheck.riskScore > 70) {
        throw new PaymentError('Payment flagged for review', 'FRAUD_DETECTED', {
          riskScore: fraudCheck.riskScore,
          reasons: fraudCheck.reasons
        });
      }
      
      // Prepare payment with business metadata
      const enhancedPayment = {
        ...paymentData,
        metadata: {
          ...paymentData.metadata,
          paymentId,
          businessContext: {
            userId: this.getCurrentUserId(),
            userTier: this.getUserTier(),
            deviceId: this.getDeviceId(),
            ipCountry: await this.getIPCountry(),
            utmSource: this.getUTMSource(),
            referralCode: this.getReferralCode(),
            campaign: options.campaign
          },
          timestamp: new Date().toISOString()
        }
      };
      
      // Calculate tax
      const taxData = await this.calculateTax(enhancedPayment);
      enhancedPayment.tax = taxData;
      
      // Process based on payment method
      let result;
      switch (enhancedPayment.method) {
        case 'card':
          result = await this.processCardPayment(enhancedPayment);
          break;
          
        case 'apple_pay':
          result = await this.processApplePay(enhancedPayment);
          break;
          
        case 'google_pay':
          result = await this.processGooglePay(enhancedPayment);
          break;
          
        case 'paypal':
          result = await this.processPayPal(enhancedPayment);
          break;
          
        case 'crypto':
          result = await this.processCryptoPayment(enhancedPayment);
          break;
          
        default:
          throw new PaymentError('Unsupported payment method', 'UNSUPPORTED_METHOD');
      }
      
      // Track successful payment
      await this.trackSuccessfulPayment({
        paymentId,
        amount: enhancedPayment.amount,
        currency: enhancedPayment.currency,
        method: enhancedPayment.method,
        duration: Date.now() - startTime,
        metadata: enhancedPayment.metadata
      });
      
      // Update local state
      this.paymentState.lastPayment = {
        ...result,
        paymentId,
        timestamp: new Date().toISOString()
      };
      
      // Show success notification
      this.showPaymentSuccess(result);
      
      return result;
      
    } catch (error) {
      // Track failed payment
      await this.trackFailedPayment({
        paymentId,
        error: error.message,
        code: error.code,
        metadata: paymentData.metadata,
        duration: Date.now() - startTime
      });
      
      // Handle specific error types
      this.handlePaymentError(error);
      
      throw error;
      
    } finally {
      this.paymentState.isProcessing = false;
    }
  }

  async processCardPayment(paymentData) {
    try {
      // Create payment method
      const { paymentMethod, error } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: {
          number: paymentData.card.number,
          exp_month: paymentData.card.exp_month,
          exp_year: paymentData.card.exp_year,
          cvc: paymentData.card.cvc
        },
        billing_details: {
          name: paymentData.billing.name,
          email: paymentData.billing.email,
          address: {
            line1: paymentData.billing.address.line1,
            city: paymentData.billing.address.city,
            state: paymentData.billing.address.state,
            postal_code: paymentData.billing.address.postal_code,
            country: paymentData.billing.address.country
          }
        }
      });

      if (error) {
        throw new PaymentError(error.message, 'STRIPE_ERROR', error);
      }

      // Create payment intent
      const intentResponse = await this.api.post('/payments/create-intent', {
        amount: paymentData.amount,
        currency: paymentData.currency,
        payment_method: paymentMethod.id,
        metadata: paymentData.metadata
      });

      const { clientSecret, requiresAction } = intentResponse.data;

      if (requiresAction) {
        // Handle 3D Secure
        const { error: confirmError, paymentIntent } = await this.stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: paymentMethod.id
          }
        );

        if (confirmError) {
          throw new PaymentError(confirmError.message, '3DSECURE_FAILED', confirmError);
        }

        return this.handlePaymentIntentResult(paymentIntent);
      }

      // Confirm payment
      const { error: confirmError, paymentIntent } = await this.stripe.confirmCardPayment(
        clientSecret
      );

      if (confirmError) {
        throw new PaymentError(confirmError.message, 'PAYMENT_FAILED', confirmError);
      }

      return this.handlePaymentIntentResult(paymentIntent);

    } catch (error) {
      console.error('[Payment Service] Card payment failed:', error);
      throw error;
    }
  }

  async processApplePay(paymentData) {
    // Check if Apple Pay is available
    if (!window.ApplePaySession || !window.ApplePaySession.canMakePayments()) {
      throw new PaymentError('Apple Pay not available', 'APPLE_PAY_UNAVAILABLE');
    }

    try {
      const paymentRequest = {
        countryCode: paymentData.country || 'US',
        currencyCode: paymentData.currency || 'USD',
        supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
        merchantCapabilities: ['supports3DS'],
        total: {
          label: 'TouchGrass Premium',
          amount: (paymentData.amount / 100).toFixed(2)
        }
      };

      const session = new ApplePaySession(4, paymentRequest);

      return new Promise((resolve, reject) => {
        session.onvalidatemerchant = async (event) => {
          try {
            const response = await this.api.post('/payments/apple-pay/validate', {
              validationURL: event.validationURL
            });
            
            session.completeMerchantValidation(response.data.merchantSession);
          } catch (error) {
            session.abort();
            reject(new PaymentError('Merchant validation failed', 'APPLE_PAY_VALIDATION_FAILED'));
          }
        };

        session.onpaymentauthorized = async (event) => {
          try {
            const token = event.payment.token;
            
            const result = await this.api.post('/payments/apple-pay/process', {
              token: token,
              amount: paymentData.amount,
              currency: paymentData.currency,
              metadata: paymentData.metadata
            });

            if (result.data.success) {
              session.completePayment(ApplePaySession.STATUS_SUCCESS);
              resolve(result.data);
            } else {
              session.completePayment(ApplePaySession.STATUS_FAILURE);
              reject(new PaymentError('Payment processing failed', 'APPLE_PAY_PROCESSING_FAILED'));
            }
          } catch (error) {
            session.completePayment(ApplePaySession.STATUS_FAILURE);
            reject(error);
          }
        };

        session.begin();
      });

    } catch (error) {
      console.error('[Payment Service] Apple Pay failed:', error);
      throw error;
    }
  }

  async processGooglePay(paymentData) {
    // Check if Google Pay is available
    if (!window.google || !window.google.payments) {
      throw new PaymentError('Google Pay not available', 'GOOGLE_PAY_UNAVAILABLE');
    }

    try {
      const paymentsClient = new google.payments.api.PaymentsClient({
        environment: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'TEST'
      });

      const paymentDataRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['VISA', 'MASTERCARD', 'AMEX']
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'stripe',
              'stripe:version': '2020-08-27',
              'stripe:publishableKey': process.env.REACT_APP_STRIPE_PUBLIC_KEY
            }
          }
        }],
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPrice: (paymentData.amount / 100).toFixed(2),
          currencyCode: paymentData.currency || 'USD',
          countryCode: paymentData.country || 'US'
        },
        merchantInfo: {
          merchantId: 'BCR2DN4TVDTKP4QH', // Your Google merchant ID
          merchantName: 'TouchGrass'
        }
      };

      const paymentDataResult = await paymentsClient.loadPaymentData(paymentDataRequest);
      
      // Process the payment token
      const result = await this.api.post('/payments/google-pay/process', {
        paymentData: paymentDataResult.paymentMethodData.tokenizationData.token,
        amount: paymentData.amount,
        currency: paymentData.currency,
        metadata: paymentData.metadata
      });

      return result.data;

    } catch (error) {
      console.error('[Payment Service] Google Pay failed:', error);
      throw error;
    }
  }

  async processPayPal(paymentData) {
    try {
      // Load PayPal SDK if not already loaded
      if (!window.paypal) {
        await this.loadScript('https://www.paypal.com/sdk/js?client-id=' + process.env.REACT_APP_PAYPAL_CLIENT_ID);
      }

      return new Promise((resolve, reject) => {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: (paymentData.amount / 100).toFixed(2),
                  currency_code: paymentData.currency || 'USD'
                },
                metadata: paymentData.metadata
              }]
            });
          },
          onApprove: async (data, actions) => {
            try {
              const details = await actions.order.capture();
              
              const result = await this.api.post('/payments/paypal/capture', {
                orderID: data.orderID,
                details: details,
                metadata: paymentData.metadata
              });

              resolve(result.data);
            } catch (error) {
              reject(error);
            }
          },
          onError: (error) => {
            reject(new PaymentError(error.message, 'PAYPAL_ERROR', error));
          }
        }).render('#paypal-button-container');
      });

    } catch (error) {
      console.error('[Payment Service] PayPal failed:', error);
      throw error;
    }
  }

  async processCryptoPayment(paymentData) {
    try {
      // For crypto payments, we'd use a service like Coinbase Commerce
      const response = await this.api.post('/payments/crypto/create', {
        amount: paymentData.amount,
        currency: paymentData.currency,
        cryptoCurrency: paymentData.cryptoCurrency || 'ETH',
        metadata: paymentData.metadata
      });

      const { charge } = response.data;
      
      // Return charge details for QR code display
      return {
        success: true,
        chargeId: charge.id,
        address: charge.addresses[paymentData.cryptoCurrency],
        amount: charge.pricing[paymentData.cryptoCurrency].amount,
        currency: paymentData.cryptoCurrency,
        qrCode: charge.addresses[paymentData.cryptoCurrency],
        expiresAt: charge.expires_at,
        paymentType: 'crypto'
      };

    } catch (error) {
      console.error('[Payment Service] Crypto payment failed:', error);
      throw error;
    }
  }

  handlePaymentIntentResult(paymentIntent) {
    return {
      success: paymentIntent.status === 'succeeded',
      paymentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      receiptUrl: paymentIntent.charges?.data[0]?.receipt_url,
      paymentType: 'card'
    };
  }

  // Subscription Management
  async subscribeToPlan(planId, paymentMethodId = null, options = {}) {
    try {
      const plan = this.config.plans[planId];
      if (!plan) {
        throw new PaymentError('Invalid plan', 'INVALID_PLAN');
      }

      // Prepare subscription data
      const subscriptionData = {
        planId,
        paymentMethodId,
        metadata: {
          ...options.metadata,
          businessContext: {
            userId: this.getCurrentUserId(),
            previousPlan: this.paymentState.subscription?.planId,
            upgradeReason: options.reason,
            campaign: options.campaign
          }
        },
        trialDays: options.trialDays || 0,
        couponCode: options.couponCode,
        quantity: options.quantity || 1
      };

      // Create subscription
      const response = await this.api.post('/subscriptions/create', subscriptionData);
      
      if (response.data.requiresPaymentMethod) {
        // Redirect to payment method setup
        return this.setupPaymentMethodForSubscription(response.data.clientSecret);
      }

      // Update local state
      this.paymentState.subscription = response.data.subscription;
      this.subscriptionManager.setSubscription(response.data.subscription);
      
      // Track subscription event
      this.trackSubscriptionEvent('subscribe', planId, response.data.subscription);
      
      // Show success notification
      this.showSubscriptionSuccess(plan);
      
      return response.data;

    } catch (error) {
      console.error('[Payment Service] Subscription failed:', error);
      throw error;
    }
  }

  async cancelSubscription(reason = 'user_cancelled', feedback = '') {
    try {
      const response = await this.api.post('/subscriptions/cancel', {
        reason,
        feedback,
        metadata: {
          cancelledAt: new Date().toISOString(),
          userId: this.getCurrentUserId()
        }
      });

      // Update local state
      this.paymentState.subscription = response.data.subscription;
      this.subscriptionManager.setSubscription(response.data.subscription);
      
      // Track cancellation
      this.trackSubscriptionEvent('cancel', this.paymentState.subscription?.planId, {
        reason,
        feedback
      });
      
      // Show cancellation confirmation
      this.showCancellationConfirmation();
      
      return response.data;

    } catch (error) {
      console.error('[Payment Service] Cancellation failed:', error);
      throw error;
    }
  }

  async updateSubscription(planId, options = {}) {
    try {
      const response = await this.api.post('/subscriptions/update', {
        planId,
        prorate: options.prorate !== false,
        billingCycleAnchor: options.billingCycleAnchor,
        metadata: {
          ...options.metadata,
          upgradeReason: options.reason
        }
      });

      // Update local state
      this.paymentState.subscription = response.data.subscription;
      this.subscriptionManager.setSubscription(response.data.subscription);
      
      // Track upgrade/downgrade
      this.trackSubscriptionEvent('update', planId, response.data.subscription);
      
      return response.data;

    } catch (error) {
      console.error('[Payment Service] Subscription update failed:', error);
      throw error;
    }
  }

  async applyCoupon(couponCode) {
    try {
      const response = await this.api.post('/subscriptions/coupon', {
        couponCode,
        metadata: {
          userId: this.getCurrentUserId(),
          appliedAt: new Date().toISOString()
        }
      });

      // Track coupon usage
      this.trackCouponUsage(couponCode, response.data.discount);
      
      return response.data;

    } catch (error) {
      console.error('[Payment Service] Coupon application failed:', error);
      throw error;
    }
  }

  // Payment Methods Management
  async getPaymentMethods() {
    try {
      const response = await this.api.get('/payments/methods');
      this.paymentState.paymentMethods = response.data.methods;
      return response.data.methods;
    } catch (error) {
      console.error('[Payment Service] Failed to get payment methods:', error);
      throw error;
    }
  }

  async addPaymentMethod(methodData) {
    try {
      const response = await this.api.post('/payments/methods', methodData);
      
      // Update local state
      this.paymentState.paymentMethods.push(response.data.method);
      
      return response.data.method;
      
    } catch (error) {
      console.error('[Payment Service] Failed to add payment method:', error);
      throw error;
    }
  }

  async setDefaultPaymentMethod(methodId) {
    try {
      const response = await this.api.put(`/payments/methods/${methodId}/default`);
      
      // Update local state
      this.paymentState.paymentMethods = this.paymentState.paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }));
      
      return response.data;
      
    } catch (error) {
      console.error('[Payment Service] Failed to set default payment method:', error);
      throw error;
    }
  }

  async removePaymentMethod(methodId) {
    try {
      await this.api.delete(`/payments/methods/${methodId}`);
      
      // Update local state
      this.paymentState.paymentMethods = this.paymentState.paymentMethods.filter(
        method => method.id !== methodId
      );
      
      return true;
      
    } catch (error) {
      console.error('[Payment Service] Failed to remove payment method:', error);
      throw error;
    }
  }

  // Invoices and Billing
  async getInvoices(options = {}) {
    try {
      const params = new URLSearchParams();
      if (options.limit) params.append('limit', options.limit);
      if (options.startingAfter) params.append('starting_after', options.startingAfter);
      
      const response = await this.api.get(`/payments/invoices?${params}`);
      this.paymentState.invoices = response.data.invoices;
      return response.data.invoices;
    } catch (error) {
      console.error('[Payment Service] Failed to get invoices:', error);
      throw error;
    }
  }

  async getInvoice(invoiceId) {
    try {
      const response = await this.api.get(`/payments/invoices/${invoiceId}`);
      return response.data.invoice;
    } catch (error) {
      console.error('[Payment Service] Failed to get invoice:', error);
      throw error;
    }
  }

  async downloadInvoice(invoiceId) {
    try {
      const response = await this.api.get(`/payments/invoices/${invoiceId}/download`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('[Payment Service] Failed to download invoice:', error);
      throw error;
    }
  }

  // Business Methods
  async calculateTax(paymentData) {
    try {
      const response = await this.api.post('/payments/calculate-tax', {
        amount: paymentData.amount,
        currency: paymentData.currency,
        country: paymentData.billing?.address?.country,
        state: paymentData.billing?.address?.state,
        productType: 'digital_service'
      });
      
      return response.data;
      
    } catch (error) {
      console.warn('[Payment Service] Tax calculation failed, using defaults:', error);
      
      // Return default tax calculation
      const country = paymentData.billing?.address?.country || 'US';
      const taxRate = this.config.taxRates[country] || 
                     this.config.taxRates[country in this.config.countries.eu ? 'EU' : 'default'];
      
      const taxAmount = Math.round(paymentData.amount * taxRate);
      
      return {
        rate: taxRate,
        amount: taxAmount,
        inclusive: false,
        country,
        region: paymentData.billing?.address?.state
      };
    }
  }

  async validateBusinessPayment(paymentData, options) {
    const validations = [];
    
    // Amount validation
    if (paymentData.amount <= 0) {
      validations.push('Invalid amount');
    }
    
    // Currency validation
    if (!this.isSupportedCurrency(paymentData.currency)) {
      validations.push('Unsupported currency');
    }
    
    // Country validation
    if (paymentData.billing?.address?.country && 
        !this.isSupportedCountry(paymentData.billing.address.country)) {
      validations.push('Unsupported country');
    }
    
    // Business rules validation
    if (options.businessRules) {
      const businessValidation = await this.validateBusinessRules(paymentData, options.businessRules);
      if (!businessValidation.valid) {
        validations.push(...businessValidation.errors);
      }
    }
    
    if (validations.length > 0) {
      throw new PaymentError('Payment validation failed', 'VALIDATION_FAILED', {
        validations
      });
    }
    
    return true;
  }

  validateBusinessRules(paymentData, rules) {
    const errors = [];
    
    if (rules.minAmount && paymentData.amount < rules.minAmount) {
      errors.push(`Minimum amount is ${rules.minAmount / 100}`);
    }
    
    if (rules.maxAmount && paymentData.amount > rules.maxAmount) {
      errors.push(`Maximum amount is ${rules.maxAmount / 100}`);
    }
    
    if (rules.allowedCountries && paymentData.billing?.address?.country) {
      if (!rules.allowedCountries.includes(paymentData.billing.address.country)) {
        errors.push('Country not allowed');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  isSupportedCurrency(currency) {
    const supportedCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
    return supportedCurrencies.includes(currency.toUpperCase());
  }

  isSupportedCountry(countryCode) {
    return this.config.countries.supported.includes(countryCode.toUpperCase());
  }

  // Analytics and Tracking
  async trackSuccessfulPayment(data) {
    const analyticsData = {
      event: 'payment_successful',
      ...data,
      businessMetrics: {
        averageOrderValue: await this.calculateAOV(),
        customerLifetimeValue: await this.calculateCLV(),
        conversionRate: await this.calculateConversionRate()
      }
    };
    
    // Send to analytics
    this.analytics.trackPayment(analyticsData);
    
    // Update revenue manager
    this.revenueManager.recordRevenue(data);
    
    // Send to business intelligence
    this.api.post('/analytics/payments', analyticsData).catch(() => {
      // Silent fail for analytics
    });
  }

  async trackFailedPayment(data) {
    const analyticsData = {
      event: 'payment_failed',
      ...data
    };
    
    // Send to analytics
    this.analytics.trackPaymentFailure(analyticsData);
    
    // Send to business intelligence
    this.api.post('/analytics/payment-failures', analyticsData).catch(() => {
      // Silent fail for analytics
    });
  }

  async trackSubscriptionEvent(event, planId, data) {
    const analyticsData = {
      event: `subscription_${event}`,
      planId,
      ...data,
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUserId()
    };
    
    // Send to analytics
    this.analytics.trackSubscription(analyticsData);
    
    // Send to business intelligence
    this.api.post('/analytics/subscriptions', analyticsData).catch(() => {
      // Silent fail for analytics
    });
  }

  async trackCouponUsage(couponCode, discount) {
    const analyticsData = {
      event: 'coupon_used',
      couponCode,
      discount,
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUserId()
    };
    
    // Send to analytics
    this.api.post('/analytics/coupons', analyticsData).catch(() => {
      // Silent fail for analytics
    });
  }

  // Revenue Management
  startRevenueMonitoring() {
    // Monitor revenue every hour
    setInterval(async () => {
      await this.updateRevenueMetrics();
    }, 60 * 60 * 1000);
  }

  async updateRevenueMetrics() {
    try {
      const metrics = {
        mrr: await this.calculateMRR(),
        arr: await this.calculateARR(),
        churnRate: await this.calculateChurnRate(),
        ltv: await this.calculateLTV(),
        arpu: await this.calculateARPU(),
        timestamp: new Date().toISOString()
      };
      
      // Update revenue manager
      this.revenueManager.updateMetrics(metrics);
      
      // Send to dashboard
      this.emit('revenueUpdate', metrics);
      
    } catch (error) {
      console.error('[Payment Service] Failed to update revenue metrics:', error);
    }
  }

  async calculateMRR() {
    try {
      const response = await this.api.get('/analytics/mrr');
      return response.data.mrr;
    } catch (error) {
      return 0;
    }
  }

  async calculateARR() {
    const mrr = await this.calculateMRR();
    return mrr * 12;
  }

  async calculateChurnRate() {
    try {
      const response = await this.api.get('/analytics/churn');
      return response.data.churnRate;
    } catch (error) {
      return 0;
    }
  }

  async calculateLTV() {
    try {
      const response = await this.api.get('/analytics/ltv');
      return response.data.ltv;
    } catch (error) {
      return 0;
    }
  }

  async calculateARPU() {
    try {
      const response = await this.api.get('/analytics/arpu');
      return response.data.arpu;
    } catch (error) {
      return 0;
    }
  }

  async calculateAOV() {
    try {
      const response = await this.api.get('/analytics/aov');
      return response.data.aov;
    } catch (error) {
      return 0;
    }
  }

  async calculateCLV() {
    try {
      const response = await this.api.get('/analytics/clv');
      return response.data.clv;
    } catch (error) {
      return 0;
    }
  }

  async calculateConversionRate() {
    try {
      const response = await this.api.get('/analytics/conversion');
      return response.data.conversionRate;
    } catch (error) {
      return 0;
    }
  }

  // Utility Methods
  generatePaymentId() {
    return `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getCurrentUserId() {
    try {
      const token = localStorage.getItem('touchgrass_access_token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  getUserTier() {
    return this.paymentState.subscription?.planId || 'free';
  }

  getDeviceId() {
    return localStorage.getItem('device_id') || 'unknown';
  }

  async getIPCountry() {
    try {
      const response = await fetch('https://ipapi.co/country/');
      return response.text();
    } catch (error) {
      return 'US';
    }
  }

  getUTMSource() {
    const params = new URLSearchParams(window.location.search);
    return params.get('utm_source') || 'direct';
  }

  getReferralCode() {
    const params = new URLSearchParams(window.location.search);
    return params.get('ref') || localStorage.getItem('referral_code');
  }

  // Event System
  emit(event, data) {
    // Implementation for event emission
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent(`payment:${event}`, { detail: data }));
    }
  }

  // UI Methods (to be implemented by UI layer)
  showPaymentSuccess(result) {
    // Show success modal or notification
    console.log('Payment successful:', result);
  }

  showSubscriptionSuccess(plan) {
    // Show subscription success modal
    console.log('Subscription successful:', plan);
  }

  showCancellationConfirmation() {
    // Show cancellation confirmation
    console.log('Subscription cancelled');
  }

  handlePaymentError(error) {
    // Show error to user based on error type
    console.error('Payment error:', error);
    
    const userMessages = {
      'CARD_DECLINED': 'Your card was declined. Please try another card.',
      'INSUFFICIENT_FUNDS': 'Insufficient funds. Please use a different payment method.',
      'EXPIRED_CARD': 'Your card has expired. Please update your card details.',
      'FRAUD_DETECTED': 'Payment flagged for security review. Please contact support.',
      'NETWORK_ERROR': 'Network error. Please try again.'
    };
    
    const message = userMessages[error.code] || 'Payment failed. Please try again.';
    
    // Show error modal
    this.showErrorModal(message, error.code);
  }

  showErrorModal(message, code) {
    // Implementation depends on UI framework
    console.error(`[${code}] ${message}`);
  }
}

// Supporting Classes
class PaymentAnalytics {
  trackPayment(data) {
    // Send to analytics services
    if (window.analytics) {
      window.analytics.track('payment_success', data);
    }
    
    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: data.paymentId,
        value: data.amount / 100,
        currency: data.currency,
        items: [{
          item_id: data.metadata?.productId,
          item_name: data.metadata?.productName
        }]
      });
    }
  }

  trackPaymentFailure(data) {
    if (window.analytics) {
      window.analytics.track('payment_failed', data);
    }
  }

  trackSubscription(data) {
    if (window.analytics) {
      window.analytics.track(data.event, data);
    }
  }
}

class FraudDetector {
  async analyzePayment(paymentData) {
    // Analyze payment for fraud patterns
    const riskFactors = [];
    let riskScore = 0;
    
    // Check for high amount
    if (paymentData.amount > 1000000) { // $10,000
      riskFactors.push('high_amount');
      riskScore += 30;
    }
    
    // Check for velocity (multiple payments in short time)
    const velocity = await this.checkPaymentVelocity(paymentData);
    if (velocity.high) {
      riskFactors.push('high_velocity');
      riskScore += 25;
    }
    
    // Check IP reputation
    const ipReputation = await this.checkIPReputation();
    if (ipReputation.risk > 50) {
      riskFactors.push('suspicious_ip');
      riskScore += 20;
    }
    
    // Check device fingerprint
    const deviceRisk = await this.checkDeviceRisk();
    if (deviceRisk.high) {
      riskFactors.push('risky_device');
      riskScore += 25;
    }
    
    return {
      riskScore: Math.min(riskScore, 100),
      riskFactors,
      shouldBlock: riskScore > 70
    };
  }

  async checkPaymentVelocity(paymentData) {
    // Check payment frequency
    return {
      high: false,
      count: 0,
      period: '1h'
    };
  }

  async checkIPReputation() {
    // Check IP against threat intelligence
    return {
      risk: 0,
      country: 'US',
      isProxy: false,
      isVPN: false
    };
  }

  async checkDeviceRisk() {
    // Check device fingerprint against known risky devices
    return {
      high: false,
      reason: ''
    };
  }
}

class RevenueManager {
  constructor() {
    this.revenueData = {
      totalRevenue: 0,
      recurringRevenue: 0,
      oneTimeRevenue: 0,
      refunds: 0,
      netRevenue: 0
    };
  }

  recordRevenue(data) {
    this.revenueData.totalRevenue += data.amount;
    
    if (data.metadata?.isRecurring) {
      this.revenueData.recurringRevenue += data.amount;
    } else {
      this.revenueData.oneTimeRevenue += data.amount;
    }
    
    this.revenueData.netRevenue = this.revenueData.totalRevenue - this.revenueData.refunds;
  }

  updateMetrics(metrics) {
    this.metrics = metrics;
  }
}

class SubscriptionManager {
  setSubscription(subscription) {
    this.subscription = subscription;
  }

  getSubscription() {
    return this.subscription;
  }

  isActive() {
    return this.subscription?.status === 'active';
  }

  getPlan() {
    return this.subscription?.planId;
  }

  getBillingPeriod() {
    return this.subscription?.interval;
  }

  getNextBillingDate() {
    if (!this.subscription?.currentPeriodEnd) return null;
    return new Date(this.subscription.currentPeriodEnd * 1000);
  }

  daysUntilRenewal() {
    const nextDate = this.getNextBillingDate();
    if (!nextDate) return null;
    
    const today = new Date();
    const diffTime = nextDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

class PaymentError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

// Export singleton instance
export default new PremiumPaymentService();