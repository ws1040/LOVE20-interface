'use client';

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
    } else if (currentToken && !currentToken.initialStakeRound) {
      // 如果还没有人质押，跳转到质押页面
      router.push(`/gov/stakelp/?symbol=${currentToken.symbol}&first=true`);
    }
  }, [currentToken]);

  return (
    <>
      <Header title="兑换代币" />
      <main className="flex-grow">
        <SwapPanel />
        <div className="bg-gray-100 text-greyscale-500 rounded-lg p-4 text-sm mt-0 m-6">
          <p className="mb-1">说明：</p>
          <p>1. 本交易功能基于 Uniswap V2 协议实现，合约代码为官方最新版本；</p>
          <p>2. 手续费为 0.3%，滑点上限为 0.5%；</p>
        </div>
      </main>
    </>
  );
}
