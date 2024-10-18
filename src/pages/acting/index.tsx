import Header from '../../components/Header';

import { useCurrentRound } from '../../hooks/contracts/useLOVE20Join';

import TokenTab from '../../components/Token/TokenTab';
import ActDataPanel from '../../components/DataPanel/ActDataPanel';
import JoiningActionList from '../../components/ActionList/JoiningActionList';


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