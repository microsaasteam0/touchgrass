import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Next-level Button Component with Advanced Animations
 * Business-minded with international design standards
 * FIXED: Premium button now works correctly - SIMPLIFIED VERSION
 */
const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  animationType = 'ripple',
  onClick,
  className = '',
  style = {},
  ...props
}, ref) => {
  // Handle click with proper event handling
  const handleClick = (e) => {
    if (isLoading || disabled) return;
    
    // Call the onClick handler if provided
    if (onClick) {
      onClick(e);
    }
    
    // Add ripple effect only if animationType is ripple
    if (animationType === 'ripple') {
      addRippleEffect(e);
    }
  };

  // Simple ripple effect function
  const addRippleEffect = (e) => {
    try {
      const button = e.currentTarget;
      const ripple = document.createElement('span');
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;

      ripple.style.width = ripple.style.height = `${diameter}px`;
      ripple.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
      ripple.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple 0.6s linear';
      ripple.style.pointerEvents = 'none';

      // Remove existing ripples
      const existingRipples = button.getElementsByClassName('ripple-effect');
      while (existingRipples.length > 0) {
        existingRipples[0].remove();
      }

      ripple.className = 'ripple-effect';
      button.appendChild(ripple);

      // Remove ripple after animation
      setTimeout(() => {
        if (ripple.parentNode === button) {
          ripple.remove();
        }
      }, 600);
    } catch (error) {
      console.error('Ripple effect error:', error);
    }
  };

  // Base styles
  const baseClass = `button ${variant} ${size} ${fullWidth ? 'full-width' : ''} ${isLoading ? 'loading' : ''} ${disabled ? 'disabled' : ''} ${className}`;
  
  // Inline styles based on variant
  const getVariantStyles = () => {
    const base = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      border: 'none',
      outline: 'none',
      textDecoration: 'none',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
      fontWeight: 600,
      letterSpacing: '-0.01em',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
      userSelect: 'none',
      position: 'relative',
      opacity: disabled ? 0.6 : 1,
      pointerEvents: disabled ? 'none' : 'auto',
    };

    // Size styles
    const sizes = {
      small: {
        padding: '8px 16px',
        fontSize: '13px',
        lineHeight: '16px',
        borderRadius: '8px',
        minHeight: '36px',
      },
      medium: {
        padding: '12px 24px',
        fontSize: '14px',
        lineHeight: '20px',
        borderRadius: '10px',
        minHeight: '44px',
      },
      large: {
        padding: '16px 32px',
        fontSize: '16px',
        lineHeight: '24px',
        borderRadius: '12px',
        minHeight: '52px',
      },
    };

    // Variant styles
    const variants = {
      primary: {
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        color: 'white',
        boxShadow: '0 4px 20px rgba(34, 197, 94, 0.3)',
      },
      secondary: {
        background: 'rgba(255, 255, 255, 0.08)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
      },
      premium: {
        background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
        color: '#1c1917',
        boxShadow: '0 4px 20px rgba(251, 191, 36, 0.3)',
      },
      shame: {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: 'white',
        boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)',
      },
      ghost: {
        background: 'transparent',
        color: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      },
    };

    return {
      ...base,
      ...sizes[size],
      ...variants[variant],
      ...style,
    };
  };

  return (
    <>
      <style>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .button {
          position: relative;
          overflow: visible !important;
        }
        
        .button.full-width {
          width: 100%;
        }
        
        .button.loading {
          opacity: 0.7;
          cursor: wait;
        }
        
        .button.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .button:hover:not(.disabled):not(.loading) {
          transform: translateY(-2px);
        }
        
        .button.primary:hover:not(.disabled):not(.loading) {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          boxShadow: 0 8px 32px rgba(34, 197, 94, 0.4);
        }
        
        .button.premium:hover:not(.disabled):not(.loading) {
          background: linear-gradient(135deg, #f59e0b 0%, #b45309 100%);
          boxShadow: 0 8px 32px rgba(251, 191, 36, 0.4);
        }
        
        .button.premium::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706);
          border-radius: inherit;
          z-index: -1;
          animation: premiumGlow 3s ease-in-out infinite;
          opacity: 0.3;
        }
        
        @keyframes premiumGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        
        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
          margin-right: 8px;
        }
        
        .button-icon {
          display: inline-flex;
          align-items: center;
          margin-right: 8px;
          transition: transform 0.2s ease;
        }
        
        .button-icon-right {
          margin-left: 8px;
          margin-right: 0;
        }
        
        .button:hover:not(.disabled):not(.loading) .button-icon {
          transform: translateX(2px);
        }
        
        .button:hover:not(.disabled):not(.loading) .button-icon-right {
          transform: translateX(-2px);
        }
      `}</style>
      
      <button
        ref={ref}
        className={baseClass}
        onClick={handleClick}
        style={getVariantStyles()}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="loading-spinner" />
        )}
        {!isLoading && leftIcon && (
          <span className="button-icon">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="button-icon button-icon-right">{rightIcon}</span>
        )}
      </button>
    </>
  );
});

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'premium', 'shame', 'ghost']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  animationType: PropTypes.oneOf(['ripple', 'bubble', 'none']),
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
};

Button.displayName = 'Button';

export default Button;