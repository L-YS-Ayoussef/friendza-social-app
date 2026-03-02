import { StyleSheet } from 'react-native';
import { horizontalScale } from '../../assets/styles/scaling';

const style = StyleSheet.create({
  userImageContainer: {
    borderColor: '#F35BAC',
    borderWidth: 1,
    padding: horizontalScale(3),
  },
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  ringInner: {
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default style;
