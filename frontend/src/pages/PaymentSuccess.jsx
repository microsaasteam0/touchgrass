import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import paymentService from '../services/paymentService';
import SEO from '../components/seo/SEO';
import { SEO_CONFIG } from '../config/seo';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const paymentId = query.get('payment_id') || query.get('id') || query.get('session_id');
    const productType = query.get('type') || query.get('product');
    const amount = query.get('amount');

    if (paymentId) {
      verifyPayment(paymentId, productType, amount);
    } else {
      setVerifying(false);
      toast.error('Missing payment information');
      setTimeout(() => navigate('/'), 3000);
    }
  }, [location]);

  const verifyPayment = async (paymentId, productType, amount) => {
    try {
      setVerifying(true);
      
      // Try to get payment status
      const status = await paymentService.getPaymentStatus(paymentId);
      
      if (status.success) {
        setPaymentDetails(status);
        setVerified(true);
        
        // Verify with backend
        if (productType && amount) {
          const verification = await paymentService.verifyPayment(paymentId, productType, amount);
          
          if (verification.success) {
            toast.success('Payment verified! Account updated successfully.');
            
            // Refresh user data
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }
        } else {
          toast.success('Payment successful! Please wait while we update your account...');
        }
      } else {
        toast.error('Payment verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Payment received! Account update may take a few minutes.');
    } finally {
      setVerifying(false);
    }
  };

  const getProductName = (type) => {
    switch(type) {
      case 'pro': return 'TouchGrass Pro';
      case 'enterprise': return 'TouchGrass Enterprise';
      case 'streak_restoration': return 'Streak Restoration';
      default: return 'Premium Plan';
    }
  };

  const query = new URLSearchParams(location.search);
  const productType = query.get('type') || query.get('product');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-2xl p-8 text-center">
          {verifying ? (
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <RefreshCw className="w-10 h-10 text-blue-400 animate-spin" />
            </div>
          ) : (
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          )}
          
          <h2 className="text-3xl font-bold text-white mb-4">
            {verifying ? 'Verifying Payment...' : 'Payment Successful! 🎉'}
          </h2>
          
          {verifying ? (
            <div className="mb-6">
              <div className="text-lg font-bold text-white mb-2">Verifying your payment...</div>
              <div className="text-gray-400">Please wait while we confirm your payment</div>
              <div className="mt-4 w-full bg-gray-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          ) : verified ? (
            <div className="mb-6">
              <div className="text-xl font-bold text-white mb-2">
                Welcome to {getProductName(productType)}!
              </div>
              {productType === 'streak_restoration' ? (
                <p className="text-gray-300">Your streak has been restored. You can now continue your journey!</p>
              ) : (
                <p className="text-gray-300">Your account has been upgraded. Enjoy premium features!</p>
              )}
              {paymentDetails && paymentDetails.amount && (
                <div className="mt-4 px-4 py-2 bg-white/5 rounded-lg inline-block">
                  <div className="text-sm text-gray-400">Amount Paid</div>
                  <div className="text-2xl font-bold text-green-400">${paymentDetails.amount}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-6">
              <div className="text-lg text-yellow-400 mb-2">
                Payment received! Verification pending...
              </div>
              <p className="text-gray-400">
                Your payment was successful. Account upgrade may take a few minutes.
                If you don't see changes soon, please refresh the page.
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300"
            >
              <ArrowRight className="w-5 h-5" />
              Go to Dashboard
            </button>
            
            <button
              onClick={() => navigate('/subscription')}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300"
            >
              View Subscription
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-transparent hover:bg-white/5 border border-white/10 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-500">
              Need help? Contact support@touchgrass.now
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Payment processed securely via Dodo Payments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;