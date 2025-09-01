/** @type {import('next').NextConfig} */

const nextConfig = {
  trailingSlash: true, // GitHub Pages 需要这个设置
  reactStrictMode: false,
  ...(process.env.NODE_ENV !== 'development' && { output: 'export' }),
  basePath: process.env.BASE_PATH || '',
  assetPrefix: process.env.ASSET_PREFIX || '',
  transpilePackages: ['@tanstack/query-core', '@tanstack/react-query', '@tanstack/react-query-devtools'],
  allowedDevOrigins: ['127.0.0.1:3000', 'localhost:3000', '127.0.0.1', 'localhost'],
  productionBrowserSourceMaps: false, // 禁用生产环境源码映射以避免404错误

  // 开发环境性能优化
  ...(process.env.NODE_ENV === 'development' && {
    // 禁用开发环境的源码映射以加快编译
    productionBrowserSourceMaps: false,
    // 优化开发环境的编译缓存
    experimental: {
      // 启用 SWC 编译器的缓存
      swcTraceProfiling: false,
      // 禁用某些开发时的检查
      disableOptimizedLoading: true,
    },
  }),
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
      '/action/info': { page: '/action/info' },
      '/action/verify_detail': { page: '/action/verify_detail' },
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
      '/my/myaction': { page: '/my/myaction' },
      '/my/actionrewards': { page: '/my/actionrewards' },
      '/my/govrewards': { page: '/my/govrewards' },
      '/tokens': { page: '/tokens' },
      '/tokens/children': { page: '/tokens/children' },
      '/verify': { page: '/verify' },
      '/verify/action': { page: '/verify/action' },
      '/verify/actions': { page: '/verify/actions' },
      '/vote': { page: '/vote' },
      '/vote/actions': { page: '/vote/actions' },
      '/vote/actions4submit': { page: '/vote/actions4submit' },
      '/vote/history': { page: '/vote/history' },
      '/vote/vote': { page: '/vote/vote' },
    };
  },
  images: {
    unoptimized: true, // 静态导出需要这个设置
  },
  // devIndicators: false,
};

module.exports = nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs');

// 允许通过环境变量控制 Sentry tunnel（静态导出下默认禁用）
const enableSentryTunnel = process.env.SENTRY_TUNNEL === 'true' && nextConfig.output !== 'export';
const sentryTunnelRoute = process.env.SENTRY_TUNNEL_ROUTE || '/monitoring';

// 开发环境下简化 Sentry 配置以提高编译速度
const sentryConfig =
  process.env.NODE_ENV === 'development'
    ? {
        org: 'ws1040',
        project: 'love20-dapp',
        authToken: process.env.SENTRY_AUTH_TOKEN || '',
        sourcemaps: {
          disable: true, // 开发环境禁用源码映射以加快编译
        },
        silent: true, // 开发环境静默 Sentry 日志
        widenClientFileUpload: false, // 开发环境关闭以提高速度
        disableLogger: true,
        automaticVercelMonitors: false, // 开发环境关闭
      }
    : {
        // 生产环境完整配置
        org: 'ws1040',
        project: 'love20-dapp',
        authToken: process.env.SENTRY_AUTH_TOKEN || '',
        sourcemaps: {
          disable: false,
          assets: ['**/*.js', '**/*.js.map'],
          ignore: ['**/node_modules/**'],
          deleteSourcemapsAfterUpload: true,
        },
        silent: !process.env.CI,
        widenClientFileUpload: true,
        tunnelRoute: enableSentryTunnel ? sentryTunnelRoute : undefined,
        disableLogger: true,
        automaticVercelMonitors: true,
      };

module.exports = withSentryConfig(module.exports, sentryConfig);
