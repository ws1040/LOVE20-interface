import { useCurrentRound } from '../../hooks/contracts/useLOVE20Join';

import TokenTab from '../../components/Token/TokenTab';
import ActDataPanel from '../../components/DataPanel/ActDataPanel';
import ActionRoundList from '../../components/ActionList/ActionRoundList';

const ActingPage = () => {

  const { currentRound } = useCurrentRound();

  return (
    <main className="flex-grow">
      <TokenTab />
      <ActDataPanel currentRound={currentRound} />
      <ActionRoundList currentRound={currentRound} />
    </main>
  );
};

export default ActingPage;

