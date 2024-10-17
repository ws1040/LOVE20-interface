// src/components/Header.tsx

import Head from 'next/head';
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <>
      <Head>
        <title>{`${title} - LIFE20`}</title>
        <meta name={`${title} - LIFE20`} content="A Web3 DApp for Life20 token management" />
      </Head>
      <header className="flex justify-between items-center p-4 bg-white">
        <h1 className="text-large text-gray-500 font-bold">@{title}</h1>
        <ConnectButton />
      </header>
    </>
  );
};

export default Header;