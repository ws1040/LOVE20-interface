import { useContext } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { TokenContext } from '@/src/contexts/TokenContext';
import { useAccountStakeStatus } from '@/src/hooks/contracts/useLOVE20Stake';
import { formatTokenAmount } from '@/src/lib/format';
import LoadingIcon from '@/src/components/Common/LoadingIcon';
import AddToMetamask from '@/src/components/Common/AddToMetamask';
import AddressWithCopyButton from '@/src/components/Common/AddressWithCopyButton';
import LeftTitle from '@/src/components/Common/LeftTitle';

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
    return <LoadingIcon />;
  }

  return (
    <>
      <div className="flex-col items-center px-6 pt-6 pb-2">
        <LeftTitle title="参与治理的资产" />
        <div className="stats w-full grid grid-cols-2 divide-x-0">
          <div className="stat place-items-center">
            <div className="stat-title text-sm flex items-center">
              流动性质押
              <AddressWithCopyButton address={token.slTokenAddress as `0x${string}`} showAddress={false} />
              <AddToMetamask
                tokenAddress={token.slTokenAddress as `0x${string}`}
                tokenSymbol={'sl' + token.symbol}
                tokenDecimals={token.decimals}
              />
            </div>
            <div className="stat-value text-xl">
              {isPendingAccountStakeStatus ? <LoadingIcon /> : formatTokenAmount(slAmount || BigInt(0))}
            </div>
          </div>
          <div className="stat place-items-center">
            <div className="stat-title text-sm flex items-center">
              质押代币
              <AddressWithCopyButton address={token.stTokenAddress as `0x${string}`} showAddress={false} />
              <AddToMetamask
                tokenAddress={token.stTokenAddress as `0x${string}`}
                tokenSymbol={'st' + token.symbol}
                tokenDecimals={token.decimals}
              />
            </div>
            <div className="stat-value text-xl">
              {isPendingAccountStakeStatus ? <LoadingIcon /> : formatTokenAmount(stAmount || BigInt(0))}
            </div>
          </div>
        </div>
        <div className="stats w-full grid grid-cols-2 divide-x-0">
          <div className="stat place-items-center">
            <div className="stat-title text-sm">承诺释放间隔轮次</div>
            <div className="stat-value text-xl">
              {isPendingAccountStakeStatus ? <LoadingIcon /> : `${promisedWaitingRounds || BigInt(0)}`}
            </div>
          </div>
          <div className="stat place-items-center">
            <div className="stat-title text-sm">治理票数</div>
            <div className="stat-value text-xl">
              {isPendingAccountStakeStatus ? <LoadingIcon /> : formatTokenAmount(govVotes || BigInt(0))}
            </div>
          </div>
        </div>

        <div className="flex w-full justify-center mt-2">
          <Button variant="outline" size="sm" className="w-1/2 text-secondary border-secondary" asChild>
            <Link href={`/${token.symbol}/my/govrewards`}>查看治理奖励</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default MyGovernanceAssetsPanel;
