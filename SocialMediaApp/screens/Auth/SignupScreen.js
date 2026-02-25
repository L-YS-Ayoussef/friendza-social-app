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

const SignupScreen = ({ navigation }) => {
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSignup = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing data', 'Username, email and password are required');
      return;
    }

    try {
      setIsSubmitting(true);
      await signUp({
        fullName,
        username,
        email,
        password,
      });
    } catch (error) {
      Alert.alert('Signup failed', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <Text style={style.title}>Create Account</Text>
      <Text style={style.subtitle}>Let’s get you started 🚀</Text>

      <TextInput
        style={style.input}
        placeholder="Full name (optional)"
        value={fullName}
        onChangeText={setFullName}
        placeholderTextColor="#94A3B8"
      />

      <TextInput
        style={style.input}
        placeholder="Username"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#94A3B8"
      />

      <TextInput
        style={style.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#94A3B8"
      />

      <TextInput
        style={style.input}
        placeholder="Password (min 6 chars)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#94A3B8"
      />

      <TouchableOpacity
        onPress={onSignup}
        style={[style.button, isSubmitting && style.buttonDisabled]}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={style.buttonText}>Sign up</Text>
        )}
      </TouchableOpacity>

      <View style={style.footerRow}>
        <Text style={style.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate(Routes.Login)}>
          <Text style={style.footerLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;