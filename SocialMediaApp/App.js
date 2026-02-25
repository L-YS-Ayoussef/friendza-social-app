import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import MainNavigation from './navigation/MainNavigation';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useThemeMode } from './context/ThemeContext';
import { AppPreferencesProvider } from './context/AppPreferencesContext';

const AppContent = () => {
  const { mode } = useThemeMode();

  return (
    <NavigationContainer theme={mode === 'dark' ? DarkTheme : DefaultTheme}>
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