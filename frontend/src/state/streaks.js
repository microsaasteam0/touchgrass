
  import React, { useState, useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';
import { createGlobalStyle } from 'styled-components';

// ==============================
// GLOBAL STYLES
// ==============================
const GlobalStreakStyles = createGlobalStyle`
  .streak-counter {
    font-size: 4rem;
    font-weight: 900;
    background: linear-gradient(135deg, 
      var(--grass-400) 0%, 
      var(--premium-gold) 50%, 
      var(--grass-300) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: streakGlow 3s ease-in-out infinite;
    position: relative;
  }

  @keyframes streakGlow {
    0%, 100% { 
      text-shadow: 0 0 20px rgba(34, 197, 94, 0.3),
                   0 0 40px rgba(34, 197, 94, 0.2),
                   0 0 60px rgba(34, 197, 94, 0.1);
    }
    50% { 
      text-shadow: 0 0 30px rgba(34, 197, 94, 0.5),
                   0 0 60px rgba(34, 197, 94, 0.3),
                   0 0 90px rgba(34, 197, 94, 0.2);
    }
  }

  .streak-flame {
    animation: flameFlicker 1.5s ease-in-out infinite;
    filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.5));
  }

  @keyframes flameFlicker {
    0%, 100% { 
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
    25% { 
      transform: scale(1.05) rotate(-2deg);
      opacity: 0.9;
    }
    50% { 
      transform: scale(0.95) rotate(2deg);
      opacity: 0.8;
    }
    75% { 
      transform: scale(1.1) rotate(-1deg);
      opacity: 0.95;
    }
  }

  .calendar-day {
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  }

  .calendar-day-verified {
    background: linear-gradient(135deg, var(--grass-500), var(--grass-600));
    color: white;
    animation: dayPop 0.3s ease-out;
  }

  .calendar-day-shamed {
    background: linear-gradient(135deg, var(--shame-500), var(--shame-600));
    color: white;
  }

  .calendar-day-missed {
    background: rgba(239, 68, 68, 0.1);
    color: var(--shame-400);
    border: 1px solid rgba(239, 68, 68, 0.2);
  }

  .calendar-day-future {
    background: rgba(255, 255, 255, 0.05);
    color: var(--gray-400);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  @keyframes dayPop {
    0% { transform: scale(0); opacity: 0; }
    70% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }

  .progress-ring {
    transform: rotate(-90deg);
    animation: progressFill 1.5s ease-out forwards;
  }

  @keyframes progressFill {
    from { stroke-dashoffset: 283; }
    to { stroke-dashoffset: var(--progress); }
  }

  .achievement-badge {
    animation: badgeFloat 3s ease-in-out infinite;
    filter: drop-shadow(0 5px 15px rgba(251, 191, 36, 0.3));
  }

  @keyframes badgeFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    33% { transform: translateY(-10px) rotate(5deg); }
    66% { transform: translateY(-5px) rotate(-5deg); }
  }

  .shame-pulse {
    animation: shamePulse 2s ease-in-out infinite;
  }

  @keyframes shamePulse {
    0%, 100% { 
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    70% { 
      box-shadow: 0 0 0 20px rgba(239, 68, 68, 0);
    }
    100% { 
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    }
  }

  .verification-success {
    animation: successConfetti 0.5s ease-out forwards;
  }

  @keyframes successConfetti {
    0% { 
      transform: scale(0) rotate(0deg);
      opacity: 0;
    }
    50% { 
      transform: scale(1.2) rotate(180deg);
      opacity: 1;
    }
    100% { 
      transform: scale(1) rotate(360deg);
      opacity: 1;
    }
  }

  .streak-chain {
    position: relative;
  }

  .streak-chain::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -1.5rem;
    width: 1rem;
    height: 2px;
    background: linear-gradient(90deg, var(--grass-500), var(--premium-gold));
    animation: chainExtend 0.5s ease-out forwards;
  }

  @keyframes chainExtend {
    from { width: 0; opacity: 0; }
    to { width: 1rem; opacity: 1; }
  }

  .time-warning {
    animation: warningFlash 1s ease-in-out infinite;
  }

  @keyframes warningFlash {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .streak-milestone {
    animation: milestoneGlow 2s ease-in-out infinite;
  }

  @keyframes milestoneGlow {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
    }
    50% { 
      transform: scale(1.05);
      box-shadow: 0 0 40px rgba(251, 191, 36, 0.5);
    }
  }
`;

// ==============================
// ATOM DEFINITIONS
// ==============================
export const streakState = atom({
  key: 'streakState',
  default: {
    currentStreak: 0,
    longestStreak: 0,
    totalDays: 0,
    consistency: 0,
    todayVerified: false,
    verificationMethod: null, // 'photo' | 'shame' | null
    streakHistory: [],
    achievements: [],
    nextCheckpoint: null,
    loading: false,
    error: null,
    stats: {
      totalOutdoorTime: 0,
      averageDuration: 0,
      bestDay: null,
      currentRank: null,
      percentile: null
    }
  }
});

export const verificationModalState = atom({
  key: 'verificationModalState',
  default: {
    isOpen: false,
    mode: 'photo', // 'photo' | 'shame'
    step: 1
  }
});

export const achievementModalState = atom({
  key: 'achievementModalState',
  default: {
    isOpen: false,
    achievement: null
  }
});

// ==============================
// STREAK SERVICE
// ==============================
class StreakService {
  constructor() {
    this.API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  }

  async getCurrentStreak() {
    const response = await fetch(`${this.API_URL}/streaks/current`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }

  async verifyWithPhoto(photo, duration, notes = '', location = null) {
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('duration', duration);
    if (notes) formData.append('notes', notes);
    if (location) formData.append('location', JSON.stringify(location));

    const response = await fetch(`${this.API_URL}/streaks/verify/photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    return response.json();
  }

  async verifyWithShame(shameMessage, isPublic = false) {
    const response = await fetch(`${this.API_URL}/streaks/verify/shame`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ shameMessage, public: isPublic })
    });
    return response.json();
  }

  async skipDay() {
    const response = await fetch(`${this.API_URL}/streaks/skip`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }

  async getStreakHistory(limit = 30) {
    const response = await fetch(`${this.API_URL}/streaks/history?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }

  async getAchievements() {
    const response = await fetch(`${this.API_URL}/streaks/achievements`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }

  async updateStats() {
    const response = await fetch(`${this.API_URL}/streaks/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }
}

export const streakService = new StreakService();

// ==============================
// HOOKS
// ==============================
export const useStreak = () => {
  const [streak, setStreak] = useRecoilState(streakState);
  const [verificationModal, setVerificationModal] = useRecoilState(verificationModalState);
  const [achievementModal, setAchievementModal] = useRecoilState(achievementModalState);

  const loadStreak = async () => {
    setStreak(prev => ({ ...prev, loading: true }));
    try {
      const data = await streakService.getCurrentStreak();
      const history = await streakService.getStreakHistory();
      const achievements = await streakService.getAchievements();
      const stats = await streakService.updateStats();

      setStreak({
        ...data,
        streakHistory: history,
        achievements,
        stats,
        loading: false,
        error: null
      });
    } catch (error) {
      setStreak(prev => ({ ...prev, loading: false, error: error.message }));
    }
  };

  const verifyPhoto = async (photo, duration, notes = '', location = null) => {
    setStreak(prev => ({ ...prev, loading: true }));
    try {
      const result = await streakService.verifyWithPhoto(photo, duration, notes, location);
      
      setStreak(prev => ({
        ...prev,
        currentStreak: result.streak,
        todayVerified: true,
        verificationMethod: 'photo',
        loading: false
      }));

      // Check for achievements
      if (result.achievements?.length > 0) {
        setAchievementModal({
          isOpen: true,
          achievement: result.achievements[0]
        });
      }

      return result;
    } catch (error) {
      setStreak(prev => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  };

  const verifyShame = async (shameMessage, isPublic = false) => {
    setStreak(prev => ({ ...prev, loading: true }));
    try {
      const result = await streakService.verifyWithShame(shameMessage, isPublic);
      
      setStreak(prev => ({
        ...prev,
        currentStreak: result.streak,
        todayVerified: true,
        verificationMethod: 'shame',
        loading: false
      }));

      return result;
    } catch (error) {
      setStreak(prev => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  };

  const skipDay = async () => {
    setStreak(prev => ({ ...prev, loading: true }));
    try {
      const result = await streakService.skipDay();
      
      setStreak(prev => ({
        ...prev,
        todayVerified: true,
        loading: false
      }));

      return result;
    } catch (error) {
      setStreak(prev => ({ ...prev, loading: false, error: error.message }));
      throw error;
    }
  };

  const openVerificationModal = (mode = 'photo') => {
    setVerificationModal({ isOpen: true, mode, step: 1 });
  };

  const closeVerificationModal = () => {
    setVerificationModal({ isOpen: false, mode: 'photo', step: 1 });
  };

  const openAchievementModal = (achievement) => {
    setAchievementModal({ isOpen: true, achievement });
  };

  const closeAchievementModal = () => {
    setAchievementModal({ isOpen: false, achievement: null });
  };

  const calculateTimeLeft = () => {
    if (!streak.nextCheckpoint) return '24:00:00';
    
    const now = new Date();
    const checkpoint = new Date(streak.nextCheckpoint);
    const diff = checkpoint - now;
    
    if (diff <= 0) return '00:00:00';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStreakEmoji = () => {
    if (streak.currentStreak >= 100) return '💯';
    if (streak.currentStreak >= 30) return '🌟';
    if (streak.currentStreak >= 7) return '🔥';
    return '🌱';
  };

  const getRoast = () => {
    const roasts = [
      "Still a digital zombie, I see. Your chair must be fused to your skin by now.",
      "Another day indoors? Even houseplants get more sunlight than you.",
      "Your vitamin D levels are crying. Go outside.",
      "Your screen time is longer than your life expectancy at this rate.",
      "The grass is calling. Unfortunately, it's saying 'I don't know this person.'",
      "You've evolved from human to houseplant. At least they photosynthesize."
    ];
    return roasts[Math.floor(Math.random() * roasts.length)];
  };

  const getEncouragement = () => {
    const encouragements = [
      "One day closer to becoming a real human again!",
      "Nature approves. Your serotonin levels thank you.",
      "Another victory over digital decay!",
      "The sun missed you. No, really, it asked about you.",
      "Fresh air acquired. Brain cells activated.",
      "You're building discipline that 99% of people don't have."
    ];
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  };

  return {
    ...streak,
    verificationModal,
    achievementModal,
    loadStreak,
    verifyPhoto,
    verifyShame,
    skipDay,
    openVerificationModal,
    closeVerificationModal,
    openAchievementModal,
    closeAchievementModal,
    calculateTimeLeft,
    getStreakEmoji,
    getRoast,
    getEncouragement
  };
};

// ==============================
// UI COMPONENTS
// ==============================
export const StreakCounter = () => {
  const { currentStreak, todayVerified, getStreakEmoji } = useStreak();
  const [animatedStreak, setAnimatedStreak] = useState(0);

  useEffect(() => {
    if (currentStreak > animatedStreak) {
      const increment = () => {
        if (animatedStreak < currentStreak) {
          setAnimatedStreak(prev => prev + 1);
        }
      };
      
      const timer = setInterval(increment, 50);
      return () => clearInterval(timer);
    } else if (currentStreak < animatedStreak) {
      setAnimatedStreak(currentStreak);
    }
  }, [currentStreak, animatedStreak]);

  return (
    <>
      <GlobalStreakStyles />
      <div style={styles.streakContainer}>
        <div style={styles.streakHeader}>
          <div style={styles.streakLabel}>
            <span className="streak-flame" style={styles.flameIcon}>
              {getStreakEmoji()}
            </span>
            <span style={styles.labelText}>Current Streak</span>
          </div>
          {todayVerified && (
            <div style={styles.verifiedBadge}>
              <span style={styles.checkIcon}>✓</span>
              <span>Today Verified</span>
            </div>
          )}
        </div>
        
        <div className="streak-counter" style={styles.counter}>
          {animatedStreak}
          <div style={styles.counterDecoration}>
            <div style={styles.ring}></div>
            <div style={styles.ring2}></div>
          </div>
        </div>
        
        <div style={styles.streakFooter}>
          <div style={styles.daysText}>days in a row</div>
          <div style={styles.chainIndicator}>
            {Array.from({ length: Math.min(animatedStreak, 10) }).map((_, i) => (
              <div key={i} className="streak-chain" style={styles.chainLink}></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export const VerificationModal = () => {
  const { verificationModal, closeVerificationModal, verifyPhoto, verifyShame, getRoast, getEncouragement } = useStreak();
  const [photo, setPhoto] = useState(null);
  const [duration, setDuration] = useState(15);
  const [shameMessage, setShameMessage] = useState('');
  const [isPublicShame, setIsPublicShame] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roast] = useState(getRoast());
  const [encouragement] = useState(getEncouragement());

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoSubmit = async () => {
    if (!photo) return;
    
    setIsSubmitting(true);
    try {
      await verifyPhoto(photo, duration);
      closeVerificationModal();
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShameSubmit = async () => {
    if (!shameMessage.trim()) return;
    
    setIsSubmitting(true);
    try {
      await verifyShame(shameMessage, isPublicShame);
      closeVerificationModal();
    } catch (error) {
      console.error('Shame submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!verificationModal.isOpen) return null;

  return (
    <>
      <GlobalStreakStyles />
      <div style={styles.modalOverlay} onClick={closeVerificationModal}>
        <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {verificationModal.mode === 'photo' ? 'Prove Your Adventure' : 'Accept Your Shame'}
              </h2>
              <button style={styles.modalClose} onClick={closeVerificationModal}>
                ×
              </button>
            </div>

            {verificationModal.mode === 'photo' ? (
              <div style={styles.photoVerification}>
                <div style={styles.uploadArea}>
                  {photo ? (
                    <div style={styles.photoPreview}>
                      <img src={photo} alt="Preview" style={styles.previewImage} />
                      <button 
                        style={styles.removePhoto}
                        onClick={() => setPhoto(null)}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label style={styles.uploadLabel}>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoUpload}
                        style={styles.fileInput}
                      />
                      <div style={styles.uploadContent}>
                        <div style={styles.uploadIcon}>📸</div>
                        <div style={styles.uploadText}>
                          <div style={styles.uploadTitle}>Upload Outdoor Proof</div>
                          <div style={styles.uploadSubtitle}>
                            Photo showing grass, nature, or outdoor activity
                          </div>
                        </div>
                      </div>
                    </label>
                  )}
                </div>

                <div style={styles.durationSelector}>
                  <label style={styles.durationLabel}>Minutes spent outside</label>
                  <div style={styles.durationButtons}>
                    {[5, 15, 30, 60, 120].map(mins => (
                      <button
                        key={mins}
                        onClick={() => setDuration(mins)}
                        style={{
                          ...styles.durationButton,
                          ...(duration === mins ? styles.durationButtonActive : {})
                        }}
                      >
                        {mins} min
                      </button>
                    ))}
                  </div>
                </div>

                <div style={styles.encouragementBox}>
                  <div style={styles.encouragementIcon}>💪</div>
                  <div style={styles.encouragementText}>{encouragement}</div>
                </div>

                <button
                  onClick={handlePhotoSubmit}
                  disabled={!photo || isSubmitting}
                  style={styles.submitButton}
                  className={photo ? 'verification-success' : ''}
                >
                  {isSubmitting ? (
                    <div style={styles.loadingSpinner}></div>
                  ) : (
                    'Submit Verification'
                  )}
                </button>
              </div>
            ) : (
              <div style={styles.shameVerification}>
                <div style={styles.roastBox}>
                  <div style={styles.roastIcon}>🤖</div>
                  <div style={styles.roastText}>{roast}</div>
                </div>

                <div style={styles.shameInput}>
                  <label style={styles.shameLabel}>
                    Public Confession (will be displayed on your profile)
                  </label>
                  <textarea
                    value={shameMessage}
                    onChange={(e) => setShameMessage(e.target.value)}
                    placeholder="I failed to touch grass today because..."
                    style={styles.shameTextarea}
                    rows={4}
                    maxLength={200}
                  />
                  <div style={styles.charCount}>
                    {shameMessage.length}/200 characters
                  </div>
                </div>

                <div style={styles.publicToggle}>
                  <label style={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={isPublicShame}
                      onChange={(e) => setIsPublicShame(e.target.checked)}
                      style={styles.toggleInput}
                    />
                    <span style={styles.toggleSlider}></span>
                    <span style={styles.toggleText}>Post to public shame wall</span>
                  </label>
                  <div style={styles.toggleDescription}>
                    Increases accountability but visible to everyone
                  </div>
                </div>

                <div style={styles.consequences}>
                  <div style={styles.consequenceItem}>
                    <div style={styles.consequenceIcon}>📉</div>
                    <div>
                      <div style={styles.consequenceTitle}>Streak Continues (with asterisk)</div>
                      <div style={styles.consequenceDesc}>Marked as shame day on profile</div>
                    </div>
                  </div>
                  <div style={styles.consequenceItem}>
                    <div style={styles.consequenceIcon}>👁️</div>
                    <div>
                      <div style={styles.consequenceTitle}>Public Profile Impact</div>
                      <div style={styles.consequenceDesc}>Visible for 24 hours</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleShameSubmit}
                  disabled={!shameMessage.trim() || isSubmitting}
                  style={{
                    ...styles.submitButton,
                    ...styles.shameSubmit
                  }}
                  className={shameMessage.trim() ? 'shame-pulse' : ''}
                >
                  {isSubmitting ? (
                    <div style={styles.loadingSpinner}></div>
                  ) : (
                    'Accept Public Shame'
                  )}
                </button>
              </div>
            )}

            <div style={styles.modalFooter}>
              <button
                onClick={() => {
                  closeVerificationModal();
                  openVerificationModal(
                    verificationModal.mode === 'photo' ? 'shame' : 'photo'
                  );
                }}
                style={styles.switchButton}
              >
                Switch to {verificationModal.mode === 'photo' ? 'Shame' : 'Photo'} Verification
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ==============================
// STYLES
// ==============================
const styles = {
  streakContainer: {
    background: 'rgba(17, 24, 39, 0.8)',
    borderRadius: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '2rem',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
  },

  streakHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  },

  streakLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },

  flameIcon: {
    fontSize: '1.5rem'
  },

  labelText: {
    fontSize: '0.875rem',
    color: 'var(--gray-400)',
    fontWeight: '500'
  },

  verifiedBadge: {
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    borderRadius: '0.75rem',
    padding: '0.25rem 0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.75rem',
    color: 'var(--grass-400)'
  },

  checkIcon: {
    fontSize: '0.75rem'
  },

  counter: {
    fontSize: '4rem',
    fontWeight: '900',
    lineHeight: '1',
    margin: '1rem 0',
    position: 'relative'
  },

  counterDecoration: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '120%',
    height: '120%',
    zIndex: '-1'
  },

  ring: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    border: '2px solid rgba(34, 197, 94, 0.1)',
    borderRadius: '50%',
    animation: 'ripple 3s ease-out infinite'
  },

  ring2: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    right: '10%',
    bottom: '10%',
    border: '2px solid rgba(34, 197, 94, 0.05)',
    borderRadius: '50%',
    animation: 'ripple 3s ease-out infinite 0.5s'
  },

  streakFooter: {
    marginTop: '1rem'
  },

  daysText: {
    fontSize: '0.875rem',
    color: 'var(--gray-400)',
    marginBottom: '0.5rem'
  },

  chainIndicator: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.25rem',
    height: '0.5rem'
  },

  chainLink: {
    width: '0.75rem',
    height: '0.5rem',
    background: 'linear-gradient(90deg, var(--grass-500), var(--premium-gold))',
    borderRadius: '0.25rem'
  },

  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-out'
  },

  modalContent: {
    width: '100%',
    maxWidth: '500px',
    padding: '1rem'
  },

  modalCard: {
    background: 'rgba(17, 24, 39, 0.95)',
    borderRadius: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '2rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    position: 'relative',
    overflow: 'hidden'
  },

  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem'
  },

  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'white',
    margin: 0
  },

  modalClose: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    width: '2.5rem',
    height: '2.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },

  // Photo Verification Styles
  photoVerification: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },

  uploadArea: {
    border: '2px dashed rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    padding: '2rem',
    transition: 'all 0.3s ease'
  },

  uploadLabel: {
    display: 'block',
    cursor: 'pointer',
    textAlign: 'center'
  },

  fileInput: {
    display: 'none'
  },

  uploadContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },

  uploadIcon: {
    fontSize: '3rem',
    opacity: 0.5
  },

  uploadText: {
    textAlign: 'center'
  },

  uploadTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white',
    marginBottom: '0.25rem'
  },

  uploadSubtitle: {
    fontSize: '0.875rem',
    color: 'var(--gray-400)',
    lineHeight: '1.5'
  },

  photoPreview: {
    position: 'relative',
    borderRadius: '1rem',
    overflow: 'hidden'
  },

  previewImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '1rem'
  },

  removePhoto: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    background: 'rgba(0, 0, 0, 0.7)',
    border: 'none',
    borderRadius: '50%',
    width: '2rem',
    height: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.25rem',
    cursor: 'pointer'
  },

  durationSelector: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },

  durationLabel: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'white'
  },

  durationButtons: {
    display: 'flex',
    gap: '0.5rem',
    overflowX: 'auto',
    paddingBottom: '0.5rem'
  },

  durationButton: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    padding: '0.5rem 1rem',
    color: 'white',
    fontSize: '0.875rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s ease'
  },

  durationButtonActive: {
    background: 'linear-gradient(135deg, var(--grass-500), var(--grass-600))',
    borderColor: 'var(--grass-500)'
  },

  encouragementBox: {
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    borderRadius: '1rem',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },

  encouragementIcon: {
    fontSize: '1.5rem'
  },

  encouragementText: {
    fontSize: '0.875rem',
    color: 'var(--grass-300)',
    lineHeight: '1.5'
  },

  // Shame Verification Styles
  shameVerification: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },

  roastBox: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '1rem',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },

  roastIcon: {
    fontSize: '1.5rem'
  },

  roastText: {
    fontSize: '0.875rem',
    color: 'var(--shame-300)',
    lineHeight: '1.5',
    fontStyle: 'italic'
  },

  shameInput: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },

  shameLabel: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'white'
  },

  shameTextarea: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    padding: '0.875rem',
    color: 'white',
    fontSize: '0.875rem',
    resize: 'none',
    fontFamily: 'inherit'
  },

  charCount: {
    fontSize: '0.75rem',
    color: 'var(--gray-500)',
    textAlign: 'right'
  },

  publicToggle: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },

  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer'
  },

  toggleInput: {
    display: 'none'
  },

  toggleSlider: {
    width: '3rem',
    height: '1.5rem',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '0.75rem',
    position: 'relative',
    transition: 'all 0.3s ease'
  },

  toggleSliderChecked: {
    background: 'linear-gradient(135deg, var(--shame-500), var(--shame-600))'
  },

  toggleText: {
    fontSize: '0.875rem',
    color: 'white'
  },

  toggleDescription: {
    fontSize: '0.75rem',
    color: 'var(--gray-400)',
    marginLeft: '3.75rem'
  },

  consequences: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },

  consequenceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },

  consequenceIcon: {
    fontSize: '1.25rem',
    width: '2.5rem',
    height: '2.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  consequenceTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'white'
  },

  consequenceDesc: {
    fontSize: '0.75rem',
    color: 'var(--gray-400)'
  },

  // Common Styles
  submitButton: {
    width: '100%',
    background: 'linear-gradient(135deg, var(--grass-500), var(--grass-600))',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    padding: '1rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  },

  shameSubmit: {
    background: 'linear-gradient(135deg, var(--shame-500), var(--shame-600))'
  },

  loadingSpinner: {
    width: '1.25rem',
    height: '1.25rem',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    margin: '0 auto',
    animation: 'spin 1s linear infinite'
  },

  modalFooter: {
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
  },

  switchButton: {
    background: 'none',
    border: 'none',
    color: 'var(--grass-400)',
    fontSize: '0.875rem',
    cursor: 'pointer',
    textDecoration: 'underline',
    margin: '0 auto',
    display: 'block'
  }
};

// Add ripple animation
const rippleAnimation = `
  @keyframes ripple {
    0% { 
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 1;
    }
    100% { 
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 0;
    }
  }
`;

// Inject animations
const streakStyleSheet = document.styleSheets[0];
rippleAnimation.split('}').forEach(rule => {
  if (rule.trim()) streakStyleSheet.insertRule(rule + '}', streakStyleSheet.cssRules.length);
});

export default StreakCounter;