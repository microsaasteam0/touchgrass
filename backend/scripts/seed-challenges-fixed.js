const mongoose = require('mongoose');
const Challenge = require('../src/models/Challenge');
const User = require('../src/models/user');
require('dotenv').config();

const builtInChallenges = [
  {
    name: "The First 10 Minutes",
    type: "streak",
    description: "Start your day outside—no phone, no agenda. Just be present in the open air for the first 10 minutes after you wake up.",
    category: "daily",
    settings: {
      duration: { value: 30, unit: 'days' },
      entryFee: 0,
      prizePool: 0,
      maxParticipants: 0,
      minParticipants: 1,
      visibility: 'public',
      verificationRequired: true,
      allowShameDays: false,
      strictMode: false
    },
    rules: {
      targetStreak: 30,
      minDailyTime: 10,
      allowedVerificationMethods: ['photo', 'location'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["morning", "foundation", "mindfulness"],
      themeColor: "#FFD700",
      bannerImage: "☀️"
    }
  },
  {
    name: "The Silent Kilometer",
    type: "consistency",
    description: "Walk one full kilometer in complete silence—no phone, no music, no podcasts. Just you, your breath, and your surroundings.",
    category: "daily",
    settings: {
      duration: { value: 7, unit: 'days' },
      entryFee: 0,
      prizePool: 0,
      maxParticipants: 0,
      minParticipants: 1,
      visibility: 'public',
      verificationRequired: true,
      allowShameDays: false,
      strictMode: false
    },
    rules: {
      targetConsistency: 100,
      minDailyTime: 15,
      allowedVerificationMethods: ['photo', 'location'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["walking", "silence", "mindfulness"],
      themeColor: "#8B5CF6",
      bannerImage: "🤫"
    }
  },
  {
    name: "Greening Your Loop",
    type: "consistency",
    description: "For one week, you cannot take the exact same outdoor route twice. Find a new street, path, or trail every single time.",
    category: "weekly",
    settings: {
      duration: { value: 7, unit: 'days' },
      entryFee: 0,
      prizePool: 0,
      maxParticipants: 0,
      minParticipants: 1,
      visibility: 'public',
      verificationRequired: true,
      allowShameDays: false,
      strictMode: false
    },
    rules: {
      targetConsistency: 100,
      minDailyTime: 15,
      allowedVerificationMethods: ['photo', 'location'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["exploration", "routes", "variety"],
      themeColor: "#10B981",
      bannerImage: "🕸️"
    }
  },
  {
    name: "Sunrise-Sunset Bookends",
    type: "consistency",
    description: "Bookend your day with natural light. Be present for the sunrise and the sunset, no matter the weather. 5 minutes minimum each.",
    category: "weekly",
    settings: {
      duration: { value: 7, unit: 'days' },
      entryFee: 0,
      prizePool: 0,
      maxParticipants: 0,
      minParticipants: 1,
      visibility: 'public',
      verificationRequired: true,
      allowShameDays: false,
      strictMode: false
    },
    rules: {
      targetConsistency: 90,
      minDailyTime: 5,
      allowedVerificationMethods: ['photo'],
      freezeAllowed: false,
      skipAllowed: true
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["sunrise", "sunset", "discipline", "consistency"],
      themeColor: "#F59E0B",
      bannerImage: "🌅"
    }
  },
  {
    name: "The 5-Bench Circuit",
    type: "consistency",
    description: "Find and sit on 5 different public benches in your neighborhood or park. Observe the rhythm of life from each station.",
    category: "special",
    settings: {
      duration: { value: 7, unit: 'days' },
      entryFee: 0,
      prizePool: 0,
      maxParticipants: 0,
      minParticipants: 1,
      visibility: 'public',
      verificationRequired: true,
      allowShameDays: false,
      strictMode: false
    },
    rules: {
      targetConsistency: 100,
      minDailyTime: 3,
      allowedVerificationMethods: ['photo'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["community", "observation", "public spaces"],
      themeColor: "#6B7280",
      bannerImage: "🪑"
    }
  },
  {
    name: "The Weatherproof Pledge",
    type: "streak",
    description: "Go outside every day for 7 days, regardless of weather conditions. Rain, wind, or shine—your commitment doesn't waver.",
    category: "weekly",
    settings: {
      duration: { value: 7, unit: 'days' },
      entryFee: 0,
      prizePool: 0,
      maxParticipants: 0,
      minParticipants: 1,
      visibility: 'public',
      verificationRequired: true,
      allowShameDays: false,
      strictMode: false
    },
    rules: {
      targetStreak: 7,
      minDailyTime: 10,
      allowedVerificationMethods: ['photo'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["resilience", "weather", "commitment"],
      themeColor: "#3B82F6",
      bannerImage: "🌧️"
    }
  },
  {
    name: "Tree Identification Week",
    type: "consistency",
    description: "Learn to identify 5 different tree species in your local area. Find them, photograph them, and learn one fact about each.",
    category: "weekly",
    settings: {
      duration: { value: 7, unit: 'days' },
      entryFee: 0,
      prizePool: 0,
      maxParticipants: 0,
      minParticipants: 1,
      visibility: 'public',
      verificationRequired: true,
      allowShameDays: false,
      strictMode: false
    },
    rules: {
      targetConsistency: 100,
      minDailyTime: 10,
      allowedVerificationMethods: ['photo'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["learning", "nature", "trees", "education"],
      themeColor: "#059669",
      bannerImage: "🌳"
    }
  },
  {
    name: "The Digital Sunset",
    type: "consistency",
    description: "For one week, your last screen time of the day must end at least 1 hour before bedtime. Replace that time with an evening outdoor ritual.",
    category: "weekly",
    settings: {
      duration: { value: 7, unit: 'days' },
      entryFee: 0,
      prizePool: 0,
      maxParticipants: 0,
      minParticipants: 1,
      visibility: 'public',
      verificationRequired: true,
      allowShameDays: false,
      strictMode: false
    },
    rules: {
      targetConsistency: 100,
      minDailyTime: 60,
      allowedVerificationMethods: ['photo'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["digital detox", "sleep", "evening", "screens"],
      themeColor: "#DC2626",
      bannerImage: "📵"
    }
  },
  {
    name: "The Pilgrimage",
    type: "duration",
    description: "Walk to a meaningful local destination that you'd normally drive to. A friend's house, a favorite cafe, a library—earn the arrival.",
    category: "special",
    settings: {
      duration: { value: 1, unit: 'days' },
      entryFee: 0,
      prizePool: 0,
      maxParticipants: 0,
      minParticipants: 1,
      visibility: 'public',
      verificationRequired: true,
      allowShameDays: false,
      strictMode: false
    },
    rules: {
      targetDuration: 30,
      minDailyTime: 30,
      allowedVerificationMethods: ['photo', 'location'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["walking", "endurance", "local", "transport"],
      themeColor: "#7C3AED",
      bannerImage: "🥾"
    }
  },
  {
    name: "The Micro-Season Observer",
    type: "consistency",
    description: "Visit the same natural spot (a park, a tree, a pond) every day for 2 weeks and document the subtle daily changes.",
    category: "special",
    settings: {
      duration: { value: 14, unit: 'days' },
      entryFee: 0,
      prizePool: 0,
      maxParticipants: 0,
      minParticipants: 1,
      visibility: 'public',
      verificationRequired: true,
      allowShameDays: false,
      strictMode: false
    },
    rules: {
      targetConsistency: 100,
      minDailyTime: 5,
      allowedVerificationMethods: ['photo'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["mindfulness", "observation", "consistency", "nature"],
      themeColor: "#0891B2",
      bannerImage: "🔍"
    }
  },
  {
    name: "Morning Pages",
    type: "consistency",
    description: "Write 3 pages of stream-of-consciousness writing every morning. No editing, no judgment—just pure thought flow.",
    category: "daily",
    settings: {
      duration: { value: 30, unit: 'days' },
      entryFee: 0,
      prizePool: 0,
      maxParticipants: 0,
      minParticipants: 1,
      visibility: 'public',
      verificationRequired: true,
      allowShameDays: false,
      strictMode: false
    },
    rules: {
      targetConsistency: 100,
      minDailyTime: 60,
      allowedVerificationMethods: ['photo'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["creativity", "writing", "morning", "mindfulness"],
      themeColor: "#F59E0B",
      bannerImage: "📝"
    }
  },
  {
    name: "No Sugar Week",
    type: "consistency",
    description: "Eliminate all added sugars for 7 days. Read labels carefully and discover natural sweetness in foods.",
    category: "weekly",
    settings: {
      duration: { value: 7, unit: 'days' },
      entryFee: 0,
      prizePool: 0,
      maxParticipants: 0,
      minParticipants: 1,
      visibility: 'public',
      verificationRequired: true,
      allowShameDays: false,
      strictMode: false
    },
    rules: {
      targetConsistency: 100,
      minDailyTime: 0,
      allowedVerificationMethods: ['photo'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["health", "diet", "sugar", "wellness"],
      themeColor: "#EF4444",
      bannerImage: "🍎"
    }
  },
  {
    name: "Gratitude Practice",
    type: "consistency",
    description: "Write down 3 things you're grateful for every day. Focus on different aspects of your life each time.",
    category: "daily",
    settings: {
      duration: { value: 30, unit: 'days' },
      entryFee: 0,
      prizePool: 0,
      maxParticipants: 0,
      minParticipants: 1,
      visibility: 'public',
      verificationRequired: true,
      allowShameDays: false,
      strictMode: false
    },
    rules: {
      targetConsistency: 100,
      minDailyTime: 5,
      allowedVerificationMethods: ['photo'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["mindfulness", "gratitude", "positivity", "reflection"],
      themeColor: "#10B981",
      bannerImage: "🙏"
    }
  },
  {
    name: "Cold Shower Challenge",
    type: "consistency",
    description: "Take a cold shower every morning for 30 days. Start with 30 seconds and build up to 3 minutes.",
    category: "daily",
    settings: {
      duration: { value: 30, unit: 'days' },
      entryFee: 0,
      prizePool: 0,
      maxParticipants: 0,
      minParticipants: 1,
      visibility: 'public',
      verificationRequired: true,
      allowShameDays: false,
      strictMode: false
    },
    rules: {
      targetConsistency: 100,
      minDailyTime: 3,
      allowedVerificationMethods: ['photo'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["resilience", "cold exposure", "discipline", "health"],
      themeColor: "#3B82F6",
      bannerImage: "🧊"
    }
  },
  {
    name: "Reading Hour",
    type: "consistency",
    description: "Read for at least 1 hour every day. Fiction, non-fiction, articles—whatever expands your mind.",
    category: "daily",
    settings: {
      duration: { value: 30, unit: 'days' },
      entryFee: 0,
      prizePool: 0,
      maxParticipants: 0,
      minParticipants: 1,
      visibility: 'public',
      verificationRequired: true,
      allowShameDays: false,
      strictMode: false
    },
    rules: {
      targetConsistency: 100,
      minDailyTime: 60,
      allowedVerificationMethods: ['photo'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["learning", "reading", "knowledge", "growth"],
      themeColor: "#8B5CF6",
      bannerImage: "📚"
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
      console.log(`   - ${challenge.name} (${challenge.type})`);
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
