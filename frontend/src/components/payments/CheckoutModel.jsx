


import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Mock Stripe public key
const stripePromise = loadStripe('pk_test_51NtQaTSJf3wW9wYvQ3z4x7y8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6');

const CheckoutModal = ({ isOpen, onClose, plan, amount, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [billingInfo, setBillingInfo] = useState({
    name: '',
    email: '',
    country: 'US',
    vat: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setStep(3);
      onSuccess();
    }, 2000);
  };

  const handlePromoApply = () => {
    if (promoCode.toUpperCase() === 'GRASS10') {
      setDiscount(amount * 0.1);
    }
  };

  const totalAmount = amount - discount;

  return (
    <>
      <style>{`
        /* Checkout Modal - International Business Level Design */
        .checkout-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: overlayFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes overlayFadeIn {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(20px);
          }
        }

        .checkout-modal-container {
          width: 90%;
          max-width: 900px;
          max-height: 90vh;
          background: linear-gradient(165deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
          animation: modalSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .checkout-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 32px 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(180deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.4) 100%);
        }

        .checkout-modal-title h2 {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 8px 0;
        }

        .checkout-modal-title p {
          color: #94a3b8;
          font-size: 15px;
          margin: 0;
        }

        .checkout-modal-step {
          display: inline-block;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
          animation: pulseGlow 2s infinite;
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(34, 197, 94, 0.6);
          }
        }

        .checkout-modal-close {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .checkout-modal-close:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #ef4444;
          transform: rotate(90deg);
        }

        .checkout-modal-body {
          padding: 40px;
          overflow-y: auto;
          max-height: calc(90vh - 140px);
        }

        /* Progress Bar */
        .checkout-progress {
          margin-bottom: 40px;
        }

        .checkout-progress-steps {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }

        .checkout-progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .checkout-progress-step-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #94a3b8;
          margin-bottom: 12px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .checkout-progress-step.active .checkout-progress-step-circle {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          border-color: #22c55e;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 0 30px rgba(34, 197, 94, 0.4);
        }

        .checkout-progress-step span {
          font-size: 14px;
          color: #94a3b8;
          font-weight: 500;
        }

        .checkout-progress-step.active span {
          color: white;
        }

        .checkout-progress-line {
          flex: 1;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
          margin: 0 20px;
          position: relative;
          top: -25px;
        }

        /* Animated Cards */
        .animated-card {
          animation: cardFloat 6s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes cardFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(0.5deg);
          }
          66% {
            transform: translateY(-5px) rotate(-0.5deg);
          }
        }

        .checkout-plan-card {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.4) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
        }

        .checkout-plan-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #22c55e, transparent);
          animation: shine 3s infinite;
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .checkout-plan-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .checkout-plan-card-header h3 {
          font-size: 24px;
          font-weight: 700;
          color: white;
          margin: 0;
        }

        .checkout-plan-price {
          text-align: right;
        }

        .checkout-plan-amount {
          font-size: 48px;
          font-weight: 800;
          background: linear-gradient(135deg, #22c55e 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .checkout-plan-period {
          display: block;
          color: #94a3b8;
          font-size: 14px;
          margin-top: 4px;
        }

        .checkout-plan-features {
          display: grid;
          gap: 16px;
          margin-bottom: 32px;
        }

        .checkout-plan-feature {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #cbd5e1;
          font-size: 15px;
        }

        .checkout-plan-billing {
          display: grid;
          gap: 12px;
          margin-bottom: 32px;
        }

        .checkout-plan-billing-option {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .checkout-plan-billing-option:hover {
          border-color: #22c55e;
          background: rgba(34, 197, 94, 0.05);
        }

        .checkout-plan-billing-option input {
          display: none;
        }

        .checkout-plan-billing-option input:checked + label {
          color: white;
        }

        .checkout-plan-billing-option input:checked + label .checkout-plan-billing-price {
          color: #22c55e;
        }

        .checkout-plan-billing-option label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          color: #94a3b8;
        }

        .checkout-plan-billing-price {
          font-weight: 600;
          font-size: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .checkout-plan-billing-save {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: #0f172a;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
        }

        /* Buttons */
        .checkout-button-primary {
          width: 100%;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          border: none;
          padding: 20px 32px;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .checkout-button-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.6s;
        }

        .checkout-button-primary:hover::before {
          left: 100%;
        }

        .checkout-button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 20px 40px rgba(34, 197, 94, 0.3),
            0 0 0 1px rgba(34, 197, 94, 0.2);
        }

        .checkout-button-outline {
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 18px 32px;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .checkout-button-outline:hover {
          border-color: #22c55e;
          background: rgba(34, 197, 94, 0.05);
          transform: translateY(-2px);
        }

        /* Security Badge */
        .checkout-security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #94a3b8;
          font-size: 14px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          animation: fadeInUp 0.6s 0.3s both;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Payment Form */
        .checkout-payment-form {
          display: grid;
          gap: 32px;
        }

        .checkout-payment-methods h4,
        .checkout-billing-info h4,
        .checkout-card-details h4,
        .checkout-order-summary h4 {
          font-size: 18px;
          font-weight: 600;
          color: white;
          margin: 0 0 20px 0;
        }

        .checkout-payment-method-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
        }

        .checkout-payment-method {
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .checkout-payment-method:hover {
          border-color: rgba(34, 197, 94, 0.5);
          transform: translateY(-2px);
        }

        .checkout-payment-method.selected {
          border-color: #22c55e;
          background: rgba(34, 197, 94, 0.1);
          animation: selectPulse 0.6s ease;
        }

        @keyframes selectPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .checkout-payment-method input {
          display: none;
        }

        .checkout-payment-method-icon {
          font-size: 24px;
        }

        .checkout-payment-method-name {
          font-size: 14px;
          font-weight: 500;
          color: white;
        }

        /* Form Grid */
        .checkout-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .checkout-form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .checkout-form-group label {
          font-size: 14px;
          font-weight: 500;
          color: #94a3b8;
        }

        .checkout-form-group input,
        .checkout-form-group select {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 14px 16px;
          color: white;
          font-size: 15px;
          transition: all 0.3s ease;
        }

        .checkout-form-group input:focus,
        .checkout-form-group select:focus {
          outline: none;
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }

        /* Card Element */
        .checkout-card-element-container {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
        }

        /* Promo Code */
        .checkout-promo-section {
          display: grid;
          gap: 12px;
        }

        .checkout-promo-input {
          display: flex;
          gap: 12px;
        }

        .checkout-promo-input input {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 14px 16px;
          color: white;
          font-size: 15px;
        }

        .checkout-promo-button {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          border: none;
          padding: 0 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .checkout-promo-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
        }

        .checkout-promo-success {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 12px;
          padding: 12px 16px;
          color: #22c55e;
          font-size: 14px;
          animation: successAppear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes successAppear {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Order Summary */
        .checkout-order-summary {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.4) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 24px;
        }

        .checkout-order-details {
          display: grid;
          gap: 16px;
        }

        .checkout-order-row {
          display: flex;
          justify-content: space-between;
          color: #94a3b8;
          font-size: 15px;
        }

        .checkout-order-row.discount {
          color: #22c55e;
        }

        .checkout-order-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 8px 0;
        }

        .checkout-order-total {
          display: flex;
          justify-content: space-between;
          font-size: 24px;
          font-weight: 700;
          color: white;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Terms */
        .checkout-terms {
          display: grid;
          gap: 12px;
        }

        .checkout-terms-checkbox {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #94a3b8;
          font-size: 14px;
          cursor: pointer;
        }

        .checkout-terms-checkbox input {
          width: 18px;
          height: 18px;
          accent-color: #22c55e;
        }

        .checkout-terms-checkbox a {
          color: #3b82f6;
          text-decoration: none;
        }

        .checkout-terms-checkbox a:hover {
          text-decoration: underline;
        }

        .checkout-terms-note {
          color: #64748b;
          font-size: 13px;
          font-style: italic;
          margin: 0;
        }

        /* Action Buttons */
        .checkout-action-buttons {
          display: flex;
          gap: 16px;
        }

        .checkout-button-back {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 18px 32px;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .checkout-button-back:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .checkout-button-submit {
          flex: 2;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          border: none;
          padding: 18px 32px;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.3s ease;
        }

        .checkout-button-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .checkout-button-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 
            0 20px 40px rgba(34, 197, 94, 0.3),
            0 0 0 1px rgba(34, 197, 94, 0.2);
        }

        /* Loading Spinner */
        .checkout-loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Success State */
        .checkout-success-content {
          text-align: center;
          padding: 40px 0;
        }

        .checkout-success-animation {
          margin-bottom: 40px;
        }

        .checkout-success-icon {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          animation: successBounce 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes successBounce {
          0%, 100% {
            transform: scale(1);
          }
          30% {
            transform: scale(1.1);
          }
          50% {
            transform: scale(0.95);
          }
          70% {
            transform: scale(1.05);
          }
        }

        .checkout-success-content h3 {
          font-size: 28px;
          font-weight: 700;
          color: white;
          margin: 0 0 12px 0;
        }

        .checkout-success-content p {
          color: #94a3b8;
          font-size: 16px;
          margin: 0;
        }

        .checkout-success-details {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 24px;
          margin: 32px 0;
          display: grid;
          gap: 16px;
        }

        .checkout-success-detail {
          display: flex;
          justify-content: space-between;
          color: #94a3b8;
          font-size: 15px;
        }

        .checkout-success-detail span:last-child {
          color: white;
          font-weight: 500;
        }

        .checkout-success-actions {
          display: flex;
          gap: 16px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .checkout-modal-container {
            width: 95%;
            max-height: 95vh;
          }
          
          .checkout-modal-header {
            padding: 24px;
          }
          
          .checkout-modal-body {
            padding: 24px;
          }
          
          .checkout-form-grid {
            grid-template-columns: 1fr;
          }
          
          .checkout-action-buttons {
            flex-direction: column;
          }
          
          .checkout-success-actions {
            flex-direction: column;
          }
          
          .checkout-payment-method-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <div className="checkout-modal-overlay">
        <div className="checkout-modal-container">
          {/* Header */}
          <div className="checkout-modal-header">
            <div className="checkout-modal-title">
              <span className="checkout-modal-step">Step {step}/3</span>
              <h2>Complete Your Purchase</h2>
              <p>Join 42,857+ professionals who trust TouchGrass</p>
            </div>
            <button className="checkout-modal-close" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className="checkout-modal-body">
            {/* Progress Bar */}
            <div className="checkout-progress">
              <div className="checkout-progress-steps">
                <div className={`checkout-progress-step ${step >= 1 ? 'active' : ''}`}>
                  <div className="checkout-progress-step-circle">1</div>
                  <span>Plan</span>
                </div>
                <div className="checkout-progress-line"></div>
                <div className={`checkout-progress-step ${step >= 2 ? 'active' : ''}`}>
                  <div className="checkout-progress-step-circle">2</div>
                  <span>Payment</span>
                </div>
                <div className="checkout-progress-line"></div>
                <div className={`checkout-progress-step ${step >= 3 ? 'active' : ''}`}>
                  <div className="checkout-progress-step-circle">3</div>
                  <span>Complete</span>
                </div>
              </div>
            </div>

            {/* Step 1: Plan Selection */}
            {step === 1 && (
              <div className="checkout-step-content">
                <div className="checkout-plan-card animated-card">
                  <div className="checkout-plan-card-header">
                    <h3>{plan.name}</h3>
                    <div className="checkout-plan-price">
                      <span className="checkout-plan-amount">${amount}</span>
                      <span className="checkout-plan-period">/month</span>
                    </div>
                  </div>
                  
                  <div className="checkout-plan-features">
                    <div className="checkout-plan-feature">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Unlimited streak protection</span>
                    </div>
                    <div className="checkout-plan-feature">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Priority leaderboard ranking</span>
                    </div>
                    <div className="checkout-plan-feature">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Advanced analytics dashboard</span>
                    </div>
                    <div className="checkout-plan-feature">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Custom achievement badges</span>
                    </div>
                  </div>

                  <div className="checkout-plan-billing">
                    <div className="checkout-plan-billing-option">
                      <input 
                        type="radio" 
                        id="monthly" 
                        name="billing" 
                        defaultChecked 
                      />
                      <label htmlFor="monthly">
                        <span>Monthly billing</span>
                        <span className="checkout-plan-billing-price">${amount}/month</span>
                      </label>
                    </div>
                    <div className="checkout-plan-billing-option">
                      <input 
                        type="radio" 
                        id="yearly" 
                        name="billing" 
                      />
                      <label htmlFor="yearly">
                        <span>Annual billing</span>
                        <span className="checkout-plan-billing-price">
                          ${Math.floor(amount * 12 * 0.8)}/year
                          <span className="checkout-plan-billing-save">Save 20%</span>
                        </span>
                      </label>
                    </div>
                  </div>

                  <button 
                    className="checkout-button-primary"
                    onClick={() => setStep(2)}
                  >
                    Continue to Payment
                  </button>
                </div>

                <div className="checkout-security-badge">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>256-bit SSL encryption • PCI DSS compliant • GDPR ready</span>
                </div>
              </div>
            )}

            {/* Step 2: Payment Details */}
            {step === 2 && (
              <Elements stripe={stripePromise}>
                <PaymentForm 
                  amount={amount}
                  discount={discount}
                  billingInfo={billingInfo}
                  setBillingInfo={setBillingInfo}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  promoCode={promoCode}
                  setPromoCode={setPromoCode}
                  onPromoApply={handlePromoApply}
                  onSubmit={handleSubmit}
                  loading={loading}
                  onBack={() => setStep(1)}
                />
              </Elements>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div className="checkout-success-content">
                <div className="checkout-success-animation">
                  <div className="checkout-success-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 4L12 14.01l-3-3" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Welcome to TouchGrass Elite!</h3>
                  <p>Your streak is now protected with premium features</p>
                </div>

                <div className="checkout-success-details">
                  <div className="checkout-success-detail">
                    <span>Order ID</span>
                    <span>TG-{Date.now().toString().slice(-8)}</span>
                  </div>
                  <div className="checkout-success-detail">
                    <span>Plan</span>
                    <span>{plan.name}</span>
                  </div>
                  <div className="checkout-success-detail">
                    <span>Amount Paid</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="checkout-success-detail">
                    <span>Next Billing</span>
                    <span>{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="checkout-success-actions">
                  <button className="checkout-button-outline" onClick={onClose}>
                    Return to Dashboard
                  </button>
                  <button className="checkout-button-primary">
                    Download Invoice
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const PaymentForm = ({
  amount,
  discount,
  billingInfo,
  setBillingInfo,
  paymentMethod,
  setPaymentMethod,
  promoCode,
  setPromoCode,
  onPromoApply,
  onSubmit,
  loading,
  onBack
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const totalAmount = amount - discount;

  const paymentMethods = [
    { id: 'card', name: 'Credit Card', icon: '💳' },
    { id: 'paypal', name: 'PayPal', icon: '🏦' },
    { id: 'apple', name: 'Apple Pay', icon: '' },
    { id: 'google', name: 'Google Pay', icon: 'G' }
  ];

  return (
    <form onSubmit={onSubmit} className="checkout-payment-form">
      {/* Payment Method Selection */}
      <div className="checkout-payment-methods">
        <h4>Select Payment Method</h4>
        <div className="checkout-payment-method-grid">
          {paymentMethods.map(method => (
            <label 
              key={method.id}
              className={`checkout-payment-method ${paymentMethod === method.id ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="checkout-payment-method-icon">{method.icon}</span>
              <span className="checkout-payment-method-name">{method.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Billing Information */}
      <div className="checkout-billing-info">
        <h4>Billing Information</h4>
        <div className="checkout-form-grid">
          <div className="checkout-form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={billingInfo.name}
              onChange={(e) => setBillingInfo({...billingInfo, name: e.target.value})}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="checkout-form-group">
            <label>Email</label>
            <input
              type="email"
              value={billingInfo.email}
              onChange={(e) => setBillingInfo({...billingInfo, email: e.target.value})}
              placeholder="john@company.com"
              required
            />
          </div>
          <div className="checkout-form-group">
            <label>Country</label>
            <select
              value={billingInfo.country}
              onChange={(e) => setBillingInfo({...billingInfo, country: e.target.value})}
            >
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
            </select>
          </div>
          <div className="checkout-form-group">
            <label>VAT Number (Optional)</label>
            <input
              type="text"
              value={billingInfo.vat}
              onChange={(e) => setBillingInfo({...billingInfo, vat: e.target.value})}
              placeholder="EU123456789"
            />
          </div>
        </div>
      </div>

      {/* Card Details */}
      {paymentMethod === 'card' && (
        <div className="checkout-card-details">
          <h4>Card Details</h4>
          <div className="checkout-card-element-container">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#fff',
                    '::placeholder': {
                      color: '#6b7280'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Promo Code */}
      <div className="checkout-promo-section">
        <div className="checkout-promo-input">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Promo code"
          />
          <button type="button" onClick={onPromoApply} className="checkout-promo-button">
            Apply
          </button>
        </div>
        {discount > 0 && (
          <div className="checkout-promo-success">
            <span>🎉 Promo code applied! ${discount.toFixed(2)} discount</span>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="checkout-order-summary">
        <h4>Order Summary</h4>
        <div className="checkout-order-details">
          <div className="checkout-order-row">
            <span>Plan</span>
            <span>${amount.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="checkout-order-row discount">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="checkout-order-row">
            <span>VAT (20%)</span>
            <span>${(totalAmount * 0.2).toFixed(2)}</span>
          </div>
          <div className="checkout-order-divider"></div>
          <div className="checkout-order-total">
            <span>Total</span>
            <span>${(totalAmount * 1.2).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Terms & Submit */}
      <div className="checkout-terms">
        <label className="checkout-terms-checkbox">
          <input type="checkbox" required />
          <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
        </label>
        <p className="checkout-terms-note">You can cancel anytime. No questions asked.</p>
      </div>

      {/* Action Buttons */}
      <div className="checkout-action-buttons">
        <button type="button" onClick={onBack} className="checkout-button-back">
          Back
        </button>
        <button type="submit" className="checkout-button-submit" disabled={loading}>
          {loading ? (
            <>
              <span className="checkout-loading-spinner"></span>
              Processing...
            </>
          ) : (
            `Pay $${(totalAmount * 1.2).toFixed(2)}`
          )}
        </button>
      </div>
    </form>
  );
};

export default CheckoutModal;