import React, { useState, useEffect, useRef } from 'react';
import './VerificationModal.css';

const VerificationModal = ({ isOpen, onClose, onVerify, user, streakData }) => {
  const [verificationMethod, setVerificationMethod] = useState('photo');
  const [photo, setPhoto] = useState(null);
  const [duration, setDuration] = useState(15);
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [verificationScore, setVerificationScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60); // 24 hours in seconds
  const modalRef = useRef(null);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const progressRingRef = useRef(null);

  const verificationMethods = [
    { id: 'photo', name: 'Photo Proof', icon: '📸', color: '#22c55e' },
    { id: 'video', name: 'Video Proof', icon: '🎥', color: '#3b82f6' },
    { id: 'location', name: 'Location Check', icon: '📍', color: '#8b5cf6' },
    { id: 'witness', name: 'Witness', icon: '👥', color: '#ec4899' }
  ];

  const durationOptions = [5, 15, 30, 60, 120];
  const activityTypes = [
    { id: 'walk', name: 'Walk', icon: '🚶', score: 10 },
    { id: 'run', name: 'Run', icon: '🏃', score: 20 },
    { id: 'hike', name: 'Hike', icon: '🥾', score: 30 },
    { id: 'sports', name: 'Sports', icon: '⚽', score: 25 },
    { id: 'gardening', name: 'Gardening', icon: '🌱', score: 15 },
    { id: 'meditation', name: 'Meditation', icon: '🧘', score: 10 }
  ];

  const requirements = [
    { text: 'Clear view of outdoor environment', met: false },
    { text: 'Visible greenery/nature', met: false },
    { text: 'Timestamp verification', met: false },
    { text: 'Geolocation data (optional)', met: false },
    { text: 'No previous photos used', met: true }
  ];

  useEffect(() => {
    if (isOpen) {
      startCountdown();
      initProgressRing();
      
      // Request camera permission
      requestCameraPermission();
      
      // Simulate location detection
      simulateLocationDetection();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCountdown = () => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  };

  const initProgressRing = () => {
    if (progressRingRef.current) {
      const ring = progressRingRef.current;
      const circumference = 2 * Math.PI * 45; // 45 is the radius
      
      ring.style.strokeDasharray = `${circumference} ${circumference}`;
      ring.style.strokeDashoffset = circumference;
      
      // Animate progress
      const progress = (timeRemaining / (24 * 60 * 60)) * 100;
      const offset = circumference - (progress / 100) * circumference;
      ring.style.strokeDashoffset = offset;
    }
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
      }
    } catch (err) {
    }
  };

  const simulateLocationDetection = () => {
    setTimeout(() => {
      setLocation({
        lat: 37.7749,
        lng: -122.4194,
        address: 'San Francisco, CA',
        accuracy: 'High'
      });
    }, 1000);
  };

  const capturePhoto = () => {
    if (!webcamRef.current) return;

    setIsCapturing(true);
    
    const video = webcamRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      const photoUrl = URL.createObjectURL(blob);
      setPhoto(photoUrl);
      setIsCapturing(false);
      setShowPreview(true);
      
      // Analyze photo
      analyzePhoto(blob);
    }, 'image/jpeg');
  };

  const analyzePhoto = (blob) => {
    // Simulate AI analysis
    setTimeout(() => {
      const score = Math.floor(Math.random() * 30) + 70; // 70-100 score
      setVerificationScore(score);
      
      // Update requirements
      requirements.forEach((req, index) => {
        setTimeout(() => {
          req.met = Math.random() > 0.3; // 70% chance of meeting requirement
          // Force re-render
        }, index * 300);
      });
    }, 1500);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhoto(reader.result);
          setShowPreview(true);
          analyzePhoto(file);
        };
        reader.readAsDataURL(file);
      }
    }, 100);
  };

  const stopCamera = () => {
    if (webcamRef.current && webcamRef.current.srcObject) {
      const stream = webcamRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const handleVerify = async () => {
    if (!photo && verificationMethod === 'photo') {
      alert('Please provide verification proof');
      return;
    }

    setIsSubmitting(true);

    // Create verification data
    const verificationData = {
      method: verificationMethod,
      proof: photo,
      duration,
      notes,
      location,
      score: verificationScore,
      timestamp: new Date().toISOString(),
      user: {
        id: user?.id,
        name: user?.displayName
      },
      streak: streakData?.currentStreak || 0
    };

    // Simulate API call with progress
    await simulateVerification(verificationData);

    // Call parent handler
    if (onVerify) {
      onVerify(verificationData);
    }

    // Close modal after delay
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 2000);
  };

  const simulateVerification = (data) => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // Trigger success animation
          triggerSuccessAnimation();
          resolve();
        }
      }, 100);
    });
  };

  const triggerSuccessAnimation = () => {
    const modal = modalRef.current;
    if (!modal) return;

    // Add success class
    modal.classList.add('verification-success');

    // Create success particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'success-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.backgroundColor = verificationMethods.find(m => m.id === verificationMethod)?.color;
      modal.appendChild(particle);

      setTimeout(() => particle.remove(), 1000);
    }

    // Play success sound
    playSuccessSound();
  };

  const playSuccessSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/287/287-preview.mp3');
    audio.volume = 0.2;
    audio.play().catch(() => {});
  };

  const formatTimeRemaining = () => {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getVerificationStatus = () => {
    if (verificationScore >= 90) return 'Excellent';
    if (verificationScore >= 75) return 'Good';
    if (verificationScore >= 60) return 'Fair';
    return 'Poor';
  };

  return (
    <div className={`verification-modal-overlay ${isOpen ? 'open' : ''}`}>
      <div ref={modalRef} className="verification-modal">
        {/* Header with Countdown */}
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">🌱</div>
            <div>
              <h2 className="header-title">Verify Your Grass Touch</h2>
              <p className="header-subtitle">Prove your outdoor discipline</p>
            </div>
          </div>
          
          <div className="header-countdown">
            <div className="countdown-timer">
              <svg className="countdown-svg" width="100" height="100">
                <circle
                  ref={progressRingRef}
                  className="countdown-ring"
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <text x="50" y="55" textAnchor="middle" className="countdown-text">
                  {formatTimeRemaining()}
                </text>
              </svg>
              <div className="countdown-label">Time Remaining</div>
            </div>
          </div>
        </div>

        <div className="modal-content">
          {/* Left Column - Verification Method */}
          <div className="content-left">
            {/* Method Selection */}
            <div className="method-section">
              <h3 className="section-title">Verification Method</h3>
              <div className="method-grid">
                {verificationMethods.map(method => (
                  <button
                    key={method.id}
                    className={`method-btn ${verificationMethod === method.id ? 'selected' : ''}`}
                    onClick={() => setVerificationMethod(method.id)}
                    style={{ '--method-color': method.color }}
                  >
                    <div className="method-icon">{method.icon}</div>
                    <div className="method-name">{method.name}</div>
                    <div className="method-badge">AI Verified</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Proof Capture */}
            <div className="capture-section">
              {verificationMethod === 'photo' ? (
                <>
                  {!showPreview ? (
                    <div className="capture-options">
                      {/* Camera Capture */}
                      <div className="camera-capture">
                        <div className="camera-header">
                          <h4 className="camera-title">Live Camera</h4>
                          <div className="camera-indicator">
                            <div className="indicator-dot"></div>
                            Live
                          </div>
                        </div>
                        
                        <div className="camera-preview">
                          <video
                            ref={webcamRef}
                            autoPlay
                            playsInline
                            className="camera-video"
                          />
                          <div className="camera-overlay">
                            <div className="overlay-grid"></div>
                            <div className="overlay-circle"></div>
                          </div>
                        </div>
                        
                        <div className="camera-controls">
                          <button className="control-btn capture" onClick={capturePhoto}>
                            <span className="btn-icon">📸</span>
                            Capture Photo
                          </button>
                          <button className="control-btn flip">
                            <span className="btn-icon">🔄</span>
                            Flip Camera
                          </button>
                        </div>
                      </div>

                      {/* Upload Option */}
                      <div className="upload-option">
                        <div className="upload-divider">
                          <span className="divider-text">OR</span>
                        </div>
                        
                        <label className="upload-label">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="upload-input"
                          />
                          <div className="upload-area">
                            <div className="upload-icon">📁</div>
                            <div className="upload-text">
                              Upload from device
                            </div>
                            <div className="upload-subtext">
                              JPG, PNG up to 10MB
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="photo-preview">
                      <div className="preview-header">
                        <h4 className="preview-title">Photo Preview</h4>
                        <button 
                          className="preview-retake"
                          onClick={() => setShowPreview(false)}
                        >
                          <span className="retake-icon">🔄</span>
                          Retake
                        </button>
                      </div>
                      
                      <div className="preview-image">
                        <img src={photo} alt="Verification preview" />
                        <div className="preview-overlay">
                          <div className="overlay-badge verified">
                            <span className="badge-icon">✅</span>
                            AI Verified
                          </div>
                        </div>
                      </div>
                      
                      {uploadProgress < 100 && (
                        <div className="upload-progress">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <div className="progress-text">
                            Analyzing... {uploadProgress}%
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : verificationMethod === 'location' ? (
                <div className="location-verification">
                  <div className="location-header">
                    <h4 className="location-title">Location Check</h4>
                    <div className="location-accuracy">High Accuracy</div>
                  </div>
                  
                  <div className="location-map">
                    <div className="map-placeholder">
                      <div className="map-marker">
                        <span className="marker-icon">📍</span>
                      </div>
                      <div className="map-grid"></div>
                    </div>
                  </div>
                  
                  <div className="location-details">
                    <div className="detail-item">
                      <span className="detail-label">Detected Location:</span>
                      <span className="detail-value">{location?.address || 'Detecting...'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Accuracy:</span>
                      <span className="detail-value">{location?.accuracy || 'High'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Timestamp:</span>
                      <span className="detail-value">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="other-verification">
                  <div className="other-placeholder">
                    <div className="placeholder-icon">
                      {verificationMethods.find(m => m.id === verificationMethod)?.icon}
                    </div>
                    <div className="placeholder-text">
                      {verificationMethods.find(m => m.id === verificationMethod)?.name} Verification
                    </div>
                    <div className="placeholder-subtext">
                      This verification method is coming soon
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Activity Details */}
            <div className="activity-section">
              <h3 className="section-title">Activity Details</h3>
              
              <div className="duration-selector">
                <label className="duration-label">Duration (minutes)</label>
                <div className="duration-buttons">
                  {durationOptions.map(minutes => (
                    <button
                      key={minutes}
                      className={`duration-btn ${duration === minutes ? 'selected' : ''}`}
                      onClick={() => setDuration(minutes)}
                    >
                      {minutes} min
                    </button>
                  ))}
                </div>
              </div>

              <div className="activity-type">
                <label className="activity-label">Activity Type</label>
                <div className="activity-grid">
                  {activityTypes.map(activity => (
                    <button
                      key={activity.id}
                      className="activity-btn"
                      onClick={() => setVerificationScore(activity.score)}
                    >
                      <span className="activity-icon">{activity.icon}</span>
                      <span className="activity-name">{activity.name}</span>
                      <span className="activity-score">+{activity.score} pts</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="notes-input">
                <label className="notes-label">Additional Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe your outdoor activity..."
                  className="notes-textarea"
                  maxLength={200}
                />
                <div className="notes-counter">{notes.length}/200</div>
              </div>
            </div>
          </div>

          {/* Right Column - Verification Analysis */}
          <div className="content-right">
            {/* Verification Score */}
            <div className="score-section">
              <div className="score-header">
                <h3 className="score-title">Verification Score</h3>
                <div className="score-value">
                  <span className="value-number">{verificationScore}</span>
                  <span className="value-outof">/100</span>
                </div>
              </div>
              
              <div className="score-breakdown">
                <div className="breakdown-item">
                  <span className="breakdown-label">Photo Quality</span>
                  <div className="breakdown-bar">
                    <div className="bar-fill" style={{ width: '85%' }}></div>
                  </div>
                  <span className="breakdown-score">85</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Location Match</span>
                  <div className="breakdown-bar">
                    <div className="bar-fill" style={{ width: '92%' }}></div>
                  </div>
                  <span className="breakdown-score">92</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Time Verification</span>
                  <div className="breakdown-bar">
                    <div className="bar-fill" style={{ width: '100%' }}></div>
                  </div>
                  <span className="breakdown-score">100</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Activity Level</span>
                  <div className="breakdown-bar">
                    <div className="bar-fill" style={{ width: '78%' }}></div>
                  </div>
                  <span className="breakdown-score">78</span>
                </div>
              </div>

              <div className="score-status">
                <div className={`status-badge ${getVerificationStatus().toLowerCase()}`}>
                  {getVerificationStatus()} Verification
                </div>
                <div className="status-desc">
                  {verificationScore >= 90 ? 'Excellent proof quality!' :
                   verificationScore >= 75 ? 'Good verification' :
                   verificationScore >= 60 ? 'Acceptable proof' :
                   'Needs improvement'}
                </div>
              </div>
            </div>

            {/* Requirements Checklist */}
            <div className="requirements-section">
              <h3 className="section-title">Verification Requirements</h3>
              
              <div className="requirements-list">
                {requirements.map((req, index) => (
                  <div key={index} className="requirement-item">
                    <div className={`requirement-check ${req.met ? 'met' : 'pending'}`}>
                      {req.met ? '✓' : '○'}
                    </div>
                    <div className="requirement-text">{req.text}</div>
                    <div className="requirement-status">
                      {req.met ? 'Met' : 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Streak Impact */}
            <div className="impact-section">
              <h3 className="section-title">Streak Impact</h3>
              
              <div className="impact-cards">
                <div className="impact-card positive">
                  <div className="impact-icon">📈</div>
                  <div className="impact-content">
                    <div className="impact-value">+1 Day</div>
                    <div className="impact-label">Streak Extended</div>
                  </div>
                </div>
                
                <div className="impact-card bonus">
                  <div className="impact-icon">⭐</div>
                  <div className="impact-content">
                    <div className="impact-value">+{verificationScore} XP</div>
                    <div className="impact-label">Verification Bonus</div>
                  </div>
                </div>
                
                <div className="impact-card multiplier">
                  <div className="impact-icon">⚡</div>
                  <div className="impact-content">
                    <div className="impact-value">{verificationScore >= 90 ? '2.0x' : '1.5x'}</div>
                    <div className="impact-label">Score Multiplier</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="analysis-section">
              <h3 className="section-title">
                <span className="title-icon">🤖</span>
                AI Analysis
              </h3>
              
              <div className="analysis-content">
                <div className="analysis-text">
                  {verificationScore >= 90 ? 
                    "✅ Excellent verification! Clear outdoor environment with natural elements. Timestamp and location verified." :
                    verificationScore >= 75 ?
                    "✅ Good verification. Outdoor elements visible. Consider adding more nature elements for higher score." :
                    "⚠️ Acceptable verification. Some requirements not fully met. Try capturing more outdoor context."}
                </div>
                
                <div className="analysis-tips">
                  <div className="tip-item">
                    <span className="tip-icon">💡</span>
                    <span className="tip-text">Include more greenery in frame for higher score</span>
                  </div>
                  <div className="tip-item">
                    <span className="tip-icon">💡</span>
                    <span className="tip-text">Enable location services for automatic verification</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button className="action-btn cancel" onClick={onClose}>
            <span className="btn-icon">←</span>
            Cancel Verification
          </button>
          
          <div className="action-group">
            <button className="action-btn save">
              <span className="btn-icon">💾</span>
              Save Draft
            </button>
            
            <button
              className={`action-btn verify ${isSubmitting ? 'submitting' : ''}`}
              onClick={handleVerify}
              disabled={isSubmitting || (!photo && verificationMethod === 'photo') || verificationScore < 60}
              style={{ 
                '--method-color': verificationMethods.find(m => m.id === verificationMethod)?.color 
              }}
            >
              <span className="btn-icon">
                {isSubmitting ? '⏳' : '✅'}
              </span>
              {isSubmitting ? 'Verifying...' : 'Submit Verification'}
              {verificationScore > 0 && (
                <span className="verify-score"> ({verificationScore} pts)</span>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="footer-content">
            <div className="footer-info">
              <div className="info-icon">📊</div>
              <div className="info-text">
                <strong>Verification Stats:</strong> 
                Average score: 82 • Success rate: 94% • AI accuracy: 99.2%
              </div>
            </div>
            
            <div className="footer-tools">
              <button className="tool-btn">
                <span className="tool-icon">🔧</span>
                Advanced Settings
              </button>
              <button className="tool-btn">
                <span className="tool-icon">📋</span>
                View Guidelines
              </button>
              <button className="tool-btn premium">
                <span className="tool-icon">✨</span>
                Pro Verification
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;