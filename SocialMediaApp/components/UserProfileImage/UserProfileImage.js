import React from 'react';
import PropTypes from 'prop-types';
import { Image, View } from 'react-native';
import style from './style';

const UserProfileImage = (props) => {
  const source =
    typeof props.profileImage === 'string' && props.profileImage.trim()
      ? { uri: props.profileImage }
      : props.profileImage || require('../../assets/images/default_profile.png');

  return (
    <View style={[style.userImageContainer, { borderRadius: props.imageDimensions }]}>
      <Image
        source={source}
        style={{ width: props.imageDimensions, height: props.imageDimensions, borderRadius: props.imageDimensions }}
        resizeMode="cover"
      />
    </View>
  );
};

UserProfileImage.propTypes = {
  profileImage: PropTypes.any,
  imageDimensions: PropTypes.number.isRequired,
};

export default UserProfileImage;