import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';

import ActionPanelForJoin from '../../components/ActionDetail/ActionPanelForJoin';
import ActionDetail from '../../components/ActionDetail/ActionDetail';

const ActionPage = () => {
  const router = useRouter();
  const { id, type } = router.query;
  const idParam = id as string;
  const typeParam = type as string;
  
  const [round, setRound] = useState<bigint | null>(null);
  const handleRoundChange = (newRound: bigint) => {
    setRound(newRound);
  };

  return (
    <>
      <Header title="行动详情" />
      <main className="flex-grow">
        { (typeParam === 'join' || typeParam === undefined) && (
          <ActionPanelForJoin actionId={BigInt(idParam || 0)} onRoundChange={handleRoundChange} />
        )}
        <ActionDetail actionId={BigInt(idParam || 0)} round={BigInt(round || 0)} />

      </main>
    </>
  );
};

export default ActionPage;
