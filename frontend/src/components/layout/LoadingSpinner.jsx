import { motion } from 'framer-motion';
import { Sparkles, Zap, Target, Trophy } from 'lucide-react';

const LoadingSpinner = ({ 
  type = 'default',
  size = 'md',
  text,
  fullscreen = false,
  logo = true 
}) => {
  // Size configuration
  const sizeConfig = {
    xs: { container: '32px', icon: '12px', text: '0.75rem' },
    sm: { container: '48px', icon: '16px', text: '0.875rem' },
    md: { container: '64px', icon: '20px', text: '1rem' },
    lg: { container: '80px', icon: '24px', text: '1.125rem' },
    xl: { container: '96px', icon: '32px', text: '1.25rem' }
  };

  // Type configuration
  const typeConfig = {
    default: {
      color: '#22c55e',
      gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
      icon: <Sparkles style={{ width: sizeConfig[size].icon, height: sizeConfig[size].icon }} />
    },
    premium: {
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      icon: <Trophy style={{ width: sizeConfig[size].icon, height: sizeConfig[size].icon }} />
    },
    action: {
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      icon: <Zap style={{ width: sizeConfig[size].icon, height: sizeConfig[size].icon }} />
    },
    success: {
      color: '#22c55e',
      gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
      icon: <Target style={{ width: sizeConfig[size].icon, height: sizeConfig[size].icon }} />
    }
  };

  const config = typeConfig[type] || typeConfig.default;
  const sizeStyle = sizeConfig[size];

  // CSS Styles
  const styles = {
    spinnerContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    mainSpinner: {
      position: 'relative',
      width: sizeStyle.container,
      height: sizeStyle.container
    },
    outerRing: {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      border: '2px solid transparent',
      background: `conic-gradient(from 0deg, transparent, ${config.color}, transparent)`,
      mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), white 0)',
      WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), white 0)'
    },
    middleRing: {
      position: 'absolute',
      inset: '8px',
      borderRadius: '50%',
      border: '2px solid transparent',
      background: `conic-gradient(from 180deg, transparent, ${config.color}88, transparent)`,
      mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), white 0)',
      WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), white 0)'
    },
    innerRing: {
      position: 'absolute',
      inset: '16px',
      borderRadius: '50%',
      border: '2px solid transparent',
      background: `conic-gradient(from 90deg, transparent, ${config.color}66, transparent)`,
      mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), white 0)',
      WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), white 0)'
    },
    centerIcon: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    iconContainer: {
      width: '50%',
      height: '50%',
      borderRadius: '50%',
      background: config.gradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
    },
    particle: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: config.gradient
    },
    loadingText: {
      marginTop: '1.5rem',
      textAlign: 'center',
      fontSize: sizeStyle.text,
      color: '#9ca3af'
    },
    dotsContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
      marginTop: '0.5rem'
    },
    dot: {
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      background: 'currentColor'
    },
    fullscreenContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #111827, #1f2937, #000000)'
    },
    backgroundParticle: {
      position: 'absolute',
      width: '1px',
      height: '8rem',
      background: 'linear-gradient(to bottom, transparent, rgba(34, 197, 94, 0.3), transparent)'
    },
    logoContainer: {
      marginBottom: '2rem',
      display: 'flex',
      justifyContent: 'center'
    },
    logo: {
      width: '80px',
      height: '80px',
      borderRadius: '20px',
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 0 30px rgba(34, 197, 94, 0.3)'
    },
    progressBar: {
      width: '16rem',
      height: '4px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '9999px',
      overflow: 'hidden',
      margin: '0 auto'
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #22c55e, #16a34a)',
      borderRadius: '9999px'
    },
    bottomText: {
      position: 'absolute',
      bottom: '2rem',
      textAlign: 'center',
      fontSize: '0.75rem',
      color: '#6b7280'
    },
    spinnerContent: {
      position: 'relative',
      zIndex: 10
    }
  };

  const SpinnerContent = () => (
    <div style={styles.spinnerContainer}>
      {/* Main Spinner */}
      <div style={styles.mainSpinner}>
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          style={styles.outerRing}
        />

        {/* Middle ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
          style={styles.middleRing}
        />

        {/* Inner ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
          style={styles.innerRing}
        />

        {/* Center icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={styles.centerIcon}
        >
          <div style={styles.iconContainer}>
            <div style={{ color: 'white' }}>
              {config.icon}
            </div>
          </div>
        </motion.div>

        {/* Floating particles */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{
              rotate: 360,
              x: [0, Math.cos(i * 90) * (parseInt(sizeStyle.container) / 2)],
              y: [0, Math.sin(i * 90) * (parseInt(sizeStyle.container) / 2)]
            }}
            transition={{
              rotate: {
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              },
              x: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              },
              y: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%'
            }}
          >
            <motion.div
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
              style={styles.particle}
            />
          </motion.div>
        ))}
      </div>

      {/* Loading text */}
      {text && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={styles.loadingText}
        >
          <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>{text}</div>
          
          {/* Animated dots */}
          <div style={styles.dotsContainer}>
            {[0, 1, 2].map((dot) => (
              <motion.div
                key={dot}
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: dot * 0.2
                }}
                style={styles.dot}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={styles.fullscreenContainer}
      >
        {/* Animated background */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.sin(i) * 100, 0],
                opacity: [0, 0.1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                ...styles.backgroundParticle,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div style={styles.spinnerContent}>
          {logo && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={styles.logoContainer}
            >
              <div style={styles.logo}>
                <span style={{ fontSize: '2.5rem' }}>🌱</span>
              </div>
            </motion.div>
          )}
          
          <SpinnerContent />
          
          {/* Loading message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ marginTop: '3rem', textAlign: 'center' }}
          >
            <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>
              Building your discipline experience
            </div>
            
            {/* Progress bar */}
            <div style={styles.progressBar}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={styles.progressFill}
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          style={styles.bottomText}
        >
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Powered by behavioral psychology • 124,857+ users
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <SpinnerContent />
    </div>
  );
};

// Specialized loading components
export const PageLoading = () => (
  <LoadingSpinner
    type="premium"
    size="lg"
    text="Loading your discipline dashboard"
    fullscreen
    logo
  />
);

export const CardLoading = ({ count = 1 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        style={{
          background: 'linear-gradient(135deg, #111827, #1f2937)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{
              height: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '4px',
              animation: 'pulse 1.5s ease-in-out infinite',
              width: '75%'
            }} />
            <div style={{
              height: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '4px',
              animation: 'pulse 1.5s ease-in-out infinite',
              width: '50%'
            }} />
          </div>
        </div>
        <div style={{ 
          marginTop: '1rem', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem'
        }}>
          <div style={{
            height: '32px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
          <div style={{
            height: '32px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
          <div style={{
            height: '32px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
        </div>
      </motion.div>
    ))}
  </div>
);

export const ButtonLoading = ({ variant = 'primary' }) => {
  const variants = {
    primary: 'linear-gradient(90deg, #22c55e, #16a34a)',
    secondary: 'rgba(255, 255, 255, 0.05)',
    premium: 'linear-gradient(90deg, #f59e0b, #d97706)'
  };

  return (
    <motion.div
      animate={{ 
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{
        padding: '0.75rem 1.5rem',
        borderRadius: '12px',
        background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent), ${variants[variant]}`,
        backgroundSize: '200% 100%'
      }}
    />
  );
};

export const ChartLoading = () => (
  <div style={{
    position: 'relative',
    height: '16rem',
    background: 'linear-gradient(135deg, #111827, #1f2937)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '1.5rem'
  }}>
    <div style={{
      position: 'absolute',
      inset: '1.5rem',
      display: 'flex',
      alignItems: 'flex-end',
      gap: '4px'
    }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            height: ['20%', `${20 + Math.random() * 60}%`, '20%']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
          style={{
            flex: 1,
            background: 'linear-gradient(to top, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px'
          }}
        />
      ))}
    </div>
    <div style={{
      position: 'absolute',
      bottom: '1.5rem',
      left: '1.5rem',
      right: '1.5rem',
      height: '1px',
      background: 'rgba(255, 255, 255, 0.1)'
    }} />
    <div style={{
      position: 'absolute',
      left: '1.5rem',
      top: '1.5rem',
      right: '1.5rem',
      height: '1px',
      background: 'rgba(255, 255, 255, 0.1)'
    }} />
  </div>
);

export default LoadingSpinner;