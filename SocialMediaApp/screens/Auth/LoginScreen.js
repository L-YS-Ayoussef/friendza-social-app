import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Routes } from '../../navigation/Routes';
import { useAuth } from '../../context/AuthContext';
import style from './style';
import useT from '../../i18n/useT';

const LoginScreen = ({ navigation }) => {
  const { signIn } = useAuth();

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

  return (
    <SafeAreaView style={style.container}>
      <Text style={[style.title]}>{t('auth.login')}</Text>
      <Text style={[style.subtitle]}>{t('auth.welcomeBack')}</Text>

      <TextInput
        style={[style.input, rtlInput]}
        placeholder={t('auth.emailOrUsername')}
        autoCapitalize="none"
        value={emailOrUsername}
        onChangeText={setEmailOrUsername}
        placeholderTextColor="#94A3B8"
      />

      <TextInput
        style={[style.input, rtlPasswordInput]}
        placeholder={t('auth.password')}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#94A3B8"
      />

      <TouchableOpacity
        onPress={onLogin}
        style={[style.button, isSubmitting && style.buttonDisabled]}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={style.buttonText}>{t('auth.signIn')}</Text>
        )}
      </TouchableOpacity>

      <View style={style.footerRow}>
        <Text style={style.footerText}>{t('auth.dontHaveAccount')}   </Text>
        <TouchableOpacity onPress={() => navigation.navigate(Routes.Signup)}>
          <Text style={style.footerLink}>{t('auth.signup')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;