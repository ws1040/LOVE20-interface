'use client';

import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { Toaster } from 'react-hot-toast';
import { SidebarInset } from '@/components/ui/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

import { TokenProvider } from '@/src/contexts/TokenContext';
import { AppSidebar } from '@/src/components/Common/AppSidebar';
import { config } from '@/src/wagmi';
import { ErrorProvider } from '@/src/contexts/ErrorContext';
import Footer from '@/src/components/Footer';
import dynamic from 'next/dynamic';

import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

const client = new QueryClient();
const WagmiProvider = dynamic(() => import('wagmi').then((mod) => mod.WagmiProvider), {
  ssr: false,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <TokenProvider>
          <RainbowKitProvider modalSize="compact">
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
                    <Component {...pageProps} />
                    <Footer />
                  </div>
                </SidebarInset>
              </ErrorProvider>
            </SidebarProvider>
          </RainbowKitProvider>
        </TokenProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
