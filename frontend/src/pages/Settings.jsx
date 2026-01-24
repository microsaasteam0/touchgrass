

import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Model';
import Toast from '../components/ui/Toast';
import { Download, Database, FileText, User, Bell, Eye, Palette, Shield, Link, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Premium Settings Page
 * Business-minded settings with true one-click data export
 */
const Settings = () => {
  const [settings, setSettings] = useState({
    profile: {
      publicProfile: true,
      showEmail: false,
      showLocation: true,
      showStreak: true,
      allowTags: true
    },
    notifications: {
      streakReminder: true,
      leaderboardUpdates: true,
      challengeInvites: true,
      achievementAlerts: true,
      marketingEmails: false,
      pushNotifications: true
    },
    privacy: {
      showOnLeaderboard: true,
      allowMessages: true,
      allowChallenges: true,
      dataSharing: false,
      deleteDataAfter: '90_days'
    },
    appearance: {
      theme: 'dark',
      fontSize: 'medium',
      animations: true,
      reduceMotion: false,
      highContrast: false
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
      sessionTimeout: '30_minutes',
      passwordLastChanged: '2023-11-15'
    },
    integrations: {
      googleFit: false,
      appleHealth: false,
      strava: false,
      fitbit: false
    }
  });

  const [activeCategory, setActiveCategory] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toasts, setToasts] = useState([]);
  const animationContainerRef = useRef(null);
  const downloadLinkRef = useRef(null);

  // Sample user data for export
  const userData = {
    profile: {
      userId: "user_123456",
      username: "grasstoucher42",
      email: "user@example.com",
      displayName: "Alex Johnson",
      joinedDate: "2023-01-15",
      lastLogin: new Date().toISOString(),
      location: {
        city: "San Francisco",
        country: "USA",
        timezone: "America/Los_Angeles"
      },
      bio: "Building discipline one day at a time!",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=grasstoucher42"
    },
    stats: {
      currentStreak: 42,
      longestStreak: 56,
      totalDays: 189,
      consistencyScore: 87,
      totalOutdoorTime: 6048,
      averageDailyTime: 32,
      verificationCount: 189,
      shameCount: 3
    },
    achievements: [
      { id: "ach_1", name: "Weekly Warrior", earnedAt: "2023-10-01", icon: "🔥" },
      { id: "ach_2", name: "Monthly Maestro", earnedAt: "2023-10-28", icon: "🌟" },
      { id: "ach_3", name: "Social Butterfly", earnedAt: "2023-11-15", icon: "🦋" },
      { id: "ach_4", name: "Early Bird", earnedAt: "2023-11-20", icon: "🌅" }
    ],
    streaks: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      verified: Math.random() > 0.2,
      method: Math.random() > 0.3 ? 'photo' : 'shame',
      duration: Math.floor(Math.random() * 60) + 5
    })),
    leaderboard: {
      globalRank: 42,
      cityRank: 7,
      consistencyRank: 28,
      socialRank: 15
    },
    challenges: [
      { id: "ch_1", name: "7-Day Sprint", joined: "2023-11-01", completed: true, rank: 3 },
      { id: "ch_2", name: "Monthly Warrior", joined: "2023-11-01", completed: false, progress: 86 },
      { id: "ch_3", name: "Social Share Challenge", joined: "2023-11-15", completed: true, rank: 1 }
    ],
    social: {
      friends: ["user_789", "user_456", "user_789"],
      followers: 24,
      following: 18,
      shares: 12,
      likes: 89
    },
    subscriptions: {
      currentPlan: "premium",
      subscribedSince: "2023-08-15",
      renewalDate: "2023-12-15",
      paymentHistory: [
        { date: "2023-08-15", amount: 14.99, plan: "premium" },
        { date: "2023-09-15", amount: 14.99, plan: "premium" },
        { date: "2023-10-15", amount: 14.99, plan: "premium" }
      ]
    },
    settings: settings,
    exportInfo: {
      exportedAt: new Date().toISOString(),
      appVersion: "2.1.0",
      dataVersion: "1.0"
    }
  };

  useEffect(() => {
    loadSettings();
    startSettingsAnimations();
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);
    downloadLinkRef.current = link;
    
    return () => {
      if (downloadLinkRef.current) {
        document.body.removeChild(downloadLinkRef.current);
      }
    };
  }, []);

  const loadSettings = () => {
    setTimeout(() => {}, 500);
  };

  const startSettingsAnimations = () => {
    const container = animationContainerRef.current;
    if (!container) return;

    const icons = ['⚙️', '🔒', '🎨', '🔔', '🔗', '🛡️', '💾'];
    icons.forEach((icon, index) => {
      const element = document.createElement('div');
      element.className = 'floating-setting-icon';
      element.textContent = icon;
      element.style.left = `${10 + Math.random() * 80}%`;
      element.style.top = `${10 + Math.random() * 80}%`;
      element.style.animationDelay = `${index * 0.2}s`;
      element.style.opacity = 0.1 + Math.random() * 0.1;
      container.appendChild(element);
    });
  };

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const saveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast('Settings saved successfully!', 'success');
    }, 1000);
  };

  // TRUE ONE-CLICK DATA EXPORT - NO MODAL, DIRECT DOWNLOAD
  const handleExportData = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    
    // Immediately start download without showing modal
    const completeData = {
      ...userData,
      settings: settings,
      exportInfo: {
        ...userData.exportInfo,
        exportedAt: new Date().toISOString(),
        format: 'json'
      }
    };

    const data = JSON.stringify(completeData, null, 2);
    const filename = `touchgrass-data-${new Date().toISOString().split('T')[0]}.json`;
    const mimeType = 'application/json';

    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    if (downloadLinkRef.current) {
      downloadLinkRef.current.href = url;
      downloadLinkRef.current.download = filename;
      downloadLinkRef.current.click();
      
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    }

    setIsExporting(false);
    addToast('✅ Data exported! Check your downloads folder.', 'success');
  };

  const addToast = (message, type = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const categories = [
    { id: 'profile', label: 'Profile', icon: <User size={20} />, color: '#22c55e' },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} />, color: '#3b82f6' },
    { id: 'privacy', label: 'Privacy', icon: <Eye size={20} />, color: '#8b5cf6' },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={20} />, color: '#ec4899' },
    { id: 'security', label: 'Security', icon: <Shield size={20} />, color: '#f59e0b' },
    { id: 'integrations', label: 'Integrations', icon: <Link size={20} />, color: '#06b6d4' },
    { id: 'data', label: 'Data & Export', icon: <Database size={20} />, color: '#10b981' },
    // { id: 'danger', label: 'Danger Zone', icon: <AlertCircle size={20} />, color: '#ef4444' }
  ];

  const categoryIcons = {
    profile: '👤',
    notifications: '🔔',
    privacy: '🔒',
    appearance: '🎨',
    security: '🛡️',
    integrations: '🔗',
    data: '💾',
    danger: '⚠️'
  };

  const pageStyles = `
    .settings-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    .settings-background {
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(circle at 10% 10%, rgba(34, 197, 94, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 90% 90%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
    }

    .settings-content {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 2rem;
    }

    .settings-header {
      grid-column: 1 / -1;
      margin-bottom: 2rem;
      animation: fadeInUp 0.6s ease-out;
    }

    .settings-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.02em;
    }

    .settings-subtitle {
      font-size: 1.125rem;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
    }

    .categories-sidebar {
      position: sticky;
      top: 2rem;
      height: fit-content;
    }

    .category-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .category-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: left;
      width: 100%;
    }

    .category-item:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(4px);
    }

    .category-item.active {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(21, 128, 61, 0.2) 100%);
      border-color: rgba(34, 197, 94, 0.3);
      color: white;
    }

    .category-icon {
      font-size: 1.25rem;
      width: 24px;
      text-align: center;
    }

    .settings-main {
      animation: fadeInUp 0.6s ease-out 0.2s both;
    }

    .settings-section {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
      transition: all 0.3s ease;
    }

    .settings-section:hover {
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .section-icon {
      font-size: 1.5rem;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
      margin: 0;
    }

    .section-description {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
      margin: 0.25rem 0 0 0;
    }

    .settings-grid {
      display: grid;
      gap: 1.5rem;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .setting-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .setting-info {
      flex: 1;
    }

    .setting-label {
      font-size: 1rem;
      font-weight: 500;
      color: white;
      margin: 0 0 0.25rem 0;
    }

    .setting-description {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
      line-height: 1.5;
    }

    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 32px;
      margin-left: 1rem;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 9999px;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 24px;
      width: 24px;
      left: 4px;
      bottom: 3px;
      background: white;
      border-radius: 50%;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    input:checked + .toggle-slider {
      background: linear-gradient(135deg, #22c55e, #16a34a);
      border-color: rgba(34, 197, 94, 0.5);
    }

    input:checked + .toggle-slider:before {
      transform: translateX(28px);
    }

    input:focus + .toggle-slider {
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
    }

    input:disabled + .toggle-slider {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .select-container {
      position: relative;
      min-width: 200px;
    }

    .select-styled {
      width: 100%;
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      font-size: 0.875rem;
      appearance: none;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .select-styled:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .select-styled:focus {
      outline: none;
      border-color: rgba(34, 197, 94, 0.5);
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    }

    .select-arrow {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      color: rgba(255, 255, 255, 0.6);
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .danger-zone {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
      border: 1px solid rgba(239, 68, 68, 0.2);
      animation: dangerPulse 2s ease-in-out infinite;
    }

    .danger-zone .section-icon {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }

    .data-export {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(21, 128, 61, 0.1) 100%);
      border: 1px solid rgba(34, 197, 94, 0.2);
    }

    .data-export .section-icon {
      background: rgba(34, 197, 94, 0.2);
      color: #22c55e;
    }

    .floating-setting-icon {
      position: absolute;
      font-size: 1.5rem;
      opacity: 0.1;
      animation: floatAround 20s linear infinite;
      pointer-events: none;
      z-index: 1;
    }

    /* Data Stats */
    .data-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin: 1.5rem 0;
    }

    .data-stat {
      text-align: center;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
    }

    .data-stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #22c55e;
      margin: 0 0 0.25rem 0;
    }

    .data-stat-label {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.6);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes floatAround {
      0% {
        transform: translate(0, 0) rotate(0deg);
      }
      25% {
        transform: translate(100px, 50px) rotate(90deg);
      }
      50% {
        transform: translate(50px, 100px) rotate(180deg);
      }
      75% {
        transform: translate(-50px, 50px) rotate(270deg);
      }
      100% {
        transform: translate(0, 0) rotate(360deg);
      }
    }

    @keyframes dangerPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.9; }
    }

    .integration-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .integration-card:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .integration-icon {
      font-size: 1.5rem;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
    }

    .integration-info {
      flex: 1;
    }

    .integration-name {
      font-size: 1rem;
      font-weight: 500;
      color: white;
      margin: 0 0 0.25rem 0;
    }

    .integration-status {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
    }

    .integration-status.connected {
      color: #22c55e;
    }

    @media (max-width: 1024px) {
      .settings-content {
        grid-template-columns: 1fr;
      }
      
      .categories-sidebar {
        position: static;
      }
      
      .category-list {
        flex-direction: row;
        overflow-x: auto;
        padding-bottom: 1rem;
      }
      
      .category-item {
        white-space: nowrap;
      }
    }

    @media (max-width: 768px) {
      .settings-container {
        padding: 1rem;
      }
      
      .setting-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      
      .toggle-switch {
        align-self: flex-start;
        margin-left: 0;
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .data-stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `;

  const renderSettingsContent = () => {
    const category = categories.find(c => c.id === activeCategory);
    if (!category) return null;

    switch (activeCategory) {
      case 'data':
        return (
          <div className="settings-main">
            <Card className="settings-section data-export">
              <div className="section-header">
                <div className="section-icon">
                  💾
                </div>
                <div>
                  <h2 className="section-title">Data & Export</h2>
                  <p className="section-description">Download all your TouchGrass data in one click</p>
                </div>
              </div>
              
              <div className="settings-grid">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3 className="setting-label">Your Data Statistics</h3>
                    <p className="setting-description">
                      Overview of all data that will be included in your export
                    </p>
                  </div>
                </div>

                <div className="data-stats-grid">
                  {/* <div className="data-stat">
                    <div className="data-stat-value">{userData.stats.totalDays}</div>
                    <div className="data-stat-label">Total Days</div>
                  </div>
                  <div className="data-stat">
                    <div className="data-stat-value">{userData.achievements.length}</div>
                    <div className="data-stat-label">Achievements</div>
                  </div>
                  <div className="data-stat">
                    <div className="data-stat-value">{userData.streaks.length}</div>
                    <div className="data-stat-label">Streak History</div>
                  </div>
                  <div className="data-stat">
                    <div className="data-stat-value">{userData.challenges.length}</div>
                    <div className="data-stat-label">Challenges</div>
                  </div> */}
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3 className="setting-label">What's Included</h3>
                    <p className="setting-description">
                      All your TouchGrass analytics including:
                    </p>
                    <ul style={{ 
                      paddingLeft: '20px', 
                      marginTop: '10px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px'
                    }}>
                      <li>📊 Complete profile analytics and statistics</li>
                      <li>🏆 All achievements and badges earned</li>
                      <li>📅 Full streak history with verification methods</li>
                      <li>🥇 Leaderboard rankings and social metrics</li>
                      <li>⚡ Performance insights and consistency scores</li>
                      <li>🔧 Account settings and preferences</li>
                    </ul>
                  </div>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3 className="setting-label">Export Your Complete Data</h3>
                    <p className="setting-description">
                      One-click download of all your TouchGrass data as a JSON file
                    </p>
                  </div>
                  <Button 
                    variant="primary"
                    onClick={handleExportData}
                    isLoading={isExporting}
                    leftIcon={<Download />}
                    style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
                  >
                    {isExporting ? 'Exporting...' : '📥 Export Data Now'}
                  </Button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3 className="setting-label">Data Retention</h3>
                    <p className="setting-description">
                      Automatically delete your data after a period of inactivity
                    </p>
                  </div>
                  <div className="select-container">
                    <select
                      className="select-styled"
                      value={settings.privacy.deleteDataAfter}
                      onChange={(e) => handleSettingChange('privacy', 'deleteDataAfter', e.target.value)}
                    >
                      <option value="30_days">30 days</option>
                      <option value="90_days">90 days</option>
                      <option value="180_days">180 days</option>
                      <option value="365_days">1 year</option>
                      <option value="never">Never</option>
                    </select>
                    <div className="select-arrow">▼</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return (
          <div className="settings-main">
            <Card className="settings-section">
              <div className="section-header">
                <div className="section-icon" style={{ background: category.color + '20', color: category.color }}>
                  {categoryIcons[activeCategory]}
                </div>
                <div>
                  <h2 className="section-title">{category.label} Settings</h2>
                  <p className="section-description">Manage your {category.label.toLowerCase()} preferences</p>
                </div>
              </div>
              
              <div className="settings-grid">
                {Object.entries(settings[activeCategory]).map(([key, value]) => (
                  <div key={key} className="setting-item">
                    <div className="setting-info">
                      <h3 className="setting-label">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </h3>
                      <p className="setting-description">
                        Control your {key.toLowerCase()} settings
                      </p>
                    </div>
                    {typeof value === 'boolean' ? (
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleSettingChange(activeCategory, key, e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    ) : key === 'sessionTimeout' ? (
                      <div className="select-container">
                        <select
                          className="select-styled"
                          value={value}
                          onChange={(e) => handleSettingChange(activeCategory, key, e.target.value)}
                        >
                          <option value="15_minutes">15 minutes</option>
                          <option value="30_minutes">30 minutes</option>
                          <option value="1_hour">1 hour</option>
                          <option value="4_hours">4 hours</option>
                          <option value="24_hours">24 hours</option>
                        </select>
                        <div className="select-arrow">▼</div>
                      </div>
                    ) : (
                      <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
                        {value}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );
    }
  };

  return (
    <>
      <style>{pageStyles}</style>
      <div className="settings-container" ref={animationContainerRef}>
        <div className="settings-background" />
        
        <div className="settings-content">
          <div className="settings-header">
            <h1 className="settings-title">Settings</h1>
            <p className="settings-subtitle">
              Manage your account preferences, privacy, and security settings
            </p>
          </div>
          
          <div className="categories-sidebar">
            <div className="category-list">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                  style={{ borderLeftColor: activeCategory === category.id ? category.color : 'transparent' }}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {renderSettingsContent()}
          
          <div className="action-buttons" style={{ gridColumn: '1 / -1' }}>
            <Button
              variant="primary"
              size="large"
              onClick={saveSettings}
              isLoading={isSaving}
              fullWidth
            >
              💾 Save Changes
            </Button>
            <Button
              variant="secondary"
              size="large"
              onClick={() => window.history.back()}
              fullWidth
            >
              ↩️ Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          />
        ))}
      </div>
    </>
  );
};

export default Settings;