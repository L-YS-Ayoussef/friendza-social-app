import { StyleSheet } from 'react-native';
import { horizontalScale, verticalScale, scaleFontSize } from '../../assets/styles/scaling';
import { getFontFamily } from '../../assets/fonts/helper';

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(12),
    // backgroundColor from tokens
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor from tokens
  },
  title: {
    fontFamily: getFontFamily('Inter', '700'),
    fontSize: scaleFontSize(20),
    marginBottom: verticalScale(12),
    // color from tokens
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: horizontalScale(10),
    marginBottom: verticalScale(10),
    // backgroundColor/borderColor from tokens
  },
  textBlock: {
    flex: 1,
    marginLeft: horizontalScale(10),
  },
  name: {
    fontFamily: getFontFamily('Inter', '600'),
    // color from tokens
  },
  username: {
    fontFamily: getFontFamily('Inter', '400'),
    marginTop: 2,
    // color from tokens
  },
  viewText: {
    fontFamily: getFontFamily('Inter', '600'),
    fontSize: scaleFontSize(13),
    // color from tokens
  },
  emptyText: {
    textAlign: 'center',
    marginTop: verticalScale(20),
    fontFamily: getFontFamily('Inter', '400'),
    // color from tokens
  },
});

export default style;