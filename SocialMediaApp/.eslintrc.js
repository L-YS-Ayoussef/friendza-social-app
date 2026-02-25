module.exports = {
  root: true,
  extends: [
    '@react-native',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all',
    'plugin:prettier/recommended', // adds "prettier" and shows conflicts as lint errors
  ],
  plugins: ['react', 'react-hooks', 'react-native', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off', // RN doesn't need React import in new JSX transform
    'react-native/no-inline-styles': 'off', // enable later if you want stricter styling
  },
  settings: {
    react: { version: 'detect' },
  },
};
