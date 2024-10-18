// src/contexts/TokenContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';

// 定义 Token 类型
export interface Token {
  name: string;
  symbol: string;
  address: `0x${string}`;
  parentTokenAddress: `0x${string}`;
  parentTokenSymbol: string;
  slTokenAddress: `0x${string}`;
  stTokenAddress: `0x${string}`;
}

// 定义 Context 的类型
interface TokenContextType {
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
  const [token, setToken] = useState<Token | null>(null);

  // 从 Local Storage 加载 token
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('currentToken');
      if (storedToken && JSON.parse(storedToken)) {
        setToken( JSON.parse(storedToken));
      } else {
        setToken({ 
          name: process.env.NEXT_PUBLIC_FIRST_TOKEN_NAME || '', 
          symbol: process.env.NEXT_PUBLIC_FIRST_TOKEN_SYMBOL || '', 
          address: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_FIRST_TOKEN || '') as `0x${string}`,
          parentTokenAddress: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_ROOT_PARENT_TOKEN || '') as `0x${string}`,
          parentTokenSymbol: process.env.NEXT_PUBLIC_FIRST_PARENT_TOKEN_SYMBOL || '',
          slTokenAddress: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_FIRST_SL_TOKEN || '') as `0x${string}`,
          stTokenAddress: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_FIRST_ST_TOKEN || '') as `0x${string}`,
        });
      }
    } catch (error) {
      console.error('Failed to load token from localStorage:', error);
    }
  }, []);

  // 当 token 变化时，更新 Local Storage
  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem('currentToken', JSON.stringify(token));
      } else {
        localStorage.removeItem('currentToken');
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

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};