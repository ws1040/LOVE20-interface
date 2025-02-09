'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

// my context
import { TokenContext } from '@/src/contexts/TokenContext';

// my hooks
import { useCurrentRound } from '@/src/hooks/contracts/useLOVE20Vote';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my components
import Header from '@/src/components/Header';
import GovernanceDataPanel from '@/src/components/DataPanel/GovernanceDataPanel';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import MyVotingPanel from '@/src/components/My/MyVotingPanel';
import MyVerifingPanel from '@/src/components/My/MyVerifingPanel';
import TokenTab from '@/src/components/Token/TokenTab';
import Todeploy from '@/src/components/Launch/Todeploy';

const GovPage = () => {
  const router = useRouter();
  const { currentRound: currentVoteRound, error: errorCurrentRound } = useCurrentRound();
  const { token: currentToken } = useContext(TokenContext) || {};

  useEffect(() => {
    if (currentToken && !currentToken.hasEnded) {
      // 如果发射未结束，跳转到发射页面
      router.push(`/launch?symbol=${currentToken.symbol}`);
    } else if (currentToken && !currentToken.initialStakeRound) {
      // 如果还没有人质押，跳转到质押页面
      router.push(`/gov/stakelp?symbol=${currentToken.symbol}&first=true`);
    }
  }, [currentToken]);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorCurrentRound) {
      handleContractError(errorCurrentRound, 'vote');
    }
  }, [errorCurrentRound]);

  if (!currentToken) {
    return <LoadingIcon />;
  }

  return (
    <>
      <Header title="治理首页" />
      <main className="flex-grow">
        <TokenTab />
        <GovernanceDataPanel currentRound={currentVoteRound ? currentVoteRound : 0n} />
        <MyVotingPanel currentRound={currentVoteRound ? currentVoteRound : 0n} />
        <MyVerifingPanel currentRound={currentVoteRound > 2 ? currentVoteRound - 2n : 0n} />
        <Todeploy token={currentToken} />
      </main>
    </>
  );
};

export default GovPage;
