import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Confetti from '../components/ui/Confetti';

/**
 * Premium Shame Wall Page
 * Business-minded public accountability system with advanced interactions
 */
const ShameWall = () => {
  const navigate = useNavigate();
  const [shamePosts, setShamePosts] = useState([]);
  const [filter, setFilter] = useState('recent');
  const [isLoading, setIsLoading] = useState(true);
  const [showRedemption, setShowRedemption] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const shameWallRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    fetchShamePosts();
    createShameParticles();
    return () => {
      particlesRef.current.forEach(p => clearInterval(p.interval));
    };
  }, []);

  const fetchShamePosts = async () => {
    setIsLoading(true);
    // Simulate API call with realistic shame posts
    setTimeout(() => {
      const posts = [
        {
          id: 1,
          user: {
            id: 'user_1',
            name: 'DigitalZombie42',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Digital',
            streak: 0,
            rank: 1250
          },
          message: "I spent 14 hours straight coding and forgot what sunlight feels like. My chair has molded to my shape.",
          shameLevel: 'high',
          likes: 42,
          comments: 8,
          timeAgo: '2 hours ago',
          verified: false,
          redemption: null
        },
        {
          id: 2,
          user: {
            id: 'user_2',
            name: 'ScreenAddict',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Screen',
            streak: 1,
            rank: 980
          },
          message: "Missed my streak because I binged an entire season. My plants are judging me.",
          shameLevel: 'medium',
          likes: 28,
          comments: 3,
          timeAgo: '5 hours ago',
          verified: true,
          redemption: 'Redeemed with 5km run'
        },
        {
          id: 3,
          user: {
            id: 'user_3',
            name: 'ChairWarmer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chair',
            streak: 0,
            rank: 1560
          },
          message: "My step count was 347 today. My phone thought I was dead.",
          shameLevel: 'extreme',
          likes: 156,
          comments: 24,
          timeAgo: '1 day ago',
          verified: false,
          redemption: null
        },
        {
          id: 4,
          user: {
            id: 'user_4',
            name: 'VitaminDDeficient',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vitamin',
            streak: 3,
            rank: 720
          },
          message: "Touched grass through the window. Does that count? Apparently not.",
          shameLevel: 'low',
          likes: 19,
          comments: 2,
          timeAgo: '2 days ago',
          verified: true,
          redemption: 'Redeemed with sunrise hike'
        },
        {
          id: 5,
          user: {
            id: 'user_5',
            name: 'NightCrawler',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Night',
            streak: 0,
            rank: 890
          },
          message: "My sleep schedule is so reversed, I see more moon than sun. The stars are my only friends.",
          shameLevel: 'high',
          likes: 67,
          comments: 12,
          timeAgo: '3 days ago',
          verified: false,
          redemption: null
        },
        {
          id: 6,
          user: {
            id: 'user_6',
            name: 'CaffeineOverlord',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Caffeine',
            streak: 45,
            rank: 150
          },
          message: "Broke my 100-day streak because I prioritized deadlines over daylight. The guilt is real.",
          shameLevel: 'medium',
          likes: 89,
          comments: 18,
          timeAgo: '1 week ago',
          verified: true,
          redemption: 'Redeemed with 7-day challenge'
        }
      ];
      setShamePosts(posts);
      setIsLoading(false);
    }, 1500);
  };

  const createShameParticles = () => {
    const container = shameWallRef.current;
    if (!container) return;

    // Create falling shame particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'shame-particle';
      
      const emojis = ['😔', '😞', '😟', '😩', '😫', '😭', '😤', '😓'];
      particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      
      const size = 16 + Math.random() * 24;
      const left = Math.random() * 100;
      const duration = 5 + Math.random() * 10;
      const delay = Math.random() * 5;
      
      particle.style.fontSize = `${size}px`;
      particle.style.left = `${left}%`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.opacity = 0.3 + Math.random() * 0.4;
      
      container.appendChild(particle);
      
      // Add interval to reset position
      const interval = setInterval(() => {
        const newLeft = Math.random() * 100;
        particle.style.left = `${newLeft}%`;
      }, duration * 1000);
      
      particlesRef.current.push({ element: particle, interval });
    }
  };

  const handleLike = (postId) => {
    setShamePosts(posts =>
      posts.map(post =>
        post.id === postId
          ? { ...post, likes: post.likes + 1, liked: true }
          : post
      )
    );
  };

  const handleRedeem = (postId) => {
    setSelectedPost(shamePosts.find(p => p.id === postId));
    setShowRedemption(true);
  };

  const shameLevelColors = {
    low: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', text: '#f59e0b' },
    medium: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#ef4444' },
    high: { bg: 'rgba(220, 38, 38, 0.1)', border: 'rgba(220, 38, 38, 0.3)', text: '#dc2626' },
    extreme: { bg: 'rgba(185, 28, 28, 0.1)', border: 'rgba(185, 28, 28, 0.3)', text: '#b91c1c' }
  };

  const pageStyles = `
    .shame-wall-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1a1a2e 100%);
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    .shame-wall-background {
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(circle at 10% 20%, rgba(239, 68, 68, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 90% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%);
      animation: shameBackgroundPulse 10s ease-in-out infinite;
    }

    .shame-wall-content {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      margin: 0 auto;
    }

    .shame-wall-header {
      text-align: center;
      margin-bottom: 3rem;
      animation: shameHeaderFloat 0.8s ease-out;
    }

    .shame-wall-title {
      font-size: 4rem;
      font-weight: 900;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 0 1rem 0;
      letter-spacing: -0.02em;
      position: relative;
      display: inline-block;
    }

    .shame-wall-title::after {
      content: 'Public Accountability Wall';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shameTitleShine 3s ease-in-out infinite;
    }

    .shame-wall-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.7);
      margin: 0 0 2rem 0;
      line-height: 1.6;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .stats-banner {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
      animation: fadeInUp 0.6s ease-out 0.2s both;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 1.5rem;
      text-align: center;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-4px);
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
      margin: 0;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
      margin: 0.5rem 0 0 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .filters-container {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      animation: fadeInUp 0.6s ease-out 0.4s both;
    }

    .filter-button {
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .filter-button:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .filter-button.active {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%);
      border-color: rgba(239, 68, 68, 0.3);
      color: white;
    }

    .shame-posts-grid {
      display: grid;
      gap: 2rem;
      margin-bottom: 3rem;
      animation: fadeInUp 0.6s ease-out 0.6s both;
    }

    .shame-post {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      overflow: hidden;
      transition: all 0.3s ease;
      position: relative;
    }

    .shame-post:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-4px);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .shame-post-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem 1.5rem 1rem;
    }

    .post-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.1);
      object-fit: cover;
    }

    .user-info {
      flex: 1;
    }

    .user-name {
      font-size: 1rem;
      font-weight: 600;
      color: white;
      margin: 0 0 0.25rem 0;
    }

    .user-stats {
      display: flex;
      gap: 0.75rem;
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
    }

    .shame-level {
      padding: 0.375rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .shame-post-content {
      padding: 0 1.5rem 1.5rem;
    }

    .shame-message {
      font-size: 1.125rem;
      color: rgba(255, 255, 255, 0.9);
      margin: 0 0 1.5rem 0;
      line-height: 1.6;
      font-style: italic;
      position: relative;
      padding-left: 1.5rem;
    }

    .shame-message::before {
      content: '"';
      position: absolute;
      left: 0;
      top: -0.5rem;
      font-size: 3rem;
      color: rgba(239, 68, 68, 0.3);
      font-family: serif;
    }

    .shame-post-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      background: rgba(0, 0, 0, 0.2);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .post-actions {
      display: flex;
      gap: 1rem;
    }

    .action-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-button:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .action-button.liked {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.3);
      color: #ef4444;
    }

    .post-time {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
    }

    .redemption-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(21, 128, 61, 0.2) 100%);
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 8px;
      color: #22c55e;
      font-size: 0.875rem;
      font-weight: 500;
      margin-top: 1rem;
      animation: redemptionPulse 2s ease-in-out infinite;
    }

    .shame-particle {
      position: absolute;
      pointer-events: none;
      z-index: 1;
      animation: shameFall linear infinite;
    }

    .loading-skeleton {
      background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 8px;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(255, 255, 255, 0.05);
      border: 2px dashed rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      margin: 2rem 0;
    }

    .empty-state-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      animation: emptyStateFloat 3s ease-in-out infinite;
    }

    .empty-state-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
      margin: 0 0 0.5rem 0;
    }

    .empty-state-description {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.6);
      margin: 0 0 2rem 0;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .call-to-action {
      text-align: center;
      margin-top: 4rem;
      padding: 3rem;
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(21, 128, 61, 0.1) 100%);
      border: 1px solid rgba(34, 197, 94, 0.2);
      border-radius: 20px;
      animation: ctaPulse 3s ease-in-out infinite;
    }

    .cta-title {
      font-size: 2rem;
      font-weight: 700;
      color: white;
      margin: 0 0 1rem 0;
    }

    .cta-description {
      font-size: 1.125rem;
      color: rgba(255, 255, 255, 0.8);
      margin: 0 0 2rem 0;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    @keyframes shameBackgroundPulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 0.8; }
    }

    @keyframes shameHeaderFloat {
      0% {
        opacity: 0;
        transform: translateY(-30px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes shameTitleShine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
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

    @keyframes shameFall {
      0% {
        transform: translateY(-100px) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @keyframes redemptionPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    @keyframes emptyStateFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }

    @keyframes ctaPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.01); }
    }

    .verified-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      background: rgba(34, 197, 94, 0.2);
      color: #22c55e;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      margin-left: 0.5rem;
    }

    .shame-post::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.02) 50%, transparent 70%);
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    .shame-post:hover::before {
      opacity: 1;
    }

    @media (max-width: 768px) {
      .shame-wall-container {
        padding: 1rem;
      }
      
      .shame-wall-title {
        font-size: 2.5rem;
      }
      
      .shame-wall-subtitle {
        font-size: 1rem;
      }
      
      .stats-banner {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .shame-post-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      
      .shame-post-footer {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }
      
      .cta-buttons {
        flex-direction: column;
      }
      
      .cta-buttons button {
        width: 100%;
      }
    }
  `;

  const filters = [
    { id: 'recent', label: '🔥 Recent' },
    { id: 'popular', label: '⭐ Popular' },
    { id: 'extreme', label: '💀 Extreme Shame' },
    { id: 'redeemed', label: '🌱 Redeemed' },
    { id: 'unverified', label: '❓ Unverified' }
  ];

  const stats = [
    { value: '1,247', label: 'Total Shame Posts', icon: '📝' },
    { value: '89%', label: 'Redemption Rate', icon: '📈' },
    { value: '3.2k', label: 'Total Interactions', icon: '💬' },
    { value: '42', label: 'Active Right Now', icon: '👁️' }
  ];

  if (isLoading) {
    return (
      <>
        <style>{pageStyles}</style>
        <div className="shame-wall-container" ref={shameWallRef}>
          <div className="shame-wall-background" />
          <div className="shame-wall-content">
            <div className="shame-wall-header">
              <h1 className="shame-wall-title">Shame Wall</h1>
              <p className="shame-wall-subtitle">Loading public accountability posts...</p>
            </div>
            
            <div className="stats-banner">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="loading-skeleton" style={{ height: '120px', borderRadius: '16px' }} />
              ))}
            </div>
            
            <div className="filters-container">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="loading-skeleton" style={{ width: '100px', height: '40px', borderRadius: '12px' }} />
              ))}
            </div>
            
            <div className="shame-posts-grid">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="loading-skeleton" style={{ height: '300px', borderRadius: '20px' }} />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{pageStyles}</style>
      <div className="shame-wall-container" ref={shameWallRef}>
        <div className="shame-wall-background" />
        
        <div className="shame-wall-content">
          <div className="shame-wall-header">
            <h1 className="shame-wall-title">Shame Wall</h1>
            <p className="shame-wall-subtitle">
              Public accountability drives discipline. Witness the consequences of skipped days, 
              find motivation in redemption stories, and join the community of discipline seekers.
            </p>
          </div>
          
          <div className="stats-banner">
            {stats.map((stat, index) => (
              <Card key={index} className="stat-card" hoverEffect="lift">
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{stat.icon}</div>
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-label">{stat.label}</p>
              </Card>
            ))}
          </div>
          
          <div className="filters-container">
            {filters.map((filterItem) => (
              <button
                key={filterItem.id}
                className={`filter-button ${filter === filterItem.id ? 'active' : ''}`}
                onClick={() => setFilter(filterItem.id)}
              >
                {filterItem.label}
              </button>
            ))}
          </div>
          
          <div className="shame-posts-grid">
            {shamePosts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🎉</div>
                <h3 className="empty-state-title">No Shame Posts Yet</h3>
                <p className="empty-state-description">
                  Everyone is staying disciplined! Be the first to break a streak 
                  (though we don't recommend it).
                </p>
                <Button variant="primary" onClick={() => navigate('/verify')}>
                  🌱 Maintain Your Streak
                </Button>
              </div>
            ) : (
              shamePosts.map((post) => (
                <Card key={post.id} className="shame-post" hoverEffect="lift" borderGradient>
                  <div className="shame-post-header">
                    <div className="post-user">
                      <img src={post.user.avatar} alt={post.user.name} className="user-avatar" />
                      <div className="user-info">
                        <h3 className="user-name">
                          {post.user.name}
                          {post.verified && (
                            <span className="verified-badge">
                              <span>✓</span>
                              <span>Verified</span>
                            </span>
                          )}
                        </h3>
                        <div className="user-stats">
                          <span>Streak: {post.user.streak} days</span>
                          <span>Rank: #{post.user.rank}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className="shame-level"
                      style={{
                        background: shameLevelColors[post.shameLevel].bg,
                        border: `1px solid ${shameLevelColors[post.shameLevel].border}`,
                        color: shameLevelColors[post.shameLevel].text
                      }}
                    >
                      {post.shameLevel} shame
                    </div>
                  </div>
                  
                  <div className="shame-post-content">
                    <p className="shame-message">{post.message}</p>
                    
                    {post.redemption && (
                      <div className="redemption-badge">
                        <span>✅</span>
                        <span>Redeemed: {post.redemption}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="shame-post-footer">
                    <div className="post-actions">
                      <button
                        className={`action-button ${post.liked ? 'liked' : ''}`}
                        onClick={() => handleLike(post.id)}
                      >
                        <span>👍</span>
                        <span>{post.likes}</span>
                      </button>
                      
                      <button className="action-button">
                        <span>💬</span>
                        <span>{post.comments}</span>
                      </button>
                      
                      {!post.redemption && (
                        <Button
                          variant="primary"
                          size="small"
                          onClick={() => handleRedeem(post.id)}
                        >
                          🌱 Redeem
                        </Button>
                      )}
                    </div>
                    
                    <span className="post-time">{post.timeAgo}</span>
                  </div>
                </Card>
              ))
            )}
          </div>
          
          <div className="call-to-action">
            <h2 className="cta-title">Your Discipline Matters</h2>
            <p className="cta-description">
              Don't let your streak end up here. Stay accountable, stay disciplined, 
              and build habits that last a lifetime.
            </p>
            <div className="cta-buttons">
              <Button variant="primary" size="large" onClick={() => navigate('/verify')}>
                🌱 Verify Today's Streak
              </Button>
              <Button variant="secondary" size="large" onClick={() => navigate('/leaderboard')}>
                🏆 View Leaderboard
              </Button>
              <Button variant="ghost" size="large" onClick={() => navigate('/chat')}>
                💬 Join Community
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Redemption Modal */}
      <Modal
        isOpen={showRedemption}
        onClose={() => setShowRedemption(false)}
        title="🌱 Redeem This Shame"
        size="medium"
      >
        {selectedPost && (
          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            <p>Help <strong>{selectedPost.user.name}</strong> redeem their shame by suggesting an activity:</p>
            
            <div style={{ margin: '1.5rem 0' }}>
              <textarea
                placeholder="Suggest an outdoor activity, mindfulness exercise, or accountability action..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '0.875rem',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', margin: '1.5rem 0' }}>
              <button style={{
                padding: '0.75rem',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: '8px',
                color: '#22c55e',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}>
                🚶 30-min Walk
              </button>
              <button style={{
                padding: '0.75rem',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: '8px',
                color: '#22c55e',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}>
                🧘 15-min Meditation
              </button>
              <button style={{
                padding: '0.75rem',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: '8px',
                color: '#22c55e',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}>
                📚 Read Outside
              </button>
              <button style={{
                padding: '0.75rem',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: '8px',
                color: '#22c55e',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}>
                🏃 5K Run
              </button>
            </div>
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <Button variant="primary" onClick={() => {
            addToast('Redemption suggestion sent!', 'success');
            setShowRedemption(false);
          }} fullWidth>
            ✅ Send Suggestion
          </Button>
          <Button variant="secondary" onClick={() => setShowRedemption(false)} fullWidth>
            Cancel
          </Button>
        </div>
      </Modal>

      <Confetti active={false} />
    </>
  );
};

export default ShameWall;