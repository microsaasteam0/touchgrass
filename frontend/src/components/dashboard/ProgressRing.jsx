import { useState, useEffect, useRef } from 'react'
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion'
import { 
  Trophy, Target, Zap, Star, 
  CheckCircle, Award, Crown, TrendingUp
} from 'lucide-react'
import { useInView } from 'react-intersection-observer'

const ProgressRing = ({ 
  value = 75,
  maxValue = 100,
  size = 200,
  strokeWidth = 12,
  label,
  sublabel,
  color = 'grass',
  showAnimation = true,
  loading = false,
  milestone = null,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const controls = useAnimation()
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  const progressRef = useRef(0)
  const animationRef = useRef()

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (value / maxValue) * 100
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const colorConfig = {
    grass: {
      stroke: '#22c55e',
      gradient: 'from-grass-400 to-grass-600',
      glow: 'shadow-grass-500/30',
      bg: 'bg-grass-500/10'
    },
    premium: {
      stroke: '#fbbf24',
      gradient: 'from-premium-gold to-yellow-600',
      glow: 'shadow-premium-gold/30',
      bg: 'bg-premium-gold/10'
    },
    blue: {
      stroke: '#60a5fa',
      gradient: 'from-blue-400 to-blue-600',
      glow: 'shadow-blue-500/30',
      bg: 'bg-blue-500/10'
    },
    purple: {
      stroke: '#a855f7',
      gradient: 'from-purple-400 to-purple-600',
      glow: 'shadow-purple-500/30',
      bg: 'bg-purple-500/10'
    },
    shame: {
      stroke: '#ef4444',
      gradient: 'from-shame-400 to-shame-600',
      glow: 'shadow-shame-500/30',
      bg: 'bg-shame-500/10'
    }
  }

  const config = colorConfig[color] || colorConfig.grass

  const getMilestoneIcon = () => {
    if (!milestone) return null
    
    const icons = {
      trophy: <Trophy className="w-6 h-6" />,
      target: <Target className="w-6 h-6" />,
      zap: <Zap className="w-6 h-6" />,
      star: <Star className="w-6 h-6" />,
      check: <CheckCircle className="w-6 h-6" />,
      award: <Award className="w-6 h-6" />,
      crown: <Crown className="w-6 h-6" />
    }
    
    return icons[milestone.icon] || <Trophy className="w-6 h-6" />
  }

  const animateProgress = (targetValue) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    const duration = 2000 // 2 seconds
    const startTime = performance.now()
    const startValue = progressRef.current

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (targetValue - startValue) * easeOutCubic
      
      progressRef.current = current
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (inView && showAnimation) {
      animateProgress(progress)
    }
  }, [inView, progress, showAnimation])

  useEffect(() => {
    if (isHovered) {
      controls.start({
        scale: 1.05,
        transition: { duration: 0.2 }
      })
    } else {
      controls.start({
        scale: 1,
        transition: { duration: 0.2 }
      })
    }
  }, [isHovered, controls])

  const handleClick = () => {
    if (onClick) {
      setIsClicked(true)
      setTimeout(() => setIsClicked(false), 300)
      onClick()
    }
  }

  const getProgressLabel = () => {
    if (progress >= 90) return 'Elite'
    if (progress >= 75) return 'Excellent'
    if (progress >= 50) return 'Good'
    if (progress >= 25) return 'Fair'
    return 'Needs Work'
  }

  const getProgressColor = () => {
    if (progress >= 90) return 'text-premium-gold'
    if (progress >= 75) return 'text-grass-400'
    if (progress >= 50) return 'text-blue-400'
    if (progress >= 25) return 'text-yellow-400'
    return 'text-shame-400'
  }

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      className={`relative ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Outer glow effect */}
      <motion.div
        animate={isHovered ? {
          scale: 1.1,
          opacity: 0.3
        } : {
          scale: 1,
          opacity: 0.1
        }}
        className={`absolute inset-0 rounded-full ${config.glow} blur-xl`}
      />

      {/* Main container */}
      <div className={`relative rounded-full ${config.bg} border border-white/10 p-4`}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#gradient-${color})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ 
              duration: 2, 
              ease: "easeOut"
            }}
            strokeDasharray={circumference}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient
              id={`gradient-${color}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={config.stroke} stopOpacity="1" />
              <stop offset="100%" stopColor={config.stroke} stopOpacity="0.8" />
            </linearGradient>
            
            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {loading ? (
            <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          ) : (
            <>
              {/* Main value */}
              <motion.div
                animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                className="flex flex-col items-center"
              >
                <div className="flex items-baseline">
                  <motion.span
                    key={progress}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-bold"
                  >
                    {Math.round(progress)}%
                  </motion.span>
                </div>
                
                {/* Progress label */}
                <motion.div
                  animate={isHovered ? { y: -5 } : { y: 0 }}
                  className={`text-sm font-medium mt-2 ${getProgressColor()}`}
                >
                  {getProgressLabel()}
                </motion.div>
              </motion.div>

              {/* Milestone indicator */}
              {milestone && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-2 -right-2"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ 
                        rotate: 360,
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        rotate: {
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear"
                        },
                        scale: {
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-premium-gold to-yellow-600 flex items-center justify-center"
                    >
                      {getMilestoneIcon()}
                    </motion.div>
                    
                    {/* Pulsing effect */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 rounded-full border-2 border-premium-gold"
                    />
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* Animated particles on progress */}
        {isHovered && (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  scale: 0,
                  x: size / 2,
                  y: size / 2
                }}
                animate={{
                  scale: [0, 1, 0],
                  x: [
                    size / 2,
                    size / 2 + Math.cos((i * Math.PI) / 4) * radius,
                    size / 2 + Math.cos((i * Math.PI) / 4) * radius * 1.2
                  ],
                  y: [
                    size / 2,
                    size / 2 + Math.sin((i * Math.PI) / 4) * radius,
                    size / 2 + Math.sin((i * Math.PI) / 4) * radius * 1.2
                  ],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-grass-400 to-cyan-400"
              />
            ))}
          </>
        )}

        {/* Click animation */}
        {isClicked && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            className="absolute inset-0 rounded-full border-4 border-grass-400/50"
          />
        )}
      </div>

      {/* Labels */}
      <div className="mt-6 text-center">
        {label && (
          <motion.div
            animate={isHovered ? { y: -2 } : { y: 0 }}
            className="text-lg font-bold mb-1"
          >
            {label}
          </motion.div>
        )}
        
        {sublabel && (
          <motion.div
            animate={isHovered ? { y: 2 } : { y: 0 }}
            className="text-sm text-gray-400"
          >
            {sublabel}
          </motion.div>
        )}
      </div>

      {/* Progress segments */}
      <div className="flex justify-between items-center mt-4">
        {[0, 25, 50, 75, 100].map((segment, index) => (
          <div key={segment} className="flex flex-col items-center">
            <div className={`w-2 h-2 rounded-full mb-1 ${
              progress >= segment ? config.bg : 'bg-white/5'
            }`} />
            <span className="text-xs text-gray-500">{segment}%</span>
          </div>
        ))}
      </div>

      {/* Progress bar for mobile/alternative view */}
      <div className="mt-4">
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 2, delay: 0.2 }}
            className={`h-full rounded-full bg-gradient-to-r ${config.gradient}`}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0</span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {value}/{maxValue}
          </span>
          <span>{maxValue}</span>
        </div>
      </div>
    </motion.div>
  )
}

// Example usage component
export const ProgressDashboard = () => {
  const rings = [
    {
      value: 94,
      label: 'Consistency',
      sublabel: 'Verification rate',
      color: 'grass',
      milestone: { icon: 'target' }
    },
    {
      value: 42,
      maxValue: 100,
      label: 'Current Streak',
      sublabel: 'Days consecutively',
      color: 'premium',
      milestone: { icon: 'flame' }
    },
    {
      value: 87,
      label: 'Accountability',
      sublabel: 'Peer comparison',
      color: 'blue',
      milestone: { icon: 'trophy' }
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {rings.map((ring, index) => (
        <div key={ring.label} className="flex flex-col items-center">
          <ProgressRing
            {...ring}
            size={180}
            strokeWidth={14}
            showAnimation
            onClick={() => console.log(`Clicked ${ring.label}`)}
          />
          
          {/* Additional stats */}
          <div className="mt-6 text-center space-y-2">
            <div className="text-sm text-gray-400">Rank</div>
            <div className="text-2xl font-bold">#{index + 7}</div>
            <div className="text-xs text-gray-500">Global position</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProgressRing