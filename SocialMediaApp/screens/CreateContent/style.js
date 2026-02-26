import { StyleSheet } from 'react-native';
import { horizontalScale, verticalScale, scaleFontSize } from '../../assets/styles/scaling';
import { getFontFamily } from '../../assets/fonts/helper';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: horizontalScale(20),
  },
  content: {
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(24),
  },
  title: {
    fontSize: scaleFontSize(24),
    fontFamily: getFontFamily('Inter', '700'),
    color: '#022150',
    marginBottom: verticalScale(6),
  },
  subtitle: {
    fontSize: scaleFontSize(13),
    color: '#79869F',
    marginBottom: verticalScale(18),
    fontFamily: getFontFamily('Inter', '400'),
  },
  label: {
    marginBottom: verticalScale(6),
    fontFamily: getFontFamily('Inter', '500'),
    color: '#334155',
    fontSize: scaleFontSize(13),
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(14),
    color: '#111827',
    fontFamily: getFontFamily('Inter', '400'),
  },
  textArea: {
    minHeight: verticalScale(90),
    textAlignVertical: 'top',
  },
  mediaActionRow: {
    flexDirection: 'row',
    gap: horizontalScale(10),
    marginBottom: verticalScale(14),
  },
  previewBox: {
    width: '100%',
    height: verticalScale(220),
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: verticalScale(14),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    color: '#94A3B8',
    fontFamily: getFontFamily('Inter', '400'),
  },
  button: {
    backgroundColor: '#0150EC',
    borderRadius: 10,
    paddingVertical: verticalScale(13),
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: getFontFamily('Inter', '600'),
    fontSize: scaleFontSize(15),
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },

  sourceIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});

export default style;