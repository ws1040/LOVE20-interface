'use client';
// src/components/Header.tsx

import Head from 'next/head';
import React, { useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ErrorAlert } from '@/src/components/Common/ErrorAlert';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAccount } from 'wagmi';
import { useError } from '@/src/contexts/ErrorContext';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { address, chain } = useAccount();
  const chainName = process.env.NEXT_PUBLIC_CHAIN;

  const { setError } = useError();

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
  }, [address, chain]);

  return (
    <>
      <Head>
        <title>{`${title} - LOVE20`}</title>
        <meta name={`${title} - LOVE20`} content="A Web3 DApp for LOVE20 token management" />
      </Head>

      <header className="flex justify-between items-center py-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <ConnectButton />
      </header>

      <div className="px-4">
        <ErrorAlert />
      </div>
    </>
  );
};

export default Header;
