'use client';
// src/components/Header.tsx

import Head from 'next/head';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { WalletButton } from '@/src/components/WalletButton';
import { ErrorAlert } from '@/src/components/Common/ErrorAlert';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useError } from '@/src/contexts/ErrorContext';
import { TokenContext } from '../contexts/TokenContext';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  backUrl?: string;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false, backUrl = '' }) => {
  const { address, chain } = useAccount();
  const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME ?? process.env.NEXT_PUBLIC_CHAIN;
  const { setError } = useError();
  const { token } = useContext(TokenContext) || {};
  const router = useRouter();

  // 记录上一次检测到的网络错误时间
  const [lastNetworkErrorTime, setLastNetworkErrorTime] = useState<number>(0);
  // 是否已经执行了刷新
  const [hasRefreshed, setHasRefreshed] = useState<boolean>(false);

  // 监听连接事件和错误
  useEffect(() => {
    // 在组件挂载时检查是否是自动刷新后的页面
    const wasAutoRefreshed = localStorage.getItem('networkAutoRefreshed');
    if (wasAutoRefreshed) {
      localStorage.removeItem('networkAutoRefreshed');
    }

    // 监听错误
    const handleError = (error: any) => {
      console.error('handleError:', error);

      // 特别检测 "f is not a function" 错误
      if (
        error &&
        error.message &&
        (error.message.includes('f is not a function') ||
          (error.message.includes('User rejected') && error.message.includes('Details:')))
      ) {
        const currentTime = Date.now();
        // 只有在最近30秒内没有自动刷新过才执行刷新
        if (currentTime - lastNetworkErrorTime > 30000 && !hasRefreshed) {
          setLastNetworkErrorTime(currentTime);
          setHasRefreshed(true);

          setTimeout(() => {
            localStorage.setItem('networkAutoRefreshed', 'true');
            window.location.reload();
          }, 2000);
        }
      }
    };

    // 使用 window.addEventListener 捕获全局错误
    window.addEventListener('error', (event) => {
      if (event.error && typeof event.error === 'object') {
        handleError(event.error);
      }
    });

    // 使用 window.onerror 捕获全局错误
    const originalOnError = window.onerror;
    window.onerror = function (message, source, lineno, colno, error) {
      handleError(error);
      return originalOnError ? originalOnError(message, source, lineno, colno, error) : false;
    };

    // 使用 Promise 捕获未处理的 Promise 错误
    window.addEventListener('unhandledrejection', (event) => {
      console.log('unhandledrejection:', event);
      handleError(event.reason);
    });

    return () => {
      // 清理事件监听器
      window.onerror = originalOnError;
      window.removeEventListener('unhandledrejection', (event) => {
        handleError(event.reason);
      });
    };
  }, [lastNetworkErrorTime, hasRefreshed]);

  // 钱包网络检测逻辑
  useEffect(() => {
    if (address && !chain) {
      setError({
        name: '钱包网络错误',
        message: `请切换到 ${chainName} 网络`,
      });
    } else {
      // 钱包网络正常，清除错误状态
      setError(null);
    }
  }, [address, chain, setError, chainName]);

  // 返回上一页处理函数
  const handleGoBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <>
      <Head>
        <title>{`${token?.symbol ?? 'LOVE20'}`}</title>
        <meta name={`${title} - ${token?.symbol}`} content="A Web3 DApp for LOVE20 token management" />
      </Head>

      <header className="flex justify-between items-center py-2 px-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1" />
          {(showBackButton || backUrl !== '') && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoBack}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900"
              title="返回上一页"
            >
              <span className="text-sm font-medium">&lt;&nbsp;返回</span>
            </Button>
          )}
        </div>
        <WalletButton />
      </header>

      <div className="px-4">
        <ErrorAlert />
      </div>
    </>
  );
};

export default Header;
