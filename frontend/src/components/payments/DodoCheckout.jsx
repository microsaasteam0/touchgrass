import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, ExternalLink, CheckCircle, XCircle, AlertCircle, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import paymentService from '../../services/paymentService';
import { useRecoilValue } from 'recoil';
import { authState } from '../../state/auth';

const DodoCheckoutRedirect = () => {
  const { productType } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useRecoilValue(authState);
  const [loading, setLoading] = useState(true);
  const [checkoutData, setCheckoutData] = useState(null);
  const [error, setError] = useState(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/auth');
      return;
    }

    initializeCheckout();
  }, [productType, auth.isAuthenticated]);

  const initializeCheckout = async () => {
    try {
      setLoading(true);
      
      // Get checkout URL from backend
      const response = await paymentService.getCheckoutUrl(productType);
      setCheckoutData(response);
      
      toast.success('Checkout ready! Redirecting to secure payment...');
      
      // Auto-redirect after 3 seconds
      setTimeout(() => {
        handleRedirect(response.checkoutUrl);
      }, 3000);
      
    } catch (err) {
      console.error('Checkout initialization error:', err);
      setError(err.response?.data?.error || 'Failed to initialize checkout');
      toast.error('Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = (url) => {
    if (!url) return;
    
    setRedirecting(true);
    toast.loading('Opening secure payment page...');
    
    // Open Dodo checkout in new tab
    window.open(url, '_blank');
    
    // Show success message
    setTimeout(() => {
      toast.success('Payment page opened in new tab!');
      setRedirecting(false);
      
      // Redirect back to subscription page after 5 seconds
      setTimeout(() => {
        navigate('/subscription');
      }, 5000);
    }, 1000);
  };

  const getProductInfo = () => {
    const products = {
      pro: {
        name: 'TouchGrass Pro',
        price: '$14.99/month',
        features: ['Unlimited streaks', 'Advanced analytics', '5 freeze tokens', 'Priority support'],
        color: 'from-blue-500 to-blue-600'
      },
      enterprise: {
        name: 'TouchGrass Enterprise',
        price: '$59.99/month',
        features: ['Everything in Pro', 'White-label', 'API access', 'Custom reporting', '10 freeze tokens'],
        color: 'from-purple-500 to-purple-600'
      },
      streak_restoration: {
        name: 'Streak Restoration',
        price: '$4.99 one-time',
        features: ['Restore broken streak', 'Add 1 freeze token', 'Continue progress', 'No penalty'],
        color: 'from-green-500 to-green-600'
      }
    };
    
    return products[productType] || products.pro;
  };

  const productInfo = getProductInfo();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Preparing Checkout</h2>
          <p className="text-gray-400">Setting up secure payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="max-w-md w-full mx-4">
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-2xl p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-3">Checkout Error</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => navigate('/subscription')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-300"
            >
              Back to Subscription
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Complete Your Payment
            </h1>
            <p className="text-xl text-gray-400">
              You're upgrading to {productInfo.name}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Order Summary */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/10 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-400">Product</span>
                    <span className="font-bold text-white">{productInfo.name}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-400">Price</span>
                    <span className="text-2xl font-bold text-green-400">{productInfo.price}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-400">Payment Method</span>
                    <span className="font-bold text-white">Dodo Payments</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-400">Status</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-bold">
                      {redirecting ? 'Redirecting...' : 'Ready to Pay'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/10 p-8">
                <h3 className="text-xl font-bold text-white mb-4">What You Get</h3>
                <ul className="space-y-3">
                  {productInfo.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column - Payment Instructions */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/10 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Payment Instructions</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-xl">1️⃣</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Click the Payment Button</h4>
                      <p className="text-gray-400">You'll be redirected to Dodo Payments' secure checkout</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-xl">2️⃣</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Complete Payment</h4>
                      <p className="text-gray-400">Use any payment method available (Card, UPI, Net Banking)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <span className="text-xl">3️⃣</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Automatic Upgrade</h4>
                      <p className="text-gray-400">Your account will be upgraded automatically after successful payment</p>
                    </div>
                  </div>
                </div>
                
                {/* Security Badges */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <h4 className="font-bold text-white mb-4">Secure Payment</h4>
                  <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                      <span className="text-sm text-green-400">🔒 SSL Encrypted</span>
                    </div>
                    <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                      <span className="text-sm text-blue-400">🛡️ PCI DSS Compliant</span>
                    </div>
                    <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                      <span className="text-sm text-yellow-400">⚡ Instant Activation</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={() => checkoutData && handleRedirect(checkoutData.checkoutUrl)}
                  disabled={redirecting || !checkoutData}
                  className={`w-full py-4 bg-gradient-to-r ${productInfo.color} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300`}
                >
                  {redirecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Opening Payment Page...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-5 h-5" />
                      Proceed to Secure Checkout
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => navigate('/subscription')}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300"
                >
                  Cancel & Return
                </button>
                
                <p className="text-center text-sm text-gray-500">
                  By completing payment, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-12 p-6 bg-gradient-to-br from-blue-500/5 to-blue-600/5 border border-blue-500/20 rounded-2xl">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Need Help?</h3>
                <p className="text-gray-400">
                  If you encounter any issues during payment or don't see your account upgraded within 5 minutes, 
                  please contact our support team at support@touchgrass.now
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DodoCheckoutRedirect;