import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

// my components
import Header from '@/src/components/Header';
import SwapPanel from '@/src/components/Dex/Swap';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

export default function SwapPage() {
  const router = useRouter();
  const { token: currentToken } = useContext(TokenContext) || {};

  // 如果还没有人质押，跳转到质押页面
  useEffect(() => {
    if (
      currentToken &&
      !currentToken.initialStakeRound &&
      currentToken.symbol != process.env.NEXT_PUBLIC_FIRST_TOKEN_SYMBOL
    ) {
      router.push(`/gov/stakelp?symbol=${currentToken.symbol}&first=true`);
    }
  }, [currentToken]);

  return (
    <>
      <Header title="兑换代币" />
      <main className="flex-grow">
        <SwapPanel />
      </main>
    </>
  );
}
