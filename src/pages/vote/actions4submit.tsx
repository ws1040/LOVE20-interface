import { useEffect } from 'react';

// my hooks
import { useCurrentRound } from '@/src/hooks/contracts/useLOVE20Submit';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my components
import Header from '@/src/components/Header';
import SubmitingActionList from '@/src/components/ActionList/SubmitingActionList';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

const Actions4SubmitPage = () => {
  const { currentRound, isPending, error: errorCurrentRound } = useCurrentRound();

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorCurrentRound) {
      handleContractError(errorCurrentRound, 'submit');
    }
  }, [errorCurrentRound]);

  if (isPending) {
    return <LoadingIcon />;
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
