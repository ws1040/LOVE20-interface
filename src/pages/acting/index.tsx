import { useCurrentRound } from '@/src/hooks/contracts/useLOVE20Join';
import ActDataPanel from '@/src/components/DataPanel/ActDataPanel';
import Header from '@/src/components/Header';
import JoiningActionList from '@/src/components/ActionList/JoiningActionList';
import TokenTab from '@/src/components/Token/TokenTab';

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
