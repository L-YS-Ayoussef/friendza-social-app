import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DevSettings, I18nManager } from 'react-native';

const PREFS_KEY = 'friendza_app_prefs_v1';

const AppPreferencesContext = createContext(null);

export const AppPreferencesProvider = ({ children }) => {
  const [autoPlayStories, setAutoPlayStories] = useState(true);
  const [language, setLanguage] = useState('en');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const raw = await AsyncStorage.getItem(PREFS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (typeof parsed.autoPlayStories === 'boolean') setAutoPlayStories(parsed.autoPlayStories);
          if (parsed.language === 'en' || parsed.language === 'ar'){
            setLanguage(parsed.language);
            applyRTL(parsed.language);
          }
        }
      } catch (e) {
        console.log('Prefs load error:', e?.message);
      } finally {
        setIsReady(true);
      }
    };

    loadPrefs();
  }, []);

  const persist = async (next) => {
    try {
      await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(next));
    } catch (e) {
      console.log('Prefs save error:', e?.message);
    }
  };

  const updateAutoPlayStories = async (value) => {
    setAutoPlayStories(value);
    await persist({ autoPlayStories: value, language });
  };

  const updateLanguage = async (value) => {
    setLanguage(value);
    applyRTL(value);
    await persist({ autoPlayStories, language: value });
  };

  const value = useMemo(
    () => ({
      autoPlayStories,
      updateAutoPlayStories,
      language,
      updateLanguage,
      isReady,
    }),
    [autoPlayStories, language, isReady]
  );

  const applyRTL = (lang) => {
    const shouldRTL = lang === 'ar';
    I18nManager.allowRTL(true);

    if (I18nManager.isRTL !== shouldRTL) {
      I18nManager.forceRTL(shouldRTL);
      DevSettings.reload(); // applies RTL immediately in dev
    }
  };

  return (
    <AppPreferencesContext.Provider value={value}>
      {children}
    </AppPreferencesContext.Provider>
  );
};

export const useAppPreferences = () => {
  const ctx = useContext(AppPreferencesContext);
  if (!ctx) throw new Error('useAppPreferences must be used inside AppPreferencesProvider');
  return ctx;
};