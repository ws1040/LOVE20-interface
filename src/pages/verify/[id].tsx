'use client';

import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

// my hooks
import { useCurrentRound } from '@/src/hooks/contracts/useLOVE20Verify';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my types
import { ActionInfo } from '@/src/types/life20types';

// my components
import Header from '@/src/components/Header';
import ActionDetail from '@/src/components/ActionDetail/ActionDetail';
import MyActionVerifingPanel from '@/src/components/My/MyActionVerifingPanel';
import VerifyAddresses from '@/src/components/Verify/VerifyAddresses';

const VerifyPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const actionId = BigInt((id as string) || '0');

  const { currentRound, error: errorCurrentRound } = useCurrentRound();

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorCurrentRound) {
      handleContractError(errorCurrentRound, 'verify');
    }
  }, [errorCurrentRound]);

  // 状态：剩余票数
  const [remainingVotes, setRemainingVotes] = useState<bigint>(BigInt(0));
  function onRemainingVotesChange(votes: bigint) {
    setRemainingVotes(votes);
  }

  // 行动详情
  const [actionInfo, setActionInfo] = useState<ActionInfo | undefined>(undefined);

  return (
    <>
      <Header title="验证" />
      <main className="flex-grow">
        <div className="flex flex-col items-center p-4 mb-4">
          <MyActionVerifingPanel
            currentRound={currentRound}
            actionId={actionId}
            onRemainingVotesChange={onRemainingVotesChange}
          />
          <VerifyAddresses
            currentRound={currentRound}
            actionId={actionId}
            actionInfo={actionInfo}
            remainingVotes={remainingVotes}
          />
        </div>
        <ActionDetail
          actionId={actionId}
          round={BigInt(currentRound || 0)}
          showSubmitter={true}
          onActionInfo={setActionInfo}
        />
      </main>
    </>
  );
};

export default VerifyPage;
