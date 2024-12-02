import Header from '@/src/components/Header';
import TokenDeployment from '@/src/components/Launch/Deploy';

export default function Deploy() {
  return (
    <>
      <Header title="Launch" />
      <main className="flex-grow">
        <TokenDeployment />
      </main>
    </>
  );
}
