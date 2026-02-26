import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, TouchableOpacity, View, Text } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import api, { resolveMediaUrl } from '../../services/api';
import { Routes } from '../../navigation/Routes';
import style from './style';

const ProfileMediaGrid = ({ endpoint }) => {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        <ActivityIndicator />
      </View>
    );
  }

  if (!items.length) {
    return (
      <View style={style.centered}>
        <Text>No items yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      numColumns={3}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={style.grid}
      renderItem={({ item }) => {
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
      }}
    />
  );
};

export default ProfileMediaGrid;