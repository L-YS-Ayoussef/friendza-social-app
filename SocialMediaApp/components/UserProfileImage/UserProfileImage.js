import React from 'react';
import PropTypes from 'prop-types';
import { Image, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import style from './style';
import { useThemeMode } from '../../context/ThemeContext';

const UserProfileImage = (props) => {
  const { colors, brand } = useThemeMode();

  const source =
    typeof props.profileImage === 'string' && props.profileImage.trim()
      ? { uri: props.profileImage }
      : props.profileImage || require('../../assets/images/default_profile.png');

  const ringSize = props.imageDimensions + 8;

  if (props.showRing) {
    return (
      <LinearGradient
        colors={brand.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          style.ring,
          {
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
          },
        ]}
      >
        <View
          style={[
            style.ringInner,
            {
              backgroundColor: colors.background,
              width: ringSize - 4,
              height: ringSize - 4,
              borderRadius: (ringSize - 4) / 2,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <View style={[style.userImageContainer, { borderRadius: props.imageDimensions / 2 }]}>
            <Image
              source={source}
              style={{
                width: props.imageDimensions,
                height: props.imageDimensions,
                borderRadius: props.imageDimensions / 2,
              }}
              resizeMode="cover"
            />
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={[style.userImageContainer, { borderRadius: props.imageDimensions / 2 }]}>
      <Image
        source={source}
        style={{
          width: props.imageDimensions,
          height: props.imageDimensions,
          borderRadius: props.imageDimensions / 2,
        }}
        resizeMode="cover"
      />
    </View>
  );
};

UserProfileImage.propTypes = {
  profileImage: PropTypes.any,
  imageDimensions: PropTypes.number.isRequired,
  showRing: PropTypes.bool,
};

UserProfileImage.defaultProps = {
  showRing: false,
};

export default UserProfileImage;