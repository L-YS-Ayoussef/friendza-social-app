import React, { useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import style from './style';
import UserProfileImage from '../UserProfileImage/UserProfileImage';
import { horizontalScale } from '../../assets/styles/scaling';

const UserStory = (props) => {
  const longPressRef = useRef(false);

  return (
    <Pressable
      style={style.storyContainer}
      onLongPress={() => {
        longPressRef.current = true;
        props.onLongPress?.();
        setTimeout(() => { longPressRef.current = false; }, 300);
      }}
      onPress={() => {
        if (longPressRef.current) return;
        props.onPress?.();
      }}
    >
      <UserProfileImage profileImage={props.profileImage} imageDimensions={horizontalScale(65)} />
      <Text style={style.firstName}>{props.firstName}</Text>
    </Pressable>
  );
};

UserStory.propTypes = {
  firstName: PropTypes.string.isRequired,
  profileImage: PropTypes.any,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
};

UserStory.defaultProps = {
  onPress: () => {},
  onLongPress: () => {},
};

export default UserStory;