import React, { useCallback, useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faSignOutAlt,
  faGear,
  faPlus,
  faPen,
  faCamera,
  faImages,
} from '@fortawesome/free-solid-svg-icons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import globalStyle from '../../assets/styles/globalStyle';
import style from './style';
import { ProfileTabsNavigation } from '../../navigation/MainNavigation';
import { useAuth } from '../../context/AuthContext';
import { Routes } from '../../navigation/Routes';
import api, { resolveMediaUrl } from '../../services/api';
import { useThemeMode } from '../../context/ThemeContext';

const Profile = ({ navigation }) => {
  const { signOut } = useAuth();
  const { colors } = useThemeMode();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAvatarActions, setShowAvatarActions] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  const openFollowList = (type) => {
    if (!profile?.id) return;

    navigation.navigate(Routes.FollowList, {
      userId: profile.id,
      type, // 'followers' | 'following'
    });
  };

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/users/me/profile');
      setProfile(response.data?.user || null);
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const uploadAvatar = async (asset) => {
    if (!asset?.uri) return;

    try {
      setIsUploadingAvatar(true);

      const formData = new FormData();
      formData.append('image', {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `avatar_${Date.now()}.jpg`,
      });

      const response = await api.put('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setProfile((prev) => ({
        ...prev,
        avatarUrl: response.data?.user?.avatarUrl || prev?.avatarUrl,
      }));

      setShowAvatarActions(false);
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to update avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log('Camera permission error:', err);
      return false;
    }
  };

  const requestGalleryPermission = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      // Android 13+
      const mediaPermission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
      const legacyPermission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      const permissionToAsk = mediaPermission || legacyPermission;

      const granted = await PermissionsAndroid.request(permissionToAsk);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log('Gallery permission error:', err);
      return false;
    }
  };

  const onOpenCamera = async () => {
    const hasPermission = await requestCameraPermission();

    if (!hasPermission) {
      Alert.alert('Permission needed', 'Camera permission is required');
      return;
    }

    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.9,
      saveToPhotos: false,
    });

    if (result.didCancel) return;

    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Could not open camera');
      return;
    }

    const asset = result.assets?.[0];
    if (asset) {
      uploadAvatar(asset);
    }
  };

  const onPickFromGallery = async () => {
    const hasPermission = await requestGalleryPermission();

    if (!hasPermission) {
      Alert.alert('Permission needed', 'Gallery permission is required');
      return;
    }

    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.9,
    });

    if (result.didCancel) return;

    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Could not open gallery');
      return;
    }

    const asset = result.assets?.[0];
    if (asset) {
      uploadAvatar(asset);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[globalStyle.flex, { backgroundColor: colors.background }]}>
          <View style={[globalStyle.flex, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const displayName = profile?.fullName || profile?.username || 'User';
  const usernameHandle = profile?.username ? `@${profile.username}` : '@user';
  const avatarSource = profile?.avatarUrl
    ? { uri: resolveMediaUrl(profile.avatarUrl) }
    : require('../../assets/images/default_profile.png');

  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={['top', 'right', 'left', 'bottom']}
        style={[globalStyle.flex, { backgroundColor: colors.background }]}
      >
        <View  style={{ flex: 1 }}>
          <View style={style.topHeaderRow}>
            {/* Left: Create Post */}
            <TouchableOpacity
              onPress={() => navigation.navigate(Routes.CreatePost)}
              style={[style.iconButton, { backgroundColor: colors.card }]}
            >
              <FontAwesomeIcon icon={faPlus} size={18} color={colors.text} />
            </TouchableOpacity>

            {/* Right: Settings + Logout */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => navigation.navigate(Routes.Settings)}
                style={[style.iconButton, { backgroundColor: colors.card }]}
              >
                <FontAwesomeIcon icon={faGear} size={18} color={colors.text} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={signOut}
                style={[style.iconButton, { backgroundColor: colors.card, marginLeft: 8 }]}
              >
                <FontAwesomeIcon icon={faSignOutAlt} size={18} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={style.profileImageContainer}>
            <View style={[style.profileImageContent, { borderColor: colors.primary }]}>
              <Image style={style.profileImage} source={avatarSource} />

              <TouchableOpacity
                style={[style.avatarEditBadge, { backgroundColor: colors.primary }]}
                onPress={() => setShowAvatarActions((prev) => !prev)}
                disabled={isUploadingAvatar}
              >
                {isUploadingAvatar ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <FontAwesomeIcon
                    icon={profile?.avatarUrl ? faPen : faPlus}
                    size={12}
                    color="#fff"
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {showAvatarActions && (
            <View style={style.avatarActionRow}>
              <TouchableOpacity
                style={[style.avatarActionIcon, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={onOpenCamera}
              >
                <FontAwesomeIcon icon={faCamera} size={16} color={colors.text} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[style.avatarActionIcon, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={onPickFromGallery}
              >
                <FontAwesomeIcon icon={faImages} size={16} color={colors.text} />
              </TouchableOpacity>
            </View>
          )}

          <Text style={[style.userName, { color: colors.text }]}>{displayName}</Text>
          <Text style={[style.userHandle, { color: colors.subText }]}>{usernameHandle}</Text>

          {!!profile?.bio && <Text style={[style.bioText, { color: colors.subText }]}>{profile.bio}</Text>}

          <View style={[style.statContainer, { borderColor: colors.border }]}>
            <TouchableOpacity onPress={() => openFollowList('following')}>
              <View>
                <Text style={[style.statAmount, { color: colors.text }]}>{profile?.followingCount || 0}</Text>
                <Text style={[style.statType, { color: colors.subText }]}>Following</Text>
              </View>
            </TouchableOpacity>
            <View style={[style.statBorder, { borderColor: colors.border }]} />

            <TouchableOpacity onPress={() => openFollowList('followers')}>
              <View>
                <Text style={[style.statAmount, { color: colors.text }]}>{profile?.followersCount || 0}</Text>
                <Text style={[style.statType, { color: colors.subText }]}>Followers</Text>
              </View>
            </TouchableOpacity>
            <View style={[style.statBorder, { borderColor: colors.border }]} />

            <View>
              <Text style={[style.statAmount, { color: colors.text }]}>{profile?.postsCount || 0}</Text>
              <Text style={[style.statType, { color: colors.subText }]}>Posts</Text>
            </View>
          </View>

          <View style={globalStyle.flex}>
            <ProfileTabsNavigation />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Profile;