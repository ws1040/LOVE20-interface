// src/components/Header.tsx
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <h1 className="text-xl font-bold">LIFE20</h1>
      <ConnectButton />
    </header>
  );
};

export default Header;