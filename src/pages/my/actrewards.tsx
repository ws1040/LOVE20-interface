'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

// my hooks
import { useCurrentRound } from '@/src/hooks/contracts/useLOVE20Join';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my components
import ActionDetail from '@/src/components/ActionDetail/ActionDetail';
import Header from '@/src/components/Header';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import MyJoinInfoOfActionPancel from '@/src/components/My/MyJoinInfoOfActionPancel';
import VerifiedAddressesByAction from '@/src/components/Mint/VerifiedAddressesByAction';

const ActRewardsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const actId = id as string;

  const {
    currentRound: currentJoinRound,
    isPending: isPendingCurrentJoinRound,
    error: errCurrentJoinRound,
  } = useCurrentRound();

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errCurrentJoinRound) {
      handleContractError(errCurrentJoinRound, 'join');
    }
  }, [errCurrentJoinRound]);

  return (
    <>
      <Header title="行动激励" />
      <main className="flex-grow">
        {isPendingCurrentJoinRound ? (
          <LoadingIcon />
        ) : (
          <>
            <MyJoinInfoOfActionPancel actionId={BigInt(actId || 0)} />
            <VerifiedAddressesByAction currentJoinRound={currentJoinRound} actionId={BigInt(actId || 0)} />
            <ActionDetail
              actionId={BigInt(actId || 0)}
              round={currentJoinRound}
              showSubmitter={false}
              showVerifyHistory={false}
            />
          </>
        )}
      </main>
    </>
  );
};

export default ActRewardsPage;
