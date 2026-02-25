import { StyleSheet } from 'react-native';

const globalStyle = StyleSheet.create({
  backgroundWhite: {
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  // The "flexGrow" property -> controls how much a flex item expands to fill leftover space along the main axis relative to its siblings. Default 0 = don’t grow. 1 (or higher) = take remaining space; bigger numbers take more than others.
  flexGrow: {
    flexGrow: 1,
  },
});

export default globalStyle;
