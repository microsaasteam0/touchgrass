import React, { useState, useEffect, useRef } from 'react';
import './AchievementBadge.css';

const AchievementBadge = ({ achievement, user, interactive = true }) => {
  const [isRevealing, setIsRevealing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [particles, setParticles] = useState([]);
  const badgeRef = useRef(null);
  const canvasRef = useRef(null);
  const shineRef = useRef(null);

  const achievementTypes = {
    streak: { color: '#22c55e', icon: '🔥', gradient: 'linear-gradient(135deg, #22c55e, #16a34a)' },
    consistency: { color: '#3b82f6', icon: '📊', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
    social: { color: '#8b5cf6', icon: '🦋', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
    challenge: { color: '#f59e0b', icon: '⚔️', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    milestone: { color: '#ec4899', icon: '🏆', gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
    elite: { color: '#ffffff', icon: '👑', gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b, #eab308)' }
  };

  const getAchievementType = () => {
    const name = achievement.name.toLowerCase();
    if (name.includes('streak')) return 'streak';
    if (name.includes('consistency') || name.includes('perfect')) return 'consistency';
    if (name.includes('social') || name.includes('share')) return 'social';
    if (name.includes('challenge') || name.includes('duel')) return 'challenge';
    if (name.includes('elite') || name.includes('premium')) return 'elite';
    return 'milestone';
  };

  const type = getAchievementType();
  const config = achievementTypes[type] || achievementTypes.milestone;

  useEffect(() => {
    if (interactive) {
      setIsRevealing(true);
      setTimeout(() => setIsRevealing(false), 2000);
      createParticles();
    }

    initGlowEffect();
    initShineAnimation();

    return () => {
      setParticles([]);
    };
  }, [interactive]);

  const initGlowEffect = () => {
    const interval = setInterval(() => {
      setGlowIntensity(prev => {
        if (prev >= 100) return 0;
        return prev + 10;
      });
    }, 2000);

    return () => clearInterval(interval);
  };

  const initShineAnimation = () => {
    if (shineRef.current) {
      const shine = shineRef.current;
      shine.style.animation = 'shine 3s ease-in-out infinite';
    }
  };

  const createParticles = () => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      speedX: (Math.random() - 0.5) * 4,
      speedY: (Math.random() - 0.5) * 4,
      color: config.color,
      opacity: Math.random() * 0.8 + 0.2,
      delay: i * 0.1
    }));

    setParticles(newParticles);
  };

  const handleMouseEnter = () => {
    if (!interactive) return;
    setIsHovering(true);
    setGlowIntensity(100);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setIsHovering(false);
    setGlowIntensity(50);
  };

  const handleClick = () => {
    if (!interactive) return;
    
    // Trigger celebration effect
    triggerCelebration();
    
    // Play achievement sound
    playAchievementSound();
  };

  const triggerCelebration = () => {
    if (!badgeRef.current) return;

    // Create celebration particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'celebration-particle';
      particle.style.left = '50%';
      particle.style.top = '50%';
      particle.style.backgroundColor = config.color;
      particle.style.setProperty('--angle', `${Math.random() * 360}deg`);
      particle.style.setProperty('--distance', `${Math.random() * 100 + 50}px`);
      badgeRef.current.appendChild(particle);

      setTimeout(() => particle.remove(), 1000);
    }

    // Add pulse effect
    badgeRef.current.classList.add('celebrating');
    setTimeout(() => {
      badgeRef.current.classList.remove('celebrating');
    }, 1000);
  };

  const playAchievementSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/286/286-preview.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const getRarity = () => {
    const rarityMap = {
      'Weekly Warrior': 'Common',
      'Monthly Maestro': 'Uncommon',
      'Century Club': 'Rare',
      'Social Butterfly': 'Rare',
      'Perfect Month': 'Epic',
      '365 Elite': 'Legendary',
      'First Streak': 'Common'
    };
    return rarityMap[achievement.name] || 'Common';
  };

  const rarity = getRarity();
  const rarityColors = {
    Common: '#6b7280',
    Uncommon: '#22c55e',
    Rare: '#3b82f6',
    Epic: '#8b5cf6',
    Legendary: '#fbbf24'
  };

  return (
    <div 
      ref={badgeRef}
      className={`achievement-badge ${type} ${isRevealing ? 'revealing' : ''} ${isHovering ? 'hovering' : ''} ${interactive ? 'interactive' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        '--badge-color': config.color,
        '--badge-gradient': config.gradient,
        '--glow-intensity': `${glowIntensity}%`,
        '--rarity-color': rarityColors[rarity]
      }}
    >
      {/* Background Effects */}
      <div className="badge-background">
        <div className="bg-pattern"></div>
        <div className="bg-glow"></div>
      </div>

      {/* Particles */}
      <div className="particle-container">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="badge-particle"
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

      {/* Shine Effect */}
      <div ref={shineRef} className="badge-shine"></div>

      {/* Badge Content */}
      <div className="badge-content">
        {/* Outer Ring */}
        <div className="badge-ring outer">
          <div className="ring-decoration"></div>
        </div>

        {/* Main Badge */}
        <div className="badge-main">
          {/* Icon Container */}
          <div className="icon-container">
            <div className="icon-backdrop">
              <div className="icon-backdrop-inner"></div>
            </div>
            <span className="badge-icon">{achievement.icon || config.icon}</span>
            <div className="icon-glow"></div>
          </div>

          {/* Achievement Info */}
          <div className="achievement-info">
            <h3 className="achievement-name">{achievement.name}</h3>
            <div className="achievement-desc">{achievement.description || 'Earned through dedication'}</div>
            
            <div className="achievement-meta">
              <div className="meta-item">
                <span className="meta-icon">📅</span>
                <span className="meta-text">
                  {new Date(achievement.earnedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="meta-item">
                <span className="meta-icon">🏷️</span>
                <span className="meta-text rarity" style={{ color: rarityColors[rarity] }}>
                  {rarity}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Inner Ring */}
        <div className="badge-ring inner">
          <div className="ring-pattern"></div>
        </div>

        {/* Achievement Stats */}
        <div className="achievement-stats">
          <div className="stat-item">
            <div className="stat-value">#{achievement.rank || 'N/A'}</div>
            <div className="stat-label">Global Rank</div>
          </div>
          
          <div className="stat-divider"></div>
          
          <div className="stat-item">
            <div className="stat-value">{achievement.percentage || '0.1'}%</div>
            <div className="stat-label">Of Users</div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="xp-bar-container">
          <div className="xp-label">Achievement XP</div>
          <div className="xp-bar">
            <div 
              className="xp-fill" 
              style={{ width: `${achievement.xp || 100}%` }}
            ></div>
            <div className="xp-glow"></div>
          </div>
          <div className="xp-value">+{achievement.xpValue || 250} XP</div>
        </div>
      </div>

      {/* Hover Effect */}
      {interactive && (
        <div className="hover-effect">
          <div className="hover-glow"></div>
          <div className="hover-rings">
            <div className="hover-ring ring-1"></div>
            <div className="hover-ring ring-2"></div>
            <div className="hover-ring ring-3"></div>
          </div>
        </div>
      )}

      {/* Celebration Effect */}
      <div className="celebration-effect"></div>

      {/* Tooltip */}
      {isHovering && interactive && (
        <div className="badge-tooltip">
          <div className="tooltip-content">
            <div className="tooltip-header">
              <div className="tooltip-icon">{achievement.icon || config.icon}</div>
              <div className="tooltip-title">{achievement.name}</div>
            </div>
            <div className="tooltip-body">
              <p>{achievement.description || 'An achievement earned through dedication and consistency.'}</p>
              
              <div className="tooltip-stats">
                <div className="tooltip-stat">
                  <span className="stat-icon">👥</span>
                  <span className="stat-text">
                    {achievement.percentage || '0.1'}% of users have this
                  </span>
                </div>
                <div className="tooltip-stat">
                  <span className="stat-icon">⭐</span>
                  <span className="stat-text">
                    {rarity} Rarity
                  </span>
                </div>
              </div>
            </div>
            <div className="tooltip-footer">
              <button className="tooltip-btn share">
                <span className="btn-icon">📤</span>
                Share
              </button>
              <button className="tooltip-btn details">
                <span className="btn-icon">🔍</span>
                Details
              </button>
            </div>
          </div>
          <div className="tooltip-arrow"></div>
        </div>
      )}

      {/* Canvas for advanced effects */}
      <canvas ref={canvasRef} className="badge-canvas"></canvas>
    </div>
  );
};

// Achievement Grid Component for displaying multiple badges
export const AchievementGrid = ({ achievements, user }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');

  const filters = [
    { id: 'all', label: 'All Achievements', icon: '🏆' },
    { id: 'streak', label: 'Streak', icon: '🔥' },
    { id: 'social', label: 'Social', icon: '🦋' },
    { id: 'challenge', label: 'Challenges', icon: '⚔️' },
    { id: 'elite', label: 'Elite', icon: '👑' }
  ];

  const sortOptions = [
    { id: 'date', label: 'Most Recent', icon: '📅' },
    { id: 'rarity', label: 'Rarity', icon: '⭐' },
    { id: 'name', label: 'Name', icon: '🔤' },
    { id: 'xp', label: 'XP Value', icon: '⚡' }
  ];

  const filteredAchievements = achievements.filter(achievement => {
    if (filter !== 'all') {
      const name = achievement.name.toLowerCase();
      if (filter === 'streak' && !name.includes('streak')) return false;
      if (filter === 'social' && !name.includes('social') && !name.includes('share')) return false;
      if (filter === 'challenge' && !name.includes('challenge') && !name.includes('duel')) return false;
      if (filter === 'elite' && !name.includes('elite') && !name.includes('premium')) return false;
    }

    if (searchTerm) {
      return achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             achievement.description?.toLowerCase().includes(searchTerm.toLowerCase());
    }

    return true;
  });

  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.earnedAt) - new Date(a.earnedAt);
      case 'rarity':
        const rarityOrder = { Legendary: 5, Epic: 4, Rare: 3, Uncommon: 2, Common: 1 };
        return (rarityOrder[getRarity(b.name)] || 0) - (rarityOrder[getRarity(a.name)] || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'xp':
        return (b.xpValue || 0) - (a.xpValue || 0);
      default:
        return 0;
    }
  });

  const getRarity = (name) => {
    const rarityMap = {
      'Weekly Warrior': 'Common',
      'Monthly Maestro': 'Uncommon',
      'Century Club': 'Rare',
      'Social Butterfly': 'Rare',
      'Perfect Month': 'Epic',
      '365 Elite': 'Legendary'
    };
    return rarityMap[name] || 'Common';
  };

  const stats = {
    total: achievements.length,
    unlocked: achievements.length,
    totalXP: achievements.reduce((sum, a) => sum + (a.xpValue || 0), 0),
    rarest: achievements.reduce((rarest, a) => {
      const currentRarity = getRarity(a.name);
      const rarestOrder = { Legendary: 5, Epic: 4, Rare: 3, Uncommon: 2, Common: 1 };
      return rarestOrder[currentRarity] > rarestOrder[rarest.name] ? a : rarest;
    }, achievements[0] || {})
  };

  return (
    <div className="achievement-grid-container">
      {/* Header */}
      <div className="grid-header">
        <div className="header-content">
          <div className="header-icon">🏆</div>
          <div>
            <h2 className="header-title">Achievement Hall</h2>
            <p className="header-subtitle">Showcase your discipline and dedication</p>
          </div>
        </div>
        
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Achievements</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.unlocked}</div>
            <div className="stat-label">Unlocked</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalXP}</div>
            <div className="stat-label">Total XP</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search achievements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filters">
          {filters.map(filterOption => (
            <button
              key={filterOption.id}
              className={`filter-btn ${filter === filterOption.id ? 'active' : ''}`}
              onClick={() => setFilter(filterOption.id)}
            >
              <span className="filter-icon">{filterOption.icon}</span>
              {filterOption.label}
            </button>
          ))}
        </div>

        <div className="sorting">
          <span className="sort-label">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            {sortOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="achievement-grid">
        {sortedAchievements.length > 0 ? (
          sortedAchievements.map((achievement, index) => (
            <div key={achievement.id} className="grid-item">
              <AchievementBadge
                achievement={achievement}
                user={user}
                interactive={true}
              />
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🏆</div>
            <h3 className="empty-title">No achievements found</h3>
            <p className="empty-desc">
              {filter !== 'all' 
                ? `No ${filter} achievements yet. Keep going!`
                : 'Start your journey to earn achievements'}
            </p>
            <button className="empty-cta">
              <span className="cta-icon">🎯</span>
              View Achievements Guide
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="grid-footer">
        <div className="progress-summary">
          <div className="progress-bar-total">
            <div 
              className="progress-fill-total"
              style={{ width: `${(stats.unlocked / 50) * 100}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {stats.unlocked} of 50 achievements unlocked
          </div>
        </div>
        
        <div className="view-options">
          <button className="view-btn active">
            <span className="view-icon">🖼️</span>
            Grid View
          </button>
          <button className="view-btn">
            <span className="view-icon">📋</span>
            List View
          </button>
          <button className="view-btn export">
            <span className="view-icon">📤</span>
            Export Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementBadge;