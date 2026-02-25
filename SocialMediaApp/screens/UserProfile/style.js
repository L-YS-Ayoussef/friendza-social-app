import { StyleSheet } from 'react-native';
import { horizontalScale, verticalScale, scaleFontSize } from '../../assets/styles/scaling';
import { getFontFamily } from '../../assets/fonts/helper';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(16),
  },
  centered: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarWrap: {
    alignItems: 'center',
    marginTop: verticalScale(6),
  },
  avatar: {
    width: horizontalScale(96),
    height: horizontalScale(96),
    borderRadius: horizontalScale(48),
  },
  name: {
    marginTop: verticalScale(12),
    textAlign: 'center',
    fontFamily: getFontFamily('Inter', '600'),
    fontSize: scaleFontSize(18),
    color: '#111827',
  },
  username: {
    marginTop: verticalScale(4),
    textAlign: 'center',
    color: '#64748B',
    fontFamily: getFontFamily('Inter', '400'),
  },
  bio: {
    marginTop: verticalScale(10),
    textAlign: 'center',
    color: '#334155',
    fontFamily: getFontFamily('Inter', '400'),
    paddingHorizontal: horizontalScale(20),
  },
  statsRow: {
    marginTop: verticalScale(20),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: verticalScale(14),
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: '#111827',
    fontFamily: getFontFamily('Inter', '600'),
    fontSize: scaleFontSize(16),
  },
  statLabel: {
    color: '#64748B',
    fontFamily: getFontFamily('Inter', '400'),
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E2E8F0',
  },
  followButton: {
    marginTop: verticalScale(18),
    backgroundColor: '#0150EC',
    borderRadius: 10,
    paddingVertical: verticalScale(11),
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: '#EFF6FF',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontFamily: getFontFamily('Inter', '600'),
  },
  followingButtonText: {
    color: '#0150EC',
  },
  privateNotice: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#F8FAFC',
  },
  privateNoticeTitle: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  privateNoticeText: {
    color: '#64748B',
  },
});

export default style;