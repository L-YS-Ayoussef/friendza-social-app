import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api, { resolveMediaUrl } from '../../services/api';
import { Routes } from '../../navigation/Routes';
import UserProfileImage from '../../components/UserProfileImage/UserProfileImage';
import { horizontalScale } from '../../assets/styles/scaling';
import style from './style';

const Suggestions = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSuggestions = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/users/suggestions');

      setUsers(response.data?.users || []);
    } catch (error) {
      console.log('Suggestions error:', error?.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSuggestions();
    }, [])
  );

  if (isLoading) {
    return (
      <View style={style.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={style.container}>
      <Text style={style.title}>Friend Suggestions</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={style.emptyText}>No suggestions right now</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={style.card}
            onPress={() => navigation.navigate(Routes.UserProfile, { userId: item.id })}
          >
            <UserProfileImage
              imageDimensions={horizontalScale(50)}
              profileImage={resolveMediaUrl(item.avatarUrl)}
            />
            <View style={style.textBlock}>
              <Text style={style.name}>{item.fullName || item.username}</Text>
              <Text style={style.username}>@{item.username}</Text>
            </View>
            <Text style={style.viewText}>View</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Suggestions;