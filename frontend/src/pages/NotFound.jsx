import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import SEO from '../components/seo/SEO';
import { SEO_CONFIG } from '../config/seo';

/**
 * 404 Not Found Page with Premium Animations
 * Business-minded error page with engaging interactions
 */
const NotFound = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    createParticles();
    startFloatingAnimation();
    
    return () => {
      particlesRef.current.forEach(particle => {
        if (particle.interval) clearInterval(particle.interval);
      });
    };
  }, []);

  const createParticles = () => {
    const container = containerRef.current;
    if (!container) return;

    // Create floating particles
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      
      // Random properties
      const size = 2 + Math.random() * 6;
      const color = `hsl(${Math.random() * 60 + 160}, 70%, 60%)`;
      const left = Math.random() * 100;
      const duration = 3 + Math.random() * 4;
      const delay = Math.random() * 2;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = color;
      particle.style.left = `${left}%`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.opacity = 0.3 + Math.random() * 0.4;
      
      container.appendChild(particle);
      particlesRef.current.push(particle);
    }

    // Create floating numbers (404)
    for (let i = 0; i < 3; i++) {
      const number = document.createElement('div');
      number.className = 'floating-number';
      number.textContent = [][i];
      
      const left = 30 + i * 20;
      const duration = 6 + Math.random() * 4;
      const delay = Math.random() * 1;
      
      number.style.left = `${left}%`;
      number.style.animationDuration = `${duration}s`;
      number.style.animationDelay = `${delay}s`;
      number.style.fontSize = `${4 + Math.random() * 2}rem`;
      number.style.opacity = 0.1 + Math.random() * 0.1;
      
      container.appendChild(number);
      particlesRef.current.push(number);
    }
  };

  const startFloatingAnimation = () => {
    particlesRef.current.forEach(particle => {
      if (particle.classList.contains('floating-particle')) {
        particle.interval = setInterval(() => {
          const newLeft = Math.random() * 100;
          particle.style.left = `${newLeft}%`;
        }, 3000);
      }
    });
  };

  const pageStyles = `
    .not-found-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
      padding: 2rem;
    }

    .background-grid {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
      background-size: 50px 50px;
      mask-image: radial-gradient(circle at center, black 30%, transparent 70%);
      animation: gridPulse 8s ease-in-out infinite;
    }

    .content-wrapper {
      position: relative;
      z-index: 2;
      text-align: center;
      max-width: 800px;
      width: 100%;
    }

    .error-code {
      font-size: 15rem;
      font-weight: 900;
      background: linear-gradient(135deg, #22c55e 0%, #3b82f6 50%, #8b5cf6 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0;
      line-height: 1;
      position: relative;
      filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
      animation: errorCodeGlow 3s ease-in-out infinite;
    }

    .error-code::after {
      content: '404';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shine 3s ease-in-out infinite;
    }

    .error-title {
      font-size: 3rem;
      font-weight: 700;
      color: white;
      margin: 2rem 0 1rem;
      letter-spacing: -0.02em;
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    .error-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 3rem;
      line-height: 1.6;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      animation: fadeInUp 0.8s ease-out 0.4s both;
    }

    .action-buttons {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      margin-top: 3rem;
      animation: fadeInUp 0.8s ease-out 0.6s both;
    }

    .floating-particle {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      animation: floatUpAndDown ease-in-out infinite;
      z-index: 1;
    }

    .floating-number {
      position: absolute;
      font-weight: 900;
      color: rgba(255, 255, 255, 0.05);
      pointer-events: none;
      animation: floatUpAndDown ease-in-out infinite;
      z-index: 1;
    }

    .error-illustration {
      width: 300px;
      height: 300px;
      margin: 0 auto 3rem;
      position: relative;
      animation: float 6s ease-in-out infinite;
    }

    .error-illustration::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba(34, 197, 94, 0.2) 0%, transparent 70%);
      border-radius: 50%;
      animation: pulse 4s ease-in-out infinite;
    }

    .broken-chain {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 200px;
      height: 200px;
    }

    .chain-link {
      position: absolute;
      width: 40px;
      height: 40px;
      border: 3px solid #ef4444;
      border-radius: 50%;
      animation: chainBreak 2s ease-out infinite;
    }

    .chain-link:nth-child(1) {
      top: 20%;
      left: 30%;
      animation-delay: 0s;
    }

    .chain-link:nth-child(2) {
      top: 50%;
      left: 20%;
      animation-delay: 0.2s;
    }

    .chain-link:nth-child(3) {
      top: 70%;
      left: 40%;
      animation-delay: 0.4s;
    }

    .chain-link:nth-child(4) {
      top: 30%;
      right: 30%;
      animation-delay: 0.6s;
    }

    .chain-link:nth-child(5) {
      top: 60%;
      right: 20%;
      animation-delay: 0.8s;
    }

    .navigation-suggestions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-top: 4rem;
      animation: fadeInUp 0.8s ease-out 0.8s both;
    }

    .suggestion-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 1.5rem;
      text-align: left;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .suggestion-card:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-4px);
      border-color: rgba(34, 197, 94, 0.3);
    }

    .suggestion-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .suggestion-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: white;
      margin-bottom: 0.5rem;
    }

    .suggestion-desc {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.5;
    }

    @keyframes gridPulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }

    @keyframes errorCodeGlow {
      0%, 100% { 
        filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3)) brightness(1);
      }
      50% { 
        filter: drop-shadow(0 10px 40px rgba(34, 197, 94, 0.4)) brightness(1.2);
      }
    }

    @keyframes shine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    @keyframes floatUpAndDown {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }

    @keyframes chainBreak {
      0% {
        transform: translate(0, 0) rotate(0deg);
        opacity: 1;
      }
      50% {
        transform: translate(var(--tx), var(--ty)) rotate(180deg);
        opacity: 0.5;
      }
      100% {
        transform: translate(var(--tx), var(--ty)) rotate(360deg);
        opacity: 0;
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .glitch-text {
      position: relative;
      display: inline-block;
    }

    .glitch-text::before,
    .glitch-text::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .glitch-text::before {
      animation: glitch-anim 5s infinite linear alternate-reverse;
      color: #f0f;
      z-index: -1;
    }

    .glitch-text::after {
      animation: glitch-anim2 3s infinite linear alternate-reverse;
      color: #0ff;
      z-index: -2;
    }

    @keyframes glitch-anim {
      0% { clip-path: inset(40% 0 61% 0); }
      5% { clip-path: inset(92% 0 1% 0); }
      10% { clip-path: inset(43% 0 1% 0); }
      15% { clip-path: inset(25% 0 58% 0); }
      20% { clip-path: inset(54% 0 7% 0); }
      25% { clip-path: inset(58% 0 43% 0); }
      30% { clip-path: inset(98% 0 1% 0); }
      35% { clip-path: inset(3% 0 46% 0); }
      40% { clip-path: inset(54% 0 1% 0); }
      45% { clip-path: inset(75% 0 20% 0); }
      50% { clip-path: inset(15% 0 85% 0); }
      55% { clip-path: inset(88% 0 1% 0); }
      60% { clip-path: inset(26% 0 74% 0); }
      65% { clip-path: inset(47% 0 53% 0); }
      70% { clip-path: inset(92% 0 1% 0); }
      75% { clip-path: inset(31% 0 69% 0); }
      80% { clip-path: inset(5% 0 95% 0); }
      85% { clip-path: inset(67% 0 33% 0); }
      90% { clip-path: inset(84% 0 1% 0); }
      95% { clip-path: inset(19% 0 81% 0); }
      100% { clip-path: inset(50% 0 50% 0); }
    }

    @keyframes glitch-anim2 {
      0% { clip-path: inset(25% 0 30% 0); }
      5% { clip-path: inset(85% 0 1% 0); }
      10% { clip-path: inset(32% 0 68% 0); }
      15% { clip-path: inset(45% 0 55% 0); }
      20% { clip-path: inset(67% 0 33% 0); }
      25% { clip-path: inset(12% 0 88% 0); }
      30% { clip-path: inset(91% 0 1% 0); }
      35% { clip-path: inset(24% 0 76% 0); }
      40% { clip-path: inset(53% 0 47% 0); }
      45% { clip-path: inset(78% 0 22% 0); }
      50% { clip-path: inset(8% 0 92% 0); }
      55% { clip-path: inset(96% 0 1% 0); }
      60% { clip-path: inset(37% 0 63% 0); }
      65% { clip-path: inset(59% 0 41% 0); }
      70% { clip-path: inset(83% 0 17% 0); }
      75% { clip-path: inset(16% 0 84% 0); }
      80% { clip-path: inset(95% 0 1% 0); }
      85% { clip-path: inset(42% 0 58% 0); }
      90% { clip-path: inset(71% 0 29% 0); }
      95% { clip-path: inset(28% 0 72% 0); }
      100% { clip-path: inset(60% 0 40% 0); }
    }

    @media (max-width: 768px) {
      .error-code {
        font-size: 10rem;
      }
      
      .error-title {
        font-size: 2rem;
      }
      
      .error-subtitle {
        font-size: 1rem;
      }
      
      .action-buttons {
        flex-direction: column;
        align-items: center;
      }
      
      .navigation-suggestions {
        grid-template-columns: 1fr;
      }
    }
  `;

  const suggestions = [
    {
      icon: '🏠',
      title: 'Return Home',
      desc: 'Go back to the main dashboard',
      action: () => navigate('/dashboard')
    },
    {
      icon: '📊',
      title: 'View Leaderboard',
      desc: 'Check global rankings and streaks',
      action: () => navigate('/leaderboard')
    },
    {
      icon: '🌱',
      title: 'Verify Today',
      desc: 'Continue your streak journey',
      action: () => navigate('/verify')
    },
    {
      icon: '🎮',
      title: 'Join Community',
      desc: 'Connect with other users in chat',
      action: () => navigate('/chat')
    }
  ];

  return (
    <>
      <style>{pageStyles}</style>
      <div className="not-found-container" ref={containerRef}>
        <div className="background-grid" />
        
        <div className="content-wrapper">
          <div className="error-illustration">
            <div className="broken-chain">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className="chain-link"
                  style={{
                    '--tx': `${(Math.random() - 0.5) * 100}px`,
                    '--ty': `${(Math.random() - 0.5) * 100}px`
                  }}
                />
              ))}
            </div>
          </div>
          
          <h1 className="error-code"></h1>
          
          <h2 className="error-title">
            
          </h2>
          
          <p className="error-subtitle">
            You’ve discovered a quiet corner of the internet.
            feel free to explore.
          </p>
          
          <div className="action-buttons">
            <Button
              variant="primary"
              size="large"
              onClick={() => navigate('/')}
            >
              🏠 Return to Home
            </Button>
            
            <Button
              variant="secondary"
              size="large"
              onClick={() => navigate(-1)}
            >
              ↩️ Go Back
            </Button>
          </div>
          
          <div className="navigation-suggestions">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-card"
                onClick={suggestion.action}
              >
                <div className="suggestion-icon">{suggestion.icon}</div>
                <h3 className="suggestion-title">{suggestion.title}</h3>
                <p className="suggestion-desc">{suggestion.desc}</p>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '3rem', color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.875rem' }}>
            <p>If you believe this is an error, please contact our support team.</p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
              Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;