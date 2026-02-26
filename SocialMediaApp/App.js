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


// the three dots in the post, i want when clicked to show a list and the list will contain this -> 
// - share -> open the share so that the user can send it through different apps
// - save as QR code 
// - send in chat
// - for the owner -> edit caption within one hour and delete and for the story only delete

// in  addition, i want to display the post and story create date 