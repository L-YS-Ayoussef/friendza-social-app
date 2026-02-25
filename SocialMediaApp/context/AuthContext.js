import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext(null);

const AUTH_TOKEN_KEY = 'auth_token';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    bootstrapAuth();
  }, []);

  const bootstrapAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);

      if (!storedToken) {
        setIsBootstrapping(false);
        return;
      }

      setAuthToken(storedToken);

      const response = await api.get('/auth/me');

      setToken(storedToken);
      setUser(response.data.user);
    } catch (error) {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      setAuthToken(null);
      setToken(null);
      setUser(null);
    } finally {
      setIsBootstrapping(false);
    }
  };

  const signUp = async ({ fullName, username, email, password }) => {
    try {
      const response = await api.post('/auth/signup', {
        fullName,
        username,
        email,
        password,
      });

      const { token: newToken, user: newUser } = response.data;

      await AsyncStorage.setItem(AUTH_TOKEN_KEY, newToken);
      setAuthToken(newToken);
      setToken(newToken);
      setUser(newUser);

      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Signup failed';
      throw new Error(message);
    }
  };

  const signIn = async ({ emailOrUsername, password }) => {
    try {
      const response = await api.post('/auth/login', {
        emailOrUsername,
        password,
      });

      const { token: newToken, user: newUser } = response.data;

      await AsyncStorage.setItem(AUTH_TOKEN_KEY, newToken);
      setAuthToken(newToken);
      setToken(newToken);
      setUser(newUser);

      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isBootstrapping,
      signUp,
      signIn,
      signOut,
    }),
    [token, user, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};