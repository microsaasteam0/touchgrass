const moment = require('moment');

class StreakCalculator {
  constructor() {
    this.timezone = 'UTC';
  }

  // Calculate current streak from history
  calculateCurrentStreak(history) {
    if (!history || history.length === 0) {
      return 0;
    }

    // Sort history by date descending
    const sortedHistory = [...history]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .filter(entry => entry.verified);

    if (sortedHistory.length === 0) {
      return 0;
    }

    let streak = 0;
    let currentDate = moment().startOf('day');
    let foundBreak = false;

    for (const entry of sortedHistory) {
      const entryDate = moment(entry.date).startOf('day');
      const daysDiff = currentDate.diff(entryDate, 'days');

      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak) {
        // Found a break in the streak
        foundBreak = true;
        break;
      }
    }

    // Check if streak is still active (last entry was today or yesterday)
    if (!foundBreak && sortedHistory.length > 0) {
      const lastEntryDate = moment(sortedHistory[0].date).startOf('day');
      const today = moment().startOf('day');
      const daysSinceLast = today.diff(lastEntryDate, 'days');

      if (daysSinceLast > 1) {
        streak = 0; // Streak broken if more than 1 day gap
      }
    }

    return streak;
  }

  // Calculate longest streak from history
  calculateLongestStreak(history) {
    if (!history || history.length === 0) {
      return 0;
    }

    const sortedHistory = [...history]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .filter(entry => entry.verified);

    if (sortedHistory.length === 0) {
      return 0;
    }

    let longestStreak = 0;
    let currentStreak = 1;
    let previousDate = moment(sortedHistory[0].date).startOf('day');

    for (let i = 1; i < sortedHistory.length; i++) {
      const currentDate = moment(sortedHistory[i].date).startOf('day');
      const daysDiff = currentDate.diff(previousDate, 'days');

      if (daysDiff === 1) {
        // Consecutive day
        currentStreak++;
      } else if (daysDiff > 1) {
        // Break in streak
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }

      previousDate = currentDate;
    }

    // Check final streak
    longestStreak = Math.max(longestStreak, currentStreak);

    return longestStreak;
  }

  // Calculate consistency percentage
  calculateConsistency(history, totalDaysTracked) {
    if (!history || history.length === 0 || totalDaysTracked === 0) {
      return 0;
    }

    const verifiedDays = history.filter(entry => entry.verified).length;
    const consistency = (verifiedDays / totalDaysTracked) * 100;
    
    return Math.min(100, Math.round(consistency * 10) / 10); // Round to 1 decimal
  }

  // Check if streak is active (verified today)
  isStreakActiveToday(history) {
    if (!history || history.length === 0) {
      return false;
    }

    const today = moment().startOf('day');
    const todayEntry = history.find(entry => 
      moment(entry.date).startOf('day').isSame(today) && entry.verified
    );

    return !!todayEntry;
  }

  // Check if streak is at risk (not verified yesterday)
  isStreakAtRisk(history) {
    if (!history || history.length === 0) {
      return true; // No streak means it's "at risk" of not starting
    }

    const yesterday = moment().subtract(1, 'day').startOf('day');
    const yesterdayEntry = history.find(entry => 
      moment(entry.date).startOf('day').isSame(yesterday) && entry.verified
    );

    return !yesterdayEntry;
  }

  // Get streak milestone information
  getStreakMilestone(streakLength) {
    const milestones = [
      { days: 1, name: 'First Step', emoji: '👣', reward: 'starter' },
      { days: 3, name: 'Getting Started', emoji: '🌱', reward: 'motivation' },
      { days: 7, name: 'Weekly Warrior', emoji: '🏆', reward: 'weekly_badge' },
      { days: 14, name: 'Fortnight Champion', emoji: '🥈', reward: 'fortnight_badge' },
      { days: 30, name: 'Monthly Maestro', emoji: '🌟', reward: 'monthly_badge' },
      { days: 60, name: 'Two-Month Titan', emoji: '💪', reward: 'titan_badge' },
      { days: 90, name: 'Quarter Queen/King', emoji: '👑', reward: 'quarter_badge' },
      { days: 100, name: 'Century Club', emoji: '💯', reward: 'century_badge' },
      { days: 180, name: 'Half-Year Hero', emoji: '🦸', reward: 'half_year_badge' },
      { days: 365, name: 'Yearling', emoji: '🎉', reward: 'yearly_badge' },
      { days: 500, name: 'Half-K', emoji: '🏅', reward: 'halfk_badge' },
      { days: 1000, name: 'Millennial Streak', emoji: '⚡', reward: 'millennial_badge' }
    ];

    // Find the next milestone
    const upcomingMilestones = milestones.filter(m => m.days > streakLength);
    const nextMilestone = upcomingMilestones.length > 0 ? upcomingMilestones[0] : null;

    // Find achieved milestones
    const achievedMilestones = milestones.filter(m => m.days <= streakLength);

    // Find current milestone (most recently achieved)
    const currentMilestone = achievedMilestones.length > 0 
      ? achievedMilestones[achievedMilestones.length - 1]
      : null;

    return {
      currentStreak: streakLength,
      currentMilestone,
      nextMilestone,
      daysToNext: nextMilestone ? nextMilestone.days - streakLength : null,
      achievedMilestones,
      totalMilestones: milestones.length,
      progressToNext: nextMilestone 
        ? Math.min(100, Math.round((streakLength / nextMilestone.days) * 100))
        : 100,
      isSpecialMilestone: [7, 30, 100, 365].includes(streakLength)
    };
  }

  // Calculate streak freeze required
  calculateFreezeRequired(history) {
    if (!history || history.length === 0) {
      return { required: false, daysMissed: 0 };
    }

    const sortedHistory = [...history]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .filter(entry => entry.verified);

    if (sortedHistory.length === 0) {
      return { required: false, daysMissed: 0 };
    }

    const lastVerifiedDate = moment(sortedHistory[0].date).startOf('day');
    const today = moment().startOf('day');
    const daysMissed = today.diff(lastVerifiedDate, 'days') - 1;

    if (daysMissed <= 0) {
      return { required: false, daysMissed: 0 };
    }

    // If missed more than 3 days, streak is broken
    if (daysMissed > 3) {
      return { required: false, daysMissed, broken: true };
    }

    return { 
      required: true, 
      daysMissed, 
      freezeTokensNeeded: daysMissed,
      canRestore: true,
      restoreCost: this.calculateRestoreCost(daysMissed)
    };
  }

  // Calculate cost to restore broken streak
  calculateRestoreCost(daysMissed, streakLength) {
    const baseCost = 4.99;
    const lengthMultiplier = Math.min(2, 1 + (streakLength / 365)); // Max 2x for year+ streaks
    const missedMultiplier = Math.min(3, 1 + (daysMissed * 0.5)); // Max 3x for 4+ days
    
    const cost = baseCost * lengthMultiplier * missedMultiplier;
    
    return {
      amount: Math.round(cost * 100) / 100, // Round to 2 decimals
      currency: 'USD',
      breakdown: {
        base: baseCost,
        lengthMultiplier,
        missedMultiplier,
        finalCost: Math.round(cost * 100) / 100
      }
    };
  }

  // Calculate optimal verification time
  calculateOptimalVerificationTime(history) {
    if (!history || history.length === 0) {
      return {
        optimalHour: 18, // 6 PM default
        optimalMinute: 0,
        confidence: 0,
        suggestion: 'Set a reminder for 6 PM'
      };
    }

    const verifiedEntries = history
      .filter(entry => entry.verified)
      .map(entry => ({
        hour: moment(entry.date).hour(),
        minute: moment(entry.date).minute()
      }));

    if (verifiedEntries.length === 0) {
      return {
        optimalHour: 18,
        optimalMinute: 0,
        confidence: 0,
        suggestion: 'Set a reminder for 6 PM'
      };
    }

    // Calculate average verification time
    const totalMinutes = verifiedEntries.reduce((sum, entry) => {
      return sum + (entry.hour * 60 + entry.minute);
    }, 0);

    const avgMinutes = Math.round(totalMinutes / verifiedEntries.length);
    const optimalHour = Math.floor(avgMinutes / 60);
    const optimalMinute = avgMinutes % 60;

    // Calculate consistency of verification time
    const timeDifferences = verifiedEntries.map(entry => {
      const entryMinutes = entry.hour * 60 + entry.minute;
      return Math.abs(entryMinutes - avgMinutes);
    });

    const avgDifference = timeDifferences.reduce((a, b) => a + b, 0) / timeDifferences.length;
    const confidence = Math.max(0, 100 - (avgDifference / 60 * 100)); // Convert to percentage

    let suggestion;
    if (confidence > 80) {
      suggestion = `You consistently verify around ${this.formatTime(optimalHour, optimalMinute)}. Keep it up!`;
    } else if (confidence > 50) {
      suggestion = `Try to verify around ${this.formatTime(optimalHour, optimalMinute)} for better consistency.`;
    } else {
      suggestion = 'Your verification times vary. Consider setting a fixed daily reminder.';
    }

    return {
      optimalHour,
      optimalMinute,
      confidence: Math.round(confidence),
      suggestion,
      averageTime: this.formatTime(optimalHour, optimalMinute),
      entriesAnalyzed: verifiedEntries.length
    };
  }

  // Calculate streak heatmap data
  calculateHeatmapData(history, startDate, endDate) {
    const heatmap = [];
    const currentDate = moment(startDate).startOf('day');
    const end = moment(endDate).startOf('day');

    while (currentDate <= end) {
      const dateStr = currentDate.format('YYYY-MM-DD');
      const entry = history.find(e => 
        moment(e.date).startOf('day').isSame(currentDate)
      );

      heatmap.push({
        date: dateStr,
        dateObj: currentDate.toDate(),
        verified: entry ? entry.verified : false,
        verificationMethod: entry ? entry.verificationMethod : null,
        shame: entry && entry.verificationMethod === 'shame',
        intensity: this.calculateHeatmapIntensity(entry, currentDate),
        streakDay: this.isStreakDay(history, currentDate),
        weekend: currentDate.day() === 0 || currentDate.day() === 6
      });

      currentDate.add(1, 'day');
    }

    // Calculate statistics
    const totalDays = heatmap.length;
    const verifiedDays = heatmap.filter(d => d.verified).length;
    const shameDays = heatmap.filter(d => d.shame).length;
    const streakDays = heatmap.filter(d => d.streakDay).length;
    const currentStreak = this.calculateCurrentStreakFromHeatmap(heatmap);

    return {
      heatmap,
      statistics: {
        totalDays,
        verifiedDays,
        shameDays,
        streakDays,
        currentStreak,
        verificationRate: totalDays > 0 ? Math.round((verifiedDays / totalDays) * 100) : 0,
        shameRate: verifiedDays > 0 ? Math.round((shameDays / verifiedDays) * 100) : 0,
        consistency: this.calculateConsistencyFromHeatmap(heatmap)
      },
      period: {
        start: startDate,
        end: endDate,
        days: totalDays
      }
    };
  }

  // Calculate streak statistics
  calculateStreakStatistics(history) {
    if (!history || history.length === 0) {
      return this.getEmptyStatistics();
    }

    const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstDate = moment(sortedHistory[0].date).startOf('day');
    const today = moment().startOf('day');
    const totalDaysTracked = today.diff(firstDate, 'days') + 1;

    const currentStreak = this.calculateCurrentStreak(history);
    const longestStreak = this.calculateLongestStreak(history);
    const consistency = this.calculateConsistency(history, totalDaysTracked);
    const isActiveToday = this.isStreakActiveToday(history);
    const isAtRisk = this.isStreakAtRisk(history);

    const verifiedEntries = history.filter(e => e.verified);
    const photoVerifications = verifiedEntries.filter(e => e.verificationMethod === 'photo').length;
    const shameVerifications = verifiedEntries.filter(e => e.verificationMethod === 'shame').length;
    const freezeUsed = history.filter(e => e.verificationMethod === 'freeze').length;

    const milestoneInfo = this.getStreakMilestone(currentStreak);
    const optimalTime = this.calculateOptimalVerificationTime(history);
    const freezeInfo = this.calculateFreezeRequired(history);

    // Calculate streaks by day of week
    const dayStats = this.calculateDayOfWeekStats(history);

    return {
      currentStreak,
      longestStreak,
      consistency,
      totalDaysTracked,
      verifiedDays: verifiedEntries.length,
      isActiveToday,
      isAtRisk,
      verificationMethods: {
        photo: photoVerifications,
        shame: shameVerifications,
        freeze: freezeUsed,
        total: verifiedEntries.length
      },
      milestone: milestoneInfo,
      optimalTime,
      freezeInfo,
      dayStats,
      recommendations: this.generateRecommendations({
        currentStreak,
        consistency,
        isAtRisk,
        shameVerifications,
        dayStats
      }),
      score: this.calculateStreakScore(currentStreak, consistency, totalDaysTracked)
    };
  }

  // Generate streak recommendations
  generateRecommendations(stats) {
    const recommendations = [];

    if (stats.currentStreak === 0) {
      recommendations.push({
        type: 'motivation',
        priority: 'high',
        title: 'Start Your Journey',
        message: 'Begin with a 3-day streak goal. Every journey starts with a single step!',
        action: 'Set 3-day goal'
      });
    } else if (stats.currentStreak < 7) {
      recommendations.push({
        type: 'goal',
        priority: 'medium',
        title: 'Aim for Weekly Warrior',
        message: `You're ${7 - stats.currentStreak} days away from your first weekly milestone!`,
        action: 'View milestone'
      });
    }

    if (stats.isAtRisk) {
      recommendations.push({
        type: 'reminder',
        priority: 'high',
        title: 'Streak at Risk',
        message: 'You missed yesterday. Verify today to keep your streak alive!',
        action: 'Verify now'
      });
    }

    if (stats.consistency < 70) {
      recommendations.push({
        type: 'consistency',
        priority: 'medium',
        title: 'Improve Consistency',
        message: `Your consistency is ${stats.consistency}%. Try to verify at the same time daily.`,
        action: 'Set daily reminder'
      });
    }

    if (stats.shameVerifications > stats.currentStreak * 0.3) {
      recommendations.push({
        type: 'verification',
        priority: 'low',
        title: 'Reduce Shame Days',
        message: 'Try to verify with photos more often for better accountability.',
        action: 'Enable photo reminders'
      });
    }

    // Check for weak days
    const weakDay = Object.entries(stats.dayStats).find(([day, data]) => data.verificationRate < 50);
    if (weakDay) {
      recommendations.push({
        type: 'pattern',
        priority: 'medium',
        title: `Weak ${weakDay[0]} Pattern`,
        message: `Your verification rate on ${weakDay[0]}s is only ${weakDay[1].verificationRate}%.`,
        action: 'Set special reminder'
      });
    }

    return recommendations;
  }

  // Calculate streak score (0-1000)
  calculateStreakScore(currentStreak, consistency, totalDays) {
    const streakScore = Math.min(500, (currentStreak / 365) * 500); // Max 500 for 365+ days
    const consistencyScore = (consistency / 100) * 300; // Max 300
    const longevityScore = Math.min(200, (totalDays / 730) * 200); // Max 200 for 2+ years
    
    return Math.round(streakScore + consistencyScore + longevityScore);
  }

  // Calculate day of week statistics
  calculateDayOfWeekStats(history) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const stats = {};
    
    days.forEach(day => {
      stats[day] = {
        total: 0,
        verified: 0,
        shame: 0,
        photo: 0,
        verificationRate: 0
      };
    });

    history.forEach(entry => {
      const date = moment(entry.date);
      const dayName = days[date.day()];
      const dayStat = stats[dayName];
      
      dayStat.total++;
      
      if (entry.verified) {
        dayStat.verified++;
        
        if (entry.verificationMethod === 'photo') {
          dayStat.photo++;
        } else if (entry.verificationMethod === 'shame') {
          dayStat.shame++;
        }
      }
    });

    // Calculate rates
    days.forEach(day => {
      const dayStat = stats[day];
      dayStat.verificationRate = dayStat.total > 0 
        ? Math.round((dayStat.verified / dayStat.total) * 100)
        : 0;
    });

    return stats;
  }

  // Helper methods
  formatTime(hour, minute) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
  }

  calculateHeatmapIntensity(entry, date) {
    if (!entry || !entry.verified) {
      return 0;
    }

    let intensity = 1; // Base intensity
    
    if (entry.verificationMethod === 'photo') {
      intensity += 1; // Photo verification is stronger
    }
    
    if (entry.duration && entry.duration > 30) {
      intensity += 0.5; // Longer duration
    }
    
    // Recent entries are more intense
    const daysAgo = moment().diff(date, 'days');
    if (daysAgo <= 7) {
      intensity += (7 - daysAgo) * 0.1;
    }

    return Math.min(3, intensity); // Cap at 3
  }

  isStreakDay(history, date) {
    const entry = history.find(e => 
      moment(e.date).startOf('day').isSame(date)
    );
    
    if (!entry || !entry.verified) {
      return false;
    }

    // Check if this day is part of a streak
    const prevDay = moment(date).subtract(1, 'day');
    const prevEntry = history.find(e => 
      moment(e.date).startOf('day').isSame(prevDay) && e.verified
    );

    const nextDay = moment(date).add(1, 'day');
    const nextEntry = history.find(e => 
      moment(e.date).startOf('day').isSame(nextDay) && e.verified
    );

    return !!prevEntry || !!nextEntry;
  }

  calculateCurrentStreakFromHeatmap(heatmap) {
    let streak = 0;
    const today = moment().startOf('day');
    
    // Sort from most recent to oldest
    const sortedHeatmap = [...heatmap].sort((a, b) => 
      moment(b.dateObj).diff(moment(a.dateObj))
    );

    for (const day of sortedHeatmap) {
      const dayDate = moment(day.dateObj);
      const daysDiff = today.diff(dayDate, 'days');
      
      if (day.verified && daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  calculateConsistencyFromHeatmap(heatmap) {
    const verifiedDays = heatmap.filter(d => d.verified).length;
    const totalDays = heatmap.length;
    
    return totalDays > 0 ? Math.round((verifiedDays / totalDays) * 100) : 0;
  }

  getEmptyStatistics() {
    return {
      currentStreak: 0,
      longestStreak: 0,
      consistency: 0,
      totalDaysTracked: 0,
      verifiedDays: 0,
      isActiveToday: false,
      isAtRisk: true,
      verificationMethods: {
        photo: 0,
        shame: 0,
        freeze: 0,
        total: 0
      },
      milestone: this.getStreakMilestone(0),
      optimalTime: {
        optimalHour: 18,
        optimalMinute: 0,
        confidence: 0,
        suggestion: 'Set a reminder for 6 PM'
      },
      freezeInfo: {
        required: false,
        daysMissed: 0
      },
      dayStats: this.calculateDayOfWeekStats([]),
      recommendations: this.generateRecommendations({
        currentStreak: 0,
        consistency: 0,
        isAtRisk: true,
        shameVerifications: 0,
        dayStats: this.calculateDayOfWeekStats([])
      }),
      score: 0
    };
  }

  // Predict future streak based on patterns
  predictFutureStreak(history, daysToPredict = 30) {
    const stats = this.calculateStreakStatistics(history);
    const predictions = [];
    
    const currentConsistency = stats.consistency / 100;
    const currentStreak = stats.currentStreak;
    
    for (let day = 1; day <= daysToPredict; day++) {
      const predictionDate = moment().add(day, 'days');
      const dayOfWeek = predictionDate.day();
      const dayStats = stats.dayStats[this.getDayName(dayOfWeek)];
      
      // Calculate probability based on consistency and day patterns
      let probability = currentConsistency;
      
      if (dayStats) {
        // Adjust probability based on historical day performance
        const dayPerformance = dayStats.verificationRate / 100;
        probability = (probability + dayPerformance) / 2;
      }
      
      // Streak maintenance probability decreases over time
      const streakDecay = Math.max(0.5, 1 - (day / 100));
      probability *= streakDecay;
      
      predictions.push({
        date: predictionDate.format('YYYY-MM-DD'),
        dayOfWeek: this.getDayName(dayOfWeek),
        predictedStreak: currentStreak + day,
        probability: Math.round(probability * 100),
        confidence: this.calculatePredictionConfidence(day, currentConsistency),
        milestone: this.getStreakMilestone(currentStreak + day).currentMilestone
      });
    }
    
    return {
      currentStreak,
      predictions,
      averageProbability: Math.round(predictions.reduce((sum, p) => sum + p.probability, 0) / predictions.length),
      likelyToReach: predictions.filter(p => p.probability >= 70).length,
      predictedLongestStreak: currentStreak + predictions.filter(p => p.probability >= 50).length
    };
  }

  getDayName(dayIndex) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
  }

  calculatePredictionConfidence(daysAhead, currentConsistency) {
    // Confidence decreases as we predict further into the future
    const baseConfidence = currentConsistency * 100;
    const decay = Math.min(1, daysAhead / 30); // 30 days to reach minimum confidence
    const minConfidence = 30;
    
    return Math.max(minConfidence, baseConfidence * (1 - decay * 0.5));
  }

  // Calculate streak comparison with friends
  compareWithFriends(userStreak, friendsStreaks) {
    const sortedStreaks = [...friendsStreaks].sort((a, b) => b.currentStreak - a.currentStreak);
    const userRank = sortedStreaks.findIndex(streak => streak.userId === userStreak.userId) + 1;
    const totalUsers = sortedStreaks.length;
    
    const betterThan = Math.round(((totalUsers - userRank) / totalUsers) * 100);
    const averageStreak = Math.round(sortedStreaks.reduce((sum, s) => sum + s.currentStreak, 0) / totalUsers);
    const medianStreak = sortedStreaks[Math.floor(totalUsers / 2)].currentStreak;
    
    return {
      userRank,
      totalUsers,
      betterThan,
      averageStreak,
      medianStreak,
      topStreak: sortedStreaks[0]?.currentStreak || 0,
      position: userRank <= 3 ? 'top' : userRank <= 10 ? 'high' : userRank <= 50 ? 'middle' : 'low',
      comparison: this.getComparisonMessage(userStreak.currentStreak, averageStreak, medianStreak, userRank)
    };
  }

  getComparisonMessage(userStreak, average, median, rank) {
    if (userStreak > average * 1.5) {
      return `You're crushing it! Your streak is ${Math.round((userStreak / average) * 100)}% above average.`;
    } else if (userStreak > average) {
      return `Great job! You're above average by ${userStreak - average} days.`;
    } else if (userStreak === average) {
      return "You're right at the average. Keep pushing!";
    } else {
      return `You're ${average - userStreak} days below average. You can do it!`;
    }
  }
}

module.exports = new StreakCalculator();