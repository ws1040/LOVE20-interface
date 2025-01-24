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

  useEffect(() => {
    if (currentToken && !currentToken.hasEnded) {
      // 如果发射未结束，跳转到发射页面
      router.push(`/launch?symbol=${currentToken.symbol}`);
    } else if (
      currentToken &&
      !currentToken.initialStakeRound &&
      currentToken.symbol != process.env.NEXT_PUBLIC_FIRST_TOKEN_SYMBOL
    ) {
      // 如果还没有人质押，跳转到质押页面
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
