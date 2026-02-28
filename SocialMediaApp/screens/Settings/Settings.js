import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, Switch, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useThemeMode } from '../../context/ThemeContext';
import { useAppPreferences } from '../../context/AppPreferencesContext';
import api from '../../services/api';
import style from './style';
import useT from '../../i18n/useT';

const Settings = () => {
  const { mode, colors, toggleTheme } = useThemeMode();
  const { autoPlayStories, updateAutoPlayStories, language, updateLanguage, isReady } = useAppPreferences();

  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [isLoadingPrivacy, setIsLoadingPrivacy] = useState(true);
  const [isSavingPrivacy, setIsSavingPrivacy] = useState(false);
  const { t } = useT();
  
  useEffect(() => {
    const loadPrivacy = async () => {
      try {
        setIsLoadingPrivacy(true);
        const res = await api.get('/users/me/profile');
        setIsPrivateAccount(!!res.data?.user?.isPrivate);
      } catch (e) {
        console.log('Load privacy error:', e?.response?.data || e.message);
      } finally {
        setIsLoadingPrivacy(false);
      }
    };

    loadPrivacy();
  }, []);

  const onTogglePrivacy = async (value) => {
    try {
      setIsSavingPrivacy(true);
      setIsPrivateAccount(value);

      await api.put('/users/me/privacy', { isPrivate: value });
    } catch (e) {
      // rollback on failure
      setIsPrivateAccount((prev) => !prev);
      console.log('Save privacy error:', e?.response?.data || e.message);
    } finally {
      setIsSavingPrivacy(false);
    }
  };

  if (!isReady) {
    return (
      <SafeAreaView style={[style.container, { backgroundColor: colors.background }]}>
        <View style={style.centered}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[style.container, { backgroundColor: colors.background }]}>
      <Text style={[style.title, { color: colors.text }]}>{t('settings.title')}</Text>

      {/* Dark Mode */}
      <View style={[style.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={style.textWrap}>
          <Text style={[style.rowTitle, { color: colors.text }]}>{t('settings.darkMode')}</Text>
          <Text style={[style.rowSub, { color: colors.subText }]}>{t('settings.themeHint')}</Text>
        </View>
        <Switch value={mode === 'dark'} onValueChange={toggleTheme} />
      </View>

      {/* Auto-play stories */}
      <View style={[style.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={style.textWrap}>
          <Text style={[style.rowTitle, { color: colors.text }]}>{t('settings.autoPlayStories')}</Text>
          <Text style={[style.rowSub, { color: colors.subText }]}>
            {t('settings.autoPlayHint')}
          </Text>
        </View>
        <Switch value={autoPlayStories} onValueChange={updateAutoPlayStories} />
      </View>

      {/* Language (UI only for now) */}
      <View style={[style.cardColumn, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[style.rowTitle, { color: colors.text }]}>{t('settings.language')}</Text>
        <Text style={[style.rowSub, { color: colors.subText }]}>{t('settings.languageHint')}</Text>

        <View style={style.langRow}>
          <TouchableOpacity
            style={[
              style.langBtn,
              {
                borderColor: colors.border,
                backgroundColor: language === 'en' ? colors.primarySoft : colors.background,
              },
            ]}
            onPress={() => updateLanguage('en')}
          >
            <Text style={{ color: language === 'en' ? colors.primary : colors.text }}>{t('settings.english')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              style.langBtn,
              {
                borderColor: colors.border,
                backgroundColor: language === 'ar' ? colors.primarySoft : colors.background,
              },
            ]}
            onPress={() => updateLanguage('ar')}
          >
            <Text style={{ color: language === 'ar' ? colors.primary : colors.text }}>{t('settings.arabic')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Privacy */}
      <View style={[style.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={style.textWrap}>
          <Text style={[style.rowTitle, { color: colors.text }]}>{t('settings.privacy')}</Text>
          <Text style={[style.rowSub, { color: colors.subText }]}>
            {t('settings.privacyHint')}
          </Text>
        </View>

        {isLoadingPrivacy ? (
          <ActivityIndicator />
        ) : (
          <Switch
            value={isPrivateAccount}
            onValueChange={onTogglePrivacy}
            disabled={isSavingPrivacy}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Settings;