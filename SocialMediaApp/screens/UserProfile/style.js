import { Dimensions, StyleSheet } from 'react-native';
import { horizontalScale, verticalScale, scaleFontSize } from '../../assets/styles/scaling';
import { getFontFamily } from '../../assets/fonts/helper';

const cellSize = Dimensions.get('window').width / 3;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  actionButtonPrimary: {
    backgroundColor: '#0150EC',
  },
  actionButtonSecondary: {
    backgroundColor: '#EFF6FF',
  },
  actionButtonDanger: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    fontFamily: getFontFamily('Inter', '600'),
    fontSize: scaleFontSize(13),
  },
  actionButtonTextPrimary: {
    color: '#FFFFFF',
  },
  actionButtonTextSecondary: {
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

  postsLoading: {
    paddingVertical: 14,
    alignItems: 'center',
  },

  emptyWrap: {
    paddingVertical: 22,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748B',
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
    backgroundColor: '#ddd',
  },
});

export default style;