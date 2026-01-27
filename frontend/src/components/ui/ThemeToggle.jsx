import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

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
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        color: theme === 'dark' ? '#ffffff' : '#000000'
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      }}
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;
