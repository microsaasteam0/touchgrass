import React, { useState, useEffect, useRef } from 'react';
import './EmbedWidget.css';

const EmbedWidget = ({ streakData, user }) => {
  const [embedCode, setEmbedCode] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const widgetRef = useRef(null);
  const particleCanvasRef = useRef(null);

  const embedStyles = [
    { id: 'modern', name: 'Modern', color: '#22c55e', icon: '🎨' },
    { id: 'minimal', name: 'Minimal', color: '#3b82f6', icon: '✨' },
    { id: 'premium', name: 'Premium', color: '#f59e0b', icon: '🏆' },
    { id: 'dark', name: 'Dark', color: '#1f2937', icon: '🌙' },
    { id: 'gradient', name: 'Gradient', color: '#8b5cf6', icon: '🌈' }
  ];

  const sizes = [
    { width: 300, height: 150, name: 'Small' },
    { width: 400, height: 200, name: 'Medium' },
    { width: 500, height: 250, name: 'Large' },
    { width: 600, height: 300, name: 'X-Large' }
  ];

  useEffect(() => {
    generateEmbedCode();
    initParticleAnimation();
  }, [selectedStyle, streakData]);

  const generateEmbedCode = () => {
    const baseUrl = window.location.origin;
    const userId = user?.id || 'demo';
    const streakId = streakData?.id || 'demo-streak';
    
    const code = `
<div class="touchgrass-embed" data-user="${userId}" data-streak="${streakId}" data-style="${selectedStyle}">
  <script async src="${baseUrl}/embed.js"></script>
</div>
    `.trim();
    
    setEmbedCode(code);
  };

  const initParticleAnimation = () => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let particles = [];
    const particleCount = 30;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = selectedStyle === 'premium' ? '#fbbf24' : 
                     selectedStyle === 'gradient' ? '#8b5cf6' : '#22c55e';
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      // Cleanup
    };
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setIsAnimating(true);
      
      setTimeout(() => {
        setCopied(false);
        setIsAnimating(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadWidgetAssets = () => {
    // Generate and download widget package
    const widgetPackage = {
      html: embedCode,
      css: generateWidgetCSS(),
      js: generateWidgetJS(),
      readme: generateReadme()
    };

    const blob = new Blob([JSON.stringify(widgetPackage, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `touchgrass-widget-${selectedStyle}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateWidgetCSS = () => {
    return `
.touchgrass-widget {
  /* Widget CSS for ${selectedStyle} style */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  /* Add more styles based on selectedStyle */
}
    `;
  };

  const generateWidgetJS = () => {
    return `
// TouchGrass Widget JS
// Generated for ${user?.displayName || 'User'}
    `;
  };

  const generateReadme = () => {
    return `
# TouchGrass Embed Widget

This widget displays your current streak: ${streakData?.currentStreak || 0} days
Consistency: ${user?.stats?.consistencyScore || 0}%

Embed on your website to showcase your discipline!
    `;
  };

  return (
    <div className="embed-widget-container">
      <div className="widget-header">
        <div className="header-content">
          <div className="header-icon">📊</div>
          <div>
            <h2 className="header-title">Professional Embed Widget</h2>
            <p className="header-subtitle">Showcase your discipline on any website</p>
          </div>
        </div>
        <div className="header-badge">
          <span className="badge-text">BUSINESS GRADE</span>
        </div>
      </div>

      <div className="widget-content">
        {/* Left Column - Preview */}
        <div className="preview-section">
          <div className="preview-header">
            <h3>Live Preview</h3>
            <div className="preview-controls">
              {sizes.map(size => (
                <button
                  key={size.name}
                  className="size-button"
                  onClick={() => {
                    if (widgetRef.current) {
                      widgetRef.current.style.width = `${size.width}px`;
                      widgetRef.current.style.height = `${size.height}px`;
                    }
                  }}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          <div className="preview-wrapper">
            <canvas
              ref={particleCanvasRef}
              className="particle-canvas"
            />
            <div
              ref={widgetRef}
              className={`widget-preview widget-style-${selectedStyle}`}
              style={{
                width: '400px',
                height: '200px',
                '--widget-color': embedStyles.find(s => s.id === selectedStyle)?.color
              }}
            >
              <div className="widget-inner">
                <div className="widget-header">
                  <div className="widget-logo">
                    <span className="logo-icon">🌱</span>
                    <span className="logo-text">touchgrass.now</span>
                  </div>
                  <div className="widget-badge">
                    <span className="badge-dot"></span>
                    LIVE
                  </div>
                </div>
                
                <div className="widget-body">
                  <div className="streak-display">
                    <div className="streak-number">{streakData?.currentStreak || 42}</div>
                    <div className="streak-label">DAY STREAK</div>
                  </div>
                  
                  <div className="widget-stats">
                    <div className="stat-item">
                      <div className="stat-value">{user?.stats?.consistencyScore || 87}%</div>
                      <div className="stat-label">Consistency</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">#{user?.rank || 42}</div>
                      <div className="stat-label">Global Rank</div>
                    </div>
                  </div>
                </div>
                
                <div className="widget-footer">
                  <div className="user-info">
                    <div className="user-avatar">
                      {user?.displayName?.[0] || 'U'}
                    </div>
                    <div className="user-details">
                      <div className="user-name">{user?.displayName || 'TouchGrass User'}</div>
                      <div className="user-status">Active • Verified</div>
                    </div>
                  </div>
                  <div className="widget-cta">
                    <span className="cta-text">Join the Movement</span>
                  </div>
                </div>
              </div>
              
              {/* Animated border effect */}
              <div className="widget-border"></div>
            </div>
          </div>

          <div className="preview-info">
            <div className="info-item">
              <div className="info-icon">⚡</div>
              <div className="info-content">
                <div className="info-title">Real-time Updates</div>
                <div className="info-desc">Automatically updates with your streak</div>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">🔒</div>
              <div className="info-content">
                <div className="info-title">Enterprise Security</div>
                <div className="info-desc">256-bit SSL encryption</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Controls */}
        <div className="controls-section">
          <div className="style-selector">
            <h3>Widget Style</h3>
            <div className="style-grid">
              {embedStyles.map(style => (
                <button
                  key={style.id}
                  className={`style-option ${selectedStyle === style.id ? 'selected' : ''}`}
                  onClick={() => setSelectedStyle(style.id)}
                  style={{ '--style-color': style.color }}
                >
                  <div className="style-icon">{style.icon}</div>
                  <div className="style-name">{style.name}</div>
                  <div className="style-indicator"></div>
                </button>
              ))}
            </div>
          </div>

          <div className="code-section">
            <div className="code-header">
              <h3>Embed Code</h3>
              <div className="code-actions">
                <button
                  className={`copy-button ${copied ? 'copied' : ''} ${isAnimating ? 'animating' : ''}`}
                  onClick={copyToClipboard}
                >
                  <span className="copy-text">{copied ? 'Copied!' : 'Copy Code'}</span>
                  <span className="copy-icon">{copied ? '✓' : '📋'}</span>
                </button>
                <button className="download-button" onClick={downloadWidgetAssets}>
                  <span className="download-icon">⬇️</span>
                  Download Package
                </button>
              </div>
            </div>

            <div className="code-editor">
              <pre className="code-content">
                <code>{embedCode}</code>
              </pre>
              <div className="code-highlight"></div>
            </div>

            <div className="integration-guide">
              <h4>Integration Guide</h4>
              <div className="integration-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">Copy the embed code above</div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">Paste into your website HTML</div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">Widget automatically loads</div>
                </div>
              </div>
            </div>
          </div>

          <div className="analytics-section">
            <h3>Widget Analytics</h3>
            <div className="analytics-grid">
              <div className="analytic-card">
                <div className="analytic-value">0</div>
                <div className="analytic-label">Current Embeds</div>
              </div>
              <div className="analytic-card">
                <div className="analytic-value">0</div>
                <div className="analytic-label">Total Views</div>
              </div>
              <div className="analytic-card">
                <div className="analytic-value">0</div>
                <div className="analytic-label">Clicks</div>
              </div>
              <div className="analytic-card">
                <div className="analytic-value">0%</div>
                <div className="analytic-label">CTR</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="widget-footer">
        <div className="footer-content">
          <div className="footer-info">
            <div className="info-icon">💼</div>
            <div>
              <div className="info-title">Business Features</div>
              <div className="info-list">
                <span>• White-label options</span>
                <span>• Custom domains</span>
                <span>• API access</span>
                <span>• Analytics dashboard</span>
              </div>
            </div>
          </div>
          <button className="contact-sales">
            <span className="sales-icon">📞</span>
            Contact Enterprise Sales
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmbedWidget;