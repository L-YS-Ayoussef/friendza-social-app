import { StyleSheet } from 'react-native';
import { horizontalScale, verticalScale, scaleFontSize } from '../../assets/styles/scaling';
import { getFontFamily } from '../../assets/fonts/helper';

export default StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(18),
    paddingHorizontal: horizontalScale(16),
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    marginBottom: verticalScale(10),
  },
  title: {
    fontFamily: getFontFamily('Inter', '700'),
    fontSize: scaleFontSize(14),
    color: '#111827',
    marginBottom: verticalScale(10),
  },
  row: {
    paddingVertical: verticalScale(14),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowDanger: {},
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowText: {
    fontFamily: getFontFamily('Inter', '600'),
    fontSize: scaleFontSize(13),
    color: '#111827',
  },
  rowTextDanger: {
    color: '#EF4444',
  },
  cancelBtn: {
    marginTop: verticalScale(12),
    paddingVertical: verticalScale(14),
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelText: {
    fontFamily: getFontFamily('Inter', '700'),
    color: '#111827',
  },
});