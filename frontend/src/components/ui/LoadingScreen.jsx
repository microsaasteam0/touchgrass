import React from 'react';

const LoadingScreen = ({ fullScreen = false }) => {
  return (
    <div className={`loading-screen ${fullScreen ? 'full-screen' : ''}`}>
      <style>{`
        .loading-screen {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #050505 0%, #0a0a0a 100%);
          position: relative;
          overflow: hidden;
        }

        .loading-screen.full-screen {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 9999 !important;
        }

        /* Force full viewport coverage */
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
        }

        /* Remove any potential white background */
        .loading-screen.full-screen,
        .loading-screen {
          background: linear-gradient(135deg, #050505 0%, #0a0a0a 100%) !important;
        }

        /* Ensure no parent constraints */
        .loading-screen * {
          box-sizing: border-box;
        }

        /* Animated Background Elements */
        .loading-screen::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(0, 229, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 10%, rgba(127, 0, 255, 0.1) 0%, transparent 50%);
          animation: pulseBackground 8s ease-in-out infinite;
        }

        @keyframes pulseBackground {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        /* Floating Grass Blades */
        .grass-blade {
          position: absolute;
          width: 40px;
          height: 120px;
          background: linear-gradient(to top, transparent 30%, #22c55e 100%);
          clip-path: polygon(50% 0%, 40% 100%, 60% 100%);
          opacity: 0.4;
          animation: floatGrass 15s linear infinite;
          filter: drop-shadow(0 0 10px rgba(34, 197, 94, 0.3));
        }

        /* Grass blade positions */
        .grass-blade:nth-child(1) { left: 5%; bottom: -120px; animation-delay: 0s; transform: rotate(10deg); }
        .grass-blade:nth-child(2) { left: 15%; bottom: -120px; animation-delay: 1s; transform: rotate(-5deg); }
        .grass-blade:nth-child(3) { left: 25%; bottom: -120px; animation-delay: 2s; transform: rotate(15deg); }
        .grass-blade:nth-child(4) { left: 35%; bottom: -120px; animation-delay: 3s; transform: rotate(-10deg); }
        .grass-blade:nth-child(5) { left: 55%; bottom: -120px; animation-delay: 4s; transform: rotate(5deg); }
        .grass-blade:nth-child(6) { left: 65%; bottom: -120px; animation-delay: 5s; transform: rotate(-15deg); }
        .grass-blade:nth-child(7) { left: 75%; bottom: -120px; animation-delay: 6s; transform: rotate(8deg); }
        .grass-blade:nth-child(8) { left: 85%; bottom: -120px; animation-delay: 7s; transform: rotate(-8deg); }
        .grass-blade:nth-child(9) { left: 95%; bottom: -120px; animation-delay: 8s; transform: rotate(12deg); }
        .grass-blade:nth-child(10) { left: 45%; bottom: -120px; animation-delay: 9s; transform: rotate(-12deg); }

        @keyframes floatGrass {
          0% {
            transform: translateY(0) rotate(var(--rotation)) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-120vh) rotate(calc(var(--rotation) + 20deg)) scale(1.2);
            opacity: 0;
          }
        }

        /* Loading Content */
        .loading-content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 3rem;
          backdrop-filter: blur(20px);
          background: rgba(15, 23, 42, 0.85);
          border-radius: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.4),
            0 0 80px rgba(34, 197, 94, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          min-width: 320px;
          min-height: 320px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 2rem;
        }

        /* Logo Animation */
        .loading-logo {
          position: relative;
          margin-bottom: 2.5rem;
        }

        .logo-icon {
          font-size: 5rem;
          animation: bounceLogo 3s ease-in-out infinite;
          filter: 
            drop-shadow(0 0 25px rgba(34, 197, 94, 0.6))
            drop-shadow(0 0 50px rgba(0, 229, 255, 0.3));
        }

        @keyframes bounceLogo {
          0%, 100% {
            transform: translateY(0) scale(1) rotate(0deg);
          }
          25% {
            transform: translateY(-15px) scale(1.08) rotate(8deg);
          }
          50% {
            transform: translateY(0) scale(1) rotate(0deg);
          }
          75% {
            transform: translateY(-8px) scale(1.04) rotate(-8deg);
          }
        }

        .logo-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: radial-gradient(circle, 
            rgba(34, 197, 94, 0.3) 0%,
            rgba(0, 229, 255, 0.2) 30%,
            transparent 70%);
          animation: pulseGlow 2s ease-in-out infinite;
          z-index: -1;
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.9;
            transform: translate(-50%, -50%) scale(1.15);
          }
        }

        /* Spinner */
        .loading-spinner {
          position: relative;
          width: 90px;
          height: 90px;
          margin-bottom: 2.5rem;
        }

        .spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-top: 3px solid #22c55e;
          border-right: 3px solid #00E5FF;
          border-bottom: 3px solid #7F00FF;
          border-radius: 50%;
          animation: spinRing 1.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
          filter: drop-shadow(0 0 15px rgba(34, 197, 94, 0.4));
        }

        @keyframes spinRing {
          0% {
            transform: rotate(0deg);
            border-top-color: #22c55e;
            border-right-color: #00E5FF;
          }
          33% {
            border-top-color: #00E5FF;
            border-right-color: #7F00FF;
          }
          66% {
            border-top-color: #7F00FF;
            border-right-color: #22c55e;
          }
          100% {
            transform: rotate(360deg);
            border-top-color: #22c55e;
            border-right-color: #00E5FF;
          }
        }

        .spinner-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #22c55e, #00E5FF);
          border-radius: 50%;
          animation: pulseDot 2s ease-in-out infinite;
          box-shadow: 
            0 0 25px rgba(34, 197, 94, 0.6),
            0 0 50px rgba(0, 229, 255, 0.4),
            inset 0 0 10px rgba(255, 255, 255, 0.1);
        }

        @keyframes pulseDot {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 
              0 0 25px rgba(34, 197, 94, 0.6),
              0 0 50px rgba(0, 229, 255, 0.4);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.3);
            box-shadow: 
              0 0 40px rgba(34, 197, 94, 0.9),
              0 0 80px rgba(0, 229, 255, 0.6);
          }
        }

        /* Text Animation */
        .loading-text {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .text-line {
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #22c55e, #00E5FF, #7F00FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .loading-dots {
          display: flex;
          gap: 0.5rem;
        }

        .loading-dots .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #22c55e, #00E5FF);
          animation: bounceDots 1.4s ease-in-out infinite;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        }

        .loading-dots .dot:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots .dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounceDots {
          0%, 80%, 100% {
            transform: scale(0.5);
            opacity: 0.6;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        /* Subtext */
        .loading-subtext {
          font-size: 1rem;
          color: #a1a1aa;
          font-weight: 400;
          letter-spacing: 0.05em;
          max-width: 240px;
          text-align: center;
          animation: fadeInOut 4s ease-in-out infinite;
          margin-top: 0.5rem;
          line-height: 1.6;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        @keyframes fadeInOut {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        /* Progress Bar */
        .loading-progress {
          width: 240px;
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 3px;
          margin-top: 2rem;
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .progress-fill {
          position: absolute;
          top: 0;
          left: -30%;
          height: 100%;
          width: 30%;
          background: linear-gradient(90deg, 
            transparent,
            #22c55e,
            #00E5FF,
            #7F00FF,
            transparent);
          border-radius: 3px;
          animation: progressMove 2.5s ease-in-out infinite;
          filter: blur(1px);
        }

        @keyframes progressMove {
          0% {
            left: -30%;
            width: 30%;
          }
          50% {
            width: 50%;
          }
          100% {
            left: 100%;
            width: 30%;
          }
        }

        /* Floating Particles */
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          animation: floatParticle 10s linear infinite;
          z-index: 1;
          filter: blur(1px);
        }

        .particle:nth-child(1) {
          top: 10%; left: 10%; 
          background: rgba(34, 197, 94, 0.5);
          animation-delay: 0s;
        }
        .particle:nth-child(2) {
          top: 20%; left: 80%; 
          background: rgba(0, 229, 255, 0.5);
          animation-delay: 1s;
        }
        .particle:nth-child(3) {
          top: 60%; left: 20%; 
          background: rgba(127, 0, 255, 0.5);
          animation-delay: 2s;
        }
        .particle:nth-child(4) {
          top: 70%; left: 70%; 
          background: rgba(34, 197, 94, 0.5);
          animation-delay: 3s;
        }
        .particle:nth-child(5) {
          top: 30%; left: 40%; 
          background: rgba(0, 229, 255, 0.5);
          animation-delay: 4s;
        }
        .particle:nth-child(6) {
          top: 80%; left: 50%; 
          background: rgba(127, 0, 255, 0.5);
          animation-delay: 5s;
        }

        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-150px) translateX(100px) scale(1.8);
            opacity: 0;
          }
        }

        /* Add shimmer effect to whole container */
        .loading-content::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, 
            transparent, 
            rgba(34, 197, 94, 0.15), 
            rgba(0, 229, 255, 0.15), 
            rgba(127, 0, 255, 0.15), 
            transparent);
          border-radius: 2.5rem;
          z-index: -1;
          animation: shimmer 4s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.4;
          }
        }

        /* Star field effect */
        .star {
          position: absolute;
          background-color: white;
          border-radius: 50%;
          animation: twinkle 3s infinite;
          opacity: 0;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .loading-content {
            padding: 2rem;
            min-width: 280px;
            min-height: 280px;
            border-radius: 2rem;
            margin: 1rem;
          }

          .logo-icon {
            font-size: 4rem;
          }

          .text-line {
            font-size: 1.25rem;
          }

          .loading-subtext {
            font-size: 0.875rem;
          }

          .loading-progress {
            width: 200px;
          }

          .grass-blade {
            width: 30px;
            height: 90px;
          }
        }

        @media (max-width: 480px) {
          .loading-content {
            padding: 1.5rem;
            min-width: 250px;
            min-height: 250px;
            border-radius: 1.75rem;
          }

          .logo-icon {
            font-size: 3.5rem;
          }

          .text-line {
            font-size: 1.125rem;
          }
        }

        /* Ensure no white background anywhere */
        body {
          background: #050505 !important;
        }
      `}</style>

      {/* Floating Grass Blades */}
      {[...Array(10)].map((_, i) => (
        <div key={`grass-${i}`} className="grass-blade" />
      ))}

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <div key={`particle-${i}`} className="particle" />
      ))}

      {/* Add some twinkling stars */}
      {[...Array(8)].map((_, i) => {
        const size = Math.random() * 3 + 1;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 5;
        return (
          <div 
            key={`star-${i}`}
            className="star"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `${top}%`,
              animationDelay: `${delay}s`
            }}
          />
        );
      })}

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
          <div className="text-line">Touching Grass</div>
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
        
        <div className="loading-subtext">
          Growing your discipline ecosystem...
        </div>

        <div className="loading-progress">
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;