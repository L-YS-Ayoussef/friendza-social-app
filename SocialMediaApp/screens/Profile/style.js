import { StyleSheet } from 'react-native';
import { horizontalScale, scaleFontSize, verticalScale } from '../../assets/styles/scaling';
import { getFontFamily } from '../../assets/fonts/helper';

const style = StyleSheet.create({
  topRightActionRow: {
    marginTop: verticalScale(8),
    marginHorizontal: horizontalScale(16),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconButton: {
    width: horizontalScale(34),
    height: horizontalScale(34),
    borderRadius: horizontalScale(17),
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: horizontalScale(110),
    height: horizontalScale(110),
    borderRadius: horizontalScale(55),
  },
  profileImageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalScale(10),
  },
  profileImageContent: {
    borderWidth: 1.5,
    padding: horizontalScale(4),
    borderRadius: horizontalScale(120),
    position: 'relative',
  },
  avatarEditBadge: {
    position: 'absolute',
    right: horizontalScale(2),
    bottom: horizontalScale(2),
    width: horizontalScale(24),
    height: horizontalScale(24),
    borderRadius: horizontalScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarActionRow: {
    marginTop: verticalScale(10),
    flexDirection: 'row',
    justifyContent: 'center',
    gap: horizontalScale(12),
  },
  avatarActionIcon: {
    width: horizontalScale(40),
    height: horizontalScale(40),
    borderRadius: horizontalScale(20),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    marginTop: verticalScale(16),
    textAlign: 'center',
    fontFamily: getFontFamily('Inter', '600'),
    fontSize: scaleFontSize(20),
  },
  userHandle: {
    marginTop: verticalScale(6),
    textAlign: 'center',
    fontFamily: getFontFamily('Inter', '400'),
    fontSize: scaleFontSize(13),
  },
  bioText: {
    marginTop: verticalScale(8),
    textAlign: 'center',
    marginHorizontal: horizontalScale(24),
    fontFamily: getFontFamily('Inter', '400'),
    fontSize: scaleFontSize(13),
  },
  statAmount: {
    fontFamily: getFontFamily('Inter', '600'),
    fontSize: scaleFontSize(20),
    textAlign: 'center',
  },
  statType: {
    fontFamily: getFontFamily('Inter', '400'),
    fontSize: scaleFontSize(16),
    textAlign: 'center',
  },
  statContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: horizontalScale(40),
    paddingVertical: verticalScale(24),
    borderBottomWidth: 1,
    borderTopWidth: 1,
    marginTop: verticalScale(18),
  },
  statBorder: {
    borderRightWidth: 1,
  },
});

export default style;