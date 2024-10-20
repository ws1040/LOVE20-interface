import { useContext } from 'react';
import { useAccount } from 'wagmi';

import { useBalanceOf } from '../../hooks/contracts/useLOVE20Token';
import { TokenContext } from '../../contexts/TokenContext';

import Header from '../../components/Header';
import StakeLiquidityPanel from '../../components/Stake/StakeLiquidityPanel';
import StakeTokenPanel from '../../components/Stake/StakeTokenPanel';

const StakePage = () => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();

  const { balance: tokenBalance } = useBalanceOf(token?.address as `0x${string}`, accountAddress as `0x${string}`);
  const { balance: parentTokenBalance } = useBalanceOf(
    token?.parentTokenAddress as `0x${string}`,
    accountAddress as `0x${string}`,
  );

  return (
    <>
      <Header title="质押" />
      <main className="flex-grow">
        <StakeLiquidityPanel tokenBalance={tokenBalance || 0n} parentTokenBalance={parentTokenBalance || 0n} />
        <StakeTokenPanel tokenBalance={tokenBalance || 0n} />
        <div className="flex flex-col w-full rounded p-4 bg-base-100 mt-4">
          <div className="text-base font-bold text-gray-700 pb-2">规则说明：</div>
          <div className="text-sm text-gray-500">1、所得治理票数 = LP 数量 * 释放期轮次</div>
          <div className="text-sm text-gray-500">
            2、释放期指：申请解锁后，几轮之后可以领取。最小为4轮，最大为12轮。
          </div>
        </div>
      </main>
    </>
  );
};

export default StakePage;
