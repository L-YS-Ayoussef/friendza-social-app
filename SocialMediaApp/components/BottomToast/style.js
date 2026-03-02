import { StyleSheet } from 'react-native';
import { horizontalScale, verticalScale, scaleFontSize } from '../../assets/styles/scaling';
import { getFontFamily } from '../../assets/fonts/helper';

export default StyleSheet.create({
  toast: {
    position: 'absolute',
    left: horizontalScale(16),
    right: horizontalScale(16),
    bottom: verticalScale(18),
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(14),
    borderRadius: 12,
  },
  toastText: {
    fontFamily: getFontFamily('Inter', '600'),
    fontSize: scaleFontSize(13),
    textAlign: 'center',
  },
});