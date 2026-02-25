import { Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const { width, height } = Dimensions.get('window');
const isSmall = width <= 375 && !DeviceInfo.hasNotch();
// DeviceInfo.hasNotch() (from react-native-device-info) is a sync method that returns true if the device has a display cutout/notch. You’re using !DeviceInfo.hasNotch() to treat the device as “small” only when width ≤ 375 and there’s no notch.
// A display cutout/notch is a small area that intrudes into the screen (top or corner) to house the camera/sensors—making the screen not perfectly rectangular. It affects layout, so apps use safe-area insets to avoid drawing under it.

const guidelineBaseWidth = () => {
  if (isSmall) {
    return 330;
  }
  return 350;
};
const horizontalScale = (size) => (width / guidelineBaseWidth()) * size;

const guidelineBaseHeight = () => {
  if (isSmall) {
    return 550;
  } else if (width > 410) {
    return 620;
  }
  return 680;
};
const verticalScale = (size) => (height / guidelineBaseHeight()) * size;

const guidelineBaseFonts = () => {
  if (width > 410) {
    return 430;
  }
  return 400;
};
const scaleFontSize = (size) => Math.round((width / guidelineBaseFonts()) * size);

export { horizontalScale, verticalScale, scaleFontSize };
