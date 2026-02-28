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
import useT from '../../i18n/useT';

const CreateStory = ({ navigation }) => {
  const [selectedMedia, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { t, isRTL } = useT();
  const rtlText = { textAlign: isRTL ? 'right' : 'left' };
  const rtlInput = { textAlign: isRTL ? 'right' : 'left', writingDirection: isRTL ? 'rtl' : 'ltr' };
    
  const onPickFromGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'mixed',
      selectionLimit: 1,
      quality: 0.9,
    });

    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert(t('common.error'), result.errorMessage || t('post.openGalleryFailed'));
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
      Alert.alert(t('common.error'), result.errorMessage || t('post.openCameraFailed'));
      return;
    }

    const asset = result.assets?.[0];
    if (asset) setSelectedImage(asset);
  };

  const onCreateStory = async () => {
    if (!selectedMedia?.uri) {
      Alert.alert(t('auth.missingDataTitle'), t('post.missingMedia'));
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

      Alert.alert(t('common.success'), t('post.addedToStory')); 
      navigation.goBack();
    } catch (error) {
      const message = error?.response?.data?.message || t('post.failedCreateStory');
      Alert.alert(t('common.error'), message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <ScrollView contentContainerStyle={style.content} keyboardShouldPersistTaps="handled">
        <Text style={style.title}>{t('post.createStoryTitle')}</Text>
        <Text style={style.subtitle}>{t('post.createStorySubtitle')}</Text>

        <Text style={style.label}>{t('post.storyMediaLabel')}</Text>
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
            <Text style={style.previewPlaceholder}>{t('post.noMediaSelected')}</Text>
          )
          }
        </View>

        <Text style={style.label}>{t('post.captionOptional')}</Text>
        <TextInput
          style={[style.input, style.textArea]}
          placeholder={t('post.writeSomething')}
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
          {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={style.buttonText}>{t('post.publishStory')}</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateStory;