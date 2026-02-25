import { StyleSheet } from 'react-native';
import { horizontalScale, verticalScale, scaleFontSize } from '../../assets/styles/scaling';
import { getFontFamily } from '../../assets/fonts/helper';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    color: '#111827',
    marginBottom: verticalScale(14),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  text: {
    flex: 1,
    marginRight: horizontalScale(10),
    color: '#334155',
    fontFamily: getFontFamily('Inter', '400'),
  },
  bold: {
    fontFamily: getFontFamily('Inter', '600'),
    color: '#111827',
  },
  thumb: {
    width: horizontalScale(44),
    height: horizontalScale(44),
    borderRadius: 8,
  },
  emptyText: {
    marginTop: verticalScale(20),
    textAlign: 'center',
    color: '#94A3B8',
    fontFamily: getFontFamily('Inter', '400'),
  },
});

export default style;