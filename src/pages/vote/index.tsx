import Header from '@/src/components/Header';
import Link from 'next/link';

import { useCurrentRound } from '@/src/hooks/contracts/useLOVE20Vote';

import VotingActionList from '@/src/components/ActionList/VotingActionList';
import Loading from '@/src/components/Common/Loading';
import { Button } from '@/components/ui/button';
import Round from '@/src/components/Common/Round';

const VotePage = () => {
  const { currentRound, isPending: isPendingCurrentRound, error: errCurrentRound } = useCurrentRound();

  return (
    <>
      <Header title="投票首页" />
      <main className="flex-grow">
        <div className="flex flex-col items-center space-y-4 p-6 bg-white">
          {isPendingCurrentRound ? <Loading /> : <Round currentRound={currentRound} roundName="投票轮" />}

          <Link href="/vote/actions4submit" className="w-1/2">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">推举其他行动</Button>
          </Link>
        </div>

        <VotingActionList currentRound={currentRound} />
      </main>
    </>
  );
};

export default VotePage;
