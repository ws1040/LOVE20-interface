import { useContext, useEffect } from 'react';
import { useAccount } from 'wagmi';

// my contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// my hooks
import { useBalanceOf } from '@/src/hooks/contracts/useLOVE20Token';
import { useTokenAmounts } from '@/src/hooks/contracts/useLOVE20SLToken';
import { useHandleContractError } from '@/src/lib/errorUtils';

// my components
import Header from '@/src/components/Header';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import StakeLiquidityPanel from '@/src/components/Stake/StakeLiquidityPanel';

const StakePage = () => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();
  const { balance: tokenBalance, error: errorTokenBalance } = useBalanceOf(
    token?.address as `0x${string}`,
    accountAddress as `0x${string}`,
  );
  const { balance: parentTokenBalance, error: errorParentTokenBalance } = useBalanceOf(
    token?.parentTokenAddress as `0x${string}`,
    accountAddress as `0x${string}`,
  );

  const hasInitialStakeRound = !!token?.initialStakeRound && token?.initialStakeRound > 0;
  const {
    tokenAmount: stakedTokenAmount,
    parentTokenAmount: stakedParentTokenAmount,
    feeTokenAmount: stakedFeeTokenAmount,
    feeParentTokenAmount: stakedFeeParentTokenAmount,
    isPending: isPendingStakedTokenAmount,
    error: errorStakedTokenAmount,
  } = useTokenAmounts(token?.slTokenAddress as `0x${string}`, hasInitialStakeRound);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorStakedTokenAmount) {
      handleContractError(errorStakedTokenAmount, 'slToken');
    }
    if (errorTokenBalance) {
      handleContractError(errorTokenBalance, 'token');
    }
    if (errorParentTokenBalance) {
      handleContractError(errorParentTokenBalance, 'token');
    }
  }, [errorStakedTokenAmount, errorTokenBalance, errorParentTokenBalance]);

  return (
    <>
      <Header title="质押LP" />
      <main className="flex-grow">
        {isPendingStakedTokenAmount && hasInitialStakeRound && (
          <div className="flex justify-center items-center mt-10">
            <LoadingIcon />
          </div>
        )}
        {(!isPendingStakedTokenAmount || !hasInitialStakeRound) && (
          <StakeLiquidityPanel
            tokenBalance={tokenBalance || 0n}
            parentTokenBalance={parentTokenBalance || 0n}
            stakedTokenAmountOfLP={stakedTokenAmount || 0n}
          />
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
