import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: { position: 'relative' },
  controlsRow: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
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
    fontSize: 12,
  },
});

export default style;