'use client';

import { useContext, useEffect } from 'react';
import { useAccount } from 'wagmi';

// use contexts
import { TokenContext } from '@/src/contexts/TokenContext';

// use hooks
import { useBalanceOf } from '@/src/hooks/contracts/useLOVE20Token';
import { useHandleContractError } from '@/src/lib/errorUtils';
import { useTokenAmounts } from '@/src/hooks/contracts/useLOVE20SLToken';

// use components
import Header from '@/src/components/Header';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import StakeTokenPanel from '@/src/components/Stake/StakeTokenPanel';
import StTokenTab from '@/src/components/Token/StTokenTab';

const StakePage = () => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();
  const { balance: tokenBalance } = useBalanceOf(token?.address as `0x${string}`, accountAddress as `0x${string}`);
  const {
    tokenAmount: stakedSLTokenAmount,
    isPending: isPendingStakedSLTokenAmount,
    error: errorStakedSLTokenAmount,
  } = useTokenAmounts(token?.slTokenAddress as `0x${string}`);

  // 错误处理
  const { handleContractError } = useHandleContractError();
  useEffect(() => {
    if (errorStakedSLTokenAmount) {
      handleContractError(errorStakedSLTokenAmount, 'slToken');
    }
  }, [errorStakedSLTokenAmount]);

  return (
    <>
      <Header title="质押代币" />
      <main className="flex-grow">
        {isPendingStakedSLTokenAmount && <LoadingIcon />}
        {!isPendingStakedSLTokenAmount && !stakedSLTokenAmount && (
          <div className="flex justify-center items-center mt-10">需要先质押流动性LP，才可以质押代币</div>
        )}
        {stakedSLTokenAmount && (
          <>
            <StTokenTab />
            <StakeTokenPanel tokenBalance={tokenBalance || 0n} />
          </>
        )}

        <div className="flex flex-col w-full p-4">
          <div className="bg-gray-100 text-greyscale-500 rounded-lg p-4 mb-8 text-sm">
            <div className="text-base font-bold text-greyscale-700 pt-2 pb-1">治理激励</div>
            <div className="text-sm text-greyscale-500 pb-1">1、当轮所得治理激励 = 验证激励 + 加速激励</div>
            <div className="text-sm text-greyscale-500 pb-1">2、质押代币可获得 加速激励</div>
            <div className="text-sm text-greyscale-500 pb-1">
              3、单个地址的验证激励：当轮治理总激励 * 50% * 该地址行使验证权的治理票数 / 行使验权的治理票总数
            </div>
            <div className="text-sm text-greyscale-500 pb-1">
              4、单个地址的加速激励：当轮治理总激励 * 50% * 该地址质押代币数量 / 质押代币总数量
            </div>
            <div className="text-sm text-greyscale-500">
              5、溢出：单个地址的加速激励 超过投票激励 2 倍以上的部分，为溢出激励，自动销毁，归入未来总激励
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default StakePage;
