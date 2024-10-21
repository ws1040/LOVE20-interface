import Header from '../../components/Header';
import { useCurrentRound } from '../../hooks/contracts/useLOVE20Submit';
import SubmitingActionList from '../../components/ActionList/SubmitingActionList';
import Loading from '../../components/Common/Loading';

const Actions4SubmitPage = () => {
  const { currentRound, isPending, error } = useCurrentRound();

  return (
    <>
      <Header title="推举" />
      <main className="flex-grow">
        <div className="flex flex-col items-center space-y-4 p-6 bg-base-100">
          <h1 className="text-base text-center">
            投票轮（第 {isPending ? <Loading /> : <span className="text-red-500">{Number(currentRound)}</span>} 轮）
          </h1>
        </div>
        {isPending ? <Loading /> : <SubmitingActionList currentRound={currentRound} />}
      </main>
    </>
  );
};

export default Actions4SubmitPage;
