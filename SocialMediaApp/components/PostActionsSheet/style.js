import { StyleSheet } from 'react-native';
import { horizontalScale, verticalScale, scaleFontSize } from '../../assets/styles/scaling';
import { getFontFamily } from '../../assets/fonts/helper';

export default StyleSheet.create({
  backdrop: {
    flex: 1,
    // backgroundColor is applied dynamically from Theme tokens (colors.scrim)
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(18),
    paddingHorizontal: horizontalScale(16),
    // backgroundColor is applied dynamically from Theme tokens (colors.surface2)
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderTopWidth: 1, // border color applied dynamically (colors.border)
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 48,
    height: 5,
    borderRadius: 3,
    // backgroundColor is applied dynamically from Theme tokens (colors.border)
    marginBottom: verticalScale(10),
  },
  title: {
    fontFamily: getFontFamily('Inter', '700'),
    fontSize: scaleFontSize(14),
    // color is applied dynamically from Theme tokens (colors.text)
    marginBottom: verticalScale(10),
  },
  row: {
    paddingVertical: verticalScale(14),
    borderBottomWidth: 1,
    // borderBottomColor applied dynamically (colors.border)
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
    // color applied dynamically (colors.text)
  },
  rowTextDanger: {
    // danger color is handled dynamically in component (colors.error)
  },
  cancelBtn: {
    marginTop: verticalScale(12),
    paddingVertical: verticalScale(14),
    borderRadius: 12,
    // backgroundColor applied dynamically (colors.surface1)
    alignItems: 'center',
  },
  cancelText: {
    fontFamily: getFontFamily('Inter', '700'),
    // color applied dynamically (colors.text)
  },
});