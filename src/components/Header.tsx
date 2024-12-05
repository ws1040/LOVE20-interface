// src/components/Header.tsx

import Head from 'next/head';
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAccount } from 'wagmi';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { address, chain } = useAccount();
  const chainName = process.env.NEXT_PUBLIC_CHAIN;

  return (
    <>
      <Head>
        <title>{`${title} - LIFE20`}</title>
        <meta name={`${title} - LIFE20`} content="A Web3 DApp for Life20 token management" />
      </Head>

      <header className="flex justify-between items-center py-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <ConnectButton />
      </header>

      {address && !chain && (
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{address ? '钱包网络错误' : '未连接钱包'}</AlertTitle>
            <AlertDescription>{address ? `请切换到 ${chainName} 网络` : '请先连接钱包，再进行操作'}</AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
};

export default Header;
