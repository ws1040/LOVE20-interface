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

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'ws1040',
  project: 'javascript-nextjs',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: enableSentryTunnel ? sentryTunnelRoute : undefined,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
