import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../lib/theme';

export default function ThemeToggle({ variant = 'pill', className = '' }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to day mode' : 'Switch to night mode';

  if (variant === 'icon') {
    return (
      <button
        type="button"
        className={`theme-toggle-icon ${className}`}
        onClick={toggle}
        aria-label={label}
        title={label}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
      <span>{isDark ? 'Day' : 'Night'}</span>
    </button>
  );
}
