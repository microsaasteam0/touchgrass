import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Advanced Tooltip Component with Smooth Animations
 * Business-grade tooltips with intelligent positioning
 */
const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 200,
  offset = 10,
  arrow = true,
  interactive = false,
  maxWidth = 300,
  theme = 'dark',
  animation = 'fade',
  className = '',
  style = {},
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [actualPosition, setActualPosition] = useState(position);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);
  const timeoutRef = useRef(null);

  const positions = {
    top: { placement: 'bottom', transform: 'translateX(-50%)' },
    bottom: { placement: 'top', transform: 'translateX(-50%)' },
    left: { placement: 'right', transform: 'translateY(-50%)' },
    right: { placement: 'left', transform: 'translateY(-50%)' },
    'top-start': { placement: 'bottom', transform: 'translateX(0)' },
    'top-end': { placement: 'bottom', transform: 'translateX(-100%)' },
    'bottom-start': { placement: 'top', transform: 'translateX(0)' },
    'bottom-end': { placement: 'top', transform: 'translateX(-100%)' },
  };

  const themes = {
    dark: {
      background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.98) 0%, rgba(31, 41, 55, 0.98) 100%)',
      color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 12px 48px rgba(0, 0, 0, 0.3)',
    },
    light: {
      background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(243, 244, 246, 0.98) 100%)',
      color: '#111827',
      border: '1px solid rgba(209, 213, 219, 0.5)',
      boxShadow: '0 12px 48px rgba(0, 0, 0, 0.1)',
    },
    premium: {
      background: 'linear-gradient(145deg, rgba(30, 30, 30, 0.98) 0%, rgba(40, 40, 40, 0.98) 100%)',
      color: '#fbbf24',
      border: '1px solid rgba(251, 191, 36, 0.2)',
      boxShadow: '0 12px 48px rgba(251, 191, 36, 0.15)',
    },
    success: {
      background: 'linear-gradient(145deg, rgba(22, 163, 74, 0.15) 0%, rgba(21, 128, 61, 0.15) 100%)',
      color: '#22c55e',
      border: '1px solid rgba(34, 197, 94, 0.2)',
      boxShadow: '0 12px 48px rgba(34, 197, 94, 0.15)',
      backdropFilter: 'blur(20px)',
    },
  };

  const animations = {
    fade: {
      enter: 'tooltipFadeIn 0.2s ease-out',
      exit: 'tooltipFadeOut 0.2s ease-in',
    },
    scale: {
      enter: 'tooltipScaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      exit: 'tooltipScaleOut 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    slide: {
      enter: 'tooltipSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      exit: 'tooltipSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    bounce: {
      enter: 'tooltipBounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      exit: 'tooltipBounceOut 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  };

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        let newPosition = position;
        
        // Auto-adjust position if needed
        if (position === 'top' && rect.top < 100) {
          newPosition = 'bottom';
        } else if (position === 'bottom' && viewportHeight - rect.bottom < 100) {
          newPosition = 'top';
        } else if (position === 'left' && rect.left < 100) {
          newPosition = 'right';
        } else if (position === 'right' && viewportWidth - rect.right < 100) {
          newPosition = 'left';
        }
        
        setActualPosition(newPosition);
        setCoords({ x: rect.left, y: rect.top });
        setIsVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (!interactive || !isMouseOverTooltip()) {
        setIsVisible(false);
      }
    }, 100);
  };

  const isMouseOverTooltip = () => {
    if (!tooltipRef.current) return false;
    const rect = tooltipRef.current.getBoundingClientRect();
    return (
      mouseX >= rect.left &&
      mouseX <= rect.right &&
      mouseY >= rect.top &&
      mouseY <= rect.bottom
    );
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  let mouseX = 0;
  let mouseY = 0;

  const handleMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const tooltipStyles = `
    .tooltip-wrapper {
      display: inline-block;
      position: relative;
    }
    
    .tooltip-trigger {
      cursor: help;
    }
    
    .tooltip-container {
      position: fixed;
      z-index: 9999;
      pointer-events: none;
      max-width: ${maxWidth}px;
      animation: ${animations[animation].enter};
    }
    
    .tooltip-container.hiding {
      animation: ${animations[animation].exit};
      opacity: 0;
      transform: scale(0.95);
    }
    
    .tooltip-content {
      position: relative;
      padding: 12px 16px;
      border-radius: 12px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      font-weight: 400;
      letter-spacing: -0.01em;
      white-space: pre-wrap;
      word-wrap: break-word;
      backdrop-filter: blur(20px);
    }
    
    .tooltip-arrow {
      position: absolute;
      width: 12px;
      height: 12px;
      background: inherit;
      border: inherit;
      border-right: none;
      border-bottom: none;
    }
    
    /* Position-specific styles */
    .tooltip-container[data-position="top"] {
      transform: translate(-50%, calc(-100% - ${offset}px));
    }
    
    .tooltip-container[data-position="top"] .tooltip-arrow {
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%) rotate(135deg);
    }
    
    .tooltip-container[data-position="bottom"] {
      transform: translate(-50%, ${offset}px);
    }
    
    .tooltip-container[data-position="bottom"] .tooltip-arrow {
      top: -6px;
      left: 50%;
      transform: translateX(-50%) rotate(-45deg);
    }
    
    .tooltip-container[data-position="left"] {
      transform: translate(calc(-100% - ${offset}px), -50%);
    }
    
    .tooltip-container[data-position="left"] .tooltip-arrow {
      right: -6px;
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
    }
    
    .tooltip-container[data-position="right"] {
      transform: translate(${offset}px, -50%);
    }
    
    .tooltip-container[data-position="right"] .tooltip-arrow {
      left: -6px;
      top: 50%;
      transform: translateY(-50%) rotate(-135deg);
    }
    
    .tooltip-container[data-position="top-start"] {
      transform: translateY(calc(-100% - ${offset}px));
    }
    
    .tooltip-container[data-position="top-start"] .tooltip-arrow {
      bottom: -6px;
      left: 16px;
      transform: rotate(135deg);
    }
    
    .tooltip-container[data-position="top-end"] {
      transform: translate(-100%, calc(-100% - ${offset}px));
    }
    
    .tooltip-container[data-position="top-end"] .tooltip-arrow {
      bottom: -6px;
      right: 16px;
      transform: rotate(135deg);
    }
    
    .tooltip-container[data-position="bottom-start"] {
      transform: translateY(${offset}px);
    }
    
    .tooltip-container[data-position="bottom-start"] .tooltip-arrow {
      top: -6px;
      left: 16px;
      transform: rotate(-45deg);
    }
    
    .tooltip-container[data-position="bottom-end"] {
      transform: translate(-100%, ${offset}px);
    }
    
    .tooltip-container[data-position="bottom-end"] .tooltip-arrow {
      top: -6px;
      right: 16px;
      transform: rotate(-45deg);
    }
    
    /* Glow effect */
    .tooltip-glow {
      position: absolute;
      inset: -2px;
      background: linear-gradient(45deg, #22c55e, #3b82f6, #8b5cf6);
      border-radius: inherit;
      filter: blur(10px);
      opacity: 0.2;
      z-index: -1;
      animation: tooltipGlowRotate 4s linear infinite;
    }
    
    /* Animations */
    @keyframes tooltipFadeIn {
      from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }
    
    @keyframes tooltipFadeOut {
      from {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      to {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.95);
      }
    }
    
    @keyframes tooltipScaleIn {
      0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5);
      }
      70% {
        transform: translate(-50%, -50%) scale(1.05);
      }
      100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }
    
    @keyframes tooltipScaleOut {
      from {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      to {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5);
      }
    }
    
    @keyframes tooltipSlideIn {
      from {
        opacity: 0;
        transform: translate(-50%, -50%) translateY(20px);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%) translateY(0);
      }
    }
    
    @keyframes tooltipSlideOut {
      from {
        opacity: 1;
        transform: translate(-50%, -50%) translateY(0);
      }
      to {
        opacity: 0;
        transform: translate(-50%, -50%) translateY(20px);
      }
    }
    
    @keyframes tooltipBounceIn {
      0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.3);
      }
      50% {
        transform: translate(-50%, -50%) scale(1.1);
      }
      70% {
        transform: translate(-50%, -50%) scale(0.9);
      }
      100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }
    
    @keyframes tooltipBounceOut {
      0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      20% {
        transform: translate(-50%, -50%) scale(1.1);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.3);
      }
    }
    
    @keyframes tooltipGlowRotate {
      0% { filter: hue-rotate(0deg) blur(10px); }
      100% { filter: hue-rotate(360deg) blur(10px); }
    }
    
    /* Interactive tooltip */
    .tooltip-container.interactive {
      pointer-events: auto;
    }
    
    .tooltip-container.interactive .tooltip-content {
      pointer-events: auto;
    }
  `;

  const currentTheme = themes[theme] || themes.dark;
  const currentPosition = positions[actualPosition] || positions.top;

  const tooltipContainerStyle = {
    left: `${coords.x}px`,
    top: `${coords.y}px`,
    transform: `translate(-50%, -50%) ${currentPosition.transform}`,
    animation: isVisible ? animations[animation].enter : animations[animation].exit,
  };

  return (
    <>
      <style>{tooltipStyles}</style>
      
      <div
        className={`tooltip-wrapper ${className}`}
        style={style}
        {...props}
      >
        <div
          ref={triggerRef}
          className="tooltip-trigger"
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          onFocus={showTooltip}
          onBlur={hideTooltip}
        >
          {children}
        </div>
        
        {isVisible && (
          <div
            ref={tooltipRef}
            className={`tooltip-container ${interactive ? 'interactive' : ''} ${!isVisible ? 'hiding' : ''}`}
            style={tooltipContainerStyle}
            data-position={actualPosition}
            onMouseEnter={interactive ? showTooltip : undefined}
            onMouseLeave={interactive ? hideTooltip : undefined}
          >
            <div className="tooltip-glow" />
            
            <div 
              className="tooltip-content"
              style={currentTheme}
            >
              {content}
            </div>
            
            {arrow && (
              <div 
                className="tooltip-arrow"
                style={{
                  background: currentTheme.background,
                  border: currentTheme.border,
                  borderRight: 'none',
                  borderBottom: 'none',
                }}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end']),
  delay: PropTypes.number,
  offset: PropTypes.number,
  arrow: PropTypes.bool,
  interactive: PropTypes.bool,
  maxWidth: PropTypes.number,
  theme: PropTypes.oneOf(['dark', 'light', 'premium', 'success']),
  animation: PropTypes.oneOf(['fade', 'scale', 'slide', 'bounce']),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Tooltip;