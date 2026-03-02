import { StyleSheet } from 'react-native';
import { horizontalScale, verticalScale, scaleFontSize } from '../../assets/styles/scaling';
import { getFontFamily } from '../../assets/fonts/helper';

export default StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor from tokens in component
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
    // color from tokens in component
  },
  commentRow: {
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    // borderBottomColor from tokens in component
  },
  commentTextBlock: { flex: 1, marginLeft: horizontalScale(10) },
  nameText: {
    fontFamily: getFontFamily('Inter', '600'),
    fontSize: scaleFontSize(13),
    // color from tokens in component
  },
  commentText: {
    marginTop: verticalScale(2),
    fontFamily: getFontFamily('Inter', '400'),
    fontSize: scaleFontSize(13),
    // color from tokens in component
  },
  emptyText: {
    textAlign: 'center',
    marginTop: verticalScale(18),
    fontFamily: getFontFamily('Inter', '400'),
    // color from tokens in component
  },
});