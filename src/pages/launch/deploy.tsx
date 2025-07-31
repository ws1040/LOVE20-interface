'use client';
import Header from '@/src/components/Header';
import TokenDeployment from '@/src/components/Launch/Deploy';

export default function Deploy() {
  return (
    <>
      <Header title="开启子币" />
      <main className="flex-grow">
        <TokenDeployment />
      </main>
    </>
  );
}
