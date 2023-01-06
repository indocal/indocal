/* eslint-disable @typescript-eslint/no-var-requires */
const withTM = require('next-transpile-modules')([
  '@indocal/forms-generator',
  '@indocal/services',
  '@indocal/theme',
  '@indocal/ui',
  '@indocal/utils',
]);

/** @type {import('next').NextConfig} */
module.exports = withTM({
  reactStrictMode: true,
  staticPageGenerationTimeout: 60 * 15,
});
