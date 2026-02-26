import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api, { resolveMediaUrl } from '../../services/api';
import UserPost from '../../components/UserPost/UserPost';
import { Routes } from '../../navigation/Routes';

const PostViewer = ({ route, navigation }) => {
  const { postId } = route.params || {};
  const [post, setPost] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/posts/${postId}`);
      setPost(res.data?.post || null);
    };
    if (postId) load();
  }, [postId]);

  if (!post) {
    return (
      <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  const userId = post.user_id || post.userId;
  const fullName = post.full_name || post.fullName || post.user?.fullName || '';
  const username = post.username || post.user?.username || 'User';
  const parts = (fullName || username).trim().split(' ');
  const firstName = parts[0] || username;
  const lastName = parts.slice(1).join(' ');

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ paddingHorizontal: 10, paddingTop: 8 }}>
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
          onPressUsername={() => navigation.navigate(Routes.UserProfile, { userId })}
          onPressAvatar={() => navigation.navigate(Routes.UserProfile, { userId })}
          onOpenComments={() => navigation.navigate(Routes.PostComments, { postId })}
        />
      </View>
    </SafeAreaView>
  );
};

export default PostViewer;