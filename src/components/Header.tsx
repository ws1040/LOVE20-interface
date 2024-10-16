// src/components/Header.tsx
import React from 'react';
// import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    //   <Head>
    //     <title>Life20 DApp</title>
    //     <link href="/favicon.ico" rel="icon" />
    //   </Head>
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <h1 className="text-xl font-bold">LIFE20</h1>
      <ConnectButton />
    </header>
  );
};

export default Header;