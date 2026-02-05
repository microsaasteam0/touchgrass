import React from 'react';
  

  // Professional Emoji System for Business Communication

export const EMOJI_CATEGORIES = {
  STREAK: 'streak',
  ACHIEVEMENT: 'achievement',
  VERIFICATION: 'verification',
  SHAME: 'shame',
  PREMIUM: 'premium',
  BUSINESS: 'business',
  CHAT: 'chat',
  REACTION: 'reaction'
};

export const EMOJI_SETS = {
  // Streak-related emojis
  STREAK: {
    FIRE: '🔥', // Active streak
    GROWING: '📈', // Streak growing
    BROKEN: '💔', // Streak broken
    FROZEN: '❄️', // Streak frozen
    MILESTONE: '🏁', // Milestone reached
    CONSISTENCY: '⚡', // High consistency
    DAILY: '🌅', // Daily commitment
    WEEKLY: '📅', // Weekly achievement
    MONTHLY: '🗓️', // Monthly achievement
    YEARLY: '🎉' // Yearly achievement
  },

  // Achievement emojis
  ACHIEVEMENT: {
    TROPHY: '🏆', // General achievement
    MEDAL: '🎖️', // Competition winner
    CROWN: '👑', // spot
    STAR: '⭐', // Special achievement
    DIAMOND: '💎', // Rare achievement
    TROPHY_CUP: '🥇', // First place
    SILVER: '🥈', // Second place
    BRONZE: '🥉', // Third place
    RIBBON: '🎗️', // Participation
    CERTIFICATE: '📜' // Certification
  },

  // Verification methods
  VERIFICATION: {
    CAMERA: '📸', // Photo verification
    LOCATION: '📍', // GPS verification
    FITNESS: '🏃', // Fitness app
    WITNESS: '👁️', // Witness verification
    CHECKMARK: '✅', // Verified
    CROSS: '❌', // Not verified
    TIMER: '⏱️', // Time-based
    SUN: '☀️', // Outdoor
    MOON: '🌙', // Night verification
    WEATHER: '🌤️' // Weather proof
  },

  // Shame system emojis
  SHAME: {
    SKULL: '💀', // Ultimate shame
    GHOST: '👻', // Inactive user
    ZOMBIE: '🧟', // Digital zombie
    POOP: '💩', // Bad day
    CRYING: '😭', // Extreme shame
    COLD_SWEAT: '😰', // Nervous shame
    POUTING: '😤', // Angry shame
    SLEEPING: '😴', // Lazy
    YELLING: '🤬', // Furious
    WARNING: '⚠️' // Warning
  },

  // Premium features
  PREMIUM: {
    GEM: '💎', // Premium status
    STAR: '🌟', // Elite feature
    SPARKLES: '✨', // Special feature
    DIAMOND: '🔶', // Exclusive
    KEY: '🔑', // Access granted
    LOCK: '🔒', // Premium locked
    VIP: '🎫', // VIP access
    GOLD: '🥇', // Gold tier
    SILVER: '🥈', // Silver tier
    BRONZE: '🥉' // Bronze tier
  },

  // Business & professional
  BUSINESS: {
    BRIEFCASE: '💼', // Professional
    CHART: '📊', // Analytics
    MONEY: '💰', // Revenue
    GROWTH: '📈', // Growth
    TEAM: '👥', // Team
    PARTNERSHIP: '🤝', // Partnership
    INVESTMENT: '💹', // Investment
    AWARD: '🏅', // Award
    CERTIFIED: '📋', // Certified
    GLOBAL: '🌍' // International
  },

  // Chat & communication
  CHAT: {
    SPEECH: '💬', // Message
    THOUGHT: '💭', // Thought
    SHOUT: '🗯️', // Shout
    ANNOUNCEMENT: '📢', // Announcement
    EMAIL: '📧', // Email
    NOTIFICATION: '🔔', // Notification
    MUTE: '🔇', // Muted
    LOUD: '🔊', // Loud
    WAVE: '👋', // Greeting
    CLAP: '👏' // Congratulations
  },

  // Message reactions
  REACTION: {
    THUMBS_UP: '👍',
    THUMBS_DOWN: '👎',
    HEART: '❤️',
    FIRE: '🔥',
    LAUGH: '😂',
    SURPRISE: '😮',
    SAD: '😢',
    ANGRY: '😠',
    CELEBRATE: '🎉',
    CHECK: '✅'
  }
};

// Emoji functions for dynamic usage
export const EMOJI_FUNCTIONS = {
  // Get streak emoji based on days
  getStreakEmoji(days) {
    if (days === 0) return EMOJI_SETS.STREAK.BROKEN;
    if (days < 7) return '🌱'; // Seedling
    if (days < 30) return '🌿'; // Herb
    if (days < 100) return '🌳'; // Tree
    if (days < 365) return '🌲'; // Evergreen
    return '🏔️'; // Mountain
  },

  // Get achievement emoji based on rarity
  getAchievementEmoji(rarity) {
    const map = {
      common: '🥉',
      uncommon: '🥈',
      rare: '🥇',
      epic: '🏆',
      legendary: '👑',
      mythical: '💫'
    };
    return map[rarity] || '🎖️';
  },

  // Get shame emoji based on severity
  getShameEmoji(severity) {
    const levels = [
      '😅', // Mild
      '😓', // Moderate
      '😰', // Serious
      '😭', // Severe
      '💀' // Extreme
    ];
    return levels[Math.min(severity, levels.length - 1)];
  },

  // Get verification emoji based on method
  getVerificationEmoji(method) {
    const map = {
      photo: '📸',
      location: '📍',
      activity: '🏃',
      witness: '👁️',
      manual: '✍️',
      shame: '😔'
    };
    return map[method] || '✅';
  },

  // Get business metric emoji
  getBusinessEmoji(metric) {
    const map = {
      users: '👥',
      revenue: '💰',
      growth: '📈',
      retention: '📊',
      engagement: '🔥',
      virality: '🔄',
      satisfaction: '😊',
      performance: '⚡',
      uptime: '🟢',
      security: '🔒'
    };
    return map[metric] || '📋';
  }
};

// Emoji animations CSS
export const EMOJI_ANIMATIONS = `
/* Emoji Animation System */
.emoji {
  display: inline-block;
  font-style: normal;
  line-height: 1;
  vertical-align: middle;
}

/* Pulse Animation for Important Emojis */
.emoji-pulse {
  animation: emoji-pulse 2s ease-in-out infinite;
}

@keyframes emoji-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* Bounce Animation for Celebration */
.emoji-bounce {
  animation: emoji-bounce 0.5s ease infinite alternate;
}

@keyframes emoji-bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-10px);
  }
}

/* Spin Animation for Loading/Processing */
.emoji-spin {
  animation: emoji-spin 1s linear infinite;
}

@keyframes emoji-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Shake Animation for Attention */
.emoji-shake {
  animation: emoji-shake 0.5s ease-in-out infinite;
}

@keyframes emoji-shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

/* Float Animation for Premium Emojis */
.emoji-float {
  animation: emoji-float 3s ease-in-out infinite;
}

@keyframes emoji-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Heartbeat Animation for Love/Like */
.emoji-heartbeat {
  animation: emoji-heartbeat 1.5s ease-in-out infinite;
}

@keyframes emoji-heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(0.9);
  }
  75% {
    transform: scale(1.05);
  }
}

/* Fire Animation for Hot Streaks */
.emoji-fire {
  animation: emoji-fire 2s ease-in-out infinite;
  position: relative;
}

.emoji-fire::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, #ff6b00, transparent 70%);
  filter: blur(5px);
  opacity: 0.7;
  animation: fire-glow 2s ease-in-out infinite;
}

@keyframes emoji-fire {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes fire-glow {
  0%, 100% {
    opacity: 0.5;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translateX(-50%) scale(1.2);
  }
}

/* Sparkle Animation for Achievements */
.emoji-sparkle {
  position: relative;
}

.emoji-sparkle::before {
  content: '✨';
  position: absolute;
  top: -10px;
  left: -10px;
  animation: sparkle-rotate 2s linear infinite;
}

@keyframes sparkle-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Trophy Shine Animation */
.emoji-trophy {
  position: relative;
  overflow: hidden;
}

.emoji-trophy::before {
  content: '';
  position: absolute;
  top: -100%;
  left: -100%;
  width: 300%;
  height: 300%;
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(255, 255, 255, 0.8) 50%,
    transparent 100%
  );
  transform: rotate(45deg);
  animation: trophy-shine 3s ease-in-out infinite;
}

@keyframes trophy-shine {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}

/* Rain Animation for Shame */
.emoji-rain {
  animation: emoji-rain 0.5s ease-out;
}

@keyframes emoji-rain {
  0% {
    opacity: 0;
    transform: translateY(-50px) rotate(0deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotate(360deg);
  }
}

/* Confetti Explosion */
.emoji-confetti {
  position: relative;
}

.emoji-confetti::before,
.emoji-confetti::after {
  content: '🎊';
  position: absolute;
  top: 0;
  left: 0;
  animation: confetti-explode 1s ease-out forwards;
}

.emoji-confetti::before {
  animation-delay: 0.1s;
}

.emoji-confetti::after {
  animation-delay: 0.2s;
}

@keyframes confetti-explode {
  0% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.5) rotate(180deg);
  }
  100% {
    opacity: 0;
    transform: scale(1) rotate(360deg);
  }
}

/* Emoji Size Classes */
.emoji-xs {
  font-size: 12px;
}

.emoji-sm {
  font-size: 16px;
}

.emoji-md {
  font-size: 24px;
}

.emoji-lg {
  font-size: 32px;
}

.emoji-xl {
  font-size: 48px;
}

.emoji-xxl {
  font-size: 64px;
}

/* Emoji Container for Groups */
.emoji-group {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* Animated Emoji Backgrounds */
.emoji-bg-fire {
  background: linear-gradient(45deg, #ff6b00, #ffa500, #ff4500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: bg-fire 2s ease-in-out infinite;
}

@keyframes bg-fire {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.emoji-bg-rainbow {
  background: linear-gradient(
    90deg,
    #ff0000,
    #ffa500,
    #ffff00,
    #00ff00,
    #0000ff,
    #4b0082,
    #8b00ff
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 400% 100%;
  animation: bg-rainbow 3s linear infinite;
}

@keyframes bg-rainbow {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

/* Emoji Tooltip */
.emoji-tooltip {
  position: relative;
  cursor: help;
}

.emoji-tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
  z-index: 1000;
}

.emoji-tooltip:hover::after {
  opacity: 1;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .emoji,
  .emoji::before,
  .emoji::after {
    animation: none !important;
  }
}

/* Emoji Reaction System */
.emoji-reaction {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.emoji-reaction:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.emoji-reaction.active {
  background: rgba(34, 197, 94, 0.2);
  border: 2px solid #22c55e;
}

.emoji-reaction-count {
  font-size: 12px;
  margin-left: 4px;
  color: rgba(255, 255, 255, 0.7);
}

/* Emoji Picker Styles */
.emoji-picker-container {
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  position: absolute;
  z-index: 1000;
  backdrop-filter: blur(10px);
  animation: slide-in-up 0.3s ease-out;
}

.emoji-category-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 8px;
}

.emoji-category-tab {
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.emoji-category-tab:hover {
  background: rgba(255, 255, 255, 0.1);
}

.emoji-category-tab.active {
  background: #22c55e;
  color: white;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
  padding: 8px;
}

.emoji-grid-item {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 20px;
}

.emoji-grid-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}
`;

// Emoji utility functions
export const getStreakFireEmoji = (streak) => {
  if (streak >= 100) return '🔥'.repeat(3);
  if (streak >= 30) return '🔥'.repeat(2);
  if (streak >= 7) return '🔥';
  return '🌱';
};

export const getAchievementLevelEmoji = (level) => {
  const levels = ['🥚', '🐣', '🐥', '🐔', '🦅', '🐉', '👑'];
  return levels[Math.min(level, levels.length - 1)];
};

export const getShameLevelEmoji = (level) => {
  const levels = ['😅', '😓', '😰', '😭', '💀'];
  return levels[Math.min(level, levels.length - 1)];
};

export const getConsistencyEmoji = (percentage) => {
  if (percentage >= 95) return '⚡';
  if (percentage >= 80) return '🚀';
  if (percentage >= 60) return '🏃';
  if (percentage >= 40) return '🚶';
  return '🐌';
};