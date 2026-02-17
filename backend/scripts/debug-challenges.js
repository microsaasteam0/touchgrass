// Debug script to check challenges in database
const mongoose = require('mongoose');
const Challenge = require('./src/models/Challenge');
require('dotenv').config();

async function debugChallenges() {
  try {
    console.log('🔍 Debugging challenges...\n');

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/touchgrass');
    console.log('📡 Connected to database');

    // Get all challenges
    const allChallenges = await Challenge.find({});
    console.log(`\n📊 Total challenges in database: ${allChallenges.length}`);

    // Check challenges without schedule.endDate
    const withoutEndDate = await Challenge.find({ 'schedule.endDate': { $exists: false } });
    console.log(`⚠️  Challenges without schedule.endDate: ${withoutEndDate.length}`);

    // Check challenges without status
    const withoutStatus = await Challenge.find({ status: { $exists: false } });
    console.log(`⚠️  Challenges without status: ${withoutStatus.length}`);

    // Check challenges by status
    const byStatus = await Challenge.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    console.log('\n📈 Challenges by status:');
    byStatus.forEach(s => console.log(`   - ${s._id}: ${s.count}`));

    // Check challenges with future endDate
    const futureEndDate = await Challenge.find({ 'schedule.endDate': { $gt: new Date() } });
    console.log(`\n✅ Challenges with future endDate: ${futureEndDate.length}`);

    // Get active challenges (what the API returns)
    const activeChallenges = await Challenge.find({ 
      status: 'active',
      'schedule.endDate': { $gt: new Date() }
    });
    console.log(`🎯 Active challenges (what API returns): ${activeChallenges.length}`);

    // Show first few challenges details
    if (allChallenges.length > 0) {
      console.log('\n📋 Sample challenges:');
      allChallenges.slice(0, 3).forEach((c, i) => {
        console.log(`\n   ${i + 1}. ${c.name}`);
        console.log(`      Status: ${c.status}`);
        console.log(`      schedule.startDate: ${c.schedule?.startDate || 'MISSING'}`);
        console.log(`      schedule.endDate: ${c.schedule?.endDate || 'MISSING'}`);
      });
    }

    // Fix: Update existing built-in challenges with proper schedule
    console.log('\n🔧 Fixing challenges without schedule dates...');
    const fixedCount = await Challenge.updateMany(
      { 
        'metadata.isBuiltIn': true,
        $or: [
          { 'schedule.endDate': { $exists: false } },
          { 'schedule.endDate': null }
        ]
      },
      {
        $set: {
          'schedule.startDate': new Date(),
          'schedule.endDate': new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)), // 1 year
          'schedule.timezone': 'UTC',
          'status': 'active'
        }
      }
    );
    console.log(`   Fixed ${fixedCount.modifiedCount} challenges`);

    // Verify fix
    const fixedChallenges = await Challenge.find({ 
      status: 'active',
      'schedule.endDate': { $gt: new Date() }
    });
    console.log(`\n✅ Total active challenges after fix: ${fixedChallenges.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n📪 Disconnected from database');
  }
}

debugChallenges();
