import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { Routes } from './Routes';
import Home from '../screens/Home/Home';
import Profile from '../screens/Profile/Profile';
import CreatePost from '../screens/CreatePost/CreatePost';
import CreateStory from '../screens/CreateStory/CreateStory';
import RecentLikes from '../screens/Likes/RecentLikes';

import ProfileTabTitle from '../components/ProfileTabTitle/ProfileTabTitle';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import { useAuth } from '../context/AuthContext';
import globalStyle from '../assets/styles/globalStyle';
import CustomDrawerContent from '../components/Drawer/CustomDrawerContent';

import StoryViewer from '../screens/StoryViewer/StoryViewer';
import Suggestions from '../screens/Suggestions/Suggestions';
import UserProfile from '../screens/UserProfile/UserProfile';

import Settings from '../screens/Settings/Settings';
import PostComments from '../screens/Comments/PostComments';

import PostViewer from '../screens/PostViewer/PostViewer';
import FollowList from '../screens/FollowList/FollowList';

import ProfilePhotosTab from '../screens/Profile/ProfilePhotosTab';
import ProfileVideosTab from '../screens/Profile/ProfileVideosTab';
import ProfileSavedTab from '../screens/Profile/ProfileSavedTab';
import PostLikes from '../screens/Likes/PostLikes';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const ProfileTabs = createMaterialTopTabNavigator();

export const ProfileTabsNavigation = () => {
  return (
    <ProfileTabs.Navigator
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: 'transparent' },
        tabBarStyle: { zIndex: 0, elevation: 0 },
      }}
    >
      <ProfileTabs.Screen
        name="Photos"
        options={{ tabBarLabel: ({ focused }) => <ProfileTabTitle isFocused={focused} title="Photos" /> }}
        component={ProfilePhotosTab}
      />
      <ProfileTabs.Screen
        name="Videos"
        options={{ tabBarLabel: ({ focused }) => <ProfileTabTitle isFocused={focused} title="Videos" /> }}
        component={ProfileVideosTab}
      />
      <ProfileTabs.Screen
        name="Saved"
        options={{ tabBarLabel: ({ focused }) => <ProfileTabTitle isFocused={focused} title="Saved" /> }}
        component={ProfileSavedTab}
      />
    </ProfileTabs.Navigator>
  );
};

const DrawerRoot = () => (
  <Drawer.Navigator
    initialRouteName={Routes.Home}
    drawerContent={(props) => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen name={Routes.Home} component={Home} />
    <Drawer.Screen name={Routes.Suggestions} component={Suggestions} options={{ title: 'Find Friends' }} />
    <Drawer.Screen name={Routes.Settings} component={Settings} />
    <Drawer.Screen name={Routes.Profile} component={Profile} />
  </Drawer.Navigator>
);

const AuthNavigation = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={Routes.Login} component={LoginScreen} />
    <Stack.Screen name={Routes.Signup} component={SignupScreen} />
  </Stack.Navigator>
);

const AppNavigation = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={Routes.DrawerRoot}
      component={DrawerRoot}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={Routes.CreatePost}
      component={CreatePost}
      options={{ title: 'Create Post' }}
    />
    <Stack.Screen
      name={Routes.CreateStory}
      component={CreateStory}
      options={{ title: 'Create Story' }}
    />
    <Stack.Screen
      name={Routes.RecentLikes}
      component={RecentLikes}
      options={{ title: 'Recent Likes' }}
    />
    <Stack.Screen
      name={Routes.StoryViewer}
      component={StoryViewer}
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name={Routes.UserProfile}
      component={UserProfile}
      options={{ title: 'Profile' }}
    />

    <Stack.Screen
      name={Routes.PostComments}
      component={PostComments}
      options={{ title: 'Comments' }}
    />

    <Stack.Screen
      name={Routes.PostLikes}
      component={PostLikes}
      options={{ title: 'Likes' }}
    />

    <Stack.Screen name={Routes.PostViewer} component={PostViewer} options={{ headerShown: false }} />
    <Stack.Screen name={Routes.FollowList} component={FollowList} options={{ title: 'People' }} />
  </Stack.Navigator>
);

const MainNavigation = () => {
  const { token, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <View style={[globalStyle.flex, globalStyle.backgroundWhite, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <Stack.Screen name="AppStack" component={AppNavigation} />
      ) : (
        <Stack.Screen name={Routes.AuthStack} component={AuthNavigation} />
      )}
    </Stack.Navigator>
  );
};

export default MainNavigation;