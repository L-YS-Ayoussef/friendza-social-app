import { StyleSheet } from 'react-native';
import { horizontalScale, verticalScale, scaleFontSize } from '../../assets/styles/scaling';
import { getFontFamily } from '../../assets/fonts/helper';

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(12),
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: getFontFamily('Inter', '700'),
    fontSize: scaleFontSize(20),
    marginBottom: verticalScale(14),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
  },
  text: {
    flex: 1,
    marginRight: horizontalScale(10),
    fontFamily: getFontFamily('Inter', '400'),
  },
  bold: {
    fontFamily: getFontFamily('Inter', '600'),
  },
  thumb: {
    width: horizontalScale(44),
    height: horizontalScale(44),
    borderRadius: 8,
  },
  emptyText: {
    marginTop: verticalScale(20),
    textAlign: 'center',
    fontFamily: getFontFamily('Inter', '400'),
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },

  likeAvatarWrap: {
    marginRight: 10,
  },

  likeText: {
    fontSize: 14,
  },

  likeName: {
    fontWeight: '700',
  },
});

export default style;