import { StyleSheet } from 'react-native';
import { horizontalScale, verticalScale, scaleFontSize } from '../../assets/styles/scaling';
import { getFontFamily } from '../../assets/fonts/helper';

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(14),
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: getFontFamily('Inter', '700'),
    fontSize: scaleFontSize(20),
    marginBottom: verticalScale(14),
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardColumn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(12),
  },
  textWrap: {
    flex: 1,
    marginRight: horizontalScale(12),
  },
  rowTitle: {
    fontFamily: getFontFamily('Inter', '600'),
    fontSize: scaleFontSize(15),
  },
  rowSub: {
    marginTop: verticalScale(3),
    fontFamily: getFontFamily('Inter', '400'),
    fontSize: scaleFontSize(12),
  },
  langRow: {
    marginTop: verticalScale(10),
    flexDirection: 'row',
    gap: horizontalScale(10),
  },
  langBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: verticalScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default style;