import { StyleSheet } from 'react-native';
import { horizontalScale, verticalScale, scaleFontSize } from '../../assets/styles/scaling';
import { getFontFamily } from '../../assets/fonts/helper';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrap: {
    paddingHorizontal: horizontalScale(10),
    paddingTop: verticalScale(8),
  },
  sectionTitle: {
    marginTop: verticalScale(10),
    marginBottom: verticalScale(6),
    paddingHorizontal: horizontalScale(14),
    fontFamily: getFontFamily('Inter', '700'),
    fontSize: scaleFontSize(13),
  },
  commentRow: {
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
  },
  commentTextBlock: { flex: 1, marginLeft: horizontalScale(10) },
  nameText: {
    fontFamily: getFontFamily('Inter', '600'),
    fontSize: scaleFontSize(13),
  },
  commentText: {
    marginTop: verticalScale(2),
    fontFamily: getFontFamily('Inter', '400'),
    fontSize: scaleFontSize(13),
  },
  emptyText: {
    textAlign: 'center',
    marginTop: verticalScale(18),
    fontFamily: getFontFamily('Inter', '400'),
  },
});