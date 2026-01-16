import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, TrendingDown, Trophy, Crown, Star, Zap, 
  Shield, Target, Flame, Rocket, Award, ChevronRight,
  Users, Globe, MapPin, Clock, BarChart3, Sparkles
} from 'lucide-react'
import { useSpring, animated, config } from '@react-spring/web'
import CountUp from 'react-countup'

const LeaderboardCard = ({ user, rank, onViewProfile, isCurrentUser = false }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const cardRef = useRef(null)
  
  // Spring animation for card elevation
  const [{ y, scale, shadow }, api] = useSpring(() => ({
    y: 0,
    scale: 1,
    shadow: 0,
    config: config.stiff
  }))

  // Particle animation refs
  const particlesRef = useRef([])
  
  // Status color based on position change
  const getStatusColor = (change) => {
    if (change > 0) return 'text-green-400'
    if (change < 0) return 'text-red-400'
    return 'text-gray-400'
  }

  // Rank badge styling
  const getRankStyle = (rank) => {
    switch(rank) {
      case 1:
        return {
          bg: 'bg-gradient-to-br from-yellow-500 via-yellow-400 to-amber-600',
          text: 'text-yellow-900',
          icon: <Crown className="w-4 h-4" />,
          glow: 'shadow-[0_0_40px_rgba(251,191,36,0.3)]'
        }
      case 2:
        return {
          bg: 'bg-gradient-to-br from-gray-300 via-gray-200 to-gray-400',
          text: 'text-gray-800',
          icon: <Trophy className="w-4 h-4" />,
          glow: 'shadow-[0_0_30px_rgba(209,213,219,0.2)]'
        }
      case 3:
        return {
          bg: 'bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800',
          text: 'text-amber-100',
          icon: <Award className="w-4 h-4" />,
          glow: 'shadow-[0_0_30px_rgba(180,83,9,0.3)]'
        }
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-800 to-gray-900',
          text: 'text-gray-300',
          icon: <div className="text-xs font-bold">{rank}</div>,
          glow: ''
        }
    }
  }

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: rank * 0.05
      }
    },
    hover: {
      y: -8,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  }

  const statsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  }

  const rankStyle = getRankStyle(rank)

  // Handle hover animations
  useEffect(() => {
    if (isHovered) {
      api.start({ y: -8, scale: 1.02, shadow: 20 })
      createParticles()
    } else {
      api.start({ y: 0, scale: 1, shadow: 0 })
    }
  }, [isHovered, api])

  // Create particles for premium users
  const createParticles = () => {
    if (user.isPremium) {
      particlesRef.current = Array.from({ length: 8 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 2,
        speedX: (Math.random() - 0.5) * 4,
        speedY: (Math.random() - 0.5) * 4,
        opacity: Math.random() * 0.5 + 0.5
      }))
    }
  }

  // Calculate streak consistency
  const calculateConsistency = (streak, totalDays) => {
    if (totalDays === 0) return 0
    return Math.min(100, Math.round((streak / totalDays) * 100))
  }

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setShowStats(!showStats)}
      className={`relative cursor-pointer ${
        isCurrentUser ? 'ring-2 ring-grass-500/50' : ''
      }`}
    >
      {/* Animated background gradient */}
      <animated.div 
        className="absolute inset-0 rounded-2xl opacity-10"
        style={{
          background: `radial-gradient(circle at ${isHovered ? '50% 50%' : '50% 100%'}, ${
            rank === 1 ? 'rgba(251,191,36,0.3)' : 
            rank === 2 ? 'rgba(209,213,219,0.2)' :
            rank === 3 ? 'rgba(180,83,9,0.2)' :
            'rgba(34,197,94,0.1)'
          } 0%, transparent 70%)`,
          transform: scale.to(s => `scale(${s})`),
          boxShadow: shadow.to(s => `0 ${s}px ${s * 2}px rgba(0,0,0,0.3)`)
        }}
      />

      {/* Premium glow effect */}
      {user.isPremium && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-premium-gold/5 via-transparent to-premium-gold/5 animate-pulse-glow" />
      )}

      {/* Particles for premium users */}
      {isHovered && user.isPremium && particlesRef.current.map((particle, i) => (
        <animated.div
          key={i}
          className="absolute rounded-full bg-premium-gold/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            transform: y.to(y => `translateY(${y}px)`)
          }}
        />
      ))}

      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-950/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden">
        
        {/* Status Indicator */}
        <div className="absolute top-4 right-4">
          {user.positionChange > 0 ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full"
            >
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs font-bold text-green-400">+{user.positionChange}</span>
            </motion.div>
          ) : user.positionChange < 0 ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full"
            >
              <TrendingDown className="w-3 h-3 text-red-400" />
              <span className="text-xs font-bold text-red-400">{user.positionChange}</span>
            </motion.div>
          ) : (
            <div className="w-2 h-2 rounded-full bg-gray-500/50" />
          )}
        </div>

        {/* User Info Row */}
        <div className="flex items-center gap-4">
          {/* Rank Badge */}
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
            className={`relative w-14 h-14 rounded-xl ${rankStyle.bg} ${rankStyle.glow} flex items-center justify-center`}
          >
            <div className={`${rankStyle.text} font-bold text-lg`}>
              {rank <= 3 ? rankStyle.icon : `#${rank}`}
            </div>
            
            {/* Animated ring for top 3 */}
            {rank <= 3 && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-xl border-2 border-transparent border-t-white/30 border-r-white/20"
              />
            )}
          </motion.div>

          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="relative"
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-grass-500 to-grass-600 overflow-hidden">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.displayName[0]}
                </div>
              )}
            </div>
            
            {/* Online indicator */}
            {user.isOnline && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-gray-900 rounded-full"
              />
            )}
            
            {/* Premium badge */}
            {user.isPremium && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="absolute -top-2 -left-2"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-premium-gold to-yellow-600 flex items-center justify-center p-1.5">
                  <Star className="w-4 h-4 text-white" />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold truncate">
                {user.displayName}
                {isCurrentUser && (
                  <span className="ml-2 text-xs px-2 py-1 bg-grass-500/20 text-grass-400 rounded-full">
                    You
                  </span>
                )}
              </h3>
              
              {/* Verification badge */}
              {user.isVerified && (
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"
                >
                  <Shield className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{user.location?.city || 'Unknown'}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{user.lastActive || 'Just now'}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{user.followers || 0} followers</span>
              </div>
            </div>
          </div>

          {/* Streak Stats */}
          <div className="text-right">
            <div className="flex items-baseline gap-2">
              <CountUp
                start={0}
                end={user.currentStreak}
                duration={2}
                delay={0.5}
                suffix=""
                className="text-3xl font-bold bg-gradient-to-r from-grass-400 to-cyan-400 bg-clip-text text-transparent"
              >
                {({ countUpRef }) => (
                  <span ref={countUpRef} />
                )}
              </CountUp>
              <span className="text-sm text-gray-400">days</span>
            </div>
            <div className="text-sm text-gray-400">
              {calculateConsistency(user.currentStreak, user.totalDays)}% consistency
            </div>
          </div>

          {/* View Profile Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              onViewProfile(user.id)
            }}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Expanded Stats */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              variants={statsVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="mt-6 pt-6 border-t border-white/10"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Total Days */}
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Total Days</span>
                  </div>
                  <div className="text-2xl font-bold">
                    <CountUp end={user.totalDays} duration={1.5} />
                  </div>
                </div>

                {/* Longest Streak */}
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-gray-400">Longest Streak</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-400">
                    <CountUp end={user.longestStreak} duration={1.5} />
                  </div>
                </div>

                {/* Shame Days */}
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-gray-400">Shame Days</span>
                  </div>
                  <div className="text-2xl font-bold text-red-400">
                    <CountUp end={user.shameDays || 0} duration={1.5} />
                  </div>
                </div>

                {/* Achievements */}
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-400">Achievements</span>
                  </div>
                  <div className="flex gap-2">
                    {user.achievements?.slice(0, 3).map((achievement, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-premium-gold/20 to-yellow-600/20 border border-premium-gold/30 flex items-center justify-center"
                      >
                        <span className="text-sm">{achievement.icon}</span>
                      </motion.div>
                    ))}
                    {user.achievements?.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">
                        +{user.achievements.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="mt-4 space-y-3">
                {/* Consistency Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Consistency</span>
                    <span className="font-bold">
                      {calculateConsistency(user.currentStreak, user.totalDays)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${calculateConsistency(user.currentStreak, user.totalDays)}%` }}
                      transition={{ duration: 1.5, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-grass-500 to-cyan-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Monthly Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">This Month</span>
                    <span className="font-bold">
                      {user.monthlyProgress || 0}/30 days
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${((user.monthlyProgress || 0) / 30) * 100}%` 
                      }}
                      transition={{ duration: 1.5, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-2 bg-grass-500/10 hover:bg-grass-500/20 border border-grass-500/30 rounded-xl text-sm font-medium transition-all duration-300"
          >
            Follow
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-2 bg-premium-gold/10 hover:bg-premium-gold/20 border border-premium-gold/30 rounded-xl text-sm font-medium transition-all duration-300"
          >
            Challenge
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl text-sm font-medium transition-all duration-300"
          >
            Message
          </motion.button>
        </div>
      </div>

      {/* Hover Effect Line */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: isHovered ? '100%' : 0 }}
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-grass-500 to-transparent"
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

// Calendar icon component
const Calendar = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

export default LeaderboardCard