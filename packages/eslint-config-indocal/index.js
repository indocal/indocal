module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect', // React version. "detect" automatically picks the version you have installed.
    },
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended', // ESLint recommended styles rules
    'plugin:@typescript-eslint/recommended', // TypeScript recommended styles rules
    'next/core-web-vitals', // Nextjs + Web vitals rules
    'turbo', // Turborepo rules
    'prettier', // Prettier config to works with ESLint
  ],
  rules: {
    eqeqeq: 'warn',
    'no-console': 'error', // Prevent console use to avoid sensible information leaks
    'react/prop-types': 'off', // We will use TypeScript's types for component props instead
    '@typescript-eslint/no-unused-vars': 'error', // Why would you want unused vars?
    '@typescript-eslint/explicit-function-return-type': [
      'error', // Setting for requiring return types on functions
      {
        allowExpressions: true,
        allowConciseArrowFunctionExpressionsStartingWithVoid: true,
      },
    ],
  },
};
