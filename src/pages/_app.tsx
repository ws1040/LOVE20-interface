'use client';

import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { Toaster } from 'react-hot-toast';
import { WagmiProvider } from 'wagmi';
import { SidebarInset } from '@/components/ui/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

import { TokenProvider } from '@/src/contexts/TokenContext';
import { AppSidebar } from '@/src/components/Common/AppSidebar';
import { config } from '@/src/wagmi';
import Footer from '@/src/components/Footer';

import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <TokenProvider>
          <RainbowKitProvider>
            <SidebarProvider>
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
            </SidebarProvider>
          </RainbowKitProvider>
        </TokenProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
