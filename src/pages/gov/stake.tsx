import { useContext, useState } from 'react';
import { useAccount } from 'wagmi';

import { useBalanceOf } from '@/src/hooks/contracts/useLOVE20Token';
import { TokenContext } from '@/src/contexts/TokenContext';

import Header from '@/src/components/Header';
import StakeLiquidityPanel from '@/src/components/Stake/StakeLiquidityPanel';
import StakeTokenPanel from '@/src/components/Stake/StakeTokenPanel';
import StakedLiquidDataPanel from '@/src/components/DataPanel/StakedLiquidDataPanel';

const StakePage = () => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();
  const { balance: tokenBalance } = useBalanceOf(token?.address as `0x${string}`, accountAddress as `0x${string}`);
  const { balance: parentTokenBalance } = useBalanceOf(
    token?.parentTokenAddress as `0x${string}`,
    accountAddress as `0x${string}`,
  );

  const [stakedTokenAmountOfLP, setStakedTokenAmountOfLP] = useState<bigint>(BigInt(-1));
  // console.log('---stake: stakedTokenAmountOfLP', stakedTokenAmountOfLP);

  return (
    <>
      <Header title="质押" />
      <main className="flex-grow">
        <div className="w-full flex flex-col items-center rounded p-4  space-y-4">
          <StakedLiquidDataPanel showStakeToken={false} onTokenAmountChange={setStakedTokenAmountOfLP} />
        </div>
        {stakedTokenAmountOfLP !== BigInt(-1) && (
          <StakeLiquidityPanel
            tokenBalance={tokenBalance || 0n}
            parentTokenBalance={parentTokenBalance || 0n}
            stakedTokenAmountOfLP={stakedTokenAmountOfLP}
          />
        )}
        {stakedTokenAmountOfLP !== BigInt(-1) && <StakeTokenPanel tokenBalance={tokenBalance || 0n} />}
        <div className="flex flex-col w-full rounded p-4 mt-4">
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
