import { StyleSheet } from 'react-native';
import { getFontFamily } from '../../assets/fonts/helper';
import { horizontalScale, scaleFontSize } from '../../assets/styles/scaling';

const style = StyleSheet.create({
  title: {
    fontFamily: getFontFamily('Inter', '500'),
    fontSize: scaleFontSize(16),
    padding: horizontalScale(15),
  },
});

export default style;