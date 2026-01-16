import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ fullScreen = false }) => {
  return (
    <div className={`loading-screen ${fullScreen ? 'full-screen' : ''}`}>
      <div className="loading-content">
        <div className="loading-logo">
          <div className="logo-icon">🌱</div>
          <div className="logo-glow"></div>
        </div>
        
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-dot"></div>
        </div>
        
        <div className="loading-text">
          <div className="text-line">Loading TouchGrass</div>
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
        
        <div className="loading-subtext">
          Building your accountability experience...
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;