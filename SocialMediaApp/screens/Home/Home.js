import React, { useCallback, useState, useMemo, useRef } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  TouchableOpacity,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faPlus } from '@fortawesome/free-solid-svg-icons';

import PostActionsSheet from '../../components/PostActionsSheet/PostActionsSheet';
import BottomToast from '../../components/BottomToast/BottomToast';
import StoryActionsSheet from '../../components/StoryActionsSheet/StoryActionsSheet';
import style from './style';
import UserStory from '../../components/UserStory/UserStory';
import UserPost from '../../components/UserPost/UserPost';
import globalStyle from '../../assets/styles/globalStyle';
import { Routes } from '../../navigation/Routes';
import api, { resolveMediaUrl } from '../../services/api';
import useT from '../../i18n/useT';
import { useThemeMode } from '../../context/ThemeContext';

const Home = ({ navigation }) => {
  const { t } = useT();
  const { colors } = useThemeMode();

  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { user: currentUser } = useAuth();
  const toastRef = useRef(null);

  const [actionsVisible, setActionsVisible] = useState(false);
  const [activePost, setActivePost] = useState(null);

  const [storyActionsVisible, setStoryActionsVisible] = useState(false);
  const [activeStoryCircle, setActiveStoryCircle] = useState(null);
  const [storyIsFollowing, setStoryIsFollowing] = useState(false);

  const splitName = (fullName, username) => {
    const fallback = username || 'User';
    const safe = (fullName || fallback).trim();
    const parts = safe.split(' ');
    return {
      firstName: parts[0] || fallback,
      lastName: parts.slice(1).join(' ') || '',
    };
  };

  const storyByUserId = useMemo(() => {
    const map = {};
    stories.forEach((s, index) => {
      if (!map[s.userId]) {
        map[s.userId] = { story: s, index };
      }
    });
    return map;
  }, [stories]);

  const storyCircles = useMemo(() => {
    const seen = new Set();
    const circles = [];

    for (let i = stories.length - 1; i >= 0; i--) {
      const s = stories[i];
      if (!seen.has(s.userId)) {
        seen.add(s.userId);
        circles.unshift(s);
      }
    }

    return circles;
  }, [stories]);

  const loadFeed = async ({ showLoader = false } = {}) => {
    try {
      if (showLoader) setIsLoading(true);

      const [storiesResponse, postsResponse] = await Promise.all([
        api.get('/stories/active'),
        api.get('/posts/feed'),
      ]);

      const storiesData = (storiesResponse.data?.stories || []).map((item) => {
        const names = splitName(item.user?.fullName, item.user?.username);

        return {
          id: item.id,
          firstName: names.firstName,
          profileImage: resolveMediaUrl(item.user?.avatarUrl),
          mediaType: item.mediaType || item.media_type || 'image',
          storyImage: resolveMediaUrl(item.mediaUrl || item.media_url),
          userId: item.user?.id || item.userId,
          caption: item.caption || '',
          username: item.user?.username || '',
          fullName: item.user?.fullName || '',
          createdAt: item.createdAt || item.created_at,
        };
      });

      const postsData = (postsResponse.data?.posts || []).map((item) => {
        const names = splitName(item.user?.fullName, item.user?.username);

        return {
          id: item.id,
          userId: item.userId || item.user?.id,
          firstName: names.firstName,
          lastName: names.lastName,
          mediaUrl: resolveMediaUrl(item.mediaUrl || item.media_url),
          mediaType: item.mediaType || item.media_type || 'image',
          profileImage: resolveMediaUrl(item.user?.avatarUrl),
          location: item.location || '',
          likes: item.likesCount || 0,
          comments: item.commentsCount || 0,
          bookmarks: item.bookmarksCount ?? item.savesCount ?? 0,
          isLiked: !!item.isLiked,
          isSaved: !!item.isSaved,
          username: item.user?.username || '',
          createdAt: item.createdAt || item.created_at,
          caption: item.caption || '',
          isFollowingAuthor: !!item.isFollowingAuthor,
        };
      });

      setStories(storiesData);
      setPosts(postsData);

      // console.log('Stories count:', storiesData.length);
      // console.log('Posts count:', postsData.length);
    } catch (error) {
      console.log('Home feed load error:', error?.response?.data || error.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFeed({ showLoader: true });
    }, [])
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    loadFeed();
  };

  // ----- Story actions sheet handlers -----
  const openStoryActions = async (circle) => {
    setActiveStoryCircle(circle);

    const owner = Number(circle.userId) === Number(currentUser?.id);
    if (!owner) {
      try {
        const res = await api.get(`/users/${circle.userId}/profile`);
        setStoryIsFollowing(!!res.data?.user?.isFollowing);
      } catch {
        setStoryIsFollowing(false);
      }
    } else {
      setStoryIsFollowing(false);
    }

    setStoryActionsVisible(true);
  };

  const closeStoryActions = () => {
    setStoryActionsVisible(false);
    setActiveStoryCircle(null);
  };

  const viewStoryFromActions = () => {
    if (!activeStoryCircle) return;
    const firstStoryIndex = storyByUserId[activeStoryCircle.userId]?.index ?? 0;

    navigation.navigate(Routes.StoryViewer, {
      stories,
      startIndex: firstStoryIndex,
    });
  };

  const deleteStoryFromActions = async () => {
    if (!activeStoryCircle?.id) return;
    await api.delete(`/stories/${activeStoryCircle.id}`);
    setStories((prev) => prev.filter((s) => s.id !== activeStoryCircle.id));
  };

  const toggleFollowStoryUser = async () => {
    if (!activeStoryCircle?.userId) return false;
    const res = await api.post(`/users/${activeStoryCircle.userId}/follow`);
    const next = !!res.data?.isFollowing;
    setStoryIsFollowing(next);
    return next;
  };

  // ----- Post actions sheet handlers -----
  const toggleLike = async (postId) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      const { isLiked, likesCount } = response.data;

      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isLiked, likes: likesCount } : p))
      );
    } catch (error) {
      console.log('Toggle like error:', error?.response?.data || error.message);
    }
  };

  const toggleSave = async (postId) => {
    const response = await api.post(`/posts/${postId}/save`);
    const { isSaved, savesCount } = response.data;

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isSaved, bookmarks: savesCount } : p))
    );

    return isSaved;
  };

  const openActions = (post) => {
    setActivePost(post);
    setActionsVisible(true);
  };

  const closeActions = () => {
    setActionsVisible(false);
    setActivePost(null);
  };

  const isOwner = !!activePost && Number(activePost.userId) === Number(currentUser?.id);

  const canEdit = useMemo(() => {
    if (!activePost?.createdAt) return false;
    const diff = Date.now() - new Date(activePost.createdAt).getTime();
    return diff <= 60 * 60 * 1000;
  }, [activePost]);

  const onView = () => {
    if (!activePost) return;
    navigation.navigate(Routes.PostViewer, { postId: activePost.id });
  };

  const onEdit = () => {
    if (!activePost) return;
    navigation.navigate(Routes.CreatePost, {
      mode: 'edit',
      postId: activePost.id,
      post: activePost,
    });
  };

  const onDelete = async () => {
    if (!activePost) return;
    await api.delete(`/posts/${activePost.id}`);
    setPosts((prev) => prev.filter((p) => p.id !== activePost.id));
  };

  const onAddToStory = async () => {
    if (!activePost) return;
    await api.post(`/stories/from-post/${activePost.id}`);
  };

  const onToggleFollow = async () => {
    if (!activePost) return false;

    const res = await api.post(`/users/${activePost.userId}/follow`);
    const next = !!res.data?.isFollowing;

    setPosts((prev) =>
      prev.map((p) => (p.userId === activePost.userId ? { ...p, isFollowingAuthor: next } : p))
    );

    setActivePost((prev) => (prev ? { ...prev, isFollowingAuthor: next } : prev));
    return next;
  };

  const onToggleSaveFromSheet = async () => {
    if (!activePost) return false;
    const next = await toggleSave(activePost.id);
    setActivePost((prev) => (prev ? { ...prev, isSaved: next } : prev));
    return next;
  };

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView
          edges={['top', 'right', 'left', 'bottom']}
          style={[globalStyle.flex, { backgroundColor: colors.background }]}
        >
          <View style={[globalStyle.flex, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={['top', 'right', 'left', 'bottom']}
        style={[globalStyle.flex, { backgroundColor: colors.background }]}
      >
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListHeaderComponent={
            <>
              <View style={[style.topBar, { backgroundColor: colors.background }]}>
                <TouchableOpacity style={style.topIconButton} onPress={() => navigation.navigate(Routes.CreatePost)}>
                  <FontAwesomeIcon icon={faPlus} size={18} color={colors.text} />
                </TouchableOpacity>

                <Text style={[style.appName, { color: colors.text }]}>Friendza</Text>

                <TouchableOpacity style={style.topIconButton} onPress={() => navigation.navigate(Routes.RecentLikes)}>
                  <FontAwesomeIcon icon={faHeart} size={18} color={colors.text} />
                </TouchableOpacity>
              </View>

              <View style={[style.userStoryContainer, { backgroundColor: colors.background }]}>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={storyCircles}
                  keyExtractor={(item) => String(item.userId)}
                  ListHeaderComponent={
                    <TouchableOpacity
                      style={style.addStoryContainer}
                      onPress={() => navigation.navigate(Routes.CreateStory)}
                    >
                      <View
                        style={[
                          style.addStoryCircle,
                          {
                            backgroundColor: colors.surface2,
                            borderColor: colors.primary,
                            borderWidth: 1,
                          },
                        ]}
                      >
                        <FontAwesomeIcon icon={faPlus} size={16} color={colors.primary} />
                      </View>
                      <Text style={[style.addStoryText, { color: colors.subText }]}>{t('story.addStory')}</Text>
                    </TouchableOpacity>
                  }
                  ListEmptyComponent={
                    <Text style={[style.emptyText, { color: colors.muted }]}>
                      {t('story.noActiveStoriesYet')}
                    </Text>
                  }
                  renderItem={({ item }) => (
                    <UserStory
                      firstName={item.firstName}
                      profileImage={item.profileImage}
                      showRing
                      onPress={() => {
                        const firstStoryIndex = storyByUserId[item.userId]?.index ?? 0;

                        navigation.navigate(Routes.StoryViewer, {
                          stories,
                          startIndex: firstStoryIndex,
                        });
                      }}
                      onLongPress={() => openStoryActions(item)}
                    />
                  )}
                />
              </View>
            </>
          }
          data={posts}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={[style.emptyContainer, { backgroundColor: colors.background }]}>
              <Text style={[style.emptyText, { color: colors.subText }]}>
                No posts yet. Tap + to create your first post.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={style.userPostContainer}>
              <UserPost
                firstName={item.firstName}
                lastName={item.lastName}
                likes={item.likes}
                comments={item.comments}
                bookmarks={item.bookmarks}
                profileImage={item.profileImage}
                location={item.location}
                isLiked={item.isLiked}
                isSaved={item.isSaved}
                mediaType={item.mediaType}
                mediaUrl={item.mediaUrl}
                createdAt={item.createdAt}
                onPressUsername={() => navigation.navigate(Routes.UserProfile, { userId: item.userId })}
                onPressAvatar={() => {
                  const storyMatch = storyByUserId[item.userId];
                  if (storyMatch) {
                    navigation.navigate(Routes.StoryViewer, {
                      stories,
                      startIndex: storyMatch.index,
                    });
                  } else {
                    navigation.navigate(Routes.UserProfile, { userId: item.userId });
                  }
                }}
                onToggleLike={() => toggleLike(item.id)}
                onToggleSave={() => toggleSave(item.id)}
                onOpenComments={() => navigation.navigate(Routes.PostComments, { postId: item.id })}
                onOpenLikes={() => navigation.navigate(Routes.PostLikes, { postId: item.id })}
                onOpenActions={() => openActions(item)}
              />
            </View>
          )}
        />

        <PostActionsSheet
          visible={actionsVisible}
          onClose={closeActions}
          post={activePost}
          isOwner={isOwner}
          canEdit={isOwner && canEdit}
          isFollowingAuthor={!!activePost?.isFollowingAuthor}
          isSaved={!!activePost?.isSaved}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddToStory={onAddToStory}
          onToggleFollow={onToggleFollow}
          onToggleSave={onToggleSaveFromSheet}
          showToast={(msg) => toastRef.current?.show(msg)}
        />

        <StoryActionsSheet
          visible={storyActionsVisible}
          onClose={closeStoryActions}
          story={
            activeStoryCircle
              ? { id: activeStoryCircle.id, userId: activeStoryCircle.userId, username: activeStoryCircle.username || '' }
              : null
          }
          isOwner={!!activeStoryCircle && Number(activeStoryCircle.userId) === Number(currentUser?.id)}
          isFollowingUser={storyIsFollowing}
          onView={viewStoryFromActions}
          onDelete={deleteStoryFromActions}
          onToggleFollow={toggleFollowStoryUser}
          showToast={(msg) => toastRef.current?.show(msg)}
        />

        <BottomToast ref={toastRef} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home;