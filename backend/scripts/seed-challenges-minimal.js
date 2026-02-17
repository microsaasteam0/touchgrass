const mongoose = require('mongoose');
const Challenge = require('../src/models/Challenge');
const User = require('../src/models/user');
require('dotenv').config();

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/touchgrass');
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function seedChallenges() {
  try {
    await connectDB();

    // Create system user if not exists
    let systemUser = await User.findOne({ email: 'system@touchgrass.now' });
    if (!systemUser) {
      systemUser = new User({
        email: 'system@touchgrass.now',
        displayName: 'System',
        username: 'system',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=system',
        password: 'system123'
      });
      await systemUser.save();
      console.log('✅ System user created');
    }

    // Remove existing built-in challenges
    await Challenge.deleteMany({ 'metadata.isBuiltIn': true });
    console.log('✅ Removed existing built-in challenges');

    // Create minimal challenges with required fields
    const now = new Date();
    const challenges = [
      {
        name: "Daily Walk Challenge",
        type: "streak",
        description: "Take a 10-minute walk every day for 7 days",
        category: "daily",
        creator: systemUser._id,
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
          allowedVerificationMethods: ['photo', 'location'],
          freezeAllowed: false,
          skipAllowed: false
        },
        schedule: {
          startDate: now,
          endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        },
        status: 'active',
        metadata: {
          isBuiltIn: true,
          tags: ["walking", "health", "daily"],
          themeColor: "#3B82F6",
          bannerImage: "🚶‍♂️"
        }
      },
      {
        name: "Morning Meditation",
        type: "consistency",
        description: "Meditate for 5 minutes each morning for 30 days",
        category: "monthly",
        creator: systemUser._id,
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
          targetConsistency: 90,
          minDailyTime: 5,
          allowedVerificationMethods: ['photo', 'location'],
          freezeAllowed: false,
          skipAllowed: true
        },
        schedule: {
          startDate: now,
          endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        },
        status: 'active',
        metadata: {
          isBuiltIn: true,
          tags: ["meditation", "mindfulness", "morning"],
          themeColor: "#10B981",
          bannerImage: "🧘‍♀️"
        }
      }
    ];

    const createdChallenges = await Challenge.create(challenges);
    console.log(`✅ Successfully created ${createdChallenges.length} built-in challenges`);

  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📪 Disconnected from database');
  }
}

seedChallenges();
