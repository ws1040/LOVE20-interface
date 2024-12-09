import { useContext } from 'react';
import { useAccount } from 'wagmi';

import { TokenContext } from '@/src/contexts/TokenContext';
import { useBalanceOf } from '@/src/hooks/contracts/useLOVE20Token';
import { useTokenAmounts } from '@/src/hooks/contracts/useLOVE20SLToken';
import Header from '@/src/components/Header';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import StakeTokenPanel from '@/src/components/Stake/StakeTokenPanel';

const StakePage = () => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();
  const { balance: tokenBalance } = useBalanceOf(token?.address as `0x${string}`, accountAddress as `0x${string}`);
  const { balance: parentTokenBalance } = useBalanceOf(
    token?.parentTokenAddress as `0x${string}`,
    accountAddress as `0x${string}`,
  );
  const {
    tokenAmount: stakedTokenAmount,
    parentTokenAmount: stakedParentTokenAmount,
    feeTokenAmount: stakedFeeTokenAmount,
    feeParentTokenAmount: stakedFeeParentTokenAmount,
    isPending: isPendingStakedTokenAmount,
  } = useTokenAmounts(token?.slTokenAddress as `0x${string}`);

  return (
    <>
      <Header title="质押代币" />
      <main className="flex-grow">
        {isPendingStakedTokenAmount && <LoadingIcon />}
        {!isPendingStakedTokenAmount && !stakedTokenAmount && (
          <div className="flex justify-center items-center mt-10">需要先质押流动性LP，才可以质押代币</div>
        )}
        {stakedTokenAmount && <StakeTokenPanel tokenBalance={tokenBalance || 0n} />}
        <div className="flex flex-col w-full p-6 mt-4">
          <div className="text-base font-bold text-greyscale-700 pb-2">规则说明：</div>
          <div className="text-sm text-greyscale-500 mb-2">
            1、单独质押代币可获得激励提升（最高不超过 2 倍的验证激励），同时获得 st类代币作为质押的凭证；
          </div>
          <div className="text-sm text-greyscale-500">
            2、释放期指：申请解锁后，几轮之后可以领取。最小为4轮，最大为12轮；
          </div>
        </div>
      </main>
    </>
  );
};

export default StakePage;
