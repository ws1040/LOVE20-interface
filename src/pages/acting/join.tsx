'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// my hooks
import { useActionInfo } from '@/src/hooks/contracts/useLOVE20Submit';
import { useCurrentRound } from '@/src/hooks/contracts/useLOVE20Join';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my components
import ActionDetail from '@/src/components/ActionDetail/ActionDetail';
import Header from '@/src/components/Header';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import MyJoinInfoOfActionAbstract from '@/src/components/My/MyJoinInfoOfActionAbstract';
import SubmitJoin from '@/src/components/Join/SubmitJoin';

const JoinPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const actionId = id as string;
  const [stakedAmount, setStakedAmount] = useState<bigint | undefined>(undefined);
  function onStakedAmountChange(stakedAmount: bigint) {
    setStakedAmount(stakedAmount);
  }

  const { token } = useContext(TokenContext) || {};
  const { currentRound, isPending: isPendingCurrentRound, error: errorCurrentRound } = useCurrentRound();

  // 获取行动详情
  const {
    actionInfo,
    isPending: isPendingActionInfo,
    error: errorActionInfo,
  } = useActionInfo(token?.address as `0x${string}`, actionId === undefined ? undefined : BigInt(actionId));

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorCurrentRound) {
      handleContractError(errorCurrentRound, 'join');
    }
    if (errorActionInfo) {
      handleContractError(errorActionInfo, 'submit');
    }
  }, [errorCurrentRound, errorActionInfo]);

  // 加载中
  if (!id || Array.isArray(id)) {
    return <LoadingIcon />;
  }

  if (isPendingActionInfo || isPendingCurrentRound) {
    return <LoadingIcon />;
  }

  if (errorActionInfo || errorCurrentRound) {
    console.error(errorActionInfo, errorCurrentRound);
    return <div>加载失败</div>;
  }

  return (
    <>
      <Header title="加入行动" />
      <main className="flex-grow">
        <MyJoinInfoOfActionAbstract actionId={BigInt(actionId)} onStakedAmountChange={onStakedAmountChange} />
        <SubmitJoin actionInfo={actionInfo} stakedAmount={stakedAmount} />
        <div className="flex flex-col w-full rounded p-6">
          <div className="text-base font-bold text-greyscale-700 pb-2">规则说明：</div>
          <div className="text-sm text-greyscale-500">1、参与代币越多，被选中验证并获得奖励的概率越大</div>
          <div className="text-sm text-greyscale-500">
            2、轮次结束后，可随时在我的页面取回参与的代币，或者继续参与此行动的之后轮次
          </div>
        </div>
        <ActionDetail actionId={BigInt(actionId)} round={currentRound} showSubmitter={false} />
      </main>
    </>
  );
};

export default JoinPage;
