'use client';

import dynamic from 'next/dynamic';
import Header from '@/src/components/Header';
import WETHTab from '@/src/components/Token/WETHTab';
const Deposit = dynamic(() => import('@/src/components/Dex/Deposit'), { ssr: false });

export default function DepositPage() {
  return (
    <>
      <Header title="存入" />
      <main className="flex-grow">
        <WETHTab />
        <Deposit />
      </main>
    </>
  );
}
