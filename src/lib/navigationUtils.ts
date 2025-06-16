import { NextRouter } from 'next/router';

export class NavigationUtils {
  private static isTokenPocketEnvironment(): boolean {
    if (typeof window === 'undefined') return false;

    const userAgent = window.navigator.userAgent;
    return (
      userAgent.includes('TokenPocket') ||
      userAgent.includes('imToken') ||
      userAgent.includes('TrustWallet') ||
      // 通用钱包WebView检测
      ((window as any).webkit && (window as any).webkit.messageHandlers) ||
      // 检测是否在WebView中
      ((window.navigator as any).standalone === false && window.innerHeight < window.screen.height)
    );
  }

  /**
   * 智能回退 - 针对钱包环境优化
   */
  static smartBack(router: NextRouter, fallbackPath?: string): void {
    if (typeof window === 'undefined') return;

    // 获取当前路径信息
    const currentPath = router.asPath;
    const symbol = router.query.symbol as string;

    // 检查是否有足够的历史记录
    const hasHistory = window.history.length > 1;
    const referrer = document.referrer;
    const isInternalReferrer = referrer && referrer.includes(window.location.origin);

    if (this.isTokenPocketEnvironment()) {
      // 在钱包环境中，优先使用程序化导航
      this.handleWalletNavigation(router, currentPath, symbol, fallbackPath);
    } else if (hasHistory && isInternalReferrer) {
      // 在普通浏览器中，有内部引用的情况下使用历史回退
      window.history.back();
    } else {
      // 其他情况使用程序化导航
      this.handleProgrammaticNavigation(router, currentPath, symbol, fallbackPath);
    }
  }

  private static handleWalletNavigation(
    router: NextRouter,
    currentPath: string,
    symbol: string,
    fallbackPath?: string,
  ): void {
    // 根据当前页面智能选择返回路径
    let targetPath = fallbackPath;

    if (!targetPath) {
      if (currentPath.includes('/verify/')) {
        targetPath = `/gov${symbol ? `?symbol=${symbol}` : ''}`;
      } else if (currentPath.includes('/vote/')) {
        targetPath = `/gov${symbol ? `?symbol=${symbol}` : ''}`;
      } else if (currentPath.includes('/action/')) {
        targetPath = `/acting${symbol ? `?symbol=${symbol}` : '/'}`;
      } else if (currentPath.includes('/my/')) {
        targetPath = `/acting${symbol ? `?symbol=${symbol}` : '/'}`;
      } else {
        targetPath = `/acting${symbol ? `?symbol=${symbol}` : '/'}`;
      }
    }

    router.push(targetPath);
  }

  private static handleProgrammaticNavigation(
    router: NextRouter,
    currentPath: string,
    symbol: string,
    fallbackPath?: string,
  ): void {
    if (fallbackPath) {
      router.push(fallbackPath);
    } else {
      router.push(`/acting${symbol ? `?symbol=${symbol}` : '/'}`);
    }
  }

  /**
   * 处理外部链接 - 尝试在系统浏览器中打开
   */
  static handleExternalLink(url: string): void {
    if (typeof window === 'undefined') return;

    if (this.isTokenPocketEnvironment()) {
      // 尝试多种方式打开链接
      try {
        // 方法1：尝试新窗口
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');

        // 方法2：如果新窗口失败，尝试当前窗口
        if (!newWindow) {
          window.location.href = url;
        }
      } catch (error) {
        // 方法3：如果所有方法都失败，直接跳转
        window.location.href = url;
      }
    } else {
      window.open(url, '_blank');
    }
  }

  /**
   * 检查并修复首页重定向问题
   */
  static handleIndexRedirect(router: NextRouter): boolean {
    if (typeof window === 'undefined') return false;

    const referrer = document.referrer;
    const isInternalReferrer = referrer && referrer.includes(window.location.origin);

    // 如果是从内部页面跳转过来的，且在钱包环境中
    if (isInternalReferrer && this.isTokenPocketEnvironment()) {
      // 尝试解析referrer中的参数
      try {
        const referrerUrl = new URL(referrer);
        const symbolFromReferrer = referrerUrl.searchParams.get('symbol');

        if (symbolFromReferrer) {
          router.push(`/acting?symbol=${symbolFromReferrer}`);
          return true;
        }
      } catch (error) {
        console.log('解析referrer失败:', error);
      }
    }

    return false;
  }
}

export default NavigationUtils;
