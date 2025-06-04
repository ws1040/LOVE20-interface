'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { HelpCircle } from 'lucide-react';

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
        <div className="bg-blue-50/30 border-l-4 border-l-blue-50 rounded-r-lg p-4 mb-8 text-sm mt-0 m-6">
          <div className="flex items-center gap-2 text-base font-bold text-blue-800 pb-2">
            <HelpCircle className="w-4 h-4" />
            提示
          </div>
          <div className="text-base font-bold text-blue-700 pt-2 pb-1">交易协议：</div>
          <div className="text-sm text-blue-700">本交易功能基于 Uniswap V2 协议实现，合约代码为官方最新版本</div>

          <div className="text-base font-bold text-blue-700 pt-2 pb-1">费用说明：</div>
          <div className="text-sm text-blue-700">手续费为 0.3%，滑点上限为 0.5%</div>
        </div>
      </main>
    </>
  );
}
