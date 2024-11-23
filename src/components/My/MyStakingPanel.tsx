import React, { useContext } from 'react';
import { useAccount } from 'wagmi';
import { TokenContext } from '@/src/contexts/TokenContext';
import { formatTokenAmount } from '@/src/lib/format';
import Loading from '@/src/components/Common/Loading';

import { useAccountStakeStatus } from '@/src/hooks/contracts/useLOVE20Stake';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const MyStakingPanel: React.FC = () => {
  const { token } = useContext(TokenContext) || {};
  const { address } = useAccount();

  const {
    govVotes,
    stAmount,
    isPending: isPendingAccountStakeStatus,
    error: errorAccountStakeStatus,
  } = useAccountStakeStatus((token?.address as `0x${string}`) || '', (address as `0x${string}`) || '');

  if (!token) {
    return '';
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white  mt-4">
      <div className="flex w-full justify-center space-x-20">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">我的治理票数</span>
          <span className="text-2xl font-bold text-orange-400">
            {isPendingAccountStakeStatus ? <Loading /> : formatTokenAmount(govVotes || BigInt(0))}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500">我的质押数</span>
          <span className="text-2xl font-bold text-orange-400">
            {isPendingAccountStakeStatus ? <Loading /> : formatTokenAmount(stAmount || BigInt(0))}
          </span>
        </div>
      </div>

      <Link href={`/${token.symbol}/gov/stake`} className="w-1/2">
        <Button className="w-full bg-blue-600 hover:bg-blue-700">去质押</Button>
      </Link>
    </div>
  );
};

export default MyStakingPanel;
