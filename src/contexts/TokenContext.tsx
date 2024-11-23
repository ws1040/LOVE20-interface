// src/contexts/TokenContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useTokenDetailBySymbol } from '@/src/hooks/contracts/useLOVE20DataViewer';
import { useRouter } from 'next/router';

// 定义 Token 类型
export interface Token {
  name: string;
  symbol: string;
  address: `0x${string}`;
  decimals: number;
  hasEnded: boolean;
  parentTokenAddress: `0x${string}`;
  parentTokenSymbol: string;
  slTokenAddress: `0x${string}`;
  stTokenAddress: `0x${string}`;
}

// 定义 Context 的类型
export interface TokenContextType {
  token: Token | null;
  setToken: (token: Token) => void;
}

// 创建 Context
export const TokenContext = createContext<TokenContextType | undefined>(undefined);

// 定义 Provider 的 Props 类型
interface TokenProviderProps {
  children: ReactNode;
}

export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const router = useRouter();
  const [token, setToken] = useState<Token | null>(null);
  const [currentTokenSymbol, setCurrentTokenSymbol] = useState<string | undefined>(undefined);

  // 从合约获取 token 信息
  const {
    token: tokenInfoBySymbol,
    launchInfo: launchInfoBySymbol,
    error: errorBySymbol,
  } = useTokenDetailBySymbol(currentTokenSymbol as string);
  useEffect(() => {
    if (errorBySymbol) {
      console.error('useTokenDetailBySymbol error:', errorBySymbol);
    }
  }, [errorBySymbol]);

  // 根据合约返回结果，更新 token
  useEffect(() => {
    if (tokenInfoBySymbol && launchInfoBySymbol) {
      setToken({
        name: tokenInfoBySymbol.name,
        symbol: tokenInfoBySymbol.symbol,
        address: tokenInfoBySymbol.tokenAddress,
        decimals: Number(tokenInfoBySymbol.decimals),
        hasEnded: launchInfoBySymbol.hasEnded,
        parentTokenAddress: launchInfoBySymbol.parentTokenAddress,
        parentTokenSymbol: tokenInfoBySymbol.parentTokenSymbol,
        slTokenAddress: tokenInfoBySymbol.slAddress,
        stTokenAddress: tokenInfoBySymbol.stAddress,
      });
    }
  }, [tokenInfoBySymbol, launchInfoBySymbol]);

  // 根据 symbol 设置 token
  const setTokenBySymbol = (tokenSymbol: string) => {
    // symbol是首字母是大写，所以小写字母开头是path或page名称
    const ifNoSymbol = !tokenSymbol || tokenSymbol.charAt(0) === tokenSymbol.charAt(0).toLowerCase();

    try {
      // 从 Local Storage 加载 token
      const storedToken = localStorage.getItem('currentToken');
      if (storedToken && JSON.parse(storedToken)) {
        const _token = JSON.parse(storedToken);
        if (ifNoSymbol || tokenSymbol === _token.symbol) {
          setToken(_token);
          return;
        }
      }

      // 从 路由symbol 加载 token
      if (tokenSymbol.length > 0 && !ifNoSymbol) {
        setCurrentTokenSymbol(tokenSymbol as string);
      } else {
        setCurrentTokenSymbol(process.env.NEXT_PUBLIC_FIRST_TOKEN_SYMBOL || '');
      }
    } catch (error) {
      console.error('Failed to load token from localStorage:', error);
    }
  };

  // [方式1]:Github Pages只支持静态导出部署，所以动态路由有问题，所以从 window.location 加载 symbol
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_BASE_PATH || typeof window == 'undefined') {
      return;
    }
    const pathSegments = window.location.pathname.split('/');
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH.replace(/^\/|\/$/g, '');
    const basePathIndex = pathSegments.indexOf(basePath);
    const symbol = pathSegments[basePathIndex + 1];
    setTokenBySymbol(symbol);
  }, []);

  // [方式2]:从动态路由加载 symbol
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_BASE_PATH || !router.isReady) {
      return;
    }
    setTokenBySymbol(router.query.symbol as string);
  }, [router.isReady, router.query.symbol]);

  // 当 token 变化时，更新 Local Storage
  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem('currentToken', JSON.stringify(token));
      }
    } catch (error) {
      console.error('Failed to save token to localStorage:', error);
    }
  }, [token]);

  // 监听 storage 事件以同步多个标签页
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'currentToken') {
        if (event.newValue) {
          setToken(JSON.parse(event.newValue));
        } else {
          setToken(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return <TokenContext.Provider value={{ token, setToken }}>{children}</TokenContext.Provider>;
};
