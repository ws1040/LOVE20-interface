import Header from '@/src/components/Header';
import TokenList from '@/src/components/Token/TokenList';

export default function Tokens() {
  return (
    <>
      <Header title="代币列表" />
      <main className="flex-grow">
        <header className="flex justify-between items-center m-4">
          <h1 className="text-lg font-bold">所有代币</h1>
        </header>
        <TokenList />
      </main>
    </>
  );
}
