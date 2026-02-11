const mongoose = require('mongoose');
const Challenge = require('../src/models/Challenge');
const User = require('../src/models/user');
require('dotenv').config();

const businessChallenges = [
  {
    name: "Walking Board Meeting",
    type: "custom",
    description: "Conduct all 1:1 meetings while walking outdoors. No conference rooms allowed.",
    category: "special",
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
      minDailyTime: 30,
      allowedVerificationMethods: ['photo', 'location'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["leadership", "meetings", "productivity", "business"],
      themeColor: "#1E40AF",
      bannerImage: "👔",
      businessValue: "Improves focus, reduces meeting time by 40%",
      difficulty: "medium",
      icon: "👔"
    }
  },
  {
    name: "The Outdoor Sprint Review",
    type: "custom",
    description: "Hold your sprint retrospectives in a park. Physical movement = mental clarity.",
    category: "special",
    settings: {
      duration: { value: 90, unit: 'days' },
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
      minDailyTime: 90,
      allowedVerificationMethods: ['photo'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["agile", "team", "retrospective", "business"],
      themeColor: "#059669",
      bannerImage: "🏃‍♂️",
      businessValue: "67% more honest feedback reported",
      difficulty: "easy",
      icon: "🏃‍♂️"
    }
  },
  {
    name: "Commute Replacement Protocol",
    type: "custom",
    description: "Replace your morning commute with a 45-minute purposeful walk to 'arrive' at work mentally.",
    category: "special",
    settings: {
      duration: { value: 21, unit: 'days' },
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
      minDailyTime: 45,
      allowedVerificationMethods: ['photo', 'location'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["productivity", "commute", "morning", "business"],
      themeColor: "#DC2626",
      bannerImage: "🚶‍♂️",
      businessValue: "Morning productivity increase of 300%",
      difficulty: "hard",
      icon: "🚶‍♂️"
    }
  },
  {
    name: "Prospect Per Mile",
    type: "custom",
    description: "For every mile walked, identify and research 1 qualified prospect.",
    category: "special",
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
      allowedVerificationMethods: ['photo', 'location'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["sales", "prospecting", "research", "business"],
      themeColor: "#7C3AED",
      bannerImage: "🎯",
      businessValue: "Lead quality improves with outdoor research",
      difficulty: "medium",
      icon: "🎯"
    }
  },
  {
    name: "Client Empathy Walk",
    type: "custom",
    description: "Walk your client's neighborhood (virtually via Street View) before meetings.",
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
      minDailyTime: 15,
      allowedVerificationMethods: ['photo'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["customer-success", "empathy", "client-relations", "business"],
      themeColor: "#0891B2",
      bannerImage: "🗺️",
      businessValue: "Client satisfaction scores increase 45%",
      difficulty: "easy",
      icon: "🗺️"
    }
  },
  {
    name: "Patent Pending Stroll",
    type: "custom",
    description: "Generate 1 patent-worthy idea per week through deliberate outdoor thinking.",
    category: "special",
    settings: {
      duration: { value: 12, unit: 'weeks' },
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
      minDailyTime: 180,
      allowedVerificationMethods: ['photo'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["innovation", "creativity", "patents", "business"],
      themeColor: "#F59E0B",
      bannerImage: "💡",
      businessValue: "Teams produce 5x more innovative ideas",
      difficulty: "hard",
      icon: "💡"
    }
  },
  {
    name: "Architectural Solution Hunt",
    type: "custom",
    description: "Find 5 architectural solutions in nature to apply to business problems.",
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
      minDailyTime: 30,
      allowedVerificationMethods: ['photo'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["problem-solving", "architecture", "nature", "business"],
      themeColor: "#6B7280",
      bannerImage: "🏛️",
      businessValue: "Cross-disciplinary problem solving",
      difficulty: "medium",
      icon: "🏛️"
    }
  },
  {
    name: "Quarterly Earnings Hike",
    type: "custom",
    description: "Walk while analyzing earnings reports. Physical elevation helps see financial peaks/valleys.",
    category: "special",
    settings: {
      duration: { value: 90, unit: 'days' },
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
      allowedVerificationMethods: ['photo', 'location'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["finance", "analysis", "earnings", "business"],
      themeColor: "#10B981",
      bannerImage: "📈",
      businessValue: "Better pattern recognition in financial data",
      difficulty: "hard",
      icon: "📈"
    }
  },
  {
    name: "Risk Assessment Trail",
    type: "custom",
    description: "Assess business risks while navigating physical terrain challenges.",
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
      minDailyTime: 30,
      allowedVerificationMethods: ['photo'],
      freezeAllowed: false,
      skipAllowed: false
    },
    status: 'active',
    metadata: {
      isBuiltIn: true,
      tags: ["risk-management", "assessment", "strategy", "business"],
      themeColor: "#EF4444",
      bannerImage: "⚠️",
      businessValue: "Tangible risk understanding",
      difficulty: "medium",
      icon: "⚠️"
    }
  },
  {
    name: "Synchronized Standup",
    type: "custom",
    description: "Entire team does daily standup outdoors, walking in sync.",
    category: "team",
    settings: {
      duration: { value: 21, unit: 'days' },
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
      tags: ["team", "standup", "cohesion", "business"],
      themeColor: "#3B82F6",
      bannerImage: "👥",
      businessValue: "Team cohesion improves 89%",
      difficulty: "medium",
      icon: "👥"
    }
  },
  {
    name: "Promotion Pathway",
    type: "custom",
    description: "Walk the literal distance between your current role and next promotion.",
    category: "special",
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

async function seedBusinessChallenges() {
  try {
    console.log('🌱 Seeding business challenges...');

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

    // Check if business challenges already exist
    const existingBusiness = await Challenge.countDocuments({
      'metadata.isBuiltIn': true,
      category: 'business'
    });

    if (existingBusiness > 0) {
      console.log(`⚠️  ${existingBusiness} business challenges already exist. Skipping...`);
      return;
    }

    // Create challenges
    const challengesToCreate = businessChallenges.map(challenge => ({
      ...challenge,
      creator: systemUser._id,
      schedule: {
        startDate: new Date(),
        endDate: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)), // 1 year from now
        timezone: 'UTC'
      }
    }));

    const createdChallenges = await Challenge.insertMany(challengesToCreate);

    console.log(`✅ Successfully created ${createdChallenges.length} business challenges:`);
    createdChallenges.forEach(challenge => {
      console.log(`   - ${challenge.name} (${challenge.type})`);
    });

  } catch (error) {
    console.error('❌ Error seeding business challenges:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('📪 Disconnected from database');
  }
}

// Run if called directly
if (require.main === module) {
  seedBusinessChallenges()
    .then(() => {
      console.log('🎉 Business challenges seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Business challenges seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedBusinessChallenges, businessChallenges };
