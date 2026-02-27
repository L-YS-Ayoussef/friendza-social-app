import { StyleSheet } from 'react-native';
import { horizontalScale, verticalScale, scaleFontSize } from '../../assets/styles/scaling';
import { getFontFamily } from '../../assets/fonts/helper';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  absoluteMedia: {
    ...StyleSheet.absoluteFillObject,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },

  safeOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },

  topArea: {
    paddingTop: 8,
    paddingHorizontal: 10,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  progressTrack: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
    marginHorizontal: 2,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  headerTimeText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    marginTop: 1,
  },

  captionContainer: {
    paddingHorizontal: 12,
    paddingBottom: 18,
  },

  captionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },

  tapLayer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },

  leftZone: {
    flex: 1,
  },

  rightZone: {
    flex: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});

export default style;