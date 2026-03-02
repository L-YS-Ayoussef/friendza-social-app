import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api, { resolveMediaUrl } from '../../services/api';
import UserProfileImage from '../../components/UserProfileImage/UserProfileImage';
import { horizontalScale } from '../../assets/styles/scaling';
import { Routes } from '../../navigation/Routes';
import style from './style';
import useT from '../../i18n/useT';
import { useThemeMode } from '../../context/ThemeContext';

const RecentLikes = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { t, isRTL } = useT();
  const { colors } = useThemeMode();
  const rtlText = { textAlign: isRTL ? 'right' : 'left' };

  const loadLikes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/posts/recent-likes');

      const mapped = (response.data?.likes || []).map((item, index) => ({
        id: `${item.post.id}_${index}`,
        postId: item.post.id,
        likerId: item.liker.id,
        likerName: item.liker.fullName || item.liker.username,
        likerAvatarUrl: resolveMediaUrl(item.liker.avatarUrl),
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
      <SafeAreaView style={[style.container, { backgroundColor: colors.background }]}>
        <View style={style.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[style.container, { backgroundColor: colors.background }]}>
      <Text style={[style.title, rtlText, { color: colors.text }]}>{t('likes.recentLikes')}</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={[style.emptyText, { color: colors.muted }]}>{t('likes.noLikes')}</Text>}
        renderItem={({ item }) => (
          <View style={[style.likeRow, { borderBottomColor: colors.border }]}>
            <TouchableOpacity
              onPress={() => navigation.navigate(Routes.UserProfile, { userId: item.likerId })}
              style={style.likeAvatarWrap}
            >
              <UserProfileImage imageDimensions={horizontalScale(42)} profileImage={item.likerAvatarUrl} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => navigation.navigate(Routes.PostViewer, { postId: item.postId })}
            >
              <Text style={[style.likeText, { color: colors.subText }]}>
                <Text style={[style.likeName, { color: colors.text }]}>{item.likerName}</Text>
                <Text> {t('post.likedYourPost')}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default RecentLikes;