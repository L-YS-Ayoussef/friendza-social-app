import { StyleSheet } from 'react-native';
import { horizontalScale, verticalScale, scaleFontSize } from '../../assets/styles/scaling';
import { getFontFamily } from '../../assets/fonts/helper';

const style = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: {
    paddingHorizontal: horizontalScale(14),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(90),
  },
  commentRow: {
    flexDirection: 'row',
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
  },
  commentTextBlock: {
    flex: 1,
    marginLeft: horizontalScale(10),
  },
  nameText: {
    fontFamily: getFontFamily('Inter', '600'),
    fontSize: scaleFontSize(13),
  },
  commentText: {
    marginTop: verticalScale(2),
    fontFamily: getFontFamily('Inter', '400'),
    fontSize: scaleFontSize(13),
  },
  emptyText: {
    textAlign: 'center',
    marginTop: verticalScale(20),
    fontFamily: getFontFamily('Inter', '400'),
  },
  inputRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(10),
    marginRight: horizontalScale(8),
    fontFamily: getFontFamily('Inter', '400'),
  },
  sendButton: {
    borderRadius: 10,
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(10),
  },
  sendButtonText: {
    color: '#fff',
    fontFamily: getFontFamily('Inter', '600'),
    fontSize: scaleFontSize(13),
  },
});

export default style;