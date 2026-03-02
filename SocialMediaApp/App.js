import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import MainNavigation from './navigation/MainNavigation';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useThemeMode } from './context/ThemeContext';
import { AppPreferencesProvider } from './context/AppPreferencesContext';

const AppContent = () => {
  const { mode, colors } = useThemeMode();

  // Navigation theme driven by your token colors
  const navTheme = {
    ...(mode === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(mode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary,
      background: colors.background,
      card: colors.surface2,
      text: colors.text,
      border: colors.border,
      notification: colors.tertiary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <AuthProvider>
        <MainNavigation />
      </AuthProvider>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppPreferencesProvider>
        <AppContent />
      </AppPreferencesProvider>
    </ThemeProvider>
  );
};

export default App;