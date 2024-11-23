import { useContext } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { useCurrentRound } from '@/src/hooks/contracts/useLOVE20Vote';
import { TokenContext } from '@/src/contexts/TokenContext';
import Header from '@/src/components/Header';
import Loading from '@/src/components/Common/Loading';
import Round from '@/src/components/Common/Round';
import VotingActionList from '@/src/components/ActionList/VotingActionList';

const VotePage = () => {
  const { currentRound, isPending: isPendingCurrentRound, error: errCurrentRound } = useCurrentRound();
  const tokenContext = useContext(TokenContext);
  const { token } = tokenContext || {};

  return (
    <>
      <Header title="投票首页" />
      <main className="flex-grow">
        <div className="flex flex-col items-center space-y-4 p-6 bg-white">
          {isPendingCurrentRound ? <Loading /> : <Round currentRound={currentRound} roundName="投票轮" />}

          {token && (
            <Link href={`/${token.symbol}/vote/actions4submit`} className="w-1/2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">推举其他行动</Button>
            </Link>
          )}
        </div>

        <VotingActionList currentRound={currentRound} />
      </main>
    </>
  );
};

export default VotePage;
