import React from 'react';
import { Text } from 'react-native';

import style from './style';
import PropTypes from 'prop-types'; // React PropTypes (runtime prop validation)
const Title = (props) => {
  return <Text style={style.title}>{props.title}</Text>;
};

// Declares that the Title component must receive a title prop that is a string and required.
Title.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Title;
