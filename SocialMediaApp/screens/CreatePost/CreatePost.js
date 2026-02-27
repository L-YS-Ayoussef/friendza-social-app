import React, { useState, useEffect } from 'react';
import {
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from 'react-native-video';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import api, { resolveMediaUrl } from '../../services/api';
import style from '../CreateContent/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faImages } from '@fortawesome/free-solid-svg-icons';

const CreatePost = ({ navigation, route }) => {
  const { mode, postId, post } = route.params || {};
  const isEdit = mode === 'edit' && !!postId;

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [existingMediaUrl, setExistingMediaUrl] = useState(null);
  const [existingMediaType, setExistingMediaType] = useState('image');

useEffect(() => {
  if (!isEdit || !post) return;

  setCaption(post.caption || '');
  setLocation(post.location || '');
  setExistingMediaUrl(resolveMediaUrl(post.mediaUrl || post.media_url));
  setExistingMediaType(post.mediaType || post.media_type || 'image');
}, [isEdit, post]);

  const onPickFromGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'mixed',
      selectionLimit: 1,
      quality: 0.9,
    });

    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Could not open gallery');
      return;
    }

    const asset = result.assets?.[0];
    if (asset) setSelectedMedia(asset);
  };

  const onOpenCamera = async () => {
    const result = await launchCamera({
      mediaType: 'mixed',
      cameraType: 'back',
      quality: 0.9,
      saveToPhotos: false,
    });

    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Could not open camera');
      return;
    }

    const asset = result.assets?.[0];
    if (asset) setSelectedMedia(asset);
  };

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (isEdit) {
        // edit: allow changing caption/location only, or replace media
        if (selectedMedia?.uri) {
          const formData = new FormData();
          const isVideo = selectedMedia.type?.startsWith('video/');
          const defaultExt = isVideo ? 'mp4' : 'jpg';

          formData.append('media', {
            uri: selectedMedia.uri,
            type: selectedMedia.type || (isVideo ? 'video/mp4' : 'image/jpeg'),
            name: selectedMedia.fileName || `post_${Date.now()}.${defaultExt}`,
          });

          formData.append('caption', caption ?? '');
          formData.append('location', location ?? '');

          await api.put(`/posts/${postId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          await api.put(`/posts/${postId}`, {
            caption: caption ?? '',
            location: location ?? '',
          });
        }

        Alert.alert('Success', 'Post updated successfully');
        navigation.goBack();
        return;
      }

      // create (original logic)
      if (!selectedMedia?.uri) {
        Alert.alert('Missing media', 'Please select or capture an image/video');
        return;
      }

      const formData = new FormData();
      const isVideo = selectedMedia.type?.startsWith('video/');
      const defaultExt = isVideo ? 'mp4' : 'jpg';

      formData.append('media', {
        uri: selectedMedia.uri,
        type: selectedMedia.type || (isVideo ? 'video/mp4' : 'image/jpeg'),
        name: selectedMedia.fileName || `post_${Date.now()}.${defaultExt}`,
      });

      if (caption.trim()) formData.append('caption', caption.trim());
      if (location.trim()) formData.append('location', location.trim());

      await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', 'Post created successfully');
      navigation.goBack();
    } catch (error) {
      const message = error?.response?.data?.message || (isEdit ? 'Failed to update post' : 'Failed to create post');
      Alert.alert('Error', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <ScrollView contentContainerStyle={style.content} keyboardShouldPersistTaps="handled">
        <Text style={style.title}>{isEdit ? 'Edit Post' : 'Create Post'}</Text>
        <Text style={style.subtitle}>Upload from gallery or take a photo.</Text>

        <Text style={style.label}>Post image *</Text>
        <View style={style.sourceRow}>
          <TouchableOpacity style={style.sourceIconButton} onPress={onOpenCamera}>
            <FontAwesomeIcon icon={faCamera} size={18} color="#111827" />
          </TouchableOpacity>

          <TouchableOpacity style={[style.sourceIconButton, { marginLeft: 10 }]} onPress={onPickFromGallery}>
            <FontAwesomeIcon icon={faImages} size={18} color="#111827" />
          </TouchableOpacity>
        </View>

        <View style={style.previewBox}>
          {selectedMedia?.uri ? (
            selectedMedia.type?.startsWith('video/') ? (
              <Video source={{ uri: selectedMedia.uri }} style={style.previewImage} resizeMode="cover" paused />
            ) : (
              <Image source={{ uri: selectedMedia.uri }} style={style.previewImage} resizeMode="cover" />
            )
          ) : existingMediaUrl ? (
            existingMediaType === 'video' ? (
              <Video source={{ uri: existingMediaUrl }} style={style.previewImage} resizeMode="cover" paused />
            ) : (
              <Image source={{ uri: existingMediaUrl }} style={style.previewImage} resizeMode="cover" />
            )
          ) : (
            <Text style={style.previewPlaceholder}>No image/video selected</Text>
          )}
        </View>

        <Text style={style.label}>Location (optional)</Text>
        <TextInput
          style={style.input}
          placeholder="Cairo, Egypt"
          placeholderTextColor="#94A3B8"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={style.label}>Caption (optional)</Text>
        <TextInput
          style={[style.input, style.textArea]}
          placeholder="Write something..."
          placeholderTextColor="#94A3B8"
          multiline
          value={caption}
          onChangeText={setCaption}
        />

        <TouchableOpacity
          onPress={onSubmit}
          style={[style.button, isSubmitting && style.buttonDisabled]}
          disabled={isSubmitting}
        >
          {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={style.buttonText}>Publish Post</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatePost;