import dynamic from 'next/dynamic';
import Header from '@/src/components/Header';

const Deposit = dynamic(() => import('@/src/components/Launch/Deposit'), { ssr: false });

export default function DepositPage() {
  return (
    <>
      <Header title="兑换" />
      <main className="flex-grow">
        <Deposit />
      </main>
    </>
  );
}
