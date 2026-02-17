const mongoose = require('mongoose');
const Challenge = require('../src/models/Challenge');
const User = require('../src/models/user');
require('dotenv').config();

const builtInChallenges = [];

async function seedChallenges() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/touchgrass');
    console.log('MongoDB connected');

    console.log('Checking for system user...');
    let systemUser = await User.findOne({ email: 'system@touchgrass.now' });
    
    if (!systemUser) {
      console.log('Creating system user...');
      systemUser = new User({
        email: 'system@touchgrass.now',
        displayName: 'System',
        username: 'system',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=system',
        password: 'system123'
      });
      await systemUser.save();
      console.log('System user created');
    }

    console.log('Removing existing built-in challenges...');
    await Challenge.deleteMany({ 'metadata.isBuiltIn': true });

    console.log('Creating new built-in challenges...');
    const challengesWithCreator = builtInChallenges.map(challenge => ({
      ...challenge,
      creator: systemUser._id
    }));

    const createdChallenges = await Challenge.create(challengesWithCreator);
    
    console.log(`✅ Successfully created ${createdChallenges.length} built-in challenges:`);
    createdChallenges.forEach(challenge => {
      console.log(`   - ${challenge.name} (${challenge.type})`);
    });

  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📪 Disconnected from database');
  }
}

seedChallenges();