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

const LoginScreen = ({ navigation }) => {
  const { signIn } = useAuth();

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onLogin = async () => {
    if (!emailOrUsername.trim() || !password.trim()) {
      Alert.alert('Missing data', 'Please enter your email/username and password');
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn({
        emailOrUsername,
        password,
      });
    } catch (error) {
      Alert.alert('Login failed', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <Text style={style.title}>Login</Text>
      <Text style={style.subtitle}>Welcome back 👋</Text>

      <TextInput
        style={style.input}
        placeholder="Email or username"
        autoCapitalize="none"
        value={emailOrUsername}
        onChangeText={setEmailOrUsername}
        placeholderTextColor="#94A3B8"
      />

      <TextInput
        style={style.input}
        placeholder="Password"
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
          <Text style={style.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <View style={style.footerRow}>
        <Text style={style.footerText}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate(Routes.Signup)}>
          <Text style={style.footerLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;