/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/LOVE20-interface',
  assetPrefix: '/LOVE20-interface/',
  trailingSlash: true,
  exportTrailingSlash: true,
  reactStrictMode: true,
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
};

module.exports = nextConfig;
