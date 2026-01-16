import React, { useState, useEffect, useRef } from 'react';
import './ShameModal.css';

const ShameModal = ({ isOpen, onClose, onAcceptShame, user, streakData }) => {
  const [shameMessage, setShameMessage] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [selectedRoast, setSelectedRoast] = useState('');
  const [shameLevel, setShameLevel] = useState('medium');
  const [confessionType, setConfessionType] = useState('laziness');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const modalRef = useRef(null);
  const flamesRef = useRef(null);
  const shameMeterRef = useRef(null);

  const roasts = [
    "Another day as a digital zombie. Your chair must be forming a permanent impression by now.",
    "Vitamin D levels: critically low. Screen time: critically high. Priorities: questionable.",
    "The sun asked about you. It said 'Who?' when I mentioned your name.",
    "Your plants get more outdoor time than you do. And they're literally rooted in place.",
    "Your step count today: 'Error - insufficient data'. That's not a good error to have.",
    "Even your phone's weather app knows you're not going outside. It stopped showing the forecast.",
    "The great outdoors called. You sent it to voicemail. Again.",
    "Your idea of 'touching grass' is scrolling past nature photos on Instagram. Pathetic.",
    "The only thing green you've touched today is the envy of watching others live their lives.",
    "Your shadow is starting to forget what you look like in natural light."
  ];

  const shameLevels = [
    { id: 'light', label: 'Gentle Reminder', icon: '😅', color: '#22c55e' },
    { id: 'medium', label: 'Public Shame', icon: '😳', color: '#f59e0b' },
    { id: 'heavy', label: 'Maximum Cringe', icon: '😰', color: '#ef4444' }
  ];

  const confessionTypes = [
    { id: 'laziness', label: 'Pure Laziness', icon: '🛋️' },
    { id: 'work', label: 'Work Overload', icon: '💼' },
    { id: 'distraction', label: 'Digital Distraction', icon: '📱' },
    { id: 'weather', label: 'Weather Excuse', icon: '☔' },
    { id: 'forgot', label: 'Simply Forgot', icon: '🧠' },
    { id: 'other', label: 'Other', icon: '❓' }
  ];

  const publicConsequences = [
    "Public shame badge on profile for 24h",
    "Ranked below verified users",
    "Visible on the Shame Wall",
    "Notification to your followers",
    "Reduced streak multiplier"
  ];

  const privateConsequences = [
    "Personal disappointment log",
    "Reduced consistency score",
    "Internal streak penalty",
    "No social consequences"
  ];

  useEffect(() => {
    if (isOpen) {
      setCountdown(30);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Auto-select a roast if none selected
            if (!selectedRoast) {
              setSelectedRoast(roasts[Math.floor(Math.random() * roasts.length)]);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Set random roast
      setSelectedRoast(roasts[Math.floor(Math.random() * roasts.length)]);

      // Initialize flame animation
      initFlames();

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (shameLevel === 'heavy') {
      intensifyShameEffects();
    }
  }, [shameLevel]);

  const initFlames = () => {
    if (flamesRef.current) {
      const container = flamesRef.current;
      container.innerHTML = '';

      for (let i = 0; i < 15; i++) {
        const flame = document.createElement('div');
        flame.className = 'shame-flame';
        flame.style.left = `${Math.random() * 100}%`;
        flame.style.animationDelay = `${Math.random() * 2}s`;
        flame.style.setProperty('--flame-color', shameLevels.find(l => l.id === shameLevel)?.color || '#ef4444');
        container.appendChild(flame);
      }
    }
  };

  const intensifyShameEffects = () => {
    if (shameMeterRef.current) {
      const meter = shameMeterRef.current;
      meter.classList.add('intense');
      
      // Add more flames
      if (flamesRef.current) {
        for (let i = 0; i < 10; i++) {
          const flame = document.createElement('div');
          flame.className = 'shame-flame intense';
          flame.style.left = `${Math.random() * 100}%`;
          flame.style.bottom = `${Math.random() * 30}%`;
          flamesRef.current.appendChild(flame);
        }
      }
    }
  };

  const handleAcceptShame = async () => {
    if (!shameMessage.trim() && shameLevel !== 'light') {
      alert('Please write a confession or select a lighter shame level');
      return;
    }

    setIsSubmitting(true);

    // Create shame data
    const shameData = {
      message: shameMessage || selectedRoast,
      isPublic,
      shameLevel,
      confessionType,
      streakLength: streakData?.currentStreak || 0,
      timestamp: new Date().toISOString(),
      user: {
        id: user?.id,
        name: user?.displayName
      }
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Trigger shame effects
    triggerShameEffects();

    // Call parent handler
    if (onAcceptShame) {
      onAcceptShame(shameData);
    }

    // Close modal after delay
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 2000);
  };

  const triggerShameEffects = () => {
    const modal = modalRef.current;
    if (!modal) return;

    // Add shame animation class
    modal.classList.add('shame-accepted');

    // Create shame particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'shame-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.backgroundColor = shameLevels.find(l => l.id === shameLevel)?.color || '#ef4444';
      modal.appendChild(particle);

      setTimeout(() => particle.remove(), 1000);
    }

    // Play shame sound
    playShameSound();
  };

  const playShameSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/256/256-preview.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const getConsequences = () => {
    return isPublic ? publicConsequences : privateConsequences;
  };

  const handleRedemption = () => {
    // Option to redeem by verifying now
    const confirmRedemption = window.confirm(
      'You can still redeem yourself! Go outside now and verify within 4 hours to avoid shame. Continue?'
    );

    if (confirmRedemption) {
      onClose();
      // Redirect to verification page
      window.location.href = '/verify';
    }
  };

  const generateExcuse = () => {
    const excuses = [
      "My Wi-Fi was too good to leave.",
      "I was practicing my indoor tanning skills.",
      "The cat needed emotional support.",
      "I was waiting for better lighting for my verification photo.",
      "My chair and I have formed an unbreakable bond.",
      "I was busy writing my autobiography: 'The Great Indoors'.",
      "The outside world seemed a bit too 'real' today.",
      "I was preserving my skin from premature aging (by sunlight).",
      "My plants were giving me jealous looks.",
      "I was conducting important research on couch comfort."
    ];

    const excuse = excuses[Math.floor(Math.random() * excuses.length)];
    setShameMessage(prev => prev ? `${prev} ${excuse}` : excuse);
  };

  return (
    <div className={`shame-modal-overlay ${isOpen ? 'open' : ''}`}>
      <div ref={modalRef} className="shame-modal">
        {/* Flames Background */}
        <div ref={flamesRef} className="shame-flames"></div>

        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">😈</div>
            <div>
              <h2 className="header-title">Walk of Shame</h2>
              <p className="header-subtitle">Accountability through public humiliation</p>
            </div>
          </div>
          
          <div className="header-countdown">
            <div className="countdown-timer">
              <span className="countdown-value">{countdown}</span>
              <span className="countdown-label">seconds to decide</span>
            </div>
          </div>
        </div>

        <div className="modal-content">
          {/* Left Column - Shame Details */}
          <div className="content-left">
            {/* Roast Display */}
            <div className="roast-section">
              <div className="section-header">
                <h3 className="section-title">
                  <span className="title-icon">🔥</span>
                  The System's Verdict
                </h3>
                <button 
                  className="refresh-roast"
                  onClick={() => setSelectedRoast(roasts[Math.floor(Math.random() * roasts.length)])}
                >
                  🔄 New Roast
                </button>
              </div>
              
              <div className="roast-display">
                <div className="roast-icon">🤖</div>
                <p className="roast-text">{selectedRoast}</p>
                <div className="roast-intensity">
                  <span className="intensity-label">Burn Level:</span>
                  <span className="intensity-value">8/10</span>
                </div>
              </div>
            </div>

            {/* Shame Level Selector */}
            <div className="shame-level-section">
              <h3 className="section-title">Shame Intensity</h3>
              <div className="shame-level-grid">
                {shameLevels.map(level => (
                  <button
                    key={level.id}
                    className={`shame-level-btn ${shameLevel === level.id ? 'selected' : ''}`}
                    onClick={() => setShameLevel(level.id)}
                    style={{ '--level-color': level.color }}
                  >
                    <div className="level-icon">{level.icon}</div>
                    <div className="level-name">{level.label}</div>
                    <div className="level-indicator"></div>
                  </button>
                ))}
              </div>

              {/* Shame Meter */}
              <div ref={shameMeterRef} className="shame-meter">
                <div className="meter-labels">
                  <span className="meter-label">Mild Embarrassment</span>
                  <span className="meter-label">Public Humiliation</span>
                  <span className="meter-label">Eternal Regret</span>
                </div>
                <div className="meter-bar">
                  <div 
                    className="meter-fill"
                    style={{ 
                      width: shameLevel === 'light' ? '33%' : shameLevel === 'medium' ? '66%' : '100%',
                      backgroundColor: shameLevels.find(l => l.id === shameLevel)?.color
                    }}
                  ></div>
                  <div className="meter-glow"></div>
                </div>
              </div>
            </div>

            {/* Confession Type */}
            <div className="confession-section">
              <h3 className="section-title">Confession Type</h3>
              <div className="confession-grid">
                {confessionTypes.map(type => (
                  <button
                    key={type.id}
                    className={`confession-btn ${confessionType === type.id ? 'selected' : ''}`}
                    onClick={() => setConfessionType(type.id)}
                  >
                    <span className="confession-icon">{type.icon}</span>
                    <span className="confession-label">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Confession & Consequences */}
          <div className="content-right">
            {/* Confession Input */}
            <div className="confession-input-section">
              <div className="section-header">
                <h3 className="section-title">
                  <span className="title-icon">📝</span>
                  Public Confession
                </h3>
                <button className="generate-excuse" onClick={generateExcuse}>
                  <span className="excuse-icon">🎲</span>
                  Generate Excuse
                </button>
              </div>

              <div className="confession-input-container">
                <textarea
                  value={shameMessage}
                  onChange={(e) => setShameMessage(e.target.value)}
                  placeholder="I failed to touch grass today because..."
                  className="confession-input"
                  maxLength={500}
                  disabled={shameLevel === 'light'}
                />
                
                <div className="input-footer">
                  <div className="character-count">
                    {shameMessage.length}/500 characters
                  </div>
                  <div className="input-tools">
                    <button className="tool-btn emoji">😀</button>
                    <button className="tool-btn format">B</button>
                    <button className="tool-btn clear" onClick={() => setShameMessage('')}>
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Public/Private Toggle */}
              <div className="privacy-toggle">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="toggle-input"
                  />
                  <span className="toggle-slider"></span>
                  <span className="toggle-text">
                    {isPublic ? 'Public Shame' : 'Private Record'}
                  </span>
                </label>
                <div className="privacy-info">
                  {isPublic ? 
                    'Your confession will be visible to everyone' :
                    'Only you will see this confession'
                  }
                </div>
              </div>
            </div>

            {/* Consequences */}
            <div className="consequences-section">
              <h3 className="section-title">
                <span className="title-icon">⚖️</span>
                Consequences
              </h3>
              
              <div className="consequences-list">
                {getConsequences().map((consequence, index) => (
                  <div key={index} className="consequence-item">
                    <div className="consequence-icon">⚠️</div>
                    <div className="consequence-text">{consequence}</div>
                  </div>
                ))}
              </div>

              {/* Streak Impact */}
              <div className="streak-impact">
                <div className="impact-header">
                  <h4 className="impact-title">Streak Impact</h4>
                  <div className="impact-badge">
                    {shameLevel === 'light' ? 'Minimal' : 
                     shameLevel === 'medium' ? 'Moderate' : 'Severe'}
                  </div>
                </div>
                
                <div className="impact-details">
                  <div className="impact-item">
                    <span className="impact-label">Current Streak:</span>
                    <span className="impact-value streak">{streakData?.currentStreak || 0} days</span>
                  </div>
                  <div className="impact-item">
                    <span className="impact-label">After Shame:</span>
                    <span className="impact-value shame">
                      {streakData?.currentStreak || 0} days*
                      <span className="impact-note"> (marked with shame)</span>
                    </span>
                  </div>
                  <div className="impact-item">
                    <span className="impact-label">Consistency Score:</span>
                    <span className="impact-value penalty">-{shameLevel === 'light' ? '2' : shameLevel === 'medium' ? '5' : '10'}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="advanced-section">
              <button 
                className="advanced-toggle"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <span className="toggle-icon">{showAdvanced ? '▲' : '▼'}</span>
                Advanced Shame Options
              </button>
              
              {showAdvanced && (
                <div className="advanced-options">
                  <div className="option-group">
                    <label className="option-label">
                      <input type="checkbox" />
                      <span className="option-checkmark"></span>
                      Send shame notification to followers
                    </label>
                    <label className="option-label">
                      <input type="checkbox" />
                      <span className="option-checkmark"></span>
                      Display on global shame wall
                    </label>
                    <label className="option-label">
                      <input type="checkbox" />
                      <span className="option-checkmark"></span>
                      Reduce streak multiplier for 7 days
                    </label>
                  </div>
                  
                  <div className="option-slider">
                    <label className="slider-label">Shame Duration</label>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      defaultValue="24"
                      className="duration-slider"
                    />
                    <div className="slider-value">24 hours</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button className="action-btn redeem" onClick={handleRedemption}>
            <span className="btn-icon">🔄</span>
            Redeem Yourself
          </button>
          
          <div className="action-group">
            <button className="action-btn cancel" onClick={onClose}>
              <span className="btn-icon">←</span>
              Go Back
            </button>
            
            <button
              className={`action-btn accept ${shameLevel}`}
              onClick={handleAcceptShame}
              disabled={isSubmitting || (!shameMessage.trim() && shameLevel !== 'light')}
              style={{ 
                '--shame-color': shameLevels.find(l => l.id === shameLevel)?.color 
              }}
            >
              <span className="btn-icon">
                {isSubmitting ? '⏳' : shameLevel === 'light' ? '😅' : shameLevel === 'medium' ? '😳' : '😰'}
              </span>
              {isSubmitting ? 'Accepting Shame...' : `Accept ${shameLevel} Shame`}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="footer-content">
            <div className="footer-warning">
              <div className="warning-icon">⚠️</div>
              <div className="warning-text">
                <strong>Warning:</strong> Accepting shame will mark your streak and reduce your consistency score. 
                This action cannot be undone for 24 hours.
              </div>
            </div>
            
            <div className="footer-tip">
              <div className="tip-icon">💡</div>
              <div className="tip-text">
                <strong>Pro Tip:</strong> Set a daily reminder to avoid future shame. 
                Consistency builds discipline!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShameModal;