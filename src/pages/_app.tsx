'use client';

import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { Toaster } from 'react-hot-toast';
import { WagmiProvider } from 'wagmi';

import { TokenProvider } from '@/src/contexts/TokenContext';
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
            <div className="min-h-screen bg-gray-100 flex flex-col">
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
          </RainbowKitProvider>
        </TokenProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
