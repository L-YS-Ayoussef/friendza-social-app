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
import { useThemeMode } from '../../context/ThemeContext';

const CreateStory = ({ navigation }) => {
  const [selectedMedia, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { t, isRTL } = useT();
  const { colors } = useThemeMode();

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
    <SafeAreaView style={[style.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={style.content} keyboardShouldPersistTaps="handled">
        <Text style={[style.title, rtlText, { color: colors.text }]}>{t('post.createStoryTitle')}</Text>
        <Text style={[style.subtitle, rtlText, { color: colors.subText }]}>{t('post.createStorySubtitle')}</Text>

        <Text style={[style.label, rtlText, { color: colors.subText }]}>{t('post.storyMediaLabel')}</Text>
        <View style={style.sourceRow}>
          <TouchableOpacity
            style={[style.sourceIconButton, { backgroundColor: colors.surface2, borderColor: colors.border }]}
            onPress={onOpenCamera}
          >
            <FontAwesomeIcon icon={faCamera} size={18} color={colors.icon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              style.sourceIconButton,
              { marginLeft: 10, backgroundColor: colors.surface2, borderColor: colors.border },
            ]}
            onPress={onPickFromGallery}
          >
            <FontAwesomeIcon icon={faImages} size={18} color={colors.icon} />
          </TouchableOpacity>
        </View>

        <View style={[style.previewBox, { backgroundColor: colors.surface1, borderColor: colors.border }]}>
          {selectedMedia?.uri ? (
            selectedMedia.type?.startsWith('video/') ? (
              <Video source={{ uri: selectedMedia.uri }} style={style.previewImage} resizeMode="cover" paused />
            ) : (
              <Image source={{ uri: selectedMedia.uri }} style={style.previewImage} resizeMode="cover" />
            )
          ) : (
            <Text style={[style.previewPlaceholder, { color: colors.muted }]}>{t('post.noMediaSelected')}</Text>
          )}
        </View>

        <Text style={[style.label, rtlText, { color: colors.subText }]}>{t('post.captionOptional')}</Text>
        <TextInput
          style={[
            style.input,
            style.textArea,
            rtlInput,
            { backgroundColor: colors.surface1, borderColor: colors.border, color: colors.text },
          ]}
          placeholder={t('post.writeSomething')}
          placeholderTextColor={colors.muted}
          multiline
          value={caption}
          onChangeText={setCaption}
          selectionColor={colors.primary}
        />

        <TouchableOpacity
          onPress={onCreateStory}
          style={[style.button, { backgroundColor: colors.primary }, isSubmitting && style.buttonDisabled]}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <Text style={[style.buttonText, { color: colors.onPrimary }]}>{t('post.publishStory')}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateStory;