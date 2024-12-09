import Header from '@/src/components/Header';
import SwapPanel from '@/src/components/Dex/Swap';

export default function SwapPage() {
  return (
    <>
      <Header title="兑换代币" />
      <main className="flex-grow">
        <SwapPanel />
      </main>
    </>
  );
}
