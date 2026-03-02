import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

import api, { resolveMediaUrl } from '../../services/api';
import UserProfileImage from '../../components/UserProfileImage/UserProfileImage';
import { horizontalScale } from '../../assets/styles/scaling';
import { Routes } from '../../navigation/Routes';
import style from './style';
import useT from '../../i18n/useT';
import { useThemeMode } from '../../context/ThemeContext';

const PostLikes = ({ route, navigation }) => {
  const { postId } = route.params || {};
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { t } = useT();
  const { colors } = useThemeMode();

  useLayoutEffect(() => {
    navigation.setOptions({ title: t('nav.likes') });
  }, [navigation, t]);

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
      <View style={[style.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[style.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={users}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={[style.emptyText, { color: colors.muted }]}>{t('likes.noLikes')}</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[style.likeRow, { borderBottomColor: colors.border }]}
            onPress={() => navigation.navigate(Routes.UserProfile, { userId: item.id })}
          >
            <View style={style.likeAvatarWrap}>
              <UserProfileImage
                imageDimensions={horizontalScale(46)}
                profileImage={resolveMediaUrl(item.avatarUrl || item.avatar_url)}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[style.likeText, { color: colors.subText }]}>
                <Text style={[style.likeName, { color: colors.text }]}>{item.fullName || item.username}</Text>
                <Text> </Text>
                <Text style={{ color: colors.subText }}>@{item.username}</Text>
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default PostLikes;