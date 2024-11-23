import Header from '@/src/components/Header';
import SwapPanel from '@/src/components/Dex/Swap';

export default function SwapPage() {
  return (
    <>
      <Header title="Swap" />
      <main className="flex-grow">
        <SwapPanel />
      </main>
    </>
  );
}
