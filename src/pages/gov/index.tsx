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
import MyStakingPanel from '@/src/components/My/MyStakingPanel';
import MyVotingPanel from '@/src/components/My/MyVotingPanel';
import MyVerifingPanel from '@/src/components/My/MyVerifingPanel';
import TokenTab from '@/src/components/Token/TokenTab';

const GovPage = () => {
  const router = useRouter();
  const { currentRound: currentVoteRound, error: errorCurrentRound } = useCurrentRound();
  const { token: currentToken } = useContext(TokenContext) || {};

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorCurrentRound) {
      handleContractError(errorCurrentRound, 'vote');
    }
  }, [errorCurrentRound]);

  // 如果还没有人质押，跳转到质押页面
  useEffect(() => {
    if (currentToken && !currentToken.initialStakeRound) {
      router.push(`/gov/stakelp?symbol=${currentToken.symbol}&first=true`);
    }
  }, [currentToken]);

  return (
    <>
      <Header title="治理首页" />
      <main className="flex-grow">
        <TokenTab />
        <GovernanceDataPanel currentRound={currentVoteRound} />
        <MyStakingPanel />
        <MyVotingPanel currentRound={currentVoteRound} />
        <MyVerifingPanel currentRound={currentVoteRound > 2 ? currentVoteRound - 2n : 0n} />
      </main>
    </>
  );
};

export default GovPage;
