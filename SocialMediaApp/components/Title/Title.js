import React from 'react';
import { Text } from 'react-native';

import style from './style';
import PropTypes from 'prop-types';
import { useThemeMode } from '../../context/ThemeContext';

const Title = (props) => {
  const { colors } = useThemeMode();
  return <Text style={[style.title, { color: colors.text }]}>{props.title}</Text>;
};

Title.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Title;