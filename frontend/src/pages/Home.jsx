import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Confetti from '../components/ui/Confetti';
import Model from '../components/ui/Model';
import { useRecoilValue } from 'recoil';
import { authState } from '../state/auth';
import { Trophy, TrendingUp, Users, Shield, Zap, Sparkles, ArrowRight, CheckCircle, Star, Globe, Target, Award, Rocket, ChevronRight, Play, Calendar, BarChart3, Heart } from 'lucide-react';

const Home = () => {
  const auth = useRecoilValue(authState);
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [counter, setCounter] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    // Simulate user growth counter
    const interval = setInterval(() => {
      setCounter(prev => {
        if (prev >= 124857) return prev;
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 50);

    // Auto rotate features
    const featureInterval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(featureInterval);
    };
  }, []);

  const features = [
    {
      icon: <Trophy />,
      title: "Streak-Based Accountability",
      description: "Build unbreakable habits with psychology-backed streak systems. Loss aversion drives compliance.",
      color: "#22c55e",
      stats: "94.7% retention"
    },
    {
      icon: <TrendingUp />,
      title: "Social Proof & Status",
      description: "Climb global leaderboards, earn achievements. Your streak becomes social currency.",
      color: "#3b82f6",
      stats: "312-day record"
    },
    {
      icon: <Users />,
      title: "Viral Shame Mechanics",
      description: "Built-in virality through public accountability. Drives organic growth through social pressure.",
      color: "#8b5cf6",
      stats: "1.2k daily shares"
    },
    {
      icon: <Shield />,
      title: "Behavioral Psychology",
      description: "Leveraging loss aversion, social proof, and gamification for lasting behavioral change.",
      color: "#ec4899",
      stats: "42% habit formation"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Lead @ Google",
      streak: 312,
      quote: "This app changed my life. I went from 0 to 300+ days of daily outdoor activity. The psychology works.",
      avatar: "SC",
      company: "Google"
    },
    {
      name: "Marcus Johnson",
      role: "VC @ A16Z",
      streak: 189,
      quote: "Most brilliant SaaS idea I've seen. The pain of losing a streak is more powerful than any reward.",
      avatar: "MJ",
      company: "A16Z"
    },
    {
      name: "Alex Rivera",
      role: "Founder @ YC W23",
      streak: 256,
      quote: "Our entire team uses TouchGrass. Productivity up 40%. The ROI on mental health is immeasurable.",
      avatar: "AR",
      company: "YC"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "Start your journey",
      features: ["7-day streak limit", "Basic leaderboard", "Daily reminders", "Public profile"],
      cta: "Get Started",
      popular: false,
      color: "#6b7280"
    },
    {
      name: "Premium",
      price: "$14.99",
      period: "/month",
      description: "For serious performers",
      features: ["Unlimited streak", "Advanced analytics", "Streak freeze tokens", "Priority support", "Custom challenges"],
      cta: "Start Trial",
      popular: true,
      color: "#fbbf24"
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Teams & organizations",
      features: ["White-label solution", "API access", "Custom reporting", "Dedicated success manager", "SLA guarantee"],
      cta: "Contact Sales",
      popular: false,
      color: "#8b5cf6"
    }
  ];

  const handleGetStarted = () => {
    setShowConfetti(true);
    setTimeout(() => {
      navigate(auth.isAuthenticated ? '/dashboard' : '/auth');
    }, 500);
  };

  const homeStyles = `
    .home-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
      color: white;
      overflow-x: hidden;
      position: relative;
    }
    
    /* Background effects */
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
    
    /* Hero section */
    .hero-section {
      position: relative;
      padding: 120px 20px 80px;
      max-width: 1200px;
      margin: 0 auto;
      z-index: 2;
    }
    
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.2);
      border-radius: 100px;
      margin-bottom: 32px;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    .hero-title {
      font-size: 72px;
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin-bottom: 24px;
      background: linear-gradient(135deg, #22c55e 0%, #3b82f6 50%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .hero-subtitle {
      font-size: 20px;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
      max-width: 600px;
      margin-bottom: 48px;
    }
    
    .hero-actions {
      display: flex;
      gap: 16px;
      margin-bottom: 80px;
      flex-wrap: wrap;
    }
    
    /* Stats grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 120px;
    }
    
    .stat-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 24px;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-4px);
      border-color: rgba(34, 197, 94, 0.3);
      background: rgba(34, 197, 94, 0.05);
    }
    
    .stat-number {
      font-size: 40px;
      font-weight: 700;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #22c55e, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .stat-label {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      font-weight: 500;
    }
    
    /* Features section */
    .features-section {
      padding: 80px 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .section-title {
      font-size: 48px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 16px;
    }
    
    .section-subtitle {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.7);
      text-align: center;
      max-width: 600px;
      margin: 0 auto 64px;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 120px;
    }
    
    .feature-card {
      position: relative;
      overflow: hidden;
    }
    
    .feature-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      font-size: 28px;
      transition: all 0.3s ease;
    }
    
    .feature-card:hover .feature-icon {
      transform: scale(1.1) rotate(5deg);
    }
    
    .feature-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    
    .feature-description {
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
      margin-bottom: 16px;
    }
    
    .feature-stats {
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.5);
    }
    
    /* Viral loop */
    .viral-loop {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1));
      border-radius: 32px;
      padding: 64px;
      margin-bottom: 120px;
      position: relative;
      overflow: hidden;
    }
    
    .viral-loop::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.05), transparent);
      animation: shine 3s infinite;
    }
    
    @keyframes shine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    .loop-steps {
      display: flex;
      justify-content: space-between;
      position: relative;
      z-index: 2;
    }
    
    .loop-step {
      text-align: center;
      flex: 1;
      position: relative;
    }
    
    .loop-step:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 40px;
      right: -50%;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, rgba(34, 197, 94, 0.3), rgba(59, 130, 246, 0.3));
      z-index: 1;
    }
    
    .step-number {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      font-size: 32px;
      font-weight: 700;
      position: relative;
      z-index: 2;
    }
    
    /* Testimonials */
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 120px;
    }
    
    .testimonial-card {
      position: relative;
    }
    
    .testimonial-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }
    
    .testimonial-avatar {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 20px;
    }
    
    .testimonial-info h4 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
    
    .testimonial-info p {
      margin: 4px 0 0;
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
    }
    
    .testimonial-streak {
      margin-left: auto;
      padding: 6px 12px;
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.2);
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
    }
    
    .testimonial-quote {
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.6;
      font-style: italic;
      margin: 0;
    }
    
    /* Pricing */
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 32px;
      margin-bottom: 120px;
    }
    
    .pricing-card {
      position: relative;
      padding: 40px;
    }
    
    .pricing-badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      padding: 8px 24px;
      background: linear-gradient(135deg, #fbbf24, #d97706);
      color: #1c1917;
      font-weight: 600;
      border-radius: 100px;
      font-size: 14px;
    }
    
    .pricing-header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .pricing-name {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .pricing-price {
      font-size: 48px;
      font-weight: 800;
      margin-bottom: 4px;
      background: linear-gradient(135deg, #22c55e, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .pricing-description {
      color: rgba(255, 255, 255, 0.6);
    }
    
    .pricing-features {
      list-style: none;
      padding: 0;
      margin: 0 0 32px;
    }
    
    .pricing-features li {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      color: rgba(255, 255, 255, 0.8);
    }
    
    /* CTA section */
    .cta-section {
      text-align: center;
      padding: 120px 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .cta-title {
      font-size: 56px;
      font-weight: 800;
      margin-bottom: 24px;
    }
    
    .cta-subtitle {
      font-size: 20px;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
      margin-bottom: 48px;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .hero-title {
        font-size: 48px;
      }
      
      .section-title {
        font-size: 36px;
      }
      
      .loop-steps {
        flex-direction: column;
        gap: 48px;
      }
      
      .loop-step:not(:last-child)::after {
        top: auto;
        bottom: -24px;
        right: 50%;
        width: 2px;
        height: 48px;
      }
    }
  `;

  return (
    <div className="home-container">
      <style>{homeStyles}</style>
      
      {showConfetti && <Confetti active={true} duration={3000} />}
      
      {/* Background effects */}
      <div className="background-grid" />
      <div className="floating-elements">
        <div className="floating-element float-1" />
        <div className="floating-element float-2" />
        <div className="floating-element float-3" />
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <Sparkles size={16} />
          <span>The Internet's Accountability Platform</span>
        </div>
        
        <h1 className="hero-title">
          Have You Touched Grass Today?
        </h1>
        
        <p className="hero-subtitle">
          A daily accountability platform that uses <strong>social proof</strong>, 
          <strong> loss aversion</strong>, and <strong>viral mechanics</strong> to build 
          real-life discipline. Turn internet memes into million-dollar habits.
        </p>
        
        <div className="hero-actions">
          <Button
            variant="primary"
            size="large"
            rightIcon={<ArrowRight />}
            onClick={handleGetStarted}
            animationType="ripple"
          >
            Start Your Streak
          </Button>
          
          {/* <Button
            variant="secondary"
            size="large"
            rightIcon={<Play />}
            onClick={() => setShowDemoModal(true)}
          >
            
          </Button> */}
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{counter.toLocaleString()}+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">312</div>
            <div className="stat-label">Longest Streak</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">94.7%</div>
            <div className="stat-label">Retention Rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">$10M+</div>
            <div className="stat-label">Projected ARR</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">The Psychology Behind The Magic</h2>
        <p className="section-subtitle">
          Four viral triggers combined into one addictive behavior engine
        </p>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <Card
              key={index}
              variant={index === activeFeature ? 'success' : 'default'}
              hoverEffect="lift"
              glow={index === activeFeature}
              className="feature-card"
            >
              <div 
                className="feature-icon"
                style={{ 
                  background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}40)`,
                  color: feature.color,
                  border: `1px solid ${feature.color}30`
                }}
              >
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-stats">{feature.stats}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Viral Loop */}
      <section className="features-section">
        <h2 className="section-title">The Viral Flywheel</h2>
        <p className="section-subtitle">
          This loop creates addicting social pressure that converts to revenue
        </p>
        
        <Card variant="glass" borderGradient glow className="viral-loop">
          <div className="loop-steps">
            {[
              { number: '🌱', title: 'Daily Check-in', desc: '"Have you touched grass?"' },
              { number: '📸', title: 'Proof or Shame', desc: 'Upload photo or accept public shame' },
              { number: '🔥', title: 'Streak Grows', desc: 'Build status & social proof' },
              { number: '📈', title: 'Monetize Loss', desc: 'Pay to restore broken streaks' }
            ].map((step, index) => (
              <div key={index} className="loop-step">
                <div 
                  className="step-number"
                  style={{
                    background: `linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.2))`,
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {step.number}
                </div>
                <h3 style={{ marginBottom: '8px' }}>{step.title}</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Testimonials */}
      <section className="features-section">
        <h2 className="section-title">Trusted by Elite Performers</h2>
        <p className="section-subtitle">
          From Silicon Valley executives to professional athletes
        </p>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <Card key={index} variant="default" hoverEffect="lift" className="testimonial-card">
              <div className="testimonial-header">
                <div 
                  className="testimonial-avatar"
                  style={{
                    background: `linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.2))`,
                    color: '#22c55e'
                  }}
                >
                  {testimonial.avatar}
                </div>
                <div className="testimonial-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
                <div className="testimonial-streak">
                  {testimonial.streak} days
                </div>
              </div>
              <p className="testimonial-quote">"{testimonial.quote}"</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="features-section">
        <h2 className="section-title">Simple, Transparent Pricing</h2>
        <p className="section-subtitle">
          Start free, upgrade as your discipline grows
        </p>
        
        <div className="pricing-grid">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index} 
              variant={plan.popular ? 'premium' : 'default'}
              hoverEffect="lift"
              glow={plan.popular}
              borderGradient={plan.popular}
              className="pricing-card"
            >
              {plan.popular && (
                <div className="pricing-badge">MOST POPULAR</div>
              )}
              
              <div className="pricing-header">
                <h3 className="pricing-name">{plan.name}</h3>
                <div className="pricing-price">{plan.price}</div>
                {plan.period && <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{plan.period}</span>}
                <p className="pricing-description">{plan.description}</p>
              </div>
              
              <ul className="pricing-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <CheckCircle size={16} color={plan.color} />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button
                variant={plan.popular ? 'premium' : 'secondary'}
                fullWidth
                size="large"
                onClick={() => plan.name === 'Enterprise' ? setShowDemoModal(true) : handleGetStarted()}
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <Card 
          variant="glass" 
          borderGradient 
          glow 
          style={{ 
            padding: '64px',
            background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.8), rgba(31, 41, 55, 0.8))'
          }}
        >
          <h2 className="cta-title">Ready to Turn Discipline into Status?</h2>
          <p className="cta-subtitle">
            Join the movement that's redefining accountability. Your future self will thank you.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              size="large"
              rightIcon={<Rocket />}
              onClick={handleGetStarted}
              animationType="ripple"
            >
              Start Free Trial
            </Button>
            
            <Button
              variant="ghost"
              size="large"
              rightIcon={<Calendar />}
              onClick={() => navigate('/leaderboard')}
            >
              View Leaderboard
            </Button>
          </div>
          
          <p style={{ marginTop: '32px', color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>
            No credit card required • 7-day streak guarantee • Cancel anytime
          </p>
        </Card>
      </section>

      {/* Demo Modal */}
      <Model
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        title="TouchGrass Platform Demo"
        size="large"
        animationType="scale"
        overlayBlur
      >
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            background: 'linear-gradient(135deg, #22c55e, #3b82f6)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 32px',
            fontSize: '48px'
          }}>
            🎥
          </div>
          <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Platform Walkthrough</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '32px' }}>
            See how TouchGrass transforms daily discipline into social status and business results.
          </p>
          
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            borderRadius: '12px', 
            padding: '24px',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Demo Video</span>
              <span style={{ color: '#22c55e', fontWeight: '600' }}>Coming Soon</span>
            </div>
            <div style={{ 
              height: '200px', 
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px'
            }}>
              ▶️
            </div>
          </div>
          
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              setShowDemoModal(false);
              handleGetStarted();
            }}
          >
            Start Your Free Trial Instead
          </Button>
        </div>
      </Model>
    </div>
  );
};

export default Home;