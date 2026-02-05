import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  CreditCard, Shield, CheckCircle, XCircle, 
  Loader, ArrowLeft, Zap, Crown, Users,
  Lock, Globe, Smartphone, Gift
} from 'lucide-react';
import paymentService from '../services/paymentService';
import { useRecoilValue } from 'recoil';
import { authState } from '../state/auth';
import SEO from '../components/seo/SEO';
import { SEO_CONFIG } from '../config/seo';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useRecoilValue(authState);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [products, setProducts] = useState({});

  // Plans data
  const plans = [
    {
      id: 'pro',
      name: 'Pro',
      price: 14.99,
      period: 'month',
      description: 'For serious performers',
      features: [
        'Unlimited streak tracking',
        'Advanced analytics dashboard',
        '5 streak freeze tokens/month',
        'Priority customer support',
        'Custom achievement badges',
        'Ad-free experience'
      ],
      badge: 'MOST POPULAR',
      color: '#fbbf24',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 59.99,
      period: 'month',
      description: 'Teams & organizations',
      features: [
        'Everything in Pro',
        'White-label solution',
        'API access',
        'Custom reporting',
        'Dedicated success manager',
        'SLA guarantee',
        'Unlimited users'
      ],
      badge: 'FOR TEAMS',
      color: '#3b82f6',
      popular: false
    },
    {
      id: 'streak_restoration',
      name: 'Streak Restoration',
      price: 4.99,
      period: 'one-time',
      description: 'Restore your broken streak',
      features: [
        'Restore broken streak',
        'Add 1 streak freeze token',
        'Continue from where you left off',
        'No questions asked'
      ],
      badge: 'QUICK FIX',
      color: '#ef4444',
      popular: false
    }
  ];

  useEffect(() => {
    // Load products
    loadProducts();
    
    // Check URL for plan parameter
    const queryParams = new URLSearchParams(location.search);
    const planId = queryParams.get('plan');
    
    if (planId) {
      const plan = plans.find(p => p.id === planId);
      if (plan) {
        setSelectedPlan(plan);
        handleStartPayment(plan);
      }
    }
  }, [location]);

  const loadProducts = async () => {
    try {
      const productsData = await paymentService.getProducts();
      setProducts(productsData);
    } catch (error) {
    }
  };

  const handleStartPayment = async (plan) => {
    if (!auth.isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/auth');
      return;
    }

    setIsProcessing(true);
    try {
      // Get checkout URL
      const checkout = await paymentService.getCheckoutUrl(plan.id);
      
      if (checkout.success) {
        setPaymentUrl(checkout.url);
        setShowPaymentModal(true);
        
        // Open payment in new window
        const paymentWindow = window.open(
          checkout.url,
          'dodo_payment',
          'width=600,height=700,scrollbars=yes'
        );
        
        if (!paymentWindow) {
          toast.error('Please allow popups to complete payment');
          setShowPaymentModal(false);
          return;
        }
        
        // Monitor payment window
        const checkWindow = setInterval(() => {
          if (paymentWindow.closed) {
            clearInterval(checkWindow);
            setShowPaymentModal(false);
            checkPaymentStatus();
          }
        }, 1000);
        
      } else {
        toast.error(checkout.error || 'Failed to create payment session');
      }
    } catch (error) {
      toast.error('Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      // In a real app, you'd have webhooks or poll your backend
      toast.success('Payment window closed. Please check your email for confirmation.');
      // Refresh user data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
    }
  };

  const handleDirectPayment = (plan) => {
    if (!auth.isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/auth');
      return;
    }

    const directUrls = {
      pro: 'https://checkout.dodopayments.com/buy/pdt_0NWPkwJJcZChm84jRPqIt?quantity=1',
      enterprise: 'https://checkout.dodopayments.com/buy/pdt_0NWPl4fuR5huBMtu7YAKT?quantity=1',
      test: 'https://test.checkout.dodopayments.com/buy/pdt_0NWPjjq1W9yybN1dR63eF?quantity=1'
    };

    let url = directUrls.pro;
    if (plan.id === 'enterprise') {
      url = directUrls.enterprise;
    } else if (import.meta.env.DEV) {
      url = directUrls.test;
    }

    // Add user metadata
    const urlObj = new URL(url);
    if (auth.user) {
      urlObj.searchParams.append('client_reference_id', auth.user.id);
      urlObj.searchParams.append('prefilled_email', auth.user.email);
    }

    window.open(urlObj.toString(), '_blank', 'width=600,height=700');
    
    toast.success('Opening Dodo Payments checkout...');
  };

  const renderPlanCard = (plan) => (
    <motion.div
      key={plan.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: plans.indexOf(plan) * 0.1 }}
      className={`relative p-8 rounded-3xl border-2 transition-all duration-300 ${
        selectedPlan?.id === plan.id
          ? 'border-grass-500 bg-gradient-to-br from-gray-900 to-gray-950'
          : plan.popular
          ? 'border-premium-gold/50 bg-gradient-to-br from-premium-gold/5 to-transparent'
          : 'border-white/10 bg-gray-900/50 hover:border-white/20'
      }`}
      onClick={() => setSelectedPlan(plan)}
    >
      {plan.badge && (
        <div 
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full font-bold text-sm"
          style={{ 
            background: plan.color, 
            color: '#1e293b',
            boxShadow: `0 0 20px ${plan.color}50`
          }}
        >
          {plan.badge}
        </div>
      )}
      
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        <div className="flex items-baseline justify-center gap-1 mb-2">
          <span className="text-5xl font-bold">${plan.price}</span>
          <span className="text-gray-400">/{plan.period}</span>
        </div>
        <p className="text-gray-400">{plan.description}</p>
      </div>
      
      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-grass-400 flex-shrink-0" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      
      <button
        onClick={() => handleStartPayment(plan)}
        disabled={isProcessing}
        className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${
          isProcessing
            ? 'bg-gray-700 cursor-not-allowed'
            : plan.popular
            ? 'bg-gradient-to-r from-premium-gold to-yellow-600 hover:from-premium-gold/90 hover:to-yellow-600/90 hover:scale-105'
            : 'bg-gradient-to-r from-grass-500 to-grass-600 hover:from-grass-600 hover:to-grass-700 hover:scale-105'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <Loader className="w-5 h-5 animate-spin" />
            Processing...
          </div>
        ) : plan.id === 'streak_restoration' ? (
          'Restore Streak'
        ) : (
          `Get ${plan.name}`
        )}
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDirectPayment(plan);
        }}
        className="w-full mt-3 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300"
      >
        Direct Checkout
      </button>
    </motion.div>
  );

  const renderPaymentModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => setShowPaymentModal(false)}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="text-2xl">🕊️</div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Complete Payment via Dodo</h2>
            <p className="text-gray-400">You'll be redirected to secure Dodo payment gateway</p>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="text-sm text-gray-400 mb-1">Plan</div>
              <div className="font-bold">{selectedPlan?.name} - ${selectedPlan?.price}/{selectedPlan?.period}</div>
            </div>
            
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="text-sm text-gray-400 mb-1">Payment Method</div>
              <div className="font-bold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  🕊️
                </div>
                Dodo Payment Gateway
              </div>
            </div>
            
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <div className="flex items-center gap-2 text-green-400">
                <Shield className="w-4 h-4" />
                <span className="text-sm">256-bit SSL encrypted • PCI DSS compliant</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-bold text-center transition-all duration-300 hover:scale-105"
              onClick={() => setShowPaymentModal(false)}
            >
              Proceed to Dodo Payment
            </a>
            
            <button
              onClick={() => setShowPaymentModal(false)}
              className="block w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
        
        <div className="p-4 bg-black/20 border-t border-white/10">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <Lock className="w-4 h-4" />
            Secure payment powered by Dodo Payments
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Crown className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium">Secure Payment via Dodo</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Choose Your <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Premium</span> Plan
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Secure monthly payments via Dodo Payments. Get premium features immediately after payment.
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map(renderPlanCard)}
          </div>

          {/* Dodo Payment Info */}
          <div className="mb-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <div className="text-2xl">🕊️</div>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Powered by Dodo Payments</h3>
                <p className="text-gray-400">Secure payment processing trusted by thousands of businesses</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white/5 rounded-2xl">
                <Shield className="w-8 h-8 text-green-400 mb-4" />
                <h4 className="font-bold mb-2">Bank-Level Security</h4>
                <p className="text-sm text-gray-400">256-bit SSL encryption and PCI DSS compliance</p>
              </div>
              
              <div className="p-6 bg-white/5 rounded-2xl">
                <Zap className="w-8 h-8 text-yellow-400 mb-4" />
                <h4 className="font-bold mb-2">Instant Activation</h4>
                <p className="text-sm text-gray-400">Get premium features immediately after payment</p>
              </div>
              
              <div className="p-6 bg-white/5 rounded-2xl">
                <Gift className="w-8 h-8 text-purple-400 mb-4" />
                <h4 className="font-bold mb-2">7-Day Guarantee</h4>
                <p className="text-sm text-gray-400">Full refund if not satisfied within 7 days</p>
              </div>
            </div>
          </div>

          {/* Security & Trust */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl border border-white/10 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Lock className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Payment</h3>
              <p className="text-gray-400">Your payment information is encrypted and secure</p>
            </div>
            
            <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl border border-white/10 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <Zap className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Activation</h3>
              <p className="text-gray-400">Get premium features immediately after payment</p>
            </div>
            
            <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl border border-white/10 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Cancel Anytime</h3>
              <p className="text-gray-400">No long-term contracts, cancel your subscription anytime</p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {[
                {
                  q: 'How does Dodo payment work?',
                  a: 'Dodo Payments is a secure payment gateway. You\'ll be redirected to their secure payment page to complete your transaction.'
                },
                {
                  q: 'Can I cancel my subscription?',
                  a: 'Yes, you can cancel anytime from your account settings. Your premium features will remain active until the end of your billing period.'
                },
                {
                  q: 'Is there a free trial?',
                  a: 'The free plan includes basic features. Premium plans start immediately after payment.'
                },
                {
                  q: 'What payment methods are accepted?',
                  a: 'We accept all major credit/debit cards and digital wallets through Dodo payment gateway.'
                }
              ].map((faq, index) => (
                <div key={index} className="p-6 bg-gray-900/50 rounded-2xl border border-white/10">
                  <h3 className="font-bold mb-2">{faq.q}</h3>
                  <p className="text-gray-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {showPaymentModal && renderPaymentModal()}
    </div>
  );
};

export default PaymentPage;