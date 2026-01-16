import { useState, useEffect } from 'react'
import { motion, useSpring, useTransform, animate } from 'framer-motion'
import { 
  Crown, Trophy, Award, Sparkles, Zap, Flame,
  TrendingUp, Star, Target, Users, Medal, Gift
} from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import confetti from 'canvas-confetti'

const Podium = ({ users }) => {
  const [ref, inView] = useInView({ triggerOnce: true })
  const [celebrating, setCelebrating] = useState(false)
  const [showDetails, setShowDetails] = useState(Array(3).fill(false))

  // Confetti animation for podium celebration
  const triggerConfetti = () => {
    if (!celebrating) {
      setCelebrating(true)
      
      // Multiple confetti bursts
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        })

        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        })
      }, 250)

      setTimeout(() => {
        setCelebrating(false)
      }, 2000)
    }
  }

  // Auto-trigger confetti when in view
  useEffect(() => {
    if (inView && users.length > 0) {
      setTimeout(triggerConfetti, 500)
    }
  }, [inView, users])

  // Podium positions with different heights and animations
  const podiumData = [
    {
      rank: 2,
      height: 'h-48',
      color: 'from-gray-300 via-gray-200 to-gray-400',
      glow: 'shadow-[0_0_40px_rgba(209,213,219,0.3)]',
      delay: 0.2,
      user: users[1]
    },
    {
      rank: 1,
      height: 'h-64',
      color: 'from-yellow-500 via-yellow-400 to-amber-600',
      glow: 'shadow-[0_0_60px_rgba(251,191,36,0.4)]',
      delay: 0,
      user: users[0]
    },
    {
      rank: 3,
      height: 'h-36',
      color: 'from-amber-700 via-amber-600 to-amber-800',
      glow: 'shadow-[0_0_30px_rgba(180,83,9,0.3)]',
      delay: 0.4,
      user: users[2]
    }
  ]

  // Trophy animations
  const trophyVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: (delay) => ({
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay
      }
    }),
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1:
        return <Crown className="w-8 h-8" />
      case 2:
        return <Trophy className="w-7 h-7" />
      case 3:
        return <Award className="w-6 h-6" />
      default:
        return <Medal className="w-5 h-5" />
    }
  }

  const getRankLabel = (rank) => {
    switch(rank) {
      case 1: return 'CHAMPION'
      case 2: return 'ELITE'
      case 3: return 'CONTENDER'
      default: return 'COMPETITOR'
    }
  }

  return (
    <div ref={ref} className="relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-grass-500/5 to-transparent rounded-3xl" />
      
      {/* Celebration confetti */}
      {celebrating && (
        <div className="absolute inset-0 pointer-events-none">
          <canvas className="absolute inset-0 w-full h-full" />
        </div>
      )}

      {/* Podium Container */}
      <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-950/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <Sparkles className="w-6 h-6 text-premium-gold" />
            <h2 className="text-3xl font-bold">🏆 ELITE PODIUM 🏆</h2>
            <Sparkles className="w-6 h-6 text-premium-gold" />
          </motion.div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            The undisputed champions of discipline. These individuals have mastered consistency 
            and earned their place at the top through relentless dedication.
          </p>
        </div>

        {/* Podium Stands */}
        <div className="flex items-end justify-center gap-4 md:gap-8 px-4">
          {podiumData.map((podium, index) => (
            <motion.div
              key={podium.rank}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: podium.delay 
              }}
              whileHover={{ y: -10 }}
              className="relative flex-1 max-w-xs"
            >
              {/* Podium Platform */}
              <div className={`relative ${podium.height} bg-gradient-to-b ${podium.color} ${podium.glow} rounded-t-2xl flex flex-col items-center justify-end pb-8 overflow-hidden`}>
                
                {/* Animated particles */}
                <motion.div
                  animate={{ 
                    y: [0, -100],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: podium.delay * 2
                  }}
                  className="absolute inset-0"
                >
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 rounded-full bg-white/30"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: '100%',
                        animation: `float ${2 + Math.random() * 2}s infinite ease-in-out`,
                        animationDelay: `${Math.random() * 2}s`
                      }}
                    />
                  ))}
                </motion.div>

                {/* User Avatar */}
                {podium.user && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: podium.delay + 0.3 
                    }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute -top-12"
                  >
                    <div className="relative">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 border-4 border-white/20 overflow-hidden">
                        {podium.user.avatar ? (
                          <img 
                            src={podium.user.avatar} 
                            alt={podium.user.displayName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                            {podium.user.displayName?.[0]}
                          </div>
                        )}
                      </div>
                      
                      {/* Rank Badge */}
                      <motion.div
                        variants={trophyVariants}
                        initial="initial"
                        animate="animate"
                        custom={podium.delay + 0.5}
                        whileHover="float"
                        className={`absolute -top-4 -right-4 w-12 h-12 rounded-full ${
                          podium.rank === 1 
                            ? 'bg-gradient-to-br from-yellow-600 to-amber-700' 
                            : podium.rank === 2
                            ? 'bg-gradient-to-br from-gray-400 to-gray-600'
                            : 'bg-gradient-to-br from-amber-800 to-amber-900'
                        } flex items-center justify-center`}
                      >
                        {getRankIcon(podium.rank)}
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* User Info */}
                <div className="text-center mt-16">
                  {podium.user ? (
                    <>
                      <h3 className="text-xl font-bold mb-1">{podium.user.displayName}</h3>
                      <div className="text-sm text-gray-300 mb-2">@{podium.user.username}</div>
                      
                      {/* Streak Stats */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Flame className="w-4 h-4 text-orange-400" />
                          <span className="text-2xl font-bold text-white">{podium.user.currentStreak}</span>
                          <span className="text-sm text-gray-300">days</span>
                        </div>
                        
                        <div className="text-xs text-gray-300">
                          {getRankLabel(podium.rank)}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400">Position Available</div>
                  )}
                </div>
              </div>

              {/* Base Platform */}
              <div className={`h-8 rounded-b-2xl bg-gradient-to-b ${
                podium.rank === 1 
                  ? 'from-yellow-700/30 to-yellow-900/20' 
                  : podium.rank === 2
                  ? 'from-gray-500/30 to-gray-700/20'
                  : 'from-amber-900/30 to-amber-950/20'
              }`}>
                <div className="text-center py-1.5">
                  <span className={`text-sm font-bold ${
                    podium.rank === 1 ? 'text-yellow-300' :
                    podium.rank === 2 ? 'text-gray-300' :
                    'text-amber-300'
                  }`}>
                    #{podium.rank}
                  </span>
                </div>
              </div>

              {/* Stats Popup on Hover */}
              {podium.user && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-64"
                >
                  <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-white/10 rounded-xl p-4 shadow-2xl">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Consistency</span>
                        <span className="font-bold">
                          {Math.round((podium.user.currentStreak / podium.user.totalDays) * 100) || 0}%
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Longest Streak</span>
                        <span className="font-bold text-orange-400">{podium.user.longestStreak}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Total Days</span>
                        <span className="font-bold">{podium.user.totalDays}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Location</span>
                        <span className="font-bold">{podium.user.location?.city || 'Unknown'}</span>
                      </div>
                    </div>
                    
                    <button className="w-full mt-4 py-2 bg-grass-500/20 hover:bg-grass-500/30 border border-grass-500/30 rounded-lg text-sm font-medium transition-colors">
                      View Full Profile
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Podium Details */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {podiumData.map((podium, index) => (
            <motion.div
              key={podium.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.6 }}
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-2xl border backdrop-blur-sm ${
                podium.rank === 1 
                  ? 'bg-gradient-to-br from-yellow-500/10 to-amber-600/5 border-yellow-500/20' 
                  : podium.rank === 2
                  ? 'bg-gradient-to-br from-gray-500/10 to-gray-600/5 border-gray-500/20'
                  : 'bg-gradient-to-br from-amber-700/10 to-amber-800/5 border-amber-700/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  podium.rank === 1 
                    ? 'bg-gradient-to-br from-yellow-500 to-amber-600' 
                    : podium.rank === 2
                    ? 'bg-gradient-to-br from-gray-400 to-gray-600'
                    : 'bg-gradient-to-br from-amber-700 to-amber-800'
                }`}>
                  <span className="text-white font-bold">#{podium.rank}</span>
                </div>
                <div>
                  <h4 className="font-bold">{getRankLabel(podium.rank)} Tier</h4>
                  <p className="text-sm text-gray-400">Exclusive Benefits</p>
                </div>
              </div>

              <ul className="space-y-2">
                {podium.rank === 1 && (
                  <>
                    <li className="flex items-center gap-2 text-sm">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span>Custom champion badge</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span>Featured on homepage</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Gift className="w-4 h-4 text-yellow-400" />
                      <span>$500 monthly prize</span>
                    </li>
                  </>
                )}
                
                {podium.rank === 2 && (
                  <>
                    <li className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-gray-400" />
                      <span>Elite recognition</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span>Priority support</span>
                    </li>
                  </>
                )}
                
                {podium.rank === 3 && (
                  <>
                    <li className="flex items-center gap-2 text-sm">
                      <Target className="w-4 h-4 text-amber-400" />
                      <span>Contender spotlight</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-amber-400" />
                      <span>Exclusive community</span>
                    </li>
                  </>
                )}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <button
            onClick={triggerConfetti}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-grass-500 to-grass-600 hover:from-grass-600 hover:to-grass-700 rounded-2xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-grass-500/30"
          >
            <Sparkles className="w-5 h-5" />
            Celebrate Champions
            <Sparkles className="w-5 h-5" />
          </button>
          
          <p className="text-sm text-gray-400 mt-4">
            The podium resets monthly with new champions crowned. Your journey starts today.
          </p>
        </motion.div>
      </div>

      {/* Floating particles in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-grass-500/30 to-cyan-500/30"
            animate={{
              y: [0, -100],
              x: [0, Math.random() * 20 - 10],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: '100%'
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Podium