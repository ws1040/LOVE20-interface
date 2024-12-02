import dynamic from 'next/dynamic';
import Header from '@/src/components/Header';

const Deposit = dynamic(() => import('@/src/components/Launch/deposit'), { ssr: false });

export default function DepositPage() {
  return (
    <>
      <Header title="Launch" />
      <main className="flex-grow">
        <Deposit />
      </main>
    </>
  );
}
