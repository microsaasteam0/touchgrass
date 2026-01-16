import { useState, useEffect } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { 
  Crown, Trophy, Award, Star, Medal, Zap,
  Flame, Target, Shield, TrendingUp, Sparkles
} from 'lucide-react'

const RankBadge = ({ 
  rank, 
  size = 'md', 
  animated = true,
  interactive = false,
  showTooltip = true,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const controls = useAnimation()

  // Size configurations
  const sizeConfig = {
    sm: { container: 'w-8 h-8', icon: 'w-3 h-3', text: 'text-xs' },
    md: { container: 'w-12 h-12', icon: 'w-4 h-4', text: 'text-sm' },
    lg: { container: 'w-16 h-16', icon: 'w-6 h-6', text: 'text-lg' },
    xl: { container: 'w-20 h-20', icon: 'w-8 h-8', text: 'text-xl' }
  }

  const { container, icon, text } = sizeConfig[size]

  // Rank-specific configurations
  const getRankConfig = (rank) => {
    switch(true) {
      case rank === 1:
        return {
          bg: 'bg-gradient-to-br from-yellow-500 via-yellow-400 to-amber-600',
          gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
          icon: <Crown className={icon} />,
          textColor: 'text-yellow-900',
          glow: 'shadow-[0_0_30px_rgba(251,191,36,0.4)]',
          animation: 'pulse-glow',
          label: 'CHAMPION',
          description: 'Undisputed leader of discipline'
        }
      case rank === 2:
        return {
          bg: 'bg-gradient-to-br from-gray-300 via-gray-200 to-gray-400',
          gradient: 'linear-gradient(135deg, #d1d5db, #9ca3af, #6b7280)',
          icon: <Trophy className={icon} />,
          textColor: 'text-gray-800',
          glow: 'shadow-[0_0_20px_rgba(209,213,219,0.3)]',
          animation: 'float',
          label: 'ELITE',
          description: 'Master of consistency'
        }
      case rank === 3:
        return {
          bg: 'bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800',
          gradient: 'linear-gradient(135deg, #b45309, #d97706, #f59e0b)',
          icon: <Award className={icon} />,
          textColor: 'text-amber-100',
          glow: 'shadow-[0_0_15px_rgba(180,83,9,0.3)]',
          animation: 'bounce',
          label: 'CONTENDER',
          description: 'Rising star of discipline'
        }
      case rank <= 10:
        return {
          bg: 'bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-500',
          gradient: 'linear-gradient(135deg, #3b82f6, #0ea5e9, #06b6d4)',
          icon: <Star className={icon} />,
          textColor: 'text-blue-100',
          glow: 'shadow-[0_0_10px_rgba(59,130,246,0.3)]',
          animation: 'spin-slow',
          label: 'TOP 10',
          description: 'Among the elite performers'
        }
      case rank <= 100:
        return {
          bg: 'bg-gradient-to-br from-green-500 via-green-400 to-emerald-500',
          gradient: 'linear-gradient(135deg, #22c55e, #10b981, #059669)',
          icon: <Target className={icon} />,
          textColor: 'text-green-100',
          glow: 'shadow-[0_0_5px_rgba(34,197,94,0.3)]',
          animation: '',
          label: 'TOP 100',
          description: 'Consistent high performer'
        }
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800',
          gradient: 'linear-gradient(135deg, #374151, #4b5563, #6b7280)',
          icon: <div className={`font-bold ${text}`}>#{rank}</div>,
          textColor: 'text-gray-300',
          glow: '',
          animation: '',
          label: 'COMPETITOR',
          description: 'Building discipline daily'
        }
    }
  }

  const rankConfig = getRankConfig(rank)

  // Animation sequences
  const animationSequences = {
    'pulse-glow': async () => {
      await controls.start({
        scale: [1, 1.1, 1],
        boxShadow: [
          '0 0 0px rgba(251,191,36,0)',
          '0 0 40px rgba(251,191,36,0.6)',
          '0 0 0px rgba(251,191,36,0)'
        ],
        transition: { duration: 2, repeat: Infinity }
      })
    },
    'float': async () => {
      await controls.start({
        y: [0, -5, 0],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      })
    },
    'bounce': async () => {
      await controls.start({
        y: [0, -3, 0],
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
      })
    },
    'spin-slow': async () => {
      await controls.start({
        rotate: 360,
        transition: { duration: 10, repeat: Infinity, ease: "linear" }
      })
    }
  }

  // Handle animations
  useEffect(() => {
    if (animated && rankConfig.animation) {
      animationSequences[rankConfig.animation]()
    }
  }, [animated, rank])

  // Handle click animation
  const handleClick = () => {
    if (interactive && onClick) {
      setIsClicked(true)
      
      // Click animation
      controls.start({
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360],
        transition: { duration: 0.6 }
      })
      
      setTimeout(() => setIsClicked(false), 600)
      onClick()
    }
  }

  // Hover animations
  const hoverAnimations = {
    scale: interactive ? 1.15 : 1.1,
    rotate: rank === 1 ? 15 : rank === 2 ? -10 : rank === 3 ? 10 : 0,
    transition: { type: "spring", stiffness: 300, damping: 15 }
  }

  return (
    <div className="relative inline-block">
      <motion.div
        animate={controls}
        whileHover={interactive ? hoverAnimations : {}}
        whileTap={interactive ? { scale: 0.9 } : {}}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        className={`relative ${container} rounded-xl ${rankConfig.bg} ${rankConfig.glow} flex items-center justify-center cursor-pointer select-none ${interactive ? 'active:scale-90' : ''}`}
        style={{
          background: rankConfig.gradient
        }}
      >
        {/* Animated ring for top ranks */}
        {(rank <= 10 || isHovered) && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-xl border-2 border-transparent border-t-white/30 border-r-white/20"
          />
        )}

        {/* Inner content */}
        <div className={`relative z-10 ${rankConfig.textColor}`}>
          {rank <= 3 ? rankConfig.icon : `#${rank}`}
        </div>

        {/* Click effect */}
        {isClicked && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            className="absolute inset-0 rounded-xl bg-white/30"
          />
        )}

        {/* Particles on hover for top ranks */}
        {isHovered && rank <= 3 && (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * 45 * Math.PI) / 180) * 30,
                  y: Math.sin((i * 45 * Math.PI) / 180) * 30,
                  opacity: [1, 0.5, 0]
                }}
                transition={{ duration: 0.8, delay: i * 0.05 }}
                className="absolute w-1 h-1 rounded-full bg-white"
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute left-1/2 transform -translate-x-1/2 mt-2 z-50"
          >
            <div className="relative">
              {/* Tooltip arrow */}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
              
              {/* Tooltip content */}
              <div className="bg-gray-900 border border-white/10 rounded-xl p-3 shadow-2xl min-w-48">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-lg ${rankConfig.bg} flex items-center justify-center`}>
                    {rank <= 3 ? rankConfig.icon : `#${rank}`}
                  </div>
                  <div>
                    <div className="font-bold">{rankConfig.label}</div>
                    <div className="text-xs text-gray-400">Rank #{rank}</div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-300 mb-3">
                  {rankConfig.description}
                </p>
                
                {/* Special abilities for top ranks */}
                {rank <= 3 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span>Exclusive champion badge</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Flame className="w-3 h-3 text-orange-400" />
                      <span>Featured on leaderboard</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Shield className="w-3 h-3 text-blue-400" />
                      <span>Priority support access</span>
                    </div>
                  </div>
                )}
                
                {rank <= 10 && rank > 3 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <TrendingUp className="w-3 h-3 text-blue-400" />
                      <span>Top performer recognition</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>Early feature access</span>
                    </div>
                  </div>
                )}
                
                {/* Progress to next rank */}
                {rank > 1 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="text-xs text-gray-400 mb-1">
                      {rank <= 10 ? 'Maintain position' : `Progress to Top ${Math.floor(rank / 10) * 10}`}
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${Math.min(100, (100 / rank) * 10)}%` 
                        }}
                        className={`h-full ${
                          rank <= 3 ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
                          rank <= 10 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                          'bg-gradient-to-r from-green-500 to-emerald-500'
                        } rounded-full`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating elements for top ranks */}
      {rank <= 3 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.sin(i) * 5, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5
              }}
              className={`absolute rounded-full ${
                rank === 1 ? 'bg-yellow-500/20' :
                rank === 2 ? 'bg-gray-400/20' :
                'bg-amber-600/20'
              }`}
              style={{
                width: 4 + i * 2,
                height: 4 + i * 2,
                left: `${20 + i * 20}%`,
                top: `${30 + i * 10}%`
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default RankBadge



// /* Add these to your global CSS or animations.css */

// @keyframes float {
//   0%, 100% {
//     transform: translateY(0);
//   }
//   50% {
//     transform: translateY(-10px);
//   }
// }

// @keyframes pulse-glow {
//   0%, 100% {
//     box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
//   }
//   50% {
//     box-shadow: 0 0 40px rgba(251, 191, 36, 0.6);
//   }
// }

// @keyframes spin-slow {
//   from {
//     transform: rotate(0deg);
//   }
//   to {
//     transform: rotate(360deg);
//   }
// }

// @keyframes bounce {
//   0%, 100% {
//     transform: translateY(0);
//   }
//   50% {
//     transform: translateY(-5px);
//   }
// }

// /* Custom scrollbar */
// .scrollbar-thin {
//   scrollbar-width: thin;
// }

// .scrollbar-thumb-grass-500\/30::-webkit-scrollbar-thumb {
//   background-color: rgba(34, 197, 94, 0.3);
//   border-radius: 10px;
// }

// .scrollbar-thumb-grass-500\/30::-webkit-scrollbar-track {
//   background: rgba(255, 255, 255, 0.05);
// }

// /* Shimmer effect */
// .shimmer {
//   background: linear-gradient(
//     90deg,
//     transparent 0%,
//     rgba(255, 255, 255, 0.1) 50%,
//     transparent 100%
//   );
//   background-size: 200% 100%;
//   animation: shimmer 2s infinite;
// }

// @keyframes shimmer {
//   0% {
//     background-position: -200% 0;
//   }
//   100% {
//     background-position: 200% 0;
//   }
// }

// /* Confetti canvas */
// canvas {
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   pointer-events: none;
// }