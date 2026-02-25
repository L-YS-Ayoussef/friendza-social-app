import React, { useCallback, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  TouchableOpacity,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faPlus } from '@fortawesome/free-solid-svg-icons';

import style from './style';
import UserStory from '../../components/UserStory/UserStory';
import UserPost from '../../components/UserPost/UserPost';
import globalStyle from '../../assets/styles/globalStyle';
import { Routes } from '../../navigation/Routes';
import api, { resolveMediaUrl } from '../../services/api';

const Home = ({ navigation }) => {
  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const splitName = (fullName, username) => {
    const fallback = username || 'User';
    const safe = (fullName || fallback).trim();
    const parts = safe.split(' ');
    return {
      firstName: parts[0] || fallback,
      lastName: parts.slice(1).join(' ') || '',
    };
  };

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
          profileImage: resolveMediaUrl(item.imageUrl),
          storyImage: resolveMediaUrl(item.imageUrl),
          caption: item.caption || '',
          username: item.user?.username || '',
          fullName: item.user?.fullName || '',
        };
      });

      const postsData = (postsResponse.data?.posts || []).map((item) => {
        const names = splitName(item.user?.fullName, item.user?.username);
        return {
          id: item.id,
          firstName: names.firstName,
          lastName: names.lastName,
          location: item.location || null,
          likes: item.likesCount || 0,
          comments: item.commentsCount || 0,
          bookmarks: item.bookmarksCount || 0,
          isLiked: item.isLiked || false,
          isSaved: item.isSaved || false,
          image: resolveMediaUrl(item.imageUrl) || require('../../assets/images/default_post.png'),
          profileImage: resolveMediaUrl(item.user?.avatarUrl) || require('../../assets/images/default_profile.png'),
        };
      });

      setStories(storiesData);
      setPosts(postsData);
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
    try {
      const response = await api.post(`/posts/${postId}/save`);
      const { isSaved, savesCount } = response.data;

      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isSaved, bookmarks: savesCount } : p))
      );
    } catch (error) {
      console.log('Toggle save error:', error?.response?.data || error.message);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView edges={['top', 'right', 'left', 'bottom']} style={[globalStyle.backgroundWhite, globalStyle.flex]}>
          <View style={[globalStyle.flex, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['top', 'right', 'left', 'bottom']} style={[globalStyle.backgroundWhite, globalStyle.flex]}>
        <FlatList
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          ListHeaderComponent={
            <>
              <View style={style.topBar}>
                <TouchableOpacity style={style.topIconButton} onPress={() => navigation.navigate(Routes.CreatePost)}>
                  <FontAwesomeIcon icon={faPlus} size={18} color="#111827" />
                </TouchableOpacity>

                <Text style={style.appName}>Friendza</Text>

                <TouchableOpacity style={style.topIconButton} onPress={() => navigation.navigate(Routes.RecentLikes)}>
                  <FontAwesomeIcon icon={faHeart} size={18} color="#111827" />
                </TouchableOpacity>
              </View>

              <View style={style.userStoryContainer}>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={stories}
                  keyExtractor={(item) => String(item.id)}
                  ListHeaderComponent={
                    <TouchableOpacity style={style.addStoryContainer} onPress={() => navigation.navigate(Routes.CreateStory)}>
                      <View style={style.addStoryCircle}>
                        <FontAwesomeIcon icon={faPlus} size={16} color="#0150EC" />
                      </View>
                      <Text style={style.addStoryText}>Add Story</Text>
                    </TouchableOpacity>
                  }
                  ListEmptyComponent={
                    <Text style={style.emptyText}>No active stories yet</Text>
                  }
                  renderItem={({ item, index }) => (
                    <UserStory
                      firstName={item.firstName}
                      profileImage={item.profileImage}
                      onPress={() =>
                        navigation.navigate(Routes.StoryViewer, {
                          stories, 
                          startIndex: index,
                        })
                      }
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
            <View style={style.emptyContainer}>
              <Text style={style.emptyText}>No posts yet. Tap + to create your first post.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={style.userPostContainer}>
              <UserPost
                firstName={item.firstName}
                lastName={item.lastName}
                image={item.image}
                likes={item.likes}
                comments={item.comments}
                bookmarks={item.bookmarks}
                profileImage={item.profileImage}
                location={item.location}
                isLiked={item.isLiked}
                isSaved={item.isSaved}
                onToggleLike={() => toggleLike(item.id)}
                onToggleSave={() => toggleSave(item.id)}
                onOpenComments={() => navigation.navigate(Routes.PostComments, { postId: item.id })}
              />
            </View>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home;