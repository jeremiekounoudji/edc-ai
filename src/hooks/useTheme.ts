import { useState, useEffect, useCallback } from 'react';
import { ThemeState } from '../lib/types/user';

const initialState: ThemeState = {
  currentTheme: 'light',
  isSystemTheme: false,
};

export function useTheme() {
  const [state, setState] = useState<ThemeState>(initialState);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || savedTheme === 'light') {
      setState({
        currentTheme: savedTheme,
        isSystemTheme: false,
      });
      applyTheme(savedTheme);
    } else {
      const systemTheme = systemPrefersDark ? 'dark' : 'light';
      setState({
        currentTheme: systemTheme,
        isSystemTheme: true,
      });
      applyTheme(systemTheme);
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (state.isSystemTheme) {
        const newTheme = e.matches ? 'dark' : 'light';
        setState(prev => ({ ...prev, currentTheme: newTheme }));
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [state.isSystemTheme]);

  // Apply theme to document
  const applyTheme = useCallback((theme: 'light' | 'dark') => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    const newTheme = state.currentTheme === 'light' ? 'dark' : 'light';
    
    setState({
      currentTheme: newTheme,
      isSystemTheme: false,
    });
    
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  }, [state.currentTheme, applyTheme]);

  // Set specific theme
  const setTheme = useCallback((theme: 'light' | 'dark') => {
    setState({
      currentTheme: theme,
      isSystemTheme: false,
    });
    
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  }, [applyTheme]);

  // Use system theme
  const useSystemTheme = useCallback(() => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = systemPrefersDark ? 'dark' : 'light';
    
    setState({
      currentTheme: systemTheme,
      isSystemTheme: true,
    });
    
    localStorage.removeItem('theme');
    applyTheme(systemTheme);
  }, [applyTheme]);

  // Get theme icon
  const getThemeIcon = useCallback(() => {
    if (state.isSystemTheme) {
      return '🌓'; // System theme icon
    }
    return state.currentTheme === 'dark' ? '🌙' : '☀️';
  }, [state.currentTheme, state.isSystemTheme]);

  // Get theme label
  const getThemeLabel = useCallback(() => {
    if (state.isSystemTheme) {
      return 'System';
    }
    return state.currentTheme === 'dark' ? 'Dark' : 'Light';
  }, [state.currentTheme, state.isSystemTheme]);

  return {
    ...state,
    toggleTheme,
    setTheme,
    useSystemTheme,
    getThemeIcon,
    getThemeLabel,
  };
}
