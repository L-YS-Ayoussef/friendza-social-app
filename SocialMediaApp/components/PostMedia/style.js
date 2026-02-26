import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: { position: 'relative' },
  controlsRow: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 10,
  },
  ctrlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ctrlText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default style;