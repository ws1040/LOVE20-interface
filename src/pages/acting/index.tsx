'use client';

import { useContext, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

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
  const { isConnected } = useAccount();
  const { token: currentToken } = useContext(TokenContext) || {};
  const {
    currentRound,
    error: errorCurrentRound,
    isPending: isPendingCurrentRound,
  } = useCurrentRound(isConnected && currentToken?.hasEnded);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorCurrentRound) {
      handleContractError(errorCurrentRound, 'join');
    }
  }, [errorCurrentRound]);

  if (isConnected && !currentToken?.hasEnded && isPendingCurrentRound) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIcon />
      </div>
    );
  }

  return (
    <>
      <Header title="社区首页" />
      <main className="flex-grow">
        {!isConnected ? (
          // 未连接钱包时显示提示
          <div className="flex flex-col items-center p-4 mt-4">
            <div className="text-center mb-4 text-greyscale-500">没有链接钱包，请先连接钱包</div>
          </div>
        ) : !currentToken ? (
          <LoadingIcon />
        ) : currentToken && !currentToken.hasEnded ? (
          // 公平发射未结束时显示提示
          <>
            <TokenTab />
            <div className="flex flex-col items-center p-4 mt-4">
              <div className="text-center mb-4 text-greyscale-500">公平发射未结束，还不能参与社区行动</div>
              <Button className="w-1/2" asChild>
                <Link href={`/launch?symbol=${currentToken.symbol}`}>查看公平发射</Link>
              </Button>
            </div>
          </>
        ) : (
          // 正常显示社区内容
          <>
            <TokenTab />
            <ActDataPanel currentRound={currentRound} />
            <JoiningActionList currentRound={currentRound} />
          </>
        )}
      </main>
    </>
  );
};

export default ActingPage;
