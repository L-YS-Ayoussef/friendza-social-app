import React, { useState } from 'react';
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
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import api from '../../services/api';
import { Routes } from '../../navigation/Routes';
import style from '../CreateContent/style';

const CreatePost = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onPickFromGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.9,
    });

    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Could not open gallery');
      return;
    }

    const asset = result.assets?.[0];
    if (asset) setSelectedImage(asset);
  };

  const onOpenCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
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
    if (asset) setSelectedImage(asset);
  };

  const onCreatePost = async () => {
    if (!selectedImage?.uri) {
      Alert.alert('Missing image', 'Please select or capture an image');
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage.uri,
        type: selectedImage.type || 'image/jpeg',
        name: selectedImage.fileName || `post_${Date.now()}.jpg`,
      });

      if (caption.trim()) formData.append('caption', caption.trim());
      if (location.trim()) formData.append('location', location.trim());

      await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', 'Post created successfully');
      navigation.goBack();
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to create post';
      Alert.alert('Error', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <ScrollView contentContainerStyle={style.content} keyboardShouldPersistTaps="handled">
        <Text style={style.title}>Create Post</Text>
        <Text style={style.subtitle}>Upload from gallery or take a photo.</Text>

        <Text style={style.label}>Post image *</Text>
        <View style={style.mediaActionRow}>
          <TouchableOpacity style={style.mediaActionButton} onPress={onOpenCamera}>
            <Text style={style.mediaActionButtonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={style.mediaActionButton} onPress={onPickFromGallery}>
            <Text style={style.mediaActionButtonText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        <View style={style.previewBox}>
          {selectedImage?.uri ? (
            <Image source={{ uri: selectedImage.uri }} style={style.previewImage} resizeMode="cover" />
          ) : (
            <Text style={style.previewPlaceholder}>No image selected</Text>
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
          onPress={onCreatePost}
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