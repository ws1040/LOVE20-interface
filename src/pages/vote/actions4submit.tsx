import Header from '@/src/components/Header';
import { useCurrentRound } from '@/src/hooks/contracts/useLOVE20Submit';
import SubmitingActionList from '@/src/components/ActionList/SubmitingActionList';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

const Actions4SubmitPage = () => {
  const { currentRound, isPending, error: errorCurrentRound } = useCurrentRound();
  if (isPending) {
    return <LoadingIcon />;
  }
  if (errorCurrentRound) {
    console.error('errorCurrentRound', errorCurrentRound);
    return <div>加载出错，请稍后再试。</div>;
  }

  return (
    <>
      <Header title="推举" />
      <main className="flex-grow">
        <SubmitingActionList currentRound={currentRound} />
      </main>
    </>
  );
};

export default Actions4SubmitPage;
