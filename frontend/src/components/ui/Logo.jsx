import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Globe } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Logo = ({
  size = 'default',
  showSubtitle = true,
  className = '',
  linkTo = '/',
  onClick
}) => {
  const { theme } = useTheme();

  const sizeClasses = {
    small: {
      container: 'gap-2',
      icon: 'w-8 h-8',
      text: 'text-lg',
      subtitle: 'text-xs'
    },
    default: {
      container: 'gap-3',
      icon: 'w-11 h-11',
      text: 'text-xl',
      subtitle: 'text-xs'
    },
    large: {
      container: 'gap-4',
      icon: 'w-14 h-14',
      text: 'text-3xl',
      subtitle: 'text-sm'
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.default;

  const logoContent = (
    <div className={`flex items-center ${currentSize.container} ${className}`}>
      {/* Logo Icon */}
      <div className="relative">
        <span className="text-2xl">🌱</span>
      </div>

      {/* Logo Text */}
      <div>
        <div className={`${currentSize.text} font-black tracking-tight leading-none text-white`}>
          Touch<span style={{color: '#00E5FF'}}>Grass</span>
        </div>
        {showSubtitle && (
          <div className={`${currentSize.subtitle} ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          } flex items-center gap-1 leading-none`}>
            <Globe size={10} />
            The internet's accountability platform
          </div>
        )}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="focus:outline-none">
        {logoContent}
      </button>
    );
  }

  if (linkTo) {
    return (
      <Link to={linkTo} className="focus:outline-none">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

export default Logo;
