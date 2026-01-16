import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Advanced Toast Notification System
 * Business-grade toast notifications with premium animations
 */
const Toast = ({
  id,
  message,
  type = 'info',
  duration = 5000,
  position = 'top-right',
  icon,
  title,
  showProgress = true,
  closable = true,
  onClose,
  onClick,
  className = '',
  style = {},
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const toastRef = React.useRef(null);

  const typeConfig = {
    success: {
      icon: '✅',
      color: '#22c55e',
      bg: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(21, 128, 61, 0.15) 100%)',
      border: '1px solid rgba(34, 197, 94, 0.2)',
    },
    error: {
      icon: '❌',
      color: '#ef4444',
      bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
    },
    warning: {
      icon: '⚠️',
      color: '#f59e0b',
      bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)',
      border: '1px solid rgba(245, 158, 11, 0.2)',
    },
    info: {
      icon: 'ℹ️',
      color: '#3b82f6',
      bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
    },
    premium: {
      icon: '⭐',
      color: '#fbbf24',
      bg: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)',
      border: '1px solid rgba(251, 191, 36, 0.2)',
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  useEffect(() => {
    if (!isVisible) {
      setTimeout(() => {
        if (onClose) onClose(id);
      }, 300);
    }
  }, [isVisible, id, onClose]);

  useEffect(() => {
    if (duration === 0 || isPaused || !showProgress) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        setIsVisible(false);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, isPaused, showProgress]);

  const handleClose = (e) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleClick = () => {
    if (onClick) onClick(id);
  };

  const toastStyles = `
    .toast-container {
      position: fixed;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    }
    
    /* Position classes */
    .toast-container.top-right {
      top: 24px;
      right: 24px;
      align-items: flex-end;
    }
    
    .toast-container.top-left {
      top: 24px;
      left: 24px;
      align-items: flex-start;
    }
    
    .toast-container.top-center {
      top: 24px;
      left: 50%;
      transform: translateX(-50%);
      align-items: center;
    }
    
    .toast-container.bottom-right {
      bottom: 24px;
      right: 24px;
      align-items: flex-end;
    }
    
    .toast-container.bottom-left {
      bottom: 24px;
      left: 24px;
      align-items: flex-start;
    }
    
    .toast-container.bottom-center {
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      align-items: center;
    }
    
    /* Toast item */
    .toast-item {
      position: relative;
      min-width: 320px;
      max-width: 400px;
      background: linear-gradient(145deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
      overflow: hidden;
      pointer-events: auto;
      transform: translateX(100px);
      opacity: 0;
      animation: toastSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }
    
    .toast-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    }
    
    .toast-item.hiding {
      animation: toastSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    
    .toast-item::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--toast-bg, linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%));
      border-radius: inherit;
      z-index: -1;
    }
    
    /* Toast content */
    .toast-content {
      padding: 20px;
      position: relative;
      z-index: 2;
    }
    
    /* Toast header */
    .toast-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    
    .toast-title-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .toast-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }
    
    .toast-title {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      color: white;
      letter-spacing: -0.01em;
    }
    
    /* Close button */
    .toast-close {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }
    
    .toast-close:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.3);
      transform: rotate(90deg);
    }
    
    .close-icon {
      position: relative;
      width: 12px;
      height: 12px;
    }
    
    .close-icon::before,
    .close-icon::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 1px;
      background: white;
      border-radius: 1px;
    }
    
    .close-icon::before {
      transform: translate(-50%, -50%) rotate(45deg);
    }
    
    .close-icon::after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
    
    /* Toast message */
    .toast-message {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.9);
      letter-spacing: -0.01em;
    }
    
    /* Progress bar */
    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: rgba(255, 255, 255, 0.1);
      overflow: hidden;
    }
    
    .toast-progress-bar {
      height: 100%;
      background: var(--toast-color, #3b82f6);
      width: var(--progress, 100%);
      transition: width 0.1s linear;
      position: relative;
      overflow: hidden;
    }
    
    .toast-progress-bar::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: progressShine 2s linear infinite;
    }
    
    /* Glow effect */
    .toast-glow {
      position: absolute;
      inset: -2px;
      background: linear-gradient(45deg, var(--toast-color, #3b82f6), transparent);
      border-radius: inherit;
      filter: blur(10px);
      opacity: 0.2;
      z-index: 1;
      animation: toastGlowPulse 2s ease-in-out infinite;
    }
    
    /* Animations */
    @keyframes toastSlideIn {
      0% {
        transform: translateX(100px);
        opacity: 0;
      }
      100% {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes toastSlideOut {
      0% {
        transform: translateX(0);
        opacity: 1;
      }
      100% {
        transform: translateX(-100px);
        opacity: 0;
      }
    }
    
    @keyframes progressShine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    @keyframes toastGlowPulse {
      0%, 100% { opacity: 0.2; }
      50% { opacity: 0.4; }
    }
    
    @keyframes toastPulse {
      0%, 100% { box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3); }
      50% { box-shadow: 0 12px 48px var(--toast-color, #3b82f6, 0.3); }
    }
    
    .toast-item.pulse {
      animation: toastPulse 2s ease-in-out infinite;
    }
    
    /* Type-specific animations */
    .toast-item.success .toast-icon {
      animation: successSpin 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    @keyframes successSpin {
      0% { transform: scale(0) rotate(-180deg); }
      100% { transform: scale(1) rotate(0); }
    }
    
    .toast-item.error .toast-icon {
      animation: errorShake 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    @keyframes errorShake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }
  `;

  const toastItemStyles = {
    '--toast-bg': config.bg,
    '--toast-color': config.color,
    '--progress': `${progress}%`,
    ...style,
  };

  return (
    <>
      <style>{toastStyles}</style>
      <div
        ref={toastRef}
        className={`toast-item ${type} ${className} ${isVisible ? '' : 'hiding'}`}
        style={toastItemStyles}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        {...props}
      >
        <div className="toast-glow" />
        
        <div className="toast-content">
          <div className="toast-header">
            <div className="toast-title-container">
              <div className="toast-icon">
                {icon || config.icon}
              </div>
              {title && <h3 className="toast-title">{title}</h3>}
            </div>
            
            {closable && (
              <button className="toast-close" onClick={handleClose}>
                <span className="close-icon" />
              </button>
            )}
          </div>
          
          <p className="toast-message">{message}</p>
        </div>
        
        {showProgress && duration > 0 && (
          <div className="toast-progress">
            <div className="toast-progress-bar" />
          </div>
        )}
      </div>
    </>
  );
};

Toast.propTypes = {
  id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info', 'premium']),
  duration: PropTypes.number,
  position: PropTypes.oneOf(['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center']),
  icon: PropTypes.node,
  title: PropTypes.string,
  showProgress: PropTypes.bool,
  closable: PropTypes.bool,
  onClose: PropTypes.func,
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
};

// Toast Container Component
export const ToastContainer = ({ position = 'top-right', children }) => {
  const containerStyles = {
    position: 'fixed',
    zIndex: 99999,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    pointerEvents: 'none',
  };

  const positionStyles = {
    'top-right': {
      top: '24px',
      right: '24px',
      alignItems: 'flex-end',
    },
    'top-left': {
      top: '24px',
      left: '24px',
      alignItems: 'flex-start',
    },
    'top-center': {
      top: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      alignItems: 'center',
    },
    'bottom-right': {
      bottom: '24px',
      right: '24px',
      alignItems: 'flex-end',
    },
    'bottom-left': {
      bottom: '24px',
      left: '24px',
      alignItems: 'flex-start',
    },
    'bottom-center': {
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      alignItems: 'center',
    },
  };

  return (
    <div 
      className={`toast-container ${position}`}
      style={{
        ...containerStyles,
        ...positionStyles[position],
      }}
    >
      {children}
    </div>
  );
};

ToastContainer.propTypes = {
  position: PropTypes.oneOf(['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center']),
  children: PropTypes.node,
};

export default Toast;