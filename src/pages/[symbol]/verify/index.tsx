import Header from '@/src/components/Header';

import { useCurrentRound } from '@/src/hooks/contracts/useLOVE20Verify';

import MyVerifingPanel from '@/src/components/My/MyVerifingPanel';
import VerifingActionList from '@/src/components/ActionList/VerifingActionList';

const VerifyPage = () => {
  const { currentRound } = useCurrentRound();

  return (
    <>
      <Header title="社区首页" />
      <main className="flex-grow">
        <MyVerifingPanel currentRound={currentRound} showBtn={false} />
        <VerifingActionList currentRound={currentRound} />
      </main>
    </>
  );
};

export default VerifyPage;
