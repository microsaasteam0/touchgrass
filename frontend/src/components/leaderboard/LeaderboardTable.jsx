import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import {
  Search, Filter, SortAsc, SortDesc, Users, TrendingUp,
  Globe, MapPin, Flame, Clock, Zap, ChevronUp, ChevronDown,
  Download, Share2, Grid, List, Settings, RefreshCw
} from 'lucide-react'
import LeaderboardCard from './LeaderboardCard'
import Podium from './Podium'
import RankBadge from './RankBadge'
import { useVirtualizer } from '@tanstack/react-virtual'

const LeaderboardTable = ({ 
  users, 
  currentUser, 
  loading, 
  onUserClick,
  onFilterChange,
  onSortChange,
  onExport,
  onShare
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    city: '',
    streakRange: [0, 1000],
    premiumOnly: false,
    activeOnly: false,
    showCurrentUser: true
  })
  const [sortConfig, setSortConfig] = useState({ key: 'currentStreak', direction: 'desc' })
  const [viewMode, setViewMode] = useState('cards') // 'cards' or 'table'
  const [selectedUsers, setSelectedUsers] = useState([])
  const [isScrolling, setIsScrolling] = useState(false)
  
  // Virtual scroll refs
  const parentRef = useRef(null)
  const scrollTimeoutRef = useRef(null)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  }

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.location?.city?.toLowerCase().includes(searchQuery.toLowerCase())

      // City filter
      const matchesCity = !filters.city || 
        user.location?.city?.toLowerCase() === filters.city.toLowerCase()

      // Streak range filter
      const matchesStreak = user.currentStreak >= filters.streakRange[0] && 
        user.currentStreak <= filters.streakRange[1]

      // Premium filter
      const matchesPremium = !filters.premiumOnly || user.isPremium

      // Active filter
      const matchesActive = !filters.activeOnly || user.isOnline

      return matchesSearch && matchesCity && matchesStreak && matchesPremium && matchesActive
    }).sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1
      
      switch (sortConfig.key) {
        case 'currentStreak':
          return (b.currentStreak - a.currentStreak) * direction
        case 'consistency':
          const consistencyA = (a.currentStreak / a.totalDays) * 100 || 0
          const consistencyB = (b.currentStreak / b.totalDays) * 100 || 0
          return (consistencyB - consistencyA) * direction
        case 'totalDays':
          return (b.totalDays - a.totalDays) * direction
        case 'longestStreak':
          return (b.longestStreak - a.longestStreak) * direction
        case 'name':
          return a.displayName.localeCompare(b.displayName) * direction
        case 'city':
          return (a.location?.city || '').localeCompare(b.location?.city || '') * direction
        default:
          return 0
      }
    })
  }, [users, searchQuery, filters, sortConfig])

  // Get unique cities for filter
  const cities = useMemo(() => {
    const citySet = new Set()
    users.forEach(user => {
      if (user.location?.city) {
        citySet.add(user.location.city)
      }
    })
    return Array.from(citySet).sort()
  }, [users])

  // Virtual scroll setup
  const rowVirtualizer = useVirtualizer({
    count: filteredUsers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Estimated row height
    overscan: 5
  })

  // Handle scroll detection for animations
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    const scrollElement = parentRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll)
      return () => scrollElement.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Handle sort click
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }))
  }

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <SortAsc className="w-4 h-4 opacity-0 group-hover:opacity-50" />
    return sortConfig.direction === 'asc' ? 
      <SortAsc className="w-4 h-4" /> : 
      <SortDesc className="w-4 h-4" />
  }

  // Export leaderboard data
  const handleExport = () => {
    const data = filteredUsers.map(user => ({
      Rank: filteredUsers.indexOf(user) + 1,
      Name: user.displayName,
      Username: user.username,
      'Current Streak': user.currentStreak,
      'Longest Streak': user.longestStreak,
      'Total Days': user.totalDays,
      City: user.location?.city || '',
      'Consistency %': Math.round((user.currentStreak / user.totalDays) * 100) || 0,
      Premium: user.isPremium ? 'Yes' : 'No',
      'Last Active': user.lastActive
    }))

    onExport(data)
  }

  // Share leaderboard
  const handleShare = () => {
    const topThree = filteredUsers.slice(0, 3).map(u => u.displayName).join(', ')
    const shareText = `🏆 Top 3 on TouchGrass Leaderboard:\n1. ${topThree}\n\nJoin the competition: touchgrass.now/leaderboard`
    
    onShare(shareText)
  }

  // Table view component
  const TableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left p-4">
              <button
                onClick={() => handleSort('rank')}
                className="flex items-center gap-2 font-bold hover:text-grass-400 transition-colors"
              >
                Rank
                {getSortIcon('rank')}
              </button>
            </th>
            <th className="text-left p-4">
              <button
                onClick={() => handleSort('name')}
                className="flex items-center gap-2 font-bold hover:text-grass-400 transition-colors"
              >
                User
                {getSortIcon('name')}
              </button>
            </th>
            <th className="text-left p-4">
              <button
                onClick={() => handleSort('currentStreak')}
                className="flex items-center gap-2 font-bold hover:text-grass-400 transition-colors"
              >
                <Flame className="w-4 h-4" />
                Current Streak
                {getSortIcon('currentStreak')}
              </button>
            </th>
            <th className="text-left p-4">
              <button
                onClick={() => handleSort('consistency')}
                className="flex items-center gap-2 font-bold hover:text-grass-400 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                Consistency
                {getSortIcon('consistency')}
              </button>
            </th>
            <th className="text-left p-4">
              <button
                onClick={() => handleSort('city')}
                className="flex items-center gap-2 font-bold hover:text-grass-400 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Location
                {getSortIcon('city')}
              </button>
            </th>
            <th className="text-left p-4">
              <button
                onClick={() => handleSort('longestStreak')}
                className="flex items-center gap-2 font-bold hover:text-grass-400 transition-colors"
              >
                <Zap className="w-4 h-4" />
                Longest
                {getSortIcon('longestStreak')}
              </button>
            </th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="p-4">
                <RankBadge rank={index + 1} />
              </td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-grass-500 to-grass-600 overflow-hidden">
                    {user.avatar && (
                      <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold">{user.displayName}</div>
                    <div className="text-sm text-gray-400">@{user.username}</div>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className="text-2xl font-bold text-grass-400">{user.currentStreak}</div>
                <div className="text-sm text-gray-400">days</div>
              </td>
              <td className="p-4">
                <div className="w-32">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{Math.round((user.currentStreak / user.totalDays) * 100) || 0}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${Math.min(100, (user.currentStreak / user.totalDays) * 100) || 0}%` 
                      }}
                      className="h-full bg-gradient-to-r from-grass-500 to-cyan-500 rounded-full"
                    />
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{user.location?.city || 'Unknown'}</span>
                </div>
              </td>
              <td className="p-4">
                <div className="text-lg font-bold">{user.longestStreak}</div>
                <div className="text-sm text-gray-400">days</div>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onUserClick(user.id)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
                  >
                    View
                  </button>
                  <button className="px-3 py-1.5 bg-grass-500/10 hover:bg-grass-500/20 text-grass-400 rounded-lg text-sm transition-colors">
                    Challenge
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // Card view component
  const CardView = () => (
    <div
      ref={parentRef}
      className="overflow-y-auto max-h-[calc(100vh-400px)] scrollbar-thin scrollbar-thumb-grass-500/30"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: 'relative'
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const user = filteredUsers[virtualRow.index]
          return (
            <motion.div
              key={user.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: isScrolling ? 0.7 : 1,
                scale: isScrolling ? 0.98 : 1 
              }}
              transition={{ duration: 0.2 }}
            >
              <LeaderboardCard
                user={user}
                rank={virtualRow.index + 1}
                onViewProfile={onUserClick}
                isCurrentUser={currentUser?.id === user.id}
              />
            </motion.div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Trophy className="w-6 h-6 text-premium-gold" />
              Global Leaderboard
              <span className="text-sm px-3 py-1 bg-grass-500/20 text-grass-400 rounded-full">
                {filteredUsers.length} Competitors
              </span>
            </h2>
            <p className="text-gray-400 mt-1">
              Real-time ranking of the most disciplined individuals
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-grass-500/10 hover:bg-grass-500/20 border border-grass-500/30 text-grass-400 rounded-xl transition-all duration-300"
            >
              <Share2 className="w-4 h-4" />
              Share
            </motion.button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 border-b border-white/10">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by name, username, or city..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-grass-500/50 transition-all duration-300"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={filters.city}
                onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                className="pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-grass-500/50 appearance-none"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            <label className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <input
                type="checkbox"
                checked={filters.premiumOnly}
                onChange={(e) => setFilters(prev => ({ ...prev, premiumOnly: e.target.checked }))}
                className="hidden"
              />
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                filters.premiumOnly ? 'bg-premium-gold border-premium-gold' : 'border-gray-500'
              }`}>
                {filters.premiumOnly && <Star className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm">Premium Only</span>
            </label>

            <label className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <input
                type="checkbox"
                checked={filters.activeOnly}
                onChange={(e) => setFilters(prev => ({ ...prev, activeOnly: e.target.checked }))}
                className="hidden"
              />
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                filters.activeOnly ? 'bg-green-500 border-green-500' : 'border-gray-500'
              }`}>
                {filters.activeOnly && <Users className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm">Active Now</span>
            </label>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('cards')}
              className={`p-3 rounded-xl transition-all duration-300 ${
                viewMode === 'cards' 
                  ? 'bg-grass-500/20 border border-grass-500/30' 
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              <Grid className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('table')}
              className={`p-3 rounded-xl transition-all duration-300 ${
                viewMode === 'table' 
                  ? 'bg-grass-500/20 border border-grass-500/30' 
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              <List className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-grass-500 animate-pulse" />
            <span className="text-sm text-gray-400">
              <span className="font-bold text-white">{filteredUsers.length}</span> total users
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-premium-gold animate-pulse" />
            <span className="text-sm text-gray-400">
              <span className="font-bold text-premium-gold">
                {filteredUsers.filter(u => u.isPremium).length}
              </span> premium users
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm text-gray-400">
              <span className="font-bold text-blue-400">
                {filteredUsers.filter(u => u.isOnline).length}
              </span> online now
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-grass-500/30 border-t-grass-500 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Flame className="w-6 h-6 text-grass-400" />
              </div>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">No users found</h3>
            <p className="text-gray-400">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <>
            {/* Podium for top 3 */}
            {viewMode === 'cards' && (
              <div className="mb-8">
                <Podium users={filteredUsers.slice(0, 3)} />
              </div>
            )}

            {/* User list */}
            <LayoutGroup>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={viewMode === 'cards' ? 'space-y-4' : ''}
              >
                {viewMode === 'cards' ? <CardView /> : <TableView />}
              </motion.div>
            </LayoutGroup>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/10 bg-black/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-sm text-gray-400">
            Data updates every 5 minutes • Last updated: Just now
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
              Back to top
            </button>
            
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardTable