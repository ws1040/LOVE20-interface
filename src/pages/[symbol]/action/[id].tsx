import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/src/components/Header';

import ActionDetail from '@/src/components/ActionDetail/ActionDetail';
import ActionPanelForSubmit from '@/src/components/ActionDetail/ActionPanelForSubmit';
import ActionPanelForVoting from '@/src/components/ActionDetail/ActionPanelForVoting';
import ActionPanelForJoin from '@/src/components/ActionDetail/ActionPanelForJoin';
import ActionPanelForVerifing from '@/src/components/ActionDetail/ActionPanelForVerifing';
const ActionPage = () => {
  const router = useRouter();
  const { id, type, submitted } = router.query;
  const idParam = id as string;
  const typeParam = type as string;
  const submittedParam = submitted as string;

  const [round, setRound] = useState<bigint | null>(null);
  const handleRoundChange = (newRound: bigint) => {
    setRound(newRound);
  };

  return (
    <>
      <Header title="行动详情" />
      <main className="flex-grow">
        {typeParam === 'submit' && (
          <ActionPanelForSubmit
            actionId={BigInt(idParam || 0)}
            submitted={submittedParam === 'true'}
            onRoundChange={handleRoundChange}
          />
        )}
        {typeParam === 'vote' && (
          <ActionPanelForVoting actionId={BigInt(idParam || 0)} onRoundChange={handleRoundChange} />
        )}
        {(typeParam === 'join' || typeParam === undefined) && (
          <ActionPanelForJoin actionId={BigInt(idParam || 0)} onRoundChange={handleRoundChange} />
        )}
        {typeParam === 'verify' && (
          <ActionPanelForVerifing actionId={BigInt(idParam || 0)} onRoundChange={handleRoundChange} />
        )}
        <ActionDetail
          actionId={BigInt(idParam || 0)}
          round={BigInt(round || 0)}
          showSubmitter={typeParam !== 'submit'}
        />
      </main>
    </>
  );
};

export default ActionPage;
