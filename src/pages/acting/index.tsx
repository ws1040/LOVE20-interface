import Head from 'next/head';
import Header from '../../components/Header';

import { useCurrentRound } from '../../hooks/contracts/useLOVE20Join';

import TokenTab from '../../components/Token/TokenTab';
import ActDataPanel from '../../components/DataPanel/ActDataPanel';
import ActionRoundList from '../../components/ActionList/ActionRoundList';


const ActingPage = () => {

  const { currentRound } = useCurrentRound();

  return (
    <>
      <Head>
        <title>社区首页 - LIFE20</title>
        <meta name="LIFE20社区" content="A Web3 DApp for Life20 token management" />
      </Head>
      <Header title="社区首页" />
      <main className="flex-grow">
        <TokenTab />
        <ActDataPanel currentRound={currentRound} />
        <ActionRoundList currentRound={currentRound} />
      </main>
    </>
  );
};

export default ActingPage;