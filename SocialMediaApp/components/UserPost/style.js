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
    fontFamily: getFontFamily('Inter', '600'),
    fontSize: scaleFontSize(16),
    // color from tokens in UserPost.js
  },

  location: {
    fontFamily: getFontFamily('Inter', '400'),
    fontSize: scaleFontSize(16),
    marginTop: verticalScale(5),
    // color from tokens in UserPost.js
  },

  mediaContainer: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
    // backgroundColor from tokens in UserPost.js (via container)
  },

  postImage: {
    width: '100%',
    height: 260,
    borderRadius: 10,
    marginTop: 8, // keep if you want spacing, remove if not needed
    // backgroundColor from tokens in PostMedia fallback / container
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
    // borderBottomColor from tokens in UserPost.js
  },

  userPostStats: { marginLeft: horizontalScale(10), flexDirection: 'row' },
  userPostStatButton: { flexDirection: 'row' },
  userPostStatButtonRight: { flexDirection: 'row', marginLeft: horizontalScale(27) },

  userPostStatText: {
    marginLeft: horizontalScale(3),
    marginTop: -2,
    // color from tokens in UserPost.js
  },

  postMetaText: {
    marginTop: 2,
    fontSize: 12,
    // color from tokens in UserPost.js
  },
});

export default style;