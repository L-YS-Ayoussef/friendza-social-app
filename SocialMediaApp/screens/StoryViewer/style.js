import { StyleSheet } from 'react-native';
import { horizontalScale, verticalScale, scaleFontSize } from '../../assets/styles/scaling';
import { getFontFamily } from '../../assets/fonts/helper';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.20)',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: horizontalScale(10),
  },
  progressRow: {
    flexDirection: 'row',
    marginTop: verticalScale(6),
    gap: horizontalScale(4),
  },
  progressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFillDone: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  progressFillActive: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginTop: verticalScale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(4),
  },
  headerName: {
    color: '#FFFFFF',
    fontFamily: getFontFamily('Inter', '600'),
    fontSize: scaleFontSize(15),
  },
  captionContainer: {
    position: 'absolute',
    bottom: verticalScale(30),
    left: horizontalScale(16),
    right: horizontalScale(16),
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 10,
    padding: horizontalScale(10),
  },
  captionText: {
    color: '#FFFFFF',
    fontFamily: getFontFamily('Inter', '400'),
    fontSize: scaleFontSize(13),
  },
  tapLayer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    top: verticalScale(70),
  },
  leftZone: {
    flex: 1,
  },
  rightZone: {
    flex: 1,
  },
});

export default style;