/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['@tanstack/query-core', '@tanstack/react-query']);

const nextConfig = {
  trailingSlash: false,
  reactStrictMode: false,
  output: 'export',
  basePath: process.env.BASE_PATH || '',
  assetPrefix: process.env.ASSET_PREFIX || '',
  transpilePackages: ['@tanstack/query-core', '@tanstack/react-query', '@tanstack/react-query-devtools'],
  // devIndicators: false,
};

module.exports = withTM(nextConfig);
