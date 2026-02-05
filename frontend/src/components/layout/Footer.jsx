import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Twitter, Linkedin, Instagram, Github,
  Heart, Shield, Globe, ArrowUp,
  Mail, MessageSquare, Zap, Sparkles,
  ExternalLink, TrendingUp, Users, Award
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail('');
    }
  };

  const stats = [
    { value: '124,857', label: 'Active Users', icon: <Users style={{ width: '16px', height: '16px' }} /> },
    { value: '312', label: 'Longest Streak', icon: <TrendingUp style={{ width: '16px', height: '16px' }} /> },
    { value: '94.7%', label: 'Retention', icon: <Award style={{ width: '16px', height: '16px' }} /> },
    { value: '$10M+', label: 'Projected ARR', icon: <Sparkles style={{ width: '16px', height: '16px' }} /> }
  ];

  const footerLinks = {
    // Product: [
    //   { label: 'Features', path: '/features' },
    //   { label: 'Pricing', path: '/pricing' },
    //   { label: 'Status', path: '/status' }
    // ],
    // Company: [
    //   { label: 'About', path: '/about' },
    //   { label: 'Press', path: '/press' },
    //   { label: 'Brand', path: '/brand' }
    // ],
    // Legal: [
    //   { label: 'Privacy', path: '/privacy' },
    //   { label: 'Terms', path: '/terms' },
    //   { label: 'Security', path: '/security' },
    // ],
    // Support: [
    //   { label: 'Help Center', path: '/help' },
    //   { label: 'Community', path: '/community' },
    //   { label: 'Contact', path: '/contact' },
    // ]
  };

  const socialLinks = [
    { icon: <Twitter style={{ width: '20px', height: '20px' }} />, label: 'Twitter', url: 'https://twitter.com/touchgrass' },
    { icon: <Linkedin style={{ width: '20px', height: '20px' }} />, label: 'LinkedIn', url: 'https://linkedin.com/company/touchgrass' },
    { icon: <Instagram style={{ width: '20px', height: '20px' }} />, label: 'Instagram', url: 'https://instagram.com/touchgrass' },
    { icon: <Github style={{ width: '20px', height: '20px' }} />, label: 'GitHub', url: 'https://github.com/touchgrass' }
  ];

  // CSS Styles integrated directly
  const styles = {
    footer: {
      position: 'relative',
      background: 'linear-gradient(to bottom, #111827, #1f2937)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      paddingTop: '4rem',
      overflow: 'hidden'
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1rem'
    },
    topSection: {
      display: 'grid',
      gap: '3rem',
      marginBottom: '4rem'
    },
    brandSection: {
      display: 'flex',
      flexDirection: 'column'
    },
    brandLogo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1.5rem'
    },
    logoIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    logoText: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(90deg, #22c55e, #ffffff, #86efac)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    logoSubtext: {
      fontSize: '0.875rem',
      color: '#9ca3af'
    },
    brandDescription: {
      color: '#9ca3af',
      marginBottom: '1.5rem',
      lineHeight: '1.6'
    },
    socialLinks: {
      display: 'flex',
      gap: '0.75rem',
      marginBottom: '1.5rem'
    },
    socialButton: {
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      cursor: 'pointer'
    },
    trustBadges: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    },
    trustBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      color: '#9ca3af'
    },
    linksGrid: {
      display: 'grid',
      gap: '2rem'
    },
    linksColumn: {
      display: 'flex',
      flexDirection: 'column'
    },
    columnTitle: {
      fontSize: '1rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    linksList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    linkItem: {
      textDecoration: 'none',
      color: '#9ca3af',
      fontSize: '0.875rem',
      transition: 'color 0.3s ease'
    },
    statsSection: {
      marginBottom: '4rem'
    },
    statsGrid: {
      display: 'grid',
      gap: '1rem'
    },
    statCard: {
      padding: '1.25rem',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), transparent)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      transition: 'all 0.3s ease'
    },
    statHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '0.5rem'
    },
    statIcon: {
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      background: 'rgba(34, 197, 94, 0.1)',
      border: '1px solid rgba(34, 197, 94, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#22c55e'
    },
    statValue: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: 'white'
    },
    statLabel: {
      fontSize: '0.75rem',
      color: '#9ca3af'
    },
    newsletterSection: {
      marginBottom: '4rem',
      padding: '2rem',
      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05), transparent)',
      border: '1px solid rgba(34, 197, 94, 0.1)',
      borderRadius: '16px'
    },
    newsletterHeader: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    newsletterIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      background: 'rgba(34, 197, 94, 0.1)',
      border: '1px solid rgba(34, 197, 94, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem auto',
      color: '#22c55e'
    },
    newsletterTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      color: 'white'
    },
    newsletterDescription: {
      color: '#9ca3af',
      fontSize: '0.875rem',
      maxWidth: '36rem',
      margin: '0 auto'
    },
    newsletterForm: {
      maxWidth: '28rem',
      margin: '0 auto'
    },
    formGroup: {
      display: 'flex',
      gap: '0.75rem',
      marginBottom: '1rem'
    },
    formInput: {
      flex: 1,
      padding: '0.875rem 1.25rem',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '10px',
      fontSize: '0.875rem',
      color: 'white',
      outline: 'none',
      transition: 'border-color 0.3s ease'
    },
    formButton: {
      padding: '0.875rem 1.5rem',
      background: 'linear-gradient(90deg, #22c55e, #16a34a)',
      border: 'none',
      borderRadius: '10px',
      fontWeight: 'bold',
      fontSize: '0.875rem',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    successMessage: {
      padding: '0.75rem',
      background: 'rgba(34, 197, 94, 0.1)',
      border: '1px solid rgba(34, 197, 94, 0.2)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#22c55e',
      marginBottom: '1rem',
      fontSize: '0.875rem'
    },
    formNote: {
      fontSize: '0.75rem',
      color: '#6b7280',
      textAlign: 'center'
    },
    bottomBar: {
      padding: '2rem 0',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    },
    bottomContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1.5rem'
    },
    copyright: {
      color: '#9ca3af',
      fontSize: '0.875rem'
    },
    bottomControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    controlItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      color: '#9ca3af',
      textDecoration: 'none',
      transition: 'color 0.3s ease'
    },
    backToTop: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      color: '#9ca3af',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'color 0.3s ease'
    },
    madeWithLove: {
      marginTop: '2rem',
      textAlign: 'center'
    },
    loveText: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    heartIcon: {
      width: '16px',
      height: '16px',
      color: '#ef4444'
    }
  };

  // Get screen width for responsive design
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768;

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Top Section - Brand & Links */}
        <div style={{
          ...styles.topSection,
          gridTemplateColumns: isDesktop ? '2fr 1fr 1fr 1fr 1fr' : '1fr',
          ...(isTablet && !isDesktop && {
            gridTemplateColumns: 'repeat(2, 1fr)'
          })
        }}>
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={styles.brandSection}
          >
            <Logo size="small" showSubtitle={true} />
            
            <p style={styles.brandDescription}>
              Building discipline through behavioral psychology. 
              Join 124,857+ users transforming habits into status.
            </p>
            
            {/* Social Links */}
            <div style={styles.socialLinks}>
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  style={styles.socialButton}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.firstChild.style.color = '#22c55e';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.firstChild.style.color = '#9ca3af';
                  }}
                >
                  <div style={{ color: '#9ca3af', transition: 'color 0.3s ease' }}>
                    {social.icon}
                  </div>
                </motion.a>
              ))}
            </div>


            {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={styles.statsSection}
        >
          <div style={{
            ...styles.statsGrid,
            gridTemplateColumns: isTablet ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)'
          }}>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                style={styles.statCard}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px)';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <div style={styles.statHeader}>
                  <div style={styles.statIcon}>
                    {stat.icon}
                  </div>
                  <div style={styles.statValue}>{stat.value}</div>
                </div>
                <div style={styles.statLabel}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

            {/* Trust Badges */}
            <div style={styles.trustBadges}>
              <div style={styles.trustBadge}>
                <Shield style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
                <span>GDPR & CCPA Compliant</span>
              </div>
              <div style={styles.trustBadge}>
                <Globe style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
                <span>Available in 150+ countries</span>
              </div>
            </div>
          </motion.div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={styles.linksColumn}
            >
              <h3 style={styles.columnTitle}>
                {category}
              </h3>
              <ul style={styles.linksList}>
                {links.map((link) => (
                  <motion.li
                    key={link.label}
                    whileHover={{ x: 4 }}
                    style={{ listStyle: 'none' }}
                  >
                    <Link
                      to={link.path}
                      style={styles.linkItem}
                      onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                      onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={styles.newsletterSection}
        >
          <div style={styles.newsletterHeader}>
            <div style={styles.newsletterIcon}>
              <Mail style={{ width: '24px', height: '24px' }} />
            </div>
            
            <h3 style={styles.newsletterTitle}>
              Stay Updated on the Discipline Revolution
            </h3>
            
            <p style={styles.newsletterDescription}>
              Join 42,000+ executives, founders, and high-performers 
              receiving weekly insights on behavioral psychology and productivity.
            </p>
          </div>
          
          <form onSubmit={handleSubscribe} style={styles.newsletterForm}>
            <div style={styles.formGroup}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={styles.formInput}
                onFocus={(e) => e.target.style.borderColor = 'rgba(34, 197, 94, 0.5)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                required
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                style={styles.formButton}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(90deg, #16a34a, #15803d)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(90deg, #22c55e, #16a34a)';
                }}
              >
                <Zap style={{ width: '16px', height: '16px' }} />
                Subscribe
              </motion.button>
            </div>
            
            {isSubscribed && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={styles.successMessage}
              >
                <Sparkles style={{ width: '16px', height: '16px' }} />
                <span>Welcome to the discipline revolution! Check your email.</span>
              </motion.div>
            )}
            
            <p style={styles.formNote}>
              By subscribing, you agree to our Privacy Policy. No spam, ever.
            </p>
          </form>
        </motion.div>

        {/* Bottom Bar */}
        <div style={styles.bottomBar}>
          <div style={{
            ...styles.bottomContent,
            ...(isTablet && {
              flexDirection: 'row'
            })
          }}>
            
            <div style={styles.bottomControls}>
              <div style={styles.controlItem}>
                <MessageSquare style={{ width: '16px', height: '16px' }} />
                
              </div>
              
              <div style={styles.controlItem}>
                <span>$ USD</span>
              </div>
              
              <motion.button
                whileHover={{ y: -2 }}
                onClick={scrollToTop}
                style={styles.backToTop}
                onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
              >
                Back to top
                <ArrowUp style={{ width: '16px', height: '16px' }} />
              </motion.button>
            </div>
          </div>
          
          {/* Made with love */}
          <div style={styles.madeWithLove}>
            <div style={styles.loveText}>
              by the discipline revolution
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

