import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Model';
import Confetti from '../components/ui/Confetti';

/**
 * Premium Subscription Page
 * Business-minded pricing with advanced animations and psychology
 */
const Subscription = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('elite');
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [isLoading, setIsLoading] = useState(false);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    // Load current user plan
    setCurrentPlan('free');
    createSubscriptionAnimations();
    return () => {
      particlesRef.current.forEach(p => clearInterval(p.interval));
    };
  }, []);

  const createSubscriptionAnimations = () => {
    const container = animationRef.current;
    if (!container) return;

    // Create floating premium particles
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'premium-particle';
      
      const symbols = ['⭐', '🌟', '✨', '💎', '👑', '🏆', '💫', '🔥'];
      particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      
      const size = 16 + Math.random() * 24;
      const left = Math.random() * 100;
      const duration = 8 + Math.random() * 12;
      const delay = Math.random() * 5;
      
      particle.style.fontSize = `${size}px`;
      particle.style.left = `${left}%`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.opacity = 0.1 + Math.random() * 0.3;
      
      container.appendChild(particle);
      
      // Add interval to reset position
      const interval = setInterval(() => {
        const newLeft = Math.random() * 100;
        particle.style.left = `${newLeft}%`;
      }, duration * 1000);
      
      particlesRef.current.push({ element: particle, interval });
    }
  };

  const plans = {
    free: {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Basic streak tracking for casual users',
      color: '#3b82f6',
      features: [
        '✅ Basic streak tracking',
        '✅ Daily verification',
        '❌ No streak protection',
        '❌ Limited leaderboard access',
        '❌ Basic analytics only',
        '❌ No priority support'
      ],
      cta: 'Current Plan',
      disabled: true
    },
    premium: {
      name: 'Premium',
      price: { monthly: 9.99, yearly: 99.99 },
      description: 'Advanced features for serious discipline builders',
      color: '#8b5cf6',
      features: [
        '✅ Everything in Free',
        '✅ Streak freeze tokens (3/month)',
        '✅ Advanced analytics dashboard',
        '✅ Full leaderboard access',
        '✅ Priority customer support',
        '✅ Custom achievement badges'
      ],
      cta: 'Upgrade to Premium',
      popular: false
    },
    elite: {
      name: 'Elite',
      price: { monthly: 19.99, yearly: 199.99 },
      description: 'Maximum accountability for peak performers',
      color: '#fbbf24',
      features: [
        '✅ Everything in Premium',
        '✅ Unlimited streak freezes',
        '✅ VIP leaderboard placement',
        '✅ 1-on-1 coaching sessions',
        '✅ Early access to new features',
        '✅ Custom challenge creation'
      ],
      cta: 'Go Elite',
      popular: true
    },
    team: {
      name: 'Team',
      price: { monthly: 49.99, yearly: 499.99 },
      description: 'Group accountability for organizations',
      color: '#10b981',
      features: [
        '✅ Everything in Elite',
        '✅ Team leaderboards & challenges',
        '✅ Admin dashboard & analytics',
        '✅ Custom branding options',
        '✅ Dedicated account manager',
        '✅ API access'
      ],
      cta: 'Contact Sales',
      enterprise: true
    }
  };

  const handleUpgrade = () => {
    if (selectedPlan === 'team') {
      // Open contact form for enterprise
      window.location.href = 'mailto:sales@touchgrass.now?subject=Team%20Plan%20Inquiry';
      return;
    }

    if (currentPlan === selectedPlan) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowPaymentModal(true);
    }, 500);
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/dashboard');
    }, 3000);
  };

  const calculateSavings = (plan) => {
    if (billingCycle === 'yearly') {
      const monthlyTotal = plans[plan].price.monthly * 12;
      const yearlyPrice = plans[plan].price.yearly;
      const savings = monthlyTotal - yearlyPrice;
      return {
        amount: savings.toFixed(2),
        percent: Math.round((savings / monthlyTotal) * 100)
      };
    }
    return { amount: '0', percent: 0 };
  };

  const pageStyles = `
    .subscription-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    .subscription-background {
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(circle at 20% 30%, rgba(251, 191, 36, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
      animation: backgroundFloat 20s ease-in-out infinite;
    }

    .subscription-content {
      position: relative;
      z-index: 2;
      max-width: 1400px;
      margin: 0 auto;
    }

    .subscription-header {
      text-align: center;
      margin-bottom: 4rem;
      animation: fadeInUp 0.6s ease-out;
    }

    .subscription-title {
      font-size: 3.5rem;
      font-weight: 900;
      background: linear-gradient(135deg, #fbbf24 0%, #d97706 50%, #8b5cf6 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 0 1rem 0;
      letter-spacing: -0.02em;
    }

    .subscription-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.7);
      margin: 0 0 2rem 0;
      line-height: 1.6;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .billing-toggle {
      display: inline-flex;
      align-items: center;
      gap: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 0.5rem;
      margin-top: 1rem;
    }

    .billing-option {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .billing-option:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .billing-option.active {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(21, 128, 61, 0.2) 100%);
      color: white;
    }

    .plans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
      animation: fadeInUp 0.6s ease-out 0.2s both;
    }

    .plan-card {
      position: relative;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 2rem;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .plan-card:hover {
      transform: translateY(-8px);
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .plan-card.selected {
      border-width: 2px;
      box-shadow: 0 0 40px rgba(var(--plan-color-rgb), 0.3);
    }

    .plan-card.popular::before {
      content: 'MOST POPULAR';
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #fbbf24, #d97706);
      color: #1c1917;
      padding: 0.5rem 1.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      z-index: 2;
      animation: popularPulse 2s ease-in-out infinite;
    }

    .plan-header {
      text-align: center;
      margin-bottom: 2rem;
      position: relative;
    }

    .plan-name {
      font-size: 2rem;
      font-weight: 700;
      color: white;
      margin: 0 0 0.5rem 0;
    }

    .plan-description {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
    }

    .plan-price {
      text-align: center;
      margin-bottom: 2rem;
    }

    .price-amount {
      font-size: 3.5rem;
      font-weight: 800;
      color: white;
      margin: 0;
      line-height: 1;
    }

    .price-period {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
      margin: 0.5rem 0 0 0;
    }

    .price-savings {
      display: inline-block;
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(21, 128, 61, 0.2) 100%);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #22c55e;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-top: 0.5rem;
      animation: savingsPulse 2s ease-in-out infinite;
    }

    .plan-features {
      flex: 1;
      margin-bottom: 2rem;
    }

    .feature-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.8);
    }

    .feature-item:last-child {
      border-bottom: none;
    }

    .feature-icon {
      font-size: 1rem;
      flex-shrink: 0;
    }

    .plan-actions {
      text-align: center;
    }

    .comparison-table {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 2rem;
      margin-bottom: 4rem;
      animation: fadeInUp 0.6s ease-out 0.4s both;
    }

    .comparison-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .comparison-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
      margin: 0 0 0.5rem 0;
    }

    .comparison-subtitle {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
    }

    .comparison-grid {
      display: grid;
      grid-template-columns: 2fr repeat(4, 1fr);
      gap: 1rem;
      overflow-x: auto;
    }

    .comparison-row {
      display: contents;
    }

    .comparison-cell {
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 60px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .comparison-cell:first-child {
      justify-content: flex-start;
      text-align: left;
    }

    .cell-header {
      font-weight: 600;
      color: white;
    }

    .cell-value {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.875rem;
    }

    .cell-check {
      color: #22c55e;
      font-size: 1.25rem;
    }

    .cell-cross {
      color: #ef4444;
      font-size: 1.25rem;
    }

    .cell-premium {
      color: #fbbf24;
      font-weight: 600;
    }

    .faq-section {
      margin-bottom: 4rem;
      animation: fadeInUp 0.6s ease-out 0.6s both;
    }

    .faq-title {
      font-size: 2rem;
      font-weight: 700;
      color: white;
      text-align: center;
      margin: 0 0 2rem 0;
    }

    .faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .faq-item {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 1.5rem;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .faq-item:hover {
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-4px);
    }

    .faq-question {
      font-size: 1rem;
      font-weight: 600;
      color: white;
      margin: 0 0 0.75rem 0;
    }

    .faq-answer {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      line-height: 1.6;
    }

    .premium-particle {
      position: absolute;
      pointer-events: none;
      z-index: 1;
      animation: premiumFloat linear infinite;
    }

    .current-plan-badge {
      display: inline-block;
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(21, 128, 61, 0.2) 100%);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #22c55e;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-top: 1rem;
    }

    .money-back-guarantee {
      text-align: center;
      padding: 2rem;
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(21, 128, 61, 0.1) 100%);
      border: 1px solid rgba(34, 197, 94, 0.2);
      border-radius: 20px;
      margin-top: 3rem;
      animation: guaranteePulse 3s ease-in-out infinite;
    }

    .guarantee-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .guarantee-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
      margin: 0 0 0.5rem 0;
    }

    .guarantee-text {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    @keyframes backgroundFloat {
      0%, 100% { transform: translate(0, 0); }
      25% { transform: translate(-10px, 10px); }
      50% { transform: translate(10px, -10px); }
      75% { transform: translate(-10px, -10px); }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes premiumFloat {
      0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 0.5;
      }
      90% {
        opacity: 0.5;
      }
      100% {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
      }
    }

    @keyframes popularPulse {
      0%, 100% { transform: translateX(-50%) scale(1); }
      50% { transform: translateX(-50%) scale(1.05); }
    }

    @keyframes savingsPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    @keyframes guaranteePulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.01); }
    }

    .payment-methods {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      gap: 0.5rem;
      margin: 1.5rem 0;
    }

    .payment-method {
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .payment-method:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .payment-method.selected {
      background: rgba(34, 197, 94, 0.2);
      border-color: rgba(34, 197, 94, 0.3);
    }

    @media (max-width: 1024px) {
      .plans-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .comparison-grid {
        grid-template-columns: 1.5fr repeat(4, 1fr);
      }
    }

    @media (max-width: 768px) {
      .subscription-container {
        padding: 1rem;
      }
      
      .subscription-title {
        font-size: 2.5rem;
      }
      
      .plans-grid {
        grid-template-columns: 1fr;
      }
      
      .billing-toggle {
        flex-direction: column;
        width: 100%;
      }
      
      .billing-option {
        width: 100%;
      }
      
      .comparison-grid {
        display: block;
      }
      
      .comparison-row {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }
      
      .comparison-cell {
        flex: 1;
        min-width: 100px;
      }
      
      .comparison-cell:first-child {
        flex-basis: 100%;
        margin-bottom: 0.5rem;
      }
    }
  `;

  const features = [
    { name: 'Daily Verification', free: '✅', premium: '✅', elite: '✅', team: '✅' },
    { name: 'Streak Freeze Tokens', free: '❌', premium: '3/month', elite: 'Unlimited', team: 'Unlimited' },
    { name: 'Advanced Analytics', free: '❌', premium: '✅', elite: '✅', team: '✅' },
    { name: 'Priority Support', free: '❌', premium: '✅', elite: '✅', team: '✅' },
    { name: 'Custom Challenges', free: '❌', premium: '❌', elite: '✅', team: '✅' },
    { name: 'Team Management', free: '❌', premium: '❌', elite: '❌', team: '✅' },
    { name: 'API Access', free: '❌', premium: '❌', elite: '❌', team: '✅' }
  ];

  const faqs = [
    {
      question: 'Can I switch plans later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and cryptocurrency. Enterprise plans also support invoicing.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'All paid plans come with a 7-day free trial. No credit card required to start.'
    },
    {
      question: 'What happens if I miss a payment?',
      answer: 'You\'ll have a 14-day grace period. After that, you\'ll be downgraded to Free until payment is made.'
    },
    {
      question: 'Can I get a refund?',
      answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, we\'ll refund your payment.'
    },
    {
      question: 'Do you offer discounts for non-profits?',
      answer: 'Yes, we offer special pricing for educational institutions and non-profit organizations.'
    }
  ];

  return (
    <>
      <style>{pageStyles}</style>
      <div className="subscription-container" ref={animationRef}>
        {showSuccess && <Confetti active={true} duration={3000} />}
        <div className="subscription-background" />
        
        <div className="subscription-content">
          <div className="subscription-header">
            <h1 className="subscription-title">Choose Your Discipline Level</h1>
            <p className="subscription-subtitle">
              Invest in your consistency. Higher tiers unlock powerful features that 
              leverage psychology to keep you accountable and build unbreakable habits.
            </p>
            
            <div className="billing-toggle">
              <button
                className={`billing-option ${billingCycle === 'monthly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly Billing
              </button>
              <button
                className={`billing-option ${billingCycle === 'yearly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('yearly')}
              >
                Yearly Billing
                <span style={{ 
                  marginLeft: '0.5rem',
                  background: 'rgba(34, 197, 94, 0.2)',
                  color: '#22c55e',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  Save 16%
                </span>
              </button>
            </div>
          </div>
          
          <div className="plans-grid">
            {Object.entries(plans).map(([key, plan]) => {
              const isSelected = selectedPlan === key;
              const isCurrent = currentPlan === key;
              const savings = calculateSavings(key);
              
              return (
                <Card
                  key={key}
                  className={`plan-card ${plan.popular ? 'popular' : ''} ${isSelected ? 'selected' : ''}`}
                  style={{
                    '--plan-color-rgb': plan.color.replace('#', '').match(/.{2}/g).map(c => parseInt(c, 16)).join(', '),
                    borderColor: isSelected ? plan.color : undefined
                  }}
                  hoverEffect="lift"
                  onClick={() => !plan.disabled && setSelectedPlan(key)}
                >
                  <div className="plan-header">
                    <h2 className="plan-name">{plan.name}</h2>
                    <p className="plan-description">{plan.description}</p>
                    
                    {isCurrent && (
                      <div className="current-plan-badge">
                        Current Plan
                      </div>
                    )}
                  </div>
                  
                  <div className="plan-price">
                    <h3 className="price-amount">
                      ${billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly}
                      <span style={{ fontSize: '1.5rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                        {plan.price.monthly === 0 ? '' : billingCycle === 'yearly' ? '/yr' : '/mo'}
                      </span>
                    </h3>
                    <p className="price-period">
                      {plan.price.monthly === 0 ? 'Forever free' : billingCycle === 'yearly' ? 'Billed annually' : 'Billed monthly'}
                    </p>
                    
                    {savings.percent > 0 && (
                      <div className="price-savings">
                        Save ${savings.amount} ({savings.percent}%)
                      </div>
                    )}
                  </div>
                  
                  <div className="plan-features">
                    <ul className="feature-list">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="feature-item">
                          <span className="feature-icon">
                            {feature.startsWith('✅') ? '✅' : '❌'}
                          </span>
                          <span>{feature.substring(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="plan-actions">
                    <Button
                      variant={plan.enterprise ? 'secondary' : plan.popular ? 'premium' : 'primary'}
                      size="large"
                      onClick={handleUpgrade}
                      disabled={plan.disabled || isCurrent}
                      isLoading={isLoading && selectedPlan === key}
                      fullWidth
                    >
                      {isCurrent ? 'Current Plan' : plan.cta}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
          
          <div className="comparison-table">
            <div className="comparison-header">
              <h2 className="comparison-title">Feature Comparison</h2>
              <p className="comparison-subtitle">See how each plan stacks up against your needs</p>
            </div>
            
            <div className="comparison-grid">
              <div className="comparison-row">
                <div className="comparison-cell cell-header">Feature</div>
                <div className="comparison-cell cell-header">Free</div>
                <div className="comparison-cell cell-header">Premium</div>
                <div className="comparison-cell cell-header">Elite</div>
                <div className="comparison-cell cell-header">Team</div>
              </div>
              
              {features.map((feature, index) => (
                <div key={index} className="comparison-row">
                  <div className="comparison-cell cell-value">{feature.name}</div>
                  <div className="comparison-cell">
                    {feature.free === '✅' ? (
                      <span className="cell-check">✅</span>
                    ) : feature.free === '❌' ? (
                      <span className="cell-cross">❌</span>
                    ) : (
                      <span className="cell-value">{feature.free}</span>
                    )}
                  </div>
                  <div className="comparison-cell">
                    {feature.premium === '✅' ? (
                      <span className="cell-check">✅</span>
                    ) : feature.premium === '❌' ? (
                      <span className="cell-cross">❌</span>
                    ) : (
                      <span className="cell-premium">{feature.premium}</span>
                    )}
                  </div>
                  <div className="comparison-cell">
                    {feature.elite === '✅' ? (
                      <span className="cell-check">✅</span>
                    ) : feature.elite === '❌' ? (
                      <span className="cell-cross">❌</span>
                    ) : (
                      <span className="cell-premium">{feature.elite}</span>
                    )}
                  </div>
                  <div className="comparison-cell">
                    {feature.team === '✅' ? (
                      <span className="cell-check">✅</span>
                    ) : feature.team === '❌' ? (
                      <span className="cell-cross">❌</span>
                    ) : (
                      <span className="cell-premium">{feature.team}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="faq-section">
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <div className="faq-grid">
              {faqs.map((faq, index) => (
                <Card key={index} className="faq-item" hoverEffect="lift">
                  <h3 className="faq-question">{faq.question}</h3>
                  <p className="faq-answer">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="money-back-guarantee">
            <div className="guarantee-icon">💯</div>
            <h3 className="guarantee-title">30-Day Money-Back Guarantee</h3>
            <p className="guarantee-text">
              We're confident TouchGrass will transform your discipline. 
              If you're not satisfied within 30 days, we'll refund your payment, no questions asked.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title={`Upgrade to ${plans[selectedPlan].name}`}
        size="medium"
      >
        <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px'
          }}>
            <div style={{
              fontSize: '2rem',
              color: plans[selectedPlan].color
            }}>
              {selectedPlan === 'elite' ? '⭐' : selectedPlan === 'premium' ? '💎' : '🚀'}
            </div>
            <div>
              <h3 style={{ color: 'white', margin: '0 0 0.25rem 0' }}>
                {plans[selectedPlan].name} Plan
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>
                ${billingCycle === 'yearly' 
                  ? `${plans[selectedPlan].price.yearly}/year` 
                  : `${plans[selectedPlan].price.monthly}/month`
                }
              </p>
            </div>
          </div>
          
          <h4 style={{ color: 'white', margin: '1.5rem 0 0.75rem 0' }}>Payment Method</h4>
          <div className="payment-methods">
            {['💳', '🏦', '💰', '🎴'].map((method, index) => (
              <div key={index} className="payment-method">
                {method}
              </div>
            ))}
          </div>
          
          <div style={{ margin: '1.5rem 0' }}>
            <input
              type="text"
              placeholder="Card Number"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '0.875rem',
                marginBottom: '0.75rem'
              }}
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <input
                type="text"
                placeholder="MM/YY"
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '0.875rem'
                }}
              />
              <input
                type="text"
                placeholder="CVC"
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          </div>
          
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#22c55e' }}>
              🔒 Your payment is secured with 256-bit encryption. We never store your card details.
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <Button
            variant="primary"
            onClick={handlePaymentComplete}
            fullWidth
            isLoading={isLoading}
          >
            💳 Pay ${billingCycle === 'yearly' 
              ? plans[selectedPlan].price.yearly 
              : plans[selectedPlan].price.monthly
            }
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowPaymentModal(false)}
            fullWidth
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Subscription;