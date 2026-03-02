import React, { useCallback, useState, useRef } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, View, Text } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import api, { resolveMediaUrl } from '../../services/api';
import { Routes } from '../../navigation/Routes';
import { useAuth } from '../../context/AuthContext';
import PostActionsSheet from '../PostActionsSheet/PostActionsSheet';
import BottomToast from '../BottomToast/BottomToast';
import style from './style';
import { useThemeMode } from '../../context/ThemeContext';
import useT from '../../i18n/useT';

const ProfileMediaGrid = ({ endpoint }) => {
  const navigation = useNavigation();
  const { colors } = useThemeMode();
  const { t } = useT();

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user: currentUser } = useAuth();
  const toastRef = useRef(null);
  const longPressRef = useRef(false);

  const [actionsVisible, setActionsVisible] = useState(false);
  const [activePost, setActivePost] = useState(null);
  const [isFetchingActionData, setIsFetchingActionData] = useState(false);

  const closeActions = () => {
    setActionsVisible(false);
    setActivePost(null);
  };

  const canEdit = (createdAt) => {
    if (!createdAt) return false;
    const diff = Date.now() - new Date(createdAt).getTime();
    return diff <= 60 * 60 * 1000;
  };

  const openPostActions = async (item) => {
    const postId = item.id;
    const userId = item.user_id || item.userId;
    const username = item.username || item.user?.username || '';
    const createdAt = item.created_at || item.createdAt;

    const isOwner = Number(userId) === Number(currentUser?.id);

    setIsFetchingActionData(true);
    let isFollowingAuthor = false;

    try {
      if (!isOwner) {
        const res = await api.get(`/users/${userId}/profile`);
        isFollowingAuthor = !!res.data?.user?.isFollowing;
      }
    } catch {
      isFollowingAuthor = false;
    } finally {
      setIsFetchingActionData(false);
    }

    setActivePost({
      id: postId,
      userId,
      username,
      createdAt,
      caption: item.caption || '',
      location: item.location || '',
      mediaUrl: item.media_url || item.mediaUrl,
      mediaType: item.media_type || item.mediaType || 'image',
      isSaved: !!(item.is_saved || item.isSaved),
      isFollowingAuthor,
    });

    setActionsVisible(true);
  };

  const onView = () => {
    if (!activePost) return;
    closeActions();
    navigation.navigate(Routes.PostViewer, { postId: activePost.id });
  };

  const onEdit = () => {
    if (!activePost) return;
    closeActions();
    navigation.navigate(Routes.CreatePost, { mode: 'edit', postId: activePost.id, post: activePost });
  };

  const onDelete = async () => {
    if (!activePost) return;
    await api.delete(`/posts/${activePost.id}`);
    setItems((prev) => prev.filter((p) => p.id !== activePost.id));
  };

  const onAddToStory = async () => {
    if (!activePost) return;
    await api.post(`/stories/from-post/${activePost.id}`);
  };

  const onToggleFollow = async () => {
    if (!activePost) return false;
    const res = await api.post(`/users/${activePost.userId}/follow`);
    const next = !!res.data?.isFollowing;
    setActivePost((p) => (p ? { ...p, isFollowingAuthor: next } : p));
    return next;
  };

  const onToggleSave = async () => {
    if (!activePost) return false;
    const res = await api.post(`/posts/${activePost.id}/save`);
    const next = !!res.data?.isSaved;

    setActivePost((p) => (p ? { ...p, isSaved: next } : p));

    // if this grid is the Saved tab, unsave should remove the tile
    if (endpoint.includes('/posts/saved') && !next) {
      setItems((prev) => prev.filter((p) => p.id !== activePost.id));
    }

    return next;
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(endpoint);
      const rows = response.data?.posts || [];
      setItems(rows);
    } catch (e) {
      console.log('Profile grid load error:', e?.response?.data || e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { loadData(); }, [endpoint]));

  if (isLoading) {
    return (
      <View style={style.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!items.length) {
    return (
      <View style={style.centered}>
        <Text style={[style.emptyText, { color: colors.muted }]}>{t('profile.noPostsYet')}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={items}
        numColumns={3}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={style.grid}
        renderItem={({ item }) => {
          const mediaUrl = resolveMediaUrl(item.media_url || item.mediaUrl);
          const mediaType = item.media_type || item.mediaType || 'image';

          return (
            <Pressable
              style={style.cell}
              onLongPress={() => {
                longPressRef.current = true;
                openPostActions(item);
                setTimeout(() => { longPressRef.current = false; }, 350);
              }}
              onPress={() => {
                if (longPressRef.current) return;
                navigation.navigate(Routes.PostViewer, { postId: item.id });
              }}
            >
              {mediaType === 'video' ? (
                <Video source={{ uri: mediaUrl }} style={[style.thumb, { backgroundColor: colors.surface2 }]} resizeMode="cover" paused />
              ) : (
                <Image source={{ uri: mediaUrl }} style={[style.thumb, { backgroundColor: colors.surface2 }]} />
              )}
            </Pressable>
          );
        }}
      />

      <PostActionsSheet
        visible={actionsVisible}
        onClose={closeActions}
        post={activePost}
        isOwner={!!activePost && Number(activePost.userId) === Number(currentUser?.id)}
        canEdit={!!activePost && Number(activePost.userId) === Number(currentUser?.id) && canEdit(activePost.createdAt)}
        isFollowingAuthor={!!activePost?.isFollowingAuthor}
        isSaved={!!activePost?.isSaved}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onAddToStory={onAddToStory}
        onToggleFollow={onToggleFollow}
        onToggleSave={onToggleSave}
        showToast={(msg) => toastRef.current?.show(msg)}
      />

      <BottomToast ref={toastRef} />

      {isFetchingActionData ? (
        <View style={[style.overlay, { backgroundColor: colors.scrim }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : null}
    </View>
  );
};

export default ProfileMediaGrid;