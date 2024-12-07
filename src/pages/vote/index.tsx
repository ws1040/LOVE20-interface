import { useCurrentRound } from '@/src/hooks/contracts/useLOVE20Vote';
import Header from '@/src/components/Header';
import VotingActionList from '@/src/components/ActionList/VotingActionList';

const VotePage = () => {
  const { currentRound, isPending: isPendingCurrentRound, error: errCurrentRound } = useCurrentRound();

  return (
    <>
      <Header title="投票首页" />
      <main className="flex-grow">
        <VotingActionList currentRound={currentRound} />
      </main>
    </>
  );
};

export default VotePage;
