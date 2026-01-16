import React, { useState } from 'react';

const PricingCard = ({ plan, isPopular = false, onSelect }) => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [hover, setHover] = useState(false);

  const monthlyPrice = plan.price;
  const yearlyPrice = Math.floor(plan.price * 12 * 0.8);

  const features = [
    `${plan.streakFreezes} streak freeze tokens`,
    'Advanced analytics dashboard',
    'Priority leaderboard ranking',
    'Custom achievement badges',
    'Email support',
    'Team management',
    'API access',
    'White labeling'
  ];

  return (
    <>
      <style jsx>{`
        .pricing-card {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.4) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 32px;
          padding: 40px;
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .pricing-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at top right, rgba(34, 197, 94, 0.1), transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .pricing-card:hover::before {
          opacity: 1;
        }

        .pricing-card.hover {
          transform: translateY(-20px);
          border-color: rgba(34, 197, 94, 0.3);
          box-shadow: 
            0 40px 80px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(34, 197, 94, 0.1),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
        }

        .pricing-card.popular {
          border: 2px solid #22c55e;
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.5) 100%);
          transform: scale(1.05);
          z-index: 1;
        }

        .pricing-card.popular:hover {
          transform: scale(1.05) translateY(-20px);
        }

        .pricing-card-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          padding: 8px 24px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          z-index: 2;
        }

        .pricing-card-badge-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120%;
          height: 200%;
          background: radial-gradient(circle, rgba(34, 197, 94, 0.4), transparent 70%);
          filter: blur(20px);
          z-index: -1;
          animation: badgeGlow 2s ease-in-out infinite;
        }

        @keyframes badgeGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }

        .pricing-card-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .pricing-card-icon {
          font-size: 48px;
          margin-bottom: 20px;
          display: inline-block;
          animation: iconFloat 6s ease-in-out infinite;
        }

        @keyframes iconFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(5deg); }
          66% { transform: translateY(-5px) rotate(-5deg); }
        }

        .pricing-card-title {
          font-size: 28px;
          font-weight: 700;
          color: white;
          margin: 0 0 12px 0;
        }

        .pricing-card-description {
          color: #94a3b8;
          font-size: 15px;
          line-height: 1.6;
          margin: 0;
        }

        .pricing-card-price {
          text-align: center;
          margin-bottom: 32px;
          padding-bottom: 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .pricing-card-price-amount {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 4px;
          margin-bottom: 8px;
        }

        .pricing-card-currency {
          font-size: 24px;
          font-weight: 600;
          color: #94a3b8;
        }

        .pricing-card-number {
          font-size: 64px;
          font-weight: 800;
          background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .pricing-card-period {
          font-size: 16px;
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .pricing-card-savings {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: #0f172a;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
        }

        .pricing-card-billing-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 8px;
          margin-bottom: 32px;
          position: relative;
        }

        .pricing-card-toggle-slider {
          position: absolute;
          top: 8px;
          height: calc(100% - 16px);
          width: calc(50% - 8px);
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          border-radius: 12px;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .pricing-card-billing-toggle:has(.pricing-card-toggle-option:nth-child(3).active) .pricing-card-toggle-slider {
          transform: translateX(100%);
        }

        .pricing-card-toggle-option {
          flex: 1;
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border-radius: 12px;
          z-index: 1;
          transition: color 0.3s ease;
        }

        .pricing-card-toggle-option.active {
          color: white;
        }

        .pricing-card-features {
          display: grid;
          gap: 16px;
          margin-bottom: 40px;
        }

        .pricing-card-feature {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #cbd5e1;
          font-size: 15px;
        }

        .pricing-card-button {
          width: 100%;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          border: none;
          padding: 20px 32px;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
        }

        .pricing-card-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s;
        }

        .pricing-card-button:hover::before {
          left: 100%;
        }

        .pricing-card-button:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 20px 40px rgba(59, 130, 246, 0.3),
            0 0 0 1px rgba(59, 130, 246, 0.2);
        }

        .pricing-card-button.popular-button {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        }

        .pricing-card-button.popular-button:hover {
          box-shadow: 
            0 20px 40px rgba(34, 197, 94, 0.3),
            0 0 0 1px rgba(34, 197, 94, 0.2);
        }

        .pricing-card-button-arrow {
          font-size: 20px;
          transition: transform 0.3s ease;
        }

        .pricing-card-button:hover .pricing-card-button-arrow {
          transform: translateX(6px);
        }

        .pricing-card-roi {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(34, 197, 94, 0.05);
          border: 1px solid rgba(34, 197, 94, 0.1);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .pricing-card-roi-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .pricing-card-roi-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .pricing-card-roi-content span {
          font-size: 13px;
          color: #94a3b8;
        }

        .pricing-card-roi-content strong {
          font-size: 18px;
          color: #22c55e;
          font-weight: 700;
        }

        .pricing-card-trust {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
        }

        .pricing-card-trust-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
          font-size: 13px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }
      `}</style>

      <div 
        className={`pricing-card ${isPopular ? 'popular' : ''} ${hover ? 'hover' : ''}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        data-aos="fade-up"
        data-aos-delay={plan.delay || 0}
      >
        {isPopular && (
          <div className="pricing-card-badge">
            <span>MOST POPULAR</span>
            <div className="pricing-card-badge-glow"></div>
          </div>
        )}

        <div className="pricing-card-header">
          <div className="pricing-card-icon">
            {plan.icon}
          </div>
          <h3 className="pricing-card-title">{plan.name}</h3>
          <p className="pricing-card-description">{plan.description}</p>
        </div>

        <div className="pricing-card-price">
          <div className="pricing-card-price-amount">
            <span className="pricing-card-currency">$</span>
            <span className="pricing-card-number">
              {billingPeriod === 'monthly' ? monthlyPrice : yearlyPrice}
            </span>
          </div>
          <div className="pricing-card-period">
            {billingPeriod === 'monthly' ? '/month' : '/year'}
            {billingPeriod === 'yearly' && (
              <span className="pricing-card-savings">Save 20%</span>
            )}
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="pricing-card-billing-toggle">
          <button 
            className={`pricing-card-toggle-option ${billingPeriod === 'monthly' ? 'active' : ''}`}
            onClick={() => setBillingPeriod('monthly')}
          >
            Monthly
          </button>
          <div className="pricing-card-toggle-slider"></div>
          <button 
            className={`pricing-card-toggle-option ${billingPeriod === 'yearly' ? 'active' : ''}`}
            onClick={() => setBillingPeriod('yearly')}
          >
            Yearly
          </button>
        </div>

        {/* Features List */}
        <div className="pricing-card-features">
          {features.slice(0, plan.featureCount).map((feature, index) => (
            <div key={index} className="pricing-card-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button 
          className={`pricing-card-button ${isPopular ? 'popular-button' : ''}`}
          onClick={() => onSelect(plan)}
        >
          {plan.cta}
          <span className="pricing-card-button-arrow">→</span>
        </button>

        {/* ROI Calculator */}
        <div className="pricing-card-roi">
          <div className="pricing-card-roi-icon">📈</div>
          <div className="pricing-card-roi-content">
            <span>Estimated ROI</span>
            <strong>+{plan.roi}% productivity</strong>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="pricing-card-trust">
          <div className="pricing-card-trust-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#22C55E" strokeWidth="2"/>
            </svg>
            <span>30-day guarantee</span>
          </div>
          <div className="pricing-card-trust-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#22C55E" strokeWidth="2"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 013.417 1.415 2 2 0 01-.587 1.415l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="#22C55E" strokeWidth="2"/>
            </svg>
            <span>24/7 support</span>
          </div>
        </div>
      </div>
    </>
  );
};

const PricingSection = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      icon: '🌱',
      description: 'Perfect for individuals starting their journey',
      price: 9,
      streakFreezes: 3,
      featureCount: 4,
      cta: 'Start Free Trial',
      roi: 25,
      delay: 100
    },
    {
      id: 'professional',
      name: 'Professional',
      icon: '🚀',
      description: 'For serious professionals and teams',
      price: 29,
      streakFreezes: 10,
      featureCount: 6,
      cta: 'Get Started',
      roi: 42,
      delay: 200,
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: '🏢',
      description: 'For organizations & large teams',
      price: 99,
      streakFreezes: 'Unlimited',
      featureCount: 8,
      cta: 'Contact Sales',
      roi: 67,
      delay: 300
    }
  ];

  return (
    <>
      <style jsx>{`
        .pricing-section {
          padding: 80px 40px;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
        }

        .pricing-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #22c55e, transparent);
          opacity: 0.3;
        }

        .pricing-section-header {
          text-align: center;
          margin-bottom: 80px;
          position: relative;
        }

        .pricing-section-badge {
          display: inline-block;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #22c55e;
          padding: 10px 24px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 1px;
          margin-bottom: 32px;
          animation: badgeFloat 3s ease-in-out infinite;
        }

        @keyframes badgeFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .pricing-section-title {
          font-size: 48px;
          font-weight: 800;
          background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 24px 0;
          line-height: 1.2;
        }

        .pricing-section-title-highlight {
          background: linear-gradient(135deg, #22c55e 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
        }

        .pricing-section-subtitle {
          font-size: 18px;
          color: #94a3b8;
          max-width: 600px;
          margin: 0 auto 48px;
          line-height: 1.6;
        }

        .pricing-section-billing-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-top: 48px;
        }

        .pricing-section-billing-label {
          color: #94a3b8;
          font-size: 16px;
          font-weight: 500;
        }

        .pricing-section-toggle {
          position: relative;
          display: inline-block;
          width: 80px;
          height: 40px;
        }

        .pricing-section-toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .pricing-section-toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: .4s;
          border-radius: 40px;
        }

        .pricing-section-toggle-slider:before {
          position: absolute;
          content: "";
          height: 32px;
          width: 32px;
          left: 4px;
          bottom: 3px;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          transition: .4s;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        input:checked + .pricing-section-toggle-slider:before {
          transform: translateX(40px);
        }

        .pricing-section-billing-save {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: #0f172a;
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 700;
          animation: pulseGold 2s infinite;
        }

        @keyframes pulseGold {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.3); }
          50% { box-shadow: 0 0 40px rgba(251, 191, 36, 0.6); }
        }

        .pricing-cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
          margin-bottom: 80px;
        }

        .pricing-comparison {
          margin-bottom: 80px;
        }

        .pricing-comparison h3 {
          font-size: 32px;
          font-weight: 700;
          color: white;
          text-align: center;
          margin: 0 0 48px 0;
        }

        .pricing-comparison-table {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.4) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          overflow: hidden;
        }

        .pricing-comparison-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .pricing-comparison-feature,
        .pricing-comparison-plan {
          padding: 24px;
          font-weight: 600;
          color: white;
        }

        .pricing-comparison-feature {
          font-size: 16px;
        }

        .pricing-comparison-plan {
          text-align: center;
          font-size: 14px;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
        }

        .pricing-comparison-plan.popular {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
          position: relative;
        }

        .pricing-comparison-plan.popular::before {
          content: 'POPULAR';
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          padding: 4px 16px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .pricing-comparison-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .pricing-comparison-row:last-child {
          border-bottom: none;
        }

        .pricing-comparison-row > div {
          padding: 20px 24px;
          color: #94a3b8;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
        }

        .pricing-comparison-row > div:first-child {
          border-left: none;
          color: #cbd5e1;
          font-size: 15px;
        }

        .pricing-trust-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
          margin-bottom: 80px;
        }

        .pricing-trust-card {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.4) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 32px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .pricing-trust-card:hover {
          transform: translateY(-8px);
          border-color: rgba(34, 197, 94, 0.3);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(34, 197, 94, 0.1);
        }

        .pricing-trust-icon {
          font-size: 48px;
          margin-bottom: 20px;
          display: inline-block;
          animation: trustIconFloat 4s ease-in-out infinite;
        }

        @keyframes trustIconFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.1); }
        }

        .pricing-trust-card h4 {
          font-size: 20px;
          font-weight: 600;
          color: white;
          margin: 0 0 12px 0;
        }

        .pricing-trust-card p {
          color: #94a3b8;
          font-size: 15px;
          line-height: 1.6;
          margin: 0;
        }

        .pricing-faq {
          max-width: 800px;
          margin: 0 auto;
        }

        .pricing-faq h3 {
          font-size: 32px;
          font-weight: 700;
          color: white;
          text-align: center;
          margin: 0 0 48px 0;
        }

        .pricing-faq-grid {
          display: grid;
          gap: 16px;
        }

        .pricing-faq-item {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.4) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .pricing-faq-item:hover {
          border-color: rgba(34, 197, 94, 0.3);
        }

        .pricing-faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          cursor: pointer;
        }

        .pricing-faq-question h4 {
          font-size: 18px;
          font-weight: 600;
          color: white;
          margin: 0;
        }

        .pricing-faq-toggle {
          font-size: 24px;
          color: #94a3b8;
          transition: transform 0.3s ease;
        }

        .pricing-faq-item:hover .pricing-faq-toggle {
          color: #22c55e;
          transform: rotate(45deg);
        }

        .pricing-faq-answer {
          padding: 0 24px 24px;
          color: #94a3b8;
          font-size: 15px;
          line-height: 1.6;
          display: none;
        }

        .pricing-faq-item:hover .pricing-faq-answer {
          display: block;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          .pricing-card.popular {
            transform: scale(1);
          }
          
          .pricing-card.popular:hover {
            transform: translateY(-20px);
          }
        }

        @media (max-width: 768px) {
          .pricing-section {
            padding: 40px 24px;
          }
          
          .pricing-section-title {
            font-size: 36px;
          }
          
          .pricing-cards-container {
            grid-template-columns: 1fr;
          }
          
          .pricing-comparison-header,
          .pricing-comparison-row {
            grid-template-columns: 2fr 1fr 1fr;
          }
          
          .pricing-comparison-header > div:last-child,
          .pricing-comparison-row > div:last-child {
            display: none;
          }
        }
      `}</style>

      <div className="pricing-section">
        <div className="pricing-section-header">
          <div className="pricing-section-badge">
            <span>TRUSTED BY 42,857+ PROFESSIONALS</span>
          </div>
          <h2 className="pricing-section-title">
            Simple, Transparent Pricing
            <span className="pricing-section-title-highlight"> That Scales With You</span>
          </h2>
          <p className="pricing-section-subtitle">
            Join companies like Google, Stripe, and Shopify who use TouchGrass to build discipline at scale
          </p>

          {/* Global Billing Toggle */}
          <div className="pricing-section-billing-toggle">
            <span className="pricing-section-billing-label">Annual billing</span>
            <label className="pricing-section-toggle">
              <input 
                type="checkbox" 
                checked={billingPeriod === 'yearly'}
                onChange={(e) => setBillingPeriod(e.target.checked ? 'yearly' : 'monthly')}
              />
              <span className="pricing-section-toggle-slider"></span>
            </label>
            <span className="pricing-section-billing-save">
              Save up to 20% with annual billing
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="pricing-cards-container">
          {plans.map(plan => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isPopular={plan.popular}
              onSelect={setSelectedPlan}
            />
          ))}
        </div>

        {/* Comparison Table */}
        <div className="pricing-comparison">
          <h3>Compare All Features</h3>
          <div className="pricing-comparison-table">
            <div className="pricing-comparison-header">
              <div className="pricing-comparison-feature">Feature</div>
              <div className="pricing-comparison-plan">Starter</div>
              <div className="pricing-comparison-plan popular">Professional</div>
              <div className="pricing-comparison-plan">Enterprise</div>
            </div>
            
            {[
              ['Streak Freeze Tokens', '3/month', '10/month', 'Unlimited'],
              ['Team Members', '1', 'Up to 10', 'Unlimited'],
              ['API Access', 'Limited', 'Full', 'Full + Priority'],
              ['Custom Branding', '❌', '✅', '✅'],
              ['SLA Guarantee', '❌', '99.5%', '99.9%'],
              ['Dedicated Support', '❌', '✅', '24/7 Priority']
            ].map((row, index) => (
              <div key={index} className="pricing-comparison-row">
                <div className="pricing-comparison-feature">{row[0]}</div>
                <div className="pricing-comparison-plan">{row[1]}</div>
                <div className="pricing-comparison-plan popular">{row[2]}</div>
                <div className="pricing-comparison-plan">{row[3]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="pricing-trust-section">
          <div className="pricing-trust-card">
            <div className="pricing-trust-icon">🏆</div>
            <h4>30-Day Money-Back Guarantee</h4>
            <p>If you're not satisfied, get a full refund. No questions asked.</p>
          </div>
          <div className="pricing-trust-card">
            <div className="pricing-trust-icon">🔒</div>
            <h4>Enterprise-Grade Security</h4>
            <p>SOC 2 Type II, GDPR, HIPAA compliant. Your data is safe with us.</p>
          </div>
          <div className="pricing-trust-card">
            <div className="pricing-trust-icon">📈</div>
            <h4>Proven ROI</h4>
            <p>Average 42% productivity increase reported by our customers.</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pricing-faq">
          <h3>Frequently Asked Questions</h3>
          <div className="pricing-faq-grid">
            {[
              {
                q: 'Can I switch plans later?',
                a: 'Yes, you can upgrade or downgrade at any time. Changes take effect immediately.'
              },
              {
                q: 'Is there a free trial?',
                a: 'All paid plans include a 14-day free trial. No credit card required.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, Apple Pay, Google Pay, and wire transfers.'
              },
              {
                q: 'Do you offer discounts for non-profits?',
                a: 'Yes, we offer 50% off for registered non-profit organizations.'
              }
            ].map((faq, index) => (
              <div key={index} className="pricing-faq-item">
                <div className="pricing-faq-question">
                  <h4>{faq.q}</h4>
                  <span className="pricing-faq-toggle">+</span>
                </div>
                <div className="pricing-faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export { PricingCard, PricingSection };