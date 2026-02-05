// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { toast } from 'react-hot-toast';
// // import challengeService from '../services/challengeService';
import { useAuth } from '../contexts/AuthContext';
// import Button from '../components/ui/Button';
// import Card from '../components/ui/Card';
// import Modal from '../components/ui/Model';
// import Toast from '../components/ui/Toast';
// import Confetti from '../components/ui/Confetti';
// import Tooltip from '../components/ui/Tooltip';
// import LoadingSpinner from '../components/layout/LoadingSpinner';
// import SEO from '../components/seo/SEO';
// import { SEO_CONFIG } from '../config/seo';

// /**
//  * Premium Challenges Page
//  * Elite challenge system with advanced features
//  */
// const Challenges = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('active');
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [selectedChallenge, setSelectedChallenge] = useState(null);
//   const [challenges, setChallenges] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // Mock data
//   const mockChallenges = [
//     {
//       id: 1,
//       title: "30-Day Streak Marathon",
//       description: "Maintain a perfect streak for 30 days. Winner gets premium features for 6 months.",
//       participants: 1248,
//       stake: 49.99,
//       duration: 30,
//       prizePool: 32450,
//       status: 'active',
//       progress: 65,
//       endDate: '2024-02-15',
//       type: 'streak',
//       difficulty: 'hard',
//       createdBy: 'Elite User',
//       tags: ['premium', 'competitive', 'high-stakes'],
//     },
//     {
//       id: 2,
//       title: "Weekly Warrior",
//       description: "Perfect 7-day streak challenge. Perfect for beginners!",
//       participants: 5421,
//       stake: 4.99,
//       duration: 7,
//       prizePool: 12540,
//       status: 'active',
//       progress: 42,
//       endDate: '2024-01-28',
//       type: 'streak',
//       difficulty: 'easy',
//       createdBy: 'Community Leader',
//       tags: ['beginner', 'weekly', 'social'],
//     },
//     {
//       id: 3,
//       title: "Corporate Wellness Challenge",
//       description: "Company-wide wellness initiative. Team-based competition.",
//       participants: 248,
//       stake: 0,
//       duration: 21,
//       prizePool: 5000,
//       status: 'upcoming',
//       progress: 0,
//       endDate: '2024-02-01',
//       type: 'team',
//       difficulty: 'medium',
//       createdBy: 'Google Wellness',
//       tags: ['corporate', 'team', 'sponsored'],
//     },
//     {
//       id: 4,
//       title: "100-Day Legend Challenge",
//       description: "The ultimate test of discipline. Only for the committed.",
//       participants: 84,
//       stake: 199.99,
//       duration: 100,
//       prizePool: 84200,
//       status: 'active',
//       progress: 12,
//       endDate: '2024-04-15',
//       type: 'streak',
//       difficulty: 'extreme',
//       createdBy: 'Streak Master',
//       tags: ['legend', 'prestige', 'exclusive'],
//     },
//     {
//       id: 5,
//       title: "Weekend Warrior Sprint",
//       description: "2-day intensive challenge. Perfect for busy professionals.",
//       participants: 3120,
//       stake: 2.99,
//       duration: 2,
//       prizePool: 6240,
//       status: 'completed',
//       progress: 100,
//       endDate: '2024-01-21',
//       type: 'sprint',
//       difficulty: 'easy',
//       createdBy: 'Weekend Warrior',
//       tags: ['weekend', 'sprint', 'quick'],
//       winner: 'JohnDoe123',
//     },
//   ];

//   useEffect(() => {
//     setIsLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       setChallenges(mockChallenges);
//       setIsLoading(false);
//     }, 1000);
//   }, []);

//   const handleJoinChallenge = (challengeId) => {
//     setShowConfetti(true);
//     setTimeout(() => setShowConfetti(false), 3000);
    
//     // Navigate to challenge details
//     navigate(`/challenge/${challengeId}`);
//   };

//   const handleCreateChallenge = (challengeData) => {
//     // Create challenge logic
//     setShowCreateModal(false);
//     setShowConfetti(true);
//     setTimeout(() => setShowConfetti(false), 3000);
//   };

//   const filteredChallenges = challenges.filter(challenge => 
//     activeTab === 'all' ? true : challenge.status === activeTab
//   );

//   const stats = {
//     totalChallenges: challenges.length,
//     activeParticipants: challenges.reduce((sum, c) => sum + c.participants, 0),
//     totalPrizePool: challenges.reduce((sum, c) => sum + c.prizePool, 0),
//     successRate: 87,
//   };

//   const styles = `
//     .challenges-page {
//       min-height: 100vh;
//       background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
//       padding: 20px;
//       position: relative;
//       overflow-x: hidden;
//     }
    
//     .challenges-container {
//       max-width: 1400px;
//       margin: 0 auto;
//       position: relative;
//       z-index: 2;
//     }
    
//     .challenges-header {
//       margin-bottom: 40px;
//       text-align: center;
//     }
    
//     .challenges-title {
//       font-size: 48px;
//       font-weight: 800;
//       background: linear-gradient(135deg, #22c55e 0%, #3b82f6 100%);
//       -webkit-background-clip: text;
//       -webkit-text-fill-color: transparent;
//       background-clip: text;
//       margin-bottom: 16px;
//       letter-spacing: -0.02em;
//     }
    
//     .challenges-subtitle {
//       font-size: 18px;
//       color: rgba(255, 255, 255, 0.7);
//       max-width: 600px;
//       margin: 0 auto 32px;
//       line-height: 1.6;
//     }
    
//     .stats-grid {
//       display: grid;
//       grid-template-columns: repeat(4, 1fr);
//       gap: 20px;
//       margin-bottom: 40px;
//     }
    
//     .stat-card {
//       padding: 24px;
//       background: rgba(255, 255, 255, 0.03);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       border-radius: 16px;
//       text-align: center;
//       transition: all 0.3s ease;
//       position: relative;
//       overflow: hidden;
//     }
    
//     .stat-card:hover {
//       background: rgba(255, 255, 255, 0.05);
//       transform: translateY(-4px);
//       border-color: rgba(255, 255, 255, 0.2);
//     }
    
//     .stat-value {
//       font-size: 36px;
//       font-weight: 700;
//       color: #22c55e;
//       margin-bottom: 8px;
//       line-height: 1;
//     }
    
//     .stat-value.premium {
//       color: #fbbf24;
//     }
    
//     .stat-label {
//       font-size: 14px;
//       color: rgba(255, 255, 255, 0.6);
//       text-transform: uppercase;
//       letter-spacing: 0.05em;
//     }
    
//     .stat-icon {
//       position: absolute;
//       top: 16px;
//       right: 16px;
//       opacity: 0.1;
//       font-size: 32px;
//     }
    
//     .challenges-actions {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       margin-bottom: 32px;
//       flex-wrap: wrap;
//       gap: 20px;
//     }
    
//     .challenges-tabs {
//       display: flex;
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       border-radius: 12px;
//       padding: 4px;
//     }
    
//     .challenges-tab {
//       padding: 12px 24px;
//       font-size: 14px;
//       font-weight: 600;
//       color: rgba(255, 255, 255, 0.6);
//       cursor: pointer;
//       border-radius: 8px;
//       transition: all 0.3s ease;
//       position: relative;
//       white-space: nowrap;
//     }
    
//     .challenges-tab.active {
//       color: white;
//       background: rgba(34, 197, 94, 0.2);
//     }
    
//     .challenges-tab .tab-badge {
//       position: absolute;
//       top: -8px;
//       right: -8px;
//       background: #ef4444;
//       color: white;
//       font-size: 11px;
//       padding: 2px 6px;
//       border-radius: 10px;
//       min-width: 20px;
//       text-align: center;
//     }
    
//     .challenges-grid {
//       display: grid;
//       grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
//       gap: 24px;
//       margin-bottom: 60px;
//     }
    
//     .challenge-card {
//       height: 100%;
//       transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
//     }
    
//     .challenge-card:hover {
//       transform: translateY(-8px);
//     }
    
//     .challenge-header {
//       display: flex;
//       justify-content: space-between;
//       align-items: flex-start;
//       margin-bottom: 16px;
//     }
    
//     .challenge-title {
//       font-size: 20px;
//       font-weight: 700;
//       color: white;
//       margin: 0;
//       line-height: 1.3;
//       flex: 1;
//     }
    
//     .challenge-status {
//       padding: 6px 12px;
//       border-radius: 20px;
//       font-size: 12px;
//       font-weight: 600;
//       text-transform: uppercase;
//       letter-spacing: 0.05em;
//     }
    
//     .status-active {
//       background: rgba(34, 197, 94, 0.2);
//       color: #22c55e;
//     }
    
//     .status-upcoming {
//       background: rgba(59, 130, 246, 0.2);
//       color: #3b82f6;
//     }
    
//     .status-completed {
//       background: rgba(168, 85, 247, 0.2);
//       color: #a855f7;
//     }
    
//     .challenge-description {
//       color: rgba(255, 255, 255, 0.7);
//       font-size: 14px;
//       line-height: 1.5;
//       margin-bottom: 20px;
//       flex: 1;
//     }
    
//     .challenge-meta {
//       display: grid;
//       grid-template-columns: repeat(2, 1fr);
//       gap: 16px;
//       margin-bottom: 24px;
//     }
    
//     .meta-item {
//       display: flex;
//       align-items: center;
//       gap: 8px;
//     }
    
//     .meta-icon {
//       width: 20px;
//       height: 20px;
//       opacity: 0.6;
//     }
    
//     .meta-label {
//       font-size: 12px;
//       color: rgba(255, 255, 255, 0.5);
//       text-transform: uppercase;
//       letter-spacing: 0.05em;
//     }
    
//     .meta-value {
//       font-size: 16px;
//       font-weight: 600;
//       color: white;
//       margin-top: 2px;
//     }
    
//     .challenge-progress {
//       margin-bottom: 20px;
//     }
    
//     .progress-header {
//       display: flex;
//       justify-content: space-between;
//       margin-bottom: 8px;
//     }
    
//     .progress-label {
//       font-size: 14px;
//       color: rgba(255, 255, 255, 0.7);
//     }
    
//     .progress-value {
//       font-size: 14px;
//       font-weight: 600;
//       color: #22c55e;
//     }
    
//     .progress-bar {
//       height: 8px;
//       background: rgba(255, 255, 255, 0.1);
//       border-radius: 4px;
//       overflow: hidden;
//       position: relative;
//     }
    
//     .progress-fill {
//       height: 100%;
//       background: linear-gradient(90deg, #22c55e, #3b82f6);
//       border-radius: 4px;
//       width: var(--progress);
//       transition: width 1s ease;
//       position: relative;
//     }
    
//     .progress-fill::after {
//       content: '';
//       position: absolute;
//       top: 0;
//       left: 0;
//       right: 0;
//       bottom: 0;
//       background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
//       animation: progressShine 2s linear infinite;
//     }
    
//     .challenge-tags {
//       display: flex;
//       flex-wrap: wrap;
//       gap: 8px;
//       margin-bottom: 20px;
//     }
    
//     .challenge-tag {
//       padding: 4px 10px;
//       background: rgba(255, 255, 255, 0.05);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       border-radius: 12px;
//       font-size: 12px;
//       color: rgba(255, 255, 255, 0.7);
//     }
    
//     .challenge-tag.premium {
//       background: rgba(251, 191, 36, 0.1);
//       border-color: rgba(251, 191, 36, 0.2);
//       color: #fbbf24;
//     }
    
//     .challenge-actions {
//       display: flex;
//       gap: 12px;
//     }
    
//     .empty-state {
//       grid-column: 1 / -1;
//       text-align: center;
//       padding: 60px 20px;
//     }
    
//     .empty-icon {
//       font-size: 64px;
//       margin-bottom: 20px;
//       opacity: 0.3;
//     }
    
//     .empty-title {
//       font-size: 24px;
//       font-weight: 600;
//       color: white;
//       margin-bottom: 12px;
//     }
    
//     .empty-description {
//       color: rgba(255, 255, 255, 0.6);
//       max-width: 400px;
//       margin: 0 auto 24px;
//     }
    
//     .loading-state {
//       grid-column: 1 / -1;
//       text-align: center;
//       padding: 60px 20px;
//     }
    
//     .loading-spinner {
//       width: 48px;
//       height: 48px;
//       border: 3px solid rgba(255, 255, 255, 0.1);
//       border-top-color: #22c55e;
//       border-radius: 50%;
//       animation: spin 1s linear infinite;
//       margin: 0 auto 20px;
//     }
    
//     .featured-challenges {
//       margin-top: 60px;
//     }
    
//     .featured-title {
//       font-size: 32px;
//       font-weight: 700;
//       color: white;
//       margin-bottom: 32px;
//       text-align: center;
//     }
    
//     .difficulty-badge {
//       display: inline-flex;
//       align-items: center;
//       gap: 4px;
//       padding: 4px 10px;
//       border-radius: 12px;
//       font-size: 12px;
//       font-weight: 600;
//       text-transform: uppercase;
//       letter-spacing: 0.05em;
//     }
    
//     .difficulty-easy {
//       background: rgba(34, 197, 94, 0.2);
//       color: #22c55e;
//     }
    
//     .difficulty-medium {
//       background: rgba(59, 130, 246, 0.2);
//       color: #3b82f6;
//     }
    
//     .difficulty-hard {
//       background: rgba(245, 158, 11, 0.2);
//       color: #f59e0b;
//     }
    
//     .difficulty-extreme {
//       background: rgba(239, 68, 68, 0.2);
//       color: #ef4444;
//     }
    
//     @keyframes progressShine {
//       0% { transform: translateX(-100%); }
//       100% { transform: translateX(100%); }
//     }
    
//     @keyframes spin {
//       to { transform: rotate(360deg); }
//     }
    
//     @keyframes cardEntrance {
//       from {
//         opacity: 0;
//         transform: translateY(20px);
//       }
//       to {
//         opacity: 1;
//         transform: translateY(0);
//       }
//     }
    
//     .challenge-card {
//       animation: cardEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
//       animation-fill-mode: both;
//     }
    
//     .challenge-card:nth-child(1) { animation-delay: 0.1s; }
//     .challenge-card:nth-child(2) { animation-delay: 0.2s; }
//     .challenge-card:nth-child(3) { animation-delay: 0.3s; }
//     .challenge-card:nth-child(4) { animation-delay: 0.4s; }
//     .challenge-card:nth-child(5) { animation-delay: 0.5s; }
    
//     @media (max-width: 768px) {
//       .stats-grid {
//         grid-template-columns: repeat(2, 1fr);
//       }
      
//       .challenges-grid {
//         grid-template-columns: 1fr;
//       }
      
//       .challenges-actions {
//         flex-direction: column;
//         align-items: stretch;
//       }
      
//       .challenges-tabs {
//         overflow-x: auto;
//         justify-content: flex-start;
//       }
      
//       .challenges-title {
//         font-size: 36px;
//       }
//     }
//   `;

//   return (
//     <>
//       <style>{styles}</style>
      
//       <div className="challenges-page">
//         {showConfetti && <Confetti active={true} duration={3000} />}
        
//         <div className="challenges-container">
//           <div className="challenges-header">
//             <h1 className="challenges-title">Premium Challenges</h1>
//             <p className="challenges-subtitle">
//               Compete in elite challenges, win substantial prizes, and prove your discipline.
//               Join thousands in the ultimate accountability competition.
//             </p>
//           </div>
          
//           <div className="stats-grid">
//             <Card className="stat-card">
//               <div className="stat-icon">🏆</div>
//               <div className="stat-value">{stats.totalChallenges}</div>
//               <div className="stat-label">Active Challenges</div>
//             </Card>
            
//             <Card className="stat-card">
//               <div className="stat-icon">👥</div>
//               <div className="stat-value">{stats.activeParticipants.toLocaleString()}</div>
//               <div className="stat-label">Competitors</div>
//             </Card>
            
//             <Card className="stat-card">
//               <div className="stat-icon">💰</div>
//               <div className="stat-value premium">${stats.totalPrizePool.toLocaleString()}</div>
//               <div className="stat-label">Total Prize Pool</div>
//             </Card>
            
//             <Card className="stat-card">
//               <div className="stat-icon">📈</div>
//               <div className="stat-value">{stats.successRate}%</div>
//               <div className="stat-label">Success Rate</div>
//             </Card>
//           </div>
          
//           <div className="challenges-actions">
//             <div className="challenges-tabs">
//               <div 
//                 className={`challenges-tab ${activeTab === 'active' ? 'active' : ''}`}
//                 onClick={() => setActiveTab('active')}
//               >
//                 Active Challenges
//                 <span className="tab-badge">3</span>
//               </div>
//               <div 
//                 className={`challenges-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
//                 onClick={() => setActiveTab('upcoming')}
//               >
//                 Upcoming
//               </div>
//               <div 
//                 className={`challenges-tab ${activeTab === 'completed' ? 'active' : ''}`}
//                 onClick={() => setActiveTab('completed')}
//               >
//                 Completed
//               </div>
//               <div 
//                 className={`challenges-tab ${activeTab === 'all' ? 'active' : ''}`}
//                 onClick={() => setActiveTab('all')}
//               >
//                 All Challenges
//               </div>
//             </div>
            
//             <Button
//               variant="premium"
//               size="large"
//               leftIcon={
//                 <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                 </svg>
//               }
//               onClick={() => setShowCreateModal(true)}
//             >
//               Create Challenge
//             </Button>
//           </div>
          
//           {isLoading ? (
//             <div className="loading-state">
//               <div className="loading-spinner" />
//               <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Loading elite challenges...</p>
//             </div>
//           ) : filteredChallenges.length === 0 ? (
//             <div className="empty-state">
//               <div className="empty-icon">🏁</div>
//               <h3 className="empty-title">No Challenges Found</h3>
//               <p className="empty-description">
//                 There are no {activeTab} challenges at the moment. Check back soon or create your own!
//               </p>
//               <Button
//                 variant="primary"
//                 onClick={() => setShowCreateModal(true)}
//               >
//                 Create First Challenge
//               </Button>
//             </div>
//           ) : (
//             <div className="challenges-grid">
//               {filteredChallenges.map((challenge) => (
//                 <Card
//                   key={challenge.id}
//                   className="challenge-card"
//                   variant={challenge.difficulty === 'extreme' ? 'premium' : 'default'}
//                   hoverEffect="lift"
//                   glow={challenge.difficulty === 'extreme'}
//                 >
//                   <div className="challenge-header">
//                     <h3 className="challenge-title">{challenge.title}</h3>
//                     <div className={`challenge-status status-${challenge.status}`}>
//                       {challenge.status.toUpperCase()}
//                     </div>
//                   </div>
                  
//                   <p className="challenge-description">{challenge.description}</p>
                  
//                   <div className="challenge-tags">
//                     <span className={`challenge-tag ${challenge.tags.includes('premium') ? 'premium' : ''}`}>
//                       {challenge.type.toUpperCase()}
//                     </span>
//                     <span className={`difficulty-badge difficulty-${challenge.difficulty}`}>
//                       {challenge.difficulty}
//                     </span>
//                     {challenge.tags.map((tag, index) => (
//                       <span key={index} className="challenge-tag">{tag}</span>
//                     ))}
//                   </div>
                  
//                   <div className="challenge-meta">
//                     <div className="meta-item">
//                       <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       <div>
//                         <div className="meta-label">Duration</div>
//                         <div className="meta-value">{challenge.duration} days</div>
//                       </div>
//                     </div>
                    
//                     <div className="meta-item">
//                       <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                       </svg>
//                       <div>
//                         <div className="meta-label">Participants</div>
//                         <div className="meta-value">{challenge.participants.toLocaleString()}</div>
//                       </div>
//                     </div>
                    
//                     <div className="meta-item">
//                       <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       <div>
//                         <div className="meta-label">Entry Stake</div>
//                         <div className="meta-value">
//                           {challenge.stake > 0 ? `$${challenge.stake}` : 'FREE'}
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="meta-item">
//                       <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                       </svg>
//                       <div>
//                         <div className="meta-label">Prize Pool</div>
//                         <div className="meta-value">${challenge.prizePool.toLocaleString()}</div>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {challenge.status === 'active' && (
//                     <div className="challenge-progress">
//                       <div className="progress-header">
//                         <span className="progress-label">Challenge Progress</span>
//                         <span className="progress-value">{challenge.progress}%</span>
//                       </div>
//                       <div className="progress-bar">
//                         <div 
//                           className="progress-fill" 
//                           style={{ '--progress': `${challenge.progress}%` }}
//                         />
//                       </div>
//                     </div>
//                   )}
                  
//                   <div className="challenge-actions">
//                     <Button
//                       variant={challenge.difficulty === 'extreme' ? 'premium' : 'primary'}
//                       size="medium"
//                       fullWidth={true}
//                       onClick={() => handleJoinChallenge(challenge.id)}
//                     >
//                       {challenge.status === 'completed' ? 'View Results' : 'Join Challenge'}
//                     </Button>
                    
//                     <Tooltip content="View challenge details and leaderboard">
//                       <Button
//                         variant="ghost"
//                         onClick={() => setSelectedChallenge(challenge)}
//                       >
//                         Details
//                       </Button>
//                     </Tooltip>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           )}
          
//           <div className="featured-challenges">
//             <h2 className="featured-title">🏆 Featured Corporate Challenges</h2>
//             <div className="challenges-grid">
//               <Card variant="premium" glow={true}>
//                 <div className="challenge-header">
//                   <h3 className="challenge-title">Google Wellness Sprint</h3>
//                   <div className="challenge-status status-active">Sponsored</div>
//                 </div>
//                 <p className="challenge-description">
//                   Exclusive challenge for Google employees. 21-day wellness program with company rewards.
//                 </p>
//                 <div className="challenge-meta">
//                   <div className="meta-item">
//                     <div className="meta-value">$25,000</div>
//                     <div className="meta-label">Company Pool</div>
//                   </div>
//                   <div className="meta-item">
//                     <div className="meta-value">Google</div>
//                     <div className="meta-label">Sponsor</div>
//                   </div>
//                 </div>
//                 <Button variant="premium" fullWidth={true}>
//                   Apply for Access
//                 </Button>
//               </Card>
              
//               <Card variant="premium" glow={true}>
//                 <div className="challenge-header">
//                   <h3 className="challenge-title">Startup Founder Marathon</h3>
//                   <div className="challenge-status status-upcoming">VC-Backed</div>
//                 </div>
//                 <p className="challenge-description">
//                   Y Combinator W24 cohort challenge. Network with top founders while building discipline.
//                 </p>
//                 <div className="challenge-meta">
//                   <div className="meta-item">
//                     <div className="meta-value">$50,000</div>
//                     <div className="meta-label">Investment Pool</div>
//                   </div>
//                   <div className="meta-item">
//                     <div className="meta-value">YC W24</div>
//                     <div className="meta-label">Cohort</div>
//                   </div>
//                 </div>
//                 <Button variant="premium" fullWidth={true}>
//                   Join Waitlist
//                 </Button>
//               </Card>
//             </div>
//           </div>
//         </div>
        
//         <Modal
//           isOpen={showCreateModal}
//           onClose={() => setShowCreateModal(false)}
//           title="Create Elite Challenge"
//           size="large"
//           animationType="scale"
//         >
//           <div style={{ padding: '24px' }}>
//             <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '24px' }}>
//               Design your own challenge and invite others to compete. Set stakes, duration, and prizes.
//             </p>
            
//             <div style={{ display: 'grid', gap: '20px' }}>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '500' }}>
//                   Challenge Title
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="e.g., 30-Day Discipline Marathon"
//                   style={{
//                     width: '100%',
//                     padding: '12px 16px',
//                     background: 'rgba(255, 255, 255, 0.05)',
//                     border: '1px solid rgba(255, 255, 255, 0.1)',
//                     borderRadius: '8px',
//                     color: 'white',
//                     fontSize: '15px',
//                   }}
//                 />
//               </div>
              
//               <div>
//                 <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '500' }}>
//                   Description
//                 </label>
//                 <textarea
//                   placeholder="Describe your challenge, rules, and prizes..."
//                   rows={4}
//                   style={{
//                     width: '100%',
//                     padding: '12px 16px',
//                     background: 'rgba(255, 255, 255, 0.05)',
//                     border: '1px solid rgba(255, 255, 255, 0.1)',
//                     borderRadius: '8px',
//                     color: 'white',
//                     fontSize: '15px',
//                     resize: 'vertical',
//                   }}
//                 />
//               </div>
              
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
//                 <div>
//                   <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '500' }}>
//                     Duration (Days)
//                   </label>
//                   <select
//                     style={{
//                       width: '100%',
//                       padding: '12px 16px',
//                       background: 'rgba(255, 255, 255, 0.05)',
//                       border: '1px solid rgba(255, 255, 255, 0.1)',
//                       borderRadius: '8px',
//                       color: 'white',
//                       fontSize: '15px',
//                     }}
//                   >
//                     <option value="7">7 Days</option>
//                     <option value="14">14 Days</option>
//                     <option value="21">21 Days</option>
//                     <option value="30">30 Days</option>
//                     <option value="60">60 Days</option>
//                     <option value="100">100 Days</option>
//                   </select>
//                 </div>
                
//                 <div>
//                   <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '500' }}>
//                     Entry Stake ($)
//                   </label>
//                   <input
//                     type="number"
//                     placeholder="0 for free"
//                     min="0"
//                     step="0.01"
//                     style={{
//                       width: '100%',
//                       padding: '12px 16px',
//                       background: 'rgba(255, 255, 255, 0.05)',
//                       border: '1px solid rgba(255, 255, 255, 0.1)',
//                       borderRadius: '8px',
//                       color: 'white',
//                       fontSize: '15px',
//                     }}
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontWeight: '500' }}>
//                   Prize Distribution
//                 </label>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                   <input
//                     type="range"
//                     min="1"
//                     max="100"
//                     defaultValue="70"
//                     style={{ flex: 1 }}
//                   />
//                   <span style={{ color: '#22c55e', fontWeight: '600' }}>70% to Winner</span>
//                 </div>
//               </div>
              
//               <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
//                 <Button
//                   variant="ghost"
//                   onClick={() => setShowCreateModal(false)}
//                   fullWidth={true}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="premium"
//                   onClick={handleCreateChallenge}
//                   fullWidth={true}
//                 >
//                   Create Challenge ($49.99)
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </Modal>
//       </div>
//     </>
//   );
// };

// export default Challenges;
import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import challengeService from '../services/challengeService';
import RealChallengeService from '../services/challengeService';
import  AuthContext  from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Trophy,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  Flame,
  Award,
  Activity,
  BarChart3,
  Share2,
  Camera,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Filter,
  Crown,
  Star,
  Heart,
  Zap,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Eye,
  MessageCircle,
  UserPlus,
  Users as UsersGroup,
  Target as TargetIcon2,
  Award as AwardIcon,
  TrendingDown,
  Home,
  Settings,
  LogOut,
  User,
  Edit,
  MapPin,
  Mail,
  ExternalLink,
  DollarSign,
  BarChart,
  PieChart,
  Activity as ActivityIcon,
  Users as UsersIcon,
  EyeOff,
  MessageSquare,
  Briefcase,
  Coffee,
  BookOpen,
  Music,
  Dumbbell,
  Utensils,
  Smile,
  Frown,
  Meh,
  Brain,
  Lightbulb,
  BrainCircuit,
  CloudRain,
  Sun,
  Moon,
  Wind,
  Droplets,
  Thermometer,
  AlertCircle,
  CheckSquare,
  XSquare,
  Flag,
  Timer,
  Shield,
  HelpCircle,
  Info,
  Copy,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  MessageSquare as MessageSquareIcon,
  Download,
  UploadCloud,
  Gift,
  Watch,
  Smartphone,
  Eye as EyeIcon,
  Globe,
  Lock,
  Bell,
  Sun as SunIcon,
  Moon as MoonIcon,
  Sparkles,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  X,
  Loader2
} from 'lucide-react';

const Challenges = ({ onNavigate }) => {
  // State Management
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('active');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChallengeDetails, setShowChallengeDetails] = useState(false);
  const [showJoinGroupModal, setShowJoinGroupModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUserChallenges, setIsLoadingUserChallenges] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [newChallenge, setNewChallenge] = useState({
    name: '',
    description: '',
    duration: 7,
    type: 'streak',
    difficulty: 'medium',
    stake: 0,
    prizePool: 0,
    rules: [''],
    groupId: null,
    isPublic: true
  });
  const [showJoinedList, setShowJoinedList] = useState({});
  const [error, setError] = useState(null);
  const [dailyCheckins, setDailyCheckins] = useState([]);
  const [groups, setGroups] = useState([]);

  // CSS Styles matching Dashboard/Profile design
  const styles = `
    .challenges-page {
      width: 100%;
      overflow-x: hidden;
      background: #050505;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
      position: relative;
      min-height: 100vh;
    }

    /* Background Effects */
    .challenges-bg-grid {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      pointer-events: none;
      z-index: 1;
    }

    .challenges-floating-elements {
      position: fixed;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    .challenges-floating-element {
      position: absolute;
      border-radius: 50%;
      filter: blur(40px);
      opacity: 0.1;
      animation: float 20s infinite linear;
    }

    .challenges-float-1 {
      width: 400px;
      height: 400px;
      background: linear-gradient(135deg, #22c55e, #3b82f6);
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .challenges-float-2 {
      width: 300px;
      height: 300px;
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      top: 60%;
      right: 15%;
      animation-delay: -5s;
    }

    .challenges-float-3 {
      width: 250px;
      height: 250px;
      background: linear-gradient(135deg, #fbbf24, #ef4444);
      bottom: 20%;
      left: 20%;
      animation-delay: -10s;
    }

    @keyframes float {
      0%, 100% {
        transform: translate(0, 0) rotate(0deg);
      }
      25% {
        transform: translate(50px, -50px) rotate(90deg);
      }
      50% {
        transform: translate(0, -100px) rotate(180deg);
      }
      75% {
        transform: translate(-50px, -50px) rotate(270deg);
      }
    }

    /* Glass Effect */
    .glass {
      backdrop-filter: blur(10px);
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Text Gradient */
    .text-gradient {
      background: linear-gradient(135deg, #00E5FF 0%, #7F00FF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Navigation */
    .challenges-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 50;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(15, 23, 42, 0.95);
    }

    .challenges-nav-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .challenges-nav-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .challenges-nav-logo-text {
      font-size: 1.5rem;
      font-weight: 900;
      letter-spacing: -0.025em;
      text-transform: uppercase;
      font-style: italic;
    }

    .challenges-nav-logo-highlight {
      color: #00E5FF;
    }

    .challenges-nav-links {
      display: none;
    }

    @media (min-width: 768px) {
      .challenges-nav-links {
        display: flex;
        align-items: center;
        gap: 2rem;
      }
    }

    .challenges-nav-link {
      font-size: 0.625rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #71717a;
      transition: color 0.2s;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
    }

    .challenges-nav-link:hover {
      color: white;
    }

    .challenges-nav-button {
      padding: 0.5rem 1.5rem;
      background: #00E5FF;
      color: black;
      border-radius: 0.75rem;
      font-size: 0.75rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .challenges-nav-button:hover {
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(0, 229, 255, 0.4);
    }

    /* Header */
    .challenges-header {
      padding-top: 8rem;
      padding-bottom: 4rem;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      text-align: center;
      position: relative;
      z-index: 2;
    }

    @media (min-width: 768px) {
      .challenges-header {
        text-align: left;
      }
    }

    .challenges-header-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .challenges-title {
      font-size: 4rem;
      font-weight: 900;
      letter-spacing: -0.025em;
      line-height: 1;
      margin-bottom: 1.5rem;
      text-transform: uppercase;
      font-style: italic;
    }

    .challenges-subtitle {
      font-size: 1.25rem;
      color: #a1a1aa;
      max-width: 600px;
      line-height: 1.75;
      font-weight: 300;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }

    @media (min-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .stat-card {
      padding: 2rem;
      border-radius: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: all 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(0, 229, 255, 0.2);
    }

    .stat-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 229, 255, 0.1);
      color: #00E5FF;
      border: 1px solid rgba(0, 229, 255, 0.2);
      margin-bottom: 1rem;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 900;
      margin-bottom: 0.5rem;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.625rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #71717a;
    }

    /* Main Grid */
    .challenges-grid-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1.5rem 4rem;
      position: relative;
      z-index: 2;
    }

    /* Controls */
    .controls-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    @media (min-width: 768px) {
      .controls-section {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    }

    .search-filter-section {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 250px;
    }

    .search-input {
      width: 100%;
      padding: 1rem 1.5rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: #00E5FF;
      background: rgba(0, 229, 255, 0.05);
    }

    .filter-buttons {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .filter-button {
      padding: 0.75rem 1.5rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #71717a;
      font-size: 0.75rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .filter-button:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }

    .filter-button.active {
      color: white;
      background: rgba(0, 229, 255, 0.2);
      border-color: rgba(0, 229, 255, 0.3);
    }

    /* Tabs */
    .challenges-tabs {
      display: flex;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 1rem;
      padding: 0.5rem;
      margin-bottom: 2rem;
      overflow-x: auto;
    }

    .challenges-tab {
      flex: 1;
      padding: 1rem 1.5rem;
      border: none;
      background: transparent;
      color: #71717a;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: 0.75rem;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      white-space: nowrap;
      min-width: 120px;
    }

    .challenges-tab:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }

    .challenges-tab.active {
      color: white;
      background: rgba(0, 229, 255, 0.2);
      border: 1px solid rgba(0, 229, 255, 0.3);
    }

    .tab-badge {
      background: #ef4444;
      color: white;
      font-size: 0.625rem;
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
      margin-left: 0.25rem;
    }

    /* Challenges Grid */
    .challenges-main-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    @media (min-width: 1024px) {
      .challenges-main-grid {
        grid-template-columns: 2fr 1fr;
      }
    }

    .challenges-list {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1.5rem;
    }

    @media (min-width: 768px) {
      .challenges-list {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    /* Challenge Card */
    .challenge-card {
      padding: 2rem;
      border-radius: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.01);
      transition: all 0.3s;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .challenge-card:hover {
      background: rgba(255, 255, 255, 0.03);
      transform: translateY(-5px);
      border-color: rgba(0, 229, 255, 0.2);
    }

    .challenge-card.premium::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #fbbf24, #d97706);
    }

    .challenge-card.featured::after {
      content: '⭐ FEATURED';
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: linear-gradient(135deg, #fbbf24, #d97706);
      color: #1e293b;
      font-size: 0.625rem;
      font-weight: 900;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .challenge-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .challenge-title {
      font-size: 1.5rem;
      font-weight: 900;
      line-height: 1.2;
      margin-right: 1rem;
    }

    .challenge-status {
      font-size: 0.625rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      white-space: nowrap;
    }

    .status-active {
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
    }

    .status-upcoming {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .status-completed {
      background: rgba(139, 92, 246, 0.1);
      color: #8b5cf6;
    }

    .challenge-description {
      color: #71717a;
      font-size: 0.875rem;
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }

    .challenge-meta {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .meta-icon {
      width: 2rem;
      height: 2rem;
      border-radius: 0.75rem;
      background: rgba(0, 229, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #00E5FF;
      flex-shrink: 0;
    }

    .meta-content {
      flex: 1;
    }

    .meta-label {
      font-size: 0.625rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #71717a;
      margin-bottom: 0.125rem;
    }

    .meta-value {
      font-size: 0.875rem;
      font-weight: 700;
    }

    .challenge-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .challenge-tag {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.625rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .tag-difficulty {
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
    }

    .tag-type {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .tag-premium {
      background: rgba(251, 191, 36, 0.1);
      color: #fbbf24;
    }

    .challenge-progress {
      margin-bottom: 1.5rem;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .progress-label {
      font-size: 0.75rem;
      color: #71717a;
    }

    .progress-value {
      font-size: 0.75rem;
      font-weight: 700;
      color: #00E5FF;
    }

    .progress-bar {
      height: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 9999px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #00E5FF, #7F00FF);
      border-radius: 9999px;
      position: relative;
      overflow: hidden;
    }

    .progress-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      animation: progressShine 2s infinite;
    }

    @keyframes progressShine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .challenge-actions {
      display: flex;
      gap: 0.75rem;
    }

    /* Joined Users Dropdown */
    .joined-users-section {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .joined-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.75rem;
      transition: all 0.2s;
    }

    .joined-header:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .joined-title {
      font-size: 0.75rem;
      font-weight: 700;
      color: #71717a;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .joined-count {
      background: rgba(0, 229, 255, 0.1);
      color: #00E5FF;
      font-size: 0.625rem;
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
    }

    .joined-list {
      margin-top: 0.5rem;
      max-height: 200px;
      overflow-y: auto;
      border-radius: 0.75rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .joined-user {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .joined-user:last-child {
      border-bottom: none;
    }

    .joined-avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(0, 229, 255, 0.2);
    }

    .joined-user-info {
      flex: 1;
    }

    .joined-user-name {
      font-size: 0.75rem;
      font-weight: 700;
    }

    .joined-user-streak {
      font-size: 0.625rem;
      color: #22c55e;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .joined-user-badge {
      background: rgba(139, 92, 246, 0.1);
      color: #8b5cf6;
      font-size: 0.5rem;
      padding: 0.125rem 0.375rem;
      border-radius: 9999px;
      margin-left: 0.5rem;
    }

    /* My Challenges Badge */
    .my-challenge-badge {
      background: rgba(251, 191, 36, 0.1);
      color: #fbbf24;
      font-size: 0.5rem;
      padding: 0.125rem 0.375rem;
      border-radius: 9999px;
      margin-left: 0.5rem;
      border: 1px solid rgba(251, 191, 36, 0.2);
    }

    /* Sidebar */
    .challenges-sidebar {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    /* Groups Section */
    .groups-section {
      padding: 2rem;
      border-radius: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.01);
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.025em;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .section-button {
      font-size: 0.625rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #71717a;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      transition: color 0.2s;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .section-button:hover {
      color: white;
    }

    .groups-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .group-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.01);
      cursor: pointer;
      transition: all 0.2s;
    }

    .group-item:hover {
      background: rgba(255, 255, 255, 0.03);
      transform: translateX(5px);
    }

    .group-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 1rem;
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .group-content {
      flex: 1;
    }

    .group-name {
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    .group-meta {
      font-size: 0.75rem;
      color: #71717a;
      display: flex;
      gap: 0.75rem;
    }

    /* Quick Actions */
    .quick-actions-section {
      padding: 2rem;
      border-radius: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), transparent);
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .quick-action-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      border-radius: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.01);
      cursor: pointer;
      transition: all 0.3s;
    }

    .quick-action-button:hover {
      background: rgba(255, 255, 255, 0.03);
      transform: scale(1.05);
      border-color: rgba(0, 229, 255, 0.2);
    }

    .quick-action-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 229, 255, 0.1);
      color: #00E5FF;
    }

    .quick-action-label {
      font-size: 0.625rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      text-align: center;
      color: #71717a;
    }

    /* Leaderboard */
    .leaderboard-section {
      padding: 2rem;
      border-radius: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), transparent);
    }

    .leaderboard-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .leaderboard-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.01);
    }

    .leaderboard-rank {
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      background: rgba(0, 229, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 900;
      color: #00E5FF;
    }

    .rank-1 {
      background: linear-gradient(135deg, #fbbf24, #d97706);
      color: #1e293b;
    }

    .rank-2 {
      background: rgba(209, 213, 219, 0.1);
      color: #d1d5db;
    }

    .rank-3 {
      background: rgba(180, 83, 9, 0.1);
      color: #b45309;
    }

    .leaderboard-avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.75rem;
      object-fit: cover;
      border: 2px solid rgba(0, 229, 255, 0.2);
    }

    .leaderboard-info {
      flex: 1;
    }

    .leaderboard-name {
      font-weight: 700;
      margin-bottom: 0.125rem;
    }

    .leaderboard-stats {
      font-size: 0.75rem;
      color: #71717a;
      display: flex;
      gap: 0.75rem;
    }

    .leaderboard-score {
      font-size: 0.875rem;
      font-weight: 900;
      color: #00E5FF;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }

    .modal-content {
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 3rem;
      border-radius: 3rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(15, 23, 42, 0.95);
      position: relative;
    }

    .modal-large {
      max-width: 800px;
    }

    .modal-close {
      position: absolute;
      top: 2rem;
      right: 2rem;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.75rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .modal-close:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.3);
    }

    .modal-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .modal-icon {
      width: 5rem;
      height: 5rem;
      border-radius: 1.5rem;
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      font-size: 2.5rem;
    }

    .modal-title {
      font-size: 2rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.025em;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .modal-subtitle {
      color: #71717a;
      font-size: 1rem;
    }

    /* Form Styles */
    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #71717a;
      margin-bottom: 0.5rem;
    }

    .form-input {
      width: 100%;
      padding: 1rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #00E5FF;
      background: rgba(0, 229, 255, 0.05);
    }

    .form-select {
      width: 100%;
      padding: 1rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 0.875rem;
      transition: all 0.2s;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      background-size: 1rem;
    }

    .form-select:focus {
      outline: none;
      border-color: #00E5FF;
      background: rgba(0, 229, 255, 0.05);
    }

    .form-textarea {
      width: 100%;
      padding: 1rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 0.875rem;
      transition: all 0.2s;
      resize: vertical;
      min-height: 100px;
    }

    .form-textarea:focus {
      outline: none;
      border-color: #00E5FF;
      background: rgba(0, 229, 255, 0.05);
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    /* Button Styles */
    .button {
      padding: 1rem 2rem;
      border-radius: 1rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: 0.75rem;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .button:hover {
      transform: scale(1.05);
    }

    .button:active {
      transform: scale(0.95);
    }

    .button-primary {
      background: #00E5FF;
      color: black;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .button-primary:hover {
      background: rgba(0, 229, 255, 0.9);
    }

    .button-secondary {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
    }

    .button-secondary:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .button-premium {
      background: linear-gradient(135deg, #fbbf24, #d97706);
      color: #1e293b;
      font-weight: 900;
    }

    .button-premium:hover {
      background: linear-gradient(135deg, #d97706, #b45309);
      box-shadow: 0 20px 25px -5px rgba(251, 191, 36, 0.3);
    }

    .button-success {
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: white;
    }

    .button-success:hover {
      background: linear-gradient(135deg, #16a34a, #15803d);
    }

    .button-joined {
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.2);
      color: #22c55e;
    }

    .button-joined:hover {
      background: rgba(34, 197, 94, 0.2);
    }

    .button-danger {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }

    .button-danger:hover {
      background: rgba(239, 68, 68, 0.2);
    }

    .button-full {
      width: 100%;
    }

    /* Loading State */
    .loading-skeleton {
      background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 1rem;
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #71717a;
      grid-column: 1 / -1;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1.5rem;
      opacity: 0.5;
    }

    .empty-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: white;
    }

    .empty-description {
      font-size: 0.875rem;
      max-width: 300px;
      margin: 0 auto 1.5rem;
      line-height: 1.5;
    }

    /* Challenge Details */
    .challenge-details {
      max-height: 80vh;
      overflow-y: auto;
    }

    .details-section {
      margin-bottom: 2rem;
    }

    .details-title {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #00E5FF;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .participants-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .participant-card {
      padding: 1rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.01);
      text-align: center;
      transition: all 0.2s;
    }

    .participant-card:hover {
      background: rgba(255, 255, 255, 0.03);
      transform: translateY(-2px);
    }

    .participant-avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #00E5FF;
      margin: 0 auto 0.5rem;
    }

    .participant-name {
      font-size: 0.75rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    .participant-streak {
      font-size: 0.625rem;
      color: #71717a;
    }

    .participant-streak.active {
      color: #22c55e;
    }

    /* My Challenges Section */
    .my-challenges-badge {
      background: rgba(251, 191, 36, 0.1);
      color: #fbbf24;
      border: 1px solid rgba(251, 191, 36, 0.2);
      font-size: 0.5rem;
      padding: 0.125rem 0.375rem;
      border-radius: 9999px;
      margin-left: 0.5rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .challenges-title {
        font-size: 3rem;
      }
      
      .challenges-list {
        grid-template-columns: 1fr;
      }
      
      .quick-actions-grid {
        grid-template-columns: repeat(4, 1fr);
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .challenges-title {
        font-size: 2.5rem;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .quick-actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .controls-section {
        flex-direction: column;
      }
      
      .search-filter-section {
        width: 100%;
      }
    }
  `;

  // Navigation function
  const navigateTo = (page) => {
    if (onNavigate && typeof onNavigate === 'function') {
      onNavigate(page);
    } else {
      switch(page) {
        case 'dashboard':
          window.location.href = '/dashboard';
          break;
        case 'profile':
          window.location.href = '/profile';
          break;
        case 'verify':
          window.location.href = '/verify';
          break;
        case 'leaderboard':
          window.location.href = '/leaderboard';
          break;
        case 'auth':
          window.location.href = '/auth';
          break;
        default:
      }
    }
  };

  // Load user data from localStorage (same as Dashboard/Profile)
  const loadUserData = () => {
    try {
      const storedUser = localStorage.getItem('touchgrass_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  // Load challenges from REAL backend API
  const loadChallenges = async (params = {}) => {
    try {
      const response = await challengeService.getChallenges(params);
      const transformedChallenges = challengeService.transformChallenges(response.data?.data || []);
      setChallenges(transformedChallenges);

      // Initialize joined list state
      const joinedState = {};
      transformedChallenges.forEach(challenge => {
        joinedState[challenge.id] = false;
      });
      setShowJoinedList(joinedState);

      return transformedChallenges;
    } catch (error) {
      setError(error.message || 'Failed to load challenges');
      toast.error('Failed to load challenges');
      return [];
    }
  };

  // Load user's joined challenges from API
  const loadUserChallenges = async () => {
    if (!user) return;

    try {
      setIsLoadingUserChallenges(true);
      const response = await challengeService.getUserChallenges();
      const transformedChallenges = challengeService.transformChallenges(response.data?.data || []);
      setUserChallenges(transformedChallenges);
      return transformedChallenges;
    } catch (error) {
      // Don't show error for user challenges as it might be due to not being logged in
      return [];
    } finally {
      setIsLoadingUserChallenges(false);
    }
  };

  // Load daily check-ins for today
  const loadDailyCheckins = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await challengeService.getDailyCheckins(today);
      setDailyCheckins(response.data?.data || []);
    } catch (error) {
      // Don't show error for daily check-ins
    }
  };

  // Toggle joined users dropdown
  const toggleJoinedList = (challengeId) => {
    setShowJoinedList(prev => ({
      ...prev,
      [challengeId]: !prev[challengeId]
    }));
  };

  // Check if user has joined a challenge
  const hasUserJoinedChallenge = (challengeId) => {
    if (!user) return false;
    return userChallenges.some(c => c.id === challengeId);
  };

  // Check if user created a challenge
  const isChallengeCreator = (challenge) => {
    if (!user) return false;
    return challenge.createdBy === user.username;
  };

  // Get user's progress in a challenge
  const getUserChallengeProgress = (challengeId) => {
    if (!user) return { streak: 0, progress: 0 };
    const userChallenge = userChallenges.find(c => c.id === challengeId);
    return userChallenge?.userProgress || { streak: 0, progress: 0 };
  };

  // Get challenges created by current user
  const getMyCreatedChallenges = () => {
    if (!user) return [];
    return challenges.filter(challenge => challenge.createdBy === user.username);
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Load challenges (public challenges)
        await loadChallenges();

        // Load user's joined challenges and daily check-ins if logged in
        if (user) {
          await loadUserChallenges();
          await loadDailyCheckins();
        }

      } catch (error) {
        setError('Failed to load challenges data');
        toast.error('Failed to load challenges data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [user]);

  // Handle join challenge
  const joinChallenge = async (challenge) => {
    if (!user) {
      toast.error('Please login to join challenges');
      navigateTo('auth');
      return;
    }

    try {
      // 1. Show loading state
      setIsJoining(true);

      // 2. REAL API CALL to backend
      const result = await RealChallengeService.joinChallenge(challenge.id);

      // 3. Update state WITHOUT localStorage
      setUserChallenges(prev => [...prev, result]);

      alert(`Successfully joined "${challenge.title}"! Data saved to database.`);

      // 5. Check Network tab - you should see a REAL HTTP request
    } catch (error) {
      alert('Failed to join challenge. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  // Handle join group
  const handleJoinGroup = (groupId) => {
    if (!user) {
      toast.error('Please login to join groups');
      return;
    }

    const group = groups.find(g => g.id === groupId);
    if (!group) {
      toast.error('Group not found');
      return;
    }

    const userGroupsData = loadUserGroups(user.username);

    // Check if already in group
    if (userGroupsData.some(g => g.groupId === groupId)) {
      toast.error('You are already in this group');
      return;
    }

    // Check if group is full
    if (group.members >= group.maxMembers) {
      toast.error('This group is full');
      return;
    }

    // Add group to user's groups
    const newUserGroup = {
      groupId: group.id,
      joinedAt: new Date().toISOString(),
      role: 'member',
      contributions: 0
    };

    const updatedUserGroups = [...userGroupsData, newUserGroup];
    saveUserGroups(user.username, updatedUserGroups);
    setUserGroups(updatedUserGroups);

    // Update group members count
    const updatedGroups = groups.map(g =>
      g.id === groupId
        ? { ...g, members: g.members + 1 }
        : g
    );

    setGroups(updatedGroups);
    saveGroups(updatedGroups);

    toast.success(`Successfully joined "${group.name}"!`);
    setShowJoinGroupModal(false);
  };

  // Handle create challenge
  const handleCreateChallenge = async () => {
    if (!user) {
      toast.error('Please login to create challenges');
      return;
    }

    if (!newChallenge.name.trim() || !newChallenge.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsJoining(true);

      // Transform frontend data to backend format
      const challengeData = {
        name: newChallenge.name,
        description: newChallenge.description,
        duration: newChallenge.duration,
        type: newChallenge.type,
        difficulty: newChallenge.difficulty,
        stake: parseFloat(newChallenge.stake) || 0,
        prizePool: parseFloat(newChallenge.prizePool) || 0,
        rules: newChallenge.rules.filter(rule => rule.trim()),
        isPublic: newChallenge.isPublic,
        groupId: newChallenge.groupId || null
      };

      // Create challenge via API
      await challengeService.createChallenge(challengeData);

      // Reload challenges and user challenges
      await loadChallenges();
      await loadUserChallenges();
      await loadDailyCheckins();

      // Reset form
      setNewChallenge({
        name: '',
        description: '',
        duration: 7,
        type: 'streak',
        difficulty: 'medium',
        stake: 0,
        prizePool: 0,
        rules: [''],
        groupId: null,
        isPublic: true
      });

      setShowCreateModal(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      toast.success('Challenge created successfully! You have been automatically joined.');

    } catch (error) {
      toast.error(error.message || 'Failed to create challenge');
    } finally {
      setIsJoining(false);
    }
  };

  // Handle create group
  const handleCreateGroup = () => {
    if (!userData) {
      toast.error('Please login to create groups');
      return;
    }
    
    if (!newGroup.name.trim() || !newGroup.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const group = {
      id: Date.now(),
      name: newGroup.name,
      description: newGroup.description,
      members: 1, // Creator automatically joins
      maxMembers: newGroup.maxMembers,
      createdBy: userData.username,
      createdAt: new Date().toISOString(),
      isPublic: newGroup.isPublic,
      challenges: [],
      rules: [
        "Be respectful to all members",
        "Support each other's journey",
        "No spam or self-promotion",
        "Keep discussions positive"
      ],
      tags: ["new", "community"]
    };
    
    // Add to groups list
    const updatedGroups = [...groups, group];
    setGroups(updatedGroups);
    saveGroups(updatedGroups);
    
    // Auto-join the group
    const userGroupsData = loadUserGroups(userData.username);
    const newUserGroup = {
      groupId: group.id,
      joinedAt: new Date().toISOString(),
      role: 'admin',
      contributions: 0
    };
    
    const updatedUserGroups = [...userGroupsData, newUserGroup];
    saveUserGroups(userData.username, updatedUserGroups);
    setUserGroups(updatedUserGroups);
    
    // Reset form
    setNewGroup({
      name: '',
      description: '',
      isPublic: true,
      maxMembers: 50
    });
    
    toast.success('Group created successfully! You are now the admin.');
  };

  // Handle verify streak for challenge
  const handleVerifyChallenge = async (challengeId) => {
    if (!user) {
      toast.error('Please login to verify');
      return;
    }

    try {
      setIsJoining(true);

      // Update progress via API
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      await challengeService.updateProgress(challengeId, {
        date: today,
        completed: true,
        notes: 'Verified via challenge page'
      });

      // Reload user challenges to get updated progress
      await loadUserChallenges();

      toast.success('Challenge progress updated! Keep going!');

      // Check for milestone achievements
      const userChallenge = userChallenges.find(c => c.id === challengeId);
      if (userChallenge) {
        const currentStreak = userChallenge.userProgress?.streak || 0;
        if (currentStreak === 7 || currentStreak === 30 || currentStreak === 100) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
          toast.success(`🎉 ${currentStreak}-day milestone achieved in challenge!`, {
            duration: 5000
          });
        }
      }

    } catch (error) {
      toast.error(error.message || 'Failed to update progress');
    } finally {
      setIsJoining(false);
    }
  };

  // Filter challenges based on active tab and filters
  const filteredChallenges = challenges.filter(challenge => {
    // Tab filter
    if (activeTab === 'my') {
      // Show challenges created by current user
      if (!user) return false;
      return challenge.createdBy === user.username;
    }

    if (activeTab === 'my-challenges') {
      // Show challenges joined by current user
      if (!user) return false;
      return userChallenges.some(c => c.id === challenge.id);
    }

    if (activeTab !== 'all' && challenge.status !== activeTab) {
      return false;
    }

    // Search filter
    if (searchQuery && !challenge.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !challenge.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Difficulty filter
    if (filterDifficulty !== 'all' && challenge.difficulty !== filterDifficulty) {
      return false;
    }

    // Type filter
    if (filterType !== 'all' && challenge.type !== filterType) {
      return false;
    }

    return true;
  });

  // Calculate statistics
  const stats = {
    totalChallenges: challenges.length,
    activeParticipants: challenges.reduce((sum, c) => sum + c.participants, 0),
    totalPrizePool: challenges.reduce((sum, c) => sum + c.prizePool, 0),
    successRate: 87,
    activeChallenges: challenges.filter(c => c.status === 'active').length,
    upcomingChallenges: challenges.filter(c => c.status === 'upcoming').length,
    completedChallenges: challenges.filter(c => c.status === 'completed').length,
    totalGroups: groups.length,
    myChallenges: user ? userChallenges.length : 0,
    myCreatedChallenges: user ? getMyCreatedChallenges().length : 0,
    dailyCheckins: dailyCheckins.length
  };

  // Quick actions
  const quickActions = [
    {
      id: 1,
      label: "Dashboard",
      icon: <Home size={24} />,
      action: () => navigateTo('dashboard')
    },
    {
      id: 2,
      label: "Profile",
      icon: <User size={24} />,
      action: () => navigateTo('profile')
    },
    {
      id: 3,
      label: "Verify",
      icon: <Camera size={24} />,
      action: () => navigateTo('verify')
    },
    {
      id: 4,
      label: "Leaderboard",
      icon: <Trophy size={24} />,
      action: () => navigateTo('leaderboard')
    }
  ];

  // Mock leaderboard data
  const leaderboard = [
    { id: 1, name: "StreakMaster", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=streakmaster", streak: 142, score: 9850, rank: 1 },
    { id: 2, name: "MindsetWarrior", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mindsetwarrior", streak: 89, score: 7420, rank: 2 },
    { id: 3, name: "DisciplinePro", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=disciplinepro", streak: 67, score: 5210, rank: 3 },
    { id: 4, name: "EliteRunner", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=eliterunner", streak: 45, score: 3980, rank: 4 },
    { id: 5, name: "AccountabilityKing", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=accountabilityking", streak: 32, score: 2850, rank: 5 }
  ];

  if (isLoading) {
    return (
      <div className="challenges-page">
        <style>{styles}</style>
        
        <div className="challenges-bg-grid"></div>
        <div className="challenges-floating-elements">
          <div className="challenges-floating-element challenges-float-1"></div>
          <div className="challenges-floating-element challenges-float-2"></div>
          <div className="challenges-floating-element challenges-float-3"></div>
        </div>

        <nav className="challenges-nav glass">
          <div className="challenges-nav-container">
            <button 
              className="challenges-nav-logo"
              onClick={() => navigateTo('dashboard')}
            >
              <div className="challenges-nav-logo-text">
                Touch<span className="challenges-nav-logo-highlight">Grass</span>
              </div>
            </button>
            
            <div className="challenges-nav-button loading-skeleton" style={{ width: '120px', height: '40px' }}></div>
          </div>
        </nav>

        <div className="challenges-header">
          <div className="challenges-header-container">
            <div className="loading-skeleton" style={{ height: '80px', width: '400px', marginBottom: '1.5rem', margin: '0 auto' }}></div>
            <div className="loading-skeleton" style={{ height: '30px', width: '600px', margin: '0 auto' }}></div>
          </div>
        </div>

        <div className="challenges-grid-container">
          <div className="stats-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="stat-card loading-skeleton" style={{ height: '150px' }}></div>
            ))}
          </div>
          
          <div className="loading-skeleton" style={{ height: '500px', borderRadius: '2rem', marginBottom: '2rem' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="challenges-page">
      <style>{styles}</style>
      
      {/* Background Effects */}
      <div className="challenges-bg-grid"></div>
      <div className="challenges-floating-elements">
        <div className="challenges-floating-element challenges-float-1"></div>
        <div className="challenges-floating-element challenges-float-2"></div>
        <div className="challenges-floating-element challenges-float-3"></div>
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#fbbf24'][Math.floor(Math.random() * 5)],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `confetti-fall ${Math.random() * 2 + 1}s linear forwards`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Navigation */}
      <nav className="challenges-nav glass">
        <div className="challenges-nav-container">
          <button 
            className="challenges-nav-logo"
            onClick={() => navigateTo('dashboard')}
          >
            <div className="challenges-nav-logo-text">
              Touch<span className="challenges-nav-logo-highlight">Grass</span>
            </div>
          </button>
          
          <div className="challenges-nav-links">
            <button className="challenges-nav-link" onClick={() => navigateTo('dashboard')}>
              Dashboard
            </button>
            <button className="challenges-nav-link" onClick={() => navigateTo('profile')}>
              Profile
            </button>
            <button className="challenges-nav-link" onClick={() => navigateTo('verify')}>
              Verify
            </button>
            <button className="challenges-nav-link" onClick={() => navigateTo('leaderboard')}>
              Leaderboard
            </button>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <button
                className="challenges-nav-button"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus size={16} />
                Create Challenge
              </button>
            ) : (
              <button
                className="challenges-nav-button"
                onClick={() => navigateTo('auth')}
              >
                <User size={16} />
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="challenges-header">
        <div className="challenges-header-container">
          <h1 className="challenges-title text-gradient">
            Challenges & Competitions
          </h1>
          <p className="challenges-subtitle">
            Join challenges, compete with others, build groups, and track your progress. 
            The ultimate platform for discipline and accountability.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="challenges-grid-container">
        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card glass">
            <div className="stat-icon">
              <Target size={24} />
            </div>
            <div className="stat-value">{stats.totalChallenges}</div>
            <div className="stat-label">Total Challenges</div>
          </div>
          
          <div className="stat-card glass">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-value">{stats.activeParticipants.toLocaleString()}</div>
            <div className="stat-label">Active Participants</div>
          </div>
          
          <div className="stat-card glass">
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-value">${stats.totalPrizePool.toLocaleString()}</div>
            <div className="stat-label">Total Prize Pool</div>
          </div>
          
          <div className="stat-card glass">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-value">{stats.successRate}%</div>
            <div className="stat-label">Success Rate</div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-section">
          <div className="search-filter-section">
            <div className="search-box">
              <input
                type="text"
                className="search-input"
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="filter-buttons">
              <button 
                className={`filter-button ${filterDifficulty === 'all' ? 'active' : ''}`}
                onClick={() => setFilterDifficulty('all')}
              >
                All Levels
              </button>
              <button 
                className={`filter-button ${filterDifficulty === 'easy' ? 'active' : ''}`}
                onClick={() => setFilterDifficulty('easy')}
              >
                Easy
              </button>
              <button 
                className={`filter-button ${filterDifficulty === 'medium' ? 'active' : ''}`}
                onClick={() => setFilterDifficulty('medium')}
              >
                Medium
              </button>
              <button 
                className={`filter-button ${filterDifficulty === 'hard' ? 'active' : ''}`}
                onClick={() => setFilterDifficulty('hard')}
              >
                Hard
              </button>
              {/* <button 
                className={`filter-button ${filterDifficulty === 'extreme' ? 'active' : ''}`}
                onClick={() => setFilterDifficulty('extreme')}
              >
                Extreme
              </button> */}
            </div>
          </div>
          
          <div className="filter-buttons">
            {/* <button 
              className={`filter-button ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All Types
            </button> */}
            {/* <button 
              className={`filter-button ${filterType === 'streak' ? 'active' : ''}`}
              onClick={() => setFilterType('streak')}
            >
              Streak
            </button> */}
            {/* <button 
              className={`filter-button ${filterType === 'mindset' ? 'active' : ''}`}
              onClick={() => setFilterType('mindset')}
            >
              Mindset
            </button> */}
            {/* <button 
              className={`filter-button ${filterType === 'sprint' ? 'active' : ''}`}
              onClick={() => setFilterType('sprint')}
            >
              Sprint
            </button> */}
          </div>
        </div>

        {/* Tabs */}
        <div className="challenges-tabs">
          <button 
            className={`challenges-tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            <Activity size={16} />
            Active
            <span className="tab-badge">{stats.activeChallenges}</span>
          </button>
          
          <button 
            className={`challenges-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <Calendar size={16} />
            Upcoming
            <span className="tab-badge">{stats.upcomingChallenges}</span>
          </button>
          
          <button 
            className={`challenges-tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <CheckCircle2 size={16} />
            Completed
            <span className="tab-badge">{stats.completedChallenges}</span>
          </button>
          
          <button
            className={`challenges-tab ${activeTab === 'my' ? 'active' : ''}`}
            onClick={() => setActiveTab('my')}
          >
            <User size={16} />
            My Created
            {user && stats.myCreatedChallenges > 0 && (
              <span className="tab-badge">{stats.myCreatedChallenges}</span>
            )}
          </button>

          <button
            className={`challenges-tab ${activeTab === 'my-challenges' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-challenges')}
          >
            <Target size={16} />
            My Challenges
            {user && stats.myChallenges > 0 && (
              <span className="tab-badge">{stats.myChallenges}</span>
            )}
          </button>
          
          <button 
            className={`challenges-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <Target size={16} />
            All Challenges
          </button>
        </div>

        {/* Main Grid */}
        <div className="challenges-main-grid">
          {/* Challenges List */}
          <div className="challenges-list">
            {filteredChallenges.length > 0 ? (
              filteredChallenges.map(challenge => {
                const hasJoined = hasUserJoinedChallenge(challenge.id);
                const isCreator = isChallengeCreator(challenge);
                const userProgress = getUserChallengeProgress(challenge.id);
                
                return (
                  <motion.div
                    key={challenge.id}
                    className={`challenge-card glass ${challenge.stake > 0 ? 'premium' : ''} ${challenge.featured ? 'featured' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => {
                      setSelectedChallenge(challenge);
                      setShowChallengeDetails(true);
                    }}
                  >
                    <div className="challenge-header">
                      <h3 className="challenge-title">
                        {challenge.name}
                        {isCreator && (
                          <span className="my-challenge-badge">Created by me</span>
                        )}
                      </h3>
                      <span className={`challenge-status status-${challenge.status}`}>
                        {challenge.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="challenge-description">{challenge.description}</p>
                    
                    <div className="challenge-meta">
                      <div className="meta-item">
                        <div className="meta-icon">
                          <Calendar size={16} />
                        </div>
                        <div className="meta-content">
                          <div className="meta-label">Duration</div>
                          <div className="meta-value">{challenge.duration} days</div>
                        </div>
                      </div>
                      
                      <div className="meta-item">
                        <div className="meta-icon">
                          <Users size={16} />
                        </div>
                        <div className="meta-content">
                          <div className="meta-label">Participants</div>
                          <div className="meta-value">
                            {challenge.participants}/{challenge.maxParticipants}
                          </div>
                        </div>
                      </div>
                      
                      <div className="meta-item">
                        <div className="meta-icon">
                          <Zap size={16} />
                        </div>
                        <div className="meta-content">
                          <div className="meta-label">Difficulty</div>
                          <div className="meta-value">{challenge.difficulty}</div>
                        </div>
                      </div>
                      
                      <div className="meta-item">
                        <div className="meta-icon">
                          <DollarSign size={16} />
                        </div>
                        <div className="meta-content">
                          <div className="meta-label">Prize Pool</div>
                          <div className="meta-value">${challenge.prizePool.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Joined Users Section */}
                    {challenge.joinedUsers && challenge.joinedUsers.length > 0 && (
                      <div className="joined-users-section">
                        <div 
                          className="joined-header"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleJoinedList(challenge.id);
                          }}
                        >
                          <div className="joined-title">
                            <Users size={14} />
                            Joined Users
                            <span className="joined-count">{challenge.joinedUsers.length}</span>
                          </div>
                          {showJoinedList[challenge.id] ? (
                            <ChevronUp size={16} color="#71717a" />
                          ) : (
                            <ChevronDown size={16} color="#71717a" />
                          )}
                        </div>
                        
                        {showJoinedList[challenge.id] && (
                          <div className="joined-list">
                            {challenge.joinedUsers.map((user, index) => (
                              <div key={user.id || index} className="joined-user">
                                <img 
                                  src={user.avatar}
                                  alt={user.name}
                                  className="joined-avatar"
                                />
                                <div className="joined-user-info">
                                  <div className="joined-user-name">
                                    {user.name}
                                    {user.isCreator && (
                                      <span className="joined-user-badge">Creator</span>
                                    )}
                                    {user.isNew && (
                                      <span className="joined-user-badge">New</span>
                                    )}
                                  </div>
                                  <div className="joined-user-streak">
                                    <Flame size={10} />
                                    {user.streak} day streak
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="challenge-tags">
                      <span className="challenge-tag tag-difficulty">
                        {challenge.difficulty}
                      </span>
                      <span className="challenge-tag tag-type">
                        {challenge.type}
                      </span>
                      {challenge.stake > 0 && (
                        <span className="challenge-tag tag-premium">
                          Premium
                        </span>
                      )}
                      {challenge.groupId && (
                        <span className="challenge-tag" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                          Group
                        </span>
                      )}
                    </div>
                    
                    <div className="challenge-progress">
                      <div className="progress-header">
                        <span className="progress-label">Progress</span>
                        <span className="progress-value">
                          {hasJoined ? `${userProgress.streak}/${challenge.duration} days` : `${challenge.progress}%`}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: hasJoined 
                              ? `${(userProgress.streak / challenge.duration) * 100}%`
                              : `${challenge.progress}%` 
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="challenge-actions">
                      {hasJoined ? (
                        <>
                          <button
                            className="button button-joined"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.success("You're already in this challenge!");
                            }}
                          >
                            <CheckCircle size={16} />
                            Joined
                          </button>

                          <button
                            className="button button-success"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVerifyChallenge(challenge.id);
                            }}
                            disabled={isJoining}
                          >
                            {isJoining ? (
                              <>
                                <Loader2 size={16} className="animate-spin mr-2" />
                                Verifying...
                              </>
                            ) : (
                              <>
                                <Camera size={16} />
                                Verify Today
                              </>
                            )}
                          </button>
                        </>
                      ) : (
                  <button
                    className="button button-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      joinChallenge(challenge);
                    }}
                    disabled={isJoining}
                  >
                    {isJoining ? (
                      <>
                        <Loader2 size={16} className="animate-spin mr-2" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} />
                        Join Challenge
                      </>
                    )}
                  </button>
                      )}
                      
                      {challenge.groupId && (
                        <button 
                          className="button button-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedGroup(groups.find(g => g.id === challenge.groupId));
                            setShowJoinGroupModal(true);
                          }}
                        >
                          <UsersGroup size={16} />
                          View Group
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <div className="empty-title">No Challenges Found</div>
                <div className="empty-description">
                  {searchQuery || filterDifficulty !== 'all' || filterType !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : activeTab === 'my'
                    ? 'You haven\'t created any challenges yet'
                    : activeTab === 'my-challenges'
                    ? 'You haven\'t joined any challenges yet'
                    : 'Be the first to create a challenge!'}
                </div>
                {!searchQuery && filterDifficulty === 'all' && filterType === 'all' && (
                  <button 
                    className="button button-primary"
                    onClick={() => setShowCreateModal(true)}
                    style={{ marginTop: '1rem' }}
                  >
                    <Plus size={16} />
                    Create First Challenge
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="challenges-sidebar">
            {/* Daily Check-ins */}
            {user && dailyCheckins.length > 0 && (
              <section className="groups-section glass">
                <div className="section-header">
                  <h3 className="section-title">
                    <CheckCircle2 size={20} />
                    Today's Check-ins
                  </h3>
                </div>

                <div className="groups-list">
                  {dailyCheckins.slice(0, 5).map((checkin, index) => (
                    <div
                      key={checkin.id || index}
                      className="group-item"
                      onClick={() => {
                        const challenge = userChallenges.find(c => c.id === checkin.challengeId);
                        if (challenge) {
                          setSelectedChallenge(challenge);
                          setShowChallengeDetails(true);
                        }
                      }}
                    >
                      <div className="group-icon" style={{ background: checkin.completed ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #fbbf24, #d97706)' }}>
                        {checkin.completed ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                      </div>
                      <div className="group-content">
                        <div className="group-name">{checkin.challengeName || `Challenge ${checkin.challengeId}`}</div>
                        <div className="group-meta">
                          <span>{checkin.completed ? 'Completed' : 'Pending'}</span>
                          {checkin.streak && <span>🔥 {checkin.streak} streak</span>}
                        </div>
                      </div>
                      <ChevronRight size={16} color="#71717a" />
                    </div>
                  ))}

                  {dailyCheckins.length === 0 && (
                    <div className="empty-state" style={{ padding: '1rem' }}>
                      <div className="empty-icon" style={{ fontSize: '1.5rem' }}>✅</div>
                      <div className="empty-title" style={{ fontSize: '0.875rem' }}>All Done!</div>
                      <div className="empty-description" style={{ fontSize: '0.75rem' }}>
                        Great job on your daily check-ins
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Quick Actions */}
            <section className="quick-actions-section glass">
              <div className="section-header">
                <h3 className="section-title">
                  <Zap size={20} />
                  Quick Actions
                </h3>
              </div>

              <div className="quick-actions-grid">
                {quickActions.map(action => (
                  <button
                    key={action.id}
                    className="quick-action-button glass"
                    onClick={action.action}
                  >
                    <div className="quick-action-icon">
                      {action.icon}
                    </div>
                    <span className="quick-action-label">{action.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Groups Section */}
            <section className="groups-section glass">
              <div className="section-header">
                <h3 className="section-title">
                  <UsersGroup size={20} />
                  Active Groups
                </h3>
                <button 
                  className="section-button"
                  onClick={() => {
                    setNewGroup({
                      name: '',
                      description: '',
                      isPublic: true,
                      maxMembers: 50
                    });
                  }}
                >
                  <Plus size={12} />
                  Create
                </button>
              </div>
              
              <div className="groups-list">
                {groups.slice(0, 3).map(group => (
                  <div 
                    key={group.id}
                    className="group-item"
                    onClick={() => {
                      setSelectedGroup(group);
                      setShowJoinGroupModal(true);
                    }}
                  >
                    <div className="group-icon">
                      <Users size={20} />
                    </div>
                    <div className="group-content">
                      <div className="group-name">{group.name}</div>
                      <div className="group-meta">
                        <span>{group.members} members</span>
                        <span>{group.isPublic ? 'Public' : 'Private'}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#71717a" />
                  </div>
                ))}
                
                {groups.length === 0 && (
                  <div className="empty-state" style={{ padding: '1rem' }}>
                    <div className="empty-icon" style={{ fontSize: '1.5rem' }}>👥</div>
                    <div className="empty-title" style={{ fontSize: '0.875rem' }}>No Groups Yet</div>
                    <div className="empty-description" style={{ fontSize: '0.75rem' }}>
                      Create a group to compete together
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Leaderboard */}
            <section className="leaderboard-section glass">
              <div className="section-header">
                <h3 className="section-title">
                  <Trophy size={20} />
                  Top Competitors
                </h3>
                <button 
                  className="section-button"
                  onClick={() => navigateTo('leaderboard')}
                >
                  View All
                  <ChevronRight size={12} />
                </button>
              </div>
              
              <div className="leaderboard-list">
                {leaderboard.map(player => (
                  <div key={player.id} className="leaderboard-item">
                    <div className={`leaderboard-rank rank-${player.rank}`}>
                      {player.rank}
                    </div>
                    <img 
                      src={player.avatar}
                      alt={player.name}
                      className="leaderboard-avatar"
                    />
                    <div className="leaderboard-info">
                      <div className="leaderboard-name">{player.name}</div>
                      <div className="leaderboard-stats">
                        <span>🔥 {player.streak} days</span>
                        <span>🏆 {player.score}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Create Challenge Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <motion.div 
            className="modal-content modal-large glass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <button 
              className="modal-close"
              onClick={() => setShowCreateModal(false)}
            >
              ✕
            </button>
            
            <div className="modal-header">
              <div className="modal-icon">
                <Plus size={32} />
              </div>
              <h2 className="modal-title">Create New Challenge</h2>
              <p className="modal-subtitle">Design a challenge for others to join and compete</p>
            </div>
            
            <div className="form-group">
              <label className="form-label">Challenge Name *</label>
              <input
                type="text"
                className="form-input"
                value={newChallenge.name}
                onChange={(e) => setNewChallenge({...newChallenge, name: e.target.value})}
                placeholder="e.g., 30-Day Discipline Marathon"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-textarea"
                value={newChallenge.description}
                onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
                placeholder="Describe your challenge and its goals..."
                rows="4"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Duration (Days)</label>
                <select
                  className="form-select"
                  value={newChallenge.duration}
                  onChange={(e) => setNewChallenge({...newChallenge, duration: parseInt(e.target.value)})}
                >
                  <option value="1">1 Day (Sprint)</option>
                  <option value="7">7 Days (Weekly)</option>
                  <option value="30">30 Days (Monthly)</option>
                  <option value="90">90 Days (Quarterly)</option>
                  <option value="365">365 Days (Yearly)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Challenge Type</label>
                <select
                  className="form-select"
                  value={newChallenge.type}
                  onChange={(e) => setNewChallenge({...newChallenge, type: e.target.value})}
                >
                  <option value="streak">Streak Challenge</option>
                  <option value="mindset">Mindset Challenge</option>
                  <option value="sprint">Sprint Challenge</option>
                  <option value="fitness">Fitness Challenge</option>
                  <option value="productivity">Productivity Challenge</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Difficulty Level</label>
                <select
                  className="form-select"
                  value={newChallenge.difficulty}
                  onChange={(e) => setNewChallenge({...newChallenge, difficulty: e.target.value})}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="extreme">Extreme</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Stake Amount ($)</label>
                <input
                  type="number"
                  className="form-input"
                  value={newChallenge.stake}
                  onChange={(e) => setNewChallenge({...newChallenge, stake: e.target.value})}
                  placeholder="0 for free challenge"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Prize Pool ($)</label>
                <input
                  type="number"
                  className="form-input"
                  value={newChallenge.prizePool}
                  onChange={(e) => setNewChallenge({...newChallenge, prizePool: e.target.value})}
                  placeholder="Total prize money"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Assign to Group (Optional)</label>
                <select
                  className="form-select"
                  value={newChallenge.groupId || ''}
                  onChange={(e) => setNewChallenge({...newChallenge, groupId: e.target.value ? parseInt(e.target.value) : null})}
                >
                  <option value="">No Group</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Rules & Requirements</label>
              {newChallenge.rules.map((rule, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={rule}
                    onChange={(e) => {
                      const newRules = [...newChallenge.rules];
                      newRules[index] = e.target.value;
                      setNewChallenge({...newChallenge, rules: newRules});
                    }}
                    placeholder={`Rule ${index + 1}`}
                    style={{ flex: 1 }}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newRules = newChallenge.rules.filter((_, i) => i !== index);
                        setNewChallenge({...newChallenge, rules: newRules});
                      }}
                      style={{
                        padding: '0.5rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '0.5rem',
                        color: '#ef4444',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setNewChallenge({...newChallenge, rules: [...newChallenge.rules, '']})}
                style={{ marginTop: '0.5rem' }}
              >
                <Plus size={12} />
                Add Rule
              </button>
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={newChallenge.isPublic}
                  onChange={(e) => setNewChallenge({...newChallenge, isPublic: e.target.checked})}
                />
                Make Challenge Public
              </label>
            </div>
            
            <div className="form-actions">
              <button 
                className="button button-secondary"
                onClick={() => setShowCreateModal(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                className="button button-primary"
                onClick={handleCreateChallenge}
                style={{ flex: 1 }}
                disabled={isJoining}
              >
                {isJoining ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Creating...
                  </>
                ) : (
                  'Create Challenge'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Challenge Details Modal */}
      {showChallengeDetails && selectedChallenge && (
        <div className="modal-overlay">
          <motion.div 
            className="modal-content modal-large glass challenge-details"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <button 
              className="modal-close"
              onClick={() => setShowChallengeDetails(false)}
            >
              ✕
            </button>
            
            <div className="modal-header">
              <div className="modal-icon">
                <Target size={32} />
              </div>
              <h2 className="modal-title">{selectedChallenge.name}</h2>
              <p className="modal-subtitle">
                {selectedChallenge.type.toUpperCase()} • {selectedChallenge.difficulty} • {selectedChallenge.duration} days
                {isChallengeCreator(selectedChallenge) && (
                  <span style={{ color: '#fbbf24', marginLeft: '1rem' }}>⭐ Created by you</span>
                )}
              </p>
            </div>
            
            <div className="details-section">
              <h3 className="details-title">Challenge Description</h3>
              <p style={{ color: 'white', lineHeight: '1.6' }}>{selectedChallenge.description}</p>
            </div>
            
            <div className="form-row">
              <div className="details-section">
                <h3 className="details-title">Challenge Details</h3>
                <div className="challenge-meta">
                  <div className="meta-item">
                    <div className="meta-icon">
                      <Calendar size={16} />
                    </div>
                    <div className="meta-content">
                      <div className="meta-label">Duration</div>
                      <div className="meta-value">{selectedChallenge.duration} days</div>
                    </div>
                  </div>
                  
                  <div className="meta-item">
                    <div className="meta-icon">
                      <Users size={16} />
                    </div>
                    <div className="meta-content">
                      <div className="meta-label">Participants</div>
                      <div className="meta-value">
                        {selectedChallenge.participants}/{selectedChallenge.maxParticipants}
                      </div>
                    </div>
                  </div>
                  
                  <div className="meta-item">
                    <div className="meta-icon">
                      <DollarSign size={16} />
                    </div>
                    <div className="meta-content">
                      <div className="meta-label">Prize Pool</div>
                      <div className="meta-value">${selectedChallenge.prizePool.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="meta-item">
                    <div className="meta-icon">
                      <Crown size={16} />
                    </div>
                    <div className="meta-content">
                      <div className="meta-label">Stake</div>
                      <div className="meta-value">
                        {selectedChallenge.stake > 0 ? `$${selectedChallenge.stake}` : 'Free'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="details-section">
                <h3 className="details-title">Your Progress</h3>
                <div className="challenge-progress">
                  <div className="progress-header">
                    <span className="progress-label">Current Streak</span>
                    <span className="progress-value">
                      {user ? (
                        getUserChallengeProgress(selectedChallenge.id).streak || 0
                      ) : 0} days
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: user
                          ? `${(getUserChallengeProgress(selectedChallenge.id).streak / selectedChallenge.duration) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="details-section">
              <h3 className="details-title">Rules & Requirements</h3>
              <div className="challenge-rules">
                {selectedChallenge.rules.map((rule, index) => (
                  <div key={index} className="rule-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <CheckCircle size={14} style={{ color: '#00E5FF', flexShrink: 0, marginTop: '0.125rem' }} />
                    <span style={{ color: 'white' }}>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {selectedChallenge.groupId && (
              <div className="details-section">
                <h3 className="details-title">Associated Group</h3>
                <div className="group-item" style={{ margin: 0 }}>
                  <div className="group-icon">
                    <Users size={20} />
                  </div>
                  <div className="group-content">
                    <div className="group-name">
                      {groups.find(g => g.id === selectedChallenge.groupId)?.name || 'Unknown Group'}
                    </div>
                    <div className="group-meta">
                      <span>
                        {groups.find(g => g.id === selectedChallenge.groupId)?.members || 0} members
                      </span>
                    </div>
                  </div>
                  <button 
                    className="button button-secondary"
                    onClick={() => {
                      setShowChallengeDetails(false);
                      setSelectedGroup(groups.find(g => g.id === selectedChallenge.groupId));
                      setShowJoinGroupModal(true);
                    }}
                  >
                    View Group
                  </button>
                </div>
              </div>
            )}
            
            <div className="details-section">
              <h3 className="details-title">Joined Participants</h3>
              <div className="joined-list" style={{ maxHeight: '300px' }}>
                {selectedChallenge.joinedUsers?.map((user, index) => (
                  <div key={user.id || index} className="joined-user">
                    <img 
                      src={user.avatar}
                      alt={user.name}
                      className="joined-avatar"
                    />
                    <div className="joined-user-info">
                      <div className="joined-user-name">
                        {user.name}
                        {user.isCreator && (
                          <span className="joined-user-badge">Creator</span>
                        )}
                      </div>
                      <div className="joined-user-streak">
                        <Flame size={10} />
                        {user.streak} day streak
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                className="button button-secondary"
                onClick={() => setShowChallengeDetails(false)}
              >
                Close
              </button>
              
              {userData && (
                <>
                  {hasUserJoinedChallenge(selectedChallenge.id) ? (
                    <button 
                      className="button button-joined"
                      onClick={() => {
                        toast.success("You're already in this challenge!");
                      }}
                    >
                      <CheckCircle size={16} />
                      Already Joined
                    </button>
                  ) : (
                    <button 
                      className="button button-primary"
                      onClick={() => handleJoinChallenge(selectedChallenge)}
                    >
                      <UserPlus size={16} />
                      Join Challenge
                    </button>
                  )}
                  
                  {hasUserJoinedChallenge(selectedChallenge.id) && (
                    <button
                      className="button button-success"
                      onClick={() => handleVerifyChallenge(selectedChallenge.id)}
                      disabled={isJoining}
                    >
                      {isJoining ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Camera size={16} />
                          Verify Today
                        </>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Join Group Modal */}
      {showJoinGroupModal && selectedGroup && (
        <div className="modal-overlay">
          <motion.div 
            className="modal-content glass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <button 
              className="modal-close"
              onClick={() => setShowJoinGroupModal(false)}
            >
              ✕
            </button>
            
            <div className="modal-header">
              <div className="modal-icon">
                <UsersGroup size={32} />
              </div>
              <h2 className="modal-title">{selectedGroup.name}</h2>
              <p className="modal-subtitle">
                {selectedGroup.isPublic ? 'Public Group' : 'Private Group'} • {selectedGroup.members} members
              </p>
            </div>
            
            <div className="details-section">
              <h3 className="details-title">Group Description</h3>
              <p style={{ color: 'white', lineHeight: '1.6' }}>{selectedGroup.description}</p>
            </div>
            
            <div className="details-section">
              <h3 className="details-title">Group Rules</h3>
              <div className="challenge-rules">
                {selectedGroup.rules.map((rule, index) => (
                  <div key={index} className="rule-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Shield size={14} style={{ color: '#00E5FF', flexShrink: 0, marginTop: '0.125rem' }} />
                    <span style={{ color: 'white' }}>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="details-section">
              <h3 className="details-title">Active Challenges</h3>
              <div className="groups-list">
                {challenges
                  .filter(c => selectedGroup.challenges.includes(c.id))
                  .map(challenge => (
                    <div 
                      key={challenge.id}
                      className="group-item"
                      onClick={() => {
                        setShowJoinGroupModal(false);
                        setSelectedChallenge(challenge);
                        setShowChallengeDetails(true);
                      }}
                    >
                      <div className="group-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #3b82f6)' }}>
                        <Target size={20} />
                      </div>
                      <div className="group-content">
                        <div className="group-name">{challenge.name}</div>
                        <div className="group-meta">
                          <span>{challenge.participants} participants</span>
                          <span>{challenge.difficulty}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} color="#71717a" />
                    </div>
                  ))}
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                className="button button-secondary"
                onClick={() => setShowJoinGroupModal(false)}
              >
                Close
              </button>
              
              {user && (
                <button
                  className="button button-primary"
                  onClick={() => handleJoinGroup(selectedGroup.id)}
                >
                  <UserPlus size={16} />
                  Join Group
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Challenges;