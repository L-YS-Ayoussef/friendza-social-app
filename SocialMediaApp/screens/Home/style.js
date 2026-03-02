import { StyleSheet } from 'react-native';
import { getFontFamily } from '../../assets/fonts/helper';
import { horizontalScale, scaleFontSize, verticalScale } from '../../assets/styles/scaling';

const style = StyleSheet.create({
  topBar: {
    marginTop: verticalScale(12),
    marginHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topIconButton: {
    width: horizontalScale(34),
    height: horizontalScale(34),
    borderRadius: horizontalScale(17),
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor applied from tokens in Home.js
  },
  appName: {
    fontFamily: getFontFamily('Inter', '700'),
    fontSize: scaleFontSize(20),
    // color applied from tokens in Home.js
  },
  userStoryContainer: {
    marginTop: verticalScale(10),
    marginHorizontal: horizontalScale(12),
    paddingBottom: verticalScale(8),
  },
  addStoryContainer: {
    alignItems: 'center',
    marginRight: horizontalScale(12),
    width: horizontalScale(74),
  },
  addStoryCircle: {
    width: horizontalScale(65),
    height: horizontalScale(65),
    borderRadius: horizontalScale(33),
    alignItems: 'center',
    justifyContent: 'center',
    // border/background applied from tokens in Home.js
  },
  addStoryText: {
    marginTop: verticalScale(4),
    fontSize: scaleFontSize(11),
    fontFamily: getFontFamily('Inter', '500'),
    textAlign: 'center',
    // color applied from tokens in Home.js
  },
  userPostContainer: {
    marginHorizontal: horizontalScale(16),
  },
  emptyContainer: {
    marginTop: verticalScale(30),
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: getFontFamily('Inter', '400'),
    fontSize: scaleFontSize(13),
    textAlign: 'center',
    // color applied from tokens in Home.js
  },
});

export default style;