module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
  },
  plugins: [
    'react',
  ],
  rules: {
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'no-console': 'off',
    'arrow-parens': [
      'error', 'as-needed',
    ],
    'no-use-before-define': [
      'error', { functions: false, classes: false, variables: false },
    ],
    'consistent-return': 'off',
    'linebreak-style': [
      'error',
      'windows',
    ],
  },
};
