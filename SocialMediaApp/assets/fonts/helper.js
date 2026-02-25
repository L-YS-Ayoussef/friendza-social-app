/**
* Returns the appropriate font family based on the weight.
* @param {string} baseFont - The desired font in case you're using something different in your later projects
* @param {string} weight - The desired font weight(e.g., 'normal', 'bold', '600')
* @returns {string} - The appropriate font family for the platform.
// "@param" is a JSDoc tag used in comments to document a function’s parameter
*/
export const getFontFamily = (baseFont = 'Inter', weight) => {
  switch (weight) {
    case '100':
      return `${baseFont}-Thin`;
    case '200':
      return `${baseFont}-ExtraLight`;
    case '300':
      return `${baseFont}-Light`;
    case 'normal':
    case '400':
      return `${baseFont}-Regular`;
    case '500':
      return `${baseFont}-Medium`;
    case '600':
      return `${baseFont}-SemiBold`;
    case 'bold':
    case '700':
      return `${baseFont}-Bold`;
    case '800':
      return `${baseFont}-ExtraBold`;
    case '900':
      return `${baseFont}-Black`;
    default: // Default to regular if the weight is not recognized
      return `${baseFont}-Regular`;
  }
};

// Note: To add fonts to react native project -> Here are the steps -->
// 1) Download the fonts ".ttf" files and place them inside assets/fonts
// 2) The file "react-native.config.js"
// 3) Run the command: "npx react-native-asset" -> This creates android/app/src/main/assets/fonts/… and adds fonts to iOS.
// 4) Clean & rebuild (fonts require a native rebuild) using the commands -> "cd android && gradlew clean && cd .." and "npx react-native run-android"
