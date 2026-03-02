import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { brand, lightTokens, darkTokens } from '../theme/tokens';

const THEME_KEY = 'friendza_theme_mode';

const ThemeContext = createContext(null);

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

  const colors = mode === 'dark' ? darkTokens : lightTokens;

  const value = useMemo(
    () => ({
      mode,
      colors,
      brand,
      setThemeMode,
      toggleTheme,
      isThemeReady,
    }),
    [mode, isThemeReady, colors]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeMode = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used inside ThemeProvider');
  return ctx;
};