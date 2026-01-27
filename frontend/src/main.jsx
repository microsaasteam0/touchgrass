import React from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from './contexts/ThemeContext';
import App from './App';
import './styles/themes.css';
// import './global.css';

// Initialize theme before render
const savedTheme = localStorage.getItem('theme') || 'dark';
document.body.className = `theme-${savedTheme}`;

// Global error handling
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Global promise rejection handling
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Offline/online detection
window.addEventListener('online', () => {
  document.documentElement.classList.remove('offline');
  console.log('Application is online');
});

window.addEventListener('offline', () => {
  document.documentElement.classList.add('offline');
  console.warn('Application is offline');
});

// Create root and render
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <RecoilRoot>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </RecoilRoot>
  </React.StrictMode>
);
