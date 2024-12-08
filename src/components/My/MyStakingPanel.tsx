import React, { useContext } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { formatTokenAmount } from '@/src/lib/format';
import { TokenContext } from '@/src/contexts/TokenContext';
import { useAccountStakeStatus } from '@/src/hooks/contracts/useLOVE20Stake';
import LeftTitle from '@/src/components/Common/LeftTitle';
import LoadingIcon from '@/src/components/Common/LoadingIcon';

const MyStakingPanel: React.FC = () => {
  const { token } = useContext(TokenContext) || {};
  const { address: accountAddress } = useAccount();

  const {
    govVotes,
    stAmount,
    isPending: isPendingAccountStakeStatus,
    error: errorAccountStakeStatus,
  } = useAccountStakeStatus((token?.address as `0x${string}`) || '', (accountAddress as `0x${string}`) || '');

  if (!token) {
    return '';
  }

  if (!accountAddress) {
    return (
      <>
        <div className="flex-col items-center px-6 py-2">
          <LeftTitle title="我的质押" />
          <div className="text-sm mt-4 text-greyscale-500 text-center">请先连接钱包</div>
        </div>
      </>
    );
  }

  if (errorAccountStakeStatus) {
    console.log('errorAccountStakeStatus', errorAccountStakeStatus);
  }

  return (
    <div className="flex-col items-center px-6 py-2">
      <LeftTitle title="我的质押" />
      <div className="stats w-full grid grid-cols-2 divide-x-0">
        <div className="stat place-items-center">
          <div className="stat-title text-sm">我的治理票数</div>
          <div className="stat-value text-xl">
            {isPendingAccountStakeStatus ? <LoadingIcon /> : formatTokenAmount(govVotes || BigInt(0))}
          </div>
          <div className="stat-actions">
            <Button variant="outline" size="sm" className="text-secondary border-secondary" asChild>
              <Link href={`/gov/stakelp?symbol=${token.symbol}`}>去获取</Link>
            </Button>
          </div>
        </div>
        <div className="stat place-items-center">
          <div className="stat-title text-sm">我的质押代币数</div>
          <div className="stat-value text-xl">
            {isPendingAccountStakeStatus ? <LoadingIcon /> : formatTokenAmount(stAmount || BigInt(0))}
          </div>
          <div className="stat-actions">
            <Button variant="outline" size="sm" className="text-secondary border-secondary" asChild>
              <Link href={`/gov/staketoken?symbol=${token.symbol}`}>去质押</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyStakingPanel;
