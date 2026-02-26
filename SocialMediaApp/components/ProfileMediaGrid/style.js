import { StyleSheet, Dimensions } from 'react-native';

const size = Dimensions.get('window').width / 3;

export default StyleSheet.create({
  centered: { paddingVertical: 30, alignItems: 'center' },
  grid: { paddingTop: 6 },
  cell: {
    width: size,
    height: size,
    padding: 1,
  },
  thumb: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ddd',
  },
});