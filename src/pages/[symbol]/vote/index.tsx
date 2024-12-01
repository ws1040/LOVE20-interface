import { useContext } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { useCurrentRound } from '@/src/hooks/contracts/useLOVE20Vote';
import { TokenContext } from '@/src/contexts/TokenContext';
import Header from '@/src/components/Header';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
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
        <VotingActionList currentRound={currentRound} />
      </main>
    </>
  );
};

export default VotePage;
