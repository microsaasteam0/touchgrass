import React, { useState, useEffect, useRef } from 'react';
import './StreakCounter.css';

const StreakCounter = ({ streakData, user, size = 'large', interactive = true }) => {
  const [currentStreak, setCurrentStreak] = useState(streakData?.currentStreak || 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [particles, setParticles] = useState([]);
  const [milestone, setMilestone] = useState(null);
  const counterRef = useRef(null);
  const canvasRef = useRef(null);
  const glowRef = useRef(null);

  const sizes = {
    small: { fontSize: '2rem', padding: '0.75rem 1.5rem', iconSize: '1.5rem' },
    medium: { fontSize: '3rem', padding: '1rem 2rem', iconSize: '2rem' },
    large: { fontSize: '4rem', padding: '1.5rem 3rem', iconSize: '2.5rem' },
    xlarge: { fontSize: '5rem', padding: '2rem 4rem', iconSize: '3rem' }
  };

  const milestones = [
    { days: 7, name: 'Weekly Warrior', icon: '🔥', color: '#22c55e' },
    { days: 30, name: 'Monthly Maestro', icon: '🌟', color: '#3b82f6' },
    { days: 100, name: 'Century Club', icon: '💯', color: '#8b5cf6' },
    { days: 365, name: 'Year Legend', icon: '👑', color: '#fbbf24' },
    { days: 1000, name: 'Millennial', icon: '🏆', color: '#ec4899' }
  ];

  useEffect(() => {
    if (streakData?.currentStreak && streakData.currentStreak !== currentStreak) {
      animateStreakChange(streakData.currentStreak);
    }
    setCurrentStreak(streakData?.currentStreak || 0);
    
    // Check for milestones
    checkMilestones();
    
    // Initialize particle system
    initParticles();
    
    // Start glow animation
    initGlowAnimation();
    
    // Auto-flash for attention
    if (currentStreak > 0 && currentStreak % 7 === 0) {
      startFlashing();
    }
  }, [streakData, currentStreak]);

  const initParticles = () => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      color: getStreakColor(),
      opacity: Math.random() * 0.6 + 0.2,
      delay: i * 0.05
    }));
    
    setParticles(newParticles);
  };

  const initGlowAnimation = () => {
    if (glowRef.current) {
      const glow = glowRef.current;
      glow.style.animation = 'pulse-glow 2s ease-in-out infinite';
    }
  };

  const checkMilestones = () => {
    const nextMilestone = milestones.find(m => currentStreak < m.days);
    const achievedMilestone = [...milestones].reverse().find(m => currentStreak >= m.days);
    
    setMilestone({
      next: nextMilestone,
      achieved: achievedMilestone,
      progress: nextMilestone ? (currentStreak / nextMilestone.days) * 100 : 100
    });
  };

  const getStreakColor = () => {
    if (currentStreak >= 365) return '#fbbf24'; // Gold
    if (currentStreak >= 100) return '#8b5cf6'; // Purple
    if (currentStreak >= 30) return '#3b82f6'; // Blue
    if (currentStreak >= 7) return '#22c55e'; // Green
    return '#6b7280'; // Gray
  };

  const getStreakIntensity = () => {
    if (currentStreak >= 365) return 'legendary';
    if (currentStreak >= 100) return 'epic';
    if (currentStreak >= 30) return 'rare';
    if (currentStreak >= 7) return 'uncommon';
    return 'common';
  };

  const animateStreakChange = (newStreak) => {
    setIsAnimating(true);
    
    // Create increment animation
    const diff = newStreak - currentStreak;
    const increment = diff > 0 ? 1 : -1;
    let current = currentStreak;
    
    const interval = setInterval(() => {
      current += increment;
      setCurrentStreak(current);
      
      if (current === newStreak) {
        clearInterval(interval);
        setIsAnimating(false);
        
        // Trigger celebration for positive changes
        if (increment > 0) {
          triggerCelebration();
        }
      }
    }, 100);
  };

  const triggerCelebration = () => {
    if (!counterRef.current) return;
    
    // Add celebration class
    counterRef.current.classList.add('celebrating');
    
    // Create celebration particles
    for (let i = 0; i < 25; i++) {
      const particle = document.createElement('div');
      particle.className = 'celebration-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.backgroundColor = getStreakColor();
      particle.style.setProperty('--particle-delay', `${i * 0.05}s`);
      counterRef.current.appendChild(particle);
      
      setTimeout(() => particle.remove(), 1000);
    }
    
    // Play celebration sound
    playCelebrationSound();
    
    setTimeout(() => {
      counterRef.current.classList.remove('celebrating');
    }, 1000);
  };

  const startFlashing = () => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 3000);
  };

  const playCelebrationSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/286/286-preview.mp3');
    audio.volume = 0.2;
    audio.play().catch(() => {});
  };

  const formatNumber = (num) => {
    return num.toString().split('').map((digit, index, array) => (
      <span 
        key={index} 
        className={`streak-digit ${isAnimating ? 'animating' : ''}`}
        style={{ '--digit-delay': `${index * 0.1}s` }}
      >
        {digit}
      </span>
    ));
  };

  const getSizeStyle = () => {
    const sizeConfig = sizes[size] || sizes.large;
    return {
      fontSize: sizeConfig.fontSize,
      padding: sizeConfig.padding,
      '--icon-size': sizeConfig.iconSize,
      '--streak-color': getStreakColor()
    };
  };

  const handleClick = () => {
    if (!interactive) return;
    
    setShowDetails(!showDetails);
    
    // Pulse effect on click
    if (counterRef.current) {
      counterRef.current.classList.add('pulsing');
      setTimeout(() => {
        counterRef.current.classList.remove('pulsing');
      }, 300);
    }
  };

  return (
    <div className="streak-counter-container">
      {/* Main Counter */}
      <div 
        ref={counterRef}
        className={`streak-counter size-${size} intensity-${getStreakIntensity()} ${isAnimating ? 'animating' : ''} ${isFlashing ? 'flashing' : ''} ${interactive ? 'interactive' : ''}`}
        style={getSizeStyle()}
        onClick={handleClick}
      >
        {/* Background Effects */}
        <div className="counter-background">
          <div className="bg-gradient"></div>
          <div className="bg-pattern"></div>
          <div ref={glowRef} className="bg-glow"></div>
        </div>

        {/* Particles */}
        <div className="particle-system">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="streak-particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                opacity: particle.opacity,
                animationDelay: `${particle.delay}s`
              }}
            />
          ))}
        </div>

        {/* Counter Content */}
        <div className="counter-content">
          {/* Icon */}
          <div className="streak-icon">
            <span className="icon-symbol">🔥</span>
            <div className="icon-glow"></div>
          </div>

          {/* Number */}
          <div className="streak-number">
            {formatNumber(currentStreak)}
          </div>

          {/* Label */}
          <div className="streak-label">
            <span className="label-text">DAY STREAK</span>
            <div className="label-underline"></div>
          </div>
        </div>

        {/* Ring Animation */}
        <div className="streak-ring">
          <div className="ring-circle"></div>
          <div className="ring-pulse"></div>
        </div>
      </div>

      {/* Details Panel */}
      {showDetails && interactive && (
        <div className="streak-details">
          <div className="details-header">
            <h3 className="details-title">Streak Analytics</h3>
            <button className="details-close" onClick={() => setShowDetails(false)}>
              ×
            </button>
          </div>

          <div className="details-content">
            {/* Current Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{currentStreak}</div>
                <div className="stat-label">Current Streak</div>
                <div className="stat-trend up">+1 today</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">{user?.stats?.longestStreak || currentStreak}</div>
                <div className="stat-label">Longest Streak</div>
                <div className="stat-trend">All time</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">{user?.stats?.totalDays || currentStreak * 2}</div>
                <div className="stat-label">Total Days</div>
                <div className="stat-trend up">+7 this week</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">{user?.stats?.consistencyScore || 87}%</div>
                <div className="stat-label">Consistency</div>
                <div className="stat-trend up">+2%</div>
              </div>
            </div>

            {/* Milestone Progress */}
            {milestone && (
              <div className="milestone-section">
                <h4 className="section-title">
                  {milestone.achieved ? 'Achieved Milestone' : 'Next Milestone'}
                </h4>
                
                <div className="milestone-card">
                  <div className="milestone-icon" style={{ color: milestone.achieved?.color || milestone.next?.color }}>
                    {milestone.achieved?.icon || milestone.next?.icon}
                  </div>
                  <div className="milestone-info">
                    <div className="milestone-name">
                      {milestone.achieved?.name || milestone.next?.name}
                    </div>
                    <div className="milestone-days">
                      {milestone.achieved ? 
                        `Achieved at ${milestone.achieved.days} days` :
                        `${currentStreak}/${milestone.next.days} days`
                      }
                    </div>
                  </div>
                  
                  {!milestone.achieved && (
                    <div className="milestone-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${milestone.progress}%`,
                            backgroundColor: milestone.next.color
                          }}
                        ></div>
                      </div>
                      <div className="progress-text">{Math.round(milestone.progress)}%</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Streak Calendar */}
            <div className="calendar-section">
              <h4 className="section-title">Recent Activity</h4>
              <div className="streak-calendar">
                {Array.from({ length: 30 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (29 - i));
                  const hasStreak = i >= 24; // Simulated data
                  
                  return (
                    <div 
                      key={i}
                      className={`calendar-day ${hasStreak ? 'active' : ''}`}
                      title={date.toLocaleDateString()}
                    >
                      <div className="day-indicator"></div>
                      <div className="day-label">{date.getDate()}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="action-section">
              <button className="action-btn verify">
                <span className="btn-icon">✅</span>
                Verify Today
              </button>
              <button className="action-btn share">
                <span className="btn-icon">📤</span>
                Share Streak
              </button>
              <button className="action-btn freeze">
                <span className="btn-icon">❄️</span>
                Freeze Streak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {!showDetails && interactive && (
        <div className="streak-tooltip">
          <div className="tooltip-text">
            Click for detailed analytics • {getStreakIntensity().toUpperCase()} streak
          </div>
          <div className="tooltip-arrow"></div>
        </div>
      )}

      {/* Canvas for advanced effects */}
      <canvas ref={canvasRef} className="streak-canvas"></canvas>
    </div>
  );
};

// Additional component for streak leader display
export const StreakLeaderDisplay = ({ users, currentUser }) => {
  const [timeframe, setTimeframe] = useState('weekly');
  const [sortBy, setSortBy] = useState('streak');

  const timeframes = [
    { id: 'daily', label: 'Today', icon: '🌞' },
    { id: 'weekly', label: 'This Week', icon: '📅' },
    { id: 'monthly', label: 'This Month', icon: '📊' },
    { id: 'alltime', label: 'All Time', icon: '🏆' }
  ];

  const sortOptions = [
    { id: 'streak', label: 'Current Streak', icon: '🔥' },
    { id: 'longest', label: 'Longest Streak', icon: '⭐' },
    { id: 'consistency', label: 'Consistency', icon: '📈' },
    { id: 'total', label: 'Total Days', icon: '📅' }
  ];

  const filteredUsers = [...users].sort((a, b) => {
    switch (sortBy) {
      case 'streak':
        return b.stats.currentStreak - a.stats.currentStreak;
      case 'longest':
        return b.stats.longestStreak - a.stats.longestStreak;
      case 'consistency':
        return b.stats.consistencyScore - a.stats.consistencyScore;
      case 'total':
        return b.stats.totalDays - a.stats.totalDays;
      default:
        return 0;
    }
  }).slice(0, 5);

  return (
    <div className="streak-leader-display">
      <div className="leader-header">
        <h3 className="leader-title">Streak Leaders</h3>
        <div className="leader-controls">
          <div className="timeframe-selector">
            {timeframes.map(tf => (
              <button
                key={tf.id}
                className={`timeframe-btn ${timeframe === tf.id ? 'active' : ''}`}
                onClick={() => setTimeframe(tf.id)}
              >
                <span className="timeframe-icon">{tf.icon}</span>
                {tf.label}
              </button>
            ))}
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-selector"
          >
            {sortOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="leaderboard">
        {filteredUsers.map((user, index) => (
          <div key={user.id} className={`leader-item ${user.id === currentUser?.id ? 'current-user' : ''}`}>
            <div className="leader-rank">
              <div className="rank-number">{index + 1}</div>
              <div className="rank-medal">
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
              </div>
            </div>
            
            <div className="leader-info">
              <div className="user-avatar">
                {user.displayName[0]}
              </div>
              <div className="user-details">
                <div className="user-name">{user.displayName}</div>
                <div className="user-stats">
                  <span className="stat">{user.stats.currentStreak} day streak</span>
                  <span className="stat-divider">•</span>
                  <span className="stat">{user.stats.consistencyScore}% consistency</span>
                </div>
              </div>
            </div>
            
            <div className="leader-streak">
              <div className="streak-fire">🔥</div>
              <div className="streak-value">{user.stats.currentStreak}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreakCounter;