'use client';

import Header from '@/src/components/Header';
import WETHTab from '@/src/components/Token/WETHTab';
import Withdraw from '@/src/components/Dex/Withdraw';

export default function WithdrawPage() {
  return (
    <>
      <Header title="提现" />
      <main className="flex-grow">
        <WETHTab />
        <Withdraw />
      </main>
    </>
  );
}
