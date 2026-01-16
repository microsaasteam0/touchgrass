import React, { useState } from 'react';
import { Share2, Twitter, Linkedin, Facebook, Instagram, MessageSquare, Link as LinkIcon, X } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Model';
import Toast from '../ui/Toast';

const SocialShareButton = ({ streakData, user }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const shareToPlatform = async (platform) => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/share/${streakData?.currentStreak || 42}`;
    
    const shareTexts = {
      twitter: `🔥 Day ${streakData?.currentStreak || 42} of my #TouchGrass streak! Building real-world discipline every day. Join me: ${shareUrl} #Accountability #Streak`,
      linkedin: `${user?.displayName || 'User'} has maintained a ${streakData?.currentStreak || 42}-day outdoor streak on TouchGrass. Building professional discipline through daily habits. Check it out: ${shareUrl} #ProfessionalGrowth #Wellness`,
      facebook: `I've touched grass for ${streakData?.currentStreak || 42} days in a row! Join me in building better habits: ${shareUrl}`,
      whatsapp: `Check out my ${streakData?.currentStreak || 42}-day TouchGrass streak! ${shareUrl}`,
      generic: `My ${streakData?.currentStreak || 42}-day TouchGrass streak! ${shareUrl}`
    };

    const shareConfigs = {
      twitter: {
        url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTexts.twitter)}`,
        name: 'Twitter/X'
      },
      linkedin: {
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        name: 'LinkedIn'
      },
      facebook: {
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTexts.facebook)}`,
        name: 'Facebook'
      },
      whatsapp: {
        url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTexts.whatsapp)}`,
        name: 'WhatsApp'
      },
      instagram: {
        name: 'Instagram',
        isApp: true
      },
      copy: {
        name: 'Copy Link',
        action: async () => {
          await navigator.clipboard.writeText(shareUrl);
          addToast('Link copied to clipboard!', 'success');
        }
      }
    };

    const config = shareConfigs[platform];
    if (!config) return;

    if (config.action) {
      await config.action();
      return;
    }

    if (config.isApp) {
      addToast(`Open Instagram app to share your ${streakData?.currentStreak || 42}-day streak`, 'info');
      return;
    }

    window.open(config.url, '_blank', 'width=600,height=400');
    addToast(`Shared to ${config.name}!`, 'success');
  };

  const platforms = [
    { id: 'twitter', icon: <Twitter />, label: 'Twitter/X', color: '#1DA1F2' },
    { id: 'linkedin', icon: <Linkedin />, label: 'LinkedIn', color: '#0077B5' },
    { id: 'facebook', icon: <Facebook />, label: 'Facebook', color: '#1877F2' },
    { id: 'instagram', icon: <Instagram />, label: 'Instagram', color: '#E4405F' },
    { id: 'whatsapp', icon: <MessageSquare />, label: 'WhatsApp', color: '#25D366' },
    { id: 'copy', icon: <LinkIcon />, label: 'Copy Link', color: '#8B5CF6' },
  ];

  return (
    <>
      <Button
        variant="secondary"
        leftIcon={<Share2 />}
        onClick={() => setShowShareModal(true)}
      >
        Share Achievement
      </Button>

      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Your Achievement"
        size="lg"
      >
        <div style={{ padding: '32px' }}>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '32px',
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))',
            borderRadius: '16px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
            <h3 style={{ margin: '0 0 8px', fontSize: '24px' }}>
              Day {streakData?.currentStreak || 42} Streak!
            </h3>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)' }}>
              Share your discipline journey with the world
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => shareToPlatform(platform.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `rgba(${parseInt(platform.color.slice(1, 3), 16)}, ${parseInt(platform.color.slice(3, 5), 16)}, ${parseInt(platform.color.slice(5, 7), 16)}, 0.1)`;
                  e.currentTarget.style.borderColor = `${platform.color}40`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ 
                  width: '48px', 
                  height: '48px',
                  background: `${platform.color}20`,
                  border: `1px solid ${platform.color}40`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  {platform.icon}
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {platform.label}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                    Share to {platform.label}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div style={{ 
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              marginBottom: '8px'
            }}>
              <div style={{ color: '#3b82f6' }}>💡</div>
              <div style={{ fontWeight: '600' }}>Pro Tip</div>
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
              Each share increases your social credibility and helps build the TouchGrass community!
            </div>
          </div>
        </div>
      </Modal>

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
          <div key={toast.id} style={{
            background: toast.type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(59, 130, 246, 0.9)',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '300px',
            animation: 'toastSlideIn 0.3s ease-out'
          }}>
            {toast.type === 'success' ? '✅' : 'ℹ️'}
            <div>{toast.message}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SocialShareButton;