import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, Switch, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useThemeMode } from '../../context/ThemeContext';
import { useAppPreferences } from '../../context/AppPreferencesContext';
import api from '../../services/api';
import style from './style';
import useT from '../../i18n/useT';
import { horizontalScale } from '../../assets/styles/scaling';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const Settings = () => {
  const { mode, colors, toggleTheme } = useThemeMode();
  const { autoPlayStories, updateAutoPlayStories, language, updateLanguage, isReady } = useAppPreferences();

  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [isLoadingPrivacy, setIsLoadingPrivacy] = useState(true);
  const [isSavingPrivacy, setIsSavingPrivacy] = useState(false);

  const { t, isRTL } = useT();

  const getLangIcon = (code) => {
    return code === 'ar' ? '🇪🇬' : '🇬🇧';
  };

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
      setIsPrivateAccount((prev) => !prev);
      console.log('Save privacy error:', e?.response?.data || e.message);
    } finally {
      setIsSavingPrivacy(false);
    }
  };

  const switchTrackColor = { false: colors.border, true: colors.primary };
  const switchThumbColor = mode === 'dark' ? colors.onPrimary : colors.onPrimary;

  if (!isReady) {
    return (
      <SafeAreaView style={[style.container, { backgroundColor: colors.background }]}>
        <View style={style.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[style.container, { backgroundColor: colors.background }]}>

      {/* Dark Mode */}
      <View
        style={[
          style.card,
          {
            backgroundColor: colors.surface2,
            borderColor: colors.border,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        <View
          style={[
            style.textWrap,
            {
              marginRight: isRTL ? 0 : horizontalScale(12),
              marginLeft: isRTL ? horizontalScale(12) : 0,
              alignItems: isRTL ? 'flex-end' : 'flex-start',
            },
          ]}
        >
          <Text style={[style.rowTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('settings.darkMode')}
          </Text>
          <Text style={[style.rowSub, { color: colors.subText, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('settings.themeHint')}
          </Text>
        </View>

        <Switch
          value={mode === 'dark'}
          onValueChange={toggleTheme}
          trackColor={switchTrackColor}
          thumbColor={switchThumbColor}
        />
      </View>

      {/* Auto-play stories */}
      <View
        style={[
          style.card,
          {
            backgroundColor: colors.surface2,
            borderColor: colors.border,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        <View
          style={[
            style.textWrap,
            {
              marginRight: isRTL ? 0 : horizontalScale(12),
              marginLeft: isRTL ? horizontalScale(12) : 0,
              alignItems: isRTL ? 'flex-end' : 'flex-start',
            },
          ]}
        >
          <Text style={[style.rowTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('settings.autoPlayStories')}
          </Text>
          <Text style={[style.rowSub, { color: colors.subText, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('settings.autoPlayHint')}
          </Text>
        </View>

        <Switch
          value={autoPlayStories}
          onValueChange={updateAutoPlayStories}
          trackColor={switchTrackColor}
          thumbColor={switchThumbColor}
        />
      </View>

      {/* Language */}
      <View style={[style.cardColumn, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
        <Text style={[style.rowTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
          {t('settings.language')}
        </Text>
        <Text style={[style.rowSub, { color: colors.subText, textAlign: isRTL ? 'right' : 'left' }]}>
          {t('settings.languageHint')}
        </Text>

        <View style={[style.langRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity
            style={[
              style.langBtn,
              {
                borderColor: language === 'en' ? colors.primary : colors.border,
                backgroundColor: language === 'en' ? colors.surface1 : colors.background,
              },
            ]}
            onPress={() => updateLanguage('en')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 16 }}>{getLangIcon('en')}</Text>
              <Text style={{ color: language === 'en' ? colors.primary : colors.text }}>
                {t('settings.english')}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              style.langBtn,
              {
                borderColor: language === 'ar' ? colors.primary : colors.border,
                backgroundColor: language === 'ar' ? colors.surface1 : colors.background,
              },
            ]}
            onPress={() => updateLanguage('ar')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 16 }}>{getLangIcon('ar')}</Text>
              <Text style={{ color: language === 'ar' ? colors.primary : colors.text }}>
                {t('settings.arabic')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Privacy */}
      <View
        style={[
          style.card,
          {
            backgroundColor: colors.surface2,
            borderColor: colors.border,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        <View
          style={[
            style.textWrap,
            {
              marginRight: isRTL ? 0 : horizontalScale(12),
              marginLeft: isRTL ? horizontalScale(12) : 0,
              alignItems: isRTL ? 'flex-end' : 'flex-start',
            },
          ]}
        >
          <Text style={[style.rowTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('settings.privacy')}
          </Text>
          <Text style={[style.rowSub, { color: colors.subText, textAlign: isRTL ? 'right' : 'left' }]}>
            {t('settings.privacyHint')}
          </Text>
        </View>

        {isLoadingPrivacy ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Switch
            value={isPrivateAccount}
            onValueChange={onTogglePrivacy}
            disabled={isSavingPrivacy}
            trackColor={switchTrackColor}
            thumbColor={switchThumbColor}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Settings;