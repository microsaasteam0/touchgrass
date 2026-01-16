import React, { useState, useEffect, useRef } from 'react';
import './ShareModal.css';

const ShareModal = ({ isOpen, onClose, streakData, user }) => {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareStats, setShareStats] = useState(null);
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const [scheduledShare, setScheduledShare] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const modalRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  const platforms = [
    {
      id: 'twitter',
      name: 'Twitter (X)',
      icon: '🐦',
      color: '#1DA1F2',
      gradient: 'linear-gradient(135deg, #1DA1F2 0%, #0d8bd9 100%)',
      characterLimit: 280,
      analytics: true
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      color: '#0077B5',
      gradient: 'linear-gradient(135deg, #0077B5 0%, #005582 100%)',
      characterLimit: 3000,
      analytics: true
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '👥',
      color: '#1877F2',
      gradient: 'linear-gradient(135deg, #1877F2 0%, #0d5fbf 100%)',
      characterLimit: 63206,
      analytics: true
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📸',
      color: '#E4405F',
      gradient: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)',
      characterLimit: 2200,
      analytics: false
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: '💬',
      color: '#25D366',
      gradient: 'linear-gradient(135deg, #25D366 0%, #1da851 100%)',
      characterLimit: 65536,
      analytics: false
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: '🎮',
      color: '#5865F2',
      gradient: 'linear-gradient(135deg, #5865F2 0%, #4752c4 100%)',
      characterLimit: 2000,
      analytics: true
    }
  ];

  const hashtags = [
    { tag: 'TouchGrass', count: '124K' },
    { tag: 'Accountability', count: '89K' },
    { tag: 'Streak', count: '203K' },
    { tag: 'MentalHealth', count: '1.2M' },
    { tag: 'Discipline', count: '456K' },
    { tag: 'Productivity', count: '789K' },
    { tag: 'Wellness', count: '567K' },
    { tag: 'Outdoors', count: '234K' },
    { tag: 'DailyHabit', count: '123K' },
    { tag: 'SelfImprovement', count: '345K' }
  ];

  const messageTemplates = [
    `Day ${streakData?.currentStreak || 0} of my #TouchGrass journey! Building real-world discipline one day at a time. 🌱`,
    `🏆 Just hit a ${streakData?.currentStreak || 0}-day streak on @touchgrass_now! The psychology of consistency is powerful. #Streak #Accountability`,
    `Proving that small daily actions lead to massive results. ${streakData?.currentStreak || 0} consecutive days of outdoor discipline. #Discipline #MentalHealth`,
    `From digital zombie to outdoor enthusiast in ${streakData?.currentStreak || 0} days. The power of accountability is real. #TouchGrass #Wellness`,
    `${streakData?.currentStreak || 0} days of proving discipline > motivation. Join me on this journey. #Productivity #SelfImprovement`
  ];

  const scheduleOptions = [
    { label: 'Share Now', value: 'now' },
    { label: 'In 1 hour', value: '1h' },
    { label: 'Tomorrow morning', value: 'tomorrow' },
    { label: 'Next Monday', value: 'monday' },
    { label: 'Custom time', value: 'custom' }
  ];

  useEffect(() => {
    if (isOpen) {
      generateShareContent();
      loadShareStats();
      initParticleEffect();
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      cleanupParticles();
    };
  }, [isOpen]);

  const generateShareContent = async () => {
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/share/${streakData?.id || 'demo'}?ref=${user?.id || 'user'}`;
      setShareUrl(shareUrl);
      
      // Generate OG image URL
      const ogImageUrl = `https://og.touchgrass.now/api/image?streak=${streakData?.currentStreak || 0}&user=${user?.displayName || 'User'}&consistency=${user?.stats?.consistencyScore || 0}`;
      setOgImage(ogImageUrl);
      
      // Set default message
      setCustomMessage(messageTemplates[0]);
      
      setIsGenerating(false);
    }, 500);
  };

  const loadShareStats = async () => {
    // Simulate API call
    setTimeout(() => {
      setShareStats({
        totalShares: 42,
        sharesToday: 3,
        estimatedReach: 12500,
        engagementRate: '4.2%',
        viralScore: 78,
        topPlatform: 'Twitter'
      });
    }, 300);
  };

  const initParticleEffect = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    particlesRef.current = [];

    class Particle {
      constructor() {
        this.x = Math.random() * rect.width;
        this.y = Math.random() * rect.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `hsl(${Math.random() * 60 + 120}, 70%, 60%)`;
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > rect.width) this.x = 0;
        else if (this.x < 0) this.x = rect.width;
        if (this.y > rect.height) this.y = 0;
        else if (this.y < 0) this.y = rect.height;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
      }
    }

    // Create particles
    for (let i = 0; i < 50; i++) {
      particlesRef.current.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();
  };

  const cleanupParticles = () => {
    particlesRef.current = [];
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  const handleShare = async (platformId) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return;

    // Create share data
    const shareData = {
      text: customMessage,
      url: shareUrl,
      platform: platformId,
      hashtags: selectedHashtags,
      scheduled: scheduledShare,
      metadata: {
        streak: streakData?.currentStreak,
        user: user?.displayName,
        timestamp: new Date().toISOString()
      }
    };

    console.log('Sharing:', shareData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success animation
    triggerSuccessAnimation();
    
    // Close modal after delay
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const triggerSuccessAnimation = () => {
    const modal = modalRef.current;
    if (!modal) return;

    // Add success class for animation
    modal.classList.add('share-success');
    
    // Create success particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'success-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 0.5}s`;
      modal.appendChild(particle);
    }

    setTimeout(() => {
      modal.classList.remove('share-success');
      // Remove particles
      const particles = modal.querySelectorAll('.success-particle');
      particles.forEach(p => p.remove());
    }, 2000);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${customMessage}\n\n${shareUrl}`);
      setCopied(true);
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadImage = async () => {
    try {
      const response = await fetch(ogImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `touchgrass-streak-${streakData?.currentStreak || 0}.png`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  const toggleHashtag = (tag) => {
    if (selectedHashtags.includes(tag)) {
      setSelectedHashtags(selectedHashtags.filter(t => t !== tag));
    } else {
      if (selectedHashtags.length < 5) {
        setSelectedHashtags([...selectedHashtags, tag]);
      }
    }
  };

  const getCharacterCount = () => {
    const platform = platforms.find(p => p.id === selectedPlatform);
    const limit = platform?.characterLimit || 280;
    const used = customMessage.length + selectedHashtags.reduce((sum, tag) => sum + tag.length + 2, 0);
    
    return {
      used,
      limit,
      remaining: limit - used,
      isOver: used > limit
    };
  };

  return (
    <div className={`share-modal-overlay ${isOpen ? 'open' : ''}`}>
      <canvas ref={canvasRef} className="particle-canvas"></canvas>
      
      <div ref={modalRef} className="share-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">🚀</div>
            <div>
              <h2 className="header-title">Viral Share Studio</h2>
              <p className="header-subtitle">Amplify your achievement across all platforms</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="close-button" onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        <div className="modal-content">
          {/* Left Column - Preview & Message */}
          <div className="content-left">
            {/* Platform Selection */}
            <div className="platform-section">
              <h3 className="section-title">Select Platform</h3>
              <div className="platform-grid">
                {platforms.map(platform => (
                  <button
                    key={platform.id}
                    className={`platform-card ${selectedPlatform === platform.id ? 'selected' : ''}`}
                    onClick={() => setSelectedPlatform(platform.id)}
                    style={{ '--platform-gradient': platform.gradient }}
                  >
                    <div className="platform-icon">{platform.icon}</div>
                    <div className="platform-name">{platform.name}</div>
                    {platform.analytics && (
                      <div className="platform-badge">📊</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Editor */}
            <div className="message-section">
              <div className="section-header">
                <h3 className="section-title">Custom Message</h3>
                <div className="character-count">
                  <span className={`count ${getCharacterCount().isOver ? 'over' : ''}`}>
                    {getCharacterCount().used}/{getCharacterCount().limit}
                  </span>
                </div>
              </div>
              
              <div className="message-editor">
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Craft your viral message..."
                  className="message-input"
                  maxLength={selectedPlatform ? platforms.find(p => p.id === selectedPlatform)?.characterLimit : 280}
                />
                
                <div className="editor-tools">
                  <select
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="template-selector"
                  >
                    <option value="">Quick Templates</option>
                    {messageTemplates.map((template, index) => (
                      <option key={index} value={template}>
                        Template {index + 1}
                      </option>
                    ))}
                  </select>
                  
                  <button className="ai-suggest">
                    <span className="ai-icon">🤖</span>
                    AI Enhance
                  </button>
                </div>
              </div>

              {/* Hashtag Cloud */}
              <div className="hashtag-section">
                <h4 className="section-subtitle">Trending Hashtags</h4>
                <div className="hashtag-cloud">
                  {hashtags.map(({ tag, count }) => (
                    <button
                      key={tag}
                      className={`hashtag ${selectedHashtags.includes(tag) ? 'selected' : ''}`}
                      onClick={() => toggleHashtag(tag)}
                    >
                      <span className="hashtag-text">#{tag}</span>
                      <span className="hashtag-count">{count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="content-right">
            {/* Preview Toggle */}
            <div className="preview-toggle">
              <button
                className={`toggle-btn ${showPreview ? 'active' : ''}`}
                onClick={() => setShowPreview(true)}
              >
                📱 Preview
              </button>
              <button
                className={`toggle-btn ${!showPreview ? 'active' : ''}`}
                onClick={() => setShowPreview(false)}
              >
                📊 Analytics
              </button>
            </div>

            {showPreview ? (
              <div className="preview-section">
                <div className="preview-container">
                  {selectedPlatform && (
                    <div className={`platform-preview preview-${selectedPlatform}`}>
                      <div className="preview-header">
                        <div className="preview-avatar">
                          {user?.displayName?.[0] || 'U'}
                        </div>
                        <div className="preview-user">
                          <div className="preview-username">{user?.displayName || 'You'}</div>
                          <div className="preview-handle">@touchgrass_user</div>
                        </div>
                        <div className="preview-badge">🌱</div>
                      </div>
                      
                      <div className="preview-content">
                        <p className="preview-text">{customMessage || 'Your message will appear here...'}</p>
                        
                        {selectedHashtags.length > 0 && (
                          <div className="preview-hashtags">
                            {selectedHashtags.map(tag => (
                              <span key={tag} className="preview-hashtag">#{tag}</span>
                            ))}
                          </div>
                        )}
                        
                        <div className="preview-card">
                          <div className="card-image">
                            <img src={ogImage} alt="Streak preview" />
                          </div>
                          <div className="card-content">
                            <div className="card-title">My TouchGrass Journey</div>
                            <div className="card-url">{shareUrl.replace('https://', '')}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="preview-stats">
                        <div className="stat">
                          <span className="stat-icon">❤️</span>
                          <span className="stat-count">0</span>
                        </div>
                        <div className="stat">
                          <span className="stat-icon">🔄</span>
                          <span className="stat-count">0</span>
                        </div>
                        <div className="stat">
                          <span className="stat-icon">💬</span>
                          <span className="stat-count">0</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="preview-actions">
                  <button className="action-btn download-btn" onClick={downloadImage}>
                    <span className="btn-icon">⬇️</span>
                    Download Image
                  </button>
                  <button className="action-btn copy-btn" onClick={copyToClipboard}>
                    <span className="btn-icon">{copied ? '✓' : '📋'}</span>
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="analytics-section">
                {shareStats && (
                  <div className="analytics-dashboard">
                    <div className="analytics-header">
                      <h3 className="analytics-title">Share Performance</h3>
                      <div className="analytics-period">Last 30 days</div>
                    </div>
                    
                    <div className="analytics-grid">
                      <div className="metric-card">
                        <div className="metric-value">{shareStats.totalShares}</div>
                        <div className="metric-label">Total Shares</div>
                        <div className="metric-trend up">+12%</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-value">{shareStats.estimatedReach.toLocaleString()}</div>
                        <div className="metric-label">Estimated Reach</div>
                        <div className="metric-trend up">+24%</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-value">{shareStats.engagementRate}</div>
                        <div className="metric-label">Engagement Rate</div>
                        <div className="metric-trend up">+3.2%</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-value">{shareStats.viralScore}</div>
                        <div className="metric-label">Viral Score</div>
                        <div className="metric-trend up">+15</div>
                      </div>
                    </div>
                    
                    <div className="analytics-chart">
                      <div className="chart-placeholder">
                        <div className="chart-bar" style={{ height: '80%' }}></div>
                        <div className="chart-bar" style={{ height: '60%' }}></div>
                        <div className="chart-bar" style={{ height: '90%' }}></div>
                        <div className="chart-bar" style={{ height: '40%' }}></div>
                        <div className="chart-bar" style={{ height: '70%' }}></div>
                        <div className="chart-bar" style={{ height: '95%' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Schedule & Advanced Options */}
            <div className="advanced-section">
              <h4 className="section-title">Advanced Options</h4>
              
              <div className="schedule-options">
                <label className="option-label">Schedule Share</label>
                <div className="schedule-buttons">
                  {scheduleOptions.map(option => (
                    <button
                      key={option.value}
                      className={`schedule-btn ${scheduledShare === option.value ? 'selected' : ''}`}
                      onClick={() => setScheduledShare(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="additional-options">
                <label className="option-checkbox">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Track analytics for this share
                </label>
                <label className="option-checkbox">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Auto-post to multiple platforms
                </label>
                <label className="option-checkbox">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Notify when shared
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-section">
              <button className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button
                className="share-btn"
                onClick={() => handleShare(selectedPlatform)}
                disabled={!selectedPlatform || isGenerating || getCharacterCount().isOver}
                style={{ '--platform-color': platforms.find(p => p.id === selectedPlatform)?.color || '#22c55e' }}
              >
                <span className="btn-icon">📤</span>
                {isGenerating ? 'Generating...' : 'Share Now'}
                {scheduledShare && scheduledShare !== 'now' && ' (Scheduled)'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="footer-content">
            <div className="footer-info">
              <div className="info-icon">💡</div>
              <div className="info-text">
                <strong>Pro Tip:</strong> Posts with images get 2.3x more engagement. 
                Use our optimized OG images for maximum reach.
              </div>
            </div>
            <div className="footer-actions">
              <button className="footer-btn">
                <span className="btn-icon">📊</span>
                View Full Analytics
              </button>
              <button className="footer-btn premium">
                <span className="btn-icon">✨</span>
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;