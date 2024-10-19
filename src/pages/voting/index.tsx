import Header from '../../components/Header';
import Link from 'next/link';

import { useCurrentRound } from '../../hooks/contracts/useLOVE20Vote';

import VotingActionList from '../../components/ActionList/VotingActionList';
import Loading from '../../components/Common/Loading';

const VotingPage = () => {
  const { currentRound, isPending: isPendingCurrentRound, error: errCurrentRound } = useCurrentRound();

  return (
    <>
      <Header title="投票首页" />
      <main className="flex-grow">
        <div className="flex flex-col items-center space-y-4 p-6 bg-base-100">
          <h1 className="text-base text-center">
            投票轮（第
            <span className="text-red-500">{isPendingCurrentRound ? <Loading /> : Number(currentRound)}</span>
            轮）
          </h1>
          <Link href="/gov/actions4submit" className="btn w-1/2">
            推举其他行动
          </Link>
        </div>

        <VotingActionList currentRound={currentRound} />
      </main>
    </>
  );
};

export default VotingPage;
