import { StyleSheet } from 'react-native';
import { horizontalScale, verticalScale, scaleFontSize } from '../../assets/styles/scaling';
import { getFontFamily } from '../../assets/fonts/helper';

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
    justifyContent: 'center',
  },
  title: {
    fontSize: scaleFontSize(26),
    fontFamily: getFontFamily('Inter', '700'),
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontSize: scaleFontSize(14),
    marginBottom: verticalScale(24),
    fontFamily: getFontFamily('Inter', '400'),
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(12),
    fontFamily: getFontFamily('Inter', '400'),
  },
  button: {
    borderRadius: 10,
    paddingVertical: verticalScale(13),
    alignItems: 'center',
    marginTop: verticalScale(4),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: scaleFontSize(15),
    fontFamily: getFontFamily('Inter', '600'),
  },
  footerRow: {
    justifyContent: 'center',
    marginTop: verticalScale(18),
  },
  footerText: {
    fontFamily: getFontFamily('Inter', '400'),
  },
  footerLink: {
    fontFamily: getFontFamily('Inter', '600'),
  },
});

export default style;