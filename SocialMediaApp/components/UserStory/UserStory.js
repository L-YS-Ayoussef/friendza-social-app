import React, { useRef } from 'react';
import { Text, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import style from './style';
import UserProfileImage from '../UserProfileImage/UserProfileImage';
import { horizontalScale } from '../../assets/styles/scaling';
import { useThemeMode } from '../../context/ThemeContext';

const UserStory = (props) => {
  const longPressRef = useRef(false);
  const { colors } = useThemeMode();

  return (
    <Pressable
      style={style.storyContainer}
      onLongPress={() => {
        longPressRef.current = true;
        props.onLongPress?.();
        setTimeout(() => {
          longPressRef.current = false;
        }, 300);
      }}
      onPress={() => {
        if (longPressRef.current) return;
        props.onPress?.();
      }}
    >
      <UserProfileImage
        profileImage={props.profileImage}
        imageDimensions={horizontalScale(65)}
        showRing={props.showRing}
      />
      <Text style={[style.firstName, { color: colors.subText }]}>{props.firstName}</Text>
    </Pressable>
  );
};

UserStory.propTypes = {
  firstName: PropTypes.string.isRequired,
  profileImage: PropTypes.any,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  showRing: PropTypes.bool,
};

UserStory.defaultProps = {
  onPress: () => {},
  onLongPress: () => {},
  showRing: false,
};

export default UserStory;