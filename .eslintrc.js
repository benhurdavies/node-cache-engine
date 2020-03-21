const prettierConfig = require('./prettier.config');

module.exports = {
  extends: ['prettier', 'plugin:prettier/recommended', 'eslint-config-prettier'],
  parser: 'babel-eslint',
  plugins: ['babel'],
  env: {
    jest: true,
  },
  rules: {
    quotes: ['error', 'single'],
    'prettier/prettier': ['error', prettierConfig],
  },
};