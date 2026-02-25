import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api, { resolveMediaUrl } from '../../services/api';
import UserProfileImage from '../../components/UserProfileImage/UserProfileImage';
import { horizontalScale } from '../../assets/styles/scaling';
import { useThemeMode } from '../../context/ThemeContext';
import style from './style';

const PostComments = ({ route }) => {
  const { postId } = route.params || {};
  const { colors } = useThemeMode();

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/posts/${postId}/comments`);
      setComments(response.data?.comments || []);
    } catch (error) {
      console.log('Comments load error:', error?.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (postId) loadComments();
    }, [postId])
  );

  const onSendComment = async () => {
    if (!commentText.trim()) return;

    try {
      setIsSending(true);
      await api.post(`/posts/${postId}/comments`, { text: commentText.trim() });
      setCommentText('');
      loadComments();
    } catch (error) {
      console.log('Add comment error:', error?.response?.data || error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={[style.container, { backgroundColor: colors.background }]}>
      {isLoading ? (
        <View style={style.centered}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={style.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <FlatList
            data={comments}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={style.listContent}
            ListEmptyComponent={
              <Text style={[style.emptyText, { color: colors.subText }]}>No comments yet</Text>
            }
            renderItem={({ item }) => (
              <View style={[style.commentRow, { borderBottomColor: colors.border }]}>
                <UserProfileImage
                  imageDimensions={horizontalScale(38)}
                  profileImage={resolveMediaUrl(item.user?.avatarUrl)}
                />
                <View style={style.commentTextBlock}>
                  <Text style={[style.nameText, { color: colors.text }]}>
                    {item.user?.fullName || item.user?.username}
                  </Text>
                  <Text style={[style.commentText, { color: colors.subText }]}>{item.text}</Text>
                </View>
              </View>
            )}
          />

          <View style={[style.inputRow, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
            <TextInput
              style={[
                style.input,
                { color: colors.text, borderColor: colors.border, backgroundColor: colors.card },
              ]}
              placeholder="Write a comment..."
              placeholderTextColor={colors.subText}
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity
              onPress={onSendComment}
              style={[style.sendButton, { backgroundColor: colors.primary }, isSending && { opacity: 0.6 }]}
              disabled={isSending}
            >
              <Text style={style.sendButtonText}>{isSending ? '...' : 'Send'}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

export default PostComments;