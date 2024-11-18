import Header from '@/src/components/Header';
import Deposit from '@/src/components/Launch/deposit';

export default function TokenFairLaunch() {
  return (
    <>
      <Header title="Launch" />
      <main className="flex-grow">
        <Deposit />
      </main>
    </>
  );
}
