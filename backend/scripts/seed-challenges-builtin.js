/**
 * Seed Built-in Challenges
 * Run with: node scripts/seed-challenges-builtin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Challenge = require('../src/models/Challenge');
const UserChallenge = require('../src/models/UserChallenge');

// Force local MongoDB for seeding - ignore env variable
const MONGO_URI = 'mongodb://127.0.0.1:27017/touchgrass';

// Built-in challenges data
const BUILT_IN_CHALLENGES = [
  {
    name: "Morning Grounding",
    type: "streak",
    category: "daily",
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
    category: "daily",
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
    category: "daily",
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
    name: "Tree Identification",
    type: "streak",
    category: "weekly",
    description: "Learn to identify 7 different tree species in your local area. Become familiar with nature around you.",
    difficulty: "medium",
    icon: "🌳",
    duration: 7,
    rules: [
      "Identify 7 different trees",
      "Take photos of leaves",
      "Learn one fact each",
      "Map their locations"
    ],
    participants: 430,
    featured: false
  },
  {
    name: "Silent Nature Walk",
    type: "streak",
    category: "daily",
    description: "Walk 30 minutes in nature without any technology or talking. Experience true peace.",
    difficulty: "medium",
    icon: "🤫",
    duration: 7,
    rules: [
      "30-minute silent walk",
      "No phone or music",
      "Observe 5 details",
      "No talking allowed"
    ],
    participants: 980,
    featured: false
  },
  {
    name: "Weather Warrior",
    type: "streak",
    category: "daily",
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
    featured: true
  },
  {
    name: "Digital Sunset",
    type: "streak",
    category: "daily",
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
    name: "5-Bench Circuit",
    type: "streak",
    category: "daily",
    description: "Visit and sit on 5 different public benches in your neighborhood. Explore your area.",
    difficulty: "easy",
    icon: "🪑",
    duration: 1,
    rules: [
      "Find 5 distinct benches",
      "Sit 3 minutes each",
      "No phone while sitting",
      "Sketch or write about view"
    ],
    participants: 560,
    featured: false
  },
  {
    name: "Bird Song Morning",
    type: "streak",
    category: "daily",
    description: "Spend 10 minutes each morning identifying bird songs. Tune into nature's music.",
    difficulty: "easy",
    icon: "🐦",
    duration: 14,
    rules: [
      "10 minutes listening daily",
      "Identify 3 bird species",
      "Note time and weather",
      "Use Merlin app for help"
    ],
    participants: 720,
    featured: false
  },
  {
    name: "Gratitude Grounding",
    type: "streak",
    category: "daily",
    description: "Stand on grass and list 10 things you're grateful for daily. Combine physical and mental wellness.",
    difficulty: "easy",
    icon: "🙏",
    duration: 30,
    rules: [
      "Barefoot on grass",
      "List 10 gratitudes",
      "Say them out loud",
      "No repeating items"
    ],
    participants: 890,
    featured: false
  },
  {
    name: "New Trail Every Week",
    type: "streak",
    category: "weekly",
    description: "Explore a new hiking or walking trail every week. Keep adventure alive.",
    difficulty: "medium",
    icon: "🥾",
    duration: 52,
    rules: [
      "New trail weekly",
      "Minimum 2km distance",
      "Take trail photo",
      "Rate difficulty 1-5"
    ],
    participants: 410,
    featured: false
  },
  {
    name: "Urban Nature Hunt",
    type: "streak",
    category: "daily",
    description: "Find and document 50 pieces of nature in urban environments. Discover nature everywhere.",
    difficulty: "medium",
    icon: "🏙️",
    duration: 30,
    rules: [
      "Document 50 nature finds",
      "Urban environments only",
      "Photos required",
      "Identify each find"
    ],
    participants: 380,
    featured: false
  },
  {
    name: "Sunrise Seeker",
    type: "streak",
    category: "daily",
    description: "Watch sunrise 5 days a week from different locations. Start your day with inspiration.",
    difficulty: "hard",
    icon: "🌄",
    duration: 28,
    rules: [
      "Sunrise 5x weekly",
      "Different locations",
      "Arrive 15 minutes early",
      "Journal reflections"
    ],
    participants: 290,
    featured: false
  },
  {
    name: "Micro-Season Observer",
    type: "streak",
    category: "daily",
    description: "Visit same spot daily for 2 weeks, document subtle changes. Train your observation skills.",
    difficulty: "easy",
    icon: "🔍",
    duration: 14,
    rules: [
      "Same spot daily",
      "5+ minutes observing",
      "One photo per day",
      "Note subtle changes"
    ],
    participants: 510,
    featured: false
  },
  {
    name: "Neighborhood Flora Map",
    type: "streak",
    category: "weekly",
    description: "Create map of all significant plants/trees in your neighborhood. Become a local expert.",
    difficulty: "medium",
    icon: "🗺️",
    duration: 7,
    rules: [
      "Map 20+ plants/trees",
      "GPS coordinates",
      "Photos and names",
      "Share with neighbors"
    ],
    participants: 270,
    featured: false
  },
  // Additional challenges to reach 50+
  {
    name: "Morning Hydration Walk",
    type: "streak",
    category: "daily",
    description: "Drink water and walk outside for 15 minutes first thing in the morning. Start hydrated and energized.",
    difficulty: "easy",
    icon: "💧",
    duration: 14,
    rules: [
      "Drink full glass of water",
      "15 min outdoor walk",
      "No phone during walk",
      "Observe morning scene"
    ],
    participants: 450,
    featured: false
  },
  {
    name: "Cloud Watching",
    type: "streak",
    category: "daily",
    description: "Lie on your back and watch clouds for 10 minutes daily. Train mindfulness and creativity.",
    difficulty: "easy",
    icon: "☁️",
    duration: 7,
    rules: [
      "10 minutes cloud watching",
      "Identify cloud types",
      "Find shapes in clouds",
      "No phone distraction"
    ],
    participants: 380,
    featured: false
  },
  {
    name: "Outdoor Reading",
    type: "streak",
    category: "daily",
    description: "Read outside for 30 minutes daily. Combine learning with nature.",
    difficulty: "easy",
    icon: "📖",
    duration: 21,
    rules: [
      "30 minutes outdoor reading",
      "Must be outside",
      "Natural light only",
      "One chapter minimum"
    ],
    participants: 520,
    featured: false
  },
  {
    name: "Street Art Discovery",
    type: "streak",
    category: "weekly",
    description: "Find and photograph 20 pieces of street art in your city. Explore new areas.",
    difficulty: "medium",
    icon: "🎨",
    duration: 14,
    rules: [
      "Find 20 street art pieces",
      "Photo documentation",
      "Note locations",
      "Learn artist names"
    ],
    participants: 290,
    featured: false
  },
  {
    name: "Morning Stretch Routine",
    type: "streak",
    category: "daily",
    description: "Do stretching exercises outside for 15 minutes every morning. Wake up your body.",
    difficulty: "easy",
    icon: "🧘‍♂️",
    duration: 30,
    rules: [
      "15 min outdoor stretching",
      "Full body routine",
      "Sunrise preferred",
      "No interruptions"
    ],
    participants: 680,
    featured: false
  },
  {
    name: "Sound Map Creation",
    type: "streak",
    category: "daily",
    description: "Create a sound map of different outdoor locations. Train your auditory awareness.",
    difficulty: "medium",
    icon: "🎵",
    duration: 7,
    rules: [
      "Visit 3 different locations",
      "Map sounds heard",
      "Identify 5+ sounds each",
      "Note time of day"
    ],
    participants: 210,
    featured: false
  },
  {
    name: "Outdoor Journaling",
    type: "streak",
    category: "daily",
    description: "Write in your journal outside for 20 minutes daily. Clear your mind in nature.",
    difficulty: "easy",
    icon: "📝",
    duration: 30,
    rules: [
      "20 minutes outdoor writing",
      "Nature observation notes",
      "Gratitude entry",
      "No indoor writing"
    ],
    participants: 410,
    featured: false
  },
  {
    name: "Geocaching Adventure",
    type: "streak",
    category: "weekly",
    description: "Find 10 geocaches in your area. Turn exploration into a treasure hunt.",
    difficulty: "medium",
    icon: "🗝️",
    duration: 14,
    rules: [
      "Find 10 geocaches",
      "Log each find",
      "Take proof photos",
      "Explore new areas"
    ],
    participants: 180,
    featured: false
  },
  {
    name: "Outdoor Nap",
    type: "streak",
    category: "daily",
    description: "Take a 20-minute outdoor nap in a hammock or bench. Rediscover restful sleep.",
    difficulty: "easy",
    icon: "😴",
    duration: 7,
    rules: [
      "20 min outdoor rest",
      "Nature sounds only",
      "No indoor naps",
      "Fresh air required"
    ],
    participants: 340,
    featured: false
  },
  {
    name: "Photography Walk",
    type: "streak",
    category: "daily",
    description: "Take 50 photos during your outdoor walk. Train your photographer's eye.",
    difficulty: "easy",
    icon: "📸",
    duration: 14,
    rules: [
      "50 photos minimum",
      "Must be outdoors",
      "Different subjects",
      "Review and select best"
    ],
    participants: 560,
    featured: false
  },
  {
    name: "Morning Yoga Flow",
    type: "streak",
    category: "daily",
    description: "Practice yoga outdoors for 30 minutes every morning. Connect breath with nature.",
    difficulty: "medium",
    icon: "🧘‍♀️",
    duration: 30,
    rules: [
      "30 min outdoor yoga",
      "Sunrise preferred",
      "Full sequence",
      "Nature as your studio"
    ],
    participants: 490,
    featured: false
  },
  {
    name: "Bugafari Expedition",
    type: "streak",
    category: "weekly",
    description: "Identify and document 30 different insect species. Discover tiny creatures.",
    difficulty: "medium",
    icon: "🐛",
    duration: 14,
    rules: [
      "Find 30 insect species",
      "Photo documentation",
      "Note habitats",
      "Research names"
    ],
    participants: 150,
    featured: false
  },
  {
    name: "Outdoor Meditation",
    type: "streak",
    category: "daily",
    description: "Meditate outside for 20 minutes daily. Find inner peace in nature.",
    difficulty: "medium",
    icon: "🧘",
    duration: 30,
    rules: [
      "20 min outdoor meditation",
      "Eyes closed",
      "Focus on nature sounds",
      "Same spot preferred"
    ],
    participants: 720,
    featured: false
  },
  {
    name: "Fitness Trail Circuit",
    type: "streak",
    category: "daily",
    description: "Complete a fitness circuit at your local park. Mix exercise with outdoors.",
    difficulty: "hard",
    icon: "💪",
    duration: 21,
    rules: [
      "Full park circuit",
      "Include all equipment",
      "20+ minutes minimum",
      "No skipping stations"
    ],
    participants: 380,
    featured: false
  },
  {
    name: "Stargazing Session",
    type: "streak",
    category: "daily",
    description: "Look at the stars for 15 minutes nightly. Connect with the cosmos.",
    difficulty: "easy",
    icon: "⭐",
    duration: 14,
    rules: [
      "15 min stargazing",
      "Identify 3 constellations",
      "Note planet sightings",
      "Avoid phone light"
    ],
    participants: 420,
    featured: false
  },
  {
    name: "Outdoor Coffee Ritual",
    type: "streak",
    category: "daily",
    description: "Drink your morning coffee outside for 21 days. Savor the moment.",
    difficulty: "easy",
    icon: "☕",
    duration: 21,
    rules: [
      "Coffee outdoors",
      "15 min minimum",
      "No phone",
      "Savor every sip"
    ],
    participants: 650,
    featured: false
  },
  {
    name: "Pond Life Discovery",
    type: "streak",
    category: "weekly",
    description: "Visit 5 different ponds and document aquatic life. Explore wetland ecosystems.",
    difficulty: "medium",
    icon: "🐸",
    duration: 14,
    rules: [
      "Visit 5 ponds",
      "Document wildlife",
      "Photo evidence",
      "Note species found"
    ],
    participants: 130,
    featured: false
  },
  {
    name: "Morning Jogging",
    type: "streak",
    category: "daily",
    description: "Jog outside for 20 minutes every morning. Start your day with movement.",
    difficulty: "medium",
    icon: "🏃",
    duration: 30,
    rules: [
      "20 min outdoor jog",
      "Same time daily",
      "Track distance",
      "No skipping days"
    ],
    participants: 820,
    featured: false
  },
  {
    name: "Nature Sketching",
    type: "streak",
    category: "daily",
    description: "Sketch something in nature for 15 minutes daily. Develop your artistic eye.",
    difficulty: "easy",
    icon: "✏️",
    duration: 21,
    rules: [
      "15 min nature drawing",
      "Real subjects only",
      "Complete one sketch",
      "Add date and location"
    ],
    participants: 280,
    featured: false
  },
  {
    name: "Park Bench Reading",
    type: "streak",
    category: "daily",
    description: "Read on a different park bench each day. Discover new spots.",
    difficulty: "easy",
    icon: "🪑",
    duration: 14,
    rules: [
      "Different bench daily",
      "30 min reading",
      "Note bench location",
      "Rate each spot"
    ],
    participants: 310,
    featured: false
  },
  {
    name: "Outdoor Breathing Exercise",
    type: "streak",
    category: "daily",
    description: "Practice deep breathing outside for 10 minutes. Oxygenate your brain.",
    difficulty: "easy",
    icon: "🌬️",
    duration: 14,
    rules: [
      "10 min breathing exercises",
      "Deep belly breaths",
      "Fresh air required",
      "Eyes closed"
    ],
    participants: 390,
    featured: false
  },
  {
    name: "Historic Walk",
    type: "streak",
    category: "weekly",
    description: "Walk 5 miles following historic landmarks. Learn your city's history.",
    difficulty: "medium",
    icon: "🏛️",
    duration: 7,
    rules: [
      "5 mile walk",
      "Historic stops only",
      "Read plaque info",
      "Document journey"
    ],
    participants: 170,
    featured: false
  },
  {
    name: "Sunset Yoga",
    type: "streak",
    category: "daily",
    description: "Practice yoga at sunset for 20 minutes. Wind down with nature.",
    difficulty: "medium",
    icon: "🧘‍♀️",
    duration: 21,
    rules: [
      "20 min sunset yoga",
      "Outdoor only",
      "Sunset view required",
      "Gratitude practice"
    ],
    participants: 440,
    featured: false
  },
  {
    name: "Bug Hotel Building",
    type: "streak",
    category: "weekly",
    description: "Build and place a bug hotel in your garden. Create habitat for insects.",
    difficulty: "medium",
    icon: "🏨",
    duration: 7,
    rules: [
      "Build bug hotel",
      "Natural materials",
      "Place in garden",
      "Document guests"
    ],
    participants: 120,
    featured: false
  },
  {
    name: "Outdoor Work Session",
    type: "streak",
    category: "daily",
    description: "Work outside for 2 hours daily. Boost productivity with fresh air.",
    difficulty: "medium",
    icon: "💻",
    duration: 14,
    rules: [
      "2 hours outdoor work",
      "Laptop permitted",
      "Coffee shop or park",
      "No indoor breaks"
    ],
    participants: 360,
    featured: false
  },
  {
    name: "Waterfall Chasing",
    type: "streak",
    category: "weekly",
    description: "Visit 10 different waterfalls in your region. Experience nature's power.",
    difficulty: "hard",
    icon: "💦",
    duration: 30,
    rules: [
      "Find 10 waterfalls",
      "Swim at each if safe",
      "Photo documentation",
      "Note best times"
    ],
    participants: 190,
    featured: false
  },
  {
    name: "Morning Cold Shower",
    type: "streak",
    category: "daily",
    description: "Take a cold outdoor shower every morning. Build mental toughness.",
    difficulty: "hard",
    icon: "🚿",
    duration: 14,
    rules: [
      "Cold water only",
      "Outdoor if possible",
      "2 min minimum",
      "No warm water"
    ],
    participants: 250,
    featured: false
  },
  {
    name: "Bird Watching Log",
    type: "streak",
    category: "daily",
    description: "Log bird sightings for 30 days. Become a bird expert.",
    difficulty: "easy",
    icon: "🐦",
    duration: 30,
    rules: [
      "Log daily sightings",
      "Photo evidence",
      "Note behavior",
      "Identify species"
    ],
    participants: 480,
    featured: false
  },
  {
    name: "Forest Bathing",
    type: "streak",
    category: "daily",
    description: "Spend 30 minutes forest bathing. Connect deeply with trees.",
    difficulty: "medium",
    icon: "🌲",
    duration: 14,
    rules: [
      "30 min forest time",
      "No phone",
      "Touch trees",
      "Slow walking only"
    ],
    participants: 320,
    featured: false
  },
  {
    name: "Outdoor Meal Planning",
    type: "streak",
    category: "daily",
    description: "Plan your meals outside for 20 minutes. Make healthier decisions.",
    difficulty: "easy",
    icon: "🥗",
    duration: 7,
    rules: [
      "20 min outdoor planning",
      "Write menu",
      "Grocery list",
      "No phone distraction"
    ],
    participants: 240,
    featured: false
  },
  {
    name: "Rock Pool Exploration",
    type: "streak",
    category: "weekly",
    description: "Explore 5 rock pools and document sea life. Discover ocean creatures.",
    difficulty: "medium",
    icon: "🦀",
    duration: 7,
    rules: [
      "Explore 5 rock pools",
      "Document species",
      "Safe handling only",
      "Leave no trace"
    ],
    participants: 160,
    featured: false
  },
  {
    name: "Sunrise Running",
    type: "streak",
    category: "daily",
    description: "Run at sunrise for 30 minutes. Start your day with energy.",
    difficulty: "hard",
    icon: "🌅",
    duration: 21,
    rules: [
      "30 min run at sunrise",
      "Outdoors only",
      "Track distance",
      "No missing days"
    ],
    participants: 540,
    featured: false
  },
  {
    name: "Garden Meditation",
    type: "streak",
    category: "daily",
    description: "Meditate in your garden for 15 minutes. Find peace at home.",
    difficulty: "easy",
    icon: "🌻",
    duration: 30,
    rules: [
      "15 min garden meditation",
      "Same time daily",
      "Focus on plants",
      "No indoor fallback"
    ],
    participants: 380,
    featured: false
  },
  {
    name: "Beachcombing Adventure",
    type: "streak",
    category: "daily",
    description: "Walk along the beach for 30 minutes daily. Collect interesting finds.",
    difficulty: "easy",
    icon: "🏖️",
    duration: 14,
    rules: [
      "30 min beach walk",
      "Collect one item",
      "Document findings",
      "Respect wildlife"
    ],
    participants: 290,
    featured: false
  },
  {
    name: "Stargazing Session",
    type: "streak",
    category: "daily",
    description: "Spend 20 minutes outdoors stargazing each night. Learn about the cosmos.",
    difficulty: "easy",
    icon: "⭐",
    duration: 21,
    rules: [
      "20 min stargazing",
      "Identify 3 constellations",
      "Note moon phase",
      "No telescope needed"
    ],
    participants: 420,
    featured: false
  }
];

async function seedChallenges() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing built-in challenges
    console.log('🗑️  Clearing existing built-in challenges...');
    await Challenge.deleteMany({ 'metadata.isBuiltIn': true });
    console.log('✅ Cleared existing built-in challenges');

    // Create new challenges
    const challengesToInsert = BUILT_IN_CHALLENGES.map((challenge, index) => {
      const now = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + challenge.duration);

      return {
        name: challenge.name,
        description: challenge.description,
        type: challenge.type,
        category: challenge.category,
        difficulty: challenge.difficulty,
        creator: new mongoose.Types.ObjectId("000000000000000000000001"), // System-created
        status: 'active',
        settings: {
          duration: {
            value: challenge.duration,
            unit: 'days'
          },
          entryFee: 0,
          prizePool: 0,
          maxParticipants: 0, // Unlimited
          minParticipants: 1,
          visibility: 'public',
          verificationRequired: true,
          allowShameDays: true,
          strictMode: false
        },
        rules: {
          targetStreak: challenge.duration,
          targetDuration: 15, // minutes per day
          targetConsistency: 100,
          minDailyTime: 10,
          allowedVerificationMethods: ['manual', 'photo', 'location'],
          shamePenalty: 0,
          freezeAllowed: true,
          skipAllowed: false
        },
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
          customRules: challenge.rules.join('\n')
        },
        participants: [],
        leaderboard: [],
        winners: [],
        notifications: {
          startReminderSent: false,
          dailyReminderSent: false,
          endReminderSent: false
        }
      };
    });

    const insertedChallenges = await Challenge.insertMany(challengesToInsert);
    console.log(`✅ Successfully seeded ${insertedChallenges.length} built-in challenges`);

    // Display summary
    console.log('\n📋 Seeded Challenges:');
    insertedChallenges.forEach((challenge, index) => {
      console.log(`  ${index + 1}. ${challenge.name} (${challenge.duration} days) - ${challenge.participants?.totalEntries || 0} participants`);
    });

    console.log('\n✅ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
    process.exit(1);
  }
}

seedChallenges();
