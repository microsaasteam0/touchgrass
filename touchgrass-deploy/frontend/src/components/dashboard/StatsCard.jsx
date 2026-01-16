import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, TrendingDown, Flame, 
  Target, Zap, Crown, Award, BarChart3,
  Users, Clock, Trophy, Sparkles
} from 'lucide-react'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'

const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'grass',
  loading = false,
  description,
  trend,
  suffix = '',
  prefix = '',
  delay = 0,
  isCurrency = false
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [displayValue, setDisplayValue] = useState(0)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const colorConfig = {
    grass: {
      bg: 'from-grass-500/10 to-grass-600/5',
      border: 'border-grass-500/20',
      text: 'text-grass-400',
      glow: 'shadow-grass-500/20',
      gradient: 'from-grass-500 to-grass-600'
    },
    premium: {
      bg: 'from-premium-gold/10 to-yellow-600/5',
      border: 'border-premium-gold/20',
      text: 'text-premium-gold',
      glow: 'shadow-premium-gold/20',
      gradient: 'from-premium-gold to-yellow-600'
    },
    blue: {
      bg: 'from-blue-500/10 to-blue-600/5',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      glow: 'shadow-blue-500/20',
      gradient: 'from-blue-500 to-blue-600'
    },
    purple: {
      bg: 'from-purple-500/10 to-purple-600/5',
      border: 'border-purple-500/20',
      text: 'text-purple-400',
      glow: 'shadow-purple-500/20',
      gradient: 'from-purple-500 to-purple-600'
    },
    shame: {
      bg: 'from-shame-500/10 to-shame-600/5',
      border: 'border-shame-500/20',
      text: 'text-shame-400',
      glow: 'shadow-shame-500/20',
      gradient: 'from-shame-500 to-shame-600'
    }
  }

  const config = colorConfig[color] || colorConfig.grass

  const iconMap = {
    flame: <Flame className="w-5 h-5" />,
    target: <Target className="w-5 h-5" />,
    zap: <Zap className="w-5 h-5" />,
    crown: <Crown className="w-5 h-5" />,
    award: <Award className="w-5 h-5" />,
    chart: <BarChart3 className="w-5 h-5" />,
    users: <Users className="w-5 h-5" />,
    clock: <Clock className="w-5 h-5" />,
    trophy: <Trophy className="w-5 h-5" />,
    sparkles: <Sparkles className="w-5 h-5" />
  }

  useEffect(() => {
    if (inView && !loading) {
      const timer = setTimeout(() => {
        setDisplayValue(value)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [inView, value, loading, delay])

  const formatNumber = (num) => {
    if (isCurrency) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(num)
    }
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num
  }

  const getTrendIcon = () => {
    if (change > 0) {
      return <TrendingUp className="w-4 h-4 text-grass-400" />
    } else if (change < 0) {
      return <TrendingDown className="w-4 h-4 text-shame-400" />
    }
    return null
  }

  const getChangeColor = () => {
    if (change > 0) return 'text-grass-400'
    if (change < 0) return 'text-shame-400'
    return 'text-gray-400'
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Glow effect on hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-30 blur-xl"
          style={{
            background: `linear-gradient(45deg, var(--tw-${color}-500), transparent)`
          }}
        />
      )}

      <div className={`
        relative bg-gradient-to-br ${config.bg} ${config.border}
        rounded-2xl border p-6 backdrop-blur-sm
        transition-all duration-300 group-hover:${config.glow} group-hover:shadow-xl
        overflow-hidden
      `}>
        {/* Animated background gradient */}
        <motion.div
          animate={isHovered ? {
            x: ['0%', '100%'],
            transition: {
              x: {
                repeat: Infinity,
                duration: 3,
                ease: "linear"
              }
            }
          } : {}}
          className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, var(--tw-${color}-500), transparent)`
          }}
        />

        {/* Decorative corner accents */}
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div className={`absolute -top-8 -right-8 w-16 h-16 rotate-45 ${config.bg} border-b ${config.border}`} />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className={`w-12 h-12 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center ${config.text}`}
              >
                {iconMap[icon] || <BarChart3 className="w-6 h-6" />}
              </motion.div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  {title}
                </h3>
                {description && (
                  <p className="text-xs text-gray-500 mt-1">{description}</p>
                )}
              </div>
            </div>

            {/* Trend indicator */}
            {change !== undefined && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay * 0.1 + 0.3 }}
                className={`flex items-center gap-1 px-3 py-1 rounded-full ${getChangeColor()}/10 border ${getChangeColor()}/20`}
              >
                {getTrendIcon()}
                <span className={`text-sm font-bold ${getChangeColor()}`}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
              </motion.div>
            )}
          </div>

          {/* Main Value */}
          <div className="mb-2">
            {loading ? (
              <div className="h-12 w-32 bg-white/5 rounded-lg animate-pulse" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">
                  {prefix}
                  {inView ? (
                    <CountUp
                      end={value}
                      duration={2}
                      separator=","
                      decimals={0}
                      className="font-bold"
                    />
                  ) : (
                    '0'
                  )}
                  {suffix}
                </span>
                
                {/* Animated unit indicator */}
                {suffix && (
                  <motion.span
                    animate={isHovered ? { y: [0, -2, 0] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="text-sm text-gray-400 font-medium"
                  >
                    {suffix}
                  </motion.span>
                )}
              </div>
            )}
          </div>

          {/* Subtitle with subtle animation */}
          {trend && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay * 0.1 + 0.5 }}
              className="flex items-center gap-2 text-sm text-gray-400"
            >
              <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
              <span>{trend}</span>
            </motion.div>
          )}

          {/* Progress bar (for percentage-based stats) */}
          {typeof value === 'number' && value <= 100 && (
            <div className="mt-4">
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 2, delay: delay * 0.1 + 0.2 }}
                  className={`h-full rounded-full bg-gradient-to-r ${config.gradient}`}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Bottom decorative line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, delay: delay * 0.1 + 0.7 }}
            className={`h-0.5 mt-4 rounded-full bg-gradient-to-r ${config.gradient}`}
          />
        </div>

        {/* Interactive glow on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
          className={`absolute inset-0 rounded-2xl border-2 ${config.border} pointer-events-none`}
        />
      </div>

      {/* Tooltip on hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full z-20"
        >
          <div className="bg-gray-900 border border-white/10 rounded-lg px-3 py-2 shadow-2xl whitespace-nowrap">
            <div className="text-xs font-medium text-gray-300">
              {title}: {prefix}{formatNumber(value)}{suffix}
            </div>
            {change !== undefined && (
              <div className={`text-xs ${getChangeColor()} mt-1`}>
                {change > 0 ? '↑' : '↓'} {Math.abs(change)}% from last period
              </div>
            )}
          </div>
          <div className="w-2 h-2 bg-gray-900 border-r border-b border-white/10 rotate-45 absolute -bottom-1 left-1/2 transform -translate-x-1/2" />
        </motion.div>
      )}
    </motion.div>
  )
}

// Example usage component
export const StatsDashboard = () => {
  const stats = [
    {
      title: 'Current Streak',
      value: 42,
      change: 12.5,
      icon: 'flame',
      color: 'grass',
      description: 'Consecutive days',
      trend: 'Personal best: 89 days',
      suffix: ' days'
    },
    {
      title: 'Global Rank',
      value: 7,
      change: 3,
      icon: 'crown',
      color: 'premium',
      description: 'Out of 124,857 users',
      trend: 'Top 0.01%',
      prefix: '#'
    },
    {
      title: 'Consistency Score',
      value: 94,
      change: 2.3,
      icon: 'target',
      color: 'blue',
      description: 'Verification rate',
      trend: 'Elite tier: 90%+',
      suffix: '%'
    },
    {
      title: 'Monthly Revenue',
      value: 2499,
      change: 18.7,
      icon: 'chart',
      color: 'purple',
      description: 'Projected ARR',
      trend: '$29,988 annualized',
      prefix: '$',
      isCurrency: true
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatsCard
          key={stat.title}
          {...stat}
          delay={index}
        />
      ))}
    </div>
  )
}

export default StatsCard