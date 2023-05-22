/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 60 * 15,
  transpilePackages: [
    '@indocal/forms-generator',
    '@indocal/services',
    '@indocal/theme',
    '@indocal/ui',
    '@indocal/utils',
  ],
};
