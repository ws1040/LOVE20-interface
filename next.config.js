/** @type {import('next').NextConfig} */

const nextConfig = {
  trailingSlash: true, // GitHub Pages 需要这个设置
  reactStrictMode: false,
  output: 'export',
  images: { unoptimized: true },
  basePath: process.env.BASE_PATH || '',
  assetPrefix: process.env.ASSET_PREFIX || '',
  transpilePackages: ['@tanstack/query-core', '@tanstack/react-query', '@tanstack/react-query-devtools'],
  // 确保静态导出时跳过API路由
  async exportPathMap() {
    return {
      '/': { page: '/' },
      '/about': { page: '/about' },
      '/acting': { page: '/acting' },
      '/token': { page: '/token' },
      '/token/intro': { page: '/token/intro' },
      '/acting/join': { page: '/acting/join' },
      '/action/detail': { page: '/action/detail' },
      '/action/new': { page: '/action/new' },
      '/articles': { page: '/articles' },
      '/dex/deposit': { page: '/dex/deposit' },
      '/dex/swap': { page: '/dex/swap' },
      '/dex/withdraw': { page: '/dex/withdraw' },
      '/gov': { page: '/gov' },
      '/gov/liquid': { page: '/gov/liquid' },
      '/gov/stakelp': { page: '/gov/stakelp' },
      '/gov/staketoken': { page: '/gov/staketoken' },
      '/gov/unstake': { page: '/gov/unstake' },
      '/launch': { page: '/launch' },
      '/launch/burn': { page: '/launch/burn' },
      '/launch/contribute': { page: '/launch/contribute' },
      '/launch/deploy': { page: '/launch/deploy' },
      '/my': { page: '/my' },
      '/my/actrewards': { page: '/my/actrewards' },
      '/my/govrewards': { page: '/my/govrewards' },
      '/tokens': { page: '/tokens' },
      '/tokens/children': { page: '/tokens/children' },
      '/verify': { page: '/verify' },
      '/verify/action': { page: '/verify/action' },
      '/verify/actions': { page: '/verify/actions' },
      '/vote': { page: '/vote' },
      '/vote/actions': { page: '/vote/actions' },
      '/vote/actions4submit': { page: '/vote/actions4submit' },
      '/vote/vote': { page: '/vote/vote' },
    };
  },
  images: {
    unoptimized: true, // 静态导出需要这个设置
  },
  // devIndicators: false,
};

module.exports = nextConfig;
