const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs').promises;

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    this.templates = {
      welcome: 'welcome',
      verification: 'verification',
      streak_reminder: 'streak_reminder',
      streak_broken: 'streak_broken',
      challenge_invite: 'challenge_invite',
      challenge_update: 'challenge_update',
      achievement_unlocked: 'achievement_unlocked',
      weekly_report: 'weekly_report',
      payment_receipt: 'payment_receipt',
      password_reset: 'password_reset',
      security_alert: 'security_alert'
    };
  }

  async sendEmail(templateName, to, data = {}, options = {}) {
    try {
      const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.ejs`);
      let html;

      try {
        const template = await fs.readFile(templatePath, 'utf-8');
        html = ejs.render(template, {
          ...data,
          year: new Date().getFullYear(),
          appName: 'TouchGrass',
          appUrl: process.env.FRONTEND_URL || 'https://touchgrass.now'
        });
      } catch (error) {
        console.warn(`Template ${templateName} not found, using default`);
        html = this.getDefaultTemplate(templateName, data);
      }

      const mailOptions = {
        from: options.from || `"TouchGrass" <${process.env.SMTP_FROM || 'noreply@touchgrass.now'}>`,
        to,
        subject: options.subject || this.getDefaultSubject(templateName, data),
        html,
        text: options.text || this.generateTextFromHTML(html),
        ...options
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      // Log email send (optional)
      await this.logEmailSend(templateName, to, info.messageId);
      
      return info;
    } catch (error) {
      console.error('Email send failed:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(user) {
    const data = {
      name: user.displayName,
      username: user.username,
      streakGoal: 7,
      leaderboardUrl: `${process.env.FRONTEND_URL}/leaderboard`
    };

    return this.sendEmail('welcome', user.email, data, {
      subject: '🌱 Welcome to TouchGrass - Start Your Journey!'
    });
  }

  async sendStreakReminder(user, streakData) {
    const data = {
      name: user.displayName,
      currentStreak: streakData.currentStreak,
      streakAtRisk: streakData.currentStreak >= 7,
      hoursRemaining: this.calculateHoursRemaining(),
      verifyUrl: `${process.env.FRONTEND_URL}/verify`
    };

    return this.sendEmail('streak_reminder', user.email, data, {
      subject: streakData.currentStreak >= 7 
        ? `⚠️ Your ${streakData.currentStreak}-day streak is at risk!` 
        : `🌱 Don't break your ${streakData.currentStreak}-day streak!`
    });
  }

  async sendStreakBrokenEmail(user, streakData) {
    const data = {
      name: user.displayName,
      brokenStreak: streakData.currentStreak,
      longestStreak: user.stats.longestStreak,
      restoreUrl: `${process.env.FRONTEND_URL}/streak/restore`,
      shameMessage: this.getRandomShameMessage(streakData.currentStreak)
    };

    return this.sendEmail('streak_broken', user.email, data, {
      subject: `😔 Your ${streakData.currentStreak}-day streak was broken`
    });
  }

  async sendChallengeInvite(user, challenge, inviter) {
    const data = {
      name: user.displayName,
      challengeName: challenge.settings.name || challenge.type,
      challengeType: challenge.type,
      inviterName: inviter.displayName,
      duration: challenge.settings.duration,
      joinUrl: `${process.env.FRONTEND_URL}/challenges/${challenge._id}/join`,
      deadline: this.formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000)) // 24 hours
    };

    return this.sendEmail('challenge_invite', user.email, data, {
      subject: `🏆 ${inviter.displayName} invited you to a challenge!`
    });
  }

  async sendAchievementEmail(user, achievement) {
    const data = {
      name: user.displayName,
      achievementName: achievement.name,
      achievementIcon: achievement.icon,
      achievementDescription: achievement.description,
      earnedDate: this.formatDate(achievement.earnedAt),
      shareUrl: `${process.env.FRONTEND_URL}/achievements/${achievement._id}/share`
    };

    return this.sendEmail('achievement_unlocked', user.email, data, {
      subject: `🎉 Achievement Unlocked: ${achievement.name}!`
    });
  }

  async sendWeeklyReport(user, weeklyStats) {
    const data = {
      name: user.displayName,
      weekNumber: this.getWeekNumber(),
      daysCompleted: weeklyStats.daysCompleted,
      totalDays: weeklyStats.totalDays,
      consistencyScore: weeklyStats.consistency,
      leaderboardRank: weeklyStats.rank,
      rankChange: weeklyStats.rankChange,
      achievementsEarned: weeklyStats.achievements,
      comparisonStats: weeklyStats.comparison,
      recommendations: this.getWeeklyRecommendations(weeklyStats)
    };

    return this.sendEmail('weekly_report', user.email, data, {
      subject: `📊 Your Weekly TouchGrass Report`
    });
  }

  async sendPaymentReceipt(user, payment) {
    const data = {
      name: user.displayName,
      receiptNumber: payment._id.toString().slice(-8).toUpperCase(),
      amount: `$${payment.amount.toFixed(2)}`,
      date: this.formatDate(payment.createdAt),
      plan: payment.plan,
      description: this.getPaymentDescription(payment),
      nextBillingDate: this.formatDate(payment.nextBillingDate),
      supportEmail: 'support@touchgrass.now'
    };

    return this.sendEmail('payment_receipt', user.email, data, {
      subject: `🧾 Receipt for your TouchGrass payment`
    });
  }

  async sendPasswordResetEmail(user, resetToken) {
    const data = {
      name: user.displayName,
      resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
      expiryHours: 24,
      ipAddress: this.getClientIP(),
      timestamp: new Date().toLocaleString()
    };

    return this.sendEmail('password_reset', user.email, data, {
      subject: '🔐 Reset your TouchGrass password'
    });
  }

  async sendSecurityAlert(user, activity) {
    const data = {
      name: user.displayName,
      activityType: activity.type,
      timestamp: this.formatDate(activity.timestamp),
      location: activity.location || 'Unknown location',
      device: activity.device || 'Unknown device',
      ipAddress: activity.ipAddress,
      takeActionUrl: `${process.env.FRONTEND_URL}/security`,
      supportUrl: `${process.env.FRONTEND_URL}/help`
    };

    return this.sendEmail('security_alert', user.email, data, {
      subject: '🚨 Security Alert: New sign-in detected'
    });
  }

  // Helper methods
  getDefaultTemplate(templateName, data) {
    const templates = {
      welcome: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
            .stat { text-align: center; padding: 15px; background: white; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to TouchGrass, ${data.name}! 🌱</h1>
            </div>
            <div class="content">
              <p>You've taken the first step toward building real-world discipline through daily accountability.</p>
              
              <div class="stats">
                <div class="stat">
                  <h3>🎯 First Goal</h3>
                  <p>7-day streak</p>
                </div>
                <div class="stat">
                  <h3>👥 Community</h3>
                  <p>Join ${data.communitySize || 'thousands'} of others</p>
                </div>
              </div>
              
              <a href="${data.verifyUrl}" class="button">Verify Today's Activity</a>
              
              <p style="margin-top: 30px;">
                <strong>Pro Tip:</strong> Set a daily reminder and join a challenge to stay motivated!
              </p>
              
              <p>See you on the leaderboard!<br>The TouchGrass Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Add more default templates as needed
    };

    return templates[templateName] || `
      <!DOCTYPE html>
      <html>
      <body>
        <h1>TouchGrass Notification</h1>
        <p>${JSON.stringify(data)}</p>
      </body>
      </html>
    `;
  }

  getDefaultSubject(templateName, data) {
    const subjects = {
      welcome: 'Welcome to TouchGrass!',
      streak_reminder: 'Your streak needs attention',
      streak_broken: 'Streak broken notification',
      challenge_invite: 'You have been challenged!',
      achievement_unlocked: 'Achievement unlocked!',
      weekly_report: 'Your weekly progress report',
      payment_receipt: 'Payment receipt',
      password_reset: 'Password reset requested',
      security_alert: 'Security alert'
    };

    return subjects[templateName] || 'Notification from TouchGrass';
  }

  generateTextFromHTML(html) {
    // Simple HTML to text conversion
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  calculateHoursRemaining() {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const diffMs = endOfDay - now;
    return Math.ceil(diffMs / (1000 * 60 * 60));
  }

  getRandomShameMessage(streakLength) {
    const messages = [
      `Your ${streakLength}-day streak has fallen. The grass misses you.`,
      `Even the most disciplined falter. Your ${streakLength}-day journey was impressive.`,
      `Streak broken at ${streakLength} days. Time to start a new chapter.`,
      `The digital world won this round. Your ${streakLength}-day resistance was noble.`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getWeekNumber() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.ceil((diff + start.getDay() * 24 * 60 * 60 * 1000) / oneWeek);
  }

  getWeeklyRecommendations(stats) {
    const recommendations = [];
    
    if (stats.consistency < 80) {
      recommendations.push({
        title: 'Improve Consistency',
        description: 'Try setting daily reminders at the same time',
        action: 'Set Reminder'
      });
    }
    
    if (stats.daysCompleted < 5) {
      recommendations.push({
        title: 'Increase Activity',
        description: 'Join a 7-day challenge for extra motivation',
        action: 'Browse Challenges'
      });
    }
    
    if (stats.rankChange > 0) {
      recommendations.push({
        title: 'Climb Higher',
        description: `You moved up ${stats.rankChange} spots! Keep pushing`,
        action: 'View Leaderboard'
      });
    }
    
    return recommendations;
  }

  getPaymentDescription(payment) {
    const descriptions = {
      premium: 'Premium Subscription',
      elite: 'Elite Subscription',
      enterprise: 'Enterprise Plan',
      streak_restoration: 'Streak Restoration',
      challenge_stake: 'Challenge Entry Fee',
      tokens: 'Virtual Tokens Purchase'
    };
    
    return descriptions[payment.type] || payment.type;
  }

  getClientIP() {
    // This would be populated from request headers in actual implementation
    return 'Unknown';
  }

  async logEmailSend(template, to, messageId) {
    const EmailLog = require('../models/EmailLog');
    
    await EmailLog.create({
      template,
      recipient: to,
      messageId,
      sentAt: new Date(),
      status: 'sent'
    });
  }

  // Batch email sending
  async sendBatchEmails(templateName, recipients, dataCallback, options = {}) {
    const results = [];
    const batchSize = 50; // Send 50 emails at a time to avoid rate limiting
    
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      const batchPromises = batch.map(async (recipient) => {
        try {
          const recipientData = typeof dataCallback === 'function' 
            ? await dataCallback(recipient)
            : { ...dataCallback, recipient };
          
          const result = await this.sendEmail(
            templateName,
            recipient.email || recipient,
            recipientData,
            options
          );
          
          return { recipient: recipient.email || recipient, status: 'success', result };
        } catch (error) {
          return { recipient: recipient.email || recipient, status: 'error', error: error.message };
        }
      });
      
      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults.map(r => r.value || r.reason));
      
      // Wait between batches to avoid rate limiting
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }

  // Email verification
  async sendVerificationEmail(user, verificationToken) {
    const data = {
      name: user.displayName,
      verificationUrl: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`,
      expiryHours: 24
    };

    return this.sendEmail('verification', user.email, data, {
      subject: '✅ Verify your TouchGrass email address'
    });
  }
}

module.exports = new EmailService();