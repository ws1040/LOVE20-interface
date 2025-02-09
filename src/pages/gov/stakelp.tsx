'use client';

import { useContext, useEffect } from 'react';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my hooks
import { useTokenAmounts } from '@/src/hooks/contracts/useLOVE20SLToken';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my components
import Header from '@/src/components/Header';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import SlTokenTab from '@/src/components/Token/SlTokenTab';
import StakeLiquidityPanel from '@/src/components/Stake/StakeLiquidityPanel';

const StakePage = () => {
  const { token } = useContext(TokenContext) || {};

  const hasInitialStakeRound = !!token?.initialStakeRound && token?.initialStakeRound > 0;

  // 获取质押LP消耗的token数量
  const {
    tokenAmount: stakedTokenAmount,
    isPending: isPendingStakedTokenAmount,
    error: errorStakedTokenAmount,
  } = useTokenAmounts(token?.slTokenAddress as `0x${string}`, hasInitialStakeRound);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorStakedTokenAmount) {
      handleContractError(errorStakedTokenAmount, 'slToken');
    }
  }, [errorStakedTokenAmount]);

  return (
    <>
      <Header title="质押LP" />
      <main className="flex-grow">
        {isPendingStakedTokenAmount && hasInitialStakeRound && (
          <div className="flex justify-center items-center mt-10">
            <LoadingIcon />
          </div>
        )}
        <SlTokenTab />
        {(!isPendingStakedTokenAmount || !hasInitialStakeRound) && (
          <StakeLiquidityPanel stakedTokenAmountOfLP={stakedTokenAmount || 0n} />
        )}
        <div className="flex flex-col w-full p-4 mt-4">
          <div className="text-base font-bold text-greyscale-700 pb-2">规则说明：</div>
          <div className="text-sm text-greyscale-500">1、所得治理票数 = LP 数量 * 释放期轮次</div>
          <div className="text-sm text-greyscale-500">
            2、释放期指：申请解锁后，几轮之后可以领取。最小为4轮，最大为12轮。
          </div>
        </div>
      </main>
    </>
  );
};

export default StakePage;
