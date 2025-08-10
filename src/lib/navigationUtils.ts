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
   * 强制整页跳转前显示加载遮罩，降低“卡顿/白屏”感知
   */
  static redirectWithOverlay(url: string, text: string = '正在跳转...'): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      // 非浏览器环境直接跳转
      (globalThis as any).location.href = url;
      return;
    }

    try {
      // 避免重复叠加
      const existing = document.querySelector('[data-hard-redirect-overlay="true"]');
      if (!existing) {
        const overlay = document.createElement('div');
        overlay.setAttribute('data-hard-redirect-overlay', 'true');
        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.zIndex = '2147483647';
        overlay.style.background = 'rgba(17, 24, 39, 0.5)'; // 与全局遮罩一致的半透色
        overlay.style.backdropFilter = 'blur(1px)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.pointerEvents = 'auto';
        overlay.style.touchAction = 'none';

        // 阻止背景滚动
        try {
          document.body.style.overflow = 'hidden';
        } catch {}

        // 容器
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.color = '#ffffff';

        // 简单的 CSS Spinner
        const spinner = document.createElement('div');
        spinner.style.width = '32px';
        spinner.style.height = '32px';
        spinner.style.border = '3px solid rgba(255,255,255,0.35)';
        spinner.style.borderTopColor = '#ffffff';
        spinner.style.borderRadius = '50%';
        spinner.style.animation = 'redirect-spin 0.9s linear infinite';

        const textNode = document.createElement('div');
        textNode.textContent = text;
        textNode.style.marginTop = '8px';
        textNode.style.fontSize = '14px';
        textNode.style.fontWeight = '500';

        container.appendChild(spinner);
        container.appendChild(textNode);
        overlay.appendChild(container);

        // 注入一次性 keyframes
        if (!document.getElementById('redirect-spin-style')) {
          const style = document.createElement('style');
          style.id = 'redirect-spin-style';
          style.innerHTML =
            '@keyframes redirect-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
          document.head.appendChild(style);
        }

        document.body.appendChild(overlay);
      }

      // 允许浏览器有机会渲染遮罩，然后再跳转
      setTimeout(() => {
        window.location.href = url;
      }, 0);
    } catch {
      window.location.href = url;
    }
  }

  /**
   * 强制整页刷新前显示加载遮罩，降低“卡顿/白屏”感知
   */
  static reloadWithOverlay(text: string = '正在刷新...'): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      try {
        (globalThis as any).location.reload();
      } catch {}
      return;
    }

    try {
      // 避免重复叠加
      const existing =
        document.querySelector('[data-hard-reload-overlay="true"]') ||
        document.querySelector('[data-hard-redirect-overlay="true"]');
      if (!existing) {
        const overlay = document.createElement('div');
        overlay.setAttribute('data-hard-reload-overlay', 'true');
        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.zIndex = '2147483647';
        overlay.style.background = 'rgba(17, 24, 39, 0.5)';
        overlay.style.backdropFilter = 'blur(1px)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.pointerEvents = 'auto';
        overlay.style.touchAction = 'none';

        // 阻止背景滚动
        try {
          document.body.style.overflow = 'hidden';
        } catch {}

        // 容器
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.color = '#ffffff';

        // 简单的 CSS Spinner
        const spinner = document.createElement('div');
        spinner.style.width = '32px';
        spinner.style.height = '32px';
        spinner.style.border = '3px solid rgba(255,255,255,0.35)';
        spinner.style.borderTopColor = '#ffffff';
        spinner.style.borderRadius = '50%';
        spinner.style.animation = 'redirect-spin 0.9s linear infinite';

        const textNode = document.createElement('div');
        textNode.textContent = text;
        textNode.style.marginTop = '8px';
        textNode.style.fontSize = '14px';
        textNode.style.fontWeight = '500';

        container.appendChild(spinner);
        container.appendChild(textNode);
        overlay.appendChild(container);

        // 注入一次性 keyframes（若未注入）
        if (!document.getElementById('redirect-spin-style')) {
          const style = document.createElement('style');
          style.id = 'redirect-spin-style';
          style.innerHTML =
            '@keyframes redirect-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
          document.head.appendChild(style);
        }

        document.body.appendChild(overlay);
      }

      // 允许浏览器先渲染遮罩，再刷新
      setTimeout(() => {
        try {
          window.location.reload();
        } catch {
          // 回退方案：重设 href 也可触发硬刷新
          window.location.href = window.location.href;
        }
      }, 0);
    } catch {
      try {
        window.location.reload();
      } catch {
        window.location.href = window.location.href;
      }
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
