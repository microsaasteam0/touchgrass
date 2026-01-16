import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Model';
import Toast from '../components/ui/Toast';
import Confetti from '../components/ui/Confetti';
import Tooltip from '../components/ui/Tooltip';

/**
 * Premium Challenges Page
 * Elite challenge system with advanced features
 */
const Challenges = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const mockChallenges = [
    {
      id: 1,
      title: "30-Day Streak Marathon",
      description: "Maintain a perfect streak for 30 days. Winner gets premium features for 6 months.",
      participants: 1248,
      stake: 49.99,
      duration: 30,
      prizePool: 32450,
      status: 'active',
      progress: 65,
      endDate: '2024-02-15',
      type: 'streak',
      difficulty: 'hard',
      createdBy: 'Elite User',
      tags: ['premium', 'competitive', 'high-stakes'],
    },
    {
      id: 2,
      title: "Weekly Warrior",
      description: "Perfect 7-day streak challenge. Perfect for beginners!",
      participants: 5421,
      stake: 4.99,
      duration: 7,
      prizePool: 12540,
      status: 'active',
      progress: 42,
      endDate: '2024-01-28',
      type: 'streak',
      difficulty: 'easy',
      createdBy: 'Community Leader',
      tags: ['beginner', 'weekly', 'social'],
    },
    {
      id: 3,
      title: "Corporate Wellness Challenge",
      description: "Company-wide wellness initiative. Team-based competition.",
      participants: 248,
      stake: 0,
      duration: 21,
      prizePool: 5000,
      status: 'upcoming',
      progress: 0,
      endDate: '2024-02-01',
      type: 'team',
      difficulty: 'medium',
      createdBy: 'Google Wellness',
      tags: ['corporate', 'team', 'sponsored'],
    },
    {
      id: 4,
      title: "100-Day Legend Challenge",
      description: "The ultimate test of discipline. Only for the committed.",
      participants: 84,
      stake: 199.99,
      duration: 100,
      prizePool: 84200,
      status: 'active',
      progress: 12,
      endDate: '2024-04-15',
      type: 'streak',
      difficulty: 'extreme',
      createdBy: 'Streak Master',
      tags: ['legend', 'prestige', 'exclusive'],
    },
    {
      id: 5,
      title: "Weekend Warrior Sprint",
      description: "2-day intensive challenge. Perfect for busy professionals.",
      participants: 3120,
      stake: 2.99,
      duration: 2,
      prizePool: 6240,
      status: 'completed',
      progress: 100,
      endDate: '2024-01-21',
      type: 'sprint',
      difficulty: 'easy',
      createdBy: 'Weekend Warrior',
      tags: ['weekend', 'sprint', 'quick'],
      winner: 'JohnDoe123',
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setChallenges(mockChallenges);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleJoinChallenge = (challengeId) => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    
    // Navigate to challenge details
    navigate(`/challenge/${challengeId}`);
  };

  const handleCreateChallenge = (challengeData) => {
    // Create challenge logic
    setShowCreateModal(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const filteredChallenges = challenges.filter(challenge => 
    activeTab === 'all' ? true : challenge.status === activeTab
  );

  const stats = {
    totalChallenges: challenges.length,
    activeParticipants: challenges.reduce((sum, c) => sum + c.participants, 0),
    totalPrizePool: challenges.reduce((sum, c) => sum + c.prizePool, 0),
    successRate: 87,
  };

  const styles = `
    .challenges-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 20px;
      position: relative;
      overflow-x: hidden;
    }
    
    .challenges-container {
      max-width: 1400px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }
    
    .challenges-header {
      margin-bottom: 40px;
      text-align: center;
    }
    
    .challenges-title {
      font-size: 48px;
      font-weight: 800;
      background: linear-gradient(135deg, #22c55e 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 16px;
      letter-spacing: -0.02em;
    }
    
    .challenges-subtitle {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.7);
      max-width: 600px;
      margin: 0 auto 32px;
      line-height: 1.6;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .stat-card {
      padding: 24px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      text-align: center;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .stat-card:hover {
      background: rgba(255, 255, 255, 0.05);
      transform: translateY(-4px);
      border-color: rgba(255, 255, 255, 0.2);
    }
    
    .stat-value {
      font-size: 36px;
      font-weight: 700;
      color: #22c55e;
      margin-bottom: 8px;
      line-height: 1;
    }
    
    .stat-value.premium {
      color: #fbbf24;
    }
    
    .stat-label {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .stat-icon {
      position: absolute;
      top: 16px;
      right: 16px;
      opacity: 0.1;
      font-size: 32px;
    }
    
    .challenges-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .challenges-tabs {
      display: flex;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 4px;
    }
    
    .challenges-tab {
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.3s ease;
      position: relative;
      white-space: nowrap;
    }
    
    .challenges-tab.active {
      color: white;
      background: rgba(34, 197, 94, 0.2);
    }
    
    .challenges-tab .tab-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #ef4444;
      color: white;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 10px;
      min-width: 20px;
      text-align: center;
    }
    
    .challenges-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 24px;
      margin-bottom: 60px;
    }
    
    .challenge-card {
      height: 100%;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .challenge-card:hover {
      transform: translateY(-8px);
    }
    
    .challenge-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    
    .challenge-title {
      font-size: 20px;
      font-weight: 700;
      color: white;
      margin: 0;
      line-height: 1.3;
      flex: 1;
    }
    
    .challenge-status {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .status-active {
      background: rgba(34, 197, 94, 0.2);
      color: #22c55e;
    }
    
    .status-upcoming {
      background: rgba(59, 130, 246, 0.2);
      color: #3b82f6;
    }
    
    .status-completed {
      background: rgba(168, 85, 247, 0.2);
      color: #a855f7;
    }
    
    .challenge-description {
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 20px;
      flex: 1;
    }
    
    .challenge-meta {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .meta-icon {
      width: 20px;
      height: 20px;
      opacity: 0.6;
    }
    
    .meta-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .meta-value {
      font-size: 16px;
      font-weight: 600;
      color: white;
      margin-top: 2px;
    }
    
    .challenge-progress {
      margin-bottom: 20px;
    }
    
    .progress-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    
    .progress-label {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }
    
    .progress-value {
      font-size: 14px;
      font-weight: 600;
      color: #22c55e;
    }
    
    .progress-bar {
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
      position: relative;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #22c55e, #3b82f6);
      border-radius: 4px;
      width: var(--progress);
      transition: width 1s ease;
      position: relative;
    }
    
    .progress-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: progressShine 2s linear infinite;
    }
    
    .challenge-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 20px;
    }
    
    .challenge-tag {
      padding: 4px 10px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
    }
    
    .challenge-tag.premium {
      background: rgba(251, 191, 36, 0.1);
      border-color: rgba(251, 191, 36, 0.2);
      color: #fbbf24;
    }
    
    .challenge-actions {
      display: flex;
      gap: 12px;
    }
    
    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 20px;
    }
    
    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
      opacity: 0.3;
    }
    
    .empty-title {
      font-size: 24px;
      font-weight: 600;
      color: white;
      margin-bottom: 12px;
    }
    
    .empty-description {
      color: rgba(255, 255, 255, 0.6);
      max-width: 400px;
      margin: 0 auto 24px;
    }
    
    .loading-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 20px;
    }
    
    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: #22c55e;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    
    .featured-challenges {
      margin-top: 60px;
    }
    
    .featured-title {
      font-size: 32px;
      font-weight: 700;
      color: white;
      margin-bottom: 32px;
      text-align: center;
    }
    
    .difficulty-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .difficulty-easy {
      background: rgba(34, 197, 94, 0.2);
      color: #22c55e;
    }
    
    .difficulty-medium {
      background: rgba(59, 130, 246, 0.2);
      color: #3b82f6;
    }
    
    .difficulty-hard {
      background: rgba(245, 158, 11, 0.2);
      color: #f59e0b;
    }
    
    .difficulty-extreme {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }
    
    @keyframes progressShine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @keyframes cardEntrance {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .challenge-card {
      animation: cardEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      animation-fill-mode: both;
    }
    
    .challenge-card:nth-child(1) { animation-delay: 0.1s; }
    .challenge-card:nth-child(2) { animation-delay: 0.2s; }
    .challenge-card:nth-child(3) { animation-delay: 0.3s; }
    .challenge-card:nth-child(4) { animation-delay: 0.4s; }
    .challenge-card:nth-child(5) { animation-delay: 0.5s; }
    
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .challenges-grid {
        grid-template-columns: 1fr;
      }
      
      .challenges-actions {
        flex-direction: column;
        align-items: stretch;
      }
      
      .challenges-tabs {
        overflow-x: auto;
        justify-content: flex-start;
      }
      
      .challenges-title {
        font-size: 36px;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      
      <div className="challenges-page">
        {showConfetti && <Confetti active={true} duration={3000} />}
        
        <div className="challenges-container">
          <div className="challenges-header">
            <h1 className="challenges-title">Premium Challenges</h1>
            <p className="challenges-subtitle">
              Compete in elite challenges, win substantial prizes, and prove your discipline.
              Join thousands in the ultimate accountability competition.
            </p>
          </div>
          
          <div className="stats-grid">
            <Card className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-value">{stats.totalChallenges}</div>
              <div className="stat-label">Active Challenges</div>
            </Card>
            
            <Card className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-value">{stats.activeParticipants.toLocaleString()}</div>
              <div className="stat-label">Competitors</div>
            </Card>
            
            <Card className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-value premium">${stats.totalPrizePool.toLocaleString()}</div>
              <div className="stat-label">Total Prize Pool</div>
            </Card>
            
            <Card className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-value">{stats.successRate}%</div>
              <div className="stat-label">Success Rate</div>
            </Card>
          </div>
          
          <div className="challenges-actions">
            <div className="challenges-tabs">
              <div 
                className={`challenges-tab ${activeTab === 'active' ? 'active' : ''}`}
                onClick={() => setActiveTab('active')}
              >
                Active Challenges
                <span className="tab-badge">3</span>
              </div>
              <div 
                className={`challenges-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming
              </div>
              <div 
                className={`challenges-tab ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={() => setActiveTab('completed')}
              >
                Completed
              </div>
              <div 
                className={`challenges-tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Challenges
              </div>
            </div>
            
            <Button
              variant="premium"
              size="large"
              leftIcon={
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
              onClick={() => setShowCreateModal(true)}
            >
              Create Challenge
            </Button>
          </div>
          
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Loading elite challenges...</p>
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏁</div>
              <h3 className="empty-title">No Challenges Found</h3>
              <p className="empty-description">
                There are no {activeTab} challenges at the moment. Check back soon or create your own!
              </p>
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
              >
                Create First Challenge
              </Button>
            </div>
          ) : (
            <div className="challenges-grid">
              {filteredChallenges.map((challenge) => (
                <Card
                  key={challenge.id}
                  className="challenge-card"
                  variant={challenge.difficulty === 'extreme' ? 'premium' : 'default'}
                  hoverEffect="lift"
                  glow={challenge.difficulty === 'extreme'}
                >
                  <div className="challenge-header">
                    <h3 className="challenge-title">{challenge.title}</h3>
                    <div className={`challenge-status status-${challenge.status}`}>
                      {challenge.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <p className="challenge-description">{challenge.description}</p>
                  
                  <div className="challenge-tags">
                    <span className={`challenge-tag ${challenge.tags.includes('premium') ? 'premium' : ''}`}>
                      {challenge.type.toUpperCase()}
                    </span>
                    <span className={`difficulty-badge difficulty-${challenge.difficulty}`}>
                      {challenge.difficulty}
                    </span>
                    {challenge.tags.map((tag, index) => (
                      <span key={index} className="challenge-tag">{tag}</span>
                    ))}
                  </div>
                  
                  <div className="challenge-meta">
                    <div className="meta-item">
                      <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div className="meta-label">Duration</div>
                        <div className="meta-value">{challenge.duration} days</div>
                      </div>
                    </div>
                    
                    <div className="meta-item">
                      <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <div>
                        <div className="meta-label">Participants</div>
                        <div className="meta-value">{challenge.participants.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="meta-item">
                      <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div className="meta-label">Entry Stake</div>
                        <div className="meta-value">
                          {challenge.stake > 0 ? `$${challenge.stake}` : 'FREE'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="meta-item">
                      <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <div>
                        <div className="meta-label">Prize Pool</div>
                        <div className="meta-value">${challenge.prizePool.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  
                  {challenge.status === 'active' && (
                    <div className="challenge-progress">
                      <div className="progress-header">
                        <span className="progress-label">Challenge Progress</span>
                        <span className="progress-value">{challenge.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ '--progress': `${challenge.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="challenge-actions">
                    <Button
                      variant={challenge.difficulty === 'extreme' ? 'premium' : 'primary'}
                      size="medium"
                      fullWidth={true}
                      onClick={() => handleJoinChallenge(challenge.id)}
                    >
                      {challenge.status === 'completed' ? 'View Results' : 'Join Challenge'}
                    </Button>
                    
                    <Tooltip content="View challenge details and leaderboard">
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedChallenge(challenge)}
                      >
                        Details
                      </Button>
                    </Tooltip>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          <div className="featured-challenges">
            <h2 className="featured-title">🏆 Featured Corporate Challenges</h2>
            <div className="challenges-grid">
              <Card variant="premium" glow={true}>
                <div className="challenge-header">
                  <h3 className="challenge-title">Google Wellness Sprint</h3>
                  <div className="challenge-status status-active">Sponsored</div>
                </div>
                <p className="challenge-description">
                  Exclusive challenge for Google employees. 21-day wellness program with company rewards.
                </p>
                <div className="challenge-meta">
                  <div className="meta-item">
                    <div className="meta-value">$25,000</div>
                    <div className="meta-label">Company Pool</div>
                  </div>
                  <div className="meta-item">
                    <div className="meta-value">Google</div>
                    <div className="meta-label">Sponsor</div>
                  </div>
                </div>
                <Button variant="premium" fullWidth={true}>
                  Apply for Access
                </Button>
              </Card>
              
              <Card variant="premium" glow={true}>
                <div className="challenge-header">
                  <h3 className="challenge-title">Startup Founder Marathon</h3>
                  <div className="challenge-status status-upcoming">VC-Backed</div>
                </div>
                <p className="challenge-description">
                  Y Combinator W24 cohort challenge. Network with top founders while building discipline.
                </p>
                <div className="challenge-meta">
                  <div className="meta-item">
                    <div className="meta-value">$50,000</div>
                    <div className="meta-label">Investment Pool</div>
                  </div>
                  <div className="meta-item">
                    <div className="meta-value">YC W24</div>
                    <div className="meta-label">Cohort</div>
                  </div>
                </div>
                <Button variant="premium" fullWidth={true}>
                  Join Waitlist
                </Button>
              </Card>
            </div>
          </div>
        </div>
        
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create Elite Challenge"
          size="large"
          animationType="scale"
        >
          <div style={{ padding: '24px' }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '24px' }}>
              Design your own challenge and invite others to compete. Set stakes, duration, and prizes.
            </p>
            
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '500' }}>
                  Challenge Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., 30-Day Discipline Marathon"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '15px',
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '500' }}>
                  Description
                </label>
                <textarea
                  placeholder="Describe your challenge, rules, and prizes..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '15px',
                    resize: 'vertical',
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '500' }}>
                    Duration (Days)
                  </label>
                  <select
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '15px',
                    }}
                  >
                    <option value="7">7 Days</option>
                    <option value="14">14 Days</option>
                    <option value="21">21 Days</option>
                    <option value="30">30 Days</option>
                    <option value="60">60 Days</option>
                    <option value="100">100 Days</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '500' }}>
                    Entry Stake ($)
                  </label>
                  <input
                    type="number"
                    placeholder="0 for free"
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '15px',
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '500' }}>
                  Prize Distribution
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    defaultValue="70"
                    style={{ flex: 1 }}
                  />
                  <span style={{ color: '#22c55e', fontWeight: '600' }}>70% to Winner</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <Button
                  variant="ghost"
                  onClick={() => setShowCreateModal(false)}
                  fullWidth={true}
                >
                  Cancel
                </Button>
                <Button
                  variant="premium"
                  onClick={handleCreateChallenge}
                  fullWidth={true}
                >
                  Create Challenge ($49.99)
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Challenges;