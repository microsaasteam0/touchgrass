import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  CheckCircle, Crown, Sparkles, Zap, Shield, Users, 
  Award, TrendingUp, Star, Gift, CreditCard, 
  Target, Battery, Clock, Heart, BarChart3,
  ExternalLink, ChevronRight, Loader2
} from 'lucide-react';
import { useRecoilValue } from 'recoil';
import { authState } from '../state/auth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Subscription = () => {
  const navigate = useNavigate();
  const auth = useRecoilValue(authState);
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('free');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Start your discipline journey',
      color: '#6b7280',
      icon: <Star className="w-8 h-8" />,
      features: [
        { text: 'Basic streak tracking', icon: <Target size={16} /> },
        { text: 'Daily verification', icon: <CheckCircle size={16} /> },
        { text: 'Public leaderboard access', icon: <TrendingUp size={16} /> },
        { text: '7-day streak limit', icon: <Clock size={16} /> },
        { text: 'Basic analytics', icon: <BarChart3 size={16} /> }
      ],
      cta: 'Current Plan',
      disabled: true,
      popular: false,
      gradient: 'from-gray-500 to-gray-700'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 14.99,
      period: '/month',
      description: 'For serious performers',
      color: '#fbbf24',
      icon: <Crown className="w-8 h-8" />,
      features: [
        { text: 'Unlimited streaks', icon: <Battery size={16} /> },
        { text: 'Advanced analytics dashboard', icon: <BarChart3 size={16} /> },
        { text: '5 streak freeze tokens/month', icon: <Zap size={16} /> },
        { text: 'Priority customer support', icon: <Shield size={16} /> },
        { text: 'Custom achievement badges', icon: <Award size={16} /> },
        { text: 'Ad-free experience', icon: <Heart size={16} /> },
        { text: 'Early access to features', icon: <Sparkles size={16} /> }
      ],
      cta: 'Get Pro',
      popular: true,
      badge: 'MOST POPULAR',
      gradient: 'from-premium-gold to-yellow-600'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 59.99,
      period: '/month',
      description: 'Teams & organizations',
      color: '#3b82f6',
      icon: <Users className="w-8 h-8" />,
      features: [
        { text: 'Everything in Pro', icon: <CheckCircle size={16} /> },
        { text: 'White-label solution', icon: <BarChart3 size={16} /> },
        { text: 'API access', icon: <Zap size={16} /> },
        { text: 'Custom reporting', icon: <BarChart3 size={16} /> },
        { text: 'Dedicated success manager', icon: <Users size={16} /> },
        { text: 'SLA guarantee', icon: <Shield size={16} /> },
        { text: 'Unlimited team members', icon: <Users size={16} /> }
      ],
      cta: 'Get Enterprise',
      popular: false,
      badge: 'FOR TEAMS',
      gradient: 'from-blue-500 to-indigo-600'
    }
  ];

  useEffect(() => {
    // Set current user plan
    if (auth.user?.subscription?.plan) {
      setCurrentPlan(auth.user.subscription.plan);
      if (auth.user.subscription.plan !== 'free') {
        setSelectedPlan(auth.user.subscription.plan);
      }
    }
  }, [auth.user]);

  const handleUpgrade = async (planId) => {
    console.log('handleUpgrade called for plan:', planId);
    
    if (!auth.isAuthenticated) {
      toast.error('Please login to upgrade');
      navigate('/auth');
      return;
    }

    if (planId === currentPlan) {
      toast.success('You already have this plan!');
      return;
    }

    setIsLoading(true);
    toast.loading('Opening Dodo payment...', { id: 'payment' });

    try {
      // Direct Dodo payment URLs from your .env
      const dodoUrls = {
        pro: 'https://checkout.dodopayments.com/buy/pdt_0NWPkwJJcZChm84jRPqIt',
        enterprise: 'https://checkout.dodopayments.com/buy/pdt_0NWPl4fuR5huBMtu7YAKT'
      };
      
      if (!dodoUrls[planId]) {
        throw new Error('Payment URL not found for this plan');
      }
      
      // Construct the Dodo payment URL
      let url = dodoUrls[planId] + '?quantity=1';
      
      // Add user metadata to URL
      if (auth.user) {
        const urlObj = new URL(url);
        urlObj.searchParams.append('client_reference_id', auth.user.id);
        if (auth.user.email) {
          urlObj.searchParams.append('prefilled_email', encodeURIComponent(auth.user.email));
        }
        urlObj.searchParams.append('product_name', `${planId === 'pro' ? 'Pro' : 'Enterprise'} Plan - TouchGrass`);
        url = urlObj.toString();
      }
      
      console.log('Opening Dodo payment URL:', url);
      
      // Open payment in new window
      const paymentWindow = window.open(
        url,
        'dodo_payment',
        'width=600,height=700,scrollbars=yes'
      );

      if (!paymentWindow) {
        toast.error('Please allow popups to complete payment');
        setIsLoading(false);
        toast.dismiss('payment');
        return;
      }

      // Monitor payment window
      const checkWindow = setInterval(() => {
        if (paymentWindow.closed) {
          clearInterval(checkWindow);
          toast.success('Payment completed! Updating your account...', { id: 'payment' });
          
          // You might want to add a webhook listener or poll the server
          // For now, we'll just reload after 3 seconds
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      }, 1000);

      // Timeout for checking payment
      setTimeout(() => {
        clearInterval(checkWindow);
      }, 60000); // 60 seconds timeout

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment setup failed. Please try again.', { id: 'payment' });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const handleFreePlan = () => {
    console.log('handleFreePlan called');
    if (auth.isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const subscriptionStyles = `
    .subscription-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%);
      color: white;
    }
    
    .premium-plan-highlight {
      position: relative;
      border: double 2px transparent;
      background-image: linear-gradient(#111827, #111827), 
                        linear-gradient(135deg, #fbbf24, #d97706, #fbbf24);
      background-origin: border-box;
      background-clip: padding-box, border-box;
      animation: premiumGlow 3s ease-in-out infinite;
    }
    
    @keyframes premiumGlow {
      0%, 100% {
        box-shadow: 0 0 40px rgba(251, 191, 36, 0.2);
      }
      50% {
        box-shadow: 0 0 60px rgba(251, 191, 36, 0.4);
      }
    }
    
    .plan-card {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      cursor: pointer;
    }
    
    .plan-card:hover {
      transform: translateY(-8px);
    }
    
    .plan-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--plan-color, #6b7280), transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .plan-card:hover::before {
      opacity: 1;
    }
    
    .feature-item {
      transition: all 0.3s ease;
      padding: 8px 0;
    }
    
    .feature-item:hover {
      transform: translateX(8px);
    }
    
    .dodo-payment-section {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
      backdrop-filter: blur(10px);
      border: 1px solid rgba(59, 130, 246, 0.2);
    }
    
    .money-back-guarantee {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05));
      border: 1px solid rgba(34, 197, 94, 0.2);
    }
    
    .faq-item {
      transition: all 0.3s ease;
    }
    
    .faq-item:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(34, 197, 94, 0.3);
    }
    
    .plan-badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      padding: 6px 20px;
      border-radius: 100px;
      font-weight: 700;
      font-size: 12px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      z-index: 10;
    }
    
    @media (max-width: 768px) {
      .subscription-container {
        padding: 20px 16px;
      }
      
      .plan-card {
        margin-bottom: 24px;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  return (
    <div className="subscription-container">
      <style>{subscriptionStyles}</style>
      
      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-grass-500/10 border border-grass-500/20 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Crown className="w-5 h-5 text-grass-400" />
              <span className="text-sm font-medium">Upgrade Your Account</span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Choose Your <span className="text-grass-400">Plan</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Start free, upgrade anytime. All payments processed securely via Dodo Payments.
            </motion.p>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => {
              const isCurrent = currentPlan === plan.id;
              const isSelected = selectedPlan === plan.id;
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: plans.indexOf(plan) * 0.1 }}
                  className={`plan-card relative p-8 rounded-3xl border-2 transition-all duration-300 ${
                    isSelected
                      ? 'border-grass-500 bg-gradient-to-br from-gray-900 to-gray-950 shadow-2xl'
                      : plan.popular
                      ? 'premium-plan-highlight'
                      : 'border-white/10 bg-gray-900/50 hover:border-white/20'
                  }`}
                  onClick={() => !plan.disabled && setSelectedPlan(plan.id)}
                  style={{ '--plan-color': plan.color }}
                >
                  {plan.badge && (
                    <div 
                      className="plan-badge"
                      style={{ 
                        background: `linear-gradient(135deg, ${plan.color}, ${plan.color}80)`,
                        color: '#1e293b'
                      }}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div 
                        className="p-3 rounded-xl"
                        style={{ 
                          background: `linear-gradient(135deg, ${plan.color}20, ${plan.color}40)`,
                          color: plan.color
                        }}
                      >
                        {plan.icon}
                      </div>
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                    </div>
                    
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      {plan.price === 0 ? (
                        <span className="text-5xl font-bold">Free</span>
                      ) : (
                        <>
                          <span className="text-5xl font-bold">${plan.price}</span>
                          <span className="text-gray-400">{plan.period}</span>
                        </>
                      )}
                    </div>
                    
                    <p className="text-gray-400">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="feature-item flex items-center gap-3">
                        <div 
                          className="p-1.5 rounded-lg"
                          style={{ 
                            background: `${plan.color}20`,
                            color: plan.color
                          }}
                        >
                          {feature.icon}
                        </div>
                        <span className="text-gray-300">{feature.text}</span>
                      </li>
                    ))}
                  </ul>

                  {/* FIXED BUTTON - Now correctly calls handleUpgrade for premium plan */}
                  <Button
                    variant={plan.popular ? "premium" : plan.id === 'free' ? "primary" : "secondary"}
                    size="large"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Button clicked for plan:', plan.id);
                      if (plan.id === 'free') {
                        handleFreePlan();
                      } else {
                        handleUpgrade(plan.id);
                      }
                    }}
                    isLoading={isLoading && selectedPlan === plan.id}
                    disabled={isCurrent || plan.disabled}
                    leftIcon={isCurrent ? <CheckCircle size={18} /> : 
                             plan.id === 'free' ? <Sparkles size={18} /> : 
                             <ExternalLink size={18} />}
                    animationType={plan.popular ? "ripple" : "none"}
                  >
                    {isLoading && selectedPlan === plan.id ? (
                      'Processing...'
                    ) : isCurrent ? (
                      'Current Plan'
                    ) : (
                      plan.cta
                    )}
                  </Button>

                  {isCurrent && (
                    <div className="mt-4 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-grass-500/10 border border-grass-500/20">
                        <CheckCircle className="w-4 h-4 text-grass-400" />
                        <span className="text-sm text-grass-400">Active Plan</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Dodo Payment Info */}
          <Card variant="glass" borderGradient className="mb-16 p-8 dodo-payment-section">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <div className="text-2xl">🕊️</div>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Secure Payment with Dodo</h3>
                <p className="text-gray-400">All payments processed securely via Dodo Payments</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card variant="glass" className="p-6 text-center">
                <CreditCard className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h4 className="font-bold mb-2">Secure Checkout</h4>
                <p className="text-sm text-gray-400">256-bit SSL encryption</p>
              </Card>
              
              <Card variant="glass" className="p-6 text-center">
                <Shield className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h4 className="font-bold mb-2">PCI DSS Compliant</h4>
                <p className="text-sm text-gray-400">Highest security standards</p>
              </Card>
              
              <Card variant="glass" className="p-6 text-center">
                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                <h4 className="font-bold mb-2">Instant Activation</h4>
                <p className="text-sm text-gray-400">Features available immediately</p>
              </Card>
            </div>
          </Card>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {[
                {
                  q: 'How does Dodo payment work?',
                  a: 'Click "Get Pro" or "Get Enterprise" to open a secure Dodo payment window. Complete your payment and your account will be upgraded automatically.'
                },
                {
                  q: 'Can I cancel my subscription?',
                  a: 'Yes, you can cancel anytime from your account settings. Your premium features remain until the billing period ends.'
                },
                {
                  q: 'What payment methods are accepted?',
                  a: 'Dodo accepts all major credit cards, debit cards, and other popular payment methods.'
                },
                {
                  q: 'Is my payment information secure?',
                  a: 'Yes! We never see your payment details. All payments are processed directly by Dodo Payments with bank-level security.'
                }
              ].map((faq, index) => (
                <Card 
                  key={index} 
                  variant="glass" 
                  hoverEffect="lift"
                  className="faq-item p-6"
                >
                  <h3 className="font-bold mb-2">{faq.q}</h3>
                  <p className="text-gray-400">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Money Back Guarantee */}
          <Card 
            variant="glass" 
            borderGradient 
            className="money-back-guarantee p-8 text-center"
          >
            <Gift className="w-16 h-16 text-grass-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">30-Day Money-Back Guarantee</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Not satisfied with your upgrade? Contact us within 30 days for a full refund, no questions asked.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Subscription;