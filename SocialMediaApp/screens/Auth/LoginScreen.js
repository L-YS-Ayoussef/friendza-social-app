import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Image 
} from 'react-native';
import { Routes } from '../../navigation/Routes';
import { useAuth } from '../../context/AuthContext';
import style from './style';
import useT from '../../i18n/useT';
import { useThemeMode } from '../../context/ThemeContext';

const LoginScreen = ({ navigation }) => {
  const { signIn } = useAuth();
  const { mode, colors } = useThemeMode();

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { t, isRTL } = useT();
  const rtlText = { textAlign: isRTL ? 'right' : 'left' };
  const rtlInput = { textAlign: isRTL ? 'right' : 'left', writingDirection: isRTL ? 'rtl' : 'ltr' };
  const rtlPasswordInput = { textAlign: isRTL ? 'right' : 'left', writingDirection: 'ltr' };

  const onLogin = async () => {
    if (!emailOrUsername.trim() || !password.trim()) {
      Alert.alert(t('auth.missingDataTitle'), t('auth.missingLoginDataBody'));
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn({
        emailOrUsername,
        password,
      });
    } catch (error) {
      Alert.alert(t('auth.loginFailedTitle'), error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const logoSource = require('../../assets/images/branding/frienza-mark.png');

  return (
    <SafeAreaView style={[style.container, { backgroundColor: colors.background }]}>
      <Image
        source={logoSource}
        style={{ width: 250, height: 100, resizeMode: 'contain', alignSelf: 'center', marginBottom: 50 }}
      />
      <Text style={[style.title, rtlText, { color: colors.text }]}>{t('auth.login')}</Text>
      <Text style={[style.subtitle, rtlText, { color: colors.subText }]}>{t('auth.welcomeBack')}</Text>

      <TextInput
        style={[
          style.input,
          rtlInput,
          {
            backgroundColor: colors.surface1,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder={t('auth.emailOrUsername')}
        autoCapitalize="none"
        value={emailOrUsername}
        onChangeText={setEmailOrUsername}
        placeholderTextColor={colors.muted}
        selectionColor={colors.primary}
      />

      <TextInput
        style={[
          style.input,
          rtlPasswordInput,
          {
            backgroundColor: colors.surface1,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder={t('auth.password')}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={colors.muted}
        selectionColor={colors.primary}
      />

      <TouchableOpacity
        onPress={onLogin}
        style={[
          style.button,
          { backgroundColor: colors.primary },
          isSubmitting && style.buttonDisabled,
        ]}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <Text style={[style.buttonText, { color: colors.onPrimary }]}>{t('auth.signIn')}</Text>
        )}
      </TouchableOpacity>

      <View style={[style.footerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Text style={[style.footerText, { color: colors.subText }]}>{t('auth.dontHaveAccount')} </Text>
        <TouchableOpacity onPress={() => navigation.navigate(Routes.Signup)}>
          <Text style={[style.footerLink, { color: colors.primary }]}>{t('auth.signup')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;