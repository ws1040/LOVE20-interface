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

// 创建 Context，初始值为 null
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
    isPending: isPendingBySymbol,
    error: errorBySymbol,
  } = useTokenDetailBySymbol(currentTokenSymbol as string);

  console.log('---------TokenProvider--------');
  console.log('token', token);
  console.log('tokenInfoBySymbol', tokenInfoBySymbol);
  console.log('launchInfoBySymbol', launchInfoBySymbol);
  console.log('isPendingBySymbol', isPendingBySymbol);
  console.log('errorBySymbol', errorBySymbol);

  const setTokenBySymbol = (tokenSymbol: string) => {
    const ifNoSymbol =
      !tokenSymbol ||
      (typeof tokenSymbol === 'string' && tokenSymbol.charAt(0) === tokenSymbol.charAt(0).toLowerCase());

    try {
      const storedToken = localStorage.getItem('currentToken');
      let _token: Token;

      if (storedToken && JSON.parse(storedToken)) {
        _token = JSON.parse(storedToken);
      } else {
        _token = {
          name: process.env.NEXT_PUBLIC_FIRST_TOKEN_NAME || '',
          symbol: process.env.NEXT_PUBLIC_FIRST_TOKEN_SYMBOL || '',
          address: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_FIRST_TOKEN || '') as `0x${string}`,
          decimals: Number(process.env.NEXT_PUBLIC_TOKEN_DECIMALS || 18),
          hasEnded: false,
          parentTokenAddress: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_ROOT_PARENT_TOKEN || '') as `0x${string}`,
          parentTokenSymbol: process.env.NEXT_PUBLIC_FIRST_PARENT_TOKEN_SYMBOL || '',
          slTokenAddress: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_FIRST_SL_TOKEN || '') as `0x${string}`,
          stTokenAddress: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_FIRST_ST_TOKEN || '') as `0x${string}`,
        };
      }

      if (ifNoSymbol || tokenSymbol === _token.symbol) {
        setToken(_token);
      } else if (tokenSymbol) {
        setCurrentTokenSymbol(tokenSymbol as string);
      }
    } catch (error) {
      console.error('Failed to load token from localStorage:', error);
    }
  };

  // 从 window.location 加载 symbol
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_BASE_PATH || typeof window == 'undefined') {
      return;
    }
    const pathSegments = window.location.pathname.split('/');
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH.replace(/^\/|\/$/g, '');
    const basePathIndex = pathSegments.indexOf(basePath);
    const symbol = pathSegments[basePathIndex + 1];
    console.log('>>>pathSegments@window.location', pathSegments);
    console.log('>>>basePath', basePath);
    console.log('>>>basePathIndex', basePathIndex);
    console.log('>>>symbol@window.location', symbol);

    setTokenBySymbol(symbol);
  }, []);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_BASE_PATH || !router.isReady) {
      return;
    }
    console.log('>>>router.isReady', router.isReady);
    console.log('>>>router.query.symbol', router.query.symbol);
    setTokenBySymbol(router.query.symbol as string);
  }, [router.isReady, router.query.symbol]);

  // 当 token 变化时，更新 tokenInfoBySymbol
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
