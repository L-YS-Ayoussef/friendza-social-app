import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Animated,
  StatusBar,
  Image 
} from 'react-native';
import Video from 'react-native-video';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAppPreferences } from '../../context/AppPreferencesContext';
import style from './style';

const STORY_DURATION = 5000;

const StoryViewer = ({ route, navigation }) => {
  const { stories = [], startIndex = 0 } = route.params || {};
  const { autoPlayStories } = useAppPreferences();

  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (!stories.length) {
      navigation.goBack();
    }
  }, [stories, navigation]);

  useEffect(() => {
    progressAnim.setValue(0);

    if (!autoPlayStories) return; // ✅ no progress / no auto-advance

    const anim = Animated.timing(progressAnim, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    });

    anim.start(({ finished }) => {
      if (!finished) return;

      if (currentIndex < stories.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        navigation.goBack();
      }
    });

    return () => anim.stop();
  }, [currentIndex, autoPlayStories, stories.length, navigation, progressAnim]);

  const goNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      navigation.goBack();
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (!currentStory) return null;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={style.container}>
      {/* Media fills the whole screen */}
      {currentStory.mediaType === 'video' ? (
        <Video
          source={{ uri: currentStory.storyImage }}
          style={style.absoluteMedia}
          resizeMode="cover"
          paused={!autoPlayStories}
          repeat={false}
        />
      ) : (
        <ImageBackground
          source={
            currentStory.storyImage
              ? { uri: currentStory.storyImage }
              : require('../../assets/images/default_post.png')
          }
          style={style.absoluteMedia}
          resizeMode="cover"
        />
      )}

      {/* Dark overlay */}
      <View style={style.overlay} />

      {/* Top UI + bottom caption */}
      <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={style.safeOverlay}>
        <View style={style.topArea}>
          {autoPlayStories && (
            <View style={style.progressRow}>
              {stories.map((_, index) => (
                <View key={`${index}`} style={style.progressTrack}>
                  {index < currentIndex && <View style={style.progressFillDone} />}
                  {index === currentIndex && (
                    <Animated.View style={[style.progressFillActive, { width: progressWidth }]} />
                  )}
                </View>
              ))}
            </View>
          )}

          <View style={style.header}>
            <View style={style.headerLeft}>
              <Image
                source={
                  currentStory.profileImage
                    ? { uri: currentStory.profileImage }
                    : require('../../assets/images/default_post.png')
                }
                style={style.headerAvatar}
              />
              <Text style={style.headerName}>{currentStory.firstName}</Text>
            </View>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesomeIcon icon={faTimes} size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {!!currentStory.caption && (
          <View style={style.captionContainer}>
            <Text style={style.captionText}>{currentStory.caption}</Text>
          </View>
        )}
      </SafeAreaView>

      {/* Tap zones should be on top of media, but behind header/caption */}
      <View style={style.tapLayer} pointerEvents="box-none">
        <TouchableOpacity style={style.leftZone} activeOpacity={1} onPress={goPrev} />
        <TouchableOpacity style={style.rightZone} activeOpacity={1} onPress={goNext} />
      </View>
    </View>
  );
};

export default StoryViewer;