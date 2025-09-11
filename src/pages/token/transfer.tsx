'use client';

import { useContext } from 'react';
import { HelpCircle } from 'lucide-react';

// my components
import Header from '@/src/components/Header';
import TransferPanel from '@/src/components/Token/Transfer';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

export default function TransferPage() {
  const { token: currentToken } = useContext(TokenContext) || {};

  return (
    <>
      <Header title="转账" />
      <main className="flex-grow">
        <TransferPanel />
      </main>
    </>
  );
}
