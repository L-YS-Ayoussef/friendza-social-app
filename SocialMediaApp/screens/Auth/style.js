import { StyleSheet } from 'react-native';
import { horizontalScale, verticalScale, scaleFontSize } from '../../assets/styles/scaling';
import { getFontFamily } from '../../assets/fonts/helper';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: horizontalScale(20),
    justifyContent: 'center',
  },
  title: {
    fontSize: scaleFontSize(26),
    fontFamily: getFontFamily('Inter', '700'),
    color: '#022150',
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontSize: scaleFontSize(14),
    color: '#79869F',
    marginBottom: verticalScale(24),
    fontFamily: getFontFamily('Inter', '400'),
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(12),
    fontFamily: getFontFamily('Inter', '400'),
    color: '#111827',
  },
  button: {
    backgroundColor: '#0150EC',
    borderRadius: 10,
    paddingVertical: verticalScale(13),
    alignItems: 'center',
    marginTop: verticalScale(4),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(15),
    fontFamily: getFontFamily('Inter', '600'),
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalScale(18),
  },
  footerText: {
    color: '#6B7280',
    fontFamily: getFontFamily('Inter', '400'),
  },
  footerLink: {
    color: '#0150EC',
    fontFamily: getFontFamily('Inter', '600'),
  },
});

export default style;