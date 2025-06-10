'use client';

import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

// my hooks
import { useCurrentRound } from '@/src/hooks/contracts/useLOVE20Verify';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my types
import { ActionInfo } from '@/src/types/love20types';

// my components
import Header from '@/src/components/Header';
import ActionDetail from '@/src/components/ActionDetail/ActionDetail';
import LeftTitle from '@/src/components/Common/LeftTitle';
import MyActionVerifingPanel from '@/src/components/My/MyActionVerifingPanel';
import RoundLite from '@/src/components/Common/RoundLite';
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
        {remainingVotes > 0 && (
          <div className="px-4">
            <LeftTitle title="请给行动的参与者打分：" />
            <RoundLite currentRound={currentRound} roundType="verify" showCountdown={false} />
          </div>
        )}
        <div className="flex flex-col items-center p-4">
          <VerifyAddresses
            currentRound={currentRound}
            actionId={actionId}
            actionInfo={actionInfo}
            remainingVotes={remainingVotes}
          />
        </div>

        <div className={`${remainingVotes > 0 ? 'mb-6' : ''}`}>
          <MyActionVerifingPanel
            currentRound={currentRound}
            actionId={actionId}
            onRemainingVotesChange={onRemainingVotesChange}
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
