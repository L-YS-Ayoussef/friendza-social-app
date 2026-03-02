import { StyleSheet, Dimensions } from 'react-native';

const size = Dimensions.get('window').width / 3;

export default StyleSheet.create({
  centered: { paddingVertical: 30, alignItems: 'center' },
  emptyText: { textAlign: 'center' },

  grid: { paddingTop: 6 },
  cell: {
    width: size,
    height: size,
    padding: 1,
  },
  thumb: {
    width: '100%',
    height: '100%',
    // backgroundColor is set from tokens in component
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    // backgroundColor set from tokens in component (colors.scrim)
    alignItems: 'center',
    justifyContent: 'center',
  },
});