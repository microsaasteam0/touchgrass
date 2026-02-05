import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const WelcomePopup = () => {
  const { user, isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if user has seen welcome popup
      const hasSeenWelcome = localStorage.getItem(`touchgrass_welcome_seen_${user.id}`);

      if (!hasSeenWelcome) {
        // Show welcome toast after a short delay
        const showTimer = setTimeout(() => {
          setIsVisible(true);
        }, 3000); // Show after 3 seconds

        // Auto-hide after 4 seconds
        const hideTimer = setTimeout(() => {
          setIsVisible(false);
          // Mark as seen
          localStorage.setItem(`touchgrass_welcome_seen_${user.id}`, 'true');
        }, 7000); // Hide after 7 seconds total

        return () => {
          clearTimeout(showTimer);
          clearTimeout(hideTimer);
        };
      }
    }
  }, [isAuthenticated, user]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-20 right-6 z-30 max-w-xs"
      >
        <div className="bg-green-500/95 backdrop-blur-sm border border-green-400/30 rounded-lg shadow-lg p-3 relative overflow-hidden">
          {/* Content */}
          <div className="flex items-center gap-2">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="p-1.5 rounded-md bg-white/20">
                <Sparkles size={14} className="text-white" />
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium leading-tight">
                Welcome to TouchGrass! 🌱
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomePopup;
