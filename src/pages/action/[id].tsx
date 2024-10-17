import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';

import ActionPanelForJoin from '../../components/ActionDetail/ActionPanelForJoin';
import ActionDetail from '../../components/ActionDetail/ActionDetail';

const ActionPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [round, setRound] = useState<bigint | null>(null);
  const idParam = Array.isArray(id) ? id[0] : id;
  
  const handleRoundChange = (newRound: bigint) => {
    setRound(newRound);
  };

  return (
    <>
      <Header title="行动详情" />
      <main className="flex-grow">
        <ActionPanelForJoin actionId={BigInt(idParam || 0)} onRoundChange={handleRoundChange} />
        <ActionDetail actionId={BigInt(idParam || 0)} round={BigInt(round || 0)} />
      </main>
    </>
  );
};

export default ActionPage;
