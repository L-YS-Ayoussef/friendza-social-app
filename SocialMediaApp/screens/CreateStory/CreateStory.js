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
import Video from 'react-native-video';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import api from '../../services/api';
import style from '../CreateContent/style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faImages } from '@fortawesome/free-solid-svg-icons';

const CreateStory = ({ navigation }) => {
  const [selectedMedia, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (asset) setSelectedImage(asset);
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
    if (asset) setSelectedImage(asset);
  };

  const onCreateStory = async () => {
    if (!selectedMedia?.uri) {
      Alert.alert('Missing media', 'Please select or capture an image/video');
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      const isVideo = selectedMedia.type?.startsWith('video/');
      const defaultExt = isVideo ? 'mp4' : 'jpg';

      formData.append('media', {
        uri: selectedMedia.uri,
        type: selectedMedia.type || (isVideo ? 'video/mp4' : 'image/jpeg'),
        name: selectedMedia.fileName || `post_${Date.now()}.${defaultExt}`,
      });

      if (caption.trim()) formData.append('caption', caption.trim());

      await api.post('/stories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', 'Story created successfully');
      navigation.goBack();
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to create story';
      Alert.alert('Error', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <ScrollView contentContainerStyle={style.content} keyboardShouldPersistTaps="handled">
        <Text style={style.title}>Create Story</Text>
        <Text style={style.subtitle}>Stories disappear after 24 hours.</Text>

        <Text style={style.label}>Story image *</Text>
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
              <Video
                source={{ uri: selectedMedia.uri }}
                style={style.previewImage}
                resizeMode="cover"
                paused={true} // preview is static for now
              />
            ) : (
              <Image
                source={{ uri: selectedMedia.uri }}
                style={style.previewImage}
                resizeMode="cover"
              />
            )
          ) : (
            <Text style={style.previewPlaceholder}>No image/video selected</Text>
          )
          }
        </View>

        <Text style={style.label}>Caption (optional)</Text>
        <TextInput
          style={[style.input, style.textArea]}
          placeholder="Story caption..."
          placeholderTextColor="#94A3B8"
          multiline
          value={caption}
          onChangeText={setCaption}
        />

        <TouchableOpacity
          onPress={onCreateStory}
          style={[style.button, isSubmitting && style.buttonDisabled]}
          disabled={isSubmitting}
        >
          {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={style.buttonText}>Publish Story</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateStory;