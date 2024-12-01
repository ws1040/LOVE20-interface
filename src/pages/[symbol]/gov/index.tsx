import Header from '@/src/components/Header';

import { useCurrentRound } from '@/src/hooks/contracts/useLOVE20Vote';
import GovernanceDataPanel from '@/src/components/DataPanel/GovernanceDataPanel';
import MyStakingPanel from '@/src/components/My/MyStakingPanel';
import MyVotingPanel from '@/src/components/My/MyVotingPanel';
import MyVerifingPanel from '@/src/components/My/MyVerifingPanel';
import TokenTab from '@/src/components/Token/TokenTab';

const ActingPage = () => {
  const { currentRound: currentVoteRound } = useCurrentRound();

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

export default ActingPage;
