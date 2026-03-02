import { Dimensions, StyleSheet } from 'react-native';
import { horizontalScale, verticalScale, scaleFontSize } from '../../assets/styles/scaling';
import { getFontFamily } from '../../assets/fonts/helper';

const cellSize = Dimensions.get('window').width / 3;

const style = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor from tokens in component
  },
  listContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(8),
  },
  centered: {
    flex: 1,
    // backgroundColor from tokens in component
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
  },
  username: {
    marginTop: verticalScale(4),
    textAlign: 'center',
    fontFamily: getFontFamily('Inter', '400'),
  },
  bio: {
    marginTop: verticalScale(10),
    textAlign: 'center',
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
    paddingVertical: verticalScale(14),
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontFamily: getFontFamily('Inter', '600'),
    fontSize: scaleFontSize(16),
  },
  statLabel: {
    fontFamily: getFontFamily('Inter', '400'),
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: '80%',
  },

  actionsRow: {
    marginTop: verticalScale(18),
    flexDirection: 'row',
    gap: horizontalScale(10),
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: verticalScale(11),
    paddingHorizontal: horizontalScale(10),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  actionButtonText: {
    fontFamily: getFontFamily('Inter', '600'),
    fontSize: scaleFontSize(13),
  },

  privateNotice: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  privateNoticeTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  privateNoticeText: {},

  postsLoading: {
    paddingVertical: 14,
    alignItems: 'center',
  },

  emptyWrap: {
    paddingVertical: 22,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: getFontFamily('Inter', '400'),
  },

  cell: {
    width: cellSize,
    height: cellSize,
    padding: 1,
  },
  thumb: {
    width: '100%',
    height: '100%',
    // backgroundColor from tokens in component
  },
});

export default style;