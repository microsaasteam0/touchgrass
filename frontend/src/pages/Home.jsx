import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, ArrowRight, Shield, Users, Trophy, 
  CheckCircle, Sparkles, ExternalLink,
  TrendingUp, BarChart3, MessageCircle,
  HelpCircle, Twitter, Instagram, Linkedin,
  Globe, Mail, MessageSquare, BookOpen,
  Users as UsersIcon, Clock, Shield as ShieldIcon,
  ChevronDown, ChevronUp, Download,
  MessageSquare as MessageSquareIcon,
  FileText, Lock, EyeOff, Timer,
  Hash, Heart, TrendingUp as TrendingUpIcon,
  Bell, Award, Target, Users as UsersIcon2,
  Book, Info, Minus, Plus, X,
  MessageCircle as MessageCircleIcon,
  CreditCard, Star, Calendar, Zap as ZapIcon,
  Facebook, Github, Youtube, MessageCircleCodeIcon,
  MessageCircleHeart
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../state/auth';


const LandingPage = ({ onStart }) => {
  const auth = useRecoilValue(authState);
  const navigate = useNavigate();
  const [counter, setCounter] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [activeBlog, setActiveBlog] = useState(0);
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  // Stats simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prev => {
        if (prev >= 124857) return prev;
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 50);

    const featureInterval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 3000);

    // Auto rotate blogs
    const blogInterval = setInterval(() => {
      setActiveBlog(prev => (prev + 1) % blogs.length);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(featureInterval);
      clearInterval(blogInterval);
    };
  }, []);

  // Handle Free Plan
  const handleFreePlan = (e) => {
    if (e) {
      e.stopPropagation();
    }
    
    setShowConfetti(true);
    setTimeout(() => {
      if (auth.isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/auth');
      }
    }, 500);
  };

  // Handle Premium Plan
  const handlePremiumPlan = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    const dodoPremiumUrl = 'https://checkout.dodopayments.com/buy/pdt_0NWPkwJJcZChm84jRPqIt?session=sess_5ytsvj3uYz';
    const paymentWindow = window.open(dodoPremiumUrl, '_blank', 'width=600,height=700,scrollbars=yes,resizable=yes');
    
    if (!paymentWindow) {
      toast.error('Popup blocked! Please allow popups for this site.');
      window.location.href = dodoPremiumUrl;
    } else {
      toast.success('Opening Dodo payment for Premium plan...');
      const checkInterval = setInterval(() => {
        if (paymentWindow.closed) {
          clearInterval(checkInterval);
          toast.success('Payment completed!');
        }
      }, 1000);
    }
  };

  // Handle Enterprise Plan
  const handleEnterprisePlan = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    const dodoEnterpriseUrl = 'https://checkout.dodopayments.com/buy/pdt_0NWPl4fuR5huBMtu7YAKT';
    const paymentWindow = window.open(dodoEnterpriseUrl, '_blank', 'width=600,height=700,scrollbars=yes,resizable=yes');
    
    if (!paymentWindow) {
      toast.error('Popup blocked! Please allow popups for this site.');
      window.location.href = dodoEnterpriseUrl;
    } else {
      toast.success('Opening Dodo payment for Enterprise plan...');
      const checkInterval = setInterval(() => {
        if (paymentWindow.closed) {
          clearInterval(checkInterval);
          toast.success('Payment completed!');
        }
      }, 1000);
    }
  };

  // Handle View Leaderboard
  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };

  // Handle FAQ toggle
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Handle email submission
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsEmailSubmitted(true);
      toast.success('Thanks for subscribing! Welcome to TouchGrass community! 🌿');
      setEmail('');
      setTimeout(() => setIsEmailSubmitted(false), 3000);
    }
  };

  // Features data
  const features = [
    {
      icon: Trophy,
      title: "Streak-Based Accountability",
      desc: "Build unbreakable habits with psychology-backed streak systems. Loss aversion drives compliance.",
      stat: "94.7% retention",
      color: "#22c55e"
    },
    {
      icon: TrendingUp,
      title: "Social Proof & Status",
      desc: "Climb global leaderboards, earn achievements. Your streak becomes social currency.",
      stat: "312-day record",
      color: "#3b82f6"
    },
    {
      icon: Users,
      title: "Viral Shame Mechanics",
      desc: "Built-in virality through public accountability. Drives organic growth through social pressure.",
      stat: "1.2k daily shares",
      color: "#8b5cf6"
    },
    {
      icon: Shield,
      title: "Behavioral Psychology",
      desc: "Leveraging loss aversion, social proof, and gamification for lasting behavioral change.",
      stat: "42% habit formation",
      color: "#ec4899"
    }
  ];

  // Pricing plans
  const pricingPlans = [
    {
      id: 'free',
      name: "Free",
      price: "$0",
      description: "Start your journey",
      features: ["7-day streak limit", "Basic leaderboard", "Daily reminders", "Public profile"],
      cta: "Get Started",
      popular: false,
      color: "#6b7280",
      onClick: handleFreePlan,
      icon: Sparkles
    },
    {
      id: 'premium',
      name: "Premium",
      price: "$14.99",
      period: "/month",
      description: "For serious performers",
      features: ["Unlimited streak", "Advanced analytics", "Streak freeze tokens", "Priority support", "Custom challenges"],
      cta: "Get Premium",
      popular: true,
      color: "#fbbf24",
      onClick: handlePremiumPlan,
      icon: ExternalLink
    },
    {
      id: 'enterprise',
      name: "Enterprise",
      price: "$59.99",
      period: "/month",
      description: "Teams & organizations",
      features: ["White-label solution", "API access", "Custom reporting", "Dedicated success manager", "SLA guarantee"],
      cta: "Get Enterprise",
      popular: false,
      color: "#8b5cf6",
      onClick: handleEnterprisePlan,
      icon: ExternalLink
    }
  ];

  // FAQ Data
  const faqs = [
    {
      question: "How does the streak system work?",
      answer: "Our streak system uses behavioral psychology to build lasting habits. Every day you complete your outdoor activity, your streak increases. Miss a day and your streak resets to zero. The pain of losing a streak is a powerful motivator that keeps users coming back daily."
    },
    {
      question: "Is my data and privacy protected?",
      answer: "Absolutely! We use end-to-end encryption for all user data. Your photos, location data, and personal information are never shared without your consent. We're GDPR compliant and believe in privacy-first design."
    },
    {
      question: "Can I restore my streak if I miss a day?",
      answer: "Yes! Premium users get 3 'Streak Freeze' tokens per month that allow you to miss a day without breaking your streak. This is based on the psychology of giving users a safety net while maintaining motivation."
    },
    {
      question: "Is TouchGrass free to use?",
      answer: "Yes, we have a robust free plan with 7-day streaks, basic leaderboards, and daily reminders. Premium features unlock unlimited streaks, advanced analytics, and social features."
    },
    {
      question: "What makes TouchGrass different from other habit apps?",
      answer: "We combine viral mechanics with behavioral psychology. Unlike traditional habit apps, TouchGrass uses social proof, loss aversion, and public accountability to create an addictive loop that actually works."
    },
    {
      question: "Can I use TouchGrass with friends?",
      answer: "Definitely! You can create or join challenge groups, share your progress on social media, and compete on global leaderboards. The social aspect is what makes TouchGrass so effective."
    }
  ];

  // Trending Topics
  const trendingTopics = [
    "#OutdoorAccountability", "#TouchGrassChallenge", "#StreakLife", "#ProductivityHack",
    "#MentalHealthMatters", "#DigitalDetox", "#HabitForming", "#NatureTherapy",
    "#DailyDiscipline", "#WellnessWarrior", "#OutdoorRevolution", "#MindfulMovement",
    "#SocialAccountability", "#ProgressNotPerfection", "#ConsistencyWins", "#FreshAirFlow",
    "#GreenTherapy", "#MindBodyBalance", "#HealthyHabits", "#NatureConnection"
  ];

  // Blogs Data
  const blogs = [
    {
      id: 1,
      title: "The Psychology Behind Streak-Based Accountability",
      excerpt: "How loss aversion and social proof combine to create powerful habit formation tools that actually work.",
      readTime: "5 min read",
      date: "2 days ago",
      category: "Psychology",
      author: "Dr. Sarah Chen",
      color: "#00E5FF"
    },
    {
      id: 2,
      title: "Building a Viral Product: Lessons from TouchGrass",
      excerpt: "The story behind creating a platform that grew from 0 to 100k users in 90 days through viral loops.",
      readTime: "7 min read",
      date: "1 week ago",
      category: "Growth",
      author: "Alex Johnson",
      color: "#7F00FF"
    },
    {
      id: 3,
      title: "Digital Wellness in the Age of Screens",
      excerpt: "Why daily outdoor time is the most important habit for digital creators and knowledge workers.",
      readTime: "6 min read",
      date: "2 weeks ago",
      category: "Wellness",
      author: "Dr. Marcus Rivera",
      color: "#22c55e"
    },
    {
      id: 4,
      title: "Monetizing Behavioral Psychology",
      excerpt: "How TouchGrass created a sustainable business model around positive habit formation.",
      readTime: "8 min read",
      date: "3 weeks ago",
      category: "Business",
      author: "Taylor Smith",
      color: "#fbbf24"
    }
  ];

  // Social Media Links
  const socialLinks = [
    { icon: Twitter, url: "https://entrextlabs.substack.com/subscribe", label: "Substack", color: "#1DA1F2" },
    { icon: Instagram, url: "https://www.instagram.com/entrext.labs/", label: "Instagram", color: "#E4405F" },
    { icon: Linkedin, url: "https://www.linkedin.com/company/entrext/", label: "LinkedIn", color: "#0A66C2" },
    { icon: MessageCircleCodeIcon, url: "https://discord.com/invite/ZZx3cBrx2", label: "Discord", color: "#5865F2" },
    // { icon: MessageCircleHeart, url: "https://entrextlabs.substack.com/subscribe", label: "substack", color: "#1877F2" },
    // { icon: Youtube, url: "https://youtube.com/touchgrass", label: "YouTube", color: "#FF0000" }
  ];

  return (
    <>
      <style>
        {`
          /* Base Styles */
          .landing-page {
            width: 100%;
            overflow: hidden;
            background: #050505;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
            position: relative;
            min-height: 100vh;
          }

          /* Background Effects */
          .background-grid {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 50px 50px;
            pointer-events: none;
            z-index: 1;
          }

          .floating-elements {
            position: fixed;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
          }

          .floating-element {
            position: absolute;
            border-radius: 50%;
            filter: blur(40px);
            opacity: 0.1;
            animation: float 20s infinite linear;
          }

          .float-1 {
            width: 400px;
            height: 400px;
            background: linear-gradient(135deg, #22c55e, #3b82f6);
            top: 10%;
            left: 10%;
            animation-delay: 0s;
          }

          .float-2 {
            width: 300px;
            height: 300px;
            background: linear-gradient(135deg, #8b5cf6, #ec4899);
            top: 60%;
            right: 15%;
            animation-delay: -5s;
          }

          .float-3 {
            width: 250px;
            height: 250px;
            background: linear-gradient(135deg, #fbbf24, #ef4444);
            bottom: 20%;
            left: 20%;
            animation-delay: -10s;
          }

          @keyframes float {
            0%, 100% {
              transform: translate(0, 0) rotate(0deg);
            }
            25% {
              transform: translate(50px, -50px) rotate(90deg);
            }
            50% {
              transform: translate(0, -100px) rotate(180deg);
            }
            75% {
              transform: translate(-50px, -50px) rotate(270deg);
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

          /* Navigation */
          .nav-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 50;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }

          .nav-container {
            max-width: 80rem;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .nav-logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .nav-logo-text {
            font-size: 1.5rem;
            font-weight: 900;
            letter-spacing: -0.025em;
            text-transform: uppercase;
            font-style: italic;
          }

          .nav-logo-highlight {
            color: #00E5FF;
          }

          .nav-links {
            display: none;
          }

          @media (min-width: 768px) {
            .nav-links {
              display: flex;
              align-items: center;
              gap: 2rem;
            }
          }

          .nav-link {
            font-size: 0.625rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #71717a;
            transition: color 0.2s;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
          }

          .nav-link:hover {
            color: white;
          }

          .nav-button {
            padding: 0.5rem 1.5rem;
            background: #00E5FF;
            color: black;
            border-radius: 0.75rem;
            font-size: 0.75rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
          }

          .nav-button:hover {
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(0, 229, 255, 0.4);
          }

          .nav-button:active {
            transform: scale(0.95);
          }

          /* Hero Section */
          .hero-section {
            position: relative;
            padding-top: 12rem;
            padding-bottom: 8rem;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
            text-align: center;
          }

          .hero-container {
            max-width: 64rem;
            margin: 0 auto;
          }

          .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.375rem 1rem;
            border-radius: 9999px;
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.2);
            color: #22c55e;
            font-size: 0.625rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            margin-bottom: 2.5rem;
          }

          .hero-title {
            font-size: 3rem;
            font-weight: 900;
            letter-spacing: -0.025em;
            line-height: 1;
            margin-bottom: 2rem;
            text-transform: uppercase;
            font-style: italic;
          }

          @media (min-width: 768px) {
            .hero-title {
              font-size: 6rem;
            }
          }

          .hero-subtitle {
            font-size: 1.25rem;
            color: #a1a1aa;
            margin-bottom: 3rem;
            max-width: 42rem;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.75;
            font-weight: 300;
          }

          @media (min-width: 768px) {
            .hero-subtitle {
              font-size: 1.5rem;
            }
          }

          .hero-actions {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2.5rem;
          }

          .action-buttons {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1.5rem;
          }

          .action-button {
            padding: 1.5rem 3rem;
            border-radius: 1.5rem;
            font-size: 1.25rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .action-button:hover {
            transform: scale(1.1) translateY(-5px);
          }

          .action-button:active {
            transform: scale(0.9);
          }

          .button-primary {
            background: white;
            color: black;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }

          .button-primary:hover {
            background: #e5e7eb;
            box-shadow: 0 20px 40px rgba(34, 197, 94, 0.15);
          }

          .button-secondary {
            background: #00E5FF;
            color: black;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }

          .button-secondary:hover {
            background: rgba(0, 229, 255, 0.9);
          }

          .button-icon {
            margin-left: 0.5rem;
            transition: transform 0.2s;
          }

          .action-button:hover .button-icon {
            transform: translateX(4px);
          }

          .stats-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 3rem;
            margin-top: 3rem;
          }

          .stat-item {
            text-align: center;
            cursor: default;
          }

          .stat-value {
            font-size: 2.25rem;
            font-weight: 900;
            transition: color 0.2s;
          }

          .stat-value:hover {
            color: #22c55e;
          }

          .stat-label {
            font-size: 0.625rem;
            color: #71717a;
            text-transform: uppercase;
            font-weight: 900;
            letter-spacing: 0.2em;
            margin-top: 0.5rem;
          }

          /* Psychology Section */
          .section-container {
            max-width: 80rem;
            margin: 0 auto;
            padding: 8rem 1.5rem;
          }

          .section-title {
            font-size: 3rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -0.025em;
            text-align: center;
            margin-bottom: 1rem;
          }

          @media (min-width: 768px) {
            .section-title {
              font-size: 3.75rem;
            }
          }

          .section-subtitle {
            color: #71717a;
            text-transform: uppercase;
            letter-spacing: 0.3em;
            font-size: 0.625rem;
            font-weight: 900;
            text-align: center;
            margin-bottom: 6rem;
          }

          .features-grid {
            display: grid;
            gap: 2rem;
          }

          @media (min-width: 768px) {
            .features-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (min-width: 1024px) {
            .features-grid {
              grid-template-columns: repeat(4, 1fr);
            }
          }

          .feature-card {
            padding: 2.5rem;
            border-radius: 3rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            flex-direction: column;
            transition: all 0.3s;
          }

          .feature-card:hover {
            transform: translateY(-10px);
            background: rgba(255, 255, 255, 0.04);
          }

          .feature-icon-container {
            position: relative;
          }

          .feature-icon-box {
            width: 4rem;
            height: 4rem;
            border-radius: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 2rem;
            transition: transform 0.3s;
          }

          .feature-card:hover .feature-icon-box {
            transform: scale(1.25);
          }

          .feature-title {
            font-size: 1.25rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -0.025em;
            margin-bottom: 1rem;
            line-height: 1.2;
          }

          .feature-description {
            color: #71717a;
            font-size: 0.875rem;
            font-weight: 300;
            line-height: 1.75;
            margin-bottom: 2rem;
            flex: 1;
          }

          .feature-stat {
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.3em;
            font-size: 0.625rem;
          }

          /* Viral Flywheel Section */
          .flywheel-container {
            position: relative;
          }

          .flywheel-line {
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: rgba(255, 255, 255, 0.05);
            transform: translateY(-50%);
            display: none;
          }

          @media (min-width: 1024px) {
            .flywheel-line {
              display: block;
            }
          }

          .flywheel-grid {
            display: grid;
            gap: 2rem;
            position: relative;
            z-index: 10;
          }

          @media (min-width: 1024px) {
            .flywheel-grid {
              grid-template-columns: repeat(4, 1fr);
            }
          }

          .flywheel-card {
            padding: 2.5rem;
            border-radius: 3rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
            text-align: center;
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), transparent, rgba(59, 130, 246, 0.1));
            transition: all 0.3s;
          }

          .flywheel-card:hover {
            border-color: rgba(127, 0, 255, 0.4);
          }

          .flywheel-emoji {
            font-size: 4.5rem;
            margin-bottom: 1.5rem;
            transition: transform 0.5s;
          }

          .flywheel-card:hover .flywheel-emoji {
            transform: scale(1.1);
          }

          .flywheel-step-title {
            font-size: 1.25rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -0.025em;
            margin-bottom: 0.5rem;
          }

          .flywheel-step-desc {
            color: #71717a;
            font-size: 0.75rem;
            font-weight: 300;
            line-height: 1.75;
          }

          /* Testimonials Section */
          .testimonials-section {
            background: linear-gradient(to bottom, transparent, rgba(127, 0, 255, 0.02));
          }

          .testimonials-grid {
            display: grid;
            gap: 2rem;
          }

          @media (min-width: 768px) {
            .testimonials-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }

          .testimonial-card {
            padding: 2.5rem;
            border-radius: 3rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            flex-direction: column;
            background: rgba(255, 255, 255, 0.01);
            transition: all 0.3s;
          }

          .testimonial-card:hover {
            border-color: rgba(34, 197, 94, 0.2);
          }

          .testimonial-header {
            display: flex;
            align-items: center;
            gap: 1.25rem;
            margin-bottom: 2rem;
          }

          .testimonial-avatar {
            width: 3.5rem;
            height: 3.5rem;
            border-radius: 1rem;
            background: linear-gradient(135deg, #22c55e, #3b82f6);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 1.25rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }

          .testimonial-info {
            flex: 1;
          }

          .testimonial-name {
            font-weight: 900;
            font-size: 1.125rem;
            margin: 0;
          }

          .testimonial-role {
            font-size: 0.625rem;
            text-transform: uppercase;
            font-weight: 900;
            letter-spacing: 0.1em;
            color: #71717a;
            margin-top: 0.25rem;
          }

          .testimonial-streak {
            color: #22c55e;
            font-weight: 900;
            font-size: 0.875rem;
            font-style: italic;
            margin-left: auto;
          }

          .testimonial-quote {
            color: #d4d4d8;
            font-style: italic;
            line-height: 1.75;
            flex: 1;
            font-size: 1.125rem;
            font-weight: 300;
            margin: 0;
          }

          /* Pricing Section */
          .pricing-grid {
            display: grid;
            gap: 2rem;
            align-items: stretch;
          }

          @media (min-width: 1024px) {
            .pricing-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }

          .pricing-card {
            padding: 3rem;
            border-radius: 4rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            flex-direction: column;
            position: relative;
            transition: transform 0.3s;
          }

          .pricing-card:hover {
            transform: translateY(-10px);
          }

          .popular-badge {
            position: absolute;
            top: -1rem;
            left: 50%;
            transform: translateX(-50%);
            padding: 0.375rem 1.25rem;
            background: #fbbf24;
            color: black;
            border-radius: 9999px;
            font-size: 0.625rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.3em;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }

          .pricing-plan {
            font-size: 1.5rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -0.025em;
            margin-bottom: 0.5rem;
          }

          .pricing-price {
            font-size: 3.75rem;
            font-weight: 900;
            margin-bottom: 3rem;
          }

          .pricing-period {
            font-size: 0.875rem;
            font-weight: normal;
            color: #71717a;
          }

          .pricing-description {
            font-size: 0.75rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 2.5rem;
          }

          .popular-plan {
            border-color: rgba(251, 191, 36, 0.3);
            background: linear-gradient(to bottom, rgba(251, 191, 36, 0.08), transparent);
            transform: scale(1.05);
            background-color: rgba(0, 0, 0, 0.4);
          }

          .pricing-features {
            list-style: none;
            padding: 0;
            margin: 0 0 3rem 0;
            flex: 1;
          }

          .pricing-feature {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
            font-size: 0.875rem;
            font-weight: 300;
          }

          .pricing-button {
            width: 100%;
            padding: 1.25rem;
            border-radius: 1rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-size: 0.625rem;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }

          .pricing-button:hover {
            transform: scale(1.05);
          }

          .pricing-button:active {
            transform: scale(0.95);
          }

          .button-free {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
          }

          .button-free:hover {
            background: rgba(255, 255, 255, 0.05);
          }

          .button-premium {
            background: #fbbf24;
            color: black;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }

          .button-premium:hover {
            background: rgba(251, 191, 36, 0.9);
          }

          /* NEW: Blogs Section */
          .blogs-section {
            background: linear-gradient(to bottom, rgba(127, 0, 255, 0.02), transparent);
            position: relative;
            overflow: hidden;
          }

          .blogs-container {
            position: relative;
            z-index: 10;
          }

          .blogs-grid {
            display: grid;
            gap: 2rem;
            margin-bottom: 4rem;
          }

          @media (min-width: 768px) {
            .blogs-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          .blog-card {
            border-radius: 2.5rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
            overflow: hidden;
            transition: all 0.3s;
            position: relative;
            background: rgba(15, 23, 42, 0.8);
            height: 100%;
          }

          .blog-card:hover {
            transform: translateY(-10px);
            border-color: rgba(0, 229, 255, 0.3);
            box-shadow: 0 20px 40px rgba(0, 229, 255, 0.1);
          }

          .blog-card.active {
            border-color: rgba(0, 229, 255, 0.4);
            background: rgba(0, 229, 255, 0.05);
          }

          .blog-badge {
            position: absolute;
            top: 1.5rem;
            left: 1.5rem;
            padding: 0.5rem 1rem;
            border-radius: 1rem;
            font-size: 0.625rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            z-index: 20;
          }

          .blog-content {
            padding: 2.5rem;
            height: 100%;
            display: flex;
            flex-direction: column;
          }

          .blog-title {
            font-size: 1.5rem;
            font-weight: 900;
            margin-bottom: 1rem;
            line-height: 1.2;
          }

          .blog-excerpt {
            color: #94a3b8;
            font-size: 0.875rem;
            line-height: 1.6;
            margin-bottom: 1.5rem;
            flex: 1;
          }

          .blog-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: auto;
          }

          .blog-stats {
            display: flex;
            gap: 1rem;
          }

          .blog-stat {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.75rem;
            color: #64748b;
          }

          .blog-author {
            font-size: 0.875rem;
            font-weight: 600;
            color: #e2e8f0;
          }

          .blog-read-more {
            margin-top: 1.5rem;
            padding: 0.75rem 1.5rem;
            border-radius: 1rem;
            background: rgba(0, 229, 255, 0.1);
            border: 1px solid rgba(0, 229, 255, 0.2);
            color: #00E5FF;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            cursor: pointer;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
          }

          .blog-read-more:hover {
            background: rgba(0, 229, 255, 0.2);
            transform: translateX(5px);
          }

          /* NEW: FAQ Section */
          .faq-section {
            background: linear-gradient(to bottom, transparent, rgba(34, 197, 94, 0.02));
          }

          .faq-container {
            max-width: 64rem;
            margin: 0 auto;
          }

          .faq-grid {
            display: grid;
            gap: 1rem;
          }

          .faq-item {
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 2rem;
            overflow: hidden;
            transition: all 0.3s;
          }

          .faq-item.active {
            border-color: rgba(0, 229, 255, 0.3);
            background: rgba(0, 229, 255, 0.05);
          }

          .faq-question {
            padding: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            background: rgba(255, 255, 255, 0.01);
            transition: background 0.3s;
          }

          .faq-question:hover {
            background: rgba(255, 255, 255, 0.03);
          }

          .faq-question h3 {
            font-size: 1.25rem;
            font-weight: 700;
            margin: 0;
            color: #e2e8f0;
          }

          .faq-icon {
            transition: transform 0.3s;
            color: #00E5FF;
          }

          .faq-item.active .faq-icon {
            transform: rotate(180deg);
          }

          .faq-answer {
            padding: 0 2rem;
            max-height: 0;
            overflow: hidden;
            transition: all 0.3s ease-in-out;
          }

          .faq-item.active .faq-answer {
            padding-bottom: 2rem;
            max-height: 500px;
          }

          .faq-answer p {
            color: #94a3b8;
            line-height: 1.6;
            margin: 0;
            font-size: 1rem;
          }

          /* Trending Topics */
          .topics-section {
            margin-top: 4rem;
          }

          .topics-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            justify-content: center;
            margin-top: 2rem;
          }

          .topic-tag {
            padding: 0.75rem 1.5rem;
            border-radius: 2rem;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #94a3b8;
            font-size: 0.75rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .topic-tag:hover {
            background: rgba(0, 229, 255, 0.1);
            border-color: rgba(0, 229, 255, 0.3);
            color: #00E5FF;
            transform: translateY(-2px);
          }

          .topic-icon {
            color: #00E5FF;
          }

          /* Still Have Questions */
          .question-cta {
            text-align: center;
            margin-top: 4rem;
            padding: 4rem;
            border-radius: 3rem;
            background: linear-gradient(135deg, rgba(0, 229, 255, 0.05), rgba(127, 0, 255, 0.05));
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .question-cta h3 {
            font-size: 2rem;
            font-weight: 900;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #00E5FF, #7F00FF);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .contact-button {
            margin-top: 2rem;
            padding: 1rem 2rem;
            border-radius: 1rem;
            background: linear-gradient(135deg, #00E5FF, #7F00FF);
            color: white;
            border: none;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
          }

          .contact-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 229, 255, 0.3);
          }

          /* Social Media Links */
          .social-section {
            text-align: center;
            margin-top: 3rem;
          }

          .social-grid {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 1rem;
            margin-top: 2rem;
          }

          .social-link {
            width: 3.5rem;
            height: 3.5rem;
            border-radius: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
          }

          .social-link:hover {
            transform: translateY(-5px);
            background: rgba(255, 255, 255, 0.08);
          }

          .social-link.twitter:hover {
            background: #1DA1F2;
            border-color: #1DA1F2;
          }

          .social-link.instagram:hover {
            background: linear-gradient(45deg, #405DE6, #5B51D8, #833AB4, #C13584, #E1306C, #FD1D1D, #F56040, #F77737, #FCAF45, #FFDC80);
            border-color: #E1306C;
          }

          .social-link.linkedin:hover {
            background: #0A66C2;
            border-color: #0A66C2;
          }

          .social-link.discord:hover {
            background: #5865F2;
            border-color: #5865F2;
          }

          .social-link.facebook:hover {
            background: #1877F2;
            border-color: #1877F2;
          }

          .social-link.youtube:hover {
            background: #FF0000;
            border-color: #FF0000;
          }

          /* Final CTA Section */
          .cta-section {
            padding: 12rem 1.5rem;
            text-align: center;
          }

          .cta-container {
            max-width: 64rem;
            margin: 0 auto;
            padding: 6rem;
            border-radius: 5rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.05), transparent, rgba(59, 130, 246, 0.05));
            position: relative;
            overflow: hidden;
          }

          .cta-title {
            font-size: 3rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -0.025em;
            line-height: 1;
            margin-bottom: 2.5rem;
            font-style: italic;
          }

          @media (min-width: 768px) {
            .cta-title {
              font-size: 5rem;
            }
          }

          .cta-subtitle {
            color: #a1a1aa;
            font-size: 1.25rem;
            font-weight: 300;
            margin-bottom: 4rem;
            max-width: 42rem;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.75;
          }

          @media (min-width: 768px) {
            .cta-subtitle {
              font-size: 1.5rem;
            }
          }

          .cta-actions {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            justify-content: center;
          }

          @media (min-width: 768px) {
            .cta-actions {
              flex-direction: row;
            }
          }

          .cta-button {
            padding: 1.25rem 2.5rem;
            border-radius: 1rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-size: 0.75rem;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            min-width: 200px;
          }

          .cta-button:hover {
            transform: scale(1.05) translateY(-5px);
          }

          .cta-button:active {
            transform: scale(0.95);
          }

          .cta-zap {
            position: absolute;
            top: 0;
            right: 0;
            padding: 6rem;
            color: rgba(34, 197, 94, 0.1);
            pointer-events: none;
          }

          .cta-note {
            margin-top: 3rem;
            color: #71717a;
            text-transform: uppercase;
            letter-spacing: 0.3em;
            font-size: 0.625rem;
            font-weight: 900;
          }

          /* Footer */
          .footer {
            padding: 6rem 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
          }

          .footer-grid {
            max-width: 80rem;
            margin: 0 auto;
            display: grid;
            gap: 4rem;
            color: #71717a;
          }

          @media (min-width: 768px) {
            .footer-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (min-width: 1024px) {
            .footer-grid {
              grid-template-columns: repeat(4, 1fr);
            }
          }

          .footer-logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 2rem;
            color: white;
          }

          .footer-logo-text {
            font-size: 1.5rem;
            font-weight: 900;
            letter-spacing: -0.025em;
            text-transform: uppercase;
            font-style: italic;
          }

          .footer-logo-highlight {
            color: #00E5FF;
          }

          .footer-description {
            font-size: 0.875rem;
            font-weight: 300;
            line-height: 1.75;
          }

          .footer-column h6 {
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.3em;
            font-size: 0.625rem;
            color: white;
            margin-bottom: 2rem;
          }

          .footer-links {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .footer-link {
            margin-bottom: 1rem;
            font-size: 0.75rem;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 0.1em;
          }

          .footer-link button {
            background: none;
            border: none;
            color: inherit;
            font: inherit;
            cursor: pointer;
            padding: 0;
            transition: color 0.2s;
          }

          .footer-link button:hover {
            color: #00E5FF;
          }

          .footer-link a {
            color: inherit;
            text-decoration: none;
            transition: color 0.2s;
          }

          .footer-link a:hover {
            color: #00E5FF;
          }

          .newsletter-container {
            display: flex;
            gap: 0.5rem;
            padding: 0.25rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 0.75rem;
            background: rgba(255, 255, 255, 0.05);
          }

          .newsletter-input {
            background: transparent;
            border: none;
            outline: none;
            font-size: 0.75rem;
            padding: 0 1rem;
            flex: 1;
            color: white;
          }

          .newsletter-button {
            background: #00E5FF;
            color: black;
            padding: 0.75rem;
            border-radius: 0.5rem;
            border: none;
            cursor: pointer;
            transition: background 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .newsletter-button:hover {
            background: white;
          }

          .footer-bottom {
            max-width: 80rem;
            margin: 0 auto;
            margin-top: 6rem;
            padding-top: 3rem;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            text-align: center;
          }

          .footer-copyright {
            font-size: 0.625rem;
            text-transform: uppercase;
            font-weight: 900;
            letter-spacing: 0.4em;
            color: #52525b;
          }

          /* Animations */
          @keyframes floatUp {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }

          @keyframes slideInRight {
            from { transform: translateX(50px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }

          @keyframes slideInLeft {
            from { transform: translateX(-50px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }

          .animate-float-up {
            animation: floatUp 0.6s ease-out forwards;
          }

          .animate-pulse {
            animation: pulse 2s infinite;
          }

          .animate-slide-right {
            animation: slideInRight 0.5s ease-out forwards;
          }

          .animate-slide-left {
            animation: slideInLeft 0.5s ease-out forwards;
          }

          .delay-1 { animation-delay: 0.1s; opacity: 0; }
          .delay-2 { animation-delay: 0.2s; opacity: 0; }
          .delay-3 { animation-delay: 0.3s; opacity: 0; }
          .delay-4 { animation-delay: 0.4s; opacity: 0; }
          .delay-5 { animation-delay: 0.5s; opacity: 0; }

          /* Responsive */
          @media (max-width: 768px) {
            .section-title {
              font-size: 2.5rem;
            }
            
            .hero-title {
              font-size: 3rem;
            }
            
            .cta-title {
              font-size: 2.5rem;
            }
            
            .blog-card {
              margin: 0 auto;
              max-width: 400px;
            }
            
            .faq-question h3 {
              font-size: 1.125rem;
            }
            
            .topic-tag {
              font-size: 0.675rem;
              padding: 0.5rem 1rem;
            }
          }
        `}
      </style>

      <div className="landing-page">
        {/* Background effects */}
        <div className="background-grid" />
        <div className="floating-elements">
          <div className="floating-element float-1" />
          <div className="floating-element float-2" />
          <div className="floating-element float-3" />
        </div>

        {/* Navigation */}
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="nav-bar glass"
        >
          <div className="nav-container">
            <div className="nav-logo">
              <Zap className="text-[#00E5FF] fill-[#00E5FF]" />
              <span className="nav-logo-text">touchgrass<span className="nav-logo-highlight">.now</span></span>
            </div>
            <div className="nav-links">
              <button className="nav-link" onClick={() => document.getElementById('psychology')?.scrollIntoView({ behavior: 'smooth' })}>
                Psychology
              </button>
              <button className="nav-link" onClick={() => document.getElementById('flywheel')?.scrollIntoView({ behavior: 'smooth' })}>
                Flywheel
              </button>
              <button className="nav-link" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
                Pricing
              </button>
              <button className="nav-link" onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}>
                FAQ
              </button>
              <button className="nav-link" onClick={handleViewLeaderboard}>
                Leaderboard
              </button>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFreePlan}
              className="nav-button"
            >
              Start Free Plan
            </motion.button>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section className="hero-section">
          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2
                }
              }
            }}
            initial="hidden"
            animate="visible"
            className="hero-container"
          >
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
                }
              }}
              className="hero-badge"
            >
              <Sparkles size={14} /> The Internet's Accountability Platform
            </motion.div>
            
            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
                }
              }}
              className="hero-title"
            >
              Have You <span className="text-gradient">Touched Grass</span> Today?
            </motion.h1>
            
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
                }
              }}
              className="hero-subtitle"
            >
              A daily accountability platform that uses <strong>social proof</strong>, 
              <strong> loss aversion</strong>, and <strong>viral mechanics</strong> to build 
              real-life discipline. Turn internet memes into million-dollar habits.
            </motion.p>
            
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
                }
              }}
              className="hero-actions"
            >
              <div className="action-buttons">
                <motion.button 
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleFreePlan}
                  className="action-button button-primary"
                >
                  Start Free Plan <ArrowRight className="button-icon" />
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePremiumPlan}
                  className="action-button button-secondary"
                >
                  Get Premium <ExternalLink className="button-icon" />
                </motion.button>
              </div>
              
              <div className="stats-container">
                {[
                  { val: `${counter.toLocaleString()}+`, label: 'Active Users' },
                  { val: '312', label: 'Longest Streak' },
                  { val: '94.7%', label: 'Retention Rate' },
                  { val: '$10M+', label: 'Projected ARR' }
                ].map((stat, idx) => (
                  <div key={idx} className="stat-item">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="stat-value"
                    >
                      {stat.val}
                    </motion.div>
                    <div className="stat-label">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Psychology Section */}
        <section id="psychology" className="section-container" style={{ background: 'rgba(255, 255, 255, 0.01)', borderTop: '1px solid rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center', marginBottom: '6rem' }}
            >
              <h2 className="section-title">The Psychology Behind The Magic</h2>
              <p className="section-subtitle">Four viral triggers combined into one addictive behavior engine</p>
            </motion.div>

            <div className="features-grid">
              {features.map((item, i) => {
                const Icon = item.icon;
                const isActive = activeFeature === i;
                
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ 
                      y: -10, 
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      borderColor: `${item.color}4D`
                    }}
                    className={`feature-card glass ${isActive ? 'active-feature' : ''}`}
                    style={{
                      borderColor: isActive ? `${item.color}4D` : 'rgba(255, 255, 255, 0.05)',
                      background: isActive ? `${item.color}0D` : 'transparent'
                    }}
                  >
                    <div className="feature-icon-container">
                      <div 
                        className="feature-icon-box"
                        style={{ 
                          background: `linear-gradient(135deg, ${item.color}33, ${item.color}66)`,
                          color: item.color,
                          border: `1px solid ${item.color}4D`
                        }}
                      >
                        <Icon size={32} />
                      </div>
                      {isActive && (
                        <motion.div 
                          style={{
                            position: 'absolute',
                            top: '-1rem',
                            left: '-1rem',
                            right: '-1rem',
                            bottom: '-1rem',
                            borderRadius: '3rem',
                            border: `1px solid ${item.color}33`
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        />
                      )}
                    </div>
                    <h3 className="feature-title">{item.title}</h3>
                    <p className="feature-description">{item.desc}</p>
                    <div 
                      className="feature-stat"
                      style={{ color: item.color }}
                    >
                      {item.stat}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Viral Flywheel */}
        <section id="flywheel" className="section-container">
          <div>
            <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
              <h2 className="section-title">The Viral Flywheel</h2>
              <p className="section-subtitle">This loop creates addicting social pressure that converts to revenue</p>
            </div>
            
            <div className="flywheel-container">
              <div className="flywheel-line" />
              <div className="flywheel-grid">
                {[
                  { emoji: "🌱", title: "Daily Check-in", desc: "\"Have you touched grass?\"" },
                  { emoji: "📸", title: "Proof or Shame", desc: "Upload photo or accept public shame" },
                  { emoji: "🔥", title: "Streak Grows", desc: "Build status & social proof" },
                  { emoji: "📈", title: "Monetize Loss", desc: "Pay to restore broken streaks" }
                ].map((step, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flywheel-card glass"
                  >
                    <div className="flywheel-emoji">{step.emoji}</div>
                    <h4 className="flywheel-step-title">{step.title}</h4>
                    <p className="flywheel-step-desc">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="section-container testimonials-section">
          <div>
            <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
              <h2 className="section-title">Trusted by Elite Performers</h2>
              <p className="section-subtitle">From Silicon Valley executives to professional athletes</p>
            </div>
            <div className="testimonials-grid">
              {[
                {
                  name: "Sarah Chen",
                  title: "Product Lead @ Google",
                  streak: "312 days",
                  quote: "This app changed my life. I went from 0 to 300+ days of daily outdoor activity. The psychology works.",
                  initials: "SC"
                },
                {
                  name: "Marcus Johnson",
                  title: "VC @ A16Z",
                  streak: "189 days",
                  quote: "Most brilliant SaaS idea I've seen. The pain of losing a streak is more powerful than any reward.",
                  initials: "MJ"
                },
                {
                  name: "Alex Rivera",
                  title: "Founder @ YC W23",
                  streak: "256 days",
                  quote: "Our entire team uses TouchGrass. Productivity up 40%. The ROI on mental health is immeasurable.",
                  initials: "AR"
                }
              ].map((t, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="testimonial-card glass"
                >
                  <div className="testimonial-header">
                    <div className="testimonial-avatar">{t.initials}</div>
                    <div className="testimonial-info">
                      <h5 className="testimonial-name">{t.name}</h5>
                      <p className="testimonial-role">{t.title}</p>
                    </div>
                    <div className="testimonial-streak">{t.streak}</div>
                  </div>
                  <p className="testimonial-quote">"{t.quote}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* NEW: Blogs Section */}
        <section id="blogs" className="section-container blogs-section">
          <div className="blogs-container">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center', marginBottom: '6rem' }}
            >
              <h2 className="section-title">Latest From Our Blog</h2>
              <p className="section-subtitle">Insights, stories, and psychology behind TouchGrass</p>
            </motion.div>

            <div className="blogs-grid">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  whileHover={{ y: -10 }}
                  className={`blog-card glass ${activeBlog === index ? 'active' : ''}`}
                  onMouseEnter={() => setActiveBlog(index)}
                >
                  <div 
                    className="blog-badge"
                    style={{ 
                      background: `linear-gradient(135deg, ${blog.color}33, ${blog.color}66)`,
                      border: `1px solid ${blog.color}4D`,
                      color: blog.color
                    }}
                  >
                    {blog.category}
                  </div>
                  
                  <div className="blog-content">
                    <h3 className="blog-title">{blog.title}</h3>
                    <p className="blog-excerpt">{blog.excerpt}</p>
                    
                    <div className="blog-meta">
                      <div className="blog-stats">
                        <span className="blog-stat">
                          <Clock size={14} /> {blog.readTime}
                        </span>
                        <span className="blog-stat">
                          <Calendar size={14} /> {blog.date}
                        </span>
                      </div>
                      <span className="blog-author">By {blog.author}</span>
                    </div>
                    
                    <button className="blog-read-more">
                      Read Article <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center', marginTop: '4rem' }}
            >
              <button className="cta-button button-secondary" style={{ minWidth: '200px' }}>
                <BookOpen size={16} />
                View All Articles
              </button>
            </motion.div>
          </div>
        </section>

        {/* NEW: FAQ Section */}
<section id="faq" className="section-container faq-section">
  <div className="faq-container">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{ textAlign: 'center', marginBottom: '6rem' }}
    >
      <h2 className="section-title">Common Questions</h2>
      <p className="section-subtitle">Everything You Need to Know</p>
    </motion.div>

    <div className="faq-grid">
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className={`faq-item glass ${openFaqIndex === index ? 'active' : ''}`}
        >
          <div 
            className="faq-question"
            onClick={() => toggleFaq(index)}
          >
            <h3>{faq.question}</h3>
            {openFaqIndex === index ? (
              <ChevronUp size={20} className="faq-icon" />
            ) : (
              <ChevronDown size={20} className="faq-icon" />
            )}
          </div>
          
          <div className="faq-answer">
            <p>{faq.answer}</p>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Trending Topics - FIXED */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="topics-section"
    >
      <h3 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', color: '#e2e8f0' }}>
        Trending Topics & User Needs
      </h3>
      
      <div className="topics-grid">
        {trendingTopics.map((topic, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="topic-tag"
            onClick={() => toast.success(`Exploring ${topic}`)}
          >
            <Hash size={14} className="topic-icon" />
            {topic}
          </motion.button>
        ))}
      </div>
    </motion.div>

    {/* Still Have Questions */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="question-cta glass"
    >
      <h3>Still have a burning question?</h3>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
        Can't find the answer you're looking for? Our team is here to help.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="contact-button"
          onClick={() => window.location.href = 'mailto:business@entrext.in'}
        >
          <Mail size={16} />
          Contact Support
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="contact-button"
          onClick={() => window.location.href = 'mailto:business@entrext.in'}
          style={{ background: 'linear-gradient(135deg, #7F00FF, #22c55e)' }}
        >
          <MessageSquare size={16} />
          Business Inquiries
        </motion.button>
      </div>
    </motion.div>

    {/* Social Media Links */}
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="social-section"
    >
      <h4 style={{ fontSize: '0.875rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#71717a', marginBottom: '1rem' }}>
        Join Our Community
      </h4>
      <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
        Connect with us on social media for updates, tips, and community challenges
      </p>
      
      <div className="social-grid">
        {socialLinks.map((social, index) => {
          const Icon = social.icon;
          return (
            <motion.a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.1,
                rotate: 5,
                backgroundColor: social.color,
                borderColor: social.color
              }}
              className={`social-link ${social.label.toLowerCase()}`}
              style={{ color: social.color }}
            >
              <Icon size={20} />
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  </div>
</section>

        {/* Pricing Section */}
        <section id="pricing" className="section-container">
          <div>
            <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
              <h2 className="section-title">Simple, Transparent Pricing</h2>
              <p className="section-subtitle">Start free, upgrade as your discipline grows</p>
            </div>
            
            <div className="pricing-grid">
              {pricingPlans.map((plan, index) => {
                const Icon = plan.icon;
                const isPopular = plan.popular;
                
                return (
                  <motion.div 
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    whileHover={{ y: -10 }}
                    className={`pricing-card glass ${isPopular ? 'popular-plan' : ''}`}
                  >
                    {isPopular && (
                      <div className="popular-badge">Most Popular</div>
                    )}
                    
                    <h3 className="pricing-plan">{plan.name}</h3>
                    <div className="pricing-price">
                      {plan.price}<span className="pricing-period">{plan.period}</span>
                    </div>
                    <p 
                      className="pricing-description"
                      style={{ color: isPopular ? '#a1a1aa' : '#71717a' }}
                    >
                      {plan.description}
                    </p>
                    
                    <ul className="pricing-features">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="pricing-feature">
                          <CheckCircle size={16} style={{ color: '#22c55e' }} />
                          <span style={{ color: isPopular ? '#d4d4d8' : '#a1a1aa' }}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={plan.onClick}
                      className={`pricing-button ${plan.id === 'free' ? 'button-free' : 'button-premium'}`}
                    >
                      <Icon size={14} />
                      {plan.cta}
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="cta-section">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="cta-container glass"
          >
            <div style={{ position: 'relative', zIndex: 10 }}>
              <h2 className="cta-title">
                Ready to Turn <br/> Discipline into <span className="text-gradient">Status?</span>
              </h2>
              <p className="cta-subtitle">
                Join 124,857+ people who've transformed their habits with TouchGrass. 
                Your future self will thank you.
              </p>
              
              <div className="cta-actions">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFreePlan}
                  className="cta-button button-primary"
                >
                  <Sparkles size={14} />
                  Start Free Plan
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePremiumPlan}
                  className="cta-button button-secondary"
                  style={{ background: '#00E5FF' }}
                >
                  <ExternalLink size={14} />
                  Get Premium
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewLeaderboard}
                  className="cta-button button-free"
                >
                  <BarChart3 size={14} />
                  View Leaderboard
                </motion.button>
              </div>
              
              {/* Newsletter Signup */}
              <div style={{ marginTop: '3rem', maxWidth: '400px', margin: '3rem auto 0' }}>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1rem' }}>
                  Get weekly tips on habit formation and productivity
                </p>
                <form onSubmit={handleEmailSubmit} className="newsletter-container">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="newsletter-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="newsletter-button">
                    {isEmailSubmitted ? <CheckCircle size={16} /> : <ArrowRight size={16} />}
                  </button>
                </form>
              </div>
              
              <p className="cta-note">
                No credit card required for Free plan • 7-day streak guarantee • Cancel anytime
              </p>
            </div>
            
            <div className="cta-zap">
              <Zap size={300} />
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="footer glass">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">
                <Zap style={{ color: '#00E5FF', fill: '#00E5FF' }} size={24} />
                <span className="footer-logo-text">touchgrass<span className="footer-logo-highlight">.now</span></span>
              </div>
              <p className="footer-description">
                Viral behavioral psychology meets daily accountability. 
                Build status by building discipline. 🤫
              </p>
              <p className="footer-description" style={{ marginTop: '1rem', fontStyle: 'italic', color: '#94a3b8' }}>
                TouchGrass - Ephemeral outdoor accountability platform. 
                Build streaks, leave no trace.
              </p>
              
              {/* Footer Social Links */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
                {socialLinks.slice(0, 4).map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#94a3b8',
                        textDecoration: 'none'
                      }}
                    >
                      <Icon size={16} />
                    </motion.a>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h6>Features</h6>
              <ul className="footer-links">
                <li className="footer-link">
                  <button onClick={() => document.getElementById('psychology')?.scrollIntoView({ behavior: 'smooth' })}>
                    Psychology Engine
                  </button>
                </li>
                <li className="footer-link">
                  <button onClick={() => document.getElementById('flywheel')?.scrollIntoView({ behavior: 'smooth' })}>
                    Viral Flywheel
                  </button>
                </li>
                <li className="footer-link">
                  <button onClick={() => document.getElementById('blogs')?.scrollIntoView({ behavior: 'smooth' })}>
                    Blog & Insights
                  </button>
                </li>
                <li className="footer-link">
                  <button onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}>
                    FAQ & Help
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h6>Platform</h6>
              <ul className="footer-links">
                <li className="footer-link">
                  <button onClick={handleViewLeaderboard}>
                    Leaderboard
                  </button>
                </li>
                <li className="footer-link">
                  <a href="#">Community</a>
                </li>
                <li className="footer-link">
                  <a href="#">Challenges</a>
                </li>
                <li className="footer-link">
                  <a href="#">For Teams</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h6></h6>
              <ul className="footer-links">
                {/* <li className="footer-link">
                  <a href="#">Terms of Service</a>
                </li>
                <li className="footer-link">
                  <a href="#">Privacy Policy</a>
                </li>
                <li className="footer-link">
                  <a href="#">Cookie Policy</a>
                </li>
                <li className="footer-link">
                  <a href="#">Refund Policy</a>
                </li> */}
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <p className="footer-copyright">© 2026 touchgrass.now — Go outside. 🍃</p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                {/* <a href="mailto:business@entrext.in" style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'none' }}>
                  contact@touchgrass.now
                </a> */}
                <a href="mailto:business@entrext.in" style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'none' }}>
                  business@entrext.in
                </a>
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1.5rem', fontStyle: 'italic' }}>
              Conversations are ephemeral and accountability-driven. Your discipline is your status.
            </p>
          </div>
        </footer>
      </div>

      {/* Confetti Animation */}
      {showConfetti && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: '10px',
                height: '10px',
                background: ['#00E5FF', '#7F00FF', '#22c55e', '#fbbf24'][Math.floor(Math.random() * 4)],
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                top: '-10px'
              }}
              initial={{ y: 0, rotate: 0 }}
              animate={{
                y: '100vh',
                rotate: 360,
                x: Math.random() * 100 - 50
              }}
              transition={{
                duration: 1 + Math.random(),
                ease: 'easeOut'
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default LandingPage;