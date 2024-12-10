import Header from '@/src/components/Header';

import { useCurrentRound } from '@/src/hooks/contracts/useLOVE20Vote';
import StakedLiquidDataPanel from '@/src/components/DataPanel/StakedLiquidDataPanel';

const ActingPage = () => {
  const { currentRound: currentVoteRound } = useCurrentRound();

  return (
    <>
      <Header title="流动性质押数据" />
      <main className="flex-grow">
        <StakedLiquidDataPanel />
      </main>
    </>
  );
};

export default ActingPage;
