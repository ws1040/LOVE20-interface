'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';

// my types
import { ActionInfo } from '@/src/types/love20types';

// my components
import Header from '@/src/components/Header';
import ActionDetail from '@/src/components/ActionDetail/ActionDetail';
import ActionPanelForSubmit from '@/src/components/ActionDetail/ActionPanelForSubmit';
import ActionPanelForVoting from '@/src/components/ActionDetail/ActionPanelForVoting';
import ActionPanelForJoin from '@/src/components/ActionDetail/ActionPanelForJoin';

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

  // 行动详情
  const [actionInfo, setActionInfo] = useState<ActionInfo | undefined>(undefined);

  return (
    <>
      <Header title="行动详情" showBackButton={true} />
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
          <ActionPanelForJoin actionId={BigInt(idParam || 0)} actionInfo={actionInfo} />
        )}
        <ActionDetail
          actionId={BigInt(idParam || 0)}
          round={BigInt(round || 0)}
          showSubmitter={typeParam !== 'submit'}
          onActionInfo={setActionInfo}
        />
      </main>
    </>
  );
};

export default ActionPage;
