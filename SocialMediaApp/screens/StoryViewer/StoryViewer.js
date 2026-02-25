import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
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
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <ImageBackground
        source={
          currentStory.storyImage
            ? { uri: currentStory.storyImage }
            : require('../../assets/images/default_post.png')
        }
        style={style.background}
        resizeMode="cover"
      >
        <View style={style.overlay} />

        <SafeAreaView style={style.safeArea}>
          {/* Show progress only if auto-play is ON */}
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
            <Text style={style.headerName}>{currentStory.firstName}</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesomeIcon icon={faTimes} size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {!!currentStory.caption && (
            <View style={style.captionContainer}>
              <Text style={style.captionText}>{currentStory.caption}</Text>
            </View>
          )}

          {/* Right/left tap works always */}
          <View style={style.tapLayer}>
            <TouchableOpacity style={style.leftZone} activeOpacity={1} onPress={goPrev} />
            <TouchableOpacity style={style.rightZone} activeOpacity={1} onPress={goNext} />
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default StoryViewer;