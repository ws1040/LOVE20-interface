import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { SidebarInset } from '@/components/ui/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

import { TokenProvider } from '@/src/contexts/TokenContext';
import { AppSidebar } from '@/src/components/Common/AppSidebar';
import { config } from '@/src/wagmi';
import { ErrorProvider } from '@/src/contexts/ErrorContext';
import Footer from '@/src/components/Footer';
import ErrorBoundary from '@/src/components/ErrorBoundary';
import DebugInfo from '@/src/components/DebugInfo';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import '../styles/globals.css';

const client = new QueryClient();

// 动态导入所有Web3相关组件，禁用SSR
const WagmiProvider = dynamic(() => import('wagmi').then((mod) => mod.WagmiProvider), {
  ssr: false,
});

// 创建一个客户端包装器组件
const ClientWrapper = dynamic(() => Promise.resolve(({ children }: { children: React.ReactNode }) => <>{children}</>), {
  ssr: false,
});

function MyApp({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 在服务端或客户端未完成挂载时显示loading
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex justify-center items-center h-screen">
          <div className="text-lg">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ClientWrapper>
        <WagmiProvider config={config}>
          <QueryClientProvider client={client}>
            <TokenProvider>
              <SidebarProvider>
                <ErrorProvider>
                  <AppSidebar />
                  <SidebarInset>
                    <div className="min-h-screen bg-background flex flex-col">
                      <Toaster
                        position="top-center"
                        toastOptions={{
                          style: {
                            background: '#000000',
                            color: '#FFFFFF',
                          },
                        }}
                      />
                      <ErrorBoundary>
                        <Component {...pageProps} />
                      </ErrorBoundary>
                      <Footer />
                    </div>
                  </SidebarInset>
                </ErrorProvider>
              </SidebarProvider>
            </TokenProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ClientWrapper>
    </ErrorBoundary>
  );
}

export default MyApp;
