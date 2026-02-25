import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api, { resolveMediaUrl } from '../../services/api';
import style from './style';

const RecentLikes = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLikes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/posts/recent-likes');

      const mapped = (response.data?.likes || []).map((item, index) => ({
        id: `${item.post.id}_${index}`,
        likerName: item.liker.fullName || item.liker.username,
        postImage: resolveMediaUrl(item.post.imageUrl),
      }));

      setItems(mapped);
    } catch (error) {
      console.log('Recent likes error:', error?.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadLikes();
    }, [])
  );

  if (isLoading) {
    return (
      <SafeAreaView style={style.container}>
        <View style={style.centered}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={style.container}>
      <Text style={style.title}>Likes</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={style.emptyText}>No likes yet</Text>}
        renderItem={({ item }) => (
          <View style={style.row}>
            <Text style={style.text}>
              <Text style={style.bold}>{item.likerName}</Text> liked your post
            </Text>
            <Image source={{ uri: item.postImage }} style={style.thumb} />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default RecentLikes;