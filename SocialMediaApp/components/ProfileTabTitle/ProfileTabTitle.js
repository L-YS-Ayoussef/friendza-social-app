import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import style from './style';
import { useThemeMode } from '../../context/ThemeContext';

const ProfileTabTitle = (props) => {
  const { colors } = useThemeMode();

  return (
    <Text
      style={[
        style.title,
        { color: props.isFocused ? colors.primary : colors.muted },
      ]}
    >
      {props.title}
    </Text>
  );
};

ProfileTabTitle.propTypes = {
  title: PropTypes.string.isRequired,
  isFocused: PropTypes.bool.isRequired,
};

export default ProfileTabTitle;