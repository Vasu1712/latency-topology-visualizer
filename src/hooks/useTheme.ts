'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export const useTheme = () => {
  const { theme, toggleTheme } = useStore();

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme && savedTheme !== theme) {
      toggleTheme();
    } else if (!savedTheme) {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark && theme === 'light') {
        toggleTheme();
      }
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  };
};
