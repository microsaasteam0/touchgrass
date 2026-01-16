import React from 'react';
import PropTypes from 'prop-types';

/**
 * Premium Card Component with Glass Morphism & Holographic Effects
 * Business-grade card design with advanced animations
 */
const Card = ({
  children,
  variant = 'default',
  hoverEffect = 'lift',
  glow = false,
  glass = false,
  borderGradient = false,
  interactive = false,
  className = '',
  style = {},
  onClick,
  ...props
}) => {
  const baseStyles = {
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    cursor: interactive ? 'pointer' : 'default',
  };

  const variantStyles = {
    default: {
      background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    },
    premium: {
      background: 'linear-gradient(145deg, rgba(30, 30, 30, 0.95) 0%, rgba(40, 40, 40, 0.95) 100%)',
      border: '1px solid rgba(251, 191, 36, 0.2)',
      boxShadow: '0 8px 32px rgba(251, 191, 36, 0.15)',
    },
    success: {
      background: 'linear-gradient(145deg, rgba(22, 163, 74, 0.1) 0%, rgba(21, 128, 61, 0.1) 100%)',
      border: '1px solid rgba(34, 197, 94, 0.2)',
      boxShadow: '0 8px 32px rgba(34, 197, 94, 0.15)',
    },
    warning: {
      background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15)',
    },
    glass: {
      background: 'rgba(17, 24, 39, 0.25)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    },
  };

  const hoverStyles = {
    lift: {
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      },
    },
    glow: {
      '&:hover': {
        boxShadow: '0 0 40px rgba(34, 197, 94, 0.3)',
      },
    },
    scale: {
      '&:hover': {
        transform: 'scale(1.02)',
      },
    },
    tilt: {
      '&:hover': {
        transform: 'perspective(1000px) rotateX(5deg) rotateY(5deg)',
      },
    },
    none: {},
  };

  const cardStyles = `
    .card-container {
      position: relative;
      z-index: 1;
    }
    
    .card-glow {
      position: absolute;
      inset: -2px;
      background: linear-gradient(45deg, #22c55e, #3b82f6, #8b5cf6, #ec4899);
      border-radius: inherit;
      filter: blur(20px);
      opacity: 0;
      z-index: -1;
      transition: opacity 0.4s ease;
      animation: glowRotate 8s linear infinite;
    }
    
    .card-glow.active {
      opacity: 0.3;
    }
    
    .card-border-gradient {
      position: absolute;
      inset: -1px;
      background: linear-gradient(45deg, #22c55e, #3b82f6, #8b5cf6);
      border-radius: inherit;
      padding: 1px;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      z-index: 0;
      animation: borderRotate 4s linear infinite;
    }
    
    .card-glass {
      backdrop-filter: blur(20px);
      background: rgba(17, 24, 39, 0.25);
    }
    
    .card-content {
      position: relative;
      z-index: 2;
      padding: 24px;
      height: 100%;
    }
    
    .card-hover-tilt:hover {
      transform: perspective(1000px) rotateX(2deg) rotateY(2deg);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .card-hover-lift:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    }
    
    .card-hover-glow:hover {
      box-shadow: 0 0 50px rgba(34, 197, 94, 0.4);
    }
    
    .card-hover-scale:hover {
      transform: scale(1.02);
    }
    
    @keyframes glowRotate {
      0% { filter: hue-rotate(0deg) blur(20px); }
      100% { filter: hue-rotate(360deg) blur(20px); }
    }
    
    @keyframes borderRotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes hologram {
      0%, 100% { opacity: 0.1; }
      50% { opacity: 0.3; }
    }
    
    .hologram-effect::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
      animation: hologram 3s ease-in-out infinite;
      pointer-events: none;
      z-index: 1;
    }
    
    .card-ripple {
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      transform: scale(0);
      opacity: 0;
      pointer-events: none;
    }
    
    .card-ripple.animate {
      animation: cardRipple 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    @keyframes cardRipple {
      0% {
        transform: scale(0);
        opacity: 0.5;
      }
      100% {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    .card-shine {
      position: absolute;
      top: -100%;
      left: -100%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        45deg,
        transparent 30%,
        rgba(255, 255, 255, 0.03) 50%,
        transparent 70%
      );
      transform: rotate(45deg);
      animation: shine 3s ease-in-out infinite;
      pointer-events: none;
    }
    
    @keyframes shine {
      0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
      100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
    }
  `;

  const handleClick = (e) => {
    if (interactive && onClick) {
      createCardRipple(e);
      setTimeout(() => onClick(e), 50);
    }
  };

  const createCardRipple = (event) => {
    const card = event.currentTarget;
    const ripple = document.createElement('div');
    ripple.classList.add('card-ripple');
    
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    card.appendChild(ripple);
    
    requestAnimationFrame(() => {
      ripple.classList.add('animate');
    });
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  const mergedStyles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...(glass && variantStyles.glass),
    ...style,
  };

  return (
    <>
      <style>{cardStyles}</style>
      <div
        className={`card-container ${className} ${interactive ? 'interactive' : ''}`}
        style={mergedStyles}
        onClick={handleClick}
        {...props}
      >
        {borderGradient && (
          <div className="card-border-gradient" />
        )}
        
        {glow && (
          <div className={`card-glow ${interactive ? 'active' : ''}`} />
        )}
        
        {interactive && (
          <div className="card-shine" />
        )}
        
        <div className="card-content">
          {children}
        </div>
      </div>
    </>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'premium', 'success', 'warning', 'glass']),
  hoverEffect: PropTypes.oneOf(['lift', 'glow', 'scale', 'tilt', 'none']),
  glow: PropTypes.bool,
  glass: PropTypes.bool,
  borderGradient: PropTypes.bool,
  interactive: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

export default Card;