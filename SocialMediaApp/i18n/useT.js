// ui/i18n/useT.js
import { useCallback } from 'react';
import { useAppPreferences } from '../context/AppPreferencesContext';
import { t as translate } from './t';

export default function useT() {
  const { language } = useAppPreferences();
  const isRTL = (language || 'en') === 'ar';
  const t = useCallback((key, params) => translate(language || 'en', key, params), [language]);

  return { t, language: language || 'en', isRTL };
}