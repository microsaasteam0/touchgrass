import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

/**
 * Premium Modal Component with Advanced Animations
 * Business-grade modal with international design standards
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  preventScroll = true,
  animationType = 'fade',
  overlayBlur = true,
  showBackdrop = true,
  className = '',
  style = {},
  ...props
}) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const particlesTimeoutRef = useRef(null);

  // Handle body scroll prevention
  useEffect(() => {
    if (preventScroll && isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, preventScroll]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  // Handle animation state
  useEffect(() => {
    if (isOpen && contentRef.current) {
      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.classList.add('active');
        }
      });
    }
  }, [isOpen]);

  // Handle particle effects - ALWAYS called, but conditionally runs code inside
  useEffect(() => {
    if (!isOpen) return;

    const handleOpen = () => {
      if (modalRef.current) {
        const createParticles = () => {
          const particles = [];
          for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const distance = 100;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            const particle = document.createElement('div');
            particle.className = 'modal-particle';
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            particle.style.left = '50%';
            particle.style.top = '50%';
            
            particles.push(particle);
          }
          return particles;
        };

        const particles = createParticles();
        particles.forEach(particle => {
          modalRef.current.appendChild(particle);
          setTimeout(() => particle.remove(), 600);
        });
      }
    };

    particlesTimeoutRef.current = setTimeout(handleOpen, 100);
    
    return () => {
      if (particlesTimeoutRef.current) {
        clearTimeout(particlesTimeoutRef.current);
      }
    };
  }, [isOpen]); // This useEffect is ALWAYS called, just conditionally runs code inside

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === modalRef.current) {
      onClose();
    }
  };

  const handleClose = () => {
    if (contentRef.current) {
      contentRef.current.classList.remove('active');
      contentRef.current.classList.add('closing');
      
      setTimeout(() => {
        onClose();
      }, 300);
    } else {
      onClose();
    }
  };

  const modalStyles = `
    .modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .modal-overlay.active {
      opacity: 1;
      visibility: visible;
    }
    
    .modal-overlay.backdrop-blur {
      backdrop-filter: blur(12px);
      background: rgba(0, 0, 0, 0.7);
    }
    
    .modal-overlay.backdrop-solid {
      background: rgba(0, 0, 0, 0.8);
    }
    
    .modal-container {
      position: relative;
      background: linear-gradient(145deg, rgba(17, 24, 39, 0.98) 0%, rgba(31, 41, 55, 0.98) 100%);
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 32px 96px rgba(0, 0, 0, 0.4);
      overflow: hidden;
      transform: translateY(20px) scale(0.95);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      width: 100%;
      max-width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }
    
    .modal-container.active {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    
    .modal-container.closing {
      transform: translateY(20px) scale(0.95);
      opacity: 0;
    }
    
    /* Size variations */
    .modal-container.small {
      max-width: 400px;
    }
    
    .modal-container.medium {
      max-width: 600px;
    }
    
    .modal-container.large {
      max-width: 800px;
    }
    
    .modal-container.xlarge {
      max-width: 1000px;
    }
    
    .modal-container.full {
      max-width: 95vw;
      max-height: 95vh;
    }
    
    /* Animation types */
    .modal-container.fade {
      transform: translateY(0) scale(1);
      animation: modalFadeIn 0.4s ease-out;
    }
    
    .modal-container.slide-up {
      animation: modalSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    .modal-container.scale {
      animation: modalScaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    .modal-container.flip {
      animation: modalFlipIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    /* Header */
    .modal-header {
      padding: 24px 24px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
    }
    
    .modal-title {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      color: white;
      letter-spacing: -0.01em;
    }
    
    /* Close button */
    .modal-close {
      width: 40px;
      height: 40px;
      border-radius: 12px;
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
    
    .modal-close:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.3);
      transform: rotate(90deg);
    }
    
    .modal-close:active {
      transform: rotate(90deg) scale(0.95);
    }
    
    .modal-close::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba(239, 68, 68, 0.3) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .modal-close:hover::before {
      opacity: 1;
    }
    
    .close-icon {
      position: relative;
      width: 16px;
      height: 16px;
    }
    
    .close-icon::before,
    .close-icon::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 2px;
      background: white;
      border-radius: 1px;
    }
    
    .close-icon::before {
      transform: translate(-50%, -50%) rotate(45deg);
    }
    
    .close-icon::after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
    
    /* Content */
    .modal-content {
      padding: 24px;
      overflow-y: auto;
      flex: 1;
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
    }
    
    .modal-content::-webkit-scrollbar {
      width: 6px;
    }
    
    .modal-content::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .modal-content::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }
    
    .modal-content::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }
    
    /* Footer */
    .modal-footer {
      padding: 16px 24px 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    
    /* Animations */
    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes modalSlideUp {
      from {
        opacity: 0;
        transform: translateY(100px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes modalScaleIn {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    @keyframes modalFlipIn {
      from {
        opacity: 0;
        transform: perspective(1000px) rotateX(-90deg);
      }
      to {
        opacity: 1;
        transform: perspective(1000px) rotateX(0);
      }
    }
    
    /* Modal glow effect */
    .modal-glow {
      position: absolute;
      inset: -2px;
      background: linear-gradient(45deg, #22c55e, #3b82f6, #8b5cf6);
      border-radius: inherit;
      filter: blur(20px);
      opacity: 0.2;
      z-index: -1;
      animation: modalGlowRotate 8s linear infinite;
    }
    
    @keyframes modalGlowRotate {
      0% { filter: hue-rotate(0deg) blur(20px); }
      100% { filter: hue-rotate(360deg) blur(20px); }
    }
    
    /* Particle effect on open */
    @keyframes particleExplode {
      0% {
        transform: scale(0) translate(0, 0);
        opacity: 1;
      }
      100% {
        transform: scale(1) translate(var(--tx), var(--ty));
        opacity: 0;
      }
    }
    
    .modal-particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: linear-gradient(45deg, #22c55e, #3b82f6);
      border-radius: 50%;
      animation: particleExplode 0.6s ease-out forwards;
      z-index: 1;
    }
  `;

  if (!isOpen) return null;

  return createPortal(
    <>
      <style>{modalStyles}</style>
      <div
        ref={modalRef}
        className={`modal-overlay ${overlayBlur ? 'backdrop-blur' : 'backdrop-solid'} ${isOpen ? 'active' : ''}`}
        onClick={handleOverlayClick}
        style={style}
      >
        <div
          ref={contentRef}
          className={`modal-container ${size} ${animationType} ${className}`}
          {...props}
        >
          <div className="modal-glow" />
          
          {title && (
            <div className="modal-header">
              <h2 className="modal-title">{title}</h2>
              {showCloseButton && (
                <button className="modal-close" onClick={handleClose}>
                  <span className="close-icon" />
                </button>
              )}
            </div>
          )}
          
          <div className="modal-content">
            {children}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'full']),
  showCloseButton: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  closeOnEsc: PropTypes.bool,
  preventScroll: PropTypes.bool,
  animationType: PropTypes.oneOf(['fade', 'slide-up', 'scale', 'flip']),
  overlayBlur: PropTypes.bool,
  showBackdrop: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Modal;