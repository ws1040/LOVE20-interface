import Header from '../../components/Header';

import { useCurrentRound } from '../../hooks/contracts/useLOVE20Vote';

import GovernanceDataPanel from '../../components/DataPanel/GovernanceDataPanel';
import MyStakingPanel from '../../components/My/MyStakingPanel';
import MyVotingPanel from '../../components/My/MyVotingPanel';
import MyVerifingPanel from '../../components/My/MyVerifingPanel';

const ActingPage = () => {

  const { currentRound: currentVoteRound } = useCurrentRound();

  return (
    <>
      <Header title="治理首页" />
      <main className="flex-grow">
        <GovernanceDataPanel />
        <MyStakingPanel currentRound={currentVoteRound} />
        <MyVotingPanel currentRound={currentVoteRound} />
        <MyVerifingPanel currentRound={currentVoteRound > 2 ? currentVoteRound - 2n : 0n} />
      </main>
    </>
  );
};

export default ActingPage;