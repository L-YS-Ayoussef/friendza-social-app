import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import style from './style';
import UserProfileImage from '../UserProfileImage/UserProfileImage';
import { horizontalScale } from '../../assets/styles/scaling';

const UserStory = (props) => {
  return (
    <TouchableOpacity style={style.storyContainer} onPress={props.onPress} activeOpacity={0.8}>
      <UserProfileImage profileImage={props.profileImage} imageDimensions={horizontalScale(65)} />
      <Text style={style.firstName}>{props.firstName}</Text>
    </TouchableOpacity>
  );
};

UserStory.propTypes = {
  firstName: PropTypes.string.isRequired,
  profileImage: PropTypes.any,
  onPress: PropTypes.func,
};

UserStory.defaultProps = {
  onPress: () => {},
};

export default UserStory;