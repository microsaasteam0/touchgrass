import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: isDark ? '#ffffff' : '#000000',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        color: isDark ? '#000000' : '#ffffff',
        boxShadow: isDark ? '0 2px 8px rgba(255, 255, 255, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.2)'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.1)';
        e.target.style.boxShadow = isDark ? '0 4px 12px rgba(255, 255, 255, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = isDark ? '0 2px 8px rgba(255, 255, 255, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.2)';
      }}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;
