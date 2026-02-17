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
      ipAddress: activity.ip,
      location: activity.location,
      device: activity.device,
      loginUrl: `${process.env.FRONTEND_URL}/login`,
      supportEmail: 'support@touchgrass.now'
    };

    return this.sendEmail('security_alert', user.email, data, {
      subject: '⚠️ Security Alert - Unusual Account Activity'
    });
  }

  // Helper methods
  getDefaultTemplate(templateName, data) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4CAF50;">TouchGrass</h1>
        <p>You have a new notification:</p>
        <p>${data.message || 'Notification content'}</p>
        <p style="color: #666; font-size: 12px;">This email was sent to you because you have notifications enabled for your TouchGrass account.</p>
      </div>
    `;
  }

  getDefaultSubject(templateName, data) {
    const subjects = {
      welcome: 'Welcome to TouchGrass!',
      verification: 'Verify your email address',
      streak_reminder: 'Streak Reminder',
      streak_broken: 'Your streak was broken',
      challenge_invite: 'Challenge Invitation',
      challenge_update: 'Challenge Update',
      achievement_unlocked: 'Achievement Unlocked',
      weekly_report: 'Your Weekly Report',
      payment_receipt: 'Payment Receipt',
      password_reset: 'Reset Your Password',
      security_alert: 'Security Alert'
    };

    return subjects[templateName] || 'TouchGrass Notification';
  }

  calculateHoursRemaining() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow - now;
    return Math.ceil(diff / (1000 * 60 * 60));
  }

  getRandomShameMessage(streakLength) {
    const messages = [
      "Don't worry, even the best streak break sometimes. You've got this!",
      "Every great journey has setbacks. Tomorrow is a new day to start fresh.",
      "Remember, consistency is more important than perfection. Keep going!",
      "You've already accomplished so much. One bad day doesn't define your progress.",
      "The hardest part is getting back on track. You're stronger than you think!"
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getWeekNumber() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now - startOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  }

  getWeeklyRecommendations(weeklyStats) {
    if (weeklyStats.daysCompleted >= 6) {
      return "Amazing consistency! Keep up the incredible work!";
    } else if (weeklyStats.daysCompleted >= 4) {
      return "Great effort this week! Try to add one more day next week.";
    } else {
      return "You're making progress! Even small steps add up over time.";
    }
  }

  getPaymentDescription(payment) {
    if (payment.plan === 'premium') {
      return 'Premium Subscription';
    } else if (payment.plan === 'pro') {
      return 'Pro Subscription';
    } else if (payment.tokens) {
      return `${payment.tokens} Tokens Purchase`;
    } else {
      return 'Payment';
    }
  }

  generateTextFromHTML(html) {
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/g, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  logEmailSend(templateName, to, messageId) {
    console.log(`Email sent to ${to} with template ${templateName} (${messageId})`);
  }

  getClientIP() {
    // This would normally get IP from request, but since we're in a service,
    // we'll return a placeholder or get from environment
    return process.env.NODE_ENV === 'development' ? '127.0.0.1' : 'Unknown';
  }
}

module.exports = EmailService;