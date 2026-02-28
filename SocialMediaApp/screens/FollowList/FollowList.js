import React, { useEffect, useState, useLayoutEffect } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import api, { resolveMediaUrl } from '../../services/api';
import UserProfileImage from '../../components/UserProfileImage/UserProfileImage';
import { horizontalScale } from '../../assets/styles/scaling';
import { Routes } from '../../navigation/Routes';
import useT from '../../i18n/useT';

const FollowList = ({ route, navigation }) => {
  const { userId, type } = route.params || {}; // type: 'followers' | 'following'
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { t } = useT();
  
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/users/${userId}/${type}`);
        setUsers(res.data?.users || res.data?.followers || res.data?.following || []);
      } catch (e) {
        console.log('Follow list error:', e?.response?.data || e.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (userId && type) load();
  }, [userId, type]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: type === 'followers' ? t('follow.followers') : t('follow.following'),
    });
  }, [navigation, type]);

  if (isLoading) return <View style={{ flex:1,justifyContent:'center',alignItems:'center' }}><ActivityIndicator /></View>;

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ padding: 12 }}
      ListEmptyComponent={<Text>{t('post.noUsers')}</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate(Routes.UserProfile, { userId: item.id })}
          style={{ flexDirection:'row', alignItems:'center', paddingVertical:10 }}
        >
          <UserProfileImage
            imageDimensions={horizontalScale(46)}
            profileImage={resolveMediaUrl(item.avatar_url || item.avatarUrl)}
          />
          <View style={{ marginLeft: 10 }}>
            <Text>{item.full_name || item.fullName || item.username}</Text>
            <Text style={{ color: '#64748B' }}>@{item.username}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default FollowList;