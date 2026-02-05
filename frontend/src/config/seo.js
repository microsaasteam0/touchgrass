import React from 'react';
  

  export const SEO_CONFIG = {
  home: {
    title: 'TouchGrass - Daily Accountability & Habit Building Platform',
    description: 'Build unbreakable outdoor habits with psychology-backed streak systems. Join thousands using behavioral science to build discipline.',
    canonical: '/',
    ogImage: '/og-home.png'
  },
  dashboard: {
    title: 'Dashboard - Your TouchGrass Streak & Stats',
    description: 'Track your daily streak, consistency score, and progress. Monitor your accountability journey.',
    canonical: '/dashboard',
    ogImage: '/og-dashboard.png',
    noindex: true // Private page
  },
  leaderboard: {
    title: 'Global Leaderboard - Top TouchGrass Performers',
    description: 'See who has the longest streaks, highest consistency, and best accountability records worldwide.',
    canonical: '/leaderboard',
    ogImage: '/og-leaderboard.png'
  },
  verify: {
    title: 'Verify Today - TouchGrass Daily Check-in',
    description: 'Prove your outdoor activity or accept accountability. Maintain your streak and build discipline.',
    canonical: '/verify',
    ogImage: '/og-verify.png',
    noindex: true
  },
  subscription: {
    title: 'Premium Plans - Upgrade Your TouchGrass Experience',
    description: 'Unlock unlimited streaks, advanced analytics, and premium features. Choose your accountability plan.',
    canonical: '/subscription',
    ogImage: '/og-subscription.png'
  },
  chat: {
    title: 'Community Chat - Connect with TouchGrass Users',
    description: 'Chat with fellow accountability partners, share streaks, start challenges, and build community.',
    canonical: '/chat',
    ogImage: '/og-chat.png'
  },
  shameWall: {
    title: 'Shame Wall - Public Accountability Feed',
    description: 'See who failed to verify today. Public accountability drives consistency and habit formation.',
    canonical: '/shame',
    ogImage: '/og-shame.png'
  }
};

// FAQ Questions for different pages
export const FAQ_QUESTIONS = {
  home: [
    {
      question: "What is TouchGrass?",
      answer: "TouchGrass is a behavioral psychology-based platform that helps you build daily outdoor habits through streak motivation, loss aversion, and social accountability."
    },
    {
      question: "How does the streak system work?",
      answer: "You verify daily outdoor activity. Break your streak as a free user? You can pay to restore it using loss aversion psychology that's more effective than rewards."
    },
    {
      question: "Is TouchGrass free?",
      answer: "Yes! Free plan includes 7-day streaks and basic features. Premium ($14.99/month) adds unlimited streaks, analytics, and streak freeze tokens."
    },
    {
      question: "What's the 'shame' feature?",
      answer: "Miss a day? Post a public accountability message. This social pressure creates viral growth and powerful motivation through peer accountability."
    },
    {
      question: "Can I compete with friends?",
      answer: "Absolutely! Chat features, group challenges, and global leaderboards let you build accountability circles and competitive streaks."
    }
  ],
  subscription: [
    {
      question: "What's included in the Free plan?",
      answer: "7-day streak capability, basic leaderboard access, daily reminders, and public profile. Perfect for starting your accountability journey."
    },
    {
      question: "What are Premium features?",
      answer: "Unlimited streaks, advanced analytics, streak freeze tokens, priority support, custom challenges, and no ads."
    },
    {
      question: "How does streak restoration payment work?",
      answer: "Break your streak as a free user? Pay a small fee to restore it. This loss aversion method is 2x more effective than reward-based systems."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes! Cancel your Premium subscription anytime. Your data and streaks remain, but Premium features will be disabled at the end of your billing period."
    },
    {
      question: "Do you offer team/enterprise plans?",
      answer: "Yes! Enterprise plans include white-label solutions, API access, custom reporting, and dedicated support for organizations."
    }
  ]
};