import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Advanced Confetti Animation Component
 * Business-grade celebration effects with customizable particles
 */
const Confetti = ({
  active = false,
  duration = 3000,
  particleCount = 150,
  colors = ['#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#fbbf24'],
  shapes = ['circle', 'square', 'triangle'],
  size = 12,
  wind = 0.05,
  gravity = 0.1,
  opacity = 1,
  recycle = true,
  onComplete,
  className = '',
  style = {},
  ...props
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const startTimeRef = useRef(null);

  const createParticle = (x, y) => {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const rotation = Math.random() * Math.PI * 2;
    const rotationSpeed = (Math.random() - 0.5) * 0.2;
    
    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6 - 4,
      color,
      shape,
      size: size * (0.5 + Math.random() * 0.5),
      rotation,
      rotationSpeed,
      opacity,
      life: 1,
      decay: 0.002 + Math.random() * 0.003,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.05 + Math.random() * 0.05,
    };
  };

  const drawParticle = (ctx, particle) => {
    ctx.save();
    ctx.globalAlpha = particle.opacity * particle.life;
    ctx.fillStyle = particle.color;
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    
    const wobbleOffset = Math.sin(particle.wobble) * particle.size * 0.2;
    
    switch (particle.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, wobbleOffset, particle.size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'square':
        ctx.fillRect(
          -particle.size / 2,
          -particle.size / 2 + wobbleOffset,
          particle.size,
          particle.size
        );
        break;
        
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -particle.size / 2 + wobbleOffset);
        ctx.lineTo(particle.size / 2, particle.size / 2 + wobbleOffset);
        ctx.lineTo(-particle.size / 2, particle.size / 2 + wobbleOffset);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'star':
        drawStar(ctx, 0, wobbleOffset, 5, particle.size / 2, particle.size / 4);
        ctx.fill();
        break;
        
      case 'streak':
        ctx.fillRect(
          -particle.size / 2,
          -particle.size / 4 + wobbleOffset,
          particle.size,
          particle.size / 2
        );
        break;
    }
    
    ctx.restore();
  };

  const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius) => {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  };

  const animate = (timestamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }
    
    const elapsed = timestamp - startTimeRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      
      // Update physics
      p.vx += wind;
      p.vy += gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed;
      p.life -= p.decay;
      
      // Remove dead particles
      if (p.life <= 0 || p.y > canvas.height || p.x < -100 || p.x > canvas.width + 100) {
        if (recycle && elapsed < duration) {
          // Recycle particle
          p.x = Math.random() * canvas.width;
          p.y = -10;
          p.vx = (Math.random() - 0.5) * 6;
          p.vy = (Math.random() - 0.5) * 6 - 4;
          p.life = 1;
          p.color = colors[Math.floor(Math.random() * colors.length)];
        } else {
          particlesRef.current.splice(i, 1);
          continue;
        }
      }
      
      drawParticle(ctx, p);
    }
    
    // Check if animation should continue
    if (elapsed < duration || (recycle && particlesRef.current.length > 0)) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (onComplete) onComplete();
      startTimeRef.current = null;
    }
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  };

  const initializeParticles = () => {
    const canvas = canvasRef.current;
    particlesRef.current = [];
    
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(
        createParticle(
          Math.random() * canvas.width,
          Math.random() * canvas.height - canvas.height
        )
      );
    }
  };

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    
    resizeCanvas();
    initializeParticles();
    startTimeRef.current = null;
    
    animationRef.current = requestAnimationFrame(animate);
    
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [active]);

  const confettiStyles = `
    .confetti-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 99999;
      overflow: hidden;
    }
    
    .confetti-canvas {
      display: block;
    }
    
    /* Celebration text */
    .celebration-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 48px;
      font-weight: 800;
      color: white;
      text-align: center;
      pointer-events: none;
      z-index: 100000;
      opacity: 0;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      animation: celebrationText 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    
    @keyframes celebrationText {
      0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5);
      }
      20% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.2);
      }
      40% {
        transform: translate(-50%, -50%) scale(0.9);
      }
      60% {
        transform: translate(-50%, -50%) scale(1.1);
      }
      80% {
        transform: translate(-50%, -50%) scale(0.95);
      }
      100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }
    
    /* Emoji confetti */
    .emoji-confetti {
      position: absolute;
      font-size: 24px;
      animation: emojiFall linear forwards;
      pointer-events: none;
      z-index: 100000;
    }
    
    @keyframes emojiFall {
      0% {
        transform: translateY(-100px) rotate(0deg) scale(0);
        opacity: 0;
      }
      10% {
        opacity: 1;
        transform: translateY(0) rotate(0deg) scale(1);
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(720deg) scale(0);
        opacity: 0;
      }
    }
    
    /* Premium burst effect */
    .premium-burst {
      position: absolute;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, transparent 70%);
      border-radius: 50%;
      animation: premiumBurst 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      pointer-events: none;
      z-index: 100000;
    }
    
    @keyframes premiumBurst {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    /* Circular wave */
    .circular-wave {
      position: absolute;
      border: 2px solid rgba(34, 197, 94, 0.6);
      border-radius: 50%;
      animation: circularWave 1.5s ease-out forwards;
      pointer-events: none;
      z-index: 100000;
    }
    
    @keyframes circularWave {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(10);
        opacity: 0;
      }
    }
    
    /* Firework effect */
    .firework {
      position: absolute;
      width: 4px;
      height: 4px;
      background: white;
      border-radius: 50%;
      animation: fireworkLaunch 1s ease-out forwards;
      pointer-events: none;
      z-index: 100000;
    }
    
    @keyframes fireworkLaunch {
      0% {
        transform: translateY(100vh);
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        transform: translateY(0);
        opacity: 0;
      }
    }
    
    .firework-explosion {
      position: absolute;
      width: 1px;
      height: 1px;
      background: white;
      animation: fireworkExplode 0.8s ease-out forwards;
      pointer-events: none;
      z-index: 100000;
    }
    
    @keyframes fireworkExplode {
      0% {
        transform: scale(0) rotate(0deg) translate(0, 0);
        opacity: 1;
      }
      100% {
        transform: scale(1) rotate(var(--rotation)) translate(var(--distance), 0);
        opacity: 0;
      }
    }
  `;

  const createEmojiConfetti = () => {
    const emojis = ['🎉', '🎊', '🥳', '🎆', '✨', '🌟', '💫', '🔥', '⭐', '🏆'];
    const container = canvasRef.current.parentElement;
    
    for (let i = 0; i < 20; i++) {
      const emoji = document.createElement('div');
      emoji.className = 'emoji-confetti';
      emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      emoji.style.left = `${Math.random() * 100}%`;
      emoji.style.animationDuration = `${1 + Math.random() * 2}s`;
      emoji.style.animationDelay = `${Math.random() * 0.5}s`;
      container.appendChild(emoji);
      
      setTimeout(() => emoji.remove(), 3000);
    }
  };

  const createPremiumBurst = (x, y) => {
    const container = canvasRef.current.parentElement;
    const burst = document.createElement('div');
    burst.className = 'premium-burst';
    burst.style.left = `${x}px`;
    burst.style.top = `${y}px`;
    container.appendChild(burst);
    
    setTimeout(() => burst.remove(), 800);
  };

  const createCircularWave = (x, y) => {
    const container = canvasRef.current.parentElement;
    const wave = document.createElement('div');
    wave.className = 'circular-wave';
    wave.style.left = `${x}px`;
    wave.style.top = `${y}px`;
    wave.style.width = wave.style.height = '10px';
    container.appendChild(wave);
    
    setTimeout(() => wave.remove(), 1500);
  };

  const createFirework = (x, y) => {
    const container = canvasRef.current.parentElement;
    
    // Launch
    const launch = document.createElement('div');
    launch.className = 'firework';
    launch.style.left = `${x}px`;
    launch.style.bottom = '0';
    container.appendChild(launch);
    
    setTimeout(() => {
      launch.remove();
      
      // Explosion
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-explosion';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.setProperty('--rotation', `${(i / 30) * 360}deg`);
        particle.style.setProperty('--distance', `${50 + Math.random() * 100}px`);
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(particle);
        
        setTimeout(() => particle.remove(), 800);
      }
    }, 1000);
  };

  useEffect(() => {
    if (active) {
      // Add special effects
      setTimeout(() => {
        createEmojiConfetti();
        createPremiumBurst(window.innerWidth / 2, window.innerHeight / 2);
        createCircularWave(window.innerWidth / 2, window.innerHeight / 2);
        
        // Create fireworks at random positions
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            createFirework(
              Math.random() * window.innerWidth,
              Math.random() * window.innerHeight * 0.5
            );
          }, i * 500);
        }
      }, 500);
    }
  }, [active]);

  if (!active) return null;

  return (
    <>
      <style>{confettiStyles}</style>
      
      <div className={`confetti-container ${className}`} style={style} {...props}>
        <canvas ref={canvasRef} className="confetti-canvas" />
        
        {active && (
          <div className="celebration-text">
            🎉 Achievement Unlocked! 🏆
          </div>
        )}
      </div>
    </>
  );
};

Confetti.propTypes = {
  active: PropTypes.bool,
  duration: PropTypes.number,
  particleCount: PropTypes.number,
  colors: PropTypes.arrayOf(PropTypes.string),
  shapes: PropTypes.arrayOf(PropTypes.oneOf(['circle', 'square', 'triangle', 'star', 'streak'])),
  size: PropTypes.number,
  wind: PropTypes.number,
  gravity: PropTypes.number,
  opacity: PropTypes.number,
  recycle: PropTypes.bool,
  onComplete: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Confetti;