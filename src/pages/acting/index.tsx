'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

// my context
import { TokenContext } from '@/src/contexts/TokenContext';

// my components
import ActDataPanel from '@/src/components/DataPanel/ActDataPanel';
import Header from '@/src/components/Header';
import JoiningActionList from '@/src/components/ActionList/JoiningActionList';
import TokenTab from '@/src/components/Token/TokenTab';

// my hooks
import { useCurrentRound } from '@/src/hooks/contracts/useLOVE20Join';
import { useHandleContractError } from '@/src/lib/errorUtils';

const ActingPage = () => {
  const router = useRouter();
  const { currentRound, error: errorCurrentRound } = useCurrentRound();
  const { token: currentToken } = useContext(TokenContext) || {};

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorCurrentRound) {
      handleContractError(errorCurrentRound, 'join');
    }
  }, [errorCurrentRound]);

  useEffect(() => {
    if (currentToken && !currentToken.hasEnded) {
      // 如果发射未结束，跳转到发射页面
      router.push(`/launch?symbol=${currentToken.symbol}`);
    } else if (currentToken && !currentToken.initialStakeRound) {
      // 如果还没有人质押，跳转到质押页面
      router.push(`/gov/stakelp?symbol=${currentToken.symbol}&first=true`);
    }
  }, [currentToken]);

  return (
    <>
      <Header title="社区首页" />
      <main className="flex-grow">
        <TokenTab />
        <ActDataPanel currentRound={currentRound} />
        <JoiningActionList currentRound={currentRound} />
      </main>
    </>
  );
};

export default ActingPage;
