import { StyleSheet } from 'react-native';
import { getFontFamily } from '../../assets/fonts/helper';
import { scaleFontSize } from '../../assets/styles/scaling';

const style = StyleSheet.create({
  title: {
    fontFamily: getFontFamily('Inter', '600'),
    fontSize: scaleFontSize(24),
  },
});

export default style;