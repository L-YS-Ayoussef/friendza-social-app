import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

import api, { resolveMediaUrl } from '../../services/api';
import UserProfileImage from '../../components/UserProfileImage/UserProfileImage';
import { horizontalScale } from '../../assets/styles/scaling';
import { Routes } from '../../navigation/Routes';
import style from './style';

const PostLikes = ({ route, navigation }) => {
  const { postId } = route.params || {};
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Likes' });
  }, [navigation]);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/posts/${postId}/likes`);
        setUsers(res.data?.users || []);
      } catch (e) {
        console.log('Post likes load error:', e?.response?.data || e.message);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) load();
  }, [postId]);

  if (isLoading) {
    return (
      <View style={style.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={style.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={style.emptyText}>No likes yet</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={style.likeRow}
            onPress={() => navigation.navigate(Routes.UserProfile, { userId: item.id })}
          >
            <View style={style.likeAvatarWrap}>
              <UserProfileImage
                imageDimensions={horizontalScale(46)}
                profileImage={resolveMediaUrl(item.avatarUrl || item.avatar_url)}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={style.likeText}>
                <Text style={style.likeName}>{item.fullName || item.username}</Text>
                <Text> </Text>
                <Text>@{item.username}</Text>
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default PostLikes;