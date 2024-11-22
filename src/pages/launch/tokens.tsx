import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

import Header from '@/src/components/Header';
import TokenList from '@/src/components/Token/TokenList';

export default function Tokens() {
  return (
    <>
      <Header title="Launch" />
      <main className="flex-grow">
        <header className="flex justify-between items-center m-4">
          <h1 className="text-xl font-bold">所有代币</h1>

          <Link href="/launch/deploy">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              部署新代币
            </Button>
          </Link>
        </header>
        <TokenList />
      </main>
    </>
  );
}
