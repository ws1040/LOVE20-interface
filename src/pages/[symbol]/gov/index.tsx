import Header from '@/src/components/Header';

import { useCurrentRound } from '@/src/hooks/contracts/useLOVE20Vote';

import GovernanceDataPanel from '@/src/components/DataPanel/GovernanceDataPanel';
import MyStakingPanel from '@/src/components/My/MyStakingPanel';
import MyVotingPanel from '@/src/components/My/MyVotingPanel';
import MyVerifingPanel from '@/src/components/My/MyVerifingPanel';

const ActingPage = () => {
  const { currentRound: currentVoteRound } = useCurrentRound();

  return (
    <>
      <Header title="治理首页" />
      <main className="flex-grow">
        <GovernanceDataPanel />
        <MyStakingPanel />
        <MyVotingPanel currentRound={currentVoteRound} />
        <MyVerifingPanel currentRound={currentVoteRound > 2 ? currentVoteRound - 2n : 0n} />
      </main>
    </>
  );
};

export default ActingPage;
