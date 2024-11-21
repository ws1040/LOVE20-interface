import { useContext } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { TokenContext } from '@/src/contexts/TokenContext';
import { useAccountStakeStatus } from '@/src/hooks/contracts/useLOVE20Stake';
import { formatTokenAmount } from '@/src/lib/format';
import Loading from '@/src/components/Common/Loading';
import AddToMetamask from '@/src/components/Common/AddToMetamask';

const MyGovernanceAssetsPanel = () => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();
  const {
    slAmount,
    stAmount,
    promisedWaitingRounds,
    requestedUnstakeRound,
    govVotes,
    isPending: isPendingAccountStakeStatus,
    error: errorAccountStakeStatus,
  } = useAccountStakeStatus(token?.address as `0x${string}`, accountAddress as `0x${string}`);

  if (!token) {
    return <Loading />;
  }

  return (
    <>
      <div className="w-full flex flex-col items-center rounded p-4 bg-white mt-1">
        <div className="w-full text-left mb-4">
          <h2 className="relative pl-4 text-gray-700 text-base font-medium before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-red-500">
            我参与治理的资产
          </h2>
        </div>
        <div className="flex w-full justify-center">
          <div className="flex flex-col items-center flex-1">
            <span className="flex items-center">
              <span className="text-sm text-gray-500">流动性质押</span>
              <AddToMetamask
                tokenAddress={token.slTokenAddress as `0x${string}`}
                tokenSymbol={'sl' + token.symbol}
                tokenDecimals={token.decimals}
              />
            </span>
            <span className="text-2xl font-bold text-orange-400">
              {isPendingAccountStakeStatus ? <Loading /> : formatTokenAmount(slAmount || BigInt(0))}
            </span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="flex items-center">
              <span className="text-sm text-gray-500">质押代币</span>
              <AddToMetamask
                tokenAddress={token.stTokenAddress as `0x${string}`}
                tokenSymbol={'st' + token.symbol}
                tokenDecimals={token.decimals}
              />
            </span>
            <span className="text-2xl font-bold text-orange-400">
              {isPendingAccountStakeStatus ? <Loading /> : formatTokenAmount(stAmount || BigInt(0))}
            </span>
          </div>
        </div>
        <div className="flex w-full justify-center mt-2">
          <div className="flex flex-col items-center flex-1">
            <span className="text-sm text-gray-500">承诺释放间隔轮次</span>
            <span>
              <span className="text-2xl font-bold text-orange-400">
                {isPendingAccountStakeStatus ? <Loading /> : `${promisedWaitingRounds || BigInt(0)}`}
              </span>
              <span className="text-sm text-gray-500"> 轮</span>
            </span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-sm text-gray-500">治理票数</span>
            <span className="text-2xl font-bold text-orange-400">
              {isPendingAccountStakeStatus ? <Loading /> : formatTokenAmount(govVotes || BigInt(0))}
            </span>
          </div>
        </div>
        <div className="flex w-full justify-center mt-2">
          <Button className="w-1/2 bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/my/govrewards">查看治理奖励</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default MyGovernanceAssetsPanel;
