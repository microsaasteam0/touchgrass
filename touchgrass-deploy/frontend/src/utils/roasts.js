// Professional Roast System for Accountability

// CSS for roast animations and styles
export const ROASTS_CSS = `
/* Roast System Styles */
.roast-container {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #ef4444;
  border-radius: 20px;
  padding: 24px;
  margin: 20px 0;
  position: relative;
  overflow: hidden;
  animation: roast-entrance 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes roast-entrance {
  0% {
    opacity: 0;
    transform: scale(0.8) rotate(-5deg);
  }
  70% {
    transform: scale(1.05) rotate(2deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
}

.roast-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(239, 68, 68, 0.3);
}

.roast-icon {
  font-size: 32px;
  animation: roast-icon-pulse 2s ease-in-out infinite;
}

@keyframes roast-icon-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.roast-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ef4444;
  margin: 0;
}

.roast-content {
  font-size: 1.125rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 20px;
  position: relative;
  padding-left: 20px;
}

.roast-content::before {
  content: "💀";
  position: absolute;
  left: 0;
  top: 0;
  font-size: 1rem;
}

.roast-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid rgba(239, 68, 68, 0.2);
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
}

.roast-severity {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.roast-severity.mild {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.roast-severity.medium {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.roast-severity.harsh {
  background: rgba(220, 38, 38, 0.2);
  color: #dc2626;
}

.roast-severity.brutal {
  background: rgba(127, 29, 29, 0.2);
  color: #7f1d1d;
}

.roast-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.roast-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #ef4444;
  border-radius: 50%;
  animation: roast-particle-fall 3s linear infinite;
}

@keyframes roast-particle-fall {
  0% {
    transform: translateY(-100%) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

.roast-fire {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 50px;
  background: linear-gradient(to top, #ef4444, #f59e0b, transparent);
  filter: blur(10px);
  opacity: 0.5;
  animation: roast-fire-flicker 1.5s ease-in-out infinite;
}

@keyframes roast-fire-flicker {
  0%, 100% {
    opacity: 0.4;
    transform: translateX(-50%) scaleY(0.8);
  }
  50% {
    opacity: 0.7;
    transform: translateX(-50%) scaleY(1.2);
  }
}

/* Shame Counter */
.shame-counter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
  border-radius: 12px;
  color: white;
  font-weight: 600;
  animation: shame-counter-pulse 3s ease-in-out infinite;
}

@keyframes shame-counter-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(127, 29, 29, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(127, 29, 29, 0);
  }
}

.shame-count {
  font-size: 1.5rem;
  font-weight: 800;
}

/* Redemption Button */
.redemption-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  animation: redemption-glow 2s ease-in-out infinite;
}

@keyframes redemption-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
  }
  50% {
    box-shadow: 0 0 40px rgba(34, 197, 94, 0.8);
  }
}

.redemption-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.4);
}

/* Public Shame Display */
.public-shame {
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
  border: 2px solid #8b5cf6;
  border-radius: 16px;
  padding: 20px;
  margin: 16px 0;
  position: relative;
  overflow: hidden;
}

.public-shame-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.public-shame-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.public-shame-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #ef4444;
}

.public-shame-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.public-shame-info h4 {
  margin: 0;
  font-size: 1rem;
  color: white;
}

.public-shame-info p {
  margin: 4px 0 0 0;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
}

.public-shame-message {
  font-style: italic;
  color: rgba(255, 255, 255, 0.9);
  padding: 16px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border-left: 4px solid #ef4444;
  margin: 0;
}

.public-shame-reactions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.public-shame-reaction {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.public-shame-reaction:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

/* Shame Leaderboard */
.shame-leaderboard {
  width: 100%;
  border-collapse: collapse;
}

.shame-leaderboard th {
  background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
  color: white;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
}

.shame-leaderboard td {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.shame-leaderboard tr:hover {
  background: rgba(127, 29, 29, 0.1);
}

.shame-leaderboard .rank {
  font-weight: 800;
  font-size: 1.25rem;
  color: #ef4444;
}

.shame-leaderboard .shame-count {
  font-weight: 700;
  color: #ef4444;
}

/* Shame Redemption Progress */
.shame-redemption-progress {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
}

.progress-bar-shame {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-shame-fill {
  height: 100%;
  background: linear-gradient(90deg, #ef4444, #f59e0b);
  border-radius: 4px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.progress-bar-shame-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: shame-progress-shimmer 2s infinite;
}

@keyframes shame-progress-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Shame Notification */
.shame-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
  border: 2px solid #ef4444;
  border-radius: 16px;
  padding: 20px;
  max-width: 300px;
  animation: shame-notification-slide 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 1000;
  box-shadow: 0 10px 25px rgba(127, 29, 29, 0.3);
}

@keyframes shame-notification-slide {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.shame-notification-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.shame-notification-icon {
  font-size: 24px;
  animation: shame-notification-pulse 2s ease-in-out infinite;
}

@keyframes shame-notification-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.shame-notification-title {
  font-weight: 700;
  color: white;
  margin: 0;
}

.shame-notification-message {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  margin: 0;
}
`;

// Roast categories and severity levels
export const ROAST_CATEGORIES = {
  DIGITAL_ZOMBIE: 'digital_zombie',
  INDOOR_CREATURE: 'indoor_creature',
  STREAK_BREAKER: 'streak_breaker',
  LAZY_DEVELOPER: 'lazy_developer',
  SCREEN_ADDICT: 'screen_addict',
  VITAMIN_D_DEFICIENT: 'vitamin_d_deficient',
  CHAIR_FUSED: 'chair_fused',
  MEME_LORD: 'meme_lord',
  PROCRASTINATION_KING: 'procrastination_king',
  WIFI_WARRIOR: 'wifi_warrior'
};

export const ROAST_SEVERITY = {
  MILD: 'mild',      // Playful, encouraging
  MEDIUM: 'medium',  // Direct, motivational
  HARSH: 'harsh',    // Brutally honest
  BRUTAL: 'brutal'   // Savage, but fair
};

// Roast database - Business professional roasts
export const ROASTS = {
  [ROAST_CATEGORIES.DIGITAL_ZOMBIE]: {
    [ROAST_SEVERITY.MILD]: [
      "Your chair might be getting more sunlight than you are. Just saying.",
      "I checked - even your houseplants get more outdoor time than you.",
      "Your screen time is starting to look like a phone number. International, at that.",
      "The grass is calling. It's asking if you still remember what it looks like.",
      "Your vitamin D levels are currently being sustained by artificial lighting."
    ],
    [ROAST_SEVERITY.MEDIUM]: [
      "You've evolved from human to houseplant. At least they photosynthesize.",
      "Your ISP probably thinks you're a bot at this point.",
      "The sun set and rose again without you noticing. That's... commitment.",
      "Your browser history has seen more action than your outdoor gear this week.",
      "Even your shadow is getting lonely. It forgot what you look like in natural light."
    ],
    [ROAST_SEVERITY.HARSH]: [
      "Your skin hasn't seen UV rays in so long, you're basically a vampire. Without the cool powers.",
      "The only thing you're touching is keyboard keys. The grass is literally right outside.",
      "You're one step away from developing gills from all this indoor air.",
      "Your step count is so low, your fitness tracker probably thinks you're furniture.",
      "The last time you went outside, TikTok wasn't even a thing yet."
    ],
    [ROAST_SEVERITY.BRUTAL]: [
      "Scientists could study you to understand extreme digital adaptation. You're basically evolving backwards.",
      "Your chair has permanent butt-shaped indentations. That's not a feature, that's a cry for help.",
      "If staying indoors was an Olympic sport, you'd have more gold medals than Michael Phelps.",
      "Your vitamin D deficiency is so advanced, you're basically photosynthesizing WiFi signals.",
      "The grass doesn't even recognize you as a mammal anymore. You're officially digital fauna."
    ]
  },

  [ROAST_CATEGORIES.INDOOR_CREATURE]: {
    [ROAST_SEVERITY.MILD]: [
      "The great outdoors called. It said 'nevermind, I'll try again tomorrow.'",
      "Your idea of 'nature' is the wallpaper on your second monitor.",
      "Fresh air is that thing that happens when you open the fridge, right?",
      "You know there's a whole world outside your window, right? With like, weather and stuff?",
      "Your daily steps could be counted on one hand. A toddler's hand."
    ],
    [ROAST_SEVERITY.MEDIUM]: [
      "You're becoming one with your furniture. Soon you'll develop USB ports.",
      "The only breeze you've felt today is from your computer fans.",
      "Your circadian rhythm is synced to your delivery app notifications.",
      "You've watched more sunsets on Netflix than in real life this month.",
      "Your outdoor gear is collecting more dust than memories."
    ],
    [ROAST_SEVERITY.HARSH]: [
      "You're so acclimated to indoor life, actual sunlight would probably give you a rash.",
      "The only 'hiking' you do is through your overflowing browser tabs.",
      "Your idea of 'camping' is when the WiFi goes down for five minutes.",
      "You've developed a symbiotic relationship with your office chair. It's concerning.",
      "Birds probably think your window is just a really fancy TV screen at this point."
    ],
    [ROAST_SEVERITY.BRUTAL]: [
      "If your life was a nature documentary, David Attenborough would be crying right now.",
      "You're basically a sentient piece of furniture at this point. The ottoman has more outdoor experience.",
      "Your fitness tracker's emergency alert is about to go off from sheer boredom.",
      "The last time you touched grass, it was probably artificial turf in a video game.",
      "You're becoming a case study in 'how not to be a functional human being.'"
    ]
  },

  [ROAST_CATEGORIES.STREAK_BREAKER]: {
    [ROAST_SEVERITY.MILD]: [
      "Your streak broke faster than a New Year's resolution. It's January 2nd somewhere, right?",
      "That streak was looking good! Until it wasn't. Like my attempts at cooking.",
      "You had a good run! A very, very short run. But still!",
      "Back to day 1! The only thing that's consistent is your inconsistency.",
      "Your consistency score just took a hit. It's okay, numbers can be scary."
    ],
    [ROAST_SEVERITY.MEDIUM]: [
      "Your streak lasted about as long as my attention span. Which isn't saying much.",
      "You were doing so well! What happened? Did you forget what 'outside' means?",
      "That streak had potential. Like a startup that ran out of funding after week 1.",
      "You went from hero to zero faster than a tech stock in a recession.",
      "Your streak broke. At least you're consistent at breaking things?"
    ],
    [ROAST_SEVERITY.HARSH]: [
      "Your commitment level is about as strong as a politician's promise.",
      "You had one job. ONE. Go outside. That's it. And you failed.",
      "Your discipline is weaker than a decaf coffee at a startup office.",
      "That streak died faster than my will to live on a Monday morning.",
      "You couldn't even commit to going outside for 24 hours. That's... impressively bad."
    ],
    [ROAST_SEVERITY.BRUTAL]: [
      "Your consistency makes a sieve look watertight. Absolutely porous.",
      "If commitment was a currency, you'd be bankrupt in a banana republic.",
      "Your streak lasted shorter than a Snapchat story. And was just as forgettable.",
      "You have the discipline of a goldfish with ADHD. Actually, that's insulting to goldfish.",
      "You managed to fail at the simplest task imaginable. Congratulations, that takes effort."
    ]
  },

  [ROAST_CATEGORIES.LAZY_DEVELOPER]: {
    [ROAST_SEVERITY.MILD]: [
      "Your code compiles faster than you get outside. That's saying something.",
      "You debug better than you exercise. And that's not a compliment.",
      "Your git commits are more consistent than your outdoor time.",
      "You'll optimize a loop but won't take a walk around the block. Priorities.",
      "Your stack overflow activity > your step count. By a lot."
    ],
    [ROAST_SEVERITY.MEDIUM]: [
      "Your IDE has seen more action than your running shoes this year.",
      "You can fix a memory leak but can't leak out of your house for 10 minutes.",
      "Your keyboard is getting more exercise than your legs. Typing doesn't count.",
      "You know the Big O notation of everything except the outdoors.",
      "Your Docker containers get more fresh air than you do."
    ],
    [ROAST_SEVERITY.HARSH]: [
      "You can architect a microservice but can't service your own need for sunlight.",
      "Your CI/CD pipeline is more active than your cardiovascular system.",
      "Your cloud infrastructure gets more updates than your outdoor time.",
      "You understand distributed systems but can't distribute yourself outside.",
      "Your API documentation is better organized than your life priorities."
    ],
    [ROAST_SEVERITY.BRUTAL]: [
      "Your systems have 99.99% uptime while your outdoor time has 99.99% downtime.",
      "You can scale to millions of requests but can't scale yourself to the front door.",
      "Your monitoring alerts get more attention than your health metrics.",
      "Your code has better test coverage than your life has outdoor coverage.",
      "Your deployment strategy is more robust than your commitment to basic human needs."
    ]
  }
};

// Professional business roasts for entrepreneurs
export const BUSINESS_ROASTS = {
  STARTUP_FOUNDER: [
    "Your burn rate is higher than your step count. And that's saying something.",
    "You can pitch to VCs but can't pitch yourself outside for 15 minutes.",
    "Your runway is longer than your last walk outside.",
    "You're chasing Series A funding but can't chase some fresh air.",
    "Your valuation grows faster than your outdoor time. Which isn't growing at all."
  ],
  VC_INVESTOR: [
    "You can spot a unicorn but can't spot the sun from your window.",
    "Your portfolio diversity > your activity diversity (it's all sitting).",
    "You analyze market trends but can't trend toward the outdoors.",
    "Your due diligence is thorough, except for due diligence on your own health.",
    "You're liquid in investments but frozen in outdoor activity."
  ],
  TECH_EXECUTIVE: [
    "You manage teams of hundreds but can't manage 10 minutes outside.",
    "Your OKRs are met, except the 'be a functional human being' one.",
    "You optimize business processes but can't process the concept of 'outside'.",
    "Your quarterly reports are more exciting than your outdoor adventures.",
    "You lead companies but can't lead yourself to the door."
  ]
};

// Roast generator functions
export const generateRoast = (category = null, severity = ROAST_SEVERITY.MEDIUM) => {
  const categories = category ? [category] : Object.keys(ROASTS);
  const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
  
  const categoryRoasts = ROASTS[selectedCategory];
  const severityRoasts = categoryRoasts[severity];
  
  return {
    text: severityRoasts[Math.floor(Math.random() * severityRoasts.length)],
    category: selectedCategory,
    severity,
    emoji: getRoastEmoji(severity)
  };
};

export const generateBusinessRoast = (role = null) => {
  const roles = role ? [role] : Object.keys(BUSINESS_ROASTS);
  const selectedRole = roles[Math.floor(Math.random() * roles.length)];
  const roasts = BUSINESS_ROASTS[selectedRole];
  
  return {
    text: roasts[Math.floor(Math.random() * roasts.length)],
    role: selectedRole,
    severity: ROAST_SEVERITY.MEDIUM,
    emoji: '💼'
  };
};

// Emoji getters for roasts
export const getRoastEmoji = (severity) => {
  const emojis = {
    [ROAST_SEVERITY.MILD]: '😅',
    [ROAST_SEVERITY.MEDIUM]: '😓',
    [ROAST_SEVERITY.HARSH]: '😰',
    [ROAST_SEVERITY.BRUTAL]: '💀'
  };
  return emojis[severity];
};

export const getCategoryEmoji = (category) => {
  const emojis = {
    [ROAST_CATEGORIES.DIGITAL_ZOMBIE]: '🧟',
    [ROAST_CATEGORIES.INDOOR_CREATURE]: '🏠',
    [ROAST_CATEGORIES.STREAK_BREAKER]: '💔',
    [ROAST_CATEGORIES.LAZY_DEVELOPER]: '💻',
    [ROAST_CATEGORIES.SCREEN_ADDICT]: '📱',
    [ROAST_CATEGORIES.VITAMIN_D_DEFICIENT]: '🌞',
    [ROAST_CATEGORIES.CHAIR_FUSED]: '🪑',
    [ROAST_CATEGORIES.MEME_LORD]: '🤡',
    [ROAST_CATEGORIES.PROCRATINATION_KING]: '👑',
    [ROAST_CATEGORIES.WIFI_WARRIOR]: '📶'
  };
  return emojis[category] || '😔';
};

// Roast analytics and tracking
export const ROAST_ANALYTICS = {
  trackRoast: (userId, roast, context = {}) => {
    // In production, this would send to analytics service
    console.log('Roast delivered:', {
      userId,
      roast,
      context,
      timestamp: new Date().toISOString()
    });
    
    return {
      success: true,
      roastId: `roast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  },

  getRoastStats: (userId) => {
    // Mock stats - would come from backend
    return {
      totalRoasts: 42,
      mostCommonCategory: ROAST_CATEGORIES.DIGITAL_ZOMBIE,
      averageSeverity: ROAST_SEVERITY.MEDIUM,
      redemptionRate: 0.85, // 85% redeem after roast
      lastRoast: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    };
  },

  calculateRoastEffectiveness: (userId) => {
    const stats = ROAST_ANALYTICS.getRoastStats(userId);
    return {
      effectiveness: stats.redemptionRate * 100,
      recommendation: stats.redemptionRate > 0.7 ? 'increase severity' : 'maintain current',
      nextRoastTime: 'tomorrow'
    };
  }
};

// Redemption encouragement messages
export const REDEMPTION_MESSAGES = [
  "But hey, tomorrow is a new day! Even the sun believes in second chances.",
  "This is your redemption arc! Make it count.",
  "Every master was once a beginner. Even at going outside.",
  "The only bad workout is the one you didn't do. Same applies to going outside.",
  "Your future self will thank you. Probably with better mental health.",
  "Even baby steps count. Literally, take some baby steps outside.",
  "You got this! Unless 'this' is staying indoors. Then don't get this.",
  "Progress, not perfection. But also, maybe try for some progress?",
  "The first step is the hardest. Especially if it's out the door.",
  "You're one decision away from a completely different life. That decision is 'go outside.'"
];

// Shame level calculator
export const calculateShameLevel = (streak, lastOutdoor, totalDays) => {
  const daysSince = Math.floor((Date.now() - new Date(lastOutdoor).getTime()) / 86400000);
  const consistency = totalDays > 0 ? (streak / totalDays) * 100 : 0;
  
  let shameLevel = 0;
  
  // Days since last outdoor
  if (daysSince >= 7) shameLevel += 3;
  else if (daysSince >= 3) shameLevel += 2;
  else if (daysSince >= 1) shameLevel += 1;
  
  // Consistency penalty
  if (consistency < 20) shameLevel += 3;
  else if (consistency < 50) shameLevel += 2;
  else if (consistency < 80) shameLevel += 1;
  
  // Streak length bonus (less shame for longer streaks)
  if (streak >= 30) shameLevel = Math.max(0, shameLevel - 2);
  else if (streak >= 7) shameLevel = Math.max(0, shameLevel - 1);
  
  return Math.min(4, Math.max(0, shameLevel));
};

// Public shame message generator
export const generatePublicShame = (user, shameLevel) => {
  const templates = [
    `🚨 ${user.displayName} failed to touch grass today! ${shameLevel > 2 ? '🚨' : ''}`,
    `📢 Public announcement: ${user.displayName} is officially a digital zombie today.`,
    `🏠 ${user.displayName} chose indoors over outdoors. The grass weeps.`,
    `💀 ${user.displayName}'s streak died today. Press F to pay respects.`,
    `📉 ${user.displayName} just took a hit to their consistency score. Ouch.`,
    `🌧️ ${user.displayName} is having an indoor day. The sun misses them.`,
    `🛋️ Breaking: ${user.displayName} fused with their furniture today.`,
    `📱 ${user.displayName} touched screens, not grass. The struggle is real.`,
    `💤 ${user.displayName} is sleeping on their outdoor responsibilities.`,
    `🎮 ${user.displayName} is gaming instead of claiming. The grass is unclaimed.`
  ];
  
  const excuses = [
    "Too busy coding",
    "Weather looked scary",
    "Forgot what 'outside' means",
    "Chair too comfy",
    "In a meeting... that ended 3 hours ago",
    "Waiting for the perfect moment",
    "Lost their shoes... in their own house",
    "Got distracted by a new Netflix show",
    "Thought about it really hard",
    "Decided tomorrow is better (it never is)"
  ];
  
  const template = templates[Math.floor(Math.random() * templates.length)];
  const excuse = excuses[Math.floor(Math.random() * excuses.length)];
  
  return {
    message: `${template} Excuse: "${excuse}"`,
    severity: shameLevel,
    canRedeem: shameLevel < 3,
    redeemBy: new Date(Date.now() + 86400000).toISOString() // 24 hours
  };
};

// Roast effectiveness metrics
export const ROAST_EFFECTIVENESS = {
  MILD: { redemptionRate: 0.65, repeatOffense: 0.45 },
  MEDIUM: { redemptionRate: 0.75, repeatOffense: 0.35 },
  HARSH: { redemptionRate: 0.85, repeatOffense: 0.25 },
  BRUTAL: { redemptionRate: 0.92, repeatOffense: 0.15 }
};

// Export utility functions
export const getRandomRoast = () => generateRoast();
export const getBusinessRoast = (role) => generateBusinessRoast(role);
export const getRedemptionMessage = () => 
  REDEMPTION_MESSAGES[Math.floor(Math.random() * REDEMPTION_MESSAGES.length)];