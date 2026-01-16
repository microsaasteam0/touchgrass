const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

class OGImageGenerator {
  constructor() {
    this.width = 1200;
    this.height = 630;
    this.fonts = {};
    
    // Try to register fonts
    try {
      const fontsDir = path.join(__dirname, '../../fonts');
      
      // Register Inter font family
      registerFont(path.join(fontsDir, 'Inter-Bold.ttf'), { family: 'Inter', weight: 'bold' });
      registerFont(path.join(fontsDir, 'Inter-Regular.ttf'), { family: 'Inter', weight: 'regular' });
      registerFont(path.join(fontsDir, 'Inter-Medium.ttf'), { family: 'Inter', weight: 'medium' });
      
      this.fonts.available = true;
    } catch (error) {
      console.warn('Custom fonts not available, using system fonts');
      this.fonts.available = false;
    }
  }

  // Generate OG image for streak
  async generateStreakImage(user, streakData, options = {}) {
    const {
      theme = 'default',
      language = 'en',
      showStats = true,
      showAvatar = true
    } = options;

    const canvas = createCanvas(this.width, this.height);
    const ctx = canvas.getContext('2d');

    // Set background based on theme
    this.setBackground(ctx, theme);

    // Add decorative elements
    await this.addDecorativeElements(ctx, streakData.currentStreak);

    // Add main content
    await this.addMainContent(ctx, user, streakData, showStats, showAvatar);

    // Add branding
    this.addBranding(ctx);

    // Add theme-specific accents
    this.addThemeAccents(ctx, theme, streakData.currentStreak);

    return canvas.toBuffer('image/png');
  }

  // Generate OG image for achievement
  async generateAchievementImage(user, achievement, options = {}) {
    const canvas = createCanvas(this.width, this.height);
    const ctx = canvas.getContext('2d');

    // Achievement-themed background
    const gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
    gradient.addColorStop(0, '#fbbf24');
    gradient.addColorStop(0.5, '#f59e0b');
    gradient.addColorStop(1, '#d97706');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    // Add sparkle effect
    this.addSparkles(ctx);

    // Add achievement icon
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 140px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(achievement.icon || '🏆', this.width / 2, this.height / 2 - 60);

    // Add achievement name
    ctx.fillStyle = '#ffffff';
    ctx.font = this.getFont('bold', 64);
    ctx.fillText(achievement.name, this.width / 2, this.height / 2 + 40);

    // Add user info
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = this.getFont('regular', 36);
    ctx.fillText(`Achieved by ${user.displayName}`, this.width / 2, this.height / 2 + 100);

    // Add date
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = this.getFont('regular', 24);
    const date = new Date(achievement.earnedAt).toLocaleDateString();
    ctx.fillText(`Earned on ${date}`, this.width / 2, this.height / 2 + 150);

    // Add branding
    this.addBranding(ctx);

    return canvas.toBuffer('image/png');
  }

  // Generate OG image for leaderboard
  async generateLeaderboardImage(leaderboardData, userRank, options = {}) {
    const canvas = createCanvas(this.width, this.height);
    const ctx = canvas.getContext('2d');

    // Leaderboard-themed background
    const gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
    gradient.addColorStop(0, '#1a2a3a');
    gradient.addColorStop(1, '#0d1b2a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    // Add title
    ctx.fillStyle = '#ffffff';
    ctx.font = this.getFont('bold', 72);
    ctx.textAlign = 'center';
    ctx.fillText('Global Leaderboard', this.width / 2, 100);

    // Add subtitle
    ctx.fillStyle = '#86efac';
    ctx.font = this.getFont('regular', 32);
    ctx.fillText('Top Grass Touchers Worldwide', this.width / 2, 160);

    // Add top 3 users
    const topUsers = leaderboardData.slice(0, 3);
    const startY = 250;
    const userHeight = 100;
    const userSpacing = 20;

    topUsers.forEach((user, index) => {
      const y = startY + (userHeight + userSpacing) * index;
      
      // User background
      ctx.fillStyle = index === 0 ? 'rgba(251, 191, 36, 0.2)' : 
                      index === 1 ? 'rgba(209, 213, 219, 0.2)' : 
                      'rgba(180, 83, 9, 0.2)';
      ctx.fillRect(100, y, this.width - 200, userHeight);
      
      // Rank badge
      ctx.fillStyle = index === 0 ? '#fbbf24' : 
                      index === 1 ? '#d1d5db' : 
                      '#b45309';
      this.drawBadge(ctx, 120, y + userHeight/2, index + 1);
      
      // User info
      ctx.fillStyle = '#ffffff';
      ctx.font = this.getFont('bold', 32);
      ctx.textAlign = 'left';
      ctx.fillText(user.displayName, 180, y + 40);
      
      ctx.fillStyle = '#86efac';
      ctx.font = this.getFont('regular', 24);
      ctx.fillText(`Day ${user.stats?.currentStreak || 0} • ${user.stats?.consistencyScore || 0}% consistency`, 180, y + 75);
      
      // Streak count
      ctx.fillStyle = '#22c55e';
      ctx.font = this.getFont('bold', 36);
      ctx.textAlign = 'right';
      ctx.fillText(`${user.stats?.currentStreak || 0}d`, this.width - 120, y + userHeight/2 + 10);
    });

    // Add user's rank if provided
    if (userRank) {
      ctx.fillStyle = '#22c55e';
      ctx.font = this.getFont('bold', 48);
      ctx.textAlign = 'center';
      ctx.fillText(`Your Rank: #${userRank.rank}`, this.width / 2, 600);
      
      ctx.fillStyle = '#86efac';
      ctx.font = this.getFont('regular', 32);
      ctx.fillText(`Top ${userRank.percentile || 0}% of all users`, this.width / 2, 640);
    }

    this.addBranding(ctx);

    return canvas.toBuffer('image/png');
  }

  // Generate OG image for challenge
  async generateChallengeImage(challenge, participants, options = {}) {
    const canvas = createCanvas(this.width, this.height);
    const ctx = canvas.getContext('2d');

    // Challenge-themed background
    const gradient = ctx.createLinearGradient(0, 0, this.width, 0);
    gradient.addColorStop(0, '#8b5cf6');
    gradient.addColorStop(0.5, '#7c3aed');
    gradient.addColorStop(1, '#6d28d9');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    // Add challenge icon
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚔️', this.width / 2, 150);

    // Add challenge title
    ctx.fillStyle = '#ffffff';
    ctx.font = this.getFont('bold', 64);
    ctx.fillText(challenge.name || `${challenge.type} Challenge`, this.width / 2, 260);

    // Add challenge details
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = this.getFont('regular', 32);
    
    const details = [
      `${challenge.duration} days`,
      `${participants.length} participants`,
      `Stake: $${challenge.stake || 0}`
    ];
    
    details.forEach((detail, index) => {
      ctx.fillText(detail, this.width / 2, 320 + index * 40);
    });

    // Add participant avatars
    const avatarSize = 60;
    const avatarSpacing = 10;
    const totalWidth = participants.length * (avatarSize + avatarSpacing) - avatarSpacing;
    const startX = (this.width - totalWidth) / 2;

    participants.slice(0, 12).forEach((participant, index) => {
      const x = startX + index * (avatarSize + avatarSpacing);
      const y = 420;
      
      // Draw avatar circle
      ctx.fillStyle = this.stringToColor(participant.displayName);
      ctx.beginPath();
      ctx.arc(x + avatarSize/2, y + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Add initials
      ctx.fillStyle = '#ffffff';
      ctx.font = this.getFont('bold', 24);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const initials = participant.displayName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      ctx.fillText(initials, x + avatarSize/2, y + avatarSize/2);
    });

    // Add count if more participants
    if (participants.length > 12) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = this.getFont('regular', 24);
      ctx.fillText(`+${participants.length - 12} more`, this.width / 2, 520);
    }

    this.addBranding(ctx);

    return canvas.toBuffer('image/png');
  }

  // Helper methods
  setBackground(ctx, theme) {
    const gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
    
    switch (theme) {
      case 'premium':
        gradient.addColorStop(0, '#0f172a');
        gradient.addColorStop(0.5, '#1e293b');
        gradient.addColorStop(1, '#334155');
        break;
      case 'nature':
        gradient.addColorStop(0, '#1b4332');
        gradient.addColorStop(0.5, '#2d6a4f');
        gradient.addColorStop(1, '#40916c');
        break;
      case 'sunset':
        gradient.addColorStop(0, '#f59e0b');
        gradient.addColorStop(0.5, '#ec4899');
        gradient.addColorStop(1, '#8b5cf6');
        break;
      case 'ocean':
        gradient.addColorStop(0, '#0369a1');
        gradient.addColorStop(0.5, '#0ea5e9');
        gradient.addColorStop(1, '#22d3ee');
        break;
      default:
        gradient.addColorStop(0, '#14532d');
        gradient.addColorStop(0.5, '#16a34a');
        gradient.addColorStop(1, '#22c55e');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  async addDecorativeElements(ctx, streak) {
    // Add grass pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    
    for (let i = 0; i < this.width; i += 60) {
      for (let j = 0; j < this.height; j += 60) {
        if ((i + j) % 120 === 0) {
          this.drawGrassBlade(ctx, i, j + 30);
        }
      }
    }

    // Add achievement badges based on streak
    if (streak >= 100) {
      this.drawFloatingBadge(ctx, this.width - 150, 100, '💯', '#fbbf24');
    }
    if (streak >= 30) {
      this.drawFloatingBadge(ctx, 150, 100, '🌟', '#60a5fa');
    }
    if (streak >= 7) {
      this.drawFloatingBadge(ctx, this.width - 150, this.height - 100, '🔥', '#ef4444');
    }
  }

  drawGrassBlade(ctx, x, y) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - 10, y - 30, x + 10, y - 50, x, y - 60);
    ctx.bezierCurveTo(x + 10, y - 50, x - 10, y - 30, x, y);
    ctx.closePath();
    ctx.fill();
  }

  drawFloatingBadge(ctx, x, y, emoji, color) {
    // Glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    
    // Badge background
    ctx.fillStyle = color + '40';
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Emoji
    ctx.fillStyle = color;
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, x, y);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  async addMainContent(ctx, user, streakData, showStats, showAvatar) {
    // Draw streak number
    ctx.fillStyle = '#ffffff';
    ctx.font = this.getFont('bold', 140);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(streakData.currentStreak.toString(), this.width / 2, this.height / 2 - 60);

    // Draw "DAY STREAK"
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = this.getFont('bold', 48);
    ctx.fillText('DAY STREAK', this.width / 2, this.height / 2 + 40);

    // Draw user info
    if (user.displayName) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = this.getFont('regular', 36);
      ctx.fillText(`${user.displayName}'s TouchGrass Journey`, this.width / 2, this.height / 2 + 120);
    }

    // Draw stats if enabled
    if (showStats && streakData.consistencyScore) {
      ctx.fillStyle = '#86efac';
      ctx.font = this.getFont('regular', 28);
      ctx.fillText(`${streakData.consistencyScore}% Consistency`, this.width / 2, this.height / 2 + 180);
    }

    // Draw avatar if enabled
    if (showAvatar && user.avatar) {
      try {
        const avatar = await loadImage(user.avatar);
        const avatarSize = 80;
        const avatarX = this.width / 2 - avatarSize / 2;
        const avatarY = 80;
        
        // Draw avatar with rounded corners
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();
      } catch (error) {
        console.warn('Failed to load avatar:', error);
        // Fallback to initials
        this.drawAvatarInitials(ctx, user.displayName, this.width / 2 - 40, 80, 80);
      }
    }
  }

  drawAvatarInitials(ctx, name, x, y, size) {
    const initials = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    const color = this.stringToColor(name);
    
    // Draw circle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw initials
    ctx.fillStyle = '#ffffff';
    ctx.font = this.getFont('bold', size/2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, x + size/2, y + size/2);
  }

  addBranding(ctx) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = this.getFont('regular', 24);
    ctx.textAlign = 'center';
    ctx.fillText('touchgrass.now', this.width / 2, this.height - 30);
  }

  addThemeAccents(ctx, theme, streak) {
    // Add subtle particles based on theme
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = Math.random() * 3 + 1;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add streak-specific decoration
    if (streak >= 100) {
      this.drawConfetti(ctx);
    }
  }

  drawConfetti(ctx) {
    const colors = ['#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];
    
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = Math.random() * 8 + 4;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const rotation = Math.random() * Math.PI * 2;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = color;
      ctx.fillRect(-size/2, -size/2, size, size);
      ctx.restore();
    }
  }

  addSparkles(ctx) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = Math.random() * 4 + 1;
      const rotation = Math.random() * Math.PI * 2;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // Draw sparkle shape
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size/3, -size/3);
      ctx.lineTo(size, 0);
      ctx.lineTo(size/3, size/3);
      ctx.lineTo(0, size);
      ctx.lineTo(-size/3, size/3);
      ctx.lineTo(-size, 0);
      ctx.lineTo(-size/3, -size/3);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }
  }

  drawBadge(ctx, x, y, rank) {
    const colors = {
      1: '#fbbf24',
      2: '#d1d5db',
      3: '#b45309'
    };
    
    const color = colors[rank] || '#6b7280';
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = this.getFont('bold', 24);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(rank.toString(), x, y);
  }

  getFont(weight = 'regular', size = 16) {
    if (this.fonts.available) {
      return `${weight === 'bold' ? 'bold ' : ''}${size}px Inter`;
    }
    return `${weight === 'bold' ? 'bold ' : ''}${size}px Arial`;
  }

  stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      '#22c55e', // Green
      '#3b82f6', // Blue
      '#8b5cf6', // Purple
      '#ec4899', // Pink
      '#f59e0b', // Amber
      '#ef4444', // Red
      '#10b981', // Emerald
      '#06b6d4', // Cyan
      '#f97316', // Orange
      '#6366f1'  // Indigo
    ];
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }

  // Generate social share image
  async generateSocialShareImage(type, data, options = {}) {
    switch (type) {
      case 'streak':
        return this.generateStreakImage(data.user, data.streakData, options);
      case 'achievement':
        return this.generateAchievementImage(data.user, data.achievement, options);
      case 'leaderboard':
        return this.generateLeaderboardImage(data.leaderboardData, data.userRank, options);
      case 'challenge':
        return this.generateChallengeImage(data.challenge, data.participants, options);
      default:
        return this.generateStreakImage(data.user, data.streakData, options);
    }
  }

  // Generate image for email
  async generateEmailImage(streak, user, options = {}) {
    const width = 600;
    const height = 400;
    
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Simple email-friendly design
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#22c55e');
    gradient.addColorStop(1, '#16a34a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Streak number
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(streak.toString(), width / 2, height / 2 - 30);

    // Text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('DAY STREAK', width / 2, height / 2 + 30);

    // User name
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '24px Arial';
    ctx.fillText(`Keep going, ${user.displayName}!`, width / 2, height / 2 + 80);

    // Branding
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '18px Arial';
    ctx.fillText('touchgrass.now', width / 2, height - 30);

    return canvas.toBuffer('image/png');
  }

  // Generate progress chart image
  async generateProgressChart(progressData, options = {}) {
    const width = 800;
    const height = 400;
    
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Weekly Progress', width / 2, 40);

    // Chart area
    const chartWidth = width - 100;
    const chartHeight = height - 150;
    const chartX = 50;
    const chartY = 80;

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    // Vertical lines
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayWidth = chartWidth / days.length;
    
    for (let i = 0; i <= days.length; i++) {
      const x = chartX + i * dayWidth;
      ctx.beginPath();
      ctx.moveTo(x, chartY);
      ctx.lineTo(x, chartY + chartHeight);
      ctx.stroke();
      
      // Day labels
      if (i < days.length) {
        ctx.fillStyle = '#888';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(days[i], x + dayWidth/2, chartY + chartHeight + 25);
      }
    }

    // Horizontal lines
    const maxValue = Math.max(...progressData.map(d => d.value), 100);
    const horizontalLines = 5;
    
    for (let i = 0; i <= horizontalLines; i++) {
      const y = chartY + (chartHeight / horizontalLines) * i;
      ctx.beginPath();
      ctx.moveTo(chartX, y);
      ctx.lineTo(chartX + chartWidth, y);
      ctx.stroke();
      
      // Value labels
      const value = maxValue - (maxValue / horizontalLines) * i;
      ctx.fillStyle = '#888';
      ctx.font = '14px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(value.toFixed(0), chartX - 10, y + 4);
    }

    // Draw progress line
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    progressData.forEach((data, index) => {
      const x = chartX + (index + 0.5) * dayWidth;
      const y = chartY + chartHeight - (data.value / maxValue) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();

    // Draw data points
    ctx.fillStyle = '#22c55e';
    progressData.forEach((data, index) => {
      const x = chartX + (index + 0.5) * dayWidth;
      const y = chartY + chartHeight - (data.value / maxValue) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Value labels
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(data.value.toString(), x, y - 15);
    });

    // Average line
    const average = progressData.reduce((sum, d) => sum + d.value, 0) / progressData.length;
    const avgY = chartY + chartHeight - (average / maxValue) * chartHeight;
    
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(chartX, avgY);
    ctx.lineTo(chartX + chartWidth, avgY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Average label
    ctx.fillStyle = '#fbbf24';
    ctx.font = '14px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Avg: ${average.toFixed(1)}`, chartX + chartWidth, avgY - 5);

    return canvas.toBuffer('image/png');
  }
}

module.exports = new OGImageGenerator();