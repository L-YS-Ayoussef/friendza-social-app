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
    marginBottom: verticalScale(12),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: horizontalScale(10),
    marginBottom: verticalScale(10),
  },
  textBlock: {
    flex: 1,
    marginLeft: horizontalScale(10),
  },
  name: {
    fontFamily: getFontFamily('Inter', '600'),
  },
  username: {
    fontFamily: getFontFamily('Inter', '400'),
    marginTop: 2,
  },
  viewText: {
    fontFamily: getFontFamily('Inter', '600'),
    fontSize: scaleFontSize(13),
  },
  emptyText: {
    textAlign: 'center',
    marginTop: verticalScale(20),
    fontFamily: getFontFamily('Inter', '400'),
  },
});

export default style;