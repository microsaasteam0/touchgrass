import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Next-level Button Component with Advanced Animations
 * Business-minded with international design standards
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
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
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
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
  };

  const sizeStyles = {
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

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      color: 'white',
      boxShadow: '0 4px 20px rgba(34, 197, 94, 0.3)',
      '&:hover': {
        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 32px rgba(34, 197, 94, 0.4)',
      },
      '&:active': {
        transform: 'translateY(0)',
        boxShadow: '0 2px 12px rgba(34, 197, 94, 0.3)',
      },
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.08)',
      color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.12)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      },
    },
    premium: {
      background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
      color: '#1c1917',
      boxShadow: '0 4px 20px rgba(251, 191, 36, 0.3)',
      position: 'relative',
      '&:hover': {
        background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 32px rgba(251, 191, 36, 0.4)',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: '-2px',
        background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
        borderRadius: 'inherit',
        zIndex: -1,
        animation: 'premiumGlow 3s ease-in-out infinite',
      },
    },
    shame: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)',
      '&:hover': {
        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 32px rgba(239, 68, 68, 0.4)',
      },
    },
    ghost: {
      background: 'transparent',
      color: 'rgba(255, 255, 255, 0.9)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
      },
    },
  };

  const handleClick = (e) => {
    if (isLoading || disabled) return;
    
    if (animationType === 'ripple') {
      createRipple(e);
    } else if (animationType === 'bubble') {
      createBubble(e);
    }
    
    if (onClick) onClick(e);
  };

  const createRipple = (event) => {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  };

  const createBubble = (event) => {
    const button = event.currentTarget;
    const bubble = document.createElement('span');
    bubble.style.position = 'absolute';
    bubble.style.borderRadius = '50%';
    bubble.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    bubble.style.transform = 'scale(0)';
    bubble.style.animation = 'bubble 0.6s linear';
    bubble.style.pointerEvents = 'none';

    const size = Math.max(button.clientWidth, button.clientHeight);
    bubble.style.width = bubble.style.height = `${size}px`;
    bubble.style.left = `${event.clientX - button.getBoundingClientRect().left - size / 2}px`;
    bubble.style.top = `${event.clientY - button.getBoundingClientRect().top - size / 2}px`;

    button.appendChild(bubble);
    setTimeout(() => bubble.remove(), 600);
  };

  const mergedStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  };

  const buttonStyles = `
    @keyframes premiumGlow {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    @keyframes bubble {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 0;
      }
    }
    
    @keyframes loadingPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    .ripple {
      position: absolute;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
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
    
    @keyframes spin {
      to { transform: rotate(360deg); }
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
    
    .button:hover .button-icon {
      transform: translateX(2px);
    }
    
    .button:hover .button-icon-right {
      transform: translateX(-2px);
    }
  `;

  return (
    <>
      <style>{buttonStyles}</style>
      <button
        ref={ref}
        className={`button ${className}`}
        onClick={handleClick}
        style={mergedStyles}
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

export default Button;