import { StyleSheet } from 'react-native';
import { getFontFamily } from '../../assets/fonts/helper';
import { horizontalScale, scaleFontSize, verticalScale } from '../../assets/styles/scaling';

const style = StyleSheet.create({
  userContainer: { flexDirection: 'row' },
  userTextContainer: {
    justifyContent: 'center',
    marginLeft: horizontalScale(10),
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  username: {
    color: '#000',
    fontFamily: getFontFamily('Inter', '600'),
    fontSize: scaleFontSize(16),
  },
  location: {
    color: '#79869F',
    fontFamily: getFontFamily('Inter', '400'),
    fontSize: scaleFontSize(16),
    marginTop: verticalScale(5),
  },
  mediaContainer: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  postImage: {
    width: '100%',
    height: 260,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    marginTop: 8, // can be commented out if not needed
  },
  postImageSource: {
    width: '100%',
    height: verticalScale(220),
    borderRadius: horizontalScale(10),
  },
  userPostContainer: {
    marginTop: verticalScale(5),
    paddingBottom: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: '#EFF2F6',
  },
  userPostStats: { marginLeft: horizontalScale(10), flexDirection: 'row' },
  userPostStatButton: { flexDirection: 'row' },
  userPostStatButtonRight: { flexDirection: 'row', marginLeft: horizontalScale(27) },
  userPostStatText: { marginLeft: horizontalScale(3), color: '#79869F', marginTop: -2 },
});

export default style;