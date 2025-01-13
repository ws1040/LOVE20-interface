// contexts/ErrorContext.tsx
import { useRouter } from 'next/router';
import React, { createContext, ReactNode, useState, useContext, useEffect } from 'react';

export interface ErrorInfo {
  name: string;
  message: string;
}
export interface ErrorContextType {
  error: ErrorInfo | null;
  setError: (error: ErrorInfo | null) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<ErrorInfo | null>(null);
  const router = useRouter();

  // 路由变化时，清除错误
  useEffect(() => {
    const handleRouteChange = () => {
      setError(null);
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  return <ErrorContext.Provider value={{ error, setError }}>{children}</ErrorContext.Provider>;
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
