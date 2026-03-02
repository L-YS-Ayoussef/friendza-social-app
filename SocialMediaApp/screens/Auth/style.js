import { StyleSheet } from 'react-native';
import { horizontalScale, verticalScale, scaleFontSize } from '../../assets/styles/scaling';
import { getFontFamily } from '../../assets/fonts/helper';

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
    justifyContent: 'center',
    // backgroundColor from tokens in screen
  },
  title: {
    fontSize: scaleFontSize(26),
    fontFamily: getFontFamily('Inter', '700'),
    marginBottom: verticalScale(8),
    // color from tokens in screen
  },
  subtitle: {
    fontSize: scaleFontSize(14),
    marginBottom: verticalScale(24),
    fontFamily: getFontFamily('Inter', '400'),
    // color from tokens in screen
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(12),
    fontFamily: getFontFamily('Inter', '400'),
    // backgroundColor/borderColor/color from tokens in screen
  },
  button: {
    borderRadius: 10,
    paddingVertical: verticalScale(13),
    alignItems: 'center',
    marginTop: verticalScale(4),
    // backgroundColor from tokens in screen
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: scaleFontSize(15),
    fontFamily: getFontFamily('Inter', '600'),
    // color from tokens in screen
  },
  footerRow: {
    justifyContent: 'center',
    marginTop: verticalScale(18),
  },
  footerText: {
    fontFamily: getFontFamily('Inter', '400'),
    // color from tokens in screen
  },
  footerLink: {
    fontFamily: getFontFamily('Inter', '600'),
    // color from tokens in screen
  },
});

export default style;