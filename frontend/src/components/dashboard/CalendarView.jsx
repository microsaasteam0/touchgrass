import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, ChevronRight, Calendar, 
  CheckCircle, XCircle, AlertCircle,
  Flame, Trophy, Star, Zap,
  Download, Filter, MoreVertical
} from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, 
         endOfMonth, eachDayOfInterval, isSameMonth, 
         isToday, isSameDay } from 'date-fns'
import { useInView } from 'react-intersection-observer'

const CalendarView = ({ 
  activityData = [],
  loading = false,
  onDateSelect,
  showHeatmap = true,
  view = 'month'
}) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [hoveredDate, setHoveredDate] = useState(null)
  const [viewMode, setViewMode] = useState(view)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  // Generate mock activity data
  const generateActivityData = () => {
    const data = {}
    const today = new Date()
    const start = new Date(today)
    start.setMonth(start.getMonth() - 2)
    
    const days = eachDayOfInterval({ start, end: today })
    
    days.forEach(day => {
      const rand = Math.random()
      const dateStr = format(day, 'yyyy-MM-dd')
      
      if (rand > 0.7) {
        // Verified day
        data[dateStr] = {
          verified: true,
          streak: Math.floor(Math.random() * 10) + 1,
          duration: Math.floor(Math.random() * 120) + 5,
          achievement: rand > 0.9 ? 'premium' : rand > 0.8 ? 'gold' : 'standard'
        }
      } else if (rand > 0.4) {
        // Shame day
        data[dateStr] = {
          verified: false,
          shame: true,
          message: ['Forgot', 'Too busy', 'Weather', 'Lazy'][Math.floor(Math.random() * 4)]
        }
      } else {
        // Skipped/inactive
        data[dateStr] = {
          verified: false,
          shame: false
        }
      }
    })
    
    return data
  }

  const [activity, setActivity] = useState(generateActivityData())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get previous/next month
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  
  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  const getActivityForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return activity[dateStr] || null
  }

  const getDayColor = (date) => {
    const activity = getActivityForDate(date)
    
    if (!activity) return 'bg-white/5'
    
    if (activity.verified) {
      if (activity.achievement === 'premium') return 'bg-gradient-to-br from-premium-gold/20 to-yellow-600/10'
      if (activity.achievement === 'gold') return 'bg-gradient-to-br from-grass-500/20 to-grass-600/10'
      return 'bg-gradient-to-br from-green-500/10 to-green-600/5'
    }
    
    if (activity.shame) return 'bg-gradient-to-br from-shame-500/10 to-shame-600/5'
    
    return 'bg-white/5'
  }

  const getDayBorder = (date) => {
    const activity = getActivityForDate(date)
    
    if (!activity) return 'border-white/5'
    
    if (activity.verified) {
      if (activity.achievement === 'premium') return 'border-premium-gold/30'
      if (activity.achievement === 'gold') return 'border-grass-500/30'
      return 'border-green-500/20'
    }
    
    if (activity.shame) return 'border-shame-500/20'
    
    return 'border-white/5'
  }

  const getDayIcon = (date) => {
    const activity = getActivityForDate(date)
    
    if (!activity) return null
    
    if (activity.verified) {
      if (activity.achievement === 'premium') return <Trophy className="w-4 h-4" />
      if (activity.achievement === 'gold') return <Star className="w-4 h-4" />
      return <CheckCircle className="w-4 h-4" />
    }
    
    if (activity.shame) return <XCircle className="w-4 h-4" />
    
    return <AlertCircle className="w-4 h-4" />
  }

  const getDayStats = () => {
    const activity = getActivityForDate(selectedDate)
    if (!activity) return null
    
    return {
      verified: activity.verified,
      streak: activity.streak,
      duration: activity.duration,
      achievement: activity.achievement,
      shame: activity.shame,
      message: activity.message
    }
  }

  const calculateMonthlyStats = () => {
    let verified = 0
    let shame = 0
    let totalMinutes = 0
    let currentStreak = 0
    let maxStreak = 0
    
    monthDays.forEach(day => {
      const activity = getActivityForDate(day)
      if (activity) {
        if (activity.verified) {
          verified++
          totalMinutes += activity.duration || 0
          currentStreak++
          maxStreak = Math.max(maxStreak, currentStreak)
        } else {
          if (activity.shame) shame++
          currentStreak = 0
        }
      }
    })
    
    return {
      verified,
      shame,
      totalMinutes,
      consistency: monthDays.length > 0 ? Math.round((verified / monthDays.length) * 100) : 0,
      maxStreak
    }
  }

  const monthlyStats = calculateMonthlyStats()

  const exportCalendar = () => {
    const data = {
      month: format(currentDate, 'MMMM yyyy'),
      stats: monthlyStats,
      activities: activity
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `touchgrass-calendar-${format(currentDate, 'yyyy-MM')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const DayCell = ({ date, isCurrentMonth }) => {
    const activity = getActivityForDate(date)
    const isSelected = isSameDay(date, selectedDate)
    const isTodayDate = isToday(date)
    
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setHoveredDate(date)}
        onMouseLeave={() => setHoveredDate(null)}
        onClick={() => {
          setSelectedDate(date)
          onDateSelect?.(date, activity)
        }}
        className={`
          relative aspect-square rounded-xl border-2
          ${getDayColor(date)} ${getDayBorder(date)}
          ${isSelected ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-grass-500' : ''}
          ${isTodayDate ? 'border-dashed border-grass-400' : ''}
          ${!isCurrentMonth ? 'opacity-40' : ''}
          transition-all duration-300 flex flex-col items-center justify-center
          overflow-hidden
        `}
      >
        {/* Day number */}
        <motion.span
          animate={isSelected ? { scale: 1.2 } : { scale: 1 }}
          className={`text-sm font-medium ${
            isSelected ? 'text-white' : 
            activity?.verified ? 'text-gray-100' : 
            activity?.shame ? 'text-gray-300' : 
            'text-gray-400'
          }`}
        >
          {format(date, 'd')}
        </motion.span>

        {/* Activity icon */}
        {activity && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-1"
          >
            {getDayIcon(date)}
          </motion.div>
        )}

        {/* Streak indicator */}
        {activity?.streak && activity.streak > 1 && (
          <div className="absolute bottom-1 right-1">
            <div className="flex items-center gap-0.5">
              <Flame className="w-3 h-3 text-orange-400" />
              <span className="text-xs font-bold">{activity.streak}</span>
            </div>
          </div>
        )}

        {/* Hover effect */}
        {hoveredDate && isSameDay(date, hoveredDate) && (
          <motion.div
            layoutId="hoverBg"
            className="absolute inset-0 bg-white/10 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {/* Today indicator */}
        {isTodayDate && (
          <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-grass-400 animate-pulse" />
        )}
      </motion.button>
    )
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl border border-white/10 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-grass-500/10 to-grass-600/5 border border-grass-500/20 flex items-center justify-center"
            >
              <Calendar className="w-6 h-6 text-grass-400" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold">Activity Calendar</h2>
              <p className="text-sm text-gray-400">Visualize your accountability journey</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Navigation */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevMonth}
                className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToToday}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-all duration-300"
              >
                Today
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextMonth}
                className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* View Mode */}
            <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
              {['month', 'week', 'heatmap'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-2 text-sm rounded-lg transition-all duration-300 ${
                    viewMode === mode
                      ? 'bg-white/10 text-white'
                      : 'hover:bg-white/5 text-gray-400'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportCalendar}
                className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300"
              >
                <Download className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300"
              >
                <Filter className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Current month display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                {format(currentDate, 'MMMM yyyy')}
              </h3>
              <p className="text-sm text-gray-400">
                {monthDays.length} days • {format(monthStart, 'MMM d')} - {format(monthEnd, 'MMM d')}
              </p>
            </div>
            
            {/* Monthly stats */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-grass-400">
                  {monthlyStats.verified}
                </div>
                <div className="text-xs text-gray-400">Verified days</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-shame-400">
                  {monthlyStats.shame}
                </div>
                <div className="text-xs text-gray-400">Shame days</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {monthlyStats.consistency}%
                </div>
                <div className="text-xs text-gray-400">Consistency</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        {loading ? (
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 42 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-white/5 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {/* Previous month's days */}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => {
              const date = new Date(monthStart)
              date.setDate(date.getDate() - (monthStart.getDay() - i))
              return (
                <DayCell
                  key={`prev-${i}`}
                  date={date}
                  isCurrentMonth={false}
                />
              )
            })}

            {/* Current month's days */}
            {monthDays.map((date) => (
              <DayCell
                key={format(date, 'yyyy-MM-dd')}
                date={date}
                isCurrentMonth={true}
              />
            ))}

            {/* Next month's days */}
            {Array.from({ 
              length: (42 - monthStart.getDay() - monthDays.length) 
            }).map((_, i) => {
              const date = new Date(monthEnd)
              date.setDate(date.getDate() + i + 1)
              return (
                <DayCell
                  key={`next-${i}`}
                  date={date}
                  isCurrentMonth={false}
                />
              )
            })}
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-sm font-medium text-gray-400">Legend:</div>
            
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-grass-500/20 to-grass-600/10 border border-grass-500/30" />
              <span className="text-sm text-gray-300">Verified</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-premium-gold/20 to-yellow-600/10 border border-premium-gold/30" />
              <span className="text-sm text-gray-300">Achievement</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-shame-500/10 to-shame-600/5 border border-shame-500/20" />
              <span className="text-sm text-gray-300">Shame day</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-white/5 border border-white/10" />
              <span className="text-sm text-gray-300">Inactive</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Day Details */}
      <AnimatePresence>
        {getDayStats() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-6 border-t border-white/10 bg-gradient-to-r from-grass-500/5 to-transparent"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-lg font-bold">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </div>
                  {isToday(selectedDate) && (
                    <span className="px-2 py-1 bg-grass-500/20 text-grass-400 text-xs rounded-full">
                      Today
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  {getDayStats().verified ? (
                    <>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-grass-400" />
                        <span className="text-sm text-gray-300">Verified</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Duration: {getDayStats().duration} minutes
                      </div>
                      {getDayStats().achievement && (
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-premium-gold" />
                          <span className="text-sm text-premium-gold">
                            {getDayStats().achievement} achievement
                          </span>
                        </div>
                      )}
                    </>
                  ) : getDayStats().shame ? (
                    <>
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-shame-400" />
                        <span className="text-sm text-shame-400">Shame day</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Reason: {getDayStats().message}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-400">
                      No activity recorded
                    </div>
                  )}
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all duration-300"
              >
                View Details
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heatmap View (if enabled) */}
      {showHeatmap && viewMode === 'heatmap' && (
        <div className="p-6 border-t border-white/10">
          <h3 className="text-lg font-bold mb-4">Activity Heatmap</h3>
          <div className="grid grid-cols-14 gap-1">
            {Array.from({ length: 365 }).map((_, i) => {
              const date = new Date()
              date.setDate(date.getDate() - (364 - i))
              const activity = getActivityForDate(date)
              
              let intensity = 0
              if (activity?.verified) intensity = activity.duration > 60 ? 3 : activity.duration > 30 ? 2 : 1
              if (activity?.shame) intensity = -1
              
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.2 }}
                  className={`w-3 h-3 rounded ${
                    intensity === 3 ? 'bg-grass-500' :
                    intensity === 2 ? 'bg-grass-400' :
                    intensity === 1 ? 'bg-grass-300' :
                    intensity === -1 ? 'bg-shame-400' :
                    'bg-white/5'
                  }`}
                />
              )
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>1 year ago</span>
            <span>Today</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Example usage component
export const CalendarDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  const handleDateSelect = (date, activity) => {
    setSelectedDate(date)
  }

  return (
    <div className="space-y-8">
      <CalendarView
        onDateSelect={handleDateSelect}
        showHeatmap={true}
        view="month"
      />
      
      {/* Quick stats below calendar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-white/10 p-6">
          <div className="text-sm text-gray-400 mb-2">Current Streak</div>
          <div className="text-3xl font-bold text-grass-400">42 days</div>
          <div className="text-sm text-gray-500 mt-2">🔥 Personal best: 89 days</div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-white/10 p-6">
          <div className="text-sm text-gray-400 mb-2">Monthly Consistency</div>
          <div className="text-3xl font-bold">94%</div>
          <div className="text-sm text-gray-500 mt-2">🎯 Goal: 90% for Elite tier</div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-white/10 p-6">
          <div className="text-sm text-gray-400 mb-2">Total Outdoor Time</div>
          <div className="text-3xl font-bold text-premium-gold">127h</div>
          <div className="text-sm text-gray-500 mt-2">⏱️ Average: 45min/day</div>
        </div>
      </div>
    </div>
  )
}

export default CalendarView