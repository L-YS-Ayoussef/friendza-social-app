import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api, { resolveMediaUrl } from '../../services/api';
import style from './style';

const UserProfile = ({ route }) => {
  const { userId } = route.params || {};

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/users/${userId}/profile`);
      setUser(response.data?.user || null);
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (userId) loadProfile();
    }, [userId])
  );

  const onToggleFollow = async () => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      const response = await api.post(`/users/${user.id}/follow`);

      setUser((prev) => ({
        ...prev,
        isFollowing: response.data.isFollowing,
        followersCount: response.data.followersCount,
        followingCount: response.data.followingCount,
      }));
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to update follow');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={style.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={style.centered}>
        <Text>User not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={style.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={style.avatarWrap}>
        <Image
          source={
            user.avatarUrl
              ? { uri: resolveMediaUrl(user.avatarUrl) }
              : require('../../assets/images/default_profile.png')
          }
          style={style.avatar}
        />
      </View>

      <Text style={style.name}>{user.fullName || user.username}</Text>
      <Text style={style.username}>@{user.username}</Text>

      {!!user.bio && <Text style={style.bio}>{user.bio}</Text>}
      
      {user.isPrivateLocked && (
        <View style={style.privateNotice}>
          <Text style={style.privateNoticeTitle}>Private Account</Text>
          <Text style={style.privateNoticeText}>
            Follow this user to view their profile details.
          </Text>
        </View>
      )}
      
      {!user.isPrivateLocked && (
        <View style={style.statsRow}>
          <View style={style.statItem}>
            <Text style={style.statValue}>{user.postsCount}</Text>
            <Text style={style.statLabel}>Posts</Text>
          </View>
          <View style={style.divider} />
          <View style={style.statItem}>
            <Text style={style.statValue}>{user.followersCount}</Text>
            <Text style={style.statLabel}>Followers</Text>
          </View>
          <View style={style.divider} />
          <View style={style.statItem}>
            <Text style={style.statValue}>{user.followingCount}</Text>
            <Text style={style.statLabel}>Following</Text>
          </View>
        </View>
      )}

      {!user.isOwnProfile && (
        <TouchableOpacity
          style={[style.followButton, user.isFollowing && style.followingButton]}
          onPress={onToggleFollow}
          disabled={isSubmitting}
        >
          <Text style={[style.followButtonText, user.isFollowing && style.followingButtonText]}>
            {user.isFollowing ? 'Unfollow' : 'Follow'}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default UserProfile;