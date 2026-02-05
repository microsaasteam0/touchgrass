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
