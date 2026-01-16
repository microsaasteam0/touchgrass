import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { 
  Calendar, TrendingUp, Filter, Download,
  MoreVertical, RefreshCw, Zap, Activity
} from 'lucide-react'
import { useInView } from 'react-intersection-observer'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
)

const ActivityChart = ({ 
  view = 'daily',
  timeframe = '7d',
  loading = false 
}) => {
  const [activeView, setActiveView] = useState(view)
  const [activeTimeframe, setActiveTimeframe] = useState(timeframe)
  const [hoveredData, setHoveredData] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1
  })
  const chartRef = useRef()

  // Motion values for interactive effects
  const hoverX = useMotionValue(0)
  const hoverOpacity = useMotionValue(0)

  const timeframes = [
    { id: '7d', label: '7D', days: 7 },
    { id: '30d', label: '30D', days: 30 },
    { id: '90d', label: '90D', days: 90 },
    { id: '1y', label: '1Y', days: 365 }
  ]

  const views = [
    { id: 'daily', label: 'Daily', icon: Calendar },
    { id: 'weekly', label: 'Weekly', icon: TrendingUp },
    { id: 'monthly', label: 'Monthly', icon: Activity }
  ]

  // Generate mock data based on timeframe
  const generateData = () => {
    const days = timeframes.find(t => t.id === activeTimeframe)?.days || 7
    
    const labels = []
    const activityData = []
    const goalData = []
    
    let baseValue = 80
    const today = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      if (activeTimeframe === '7d') {
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }))
      } else if (activeTimeframe === '30d') {
        labels.push(date.getDate().toString())
      } else {
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
      }
      
      // Simulate realistic activity patterns
      const noise = Math.sin(i * 0.5) * 15 + Math.random() * 10
      const weekendFactor = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1
      const trend = i > days * 0.7 ? 1.2 : 1 // Simulate recent improvement
      
      const value = Math.max(20, Math.min(100, baseValue + noise * weekendFactor * trend))
      activityData.push(value)
      goalData.push(75) // Constant goal line
    }
    
    return { labels, activityData, goalData }
  }

  const { labels, activityData, goalData } = generateData()

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Activity Level',
        data: activityData,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#16a34a',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2
      },
      {
        label: 'Goal Line',
        data: goalData,
        borderColor: 'rgba(251, 191, 36, 0.6)',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0,
        fill: false,
        pointRadius: 0
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#9ca3af',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y}%`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11
          },
          callback: (value) => `${value}%`
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    onHover: (event, chartElement) => {
      if (chartElement.length > 0) {
        const index = chartElement[0].index
        setHoveredData({
          value: activityData[index],
          label: labels[index],
          index
        })
        hoverX.set(chartElement[0].element.x)
        animate(hoverOpacity, 1, { duration: 0.2 })
      } else {
        setHoveredData(null)
        animate(hoverOpacity, 0, { duration: 0.2 })
      }
    }
  }

  const exportChart = () => {
    if (chartRef.current) {
      const link = document.createElement('a')
      link.download = `touchgrass-activity-${activeTimeframe}.png`
      link.href = chartRef.current.toBase64Image()
      link.click()
    }
  }

  const calculateStats = () => {
    const current = activityData[activityData.length - 1]
    const average = activityData.reduce((a, b) => a + b, 0) / activityData.length
    const high = Math.max(...activityData)
    const trend = current > average ? 'up' : current < average ? 'down' : 'stable'
    
    return { current, average, high, trend }
  }

  const stats = calculateStats()

  const triggerAnimation = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl border border-white/10 overflow-hidden"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, var(--tw-grass-500) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-grass-500/10 to-grass-600/5 border border-grass-500/20 flex items-center justify-center"
              >
                <Activity className="w-5 h-5 text-grass-400" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold">Activity Analytics</h2>
                <p className="text-sm text-gray-400">Real-time performance tracking</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Selector */}
            <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
              {views.map((viewItem) => {
                const Icon = viewItem.icon
                return (
                  <button
                    key={viewItem.id}
                    onClick={() => setActiveView(viewItem.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      activeView === viewItem.id
                        ? 'bg-gradient-to-r from-grass-500 to-grass-600 text-white'
                        : 'hover:bg-white/5 text-gray-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{viewItem.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Timeframe Selector */}
            <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
              {timeframes.map((tf) => (
                <button
                  key={tf.id}
                  onClick={() => setActiveTimeframe(tf.id)}
                  className={`px-3 py-2 text-sm rounded-lg transition-all duration-300 ${
                    activeTimeframe === tf.id
                      ? 'bg-white/10 text-white'
                      : 'hover:bg-white/5 text-gray-400'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={triggerAnimation}
                className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300"
              >
                <RefreshCw className={`w-5 h-5 ${isAnimating ? 'animate-spin' : ''}`} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportChart}
                className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300"
              >
                <Download className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white/5 rounded-xl">
            <div className="text-sm text-gray-400 mb-1">Current Activity</div>
            <div className="text-2xl font-bold text-grass-400">{stats.current}%</div>
            <div className="text-xs text-gray-500">Today's performance</div>
          </div>
          
          <div className="p-4 bg-white/5 rounded-xl">
            <div className="text-sm text-gray-400 mb-1">Average</div>
            <div className="text-2xl font-bold">{stats.average.toFixed(1)}%</div>
            <div className="text-xs text-gray-500">Period average</div>
          </div>
          
          <div className="p-4 bg-white/5 rounded-xl">
            <div className="text-sm text-gray-400 mb-1">Peak</div>
            <div className="text-2xl font-bold text-premium-gold">{stats.high}%</div>
            <div className="text-xs text-gray-500">Best performance</div>
          </div>
          
          <div className="p-4 bg-white/5 rounded-xl">
            <div className="text-sm text-gray-400 mb-1">Trend</div>
            <div className={`text-2xl font-bold flex items-center gap-2 ${
              stats.trend === 'up' ? 'text-grass-400' : 
              stats.trend === 'down' ? 'text-shame-400' : 'text-gray-400'
            }`}>
              {stats.trend === 'up' ? '↗' : stats.trend === 'down' ? '↘' : '→'}
              <span className="text-sm">
                {stats.trend === 'up' ? 'Improving' : 
                 stats.trend === 'down' ? 'Declining' : 'Stable'}
              </span>
            </div>
            <div className="text-xs text-gray-500">vs. average</div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="p-6">
        <div className="relative h-80">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-grass-500/30 border-t-grass-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Hover Tooltip Line */}
              <motion.div
                style={{ 
                  x: hoverX,
                  opacity: hoverOpacity 
                }}
                className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-grass-500 to-transparent z-10 pointer-events-none"
              />

              {/* Hover Data Card */}
              {hoveredData && (
                <motion.div
                  style={{ 
                    x: hoverX,
                    opacity: hoverOpacity 
                  }}
                  className="absolute -top-16 transform -translate-x-1/2 z-20"
                >
                  <div className="bg-gray-900 border border-white/10 rounded-xl p-4 shadow-2xl min-w-48">
                    <div className="text-sm text-gray-400 mb-2">{hoveredData.label}</div>
                    <div className="text-2xl font-bold text-grass-400 mb-1">
                      {hoveredData.value}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {hoveredData.value >= 75 ? '🎯 Above goal' : 
                       hoveredData.value >= 50 ? '📈 Good effort' : 
                       '📉 Needs improvement'}
                    </div>
                    <div className="w-2 h-2 bg-gray-900 border-r border-b border-white/10 rotate-45 absolute -bottom-1 left-1/2 transform -translate-x-1/2" />
                  </div>
                </motion.div>
              )}

              {/* Animated Sparkles on data points */}
              {isAnimating && activityData.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ 
                    scale: [0, 2, 0],
                    opacity: [1, 0.5, 0]
                  }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.05,
                    repeat: 1
                  }}
                  className="absolute w-2 h-2 bg-gradient-to-r from-grass-400 to-cyan-400 rounded-full pointer-events-none"
                  style={{
                    left: `${(index / (activityData.length - 1)) * 100}%`,
                    top: `${100 - value}%`
                  }}
                />
              ))}

              {/* Main Chart */}
              <Line
                ref={chartRef}
                data={chartData}
                options={chartOptions}
              />
            </>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-grass-500 to-grass-600" />
              <span className="text-sm text-gray-400">Activity Level</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-dashed border-premium-gold rounded-full" />
              <span className="text-sm text-gray-400">Goal (75%)</span>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <span className="text-grass-400 font-bold">Pro Tip:</span> Maintain 75%+ for Elite tier rewards
          </div>
        </div>
      </div>

      {/* Footer Insights */}
      <div className="p-6 border-t border-white/10 bg-gradient-to-r from-grass-500/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-grass-400" />
            <div>
              <div className="font-medium">Weekly Insights</div>
              <div className="text-sm text-gray-400">
                {stats.trend === 'up' 
                  ? 'Your consistency is improving! Keep this momentum.'
                  : stats.trend === 'down'
                  ? 'Try to maintain daily verification for better results.'
                  : 'Steady progress. Push for higher consistency this week.'}
              </div>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-grass-500 to-grass-600 hover:from-grass-600 hover:to-grass-700 rounded-xl font-medium transition-all duration-300"
          >
            View Detailed Report
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default ActivityChart