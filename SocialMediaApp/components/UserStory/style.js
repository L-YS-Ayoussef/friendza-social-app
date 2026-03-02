import { StyleSheet } from 'react-native';
import { getFontFamily } from '../../assets/fonts/helper';
import { horizontalScale, scaleFontSize, verticalScale } from '../../assets/styles/scaling';

const style = StyleSheet.create({
  storyContainer: {
    marginRight: horizontalScale(20),
  },
  firstName: {
    fontFamily: getFontFamily('Inter', '500'),
    fontSize: scaleFontSize(14),
    marginTop: verticalScale(8),
    textAlign: 'center',
    // color from tokens in UserStory.js
  },
});

export default style;