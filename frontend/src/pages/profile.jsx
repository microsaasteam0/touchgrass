import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import challengeService from '../services/challengeService';
import { useAuth } from '../contexts/AuthContext';
import { useStreak } from '../contexts/StreakContext';
import Logo from '../components/ui/Logo';
import {
  Bell, Settings, Calendar, Flame, Target, Trophy, Users, TrendingUp, Clock,
  Share2, Camera, CheckCircle2, Download, Award, Activity, BarChart3, Home,
  LogOut, Sparkles, Target as TargetIcon2, Compass, MessageSquare, Linkedin,
  Twitter, Facebook, Instagram, XCircle, Zap, ArrowRight, ExternalLink, User,
  Edit, MapPin, Mail, ChevronLeft, CheckCircle, X, Plus, Crown, Star, Heart,
  Brain, Lightbulb, TrendingDown, BarChart, PieChart, Activity as ActivityIcon,
  Target as TargetIcon, Award as AwardIcon, Users as UsersIcon, Eye, MessageCircle,
  Globe, FileText, Search, Mic, Shield, Zap as ZapIcon, CalendarDays, BrainCircuit,
  CloudRain, Sun, Moon, Wind, Droplets, Thermometer, AlertCircle, CheckSquare,
  XSquare, Flag, Timer, Target as TargetIcon3, EyeOff, MessageSquare as MessageSquareIcon,
  DollarSign, ChartBar, UserCheck, Users as UsersGroup, Briefcase, Coffee, BookOpen,
  Music, Dumbbell, Utensils, Smile, Frown, Meh, Activity as ActivityIcon2,
  Heart as HeartIcon, Brain as BrainIcon, Target as TargetIcon4, Award as AwardIcon2,
  Trophy as TrophyIcon, Crown as CrownIcon, Star as StarIcon, Zap as ZapIcon2,
  Flame as FlameIcon, TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon,
  BarChart as BarChartIcon
} from 'lucide-react';

const Profile = ({ onNavigate }) => {
  // Get user from Supabase auth context
  const { user, session } = useAuth();

  // User State
  const [showAchievement, setShowAchievement] = useState(false);
  const [showSocialShareModal, setShowSocialShareModal] = useState(false);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [activeTab, setActiveTab] = useState('challenges');
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [socialStats, setSocialStats] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [timeLeft, setTimeLeft] = useState('');
  
  // Challenge states
  const [availableChallenges, setAvailableChallenges] = useState([]);
  const [activeUserChallenges, setActiveUserChallenges] = useState([]);
  const [challengesLoading, setChallengesLoading] = useState(false);
  
  // Profile edit state
  const [profileEdit, setProfileEdit] = useState({
    displayName: '',
    bio: '',
    city: '',
    country: ''
  });
  
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  // New challenge state
  const [newChallenge, setNewChallenge] = useState({
    name: '',
    description: '',
    duration: 7,
    type: 'mindset',
    difficulty: 'medium',
    rules: ['']
  });

  // CSS Styles
  const styles = `
    /* Profile CSS matching dashboard styling - RESPONSIVE VERSION */
    .profile-page {
      width: 100%;
      min-width: 320px;
      overflow-x: hidden;
      background: #050505;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
      position: relative;
      min-height: 100vh;
      box-sizing: border-box;
    }

    /* Mobile-first responsive reset */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* Background Effects - Responsive */
    .profile-bg-grid {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: clamp(20px, 4vw, 50px) clamp(20px, 4vw, 50px);
      pointer-events: none;
      z-index: 1;
    }

    .profile-floating-elements {
      position: fixed;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    .profile-floating-element {
      position: absolute;
      border-radius: 50%;
      filter: blur(40px);
      opacity: 0.1;
      animation: float 20s infinite linear;
    }

    .profile-float-1 {
      width: clamp(200px, 30vw, 400px);
      height: clamp(200px, 30vw, 400px);
      background: linear-gradient(135deg, #22c55e, #3b82f6);
      top: 10%;
      left: clamp(5%, 2vw, 10%);
      animation-delay: 0s;
    }

    .profile-float-2 {
      width: clamp(150px, 25vw, 300px);
      height: clamp(150px, 25vw, 300px);
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      top: 60%;
      right: clamp(5%, 2vw, 15%);
      animation-delay: -5s;
    }

    .profile-float-3 {
      width: clamp(100px, 20vw, 250px);
      height: clamp(100px, 20vw, 250px);
      background: linear-gradient(135deg, #fbbf24, #ef4444);
      bottom: 20%;
      left: clamp(10%, 3vw, 20%);
      animation-delay: -10s;
    }

    @keyframes float {
      0%, 100% {
        transform: translate(0, 0) rotate(0deg);
      }
      25% {
        transform: translate(clamp(10px, 2vw, 50px), clamp(-10px, -2vw, -50px)) rotate(90deg);
      }
      50% {
        transform: translate(0, clamp(-20px, -4vw, -100px)) rotate(180deg);
      }
      75% {
        transform: translate(clamp(-10px, -2vw, -50px), clamp(-10px, -2vw, -50px)) rotate(270deg);
      }
    }

    /* Glass Effect */
    .glass {
      backdrop-filter: blur(10px);
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Text Gradient */
    .text-gradient {
      background: linear-gradient(135deg, #00E5FF 0%, #7F00FF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Profile Navigation - Responsive */
    .profile-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 50;
      padding: clamp(0.5rem, 2vw, 1rem) clamp(0.75rem, 3vw, 1.5rem);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(15, 23, 42, 0.95);
    }

    .profile-nav-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: clamp(0.5rem, 2vw, 1rem);
    }

    .profile-nav-logo {
      display: flex;
      align-items: center;
      gap: clamp(0.25rem, 1vw, 0.5rem);
      cursor: pointer;
    }

    .profile-nav-logo-text {
      font-size: clamp(1rem, 4vw, 1.5rem);
      font-weight: 900;
      letter-spacing: -0.025em;
      text-transform: uppercase;
      font-style: italic;
      line-height: 1;
    }

    .profile-nav-logo-highlight {
      color: #00E5FF;
    }

    /* Time counter for mobile */
    .time-counter {
      display: flex;
      align-items: center;
      gap: clamp(0.25rem, 1vw, 0.5rem);
      font-size: clamp(0.625rem, 2vw, 0.75rem);
      color: #71717a;
      background: rgba(255, 255, 255, 0.05);
      padding: clamp(0.25rem, 1vw, 0.375rem) clamp(0.5rem, 1.5vw, 0.75rem);
      border-radius: 0.75rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .time-label {
      display: none;
    }

    @media (min-width: 480px) {
      .time-label {
        display: inline;
      }
    }

    .profile-nav-links {
      display: none;
    }

    @media (min-width: 768px) {
      .profile-nav-links {
        display: flex;
        align-items: center;
        gap: clamp(1rem, 3vw, 2rem);
      }
    }

    .profile-nav-link {
      font-size: clamp(0.5rem, 1.5vw, 0.625rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #71717a;
      transition: color 0.2s;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      white-space: nowrap;
    }

    .profile-nav-link:hover {
      color: white;
    }

    .profile-nav-button {
      padding: clamp(0.375rem, 1.5vw, 0.5rem) clamp(1rem, 3vw, 1.5rem);
      background: #00E5FF;
      color: black;
      border-radius: clamp(0.5rem, 2vw, 0.75rem);
      font-size: clamp(0.625rem, 2vw, 0.75rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .profile-nav-button:hover {
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(0, 229, 255, 0.4);
    }

    .profile-nav-button:active {
      transform: scale(0.95);
    }

    /* User Profile Header - Responsive */
    .user-profile-header {
      display: flex;
      align-items: center;
      gap: clamp(0.5rem, 2vw, 1rem);
      padding: clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1rem);
      border-radius: clamp(0.75rem, 2vw, 1rem);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      transition: all 0.2s;
      min-width: 0;
    }

    .user-profile-header:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    .user-avatar {
      width: clamp(2rem, 6vw, 2.5rem);
      height: clamp(2rem, 6vw, 2.5rem);
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #00E5FF;
      flex-shrink: 0;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      min-width: 0;
      overflow: hidden;
    }

    .user-name {
      font-size: clamp(0.75rem, 2.5vw, 0.875rem);
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 120px;
    }

    @media (min-width: 480px) {
      .user-name {
        max-width: 150px;
      }
    }

    .user-status {
      font-size: clamp(0.5rem, 1.5vw, 0.625rem);
      color: #22c55e;
      display: flex;
      align-items: center;
      gap: clamp(0.125rem, 0.5vw, 0.25rem);
      white-space: nowrap;
    }

    /* Profile Header - Responsive */
    .profile-header {
      padding-top: clamp(6rem, 15vw, 8rem);
      padding-bottom: clamp(2rem, 8vw, 4rem);
      padding-left: clamp(1rem, 3vw, 1.5rem);
      padding-right: clamp(1rem, 3vw, 1.5rem);
      text-align: center;
      position: relative;
      z-index: 2;
    }

    @media (min-width: 768px) {
      .profile-header {
        text-align: left;
      }
    }

    .profile-header-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .profile-welcome {
      font-size: clamp(2rem, 10vw, 4rem);
      font-weight: 900;
      letter-spacing: -0.025em;
      line-height: 1;
      margin-bottom: clamp(1rem, 3vw, 1.5rem);
      text-transform: uppercase;
      font-style: italic;
      word-break: break-word;
    }

    .profile-subtitle {
      font-size: clamp(0.875rem, 3vw, 1.25rem);
      color: #a1a1aa;
      max-width: 600px;
      line-height: 1.5;
      font-weight: 300;
      margin: 0 auto;
    }

    @media (min-width: 768px) {
      .profile-subtitle {
        margin: 0;
      }
    }

    /* Main Grid - Responsive */
    .profile-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: clamp(1rem, 3vw, 2rem);
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 clamp(1rem, 3vw, 1.5rem) clamp(2rem, 8vw, 4rem);
      position: relative;
      z-index: 2;
    }

    @media (min-width: 1024px) {
      .profile-grid {
        grid-template-columns: 2fr 1fr;
      }
    }

    /* Main Content */
    .profile-main-content {
      display: flex;
      flex-direction: column;
      gap: clamp(1rem, 3vw, 2rem);
    }

    /* Profile Hero - Responsive */
    .profile-hero {
      padding: clamp(1.5rem, 5vw, 3rem);
      border-radius: clamp(1.5rem, 6vw, 3rem);
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.1), transparent, rgba(127, 0, 255, 0.1));
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: clamp(1rem, 3vw, 2rem);
      position: relative;
      overflow: hidden;
    }

    @media (min-width: 768px) {
      .profile-hero {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .profile-visual {
      position: relative;
      text-align: center;
    }

    .profile-avatar-large {
      width: clamp(100px, 25vw, 160px);
      height: clamp(100px, 25vw, 160px);
      border-radius: 50%;
      object-fit: cover;
      border: clamp(2px, 0.5vw, 4px) solid rgba(0, 229, 255, 0.2);
      margin: 0 auto;
    }

    .streak-badge {
      position: absolute;
      bottom: 0;
      right: 0;
      width: clamp(2rem, 6vw, 3rem);
      height: clamp(2rem, 6vw, 3rem);
      border-radius: 50%;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: clamp(0.875rem, 3vw, 1.25rem);
      border: 3px solid #050505;
    }

    .profile-info {
      flex: 1;
      text-align: center;
      width: 100%;
    }

    @media (min-width: 768px) {
      .profile-info {
        text-align: left;
      }
    }

    .profile-name {
      font-size: clamp(1.5rem, 5vw, 2rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.025em;
      margin-bottom: clamp(0.25rem, 1vw, 0.5rem);
      background: linear-gradient(135deg, #00E5FF 0%, #7F00FF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.2;
      word-break: break-word;
    }

    .profile-bio {
      color: #71717a;
      font-size: clamp(0.875rem, 2.5vw, 1rem);
      font-weight: 300;
      line-height: 1.5;
      margin-bottom: clamp(1rem, 3vw, 2rem);
      max-width: 100%;
    }

    @media (min-width: 768px) {
      .profile-bio {
        max-width: 400px;
      }
    }

    .profile-meta {
      display: flex;
      flex-wrap: wrap;
      gap: clamp(0.5rem, 2vw, 1rem);
      margin-bottom: clamp(1rem, 3vw, 2rem);
      justify-content: center;
    }

    @media (min-width: 768px) {
      .profile-meta {
        justify-content: flex-start;
      }
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: clamp(0.25rem, 1vw, 0.5rem);
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      color: #a1a1aa;
      white-space: nowrap;
    }

    .profile-actions {
      display: flex;
      flex-direction: column;
      gap: clamp(0.5rem, 2vw, 1rem);
      width: 100%;
    }

    @media (min-width: 480px) {
      .profile-actions {
        flex-direction: row;
        flex-wrap: wrap;
      }
    }

    @media (min-width: 768px) {
      .profile-actions {
        flex-direction: row;
        flex-wrap: nowrap;
      }
    }

    .profile-button {
      padding: clamp(0.75rem, 2.5vw, 1rem) clamp(1rem, 4vw, 2rem);
      border-radius: clamp(0.75rem, 2vw, 1rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: clamp(0.625rem, 2vw, 0.75rem);
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: clamp(0.25rem, 1vw, 0.5rem);
      min-height: clamp(40px, 10vw, 48px);
      flex: 1;
      min-width: 0;
    }

    @media (min-width: 480px) {
      .profile-button {
        flex: 0 1 auto;
      }
    }

    .profile-button:hover {
      transform: scale(1.05);
    }

    .profile-button:active {
      transform: scale(0.95);
    }

    .button-primary {
      background: #00E5FF;
      color: black;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .button-primary:hover {
      background: rgba(0, 229, 255, 0.9);
    }

    .button-secondary {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
    }

    .button-secondary:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    /* Stats Grid - Responsive */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: clamp(0.5rem, 2vw, 1rem);
    }

    @media (min-width: 640px) {
      .stats-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .stat-card {
      padding: clamp(1rem, 3vw, 2rem);
      border-radius: clamp(1rem, 4vw, 2rem);
      border: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      transition: all 0.3s;
      min-height: clamp(140px, 25vw, 180px);
    }

    .stat-card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(0, 229, 255, 0.2);
    }

    .stat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: clamp(0.75rem, 2vw, 1.5rem);
    }

    .stat-icon {
      width: clamp(2rem, 6vw, 3rem);
      height: clamp(2rem, 6vw, 3rem);
      border-radius: clamp(0.75rem, 2vw, 1rem);
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 229, 255, 0.1);
      color: #00E5FF;
      border: 1px solid rgba(0, 229, 255, 0.2);
      flex-shrink: 0;
    }

    .stat-change {
      font-size: clamp(0.5rem, 1.5vw, 0.625rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: clamp(0.125rem, 0.5vw, 0.25rem) clamp(0.5rem, 1.5vw, 0.75rem);
      border-radius: 9999px;
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
      white-space: nowrap;
    }

    .stat-value {
      font-size: clamp(1.5rem, 5vw, 2.5rem);
      font-weight: 900;
      margin-bottom: clamp(0.25rem, 1vw, 0.5rem);
      line-height: 1;
    }

    .stat-label {
      font-size: clamp(0.5rem, 1.5vw, 0.625rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #71717a;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .stat-description {
      font-size: clamp(0.625rem, 1.5vw, 0.75rem);
      color: #a1a1aa;
      margin-top: clamp(0.25rem, 1vw, 0.5rem);
      line-height: 1.4;
    }

    /* Tabs - Responsive */
    .profile-tabs {
      display: flex;
      gap: clamp(0.25rem, 1vw, 0.5rem);
      background: rgba(255, 255, 255, 0.05);
      border-radius: clamp(0.75rem, 2vw, 1rem);
      padding: clamp(0.25rem, 1vw, 0.5rem);
      margin-bottom: clamp(1rem, 3vw, 2rem);
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .profile-tabs::-webkit-scrollbar {
      display: none;
    }

    .profile-tab {
      flex: 1;
      padding: clamp(0.75rem, 2vw, 1rem) clamp(1rem, 2.5vw, 1.5rem);
      border: none;
      background: transparent;
      color: #71717a;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: clamp(0.625rem, 1.5vw, 0.75rem);
      border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: clamp(0.25rem, 1vw, 0.5rem);
      white-space: nowrap;
      min-height: clamp(40px, 10vw, 48px);
    }

    .profile-tab:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }

    .profile-tab.active {
      color: white;
      background: rgba(0, 229, 255, 0.2);
      border: 1px solid rgba(0, 229, 255, 0.3);
    }

    /* Activity Feed - Responsive */
    .activity-section {
      padding: clamp(1.5rem, 4vw, 2.5rem);
      border-radius: clamp(1.5rem, 6vw, 3rem);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: clamp(1rem, 3vw, 2rem);
      flex-wrap: wrap;
      gap: clamp(0.5rem, 2vw, 1rem);
    }

    .section-title {
      font-size: clamp(1rem, 4vw, 1.5rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.025em;
      display: flex;
      align-items: center;
      gap: clamp(0.25rem, 1vw, 0.5rem);
      line-height: 1;
    }

    .view-all-button {
      font-size: clamp(0.5rem, 1.5vw, 0.625rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #71717a;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      transition: color 0.2s;
      white-space: nowrap;
    }

    .view-all-button:hover {
      color: white;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: clamp(0.5rem, 2vw, 1rem);
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: clamp(0.5rem, 2vw, 1rem);
      padding: clamp(1rem, 2.5vw, 1.5rem);
      border-radius: clamp(1rem, 3vw, 1.5rem);
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.01);
      transition: all 0.3s;
    }

    .activity-item:hover {
      background: rgba(255, 255, 255, 0.03);
      transform: translateX(5px);
    }

    .activity-icon {
      width: clamp(2rem, 6vw, 3rem);
      height: clamp(2rem, 6vw, 3rem);
      border-radius: clamp(0.75rem, 2vw, 1rem);
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 229, 255, 0.1);
      color: #00E5FF;
      flex-shrink: 0;
    }

    .activity-content {
      flex: 1;
      min-width: 0;
    }

    .activity-action {
      font-weight: 600;
      margin-bottom: clamp(0.125rem, 0.5vw, 0.25rem);
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      word-break: break-word;
    }

    .activity-time {
      font-size: clamp(0.625rem, 1.5vw, 0.75rem);
      color: #71717a;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .activity-meta {
      padding: clamp(0.25rem, 1vw, 0.5rem) clamp(0.5rem, 2vw, 1rem);
      border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
      font-size: clamp(0.625rem, 1.5vw, 0.75rem);
      font-weight: 700;
      white-space: nowrap;
      flex-shrink: 0;
    }

    /* Challenges Section - Responsive */
    .challenges-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: clamp(0.5rem, 2vw, 1rem);
    }

    @media (min-width: 768px) {
      .challenges-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .challenge-card {
      padding: clamp(1rem, 3vw, 2rem);
      border-radius: clamp(1rem, 4vw, 2rem);
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.01);
      transition: all 0.3s;
      cursor: pointer;
    }

    .challenge-card:hover {
      background: rgba(255, 255, 255, 0.03);
      transform: translateY(-5px);
    }

    .challenge-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: clamp(0.5rem, 2vw, 1rem);
      flex-wrap: wrap;
      gap: clamp(0.25rem, 1vw, 0.5rem);
    }

    .challenge-type {
      font-size: clamp(0.5rem, 1.5vw, 0.625rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: clamp(0.125rem, 0.5vw, 0.25rem) clamp(0.5rem, 1.5vw, 0.75rem);
      border-radius: 9999px;
      white-space: nowrap;
    }

    .type-mindset {
      background: rgba(139, 92, 246, 0.1);
      color: #8b5cf6;
    }

    .type-business {
      background: rgba(34, 197, 94, 0.1);
      color: #22c55e;
    }

    .type-emotional {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .type-mindfulness {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .type-exploration {
      background: rgba(245, 158, 11, 0.1);
      color: #f59e0b;
    }

    .type-discipline {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }

    .type-community {
      background: rgba(168, 85, 247, 0.1);
      color: #a855f7;
    }

    .type-resilience {
      background: rgba(6, 182, 212, 0.1);
      color: #06b6d4;
    }

    .type-learning {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    .type-detox {
      background: rgba(249, 115, 22, 0.1);
      color: #f97316;
    }

    .type-endurance {
      background: rgba(244, 63, 94, 0.1);
      color: #f43f5e;
    }

    .challenge-title {
      font-size: clamp(1rem, 3vw, 1.25rem);
      font-weight: 900;
      margin-bottom: clamp(0.5rem, 2vw, 1rem);
      line-height: 1.2;
      word-break: break-word;
    }

    .challenge-description {
      color: #71717a;
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      line-height: 1.5;
      margin-bottom: clamp(1rem, 3vw, 1.5rem);
      word-break: break-word;
    }

    .challenge-rules {
      display: flex;
      flex-direction: column;
      gap: clamp(0.25rem, 1vw, 0.5rem);
      margin-bottom: clamp(1rem, 3vw, 1.5rem);
    }

    .rule-item {
      display: flex;
      align-items: flex-start;
      gap: clamp(0.25rem, 1vw, 0.5rem);
      font-size: clamp(0.625rem, 1.5vw, 0.75rem);
      color: #a1a1aa;
      line-height: 1.4;
    }

    .rule-icon {
      color: #00E5FF;
      flex-shrink: 0;
      margin-top: 0.125rem;
    }

    .challenge-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: clamp(0.5rem, 2vw, 1rem);
    }

    .challenge-duration {
      font-size: clamp(0.625rem, 1.5vw, 0.75rem);
      color: #71717a;
      white-space: nowrap;
    }

    /* Create Challenge Modal - Responsive */
    .create-challenge-modal {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(0.5rem, 3vw, 1.5rem);
    }

    .create-challenge-content {
      width: 100%;
      max-width: min(800px, 95vw);
      max-height: min(90vh, 90svh);
      overflow-y: auto;
      padding: clamp(1.5rem, 5vw, 3rem);
      border-radius: clamp(1.5rem, 6vw, 3rem);
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(15, 23, 42, 0.95);
      position: relative;
    }

    .modal-header {
      text-align: center;
      margin-bottom: clamp(1.5rem, 5vw, 3rem);
    }

    .modal-title {
      font-size: clamp(1.5rem, 5vw, 2rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.025em;
      margin-bottom: clamp(0.25rem, 1vw, 0.5rem);
      background: linear-gradient(135deg, #00E5FF, #7F00FF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.2;
    }

    .modal-subtitle {
      color: #71717a;
      font-size: clamp(0.875rem, 2.5vw, 1rem);
    }

    .form-group {
      margin-bottom: clamp(1rem, 3vw, 2rem);
    }

    .form-label {
      display: block;
      font-size: clamp(0.625rem, 1.5vw, 0.75rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #71717a;
      margin-bottom: clamp(0.5rem, 1.5vw, 0.75rem);
    }

    .form-input {
      width: 100%;
      padding: clamp(0.75rem, 2vw, 1rem);
      border-radius: clamp(0.75rem, 2vw, 1rem);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      transition: all 0.2s;
      min-height: clamp(44px, 10vw, 48px);
    }

    .form-input:focus {
      outline: none;
      border-color: #00E5FF;
      background: rgba(0, 229, 255, 0.05);
    }

    .form-select {
      width: 100%;
      padding: clamp(0.75rem, 2vw, 1rem);
      border-radius: clamp(0.75rem, 2vw, 1rem);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      transition: all 0.2s;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right clamp(0.75rem, 2vw, 1rem) center;
      background-size: clamp(0.75rem, 2vw, 1rem);
      min-height: clamp(44px, 10vw, 48px);
    }

    .form-select:focus {
      outline: none;
      border-color: #00E5FF;
      background: rgba(0, 229, 255, 0.05);
    }

    .form-textarea {
      width: 100%;
      padding: clamp(0.75rem, 2vw, 1rem);
      border-radius: clamp(0.75rem, 2vw, 1rem);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      transition: all 0.2s;
      resize: vertical;
      min-height: clamp(80px, 20vw, 100px);
    }

    .form-textarea:focus {
      outline: none;
      border-color: #00E5FF;
      background: rgba(0, 229, 255, 0.05);
    }

    .rule-input-group {
      display: flex;
      gap: clamp(0.25rem, 1vw, 0.5rem);
      margin-bottom: clamp(0.25rem, 1vw, 0.5rem);
    }

    .add-rule-button {
      padding: clamp(0.375rem, 1.5vw, 0.5rem) clamp(0.75rem, 2vw, 1rem);
      border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      background: rgba(0, 229, 255, 0.1);
      border: 1px solid rgba(0, 229, 255, 0.2);
      color: #00E5FF;
      font-size: clamp(0.625rem, 1.5vw, 0.75rem);
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .add-rule-button:hover {
      background: rgba(0, 229, 255, 0.2);
    }

    .form-actions {
      display: flex;
      gap: clamp(0.5rem, 2vw, 1rem);
      margin-top: clamp(1rem, 3vw, 2rem);
      flex-direction: column;
    }

    @media (min-width: 480px) {
      .form-actions {
        flex-direction: row;
      }
    }

    /* Sidebar */
    .profile-sidebar {
      display: flex;
      flex-direction: column;
      gap: clamp(1rem, 3vw, 2rem);
    }

    /* Quick Actions - Responsive */
    .quick-actions-section {
      padding: clamp(1.5rem, 4vw, 2.5rem);
      border-radius: clamp(1.5rem, 6vw, 3rem);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: clamp(0.5rem, 2vw, 1rem);
    }

    .quick-action-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: clamp(0.5rem, 2vw, 1rem);
      padding: clamp(1rem, 2.5vw, 1.5rem);
      border-radius: clamp(1rem, 3vw, 1.5rem);
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.01);
      cursor: pointer;
      transition: all 0.3s;
      min-height: clamp(100px, 20vw, 120px);
    }

    .quick-action-button:hover {
      background: rgba(255, 255, 255, 0.03);
      transform: scale(1.05);
      border-color: rgba(0, 229, 255, 0.2);
    }

    .quick-action-icon {
      width: clamp(2rem, 6vw, 3rem);
      height: clamp(2rem, 6vw, 3rem);
      border-radius: clamp(0.75rem, 2vw, 1rem);
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 229, 255, 0.1);
      color: #00E5FF;
    }

    .quick-action-label {
      font-size: clamp(0.5rem, 1.5vw, 0.625rem);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      text-align: center;
      color: #71717a;
    }

    /* Achievements - Responsive */
    .achievements-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: clamp(0.5rem, 2vw, 1rem);
    }

    .achievement-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: clamp(1rem, 2.5vw, 1.5rem);
      border-radius: clamp(1rem, 3vw, 1.5rem);
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.01);
      cursor: pointer;
      transition: all 0.3s;
      min-height: clamp(120px, 25vw, 140px);
    }

    .achievement-card:hover {
      background: rgba(251, 191, 36, 0.05);
      transform: scale(1.05);
      border-color: rgba(251, 191, 36, 0.2);
    }

    .achievement-icon {
      font-size: clamp(1.5rem, 4vw, 2rem);
      margin-bottom: clamp(0.5rem, 2vw, 1rem);
    }

    .achievement-name {
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      font-weight: 700;
      margin-bottom: clamp(0.125rem, 0.5vw, 0.25rem);
    }

    .achievement-earned {
      font-size: clamp(0.5rem, 1.5vw, 0.625rem);
      color: #71717a;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: clamp(0.25rem, 1vw, 0.5rem);
    }

    .achievement-description {
      font-size: clamp(0.625rem, 1.5vw, 0.75rem);
      color: #a1a1aa;
    }

    /* Performance Insights - Responsive */
    .performance-section {
      padding: clamp(1.5rem, 4vw, 2.5rem);
      border-radius: clamp(1.5rem, 6vw, 3rem);
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: linear-gradient(135deg, rgba(127, 0, 255, 0.1), transparent);
    }

    /* Social Stats - Responsive */
    .social-stats-list {
      display: flex;
      flex-direction: column;
      gap: clamp(0.5rem, 2vw, 1rem);
    }

    .social-stat-item {
      display: flex;
      align-items: center;
      gap: clamp(0.5rem, 2vw, 1rem);
      padding: clamp(1rem, 2.5vw, 1.5rem);
      border-radius: clamp(1rem, 3vw, 1.5rem);
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.01);
    }

    .social-stat-icon {
      width: clamp(2rem, 6vw, 3rem);
      height: clamp(2rem, 6vw, 3rem);
      border-radius: clamp(0.75rem, 2vw, 1rem);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .social-stat-content {
      flex: 1;
      min-width: 0;
    }

    .social-stat-platform {
      font-weight: 600;
      margin-bottom: clamp(0.125rem, 0.5vw, 0.25rem);
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      word-break: break-word;
    }

    .social-stat-metrics {
      display: flex;
      gap: clamp(0.5rem, 2vw, 1rem);
      font-size: clamp(0.625rem, 1.5vw, 0.75rem);
      color: #71717a;
      flex-wrap: wrap;
    }

    /* Modal - Responsive */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(0.5rem, 3vw, 1.5rem);
    }

    .modal-content {
      width: 100%;
      max-width: min(600px, 95vw);
      max-height: min(90vh, 90svh);
      overflow-y: auto;
      padding: clamp(1.5rem, 5vw, 3rem);
      border-radius: clamp(1.5rem, 6vw, 3rem);
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(15, 23, 42, 0.95);
      position: relative;
    }

    .modal-close {
      position: absolute;
      top: clamp(1rem, 3vw, 2rem);
      right: clamp(1rem, 3vw, 2rem);
      width: clamp(2rem, 5vw, 2.5rem);
      height: clamp(2rem, 5vw, 2.5rem);
      border-radius: clamp(0.5rem, 1.5vw, 0.75rem);
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      z-index: 101;
    }

    .modal-close:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.3);
    }

    /* Loading Skeleton */
    .loading-skeleton {
      background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 1rem;
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem);
      color: #71717a;
    }

    .empty-icon {
      font-size: clamp(2rem, 8vw, 3rem);
      margin-bottom: clamp(1rem, 3vw, 1.5rem);
      opacity: 0.5;
    }

    .empty-title {
      font-size: clamp(1rem, 4vw, 1.25rem);
      font-weight: 700;
      margin-bottom: clamp(0.25rem, 1vw, 0.5rem);
      color: white;
    }

    .empty-description {
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      max-width: 300px;
      margin: 0 auto clamp(1rem, 3vw, 1.5rem);
      line-height: 1.5;
    }

    /* Share Modal Grid - Responsive */
    .modal-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: clamp(0.5rem, 2vw, 1rem);
      margin-bottom: clamp(1rem, 3vw, 2rem);
    }

    @media (min-width: 480px) {
      .modal-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .modal-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: clamp(0.5rem, 2vw, 1rem);
      padding: clamp(1rem, 2.5vw, 1.5rem);
      border-radius: clamp(1rem, 3vw, 1.5rem);
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: white;
      cursor: pointer;
      transition: all 0.3s;
      min-height: clamp(100px, 20vw, 120px);
    }

    .modal-button:hover {
      transform: scale(1.05);
      background: rgba(255, 255, 255, 0.1);
    }

    /* Achievement Toast - Responsive */
    .achievement-toast {
      position: fixed;
      bottom: clamp(1rem, 5vw, 2rem);
      right: clamp(1rem, 5vw, 2rem);
      z-index: 50;
      padding: clamp(1rem, 3vw, 1.5rem);
      border-radius: clamp(1rem, 3vw, 1.5rem);
      border: 1px solid rgba(255, 215, 0, 0.2);
      background: rgba(255, 215, 0, 0.1);
      backdrop-filter: blur(10px);
      max-width: min(400px, 90vw);
    }

    /* Touch Optimization */
    @media (hover: none) and (pointer: coarse) {
      .profile-nav-button,
      .profile-button,
      .profile-tab,
      .quick-action-button,
      .modal-button,
      .challenge-card,
      .activity-item,
      .achievement-card,
      .social-stat-item,
      .stat-card {
        min-height: 44px;
        touch-action: manipulation;
      }

      .form-input,
      .form-select,
      .form-textarea {
        min-height: 44px;
        font-size: 16px;
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .profile-floating-element,
      .profile-nav-button:hover,
      .profile-button:hover,
      .profile-tab:hover,
      .stat-card:hover,
      .activity-item:hover,
      .challenge-card:hover,
      .quick-action-button:hover,
      .achievement-card:hover,
      .modal-button:hover {
        animation: none !important;
        transition: none !important;
        transform: none !important;
      }
    }

    /* High Contrast Mode */
    @media (prefers-contrast: high) {
      .glass {
        backdrop-filter: none;
        background: rgba(0, 0, 0, 0.95);
        border: 2px solid rgba(255, 255, 255, 0.8);
      }

      .form-input,
      .form-select,
      .form-textarea {
        border: 2px solid rgba(255, 255, 255, 0.6);
        background: rgba(0, 0, 0, 0.9);
      }
    }

    /* Landscape mobile optimization */
    @media (max-height: 600px) and (orientation: landscape) {
      .profile-header {
        padding-top: 5rem;
        padding-bottom: 1.5rem;
      }

      .profile-hero {
        padding: 1.5rem;
        min-height: auto;
      }

      .profile-avatar-large {
        width: 80px;
        height: 80px;
      }

      .profile-bio {
        font-size: 0.875rem;
        margin-bottom: 1rem;
      }

      .stats-grid {
        grid-template-columns: repeat(3, 1fr);
      }

      .stat-card {
        padding: 1rem;
        min-height: 120px;
      }
    }

    /* Extra small devices */
    @media (max-width: 320px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .quick-actions-grid {
        grid-template-columns: 1fr;
      }

      .achievements-grid {
        grid-template-columns: 1fr;
      }

      .profile-tab {
        padding: 0.5rem 0.75rem;
        font-size: 0.5rem;
      }

      .modal-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Large desktop */
    @media (min-width: 1920px) {
      .profile-grid {
        max-width: 1600px;
      }

      .profile-hero {
        padding: 4rem;
      }

      .profile-avatar-large {
        width: 200px;
        height: 200px;
      }

      .stats-grid {
        gap: 1.5rem;
      }

      .stat-card {
        padding: 2.5rem;
        min-height: 220px;
      }
    }

    /* Fix for iOS Safari */
    @supports (-webkit-touch-callout: none) {
      .modal-overlay,
      .create-challenge-modal {
        -webkit-overflow-scrolling: touch;
      }

      .modal-content,
      .create-challenge-content {
        -webkit-transform: translateZ(0);
      }
    }

    /* Fix for Firefox scrollbar */
    .create-challenge-content,
    .modal-content {
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
    }

    .create-challenge-content::-webkit-scrollbar,
    .modal-content::-webkit-scrollbar {
      width: 8px;
    }

    .create-challenge-content::-webkit-scrollbar-track,
    .modal-content::-webkit-scrollbar-track {
      background: transparent;
    }

    .create-challenge-content::-webkit-scrollbar-thumb,
    .modal-content::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }

    /* Ensure content doesn't overflow on very small screens */
    @media (max-width: 280px) {
      .profile-nav-container {
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.5rem;
      }

      .user-profile-header {
        order: 3;
        width: 100%;
        justify-content: center;
      }

      .profile-welcome {
        font-size: 1.5rem;
      }

      .profile-subtitle {
        font-size: 0.75rem;
      }
    }

    /* Custom styles for challenge categories */
    .flex {
      display: flex;
    }

    .items-center {
      align-items: center;
    }

    .gap-4 {
      gap: 1rem;
    }

    .gap-2 {
      gap: 0.5rem;
    }

    .w-2 {
      width: 0.5rem;
    }

    .h-2 {
      height: 0.5rem;
    }

    .rounded-full {
      border-radius: 9999px;
    }

    .bg-green-500 {
      background-color: #22c55e;
    }
  `;

  // Navigation function
  const navigateTo = (page) => {
    if (onNavigate && typeof onNavigate === 'function') {
      onNavigate(page);
    } else {
      switch(page) {
        case 'dashboard':
          window.location.href = '/dashboard';
          break;
        case 'verify':
          window.location.href = '/verify';
          break;
        case 'leaderboard':
          window.location.href = '/leaderboard';
          break;
        case 'challenges':
          window.location.href = '/challenges';
          break;
        case 'chat':
          window.location.href = '/chat';
          break;
        case 'settings':
          window.location.href = '/settings';
          break;
        case 'auth':
          window.location.href = '/auth';
          break;
        case 'verification-wall':
          window.location.href = '/verification-wall';
          break;
        default:
      }
    }
  };

  // Load user data
  const loadUserData = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('touchgrass_user');
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user;
      }
      
      if (user) {
        const newUser = {
          id: user.id || Date.now().toString(),
          username: user.email?.split('@')[0] || 'user',
          displayName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email || 'user@example.com',
          avatar: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || 'user'}`,
          location: { city: 'Online', country: 'Internet' },
          bio: 'Building daily discipline through outdoor accountability.',
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString()
        };
        
        localStorage.setItem('touchgrass_user', JSON.stringify(newUser));
        return newUser;
      }
      
      return null;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  }, [user]);

  // Load streak data
  const loadStreakData = useCallback((username) => {
    try {
      const streakKey = `touchgrass_streak_${username}`;
      const storedStreak = localStorage.getItem(streakKey);
      
      if (storedStreak) {
        return JSON.parse(storedStreak);
      }
      
      const newStreak = {
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        totalOutdoorTime: 0,
        shameDays: 0,
        challengeWins: 0,
        history: [],
        startDate: new Date().toISOString(),
        todayVerified: false,
        shareCount: 0,
        viralScore: 0,
        lastVerification: null
      };
      
      localStorage.setItem(streakKey, JSON.stringify(newStreak));
      return newStreak;
    } catch (error) {
      console.error('Error loading streak data:', error);
      return null;
    }
  }, []);

  // Load challenges from backend
  const loadChallenges = useCallback(async () => {
    if (!user?.email) return;

    setChallengesLoading(true);
    
    try {
      // Load available challenges
      const availableData = await challengeService.getAvailableChallenges();
      if (availableData && availableData.length > 0) {
        setAvailableChallenges(availableData);
        // Save to localStorage for offline use
        challengeService.saveAvailableChallengesToLocal(availableData);
      }
      
      // Load user's active challenges
      const userChallengesData = await challengeService.getUserChallenges();
      
      if (userChallengesData.success && userChallengesData.challenges) {
        setActiveUserChallenges(userChallengesData.challenges);
      } else if (userChallengesData.challenges) {
        setActiveUserChallenges(userChallengesData.challenges);
      }
      
      setChallengesLoading(false);
    } catch (error) {
      console.error('Error loading challenges:', error);
      
      // Fallback to localStorage
      const localChallenges = challengeService.getLocalChallenges();
      setActiveUserChallenges(localChallenges);
      
      // Load available challenges from localStorage
      const storedAvailable = localStorage.getItem('available_challenges');
      if (storedAvailable) {
        try {
          setAvailableChallenges(JSON.parse(storedAvailable));
        } catch (e) {
          console.error('Error parsing stored challenges:', e);
        }
      }
      
      setChallengesLoading(false);
      toast.error('Failed to load challenges. Using local data.');
    }
  }, [user]);

  // Initialize profile
  const initializeProfile = useCallback(() => {
    setIsLoading(true);

    try {
      // Get user data
      const loadedUserData = loadUserData();
      if (loadedUserData) {
        setUserData(loadedUserData);
        
        setProfileEdit({
          displayName: '',
          bio: '',
          city: '',
          country: ''
        });
      }

      // Set stats from streak data (use same key as Dashboard)
      const streakData = loadStreakData(loadedUserData?.username || 'default');
      setStats([
        {
          id: 'current-streak',
          value: streakData?.currentStreak || 0,
          icon: '🔥',
          title: 'Current Streak',
          description: 'Days in a row',
          change: streakData?.currentStreak > 0 ? 'Active' : 'Start Now',
          label: 'Current Streak'
        },
        {
          id: 'longest-streak',
          value: streakData?.longestStreak || 0,
          icon: '🏆',
          title: 'Longest Streak',
          description: 'Best streak ever',
          change: 'Personal Best',
          label: 'Longest Streak'
        },
        {
          id: 'total-days',
          value: streakData?.totalDays || 0,
          icon: '📅',
          title: 'Total Days',
          description: 'Total outdoor days',
          change: 'Lifetime Total',
          label: 'Total Days'
        },
        {
          id: 'outdoor-time',
          value: `${streakData?.totalOutdoorTime || 0}h`,
          icon: '🌳',
          title: 'Outdoor Time',
          description: 'Hours spent outdoors',
          change: 'Total Hours',
          label: 'Outdoor Time'
        }
      ]);

          // Set activities conditionally based on streak data
          const recentActivities = [];

          // Only show verification activity if user verified today
          if (streakData?.todayVerified) {
            recentActivities.push({
              id: 1,
              action: "✅ Completed daily verification",
              time: 'Today',
              icon: <CheckCircle2 size={20} />,
              meta: '+10 XP'
            });
          }

          // Only show milestone activity if user has 7+ day streak
          if (streakData?.currentStreak >= 7) {
            recentActivities.push({
              id: 2,
              action: "🔥 Reached 7-day streak milestone",
              time: 'Recently',
              icon: <Trophy size={20} />,
              meta: 'Milestone'
            });
          }

          // Only show social share activity if user has shared on social media
          if (streakData?.shareCount > 0) {
            recentActivities.push({
              id: 3,
              action: "📱 Shared progress on social media",
              time: 'Recently',
              icon: <Share2 size={20} />,
              meta: 'Shared'
            });
          }

          setActivities(recentActivities);

      // Set social stats
      setSocialStats([
        {
          id: 1,
          platform: "Twitter",
          icon: <Twitter size={20} />,
          color: "rgba(29, 161, 242, 0.2)",
          metrics: `${Math.min((streakData?.shareCount || 0), 24)} Shares • 1.2K Views`
        },
        {
          id: 2,
          platform: "LinkedIn",
          icon: <Linkedin size={20} />,
          color: "rgba(0, 119, 181, 0.2)",
          metrics: `${Math.min((streakData?.shareCount || 0), 18)} Shares • 420 Views`
        },
        {
          id: 3,
          platform: "Instagram",
          icon: <Instagram size={20} />,
          color: "rgba(225, 48, 108, 0.2)",
          metrics: `${Math.min((streakData?.shareCount || 0), 12)} Shares • 780 Likes`
        }
      ]);

      // Set achievements
      const userAchievements = [];

      // Streak-based achievements
      if (streakData?.currentStreak >= 7) {
        userAchievements.push({
          id: 1,
          name: "Weekly Warrior",
          icon: "🔥",
          earned: "Today",
          description: "7 consecutive days"
        });
      }

      if (streakData?.totalDays >= 30) {
        userAchievements.push({
          id: 2,
          name: "Monthly Master",
          icon: "🌟",
          earned: "This month",
          description: "30-day streak"
        });
      }

      if (streakData?.longestStreak >= 100) {
        userAchievements.push({
          id: 3,
          name: "Century Champion",
          icon: "💯",
          earned: "Recently",
          description: "100-day streak"
        });
      }

      // Social sharing achievements
      if ((streakData?.shareCount || 0) >= 1) {
        userAchievements.push({
          id: 4,
          name: "First Share",
          icon: "📱",
          earned: "Recently",
          description: "Shared your progress"
        });
      }

      if ((streakData?.shareCount || 0) >= 10) {
        userAchievements.push({
          id: 5,
          name: "Social Butterfly",
          icon: "🦋",
          earned: "Recently",
          description: "10+ shares"
        });
      }

      // Challenge achievements
      if ((streakData?.challengeWins || 0) >= 1) {
        userAchievements.push({
          id: 6,
          name: "Challenge Champion",
          icon: "🏆",
          earned: "Recently",
          description: "Completed first challenge"
        });
      }

      if ((streakData?.challengeWins || 0) >= 5) {
        userAchievements.push({
          id: 7,
          name: "Challenge Master",
          icon: "🎯",
          earned: "Recently",
          description: "5 challenges completed"
        });
      }

      // Verification achievements
      if (streakData?.totalDays >= 1) {
        userAchievements.push({
          id: 8,
          name: "Getting Started",
          icon: "🌱",
          earned: "Recently",
          description: "First verification"
        });
      }

      if (streakData?.totalDays >= 50) {
        userAchievements.push({
          id: 9,
          name: "Dedicated",
          icon: "💪",
          earned: "Recently",
          description: "50 verifications"
        });
      }

      // Time-based achievements
      if (streakData?.totalOutdoorTime >= 100) {
        userAchievements.push({
          id: 10,
          name: "Nature Lover",
          icon: "🌳",
          earned: "Recently",
          description: "100+ hours outdoors"
        });
      }

      // Profile completion achievements
      if (userData?.bio && userData.bio.length > 10) {
        userAchievements.push({
          id: 11,
          name: "Storyteller",
          icon: "📝",
          earned: "Recently",
          description: "Completed profile bio"
        });
      }

      // Consistency achievements
      const verificationRate = streakData?.totalDays > 0 ?
        Math.round(((streakData.history?.filter(h => h.verified).length || 0) / streakData.totalDays) * 100) : 0;

      if (verificationRate >= 80) {
        userAchievements.push({
          id: 12,
          name: "Consistency King",
          icon: "👑",
          earned: "Recently",
          description: "80%+ verification rate"
        });
      }

      // Shame achievements (for fun)
      if ((streakData?.shameDays || 0) >= 1) {
        userAchievements.push({
          id: 13,
          name: "Shame Survivor",
          icon: "😈",
          earned: "Recently",
          description: "Used shame verification"
        });
      }

      // Special achievements
      if (streakData?.currentStreak >= 30) {
        userAchievements.push({
          id: 14,
          name: "Unstoppable",
          icon: "🚀",
          earned: "Recently",
          description: "30-day current streak"
        });
      }

      if (streakData?.totalDays >= 365) {
        userAchievements.push({
          id: 15,
          name: "Year of Discipline",
          icon: "📅",
          earned: "Recently",
          description: "365 days of discipline"
        });
      }

      setAchievements(userAchievements);

    } catch (error) {
      console.error('Profile initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [loadUserData, loadStreakData]);

  // Handle join challenge
  const handleJoinChallenge = async (challenge) => {
    if (!user?.email) {
      toast.error('Please login to join challenges');
      return;
    }

    setChallengesLoading(true);

    try {
      // Join challenge through service
      const result = await challengeService.joinChallenge(challenge.id);
      
      if (result.success) {
        // Create joined challenge object
        const joinedChallenge = {
          id: challenge.id,
          name: challenge.name,
          description: challenge.description,
          type: challenge.type,
          category: challenge.category,
          duration: challenge.duration,
          rules: challenge.rules,
          difficulty: challenge.difficulty,
          icon: challenge.icon,
          participants: (challenge.participants || 0) + 1,
          joinedAt: new Date().toISOString(),
          progress: 0,
          status: 'active',
          dailyProgress: {},
          completedDays: 0,
          lastUpdated: new Date().toISOString()
        };

        // Update state
        setActiveUserChallenges(prev => {
          const exists = prev.some(c => c.id === challenge.id);
          if (!exists) {
            return [...prev, joinedChallenge];
          }
          return prev;
        });

        // Update available challenges to show as joined
        setAvailableChallenges(prev =>
          prev.map(c => {
            if (c.id === challenge.id) {
              return { ...c, isJoined: true };
            }
            return c;
          })
        );

        toast.success(`Successfully joined "${challenge.name}"!`);

        // Show achievement if first challenge
        if (activeUserChallenges.length === 0) {
          setShowAchievement(true);
          setTimeout(() => setShowAchievement(false), 3000);
        }
      } else {
        toast.error(result.message || 'Failed to join challenge');
      }
    } catch (error) {
      console.error('Error joining challenge:', error);
      toast.error('Failed to join challenge. Please try again.');
    } finally {
      setChallengesLoading(false);
    }
  };

  // Mark challenge as completed for today
  const markChallengeCompleted = async (challengeId) => {
    if (!userData?.email) {
      toast.error('Please login to update progress');
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    // Find the challenge
    const challengeIndex = activeUserChallenges.findIndex(c => c.id === challengeId);
    if (challengeIndex === -1) {
      toast.error('Challenge not found');
      return;
    }

    const challenge = activeUserChallenges[challengeIndex];

    // Check if already completed today
    if (challenge?.dailyProgress?.[today]?.completed) {
      toast.info('Already completed today!');
      return;
    }

    try {
      const progressData = {
        date: today,
        completed: true,
        verified: true,
        notes: 'Completed daily challenge',
        timestamp: new Date().toISOString()
      };

      // Update the challenge in state first
      const updatedChallenge = { ...challenge };
      if (!updatedChallenge.dailyProgress) {
        updatedChallenge.dailyProgress = {};
      }
      updatedChallenge.dailyProgress[today] = progressData;

      const daysCompleted = Object.keys(updatedChallenge.dailyProgress)
        .filter(date => updatedChallenge.dailyProgress[date].completed).length;

      const duration = challenge.duration || 7;
      const progress = Math.min(100, (daysCompleted / duration) * 100);

      updatedChallenge.completedDays = daysCompleted;
      updatedChallenge.progress = progress;
      updatedChallenge.lastUpdated = new Date().toISOString();

      if (progressData.completed) {
        updatedChallenge.streak = (updatedChallenge.streak || 0) + 1;
        updatedChallenge.totalDays = (updatedChallenge.totalDays || 0) + 1;
        updatedChallenge.xpEarned = (updatedChallenge.xpEarned || 0) + (updatedChallenge.xpReward || 10) / duration;
      }

      // Update state immediately
      setActiveUserChallenges(prev =>
        prev.map(c => c.id === challengeId ? updatedChallenge : c)
      );

      // Then call the service
      const result = await challengeService.updateProgress(challengeId, progressData);

      if (result.success) {
        toast.success('Daily progress updated!');
      } else {
        // Revert the state update if service failed
        setActiveUserChallenges(prev =>
          prev.map(c => {
            if (c.id === challengeId) {
              const revertedChallenge = { ...c };
              if (revertedChallenge.dailyProgress?.[today]) {
                delete revertedChallenge.dailyProgress[today];
                const daysCompleted = Object.keys(revertedChallenge.dailyProgress)
                  .filter(date => revertedChallenge.dailyProgress[date].completed).length;
                const progress = Math.min(100, (daysCompleted / duration) * 100);
                revertedChallenge.completedDays = daysCompleted;
                revertedChallenge.progress = progress;
                revertedChallenge.streak = (revertedChallenge.streak || 0) - 1;
                revertedChallenge.totalDays = (revertedChallenge.totalDays || 0) - 1;
                revertedChallenge.xpEarned = (revertedChallenge.xpEarned || 0) - (revertedChallenge.xpReward || 10) / duration;
              }
              return revertedChallenge;
            }
            return c;
          })
        );
        toast.error(result.message || 'Failed to update progress');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress. Please try again.');
    }
  };

  // Handle create challenge
  const handleCreateChallenge = async () => {
    if (!userData) {
      toast.error('Please login to create a challenge');
      return;
    }

    if (!newChallenge.name.trim() || !newChallenge.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const challengeData = {
        name: newChallenge.name,
        type: newChallenge.type,
        description: newChallenge.description,
        duration: newChallenge.duration,
        rules: newChallenge.rules.filter(rule => rule.trim()),
        difficulty: newChallenge.difficulty
      };

      // Create challenge through service
      const result = await challengeService.createChallenge(challengeData);

      if (result.success) {
        // Add to active challenges state
        setActiveUserChallenges(prev => [...prev, result.challenge]);

        // Reset form
        setNewChallenge({
          name: '',
          description: '',
          duration: 7,
          type: 'mindset',
          difficulty: 'medium',
          rules: ['']
        });

        setShowCreateChallenge(false);
        toast.success('Challenge created successfully!');
      } else {
        toast.error(result.message || 'Failed to create challenge');
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
      toast.error('Failed to create challenge. Please try again.');
    }
  };

  // Handle share profile
  const handleShareProfile = (platform) => {
    if (!userData) {
      toast.error('Please login to share');
      return;
    }
    
    const streakData = loadStreakData(userData.username);
    const shareUrl = `${window.location.origin}/profile`;
    
    const shareTexts = {
      twitter: `👤 ${userData.displayName}'s TouchGrass Profile - ${streakData.currentStreak}-day streak! Check out my progress: ${shareUrl} #TouchGrass #Streak #Profile`,
      linkedin: `${userData.displayName}'s TouchGrass Profile - Building discipline through daily outdoor verification. ${streakData.currentStreak}-day streak and counting! ${shareUrl}`,
      facebook: `Check out my TouchGrass profile! ${streakData.currentStreak}-day streak of outdoor discipline. ${shareUrl}`,
      instagram: `👤 My TouchGrass Profile 📊\n${streakData.currentStreak}-day streak\nJoin me in building real-world discipline!\n${shareUrl}\n#TouchGrass #Discipline #Streak`
    };

    const shareConfigs = {
      twitter: {
        url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTexts.twitter)}&url=${encodeURIComponent(shareUrl)}`,
        name: 'Twitter'
      },
      linkedin: {
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        name: 'LinkedIn'
      },
      facebook: {
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTexts.facebook)}`,
        name: 'Facebook'
      }
    };

    const config = shareConfigs[platform];
    if (!config) {
      if (platform === 'instagram') {
        toast('📸 For Instagram: Take a screenshot of your profile and share it as a story!', {
          icon: '📸',
          duration: 4000
        });
        return;
      } else if (platform === 'copy') {
        navigator.clipboard.writeText(shareUrl);
        toast.success('Profile link copied to clipboard!');
        return;
      }
      return;
    }

    window.open(config.url, '_blank', 'width=600,height=400');
    toast.success(`Shared to ${config.name}!`);
  };

  // Update user profile
  const updateUserProfile = (updatedData) => {
    try {
      const storedUser = localStorage.getItem('touchgrass_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const updatedUser = {
          ...user,
          ...updatedData,
          lastActive: new Date().toISOString()
        };
        
        localStorage.setItem('touchgrass_user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
        
        toast.success('Profile updated successfully!');
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Failed to update profile');
      return false;
    }
  };

  // Save profile edits
  const saveProfileEdits = () => {
    if (!userData) return;
    
    const updatedData = {
      displayName: profileEdit.displayName || userData.displayName,
      bio: profileEdit.bio || userData.bio,
      location: {
        city: profileEdit.city || userData.location?.city || 'Online',
        country: profileEdit.country || userData.location?.country || 'Internet'
      }
    };
    
    if (updateUserProfile(updatedData)) {
      setProfileEdit({
        displayName: '',
        bio: '',
        city: '',
        country: ''
      });
    }
  };

  // Calculate time left
  const calculateTimeLeft = () => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const difference = endOfDay - now;
    
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Quick actions
  const quickActions = [
    {
      id: 1,
      label: "Dashboard",
      icon: <Home size={24} />,
      action: () => navigateTo('dashboard')
    },
    {
      id: 2,
      label: "Verification wall",
      icon: <Camera size={24} />,
      action: () => navigateTo('verification-wall')
    },
    {
      id: 3,
      label: "Challenges",
      icon: <TargetIcon2 size={24} />,
      action: () => navigateTo('challenges')
    },
    {
      id: 4,
      label: "Share",
      icon: <Share2 size={24} />,
      action: () => setShowSocialShareModal(true)
    }
  ];

  // Progress button component
  const ProgressButton = ({ challenge }) => {
    const today = new Date().toISOString().split('T')[0];
    const isCompletedToday = challenge.dailyProgress?.[today]?.completed;
    
    return (
      <button
        onClick={() => markChallengeCompleted(challenge.id)}
        disabled={isCompletedToday}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
          fontWeight: '700',
          background: isCompletedToday 
            ? 'rgba(34, 197, 94, 0.2)' 
            : 'linear-gradient(135deg, #00E5FF, #7F00FF)',
          color: isCompletedToday ? '#22c55e' : 'white',
          border: 'none',
          cursor: isCompletedToday ? 'not-allowed' : 'pointer',
          opacity: isCompletedToday ? 0.7 : 1,
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}
      >
        {isCompletedToday ? (
          <>
            <CheckCircle size={14} />
            Done Today
          </>
        ) : (
          <>
            <CheckSquare size={14} />
            Mark Complete
          </>
        )}
      </button>
    );
  };

  // Initialize on mount
  useEffect(() => {
    initializeProfile();
    loadChallenges();

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [initializeProfile, loadChallenges]);

  // Listen for localStorage changes to update streak data
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith('touchgrass_streak_')) {
        initializeProfile();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (isLoading && !userData) {
    return (
      <div className="profile-page">
        <style>{styles}</style>
        
        <div className="profile-bg-grid"></div>
        <div className="profile-floating-elements">
          <div className="profile-floating-element profile-float-1"></div>
          <div className="profile-floating-element profile-float-2"></div>
          <div className="profile-floating-element profile-float-3"></div>
        </div>

        <nav className="profile-nav glass">
          <div className="profile-nav-container">
            <div className="profile-nav-logo">
              <div className="profile-nav-logo-text">
                Touch<span className="profile-nav-logo-highlight">Grass</span>
              </div>
            </div>
            
            <div className="profile-nav-button loading-skeleton" style={{ width: '120px', height: '40px' }}></div>
          </div>
        </nav>

        <div className="profile-header">
          <div className="profile-header-container">
            <div className="loading-skeleton" style={{ height: '80px', width: '100%', maxWidth: '400px', marginBottom: '1.5rem', margin: '0 auto' }}></div>
            <div className="loading-skeleton" style={{ height: '30px', width: '100%', maxWidth: '600px', margin: '0 auto' }}></div>
          </div>
        </div>

        <div className="profile-grid">
          <div className="profile-main-content">
            <div className="loading-skeleton" style={{ height: '300px', borderRadius: '3rem' }}></div>
            <div className="loading-skeleton" style={{ height: '400px', borderRadius: '3rem' }}></div>
          </div>
          <div className="profile-sidebar">
            <div className="loading-skeleton" style={{ height: '300px', borderRadius: '3rem' }}></div>
            <div className="loading-skeleton" style={{ height: '300px', borderRadius: '3rem' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const streakData = userData ? loadStreakData(userData.username) : null;

  return (
    <div className="profile-page">
      <style>{styles}</style>
      
      {/* Background Effects */}
      <div className="profile-bg-grid"></div>
      <div className="profile-floating-elements">
        <div className="profile-floating-element profile-float-1"></div>
        <div className="profile-floating-element profile-float-2"></div>
        <div className="profile-floating-element profile-float-3"></div>
      </div>

      {/* Navigation */}
      <nav className="profile-nav glass">
        <div className="profile-nav-container">
          <div className="profile-nav-logo">
            <div className="profile-nav-logo-text">
              Touch<span className="profile-nav-logo-highlight">Grass</span>
            </div>
          </div>
          
          <div className="profile-nav-links">
            <button className="profile-nav-link" onClick={() => navigateTo('verify')}>
              Verify
            </button>
            <button className="profile-nav-link" onClick={() => navigateTo('challenges')}>
              Challenges
            </button>
            <button className="profile-nav-link" onClick={() => navigateTo('leaderboard')}>
              Leaderboard
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="time-counter">
              <Clock size={16} />
              <span className="time-label">Time Left</span>
              <span className="time-value">{timeLeft || '23:59:59'}</span>
            </div>
            
            {userData && (
              <div className="user-profile-header">
                <img 
                  src={userData.avatar} 
                  alt={userData.displayName}
                  className="user-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`;
                  }}
                />
                <div className="user-info">
                  <div className="user-name">{userData.displayName}</div>
                  <div className="user-status">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Online
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="profile-header">
        <div className="profile-header-container">
          <h1 className="profile-welcome text-gradient">
            {userData ? `${userData.displayName}'s Profile` : 'Your Profile'}
          </h1>
          <p className="profile-subtitle">
            {userData ? 
              `Track your progress, manage challenges, and build lasting discipline. ${
                streakData?.currentStreak > 0 
                  ? `${streakData.currentStreak}-day streak strong!`
                  : 'Start your journey today!'
              }` 
              : 'Create an account to start building discipline through daily accountability.'}
          </p>
        </div>
      </header>

      {/* Main Grid */}
      <main className="profile-grid">
        {/* Left Column - Main Content */}
        <div className="profile-main-content">
          {/* Profile Hero */}
          <section className="profile-hero glass">
            <div className="profile-visual" style={{ position: 'relative' }}>
              <img
                src={userData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.username || 'user'}`}
                alt={userData?.displayName || 'User'}
                className="profile-avatar-large"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.username || 'user'}`;
                }}
              />
              {streakData?.currentStreak > 0 && (
                <div className="streak-badge">
                  {streakData.currentStreak}
                </div>
              )}
            </div>

            <div className="profile-info">
              <h2 className="profile-name">{userData?.displayName || 'User'}</h2>
              
              <div className="profile-meta">
                <div key="username" className="meta-item">
                  <User size={16} />
                  @{userData?.username || 'username'}
                </div>
                <div key="location" className="meta-item">
                  <MapPin size={16} />
                  {userData?.location?.city || 'Online'}, {userData?.location?.country || 'Internet'}
                </div>
                <div key="joined" className="meta-item">
                  <Calendar size={16} />
                  Joined {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}
                </div>
              </div>
              
              <p className="profile-bio">
                {userData?.bio || 'No bio yet. Click edit to add your personal journey...'}
              </p>
              
              <div className="profile-actions">
                <button
                  className="profile-button button-primary"
                  onClick={() => setProfileEdit({
                    displayName: userData?.displayName || '',
                    bio: userData?.bio || '',
                    city: userData?.location?.city || '',
                    country: userData?.location?.country || ''
                  })}
                >
                  <Edit size={20} />
                  Edit Profile
                </button>

                <button
                  className="profile-button button-secondary"
                  onClick={() => setShowSocialShareModal(true)}
                >
                  <Share2 size={20} />
                  Share Profile
                </button>

                <button
                  className="profile-button button-secondary"
                  onClick={() => setShowCreateChallenge(true)}
                >
                  <Plus size={20} />
                  Create Challenge
                </button>
              </div>
            </div>
          </section>

          {/* Tabs */}
          <div className="profile-tabs">
            <button
              className={`profile-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Activity size={16} />
              Overview
            </button>
            <button
              className={`profile-tab ${activeTab === 'challenges' ? 'active' : ''}`}
              onClick={() => setActiveTab('challenges')}
            >
              <TargetIcon2 size={16} />
              Challenges
            </button>
            <button
              className={`profile-tab ${activeTab === 'achievements' ? 'active' : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              <Award size={16} />
              Achievements
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <section>
                <div className="section-header">
                  <h2 className="section-title">
                    <BarChart3 size={24} />
                    Your Stats
                  </h2>
                </div>
                
                <div className="stats-grid">
                  {stats.map(stat => (
                    <div key={stat.id} className="stat-card glass">
                      <div className="stat-header">
                        <div className="stat-icon">
                          {stat.icon}
                        </div>
                        <span className="stat-change">{stat.change}</span>
                      </div>
                      
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.title}</div>
                      <div className="stat-description">{stat.description}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Recent Activity */}
              <section className="activity-section glass">
                <div className="section-header">
                  <h2 className="section-title">
                    <Clock size={24} />
                    Recent Activity
                  </h2>
                  <button className="view-all-button">
                    View All
                  </button>
                </div>

                <div className="activity-list">
                  {activities.length > 0 ? (
                    activities.map(activity => (
                      <div key={activity.id} className="activity-item glass">
                        <div className="activity-icon">
                          {activity.icon}
                        </div>

                        <div className="activity-content">
                          <div className="activity-action">{activity.action}</div>
                          <div className="activity-time">{activity.time}</div>
                        </div>

                        <div className="activity-meta">
                          {activity.meta}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">📝</div>
                      <div className="empty-title">No Activity Yet</div>
                      <p className="empty-description">Start verifying your outdoor time to see activity here.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Quick Start Challenges */}
              <section className="activity-section glass">
                <div className="section-header">
                  <h2 className="section-title">
                    <TargetIcon2 size={24} />
                    Quick Start Challenges
                  </h2>
                  <button className="view-all-button" onClick={() => setActiveTab('challenges')}>
                    View All
                  </button>
                </div>

                {availableChallenges.length > 0 ? (
                  <div className="challenges-grid">
                    {availableChallenges.slice(0, 2).map(challenge => (
                      <div key={challenge.id} className="challenge-card glass">
                        <div className="challenge-header">
                          <span className={`challenge-type type-${challenge.category || challenge.type}`}>
                            {challenge.category || challenge.type}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#71717a' }}>
                            <Users size={12} /> {challenge.participants || 0}
                          </span>
                        </div>

                        <h3 className="challenge-title">
                          <span style={{ marginRight: '0.5rem' }}>{challenge.icon || '🎯'}</span>
                          {challenge.name}
                        </h3>
                        <p className="challenge-description">{challenge.description}</p>

                        <div className="challenge-footer">
                          <div className="challenge-duration">
                            {challenge.duration === 'daily' ? 'Daily' :
                             challenge.duration === 'weekly' ? 'Weekly' :
                             typeof challenge.duration === 'number' ? `${challenge.duration} days` :
                             challenge.duration}
                          </div>
                          <button
                            className="profile-button button-primary"
                            onClick={() => handleJoinChallenge(challenge)}
                            disabled={challengesLoading || challenge.isJoined}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                          >
                            {challengesLoading ? 'Joining...' : 
                             challenge.isJoined ? 'Joined ✓' : 'Join Challenge'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">🎯</div>
                    <div className="empty-title">No Challenges Available</div>
                    <p className="empty-description">Check back later for new challenges.</p>
                  </div>
                )}
              </section>
            </>
          )}

          {activeTab === 'challenges' && (
            <>
              {/* Active Challenges */}
              <section className="activity-section glass">
                <div className="section-header">
                  <h2 className="section-title">
                    <TargetIcon2 size={24} />
                    Your Active Challenges
                    {activeUserChallenges.length > 0 && (
                      <span style={{
                        fontSize: '0.875rem',
                        marginLeft: '0.5rem',
                        color: '#00E5FF',
                        fontWeight: 'normal'
                      }}>
                        ({activeUserChallenges.length} active)
                      </span>
                    )}
                  </h2>
                  <button
                    className="profile-button button-secondary"
                    onClick={() => setShowCreateChallenge(true)}
                    style={{ padding: '0.75rem 1.5rem' }}
                  >
                    <Plus size={16} />
                    Create New
                  </button>
                </div>

                {challengesLoading ? (
                  <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="loading-skeleton" style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      margin: '0 auto 1rem'
                    }}></div>
                    <div className="loading-skeleton" style={{
                      width: '200px',
                      height: '20px',
                      margin: '0 auto'
                    }}></div>
                  </div>
                ) : activeUserChallenges.length > 0 ? (
                  <div className="challenges-grid">
                    {activeUserChallenges.map(challenge => (
                      <div key={challenge.id} className="challenge-card glass">
                        <div className="challenge-header">
                          <span className={`challenge-type type-${challenge.category || challenge.type}`}>
                            {challenge.category || challenge.type}
                          </span>
                          <span style={{
                            fontSize: '0.75rem',
                            color: '#71717a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            <Users size={12} />
                            {challenge.participants || 0}
                          </span>
                        </div>

                        <h3 className="challenge-title">
                          <span style={{ marginRight: '0.5rem' }}>{challenge.icon || '🎯'}</span>
                          {challenge.name}
                        </h3>
                        <p className="challenge-description">{challenge.description}</p>

                        <div className="challenge-rules">
                          {challenge.rules?.slice(0, 2).map((rule, index) => (
                            <div key={index} className="rule-item">
                              <CheckCircle size={12} className="rule-icon" />
                              <span>{rule}</span>
                            </div>
                          ))}
                        </div>

                        <div className="challenge-footer">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div className="challenge-duration">
                              {challenge.duration === 'daily' ? 'Daily' :
                               challenge.duration === 'weekly' ? 'Weekly' :
                               typeof challenge.duration === 'number' ? `${challenge.duration} days` :
                               challenge.duration}
                            </div>
                            
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              fontSize: '0.75rem',
                              color: '#00E5FF'
                            }}>
                              <div style={{
                                width: '60px',
                                height: '4px',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '2px',
                                overflow: 'hidden'
                              }}>
                                <div style={{
                                  width: `${challenge.progress || 0}%`,
                                  height: '100%',
                                  background: 'linear-gradient(90deg, #00E5FF, #7F00FF)',
                                  borderRadius: '2px'
                                }}></div>
                              </div>
                              {Math.round(challenge.progress || 0)}%
                            </div>
                          </div>
                          
                          <ProgressButton challenge={challenge} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">🎯</div>
                    <div className="empty-title">No Active Challenges</div>
                    <p className="empty-description">Join challenges below to build discipline and track your progress.</p>
                  </div>
                )}
              </section>

              {/* Available Challenges */}
              <section className="activity-section glass">
                <div className="section-header">
                  <h2 className="section-title">
                    <Compass size={24} />
                    Available Challenges
                    {availableChallenges.length > 0 && (
                      <span style={{
                        fontSize: '0.875rem',
                        marginLeft: '0.5rem',
                        color: '#71717a',
                        fontWeight: 'normal'
                      }}>
                        ({availableChallenges.length} available)
                      </span>
                    )}
                  </h2>
                </div>

                {challengesLoading ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="challenge-card glass loading-skeleton" style={{ height: '300px' }}></div>
                    ))}
                  </div>
                ) : availableChallenges.length > 0 ? (
                  <div className="challenges-grid">
                    {availableChallenges.map(challenge => {
                      const isJoined = activeUserChallenges.some(c => c.id === challenge.id);
                      
                      return (
                        <div key={challenge.id} className="challenge-card glass">
                          <div className="challenge-header">
                            <span className={`challenge-type type-${challenge.category || challenge.type}`}>
                              {challenge.category || challenge.type}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.75rem', color: '#71717a' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}>
                                  <Users size={12} />
                                  {challenge.participants || 0}
                                </span>
                              </span>
                              <span style={{
                                fontSize: '0.625rem',
                                padding: '0.125rem 0.5rem',
                                borderRadius: '9999px',
                                background: challenge.difficulty === 'easy' ? 'rgba(34, 197, 94, 0.1)' :
                                           challenge.difficulty === 'medium' ? 'rgba(245, 158, 11, 0.1)' :
                                           'rgba(239, 68, 68, 0.1)',
                                color: challenge.difficulty === 'easy' ? '#22c55e' :
                                       challenge.difficulty === 'medium' ? '#f59e0b' :
                                       '#ef4444'
                              }}>
                                {challenge.difficulty}
                              </span>
                            </div>
                          </div>

                          <h3 className="challenge-title">
                            <span style={{ marginRight: '0.5rem' }}>{challenge.icon || '🎯'}</span>
                            {challenge.name}
                          </h3>
                          <p className="challenge-description">{challenge.description}</p>

                          <div className="challenge-rules">
                            {challenge.rules?.slice(0, 2).map((rule, index) => (
                              <div key={index} className="rule-item">
                                <CheckCircle size={12} className="rule-icon" />
                                <span>{rule}</span>
                              </div>
                            ))}
                          </div>

                          <div className="challenge-footer">
                            <div className="challenge-duration">
                              {challenge.duration === 'daily' ? 'Daily Challenge' :
                               challenge.duration === 'weekly' ? 'Weekly Challenge' :
                               typeof challenge.duration === 'number' ? `${challenge.duration}-Day Challenge` :
                               challenge.duration}
                            </div>
                            <button
                              className={`profile-button ${isJoined ? 'button-secondary' : 'button-primary'}`}
                              onClick={() => !isJoined && handleJoinChallenge(challenge)}
                              disabled={challengesLoading || isJoined}
                              style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.75rem',
                                opacity: isJoined ? 0.6 : 1
                              }}
                            >
                              {challengesLoading ? (
                                'Joining...'
                              ) : isJoined ? (
                                <>
                                  <CheckCircle size={14} />
                                  Joined
                                </>
                              ) : (
                                <>
                                  <Plus size={14} />
                                  Join Challenge
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <div className="empty-title">No Challenges Available</div>
                    <p className="empty-description">Check back later for new challenges or create your own!</p>
                  </div>
                )}
              </section>
            </>
          )}

          {activeTab === 'achievements' && (
            <section className="activity-section glass">
              <div className="section-header">
                <h2 className="section-title">
                  <Award size={24} />
                  Achievements
                </h2>
              </div>
              
              <div className="achievements-grid">
                {achievements.length > 0 ? (
                  achievements.map(achievement => (
                    <div
                      key={achievement.id}
                      className="achievement-card glass"
                      onClick={() => setShowAchievement(true)}
                    >
                      <div className="achievement-icon">{achievement.icon}</div>
                      <div className="achievement-name">{achievement.name}</div>
                      <div className="achievement-earned">{achievement.earned}</div>
                      <div className="achievement-description">{achievement.description}</div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">🏆</div>
                    <div className="empty-title">No Achievements Yet</div>
                    <p className="empty-description">Complete challenges to earn achievements.</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="profile-sidebar">
          {/* Quick Actions */}
          <section className="quick-actions-section glass">
            <div className="section-header">
              <h2 className="section-title">
                <Zap size={24} />
                Quick Actions
              </h2>
            </div>
            
            <div className="quick-actions-grid">
              {quickActions.map(action => (
                <button
                  key={action.id}
                  className="quick-action-button glass"
                  onClick={action.action}
                >
                  <div className="quick-action-icon">
                    {action.icon}
                  </div>
                  <span className="quick-action-label">{action.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Performance Insights */}
          <section className="performance-section glass">
            <div className="section-header">
              <h2 className="section-title">
                <TrendingUp size={24} />
                Performance
              </h2>
            </div>
            
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem' }}>
                {streakData?.currentStreak > 0 
                  ? `Better than ${Math.floor(Math.random() * 30) + 70}% of users`
                  : 'Start your streak to see rankings'}
              </h3>
              <p style={{ color: '#71717a', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Your discipline journey is making an impact
              </p>
              <button
                className="profile-button button-secondary"
                onClick={() => navigateTo('leaderboard')}
                style={{ width: '100%' }}
              >
                <Trophy size={16} />
                View Leaderboard
              </button>
            </div>
          </section>

          {/* Social Stats */}
          <section className="activity-section glass">
            <div className="section-header">
              <h2 className="section-title">
                <Share2 size={24} />
                Social Impact
              </h2>
            </div>
            
            <div className="social-stats-list">
              {socialStats.map(stat => (
                <div key={stat.id} className="social-stat-item glass">
                  <div 
                    className="social-stat-icon" 
                    style={{ background: stat.color }}
                  >
                    {stat.icon}
                  </div>
                  
                  <div className="social-stat-content">
                    <div className="social-stat-platform">{stat.platform}</div>
                    <div className="social-stat-metrics">{stat.metrics}</div>
                  </div>
                  
                  <ExternalLink size={16} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {profileEdit.displayName !== '' && (
        <div className="modal-overlay">
          <motion.div 
            className="modal-content glass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <button 
              className="modal-close"
              onClick={() => setProfileEdit({ displayName: '', bio: '', city: '', country: '' })}
            >
              ✕
            </button>
            
            <div className="modal-header">
              <h2 className="modal-title">Edit Profile</h2>
              <p className="modal-subtitle">Update your personal information</p>
            </div>
            
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <input
                type="text"
                className="form-input"
                value={profileEdit.displayName}
                onChange={(e) => setProfileEdit({...profileEdit, displayName: e.target.value})}
                placeholder="Enter your display name"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea
                className="form-textarea"
                value={profileEdit.bio}
                onChange={(e) => setProfileEdit({...profileEdit, bio: e.target.value})}
                placeholder="Tell us about your journey"
                rows="4"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-input"
                value={profileEdit.city}
                onChange={(e) => setProfileEdit({...profileEdit, city: e.target.value})}
                placeholder="Enter your city"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Country</label>
              <input
                type="text"
                className="form-input"
                value={profileEdit.country}
                onChange={(e) => setProfileEdit({...profileEdit, country: e.target.value})}
                placeholder="Enter your country"
              />
            </div>
            
            <div className="form-actions">
              <button 
                className="profile-button button-secondary"
                onClick={() => setProfileEdit({ displayName: '', bio: '', city: '', country: '' })}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                className="profile-button button-primary"
                onClick={saveProfileEdits}
                style={{ flex: 1 }}
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Challenge Modal */}
      {showCreateChallenge && (
        <div className="create-challenge-modal">
          <motion.div 
            className="create-challenge-content glass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <button 
              className="modal-close"
              onClick={() => setShowCreateChallenge(false)}
            >
              ✕
            </button>
            
            <div className="modal-header">
              <h2 className="modal-title">Create Challenge</h2>
              <p className="modal-subtitle">Design your own discipline challenge</p>
            </div>
            
            <div className="form-group">
              <label className="form-label">Challenge Name *</label>
              <input
                type="text"
                className="form-input"
                value={newChallenge.name}
                onChange={(e) => setNewChallenge({...newChallenge, name: e.target.value})}
                placeholder="e.g., No Complaining Week"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-textarea"
                value={newChallenge.description}
                onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
                placeholder="Describe what this challenge involves and its purpose"
                rows="4"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Challenge Type</label>
              <select
                className="form-select"
                value={newChallenge.type}
                onChange={(e) => setNewChallenge({...newChallenge, type: e.target.value})}
              >
                <option value="mindset">Mindset & Discipline</option>
                <option value="business">Business & Productivity</option>
                <option value="emotional">Emotional Intelligence</option>
                <option value="physical">Physical & Health</option>
                <option value="social">Social & Relationships</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Duration (Days)</label>
              <select
                className="form-select"
                value={newChallenge.duration}
                onChange={(e) => setNewChallenge({...newChallenge, duration: parseInt(e.target.value)})}
              >
                <option value="7">7 Days (1 Week)</option>
                <option value="14">14 Days (2 Weeks)</option>
                <option value="30">30 Days (1 Month)</option>
                <option value="90">90 Days (Quarter)</option>
                <option value="365">365 Days (Year)</option>
                <option value="ongoing">Ongoing</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select
                className="form-select"
                value={newChallenge.difficulty}
                onChange={(e) => setNewChallenge({...newChallenge, difficulty: e.target.value})}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="extreme">Extreme</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Rules</label>
              {newChallenge.rules.map((rule, index) => (
                <div key={index} className="rule-input-group">
                  <input
                    type="text"
                    className="form-input"
                    value={rule}
                    onChange={(e) => {
                      const newRules = [...newChallenge.rules];
                      newRules[index] = e.target.value;
                      setNewChallenge({...newChallenge, rules: newRules});
                    }}
                    placeholder={`Rule ${index + 1}`}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newRules = newChallenge.rules.filter((_, i) => i !== index);
                        setNewChallenge({...newChallenge, rules: newRules});
                      }}
                      style={{
                        padding: '0.5rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '0.5rem',
                        color: '#ef4444',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="add-rule-button"
                onClick={() => setNewChallenge({...newChallenge, rules: [...newChallenge.rules, '']})}
              >
                + Add Rule
              </button>
            </div>
            
            <div className="form-actions">
              <button 
                className="profile-button button-secondary"
                onClick={() => setShowCreateChallenge(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                className="profile-button button-primary"
                onClick={handleCreateChallenge}
                style={{ flex: 1 }}
              >
                Create Challenge
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Social Share Modal */}
      {showSocialShareModal && userData && (
        <div className="modal-overlay">
          <motion.div 
            className="modal-content glass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <button 
              className="modal-close"
              onClick={() => setShowSocialShareModal(false)}
            >
              ✕
            </button>
            
            <div className="modal-header">
              <h2 className="modal-title">Share Profile</h2>
              <p className="modal-subtitle">
                Share your progress with others
              </p>
            </div>
            
            <div className="modal-grid">
              {[
                { platform: 'twitter', name: 'Twitter', icon: <Twitter size={24} />, color: '#1DA1F2' },
                { platform: 'linkedin', name: 'LinkedIn', icon: <Linkedin size={24} />, color: '#0077B5' },
                { platform: 'facebook', name: 'Facebook', icon: <Facebook size={24} />, color: '#1877F2' },
                { platform: 'instagram', name: 'Instagram', icon: <Instagram size={24} />, color: '#E1306C' },
                { platform: 'copy', name: 'Copy Link', icon: '📋', color: '#8b5cf6' }
              ].map((platform) => (
                <button
                  key={platform.platform}
                  className="modal-button"
                  onClick={() => handleShareProfile(platform.platform)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div 
                    style={{
                      width: '3.5rem',
                      height: '3.5rem',
                      borderRadius: '1rem',
                      background: `${platform.color}20`,
                      border: `1px solid ${platform.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                    }}
                  >
                    {platform.icon}
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '0.875rem' }}>
                    {platform.name}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Achievement Toast */}
      {showAchievement && (
        <motion.div 
          className="achievement-toast"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <div className="flex items-center gap-4">
            <div style={{ width: '3rem', height: '3rem', borderRadius: '1rem', background: 'linear-gradient(to bottom right, #fbbf24, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Trophy size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>Achievement Unlocked!</div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>You earned 100 XP for your dedication</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;