import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Video from 'react-native-video';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import api, { resolveMediaUrl } from '../../services/api';
import { Routes } from '../../navigation/Routes';
import style from './style';
import useT from '../../i18n/useT';

const UserProfile = ({ route, navigation }) => {
  const { userId } = route.params || {};

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { t } = useT();
  

  const loadPosts = async (targetUserId) => {
    try {
      setIsPostsLoading(true);
      const response = await api.get(`/users/${targetUserId}/posts`);
      setPosts(response.data?.posts || []);
    } catch (error) {
      setPosts([]);
    } finally {
      setIsPostsLoading(false);
    }
  };

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/users/${userId}/profile`);
      const u = response.data?.user || null;
      setUser(u);

      if (u && !u.isPrivateLocked) {
        await loadPosts(u.id);
      } else {
        setPosts([]);
      }
    } catch (error) {
      Alert.alert(t('common.error'), error?.response?.data?.message || t('post.loadProfileFailed'));
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
      await api.post(`/users/${user.id}/follow`);
      await loadProfile(); // refresh unlock + stats + posts
    } catch (error) {
      Alert.alert(t('common.error'), error?.response?.data?.message || t('post.updateFollowFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDeleteFollower = async () => {
    if (!user) return;

    Alert.alert(
      t('post.deleteFollowerTitle'),
      t('post.deleteFollowerBody', { username: user.username }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('post.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              setIsSubmitting(true);
              const response = await api.delete(`/users/${user.id}/follower`);
              setUser((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  followsMe: false,
                  followingCount: response.data?.followingCount ?? prev.followingCount,
                };
              });
            } catch (error) {
              Alert.alert(t('common.error'), error?.response?.data?.message || t('post.deletedFollowerFailed'));
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

  const showDeleteFollower = useMemo(() => {
    return !!user?.followsMe && !user?.isOwnProfile;
  }, [user]);

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

  const renderHeader = () => (
    <View style={style.header}>
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
          <Text style={style.privateNoticeTitle}>{t('userProfile.privateTitle')}</Text>
          <Text style={style.privateNoticeText}>{t('userProfile.privateText')}</Text>
        </View>
      )}

      {!user.isPrivateLocked && (
        <View style={style.statsRow}>
          <View style={style.statItem}>
            <Text style={style.statValue}>{user.postsCount}</Text>
            <Text style={style.statLabel}>{t('profile.posts')}</Text>
          </View>
          <View style={style.divider} />
          <TouchableOpacity
            style={style.statItem}
            onPress={() => navigation.navigate(Routes.FollowList, { userId: user.id, type: 'followers' })}
          >
            <Text style={style.statValue}>{user.followersCount}</Text>
            <Text style={style.statLabel}>{t('profile.followers')}</Text>
          </TouchableOpacity>
          <View style={style.divider} />
          <TouchableOpacity
            style={style.statItem}
            onPress={() => navigation.navigate(Routes.FollowList, { userId: user.id, type: 'following' })}
          >
            <Text style={style.statValue}>{user.followingCount}</Text>
            <Text style={style.statLabel}>{t('profile.following')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {!user.isOwnProfile && (
        <View style={style.actionsRow}>
          <TouchableOpacity
            style={[style.actionButton, user.isFollowing ? style.actionButtonSecondary : style.actionButtonPrimary]}
            onPress={onToggleFollow}
            disabled={isSubmitting}
          >
            <FontAwesomeIcon
              icon={user.isFollowing ? faTimes : faPlus}
              size={14}
              color={user.isFollowing ? '#0150EC' : '#FFFFFF'}
            />
            <Text
              style={[
                style.actionButtonText,
                user.isFollowing ? style.actionButtonTextSecondary : style.actionButtonTextPrimary,
              ]}
            >
              {user.isFollowing ? t('common.unfollow') : t('common.follow')}
            </Text>
          </TouchableOpacity>

          {showDeleteFollower && (
            <TouchableOpacity
              style={[style.actionButton, style.actionButtonDanger]}
              onPress={onDeleteFollower}
              disabled={isSubmitting}
            >
              <FontAwesomeIcon icon={faTrash} size={14} color="#FFFFFF" />
              <Text style={[style.actionButtonText, style.actionButtonTextPrimary]}>{t('common.deleteFollower')}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {!user.isPrivateLocked && isPostsLoading && (
        <View style={style.postsLoading}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );

  const renderItem = ({ item }) => {
    const mediaUrl = resolveMediaUrl(item.media_url || item.mediaUrl);
    const mediaType = item.media_type || item.mediaType || 'image';

    return (
      <TouchableOpacity
        style={style.cell}
        onPress={() => navigation.navigate(Routes.PostViewer, { postId: item.id })}
      >
        {mediaType === 'video' ? (
          <Video source={{ uri: mediaUrl }} style={style.thumb} resizeMode="cover" paused />
        ) : (
          <Image source={{ uri: mediaUrl }} style={style.thumb} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      style={style.container}
      data={user.isPrivateLocked ? [] : posts}
      numColumns={3}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={style.listContent}
      ListEmptyComponent={
        user.isPrivateLocked || isPostsLoading ? null : (
          <View style={style.emptyWrap}>
            <Text style={style.emptyText}>{t('userProfile.noPostsYet')}</Text>
          </View>
        )
      }
    />
  );
};

export default UserProfile;