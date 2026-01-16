const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return !this.isSystem;
    }
  },
  text: {
    type: String,
    required: function() {
      return !this.attachments || this.attachments.length === 0;
    },
    trim: true,
    maxlength: 2000
  },
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'file', 'streak_share', 'challenge', 'system', 'location'],
    default: 'text'
  },
  attachments: [{
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['image', 'video', 'document', 'audio'],
      required: true
    },
    thumbnail: String,
    filename: String,
    size: Number, // in bytes
    duration: Number, // for audio/video in seconds
    width: Number,
    height: Number,
    mimeType: String
  }],
  metadata: {
    streakData: {
      days: Number,
      achievement: String,
      leaderboardRank: Number,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      streakId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Streak'
      }
    },
    challengeData: {
      challengeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge'
      },
      type: String,
      status: String,
      invitation: Boolean
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number],
      name: String,
      address: String
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    forwardFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    }
  },
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    emoji: {
      type: String,
      required: true,
      maxlength: 10
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  deletedFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  editHistory: [{
    text: String,
    editedAt: Date
  }],
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isSystem: {
    type: Boolean,
    default: false
  },
  systemType: {
    type: String,
    enum: ['user_joined', 'user_left', 'chat_created', 'name_changed', 'admin_added']
  },
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  hashtags: [String],
  linkPreview: {
    url: String,
    title: String,
    description: String,
    image: String,
    siteName: String
  },
  encryption: {
    encrypted: {
      type: Boolean,
      default: false
    },
    key: String,
    algorithm: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
messageSchema.index({ chatId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ 'metadata.streakData.streakId': 1 });
messageSchema.index({ 'metadata.challengeData.challengeId': 1 });
messageSchema.index({ isDeleted: 1 });
messageSchema.index({ type: 1 });
messageSchema.index({ 'readBy.user': 1 });

// Virtual for reaction count
messageSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

// Virtual for top reactions
messageSchema.virtual('topReactions').get(function() {
  const reactionMap = {};
  
  this.reactions.forEach(reaction => {
    if (!reactionMap[reaction.emoji]) {
      reactionMap[reaction.emoji] = 0;
    }
    reactionMap[reaction.emoji]++;
  });
  
  return Object.entries(reactionMap)
    .map(([emoji, count]) => ({ emoji, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
});

// Virtual for isRead
messageSchema.virtual('isRead').get(function() {
  return this.readBy.length > 0;
});

// Method to add reaction
messageSchema.methods.addReaction = async function(userId, emoji) {
  // Check if user already reacted with this emoji
  const existingIndex = this.reactions.findIndex(r => 
    r.user.toString() === userId.toString() && r.emoji === emoji
  );
  
  if (existingIndex > -1) {
    // Remove reaction if same emoji
    this.reactions.splice(existingIndex, 1);
  } else {
    // Check if user reacted with different emoji
    const otherIndex = this.reactions.findIndex(r => 
      r.user.toString() === userId.toString()
    );
    
    if (otherIndex > -1) {
      // Replace existing reaction
      this.reactions[otherIndex].emoji = emoji;
      this.reactions[otherIndex].createdAt = new Date();
    } else {
      // Add new reaction
      this.reactions.push({
        user: userId,
        emoji,
        createdAt: new Date()
      });
    }
  }
  
  return this.save();
};

// Method to mark as read
messageSchema.methods.markAsRead = function(userId) {
  const alreadyRead = this.readBy.some(r => 
    r.user.toString() === userId.toString()
  );
  
  if (!alreadyRead) {
    this.readBy.push({
      user: userId,
      readAt: new Date()
    });
    
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Method to edit message
messageSchema.methods.editMessage = function(newText, userId) {
  if (this.isDeleted) {
    throw new Error('Cannot edit deleted message');
  }
  
  if (this.sender.toString() !== userId.toString()) {
    throw new Error('Only sender can edit message');
  }
  
  // Save edit history
  if (!this.editHistory) {
    this.editHistory = [];
  }
  
  this.editHistory.push({
    text: this.text,
    editedAt: new Date()
  });
  
  // Update message
  this.text = newText;
  this.isEdited = true;
  this.editedAt = new Date();
  
  return this.save();
};

// Method to delete for user (soft delete)
messageSchema.methods.deleteForUser = function(userId) {
  if (this.deletedFor.includes(userId)) {
    return Promise.resolve(this); // Already deleted
  }
  
  this.deletedFor.push(userId);
  
  // If everyone has deleted it, mark as deleted
  const Chat = mongoose.model('Chat');
  
  return Chat.findById(this.chatId).then(chat => {
    if (chat && this.deletedFor.length === chat.participants.length) {
      this.isDeleted = true;
      this.deletedAt = new Date();
    }
    
    return this.save();
  });
};

// Method to delete for everyone
messageSchema.methods.deleteForEveryone = function(userId) {
  if (this.sender.toString() !== userId.toString()) {
    throw new Error('Only sender can delete for everyone');
  }
  
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = userId;
  
  // Clear sensitive data
  this.text = 'This message was deleted';
  this.attachments = [];
  this.metadata = {};
  
  return this.save();
};

// Method to check if user can see message
messageSchema.methods.canUserSee = function(userId) {
  if (this.isDeleted) return false;
  
  return !this.deletedFor.includes(userId);
};

// Method to check if user can delete
messageSchema.methods.canUserDelete = function(userId) {
  // Sender can delete their own messages
  if (this.sender && this.sender.toString() === userId.toString()) {
    return true;
  }
  
  // Admins can delete any message in their chat
  const Chat = mongoose.model('Chat');
  
  return Chat.findById(this.chatId).then(chat => {
    if (!chat) return false;
    
    return chat.admins.some(admin => 
      admin.toString() === userId.toString()
    );
  });
};

// Static method to create streak share message
messageSchema.statics.createStreakShare = async function(chatId, userId, streakData) {
  const message = new this({
    chatId,
    sender: userId,
    type: 'streak_share',
    text: `🔥 Shared a ${streakData.days}-day streak!`,
    metadata: {
      streakData: {
        days: streakData.days,
        achievement: streakData.achievement,
        leaderboardRank: streakData.leaderboardRank,
        userId: streakData.userId,
        streakId: streakData.streakId
      }
    }
  });
  
  return message.save();
};

// Static method to create challenge invitation
messageSchema.statics.createChallengeInvite = async function(chatId, userId, challengeData) {
  const message = new this({
    chatId,
    sender: userId,
    type: 'challenge',
    text: `🏆 ${challengeData.invitation ? 'Invited you to' : 'Created'} challenge: ${challengeData.name}`,
    metadata: {
      challengeData: {
        challengeId: challengeData.challengeId,
        type: challengeData.type,
        status: 'invited',
        invitation: true
      }
    }
  });
  
  return message.save();
};

module.exports = mongoose.model('Message', messageSchema);