import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Shield, Lock, CreditCard, Smartphone, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';
import SEO from '../components/seo/SEO';
import { SEO_CONFIG } from '../config/seo';

const DodoCheckout = () => {
  const { productType } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('processing');

  useEffect(() => {
    initializePayment();
  }, [productType]);

  const initializePayment = async () => {
    try {
      setLoading(true);
      
      // Determine what type of payment to create
      let endpoint = '/api/payments/create-streak-restoration';
      let data = {};
      
      if (productType === 'premium') {
        endpoint = '/api/payments/create-subscription';
        data = { planId: 'premium_monthly' };
      } else if (productType === 'elite') {
        endpoint = '/api/payments/create-subscription';
        data = { planId: 'elite_monthly' };
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setPaymentData(result);
        
        // Simulate payment processing (in real app, you'd integrate with Dodo SDK)
        simulatePaymentProcessing(result.paymentId);
      } else {
        toast.error('Failed to create payment');
        navigate('/subscription');
      }
    } catch (error) {
      toast.error('Payment initialization failed');
      navigate('/subscription');
    } finally {
      setLoading(false);
    }
  };

  const simulatePaymentProcessing = (paymentId) => {
    // This is a simulation - in a real app, you'd use Dodo Payments SDK
    setTimeout(() => {
      setPaymentStatus('success');
      toast.success('Payment processed successfully!');
      
      // Redirect after success
      setTimeout(() => {
        navigate('/payment/success');
      }, 2000);
    }, 3000);
  };

  const handlePaymentComplete = () => {
    setPaymentStatus('success');
    toast.success('Payment completed!');
  };

  const handlePaymentCancel = () => {
    navigate('/payment/cancel');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-grass-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Preparing Payment</h2>
          <p className="text-gray-400">Setting up secure checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Complete Your Purchase
          </h1>
          <p className="text-gray-400">
            Secure payment powered by Dodo Payments
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Order Summary */}
          <div className="md:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/10 p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
              
              {productType === 'streak_restoration' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Streak Restoration</span>
                    <span className="text-xl font-bold text-grass-400">$4.99</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Restores your broken streak and allows you to continue your progress
                  </div>
                </div>
              )}
              
              {productType === 'premium' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Premium Subscription</span>
                    <span className="text-xl font-bold text-premium-gold">$14.99/month</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Includes: Unlimited streaks, advanced analytics, streak freeze tokens
                  </div>
                </div>
              )}
              
              {productType === 'elite' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Elite Subscription</span>
                    <span className="text-xl font-bold text-premium-gold">$29.99/month</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Includes: All premium features + priority support, custom challenges, API access
                  </div>
                </div>
              )}
            </motion.div>

            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/10 p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">Payment Method</h2>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button className="p-4 border-2 border-grass-500 rounded-xl bg-grass-500/10 flex flex-col items-center justify-center">
                  <CreditCard className="w-8 h-8 mb-2 text-grass-400" />
                  <span className="text-sm font-medium">Card</span>
                </button>
                
                <button className="p-4 border border-white/10 rounded-xl hover:bg-white/5 transition-all duration-300 flex flex-col items-center justify-center">
                  <Smartphone className="w-8 h-8 mb-2 text-blue-400" />
                  <span className="text-sm font-medium">UPI</span>
                </button>
                
                <button className="p-4 border border-white/10 rounded-xl hover:bg-white/5 transition-all duration-300 flex flex-col items-center justify-center">
                  <Globe className="w-8 h-8 mb-2 text-purple-400" />
                  <span className="text-sm font-medium">Net Banking</span>
                </button>
                
                <button className="p-4 border border-white/10 rounded-xl hover:bg-white/5 transition-all duration-300 flex flex-col items-center justify-center">
                  <Smartphone className="w-8 h-8 mb-2 text-green-400" />
                  <span className="text-sm font-medium">Wallet</span>
                </button>
              </div>
              
              {/* Card Form (Simulated) */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-grass-500/50"
                    readOnly
                    value="4242 4242 4242 4242"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-grass-500/50"
                      readOnly
                      value="12/34"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-grass-500/50"
                      readOnly
                      value="123"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Payment Actions */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/10 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-green-400" />
                <div>
                  <div className="font-bold text-white">Secure Payment</div>
                  <div className="text-sm text-gray-400">256-bit SSL encryption</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-blue-400" />
                <div>
                  <div className="font-bold text-white">Protected by Dodo</div>
                  <div className="text-sm text-gray-400">PCI DSS compliant</div>
                </div>
              </div>
              
              <button
                onClick={handlePaymentComplete}
                disabled={paymentStatus === 'processing'}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  paymentStatus === 'processing'
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-grass-500 to-grass-600 hover:from-grass-600 hover:to-grass-700'
                }`}
              >
                {paymentStatus === 'processing' ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  'Complete Payment'
                )}
              </button>
              
              <button
                onClick={handlePaymentCancel}
                className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all duration-300"
              >
                Cancel Payment
              </button>
              
              <div className="mt-6 text-center text-sm text-gray-400">
                By completing this purchase, you agree to our Terms of Service
              </div>
            </motion.div>

            {/* Payment Status */}
            {paymentStatus === 'processing' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6 text-center"
              >
                <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
                <h3 className="font-bold text-white mb-2">Processing Payment</h3>
                <p className="text-blue-300 text-sm">
                  Please wait while we securely process your payment...
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Security Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-xs text-gray-400">SSL Secured</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-xs text-gray-400">PCI DSS</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-lg flex items-center justify-center">
              <div className="text-lg font-bold">🕊️</div>
            </div>
            <div className="text-xs text-gray-400">Dodo Payments</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DodoCheckout;