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
    backgroundColor: '#F8FAFC',
  },
  appName: {
    fontFamily: getFontFamily('Inter', '700'),
    fontSize: scaleFontSize(20),
    color: '#111827',
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
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addStoryText: {
    marginTop: verticalScale(4),
    color: '#334155',
    fontSize: scaleFontSize(11),
    fontFamily: getFontFamily('Inter', '500'),
    textAlign: 'center',
  },
  userPostContainer: {
    marginHorizontal: horizontalScale(16),
  },
  emptyContainer: {
    marginTop: verticalScale(30),
    alignItems: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontFamily: getFontFamily('Inter', '400'),
    fontSize: scaleFontSize(13),
    textAlign: 'center',
  },
});

export default style;