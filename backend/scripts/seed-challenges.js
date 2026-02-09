const mongoose = require('mongoose');
const Challenge = require('../src/models/Challenge');
const User = require('../src/models/user');
require('dotenv').config();

const builtInChallenges = [
  {
    id: 1,
    name: "The First 10 Minutes",
    type: "foundation",
    description: "Start your day outside—no phone, no agenda. Just be present in the open air for the first 10 minutes after you wake up.",
    duration: "daily",
    rules: [
      "Go outside within 10 minutes of waking",
      "Stay for minimum 10 minutes",
      "No phone usage allowed",
      "Breathe deeply and observe your surroundings"
    ],
    difficulty: "easy",
    icon: "☀️",
    participants: 42,
    category: "mindfulness",
    isActive: true,
    isPublic: true,
    metadata: {
      isBuiltIn: true,
      tags: ["morning", "foundation", "mindfulness"],
      themeColor: "#FFD700"
    }
  },
  {
    id: 2,
    name: "The Silent Kilometer",
    type: "mindfulness",
    description: "Walk one full kilometer in complete silence—no phone, no music, no podcasts. Just you, your breath, and your surroundings.",
    duration: "daily",
    rules: [
      "1 km minimum distance (track via basic pedometer or map)",
      "Absolute silence (no audio input)",
      "Phone stays in pocket",
      "Note one small detail you've never noticed before"
    ],
    difficulty: "medium",
    icon: "🤫",
    participants: 28,
    category: "mindfulness",
    isActive: true,
    isPublic: true,
    metadata: {
      isBuiltIn: true,
      tags: ["walking", "silence", "mindfulness"],
      themeColor: "#8B5CF6"
    }
  },
  {
    id: 3,
    name: "Greening Your Loop",
    type: "exploration",
    description: "For one week, you cannot take the exact same outdoor route twice. Find a new street, path, or trail every single time.",
    duration: 7,
    rules: [
      "No repeated routes for 7 days",
      "Minimum 15 minutes per outing",
      "Must end at a new destination or starting point",
      "Map your week's 'spiderweb' in your journal"
    ],
    difficulty: "medium",
    icon: "🕸️",
    participants: 65,
    category: "exploration",
    isActive: true,
    isPublic: true,
    metadata: {
      isBuiltIn: true,
      tags: ["exploration", "routes", "variety"],
      themeColor: "#10B981"
    }
  },
  {
    id: 4,
    name: "Sunrise-Sunset Bookends",
    type: "discipline",
    description: "Bookend your day with natural light. Be present for the sunrise and the sunset, no matter the weather. 5 minutes minimum each.",
    duration: "weekly",
    rules: [
      "Catch sunrise (within 30 min of dawn)",
      "Catch sunset (within 30 min of dusk)",
      "At least 5 minutes of presence each",
      "Complete 5 out of 7 days in a week"
    ],
    difficulty: "hard",
    icon: "🌅",
    participants: 19,
    category: "discipline",
    isActive: true,
    isPublic: true,
    metadata: {
      isBuiltIn: true,
      tags: ["sunrise", "sunset", "discipline", "consistency"],
      themeColor: "#F59E0B"
    }
  },
  {
    id: 5,
    name: "The 5-Bench Circuit",
    type: "community",
    description: "Find and sit on 5 different public benches in your neighborhood or a park. Observe the rhythm of life from each station.",
    duration: "single",
    rules: [
      "Find 5 distinct benches",
      "Sit for at least 3 minutes each",
      "No phone while sitting",
      "Sketch or write one sentence about the view from each"
    ],
    difficulty: "easy",
    icon: "🪑",
    participants: 87,
    category: "community",
    isActive: true,
    isPublic: true,
    metadata: {
      isBuiltIn: true,
      tags: ["community", "observation", "public spaces"],
      themeColor: "#6B7280"
    }
  },
  {
    id: 6,
    name: "The Weatherproof Pledge",
    type: "resilience",
    description: "Go outside every day for 7 days, regardless of weather conditions. Rain, wind, or shine—your commitment doesn't waver.",
    duration: 7,
    rules: [
      "Minimum 10 minutes outside daily",
      "No weather-based excuses",
      "Document the conditions with a photo",
      "Reflect on how the weather affected your mood"
    ],
    difficulty: "hard",
    icon: "🌧️",
    participants: 31,
    category: "resilience",
    isActive: true,
    isPublic: true,
    metadata: {
      isBuiltIn: true,
      tags: ["resilience", "weather", "commitment"],
      themeColor: "#3B82F6"
    }
  },
  {
    id: 7,
    name: "Tree Identification Week",
    type: "learning",
    description: "Learn to identify 5 different tree species in your local area. Find them, photograph them, and learn one fact about each.",
    duration: 7,
    rules: [
      "Correctly identify 5 local tree species",
      "Visit at least one of each during the week",
      "Photograph leaf, bark, and overall shape",
      "Note the location of your favorite"
    ],
    difficulty: "medium",
    icon: "🌳",
    participants: 45,
    category: "learning",
    isActive: true,
    isPublic: true,
    metadata: {
      isBuiltIn: true,
      tags: ["learning", "nature", "trees", "education"],
      themeColor: "#059669"
    }
  },
  {
    id: 8,
    name: "The Digital Sunset",
    type: "detox",
    description: "For one week, your last screen time of the day must end at least 1 hour before bedtime. Replace that time with an evening outdoor ritual.",
    duration: 7,
    rules: [
      "Screens off 60+ minutes before bed",
      "Spend those 60 minutes outside (e.g., porch, walk, stargazing)",
      "No checking phones during outdoor time",
      "Track how your sleep quality changes"
    ],
    difficulty: "medium",
    icon: "📵",
    participants: 52,
    category: "detox",
    isActive: true,
    isPublic: true,
    metadata: {
      isBuiltIn: true,
      tags: ["digital detox", "sleep", "evening", "screens"],
      themeColor: "#DC2626"
    }
  },
  {
    id: 9,
    name: "The Pilgrimage",
    type: "endurance",
    description: "Walk to a meaningful local destination that you'd normally drive to. A friend's house, a favorite cafe, a library—earn the arrival.",
    duration: "single",
    rules: [
      "Choose a destination 30+ minutes away by foot",
      "Walk the entire way there",
      "No motorized transport allowed",
      "Share a photo from your destination as proof"
    ],
    difficulty: "hard",
    icon: "🥾",
    participants: 23,
    category: "endurance",
    isActive: true,
    isPublic: true,
    metadata: {
      isBuiltIn: true,
      tags: ["walking", "endurance", "local", "transport"],
      themeColor: "#7C3AED"
    }
  },
  {
    id: 10,
    name: "The Micro-Season Observer",
    type: "mindfulness",
    description: "Visit the same natural spot (a park, a tree, a pond) every day for 2 weeks and document the subtle daily changes.",
    duration: 14,
    rules: [
      "Visit the same spot daily",
      "Spend at least 5 minutes observing",
      "Take one photo or write one observation",
      "Create a time-lapse collage at the end"
    ],
    difficulty: "easy",
    icon: "🔍",
    participants: 68,
    category: "mindfulness",
    isActive: true,
    isPublic: true,
    metadata: {
      isBuiltIn: true,
      tags: ["mindfulness", "observation", "consistency", "nature"],
      themeColor: "#0891B2"
    }
  },
  {
    id: 11,
    name: "Daily Meditation",
    type: "mindfulness",
    description: "Meditate for 10 minutes daily to center your mind.",
    duration: "daily",
    rules: [
      "10 minutes minimum",
      "Find a quiet space",
      "Focus on breath or guided meditation",
      "Be consistent with timing"
    ],
    difficulty: "easy",
    icon: "🧘",
    participants: 70,
    category: "mindfulness",
    isActive: true,
    isPublic: true,
    metadata: {
      isBuiltIn: true,
      tags: ["meditation", "mindfulness", "calm"],
      themeColor: "#8B5CF6"
    }
  },
  {
    id: 12,
    name: "Healthy Eating",
    type: "health",
    description: "Eat at least 5 different vegetables daily.",
    duration: "daily",
    rules: [
      "5 different vegetables minimum",
      "Include in meals or snacks",
      "Try new vegetables",
      "Track variety"
    ],
    difficulty: "easy",
    icon: "🥦",
    participants: 48,
    category: "health",
    isActive: true,
    isPublic: true,
    metadata: {
      isBuiltIn: true,
      tags: ["nutrition", "health", "vegetables"],
      themeColor: "#10B981"
    }
  },
  {
    id: 13,
    name: "Daily Exercise",
    type: "fitness",
    description: "Exercise for 30 minutes daily, any activity you enjoy.",
    duration: "daily",
    rules: [
      "30 minutes minimum",
      "Any form of exercise",
      "Track your activity",
      "Vary activities to stay engaged"
    ],
    difficulty: "medium",
    icon: "💪",
    participants: 62,
    category: "fitness",
    isActive: true,
    isPublic: true,
    metadata: {
      isBuiltIn: true,
      tags: ["exercise", "fitness", "health"],
      themeColor: "#F97316"
    }
  },
  {
    id: 14,
    name: "Reading Challenge",
    type: "growth",
    description: "Read at least 20 pages from a book daily.",
    duration: "daily",
    rules: [
      "20 pages minimum",
      "Fiction or non-fiction",
      "Take brief notes on key points",
      "Discuss with others if possible"
    ],
    difficulty: "easy",
    icon: "📖",
    participants: 52,
    category: "growth",
    isActive: true,
    isPublic: true,
    metadata: {
      isBuiltIn: true,
      tags: ["reading", "books", "knowledge"],
      themeColor: "#6366F1"
    }
  },
  {
    id: 15,
    name: "Hydration Hero",
    type: "health",
    description: "Drink 8 glasses of water daily.",
    duration: "daily",
    rules: [
      "8 glasses (about 2 liters)",
      "Track throughout the day",
      "Carry a reusable water bottle",
      "Notice energy level improvements"
    ],
    difficulty: "easy",
    icon: "💧",
    participants: 58,
    category: "health",
    isActive: true,
    isPublic: true,
    metadata: {
      isBuiltIn: true,
      tags: ["hydration", "water", "health"],
      themeColor: "#06B6D4"
    }
  },
  {
    id: 16,
    name: "Sleep Schedule",
    type: "health",
    description: "Maintain a consistent sleep schedule of 8 hours nightly.",
    duration: "daily",
    rules: [
      "8 hours of sleep",
      "Consistent bedtime and wake time",
      "Create a bedtime routine",
      "Track sleep quality"
    ],
    difficulty: "medium",
    icon: "😴",
    participants: 43,
    category: "health",
    isActive: true,
    isPublic: true,
    metadata: {
      isBuiltIn: true,
      tags: ["sleep", "rest", "health"],
      themeColor: "#1F2937"
    }
  },
  {
    id: 17,
    name: "Social Connection",
    type: "social",
    description: "Call or meet with one friend or family member daily.",
    duration: "daily",
    rules: [
      "One meaningful connection",
      "Call, meet, or video chat",
      "Focus on quality conversation",
      "Alternate people to stay connected"
    ],
    difficulty: "easy",
    icon: "📞",
    participants: 49,
    category: "social",
    isActive: true,
    isPublic: true,
    metadata: {
      isBuiltIn: true,
      tags: ["social", "connection", "relationships"],
      themeColor: "#EC4899"
    }
  },
  {
    id: 18,
    name: "Creative Writing",
    type: "creativity",
    description: "Write 500 words daily - stories, thoughts, or reflections.",
    duration: "daily",
    rules: [
      "500 words minimum",
      "Any form of writing",
      "Set a timer if needed",
      "Review and edit weekly"
    ],
    difficulty: "medium",
    icon: "✍️",
    participants: 36,
    category: "creativity",
    isActive: true,
    isPublic: true,
    metadata: {
      isBuiltIn: true,
      tags: ["writing", "creativity", "expression"],
      themeColor: "#7C3AED"
    }
  },
  {
    id: 19,
    name: "Gardening Time",
    type: "exploration",
    description: "Spend 15 minutes tending to plants or gardening daily.",
    duration: "daily",
    rules: [
      "15 minutes minimum",
      "Water, prune, or plant",
      "Indoor or outdoor plants",
      "Observe growth over time"
    ],
    difficulty: "easy",
    icon: "🌱",
    participants: 41,
    category: "exploration",
    isActive: true,
    isPublic: true,
    metadata: {
      isBuiltIn: true,
      tags: ["gardening", "plants", "nature"],
      themeColor: "#22C55E"
    }
  },
  {
    id: 20,
    name: "Eco-Friendly Living",
    type: "sustainability",
    description: "Take one action daily to reduce waste and help the environment.",
    duration: "daily",
    rules: [
      "One eco-friendly action",
      "Examples: reuse, recycle, reduce plastic",
      "Track your impact",
      "Educate others when possible"
    ],
    difficulty: "easy",
    icon: "🌍",
    participants: 47,
    category: "sustainability",
    isActive: true,
    isPublic: true,
    metadata: {
      isBuiltIn: true,
      tags: ["environment", "sustainability", "eco"],
      themeColor: "#059669"
    }
  }
];

async function seedBuiltInChallenges() {
  try {
    console.log('🌱 Seeding built-in challenges...');

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/touchgrass');
    console.log('📡 Connected to database');

    // Find or create system user for built-in challenges
    let systemUser = await User.findOne({ email: 'system@touchgrass.app' });

    if (!systemUser) {
      systemUser = new User({
        email: 'system@touchgrass.app',
        username: 'TouchGrass',
        displayName: 'TouchGrass Team',
        password: 'system-password-12345678', // Required by schema
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=system',
        preferences: {
          profileVisibility: 'private',
          showOnLeaderboard: false
        },
        status: 'active'
      });
      await systemUser.save();
      console.log('👤 Created system user');
    }

    // Check if built-in challenges already exist
    const existingBuiltIn = await Challenge.countDocuments({ 'metadata.isBuiltIn': true });

    if (existingBuiltIn > 0) {
      console.log(`⚠️  ${existingBuiltIn} built-in challenges already exist. Skipping...`);
      return;
    }

    // Create challenges
    const challengesToCreate = builtInChallenges.map(challenge => ({
      ...challenge,
      creator: systemUser._id,
      schedule: {
        startDate: new Date(),
        endDate: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)), // 1 year from now
        timezone: 'UTC'
      }
    }));

    const createdChallenges = await Challenge.insertMany(challengesToCreate);

    console.log(`✅ Successfully created ${createdChallenges.length} built-in challenges:`);
    createdChallenges.forEach(challenge => {
      console.log(`   - ${challenge.name} (${challenge.difficulty})`);
    });

  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('📪 Disconnected from database');
  }
}

// Run if called directly
if (require.main === module) {
  seedBuiltInChallenges()
    .then(() => {
      console.log('🎉 Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedBuiltInChallenges, builtInChallenges };
