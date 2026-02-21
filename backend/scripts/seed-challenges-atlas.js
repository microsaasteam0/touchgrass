/**
 * Seed Built-in Challenges for MongoDB Atlas
 * Run with: node scripts/seed-challenges-atlas.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Challenge = require('../src/models/Challenge');

// Use MongoDB Atlas from environment or fallback
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://hitanshiee:Hitanshii14@touchgrass.dgyxbbm.mongodb.net/touchgrass?retryWrites=true&w=majority&appName=touchgrass';

// Built-in challenges data
const BUILT_IN_CHALLENGES = [
  {
    name: "Morning Grounding",
    type: "streak",
    category: "mindfulness",
    description: "Start your day standing barefoot on grass for 10 minutes while breathing deeply. Connect with the earth and set a positive intention for your day.",
    difficulty: "easy",
    icon: "🌅",
    duration: 30,
    rules: [
      "10 minutes barefoot on grass",
      "Deep breathing throughout",
      "No phone during routine",
      "Observe 3 things around you"
    ],
    participants: 1250,
    featured: true
  },
  {
    name: "Daily Sunset Watch",
    type: "streak",
    category: "mindfulness",
    description: "Watch sunset every evening without distractions for 15 minutes. Unwind and appreciate the beauty of the day ending.",
    difficulty: "easy",
    icon: "🌇",
    duration: 21,
    rules: [
      "15 minutes sunset watch",
      "No screens allowed",
      "Document sky colors",
      "Share one reflection"
    ],
    participants: 890,
    featured: false
  },
  {
    name: "Park Bench Meditation",
    type: "streak",
    category: "mindfulness",
    description: "Meditate on a park bench for 20 minutes daily, focusing on natural sounds around you.",
    difficulty: "medium",
    icon: "🧘",
    duration: 14,
    rules: [
      "Find different benches",
      "20 minutes meditation",
      "Focus on natural sounds",
      "No guided apps"
    ],
    participants: 670,
    featured: false
  },
  {
    name: "7-Day Fresh Air Challenge",
    type: "streak",
    category: "habit",
    description: "A gentle week-long challenge to help you start building the outdoor habit. Just 15 minutes daily!",
    difficulty: "easy",
    icon: "🌬️",
    duration: 7,
    rules: [
      "15 minutes outdoors daily",
      "Any outdoor activity",
      "Can skip 1 day",
      "Photo verification optional"
    ],
    participants: 1500,
    featured: true
  },
  {
    name: "30-Day Outdoor Challenge",
    type: "streak",
    category: "habit",
    description: "Go outside and touch grass every day for 30 days. Build a strong habit of spending time outdoors.",
    difficulty: "hard",
    icon: "🌳",
    duration: 30,
    rules: [
      "Go outside every day",
      "Minimum 15 minutes",
      "No skip days allowed",
      "Photo verification required"
    ],
    participants: 2000,
    featured: true
  },
  {
    name: "Weather Warrior",
    type: "streak",
    category: "discipline",
    description: "Go outside 15 minutes daily regardless of weather conditions. Build unstoppable discipline.",
    difficulty: "hard",
    icon: "🌧️",
    duration: 30,
    rules: [
      "15 minutes outside daily",
      "No weather excuses",
      "Document conditions",
      "Reflect on experience"
    ],
    participants: 320,
    featured: false
  },
  {
    name: "Digital Sunset",
    type: "streak",
    category: "detox",
    description: "No screens 1 hour before bed, replace with evening outdoor time. Improve sleep and connection.",
    difficulty: "medium",
    icon: "📵",
    duration: 21,
    rules: [
      "Screens off 60+ minutes",
      "Spend time outside",
      "Stargaze or walk",
      "Track sleep improvements"
    ],
    participants: 1250,
    featured: true
  },
  {
    name: "Morning Sunshine Challenge",
    type: "milestone",
    category: "routine",
    description: "Get outside within 30 minutes of waking up for 21 days. Start your day with nature!",
    difficulty: "medium",
    icon: "🌅",
    duration: 21,
    rules: [
      "Outside within 30 min of waking",
      "Minimum 10 minutes",
      "Sunrise preferred",
      "Same time daily"
    ],
    participants: 890,
    featured: false
  },
  {
    name: "Weekend Warrior",
    type: "milestone",
    category: "leisure",
    description: "Spend at least 1 hour outdoors each weekend for 8 weeks. Quality outdoor time on weekends!",
    difficulty: "easy",
    icon: "🗓️",
    duration: 56,
    rules: [
      "1+ hour outdoors each weekend",
      "Sat and Sun required",
      "Different location preferred",
      "Photo verification"
    ],
    participants: 450,
    featured: false
  },
  {
    name: "Consistency King",
    type: "points",
    category: "habit",
    description: "Maintain a 14-day outdoor streak with at least 20 minutes daily. Build reliable habits.",
    difficulty: "medium",
    icon: "👑",
    duration: 14,
    rules: [
      "20 minutes daily outdoors",
      "No skip days",
      "Same time preferred",
      "Track your progress"
    ],
    participants: 780,
    featured: false
  }
];

async function seedChallenges() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    console.log(`📡 URI: ${MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);
    
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing built-in challenges (only those marked as built-in)
    console.log('🗑️  Clearing existing built-in challenges...');
    const deleteResult = await Challenge.deleteMany({ 'metadata.isBuiltIn': true });
    console.log(`   Deleted ${deleteResult.deletedCount} existing built-in challenges`);

    // Create new challenges
    const challengesToInsert = BUILT_IN_CHALLENGES.map((challenge) => {
      const now = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + challenge.duration);

      return {
        name: challenge.name,
        description: challenge.description,
        type: challenge.type,
        category: challenge.category,
        difficulty: challenge.difficulty,
        creator: new mongoose.Types.ObjectId("000000000000000000000001"),
        status: 'active',
        settings: {
          duration: {
            value: challenge.duration,
            unit: 'days'
          },
          entryFee: 0,
          prizePool: 0,
          maxParticipants: 0,
          minParticipants: 1,
          visibility: 'public',
          verificationRequired: true,
          allowShameDays: true,
          strictMode: false
        },
        rules: {
          targetStreak: challenge.duration,
          targetDuration: 15,
          targetConsistency: 100,
          minDailyTime: 10,
          allowedVerificationMethods: ['manual', 'photo', 'location'],
          shamePenalty: 0,
          freezeAllowed: true,
          skipAllowed: false
        },
        duration: challenge.duration,
        schedule: {
          startDate: now,
          endDate: endDate,
          checkInTime: '20:00',
          timezone: 'UTC'
        },
        stats: {
          totalEntries: challenge.participants,
          activeParticipants: challenge.participants,
          completionRate: 0,
          averageScore: 0,
          totalPrizePool: 0
        },
        metadata: {
          isBuiltIn: true,
          challengeCode: `TG-${challenge.name.toUpperCase().replace(/\s+/g, '-').substring(0, 10)}-${Date.now()}`,
          tags: [challenge.category, challenge.difficulty, 'outdoor', 'habit'],
          icon: challenge.icon,
          bannerImage: null,
          themeColor: null,
          customRules: challenge.rules.join('\n'),
          featured: challenge.featured
        },
        participants: [],
        featured: challenge.featured
      };
    });

    const insertedChallenges = await Challenge.insertMany(challengesToInsert);
    console.log(`\n✅ Successfully seeded ${insertedChallenges.length} built-in challenges`);

    // Display summary
    console.log('\n📋 Seeded Challenges:');
    insertedChallenges.forEach((challenge, index) => {
      console.log(`  ${index + 1}. ${challenge.icon} ${challenge.name} (${challenge.duration} days) - ${challenge.featured ? '⭐ FEATURED' : ''}`);
    });

    console.log('\n✅ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding challenges:', error.message);
    process.exit(1);
  }
}

seedChallenges();
