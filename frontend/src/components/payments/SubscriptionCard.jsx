import React, { useState, useEffect } from 'react';

const SubscriptionCard = ({ subscription, onUpgrade, onCancel, onManage }) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date();
    const end = new Date(subscription.currentPeriodEnd);
    const diff = end - now;
    
    if (diff <= 0) return null;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return { days, hours };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);
    
    return () => clearInterval(timer);
  }, [subscription.currentPeriodEnd]);

  const handleCancel = async () => {
    setIsCancelling(true);
    setTimeout(() => {
      onCancel();
      setIsCancelling(false);
    }, 1500);
  };

  const getStatusColor = () => {
    switch (subscription.status) {
      case 'active': return '#22C55E';
      case 'cancelled': return '#6B7280';
      case 'past_due': return '#EF4444';
      case 'trialing': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getNextTier = () => {
    const tiers = {
      free: { name: 'Professional', price: 29, features: ['10 streak freezes', 'Advanced analytics', 'Priority support'] },
      professional: { name: 'Enterprise', price: 99, features: ['Unlimited everything', 'Dedicated support', 'Custom branding'] }
    };
    return tiers[subscription.plan] || null;
  };

  const nextTier = getNextTier();

  return (
    <>
      <style jsx>{`
        .subscription-card {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.4) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 32px;
          padding: 32px;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .subscription-card::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(
            transparent,
            rgba(34, 197, 94, 0.1),
            transparent 30%
          );
          animation: rotate 4s linear infinite;
          z-index: 0;
        }

        @keyframes rotate {
          100% { transform: rotate(360deg); }
        }

        .subscription-card:hover {
          transform: translateY(-10px);
          border-color: rgba(34, 197, 94, 0.3);
          box-shadow: 
            0 40px 80px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(34, 197, 94, 0.1),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
        }

        .subscription-card > * {
          position: relative;
          z-index: 1;
        }

        .subscription-card-badge {
          position: absolute;
          top: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          backdrop-filter: blur(10px);
        }

        .subscription-card-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: statusPulse 2s infinite;
        }

        @keyframes statusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }

        .subscription-card-status {
          color: white;
        }

        .subscription-card-header {
          margin-bottom: 32px;
          padding-bottom: 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .subscription-card-plan {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .subscription-card-plan-icon {
          font-size: 64px;
          margin-bottom: 20px;
          animation: planIconFloat 6s ease-in-out infinite;
        }

        @keyframes planIconFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(5deg); }
          66% { transform: translateY(-5px) rotate(-5deg); }
        }

        .subscription-card-plan-name {
          font-size: 28px;
          font-weight: 700;
          color: white;
          margin: 0 0 8px 0;
        }

        .subscription-card-plan-description {
          color: #94a3b8;
          font-size: 15px;
          margin: 0;
          max-width: 280px;
        }

        .subscription-card-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 32px;
          padding-bottom: 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .subscription-card-stat {
          text-align: center;
        }

        .subscription-card-stat-label {
          display: block;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .subscription-card-stat-value {
          font-size: 20px;
          font-weight: 700;
          color: white;
          display: block;
        }

        .subscription-card-billing {
          margin-bottom: 32px;
        }

        .subscription-card-billing-title {
          font-size: 18px;
          font-weight: 600;
          color: white;
          margin: 0 0 20px 0;
        }

        .subscription-card-billing-details {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 20px;
        }

        .subscription-card-billing-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .subscription-card-billing-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .subscription-card-billing-row:first-child {
          padding-top: 0;
        }

        .subscription-card-billing-label {
          color: #94a3b8;
          font-size: 14px;
        }

        .subscription-card-billing-value {
          color: white;
          font-size: 15px;
          font-weight: 500;
        }

        .subscription-card-billing-value.highlight {
          color: #22c55e;
          font-weight: 600;
          animation: highlightPulse 2s infinite;
        }

        @keyframes highlightPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .subscription-card-usage {
          margin-bottom: 32px;
        }

        .subscription-card-usage-title {
          font-size: 18px;
          font-weight: 600;
          color: white;
          margin: 0 0 20px 0;
        }

        .subscription-card-usage-item {
          margin-bottom: 20px;
        }

        .subscription-card-usage-item:last-child {
          margin-bottom: 0;
        }

        .subscription-card-usage-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .subscription-card-usage-label span:first-child {
          color: #cbd5e1;
          font-size: 14px;
        }

        .subscription-card-usage-label span:last-child {
          color: #94a3b8;
          font-size: 13px;
        }

        .subscription-card-usage-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          overflow: hidden;
        }

        .subscription-card-usage-progress {
          height: 100%;
          background: linear-gradient(90deg, #22c55e 0%, #3b82f6 100%);
          border-radius: 4px;
          position: relative;
          overflow: hidden;
          animation: progressLoad 1s ease-out;
        }

        @keyframes progressLoad {
          from { width: 0; }
          to { width: var(--progress-width); }
        }

        .subscription-card-usage-progress::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          animation: progressShine 2s infinite;
        }

        @keyframes progressShine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .subscription-card-upsell {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
          overflow: hidden;
        }

        .subscription-card-upsell::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #22c55e, transparent);
          animation: upsellShine 3s infinite;
        }

        @keyframes upsellShine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .subscription-card-upsell-icon {
          font-size: 40px;
          flex-shrink: 0;
          animation: upsellIconBounce 2s infinite;
        }

        @keyframes upsellIconBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .subscription-card-upsell-content {
          flex: 1;
        }

        .subscription-card-upsell-content h4 {
          font-size: 18px;
          font-weight: 600;
          color: white;
          margin: 0 0 8px 0;
        }

        .subscription-card-upsell-content p {
          color: #94a3b8;
          font-size: 14px;
          margin: 0 0 12px 0;
        }

        .subscription-card-upsell-features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 6px;
        }

        .subscription-card-upsell-features li {
          color: #cbd5e1;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .subscription-card-upsell-button {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          border: none;
          padding: 16px 24px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: all 0.3s ease;
          white-space: nowrap;
          min-width: 140px;
        }

        .subscription-card-upsell-button:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 20px 40px rgba(34, 197, 94, 0.3),
            0 0 0 1px rgba(34, 197, 94, 0.2);
        }

        .subscription-card-upsell-price {
          font-size: 12px;
          opacity: 0.9;
        }

        .subscription-card-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 32px;
        }

        .subscription-card-action {
          flex: 1;
          min-width: 160px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 16px 24px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
        }

        .subscription-card-action:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .subscription-card-action.manage:hover {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .subscription-card-action.cancel:hover {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .subscription-card-action.details:hover {
          border-color: #22c55e;
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .subscription-card-details {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 24px;
          margin-top: 24px;
          animation: detailsExpand 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes detailsExpand {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .subscription-card-details-section {
          margin-bottom: 32px;
        }

        .subscription-card-details-section:last-child {
          margin-bottom: 0;
        }

        .subscription-card-details-section h5 {
          font-size: 16px;
          font-weight: 600;
          color: white;
          margin: 0 0 16px 0;
        }

        .subscription-card-history {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          overflow: hidden;
        }

        .subscription-card-history-item {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr;
          gap: 20px;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 14px;
        }

        .subscription-card-history-item:last-child {
          border-bottom: none;
        }

        .subscription-card-history-item span:first-child {
          color: #94a3b8;
        }

        .subscription-card-history-item span:nth-child(2) {
          color: #cbd5e1;
        }

        .subscription-card-history-item span:last-child {
          color: white;
          font-weight: 500;
          text-align: right;
        }

        .subscription-card-invoices {
          display: grid;
          gap: 12px;
        }

        .subscription-card-invoice {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #94a3b8;
          text-decoration: none;
          font-size: 14px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .subscription-card-invoice:hover {
          color: white;
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
          transform: translateX(4px);
        }

        .subscription-card-cancelling {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 32px;
        }

        .subscription-card-cancelling-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          border-top-color: #22c55e;
          animation: spin 1s linear infinite;
        }

        .subscription-card-cancelling span {
          color: #94a3b8;
          font-size: 14px;
        }

        .subscription-card-cancellation p {
          color: #94a3b8;
          font-size: 14px;
          margin: 0 0 20px 0;
          line-height: 1.6;
        }

        .subscription-card-cancellation-reasons {
          display: grid;
          gap: 12px;
          margin-bottom: 24px;
        }

        .subscription-card-cancellation-reason {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #cbd5e1;
          font-size: 14px;
          cursor: pointer;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .subscription-card-cancellation-reason:hover {
          border-color: rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
        }

        .subscription-card-cancellation-reason input {
          accent-color: #22c55e;
        }

        .subscription-card-cancel-confirm {
          width: 100%;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: none;
          padding: 16px 24px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .subscription-card-cancel-confirm:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 20px 40px rgba(239, 68, 68, 0.3),
            0 0 0 1px rgba(239, 68, 68, 0.2);
        }

        .subscription-card-value {
          display: flex;
          align-items: center;
          gap: 16px;
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 20px;
          padding: 20px;
          margin-top: 24px;
        }

        .subscription-card-value-icon {
          font-size: 32px;
          flex-shrink: 0;
          animation: valueIconPulse 2s infinite;
        }

        @keyframes valueIconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .subscription-card-value-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .subscription-card-value-content strong {
          font-size: 16px;
          color: white;
        }

        .subscription-card-value-content span {
          font-size: 13px;
          color: #fbbf24;
        }

        @media (max-width: 1024px) {
          .subscription-card-actions {
            flex-direction: column;
          }
          
          .subscription-card-action {
            min-width: 100%;
          }
        }

        @media (max-width: 768px) {
          .subscription-card {
            padding: 24px;
          }
          
          .subscription-card-stats {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .subscription-card-upsell {
            flex-direction: column;
            text-align: center;
          }
          
          .subscription-card-history-item {
            grid-template-columns: 1fr;
            gap: 8px;
          }
        }
      `}</style>

      <div className={`subscription-card ${subscription.plan} ${subscription.status}`}>
        {/* Card Header with Glow Effect */}
        <div className="subscription-card-header">
          <div className="subscription-card-badge" style={{ backgroundColor: getStatusColor() + '20', borderColor: getStatusColor() }}>
            <span className="subscription-card-status-dot" style={{ backgroundColor: getStatusColor() }}></span>
            <span className="subscription-card-status">{subscription.status.toUpperCase()}</span>
          </div>
          
          <div className="subscription-card-plan">
            <div className="subscription-card-plan-icon">
              {subscription.plan === 'free' ? '🌱' : 
               subscription.plan === 'professional' ? '🚀' : '🏢'}
            </div>
            <h3 className="subscription-card-plan-name">
              {subscription.plan === 'free' ? 'Free Tier' : 
               subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
            </h3>
            <p className="subscription-card-plan-description">
              {subscription.plan === 'free' ? 'Basic features for getting started' :
               subscription.plan === 'professional' ? 'Advanced tools for professionals' :
               'Enterprise-grade solution for teams'}
            </p>
          </div>
        </div>

        {/* Current Usage Stats */}
        <div className="subscription-card-stats">
          <div className="subscription-card-stat">
            <div className="subscription-card-stat-label">Current Streak</div>
            <div className="subscription-card-stat-value">42 days</div>
          </div>
          <div className="subscription-card-stat">
            <div className="subscription-card-stat-label">Streak Freezes</div>
            <div className="subscription-card-stat-value">
              {subscription.streakFreezeTokens || 0} remaining
            </div>
          </div>
          <div className="subscription-card-stat">
            <div className="subscription-card-stat-label">Global Rank</div>
            <div className="subscription-card-stat-value">#312</div>
          </div>
        </div>

        {/* Billing Information */}
        <div className="subscription-card-billing">
          <h4 className="subscription-card-billing-title">Billing Information</h4>
          
          <div className="subscription-card-billing-details">
            <div className="subscription-card-billing-row">
              <span className="subscription-card-billing-label">Current Plan</span>
              <span className="subscription-card-billing-value">
                {subscription.plan === 'free' ? 'Free' : `$${subscription.price}/month`}
              </span>
            </div>
            
            <div className="subscription-card-billing-row">
              <span className="subscription-card-billing-label">Next Billing Date</span>
              <span className="subscription-card-billing-value">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            
            <div className="subscription-card-billing-row">
              <span className="subscription-card-billing-label">Payment Method</span>
              <span className="subscription-card-billing-value">
                {subscription.paymentMethod || 'Not set'}
              </span>
            </div>
            
            {timeLeft && (
              <div className="subscription-card-billing-row">
                <span className="subscription-card-billing-label">Time Remaining</span>
                <span className="subscription-card-billing-value highlight">
                  {timeLeft.days}d {timeLeft.hours}h
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Usage Progress Bars */}
        <div className="subscription-card-usage">
          <h4 className="subscription-card-usage-title">Usage This Month</h4>
          
          <div className="subscription-card-usage-item">
            <div className="subscription-card-usage-label">
              <span>Verifications</span>
              <span>12/30</span>
            </div>
            <div className="subscription-card-usage-bar">
              <div 
                className="subscription-card-usage-progress" 
                style={{ width: '40%' }}
              ></div>
            </div>
          </div>
          
          <div className="subscription-card-usage-item">
            <div className="subscription-card-usage-label">
              <span>Challenge Invites</span>
              <span>3/10</span>
            </div>
            <div className="subscription-card-usage-bar">
              <div 
                className="subscription-card-usage-progress" 
                style={{ width: '30%' }}
              ></div>
            </div>
          </div>
          
          <div className="subscription-card-usage-item">
            <div className="subscription-card-usage-label">
              <span>Leaderboard Views</span>
              <span>47/100</span>
            </div>
            <div className="subscription-card-usage-bar">
              <div 
                className="subscription-card-usage-progress" 
                style={{ width: '47%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Next Tier Upsell */}
        {nextTier && (
          <div className="subscription-card-upsell">
            <div className="subscription-card-upsell-icon">🚀</div>
            <div className="subscription-card-upsell-content">
              <h4>Ready for {nextTier.name}?</h4>
              <p>Upgrade to unlock:</p>
              <ul className="subscription-card-upsell-features">
                {nextTier.features.map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
            </div>
            <button 
              className="subscription-card-upsell-button"
              onClick={() => onUpgrade(nextTier)}
            >
              Upgrade to {nextTier.name}
              <span className="subscription-card-upsell-price">${nextTier.price}/month</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="subscription-card-actions">
          {subscription.plan !== 'free' && (
            <>
              <button 
                className="subscription-card-action manage"
                onClick={onManage}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 013.417 1.415 2 2 0 01-.587 1.415l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Manage Subscription
              </button>
              
              <button 
                className="subscription-card-action cancel"
                onClick={() => setShowDetails(!showDetails)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Cancel Subscription
              </button>
            </>
          )}
          
          <button 
            className="subscription-card-action details"
            onClick={() => setShowDetails(!showDetails)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            {showDetails ? 'Hide Details' : 'View Details'}
          </button>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="subscription-card-details">
            <div className="subscription-card-details-section">
              <h5>Subscription History</h5>
              <div className="subscription-card-history">
                {[
                  { date: '2024-01-15', action: 'Upgraded to Professional', amount: '$29.00' },
                  { date: '2023-12-15', action: 'Monthly renewal', amount: '$29.00' },
                  { date: '2023-11-15', action: 'Initial subscription', amount: '$29.00' }
                ].map((item, index) => (
                  <div key={index} className="subscription-card-history-item">
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                    <span>{item.action}</span>
                    <span>{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="subscription-card-details-section">
              <h5>Invoice Downloads</h5>
              <div className="subscription-card-invoices">
                {['January 2024', 'December 2023', 'November 2023'].map((invoice, index) => (
                  <a key={index} href="#" className="subscription-card-invoice">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {invoice}.pdf
                  </a>
                ))}
              </div>
            </div>

            {/* Cancellation Confirmation */}
            {isCancelling ? (
              <div className="subscription-card-cancelling">
                <div className="subscription-card-cancelling-spinner"></div>
                <span>Processing cancellation...</span>
              </div>
            ) : (
              <div className="subscription-card-cancellation">
                <h5>Cancel Subscription</h5>
                <p>Your access will continue until the end of your billing period.</p>
                <div className="subscription-card-cancellation-reasons">
                  {[
                    'Too expensive',
                    'Missing features',
                    "I don't use it enough",
                    'Found a better alternative',
                    'Other'
                  ].map((reason, index) => (
                    <label key={index} className="subscription-card-cancellation-reason">
                      <input type="radio" name="cancellation-reason" value={reason} />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>
                <button 
                  className="subscription-card-cancel-confirm"
                  onClick={handleCancel}
                >
                  Confirm Cancellation
                </button>
              </div>
            )}
          </div>
        )}

        {/* Value Proposition */}
        <div className="subscription-card-value">
          <div className="subscription-card-value-icon">💎</div>
          <div className="subscription-card-value-content">
            <strong>You're saving $312/year in productivity</strong>
            <span>Based on your 42-day streak and consistency score</span>
          </div>
        </div>
      </div>
    </>
  );
};

const SubscriptionDashboard = () => {
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 1,
      plan: 'free',
      status: 'active',
      price: 0,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      streakFreezeTokens: 0,
      paymentMethod: null
    },
    {
      id: 2,
      plan: 'professional',
      status: 'active',
      price: 29,
      currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      streakFreezeTokens: 7,
      paymentMethod: 'Visa **** 4242'
    },
    {
      id: 3,
      plan: 'enterprise',
      status: 'trialing',
      price: 99,
      currentPeriodEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      streakFreezeTokens: 'Unlimited',
      paymentMethod: 'Company Invoice'
    }
  ]);

  const handleUpgrade = (tier) => {
  };

  const handleCancel = (subscriptionId) => {
    setSubscriptions(subs => 
      subs.map(sub => 
        sub.id === subscriptionId 
          ? { ...sub, status: 'cancelled' }
          : sub
      )
    );
  };

  const handleManage = (subscriptionId) => {
  };

  return (
    <>
      <style jsx>{`
        .subscription-dashboard {
          padding: 60px 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .subscription-dashboard-header {
          margin-bottom: 60px;
          position: relative;
        }

        .subscription-dashboard-title {
          font-size: 42px;
          font-weight: 800;
          background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 16px 0;
        }

        .subscription-dashboard-subtitle {
          font-size: 18px;
          color: #94a3b8;
          max-width: 600px;
          margin: 0 0 48px 0;
          line-height: 1.6;
        }

        .subscription-dashboard-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
        }

        .subscription-dashboard-stat {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.4) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 24px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .subscription-dashboard-stat::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #22c55e, transparent);
          animation: dashboardShine 3s infinite;
        }

        @keyframes dashboardShine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .subscription-dashboard-stat:hover {
          transform: translateY(-4px);
          border-color: rgba(34, 197, 94, 0.3);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(34, 197, 94, 0.1);
        }

        .subscription-dashboard-stat-label {
          display: block;
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .subscription-dashboard-stat-value {
          font-size: 32px;
          font-weight: 700;
          color: white;
          display: block;
        }

        .subscription-dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 32px;
          margin-bottom: 60px;
        }

        .subscription-billing-summary {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.4) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 32px;
          max-width: 500px;
          margin: 0 auto;
        }

        .subscription-billing-summary h3 {
          font-size: 24px;
          font-weight: 700;
          color: white;
          margin: 0 0 24px 0;
          text-align: center;
        }

        .subscription-billing-summary-content {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .subscription-billing-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: #94a3b8;
          font-size: 15px;
        }

        .subscription-billing-summary-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .subscription-billing-summary-row:first-child {
          padding-top: 0;
        }

        .subscription-billing-summary-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 16px 0;
        }

        .subscription-billing-summary-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 20px;
          font-weight: 700;
        }

        .subscription-billing-summary-button {
          width: 100%;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          border: none;
          padding: 18px 32px;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .subscription-billing-summary-button:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 20px 40px rgba(59, 130, 246, 0.3),
            0 0 0 1px rgba(59, 130, 246, 0.2);
        }

        @media (max-width: 1024px) {
          .subscription-dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .subscription-dashboard {
            padding: 40px 24px;
          }
          
          .subscription-dashboard-title {
            font-size: 32px;
          }
        }
      `}</style>

      <div className="subscription-dashboard">
        <div className="subscription-dashboard-header">
          <h2 className="subscription-dashboard-title">Subscription Management</h2>
          <p className="subscription-dashboard-subtitle">
            Manage your plans, billing, and usage in one place
          </p>
          
          <div className="subscription-dashboard-stats">
            <div className="subscription-dashboard-stat">
              <span className="subscription-dashboard-stat-label">Active Subscriptions</span>
              <span className="subscription-dashboard-stat-value">2</span>
            </div>
            <div className="subscription-dashboard-stat">
              <span className="subscription-dashboard-stat-label">Monthly Cost</span>
              <span className="subscription-dashboard-stat-value">$128</span>
            </div>
            <div className="subscription-dashboard-stat">
              <span className="subscription-dashboard-stat-label">Next Billing</span>
              <span className="subscription-dashboard-stat-value">Jan 15, 2024</span>
            </div>
          </div>
        </div>

        <div className="subscription-dashboard-grid">
          {subscriptions.map(subscription => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onUpgrade={handleUpgrade}
              onCancel={() => handleCancel(subscription.id)}
              onManage={() => handleManage(subscription.id)}
            />
          ))}
        </div>

        {/* Billing Summary */}
        <div className="subscription-billing-summary">
          <h3>Billing Summary</h3>
          <div className="subscription-billing-summary-content">
            <div className="subscription-billing-summary-row">
              <span>Professional Plan</span>
              <span>$29.00</span>
            </div>
            <div className="subscription-billing-summary-row">
              <span>Enterprise Plan</span>
              <span>$99.00</span>
            </div>
            <div className="subscription-billing-summary-row">
              <span>Tax (20%)</span>
              <span>$25.60</span>
            </div>
            <div className="subscription-billing-summary-divider"></div>
            <div className="subscription-billing-summary-total">
              <span>Total Monthly</span>
              <span>$153.60</span>
            </div>
          </div>
          <button className="subscription-billing-summary-button">
            Download All Invoices
          </button>
        </div>
      </div>
    </>
  );
};

export { SubscriptionCard, SubscriptionDashboard };