import Header from '@/src/components/Header';

import { useCurrentRound } from '@/src/hooks/contracts/useLOVE20Join';

import TokenTab from '@/src/components/Token/TokenTab';
import ActDataPanel from '@/src/components/DataPanel/ActDataPanel';
import JoiningActionList from '@/src/components/ActionList/JoiningActionList';

const ActingPage = () => {
  const { currentRound } = useCurrentRound();

  return (
    <>
      <Header title="社区首页" />
      <main className="flex-grow">
        <TokenTab />
        <ActDataPanel currentRound={currentRound} />
        <JoiningActionList currentRound={currentRound} />
      </main>
    </>
  );
};

export default ActingPage;
