import Header from '@/src/components/Header';
import { useCurrentRound } from '@/src/hooks/contracts/useLOVE20Submit';
import SubmitingActionList from '@/src/components/ActionList/SubmitingActionList';
import Loading from '@/src/components/Common/Loading';
import Round from '@/src/components/Common/Round';

const Actions4SubmitPage = () => {
  const { currentRound, isPending, error } = useCurrentRound();

  return (
    <>
      <Header title="推举" />
      <main className="flex-grow">
        <div className="flex flex-col items-center space-y-4 p-6 bg-white">
          {isPending ? <Loading /> : <Round currentRound={currentRound} roundName="投票轮" />}
        </div>
        {isPending ? <Loading /> : <SubmitingActionList currentRound={currentRound} />}
      </main>
    </>
  );
};

export default Actions4SubmitPage;
