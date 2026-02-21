/**
 * Comprehensive Debug Script for Challenges
 * Run with: node scripts/comprehensive-debug.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://hitanshiee:Hitanshii14@touchgrass.dgyxbbm.mongodb.net/touchgrass?retryWrites=true&w=majority&appName=touchgrass';

async function debugAll() {
  try {
    console.log('🔍 COMPREHENSIVE CHALLENGE DEBUG');
    console.log('================================\n');
    console.log(`📡 Connecting to: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    
    // List all collections
    console.log('📁 Collections in database:');
    const collections = await db.listCollections().toArray();
    collections.forEach(c => console.log(`   - ${c.name}`));
    console.log('');

    // ========== CHALLENGES ==========
    const challengesCollection = db.collection('challenges');
    const totalChallenges = await challengesCollection.countDocuments();
    console.log(`📊 Total Challenges: ${totalChallenges}`);

    if (totalChallenges > 0) {
      // Get sample challenges
      const sampleChallenges = await challengesCollection.find({}).limit(5).toArray();
      console.log('\n📋 Sample Challenges:');
      sampleChallenges.forEach((c, i) => {
        console.log(`\n   ${i + 1}. ${c.name}`);
        console.log(`      _id: ${c._id}`);
        console.log(`      status: ${c.status}`);
        console.log(`      type: ${c.type}`);
        console.log(`      difficulty: ${c.difficulty}`);
        console.log(`      metadata.isBuiltIn: ${c.metadata?.isBuiltIn}`);
        console.log(`      participants: ${c.participants?.length || 0}`);
      });

      // Count by status
      const byStatus = await challengesCollection.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]).toArray();
      console.log('\n📈 Challenges by status:');
      byStatus.forEach(s => console.log(`   - ${s._id}: ${s.count}`));

      // Count built-in challenges
      const builtInCount = await challengesCollection.countDocuments({ 'metadata.isBuiltIn': true });
      console.log(`\n✅ Built-in challenges: ${builtInCount}`);
    }

    // ========== USER CHALLENGES ==========
    const userChallengesCollection = db.collection('userchallenges');
    const totalUserChallenges = await userChallengesCollection.countDocuments();
    console.log(`\n📊 Total UserChallenges (join records): ${totalUserChallenges}`);

    if (totalUserChallenges > 0) {
      // Get sample user challenges with populated data
      const sampleUserChallenges = await userChallengesCollection.find({}).limit(5).toArray();
      console.log('\n📋 Sample UserChallenges:');
      sampleUserChallenges.forEach((uc, i) => {
        console.log(`\n   ${i + 1}. UserChallenge`);
        console.log(`      _id: ${uc._id}`);
        console.log(`      userId: ${uc.userId}`);
        console.log(`      challengeId: ${uc.challengeId}`);
        console.log(`      status: ${uc.status}`);
        console.log(`      totalProgress: ${uc.totalProgress}`);
        console.log(`      currentStreak: ${uc.currentStreak}`);
        console.log(`      joinedAt: ${uc.joinedAt}`);
      });

      // Count by status
      const byStatus = await userChallengesCollection.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]).toArray();
      console.log('\n📈 UserChallenges by status:');
      byStatus.forEach(s => console.log(`   - ${s._id}: ${s.count}`));
    }

    // ========== CHECK SPECIFIC CHALLENGE ID ==========
    const specificChallengeId = '69967090579cf2b2a9960441';
    console.log(`\n🔍 Checking specific challenge ID: ${specificChallengeId}`);

    // Try as ObjectId
    let challenge;
    try {
      const ObjectId = mongoose.Types.ObjectId;
      if (ObjectId.isValid(specificChallengeId)) {
        challenge = await challengesCollection.findOne({ _id: new ObjectId(specificChallengeId) });
      }
    } catch (e) {
      console.log('   (Not a valid ObjectId format)');
    }

    // Try as string
    if (!challenge) {
      challenge = await challengesCollection.findOne({ _id: specificChallengeId });
    }

    if (challenge) {
      console.log('   ✅ Challenge FOUND!');
      console.log(`      Name: ${challenge.name}`);
      console.log(`      Status: ${challenge.status}`);
      console.log(`      Created: ${challenge.createdAt}`);
      
      // Check if any users have joined this challenge
      const userChallengesForThis = await userChallengesCollection.find({ 
        challengeId: challenge._id 
      }).toArray();
      console.log(`   👥 Users who joined: ${userChallengesForThis.length}`);
    } else {
      console.log('   ❌ Challenge NOT FOUND in database!');
      console.log('   This is likely the cause of the 404 error.');
    }

    // ========== USERS ==========
    const usersCollection = db.collection('users');
    const totalUsers = await usersCollection.countDocuments();
    console.log(`\n📊 Total Users: ${totalUsers}`);

    if (totalUsers > 0 && totalUserChallenges > 0) {
      // Find users who have joined challenges
      const usersWithChallenges = await usersCollection.aggregate([
        {
          $lookup: {
            from: 'userchallenges',
            localField: '_id',
            foreignField: 'userId',
            as: 'joinedChallenges'
          }
        },
        {
          $match: {
            'joinedChallenges.0': { $exists: true }
          }
        },
        {
          $limit: 5
        },
        {
          $project: {
            username: 1,
            email: 1,
            joinedChallengesCount: { $size: '$joinedChallenges' }
          }
        }
      ]).toArray();

      console.log('\n👤 Sample Users with joined challenges:');
      usersWithChallenges.forEach(u => {
        console.log(`   - ${u.username} (${u.email}): ${u.joinedChallengesCount} challenges joined`);
      });
    }

    // ========== SUMMARY ==========
    console.log('\n================================');
    console.log('📋 SUMMARY');
    console.log('================================');
    console.log(`   Challenges in DB: ${totalChallenges}`);
    console.log(`   UserChallenge records: ${totalUserChallenges}`);
    console.log(`   Users in DB: ${totalUsers}`);
    
    if (totalChallenges === 0) {
      console.log('\n⚠️  NO CHALLENGES FOUND! Run: node scripts/seed-challenges-builtin.js');
    }
    
    if (totalUserChallenges === 0) {
      console.log('\n⚠️  NO USER CHALLENGES FOUND! Users need to join challenges first.');
    }

    if (totalChallenges > 0 && totalUserChallenges === 0) {
      console.log('\n💡 Challenges exist but no one has joined yet.');
      console.log('   Users must join a challenge before verifying progress.');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n📪 Disconnected from MongoDB');
  }
}

debugAll();
