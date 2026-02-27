import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import api, { resolveMediaUrl } from '../../services/api';
import UserPost from '../../components/UserPost/UserPost';
import UserProfileImage from '../../components/UserProfileImage/UserProfileImage';
import { Routes } from '../../navigation/Routes';
import { useAuth } from '../../context/AuthContext';

import PostActionsSheet from '../../components/PostActionsSheet/PostActionsSheet';
import BottomToast from '../../components/BottomToast/BottomToast';
import style from './style';
import { horizontalScale } from '../../assets/styles/scaling';

const PostViewer = ({ route, navigation }) => {
  const { postId } = route.params || {};
  const { user: currentUser } = useAuth();
  const toastRef = useRef(null);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);

  const [actionsVisible, setActionsVisible] = useState(false);

  const loadAll = async () => {
    setLoadingPost(true);
    setLoadingComments(true);

    try {
      const [postRes, commentsRes] = await Promise.all([
        api.get(`/posts/${postId}`),
        api.get(`/posts/${postId}/comments`),
      ]);

      setPost(postRes.data?.post || null);
      setComments(commentsRes.data?.comments || []);
    } catch (e) {
      setPost(null);
      setComments([]);
    } finally {
      setLoadingPost(false);
      setLoadingComments(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (postId) loadAll();
    }, [postId])
  );

  const isOwner = useMemo(() => {
    if (!post) return false;
    const authorId = post.user_id || post.userId;
    return Number(authorId) === Number(currentUser?.id);
  }, [post, currentUser]);

  const createdAt = post?.createdAt || post?.created_at;
  const canEdit = useMemo(() => {
    if (!createdAt) return false;
    const diff = Date.now() - new Date(createdAt).getTime();
    return diff <= 60 * 60 * 1000;
  }, [createdAt]);

  const userId = post?.user_id || post?.userId;
  const fullName = post?.full_name || post?.fullName || post?.user?.fullName || '';
  const username = post?.username || post?.user?.username || 'User';
  const parts = (fullName || username).trim().split(' ');
  const firstName = parts[0] || username;
  const lastName = parts.slice(1).join(' ');

  if (loadingPost) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text>Post not found</Text>
      </SafeAreaView>
    );
  }

  const closeActions = () => setActionsVisible(false);

  const onView = () => {}; // already viewing

  const onEdit = () => {
    navigation.navigate(Routes.CreatePost, {
      mode: 'edit',
      postId,
      post: {
        id: post.id,
        userId,
        username,
        caption: post.caption || '',
        location: post.location || '',
        mediaUrl: post.mediaUrl || post.media_url,
        mediaType: post.mediaType || post.media_type || 'image',
        createdAt: post.createdAt || post.created_at,
        isSaved: !!(post.is_saved || post.isSaved),
        isFollowingAuthor: !!(post.is_following_author || post.isFollowingAuthor),
      },
    });
  };

  const onDelete = async () => {
    await api.delete(`/posts/${postId}`);
    toastRef.current?.show('Post deleted ✅');
    navigation.goBack();
  };

  const onAddToStory = async () => {
    await api.post(`/stories/from-post/${postId}`);
  };

  const onToggleFollow = async () => {
    const authorId = userId;
    const res = await api.post(`/users/${authorId}/follow`);
    const next = !!res.data?.isFollowing;
    setPost((prev) => (prev ? { ...prev, is_following_author: next, isFollowingAuthor: next } : prev));
    return next;
  };

  const onToggleSave = async () => {
    const res = await api.post(`/posts/${postId}/save`);
    const next = !!res.data?.isSaved;
    setPost((prev) =>
      prev
        ? {
            ...prev,
            is_saved: next,
            isSaved: next,
            saves_count: res.data?.savesCount ?? prev.saves_count,
            savesCount: res.data?.savesCount ?? prev.savesCount,
          }
        : prev
    );
    return next;
  };

  const renderHeader = () => (
    <View style={style.headerWrap}>
      <UserPost
        firstName={firstName}
        lastName={lastName}
        profileImage={resolveMediaUrl(post.avatar_url || post.avatarUrl)}
        mediaType={post.media_type || post.mediaType || 'image'}
        mediaUrl={resolveMediaUrl(post.media_url || post.mediaUrl)}
        location={post.location}
        likes={post.likes_count || post.likesCount || 0}
        comments={post.comments_count || post.commentsCount || 0}
        bookmarks={post.saves_count || post.savesCount || post.bookmarksCount || 0}
        isLiked={!!(post.is_liked || post.isLiked)}
        isSaved={!!(post.is_saved || post.isSaved)}
        createdAt={post.createdAt || post.created_at}
        onPressUsername={() => navigation.navigate(Routes.UserProfile, { userId })}
        onPressAvatar={() => navigation.navigate(Routes.UserProfile, { userId })}
        onOpenComments={() => navigation.navigate(Routes.PostComments, { postId })}
        onOpenActions={() => setActionsVisible(true)}
      />

      <Text style={style.sectionTitle}>Comments</Text>
      {loadingComments ? <ActivityIndicator /> : null}
    </View>
  );

  return (
    <SafeAreaView style={style.container}>
      <FlatList
        data={comments}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <View style={style.commentRow}>
            <UserProfileImage
              imageDimensions={horizontalScale(34)}
              profileImage={resolveMediaUrl(item.user?.avatarUrl)}
            />
            <View style={style.commentTextBlock}>
              <Text style={style.nameText}>@{item.user?.username}</Text>
              <Text style={style.commentText}>{item.text}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          loadingComments ? null : <Text style={style.emptyText}>No Comments</Text>
        }
      />

      <PostActionsSheet
        visible={actionsVisible}
        onClose={closeActions}
        post={{
          id: post.id,
          userId,
          username,
          createdAt: post.createdAt || post.created_at,
        }}
        isOwner={isOwner}
        canEdit={isOwner && canEdit}
        isFollowingAuthor={!!(post.is_following_author || post.isFollowingAuthor)}
        isSaved={!!(post.is_saved || post.isSaved)}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onAddToStory={onAddToStory}
        onToggleFollow={onToggleFollow}
        onToggleSave={onToggleSave}
        showToast={(msg) => toastRef.current?.show(msg)}
      />

      <BottomToast ref={toastRef} />
    </SafeAreaView>
  );
};

export default PostViewer;