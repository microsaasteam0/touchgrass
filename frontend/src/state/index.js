import React from 'react';
  
  
  import React from 'react';
import { RecoilRoot } from 'recoil';

// Export all states
export * from './auth';
export * from './chat';
export * from './streaks';
export * from './notifications';

// Recoil State Initializer
export const StateProvider = ({ children }) => {
  return (
    <RecoilRoot>
      {children}
    </RecoilRoot>
  );
};

// Combined State Hook
export const useAppState = () => {
  const auth = useAuth();
  const chat = useChat();
  const streak = useStreak();
  const notifications = useNotifications();

  return {
    auth,
    chat,
    streak,
    notifications
  };
};

// State Persistence
export const persistState = () => {
  const state = {
    auth: JSON.parse(localStorage.getItem('touchgrass_auth') || '{}'),
    chat: JSON.parse(localStorage.getItem('touchgrass_chat') || '{}'),
    streak: JSON.parse(localStorage.getItem('touchgrass_streak') || '{}'),
    notifications: JSON.parse(localStorage.getItem('touchgrass_notifications') || '{}')
  };

  return state;
};

export const restoreState = (state) => {
  if (state.auth) {
    localStorage.setItem('touchgrass_auth', JSON.stringify(state.auth));
  }
  if (state.chat) {
    localStorage.setItem('touchgrass_chat', JSON.stringify(state.chat));
  }
  if (state.streak) {
    localStorage.setItem('touchgrass_streak', JSON.stringify(state.streak));
  }
  if (state.notifications) {
    localStorage.setItem('touchgrass_notifications', JSON.stringify(state.notifications));
  }
};

// State Reset
export const resetState = () => {
  localStorage.removeItem('touchgrass_auth');
  localStorage.removeItem('touchgrass_chat');
  localStorage.removeItem('touchgrass_streak');
  localStorage.removeItem('touchgrass_notifications');
  localStorage.removeItem('token');
};

// State Sync (for multi-tab support)
export const setupStateSync = () => {
  const handleStorageChange = (e) => {
    if (e.key?.startsWith('touchgrass_')) {
      // Dispatch custom event for other tabs
      window.dispatchEvent(new CustomEvent('stateChange', {
        detail: { key: e.key, value: e.newValue }
      }));
    }
  };

  window.addEventListener('storage', handleStorageChange);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};

// State Validation
export const validateState = () => {
  const requiredKeys = ['auth', 'chat', 'streak', 'notifications'];
  const state = persistState();
  
  const missingKeys = requiredKeys.filter(key => 
    !state[key] || Object.keys(state[key]).length === 0
  );

  return {
    isValid: missingKeys.length === 0,
    missingKeys,
    state
  };
};

// State Migration (for version updates)
export const migrateState = (fromVersion, toVersion) => {
  const migrations = {
    '1.0.0': () => {
      // Migration logic for version 1.0.0
      const oldState = persistState();
      
      // Add new fields or restructure
      const newState = {
        ...oldState,
        auth: {
          ...oldState.auth,
          sessionExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      };

      restoreState(newState);
    },
    '1.1.0': () => {
      // Migration logic for version 1.1.0
      const oldState = persistState();
      
      const newState = {
        ...oldState,
        streak: {
          ...oldState.streak,
          stats: {
            totalOutdoorTime: 0,
            averageDuration: 0,
            bestDay: null,
            currentRank: null,
            percentile: null
          }
        }
      };

      restoreState(newState);
    }
  };

  // Apply migrations in order
  const versions = Object.keys(migrations).sort();
  const startIndex = versions.indexOf(fromVersion);
  const endIndex = versions.indexOf(toVersion);

  if (startIndex === -1 || endIndex === -1) {
    console.error('Invalid version for migration');
    return;
  }

  for (let i = startIndex; i <= endIndex; i++) {
    const version = versions[i];
    if (migrations[version]) {
      migrations[version]();
    }
  }
};

// State Debug Utilities
export const debugState = {
  log: () => {
    const state = persistState();
    console.group('TouchGrass State');
    console.log('Auth:', state.auth);
    console.log('Chat:', state.chat);
    console.log('Streak:', state.streak);
    console.log('Notifications:', state.notifications);
    console.groupEnd();
  },

  export: () => {
    const state = persistState();
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `touchgrass-state-${new Date().toISOString()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  },

  import: (jsonData) => {
    try {
      const state = JSON.parse(jsonData);
      restoreState(state);
      window.location.reload();
    } catch (error) {
      console.error('Failed to import state:', error);
    }
  }
};

// State Performance Monitoring
export const monitorState = () => {
  const metrics = {
    authUpdates: 0,
    chatUpdates: 0,
    streakUpdates: 0,
    notificationUpdates: 0,
    lastUpdate: null
  };

  const startMonitoring = () => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('Recoil')) {
          console.log('Recoil state update:', entry);
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });
  };

  return {
    metrics,
    startMonitoring
  };
};

// Export everything
export default {
  StateProvider,
  useAppState,
  persistState,
  restoreState,
  resetState,
  setupStateSync,
  validateState,
  migrateState,
  debugState,
  monitorState
};