import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'friendza_theme_mode';

const ThemeContext = createContext(null);

const palettes = {
  light: {
    mode: 'light',
    background: '#FFFFFF',
    card: '#F8FAFC',
    text: '#111827',
    subText: '#64748B',
    border: '#E2E8F0',
    primary: '#0150EC',
    primarySoft: '#EFF6FF',
    danger: '#EF4444',
  },
  dark: {
    mode: 'dark',
    background: '#0F172A',
    card: '#1E293B',
    text: '#F8FAFC',
    subText: '#CBD5E1',
    border: '#334155',
    primary: '#60A5FA',
    primarySoft: '#1E3A8A',
    danger: '#F87171',
  },
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');
  const [isThemeReady, setIsThemeReady] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_KEY);
        if (stored === 'light' || stored === 'dark') {
          setMode(stored);
        }
      } finally {
        setIsThemeReady(true);
      }
    };
    bootstrap();
  }, []);

  const setThemeMode = async (nextMode) => {
    setMode(nextMode);
    await AsyncStorage.setItem(THEME_KEY, nextMode);
  };

  const toggleTheme = async () => {
    const next = mode === 'light' ? 'dark' : 'light';
    await setThemeMode(next);
  };

  const value = useMemo(
    () => ({
      mode,
      colors: palettes[mode],
      setThemeMode,
      toggleTheme,
      isThemeReady,
    }),
    [mode, isThemeReady]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeMode = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used inside ThemeProvider');
  return ctx;
};